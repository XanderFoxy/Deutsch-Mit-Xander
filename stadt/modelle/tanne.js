/* =====================================================================
   BAUKASTEN-STADT — TANNE (Nordmanntanne und Fichte)
   ---------------------------------------------------------------------
   XANDER: „Das soll keine Comic Grafik sein. Das soll noch viel mehr am
   Realismus dran sein." · „Richtig filigran. Richtig schön ausarbeiten
   mit schönen Texturen." · „Man soll sie in jedem Winkel aufstellen
   können." · „dass wir das später in einen Frühlingsgewand packen können."

   WIE DIE TANNE ENTSTEHT
   Kein flaches Bild, sondern ein kleiner Baum im Raum (Meter): ein
   Stamm, darauf Astquirle (Etagen). Jeder Ast ist ein flacher Wedel wie
   bei einer echten Tanne – der Hauptast und links und rechts Seitenzweige,
   die nach vorn zeigen und je nach Art mehr oder weniger herabhängen.
   Alles wird für den Blickwinkel gedreht, von hinten nach vorn gemalt
   und einzeln belichtet: links oben Sonne, rechts Schatten, innen am
   Stamm dunkel (Selbstschatten), außen die hellen Triebspitzen.

   Winter: Schneepolster liegen oben auf jedem Ast (dick in der Mitte,
   an den Rändern dünn, an der Schattenseite bläulich), einzelne Zapfen.
   Frühling: kein Schnee, dafür die hellgrünen Maitriebe an den Spitzen.

   Varianten über o.saat: Art (Nordmanntanne dunkel und dicht, Fichte
   heller mit hängenden Zweigen), Höhe 8–16 m, Schlankheit, Schiefstand,
   Dichte, einseitiger Wuchs, Lücken – im Wald sieht keine aus wie die
   andere.

   Detailstufen nach Pixel je Meter (s): unter 20 nur die Wedel mit
   gezackten Rändern, ab 20 die Seitenzweige als Struktur, ab 55 einzelne
   Nadeln und Rindenschuppen, ab 90 Glitzern im Schnee.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const KX = ST.KX, KY = ST.KY, KZ = ST.KZ, LICHT = ST.LICHT;
  /* Schattenrichtung am Boden je Meter Höhe (Kameraraum) */
  const SX = -LICHT[0] / LICHT[2], SY = -LICHT[1] / LICHT[2];

  /* ---------------- Blick: Modellpunkt → Bildpunkt ----------------
     Ursprung = Fußpunkt des Baums im Bild, s = Pixel je Meter.
     tief = Nähe zum Betrachter (größer = weiter vorn). */
  function blick(gier, s) {
    const r = gier * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
    return {
      s: s,
      p(q) { const a = q[0] * c - q[1] * sn, b = q[0] * sn + q[1] * c; return [(a - b) * KX * s, (a + b) * KY * s - q[2] * KZ * s]; },
      tief(q) { const a = q[0] * c - q[1] * sn, b = q[0] * sn + q[1] * c; return (a + b) * 0.6124 + q[2] * 0.5; },
      n(x, y, z) { return [x * c - y * sn, x * sn + y * c, z]; },
      boden(q) { const a = q[0] * c - q[1] * sn + SX * q[2], b = q[0] * sn + q[1] * c + SY * q[2]; return [(a - b) * KX * s, (a + b) * KY * s]; }
    };
  }
  function lichtAuf(n, Z, jahr) { return ST.lichtFaktor(ST.norm(n), Z, 0, jahr); }
  function farbe(c, lf, k, a) {
    const r = Math.min(255, c[0] * lf[0] * k), g = Math.min(255, c[1] * lf[1] * k), b = Math.min(255, c[2] * lf[2] * k);
    return a == null ? "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")" : "rgba(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + "," + a.toFixed(3) + ")";
  }
  function pfad(g, pts) {
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    g.closePath();
  }
  /* weicher Umriss: Mittelpunkte der Kanten als Stützpunkte, Ecken als Kontrollpunkte */
  function weichPfad(g, pts) {
    const n = pts.length;
    g.beginPath();
    g.moveTo((pts[n - 1][0] + pts[0][0]) / 2, (pts[n - 1][1] + pts[0][1]) / 2);
    for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n]; g.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); }
    g.closePath();
  }
  /* Vieleck an den laufenden Pfad hängen – immer im Uhrzeigersinn (wie
     ellipse()), damit sich beim Füllen alles vereinigt statt Löcher zu geben */
  function vieleckDazu(g, pts) {
    let fl = 0;
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; fl += a[0] * b[1] - b[0] * a[1]; }
    if (fl < 0) pts = pts.slice().reverse();
    g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    g.closePath();
  }
  function bez(P0, P1, P2, t) {
    const u = 1 - t, a = u * u, b = 2 * u * t, c = t * t;
    return [P0[0] * a + P1[0] * b + P2[0] * c, P0[1] * a + P1[1] * b + P2[1] * c, P0[2] * a + P1[2] * b + P2[2] * c];
  }
  const plus = (p, v, k) => [p[0] + v[0] * k, p[1] + v[1] * k, p[2] + v[2] * k];

  /* =====================================================================
     BAUPLAN — einmal je Saat gerechnet (Meter, Modellraum)
     ===================================================================== */
  const PLAENE = new Map();
  function bauplan(saat) {
    const schl = saat >>> 0;
    if (PLAENE.has(schl)) return PLAENE.get(schl);
    const R = ST.zufall((schl ^ 0x5bd1e995) + 17);
    const fichte = R() < 0.4;
    const H = 8 + R() * 8;
    const kroneU = 0.5 + R() * 1.3 + (H - 8) * 0.07;           // Stamm unten frei
    const schlank = fichte ? 0.20 + R() * 0.05 : 0.25 + R() * 0.06;
    const R0 = H * schlank;                                        // Kronenradius unten
    const neig = [(R() - 0.5) * 0.045, (R() - 0.5) * 0.045];      // Schiefstand je Meter
    const bieg = [(R() - 0.5) * 0.004, (R() - 0.5) * 0.004];      // leichte Krümmung
    const asymW = R() * Math.PI * 2, asymK = 0.06 + R() * 0.16;    // einseitiger Wuchs
    const dichte = 0.85 + R() * 0.3;
    const luecken = 0.03 + R() * 0.1;
    const ton = (R() - 0.5) * 2;                                   // Farbton-Streuung
    const achse = (z) => [neig[0] * z + bieg[0] * z * z, neig[1] * z + bieg[1] * z * z, z];
    const r0 = 0.09 + H * 0.0105;
    const stammR = (z) => {
      let r = r0 * (1 - 0.92 * z / H);
      if (z < 0.4) r *= 1 + 0.55 * Math.pow(1 - z / 0.4, 2);        // Wurzelanlauf
      return Math.max(0.012, r);
    };
    const hang = fichte ? 0.55 + R() * 0.35 : 0.12 + R() * 0.1;     // wie stark Seitenzweige hängen

    /* Farben (Werkstoff bei weißem Licht) */
    const t3 = (c, k) => [c[0] * (1 - 0.05 * k * ton), c[1] * (1 + 0.03 * k * ton), c[2] * (1 + 0.07 * k * ton)];
    const stil = fichte ? {
      tief: t3([20, 34, 22], 1), dunkel: t3([36, 58, 34], 1), mittel: t3([56, 86, 46], 1), hell: t3([88, 120, 62], 1),
      unter: [104, 130, 104], rinde: [118, 80, 60], rindeD: [70, 44, 32], trieb: [150, 196, 82]
    } : {
      tief: t3([16, 32, 26], 1), dunkel: t3([28, 54, 42], 1), mittel: t3([42, 78, 58], 1), hell: t3([66, 108, 78], 1),
      unter: [118, 148, 140], rinde: [112, 106, 100], rindeD: [64, 60, 58], trieb: [140, 192, 96]
    };

    const zweige = [];
    let z = kroneU, quirl = 0;
    const abstand = (0.42 + R() * 0.12) * Math.pow(H / 12, 0.3);
    const dickeW = fichte ? 0.08 + R() * 0.05 : 0.14 + R() * 0.08;   // Dicke eines Wedels (Unterseite)
    let rMax = 0.5;
    while (z < H - 0.25) {
      const u = (z - kroneU) / (H - kroneU);
      const anz = fichte ? 6 + Math.floor(R() * 2) : 7 + Math.floor(R() * 3);
      const dreh = R() * Math.PI * 2;
      /* Profil: Kegel, bei der Nordmanntanne unten etwas bauchiger */
      let prof = Math.pow(1 - u, fichte ? 1.0 : 0.9);
      if (u < 0.1) prof *= 0.88 + 1.2 * u;                           // unterste Etage etwas kürzer
      for (let k = 0; k < anz; k++) {
        if (u < 0.85 && R() < luecken) continue;                     // fehlender Ast = Lücke
        const phi = dreh + k / anz * Math.PI * 2 + (R() - 0.5) * 0.5;
        let L = R0 * prof * (0.82 + R() * 0.32) * (1 + asymK * Math.cos(phi - asymW)) * dichte;
        L = Math.max(0.18, L);
        const z0 = z + (R() - 0.5) * 0.1;
        const P0 = achse(z0);
        const dir = [Math.cos(phi), Math.sin(phi), 0], seite = [-Math.sin(phi), Math.cos(phi), 0];
        /* Neigung: oben steiler aufwärts, unten waagerecht bis hängend */
        let e0, e1;
        if (fichte) { e0 = -0.28 + 0.8 * u + (R() - 0.5) * 0.12; e1 = -0.3 + 0.7 * u + (R() - 0.5) * 0.1; }
        else { e0 = 0.05 + 0.6 * u + (R() - 0.5) * 0.1; e1 = -0.1 + 0.55 * u + (R() - 0.5) * 0.08; }
        const P1 = plus(plus(P0, dir, L * 0.5), [0, 0, 1], L * 0.5 * Math.tan(e0));
        const P2 = plus(plus(P0, dir, L), [0, 0, 1], L * Math.tan(e1));
        if (fichte) P2[2] += L * 0.08;                                 // Spitze aufgebogen
        /* Seitenzweige: breit an der Basis, zur Spitze kürzer – ein flacher Wedel */
        const nl = Math.max(2, Math.round(L / 0.17 * (0.9 + 0.2 * R())));
        const latMax = fichte ? Math.min(0.95, 0.12 + 0.34 * L) : Math.min(1.3, 0.12 + 0.44 * L);
        const lat = [];
        for (let j = 0; j < nl; j++) {
          const t = 0.08 + 0.86 * (j + 0.5) / nl + (R() - 0.5) * 0.3 / nl;
          const Q = bez(P0, P1, P2, t);
          const ll = latMax * Math.pow(1 - t, 0.8) * (0.84 + 0.32 * R()) + 0.06;
          for (const sd of [1, -1]) {
            const al = 1.08 + (R() - 0.5) * 0.3;          // ~62° nach vorn
            const h = [dir[0] * Math.cos(al) + seite[0] * sd * Math.sin(al), dir[1] * Math.cos(al) + seite[1] * sd * Math.sin(al), 0];
            const T = [Q[0] + h[0] * ll, Q[1] + h[1] * ll, Q[2] - ll * hang * (0.75 + 0.5 * R())];
            lat.push({ t: t, sd: sd, Q: Q, T: T, ll: ll });
          }
        }
        /* Umriss des Wedels: links die Zweigspitzen aufwärts, Spitze, rechts
           zurück. Zwischen zwei Spitzen nur eine flache Kerbe – der Wedel
           ist dicht, nur der Rand ist gefranst. */
        const links = lat.filter((l) => l.sd === 1), rechts = lat.filter((l) => l.sd === -1);
        const um = [plus(P0, seite, 0.05), plus(P0, seite, -0.05)].slice(0, 1);
        const kerbe = (A, B) => { const m = bez(P0, P1, P2, (A.t + B.t) / 2), k = 0.8; return [(A.T[0] + B.T[0]) / 2 * k + m[0] * (1 - k), (A.T[1] + B.T[1]) / 2 * k + m[1] * (1 - k), (A.T[2] + B.T[2]) / 2 * k + m[2] * (1 - k) + 0.02]; };
        for (let j = 0; j < links.length; j++) { if (j) um.push(kerbe(links[j - 1], links[j])); um.push(links[j].T); }
        const spitze = plus(P2, dir, 0.1 + L * 0.04);
        um.push(kerbe(links[links.length - 1], { t: 1, T: spitze }));
        um.push(spitze);
        um.push(kerbe({ t: 1, T: spitze }, rechts[rechts.length - 1]));
        for (let j = rechts.length - 1; j >= 0; j--) { um.push(rechts[j].T); if (j) um.push(kerbe(rechts[j], rechts[j - 1])); }
        const dicke = dickeW * (0.6 + 0.4 * Math.min(1, L / 2)) * (0.8 + 0.4 * R());
        /* Schneepolster oben auf dem Ast */
        const schnee = (0.6 + 0.4 * R()) * (u > 0.82 ? 0.6 : 1) * (R() < 0.06 ? 0 : 1);
        const pad = [], padU = [];
        if (schnee > 0.05) {
          const m = 12, t0 = 0.04, t1 = 0.88;
          const L1 = [], R1 = [];
          const brR = fichte ? 0.42 : 0.78;
          const dick = (0.06 + 0.1 * schnee) * Math.min(1, 0.45 + L / 2.2);
          const huckel = R() * 10;
          for (let k = 0; k <= m; k++) {
            const t = t0 + (t1 - t0) * k / m;
            const Q = bez(P0, P1, P2, t);
            const ll = latMax * Math.pow(1 - t, 0.8) + 0.05;
            const form = 0.5 + 0.5 * Math.sin(Math.PI * Math.min(1, (t - t0) / (t1 - t0) * 0.85 + 0.15));
            for (const sd of [1, -1]) {
              const w = ll * Math.sin(1.08) * brR * schnee * form * (0.7 + 0.6 * ST.rausch(huckel + k * 0.8 + sd * 5, 1.3, 3));
              const vor = ll * Math.cos(1.08) * brR * 0.6;
              const d = dick * (0.55 + 0.45 * Math.sin(Math.PI * (k / m) * 0.9 + 0.1)) * (0.8 + 0.4 * ST.rausch(huckel + k, 7, 5));
              const p = [Q[0] + seite[0] * sd * w + dir[0] * vor, Q[1] + seite[1] * sd * w + dir[1] * vor, Q[2] - w * hang * 0.6 + 0.01];
              (sd > 0 ? L1 : R1).push({ p: p, d: d * 0.5 });
            }
          }
          const kopf = bez(P0, P1, P2, Math.min(1, t1 + 0.06)), fuss = bez(P0, P1, P2, t0);
          const alle = [{ p: fuss, d: dick * 0.35 }].concat(L1, [{ p: [kopf[0], kopf[1], kopf[2] + 0.01], d: dick * 0.25 }], R1.reverse());
          for (const e of alle) { pad.push([e.p[0], e.p[1], e.p[2] + e.d]); padU.push([e.p[0], e.p[1], e.p[2] - 0.015]); }
        }
        /* Zapfen: oben, einzeln */
        const zapfen = [];
        if (u > 0.62 && u < 0.95 && R() < (fichte ? 0.25 : 0.16)) {
          const t = 0.55 + R() * 0.3, Q = bez(P0, P1, P2, t);
          zapfen.push({ p: Q, haengt: fichte, l: fichte ? 0.13 + R() * 0.05 : 0.12 + R() * 0.05 });
        }
        const reich = Math.hypot(P2[0], P2[1]) + latMax * 0.5;
        rMax = Math.max(rMax, reich);
        zweige.push({ z0: z0, u: u, phi: phi, L: L, P0: P0, P1: P1, P2: P2, dir: dir, seite: seite, lat: lat, um: um, dicke: dicke, pad: pad, padU: padU, schnee: schnee, zapfen: zapfen, mitte: bez(P0, P1, P2, 0.55) });
      }
      quirl++;
      z += abstand * (1 - 0.3 * u) * (0.85 + 0.3 * R());
    }
    /* Wipfeltrieb */
    const wipfel = { von: achse(H - 0.9), bis: achse(H + 0.15) };
    /* tote Aststummel am freien Stamm */
    const stummel = [];
    const nst = Math.floor(kroneU / 0.35);
    for (let i = 0; i < nst; i++) {
      const zz = 0.5 + R() * Math.max(0.1, kroneU - 0.5), phi = R() * Math.PI * 2, l = 0.12 + R() * 0.35;
      stummel.push({ a: achse(zz), phi: phi, l: l, e: -0.2 + R() * 0.4 });
    }
    const plan = { fichte, H, kroneU, R0, rMax, zweige, achse, stammR, stil, wipfel, stummel, hang };
    PLAENE.set(schl, plan);
    return plan;
  }

  /* =====================================================================
     MALEN
     ===================================================================== */
  function tanneMalen(g, s, F, plan, gier) {
    const B = blick(gier, s);
    const Z = F.Z, jahr = F.jahr, winter = jahr === "winter", st = plan.stil;
    const fein = s >= 20, nadeln = s >= 55, glitzer = s >= 90;
    const nOben = lichtAuf([0, 0, 1], Z, jahr);

    /* --- Boden am Stamm: Nadelstreu, im Winter eine schneefreie Mulde --- */
    {
      const r = 0.35 + plan.R0 * 0.18;
      g.save(); g.scale(1, 0.5);
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, r * s);
      const c = winter ? [96, 84, 70] : [92, 70, 48];
      gr.addColorStop(0, farbe(c, nOben, 0.75, winter ? 0.75 : 0.85));
      gr.addColorStop(0.6, farbe(c, nOben, 0.85, winter ? 0.35 : 0.5));
      gr.addColorStop(1, farbe(c, nOben, 1, 0));
      g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r * s, 0, Math.PI * 2); g.fill();
      g.restore();
    }

    /* --- Liste aller Teile, nach Tiefe sortiert --- */
    const teile = [];
    /* dunkler Kern (Selbstschatten innen): nur hinten */
    teile.push({ tief: -1e9, malen: () => kernMalen(g, B, plan, Z, jahr) });
    /* Stamm in Abschnitten */
    const stufen = [];
    stufen.push(0);
    for (let zz = Math.max(0.3, plan.kroneU * 0.6); zz < plan.H * 0.93; zz += 0.6) stufen.push(zz);
    stufen.push(plan.H * 0.93);
    for (let i = 0; i < stufen.length - 1; i++) {
      const z0 = stufen[i], z1 = stufen[i + 1];
      teile.push({ tief: B.tief(plan.achse((z0 + z1) / 2)) - 0.05, malen: () => stammMalen(g, B, plan, z0, z1, Z, jahr, s) });
    }
    for (const st2 of plan.stummel) teile.push({ tief: B.tief(st2.a) + 0.01, malen: () => stummelMalen(g, B, plan, st2, Z, jahr, s) });
    for (const zw of plan.zweige) teile.push({ tief: B.tief(zw.mitte), malen: () => wedelMalen(g, B, plan, zw, Z, jahr, s, fein, nadeln, glitzer, winter) });
    teile.push({ tief: B.tief(plan.wipfel.bis), malen: () => wipfelMalen(g, B, plan, Z, jahr, s, winter) });
    teile.sort((a, b) => a.tief - b.tief);
    for (const t of teile) t.malen();
  }

  /* Dunkler Kern: Kegel etwas kleiner als die Krone – Lücken zeigen
     Dunkelheit statt Schnee (so dicht ist eine Tanne innen) */
  function kernMalen(g, B, plan, Z, jahr) {
    const zU = plan.kroneU + 0.25, zO = plan.H * 0.9, rU = plan.R0 * 0.42;
    const unten = B.p(plan.achse(zU)), oben = B.p(plan.achse(zO));
    const s = B.s;
    const lf = lichtAuf(B.n(0.3, 0.3, 0.7), Z, jahr);
    g.beginPath();
    g.moveTo(oben[0], oben[1]);
    g.lineTo(unten[0] + rU * s, unten[1]);
    g.ellipse(unten[0], unten[1], rU * s, rU * s * 0.5, 0, 0, Math.PI, false);
    g.closePath();
    const gr = g.createLinearGradient(unten[0] - rU * s, 0, unten[0] + rU * s, 0);
    gr.addColorStop(0, farbe(plan.stil.dunkel, lf, 0.62));
    gr.addColorStop(1, farbe(plan.stil.tief, lf, 0.55));
    g.fillStyle = gr; g.fill();
  }

  function stammMalen(g, B, plan, z0, z1, Z, jahr, s) {
    const a = B.p(plan.achse(z0)), b = B.p(plan.achse(z1));
    const r0 = plan.stammR(z0) * s, r1 = plan.stammR(z1) * s;
    const lfL = lichtAuf(B.n(-0.7, 0.7, 0).map((v, i) => i < 2 ? v : 0), Z, jahr);
    const lfHell = lichtAuf(ST.LICHT.slice(0, 2).concat([0]), Z, jahr);
    const lfDunkel = lichtAuf([-ST.LICHT[0], -ST.LICHT[1], 0], Z, jahr);
    void lfL;
    const innen = z0 > plan.kroneU ? 0.55 : 1;       // in der Krone im Schatten
    const gr = g.createLinearGradient(a[0] - r0, 0, a[0] + r0, 0);
    gr.addColorStop(0, farbe(plan.stil.rinde, lfHell, 0.8 * innen));
    gr.addColorStop(0.35, farbe(plan.stil.rinde, lfHell, 0.95 * innen));
    gr.addColorStop(0.75, farbe(plan.stil.rinde, lfDunkel, 0.8 * innen));
    gr.addColorStop(1, farbe(plan.stil.rindeD, lfDunkel, 0.7 * innen));
    g.fillStyle = gr;
    g.beginPath();
    if (z0 < 0.05) {
      /* Wurzelanlauf: Fuß breiter, unten als Ellipsenbogen */
      const n = 6;
      g.moveTo(a[0] - r0, a[1]);
      for (let i = 1; i <= n; i++) { const zz = z0 + (z1 - z0) * i / n, p = B.p(plan.achse(zz)), r = plan.stammR(zz) * s; g.lineTo(p[0] - r, p[1]); }
      for (let i = n; i >= 0; i--) { const zz = z0 + (z1 - z0) * i / n, p = B.p(plan.achse(zz)), r = plan.stammR(zz) * s; g.lineTo(p[0] + r, p[1]); }
      g.ellipse(a[0], a[1], r0, r0 * 0.5, 0, 0, Math.PI, false);
    } else {
      g.moveTo(a[0] - r0, a[1]); g.lineTo(b[0] - r1, b[1]); g.lineTo(b[0] + r1, b[1]); g.lineTo(a[0] + r0, a[1]);
    }
    g.closePath(); g.fill();
    /* Rinde: Schuppen (Fichte) oder glatt mit feinen Rissen (Tanne) */
    if (s >= 28 && r0 > 1.6) {
      const rng = ST.zufall(((z0 * 1000) | 0) + 7);
      g.save(); g.clip();
      const h = Math.abs(a[1] - b[1]);
      const anz = Math.round(h * (r0 + r1) / (plan.fichte ? 9 : 14));
      g.lineWidth = Math.max(0.6, s * 0.006);
      for (let i = 0; i < anz; i++) {
        const k = rng(), yy = a[1] + (b[1] - a[1]) * k, rr = r0 + (r1 - r0) * k, xx = a[0] + (b[0] - a[0]) * k;
        const q = rng() * 2 - 1;
        const x = xx + q * rr * 0.95;
        const hell = q < -0.1 ? 1.25 : 0.7;
        if (plan.fichte) {
          const w = rr * (0.18 + rng() * 0.15);
          g.strokeStyle = farbe(plan.stil.rindeD, lfDunkel, 0.8 * innen * hell, 0.7);
          g.beginPath(); g.moveTo(x - w, yy); g.quadraticCurveTo(x, yy + w * 0.7, x + w, yy); g.stroke();
        } else {
          const l = s * (0.05 + rng() * 0.12);
          g.strokeStyle = farbe(plan.stil.rindeD, lfDunkel, 0.85 * innen * hell, 0.45);
          g.beginPath(); g.moveTo(x, yy); g.lineTo(x + (rng() - 0.5) * 1.5, yy - l); g.stroke();
        }
      }
      g.restore();
    }
  }

  function stummelMalen(g, B, plan, st2, Z, jahr, s) {
    if (s < 12) return;
    const e = [Math.cos(st2.phi) * Math.cos(st2.e), Math.sin(st2.phi) * Math.cos(st2.e), Math.sin(st2.e)];
    const a = B.p(st2.a), b = B.p(plus(st2.a, e, st2.l));
    g.strokeStyle = farbe(plan.stil.rindeD, lichtAuf([0, 0, 1], Z, jahr), 0.8);
    g.lineWidth = Math.max(0.8, s * 0.022); g.lineCap = "round";
    g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    if (s >= 40) {
      g.lineWidth = Math.max(0.5, s * 0.008);
      const m = B.p(plus(st2.a, e, st2.l * 0.6));
      g.beginPath(); g.moveTo(m[0], m[1]); g.lineTo(m[0] + s * 0.06, m[1] - s * 0.04); g.stroke();
    }
    g.lineCap = "butt";
  }

  /* Ein Wedel: Grundfläche mit gezacktem Umriss, dann Seitenzweige,
     Nadeln, Triebe und der Schnee oben drauf */
  function wedelMalen(g, B, plan, zw, Z, jahr, s, fein, nadeln, glitzer, winter) {
    const DBG = window.__natur || {};
    const st = plan.stil;
    const nx = zw.dir[0] * 0.78, ny = zw.dir[1] * 0.78;
    const lf = lichtAuf(B.n(nx, ny, 0.62), Z, jahr);
    /* weiter oben weniger Selbstschatten, ganz unten innen am dunkelsten */
    const ao = 0.78 + 0.22 * zw.u;
    const pts = zw.um.map(B.p);
    /* Unterseite: derselbe Umriss etwas tiefer – der Wedel hat Dicke,
       man sieht unter jeder Etage die dunkle Zweigmasse */
    const d = zw.dicke * KZ * s;
    g.fillStyle = farbe(st.tief, lf, ao * 0.85);
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1] + d * 0.4);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1] + d * (0.6 + 0.4 * ((i * 7) % 3) / 2));
    g.closePath(); g.fill();
    const a = B.p(zw.P0), e = B.p(zw.P2);
    let ex = e[0], ey = e[1];
    if (Math.hypot(ex - a[0], ey - a[1]) < 1) { ex += 1; ey += 1; }
    const gr = g.createLinearGradient(a[0], a[1], ex, ey);
    gr.addColorStop(0, farbe(st.tief, lf, ao * 0.9));
    gr.addColorStop(0.35, farbe(st.dunkel, lf, ao));
    gr.addColorStop(0.8, farbe(st.mittel, lf, ao));
    gr.addColorStop(1, farbe(st.hell, lf, ao));
    g.fillStyle = DBG.flach ? farbe(st.mittel, lf, ao) : gr;
    pfad(g, pts); g.fill();
    if (fein && !DBG.keinStrich) {
      /* Seitenzweige als Struktur: hell oben, eine dunkle Linie darunter */
      const lw = Math.max(0.6, s * 0.03);
      g.lineCap = "round";
      g.lineWidth = lw * 1.4;
      g.strokeStyle = farbe(st.tief, lf, ao * 0.9, 0.55);
      g.beginPath();
      for (const l of zw.lat) { const q = B.p(l.Q), t = B.p(l.T); g.moveTo(q[0], q[1] + lw * 0.8); g.lineTo(t[0], t[1] + lw * 0.8); }
      g.stroke();
      g.lineWidth = lw;
      g.strokeStyle = farbe(st.hell, lf, ao * 1.02, 0.6);
      g.beginPath();
      for (const l of zw.lat) { if (l.t < 0.2) continue; const q = B.p(l.Q), t = B.p(l.T); g.moveTo(q[0], q[1]); g.lineTo(t[0], t[1]); }
      g.stroke();
      if (nadeln) nadelnMalen(g, B, plan, zw, lf, ao, s);
      g.lineCap = "butt";
    }
    /* Frühling: hellgrüne Maitriebe an allen Spitzen */
    if (jahr === "fruehling" && s >= 10) {
      g.strokeStyle = farbe(st.trieb, lf, 1, 0.9);
      g.lineWidth = Math.max(0.8, s * 0.035);
      g.lineCap = "round";
      g.beginPath();
      for (const l of zw.lat) {
        if (l.t < 0.25) continue;
        const t = B.p(l.T), q = B.p(l.Q);
        const k = 0.16 / Math.max(0.05, l.ll);
        g.moveTo(t[0] + (q[0] - t[0]) * k, t[1] + (q[1] - t[1]) * k); g.lineTo(t[0], t[1]);
      }
      const sp = B.p(zw.um[Math.floor(zw.um.length / 2)]), p2 = B.p(zw.P2);
      g.moveTo(p2[0], p2[1]); g.lineTo(sp[0], sp[1]);
      g.stroke();
      g.lineCap = "butt";
    }
    if (winter && zw.pad.length && !DBG.keinSchnee) schneeMalen(g, B, plan, zw, Z, jahr, s, glitzer);
    for (const zp of zw.zapfen) zapfenMalen(g, B, plan, zp, Z, jahr, s, winter);
  }

  function nadelnMalen(g, B, plan, zw, lf, ao, s) {
    /* einzelne Nadeln entlang jedes Seitenzweigs: kurze Striche schräg nach vorn */
    const st = plan.stil;
    const nl = Math.max(1.4, s * 0.042);           // Nadellänge im Bild
    g.lineWidth = Math.max(0.5, s * 0.0075);
    const pfade = [[], []];
    for (const l of zw.lat) {
      const q = B.p(l.Q), t = B.p(l.T);
      const dx = t[0] - q[0], dy = t[1] - q[1], len = Math.hypot(dx, dy);
      if (len < 2) continue;
      const ux = dx / len, uy = dy / len;
      const schritt = Math.max(1.6, s * 0.022);
      for (let d = 0; d < len; d += schritt) {
        const x = q[0] + ux * d, y = q[1] + uy * d;
        const k = 1 - d / len * 0.45;
        for (const sd of [1, -1]) {
          const vx = ux * 0.55 - uy * sd * 0.83, vy = uy * 0.55 + ux * sd * 0.83;
          pfade[sd > 0 ? 0 : 1].push(x, y, x + vx * nl * k, y + vy * nl * k);
        }
      }
    }
    /* oben (Licht) und unten (Unterseite, silbrig bei der Nordmanntanne) */
    const farben = [farbe(st.hell, lf, ao * 1.08, 0.75), farbe(plan.fichte ? st.dunkel : st.unter, lf, ao * (plan.fichte ? 0.9 : 0.62), 0.7)];
    for (let i = 0; i < 2; i++) {
      const p = pfade[i];
      g.strokeStyle = farben[i];
      g.beginPath();
      for (let k = 0; k < p.length; k += 4) { g.moveTo(p[k], p[k + 1]); g.lineTo(p[k + 2], p[k + 3]); }
      g.stroke();
    }
  }

  /* Schneepolster: erst die bläuliche Unterseite, dann die helle Oberseite */
  function schneeMalen(g, B, plan, zw, Z, jahr, s, glitzer) {
    const oben = zw.pad.map(B.p), unten = zw.padU.map(B.p);
    const nx = zw.dir[0], ny = zw.dir[1];
    const lfSeite = lichtAuf(B.n(nx * 0.85, ny * 0.85, 0.2), Z, jahr);
    const lfOben = lichtAuf(B.n(nx * 0.45, ny * 0.45, 0.85), Z, jahr);
    const innen = 0.84 + 0.16 * zw.u;
    g.fillStyle = farbe([196, 210, 232], lfSeite, 0.92 * innen);
    weichPfad(g, unten); g.fill();
    const a = B.p(zw.P0), e = B.p(zw.P2);
    let ex = e[0], ey = e[1];
    if (Math.hypot(ex - a[0], ey - a[1]) < 1) { ex += 1; ey += 1; }
    const gr = g.createLinearGradient(a[0], a[1], ex, ey);
    gr.addColorStop(0, farbe([226, 234, 246], lfOben, innen * 0.9));
    gr.addColorStop(0.5, farbe([248, 250, 255], lfOben, innen));
    gr.addColorStop(1, farbe([252, 253, 255], lfOben, 1));
    g.fillStyle = gr;
    weichPfad(g, oben); g.fill();
    if (glitzer) {
      const rng = ST.zufall(((zw.phi * 1000) | 0) + 3);
      g.fillStyle = "rgba(255,255,255,0.95)";
      for (let i = 0; i < 6; i++) {
        const k = Math.floor(rng() * oben.length), p = oben[k], q = unten[(k + 3) % unten.length];
        const x = p[0] + (q[0] - p[0]) * rng() * 0.3, y = p[1] + (q[1] - p[1]) * rng() * 0.3;
        g.fillRect(x, y, 1.2, 1.2);
      }
    }
  }

  function zapfenMalen(g, B, plan, zp, Z, jahr, s, winter) {
    if (s < 14) return;
    const p = B.p(zp.p), l = zp.l * s, b = l * 0.34;
    const lf = lichtAuf([-0.5, 0.5, 0.5], Z, jahr);
    const c = plan.fichte ? [120, 78, 44] : [92, 64, 54];
    const cx = p[0], cy = zp.haengt ? p[1] + l * 0.55 : p[1] - l * 0.5;
    const gr = g.createLinearGradient(cx - b, 0, cx + b, 0);
    gr.addColorStop(0, farbe(c, lf, 1.15)); gr.addColorStop(1, farbe(c, lf, 0.55));
    g.fillStyle = gr;
    g.beginPath(); g.ellipse(cx, cy, b, l * 0.5, 0, 0, Math.PI * 2); g.fill();
    if (s >= 50) {
      g.strokeStyle = farbe(c, lf, 0.45, 0.8); g.lineWidth = Math.max(0.5, s * 0.004);
      for (let i = 1; i < 5; i++) { const yy = cy - l * 0.5 + l * i / 5; g.beginPath(); g.moveTo(cx - b * 0.85, yy - b * 0.25); g.quadraticCurveTo(cx, yy + b * 0.3, cx + b * 0.85, yy - b * 0.25); g.stroke(); }
    }
    if (winter && !zp.haengt) { g.fillStyle = farbe([250, 252, 255], lichtAuf([0, 0, 1], Z, jahr), 1); g.beginPath(); g.ellipse(cx, cy - l * 0.45, b * 0.9, b * 0.35, 0, 0, Math.PI * 2); g.fill(); }
  }

  function wipfelMalen(g, B, plan, Z, jahr, s, winter) {
    const a = B.p(plan.wipfel.von), b = B.p(plan.wipfel.bis);
    const lf = lichtAuf([-0.3, 0.3, 0.9], Z, jahr);
    const st = plan.stil;
    const w = Math.max(1, s * 0.07);
    g.fillStyle = farbe(st.mittel, lf, 1);
    g.beginPath(); g.moveTo(a[0] - w, a[1]); g.quadraticCurveTo(a[0] - w * 0.5, (a[1] + b[1]) / 2, b[0], b[1]); g.quadraticCurveTo(a[0] + w * 0.5, (a[1] + b[1]) / 2, a[0] + w, a[1]); g.closePath(); g.fill();
    if (jahr === "fruehling") { g.strokeStyle = farbe(st.trieb, lf, 1); g.lineWidth = Math.max(1, s * 0.04); g.beginPath(); g.moveTo(b[0], b[1] + s * 0.25); g.lineTo(b[0], b[1]); g.stroke(); }
    if (winter) { g.fillStyle = farbe([250, 252, 255], lichtAuf([0, 0, 1], Z, jahr), 1); g.beginPath(); g.ellipse(a[0], a[1] - w * 0.2, w * 1.2, w * 0.5, 0, 0, Math.PI * 2); g.fill(); }
  }

  /* ---------------- Schatten: flach auf den Boden gelegt ---------------- */
  function tanneSchatten(g, s, plan, gier) {
    const B = blick(gier, s);
    const m = g.getTransform();
    g.save();
    g.setTransform(1, 0, 0, 1, m.e, m.f);
    g.fillStyle = "#000";
    /* Alles in EINEN Pfad (ein einziges Füllen = ein Weichzeichnen):
       jedes Vieleck gleich herum, damit sich Überlappungen vereinigen */
    g.beginPath();
    const n = 6, links = [], rechts = [];
    for (let i = 0; i <= n; i++) {
      const z = plan.H * 0.95 * i / n, p = plan.achse(z), r = plan.stammR(z);
      const a = B.boden(p);
      links.push([a[0] - r * s, a[1]]); rechts.push([a[0] + r * s, a[1]]);
    }
    vieleckDazu(g, links.concat(rechts.reverse()));
    /* Kern als Scheibenstapel */
    for (let z = plan.kroneU + 0.3; z < plan.H * 0.9; z += 0.45) {
      const u = (z - plan.kroneU) / (plan.H - plan.kroneU);
      const r = plan.R0 * 0.42 * (1 - u) * s;
      const a = B.boden(plan.achse(z));
      g.moveTo(a[0] + r, a[1]);
      g.ellipse(a[0], a[1], r, r * 0.5, 0, 0, Math.PI * 2);
    }
    /* Wedel */
    for (const zw of plan.zweige) vieleckDazu(g, zw.um.map(B.boden));
    g.fill();
    g.restore();
  }

  /* =====================================================================
     MODELL
     ===================================================================== */
  ST.modell("tanne", {
    name: "Tanne", gruppe: "Natur", grund: [2.4, 2.4], hoehe: 14,
    bauen(M, o) {
      const plan = bauplan(o.saat == null ? 7 : o.saat);
      const figur = {
        x: 0, y: 0, z: 0, breite: (plan.rMax + 0.6) / 0.6, hoehe: plan.H + 0.3, schatten: true,
        malen(g, s, F) {
          if (F.schatten) { if (!(window.__natur && window.__natur.keinSchatten)) tanneSchatten(g, s, plan, figur._gier == null ? schaetzeGier(o) : figur._gier); return; }
          if (window.__natur && window.__natur.keinBild) return;
          figur._gier = F.gier || 0;
          tanneMalen(g, s, F, plan, figur._gier);
        }
      };
      M.teil("baum", { mitte: [0, 0, 1] });
      M.figur(figur);
      huelle(M, o, plan.rMax, plan.H);
    }
  });

  /* Drehung des Sprites schätzen (für den Schatten, falls der Kern sie
     nicht mitgibt): Objekt-Drehung plus Kameradrehung */
  function schaetzeGier(o) {
    return ((o.objekt && o.objekt.gier) || 0) + ((ST.kamera && ST.kamera.dreh) || 0) * 90;
  }

  /* Unsichtbare Hülle: das Sprite muss den langen Schatten mit fassen
     (der Kern rechnet bei Figuren nur die Figur selbst in die Grenzen) */
  function huelle(M, o, r, H) {
    M.teil("huelle", { schatten: false, mitte: [0, 0, -50] });
    const leer = { malen: null, keinLicht: true, keinAo: true };
    M.flaeche(Object.assign({ name: "huelle", o: [-r, -r, 0], u: [1, 0, 0], v: [0, 1, 0], w: 2 * r, h: 2 * r }, leer));
    if (!o || !o.objekt) return;
    const gr = schaetzeGier(o) * Math.PI / 180, c = Math.cos(gr), sn = Math.sin(gr);
    /* Schattenspitze im Kameraraum → Modellraum zurückdrehen */
    const a = SX * H, b = SY * H;
    const x = a * c + b * sn, y = -a * sn + b * c;
    M.flaeche(Object.assign({ name: "huelle-schatten", o: [x - 1, y - 1, 0], u: [1, 0, 0], v: [0, 1, 0], w: 2, h: 2 }, leer));
  }
})();
