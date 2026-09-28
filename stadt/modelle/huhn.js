/* =====================================================================
   BAUKASTEN-STADT — HUHN UND HAHN (lebende Modelle, gebacken)
   ---------------------------------------------------------------------
   XANDER: „Tiere im Dorf: Hühner, Kühe, Schweine – nachts nicht
   draußen".

     huhn  braune Legehenne: rotbraunes Gefieder, am Hals heller (gold-
           braune Halsfedern), Schwanz dunkler und aufgestellt, kleiner
           roter Kamm und Kehllappen, hornfarbener Schnabel, gelbe Beine
     hahn  bunter Landhahn: goldorange Hals- und Sattelfedern, rotbrauner
           Rücken und Flügelbug, schwarze Brust, grün schimmernde
           Sichelfedern im Bogen, großer gezackter Kamm, lange Kehllappen;
           aufrecht, ein Viertel größer als die Henne

   MASSE: Henne 0,4 m lang und bis zum Kamm 0,42 m hoch, Hahn bis zum
   Kamm 0,55 m. Lokal wie die Menschen: x = rechts, y = vorn, z = oben,
   Ursprung am Boden unter dem Körper.

   GANG: zweibeinig, jeder Fuß 60 % des Takts am Boden, Doppelschritt
   0,2 m (Henne) – tiere.js schiebt die Phase um die gelaufene Strecke
   weiter. Der Kopf „ruckt" wie beim echten Huhn: er bleibt stehen, bis
   der Körper aufholt, dann schnellt er vor. Im Schwung krümmen sich die
   Zehen.

   LAUFBLATT: 16 Bilder je Richtung – 8 Gehen, 6 Picken (Körper kippt
   vor, Kopf zum Boden, pickt, wieder hoch und schaut), 2 Stehen.
   Gezeichnet mit ST.gestalt (stadt/himmel.js) wie kuh.js.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const GS = ST.gestalt;
  if (!GS) { console.error("huhn.js braucht ST.gestalt aus stadt/himmel.js"); return; }
  const V = GS.v, plus = V.plus, minus = V.minus, mal = V.mal, pkt = V.pkt, kreuz = V.kreuz, einheit = V.einheit, mix = V.mix, klemm = V.klemm;
  const TAU = Math.PI * 2;
  const AUGE = ST.ZUM_AUGE;
  const BLATT = [8, 6, 2];

  const FARBE = {
    huhn: { koerper: [150, 78, 38], hals: [196, 122, 58], ruecken: [128, 64, 30], fluegel: [118, 60, 30], schwanz: [84, 44, 24], brust: [160, 86, 42], bauch: [174, 116, 70] },
    hahn: { koerper: [140, 50, 24], hals: [222, 144, 50], ruecken: [150, 54, 24], fluegel: [120, 40, 20], schwanz: [26, 38, 32], brust: [36, 32, 30], bauch: [40, 36, 34] }
  };
  const KAMM = [206, 34, 36], SCHNABEL = [214, 178, 104], BEIN = [222, 184, 84], AUGE_F = [196, 110, 30];

  function fussBahn(p, A, D, hub) {
    p = ((p % 1) + 1) % 1;
    if (p < D) return { y: A * (1 - 2 * p / D), z: 0, sw: 0 };
    const u = (p - D) / (1 - D), e = u * u * (3 - 2 * u);
    return { y: -A + 2 * A * e, z: hub * Math.sin(Math.PI * u), sw: Math.sin(Math.PI * u) };
  }
  function bildVon(ph) {
    const N = BLATT[0] + BLATT[1] + BLATT[2], i = ((Math.round(ph * N) % N) + N) % N;
    if (i < BLATT[0]) return { art: "gehen", ph: i / BLATT[0] };
    if (i < BLATT[0] + BLATT[1]) return { art: "picken", k: i - BLATT[0] };
    return { art: "stehen", k: i - BLATT[0] - BLATT[1] };
  }

  /* Haltung: Füße, Körperneigung (Nase runter < 0), Kopfort und -richtung */
  function haltung(b, hahn) {
    const P = { fuss: [], kipp: hahn ? 0.18 : 0, hub: 0, kopf: null, blick: [0, 1, 0], schwanz: 0 };
    const kopfOben = hahn ? [0, 0.1, 0.44] : [0, 0.11, 0.38];
    if (b.art === "gehen") {
      const A = 0.05;
      for (let i = 0; i < 2; i++) { const fb = fussBahn(b.ph + i * 0.5, A, 0.6, 0.035); P.fuss.push({ x: i ? -0.035 : 0.035, y: 0.01 + fb.y, z: fb.z, sw: fb.sw }); }
      /* Kopfrucken: zweimal je Takt bleibt der Kopf zurück und schnellt dann vor */
      const h = (b.ph * 2) % 1, ruck = h < 0.75 ? 0.025 - h / 0.75 * 0.05 : -0.025 + (h - 0.75) / 0.25 * 0.05;
      P.kopf = plus(kopfOben, [0, ruck, -0.004]);
      P.hub = 0.006 * Math.cos(2 * TAU * b.ph);
      P.kipp += -0.08;
      P.schwanz = 0.04 * Math.sin(TAU * b.ph);
    } else if (b.art === "picken") {
      for (let i = 0; i < 2; i++) P.fuss.push({ x: i ? -0.035 : 0.035, y: i ? -0.02 : 0.03, z: 0, sw: 0 });
      /* 0 oben, 1 halb, 2 am Boden, 3 pickt, 4 halb hoch, 5 oben und schaut zur Seite */
      const tief = [0.15, 0.6, 1, 1, 0.55, 0][b.k];
      P.kipp += -0.9 * tief;
      P.kopf = mix(kopfOben, [b.k === 3 ? 0.01 : 0, hahn ? 0.14 : 0.15, 0.035], tief);
      P.blick = einheit(mix([b.k === 5 ? 0.5 : 0, 1, 0], [0, 0.45, -0.9], tief));
    } else {
      for (let i = 0; i < 2; i++) P.fuss.push({ x: i ? -0.04 : 0.04, y: i ? -0.005 : 0.015, z: 0, sw: 0 });
      P.kopf = plus(kopfOben, [b.k ? 0.015 : 0, 0, 0.01]);
      P.blick = einheit([b.k ? -0.6 : 0.2, 1, 0]);
    }
    return P;
  }

  function vogel(B, o, hahn) {
    const m = o._m || { ph: 0 };
    const H = haltung(bildVon(m.ph || 0), hahn);
    const F = FARBE[hahn ? "hahn" : "huhn"];
    const G = hahn ? 1.18 : 1;                   // Größe
    const fein = B.s > 30, sehrFein = B.s > 60, grob = B.s < 20;
    const matt = 0.45, hz = H.hub;
    const sicht = (n) => klemm(pkt(B.rk(einheit(n)), AUGE) * 3 + 0.35, 0, 1);
    /* Körper um die Querachse kippen (Drehpunkt über den Füßen) */
    const piv = [0, -0.01, 0.2 * G], ca = Math.cos(H.kipp), sa = Math.sin(H.kipp);
    const dreh = (v) => [v[0], v[1] * ca - v[2] * sa, v[1] * sa + v[2] * ca];
    const Kp = (p) => plus(plus(piv, dreh(minus(mal(p, G), piv))), [0, 0, hz]);
    const Ka = (a) => a.map((v) => dreh(mal(v, G)));
    const ell = (c, a) => ({ c: Kp(c), a: Ka(a) });

    /* ---- Beine: Unterschenkel (befiedert) im Körper, Lauf gelb, drei Zehen vorn, eine hinten ---- */
    const hock = (hahn ? 0.13 : 0.105) * G;
    for (let i = 0; i < 2; i++) {
      const fu = H.fuss[i], sd = i ? -1 : 1, t = sd * 0.002;
      const Fp = [fu.x * G, fu.y * G, fu.z];
      const Hk = [fu.x * G * 1.05, 0.5 * fu.y * G - 0.02 * G, hock + fu.z * 0.6 + hz];
      B.glied(Kp([sd * 0.04, -0.02, 0.19]), 0.036 * G, plus(Hk, [0, 0, 0.02 * G]), 0.02 * G, mix(F.bauch, F.koerper, 0.5), { tiefe: t - 0.01, matt: matt });
      B.glied(Hk, 0.011 * G, plus(Fp, [0, 0, 0.012]), 0.009 * G, BEIN, { tiefe: t, matt: 0.2 });
      if (!grob) {
        const zl = (0.05 - 0.025 * fu.sw) * G, zz = 0.012 * fu.sw;
        for (const w of [-0.5, 0, 0.5]) B.band([plus(Fp, [0, 0, 0.006]), plus(Fp, [Math.sin(w) * zl, Math.cos(w) * zl, 0.004 + zz])], 0.008 * G, BEIN, { tiefe: t + 0.001, breite2: 0.005 * G });
        B.band([plus(Fp, [0, 0, 0.006]), plus(Fp, [0, -0.022 * G, 0.004])], 0.007 * G, BEIN, { tiefe: t + 0.001 });
      }
    }

    /* ---- Körper: Brust, Rumpf, Rücken, Bauchflaum ---- */
    const fl = [];
    if (fein) {
      fl.push({ c: Kp([0, 0.02, 0.15]), a: Ka([[0.07, 0, 0], [0, 0.1, 0], [0, 0, 0.03]]), alb: F.bauch, n: [0, 0, -1], k: 0.8 });
      fl.push({ c: Kp([0, 0.08, 0.22]), a: Ka([[0.07, 0, 0], [0, 0.03, 0], [0, 0, 0.07]]), alb: F.brust, n: [0, 1, 0], k: 0.9 });
      if (sehrFein || B.s > 40) {
        /* Federzeichnung: helle Säume als kleine Tupfen über dem Rumpf */
        const r = ST.zufall((o.saat || 3) * 17 + (hahn ? 5 : 1));
        for (let j = 0; j < 14; j++) {
          const sd = r() < 0.5 ? 1 : -1, c = [sd * 0.085, -0.1 + r() * 0.18, 0.2 + r() * 0.08], v = sicht([sd, 0, 0.3]);
          if (v > 0.1) fl.push({ c: Kp(c), a: Ka([[0.01, 0, 0], [0, 0.018, 0], [0, 0, 0.008]]), alb: mix(F.koerper, [236, 210, 170], 0.35), n: [sd, 0, 0.3], k: 0.55 * v });
        }
      }
    }
    B.koerper([
      ell([0, 0.06, 0.225], [[0.085, 0, 0], [0, 0.085, 0], [0, 0, 0.085]]),
      ell([0, -0.02, 0.23], [[0.095, 0, 0], [0, 0.13, 0], [0, 0, 0.095]]),
      ell([0, -0.11, 0.265], [[0.075, 0, 0], [0, 0.08, 0], [0, 0, 0.075]]),
      ell([0, -0.05, 0.17], [[0.07, 0, 0], [0, 0.08, 0], [0, 0, 0.055]])
    ], F.koerper, { matt: matt, flecken: fl.length ? fl : null, fell: sehrFein ? { n: 50, laenge: 0.02, richtung: [0, -1, -0.3], a: 0.25, saat: 4 } : null });
    /* Sattel und Rücken */
    B.ei(Kp([0, -0.08, 0.3]), ...Ka([[0.05, 0, 0], [0, 0.08, 0], [0, 0, 0.022]]), hahn ? mix(F.hals, F.ruecken, 0.35) : F.ruecken, { matt: matt, tiefe: 0.005 });
    /* Flügel an beiden Seiten */
    for (const sd of [1, -1]) {
      B.koerper([ell([sd * 0.083, 0.0, 0.25], [[0.022, 0, 0], [0, 0.06, 0], [0, 0, 0.055]]), ell([sd * 0.075, -0.11, 0.26], [[0.018, 0, 0], [0, 0.05, 0], [0, 0, 0.035]])], F.fluegel,
        { matt: matt, tiefe: 0.004, flecken: fein ? [{ c: Kp([sd * 0.09, -0.05, 0.22]), a: Ka([[0.02, 0, 0], [0, 0.08, 0], [0, 0, 0.012]]), alb: mix(F.fluegel, [230, 200, 150], 0.4), n: [sd, 0, 0], k: 0.6 * sicht([sd, 0, 0]) }] : null });
    }
    /* ---- Schwanz ---- */
    const sw = H.schwanz;
    if (hahn) {
      /* Sichelfedern: große Bögen nach oben und hinten, grün schimmernd */
      for (const [x, h, l] of [[0.02, 0.19, 0.34], [-0.025, 0.16, 0.3], [0.0, 0.12, 0.24]]) {
        const pts = [];
        for (let j = 0; j <= 6; j++) { const u = j / 6, w = u * Math.PI * 0.95; pts.push(Kp([x + sw * u, -0.13 - Math.sin(w * 0.9) * l * 0.6 - u * 0.05, 0.3 + Math.sin(w) * h - u * u * 0.08])); }
        B.band(pts, 0.036 * G, F.schwanz, { breite2: 0.01 * G, tiefe: -0.01, glanz: 0.5 });
      }
      B.ei(Kp([0, -0.15, 0.3]), ...Ka([[0.04, 0, 0], [0, 0.05, 0], [0, 0, 0.05]]), F.schwanz, { matt: 0.3, tiefe: -0.008 });
    } else {
      const d = einheit([sw, -0.5, 0.86]);
      B.ei(Kp([sw * 0.05, -0.16, 0.33]), ...Ka([[0.035, 0, 0], mal(d, 0.085), mal(einheit(kreuz([1, 0, 0], d)), 0.045)]), F.schwanz, { matt: matt, tiefe: -0.008 });
    }

    /* ---- Hals und Kopf ---- */
    const Hd = plus(mal(H.kopf, G), [0, 0, hz]);
    const f = einheit(H.blick), xh = einheit(minus([1, 0, 0], mal(f, pkt([1, 0, 0], f)))), uh = einheit(kreuz(xh, f));
    const halsFuss = Kp([0, 0.07, 0.28]);
    B.koerper([{ c: halsFuss, r: 0.05 * G }, { c: plus(Hd, [0, -0.012, -0.025 * G]), r: 0.033 * G }], F.hals,
      { matt: matt, tiefe: 0.01, fell: sehrFein ? { n: 24, laenge: 0.02, richtung: minus(halsFuss, Hd), a: 0.3, saat: 7 } : null });
    const Kk = (a, b, c) => plus(Hd, plus(mal(f, a * G), plus(mal(uh, b * G), mal(xh, c * G))));
    B.kugel(Hd, 0.033 * G, hahn ? F.hals : F.hals, { matt: 0.4, tiefe: 0.015 });
    /* Gesicht rot (Henne nur um das Auge), Schnabel, Kamm, Kehllappen */
    if (fein) for (const sd of [1, -1]) {
      const v = sicht(plus(mal(xh, sd), mal(f, 0.3)));
      if (v < 0.1) continue;
      B.ei(Kk(0.008, 0.002, sd * 0.024), mal(xh, 0.012 * G), mal(f, 0.02 * G), mal(uh, 0.016 * G), KAMM, { tiefe: 0.016 });
      B.kugel(Kk(0.012, 0.008, sd * 0.03), 0.007 * G, AUGE_F, { tiefe: 0.017 });
      B.kugel(Kk(0.014, 0.008, sd * 0.034), 0.0038 * G, [18, 12, 10], { tiefe: 0.018, glanz: 0.6 });
    }
    B.glied(Kk(0.028, -0.004, 0), 0.011 * G, Kk(0.058, -0.012, 0), 0.003 * G, SCHNABEL, { tiefe: 0.019 });
    const kammH = hahn ? 0.045 : 0.018, zacken = hahn ? 5 : 4;
    const kp = [];
    for (let j = 0; j < zacken; j++) {
      const u = j / (zacken - 1);
      kp.push({ c: Kk(0.02 - u * 0.045, 0.03 + (0.3 + 0.7 * Math.sin(u * Math.PI)) * kammH * 0.7, 0), r: (hahn ? 0.013 : 0.009) * G });
    }
    kp.push({ c: Kk(0.0, 0.028, 0), a: [mal(xh, 0.006 * G), mal(f, 0.03 * G), mal(uh, 0.01 * G)] });
    B.koerper(kp, KAMM, { tiefe: 0.02, matt: 0.2 });
    const lappen = hahn ? 0.03 : 0.016;
    for (const sd of [1, -1]) B.ei(Kk(0.03, -0.03 - lappen * 0.5, sd * 0.007), mal(xh, 0.006 * G), mal(f, 0.012 * G), mal(uh, lappen * G), KAMM, { tiefe: 0.018 });
  }

  function buehne(o, P, hahn) {
    const m = o._m || (o._m = { ph: 0 });
    const O = P.proj(0, 0, 0);
    if (o._b && o._b.jetzt === ST.jetzt && o._b.s === P.s && o._b.x === O[0] && o._b.y === O[1] && o._b.ph === m.ph) return o._b.B;
    const B = new GS.Buehne({ s: P.s, X0: O[0], Y0: O[1], Z: P.Z, jahr: P.jahr });
    B.rahmen(GS.modellRahmen(P.c, P.sn));
    B.gruppe(0);
    vogel(B, o, hahn);
    o._b = { jetzt: ST.jetzt, s: P.s, x: O[0], y: O[1], ph: m.ph, B: B };
    return B;
  }
  function kontakt(sg, P, r) {
    const O = P.proj(0, 0, 0);
    sg.save(); sg.translate(O[0], O[1]); sg.scale(1, 0.5);
    const gr = sg.createRadialGradient(0, 0, 0, 0, 0, r * P.s);
    gr.addColorStop(0, "rgba(0,0,0,0.5)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    sg.fillStyle = gr; sg.fillRect(-r * P.s, -r * P.s, 2 * r * P.s, 2 * r * P.s);
    sg.restore();
  }
  const NB = BLATT[0] + BLATT[1] + BLATT[2];
  function modell(id, hahn, name, schritt) {
    ST.modell(id, {
      name: name, gruppe: "Deko", versteckt: true, live: true, ueberall: true, grund: [0.3, 0.4], hoehe: hahn ? 0.55 : 0.42, blatt: BLATT, schritt: schritt,
      zeichnen: function (g, P) { buehne(P.objekt, P, hahn).malen(g); },
      schatten: function (sg, P) { const B = buehne(P.objekt, P, hahn); kontakt(sg, P, hahn ? 0.2 : 0.17); sg.save(); B.schattenMalen(sg); sg.restore(); },
      bewegen: function (o, dt) { const m = o._m || (o._m = { ph: 0 }); m.ph = (m.ph + dt * 0.35 / schritt * BLATT[0] / NB) % (BLATT[0] / NB); }
    });
  }
  modell("huhn", false, "Legehenne", 0.2);
  modell("hahn", true, "Hahn", 0.24);
})();
