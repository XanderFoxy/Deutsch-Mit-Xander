/* =====================================================================
   KRIPPE — lebensgroße Weihnachtskrippe im Stall aus rohem Holz
   ---------------------------------------------------------------------
   XANDER: „Ich möchte einen Liebreiz zur Weihnachtsdeko … dieses
   Weihnachtsdorf … mit Schmücken, mit Schnee" · „Das soll keine Comic
   Grafik sein. Das soll noch viel mehr am Realismus dran sein." ·
   „Man soll sie in jedem Winkel aufstellen können. Man soll das
   Fundament sehen beim Aufbauen." · „dass wir das später in einen
   Frühlingsgewand packen können."

   (Die gemeinsame Drechselbank und Figurenwerkstatt folgen unten.)
   ===================================================================== */

/* ===== DRECHSELBANK-ANFANG ===== */
/* =====================================================================
   DRECHSELBANK — ein kleines 3D-Werkzeug für runde, gedrechselte und
   geschnitzte Dinge (Säulen, Figuren, Tiere, Pferde, Kerzen, Räder).
   ---------------------------------------------------------------------
   Der Kern kann ebene Flächen perfekt. Eine Weihnachtspyramide, ein
   Karussell und eine Krippe bestehen aber aus Rundem: gedrechselte
   Säulen, geschnitzte Figuren, Holzpferde. Dieses Werkzeug zeichnet
   solche Körper in jedem Drehwinkel richtig:
     • Ellipsoide (Köpfe, Leiber, Wolle) werden im Bild zu Ellipsen –
       genau gerechnet – und mit dem Licht des Kerns schattiert
       (hell zur Sonne, dunkel abgewandt, Rückstrahlung vom Schnee),
     • Kapseln und Kegelstümpfe (Arme, Beine, Gewänder, Säulen) als
       Hülle ihrer Endkreise, quer schattiert wie echte Zylinder,
     • ebene Flächen mit eigener Bemalung (wie im Kern),
     • alles lässt sich auch als Schatten auf den Boden legen oder als
       reine Silhouette (für Masken) malen.
   Dieselbe Werkstatt steht wortgleich in pyramide.js, krippe.js und
   karussell.js; wer zuerst lädt, meldet sie an (ST.drechsel).
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const VERSION = 2;
  if (ST.drechsel && ST.drechsel.version >= VERSION) return;
  const KX = ST.KX, KY = ST.KY, KZ = ST.KZ, LI = ST.LICHT, E = ST.ZUM_AUGE;
  const SX = -LI[0] / LI[2], SY = -LI[1] / LI[2];
  /* Bild-rechts und Bild-unten als Richtungen im Kameraraum (mit E eine Orthonormalbasis) */
  const RC = [Math.SQRT1_2, -Math.SQRT1_2, 0];
  const DC = [KY, KY, -KZ];
  const RUECK_W = [0.20, 0.21, 0.23], RUECK_S = [0.08, 0.10, 0.06];
  const TAU = Math.PI * 2;

  /* ---------------- Vektoren ---------------- */
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const kreuz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const laenge = (a) => Math.hypot(a[0], a[1], a[2]);
  const nrm = (a) => { const l = laenge(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const mix = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  /* zwei Richtungen senkrecht zu d */
  function quer(d) {
    const h = Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
    const a = nrm(kreuz(d, h)), b = kreuz(d, a);
    return [a, b];
  }

  /* =====================================================================
     ANSICHT — wie ein Modellpunkt ins Bild kommt (und wie hell er ist)
     o: s (Pixel/m), gier (Grad) oder c/sn, tx/ty (Bildpunkt des Ursprungs
        bzw. des Ankers), anker (Modellpunkt, der auf tx/ty liegt),
        schatten (auf den Boden gelegt), silhouette (nur schwarz),
        Z (Tageszeit), jahr
     ===================================================================== */
  function Ansicht(o) {
    const s = o.s;
    let c = o.c, sn = o.sn;
    if (c == null) { const r = (o.gier || 0) * Math.PI / 180; c = Math.cos(r); sn = Math.sin(r); }
    this.s = s; this.c = c; this.sn = sn;
    const J = [(c - sn) * KX * s, (-sn - c) * KX * s, 0, (c + sn) * KY * s, (c - sn) * KY * s, -KZ * s];
    const an = o.anker || [0, 0, 0];
    this.tx = (o.tx || 0) - (J[0] * an[0] + J[1] * an[1] + J[2] * an[2]);
    this.ty = (o.ty || 0) - (J[3] * an[0] + J[4] * an[1] + J[5] * an[2]);
    if (o.schatten) { J[2] = (SX - SY) * KX * s; J[5] = (SX + SY) * KY * s; }
    this.J = J;
    this.schatten = !!o.schatten;
    this.silhouette = !!(o.schatten || o.silhouette);
    this.Z = o.Z || ST.ZEITEN.tag;
    this.jahr = o.jahr || "winter";
    this.winter = this.jahr === "winter";
    this.nacht = this.Z.nacht || 0;
    this.sk = 1;            // Sonnenanteil (0 = im Schatten, z. B. unter dem Stalldach)
    this.ak = 1;            // Himmelslicht
    this.warm = null;       // warmes Kunstlicht [r,g,b] (schon mit Nacht verrechnet)
    this.warmDir = null;    // Richtung zum Kunstlicht (Kameraraum) oder null = rundum
    this.fein = 1;          // Detailfaktor
  }
  const AP = Ansicht.prototype;
  AP.bild = function (p) { const J = this.J; return [J[0] * p[0] + J[1] * p[1] + J[2] * p[2] + this.tx, J[3] * p[0] + J[4] * p[1] + J[5] * p[2] + this.ty]; };
  AP.vek = function (v) { const J = this.J; return [J[0] * v[0] + J[1] * v[1] + J[2] * v[2], J[3] * v[0] + J[4] * v[1] + J[5] * v[2]]; };
  AP.kam = function (v) { return [v[0] * this.c - v[1] * this.sn, v[0] * this.sn + v[1] * this.c, v[2]]; };
  AP.tief = function (p) { const k = this.kam(p); return k[0] * E[0] + k[1] * E[1] + k[2] * E[2]; };
  AP.zumAuge = function (n) { return dot(this.kam(n), E); };
  /* Lichtfaktor je Farbkanal für eine Normale im Kameraraum (wie kern.js,
     dazu Sonnenanteil und warmes Kunstlicht) */
  AP.lf = function (n) {
    const Z = this.Z;
    const k = Math.max(0, n[0] * LI[0] + n[1] * LI[1] + n[2] * LI[2]) * this.sk;
    const up = Math.max(0, n[2]);
    const oben = (0.82 + 0.18 * up) * this.ak;
    const seit = Math.max(0, 1 - Math.abs(n[2]) - up * 0.5);
    const hell = Z.amb[1] + Z.sonne[1] * 0.6;
    const r = this.winter ? RUECK_W : RUECK_S;
    let w = null;
    if (this.warm) { const kk = this.warmDir ? 0.25 + 0.75 * Math.max(0, dot(n, this.warmDir)) : 0.7; w = this.warm; w = [w[0] * kk, w[1] * kk, w[2] * kk]; }
    const f = [0, 0, 0];
    for (let i = 0; i < 3; i++) f[i] = Math.min(w ? 1.3 : 1, Z.amb[i] * oben + Z.sonne[i] * k * 1.35 + r[i] * seit * hell + (w ? w[i] : 0));
    return f;
  };
  const HALB = nrm(add(LI, E));
  AP.farbeK = function (c, n, a, glanz) {
    if (this.silhouette) return "#000";
    const f = this.lf(n);
    if (glanz) {
      const sp = glanz * Math.pow(Math.max(0, dot(n, HALB)), 18) * this.sk;
      for (let i = 0; i < 3; i++) f[i] += sp * (this.Z.sonne[i] * 2.2 + 0.12);
    }
    const r = Math.min(255, c[0] * f[0]) | 0, g = Math.min(255, c[1] * f[1]) | 0, b = Math.min(255, c[2] * f[2]) | 0;
    return a == null ? "rgb(" + r + "," + g + "," + b + ")" : "rgba(" + r + "," + g + "," + b + "," + a + ")";
  };
  AP.farbe = function (c, nModell, a) { return this.farbeK(c, nrm(this.kam(nModell)), a); };
  /* dieselbe Farbe als Zahlen (für Verläufe, die gemischt werden) */
  AP.farbeZ = function (c, n, glanz) {
    const f = this.lf(n);
    if (glanz) {
      const sp = glanz * Math.pow(Math.max(0, dot(n, HALB)), 18) * this.sk;
      for (let i = 0; i < 3; i++) f[i] += sp * (this.Z.sonne[i] * 2.2 + 0.12);
    }
    return [Math.min(255, c[0] * f[0]), Math.min(255, c[1] * f[1]), Math.min(255, c[2] * f[2])];
  };

  /* ---------------- 2D-Hilfen ---------------- */
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
  function pfad(g, p) { g.beginPath(); g.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]); g.closePath(); }
  /* Ellipse aus einem Mittelpunkt und bis zu drei Halbachsen (Modell) */
  function ellipseBild(A, c, a1, a2, a3) {
    const C = A.bild(c), v1 = A.vek(a1), v2 = A.vek(a2), v3 = a3 ? A.vek(a3) : [0, 0];
    const a = v1[0] * v1[0] + v2[0] * v2[0] + v3[0] * v3[0];
    const b = v1[0] * v1[1] + v2[0] * v2[1] + v3[0] * v3[1];
    const d = v1[1] * v1[1] + v2[1] * v2[1] + v3[1] * v3[1];
    const m = (a + d) / 2, q = Math.sqrt(((a - d) / 2) * ((a - d) / 2) + b * b);
    return { x: C[0], y: C[1], r1: Math.sqrt(m + q), r2: Math.sqrt(Math.max(0, m - q)), th: 0.5 * Math.atan2(2 * b, a - d) };
  }

  /* Kugel-Schattierung im Einheitskreis einer Bildellipse (Drehung th) */
  function kugelVerlauf(g, A, farbe, th, weich) {
    const ct = Math.cos(th), st = Math.sin(th);
    const lx = dot(LI, RC), ly = dot(LI, DC);
    const px = ct * lx + st * ly, py = -st * lx + ct * ly;
    const pl = Math.hypot(px, py) || 1;
    const R = 1 + pl;
    const gr = g.createRadialGradient(px, py, 0, px, py, R);
    const stufen = weich ? [0, 0.3, 0.55, 0.8, 1] : [0, 0.22, 0.45, 0.65, 0.82, 1];
    for (const t of stufen) {
      let qx = px - (px / pl) * R * t, qy = py - (py / pl) * R * t;
      let q2 = qx * qx + qy * qy;
      if (q2 > 1) { const k = 1 / Math.sqrt(q2); qx *= k; qy *= k; q2 = 1; }
      const w = Math.sqrt(1 - q2);
      const sx = ct * qx - st * qy, sy = st * qx + ct * qy;
      const n = [sx * RC[0] + sy * DC[0] + w * E[0], sx * RC[1] + sy * DC[1] + w * E[1], sx * RC[2] + sy * DC[2] + w * E[2]];
      gr.addColorStop(t, A.farbeK(farbe, n));
    }
    return gr;
  }
  function rgbS(c, a) { return a == null ? "rgb(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + ")" : "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + a + ")"; }

  /* =====================================================================
     GRUNDKÖRPER (alle Maße in Modellmetern)
     ===================================================================== */
  /* Ellipsoid: Mitte c, Halbachsen a1, a2, a3 (Vektoren).
     o.glanz (0…1): Lackglanz, o.wolle: Schafwolle, o.flach: Aufkleber
     (flache Scheibe, a3 = Normale), o.leucht: selbstleuchtend */
  function ellipsoid(g, A, c, a1, a2, a3, farbe, o) {
    o = o || {};
    if (o.flach) {
      const n = nrm(a3);
      if (A.zumAuge(n) <= 0.02 && !o.beidseitig) return;
    }
    const e = ellipseBild(A, c, a1, a2, o.flach ? null : a3);
    if (e.r1 < 0.35) return;
    const r2 = Math.max(e.r2, 0.35);
    if (A.silhouette) { g.fillStyle = "#000"; g.beginPath(); g.ellipse(e.x, e.y, e.r1, r2, e.th, 0, TAU); g.fill(); return; }
    if (o.flach || o.einfarbig || e.r1 < 1.6) {
      const n = o.flach ? nrm(A.kam(a3)) : nrm(add(A.kam([0, 0, 0.6]), E));
      g.fillStyle = o.leucht ? rgbS(farbe) : A.farbeK(farbe, n);
      g.beginPath(); g.ellipse(e.x, e.y, e.r1, r2, e.th, 0, TAU); g.fill();
      return;
    }
    g.save();
    g.translate(e.x, e.y); g.rotate(e.th); g.scale(e.r1, r2);
    g.fillStyle = o.leucht ? rgbS(farbe) : kugelVerlauf(g, A, farbe, e.th, o.weich);
    g.beginPath(); g.arc(0, 0, 1, 0, TAU); g.fill();
    if (o.wolle && e.r1 > 5) wolleMalen(g, A, farbe, e, o);
    if (o.glanz && e.r1 > 3) {
      const ct = Math.cos(e.th), st = Math.sin(e.th);
      const H = nrm(add(LI, E));
      const hx = dot(H, RC), hy = dot(H, DC);
      const px = (ct * hx + st * hy) * 0.8, py = (-st * hx + ct * hy) * 0.8;
      const k = o.glanz * (0.25 + 0.75 * (A.Z.sonne[1] / 0.36)) * A.sk;
      const gr = g.createRadialGradient(px, py, 0, px, py, 0.42);
      gr.addColorStop(0, "rgba(255,252,240," + (0.55 * k).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,252,240,0)");
      g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 1, 0, TAU); g.fill();
    }
    g.restore();
  }
  /* Wolle: Löckchen im Einheitskreis, am Rand kleine Buckel */
  function wolleMalen(g, A, farbe, e, o) {
    const rng = ST.zufall(o.saat || 11);
    const px = e.r1;                       // Pixel je Einheit (grob)
    /* Buckelrand: kleine Wollbüschel ragen über den Umriss */
    const nb = Math.min(30, Math.max(12, Math.round(px * 0.55)));
    g.beginPath();
    for (let i = 0; i < nb; i++) {
      const w = (i + rng() * 0.5) / nb * TAU, rr = 0.08 + rng() * 0.07;
      const x = Math.cos(w) * (0.95 - rr * 0.4), y = Math.sin(w) * (0.95 - rr * 0.4);
      g.moveTo(x + rr, y); g.arc(x, y, rr, 0, TAU);
    }
    g.fill();
    /* Vlies: viele kurze, unregelmäßige Löckchen, wenig Kontrast – eher
       Struktur als Zeichen */
    const n = Math.min(160, Math.round(px * 2.2));
    const hellN = nrm(add(LI, E)), dunkN = nrm(sub(E, mul(LI, 0.4)));
    const hell = A.farbeK(farbe, hellN, 0.32), dunkel = A.farbeK(mix(farbe, [70, 64, 56], 0.3), dunkN, 0.3);
    g.lineWidth = Math.max(0.025, 1.1 / px);
    for (const [farb, teil] of [[dunkel, 0.6], [hell, 0.4]]) {
      g.strokeStyle = farb; g.beginPath();
      for (let i = 0; i < n * teil; i++) {
        const w = rng() * TAU, r = Math.sqrt(rng()) * 0.9;
        const x = Math.cos(w) * r, y = Math.sin(w) * r, rr = (0.035 + rng() * 0.05) * Math.max(0.6, 20 / Math.max(20, px));
        const a0 = rng() * TAU, a1 = a0 + 1.5 + rng() * 2;
        g.moveTo(x + Math.cos(a0) * rr, y + Math.sin(a0) * rr); g.arc(x, y, rr, a0, a1);
      }
      g.stroke();
    }
  }

  /* Kapsel (Arme, Beine, Hälse): Kugeln an beiden Enden, dazwischen der Mantel */
  function kapsel(g, A, p0, p1, r0, r1, farbe, o) {
    o = o || {};
    const S0 = A.bild(p0), S1 = A.bild(p1), R0 = Math.max(0.3, r0 * A.s), R1 = Math.max(0.3, r1 * A.s);
    const dx = S1[0] - S0[0], dy = S1[1] - S0[1], D = Math.hypot(dx, dy);
    g.beginPath();
    if (D <= Math.abs(R0 - R1) + 0.01) {
      const gross = R0 > R1 ? [S0, R0] : [S1, R1];
      g.arc(gross[0][0], gross[0][1], gross[1], 0, TAU);
    } else {
      const ux = dx / D, uy = dy / D, k = (R0 - R1) / D, w = Math.sqrt(Math.max(0, 1 - k * k));
      const nA = [k * ux - w * uy, k * uy + w * ux], nB = [k * ux + w * uy, k * uy - w * ux];
      const aA = Math.atan2(nA[1], nA[0]), aB = Math.atan2(nB[1], nB[0]);
      g.moveTo(S0[0] + R0 * nA[0], S0[1] + R0 * nA[1]);
      g.lineTo(S1[0] + R1 * nA[0], S1[1] + R1 * nA[1]);
      g.arc(S1[0], S1[1], R1, aA, aB, bogenRichtung(aA, aB, ux, uy));
      g.lineTo(S0[0] + R0 * nB[0], S0[1] + R0 * nB[1]);
      g.arc(S0[0], S0[1], R0, aB, aA, bogenRichtung(aB, aA, -ux, -uy));
      g.closePath();
    }
    if (A.silhouette) { g.fillStyle = "#000"; g.fill(); return; }
    g.fillStyle = mantelVerlauf(g, A, p0, p1, S0, S1, Math.max(R0, R1), farbe, o);
    g.fill();
  }
  /* Bogen von a nach b so, dass er durch die Richtung (ux,uy) läuft */
  function bogenRichtung(a, b, ux, uy) {
    let bb = b; while (bb < a) bb += TAU;
    const m = (a + bb) / 2;
    return !(Math.cos(m) * ux + Math.sin(m) * uy > 0);
  }
  /* Querverlauf über einen runden Mantel: an den Rändern die Seiten, in
     der Mitte die dem Auge zugewandte Seite */
  function mantelVerlauf(g, A, p0, p1, S0, S1, R, farbe, o) {
    const d = nrm(A.kam(sub(p1, p0)));
    let qx = -(S1[1] - S0[1]), qy = S1[0] - S0[0];
    const ql = Math.hypot(qx, qy);
    if (ql < 1e-6) { qx = 1; qy = 0; } else { qx /= ql; qy /= ql; }
    const w = [qx * RC[0] + qy * DC[0], qx * RC[1] + qy * DC[1], qx * RC[2] + qy * DC[2]];
    const nK = nrm(sub(w, mul(d, dot(w, d))));
    const nF = nrm(sub(E, mul(d, dot(E, d))));
    const mx = (S0[0] + S1[0]) / 2, my = (S0[1] + S1[1]) / 2;
    const gr = g.createLinearGradient(mx - qx * R, my - qy * R, mx + qx * R, my + qy * R);
    const stufen = o.stufen || (o.glanz ? [0, 0.08, 0.18, 0.28, 0.38, 0.5, 0.65, 0.8, 0.92, 1] : [0, 0.12, 0.3, 0.5, 0.7, 0.88, 1]);
    const neig = o.neig || 0;   // Kegelneigung: Normale kippt entlang d
    for (const t of stufen) {
      const ct = 2 * t - 1, s2 = Math.sqrt(Math.max(0, 1 - ct * ct));
      let n = add(mul(nK, ct), mul(nF, s2));
      if (neig) n = nrm(add(mul(n, Math.cos(neig)), mul(d, Math.sin(neig))));
      gr.addColorStop(t, A.farbeK(farbe, n, null, o.glanz));
    }
    return gr;
  }

  /* Kegelstumpf mit ebenen Enden (Gewand, Säulenstück, Kerze, Stab).
     o.deckel: Farbe des sichtbaren Deckels (false = keiner),
     o.falten: Anzahl Längsfalten, o.teil: [von, bis] Winkelbereich (Halbmantel) */
  function stumpf(g, A, p0, p1, r0, r1, farbe, o, qx) {
    o = o || {};
    const ax = sub(p1, p0), L = laenge(ax);
    if (L < 1e-5) return;
    const d = mul(ax, 1 / L);
    let u1, u2;
    if (qx) { u1 = nrm(sub(qx, mul(d, dot(qx, d)))); u2 = kreuz(d, u1); } else [u1, u2] = quer(d);
    if (o.qf) u2 = mul(u2, o.qf);          // ovaler Querschnitt (Tiefe/Breite)
    const n = Math.max(10, Math.min(28, Math.round(Math.max(r0, r1) * A.s * 0.9)));
    const pts = [];
    const ring = (p, r) => { for (let i = 0; i < n; i++) { const w = i / n * TAU; pts.push(A.bild(add(p, add(mul(u1, Math.cos(w) * r), mul(u2, Math.sin(w) * r))))); } };
    ring(p0, r0); ring(p1, r1);
    const h = huelle2(pts);
    const S0 = A.bild(p0), S1 = A.bild(p1);
    pfad(g, h);
    if (A.silhouette) { g.fillStyle = "#000"; g.fill(); return; }
    const neig = Math.atan2(r0 - r1, L);
    if (o.leucht) { g.fillStyle = rgbS(farbe); g.fill(); return; }
    g.fillStyle = mantelVerlauf(g, A, p0, p1, S0, S1, Math.max(r0, r1) * A.s, farbe, { neig: neig, stufen: o.stufen, glanz: o.glanz });
    g.fill();
    if (o.naht) { g.strokeStyle = g.fillStyle; g.lineWidth = 0.8; g.stroke(); }
    if (o.textur && A.s * Math.max(r0, r1) > 22 && ST.pinsel) {
      /* bemaltes Holz: feine, unregelmäßige Farbtiefe */
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const q of h) { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); }
      g.save(); g.clip(); ST.pinsel.rauschen(g, x0, y0, x1 - x0, y1 - y0, A.s * 0.45, o.textur, 21, 4); g.restore();
    }
    if (o.falten && A.s * Math.max(r0, r1) > 6) faltenMalen(g, A, p0, p1, r0, r1, d, u1, u2, farbe, o);
    if (o.ringe) for (const rg of o.ringe) {
      /* umlaufende Linie (Borte, Gürtel) auf Höhe k (0…1) */
      const p = add(p0, mul(ax, rg.k)), r = r0 + (r1 - r0) * rg.k;
      bandMalen(g, A, p, d, u1, u2, r * 1.01, rg.b || 0.03, rg.farbe, n);
    }
    const kd = A.zumAuge(d);
    if (o.deckel !== false && Math.abs(kd) > 0.02) {
      const oben = kd > 0, p = oben ? p1 : p0, r = oben ? r1 : r0;
      if (r * A.s > 0.5) {
        const e = ellipseBild(A, p, mul(u1, r), mul(u2, r));
        g.fillStyle = o.leucht ? rgbS(o.deckel || farbe) : A.farbeK(o.deckel || farbe, nrm(A.kam(oben ? d : mul(d, -1))));
        g.beginPath(); g.ellipse(e.x, e.y, e.r1, Math.max(0.3, e.r2), e.th, 0, TAU); g.fill();
      }
    }
  }
  /* Band um einen runden Körper (nur die sichtbare Hälfte) */
  function bandMalen(g, A, p, d, u1, u2, r, b, farbe, n) {
    const oben = [], unten = [];
    const m = Math.max(12, n);
    for (let i = 0; i <= m; i++) {
      const w = i / m * TAU, rad = add(mul(u1, Math.cos(w)), mul(u2, Math.sin(w)));
      if (A.zumAuge(rad) < -0.05) { if (oben.length) break; else continue; }
      oben.push(A.bild(add(add(p, mul(rad, r)), mul(d, b / 2))));
      unten.push(A.bild(add(add(p, mul(rad, r)), mul(d, -b / 2))));
    }
    if (oben.length < 2) return;
    const pts = oben.concat(unten.reverse());
    pfad(g, pts);
    g.fillStyle = A.farbeK(farbe, nrm(add(A.kam([0, 0, 0.3]), E)));
    g.fill();
  }
  function faltenMalen(g, A, p0, p1, r0, r1, d, u1, u2, farbe, o) {
    /* Falten als weiche Bänder: Tal (dunkel, breit, sanft) und Grat (hell,
       schmal) daneben – leicht geschwungen, zum Saum hin tiefer */
    const nf = o.falten, rng = ST.zufall(o.saat || 3);
    const R = A.s * Math.max(r0, r1);
    const lang = o.faltenLang == null ? 0.85 : o.faltenLang;
    g.lineCap = "round";
    for (let i = 0; i < nf; i++) {
      const w = (i + 0.3 + rng() * 0.4) / nf * TAU;
      const rad = add(mul(u1, Math.cos(w)), mul(u2, Math.sin(w)));
      const sicht = A.zumAuge(rad);
      if (sicht < 0.08) continue;
      const nk = nrm(A.kam(rad));
      const a = A.bild(add(p0, mul(rad, r0 * 1.005))), b = A.bild(add(p1, mul(rad, r1 * 1.005)));
      const bx = a[0] + (b[0] - a[0]) * lang, by = a[1] + (b[1] - a[1]) * lang;
      const k = Math.min(1, sicht * 2), schw = (rng() - 0.5) * R * 0.12;
      const mx = (a[0] + bx) / 2 + schw, my = (a[1] + by) / 2;
      const tal = Math.max(0.8, R * (0.1 + rng() * 0.06));
      g.lineWidth = tal * 1.8;
      g.strokeStyle = A.farbeK(mix(farbe, [20, 16, 20], 0.4), nk, (0.16 * k).toFixed(3));
      g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(mx, my, bx, by); g.stroke();
      g.lineWidth = tal * 0.7;
      g.strokeStyle = A.farbeK(mix(farbe, [20, 16, 20], 0.5), nk, (0.32 * k).toFixed(3));
      g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(mx, my, bx, by); g.stroke();
      g.lineWidth = tal * 0.5;
      g.strokeStyle = A.farbeK(mix(farbe, [255, 255, 255], 0.3), nk, (0.28 * k).toFixed(3));
      const ox = tal * 0.9;
      g.beginPath(); g.moveTo(a[0] + ox, a[1]); g.quadraticCurveTo(mx + ox, my, bx + ox * 0.8, by); g.stroke();
    }
  }
  /* Linien auf einem Ellipsoid (Haarsträhnen, Bart, Wolle): kurven = Listen
     von [Azimut, Höhe] im Achsensystem a1, a2, a3; nur Sichtbares wird gezogen */
  function linienEll(g, A, c, a1, a2, a3, kurven, farbe, breite, alpha) {
    if (A.silhouette) return;
    const l1 = laenge(a1), l2 = laenge(a2), l3 = laenge(a3);
    const e1 = mul(a1, 1 / l1), e2 = mul(a2, 1 / l2), e3 = mul(a3, 1 / l3);
    g.lineWidth = Math.max(0.5, breite * A.s); g.lineCap = "round"; g.lineJoin = "round";
    for (const kv of kurven) {
      let an = false, nsum = [0, 0, 0];
      g.beginPath();
      for (const [th, ph] of kv) {
        const cp = Math.cos(ph), x = cp * Math.cos(th), y = cp * Math.sin(th), z = Math.sin(ph);
        const p = add(c, add(add(mul(a1, x * 1.01), mul(a2, y * 1.01)), mul(a3, z * 1.01)));
        const n = nrm(add(add(mul(e1, x / l1), mul(e2, y / l2)), mul(e3, z / l3)));
        const q = A.bild(p);
        if (A.zumAuge(n) > 0.06) { if (an) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); an = true; nsum = add(nsum, n); }
        else an = false;
      }
      g.strokeStyle = A.farbeK(farbe, nrm(A.kam(laenge(nsum) > 0 ? nsum : [0, 0, 1])), alpha == null ? 0.6 : alpha);
      g.stroke();
    }
  }

  /* =====================================================================
     LOFT — ein Körper aus einer Folge von Querschnitten (wie ein
     Bildhauer, der Scheibe für Scheibe schnitzt): Pferderumpf mit
     Brust, Sattellage und Kruppe, Hals, Kopf mit Ganaschen, Beine mit
     Gelenken, Gewänder mit Standbein und Faltenwurf.
     R = [{ c, a, b, w }]: Mitte, zwei Halbachsen (spannen den
     Querschnitt auf), w = Tiefe der Falten in diesem Ring (0…0,2).
     Gezeichnet als Netz kleiner Vierecke; jedes bekommt einen Verlauf
     zwischen den Lichtfarben seiner beiden Längskanten (Licht nach der
     echten Flächennormale) – runde Formen ohne Facetten und ohne
     „Luftballon"-Glanz. Die Vierecke sind um einen halben Bildpunkt
     aufgeblasen: keine hellen Haarlinien zwischen den Flächen.
     o: n (Teilung ringsum), wellen (Faltenzahl), phase, glanz,
        kappen (Enden schließen, Standard ja)
     ===================================================================== */
  function loft(g, A, R, farbe, o) {
    o = o || {};
    if (R.length < 2) return;
    let gross = 0;
    for (const r of R) gross = Math.max(gross, laenge(r.a), laenge(r.b));
    gross *= A.s;
    if (gross < 0.4) return;
    let n = o.n || 16;
    if (gross < 3) n = Math.min(n, 6); else if (gross < 8) n = Math.min(n, 10); else if (gross < 16) n = Math.min(n, 12);
    else if (gross > 30) n = Math.round(n * 1.5);
    /* nah: Zwischenringe (Catmull-Rom durch die Mitten) – keine Facetten */
    const unter = gross > 26 ? 3 : gross > 13 ? 2 : 1;
    if (unter > 1 && R.length > 1) {
      const RR = [], L = R.length;
      const cr = (p0, p1, p2, p3, t) => { const t2 = t * t, t3 = t2 * t; return [0, 1, 2].map((i) => 0.5 * (2 * p1[i] + (-p0[i] + p2[i]) * t + (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 + (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3)); };
      for (let j = 0; j < L - 1; j++) {
        const q0 = R[Math.max(0, j - 1)], q1 = R[j], q2 = R[j + 1], q3 = R[Math.min(L - 1, j + 2)];
        for (let k = 0; k < unter; k++) {
          const t = k / unter;
          RR.push({ c: cr(q0.c, q1.c, q2.c, q3.c, t), a: mix(q1.a, q2.a, t), b: mix(q1.b, q2.b, t), w: (q1.w || 0) * (1 - t) + (q2.w || 0) * t, ph: (q1.ph || 0) * (1 - t) + (q2.ph || 0) * t });
        }
      }
      RR.push(R[L - 1]);
      if (o.farbeRing) { const fr = []; for (let j = 0; j < L - 1; j++) for (let k = 0; k < unter; k++) fr.push(o.farbeRing[j]); fr.push(o.farbeRing[L - 1]); o = Object.assign({}, o, { farbeRing: fr }); }
      R = RR;
    }
    const m = R.length;
    const wel = o.wellen || 0, ph = o.phase || 0;
    const P = [], S = [];
    for (let j = 0; j < m; j++) {
      const r = R[j], ring = [], bild = [];
      for (let i = 0; i < n; i++) {
        const t = i / n * TAU + ph;
        const f = 1 + (r.w || 0) * Math.cos(wel * t + (r.ph || 0));
        const p = add(r.c, add(mul(r.a, Math.cos(t) * f), mul(r.b, Math.sin(t) * f)));
        ring.push(p); bild.push(A.bild(p));
      }
      P.push(ring); S.push(bild);
    }
    /* Umlaufsinn: zeigt kreuz(ringsum, längs) nach außen? (einmal bestimmen) */
    const jm = Math.floor((m - 1) / 2);
    const dm = sub(R[jm + 1].c, R[jm].c);
    const sg = dot(dm, kreuz(R[jm].a, R[jm].b)) >= 0 ? 1 : -1;
    const sil = A.silhouette;
    const gl = o.glanz || 0;
    /* Farben je Eckpunkt */
    const C = [];
    if (!sil) for (let j = 0; j < m; j++) {
      const cr = [];
      for (let i = 0; i < n; i++) {
        const lang = sub(P[Math.min(m - 1, j + 1)][i], P[Math.max(0, j - 1)][i]);
        const rund = sub(P[j][(i + 1) % n], P[j][(i + n - 1) % n]);
        let nv = kreuz(rund, lang);
        if (laenge(nv) < 1e-9) nv = sub(P[j][i], R[j].c); else nv = mul(nv, sg);
        cr.push(A.farbeZ(o.farbeRing ? o.farbeRing[j] : farbe, nrm(A.kam(nrm(nv))), gl));
      }
      C.push(cr);
    }
    const stuecke = [];
    for (let j = 0; j < m - 1; j++) {
      for (let i = 0; i < n; i++) {
        const i1 = (i + 1) % n;
        const q = [P[j][i], P[j][i1], P[j + 1][i1], P[j + 1][i]];
        const nf = mul(kreuz(sub(q[1], q[3]), sub(q[2], q[0])), sg);
        const nl = laenge(nf);
        if (nl < 1e-12) continue;
        if (A.zumAuge(mul(nf, 1 / nl)) < -0.03) continue;
        stuecke.push({ z: A.tief(mul(add(add(q[0], q[1]), add(q[2], q[3])), 0.25)), j: j, i: i, i1: i1 });
      }
    }
    /* Kappen an offenen Enden */
    const kappen = [];
    if (o.kappen !== false) for (const [j, vz] of [[0, -1], [m - 1, 1]]) {
      const r = R[j];
      if (Math.min(laenge(r.a), laenge(r.b)) * A.s < 0.8) continue;
      const d = nrm(sub(R[j === 0 ? 1 : m - 2].c, r.c));
      const nk = mul(d, -1);
      void vz;
      if (A.zumAuge(nk) <= 0.01) continue;
      kappen.push({ z: A.tief(r.c) + 0.001, j: j, n: nk });
    }
    const alle = stuecke.concat(kappen).sort((x, y) => x.z - y.z);
    if (sil) {
      g.fillStyle = "#000"; g.beginPath();
      for (const e of alle) {
        if (e.n) { const ring = S[e.j]; g.moveTo(ring[0][0], ring[0][1]); for (let i = 1; i < n; i++) g.lineTo(ring[i][0], ring[i][1]); g.closePath(); continue; }
        const a = S[e.j][e.i], b = S[e.j][e.i1], c = S[e.j + 1][e.i1], d = S[e.j + 1][e.i];
        g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(c[0], c[1]); g.lineTo(d[0], d[1]); g.closePath();
      }
      g.fill("nonzero");
      return;
    }
    const auf = 0.45;
    for (const e of alle) {
      if (e.n) {
        const ring = S[e.j];
        pfad(g, ring);
        g.fillStyle = rgbS(A.farbeZ(o.farbeRing ? o.farbeRing[e.j] : farbe, nrm(A.kam(e.n)), gl));
        g.fill();
        continue;
      }
      const a = S[e.j][e.i], b = S[e.j][e.i1], c = S[e.j + 1][e.i1], d = S[e.j + 1][e.i];
      const mx = (a[0] + b[0] + c[0] + d[0]) / 4, my = (a[1] + b[1] + c[1] + d[1]) / 4;
      const ecke = (p) => { const dx = p[0] - mx, dy = p[1] - my, l = Math.hypot(dx, dy) || 1; return [p[0] + dx / l * auf, p[1] + dy / l * auf]; };
      const A2 = ecke(a), B2 = ecke(b), C2 = ecke(c), D2 = ecke(d);
      const c0 = C[e.j][e.i], c1 = C[e.j + 1][e.i], c2 = C[e.j][e.i1], c3 = C[e.j + 1][e.i1];
      const fL = [(c0[0] + c1[0]) / 2, (c0[1] + c1[1]) / 2, (c0[2] + c1[2]) / 2];
      const fR = [(c2[0] + c3[0]) / 2, (c2[1] + c3[1]) / 2, (c2[2] + c3[2]) / 2];
      g.beginPath(); g.moveTo(A2[0], A2[1]); g.lineTo(B2[0], B2[1]); g.lineTo(C2[0], C2[1]); g.lineTo(D2[0], D2[1]); g.closePath();
      const lx = (a[0] + d[0]) / 2, ly = (a[1] + d[1]) / 2, rx = (b[0] + c[0]) / 2, ry = (b[1] + c[1]) / 2;
      if (Math.abs(fL[0] - fR[0]) + Math.abs(fL[1] - fR[1]) + Math.abs(fL[2] - fR[2]) < 6 || Math.hypot(rx - lx, ry - ly) < 1.5) {
        g.fillStyle = rgbS([(fL[0] + fR[0]) / 2, (fL[1] + fR[1]) / 2, (fL[2] + fR[2]) / 2]);
      } else {
        const gr = g.createLinearGradient(lx, ly, rx, ry);
        gr.addColorStop(0, rgbS(fL)); gr.addColorStop(1, rgbS(fR));
        g.fillStyle = gr;
      }
      g.fill();
    }
  }

  /* Querschnitte entlang eines Linienzugs (für Rohr-Lofts) */
  function rohrRinge(pts, radien, o) {
    o = o || {};
    const seite = o.seite || [1, 0, 0], R = [];
    for (let j = 0; j < pts.length; j++) {
      const d = nrm(sub(pts[Math.min(pts.length - 1, j + 1)], pts[Math.max(0, j - 1)]));
      let a = sub(seite, mul(d, dot(seite, d)));
      if (laenge(a) < 1e-3) a = quer(d)[0];
      a = nrm(a);
      const b = kreuz(d, a), r = radien[j];
      const ra = Array.isArray(r) ? r[0] : r, rb = Array.isArray(r) ? r[1] : r;
      R.push({ c: pts[j], a: mul(a, ra), b: mul(b, rb), w: o.w ? o.w[j] : 0, ph: o.ph ? o.ph[j] : 0 });
    }
    return R;
  }

  /* ---------------- Schnee ----------------
     XANDER: „ohne Pixelkanten und komische Vektorrückstände" – Schnee ist
     keine glatte weiße Platte. Er hat Dicke (8–15 cm), liegt an der
     Traufe als gerundeter Wulst über, ist vom Wind zu Wehen geformt und
     lässt an dünnen Stellen den Untergrund durchschauen. */
  /* Schneedecke auf einer Fläche (Flächenkoordinaten, wird danach vom
     Licht der Fläche schattiert). o.saat, o.loecher (Zahl), o.rand
     (unregelmäßiger oberer Rand in Metern), o.dicht (Deckkraft) */
  function schneeDecke(g, F, x, y, w, h, o) {
    o = o || {};
    const rng = ST.zufall(o.saat || 7);
    const oben = [], unten = [];
    const rand = o.rand == null ? 0.08 : o.rand;
    for (let xx = x - 0.05; xx <= x + w + 0.1; xx += 0.12) oben.push([xx, y + rand * (0.3 + rng() * 0.9)]);
    g.save();
    g.beginPath();
    g.moveTo(oben[0][0], oben[0][1]);
    for (const p of oben) g.lineTo(p[0], p[1]);
    g.lineTo(x + w + 0.1, y + h + 0.1); g.lineTo(x - 0.05, y + h + 0.1); g.closePath();
    /* Dünne Stellen: schmale, in Fallrichtung gezogene Flecken, an denen
       der Untergrund durch eine dünne Schneeschicht schimmert */
    const nL = o.loecher == null ? Math.round(w * h * 0.7) : o.loecher;
    const loecher = [];
    for (let i = 0; i < nL; i++) {
      const cx = x + rng() * w, cy = y + h * (0.05 + Math.pow(rng(), 1.8) * 0.8), r = 0.025 + rng() * 0.06, ry = r * (1.4 + rng() * 1.6);
      const pl = [];
      for (let j = 0; j < 11; j++) { const a = j / 11 * TAU; const f = 0.55 + rng() * 0.7; pl.push([cx + Math.cos(a) * r * f, cy + Math.sin(a) * ry * f]); }
      loecher.push(pl);
      g.moveTo(pl[10][0], pl[10][1]); for (let j = 9; j >= 0; j--) g.lineTo(pl[j][0], pl[j][1]); g.closePath();
    }
    g.fillStyle = "rgba(247,249,253," + (o.dicht == null ? 0.97 : o.dicht) + ")";
    g.fill("evenodd");
    /* in den dünnen Stellen liegt eine lichte Schicht */
    g.fillStyle = "rgba(240,244,250,0.5)";
    g.beginPath();
    for (const pl of loecher) { g.moveTo(pl[0][0], pl[0][1]); for (let j = 1; j < pl.length; j++) g.lineTo(pl[j][0], pl[j][1]); g.closePath(); }
    g.fill();
    /* weicher Übergang: am Rand der dünnen Stelle liegt mehr Schnee als in
       der Mitte (Ring aus Außenkontur und eingezogener Kontur) – so wirkt
       der Fleck nicht wie ein ausgestanzter Farbklecks */
    g.fillStyle = "rgba(242,246,251,0.42)";
    g.beginPath();
    for (const pl of loecher) {
      let mx = 0, my = 0; for (const q of pl) { mx += q[0]; my += q[1]; } mx /= pl.length; my /= pl.length;
      g.moveTo(pl[0][0], pl[0][1]); for (let j = 1; j < pl.length; j++) g.lineTo(pl[j][0], pl[j][1]); g.closePath();
      const f = 0.62;
      g.moveTo(mx + (pl[0][0] - mx) * f, my + (pl[0][1] - my) * f);
      for (let j = pl.length - 1; j >= 1; j--) g.lineTo(mx + (pl[j][0] - mx) * f, my + (pl[j][1] - my) * f);
      g.closePath();
    }
    g.fill("evenodd");
    g.beginPath();
    g.moveTo(oben[0][0], oben[0][1]);
    for (const p of oben) g.lineTo(p[0], p[1]);
    g.lineTo(x + w + 0.1, y + h + 0.1); g.lineTo(x - 0.05, y + h + 0.1); g.closePath();
    g.clip();
    /* Wehen: weiche, bläuliche Mulden quer zur Fläche */
    for (let i = 0; i < w * 1.4 + 2; i++) {
      const cx = x + rng() * w, cy = y + h * (0.1 + rng() * 0.85), rx = 0.35 + rng() * 1.1, ry = 0.06 + rng() * 0.14;
      const gg = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
      gg.addColorStop(0, "rgba(150,172,212,0.2)"); gg.addColorStop(1, "rgba(150,172,212,0)");
      g.fillStyle = gg; g.save(); g.translate(cx, cy); g.scale(1, ry / rx); g.beginPath(); g.arc(0, 0, rx, 0, TAU); g.fill(); g.restore();
    }
    PI_rauschen(g, x, y, w, h, 1.5, 0.08, 31, 3);
    g.restore();
    /* Lochränder: Schneekante mit Dicke (heller Grat oben, Schatten unten) */
    if (F.px > 12) {
      g.save();
      g.lineWidth = Math.max(0.01, 1.2 / F.px);
      for (const pl of loecher) {
        g.strokeStyle = "rgba(130,150,186,0.3)"; g.beginPath(); for (let j = 1; j <= 5; j++) g.lineTo(pl[j][0], pl[j][1] - 0.006); g.stroke();
      }
      g.restore();
    }
    /* Glitzer */
    if (F.px > 22) {
      g.fillStyle = "rgba(255,255,255,0.95)";
      for (let i = 0; i < w * h * 5; i++) { const r = (0.6 + rng()) / F.px; g.fillRect(x + rng() * w, y + rng() * h, r, r); }
    }
  }
  function PI_rauschen(g, x, y, w, h, m, st, saat, okt) { if (ST.pinsel) ST.pinsel.rauschen(g, x, y, w, h, m, st, saat, okt); }

  /* Schneewulst entlang einer Kante (Traufe, Ortgang, Brüstung): ein
     gerundeter Loft mit unregelmäßiger Dicke, der ein wenig über die
     Kante hinaushängt. pts = Kantenpunkte (Modell), aus = Richtung nach
     außen (hängt über), r = mittlere Dicke */
  function schneeWulst(g, A, pts, aus, r, o) {
    o = o || {};
    const rng = ST.zufall(o.saat || 3);
    const P = [], rad = [];
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const f = 0.86 + rng() * 0.28, e = (i === 0 || i === n - 1) ? 0.35 : 1;
      P.push(add(pts[i], add(mul(aus, r * 0.35 * f), [0, 0, r * 0.45 * f * e])));
      rad.push([r * 0.6 * f * e, r * 0.85 * f * e]);
    }
    loft(g, A, rohrRinge(P, rad, { seite: [0, 0, 1] }), o.farbe || [246, 249, 253], { n: 10 });
  }

  /* Ebenes Vieleck (Modellpunkte), Farbe nach Normale */
  function vieleck(g, A, pts, farbe, o) {
    o = o || {};
    let n = o.n || nrm(kreuz(sub(pts[1], pts[0]), sub(pts[2], pts[0])));
    let nk = nrm(A.kam(n));
    if (dot(nk, E) <= 0.002) { if (!o.beidseitig) return; nk = mul(nk, -1); }
    pfad(g, pts.map((p) => A.bild(p)));
    g.fillStyle = A.silhouette ? "#000" : (o.leucht ? rgbS(farbe) : A.farbeK(farbe, nk));
    g.fill();
    if (o.naht && !A.silhouette) { g.strokeStyle = g.fillStyle; g.lineWidth = 0.7; g.stroke(); }
  }

  /* Bemalte ebene Fläche (wie im Kern): o = linke obere Ecke, u nach
     rechts, v nach unten (Einheitsvektoren), w × h Meter, umriss,
     malen(g, F) in Flächenkoordinaten, danach Licht (multiplizieren). */
  function flaeche(g, A, f) {
    const u = f.u, v = f.v;                 // dürfen skaliert sein (Figur verkleinert)
    const n = f.n ? nrm(f.n) : nrm(kreuz(u, v));
    let nk = nrm(A.kam(n));
    const sicht = dot(nk, E);
    if (sicht <= 0.002 && !f.beidseitig) return false;
    if (sicht <= 0.002) nk = mul(nk, -1);
    const U = A.vek(u), V = A.vek(v), O = A.bild(f.o);
    const det = U[0] * V[1] - U[1] * V[0];
    if (Math.abs(det) < 1e-6) return false;
    const um = f.umriss || [[0, 0], [f.w, 0], [f.w, f.h], [0, f.h]];
    g.save();
    g.transform(U[0], U[1], V[0], V[1], O[0], O[1]);
    const pu = Math.hypot(U[0], U[1]), pv = Math.hypot(V[0], V[1]);
    const auf = (f.auf == null ? 0.55 : f.auf) / Math.max(1e-3, Math.min(pu, pv));
    const umA = auf > 0 ? ST.aufblasen(um, auf) : um;
    pfad(g, umA);
    if (A.silhouette) { g.fillStyle = "#000"; g.fill(); g.restore(); return true; }
    g.clip();
    const F = {
      w: f.w, h: f.h, px: Math.min(pu, pv), pxU: pu, pxV: pv, n: nk, jahr: A.jahr, nacht: A.nacht, zeit: A.Z, s: A.s,
      licht: Math.max(0, dot(nk, LI)) * A.sk, rng: ST.zufall(ST.textHash((f.name || "f") + (f.saat || 1))), flaeche: f,
      lichtU: dot(LI, A.kam(nrm(u))), lichtV: dot(LI, A.kam(nrm(v))), lichtN: dot(LI, nk), A: A
    };
    F.schatten = function (d) {
      if (F.lichtN <= 0.04 || A.sk < 0.5) return null;
      let dx = -F.lichtU * d / F.lichtN, dy = -F.lichtV * d / F.lichtN;
      const l = Math.hypot(dx, dy), mx = d * 2.6;
      if (l > mx) { dx *= mx / l; dy *= mx / l; }
      return [dx, dy];
    };
    if (typeof f.malen === "function") f.malen(g, F);
    else { g.fillStyle = rgbS(f.malen || [200, 200, 200]); g.fillRect(-1, -1, f.w + 2, f.h + 2); }
    const fe = f.feld || [0, 0, f.w, f.h];
    if (!f.keinLicht) {
      const lf = A.lf(nk);
      g.globalCompositeOperation = "multiply";
      g.fillStyle = "rgb(" + Math.round(Math.min(1, lf[0]) * 255) + "," + Math.round(Math.min(1, lf[1]) * 255) + "," + Math.round(Math.min(1, lf[2]) * 255) + ")";
      g.fillRect(fe[0] - 1, fe[1] - 1, fe[2] - fe[0] + 2, fe[3] - fe[1] + 2);
      g.globalCompositeOperation = "source-over";
    }
    if (typeof f.danach === "function") f.danach(g, F);
    g.restore();
    return true;
  }

  /* Linienzug (Stab, Seil, Henkel, Stroh): breite in Metern */
  function strich(g, A, pts, breite, farbe, o) {
    o = o || {};
    const b = Math.max(o.min || 0.5, breite * A.s);
    g.lineWidth = b; g.lineCap = o.kappe || "round"; g.lineJoin = "round";
    g.strokeStyle = A.silhouette ? "#000" : (o.leucht ? rgbS(farbe) : A.farbeK(farbe, nrm(add(E, [0, 0, 0.35]))));
    g.beginPath();
    pts.forEach((p, i) => { const q = A.bild(p); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); });
    g.stroke();
  }

  /* Kerzenflamme: selbstleuchtend, leicht flackernd (fl 0…1) */
  function flamme(g, A, p, h, fl) {
    if (A.silhouette) return;
    const a = A.bild(p), H = h * A.s * KZ * (0.92 + 0.16 * (fl || 0)), b = H * 0.34;
    if (H < 0.8) { g.fillStyle = "rgba(255,226,150,0.95)"; g.fillRect(a[0] - 0.5, a[1] - 1, 1, 1); return; }
    const sw = ((fl || 0) - 0.5) * b * 0.4;
    const gr = g.createRadialGradient(a[0], a[1] - H * 0.28, 0, a[0], a[1] - H * 0.35, H * 0.62);
    gr.addColorStop(0, "rgba(255,255,236,1)"); gr.addColorStop(0.35, "rgba(255,226,140,0.98)"); gr.addColorStop(0.75, "rgba(255,150,50,0.85)"); gr.addColorStop(1, "rgba(220,90,30,0)");
    g.fillStyle = gr;
    g.beginPath();
    g.moveTo(a[0], a[1] + b * 0.35);
    g.bezierCurveTo(a[0] - b * 1.05, a[1] + b * 0.2, a[0] - b * 0.7, a[1] - H * 0.45, a[0] + sw, a[1] - H);
    g.bezierCurveTo(a[0] + b * 0.7, a[1] - H * 0.45, a[0] + b * 1.05, a[1] + b * 0.2, a[0], a[1] + b * 0.35);
    g.fill();
    if (H > 6) { g.fillStyle = "rgba(90,120,220,0.45)"; g.beginPath(); g.ellipse(a[0], a[1] + b * 0.05, b * 0.35, b * 0.25, 0, 0, TAU); g.fill(); }
  }

  /* Leuchtender Punkt (Glühbirne) – Kern und weicher Hof */
  function birne(g, A, p, r, farbe, an) {
    if (A.silhouette) { g.fillStyle = "#000"; const q = A.bild(p); g.beginPath(); g.arc(q[0], q[1], Math.max(0.4, r * A.s), 0, TAU); g.fill(); return; }
    const q = A.bild(p), R = Math.max(0.55, r * A.s);
    if (an > 0.02) {
      g.fillStyle = "rgba(" + farbe + "," + Math.min(1, 0.55 + 0.45 * an).toFixed(3) + ")";
      g.beginPath(); g.arc(q[0], q[1], R, 0, TAU); g.fill();
      if (R > 1.2) { g.fillStyle = "rgba(255,255,245," + (0.9 * an).toFixed(3) + ")"; g.beginPath(); g.arc(q[0] - R * 0.2, q[1] - R * 0.25, R * 0.45, 0, TAU); g.fill(); }
    } else {
      g.fillStyle = A.farbeK([236, 226, 200], nrm(add(E, [0, 0, 0.4])));
      g.beginPath(); g.arc(q[0], q[1], R, 0, TAU); g.fill();
      if (R > 1.5) { g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.arc(q[0] - R * 0.3, q[1] - R * 0.3, R * 0.35, 0, TAU); g.fill(); }
    }
  }

  /* Waagerechter Ring (Krone, Kranz, Reif) als zwei Halbbögen */
  function ring(g, A, c, r, b, farbe, haelfte) {
    const e = ellipseBild(A, c, [r, 0, 0], [0, r, 0]);
    if (e.r1 < 0.5) return;
    /* vordere Hälfte = die Seite des Bogens zum Betrachter (Bild unten) */
    const vorn = haelfte === "vorn";
    g.lineWidth = Math.max(0.6, b * A.s);
    g.strokeStyle = A.silhouette ? "#000" : A.farbeK(farbe, nrm(add(E, [0, 0, vorn ? 0.1 : 0.4])));
    g.beginPath();
    if (haelfte == null) g.ellipse(e.x, e.y, e.r1, Math.max(0.3, e.r2), e.th, 0, TAU);
    else { const a0 = vorn ? 0 : Math.PI; g.ellipse(e.x, e.y, e.r1, Math.max(0.3, e.r2), e.th, a0, a0 + Math.PI); }
    g.stroke();
  }

  /* =====================================================================
     FIGUR — eine Sammlung von Grundkörpern im eigenen Raum
     (x = rechts der Figur, y = Blickrichtung, z = oben, Fuß auf 0,0,0).
     Beim Zeichnen gedreht (phi), verschoben (p), skaliert (k) und nach
     Tiefe sortiert. b = Tiefenzuschlag, falls die Mitte täuscht.
     ===================================================================== */
  function Figur() { this.t = []; }
  const FP = Figur.prototype;
  FP.ell = function (c, rx, ry, rz, farbe, o) { this.t.push({ a: "e", c: c, a1: [rx, 0, 0], a2: [0, ry, 0], a3: [0, 0, rz], f: farbe, o: o || {} }); return this; };
  FP.ellA = function (c, a1, a2, a3, farbe, o) { this.t.push({ a: "e", c: c, a1: a1, a2: a2, a3: a3, f: farbe, o: o || {} }); return this; };
  /* Ellipsoid entlang einer Richtung: Länge rl, Breite rb, Höhe rh */
  FP.ellR = function (c, dir, rl, rb, rh, farbe, o) {
    const d = nrm(dir), up0 = Math.abs(d[2]) > 0.95 ? [0, 1, 0] : [0, 0, 1];
    const b = nrm(kreuz(d, up0)), h = kreuz(b, d);
    return this.ellA(c, mul(d, rl), mul(b, rb), mul(h, rh), farbe, o);
  };
  FP.kap = function (p0, p1, r0, r1, farbe, o) { this.t.push({ a: "k", p0: p0, p1: p1, r0: r0, r1: r1, f: farbe, o: o || {} }); return this; };
  FP.zyl = function (p0, p1, r0, r1, farbe, o) { this.t.push({ a: "z", p0: p0, p1: p1, r0: r0, r1: r1, f: farbe, o: o || {} }); return this; };
  FP.poly = function (pts, farbe, o) { this.t.push({ a: "p", pts: pts, f: farbe, o: o || {} }); return this; };
  FP.strich = function (pts, breite, farbe, o) { this.t.push({ a: "s", pts: pts, br: breite, f: farbe, o: o || {} }); return this; };
  FP.flamme = function (p, h, o) { this.t.push({ a: "f", p: p, h: h, o: o || {} }); return this; };
  FP.flaeche = function (f) { this.t.push({ a: "F", fl: f, o: f }); return this; };
  FP.ring = function (c, r, b, farbe, o) { this.t.push({ a: "r", c: c, r: r, b: b, f: farbe, o: o || {} }); return this; };
  FP.birne = function (p, r, farbe, o) { this.t.push({ a: "b", p: p, r: r, f: farbe, o: o || {} }); return this; };
  /* Loft (siehe oben) und Rohr: ein Loft entlang eines Linienzugs mit
     Radien je Punkt (Zahl oder [seitlich, quer]) – Beine, Hälse, Schweife */
  FP.loft = function (R, farbe, o) { this.t.push({ a: "L", R: R, f: farbe, o: o || {} }); return this; };
  FP.rohr = function (pts, radien, farbe, o) { return this.loft(rohrRinge(pts, radien, o || {}), farbe, o || {}); };
  FP.linien = function (c, a1, a2, a3, kurven, farbe, breite, o) { this.t.push({ a: "l", c: c, a1: a1, a2: a2, a3: a3, kv: kurven, f: farbe, br: breite, o: Object.assign({ nurBild: true }, o || {}) }); return this; };
  /* eigene Zeichnung (fn(g, A, T) mit T = Umrechnung Figur → Modell) */
  FP.eigen = function (c, fn, o) { this.t.push({ a: "x", c: c, fn: fn, o: o || {} }); return this; };
  FP.dazu = function (fig, p, phi, k) {
    /* andere Figur einbauen (verschoben, gedreht, skaliert) */
    const T = umrechnung(p || [0, 0, 0], phi || 0, k || 1);
    for (const t of fig.t) this.t.push(teilUmrechnen(t, T));
    return this;
  };
  /* andere Figur um einen Drehpunkt kippen: nicken (vor, +), neigen
     (seitlich, + = nach rechts), drehen (um die Hochachse) – für den
     geneigten Kopf, der zum Kind schaut */
  FP.dazuGekippt = function (fig, dreh, nicken, neigen, drehen) {
    const a = -(nicken || 0), b = neigen || 0, c = drehen || 0;
    const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b), cc = Math.cos(c), sc = Math.sin(c);
    /* R = Rz(c) · Rx(a) · Ry(b) */
    const ry = (q) => [q[0] * cb + q[2] * sb, q[1], -q[0] * sb + q[2] * cb];
    const rx = (q) => [q[0], q[1] * ca - q[2] * sa, q[1] * sa + q[2] * ca];
    const rz = (q) => [q[0] * cc - q[1] * sc, q[0] * sc + q[1] * cc, q[2]];
    const R = (q) => rz(rx(ry(q)));
    const T = { p: (q) => add(dreh, R(sub(q, dreh))), v: R, k: 1, phi: c };
    for (const t of fig.t) this.t.push(teilUmrechnen(t, T));
    return this;
  };

  /* Umrechnung Figur → Modell */
  function umrechnung(p, phi, k) {
    const c = Math.cos(phi), s = Math.sin(phi);
    return {
      p: (q) => [p[0] + k * (q[0] * c - q[1] * s), p[1] + k * (q[0] * s + q[1] * c), p[2] + k * q[2]],
      v: (q) => [k * (q[0] * c - q[1] * s), k * (q[0] * s + q[1] * c), k * q[2]],
      k: k, phi: phi
    };
  }
  function teilUmrechnen(t, T) {
    const o = t.o;
    switch (t.a) {
      case "e": return { a: "e", c: T.p(t.c), a1: T.v(t.a1), a2: T.v(t.a2), a3: T.v(t.a3), f: t.f, o: o };
      case "k": return { a: "k", p0: T.p(t.p0), p1: T.p(t.p1), r0: t.r0 * T.k, r1: t.r1 * T.k, f: t.f, o: o };
      case "z": return { a: "z", p0: T.p(t.p0), p1: T.p(t.p1), r0: t.r0 * T.k, r1: t.r1 * T.k, f: t.f, o: o, qx: t.qx ? T.v(t.qx) : (o.qf ? T.v([1, 0, 0]) : null) };
      case "p": return { a: "p", pts: t.pts.map(T.p), f: t.f, o: o.n ? Object.assign({}, o, { n: T.v(o.n) }) : o };
      case "s": return { a: "s", pts: t.pts.map(T.p), br: t.br * T.k, f: t.f, o: o };
      case "f": return { a: "f", p: T.p(t.p), h: t.h * T.k, o: o };
      case "r": return { a: "r", c: T.p(t.c), r: t.r * T.k, b: t.b * T.k, f: t.f, o: o };
      case "b": return { a: "b", p: T.p(t.p), r: t.r * T.k, f: t.f, o: o };
      case "l": return { a: "l", c: T.p(t.c), a1: T.v(t.a1), a2: T.v(t.a2), a3: T.v(t.a3), kv: t.kv, f: t.f, br: t.br * T.k, o: o };
      case "F": { const f = t.fl; return { a: "F", fl: Object.assign({}, f, { o: T.p(f.o), u: T.v(f.u), v: T.v(f.v), n: f.n ? T.v(f.n) : null }), o: o }; }
      case "x": { const T0 = t.T; return { a: "x", c: T.p(t.c), fn: t.fn, T: T0 ? verketten(T, T0) : T, o: o }; }
      case "L": return { a: "L", R: t.R.map((r) => ({ c: T.p(r.c), a: T.v(r.a), b: T.v(r.b), w: r.w, ph: r.ph })), f: t.f, o: o };
    }
    return t;
  }
  function verketten(T2, T1) { return { p: (q) => T2.p(T1.p(q)), v: (q) => T2.v(T1.v(q)), k: T2.k * T1.k, phi: T2.phi + T1.phi }; }
  function mitte(t) {
    switch (t.a) {
      case "e": case "l": return t.c;
      case "k": case "z": return mul(add(t.p0, t.p1), 0.5);
      case "p": { let m = [0, 0, 0]; for (const p of t.pts) m = add(m, p); return mul(m, 1 / t.pts.length); }
      case "s": return t.pts[Math.floor(t.pts.length / 2)];
      case "f": case "b": return t.p;
      case "r": return t.c;
      case "F": { const f = t.fl; return add(f.o, add(mul(f.u, f.w / 2), mul(f.v, f.h / 2))); }
      case "x": return t.c;
      case "L": { let m = [0, 0, 0]; for (const r of t.R) m = add(m, r.c); return mul(m, 1 / t.R.length); }
    }
    return [0, 0, 0];
  }
  function teilZeichnen(g, A, t, zeit) {
    const o = t.o;
    if (A.silhouette && (o.keinSchatten || (A.schatten && o.keinBodenschatten))) return;
    switch (t.a) {
      case "e": ellipsoid(g, A, t.c, t.a1, t.a2, t.a3, t.f, o); break;
      case "k": kapsel(g, A, t.p0, t.p1, t.r0, t.r1, t.f, o); break;
      case "z": stumpf(g, A, t.p0, t.p1, t.r0, t.r1, t.f, o, t.qx); break;
      case "p": vieleck(g, A, t.pts, t.f, o); break;
      case "s": strich(g, A, t.pts, t.br, t.f, o); break;
      case "f": if (!A.silhouette) flamme(g, A, t.p, t.h, zeit != null ? 0.5 + 0.5 * Math.sin(zeit * 11 + t.p[0] * 7) : 0.5); break;
      case "r": ring(g, A, t.c, t.r, t.b, t.f, o.haelfte); break;
      case "b": birne(g, A, t.p, t.r, t.f, o.an == null ? A.nacht : o.an); break;
      case "l": linienEll(g, A, t.c, t.a1, t.a2, t.a3, t.kv, t.f, t.br, o.alpha); break;
      case "F": flaeche(g, A, t.fl); break;
      case "x": t.fn(g, A, t.T || null); break;
      case "L": loft(g, A, t.R, t.f, o); break;
    }
  }
  /* Figur zeichnen: pl = { p, phi (Bogenmaß), k, sk, warm, warmDir } */
  function figurZeichnen(g, A, fig, pl, zeit) {
    pl = pl || {};
    const T = umrechnung(pl.p || [0, 0, 0], pl.phi || 0, pl.k || 1);
    const liste = [];
    const minPx = 0.45;
    for (const t0 of fig.t) {
      const t = teilUmrechnen(t0, T);
      if (t.o.ab && A.s * T.k < t.o.ab) continue;          // Detail erst ab dieser Pixeldichte
      if (t.o.bis && A.s * T.k >= t.o.bis) continue;       // Ersatzform nur bis zu dieser Pixeldichte
      if (A.silhouette && t.o.nurBild) continue;
      liste.push({ t: t, z: A.tief(mitte(t)) + (t.o.b || 0) * T.k });
      void minPx;
    }
    liste.sort((a, b) => a.z - b.z);
    const sk = A.sk, warm = A.warm, wd = A.warmDir;
    if (pl.sk != null) A.sk = pl.sk;
    if (pl.warm) { A.warm = pl.warm; A.warmDir = pl.warmDir ? nrm(A.kam(pl.warmDir)) : null; }
    for (const e of liste) teilZeichnen(g, A, e.t, zeit);
    A.sk = sk; A.warm = warm; A.warmDir = wd;
  }

  /* Schatten in einen Zwischenpuffer malen und EINMAL auf die Schattenebene
     legen: der Kern hat dort einen Weichzeichner eingestellt, der sonst für
     jeden einzelnen Grundkörper neu rechnen müsste (sehr langsam). */
  function schattenPuffer(g, fn) {
    const m = g.getTransform();
    const c = document.createElement("canvas"); c.width = g.canvas.width; c.height = g.canvas.height;
    const h = c.getContext("2d", { willReadFrequently: true });           // CPU-Rasterer (siehe weichMalen)
    h.setTransform(1, 0, 0, 1, m.e, m.f);
    fn(h);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(c, 0, 0); g.restore();
    c.width = c.height = 0;
  }

  /* ---------------- Platz für den Bodenschatten ----------------
     kern.js rechnet nur die Schatten von Teilen in die Grenzen des
     Sprites ein, nicht die Schatten von M.figur. Ohne Vorsorge schneidet
     die Spritekante den Schatten eines 12 m hohen Bauwerks gerade ab
     (senkrechte und waagerechte Kanten im Schnee). Deshalb legt jedes
     Modell eine UNSICHTBARE Bodenfläche genau dorthin, wohin sein
     Schatten fällt: Hülle aller Querschnittskreise (Höhe z, Radius r),
     jeder um z entlang des Lichts versetzt. Das Licht steht im
     Kameraraum fest; in Modellkoordinaten hängt die Richtung vom
     Drehwinkel ab (Objekt + Kameradrehung, genau wie szene.js rechnet).
     Vorschaubilder der Bauleiste (ohne Objekt) zeigen keinen Schatten
     und bekommen deshalb keine Fläche – sie blieben sonst winzig. */
  function schattenRaum(M, o, profil) {
    if (!o || !o.objekt) return;
    const gier = ((o.objekt.gier || 0) + ((ST.kamera && ST.kamera.dreh) || 0) * 90) * Math.PI / 180;
    const c = Math.cos(gier), sn = Math.sin(gier);
    const pts = [];
    for (const [z, r] of profil) {
      const mx = SX * z, my = SY * z;
      for (let i = 0; i < 20; i++) { const w = i / 20 * TAU; pts.push([mx + Math.cos(w) * r * 1.03, my + Math.sin(w) * r * 1.03]); }
    }
    const um = huelle2(pts).map(([x, y]) => [x * c + y * sn, -x * sn + y * c]);
    M.flaeche({ name: "schattenraum", o: [0, 0, 0], u: [1, 0, 0], v: [0, 1, 0], w: 1, h: 1, umriss: um, malen: null, keinLicht: true, keinAo: true });
  }

  /* ---------------- Figurenbilder im Speicher ----------------
     Die Kamera ist orthografisch: Wie eine Figur aussieht, hängt nur von
     ihrer Drehung zur Kamera, dem Maßstab und dem Licht ab – nicht vom
     Ort. Für bewegte Figuren (Pyramidenteller, Karussell) wird deshalb
     jede Figur in 60 Drehstufen (6°) einmal gemalt und danach nur noch
     verschoben. Speicher begrenzt, älteste Bilder fliegen zuerst raus. */
  let figurNr = 1;
  const BILDER = new Map();
  let bilderPx = 0;
  const STUFEN = 60;
  /* Speichergrenze wächst mit der Pixeldichte (Retina: gleiche Figuren,
     mehr Bildpunkte), aber gedeckelt, damit ein Telefon nicht überläuft */
  const bilderMax = () => 24e6 * Math.max(1, Math.min(2.25, (ST.kamera && ST.kamera.dpr) || 1));
  /* Bildzähler: alles, was im laufenden Bild schon benutzt wurde, darf
     beim Aufräumen NICHT gelöscht werden (sonst malt drawImage ein Bild
     der Breite 0 → InvalidStateError, der Rest des Bildes fehlt) */
  let bildNr = 0, letzterStempel = null, neuMs = 0;
  function bildZaehlen(jetzt) {
    const st = jetzt != null ? jetzt : (ST.jetzt != null ? ST.jetzt : -1);
    if (st !== letzterStempel || st === -1) { letzterStempel = st; bildNr++; neuMs = 0; }
    return bildNr;
  }
  /* Neu malen je Bild höchstens so lange; danach nimmt eine Figur die
     nächstgelegene schon gemalte Drehstufe (6° daneben sieht niemand) */
  const NEU_BUDGET_MS = 9;
  function umfang(fig) {
    if (fig._umfang) return fig._umfang;
    let r = 0.05, z0 = 0, z1 = 0.1;
    const nimm = (p, e) => { r = Math.max(r, Math.hypot(p[0], p[1]) + e); z0 = Math.min(z0, p[2] - e); z1 = Math.max(z1, p[2] + e); };
    for (const t of fig.t) {
      switch (t.a) {
        case "e": nimm(t.c, Math.max(laenge(t.a1), laenge(t.a2), laenge(t.a3))); break;
        case "k": case "z": nimm(t.p0, Math.max(t.r0, t.r1)); nimm(t.p1, Math.max(t.r0, t.r1)); break;
        case "p": case "s": for (const q of t.pts) nimm(q, (t.br || 0) + 0.01); break;
        case "f": nimm(t.p, 0.05); nimm(add(t.p, [0, 0, t.h * 1.2]), 0.05); break;
        case "r": nimm(t.c, t.r + t.b); break;
        case "b": nimm(t.p, t.r * 2); break;
        case "l": nimm(t.c, Math.max(laenge(t.a1), laenge(t.a2), laenge(t.a3))); break;
        case "F": { const f = t.fl; for (const q of (f.umriss || [[0, 0], [f.w, 0], [f.w, f.h], [0, f.h]])) nimm(add(f.o, add(mul(f.u, q[0]), mul(f.v, q[1]))), 0.01); break; }
        case "L": for (const q of t.R) nimm(q.c, Math.max(laenge(q.a), laenge(q.b)) * (1 + (q.w || 0))); break;
        default: nimm(t.c || [0, 0, 0], 0.3);
      }
    }
    return (fig._umfang = { r: r + 0.02, z0: z0 - 0.02, z1: z1 + 0.05 });
  }
  function aufraeumen(schonen) {
    const grenze = bilderMax() * 0.6;
    const alle = [...BILDER.entries()].sort((a, b) => a[1].zuletzt - b[1].zuletzt);
    for (const [k, b] of alle) {
      if (bilderPx < grenze) break;
      if (b.zuletzt >= schonen) continue;           // in diesem Bild schon gemalt: bleibt
      BILDER.delete(k); bilderPx -= b.px; b.c.width = b.c.height = 0;
    }
  }
  /* Figur an Ort und Stelle (A = Ansicht der Zeichenfläche) aus dem Speicher malen.
     pl.sBild: Maßstab, in dem das Bild gemalt wird (Standard: A.s). Beim
     Zoomen mit zwei Fingern bleibt sBild beim Maßstab des Sprites und das
     Figurenbild wird wie das Sprite gestreckt (k = A.s / sBild) – so wird
     nicht jedes Bild jede Figur neu gemalt. */
  /* Sprite auf einer Software-Leinwand malen und einmal hineinkopieren.
     Ein Modell besteht aus Hunderten Pfaden mit Verläufen und Ausschnitten.
     Ohne Grafikkarten-Rasterung (SwiftShader, gesperrte Treiber) arbeitet
     der GPU-Canvas jeden Pfad einzeln und sehr langsam ab; der CPU-Rasterer
     (willReadFrequently) schafft dasselbe in einem Bruchteil der Zeit
     (Pyramide bei s=40: 1,2–1,6 s → 0,16–0,24 s). Das Bild bleibt gleich,
     nur die Kantenglättung kann um einen Hauch abweichen. */
  function weichMalen(g, fn) {
    const c = g.canvas, W = c && c.width, H = c && c.height;
    if (typeof document === "undefined" || !(W > 0 && H > 0) || W * H > 16e6) { fn(g); return; }
    const h = document.createElement("canvas"); h.width = W; h.height = H;
    const hg = h.getContext("2d", { willReadFrequently: true });
    hg.setTransform(g.getTransform());
    hg.globalAlpha = g.globalAlpha;
    fn(hg);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = "source-over"; g.drawImage(h, 0, 0); g.restore();
    h.width = h.height = 0;
  }
  /* Dasselbe für das, was sich jedes Bild bewegt (M.lebendig): nur der
     Ausschnitt box = [x0, y0, x1, y1] (Koordinaten von g) wird auf einer
     wiederverwendeten CPU-Leinwand gemalt und einmal hineinkopiert.
     Additives Licht (Schein) gehört NICHT hinein – das muss direkt auf die
     Szene, sonst wird aus „heller machen" ein halbdurchsichtiger Fleck. */
  function weichLeben(g, box, speicher, fn) {
    const m = g.getTransform(), c0 = g.canvas;
    if (typeof document === "undefined" || !c0 || m.b || m.c) { fn(g); return; }
    const X0 = Math.max(0, Math.floor(m.a * box[0] + m.e) - 2), Y0 = Math.max(0, Math.floor(m.d * box[1] + m.f) - 2);
    const X1 = Math.min(c0.width, Math.ceil(m.a * box[2] + m.e) + 2), Y1 = Math.min(c0.height, Math.ceil(m.d * box[3] + m.f) + 2);
    const w = X1 - X0, h = Y1 - Y0;
    if (w <= 0 || h <= 0) return;
    let c = speicher.leinwand;
    if (!c) c = speicher.leinwand = document.createElement("canvas");
    const hg = c.getContext("2d", { willReadFrequently: true });
    if (c.width < w || c.height < h || c.width > w * 1.5 + 64 || c.height > h * 1.5 + 64) { c.width = w; c.height = h; }
    else { hg.setTransform(1, 0, 0, 1, 0, 0); hg.clearRect(0, 0, w, h); }
    hg.setTransform(m.a, 0, 0, m.d, m.e - X0, m.f - Y0);
    hg.save(); hg.beginPath(); hg.rect((X0 - m.e) / m.a, (Y0 - m.f) / m.d, w / m.a, h / m.d); hg.clip();
    fn(hg);
    hg.restore();
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(c, 0, 0, w, h, X0, Y0, w, h); g.restore();
  }
  function figurBild(g, A, fig, pl, jetzt) {
    if (!fig.nr) fig.nr = figurNr++;
    const nr = bildZaehlen(jetzt);
    const k = pl.k || 1, U = umfang(fig);
    const sB = (pl.sBild || A.s) * k;
    let f = A.s * k / sB;
    if (Math.abs(f - 1) < 0.004) f = 1;          // Sprite-Stufen (0,1 %) nicht strecken
    const W = g.canvas.width, H = g.canvas.height;
    const P = A.bild(pl.p || [0, 0, 0]);
    const rx = U.r * sB + 3, hoch = (U.z1 * ST.KZ + U.r * 0.5) * sB + 3, tief = (U.r * 0.5 - U.z0 * ST.KZ) * sB + 3;
    const m = g.getTransform();
    const gx = m.a * P[0] + m.e, gy = m.d * P[1] + m.f;
    if (gx + rx * f < 0 || gx - rx * f > W || gy + tief * f < 0 || gy - hoch * f > H) return;       // nicht im Bild
    const psi = Math.atan2(A.sn, A.c) + (pl.phi || 0);
    let st = Math.round(psi / (Math.PI * 2) * STUFEN) % STUFEN; if (st < 0) st += STUFEN;
    const w = pl.warm ? pl.warm.map((x) => x.toFixed(2)).join(",") : "";
    const rest = "|" + sB.toFixed(2) + "|" + A.Z.name + "|" + A.jahr + "|" + w + "|" + (pl.sk == null ? 1 : pl.sk.toFixed(2)) + "|" + (pl.ak == null ? 1 : pl.ak.toFixed(2));
    let b = BILDER.get(fig.nr + "|" + st + rest);
    if (!b && neuMs > NEU_BUDGET_MS) {
      /* Zeitbudget dieses Bildes verbraucht: nächste schon gemalte Stufe */
      for (let d = 1; d <= 4 && !b; d++) b = BILDER.get(fig.nr + "|" + ((st + d) % STUFEN) + rest) || BILDER.get(fig.nr + "|" + ((st - d + STUFEN) % STUFEN) + rest);
    }
    if (!b) {
      const t0 = performance.now();
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.ceil(2 * rx)); c.height = Math.max(1, Math.ceil(hoch + tief));
      const cg = c.getContext("2d", { willReadFrequently: true });        // CPU-Rasterer (siehe weichMalen)
      const w2 = st / STUFEN * Math.PI * 2;
      const AB = new Ansicht({ s: sB, c: Math.cos(w2), sn: Math.sin(w2), tx: rx, ty: hoch, Z: A.Z, jahr: A.jahr });
      if (pl.ak != null) AB.ak = pl.ak;
      figurZeichnen(cg, AB, fig, { p: [0, 0, 0], phi: 0, k: 1, sk: pl.sk, warm: pl.warm, warmDir: pl.warmDir || null }, null);
      b = { c: c, ox: rx, oy: hoch, zuletzt: nr, px: c.width * c.height };
      BILDER.set(fig.nr + "|" + st + rest, b); bilderPx += b.px;
      if (bilderPx > bilderMax()) aufraeumen(nr);
      neuMs += performance.now() - t0;
    }
    b.zuletzt = nr;
    if (!(b.c.width > 0 && b.c.height > 0)) return;
    if (f === 1) g.drawImage(b.c, P[0] - b.ox, P[1] - b.oy);
    else g.drawImage(b.c, P[0] - b.ox * f, P[1] - b.oy * f, b.c.width * f, b.c.height * f);
  }

  /* Stückliste: beliebige Zeichenaufgaben nach Tiefe sortiert */
  function Stuecke() { this.l = []; }
  Stuecke.prototype.dazu = function (tief, fn) { this.l.push({ z: tief, fn: fn }); };
  Stuecke.prototype.malen = function () { this.l.sort((a, b) => a.z - b.z); for (const e of this.l) e.fn(); this.l = []; };

  ST.drechsel = {
    version: VERSION,
    Ansicht: Ansicht, Figur: Figur, Stuecke: Stuecke,
    ellipsoid: ellipsoid, kapsel: kapsel, stumpf: stumpf, vieleck: vieleck, flaeche: flaeche, strich: strich, loft: loft,
    rohrRinge: rohrRinge, schneeDecke: schneeDecke, schneeWulst: schneeWulst, weichMalen: weichMalen, weichLeben: weichLeben,
    flamme: flamme, birne: birne, ring: ring, figurZeichnen: figurZeichnen, teilZeichnen: teilZeichnen, figurBild: figurBild, umfang: umfang,
    ellipseBild: ellipseBild, huelle2: huelle2, schattenPuffer: schattenPuffer, schattenRaum: schattenRaum, linienEll: linienEll, pfad: pfad, umrechnung: umrechnung, rgbS: rgbS,
    v: { add: add, sub: sub, mul: mul, dot: dot, kreuz: kreuz, nrm: nrm, laenge: laenge, mix: mix, quer: quer },
    RC: RC, DC: DC, SX: SX, SY: SY
  };
})();
/* ===== DRECHSELBANK-ENDE ===== */

/* ===== FIGURENWERKSTATT-ANFANG ===== */
/* =====================================================================
   FIGURENWERKSTATT — geschnitzte Menschen und Tiere
   ---------------------------------------------------------------------
   XANDER: „Das soll keine Comic Grafik sein. Das soll noch viel mehr am
   Realismus dran sein."
   Deshalb echte Proportionen (Kopf ≈ 1/7,5 der Körperhöhe, Schultern
   ≈ 2 Kopfbreiten), Gewänder mit Falten, gedeckte Naturfarben, Gesichter
   nur angedeutet (wie bei geschnitzten Krippenfiguren), Tiere mit
   richtigem Körperbau. Alles aus Grundkörpern der Drechselbank – dadurch
   stimmen Licht und Umriss in jedem Winkel.
   Figurraum: x = rechte Hand, y = Blickrichtung, z = oben, Füße auf 0.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const VERSION = 2;
  if (ST.figuren && ST.figuren.version >= VERSION) return;
  const D = ST.drechsel, Figur = D.Figur;
  const { add, mul, nrm, mix, laenge } = D.v;

  const HAUT = [[226, 184, 154], [214, 168, 134], [196, 146, 110], [122, 84, 60]];

  /* ---------------- Menschen ----------------
     o.h: Körperhöhe (stehend), o.pose: "stehen"|"knien",
     o.arme: "haengen"|"beten"|"stab"|"laterne"|"geschenk"|"kerzen"|"posaune"|"lamm"|"haeckel"|"krippe",
     Farben: haut, haar, bart, gewand, mantel, borte, kopf, kopfFarbe, beine */
  function mensch(o) {
    const F = new Figur();
    const k = (o.h || 1.75) / 1.75;
    const P = (x, y, z) => [x * k, y * k, z * k];
    const knien = o.pose === "knien";
    const dz = knien ? -0.52 : 0;            // Oberkörper tiefer
    const haut = o.haut || HAUT[0];
    const gew = o.gewand || [120, 90, 70];
    const man = o.mantel;
    const bor = o.borte;
    /* Standbein und Spielbein (Kontrapost): die Hüfte schiebt sich über das
       Standbein und steht dort höher, die Schultern kippen gegenläufig –
       so steht eine geschnitzte Figur, nie stocksteif wie ein Zylinder */
    const sb = o.standbein || 1;
    const R = (z, rx, ry, cx, cy, kippX, kippY, w, ph) => ({ c: P(cx, cy, z), a: [rx * k, 0, (kippX || 0) * k], b: [0, ry * k, (kippY || 0) * k], w: w || 0, ph: ph || 0 });
    /* Oberkörper von der Taille bis zum Halsansatz (für alle Haltungen gleich) */
    const oben = (z0) => [
      R(z0 + 1.0, 0.168, 0.12, sb * 0.02, 0, sb * 0.012, 0, 0.012),
      R(z0 + 1.13, 0.168, 0.12, sb * 0.01, 0.004, 0, 0, 0.008),
      R(z0 + 1.26, 0.182, 0.126, 0, 0.01, 0, 0, 0.006),
      R(z0 + 1.35, 0.196, 0.12, -sb * 0.004, 0.004, -sb * 0.012, 0, 0),
      R(z0 + 1.415, 0.172, 0.1, -sb * 0.004, -0.004, -sb * 0.014, 0, 0),
      R(z0 + 1.465, 0.07, 0.066, 0, 0.004, 0, 0, 0)
    ];
    const QF = 0.8;
    if (knien) {
      /* kniend: Knie vorn auf dem Boden, Unterschenkel liegen nach hinten,
         das Gewand bauscht sich über dem Schoß, der Mantel fällt hinten auf
         den Boden und breitet sich aus */
      F.zyl(P(0, 0.02, 0.5), P(0, 0.26, 0.1), 0.16 * k, 0.17 * k, mix(gew, [0, 0, 0], 0.08), { deckel: mix(gew, [0, 0, 0], 0.15), qf: 0.85, falten: 5, saat: 6, textur: 0.14, b: -0.01 });
      F.ellR(P(0, -0.2, 0.08), [0, 1, 0], 0.22 * k, 0.2 * k, 0.08 * k, mix(gew, [0, 0, 0], 0.12), { b: -0.04 });
      F.loft([R(0.02, 0.25, 0.2, 0, 0, 0, 0, 0.06), R(0.25, 0.22, 0.17, 0, 0.01, 0, 0, 0.04), R(0.47, 0.172, 0.125, 0, 0.02, 0, 0, 0.015)].concat(oben(dz).slice(1)), gew, { wellen: 8, n: 18 });
      for (const sx of [-1, 1]) F.ellR(P(sx * 0.075, -0.37, 0.03), [0, 1, -0.3], 0.07 * k, 0.038 * k, 0.03 * k, o.schuhe || [120, 92, 66], { b: -0.06 });
    } else if (o.beine) {
      /* sichtbare Hosenbeine (Bergmann): Oberschenkel, Knie, Wade, Knöchel */
      for (const sx of [-1, 1]) {
        const vor = sx === -sb ? 0.04 : 0;      // Spielbein leicht vor
        F.rohr([P(sx * 0.095, 0, 0.92), P(sx * 0.1, 0.01 + vor, 0.66), P(sx * 0.1, 0.03 + vor, 0.48), P(sx * 0.095, 0.02 + vor * 0.5, 0.26), P(sx * 0.095, 0.02, 0.1)], [0.08 * k, 0.07 * k, 0.058 * k, 0.05 * k, 0.04 * k], o.beine, { n: 10 });
        F.ellR(P(sx * 0.095, 0.07 + vor * 0.5, 0.045), [0, 1, 0], 0.12 * k, 0.052 * k, 0.045 * k, o.schuhe || [34, 28, 26], { glanz: 0.3 });
      }
      F.loft([R(0.66, 0.205, 0.15, 0, 0, 0, 0.01, 0.025), R(0.8, 0.19, 0.135, sb * 0.01, 0, 0, 0, 0.02), R(0.92, 0.175, 0.125, sb * 0.018, 0, sb * 0.01, 0, 0.012)].concat(oben(0)), gew, { wellen: 7, n: 18 });
    } else {
      for (const sx of [-1, 1]) F.ellR(P(sx * 0.085, 0.15 + (sx === -sb ? 0.04 : 0), 0.035), [0, 1, 0], 0.095 * k, 0.045 * k, 0.035 * k, o.schuhe || [84, 60, 42], { b: -0.03 });
      /* Gewand: vom Saum bis zum Halsansatz ein Stück, Falten fallen vom
         Gürtel zum Saum tiefer, der Saum steigt über dem Spielbein an */
      const unten = [
        R(0.02, 0.245, 0.2, sb * 0.006, 0.012, -sb * 0.02, 0.014, 0.075),
        R(0.2, 0.226, 0.18, sb * 0.008, 0.012, 0, 0, 0.06),
        R(0.48, 0.203, 0.156, sb * 0.012, 0.02, 0, 0, 0.042),
        R(0.78, 0.186, 0.135, sb * 0.016, 0.006, 0, 0, 0.026)
      ];
      F.loft(unten.concat(oben(0)), gew, { wellen: 9, n: 20 });
      /* das Knie des Spielbeins zeichnet sich unter dem Stoff ab */
      F.ellR(P(-sb * 0.085, 0.1, 0.52), [0, 0.3, 1], 0.14 * k, 0.07 * k, 0.07 * k, gew, { b: 0.01 });
      if (bor) F.loft([R(0.018, 0.25, 0.205, sb * 0.006, 0.012, -sb * 0.02, 0.014, 0.075), R(0.07, 0.244, 0.2, sb * 0.006, 0.012, -sb * 0.02, 0.014, 0.072)], bor, { wellen: 9, n: 20, kappen: false, b: 0.001 });
    }
    if (o.schuerze && !knien) {
      /* Schürze: leicht gewölbtes Tuch vorn über dem Gewand */
      const sp = [];
      for (let i = 0; i <= 6; i++) { const w = -0.9 + i * 0.3; sp.push([Math.sin(w), Math.cos(w)]); }
      for (let i = 0; i < 6; i++) {
        const [a, b] = [sp[i], sp[i + 1]];
        F.poly([P(a[0] * 0.18, a[1] * 0.135 + 0.008, 1.0), P(b[0] * 0.18, b[1] * 0.135 + 0.008, 1.0), P(b[0] * 0.235, b[1] * 0.195, 0.35), P(a[0] * 0.235, a[1] * 0.195, 0.35)], o.schuerze, { b: 0.03, naht: true });
      }
    }
    if (o.kordel && !knien) F.zyl(P(sb * 0.02, 0, 0.97), P(sb * 0.02, 0, 1.03), 0.172 * k, 0.172 * k, o.kordel, { deckel: false, qf: 0.72, b: 0.005 });
    /* Mantel (offen, hängt hinter dem Gewand; von hinten sieht man nur ihn) */
    if (man) {
      if (knien) {
        F.loft([R(0.03, 0.31, 0.24, 0, -0.08, 0, 0, 0.08), R(0.45, 0.24, 0.17, 0, -0.06, 0, 0, 0.05), R(0.75, 0.21, 0.13, 0, -0.045, 0, 0, 0.02), R(0.9, 0.2, 0.12, 0, -0.035, 0, 0, 0.01)], man, { wellen: 7, n: 18, b: -0.07 });
        F.ellR(P(0, -0.3, 0.03), [0, 1, 0], 0.32 * k, 0.33 * k, 0.035 * k, mix(man, [0, 0, 0], 0.08), { b: -0.12 });
      } else {
        F.loft([R(0.03, 0.275, 0.215, 0, -0.06, -sb * 0.01, 0, 0.085, 0.4), R(0.4, 0.245, 0.18, sb * 0.01, -0.05, 0, 0, 0.06, 0.4), R(0.9, 0.215, 0.145, sb * 0.018, -0.04, 0, 0, 0.03, 0.4), R(1.25, 0.2, 0.135, 0, -0.03, 0, 0, 0.01, 0.4), R(1.42, 0.2, 0.115, 0, -0.025, -sb * 0.014, 0, 0, 0.4)], man, { wellen: 7, n: 18, b: -0.05 });
        if (bor) F.loft([R(0.028, 0.278, 0.218, 0, -0.06, -sb * 0.01, 0, 0.085, 0.4), R(0.075, 0.276, 0.216, 0, -0.06, -sb * 0.01, 0, 0.085, 0.4)], bor, { wellen: 7, n: 18, kappen: false, b: -0.049 });
      }
    }
    /* Schulterlinie (Mantel deckt Schultern und Rücken) */
    const vor = knien ? 0.03 : 0;
    if (man) F.ellA(P(0, vor - 0.03, 1.385 + dz), [0.205 * k, 0, -sb * 0.012 * k], [0, 0.115 * k, 0], [0, 0, 0.06 * k], man, { b: -0.02 });
    if (o.kragen) F.zyl(P(0, vor - 0.01, 1.49 + dz), P(0, vor - 0.01, 1.3 + dz), 0.12 * k, 0.26 * k, o.kragen, { deckel: false, qf: 0.72, b: 0.02, falten: 6, faltenLang: 1 });
    if (o.knoepfe) for (let i = 0; i < 5; i++) F.ellA(P(0, vor + 0.124, 1.06 + i * 0.065 + dz), [0.013 * k, 0, 0], [0, 0, 0.013 * k], [0, 0.005 * k, 0], o.knoepfe, { flach: true, b: 0.03, ab: 35 });
    /* Hals und Kopf – der Kopf als eigene kleine Figur, die um den
       Halswirbel nickt und sich neigt (Maria schaut zum Kind hinab) */
    F.kap(P(0, 0.0, 1.44 + dz), P(0, 0.012, 1.55 + dz), 0.052 * k, 0.047 * k, haut);
    const K = new Figur();
    kopfBauen(K, o, P, 1.645 + dz, k, haut);
    F.dazuGekippt(K, P(0, 0.012, 1.53 + dz), o.nicken || 0, (o.neigen || 0) + (o.neigen == null ? -sb * 0.06 : 0), o.kopfDreh || 0);

    /* Arme */
    armeBauen(F, o, P, dz, k, gew, man, haut, bor, sb);
    if (o.fluegel) fluegel(F, P, (z) => z + dz, k, o.fluegel);
    return F;
  }

  /* Kopf mit Gesicht, Haar, Bart und Kopfbedeckung */
  function kopfBauen(F, o, P, kz, k, haut) {
    const kopf = P(0, 0.012, kz);
    const haar = o.haar || [70, 48, 32];
    /* Haar liegt hinten und oben – vorne deckt das Gesicht */
    if (o.kopf !== "schachthut" && o.kopf !== "kapuze" && o.kopf !== "schleier") F.ell(P(0, -0.012, kz + 0.022), 0.091 * k, 0.093 * k, 0.103 * k, haar, { b: -0.004 });
    F.ell(kopf, 0.083 * k, 0.093 * k, 0.108 * k, haut, {});
    /* Gesicht – wie bei einer geschnitzten, bemalten Krippenfigur: alles
       sitzt auf der Kopfoberfläche (Normale stimmt). Augen, Brauen und
       Mund sind etwas kräftiger gefasst als in der Natur, damit man das
       Gesicht auch aus der üblichen Entfernung erkennt */
    const KR = [0.083, 0.093, 0.108], KY0 = 0.012;
    const kp = (x, zr, heraus) => {
      const t = 1 - (x / KR[0]) * (x / KR[0]) - (zr / KR[2]) * (zr / KR[2]);
      const y = KR[1] * Math.sqrt(Math.max(0, t));
      const n = nrm([x / (KR[0] * KR[0]), y / (KR[1] * KR[1]), zr / (KR[2] * KR[2])]);
      const p = [x + n[0] * (heraus || 0), KY0 + y + n[1] * (heraus || 0), kz + zr + n[2] * (heraus || 0)];
      const t1 = nrm(D.v.kreuz([0, 0, 1], n)), t2 = D.v.kreuz(n, t1);
      return { p: P(p[0], p[1], p[2]), n: n, t1: t1, t2: t2 };
    };
    const scheibe = (q, rx, rz, farbe, opt) => F.ellA(q.p, mul(q.t1, rx * k), mul(q.t2, rz * k), mul(q.n, 0.002 * k), farbe, Object.assign({ flach: true, b: 0.02 }, opt));
    const aug = o.augen || [58, 42, 32];
    /* Augenhöhlen: leichte Schattenmulde (gibt dem Gesicht Tiefe) */
    for (const sx of [-1, 1]) scheibe(kp(sx * 0.03, 0.014, 0.0005), 0.02, 0.012, mix(haut, [110, 70, 60], 0.25), { ab: 28, b: 0.018 });
    for (const sx of [-1, 1]) {
      scheibe(kp(sx * 0.03, 0.012, 0.001), 0.0125, 0.0062, [236, 230, 220], { ab: 60 });
      scheibe(kp(sx * 0.029, 0.011, 0.002), 0.0068, 0.0062, aug, { ab: 30, b: 0.021 });
      scheibe(kp(sx * 0.029, 0.011, 0.0025), 0.0026, 0.0026, [18, 14, 12], { ab: 90, b: 0.022 });
      /* Oberlid und Braue */
      const l0 = kp(sx * 0.018, 0.018, 0.002).p, l1 = kp(sx * 0.03, 0.02, 0.002).p, l2 = kp(sx * 0.043, 0.016, 0.002).p;
      F.strich([l0, l1, l2], 0.0035 * k, mix(haut, [60, 40, 30], 0.55), { b: 0.023, ab: 80 });
      const b0 = kp(sx * 0.014, 0.034, 0.003).p, b1 = kp(sx * 0.031, 0.04, 0.003).p, b2 = kp(sx * 0.049, 0.033, 0.003).p;
      F.strich([b0, b1, b2], 0.0075 * k, mix(haar, [30, 22, 16], 0.25), { b: 0.023, ab: 40 });
    }
    /* Nase mit Nasenflügeln */
    const nq = kp(0, -0.004, 0.006);
    F.ellA(nq.p, [0.012 * k, 0, 0], mul(nq.n, 0.019 * k), [0, 0.004 * k, 0.026 * k], mix(haut, [160, 100, 80], 0.12), { b: 0.03, ab: 22 });
    for (const sx of [-1, 1]) scheibe(kp(sx * 0.008, -0.026, 0.012), 0.004, 0.0025, mix(haut, [70, 40, 30], 0.6), { ab: 110, b: 0.035 });
    /* Mund: Ober- und Unterlippe */
    scheibe(kp(0, -0.045, 0.001), 0.018, 0.0045, mix(haut, [160, 70, 70], 0.45), { ab: 30 });
    scheibe(kp(0, -0.051, 0.001), 0.014, 0.0045, mix(haut, [180, 90, 90], 0.35), { ab: 70, b: 0.021 });
    F.strich([kp(-0.016, -0.047, 0.002).p, kp(0, -0.048, 0.002).p, kp(0.016, -0.047, 0.002).p], 0.0024 * k, mix(haut, [80, 30, 30], 0.6), { b: 0.024, ab: 90 });
    if (o.wangen !== false) for (const sx of [-1, 1]) scheibe(kp(sx * 0.046, -0.018, 0.001), 0.017, 0.012, mix(haut, [220, 120, 110], 0.22), { ab: 50, b: 0.015 });
    /* Ohren (wenn nichts sie bedeckt) */
    if (!o.kopf || o.kopf === "krone" || o.kopf === "filzhut" || o.kopf === "kranz" || o.kopf === "schachthut") {
      for (const sx of [-1, 1]) F.ellR(P(sx * 0.082, KY0 - 0.005, kz - 0.005), [0, 1, 0], 0.022 * k, 0.012 * k, 0.03 * k, mix(haut, [180, 110, 90], 0.12), { b: -0.002 });
    }
    /* Haarsträhnen auf der Haarkappe */
    if (o.kopf !== "schachthut" && o.kopf !== "kapuze" && o.kopf !== "schleier" && o.kopf !== "tuch") {
      const kv = [];
      for (let i = 0; i < 22; i++) { const th = -Math.PI / 2 + (i / 21 - 0.5) * 4.2; const kurv = []; for (let j = 0; j <= 6; j++) kurv.push([th + Math.sin(j * 0.7 + i) * 0.06, 1.35 - j * 0.3]); kv.push(kurv); }
      F.linien(P(0, -0.012, kz + 0.022), [0.091 * k, 0, 0], [0, 0.093 * k, 0], [0, 0, 0.103 * k], kv, mix(haar, [20, 14, 10], 0.35), 0.0035, { b: -0.0035, ab: 70 });
    }
    if (o.bart) {
      F.ellR(P(0, 0.055, kz - 0.07), [0, 0.3, -1], 0.07 * k, 0.062 * k, 0.05 * k, o.bart, { b: 0.035 });
      F.ellA(P(0, 0.094, kz - 0.028), [0.03 * k, 0, 0], [0, 0.012 * k, 0], [0, 0, 0.009 * k], o.bart, { b: 0.04, ab: 24 });
      /* Barthaare: kurze Züge vom Kinn abwärts */
      const kv = [];
      for (let i = 0; i < 16; i++) { const th = Math.PI / 2 + (i / 15 - 0.5) * 2.4; kv.push([[th, 0.7], [th + 0.05, 0.1], [th, -0.6]]); }
      const bd = nrm([0, 0.3, -1]);
      F.linien(P(0, 0.055, kz - 0.07), [0.062 * k, 0, 0], mul([0, 0.95, 0.3], 0.05 * k), mul(bd, 0.07 * k), kv, mix(o.bart, [20, 14, 10], 0.35), 0.003, { b: 0.036, ab: 70 });
    }
    kopfbedeckung(F, o, P, kz, k);
  }

  function kopfbedeckung(F, o, P, kz, k) {
    const kf = o.kopfFarbe || [240, 236, 226];
    switch (o.kopf) {
      case "schleier":
        /* Schleier/Kopftuch rahmt das Gesicht und fällt über die Schultern */
        F.ell(P(0, -0.018, kz + 0.018), 0.106 * k, 0.108 * k, 0.126 * k, kf, { b: -0.006 });
        F.zyl(P(0, -0.075, kz - 0.02), P(0, -0.1, kz - 0.36), 0.095 * k, 0.19 * k, kf, { falten: 6, deckel: false, b: -0.03, saat: 21, qf: 0.55 });
        break;
      case "kapuze":
        F.ell(P(0, -0.02, kz + 0.015), 0.112 * k, 0.112 * k, 0.13 * k, kf, { b: -0.006 });
        F.zyl(P(0, -0.05, kz - 0.03), P(0, -0.07, kz - 0.25), 0.11 * k, 0.19 * k, kf, { deckel: false, b: -0.03 });
        break;
      case "krone":
        F.zyl(P(0, 0.005, kz + 0.07), P(0, 0.005, kz + 0.135), 0.078 * k, 0.088 * k, [212, 170, 70], { deckel: [150, 40, 50], ringe: [{ k: 0.25, b: 0.012 * k, farbe: [180, 30, 40] }] });
        for (let i = 0; i < 8; i++) {
          const w = i / 8 * Math.PI * 2, c = Math.cos(w), s = Math.sin(w);
          F.kap(P(c * 0.084, 0.005 + s * 0.084, kz + 0.13), P(c * 0.09, 0.005 + s * 0.09, kz + 0.175), 0.012 * k, 0.005 * k, [226, 186, 84], { glanz: 0.6, ab: 25 });
        }
        break;
      case "turban":
        F.ell(P(0, -0.005, kz + 0.07), 0.105 * k, 0.108 * k, 0.075 * k, kf, {});
        F.ell(P(0, 0.085, kz + 0.08), 0.02 * k, 0.012 * k, 0.025 * k, [190, 40, 50], { b: 0.02, glanz: 0.8, ab: 30 });
        F.zyl(P(0, 0.0, kz + 0.1), P(0, 0.0, kz + 0.16), 0.04 * k, 0.02 * k, [212, 170, 70], { ab: 20 });
        break;
      case "filzhut":
        F.zyl(P(0, 0, kz + 0.06), P(0, 0, kz + 0.078), 0.17 * k, 0.165 * k, kf, {});
        F.zyl(P(0, 0, kz + 0.07), P(0, -0.005, kz + 0.16), 0.083 * k, 0.07 * k, kf, {});
        break;
      case "tuch":
        F.ell(P(0, -0.015, kz + 0.03), 0.1 * k, 0.103 * k, 0.11 * k, kf, { b: -0.005 });
        break;
      case "schachthut": {
        /* Bergmann: hoher schwarzer Schachthut mit Federbusch und Schlägel und Eisen */
        const sw = [30, 28, 30];
        F.ell(P(0, -0.012, kz + 0.02), 0.092 * k, 0.094 * k, 0.1 * k, [60, 44, 34], { b: -0.004 });
        F.zyl(P(0, 0, kz + 0.055), P(0, 0, kz + 0.25), 0.088 * k, 0.078 * k, sw, { deckel: [24, 22, 24], ringe: [{ k: 0.07, b: 0.02 * k, farbe: [40, 36, 40] }] });
        F.ell(P(0, 0.02, kz + 0.3), 0.045 * k, 0.045 * k, 0.07 * k, [46, 110, 58], { b: 0.01 });
        F.ellA(P(0, 0.083, kz + 0.14), [0.03 * k, 0, 0], [0, 0, 0.03 * k], [0, 0.004 * k, 0], [214, 176, 80], { flach: true, b: 0.02, ab: 35 });
        break;
      }
      case "zipfelmuetze": {
        /* rote Zipfelmütze mit weißem Pelzrand und Bommel, Spitze kippt zur Seite */
        F.ell(P(0, -0.012, kz + 0.02), 0.092 * k, 0.094 * k, 0.1 * k, o.haar || [90, 60, 40], { b: -0.004 });
        F.zyl(P(0, 0, kz + 0.06), P(0, 0, kz + 0.1), 0.098 * k, 0.098 * k, [244, 242, 236], { deckel: false, falten: 10 });
        F.zyl(P(0, 0, kz + 0.1), P(0.05, -0.03, kz + 0.25), 0.088 * k, 0.03 * k, kf, { deckel: false, falten: 5 });
        F.zyl(P(0.05, -0.03, kz + 0.25), P(0.12, -0.06, kz + 0.2), 0.03 * k, 0.012 * k, kf, { deckel: false });
        F.ell(P(0.13, -0.065, kz + 0.18), 0.03 * k, 0.03 * k, 0.03 * k, [248, 246, 240], { b: 0.02 });
        break;
      }
      case "strickmuetze":
        F.ell(P(0, -0.008, kz + 0.045), 0.098 * k, 0.1 * k, 0.085 * k, kf, {});
        F.zyl(P(0, 0, kz + 0.0), P(0, 0, kz + 0.045), 0.097 * k, 0.098 * k, D.v.mix(kf, [255, 255, 255], 0.25), { deckel: false });
        F.ell(P(0, -0.01, kz + 0.14), 0.035 * k, 0.035 * k, 0.03 * k, [236, 232, 222], {});
        break;
      case "kranz":
        F.ring(P(0, 0.005, kz + 0.075), 0.088 * k, 0.018 * k, [210, 170, 64], { haelfte: "hinten", b: -0.1 });
        F.ring(P(0, 0.005, kz + 0.075), 0.088 * k, 0.018 * k, [230, 190, 80], { haelfte: "vorn", b: 0.1 });
        break;
    }
  }

  /* Arme in verschiedenen Haltungen: Schulter → Ellenbogen → Hand */
  function armeBauen(F, o, P, dz, k, gew, man, haut, bor, sb) {
    const S = (sx) => P(sx * 0.2, -0.005, 1.405 + dz - sx * (sb || 0) * 0.012);
    const arm = (sx, ell, hand, weit, handNormale) => {
      const aer = man || gew;
      /* Ärmel als geschnitzter Stoff: Oberarm, Falten in der Armbeuge,
         zum Handgelenk hin weiter werdend (kein glattes Rohr) */
      const s0 = S(sx), m1 = mul(add(s0, ell), 0.5), m2 = mul(add(ell, hand), 0.5);
      const ende = D.v.sub(hand, mul(nrm(D.v.sub(hand, ell)), 0.01 * k));
      F.rohr([add(s0, P(0, 0, 0.012)), m1, ell, m2, ende], [0.06 * k, 0.055 * k, 0.054 * k, (weit ? 0.064 : 0.05) * k, (weit ? 0.08 : 0.049) * k], aer, { n: 10, wellen: 5, w: [0, 0.03, 0.07, 0.04, weit ? 0.08 : 0.03] });
      if (bor && weit) F.ring(ende, 0.078 * k, 0.014 * k, bor, { ab: 30 });
      handBauen(F, hand, nrm(D.v.sub(hand, ell)), sx, k, haut, handNormale);
    };
    const z = (v) => v + dz;
    const weit = !!o.weiteAermel;
    switch (o.arme) {
      case "buch": {
        /* Kurrendesänger: aufgeschlagenes Gesangbuch vor der Brust */
        for (const sx of [-1, 1]) arm(sx, P(sx * 0.21, 0.08, z(1.1)), P(sx * 0.1, 0.25, z(1.17)), weit, [sx * 0.3, -0.3, 0.9]);
        const m = P(0, 0.29, z(1.2));
        const kante = [60, 30, 26], seite = [240, 234, 214];
        for (const sx of [-1, 1]) {
          F.poly([add(m, P(0, 0, -0.005)), add(m, P(sx * 0.11, -0.03, 0.03)), add(m, P(sx * 0.11, 0.05, -0.1)), add(m, P(0, 0.08, -0.13))], kante, { beidseitig: true, b: 0.04 });
          F.poly([add(m, P(0, 0.004, 0.0)), add(m, P(sx * 0.1, -0.024, 0.034)), add(m, P(sx * 0.1, 0.052, -0.092)), add(m, P(0, 0.082, -0.122))], seite, { beidseitig: true, b: 0.045 });
        }
        break;
      }
      case "korb": {
        /* Osterkörbchen am linken Arm, rechte Hand hängt */
        arm(1, P(0.23, 0.0, z(1.13)), P(0.22, 0.05, z(0.88)), weit);
        const h = P(-0.2, 0.2, z(0.98));
        arm(-1, P(-0.25, 0.04, z(1.12)), h, weit);
        const kb = add(h, P(0, 0.05, -0.12));
        F.zyl(kb, add(kb, P(0, 0, 0.1)), 0.075 * k, 0.1 * k, [176, 132, 76], { deckel: [120, 150, 70], falten: 8, faltenLang: 1, b: 0.03 });
        const EI = [[236, 120, 140], [120, 170, 220], [240, 210, 90], [150, 200, 120], [200, 150, 220]];
        for (let i = 0; i < 5; i++) { const w = i / 5 * Math.PI * 2; F.ell(add(kb, P(Math.cos(w) * 0.045, Math.sin(w) * 0.045, 0.12)), 0.022 * k, 0.022 * k, 0.03 * k, EI[i], { glanz: 0.5, b: 0.04 }); }
        F.strich([add(kb, P(-0.09, 0, 0.1)), add(kb, P(0, 0, 0.24)), add(kb, P(0.09, 0, 0.1))], 0.012 * k, [150, 110, 64], { b: 0.035 });
        break;
      }
      case "kranz": {
        /* Frühlingsengel: Blütenkranz in beiden Händen */
        for (const sx of [-1, 1]) arm(sx, P(sx * 0.22, 0.08, z(1.1)), P(sx * 0.11, 0.24, z(1.2)), weit, [sx, 0, 0.3]);
        const m = P(0, 0.3, z(1.22));
        F.ring(m, 0.1 * k, 0.025 * k, [70, 120, 60], { b: 0.05 });
        const BL = [[240, 200, 220], [250, 246, 236], [244, 206, 90], [200, 150, 220]];
        for (let i = 0; i < 12; i++) { const w = i / 12 * Math.PI * 2; F.ell(add(m, P(Math.cos(w) * 0.1, Math.sin(w) * 0.1, 0.012)), 0.018 * k, 0.018 * k, 0.014 * k, BL[i % 4], { b: 0.06, ab: 18 }); }
        break;
      }
      case "sternstab": {
        /* Vorsänger mit dem Stern auf der Stange */
        arm(-1, P(-0.23, 0.0, z(1.13)), P(-0.22, 0.05, z(0.88)), weit);
        const h = P(0.24, 0.2, z(1.2));
        arm(1, P(0.25, 0.06, z(1.12)), h, weit);
        const unten = [h[0], h[1] + 0.02 * k, 0.02 * k], oben = add(h, P(0, 0.02, 0.8));
        F.strich([unten, oben], 0.024 * k, [110, 80, 52], { b: 0.05 });
        const st = add(oben, P(0, 0, 0.12));
        for (let i = 0; i < 6; i++) { const w = i / 6 * Math.PI * 2; F.kap(st, add(st, P(Math.cos(w) * 0.13, 0, Math.sin(w) * 0.13)), 0.035 * k, 0.004 * k, [252, 224, 140], { b: 0.06, leucht: true }); }
        F.kap(st, add(st, P(0, 0.13, 0)), 0.035 * k, 0.004 * k, [252, 224, 140], { b: 0.07 });
        F.ell(st, 0.045 * k, 0.045 * k, 0.045 * k, [255, 236, 170], { b: 0.065, leucht: true });
        break;
      }
      case "beten": {
        for (const sx of [-1, 1]) arm(sx, P(sx * 0.2, 0.06, z(1.14)), P(sx * 0.022, 0.19, z(1.27)), weit, [sx, 0, 0]);
        break;
      }
      case "krippe": {
        /* Arme leicht geöffnet nach vorn unten (zum Kind geneigt) */
        for (const sx of [-1, 1]) arm(sx, P(sx * 0.22, 0.08, z(1.13)), P(sx * 0.13, 0.27, z(1.05)), weit);
        break;
      }
      case "stab": {
        arm(-1, P(-0.23, 0.0, z(1.13)), P(-0.22, 0.05, z(0.9)), weit);
        const h = P(0.25, 0.22, z(1.25));
        arm(1, P(0.25, 0.08, z(1.13)), h, weit);
        const st = o.stab || [120, 86, 56];
        const oben = add(h, P(0.0, 0.01, 0.58)), unten = [h[0], h[1] + 0.02 * k, 0.0];
        if (o.krummstab) {
          const a = oben, b = add(a, P(0.02, 0.07, 0.1)), c = add(a, P(0.02, 0.16, 0.05)), d2 = add(a, P(0.02, 0.15, -0.04));
          F.strich([unten, a, b, c, d2], 0.028 * k, st, { b: 0.05 });
        } else F.strich([unten, oben], 0.032 * k, st, { b: 0.05 });
        break;
      }
      case "laterne": {
        arm(1, P(0.23, 0.0, z(1.13)), P(0.22, 0.05, z(0.9)), weit);
        const h = P(-0.22, 0.24, z(1.02));
        arm(-1, P(-0.24, 0.06, z(1.12)), h, weit);
        laterneAn(F, add(h, P(0, 0.035, -0.04)), k * 0.9);
        break;
      }
      case "geschenk": {
        for (const sx of [-1, 1]) arm(sx, P(sx * 0.21, 0.08, z(1.12)), P(sx * 0.1, 0.3, z(1.17)), weit);
        const g = o.gabe || "truhe", c = P(0, 0.33, z(1.2));
        if (g === "truhe") {
          F.zyl(add(c, P(0, 0, -0.06)), add(c, P(0, 0, 0.05)), 0.085 * k, 0.085 * k, [196, 150, 60], { glanz: 0.5, deckel: [224, 186, 90] });
          F.ell(add(c, P(0, 0, 0.07)), 0.05 * k, 0.05 * k, 0.03 * k, [230, 196, 100], { glanz: 0.8 });
        } else if (g === "kelch") {
          F.zyl(add(c, P(0, 0, -0.04)), add(c, P(0, 0, 0.1)), 0.035 * k, 0.07 * k, [214, 176, 80], { deckel: [240, 210, 120] });
          F.ell(add(c, P(0, 0, 0.13)), 0.045 * k, 0.045 * k, 0.035 * k, [214, 176, 80], { glanz: 0.8 });
        } else {
          F.ell(add(c, P(0, 0, 0.02)), 0.06 * k, 0.06 * k, 0.08 * k, [150, 120, 160], { glanz: 0.7 });
          F.zyl(add(c, P(0, 0, 0.08)), add(c, P(0, 0, 0.14)), 0.025 * k, 0.03 * k, [214, 176, 80], {});
        }
        break;
      }
      case "kerzen": {
        for (const sx of [-1, 1]) {
          const h = P(sx * 0.2, 0.2, z(1.16));
          arm(sx, P(sx * 0.24, 0.06, z(1.12)), h, weit);
          const kb = add(h, P(0, 0.03, 0.04));
          F.zyl(add(kb, P(0, 0, -0.02)), add(kb, P(0, 0, 0.02)), 0.05 * k, 0.05 * k, [214, 176, 80], { deckel: [226, 190, 96] });
          F.zyl(add(kb, P(0, 0, 0.02)), add(kb, P(0, 0, 0.2)), 0.02 * k, 0.02 * k, [236, 226, 206], { deckel: [246, 238, 222] });
          F.flamme(add(kb, P(0, 0, 0.205)), 0.06 * k, { b: 0.1 });
        }
        break;
      }
      case "tasse": {
        /* hält eine dampfende Glühweintasse nach vorn */
        arm(-1, P(-0.23, 0.0, z(1.13)), P(-0.22, 0.05, z(0.9)), weit);
        const h = P(0.16, 0.3, z(1.18));
        arm(1, P(0.24, 0.1, z(1.14)), h, weit);
        F.zyl(add(h, P(-0.02, 0.05, -0.02)), add(h, P(-0.02, 0.05, 0.08)), 0.04 * k, 0.045 * k, [176, 30, 36], { glanz: 0.6, deckel: [90, 30, 30] });
        break;
      }
      case "posaune": {
        const m = P(0, 0.12, z(1.6));
        arm(1, P(0.22, 0.12, z(1.25)), P(0.06, 0.32, z(1.52)), weit);
        arm(-1, P(-0.2, 0.12, z(1.25)), P(-0.02, 0.2, z(1.55)), weit);
        const ende = P(0, 0.62, z(1.66));
        F.zyl(m, add(m, P(0, 0.4, 0.05)), 0.012 * k, 0.018 * k, [214, 176, 80], { deckel: false, glanz: 0.5 });
        F.zyl(add(m, P(0, 0.38, 0.047)), ende, 0.02 * k, 0.075 * k, [224, 186, 90], { deckel: [120, 90, 40] });
        break;
      }
      case "lamm": {
        /* Hirte trägt ein Lamm auf den Schultern */
        for (const sx of [-1, 1]) arm(sx, P(sx * 0.25, 0.05, z(1.3)), P(sx * 0.18, 0.08, z(1.52)), weit);
        F.dazu(schaf({ lamm: true, liegen: true, farbe: [236, 230, 214] }), P(0, -0.02, z(1.36)), Math.PI / 2, 0.8 * k);
        break;
      }
      case "haeckel": {
        /* Bergmann: Häckel (Paradebarte) rechts, Grubenlampe links */
        const hr = P(0.24, 0.2, z(1.12));
        arm(1, P(0.25, 0.04, z(1.12)), hr, weit);
        const st = [150, 110, 70];
        F.strich([[hr[0], hr[1], 0.02 * k], add(hr, P(0, 0.01, 0.34))], 0.026 * k, st, { b: 0.05 });
        const kp = add(hr, P(0, 0.01, 0.36));
        F.poly([add(kp, P(0, -0.02, 0.02)), add(kp, P(0, 0.12, -0.02)), add(kp, P(0, 0.12, -0.08)), add(kp, P(0, -0.02, -0.04))], [180, 186, 196], { beidseitig: true, b: 0.06 });
        const hl = P(-0.22, 0.2, z(1.06));
        arm(-1, P(-0.25, 0.04, z(1.12)), hl, weit);
        grubenlampe(F, add(hl, P(0, 0.03, -0.03)), k);
        break;
      }
      default: {
        for (const sx of [-1, 1]) arm(sx, P(sx * 0.225, -0.005, z(1.13)), P(sx * 0.215, 0.05, z(0.88)), weit);
      }
    }
  }

  /* Hand: Handteller, Fingerpartie mit Fugen, Daumen (erst nah zu sehen) */
  function handBauen(F, hand, d, sx, k, haut, nh) {
    let quer = D.v.kreuz(d, [0, 0, 1]); if (laenge(quer) < 0.2) quer = [1, 0, 0]; quer = nrm(quer);
    const n = nh ? nrm(nh) : nrm(D.v.kreuz(quer, d));        // Handrücken-Normale
    const b = nrm(D.v.kreuz(n, d));
    const m = add(hand, mul(d, 0.03 * k));
    /* von weitem: eine Kugel; nah: geformte Hand */
    F.ellA(m, mul(d, 0.045 * k), mul(b, 0.034 * k), mul(n, 0.018 * k), haut, { b: 0.01, bis: 70 });
    F.ellA(m, mul(d, 0.042 * k), mul(b, 0.033 * k), mul(n, 0.016 * k), haut, { b: 0.01, ab: 70 });
    const fm = add(m, mul(d, 0.05 * k));
    F.ellA(fm, mul(d, 0.034 * k), mul(b, 0.031 * k), mul(n, 0.013 * k), haut, { b: 0.011, ab: 70 });
    for (const t of [-0.33, 0, 0.33]) F.strich([add(fm, add(mul(b, t * 0.031 * k), mul(n, 0.012 * k))), add(fm, add(add(mul(b, t * 0.031 * k), mul(d, 0.03 * k)), mul(n, 0.009 * k)))], 0.0022 * k, mix(haut, [90, 50, 40], 0.5), { b: 0.012, ab: 130 });
    const tb = add(m, mul(b, -sx * 0.032 * k));
    F.kap(tb, add(tb, add(mul(d, 0.04 * k), mul(b, -sx * 0.012 * k))), 0.011 * k, 0.009 * k, haut, { b: 0.012, ab: 70 });
  }

  function laterneAn(F, p, k) {
    /* Stalllaterne: Bügel, Dach, Glas mit Flamme, Boden */
    const P = (x, y, z) => [p[0] + x * k, p[1] + y * k, p[2] + z * k];
    const eisen = [46, 42, 40];
    F.strich([P(0, 0, 0), P(0, 0, -0.06)], 0.008 * k, eisen, {});
    F.zyl(P(0, 0, -0.06), P(0, 0, -0.1), 0.02 * k, 0.07 * k, eisen, {});
    F.zyl(P(0, 0, -0.26), P(0, 0, -0.1), 0.055 * k, 0.055 * k, [255, 214, 140], { deckel: false, leucht: true, b: 0.01 });
    F.flamme(P(0, 0, -0.22), 0.07 * k, { b: 0.03 });
    F.zyl(P(0, 0, -0.29), P(0, 0, -0.26), 0.065 * k, 0.065 * k, eisen, {});
  }
  function grubenlampe(F, p, k) {
    /* Froschlampe (Grubenlampe) aus Messing mit offener Flamme */
    const P = (x, y, z) => [p[0] + x * k, p[1] + y * k, p[2] + z * k];
    F.strich([P(0, 0, 0.05), P(0, 0.0, -0.02)], 0.01 * k, [120, 96, 50], {});
    F.ellR(P(0, 0.02, -0.06), [0, 1, 0.3], 0.07 * k, 0.045 * k, 0.04 * k, [200, 160, 70], { glanz: 0.8 });
    F.flamme(P(0, 0.08, -0.04), 0.06 * k, { b: 0.05 });
  }

  function fluegel(F, P, oz, k, farbe) {
    /* Engelsflügel: hängen hinter den Schultern, oben die kurzen
       Deckfedern in Reihen, darunter die langen Schwungfedern – als
       bemalte Fläche, leicht nach außen gestellt */
    const UM = [[0, 0.08], [0.07, -0.05], [0.19, -0.11], [0.31, -0.1], [0.41, -0.02], [0.44, 0.14], [0.42, 0.34], [0.36, 0.54], [0.28, 0.73],
      [0.24, 0.64], [0.2, 0.69], [0.16, 0.55], [0.12, 0.58], [0.09, 0.44], [0.05, 0.45], [0.02, 0.3]];
    for (const sx of [-1, 1]) {
      const u = [sx * 0.8 * k, -0.58 * k, 0.12 * k], v = [0, -0.18 * k, -0.98 * k];
      F.flaeche({
        name: "fluegel" + sx, o: P(sx * 0.07, -0.1, oz(1.5)), u: u, v: v, w: 0.45, h: 0.75, umriss: UM, beidseitig: true, b: -0.09, ab: 0,
        malen(g, Fl) {
          const c = farbe;
          const gr = g.createLinearGradient(0, -0.1, 0, 0.75);
          gr.addColorStop(0, "rgb(" + c.map((x) => Math.min(255, x + 18)).join(",") + ")");
          gr.addColorStop(1, "rgb(" + c.map((x, i) => x * [0.9, 0.84, 0.7][i]).join(",") + ")");
          g.fillStyle = gr; g.fillRect(-0.05, -0.15, 0.55, 0.95);
          if (Fl.px < 25) return;
          const dunkel = "rgba(" + c.map((x) => x * 0.55 | 0).join(",") + ",0.55)", hell = "rgba(255,255,250,0.55)";
          g.lineWidth = Math.max(0.004, 0.9 / Fl.px);
          /* Schwungfedern: lange, schmale Federn mit Kiel */
          for (let i = 0; i < 7; i++) {
            const x0 = 0.1 + i * 0.05, top = 0.18 + i * 0.01, unten = 0.46 + i * 0.04 - Math.max(0, i - 4) * 0.06;
            g.strokeStyle = dunkel; g.beginPath(); g.moveTo(x0 - 0.02, top); g.quadraticCurveTo(x0 - 0.03, (top + unten) / 2, x0 - 0.01, unten); g.stroke();
            g.strokeStyle = hell; g.beginPath(); g.moveTo(x0 + 0.005, top + 0.03); g.lineTo(x0 + 0.01, unten - 0.05); g.stroke();
          }
          /* Deckfedern: Schuppenreihen */
          for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) {
            const x = 0.05 + i * 0.065 + (r % 2) * 0.03, y = -0.02 + r * 0.075 + Math.abs(i - 3) * 0.012;
            g.strokeStyle = dunkel; g.beginPath(); g.arc(x, y, 0.035, 0.2, Math.PI - 0.2); g.stroke();
          }
        }
      });
    }
  }

  /* ---------------- Kind in der Krippe ---------------- */
  function kind(o) {
    const F = new Figur();
    const k = (o && o.k) || 1;
    const P = (x, y, z) => [x * k, y * k, z * k];
    const tuch = [238, 232, 216];
    /* gewickeltes Bündel, liegt entlang y */
    F.ellR(P(0, -0.04, 0.07), [0, 1, 0], 0.2 * k, 0.1 * k, 0.075 * k, tuch, { weich: true });
    F.strich([P(-0.09, -0.08, 0.1), P(0.09, -0.02, 0.1)], 0.01 * k, mix(tuch, [150, 130, 100], 0.4), { b: 0.02, ab: 40 });
    F.strich([P(-0.09, -0.15, 0.09), P(0.09, -0.09, 0.09)], 0.01 * k, mix(tuch, [150, 130, 100], 0.4), { b: 0.02, ab: 40 });
    F.ell(P(0, 0.17, 0.085), 0.058 * k, 0.062 * k, 0.058 * k, HAUT[0], {});
    F.ell(P(0, 0.15, 0.1), 0.06 * k, 0.05 * k, 0.05 * k, [180, 140, 100], { b: -0.01 });
    for (const sx of [-1, 1]) F.ellA(P(sx * 0.02, 0.19, 0.125), [0.007 * k, 0, 0], [0, 0.007 * k, 0], [0, 0, 0.003 * k], [70, 50, 40], { flach: true, b: 0.02, ab: 70 });
    for (const sx of [-1, 1]) F.ell(P(sx * 0.07, 0.07, 0.11), 0.022 * k, 0.022 * k, 0.022 * k, HAUT[0], { b: 0.02 });
    return F;
  }

  /* Futterkrippe: V-förmiger Trog auf gekreuzten Beinen, mit Stroh */
  function krippe(o) {
    const F = new Figur();
    const k = (o && o.k) || 1;
    const P = (x, y, z) => [x * k, y * k, z * k];
    const holz = (o && o.holz) || [132, 104, 76];
    const L = 0.5, B = 0.22, H = 0.62;
    /* Beine: je ein X an den Enden */
    for (const sy of [-1, 1]) {
      F.strich([P(-0.22, sy * (L - 0.04), 0), P(0.2, sy * (L - 0.04), H - 0.05)], 0.05 * k, holz, {});
      F.strich([P(0.22, sy * (L - 0.04), 0), P(-0.2, sy * (L - 0.04), H - 0.05)], 0.05 * k, mix(holz, [60, 50, 40], 0.2), {});
    }
    /* Trog: zwei schräge Seitenbretter und Stirnbretter */
    const zb = H - 0.22;
    for (const sx of [-1, 1]) F.poly([P(sx * 0.05, -L, zb), P(sx * 0.05, L, zb), P(sx * B, L, H), P(sx * B, -L, H)], holz, { beidseitig: true });
    for (const sy of [-1, 1]) F.poly([P(-0.05, sy * L, zb), P(0.05, sy * L, zb), P(B, sy * L, H), P(-B, sy * L, H)], mix(holz, [255, 255, 255], 0.05), { beidseitig: true, b: 0.01 });
    /* Stroh */
    F.ellR(P(0, 0, H - 0.02), [0, 1, 0], (L - 0.04) * k, (B - 0.03) * k, 0.06 * k, [214, 180, 96], { b: 0.02 });
    F.eigen(P(0, 0, H), function (g, A, T) { strohHalme(g, A, T, L * k, B * k, H * k, 40); }, { b: 0.03, nurBild: true });
    return F;
  }
  function strohHalme(g, A, T, L, B, H, n) {
    if (A.s < 25) return;
    const rng = ST.zufall(77);
    g.lineWidth = Math.max(0.5, 0.006 * A.s); g.lineCap = "round";
    for (let i = 0; i < n; i++) {
      const y = (rng() * 2 - 1) * L, sx = rng() < 0.5 ? -1 : 1;
      const a = T.p([sx * B * (0.6 + rng() * 0.4), y, H - 0.01]), b = T.p([sx * (B + 0.04 + rng() * 0.08), y + (rng() - 0.5) * 0.15, H + 0.03 + rng() * 0.04]);
      const q = A.bild(a), r = A.bild(b);
      g.strokeStyle = A.farbeK([220 + rng() * 30, 186 + rng() * 30, 100 + rng() * 30], [0.3, 0.3, 0.9]);
      g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(r[0], r[1]); g.stroke();
    }
  }

  /* ---------------- Tiere ---------------- */
  /* Schaf (stehend, grasend oder liegend), Lamm. Echte Proportionen: der
     Rumpf ist lang und kastenförmig, nicht rund; die Beine sind kurz,
     oben in der Wolle versteckt, unten schlank mit Gelenk und Klauen; der
     Kopf ist lang, schmal, mit Schnauze, dunkler Nase und waagerechten
     Ohren – kein Wattebausch auf Stelzen. */
  function schaf(o) {
    o = o || {};
    const F = new Figur();
    const k = o.lamm ? 0.64 : 1;
    const P = (x, y, z) => [x * k, y * k, z * k];
    const wolle = o.farbe || [226, 220, 204];
    const kopfF = o.kopfFarbe || (o.schwarzkopf ? [58, 50, 46] : [206, 192, 176]);
    const liegen = !!o.liegen;
    const zb = liegen ? 0.24 : 0.5;
    const beinF = o.schwarzkopf ? [56, 48, 44] : [168, 150, 132];
    const saat = o.saat || 5;
    if (!liegen) {
      for (const [sx, sy] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
        const x = sx * 0.1, y = sy * 0.26 + (sy > 0 ? 0.02 : 0);
        /* bewollte Keule bzw. Schulter */
        F.ellR(P(x * 1.1, y, 0.36), [0, 0.2 * sy, 1], 0.12 * k, 0.08 * k, 0.085 * k, wolle, { wolle: true, saat: saat + sx + sy * 3, b: -0.01 });
        /* Unterbein mit Vorderfußwurzel bzw. Sprunggelenk, Fessel, Klaue */
        const kn = sy > 0 ? 0.0 : -0.03;
        F.rohr([P(x, y, 0.3), P(x, y + kn, 0.16), P(x, y + kn * 0.3, 0.055), P(x, y + 0.02, 0.012)], [0.03 * k, 0.023 * k, 0.017 * k, 0.02 * k], beinF, { n: 8 });
        F.ellR(P(x, y + 0.035, 0.012), [0, 1, 0], 0.03 * k, 0.022 * k, 0.013 * k, [34, 30, 28], { b: 0.005 });
      }
    }
    /* Rumpf: lang, oben gerade Rückenlinie; Wolle mit Locken */
    F.ellR(P(0, -0.03, zb), [0, 1, 0], 0.44 * k, 0.225 * k, 0.21 * k, wolle, { wolle: true, saat: saat });
    F.ellR(P(0, -0.24, zb + 0.02), [0, 1, 0.1], 0.2 * k, 0.23 * k, 0.2 * k, wolle, { wolle: true, saat: saat + 7, b: -0.01 });
    F.ellR(P(0, 0.22, zb + 0.04), [0, 1, 0.3], 0.19 * k, 0.2 * k, 0.2 * k, wolle, { wolle: true, saat: saat + 1 });
    /* Kopf: lang und schmal, zur Schnauze hin schmaler */
    const grasen = !!o.grasen && !liegen;
    const kp = grasen ? P(0, 0.44, zb - 0.02) : P(0, 0.4, zb + (liegen ? 0.3 : 0.24));
    const d = grasen ? nrm([0, 0.35, -1]) : nrm([0, 0.8, -0.6]);
    const L = 0.27 * k;
    const at = (t) => add(kp, mul(d, L * t));
    F.rohr([at(-0.08), at(0.1), at(0.45), at(0.78), at(0.95), at(1.02)], [[0.052 * k, 0.07 * k], [0.064 * k, 0.078 * k], [0.056 * k, 0.07 * k], [0.043 * k, 0.052 * k], [0.04 * k, 0.045 * k], [0.02 * k, 0.022 * k]], kopfF, { n: 12 });
    /* Hals in Wolle */
    F.rohr([P(0, 0.2, zb + 0.08), P(0, 0.3, zb + (grasen ? 0.02 : 0.16)), add(kp, mul(d, -0.03 * k))], [0.15 * k, 0.12 * k, 0.085 * k], wolle, { n: 12, b: -0.01 });
    F.ell(add(kp, P(0, -0.02, 0.05)), 0.07 * k, 0.065 * k, 0.05 * k, wolle, { wolle: true, saat: saat + 3, b: 0.005 });
    /* Nase, Maul, Augen, Ohren */
    const quer = nrm(D.v.kreuz(d, [1, 0, 0]));          // vom Kopf aus nach oben/vorn
    const nase = add(at(1.0), mul(quer, -0.012 * k));
    F.ellA(nase, [0.018 * k, 0, 0], mul(quer, 0.012 * k), mul(d, 0.004 * k), [44, 34, 32], { flach: true, b: 0.02, ab: 22 });
    for (const sx of [-1, 1]) {
      const a = add(at(0.3), P(sx * 0.058, 0, 0.018));
      F.ellA(a, [0, 0.012 * k, 0.004 * k], [0, -0.003 * k, 0.01 * k], [sx * 0.004 * k, 0, 0], [26, 22, 20], { flach: true, b: 0.02, ab: 24 });
      const oh = add(at(0.12), P(sx * 0.07, 0, 0.02));
      F.ellR(add(oh, P(sx * 0.045, -0.01, -0.012)), [sx, -0.25, -0.2], 0.06 * k, 0.028 * k, 0.012 * k, kopfF, { b: -0.004 });
      F.ellR(add(oh, P(sx * 0.047, -0.01, -0.006)), [sx, -0.25, -0.2], 0.045 * k, 0.017 * k, 0.004 * k, mix(kopfF, [200, 140, 140], o.schwarzkopf ? 0.05 : 0.3), { b: 0.001, ab: 40 });
    }
    /* Schwanz */
    F.ell(P(0, -0.46, zb + 0.02), 0.05 * k, 0.05 * k, 0.09 * k, wolle, { b: -0.02 });
    return F;
  }

  /* Ochse, liegend (wiederkäuend): lange Rückenlinie mit Widerrist und
     Hüfthöckern, breite Stirn mit Stirnlocke, geschwungene Hörner,
     waagerechte Ohren, helles Flotzmaul, Wamme unter dem Hals */
  function ochse(o) {
    o = o || {};
    const F = new Figur();
    const P = (x, y, z) => [x, y, z];
    const fell = o.farbe || [140, 96, 64];
    const hell = mix(fell, [240, 225, 205], 0.35), dunkel = mix(fell, [30, 20, 14], 0.35);
    const R = (y, zc, hw, hh, cx) => ({ c: [cx || 0, y, zc], a: [hw, 0, 0], b: [0, 0, hh] });
    /* Rumpf: von der Kruppe (hinten) zur Brust */
    F.loft([R(-1.0, 0.5, 0.1, 0.16), R(-0.92, 0.5, 0.32, 0.36), R(-0.66, 0.5, 0.43, 0.42), R(-0.3, 0.47, 0.47, 0.44), R(0.1, 0.48, 0.46, 0.45), R(0.42, 0.51, 0.41, 0.45), R(0.66, 0.49, 0.31, 0.38), R(0.8, 0.45, 0.13, 0.2)], fell, { n: 18 });
    /* Hüfthöcker und Sitzbeinhöcker zeichnen sich ab */
    for (const sx of [-1, 1]) F.ellR(P(sx * 0.3, -0.62, 0.86), [sx * 0.4, 0, 1], 0.1, 0.09, 0.08, fell, { b: 0.01 });
    F.ellR(P(0, 0.42, 0.94), [0, 1, 0.2], 0.22, 0.14, 0.07, fell, { b: 0.01 });
    /* Hinterbein untergeschlagen (auf der oberen Seite) */
    F.ellR(P(0.36, -0.52, 0.32), [0, 1, 0.15], 0.42, 0.18, 0.25, mix(fell, [0, 0, 0], 0.05), { b: 0.05 });
    F.rohr([P(0.42, -0.2, 0.14), P(0.46, 0.05, 0.08), P(0.44, 0.22, 0.06)], [0.08, 0.06, 0.05], fell, { n: 10, b: 0.06 });
    F.ellR(P(0.44, 0.27, 0.05), [0, 1, 0], 0.06, 0.05, 0.04, [44, 36, 30], { b: 0.07 });
    /* Vorderbeine untergeschlagen */
    for (const sx of [-1, 1]) {
      F.rohr([P(sx * 0.2, 0.62, 0.2), P(sx * 0.19, 0.84, 0.12), P(sx * 0.18, 1.0, 0.08)], [0.1, 0.075, 0.06], fell, { n: 10, b: 0.1 });
      F.ellR(P(sx * 0.18, 1.06, 0.06), [0, 1, 0], 0.07, 0.06, 0.05, [44, 36, 30], { b: 0.1 });
    }
    /* Hals mit Wamme */
    F.rohr([P(0, 0.5, 0.64), P(0, 0.78, 0.74), P(0, 0.98, 0.82)], [[0.26, 0.3], [0.23, 0.26], [0.18, 0.2]], fell, { n: 14 });
    F.ellR(P(0, 0.86, 0.48), [0, 1, -0.4], 0.24, 0.08, 0.16, mix(fell, [0, 0, 0], 0.04), { b: -0.02 });
    /* Kopf: breite Stirn, schmaler Nasenrücken, breites Flotzmaul */
    const kp = P(0, 1.06, 0.98), d = nrm([0, 0.62, -0.78]);
    const at = (t) => add(kp, mul(d, 0.52 * t));
    F.rohr([at(-0.05), at(0.12), at(0.42), at(0.72), at(0.92), at(1.02)], [[0.14, 0.12], [0.16, 0.13], [0.12, 0.12], [0.1, 0.105], [0.115, 0.1], [0.07, 0.06]], fell, { n: 14 });
    F.ellR(at(0.93), d, 0.08, 0.12, 0.095, [196, 172, 154], { b: 0.02 });
    for (const sx of [-1, 1]) F.ellA(add(at(1.0), P(sx * 0.05, 0.0, 0.0)), [0.024, 0, 0], mul(nrm(D.v.kreuz(d, [1, 0, 0])), 0.016), mul(d, 0.004), [52, 38, 36], { flach: true, b: 0.05, ab: 24 });
    /* Stirnlocke: krauses Haar zwischen den Hörnern */
    for (let i = 0; i < 6; i++) F.ell(add(at(0.02), P((i % 3 - 1) * 0.045, 0.04 + Math.floor(i / 3) * 0.04, 0.09 - Math.floor(i / 3) * 0.035)), 0.035, 0.03, 0.028, i % 2 ? hell : mix(fell, [230, 200, 170], 0.2), { b: 0.03, ab: 14 });
    for (const sx of [-1, 1]) {
      /* Hörner: seitlich hinaus, dann nach oben und leicht nach vorn */
      F.rohr([P(sx * 0.12, 1.02, 1.03), P(sx * 0.24, 1.0, 1.06), P(sx * 0.33, 1.03, 1.14), P(sx * 0.36, 1.08, 1.26)], [0.042, 0.034, 0.024, 0.008], [222, 208, 180], { n: 8, b: 0.03, farbeRing: [[222, 208, 180], [226, 212, 186], [200, 184, 156], [70, 60, 52]] });
      /* Ohren waagerecht unter den Hörnern */
      F.ellR(P(sx * 0.24, 1.0, 0.93), [sx, -0.3, -0.25], 0.13, 0.065, 0.02, fell, { b: -0.02 });
      F.ellR(P(sx * 0.25, 1.005, 0.935), [sx, -0.3, -0.25], 0.1, 0.045, 0.006, mix(fell, [230, 190, 170], 0.35), { b: 0.001, ab: 20 });
      /* Augen */
      F.ellA(add(at(0.3), P(sx * 0.13, -0.01, 0.02)), [0, 0.022, -0.01], [0, 0.006, 0.016], [sx * 0.006, 0, 0], [26, 20, 18], { flach: true, b: 0.05, ab: 18 });
    }
    /* Schwanz mit Quaste, liegt am Körper */
    F.rohr([P(0.05, -0.98, 0.6), P(0.2, -0.98, 0.35), P(0.34, -0.9, 0.12)], [0.03, 0.025, 0.02], fell, { n: 8, b: 0.02 });
    F.ell(P(0.36, -0.86, 0.1), 0.05, 0.07, 0.04, dunkel, { b: 0.03 });
    return F;
  }

  /* Esel, stehend */
  function esel(o) {
    o = o || {};
    const F = new Figur();
    const P = (x, y, z) => [x, y, z];
    const fell = o.farbe || [128, 118, 110];
    const hell = [214, 206, 196], dunkel = mix(fell, [30, 26, 24], 0.55);
    for (const [sx, sy] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
      const hx = sx * 0.12, hy = sy * 0.4;
      /* Beine mit Gelenken, oben kräftig, unten schlank */
      F.rohr([P(hx, hy, 0.84), P(hx, hy + (sy < 0 ? -0.04 : 0.01), 0.5), P(hx, hy + 0.01, 0.4), P(hx, hy + 0.02, 0.12), P(hx, hy + 0.03, 0.05)], [0.07, 0.05, 0.04, 0.033, 0.036], fell, { n: 10 });
      F.zyl(P(hx, hy + 0.03, 0.0), P(hx, hy + 0.03, 0.06), 0.042, 0.038, [44, 38, 34], {});
    }
    F.loft([{ c: [0, -0.62, 0.95], a: [0.1, 0, 0], b: [0, 0, 0.12] }, { c: [0, -0.52, 0.94], a: [0.2, 0, 0], b: [0, 0, 0.23] }, { c: [0, -0.2, 0.9], a: [0.25, 0, 0], b: [0, 0, 0.26] }, { c: [0, 0.15, 0.91], a: [0.24, 0, 0], b: [0, 0, 0.26] }, { c: [0, 0.4, 0.96], a: [0.2, 0, 0], b: [0, 0, 0.23] }, { c: [0, 0.52, 0.98], a: [0.1, 0, 0], b: [0, 0, 0.12] }], fell, { n: 16 });
    F.ellR(P(0, 0.0, 0.76), [0, 1, 0], 0.4, 0.17, 0.1, hell, { b: -0.05 });
    /* Hals, Kopf, Maul, Ohren */
    F.rohr([P(0, 0.36, 1.02), P(0, 0.5, 1.2), P(0, 0.62, 1.34)], [[0.12, 0.16], [0.1, 0.13], [0.085, 0.1]], fell, { n: 12 });
    F.strich([P(0, 0.36, 1.2), P(0, 0.52, 1.42), P(0, 0.62, 1.47)], 0.04, dunkel, { b: -0.01 });
    const kp = P(0, 0.66, 1.42), d = nrm([0, 0.6, -0.8]);
    const at = (t) => add(kp, mul(d, 0.46 * t));
    F.rohr([at(-0.02), at(0.15), at(0.5), at(0.85), at(1.0)], [[0.075, 0.09], [0.082, 0.1], [0.065, 0.075], [0.07, 0.07], [0.04, 0.04]], fell, { n: 12 });
    F.ellR(at(0.86), d, 0.08, 0.08, 0.075, hell, { b: 0.02 });
    for (const sx of [-1, 1]) {
      F.ellR(P(sx * 0.07, 0.62, 1.66), [sx * 0.35, -0.25, 1], 0.2, 0.05, 0.02, fell, { b: -0.01 });
      F.ellR(P(sx * 0.072, 0.625, 1.66), [sx * 0.35, -0.25, 1], 0.15, 0.03, 0.006, [60, 52, 50], { b: 0.0, ab: 20 });
      F.ellA(add(at(0.3), P(sx * 0.075, 0, 0.02)), [0, 0.018, -0.01], [0, 0, 0.013], [sx * 0.006, 0, 0], [26, 22, 20], { flach: true, b: 0.04, ab: 20 });
    }
    /* Schulterkreuz und Aalstrich */
    F.strich([P(0, -0.46, 1.18), P(0, 0.34, 1.19)], 0.025, dunkel, { b: 0.02, ab: 18 });
    F.strich([P(0.02, 0.28, 1.16), P(0.2, 0.3, 0.98)], 0.022, dunkel, { b: 0.02, ab: 22 });
    F.strich([P(0, -0.58, 1.02), P(0.02, -0.64, 0.72), P(0.02, -0.65, 0.55)], 0.03, fell, { b: -0.02 });
    F.ell(P(0.02, -0.65, 0.53), 0.04, 0.04, 0.07, dunkel, { b: -0.02 });
    return F;
  }

  /* Geschnitzte Fichte (wie die Bäumchen auf Pyramidentellern): Stamm,
     vier Astkränze mit gezacktem Rand, im Winter weiße Spitzen */
  function fichte(o) {
    o = o || {};
    const F = new Figur(), h = o.h || 1, rng = ST.zufall(o.saat || 3);
    const gruen = o.farbe || [40, 78, 50];
    F.zyl([0, 0, 0], [0, 0, h * 0.14], h * 0.045, h * 0.04, [96, 70, 50], {});
    const n = o.stufen || 4;
    for (let i = 0; i < n; i++) {
      const z0 = h * (0.1 + i * 0.8 / n), r = h * (0.3 - i * 0.2 / n) * (0.95 + rng() * 0.1);
      const c = D.v.mix(gruen, [70, 110, 60], i / n * 0.35);
      F.zyl([0, 0, z0], [0, 0, z0 + h * 0.36], r, r * 0.08, c, { deckel: false, falten: 7, faltenLang: 0.9, saat: i + 1 });
      if (o.schnee) F.zyl([0, 0, z0 + h * 0.2], [0, 0, z0 + h * 0.36], r * 0.52, r * 0.07, [244, 248, 252], { deckel: false });
    }
    F.zyl([0, 0, h * 0.86], [0, 0, h * 1.02], h * 0.04, h * 0.005, gruen, { deckel: false });
    return F;
  }
  /* Kleiner Krippenstall: Rückwand aus Brettern, Seitenwände, Pultdach
     mit Stroh – vorn offen */
  function stall(o) {
    o = o || {};
    const F = new Figur();
    const B = o.b || 1.3, T = o.t || 0.75, H = o.h || 1.25, holz = [118, 86, 58], dunkel = [84, 60, 42];
    const hx = B / 2, y0 = -T / 2, y1 = T / 2, hv = H * 0.85;
    /* Rückwand und Seitenwände (beidseitig sichtbar) */
    F.poly([[-hx, y0, 0], [hx, y0, 0], [hx, y0, H], [-hx, y0, H]], holz, { beidseitig: true });
    for (const sx of [-1, 1]) F.poly([[sx * hx, y0, 0], [sx * hx, y1, 0], [sx * hx, y1, hv], [sx * hx, y0, H]], D.v.mix(holz, [0, 0, 0], 0.08), { beidseitig: true, b: 0.01 });
    /* Bretterfugen */
    for (let x = -hx + 0.16; x < hx; x += 0.16) F.strich([[x, y0 + 0.005, 0.02], [x, y0 + 0.005, H - 0.02]], 0.012, dunkel, { b: 0.005, ab: 30 });
    /* Eckpfosten vorn */
    for (const sx of [-1, 1]) F.zyl([sx * hx, y1, 0], [sx * hx, y1, hv], 0.045, 0.04, dunkel, { b: 0.02 });
    /* Pultdach mit Stroh, steht vorn und seitlich über */
    const ue = 0.12;
    F.poly([[-hx - ue, y0 - 0.05, H + 0.04], [hx + ue, y0 - 0.05, H + 0.04], [hx + ue, y1 + ue, hv - 0.02], [-hx - ue, y1 + ue, hv - 0.02]], [196, 162, 96], { beidseitig: true, b: 0.05 });
    F.eigen([0, 0, H], function (g, A, Tr) {
      if (A.silhouette || A.s * Tr.k < 30) return;
      const rng = ST.zufall(9);
      g.lineWidth = Math.max(0.5, A.s * Tr.k * 0.006);
      for (let i = 0; i < 60; i++) {
        const x = -hx - ue + rng() * (B + 2 * ue), t = rng();
        const p = Tr.p([x, y0 + (y1 + ue - y0) * t, H + 0.045 - (H - hv + 0.06) * t]), q = Tr.p([x + (rng() - 0.5) * 0.05, y0 + (y1 + ue - y0) * Math.min(1, t + 0.12), H + 0.045 - (H - hv + 0.06) * Math.min(1, t + 0.12)]);
        const a = A.bild(p), b = A.bild(q);
        g.strokeStyle = A.farbeK(rng() < 0.5 ? [220, 186, 110] : [168, 132, 70], [0, 0.4, 0.9]);
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
      }
    }, { b: 0.06, nurBild: true });
    /* Stern über dem Stall */
    if (o.stern) {
      F.strich([[0, y0, H + 0.02], [0, y0, H + 0.4]], 0.015, dunkel, {});
      F.ellA([0, y0 + 0.02, H + 0.46], [0.09, 0, 0], [0, 0, 0.09], [0, 0.015, 0], [236, 196, 90], { flach: true, beidseitig: true, b: 0.08 });
    }
    return F;
  }

  ST.figuren = { version: VERSION, mensch: mensch, kind: kind, krippe: krippe, schaf: schaf, ochse: ochse, esel: esel, fichte: fichte, stall: stall, HAUT: HAUT, laterneAn: laterneAn };
})();
/* ===== FIGURENWERKSTATT-ENDE ===== */

/* KRIPPE-MODELL */
/* =====================================================================
   DER STALL VON BETHLEHEM — so, wie er auf deutschen Weihnachtsmärkten
   vor der Kirche steht: lebensgroße, geschnitzte Figuren in einem
   offenen Stall aus Rundholzpfosten und sägerauen Brettern, das Dach
   dick mit Stroh gedeckt. Über dem First leuchtet ein Herrnhuter Stern
   (in Deutschland DER Stern von Bethlehem), vorn am Balken hängt eine
   Stalllaterne. Drinnen Stroh, eine Heuraufe, Strohballen.

   REIHENFOLGE IN JEDEM WINKEL
   Der Stall ist ein Kasten mit drei Wänden und offener Front. Für jede
   Wandebene gilt: Sieht man ihre Außenseite, liegt sie VOR allem im
   Innern (wird danach gemalt), sonst DAHINTER. Figuren außerhalb werden
   mit einer trennenden Ebene einsortiert (ganz davor oder ganz
   dahinter). Das Strohdach liegt höher als alles darunter – bei dieser
   Kamera ist Höheres dort, wo es sich überdeckt, immer näher am Auge.

   LICHT
   Unter dem Dach: ein Strahl von jeder Figur zur Sonne – trifft er das
   Dach, steht die Figur im Schatten (dreht man den Stall, wandert der
   Schatten mit). Nachts leuchten Laterne und Stern die Figuren warm an.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, D = ST.drechsel, FW = ST.figuren, PI = ST.pinsel;
  const { add, sub, mul, dot, nrm, mix } = D.v;
  const TAU = Math.PI * 2, LI = ST.LICHT;
  const rgbS = D.rgbS;
  const klemm = (x, a, b) => (x < a ? a : x > b ? b : x);
  function rausch(g, x, y, w, h, meter, st, v, okt) {
    const dx = ((v || 0) * 0.37) % meter, dy = ((v || 0) * 0.61) % meter;
    g.save(); g.translate(dx, dy);
    PI.rauschen(g, x - dx, y - dy, w, h, meter, st, okt === 3 ? 31 : 21, okt === 3 ? 3 : 4);
    g.restore();
  }

  /* ---------------- Maße (Meter) ----------------
     Der Giebel schaut nach vorn (+y): man blickt durch die offene
     Giebelseite in den Stall, der First läuft von vorn nach hinten. */
  const XW = 2.25;                      // halbe Stallbreite (Pfostenachsen)
  const YB = -1.95, YF = 1.0;           // Rückwand, offene Giebelfront
  const YM = (YB + YF) / 2;
  const ZT = 2.15, ZF = 3.75;           // Traufe (Seitenwände), First
  const NEIG = (ZF - ZT) / XW;          // Dachneigung (≈ 35°)
  const UE = 0.42, UEG = 0.45, DD = 0.3; // Überstand Traufe (seitlich) und Giebel (vorn/hinten), Strohdicke
  const HOLZ = [124, 100, 78], HOLZ_D = [92, 72, 54], RINDE = [96, 78, 62];

  /* ---------------- Malhelfer ---------------- */
  /* Sägeraue, verwitterte Bretter, senkrecht, mit Fugen, Ästen, Nägeln */
  function bretterRau(g, F, farbe, saat, innen) {
    const rng = ST.zufall(saat), w = F.w, h = F.h;
    const fe = F.flaeche.feld || [0, 0, w, h];
    g.fillStyle = "rgb(30,22,16)"; g.fillRect(fe[0] - 0.2, fe[1] - 0.2, fe[2] - fe[0] + 0.4, fe[3] - fe[1] + 0.4);
    const toene = [0, 1, 2, 3].map(() => PI.streu(farbe, rng, 0.12));
    const fuge = F.px > 12 ? 0.018 : 0;
    let x = fe[0] - rng() * 0.1;
    const bretter = [];
    while (x < fe[2]) { const b = 0.2 + rng() * 0.1; bretter.push([x, b]); x += b; }
    for (let k = 0; k < 4; k++) {
      g.fillStyle = rgbS(innen ? mix(toene[k], [40, 30, 22], 0.25) : toene[k]); g.beginPath();
      bretter.forEach(([bx, bb], i) => { if (i % 4 === k) g.rect(bx + fuge / 2, fe[1] - 0.2, bb - fuge, fe[3] - fe[1] + 0.4); });
      g.fill();
    }
    if (F.px > 20) {
      /* Maserung und Verwitterung: senkrechte Streifen, Astlöcher */
      g.lineWidth = Math.max(0.004, 0.8 / F.px);
      g.strokeStyle = "rgba(50,38,28,0.22)"; g.beginPath();
      for (const [bx, bb] of bretter) for (let j = 0; j < 3; j++) { const xx = bx + bb * (0.15 + rng() * 0.7); g.moveTo(xx, fe[1]); g.bezierCurveTo(xx + 0.01, fe[1] + h * 0.3, xx - 0.015, fe[1] + h * 0.7, xx + 0.005, fe[3]); }
      g.stroke();
      g.fillStyle = "rgba(40,28,20,0.6)";
      for (const [bx, bb] of bretter) if (rng() < 0.5) { const yy = fe[1] + rng() * h; g.beginPath(); g.ellipse(bx + bb * (0.3 + rng() * 0.4), yy, 0.018, 0.03, 0, 0, TAU); g.fill(); }
      if (F.px > 40) {
        g.fillStyle = "rgba(60,60,64,0.8)";
        for (const [bx, bb] of bretter) for (const yy of [fe[1] + 0.25, fe[3] - 0.3]) { g.beginPath(); g.arc(bx + bb / 2, yy, 0.008, 0, TAU); g.fill(); }
      }
    }
    rausch(g, fe[0] - 0.2, fe[1] - 0.2, fe[2] - fe[0] + 0.4, fe[3] - fe[1] + 0.4, 1.6, 0.26, saat, 4);
    /* Spritzwasser und Grünbelag unten */
    const gr = g.createLinearGradient(0, fe[3], 0, fe[3] - 0.5);
    gr.addColorStop(0, "rgba(60,70,40,0.35)"); gr.addColorStop(1, "rgba(60,70,40,0)");
    g.fillStyle = gr; g.fillRect(fe[0] - 0.2, fe[3] - 0.5, fe[2] - fe[0] + 0.4, 0.5);
  }
  /* warmer Lichtfleck der Laterne auf dem Boden (nachts, in Flächenkoordinaten) */
  function lichtfleck(g, F, x, y, r) {
    if (!(F.nacht > 0) || !bauFertig(F.A)) return;
    g.save(); g.globalCompositeOperation = "lighter";
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, "rgba(255,170,80," + (0.42 * F.nacht).toFixed(3) + ")");
    gr.addColorStop(0.5, "rgba(255,150,60," + (0.14 * F.nacht).toFixed(3) + ")");
    gr.addColorStop(1, "rgba(255,150,60,0)");
    g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
    g.restore();
  }
  function bauFertig(A) { return A.bauStand == null || A.bauStand >= 0.9; }
  /* Strohdach: Lagen von Halmen, oben grauer (verwittert), unten goldener */
  function strohMalen(g, F, winter, saat) {
    const w = F.w, h = F.h, rng = ST.zufall(saat);
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "rgb(150,132,100)"); gr.addColorStop(0.5, "rgb(176,148,98)"); gr.addColorStop(1, "rgb(188,156,100)");
    g.fillStyle = gr; g.fillRect(-0.2, -0.2, w + 0.4, h + 0.4);
    rausch(g, -0.2, -0.2, w + 0.4, h + 0.4, 1.4, 0.3, saat, 4);
    if (F.px > 7) {
      /* Lagen (Schichten) als dunklere Stufen */
      g.fillStyle = "rgba(70,52,30,0.28)";
      for (let y = 0.3; y < h; y += 0.32) { g.beginPath(); g.moveTo(-0.2, y); for (let x = 0; x <= w + 0.2; x += 0.2) g.lineTo(x, y + Math.sin(x * 3 + y) * 0.02); g.lineTo(w + 0.2, y + 0.05); g.lineTo(-0.2, y + 0.05); g.fill(); }
    }
    if (F.px > 16) {
      /* Halme: kurze Striche den Hang hinab, drei Farbgruppen */
      const n = Math.min(6000, Math.round(w * h * Math.min(160, F.px * 2.2)));
      const gruppen = [[], [], []];
      for (let i = 0; i < n; i++) gruppen[Math.floor(rng() * 3)].push([rng() * w, rng() * h, 0.08 + rng() * 0.14, (rng() - 0.5) * 0.25]);
      const farben = ["rgba(214,184,120,0.55)", "rgba(120,96,60,0.45)", "rgba(236,212,150,0.4)"];
      g.lineWidth = Math.max(0.005, 0.9 / F.px);
      gruppen.forEach((gp, k) => { g.strokeStyle = farben[k]; g.beginPath(); for (const [x, y, l, a] of gp) { g.moveTo(x, y); g.lineTo(x + Math.sin(a) * l, y + Math.cos(a) * l); } g.stroke(); });
    }
    /* Schnee: dicke Decke mit Wehen; an dünnen Stellen schauen Strohbüschel
       durch (die Löcher), zum First hin vom Wind etwas abgeweht */
    if (winter) D.schneeDecke(g, F, 0, 0, w, h * 0.985, { saat: saat, loecher: Math.round(w * h * 0.8), rand: 0.12 });
  }
  /* Streu VOR dem Stall: keine Platte, sondern einzelne Halme, die zum
     Rand hin immer lichter werden und sich im Schnee verlieren. Die Fläche
     bekommt KEIN Licht vom Kern (die Multiply-Lichtschicht würde sonst die
     durchsichtigen Stellen deckend einfärben – eine helle Plane im
     Schnee); die Halme werden selbst mit dem Licht der Fläche gefärbt. */
  function streuDraussen(g, F, saat) {
    const rng = ST.zufall(saat), w = F.w, h = F.h, A = F.A;
    const n = Math.min(3200, Math.round(w * h * 520 * Math.min(1, F.px / 25)));
    const farben = [[220, 188, 110], [182, 146, 84], [240, 214, 150], [150, 118, 70]].map((c) => A.farbeK(c, F.n));
    /* Dichte: unregelmäßiger Fleck vor der Öffnung, ausfransend */
    const dichte = (x, y) => {
      const u = (x / w - 0.5) * 2, v = y / h;
      const rand = 0.72 + 0.35 * (ST.rausch(x * 1.7, y * 1.7, saat) - 0.5);
      const d = Math.hypot(u * 0.95, (v - 0.12) * 1.25) / rand;
      return Math.max(0, Math.min(1, 1.25 - d * 1.2));
    };
    g.lineWidth = Math.max(0.006, 1 / F.px); g.lineCap = "round";
    for (let k = 0; k < 4; k++) {
      g.strokeStyle = farben[k]; g.globalAlpha = k === 3 ? 0.6 : 0.85; g.beginPath();
      for (let i = 0; i < n / 4; i++) {
        const x = rng() * w, y = rng() * h;
        const p = dichte(x, y);
        if (rng() > p * p + 0.015) continue;             // außen nur vereinzelte Halme
        const a = rng() * TAU, l = 0.05 + rng() * 0.13;
        g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + (rng() - 0.5) * 0.02, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l);
      }
      g.stroke();
    }
    g.globalAlpha = 1;
  }
  /* Stroh auf dem Boden (Streu) */
  function streuMalen(g, F, dichte, saat) {
    const rng = ST.zufall(saat), w = F.w, h = F.h;
    const n = Math.min(4000, Math.round(w * h * dichte * Math.min(1, F.px / 25)));
    const farben = ["rgba(220,188,110,0.8)", "rgba(182,146,84,0.75)", "rgba(240,214,150,0.7)"];
    g.lineWidth = Math.max(0.006, 1 / F.px);
    for (let k = 0; k < 3; k++) {
      g.strokeStyle = farben[k]; g.beginPath();
      for (let i = 0; i < n / 3; i++) {
        /* dichter in der Mitte, zum Rand hin ausfransend */
        const x = rng() * w, y = rng() * h, rx = Math.abs(x / w - 0.5) * 2, ry = Math.abs(y / h - 0.5) * 2;
        if (rng() < Math.max(rx, ry) * 0.9 - 0.1) continue;
        const a = rng() * TAU, l = 0.06 + rng() * 0.12;
        g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
      }
      g.stroke();
    }
  }

  /* Kantholz (Pfette, Riegel, Kopfband) als Kasten entlang p0 → p1 */
  function balken(g, A, p0, p1, b, h, farbe) {
    const ax = sub(p1, p0), L = Math.hypot(ax[0], ax[1], ax[2]);
    const a = mul(ax, 1 / L);
    let q = D.v.kreuz(a, [0, 0, 1]); if (Math.hypot(q[0], q[1], q[2]) < 1e-3) q = [1, 0, 0]; q = nrm(q);
    const up = nrm(D.v.kreuz(q, a));
    const hb = mul(q, b / 2), hh = mul(up, h / 2);
    const P = (sb, sh, t) => add(add(add(p0, mul(ax, t)), mul(hb, sb)), mul(hh, sh));
    const seiten = [
      [P(-1, 1, 0), P(1, 1, 0), P(1, 1, 1), P(-1, 1, 1)],
      [P(1, -1, 0), P(-1, -1, 0), P(-1, -1, 1), P(1, -1, 1)],
      [P(1, 1, 0), P(1, -1, 0), P(1, -1, 1), P(1, 1, 1)],
      [P(-1, -1, 0), P(-1, 1, 0), P(-1, 1, 1), P(-1, -1, 1)],
      [P(-1, -1, 0), P(1, -1, 0), P(1, 1, 0), P(-1, 1, 0)],
      [P(-1, 1, 1), P(1, 1, 1), P(1, -1, 1), P(-1, -1, 1)]
    ];
    for (const s of seiten) D.vieleck(g, A, s, farbe, { naht: true });
    if (!A.silhouette && A.s * b > 6) {
      /* Maserung auf den Längsseiten */
      g.lineWidth = Math.max(0.5, A.s * 0.004);
      g.strokeStyle = A.farbeK(mix(farbe, [30, 20, 14], 0.5), [0.3, 0.3, 0.8], 0.35);
      g.beginPath();
      for (const t of [-0.5, 0, 0.45]) { const s0 = A.bild(add(P(t, 1.01, 0), [0, 0, 0])), s1 = A.bild(P(t, 1.01, 1)); if (A.zumAuge(up) > 0) { g.moveTo(s0[0], s0[1]); g.lineTo(s1[0], s1[1]); } }
      g.stroke();
    }
  }
  /* Rundholzpfosten mit Rinde */
  function pfosten(g, A, x, y, z0, z1, r) {
    D.stumpf(g, A, [x, y, z0], [x, y, z1], r * 1.05, r * 0.95, RINDE, { falten: 9, faltenLang: 1, saat: Math.round(x * 10 + y * 7), deckel: [176, 150, 116] });
  }

  /* ---------------- Herrnhuter Stern ----------------
     25 Zacken auf einem Rautenkuboktaeder (18 mit viereckigem, 8 mit
     dreieckigem Fuß, unten fehlt einer für die Halterung) – aus
     Papier, innen beleuchtet. */
  const ZACKEN = (function () {
    const z = [];
    const n = (v) => nrm(v);
    for (const a of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1]]) z.push({ d: a, eck: 4 });
    for (const s1 of [1, -1]) for (const s2 of [1, -1]) { z.push({ d: n([s1, s2, 0]), eck: 4 }); z.push({ d: n([s1, 0, s2]), eck: 4 }); z.push({ d: n([0, s1, s2]), eck: 4 }); }
    for (const s1 of [1, -1]) for (const s2 of [1, -1]) for (const s3 of [1, -1]) z.push({ d: n([s1, s2, s3]), eck: 3 });
    return z;
  })();
  function stern(g, A, c, R, nacht, rot) {
    const kern = R * 0.36;
    const hell = nacht > 0.05;
    const papier = [250, 226, 140];
    const liste = [];
    for (const zk of ZACKEN) {
      /* Zacken drehen mit (rot) */
      const d0 = zk.d, cs = Math.cos(rot || 0), sn = Math.sin(rot || 0);
      const d = [d0[0] * cs - d0[1] * sn, d0[0] * sn + d0[1] * cs, d0[2]];
      const [u1, u2] = D.v.quer(d);
      const fuss = add(c, mul(d, kern)), spitze = add(c, mul(d, R));
      const b = kern * (zk.eck === 4 ? 0.62 : 0.55);
      const ecken = [];
      for (let i = 0; i < zk.eck; i++) { const w = i / zk.eck * TAU + Math.PI / 4; ecken.push(add(fuss, add(mul(u1, Math.cos(w) * b), mul(u2, Math.sin(w) * b)))); }
      liste.push({ z: A.tief(add(c, mul(d, R * 0.6))), fn: () => {
        for (let i = 0; i < zk.eck; i++) {
          const pts = [ecken[i], ecken[(i + 1) % zk.eck], spitze];
          if (hell) {
            const nk = nrm(A.kam(D.v.kreuz(sub(pts[1], pts[0]), sub(pts[2], pts[0]))));
            if (dot(nk, ST.ZUM_AUGE) <= 0) continue;
            /* innen beleuchtetes Papier: zur Spitze hin heller */
            const a = A.bild(pts[0]), b2 = A.bild(pts[1]), s2 = A.bild(pts[2]);
            const gr = g.createLinearGradient((a[0] + b2[0]) / 2, (a[1] + b2[1]) / 2, s2[0], s2[1]);
            const k = 0.55 + 0.45 * nacht;
            gr.addColorStop(0, "rgb(" + (255 * k | 0) + "," + (200 * k | 0) + "," + (110 * k | 0) + ")");
            gr.addColorStop(1, "rgb(255," + (246 * k | 0) + "," + (200 * k | 0) + ")");
            D.pfad(g, [a, b2, s2]); g.fillStyle = gr; g.fill();
          } else D.vieleck(g, A, pts, papier, {});
        }
      } });
    }
    liste.sort((x, y) => x.z - y.z);
    D.ellipsoid(g, A, c, [kern, 0, 0], [0, kern, 0], [0, 0, kern], hell ? [255, 230, 160] : papier, { leucht: hell });
    for (const e of liste) e.fn();
  }

  /* =====================================================================
     BESETZUNG — Figuren und Tiere (Position im Stallraum, Blickziel)
     ===================================================================== */
  const BES = {};
  function besetzung(jahr) {
    if (BES[jahr]) return BES[jahr];
    const M = FW.mensch, S = FW.schaf;
    const L = [];
    const krippePos = [0, -0.35];
    const blick = (x, y, zx, zy) => Math.atan2(zy - y, zx - x) - Math.PI / 2;
    /* Wie auf der Krippenbühne: die Figuren wenden sich halb dem Betrachter
       zu (Hauptblick durch die offene Giebelfront, +y), der Kopf dreht
       sich zum Kind – so sieht man Gesichter statt Rücken */
    const halb = (x, y, zx, zy, anteil) => { const b0 = blick(x, y, zx, zy), b = Math.atan2(Math.sin(b0), Math.cos(b0)); return { phi: b * (1 - anteil), dreh: b * anteil }; };
    const setz = (fig, x, y, phi, extra) => L.push(Object.assign({ fig: fig, p: [x, y, 0], phi: phi }, extra || {}));
    if (jahr === "winter") {
      setz(FW.krippe({ holz: [120, 94, 70] }), krippePos[0], krippePos[1], Math.PI / 2, { name: "krippe" });
      setz(FW.kind({}), krippePos[0], krippePos[1], Math.PI / 2, { dz: 0.6, name: "kind" });
      const ma = halb(-0.82, 0.05, krippePos[0], krippePos[1], 0.45);
      setz(M({ pose: "knien", arme: "beten", gewand: [160, 56, 58], mantel: [44, 72, 142], kopf: "schleier", kopfFarbe: [236, 232, 222], haar: [92, 62, 40], nicken: 0.42, kopfDreh: ma.dreh * 0.8, neigen: 0.12, standbein: -1 }), -0.82, 0.05, ma.phi);
      const jo = halb(0.86, 0.02, krippePos[0], krippePos[1], 0.45);
      setz(M({ arme: "stab", gewand: [112, 80, 56], mantel: [150, 130, 96], haar: [92, 68, 48], bart: [92, 68, 48], kordel: [196, 176, 136], nicken: 0.25, kopfDreh: jo.dreh * 0.8, standbein: 1 }), 0.86, 0.02, jo.phi);
      setz(FW.ochse({ farbe: [132, 92, 62] }), -1.35, -1.45, blick(-1.35, -1.45, 0.2, -0.3));
      setz(FW.esel({}), 1.45, -1.3, blick(1.45, -1.3, 0.1, -0.5));
      const h1 = halb(2.0, 1.95, 0, -0.4, 0.4);
      setz(M({ arme: "stab", krummstab: true, gewand: [150, 138, 112], mantel: [112, 118, 92], kopf: "filzhut", kopfFarbe: [84, 70, 58], bart: [170, 160, 146], haar: [170, 160, 146], kopfDreh: h1.dreh * 0.7, nicken: 0.12, standbein: -1 }), 2.0, 1.95, h1.phi);
      const h2 = halb(1.2, 1.35, 0, -0.4, 0.35);
      setz(M({ pose: "knien", arme: "beten", gewand: [168, 150, 118], mantel: [132, 104, 78], kopf: "kapuze", kopfFarbe: [150, 126, 96], haar: [80, 60, 40], kopfDreh: h2.dreh * 0.7, nicken: 0.2 }), 1.2, 1.35, h2.phi);
      setz(S({ liegen: true, saat: 2 }), -1.7, 1.35, 0.6);
      setz(S({ saat: 3 }), -2.35, 1.9, -0.3);
      setz(S({ lamm: true, liegen: true, saat: 4 }), -1.05, 1.75, 1.2);
      setz(S({ saat: 5, schwarzkopf: true, grasen: true }), 2.7, 0.55, 2.2);
    } else {
      /* Frühling: Schafe und Lämmer, das Mutterschaf säugt ein Lamm */
      setz(S({ saat: 11 }), -0.6, -0.6, 0.9);
      setz(S({ lamm: true, saat: 12, grasen: true }), -0.35, -1.0, -2.2);
      setz(S({ lamm: true, liegen: true, saat: 13 }), 0.35, -0.2, 2.5);
      setz(S({ liegen: true, saat: 14, schwarzkopf: true }), 1.5, -1.3, -2.4);
      setz(S({ liegen: true, saat: 15 }), -1.6, -1.35, 1.0);
      setz(S({ saat: 16, grasen: true }), -1.9, 1.5, 0.3);
      setz(S({ lamm: true, saat: 17 }), -1.2, 1.9, -0.8);
      setz(S({ saat: 18, schwarzkopf: true, grasen: true }), 1.6, 1.6, -1.3);
      setz(S({ lamm: true, liegen: true, saat: 19 }), 2.3, 1.1, 2.0);
      setz(S({ lamm: true, saat: 20 }), 0.6, 1.4, 0.5);
    }
    return (BES[jahr] = L);
  }

  /* =====================================================================
     AUFBAU — Stückliste mit Ebenenzugehörigkeit
     wand: welche Wandebenen (hinten/links/rechts/vorn) ein Teil trägt
     ===================================================================== */
  const EBENEN = { hinten: [0, -1, 0], links: [-1, 0, 0], rechts: [1, 0, 0], vorn: [0, 1, 0] };
  const EBENE_P = { hinten: YB, links: -XW, rechts: XW, vorn: YF };
  function innen(p) { return p[0] > -XW && p[0] < XW && p[1] > YB && p[1] < YF; }

  function stueckliste(o) {
    const winter = o.jahr === "winter";
    const L = [];
    const dazu = (art, c, bau, fn, extra) => L.push(Object.assign({ art: art, c: c, bau: bau, fn: fn }, extra || {}));

    /* ---- Fundament: Punktfundamente unter den Pfosten ---- */
    const PF = [[-XW, YB], [0, YB], [XW, YB], [-XW, YF], [-0.95, YF], [0.95, YF], [XW, YF], [-XW, YM], [XW, YM]];
    dazu("boden", [0, 0, -0.3], [0, 0.2], (g, A, q, bau) => {
      if (bau >= 0.2) return;
      for (const [x, y] of PF) {
        if (bau < 0.08) {
          /* Loch mit Aushub */
          D.ellipsoid(g, A, [x, y, 0.01], [0.32, 0, 0], [0, 0.32, 0], [0, 0, 0.001], [70, 54, 40], { flach: true });
          D.ellipsoid(g, A, [x + 0.4, y + 0.25, 0.05], [0.25, 0, 0], [0, 0.18, 0], [0, 0, 0.1], winter ? [214, 212, 206] : [112, 86, 62], {});
        } else {
          /* Betonsockel mit Brettabdrücken, darauf der Pfostenschuh */
          const k = klemm((bau - 0.08) / 0.06, 0, 1), hz = 0.12 * k;
          for (const [sx, sy, nx, ny] of [[1, 1, 0, 1], [1, -1, 1, 0], [-1, -1, 0, -1], [-1, 1, -1, 0]]) {
            const a = [x + sx * 0.2, y + sy * 0.2], b = ny ? [x - sx * 0.2, y + sy * 0.2] : [x + sx * 0.2, y - sy * 0.2];
            /* Normale ausdrücklich nach außen: sonst sähe man nur die Rückseiten
               (die Sockel wirkten wie hohle Tischchen) */
            D.vieleck(g, A, [[a[0], a[1], hz], [b[0], b[1], hz], [b[0], b[1], -0.05], [a[0], a[1], -0.05]], [170, 168, 162], { n: [nx, ny, 0], naht: true });
          }
          D.vieleck(g, A, [[x - 0.2, y - 0.2, hz], [x + 0.2, y - 0.2, hz], [x + 0.2, y + 0.2, hz], [x - 0.2, y + 0.2, hz]], [184, 182, 176], { naht: true });
        }
      }
    });
    /* ---- Boden: innen gestampfter Lehm mit Stroh, vorn verstreutes Stroh ---- */
    dazu("boden", [0, YM, 0.01], [0.3, 0.35], (g, A) => {
      const sk = A.sk, ak = A.ak; A.sk = 0.25; A.ak = 0.8;
      D.flaeche(g, A, { name: "lehm", o: [-XW, YB, 0.01], u: [1, 0, 0], v: [0, 1, 0], w: 2 * XW, h: YF - YB, auf: 0, malen: (g2, F) => {
        g2.fillStyle = "rgb(120,96,70)"; g2.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
        rausch(g2, 0, 0, F.w, F.h, 1.2, 0.3, 17, 4);
        if (bauFertig(A)) streuMalen(g2, F, 1600, 5);
      }, danach: (g2, F) => lichtfleck(g2, F, XW + 0.55, YF - YB, 2.4) });
      A.sk = sk; A.ak = ak;
    });
    dazu("boden", [0, YF + 0.8, 0.01], [0.9, 0.95], (g, A) => {
      D.flaeche(g, A, { name: "streu", o: [-XW - 0.8, YF - 0.2, 0.012], u: [1, 0, 0], v: [0, 1, 0], w: 2 * XW + 1.6, h: 2.6, keinLicht: true, auf: 0,
        malen: (g2, F) => streuDraussen(g2, F, 7),
        danach: (g2, F) => lichtfleck(g2, F, XW + 0.8 + 0.55, 0.2, 2.6) });
    });

    /* ---- Pfosten ---- */
    const pfo = (x, y, ebenen) => dazu("bau", [x, y, 1.1], [0.2, 0.3], (g, A, q) => pfosten(g, A, x, y, 0.1, 0.1 + (ZT - 0.1) * q, 0.09), { ebenen: ebenen });
    pfo(-XW, YB, ["hinten", "links"]); pfo(XW, YB, ["hinten", "rechts"]);
    pfo(-XW, YF, ["vorn", "links"]); pfo(XW, YF, ["vorn", "rechts"]);
    pfo(-XW, YM, ["links"]); pfo(XW, YM, ["rechts"]);
    /* Firstständer hinten (in der Rückwand) */
    dazu("bau", [0, YB, 1.9], [0.24, 0.32], (g, A, q) => pfosten(g, A, 0, YB, 0.1, 0.1 + (ZF - 0.1) * q, 0.08), { ebenen: ["hinten"] });

    /* ---- Rückwand mit Giebeldreieck ---- */
    dazu("wand", [0, YB, 1.5], [0.3, 0.45], (g, A, q, bau) => {
      const k = klemm((bau - 0.3) / 0.15, 0, 1), h = ZT * k, w = 2 * XW;
      D.flaeche(g, A, { name: "rueck", o: [XW, YB, h], u: [-1, 0, 0], v: [0, 0, -1], w: w, h: h, malen: (g2, F) => bretterRau(g2, F, HOLZ, 3, A.zumAuge([0, -1, 0]) < 0), beidseitig: true });
      if (k >= 1) {
        const gh = ZF - ZT;
        D.flaeche(g, A, { name: "rueckgiebel", o: [XW, YB, ZF], u: [-1, 0, 0], v: [0, 0, -1], w: w, h: gh, umriss: [[0, gh], [w / 2, 0], [w, gh]], malen: (g2, F) => bretterRau(g2, F, mix(HOLZ, [80, 70, 60], 0.15), 4, A.zumAuge([0, -1, 0]) < 0), beidseitig: true, auf: 0.3 });
      }
    }, { ebenen: ["hinten"] });
    /* ---- Seitenwände: Bretter bis 1,45 m, darüber offen unter der Traufe ---- */
    for (const sx of [-1, 1]) {
      const name = sx < 0 ? "links" : "rechts";
      dazu("wand", [sx * XW, YM, 0.8], [0.33, 0.48], (g, A, q, bau) => {
        const k = klemm((bau - 0.33) / 0.15, 0, 1), h = 1.45 * k;
        const o = sx < 0 ? [-XW, YB, h] : [XW, YF, h], u = sx < 0 ? [0, 1, 0] : [0, -1, 0];
        D.flaeche(g, A, { name: "seite" + sx, o: o, u: u, v: [0, 0, -1], w: YF - YB, h: h, malen: (g2, F) => bretterRau(g2, F, HOLZ, 5 + sx, A.zumAuge([sx, 0, 0]) < 0), beidseitig: true });
        if (k >= 1) balken(g, A, [sx * XW, YB, 1.45], [sx * XW, YF, 1.45], 0.09, 0.1, HOLZ_D);
      }, { ebenen: [name] });
      /* Traufpfette auf den Seitenpfosten */
      dazu("bau", [sx * XW, YM, ZT], [0.34, 0.4], (g, A) => balken(g, A, [sx * XW, YB - UEG, ZT + 0.08], [sx * XW, YF + UEG, ZT + 0.08], 0.15, 0.16, HOLZ_D), { ebenen: [name] });
    }
    /* ---- Offene Giebelfront: Zangenbalken, Firstständer, Streben ---- */
    dazu("bau", [0, YF, ZT + 0.5], [0.34, 0.42], (g, A) => {
      balken(g, A, [-XW - 0.2, YF, ZT], [XW + 0.2, YF, ZT], 0.14, 0.18, HOLZ_D);
      balken(g, A, [0, YF, ZT + 0.09], [0, YF, ZF - 0.1], 0.13, 0.13, HOLZ_D);
      for (const sx of [-1, 1]) {
        balken(g, A, [sx * 1.1, YF, ZT + 0.09], [sx * 0.08, YF, ZT + 0.95], 0.09, 0.09, HOLZ_D);
        /* Kopfbänder an den Eckpfosten */
        balken(g, A, [sx * XW, YF, ZT - 0.6], [sx * (XW - 0.55), YF, ZT - 0.06], 0.09, 0.09, HOLZ_D);
      }
    }, { ebenen: ["vorn"] });
    /* ---- Dachstuhl: Firstpfette und Sparren ---- */
    dazu("dachstuhl", [0, YM, ZF], [0.4, 0.46], (g, A, q, bau) => {
      balken(g, A, [0, YB - UEG, ZF], [0, YF + UEG, ZF], 0.15, 0.16, HOLZ_D);
      const n = 6;
      for (let i = 0; i <= n; i++) {
        const y = YB - UEG + 0.05 + (YF - YB + 2 * UEG - 0.1) * i / n;
        const rand = i === 0 || i === n;
        if (bau < 0.55 || rand) for (const sx of [-1, 1]) balken(g, A, [0, y, ZF + 0.07], [sx * (XW + UE), y, ZT - UE * NEIG + 0.07], 0.08, 0.11, [150, 120, 86]);
      }
    });

    /* ---- Heuraufe an der Rückwand, Strohballen ---- */
    dazu("innen", [0.8, YB + 0.3, 1.2], [0.9, 0.95], (g, A) => heuraufe(g, A, 0.7, YB + 0.06, winter));
    for (const [x, y, w] of [[-1.75, YB + 0.42, 0.1], [-1.8, YB + 1.3, 1.45], [1.75, YB + 1.35, -1.5]]) dazu("innen", [x, y, 0.2], [0.9, 0.95], (g, A) => strohballen(g, A, x, y, w));
    /* ---- Laterne am Zangenbalken ---- */
    const LAT = [0.55, YF + 0.02, ZT - 0.58];
    dazu("laterne", LAT, [0.96, 1], (g, A) => laterne(g, A, LAT));
    /* ---- Frühling: Wassertrog und Blumen am Stall ---- */
    if (!winter) {
      dazu("aussen", [2.75, -0.6, 0.3], [0.94, 1], (g, A) => trog(g, A, 2.75, -0.6));
      dazu("boden", [0, YF + 1, 0.02], [0.94, 1], (g, A) => blumen(g, A));
    }
    /* ---- Zaun vorn links und rechts ---- */
    for (const [x0, x1, y] of [[-XW - 0.35, -1.25, YF + 1.5], [1.3, XW + 0.45, YF + 1.6]]) dazu("aussen", [(x0 + x1) / 2, y, 0.5], [0.94, 1], (g, A) => zaun(g, A, x0, x1, y, winter));

    /* ---- Strohdach (zwei Seiten) und Firstwulst ---- */
    for (const sx of [1, -1]) dazu("dach", [sx * 1.2, YM, ZF - 0.6], [0.55, 0.75], (g, A, q, bau) => strohdach(g, A, sx, klemm((bau - 0.55) / 0.2, 0, 1), winter));
    dazu("dachfirst", [0, YM, ZF + 0.4], [0.75, 0.78], (g, A) => {
      /* Firstwulst: gebundenes Stroh, schmal, endet bündig mit den Giebeln */
      const zt = ZF + DD * Math.sqrt(1 + NEIG * NEIG) - 0.06;
      D.stumpf(g, A, [0, YB - UEG + 0.02, zt - 0.03], [0, YF + UEG - 0.02, zt - 0.03], 0.1, 0.1, winter ? [236, 240, 247] : [146, 120, 80], { deckel: winter ? [214, 218, 226] : [120, 96, 62], falten: winter ? 0 : 14, faltenLang: 1 });
    });
    /* ---- Stern auf dem vorderen Giebel ---- */
    const SP = [0, YF + UEG - 0.05, ZF + 1.25];
    if (winter) dazu("stern", SP, [0.97, 1], (g, A) => {
      D.strich(g, A, [[0, SP[1], ZF + 0.25], [0, SP[1], SP[2] - 0.3]], 0.05, HOLZ_D, {});
      stern(g, A, SP, 0.5, A.nacht, 0.3);
    });
    return { L: L, LAT: LAT, SP: SP };
  }

  function heuraufe(g, A, x, y, winter) {
    /* schräge Raufe aus Latten, darin Heu */
    const z0 = 0.85, z1 = 1.55, t = 0.45;
    D.ellipsoid(g, A, [x, y + 0.25, z0 + 0.35], [0.75, 0, 0], [0, 0.22, 0], [0, 0.05, 0.3], [150, 140, 84], {});
    for (let i = 0; i <= 8; i++) {
      const xx = x - 0.8 + i * 0.2;
      D.strich(g, A, [[xx, y + 0.02, z0], [xx, y + t, z1]], 0.03, HOLZ, {});
    }
    balken(g, A, [x - 0.85, y + t, z1], [x + 0.85, y + t, z1], 0.05, 0.05, HOLZ_D);
    balken(g, A, [x - 0.85, y + 0.03, z0], [x + 0.85, y + 0.03, z0], 0.05, 0.05, HOLZ_D);
    void winter;
  }
  function strohballen(g, A, x, y, w) {
    const c = Math.cos(w), s = Math.sin(w), b = 0.45, t = 0.3, h = 0.36;
    const P = (dx, dy, z) => [x + dx * c - dy * s, y + dx * s + dy * c, z];
    const ecken = [[-b, -t], [b, -t], [b, t], [-b, t]];
    const seiten = [];
    for (let i = 0; i < 4; i++) { const a = ecken[i], e = ecken[(i + 1) % 4]; seiten.push([P(a[0], a[1], h), P(e[0], e[1], h), P(e[0], e[1], 0), P(a[0], a[1], 0)]); }
    for (let i = 0; i < 4; i++) {
      const pts = seiten[i];
      const u = nrm(sub(pts[1], pts[0])), L2 = Math.hypot(...sub(pts[1], pts[0]));
      D.flaeche(g, A, { name: "ballen" + i + x, o: pts[0], u: u, v: [0, 0, -1], w: L2, h: h, n: nrm(D.v.kreuz(u, [0, 0, -1])), malen: (g2, F) => ballenMalen(g2, F, i % 2) });
    }
    D.flaeche(g, A, { name: "ballenD" + x, o: P(-b, -t, h), u: [c, s, 0], v: [-s, c, 0], w: 2 * b, h: 2 * t, malen: (g2, F) => ballenMalen(g2, F, 2) });
  }
  function ballenMalen(g, F, art) {
    const rng = ST.zufall(art + 3);
    g.fillStyle = "rgb(206,176,108)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
    rausch(g, 0, 0, F.w, F.h, 0.6, 0.35, art * 7, 4);
    if (F.px > 18) {
      g.lineWidth = Math.max(0.005, 0.9 / F.px);
      g.strokeStyle = "rgba(120,90,50,0.45)"; g.beginPath();
      for (let i = 0; i < F.w * F.h * 400; i++) { const x = rng() * F.w, y = rng() * F.h, a = art === 2 ? rng() * TAU : (rng() - 0.5) * 0.6; g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 0.07, y + Math.sin(a) * 0.07); }
      g.stroke();
    }
    /* zwei Bindeschnüre */
    g.fillStyle = "rgba(110,80,50,0.9)";
    if (art !== 1) for (const f of [0.3, 0.7]) g.fillRect(F.w * f - 0.008, -0.1, 0.016, F.h + 0.2);
  }
  function trog(g, A, x, y) {
    /* Holztrog mit Wasser (Frühling) */
    const L = 0.6, B = 0.25, H = 0.45;
    balken(g, A, [x, y - L, H / 2], [x, y + L, H / 2], B * 2, H, [110, 88, 66]);
    D.vieleck(g, A, [[x - B + 0.05, y - L + 0.05, H + 0.005], [x + B - 0.05, y - L + 0.05, H + 0.005], [x + B - 0.05, y + L - 0.05, H + 0.005], [x - B + 0.05, y + L - 0.05, H + 0.005]], [90, 120, 140], { n: [0, 0, 1] });
  }
  function blumen(g, A) {
    /* Primeln und Narzissen am Stallrand */
    if (A.silhouette || A.s < 14) return;
    const rng = ST.zufall(71);
    const farben = [[240, 210, 70], [250, 240, 200], [200, 90, 150], [150, 110, 200], [240, 150, 60]];
    for (let i = 0; i < 70; i++) {
      const seite = rng() < 0.5 ? -1 : 1;
      const x = seite * (XW + 0.15 + rng() * 0.5), y = YB + rng() * (YF - YB + 0.6);
      const q = A.bild([x, y, 0.08 + rng() * 0.08]);
      g.fillStyle = A.farbeK([70, 120, 50], [0, 0, 1]);
      g.beginPath(); g.ellipse(q[0], q[1] + A.s * 0.04, A.s * 0.05, A.s * 0.025, 0, 0, TAU); g.fill();
      g.fillStyle = A.farbeK(farben[Math.floor(rng() * farben.length)], [0.3, 0.3, 0.9]);
      g.beginPath(); g.arc(q[0], q[1], Math.max(0.8, A.s * 0.025), 0, TAU); g.fill();
    }
  }
  function laterne(g, A, p) {
    const eisen = [40, 38, 38];
    D.strich(g, A, [[p[0], p[1], ZT - 0.08], add(p, [0, 0, 0.3])], 0.012, eisen, {});
    D.ring(g, A, add(p, [0, 0, 0.3]), 0.04, 0.012, eisen, null);
    D.stumpf(g, A, add(p, [0, 0, 0.18]), add(p, [0, 0, 0.26]), 0.11, 0.03, eisen, { glanz: 0.4 });
    const an = A.nacht > 0.02;
    D.stumpf(g, A, add(p, [0, 0, -0.14]), add(p, [0, 0, 0.18]), 0.085, 0.085, an ? [255, 214, 140] : [196, 206, 214], { deckel: false, leucht: an, glanz: an ? 0 : 0.8 });
    for (let i = 0; i < 4; i++) { const w = i * Math.PI / 2 + 0.3; D.strich(g, A, [add(p, [Math.cos(w) * 0.088, Math.sin(w) * 0.088, -0.14]), add(p, [Math.cos(w) * 0.088, Math.sin(w) * 0.088, 0.18])], 0.012, eisen, {}); }
    D.flamme(g, A, add(p, [0, 0, -0.06]), 0.12, 0.5);
    D.stumpf(g, A, add(p, [0, 0, -0.2]), add(p, [0, 0, -0.14]), 0.1, 0.1, eisen, {});
  }
  function zaun(g, A, x0, x1, y, winter) {
    /* Holzzaun aus Pfählen und zwei Querlatten */
    const n = Math.max(2, Math.round((x1 - x0) / 0.5));
    for (let i = 0; i <= n; i++) {
      const x = x0 + (x1 - x0) * i / n;
      D.stumpf(g, A, [x, y, 0], [x, y, 0.95 + (i % 2) * 0.05], 0.045, 0.04, RINDE, { falten: 5, faltenLang: 1, deckel: winter ? [246, 248, 252] : [170, 146, 110] });
    }
    for (const z of [0.35, 0.78]) balken(g, A, [x0 - 0.05, y + 0.05, z], [x1 + 0.05, y + 0.05, z], 0.05, 0.07, HOLZ);
    if (winter) for (const z of [0.82]) D.strich(g, A, [[x0, y + 0.05, z + 0.02], [x1, y + 0.05, z + 0.02]], 0.05, [248, 250, 254], {});
  }
  /* Strohdach einer Seite (sx = +1 rechts, −1 links): Oberfläche, Traufkante, Giebelkanten */
  function strohdach(g, A, sx, k, winter) {
    if (k <= 0) return;
    const n = nrm([sx * NEIG, 0, 1]);
    const ztop = ZF + DD * Math.sqrt(1 + NEIG * NEIG);
    const xE = sx * (XW + UE), zE = ZT - UE * NEIG;
    const y0 = YB - UEG, y1 = YF + UEG;
    /* Stroh wird von der Traufe zum First hin aufgebracht (k = Anteil) */
    const Et = add([xE, 0, zE], mul(n, DD));
    const Tt = [0, 0, ztop];
    const Rt = add(Et, mul(sub(Tt, Et), k));
    const sv = sub(Et, Rt), Ls = Math.hypot(sv[0], sv[1], sv[2]);
    const v = mul(sv, 1 / Ls);
    const u = sx > 0 ? [0, -1, 0] : [0, 1, 0];
    const o = [Rt[0], sx > 0 ? y1 : y0, Rt[2]];
    D.flaeche(g, A, { name: "stroh" + sx, o: o, u: u, v: v, w: y1 - y0, h: Ls, malen: (g2, F) => strohMalen(g2, F, winter && k >= 1, sx > 0 ? 3 : 4) });
    /* Traufkante: abgeschnittene Halmenden */
    const Eb = [xE, 0, zE];
    D.flaeche(g, A, { name: "traufe" + sx, o: [Et[0], sx > 0 ? y1 : y0, Et[2]], u: u, v: nrm(sub(Eb, Et)), w: y1 - y0, h: DD, malen: (g2, F) => {
      g2.fillStyle = "rgb(150,118,72)"; g2.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      if (F.px > 15) { const rng = ST.zufall(5 + sx); g2.fillStyle = "rgba(90,66,40,0.55)"; for (let i = 0; i < F.w * 120; i++) { g2.beginPath(); g2.arc(rng() * F.w, rng() * F.h, 0.006 + rng() * 0.006, 0, TAU); g2.fill(); } }
      rausch(g2, 0, 0, F.w, F.h, 0.8, 0.3, 9, 4);
      if (winter && k >= 1) { g2.fillStyle = "rgba(246,249,253,0.95)"; g2.beginPath(); g2.moveTo(-0.1, -0.1); for (let x = 0; x <= F.w + 0.1; x += 0.15) g2.lineTo(x, 0.03 + Math.abs(Math.sin(x * 5.3)) * 0.05); g2.lineTo(F.w + 0.1, -0.1); g2.fill(); }
    } });
    /* Giebelkanten vorn und hinten: sichtbare Strohdicke */
    for (const [y, nach] of [[y1, 1], [y0, -1]]) {
      const a = [Rt[0], y, Rt[2]], b = [Et[0], y, Et[2]], c = [xE, y, zE], d = add([Rt[0], y, Rt[2]], mul(n, -DD));
      D.vieleck(g, A, (sx * nach > 0) ? [a, d, c, b] : [a, b, c, d], [132, 104, 64], { naht: true });
      if (A.s > 25 && !A.silhouette && A.zumAuge([0, nach, 0]) > 0) {
        /* Halmenden an der Schnittkante */
        const rng = ST.zufall(31 + sx + nach);
        g.fillStyle = A.farbeK([96, 72, 44], [0, nach, 0.3], 0.6);
        for (let i = 0; i < 50; i++) {
          const t = rng(), w = rng();
          const p = add(add(d, mul(sub(c, d), t)), mul(sub(a, d), w));
          const q = A.bild(p); g.beginPath(); g.arc(q[0], q[1], Math.max(0.5, A.s * 0.006), 0, TAU); g.fill();
        }
      }
    }
    if (winter && k >= 1 && !A.silhouette) {
      /* Schneewulst an der Traufe (hängt gerundet über) und auf den
         Ortgängen vorn und hinten – der Schnee hat sichtbare Dicke */
      const traufe = [];
      for (let y = y0 + 0.02; y <= y1 - 0.01; y += 0.18) traufe.push([Et[0] - sx * 0.04, y, Et[2] - 0.01]);
      traufe.push([Et[0] - sx * 0.04, y1 - 0.02, Et[2] - 0.01]);
      D.schneeWulst(g, A, traufe, [sx, 0, -0.3], 0.13, { saat: 40 + sx });
      for (const [y, nach] of [[y1 - 0.02, 1], [y0 + 0.02, -1]]) {
        if (A.zumAuge([0, nach, 0.4]) < -0.1) continue;
        const ort = [];
        for (let t = 0.03; t <= 1.001; t += 0.12) { const p = add(Et, mul(sub(Tt, Et), t)); ort.push([p[0], y, p[2] + 0.005]); }
        D.schneeWulst(g, A, ort, [0, nach, 0], 0.08, { saat: 50 + sx * 3 + nach });
      }
    }
    if (winter && k >= 1 && A.s > 12) {
      /* Eiszapfen an der Traufe */
      const rng = ST.zufall(sx + 20);
      for (let y = y0 + 0.2; y < y1 - 0.1; y += 0.25 + rng() * 0.45) {
        const l = 0.05 + Math.pow(rng(), 2) * 0.3, p = [xE + sx * 0.02, y, zE - 0.01];
        D.stumpf(g, A, p, add(p, [0, 0, -l]), 0.018, 0.002, [220, 234, 246], { deckel: false, glanz: 1 });
      }
    }
  }

  /* =====================================================================
     ZEICHNEN — Reihenfolge nach Ebenen (siehe oben)
     ===================================================================== */
  function sichtbarVon(A, name) { return A.zumAuge(EBENEN[name]) > 0; }
  function allesMalen(g, A, bau, o, F, zeit) {
    const S = stueckliste(o);
    A.bauStand = bau;
    const winter = A.winter;
    const reihe = [];
    const aussenVorn = (p) => {
      /* trennende Ebene suchen: liegt der Punkt außerhalb einer Wand, entscheidet deren Seite */
      if (p[1] > YF) return sichtbarVon(A, "vorn");
      if (p[1] < YB) return sichtbarVon(A, "hinten");
      if (p[0] < -XW) return sichtbarVon(A, "links");
      return sichtbarVon(A, "rechts");
    };
    for (const st of S.L) {
      if (bau < st.bau[0]) continue;
      const q = klemm((bau - st.bau[0]) / Math.max(1e-6, st.bau[1] - st.bau[0]), 0, 1);
      let schicht;
      if (st.art === "boden") schicht = 0;
      else if (st.art === "dach") schicht = 7;
      else if (st.art === "dachfirst") schicht = 7.5;
      else if (st.art === "stern") schicht = 8;
      else if (st.art === "dachstuhl") schicht = 6;
      else if (st.art === "aussen") schicht = aussenVorn(st.c) ? 5 : 1;
      else if (st.ebenen) schicht = st.ebenen.some((e) => sichtbarVon(A, e)) ? 4 : 2;
      else schicht = 3;          // innen
      reihe.push({ z: schicht * 1e3 + A.tief(st.c), fn: () => st.fn(g, A, q, bau, zeit) });
    }
    /* Figuren */
    if (bau >= 0.95) {
      const B = besetzung(A.jahr);
      for (const f of B) {
        const p = f.p, drin = innen(p);
        const schicht = drin ? 3 : (aussenVorn(p) ? 5 : 1);
        const pz = [p[0], p[1], (f.dz || 0)];
        reihe.push({ z: schicht * 1e3 + A.tief(add(pz, [0, 0, 0.5])) + (f.name === "kind" ? 0.05 : 0), fn: () => {
          const licht = figurLicht(A, pz, S.LAT, winter);
          D.figurZeichnen(g, A, f.fig, { p: pz, phi: f.phi, k: 1, sk: licht.sk, warm: licht.warm, warmDir: licht.warmDir }, zeit);
        } });
      }
    }
    reihe.sort((a, b) => a.z - b.z);
    for (const r of reihe) r.fn();
    /* Lichtschein für die Szene */
    if (F && F.leuchtPunkt && A.nacht > 0 && bau >= 1) {
      /* Laterne: nur wenn man durch die offene Front (oder von der Seite) hineinsieht –
         von hinten verdeckt der Stall ihren Schein */
      const sicht = A.zumAuge([0, 1, 0]);
      if (sicht > -0.25) {
        const p = A.bild(S.LAT);
        F.leuchtPunkt(p[0], p[1], A.s * 1.6, "255,190,110", 0.9 * klemm(sicht + 0.25, 0, 1), true);
      }
      if (winter) { const st = A.bild(S.SP); F.leuchtPunkt(st[0], st[1], A.s * 2.6, "255,220,140", 1.0, false); }
    }
  }
  /* Licht an einer Figur: Sonne blockiert vom Dach? Laterne in der Nähe? */
  function figurLicht(A, p, LAT, winter) {
    /* Sonnenrichtung im Modellraum (Licht ist im Kameraraum fest) */
    const c = A.c, s = A.sn;
    const Lm = [LI[0] * c + LI[1] * s, -LI[0] * s + LI[1] * c, LI[2]];
    const q = add(p, [0, 0, 1.0]);
    /* Strahl zur Sonne: trifft er das Dach, bevor er den Dachgrundriss verlässt? */
    let unterDach = false;
    for (let t = 0; t < 8; t += 0.08) {
      const h = add(q, mul(Lm, t));
      if (h[0] < -XW - UE || h[0] > XW + UE || h[1] < YB - UEG || h[1] > YF + UEG) break;
      if (h[2] >= ZF - Math.abs(h[0]) * NEIG) { unterDach = true; break; }
    }
    const sk = unterDach ? 0.12 : 1;
    let warm = null, warmDir = null;
    if (A.nacht > 0) {
      const d = sub(LAT, q), dist = Math.hypot(d[0], d[1], d[2]);
      const k = A.nacht * Math.max(0, 1 - dist / 4.2) * 0.85 + A.nacht * 0.12;
      warm = [k * 1.0, k * 0.66, k * 0.34];
      warmDir = nrm(d);
    }
    void winter;
    return { sk: sk, warm: warm, warmDir: warmDir };
  }

  function schattenMalen(g, A, bau) {
    if (bau < 0.2) return;
    const huelle = (pts) => { D.pfad(g, D.huelle2(pts.map((p) => A.bild(p)))); g.fillStyle = "#000"; g.fill(); };
    if (bau >= 0.3) huelle([[-XW, YB, 0], [XW, YB, 0], [XW, YB, ZT], [-XW, YB, ZT], [0, YB, ZF]]);
    if (bau >= 0.33) for (const sx of [-1, 1]) huelle([[sx * XW, YB, 0], [sx * XW, YF, 0], [sx * XW, YF, 1.45], [sx * XW, YB, 1.45]]);
    if (bau >= 0.55) {
      const x0 = XW + UE, zE = ZT - UE * NEIG, y0 = YB - UEG, y1 = YF + UEG, zt = ZF + 0.36;
      huelle([[-x0, y0, zE], [x0, y0, zE], [x0, y1, zE], [-x0, y1, zE], [0, y0, zt], [0, y1, zt]]);
    }
    for (const x of [-XW, XW]) D.stumpf(g, A, [x, YF, 0], [x, YF, ZT], 0.09, 0.09, [0, 0, 0], {});
    if (bau >= 0.95) for (const f of besetzung(A.jahr)) D.figurZeichnen(g, A, f.fig, { p: [f.p[0], f.p[1], f.dz || 0], phi: f.phi, k: 1 });
  }

  ST.modell("krippe", {
    name: "Krippe", gruppe: "Weihnachten", grund: [7.2, 5.4], hoehe: 5.2, bauzeit: 3 * 60,
    bauen(M, o) {
      const bau = o.bau == null ? 1 : o.bau;
      const zustand = { gier: 0 };
      M.teil("krippe", { mitte: [0, 0, 1.5] });
      M.figur({
        x: 0, y: 0, z: 0, breite: 0.1, hoehe: 0.1, schatten: true,
        malen(g, s, F) {
          if (!F.schatten) zustand.gier = F.gier || 0;
          const A = new D.Ansicht({ s: s, gier: zustand.gier, Z: F.Z, jahr: F.jahr, schatten: !!F.schatten });
          if (F.schatten) { D.schattenPuffer(g, (h) => schattenMalen(h, A, bau)); return; }
          D.weichMalen(g, (g2) => allesMalen(g2, A, bau, o, F, null));
        }
      });
      M.teil("huelle", { schatten: false, mitte: [0, 0, -50] });
      const leer = { malen: null, keinLicht: true, keinAo: true };
      M.flaeche(Object.assign({ name: "h0", o: [-3.6, -2.7, 0], u: [1, 0, 0], v: [0, 1, 0], w: 7.2, h: 5.4 }, leer));
      M.flaeche(Object.assign({ name: "h1", o: [-1, YF - 1, ZF + 2.0], u: [1, 0, 0], v: [0, 1, 0], w: 2, h: 2 }, leer));
      /* Platz für den ganzen Bodenschatten (sonst schneidet die Spritekante ihn ab) */
      D.schattenRaum(M, o, [[0, 4.4], [ZT, Math.hypot(XW + UE, (YF - YB) / 2 + UEG + Math.abs(YM))], [ZF + 0.4, Math.hypot(0.4, (YF - YB) / 2 + UEG + Math.abs(YM))], [ZF + 1.8, YF + UEG + 0.6]]);
      /* Kontaktschatten erst, wenn etwas auf dem Fundament steht (sonst läge
         ein dunkles Viereck über der offenen Baugrube) */
      if (bau >= 0.33) {
        /* erst wenn Wände stehen – solange nur Pfosten stehen, würfe der
           Fuß den Kontaktschatten eines ganzen Stalls */
        M.teil("fuss", { schatten: true, mitte: [0, 0, -40] });
        M.flaeche(Object.assign({ name: "fuss", o: [-XW, YB, 0.01], u: [1, 0, 0], v: [0, 1, 0], w: 2 * XW, h: YF - YB }, leer));
      }
      /* Der Schein von Laterne und Stern kommt aus malen() (je nach Blickwinkel);
         der Lichtfleck am Boden ist ins Stroh gemalt – so scheint nichts durch Wände */
    }
  });
})();
