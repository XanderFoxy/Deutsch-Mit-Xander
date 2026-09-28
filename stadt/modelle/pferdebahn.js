/* =====================================================================
   DÖBELNER PFERDEBAHN — Wagen Nr. 1 mit Pferd und Kutscher
   ---------------------------------------------------------------------
   XANDER: Die Döbelner Pferdebahn als Vorbild für die Pferdewagen, die in
   der Automatik Korn zur Mühle und Mehl zur Bäckerei bringen. „Da gibt's
   auch Gleise im Stadtbild dafür … dass man dann auch entsprechend die
   Gleise für die Pferdebahn legt, damit die Pferdebahn auch weiß, wo sie
   lang fahren soll."

   VORBILD (Foto Obermarkt Döbeln): zweiachsiger Wagen auf Meterspur,
   Wagenkasten unten weinrot lackiert mit cremefarbenen Zierlinien und der
   Aufschrift „Döbelner Straßenbahn", oben cremefarben mit hohen
   Rundbogenfenstern, offene Plattformen vorn und hinten mit rot
   lackierter Stirnwand (große „1"), Messingstangen, Glocke, Tafel „Die
   Absicht zum Aussteigen gebe man dem Führer durch Ziehen am
   Glockenriemen kund.", gewölbtes helles Dach über die ganze Länge.
   Davor ein dunkelbraunes Pferd mit weißen Hinterfesseln im
   Kummetgeschirr (heller Kummet mit rotem Polster, Scheuklappen),
   Zugstränge zum Ortscheit am Wagen; der Kutscher in dunkelblauer
   Uniform mit Schirmmütze steht auf der vorderen Plattform.

   MASSE: Wagen 6,2 m über die Stirnwände, Kasten 3,6 m × 1,9 m, Dach
   2,92 m über Schienenoberkante, Spur 1000 mm, Achsstand 2 m, Räder
   0,68 m. Pferd: Stockmaß 1,60 m, 2,4 m von der Schnauze bis zum
   Sitzbein. Alles zusammen 9,4 m lang. Vorn ist +y (das Pferd läuft
   nach +y), so fährt die Bahn auf dem Gleisstück (gleis_pferdebahn)
   bei gleicher Drehung längs.

   LAUFBILDER: variante "schritt0" … "schritt3" zeigt die vier Bilder
   des Schritts (Viertakt: links hinten, links vorn, rechts hinten,
   rechts vorn). Ohne Variante steht das Pferd. In der Werkbank wählt
   saat=0…3 das Laufbild (saat ≥ 4: stehen).

   AUFBAU: Das ganze Gespann ist EINE Figur, gezeichnet mit der
   Drechselbank (unten wortgleich wie in pyramide.js, krippe.js,
   karussell.js), damit Pferd und Kutscher in jedem Winkel rund und
   richtig beleuchtet sind. Die Reihenfolge (hinten zuerst) kommt aus
   Trennebenen quer zur Fahrtrichtung: Fahrwerk → Plattformen und
   Wagenkasten nach Blickrichtung → Dach zuletzt; das Pferd liegt vor
   oder hinter dem Wagen, je nachdem, von wo man schaut.
   Die Pferdewerkstatt (ST.pferde: Pferd, Geschirr, Kutscher) benutzt
   auch pferdewagen_korn.js.
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

/* ===== PFERDEWERKSTATT-ANFANG ===== */
/* =====================================================================
   PFERDEWERKSTATT — Zugpferd im Kummetgeschirr und Kutscher
   ---------------------------------------------------------------------
   Figurraum wie in der Figurenwerkstatt: x = rechte Seite des Pferdes,
   y = Blickrichtung (vorn), z = oben, Hufe auf 0. Der Ursprung liegt
   unter der Rumpfmitte.

   KÖRPERBAU (Warmblut, Stockmaß 1,60 m): Rumpf als Loft von der Kruppe
   über Hüfthöcker, Sattellage und Widerrist bis zur Brust (Rumpftiefe
   0,76 m ≈ Beinlänge), Schulter und Keule als eigene Muskelpakete, Hals
   tief angesetzt und nach vorn oben gebogen, Kopf 0,62 m mit Ganaschen,
   Nüstern, Scheuklappen. Beine mit Ellbogen, Vorderfußwurzel,
   Knie/Sprunggelenk, Röhre, Fessel und Huf; die Unterbeine dunkel
   (Braune haben schwarze Beine), weiße Fesseln wie beim Döbelner Pferd.

   SCHRITT (Viertakt): Reihenfolge links hinten → links vorn → rechts
   hinten → rechts vorn, je ¼ Takt versetzt; jedes Bein steht 62,5 % des
   Takts am Boden (drei Hufe tragen, einer schwingt). Das Stützbein ist
   gestreckt, der Ellbogen bzw. das Knie folgt dem Huf; das Schwungbein
   wird mit zwei Knochen (Unterarm/Röhre bzw. Unterschenkel/Röhre)
   gebeugt – vorn klappt die Vorderfußwurzel nach vorn, hinten das
   Sprunggelenk nach hinten; Fessel und Huf klappen dabei nach hinten.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const VERSION = 1;
  if (ST.pferde && ST.pferde.version >= VERSION) return;
  const D = ST.drechsel;
  if (!D || !ST.figuren) { console.error("Pferdewerkstatt braucht die Drechselbank und die Figurenwerkstatt"); return; }
  const Figur = D.Figur;
  const { add, sub, mul, nrm, mix } = D.v;
  const TAU = Math.PI * 2;

  /* Fellfarben. socken: [vorn links, vorn rechts, hinten links, hinten rechts] */
  const ARTEN = {
    dunkelbraun: { fell: [70, 41, 29], dunkel: [36, 27, 23], maehne: [26, 21, 19], huf: [72, 62, 54], hufHell: [196, 176, 146], weiss: [236, 232, 224], socken: [0, 0, 1, 1], schnippe: true },
    fuchs: { fell: [156, 88, 46], dunkel: [120, 66, 36], maehne: [176, 110, 60], huf: [84, 72, 62], hufHell: [200, 180, 150], weiss: [238, 234, 226], socken: [0, 1, 0, 0], blesse: true }
  };
  const LEDER = [34, 29, 26], LEDER_BRAUN = [120, 76, 44], MESSING = [206, 168, 84], KUMMET = [214, 198, 160], POLSTER = [150, 28, 34];

  /* ---------------- Gangwerk ---------------- */
  const STUETZ = 0.625;                       // Anteil des Takts am Boden
  const VERSATZ = { vl: 0.25, vr: 0.75, hl: 0, hr: 0.5 };
  function phase(p) {
    p = ((p % 1) + 1) % 1;
    if (p < STUETZ) return { dy: 0.5 - p / STUETZ, hub: 0, beuge: 0 };
    const u = (p - STUETZ) / (1 - STUETZ), sm = u * u * (3 - 2 * u);
    return { dy: -0.5 + sm, hub: Math.sin(Math.PI * u), beuge: Math.sin(Math.PI * Math.min(1, u * 1.25)) };
  }
  /* Drehung eines (y, z)-Vektors nach hinten (a > 0: das untere Ende schwingt nach −y) */
  const dreh = (v, a) => [v[0] * Math.cos(a) + v[1] * Math.sin(a), -v[0] * Math.sin(a) + v[1] * Math.cos(a)];
  /* Zwei Knochen von R nach T (in y, z), Gelenk auf Seite s (+1 = vorn) */
  function zweiKnochen(R, T, L1, L2, s) {
    let dy = T[0] - R[0], dz = T[1] - R[1], d = Math.hypot(dy, dz);
    const mx = L1 + L2 - 1e-4;
    if (d > mx) { T = [R[0] + dy / d * mx, R[1] + dz / d * mx]; dy = T[0] - R[0]; dz = T[1] - R[1]; d = mx; }
    const uy = dy / d, uz = dz / d;
    const a = (L1 * L1 - L2 * L2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
    return { J: [R[0] + uy * a - s * uz * h, R[1] + uz * a + s * uy * h], T: T };
  }

  /* Ein Bein: vorn (true/false), Seite sx (−1 links, +1 rechts), Takt ph
     (null = stehen). Gibt die Gelenkpunkte zurück (für Geschirr u. Ä.) */
  function bein(F, art, vorn, sx, ph) {
    const x = sx * (vorn ? 0.165 : 0.17);
    const weg = vorn ? 0.84 : 0.72, y0 = vorn ? 0.53 : -0.48;
    const P = ph == null ? { dy: 0, hub: 0, beuge: 0 } : phase(ph);
    const dy = P.dy * weg;
    let a = P.beuge * (vorn ? 1.9 : 1.25);
    if (P.hub === 0 && P.dy < -0.36) a = Math.min(1, (-0.36 - P.dy) / 0.14) * 0.45;   // Abrollen: die Trachten heben sich
    const hv0 = [0.012, -0.085], pv0 = [0.055, -0.105];
    let hv = dreh(hv0, a), pv = dreh(pv0, a * 0.8);
    let huf = [y0 + dy, (vorn ? 0.2 : 0.15) * P.hub + (P.hub === 0 ? Math.max(0, -hv[1] - 0.085) : 0)];
    let kron = [huf[0] - hv[0], huf[1] - hv[1]];
    let fes = [kron[0] - pv[0], kron[1] - pv[1]];
    let oben, gel, top;
    if (vorn) {
      const L1 = 0.44, L2 = 0.27, ey = 0.5 + dy * 0.3;
      const ez = fes[1] + Math.sqrt(Math.max(0, (L1 + L2) * (L1 + L2) - (ey - fes[0]) * (ey - fes[0])));
      oben = [ey, P.hub > 0 ? 0.9 : Math.min(0.93, ez)];
      const r = zweiKnochen(oben, fes, L1, L2, 1);
      gel = r.J; fes = r.T;
      top = [0.53 + dy * 0.12, 1.2];
    } else {
      const L1 = 0.5, L2 = 0.42;
      oben = [-0.36 + dy * 0.4, 1.0];
      const r = zweiKnochen(oben, fes, L1, L2, -1);
      gel = r.J; fes = r.T;
      top = [-0.52 + dy * 0.18, 1.18];
    }
    kron = [fes[0] + pv[0], fes[1] + pv[1]];
    huf = [kron[0] + hv[0], kron[1] + hv[1]];
    const Q = (p, xx) => [xx == null ? x : xx, p[0], p[1]];
    const i = (vorn ? 0 : 2) + (sx > 0 ? 1 : 0);
    const socke = art.socken[i];
    const fell = art.fell, dk = art.dunkel;
    const unten = socke ? mix(dk, art.weiss, 0.35) : dk;
    const m1 = [(oben[0] + gel[0]) / 2, (oben[1] + gel[1]) / 2], m2 = [(gel[0] + fes[0]) / 2, (gel[1] + fes[1]) / 2];
    if (vorn) {
      F.rohr([Q(top, x * 0.9), Q(oben), Q(m1), Q(gel), Q(m2), Q(fes)], [[0.1, 0.15], [0.085, 0.12], [0.068, 0.09], [0.057, 0.066], [0.042, 0.052], [0.05, 0.058]], fell,
        { n: 12, glanz: 0.22, farbeRing: [fell, fell, mix(fell, dk, 0.35), dk, dk, unten] });
    } else {
      F.rohr([Q(top, x * 0.95), Q(oben), Q(m1), Q(gel), Q(m2), Q(fes)], [[0.15, 0.26], [0.12, 0.17], [0.085, 0.12], [0.058, 0.088], [0.044, 0.054], [0.052, 0.06]], fell,
        { n: 12, glanz: 0.22, farbeRing: [fell, fell, mix(fell, dk, 0.25), mix(fell, dk, 0.6), dk, unten] });
      /* Fersenbein: der Höcker hinten am Sprunggelenk */
      F.ell(Q([gel[0] - 0.045, gel[1] + 0.03]), 0.04, 0.035, 0.05, mix(fell, dk, 0.55), { glanz: 0.2, b: -0.01 });
    }
    /* Fessel und Huf */
    const fesFarbe = socke ? art.weiss : dk;
    F.rohr([Q(fes), Q([(fes[0] + kron[0]) / 2, (fes[1] + kron[1]) / 2]), Q(kron)], [[0.05, 0.058], [0.044, 0.05], [0.046, 0.052]], fesFarbe, { n: 10, glanz: 0.15, b: 0.002 });
    const hf = socke ? art.hufHell : art.huf;
    F.zyl(Q(kron), Q(huf), 0.048, 0.062, hf, { deckel: mix(hf, [0, 0, 0], 0.35), glanz: 0.35, b: 0.003 });
    return { oben: Q(oben), gel: Q(gel), fes: Q(fes), huf: Q(huf) };
  }

  /* ---------------- Das Pferd ---------------- */
  const PFERDE = new Map();
  /* o.art ("dunkelbraun"|"fuchs"), o.schritt (0…3 oder null = stehen),
     o.geschirr: "kummet" (Pferdebahn, Zugstränge) | "gabel" (Wagen mit Schere) */
  function pferd(o) {
    o = o || {};
    const schl = [o.art, o.schritt, o.geschirr].join("|");
    if (PFERDE.has(schl)) return PFERDE.get(schl);
    const art = ARTEN[o.art] || ARTEN.dunkelbraun;
    const F = new Figur();
    const fell = art.fell, GL = 0.3;
    const R = (y, zc, hw, hh) => ({ c: [0, y, zc], a: [hw, 0, 0], b: [0, 0, hh] });
    /* Rumpf: Sitzbein → Kruppe → Hüfte → Sattellage → Gurtlage → Widerrist → Schulter → Brust */
    F.loft([R(-0.87, 1.23, 0.05, 0.08), R(-0.83, 1.24, 0.17, 0.25), R(-0.73, 1.24, 0.26, 0.33), R(-0.57, 1.25, 0.3, 0.33), R(-0.37, 1.22, 0.31, 0.35),
      R(-0.12, 1.19, 0.32, 0.34), R(0.12, 1.2, 0.32, 0.36), R(0.34, 1.24, 0.29, 0.37), R(0.54, 1.22, 0.25, 0.34), R(0.7, 1.17, 0.19, 0.27), R(0.8, 1.14, 0.1, 0.16)], fell, { n: 20, glanz: GL });
    for (const sx of [-1, 1]) {
      /* Keule (Hinterbacke) und Schulter als Muskelpakete */
      F.ellR([sx * 0.2, 0.5, 1.2], [0, 0.55, -1], 0.3, 0.07, 0.15, fell, { glanz: 0.1, b: 0.01 });
    }
    F.ell([0, 0.74, 1.08], 0.2, 0.1, 0.18, fell, { glanz: 0.1 });
    /* Beine */
    const S = o.schritt == null ? null : (o.schritt % 4) / 4 + 0.0625;
    const B = {};
    for (const [n, vorn, sx] of [["vl", true, -1], ["vr", true, 1], ["hl", false, -1], ["hr", false, 1]]) B[n] = bein(F, art, vorn, sx, S == null ? null : S + VERSATZ[n]);
    /* Hals: tief angesetzt, nach vorn oben gebogen */
    F.rohr([[0, 0.5, 1.3], [0, 0.7, 1.48], [0, 0.88, 1.66], [0, 1.02, 1.8], [0, 1.12, 1.9]], [[0.22, 0.34], [0.17, 0.27], [0.13, 0.2], [0.1, 0.16], [0.085, 0.13]], fell, { n: 16, glanz: GL });
    /* Kopf: Genick → Stirn → Nasenrücken → Maul */
    const gen = [0, 1.13, 1.93], d = nrm([0, 0.6, -0.8]), vorn = nrm([0, 0.8, 0.6]);
    const at = (t, v) => add(add(gen, mul(d, 0.62 * t)), mul(vorn, v || 0));
    const kopfAb = F.t.length;
    F.rohr([at(-0.06, -0.017), at(0.1, -0.037), at(0.3, -0.02), at(0.55, 0.007), at(0.8, 0), at(0.95, -0.007), at(1.02, -0.01)],
      [[0.094, 0.131], [0.118, 0.168], [0.104, 0.141], [0.084, 0.108], [0.087, 0.111], [0.077, 0.097], [0.034, 0.047]], fell, { n: 14, glanz: GL });
    F.ellR(at(0.9, -0.084), d, 0.084, 0.06, 0.04, mix(fell, [60, 50, 48], 0.3), { glanz: GL, b: 0.005 });
    for (const sx of [-1, 1]) {
      /* Ohren, gespitzt */
      F.rohr([add(gen, [sx * 0.06, -0.02, 0.05]), add(gen, [sx * 0.075, -0.03, 0.15]), add(gen, [sx * 0.08, -0.03, 0.23])], [[0.034, 0.02], [0.028, 0.017], [0.005, 0.005]], fell, { n: 8, glanz: GL, seite: [0, 1, 0] });
      F.ellA(add(gen, [sx * 0.077, -0.005, 0.14]), [0, 0, 0.05], [0, 0.013, 0], [sx * 0.006, 0.005, 0], mix(fell, [30, 20, 18], 0.5), { flach: true, b: 0.02, ab: 45 });
      /* Auge mit Lichtpunkt */
      const au = add(at(0.28, 0.034), [sx * 0.104, 0, 0]);
      F.ellA(au, mul(d, 0.028), mul(vorn, 0.02), [sx * 0.01, 0, 0], [22, 16, 14], { flach: true, b: 0.03, ab: 22 });
      F.ellA(add(au, [sx * 0.003, 0, 0.007]), [0, 0.007, 0], [0, 0, 0.007], [sx * 0.006, 0, 0], [255, 255, 255], { flach: true, b: 0.04, ab: 70 });
      /* Ganasche */
      F.ellA(add(at(0.16, -0.067), [sx * 0.1, 0, 0]), mul(d, 0.084), mul(vorn, 0.075), [sx * 0.02, 0, 0], fell, { b: 0.01, glanz: GL, ab: 20 });
      /* Nüstern */
      F.ellA(add(at(0.94, 0.05), [sx * 0.054, 0, 0]), mul(d, 0.024), mul(vorn, 0.017), [sx * 0.01, 0, 0], [30, 20, 20], { flach: true, b: 0.03, ab: 35 });
    }
    if (art.schnippe) F.ellA(at(0.86, 0.105), mul(d, 0.045), [0.03, 0, 0], mul(vorn, 0.01), art.weiss, { flach: true, b: 0.03, ab: 18 });
    if (art.blesse) F.ellA(at(0.5, 0.12), mul(d, 0.26), [0.028, 0, 0], mul(vorn, 0.01), art.weiss, { flach: true, b: 0.03, ab: 12 });
    const kopfBis = F.t.length;
    /* Mähne (liegt nach rechts), Schopf, Schweif */
    const kamm = [[0.38, 1.64], [0.56, 1.71], [0.72, 1.79], [0.88, 1.87], [1.01, 1.94], [1.09, 1.98]];
    F.rohr(kamm.map(([y, z]) => [0.0, y, z]), [[0.035, 0.03], [0.045, 0.04], [0.05, 0.045], [0.045, 0.045], [0.04, 0.04], [0.03, 0.03]], art.maehne, { n: 8, glanz: 0.35, b: 0.02 });
    /* die Mähne fällt als Vorhang auf die rechte Halsseite (flacher Loft am Hals entlang) */
    const mR = kamm.map(([y, z], k) => {
      const lang = [0.09, 0.15, 0.17, 0.16, 0.13, 0.08][k];
      const n = nrm([1, 0, 0.25]), t = nrm([0.35, 0, -1]);
      return { c: add([0.035, y, z - 0.01], mul(t, lang * 0.55)), a: mul(n, 0.022), b: mul(t, lang * 0.55), w: 0.25, ph: k };
    });
    F.loft(mR, art.maehne, { n: 12, wellen: 7, glanz: 0.3, b: 0.02 });
    const schopf = F.t.length;
    F.rohr([add(gen, [0, 0.03, 0.05]), at(0.12, 0.1), at(0.26, 0.112)], [[0.04, 0.016], [0.035, 0.014], [0.006, 0.004]], art.maehne, { n: 8, glanz: 0.35, seite: [1, 0, 0], b: 0.03 });
    F.rohr([[0, -0.84, 1.45], [0, -0.92, 1.36], [0.01, -0.95, 1.12], [0.02, -0.93, 0.82], [0.02, -0.9, 0.58]], [[0.05, 0.06], [0.07, 0.08], [0.09, 0.08], [0.095, 0.07], [0.05, 0.035]], art.maehne, { n: 10, glanz: 0.3, b: -0.02 });

    const zaum = F.t.length;
    /* ---------- Zaumzeug: Genickstück, Backenstücke, Stirnband, Nasenriemen, Scheuklappen, Gebiss ---------- */
    for (const sx of [-1, 1]) {
      F.strich([add(gen, [sx * 0.08, 0.0, 0.03]), add(at(0.3, 0.0), [sx * 0.11, 0, 0]), add(at(0.84, -0.03), [sx * 0.09, 0, 0])], 0.022, LEDER, { gs: sx, b: 0.035, ab: 12 });
      /* Scheuklappe: steht vor dem Auge ab */
      F.ellA(add(at(0.3, 0.02), [sx * 0.135, 0, 0.0]), mul(d, 0.055), mul(vorn, 0.05), [sx * 0.012, 0, 0], LEDER, { flach: true, beidseitig: true, gs: sx, b: 0.05, glanz: 0.5 });
      F.ellA(add(at(0.84, -0.03), [sx * 0.092, 0, 0]), [0, 0.02, 0], [0, 0, 0.02], [sx * 0.006, 0, 0], [196, 198, 202], { flach: true, gs: sx, b: 0.05, glanz: 0.9, ab: 25 });
    }
    F.strich([add(at(0.62, 0.0), [-0.095, 0, 0]), at(0.62, 0.1), add(at(0.62, 0.0), [0.095, 0, 0])], 0.022, LEDER, { gs: 0, b: 0.04, ab: 14 });
    F.strich([add(at(0.07, 0.02), [-0.112, 0, 0]), at(0.07, 0.112), add(at(0.07, 0.02), [0.112, 0, 0])], 0.014, [150, 148, 150], { gs: 0, b: 0.05, ab: 16 });

    /* Kopf, Schopf und Zaumzeug als eigene Gruppe markieren (siehe zeichnen) */
    const kopfTeil = (i) => { F.t[i].o = Object.assign({}, F.t[i].o, { kopf: 1 }); };
    for (let i = kopfAb; i < kopfBis; i++) kopfTeil(i);
    kopfTeil(schopf);
    for (let i = zaum; i < F.t.length; i++) kopfTeil(i);
    if (o.geschirr !== "keins") geschirr(F, art, o.geschirr || "kummet");
    PFERDE.set(schl, F);
    return F;
  }

  /* ---------- Kummetgeschirr: Kummet mit Polster und Messingbügeln,
     Kammdeckel mit Bauchgurt, Schweifriemen, Zugstränge ---------- */
  const KM = [0, 0.6, 1.42], KUP = nrm([0, -0.7, 1]), KVOR = nrm([0, 1, 0.7]);
  function kummetPunkt(th, aus, vor) {
    const w = 0.285 - 0.15 * Math.pow((1 + Math.cos(th)) / 2, 2);
    const h = Math.cos(th) > 0 ? 0.37 : 0.33;
    const x = Math.sin(th) * (w + (aus || 0)), u = Math.cos(th) * (h + (aus || 0));
    return add(add(add(KM, [x, 0, 0]), mul(KUP, u)), mul(KVOR, vor || 0));
  }
  function geschirr(F, art, typ) {
    /* Kummet in Stücken: jedes Stück weiß, wohin es schaut (gs = Normale),
       und liegt damit je nach Blick vor oder hinter Hals und Brust */
    const radial = (th) => nrm(add(add(mul([1, 0, 0], Math.sin(th)), mul(KUP, Math.cos(th))), mul(KVOR, 0.8)));
    for (const sx of [-1, 1]) {
      for (let k = 0; k < 12; k += 2) {
        const pts = [], rad = [], pi = [], rp = [];
        for (let j = k; j <= k + 2; j++) {
          const th = sx * (j / 12) * Math.PI;
          pts.push(kummetPunkt(th, 0, 0)); rad.push([0.07 - 0.02 * Math.pow(Math.cos(th / 2), 4), 0.075]);
          pi.push(kummetPunkt(th, -0.06, 0.035)); rp.push([0.032, 0.03]);
        }
        const n = radial(sx * (k + 1) / 12 * Math.PI);
        F.rohr(pts, rad, KUMMET, { n: 10, glanz: 0.3, seite: KVOR, kappen: false, gs: n });
        F.rohr(pi, rp, POLSTER, { n: 8, glanz: 0.25, seite: KVOR, kappen: false, gs: nrm(add(mul(n, 0.5), KVOR)), b: 0.12 });
      }
      /* Messingbügel vorn auf dem Kummet, oben mit Knauf */
      for (let k = 0; k < 8; k += 2) {
        const bg = [];
        for (let j = k; j <= k + 2; j++) bg.push(kummetPunkt(sx * (0.12 + j / 8 * 2.6), 0.02, 0.06));
        F.strich(bg, 0.028, MESSING, { gs: radial(sx * (0.12 + (k + 1) / 8 * 2.6)), b: 0.07, ab: 10 });
      }
      const kn = kummetPunkt(sx * 0.14, 0.02, 0.05);
      F.kap(kn, add(kn, [sx * 0.02, -0.03, 0.13]), 0.022, 0.016, MESSING, { glanz: 0.8, gs: 0, b: 0.08 });
      /* Zierkette unten am Kummet */
      const kt = [];
      for (let k = 0; k <= 6; k++) kt.push(kummetPunkt(sx * (1.7 + k / 6 * 1.35), 0.07, 0.03));
      F.strich(kt, 0.014, [150, 150, 156], { gs: radial(sx * 2.4), b: 0.075, ab: 30 });
    }
    /* roter Zierkamm oben auf dem Kummet */
    for (let k = 0; k < 6; k++) { const p = kummetPunkt(0, 0.075 + k * 0.012, -0.02 + k * 0.02); F.ell(p, 0.018, 0.02, 0.022, POLSTER, { gs: 0, b: 0.09, glanz: 0.2 }); }
    /* Kammdeckel (kleiner Sattel), Bauchgurt, Schweifriemen */
    F.ellR([0, 0.12, 1.555], [0, 1, 0], 0.15, 0.17, 0.05, LEDER, { glanz: 0.45, gs: 0, b: 0.03 });
    F.ring([0, 0.12, 1.62], 0.03, 0.012, MESSING, { gs: 0, b: 0.05, ab: 25 });
    for (const sx of [-1, 1]) {
      const band = [];
      for (let k = 0; k <= 8; k++) { const w = Math.PI / 2 - k / 8 * Math.PI; band.push([sx * (0.335 * Math.cos(w) + 0.01), 0.16, 1.2 + 0.375 * Math.sin(w)]); }
      F.strich(band, 0.07, LEDER, { gs: sx });
    }
    F.strich([[0, 0.05, 1.57], [0, -0.3, 1.585], [0, -0.6, 1.6], [0, -0.82, 1.5]], 0.035, LEDER, { gs: 0, b: 0.03 });
    if (typ === "gabel") {
      /* Trageösen am Kammdeckel für die Schere (Gabeldeichsel) */
      for (const sx of [-1, 1]) {
        F.strich([[sx * 0.2, 0.12, 1.5], [sx * 0.36, 0.1, 1.2], [sx * 0.41, 0.08, 1.14]], 0.035, LEDER, { gs: sx });
        F.ring([sx * 0.42, 0.08, 1.12], 0.05, 0.02, LEDER, { gs: sx, b: 0.03 });
      }
    }
    if (typ === "kummet") {
      /* Tragriemen vom Kammdeckel zu den Strängen */
      for (const sx of [-1, 1]) F.strich([[sx * 0.2, 0.1, 1.5], [sx * 0.34, 0.02, 1.2], [sx * 0.36, -0.05, 1.08]], 0.03, LEDER, { gs: sx });
    }
  }
  /* Punkt, an dem die Zugstränge am Kummet angreifen (Figurraum) */
  function strangAnsatz(sx) { return kummetPunkt(sx * 1.45, 0.03, 0.02); }
  /* Leinenführung: Ring am Kummet oben */
  function leinenRing(sx) { return kummetPunkt(sx * 0.5, 0.05, 0.05); }
  /* Gebiss (Ringe am Maul) */
  function gebiss(sx) { const gen = [0, 1.13, 1.93], d = nrm([0, 0.6, -0.8]), vorn = nrm([0, 0.8, 0.6]); return add(add(add(gen, mul(d, 0.62 * 0.84)), mul(vorn, -0.03)), [sx * 0.095, 0, 0]); }

  /* ---------- Kutscher: Pferdebahn-Kutscher in dunkelblauer Uniform mit
     Schirmmütze (stehend) oder Fuhrmann in brauner Joppe mit Schiebermütze
     (o.fuhrmann, sitzend auf dem Kutschbock: o.sitzen) ---------- */
  const KUTSCHER = new Map();
  function kutscher(o) {
    o = o || {};
    const schl = (o.fuhrmann ? "f" : "k") + (o.sitzen ? "s" : "");
    if (KUTSCHER.has(schl)) return KUTSCHER.get(schl);
    const rock = o.fuhrmann ? [92, 70, 50] : [36, 42, 66], hose = o.fuhrmann ? [58, 54, 50] : [30, 32, 42];
    const F = ST.figuren.mensch({ h: 1.76, beine: hose, gewand: rock, arme: "krippe", haut: ST.figuren.HAUT[o.fuhrmann ? 2 : 1], haar: [70, 58, 50], knoepfe: o.fuhrmann ? [60, 44, 30] : MESSING, schuhe: [24, 22, 22], neigen: 0 });
    const kz = 1.645 * 1.76 / 1.75, k = 1.76 / 1.75;
    if (o.sitzen) {
      /* sitzend: die stehenden Beine (Rohr + Schuh je Seite) raus, Oberschenkel waagerecht nach vorn, Unterschenkel hinab */
      F.t.splice(0, 4);
      /* die Joppe endet an der Hüfte (die unteren Ringe hingen sonst wie eine Säule über dem Sitz) */
      const rock = F.t.find((t) => t.a === "L");
      if (rock) rock.R = rock.R.slice(2);
      for (const sx of [-1, 1]) {
        const h = [sx * 0.1 * k, 0.0, 0.9 * k], kn = [sx * 0.12 * k, 0.46 * k, 0.9 * k], fu = [sx * 0.12 * k, 0.52 * k, 0.46 * k];
        F.rohr([h, [sx * 0.11 * k, 0.24 * k, 0.9 * k], kn, [sx * 0.12 * k, 0.5 * k, 0.7 * k], fu], [0.085 * k, 0.075 * k, 0.058 * k, 0.05 * k, 0.04 * k], hose, { n: 10 });
        F.ellR([fu[0], fu[1] + 0.05 * k, 0.42 * k], [0, 1, 0], 0.12 * k, 0.052 * k, 0.045 * k, [24, 22, 22], { glanz: 0.3 });
      }
    }
    if (o.fuhrmann) {
      /* Schiebermütze */
      F.ellA([0, 0.01, kz + 0.07 * k], [0.108 * k, 0, 0], [0, 0.118 * k, -0.01], [0, 0.01, 0.045 * k], [84, 78, 70], { b: 0.01 });
      F.ellA([0, 0.1 * k, kz + 0.045 * k], [0.08 * k, 0, 0], [0, 0.045 * k, -0.012 * k], [0, 0.01, 0.03], [74, 68, 62], { flach: true, beidseitig: true, b: 0.03 });
    } else {
      const blau = rock;
      F.zyl([0, 0.008, kz + 0.02 * k], [0, 0.008, kz + 0.085 * k], 0.094 * k, 0.098 * k, blau, { deckel: false, ringe: [{ k: 0.35, b: 0.022 * k, farbe: [20, 22, 30] }] });
      F.ellA([0, 0.0, kz + 0.095 * k], [0.112 * k, 0, 0], [0, 0.118 * k, 0.004], [0, 0, 0.032 * k], blau, { b: 0.01 });
      F.ellA([0, 0.098 * k, kz + 0.03 * k], [0.078 * k, 0, 0], [0, 0.05 * k, -0.012 * k], [0, 0.01, 0.03], [18, 18, 20], { flach: true, beidseitig: true, glanz: 0.8, b: 0.03 });
      F.ellA([0, 0.1 * k, kz + 0.07 * k], [0.018 * k, 0, 0], [0, 0, 0.016 * k], [0, 0.004, 0], MESSING, { flach: true, b: 0.04, ab: 40 });
    }
    KUTSCHER.set(schl, F);
    return F;
  }
  /* Hände des Kutschers mit Armhaltung "krippe" (Figurraum, Höhe 1,76 m) */
  function kutscherHand(sx) { const k = 1.76 / 1.75; return [sx * 0.13 * k, 0.27 * k + 0.03, 1.05 * k]; }

  /* ---------- Hilfen für die Modelle ---------- */
  /* Durchhängender Riemen/Leine zwischen Punkten (Kettenlinie genähert) */
  function haengend(a, b, durch, n) {
    const pts = [];
    n = n || 6;
    for (let i = 0; i <= n; i++) { const t = i / n; const p = add(a, mul(sub(b, a), t)); p[2] -= durch * 4 * t * (1 - t); pts.push(p); }
    return pts;
  }
  /* Unsichtbare Bodenfläche, die den ganzen Schlagschatten ins Sprite
     holt (wie D.schattenRaum, aber für ein längliches Rechteck) */
  function schattenRechteck(M, o, x0, y0, x1, y1, h) {
    if (!o || !o.objekt) return;
    const gier = ((o.objekt.gier || 0) + ((ST.kamera && ST.kamera.dreh) || 0) * 90) * Math.PI / 180;
    const c = Math.cos(gier), sn = Math.sin(gier);
    const mx = (D.SX * c + D.SY * sn) * h, my = (-D.SX * sn + D.SY * c) * h;
    const pts = [];
    for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]) { pts.push([x, y]); pts.push([x + mx, y + my]); }
    const um = D.huelle2(pts);
    M.flaeche({ name: "schattenraum", o: [0, 0, 0], u: [1, 0, 0], v: [0, 1, 0], w: 1, h: 1, umriss: um, malen: null, keinLicht: true, keinAo: true });
  }
  /* Laufbild aus Variante ("schritt2") oder Saat (0…3; sonst stehen) */
  function laufbild(o) {
    const m = /schritt(\d)/.exec((o && o.variante) || "");
    if (m) return +m[1] % 4;
    if (o && /steh/.test(o.variante || "")) return null;
    const s = o && o.saat;
    return s != null && s >= 0 && s < 4 ? s : null;
  }

  /* Zeichnen mit Seitenordnung: Geschirr, das vom Betrachter wegschaut
     (o.gs = Seite ±1 oder eine Normale), VOR dem Körper, das zugewandte
     und das oben liegende (o.gs = 0) DANACH – so liegt der Kummet um den Hals und die Stränge
     laufen außen am Rumpf, aus jedem Winkel. Alles ohne gs wird wie
     üblich nach Tiefe sortiert. pl wie D.figurZeichnen. */
  function zeichnen(g, A, fig, pl) {
    const phi = (pl && pl.phi) || 0, c = Math.cos(phi), sn = Math.sin(phi);
    const fern = new Figur(), mitte = new Figur(), nah = new Figur(), kopf = new Figur();
    for (const t of fig.t) {
      if (t.o && t.o.kopf) { kopf.t.push(t); continue; }
      const gs = t.o && t.o.gs;
      if (gs == null) { mitte.t.push(t); continue; }
      if (gs === 0) { nah.t.push(t); continue; }
      const n = typeof gs === "number" ? [gs, 0, 0] : gs;
      (A.zumAuge([n[0] * c - n[1] * sn, n[0] * sn + n[1] * c, n[2]]) >= 0 ? nah : fern).t.push(t);
    }
    /* Der Kopf liegt vor oder hinter dem Kummet – je nach Blick */
    const T = D.umrechnung((pl && pl.p) || [0, 0, 0], phi, (pl && pl.k) || 1);
    const kopfVorn = A.tief(T.p([0, 1.4, 1.7])) > A.tief(T.p(KM));
    if (!kopfVorn) D.figurZeichnen(g, A, kopf, pl);
    D.figurZeichnen(g, A, fern, pl);
    D.figurZeichnen(g, A, mitte, pl);
    D.figurZeichnen(g, A, nah, pl);
    if (kopfVorn) D.figurZeichnen(g, A, kopf, pl);
  }

  /* Bemalte Fläche, die nur gemalt wird, wenn man sie deutlich von vorn
     sieht: fast von der Kante gesehen verschmiert D.flaeche sonst ihr
     Aufblasen (gegen Haarlinien) zu einem langen Strich. Nur für Figuren,
     die ohne Verschiebung/Drehung gezeichnet werden (Modellraum). */
  function flaeche(F, f) {
    const n = D.v.nrm(f.n || D.v.kreuz(f.u, f.v));
    const m = add(add(f.o, mul(f.u, f.w / 2)), mul(f.v, f.h / 2));
    F.eigen(m, (g, A) => { const k = A.zumAuge(n); if (k > 0.03 || (f.beidseitig && k < -0.03) || (A.silhouette && Math.abs(k) > 0.03)) D.flaeche(g, A, f); }, { b: f.b || 0 });
  }

  ST.pferde = {
    flaeche: flaeche,
    zeichnen: zeichnen,
    version: VERSION, ARTEN: ARTEN, pferd: pferd, kutscher: kutscher, kutscherHand: kutscherHand,
    strangAnsatz: strangAnsatz, leinenRing: leinenRing, gebiss: gebiss, haengend: haengend, schattenRechteck: schattenRechteck, laufbild: laufbild,
    FARBEN: { LEDER: LEDER, LEDER_BRAUN: LEDER_BRAUN, MESSING: MESSING, KUMMET: KUMMET, POLSTER: POLSTER }
  };
})();
/* ===== PFERDEWERKSTATT-ENDE ===== */

/* ===== PFERDEBAHN-MODELL ===== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const D = ST.drechsel, PF = ST.pferde;
  if (!D || !PF) { console.error("pferdebahn.js: Drechselbank oder Pferdewerkstatt fehlt"); return; }
  const Figur = D.Figur;
  const { add, mul } = D.v;
  const TAU = Math.PI * 2;
  const rgb = (c, a) => a == null ? "rgb(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + ")" : "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + a + ")";

  /* ---------------- Maße (Meter, vorn = +y) ---------------- */
  const YW = -1.6;                       // Wagenmitte
  const KB = 0.95, KL = 1.8, PL = 3.1;   // halbe Kastenbreite, halbe Kastenlänge, halbe Länge über die Stirnwände
  const KY0 = YW - KL, KY1 = YW + KL, YF = YW + PL, YR = YW - PL;
  const ZU = 0.62, ZB = 0.8, ZG = 1.58, ZT = 2.6, ZD = 2.92, ZS = 1.9;
  const DB = 1.06, RY0 = YR - 0.08, RY1 = YF + 0.08;   // Dach: halbe Breite, Länge
  const YH = YF + 1.62;                   // Ursprung des Pferdes
  const YO = YF + 0.2, ZO = 0.78;         // Ortscheit
  const ACHSEN = [YW - 1.0, YW + 1.0], RAD_R = 0.34, SPUR = 0.5;

  /* ---------------- Farben (nach dem Foto) ---------------- */
  const ROT = [128, 26, 36], CREME = [232, 218, 176], CREME_D = [204, 188, 146], ZIER = [238, 218, 160], GOLD = [214, 176, 92];
  const MESSING = PF.FARBEN.MESSING, SCHWARZ = [30, 29, 30], HOLZ = [112, 74, 44];

  /* ---------------- Malhilfen (Flächenkoordinaten, Meter) ---------------- */
  function rauschen(g, x, y, w, h, F, k, saat) { if (F.px > 12 && PI) PI.rauschen(g, x, y, w, h, 1.1, k, saat || 3, 3); }
  /* Lackglanz: weicher heller Streifen quer über die Fläche */
  function glanz(g, x, y, w, h, k) {
    const gr = g.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.28, "rgba(255,255,255," + k + ")"); gr.addColorStop(0.55, "rgba(255,255,255,0)");
    gr.addColorStop(0.85, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0," + (k * 0.8) + ")");
    g.fillStyle = gr; g.fillRect(x, y, w, h);
  }
  /* Zierlinie: Rechteck mit nach innen gewölbten Ecken (Kutschenmaler-Art) */
  function zierRahmen(g, x, y, w, h, r, farbe, b) {
    g.beginPath();
    g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.arc(x + w, y, r, Math.PI, Math.PI / 2, true);
    g.lineTo(x + w, y + h - r); g.arc(x + w, y + h, r, -Math.PI / 2, Math.PI, true);
    g.lineTo(x + r, y + h); g.arc(x, y + h, r, 0, -Math.PI / 2, true);
    g.lineTo(x, y + r); g.arc(x, y, r, Math.PI / 2, 0, true);
    g.closePath();
    g.strokeStyle = rgb(farbe); g.lineWidth = b; g.stroke();
  }
  /* Schrift in Metern (Leinwand-Schrift auf 100er-Maßstab, sonst rundet der Browser winzige Größen) */
  function schrift(g, t, x, y, groesse, font, farbe, ausr, schatten) {
    g.save(); g.translate(x, y); g.scale(groesse / 100, groesse / 100);
    g.font = font.replace("#", "100px"); g.textAlign = ausr || "center"; g.textBaseline = "alphabetic";
    if (schatten) { g.fillStyle = schatten; g.fillText(t, 4, 5); }
    g.fillStyle = farbe; g.fillText(t, 0, 0); g.restore();
  }
  /* Fensterumriss mit Rundbogen oben (bogen = Radius) */
  function fensterPfad(g, x, y, w, h, bogen) {
    g.beginPath();
    if (bogen > 0) { g.moveTo(x, y + h); g.lineTo(x, y + bogen); g.arc(x + w / 2, y + bogen, w / 2, Math.PI, 0); g.lineTo(x + w, y + h); }
    else { const r = Math.min(0.05, w * 0.1); g.moveTo(x, y + h); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r); g.lineTo(x + w, y + h); }
    g.closePath();
  }
  /* Fensterglas: oben Himmel gespiegelt, unten der dunkle Innenraum mit
     Rückenlehnen und dem hellen Fenster der Gegenseite; Fahrgäste */
  function glasMalen(g, x, y, w, h, bogen, F, o) {
    g.save();
    fensterPfad(g, x, y, w, h, bogen); g.clip();
    const gr = g.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, "rgb(150,170,186)"); gr.addColorStop(0.35, "rgb(92,98,104)"); gr.addColorStop(1, "rgb(52,46,42)");
    g.fillStyle = gr; g.fillRect(x, y, w, h);
    if (F.px > 10) {
      /* Fenster der Gegenseite (heller) und Sitzbank-Lehne */
      g.fillStyle = "rgba(190,200,196,0.35)"; g.fillRect(x + w * 0.18, y + h * 0.18, w * 0.6, h * 0.5);
      g.fillStyle = "rgba(96,58,40,0.8)"; g.fillRect(x, y + h * 0.82, w, h * 0.18);
      if (o && o.gast && F.px > 16) {
        /* Fahrgast: Kopf und Schultern, gedämpft hinter der Scheibe */
        const gx = x + w * (0.35 + 0.3 * o.gast[0]), gy = y + h * 0.62;
        g.fillStyle = rgb(o.gast[1]); g.beginPath(); g.ellipse(gx, gy + h * 0.28, w * 0.3, h * 0.2, 0, 0, TAU); g.fill();
        g.fillStyle = "rgb(150,112,92)"; g.beginPath(); g.ellipse(gx, gy, w * 0.11, h * 0.085, 0, 0, TAU); g.fill();
        g.fillStyle = rgb(o.gast[2]); g.beginPath(); g.ellipse(gx, gy - h * 0.05, w * 0.12, h * 0.055, 0, Math.PI, TAU); g.fill();
      }
    }
    /* Spiegelung: schräger heller Streifen */
    g.fillStyle = "rgba(255,255,255,0.16)";
    g.beginPath(); g.moveTo(x + w * 0.1, y + h); g.lineTo(x + w * 0.45, y); g.lineTo(x + w * 0.7, y); g.lineTo(x + w * 0.35, y + h); g.fill();
    g.restore();
  }
  function glasLicht(g, x, y, w, h, bogen, F) {
    if (!(F.nacht > 0.05)) return;
    g.save(); fensterPfad(g, x, y, w, h, bogen); g.clip();
    const gr = g.createRadialGradient(x + w / 2, y + h * 0.35, 0, x + w / 2, y + h * 0.4, h * 0.9);
    gr.addColorStop(0, "rgba(255,214,140," + (0.95 * F.nacht) + ")"); gr.addColorStop(1, "rgba(236,150,70," + (0.7 * F.nacht) + ")");
    g.fillStyle = gr; g.fillRect(x, y, w, h); g.restore();
  }
  /* Fensterrahmen: helle Leiste, dunkle Fuge, Schatten der Laibung */
  function rahmen(g, x, y, w, h, bogen, F) {
    const b = 0.035;
    g.save();
    fensterPfad(g, x - b, y - b, w + 2 * b, h + 2 * b, bogen > 0 ? bogen + b : 0);
    g.fillStyle = rgb(PI.hell(CREME, 0.2)); g.fill();
    g.restore();
    if (F.px > 18) {
      g.save(); fensterPfad(g, x - b, y - b, w + 2 * b, h + 2 * b, bogen > 0 ? bogen + b : 0);
      g.strokeStyle = "rgba(60,44,30,0.35)"; g.lineWidth = 0.008; g.stroke(); g.restore();
    }
  }
  function laibung(g, x, y, w, h, bogen, F) {
    const sv = F.schatten(0.05);
    g.save(); fensterPfad(g, x, y, w, h, bogen); g.clip();
    g.fillStyle = "rgba(20,14,10,0.45)";
    if (sv) { g.save(); g.translate(sv[0], sv[1]); g.beginPath(); g.rect(x - 1, y - 1, w + 2, h + 2); fensterPfad(g, x, y, w, h, bogen); g.fill("evenodd"); g.restore(); }
    else { g.lineWidth = 0.03; g.strokeStyle = "rgba(20,14,10,0.3)"; fensterPfad(g, x, y, w, h, bogen); g.stroke(); }
    g.restore();
    /* Sprosse: Kämpfer am Bogenansatz */
    if (bogen > 0) { g.fillStyle = rgb(PI.hell(CREME, 0.15)); g.fillRect(x, y + bogen - 0.012, w, 0.024); }
  }

  /* ---------------- Seitenwand oben (Fenster) ---------------- */
  const FENSTER = (() => { const n = 4, ww = 0.62, st = 0.16, rand = (2 * KL - n * ww - (n - 1) * st) / 2; const l = []; for (let i = 0; i < n; i++) l.push(rand + i * (ww + st)); return { n: n, ww: ww, x: l, y: 0.15, h: 0.78 }; })();
  const GAESTE = [[0.1, [70, 60, 90], [60, 44, 34]], null, [0.7, [120, 50, 44], [180, 170, 160]], [0.3, [60, 80, 70], [40, 34, 30]]];
  function seiteOben(seite) {
    return (g, F) => {
      const w = F.w, h = F.h;
      g.fillStyle = rgb(CREME); g.fillRect(0, 0, w, h);
      rauschen(g, 0, 0, w, h, F, 0.12, 5 + seite);
      /* Dachgesims: dunkle Kante, Schatten des Dachüberstands */
      g.fillStyle = rgb(CREME_D); g.fillRect(0, 0, w, 0.08);
      const sv = F.schatten(0.12);
      if (sv && sv[1] > 0) { const gr = g.createLinearGradient(0, 0, 0, Math.min(0.5, sv[1] + 0.08)); gr.addColorStop(0, "rgba(40,28,16,0.45)"); gr.addColorStop(1, "rgba(40,28,16,0)"); g.fillStyle = gr; g.fillRect(0, 0, w, Math.min(0.5, sv[1] + 0.08)); }
      else { g.fillStyle = "rgba(40,28,16,0.25)"; g.fillRect(0, 0, w, 0.1); }
      for (let i = 0; i < FENSTER.n; i++) {
        const x = FENSTER.x[i], gi = seite > 0 ? i : FENSTER.n - 1 - i;
        rahmen(g, x, FENSTER.y, FENSTER.ww, FENSTER.h, FENSTER.ww / 2, F);
        glasMalen(g, x, FENSTER.y, FENSTER.ww, FENSTER.h, FENSTER.ww / 2, F, { gast: GAESTE[gi] });
        laibung(g, x, FENSTER.y, FENSTER.ww, FENSTER.h, FENSTER.ww / 2, F);
      }
      if (F.px > 22) {
        /* Säulen: feine Kehlen neben den Fenstern */
        g.strokeStyle = "rgba(90,70,40,0.25)"; g.lineWidth = 0.008;
        for (let i = 0; i < FENSTER.n; i++) { const x = FENSTER.x[i]; g.beginPath(); g.moveTo(x - 0.06, 0.12); g.lineTo(x - 0.06, h - 0.05); g.moveTo(x + FENSTER.ww + 0.06, 0.12); g.lineTo(x + FENSTER.ww + 0.06, h - 0.05); g.stroke(); }
      }
      /* Gurtleiste unten */
      g.fillStyle = rgb(PI.hell(CREME, 0.25)); g.fillRect(0, h - 0.05, w, 0.05);
      g.fillStyle = "rgba(50,34,20,0.35)"; g.fillRect(0, h - 0.012, w, 0.012);
    };
  }
  function seiteObenLicht(g, F) { for (let i = 0; i < FENSTER.n; i++) glasLicht(g, FENSTER.x[i], FENSTER.y, FENSTER.ww, FENSTER.h, FENSTER.ww / 2, F); }

  /* ---------------- Seitenwand unten (Lack, Zierlinien, Schrift) ---------------- */
  function seiteUnten(seite) {
    return (g, F) => {
      const w = F.w, h = F.h;
      g.fillStyle = rgb(ROT); g.fillRect(0, 0, w, h);
      rauschen(g, 0, 0, w, h, F, 0.1, 9 + seite);
      glanz(g, 0, 0, w, h, 0.14);
      const b = Math.max(0.012, 1.2 / F.px);
      zierRahmen(g, 0.1, 0.09, w - 0.2, h - 0.2, 0.06, ZIER, b);
      if (F.px > 8) {
        g.strokeStyle = rgb(ZIER); g.lineWidth = b;
        g.beginPath(); g.moveTo(0.16, h * 0.44); g.lineTo(w - 0.16, h * 0.44); g.stroke();
        /* Stadtwappen (vereinfacht): goldener Schild mit rotem Feld */
        const wx = w / 2, wy = h * 0.25;
        g.fillStyle = rgb(GOLD);
        g.beginPath(); g.moveTo(wx - 0.1, wy - 0.12); g.lineTo(wx + 0.1, wy - 0.12); g.lineTo(wx + 0.1, wy + 0.02); g.quadraticCurveTo(wx + 0.1, wy + 0.11, wx, wy + 0.14); g.quadraticCurveTo(wx - 0.1, wy + 0.11, wx - 0.1, wy + 0.02); g.closePath(); g.fill();
        if (F.px > 30) {
          g.fillStyle = "rgb(150,40,40)"; g.fillRect(wx - 0.07, wy - 0.09, 0.14, 0.09);
          g.fillStyle = "rgb(240,236,226)"; g.fillRect(wx - 0.02, wy - 0.085, 0.04, 0.08);
        }
      }
      if (F.px > 14) schrift(g, "Döbelner Straßenbahn", w / 2, h * 0.73, 0.17, "italic 700 # Georgia, 'Times New Roman', serif", rgb(ZIER), "center", "rgba(40,10,10,0.55)");
      else { g.fillStyle = rgb(ZIER, 0.5); g.fillRect(w * 0.25, h * 0.66, w * 0.5, 0.05); }
      /* Kante unten: Schatten zum Rahmen */
      g.fillStyle = "rgba(0,0,0,0.3)"; g.fillRect(0, h - 0.03, w, 0.03);
    };
  }

  /* ---------------- Stirnwand des Kastens (zur Plattform) ---------------- */
  const TUER = { x: 0.64, w: 0.62, y: ZT - 2.28 }, SF = [[0.12, 0.44], [1.34, 0.44]];
  function stirnKasten(vorn) {
    return (g, F) => {
      const w = F.w, h = F.h, gurt = ZT - ZG;
      g.fillStyle = rgb(CREME); g.fillRect(0, 0, w, gurt);
      g.fillStyle = rgb(ROT); g.fillRect(0, gurt, w, h - gurt);
      rauschen(g, 0, 0, w, h, F, 0.1, vorn ? 21 : 22);
      glanz(g, 0, gurt, w, h - gurt, 0.1);
      g.fillStyle = rgb(CREME_D); g.fillRect(0, 0, w, 0.08);
      g.fillStyle = "rgba(40,28,16,0.35)"; g.fillRect(0, 0.08, w, 0.06);
      /* Seitenfenster */
      for (const [x, fw] of SF) { rahmen(g, x, 0.2, fw, 0.76, 0, F); glasMalen(g, x, 0.2, fw, 0.76, 0, F, null); laibung(g, x, 0.2, fw, 0.76, 0, F); }
      /* Tür mit Fenster oben, unten Füllung */
      const tx = TUER.x, ty = TUER.y, tw = TUER.w, th = ZT - ZB - ty;
      g.fillStyle = rgb(PI.hell(CREME, 0.1)); g.fillRect(tx - 0.04, ty - 0.04, tw + 0.08, th + 0.04);
      g.fillStyle = rgb(ROT); g.fillRect(tx, ty + 0.72, tw, th - 0.72);
      if (F.px > 10) zierRahmen(g, tx + 0.07, ty + 0.8, tw - 0.14, th - 0.9, 0.03, ZIER, Math.max(0.008, 1 / F.px));
      glasMalen(g, tx + 0.05, ty + 0.05, tw - 0.1, 0.62, 0, F, null);
      laibung(g, tx + 0.05, ty + 0.05, tw - 0.1, 0.62, 0, F);
      if (F.px > 16) { g.fillStyle = rgb(MESSING); g.fillRect(tx + tw - 0.08, ty + 0.95, 0.03, 0.12); }
      /* Tafel über der Tür */
      g.fillStyle = "rgb(58,44,32)"; g.fillRect(tx - 0.02, 0.12, tw + 0.04, 0.14);
      if (F.px > 70) {
        schrift(g, "Die Absicht zum Aussteigen gebe man dem", tx + tw / 2, 0.18, 0.034, "700 # Georgia, serif", "rgb(236,222,190)");
        schrift(g, "Führer durch Ziehen am Glockenriemen kund.", tx + tw / 2, 0.235, 0.034, "700 # Georgia, serif", "rgb(236,222,190)");
      } else if (F.px > 20) {
        g.fillStyle = "rgba(236,222,190,0.55)"; g.fillRect(tx + 0.04, 0.16, tw - 0.08, 0.02); g.fillRect(tx + 0.06, 0.21, tw - 0.12, 0.02);
      }
      /* Gurtleiste */
      g.fillStyle = rgb(PI.hell(CREME, 0.25)); g.fillRect(0, gurt - 0.04, tx - 0.04, 0.05); g.fillRect(tx + tw + 0.04, gurt - 0.04, w - tx - tw - 0.04, 0.05);
      /* Boden der Plattform: unter der Tür dunkel */
      g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(0, ZT - ZB, w, h);
    };
  }
  function stirnKastenLicht(g, F) {
    for (const [x, fw] of SF) glasLicht(g, x, 0.2, fw, 0.76, 0, F);
    glasLicht(g, TUER.x + 0.05, TUER.y + 0.05, TUER.w - 0.1, 0.62, 0, F);
  }

  /* ---------------- Plattform-Stirnwand (Grundriss vorn, gegen den Uhrzeigersinn von links) ---------------- */
  const STIRN = [[-0.95, -0.58], [-0.945, -0.3], [-0.88, -0.13], [-0.7, -0.02], [-0.45, 0], [0.45, 0], [0.7, -0.02], [0.88, -0.13], [0.945, -0.3], [0.95, -0.58]];
  const STIRN_S = (() => { const s = [0]; for (let i = 1; i < STIRN.length; i++) s.push(s[i - 1] + Math.hypot(STIRN[i][0] - STIRN[i - 1][0], STIRN[i][1] - STIRN[i - 1][1])); return s; })();
  const STIRN_L = STIRN_S[STIRN_S.length - 1];
  /* Punkt der Stirnwand im Modell: vorn (sg = 1) oder hinten (sg = −1, um 180° gedreht) */
  const stirnP = (p, sg, z) => sg > 0 ? [p[0], YF + p[1], z] : [-p[0], YR - p[1], z];
  function stirnAussen(sg) {
    return (s0) => (g, F) => {
      const h = F.h;
      g.save(); g.translate(-s0, 0);
      g.fillStyle = rgb(ROT); g.fillRect(s0 - 0.1, -0.1, F.w + 0.2, h + 0.2);
      rauschen(g, s0, 0, F.w, h, F, 0.1, sg > 0 ? 31 : 32);
      glanz(g, s0, 0, F.w, h, 0.16);
      const b = Math.max(0.012, 1.2 / F.px);
      zierRahmen(g, 0.16, 0.12, STIRN_L - 0.32, h - 0.3, 0.07, ZIER, b);
      if (F.px > 5) schrift(g, "1", STIRN_L / 2, h * 0.66, 0.62, "700 # Georgia, 'Times New Roman', serif", rgb(ZIER), "center", "rgba(40,8,8,0.5)");
      g.fillStyle = "rgba(0,0,0,0.28)"; g.fillRect(s0 - 0.1, h - 0.04, F.w + 0.2, 0.04);
      g.restore();
    };
  }
  function stirnInnen(g, F) {
    g.fillStyle = rgb(PI.misch(ROT, [40, 20, 16], 0.35)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
    g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(-0.1, F.h - (ZB - ZU) - 0.02, F.w + 0.2, 1);
  }

  /* ---------------- Dach (gewölbt, über die ganze Länge) ---------------- */
  const DACH = (() => {
    const sag = ZD - ZT, R = (DB * DB + sag * sag) / (2 * sag), zc = ZD - R, p0 = Math.asin(DB / R), n = 8, pts = [];
    for (let i = 0; i <= n; i++) { const p = -p0 + 2 * p0 * i / n; pts.push([R * Math.sin(p), zc + R * Math.cos(p)]); }
    return pts;
  })();
  function dachMalen(winter, i) {
    return (g, F) => {
      const w = F.w, h = F.h;
      g.fillStyle = "rgb(222,212,184)"; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
      rauschen(g, 0, 0, w, h, F, 0.18, 40 + i);
      if (F.px > 10) {
        /* Dachleinwand mit Nähten quer und Spriegeln */
        g.strokeStyle = "rgba(120,110,90,0.35)"; g.lineWidth = Math.max(0.01, 0.8 / F.px);
        for (let y = 0.4; y < w; y += 0.8) { g.beginPath(); g.moveTo(y, 0); g.lineTo(y, h); g.stroke(); }
      }
      if (winter) {
        g.fillStyle = "rgb(240,244,250)"; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
        if (PI && F.px > 8) PI.rauschen(g, 0, 0, w, h, 1.6, 0.12, 55 + i, 3);
        if (i === 0 || i === DACH.length - 2) { g.fillStyle = "rgba(210,222,236,0.6)"; g.fillRect(0, i === 0 ? 0 : h - 0.05, w, 0.05); }
      }
    };
  }
  function dachStirn(winter) {
    return (g, F) => {
      g.fillStyle = rgb(CREME); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      rauschen(g, 0, 0, F.w, F.h, F, 0.12, 61);
      /* dunkle Dachkante oben entlang des Bogens, feine Leiste unten */
      g.strokeStyle = winter ? "rgb(236,240,246)" : "rgb(84,80,74)"; g.lineWidth = winter ? 0.07 : 0.035;
      g.beginPath(); DACH.forEach(([x, z], i) => { const X = x + DB, Y = ZD - z; if (i) g.lineTo(X, Y); else g.moveTo(X, Y); }); g.stroke();
      g.fillStyle = "rgba(60,44,28,0.4)"; g.fillRect(0, F.h - 0.02, F.w, 0.02);
    };
  }

  /* =====================================================================
     DIE TEILE — jede Gruppe eine Figur (Modellraum)
     ===================================================================== */
  function flaecheQ(F, name, o, u, v, w, h, malen, x) { PF.flaeche(F, Object.assign({ name: name, o: o, u: u, v: v, w: w, h: h, malen: malen }, x || {})); }

  /* Scheibenrad: blanker Radreifen, dunkle Radscheibe mit Speichenrippen */
  function radMalen(g, F) {
    const r = F.w / 2;
    g.fillStyle = "rgb(120,118,114)"; g.beginPath(); g.arc(r, r, r, 0, TAU); g.fill();
    const gr = g.createRadialGradient(r * 0.85, r * 0.8, 0, r, r, r * 0.86);
    gr.addColorStop(0, "rgb(74,68,64)"); gr.addColorStop(1, "rgb(40,37,36)");
    g.fillStyle = gr; g.beginPath(); g.arc(r, r, r * 0.86, 0, TAU); g.fill();
    if (F.px > 14) {
      g.strokeStyle = "rgba(110,104,98,0.7)"; g.lineWidth = r * 0.07;
      for (let i = 0; i < 8; i++) { const w = i / 8 * TAU; g.beginPath(); g.moveTo(r + Math.cos(w) * r * 0.22, r + Math.sin(w) * r * 0.22); g.lineTo(r + Math.cos(w) * r * 0.8, r + Math.sin(w) * r * 0.8); g.stroke(); }
      g.strokeStyle = "rgba(20,18,18,0.6)"; g.lineWidth = r * 0.03; g.beginPath(); g.arc(r, r, r * 0.86, 0, TAU); g.stroke();
    }
  }
  function fahrwerk() {
    const F = new Figur();
    /* Rahmen: zwei Längsträger */
    for (const sx of [-1, 1]) {
      const x = sx * 0.66;
      F.poly([[x, YR + 0.3, 0.7], [x, YF - 0.3, 0.7], [x, YF - 0.3, 0.5], [x, YR + 0.3, 0.5]], SCHWARZ, { beidseitig: true });
    }
    for (const ya of ACHSEN) {
      for (const sx of [-1, 1]) {
        const x0 = sx * (SPUR - 0.03), x1 = sx * (SPUR + 0.07);
        /* Rad: Scheibe mit Spurkranz, Nabe */
        F.zyl([x0, ya, RAD_R], [x1, ya, RAD_R], RAD_R, RAD_R, [84, 82, 80], { deckel: false, glanz: 0.4 });
        const um = []; for (let i = 0; i < 28; i++) { const w = i / 28 * TAU; um.push([RAD_R + Math.cos(w) * RAD_R, RAD_R + Math.sin(w) * RAD_R]); }
        PF.flaeche(F, { name: "rad", o: [x1, ya + sx * RAD_R, 2 * RAD_R], u: [0, -sx, 0], v: [0, 0, -1], w: 2 * RAD_R, h: 2 * RAD_R, umriss: um, malen: radMalen, b: 0.005 });
        F.zyl([x1, ya, RAD_R], [x1 + sx * 0.04, ya, RAD_R], 0.075, 0.06, [70, 66, 62], { deckel: [110, 104, 96], glanz: 0.5, b: 0.01 });
        /* Achslager am Rahmen */
        F.zyl([sx * 0.62, ya, RAD_R + 0.05], [sx * 0.7, ya, RAD_R + 0.05], 0.1, 0.1, SCHWARZ, { deckel: [40, 38, 38], b: 0.02 });
      }
      F.zyl([-SPUR, ya, RAD_R], [SPUR, ya, RAD_R], 0.04, 0.04, [40, 38, 38], { deckel: false, b: -0.1 });
    }
    /* Kupplung vorn und hinten */
    F.zyl([0, YF - 0.05, 0.62], [0, YF + 0.16, 0.62], 0.035, 0.035, SCHWARZ, { deckel: [60, 58, 56] });
    F.zyl([0, YR + 0.05, 0.62], [0, YR - 0.16, 0.62], 0.035, 0.035, SCHWARZ, { deckel: [60, 58, 56] });
    return F;
  }

  function kasten(winter) {
    const F = new Figur();
    const hO = ZT - ZG, vU = [-(KB - 0.9) , 0, -(ZG - ZU)], hU = Math.hypot(vU[0], vU[2]);
    /* Ost (+x) und West (−x): oben senkrecht, unten leicht eingezogen */
    flaecheQ(F, "ostO", [KB, KY1, ZT], [0, -1, 0], [0, 0, -1], 2 * KL, hO, seiteOben(1), { danach: seiteObenLicht });
    flaecheQ(F, "westO", [-KB, KY0, ZT], [0, 1, 0], [0, 0, -1], 2 * KL, hO, seiteOben(-1), { danach: seiteObenLicht });
    flaecheQ(F, "ostU", [KB, KY1, ZG], [0, -1, 0], [vU[0] / hU, 0, vU[2] / hU], 2 * KL, hU, seiteUnten(1));
    flaecheQ(F, "westU", [-KB, KY0, ZG], [0, 1, 0], [-vU[0] / hU, 0, vU[2] / hU], 2 * KL, hU, seiteUnten(-1));
    const um = [[0, 0], [2 * KB, 0], [2 * KB, hO], [2 * KB - 0.05, ZT - ZU], [0.05, ZT - ZU], [0, hO]];
    flaecheQ(F, "stirnV", [-KB, KY1, ZT], [1, 0, 0], [0, 0, -1], 2 * KB, ZT - ZU, stirnKasten(true), { umriss: um, danach: stirnKastenLicht });
    flaecheQ(F, "stirnH", [KB, KY0, ZT], [-1, 0, 0], [0, 0, -1], 2 * KB, ZT - ZU, stirnKasten(false), { umriss: um, danach: stirnKastenLicht });
    void winter;
    return F;
  }

  /* Plattform (sg = 1 vorn, −1 hinten): Boden, Stirnwand außen/innen,
     Handlauf, Stangen, Trittstufen; vorn Kutscher, Bremskurbel, Glocke */
  function plattform(sg) {
    const P = (p, z) => stirnP(p, sg, z);
    const yK = sg > 0 ? KY1 : KY0;
    const boden = new Figur(), innen = new Figur(), aussen = new Figur(), mitte = new Figur();
    /* Boden */
    const bp = [P([-0.95, KY1 - YF], ZB), P([0.95, KY1 - YF], ZB)].concat(STIRN.slice().reverse().map((p) => P(p, ZB)));
    boden.poly(bp, [88, 70, 54], { beidseitig: true });
    /* Seitenleisten unter den Einstiegen und Trittstufen */
    for (const sx of [-1, 1]) {
      const a = P([sx * 0.95, KY1 - YF], 0), b = P([sx * 0.95, -0.58], 0);
      boden.poly([[a[0], a[1], ZB], [b[0], b[1], ZB], [b[0], b[1], ZU], [a[0], a[1], ZU]], SCHWARZ, { beidseitig: true });
      const x0 = a[0], x1 = a[0] + (a[0] > 0 ? 0.16 : -0.16), y0 = a[1] + (b[1] - a[1]) * 0.06, y1 = a[1] + (b[1] - a[1]) * 0.94;
      boden.poly([[x0, y0, 0.44], [x1, y0, 0.44], [x1, y1, 0.44], [x0, y1, 0.44]], [70, 58, 48], { beidseitig: true });
      boden.poly([[x1, y0, 0.44], [x1, y1, 0.44], [x1, y1, 0.39], [x1, y0, 0.39]], SCHWARZ, { beidseitig: true });
      for (const yy of [y0, y1]) boden.strich([[x0 + (x1 - x0) * 0.5, yy, 0.44], [x0, yy, ZU]], 0.025, SCHWARZ);
    }
    /* Stirnwand: Facetten außen (bemalt, durchgehend abgewickelt) und innen */
    const maler = stirnAussen(sg);
    for (let i = 0; i < STIRN.length - 1; i++) {
      const a = P(STIRN[i], ZS), b = P(STIRN[i + 1], ZS);
      const w = STIRN_S[i + 1] - STIRN_S[i], u = [(b[0] - a[0]) / w, (b[1] - a[1]) / w, 0];
      PF.flaeche(aussen, { name: "stirn" + sg + "_" + i, o: a, u: u, v: [0, 0, -1], w: w, h: ZS - ZU, malen: maler(STIRN_S[i]), saat: 3 });
      PF.flaeche(innen, { name: "stirnI" + sg + "_" + i, o: b, u: [-u[0], -u[1], 0], v: [0, 0, -1], w: w, h: ZS - ZU, malen: stirnInnen });
    }
    /* Handlauf oben auf der Stirnwand */
    const hl = STIRN.map((p) => P(p, ZS + 0.02));
    for (let i = 0; i < hl.length - 1; i++) aussen.kap(hl[i], hl[i + 1], 0.035, 0.035, HOLZ, { glanz: 0.4, b: 0.01 });
    /* Messingstangen: an den Ecken der Stirnwand bis zum Dach, am Kasten Griffstangen */
    for (const sx of [-1, 1]) {
      const e = P([sx * 0.93, -0.36], 0);
      mitte.zyl([e[0], e[1], ZS + 0.02], [e[0], e[1], ZT - 0.04], 0.022, 0.022, MESSING, { glanz: 0.7, deckel: false });
      const k = [sx * (KB - 0.03), yK + sg * 0.05];
      mitte.zyl([k[0], k[1], 1.05], [k[0], k[1], 2.25], 0.016, 0.016, MESSING, { glanz: 0.7, deckel: false });
      mitte.strich([[k[0], k[1], 1.05], [k[0], k[1] - sg * 0.05, 1.05]], 0.02, MESSING, {});
      mitte.strich([[k[0], k[1], 2.25], [k[0], k[1] - sg * 0.05, 2.25]], 0.02, MESSING, {});
    }
    if (sg > 0) {
      /* Bremskurbel: senkrechte Spindel mit Kurbel oben */
      const bx = 0.6, by = YF - 0.14;
      mitte.zyl([bx, by, ZB], [bx, by, ZS + 0.1], 0.022, 0.022, SCHWARZ, { deckel: [60, 58, 56] });
      mitte.zyl([bx, by, ZS + 0.1], [bx - 0.18, by - 0.05, ZS + 0.12], 0.016, 0.016, SCHWARZ, { deckel: false });
      mitte.kap([bx - 0.18, by - 0.05, ZS + 0.12], [bx - 0.18, by - 0.05, ZS + 0.24], 0.022, 0.022, HOLZ, {});
      /* Glocke unter dem Dach an der Stirnwand des Kastens */
      mitte.zyl([-0.55, yK + 0.06, 2.5], [-0.55, yK + 0.06, 2.42], 0.02, 0.055, MESSING, { glanz: 0.9, deckel: [120, 96, 50] });
      mitte.strich([[-0.55, yK + 0.02, 2.56], [-0.55, yK + 0.06, 2.5]], 0.012, SCHWARZ, {});
      /* Laterne auf der Stirnwand rechts */
      const lp = P([0.62, -0.03], ZS + 0.04);
      mitte.zyl(lp, add(lp, [0, 0, 0.2]), 0.07, 0.07, [36, 36, 38], { deckel: [30, 30, 32] });
      mitte.birne(add(lp, [0, 0.07, 0.1]), 0.045, "255,210,130", {});
      /* Kutscher auf der vorderen Plattform */
      mitte.dazu(PF.kutscher(), [0.18, KUTSCHER_Y, ZB], 0, 1);
    }
    return { boden: boden, innen: innen, aussen: aussen, mitte: mitte };
  }
  const KUTSCHER_Y = YF - 0.62;

  function dach(winter) {
    const F = new Figur();
    for (let i = 0; i < DACH.length - 1; i++) {
      const [xa, za] = DACH[i], [xb, zb] = DACH[i + 1], l = Math.hypot(xb - xa, zb - za);
      PF.flaeche(F, { name: "dach" + i, o: [xa, RY1, za], u: [0, -1, 0], v: [(xb - xa) / l, 0, (zb - za) / l], w: RY1 - RY0, h: l, malen: dachMalen(winter, i), auf: 0.8 });
    }
    const hS = ZD - (ZT - 0.1);
    const um = DACH.map(([x, z]) => [x + DB, ZD - z]).concat([[2 * DB, hS], [0, hS]]);
    PF.flaeche(F, { name: "dachV", o: [-DB, RY1, ZD], u: [1, 0, 0], v: [0, 0, -1], w: 2 * DB, h: hS, umriss: um, malen: dachStirn(winter) });
    PF.flaeche(F, { name: "dachH", o: [DB, RY0, ZD], u: [-1, 0, 0], v: [0, 0, -1], w: 2 * DB, h: hS, umriss: um, malen: dachStirn(winter) });
    const leiste = (g, Fl) => { g.fillStyle = rgb(CREME_D); g.fillRect(-0.1, -0.1, Fl.w + 0.2, Fl.h + 0.2); g.fillStyle = "rgba(60,50,40,0.45)"; g.fillRect(-0.1, Fl.h - 0.02, Fl.w + 0.2, 0.03); };
    PF.flaeche(F, { name: "traufeO", o: [DB, RY1, ZT], u: [0, -1, 0], v: [0, 0, -1], w: RY1 - RY0, h: 0.1, malen: leiste });
    PF.flaeche(F, { name: "traufeW", o: [-DB, RY0, ZT], u: [0, 1, 0], v: [0, 0, -1], w: RY1 - RY0, h: 0.1, malen: leiste });
    return F;
  }

  /* Pferd, Zugstränge, Ortscheit, Leinen (Modellraum) */
  function gespannPferd(schritt) {
    const F = new Figur();
    F.dazu(PF.pferd({ art: "dunkelbraun", schritt: schritt, geschirr: "kummet" }), [0, YH, 0], 0, 1);
    const inM = (p) => [p[0], p[1] + YH, p[2]];
    /* Ortscheit (Holzbalken quer) mit Kette zur Kupplung */
    F.kap([-0.42, YO, ZO], [0.42, YO, ZO], 0.035, 0.035, HOLZ, { glanz: 0.3 });
    F.strich([[0, YF + 0.16, 0.62], [0, YO - 0.02, ZO - 0.02]], 0.02, [120, 120, 126], {});
    for (const sx of [-1, 1]) {
      /* Zugstrang: vom Kummet am Rumpf entlang zum Ortscheit */
      const a = inM(PF.strangAnsatz(sx)), m = [sx * 0.37, YH - 0.05, 1.06], e = [sx * 0.4, YO, ZO];
      F.strich([a, [sx * 0.36, (a[1] + m[1]) / 2, (a[2] + m[2]) / 2], m, [sx * 0.39, (m[1] + e[1]) / 2, (m[2] + e[2]) / 2 - 0.02], e], 0.04, PF.FARBEN.LEDER_BRAUN, { gs: sx });
      /* Leinen: vom Gebiss durch den Ring am Kummet zur Hand des Kutschers */
      const gb = inM(PF.gebiss(sx)), ri = inM(PF.leinenRing(sx));
      const kh = PF.kutscherHand(sx), hand = [0.18 + kh[0], KUTSCHER_Y + kh[1], ZB + kh[2]];
      F.strich([gb, [gb[0] + sx * 0.02, gb[1] - 0.25, gb[2] - 0.12], ri], 0.018, PF.FARBEN.LEDER_BRAUN, { gs: sx });
      F.strich(PF.haengend(ri, hand, 0.18, 8), 0.018, PF.FARBEN.LEDER_BRAUN, { gs: sx });
    }
    return F;
  }

  /* ---------------- Zusammensetzen und Zeichnen ---------------- */
  const TEILE = new Map();
  function teile(winter, schritt) {
    const k = (winter ? "w" : "s") + "|" + schritt;
    if (TEILE.has(k)) return TEILE.get(k);
    const T = { fahrwerk: fahrwerk(), kasten: kasten(winter), vorn: plattform(1), hinten: plattform(-1), dach: dach(winter), pferd: gespannPferd(schritt) };
    TEILE.set(k, T);
    return T;
  }
  function allesMalen(g, A, T) {
    const vy = A.zumAuge([0, 1, 0]);
    const z = (f, pl) => D.figurZeichnen(g, A, f, pl || {});
    const pferd = () => PF.zeichnen(g, A, T.pferd, {});
    /* Plattform: vom Wagen aus gesehen (innen) oder von außen */
    const platt = (P, sg) => {
      const von = sg * vy >= 0;       // Betrachter vor der Stirnwand
      z(P.boden);
      if (von) { z(P.innen); z(P.mitte, { sk: 0.55 }); z(P.aussen); }
      else { z(P.aussen); z(P.innen); z(P.mitte, { sk: 0.55 }); }
    };
    if (vy >= 0) {
      z(T.fahrwerk); platt(T.hinten, -1); z(T.kasten); platt(T.vorn, 1); z(T.dach); pferd();
    } else {
      pferd(); z(T.fahrwerk); platt(T.vorn, 1); z(T.kasten); platt(T.hinten, -1); z(T.dach);
    }
  }

  const GRUND = [2.3, 9.6], HOEHE = 3.0;
  ST.modell("pferdebahn", {
    name: "Pferdebahn", gruppe: "Fahrzeuge", grund: GRUND, hoehe: HOEHE, bauzeit: 60,
    bauen(M, o) {
      const winter = o.jahr === "winter";
      const schritt = PF.laufbild(o);
      const zustand = { gier: 0 };
      M.teil("gespann", { mitte: [0, 0, 1.4] });
      M.figur({
        x: 0, y: 0, z: 0, breite: 0.1, hoehe: 0.1, schatten: true,
        malen(g, s, F) {
          if (!F.schatten) zustand.gier = F.gier || 0;
          const gier = F.gier != null ? F.gier : zustand.gier;
          const A = new D.Ansicht({ s: s, gier: gier, Z: F.Z, jahr: F.jahr, schatten: !!F.schatten });
          const T = teile(winter, schritt);
          if (F.schatten) { D.schattenPuffer(g, (h) => allesMalen(h, A, T)); return; }
          D.weichMalen(g, (g2) => allesMalen(g2, A, T));
          /* Nachts: Schein der Laterne und der Fenster */
          if (A.nacht > 0.05 && F.leuchtPunkt) {
            const lp = A.bild(stirnP([0.62, -0.03], 1, ZS + 0.14));
            F.leuchtPunkt(lp[0], lp[1], s * 1.4, "255,200,120", 0.9, true);
            const mp = A.bild([0, YW, 2.0]);
            F.leuchtPunkt(mp[0], mp[1], s * 2.6, "255,190,110", 0.45, false);
          }
        }
      });
      /* unsichtbare Hülle: Größe des Sprites */
      M.teil("huelle", { schatten: false, mitte: [0, 0, -50] });
      const leer = { malen: null, keinLicht: true, keinAo: true };
      M.flaeche(Object.assign({ name: "h0", o: [-1.15, -4.8, 0], u: [1, 0, 0], v: [0, 1, 0], w: 2.3, h: 9.6 }, leer));
      M.flaeche(Object.assign({ name: "h1", o: [-1.15, -4.8, HOEHE], u: [1, 0, 0], v: [0, 1, 0], w: 2.3, h: 9.6 }, leer));
      PF.schattenRechteck(M, o, -1.15, -4.8, 1.15, 4.8, HOEHE);
      /* Kontaktschatten unter dem Wagen */
      M.teil("fuss", { schatten: true, mitte: [0, YW, -40] });
      M.flaeche(Object.assign({ name: "fuss", o: [-0.9, YR + 0.2, 0.01], u: [1, 0, 0], v: [0, 1, 0], w: 1.8, h: 2 * PL - 0.4 }, leer));
    }
  });
})();
