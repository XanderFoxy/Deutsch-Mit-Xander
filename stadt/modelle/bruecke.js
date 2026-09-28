/* =====================================================================
   BAUKASTEN-STADT — DIE STEINERNE BOGENBRÜCKE ÜBER DEN BACH
   ---------------------------------------------------------------------
   XANDER: „Ich möchte einen Liebreiz zur Weihnachtsdeko … mit Schmücken,
   mit Schnee … Das möchte ich in Perfektion." – „Richtig filigran.
   Richtig schön ausarbeiten mit schönen Texturen." – „Man soll das
   Fundament sehen beim Aufbauen … wenn der Bagger dann kommt und damit
   baut und dass man sieht wie das entsteht. Schritt für Schritt."

   Eine Sandsteinbrücke, wie sie in Franken und Hessen über jeden Bach
   führt – eine kompakte Buckelbrücke für Fußgänger und Handkarren:
   ein Segmentbogen mit 4,4 m lichter Weite und 1,25 m Stich, der
   Bogenring (32 cm) aus 23 Keilsteinen mit einem vorstehenden
   Schlussstein (Jahreszahl 1826), Stirnmauern aus Quadern, darüber ein
   profiliertes Gurtgesims, die Brüstung (0,85 m, 35 cm dick) mit
   gerundeten Abdeckplatten, an den vier Enden Pfeiler mit
   Sandsteinkugeln. Auf der Fahrbahn Kopfsteinpflaster.
   Das Längsprofil ist ein echter „Eselsrücken": gerundete Kuppe
   (Halbmesser 2,4 m), gerade Rampen, unten weich ausgerundet – kein
   S-Schwung. Die Rampen steigen mit 33 %: Bei 11,2 m Länge und einem
   Scheitel von 1,68 m (Bogen 1,25 + Ring 0,32 + Pflaster) geht es nicht
   flacher – im Mittel sind es schon 30 %. So steil sind alte
   Saumpfad- und Fußgängerbrücken wirklich.
   Unter dem Bogen: die Laibung (die Unterseite des Gewölbes) – durch die
   Öffnung sieht man sie feucht und dunkel, mit Kalkausblühungen.
   Maße: 11,2 m lang (Fahrbahn entlang y), 3,6 m breit, 2,9 m lichte
   Weite der Fahrbahn zwischen den Brüstungen.

   In Winterhausen steht sie bei x ≈ 31,5 / y ≈ −2 mit gier 90: die
   Fahrbahn (Modell-y) zeigt dann nach Westen/Osten und führt den Weg
   über den Bach, der unter dem Bogen nach Süden fließt.

   Winter: Schnee auf der Fahrbahn mit festgetretenem Pfad, Fußspuren und
   Kufenrillen, Schlagschatten der Brüstung auf dem Schnee, Schneewülste
   auf Abdeckplatten, Gesims und Pfeilern, Eiszapfen am Bogen und am
   Gesims, eine Tannengirlande mit roten Schleifen und warmer
   Lichterkette an beiden Brüstungen.
   Frühling: Efeu hängt als Vorhang über die Zwickel an beiden
   Widerlagern, Moos in den Fugen und auf der Wetterseite der Platten,
   Gras in den Pflasterfugen, Blumenkästen mit Geranien und hängenden
   Petunien an den Brüstungen (wie an jeder fränkischen Dorfbrücke).

   BAUPHASEN (o.bau)
     0,00 Baugruben für die Widerlager (unter dem Boden, man schaut hinein)
     0,08 Beton läuft in die Gruben, Schalungsbretter am Rand
     0,15 Widerlager und Rampenmauern wachsen Quader für Quader
     0,27 das Lehrgerüst (Holzgerüst mit gebogener Schalung) wird gestellt
     0,36 Keilsteine von beiden Seiten nach oben, zuletzt der Schlussstein
     0,56 Stirnmauern wachsen, dazwischen wird aufgeschüttet
     0,72 Pflaster von den Enden zur Mitte
     0,82 Brüstungen und Pfeiler, danach wird das Lehrgerüst ausgebaut
     0,90 Abdeckplatten, Gesims, Kugeln – bei 1 Schmuck und Schnee
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const KX = ST.KX, KY = ST.KY, KZ = ST.KZ, LICHT = ST.LICHT, AUGE = ST.ZUM_AUGE;
  const TAU = Math.PI * 2;

  /* =====================================================================
     HELFER
     ===================================================================== */
  const klemm = (x, a, b) => (x < a ? a : x > b ? b : x);
  function rgb(f, a) { return a == null ? "rgb(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + ")" : "rgba(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + "," + a + ")"; }
  function mul(f, k) { return [Math.min(255, f[0] * k[0]), Math.min(255, f[1] * k[1]), Math.min(255, f[2] * k[2])]; }
  function skal(f, k) { return [f[0] * k, f[1] * k, f[2] * k]; }
  function plus(f, d) { return [Math.min(255, f[0] + d[0]), Math.min(255, f[1] + d[1]), Math.min(255, f[2] + d[2])]; }
  function misch(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  function phase(bau, a, b) { return klemm((bau - a) / (b - a), 0, 1); }
  function nrm3(v) { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
  function vieleck(g, pts) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); }

  function blick(gier, s) {
    const r = gier * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
    return {
      c: c, sn: sn, s: s,
      p(x, y, z) { const a = x * c - y * sn, b = x * sn + y * c; return [(a - b) * KX * s, (a + b) * KY * s - z * KZ * s]; },
      n(x, y, z) { const l = Math.hypot(x, y, z) || 1; return [(x * c - y * sn) / l, (x * sn + y * c) / l, z / l]; }
    };
  }
  function mitGier(malen) {
    let merk = 0;
    return function (g, s, F) {
      if (F.gier != null && isFinite(F.gier)) merk = F.gier; else F = Object.assign({}, F, { gier: merk });
      return malen(g, s, F);
    };
  }
  /* Stetiges Licht über gekrümmte, in Streifen zerlegte Flächen (Fahrbahn,
     Abdeckplatten): statt jede Scheibe einfarbig vom Kern beleuchten zu
     lassen (dann sähe man Stufen wie Bretter), rechnen wir das Licht an
     beiden Enden der Scheibe und legen einen Verlauf darüber.
     Die Drehung des Modells steckt in F.n (Normale im Kameraraum); aus
     ihr und der Modellnormale nf der Fläche gewinnen wir cos/sin zurück. */
  function drehung(F, nf) {
    const l = Math.hypot(nf[0], nf[1], nf[2]) || 1;
    nf = [nf[0] / l, nf[1] / l, nf[2] / l];
    const h = Math.hypot(nf[0], nf[1]);
    if (h < 0.02) return null;
    /* F.n = (nfx·c − nfy·s, nfx·s + nfy·c, nfz) → c, s */
    const a = F.n[0], b = F.n[1];
    const c = (a * nf[0] + b * nf[1]) / (h * h), sn = (b * nf[0] - a * nf[1]) / (h * h);
    return [c, sn];
  }
  function lichtEnden(F, nf, n0, n1) {
    const d = drehung(F, nf) || [1, 0];
    const dreh = (n) => { const l = Math.hypot(n[0], n[1], n[2]) || 1; return [(n[0] * d[0] - n[1] * d[1]) / l, (n[0] * d[1] + n[1] * d[0]) / l, n[2] / l]; };
    return [ST.lichtFaktor(dreh(n0), F.zeit, 0, F.jahr), ST.lichtFaktor(dreh(n1), F.zeit, 0, F.jahr)];
  }
  /* Schnee in EINER Schicht, schon beleuchtet: übereinandergemalte
     Schichten hinterlassen an den beschnittenen, geglätteten Rändern der
     Streifen feine dunkle Nähte (die untere Schicht schimmert im
     Randpixel durch) – bei hellem Schnee sähe man jede Naht. */
  function schneeVerlauf(g, F, k0, k1, farbe) {
    const f = farbe || [246, 249, 255];
    const gr = g.createLinearGradient(0, 0, 0, F.h);
    gr.addColorStop(0, rgb(mul(f, k0))); gr.addColorStop(1, rgb(mul(f, k1)));
    g.fillStyle = gr; g.fillRect(-0.2, -0.2, F.w + 0.4, F.h + 0.4);
  }
  function glattLicht(g, F, nf, n0, n1) {
    const [k0, k1] = lichtEnden(F, nf, n0, n1);
    const gr = g.createLinearGradient(0, 0, 0, F.h);
    gr.addColorStop(0, "rgb(" + k0.map((v) => Math.round(v * 255)).join(",") + ")");
    gr.addColorStop(1, "rgb(" + k1.map((v) => Math.round(v * 255)).join(",") + ")");
    g.globalCompositeOperation = "multiply";
    g.fillStyle = gr; g.fillRect(-0.2, -0.2, F.w + 0.4, F.h + 0.4);
    g.globalCompositeOperation = "source-over";
  }
  const neigung = (f, y) => { const d = 0.04; return (f(y + d) - f(y - d)) / (2 * d); };
  const normaleAuf = (f, y) => [0, -neigung(f, y), 1];

  /* Eiszapfen gebündelt: alle Zapfen einer Fläche in EINEM Pfad (viele
     einzelne Verläufe sind in der Grafikkarte teuer), darüber ein Pfad
     mit den Lichtkanten. zapfen = [[x, y, länge], …] in Flächenmetern */
  function zapfenMalen(g, zapfen, k) {
    if (!zapfen.length) return;
    const koerper = new Path2D(), kante = new Path2D();
    for (const [x, y, l] of zapfen) {
      const b = 0.008 + l * 0.08;
      koerper.moveTo(x - b, y); koerper.quadraticCurveTo(x - b * 0.35, y + l * 0.6, x, y + l); koerper.quadraticCurveTo(x + b * 0.35, y + l * 0.6, x + b, y); koerper.closePath();
      kante.moveTo(x - b * 0.35, y); kante.quadraticCurveTo(x - b * 0.2, y + l * 0.5, x - b * 0.05, y + l * 0.85);
    }
    g.fillStyle = rgb(mul([196, 220, 244], k), 0.62); g.fill(koerper);
    g.strokeStyle = rgb(mul([252, 254, 255], k), 0.85); g.lineWidth = 0.006; g.stroke(kante);
  }

  /* Schneefarbe wie im Boden (boden.js) – für Wehen, die aus dem Boden wachsen */
  function bodenSchnee(Z, sdif) {
    const f = [0.93, 0.95, 0.99], m = [0.97, 0.99, 1.05];
    return [0, 1, 2].map((i) => 255 * f[i] * Math.min(1.05, Z.amb[i] * m[i] + Z.sonne[i] * sdif * 1.45));
  }

  /* =====================================================================
     MASSE UND FORMEN
     ===================================================================== */
  /* L = halbe Länge (Fahrbahn bis z = 0), W = halbe Länge der Brüstungen
     (dahinter die Pfeiler), span = halbe lichte Weite, rk/rf = Halbmesser
     der Ausrundung an der Kuppe und am Fuß der Rampe.
     In Winterhausen (x = 31,5, gier 90) reicht sie von x ≈ 25,9 bis 37,1 –
     1,6 m Abstand zum Fachwerkhaus (endet bei x = 24,3). */
  const B = { L: 5.6, W: 5.1, xa: 1.8, xi: 1.45, span: 2.2, stich: 1.25, ring: 0.32, krone: 1.68, br: 0.85, kh: 0.12, ku: 0.035, gv: 0.08, rk: 2.4, rf: 0.9 };
  const R = (B.span * B.span + B.stich * B.stich) / (2 * B.stich);    // Halbmesser der Laibung ≈ 2,56 m
  const ZC = B.stich - R;                                              // Mittelpunkt (unter dem Boden)
  const PHI0 = Math.asin(B.span / R);                                  // Kämpferwinkel (≈ 59°)
  const RE = R + B.ring;                                               // Rücken des Bogenrings
  const KEIL = 23;                                                     // Keilsteine
  const ZMAX = B.krone + B.br;                                         // höchste Stelle der Mauer
  /* Längsprofil: Kuppe als Kreisbogen, gerade Rampe, weicher Fuß.
     Die Steigung m folgt aus Länge, Scheitelhöhe und beiden Halbmessern
     (Tangenten stetig): m²·(rk+rf)/2 − m·L + krone = 0  →  m ≈ 0,33 */
  const PROF = (() => { const S = B.rk + B.rf, m = (B.L - Math.sqrt(B.L * B.L - 2 * S * B.krone)) / S; return { m: m, u1: m * B.rk, u2: B.L - m * B.rf, z1: B.krone - m * m * B.rk / 2 }; })();
  const zDeck = (y) => {
    const u = Math.abs(y);
    if (u >= B.L) return 0;
    if (u <= PROF.u1) return B.krone - u * u / (2 * B.rk);
    if (u <= PROF.u2) return PROF.z1 - PROF.m * (u - PROF.u1);
    const d = B.L - u; return d * d / (2 * B.rf);
  };
  const zWand = (y) => zDeck(y) + B.br;
  const zI = (y) => (Math.abs(y) >= B.span ? 0 : ZC + Math.sqrt(R * R - y * y));
  const zE = (y) => (Math.abs(y) >= RE * Math.sin(PHI0) ? 0 : ZC + Math.sqrt(RE * RE - y * y));
  const bogenPunkt = (r, phi) => [r * Math.sin(phi), ZC + r * Math.cos(phi)];

  /* Bogenlänge entlang der Fahrbahn (für durchlaufende Pflasterreihen) */
  const BOGEN = (() => { const t = []; let s = 0, y0 = -B.L, z0 = zDeck(-B.L); for (let i = 0; i <= 300; i++) { const y = -B.L + 2 * B.L * i / 300, z = zDeck(y); s += Math.hypot(y - y0, z - z0); t.push([y, s]); y0 = y; z0 = z; } return t; })();
  function bogenLaenge(y) { const i = klemm(Math.round((y + B.L) / (2 * B.L) * 300), 0, 300); return BOGEN[i][1]; }

  /* Bereich unten(y) ≤ z ≤ oben(y) als Vielecke [y, z] (teilt sich, wo
     oben unter unten fällt – etwa über dem offenen Bogen) */
  function bereich(yA, yB, unten, oben) {
    const ys = [];
    for (let y = yA; y < yB - 1e-6; y += Math.abs(y) < RE ? 0.1 : 0.25) ys.push(y);
    ys.push(yB);
    for (const y of [-B.span, B.span, -RE * Math.sin(PHI0), RE * Math.sin(PHI0)]) if (y > yA && y < yB) ys.push(y);
    ys.sort((a, b) => a - b);
    const teile = [];
    let lauf = null;
    for (const y of ys) {
      const lo = unten(y), hi = oben(y);
      if (hi > lo + 1e-3) { if (!lauf) lauf = []; lauf.push([y, lo, hi]); }
      else if (lauf) { if (lauf.length > 1) teile.push(lauf); lauf = null; }
    }
    if (lauf && lauf.length > 1) teile.push(lauf);
    return teile.map((l) => l.map((q) => [q[0], q[2]]).concat(l.slice().reverse().map((q) => [q[0], q[1]])));
  }

  /* Ebene Fläche x = const, Vieleck in (y, z); seite = +1 (Normale +x) oder −1 */
  /* Die Fläche bekommt nur das umschließende Rechteck ihres Vielecks (der
     Kern legt Licht und Kontaktschatten über dieses Rechteck – ein 15 m
     langes Rechteck für ein schmales Band wäre teure, verschenkte Arbeit).
     Die Maler rechnen trotzdem in den gemeinsamen Koordinaten von
     zuFlaeche(): der Umschlag verschiebt den Ursprung zurück. */
  function flaecheX(M, x, seite, poly, f) {
    const zm = ZMAX + 0.5, ym = seite > 0 ? B.L : -B.L;
    const um = poly.map((q) => [seite > 0 ? ym - q[0] : q[0] - ym, zm - q[1]]);
    let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
    for (const q of um) { u0 = Math.min(u0, q[0]); u1 = Math.max(u1, q[0]); v0 = Math.min(v0, q[1]); v1 = Math.max(v1, q[1]); }
    const hin = (fn) => (typeof fn !== "function" ? fn : function (g, F) {
      g.save(); g.translate(-u0, -v0);
      const F2 = Object.create(F);
      F2.w = 2 * B.L; F2.h = zm;
      F2.leuchtPunkt = (a, b, r, c, k, fl) => F.leuchtPunkt(a - u0, b - v0, r, c, k, fl);
      fn(g, F2);
      g.restore();
    });
    const o = [x, ym - seite * u0, zm - v0];
    return M.flaeche(Object.assign({}, f, {
      o: o, u: [0, -seite, 0], v: [0, 0, -1], w: u1 - u0, h: v1 - v0, umriss: um.map((q) => [q[0] - u0, q[1] - v0]),
      malen: hin(f.malen), leuchten: f.leuchten ? hin(f.leuchten) : undefined
    }));
  }
  /* Umrechnung Welt (y, z) → Flächenkoordinaten einer flaecheX */
  const zuFlaeche = (seite) => { const zm = ZMAX + 0.5, ym = seite > 0 ? B.L : -B.L; return (y, z) => [seite > 0 ? ym - y : y - ym, zm - z]; };

  /* =====================================================================
     STEIN
     ===================================================================== */
  const STEINE = [
    { name: "gelber Sandstein", f: [190, 170, 136] },
    { name: "roter Mainsandstein", f: [176, 112, 88] },
    { name: "grauer Schilfsandstein", f: [168, 164, 142] }
  ];
  /* Quadermauerwerk in Weltkoordinaten (y, z), gemalt in der Fläche:
     Lagen fester Höhe (Welt-z), Steine verschiedener Länge, helle
     Kalkfugen, jeder Stein etwas anders, Kante oben hell, unten dunkel */
  function lagenPlan(saat) {
    const rng = ST.zufall(saat);
    const lagen = [];
    let z = 0;
    while (z < ZMAX + 0.2) {
      const h = 0.3 + rng() * 0.12;
      const steine = [];
      let y = -B.L - rng() * 0.6;
      while (y < B.L) { const l = 0.45 + rng() * 0.6; steine.push({ y0: y, y1: y + l, k: 0.88 + rng() * 0.2, rot: rng(), moos: rng(), alt: rng() }); y += l; }
      lagen.push({ z0: z, z1: z + h, steine: steine });
      z += h;
    }
    return lagen;
  }
  /* abgerundetes Rechteck an einen Pfad hängen */
  function rrPfad(p, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    p.moveTo(x + r, y); p.lineTo(x + w - r, y); p.quadraticCurveTo(x + w, y, x + w, y + r);
    p.lineTo(x + w, y + h - r); p.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    p.lineTo(x + r, y + h); p.quadraticCurveTo(x, y + h, x, y + h - r);
    p.lineTo(x, y + r); p.quadraticCurveTo(x, y, x + r, y); p.closePath();
  }
  /* Band zwischen zwei Höhenlinien (Welt: z = f(y) + a … f(y) + b) als
     Pfad in Flächenkoordinaten */
  function bandPfad(g, zf, f, a, b, yA, yB, schritt) {
    const d = schritt || 0.2;
    g.beginPath();
    let erst = true;
    for (let y = yA; y <= yB + 1e-6; y += d) { const p = zf(y, f(y) + b); if (erst) { g.moveTo(p[0], p[1]); erst = false; } else g.lineTo(p[0], p[1]); }
    for (let y = yB; y >= yA - 1e-6; y -= d) { const p = zf(y, f(y) + a); g.lineTo(p[0], p[1]); }
    g.closePath();
  }
  /* Alles, was viele gleichartige Stücke hat, wird in wenige Pfade
     gebündelt (ein Zeichenaufruf je Farbe statt je Stein) – in der
     Grafikkarte ist jeder einzelne Aufruf teuer.
     Jeder Quader hat eine gefaste Kante: die zur Sonne gewandte Fase ist
     hell, die abgewandte dunkel (F.lichtU sagt, von welcher Seite die
     Sonne in der Fläche kommt) – schon ab 12 px je Meter, damit die Mauer
     auch in der Stadtansicht nicht wie Tapete wirkt. Einzelne Steine sind
     verwittert (dunkler, mit abgeplatzten Schalen), unten zeigt sich
     Spritzwasser und im Winter weißes Streusalz. */
  function mauerMalen(g, F, stein, plan, zf, opt) {
    opt = opt || {};
    const px = F.px, fuge = 0.018;
    const grund = stein.f;
    g.fillStyle = rgb(misch(grund, [214, 206, 188], 0.55)); g.fillRect(-1, -1, F.w + 2, F.h + 2);   // Kalkmörtel
    const kante = px > 12, fein = px > 22;
    const rechtsHell = (F.lichtU || 0) > 0;
    const eimer = new Map();
    const hellP = new Path2D(), dunkelP = new Path2D(), obenP = new Path2D(), untenP = new Path2D();
    const seiteH = new Path2D(), seiteD = new Path2D(), hiebP = new Path2D(), schaleP = new Path2D(), schaleL = new Path2D();
    const moosP = [new Path2D(), new Path2D()];
    for (const L of plan) {
      if (opt.zMin != null && L.z1 < opt.zMin) continue;
      if (opt.zMax != null && L.z0 > opt.zMax) continue;
      for (const S of L.steine) {
        const a = zf(S.y0 + fuge / 2, L.z1 - fuge / 2), b = zf(S.y1 - fuge / 2, L.z0 + fuge / 2);
        const x0 = Math.min(a[0], b[0]), x1 = Math.max(a[0], b[0]), y0 = Math.min(a[1], b[1]), y1 = Math.max(a[1], b[1]);
        if (x1 < -0.1 || x0 > F.w + 0.1 || y1 < -0.1 || y0 > F.h + 0.1) continue;
        const stufe = Math.round((S.k - 0.88) / 0.2 * 5), ton = S.rot < 0.15 ? 1 : S.rot > 0.9 ? 2 : S.alt > 0.86 ? 3 : 0;
        const schl = stufe * 4 + ton;
        let p = eimer.get(schl);
        if (!p) { p = new Path2D(); eimer.set(schl, p); }
        const w = x1 - x0, h = y1 - y0;
        if (kante) rrPfad(p, x0, y0, w, h, 0.02); else p.rect(x0, y0, w, h);
        if (kante) {
          const fa = Math.min(0.024, h * 0.1);
          obenP.rect(x0 + 0.01, y0, w - 0.02, fa);
          untenP.rect(x0 + 0.01, y1 - fa, w - 0.02, fa);
          (rechtsHell ? seiteH : seiteD).rect(x1 - fa * 0.8, y0 + 0.01, fa * 0.8, h - 0.02);
          (rechtsHell ? seiteD : seiteH).rect(x0, y0 + 0.01, fa * 0.8, h - 0.02);
        }
        if (fein) {
          /* Farbwolken im Stein (Eisenoxid, Tonlinsen) */
          const sr = ST.zufall(((S.y0 * 1000) | 0) + ((L.z0 * 777) | 0));
          for (let j = 0; j < 3; j++) {
            const q = sr() < 0.5 ? hellP : dunkelP;
            const cx = x0 + w * (0.15 + sr() * 0.7), cy = y0 + h * (0.2 + sr() * 0.6), rx = w * (0.12 + sr() * 0.2), ry = h * (0.15 + sr() * 0.2);
            q.moveTo(cx + rx, cy); q.ellipse(cx, cy, rx, ry, 0, 0, TAU);
          }
          /* verwitterte Steine: abgeplatzte Schalen mit hellem Bruchrand */
          if (ton === 3) {
            for (let j = 0; j < 2; j++) {
              const cx = x0 + w * (0.2 + sr() * 0.6), cy = y0 + h * (0.25 + sr() * 0.5), rx = w * (0.1 + sr() * 0.16), ry = h * (0.12 + sr() * 0.16);
              schaleP.moveTo(cx + rx, cy); schaleP.ellipse(cx, cy, rx, ry, sr() - 0.5, 0, TAU);
              schaleL.moveTo(cx - rx * 0.9, cy - ry * 0.4); schaleL.ellipse(cx, cy, rx, ry, 0, Math.PI * 1.05, Math.PI * 1.7);
            }
          }
          /* Scharrierung: feine Hiebe des Steinmetzen (nur ganz nah) */
          if (px > 70) for (let x = x0 + 0.02; x < x1 - 0.02; x += 0.016) { hiebP.moveTo(x, y0 + 0.03); hiebP.lineTo(x + 0.006, y1 - 0.03); }
        }
        /* Moos wächst in den Lagerfugen – unten und im Tropfbereich viel,
           oben kaum; jedes Polster anders lang und dick */
        if (opt.moos && px > 8) {
          const hoehe = L.z0 - (opt.fuss ? opt.fuss((S.y0 + S.y1) / 2) : 0);
          const chance = opt.moos * (hoehe < 0.5 ? 1 : hoehe < 1.1 ? 0.45 : 0.15);
          if (S.moos < chance) {
            const sr = ST.zufall(((S.y1 * 911) | 0) + ((L.z0 * 353) | 0) + 7);
            let x = x0 + w * sr() * 0.5;
            const ende = x0 + w * (0.5 + sr() * 0.5);
            while (x < ende) {
              const rx = 0.02 + sr() * 0.07, ry = 0.01 + sr() * 0.022;
              const q = moosP[sr() < 0.6 ? 0 : 1];
              q.moveTo(x + rx, y1 + fuge * 0.3); q.ellipse(x, y1 + fuge * 0.3 - ry * 0.3, rx, ry, (sr() - 0.5) * 0.3, 0, TAU);
              x += rx * (0.9 + sr() * 1.4);
            }
          }
        }
      }
    }
    for (const [schl, p] of eimer) {
      const stufe = Math.floor(schl / 4), ton = schl % 4;
      let c = skal(grund, 0.88 + stufe * 0.04);
      if (ton === 1) c = misch(c, [170, 110, 90], 0.25);
      if (ton === 2) c = misch(c, [120, 116, 104], 0.3);
      if (ton === 3) c = misch(skal(c, 0.82), [92, 86, 74], 0.25);
      g.fillStyle = rgb(c); g.fill(p);
    }
    if (fein) {
      g.fillStyle = rgb(plus(grund, [16, 14, 10]), 0.3); g.fill(hellP);
      g.fillStyle = rgb(skal(grund, 0.84), 0.3); g.fill(dunkelP);
      g.fillStyle = rgb(skal(grund, 0.62), 0.45); g.fill(schaleP);
      g.strokeStyle = rgb(plus(grund, [34, 30, 24]), 0.55); g.lineWidth = 0.008; g.stroke(schaleL);
      if (px > 70) { g.strokeStyle = rgb(skal(grund, 0.84), 0.3); g.lineWidth = 0.004; g.stroke(hiebP); }
    }
    if (kante) {
      g.fillStyle = rgb(plus(grund, [30, 28, 22]), 0.55); g.fill(obenP);
      g.fillStyle = rgb(skal(grund, 0.62), 0.55); g.fill(untenP);
      g.fillStyle = rgb(plus(grund, [20, 18, 14]), 0.45); g.fill(seiteH);
      g.fillStyle = rgb(skal(grund, 0.66), 0.45); g.fill(seiteD);
    }
    if (opt.moos) {
      g.fillStyle = "rgba(58,86,38,0.62)"; g.fill(moosP[0]);
      g.fillStyle = "rgba(96,122,52,0.55)"; g.fill(moosP[1]);
    }
    if (px > 8) PI.rauschen(g, 0, 0, F.w, F.h, 2.4, 0.22, 21, 4);
    if (px > 25) PI.rauschen(g, 0, 0, F.w, F.h, 0.5, 0.2, 33, 3);
    if (px > 60) PI.rauschen(g, 0, 0, F.w, F.h, 0.12, 0.2, 47, 2);
    /* Spritzwasser am Fuß (Regen, Schneematsch): dunkler, leicht grünlich,
       nach oben verlaufend – in vier Bändern entlang der Fußlinie */
    if (opt.fuss && px > 6) {
      const f = opt.fuss;
      for (let i = 0; i < 4; i++) {
        bandPfad(g, zf, f, i * 0.12, (i + 1) * 0.12, -B.W - 0.3, B.W + 0.3, 0.25);
        g.fillStyle = "rgba(56,58,38," + (0.2 * (1 - i / 4)).toFixed(3) + ")"; g.fill();
      }
      /* Salzausblühungen (Winter: Streusalz vom Weg) – weiße, wolkige
         Ränder knapp über dem Spritzwasser */
      if (opt.salz && px > 12) {
        const rng = ST.zufall(71 + (opt.saat || 0));
        const sp = new Path2D();
        for (let i = 0; i < 2 * B.W * 5; i++) {
          const y = -B.W + rng() * 2 * B.W, z = f(y) + 0.06 + Math.pow(rng(), 1.6) * 0.34, p = zf(y, z);
          const rx = 0.05 + rng() * 0.16, ry = 0.012 + rng() * 0.03;
          sp.moveTo(p[0] + rx, p[1]); sp.ellipse(p[0], p[1], rx, ry, 0, 0, TAU);
        }
        g.fillStyle = "rgba(236,234,226," + (0.2 * opt.salz).toFixed(3) + ")"; g.fill(sp);
      }
    }
  }
  /* Keilsteine des Bogenrings (in einer Stirnfläche): derselbe Stein wie
     die Mauer, jeder Stein mit eigener Helligkeit; an der Laibungskante
     eine dunkle Schattenkante (dort biegt die Fläche nach innen weg), am
     Bogenrücken eine Fugenschattenlinie gegen die Zwickel. */
  function keilsteineMalen(g, F, stein, zf, von, bis, saat) {
    const rng = ST.zufall(saat + 5);
    const grund = stein.f;
    const kante = F.px > 12;
    const mortel = rgb(misch(grund, [214, 206, 188], 0.5));
    for (let i = 0; i < KEIL; i++) {
      const a0 = -PHI0 + 2 * PHI0 * i / KEIL, a1 = -PHI0 + 2 * PHI0 * (i + 1) / KEIL;
      const k = 0.86 + rng() * 0.2, ton = rng();
      if (i < von || i >= bis) continue;
      const schluss = i === (KEIL - 1) / 2;
      const rA = schluss ? RE + 0.06 : RE;
      const pts = [];
      for (let j = 0; j <= 3; j++) { const p = bogenPunkt(rA, a0 + (a1 - a0) * j / 3); pts.push(zf(p[0], p[1])); }
      for (let j = 3; j >= 0; j--) { const p = bogenPunkt(R, a0 + (a1 - a0) * j / 3); pts.push(zf(p[0], p[1])); }
      /* Fuge: Stein etwas kleiner */
      const m = pts.reduce((s, p) => [s[0] + p[0] / pts.length, s[1] + p[1] / pts.length], [0, 0]);
      const ein = pts.map((p) => [m[0] + (p[0] - m[0]) * 0.94, m[1] + (p[1] - m[1]) * 0.975]);
      vieleck(g, pts); g.fillStyle = mortel; g.fill();
      let c = skal(grund, k);
      if (ton < 0.12) c = misch(c, [170, 110, 90], 0.22);
      else if (ton > 0.9) c = misch(skal(c, 0.84), [92, 86, 74], 0.25);
      if (schluss) c = skal(grund, 1.0);
      vieleck(g, ein); g.fillStyle = rgb(c); g.fill();
      if (kante) {
        /* gefaste Stoßkanten: die zur Sonne gewandte hell, die andere dunkel */
        const rechtsHell = (F.lichtU || 0) > 0;
        const links = [ein[0], ein[ein.length - 1]], rechts = [ein[3], ein[4]];
        g.lineWidth = 0.016;
        g.strokeStyle = rgb(plus(c, [26, 24, 18]), 0.55);
        g.beginPath(); const hl = rechtsHell ? rechts : links; g.moveTo(hl[0][0], hl[0][1]); g.lineTo(hl[1][0], hl[1][1]); g.stroke();
        g.strokeStyle = rgb(skal(c, 0.66), 0.55);
        g.beginPath(); const dl = rechtsHell ? links : rechts; g.moveTo(dl[0][0], dl[0][1]); g.lineTo(dl[1][0], dl[1][1]); g.stroke();
      }
      if (F.px > 22) {
        /* Randschlag: gerader Rand, bossiertes Innenfeld */
        const in2 = pts.map((p) => [m[0] + (p[0] - m[0]) * 0.74, m[1] + (p[1] - m[1]) * 0.84]);
        vieleck(g, in2); g.fillStyle = rgb(skal(c, 0.95)); g.fill();
      }
      if (schluss && F.px > 30) {
        /* Jahreszahl im Schlussstein */
        const p = bogenPunkt(R + B.ring * 0.55, 0), q = zf(p[0], p[1]);
        g.save(); g.translate(q[0], q[1]);
        g.fillStyle = rgb(skal(c, 0.55)); g.font = "bold 0.085px Georgia, 'DejaVu Serif', serif"; g.textAlign = "center"; g.textBaseline = "middle";
        g.fillText("1826", 0, 0);
        g.restore();
      }
    }
    /* Schattenkante an der Laibung und Fugenlinie am Bogenrücken */
    const phiA = -PHI0 + 2 * PHI0 * von / KEIL, phiB = -PHI0 + 2 * PHI0 * bis / KEIL;
    if (phiB > phiA) {
      const bogen = (r) => { g.beginPath(); for (let j = 0; j <= 30; j++) { const b = bogenPunkt(r, phiA + (phiB - phiA) * j / 30), p = zf(b[0], b[1]); if (j) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); } };
      g.lineCap = "butt";
      bogen(R + 0.012); g.strokeStyle = "rgba(24,18,22,0.5)"; g.lineWidth = 0.026; g.stroke();
      bogen(R + 0.03); g.strokeStyle = "rgba(24,18,22,0.2)"; g.lineWidth = 0.014; g.stroke();
      bogen(RE + 0.006); g.strokeStyle = "rgba(40,30,28,0.38)"; g.lineWidth = 0.014; g.stroke();
    }
  }

  /* =====================================================================
     DIE BAUTEILE
     ===================================================================== */
  /* Stirnmauer (außen) bzw. Brüstung innen. Schlagschatten von Gesims und
     Abdeckplatte über F.schatten – so stimmt ihre Breite in jedem
     Drehwinkel, und liegt die Wand im Schatten, gibt es keinen. */
  function stirnMaler(seite, stein, plan, A, saat, innen) {
    const zf = zuFlaeche(seite);
    const fuss = innen ? zDeck : () => 0;
    return function (g, F) {
      const winter = F.jahr === "winter";
      mauerMalen(g, F, stein, plan, zf, { moos: winter ? 0.12 : (A.schmuck ? 0.5 : 0.3), fuss: fuss, salz: winter && !innen ? 0.8 : 0, saat: saat });
      /* Wasserspuren: dunkle Streifen unter dem Gesims */
      if (F.px > 10 && !innen) {
        const rng = ST.zufall(saat + seite * 7);
        for (let i = 0; i < 12; i++) {
          const y = -B.W + rng() * 2 * B.W, top = zf(y, zDeck(y) - 0.04), l = 0.3 + rng() * 0.7;
          const gr = g.createLinearGradient(0, top[1], 0, top[1] + l);
          gr.addColorStop(0, "rgba(56,50,42,0.24)"); gr.addColorStop(1, "rgba(56,50,42,0)");
          g.fillStyle = gr; g.fillRect(top[0] - 0.07, top[1], 0.12 + rng() * 0.12, l);
        }
      }
      /* Schlagschatten des Gurtgesimses (6 cm vor der Wand) */
      if (A.gesims && !innen) {
        const sv = F.schatten(B.gv + 0.02);
        bandPfad(g, zf, zDeck, GES.u - 0.035, GES.u, -B.W, B.W, 0.25);
        g.fillStyle = "rgba(34,30,44,0.18)"; g.fill();
        if (sv && sv[1] > 0.004) {
          g.beginPath();
          for (let y = -B.W; y <= B.W + 1e-6; y += 0.25) { const p = zf(y, zDeck(y) + GES.u); if (y === -B.W) g.moveTo(p[0], p[1]); else g.lineTo(p[0], p[1]); }
          for (let y = B.W; y >= -B.W - 1e-6; y -= 0.25) { const p = zf(y, zDeck(y) + GES.u); g.lineTo(p[0] + sv[0], p[1] + sv[1]); }
          g.closePath(); g.fillStyle = "rgba(24,22,40,0.36)"; g.fill();
        }
      }
      /* Schlagschatten der Abdeckplatte (Überstand) */
      if (A.kappen) {
        const sv = F.schatten(B.ku + 0.012);
        bandPfad(g, zf, zWand, -0.03, 0, -B.W, B.W, 0.25);
        g.fillStyle = "rgba(34,30,44,0.2)"; g.fill();
        if (sv && sv[1] > 0.003) {
          g.beginPath();
          for (let y = -B.W; y <= B.W + 1e-6; y += 0.25) { const p = zf(y, zWand(y)); if (y === -B.W) g.moveTo(p[0], p[1]); else g.lineTo(p[0], p[1]); }
          for (let y = B.W; y >= -B.W - 1e-6; y -= 0.25) { const p = zf(y, zWand(y)); g.lineTo(p[0] + sv[0], p[1] + sv[1]); }
          g.closePath(); g.fillStyle = "rgba(24,22,40,0.36)"; g.fill();
        }
      }
      /* Brüstung innen im Winter: der Fahrbahnschnee liegt an der Wand an
         (ein Wulst mit welliger Oberkante) – so liest man die Schneehöhe */
      if (innen && winter && A.schmuck) {
        const rng = ST.zufall(saat * 3 + seite);
        const pts = [];
        for (let y = -B.W; y <= B.W + 1e-6; y += 0.12) pts.push([y, zDeck(y) + 0.05 + (rng() - 0.3) * 0.035]);
        g.beginPath();
        pts.forEach((q, i) => { const p = zf(q[0], q[1]); if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); });
        for (let y = B.W; y >= -B.W - 1e-6; y -= 0.25) { const p = zf(y, zDeck(y) - 0.05); g.lineTo(p[0], p[1]); }
        g.closePath();
        g.fillStyle = "rgb(236,241,250)"; g.fill();
        /* Anlagerung wird zur Wand hin grau (Schatten in der Kehle) */
        bandPfad(g, zf, zDeck, 0.035, 0.085, -B.W, B.W, 0.25);
        g.fillStyle = "rgba(150,164,196,0.18)"; g.fill();
      }
      /* Efeu (Frühling): an beiden Widerlagern */
      if (!winter && A.schmuck && !innen && F.px > 5) efeuMalen(g, F, zf, saat + seite, seite);
    };
  }

  /* Efeu: wächst vom Boden über die Zwickel an beiden Widerlagern bis unter
     das Gesims und hängt an den Brückenenden als Vorhang von der
     Abdeckplatte. Zuerst die dunkle Masse (Unterlaub, auch aus der Ferne
     lesbar), darauf Blätter in drei Grüntönen, 6–9 cm groß, überlappend,
     mit Lichtkante; ganz nah Blattadern. */
  const EFEU_BLATT = (() => {
    const p = new Path2D();
    p.moveTo(0, 0.35);
    p.quadraticCurveTo(-0.5, 0.45, -0.95, 0.05); p.quadraticCurveTo(-0.7, -0.1, -0.62, -0.45);
    p.quadraticCurveTo(-0.3, -0.45, 0, -1); p.quadraticCurveTo(0.3, -0.45, 0.62, -0.45);
    p.quadraticCurveTo(0.7, -0.1, 0.95, 0.05); p.quadraticCurveTo(0.5, 0.45, 0, 0.35);
    p.closePath();
    return p;
  })();
  function efeuZonen(seite) {
    /* [y von, y bis, Art]: „unten" = vom Boden bis unters Gesims,
       „oben" = Vorhang von der Abdeckplatte am Brückenende */
    const a = B.span + 0.3;
    return [[-B.W - 0.05, -a, "unten"], [a, B.W + 0.05, "unten"], [-B.W - 0.05, -B.W + 1.2, "oben"], [B.W - 1.2, B.W + 0.05, "oben"]];
  }
  function efeuGrenzen(zone, y, rng) {
    const [ya, yb, art] = zone;
    const innen = art === "unten" ? (ya < 0 ? yb - y : y - ya) : (ya < 0 ? yb - y : y - ya);   // Abstand zum inneren Ende der Zone
    const t = klemm(innen / 0.9, 0, 1);
    const wellig = 0.5 + 0.5 * Math.sin(y * 5.1 + 1.3) * Math.sin(y * 2.3);
    if (art === "unten") {
      const oben = zDeck(y) + GES.u - 0.01;
      return [Math.max(0, zI(y) - 0.02), Math.max(0, Math.min(oben, oben * (0.35 + 0.65 * t) - wellig * 0.25 * (1 - t * 0.5)))];
    }
    const top = zWand(y) - 0.015, unten = zDeck(y) + GES.o + 0.01;
    return [Math.max(unten, top - (0.2 + 0.6 * t) * (0.6 + 0.4 * wellig)), top];
  }
  function efeuMalen(g, F, zf, saat, seite) {
    const rng = ST.zufall(saat * 3 + 1);
    const masse = new Path2D();
    const zonen = efeuZonen(seite);
    for (const zone of zonen) {
      const [ya, yb] = zone;
      const oben = [], unten = [];
      for (let y = ya; y <= yb + 1e-6; y += 0.08) { const [z0, z1] = efeuGrenzen(zone, y, rng); oben.push(zf(y, z1 + rng() * 0.03)); unten.push(zf(y, z0)); }
      masse.moveTo(oben[0][0], oben[0][1]);
      for (let i = 1; i < oben.length; i++) { const a = oben[i - 1], b = oben[i]; masse.quadraticCurveTo(a[0], a[1] - 0.03, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); }
      for (let i = unten.length - 1; i >= 0; i--) masse.lineTo(unten[i][0], unten[i][1]);
      masse.closePath();
    }
    g.fillStyle = "rgb(38,62,32)"; g.fill(masse);
    if (F.px < 14) {
      /* aus der Ferne: nur Licht und Schatten im Laub */
      g.save(); g.clip(masse);
      PI.rauschen(g, 0, 0, F.w, F.h, 0.6, 0.35, 12, 3);
      PI.bleichen(g, 0, 0, F.w, F.h, 0.5, 0.18, 14);
      g.restore();
      return;
    }
    const TOENE = [[46, 86, 40], [66, 112, 50], [90, 136, 60]];
    const pfade = [new Path2D(), new Path2D(), new Path2D()], lichtP = new Path2D(), ader = new Path2D();
    for (const zone of zonen) {
      const [ya, yb] = zone;
      const n = Math.round((yb - ya) * (zone[2] === "unten" ? 150 : 80));
      for (let i = 0; i < n; i++) {
        const y = ya + rng() * (yb - ya);
        const [z0, z1] = efeuGrenzen(zone, y, rng);
        if (z1 - z0 < 0.04) continue;
        const z = z0 + 0.02 + rng() * (z1 - z0 - 0.02);
        const p = zf(y, z);
        const r = 0.03 + rng() * 0.016, w = (rng() - 0.5) * 1.6 + (zone[2] === "oben" ? Math.PI : 0) * (rng() < 0.6 ? 1 : 0);
        const c = Math.cos(w) * r, s = Math.sin(w) * r;
        const mtx = new DOMMatrix([c, s, -s, c, p[0], p[1]]);
        const hoehe = (z - z0) / Math.max(0.05, z1 - z0);
        /* Büschel: ein Rauschfeld entscheidet, wo das Laub im Licht liegt
           (hell, obenauf) und wo in den Lücken (dunkel) – kein Samtteppich */
        const busch = ST.fbm(y * 3.1 + seite * 7, z * 3.1, 3, 17);
        const ton = klemm(Math.floor(rng() * 1.4 + (busch - 0.35) * 5 + hoehe * 0.5), 0, 2);
        pfade[ton].addPath(EFEU_BLATT, mtx);
        if (rng() < 0.4) lichtP.addPath(EFEU_BLATT, new DOMMatrix([c * 0.55, s * 0.55, -s * 0.55, c * 0.55, p[0] - r * 0.18, p[1] - r * 0.28]));
        if (F.px > 60) { ader.moveTo(p[0] + s * 0.3, p[1] - c * 0.3); ader.lineTo(p[0] - s * 0.8, p[1] + c * 0.8); }
      }
    }
    pfade.forEach((pf, i) => { g.fillStyle = rgb(TOENE[i]); g.fill(pf); });
    g.fillStyle = "rgba(150,186,104,0.5)"; g.fill(lichtP);
    if (F.px > 60) { g.strokeStyle = "rgba(196,214,160,0.45)"; g.lineWidth = 0.003; g.stroke(ader); }
    /* Haftwurzeln und alte Triebe (braungrau) an den Rändern */
    g.strokeStyle = "rgba(92,78,58,0.7)"; g.lineWidth = 0.01; g.lineCap = "round";
    g.beginPath();
    for (const zone of zonen) {
      if (zone[2] !== "unten") continue;
      for (let t = 0; t < 3; t++) {
        let y = zone[0] + rng() * (zone[1] - zone[0]), z = 0.02;
        const p0 = zf(y, z); g.moveTo(p0[0], p0[1]);
        for (let i = 0; i < 8; i++) { y += (rng() - 0.5) * 0.12; z += 0.06 + rng() * 0.05; const p = zf(y, z); g.lineTo(p[0], p[1]); }
      }
    }
    g.stroke();
  }
  /* Blumenkästen an der Brüstung (Frühling): Holzkasten an Eisenhaken,
     aufrechte Geranien, dazu hängende Petunien und Efeugeranien, die weit
     über die Mauer fallen. Eine eigene Ebene 10 cm vor der Wand. */
  const KASTEN = { y: [-2.9, 0, 2.9], b: 0.92, h: 0.17 };
  function kastenLage(y) {
    const u = Math.abs(y) + KASTEN.b / 2;
    return zWand(u) - 0.24;              // Oberkante: 24 cm unter der Abdeckplatte am tieferen Ende
  }
  function blumenkastenMaler(seite, saat, nur) {
    const zf = zuFlaeche(seite);
    return function (g, F) {
      const k = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
      const kO = ST.lichtFaktor([0, 0, 1], F.zeit, 0, F.jahr);
      const kk = [(k[0] + kO[0]) / 2, (k[1] + kO[1]) / 2, (k[2] + kO[2]) / 2];
      const fein = F.px > 20;
      KASTEN.y.forEach((yc, nr) => {
        if (nr !== nur) return;
        const rng = ST.zufall(saat * 13 + nr * 7 + seite);
        const zt = kastenLage(yc), zb = zt - KASTEN.h;
        const pL = zf(yc - KASTEN.b / 2, zt), pR = zf(yc + KASTEN.b / 2, zb);
        const x0 = Math.min(pL[0], pR[0]), x1 = Math.max(pL[0], pR[0]), y0 = pL[1], y1 = pR[1];
        const w = x1 - x0;
        const bluete = [[204, 30, 44], [226, 58, 96], [238, 238, 244], [150, 60, 170]];
        const haupt = bluete[(saat + nr) % 2], zweit = bluete[2 + ((saat + nr) % 2)];
        /* hängende Triebe hinter und vor dem Kasten */
        const haenger = (vorn) => {
          const blatt = [new Path2D(), new Path2D()], bl = new Path2D(), bld = new Path2D();
          const n = Math.round(w * 9);
          for (let i = 0; i < n; i++) {
            const x = x0 + 0.04 + rng() * (w - 0.08), lang = 0.12 + rng() * 0.32;
            let yy = y1 - 0.02, xx = x;
            const dx = (rng() - 0.5) * 0.08;
            for (let j = 0; j < 7; j++) {
              xx += dx * 0.3 + (rng() - 0.5) * 0.02; yy += lang / 7;
              const r = 0.022 + rng() * 0.012;
              blatt[rng() < 0.5 ? 0 : 1].moveTo(xx + r, yy); blatt[rng() < 0.5 ? 0 : 1].ellipse(xx, yy, r, r * 0.8, 0, 0, TAU);
              if (rng() < 0.35) { const rb = 0.028 + rng() * 0.012; bl.moveTo(xx + rb, yy + 0.01); bl.ellipse(xx, yy + 0.01, rb, rb * 0.9, 0, 0, TAU); bld.moveTo(xx + rb * 0.3, yy + 0.012); bld.arc(xx, yy + 0.012, rb * 0.3, 0, TAU); }
            }
          }
          if (!vorn) { g.fillStyle = rgb(mul([36, 70, 32], kk)); g.fill(blatt[0]); g.fill(blatt[1]); }
          else { g.fillStyle = rgb(mul([52, 96, 40], kk)); g.fill(blatt[0]); g.fillStyle = rgb(mul([70, 116, 50], kk)); g.fill(blatt[1]); }
          if (fein) {
            g.fillStyle = rgb(mul(zweit, kk)); g.fill(bl);
            g.fillStyle = rgb(mul(skal(zweit, 0.6), kk), 0.8); g.fill(bld);
          }
        };
        haenger(false);
        /* aufrechte Geranien: Laub, darüber kugelige Dolden */
        const laub = [new Path2D(), new Path2D()], dolde = new Path2D(), doldeL = new Path2D(), doldeS = new Path2D();
        for (let i = 0; i < w * 30; i++) {
          const x = x0 + 0.03 + rng() * (w - 0.06), y = y0 + 0.02 - rng() * 0.14, r = 0.03 + rng() * 0.02;
          laub[rng() < 0.5 ? 0 : 1].moveTo(x + r, y); laub[rng() < 0.5 ? 0 : 1].ellipse(x, y, r, r * 0.8, 0, 0, TAU);
        }
        g.fillStyle = rgb(mul([40, 82, 34], kk)); g.fill(laub[0]);
        g.fillStyle = rgb(mul([62, 110, 46], kk)); g.fill(laub[1]);
        for (let i = 0; i < Math.round(w * 5); i++) {
          const x = x0 + 0.08 + (i + 0.5) / Math.round(w * 5) * (w - 0.16) + (rng() - 0.5) * 0.06, y = y0 - 0.12 - rng() * 0.08, r = 0.05 + rng() * 0.02;
          dolde.moveTo(x + r, y); dolde.arc(x, y, r, 0, TAU);
          doldeS.moveTo(x + r, y + r * 0.2); doldeS.ellipse(x + r * 0.2, y + r * 0.25, r * 0.8, r * 0.6, 0, 0, TAU);
          doldeL.moveTo(x - r * 0.1 + r * 0.5, y - r * 0.3); doldeL.arc(x - r * 0.1, y - r * 0.3, r * 0.5, 0, TAU);
          if (fein) for (let j = 0; j < 5; j++) { const a = rng() * TAU, q = r * (0.5 + rng() * 0.5); doldeL.moveTo(x + Math.cos(a) * q + 0.012, y + Math.sin(a) * q); doldeL.arc(x + Math.cos(a) * q, y + Math.sin(a) * q, 0.012, 0, TAU); }
        }
        g.fillStyle = rgb(mul(haupt, kk)); g.fill(dolde);
        g.fillStyle = rgb(mul(skal(haupt, 0.7), kk), 0.7); g.fill(doldeS);
        g.fillStyle = rgb(mul(plus(haupt, [40, 40, 40]), kk), 0.75); g.fill(doldeL);
        /* der Kasten: grün gestrichenes Holz, Bretterfuge, Schatten unten */
        const kc = [58, 84, 60];
        const gr = g.createLinearGradient(0, y0, 0, y1);
        gr.addColorStop(0, rgb(mul(plus(kc, [26, 26, 20]), k))); gr.addColorStop(0.15, rgb(mul(kc, k))); gr.addColorStop(1, rgb(mul(skal(kc, 0.72), k)));
        g.fillStyle = gr; g.fillRect(x0, y0, w, y1 - y0);
        g.fillStyle = rgb(mul(skal(kc, 0.55), k)); g.fillRect(x0, y0 + (y1 - y0) * 0.5, w, 0.006);
        /* Haken */
        g.fillStyle = rgb(mul([40, 40, 42], k));
        for (const xh of [x0 + 0.12, x1 - 0.12]) g.fillRect(xh - 0.01, y0 - 0.02, 0.02, y1 - y0 + 0.04);
        haenger(true);
      });
    };
  }
  function blumenkastenPoly(yc) {
    const zt = kastenLage(yc);
    return [[yc - 0.62, zt + 0.32], [yc + 0.62, zt + 0.32], [yc + 0.62, zt - KASTEN.h - 0.52], [yc - 0.62, zt - KASTEN.h - 0.52]];
  }
  function ringMaler(seite, stein, A, saat) {
    const zf = zuFlaeche(seite);
    return function (g, F) { keilsteineMalen(g, F, stein, zf, A.keilVon, A.keilBis, saat, F.jahr); };
  }
  /* Eiszapfen am Bogen: durchsichtige Ebene vor der Öffnung */
  function eisMaler(seite, saat) {
    const zf = zuFlaeche(seite);
    return function (g, F) {
      const rng = ST.zufall(saat * 5 + (seite > 0 ? 1 : 2));
      const k = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
      const c0 = mul([188, 214, 240], k), c1 = mul([250, 253, 255], k), c2 = mul([150, 182, 218], k);
      const zapfen = [];
      let y = -B.span + 0.15;
      while (y < B.span - 0.15) {
        const mitte = 1 - Math.abs(y) / B.span;
        const p = zf(y, zI(y) + 0.01);
        zapfen.push([p[0], p[1], 0.05 + Math.pow(rng(), 2) * (0.18 + 0.3 * mitte)]);
        y += 0.06 + rng() * 0.2;
      }
      zapfenMalen(g, zapfen, k);
      void c0; void c2;
      /* Reif an der Bogenkante */
      g.strokeStyle = rgb(c1, 0.7); g.lineWidth = 0.02;
      g.beginPath();
      for (let yy = -B.span + 0.05; yy <= B.span - 0.05; yy += 0.1) { const p = zf(yy, zI(yy) + 0.012); if (yy < -B.span + 0.1) g.moveTo(p[0], p[1]); else g.lineTo(p[0], p[1]); }
      g.stroke();
    };
  }
  /* Tannengirlande mit roten Schleifen und Lichterkette an der Brüstung */
  const GIRL = { y: [-4.8, -3.2, -1.6, 0, 1.6, 3.2, 4.8], tief: 0.24 };
  function girlandeMaler(seite, saat) {
    const zf = zuFlaeche(seite);
    const kurve = (ya, yb, u) => { const y = ya + (yb - ya) * u; return [y, zWand(y) - 0.07 - GIRL.tief * Math.sin(Math.PI * u)]; };
    return {
      malen: function (g, F) {
        const k = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
        const kk = [Math.max(k[0], 0.35), Math.max(k[1], 0.38), Math.max(k[2], 0.45)];
        const rng = ST.zufall(saat * 7 + seite);
        const fein = F.px > 26;
        for (let i = 0; i < GIRL.y.length - 1; i++) {
          const ya = GIRL.y[i], yb = GIRL.y[i + 1];
          /* Reisigbündel: viele kurze Zweige entlang der Kurve */
          const n = fein ? 130 : 40;
          /* vier Grüntöne, je ein Pfad: ein Zeichenaufruf je Ton statt je Zweig */
          const pfade = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
          for (let j = 0; j < n; j++) {
            const u = rng(), q = kurve(ya, yb, u), p = zf(q[0], q[1] + (rng() - 0.5) * 0.09);
            const w = (rng() - 0.5) * 2.4, l = fein ? 0.06 + rng() * 0.07 : 0.05;
            const pf = pfade[(rng() * 4) | 0];
            pf.moveTo(p[0], p[1]); pf.lineTo(p[0] + Math.cos(w) * l, p[1] + Math.sin(w) * l * 0.8);
          }
          g.lineWidth = fein ? 0.014 : 0.05; g.lineCap = "round";
          const TOENE = [[26, 62, 38], [34, 76, 44], [22, 54, 34], [44, 88, 50]];
          pfade.forEach((pf, i) => { g.strokeStyle = rgb(mul(TOENE[i], kk)); g.stroke(pf); });
          if (F.jahr === "winter") {
            const sp = new Path2D();
            for (let j = 0; j < (fein ? 16 : 6); j++) { const q = kurve(ya, yb, rng()), p = zf(q[0], q[1] - 0.035); sp.moveTo(p[0] + 0.05, p[1]); sp.ellipse(p[0], p[1], 0.05, 0.014, 0, 0, TAU); }
            g.fillStyle = rgb(mul([246, 249, 255], kk), 0.9); g.fill(sp);
          }
          /* Lichterkette: Lämpchen tagsüber als kleine Glaskörper */
          if (fein) {
            const lp = new Path2D();
            for (let j = 1; j < 9; j++) { const q = kurve(ya, yb, j / 9), p = zf(q[0], q[1] + 0.02); lp.moveTo(p[0] + 0.012, p[1]); lp.arc(p[0], p[1], 0.012, 0, TAU); }
            g.fillStyle = rgb(mul([236, 226, 200], kk), 0.9); g.fill(lp);
          }
        }
        /* Schleifen an den Aufhängepunkten */
        for (const y of GIRL.y) {
          const p = zf(y, zWand(y) - 0.07), r = 0.1;
          const c = mul([184, 18, 32], kk), cd = mul([120, 10, 22], kk);
          g.fillStyle = rgb(cd);
          g.beginPath(); g.moveTo(p[0] - 0.01, p[1]); g.lineTo(p[0] - 0.05, p[1] + 0.2); g.lineTo(p[0] - 0.02, p[1] + 0.18); g.lineTo(p[0] + 0.005, p[1] + 0.21); g.lineTo(p[0] + 0.01, p[1]); g.fill();
          g.beginPath(); g.moveTo(p[0] + 0.01, p[1]); g.lineTo(p[0] + 0.05, p[1] + 0.19); g.lineTo(p[0] + 0.075, p[1] + 0.2); g.lineTo(p[0] + 0.03, p[1]); g.fill();
          g.fillStyle = rgb(c);
          for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(p[0], p[1]); g.bezierCurveTo(p[0] + sd * r * 0.4, p[1] - r * 0.9, p[0] + sd * r * 1.2, p[1] - r * 0.7, p[0] + sd * r, p[1] + r * 0.05); g.bezierCurveTo(p[0] + sd * r, p[1] + r * 0.5, p[0] + sd * r * 0.4, p[1] + r * 0.4, p[0], p[1]); g.fill(); }
          g.fillRect(p[0] - 0.018, p[1] - 0.02, 0.036, 0.04);
        }
      },
      leuchten: function (g, F) {
        const a = F.nacht;
        for (let i = 0; i < GIRL.y.length - 1; i++) {
          const ya = GIRL.y[i], yb = GIRL.y[i + 1];
          for (let j = 1; j < 9; j++) {
            const q = kurve(ya, yb, j / 9), p = zf(q[0], q[1] + 0.02);
            const gr = g.createRadialGradient(p[0], p[1], 0, p[0], p[1], 0.07);
            gr.addColorStop(0, "rgba(255,246,214," + a + ")"); gr.addColorStop(0.35, "rgba(255,204,130," + (0.7 * a) + ")"); gr.addColorStop(1, "rgba(255,170,80,0)");
            g.fillStyle = gr; g.fillRect(p[0] - 0.07, p[1] - 0.07, 0.14, 0.14);
          }
          if (F.sicht > 0.05) { const q = kurve(ya, yb, 0.5), p = zf(q[0], q[1]); F.leuchtPunkt(p[0], p[1], 1.3, "255,196,120", 0.3, true); }
        }
      }
    };
  }

  /* Laibung (Unterseite des Gewölbes): feucht, dunkel, Kalkausblühungen */
  function laibungMaler(stein, i, saat) {
    return function (g, F) {
      const rng = ST.zufall(saat * 13 + i * 7);
      const c = skal(stein.f, 0.78);
      g.fillStyle = rgb(misch(c, [190, 184, 170], 0.4)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      /* Stoßfugen: jede Wölbschicht hat eigene Steinlängen, versetzt */
      let x = -rng() * 0.5;
      while (x < F.w) {
        const l = 0.5 + rng() * 0.5, k = 0.86 + rng() * 0.2;
        g.fillStyle = rgb(skal(c, k));
        g.fillRect(x + 0.01, 0.012, l - 0.02, F.h - 0.024);
        x += l;
      }
      if (F.px > 8) PI.rauschen(g, 0, 0, F.w, F.h, 1.2, 0.3, 40 + i, 4);
      /* Kalkausblühungen und grünliche Feuchte */
      if (F.px > 12) {
        for (let j = 0; j < 3; j++) {
          if (rng() < 0.4) continue;
          g.fillStyle = rng() < 0.5 ? "rgba(236,232,220,0.3)" : "rgba(70,96,60,0.28)";
          g.beginPath(); g.ellipse(rng() * F.w, rng() * F.h, 0.2 + rng() * 0.3, F.h * 0.4, 0, 0, TAU); g.fill();
        }
      }
      /* Gewölbe ist dunkel: wenig Himmelslicht kommt hinein */
      g.fillStyle = "rgba(20,24,40,0.28)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      if (F.jahr === "winter" && F.px > 20) {
        /* Raureif an den Fugen */
        g.fillStyle = "rgba(235,242,255,0.35)";
        for (let j = 0; j < F.w * 3; j++) g.fillRect(rng() * F.w, rng() < 0.5 ? 0 : F.h - 0.02, 0.1 + rng() * 0.2, 0.02);
      }
    };
  }
  /* Rücken des Bogens während des Baus: rauer Stein, Mörtel */
  function rueckenMaler(stein) {
    return function (g, F) {
      g.fillStyle = rgb(skal(stein.f, 0.92)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      g.fillStyle = "rgba(220,214,200,0.6)";
      for (let x = 0.3; x < F.w; x += 0.55) g.fillRect(x, 0, 0.02, F.h);
      if (F.px > 8) PI.rauschen(g, 0, 0, F.w, F.h, 0.8, 0.35, 12, 4);
    };
  }
  /* Holz (Lehrgerüst, Schalung) */
  function holzMaler(farbe, laengs) {
    return function (g, F) {
      const rng = ST.zufall(ST.textHash(F.name || "h"));
      g.fillStyle = rgb(farbe); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      if (F.px > 14) {
        const n = laengs ? Math.max(1, Math.round(F.w / 0.14)) : Math.max(1, Math.round(F.h / 0.14));
        for (let i = 0; i < n; i++) {
          g.fillStyle = rgb(skal(farbe, 0.85 + rng() * 0.25));
          if (laengs) g.fillRect(i * F.w / n + 0.004, -0.1, F.w / n - 0.008, F.h + 0.2);
          else g.fillRect(-0.1, i * F.h / n + 0.004, F.w + 0.2, F.h / n - 0.008);
        }
      }
      if (F.px > 20) PI.rauschen(g, 0, 0, F.w, F.h, 0.6, 0.25, 9, 3);
    };
  }

  /* Fahrbahn: Kopfsteinpflaster; Winter: Schnee mit Trampelpfad und Spuren;
     Bauphase: Schotter der Aufschüttung */
  function fahrbahnMaler(stein, y0, y1, xb, art, saat, hoehe, fertig) {
    const s0 = bogenLaenge(y0);
    const maler = fahrbahnStoff(stein, y0, y1, xb, art, saat, s0);
    const za = hoehe(y0), zb = hoehe(y1), nf = [0, -(zb - za), y1 - y0];
    return function (g, F) {
      const [k0, k1] = lichtEnden(F, nf, normaleAuf(hoehe, y0), normaleAuf(hoehe, y1));
      const k = misch(k0, k1, 0.5);
      if (art === "schnee") {
        schneeVerlauf(g, F, k0, k1);
        schneeSpuren(g, F, s0, saat, k);
      } else {
        maler(g, F);
        glattLicht(g, F, nf, normaleAuf(hoehe, y0), normaleAuf(hoehe, y1));
      }
      if (fertig) bruestungSchatten(g, F, k);
    };
  }
  /* Die Brüstungen stehen 0,97 m über der Fahrbahn: am Fuß ein weicher
     Kontaktschatten (18 cm), und auf der sonnenabgewandten Seite ihr
     Schlagschatten. Seine Breite folgt aus der Sonnenrichtung in der
     Fläche (F.lichtU / F.lichtN) – in jedem Drehwinkel richtig. Im
     Schatten bleibt nur das Himmelslicht: wir multiplizieren mit dem
     Verhältnis „ohne Sonne / mit Sonne", so werden auch Fußspuren und
     Pflaster darunter richtig dunkler (auf Schnee blau). */
  function bruestungSchatten(g, F, k) {
    const W = F.w, H = F.h;
    g.save();
    g.globalCompositeOperation = "multiply";
    for (const [a, b] of [[0, 0.2], [W, W - 0.2]]) {
      const gr = g.createLinearGradient(a, 0, b, 0);
      gr.addColorStop(0, "rgb(150,158,184)"); gr.addColorStop(0.45, "rgb(214,218,232)"); gr.addColorStop(1, "rgb(255,255,255)");
      g.fillStyle = gr; g.fillRect(Math.min(a, b), -0.1, 0.2, H + 0.2);
    }
    if (F.lichtN > 0.04) {
      const kS = ST.lichtFaktor(F.n, { amb: F.zeit.amb, sonne: [0, 0, 0] }, 0, F.jahr);
      const q = [0, 1, 2].map((i) => Math.round(255 * klemm(kS[i] / Math.max(0.02, k[i]), 0, 1)));
      const tief = "rgb(" + q.join(",") + ")";
      const ws = klemm(-F.lichtU * (B.br + B.kh) / F.lichtN, -W, W), weich = 0.05;
      if (Math.abs(ws) > 0.02) {
        const kante = ws > 0 ? ws : W + ws;
        const gr = g.createLinearGradient(kante - weich * Math.sign(ws), 0, kante + weich * Math.sign(ws), 0);
        gr.addColorStop(0, tief); gr.addColorStop(1, "rgb(255,255,255)");
        g.fillStyle = gr;
        if (ws > 0) g.fillRect(-0.1, -0.1, ws + weich + 0.1, H + 0.2); else g.fillRect(W + ws - weich, -0.1, -ws + weich + 0.1, H + 0.2);
      }
    }
    g.restore();
  }
  /* Trampelpfad, Fußstapfen und Kufenrillen im Schnee der Fahrbahn
     (fortlaufend über alle Streifen: Weltmaß s0 = Bogenlänge) */
  const BAHN_LANG = BOGEN[BOGEN.length - 1][1];
  function schneeSpuren(g, F, s0, saat, k) {
    const W = F.w, H = F.h, m = W / 2;
    const rng = ST.zufall(saat + Math.round(s0 * 10));
    const c = (f, a) => rgb(mul(f, k), a);
    const gr = g.createLinearGradient(0, 0, W, 0);
    gr.addColorStop(0, c([255, 255, 255], 0)); gr.addColorStop(0.3, c([206, 210, 222], 0));
    gr.addColorStop(0.38, c([196, 200, 214], 0.45)); gr.addColorStop(0.5, c([188, 190, 202], 0.6)); gr.addColorStop(0.62, c([196, 200, 214], 0.45));
    gr.addColorStop(0.7, c([206, 210, 222], 0)); gr.addColorStop(1, c([255, 255, 255], 0));
    g.fillStyle = gr; g.fillRect(-0.2, -0.2, W + 0.4, H + 0.2 + 0.2);
    /* älterer, festgetretener Schnee: etwas grauer als der frische auf den Platten */
    g.fillStyle = c([214, 220, 234], 0.3); g.fillRect(-0.2, -0.2, W + 0.4, H + 0.4);
    if (F.px > 14) {
      /* Fußstapfen: viele Leute sind hier gegangen – Abdrücke kreuz und
         quer im Trampelpfad, jeder mit Schattenkante und hellem Rand */
      const n = Math.round(H * 9);
      const tritt = new Path2D(), rand = new Path2D();
      for (let i = 0; i < n; i++) {
        const rr = ST.zufall(Math.round((s0 + i / 9) * 97) + saat);
        const v = (Math.floor(s0 * 9) + i) / 9 - s0 + (rr() - 0.5) * 0.05;
        const x = m + (rr() - 0.5) * 0.9 * (0.4 + rr() * 0.6), w = (rr() - 0.5) * 0.5;
        const M = new DOMMatrix([Math.cos(w), Math.sin(w), -Math.sin(w), Math.cos(w), x, v]);
        const t = new Path2D(); t.ellipse(0, -0.05, 0.045, 0.075, 0, 0, TAU); t.ellipse(0, 0.07, 0.04, 0.05, 0, 0, TAU);
        tritt.addPath(t, M);
        const r = new Path2D(); r.ellipse(0.012, -0.06, 0.03, 0.06, 0, -Math.PI / 2, Math.PI / 2); rand.addPath(r, M);
      }
      g.fillStyle = c([158, 168, 192], 0.4); g.fill(tritt);
      g.fillStyle = c([255, 255, 255], 0.4); g.fill(rand);
      /* Kufenrillen: ein Schlitten wurde über die Kuppe gezogen und ist
         hinuntergerodelt – flache Rillen mit Schattenkante (zur Sonne hin)
         und heller Gegenkante, mit Lücken, nur auf gut der Hälfte der Brücke */
      const hell = (F.lichtU || 0) > 0 ? -1 : 1;
      const spur = (s) => s > BAHN_LANG * 0.22 && s < BAHN_LANG * 0.84 && Math.sin(s * 2.3 + 1.1) + Math.sin(s * 5.7) * 0.6 > -0.9;
      const dunkelP = new Path2D(), hellP = new Path2D();
      for (const d of [-0.21, 0.21]) {
        let an = false;
        for (let j = 0; j <= 16; j++) {
          const v = -0.05 + (H + 0.1) * j / 16, s = s0 + v;
          const x = m + 0.4 + d + Math.sin(s * 0.45) * 0.14;
          if (!spur(s)) { an = false; continue; }
          if (!an) { dunkelP.moveTo(x + 0.006 * hell, v); hellP.moveTo(x - 0.008 * hell, v); an = true; }
          else { dunkelP.lineTo(x + 0.006 * hell, v); hellP.lineTo(x - 0.008 * hell, v); }
        }
      }
      g.lineCap = "round";
      g.strokeStyle = c([130, 142, 170], 0.5); g.lineWidth = 0.012; g.stroke(dunkelP);
      g.strokeStyle = c([255, 255, 255], 0.55); g.lineWidth = 0.008; g.stroke(hellP);
    }
    if (F.px > 20) {
      /* Glitzer: winzige Kristalle, nachts kaum noch */
      const a = (0.5 * (1 - 0.7 * F.nacht)).toFixed(3);
      g.fillStyle = c([255, 255, 255], a);
      const r = Math.max(0.006, 0.6 / F.px);
      for (let j = 0; j < W * H * 8; j++) g.fillRect(0.05 + rng() * (W - 0.1), 0.02 + rng() * (H - 0.04), r, r);
    }
  }
  function fahrbahnStoff(stein, y0, y1, xb, art, saat, s0) {
    return function (g, F) {
      const W = F.w, H = F.h;
      const rng = ST.zufall(saat + Math.round(s0 * 10));
      if (art === "schotter") {
        g.fillStyle = "#8d7c66"; g.fillRect(-0.1, -0.1, W + 0.2, H + 0.2);
        if (F.px > 10) PI.rauschen(g, 0, 0, W, H, 0.4, 0.5, 5, 4);
        if (xb > B.xi + 0.01) {
          /* Mauerkrone links und rechts (Mörtelbett) */
          g.fillStyle = rgb(misch(stein.f, [200, 196, 186], 0.5)); g.fillRect(-0.1, -0.1, xb - B.xi + 0.1, H + 0.2); g.fillRect(W - (xb - B.xi), -0.1, xb - B.xi + 0.1, H + 0.2);
        }
        return;
      }
      /* Kopfsteinpflaster: Reihen quer zur Fahrbahn, gerundete Feldsteine
         10–18 cm, jeder etwas verdreht, in sandigen Fugen */
      const rand = xb - B.xi;
      g.fillStyle = "#6c6152"; g.fillRect(-0.1, -0.1, W + 0.2, H + 0.2);
      const FARBEN = [[138, 134, 128], [122, 122, 124], [146, 134, 118], [104, 100, 96], [156, 150, 140]];
      if (F.px > 14) {
        const reihe = 0.15;
        const r0 = Math.floor(s0 / reihe);
        const eimer = FARBEN.map(() => [new Path2D(), new Path2D(), new Path2D()]);
        const licht = new Path2D(), randP = new Path2D();
        for (let r = r0 - 1; r * reihe < s0 + H + reihe; r++) {
          const v = r * reihe - s0;
          const rr = ST.zufall(saat * 31 + r * 7 + 1000);
          let x = -rr() * 0.12;
          while (x < W + 0.1) {
            const l = 0.1 + rr() * 0.08, hh = reihe * (0.72 + rr() * 0.22);
            const cx = x + l / 2 + (rr() - 0.5) * 0.02, cy = v + reihe / 2 + (rr() - 0.5) * 0.025;
            const fi = (rr() * FARBEN.length) | 0, hi = Math.min(2, (rr() * 3) | 0);
            const w0 = (rr() - 0.5) * 0.5, cw = Math.cos(w0), sw = Math.sin(w0);
            const m = new DOMMatrix([cw, sw, -sw, cw, cx, cy]);
            const stein = new Path2D(); rrPfad(stein, -l / 2 + 0.01, -hh / 2, l - 0.02, hh, Math.min(l, hh) * 0.42);
            eimer[fi][hi].addPath(stein, m);
            if (F.px > 30) {
              const lp = new Path2D(); lp.ellipse(-l * 0.1, -hh * 0.12, l * 0.28, hh * 0.22, 0, 0, TAU); licht.addPath(lp, m);
              const rp = new Path2D(); rp.ellipse(0, 0, l / 2 - 0.016, hh / 2 - 0.006, 0, 0.2, Math.PI * 0.95); randP.addPath(rp, m);
            }
            x += l;
          }
        }
        eimer.forEach((reihen, fi) => reihen.forEach((p, hi) => { g.fillStyle = rgb(skal(FARBEN[fi], 0.9 + hi * 0.1)); g.fill(p); }));
        if (F.px > 30) {
          g.fillStyle = "rgba(255,250,240,0.16)"; g.fill(licht);
          g.strokeStyle = "rgba(40,34,28,0.35)"; g.lineWidth = 0.012; g.stroke(randP);
        }
      } else PI.rauschen(g, 0, 0, W, H, 0.6, 0.5, 8, 4);
      if (art === "gruen") {
        /* Gras und Moos in den Fugen: alle Halme eines Streifens in zwei
           Pfaden (zwei Zeichenaufrufe statt Tausender), nur von nah */
        g.fillStyle = "rgba(84,116,54,0.22)";
        for (let j = 0; j < 3; j++) { g.beginPath(); g.ellipse(rng() * W, rng() * H, 0.12 + rng() * 0.3, 0.06 + rng() * 0.08, 0, 0, TAU); g.fill(); }
        if (F.px > 20) {
          const halme = [new Path2D(), new Path2D()];
          for (let j = 0; j < W * H * 14; j++) {
            /* am Rand zur Mauer und in der Mitte (wenig betreten) mehr Gras */
            const x = rng() < 0.5 ? rng() * 0.35 * (rng() < 0.5 ? 1 : -1) + (rng() < 0.5 ? 0 : W) : rng() * W, y = rng() * H;
            const h = halme[j & 1];
            h.moveTo(x, y); h.lineTo(x + (rng() - 0.5) * 0.04, y - 0.03 - rng() * 0.03);
          }
          g.lineWidth = 0.008; g.lineCap = "round";
          g.strokeStyle = "rgba(90,140,58,0.8)"; g.stroke(halme[0]);
          g.strokeStyle = "rgba(122,164,70,0.7)"; g.stroke(halme[1]);
        }
      }
      if (rand > 0.01) { g.fillStyle = rgb(misch(stein.f, [200, 196, 186], 0.5)); g.fillRect(-0.1, -0.1, rand + 0.1, H + 0.2); g.fillRect(W - rand, -0.1, rand + 0.1, H + 0.2); }
    };
  }

  /* Abdeckplatte (Oberseite). Winter: Schneepolster, dessen Ränder sich
     wegrunden (zur Sonne hell, abgewandt bläulich), an der Innenkante eine
     dunkle Kante – so trennt sich die Brüstung vom Fahrbahnschnee dahinter.
     Frühling: Moos entlang der Stoßfuge und an der Wetterseite, jede
     Platte anders. */
  function kappeSchnee(g, F, k, innenLinks) {
    const W = F.w, H = F.h;
    const rechtsHell = (F.lichtU || 0) > 0;
    g.save();
    g.globalCompositeOperation = "multiply";
    for (const [a, b, hellSeite] of [[0, 0.09, !rechtsHell], [W, W - 0.09, rechtsHell]]) {
      const innen = (a === 0) === innenLinks;
      const gr = g.createLinearGradient(a, 0, b, 0);
      gr.addColorStop(0, innen ? "rgb(150,164,200)" : hellSeite ? "rgb(226,232,244)" : "rgb(176,188,214)");
      gr.addColorStop(0.5, innen ? "rgb(214,222,238)" : "rgb(244,246,252)"); gr.addColorStop(1, "rgb(255,255,255)");
      g.fillStyle = gr; g.fillRect(Math.min(a, b), -0.1, 0.09, H + 0.2);
    }
    /* Stoßfuge der Platte schimmert als weiche Mulde durch */
    const gf = g.createLinearGradient(0, -0.03, 0, 0.03);
    gf.addColorStop(0, "rgb(255,255,255)"); gf.addColorStop(0.5, "rgb(226,232,246)"); gf.addColorStop(1, "rgb(255,255,255)");
    g.fillStyle = gf; g.fillRect(-0.1, -0.03, W + 0.2, 0.06);
    g.restore();
    /* Innenkante: 2,5 cm dunkler Saum (die Platte rundet sich zur Fahrbahn weg) */
    g.fillStyle = rgb(mul([92, 104, 138], k), 0.6);
    g.fillRect(innenLinks ? -0.1 : W - 0.025, -0.1, 0.125, H + 0.2);
  }
  function kappeObenMaler(stein, winter, saat, moos, wetterLinks) {
    return function (g, F) {
      const rng = ST.zufall(saat * 7 + 3);
      const c = skal(stein.f, 1.06);
      g.fillStyle = rgb(c); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      if (F.px > 10) PI.rauschen(g, 0, 0, F.w, F.h, 0.8, 0.28, 17, 3);
      /* Kanten gerundet: außen etwas dunkler */
      g.fillStyle = rgb(skal(c, 0.82), 0.5); g.fillRect(-0.1, -0.1, 0.13, F.h + 0.2); g.fillRect(F.w - 0.03, -0.1, 0.13, F.h + 0.2);
      /* Stoßfuge zur Nachbarplatte */
      g.fillStyle = rgb(skal(c, 0.6)); g.fillRect(-0.1, -0.006, F.w + 0.2, 0.012);
      if (moos && F.px > 8) {
        /* Moos: entlang der Stoßfuge und an der Wetterseite, unregelmäßig */
        const mp = [new Path2D(), new Path2D()];
        const n = 3 + ((rng() * 6) | 0);
        for (let i = 0; i < n; i++) {
          const anFuge = rng() < 0.55;
          const x = anFuge ? rng() * F.w : (wetterLinks ? rng() * 0.12 : F.w - rng() * 0.12);
          const y = anFuge ? (rng() < 0.5 ? 0.01 + rng() * 0.04 : F.h - 0.01 - rng() * 0.04) : rng() * F.h;
          const rx = anFuge ? 0.03 + rng() * 0.1 : 0.02 + rng() * 0.05, ry = anFuge ? 0.01 + rng() * 0.025 : 0.04 + rng() * 0.14;
          const q = mp[rng() < 0.6 ? 0 : 1];
          q.moveTo(x + rx, y); q.ellipse(x, y, rx, ry, (rng() - 0.5) * 0.4, 0, TAU);
          if (rng() < 0.5) { const x2 = x + (rng() - 0.5) * rx * 2, y2 = y + (rng() - 0.5) * ry * 1.5, r2 = rx * (0.3 + rng() * 0.4); q.moveTo(x2 + r2, y2); q.ellipse(x2, y2, r2, r2 * 0.6, 0, 0, TAU); }
        }
        g.fillStyle = "rgba(70,104,44,0.62)"; g.fill(mp[0]);
        g.fillStyle = "rgba(112,136,60,0.55)"; g.fill(mp[1]);
        /* Flechten: kleine gelbgraue Rosetten */
        g.fillStyle = "rgba(196,190,120,0.5)";
        for (let i = 0; i < 3; i++) { if (rng() < 0.4) continue; g.beginPath(); g.arc(rng() * F.w, rng() * F.h, 0.012 + rng() * 0.02, 0, TAU); g.fill(); }
      }
      void winter;
    };
  }
  const GES = { u: -0.04, o: 0.16 };
  /* Gurtgesims als Steinprofil (von oben): Oberseite der Deckplatte (hell,
     von oben beleuchtet), Platte, Hohlkehle (nach unten gewandt, dunkel),
     Rundstab (oben Licht, unten Schatten), Plättchen. Jedes Band mit dem
     Licht seiner eigenen Neigung – so liest es sich als Profil und nicht
     als Rohr. Den Schlagschatten auf die Wand malt die Stirnmauer. */
  function gesimsMaler(seite, stein, winter, saat, fruehling) {
    const zf = zuFlaeche(seite);
    const band = (g, a, b) => bandPfad(g, zf, zDeck, a, b, -B.W, B.W, 0.25);
    return function (g, F) {
      const n = F.n, oben = [0, 0, 1];
      const neig = (k) => nrm3([n[0] * (1 - Math.abs(k)), n[1] * (1 - Math.abs(k)), n[2] * (1 - Math.abs(k)) + k]);
      const L = (nn) => ST.lichtFaktor(nn, F.zeit, 0, F.jahr);
      const k = L(n);
      const c = stein.f;
      const PROFIL = [
        [GES.o, GES.o - 0.024, L(neig(0.85)), 1.08],   // Oberseite der Deckplatte
        [GES.o - 0.024, GES.o - 0.084, k, 1.0],        // Platte
        [GES.o - 0.084, GES.o - 0.104, L(neig(-0.7)), 0.78],  // Hohlkehle oben (tief im Schatten)
        [GES.o - 0.104, GES.o - 0.128, L(neig(-0.35)), 0.9],  // Hohlkehle unten
        [GES.o - 0.128, GES.o - 0.148, L(neig(0.55)), 1.04],  // Rundstab oben
        [GES.o - 0.148, GES.o - 0.168, L(neig(-0.5)), 0.86],  // Rundstab unten
        [GES.o - 0.168, GES.u, L(neig(-0.85)), 0.68]          // Plättchen, Unterseite
      ];
      for (const [a, b, kk, h] of PROFIL) { band(g, b, a); g.fillStyle = rgb(mul(skal(c, h), kk)); g.fill(); }
      if (F.px > 8) {
        band(g, GES.u, GES.o); g.save(); g.clip();
        PI.rauschen(g, 0, 0, F.w, F.h, 0.7, 0.22, 15, 3);
        /* Stoßfugen der Gesimsstücke (alle ~0,9 m) */
        if (F.px > 16) {
          g.strokeStyle = rgb(mul(skal(c, 0.55), k), 0.6); g.lineWidth = 0.008;
          g.beginPath();
          for (let y = -B.W + 0.45; y < B.W; y += 0.9) { const a = zf(y, zDeck(y) + GES.o), b = zf(y, zDeck(y) + GES.u); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
          g.stroke();
        }
        if (fruehling) {
          /* Moos und Flechten auf der Deckplatte und in der Kehle */
          const rng = ST.zufall(saat * 5 + seite);
          const mp = new Path2D();
          for (let i = 0; i < 2 * B.W * 3; i++) {
            const y = -B.W + rng() * 2 * B.W, z = zDeck(y) + GES.o - (rng() < 0.6 ? 0.008 : 0.068), p = zf(y, z), rx = 0.03 + rng() * 0.09;
            mp.moveTo(p[0] + rx, p[1]); mp.ellipse(p[0], p[1], rx, 0.006 + rng() * 0.01, 0, 0, TAU);
          }
          g.fillStyle = rgb(mul([70, 98, 44], k), 0.6); g.fill(mp);
        }
        g.restore();
      }
      if (fruehling && F.px > 10) {
        /* Efeu greift an den Brückenenden über das Gesims */
        const rng = ST.zufall(saat * 9 + seite);
        const pf = [new Path2D(), new Path2D()];
        for (const zone of efeuZonen(seite)) {
          if (zone[2] !== "oben") continue;
          for (let i = 0; i < 26; i++) {
            const y = zone[0] + rng() * (zone[1] - zone[0]), p = zf(y, zDeck(y) + GES.u + rng() * (GES.o - GES.u + 0.03));
            const r = 0.03 + rng() * 0.015, w = (rng() - 0.5) * 1.6, cw = Math.cos(w) * r, sw = Math.sin(w) * r;
            pf[rng() < 0.5 ? 0 : 1].addPath(EFEU_BLATT, new DOMMatrix([cw, sw, -sw, cw, p[0], p[1]]));
          }
        }
        g.fillStyle = rgb(mul([36, 70, 34], k)); g.fill(pf[0]);
        g.fillStyle = rgb(mul([56, 96, 44], k)); g.fill(pf[1]);
      }
      if (winter) {
        /* Schneepolster auf der Deckplatte (welliger Rücken, unten eine
           feine Schattenkante), Eiszapfen an der Unterkante */
        const rng = ST.zufall(saat + seite * 3);
        const kO = L(neig(0.9));
        const pts = [];
        for (let y = -B.W; y <= B.W + 1e-6; y += 0.1) pts.push(zf(y, zDeck(y) + GES.o + 0.02 + rng() * 0.018));
        g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
        for (let y = B.W; y >= -B.W - 1e-6; y -= 0.25) { const p = zf(y, zDeck(y) + GES.o - 0.012); g.lineTo(p[0], p[1]); }
        g.closePath(); g.fillStyle = rgb(mul([246, 249, 255], kO)); g.fill();
        band(g, GES.o - 0.016, GES.o - 0.008); g.fillStyle = rgb(mul([196, 208, 232], k), 0.7); g.fill();
        const zapfen = [];
        let y = -B.W + rng() * 0.3;
        while (y < B.W) {
          const p = zf(y, zDeck(y) + GES.u);
          zapfen.push([p[0], p[1], 0.03 + Math.pow(rng(), 2.5) * 0.22]);
          y += 0.08 + rng() * 0.3;
        }
        zapfenMalen(g, zapfen, k);
      }
    };
  }
  /* Seiten der Abdeckplatten: eine ebene Fläche je Seite */
  function kappenSeiteMaler(seite, stein, winter, saat) {
    const zf = zuFlaeche(seite);
    return function (g, F) {
      const c = skal(stein.f, 1.0);
      g.fillStyle = rgb(c); g.fillRect(-0.2, -0.2, F.w + 0.4, F.h + 0.4);
      if (F.px > 8) PI.rauschen(g, 0, 0, F.w, F.h, 0.6, 0.22, 7, 3);
      /* Stoßfugen zwischen den Platten, Kante oben gerundet (hell) */
      g.strokeStyle = rgb(skal(c, 0.66)); g.lineWidth = 0.012;
      for (let j = 0; j <= 14; j++) { const y = -B.W + 2 * B.W * j / 14, a = zf(y, zWand(y)), b = zf(y, zWand(y) + B.kh); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
      g.strokeStyle = rgb(plus(c, [22, 20, 16]), 0.7); g.lineWidth = 0.018;
      g.beginPath(); for (let y = -B.W; y <= B.W + 1e-6; y += 0.25) { const p = zf(y, zWand(y) + B.kh - 0.012); if (y === -B.W) g.moveTo(p[0], p[1]); else g.lineTo(p[0], p[1]); } g.stroke();
      if (winter) {
        /* überhängender Schneewulst */
        const rng = ST.zufall(saat + seite * 5);
        g.fillStyle = "rgb(244,247,253)";
        g.beginPath();
        for (let y = -B.W; y <= B.W + 1e-6; y += 0.25) { const p = zf(y, zWand(y) + B.kh + 0.05); if (y === -B.W) g.moveTo(p[0], p[1]); else g.lineTo(p[0], p[1]); }
        for (let y = B.W; y >= -B.W - 1e-6; y -= 0.12) { const p = zf(y, zWand(y) + B.kh - 0.035 - rng() * 0.035); g.lineTo(p[0], p[1]); }
        g.closePath(); g.fill();
      }
    };
  }

  /* Kugel auf dem Pfeiler (Sandstein), Winter mit Schneehaube,
     Frühling mit Pflanzschale daneben */
  function kugelFigur(stein, x, y, z, winter, schmuck, saat) {
    return {
      x: x, y: y, z: z, breite: 0.6, hoehe: 0.5, schatten: false,
      malen: function (g, s, F) {
        if (F.schatten) return;
        const r = 0.16 * s, cy = -(0.05 + 0.16) * KZ * s;
        const kL = ST.lichtFaktor([-0.3, 0.4, 0.8], F.Z, 0, F.jahr), kD = ST.lichtFaktor([0.5, 0.5, -0.3], F.Z, 0, F.jahr);
        /* Hals */
        g.fillStyle = rgb(mul(skal(stein.f, 0.9), kD)); g.fillRect(-0.07 * s, -0.07 * KZ * s, 0.14 * s, 0.07 * KZ * s);
        g.fillStyle = rgb(mul(stein.f, kL)); g.beginPath(); g.ellipse(0, -0.07 * KZ * s, 0.07 * s, 0.035 * s, 0, 0, TAU); g.fill();
        const gr = g.createRadialGradient(-r * 0.35, cy - r * 0.4, r * 0.1, 0, cy, r);
        gr.addColorStop(0, rgb(mul(plus(stein.f, [20, 18, 14]), kL))); gr.addColorStop(0.7, rgb(mul(stein.f, misch(kL, kD, 0.5)))); gr.addColorStop(1, rgb(mul(skal(stein.f, 0.85), kD)));
        g.fillStyle = gr; g.beginPath(); g.arc(0, cy, r, 0, TAU); g.fill();
        if (s > 40) PI.rauschen(g, -r, cy - r, 2 * r, 2 * r, 0.3 * s, 0.2, 27, 3);
        if (winter && schmuck) {
          const kS = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
          g.fillStyle = rgb(mul([248, 250, 255], kS));
          /* Schneekappe: folgt der Kugel oben, unten ein weicher, welliger Rand */
          g.beginPath();
          g.arc(0, cy, r * 1.02, Math.PI * 1.08, Math.PI * 1.92);
          for (let i = 0; i <= 8; i++) { const w = Math.PI * 1.92 - i / 8 * Math.PI * 0.84; g.lineTo(Math.cos(w) * r * 0.98, cy - r * 0.28 + Math.sin(i * 1.7) * r * 0.06 + (1 - Math.abs(i - 4) / 4) * r * 0.08); }
          g.closePath(); g.fill();
          g.fillStyle = rgb(mul([214, 224, 242], kS), 0.6);
          g.beginPath(); g.ellipse(r * 0.35, cy - r * 0.45, r * 0.4, r * 0.18, -0.3, 0, TAU); g.fill();
        }
        if (!winter && schmuck && s > 20) {
          /* Frühling: Moos und gelbe Flechten auf der Oberseite der Kugel
             (die Blumen hängen in den Kästen an der Brüstung) */
          const rng = ST.zufall(saat * 3 + 1);
          const kS = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
          for (let i = 0; i < 7; i++) {
            const w = Math.PI * (1.1 + rng() * 0.8), q = r * (0.35 + rng() * 0.55);
            g.fillStyle = rgb(mul(rng() < 0.6 ? [84, 108, 56] : [186, 174, 96], kS), 0.55);
            g.beginPath(); g.ellipse(Math.cos(w) * q, cy + Math.sin(w) * q * 0.9, r * (0.08 + rng() * 0.12), r * (0.05 + rng() * 0.06), rng() * 3, 0, TAU); g.fill();
          }
        }
      }
    };
  }

  /* Baugruben (unter dem Boden) als Figur: man schaut in die Öffnung */
  function grubenMalen(g, V, F, tiefe, fuell) {
    const s = V.s, kU = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
    const rng = ST.zufall(11);
    for (const sd of [-1, 1]) {
      const y0 = sd * 2.0, y1 = sd * 3.7, x0 = -2.1, x1 = 2.1;
      const loch = [[x0, Math.min(y0, y1)], [x1, Math.min(y0, y1)], [x1, Math.max(y0, y1)], [x0, Math.max(y0, y1)]];
      /* Aushub */
      for (let i = 0; i < 5; i++) {
        const p = V.p(x0 - 0.8 - rng() * 0.6, sd * (2.6 + rng() * 1.6), 0), Rr = (0.35 + rng() * 0.25) * s;
        const gr = g.createRadialGradient(p[0] - Rr * 0.3, p[1] - Rr * 0.5, Rr * 0.1, p[0], p[1] - Rr * 0.2, Rr);
        gr.addColorStop(0, rgb(mul([132, 104, 76], kU))); gr.addColorStop(0.7, rgb(mul([98, 74, 54], kU))); gr.addColorStop(1, rgb(mul([70, 52, 38], kU)));
        g.fillStyle = gr; g.beginPath(); g.ellipse(p[0], p[1], Rr, Rr * 0.5, 0, 0, Math.PI); g.ellipse(p[0], p[1], Rr, Rr * 0.75, 0, Math.PI, 0); g.fill();
      }
      const boden = fuell != null && fuell > -tiefe ? fuell : -tiefe;
      const beton = fuell != null && fuell > -tiefe + 0.01;
      g.save();
      vieleck(g, loch.map((q) => V.p(q[0], q[1], 0))); g.clip();
      vieleck(g, loch.map((q) => V.p(q[0], q[1], boden)));
      g.fillStyle = rgb(mul(beton ? [168, 166, 158] : [88, 68, 50], skal(kU, beton ? 0.9 : 0.6))); g.fill();
      if (beton && s > 10) {
        /* Bewehrung ragt aus dem frischen Beton */
        g.strokeStyle = "rgba(80,60,50,0.9)"; g.lineWidth = Math.max(0.5, 0.012 * s);
        for (let i = 0; i < 12; i++) { const p = V.p(x0 + 0.3 + i * 0.32, (y0 + y1) / 2, boden), q = V.p(x0 + 0.3 + i * 0.32, (y0 + y1) / 2, boden + 0.4); g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke(); }
      }
      for (let i = 0; i < 4; i++) {
        const a = loch[i], e = loch[(i + 1) % 4];
        const mx = (a[0] + e[0]) / 2, my = (a[1] + e[1]) / 2;
        const nk = V.n(-(mx), -(my - sd * 3.3), 0);
        if (nk[0] * AUGE[0] + nk[1] * AUGE[1] <= 0.001) continue;
        const k = ST.lichtFaktor(nk, F.Z, 0, F.jahr);
        const q = [V.p(a[0], a[1], 0), V.p(e[0], e[1], 0), V.p(e[0], e[1], boden), V.p(a[0], a[1], boden)];
        vieleck(g, q);
        const gr = g.createLinearGradient(0, q[0][1], 0, q[3][1]);
        gr.addColorStop(0, rgb(mul([118, 90, 64], skal(k, 0.85)))); gr.addColorStop(1, rgb(mul([70, 52, 38], skal(k, 0.55))));
        g.fillStyle = gr; g.fill();
        /* Verbau: Holzbohlen an den Grubenwänden */
        if (s > 14) {
          g.save(); vieleck(g, q); g.clip();
          for (let j = 1; j < 4; j++) { const zz = boden * j / 4; const p1 = V.p(a[0], a[1], zz), p2 = V.p(e[0], e[1], zz); g.strokeStyle = "rgba(130,96,60,0.8)"; g.lineWidth = Math.max(0.8, 0.05 * s); g.beginPath(); g.moveTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]); g.stroke(); }
          g.restore();
        }
      }
      g.restore();
    }
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  ST.modell("bruecke", {
    name: "Steinbrücke", gruppe: "Deko", grund: [3.9, 11.2], hoehe: 2.7, bauzeit: 8 * 60, standardGier: 90,
    bauen: function (M, o) {
      const bau = o.bau == null ? 1 : o.bau;
      const saat = Math.abs(o.saat | 0) || 1;
      const winter = o.jahr === "winter";
      const stein = STEINE[saat % STEINE.length];
      const plaene = { "1": lagenPlan(saat * 3 + 1), "-1": lagenPlan(saat * 3 + 2) };

      /* ---- Bauphasen ---- */
      const hSp = bau < 0.15 ? -1 : bau < 0.27 ? 0.45 * phase(bau, 0.15, 0.27) : bau < 0.56 ? 0.45 : 0.45 + (B.krone - 0.45) * phase(bau, 0.56, 0.72);
      const pBr = phase(bau, 0.82, 0.9);
      const oben = (y) => (bau >= 0.82 ? zDeck(y) + B.br * pBr : Math.min(zDeck(y), hSp));
      const keil = Math.floor(phase(bau, 0.36, 0.56) * ((KEIL + 1) / 2) + 1e-6);   // je Seite gelegte Keilsteine
      const A = {
        keilVon: 0, keilBis: KEIL, kappen: bau >= 0.96, schmuck: bau >= 1, gesims: bau >= 0.72,
        geruest: bau >= 0.27 && bau < 0.86, ring: bau >= 0.56
      };
      const gelegt = (i) => bau >= 0.56 || i < keil || i >= KEIL - keil;

      /* ---- 1. Baugruben und Beton ---- */
      if (bau < 0.15) {
        M.teil("grube", { ebene: -5, schatten: false, mitte: [0, 0, -2] });
        M.figur({ x: 0, y: 0, z: 0, breite: 7, hoehe: 1, schatten: false, malen: mitGier(function (g, s, F) {
          if (F.schatten) return;
          grubenMalen(g, blick(F.gier, s), F, 1.2, bau < 0.08 ? null : -1.2 + 1.2 * phase(bau, 0.08, 0.15));
        }) });
        if (bau < 0.08) return;
      }

      /* ---- 2. Laibung (Unterseite des Gewölbes) ---- */
      M.teil("laibung", { ebene: -3, schatten: false, mitte: [0, 0, -1] });
      if (bau >= 0.56) {
        /* Unter dem Gewölbe kommt kaum Himmelslicht hin: der Boden (Bach,
           Eis) liegt dort im tiefen Schatten, zu den Öffnungen hin heller */
        const um = [];
        for (let j = 0; j <= 24; j++) { const y = -B.span + 2 * B.span * j / 24; um.push([0, y]); }
        M.flaeche({ name: "dunkel", o: [-B.xa, -B.span, 0.004], u: [1, 0, 0], v: [0, 1, 0], w: 2 * B.xa, h: 2 * B.span, keinLicht: true, malen: function (g, F) {
          const gx = g.createLinearGradient(0, 0, F.w, 0);
          gx.addColorStop(0, "rgba(8,12,28,0.06)"); gx.addColorStop(0.07, "rgba(8,12,28,0.4)"); gx.addColorStop(0.5, "rgba(8,12,28,0.58)"); gx.addColorStop(0.93, "rgba(8,12,28,0.4)"); gx.addColorStop(1, "rgba(8,12,28,0.06)");
          g.fillStyle = gx; g.fillRect(0, 0, F.w, F.h);
        } });
        void um;
      }
      for (let i = 0; i < KEIL; i++) {
        if (!gelegt(i)) continue;
        const a0 = -PHI0 + 2 * PHI0 * i / KEIL, a1 = -PHI0 + 2 * PHI0 * (i + 1) / KEIL;
        const p0 = bogenPunkt(R, a0), p1 = bogenPunkt(R, a1);
        M.flaeche({ name: "laibung" + i, o: [B.xa, p0[0], p0[1]], u: [-1, 0, 0], v: [0, p1[0] - p0[0], p1[1] - p0[1]], w: 2 * B.xa, h: Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), malen: laibungMaler(stein, i, saat) });
      }

      /* ---- 3. Lehrgerüst mit Schalung (nur während des Baus) ---- */
      if (A.geruest) {
        const holz = [150, 118, 80], holzH = [178, 146, 100];
        const pG = phase(bau, 0.27, 0.36);
        M.teil("geruest", { ebene: -2, schatten: false, mitte: [0, 0, 0.4] });
        const stuetzen = [-1.8, -0.9, 0, 0.9, 1.8];
        stuetzen.forEach((y, j) => {
          if (j / stuetzen.length > pG * 1.4) return;
          const zt = zI(y) - 0.22;
          for (const x of [-1.25, 1.25]) M.quader({ x: x - 0.08, y: y - 0.08, z: 0, b: 0.16, t: 0.16, h: zt }, { sued: holzMaler(holz, false), nord: holzMaler(holz, false), ost: holzMaler(holz, false), west: holzMaler(holz, false) });
          if (pG > 0.5) M.quader({ x: -1.6, y: y - 0.09, z: zt, b: 3.2, t: 0.18, h: 0.16 }, { sued: holzMaler(holzH, true), nord: holzMaler(holzH, true), ost: rgb(holz), west: rgb(holz), oben: holzMaler(holzH, true) });
        });
        /* Schalung: Bretter oben auf dem Lehrbogen, wo noch kein Keilstein liegt */
        if (pG >= 1) {
          for (let i = 0; i < KEIL; i++) {
            if (gelegt(i) && bau >= 0.36) continue;
            const a0 = -PHI0 + 2 * PHI0 * i / KEIL, a1 = -PHI0 + 2 * PHI0 * (i + 1) / KEIL;
            const p0 = bogenPunkt(R - 0.02, a0), p1 = bogenPunkt(R - 0.02, a1);
            M.flaeche({ name: "schalung" + i, o: [-B.xa + 0.05, p0[0], p0[1]], u: [1, 0, 0], v: [0, p1[0] - p0[0], p1[1] - p0[1]], w: 2 * B.xa - 0.1, h: Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), malen: holzMaler(holzH, false) });
          }
        }
      }

      /* ---- 4. Rücken der Keilsteine (sichtbar, bis aufgefüllt ist) ---- */
      if (bau >= 0.36 && bau < 0.72) {
        M.teil("ruecken", { ebene: -1, mitte: [0, 0, 0.5] });
        for (let i = 0; i < KEIL; i++) {
          if (!gelegt(i)) continue;
          const a0 = -PHI0 + 2 * PHI0 * i / KEIL, a1 = -PHI0 + 2 * PHI0 * (i + 1) / KEIL;
          const p0 = bogenPunkt(RE, a0), p1 = bogenPunkt(RE, a1);
          M.flaeche({ name: "ruecken" + i, o: [-B.xa, p0[0], p0[1]], u: [1, 0, 0], v: [0, p1[0] - p0[0], p1[1] - p0[1]], w: 2 * B.xa, h: Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), malen: rueckenMaler(stein) });
          /* Stirnseiten der obersten Keilsteine (Fugenflächen), solange der Bogen offen ist */
        }
      }

      /* ---- 5. Stirnmauern (außen) mit Keilsteinen, Eiszapfen, Girlande, Gesims ---- */
      const zDm = B.krone * 0.55;
      for (const sd of [1, -1]) {
        const x = sd * B.xa;
        const polys = hSp > 0 ? bereich(-B.W, B.W, zI, (y) => Math.min(zWand(y), oben(y))) : [];
        /* Solange der Bogen offen ist, sind es zwei getrennte Mauern: je ein
           eigenes Teil, sonst spannt der Kern EINEN Schatten über die Lücke */
        const getrennt = polys.length > 1;
        if (!getrennt) M.teil("stirn" + sd, { mitte: [sd * B.xa, 0, zDm] });
        polys.forEach((poly, k) => {
          if (getrennt) { const ym = poly.reduce((a, q) => a + q[0], 0) / poly.length; M.teil("stirn" + sd + "-" + k, { mitte: [sd * B.xa, ym, zDm] }); }
          flaecheX(M, x, sd, poly, { name: "stirn" + sd + "-" + k, malen: stirnMaler(sd, stein, plaene[sd], A, saat), ao: true });
        });
        if (getrennt) M.teil("stirnring" + sd, { mitte: [sd * B.xa, 0, zDm] });
        /* Bogenring (Keilsteine) vor der Mauer */
        const ring = [];
        for (let j = 0; j <= 40; j++) ring.push(bogenPunkt(RE + 0.09 * (Math.abs(j - 20) <= 1 ? 1 : 0), -PHI0 + 2 * PHI0 * j / 40));
        for (let j = 40; j >= 0; j--) ring.push(bogenPunkt(R, -PHI0 + 2 * PHI0 * j / 40));
        if (bau >= 0.36) {
          /* Beim Bau: nur die gelegten Steine */
          const a = bau >= 0.56 ? KEIL : keil;
          const teil = (i0, i1) => {
            if (i1 <= i0) return;
            const pts = [];
            const phiA = -PHI0 + 2 * PHI0 * i0 / KEIL, phiB = -PHI0 + 2 * PHI0 * i1 / KEIL;
            const schluss = i0 <= (KEIL - 1) / 2 && i1 > (KEIL - 1) / 2;
            for (let j = 0; j <= 20; j++) { const phi = phiA + (phiB - phiA) * j / 20; const ks = schluss && Math.abs(phi) < PHI0 / KEIL * 1.02 ? 0.06 : 0; pts.push(bogenPunkt(RE + ks, phi)); }
            for (let j = 20; j >= 0; j--) pts.push(bogenPunkt(R, phiA + (phiB - phiA) * j / 20));
            flaecheX(M, x + sd * 0.004, sd, pts, { name: "ring" + sd + "-" + i0, malen: ringMaler(sd, stein, A, saat), ebene: 1 });
          };
          if (a >= (KEIL + 1) / 2) teil(0, KEIL);
          else { teil(0, a); teil(KEIL - a, KEIL); }
        }
        void ring;
        /* Eiszapfen am Bogen */
        if (winter && A.schmuck) {
          const poly = [];
          for (let j = 0; j <= 30; j++) { const y = -B.span + 2 * B.span * j / 30; poly.push([y, zI(y)]); }
          poly.push([B.span, 0], [-B.span, 0]);
          flaecheX(M, x + sd * 0.008, sd, poly, { name: "eis" + sd, malen: eisMaler(sd, saat), keinLicht: true, ebene: 2 });
        }
        /* Gurtgesims: Band am Fuß der Brüstung, 6 cm vorstehend – eine
           ebene Fläche je Seite (unten Platz für Eiszapfen) */
        if (bau >= 0.72) {
          const tief = winter && A.schmuck ? 0.42 : 0.01;
          const poly = [];
          for (let y = -B.W; y <= B.W + 1e-6; y += 0.25) poly.push([y, zDeck(y) + GES.o]);
          for (let y = B.W; y >= -B.W - 1e-6; y -= 0.25) poly.push([y, zDeck(y) + GES.u - tief]);
          flaecheX(M, x + sd * B.gv, sd, poly, { name: "gesims" + sd, malen: gesimsMaler(sd, stein, winter && A.schmuck, saat, !winter && A.schmuck), keinLicht: true, ebene: 1 });
        }
        /* Girlande (Winter) */
        if (winter && A.schmuck) {
          const poly = [];
          for (let y = -B.W; y <= B.W + 1e-6; y += 0.25) poly.push([y, zWand(y) + 0.02]);
          for (let y = B.W; y >= -B.W - 1e-6; y -= 0.25) poly.push([y, zWand(y) - 0.62]);
          const gm = girlandeMaler(sd, saat);
          flaecheX(M, x + sd * 0.03, sd, poly, { name: "girlande" + sd, malen: gm.malen, leuchten: gm.leuchten, keinLicht: true, ebene: 3 });
        }
        /* Blumenkästen (Frühling) – je eine eigene Ebene 10 cm vor der Wand */
        if (!winter && A.schmuck) {
          KASTEN.y.forEach((yc, i) => flaecheX(M, x + sd * 0.1, sd, blumenkastenPoly(yc), { name: "kasten" + sd + "-" + i, malen: blumenkastenMaler(sd, saat, i), keinLicht: true, ebene: 3 }));
        }
      }

      /* ---- 6. Brüstung innen ---- */
      if (bau >= 0.82) {
        for (const sd of [1, -1]) {
          M.teil("innen" + sd, { mitte: [sd * B.xi, 0, zDm] });
          for (const poly of bereich(-B.W, B.W, zDeck, oben)) {
            flaecheX(M, sd * B.xi, -sd, poly, { name: "innen" + sd, malen: stirnMaler(-sd, stein, plaene[sd], { kappen: A.kappen, schmuck: A.schmuck }, saat + 9, true) });
          }
        }
      }

      /* ---- 7. Fahrbahn (Schotter → Pflaster → Schnee) ---- */
      if (hSp > 0) {
        M.teil("fahrbahn", { mitte: [0, bau < 0.56 ? -B.L * 0.7 : 0, zDm] });
        const N = 30;
        let haelfte = -1;
        const pflaster = phase(bau, 0.72, 0.82);
        for (let j = 0; j < N; j++) {
          const ya = -B.L + 2 * B.L * j / N, yb = -B.L + 2 * B.L * (j + 1) / N;
          const ym = (ya + yb) / 2;
          /* Über dem offenen Bogen gibt es noch keine Fahrbahn */
          const za = oben(ya), zb = oben(yb);
          const zaD = Math.min(za, zDeck(ya)), zbD = Math.min(zb, zDeck(yb));
          if (Math.min(zaD - zE(ya), zbD - zE(yb)) < 0.02 && Math.abs(ym) < RE * Math.sin(PHI0)) continue;
          if (bau < 0.56 && Math.abs(ym) < B.span + 0.3) continue;
          if (bau < 0.56 && ym > 0 && haelfte < 0) { haelfte = 1; M.teil("fahrbahn2", { mitte: [0, B.L * 0.7, zDm] }); }
          const gepflastert = Math.abs(ym) >= B.L * (1 - pflaster) - 1e-6 && bau >= 0.72;
          const art = !gepflastert ? "schotter" : winter && A.schmuck ? "schnee" : !winter && A.schmuck ? "gruen" : "pflaster";
          const xb = bau >= 0.82 || Math.abs(ym) > B.W ? B.xi : B.xa;
          M.flaeche({ name: "bahn" + j, o: [-xb, ya, zaD], u: [1, 0, 0], v: [0, yb - ya, zbD - zaD], w: 2 * xb, h: Math.hypot(yb - ya, zbD - zaD), malen: fahrbahnMaler(stein, ya, yb, xb, art, saat, (y) => Math.min(oben(y), zDeck(y)), bau >= 0.86 && xb === B.xi), keinLicht: true });
        }
      }

      /* ---- 8. Abdeckplatten ---- */
      if (A.kappen || (bau >= 0.9)) {
        const pK = phase(bau, 0.9, 0.96);
        for (const sd of [1, -1]) {
          M.teil("kappe" + sd, { mitte: [sd * (B.xa + B.xi) / 2, 0, zDm + 0.9] });
          const N = 14;
          for (let j = 0; j < N; j++) {
            const ya = -B.W + 2 * B.W * j / N, yb = -B.W + 2 * B.W * (j + 1) / N;
            if (Math.abs((ya + yb) / 2) < B.W * (1 - pK) - 1e-6) continue;
            const za = zWand(ya), zb = zWand(yb);
            const xo = sd * (B.xa + B.ku), xn = sd * (B.xi - B.ku);
            const x0 = Math.min(xo, xn), x1 = Math.max(xo, xn);
            /* oben (leicht gewölbt: zwei schmale Streifen wären feiner – eine Fläche reicht) */
            const km = kappeObenMaler(stein, winter && A.schmuck, saat * 31 + j * 7 + (sd > 0 ? 3 : 0), !winter && A.schmuck, sd < 0), nfk = [0, -(zb - za), yb - ya];
            M.flaeche({ name: "kappe" + sd + "-" + j, o: [x0, ya, za + B.kh], u: [1, 0, 0], v: [0, yb - ya, zb - za], w: x1 - x0, h: Math.hypot(yb - ya, zb - za), keinLicht: true,
              malen: winter && A.schmuck
                ? (g, F) => { const [k0, k1] = lichtEnden(F, nfk, normaleAuf(zWand, ya), normaleAuf(zWand, yb)); schneeVerlauf(g, F, k0, k1, [248, 250, 255]); kappeSchnee(g, F, misch(k0, k1, 0.5), sd > 0); }
                : (g, F) => { km(g, F); glattLicht(g, F, nfk, normaleAuf(zWand, ya), normaleAuf(zWand, yb)); } });
          }
          /* Seiten: je eine ebene Fläche außen und innen */
          const fertig = (y) => Math.abs(y) >= B.W * (1 - pK) - 0.26;
          for (const band of bereich(-B.W, B.W, (y) => (fertig(y) ? zWand(y) : 99), (y) => zWand(y) + B.kh)) {
            flaecheX(M, sd * (B.xa + B.ku), sd, band, { name: "kappeA" + sd, malen: kappenSeiteMaler(sd, stein, winter && A.schmuck, saat) });
            flaecheX(M, sd * (B.xi - B.ku), -sd, band, { name: "kappeI" + sd, malen: kappenSeiteMaler(-sd, stein, winter && A.schmuck, saat + 1) });
          }
        }
      }

      /* ---- 9. Endpfeiler mit Kugeln ---- */
      if (bau >= 0.82) {
        const pP = phase(bau, 0.82, 0.9);
        const hP = 1.3 * pP;
        for (const sx of [1, -1]) for (const sy of [1, -1]) {
          const cx = sx * 1.6, cy = sy * (B.W + 0.25);
          M.teil("pfeiler" + sx + sy, { mitte: [cx, cy, 0.7] });
          const pm = (seite) => stirnMaler(seite, stein, plaene[sx], { kappen: false }, saat + 3);
          if (hP > 0.05) {
            M.quader({ x: cx - 0.25, y: cy - 0.25, z: 0, b: 0.5, t: 0.5, h: hP }, {
              sued: (g, F) => mauerMalen(g, F, stein, plaene[sx], (y, z) => [y, hP - z], {}),
              nord: (g, F) => mauerMalen(g, F, stein, plaene[-sx], (y, z) => [y, hP - z], {}),
              ost: (g, F) => mauerMalen(g, F, stein, plaene[sx], (y, z) => [y, hP - z], {}),
              west: (g, F) => mauerMalen(g, F, stein, plaene[-sx], (y, z) => [y, hP - z], {})
            });
          }
          void pm;
          if (bau >= 0.93) {
            const sch = winter && A.schmuck;
            const ob = sch ? "#f5f8fd" : (g, F) => { g.fillStyle = rgb(skal(stein.f, 1.08)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); PI.rauschen(g, 0, 0, F.w, F.h, 0.5, 0.25, 3, 3); };
            const si = (g, F) => { g.fillStyle = rgb(skal(stein.f, 1.02)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.fillStyle = rgb(skal(stein.f, 0.78)); g.fillRect(-0.1, F.h - 0.02, F.w + 0.2, 0.02); if (sch) { g.fillStyle = "#f3f6fc"; g.fillRect(-0.1, -0.1, F.w + 0.2, 0.05); } };
            M.quader({ x: cx - 0.31, y: cy - 0.31, z: 1.3, b: 0.62, t: 0.62, h: 0.1 }, { sued: si, nord: si, ost: si, west: si, oben: ob });
            M.figur(kugelFigur(stein, cx, cy, 1.4, winter, A.schmuck, saat + sx * 3 + sy));
          }
        }
      }

      /* Lichter der Girlande: warmer Schein über der Brücke (Nacht) */
      if (winter && A.schmuck && ST.szene && ST.szene.zeit !== "tag") {
        for (const sd of [1, -1]) for (const y of [-3.2, 0, 3.2]) M.licht(sd * (B.xa + 0.1), y, zWand(y) - 0.2, 2.2, "255,200,130", 0.16);
      }
    }
  });
})();
