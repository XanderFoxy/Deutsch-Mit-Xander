/* =====================================================================
   KINDERKARUSSELL — nostalgisch, mit Holzpferden und kleinen Kutschen
   ---------------------------------------------------------------------
   XANDER: „Das soll keine Comic Grafik sein. Das soll noch viel mehr am
   Realismus dran sein." · „Man soll sie in jedem Winkel aufstellen
   können. Man soll das Fundament sehen beim Aufbauen." · „ohne
   Pixelkanten und komische Vektorrückstände." · „Ich möchte einen
   Liebreiz zur Weihnachtsdeko … mit Schmücken, mit Schnee".

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

/* KARUSSELL-MODELL */
/* =====================================================================
   DAS KARUSSELL
   ---------------------------------------------------------------------
   Vorbild: die nostalgischen Kinderkarussells auf deutschen
   Weihnachtsmärkten (Bauart der Galopper um 1900): Holzpodest mit zwei
   Stufen, darauf die Drehbühne mit Dielen; außen zwölf geschnitzte,
   lackierte Pferde (Schimmel, Apfelschimmel, Rappe, Fuchs) im Galopp an
   gedrehten Messingstangen, die beim Fahren auf und ab gehen; innen
   zwei Märchenkutschen, zwei Schlitten und vier Ponys; in der Mitte die
   Säule mit Spiegeln und gemalten Winterbildern; oben das gestreifte
   Zeltdach, das zwischen Mittelmast und Traufe durchhängt, mit
   vergoldeten Rippen, darauf die Laterne mit Kuppel, Stern und Wimpel;
   außen der Behang mit Spiegeln, Blütenranken, Bogenkante und zwei
   Reihen Glühbirnen – nachts rund 300 Lichtpunkte.

   WINTER: Schneehaube auf dem Dach, Schnee auf der Traufkante,
   Tannengirlande mit Kugeln und roten Schleifen, Felle in den
   Schlitten, goldener Stern auf der Spitze.
   FRÜHLING: kein Schnee, Buchsgirlande mit Blüten und rosa Bändern,
   Polster statt Fell, rote Kuppel und grüner Wimpel.

   WAS SICH DREHT, WIRD JEDES BILD GEMALT (M.lebendig): Bühne, Pferde,
   Stangen, Kutschen, Mittelsäule, Dach mit Behang und Birnen. Pferde
   und Kutschen kommen aus dem Figurenspeicher (je Drehstufe einmal
   gemalt); gleichfarbiger Kleinkram (Birnen, Rippen, Zierrat) wird in
   einem einzigen Pfad gesammelt gezeichnet.
   Im Sprite steht nur, was sich nicht bewegt: das Podest und ein etwas
   kleineres Ersatzdach (damit man das Karussell anklicken kann; es
   liegt vollständig unter dem echten, sich drehenden Dach).
   Reihenfolge je Bild: Bühne → (Pferde, Stangen, Kutschen, Säule nach
   Tiefe) → Dach mit Behang (liegt höher als alles darunter, also dort,
   wo es sich überdeckt, immer näher am Auge) → Lichtschein.

   AUFBAU (o.bau): Baugrube unter Gelände mit Aushub → Ringfundament
   aus Beton mit Schalungsfugen → Holzpodest → Mittelsäule → gebogene
   Sparren → Dachbahnen → Behang → Drehbühne → Pferde → Kutschen →
   Lichter.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, D = ST.drechsel, PI = ST.pinsel;
  const { add, sub, mul, nrm, mix, laenge } = D.v;
  const TAU = Math.PI * 2;
  const rgbS = D.rgbS;
  const klemm = (x, a, b) => (x < a ? a : x > b ? b : x);

  /* ---------------- Maße (Meter) ---------------- */
  const POD_R = 4.6, POD_R2 = 4.32, POD_Z1 = 0.18, POD_Z = 0.36;   // Podest mit zwei Stufen
  const BUEHNE_R = 4.08, BUEHNE_Z = 0.52;                          // Drehbühne (Oberkante)
  const PFERD_R = 3.3, KUTSCHE_R = 2.15, PONY_R = 2.3;
  const SAEULE_R = 0.78;
  const DACH_R = 4.46, BEH_O = 4.05, BEH_U = 3.35;                  // Behang oben/unten
  const HIMMEL_Z = 3.4;                                             // Unterseite der Decke
  const TOP_R = 0.72, TOP_Z = 6.05;                                 // oberer Dachring (Laterne)
  const PROFIL = [[DACH_R, BEH_O], [2.75, 4.72], [1.45, 5.55], [TOP_R, TOP_Z]];   // Zeltdach, hängt durch
  const N_BIRNE_RIPPE = 10;
  const OMEGA = TAU / 14;                                           // eine Runde in 14 s
  const N_PFERD = 12, N_SEG = 16, N_BEH = 32;
  const FA = {
    rot: [164, 28, 38], creme: [242, 232, 210], gold: [220, 174, 74], gruen: [28, 84, 62], blau: [34, 58, 118],
    messing: [214, 178, 98], bordeaux: [110, 24, 40], holz: [156, 116, 78], dunkel: [40, 34, 32]
  };

  /* =====================================================================
     HOLZPFERD — geschnitzt und lackiert, im Galopp (Figurraum: Blick +y,
     rechte Seite +x = Außenseite mit der prächtigen Mähne)
     ---------------------------------------------------------------------
     Wie ein Karussellschnitzer ein Pferd aus Lindenholz schnitzt: der
     Rumpf als Folge von Querschnitten (Loft) von der Kruppe über die
     Sattellage und den Widerrist bis zur Brust, der Hals kräftig und
     gebogen, der Kopf mit Stirnprofil, Ganaschen und eigenem Maul; die
     Beine schlank mit Vorderfußwurzel- bzw. Sprunggelenk und Fessel; die
     Mähne aus geschnitzten, gebogenen Strähnen. Lack mit mattem Glanz
     (Holz, kein Kunststoff).
     ===================================================================== */
  const PFERDE = {};
  function pferd(v) {
    /* nur vier Arten: gleiche Art = dieselbe Figur, dann teilen sich die
       Pferde 1, 5 und 9 (je 120° versetzt) die gespeicherten Drehbilder */
    v = v % 4;
    if (PFERDE[v]) return PFERDE[v];
    const art = [
      { fell: [238, 232, 220], maehne: [206, 164, 84], sattel: [158, 34, 42], decke: [36, 60, 120], huf: [206, 164, 76], stein: [200, 40, 60] },
      { fell: [168, 166, 166], maehne: [236, 232, 224], sattel: [30, 90, 64], decke: [150, 30, 42], huf: [58, 50, 46], apfel: true, stein: [40, 90, 190] },
      { fell: [52, 46, 46], maehne: [206, 164, 84], sattel: [150, 30, 40], decke: [28, 84, 62], huf: [206, 164, 76], stein: [230, 200, 80] },
      { fell: [150, 94, 60], maehne: [236, 222, 190], sattel: [34, 58, 118], decke: [110, 28, 42], huf: [58, 50, 46], stein: [60, 150, 90] }
    ][v % 4];
    const F = new D.Figur();
    const fell = art.fell, GL = 0.25;
    const R = (y, zc, hw, hh) => ({ c: [0, y, zc], a: [hw, 0, 0], b: [0, 0, hh] });
    /* Rumpf: Kruppe → Sattellage (leicht eingesenkt) → Widerrist → Brust */
    F.loft([R(-0.5, 1.0, 0.05, 0.07), R(-0.46, 1.02, 0.12, 0.15), R(-0.37, 1.02, 0.165, 0.19), R(-0.22, 1.0, 0.18, 0.19), R(-0.05, 0.97, 0.182, 0.18),
      R(0.1, 0.97, 0.176, 0.186), R(0.24, 1.0, 0.16, 0.19), R(0.34, 1.01, 0.138, 0.17), R(0.42, 0.99, 0.1, 0.13), R(0.47, 0.97, 0.04, 0.06)], fell, { n: 18, glanz: GL });
    /* Beine: Schulter/Hüfte → Ellenbogen/Knie → Vorderfußwurzel/Sprunggelenk → Röhre → Fessel → Huf */
    const bein = (pts, rad) => {
      F.rohr(pts, rad, fell, { n: 10, glanz: GL });
      const e = pts[pts.length - 1], d = nrm(sub(e, pts[pts.length - 2]));
      F.zyl(e, add(e, mul(d, 0.05)), 0.028, 0.034, art.huf, { glanz: 0.6, deckel: mix(art.huf, [0, 0, 0], 0.3) });
    };
    /* vorn links: hoch angezogen, im Karpalgelenk gebeugt */
    bein([[-0.085, 0.28, 0.95], [-0.095, 0.36, 0.8], [-0.1, 0.44, 0.72], [-0.1, 0.46, 0.68], [-0.1, 0.42, 0.6], [-0.1, 0.37, 0.53], [-0.1, 0.4, 0.49]],
      [0.075, 0.055, 0.04, 0.034, 0.024, 0.03, 0.023]);
    /* vorn rechts: weit nach vorn gestreckt */
    bein([[0.085, 0.28, 0.95], [0.095, 0.4, 0.84], [0.1, 0.5, 0.78], [0.1, 0.54, 0.76], [0.1, 0.63, 0.69], [0.1, 0.72, 0.63], [0.1, 0.77, 0.61]],
      [0.075, 0.055, 0.04, 0.034, 0.024, 0.03, 0.023]);
    /* hinten: kräftige Keule, Sprunggelenk, lange Röhre nach hinten */
    bein([[-0.09, -0.3, 0.98], [-0.105, -0.26, 0.8], [-0.1, -0.36, 0.7], [-0.1, -0.48, 0.63], [-0.1, -0.55, 0.52], [-0.1, -0.6, 0.43], [-0.1, -0.66, 0.4]],
      [0.11, 0.08, 0.05, 0.036, 0.024, 0.03, 0.023]);
    bein([[0.09, -0.3, 0.98], [0.105, -0.24, 0.78], [0.1, -0.34, 0.68], [0.1, -0.48, 0.61], [0.1, -0.6, 0.53], [0.1, -0.69, 0.45], [0.1, -0.76, 0.43]],
      [0.11, 0.08, 0.05, 0.036, 0.024, 0.03, 0.023]);
    if (art.apfel) {
      /* Apfelschimmel: runde, dunklere Tupfen auf Rumpf und Kruppe */
      const kv = [];
      for (let i = 0; i < 30; i++) { const th = (i * 2.39) % TAU, ph = ((i * 0.41) % 1.3) - 0.55; const r = 0.05 + (i % 3) * 0.015; const k = []; for (let j = 0; j <= 6; j++) { const a = j / 6 * TAU; k.push([th + Math.cos(a) * r, ph + Math.sin(a) * r * 0.8]); } kv.push(k); }
      F.linien([0, -0.05, 0.98], [0.184, 0, 0], [0, 0.4, 0], [0, 0, 0.19], kv, [118, 118, 124], 0.012, { alpha: 0.45, ab: 40 });
    }
    /* Hals: kräftig, gebogen, hoch getragen */
    F.rohr([[0, 0.26, 1.06], [0, 0.36, 1.22], [0, 0.45, 1.37], [0, 0.52, 1.49], [0, 0.56, 1.56]], [[0.12, 0.17], [0.105, 0.14], [0.088, 0.112], [0.075, 0.092], [0.066, 0.08]], fell, { n: 14, glanz: GL });
    /* Kopf: vom Genick zur Schnauze; Ganaschen tief und breit, Nasenrücken
       gerade, Maul etwas breiter als der Nasenrücken */
    const gen = [0, 0.56, 1.58], d = nrm([0, 0.56, -0.83]), vorn = nrm([0, 0.83, 0.56]);
    const at = (t, o) => add(add(gen, mul(d, 0.37 * t)), mul(vorn, o || 0));
    F.rohr([at(-0.06, -0.01), at(0.1, -0.022), at(0.3, -0.012), at(0.55, 0.004), at(0.8, 0.0), at(0.95, -0.004), at(1.02, -0.006)],
      [[0.056, 0.078], [0.07, 0.1], [0.062, 0.084], [0.05, 0.064], [0.052, 0.066], [0.046, 0.058], [0.02, 0.028]], fell, { n: 14, glanz: GL });
    /* Maul: Unterlippe und Maulspalte */
    F.ellR(add(at(0.9, -0.05), [0, 0, 0]), d, 0.05, 0.036, 0.024, mix(fell, [80, 60, 60], 0.12), { glanz: GL, b: 0.005 });
    for (const sx of [-1, 1]) {
      /* Ohren: gespitzt, innen dunkler */
      F.rohr([add(gen, [sx * 0.035, -0.01, 0.03]), add(gen, [sx * 0.045, -0.015, 0.09]), add(gen, [sx * 0.05, -0.02, 0.14])], [[0.02, 0.012], [0.017, 0.01], [0.003, 0.003]], fell, { n: 8, glanz: GL, seite: [0, 1, 0] });
      F.ellA(add(gen, [sx * 0.046, 0.0, 0.085]), [0, 0, 0.03], [0, 0.008, 0], [sx * 0.004, 0.003, 0], mix(fell, [50, 34, 34], 0.45), { flach: true, b: 0.02, ab: 45 });
      /* Auge: dunkel mit Lichtpunkt, darüber der Knochenbogen */
      const au = add(at(0.28, 0.02), [sx * 0.062, 0, 0]);
      F.ellA(au, mul(d, 0.017), mul(vorn, 0.012), [sx * 0.006, 0, 0], [26, 20, 18], { flach: true, b: 0.03, ab: 22 });
      F.ellA(add(au, [sx * 0.002, 0, 0.004]), [0, 0.004, 0], [0, 0, 0.004], [sx * 0.004, 0, 0], [255, 255, 255], { flach: true, b: 0.04, ab: 70 });
      F.strich([add(au, add(mul(d, -0.02), mul(vorn, 0.016))), add(au, mul(vorn, 0.02)), add(au, add(mul(d, 0.02), mul(vorn, 0.014)))], 0.006, mix(fell, [40, 30, 28], 0.3), { b: 0.03, ab: 50 });
      /* Ganasche: runde Kaumuskelplatte */
      F.ellA(add(at(0.16, -0.04), [sx * 0.064, 0, 0]), mul(d, 0.05), mul(vorn, 0.045), [sx * 0.012, 0, 0], fell, { b: 0.01, glanz: GL, ab: 20 });
      /* Nüstern und Maulspalte */
      F.ellA(add(at(0.94, 0.03), [sx * 0.032, 0, 0]), mul(d, 0.014), mul(vorn, 0.01), [sx * 0.006, 0, 0], [40, 26, 26], { flach: true, b: 0.03, ab: 35 });
      F.strich([add(at(0.86, -0.045), [sx * 0.048, 0, 0]), add(at(1.0, -0.035), [sx * 0.03, 0, 0])], 0.006, [60, 36, 36], { b: 0.03, ab: 50 });
    }
    /* Mähne: geschnitzte Strähnen (flache, gebogene Bänder) auf der
       Außenseite üppig, innen nur kurz; dazu der Schopf */
    const kamm = (t) => [0.01, 0.28 + t * 0.28, 1.24 + t * 0.36];
    for (let i = 0; i < 9; i++) {
      const t = i / 8, c = kamm(t), w = 0.012 * Math.sin(i * 2.1);
      F.rohr([c, add(c, [0.05, -0.015, -0.04]), add(c, [0.09, -0.03 + w, -0.12]), add(c, [0.085, -0.02, -0.21 + t * 0.04]), add(c, [0.06, 0.0, -0.26 + t * 0.06])],
        [[0.03, 0.012], [0.036, 0.012], [0.032, 0.011], [0.022, 0.009], [0.006, 0.004]], art.maehne, { n: 8, glanz: 0.35, seite: [0, 1, 0], b: 0.01 });
    }
    for (let i = 0; i < 5; i++) {
      const t = 0.1 + i / 5, c = kamm(t);
      F.rohr([c, add(c, [-0.04, -0.01, -0.04]), add(c, [-0.06, -0.02, -0.11])], [[0.025, 0.01], [0.022, 0.009], [0.005, 0.003]], art.maehne, { n: 8, glanz: 0.35, seite: [0, 1, 0], b: 0.004 });
    }
    F.rohr([add(gen, [0.005, 0.0, 0.06]), add(gen, [0.02, 0.06, 0.02]), add(gen, [0.03, 0.1, -0.05])], [[0.03, 0.01], [0.028, 0.01], [0.006, 0.004]], art.maehne, { n: 8, glanz: 0.35, seite: [1, 0, 0], b: 0.03 });
    /* Schweif: drei geschnitzte, wehende Strähnen */
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * 0.025;
      F.rohr([[x, -0.49, 1.06], [x + 0.02, -0.6, 1.04], [x + 0.04, -0.7, 0.94 - i * 0.03], [x + 0.03, -0.74, 0.8 - i * 0.04], [x + 0.05, -0.72, 0.68 - i * 0.05]],
        [[0.035, 0.018], [0.04, 0.016], [0.036, 0.014], [0.026, 0.01], [0.006, 0.004]], art.maehne, { n: 8, glanz: 0.35, seite: [1, 0, 0] });
    }
    /* Sattel mit Horn und hoher Rückenlehne */
    F.ellR([0, -0.04, 1.14], [0, 1, 0], 0.2, 0.19, 0.035, art.sattel, { glanz: 0.4, b: 0.012 });
    F.ellR([0, -0.2, 1.18], [0, 0.35, 1], 0.045, 0.13, 0.024, art.sattel, { glanz: 0.4, b: 0.018 });
    F.ellR([0, -0.215, 1.225], [0, 0.35, 1], 0.012, 0.09, 0.014, FA.gold, { glanz: 0.8, b: 0.02, ab: 30 });
    F.kap([0, 0.12, 1.16], [0, 0.15, 1.26], 0.032, 0.022, FA.gold, { glanz: 0.8, b: 0.02 });
    F.ell([0, 0.155, 1.275], 0.032, 0.032, 0.022, FA.gold, { glanz: 0.9, b: 0.025 });
    /* Schabracke beidseitig: Goldborte, Quaste, Schmuckstein */
    for (const sx of [-1, 1]) {
      const u = sx > 0 ? [0, -1, 0] : [0, 1, 0];
      F.flaeche({ name: "decke" + sx, o: [sx * 0.19, sx > 0 ? 0.16 : -0.24, 1.14], u: u, v: [sx * 0.2, 0, -1], w: 0.4, h: 0.32, n: [sx, 0, 0.25],
        umriss: [[0, 0], [0.4, 0], [0.4, 0.21], [0.34, 0.29], [0.2, 0.32], [0.06, 0.29], [0, 0.21]],
        malen: (g, Fl) => {
          g.fillStyle = rgbS(art.decke); g.fillRect(-0.1, -0.1, 0.7, 0.6);
          g.strokeStyle = rgbS(FA.gold); g.lineWidth = 0.03;
          g.beginPath(); g.moveTo(0.02, 0.19); g.lineTo(0.08, 0.27); g.lineTo(0.2, 0.3); g.lineTo(0.32, 0.27); g.lineTo(0.38, 0.19); g.stroke();
          if (Fl.px > 40) {
            g.lineWidth = 0.012; g.beginPath(); g.moveTo(0.05, 0.16); g.lineTo(0.1, 0.23); g.lineTo(0.2, 0.26); g.lineTo(0.3, 0.23); g.lineTo(0.35, 0.16); g.stroke();
            g.fillStyle = rgbS(FA.gold);
            for (let k = 0; k < 7; k++) { const x = 0.06 + k * 0.047; g.beginPath(); g.arc(x, 0.06 + 0.02 * Math.sin(k * 1.9), 0.01, 0, TAU); g.fill(); }
            g.beginPath(); g.arc(0.2, 0.15, 0.045, 0, TAU); g.fill();
            g.fillStyle = rgbS(art.stein); g.beginPath(); g.arc(0.2, 0.15, 0.028, 0, TAU); g.fill();
            g.fillStyle = "rgba(255,255,255,0.75)"; g.beginPath(); g.arc(0.19, 0.14, 0.009, 0, TAU); g.fill();
          }
          /* Abnutzung: an den Kanten ist die Farbe dünner */
          if (Fl.px > 30 && PI) PI.bleichen(g, 0, 0, 0.4, 0.32, 0.3, 0.12, 7);
        } });
      /* Steigbügelriemen und Bügel */
      F.strich([[sx * 0.18, 0.01, 1.13], [sx * 0.21, 0.02, 0.8]], 0.012, [70, 40, 30], { b: 0.04 });
      F.ellA([sx * 0.21, 0.02, 0.78], [0, 0.035, 0], [0, 0, 0.022], [0.01, 0, 0], FA.gold, { b: 0.04, glanz: 0.8 });
      /* Zaumzeug: Backenstück, Nasenriemen, Stirnrosette, Zügel */
      F.strich([add(gen, [sx * 0.05, 0.0, 0.02]), add(at(0.35, 0.0), [sx * 0.066, 0, 0]), add(at(0.82, -0.02), [sx * 0.054, 0, 0])], 0.013, FA.gold, { b: 0.03, ab: 22 });
      F.strich([add(at(0.7, 0.0), [sx * 0.056, 0, 0]), at(0.7, 0.07)], 0.012, FA.gold, { b: 0.03, ab: 30 });
      F.ellA(add(at(0.35, 0.0), [sx * 0.07, 0, 0]), [0, 0.018, 0], [0, 0, 0.018], [sx * 0.006, 0, 0], art.stein, { flach: true, b: 0.04, glanz: 0.9, ab: 40 });
      F.strich([add(at(0.85, -0.02), [sx * 0.056, 0, 0]), [sx * 0.13, 0.46, 1.14], [0, 0.14, 1.2]], 0.009, FA.rot, { b: 0.04, ab: 30 });
    }
    F.strich([add(gen, [-0.05, 0.04, 0.0]), add(gen, [0, 0.07, 0.01]), add(gen, [0.05, 0.04, 0.0])], 0.012, FA.gold, { b: 0.04, ab: 30 });
    /* Brustgeschirr mit Medaillon und Glöckchen */
    F.strich([[-0.14, 0.3, 1.12], [-0.09, 0.42, 1.02], [0, 0.455, 0.99], [0.09, 0.42, 1.02], [0.14, 0.3, 1.12]], 0.026, FA.gold, { b: 0.03, glanz: 0.8 });
    F.ellA([0, 0.46, 0.99], [0.035, 0, 0], [0, 0, 0.035], [0, 0.01, 0], art.stein, { flach: true, b: 0.05, glanz: 0.9, ab: 25 });
    for (const sx of [-1, 1]) F.ell([sx * 0.09, 0.425, 0.97], 0.02, 0.02, 0.022, FA.gold, { b: 0.05, glanz: 0.9, ab: 35 });
    return (PFERDE[v] = F);
  }

  /* Kutsche, Schwanengondel und Schlitten für den Innenkreis.
     Wände als bemalte Flächen mit geschwungenem Umriss: außen lackiert
     mit Goldschnitzerei, innen gepolstert. */
  const WAGEN = {};
  /* Profilwand bei x (Seite sx = ±1): oben = Oberkante von vorn nach
     hinten, unten = Unterkante von hinten nach vorn, je [y, z] */
  function profilWand(F, name, sx, x, oben, unten, aussenMalen, innenFarbe, ohneKante) {
    const pts = oben.concat(unten);
    let y0 = 9, y1 = -9, z0 = 9, z1 = -9;
    for (const [y, z] of pts) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
    const w = y1 - y0, h = z1 - z0;
    const rechts = sx > 0;
    const um = pts.map(([y, z]) => [rechts ? y1 - y : y - y0, z1 - z]);
    const basis = { o: [x, rechts ? y1 : y0, z1], u: rechts ? [0, -1, 0] : [0, 1, 0], v: [0, 0, -1], w: w, h: h, umriss: um, rechts: rechts, y0: y0, y1: y1, z1: z1 };
    F.flaeche(Object.assign({ name: name + "a", n: [sx, 0, 0], malen: aussenMalen }, basis));
    if (innenFarbe) F.flaeche(Object.assign({ name: name + "i", n: [-sx, 0, 0], malen: innenFarbe, b: -0.05 }, basis));
    /* vergoldete, gerundete Oberkante */
    if (!ohneKante) F.rohr(oben.map(([y, z]) => [x, y, z + 0.005]), oben.map(() => 0.02), FA.gold, { n: 8, glanz: 0.8, b: 0.02, seite: [0, 0, 1] });
    return basis;
  }
  /* Zierrad mit Speichen (beidseitig sichtbar) */
  function zierrad(F, x, y, z, r, farbe) {
    const um = []; for (let i = 0; i < 18; i++) { const a = i / 18 * TAU; um.push([r + r * Math.cos(a), r + r * Math.sin(a)]); }
    F.flaeche({ name: "rad", o: [x, y + r, z + r], u: [0, -1, 0], v: [0, 0, -1], w: 2 * r, h: 2 * r, n: [Math.sign(x), 0, 0], umriss: um, beidseitig: true, keinLicht: true, auf: 0,
      malen: (g, Fl) => {
        const A = Fl.A, gold = A.farbeK(FA.gold, Fl.n, null, 0.6), fa = A.farbeK(farbe, Fl.n);
        g.strokeStyle = gold; g.lineWidth = r * 0.16; g.beginPath(); g.arc(r, r, r * 0.9, 0, TAU); g.stroke();
        g.strokeStyle = fa; g.lineWidth = r * 0.07;
        g.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; g.moveTo(r, r); g.lineTo(r + Math.cos(a) * r * 0.84, r + Math.sin(a) * r * 0.84); } g.stroke();
        g.fillStyle = gold; g.beginPath(); g.arc(r, r, r * 0.2, 0, TAU); g.fill();
      } });
  }
  /* bemaltes Fenster: Rahmen, Glas mit Spiegelung, Vorhänge gerafft */
  function fensterMalen(g, Fl, x, y, w, h, vorhang) {
    g.fillStyle = rgbS(FA.gold); PI.rundRechteck(g, x - 0.025, y - 0.025, w + 0.05, h + 0.05, 0.04); g.fill();
    const gl = g.createLinearGradient(x, y, x + w, y + h);
    gl.addColorStop(0, "rgb(120,138,166)"); gl.addColorStop(0.5, "rgb(56,66,86)"); gl.addColorStop(1, "rgb(34,40,54)");
    g.fillStyle = gl; PI.rundRechteck(g, x, y, w, h, 0.03); g.fill();
    /* Vorhänge: zwei Stoffbahnen, oben gerafft, mit Faltenlinien */
    const vf = vorhang || [176, 40, 50];
    for (const s of [0, 1]) {
      const x0 = s ? x + w : x, dx = s ? -1 : 1;
      g.fillStyle = rgbS(vf);
      g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + dx * w * 0.42, y); g.quadraticCurveTo(x0 + dx * w * 0.16, y + h * 0.45, x0 + dx * w * 0.2, y + h * 0.62);
      g.quadraticCurveTo(x0 + dx * w * 0.1, y + h * 0.8, x0 + dx * w * 0.14, y + h); g.lineTo(x0, y + h); g.closePath(); g.fill();
      if (Fl.px > 40) {
        g.strokeStyle = "rgba(60,10,16,0.45)"; g.lineWidth = 0.008;
        for (const f of [0.1, 0.22, 0.32]) { g.beginPath(); g.moveTo(x0 + dx * w * f, y); g.quadraticCurveTo(x0 + dx * w * f * 0.5, y + h * 0.5, x0 + dx * w * f * 0.45, y + h); g.stroke(); }
      }
      /* Raffband */
      g.fillStyle = rgbS(FA.gold); g.beginPath(); g.ellipse(x0 + dx * w * 0.17, y + h * 0.6, 0.02, 0.012, 0, 0, TAU); g.fill();
    }
    /* Spiegelung */
    g.fillStyle = "rgba(255,255,255,0.25)";
    g.beginPath(); g.moveTo(x + w * 0.45, y); g.lineTo(x + w * 0.62, y); g.lineTo(x + w * 0.35, y + h); g.lineTo(x + w * 0.18, y + h); g.closePath(); g.fill();
  }
  function kutsche(v, winter) {
    const schl = v + (winter === false ? 10 : 0);
    if (WAGEN[schl]) return WAGEN[schl];
    const F = new D.Figur();
    const innen = v % 2 ? [150, 30, 44] : [30, 70, 58];
    const polster = (g, Fl) => {
      g.fillStyle = rgbS(mix(innen, [0, 0, 0], 0.15)); g.fillRect(-0.1, -0.1, Fl.w + 0.2, Fl.h + 0.2);
      if (Fl.px > 50) { g.fillStyle = "rgba(0,0,0,0.25)"; for (let y = 0.08; y < Fl.h; y += 0.1) for (let x = 0.06 + (Math.round(y * 10) % 2) * 0.05; x < Fl.w; x += 0.1) { g.beginPath(); g.arc(x, y, 0.008, 0, TAU); g.fill(); } }
    };
    /* bemalte Seitenwand mit Goldschnörkeln und Medaillon (Schlitten, Gondel) */
    const bemalt = (farbe) => (g, Fl) => {
      const f = Fl.flaeche, um = f.umriss || [[0, 0], [f.w, 0], [f.w, f.h], [0, f.h]];
      g.fillStyle = rgbS(farbe); g.fillRect(-0.1, -0.1, Fl.w + 0.2, Fl.h + 0.2);
      if (Fl.px > 20) PI.rauschen(g, 0, 0, Fl.w, Fl.h, 0.8, 0.1, 21, 4);
      g.strokeStyle = rgbS(FA.gold); g.lineWidth = 0.045; D.pfad(g, um); g.stroke();
      if (Fl.px < 25) return;
      const cx = Fl.w * 0.5, cy = Fl.h * 0.52, rx = Math.min(0.16, Fl.w * 0.2), ry = Math.min(0.12, Fl.h * 0.26);
      g.lineWidth = 0.014; g.strokeStyle = rgbS(mix(FA.gold, [255, 255, 255], 0.1));
      g.fillStyle = "rgb(236,226,200)"; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, TAU); g.fill(); g.stroke();
      if (Fl.px > 45) {
        g.strokeStyle = "rgb(60,110,60)"; g.lineWidth = 0.01;
        g.beginPath(); for (const a of [-0.6, 0, 0.6]) { g.moveTo(cx, cy + ry * 0.7); g.lineTo(cx + Math.sin(a) * rx * 0.55, cy - ry * 0.25); } g.stroke();
        for (const [dx, dy, c] of [[0, -0.35, [210, 50, 70]], [-0.5, -0.1, [240, 190, 70]], [0.5, -0.1, [200, 90, 150]], [-0.2, 0.2, [240, 240, 240]], [0.25, 0.22, [210, 50, 70]]]) {
          g.fillStyle = rgbS(c); g.beginPath(); g.arc(cx + dx * rx * 0.7, cy + dy * ry, 0.022, 0, TAU); g.fill();
        }
      }
      g.strokeStyle = rgbS(FA.gold); g.lineWidth = 0.016;
      for (const sx of [-1, 1]) {
        const x0 = cx + sx * (rx + 0.03);
        g.beginPath(); g.moveTo(x0, cy); g.bezierCurveTo(x0 + sx * 0.1, cy - 0.1, x0 + sx * 0.18, cy + 0.04, x0 + sx * 0.12, cy + 0.06);
        g.arc(x0 + sx * 0.1, cy + 0.04, 0.025, 0, TAU * 0.75); g.stroke();
      }
      if (Fl.px > 30) PI.bleichen(g, 0, 0, Fl.w, Fl.h, 0.35, 0.1, 3);
    };
    if (v === 0) {
      /* Märchenkutsche: geschlossener Wagenkasten mit bauchigen
         Seitenwänden, Fenster mit Goldrahmen und gerafften Vorhängen,
         Tür mit Griff, Krone auf dem Dach, Laternen vorn, Speichenräder */
      const farbe = [150, 28, 40], hell = [236, 226, 204];
      const oben = [[0.3, 1.02], [0.1, 1.05], [-0.18, 1.05], [-0.4, 1.02]];
      const unten = [[-0.43, 0.64], [-0.36, 0.42], [-0.12, 0.35], [0.14, 0.37], [0.3, 0.52], [0.33, 0.8]];
      const seite = (g, Fl) => {
        const f = Fl.flaeche;
        g.fillStyle = rgbS(farbe); g.fillRect(-0.1, -0.1, Fl.w + 0.2, Fl.h + 0.2);
        if (Fl.px > 20) PI.rauschen(g, 0, 0, Fl.w, Fl.h, 0.8, 0.1, 21, 4);
        g.strokeStyle = rgbS(FA.gold); g.lineWidth = 0.04; D.pfad(g, f.umriss); g.stroke();
        /* Tür: Fuge, Goldleiste, Griff; Fenster oben */
        const mitte = f.rechts ? f.y1 - (-0.06) : -0.06 - f.y0;
        const tx = mitte - 0.19, tw = 0.38;
        g.strokeStyle = "rgba(40,6,10,0.55)"; g.lineWidth = 0.012; g.strokeRect(tx, 0.06, tw, Fl.h - 0.2);
        g.strokeStyle = rgbS(FA.gold); g.lineWidth = 0.014; g.strokeRect(tx + 0.03, 0.34, tw - 0.06, Fl.h - 0.52);
        fensterMalen(g, Fl, tx + 0.05, 0.08, tw - 0.1, 0.22, [184, 150, 70]);
        g.fillStyle = rgbS(FA.gold); g.beginPath(); g.arc(tx + (f.rechts ? 0.05 : tw - 0.05), 0.4, 0.016, 0, TAU); g.fill();
        if (Fl.px > 40) {
          /* Goldschnörkel auf der Türfüllung */
          g.strokeStyle = rgbS(FA.gold); g.lineWidth = 0.01;
          const cx = tx + tw / 2, cy = 0.46;
          g.beginPath(); g.moveTo(cx - 0.1, cy); g.bezierCurveTo(cx - 0.05, cy - 0.06, cx + 0.05, cy + 0.06, cx + 0.1, cy); g.stroke();
          g.beginPath(); g.arc(cx, cy, 0.025, 0, TAU); g.stroke();
        }
        if (Fl.px > 30) PI.bleichen(g, 0, 0, Fl.w, Fl.h, 0.35, 0.1, 5);
      };
      for (const sx of [-1, 1]) profilWand(F, "kw" + sx, sx, sx * 0.33, oben, unten, seite, null);
      /* Stirn- und Rückwand mit kleinem Fenster vorn */
      const wand = (y, n, mitFenster) => {
        F.flaeche({ name: "kf" + n, o: [n > 0 ? -0.33 : 0.33, y, 1.03], u: n > 0 ? [1, 0, 0] : [-1, 0, 0], v: [0, 0, -1], w: 0.66, h: 0.6, n: [0, n, 0],
          umriss: [[0, 0], [0.66, 0], [0.66, 0.34], [0.52, 0.56], [0.14, 0.56], [0, 0.34]],
          malen: (g, Fl) => {
            g.fillStyle = rgbS(farbe); g.fillRect(-0.1, -0.1, 0.9, 0.8);
            g.strokeStyle = rgbS(FA.gold); g.lineWidth = 0.035; D.pfad(g, Fl.flaeche.umriss); g.stroke();
            if (mitFenster) fensterMalen(g, Fl, 0.2, 0.07, 0.26, 0.17, [184, 150, 70]);
            else if (Fl.px > 30) { g.fillStyle = rgbS(FA.gold); g.beginPath(); g.ellipse(0.33, 0.24, 0.1, 0.08, 0, 0, TAU); g.fill(); g.fillStyle = rgbS(hell); g.beginPath(); g.ellipse(0.33, 0.24, 0.075, 0.056, 0, 0, TAU); g.fill(); }
          } });
      };
      wand(0.315, 1, true); wand(-0.415, -1, false);
      /* Dach: leicht gewölbt, mit Goldgeländer und Krone */
      F.loft([{ c: [0, -0.44, 1.04], a: [0.36, 0, 0], b: [0, 0.0, 0.02] }, { c: [0, -0.3, 1.08], a: [0.37, 0, 0], b: [0, 0, 0.05] }, { c: [0, 0.0, 1.1], a: [0.37, 0, 0], b: [0, 0, 0.06] }, { c: [0, 0.22, 1.08], a: [0.37, 0, 0], b: [0, 0, 0.05] }, { c: [0, 0.34, 1.04], a: [0.36, 0, 0], b: [0, 0, 0.02] }], winter ? [244, 246, 250] : hell, { n: 12, glanz: 0.3 });
      F.rohr([[-0.36, -0.44, 1.07], [-0.36, 0.34, 1.07], [0.36, 0.34, 1.07], [0.36, -0.44, 1.07], [-0.36, -0.44, 1.07]], [0.012, 0.012, 0.012, 0.012, 0.012], FA.gold, { n: 6, glanz: 0.8, b: 0.03 });
      F.zyl([0, -0.05, 1.12], [0, -0.05, 1.2], 0.1, 0.12, FA.gold, { glanz: 0.8, deckel: FA.rot });
      for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; F.ell([Math.cos(a) * 0.12, -0.05 + Math.sin(a) * 0.12, 1.23], 0.02, 0.02, 0.02, FA.gold, { glanz: 0.9, b: 0.01, ab: 25 }); }
      /* Fahrgestell: Achsen, Federn, Kutschbock-Tritt */
      F.kap([0, -0.42, 0.3], [0, 0.4, 0.3], 0.03, 0.03, FA.gold, { glanz: 0.8 });
      for (const y of [-0.36, 0.36]) F.kap([-0.4, y, 0.2], [0.4, y, 0.2], 0.022, 0.022, FA.gold, { glanz: 0.8 });
      for (const sx of [-1, 1]) for (const y of [-0.34, 0.34]) F.strich([[sx * 0.3, y, 0.2], [sx * 0.36, y * 0.8, 0.3], [sx * 0.28, y * 0.72, 0.42]], 0.022, FA.gold, { b: 0.01 });
      for (const sx of [-1, 1]) {
        const lp = [sx * 0.3, 0.3, 0.93];
        F.strich([[sx * 0.28, 0.27, 0.9], [sx * 0.31, 0.3, 0.92]], 0.012, FA.gold, { b: 0.04 });
        F.zyl(lp, add(lp, [0, 0, 0.09]), 0.03, 0.036, [250, 236, 196], { glanz: 0.8, deckel: FA.gold, b: 0.05 });
        F.kap(add(lp, [0, 0, 0.09]), add(lp, [0, 0, 0.14]), 0.04, 0.01, FA.gold, { glanz: 0.8, b: 0.055 });
        F.birne(add(lp, [0, 0, 0.045]), 0.025, "255,214,140", { b: 0.06, ab: 30 });
      }
      for (const sx of [-1, 1]) for (const [y, r] of [[0.36, 0.17], [-0.36, 0.22]]) zierrad(F, sx * 0.43, y, 0.0, r, [60, 30, 30]);
    } else if (v === 1) {
      /* Schwanengondel: ein geschnitzter Schwan bildet die Rückwand, sein
         Hals schwingt sich vorn hoch; innen eine gepolsterte Bank */
      const weiss = [240, 238, 232];
      const oben = [[0.5, 0.74], [0.3, 0.66], [0.0, 0.64], [-0.3, 0.74], [-0.48, 0.96], [-0.56, 1.12]];
      const unten = [[-0.6, 1.0], [-0.58, 0.5], [-0.4, 0.3], [0.3, 0.3], [0.52, 0.44], [0.56, 0.62]];
      const federn = (g, Fl) => {
        const f = Fl.flaeche;
        g.fillStyle = rgbS(weiss); g.fillRect(-0.1, -0.1, Fl.w + 0.2, Fl.h + 0.2);
        /* angelegter Flügel: Deckfedern in Schuppenreihen, lange Schwungfedern nach hinten */
        const hinten = f.rechts ? 0.1 : Fl.w - 0.1, dir = f.rechts ? 1 : -1;
        g.strokeStyle = "rgba(120,120,130,0.4)"; g.lineWidth = Math.max(0.006, 0.8 / Fl.px);
        for (let r = 0; r < 4; r++) for (let i = 0; i < 7; i++) {
          const x = hinten + dir * (0.12 + i * 0.1 + (r % 2) * 0.05), y = 0.12 + r * 0.08;
          g.beginPath(); g.arc(x, y, 0.05, 0.3, Math.PI - 0.3); g.stroke();
        }
        for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(hinten + dir * (0.2 + i * 0.1), 0.45); g.quadraticCurveTo(hinten + dir * (0.05 + i * 0.08), 0.52, hinten - dir * 0.02, 0.5 - i * 0.05); g.stroke(); }
        g.strokeStyle = rgbS(FA.gold); g.lineWidth = 0.03; D.pfad(g, f.umriss); g.stroke();
        if (Fl.px > 30) PI.rauschen(g, 0, 0, Fl.w, Fl.h, 0.8, 0.08, 21, 4);
      };
      for (const sx of [-1, 1]) profilWand(F, "sg" + sx, sx, sx * 0.34, oben, unten, federn, polster);
      F.poly([[-0.34, -0.5, 0.34], [0.34, -0.5, 0.34], [0.34, 0.5, 0.34], [-0.34, 0.5, 0.34]], mix(innen, [0, 0, 0], 0.45), { b: -0.2 });
      /* Rückenlehne: Schwanzfedern, nach oben geschwungen */
      const hw = { o: [0.34, -0.57, 1.12], u: [-1, 0, 0], v: [0, 0, -1], w: 0.68, h: 0.8, umriss: [[0, 0.4], [0.1, 0.1], [0.34, 0.0], [0.58, 0.1], [0.68, 0.4], [0.68, 0.8], [0, 0.8]] };
      F.flaeche(Object.assign({ name: "sgh-a", n: [0, -1, 0], malen: federn }, hw));
      F.flaeche(Object.assign({ name: "sgh-i", n: [0, 1, 0], malen: polster, b: -0.05 }, hw));
      F.ellR([0, -0.25, 0.5], [1, 0, 0], 0.3, 0.2, 0.07, mix(innen, [255, 255, 255], 0.1), { b: 0.01, glanz: 0.3 });
      /* Hals und Kopf des Schwans: S-Schwung, Schnabel orange mit schwarzem Höcker */
      F.rohr([[0, 0.42, 0.6], [0, 0.56, 0.78], [0, 0.56, 0.98], [0, 0.46, 1.14], [0, 0.46, 1.26], [0, 0.54, 1.33]], [0.1, 0.065, 0.05, 0.045, 0.045, 0.05], weiss, { n: 12, glanz: 0.3, b: 0.05 });
      F.ellR([0, 0.58, 1.34], [0, 1, -0.1], 0.08, 0.05, 0.055, weiss, { glanz: 0.3, b: 0.06 });
      F.rohr([[0, 0.64, 1.335], [0, 0.72, 1.31], [0, 0.76, 1.29]], [[0.028, 0.022], [0.022, 0.016], [0.008, 0.006]], [226, 120, 40], { n: 8, glanz: 0.5, b: 0.07 });
      F.ell([0, 0.64, 1.355], 0.02, 0.018, 0.02, [30, 26, 26], { b: 0.075 });
      for (const sx of [-1, 1]) F.ellA([sx * 0.045, 0.6, 1.35], [0, 0.01, 0], [0, 0, 0.01], [sx * 0.004, 0, 0], [24, 20, 20], { flach: true, b: 0.08, ab: 30 });
      /* Goldkufen und Füße */
      for (const sx of [-1, 1]) F.rohr([[sx * 0.3, -0.56, 0.1], [sx * 0.3, 0.44, 0.1], [sx * 0.3, 0.6, 0.2]], [0.02, 0.02, 0.012], FA.gold, { n: 6, glanz: 0.8 });
      for (const sx of [-1, 1]) for (const y of [-0.4, 0.3]) F.strich([[sx * 0.3, y, 0.1], [sx * 0.3, y, 0.32]], 0.022, FA.gold, { b: 0.02 });
    } else {
      /* Schlitten: Kufen mit Schnecke, hoher Schwanenhals vorn */
      const farbe = v % 2 ? FA.blau : FA.rot;
      const oben = [[0.6, 0.96], [0.5, 0.78], [0.34, 0.58], [0.0, 0.55], [-0.3, 0.72], [-0.46, 0.92], [-0.56, 0.98]];
      const unten = [[-0.62, 0.9], [-0.58, 0.36], [-0.3, 0.3], [0.3, 0.3], [0.52, 0.44], [0.66, 0.7], [0.68, 0.88]];
      for (const sx of [-1, 1]) profilWand(F, "sw" + sx, sx, sx * 0.33, oben, unten, bemalt(farbe), polster);
      const hl = [[-0.33, 0.36], [0.33, 0.36], [0.33, 0.92], [0, 1.0], [-0.33, 0.92]];
      const hw = { o: [0.33, -0.58, 1.0], u: [-1, 0, 0], v: [0, 0, -1], w: 0.66, h: 0.64, umriss: hl.map(([x, z]) => [0.33 - x, 1.0 - z]) };
      F.flaeche(Object.assign({ name: "sh-a", n: [0, -1, 0], malen: bemalt(farbe) }, hw));
      F.flaeche(Object.assign({ name: "sh-i", n: [0, 1, 0], malen: polster, b: -0.05 }, hw));
      F.poly([[-0.33, -0.58, 0.34], [0.33, -0.58, 0.34], [0.33, 0.55, 0.34], [-0.33, 0.55, 0.34]], mix(innen, [0, 0, 0], 0.45), { b: -0.2 });
      /* Bank mit Polster; im Winter eine karierte Wolldecke über der Lehne
         (kein weißes Fell – das wirkte von der Seite wie Flügel) */
      F.ellR([0, -0.3, 0.5], [1, 0, 0], 0.3, 0.22, 0.07, mix(innen, [255, 255, 255], 0.1), { b: 0.01, glanz: 0.3 });
      if (winter !== false) {
        const decke = v % 2 ? [150, 36, 40] : [40, 84, 60];
        F.flaeche({ name: "decke", o: [-0.3, -0.47, 0.86], u: [1, 0, 0], v: [0, 0.35, -1], w: 0.6, h: 0.42, n: [0, 1, 0.3], beidseitig: true, b: 0.03,
          umriss: [[0, 0], [0.6, 0], [0.62, 0.3], [0.56, 0.44], [0.3, 0.4], [0.05, 0.44], [-0.02, 0.3]],
          malen: (g, Fl) => {
            g.fillStyle = rgbS(decke); g.fillRect(-0.1, -0.1, 0.9, 0.7);
            g.fillStyle = "rgba(20,14,12,0.35)"; for (let x = 0.03; x < 0.7; x += 0.12) g.fillRect(x, -0.1, 0.035, 0.7);
            for (let y = 0.03; y < 0.5; y += 0.12) g.fillRect(-0.1, y, 0.9, 0.035);
            g.fillStyle = "rgba(240,210,120,0.6)"; for (let x = 0.09; x < 0.7; x += 0.12) g.fillRect(x, -0.1, 0.008, 0.7);
            if (Fl.px > 30) { g.strokeStyle = rgbS(mix(decke, [255, 255, 255], 0.3)); g.lineWidth = 0.012; g.beginPath(); for (let x = 0; x < 0.62; x += 0.03) { g.moveTo(x, 0.4); g.lineTo(x + 0.005, 0.46); } g.stroke(); }
          } });
      } else F.ellR([0, -0.5, 0.7], [1, 0, 0], 0.27, 0.05, 0.16, mix(innen, [255, 255, 255], 0.1), { b: 0.02, glanz: 0.3 });
      /* Kufen, vorn zur Schnecke gerollt, und Stützen */
      for (const sx of [-1, 1]) {
        const x = sx * 0.3;
        F.rohr([[x, -0.62, 0.05], [x, 0.4, 0.05], [x, 0.66, 0.14], [x, 0.8, 0.36], [x, 0.78, 0.56], [x, 0.7, 0.62], [x, 0.64, 0.55], [x, 0.68, 0.48]], [0.018, 0.018, 0.018, 0.018, 0.017, 0.015, 0.013, 0.01], FA.gold, { n: 6, glanz: 0.8, b: 0.03 });
        for (const y of [-0.45, 0.0, 0.35]) F.strich([[x, y, 0.06], [x, y, 0.32]], 0.025, FA.gold, { b: 0.02 });
      }
      F.ell([0, 0.64, 0.98], 0.05, 0.05, 0.05, FA.gold, { glanz: 0.9, b: 0.04 });
    }
    return (WAGEN[schl] = F);
  }

  /* ---------------- kleine Zeichenhelfer ---------------- */
  /* gedrehte Messingstange (senkrecht), mit Spirale, wenn man nah ist */
  function stange(g, A, x, y, z0, z1) {
    if (z1 <= z0) return;
    D.stumpf(g, A, [x, y, z0], [x, y, z1], 0.026, 0.026, FA.messing, { glanz: 1, deckel: false });
    if (A.s > 60 && !A.silhouette) {
      g.lineWidth = Math.max(0.6, A.s * 0.006);
      g.strokeStyle = "rgba(120,86,30,0.55)";
      g.beginPath();
      for (let z = z0; z < z1; z += 0.07) { const a = A.bild([x - 0.018, y + 0.018, z]), b = A.bild([x + 0.018, y - 0.018, z + 0.035]); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
      g.stroke();
    }
  }
  /* Leuchtschein einer Birne (vorgemaltes, weiches Licht) */
  let SCHEIN = null;
  function scheinBild() {
    if (SCHEIN) return SCHEIN;
    const c = document.createElement("canvas"); c.width = c.height = 64;
    const g = c.getContext("2d"), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,226,160,0.95)"); gr.addColorStop(0.18, "rgba(255,200,120,0.45)"); gr.addColorStop(0.5, "rgba(255,170,80,0.12)"); gr.addColorStop(1, "rgba(255,150,60,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return (SCHEIN = c);
  }

  /* =====================================================================
     DAS KARUSSELL MALEN (bei Drehwinkel phi) — für Sprite und Lebendiges
     z = { phi, t, bau, winter, cache (Figurenspeicher benutzen), nurPodest, ohnePodest }
     ===================================================================== */
  function podest(g, A, bau, winter) {
    const q = klemm((bau - 0.14) / 0.08, 0, 1);
    if (bau < 0.14) {
      /* Baugrube (unter Gelände): nur was durch die Öffnung sichtbar ist –
         Sohle, hintere Grubenwand, das wachsende Ringfundament */
      /* Grube nur so groß, wie der Grundriss erlaubt (Nachbarn stehen dicht daneben) */
      const k = klemm((bau - 0.06) / 0.07, 0, 1), R = POD_R + 0.06, tief = 0.7, n = 32;
      const ring = (r, zz) => { const p = []; for (let i = 0; i < n; i++) { const w = i / n * TAU; p.push([r * Math.cos(w), r * Math.sin(w), zz]); } return p; };
      const oben = ring(R, 0), unten = ring(R - 0.35, -tief);
      g.save();
      if (!A.silhouette) { D.pfad(g, oben.map((q) => A.bild(q))); g.clip(); }
      D.vieleck(g, A, unten, [96, 74, 54], { n: [0, 0, 1] });
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        D.vieleck(g, A, [oben[i], unten[i], unten[j], oben[j]], [118, 90, 64], { n: [-Math.cos((i + 0.5) / n * TAU), -Math.sin((i + 0.5) / n * TAU), 0.5] });
      }
      if (k > 0) {
        /* Ringfundament aus Beton, Schalungsfugen, innen verfüllt */
        const zt = -tief + (tief + 0.02) * k;
        D.stumpf(g, A, [0, 0, -tief], [0, 0, zt], POD_R - 0.1, POD_R - 0.1, [172, 170, 164], { deckel: [182, 180, 174] });
        D.stumpf(g, A, [0, 0, zt - 0.01], [0, 0, zt], POD_R - 0.6, POD_R - 0.6, [150, 148, 142], { deckel: [120, 100, 76] });
        if (!A.silhouette && A.s > 20) for (let zz = -tief + 0.2; zz < zt - 0.02; zz += 0.2) D.ring(g, A, [0, 0, zz], POD_R - 0.095, 0.012, [120, 118, 112], "vorn");
      }
      g.restore();
      /* Aushub: Erdhaufen in den Ecken des Grundrisses (innerhalb des
         Bauplatzes), im Winter mit Schneehaube */
      if (bau < 0.11) for (const [w, r, h] of [[Math.PI * 0.75, 0.62, 0.42], [Math.PI * 1.25, 0.66, 0.46], [Math.PI * 1.75, 0.55, 0.36]]) {
        const c = [Math.cos(w) * 5.55, Math.sin(w) * 5.55, 0], t = [-Math.sin(w), Math.cos(w), 0];
        D.ellipsoid(g, A, add(c, mul(t, r * 0.35)), mul(t, r * 0.8), [Math.cos(w) * r * 0.6, Math.sin(w) * r * 0.6, 0], [0, 0, h * 0.7], [104, 80, 58], {});
        D.ellipsoid(g, A, c, mul(t, r), [Math.cos(w) * r * 0.75, Math.sin(w) * r * 0.75, 0], [0, 0, h], [116, 90, 64], {});
        if (winter) D.ellipsoid(g, A, add(c, [0, 0, h * 0.78]), mul(t, r * 0.5), [Math.cos(w) * r * 0.36, Math.sin(w) * r * 0.36, 0], [0, 0, h * 0.26], [236, 239, 245], {});
      }
      return;
    }
    /* zwei Stufen aus Holz */
    D.stumpf(g, A, [0, 0, 0], [0, 0, POD_Z1 * q], POD_R, POD_R, FA.holz, { deckel: winter ? [226, 228, 232] : [168, 130, 90] });
    if (q > 0.5) D.stumpf(g, A, [0, 0, POD_Z1], [0, 0, POD_Z1 + (POD_Z - POD_Z1) * (q - 0.5) * 2], POD_R2, POD_R2, mix(FA.holz, [0, 0, 0], 0.08), { deckel: [150, 112, 76] });
    if (q >= 1 && A.s > 18 && !A.silhouette) {
      /* Dielen der oberen Stufe (im Bau sichtbar, bevor die Drehbühne
         daraufkommt): parallele Bretter mit Fugen und versetzten Stößen –
         sonst wirkt das Podest wie eine glatte braune Scheibe */
      const R2 = POD_R2 - 0.05, zD = POD_Z + 0.002, br = 0.22, rng = ST.zufall(4711);
      g.lineWidth = Math.max(0.5, A.s * 0.006);
      g.strokeStyle = A.farbeK([96, 66, 42], [0, 0, 1], 0.5);
      g.beginPath();
      for (let y = -R2 + br; y < R2; y += br) {
        const x = Math.sqrt(Math.max(0, R2 * R2 - y * y));
        const a = A.bild([-x, y, zD]), b = A.bild([x, y, zD]);
        g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]);
        /* Stöße der Bretter, je Reihe versetzt */
        const x2 = Math.sqrt(Math.max(0, R2 * R2 - (y + br) * (y + br))), xm = Math.min(x, x2);
        for (let s = -xm + 0.6 + rng() * 1.2; s < xm - 0.3; s += 1.4 + rng() * 0.8) {
          const c = A.bild([s, y, zD]), d = A.bild([s, y + br, zD]);
          g.moveTo(c[0], c[1]); g.lineTo(d[0], d[1]);
        }
      }
      g.stroke();
      /* Brettfugen auf den Stufen und Messingkante */
      D.ring(g, A, [0, 0, POD_Z1 + 0.002], POD_R - 0.04, 0.02, FA.messing, null);
      D.ring(g, A, [0, 0, POD_Z + 0.002], POD_R2 - 0.04, 0.02, FA.messing, null);
    }
  }

  /* ---------------- Licht unter dem Zeltdach ----------------
     Unter einem 9 m breiten Zeltdach scheint keine Sonne auf Bühne,
     Pferde und Säule – nur der äußere Rand auf der Sonnenseite bekommt
     schräges Licht unter der Traufe hindurch. Für jeden Punkt ein Strahl
     zur Sonne: tritt er unterhalb der Behangkante aus dem Dachkreis,
     steht der Punkt in der Sonne (weiche Kante), sonst im Schatten. */
  function lichtModell(A) { const L = ST.LICHT; return [L[0] * A.c + L[1] * A.sn, -L[0] * A.sn + L[1] * A.c, L[2]]; }
  function sonnenAnteil(A, p) {
    const Lm = lichtModell(A);
    if (Lm[2] <= 0.05) return 0;
    const t = (BEH_U - p[2]) / Lm[2];
    if (t <= 0) return 1;
    const qx = p[0] + Lm[0] * t, qy = p[1] + Lm[1] * t;
    return klemm((Math.hypot(qx, qy) - DACH_R) / 0.6 + 0.5, 0, 1);
  }
  /* warmes Licht der Birnen unter dem Dach: von oben, nach unten schwächer */
  function warmUnten(A, z) {
    if (!(A.nacht > 0)) return null;
    const k = A.nacht * (0.5 + 0.5 * klemm((z - 0.4) / 2.6, 0, 1));
    return [0.62 * k, 0.44 * k, 0.22 * k];
  }

  function karussell(g, A, z) {
    const bau = z.bau, winter = z.winter, phi = z.phi || 0, zeit = z.t || 0;
    if (!z.ohnePodest) podest(g, A, bau, winter);
    if (z.nurPodest || bau < 0.22) return;
    const warmAlt = A.warm, dirAlt = A.warmDir, skAlt = A.sk, akAlt = A.ak;
    const rot = (r, w, zz) => [r * Math.cos(w + phi), r * Math.sin(w + phi), zz];
    const OBEN = [0, 0, 1];

    /* ---- Drehbühne: im Schatten des Daches, nur der Rand zur Sonne hell ---- */
    if (bau >= 0.65) {
      const k = klemm((bau - 0.65) / 0.07, 0, 1);
      A.sk = 0; A.ak = 0.74; A.warm = warmUnten(A, BUEHNE_Z); A.warmDir = OBEN;
      D.stumpf(g, A, [0, 0, POD_Z], [0, 0, BUEHNE_Z], BUEHNE_R, BUEHNE_R, FA.rot, { deckel: [176, 136, 92] });
      if (!A.silhouette && bau >= 0.4) {
        /* Sonnensichel: Bühnendeckel minus Schatten des Dachkreises */
        const Lm = lichtModell(A), h = (BEH_U + BEH_O) / 2 - BUEHNE_Z;
        const off = [-Lm[0] / Lm[2] * h, -Lm[1] / Lm[2] * h];
        const eS = D.ellipseBild(A, [0, 0, BUEHNE_Z], [BUEHNE_R, 0, 0], [0, BUEHNE_R, 0]);
        const eD = D.ellipseBild(A, [off[0], off[1], BUEHNE_Z], [DACH_R, 0, 0], [0, DACH_R, 0]);
        A.sk = 1; A.ak = 1;
        const hell = A.farbeK([176, 136, 92], nrm(A.kam(OBEN)));
        A.sk = 0; A.ak = 0.74;
        g.save();
        g.beginPath(); g.ellipse(eS.x, eS.y, eS.r1, Math.max(0.5, eS.r2), eS.th, 0, TAU); g.clip();
        g.fillStyle = hell;
        /* nur das Rechteck um die Bühnenellipse füllen (Ausschnitt begrenzt ohnehin) */
        const gross = [eS.x - eS.r1 - 2, eS.y - eS.r1 - 2, eS.r1 * 2 + 4, eS.r1 * 2 + 4];
        for (const [f, a] of [[1.04, 1], [1.0, 0.5], [0.96, 0.25]]) {
          g.globalAlpha = a; g.beginPath(); g.rect(gross[0], gross[1], gross[2], gross[3]);
          g.ellipse(eD.x, eD.y, eD.r1 * f, Math.max(0.5, eD.r2 * f), eD.th, 0, TAU); g.fill("evenodd");
        }
        g.restore();
      }
      if (!A.silhouette && A.s > 12) {
        /* Dielen strahlenförmig (drehen mit), Goldring am Rand */
        g.lineWidth = Math.max(0.5, A.s * 0.008);
        g.strokeStyle = A.farbeK([110, 80, 52], OBEN, 0.45);
        g.beginPath();
        const n = 48;
        for (let i = 0; i < n * k; i++) { const w = i / n * TAU; const a = A.bild(rot(SAEULE_R + 0.2, w, BUEHNE_Z)), b = A.bild(rot(BUEHNE_R - 0.05, w, BUEHNE_Z)); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
        g.stroke();
        D.ring(g, A, [0, 0, BUEHNE_Z + 0.002], BUEHNE_R - 0.12, 0.035, FA.gold, null);
      }
    }

    /* ---- Pferde, Stangen, Kutschen, Säule – nach Tiefe ---- */
    const liste = [];
    if (bau >= 0.26) liste.push({ z: A.tief([0, 0, 1.8]), fn: () => {
      A.sk = 0; A.ak = 0.74; A.warm = warmUnten(A, 2.2); A.warmDir = OBEN;
      saeule(g, A, phi, bau, winter);
    } });
    const nP = bau >= 1 ? N_PFERD : Math.floor(N_PFERD * klemm((bau - 0.72) / 0.13, 0, 1));
    const gesicht = A.zumAuge.bind(A);
    /* ein Pferd mit seiner Stange: die Stange geht vor dem Sattel durch den
       Rumpf; schaut das Pferd zum Betrachter, liegen Kopf und Hals vor dem
       oberen Stangenstück, sonst dahinter */
    const reiter = (fig, r, w, hub, k) => {
      const p = rot(r, w, BUEHNE_Z - 0.02 * k + hub);
      const t = [-Math.sin(w + phi), Math.cos(w + phi)];
      const stx = p[0] + 0.07 * k * t[0], sty = p[1] + 0.07 * k * t[1];
      const vorn = gesicht([t[0], t[1], 0]) > 0.3;
      liste.push({ z: A.tief(add(p, [0, 0, 1.0 * k])), fn: () => {
        const sk = Math.round(sonnenAnteil(A, add(p, [0, 0, 1.0 * k])) * 2) / 2, ak = 0.74 + 0.26 * sk;
        /* Kunstlicht nach der Grundhöhe (ohne das Auf und Ab): sonst wäre
           der Schlüssel des Figurenbildes jedes Bild ein anderer */
        const warm = warmUnten(A, BUEHNE_Z + 1.0 * k);
        A.sk = sk; A.ak = ak; A.warm = warm; A.warmDir = OBEN;
        stange(g, A, stx, sty, BUEHNE_Z, p[2] + 0.82 * k);
        if (vorn) stange(g, A, stx, sty, p[2] + 1.12 * k, HIMMEL_Z);
        if (z.cache) D.figurBild(g, A, fig, { p: p, phi: w + phi, k: k, warm: warm, warmDir: OBEN, sk: sk, ak: ak, sBild: z.sBild });
        else D.figurZeichnen(g, A, fig, { p: p, phi: w + phi, k: k, warm: warm, warmDir: OBEN, sk: sk }, zeit);
        if (!vorn) stange(g, A, stx, sty, p[2] + 1.12 * k, HIMMEL_Z);
      } });
    };
    for (let i = 0; i < nP; i++) {
      const w = i / N_PFERD * TAU;
      reiter(pferd(i), PFERD_R, w, bau >= 1 ? 0.14 * Math.sin(phi * 4 + i * 2.1) : 0, 1);
    }
    /* Innenkreis: Kutsche, Schwanengondel, zwei Schlitten, dazwischen vier Ponys */
    const nK = bau >= 1 ? 4 : Math.floor(4 * klemm((bau - 0.85) / 0.07, 0, 1));
    for (let i = 0; i < nK; i++) {
      const w = (i + 0.5) / 4 * TAU;
      const p = rot(KUTSCHE_R, w, BUEHNE_Z);
      liste.push({ z: A.tief(add(p, [0, 0, 0.5])), fn: () => {
        const sk = Math.round(sonnenAnteil(A, add(p, [0, 0, 0.8])) * 2) / 2, ak = 0.74 + 0.26 * sk;
        const warm = warmUnten(A, 1.2);
        A.sk = sk; A.ak = ak;
        if (z.cache) D.figurBild(g, A, kutsche(i, winter), { p: p, phi: w + phi, k: 1, warm: warm, warmDir: OBEN, sk: sk, ak: ak, sBild: z.sBild });
        else D.figurZeichnen(g, A, kutsche(i, winter), { p: p, phi: w + phi, k: 1, warm: warm, warmDir: OBEN, sk: sk }, zeit);
      } });
      reiter(pferd(i + 1), PONY_R, i / 4 * TAU, bau >= 1 ? 0.1 * Math.sin(phi * 4 + i * 1.3 + 1) : 0, 0.8);
    }
    liste.sort((a, b) => a.z - b.z);
    for (const e of liste) e.fn();
    A.sk = skAlt; A.ak = akAlt; A.warm = null; A.warmDir = null;

    /* ---- Dach (außen: nur Sonne und Himmel, kein Kunstlicht von unten) ---- */
    if (bau >= 0.3) dach(g, A, phi, bau, winter, zeit);
    A.warm = warmAlt; A.warmDir = dirAlt;
  }

  /* Mittelsäule: Spiegel und gemalte Landschaften im Wechsel, Goldrahmen */
  function saeule(g, A, phi, bau, winter) {
    const hoch = HIMMEL_Z - BUEHNE_Z, k = bau >= 0.3 ? 1 : klemm((bau - 0.22) / 0.08, 0, 1);
    const z0 = BUEHNE_Z, z1 = z0 + hoch * k;
    D.stumpf(g, A, [0, 0, z0], [0, 0, z0 + 0.35 * k], SAEULE_R + 0.18, SAEULE_R + 0.12, FA.rot, { glanz: 0.35, deckel: FA.gold });
    D.stumpf(g, A, [0, 0, z0 + 0.35 * k], [0, 0, z1], SAEULE_R, SAEULE_R, FA.creme, { glanz: 0.3, deckel: FA.gold });
    if (k < 1 || A.silhouette) return;
    const n = 8, za = z0 + 0.55, ze = HIMMEL_Z - 0.3;
    for (let i = 0; i < n; i++) {
      const w0 = phi + (i + 0.1) / n * TAU, w1 = phi + (i + 0.9) / n * TAU, wm = (w0 + w1) / 2;
      if (A.zumAuge([Math.cos(wm), Math.sin(wm), 0]) < 0.05) continue;
      const pts = (r, zA, zB) => { const p = []; for (let j = 0; j <= 4; j++) { const w = w0 + (w1 - w0) * j / 4; p.push([r * Math.cos(w), r * Math.sin(w), zA]); } for (let j = 4; j >= 0; j--) { const w = w0 + (w1 - w0) * j / 4; p.push([r * Math.cos(w), r * Math.sin(w), zB]); } return p; };
      const nk = nrm(A.kam([Math.cos(wm), Math.sin(wm), 0]));
      D.pfad(g, pts(SAEULE_R + 0.01, ze, za).map((p) => A.bild(p)));
      g.fillStyle = A.farbeK(FA.gold, nk, null, 0.6); g.fill();
      D.pfad(g, pts(SAEULE_R + 0.015, ze - 0.06, za + 0.06).map((p) => A.bild(p)));
      const a = A.bild([SAEULE_R * Math.cos(wm), SAEULE_R * Math.sin(wm), ze]), b = A.bild([SAEULE_R * Math.cos(wm), SAEULE_R * Math.sin(wm), za]);
      const gr = g.createLinearGradient(a[0], a[1], b[0], b[1]);
      if (i % 2) {
        /* Spiegel: spiegelt den hellen Platz draußen, dunkel unter dem Dach */
        gr.addColorStop(0, A.farbeK([150, 162, 182], nk)); gr.addColorStop(0.55, A.farbeK([200, 210, 226], nk)); gr.addColorStop(1, A.farbeK([110, 118, 136], nk));
      } else {
        /* gemalte Winterlandschaft: Himmel oben, Schnee unten */
        gr.addColorStop(0, A.farbeK([70, 100, 150], nk)); gr.addColorStop(0.55, A.farbeK([150, 170, 200], nk)); gr.addColorStop(0.6, A.farbeK([60, 90, 60], nk)); gr.addColorStop(1, A.farbeK([230, 234, 240], nk));
      }
      g.fillStyle = gr;
      g.fill();
    }
    /* Birnen um den Säulenkopf */
    const bs = []; for (let i = 0; i < 16; i++) { const w = phi + i / 16 * TAU; if (A.zumAuge([Math.cos(w), Math.sin(w), 0]) > 0) bs.push([(SAEULE_R + 0.03) * Math.cos(w), (SAEULE_R + 0.03) * Math.sin(w), HIMMEL_Z - 0.15]); }
    birnenReihe(g, A, bs, 0.028, A.nacht);
  }

  /* Zeltdach: hängt wie Stoff zwischen Mittelmast und Traufe durch – unten
     flach, oben steil (drei Ringe). dachPunkt(t, w): t = 0 (Traufe) … 3 (oben) */
  function dachPunkt(t, w) {
    const j = Math.min(2, Math.max(0, Math.floor(t))), f = t - j;
    const r = PROFIL[j][0] * (1 - f) + PROFIL[j + 1][0] * f, zz = PROFIL[j][1] * (1 - f) + PROFIL[j + 1][1] * f;
    return [r * Math.cos(w), r * Math.sin(w), zz];
  }
  /* Außennormale des Dachrings j beim Winkel w */
  function dachNormale(j, w) {
    const dr = PROFIL[j][0] - PROFIL[j + 1][0], dz = PROFIL[j + 1][1] - PROFIL[j][1];
    return nrm([Math.cos(w) * dz, Math.sin(w) * dz, dr]);
  }
  /* ---------------- Sammelzeichnen ----------------
     Viele gleichfarbige Kleinteile (Birnen, Rippen, Zierrat) werden in
     EINEN Pfad gesammelt und mit einem Befehl gefüllt – das spart auf
     schwachen Geräten sehr viel Zeit gegenüber hunderten Einzelbefehlen. */
  const VORN = [Math.SQRT1_2, Math.SQRT1_2, 0];              // waagerecht zum Betrachter (Kameraraum)
  function kreiseFuellen(g, pts, farbe) {
    if (!pts.length) return;
    g.fillStyle = farbe; g.beginPath();
    for (const [x, y, r] of pts) { g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU); }
    g.fill();
  }
  /* Birnenreihe: pts = Modellpunkte; an = 0 (aus) … 1 (leuchtet) */
  function birnenReihe(g, A, pts, r, an) {
    if (A.silhouette || !pts.length) return;
    const R = Math.max(0.55, r * A.s), kern = [], licht = [];
    for (const p of pts) { const q = A.bild(p); kern.push([q[0], q[1], R]); if (R > 1.3) licht.push([q[0] - R * 0.25, q[1] - R * 0.28, R * 0.42]); }
    if (an > 0.02) {
      kreiseFuellen(g, kern, "rgba(255,220,150," + Math.min(1, 0.55 + 0.45 * an).toFixed(3) + ")");
      kreiseFuellen(g, licht, "rgba(255,255,245," + (0.9 * an).toFixed(3) + ")");
    } else {
      kreiseFuellen(g, kern, A.farbeK([236, 226, 200], [0.5, 0.5, 0.7]));
      kreiseFuellen(g, licht, "rgba(255,255,255,0.7)");
    }
  }
  /* Linienzüge gleicher Farbe und Breite in einem Strich */
  function zuegeZiehen(g, A, zuege, breite, farbe) {
    if (!zuege.length) return;
    g.lineWidth = Math.max(0.5, breite * A.s); g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = farbe;
    g.beginPath();
    for (const z of zuege) z.forEach((p, i) => { const q = A.bild(p); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); });
    g.stroke();
  }
  /* Vielecke gleicher Farbe in einem Pfad */
  function vieleckeFuellen(g, A, polys, farbe) {
    if (!polys.length) return;
    g.fillStyle = farbe; g.beginPath();
    for (const pl of polys) pl.forEach((p, i) => { const q = A.bild(p); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); });
    g.fill();
  }
  /* Blickrichtung (zum Betrachter) im Modellraum als Winkel */
  function blickWinkel(A) { const E = ST.ZUM_AUGE; return Math.atan2(-E[0] * A.sn + E[1] * A.c, E[0] * A.c + E[1] * A.sn); }

  /* Zeltdach aus Stoffbahnen: jede Bahn (zwischen zwei goldenen Rippen)
     ist aus drei genähten Streifen und hängt leicht durch – dadurch ist
     sie an den Rippen heller bzw. dunkler als in der Mitte (Verlauf nach
     der wechselnden Normale), Nähte als feine Linien, zum First hin
     leicht verschmutzt, feine Stoffstruktur darüber. */
  function dach(g, A, phi, bau, winter, zeit) {
    const kSeg = bau >= 1 ? N_SEG : Math.floor(N_SEG * klemm((bau - 0.4) / 0.15, 0, 1));
    const sil = A.silhouette;
    const sichtbar = (j, w) => A.zumAuge(dachNormale(j, w)) > 0.005;
    /* Dachstuhl während des Baus: Königsmast auf der Säule bis zum
       Laternenring, waagerechte Ausleger von der Säule zur Traufe, Traufring,
       gebogene Sparren vom Traufring zum Laternenring – nichts schwebt */
    if (bau < 0.55 && !sil) {
      const holz = A.farbeK(FA.holz, [0.3, 0.3, 0.9]);
      D.stumpf(g, A, [0, 0, HIMMEL_Z - 0.1], [0, 0, TOP_Z + 0.12], 0.13, 0.11, [150, 116, 80], { deckel: [170, 136, 96] });
      const ausleger = [], ring = [], sparren = [];
      for (let i = 0; i < N_SEG; i++) {
        const w = phi + i / N_SEG * TAU;
        ausleger.push([[SAEULE_R * Math.cos(w), SAEULE_R * Math.sin(w), HIMMEL_Z], [(DACH_R - 0.05) * Math.cos(w), (DACH_R - 0.05) * Math.sin(w), BEH_O - 0.1]]);
        sparren.push([0, 1, 2, 3].map((t) => dachPunkt(t, w)));
      }
      for (let k = 0; k <= 48; k++) { const w = k / 48 * TAU; ring.push([(DACH_R - 0.05) * Math.cos(w), (DACH_R - 0.05) * Math.sin(w), BEH_O - 0.05]); }
      zuegeZiehen(g, A, ausleger, 0.08, holz);
      zuegeZiehen(g, A, [ring], 0.1, holz);
      D.ring(g, A, [0, 0, TOP_Z], TOP_R, 0.1, FA.holz, null);
      zuegeZiehen(g, A, sparren, 0.09, holz);
    }
    /* Dachbahnen: 16 Segmente × 3 Ringe, nach Tiefe; nur die zum Betrachter gewandten */
    const segs = [];
    for (let i = 0; i < kSeg; i++) {
      const w0 = phi + i / N_SEG * TAU, w1 = phi + (i + 1) / N_SEG * TAU;
      for (let j = 0; j < 3; j++) {
        if (!sichtbar(j, (w0 + w1) / 2) && !sichtbar(j, w0) && !sichtbar(j, w1)) continue;
        const pts = [dachPunkt(j, w0), dachPunkt(j, w1), dachPunkt(j + 1, w1), dachPunkt(j + 1, w0)];
        segs.push({ i: i, j: j, w0: w0, w1: w1, pts: pts, z: A.tief(mul(add(add(pts[0], pts[1]), add(pts[2], pts[3])), 0.25)) });
      }
    }
    segs.sort((a, b) => a.z - b.z);
    const fein = A.s > 22 && !sil;
    const naehte = [], clipPfad = [];
    for (const sg of segs) {
      const wm = (sg.w0 + sg.w1) / 2, n = dachNormale(sg.j, wm);
      let farbe = sg.i % 2 ? FA.creme : FA.rot;
      /* zum First hin leicht verschmutzt (Ruß, Regen) */
      if (sg.j > 0) farbe = mix(farbe, [110, 96, 86], sg.j * 0.06);
      D.pfad(g, sg.pts.map((p) => A.bild(p)));
      if (sil) { g.fillStyle = "#000"; g.fill(); continue; }
      if (fein) {
        /* Durchhang: Normale kippt an den Rippen zur Bahnmitte hin */
        const tan = (w) => [-Math.sin(w), Math.cos(w), 0];
        const nl = nrm(add(dachNormale(sg.j, sg.w0), mul(tan(sg.w0), 0.22))), nr = nrm(add(dachNormale(sg.j, sg.w1), mul(tan(sg.w1), -0.22)));
        const a = A.bild(mul(add(sg.pts[0], sg.pts[3]), 0.5)), b = A.bild(mul(add(sg.pts[1], sg.pts[2]), 0.5));
        const gr = g.createLinearGradient(a[0], a[1], b[0], b[1]);
        gr.addColorStop(0, A.farbeK(farbe, nrm(A.kam(nl)))); gr.addColorStop(0.5, A.farbeK(farbe, nrm(A.kam(n)))); gr.addColorStop(1, A.farbeK(farbe, nrm(A.kam(nr))));
        g.fillStyle = gr; g.fill();
        g.strokeStyle = gr; g.lineWidth = 0.7; g.stroke();
        /* zwei Nähte je Bahn */
        for (const f of [1 / 3, 2 / 3]) { const w = sg.w0 + (sg.w1 - sg.w0) * f; naehte.push([dachPunkt(sg.j, w), dachPunkt(sg.j + 1, w)]); }
        clipPfad.push(sg.pts);
      } else {
        g.fillStyle = A.farbeK(farbe, nrm(A.kam(n))); g.fill();
        g.strokeStyle = g.fillStyle; g.lineWidth = 0.7; g.stroke();
      }
    }
    if (sil) return;
    if (fein) {
      zuegeZiehen(g, A, naehte, 0.012, "rgba(60,30,30,0.22)");
      /* Stoffstruktur: ein Rauschmuster über alle sichtbaren Bahnen */
      if (A.s > 40 && clipPfad.length) {
        g.save(); g.beginPath();
        for (const pl of clipPfad) pl.forEach((p, i) => { const q = A.bild(p); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); });
        g.clip();
        const e = D.ellipseBild(A, [0, 0, BEH_O], [DACH_R, 0, 0], [0, DACH_R, 0]);
        PI.rauschen(g, e.x - e.r1, e.y - e.r1 * 1.5, e.r1 * 2, e.r1 * 2, A.s * 0.9, 0.1, 21, 4);
        g.restore();
      }
    }
    /* Schnee (Winter): der flache Traufring trägt die meiste Last, entlang
       der goldenen Rippen (Glühbirnen wärmen) schmilzt er in Streifen;
       auf dem mittleren Ring nur ein dünner Rest in den Mulden der Bahnen,
       oben nur Flecken; an der Traufe ein dicker, überhängender Wulst */
    if (winter && bau >= 1) {
      const SCHNEE = [246, 249, 253];
      /* Traufring: geschlossene Decke; oberer Rand als stetige, sanft
         wellige Linie über alle Bahnen (dreht mit), entlang der Rippen ein
         schmaler Schmelzstreifen, der zur Traufe hin zuläuft */
      const rR = (t) => { const p = dachPunkt(t, 0); return Math.max(0.3, Math.hypot(p[0], p[1])); };
      const kante = (w) => 0.8 + 0.07 * Math.sin(3 * (w - phi) + 1) + 0.04 * Math.sin(7 * (w - phi) + 2);
      const lichtS = (n) => A.farbeK(SCHNEE, nrm(A.kam(n)));
      const schneeFl = [];
      for (const sg of segs) {
        if (sg.j !== 0) continue;
        const n = dachNormale(0, (sg.w0 + sg.w1) / 2), heben = mul(n, 0.014);
        const rand = (t) => (0.012 + 0.07 * t) / rR(t);
        const links = [], rechts = [], oben = [];
        for (let q = 0; q <= 5; q++) { const t = q / 5 * kante(sg.w0); links.push(dachPunkt(t, sg.w0 + rand(t))); }
        for (let q = 0; q <= 5; q++) { const t = q / 5 * kante(sg.w1); rechts.push(dachPunkt(t, sg.w1 - rand(t))); }
        for (let q = 1; q < 8; q++) { const w = sg.w0 + (sg.w1 - sg.w0) * q / 8; oben.push(dachPunkt(kante(w), w)); }
        const pts = links.concat(oben, rechts.reverse()).map((p) => add(p, heben));
        /* nasser Saum: über der Schneekante ist das Tuch vom Schmelzwasser
           dunkler – ein weicher, breiter Streifen, den der Schnee halb deckt */
        if (A.s > 30) {
          const saum = [];
          for (let q = 0; q <= 8; q++) { const w = sg.w0 + (sg.w1 - sg.w0) * q / 8; saum.push(A.bild(dachPunkt(kante(w) + 0.03, w))); }
          g.strokeStyle = "rgba(40,16,16,0.14)"; g.lineWidth = A.s * 0.09; g.lineCap = "round";
          g.beginPath(); saum.forEach((s, q) => (q ? g.lineTo(s[0], s[1]) : g.moveTo(s[0], s[1]))); g.stroke();
          g.lineCap = "butt";
        }
        const flBild = pts.map((p) => A.bild(p));
        D.pfad(g, flBild);
        g.fillStyle = lichtS(n); g.fill();
        schneeFl.push(flBild);
        /* Dicke: bläuliche Kante am oberen Rand und an den Schmelzstreifen */
        g.strokeStyle = A.farbeK([170, 186, 212], nrm(A.kam(n)), 0.5); g.lineWidth = Math.max(0.5, A.s * 0.01);
        g.beginPath(); links.slice(2).concat(oben, rechts.slice(0, 4)).forEach((p, q) => { const s = A.bild(add(p, heben)); if (q) g.lineTo(s[0], s[1]); else g.moveTo(s[0], s[1]); }); g.stroke();
      }
      /* Körnung der Schneedecke (Harsch, leichte Verwehungen) und in der
         Nahansicht einzelne glitzernde Kristalle – keine glatte Farbfläche */
      if (A.s > 40 && schneeFl.length) {
        g.save(); g.beginPath();
        for (const pl of schneeFl) pl.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])));
        g.clip();
        const e = D.ellipseBild(A, [0, 0, BEH_O], [DACH_R, 0, 0], [0, DACH_R, 0]);
        PI.rauschen(g, e.x - e.r1, e.y - e.r1 * 1.5, e.r1 * 2, e.r1 * 2, A.s * 0.5, 0.08, 33, 3);
        if (A.s > 70) {
          const rng = ST.zufall(517);
          g.fillStyle = "rgba(255,255,255,0.95)";
          for (let i = 0; i < 260; i++) { const x = e.x - e.r1 + rng() * e.r1 * 2, y = e.y - e.r1 * 0.9 + rng() * e.r1 * 1.8, q = 0.6 + rng() * 1.1; g.fillRect(x, y, q, q); }
        }
        g.restore();
      }
      /* mittlerer Ring: nur ein dünner Rest in der Mulde jeder Bahn (weiche Linse) */
      for (const sg of segs) {
        if (sg.j !== 1) continue;
        const zf = (k) => { const x = Math.sin(sg.i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
        if (zf(0) < 0.25) continue;                  // manche Mulden sind schon leer
        const n = dachNormale(1, (sg.w0 + sg.w1) / 2), heben = mul(n, 0.01), wm = (sg.w0 + sg.w1) / 2 + (zf(1) - 0.5) * 0.04, dw = (sg.w1 - sg.w0) * (0.16 + 0.16 * zf(2));
        const lang = 0.12 + 0.38 * zf(3);
        const pts = [];
        for (let q = 0; q < 12; q++) { const a = q / 12 * TAU, j = 0.75 + 0.5 * zf(4 + q); pts.push(dachPunkt(1.02 + lang * (0.5 - 0.5 * Math.cos(a)) * (0.85 + 0.15 * j), wm + dw * j * Math.sin(a) * (0.6 + 0.4 * Math.cos(a)))); }
        /* weicher Rand: drei Lagen, außen fast durchsichtig (dünn
           auslaufender Schnee), innen deckend – keine ausgeschnittene Form */
        const mitte = dachPunkt(1.02 + lang * 0.5, wm);
        const farbe = A.farbeK(SCHNEE, nrm(A.kam(n)));
        for (const [f, a] of [[1.0, 0.3], [0.82, 0.45], [0.6, 0.7]]) {
          D.pfad(g, pts.map((p) => A.bild(add(add(mitte, mul(sub(p, mitte), f)), heben))));
          g.globalAlpha = a; g.fillStyle = farbe; g.fill();
        }
        g.globalAlpha = 1;
      }
    }
    /* Rippen mit Birnen: nur über sichtbaren Dachringen */
    if (kSeg >= N_SEG) {
      const rippen = [], birnen = [];
      for (let i = 0; i < N_SEG; i++) {
        const w = phi + i / N_SEG * TAU;
        let zug = [];
        for (let k = 0; k <= 12; k++) {
          const t = k / 4;
          if (sichtbar(Math.min(2, Math.floor(Math.max(0, t - 0.01))), w)) zug.push(add(dachPunkt(t, w), [0, 0, 0.02]));
          else { if (zug.length > 1) rippen.push(zug); zug = []; }
        }
        if (zug.length > 1) rippen.push(zug);
        if (bau >= 0.95) for (let j = 0; j < N_BIRNE_RIPPE; j++) { const t = 0.18 + j * 2.64 / (N_BIRNE_RIPPE - 1); if (sichtbar(Math.min(2, Math.floor(t)), w)) birnen.push(add(dachPunkt(t, w), [0, 0, 0.055])); }
      }
      zuegeZiehen(g, A, rippen, 0.05, A.farbeK(FA.gold, [0.4, 0.4, 0.8], null, 0.6));
      birnenReihe(g, A, birnen, 0.03, A.nacht);
    }
    /* Behang (Lambrequin) */
    if (bau >= 0.55) {
      behang(g, A, phi, bau, winter);
      if (bau >= 0.95) girlande(g, A, phi, winter);
    }
    /* Schneewulst an der Traufe, über dem Behang: nur der vordere Bogen
       (der hintere liegt hinter dem Dachkegel) */
    if (winter && bau >= 1 && kSeg >= N_SEG) {
      const wv = blickWinkel(A), pts = [];
      for (let k = 0; k <= 40; k++) { const w = wv - 1.75 + 3.5 * k / 40; pts.push([(DACH_R + 0.01) * Math.cos(w), (DACH_R + 0.01) * Math.sin(w), BEH_O + 0.01]); }
      D.schneeWulst(g, A, pts, [0, 0, 0], 0.12, { saat: 9 });
    }
    /* Laterne mit Kuppel, Knauf und Wimpel */
    if (kSeg >= N_SEG) krone(g, A, phi, winter, zeit);
  }

  /* Behang: 32 Felder, abwechselnd grün mit gemalter Blütenranke und
     bordeaux mit ovalem Spiegel; Goldborten, Bogenkante, zwei Birnenreihen.
     Jedes Feld eine Fläche (eigene Schattierung), der Zierrat gesammelt. */
  function behang(g, A, phi, bau, winter) {
    const kB = bau >= 1 ? N_BEH : Math.floor(N_BEH * klemm((bau - 0.55) / 0.1, 0, 1));
    const h = BEH_O - BEH_U, R = DACH_R, fein = A.s;
    const gold = [], borteU = [], bogen = [], rahmen = [], glas = [], glanz = [], perlen = [], ranke = [], blatt = [], bl1 = [], bl2 = [], mitte = [], birnen = [];
    const ell = (P, cx, cy, rx, ry, n) => { const p = []; for (let k = 0; k < n; k++) { const a = k / n * TAU; p.push(P(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry)); } return p; };
    for (let i = 0; i < kB; i++) {
      const w0 = phi + i / N_BEH * TAU, w1 = phi + (i + 1) / N_BEH * TAU, wm = (w0 + w1) / 2;
      const nv = [Math.cos(wm), Math.sin(wm), 0];
      if (A.zumAuge(nv) < 0.01) continue;
      const o = [R * Math.cos(w0), R * Math.sin(w0), BEH_O], e = [R * Math.cos(w1), R * Math.sin(w1), BEH_O];
      const u = nrm(sub(e, o)), bw = laenge(sub(e, o));
      const P = (x, y) => add(o, add(mul(u, x), [0, 0, -y]));
      const um = [P(0, 0), P(bw, 0), P(bw, h - 0.12), P(bw * 0.75, h - 0.02), P(bw * 0.5, h), P(bw * 0.25, h - 0.02), P(0, h - 0.12)];
      D.vieleck(g, A, um, i % 2 ? FA.bordeaux : FA.gruen, { n: nv, naht: true });
      if (A.silhouette) continue;
      gold.push([P(0, 0), P(bw, 0), P(bw, 0.05), P(0, 0.05)]);
      borteU.push([P(0, h - 0.16), P(bw, h - 0.16), P(bw, h - 0.125), P(0, h - 0.125)]);
      const bz = []; for (let k = 0; k <= 8; k++) { const t = k / 8; bz.push(P(bw * t, h - 0.12 + 0.115 * Math.sin(t * Math.PI))); } bogen.push(bz);
      if (fein >= 10) {
        const cx = bw / 2, cy = h * 0.45;
        if (i % 2) {
          rahmen.push(ell(P, cx, cy, 0.2, 0.17, 18));
          glas.push(ell(P, cx, cy, 0.165, 0.135, 18));
          if (fein > 25) glanz.push([P(cx - 0.12, cy + 0.02), P(cx - 0.02, cy - 0.12), P(cx + 0.03, cy - 0.1), P(cx - 0.08, cy + 0.06)]);
          if (fein > 60) for (let k = 0; k < 14; k++) { const a = k / 14 * TAU, q = A.bild(P(cx + Math.cos(a) * 0.185, cy + Math.sin(a) * 0.155)); perlen.push([q[0], q[1], 0.009 * fein]); }
        } else {
          const rk = []; for (let k = 0; k <= 10; k++) { const t = k / 10; rk.push(P(0.08 + (bw - 0.16) * t, cy - 0.12 * Math.sin(t * TAU))); } ranke.push(rk);
          if (fein > 40) for (const [x, y] of [[cx - 0.12, cy - 0.08], [cx + 0.12, cy + 0.08], [cx - 0.3, cy + 0.02], [cx + 0.3, cy - 0.02]]) blatt.push(ell(P, x, y, 0.04, 0.016, 8));
          for (const [x, y, gelb] of [[cx, cy, true], [cx - 0.2, cy - 0.06, false], [cx + 0.2, cy + 0.06, false]]) {
            for (let k = 0; k < 5; k++) { const a = k / 5 * TAU, q = A.bild(P(x + Math.cos(a) * 0.03, y + Math.sin(a) * 0.03)); (gelb ? bl1 : bl2).push([q[0], q[1], 0.025 * fein]); }
            const q = A.bild(P(x, y)); mitte.push([q[0], q[1], 0.018 * fein]);
          }
        }
      }
      if (bau >= 0.95) for (const t of [0.25, 0.75]) { birnen.push(add(P(bw * t, 0.07), mul(nv, 0.03))); birnen.push(add(P(bw * t, h - 0.16), mul(nv, 0.03))); }
    }
    if (A.silhouette) return;
    const goldF = A.farbeK(FA.gold, VORN, null, 0.8);
    vieleckeFuellen(g, A, gold, goldF); vieleckeFuellen(g, A, borteU, goldF);
    vieleckeFuellen(g, A, rahmen, goldF);
    vieleckeFuellen(g, A, glas, A.farbeK([150, 166, 190], VORN, null, 1));
    vieleckeFuellen(g, A, glanz, A.farbeK([226, 234, 246], VORN, null, 1));
    kreiseFuellen(g, perlen, A.farbeK([250, 240, 210], VORN));
    zuegeZiehen(g, A, ranke, 0.025, goldF);
    vieleckeFuellen(g, A, blatt, A.farbeK([70, 130, 80], VORN));
    kreiseFuellen(g, bl1, A.farbeK([236, 200, 90], VORN)); kreiseFuellen(g, bl2, A.farbeK([230, 120, 140], VORN)); kreiseFuellen(g, mitte, goldF);
    zuegeZiehen(g, A, bogen, 0.03, goldF);
    birnenReihe(g, A, birnen, 0.032, A.nacht);
    void winter;
  }

  /* Girlande unter dem Behang: im Winter Tannengrün mit Kugeln und roten
     Schleifen, im Frühling Buchsgrün mit Blüten und hellen Bändern */
  function girlande(g, A, phi, winter) {
    if (A.silhouette) return;
    const n = 16, zuege = [], nadeln = [], kugelA = [], kugelB = [], klein = [], glanzP = [], blueten = [[], [], []], bmitte = [], schleifen = [];
    const S = A.s;
    for (let i = 0; i < n; i++) {
      const w0 = phi + i / n * TAU, w1 = phi + (i + 1) / n * TAU, wm = (w0 + w1) / 2;
      if (A.zumAuge([Math.cos(wm), Math.sin(wm), 0]) < 0.05) continue;
      const pts = [];
      for (let j = 0; j <= 6; j++) { const t = j / 6, w = w0 + (w1 - w0) * t, r = DACH_R + 0.06; pts.push([r * Math.cos(w), r * Math.sin(w), BEH_U + 0.04 - 0.22 * 4 * t * (1 - t)]); }
      zuege.push(pts);
      if (S > 30) for (let j = 0; j < 12; j++) { const t = (j + 0.5) / 12, k = Math.floor(t * 6), f = t * 6 - k; const q = A.bild(add(mul(pts[k], 1 - f), mul(pts[Math.min(6, k + 1)], f))); nadeln.push([q[0] + ((j * 7) % 5 - 2) * S * 0.011, q[1] + ((j * 3) % 3 - 1) * S * 0.022, S * 0.02]); }
      if (winter) {
        const q = A.bild(add(pts[3], [0, 0, -0.07])); (i % 2 ? kugelA : kugelB).push([q[0], q[1], 0.05 * S]); glanzP.push([q[0] - 0.015 * S, q[1] - 0.018 * S, 0.016 * S]);
        for (const t of [1, 5]) { const q2 = A.bild(add(pts[t], [0, 0, -0.05])); klein.push([q2[0], q2[1], 0.032 * S]); }
      } else {
        for (let j = 1; j < 6; j++) { const q = A.bild(add(pts[j], [0, 0, -0.02])), r = Math.max(0.8, S * 0.03); blueten[(i + j) % 3].push([q[0], q[1], r]); if (r > 2) bmitte.push([q[0], q[1], r * 0.35]); }
      }
      const s = A.bild(pts[0]); schleifen.push(s);
    }
    zuegeZiehen(g, A, zuege, 0.1, A.farbeK(winter ? [34, 70, 42] : [62, 110, 58], VORN));
    kreiseFuellen(g, nadeln, A.farbeK(winter ? [58, 104, 62] : [96, 150, 80], [0, 0.3, 1]));
    if (winter) {
      kreiseFuellen(g, kugelA, A.farbeK(FA.rot, VORN, null, 1)); kreiseFuellen(g, kugelB, A.farbeK(FA.gold, VORN, null, 1));
      kreiseFuellen(g, klein, A.farbeK([196, 204, 216], VORN, null, 1)); kreiseFuellen(g, glanzP, "rgba(255,255,255,0.75)");
    } else {
      const bf = [[236, 150, 170], [250, 248, 240], [244, 206, 90]];
      for (let k = 0; k < 3; k++) kreiseFuellen(g, blueten[k], A.farbeK(bf[k], [0.2, 0.2, 1]));
      kreiseFuellen(g, bmitte, "rgba(240,190,60,0.9)");
    }
    /* Schleifen am Aufhängepunkt mit zwei Bandenden */
    const r = Math.max(1, S * 0.05);
    g.fillStyle = A.farbeK(winter ? FA.rot : [232, 150, 176], [0, 0, 1]);
    g.beginPath();
    for (const s of schleifen) {
      g.moveTo(s[0], s[1]); g.ellipse(s[0] - r, s[1], r, r * 0.6, 0.4, 0, TAU);
      g.moveTo(s[0] + 2 * r, s[1]); g.ellipse(s[0] + r, s[1], r, r * 0.6, -0.4, 0, TAU);
      if (r > 2) { g.moveTo(s[0] - r * 0.3, s[1]); g.lineTo(s[0] - r * 0.9, s[1] + r * 2.2); g.lineTo(s[0] - r * 0.3, s[1] + r * 1.9); g.lineTo(s[0], s[1]); g.lineTo(s[0] + r * 0.6, s[1] + r * 2.1); g.lineTo(s[0] + r * 0.9, s[1] + r * 1.7); g.closePath(); }
    }
    g.fill();
  }
  /* Laterne (Trommel mit Spiegeln), Kuppel, Knauf, Spitze mit Stern (Winter) und Wimpel */
  function krone(g, A, phi, winter, zeit) {
    const z = TOP_Z, zo = z + 0.5;
    D.stumpf(g, A, [0, 0, z - 0.02], [0, 0, zo], TOP_R, TOP_R, FA.creme, { glanz: 0.5, deckel: false });
    if (!A.silhouette) {
      const n = 8;
      for (let i = 0; i < n; i++) {
        const w0 = phi + (i + 0.12) / n * TAU, w1 = phi + (i + 0.88) / n * TAU, wm = (w0 + w1) / 2;
        const nv = [Math.cos(wm), Math.sin(wm), 0];
        if (A.zumAuge(nv) < 0.05) continue;
        const pts = [];
        for (let j = 0; j <= 3; j++) { const w = w0 + (w1 - w0) * j / 3; pts.push([TOP_R * 1.005 * Math.cos(w), TOP_R * 1.005 * Math.sin(w), z + 0.08]); }
        for (let j = 3; j >= 0; j--) { const w = w0 + (w1 - w0) * j / 3; pts.push([TOP_R * 1.005 * Math.cos(w), TOP_R * 1.005 * Math.sin(w), zo - 0.08]); }
        const nk = nrm(A.kam(nv));
        D.pfad(g, pts.map((p) => A.bild(p)));
        if (i % 2) { const a = A.bild(pts[4]), b = A.bild(pts[0]); const gr = g.createLinearGradient(a[0], a[1], b[0], b[1]); gr.addColorStop(0, A.farbeK([214, 226, 240], nk, null, 1)); gr.addColorStop(1, A.farbeK([100, 112, 136], nk)); g.fillStyle = gr; }
        else g.fillStyle = A.farbeK(FA.rot, nk, null, 0.6);
        g.fill();
        g.strokeStyle = A.farbeK(FA.gold, nk, null, 0.9); g.lineWidth = Math.max(0.5, A.s * 0.018); g.stroke();
        const b = [TOP_R * 1.01 * Math.cos(phi + i / n * TAU), TOP_R * 1.01 * Math.sin(phi + i / n * TAU), (z + zo) / 2];
        if (A.zumAuge([Math.cos(phi + i / n * TAU), Math.sin(phi + i / n * TAU), 0]) > 0) D.birne(g, A, b, 0.035, "255,220,150", A.nacht);
      }
      D.ring(g, A, [0, 0, z + 0.02], TOP_R + 0.01, 0.05, FA.gold, "vorn");
      D.ring(g, A, [0, 0, zo], TOP_R + 0.01, 0.05, FA.gold, "vorn");
    }
    /* Kuppel */
    D.stumpf(g, A, [0, 0, zo], [0, 0, zo + 0.18], TOP_R * 1.06, TOP_R * 0.9, winter ? [244, 247, 252] : FA.rot, { glanz: 0.5, deckel: false });
    D.stumpf(g, A, [0, 0, zo + 0.18], [0, 0, zo + 0.5], TOP_R * 0.9, 0.1, winter ? [244, 247, 252] : FA.rot, { glanz: 0.5, deckel: false });
    if (winter) D.ring(g, A, [0, 0, zo + 0.02], TOP_R * 1.06, 0.035, FA.rot, "vorn");
    D.ellipsoid(g, A, [0, 0, zo + 0.58], [0.1, 0, 0], [0, 0.1, 0], [0, 0, 0.1], FA.gold, { glanz: 1 });
    D.strich(g, A, [[0, 0, zo + 0.62], [0, 0, zo + 1.3]], 0.03, FA.gold, {});
    if (!A.silhouette) {
      /* Wimpel, flattert im Wind */
      const pts = [], wind = [0.7, 0.7, 0];
      for (let j = 0; j <= 6; j++) { const t = j / 6; pts.push([wind[0] * t * 0.7, wind[1] * t * 0.7, zo + 1.2 - t * 0.05 + 0.04 * Math.sin((zeit || 0) * 5 - t * 5) * t]); }
      const o = pts.map((p) => A.bild(p)), u = pts.map((p, k) => A.bild(add(p, [0, 0, -0.18 * (1 - 0.8 * (k / 6))])));
      D.pfad(g, o.concat(u.reverse()));
      g.fillStyle = A.farbeK(winter ? FA.rot : FA.gruen, [0.3, -0.3, 0.3]); g.fill();
      if (winter) {
        /* goldener Stern auf der Spitze */
        const c = A.bild([0, 0, zo + 1.42]), R = Math.max(1.5, A.s * 0.14);
        g.beginPath();
        for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? R * 0.42 : R; g.lineTo(c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr); }
        g.closePath();
        g.fillStyle = A.nacht > 0.3 ? "rgb(255,226,150)" : A.farbeK(FA.gold, [0, 0.3, 1], null, 1); g.fill();
      }
    }
  }

  /* Ersatzdach im Sprite: etwas kleiner als das echte, liegt ganz darunter */
  function ersatzdach(g, A, winter) {
    const R = DACH_R * 0.965, zU = BEH_U + 0.14, zO = BEH_O - 0.02;
    D.stumpf(g, A, [0, 0, zU], [0, 0, zO], R, R, FA.bordeaux, { deckel: false });
    g.fillStyle = A.farbeK(winter ? [230, 234, 240] : FA.rot, [0, 0, 1]);
    /* je Dachring die Hülle zweier (etwas kleinerer) Kreise – zusammen nie größer als das echte Dach */
    for (let j = 0; j < 3; j++) {
      const pts = [];
      for (let i = 0; i < 24; i++) { const w = i / 24 * TAU; for (const t of [j, j + 1]) { const p = dachPunkt(t, w); pts.push([p[0] * 0.96, p[1] * 0.96, p[2] - 0.04]); } }
      D.pfad(g, D.huelle2(pts.map((p) => A.bild(p)))); g.fill();
    }
  }

  function schattenMalen(g, A, bau) {
    if (bau < 0.14) return;
    D.stumpf(g, A, [0, 0, 0], [0, 0, POD_Z], POD_R, POD_R, [0, 0, 0], {});
    if (bau >= 0.26) D.stumpf(g, A, [0, 0, 0.5], [0, 0, HIMMEL_Z], SAEULE_R, SAEULE_R, [0, 0, 0], {});
    if (bau >= 0.4) {
      const pts = []; for (let i = 0; i < 24; i++) { const w = i / 24 * TAU; pts.push([DACH_R * Math.cos(w), DACH_R * Math.sin(w), BEH_U]); pts.push([DACH_R * Math.cos(w), DACH_R * Math.sin(w), BEH_O]); }
      for (let i = 0; i < 12; i++) { const w = i / 12 * TAU; pts.push(dachPunkt(2, w)); }
      pts.push([0, 0, TOP_Z + 1]);
      D.pfad(g, D.huelle2(pts.map((p) => A.bild(p)))); g.fillStyle = "#000"; g.fill();
    }
  }

  /* =====================================================================
     MODELL
     ===================================================================== */
  ST.modell("karussell", {
    name: "Karussell", gruppe: "Weihnachten", grund: [9.4, 9.4], hoehe: 8.2, bauzeit: 5 * 60,
    bauen(M, o) {
      const bau = o.bau == null ? 1 : o.bau;
      const lebend = !!o.objekt && bau >= 1;
      const winter = o.jahr === "winter";
      const zustand = { gier: 0 };
      M.teil("karussell", { mitte: [0, 0, 1] });
      M.figur({
        x: 0, y: 0, z: 0, breite: 0.1, hoehe: 0.1, schatten: true,
        malen(g, s, F) {
          if (!F.schatten) { zustand.gier = F.gier || 0; zustand.s = s; }
          const A = new D.Ansicht({ s: s, gier: zustand.gier, Z: F.Z, jahr: F.jahr, schatten: !!F.schatten });
          if (F.schatten) { D.schattenPuffer(g, (h) => schattenMalen(h, A, bau)); return; }
          /* Übersicht (unter etwa 12 Bildpunkten je Meter): die Drehung ist
             dort kaum zu sehen – alles steht still im Sprite, kein Aufwand je Bild */
          zustand.still = s < 12 * Math.max(1, (ST.kamera && ST.kamera.dpr) || 1);
          D.weichMalen(g, (g2) => {
            if (lebend && !zustand.still) {
              /* in der Stadt: nur Podest und Ersatzdach – der Rest dreht sich */
              podest(g2, A, bau, winter);
              ersatzdach(g2, A, winter);
            } else karussell(g2, A, { bau: bau, winter: winter, phi: 0.3, t: 0 });
          });
        }
      });
      if (lebend) M.lebendig((g, P) => {
        if (zustand.still) return;
        const O = P.proj(0, 0, 0);
        const A = new D.Ansicht({ s: P.s, c: P.c, sn: P.sn, tx: O[0], ty: O[1], Z: P.Z, jahr: P.jahr });
        const phi = (P.t || 0) * OMEGA;
        /* Ausschnitt: Bühne bis Wimpel */
        const R = DACH_R + 0.5, box = [Infinity, Infinity, -Infinity, -Infinity];
        for (const z of [0, TOP_Z + 2]) for (const x of [-R, R]) for (const y of [-R, R]) {
          const q = P.proj(x, y, z);
          box[0] = Math.min(box[0], q[0]); box[1] = Math.min(box[1], q[1]); box[2] = Math.max(box[2], q[0]); box[3] = Math.max(box[3], q[1]);
        }
        D.weichLeben(g, box, zustand, (g2) => karussell(g2, A, { bau: 1, winter: winter, phi: phi, t: P.t, cache: true, ohnePodest: true, sBild: zustand.s || P.s }));
        if (P.Z.nacht > 0.02) birnenSchein(g, A, phi, P.Z.nacht, winter);
      });
      M.teil("huelle", { schatten: false, mitte: [0, 0, -50] });
      const leer = { malen: null, keinLicht: true, keinAo: true };
      M.flaeche(Object.assign({ name: "h0", o: [-POD_R - 0.3, -POD_R - 0.3, 0], u: [1, 0, 0], v: [0, 1, 0], w: 2 * POD_R + 0.6, h: 2 * POD_R + 0.6 }, leer));
      M.flaeche(Object.assign({ name: "h1", o: [-DACH_R - 0.3, -DACH_R - 0.3, TOP_Z + 2.2], u: [1, 0, 0], v: [0, 1, 0], w: 2 * DACH_R + 0.6, h: 2 * DACH_R + 0.6 }, leer));
      /* Platz für den ganzen Bodenschatten (sonst schneidet die Spritekante ihn ab) */
      D.schattenRaum(M, o, [[0, POD_R], [BEH_U, DACH_R], [BEH_O, DACH_R], [PROFIL[2][1], PROFIL[2][0]], [TOP_Z + 0.6, TOP_R + 0.1], [TOP_Z + 1.6, 0.35]]);
      /* Kontaktschatten erst, wenn etwas auf dem Fundament steht (sonst läge
         ein dunkles Viereck über der offenen Baugrube) */
      if (bau >= 0.14) {
        M.teil("fuss", { schatten: true, mitte: [0, 0, -40] });
        M.flaeche(Object.assign({ name: "fuss", o: [-POD_R, -POD_R, 0.01], u: [1, 0, 0], v: [0, 1, 0], w: 2 * POD_R, h: 2 * POD_R,
          umriss: Array.from({ length: 24 }, (_, i) => { const w = i / 24 * TAU; return [POD_R + POD_R * 0.97 * Math.cos(w), POD_R + POD_R * 0.97 * Math.sin(w)]; }) }, leer));
      }
      if (bau >= 1) {
        M.licht(0, 0, HIMMEL_Z - 0.3, 4.2, "255,200,130", 0.45);
        M.bodenlicht(0, 0, 7.5, "255,196,120", 0.9);
      }
    }
  });

  /* Schein der Birnen (nachts): ein weiches Licht je sichtbarer Birne */
  function birnenSchein(g, A, phi, nacht, winter) {
    const S = scheinBild();
    const W = g.canvas.width, H = g.canvas.height;
    const r = Math.max(4, A.s * 0.32);
    g.save();
    g.globalCompositeOperation = "lighter";
    g.globalAlpha = Math.min(1, nacht * 0.75);
    const setz = (p) => { const q = A.bild(p); if (q[0] < -r || q[1] < -r || q[0] > W + r || q[1] > H + r) return; g.drawImage(S, q[0] - r, q[1] - r, 2 * r, 2 * r); };
    for (let i = 0; i < N_BEH; i++) {
      const wm = phi + (i + 0.5) / N_BEH * TAU;
      if (A.zumAuge([Math.cos(wm), Math.sin(wm), 0]) < 0.01) continue;
      const w0 = phi + i / N_BEH * TAU, w1 = phi + (i + 1) / N_BEH * TAU;
      for (const t of [0.25, 0.75]) {
        const w = w0 + (w1 - w0) * t, R = DACH_R + 0.03;
        setz([R * Math.cos(w), R * Math.sin(w), BEH_O - 0.07]);
        setz([R * Math.cos(w), R * Math.sin(w), BEH_U + 0.16]);
      }
    }
    for (let i = 0; i < N_SEG; i++) {
      const w = phi + i / N_SEG * TAU;
      for (let j = 0; j < N_BIRNE_RIPPE; j += 2) {
        const t = 0.18 + j * 2.64 / (N_BIRNE_RIPPE - 1);
        /* nur Birnen auf der sichtbaren Dachseite: der Schein verdeckter
           Birnen legte sich sonst als Fleck auf Kuppel und Vorderdach */
        if (A.zumAuge(dachNormale(Math.min(2, Math.floor(t)), w)) <= 0.005) continue;
        setz(add(dachPunkt(t, w), [0, 0, 0.055]));
      }
    }
    g.restore();
    void winter;
  }

  ST.karussellIntern = { pferd: pferd, kutsche: kutsche, karussell: karussell, dach: dach, saeule: saeule, birnenSchein: birnenSchein, girlande: girlande, krone: krone };
})();
