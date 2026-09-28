/* =====================================================================
   BAUKASTEN-STADT — DIE KUH (lebendes Modell, gebacken als Laufblatt)
   ---------------------------------------------------------------------
   XANDER: „Tiere im Dorf: Hühner, Kühe, Schweine – nachts nicht
   draußen". Realistisch, tagsüber Leben im Dorf.

   Zwei Rassen, wie man sie auf deutschen Weiden sieht:
     kuh        Holstein-Friesian (Schwarzbunte): weiß mit großen
                schwarzen Platten (Muster aus der Saat), schwarzer Kopf
                mit weißer Blesse, weiße Beine und Schwanzquaste,
                rosa Euter, ohne Hörner (enthornt, wie heute üblich)
     kuh_braun  Braunvieh: graubraun, am Rücken heller (Aalstrich),
                helles „Mehlmaul" um das dunkle Flotzmaul, kurze helle
                Hörner mit dunklen Spitzen, dunkle Klauen

   MASSE (echte Holsteinkuh): Widerrist 1,43 m, vom Flotzmaul bis zu den
   Sitzbeinhöckern 2,4 m, Rumpf 0,6 m breit, Bauch 0,6 m über dem Boden,
   Vorderfußwurzel (Karpalgelenk) 0,42 m, Sprunggelenk 0,5 m hoch.
   Lokal: x = rechts, y = vorn (Blickrichtung), z = oben, Ursprung am
   Boden unter der Rumpfmitte – wie die Menschen (menschen.js).

   GEZEICHNET mit ST.gestalt (stadt/himmel.js) wie die Menschen und das
   Rentier: Rumpf als EINE Hülle aus Ellipsoiden (Brust, Widerrist,
   Tonne, Hüfthöcker, Keule), die schwarzen Platten als harte Flecken auf
   der Haut (nur auf der Seite, die man sieht), Hals mit Wamme, Kopf als
   Keil aus Stirn, Gesicht und Maul, Ohren quer, Beine aus Kapseln.

   DER GANG (Viertakt wie beim echten Rind, lateral: hinten links, vorn
   links, hinten rechts, vorn rechts, je ¼ Takt versetzt): jeder Huf steht
   ⅔ des Takts fest am Boden und wandert dabei gleichmäßig nach hinten
   (kein Rutschen), im Schwung hebt er sich 12 cm. Ein Doppelschritt misst
   1,21 m – tiere.js schiebt die Phase genau um die gelaufene Strecke
   weiter. Die Gelenke kommen aus einer Zweigelenk-Kette: vorn knickt der
   Ellbogen nach hinten und im Schwung das Vorderfußwurzelgelenk, hinten
   das Knie nach vorn und das Sprunggelenk nach hinten. Der Kopf nickt mit
   jedem Vorderschritt, der Schwanz pendelt.

   DAS LAUFBLATT (werkzeug/stadt-backen.js, backplan.json „leute"):
   20 Bilder je Richtung – 12 Bilder Gehen, 6 Bilder Grasen (Kopf am
   Boden, reißt Gras und schwenkt dabei den Kopf), 2 Bilder Stehen
   (Kopf oben, Schwanz schlägt). Die Phase o._m.ph = Bild / 20 wählt es.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const GS = ST.gestalt;
  if (!GS) { console.error("kuh.js braucht ST.gestalt aus stadt/himmel.js"); return; }
  const V = GS.v, plus = V.plus, minus = V.minus, mal = V.mal, pkt = V.pkt, kreuz = V.kreuz, einheit = V.einheit, mix = V.mix, klemm = V.klemm;
  const TAU = Math.PI * 2;
  const AUGE = ST.ZUM_AUGE;
  /* Aufbau des Laufblatts: Gehen, Grasen, Stehen (tiere.js kennt dieselben Zahlen) */
  const BLATT = [12, 6, 2];
  const SCHRITT = 1.21;            // Meter je Doppelschritt (Gangzyklus)

  /* ---------------- Rassen ---------------- */
  const RASSE = {
    holstein: { haut: [238, 236, 231], fleck: [30, 30, 33], kopf: [34, 33, 36], blesse: [236, 234, 228], maul: [84, 74, 76], ohrInnen: [196, 150, 140],
      euter: [236, 184, 172], huf: [70, 66, 64], quaste: [236, 232, 222], bein: [236, 234, 228], hoerner: false },
    braun: { haut: [140, 116, 94], fleck: [104, 86, 70], kopf: [112, 92, 76], blesse: [210, 200, 186], maul: [44, 40, 42], ohrInnen: [190, 170, 150],
      euter: [206, 160, 144], huf: [44, 40, 40], quaste: [46, 40, 38], bein: [112, 94, 80], hoerner: true }
  };

  /* Zweigelenk-Kette (wie menschen.js): Gelenk so, dass das Ende das Ziel trifft; pol zieht das Gelenk zu sich */
  function ik(S, T, L1, L2, pol) {
    const d = minus(T, S);
    let l = Math.hypot(d[0], d[1], d[2]);
    const dir = mal(d, 1 / (l || 1));
    l = klemm(l, Math.abs(L1 - L2) + 1e-3, L1 + L2 - 1e-3);
    const ca = (L1 * L1 + l * l - L2 * L2) / (2 * L1 * l), h = L1 * Math.sqrt(Math.max(0, 1 - ca * ca));
    const pp = einheit(minus(pol, mal(dir, pkt(pol, dir))));
    return [plus(S, plus(mal(dir, ca * L1), mal(pp, h))), plus(S, mal(dir, l))];
  }
  /* Fußbahn im Gangzyklus: Stand (Anteil D) gleichmäßig von +A nach −A, Schwung weich zurück nach vorn mit Hub */
  function fussBahn(p, A, D, hub) {
    p = ((p % 1) + 1) % 1;
    if (p < D) return { y: A * (1 - 2 * p / D), z: 0, sw: 0 };
    const u = (p - D) / (1 - D), e = u * u * (3 - 2 * u);
    return { y: -A + 2 * A * e, z: hub * Math.sin(Math.PI * u), sw: Math.sin(Math.PI * u) };
  }
  /* Welches Bild des Laufblatts? ph = Bild / Bildzahl */
  function bildVon(ph) {
    const N = BLATT[0] + BLATT[1] + BLATT[2], i = ((Math.round(ph * N) % N) + N) % N;
    if (i < BLATT[0]) return { art: "gehen", ph: i / BLATT[0] };
    if (i < BLATT[0] + BLATT[1]) return { art: "grasen", k: i - BLATT[0] };
    return { art: "stehen", k: i - BLATT[0] - BLATT[1] };
  }

  /* ---------------- Haltung ---------------- */
  /* Beine: [hinten links, hinten rechts, vorn links, vorn rechts]; Fuß relativ zur Grundstellung */
  const FUSS_V = 0.55, FUSS_H = -0.66;
  function haltung(b) {
    const P = { fuss: [], hub: 0, poll: null, f: null, seit: 0, schwanz: 0, kiefer: 0 };
    if (b.art === "gehen") {
      const A = 0.4, D = 0.66;
      const ph = b.ph, off = [0, 0.5, 0.25, 0.75];
      for (let i = 0; i < 4; i++) {
        const vorn = i >= 2, fb = fussBahn(ph + off[i], A, D, vorn ? 0.12 : 0.1);
        P.fuss.push({ x: (i % 2 ? -1 : 1) * (vorn ? 0.17 : 0.19), y: (vorn ? FUSS_V : FUSS_H) + fb.y, z: fb.z, sw: fb.sw });
      }
      /* der Rumpf hebt und senkt sich zweimal je Takt, der Kopf nickt mit den Vorderbeinen */
      P.hub = 0.012 * Math.cos(2 * TAU * ph);
      const nick = 0.035 * Math.sin(2 * TAU * ph + 1.2);
      P.poll = [0, 0.98 + nick * 0.4, 1.26 + nick];
      P.f = einheit([0, 0.62, -0.78]);
      P.schwanz = 0.06 * Math.sin(TAU * ph);
    } else if (b.art === "grasen") {
      /* ein Vorderbein vorgestellt, Kopf unten, reißt Gras: schwenkt langsam hin und her */
      const w = b.k / BLATT[1] * TAU, sw = Math.sin(w);
      const st = [[0.19, FUSS_H - 0.04], [-0.19, FUSS_H + 0.06], [0.17, FUSS_V + 0.18], [-0.17, FUSS_V - 0.02]];
      for (const s of st) P.fuss.push({ x: s[0], y: s[1], z: 0, sw: 0 });
      P.poll = [0.06 * sw, 1.03, 0.5 + 0.03 * Math.cos(w)];
      P.f = einheit([0.22 * sw, 0.3, -0.95]);
      P.seit = 0.12 * sw;
      P.kiefer = 0.5 + 0.5 * Math.cos(w * 2);
      P.schwanz = 0.05 * Math.sin(w + 1);
    } else {
      /* stehen: Beine ungleich belastet, Kopf oben; im zweiten Bild schlägt der Schwanz, der Kopf wendet sich */
      const st = [[0.19, FUSS_H + 0.03], [-0.19, FUSS_H - 0.06], [0.17, FUSS_V + 0.05], [-0.17, FUSS_V - 0.03]];
      for (const s of st) P.fuss.push({ x: s[0], y: s[1], z: 0, sw: 0 });
      P.poll = [b.k ? 0.05 : 0, 0.97, 1.3];
      P.f = einheit([b.k ? 0.18 : 0, 0.6, -0.8]);
      P.seit = b.k ? 0.2 : 0;
      P.schwanz = b.k ? 0.32 : 0;
    }
    return P;
  }

  /* ---------------- Holstein-Platten aus der Saat ----------------
     Jede Platte ist ein kleiner Haufen aus drei harten Flecken – so wird ihr
     Rand unregelmäßig wie beim echten Tier, nicht kreisrund. */
  function platten(saat) {
    const r = ST.zufall((saat | 0) * 7919 + 13);
    const L = [];
    const haufen = (c, ry, rz, n, flach) => {
      for (let k = 0; k < 3; k++) {
        const t = (r() - 0.5) * 1.6, f = k ? 0.45 + r() * 0.35 : 1, dy = k ? (r() - 0.5) * ry * 1.5 : 0, dz = k ? (r() - 0.5) * rz * 1.5 : 0;
        const a = flach
          ? [[ry * f, 0, 0], [0, rz * f, 0], [0, 0, 0.06]]
          : [[0.07, 0, 0], [0, Math.cos(t) * ry * f, Math.sin(t) * ry * f], [0, -Math.sin(t) * rz * f, Math.cos(t) * rz * f]];
        L.push({ c: flach ? [c[0] + dy, c[1] + dz, c[2]] : [c[0], c[1] + dy, c[2] + dz], a: a, n: n });
      }
    };
    for (const sd of [1, -1]) {
      /* Schulter, Flanke, Keule, oben an der Seite – je Seite eigen, manche fehlen */
      const orte = [[0.29, 0.34, 1.02, 0.19, 0.22], [0.34, -0.12, 0.98, 0.27, 0.23], [0.3, -0.68, 1.06, 0.2, 0.2], [0.3, 0.0, 1.18, 0.16, 0.12]];
      for (const o of orte) {
        if (r() < 0.2) continue;
        haufen([sd * o[0], o[1] + (r() - 0.5) * 0.14, o[2] + (r() - 0.5) * 0.12], o[3] * (0.75 + r() * 0.5), o[4] * (0.75 + r() * 0.5), [sd, 0, 0.15]);
      }
    }
    /* über den Rücken und auf der Kruppe */
    for (const y of [0.2, -0.35, -0.8]) if (r() < 0.6) haufen([(r() - 0.5) * 0.2, y + (r() - 0.5) * 0.1, 1.36], 0.2 + r() * 0.08, 0.13 + r() * 0.1, [0, 0, 1], true);
    return L;
  }

  /* ---------------- Die Kuh ---------------- */
  function kuh(B, o, P, rasse) {
    const R = RASSE[rasse];
    const m = o._m || { ph: 0 };
    const bild = bildVon(m.ph || 0);
    const H = haltung(bild);
    const fein = B.s > 30, sehrFein = B.s > 60, grob = B.s < 16;
    const matt = 0.32;
    const hz = H.hub;
    const sicht = (n) => klemm(pkt(B.rk(einheit(n)), AUGE) * 3 + 0.35, 0, 1);

    /* ---- Beine ---- */
    const fernSeite = pkt(B.rk([1, 0, 0]), AUGE);
    for (let i = 0; i < 4; i++) {
      const vorn = i >= 2, sd = i % 2 ? -1 : 1, fu = H.fuss[i];
      const F = [fu.x, fu.y, fu.z];
      const k = sd * fernSeite < 0 ? 0.8 : 1;           // abgewandte Beine liegen im Schatten des Rumpfs
      const t = sd * 0.003;
      const beinF = mal(R.bein, k), oben = mal(mix(R.haut, R.bein, 0.4), k);
      if (vorn) {
        const S = [sd * 0.17, 0.52, 1.0 + hz];
        /* Röhrbein: im Stand fast senkrecht (zur Schulter hin geneigt), im Schwung klappt die Fußwurzel nach hinten */
        const zurS = einheit(minus(S, F));
        let dir = einheit(mix([0, 0, 1], zurS, 0.8));
        if (fu.sw > 0) dir = einheit(mix(dir, [0, Math.sin(1.0), Math.cos(1.0)], fu.sw));
        const C = plus(F, mal(dir, 0.42));
        const [E, C2] = ik(S, C, 0.34, 0.34, [0, -1, -0.2]);
        B.glied(S, 0.14, E, 0.1, mal(R.haut, k), { tiefe: t - 0.05, matt: matt });
        B.glied(E, 0.095, C2, 0.058, oben, { tiefe: t, matt: matt });
        if (fein) B.ei(C2, [0.055, 0, 0], [0, 0.055, 0], [0, 0, 0.06], beinF, { tiefe: t + 0.002, matt: matt });
        const Fe = plus(F, plus(mal(dir, 0.11), [0, -0.02, 0]));
        B.glied(C2, 0.05, Fe, 0.044, beinF, { tiefe: t + 0.001, matt: matt });
        B.glied(Fe, 0.045, plus(F, [0, 0.02, 0.05]), 0.048, beinF, { tiefe: t + 0.002, matt: matt });
      } else {
        const Hj = [sd * 0.19, -0.62, 1.05 + hz];
        const zurH = einheit(minus(Hj, F));
        let dir = einheit(mix(einheit([0, -0.25, 1]), zurH, 0.6));
        if (fu.sw > 0) dir = einheit(mix(dir, einheit([0, -0.8, 1]), fu.sw * 0.7));
        const Hk = plus(F, mal(dir, 0.5));
        const [Kn, Hk2] = ik(Hj, Hk, 0.34, 0.34, [0, 1, 0]);
        B.glied(Hj, 0.15, Kn, 0.115, mal(R.haut, k), { tiefe: t - 0.05, matt: matt });
        B.glied(Kn, 0.11, Hk2, 0.06, oben, { tiefe: t, matt: matt });
        if (fein) B.ei(plus(Hk2, [0, -0.02, 0]), [0.05, 0, 0], [0, 0.06, 0], [0, 0, 0.055], beinF, { tiefe: t + 0.002, matt: matt });
        const Fe = plus(F, plus(mal(dir, 0.12), [0, -0.02, 0]));
        B.glied(Hk2, 0.05, Fe, 0.044, beinF, { tiefe: t + 0.001, matt: matt });
        B.glied(Fe, 0.045, plus(F, [0, 0.02, 0.05]), 0.048, beinF, { tiefe: t + 0.002, matt: matt });
      }
      /* Klaue: gespalten, dunkel */
      const hd = einheit([0, 1, fu.sw * 0.6]);
      if (grob || !fein) B.ei(plus(F, [0, 0.03, 0.04]), [0.055, 0, 0], mal(hd, 0.075), [0, 0, 0.045], R.huf, { tiefe: t + 0.004 });
      else for (const z of [1, -1]) B.ei(plus(F, [z * 0.026, 0.035, 0.04]), [0.028, 0, 0], mal(hd, 0.07), [0, 0, 0.045], mal(R.huf, z * sd > 0 ? 1 : 0.85), { tiefe: t + 0.004 + z * 0.0005, glanz: sehrFein ? 0.2 : 0 });
    }
    /* Umgebungsverdeckung, wo die Beine aus dem Rumpf kommen */
    if (fein) for (const sd of [1, -1]) {
      B.ao([sd * 0.16, 0.5, 0.66 + hz], [0.12, 0, 0], [0, 0.14, 0], 0.35, { tiefe: -0.04 });
      B.ao([sd * 0.18, -0.64, 0.74 + hz], [0.14, 0, 0], [0, 0.18, 0], 0.3, { tiefe: -0.04 });
    }

    /* ---- Euter ---- */
    B.ei([0, -0.48, 0.66 + hz], [0.16, 0, 0], [0, 0.2, 0], [0, 0, 0.13], R.euter, { tiefe: -0.08, matt: 0.2 });
    if (fein) for (const [x, y] of [[0.07, -0.4], [-0.07, -0.4], [0.07, -0.58], [-0.07, -0.58]]) B.glied([x, y, 0.58 + hz], 0.022, [x * 1.1, y, 0.5 + hz], 0.017, mal(R.euter, 0.92), { tiefe: -0.07 });

    /* ---- Rumpf ---- eine Hülle: Brust, Widerrist, Tonne, Rücken, Hüfthöcker, Keule, Sitzbeinhöcker */
    const flecken = [];
    if (rasse === "holstein" && !grob) {
      for (const p of platten(o.saat || 7)) {
        const v = sicht(p.n); if (v < 0.05) continue;
        flecken.push({ c: p.c.map((x, i) => i === 2 ? x + hz : x), a: p.a, alb: R.fleck, n: p.n, k: v, hart: 0.95 });
      }
    } else if (!grob) {
      /* Braunvieh: Aalstrich hell, Flanken und Hals dunkler, Bauch hell */
      flecken.push({ c: [0, -0.2, 1.37 + hz], a: [[0.08, 0, 0], [0, 0.8, 0], [0, 0, 0.05]], alb: mix(R.haut, [230, 220, 204], 0.5), n: [0, 0, 1], k: 0.7 });
      flecken.push({ c: [0, -0.1, 0.64 + hz], a: [[0.3, 0, 0], [0, 0.5, 0], [0, 0, 0.08]], alb: mix(R.haut, [220, 210, 196], 0.45), n: [0, 0, -1], k: 0.8 });
      for (const sd of [1, -1]) {
        const v = sicht([sd, 0, 0]);
        if (v > 0.05) flecken.push({ c: [sd * 0.29, 0.38, 1.0 + hz], a: [[0.06, 0, 0], [0, 0.22, 0], [0, 0, 0.3]], alb: R.fleck, n: [sd, 0.3, 0], k: 0.55 * v });
      }
    }
    if (fein) for (const sd of [1, -1]) {
      /* Flankenmulde vor der Keule und Rippenschatten: weich, dunkler */
      const v = sicht([sd, 0, 0]);
      if (v > 0.05) flecken.push({ c: [sd * 0.3, -0.36, 0.88 + hz], a: [[0.05, 0, 0], [0, 0.06, 0], [0, 0, 0.16]], alb: mal(R.haut, 0.7), n: [sd, 0.3, 0], k: 0.35 * v });
    }
    B.koerper([
      { c: [0, 0.44, 1.02 + hz], a: [[0.26, 0, 0], [0, 0.34, 0], [0, 0, 0.36]] },     // Brust
      { c: [0, 0.4, 1.3 + hz], a: [[0.15, 0, 0], [0, 0.26, 0], [0, 0, 0.13]] },       // Widerrist
      { c: [0, -0.1, 0.98 + hz], a: [[0.33, 0, 0], [0, 0.56, 0], [0, 0, 0.37]] },     // Tonne
      { c: [0, -0.2, 1.27 + hz], a: [[0.24, 0, 0], [0, 0.6, 0], [0, 0, 0.1]] },       // Rückenlinie
      { c: [0.23, -0.5, 1.27 + hz], r: 0.085 }, { c: [-0.23, -0.5, 1.27 + hz], r: 0.085 },   // Hüfthöcker
      { c: [0, -0.72, 1.08 + hz], a: [[0.27, 0, 0], [0, 0.3, 0], [0, 0, 0.3]] },      // Keule
      { c: [0, -0.94, 1.24 + hz], a: [[0.13, 0, 0], [0, 0.09, 0], [0, 0, 0.1]] }      // Sitzbeinhöcker
    ], R.haut, { matt: matt, flecken: flecken.length ? flecken : null, fell: sehrFein ? { n: 120, laenge: 0.05, richtung: [0, -1, -0.2], a: 0.14, saat: (o.saat || 7) + 3 } : null });

    /* ---- Schwanz mit Quaste ---- */
    {
      const sw = H.schwanz, a0 = [0, -0.98, 1.3 + hz];
      const pts = [a0, [sw * 0.3, -1.04, 1.12 + hz], [sw * 0.75, -1.05, 0.86 + hz], [sw * 1.0, -1.04, 0.62 + hz]];
      B.band(pts, 0.05, rasse === "holstein" ? R.haut : R.haut, { breite2: 0.03, tiefe: -0.01 });
      B.ei(plus(pts[3], [sw * 0.05, 0, -0.08]), [0.045, 0, 0], [0, 0.045, 0], [0, 0, 0.12], R.quaste, { tiefe: -0.009, matt: 0.5 });
    }

    /* ---- Hals mit Wamme ---- */
    const Pp = plus(H.poll, [0, 0, hz]), f = H.f;
    const xh = einheit(minus([1, 0, 0], mal(f, pkt([1, 0, 0], f))));
    const uh = einheit(kreuz(xh, f));             // Stirn/Nasenrücken (vorn oben)
    const kopfF = rasse === "holstein" ? R.kopf : R.kopf;
    const halsF = rasse === "holstein" ? R.haut : mix(R.haut, R.fleck, 0.4);
    const halsTop = plus(Pp, plus(mal(f, -0.02), mal(uh, -0.08)));
    const hfl = [];
    if (rasse === "holstein" && fein) {
      /* Holstein: der Hals oben meist schwarz (an den Kopf anschließend), unten weiß */
      const hm = mix([0, 0.66, 1.16 + hz], halsTop, 0.62);
      for (const sd of [1, -1, 0]) {
        const n = sd ? [sd, 0, 0.2] : [0, 0.3, 1], v = sicht(n); if (v < 0.05) continue;
        hfl.push({ c: plus(hm, [sd * 0.12, 0, 0.03]), a: [[sd ? 0.06 : 0.16, 0, 0], [0, 0.2, 0], [0, 0, 0.2]], alb: R.fleck, n: n, k: v, hart: 0.9 });
      }
    }
    B.koerper([
      { c: [0, 0.6, 1.1 + hz], a: [[0.22, 0, 0], [0, 0.24, 0], [0, 0, 0.3]] },
      { c: halsTop, a: [[0.14, 0, 0], [0, 0.14, 0], [0, 0, 0.16]] }
    ], halsF, { matt: matt, tiefe: 0.02, flecken: hfl.length ? hfl : null });
    /* Wamme: die lose Haut unter dem Hals */
    B.koerper([
      { c: [0, 0.74, 0.8 + hz], a: [[0.07, 0, 0], [0, 0.14, 0], [0, 0, 0.12]] },
      { c: mix([0, 0.74, 0.8 + hz], halsTop, 0.45), a: [[0.07, 0, 0], [0, 0.1, 0], [0, 0, 0.08]] }
    ], mix(halsF, R.haut, 0.3), { matt: matt, tiefe: 0.021 });

    /* ---- Kopf ---- Keil aus Stirn, Gesicht und Maul (entlang f vom Genick zum Flotzmaul) */
    const K = (a, b, c) => plus(Pp, plus(mal(f, a), plus(mal(uh, b), mal(xh, c))));
    const E = (c, ra, rb, rc) => ({ c: c, a: [mal(xh, ra), mal(f, rb), mal(uh, rc)] });
    const kfl = [];
    if (fein && rasse === "holstein") kfl.push({ c: K(0.24, 0.085, 0), a: [mal(xh, 0.045), mal(f, 0.2), mal(uh, 0.03)], alb: R.blesse, n: uh, k: 1, hart: 0.8 });
    if (fein && rasse === "braun") kfl.push({ c: K(0.44, 0.0, 0), a: [mal(xh, 0.1), mal(f, 0.06), mal(uh, 0.09)], alb: R.blesse, n: f, k: 0.9, hart: 0.6 });
    B.koerper([E(K(0.08, -0.01, 0), 0.13, 0.14, 0.11), E(K(0.29, 0.0, 0), 0.095, 0.19, 0.09), E(K(0.47, -0.01, 0), 0.098, 0.085, 0.08)], kopfF, { matt: matt, tiefe: 0.03, flecken: kfl.length ? kfl : null });
    /* Flotzmaul mit Nasenlöchern, das Maul kaut */
    B.ei(K(0.545, 0.015, 0), mal(xh, 0.078), mal(f, 0.025), mal(uh, 0.055), R.maul, { tiefe: 0.032, glanz: sehrFein ? 0.35 : 0 });
    if (fein) {
      for (const sd of [1, -1]) B.ei(K(0.56, 0.02, sd * 0.033), mal(xh, 0.014), mal(f, 0.008), mal(uh, 0.02), [24, 20, 20], { tiefe: 0.033 });
      B.ei(K(0.44, -0.07 - 0.015 * H.kiefer, 0), mal(xh, 0.06), mal(f, 0.06), mal(uh, 0.025), mix(kopfF, R.maul, 0.3), { tiefe: 0.029 });
    }
    /* Augen, Ohren (quer abstehend, innen heller), Hörner beim Braunvieh */
    for (const sd of [1, -1]) {
      if (fein) B.kugel(K(0.15, 0.03, sd * 0.105), 0.022, [22, 16, 14], { tiefe: 0.034, glanz: sehrFein ? 0.8 : 0.4 });
      if (grob) continue;
      const ohr = K(0.02, -0.03, sd * 0.2), oq = einheit(plus(mal(xh, sd), [0, 0, -0.25]));
      const on = einheit(kreuz(oq, f));
      B.ei(ohr, mal(oq, 0.1), mal(f, 0.055), mal(on, 0.018), kopfF, { tiefe: 0.031, matt: matt });
      if (fein && sicht(on) > 0.2) B.ei(plus(ohr, mal(on, 0.008)), mal(oq, 0.075), mal(f, 0.038), mal(on, 0.01), R.ohrInnen, { tiefe: 0.0312 });
      if (R.hoerner) {
        const h0 = K(0.0, 0.06, sd * 0.09), h1 = plus(h0, plus(mal(xh, sd * 0.09), [0, 0.02, 0.06])), h2 = plus(h1, plus(mal(xh, sd * 0.02), plus(mal(f, 0.05), [0, 0, 0.07])));
        B.band([h0, h1, h2], 0.04, [226, 214, 190], { breite2: 0.018, tiefe: 0.035 });
        B.band([mix(h1, h2, 0.6), h2], 0.02, [50, 44, 40], { breite2: 0.01, tiefe: 0.036 });
      }
    }
  }

  /* ---------------- Anmeldung als lebendes Modell ---------------- */
  function buehne(o, P, rasse) {
    const m = o._m || (o._m = { ph: 0 });
    const O = P.proj(0, 0, 0);
    if (o._b && o._b.jetzt === ST.jetzt && o._b.s === P.s && o._b.x === O[0] && o._b.y === O[1] && o._b.ph === m.ph) return o._b.B;
    const B = new GS.Buehne({ s: P.s, X0: O[0], Y0: O[1], Z: P.Z, jahr: P.jahr });
    B.rahmen(GS.modellRahmen(P.c, P.sn));
    B.gruppe(0);
    kuh(B, o, P, rasse);
    o._b = { jetzt: ST.jetzt, s: P.s, x: O[0], y: O[1], ph: m.ph, B: B };
    return B;
  }
  /* weicher Kontaktschatten unter dem Rumpf: drei Flecken längs des Körpers */
  function kontakt(sg, P) {
    for (const [y, r] of [[0.55, 0.42], [-0.05, 0.5], [-0.62, 0.44]]) {
      const O = P.proj(0, y, 0);
      sg.save(); sg.translate(O[0], O[1]); sg.scale(1, 0.5);
      const gr = sg.createRadialGradient(0, 0, 0, 0, 0, r * P.s);
      gr.addColorStop(0, "rgba(0,0,0,0.42)"); gr.addColorStop(1, "rgba(0,0,0,0)");
      sg.fillStyle = gr; sg.fillRect(-r * P.s, -r * P.s, 2 * r * P.s, 2 * r * P.s);
      sg.restore();
    }
  }
  function modell(id, rasse, name) {
    ST.modell(id, {
      name: name, gruppe: "Deko", versteckt: true, live: true, ueberall: true, grund: [0.8, 2.4], hoehe: 1.5, blatt: BLATT, schritt: SCHRITT,
      zeichnen: function (g, P) { buehne(P.objekt, P, rasse).malen(g); },
      schatten: function (sg, P) { const B = buehne(P.objekt, P, rasse); kontakt(sg, P); sg.save(); B.schattenMalen(sg); sg.restore(); },
      /* Werkbank (stadt.html?werkbank=kuh&dazu=kuh): geht auf der Stelle */
      bewegen: function (o, dt) { const m = o._m || (o._m = { ph: 0 }); m.ph = (m.ph + dt * 0.7 / SCHRITT * BLATT[0] / (BLATT[0] + BLATT[1] + BLATT[2])) % (BLATT[0] / (BLATT[0] + BLATT[1] + BLATT[2])); }
    });
  }
  modell("kuh", "holstein", "Holsteinkuh");
  modell("kuh_braun", "braun", "Braunviehkuh");
})();
