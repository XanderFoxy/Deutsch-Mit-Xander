/* =====================================================================
   BAUKASTEN-STADT — DAS HAUSSCHWEIN (lebendes Modell, gebacken)
   ---------------------------------------------------------------------
   XANDER: „Tiere im Dorf: Hühner, Kühe, Schweine – nachts nicht
   draußen".

   Ein rosa Hausschwein der Deutschen Landrasse: langer, tiefer Rumpf mit
   kräftigem Schinken, gerader Rücken, kurze Beine mit dunklen Klauen,
   der Kopf mit geradem Rüssel und rosa Rüsselscheibe, große Schlappohren,
   die nach vorn über die Augen hängen, der Ringelschwanz. Auf der Weide
   hat es ein wenig Erde an Bauch und Beinen.

   MASSE: vom Rüssel bis zum Schinken 1,3 m, Rücken 0,72 m hoch, Bauch
   0,23 m über dem Boden, 0,48 m breit. Lokal wie die Menschen: x = rechts,
   y = vorn, z = oben, Ursprung am Boden unter der Rumpfmitte.

   GANG: Viertakt (hinten links, vorn links, hinten rechts, vorn rechts),
   jede Klaue ⅔ des Takts fest am Boden, Doppelschritt 0,43 m – tiere.js
   schiebt die Phase um die gelaufene Strecke weiter. Zweigelenk-Kette je
   Bein (vorn knickt der Ellbogen nach hinten, hinten das Knie nach vorn).

   LAUFBLATT: 16 Bilder je Richtung – 8 Gehen, 6 Wühlen (Rüssel im Boden,
   schiebt vor und zurück), 2 Stehen (Kopf oben, Schwanz ringelt).
   Gezeichnet mit ST.gestalt (stadt/himmel.js) wie kuh.js.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const GS = ST.gestalt;
  if (!GS) { console.error("schwein.js braucht ST.gestalt aus stadt/himmel.js"); return; }
  const V = GS.v, plus = V.plus, minus = V.minus, mal = V.mal, pkt = V.pkt, kreuz = V.kreuz, einheit = V.einheit, mix = V.mix, klemm = V.klemm;
  const TAU = Math.PI * 2;
  const AUGE = ST.ZUM_AUGE;
  const BLATT = [8, 6, 2];
  const SCHRITT = 0.43;

  const HAUT = [240, 188, 174], BAUCH = [246, 208, 194], RUESSEL = [228, 150, 146], KLAUE = [128, 102, 92], ERDE = [118, 94, 68], OHR = [236, 172, 160];

  function ik(S, T, L1, L2, pol) {
    const d = minus(T, S);
    let l = Math.hypot(d[0], d[1], d[2]);
    const dir = mal(d, 1 / (l || 1));
    l = klemm(l, Math.abs(L1 - L2) + 1e-3, L1 + L2 - 1e-3);
    const ca = (L1 * L1 + l * l - L2 * L2) / (2 * L1 * l), h = L1 * Math.sqrt(Math.max(0, 1 - ca * ca));
    const pp = einheit(minus(pol, mal(dir, pkt(pol, dir))));
    return [plus(S, plus(mal(dir, ca * L1), mal(pp, h))), plus(S, mal(dir, l))];
  }
  function fussBahn(p, A, D, hub) {
    p = ((p % 1) + 1) % 1;
    if (p < D) return { y: A * (1 - 2 * p / D), z: 0, sw: 0 };
    const u = (p - D) / (1 - D), e = u * u * (3 - 2 * u);
    return { y: -A + 2 * A * e, z: hub * Math.sin(Math.PI * u), sw: Math.sin(Math.PI * u) };
  }
  function bildVon(ph) {
    const N = BLATT[0] + BLATT[1] + BLATT[2], i = ((Math.round(ph * N) % N) + N) % N;
    if (i < BLATT[0]) return { art: "gehen", ph: i / BLATT[0] };
    if (i < BLATT[0] + BLATT[1]) return { art: "wuehlen", k: i - BLATT[0] };
    return { art: "stehen", k: i - BLATT[0] - BLATT[1] };
  }

  const FUSS_V = 0.31, FUSS_H = -0.31;
  function haltung(b) {
    const P = { fuss: [], hub: 0, poll: null, f: null, schwanz: 0, ohr: 0 };
    if (b.art === "gehen") {
      const off = [0, 0.5, 0.25, 0.75];
      for (let i = 0; i < 4; i++) {
        const vorn = i >= 2, fb = fussBahn(b.ph + off[i], 0.14, 0.66, 0.06);
        P.fuss.push({ x: (i % 2 ? -1 : 1) * (vorn ? 0.12 : 0.13), y: (vorn ? FUSS_V : FUSS_H) + fb.y, z: fb.z, sw: fb.sw });
      }
      P.hub = 0.008 * Math.cos(2 * TAU * b.ph);
      const nick = 0.02 * Math.sin(2 * TAU * b.ph + 1);
      P.poll = [0, 0.5, 0.58 + nick];
      P.f = einheit([0, 0.85, -0.5]);
      P.schwanz = Math.sin(TAU * b.ph) * 0.4;
      P.ohr = nick * 2;
    } else if (b.art === "wuehlen") {
      /* Rüssel im Boden: schiebt vor und zurück, dreht ein wenig */
      const w = b.k / BLATT[1] * TAU, s = Math.sin(w);
      for (const [x, y] of [[0.13, FUSS_H - 0.02], [-0.13, FUSS_H + 0.04], [0.12, FUSS_V + 0.06], [-0.12, FUSS_V]]) P.fuss.push({ x: x, y: y, z: 0, sw: 0 });
      P.poll = [0.03 * s, 0.53 + 0.03 * Math.cos(w), 0.37 + 0.02 * Math.cos(w)];
      P.f = einheit([0.18 * s, 0.45, -0.9]);
      P.schwanz = 0.5 * Math.sin(w * 2);
      P.ohr = 0.04;
    } else {
      for (const [x, y] of [[0.13, FUSS_H + 0.02], [-0.13, FUSS_H - 0.03], [0.12, FUSS_V + 0.02], [-0.12, FUSS_V - 0.02]]) P.fuss.push({ x: x, y: y, z: 0, sw: 0 });
      P.poll = [b.k ? 0.03 : 0, 0.5, 0.6];
      P.f = einheit([b.k ? 0.25 : 0, 0.86, -0.46]);
      P.schwanz = b.k ? 1 : -0.3;
    }
    return P;
  }

  function schwein(B, o) {
    const m = o._m || { ph: 0 };
    const H = haltung(bildVon(m.ph || 0));
    const fein = B.s > 30, sehrFein = B.s > 60, grob = B.s < 16;
    const matt = 0.22, hz = H.hub;
    const sicht = (n) => klemm(pkt(B.rk(einheit(n)), AUGE) * 3 + 0.35, 0, 1);
    const fernSeite = pkt(B.rk([1, 0, 0]), AUGE);

    /* ---- Beine ---- */
    for (let i = 0; i < 4; i++) {
      const vorn = i >= 2, sd = i % 2 ? -1 : 1, fu = H.fuss[i], F = [fu.x, fu.y, fu.z];
      const k = sd * fernSeite < 0 ? 0.8 : 1, t = sd * 0.003;
      const J = vorn ? [sd * 0.12, 0.3, 0.42 + hz] : [sd * 0.13, -0.31, 0.45 + hz];
      let dir = einheit(mix([0, 0, 1], einheit(minus(J, F)), 0.7));
      if (fu.sw > 0) dir = einheit(mix(dir, vorn ? [0, 0.7, 0.7] : [0, -0.6, 0.8], fu.sw * 0.8));
      const A = plus(F, mal(dir, 0.1));
      const [Kn, A2] = ik(J, A, 0.18, 0.18, vorn ? [0, -1, 0] : [0, 1, 0]);
      const hautK = mal(HAUT, k), erdeK = mal(mix(HAUT, ERDE, 0.45), k);
      B.glied(J, vorn ? 0.1 : 0.12, Kn, 0.065, hautK, { tiefe: t - 0.03, matt: matt });
      B.glied(Kn, 0.06, A2, 0.042, mal(mix(HAUT, ERDE, 0.2), k), { tiefe: t, matt: matt });
      B.glied(A2, 0.04, plus(F, [0, 0.015, 0.03]), 0.036, erdeK, { tiefe: t + 0.001, matt: matt });
      if (fein) for (const z of [1, -1]) B.ei(plus(F, [z * 0.018, 0.03, 0.024]), [0.019, 0, 0], [0, 0.036, 0], [0, 0, 0.026], mal(KLAUE, k), { tiefe: t + 0.003 });
      else B.ei(plus(F, [0, 0.03, 0.024]), [0.036, 0, 0], [0, 0.04, 0], [0, 0, 0.026], KLAUE, { tiefe: t + 0.003 });
    }
    if (fein) for (const sd of [1, -1]) B.ao([sd * 0.12, 0, 0.24 + hz], [0.1, 0, 0], [0, 0.4, 0], 0.3, { tiefe: -0.03 });

    /* ---- Rumpf ---- Schulter, Tonne, Schinken, gerader Rücken */
    const fl = [];
    if (fein) {
      fl.push({ c: [0, 0, 0.24 + hz], a: [[0.2, 0, 0], [0, 0.42, 0], [0, 0, 0.06]], alb: BAUCH, n: [0, 0, -1], k: 0.9 });
      fl.push({ c: [0, 0.05, 0.25 + hz], a: [[0.16, 0, 0], [0, 0.3, 0], [0, 0, 0.04]], alb: ERDE, n: [0, 0, -1], k: 0.35 });
      for (const sd of [1, -1]) {
        const v = sicht([sd, 0, 0]); if (v < 0.05) continue;
        /* Schinkenfalte, Schulterfalte, ein paar Erdspritzer an der Flanke */
        fl.push({ c: [sd * 0.22, -0.16, 0.44 + hz], a: [[0.04, 0, 0], [0, 0.03, 0], [0, 0, 0.14]], alb: mal(HAUT, 0.78), n: [sd, 0.3, 0], k: 0.4 * v });
        fl.push({ c: [sd * 0.22, 0.2, 0.44 + hz], a: [[0.04, 0, 0], [0, 0.025, 0], [0, 0, 0.13]], alb: mal(HAUT, 0.8), n: [sd, -0.2, 0], k: 0.35 * v });
        const r = ST.zufall((o.saat || 5) * 31 + (sd > 0 ? 1 : 2));
        for (let j = 0; j < 3; j++) fl.push({ c: [sd * 0.24, -0.3 + r() * 0.6, 0.3 + r() * 0.12 + hz], a: [[0.03, 0, 0], [0, 0.03 + r() * 0.05, 0], [0, 0, 0.02 + r() * 0.03]], alb: mix(HAUT, ERDE, 0.6), n: [sd, 0, 0], k: 0.3 * v, hart: 0.2 });
      }
    }
    B.koerper([
      { c: [0, 0.3, 0.48 + hz], a: [[0.22, 0, 0], [0, 0.2, 0], [0, 0, 0.24]] },
      { c: [0, 0, 0.47 + hz], a: [[0.24, 0, 0], [0, 0.46, 0], [0, 0, 0.24]] },
      { c: [0, -0.3, 0.48 + hz], a: [[0.24, 0, 0], [0, 0.22, 0], [0, 0, 0.25]] },
      { c: [0, -0.4, 0.6 + hz], a: [[0.17, 0, 0], [0, 0.13, 0], [0, 0, 0.12]] },
      { c: [0, -0.05, 0.65 + hz], a: [[0.18, 0, 0], [0, 0.46, 0], [0, 0, 0.07]] }
    ], HAUT, { matt: matt, flecken: fl.length ? fl : null, fell: sehrFein ? { n: 60, laenge: 0.03, richtung: [0, -1, 0], a: 0.08, saat: 5 } : null });

    /* ---- Ringelschwanz ---- */
    {
      const b0 = [0, -0.53, 0.62 + hz], pts = [b0];
      const w0 = H.schwanz;
      for (let j = 1; j <= 9; j++) {
        const th = j / 9 * TAU * 1.2, r = 0.035;
        pts.push([Math.sin(w0) * 0.03 * j / 9 + Math.sin(th) * r * 0.3, -0.56 - 0.02 * j / 9 - Math.sin(th) * r * 0.2, 0.6 + hz + Math.cos(th) * r - r - 0.03 * j / 9]);
      }
      if (!grob) B.band(pts, 0.022, mix(HAUT, RUESSEL, 0.3), { breite2: 0.014, tiefe: -0.01 });
    }

    /* ---- Kopf ---- Backe, Gesicht, Rüssel, Rüsselscheibe (entlang f) */
    const Pp = plus(H.poll, [0, 0, hz]), f = H.f;
    const xh = einheit(minus([1, 0, 0], mal(f, pkt([1, 0, 0], f)))), uh = einheit(kreuz(xh, f));
    const K = (a, b, c) => plus(Pp, plus(mal(f, a), plus(mal(uh, b), mal(xh, c))));
    const E = (c, ra, rb, rc) => ({ c: c, a: [mal(xh, ra), mal(f, rb), mal(uh, rc)] });
    /* Nacken als Übergang vom Rumpf */
    B.koerper([{ c: [0, 0.36, 0.5 + hz], a: [[0.2, 0, 0], [0, 0.14, 0], [0, 0, 0.2]] }, E(K(0.0, -0.03, 0), 0.16, 0.12, 0.15)], HAUT, { matt: matt, tiefe: 0.01 });
    B.koerper([E(K(0.04, -0.04, 0), 0.155, 0.13, 0.14), E(K(0.17, 0.0, 0), 0.1, 0.13, 0.085), E(K(0.31, -0.01, 0), 0.062, 0.075, 0.058)], HAUT, { matt: matt, tiefe: 0.02,
      flecken: fein ? [{ c: K(0.1, -0.12, 0), a: [mal(xh, 0.12), mal(f, 0.08), mal(uh, 0.04)], alb: mal(HAUT, 0.82), n: mal(uh, -1), k: 0.5 }] : null });
    B.ei(K(0.375, 0.0, 0), mal(xh, 0.062), mal(f, 0.018), mal(uh, 0.05), RUESSEL, { tiefe: 0.022, glanz: sehrFein ? 0.3 : 0 });
    if (fein) for (const sd of [1, -1]) B.ei(K(0.388, 0.0, sd * 0.022), mal(xh, 0.01), mal(f, 0.006), mal(uh, 0.014), [70, 40, 40], { tiefe: 0.023 });
    /* Augen unter den Schlappohren, Ohren hängen nach vorn */
    for (const sd of [1, -1]) {
      if (fein) B.kugel(K(0.12, 0.05, sd * 0.08), 0.013, [30, 20, 18], { tiefe: 0.024, glanz: 0.4 });
      if (grob) continue;
      const basis = K(0.0, 0.1, sd * 0.08);
      const lang = einheit(plus(mal(f, 0.75), plus(mal(xh, sd * 0.35), [0, 0, -0.35 - H.ohr])));
      const quer = einheit(kreuz(lang, [0, 0, 1])), dick = einheit(kreuz(lang, quer));
      B.ei(plus(basis, mal(lang, 0.09)), mal(lang, 0.1), mal(quer, 0.07), mal(dick, 0.014), OHR, { tiefe: 0.03, matt: 0.3 });
    }
  }

  function buehne(o, P) {
    const m = o._m || (o._m = { ph: 0 });
    const O = P.proj(0, 0, 0);
    if (o._b && o._b.jetzt === ST.jetzt && o._b.s === P.s && o._b.x === O[0] && o._b.y === O[1] && o._b.ph === m.ph) return o._b.B;
    const B = new GS.Buehne({ s: P.s, X0: O[0], Y0: O[1], Z: P.Z, jahr: P.jahr });
    B.rahmen(GS.modellRahmen(P.c, P.sn));
    B.gruppe(0);
    schwein(B, o);
    o._b = { jetzt: ST.jetzt, s: P.s, x: O[0], y: O[1], ph: m.ph, B: B };
    return B;
  }
  function kontakt(sg, P) {
    for (const [y, r] of [[0.3, 0.3], [-0.3, 0.32]]) {
      const O = P.proj(0, y, 0);
      sg.save(); sg.translate(O[0], O[1]); sg.scale(1, 0.5);
      const gr = sg.createRadialGradient(0, 0, 0, 0, 0, r * P.s);
      gr.addColorStop(0, "rgba(0,0,0,0.45)"); gr.addColorStop(1, "rgba(0,0,0,0)");
      sg.fillStyle = gr; sg.fillRect(-r * P.s, -r * P.s, 2 * r * P.s, 2 * r * P.s);
      sg.restore();
    }
  }
  const NB = BLATT[0] + BLATT[1] + BLATT[2];
  ST.modell("schwein", {
    name: "Hausschwein", gruppe: "Deko", versteckt: true, live: true, ueberall: true, grund: [0.5, 1.3], hoehe: 0.75, blatt: BLATT, schritt: SCHRITT,
    zeichnen: function (g, P) { buehne(P.objekt, P).malen(g); },
    schatten: function (sg, P) { const B = buehne(P.objekt, P); kontakt(sg, P); sg.save(); B.schattenMalen(sg); sg.restore(); },
    bewegen: function (o, dt) { const m = o._m || (o._m = { ph: 0 }); m.ph = (m.ph + dt * 0.6 / SCHRITT * BLATT[0] / NB) % (BLATT[0] / NB); }
  });
})();
