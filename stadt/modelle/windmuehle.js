/* =====================================================================
   WINDMÜHLE — Holländer-Turmwindmühle wie im alten gemalten Dorf
   ---------------------------------------------------------------------
   XANDER: „Vergiss die Windmühle nicht. Ich will den selben Look haben."
   Vorbild ist die Mühle oben links im alten Dorfbild (spiel.js, dmGebaeude
   „muehle" und die drehenden Flügel .sp-dl-fluegel): ein hell verputzter,
   nach oben schmaler werdender Rundturm, eine dunkle, hoch gewölbte
   Kappe, die Tür unten, ein kleines Fenster darüber und vier Flügel mit
   Gitter und Segeltuch, die sich langsam drehen.
   Dazu (wie bei den anderen Modellen) etwas mehr Wirklichkeit: ein
   Feldstein-Sockel, zwei Gesimsringe (Bühnen im Innern), wo der Kalkputz
   abgeplatzt ist, schauen die Feldsteine durch; die Kappe mit Schindeln
   und hölzernem Kranz, der Wellkopf mit dem schräg gestellten Flügel-
   kreuz (9° Neigung, damit die Flügel am Turm vorbeigehen).

   MASSE (Meter; x Osten, y Süden, Turmachse auf 0,0)
     Turm     Ø 8,4 m unten, Ø 5,9 m oben, Mauerkrone auf 12 m
     Kappe    Ø 6,5 m, bis 16,4 m, Knauf bis 17 m
     Flügel   Wellkopf auf 13,25 m, 3,55 m vor der Achse; Flügel 8,6 m
              lang, Segel 1,85 m breit an der nachlaufenden Seite
   Die Kappe (und damit Tür, Fenster und Flügelkreuz) schaut nach
   (+x, +y): bei dreh 0 steht die Mühle wie im alten Bild – die Flügel
   drehen sich dem Betrachter zugewandt.

   VARIANTEN (o.variante)
     ""        Turm, Kappe und stehende Flügel (Baukasten, stadt.html)
     "ohne"    nur Turm und Kappe – das gebackene Gebäude g_windmuehle
     "fluegel" nur das Flügelkreuz (o.fluegelPhase 0…1 = 0…90°) – das
               Drehblatt g_windfluegel; von hinten gesehen radiert der
               Turm aus, was hinter ihm liegt
   Die Flügel drehen sich, von vorn gesehen, gegen den Uhrzeigersinn (so
   laufen Holländermühlen); das Segel sitzt an der nachlaufenden Seite.

   AUFBAU (o.bau): Baugrube und Feldstein-Fundament → der Turm wächst Lage
   für Lage aus Feldsteinen → Kappengerüst aus Sparren → Kalkputz von unten
   nach oben, Schindeln auf der Kappe → Tür, Fenster, Laterne.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const KX = ST.KX, KY = ST.KY, KZ = ST.KZ;
  const RAD = Math.PI / 180, TAU = Math.PI * 2;
  const klemm = (x, a, b) => (x < a ? a : x > b ? b : x);
  const phase = (bau, a, b) => klemm((bau - a) / (b - a), 0, 1);
  const hell = PI.hell, misch = PI.misch;
  const rgbS = (c, a) => (a == null ? "rgb(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + ")" : "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + (+a).toFixed(3) + ")");

  /* ---------------- Maße ---------------- */
  const H = 12.0, R0 = 4.2, R1 = 2.95;             // Turm: Höhe, Radius unten/oben
  const SOCKEL = 0.9;                               // Feldstein-Sockel
  const RINGE = [4.3, 8.4];                         // Gesimsringe
  const RC = 3.25, HC = 4.4;                        // Kappe: Radius am Kranz, Höhe
  const ZH = H + 1.25, AB = 3.55, NEIG = 9 * RAD;   // Wellkopf: Höhe, Abstand vor der Achse, Neigung
  const RL = 8.6;                                   // Flügellänge (Rute)
  const SEGEL = [1.9, 8.4], SB = 1.85;              // Segel: von/bis (Radius), Breite
  const BLICK = 45 * RAD;                           // Kappe schaut nach (+x, +y)
  const D = [Math.cos(BLICK), Math.sin(BLICK)];     // nach vorn (zum Betrachter bei dreh 0)
  const LQ = [Math.sin(BLICK), -Math.cos(BLICK)];   // quer (nach rechts bei dreh 0)
  const rT = (z) => R0 + (R1 - R0) * klemm(z, 0, H) / H;
  const TANA = (R0 - R1) / H;                       // Neigung der Turmwand

  /* Farben: Kalkputz wie im alten Bild (#e8dcc2), Feldstein (#b9b0a0 … #7c7468), dunkle Schindeln, Holz */
  const PUTZ = [233, 222, 198], FELD = [185, 176, 160], FELD_D = [124, 116, 104], FELD_H = [227, 220, 203];
  const SCHINDEL = [74, 58, 46], HOLZ = [107, 69, 33], HOLZ_D = [74, 47, 24];
  const SEGELTUCH = [242, 231, 204], GITTER = [107, 69, 33];

  /* ---------------- Blick: Modellpunkt → Bild (relativ zum Fußpunkt einer Figur) ---------------- */
  function blick(F, s, O) {
    const r = (F.gier || 0) * RAD, c = Math.cos(r), sn = Math.sin(r);
    const dreh = (p) => [p[0] * c - p[1] * sn, p[0] * sn + p[1] * c, p[2]];
    return {
      c: c, sn: sn, s: s,
      /* Modellpunkt → Bildpunkt */
      bild(p) { const x = p[0] - O[0], y = p[1] - O[1], z = p[2] - O[2]; const a = x * c - y * sn, b = x * sn + y * c; return [(a - b) * KX * s, (a + b) * KY * s - z * KZ * s]; },
      /* Richtung (Modell) → Kameraraum */
      dreh: dreh,
      /* zeigt eine Modell-Normale zum Betrachter? */
      sicht(n) { const m = dreh(n); return m[0] * ST.ZUM_AUGE[0] + m[1] * ST.ZUM_AUGE[1] + m[2] * ST.ZUM_AUGE[2]; },
      /* Licht auf einer Fläche mit Modell-Normale n */
      licht(n) { return ST.lichtFaktor(dreh(n), F.Z, 0, F.jahr); }
    };
  }
  const belichtet = (c, lf) => [c[0] * lf[0], c[1] * lf[1], c[2] * lf[2]];
  /* Punkt auf der Turmwand (Modell): Azimut φ, Höhe z, Abstand d vor der Wand */
  const wandPunkt = (phi, z, d) => { const r = rT(z) + (d || 0); return [Math.cos(phi) * r, Math.sin(phi) * r, z]; };
  const wandNormale = (phi) => { const k = 1 / Math.hypot(1, TANA); return [Math.cos(phi) * k, Math.sin(phi) * k, TANA * k]; };

  /* Umriss des Kegelstumpfs (z0 … z1) im Bild: Vorderhälfte unten, Rückhälfte oben (Ellipsen sind vom Drehwinkel unabhängig) */
  function stumpfPfad(g, s, z0, z1, r0, r1) {
    g.beginPath();
    g.ellipse(0, -z0 * KZ * s, r0 * s, r0 * s * 0.5, 0, Math.PI, 0, true);
    g.lineTo(r1 * s, -z1 * KZ * s);
    g.ellipse(0, -z1 * KZ * s, r1 * s, r1 * s * 0.5, 0, 0, Math.PI, true);
    g.closePath();
  }
  /* Rundung schattieren: waagrechter Verlauf quer über den Umriss (wie die Turmhauben des Rathauses) */
  function rundVerlauf(g, B, s, rm, farbe, nz) {
    const gr = g.createLinearGradient(-rm * s, 0, rm * s, 0);
    const nh = Math.sqrt(Math.max(0, 1 - nz * nz));
    for (let i = 0; i <= 10; i++) {
      const t = klemm(-1 + i / 5, -0.999, 0.999), c = Math.sqrt(1 - t * t);
      /* Kameraraum: rechts = (1,−1)/√2, zum Auge = (1,1)/√2 */
      const n = [(t + c) / Math.SQRT2 * nh, (-t + c) / Math.SQRT2 * nh, nz];
      const lf = ST.lichtFaktor(n, B.Z, 0, B.jahr);
      gr.addColorStop(i / 10, rgbS(belichtet(farbe, lf)));
    }
    return gr;
  }

  /* Kleines Bauteil flach auf die Turmwand legen: lokale Meter (u nach rechts, v nach unten) → Bild.
     phi = Azimut der Mitte, z = Oberkante, w = Breite. Gibt false zurück, wenn es vom Betrachter weg zeigt. */
  function aufWand(g, B, phi, z, w, d) {
    if (B.sicht(wandNormale(phi)) < 0.06) return false;
    const r = rT(z), da = (w / 2) / r;
    const p0 = B.bild(wandPunkt(phi - da, z, d)), p1 = B.bild(wandPunkt(phi + da, z, d)), p2 = B.bild(wandPunkt(phi - da, z - 1, d));
    g.transform((p1[0] - p0[0]) / w, (p1[1] - p0[1]) / w, p2[0] - p0[0], p2[1] - p0[1], p0[0], p0[1]);
    return true;
  }

  /* =====================================================================
     TURM (Figur): Sockel, Putz, Ringe, Flickstellen, Tür, Fenster
     ===================================================================== */
  const FENSTER = [
    { phi: BLICK, z: 7.9, w: 0.95, h: 1.25 },               // über der Tür (wie im alten Bild)
    { phi: BLICK + 118 * RAD, z: 5.4, w: 0.8, h: 1.05 },
    { phi: BLICK - 112 * RAD, z: 9.9, w: 0.75, h: 1.0 },
    { phi: BLICK + 200 * RAD, z: 3.4, w: 0.8, h: 1.05 }
  ];
  const fensterAn = (fe) => ST.hash2(Math.round(fe.z * 10), 3, 9) < 0.75;
  const FLICKEN = [[BLICK - 38 * RAD, 2.6, 1.4, 0.8], [BLICK + 52 * RAD, 6.3, 1.1, 0.65], [BLICK - 70 * RAD, 10.4, 0.9, 0.5], [BLICK + 150 * RAD, 7.2, 1.3, 0.7]];

  function turmFigur(Z) {
    return function (g, s, F) {
      const zOben = Z.turmBis;
      if (zOben <= 0.02) return;
      const rO = rT(zOben);
      if (F.schatten) { g.fillStyle = "#000"; stumpfPfad(g, s, 0, zOben, R0, rO); g.fill(); return; }
      const B = blick(F, s, [0, 0, 0]); B.Z = F.Z; B.jahr = F.jahr;
      const winter = F.jahr === "winter";
      const nz = TANA / Math.hypot(1, TANA);
      g.save();
      stumpfPfad(g, s, 0, zOben, R0, rO); g.clip();
      /* Grundton: Putz, wo schon verputzt, sonst Feldstein */
      const zPutz = Z.putzBis;
      const rm = (R0 + rO) / 2;
      g.fillStyle = rundVerlauf(g, B, s, rm, FELD, nz);
      g.fillRect(-R0 * s - 2, -(zOben + 1) * KZ * s - R0 * s, R0 * s * 2 + 4, (zOben + 2) * KZ * s + R0 * s * 2);
      feldsteine(g, B, s, 0, Z.putzBis >= zOben - 0.01 ? Math.min(zOben, SOCKEL + 0.2) : zOben, 1.0);
      if (zPutz > SOCKEL) {
        g.save();
        stumpfPfad(g, s, SOCKEL, Math.min(zPutz, zOben), rT(SOCKEL), rT(Math.min(zPutz, zOben))); g.clip();
        g.fillStyle = rundVerlauf(g, B, s, rm, PUTZ, nz);
        g.fillRect(-R0 * s - 2, -(zOben + 1) * KZ * s - R0 * s, R0 * s * 2 + 4, (zOben + 2) * KZ * s + R0 * s * 2);
        if (s > 3) { PI.rauschen(g, -R0 * s, -(zOben + 1) * KZ * s, R0 * s * 2, (zOben + 2) * KZ * s, 3.2 * s, 0.07, 3, 3); PI.bleichen(g, -R0 * s, -(zOben + 1) * KZ * s, R0 * s * 2, (zOben + 2) * KZ * s, 2.4 * s, 0.07, 5); }
        if (s > 12) PI.rauschen(g, -R0 * s, -(zOben + 1) * KZ * s, R0 * s * 2, (zOben + 2) * KZ * s, 0.45 * s, 0.05, 9, 2);
        /* Regenstreifen und Spritzwasser unten */
        if (s > 5) {
          const gr = g.createLinearGradient(0, -(SOCKEL + 1.3) * KZ * s, 0, -SOCKEL * KZ * s);
          gr.addColorStop(0, "rgba(120,110,90,0)"); gr.addColorStop(1, "rgba(120,110,90,0.22)");
          g.fillStyle = gr; g.fillRect(-R0 * s, -(SOCKEL + 1.3) * KZ * s - R0 * s, R0 * s * 2, 1.3 * KZ * s + R0 * s * 2);
        }
        /* Flickstellen: der Putz ist abgeplatzt, Feldsteine schauen durch */
        if (Z.fertig) for (const [phi, z, w, h] of FLICKEN) {
          if (z > zPutz || B.sicht(wandNormale(phi)) < 0.12) continue;
          g.save();
          if (aufWand(g, B, phi, z, w)) {
            g.beginPath();
            for (let i = 0; i <= 12; i++) { const a = i / 12 * TAU, k = 1 + 0.18 * Math.sin(a * 3 + phi * 7); g.lineTo(w / 2 + Math.cos(a) * w / 2 * k, h / 2 + Math.sin(a) * h / 2 * k); }
            g.closePath();
            g.fillStyle = rgbS(belichtet(hell(FELD, -0.05), B.licht(wandNormale(phi)))); g.fill();
            g.save(); g.clip();
            if (s > 8) for (let i = 0; i < 9; i++) { const x = ST.hash2(i, 3, z * 10) * w, y = ST.hash2(i, 5, z * 10) * h; g.fillStyle = rgbS(belichtet(misch(FELD_D, FELD_H, ST.hash2(i, 7, 3)), B.licht(wandNormale(phi)))); g.beginPath(); g.ellipse(x, y, 0.16, 0.1, 0, 0, TAU); g.fill(); }
            g.restore();
            g.strokeStyle = "rgba(110,98,80,0.55)"; g.lineWidth = 0.04; g.stroke();
          }
          g.restore();
        }
      }
      /* Gesimsringe: vorstehendes Band mit Schatten darunter */
      for (const zr of RINGE) {
        if (zr > zPutz || zr > zOben) continue;
        const r = rT(zr) + 0.08, y = -zr * KZ * s;
        g.lineWidth = Math.max(0.6, 0.13 * s);
        g.strokeStyle = "rgba(60,50,40,0.28)";
        g.beginPath(); g.ellipse(0, y + 0.12 * s, r * s, r * s * 0.5, 0, 0, Math.PI); g.stroke();
        g.strokeStyle = rundVerlauf(g, B, s, r, hell(PUTZ, 0.06), 0.3);
        g.beginPath(); g.ellipse(0, y, r * s, r * s * 0.5, 0, 0, Math.PI); g.stroke();
        if (winter && s > 5) { g.strokeStyle = "rgba(248,250,255,0.9)"; g.lineWidth = Math.max(0.5, 0.05 * s); g.beginPath(); g.ellipse(0, y - 0.07 * s, r * s, r * s * 0.5, 0, 0, Math.PI); g.stroke(); }
      }
      /* Sockelkante (Wasserschlag) */
      if (zPutz > SOCKEL && zOben > SOCKEL) {
        const r = rT(SOCKEL) + 0.05, y = -SOCKEL * KZ * s;
        g.lineWidth = Math.max(0.6, 0.1 * s); g.strokeStyle = rundVerlauf(g, B, s, r, FELD_H, 0.5);
        g.beginPath(); g.ellipse(0, y, r * s, r * s * 0.5, 0, 0, Math.PI); g.stroke();
      }
      /* Tür und Fenster */
      if (Z.oeffnungen) {
        tuerMalen(g, B, s, F, Z);
        for (const fe of FENSTER) if (fe.z < zPutz) fensterMalen(g, B, s, F, fe);
      }
      /* Kontaktschatten am Boden */
      const gr = g.createLinearGradient(0, -0.6 * KZ * s, 0, R0 * s * 0.5);
      gr.addColorStop(0, "rgba(40,36,40,0)"); gr.addColorStop(1, "rgba(40,36,40,0.25)");
      g.fillStyle = gr; g.fillRect(-R0 * s, -0.6 * KZ * s, R0 * s * 2, R0 * s);
      g.restore();
      /* Mauerkrone im Bau: rohe Steine obenauf */
      if (!Z.fertig && zOben < H - 0.01) {
        g.fillStyle = rgbS(belichtet(FELD, ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr)));
        g.beginPath(); g.ellipse(0, -zOben * KZ * s, rO * s, rO * s * 0.5, 0, 0, TAU); g.fill();
        g.fillStyle = "rgba(60,52,44,0.9)";
        g.beginPath(); g.ellipse(0, -zOben * KZ * s, (rO - 0.7) * s, (rO - 0.7) * s * 0.5, 0, 0, TAU); g.fill();
        if (winter) { g.fillStyle = "rgba(246,248,252,0.8)"; g.beginPath(); g.ellipse(0, -zOben * KZ * s, rO * s, rO * s * 0.5, 0, 0, TAU); g.ellipse(0, -zOben * KZ * s, (rO - 0.7) * s, (rO - 0.7) * s * 0.5, 0, 0, TAU, true); g.fill("evenodd"); }
      }
      /* Nacht: Fensterschein in die Szene */
      if (F.nacht > 0.05 && Z.oeffnungen) {
        for (const fe of FENSTER) {
          if (fe.z >= zPutz || !fensterAn(fe) || B.sicht(wandNormale(fe.phi)) < 0.15) continue;
          const p = B.bild(wandPunkt(fe.phi, fe.z - fe.h / 2, 0.05));
          if (F.leuchtPunkt) F.leuchtPunkt(p[0], p[1], 1.6 * s, "255,196,120", 0.5);
        }
      }
    };
  }
  /* Feldsteine im Bild: Reihen um den Turm, jeder Stein auf seiner Stelle der Wand */
  function feldsteine(g, B, s, z0, z1, deck) {
    if (s < 4) { PI.rauschen(g, -R0 * s, -(z1 + 1) * KZ * s, R0 * s * 2, (z1 + 2) * KZ * s, 1.2 * s, 0.35, 21, 3); return; }
    const reihe = 0.34;
    for (let z = z0 + reihe / 2, j = 0; z < z1; z += reihe, j++) {
      const r = rT(z), n = Math.round(TAU * r / 0.52);
      for (let i = 0; i < n; i++) {
        const phi = (i + (j % 2) * 0.5 + ST.hash2(i, j, 5) * 0.3) / n * TAU;
        const nw = wandNormale(phi), sv = B.sicht(nw);
        if (sv < 0.02) continue;
        const p = B.bild(wandPunkt(phi, z, 0));
        const lf = B.licht(nw);
        const f = misch(FELD_D, FELD_H, 0.25 + ST.hash2(i, j, 9) * 0.6);
        /* schmal, wo die Wand schräg vom Betrachter weg läuft */
        const breit = 0.23 * s * (0.35 + 0.65 * sv), hoch = 0.13 * s * (0.85 + ST.hash2(i, j, 13) * 0.3);
        g.fillStyle = rgbS(belichtet(f, lf), deck);
        g.beginPath(); g.ellipse(p[0], p[1], breit, hoch, 0, 0, TAU); g.fill();
        if (s > 14) { g.fillStyle = rgbS(belichtet(hell(f, 0.2), lf), 0.5 * deck); g.beginPath(); g.ellipse(p[0] - breit * 0.25, p[1] - hoch * 0.35, breit * 0.5, hoch * 0.35, 0, 0, TAU); g.fill(); }
      }
    }
  }
  /* Tür: Rundbogen aus Holzbrettern mit Sandsteingewände, davor eine Stufe */
  function tuerMalen(g, B, s, F, Z) {
    const phi = BLICK, zT = 2.55, w = 1.35, h = 2.45;
    g.save();
    if (aufWand(g, B, phi, zT + 0.2, w + 0.4)) {
      const lf = B.licht(wandNormale(phi));
      /* Gewände */
      g.fillStyle = rgbS(belichtet([196, 180, 150], lf));
      g.beginPath(); g.moveTo(0, h + 0.2); g.lineTo(0, 0.2 + (w + 0.4) / 2); g.arc((w + 0.4) / 2, 0.2 + (w + 0.4) / 2, (w + 0.4) / 2, Math.PI, 0); g.lineTo(w + 0.4, h + 0.2); g.closePath(); g.fill();
      g.save(); g.translate(0.2, 0.2);
      g.beginPath(); g.moveTo(0, h); g.lineTo(0, w / 2); g.arc(w / 2, w / 2, w / 2, Math.PI, 0); g.lineTo(w, h); g.closePath(); g.clip();
      for (let i = 0; i < 5; i++) { const c = belichtet(hell(HOLZ, (ST.hash2(i, 2, 7) - 0.5) * 0.15), lf); g.fillStyle = rgbS(c); g.fillRect(i * w / 5, 0, w / 5 + 0.01, h); }
      g.fillStyle = "rgba(30,18,10,0.45)"; for (let i = 1; i < 5; i++) g.fillRect(i * w / 5 - 0.01, 0, 0.02, h);
      g.fillStyle = "rgba(24,18,14,0.9)"; g.fillRect(0, 0.55 + w / 2, w * 0.7, 0.05); g.fillRect(0, h - 0.5, w * 0.7, 0.05);
      g.fillStyle = "#c8a050"; g.beginPath(); g.arc(w - 0.18, h * 0.56, 0.045, 0, TAU); g.fill();
      /* Laibungsschatten oben (die Wand ist dick) */
      const gr = g.createLinearGradient(0, 0, 0, 0.9); gr.addColorStop(0, "rgba(20,14,10,0.45)"); gr.addColorStop(1, "rgba(20,14,10,0)"); g.fillStyle = gr; g.fillRect(0, 0, w, 0.9);
      if (F.nacht > 0.05) { g.fillStyle = "rgba(255,190,110," + (0.5 * F.nacht).toFixed(3) + ")"; g.fillRect(0.02, h - 0.04, w - 0.04, 0.04); }
      g.restore();
      /* Stufe */
      g.fillStyle = rgbS(belichtet([181, 163, 134], lf)); g.fillRect(-0.1, h + 0.18, w + 0.6, 0.16);
      if (F.jahr === "winter") { g.fillStyle = "rgba(246,248,252,0.95)"; g.fillRect(-0.1, h + 0.14, w + 0.6, 0.07); }
      /* Laterne neben der Tür (ihr Schein kommt aus M.licht im Modell) */
      g.fillStyle = "#2a2622"; g.fillRect(w + 0.55, 0.55, 0.05, 0.35); g.fillRect(w + 0.46, 0.85, 0.24, 0.3);
      g.fillStyle = F.nacht > 0.05 ? "rgba(255,214,150,0.95)" : "rgba(210,220,225,0.8)"; g.fillRect(w + 0.49, 0.89, 0.18, 0.22);
    }
    g.restore();
  }
  /* Kleines Fenster: Sandsteinrahmen, Sprossen, grünliche Läden-Kante; nachts warmes Licht */
  function fensterMalen(g, B, s, F, fe) {
    g.save();
    if (aufWand(g, B, fe.phi, fe.z, fe.w + 0.24)) {
      const lf = B.licht(wandNormale(fe.phi)), w = fe.w, h = fe.h;
      g.fillStyle = rgbS(belichtet([214, 200, 172], lf)); g.fillRect(0, 0, w + 0.24, h + 0.24);
      const an = F.nacht > 0.05 && fensterAn(fe);
      g.fillStyle = an ? "rgba(255,200,120,1)" : rgbS(belichtet([62, 78, 92], lf));
      g.fillRect(0.12, 0.12, w, h);
      if (!an) { const gr = g.createLinearGradient(0.12, 0.12, w, h); gr.addColorStop(0, "rgba(200,225,240,0.35)"); gr.addColorStop(0.5, "rgba(200,225,240,0)"); g.fillStyle = gr; g.fillRect(0.12, 0.12, w, h); }
      g.fillStyle = rgbS(belichtet([240, 236, 226], lf));
      g.fillRect(0.12 + w / 2 - 0.03, 0.12, 0.06, h); g.fillRect(0.12, 0.12 + h * 0.45, w, 0.05);
      g.fillRect(0.12, 0.12, w, 0.05); g.fillRect(0.12, 0.07 + h, w, 0.05); g.fillRect(0.12, 0.12, 0.05, h); g.fillRect(0.07 + w, 0.12, 0.05, h);
      /* Sohlbank */
      g.fillStyle = rgbS(belichtet([190, 176, 148], lf)); g.fillRect(-0.06, h + 0.2, w + 0.36, 0.1);
      if (F.jahr === "winter") { g.fillStyle = "rgba(246,248,252,0.95)"; g.fillRect(-0.06, h + 0.15, w + 0.36, 0.07); }
    }
    g.restore();
  }

  /* =====================================================================
     KAPPE (Figur): hoch gewölbt wie im alten Bild, Schindeln, Holzkranz
     ===================================================================== */
  const kappeR = (t) => RC * (t < 0.08 ? 1 - t * 0.6 : 0.952 * Math.pow(Math.max(0, 1 - Math.pow((t - 0.08) / 0.92, 2.1)), 0.62));
  function kappeFigur(Z) {
    return function (g, s, F) {
      const k = KZ * s, N = 24;
      const zu = (t) => t * HC;
      /* Umriss: Vorderhälfte der unteren Ellipse, Seiten, Spitze */
      const umriss = () => {
        g.beginPath();
        g.ellipse(0, 0, RC * s, RC * s * 0.5, 0, Math.PI, 0, true);
        for (let i = 1; i <= N; i++) { const t = i / N; g.lineTo(kappeR(t) * s, -zu(t) * k); }
        for (let i = N; i >= 1; i--) { const t = i / N; g.lineTo(-kappeR(t) * s, -zu(t) * k); }
        g.closePath();
      };
      const kranzH = 0.32;
      if (F.schatten) { g.fillStyle = "#000"; umriss(); g.fill(); g.fillRect(-0.2 * s, -(HC + 0.6) * k, 0.4 * s, 0.6 * k); return; }
      const B = blick(F, s, [0, 0, H]); B.Z = F.Z; B.jahr = F.jahr;
      if (Z.kappeGeruest < 1) {
        /* Kappengerüst: Kranz und Sparren (Bauphase) */
        g.strokeStyle = rgbS(belichtet(hell(HOLZ, 0.25), ST.lichtFaktor([0, 0.4, 0.9], F.Z, 0, F.jahr)));
        g.lineWidth = Math.max(0.8, 0.14 * s);
        g.beginPath(); g.ellipse(0, 0, RC * s, RC * s * 0.5, 0, 0, TAU); g.stroke();
        const n = Math.max(0, Math.round(10 * Z.kappeGeruest));
        for (let i = 0; i < n; i++) {
          const a = (i / 10) * TAU;
          g.beginPath();
          for (let j = 0; j <= 10; j++) { const t = j / 10, r = kappeR(t); g.lineTo(Math.cos(a) * r * s, Math.sin(a) * r * s * 0.5 - zu(t) * k); }
          g.stroke();
        }
        return;
      }
      g.save();
      umriss(); g.clip();
      /* Schindelfarbe mit Licht quer über die Rundung (unten steiler, oben flacher) */
      for (let i = 0; i < N; i++) {
        const t0 = i / N, t1 = (i + 1) / N;
        const dr = (kappeR(t1) - kappeR(t0)), dz = zu(t1) - zu(t0);
        const nz = klemm(-dr / Math.hypot(dr, dz), -1, 1);
        const rm = Math.max(kappeR(t0), 0.05);
        g.fillStyle = rundVerlauf(g, B, s, rm, SCHINDEL, nz);
        g.fillRect(-RC * s - 2, -zu(t1) * k - RC * s * 0.5 - 1, RC * s * 2 + 4, (zu(t1) - zu(t0)) * k + RC * s + 2);
      }
      /* Schindelreihen und Stoßfugen */
      if (s > 6) {
        g.strokeStyle = "rgba(20,14,10,0.45)"; g.lineWidth = Math.max(0.5, 0.03 * s);
        for (let z = 0.45; z < HC - 0.4; z += 0.3) {
          const t = z / HC, r = kappeR(t);
          g.beginPath(); g.ellipse(0, -z * k, r * s, r * s * 0.5, 0, 0, Math.PI); g.stroke();
          if (s > 14) {
            const n = Math.max(4, Math.round(TAU * r / 0.34));
            for (let i = 0; i < n; i++) {
              const a = (i + ((z / 0.3) | 0) % 2 * 0.5) / n * TAU;
              if (Math.sin(a) <= 0.05) continue;
              const x = Math.cos(a) * r * s, y = Math.sin(a) * r * s * 0.5 - z * k;
              g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 0.26 * k); g.stroke();
            }
          }
        }
        PI.rauschen(g, -RC * s, -HC * k - RC * s, RC * s * 2, HC * k + RC * s * 2, 1.4 * s, 0.25, 17, 3);
      }
      /* Schnee: oben dicht, zum Kranz hin in Streifen */
      if (F.jahr === "winter") {
        const gr = g.createLinearGradient(0, -HC * k, 0, -HC * 0.25 * k);
        gr.addColorStop(0, "rgba(246,248,252,0.97)"); gr.addColorStop(0.65, "rgba(242,246,252,0.9)"); gr.addColorStop(1, "rgba(242,246,252,0)");
        g.fillStyle = gr; g.fillRect(-RC * s, -HC * k - RC * s, RC * s * 2, HC * k + RC * s);
        g.fillStyle = "rgba(170,190,225,0.18)"; g.beginPath(); g.ellipse(RC * 0.35 * s, -HC * 0.55 * k, RC * 0.5 * s, HC * 0.25 * k, 0, 0, TAU); g.fill();
      }
      g.restore();
      /* Holzkranz unter der Kappe */
      g.save();
      g.beginPath();
      g.ellipse(0, kranzH * k, (RC - 0.02) * s, (RC - 0.02) * s * 0.5, 0, Math.PI, 0, true);
      g.lineTo(RC * s, 0);
      g.ellipse(0, 0, RC * s, RC * s * 0.5, 0, 0, Math.PI, false);
      g.closePath();
      g.fillStyle = rundVerlauf(g, B, s, RC, HOLZ_D, 0); g.fill();
      g.restore();
      /* Knauf */
      const kn = HC + 0.25;
      g.fillStyle = "#2c241e"; g.fillRect(-0.05 * s, -(kn + 0.3) * k, 0.1 * s, 0.35 * k);
      const gr = g.createRadialGradient(-0.08 * s, -(kn + 0.45) * k, 0, 0, -(kn + 0.35) * k, 0.2 * s);
      gr.addColorStop(0, "#9a7a5a"); gr.addColorStop(1, "#2c241e");
      g.fillStyle = gr; g.beginPath(); g.arc(0, -(kn + 0.35) * k, 0.2 * s, 0, TAU); g.fill();
      if (F.jahr === "winter") { g.fillStyle = "rgba(248,250,255,0.9)"; g.beginPath(); g.arc(0, -(kn + 0.42) * k, 0.14 * s, Math.PI, 0); g.fill(); }
    };
  }

  /* =====================================================================
     FLÜGELKREUZ (Figur am Wellkopf)
     Ebene: A quer (nach rechts, wenn man davor steht), Bv nach oben
     (um NEIG nach hinten geneigt), N nach vorn. Flügel k liegt bei
     θ = θ0 + k·90°, von vorn gesehen gegen den Uhrzeigersinn steigend.
     ===================================================================== */
  const A = [LQ[0], LQ[1], 0];
  const BV = [-Math.sin(NEIG) * D[0], -Math.sin(NEIG) * D[1], Math.cos(NEIG)];
  const NV = [Math.cos(NEIG) * D[0], Math.cos(NEIG) * D[1], Math.sin(NEIG)];
  const NABE = [D[0] * AB, D[1] * AB, ZH];
  const ZU = ZH - RL - 0.3;                        // Fußpunkt der Figur (unterhalb der tiefsten Flügelspitze)
  const inEbene = (r, o, th, vor) => {
    const c = Math.cos(th), sn = Math.sin(th);
    const er = [c * A[0] + sn * BV[0], c * A[1] + sn * BV[1], c * A[2] + sn * BV[2]];
    const et = [-sn * A[0] + c * BV[0], -sn * A[1] + c * BV[1], -sn * A[2] + c * BV[2]];
    const v = vor || 0;
    return [NABE[0] + er[0] * r + et[0] * o + NV[0] * v, NABE[1] + er[1] * r + et[1] * o + NV[1] * v, NABE[2] + er[2] * r + et[2] * o + NV[2] * v];
  };
  function fluegelFigur(Z, theta0) {
    return function (g, s, F) {
      if (F.schatten) return;
      const O = [NABE[0], NABE[1], ZU];
      const B = blick(F, s, O); B.Z = F.Z; B.jahr = F.jahr;
      const vorn = B.sicht(NV) >= 0;
      const nSicht = vorn ? NV : [-NV[0], -NV[1], -NV[2]];
      const lf = B.licht(nSicht);
      const winter = F.jahr === "winter";
      const P = (r, o, th, v) => B.bild(inEbene(r, o, th, v));
      const vieleck = (pts) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); };
      const linie = (a, b, w, farbe) => { g.strokeStyle = farbe; g.lineWidth = Math.max(0.5, w * s); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); };
      g.lineCap = "round"; g.lineJoin = "round";
      const holz = rgbS(belichtet(HOLZ, lf)), holzD = rgbS(belichtet(HOLZ_D, lf));
      const segelMalen = (th) => {
        /* Segeltuch: an der nachlaufenden Seite (−e_t), leicht gebläht (Tuch in der Mitte etwas heller) */
        const pts = [P(SEGEL[0], -0.17, th), P(SEGEL[1], -0.17, th), P(SEGEL[1], -0.17 - SB, th), P(SEGEL[0] + 0.2, -0.17 - SB, th)];
        vieleck(pts);
        const m0 = P((SEGEL[0] + SEGEL[1]) / 2, -0.17, th), m1 = P((SEGEL[0] + SEGEL[1]) / 2, -0.17 - SB, th);
        const gr = g.createLinearGradient(m0[0], m0[1], m1[0], m1[1]);
        gr.addColorStop(0, rgbS(belichtet(hell(SEGELTUCH, -0.1), lf))); gr.addColorStop(0.45, rgbS(belichtet(SEGELTUCH, lf))); gr.addColorStop(1, rgbS(belichtet(hell(SEGELTUCH, -0.14), lf)));
        g.fillStyle = gr; g.fill();
        if (s > 8) { g.save(); g.clip(); PI.rauschen(g, Math.min(pts[0][0], pts[2][0]) - 20, Math.min(pts[0][1], pts[2][1]) - 20, Math.abs(pts[0][0] - pts[2][0]) + 40 + s * 9, Math.abs(pts[0][1] - pts[2][1]) + 40 + s * 9, 1.2 * s, 0.12, 27, 2); g.restore(); }
        /* Gitter: Längsleisten und Querhölzer (Heck) */
        const w = 0.045;
        for (const o of [-0.17, -0.8, -1.42, -0.17 - SB]) linie(P(SEGEL[0], o, th), P(SEGEL[1], o, th), o === -0.17 - SB ? 0.09 : w, holz);
        for (let r = SEGEL[0]; r <= SEGEL[1] + 0.01; r += 0.52) linie(P(r, 0.5, th), P(r, -0.17 - SB, th), w, holz);
        /* Windbrett an der Vorderkante */
        vieleck([P(2.4, 0.17, th), P(SEGEL[1], 0.17, th), P(SEGEL[1], 0.5, th), P(2.4, 0.5, th)]);
        g.fillStyle = holzD; g.fill();
        if (winter && s > 6) for (let r = SEGEL[0]; r <= SEGEL[1] + 0.01; r += 0.52) { const a = P(r, 0.5, th), b = P(r, -0.17 - SB, th); if (Math.abs(a[0] - b[0]) > Math.abs(a[1] - b[1]) * 0.8) linie([a[0], a[1] - 0.04 * s], [b[0], b[1] - 0.04 * s], 0.035, "rgba(248,250,255,0.85)"); }
      };
      const ruteMalen = (th) => {
        /* Rute: kräftiger Balken, zur Spitze hin schlanker */
        vieleck([P(-0.35, 0.19, th, 0.12), P(RL, 0.11, th, 0.12), P(RL, -0.11, th, 0.12), P(-0.35, -0.19, th, 0.12)]);
        const a = P(0, 0, th, 0.12), b = P(RL, 0, th, 0.12);
        const gr = g.createLinearGradient(a[0], a[1], b[0], b[1]);
        gr.addColorStop(0, rgbS(belichtet(hell(HOLZ, 0.05), lf))); gr.addColorStop(1, rgbS(belichtet(hell(HOLZ, -0.1), lf)));
        g.fillStyle = gr; g.fill();
        if (winter && s > 5) { const q = Math.abs(Math.cos(th)); if (q > 0.5) linie([a[0], a[1] - 0.12 * s], [b[0], b[1] - 0.12 * s], 0.07 * q, "rgba(248,250,255,0.85)"); }
      };
      const nabeMalen = () => {
        /* Welle aus der Kappe und Wellkopf (Eisen) */
        const h0 = B.bild([NABE[0] - NV[0] * 0.9, NABE[1] - NV[1] * 0.9, NABE[2] - NV[2] * 0.9]), h1 = B.bild(NABE);
        linie(h0, h1, 0.62, rgbS(belichtet([90, 64, 40], lf)));
        const c = P(0, 0, 0, 0.2);
        const gr = g.createRadialGradient(c[0] - 0.12 * s, c[1] - 0.12 * s, 0, c[0], c[1], 0.5 * s);
        gr.addColorStop(0, rgbS(belichtet([120, 112, 104], lf))); gr.addColorStop(1, rgbS(belichtet([44, 40, 38], lf)));
        g.fillStyle = gr; g.beginPath(); g.arc(c[0], c[1], 0.46 * s, 0, TAU); g.fill();
        if (winter && vorn) { g.fillStyle = "rgba(248,250,255,0.85)"; g.beginPath(); g.arc(c[0], c[1] - 0.1 * s, 0.3 * s, Math.PI * 1.1, Math.PI * 1.9); g.fill(); }
      };
      const winkel = [0, 1, 2, 3].map((i) => theta0 + i * Math.PI / 2);
      if (!vorn) nabeMalen();
      /* von vorn: erst die Segel, dann die Ruten; von hinten umgekehrt */
      if (vorn) { for (const th of winkel) segelMalen(th); for (const th of winkel) ruteMalen(th); }
      else { for (const th of winkel) ruteMalen(th); for (const th of winkel) segelMalen(th); }
      if (vorn) nabeMalen();
    };
  }
  /* Radierer: von hinten gesehen liegt das Flügelkreuz hinter Turm und Kappe – im Drehblatt wird es dort ausgespart */
  function radiererFigur() {
    const turm = turmFigur({ turmBis: H, putzBis: 0 }), kappe = kappeFigur({ kappeGeruest: 1 });
    return function (g, s, F) {
      if (F.schatten) return;
      const B = blick(F, s, [0, 0, 0]);
      if (B.sicht(NV) >= 0) return;
      g.save();
      g.globalCompositeOperation = "destination-out";
      turm(g, s, { schatten: true });
      g.translate(0, -H * KZ * s);
      kappe(g, s, { schatten: true });
      g.restore();
    };
  }

  /* =====================================================================
     BAUZUSTAND
     ===================================================================== */
  function zustand(bau) {
    return {
      fertig: bau >= 1,
      grube: bau < 0.14,
      turmBis: bau >= 1 ? H : 0.35 + (H - 0.35) * phase(bau, 0.1, 0.72),
      putzBis: bau >= 1 ? H : H * phase(bau, 0.78, 0.96),
      kappeGeruest: bau >= 0.9 ? 1 : phase(bau, 0.74, 0.86) * 0.999,
      kappe: bau >= 0.74,
      oeffnungen: bau >= 0.9
    };
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  const GRUND = [13, 13];
  ST.modell("windmuehle", {
    name: "Windmühle", gruppe: "Häuser", grund: GRUND, hoehe: 22, bauzeit: 12 * 60,
    bauen(M, o) {
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      const Z = zustand(bau);
      const variante = o.variante || "";
      const winter = o.jahr === "winter";
      if (variante === "fluegel") {
        /* Nur das Flügelkreuz (Drehblatt), Stellung 0…90° */
        const th0 = ((o.fluegelPhase || 0) % 1) * Math.PI / 2 + 0.3;
        M.teil("fluegel", { schatten: false });
        M.figur({ x: NABE[0], y: NABE[1], z: ZU, breite: 17, hoehe: 2 * RL + 1.2, schatten: false, malen: fluegelFigur(Z, th0) });
        M.teil("radierer", { schatten: false, ebene: 1 });
        M.figur({ x: 0, y: 0, z: 0, breite: 2 * R0, hoehe: H + HC + 1, schatten: false, malen: radiererFigur() });
        return;
      }
      /* Sockelring aus Feldstein (Flächen: Kontaktschatten, Schattenwurf, Bildgrenzen) */
      M.teil("turm");
      const N = 16, rS = R0 + 0.12, hS = Z.grube ? 0.35 * phase(bau, 0.02, 0.1) : 0.35;
      const steinM = (g, F) => {
        g.fillStyle = rgbS(FELD); g.fillRect(-1, -1, F.w + 2, F.h + 2);
        if (F.px > 5) for (let x = 0.1; x < F.w; x += 0.42) for (let y = 0.08; y < F.h; y += 0.2) { const h = ST.hash2(Math.round(x * 10), Math.round(y * 10), 3); g.fillStyle = rgbS(misch(FELD_D, FELD_H, 0.2 + h * 0.6)); g.beginPath(); g.ellipse(x + h * 0.1, y, 0.17, 0.08, 0, 0, TAU); g.fill(); }
        if (winter) { g.fillStyle = "rgba(246,248,252,0.9)"; g.fillRect(-1, -1, F.w + 2, 0.07); }
      };
      if (hS > 0.02) for (let i = 0; i < N; i++) {
        const a0 = (i / N) * TAU, a1 = ((i + 1) / N) * TAU;
        const p0 = [Math.cos(a0) * rS, Math.sin(a0) * rS], p1 = [Math.cos(a1) * rS, Math.sin(a1) * rS];
        const w = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
        /* von p1 nach p0: so zeigt die Normale (u × v) nach außen */
        M.flaeche({ name: "sockel" + i, o: [p1[0], p1[1], hS], u: [p0[0] - p1[0], p0[1] - p1[1], 0], v: [0, 0, -1], w: w, h: hS, malen: steinM, ao: true });
      }
      if (Z.grube) {
        /* Baugrube: dunkle Erde im Ring, Fundamentsteine */
        M.teil("grube", { schatten: false, ebene: -2 });
        M.flaeche({ name: "grube", o: [-R0 - 0.6, -R0 - 0.6, 0.01], u: [1, 0, 0], v: [0, 1, 0], w: 2 * R0 + 1.2, h: 2 * R0 + 1.2, keinLicht: true, malen: (g, F) => {
          g.fillStyle = winter ? "rgba(214,222,234,1)" : "#6d5a44";
          g.beginPath(); g.ellipse(F.w / 2, F.h / 2, F.w / 2, F.h / 2, 0, 0, TAU); g.fill();
          g.fillStyle = "#4a3c2e"; g.beginPath(); g.ellipse(F.w / 2, F.h / 2, R0 - 0.3, R0 - 0.3, 0, 0, TAU); g.fill();
          const n = Math.round(60 * phase(bau, 0.02, 0.12));
          for (let i = 0; i < n; i++) { const a = i / 60 * TAU; g.fillStyle = rgbS(misch(FELD_D, FELD_H, ST.hash2(i, 1, 4))); g.beginPath(); g.ellipse(F.w / 2 + Math.cos(a) * (R0 - 0.1), F.h / 2 + Math.sin(a) * (R0 - 0.1), 0.28, 0.2, a, 0, TAU); g.fill(); }
        } });
        M.teil("turm2");
      }
      /* Turm und Kappe als Figuren (rund, in jedem Winkel glatt schattiert) */
      if (!Z.grube) M.figur({ x: 0, y: 0, z: 0, breite: 2 * R0, hoehe: Z.turmBis, malen: turmFigur(Z) });
      if (Z.kappe) {
        M.teil("kappe");
        M.figur({ x: 0, y: 0, z: H, breite: 2 * RC, hoehe: HC + 0.8, malen: kappeFigur(Z) });
      }
      /* Laterne neben der Tür: Lichtschein */
      if (Z.oeffnungen) {
        const phi = BLICK + (1.35 / 2 + 0.2 + 0.58) / rT(1.9);
        const p = wandPunkt(phi, 1.9, 0.25);
        M.licht(p[0], p[1], p[2], 2.2, "255,196,120", 0.7);
        M.bodenlicht(D[0] * (R0 + 1.2), D[1] * (R0 + 1.2), 2.6, "255,190,110", 0.55);
      }
      /* Flügel (nur ohne Variante: Baukasten) – dieselbe Figur wie im Drehblatt */
      if (!variante && Z.fertig) {
        const th0 = (((ST.jetzt || 0) / 1000) * 7 / 60 * TAU) % (Math.PI / 2) + 0.3;
        M.teil("fluegel", { schatten: false });
        M.figur({ x: NABE[0], y: NABE[1], z: ZU, breite: 17, hoehe: 2 * RL + 1.2, schatten: false, malen: fluegelFigur(Z, th0) });
      }
    }
  });
  /* Maße für die leichte Stadt (stadt-leicht/windmuehle.js) */
  ST.WINDMUEHLE = { NABE: NABE, H: H, RL: RL, DREH_TAG: 7, DREH_NACHT: 3 };
})();
