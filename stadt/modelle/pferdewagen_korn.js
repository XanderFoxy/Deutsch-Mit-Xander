/* =====================================================================
   PFERDEWAGEN MIT KORNSÄCKEN (und Mehlsäcken)
   ---------------------------------------------------------------------
   XANDER: Pferdewagen nach dem Vorbild der Döbelner Pferdebahn, die in
   der Automatik Korn zur Mühle und Mehl zur Bäckerei bringen.

   Ein offener Kastenwagen (Bauern- und Mühlenfuhrwerk um 1900): Kasten
   aus blaugrau gestrichenen Bohlen mit Eisenbeschlägen, innen rohes
   Holz, Vorderräder 0,8 m, Hinterräder 1,0 m mit Holzspeichen und
   Eisenreifen, vorn der Kutschbock mit Fußbrett. Davor dasselbe
   dunkelbraune Pferd wie bei der Pferdebahn (ST.pferde aus
   pferdebahn.js), hier in der Schere (Gabeldeichsel) mit Kummet,
   Zugsträngen zum Ortscheit und Trageösen am Kammdeckel. Auf dem Bock
   sitzt der Fuhrmann in brauner Joppe mit Schiebermütze und hält die
   Leinen.

   LADUNG: pferdewagen_korn = zehn Jutesäcke mit Korn (je ≈ 50 kg,
   0,85 × 0,5 m), pferdewagen_mehl = weiße Mehlsäcke mit blauem Stempel.
   variante "leer" = ohne Ladung (Rückfahrt), "mehl"/"korn" wählt die
   Ladung auch beim anderen Namen.
   LAUFBILDER wie bei der Pferdebahn: variante "schritt0" … "schritt3"
   (kombinierbar, z. B. "mehl schritt2"); in der Werkbank saat=0…3.

   MASSE: Wagenkasten 3,2 × 1,24 m, Boden 0,95 m, Bordwand 0,47 m hoch,
   Spur 1,6 m; mit Pferd 6,4 m lang. Vorn = +y (das Pferd läuft nach +y).
   In der Werkbank: werkbank=pferdewagen_korn bzw.
   werkbank=pferdewagen_mehl&dazu=pferdewagen_korn (dann meldet start.js
   „Modell fehlt: pferdewagen_mehl" – harmlos, das Modell kommt aus
   dieser Datei).
   Braucht die Drechselbank, die Figurenwerkstatt und die
   Pferdewerkstatt aus pferdebahn.js (erst beim Bauen, nicht beim Laden).
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const TAU = Math.PI * 2;
  const rgb = (c, a) => a == null ? "rgb(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + ")" : "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + a + ")";

  /* ---------------- Maße (Meter, vorn = +y) ---------------- */
  const BY0 = -3.1, BY1 = 0.1, BW = 0.62, ZF = 0.95, ZK = 1.42, BRETT = 0.04;
  const ACHSE_H = -2.5, ACHSE_V = -0.5, R_H = 0.5, R_V = 0.4, SPUR = 0.8;
  const YH = 1.67;                                   // Ursprung des Pferdes
  const SITZ = { y0: -0.3, y1: 0.1, z: 1.62 };
  const FAHRER = [0.2, -0.12, 1.62 - 0.905 + 0.02];  // Fuhrmann (Figurursprung)
  const YQ = 0.62, ZQ = 0.95;                         // Querholz der Schere
  const YO = 0.74, ZO = 0.9;                          // Ortscheit

  /* ---------------- Farben ---------------- */
  const BLAU = [86, 108, 126], HOLZ = [150, 118, 82], HOLZ_D = [104, 78, 52], ROT = [138, 58, 40], EISEN = [52, 50, 50];
  const JUTE = [172, 140, 96], MEHL = [238, 234, 224];

  /* ---------------- Malhilfen ---------------- */
  /* Bohlenwand: waagerechte Bretter mit Fugen, Maserung, Eisenbänder */
  function bohlen(farbe, o) {
    o = o || {};
    return (g, F) => {
      const w = F.w, h = F.h;
      g.fillStyle = rgb(farbe); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
      if (PI && F.px > 10) PI.rauschen(g, 0, 0, w, h, 0.9, 0.22, o.saat || 7, 3);
      const n = Math.max(1, Math.round(h / 0.16));
      for (let i = 1; i < n; i++) { const y = i * h / n; g.fillStyle = "rgba(30,20,12,0.45)"; g.fillRect(0, y - 0.006, w, 0.012); g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(0, y + 0.006, w, 0.01); }
      if (F.px > 26) {
        /* Maserung: feine, leicht gewellte Linien */
        const rng = F.rng; g.strokeStyle = "rgba(60,40,20,0.18)"; g.lineWidth = 0.004;
        for (let i = 0; i < n * 3; i++) { const y = (i + 0.5) * h / (n * 3) + (rng() - 0.5) * 0.02; g.beginPath(); g.moveTo(0, y); for (let x = 0.2; x <= w + 0.2; x += 0.2) g.lineTo(x, y + Math.sin(x * 7 + i) * 0.006); g.stroke(); }
      }
      if (o.beschlag) {
        /* Eisenbänder und Rungen */
        for (const x of o.beschlag) {
          g.fillStyle = rgb(EISEN); g.fillRect(x - 0.03, 0, 0.06, h);
          if (F.px > 20) { g.fillStyle = "rgba(200,200,200,0.35)"; for (let y = 0.06; y < h; y += 0.14) { g.beginPath(); g.arc(x, y, 0.01, 0, TAU); g.fill(); } }
        }
      }
      if (o.rand) { g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(0, h - 0.03, w, 0.03); }
      /* abgewetzte Kanten, verblichene Farbe */
      if (PI && F.px > 12) PI.bleichen(g, 0, 0, w, h, 1.2, 0.18, (o.saat || 7) + 3);
    };
  }

  /* ---------------- Wagenkasten ---------------- */
  function kastenTeile(D, PF) {
    const innen = new D.Figur(), aussen = new D.Figur(), unter = new D.Figur();
    const hK = ZK - ZF + 0.1, L = BY1 - BY0, B = 2 * BW;
    const x0 = -BW, x1 = BW, zU = ZF - 0.1;
    const stellen = [0.3, 1.1, 2.1, 2.9];
    /* Bordwände außen: Ost (+x), West (−x), Stirn vorn (+y), hinten (−y) */
    PF.flaeche(aussen, { name: "wO", o: [x1, BY1, ZK], u: [0, -1, 0], v: [0, 0, -1], w: L, h: hK, malen: bohlen(BLAU, { beschlag: stellen, rand: true, saat: 3 }) });
    PF.flaeche(aussen, { name: "wW", o: [x0, BY0, ZK], u: [0, 1, 0], v: [0, 0, -1], w: L, h: hK, malen: bohlen(BLAU, { beschlag: stellen, rand: true, saat: 4 }) });
    PF.flaeche(aussen, { name: "wV", o: [x0, BY1, ZK], u: [1, 0, 0], v: [0, 0, -1], w: B, h: hK, malen: bohlen(BLAU, { beschlag: [0.15, B - 0.15], rand: true, saat: 5 }) });
    PF.flaeche(aussen, { name: "wH", o: [x1, BY0, ZK], u: [-1, 0, 0], v: [0, 0, -1], w: B, h: hK, malen: bohlen(BLAU, { beschlag: [0.15, B - 0.15], rand: true, saat: 6 }) });
    /* Oberkante der Bordwände (Brettstärke) */
    const kante = (g, F) => { g.fillStyle = rgb(HOLZ_D); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); };
    PF.flaeche(aussen, { name: "kO", o: [x1, BY0, ZK], u: [0, 1, 0], v: [-1, 0, 0], w: L, h: BRETT, malen: kante });
    PF.flaeche(aussen, { name: "kW", o: [x0 + BRETT, BY0, ZK], u: [0, 1, 0], v: [-1, 0, 0], w: L, h: BRETT, malen: kante });
    PF.flaeche(aussen, { name: "kV", o: [x0, BY1 - BRETT, ZK], u: [1, 0, 0], v: [0, 1, 0], w: B, h: BRETT, malen: kante });
    PF.flaeche(aussen, { name: "kH", o: [x0, BY0, ZK], u: [1, 0, 0], v: [0, 1, 0], w: B, h: BRETT, malen: kante });
    /* Innenseiten und Boden */
    const xi0 = x0 + BRETT, xi1 = x1 - BRETT, yi0 = BY0 + BRETT, yi1 = BY1 - BRETT, hI = ZK - ZF;
    PF.flaeche(innen, { name: "bo", o: [xi0, yi0, ZF], u: [1, 0, 0], v: [0, 1, 0], w: xi1 - xi0, h: yi1 - yi0, malen: bohlen(HOLZ, { saat: 9 }) });
    PF.flaeche(innen, { name: "iO", o: [xi1, yi0, ZK], u: [0, 1, 0], v: [0, 0, -1], w: yi1 - yi0, h: hI, malen: bohlen(HOLZ, { saat: 10 }) });
    PF.flaeche(innen, { name: "iW", o: [xi0, yi1, ZK], u: [0, -1, 0], v: [0, 0, -1], w: yi1 - yi0, h: hI, malen: bohlen(HOLZ, { saat: 11 }) });
    PF.flaeche(innen, { name: "iV", o: [xi1, yi1, ZK], u: [-1, 0, 0], v: [0, 0, -1], w: xi1 - xi0, h: hI, malen: bohlen(HOLZ, { saat: 12 }) });
    PF.flaeche(innen, { name: "iH", o: [xi0, yi0, ZK], u: [1, 0, 0], v: [0, 0, -1], w: xi1 - xi0, h: hI, malen: bohlen(HOLZ, { saat: 13 }) });
    /* Kutschbock: Kiste mit Sitzbrett, schräges Fußbrett */
    const sb = bohlen(BLAU, { rand: true, saat: 14 });
    PF.flaeche(innen, { name: "bockV", o: [-0.56, SITZ.y1 + 0.02, SITZ.z], u: [1, 0, 0], v: [0, 0, -1], w: 1.12, h: SITZ.z - ZK + 0.1, malen: sb });
    PF.flaeche(innen, { name: "bockH", o: [0.56, SITZ.y0, SITZ.z], u: [-1, 0, 0], v: [0, 0, -1], w: 1.12, h: SITZ.z - ZK + 0.1, malen: sb });
    for (const sx of [-1, 1]) PF.flaeche(innen, { name: "bockS" + sx, o: [sx * 0.56, sx > 0 ? SITZ.y1 + 0.02 : SITZ.y0, SITZ.z], u: [0, -sx, 0], v: [0, 0, -1], w: SITZ.y1 + 0.02 - SITZ.y0, h: SITZ.z - ZK + 0.1, malen: sb });
    PF.flaeche(innen, { name: "sitz", o: [-0.6, SITZ.y0 - 0.03, SITZ.z + 0.04], u: [1, 0, 0], v: [0, 1, 0], w: 1.2, h: SITZ.y1 - SITZ.y0 + 0.1, malen: bohlen(HOLZ_D, { saat: 15 }) });
    PF.flaeche(innen, { name: "fuss", o: [-0.52, BY1 + 0.02, ZK - 0.02], u: [1, 0, 0], v: [0, 0.83, -0.55], w: 1.04, h: 0.42, malen: bohlen(HOLZ, { saat: 16 }), beidseitig: true });
    /* Unterbau: Langbaum, Achsschemel, Achsen, Bremsklotz */
    unter.kap([0, BY0 + 0.2, zU], [0, BY1 + 0.1, zU], 0.06, 0.06, HOLZ_D, {});
    for (const [ya, r] of [[ACHSE_H, R_H], [ACHSE_V, R_V]]) {
      unter.kap([-SPUR - 0.05, ya, r], [SPUR + 0.05, ya, r], 0.05, 0.05, HOLZ_D, {});
      unter.kap([-BW + 0.05, ya, zU], [BW - 0.05, ya, zU], 0.07, 0.07, ROT, {});
      unter.strich([[-0.3, ya, zU], [-0.3, ya, r]], 0.05, HOLZ_D, {});
      unter.strich([[0.3, ya, zU], [0.3, ya, r]], 0.05, HOLZ_D, {});
    }
    return { innen: innen, aussen: aussen, unter: unter };
  }

  /* Speichenrad (durchsichtig zwischen den Speichen): Nabe, 12 Speichen,
     Felge, Eisenreifen – x = Radebene, sx = Seite */
  function rad(D, x, ya, r, sx) {
    const F = new D.Figur();
    const kreis = (rr, n) => { const p = []; for (let i = 0; i <= n; i++) { const t = i / n * TAU; p.push([x, ya + Math.cos(t) * rr, r + Math.sin(t) * rr]); } return p; };
    for (let i = 0; i < 12; i++) {
      const t = i / 12 * TAU, c = Math.cos(t), s = Math.sin(t);
      F.kap([x - sx * 0.02, ya + c * 0.09, r + s * 0.09], [x, ya + c * (r - 0.06), r + s * (r - 0.06)], 0.022, 0.015, ROT, {});
    }
    F.rohr(kreis(r - 0.035, 32), new Array(33).fill([0.035, 0.035]), ROT, { n: 8, kappen: false, b: 0.01 });
    F.rohr(kreis(r - 0.005, 32), new Array(33).fill([0.04, 0.012]), EISEN, { n: 6, kappen: false, glanz: 0.4, b: 0.012 });
    F.zyl([x - sx * 0.14, ya, r], [x + sx * 0.12, ya, r], 0.085, 0.07, ROT, { deckel: [70, 64, 60], b: 0.05 });
    F.zyl([x + sx * 0.12, ya, r], [x + sx * 0.16, ya, r], 0.05, 0.045, EISEN, { deckel: [90, 88, 86], glanz: 0.5, b: 0.06 });
    return F;
  }

  /* ---------------- Ladung ---------------- */
  function ladung(D, art, saat) {
    const F = new D.Figur();
    if (art === "leer") return F;
    const farbe = art === "mehl" ? MEHL : JUTE;
    const rng = ST.zufall(31 + (saat || 0));
    /* Sack: liegender Loft mit abgerundet-eckigem Querschnitt (Kissenform),
       Falten, am einen Ende der zugebundene Hals mit Schnur */
    const sack = (x, y, z, dreh) => {
      const c = Math.cos(dreh), s = Math.sin(dreh);
      const P = (l, q, h) => [x + q * c - l * s, y + q * s + l * c, z + h];
      const qa = [c, s, 0], qb = [0, 0, 1];
      const f = PI ? PI.streu(farbe, rng, 0.05) : farbe;
      const ring = (l, br, ho, dz, w) => ({ c: P(l, 0, dz || 0), a: D.v.mul(qa, br), b: D.v.mul(qb, ho), w: w, ph: Math.PI + rng() * 0.3 });
      const R = [ring(-0.43, 0.2, 0.07, -0.05, 0.08), ring(-0.4, 0.25, 0.12, -0.02, 0.1), ring(-0.25, 0.27, 0.15, 0, 0.09), ring(0, 0.27, 0.16, 0.005, 0.08),
        ring(0.22, 0.26, 0.15, 0, 0.09), ring(0.34, 0.21, 0.12, 0, 0.1), ring(0.42, 0.08, 0.05, 0.02, 0.05), ring(0.47, 0.05, 0.035, 0.03, 0.02), ring(0.54, 0.07, 0.04, 0.035, 0.2)];
      F.loft(R, f, { n: 14, wellen: 4, b: 0 });
      F.strich([P(0.46, -0.06, 0.07), P(0.46, 0.06, 0.07)], 0.014, [110, 88, 56], { b: 0.03, ab: 18 });
      if (art === "mehl") {
        /* Stempel der Mühle: blaues Oval mit Streifen */
        F.ellA(P(0.0, 0, 0.168), D.v.mul([-s, c, 0], 0.16), D.v.mul(qa, 0.12), [0, 0, 1], [58, 82, 150], { flach: true, b: 0.02, ab: 10 });
        F.ellA(P(0.0, 0, 0.17), D.v.mul([-s, c, 0], 0.12), D.v.mul(qa, 0.085), [0, 0, 1], MEHL, { flach: true, b: 0.025, ab: 22 });
        for (const l of [-0.04, 0.0, 0.04]) F.strich([P(l, -0.05, 0.172), P(l, 0.05, 0.172)], 0.014, [58, 82, 150], { b: 0.03, ab: 22 });
      } else {
        /* Jute: Naht längs über den Sack */
        F.strich([P(-0.36, 0.0, 0.14), P(0.3, 0.0, 0.15)], 0.008, [132, 104, 66], { b: 0.02, ab: 24 });
      }
    };
    /* untere Lage: zwei Reihen längs, je drei Säcke */
    for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) sack(sx * 0.29, -2.6 + i * 0.88, ZF + 0.15, (rng() - 0.5) * 0.1);
    /* obere Lage: vier Säcke quer versetzt */
    for (let i = 0; i < 4; i++) sack((i % 2 ? 0.14 : -0.14), -2.45 + i * 0.58, ZF + 0.43, Math.PI / 2 + (rng() - 0.5) * 0.2);
    return F;
  }

  /* ---------------- Pferd, Schere, Stränge, Leinen ---------------- */
  function gespann(D, PF, schritt) {
    const F = new D.Figur();
    F.dazu(PF.pferd({ art: "dunkelbraun", schritt: schritt, geschirr: "gabel" }), [0, YH, 0], 0, 1);
    const inM = (p) => [p[0], p[1] + YH, p[2]];
    for (const sx of [-1, 1]) {
      /* Scherbaum: vom Wagen unter dem Bock nach vorn, durch die Trageöse, Spitze leicht hoch */
      F.rohr([[sx * 0.42, 0.0, 0.78], [sx * 0.43, YQ, ZQ], [sx * 0.425, YH + 0.08, 1.12], [sx * 0.41, YH + 0.75, 1.2], [sx * 0.39, YH + 0.92, 1.27]], [0.04, 0.038, 0.034, 0.03, 0.022], HOLZ_D, { n: 8, gs: sx, glanz: 0.2 });
      const a = inM(PF.strangAnsatz(sx)), e = [sx * 0.35, YO, ZO];
      F.strich([a, [sx * 0.38, (a[1] + e[1]) / 2, (a[2] + e[2]) / 2 - 0.03], e], 0.04, PF.FARBEN.LEDER_BRAUN, { gs: sx });
      const gb = inM(PF.gebiss(sx)), ri = inM(PF.leinenRing(sx));
      const kh = PF.kutscherHand(sx), hand = [FAHRER[0] + kh[0], FAHRER[1] + kh[1], FAHRER[2] + kh[2]];
      F.strich([gb, [gb[0] + sx * 0.02, gb[1] - 0.25, gb[2] - 0.12], ri], 0.018, PF.FARBEN.LEDER_BRAUN, { gs: sx });
      F.strich(PF.haengend(ri, hand, 0.15, 8), 0.018, PF.FARBEN.LEDER_BRAUN, { gs: sx });
    }
    /* Querholz zwischen den Scherbäumen, Ortscheit */
    F.kap([-0.43, YQ, ZQ], [0.43, YQ, ZQ], 0.035, 0.035, HOLZ_D, {});
    F.kap([-0.36, YO, ZO], [0.36, YO, ZO], 0.03, 0.03, HOLZ_D, {});
    F.strich([[0, YQ, ZQ], [0, YO, ZO]], 0.02, [120, 120, 126], {});
    return F;
  }

  /* ---------------- Zusammensetzen ---------------- */
  const TEILE = new Map();
  function teile(D, PF, art, schritt, saat) {
    const k = art + "|" + schritt + "|" + saat;
    if (TEILE.has(k)) return TEILE.get(k);
    const K = kastenTeile(D, PF);
    const T = {
      kasten: K,
      raeder: [rad(D, SPUR, ACHSE_H, R_H, 1), rad(D, -SPUR, ACHSE_H, R_H, -1), rad(D, SPUR, ACHSE_V, R_V, 1), rad(D, -SPUR, ACHSE_V, R_V, -1)],
      last: ladung(D, art, saat),
      fahrer: (() => { const f = new D.Figur(); f.dazu(PF.kutscher({ fuhrmann: true, sitzen: true }), FAHRER, 0, 1); return f; })(),
      pferd: gespann(D, PF, schritt)
    };
    TEILE.set(k, T);
    return T;
  }
  function allesMalen(g, A, T, D, PF) {
    const vx = A.zumAuge([1, 0, 0]), vy = A.zumAuge([0, 1, 0]);
    const z = (f) => D.figurZeichnen(g, A, f, {});
    const nahSeite = vx >= 0 ? 1 : -1;
    const wagen = () => {
      /* ferne Räder, Unterbau, Innenseiten, Ladung, Außenwände, nahe Räder */
      for (let i = 0; i < 4; i++) if ((i % 2 === 0 ? 1 : -1) !== nahSeite) z(T.raeder[i]);
      z(T.kasten.unter);
      z(T.kasten.innen);
      if (vy < 0) z(T.fahrer);
      z(T.last);
      z(T.kasten.aussen);
      if (vy >= 0) z(T.fahrer);
      for (let i = 0; i < 4; i++) if ((i % 2 === 0 ? 1 : -1) === nahSeite) z(T.raeder[i]);
    };
    if (vy >= 0) { wagen(); PF.zeichnen(g, A, T.pferd, {}); }
    else { PF.zeichnen(g, A, T.pferd, {}); wagen(); }
  }

  function modell(id, ladungStandard, name) {
    ST.modell(id, {
      name: name, gruppe: "Fahrzeuge", grund: [2.0, 6.5], hoehe: 2.6, bauzeit: 60,
      bauen(M, o) {
        const D = ST.drechsel, PF = ST.pferde;
        if (!D || !PF) { console.error(id + ": Pferdewerkstatt fehlt (pferdebahn.js laden)"); return; }
        const v = o.variante || "";
        const art = /leer/.test(v) ? "leer" : /mehl/.test(v) ? "mehl" : /korn/.test(v) ? "korn" : ladungStandard;
        const schritt = PF.laufbild(o);
        const zustand = { gier: 0 };
        M.teil("gespann", { mitte: [0, 0, 1.2] });
        M.figur({
          x: 0, y: 0, z: 0, breite: 0.1, hoehe: 0.1, schatten: true,
          malen(g, s, F) {
            if (!F.schatten) zustand.gier = F.gier || 0;
            const A = new D.Ansicht({ s: s, gier: F.gier != null ? F.gier : zustand.gier, Z: F.Z, jahr: F.jahr, schatten: !!F.schatten });
            const T = teile(D, PF, art, schritt, (o.saat || 0) % 5);
            if (F.schatten) { D.schattenPuffer(g, (h) => allesMalen(h, A, T, D, PF)); return; }
            D.weichMalen(g, (g2) => allesMalen(g2, A, T, D, PF));
          }
        });
        M.teil("huelle", { schatten: false, mitte: [0, 0, -50] });
        const leer = { malen: null, keinLicht: true, keinAo: true };
        M.flaeche(Object.assign({ name: "h0", o: [-1.0, -3.25, 0], u: [1, 0, 0], v: [0, 1, 0], w: 2.0, h: 6.5 }, leer));
        M.flaeche(Object.assign({ name: "h1", o: [-1.0, -3.25, 2.65], u: [1, 0, 0], v: [0, 1, 0], w: 2.0, h: 6.5 }, leer));
        PF.schattenRechteck(M, o, -1.0, -3.25, 1.0, 3.25, 2.65);
        M.teil("fuss", { schatten: true, mitte: [0, -1.5, -40] });
        M.flaeche(Object.assign({ name: "fuss", o: [-BW, BY0 + 0.1, 0.01], u: [1, 0, 0], v: [0, 1, 0], w: 2 * BW, h: BY1 - BY0 - 0.2 }, leer));
      }
    });
  }
  modell("pferdewagen_korn", "korn", "Pferdewagen mit Korn");
  modell("pferdewagen_mehl", "mehl", "Pferdewagen mit Mehl");
})();
