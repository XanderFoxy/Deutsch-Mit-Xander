/* =====================================================================
   LEICHTE STADT — TRETBOOTE, BADEGÄSTE UND LIEGEWIESE AM SEE
   ---------------------------------------------------------------------
   XANDER: „dass der See halt nach unten … noch größer ist und man dann
   sieht, wie man mit Wassertreter darauf fahren kann, die Leute das Spaß
   haben oder baden" – „vielleicht so ein kleines Bootshaus für den
   Verleih vom Wassertreter".

   TRETBOOTE: weiße Schwäne (stadt/modelle/tretboot.js, gebacken als
   Blatt mit 8 Richtungen × 4 Schaukelbildern). Sie gleiten langsam
   (0,6–0,8 m/s) und steuern selbst: ein sanftes Umherschlendern, dazu
   ein Abstandsfeld zum Ufer (einmal aus dem Boden berechnet), das sie
   rechtzeitig vom Ufer, vom Steg und von der Badebucht wegdreht; einander
   weichen sie aus. Ab und zu legt eines am Steg des Bootshauses an (der
   Reihe nach, immer nur eines), bleibt eine Weile liegen und tritt dann
   rückwärts wieder hinaus. Hinter jedem Boot eine feine Kielspur.
   BADEGÄSTE in der Badebucht: Kopf und Schultern im Wasser (eine mit
   Badekappe krault, ein Kind im Schwimmring, einer auf der Luftmatratze),
   mit Ringwellen. Auf der Wiese südlich der Bucht liegen Leute auf
   Handtüchern, einer unter dem Sonnenschirm.
   Alles nur im Frühling und Sommer bei Tag; im Winter ist der See
   zugefroren. Im Sparmodus und im kleinen Rahmen (lk-mini-modus)
   höchstens 2 Boote und keine Badegäste.
   Zeichnen: szene.js sortiert Boote und Leute wie die Spaziergänger
   zwischen die Dinge ein (sichtbar → malen); Kielspur und Ringwellen
   liegen flach auf dem Wasser und kommen vorher (wasser).
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, K = ST.kamera, SZ = ST.szene, LB = ST.bilder, B = ST.boden;
  const BO = (ST.boote = { boote: [], baden: [], liegen: [], aktiv: false, t: 0 });
  const TAU = Math.PI * 2;
  const wrap = (a) => { a = (a + Math.PI) % TAU; if (a < 0) a += TAU; return a - Math.PI; };
  const klemm = (v, a, b) => (v < a ? a : v > b ? b : v);

  /* ---------------- Orte am See (Welt in Metern) ---------------- */
  const STEG = { x0: 59.4, x1: 65.6, y0: 84.7, y1: 86.3 };   // Steg des Bootshauses (dorf.js, d_bootshaus)
  const LIEGT = [64.3, 87.55];                               // Liegeplatz südlich am Steg, Bug zum Ufer
  const VOR = [70.5, 87.6];                                  // Anfahrt draußen vor dem Steg
  const BUCHT = [64.5, 91.8, 3.8];                           // Badebucht: dort fahren keine Boote
  const GASSE = [67.5, 87.6, 3.2];                           // Zufahrt zum Steg: frei für das anlegende Boot
  const HINAUS = [75, 90];                                   // nach dem Ablegen dorthin, dann frei fahren
  const SCHWIMMER = [[62.6, 90.4], [63.8, 92.6], [66.2, 91.0], [65.6, 93.6], [62.4, 92.4], [64.6, 89.7]];
  const WIESE = [[61.6, 98.7, 0.35], [64.4, 99.8, -0.2], [60.4, 100.9, 0.9], [66.4, 98.4, 1.3]];

  /* ---------------- Abstandsfeld zum Ufer ---------------- */
  const GX = 36, GY = 26, NX = 84, NY = 94;
  let feld = null;
  function feldBauen() {
    const INF = 1e6, d = new Float32Array(NX * NY);
    for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
      const x = GX + i + 0.5, y = GY + j + 0.5;
      let land = !(B.wert(x, y, 1) > 0.5);
      if (x > STEG.x0 && x < STEG.x1 && y > STEG.y0 && y < STEG.y1) land = true;
      if (Math.hypot(x - BUCHT[0], y - BUCHT[1]) < BUCHT[2] || Math.hypot(x - GASSE[0], y - GASSE[1]) < GASSE[2]) land = true;
      d[j * NX + i] = land ? 0 : INF;
    }
    const R2 = Math.SQRT2;
    for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
      let v = d[j * NX + i]; if (!v) continue;
      if (i > 0) v = Math.min(v, d[j * NX + i - 1] + 1);
      if (j > 0) { v = Math.min(v, d[(j - 1) * NX + i] + 1); if (i > 0) v = Math.min(v, d[(j - 1) * NX + i - 1] + R2); if (i < NX - 1) v = Math.min(v, d[(j - 1) * NX + i + 1] + R2); }
      d[j * NX + i] = v;
    }
    for (let j = NY - 1; j >= 0; j--) for (let i = NX - 1; i >= 0; i--) {
      let v = d[j * NX + i]; if (!v) continue;
      if (i < NX - 1) v = Math.min(v, d[j * NX + i + 1] + 1);
      if (j < NY - 1) { v = Math.min(v, d[(j + 1) * NX + i] + 1); if (i < NX - 1) v = Math.min(v, d[(j + 1) * NX + i + 1] + R2); if (i > 0) v = Math.min(v, d[(j + 1) * NX + i - 1] + R2); }
      d[j * NX + i] = v;
    }
    /* Rand des Gitters gilt als Land */
    for (let i = 0; i < NX; i++) { d[i] = 0; d[(NY - 1) * NX + i] = 0; }
    for (let j = 0; j < NY; j++) { d[j * NX] = 0; d[j * NX + NX - 1] = 0; }
    feld = d;
  }
  /* Abstand zum Ufer in Metern (weich zwischen den Gitterpunkten) */
  function abst(x, y) {
    const u = x - GX - 0.5, v = y - GY - 0.5, i = Math.floor(u), j = Math.floor(v);
    if (i < 0 || j < 0 || i >= NX - 1 || j >= NY - 1) return 0;
    const fx = u - i, fy = v - j, o = j * NX + i;
    return (feld[o] * (1 - fx) + feld[o + 1] * fx) * (1 - fy) + (feld[o + NX] * (1 - fx) + feld[o + NX + 1] * fx) * fy - 0.5;
  }
  function weg(x, y) { return Math.atan2(abst(x, y + 0.8) - abst(x, y - 0.8), abst(x + 0.8, y) - abst(x - 0.8, y)); }
  BO.abst = function (x, y) { if (!feld) feldBauen(); return abst(x, y); };

  /* ---------------- Wie viele? ---------------- */
  function klein() { return !!(LB.spar || LB.nurKlein || (document.body && document.body.classList.contains("lk-mini-modus"))); }
  function jahrOk() { return SZ.jahr === "sommer" || SZ.jahr === "fruehling"; }

  /* ---------------- Aufstellen ---------------- */
  function setzen() {
    feldBauen();
    const rng = ST.zufall(803);
    BO.boote = [];
    for (let k = 0; k < 4; k++) {
      let x = 0, y = 0;
      for (let v = 0; v < 400; v++) {
        x = 64 + rng() * 44; y = 40 + rng() * 64;
        if (abst(x, y) >= 5 && BO.boote.every((b) => Math.hypot(b.x - x, b.y - y) > 9)) break;
      }
      BO.boote.push({ k: k, x: x, y: y, h: rng() * TAU, v: 0.7, tempo: 0.62 + rng() * 0.18, wander: 0, rng: ST.zufall(900 + k * 17),
        ph: rng(), art: k % 2, modus: "fahren", uhr: 30 + rng() * 90, spur: [], spurUhr: 0 });
    }
    /* das erste Boot liegt gerade am Steg: so sieht man den Verleih gleich */
    const b0 = BO.boote[0];
    b0.x = LIEGT[0]; b0.y = LIEGT[1]; b0.h = Math.PI; b0.v = 0; b0.modus = "liegen"; b0.uhr = 14 + rng() * 10; BO.steg = b0;
    BO.baden = SCHWIMMER.filter((p) => B.wert(p[0], p[1], 1) > 0.5).map((p, i) => ({ i: i, hx: p[0], hy: p[1], x: p[0], y: p[1], w: rng() * TAU, r: 0.4 + rng() * 0.9, tempo: 0.05 + rng() * 0.06, art: i % 6,
      haut: HAUT[i % HAUT.length], haar: HAAR[(i * 3 + 1) % HAAR.length], kappe: KAPPE[i % KAPPE.length] }));
    BO.liegen = WIESE.filter((p) => !(B.wert(p[0], p[1], 1) > 0.05) && !(B.wert(p[0], p[1], 0) > 0.3)).map((p, i) => ({ i: i, x: p[0], y: p[1], dreh: p[2], art: i,
      haut: HAUT[(i + 2) % HAUT.length], haar: HAAR[(i * 2) % HAAR.length], tuch: TUCH[i % TUCH.length], hose: BADE[i % BADE.length] }));
  }

  /* ---------------- Bewegen ---------------- */
  function drehe(b, ziel, rate, dt) { const d = wrap(ziel - b.h); b.h = wrap(b.h + klemm(d, -rate * dt, rate * dt)); }
  /* frei fahren (ohne Ziel: schlendern) oder mit Ziel, aber immer mit Abstand zu Ufer und Booten */
  function fahren(b, dt, zahl, nach) {
    const vx = Math.cos(b.h), vy = Math.sin(b.h);
    b.wander = klemm(b.wander * (1 - 0.1 * dt) + (b.rng() - 0.5) * 1.4 * dt, -0.7, 0.7);
    let ziel = nach ? Math.atan2(nach[1] - b.y, nach[0] - b.x) : b.h + b.wander;
    /* Ufer, Steg und Badebucht: vorausschauen und rechtzeitig abdrehen */
    const d0 = abst(b.x, b.y), dv = abst(b.x + vx * 4.5, b.y + vy * 4.5), dm = Math.min(d0 + 0.6, dv);
    if (dm < 6.5) { const w = weg(b.x + vx * 2, b.y + vy * 2); ziel = b.h + wrap(w - b.h) * klemm((6.5 - dm) / 3.5, 0, 1); }
    /* einander ausweichen; wer hinter einem anderen fährt, tritt langsamer */
    let bremse = 1;
    for (let i = 0; i < zahl; i++) {
      const o = BO.boote[i]; if (o === b) continue;
      const dx = o.x - b.x, dy = o.y - b.y, d = Math.hypot(dx, dy);
      if (d > 10 || d < 1e-3) continue;
      const vor = (dx * vx + dy * vy) / d;
      if (vor > 0.4 && d < 7) bremse = Math.min(bremse, 0.25 + 0.1 * d);
      if (vor > -0.1) ziel += (dx * vy - dy * vx > 0 ? 1 : -1) * 1.4 * (1 - d / 10) * (0.4 + vor);
      /* zu nah: sanft auseinanderschieben (beide weichen je zur Hälfte) */
      if (d < 5) {
        const f = (5 - d) * 0.4 * dt, qx = b.x - dx / d * f, qy = b.y - dy / d * f;
        if (abst(qx, qy) >= Math.min(3, abst(b.x, b.y))) { b.x = qx; b.y = qy; }
      }
    }
    drehe(b, ziel, 0.32, dt);
    const soll = b.tempo * (dm < 3.5 ? 0.6 : 1) * bremse;
    b.v += (soll - b.v) * Math.min(1, dt * 0.8);
    const nx = b.x + Math.cos(b.h) * b.v * dt, ny = b.y + Math.sin(b.h) * b.v * dt;
    /* nie näher als 2,6 m ans Ufer: dann stehen bleiben und weiter drehen */
    if (abst(nx, ny) < 2.6 && abst(nx, ny) < d0) { b.v *= 0.5; b.h = wrap(b.h + 0.5 * dt * (b.k % 2 ? 1 : -1)); return; }
    b.x = nx; b.y = ny;
    if (nach) return;
    /* ab und zu zum Steg (wer nicht zu weit weg ist und der Steg frei) */
    b.uhr -= dt;
    if (b.uhr <= 0) { if (!BO.steg && freieSicht(b.x, b.y, VOR)) { b.modus = "anfahrt"; b.uhr = 90; BO.steg = b; } else b.uhr = 8 + b.rng() * 15; }
  }
  /* Liegt zwischen Boot und Ziel offenes Wasser? (sonst verfährt es sich hinter einer Landzunge) */
  function freieSicht(x, y, z) {
    const d = Math.hypot(z[0] - x, z[1] - y); if (d > 30) return false;
    for (let t = 0; t < d - 6; t += 1) if (abst(x + (z[0] - x) * t / d, y + (z[1] - y) * t / d) < 2) return false;
    return true;
  }
  function zu(b, ziel, tempo, dt, rueck) {
    const dx = ziel[0] - b.x, dy = ziel[1] - b.y, d = Math.hypot(dx, dy);
    const soll = Math.min(tempo, 0.12 + d * 0.3);
    b.v += (soll - b.v) * Math.min(1, dt * 1.2);
    if (rueck) {
      /* rückwärts treten: Bug bleibt zum Ufer, das Boot gleitet hinaus */
      drehe(b, Math.atan2(-dy, -dx), 0.25, dt);
      b.x -= Math.cos(b.h) * b.v * dt; b.y -= Math.sin(b.h) * b.v * dt;
    } else {
      drehe(b, Math.atan2(dy, dx), 0.4, dt);
      b.x += Math.cos(b.h) * b.v * dt; b.y += Math.sin(b.h) * b.v * dt;
    }
    return d;
  }
  let letzte = 0;
  BO.bewegen = function (jetzt) {
    const dt = Math.min(0.1, Math.max(0, (jetzt - (letzte || jetzt)) / 1000)); letzte = jetzt;
    BO.t += dt;
    if (!BO.aktiv) return;
    if (!BO.boote.length) setzen();
    const zahl = klein() ? 2 : BO.boote.length;
    for (let i = 0; i < zahl; i++) {
      const b = BO.boote[i];
      if (b.modus === "fahren") fahren(b, dt, zahl);
      else if (b.modus === "anfahrt") {
        /* erst mit Ufer-Abstand in die Nähe, die letzten Meter geradewegs */
        const d = Math.hypot(VOR[0] - b.x, VOR[1] - b.y);
        if (d > 6) fahren(b, dt, zahl, VOR); else if (zu(b, VOR, b.tempo, dt) < 1.2) b.modus = "anlegen";
        /* nach 90 s noch nicht da: lieber weiterfahren und den Steg freigeben */
        b.uhr -= dt; if (b.modus === "anfahrt" && b.uhr <= 0 && d > 6) { b.modus = "fahren"; b.uhr = 40 + b.rng() * 60; BO.steg = null; }
      }
      else if (b.modus === "anlegen") { if (zu(b, LIEGT, 0.45, dt) < 0.25) { b.modus = "liegen"; b.uhr = 10 + b.rng() * 14; } }
      else if (b.modus === "liegen") { b.v = 0; drehe(b, Math.PI, 0.2, dt); b.uhr -= dt; if (b.uhr <= 0) b.modus = "ablegen"; }
      else if (b.modus === "ablegen") { if (zu(b, VOR, 0.4, dt, true) < 1.0) b.modus = "hinaus"; }
      else if (b.modus === "hinaus") { if (zu(b, HINAUS, b.tempo, dt) < 1.5) { b.modus = "fahren"; b.uhr = 45 + b.rng() * 90; b.wander = 0; if (BO.steg === b) BO.steg = null; } }
      /* Kielspur: alle 0,4 s ein Punkt, höchstens 7 s lang */
      b.spurUhr -= dt;
      if (b.spurUhr <= 0) { b.spurUhr = 0.4; if (b.v > 0.12) b.spur.unshift([b.x, b.y, b.h, BO.t]); if (b.spur.length > 18) b.spur.length = 18; }
    }
    /* ein Boot im Sparmodus am Steg festgehalten? dann Steg freigeben */
    if (BO.steg && BO.boote.indexOf(BO.steg) >= zahl) BO.steg = null;
    for (const s of BO.baden) {
      s.w += s.tempo * dt;
      s.x = s.hx + Math.cos(s.w) * s.r; s.y = s.hy + Math.sin(s.w * 0.8) * s.r * 0.7;
    }
  };

  /* ---------------- Farben ---------------- */
  const HAUT = [[236, 196, 164], [214, 166, 128], [176, 124, 88], [242, 206, 182], [198, 146, 108]];
  const HAAR = [[58, 40, 28], [196, 150, 84], [28, 24, 22], [120, 70, 40], [214, 190, 140]];
  const KAPPE = [[220, 46, 44], [250, 214, 60], [245, 245, 240], [40, 110, 200]];
  const TUCH = [[[224, 64, 64], [250, 246, 236]], [[40, 120, 200], [250, 214, 70]], [[70, 170, 120], [250, 246, 236]], [[240, 150, 60], [60, 70, 150]]];
  const BADE = [[30, 60, 140], [210, 40, 60], [30, 30, 36], [250, 170, 40]];
  const rgb = (f, a) => a == null ? "rgb(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + ")" : "rgba(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + "," + a + ")";
  const hell = (f, k) => f.map((v) => Math.max(0, Math.min(255, k > 0 ? v + (255 - v) * k : v * (1 + k))));
  /* Licht der Tageszeit auf eine Farbe (sonnig von links oben) */
  function lf(f, Z, k) { return [0, 1, 2].map((i) => Math.min(255, f[i] * (Z.amb[i] + Z.sonne[i] * (k == null ? 1 : k)))); }

  /* ---------------- Zeichnen ---------------- */
  function kugel(g, x, y, r, f, Z) {
    const gr = g.createRadialGradient(x - r * 0.4, y - r * 0.45, r * 0.1, x, y, r);
    gr.addColorStop(0, rgb(lf(hell(f, 0.15), Z, 1.2))); gr.addColorStop(1, rgb(lf(hell(f, -0.25), Z, 0.3)));
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  }
  /* Schwimmer: Kopf und Schultern über dem Wasser */
  function schwimmerMalen(g, p) {
    const s = p.s, k = K.s, Z = p.Z, X = p.X, Y = p.Y + Math.sin(BO.t * 1.6 + s.i * 1.3) * 0.02 * k;
    if (s.art === 3) return matratzeMalen(g, p);
    const kz = ST.KZ * k;
    /* Wasser um den Körper etwas dunkler, dann Schultern (unten abgeschnitten) */
    g.save();
    g.fillStyle = "rgba(20,50,70,0.22)"; g.beginPath(); g.ellipse(X, Y, 0.34 * k, 0.17 * k, 0, 0, TAU); g.fill();
    g.beginPath(); g.rect(X - k, Y - 2 * k, 2 * k, 2 * k - 0.01 * k); g.clip();
    const sch = s.art === 0 ? 0.3 : 0.22;
    g.fillStyle = rgb(lf(s.haut, Z, 0.9)); g.beginPath(); g.ellipse(X, Y, sch * k, 0.1 * k, 0, Math.PI, TAU); g.fill();
    g.restore();
    if (s.art === 2) {
      /* Kind im Schwimmring */
      g.lineWidth = Math.max(1, 0.1 * k);
      for (let i = 0; i < 6; i++) { g.strokeStyle = rgb(lf(i % 2 ? [250, 240, 230] : [236, 60, 70], Z, 1)); g.beginPath(); g.ellipse(X, Y, 0.3 * k, 0.15 * k, 0, i * TAU / 6, (i + 1) * TAU / 6 + 0.02); g.stroke(); }
    }
    const kr = (s.art === 2 ? 0.1 : 0.115) * k, ky = Y - (s.art === 0 ? 0.1 : 0.2) * kz;
    kugel(g, X, ky, kr, s.haut, Z);
    /* Haare oder Badekappe oben auf dem Kopf */
    g.save(); g.beginPath(); g.arc(X, ky, kr * 1.04, 0, TAU); g.clip();
    g.fillStyle = rgb(lf(s.art === 0 || s.art === 5 ? s.kappe : s.haar, Z, 1.1));
    g.beginPath(); g.ellipse(X + kr * 0.05, ky - kr * 0.55, kr * 1.1, kr * 0.85, 0, 0, TAU); g.fill(); g.restore();
    if (s.art === 0) {
      /* Kraulen: ein Arm schwingt über das Wasser */
      const a = (BO.t * 1.3 + s.i) % 1, w = a * Math.PI;
      if (a < 0.6) {
        g.strokeStyle = rgb(lf(s.haut, Z, 0.9)); g.lineWidth = Math.max(1, 0.07 * k); g.lineCap = "round";
        g.beginPath(); g.moveTo(X + 0.2 * k, Y - 0.02 * k); g.quadraticCurveTo(X + 0.3 * k, Y - Math.sin(w / 0.6) * 0.45 * kz, X + (0.25 - a * 0.6) * k, Y - Math.sin(w / 0.6) * 0.3 * kz); g.stroke();
      }
    }
    /* feiner heller Saum an der Wasserlinie */
    g.strokeStyle = "rgba(235,245,250,0.5)"; g.lineWidth = Math.max(0.6, 0.02 * k);
    g.beginPath(); g.ellipse(X, Y, (s.art === 0 ? 0.33 : 0.26) * k, 0.12 * k, 0, 0.1, Math.PI - 0.1); g.stroke();
  }
  /* Luftmatratze mit einem Liegenden, treibt langsam */
  function matratzeMalen(g, p) {
    const s = p.s, k = K.s, Z = p.Z;
    const w = s.w * 0.3 + 0.6, c = Math.cos(w), sn = Math.sin(w);
    const P = (u, v, z) => ST.proj(s.x + c * u - sn * v, s.y + sn * u + c * v, z);
    const ecke = [P(-0.95, -0.34, 0.12), P(0.95, -0.34, 0.12), P(0.95, 0.34, 0.12), P(-0.95, 0.34, 0.12)];
    const unten = [P(-0.95, -0.34, 0), P(0.95, -0.34, 0), P(0.95, 0.34, 0), P(-0.95, 0.34, 0)];
    g.fillStyle = "rgba(20,50,70,0.25)"; g.beginPath(); unten.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); g.closePath(); g.fill();
    g.fillStyle = rgb(lf([200, 40, 50], Z, 0.5)); g.beginPath(); [unten[0], unten[1], ecke[1], ecke[0]].forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); g.closePath(); g.fill();
    g.beginPath(); [unten[3], unten[2], ecke[2], ecke[3]].forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); g.closePath(); g.fill();
    g.fillStyle = rgb(lf([236, 58, 66], Z, 1)); g.beginPath(); ecke.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); g.closePath(); g.fill();
    g.strokeStyle = rgb(lf([250, 140, 140], Z, 1)); g.lineWidth = Math.max(0.5, 0.025 * k);
    for (let u = -0.7; u < 0.95; u += 0.3) { const a = P(u, -0.3, 0.125), b = P(u, 0.3, 0.125); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
    liegendMalen(g, P, 0.12, s, Z, k);
  }
  /* Ein liegender Mensch auf dem Rücken (Kopf bei u = −0,75) */
  function liegendMalen(g, P, z, m, Z, k) {
    g.lineCap = "round";
    const linie = (a, b, br, f) => { g.strokeStyle = f; g.lineWidth = Math.max(1, br * k); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); };
    const haut = rgb(lf(m.haut, Z, 0.95)), hose = rgb(lf(m.hose || [30, 60, 140], Z, 0.9));
    for (const v of [-0.1, 0.1]) linie(P(0.05, v, z + 0.06), P(0.78, v * 1.3, z + 0.05), 0.11, haut);
    linie(P(-0.08, 0, z + 0.08), P(0.12, 0, z + 0.08), 0.3, hose);
    linie(P(-0.52, 0, z + 0.1), P(-0.12, 0, z + 0.09), 0.34, haut);
    for (const v of [-1, 1]) linie(P(-0.5, v * 0.2, z + 0.08), P(-0.05, v * 0.27, z + 0.06), 0.08, haut);
    const kp = P(-0.73, 0, z + 0.1);
    kugel(g, kp[0], kp[1], 0.11 * k, m.haut, Z);
    g.save(); g.beginPath(); g.arc(kp[0], kp[1], 0.115 * k, 0, TAU); g.clip();
    const hp = P(-0.8, 0, z + 0.1); g.fillStyle = rgb(lf(m.haar, Z, 1)); g.beginPath(); g.arc(hp[0], hp[1], 0.1 * k, 0, TAU); g.fill(); g.restore();
  }
  /* Handtuch auf der Wiese mit einem Liegenden; einer mit Sonnenschirm */
  function wieseMalen(g, p) {
    const m = p.s, k = K.s, Z = p.Z, c = Math.cos(m.dreh), sn = Math.sin(m.dreh);
    const P = (u, v, z) => ST.proj(m.x + c * u - sn * v, m.y + sn * u + c * v, z || 0);
    const t = m.tuch, ecke = [P(-0.95, -0.45), P(0.95, -0.45), P(0.95, 0.45), P(-0.95, 0.45)];
    g.fillStyle = rgb(lf(t[1], Z, 1)); g.beginPath(); ecke.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); g.closePath(); g.fill();
    g.fillStyle = rgb(lf(t[0], Z, 1));
    for (let u = -0.95; u < 0.95; u += 0.38) { const q = [P(u, -0.45), P(u + 0.19, -0.45), P(u + 0.19, 0.45), P(u, 0.45)]; g.beginPath(); q.forEach((r, i) => (i ? g.lineTo(r[0], r[1]) : g.moveTo(r[0], r[1]))); g.closePath(); g.fill(); }
    liegendMalen(g, P, 0.02, m, Z, k);
    if (m.art === 2) {
      /* liest: ein aufgeschlagenes Buch vor dem Kopf */
      const a = P(-1.02, -0.13, 0.05), b = P(-1.02, 0.13, 0.05), c = P(-1.22, 0.13, 0.05), d = P(-1.22, -0.13, 0.05);
      g.fillStyle = rgb(lf([246, 242, 228], Z, 1)); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(c[0], c[1]); g.lineTo(d[0], d[1]); g.closePath(); g.fill();
      const r0 = P(-1.02, 0, 0.06), r1 = P(-1.22, 0, 0.06); g.strokeStyle = rgb(lf([60, 90, 150], Z, 1)); g.lineWidth = Math.max(0.6, 0.03 * k); g.beginPath(); g.moveTo(r0[0], r0[1]); g.lineTo(r1[0], r1[1]); g.stroke();
    }
    if (m.art === 1) {
      /* Sonnenschirm: Stange und gestreiftes Dach */
      const fuss = P(0.2, -0.75, 0), top = P(0.2, -0.75, 2.05);
      g.strokeStyle = rgb(lf([236, 236, 230], Z, 0.8)); g.lineWidth = Math.max(1, 0.05 * k);
      g.beginPath(); g.moveTo(fuss[0], fuss[1]); g.lineTo(top[0], top[1]); g.stroke();
      const n = 10;
      for (let i = 0; i < n; i++) {
        const a0 = i / n * TAU, a1 = (i + 1) / n * TAU;
        const q0 = P(0.2 + Math.cos(a0) * 1.1, -0.75 + Math.sin(a0) * 1.1, 1.72), q1 = P(0.2 + Math.cos(a1) * 1.1, -0.75 + Math.sin(a1) * 1.1, 1.72);
        const hellK = 0.6 + 0.5 * Math.max(0, -Math.cos((a0 + a1) / 2 + 0.8));
        g.fillStyle = rgb(lf(i % 2 ? [250, 248, 240] : [40, 110, 190], Z, hellK));
        g.beginPath(); g.moveTo(top[0], top[1]); g.lineTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]); g.closePath(); g.fill();
      }
    }
  }
  function bootMalen(g, p) {
    const m = p.meta, k = K.s / m.s;
    g.drawImage(p.img, p.schritt * m.zw, p.reihe * m.zh, m.zw, m.zh, p.X - m.ax * k, p.Y - m.ay * k, m.zw * k, m.zh * k);
  }

  /* Liste der sichtbaren Boote und Leute (für szene.js, wie leute.sichtbar) */
  BO.sichtbar = function (Z) {
    const aus = [];
    BO.aktiv = jahrOk() && Z.nacht < 0.5;
    if (!BO.aktiv) return aus;
    if (!BO.boote.length) setzen();
    const rand = 80 * K.dpr, draussen = (P) => P[0] < -rand || P[0] > K.W + rand || P[1] < -rand || P[1] > K.H + rand * 2;
    const kl = klein(), zahl = kl ? 2 : BO.boote.length;
    for (let i = 0; i < zahl; i++) {
      const b = BO.boote[i], P = ST.proj(b.x, b.y, 0);
      if (draussen(P)) continue;
      const name = "l_tretboot" + (kl ? 0 : b.art) + "_sommer_tag", meta = LB.vz[name];
      if (!meta) continue;
      const img = LB.bild(name); if (!img) continue;
      const gier = Math.atan2(-Math.cos(b.h), Math.sin(b.h)) * 180 / Math.PI + K.dreh * 90;
      const r = ST.drehXY(b.x, b.y, K.dreh);
      aus.push({ X: P[0], Y: P[1], a: r[0], b: r[1], img: img, meta: meta, reihe: ((Math.round(gier / 45) % 8) + 8) % 8,
        schritt: Math.floor(((BO.t * 0.3 + b.ph) % 1) * meta.n) % meta.n, malen: bootMalen, bx: 1.6, bh: 2 });
    }
    if (kl) return aus;
    for (const s of BO.baden) {
      const P = ST.proj(s.x, s.y, 0); if (draussen(P)) continue;
      const r = ST.drehXY(s.x, s.y, K.dreh);
      aus.push({ X: P[0], Y: P[1], a: r[0], b: r[1], s: s, Z: Z, malen: schwimmerMalen, bx: 1, bh: 0.6 });
    }
    for (const m of BO.liegen) {
      const P = ST.proj(m.x, m.y, 0); if (draussen(P)) continue;
      const r = ST.drehXY(m.x, m.y, K.dreh);
      aus.push({ X: P[0], Y: P[1], a: r[0], b: r[1], s: m, Z: Z, malen: wieseMalen, bx: m.art === 1 ? 1.4 : 1, bh: m.art === 1 ? 2.2 : 0.8 });
    }
    return aus;
  };

  /* Flach auf dem Wasser, vor allen Dingen: Kielspur und Ringwellen */
  BO.wasser = function (g, t, Z) {
    if (!BO.aktiv || !BO.boote.length) return;
    const k = K.s, kl = klein(), zahl = kl ? 2 : BO.boote.length;
    g.save(); g.lineCap = "round";
    const hellW = Z.nacht > 0.3 ? "200,215,230" : "240,248,252";
    for (let i = 0; i < zahl; i++) {
      const b = BO.boote[i];
      if (!b.spur.length) continue;
      const P0 = ST.proj(b.x, b.y, 0);
      if (P0[0] < -12 * k || P0[0] > K.W + 12 * k || P0[1] < -12 * k || P0[1] > K.H + 12 * k) continue;
      /* zwei Wellenarme schräg nach hinten, dazu der Schaum des Schaufelrads */
      g.lineWidth = Math.max(0.6, 0.06 * k);
      for (const seite of [-1, 1]) {
        let vor = null;
        const pkt = [[b.x - Math.cos(b.h) * 1.2, b.y - Math.sin(b.h) * 1.2, b.h, BO.t]].concat(b.spur);
        for (const q of pkt) {
          const alter = BO.t - q[3]; if (alter > 7) break;
          const off = 0.55 + alter * 0.24, nx = -Math.sin(q[2]) * off * seite, ny = Math.cos(q[2]) * off * seite;
          const P = ST.proj(q[0] - Math.cos(q[2]) * 1.2 + nx, q[1] - Math.sin(q[2]) * 1.2 + ny, 0);
          if (vor) { g.strokeStyle = "rgba(" + hellW + "," + (0.42 * (1 - alter / 7) * Math.min(1, b.v / 0.4)).toFixed(3) + ")"; g.beginPath(); g.moveTo(vor[0], vor[1]); g.lineTo(P[0], P[1]); g.stroke(); }
          vor = P;
        }
      }
      if (b.v > 0.12) {
        /* Schaum vom Schaufelrad am Heck: weich auslaufend */
        const h = ST.proj(b.x - Math.cos(b.h) * 1.55, b.y - Math.sin(b.h) * 1.55, 0), r = 0.45 * k;
        const gr = g.createRadialGradient(h[0], h[1], 0, h[0], h[1], r);
        gr.addColorStop(0, "rgba(" + hellW + "," + (0.3 * Math.min(1, b.v / 0.5)).toFixed(3) + ")"); gr.addColorStop(1, "rgba(" + hellW + ",0)");
        g.save(); g.translate(h[0], h[1]); g.scale(1, 0.5); g.translate(-h[0], -h[1]);
        g.fillStyle = gr; g.beginPath(); g.arc(h[0], h[1], r, 0, TAU); g.fill(); g.restore();
      }
    }
    if (!kl) for (const s of BO.baden) {
      const P = ST.proj(s.x, s.y, 0);
      if (P[0] < -4 * k || P[0] > K.W + 4 * k || P[1] < -4 * k || P[1] > K.H + 4 * k) continue;
      g.lineWidth = Math.max(0.6, 0.035 * k);
      for (let j = 0; j < 3; j++) {
        const ph = (t * 0.35 + j / 3 + s.i * 0.17) % 1, r = (0.35 + ph * 1.5) * (s.art === 3 ? 1.4 : 1);
        g.strokeStyle = "rgba(" + hellW + "," + (0.4 * (1 - ph)).toFixed(3) + ")";
        g.beginPath(); g.ellipse(P[0], P[1], r * k, r * k * 0.5, 0, 0, TAU); g.stroke();
      }
    }
    g.restore();
  };
})();
