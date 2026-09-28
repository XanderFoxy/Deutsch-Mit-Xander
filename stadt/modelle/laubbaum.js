/* =====================================================================
   BAUKASTEN-STADT — LAUBBAUM (Linde oder Eiche)
   ---------------------------------------------------------------------
   XANDER: „Das soll keine Comic Grafik sein. Das soll noch viel mehr am
   Realismus dran sein." · „Richtig filigran. Richtig schön ausarbeiten
   mit schönen Texturen." · „Alles mit Struktur" · „dass wir das später
   in einen Frühlingsgewand packen können."

   WIE DER BAUM ENTSTEHT
   Ein echtes Astgerüst im Raum (Meter), rekursiv gewachsen wie in der
   Natur: Stamm → Hauptäste → Seitenäste → Zweige → feinste Zweiglein mit
   Knospen. Jeder Ast ist EINE weiche Kurve: seine Richtung biegt sich
   niederfrequent (ein, zwei sanfte Wellen je Ast, dazu Schwerkraft und
   Licht), nicht bei jedem Schritt neu – so entsteht kein Zickzack-Draht.
   Knicke gibt es nur an echten Gabeln und, bei der Eiche, an wenigen
   „Ellenbogen". Die Kronenform (Hülle) begrenzt die Astlängen; kein Ast
   wächst zum Stamm zurück – keine Käfigbögen.
     Linde: gerader Stamm, der als Leittrieb in die Krone läuft; die
       Hauptäste streben schräg nach oben, die unteren hängen außen über;
       eiförmige, dichte Krone mit feinem Zweig-„Besen" am Rand.
     Eiche: kurzer, dicker Stamm, vier bis sechs kräftige, fast waagerecht
       ausladende Hauptäste mit wenigen Ellenbogen; breite Kuppel, kurze,
       knorrige Zweiglein.

   Winter: kahl, filigran – die Zweiglein werden als echte feine Striche
   gemalt (unter einem Bildpunkt Breite entsprechend blasser, so bleibt
   der graubraune Schleier in jeder Zoomstufe gleich). Schnee liegt auf
   der Oberseite der dicken, waagerechten Äste und in den Gabeln, die
   Eiche hält ein paar trockene braune Blätter fest.
   Frühling: frisches, lockeres Laub in Büscheln, zu Laubwolken gruppiert:
   jede Wolke oben links im Licht, unten rechts im Eigenschatten; die
   Äste liegen im Innern der Krone HINTER dem Laub. Linde dicht und
   glockig, Eiche in getrennten Wolken mit Himmelslücken.

   Rinde: Eiche tief und netzartig längsgefurcht mit hellen Graten, Linde
   flach und fein gerippt, grau – die Furchen sitzen auf dem Zylinder
   (am Rand gedrängt), die Rinde läuft bis in den Wurzelanlauf, der mit
   Wurzelhälsen weich in den Boden taucht.

   RECHENZEIT: eigene Leinwand im Arbeitsspeicher (viele kleine Pfade),
   Schatten in geringer Auflösung weich hochgezogen, Laubvorlagen ohne
   Auslesen der Bildpunkte getönt, gemeinsamer Vorlagen-Speicher.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const KX = ST.KX, KY = ST.KY, KZ = ST.KZ, LICHT = ST.LICHT;
  const SX = -LICHT[0] / LICHT[2], SY = -LICHT[1] / LICHT[2];
  const norm = ST.norm, kreuz = ST.kreuz, punkt = ST.punkt;
  const VARIANTEN = 6;
  const SB_MAX = 104;
  const klemm = (v, a, b) => Math.max(a, Math.min(b, v));
  const glatt = (a, b, v) => { const t = klemm((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

  /* ---------------- Blick: Modellpunkt → Bildpunkt ---------------- */
  function blick(gier, s) {
    const r = gier * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
    return {
      s: s,
      p(q) { const a = q[0] * c - q[1] * sn, b = q[0] * sn + q[1] * c; return [(a - b) * KX * s, (a + b) * KY * s - q[2] * KZ * s]; },
      tief(q) { const a = q[0] * c - q[1] * sn, b = q[0] * sn + q[1] * c; return (a + b) * 0.6124 + q[2] * 0.5; },
      n(v) { return [v[0] * c - v[1] * sn, v[0] * sn + v[1] * c, v[2]]; },
      boden(q) { const a = q[0] * c - q[1] * sn + SX * q[2], b = q[0] * sn + q[1] * c + SY * q[2]; return [(a - b) * KX * s, (a + b) * KY * s]; }
    };
  }
  function lichtAuf(n, Z, jahr) { return ST.lichtFaktor(norm(n), Z, 0, jahr); }
  function farbe(c, lf, k, a) {
    const r = Math.min(255, c[0] * lf[0] * k), g = Math.min(255, c[1] * lf[1] * k), b = Math.min(255, c[2] * lf[2] * k);
    return a == null ? "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")" : "rgba(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + "," + a.toFixed(3) + ")";
  }
  const rgbK = (f, k, a) => "rgba(" + Math.round(klemm(f[0] * k, 0, 255)) + "," + Math.round(klemm(f[1] * k, 0, 255)) + "," + Math.round(klemm(f[2] * k, 0, 255)) + "," + (a == null ? 1 : a) + ")";
  const plus = (p, v, k) => [p[0] + v[0] * k, p[1] + v[1] * k, p[2] + v[2] * k];
  const minus = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  function vieleckDazu(g, pts) {
    let fl = 0;
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; fl += a[0] * b[1] - b[0] * a[1]; }
    if (fl < 0) pts = pts.slice().reverse();
    g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    g.closePath();
  }
  /* beliebiger Vektor senkrecht zu d */
  function senkrecht(d) { const a = Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]; return norm(kreuz(d, a)); }
  /* d um Achse k (Einheitsvektor) um Winkel w drehen */
  function drehe(d, k, w) {
    const c = Math.cos(w), s = Math.sin(w), kd = punkt(k, d), kx = kreuz(k, d);
    return [d[0] * c + kx[0] * s + k[0] * kd * (1 - c), d[1] * c + kx[1] * s + k[1] * kd * (1 - c), d[2] * c + kx[2] * s + k[2] * kd * (1 - c)];
  }
  /* Punkt/Richtung auf einer Kette bei t (0…1) */
  function aufKette(pts, t) {
    const n = pts.length - 1, x = klemm(t, 0, 1) * n, i = Math.min(n - 1, Math.floor(x)), f = x - i;
    const a = pts[i], b = pts[i + 1];
    return { p: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f], d: norm(minus(b, a)), i, f };
  }

  /* =====================================================================
     LEINWÄNDE UND VORLAGEN (gemeinsamer Speicher der Natur-Modelle)
     ===================================================================== */
  function leinwand(w, h) {
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h));
    c.g = c.getContext("2d", { willReadFrequently: true });
    return c;
  }
  const VS = ST.naturVorlagen || (ST.naturVorlagen = { karte: new Map(), px: 0, max: 16e6 });
  function vorlageHolen(schl, bauen) {
    let c = VS.karte.get(schl);
    if (c) { VS.karte.delete(schl); VS.karte.set(schl, c); return c; }
    c = bauen();
    VS.karte.set(schl, c); VS.px += c.width * c.height;
    if (VS.px > VS.max) {
      for (const [k, v] of VS.karte) {
        if (VS.px < VS.max * 0.7) break;
        if (k === schl) continue;
        VS.karte.delete(k); VS.px -= v.width * v.height;
      }
    }
    return c;
  }
  function stufeS(s) { return Math.min(SB_MAX, Math.pow(1.12, Math.ceil(Math.log(Math.max(2, s)) / Math.log(1.12)))); }
  const STUFEN = 12;
  const STUFEN_SPEICHER = new Map();
  function stufen(Z, jahr) {
    const schl = Z.name + "|" + jahr + "|" + Z.amb.join(",");
    let st = STUFEN_SPEICHER.get(schl);
    if (st) return st;
    st = [];
    const rueck = jahr === "winter" ? [0.20, 0.21, 0.23] : [0.08, 0.10, 0.06];
    const hell = Z.amb[1] + Z.sonne[1] * 0.6;
    for (let i = 0; i < STUFEN; i++) {
      const t = i / (STUFEN - 1);
      const k = Math.max(0, (t - 0.3) / 0.7);
      const ao = t < 0.3 ? 0.36 + 0.64 * t / 0.3 : 1;
      const m = [0, 1, 2].map((c) => Math.min(1.15, (Z.amb[c] * 0.93 + Z.sonne[c] * k * 1.35 + rueck[c] * 0.35 * hell) * ao));
      st.push({ m: m, lum: 0.3 * m[0] + 0.59 * m[1] + 0.11 * m[2] });
    }
    STUFEN_SPEICHER.set(schl, st);
    return st;
  }
  function stufeFuer(st, lf, ao) {
    const lum = (0.3 * lf[0] + 0.59 * lf[1] + 0.11 * lf[2]) * ao;
    let best = 0, d = 9;
    for (let i = 0; i < st.length; i++) { const e = Math.abs(st[i].lum - lum); if (e < d) { d = e; best = i; } }
    return best;
  }
  /* Vorlage in einer Lichtstufe tönen – ohne Auslesen der Bildpunkte:
     auf die Mittelfarbe legen („Matte"), multiplizieren, mit der Vorlage
     ausstanzen (Ränder behalten ihre eigene Farbe) */
  function getoent(schl, basis, st, i) {
    const m = st[i].m;
    return vorlageHolen(schl + "|L" + m.map((v) => v.toFixed(3)).join(","), () => {
      const w = basis.width, h = basis.height;
      const c = leinwand(w, h), g = c.g;
      g.fillStyle = basis.matte; g.fillRect(0, 0, w, h);
      g.drawImage(basis, 0, 0);
      g.globalCompositeOperation = "multiply";
      g.fillStyle = "rgb(" + Math.round(Math.min(1, m[0]) * 255) + "," + Math.round(Math.min(1, m[1]) * 255) + "," + Math.round(Math.min(1, m[2]) * 255) + ")";
      g.fillRect(0, 0, w, h);
      const ueber = Math.max(m[0], m[1], m[2]) - 1;
      if (ueber > 0.005) { g.globalCompositeOperation = "screen"; g.fillStyle = "rgba(255,250,235," + (ueber * 0.6).toFixed(3) + ")"; g.fillRect(0, 0, w, h); }
      g.globalCompositeOperation = "destination-in";
      g.drawImage(basis, 0, 0);
      g.globalCompositeOperation = "source-over";
      c.ref = basis.ref; c.sB = basis.sB; c.ox = basis.ox; c.oy = basis.oy;
      return c;
    });
  }

  /* ---------------- Arten ---------------- */
  const ARTEN = {
    linde: {
      rinde: [132, 128, 120], rindeD: [70, 68, 64], rindeH: [168, 164, 154], zweig: [88, 80, 74], zweigJung: [98, 82, 72], knospe: [110, 78, 68],
      blatt: { fruehling: [118, 172, 52], sommer: [58, 104, 40], herbst: [206, 166, 52] },
      blattRueck: { fruehling: [170, 206, 110], sommer: [104, 146, 82], herbst: [220, 190, 104] },
      blattForm: "herz", blattGross: 0.085
    },
    eiche: {
      rinde: [112, 106, 98], rindeD: [46, 42, 38], rindeH: [158, 150, 138], zweig: [98, 88, 76], zweigJung: [108, 96, 80], knospe: [118, 98, 74],
      blatt: { fruehling: [132, 170, 58], sommer: [54, 94, 38], herbst: [176, 112, 46] },
      blattRueck: { fruehling: [182, 204, 118], sommer: [98, 132, 80], herbst: [196, 148, 90] },
      blattForm: "eiche", blattGross: 0.1, winterlaub: [150, 108, 64]
    }
  };

  /* ---------------- Vorlage: Blattbüschel ----------------
     Unregelmäßig, aus 3–5 Teilbüscheln, unten abgeflacht (die Blätter
     hängen), Mitte in der Mitte, Durchmesser ref. Viele einzelne Blätter
     (Linde herzförmig, Eiche gelappt), jedes anders gedreht; oben links
     hell, unten rechts schattig, ein paar helle Unterseiten, dazwischen
     Luft und kleine Zweige. */
  function laubVorlage(artName, jahr, sB, variante, welk) {
    const schl = "lb|" + artName + "|" + jahr + "|" + sB.toFixed(2) + "|" + variante + "|" + (welk ? 1 : 0);
    return vorlageHolen(schl, () => {
      const A = ARTEN[artName];
      const ref = 1.0, rand = 0.18;
      const ox = (ref / 2 + rand) * sB + 2, oy = ox;
      const c = leinwand((ref + 2 * rand) * sB + 4, (ref + 2 * rand) * sB + 4), g = c.g;
      c.ref = ref; c.sB = sB; c.ox = ox; c.oy = oy;
      g.setTransform(sB, 0, 0, sB, ox, oy);
      const R = ST.zufall(7000 + variante * 53 + (artName === "eiche" ? 3 : 0) + (welk ? 900 : 0) + (jahr === "fruehling" ? 11 : 0));
      const px = 1 / sB;
      const jz = jahr === "winter" ? "herbst" : jahr;
      const grund = welk ? A.winterlaub : A.blatt[jz], rueck = welk ? A.winterlaub : A.blattRueck[jz];
      c.matte = rgbK(grund, 0.8);
      const fruehling = jahr === "fruehling";
      const gross = A.blattGross * (fruehling ? 0.85 : 1) * (welk ? 1.2 : 1);
      /* Teilbüschel */
      const teil = [];
      const nt = welk ? 1 : 3 + Math.floor(R() * 3);
      for (let i = 0; i < nt; i++) {
        const w = R() * Math.PI * 2, r = (0.12 + 0.2 * R()) * (i ? 1 : 0.3);
        teil.push({ x: Math.cos(w) * r, y: Math.sin(w) * r * 0.7 - 0.04, r: 0.2 + 0.1 * R() });
      }
      const anz = welk ? 7 : Math.round((fruehling ? 50 : 70) + 14 * R());
      const blaetter = [];
      for (let i = 0; i < anz; i++) {
        const t = teil[Math.floor(R() * teil.length)];
        const w = R() * Math.PI * 2, r = Math.sqrt(R()) * t.r;
        let x = t.x + Math.cos(w) * r, y = t.y + Math.sin(w) * r * 0.8;
        /* unten abgeflacht: nach unten gestaucht */
        if (y > 0.12) y = 0.12 + (y - 0.12) * 0.45;
        if (Math.hypot(x, y) > 0.5) { const k = 0.5 / Math.hypot(x, y); x *= k; y *= k; }
        const hoch = 1 - Math.hypot(x - t.x, y - t.y) / (t.r + 0.01);
        /* Blätter hängen: Spitze eher nach unten/außen */
        const wb = Math.atan2(0.6 + y, x) + (R() - 0.5) * 1.5;
        blaetter.push({ x, y, w: wb, g: gross * (0.7 + 0.55 * R()), hoch, rueck: R() < (fruehling ? 0.16 : 0.1), t: R() });
      }
      blaetter.sort((a, b) => a.hoch - b.hoch + (a.y - b.y) * 0.3);
      /* Stiele und Zweiglein darunter */
      if (sB > 26) {
        g.strokeStyle = rgbK(A.zweigJung, 0.85); g.lineWidth = Math.max(0.6 * px, 0.007); g.lineCap = "round";
        g.beginPath();
        for (const t of teil) { g.moveTo(0, 0.45); g.quadraticCurveTo(t.x * 0.3, 0.2, t.x, t.y); }
        for (const b of blaetter) if (b.t < 0.3) { g.moveTo(b.x * 0.6, b.y * 0.6 + 0.06); g.lineTo(b.x, b.y); }
        g.stroke();
      }
      for (const b of blaetter) {
        /* Licht im Büschel: oben links hell, unten rechts dunkel, Kuppe heller */
        const l = 0.66 + 0.26 * b.hoch + 0.34 * (-b.x - b.y * 1.2) / ref + (b.t - 0.5) * 0.22;
        const f = b.rueck ? rueck : grund;
        const k = Math.max(0.36, Math.min(1.25, l));
        g.fillStyle = rgbK(f, k);
        g.save(); g.translate(b.x, b.y); g.rotate(b.w);
        blattPfad(g, A.blattForm, b.g, welk);
        g.fill();
        if (sB * b.g > 10 && !welk) {
          g.strokeStyle = rgbK(f, k * 1.16); g.lineWidth = Math.max(0.45 * px, b.g * 0.045);
          g.beginPath(); g.moveTo(-b.g * 0.45, 0); g.lineTo(b.g * 0.42, 0); g.stroke();
        }
        g.restore();
      }
      /* Eigenschatten unten rechts, sanft */
      g.globalCompositeOperation = "source-atop";
      const gr = g.createRadialGradient(-0.15 * ref, -0.2 * ref, 0.05 * ref, 0.05 * ref, 0.08 * ref, 0.6 * ref);
      gr.addColorStop(0, "rgba(255,255,230,0.12)"); gr.addColorStop(0.5, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,0.3)");
      g.fillStyle = gr; g.fillRect(-ref, -ref, 2 * ref, 2 * ref);
      g.globalCompositeOperation = "source-over";
      return c;
    });
  }
  /* Ein Blatt: Spitze nach +x, Stiel bei −x, Länge l */
  function blattPfad(g, form, l, welk) {
    const h = l * 0.5;
    g.beginPath();
    if (welk) {
      /* eingerolltes, trockenes Eichenblatt */
      g.moveTo(-h, 0); g.quadraticCurveTo(-h * 0.2, -h * 0.55, h, -h * 0.1); g.quadraticCurveTo(0, h * 0.35, -h, 0);
    } else if (form === "eiche") {
      /* gelappt: vier Buchten je Seite */
      g.moveTo(-h, 0);
      const n = 4;
      for (let i = 0; i <= n; i++) { const x = -h + (2 * h) * i / n, b = h * 0.5 * Math.sin(Math.PI * (i + 0.5) / (n + 1)) + h * 0.12; g.quadraticCurveTo(x - h * 0.2, -b * 1.25, x, -b * 0.55); }
      g.lineTo(h, 0);
      for (let i = n; i >= 0; i--) { const x = -h + (2 * h) * i / n, b = h * 0.5 * Math.sin(Math.PI * (i + 0.5) / (n + 1)) + h * 0.12; g.quadraticCurveTo(x + h * 0.2, b * 1.25, x, b * 0.55); }
      g.closePath();
    } else {
      /* Lindenblatt: herzförmig mit Spitze */
      g.moveTo(-h * 0.8, 0);
      g.bezierCurveTo(-h * 1.15, -h * 0.9, h * 0.1, -h * 1.0, h, 0);
      g.bezierCurveTo(h * 0.1, h * 1.0, -h * 1.15, h * 0.9, -h * 0.8, 0);
      g.closePath();
    }
  }

  /* =====================================================================
     BAUPLAN — Astgerüst, einmal je Saat (rekursiv, weiche Kurven)
     ===================================================================== */
  const PLAENE = new Map();
  function bauplan(saat) {
    const schl = saat >>> 0;
    if (PLAENE.has(schl)) return PLAENE.get(schl);
    const R = ST.zufall((schl ^ 0x2c1b3c6d) + 5);
    const eiche = R() < 0.45;
    const art = eiche ? "eiche" : "linde", A = ARTEN[art];
    const H = 10 + R() * 4;
    const stammH = eiche ? 2.0 + R() * 1.0 : 2.3 + R() * 0.8;       // bis zur ersten Gabel
    const Rk = H * (eiche ? 0.43 + R() * 0.08 : 0.3 + R() * 0.06);  // Kronenradius
    const kU = eiche ? stammH + 0.1 : stammH - 0.3;
    const kMz = eiche ? kU + (H - kU) * 0.42 : kU + (H - kU) * 0.43;
    const kHalb = H - kMz;
    const kM = [0, 0, kMz];
    const r0 = 0.15 + H * 0.014 + (eiche ? 0.05 : 0);                 // Stammradius am Fuß
    const nw = R() * Math.PI * 2, nk = R() * 0.03;
    const neig = [Math.cos(nw) * nk, Math.sin(nw) * nk];
    const lappen = R() * 100;
    /* Kronenhülle: Linde eiförmig mit hängendem Saum, Eiche flache Kuppel;
       Ausbuchtungen, damit keine Krone wie die andere aussieht */
    const form = (p) => {
      const dx = p[0] / Rk, dy = p[1] / Rk;
      let dz = (p[2] - kMz) / kHalb;
      if (dz < 0) dz *= eiche ? 1.2 : 0.82;
      const az = Math.atan2(dy, dx), el = Math.atan2(dz, Math.hypot(dx, dy));
      const beule = 1 + 0.16 * (ST.rausch(Math.cos(az) * 1.7 + lappen, Math.sin(az) * 1.7 + el * 1.3, 7) - 0.5) * 2;
      return Math.sqrt(dx * dx + dy * dy + dz * dz) / beule;
    };
    /* Weg bis zum Kronenrand entlang d (erst wenn man drin war) */
    const bisRand = (P, d) => {
      let drin = form(P) < 1;
      for (let t = 0.15; t < 18; t += 0.15) {
        const f = form(plus(P, d, t));
        if (f < 1) drin = true; else if (drin) return t;
        if (!drin && t > 3) return t;
      }
      return 18;
    };

    const zuege = [];          // Astzüge (je Ast ein Zug)
    const zweige = [];         // feinste Zweiglein (Striche)
    const buschel = [];        // Laubbüschel
    const gabeln = [];         // Schneehäubchen
    let rMax = 1, zMax = H;
    /* Biegung je Ordnung (niederfrequent), Verzweigungswinkel, Abstände */
    const BIEG = eiche ? [0.05, 0.2, 0.26, 0.3] : [0.025, 0.1, 0.14, 0.16];
    const WINKEL = eiche ? [0, 0, 0.95, 1.05] : [0, 0, 0.75, 0.85];
    const ABST = eiche ? [0, 0, 0.55, 0.3] : [0, 0, 0.32, 0.24];

    /* Ein Ast als weiche Kurve. P Anfang, d0 Richtung, L Länge, rA Radius
       am Ansatz, ord Ordnung (0 Stamm, 1 Hauptast, 2, 3), wolke = Laubwolke */
    function ast(P, d0, L, rA, ord, wolke, opt) {
      opt = opt || {};
      const seg = [0.4, 0.34, 0.26, 0.2][ord];
      const n = Math.max(2, Math.ceil(L / seg));
      const e1 = senkrecht(d0), e2 = norm(kreuz(d0, e1));
      const amp = BIEG[ord] * (0.6 + 0.8 * R());
      const f1 = 0.5 + R() * 0.9, f2 = 0.4 + R() * 0.8, p1 = R() * 6.3, p2 = R() * 6.3;
      /* Eiche: ein, zwei Ellenbogen je Haupt-/Seitenast */
      const bogen = [];
      if (eiche && (ord === 1 || ord === 2)) {
        const nb = ord === 1 ? 1 + Math.floor(R() * 2) : (R() < 0.5 ? 1 : 0);
        for (let i = 0; i < nb; i++) bogen.push({ t: 0.3 + R() * 0.5, v: drehe(e1, d0, R() * 6.3), k: 0.35 + R() * 0.3 });
      }
      /* Schwerkraft und Licht: lange flache Äste hängen außen über,
         die Spitzen biegen sich zum Licht */
      const haengt = opt.haengt || 0, auf = opt.auf == null ? 0.12 : opt.auf;
      const pts = [P];
      let p = P;
      const radial0 = norm([P[0] + d0[0] * 0.01, P[1] + d0[1] * 0.01, 0]);
      for (let i = 1; i <= n; i++) {
        const t = i / n;
        let d = [d0[0] + e1[0] * amp * Math.sin(6.283 * f1 * t + p1) + e2[0] * amp * Math.sin(6.283 * f2 * t + p2),
                 d0[1] + e1[1] * amp * Math.sin(6.283 * f1 * t + p1) + e2[1] * amp * Math.sin(6.283 * f2 * t + p2),
                 d0[2] + e1[2] * amp * Math.sin(6.283 * f1 * t + p1) + e2[2] * amp * Math.sin(6.283 * f2 * t + p2) - haengt * t * t + auf * t * t * t];
        for (const b of bogen) { const k = glatt(b.t - 0.04, b.t + 0.04, t) * b.k; d = plus(d, b.v, k); }
        d = norm(d);
        /* nicht zum Stamm zurück wachsen */
        if (ord >= 1) {
          const rad = norm([p[0] + 1e-4, p[1], 0]);
          const r2 = Math.hypot(p[0], p[1]) > 0.3 ? rad : radial0;
          const dr = d[0] * r2[0] + d[1] * r2[1];
          if (dr < -0.15) d = norm(plus(d, r2, -dr - 0.15));
        }
        const q = plus(p, d, L / n);
        if (ord >= 1 && i > 1 && form(q) > 1.04) break;
        pts.push(q); p = q;
      }
      if (pts.length < 2) return null;
      const m = pts.length - 1;
      const spitze = ord === 0 ? (eiche ? 0.6 : 0.22) : ord === 1 ? 0.28 : 0.3;
      const rs = pts.map((q, i) => Math.max(0.004, rA * (1 - (1 - spitze) * Math.pow(i / m, 0.9))));
      const z = { pts, rs, ord, wolke, stamm: !!opt.stamm, rMax: rA, eltern: opt.eltern == null ? -1 : opt.eltern, index: zuege.length };
      zuege.push(z);
      for (const q of pts) { rMax = Math.max(rMax, Math.hypot(q[0], q[1]) + 0.6); zMax = Math.max(zMax, q[2] + 0.5); }
      return z;
    }
    /* Seitenäste und Zweiglein an einen Zug hängen (rekursiv) */
    function verzweigen(z, L, wolkeVon) {
      const ord = z.ord + 1;
      let az = R() * 6.3;
      if (ord <= 3) {
        const abst = ABST[ord];
        let t = (ord === 2 ? 0.16 + R() * 0.12 : 0.08 + R() * 0.1);
        while (t < 0.94) {
          const k = aufKette(z.pts, t);
          az += 2.4 + (R() - 0.5) * 0.6;                         // Blattstellung (goldener Winkel)
          const e1 = senkrecht(k.d), achse = drehe(e1, k.d, az);
          const w = WINKEL[ord] * (0.8 + 0.4 * R());
          let d = drehe(k.d, achse, w);
          /* nach außen und leicht nach oben; Eiche flacher */
          const aus = norm([k.p[0] + 1e-4, k.p[1], 0]);
          d = norm(plus(plus(d, aus, 0.25), [0, 0, 1], eiche ? 0.02 : 0.14));
          if (d[2] < -0.55) d = norm(plus(d, [0, 0, 1], 0.5));
          const rest = L * (1 - t);
          let Lc = Math.min(bisRand(k.p, d) * 0.96, rest * (ord === 2 ? 0.78 : 0.72) + (ord === 2 ? 0.7 : 0.35), ord === 2 ? Rk * 0.9 : 1.7);
          Lc *= 0.75 + 0.35 * R();
          if (Lc > (ord === 2 ? 0.6 : 0.28)) {
            const rp = z.rs[Math.min(z.rs.length - 1, Math.round(t * (z.rs.length - 1)))];
            const rc = rp * klemm(Math.sqrt(Lc / (rest + 0.4)) * 0.85, 0.25, 0.72);
            const wo = ord === 2 ? zuege.length : wolkeVon;
            const c = ast(k.p, d, Lc, rc, ord, wo, { haengt: ord === 2 && !eiche ? 0.12 * (1 - Math.max(0, d[2])) : 0.05, auf: 0.12, eltern: z.index });
            if (c) {
              if (rc > 0.05 && R() < 0.5) gabeln.push({ p: k.p, r: rc });
              verzweigen(c, Lc, wo);
            }
          }
          t += abst / Math.max(0.5, L) * (0.65 + 0.7 * R());
        }
      }
      /* feinste Zweiglein an Ordnung 2 (außen) und 3 */
      if (z.ord >= 2) {
        const abZ = z.ord === 2 ? 0.45 : 0.1;
        let t = abZ + R() * 0.1;
        const schritt = (eiche ? 0.16 : 0.12) / Math.max(0.3, L);
        while (t <= 1.001) {
          const k = aufKette(z.pts, Math.min(1, t));
          zweiglein(k.p, k.d, z, t >= 1);
          t += schritt * (0.6 + 0.8 * R());
        }
        zweiglein(z.pts[z.pts.length - 1], aufKette(z.pts, 1).d, z, true);
        /* Laubbüschel an den Zweigenden (nur Ordnung 3 und Spitzen der 2.) */
        const bn = z.ord === 3 ? 1 + Math.floor(L / 0.5) : 1 + Math.floor(L * 0.45 / 0.7);
        for (let i = 0; i < bn; i++) {
          const tt = 1 - i * (0.5 / Math.max(0.5, L)) * (0.8 + 0.4 * R());
          if (tt < (z.ord === 3 ? 0.3 : 0.5)) break;
          const k = aufKette(z.pts, tt);
          const up = norm(plus(plus(k.d, [0, 0, 1], 0.35), norm([k.p[0] + 1e-4, k.p[1], 0]), 0.3));
          buschel.push({ p: plus(k.p, up, 0.25), r: (eiche ? 0.52 : 0.5) * (0.8 + 0.4 * R()), v: Math.floor(R() * VARIANTEN), wolke: wolkeVon, t: R() });
        }
      }
    }
    /* ein Zweiglein: 2–4 kurze Stücke, Eiche knorrig, Linde fein und dicht,
       mit 0–2 Nebenzweiglein; am Ende eine Knospe */
    function zweiglein(P, dP, z, spitze) {
      const e1 = senkrecht(dP);
      const az = R() * 6.3, w = spitze ? 0.15 + R() * 0.25 : (eiche ? 0.8 : 0.65) + R() * 0.4;
      let d = drehe(dP, drehe(e1, dP, az), w);
      d = norm(plus(plus(d, [0, 0, 1], eiche ? 0.15 : 0.35), norm([P[0] + 1e-4, P[1], 0]), 0.2));
      const L = (eiche ? 0.22 + R() * 0.2 : 0.28 + R() * 0.3) * (spitze ? 1.2 : 1);
      const n = eiche ? 3 : 3, pts = [P];
      let p = P;
      for (let i = 0; i < n; i++) {
        d = norm(plus(d, drehe(e1, d, R() * 6.3), eiche ? 0.35 : 0.14));
        p = plus(p, d, L / n * (0.8 + 0.4 * R()));
        pts.push(p);
      }
      const b = Math.min(z.rs[z.rs.length - 1] * 0.9, eiche ? 0.007 : 0.0055);
      zweige.push({ pts, b, knospe: true, wolke: z.wolke });
      const nn = Math.floor(R() * (eiche ? 1.6 : 2.4));
      for (let j = 0; j < nn; j++) {
        const i = 1 + Math.floor(R() * (n - 1)), a = pts[i];
        let d2 = drehe(d, drehe(e1, d, R() * 6.3), 0.7 + R() * 0.3);
        d2 = norm(plus(d2, [0, 0, 1], 0.25));
        const l2 = L * (0.35 + 0.3 * R());
        const m = plus(a, d2, l2 * 0.5), e = plus(plus(m, d2, l2 * 0.5), drehe(e1, d2, R() * 6.3), l2 * 0.12);
        zweige.push({ pts: [a, m, e], b: b * 0.7, knospe: true, wolke: z.wolke });
      }
    }

    /* ---- Stamm (bei der Linde als Leittrieb bis in die Krone) ---- */
    const stammL = eiche ? stammH + 0.1 : H * (0.6 + R() * 0.1);
    const stamm = ast([0, 0, 0], norm([neig[0], neig[1], 1]), stammL, r0, 0, -1, { stamm: true, auf: 0 });
    /* ---- Hauptäste ---- */
    const haupt = [];
    if (eiche) {
      /* 4–6 kräftige Äste aus der Stammkrone, weit und flach ausladend */
      const nh = 4 + Math.floor(R() * 3), w0 = R() * 6.3;
      for (let i = 0; i < nh; i++) {
        const k = aufKette(stamm.pts, klemm((stammH - 0.3 + R() * 0.5) / stammL, 0, 1));
        const phi = w0 + i / nh * 6.283 + (R() - 0.5) * 0.7;
        const mitte = i === 0 && R() < 0.6;
        const el = mitte ? 1.0 + R() * 0.3 : 0.25 + R() * 0.45;
        const d = norm([Math.cos(phi) * Math.cos(el), Math.sin(phi) * Math.cos(el), Math.sin(el)]);
        const L = bisRand(k.p, d) * (0.9 + 0.08 * R());
        const rh = stamm.rs[k.i] * (mitte ? 0.55 : 0.5 + R() * 0.15);
        const h = ast(k.p, d, L, rh, 1, -1, { haengt: 0.08, auf: 0.2, eltern: 0 });
        /* die Äste der Stammkrone liegen vor dem Stammende: sonst ragt die
           verjüngte Stammspitze wie ein Bleistift zwischen ihnen heraus */
        if (h) h.vorStamm = true;
        haupt.push(h);
      }
    } else {
      /* 7–10 Äste am Leittrieb, schräg aufwärts, die unteren flacher und
         länger (dort ist die Linde am breitesten) */
      const nh = 9 + Math.floor(R() * 5);
      let phi = R() * 6.3;
      for (let i = 0; i < nh; i++) {
        const h = stammH + (stammL * 0.95 - stammH) * (i + R() * 0.5) / nh;
        const k = aufKette(stamm.pts, klemm(h / stammL, 0, 1));
        phi += 2.4 + (R() - 0.5) * 0.5;
        const u = i / nh;
        const el = 0.5 + u * 0.5 + (R() - 0.5) * 0.24;
        const d = norm([Math.cos(phi) * Math.cos(el), Math.sin(phi) * Math.cos(el), Math.sin(el)]);
        const L = bisRand(k.p, d) * (0.88 + 0.1 * R());
        const rh = stamm.rs[k.i] * (0.42 + R() * 0.12);
        haupt.push(ast(k.p, d, L, rh, 1, -1, { haengt: 0.5 * (1 - u), auf: 0.2, eltern: 0 }));
      }
    }
    /* Röhrenmodell: die Hauptäste zusammen sind (fast) so „dick" wie der
       Stamm darunter (Summe der Querschnitte); der Stamm verjüngt sich
       nach jedem Abzweig – kein dicker Mast mit dünnen Ärmchen */
    {
      const liste = haupt.filter(Boolean);
      const laenge = (z) => z.pts.reduce((a, q, i) => i ? a + Math.hypot(...minus(q, z.pts[i - 1])) : 0, 0);
      const gew = liste.map((z) => Math.pow(laenge(z), 1.4));
      const summe = gew.reduce((a, b) => a + b, 0) || 1;
      const anteil = eiche ? 0.92 : 0.8;
      liste.forEach((z, i) => {
        const ri = r0 * Math.sqrt(anteil * gew[i] / summe) * (eiche ? 1 : 0.95);
        const m = z.pts.length - 1;
        z.rs = z.pts.map((q, j) => Math.max(0.004, ri * (1 - 0.72 * Math.pow(j / m, 0.9))));
        z.rMax = ri;
      });
      const rTop = r0 * (eiche ? 0.25 : 0.28);
      stamm.rs = stamm.pts.map((q, j) => {
        let sq = rTop * rTop * (eiche ? 1 : Math.max(0.15, 1 - j / (stamm.pts.length - 1)));
        for (const z of liste) if (z.pts[0][2] > q[2] + 0.05) sq += z.rMax * z.rMax;
        return Math.max(0.02, Math.sqrt(sq));
      });
      /* Wurzelanlauf: unten wird der Stamm breiter */
      stamm.rs = stamm.rs.map((r, j) => r * (1 + 0.42 * Math.pow(Math.max(0, 1 - stamm.pts[j][2] / 1.3), 2)));
      stamm.rMax = stamm.rs[0];
    }
    /* Seitenäste am Leittrieb der Linde oben (die Spitze der Krone) */
    for (const h of haupt) if (h) verzweigen(h, Math.hypot(...minus(h.pts[h.pts.length - 1], h.pts[0])), -1);
    if (!eiche) {
      const kz = { pts: stamm.pts.filter((q) => q[2] > stammL * 0.8), rs: [], ord: 1, index: 0 };
      if (kz.pts.length >= 2) { kz.rs = stamm.rs.slice(stamm.pts.length - kz.pts.length); verzweigen(kz, H * 0.3, -1); }
    }
    /* Wolken durchnummerieren: je Ast 2. Ordnung eine Laubwolke */
    const wolken = new Map();
    for (const b of buschel) {
      if (!wolken.has(b.wolke)) wolken.set(b.wolke, { s: [0, 0, 0], n: 0 });
      const w = wolken.get(b.wolke); w.s = plus(w.s, b.p, 1); w.n++;
    }
    for (const w of wolken.values()) { w.m = [w.s[0] / w.n, w.s[1] / w.n, w.s[2] / w.n]; w.r = 0.6; }
    for (const b of buschel) { const w = wolken.get(b.wolke); w.r = Math.max(w.r, Math.hypot(...minus(b.p, w.m)) + b.r * 0.6); }
    /* Schnee je Knoten eines Zugs: je waagerechter und dicker, desto mehr */
    for (const z of zuege) {
      z.schnee = z.pts.map((q, i) => {
        const a = z.pts[Math.max(0, i - 1)], b = z.pts[Math.min(z.pts.length - 1, i + 1)];
        const d = norm(minus(b, a)), waag = 1 - Math.abs(d[2]);
        return z.rs[i] > 0.02 && waag > 0.25 ? Math.min(1, (waag - 0.25) * 1.6) * (0.6 + 0.4 * R()) : 0;
      });
      z.v = Math.floor(R() * 1e6);
      z.mitte = z.pts[Math.floor(z.pts.length / 2)];
      z.innen = form(z.mitte) < 0.92 && !z.stamm;
    }
    /* Wurzelanläufe */
    const wurzeln = [];
    const nwz = 4 + Math.floor(R() * 3), ww = R() * 6.3;
    for (let i = 0; i < nwz; i++) wurzeln.push({ phi: ww + i / nwz * 6.283 + (R() - 0.5) * 0.6, l: 0.12 + R() * 0.16 + r0 * 0.4, h: 0.16 + R() * 0.12 });
    /* Eiche im Winter: ein paar trockene Blätter halten sich */
    const welk = [];
    if (eiche) for (const b of buschel) if (R() < 0.05) welk.push({ p: b.p, r: 0.18 + R() * 0.1, v: Math.floor(R() * VARIANTEN) });
    const plan = { eiche, art, A, H, stammH, Rk, kM, kHalb, r0, zuege, zweige, buschel, gabeln, wolken, wurzeln, welk, form, rMax: rMax + 0.3, zMax, helligkeit: 0.94 + R() * 0.12 };
    PLAENE.set(schl, plan);
    return plan;
  }

  /* =====================================================================
     MALEN
     ===================================================================== */
  function grenzenVon(plan, s) {
    const r = plan.rMax + 0.3;
    return [Math.floor(-r * s) - 3, Math.floor(-(plan.zMax + 0.6) * KZ * s) - 3, Math.ceil(r * s) + 3, Math.ceil((r * 0.52 + 0.3) * s) + 3];
  }
  function baumMalen(g, s, F, plan, gier) {
    let [x0, y0, x1, y1] = grenzenVon(plan, s);
    let q = 1;
    const fl = (x1 - x0) * (y1 - y0);
    if (fl > 8e6) q = Math.sqrt(8e6 / fl);
    const sq = s * q;
    if (q < 1) [x0, y0, x1, y1] = grenzenVon(plan, sq);
    const c = leinwand(x1 - x0, y1 - y0), cg = c.g;
    cg.setTransform(1, 0, 0, 1, -x0, -y0);
    baumInLeinwand(cg, sq, F, plan, gier, -x0, -y0);
    g.save();
    g.imageSmoothingEnabled = true;
    g.drawImage(c, x0 / q, y0 / q, c.width / q, c.height / q);
    g.restore();
  }

  function baumInLeinwand(g, s, F, plan, gier, ex, ey) {
    const B = blick(gier, s);
    /* FASSUNG 814 — XANDER: „die Bäume sollen grün bleiben, bis der Herbst wirklich anfängt … automatische Jahreszeiten".
       Laubfall im November: jahr „kahl" = das Astgerüst wie im Winter, aber ohne Schnee, im Herbstlicht auf der Wiese
       (die leichte Stadt backt damit ein eigenes Novemberbild). */
    const kahl = F.jahr === "kahl";
    const Z = F.Z, jahr = kahl ? "herbst" : F.jahr, winter = jahr === "winter";
    const belaubt = !winter && !kahl;
    const T0 = { e: ex, f: ey };
    const st = stufen(Z, jahr);
    const sB = stufeS(s);
    const nOben = lichtAuf([0, 0, 1], Z, jahr);

    /* Boden unter der Krone: im Winter eine flache, bläuliche Mulde, im
       Frühling etwas dunkler (Schatten und Laubstreu) – weich, kein Fleck */
    {
      const r = plan.r0 * 3 + 0.5;
      g.save(); g.scale(1, 0.5);
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, r * s);
      if (winter) { gr.addColorStop(0, farbe([150, 166, 202], nOben, 1, 0.1)); gr.addColorStop(1, farbe([180, 196, 228], nOben, 1, 0)); }
      else { gr.addColorStop(0, farbe([56, 54, 36], nOben, 1, 0.4)); gr.addColorStop(1, farbe([64, 76, 40], nOben, 1, 0)); }
      g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r * s, 0, Math.PI * 2); g.fill();
      g.restore();
    }

    const teile = [];
    /* Tiefenverschiebung: im belaubten Baum liegen die Äste im Innern der
       Krone hinter dem Laub (sonst läge „Draht" über dem Busch) */
    const bias = belaubt ? -0.55 * plan.Rk : 0;
    /* Ein Seitenast liegt in der Reihenfolge immer knapp hinter seinem
       Elternast: dessen Körper deckt den Ansatz – keine Ringe an Gelenken */
    const tiefen = new Array(plan.zuege.length);
    for (const z of plan.zuege) {
      let t = B.tief(z.mitte) + (z.innen ? bias : 0);
      if (z.vorStamm && tiefen[0] != null) t = Math.max(t, tiefen[0] + 0.002);
      else if (z.eltern >= 0 && tiefen[z.eltern] != null) t = Math.min(t, tiefen[z.eltern] - 0.002);
      tiefen[z.index] = t;
      const dick = z.rMax * s;
      if (belaubt && z.ord >= 3 && !z.stamm) continue;             // dünne Äste stecken im Laub
      teile.push({ tief: t, malen: () => (dick > 2.2 || z.stamm ? zugMalen : duennMalen)(g, B, plan, z, Z, jahr, s, winter) });
    }
    /* Eiche: Astkragen – die Rinde des Stamms läuft über die Ansätze der
       Kronenäste und blendet nach oben aus (Gabel aus einem Guss) */
    if (plan.eiche) {
      const vs = plan.zuege.filter((z) => z.vorStamm);
      if (vs.length) teile.push({ tief: Math.max(...vs.map((z) => tiefen[z.index])) + 0.001, malen: () => astKragen(g, B, plan, vs, Z, jahr, s, winter) });
    }
    if (!winter) for (const w of plan.wurzeln) {
      const m = [Math.cos(w.phi) * w.l * 0.5, Math.sin(w.phi) * w.l * 0.5, 0.05];
      teile.push({ tief: B.tief(m) - 0.02, malen: () => wurzelMalen(g, B, plan, w, Z, jahr, s, winter) });
    }
    if (winter) {
      teile.push({ tief: -1e8, malen: () => schneeKragen(g, B, plan, Z, jahr, s, false) });
      teile.push({ tief: B.tief([0, 0, 0]) + plan.r0 * 2.4, malen: () => schneeKragen(g, B, plan, Z, jahr, s, true) });
    }
    else teile.push({ tief: B.tief([0, 0, 0]) + plan.r0 * 2.4, malen: () => grasKragen(g, B, plan, Z, jahr, s) });
    if (kahl) teile.push({ tief: -1e8 + 1, malen: () => laubStreu(g, B, plan, Z, jahr, s) });
    if (winter || jahr === "herbst") {
      /* feinste Zweiglein: in Tiefenscheiben (dünn – kleine Sortierfehler
         fallen nicht auf; dicke Äste werden einzeln einsortiert) */
      const liste = plan.zweige.map((zw) => ({ zw, t: B.tief(zw.pts[1]) })).sort((a, b) => a.t - b.t);
      const scheiben = 10;
      for (let i = 0; i < scheiben; i++) {
        const teil = liste.slice(Math.floor(i * liste.length / scheiben), Math.floor((i + 1) * liste.length / scheiben));
        if (!teil.length) continue;
        teile.push({ tief: teil[Math.floor(teil.length / 2)].t, malen: () => zweigeMalen(g, B, plan, teil, Z, jahr, s, winter) });
      }
      if (winter) for (const gb of plan.gabeln) teile.push({ tief: B.tief(gb.p) + 0.03, malen: () => gabelSchnee(g, B, gb, Z, jahr, s) });
      if ((winter || kahl) && plan.eiche) for (const w of plan.welk) teile.push({ tief: B.tief(w.p) + 0.05, malen: () => laubLegen(g, B, T0, plan, w, Z, jahr, s, sB, st, true) });
    }
    if (belaubt) {
      /* Laub: Büschel, nach Wolken schattiert; die Zweiglein, die zu einem
         Büschel führen, werden mit ihm einsortiert */
      for (const b of plan.buschel) teile.push({ tief: B.tief(b.p) + b.r * 0.4, malen: () => laubLegen(g, B, T0, plan, b, Z, jahr, s, sB, st, false) });
    }
    teile.sort((a, b) => a.tief - b.tief);
    for (const t of teile) t.malen();
    g.setTransform(1, 0, 0, 1, T0.e, T0.f);
  }
  function astKragen(g, B, plan, vs, Z, jahr, s, winter) {
    const st = plan.zuege[0];
    if (!st || st.rMax * s < 3) return;
    const zA = Math.min(...vs.map((z) => z.pts[0][2])), zE = Math.max(...vs.map((z) => z.pts[0][2]));
    let i0 = st.pts.findIndex((q) => q[2] >= zA - 0.4);
    if (i0 < 0) return;
    i0 = Math.max(0, i0 - 1);
    const stueck = { pts: st.pts.slice(i0), rs: st.rs.slice(i0), schnee: (st.schnee || st.pts).slice(i0).map(() => 0), stamm: true, ord: st.ord, v: st.v, rMax: st.rMax, bezug: st };
    if (stueck.pts.length < 2) return;
    const P = stueck.pts.map(B.p), rp = Math.max(...stueck.rs) * s + 2;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of P) { x0 = Math.min(x0, p[0] - rp); y0 = Math.min(y0, p[1] - rp); x1 = Math.max(x1, p[0] + rp); y1 = Math.max(y1, p[1] + rp); }
    x0 = Math.floor(x0); y0 = Math.floor(y0);
    const c = leinwand(x1 - x0 + 1, y1 - y0 + 1), gc = c.g;
    gc.setTransform(1, 0, 0, 1, -x0, -y0);
    zugMalen(gc, B, plan, stueck, Z, jahr, s, winter);
    /* Maske: unten weich ein (keine Naht zum Stamm), über den Ansätzen aus */
    gc.setTransform(1, 0, 0, 1, 0, 0);
    gc.globalCompositeOperation = "destination-in";
    const yU = B.p([0, 0, zA - 0.38])[1] - y0, yM = B.p([0, 0, zA - 0.12])[1] - y0, yO = B.p([0, 0, zE + 0.14])[1] - y0;
    const mg = gc.createLinearGradient(0, yU, 0, yO);
    const k = klemm((yU - yM) / ((yU - yO) || 1), 0.05, 0.9);
    mg.addColorStop(0, "rgba(0,0,0,0)"); mg.addColorStop(k, "rgba(0,0,0,1)"); mg.addColorStop(1, "rgba(0,0,0,0)");
    gc.fillStyle = mg; gc.fillRect(0, 0, c.width, c.height);
    g.drawImage(c, x0, y0);
  }
  /* Bildpunkte eines Zugs, bei großer Vergrößerung weich unterteilt
     (Catmull-Rom), damit auch aus der Nähe keine Knicke zu sehen sind */
  function zugPunkte(B, z, s) {
    const P = z.pts.map(B.p), r = z.rs.map((v) => v * s);
    let lang = 0;
    for (let i = 1; i < P.length; i++) lang = Math.max(lang, Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    const teil = Math.min(4, Math.ceil(lang / 12));
    if (teil <= 1) return { P, r };
    const P2 = [], r2 = [];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      for (let k = 0; k < teil; k++) {
        const t = k / teil, t2 = t * t, t3 = t2 * t;
        P2.push([0, 1].map((a) => 0.5 * ((2 * p1[a]) + (-p0[a] + p2[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * t3)));
        r2.push(r[i] + (r[i + 1] - r[i]) * t);
      }
    }
    P2.push(P[P.length - 1]); r2.push(r[r.length - 1]);
    return { P: P2, r: r2 };
  }

  /* Ein Astzug als ein Körper: Umriss aus den Knoten (Normalen gemittelt),
     Rundung durch Licht quer zur Richtung, Rinde auf dem Zylinder */
  function zugMalen(g, B, plan, z, Z, jahr, s, winter) {
    const zp = zugPunkte(B, z, s), P = zp.P, n = P.length;
    const r = zp.r.map((v) => Math.max(0.6, v));
    const N = P.map((p, i) => {
      const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)];
      const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      return [-dy / l, dx / l];
    });
    const A = plan.A;
    /* ein Stück eines Zugs (Astkragen) nimmt Licht und Verlauf vom ganzen Zug */
    const ref = z.bezug ? zugPunkte(B, z.bezug, s) : zp, PR = ref.P;
    let ux = PR[PR.length - 1][0] - PR[0][0], uy = PR[PR.length - 1][1] - PR[0][1];
    const ul = Math.hypot(ux, uy) || 1; ux /= ul; uy /= ul;
    let nx = -uy, ny = ux;
    /* Sonne kommt im Bild von links oben: diese Seite hell */
    if (nx * -0.85 + ny * -0.5 < 0) { nx = -nx; ny = -ny; }
    const lfH = lichtAuf([LICHT[0], LICHT[1], 0.3], Z, jahr), lfD = lichtAuf([-LICHT[0], -LICHT[1], 0.1], Z, jahr);
    const innen = z.stamm ? 1 : z.innen && jahr !== "winter" ? 0.72 : 0.94;
    const m = PR[Math.floor(PR.length / 2)], rm = Math.max(...ref.r.map((v) => Math.max(0.6, v)));
    const gr = g.createLinearGradient(m[0] + nx * rm, m[1] + ny * rm, m[0] - nx * rm, m[1] - ny * rm);
    gr.addColorStop(0, farbe(A.rinde, lfH, 0.84 * innen));
    gr.addColorStop(0.3, farbe(A.rinde, lfH, 1.0 * innen));
    gr.addColorStop(0.7, farbe(A.rinde, lfD, 0.84 * innen));
    gr.addColorStop(1, farbe(A.rindeD, lfD, 0.92 * innen));
    g.fillStyle = gr;
    const koerper = () => {
      g.beginPath();
      for (let i = 0; i < n; i++) { const x = P[i][0] + N[i][0] * r[i], y = P[i][1] + N[i][1] * r[i]; if (i) g.lineTo(x, y); else g.moveTo(x, y); }
      const e = n - 1;
      g.arc(P[e][0], P[e][1], r[e], Math.atan2(N[e][1], N[e][0]), Math.atan2(N[e][1], N[e][0]) + Math.PI, true);
      for (let i = n - 1; i >= 0; i--) g.lineTo(P[i][0] - N[i][0] * r[i], P[i][1] - N[i][1] * r[i]);
      if (!z.stamm) g.arc(P[0][0], P[0][1], r[0], Math.atan2(-N[0][1], -N[0][0]), Math.atan2(-N[0][1], -N[0][0]) + Math.PI, true);
      g.closePath();
    };
    koerper(); g.fill();
    /* Rinde: Furchen auf dem Zylinder */
    if (s >= 14 && rm > 2.6) {
      g.save(); koerper(); g.clip();
      rindeMalen(g, P, N, r, z, plan, lfH, lfD, s, innen, glatt(14, 26, s) * glatt(2.6, 5, rm), winter);
      g.restore();
    }
    if (winter) schneeZug(g, P, N, r, z, Z, jahr, s);
  }

  /* Rinde auf einem Zug. Die Furchen sitzen auf dem Zylinder: Winkel φ
     rund um den Ast gleichmäßig verteilt, im Bild bei sin φ – am Rand
     gedrängt, in der Mitte weit (so wirkt der Ast rund).
     Eiche: tiefe, netzartig verbundene Längsfurchen, heller Grat daneben.
     Linde: flache, feine, lange Längsrippen, grau, wenig Kontrast. */
  function rindeMalen(g, P, N, r, z, plan, lfH, lfD, s, innen, k0, winter) {
    const n = P.length, A = plan.A, eiche = plan.eiche;
    const R = ST.zufall(z.v + 11);
    const rmW = Math.max(...z.rs);                        // Radius in Metern
    const abstM = eiche ? 0.08 : 0.034;                   // Furchenabstand auf dem Umfang
    let anz = Math.round(Math.PI * rmW / abstM);
    const rmPx = rmW * s;
    anz = Math.min(anz, Math.floor(rmPx * 2 / 2.6));      // nicht dichter als ~2,6 Bildpunkte
    if (anz < 2) return;
    /* Länge eines Furchenstücks in Knoten */
    const lenM = eiche ? 0.75 : 0.9;
    let bogen = 0; const kum = [0];
    for (let i = 1; i < n; i++) { bogen += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); kum.push(bogen); }
    const lenPx = lenM * s;
    const dunkel = [], hell = [];
    for (let k = 0; k < anz; k++) {
      const phi0 = -Math.PI / 2 + (k + 0.5 + (R() - 0.5) * 0.5) * Math.PI / anz;
      let pos = R() * lenPx * 0.5;
      while (pos < bogen) {
        const l = lenPx * (0.5 + R());
        const ziel = eiche && R() < 0.45 ? (R() < 0.5 ? -1 : 1) * Math.PI / anz : 0;   // Netz: zur Nachbarfurche
        const pts = [];
        let i = 0;
        for (let d = pos; d <= Math.min(bogen, pos + l); d += Math.max(2, lenPx / 6)) {
          while (i < n - 2 && kum[i + 1] < d) i++;
          const f = klemm((d - kum[i]) / ((kum[i + 1] - kum[i]) || 1), 0, 1);
          const u = (d - pos) / l;
          const phi = phi0 + ziel * u * u + Math.sin(d / s * (eiche ? 2.6 : 3) + k * 1.7) * (eiche ? 0.13 : 0.04) + (eiche ? Math.sin(d / s * 7.5 + k * 2.3) * 0.035 : 0);
          if (Math.abs(phi) > 1.52) continue;
          const px = P[i][0] + (P[i + 1][0] - P[i][0]) * f, py = P[i][1] + (P[i + 1][1] - P[i][1]) * f;
          const nx = N[i][0] + (N[i + 1][0] - N[i][0]) * f, ny = N[i][1] + (N[i + 1][1] - N[i][1]) * f;
          const rr = r[i] + (r[i + 1] - r[i]) * f;
          pts.push([px + nx * rr * Math.sin(phi), py + ny * rr * Math.sin(phi), Math.cos(phi)]);
        }
        if (pts.length >= 2) (phi0 < -0.2 ? hell : dunkel).push(pts);
        pos += l + lenPx * (eiche ? 0.02 + 0.08 * R() : 0.2 + 0.4 * R());
      }
    }
    const abstPx = rmPx * 2 / anz;
    const b = Math.max(0.6, abstPx * (eiche ? 0.3 : 0.22));
    g.lineCap = "round"; g.lineJoin = "round";
    const zieh = (liste, dx, dy) => { g.beginPath(); for (const p of liste) { g.moveTo(p[0][0] + dx, p[0][1] + dy); for (let i = 1; i < p.length; i++) g.lineTo(p[i][0] + dx, p[i][1] + dy); } g.stroke(); };
    /* Furchen (dunkel), daneben zur Sonne der helle Grat */
    const alle = dunkel.concat(hell);
    g.lineWidth = b;
    /* Borkenflecken: hellere und dunklere, längliche Stellen (Flechten,
       Verwitterung) – gegen den „Plastik"-Eindruck */
    if (abstPx > 2.5) {
      const Rf = ST.zufall(z.v + 77);
      for (const [c, a] of [[A.rindeH, 0.16], [A.rindeD, 0.14]]) {
        g.fillStyle = farbe(c, lfH, innen, a * k0);
        g.beginPath();
        const m = Math.round(bogen / (abstPx * 3));
        for (let k = 0; k < m; k++) {
          const d = Rf() * bogen; let i = 0; while (i < n - 2 && kum[i + 1] < d) i++;
          const u = (Rf() * 2 - 1) * 0.85, px = P[i][0] + N[i][0] * r[i] * u, py = P[i][1] + N[i][1] * r[i] * u;
          const rx = abstPx * (0.4 + 0.5 * Rf()), ry = abstPx * (1.2 + 1.8 * Rf());
          g.moveTo(px + rx, py); g.ellipse(px, py, rx, ry, Math.atan2(P[i + 1][0] - P[i][0], -(P[i + 1][1] - P[i][1])), 0, Math.PI * 2);
        }
        g.fill();
      }
    }
    g.strokeStyle = farbe(A.rindeD, lfD, (eiche ? 0.62 : 0.75) * innen, (eiche ? 0.78 : 0.55) * k0);
    zieh(alle, 0, 0);
    g.lineWidth = b * (eiche ? 0.8 : 0.7);
    g.strokeStyle = farbe(A.rindeH, lfH, 1.0 * innen, (eiche ? 0.55 : 0.4) * k0);
    zieh(hell, -b * 0.9, -b * 0.5);
    g.strokeStyle = farbe(A.rindeH, lfD, 1.0 * innen, (eiche ? 0.35 : 0.25) * k0);
    zieh(dunkel, -b * 0.9, -b * 0.5);
    /* Eiche: Querrisse teilen die Grate in Borkenblöcke */
    if (eiche && abstPx > 3) {
      g.lineWidth = b * 0.55;
      g.strokeStyle = farbe(A.rindeD, lfD, 0.6 * innen, 0.6 * k0);
      g.beginPath();
      for (const p of alle) for (let i = 1; i < p.length - 1; i += 2) {
        if (R() < 0.5) continue;
        const q = p[i], w = abstPx * (0.4 + 0.3 * R());
        const nx = -(p[i + 1][1] - p[i - 1][1]), ny = p[i + 1][0] - p[i - 1][0], l = Math.hypot(nx, ny) || 1;
        g.moveTo(q[0], q[1]); g.lineTo(q[0] + nx / l * w, q[1] + ny / l * w + b * 0.3);
      }
      g.stroke();
    }
    /* Grünalgen auf der Wetterseite des Stamms (nicht im Winter) */
    if (z.stamm && !winter && !z.bezug) {
      const m = P[0], mg = g.createLinearGradient(m[0] + r[0], 0, m[0] + r[0] * 0.2, 0);
      mg.addColorStop(0, "rgba(96,122,58,0.32)"); mg.addColorStop(1, "rgba(96,122,58,0)");
      g.fillStyle = mg; g.fillRect(m[0] - r[0] * 2, P[n - 1][1] - 4, r[0] * 4, Math.abs(P[n - 1][1] - m[1]) * 0.45 + 8);
    }
  }

  /* Schnee auf der Oberseite eines Astzugs: je waagerechter, desto dicker;
     gewölbt (heller Rücken, bläuliche Flanke, dunkle Kontaktkante) */
  function schneeZug(g, P, N, r, z, Z, jahr, s) {
    if (!z.schnee.some((v) => v > 0)) return;
    const n = P.length, m = z.pts.length;
    const lf = lichtAuf([0, 0, 1], Z, jahr), lfs = lichtAuf([0.2, 0.2, 0.5], Z, jahr);
    const d = (0.03 + 0.05 * Math.min(1, z.rMax / 0.1)) * KZ * s;
    if (d < 0.5) return;
    const oben = [], unten = [];
    for (let i = 0; i < n; i++) {
      let nx = N[i][0], ny = N[i][1];
      if (ny > 0) { nx = -nx; ny = -ny; }
      const j = Math.min(m - 1, Math.round(i / (n - 1) * (m - 1)));
      const k = z.schnee[j] * (i === 0 || i === n - 1 ? 0.3 : 1);
      const bx = P[i][0] + nx * r[i] * 0.45, by = P[i][1] + ny * r[i] * 0.45;
      unten.push([bx, by]);
      oben.push([bx + nx * d * k * 0.4, by + ny * d * k * 0.4 - d * k * 0.75]);
    }
    const band = (a, b, dy) => { g.beginPath(); g.moveTo(a[0][0], a[0][1] + dy); for (const p of b) g.lineTo(p[0], p[1] + dy); for (let i = a.length - 1; i >= 0; i--) g.lineTo(a[i][0], a[i][1] + dy); g.closePath(); };
    g.fillStyle = farbe([90, 104, 126], lfs, 1, 0.45); band(unten, oben, Math.max(0.6, d * 0.25)); g.fill();
    g.fillStyle = farbe([214, 226, 246], lfs, 1); band(unten, oben, d * 0.12); g.fill();
    g.fillStyle = farbe([251, 250, 247], lf, 1); band(unten.map((p, i) => [p[0] * 0.5 + oben[i][0] * 0.5, p[1] * 0.5 + oben[i][1] * 0.5]), oben, 0); g.fill();
  }

  /* dünne Astzüge: als verjüngter Strich; unter einem Bildpunkt Breite
     entsprechend blasser (gleiche Deckung in jeder Zoomstufe) */
  function duennMalen(g, B, plan, z, Z, jahr, s, winter) {
    const A = plan.A;
    const lf = lichtAuf([0.2, 0.2, 0.7], Z, jahr);
    const innen = z.innen && !winter ? 0.72 : 1;
    const P = z.pts.map(B.p), n = P.length;
    g.lineCap = "round"; g.lineJoin = "round";
    g.strokeStyle = farbe(A.rinde, lf, 0.78 * innen);
    /* zwei Abschnitte: innen breiter, außen schmaler */
    const halb = Math.max(2, Math.ceil(n / 2));
    for (const [von, bis, rr] of [[0, halb, z.rs[0]], [halb - 1, n, z.rs[Math.min(n - 1, halb)]]]) {
      const w = rr * 2 * s;
      g.lineWidth = Math.max(0.8, w); g.globalAlpha = Math.min(1, w / 0.8);
      g.beginPath(); g.moveTo(P[von][0], P[von][1]); for (let i = von + 1; i < bis; i++) g.lineTo(P[i][0], P[i][1]); g.stroke();
    }
    g.globalAlpha = 1;
    if (winter && z.rMax > 0.01) {
      const w = z.rMax * s;
      if (w > 0.5) {
        g.strokeStyle = farbe([248, 250, 254], lichtAuf([0, 0, 1], Z, jahr), 1, 0.85);
        g.lineWidth = Math.max(0.6, w * 0.9);
        g.beginPath();
        let an = false;
        for (let i = 0; i < n; i++) {
          const j = Math.min(z.schnee.length - 1, i);
          if (z.schnee[j] > 0.25) { if (an) g.lineTo(P[i][0], P[i][1] - w * 0.9); else g.moveTo(P[i][0], P[i][1] - w * 0.9); an = true; } else an = false;
        }
        g.stroke();
      }
    }
  }

  /* feinste Zweiglein einer Tiefenscheibe: echte Striche, graubraun,
     die jungen Enden etwas rötlicher, Knospen ab mittlerer Nähe */
  function zweigeMalen(g, B, plan, teil, Z, jahr, s, winter) {
    const A = plan.A;
    const lf = lichtAuf([0.1, 0.1, 0.8], Z, jahr);
    g.lineCap = "round"; g.lineJoin = "round";
    /* Breitenklassen */
    const klassen = new Map();
    for (const e of teil) {
      const w = e.zw.b * 2 * s, k = w >= 0.8 ? Math.round(w * 4) / 4 : 0;
      if (!klassen.has(k)) klassen.set(k, []);
      klassen.get(k).push(e.zw);
    }
    for (const [k, liste] of klassen) {
      let w = k;
      if (!k) { let su = 0; for (const zw of liste) su += zw.b * 2 * s; w = su / liste.length; }
      g.lineWidth = Math.max(0.8, w);
      g.globalAlpha = Math.min(1, w / 0.8) * 0.95;
      g.strokeStyle = farbe(A.zweig, lf, 0.9);
      g.beginPath();
      for (const zw of liste) { const p = zw.pts.map(B.p); g.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]); }
      g.stroke();
    }
    g.globalAlpha = 1;
    /* Knospen (entsättigt), weich eingeblendet ab s≈20 */
    const kn = glatt(20, 34, s);
    if (kn > 0.02) {
      g.fillStyle = farbe(A.knospe, lf, 1, kn * 0.75);
      const r = Math.max(0.5, s * 0.0038);
      g.beginPath();
      for (const e of teil) { const p = B.p(e.zw.pts[e.zw.pts.length - 1]); g.moveTo(p[0] + r, p[1]); g.arc(p[0], p[1], r, 0, Math.PI * 2); }
      g.fill();
    }
  }

  /* Laubbüschel legen: Größe in Bildpunkten, nach Kronen- und Wolkenlicht
     getönt; die Wolke ist oben links hell, unten rechts im Eigenschatten */
  function laubLegen(g, B, T0, plan, b, Z, jahr, s, sB, st, welk) {
    const p = B.p(b.p);
    const vor = laubVorlage(plan.art, jahr, sB, b.v, welk);
    const w = !welk && plan.wolken.get(b.wolke);
    const nk = norm([b.p[0] - plan.kM[0], b.p[1] - plan.kM[1], (b.p[2] - plan.kM[2]) * 0.8 + 0.2]);
    let nn = nk;
    if (w) { const nw = norm(plus(minus(b.p, w.m), [0, 0, 1], 0.25 * w.r)); nn = norm(plus(nk, nw, 1.1)); }
    const lf = lichtAuf(B.n(nn), Z, jahr);
    /* innen und unten in der Krone dunkler */
    const tiefe = Math.min(1, plan.form(b.p));
    const unten = w ? klemm((w.m[2] - b.p[2]) / (w.r + 0.01), 0, 1) : 0;
    const ao = (0.55 + 0.45 * tiefe) * (1 - 0.22 * unten) * plan.helligkeit * (0.92 + 0.16 * b.t);
    const bild = getoent("lb|" + plan.art + "|" + jahr + "|" + sB.toFixed(2) + "|" + b.v + "|" + (welk ? 1 : 0), vor, st, stufeFuer(st, lf, ao));
    const k = b.r * 2 * (welk ? 0.7 : 1) / (vor.ref * vor.sB) * s;
    g.setTransform(k, 0, 0, k, T0.e + p[0] - vor.ox * k, T0.f + p[1] - vor.oy * k);
    g.drawImage(bild, 0, 0);
    g.setTransform(1, 0, 0, 1, T0.e, T0.f);
  }

  function gabelSchnee(g, B, gb, Z, jahr, s) {
    /* kleines Häufchen oben in der Astgabel */
    const p = B.p(gb.p), r = gb.r * s * 0.9;
    if (r < 0.8) return;
    const y = p[1] - gb.r * s * 0.5;
    const lf = lichtAuf([0, 0, 1], Z, jahr), lfs = lichtAuf([0.2, 0.2, 0.5], Z, jahr);
    g.fillStyle = farbe([212, 224, 242], lfs, 1);
    g.beginPath(); g.ellipse(p[0], y + r * 0.12, r, r * 0.42, 0, Math.PI, 0, false); g.closePath(); g.fill();
    g.fillStyle = farbe([251, 250, 247], lf, 1);
    g.beginPath(); g.ellipse(p[0] - r * 0.08, y, r * 0.86, r * 0.36, 0, Math.PI, 0, false); g.closePath(); g.fill();
  }

  /* Wurzelanlauf: Wurzelhälse vom Stammfuß schräg in den Boden – zwei
     Flanken (Licht/Schatten), Rinde läuft mit, weich auslaufend */
  function wurzelMalen(g, B, plan, w, Z, jahr, s, winter) {
    if (plan.r0 * s < 1.5) return;
    const d = [Math.cos(w.phi), Math.sin(w.phi), 0], q = [-d[1], d[0], 0];
    const r0 = plan.r0, n = 6;
    const grat = [], li = [], re = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, ab = r0 * 0.72 + w.l * t, hz = w.h * Math.pow(1 - t, 2.2), br = r0 * 0.55 * Math.sqrt(1 - 0.85 * t);
      grat.push(B.p([d[0] * ab, d[1] * ab, hz]));
      li.push(B.p([d[0] * ab + q[0] * br, d[1] * ab + q[1] * br, 0]));
      re.push(B.p([d[0] * ab - q[0] * br, d[1] * ab - q[1] * br, 0]));
    }
    const a = grat[0], e = grat[n];
    for (const [seite, sd] of [[li, 1], [re, -1]]) {
      const nn = norm([q[0] * sd, q[1] * sd, 0.8]);
      const lf = lichtAuf(B.n(nn), Z, jahr);
      /* unter dem belaubten Dach liegt der Stammfuß im Schatten: sonst
         leuchten die Wurzelanläufe hell wie Steine neben dem Stamm */
      const sch = winter ? 0.95 : 0.64;
      const gr = g.createLinearGradient(a[0], a[1], e[0], e[1]);
      gr.addColorStop(0, farbe(plan.A.rinde, lf, sch));
      gr.addColorStop(0.5, farbe(plan.A.rinde, lf, sch * 0.94, 0.85));
      gr.addColorStop(1, farbe(plan.A.rinde, lf, sch * 0.88, 0));
      g.fillStyle = gr;
      g.beginPath();
      g.moveTo(grat[0][0], grat[0][1]);
      for (let i = 1; i <= n; i++) g.lineTo(grat[i][0], grat[i][1]);
      for (let i = n; i >= 0; i--) g.lineTo(seite[i][0], seite[i][1]);
      g.closePath(); g.fill();
      /* Rindenfurchen laufen in die Wurzel hinein */
      if (s >= 20) {
        g.strokeStyle = farbe(plan.A.rindeD, lf, 0.7, 0.5 * glatt(20, 30, s)); g.lineWidth = Math.max(0.6, s * 0.006);
        g.beginPath();
        for (const f of [0.35, 0.7]) {
          g.moveTo(grat[0][0] * (1 - f) + seite[0][0] * f, grat[0][1] * (1 - f) + seite[0][1] * f);
          g.lineTo(grat[n - 2][0] * (1 - f) + seite[n - 2][0] * f, grat[n - 2][1] * (1 - f) + seite[n - 2][1] * f);
        }
        g.stroke();
      }
    }
  }
  /* Schneewehe um den Stammfuß: hinten (vor dem Stamm gemalt) und vorn;
     vorn legt sich der Schnee in einem Bogen um den Stamm (keine gerade
     Kante), außen läuft er weich aus und deckt die Wurzelenden */
  function schneeKragen(g, B, plan, Z, jahr, s, vorn) {
    const R = (plan.r0 * 1.9 + 0.18) * s;
    if (R < 2) return;
    /* Farbe wie der Schnee im Kontaktschatten des Stamms (sonst leuchtete
       ein heller Teller im Schatten) */
    const lf0 = lichtAuf([0, 0, 1], Z, jahr), lf = [lf0[0] * 0.8, lf0[1] * 0.82, lf0[2] * 0.88];
    const a = B.p([0, 0, 0]);
    const rt = plan.r0 * 1.42 * s, hs = 0.1 * KZ * s;
    const gr = g.createRadialGradient(a[0] - R * 0.1, a[1], 0, a[0], a[1], R);
    gr.addColorStop(0, farbe([247, 247, 249], lf, 1, 0.97)); gr.addColorStop(0.55, farbe([244, 246, 250], lf, 1, 0.8)); gr.addColorStop(1, farbe([240, 244, 250], lf, 1, 0));
    g.save();
    g.fillStyle = gr;
    g.beginPath();
    if (!vorn) {
      g.ellipse(a[0], a[1], R, R * 0.5, 0, Math.PI, Math.PI * 2, false);
      g.closePath();
    } else {
      g.moveTo(a[0] + R, a[1]);
      g.ellipse(a[0], a[1], R, R * 0.5, 0, 0, Math.PI, false);
      g.lineTo(a[0] - rt, a[1] - hs);
      /* Bogen über den Stammfuß (Schnee liegt vorn etwas höher an) */
      for (let i = 0; i <= 10; i++) { const w = Math.PI * (1 - i / 10); g.lineTo(a[0] + Math.cos(w) * rt, a[1] - hs + Math.sin(w) * rt * 0.5); }
      g.closePath();
    }
    g.fill();
    g.restore();
  }
  /* FASSUNG 814 — Laubfall („kahl"): das gefallene Laub liegt als bunter Teppich unter der Krone */
  function laubStreu(g, B, plan, Z, jahr, s) {
    const R = ST.zufall(4711 + Math.round(plan.Rk * 100)), lf = lichtAuf([0, 0, 1], Z, jahr);
    const r = plan.Rk * 0.72, n = Math.round(Math.min(2200, 120 + r * r * s * 2.6));
    const FARBEN = plan.eiche ? [[150, 98, 48], [128, 84, 44], [176, 124, 58]] : [[214, 150, 46], [190, 112, 40], [226, 182, 70], [160, 92, 40]];
    for (let f = 0; f < FARBEN.length; f++) {
      g.fillStyle = farbe(FARBEN[f], lf, 1, 0.8);
      g.beginPath();
      for (let i = f; i < n; i += FARBEN.length) {
        const w = R() * Math.PI * 2, d = r * (0.12 + 0.88 * R() * R());
        const p = B.p([Math.cos(w) * d, Math.sin(w) * d, 0]), gr = Math.max(0.55, s * (0.04 + 0.03 * R()));
        g.moveTo(p[0] + gr, p[1]); g.ellipse(p[0], p[1], gr, gr * 0.5, R() * 3, 0, Math.PI * 2);
      }
      g.fill();
    }
  }
  /* Frühling: Grashalme wachsen über den Stammfuß (kein harter Rand) */
  function grasKragen(g, B, plan, Z, jahr, s) {
    if (s < 12) return;
    const a = B.p([0, 0, 0]), r = (plan.r0 * 1.6 + 0.2) * s;
    const R = ST.zufall(31);
    const lf = lichtAuf([0, 0, 1], Z, jahr);
    const k = glatt(12, 22, s);
    g.lineCap = "round"; g.lineWidth = Math.max(0.7, s * 0.008);
    for (const [c, anteil] of [[[70, 110, 40], 0.6], [[104, 146, 58], 0.4]]) {
      g.strokeStyle = farbe(c, lf, 1, 0.9 * k);
      g.beginPath();
      const m = Math.round(r * 1.2 * anteil);
      for (let i = 0; i < m; i++) {
        const w = Math.PI * (0.05 + 0.9 * R()), rr = r * (0.55 + 0.5 * R());
        const x = a[0] + Math.cos(w) * rr, y = a[1] + Math.sin(w) * rr * 0.45;
        const h = s * (0.05 + 0.07 * R());
        g.moveTo(x, y); g.lineTo(x + (R() - 0.5) * h * 0.6, y - h);
      }
      g.stroke();
    }
  }

  /* ---------------- Schatten ----------------
     In geringer Auflösung gemalt und weich vergrößert (ersetzt das teure
     Weichzeichnen). Winter: Äste über 2 cm als Vierecke plus eine halb
     durchsichtige Kronenhülle für das Zweiggewirr. Frühling: die
     Laubwolken als große Ellipsen, dazu Stamm und untere Äste. */
  function baumSchatten(g, s, plan, gier, jahr) {
    const B = blick(gier, s);
    const m = g.getTransform();
    const winter = jahr === "winter" || jahr === "kahl";   // FASSUNG 814 — kahl wirft den Schatten des Astgerüsts
    const vier = [];
    for (const z of plan.zuege) {
      if (z.rMax < 0.02 && !z.stamm) continue;
      if (!winter && z.innen) continue;
      const P = z.pts.map(B.boden);
      for (let i = 1; i < P.length; i++) vier.push([P[i - 1], P[i], Math.max(0.5, z.rs[i - 1] * s), Math.max(0.4, z.rs[i] * s)]);
    }
    const ell = [];
    if (winter) {
      /* feine Zweige: ein zartes Netz aus Strichen */
    } else {
      for (const w of plan.wolken.values()) ell.push([B.boden(w.m), w.r * s * 0.95, plan.eiche ? 0.62 : 0.7]);
      for (const b of plan.buschel) if (b.t < 0.3) ell.push([B.boden(b.p), b.r * s * 0.9, 0.55]);
    }
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const nimm = (p, r) => { x0 = Math.min(x0, p[0] - r); x1 = Math.max(x1, p[0] + r); y0 = Math.min(y0, p[1] - r); y1 = Math.max(y1, p[1] + r); };
    for (const v of vier) { nimm(v[0], v[2]); nimm(v[1], v[3]); }
    for (const e of ell) nimm(e[0], e[1]);
    const kr = (plan.r0 * 2.6 + 0.3) * s;
    nimm([0, 0], kr);
    x0 -= 4; y0 -= 4; x1 += 4; y1 += 4;
    const q = klemm(1 / (s * 0.035 * 1.15), 0.22, 1);
    const c = leinwand((x1 - x0) * q + 2, (y1 - y0) * q + 2), cg = c.g;
    cg.setTransform(q, 0, 0, q, -x0 * q + 1, -y0 * q + 1);
    cg.fillStyle = "#000";
    /* Ellipsen nach Deckkraft gruppiert */
    const nachA = new Map();
    for (const e of ell) { const a = e[2]; if (!nachA.has(a)) nachA.set(a, []); nachA.get(a).push(e); }
    for (const [a, liste] of nachA) {
      cg.globalAlpha = a;
      cg.beginPath();
      for (const [p, r] of liste) { cg.moveTo(p[0] + r, p[1]); cg.ellipse(p[0], p[1], r, r * 0.62, 0, 0, Math.PI * 2); }
      cg.fill();
    }
    cg.globalAlpha = 1;
    /* Äste als Striche nach Breitenklassen (viel schneller als tausende
       Vierecke in einem Pfad) */
    const klassen = new Map();
    for (const v of vier) { const w = Math.max(1 / q, Math.round((v[2] + v[3]) * 2) / 2); if (!klassen.has(w)) klassen.set(w, []); klassen.get(w).push(v); }
    cg.strokeStyle = "#000"; cg.lineCap = "round"; cg.lineJoin = "round";
    for (const [w, liste] of klassen) {
      cg.lineWidth = w; cg.beginPath();
      for (const [pa, pb] of liste) { cg.moveTo(pa[0], pa[1]); cg.lineTo(pb[0], pb[1]); }
      cg.stroke();
    }
    cg.beginPath(); cg.moveTo(kr, 0); cg.ellipse(0, 0, kr, kr * 0.5, 0, 0, Math.PI * 2); cg.fill();
    if (winter) {
      cg.globalAlpha = 0.4; cg.strokeStyle = "#000"; cg.lineWidth = Math.max(1 / q, s * 0.012); cg.lineCap = "round";
      cg.beginPath();
      for (const zw of plan.zweige) { const a = B.boden(zw.pts[0]), b = B.boden(zw.pts[zw.pts.length - 1]); cg.moveTo(a[0], a[1]); cg.lineTo(b[0], b[1]); }
      for (const z of plan.zuege) if (z.rMax < 0.02) { const P = z.pts.map(B.boden); cg.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) cg.lineTo(P[i][0], P[i][1]); }
      cg.stroke();
      cg.globalAlpha = 1;
    }
    g.save();
    g.setTransform(1, 0, 0, 1, m.e, m.f);
    g.filter = "none";
    g.imageSmoothingEnabled = true;
    g.drawImage(c, x0 - 1 / q, y0 - 1 / q, c.width / q, c.height / q);
    g.restore();
  }

  /* Für Prüfbilder */
  (ST.naturPruef = ST.naturPruef || {}).laubbaum = { laubVorlage, bauplan };

  /* =====================================================================
     MODELL
     ===================================================================== */
  ST.modell("laubbaum", {
    name: "Laubbaum", gruppe: "Natur", grund: [5.5, 5.5], hoehe: 13,
    bauen(M, o) {
      const plan = bauplan(o.saat == null ? 7 : o.saat);
      const figur = {
        x: 0, y: 0, z: 0, breite: (plan.rMax + 0.6) / 0.6, hoehe: plan.zMax + 0.6, schatten: true,
        malen(g, s, F) {
          if (F.schatten) { baumSchatten(g, s, plan, figur._gier == null ? schaetzeGier(o) : figur._gier, F.jahr); return; }
          figur._gier = F.gier || 0;
          baumMalen(g, s, F, plan, figur._gier);
        }
      };
      M.teil("baum", { mitte: [0, 0, 1] });
      M.figur(figur);
      huelle(M, o, plan.rMax, plan.zMax, plan.Rk * 0.5);
    }
  });

  function schaetzeGier(o) {
    if (ST.MODELLE.laubbaum && ST.MODELLE.laubbaum.ohneDrehung) return 0;
    return ((o.objekt && o.objekt.gier) || 0) + ((ST.kamera && ST.kamera.dreh) || 0) * 90;
  }
  /* Unsichtbare Hülle: das Sprite muss den langen Schatten mit fassen –
     ein Achteck um den Fuß und ein Fleck an der Schattenspitze (so breit
     wie die Krone oben), kein volles Quadrat */
  function huelle(M, o, r, H, rSpitze) {
    M.teil("huelle", { schatten: false, mitte: [0, 0, -50] });
    const leer = { malen: null, keinLicht: true, keinAo: true };
    const acht = [];
    for (let i = 0; i < 8; i++) { const w = (i + 0.5) / 8 * Math.PI * 2; acht.push([Math.cos(w) * r, Math.sin(w) * r]); }
    M.flaeche(Object.assign({ name: "huelle", o: [0, 0, 0], u: [1, 0, 0], v: [0, 1, 0], w: 1, h: 1, umriss: acht }, leer));
    const gr = schaetzeGier(o || {}) * Math.PI / 180, c = Math.cos(gr), sn = Math.sin(gr);
    const a = SX * H, b = SY * H;
    const x = a * c + b * sn, y = -a * sn + b * c;
    M.flaeche(Object.assign({ name: "huelle-schatten", o: [x - rSpitze, y - rSpitze, 0], u: [1, 0, 0], v: [0, 1, 0], w: 2 * rSpitze, h: 2 * rSpitze }, leer));
  }
})();
