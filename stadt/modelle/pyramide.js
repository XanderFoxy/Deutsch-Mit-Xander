/* =====================================================================
   ERZGEBIRGISCHE WEIHNACHTSPYRAMIDE (begehbar, mit Glühweinausschank)
   ---------------------------------------------------------------------
   XANDER: „filigran und detailreich perfekt nach ihrem Vorbild" ·
   „Ich möchte einen Liebreiz zur Weihnachtsdeko … mit Schmücken, mit
   Schnee" · „Das soll keine Comic Grafik sein. Das soll noch viel mehr
   am Realismus dran sein." · „ohne Pixelkanten und komische
   Vektorrückstände" · „Man soll sie in jedem Winkel aufstellen können.
   Man soll das Fundament sehen beim Aufbauen." · „trotzdem mit SVG
   Grafiken" (also alles gezeichnet, keine Bilddateien).

   VORBILD: die großen Marktpyramiden im Erzgebirge (Annaberg, Seiffen,
   Dresden): unten ein achteckiger Ausschank mit Tresen, darüber vier
   Stockwerke mit gedrechselten Säulen, auf jedem Teller geschnitzte
   Figuren, oben das Flügelrad, das sich vom Kerzenrauch getrieben dreht.
   Hier (etwa 12,6 m hoch):
     • Erdgeschoss: Holzpodest, Tresen mit Kreidetafel, Rückwand mit
       Regalen, Glühweintöpfe, Tassentürme, vier Verkäufer, Blende mit
       Schriftzug, Schindeldach mit Schnee und Eiszapfen, Tannengirlande.
     • 1. Stock: Christi Geburt – Stall mit Stern, Krippe, Maria, Josef,
       Ochs und Esel, Hirte, Schafe, die Heiligen Drei Könige.
     • 2. Stock: Hirten mit ihren Schafen.  3. Stock: Bergleute mit
       Grubenlampen (Bergmannsparade).  4. Stock: Engel mit Kerzen.
     • Oben die Krone mit dem großen Flügelrad (dreht sich, M.lebendig);
       die Teller mit den Figuren drehen sich mit.
     • Auf jedem Rahmen eine Lichterkette, an jeder Säule eine Kerze;
       nachts glüht die ganze Pyramide warm.

   FRÜHLING — Entscheidung: dieselbe Pyramide ohne Schnee als
   Osterpyramide statt eines Osterbrunnens. Begründung: Osterpyramiden
   gibt es im Erzgebirge wirklich (gleiche Bauart, im Frühjahr mit
   Buchsbaum und Ostereiern geschmückt); ein Bauwerk, das je nach
   Jahreszeit sein Gesicht wechselt, bleibt in der Stadt an seinem Platz
   und wird nicht plötzlich zu etwas völlig anderem. Im Frühling: kein
   Schnee und keine Eiszapfen, Buchsgirlande mit bunten Eiern, andere
   Figuren (Hirten mit Lämmern, Bergleute, Engel), am Tresen „Kaffee &
   Kuchen" statt Glühwein.

   WAS SICH DREHT (M.lebendig): Teller, Figuren, Kerzen und die Säulen
   vor den Figuren werden jedes Bild gemalt – die Figuren aus dem
   Figurenspeicher der Drechselbank (je Drehstufe einmal gerechnet),
   die Säulen als fertige Bildchen. Das nächsthöhere Stockwerk wird mit
   einem Ausschnitt ausgespart; das ist exakt, weil in dieser Kamera von
   zwei Punkten auf demselben Bildpunkt immer der höhere näher am Auge
   liegt. In Vorschaubildern (ohne Objekt) steht alles still im Sprite.

   AUFBAU (o.bau): Baugrube unter Gelände → Betonfundament mit
   Schalungsspuren → Podest → Ausschank Schicht für Schicht → offener
   Dachstuhl → Schindeln → Stockwerke von unten nach oben → Figuren →
   Flügelrad → Lichter. Gerüst, Kran und Arbeiter kommen aus
   stadt/baustelle.js.
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

/* =====================================================================
   DIE PYRAMIDE — Aufbau
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, D = ST.drechsel, FW = ST.figuren, PI = ST.pinsel;
  const { add, sub, mul, dot, nrm, mix } = D.v;
  const TAU = Math.PI * 2, E = ST.ZUM_AUGE;
  const rgbS = D.rgbS;
  const klemm = (x, a, b) => (x < a ? a : x > b ? b : x);
  /* Rauschen mit nur zwei gemeinsamen Mustern (jedes neue Muster kostet
     beim ersten Mal viel Rechenzeit) – Abwechslung durch Verschieben */
  function rausch(g, x, y, w, h, meter, st, v, okt) {
    const dx = ((v || 0) * 0.37) % meter, dy = ((v || 0) * 0.61) % meter;
    g.save(); g.translate(dx, dy);
    PI.rauschen(g, x - dx, y - dy, w, h, meter, st, okt === 3 ? 31 : 21, okt === 3 ? 3 : 4);
    g.restore();
  }

  /* ---------------- Maße (Meter, Mitte = 0,0,0) ---------------- */
  const DECK_R = 4.45, DECK_H = 0.18;                        // Holzpodest
  const THEKE_R = 3.3, THEKE_Z = 1.06;                       // Tresen (Außenseite)
  const PLATTE_R = 3.54, PLATTE_IN = 3.16, PLATTE_Z = 1.12;  // Tresenplatte
  const INNEN_R = 2.3;                                       // Rückwand mit Regalen
  const OFFEN_Z = 2.3;                                       // Oberkante Ausgabe
  const BLENDE_R = 3.44, BLENDE_Z = 2.76;                    // Schild
  const TRAUFE_R = 3.62, TRAUFE_Z = 2.8, FIRST_R = 2.96, FIRST_Z = 3.26;
  const RH = 0.2;                                            // Rahmenhöhe je Stockwerk
  /* Stockwerke: z = Unterkante Rahmen, R = Umkreis des Achteckrahmens,
     c = Säulenkreis, p = Drehteller, fig = Figurenhöhe */
  /* Fünf Figurenetagen (Auftrag: „5 Etagen mit gedrechselten Säulen"),
     darüber der Kronenrahmen mit dem Flügelrad; Etagen nach oben niedriger */
  const EB = [null,
    { z: 3.26, R: 3.12, c: 2.74, p: 2.46, fig: 1.22 },
    { z: 5.16, R: 2.88, c: 2.42, p: 2.14, fig: 1.08 },
    { z: 6.91, R: 2.6, c: 2.1, p: 1.84, fig: 0.96 },
    { z: 8.51, R: 2.32, c: 1.8, p: 1.56, fig: 0.86 },
    { z: 9.96, R: 2.03, c: 1.52, p: 1.3, fig: 0.76 },
    { z: 11.26, R: 1.72 }];
  const NE = EB.length - 1;                                   // Kronenrahmen
  const KRONE_Z = EB[NE].z + RH;                              // 11,46
  const NABE_Z = KRONE_Z + 0.6, RAD_R = 3.3, RAD_STEIG = 0.44; // Flügelrad
  const OMEGA = TAU / 22;                                     // eine Umdrehung in 22 s
  const FARBE = {
    gruen: [40, 78, 54], rot: [146, 36, 34], gold: [214, 170, 76], elfenbein: [236, 226, 204], holz: [180, 140, 96],
    holzDunkel: [98, 68, 46], schindel: [104, 88, 76], linde: [204, 164, 112], schnee: [246, 249, 253], kerze: [244, 236, 220], deck: [132, 104, 78],
    rahmen: [172, 124, 74]
  };

  /* ---------------- Achteck ---------------- */
  const ACHT = []; for (let i = 0; i < 8; i++) ACHT.push(Math.PI / 8 + i * Math.PI / 4);
  const ecke = (R, i, z) => [R * Math.cos(ACHT[i & 7]), R * Math.sin(ACHT[i & 7]), z];
  const KANTE = 2 * Math.sin(Math.PI / 8);
  const mitteW = (i) => ACHT[i & 7] + Math.PI / 8;
  /* Seitenfläche der Kante i (Ecke i → i+1), Oberkante z1, Höhe h – von außen gesehen */
  function seite(R, i, z1, h, malen, extra) {
    const m = mitteW(i);
    return Object.assign({ name: "s" + i + "_" + R.toFixed(2) + "_" + z1.toFixed(2), o: ecke(R, i + 1, z1), u: [Math.sin(m), -Math.cos(m), 0], v: [0, 0, -1], w: KANTE * R, h: h, malen: malen }, extra || {});
  }
  /* Deckfläche (nach oben) */
  function deckel(R, z, malen, extra) {
    const um = []; for (let i = 0; i < 8; i++) { const p = ecke(R, i, z); um.push([p[0] + R, p[1] + R]); }
    return Object.assign({ name: "d" + R.toFixed(2) + "_" + z.toFixed(2), o: [-R, -R, z], u: [1, 0, 0], v: [0, 1, 0], w: 2 * R, h: 2 * R, umriss: um, malen: malen }, extra || {});
  }
  const nach = (i) => { const m = mitteW(i); return [Math.cos(m), Math.sin(m), 0]; };

  /* ---------------- Malhelfer (in Flächenkoordinaten) ---------------- */
  function bretter(g, F, farbe, senkrecht, bb, saat) {
    /* Bretter in wenigen Pfaden (vier Farbtöne, eine Fugenlage, eine
       Maserungslage) – so bleibt es auch bei großen Flächen schnell */
    const fe = F.flaeche.feld || [0, 0, F.w, F.h], rng = F.rng;
    const x0 = fe[0] - 0.3, y0 = fe[1] - 0.3, x1 = fe[2] + 0.3, y1 = fe[3] + 0.3;
    g.fillStyle = rgbS(farbe); g.fillRect(x0, y0, x1 - x0, y1 - y0);
    const a = senkrecht ? x0 : y0, b = senkrecht ? x1 : y1;
    const tone = [0, 1, 2, 3].map(() => PI.streu(farbe, rng, 0.1));
    const gruppen = [[], [], [], []], fugen = [];
    for (let t = Math.floor(a / bb) * bb; t < b; t += bb) { gruppen[Math.floor(rng() * 4)].push(t); fugen.push(t); }
    for (let k = 0; k < 4; k++) {
      g.fillStyle = rgbS(tone[k]); g.beginPath();
      for (const t of gruppen[k]) { if (senkrecht) g.rect(t, y0, bb, y1 - y0); else g.rect(x0, t, x1 - x0, bb); }
      g.fill();
    }
    if (F.px * bb > 5) {
      const fb = Math.max(0.006, 1 / F.px);
      g.fillStyle = "rgba(30,20,14,0.45)"; g.beginPath();
      for (const t of fugen) { if (senkrecht) g.rect(t, y0, fb, y1 - y0); else g.rect(x0, t, x1 - x0, fb); }
      g.fill();
    }
    if (F.px > 45) {
      g.strokeStyle = "rgba(60,40,26,0.2)"; g.lineWidth = 0.8 / F.px; g.beginPath();
      for (const t of fugen) for (let k = 0; k < 2; k++) {
        const q = t + bb * (0.2 + rng() * 0.6);
        if (senkrecht) { g.moveTo(q, y0); g.bezierCurveTo(q + 0.01, y0 + (y1 - y0) * 0.3, q - 0.01, y0 + (y1 - y0) * 0.7, q, y1); }
        else { g.moveTo(x0, q); g.bezierCurveTo(x0 + (x1 - x0) * 0.3, q + 0.01, x0 + (x1 - x0) * 0.7, q - 0.01, x1, q); }
      }
      g.stroke();
    }
    rausch(g, x0, y0, x1 - x0, y1 - y0, 1.8, 0.2, saat || 7, 4);
  }
  /* Schnee auf einem Rahmendeckel: nur eine dünne, unregelmäßige Wehe an
     der Außenkante (dort bleibt er liegen), das Holz scheint durch; innen,
     wo das nächste Stockwerk darüber liegt, bleibt es frei */
  function schneeRand(g, F, R, innen, dicht) {
    const rng = ST.zufall(Math.round(R * 1000));
    const ap = R * Math.cos(Math.PI / 8), achtel = Math.PI / 4;
    const rOkt = (w) => { let d = ((w % achtel) + achtel) % achtel; if (d > achtel / 2) d -= achtel; return ap / Math.cos(d); };
    const ph = [rng() * TAU, rng() * TAU, rng() * TAU];
    const aussen = [], rein = [];
    const n = 64;
    for (let i = 0; i <= n; i++) {
      const w = i / n * TAU, ro = rOkt(w) - 0.012;
      const breite = 0.07 + 0.08 * (0.5 + 0.5 * Math.sin(3 * w + ph[0])) + 0.05 * (0.5 + 0.5 * Math.sin(7 * w + ph[1])) + 0.03 * rng();
      const ri = Math.max(innen + 0.02, ro - breite);
      aussen.push([R + Math.cos(w) * ro, R + Math.sin(w) * ro]);
      rein.push([R + Math.cos(w) * ri, R + Math.sin(w) * ri]);
    }
    g.save();
    g.beginPath();
    aussen.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
    for (let i = rein.length - 1; i >= 0; i--) g.lineTo(rein[i][0], rein[i][1]);
    g.closePath();
    g.fillStyle = "rgba(246,249,253," + (dicht || 0.72) + ")";
    g.fill();
    /* Grat der Wehe: etwas heller, zur Mitte hin Schattenlinie */
    g.lineWidth = Math.max(0.006, 1 / F.px);
    g.strokeStyle = "rgba(150,170,205,0.35)"; g.beginPath(); rein.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke();
    /* einzelne Flocken und Krümel weiter innen */
    if (F.px > 16) { g.fillStyle = "rgba(248,250,254,0.7)"; for (let i = 0; i < 90; i++) { const w = rng() * TAU, rr = rOkt(w) - 0.1 - rng() * 0.3; if (rr < innen) continue; g.beginPath(); g.arc(R + Math.cos(w) * rr, R + Math.sin(w) * rr, 0.006 + rng() * 0.012, 0, TAU); g.fill(); } }
    g.restore();
  }

  /* ---------------- Gedrechselte Säule ----------------
     Profil: [Höhe 0…1, Radius-Faktor, Farbe] von unten nach oben */
  const PROFIL = [
    [0.0, 1.8, "g"], [0.035, 1.8, "g"], [0.035, 1.5, "e"], [0.075, 1.45, "e"], [0.095, 1.2, "e"], [0.11, 1.0, "e"],
    [0.18, 0.96, "e"], [0.19, 1.25, "g"], [0.205, 1.3, "g"], [0.22, 0.95, "e"],
    [0.44, 0.88, "e"], [0.46, 1.12, "r"], [0.475, 1.28, "g"], [0.5, 1.34, "g"], [0.525, 1.28, "g"], [0.54, 1.12, "r"], [0.56, 0.88, "e"],
    [0.78, 0.82, "e"], [0.795, 1.12, "g"], [0.81, 0.8, "e"], [0.86, 0.78, "e"], [0.9, 1.0, "e"], [0.935, 1.4, "e"], [0.96, 1.6, "g"], [1.0, 1.6, "g"]
  ];
  function saeule(g, A, x, y, z0, h, rb, q) {
    const hoch = h * (q == null ? 1 : q);
    const farbe = (k) => (k === "g" ? FARBE.gold : k === "r" ? FARBE.rot : FARBE.linde);
    for (let i = 0; i < PROFIL.length - 1; i++) {
      const a = PROFIL[i], b = PROFIL[i + 1];
      if (b[0] - a[0] < 1e-4) continue;
      const za = z0 + a[0] * h, zb = z0 + b[0] * h;
      if (za >= z0 + hoch) break;
      const zt = Math.min(zb, z0 + hoch);
      const rt = a[1] + (b[1] - a[1]) * (zt - za) / (zb - za);
      D.stumpf(g, A, [x, y, za], [x, y, zt], a[1] * rb, rt * rb, farbe(a[2]), { glanz: a[2] === "g" ? 0.9 : 0.35, deckel: farbe(a[2]) });
    }
  }

  /* Kerze auf einem goldenen Tropfteller (elektrisch, aber mit echter Flammenform) */
  function kerze(g, A, x, y, z, h, zeit, ohneFlamme) {
    D.stumpf(g, A, [x, y, z], [x, y, z + 0.04], 0.1, 0.11, FARBE.gold, { glanz: 0.9 });
    D.stumpf(g, A, [x, y, z + 0.04], [x, y, z + h], 0.055, 0.052, FARBE.kerze, { glanz: 0.25, deckel: [250, 244, 232] });
    if (!ohneFlamme) D.flamme(g, A, [x, y, z + h + 0.012], 0.13, zeit == null ? 0.5 : 0.5 + 0.5 * Math.sin(zeit * 9 + x * 5));
  }

  /* Laubsäge-Behang (Zierbrett unter dem Rahmen): Bögen mit Tropfen,
     ausgesägte Herzen – echte Löcher, dahinter sieht man durch */
  function behangMalen(g, F) {
    const A = F.A, w = F.w, h = F.h;
    const n = Math.max(3, Math.round(w / 0.3)), bw = w / n;
    g.beginPath();
    g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(w, 0.1);
    for (let j = n - 1; j >= 0; j--) {
      const x0 = j * bw, xm = x0 + bw / 2;
      g.quadraticCurveTo(x0 + bw * 0.8, 0.12, xm + bw * 0.08, h * 0.78);
      g.quadraticCurveTo(xm, h * 1.02, xm - bw * 0.08, h * 0.78);
      g.quadraticCurveTo(x0 + bw * 0.2, 0.12, x0, 0.1);
    }
    g.closePath();
    if (F.px * bw > 14) {
      for (let j = 0; j < n; j++) {
        const xm = (j + 0.5) * bw, yh = 0.16, r = Math.min(0.035, bw * 0.12);
        g.moveTo(xm, yh + r * 1.5);
        g.bezierCurveTo(xm - r * 2, yh + r * 0.1, xm - r * 0.9, yh - r * 1.2, xm, yh - r * 0.1);
        g.bezierCurveTo(xm + r * 0.9, yh - r * 1.2, xm + r * 2, yh + r * 0.1, xm, yh + r * 1.5);
        g.closePath();
        const xz = (j + 1) * bw;
        if (j < n - 1) { g.moveTo(xz + 0.018, 0.06); g.arc(xz, 0.06, 0.018, 0, TAU); }
      }
    }
    g.fillStyle = A.farbeK(FARBE.elfenbein, F.n);
    g.fill("evenodd");
    if (F.px > 20) {
      g.strokeStyle = A.farbeK(mix(FARBE.elfenbein, [90, 70, 50], 0.5), F.n, 0.7); g.lineWidth = 1 / F.px; g.stroke();
      g.fillStyle = A.farbeK(FARBE.gold, F.n);
      for (let j = 0; j < n; j++) { g.beginPath(); g.arc((j + 0.5) * bw, h * 0.86, Math.min(0.022, bw * 0.08), 0, TAU); g.fill(); }
      g.fillStyle = A.farbeK(FARBE.rot, F.n); g.fillRect(0, 0.025, w, 0.02);
    }
  }

  /* Rahmenkante: erzgebirgisches Naturholz (Kiefer, geölt) mit
     geschnitztem Bogenfries, schmaler roter und grüner Zierlinie – keine
     glatte Farbfläche mehr (sonst „Hochzeitstorte") */
  function randMalen(g, F) {
    const w = F.w, h = F.h, rng = F.rng;
    g.fillStyle = rgbS(FARBE.rahmen); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
    if (F.px > 14) {
      g.strokeStyle = "rgba(90,52,26,0.22)"; g.lineWidth = Math.max(0.004, 0.8 / F.px); g.beginPath();
      for (let y = 0.015; y < h; y += 0.03) { const d = (rng() - 0.5) * 0.012; g.moveTo(-0.1, y + d); g.bezierCurveTo(w * 0.3, y + 0.008, w * 0.65, y - 0.008, w + 0.1, y - d); }
      g.stroke();
    }
    rausch(g, 0, 0, w, h, 1.2, 0.16, 5, 3);
    g.fillStyle = "rgba(255,240,210,0.3)"; g.fillRect(-0.1, 0, w + 0.2, h * 0.08);
    g.fillStyle = "rgba(60,30,14,0.4)"; g.fillRect(-0.1, h * 0.92, w + 0.2, h * 0.1);
    g.fillStyle = rgbS(FARBE.rot); g.fillRect(-0.1, h * 0.13, w + 0.2, h * 0.05);
    g.fillStyle = rgbS(FARBE.gruen); g.fillRect(-0.1, h * 0.82, w + 0.2, h * 0.05);
    if (F.px * h > 8) {
      /* Bogenfries: ausgestochene Halbbögen (Schatten innen, Licht am Grat) */
      const bw = h * 0.55, ym = h * 0.5, y1 = h * 0.76, r = bw * 0.36;
      g.fillStyle = "rgba(66,34,14,0.6)"; g.beginPath();
      for (let x = bw * 0.5; x < w; x += bw) { g.moveTo(x - r, y1); g.lineTo(x - r, ym); g.arc(x, ym, r, Math.PI, 0); g.lineTo(x + r, y1); g.closePath(); }
      g.fill();
      if (F.px * h > 16) {
        g.strokeStyle = "rgba(255,236,196,0.55)"; g.lineWidth = Math.max(0.004, 0.9 / F.px); g.beginPath();
        for (let x = bw * 0.5; x < w; x += bw) { g.moveTo(x - r * 1.25, y1); g.lineTo(x - r * 1.25, ym); g.arc(x, ym, r * 1.25, Math.PI, 0); }
        g.stroke();
        g.fillStyle = rgbS(FARBE.gold);
        for (let x = bw; x < w; x += bw) { g.beginPath(); g.arc(x, ym + r * 0.2, h * 0.045, 0, TAU); g.fill(); }
      }
    }
  }
  /* Boden der Drehteller: Schneedecke (Winter) oder Moospolster
     (Frühling) statt nackter beiger Scheibe; feines Muster ohne
     Richtung – der Teller dreht sich, das Sprite steht */
  function tellerBoden(g, A, z, r, winter, saat) {
    const um = [];
    for (let i = 0; i < 40; i++) { const w = i / 40 * TAU; um.push([r + Math.cos(w) * r, r + Math.sin(w) * r]); }
    D.flaeche(g, A, { name: "teller" + saat, o: [-r, -r, z], u: [1, 0, 0], v: [0, 1, 0], w: 2 * r, h: 2 * r, umriss: um, malen: (g2, F) => {
      if (winter) {
        g2.fillStyle = "rgb(220,228,240)"; g2.fillRect(0, 0, F.w, F.h);
        rausch(g2, 0, 0, F.w, F.h, 0.9, 0.12, saat, 3);
        const gr = g2.createRadialGradient(r, r, r * 0.2, r, r, r);
        gr.addColorStop(0, "rgba(200,214,236,0)"); gr.addColorStop(0.85, "rgba(200,214,236,0.18)"); gr.addColorStop(1, "rgba(170,188,216,0.4)");
        g2.fillStyle = gr; g2.fillRect(0, 0, F.w, F.h);
        if (F.px > 22) { const rng = ST.zufall(saat + 3); g2.fillStyle = "rgba(255,255,255,0.9)"; for (let i = 0; i < r * r * 12; i++) { const q = (0.6 + rng()) / F.px; g2.fillRect(rng() * F.w, rng() * F.h, q, q); } }
      } else {
        g2.fillStyle = "rgb(92,122,58)"; g2.fillRect(0, 0, F.w, F.h);
        rausch(g2, 0, 0, F.w, F.h, 0.7, 0.3, saat, 4);
        PI.bleichen(g2, 0, 0, F.w, F.h, 0.9, 0.18, saat);
      }
      /* Holzrand des Tellers */
      g2.strokeStyle = "rgb(150,104,62)"; g2.lineWidth = 0.07; g2.beginPath(); g2.arc(r, r, r - 0.035, 0, TAU); g2.stroke();
      g2.strokeStyle = rgbS(FARBE.gold); g2.lineWidth = 0.015; g2.beginPath(); g2.arc(r, r, r - 0.075, 0, TAU); g2.stroke();
    } });
  }

  /* ---------------- Szenerie auf den Tellern ----------------
     Auf echten Marktpyramiden stehen die Figuren nicht auf leeren
     Scheiben: kleine Häuser, Zäune, eine Kirche, der Stolleneingang bei
     den Bergleuten, ein Lagerfeuer bei den Hirten. Alles im selben
     Maßstab wie die Figuren (Figurraum, 1,75 m = Mensch), auf den
     Tellern verkleinert wie die Figuren. */
  function wandFenster(g, Fl, fenster, nacht) {
    for (const [x, y, fw, fh, rund] of fenster) {
      g.fillStyle = nacht > 0.2 ? "rgb(255,204,120)" : "rgb(58,68,84)";
      g.beginPath();
      if (rund) { g.moveTo(x, y + fh); g.lineTo(x, y + fw / 2); g.arc(x + fw / 2, y + fw / 2, fw / 2, Math.PI, 0); g.lineTo(x + fw, y + fh); g.closePath(); }
      else g.rect(x, y, fw, fh);
      g.fill();
      if (Fl.px > 25) {
        g.strokeStyle = "rgb(236,228,210)"; g.lineWidth = 0.035; g.stroke();
        g.lineWidth = 0.02; g.beginPath(); g.moveTo(x + fw / 2, y + (rund ? fw / 2 : 0)); g.lineTo(x + fw / 2, y + fh); g.moveTo(x, y + fh * 0.55); g.lineTo(x + fw, y + fh * 0.55); g.stroke();
      }
    }
  }
  function haus(o) {
    o = o || {};
    const F = new D.Figur();
    const B = o.b || 1.5, T = o.t || 1.2, H = o.h || 1.25, HF = o.flach ? 0 : (o.hf || 1.0);
    const putz = o.putz || [228, 214, 186], winter = !!o.winter, hx = B / 2, hy = T / 2;
    const wand = (art) => (g, Fl) => {
      g.fillStyle = rgbS(putz); g.fillRect(-0.1, -0.1, Fl.w + 0.2, Fl.h + 0.2);
      if (Fl.px > 18) rausch(g, 0, 0, Fl.w, Fl.h, 0.8, 0.16, 11, 4);
      const y0 = Fl.h - H;
      if (o.fachwerk && Fl.px > 14) {
        g.strokeStyle = "rgb(92,62,40)"; g.lineWidth = 0.07;
        g.beginPath(); g.moveTo(0, y0 + 0.04); g.lineTo(Fl.w, y0 + 0.04); g.moveTo(0, y0 + H * 0.5); g.lineTo(Fl.w, y0 + H * 0.5);
        for (let x = 0.04; x < Fl.w; x += Math.max(0.4, Fl.w / 3)) { g.moveTo(x, y0); g.lineTo(x, Fl.h); }
        g.stroke();
      }
      if (art === "front") {
        g.fillStyle = "rgb(96,62,40)"; PI.rundRechteck(g, Fl.w / 2 - 0.2, Fl.h - 0.85, 0.4, 0.85, 0.05); g.fill();
        wandFenster(g, Fl, [[0.18, y0 + 0.3, 0.3, 0.38], [Fl.w - 0.48, y0 + 0.3, 0.3, 0.38]], Fl.nacht);
      } else if (art === "seite") wandFenster(g, Fl, [[Fl.w * 0.3 - 0.15, y0 + 0.3, 0.3, 0.38], [Fl.w * 0.7 - 0.15, y0 + 0.3, 0.3, 0.38]], Fl.nacht);
      else if (art === "giebel" && HF > 0.4) wandFenster(g, Fl, [[Fl.w / 2 - 0.12, HF * 0.45, 0.24, 0.3]], Fl.nacht);
      g.fillStyle = "rgba(80,70,64,0.5)"; g.fillRect(-0.1, Fl.h - 0.1, Fl.w + 0.2, 0.2);
    };
    F.flaeche({ name: "hv", o: [-hx, hy, H], u: [1, 0, 0], v: [0, 0, -1], w: B, h: H, n: [0, 1, 0], malen: wand("front") });
    F.flaeche({ name: "hh", o: [hx, -hy, H], u: [-1, 0, 0], v: [0, 0, -1], w: B, h: H, n: [0, -1, 0], malen: wand("seite") });
    const gum = [[0, HF], [T / 2, 0], [T, HF], [T, H + HF], [0, H + HF]];
    F.flaeche({ name: "hr", o: [hx, hy, H + HF], u: [0, -1, 0], v: [0, 0, -1], w: T, h: H + HF, n: [1, 0, 0], umriss: gum, malen: wand("giebel") });
    F.flaeche({ name: "hl", o: [-hx, -hy, H + HF], u: [0, 1, 0], v: [0, 0, -1], w: T, h: H + HF, n: [-1, 0, 0], umriss: gum, malen: wand("giebel") });
    const ue = 0.12, zr = H + HF + 0.04;
    const dachMalen = (g, Fl) => {
      if (winter) {
        g.fillStyle = "rgb(244,247,252)"; g.fillRect(-0.1, -0.1, Fl.w + 0.2, Fl.h + 0.2);
        rausch(g, 0, 0, Fl.w, Fl.h, 0.9, 0.08, 31, 3);
        g.fillStyle = "rgba(120,110,110,0.7)"; g.fillRect(-0.1, Fl.h - 0.04, Fl.w + 0.2, 0.06);
      } else {
        g.fillStyle = rgbS(o.dach || [150, 70, 52]); g.fillRect(-0.1, -0.1, Fl.w + 0.2, Fl.h + 0.2);
        if (Fl.px > 16) { g.fillStyle = "rgba(40,20,14,0.3)"; for (let y = 0.1; y < Fl.h; y += 0.12) g.fillRect(-0.1, y, Fl.w + 0.2, 0.018); }
        rausch(g, 0, 0, Fl.w, Fl.h, 0.9, 0.18, 7, 4);
      }
    };
    if (HF > 0) {
      const L = Math.hypot(hy + ue, HF + ue * HF / hy);
      for (const sy of [1, -1]) {
        const unten = [0, sy * (hy + ue), H - ue * HF / hy];
        F.flaeche({ name: "hd" + sy, o: [sy > 0 ? -hx - ue : hx + ue, 0, zr], u: [sy, 0, 0], v: nrm(sub(unten, [0, 0, zr])), w: B + 2 * ue, h: L, n: [0, sy * HF, hy], malen: dachMalen });
      }
      /* Schornstein */
      F.zyl([hx * 0.45, -hy * 0.35, H + HF * 0.4], [hx * 0.45, -hy * 0.35, H + HF + 0.35], 0.1, 0.1, [150, 84, 64], { qf: 1, deckel: winter ? [246, 248, 252] : [80, 60, 56] });
    } else {
      /* flaches Dach (Bethlehem) mit Brüstung */
      F.poly([[-hx, -hy, H], [hx, -hy, H], [hx, hy, H], [-hx, hy, H]], winter ? [244, 247, 252] : mix(putz, [255, 255, 255], 0.1), { n: [0, 0, 1] });
      F.zyl([0, 0, H], [0, 0, H + 0.25], Math.min(hx, hy) * 0.45, Math.min(hx, hy) * 0.1, mix(putz, [255, 255, 255], 0.15), { deckel: false, b: 0.05 });
    }
    return F;
  }
  function kirchlein(winter) {
    const F = new D.Figur();
    const putz = [236, 228, 206];
    F.dazu(haus({ b: 1.2, t: 2.0, h: 1.4, hf: 0.9, putz: putz, winter: winter, dach: [70, 74, 86] }), [0, -0.3, 0], Math.PI / 2, 1);
    /* Turm vorn mit Zwiebelhaube, Uhr und Kreuz */
    const tw = 0.36, th = 2.5, y = 1.0;
    const turm = (g, Fl) => {
      g.fillStyle = rgbS(putz); g.fillRect(-0.1, -0.1, Fl.w + 0.2, Fl.h + 0.2);
      if (Fl.px > 18) rausch(g, 0, 0, Fl.w, Fl.h, 0.8, 0.14, 13, 4);
      wandFenster(g, Fl, [[Fl.w / 2 - 0.1, 0.35, 0.2, 0.4, true], [Fl.w / 2 - 0.1, 1.2, 0.2, 0.45, true]], Fl.nacht);
      g.fillStyle = "rgb(250,246,236)"; g.beginPath(); g.arc(Fl.w / 2, 0.18, 0.13, 0, TAU); g.fill();
      if (Fl.px > 25) { g.strokeStyle = "rgb(40,36,34)"; g.lineWidth = 0.02; g.beginPath(); g.moveTo(Fl.w / 2, 0.18); g.lineTo(Fl.w / 2, 0.09); g.moveTo(Fl.w / 2, 0.18); g.lineTo(Fl.w / 2 + 0.07, 0.2); g.stroke(); }
    };
    for (const [o, u, n] of [[[-tw, y + tw, th], [1, 0, 0], [0, 1, 0]], [[tw, y - tw, th], [-1, 0, 0], [0, -1, 0]], [[tw, y + tw, th], [0, -1, 0], [1, 0, 0]], [[-tw, y - tw, th], [0, 1, 0], [-1, 0, 0]]]) {
      F.flaeche({ name: "tu" + n.join(""), o: o, u: u, v: [0, 0, -1], w: 2 * tw, h: th, n: n, malen: turm });
    }
    const z = th, dunkel = winter ? [226, 232, 240] : [66, 96, 84];
    F.loft([{ c: [0, y, z], a: [tw * 1.05, 0, 0], b: [0, tw * 1.05, 0] }, { c: [0, y, z + 0.18], a: [tw * 1.2, 0, 0], b: [0, tw * 1.2, 0] }, { c: [0, y, z + 0.42], a: [tw * 0.9, 0, 0], b: [0, tw * 0.9, 0] }, { c: [0, y, z + 0.62], a: [0.08, 0, 0], b: [0, 0.08, 0] },
      { c: [0, y, z + 0.78], a: [0.16, 0, 0], b: [0, 0.16, 0] }, { c: [0, y, z + 0.95], a: [0.05, 0, 0], b: [0, 0.05, 0] }, { c: [0, y, z + 1.05], a: [0.01, 0, 0], b: [0, 0.01, 0] }], dunkel, { n: 16, glanz: winter ? 0 : 0.3 });
    F.strich([[0, y, z + 1.0], [0, y, z + 1.35]], 0.03, [214, 176, 80], { b: 0.1 });
    F.strich([[-0.09, y, z + 1.24], [0.09, y, z + 1.24]], 0.03, [214, 176, 80], { b: 0.1 });
    return F;
  }
  function stollen(winter) {
    /* Stollenmundloch: Bruchsteinbogen im Hang, Holztür, darüber „Glück auf" */
    const F = new D.Figur();
    /* Hang aus mehreren Buckeln (Erde, Fels) statt einer glatten Kuppel,
       davor Bruchsteine; oben Schnee- bzw. Moosauflage */
    const erde = [112, 100, 86], fels = [124, 118, 110], auflage = winter ? [240, 244, 250] : [96, 124, 64];
    F.ellR([0, -0.55, 0.25], [1, 0, 0], 1.2, 0.8, 0.95, erde, { b: -0.2 });
    F.ellR([-0.95, -0.35, 0.1], [1, 0.3, 0], 0.62, 0.55, 0.55, fels, { b: -0.12 });
    F.ellR([0.98, -0.42, 0.08], [1, -0.25, 0], 0.58, 0.5, 0.48, mix(erde, fels, 0.5), { b: -0.12 });
    F.ellR([0.35, -0.95, 0.45], [1, 0, 0], 0.7, 0.5, 0.6, mix(erde, [80, 72, 62], 0.3), { b: -0.15 });
    const rng = ST.zufall(77);
    for (let i = 0; i < 9; i++) {
      const x = -1.3 + i * 0.32 + (rng() - 0.5) * 0.12, y = 0.02 + rng() * 0.14, r = 0.07 + rng() * 0.07;
      if (Math.abs(x) < 0.55) continue;                  // vor dem Mundloch frei
      F.ell([x, y, r * 0.5], r * 1.2, r, r * 0.75, mix(fels, [150, 146, 140], rng() * 0.6), { b: -0.05 });
    }
    F.ellR([0, -0.6, 0.62], [1, 0, 0], 0.95, 0.62, 0.55, auflage, { b: -0.15 });
    F.ellR([-0.95, -0.4, 0.38], [1, 0.3, 0], 0.44, 0.38, 0.3, auflage, { b: -0.1 });
    F.ellR([0.98, -0.45, 0.33], [1, -0.25, 0], 0.4, 0.34, 0.26, auflage, { b: -0.1 });
    const w = 1.3, h = 1.7;
    const um = [[0, h], [0, 0.55], [0.12, 0.2], [0.4, 0.02], [0.65, 0], [0.9, 0.02], [1.18, 0.2], [1.3, 0.55], [1.3, h]];
    F.flaeche({ name: "stollen", o: [-w / 2, 0.12, h], u: [1, 0, 0], v: [0, 0, -1], w: w, h: h, n: [0, 1, 0], umriss: um, malen: (g, Fl) => {
      g.fillStyle = "rgb(140,132,122)"; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
      if (Fl.px > 16) {
        const rng = ST.zufall(5);
        g.strokeStyle = "rgba(60,54,48,0.6)"; g.lineWidth = 0.02;
        for (let y = 0.05; y < h; y += 0.16) for (let x = (y * 7) % 0.2 - 0.1; x < w; x += 0.22 + rng() * 0.08) { PI.rundRechteck(g, x, y, 0.2, 0.14, 0.04); g.stroke(); }
      }
      /* Öffnung mit Tür */
      g.fillStyle = "rgb(24,20,18)"; g.beginPath(); g.moveTo(0.3, h); g.lineTo(0.3, 0.7); g.arc(0.65, 0.7, 0.35, Math.PI, 0); g.lineTo(1.0, h); g.closePath(); g.fill();
      g.fillStyle = "rgb(104,72,44)"; g.fillRect(0.34, 0.72, 0.28, h - 0.72);
      if (Fl.px > 25) { g.fillStyle = "rgba(40,24,14,0.6)"; for (let x = 0.34; x < 0.62; x += 0.07) g.fillRect(x, 0.72, 0.01, h - 0.72); }
      /* Schild und Schlägel und Eisen */
      g.fillStyle = "rgb(60,70,58)"; g.fillRect(0.3, 0.26, 0.7, 0.17);
      if (Fl.px > 30) { g.fillStyle = "rgb(236,220,160)"; g.font = "italic 0.11px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("Glück auf", 0.65, 0.35); }
      if (Fl.nacht > 0.2) { g.fillStyle = "rgba(255,190,110,0.8)"; g.beginPath(); g.arc(0.8, 1.0, 0.05, 0, TAU); g.fill(); }
    } });
    for (const sx of [-1, 1]) F.zyl([sx * 0.42, 0.18, 0], [sx * 0.42, 0.18, 1.1], 0.05, 0.045, [110, 80, 52], { b: 0.1 });
    F.strich([[-0.5, 0.18, 1.1], [0.5, 0.18, 1.1]], 0.08, [110, 80, 52], { b: 0.12 });
    return F;
  }
  function hunt(winter) {
    /* Hunt (Grubenwagen) mit Erz auf Schienen */
    const F = new D.Figur();
    for (const sx of [-1, 1]) F.strich([[sx * 0.24, -0.9, 0.02], [sx * 0.24, 0.9, 0.02]], 0.03, [70, 66, 64], {});
    for (let y = -0.8; y <= 0.8; y += 0.4) F.strich([[-0.34, y, 0.01], [0.34, y, 0.01]], 0.07, [96, 74, 52], { b: -0.01 });
    const holz = [120, 84, 52];
    F.poly([[-0.3, -0.45, 0.62], [0.3, -0.45, 0.62], [0.3, 0.45, 0.62], [-0.3, 0.45, 0.62]], [40, 36, 34], { n: [0, 0, 1], b: 0.02 });
    for (const [o, u, n, w] of [[[-0.3, 0.45, 0.62], [1, 0, 0], [0, 1, 0], 0.6], [[0.3, -0.45, 0.62], [-1, 0, 0], [0, -1, 0], 0.6], [[0.3, 0.45, 0.62], [0, -1, 0], [1, 0, 0], 0.9], [[-0.3, -0.45, 0.62], [0, 1, 0], [-1, 0, 0], 0.9]]) {
      F.flaeche({ name: "hw", o: o, u: u, v: [0, 0, -1], w: w, h: 0.45, n: n, malen: (g, Fl) => { g.fillStyle = rgbS(holz); g.fillRect(-0.1, -0.1, Fl.w + 0.2, 0.7); g.fillStyle = "rgba(40,30,20,0.5)"; for (let y = 0.15; y < 0.45; y += 0.15) g.fillRect(-0.1, y, Fl.w + 0.2, 0.012); g.fillStyle = "rgb(60,56,54)"; g.fillRect(0.04, -0.1, 0.04, 0.7); g.fillRect(Fl.w - 0.08, -0.1, 0.04, 0.7); } });
    }
    for (let i = 0; i < 6; i++) F.ell([(i % 3 - 1) * 0.15, (Math.floor(i / 3) - 0.5) * 0.35, 0.66], 0.1, 0.12, 0.07, i % 2 ? [74, 70, 68] : [110, 96, 70], { b: 0.03 });
    if (winter) F.ell([0, 0, 0.72], 0.2, 0.3, 0.05, [242, 246, 252], { b: 0.05 });
    for (const sx of [-1, 1]) for (const y of [-0.3, 0.3]) F.zyl([sx * 0.26, y, 0.1], [sx * 0.31, y, 0.1], 0.09, 0.09, [60, 56, 54], { b: 0.04 });
    return F;
  }
  function pferch(winter) {
    /* Hürde: Pfähle und zwei Querlatten, leicht gebogen */
    const F = new D.Figur();
    const pts = []; for (let i = 0; i <= 6; i++) { const w = -0.6 + i * 0.2; pts.push([Math.sin(w) * 1.8, Math.cos(w) * 1.8 - 1.8, 0]); }
    for (const p of pts) F.zyl(p, add(p, [0, 0, 0.75]), 0.035, 0.03, [110, 84, 60], { deckel: winter ? [246, 248, 252] : [150, 120, 90] });
    for (const z of [0.3, 0.62]) F.strich(pts.map((p) => add(p, [0, 0, z])), 0.04, [140, 108, 76], { b: 0.02 });
    if (winter) F.strich(pts.map((p) => add(p, [0, 0, 0.66])), 0.035, [246, 249, 253], { b: 0.03 });
    return F;
  }
  function lagerfeuer(ostern) {
    const F = new D.Figur();
    for (let i = 0; i < 8; i++) { const w = i / 8 * TAU; F.ell([Math.cos(w) * 0.32, Math.sin(w) * 0.32, 0.05], 0.09, 0.08, 0.06, [110, 104, 98], {}); }
    for (let i = 0; i < 4; i++) { const w = i / 4 * TAU + 0.4; F.kap([Math.cos(w) * 0.3, Math.sin(w) * 0.3, 0.05], [0, 0, ostern ? 0.5 : 0.28], 0.035, 0.03, [96, 64, 40], { b: 0.02 }); }
    F.flamme([0, 0, 0.1], ostern ? 0.7 : 0.45, { b: 0.05 });
    F.flamme([0.08, 0.04, 0.08], 0.3, { b: 0.06 });
    F.flamme([-0.07, -0.05, 0.08], 0.28, { b: 0.06 });
    return F;
  }

  /* ---------------- Figurenbesetzung ----------------
     Fünf Etagen, jede ein Bild: 1 Christi Geburt, 2 Hirten auf dem Feld,
     3 Bergparade vor dem Stollen, 4 Kurrendesänger vor der Kirche,
     5 Engel. Die Figuren füllen den Teller in zwei Ringen, dazwischen
     die Szenerie. Im Frühling (Osterpyramide): Schafe und Lämmer,
     Osterfeuer, Bergleute, Frauen und Kinder mit Osterkörbchen, Engel mit
     Blütenkränzen. */
  const FIG_CACHE = {};
  function besetzung(jahr) {
    const winter = jahr === "winter", schl = winter ? "w" : "f";
    if (FIG_CACHE[schl]) return FIG_CACHE[schl];
    const M = FW.mensch, S = FW.schaf;
    const L = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    const stell = (e, fig, r, th, blick, extra) => L[e].push(Object.assign({ fig: fig, r: r, th: th, blick: blick || 0, k: EB[e].fig / 1.75, dz: 0 }, extra || {}));
    const tier = (e, fig, r, th, blick, groesse) => L[e].push({ fig: fig, r: r, th: th, blick: blick || 0, k: (groesse || 1) * EB[e].fig / 1.75, dz: 0 });
    const baumArt = [FW.fichte({ saat: 1, schnee: winter }), FW.fichte({ saat: 2, schnee: winter, farbe: [34, 70, 46] })];
    const baeume = (e, liste) => liste.forEach(([r, th, h], i) => L[e].push({ fig: baumArt[i % 2], r: r, th: th, blick: 0, k: h, dz: 0 }));
    const blickZu = (r, th, r2, th2) => {
      const x = r * Math.cos(th), y = r * Math.sin(th), x2 = r2 * Math.cos(th2), y2 = r2 * Math.sin(th2);
      return Math.atan2(y2 - y, x2 - x) - th;
    };
    const hirte = (o) => M(Object.assign({ gewand: [130, 108, 84], mantel: [96, 80, 64], kopf: "kapuze", kopfFarbe: [110, 92, 70], bart: [120, 110, 100], haar: [120, 110, 100] }, o));
    const bergmann = [0, 1, 2].map((i) => M({ arme: i === 2 ? "laterne" : "haeckel", gewand: [34, 32, 36], beine: [236, 232, 222], kopf: "schachthut", kragen: [30, 28, 32], knoepfe: [220, 180, 80], bart: i === 1 ? [80, 60, 40] : null, haar: [70, 50, 34], standbein: i ? 1 : -1 }));
    if (winter) {
      /* 1. Etage: Christi Geburt vor dem Stall, Hirten, die Heiligen Drei Könige, Häuser von Bethlehem */
      const kr = 1.5, kt = 0;
      stell(1, FW.stall({ stern: true, b: 1.9, t: 1.0, h: 1.75 }), 0.92, 0, 0);
      stell(1, FW.krippe({}), kr, kt, Math.PI / 2);
      stell(1, FW.kind({}), kr, kt, Math.PI / 2, { dz: 0.6 });
      stell(1, M({ pose: "knien", arme: "beten", gewand: [168, 52, 52], mantel: [46, 76, 150], kopf: "schleier", kopfFarbe: [238, 234, 224], haar: [90, 60, 40], nicken: 0.4 }), 1.66, -0.36, blickZu(1.66, -0.36, kr, kt));
      stell(1, M({ arme: "laterne", gewand: [118, 84, 58], mantel: [168, 146, 106], haar: [96, 70, 50], bart: [96, 70, 50], kordel: [200, 180, 140], nicken: 0.2 }), 1.7, 0.38, blickZu(1.7, 0.38, kr, kt));
      tier(1, FW.ochse({}), 0.86, -0.56, 0.9, 0.9);
      tier(1, FW.esel({}), 0.9, 0.56, -0.9, 0.9);
      stell(1, hirte({ pose: "knien", arme: "beten" }), 1.95, 0.82, -Math.PI / 2 + 0.3);
      stell(1, hirte({ arme: "lamm", kopf: "filzhut", kopfFarbe: [90, 74, 60] }), 2.05, 1.18, -Math.PI / 2 + 0.2);
      tier(1, S({ liegen: true, saat: 8 }), 2.0, 1.55, 0.2);
      tier(1, S({ saat: 9 }), 1.55, 1.45, -1.2);
      tier(1, S({ lamm: true, liegen: true, saat: 10 }), 2.1, 1.82, 0.9);
      const koenig = [
        { gewand: [120, 30, 50], mantel: [160, 40, 40], haar: [220, 220, 220], bart: [230, 230, 230], gabe: "truhe", kopf: "krone" },
        { gewand: [40, 70, 110], mantel: [70, 110, 70], haar: [60, 40, 30], bart: [70, 50, 36], gabe: "kelch", kopf: "krone" },
        { gewand: [200, 160, 60], mantel: [110, 50, 120], haar: [30, 24, 20], haut: FW.HAUT[3], gabe: "dose", kopf: "turban", kopfFarbe: [236, 230, 214] }
      ];
      koenig.forEach((kk, i) => {
        const th = -Math.PI / 2 - 0.35 - i * 0.42;
        stell(1, M(Object.assign({ arme: "geschenk", borte: [214, 176, 80], weiteAermel: true, standbein: i % 2 ? 1 : -1 }, kk)), 1.85, th, -Math.PI / 2 + 0.2);
      });
      stell(1, haus({ flach: true, b: 1.3, t: 1.1, h: 1.3, putz: [232, 222, 196], winter: true }), 0.95, Math.PI - 0.45, 0);
      stell(1, haus({ flach: true, b: 1.0, t: 0.9, h: 1.6, putz: [214, 196, 160], winter: true }), 1.05, Math.PI + 0.5, 0.3);
      baeume(1, [[2.2, -0.95, 0.85], [2.18, 2.3, 0.8], [2.2, 2.75, 0.7], [1.3, Math.PI, 0.6]]);
      /* 2. Etage: Hirten auf dem Feld mit Herde, Pferch, Lagerfeuer, Hütte */
      stell(2, hirte({ arme: "lamm" }), 1.5, 0.2, 0.3);
      stell(2, hirte({ arme: "stab", krummstab: true, gewand: [140, 120, 96], mantel: [110, 92, 72], kopf: "filzhut", kopfFarbe: [90, 74, 60], bart: [150, 140, 130], haar: [150, 140, 130] }), 1.62, Math.PI + 0.3, -0.4);
      stell(2, hirte({ pose: "knien", arme: "laterne", mantel: [120, 100, 76] }), 1.25, 1.75, blickZu(1.25, 1.75, 0.72, 2.2));
      stell(2, lagerfeuer(false), 0.72, 2.2, 0);
      stell(2, haus({ b: 1.1, t: 1.0, h: 0.95, hf: 0.8, putz: [150, 118, 84], winter: true }), 0.78, 4.2, 0.2);
      stell(2, pferch(true), 1.2, 3.9, 0, { k: EB[2].fig / 1.75 });
      const herde = [[1.45, 0.75, 0.3, 0], [1.8, 1.0, -0.5, 1], [1.5, 1.2, 0.8, 2], [1.85, 2.55, 0.2, 3], [1.55, 2.9, -0.4, 0], [1.85, 3.25, 0.9, 1], [1.45, 3.45, 0.1, 2], [1.35, 4.85, -0.6, 3], [1.75, 5.1, 0.4, 0], [1.5, 5.5, 1.1, 1], [1.85, 5.85, -0.2, 2]];
      const schafArt = [S({ saat: 3 }), S({ liegen: true, saat: 4 }), S({ saat: 5, schwarzkopf: true, grasen: true }), S({ lamm: true, saat: 6 })];
      herde.forEach(([r, th, bl, a]) => tier(2, schafArt[a], r, th, bl, 1));
      baeume(2, [[1.95, 0.45, 0.75], [1.95, 2.2, 0.65], [1.95, 4.4, 0.7], [0.6, 5.6, 0.6]]);
      /* 3. Etage: Bergparade vor dem Stollenmundloch, Hunt auf Schienen */
      for (let i = 0; i < 8; i++) stell(3, bergmann[i % 3], 1.42, i * TAU / 8 + 0.2, Math.PI / 2);
      stell(3, stollen(true), 0.72, 0.6, 0);
      stell(3, hunt(true), 0.78, Math.PI + 0.3, Math.PI / 2);
      stell(3, haus({ b: 1.2, t: 1.0, h: 1.05, hf: 0.85, putz: [214, 204, 180], fachwerk: true, winter: true }), 0.8, 2.3, 0);
      baeume(3, [[0.62, 4.3, 0.55], [0.7, 5.25, 0.6], [1.72, 4.75, 0.5]]);
      /* 4. Etage: Kurrendesänger mit Stern vor der Dorfkirche */
      const saenger = [0, 1].map((i) => M({ arme: "buch", gewand: [36, 34, 40], mantel: [26, 24, 30], kragen: [244, 242, 236], kopf: "filzhut", kopfFarbe: [28, 26, 30], haar: i ? [200, 170, 110] : [80, 56, 36], h: i ? 1.45 : 1.6, standbein: i ? 1 : -1 }));
      stell(4, M({ arme: "sternstab", gewand: [36, 34, 40], mantel: [26, 24, 30], kragen: [244, 242, 236], kopf: "filzhut", kopfFarbe: [28, 26, 30], haar: [80, 56, 36] }), 1.12, -0.1, 0.1);
      for (let i = 0; i < 5; i++) stell(4, saenger[i % 2], 1.12 - (i % 2) * 0.12, 0.35 + i * 0.42, 0.1);
      stell(4, kirchlein(true), 0.58, Math.PI + 0.4, 0);
      stell(4, haus({ b: 1.1, t: 0.9, h: 1.0, hf: 0.8, putz: [226, 200, 170], winter: true }), 1.0, 3.95, 0.3);
      stell(4, haus({ b: 1.0, t: 0.9, h: 1.0, hf: 0.8, putz: [210, 214, 196], fachwerk: true, winter: true }), 1.05, 4.9, -0.2);
      baeume(4, [[1.3, 3.4, 0.5], [1.32, 5.5, 0.45], [0.5, 5.9, 0.45]]);
      /* 5. Etage: Lichterengel und Posaunenengel */
      const engel = [0, 1].map((i) => M({ arme: i ? "posaune" : "kerzen", gewand: i ? [236, 230, 214] : [232, 222, 196], borte: [214, 176, 80], haar: [214, 180, 110], kopf: "kranz", fluegel: [236, 216, 156], weiteAermel: true, standbein: i ? 1 : -1 }));
      for (let i = 0; i < 6; i++) stell(5, engel[i % 2], 0.9, i * TAU / 6 + 0.3, 0.15);
      baeume(5, [[0.45, 0.8, 0.42], [0.45, 2.9, 0.4], [0.45, 5.0, 0.42]]);
    } else {
      /* Frühling (Osterpyramide) */
      stell(1, hirte({ arme: "stab", krummstab: true, gewand: [140, 120, 96], mantel: [110, 92, 72], kopf: "filzhut", kopfFarbe: [90, 74, 60], bart: [150, 140, 130], haar: [150, 140, 130] }), 1.7, 0, 0.2);
      const herde = [[1.6, 0.6, 0.2, false, false], [1.95, 0.95, -0.3, false, true], [1.5, 1.25, 0.5, true, false], [1.95, 1.7, 0.1, false, true], [1.6, 2.1, 0.4, false, false], [1.95, 2.6, -0.5, true, true], [1.55, 3.0, 0.2, false, false], [1.95, 3.5, 0.6, false, true], [1.6, 3.9, -0.2, true, false], [1.95, 4.4, 0.3, false, true], [1.55, 4.9, 0.8, false, false], [1.95, 5.4, -0.4, true, true]];
      herde.forEach(([r, th, bl, lieg, lamm], i) => tier(1, S({ liegen: lieg, lamm: lamm, saat: 20 + i, grasen: !lieg && !lamm && i % 2 === 0 }), r, th, bl));
      stell(1, haus({ b: 1.4, t: 1.1, h: 1.2, hf: 1.0, putz: [230, 214, 180], fachwerk: true }), 0.95, 1.6, 0);
      stell(1, haus({ b: 1.2, t: 1.0, h: 1.15, hf: 0.9, putz: [214, 222, 206], dach: [90, 90, 100] }), 0.95, 4.2, 0.3);
      stell(1, pferch(false), 1.3, 3.0, 0, { k: EB[1].fig / 1.75 });
      baeume(1, [[2.2, 0.3, 0.8], [0.9, 2.9, 0.7], [2.2, 3.2, 0.75], [0.85, 5.4, 0.7]]);
      stell(2, hirte({ arme: "lamm" }), 1.5, 0.2, 0.3);
      stell(2, lagerfeuer(true), 0.72, 2.2, 0);
      stell(2, haus({ b: 1.1, t: 1.0, h: 0.95, hf: 0.8, putz: [150, 118, 84] }), 0.78, 4.2, 0.2);
      for (let i = 0; i < 7; i++) tier(2, S({ lamm: i % 2 === 0, liegen: i === 3, saat: 40 + i }), 1.35 + (i % 2) * 0.35, 1.0 + i * 0.75, 0.3);
      baeume(2, [[1.95, 0.45, 0.75], [1.95, 3.5, 0.65], [0.6, 5.6, 0.6]]);
      for (let i = 0; i < 8; i++) stell(3, bergmann[i % 3], 1.42, i * TAU / 8 + 0.2, Math.PI / 2);
      stell(3, stollen(false), 0.72, 0.6, 0);
      stell(3, hunt(false), 0.78, Math.PI + 0.3, Math.PI / 2);
      baeume(3, [[0.62, 4.3, 0.55], [0.7, 5.25, 0.6]]);
      const korb = [0, 1, 2].map((i) => M({ arme: "korb", gewand: [[180, 70, 80], [70, 110, 160], [210, 180, 90]][i], schuerze: [240, 236, 226], kopf: i === 1 ? null : "tuch", kopfFarbe: [[230, 200, 90], [240, 236, 226], [200, 90, 110]][i], haar: [[120, 80, 50], [200, 160, 100], [70, 50, 34]][i], h: i === 1 ? 1.25 : 1.62, standbein: i % 2 ? 1 : -1 }));
      for (let i = 0; i < 6; i++) stell(4, korb[i % 3], 1.1, 0.2 + i * 0.5, 0.2);
      stell(4, kirchlein(false), 0.58, Math.PI + 0.4, 0);
      stell(4, haus({ b: 1.1, t: 0.9, h: 1.0, hf: 0.8, putz: [226, 200, 170] }), 1.0, 4.3, 0.3);
      baeume(4, [[1.3, 3.6, 0.5], [1.32, 5.5, 0.45]]);
      const engelF = [0, 1].map((i) => M({ arme: "kranz", gewand: i ? [236, 230, 214] : [226, 236, 214], borte: [120, 170, 90], haar: [214, 180, 110], kopf: "kranz", fluegel: [236, 216, 156], weiteAermel: true, standbein: i ? 1 : -1 }));
      for (let i = 0; i < 6; i++) stell(5, engelF[i % 2], 0.9, i * TAU / 6 + 0.3, 0.15);
      baeume(5, [[0.45, 0.8, 0.42], [0.45, 2.9, 0.4], [0.45, 5.0, 0.42]]);
    }
    FIG_CACHE[schl] = L;
    return L;
  }
  /* =====================================================================
     STÜCKLISTE — jedes Bauteil mit Stockwerk, Schicht, Mitte und
     Bauphase. Gezeichnet wird von unten nach oben (was höher liegt, liegt
     bei dieser Kamera immer näher am Auge), im Stockwerk nach Tiefe.
     ===================================================================== */
  function stueckliste(o) {
    const winter = o.jahr === "winter";
    const L = [];
    const dazu = (e, sch, c, bau, fn, extra) => L.push(Object.assign({ e: e, sch: sch, c: c, bau: bau, fn: fn }, extra || {}));
    const flaecheQ = (f) => (g, A) => D.flaeche(g, A, f);

    /* ---- Baugrube und Fundament ---- */
    dazu(-1, 0, [0, 0, -0.5], [0, 0.14], (g, A, q, bau) => {
      const tief = 0.75, R = DECK_R + 0.35;
      if (bau >= 0.14) return;                   // fertig: alles liegt unter dem Podest
      /* Alles in der Grube liegt unter Gelände: nur durch die Öffnung
         sichtbar (Ausschnitt), die vordere Grubenwand verdeckt den Rest */
      g.save();
      if (!A.silhouette) { D.pfad(g, [0, 1, 2, 3, 4, 5, 6, 7].map((i) => A.bild(ecke(R, i, 0)))); g.clip(); }
      /* Grubenwände (Innenseiten, schräg) und Sohle */
      if (bau < 0.13) {
        const sohle = deckel(R - 0.3, -tief, (g2, F) => { g2.fillStyle = "rgb(92,70,52)"; g2.fillRect(0, 0, F.w, F.h); rausch(g2, 0, 0, F.w, F.h, 0.9, 0.35, 12, 4); });
        D.flaeche(g, A, sohle);
        for (let i = 0; i < 8; i++) {
          const a = ecke(R, i, 0), b = ecke(R, i + 1, 0), c = ecke(R - 0.3, i + 1, -tief), d = ecke(R - 0.3, i, -tief);
          const nv = nach(i);
          D.vieleck(g, A, [a, d, c, b], [118, 90, 64], { naht: true, n: nrm([-nv[0] * 0.75, -nv[1] * 0.75, 0.3]) });
        }
      }
      /* Beton mit Schalungsspuren, wächst bis Oberkante Gelände */
      if (bau >= 0.06) {
        const k = klemm((bau - 0.06) / 0.07, 0, 1), zt = -tief + (tief + 0.04) * k;
        for (let i = 0; i < 8; i++) {
          D.flaeche(g, A, seite(DECK_R - 0.1, i, zt, tief, (g2, F) => {
            g2.fillStyle = "rgb(168,166,160)"; g2.fillRect(0, 0, F.w, F.h);
            g2.fillStyle = "rgba(90,88,84,0.35)";
            for (let y = 0.2; y < F.h; y += 0.2) g2.fillRect(0, y, F.w, 0.012);   // Brettabdrücke der Schalung
            for (let x = 0.5; x < F.w; x += 0.5) g2.fillRect(x, 0, 0.01, F.h);
            rausch(g2, 0, 0, F.w, F.h, 0.7, 0.25, 4, 4);
          }));
        }
        D.flaeche(g, A, deckel(DECK_R - 0.1, zt, (g2, F) => { g2.fillStyle = "rgb(178,176,170)"; g2.fillRect(0, 0, F.w, F.h); rausch(g2, 0, 0, F.w, F.h, 0.8, 0.22, 9, 4); }));
      }
      g.restore();
      /* Aushub: Erdhaufen in den Ecken des Bauplatzes (innerhalb des
         Grundrisses, die Nachbarn stehen dicht daneben), im Winter mit Schneehaube */
      if (bau < 0.1) for (const [w, r, h] of [[Math.PI * 1.25, 0.72, 0.5], [Math.PI * 0.75, 0.6, 0.42], [Math.PI * 1.75, 0.56, 0.38]]) {
        const c = [Math.cos(w) * 5.45, Math.sin(w) * 5.45, 0], t = [-Math.sin(w), Math.cos(w), 0], rd = [Math.cos(w), Math.sin(w), 0];
        D.ellipsoid(g, A, add(c, mul(t, r * 0.35)), mul(t, r * 0.8), mul(rd, r * 0.6), [0, 0, h * 0.7], [104, 80, 58], {});
        D.ellipsoid(g, A, c, mul(t, r), mul(rd, r * 0.75), [0, 0, h], [116, 90, 64], {});
        if (winter) D.ellipsoid(g, A, add(c, [0, 0, h * 0.78]), mul(t, r * 0.5), mul(rd, r * 0.36), [0, 0, h * 0.26], [236, 239, 245], {});
      }
    });

    /* ---- Holzpodest ---- */
    dazu(0, 0, [0, 0, 0.09], [0.14, 0.2], (g, A, q) => {
      const z1 = DECK_H * q;
      for (let i = 0; i < 8; i++) D.flaeche(g, A, seite(DECK_R, i, z1, z1, (g2, F) => bretter(g2, F, mix(FARBE.deck, [60, 40, 30], 0.2), false, 0.09, 3)));
      D.flaeche(g, A, deckel(DECK_R, z1, (g2, F) => {
        bretter(g2, F, FARBE.deck, false, 0.14, 5);
        if (winter) {
          /* festgetretener Schnee, am Rand dicker */
          g2.fillStyle = "rgba(236,240,246,0.55)"; g2.fillRect(0, 0, F.w, F.h);
          schneeRand(g2, F, DECK_R, DECK_R - 0.5, 0.9);
        }
      }));
    });

    /* ---- Ausschank: Rückwand mit Regalen ---- */
    dazu(0, 0.5, [0, 0, 1.4], [0.2, 0.3], (g, A, q) => {
      const h = (BLENDE_Z - DECK_H) * q;
      for (let i = 0; i < 8; i++) {
        D.flaeche(g, A, seite(INNEN_R, i, DECK_H + h, h, (g2, F) => {
          bretter(g2, F, [74, 52, 38], true, 0.16, 9 + i);
          if (q < 1) return;
          /* Regale mit Tassen und Flaschen */
          const top = F.h - (1.62 - DECK_H), top2 = F.h - (2.02 - DECK_H);
          for (const yy of [top, top2]) {
            g2.fillStyle = "rgb(120,86,58)"; g2.fillRect(0.05, yy, F.w - 0.1, 0.035);
            if (F.px < 12) continue;
            const rng = ST.zufall(i * 7 + (yy > top2 ? 1 : 2));
            for (let x = 0.12; x < F.w - 0.12; x += 0.13 + rng() * 0.05) {
              const art = rng();
              if (art < 0.65) {
                /* Glühweintasse (Stiefel- oder Bechertasse, bunt) */
                const c = [[176, 30, 36], [236, 232, 222], [30, 70, 130], [40, 100, 60]][Math.floor(rng() * 4)];
                g2.fillStyle = rgbS(c); PI.rundRechteck(g2, x, yy - 0.1, 0.075, 0.1, 0.012); g2.fill();
                g2.strokeStyle = rgbS(c); g2.lineWidth = 0.012; g2.beginPath(); g2.arc(x + 0.085, yy - 0.055, 0.022, -1.3, 1.3); g2.stroke();
              } else {
                const c = [[90, 20, 30], [60, 90, 50], [150, 110, 40]][Math.floor(rng() * 3)];
                g2.fillStyle = rgbS(c); g2.fillRect(x, yy - 0.2, 0.05, 0.2); g2.fillRect(x + 0.017, yy - 0.28, 0.016, 0.08);
                g2.fillStyle = "rgba(240,230,200,0.9)"; g2.fillRect(x + 0.005, yy - 0.13, 0.04, 0.04);
              }
            }
          }
          /* Lichterkette unter der Decke */
          if (F.px > 10) for (let x = 0.15; x < F.w; x += 0.3) { g2.fillStyle = "rgb(255,214,140)"; g2.beginPath(); g2.arc(x, 0.12 + Math.sin(x * 3) * 0.02, 0.02, 0, TAU); g2.fill(); }
        }, { danach: (g2, F) => {
          /* warmes Innenlicht: die Rückwand glüht in der Dämmerung */
          if (F.nacht > 0) { g2.globalCompositeOperation = "lighter"; g2.fillStyle = "rgba(255,160,70," + (0.32 * F.nacht).toFixed(3) + ")"; g2.fillRect(0, 0, F.w, F.h); g2.globalCompositeOperation = "source-over"; }
        } }));
      }
    }, { innen: true });

    /* ---- Tresen ---- */
    dazu(0, 2, [0, 0, 0.6], [0.2, 0.27], (g, A, q) => {
      const h = (THEKE_Z - DECK_H) * q;
      for (let i = 0; i < 8; i++) {
        D.flaeche(g, A, seite(THEKE_R, i, DECK_H + h, h, (g2, F) => {
          bretter(g2, F, [112, 40, 34], true, 0.12, 20 + i);
          if (q < 1) return;
          /* Rahmen mit Füllung */
          g2.strokeStyle = "rgba(60,20,16,0.7)"; g2.lineWidth = 0.035;
          g2.strokeRect(0.14, 0.12, F.w - 0.28, F.h - 0.24);
          g2.strokeStyle = "rgba(230,190,110,0.8)"; g2.lineWidth = 0.014;
          g2.strokeRect(0.19, 0.17, F.w - 0.38, F.h - 0.34);
          if (F.px > 16 && i % 2 === 1) {
            /* Kreidetafel mit Preisen */
            const tx = F.w / 2 - 0.42, ty = 0.2;
            g2.fillStyle = "rgb(36,40,38)"; g2.fillRect(tx, ty, 0.84, 0.5);
            g2.strokeStyle = "rgb(150,110,70)"; g2.lineWidth = 0.03; g2.strokeRect(tx, ty, 0.84, 0.5);
            if (F.px > 40) {
              g2.fillStyle = "rgba(240,240,236,0.92)"; g2.textAlign = "left"; g2.textBaseline = "alphabetic";
              g2.font = "0.075px sans-serif";
              const zeilen = winter ? [["Glühwein", "4,00 €"], ["mit Schuss", "5,50 €"], ["Kinderpunsch", "3,00 €"], ["Pfand Tasse", "3,00 €"]] : [["Kaffee", "2,50 €"], ["Apfelschorle", "3,00 €"], ["Kuchen", "3,50 €"], ["Pfand Tasse", "3,00 €"]];
              zeilen.forEach(([a, b], k) => { g2.fillText(a, tx + 0.06, ty + 0.12 + k * 0.1); g2.textAlign = "right"; g2.fillText(b, tx + 0.78, ty + 0.12 + k * 0.1); g2.textAlign = "left"; });
            }
          }
        }, { ao: true }));
      }
    });

    /* ---- Tresenplatte (Ring, 36 cm tief) ---- */
    dazu(0, 3, [0, 0, PLATTE_Z], [0.26, 0.3], (g, A) => {
      for (let i = 0; i < 8; i++) D.flaeche(g, A, seite(PLATTE_R, i, PLATTE_Z, PLATTE_Z - THEKE_Z, (g2, F) => { g2.fillStyle = "rgb(150,112,74)"; g2.fillRect(0, 0, F.w, F.h); }));
      const um = [], ui = [];
      for (let i = 0; i < 8; i++) { const p = ecke(PLATTE_R, i, 0), q = ecke(PLATTE_IN, i, 0); um.push([p[0] + PLATTE_R, p[1] + PLATTE_R]); ui.push([q[0] + PLATTE_R, q[1] + PLATTE_R]); }
      D.flaeche(g, A, {
        name: "tresenring", o: [-PLATTE_R, -PLATTE_R, PLATTE_Z], u: [1, 0, 0], v: [0, 1, 0], w: 2 * PLATTE_R, h: 2 * PLATTE_R, umriss: um,
        malen: (g2, F) => {
          /* nur der Ring: Innenachteck wird ausgespart (Pfad mit Loch) */
          g2.beginPath(); g2.moveTo(um[0][0], um[0][1]); for (const p of um) g2.lineTo(p[0], p[1]); g2.closePath();
          g2.moveTo(ui[0][0], ui[0][1]); for (let i = 7; i >= 0; i--) g2.lineTo(ui[i][0], ui[i][1]); g2.closePath();
          g2.clip("evenodd");
          bretter(g2, F, [168, 128, 86], false, 0.2, 33);
          const lf = F.A.lf(F.n);
          g2.globalCompositeOperation = "multiply";
          g2.fillStyle = "rgb(" + Math.round(Math.min(1, lf[0]) * 255) + "," + Math.round(Math.min(1, lf[1]) * 255) + "," + Math.round(Math.min(1, lf[2]) * 255) + ")";
          g2.fillRect(0, 0, F.w, F.h);
          g2.globalCompositeOperation = "source-over";
        },
        keinLicht: true, danach: null
      });
      /* Licht selbst: der Ring ist ausgeschnitten, das Licht darf das Innere nicht färben */
    }, { ringLicht: true });

    /* ---- Innen: Arbeitstisch mit Glühweintöpfen, Verkäuferinnen ---- */
    dazu(0, 1, [0, 0, 1.0], [0.28, 0.3], (g, A) => {
      const Rt = INNEN_R + 0.28, zt = 0.95;
      for (let i = 0; i < 8; i++) D.flaeche(g, A, seite(Rt, i, zt, zt - DECK_H, (g2, F) => bretter(g2, F, [80, 56, 40], true, 0.14, 12)));
      const um = [], ui = [];
      for (let i = 0; i < 8; i++) { const p = ecke(Rt, i, 0), q = ecke(INNEN_R, i, 0); um.push([p[0] + Rt, p[1] + Rt]); ui.push([q[0] + Rt, q[1] + Rt]); }
      D.flaeche(g, A, { name: "tisch", o: [-Rt, -Rt, zt], u: [1, 0, 0], v: [0, 1, 0], w: 2 * Rt, h: 2 * Rt, umriss: um, malen: (g2, F) => { g2.fillStyle = "rgb(120,92,66)"; g2.fillRect(0, 0, F.w, F.h); } });
      for (let i = 0; i < 8; i++) {
        const n = nach(i), t = [Math.sin(mitteW(i)), -Math.cos(mitteW(i)), 0];
        const p = add(mul(n, INNEN_R + 0.17), mul(t, i % 2 ? 0.45 : -0.4));
        if (i % 2 === 0) {
          /* großer Glühweintopf (Emaille, dunkelrot) mit Kelle */
          D.stumpf(g, A, [p[0], p[1], zt], [p[0], p[1], zt + 0.34], 0.2, 0.21, [120, 26, 30], { glanz: 0.6, deckel: [70, 18, 20] });
          D.ring(g, A, [p[0], p[1], zt + 0.34], 0.2, 0.02, [60, 56, 54], null);
          D.strich(g, A, [[p[0], p[1], zt + 0.3], [p[0] + t[0] * 0.25, p[1] + t[1] * 0.25, zt + 0.55]], 0.02, [150, 150, 156], {});
        } else {
          /* Tassenturm */
          for (let k = 0; k < 3; k++) D.stumpf(g, A, [p[0], p[1], zt + k * 0.09], [p[0], p[1], zt + k * 0.09 + 0.1], 0.045, 0.05, [[176, 30, 36], [236, 232, 222], [30, 70, 130]][k], { glanz: 0.5 });
        }
      }
    }, { innen: true });
    for (const [w, art] of [[0.42, 0], [Math.PI + 0.9, 1], [Math.PI / 2 + 0.2, 2], [-Math.PI / 2 + 0.5, 1]]) {
      const r = 2.92, p = [r * Math.cos(w), r * Math.sin(w), DECK_H];
      dazu(0, 1.5, add(p, [0, 0, 0.9]), [0.96, 1], (g, A) => D.figurZeichnen(g, A, verkaeufer(art, winter), { p: p, phi: w - Math.PI / 2, k: 1 }), { innen: true });
    }
    /* ---- Tassen auf dem Tresen, Eckpfosten ---- */
    for (let i = 0; i < 8; i++) {
      const p = ecke(THEKE_R - 0.06, i, PLATTE_Z);
      dazu(0, 4, [p[0], p[1], 1.7], [0.24, 0.3], (g, A, q) => saeulePfosten(g, A, p[0], p[1], PLATTE_Z, OFFEN_Z - PLATTE_Z, q));
      const n = nach(i), t = [Math.sin(mitteW(i)), -Math.cos(mitteW(i)), 0];
      for (let k = 0; k < 3; k++) {
        const pos = add(mul(n, 3.18), mul(t, -0.7 + k * 0.6 + (i % 3) * 0.1));
        dazu(0, 4, [pos[0], pos[1], PLATTE_Z + 0.06], [0.96, 1], (g, A) => tasse(g, A, pos[0], pos[1], PLATTE_Z, (i + k) % 4));
      }
    }

    /* ---- Blende mit Schild ---- */
    dazu(0, 5, [0, 0, 2.5], [0.3, 0.34], (g, A) => {
      for (let i = 0; i < 8; i++) {
        D.flaeche(g, A, seite(BLENDE_R, i, BLENDE_Z, BLENDE_Z - OFFEN_Z, (g2, F) => {
          g2.fillStyle = rgbS(FARBE.rot); g2.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
          rausch(g2, 0, 0, F.w, F.h, 1.2, 0.16, 40 + i, 3);
          g2.fillStyle = rgbS(FARBE.gold); g2.fillRect(0, 0.03, F.w, 0.02); g2.fillRect(0, F.h - 0.05, F.w, 0.02);
          if (F.px < 9) return;
          if (i % 2 === 0) {
            g2.fillStyle = rgbS([246, 214, 120]); g2.textAlign = "center"; g2.textBaseline = "middle";
            g2.font = "italic bold 0.24px Georgia, serif";
            g2.fillText(winter ? "Glühwein" : "Kaffee & Kuchen", F.w / 2, F.h / 2 + 0.01);
          } else if (!winter) {
            /* Frühling: blühender Kirschzweig statt Stern und Tanne */
            bluetenZweig(g2, F.w / 2, F.h / 2, 0.75, F.px);
          } else {
            /* Stern mit Tannenzweigen */
            const cx = F.w / 2, cy = F.h / 2;
            g2.strokeStyle = "rgb(40,90,50)"; g2.lineWidth = 0.035;
            for (const sx of [-1, 1]) { g2.beginPath(); g2.moveTo(cx + sx * 0.12, cy); g2.quadraticCurveTo(cx + sx * 0.4, cy - 0.08, cx + sx * 0.75, cy + 0.02); g2.stroke(); }
            g2.fillStyle = rgbS([246, 214, 120]);
            g2.beginPath();
            for (let k = 0; k < 10; k++) { const r = k % 2 ? 0.06 : 0.15, w = -Math.PI / 2 + k * Math.PI / 5; g2.lineTo(cx + Math.cos(w) * r, cy + Math.sin(w) * r); }
            g2.closePath(); g2.fill();
          }
        }));
      }
    });

    /* ---- Girlande mit Lichtern an der Blende ---- */
    dazu(0, 6, [0, 0, 2.3], [0.97, 1], (g, A) => {
      for (let i = 0; i < 8; i++) {
        if (A.zumAuge(nach(i)) < 0.05) continue;
        const a = ecke(BLENDE_R + 0.06, i, OFFEN_Z + 0.02), b = ecke(BLENDE_R + 0.06, i + 1, OFFEN_Z + 0.02);
        girlande(g, A, a, b, 0.2, winter, i);
      }
    });

    /* ---- Dach des Ausschanks ----
       Tragwerk zuerst: Deckenbalken von der Rückwand zur Blende, darauf
       Stiele bis zum Rähm (Ringbalken), auf dem die Sparren liegen – kein
       Balken hängt in der Luft. Dann Holzschindeln Reihe für Reihe von der
       Traufe zum First (so decken Dachdecker), im Winter eine Schneedecke
       mit Wehen und ein gerundeter Schneewulst an der Traufe. */
    dazu(0, 7, [0, 0, 3.0], [0.3, 0.42], (g, A, q, bau) => {
      const k = klemm((bau - 0.34) / 0.08, 0, 1);
      if (k < 1) {
        const holz = [146, 110, 74];
        for (let i = 0; i < 8; i++) {
          const w = ACHT[i];
          D.strich(g, A, [[INNEN_R * Math.cos(w), INNEN_R * Math.sin(w), BLENDE_Z], [BLENDE_R * Math.cos(w), BLENDE_R * Math.sin(w), BLENDE_Z]], 0.12, holz, {});
          const st = ecke(FIRST_R - 0.04, i, 0);
          D.strich(g, A, [[st[0], st[1], BLENDE_Z + 0.04], [st[0], st[1], FIRST_Z - 0.05]], 0.1, holz, {});
        }
        const ring = []; for (let i = 0; i <= 8; i++) ring.push(ecke(FIRST_R - 0.04, i, FIRST_Z - 0.06));
        D.strich(g, A, ring, 0.12, [132, 98, 64], {});
      }
      for (let i = 0; i < 8; i++) {
        const m = mitteW(i), n = [Math.cos(m), Math.sin(m), 0], u = [Math.sin(m), -Math.cos(m), 0];
        const apT = FIRST_R * Math.cos(Math.PI / 8), apB = TRAUFE_R * Math.cos(Math.PI / 8);
        const top = [n[0] * apT, n[1] * apT, FIRST_Z], bot = [n[0] * apB, n[1] * apB, TRAUFE_Z];
        const sv = sub(bot, top), Ls = Math.hypot(sv[0], sv[1], sv[2]), v = mul(sv, 1 / Ls);
        const lt = KANTE * FIRST_R, lb = KANTE * TRAUFE_R;
        const o0 = sub(top, mul(u, lt / 2));
        /* Sparren (offener Dachstuhl), liegen oben auf dem Rähm */
        if (k < 1) {
          D.strich(g, A, [ecke(FIRST_R - 0.04, i, FIRST_Z - 0.02), ecke(TRAUFE_R, i, TRAUFE_Z)], 0.1, [150, 116, 80], {});
          D.strich(g, A, [add(top, [0, 0, -0.05]), add(bot, [0, 0, -0.05])], 0.08, [150, 116, 80], {});
        }
        if (k <= 0) continue;
        const y0 = Ls * (1 - k), xl = (lt - lb) / 2 * (y0 / Ls);
        D.flaeche(g, A, {
          name: "dach" + i, o: o0, u: u, v: v, w: lt, h: Ls, umriss: [[xl, y0], [lt - xl, y0], [(lt + lb) / 2, Ls], [(lt - lb) / 2, Ls]],
          feld: [(lt - lb) / 2, 0, (lt + lb) / 2, Ls],
          malen: (g2, F) => {
            schindeln(g2, F, lt, lb, Ls);
            if (winter && k >= 1) D.schneeDecke(g2, F, (lt - lb) / 2, 0.02, lb, Ls - 0.02, { saat: 60 + i, loecher: 3, rand: 0.06 });
          }
        });
        /* Traufbrett */
        const eL = ecke(TRAUFE_R, i + 1, TRAUFE_Z), eR = ecke(TRAUFE_R, i, TRAUFE_Z);
        D.flaeche(g, A, { name: "tr" + i, o: eL, u: u, v: [0, 0, -1], w: lb, h: 0.07, malen: [70, 50, 36], n: n });
        if (winter && k >= 1) {
          if (A.zumAuge(n) > -0.15 && !A.silhouette) {
            const pts = []; for (let q = 0; q <= 6; q++) pts.push(add(add(mul(eL, 1 - q / 6), mul(eR, q / 6)), [0, 0, 0.02]));
            D.schneeWulst(g, A, pts, n, 0.1, { saat: 70 + i });
          }
          D.flaeche(g, A, {
            name: "eis" + i, o: add(eL, [0, 0, -0.06]), u: u, v: [0, 0, -1], w: lb, h: 0.3, n: n, keinLicht: true,
            malen: (g2, F) => eiszapfen(g2, F, 90 + i)
          });
        }
      }
    });

    /* ---- Stockwerke ---- */
    for (let e = 1; e <= NE; e++) {
      const S = EB[e];
      const b0 = 0.42 + (e - 1) * 0.075;
      /* Rahmen (Achteck): Naturholz mit Schnitzfries, oben Dielen, Schnee nur als Wehe */
      dazu(e, 0, [0, 0, S.z + RH / 2], [b0, b0 + 0.02], (g, A) => {
        for (let i = 0; i < 8; i++) D.flaeche(g, A, seite(S.R, i, S.z + RH, RH, randMalen));
        D.flaeche(g, A, deckel(S.R, S.z + RH, (g2, F) => {
          bretter(g2, F, FARBE.rahmen, false, 0.16, 70 + e);
          g2.strokeStyle = rgbS(FARBE.gold); g2.lineWidth = 0.025;
          g2.beginPath(); for (let i = 0; i < 8; i++) { const p = ecke(S.R - 0.07, i, 0); if (i) g2.lineTo(p[0] + S.R, p[1] + S.R); else g2.moveTo(p[0] + S.R, p[1] + S.R); } g2.closePath(); g2.stroke();
          if (winter) schneeRand(g2, F, S.R, e < NE ? EB[e + 1].R + 0.02 : 0, 0.72);
        }));
        /* Lichterkette unter der Rahmenkante */
        if (e < NE) for (let i = 0; i < 8; i++) {
          if (A.zumAuge(nach(i)) < 0.02) continue;
          const a = ecke(S.R + 0.02, i, S.z + 0.01), b = ecke(S.R + 0.02, i + 1, S.z + 0.01);
          for (let k = 1; k < 6; k++) D.birne(g, A, add(mul(a, 1 - k / 6), mul(b, k / 6)), 0.028, "255,214,140", A.nacht);
        }
      }, { warm: 0.22 });
      if (e === NE) {
        /* Krone: gedrechselter Aufsatz, der das Flügelrad trägt */
        dazu(NE, 1, [0, 0, KRONE_Z + 0.25], [0.83, 0.85], (g, A) => krone(g, A, winter), { warm: 0.2 });
        continue;
      }
      const N = EB[e + 1];
      const hoch = N.z - (S.z + RH);
      /* Drehteller: Holzscheibe mit Schnee- bzw. Moosboden */
      dazu(e, 1, [0, 0, S.z + RH + 0.03], [0.88, 0.9], (g, A) => {
        D.stumpf(g, A, [0, 0, S.z + RH], [0, 0, S.z + RH + 0.06], S.p, S.p, FARBE.rahmen, { deckel: false, ringe: [{ k: 0.5, b: 0.025, farbe: FARBE.rot }] });
        /* das Stockwerk darüber beschattet den Teller zum großen Teil */
        const sk = A.sk; A.sk = 0.45;
        tellerBoden(g, A, S.z + RH + 0.061, S.p, winter, 30 + e);
        A.sk = sk;
      }, { warm: 0.55 });
      /* Säulen, Kerzen, Behang */
      for (let i = 0; i < 8; i++) {
        const w = ACHT[i], cx = S.c * Math.cos(w), cy = S.c * Math.sin(w);
        const rb = 0.045 + 0.01 * (NE - 1 - e);
        dazu(e, 2, [cx, cy, S.z + RH + hoch / 2], [b0 + 0.01, b0 + 0.07], (g, A, q) => saeule(g, A, cx, cy, S.z + RH, hoch, rb, q), { art: "saeule", warm: 0.75, bb: [cx - rb * 2, cy - rb * 2, S.z + RH, cx + rb * 2, cy + rb * 2, N.z] });
        const kR = (S.c + S.R) / 2 + 0.02, kx = kR * Math.cos(w), ky = kR * Math.sin(w), kh = 0.3 + 0.04 * (NE - 1 - e);
        dazu(e, 2, [kx, ky, S.z + RH + 0.3], [0.96, 1], (g, A, q, bau, zeit, ohneFlamme) => kerze(g, A, kx, ky, S.z + RH, kh, zeit, ohneFlamme), { art: "kerze", warm: 0.9, bb: [kx - 0.12, ky - 0.12, S.z + RH, kx + 0.12, ky + 0.12, S.z + RH + kh + 0.2], licht: [kx, ky, S.z + RH + kh + 0.08] });
        const mw = mitteW(i), Rb = N.R * 0.985, hb = 0.22;
        const bm = [Rb * Math.cos(Math.PI / 8) * Math.cos(mw), Rb * Math.cos(Math.PI / 8) * Math.sin(mw), N.z - hb / 2];
        dazu(e, 2, bm, [b0 + 0.07, b0 + 0.08], (g, A) => {
          D.flaeche(g, A, seite(Rb, i, N.z, hb, behangMalen, { keinLicht: true, beidseitig: true, auf: 0 }));
          if (!winter) osterEi(g, A, [bm[0], bm[1]], N.z - hb, (i * 3 + e) % 6);
        }, { art: "behang", warm: 0.4, bb: [bm[0] - 1.2, bm[1] - 1.2, N.z - hb - 0.3, bm[0] + 1.2, bm[1] + 1.2, N.z] });
      }
      /* Welle (Mittelachse) */
      dazu(e, 2, [0, 0, S.z + RH + hoch / 2], [b0, b0 + 0.02], (g, A) => welle(g, A, S.z + RH + 0.06, N.z), { art: "welle", warm: 0.5, bb: [-0.12, -0.12, S.z + RH, 0.12, 0.12, N.z] });
    }
    return L;
  }

  /* Frühling: bemaltes Osterei an einem Faden unter dem Behang */
  const EIER = [[236, 120, 140], [120, 170, 220], [240, 210, 90], [150, 200, 120], [200, 150, 220], [240, 160, 90]];
  function osterEi(g, A, xy, z, art) {
    const oben = [xy[0], xy[1], z + 0.01], ei = [xy[0], xy[1], z - 0.2];
    D.strich(g, A, [oben, add(ei, [0, 0, 0.05])], 0.006, [230, 226, 210], {});
    D.ellipsoid(g, A, ei, [0.035, 0, 0], [0, 0.035, 0], [0, 0, 0.05], EIER[art], { glanz: 0.35 });
    if (A.s > 40 && !A.silhouette) {
      D.ring(g, A, ei, 0.036, 0.01, EIER[(art + 2) % 6], null);
      D.ring(g, A, add(ei, [0, 0, 0.022]), 0.03, 0.007, [250, 248, 240], null);
    }
  }
  /* Blühender Kirschzweig (Blende und Flügel im Frühling) */
  function bluetenZweig(g, cx, cy, laenge, px) {
    g.strokeStyle = "rgb(96,64,44)"; g.lineWidth = 0.035; g.lineCap = "round";
    g.beginPath(); g.moveTo(cx - laenge / 2, cy + 0.06); g.quadraticCurveTo(cx, cy - 0.08, cx + laenge / 2, cy + 0.02); g.stroke();
    g.lineWidth = 0.02;
    g.beginPath(); g.moveTo(cx - 0.1, cy - 0.01); g.quadraticCurveTo(cx - 0.02, cy - 0.12, cx + 0.06, cy - 0.14); g.stroke();
    if (px < 8) return;
    const bl = [[-0.3, 0.02], [-0.16, -0.04], [0.02, -0.06], [0.06, -0.14], [0.2, -0.03], [0.32, 0.0], [-0.06, 0.02]];
    bl.forEach(([dx, dy], i) => {
      g.fillStyle = i % 3 === 1 ? "rgb(250,244,246)" : "rgb(240,178,196)";
      for (let k = 0; k < 5; k++) { const a = k / 5 * TAU; g.beginPath(); g.arc(cx + dx + Math.cos(a) * 0.028, cy + dy + Math.sin(a) * 0.028, 0.022, 0, TAU); g.fill(); }
      g.fillStyle = "rgb(236,196,90)"; g.beginPath(); g.arc(cx + dx, cy + dy, 0.014, 0, TAU); g.fill();
    });
    g.fillStyle = "rgb(110,160,80)";
    for (const [dx, dy] of [[-0.23, 0.05], [0.12, -0.08], [0.27, 0.04]]) { g.beginPath(); g.ellipse(cx + dx, cy + dy, 0.035, 0.014, 0.5, 0, TAU); g.fill(); }
  }


  /* Eiszapfen an der Traufe: wenige, dünn und durchscheinend (nicht wie
     Wimpel), dazwischen nur kurze Tropfnasen */
  function eiszapfen(g, F, saat) {
    const rng = ST.zufall(saat), A = F.A;
    const hell = A.farbeK([236, 244, 252], F.n), mitte = A.farbeK([200, 220, 240], F.n);
    let x = 0.08 + rng() * 0.2;
    while (x < F.w - 0.05) {
      const l = rng() < 0.3 ? 0.14 + rng() * 0.12 : 0.03 + rng() * 0.05, b = 0.012 + l * 0.08;
      const gr = g.createLinearGradient(x - b, 0, x + b, 0);
      gr.addColorStop(0, mitte.replace("rgb", "rgba").replace(")", ",0.55)"));
      gr.addColorStop(0.4, hell.replace("rgb", "rgba").replace(")", ",0.85)"));
      gr.addColorStop(1, mitte.replace("rgb", "rgba").replace(")", ",0.35)"));
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(x - b, 0); g.quadraticCurveTo(x - b * 0.3, l * 0.6, x, l); g.quadraticCurveTo(x + b * 0.3, l * 0.6, x + b, 0); g.closePath(); g.fill();
      x += 0.12 + rng() * 0.3;
    }
  }

  /* Verkäuferinnen und Verkäufer im Ausschank */
  const VERK = {};
  function verkaeufer(art, winter) {
    const schl = art + (winter ? "w" : "f");
    if (VERK[schl]) return VERK[schl];
    const M = FW.mensch;
    const liste = [
      { arme: "tasse", gewand: [150, 36, 40], mantel: null, schuerze: [236, 230, 214], kopf: winter ? "zipfelmuetze" : "tuch", kopfFarbe: winter ? [176, 28, 34] : [120, 150, 190], haar: [150, 100, 60], haut: FW.HAUT[0] },
      { arme: "haengen", gewand: [60, 84, 70], schuerze: [236, 230, 214], kopf: winter ? "strickmuetze" : null, kopfFarbe: [70, 90, 130], haar: [60, 44, 34], bart: [70, 50, 36], haut: FW.HAUT[1] },
      { arme: "tasse", gewand: [110, 60, 90], schuerze: [236, 230, 214], kopf: winter ? "zipfelmuetze" : null, kopfFarbe: [176, 28, 34], haar: [214, 180, 110], haut: FW.HAUT[0] }
    ];
    return (VERK[schl] = M(liste[art]));
  }

  /* Eckpfosten des Ausschanks: gedrechselt, rot und gold */
  function saeulePfosten(g, A, x, y, z0, h, q) {
    const hh = h * q;
    D.stumpf(g, A, [x, y, z0], [x, y, z0 + Math.min(hh, 0.08)], 0.085, 0.085, FARBE.gold, { glanz: 0.8 });
    if (hh > 0.08) D.stumpf(g, A, [x, y, z0 + 0.08], [x, y, z0 + hh], 0.06, 0.055, FARBE.rot, { glanz: 0.3 });
    if (q >= 1) {
      D.stumpf(g, A, [x, y, z0 + h * 0.5 - 0.03], [x, y, z0 + h * 0.5 + 0.03], 0.075, 0.075, FARBE.gold, { glanz: 0.8 });
      D.stumpf(g, A, [x, y, z0 + h - 0.08], [x, y, z0 + h], 0.07, 0.09, FARBE.gold, { glanz: 0.8 });
    }
  }
  function tasse(g, A, x, y, z, art) {
    const c = [[176, 30, 36], [236, 232, 222], [30, 70, 130], [40, 100, 60]][art];
    D.stumpf(g, A, [x, y, z], [x, y, z + 0.1], 0.038, 0.042, c, { glanz: 0.6, deckel: [90, 20, 24] });
  }
  function welle(g, A, z0, z1) {
    D.stumpf(g, A, [0, 0, z0], [0, 0, z1], 0.07, 0.07, FARBE.elfenbein, { glanz: 0.3, deckel: false });
    for (let z = z0 + 0.25; z < z1 - 0.1; z += 0.35) D.stumpf(g, A, [0, 0, z], [0, 0, z + 0.05], 0.085, 0.085, FARBE.gold, { glanz: 0.9 });
  }
  function krone(g, A, winter) {
    const z = KRONE_Z;
    const prof = [[0, 0.62, FARBE.rot], [0.1, 0.62, FARBE.gold], [0.14, 0.5, FARBE.gold], [0.2, 0.44, FARBE.elfenbein], [0.34, 0.3, FARBE.elfenbein], [0.4, 0.26, FARBE.gold], [0.46, 0.2, FARBE.rot], [0.52, 0.12, FARBE.gold], [0.6, 0.1, FARBE.gold]];
    for (let i = 0; i < prof.length - 1; i++) {
      const a = prof[i], b = prof[i + 1];
      D.stumpf(g, A, [0, 0, z + a[0]], [0, 0, z + b[0]], a[1], b[1], a[2], { glanz: a[2] === FARBE.gold ? 0.9 : 0.3, deckel: winter && i === 0 ? FARBE.schnee : a[2] });
    }
    /* Welle hinauf zur Nabe */
    D.stumpf(g, A, [0, 0, z + 0.6], [0, 0, NABE_Z - 0.1], 0.06, 0.06, FARBE.elfenbein, { glanz: 0.4 });
  }
  /* Holzschindeln Reihe für Reihe (Trapez: oben lt, unten lb breit) */
  function schindeln(g, F, lt, lb, Ls) {
    const rng = F.rng, x0 = (lt - lb) / 2;
    g.fillStyle = "rgb(60,48,40)"; g.fillRect(x0 - 0.1, -0.1, lb + 0.2, Ls + 0.2);
    const reihe = 0.13, sb = 0.11;
    if (F.px * reihe < 2.5) { g.fillStyle = rgbS(FARBE.schindel); g.fillRect(x0, 0, lb, Ls); rausch(g, x0, 0, lb, Ls, 1.5, 0.25, 3, 3); return; }
    let r = 0;
    for (let y = -reihe; y < Ls; y += reihe, r++) {
      for (let x = x0 - (r % 2) * sb / 2; x < x0 + lb; x += sb * (0.8 + rng() * 0.4)) {
        const c = PI.streu(FARBE.schindel, rng, 0.14);
        const w = sb * (0.75 + rng() * 0.3);
        g.fillStyle = "rgba(20,14,10,0.4)"; g.fillRect(x + 0.01, y + reihe * 0.9, w, reihe * 0.35);
        g.fillStyle = rgbS(c); g.fillRect(x, y, w - 0.008, reihe * 1.25);
        if (F.px > 40) { g.fillStyle = "rgba(255,255,255,0.08)"; g.fillRect(x, y + reihe * 1.1, w - 0.008, reihe * 0.12); }
      }
    }
    rausch(g, x0, 0, lb, Ls, 1.6, 0.22, 11, 4);
  }
  /* Tannengirlande in Bögen mit Lichtern */
  function girlande(g, A, a, b, durchhang, winter, saat) {
    const n = 14, pts = [];
    for (let k = 0; k <= n; k++) {
      const t = k / n, p = add(mul(a, 1 - t), mul(b, t));
      pts.push(add(p, [0, 0, -durchhang * 4 * t * (1 - t)]));
    }
    /* Winter: Tannengirlande mit Kugeln; Frühling: Buchsbaum mit bemalten Eiern
       (wie an den fränkischen Osterbrunnen) */
    D.strich(g, A, pts, 0.11, winter ? [30, 62, 38] : [58, 98, 44], {});
    if (A.s > 25 && !A.silhouette) {
      const rng = ST.zufall(saat * 13 + 5);
      g.lineWidth = Math.max(0.5, A.s * 0.012);
      for (let k = 0; k < n * 6; k++) {
        const t = rng(), i = Math.min(n - 1, Math.floor(t * n)), f = t * n - i;
        const p = add(mul(pts[i], 1 - f), mul(pts[i + 1], f));
        const q = A.bild(p), w = rng() * TAU, l = A.s * (0.04 + rng() * 0.05);
        g.strokeStyle = A.farbeK(winter ? (rng() < 0.5 ? [50, 96, 56] : [26, 56, 34]) : (rng() < 0.5 ? [86, 130, 60] : [52, 92, 40]), [0.3, 0.3, 0.9]);
        g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(q[0] + Math.cos(w) * l, q[1] + Math.sin(w) * l * 0.7); g.stroke();
      }
      if (winter) for (let k = 1; k < n; k += 2) { const q = A.bild(add(pts[k], [0, 0, 0.04])); g.fillStyle = A.farbeK([248, 250, 255], [0, 0, 1]); g.beginPath(); g.ellipse(q[0], q[1], A.s * 0.06, A.s * 0.02, 0, 0, TAU); g.fill(); }
    }
    for (let k = 1; k < n; k += 2) D.birne(g, A, add(pts[k], [0, 0, -0.05]), 0.03, "255,210,130", A.nacht);
    if (!A.silhouette) {
      if (winter) for (let k = 3; k < n; k += 4) D.ellipsoid(g, A, add(pts[k], [0, 0, -0.1]), [0.045, 0, 0], [0, 0.045, 0], [0, 0, 0.045], saat % 2 ? [190, 30, 40] : [214, 170, 76], { glanz: 1 });
      else {
        const EIER = [[236, 120, 140], [120, 170, 220], [240, 210, 90], [150, 200, 120], [200, 150, 220], [240, 160, 90]];
        for (let k = 2; k < n; k += 2) D.ellipsoid(g, A, add(pts[k], [0, 0, -0.1]), [0.035, 0, 0], [0, 0.035, 0], [0, 0, 0.05], EIER[(k + saat) % EIER.length], { glanz: 0.6 });
      }
    }
  }

  /* =====================================================================
     FLÜGELRAD — dreht sich (Warmluft … hier: mit Motor, aber genauso
     langsam und gleichmäßig wie bei den großen Marktpyramiden)
     Die Bemalung eines Flügels (Holz, Maserung, Motiv) wird EINMAL je
     Detailstufe als Bild gemalt und dann nur noch verzerrt aufgelegt –
     das Rad dreht sich jedes Bild, die Pinselarbeit nicht.
     ===================================================================== */
  const BLATT = {};
  function blattTextur(w, h, px, winter) {
    const stufe = px < 12 ? 12 : px < 24 ? 24 : px < 48 ? 48 : px < 96 ? 96 : 160;
    const schl = stufe + (winter ? "w" : "f") + w.toFixed(2);
    if (BLATT[schl]) return BLATT[schl];
    const c = document.createElement("canvas");
    c.width = Math.max(2, Math.ceil(w * stufe)); c.height = Math.max(2, Math.ceil(h * stufe));
    const g = c.getContext("2d", { willReadFrequently: true });
    g.scale(stufe, stufe);
    const gr = g.createLinearGradient(0, 0, w, 0);
    gr.addColorStop(0, "rgb(190,150,100)"); gr.addColorStop(1, "rgb(212,176,124)");
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    if (stufe >= 24) {
      /* Maserung längs des Brettes */
      g.strokeStyle = "rgba(110,72,40,0.25)"; g.lineWidth = 0.8 / stufe;
      const rng = ST.zufall(33);
      g.beginPath(); for (let y = 0.03; y < h; y += 0.04 + rng() * 0.03) { g.moveTo(0, y); g.bezierCurveTo(w * 0.3, y + 0.02, w * 0.6, y - 0.02, w, y + (rng() - 0.5) * 0.03); } g.stroke();
      rausch(g, 0, 0, w, h, 0.8, 0.2, 17, 3);
    }
    const cx = w * 0.72, cy = h / 2, R = h * 0.28;
    if (winter) {
      /* goldener Stern und Tannenzweig */
      g.fillStyle = rgbS([232, 190, 90]);
      g.beginPath(); for (let k = 0; k < 16; k++) { const r = k % 2 ? R * 0.42 : R, a = k * Math.PI / 8; g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } g.closePath(); g.fill();
      g.strokeStyle = rgbS([40, 80, 50]); g.lineWidth = 0.03; g.lineCap = "round";
      g.beginPath(); g.moveTo(w * 0.12, cy); g.lineTo(cx - R * 1.1, cy); g.stroke();
      for (let x = w * 0.18; x < cx - R; x += 0.14) { g.beginPath(); g.moveTo(x, cy); g.lineTo(x + 0.08, cy - 0.09); g.moveTo(x, cy); g.lineTo(x + 0.08, cy + 0.09); g.stroke(); }
      /* Reif an der oberen Kante (ein drehendes Rad trägt keinen Schnee) */
      const rf = g.createLinearGradient(0, 0, 0, h * 0.2);
      rf.addColorStop(0, "rgba(246,250,255,0.32)"); rf.addColorStop(1, "rgba(246,250,255,0)");
      g.fillStyle = rf; g.fillRect(0, 0, w, h * 0.2);
    } else {
      /* Frühling: bemaltes Osterei und Kirschzweig */
      bluetenZweig(g, w * 0.4, cy, w * 0.5, stufe);
      g.fillStyle = rgbS([236, 120, 140]); g.beginPath(); g.ellipse(cx + 0.12, cy, R * 0.62, R * 0.85, Math.PI / 2, 0, TAU); g.fill();
      g.fillStyle = rgbS([250, 240, 200]); g.fillRect(cx + 0.12 - R * 0.85, cy - 0.03, R * 1.7, 0.06);
    }
    return (BLATT[schl] = c);
  }
  function flugelMalen(g, F) {
    g.drawImage(blattTextur(F.w, F.h, F.px, F.jahr === "winter"), 0, 0, F.w, F.h);
    /* roter Rand */
    g.strokeStyle = rgbS(FARBE.rot); g.lineWidth = 0.05;
    g.beginPath(); for (const p of F.flaeche.umriss) g.lineTo(p[0], p[1]); g.closePath(); g.stroke();
  }
  function rad(g, A, phi, winter, q) {
    const n = 8, r0 = 0.5, r1 = RAD_R, z = NABE_Z;
    const teile = [];
    const zahl = q == null ? n : Math.floor(n * q + 0.001);
    for (let i = 0; i < zahl; i++) {
      const b = phi + i * TAU / n, a = [Math.cos(b), Math.sin(b), 0], quer = [-Math.sin(b), Math.cos(b), 0];
      const cs = Math.cos(RAD_STEIG), sn = Math.sin(RAD_STEIG);
      const bq = [quer[0] * cs, quer[1] * cs, sn];              // Blattquerrichtung (angestellt)
      const L = r1 - r0, w0 = 0.34, w1 = 0.9;
      const o = add(add(mul(a, r0), [0, 0, z]), mul(bq, w1 / 2));
      const um = [[0, (w1 - w0) / 2], [L - 0.35, 0], [L - 0.12, 0.05], [L, w1 * 0.3], [L, w1 * 0.7], [L - 0.12, w1 - 0.05], [L - 0.35, w1], [0, (w1 + w0) / 2]];
      const mitte = add(mul(a, (r0 + r1) / 2), [0, 0, z]);
      teile.push({ z: A.tief(mitte), fn: () => {
        D.strich(g, A, [add(mul(a, 0.2), [0, 0, z]), add(mul(a, r0 + 0.3), [0, 0, z])], 0.05, FARBE.holzDunkel, {});
        D.flaeche(g, A, { name: "blatt" + i, o: o, u: a, v: mul(bq, -1), w: L, h: w1, umriss: um, malen: flugelMalen, beidseitig: true });
      } });
    }
    teile.push({ z: A.tief([0, 0, z]), fn: () => {
      D.stumpf(g, A, [0, 0, z - 0.14], [0, 0, z + 0.1], 0.3, 0.3, FARBE.rot, { glanz: 0.4, deckel: FARBE.gold });
      D.stumpf(g, A, [0, 0, z + 0.1], [0, 0, z + 0.2], 0.24, 0.12, FARBE.gold, { glanz: 0.9 });
      D.stumpf(g, A, [0, 0, z + 0.2], [0, 0, z + 0.48], 0.05, 0.035, FARBE.elfenbein, { glanz: 0.4 });
      D.ellipsoid(g, A, [0, 0, z + 0.55], [0.1, 0, 0], [0, 0.1, 0], [0, 0, 0.1], FARBE.gold, { glanz: 1 });
      D.stumpf(g, A, [0, 0, z + 0.62], [0, 0, z + 0.9], 0.03, 0.004, FARBE.gold, { glanz: 1, deckel: false });
    } });
    teile.sort((x, y) => x.z - y.z);
    for (const t of teile) t.fn();
  }

  /* =====================================================================
     MODELL
     ===================================================================== */
  ST.modell("pyramide", {
    name: "Weihnachtspyramide", gruppe: "Weihnachten", grund: [9.2, 9.2], hoehe: 13.0, bauzeit: 5 * 60,
    bauen(M, o) {
      const bau = o.bau == null ? 1 : o.bau;
      const liste = stueckliste(o);
      /* In der Stadt (o.objekt) drehen sich Teller und Flügelrad: sie werden
         jedes Bild neu gemalt (M.lebendig). In der Übersicht (unter etwa
         12 Bildpunkten je Meter) stehen die Teller still im Sprite – die
         Drehung sähe dort niemand –, nur das Flügelrad dreht sich weiter.
         Im Vorschaubild der Bauleiste steht alles still. */
      const lebend = !!o.objekt && bau >= 1;
      const zustand = { gier: 0 };
      const LIVE = { bereit: false };
      M.teil("pyramide", { mitte: [0, 0, 2] });
      M.figur({
        x: 0, y: 0, z: 0, breite: 0.1, hoehe: 0.1, schatten: true,
        malen(g, s, F) {
          if (!F.schatten) zustand.gier = F.gier || 0;
          const A = new D.Ansicht({ s: s, gier: zustand.gier, Z: F.Z, jahr: F.jahr, schatten: !!F.schatten });
          if (F.schatten) { D.schattenPuffer(g, (h) => schattenMalen(h, A, bau)); return; }
          const platten = lebend && s >= 12 * Math.max(1, (ST.kamera && ST.kamera.dpr) || 1);
          LIVE.platten = platten;
          D.weichMalen(g, (g2) => {
            if (platten) lebendVorbereiten(LIVE, liste, A, F);
            allesMalen(g2, A, liste, bau, 0.35, !platten, !lebend, F, platten ? LIVE.istLebend : null);
          });
        }
      });
      if (lebend) M.lebendig((g, P) => {
        /* Ausschnitt: Teller aller Stockwerke und das Flügelrad */
        const R = Math.max(RAD_R, EB[1].R) + 0.6, box = [Infinity, Infinity, -Infinity, -Infinity];
        for (const z of [EB[1].z, NABE_Z + 1.7]) for (const x of [-R, R]) for (const y of [-R, R]) {
          const q = P.proj(x, y, z);
          box[0] = Math.min(box[0], q[0]); box[1] = Math.min(box[1], q[1]); box[2] = Math.max(box[2], q[0]); box[3] = Math.max(box[3], q[1]);
        }
        D.weichLeben(g, box, LIVE, (g2) => lebendMalen(g2, P, LIVE, o.jahr));
      });
      /* unsichtbare Hülle für die Bildgrenzen, flacher Fuß für den Kontaktschatten */
      M.teil("huelle", { schatten: false, mitte: [0, 0, -50] });
      const leer = { malen: null, keinLicht: true, keinAo: true };
      M.flaeche(Object.assign({ name: "h0", o: [-RAD_R - 0.3, -RAD_R - 0.3, NABE_Z + 1], u: [1, 0, 0], v: [0, 1, 0], w: 2 * RAD_R + 0.6, h: 2 * RAD_R + 0.6 }, leer));
      M.flaeche(Object.assign({ name: "h1", o: [-DECK_R - 0.8, -DECK_R - 0.8, -0.8], u: [1, 0, 0], v: [0, 1, 0], w: 2 * DECK_R + 1.6, h: 2 * DECK_R + 1.6 }, leer));
      /* Platz für den ganzen Bodenschatten (sonst schneidet die Spritekante ihn ab) */
      D.schattenRaum(M, o, [[0, DECK_R], [TRAUFE_Z, TRAUFE_R], [EB[1].z, EB[1].R], [EB[3].z, EB[3].R], [EB[NE].z, EB[NE].R], [NABE_Z, RAD_R + 0.3], [NABE_Z + 0.95, 0.3]]);
      /* Kontaktschatten erst, wenn etwas auf dem Fundament steht (sonst läge
         ein dunkles Viereck über der offenen Baugrube) */
      if (bau >= 0.14) {
        M.teil("fuss", { schatten: true, mitte: [0, 0, -40] });
        M.flaeche(Object.assign({ name: "fuss", o: [-DECK_R, -DECK_R, 0.01], u: [1, 0, 0], v: [0, 1, 0], w: 2 * DECK_R, h: 2 * DECK_R,
          umriss: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const p = ecke(DECK_R * 0.97, i, 0); return [p[0] + DECK_R, p[1] + DECK_R]; }) }, leer));
      }
      /* Licht: Kerzen (kleiner Schein je Kerze) und Ausschank */
      if (bau >= 1) {
        for (const st of liste) if (st.licht) M.licht(st.licht[0], st.licht[1], st.licht[2], 0.7, "255,196,120", 0.42);
        M.bodenlicht(0, 0, 7.5, "255,186,110", 0.8);
      }
    }
  });

  /* =====================================================================
     LEBEND: Was dreht sich, was steht davor?
     ---------------------------------------------------------------------
     Die Figuren drehen sich zwischen den Säulen. Damit sie in JEDEM
     Drehwinkel richtig hinter den vorderen und vor den hinteren Säulen
     laufen, werden die vorderen und seitlichen Säulen, Kerzen und
     Behänge nicht ins Sprite gemalt, sondern als kleine Einzelbilder
     bereitgelegt und jedes Bild zusammen mit den Figuren nach Tiefe
     sortiert. Was vom nächsthöheren Stockwerk davor liegt, schneidet
     eine Maske aus (dieses Stockwerk liegt höher, also immer näher am
     Auge). Kein Teil wird doppelt gemalt – keine Kantenreste.
     LEISTUNG: Figuren- und Säulenbilder werden im Maßstab des Sprites
     gemalt und beim Zoomen nur gestreckt; neu gemalt wird erst, wenn die
     Szene das Sprite in der neuen Größe baut.
     ===================================================================== */
  function horizTiefe(A, c) { const k = A.kam(c); return (k[0] + k[1]) * 0.6124; }
  function lebendVorbereiten(LIVE, liste, A, F) {
    const s = A.s;
    LIVE.s = s; LIVE.gier = zustand0(A);
    LIVE.istLebend = (st) => st.e >= 1 && st.e < NE && (st.art === "welle" || ((st.art === "saeule" || st.art === "kerze" || st.art === "behang") && horizTiefe(A, st.c) > -0.35 * EB[st.e].c));
    LIVE.zonen = {}; LIVE.stuecke = {};
    for (let e = 1; e < NE; e++) {
      const S = EB[e], N = EB[e + 1], Rz = S.R + 0.25, z0 = S.z + RH - 0.35, z1 = N.z + 0.1;
      const x0 = Math.floor(-Rz * s) - 3, x1 = Math.ceil(Rz * s) + 3;
      const y0 = Math.floor(-0.5 * Rz * s - z1 * ST.KZ * s) - 3, y1 = Math.ceil(0.5 * Rz * s - z0 * ST.KZ * s) + 3;
      const w = x1 - x0, h = y1 - y0;
      /* Umriss des nächsten Rahmens (Achteck oben und unten) */
      const deckel = [];
      for (let i = 0; i < 8; i++) { deckel.push(ecke(N.R, i, N.z)); deckel.push(ecke(N.R, i, N.z + RH)); }
      LIVE.zonen[e] = { x0: x0, y0: y0, w: w, h: h, deckel: deckel };
      /* Einzelbilder der beweglich einsortierten Teile */
      const bilder = [];
      for (const st of liste) {
        if (st.e !== e || !LIVE.istLebend(st) || !st.bb) continue;
        const b = st.bb;
        let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
        for (const x of [b[0], b[3]]) for (const y of [b[1], b[4]]) for (const z of [b[2], b[5]]) {
          const q = A.bild([x, y, z]);
          bx0 = Math.min(bx0, q[0]); by0 = Math.min(by0, q[1]); bx1 = Math.max(bx1, q[0]); by1 = Math.max(by1, q[1]);
        }
        bx0 = Math.floor(bx0) - 3; by0 = Math.floor(by0) - 3; bx1 = Math.ceil(bx1) + 3; by1 = Math.ceil(by1) + 3;
        const c = document.createElement("canvas"); c.width = Math.max(1, bx1 - bx0); c.height = Math.max(1, by1 - by0);
        const cg = c.getContext("2d", { willReadFrequently: true });
        const AB = new D.Ansicht({ s: s, c: A.c, sn: A.sn, tx: -bx0, ty: -by0, Z: A.Z, jahr: A.jahr });
        AB.warm = warmBasis(AB, st.warm || 0);
        st.fn(cg, AB, 1, 1, null, true);
        bilder.push({ c: c, x0: bx0, y0: by0, tief: A.tief(st.c) + (st.art === "behang" ? 0.02 : 0), st: st });
      }
      LIVE.stuecke[e] = bilder;
    }
    LIVE.figuren = besetzung(A.jahr);
    LIVE.bereit = true;
    void F;
  }
  function zustand0(A) { return Math.atan2(A.sn, A.c) * 180 / Math.PI; }

  function lebendMalen(g, P, LIVE, jahr) {
    const O = P.proj(0, 0, 0);
    const phi = (P.t || 0) * OMEGA;
    const A = new D.Ansicht({ s: P.s, c: P.c, sn: P.sn, tx: O[0], ty: O[1], Z: P.Z, jahr: jahr });
    if (LIVE.platten && LIVE.bereit) {
      const k = P.s / LIVE.s;
      const W = g.canvas.width, H = g.canvas.height;
      const warm = warmBasis(A, 0.7);
      const m = g.getTransform();
      for (let e = 1; e < NE; e++) {
        const z = LIVE.zonen[e];
        const X0 = O[0] + z.x0 * k, Y0 = O[1] + z.y0 * k, w = z.w * k, h = z.h * k;
        if (m.e + X0 > W || m.f + Y0 > H || m.e + X0 + w < 0 || m.f + Y0 + h < 0) continue;
        /* Alles vom nächsten Stockwerk an liegt höher, also näher am Auge:
           sein Umriss (Hülle der Rahmenplatte) wird ausgespart. */
        g.save();
        g.beginPath();
        g.rect(X0 - 2, Y0 - 2, w + 4, h + 4);
        const hl = D.huelle2(z.deckel.map((q) => A.bild(q)));
        g.moveTo(hl[0][0], hl[0][1]); for (let i = 1; i < hl.length; i++) g.lineTo(hl[i][0], hl[i][1]); g.closePath();
        g.clip("evenodd");
        const liste = [];
        for (const b of LIVE.stuecke[e]) liste.push({ z: b.tief, fn: () => {
          if (k === 1) g.drawImage(b.c, O[0] + b.x0, O[1] + b.y0);
          else g.drawImage(b.c, O[0] + b.x0 * k, O[1] + b.y0 * k, b.c.width * k, b.c.height * k);
          if (b.st.art === "kerze" && b.st.licht) D.flamme(g, A, [b.st.licht[0], b.st.licht[1], b.st.licht[2] - 0.068], 0.13, 0.5 + 0.5 * Math.sin((P.t || 0) * 9 + b.st.licht[0] * 5));
        } });
        const S = EB[e], zt = S.z + RH + 0.06;
        for (const f of LIVE.figuren[e]) {
          const w0 = f.th + phi, p = [f.r * Math.cos(w0), f.r * Math.sin(w0), zt + f.dz * f.k];
          liste.push({ z: A.tief(add(p, [0, 0, 0.35 * f.k * 1.75])), fn: () => D.figurBild(g, A, f.fig, { p: p, phi: w0 + f.blick - Math.PI / 2, k: f.k, warm: warm, sBild: LIVE.s, sk: 0.6 }) });
        }
        liste.sort((a, b) => a.z - b.z);
        for (const it of liste) it.fn();
        g.restore();
      }
    }
    rad(g, A, phi, jahr === "winter");
  }

  /* Kunstlicht nachts: nur in der Nähe von Kerzen, Lichterketten und im
     Ausschank. anteil = wie nah ein Teil an den Lichtern ist (0 = gar
     nicht: Dachflächen, Schnee, Podest bekommen nur den Schein aus
     leuchtPunkt und M.licht, keine rosa Überstrahlung) */
  function warmBasis(A, anteil) {
    if (!(A.nacht > 0) || A.silhouette || !(anteil > 0)) return null;
    const k = A.nacht * anteil;
    return [0.46 * k, 0.3 * k, 0.14 * k];
  }

  /* Alles zeichnen: Stückliste nach Stockwerk, Schicht und Tiefe */
  function allesMalen(g, A, liste, bau, phi, mitFiguren, mitRad, F, ohne) {
    const reihe = [];
    for (const st of liste) {
      if (bau < st.bau[0]) continue;
      if (ohne && ohne(st)) continue;
      const q = klemm((bau - st.bau[0]) / Math.max(1e-6, st.bau[1] - st.bau[0]), 0, 1);
      reihe.push({ st: st, q: q, z: st.e * 1e4 + st.sch * 100 + A.tief(st.c) });
    }
    if (mitFiguren && bau >= 0.92) {
      const L = besetzung(A.jahr);
      for (let e = 1; e < NE; e++) {
        const S = EB[e], zt = S.z + RH + 0.06;
        for (const f of L[e]) {
          const w = f.th + phi, p = [f.r * Math.cos(w), f.r * Math.sin(w), zt + f.dz * f.k];
          reihe.push({ fig: f, p: p, phi: w + f.blick - Math.PI / 2, z: e * 1e4 + 200 + A.tief(add(p, [0, 0, 0.4])) });
        }
      }
    }
    reihe.sort((a, b) => a.z - b.z);
    const warmFig = warmBasis(A, 0.7);
    for (const r of reihe) {
      if (r.fig) { D.figurZeichnen(g, A, r.fig.fig, { p: r.p, phi: r.phi, k: r.fig.k, warm: warmFig, sk: 0.6 }); }
      else if (r.st.innen) {
        /* unter dem Dach: keine Sonne, weniger Himmel, abends warmes Lampenlicht */
        const sk = A.sk, ak = A.ak;
        A.sk = 0; A.ak = 0.62;
        A.warm = A.nacht > 0 ? [0.75 * A.nacht, 0.5 * A.nacht, 0.24 * A.nacht] : null;
        r.st.fn(g, A, r.q, bau, null);
        A.sk = sk; A.ak = ak; A.warm = null;
      } else {
        A.warm = warmBasis(A, r.st.warm || 0);
        r.st.fn(g, A, r.q, bau, null);
        A.warm = null;
      }
    }
    if (mitRad && bau >= 0.85) rad(g, A, 0.2, A.winter, klemm((bau - 0.85) / 0.06, 0, 1));
    /* Leuchtpunkte (Kerzenschein) für die Szene */
    if (F && F.leuchtPunkt && A.nacht > 0 && bau >= 1) {
      for (let i = 0; i < 8; i++) {
        if (A.zumAuge(nach(i)) < -0.2) continue;
        const p = A.bild(add(mul(nach(i), 3.0), [0, 0, 1.8]));
        F.leuchtPunkt(p[0], p[1], A.s * 2.2, "255,170,90", 0.5, false);
      }
    }
  }

  function schattenMalen(g, A, bau) {
    /* Körper: Ausschank (Prisma), Stockwerke als Scheiben, Säulen, Rad als lichter Kreis */
    if (bau < 0.14) return;
    const prisma = (R, z0, z1) => { const pts = []; for (let i = 0; i < 8; i++) { pts.push(A.bild(ecke(R, i, z0))); pts.push(A.bild(ecke(R, i, z1))); } D.pfad(g, D.huelle2(pts)); g.fillStyle = "#000"; g.fill(); };
    prisma(DECK_R, 0, DECK_H);
    if (bau >= 0.2) prisma(THEKE_R, 0, BLENDE_Z * klemm((bau - 0.2) / 0.1, 0, 1));
    if (bau >= 0.3) prisma(TRAUFE_R, TRAUFE_Z - 0.4, FIRST_Z);
    for (let e = 1; e <= NE; e++) {
      const b0 = 0.42 + (e - 1) * 0.075;
      if (bau < b0) break;
      prisma(EB[e].R, EB[e].z, EB[e].z + RH);
      if (e < NE) for (let i = 0; i < 8; i++) { const w = ACHT[i]; D.stumpf(g, A, [EB[e].c * Math.cos(w), EB[e].c * Math.sin(w), EB[e].z], [EB[e].c * Math.cos(w), EB[e].c * Math.sin(w), EB[e + 1].z], 0.07, 0.07, [0, 0, 0], {}); }
    }
    if (bau >= 0.85) {
      g.save(); g.globalAlpha = 0.28;
      const e = D.ellipseBild(A, [0, 0, NABE_Z], [RAD_R, 0, 0], [0, RAD_R, 0]);
      g.beginPath(); g.ellipse(e.x, e.y, e.r1, e.r2, e.th, 0, TAU); g.fill();
      g.restore();
    }
  }

  ST.pyramideIntern = { EB: EB, stueckliste: stueckliste, besetzung: besetzung, rad: rad, allesMalen: allesMalen, OMEGA: OMEGA, RH: RH };
})();
