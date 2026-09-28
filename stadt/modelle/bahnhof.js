/* =====================================================================
   BAHNHOF WINTERHAUSEN — kleiner Dorfbahnhof um 1900
   ---------------------------------------------------------------------
   XANDER: „ein Baukastensystem für ein Dorf … filigran und detailreich
   perfekt nach ihrem Vorbild nachgearbeitet" · „Das soll keine Comic
   Grafik sein. Das soll noch viel mehr am Realismus dran sein."
   „ohne Pixelkanten und komische Vektorrückstände" · „Man soll sie in
   jedem Winkel aufstellen können. Man soll das Fundament sehen beim
   Aufbauen." · „Ich möchte einen Liebreiz zur Weihnachtsdeko … mit
   Schmücken, mit Schnee … dass wir das später in einen Frühlingsgewand
   packen können." · „trotzdem mit SVG Grafiken"

   VORBILD: Empfangsgebäude preußischer und hessischer Nebenbahnen der
   Kaiserzeit (Typenbauten um 1895–1910): Erdgeschoss aus rotem
   Backstein mit Sandstein-Gliederung (Sockel, Gurtgesims, Sohlbänke,
   Schlusssteine über Stichbogenfenstern), Obergeschoss in Fachwerk mit
   Ziegelausfachung, Satteldach mit Schiefer, zur Gleisseite ein
   Zwerchgiebel mit Bahnhofsuhr. Daneben ein hölzerner Güterschuppen.
   Am Bahnsteig ein Dach aus gusseisernen Säulen mit Zierkonsolen und
   Holz, vorn der gesägte Behang (Lambrequin). Winterhausen ist der
   Endbahnhof einer Nebenbahn: im Westen ein Prellbock.

   MASSE (Meter, Mitte des Grundrisses = 0,0,0; x entlang dem Gleis,
   −y Gleisseite, +y Straßenseite / Bahnhofsvorplatz)
     Gleis         Normalspur 1435 mm, Holzschwellen 2,6 m alle 65 cm,
                   Schotterbett 3,3 m, Schienenoberkante 0,50 m, 30 m lang
     Bahnsteig     Kante 1,65 m von Gleismitte, Höhe 0,55 m, 27 m lang
     Empfangsgeb.  11,0 × 7,5 m, Erdgeschoss bis 4,3 m, Obergeschoss
                   (Fachwerk) bis 7,1 m, Traufe 7,3 m, Neigung 45°,
                   First 11,4 m, Zwerchgiebel 3,6 m breit mit Uhr
     Güterschuppen 6,0 × 5,8 m, Holz auf Backsteinsockel, Neigung 25°
     Bahnsteigdach 10,6 × 2,95 m, vier Gusseisensäulen

   IN WINTERHAUSEN steht er bei (0, 67), gier 180: die Straßenseite zum
   Bahnhofsvorplatz, die Gleisseite nach Süden – zur Kamera.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const hex = PI.hex, rgb = PI.rgb, misch = PI.misch, hell = PI.hell;

  /* ---------------- kleine Werkzeuge ---------------- */
  const klemm = (x, a, b) => (x < a ? a : x > b ? b : x);
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const kreuz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const Z3 = [0, 0, 1];
  const RAD = Math.PI / 180, TAU = Math.PI * 2;
  const zufall = (n) => ST.zufall((n >>> 0) || 1);
  const glatt = (x) => { x = klemm(x, 0, 1); return x * x * (3 - 2 * x); };
  const phase = (bau, a, b) => klemm((bau - a) / (b - a), 0, 1);
  const malVerh = (c, k) => rgb([Math.min(255, c[0] * k[0]), Math.min(255, c[1] * k[1]), Math.min(255, c[2] * k[2])]);
  const AUSSEN = 100;

  /* ---------------- Farben ---------------- */
  const EISEN = [46, 46, 48];
  const SANDSTEIN = [196, 170, 132];       // gelblicher Sandstein (Gliederung)
  const ZIEGEL = [158, 70, 50];            // roter Backstein
  const ZIEGEL_G = [214, 182, 124];        // gelber Klinker (Zierbänder)
  const HOLZ_FW = [66, 44, 32];            // Fachwerk: dunkel gebeizte Eiche
  const HOLZ_ROH = [168, 128, 88];
  const SCHIEFER = [74, 80, 94];
  const GRUEN = [44, 74, 58];              // Bahngrün (Türen, Lambrequin-Kanten)
  const CREME = [226, 214, 184];           // Anstrich Holzteile
  const OCHSENBLUT = [110, 48, 36];        // Güterschuppen
  const ZR_ = 0.12;                        // Reihenhöhe der Schieferdeckung
  const HOLZ_ORDNUNG = { riegel: 0, strebe: 1, staender: 2, ortsparren: 3, schwelle: 4, raehm: 4 };

  /* =====================================================================
     GEMEINSAME HELFER (wie in der Wassermühle)
     ===================================================================== */
  function poly(g, p) { g.beginPath(); g.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]); g.closePath(); }
  function huelle2(pts) {
    pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (pts.length < 3) return pts;
    const kr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], hi = [];
    for (const p of pts) { while (lo.length >= 2 && kr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (hi.length >= 2 && kr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
    hi.pop(); lo.pop();
    return lo.concat(hi);
  }
  function schneide(P, f) {
    const aus = [];
    for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length], fa = f(a), fb = f(b);
      if (fa >= 0) aus.push(a);
      if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); aus.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return aus;
  }
  function rausch(g, x, y, w, h, meter, staerke, saat, okt) {
    const s = Math.abs(saat | 0);
    const bild = PI.rauschBild(1 + (s % 5), 128, 4, okt || 3, 1.6);
    const m = g.createPattern(bild, "repeat");
    const k = meter / 128, sx = (s >> 3) % 2 ? -k : k;
    m.setTransform(new DOMMatrix([sx, 0, 0, k, (s * 0.37) % meter, (s * 0.61) % meter]));
    g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }
  function bleich(g, x, y, w, h, meter, staerke, saat) {
    const s = Math.abs(saat | 0);
    const bild = PI.rauschBild(51 + (s % 3), 128, 3, 3, 2.2);
    const m = g.createPattern(bild, "repeat");
    const k = meter / 128;
    m.setTransform(new DOMMatrix([k, 0, 0, k, (s * 0.29) % meter, (s * 0.53) % meter]));
    g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }
  function belichter(F, extra) {
    const lf = ST.lichtFaktor(F.n, F.zeit, extra || 0, F.jahr);
    return (c, a) => rgb([c[0] * lf[0], c[1] * lf[1], c[2] * lf[2]], a);
  }
  function neuerBlick() { return { c: 1, s: 0, e: [0.6124, 0.6124, 0.5], gier: 0 }; }
  function blickSetzen(B, gier) {
    const r = gier * RAD, c = Math.cos(r), s = Math.sin(r);
    B.c = c; B.s = s; B.gier = gier;
    B.e = [0.6124 * (c + s), 0.6124 * (c - s), 0.5];
  }
  function parallaxe(F, B, d) {
    const f = F.flaeche, n = kreuz(f.u, f.v);
    const en = Math.max(0.12, dot(B.e, n));
    return [d * dot(B.e, f.u) / en, d * dot(B.e, f.v) / en];
  }
  function lichtVon(F, B, n) {
    const nc = [n[0] * B.c - n[1] * B.s, n[0] * B.s + n[1] * B.c, n[2]];
    return ST.lichtFaktor(nc, F.zeit, 0, F.jahr);
  }
  function lichtVerh(F, B, n) {
    const a = lichtVon(F, B, n), b = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
    return [a[0] / Math.max(0.05, b[0]), a[1] / Math.max(0.05, b[1]), a[2] / Math.max(0.05, b[2])];
  }
  function wand(M, o, n, w, h, malen, extra) {
    const u = kreuz(n, Z3);
    return M.flaeche(Object.assign({ o: o, u: u, v: [0, 0, -1], w: w, h: h, malen: malen }, extra || {}));
  }
  function kiste(M, x0, y0, z0, x1, y1, z1, m, extra) {
    const ex = (name) => Object.assign({ name: (extra && extra.name ? extra.name + "-" : "") + name }, extra || {});
    const h = z1 - z0;
    if (m.s) wand(M, [x0, y1, z1], [0, 1, 0], x1 - x0, h, m.s, ex("s"));
    if (m.n) wand(M, [x1, y0, z1], [0, -1, 0], x1 - x0, h, m.n, ex("n"));
    if (m.o) wand(M, [x1, y1, z1], [1, 0, 0], y1 - y0, h, m.o, ex("o"));
    if (m.w) wand(M, [x0, y0, z1], [-1, 0, 0], y1 - y0, h, m.w, ex("w"));
    if (m.t) M.flaeche(Object.assign({ o: [x0, y0, z1], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, malen: m.t }, ex("t")));
  }
  function balken3(M, P0, P1, Q, b, d, mal, opt) {
    opt = opt || {};
    const ax = sub(P1, P0), L = Math.hypot(ax[0], ax[1], ax[2]);
    if (L < 1e-4) return;
    const U = mul(ax, 1 / L);
    Q = nrm(sub(Q, mul(U, dot(Q, U))));
    const R = nrm(kreuz(U, Q));
    const mid = add(P0, mul(ax, 0.5));
    const seiten = opt.seiten || "QqRrae";
    const rechteck = (c, n, u, w, h, malen, name) => {
      n = nrm(n); u = nrm(u);
      const v = kreuz(n, u);
      const o = sub(sub(c, mul(u, w / 2)), mul(v, h / 2));
      M.flaeche(Object.assign({ o: o, u: u, v: v, w: w, h: h, malen: malen, name: (opt.name || "b") + name, keinAo: true }, opt.extra || {}));
    };
    /* u der Seitenflächen: so, dass v = n × u nach unten zeigt (Maserung längs) */
    const langU = (n) => { let u = U; if (dot(kreuz(n, u), Z3) > 0) u = mul(U, -1); return u; };
    if (seiten.indexOf("Q") >= 0) rechteck(add(mid, mul(Q, b / 2)), Q, langU(Q), L, d, mal("Q", L, d), "Q");
    if (seiten.indexOf("q") >= 0) rechteck(add(mid, mul(Q, -b / 2)), mul(Q, -1), langU(mul(Q, -1)), L, d, mal("q", L, d), "q");
    if (seiten.indexOf("R") >= 0) rechteck(add(mid, mul(R, d / 2)), R, langU(R), L, b, mal("R", L, b), "R");
    if (seiten.indexOf("r") >= 0) rechteck(add(mid, mul(R, -d / 2)), mul(R, -1), langU(mul(R, -1)), L, b, mal("r", L, b), "r");
    if (seiten.indexOf("a") >= 0) rechteck(P0, mul(U, -1), Q, b, d, mal("a", b, d), "a");
    if (seiten.indexOf("e") >= 0) rechteck(P1, U, Q, b, d, mal("e", b, d), "e");
  }
  function holzMalen(g, F, x, y, w, h, c, saat, opt) {
    opt = opt || {};
    const rng = zufall(saat);
    g.fillStyle = rgb(c); g.fillRect(x, y, w, h);
    const px = F.px;
    if (px * h > 3 && px > 10) {
      const n = Math.max(2, Math.min(30, Math.round(h * 40)));
      g.lineWidth = Math.max(0.003, 0.9 / px);
      for (let i = 0; i < n; i++) {
        const yy = y + h * (i + 0.5) / n + (rng() - 0.5) * h * 0.04;
        g.strokeStyle = rgb(hell(c, -0.2 - rng() * 0.2), 0.16 + rng() * 0.22);
        g.beginPath(); g.moveTo(x + rng() * w * 0.2, yy);
        const st = 4;
        for (let k = 1; k <= st; k++) g.lineTo(x + w * k / st, yy + (rng() - 0.5) * h * 0.05);
        g.stroke();
      }
      if (px > 40 && !opt.ohneAst) {
        const aeste = Math.floor(w * h * 3 * rng());
        for (let i = 0; i < aeste; i++) {
          const ax = x + rng() * w, ay = y + rng() * h, r = 0.012 + rng() * 0.02;
          g.fillStyle = rgb(hell(c, -0.35), 0.7); g.beginPath(); g.ellipse(ax, ay, r * 1.6, r, 0, 0, TAU); g.fill();
        }
      }
    }
    if (opt.rauh !== false) rausch(g, x, y, w, h, 0.9, 0.22, saat + 3, 3);
  }
  function bretterMalen(g, F, x, y, w, h, c, saat, opt) {
    opt = opt || {};
    const rng = zufall(saat);
    const bb = opt.breite || 0.2;
    const waag = opt.richtung !== "v";
    const L = waag ? h : w;
    const n = Math.max(1, Math.round(L / bb));
    for (let i = 0; i < n; i++) {
      const cc = PI.streu(c, rng, 0.08);
      if (waag) holzMalen(g, F, x, y + h * i / n, w, h / n, cc, saat + i * 7, { rauh: false });
      else {
        g.save(); g.translate(x + w * i / n, y + h); g.rotate(-Math.PI / 2);
        holzMalen(g, F, 0, 0, h, w / n, cc, saat + i * 7, { rauh: false });
        g.restore();
      }
    }
    if (F.px * bb > 4) {
      g.fillStyle = rgb(hell(c, -0.55), 0.8);
      for (let i = 1; i < n; i++) {
        if (waag) g.fillRect(x, y + h * i / n - 0.006, w, 0.012);
        else g.fillRect(x + w * i / n - 0.006, y, 0.012, h);
      }
    }
    rausch(g, x, y, w, h, 1.2, 0.2, saat + 11, 3);
  }
  function quaderMalen(g, F, x, y, w, h, opt) {
    opt = opt || {};
    const rng = zufall(opt.saat || 5), px = F.px;
    const basis = opt.farbe || SANDSTEIN;
    const lage = opt.lage || 0.34;
    g.fillStyle = rgb(hell(basis, -0.28)); g.fillRect(x, y, w, h);
    let yy = y + h, reihe = 0;
    while (yy > y + 0.001) {
      const lh = Math.min(lage * (0.85 + rng() * 0.3), yy - y);
      let xx = x - (reihe % 2 ? lage * 0.9 : 0) - rng() * 0.1;
      while (xx < x + w) {
        const lw = opt.laenge ? opt.laenge * (0.8 + rng() * 0.4) : lage * (1.3 + rng() * 1.2);
        const c = PI.streu(basis, rng, 0.1);
        const bx = Math.max(x, xx) + 0.008, bw = Math.min(x + w, xx + lw) - Math.max(x, xx) - 0.016;
        if (bw > 0.02) {
          g.fillStyle = rgb(c);
          g.fillRect(bx, yy - lh + 0.008, bw, lh - 0.016);
          if (px > 18) {
            g.fillStyle = "rgba(255,240,220,0.18)"; g.fillRect(bx, yy - lh + 0.008, bw, Math.max(0.006, 1 / px));
            g.fillStyle = "rgba(40,20,14,0.22)"; g.fillRect(bx, yy - 0.008 - Math.max(0.006, 1 / px), bw, Math.max(0.006, 1 / px));
          }
          if (px > 55) {
            /* Scharrierung: feine, schräge Hiebe */
            g.strokeStyle = "rgba(70,40,30,0.12)"; g.lineWidth = Math.max(0.002, 0.5 / px);
            g.beginPath();
            for (let s = bx + 0.02; s < bx + bw; s += 0.018) { g.moveTo(s, yy - lh + 0.02); g.lineTo(s - 0.01, yy - 0.02); }
            g.stroke();
          }
        }
        xx += lw;
      }
      yy -= lh; reihe++;
    }
    rausch(g, x, y, w, h, 1.6, 0.2, (opt.saat || 5) + 3, 3);
  }
  function schneeFlaeche(g, F, x, y, w, h, saat) {
    const rng = zufall(saat * 131 + 7);
    const gr = g.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, "rgb(236,241,249)"); gr.addColorStop(1, "rgb(247,250,254)");
    g.fillStyle = gr; g.fillRect(x, y, w, h);
    /* Verwehungen: wenige große, weiche Mulden, dazu Rauschen */
    const n = Math.min(6, Math.round(w * h * 0.08) + 1);
    for (let i = 0; i < n; i++) {
      const cx = x + rng() * w, cy = y + rng() * h, rx = 0.8 + rng() * 1.6, ry = 0.15 + rng() * 0.25;
      const gg = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
      gg.addColorStop(0, "rgba(165,185,222,0.13)"); gg.addColorStop(1, "rgba(165,185,222,0)");
      g.save(); g.translate(cx, cy); g.scale(1, ry / rx); g.fillStyle = gg; g.beginPath(); g.arc(0, 0, rx, 0, TAU); g.fill(); g.restore();
    }
    rausch(g, x, y, w, h, 2.4, 0.07, saat + 31, 3);
    if (F.px > 16) rausch(g, x, y, w, h, 0.5, 0.05, saat + 37, 2);
    if (F.px > 20) {
      /* Glitzer, in einem Pfad */
      g.fillStyle = "rgba(255,255,255,0.95)";
      g.beginPath();
      const k = Math.min(500, Math.round(w * h * 6));
      for (let i = 0; i < k; i++) { const r = (0.5 + rng() * 0.8) / F.px; g.rect(x + rng() * w, y + rng() * h, r, r); }
      g.fill();
    }
  }
  function schneeOben(basis) {
    return function (g, F) {
      if (basis) { if (typeof basis === "function") basis(g, F); else { g.fillStyle = basis; g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04); } }
      g.fillStyle = "rgb(242,246,252)";
      PI.rundRechteck(g, -0.01, -0.01, F.w + 0.02, F.h + 0.02, Math.min(0.03, F.h * 0.3)); g.fill();
      const gr = g.createLinearGradient(0, 0, 0, F.h);
      gr.addColorStop(0, "rgba(200,212,235,0.3)"); gr.addColorStop(0.4, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(215,225,245,0.25)");
      g.fillStyle = gr; g.fillRect(0, 0, F.w, F.h);
    };
  }
  function eiszapfenMalen(g, F, x0, x1, y0, maxL, saat, L) {
    const rng = zufall(saat);
    const Z = [];
    let x = x0 + rng() * 0.2;
    while (x < x1 - 0.03) {
      const gruppe = rng() < 0.3;
      const l = maxL * (gruppe ? 0.45 + rng() * 0.55 : 0.08 + Math.pow(rng(), 2) * 0.55), b = 0.014 + l * 0.07;
      Z.push([x, l, b, (rng() - 0.5) * 0.01]);
      x += gruppe ? 0.03 + rng() * 0.06 : 0.1 + rng() * 0.4;
    }
    const form = (sx, sb) => { g.beginPath(); for (const [x, l, b, d] of Z) { g.moveTo(x - b * sb + sx * b, y0); g.quadraticCurveTo(x - b * 0.5 * sb + sx * b, y0 + l * 0.55, x + d, y0 + l); g.quadraticCurveTo(x + b * 0.5 + sx * b, y0 + l * 0.55, x + b, y0); g.closePath(); } };
    form(0, 1); g.fillStyle = L([214, 232, 248], 0.72); g.fill();
    form(0.35, 0.4); g.fillStyle = L([150, 182, 214], 0.5); g.fill();
    g.strokeStyle = L([255, 255, 255], 0.85); g.lineWidth = Math.max(0.004, 0.9 / F.px);
    g.beginPath(); for (const [x, l, b] of Z) { g.moveTo(x - b * 0.45, y0 + 0.01); g.lineTo(x - b * 0.1, y0 + l * 0.7); } g.stroke();
  }
  function dachSchnee(g, F, x0, x1, yTraufe, yOben, saat, opt) {
    opt = opt || {};
    const w = x1 - x0, h = yTraufe - yOben, rng = zufall(saat * 7 + 3), px = F.px;
    schneeFlaeche(g, F, x0 - 0.1, yOben - 0.05, w + 0.2, h + 0.1, saat);
    if (px * ZR_ > 2.5) {
      /* die Ziegelreihen drücken sich als flache Wellen durch (ein Pfad) */
      g.fillStyle = "rgba(170,188,222,0.17)";
      g.beginPath();
      for (let yu = yTraufe - ZR_; yu > yOben + 0.1; yu -= ZR_) {
        let x = x0 - rng() * 0.3;
        while (x < x1) {
          const len = 0.3 + Math.pow(rng(), 1.5) * 2.2, gap = 0.05 + Math.pow(rng(), 2) * 0.6;
          const d = 0.015 + rng() * 0.03;
          g.rect(x, yu - d * 0.5, len, d);
          x += len + gap;
        }
      }
      g.fill();
    }
    /* am First dünner: die Firstziegel schauen durch */
    if (opt.first) {
      const gr = g.createLinearGradient(0, yOben, 0, yOben + 0.35);
      gr.addColorStop(0, "rgba(120,70,56,0.45)"); gr.addColorStop(1, "rgba(120,70,56,0)");
      g.fillStyle = gr; g.fillRect(x0, yOben, w, 0.35);
    }
    if (opt.kamin != null) {
      const gg = g.createRadialGradient(opt.kamin, yOben + 0.2, 0, opt.kamin, yOben + 0.2, 0.9);
      gg.addColorStop(0, "rgba(60,30,24,0.42)"); gg.addColorStop(1, "rgba(60,30,24,0)");
      g.fillStyle = gg; g.fillRect(opt.kamin - 0.9, yOben - 0.1, 1.8, 1.2);
    }
  }
  function schwibbogen(g, F, gx, gy, gw, gh, leuchtend) {
    const bx = gx + gw * 0.12, bw = gw * 0.76, by = gy + gh * 0.93, bh = gh * 0.34;
    if (!leuchtend) {
      g.strokeStyle = "rgba(30,24,20,0.9)"; g.lineWidth = Math.max(0.012, 1.2 / F.px);
      g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(bx + bw / 2, by - bh * 1.5, bx + bw, by); g.stroke();
      g.fillStyle = "rgba(30,24,20,0.9)"; g.fillRect(bx - 0.02, by, bw + 0.04, 0.02);
      /* Figuren unter dem Bogen */
      g.beginPath(); g.moveTo(bx + bw * 0.3, by); g.lineTo(bx + bw * 0.35, by - bh * 0.45); g.lineTo(bx + bw * 0.4, by); g.fill();
      g.beginPath(); g.moveTo(bx + bw * 0.55, by); g.lineTo(bx + bw * 0.62, by - bh * 0.6); g.lineTo(bx + bw * 0.69, by); g.fill();
    }
    const n = 7;
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, cx = bx + bw * t;
      const cy = by - bh * 0.3 - Math.sin(t * Math.PI) * bh * 0.75;
      if (leuchtend) {
        const gg = g.createRadialGradient(cx, cy, 0, cx, cy, 0.05);
        gg.addColorStop(0, "rgba(255,244,200,1)"); gg.addColorStop(1, "rgba(255,190,90,0)");
        g.fillStyle = gg; g.fillRect(cx - 0.05, cy - 0.05, 0.1, 0.1);
      } else { g.fillStyle = "rgba(236,222,190,0.9)"; g.fillRect(cx - 0.004, cy, 0.008, 0.03); }
    }
  }
  function hoelzerMalen(g, F, H, ztop, c, saat, opt) {
    opt = opt || {};
    const px = F.px;
    const liste = H.slice().sort((a, b) => HOLZ_ORDNUNG[a.art] - HOLZ_ORDNUNG[b.art]);
    const quad = (m, d) => {
      const x0 = m.p0[0], y0 = ztop - m.p0[1], x1 = m.p1[0], y1 = ztop - m.p1[1];
      const L = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / L * (m.b / 2 + (d || 0)), ny = (x1 - x0) / L * (m.b / 2 + (d || 0));
      return [[x0 + nx, y0 + ny], [x1 + nx, y1 + ny], [x1 - nx, y1 - ny], [x0 - nx, y0 - ny]];
    };
    /* Schatten der Hölzer auf den Putz (2,5 cm vor) */
    const sv = F.schatten(0.025);
    if (sv && !opt.ohneSchatten) {
      g.fillStyle = "rgba(40,28,22,0.3)";
      g.beginPath();
      for (const m of liste) { const q = quad(m); g.moveTo(q[0][0] + sv[0], q[0][1] + sv[1]); for (let i = 1; i < 4; i++) g.lineTo(q[i][0] + sv[0], q[i][1] + sv[1]); g.closePath(); }
      g.fill();
    }
    const rng = zufall(saat);
    for (const m of liste) {
      if (opt.nur && !opt.nur(m)) continue;
      const q = quad(m);
      const cc = PI.streu(c, rng, 0.07);
      g.fillStyle = rgb(cc);
      poly(g, q); g.fill();
      const x0 = m.p0[0], y0 = ztop - m.p0[1], x1 = m.p1[0], y1 = ztop - m.p1[1];
      const L = Math.hypot(x1 - x0, y1 - y0);
      if (px * m.b > 3) {
        g.save(); poly(g, q); g.clip();
        g.translate(x0, y0); g.rotate(Math.atan2(y1 - y0, x1 - x0));
        /* Kantenlicht und Schattenkante, Maserung, Risse */
        const gr = g.createLinearGradient(0, -m.b / 2, 0, m.b / 2);
        gr.addColorStop(0, "rgba(255,220,190,0.14)"); gr.addColorStop(0.2, "rgba(255,220,190,0)"); gr.addColorStop(0.8, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(20,8,4,0.3)");
        g.fillStyle = gr; g.fillRect(-0.1, -m.b / 2, L + 0.2, m.b);
        if (px > 22) {
          g.lineWidth = Math.max(0.003, 0.8 / px);
          const nl = Math.round(m.b * 40);
          for (let i = 0; i < nl; i++) {
            const yy = -m.b / 2 + m.b * (i + 0.5) / nl;
            g.strokeStyle = rgb(hell(cc, -0.3 - rng() * 0.2), 0.2 + rng() * 0.2);
            g.beginPath(); g.moveTo(rng() * L * 0.2, yy); for (let k = 1; k <= 4; k++) g.lineTo(L * k / 4, yy + (rng() - 0.5) * m.b * 0.08); g.stroke();
          }
          if (px > 38) {
            g.strokeStyle = rgb(hell(cc, -0.6), 0.75); g.lineWidth = Math.max(0.004, 1.1 / px);
            const risse = Math.floor(L * 0.9 * rng() + (rng() < 0.4 ? 1 : 0));
            for (let i = 0; i < risse; i++) { const sx = rng() * L * 0.8, yy = (rng() - 0.5) * m.b * 0.4, len = 0.15 + rng() * 0.5; g.beginPath(); g.moveTo(sx, yy); g.quadraticCurveTo(sx + len / 2, yy + (rng() - 0.5) * 0.015, Math.min(L, sx + len), yy); g.stroke(); }
            /* Holznägel an den Zapfen */
            if (m.art !== "schwelle" && m.art !== "raehm" && L > 0.5) {
              g.fillStyle = rgb(hell(cc, -0.4));
              for (const s of [m.b * 0.6, L - m.b * 0.6]) { g.beginPath(); g.arc(s, 0, m.b * 0.09, 0, TAU); g.fill(); }
            }
          }
        }
        g.restore();
      }
      if (px > 10) { g.strokeStyle = rgb(hell(cc, -0.55), 0.5); g.lineWidth = Math.max(0.004, 0.9 / px); poly(g, q); g.stroke(); }
    }
  }
  function lochClip(g, F, B, R) {
    const f = F.flaeche, n = kreuz(f.u, f.v), e = B.e;
    const en = dot(e, n);
    if (Math.abs(en) < 1e-3) return false;
    const pts = [];
    for (const [x, y] of [[R[0], R[1]], [R[2], R[1]], [R[2], R[3]], [R[0], R[3]]]) {
      const C = [x, y, R[4] || 0];
      const t = dot(sub(C, f.o), n) / en;
      const P = sub(C, mul(e, t)), d = sub(P, f.o);
      pts.push([dot(d, f.u), dot(d, f.v)]);
    }
    poly(g, pts); g.clip();
    return true;
  }
  function grubenSchatten(g, F, R, w, h) {
    const f = F.flaeche, n = kreuz(f.u, f.v);
    g.save();
    g.beginPath(); g.rect(-0.5, -0.5, w + 1, h + 1);
    let licht = true;
    const pts = [];
    for (const [x, y] of [[R[0], R[1]], [R[2], R[1]], [R[2], R[3]], [R[0], R[3]]]) {
      const d = sub([x, y, 0], f.o), a = dot(d, f.u), b = dot(d, f.v), hh = dot(d, n);
      if (hh < -0.01) { licht = false; break; }
      const sv = hh > 0.005 ? F.schatten(hh) : [0, 0];
      if (!sv) { licht = false; break; }
      pts.push([a + sv[0], b + sv[1]]);
    }
    if (licht) { const H = huelle2(pts); if (H.length >= 3) { g.moveTo(H[0][0], H[0][1]); for (let i = H.length - 1; i > 0; i--) g.lineTo(H[i][0], H[i][1]); g.closePath(); } }
    g.fillStyle = "rgba(20,24,52,0.32)";
    g.fill("evenodd");
    g.restore();
  }
  function erdeMalen(g, F, w, h, saat, winter) {
    const L = belichter(F, 0.05), rng = zufall(saat), px = F.px;
    const sch = [[0, [64, 46, 32]], [0.28, [124, 88, 54]], [0.62, [168, 128, 82]]];
    for (let i = 0; i < sch.length; i++) {
      const y0 = sch[i][0];
      g.fillStyle = L(sch[i][1]);
      g.beginPath(); g.moveTo(-0.1, h + 0.2); g.lineTo(-0.1, y0);
      for (let x = 0; x <= w + 0.3; x += 0.3) g.lineTo(x, y0 + (i ? Math.sin(x * 1.7 + i * 3 + saat) * 0.05 + Math.sin(x * 4.1 + i) * 0.025 : 0));
      g.lineTo(w + 0.3, h + 0.2); g.closePath(); g.fill();
    }
    if (px > 6) rausch(g, 0, 0, w, h, 0.9, 0.35, saat + 3, 3);
    if (px > 10) {
      for (let i = 0; i < Math.min(300, w * h * 8); i++) { const x = rng() * w, y = 0.3 + rng() * (h - 0.3), r = 0.015 + rng() * 0.035; g.fillStyle = L(hell([140, 130, 118], (rng() - 0.5) * 0.4)); g.beginPath(); g.ellipse(x, y, r * 1.3, r, rng() * 3, 0, TAU); g.fill(); }
      g.strokeStyle = L([30, 20, 14], 0.18); g.lineWidth = 0.02;
      for (let x = rng() * 0.3; x < w; x += 0.25 + rng() * 0.2) { g.beginPath(); g.moveTo(x, 0.3); g.lineTo(x + 0.03, h); g.stroke(); }
    }
    const gd = g.createLinearGradient(0, 0, 0, h);
    gd.addColorStop(0, "rgba(10,8,20,0)"); gd.addColorStop(1, "rgba(10,8,20,0.25)");
    g.fillStyle = gd; g.fillRect(-0.1, 0, w + 0.2, h + 0.1);
    if (winter) { g.fillStyle = L([240, 244, 251]); g.fillRect(-0.1, -0.1, w + 0.2, 0.14); g.fillStyle = L([205, 216, 236]); g.fillRect(-0.1, 0.04, w + 0.2, 0.02); }
  }
  function lichtA(A, n) { return ST.lichtFaktor([n[0] * A.c - n[1] * A.sn, n[0] * A.sn + n[1] * A.c, n[2]], A.Z, 0, A.jahr); }
  function ebeneA(g, A, o, u, v) {
    const p0 = A.p(o[0], o[1], o[2]), pu = A.p(o[0] + u[0], o[1] + u[1], o[2] + u[2]), pv = A.p(o[0] + v[0], o[1] + v[1], o[2] + v[2]);
    g.transform(pu[0] - p0[0], pu[1] - p0[1], pv[0] - p0[0], pv[1] - p0[1], p0[0], p0[1]);
  }

  /* =====================================================================
     HAUPTMASSE
     ===================================================================== */
  /* Gleis */
  const YG = -5.9, SPUR = 1.435;
  const SCHIENEN = [YG - SPUR / 2 - 0.036, YG + SPUR / 2 + 0.036];   // Mitte der Schienenköpfe
  const Z_SCHOTTER = 0.3, Z_SCHWELLE = 0.36, Z_SCHIENE = 0.5;
  const BETT = 1.65;                                   // halbe Breite des Schotterbetts
  const GX0 = -15, GX1 = 15, X_PRELL = -14.3;
  /* Bahnsteig */
  const YK = YG + 1.65, ZB = 0.55, XB0 = -13.6, XB1 = 13.6, XR = 1.0;
  /* Empfangsgebäude */
  const HX0 = -7.5, HX1 = 3.5, HY0 = -1.0, HY1 = 6.5;
  const HYM = (HY0 + HY1) / 2, HD = (HY1 - HY0) / 2;
  const EG1 = 4.3, OG1 = 7.1, TR = 7.3;
  const NEIG = 45 * RAD;
  const DICKE = 0.25, DV = DICKE / Math.cos(NEIG);
  const UE = 0.75, OGV = 0.6;
  const ZF = TR + DV + HD, ZTE = TR + DV - UE;
  const XD0 = HX0 - OGV, XD1 = HX1 + OGV, YD0 = HY0 - UE, YD1 = HY1 + UE;
  const GZ = TR + HD;                                  // Giebelspitze (unter dem Dach)
  const HAUS_M = [(HX0 + HX1) / 2, HYM, 4];
  /* Zwerchgiebel zur Gleisseite */
  const QX = -2.0, QB = 1.8;
  const QZ = TR + QB, QF = TR + DV + QB, QE = QB + UE;
  const QY1 = HYM - (ZF - QF);                         // wo der Zwerchfirst ins Hauptdach läuft
  /* Güterschuppen */
  const SX0 = HX1, SX1 = 9.5, SY0 = HY0, SY1 = 4.8, SH = 4.2;
  const SNEIG = 25 * RAD, STN = Math.tan(SNEIG);
  const SYM = (SY0 + SY1) / 2, SD = (SY1 - SY0) / 2;
  const SDV = 0.18 / Math.cos(SNEIG);
  const SZF = SH + SDV + SD * STN;                     // First (Dachhaut)
  const S_UE_G = 0.95, S_UE_S = 0.55, S_OGV = 0.5;     // Überstände Gleis-, Straßen-, Giebelseite
  const SGZ = SH + SD * STN;                           // Giebelspitze der Ostwand
  /* Bahnsteigdach */
  const VX0 = -7.3, VX1 = 3.3, VY0 = -3.95, VY1 = HY0, VZW = 4.05, VZV = 3.85;
  const SAEULEN = [-6.9, -3.6, -0.4, 2.8], SAEULE_Y = -3.45;
  const vdZ = (y) => VZV + (VZW - VZV) * (y - VY0) / (VY1 - VY0);

  /* =====================================================================
     BACKSTEIN: Kreuzverband, nach Farbeimern gebündelt. Reichsformat
     25 × 12 × 6,5 cm, Fuge 1 cm → Läufer 26 cm, Binder 13 cm, Schicht 7,7 cm.
     baender: Liste von [yOben, yUnten] in Flächenkoordinaten mit gelbem
     Klinker (Zierbänder). bis: gemauerte Höhe von unten (Bau).
     ===================================================================== */
  const LH = 0.077, LL = 0.26, LB = 0.13;
  const Z_FARBEN = [[160, 72, 50], [146, 62, 44], [170, 84, 58], [132, 58, 46], [154, 78, 60], [118, 52, 44]];
  const G_FARBEN = [[216, 186, 128], [204, 172, 116], [224, 198, 144]];
  function backsteinMalen(g, F, x, y, w, h, opt) {
    opt = opt || {};
    const px = F.px, saat = opt.saat || 1;
    const ob = opt.bis == null ? y : Math.max(y, y + h - opt.bis);
    const baender = opt.baender || [];
    const imBand = (yy) => baender.some((b) => yy > b[0] - 0.01 && yy < b[1] + 0.01);
    g.fillStyle = "rgb(186,178,164)"; g.fillRect(x, ob, w, y + h - ob);
    if (px * LH < 1.8) {
      g.fillStyle = rgb(ZIEGEL); g.fillRect(x, ob, w, y + h - ob);
      g.globalAlpha = 0.85;
      for (const b of baender) { g.fillStyle = rgb(ZIEGEL_G); g.fillRect(x, Math.max(ob, b[0]), w, Math.max(0, b[1] - Math.max(ob, b[0]))); }
      g.globalAlpha = 1;
      rausch(g, x, ob, w, y + h - ob, 2.5, 0.2, saat, 3);
      return;
    }
    const rng = zufall(saat * 71 + 5);
    const eimer = [], eimerG = [];
    for (let i = 0; i < Z_FARBEN.length; i++) eimer.push([]);
    for (let i = 0; i < G_FARBEN.length; i++) eimerG.push([]);
    const fuge = 0.01;
    let r = 0;
    for (let yu = y + h; yu > ob + 0.001; yu -= LH, r++) {
      const yo = Math.max(ob, yu - LH);
      const binder = r % 2 === 1;
      const schritt = binder ? LB : LL;
      const vers = binder ? LB / 2 : ((r >> 1) % 2 ? LL / 2 : 0);
      const band = imBand((yo + yu) / 2);
      for (let xx = x - vers; xx < x + w; xx += schritt) {
        const bx = Math.max(x, xx), bw = Math.min(x + w, xx + schritt - fuge) - bx;
        if (bw <= 0.004) continue;
        const b = [bx, yo + fuge * 0.5, bw, yu - yo - fuge];
        if (band) eimerG[(rng() * G_FARBEN.length) | 0].push(b);
        else { const q = rng(); eimer[q < 0.05 ? 5 : q < 0.12 ? 3 : (rng() * 5) | 0].push(b); }
      }
    }
    const fuell = (liste, c) => { if (!liste.length) return; g.fillStyle = rgb(c); g.beginPath(); for (const b of liste) g.rect(b[0], b[1], b[2], b[3]); g.fill(); };
    for (let i = 0; i < eimer.length; i++) fuell(eimer[i], Z_FARBEN[i]);
    for (let i = 0; i < eimerG.length; i++) fuell(eimerG[i], G_FARBEN[i]);
    if (px * LH > 4.5) {
      /* Fugen liegen zurück: dunkle Unterkante, helle Oberkante je Stein */
      const d = Math.max(0.003, 0.8 / px);
      g.fillStyle = "rgba(40,18,12,0.28)"; g.beginPath();
      for (const L of eimer.concat(eimerG)) for (const b of L) g.rect(b[0], b[1] + b[3] - d, b[2], d);
      g.fill();
      g.fillStyle = "rgba(255,230,210,0.14)"; g.beginPath();
      for (const L of eimer.concat(eimerG)) for (const b of L) g.rect(b[0], b[1], b[2], d);
      g.fill();
    }
    rausch(g, x, ob, w, y + h - ob, 2.6, 0.16, saat + 3, 4);
    if (px > 30) rausch(g, x, ob, w, y + h - ob, 0.35, 0.1, saat + 9, 2);
    bleich(g, x, ob, w, y + h - ob, 3, 0.05, saat);
  }

  /* Sandsteinband (Gurtgesims, Sohlbank, Sockelabschluss) vor der Wand:
     Vorderseite mit Profil, Oberseite per Parallaxe, Schatten darunter */
  function gesimsMalen(g, F, B, x0, x1, y, hoehe, vor, winter, farbe) {
    const c = farbe || SANDSTEIN, w = x1 - x0;
    const sv = F.schatten(vor);
    if (sv) {
      g.fillStyle = "rgba(30,20,20,0.32)";
      g.beginPath(); g.moveTo(x0, y + hoehe); g.lineTo(x1, y + hoehe); g.lineTo(x1 + sv[0], y + hoehe + Math.max(0.02, sv[1])); g.lineTo(x0 + sv[0], y + hoehe + Math.max(0.02, sv[1])); g.closePath(); g.fill();
    }
    const gr = g.createLinearGradient(0, y, 0, y + hoehe);
    gr.addColorStop(0, rgb(hell(c, 0.14))); gr.addColorStop(0.3, rgb(c)); gr.addColorStop(0.55, rgb(hell(c, -0.2))); gr.addColorStop(0.7, rgb(hell(c, 0.05))); gr.addColorStop(1, rgb(hell(c, -0.12)));
    g.fillStyle = gr; g.fillRect(x0, y, w, hoehe);
    if (F.px > 20) {
      const rng = zufall(((y * 100) | 0) + 3);
      g.fillStyle = "rgba(60,40,30,0.35)";
      for (let x = x0 + 0.6 + rng() * 0.4; x < x1; x += 0.8 + rng() * 0.6) g.fillRect(x, y, Math.max(0.004, 0.8 / F.px), hoehe);
      rausch(g, x0, y, w, hoehe, 0.7, 0.2, 13, 3);
    }
    const pO = parallaxe(F, B, -vor);
    if (pO[1] < 0) {
      g.fillStyle = winter ? "rgb(244,247,252)" : rgb(hell(c, 0.2));
      poly(g, [[x0, y], [x1, y], [x1 + pO[0], y + pO[1]], [x0 + pO[0], y + pO[1]]]); g.fill();
    }
    if (winter) { g.fillStyle = "rgb(244,247,252)"; g.fillRect(x0, y - 0.01, w, 0.04); }
  }

  /* =====================================================================
     FENSTER UND TÜREN MIT STICHBOGEN
     (x, y, w, h) = Maueröffnung in Flächenkoordinaten, st = Stich des Bogens
     ===================================================================== */
  function bogenPfad(g, x, y, w, h, st) {
    g.beginPath();
    if (st <= 0.001) { g.rect(x, y, w, h); return; }
    const R = (w * w / 4 + st * st) / (2 * st), a = Math.asin(Math.min(1, (w / 2) / R));
    g.moveTo(x, y + h); g.lineTo(x, y + st);
    g.arc(x + w / 2, y + R, R, -Math.PI / 2 - a, -Math.PI / 2 + a);
    g.lineTo(x + w, y + h); g.closePath();
  }
  /* Rollschicht (hochkant gestellte Backsteine) und Schlussstein über dem Bogen */
  function bogenSturz(g, F, x, y, w, st, opt) {
    opt = opt || {};
    const R = (w * w / 4 + st * st) / (2 * st), a = Math.asin(Math.min(1, (w / 2) / R));
    const cx = x + w / 2, cy = y + R, d = 0.25;
    g.fillStyle = "rgb(186,178,164)";
    g.beginPath(); g.arc(cx, cy, R + d, -Math.PI / 2 - a - 0.02, -Math.PI / 2 + a + 0.02); g.arc(cx, cy, R, -Math.PI / 2 + a + 0.02, -Math.PI / 2 - a - 0.02, true); g.closePath(); g.fill();
    const n = Math.max(6, Math.round(2 * a * (R + d / 2) / 0.085));
    const rng = zufall(((x * 100) | 0) + 11);
    for (let i = 0; i < n; i++) {
      const w0 = -Math.PI / 2 - a + (2 * a) * i / n + 0.006, w1 = -Math.PI / 2 - a + (2 * a) * (i + 1) / n - 0.006;
      g.fillStyle = rgb(opt.gelb && i % 2 ? G_FARBEN[i % 3] : Z_FARBEN[(rng() * 5) | 0]);
      g.beginPath(); g.arc(cx, cy, R + d - 0.006, w0, w1); g.arc(cx, cy, R + 0.006, w1, w0, true); g.closePath(); g.fill();
    }
    /* Schlussstein aus Sandstein */
    const kw = 0.16, kh = d + 0.1;
    g.fillStyle = rgb(SANDSTEIN);
    g.beginPath(); g.moveTo(cx - kw * 0.6, y - kh); g.lineTo(cx + kw * 0.6, y - kh); g.lineTo(cx + kw * 0.42, y + 0.02); g.lineTo(cx - kw * 0.42, y + 0.02); g.closePath(); g.fill();
    if (F.px > 18) { g.fillStyle = "rgba(255,240,220,0.3)"; g.fillRect(cx - kw * 0.6, y - kh, kw * 1.2, 0.015); g.fillStyle = "rgba(60,40,30,0.3)"; g.fillRect(cx - kw * 0.08, y - kh + 0.05, kw * 0.16, kh - 0.1); }
    if (opt.winter) { g.fillStyle = "rgba(244,247,252,0.95)"; PI.rundRechteck(g, cx - kw * 0.7, y - kh - 0.03, kw * 1.4, 0.05, 0.02); g.fill(); }
  }
  function bogenFenster(g, F, B, x, y, w, h, fo) {
    const px = F.px, st = fo.stich == null ? Math.min(0.2, w * 0.18) : fo.stich;
    const tiefe = fo.tiefe || 0.22;
    const pT = parallaxe(F, B, tiefe);
    const lb = [196, 184, 166];
    g.save(); bogenPfad(g, x, y, w, h, st); g.clip();
    /* Laibung */
    g.fillStyle = rgb(hell(lb, -0.08)); g.fillRect(x - 0.1, y - 0.1, w + 0.2, h + 0.2);
    const u = F.flaeche.u, v = F.flaeche.v;
    const seite = (pts, nn) => { g.fillStyle = malVerh(lb, lichtVerh(F, B, nn)); poly(g, pts); g.fill(); };
    if (pT[0] > 0) seite([[x, y], [x + pT[0], y + pT[1]], [x + pT[0], y + h + pT[1]], [x, y + h]], u);
    if (pT[0] < 0) seite([[x + w, y], [x + w + pT[0], y + pT[1]], [x + w + pT[0], y + h + pT[1]], [x + w, y + h]], mul(u, -1));
    if (pT[1] > 0) seite([[x, y], [x + w, y], [x + w + pT[0], y + st + pT[1]], [x + pT[0], y + st + pT[1]]], v);
    if (pT[1] < 0) seite([[x, y + h], [x + w, y + h], [x + w + pT[0], y + h + pT[1]], [x + pT[0], y + h + pT[1]]], mul(v, -1));
    const fx = x + pT[0], fy = y + pT[1];
    if (fo.leer) {
      g.fillStyle = "rgb(30,26,24)"; bogenPfad(g, fx, fy, w, h, st); g.fill();
      g.restore(); return;
    }
    const tag = 1 - F.nacht;
    const rb = Math.min(0.06, w * 0.07);
    g.save(); bogenPfad(g, fx, fy, w, h, st); g.clip();
    /* Innenraum und Vorhänge */
    const innen = g.createLinearGradient(0, fy, 0, fy + h);
    innen.addColorStop(0, "rgb(40,36,34)"); innen.addColorStop(1, "rgb(66,56,48)");
    g.fillStyle = innen; g.fillRect(fx, fy, w, h);
    if (px > 12) {
      const pV = parallaxe(F, B, tiefe + 0.2);
      const vf = hex(fo.vorhang || "#7a2e2a");
      for (const s of [0, 1]) {
        const vw = w * 0.2, vx = (s ? fx + w - vw : fx) + pV[0] - pT[0], vy = fy + pV[1] - pT[1];
        const gv = g.createLinearGradient(vx, 0, vx + vw, 0);
        for (let i = 0; i <= 6; i++) gv.addColorStop(i / 6, rgb(hell(vf, i % 2 ? -0.22 : 0.02)));
        g.fillStyle = gv;
        g.beginPath();
        if (s) { g.moveTo(vx + vw, vy); g.lineTo(vx, vy); g.quadraticCurveTo(vx + vw * 0.25, vy + h * 0.6, vx + vw * 0.55, vy + h + 0.1); g.lineTo(vx + vw, vy + h + 0.1); }
        else { g.moveTo(vx, vy); g.lineTo(vx + vw, vy); g.quadraticCurveTo(vx + vw * 0.75, vy + h * 0.6, vx + vw * 0.45, vy + h + 0.1); g.lineTo(vx, vy + h + 0.1); }
        g.closePath(); g.fill();
      }
      /* Scheibengardine unten */
      const sy0 = fy + h * 0.66;
      const gs = g.createLinearGradient(fx, 0, fx + w, 0);
      const nf = Math.max(3, Math.round(w / 0.07));
      for (let i = 0; i <= nf; i++) gs.addColorStop(i / nf, i % 2 ? "rgba(206,204,198,0.72)" : "rgba(240,239,234,0.78)");
      g.fillStyle = gs; g.fillRect(fx, sy0, w, fy + h - sy0);
    }
    if (fo.deko && px > 10) schwibbogen(g, F, fx + rb, fy + st + rb, w - 2 * rb, h - st - 2 * rb, false);
    /* Glas mit Himmelsspiegel */
    const nM = kreuz(F.flaeche.u, F.flaeche.v);
    const cosT = klemm(dot(B.e, nM), 0, 1);
    const anteil = (0.3 + 0.22 * Math.pow(1 - cosT, 1.5)) * (0.3 + 0.7 * tag);
    const himmel = (F.zeit && F.zeit.himmel) || ["#bcd3ea", "#e9f1f8"];
    const hO = misch(hex(himmel[0]), [190, 208, 230], tag * 0.6);
    const boden = (F.jahr === "winter" ? [206, 214, 226] : [104, 118, 104]).map((c) => c * (0.35 + 0.65 * tag));
    const sp = g.createLinearGradient(0, fy, 0, fy + h);
    sp.addColorStop(0, rgb(hO, anteil.toFixed(3))); sp.addColorStop(0.55, rgb(misch(hO, boden, 0.6), (anteil * 0.95).toFixed(3))); sp.addColorStop(1, rgb(boden, (anteil * 0.9).toFixed(3)));
    g.fillStyle = sp; g.fillRect(fx, fy, w, h);
    if (px > 9) { g.fillStyle = "rgba(255,255,255," + (0.07 + 0.1 * tag).toFixed(3) + ")"; g.beginPath(); g.moveTo(fx + w * 0.12, fy + h); g.lineTo(fx + w * 0.5, fy); g.lineTo(fx + w * 0.66, fy); g.lineTo(fx + w * 0.28, fy + h); g.closePath(); g.fill(); }
    /* Rahmen: Blendrahmen im Bogen, Kämpfer, zwei Flügel, Sprossen */
    const rahmen = hex(fo.rahmen || "#ebe4d4");
    const rf = rgb(rahmen), rd = rgb(hell(rahmen, -0.3));
    g.strokeStyle = rf; g.lineWidth = rb * 2; bogenPfad(g, fx, fy, w, h, st); g.stroke();
    const kz = fy + st + (fo.kaempfer == null ? h * 0.26 : fo.kaempfer);
    const leiste = (x0, y0, x1, y1, b) => {
      g.fillStyle = rf;
      if (Math.abs(x1 - x0) > Math.abs(y1 - y0)) { g.fillRect(x0, y0 - b / 2, x1 - x0, b); if (px > 14) { g.fillStyle = rd; g.fillRect(x0, y0 + b / 2 - b * 0.25, x1 - x0, b * 0.25); } }
      else { g.fillRect(x0 - b / 2, y0, b, y1 - y0); if (px > 14) { g.fillStyle = rd; g.fillRect(x0 + b / 2 - b * 0.22, y0, b * 0.22, y1 - y0); } }
    };
    if (!fo.ohneKaempfer) leiste(fx, kz, fx + w, kz, rb * 1.1);
    if (px > 6) {
      const fl = fo.fluegel || 2;
      for (let i = 1; i < fl; i++) leiste(fx + w * i / fl, fo.ohneKaempfer ? fy : kz, fx + w * i / fl, fy + h, rb);
      const sb = Math.max(rb * 0.4, 0.8 / px);
      const zeilen = fo.zeilen || 2;
      for (let k = 1; k < zeilen; k++) leiste(fx, kz + (fy + h - kz) * k / zeilen, fx + w, kz + (fy + h - kz) * k / zeilen, sb);
      /* Oberlicht: senkrechte Sprossen */
      if (!fo.ohneKaempfer) for (let k = 1; k < 4; k++) leiste(fx + w * k / 4, fy, fx + w * k / 4, kz, sb);
      if (px > 30) { g.fillStyle = "rgba(200,170,90,0.9)"; for (const s of [-1, 1]) g.fillRect(fx + w / 2 + s * rb * 1.2 - 0.008, kz + (fy + h - kz) * 0.45, 0.016, 0.06); }
    }
    g.restore();
    /* Schatten der Laibung */
    const sv = F.schatten(tiefe);
    g.fillStyle = "rgba(20,22,36,0.36)";
    if (sv) {
      g.beginPath(); g.rect(x - 1, y - 1, w + 2, h + 2);
      bogenPfadVersatz(g, x + sv[0], y + sv[1], w, h + 1, st);
      g.fill("evenodd");
    } else { g.fillStyle = "rgba(20,22,36,0.16)"; g.fillRect(x, y, w, h); }
    g.restore();
    /* Rollschicht, Schlussstein, Sohlbank */
    if (!fo.ohneSturz) bogenSturz(g, F, x, y, w, st, { winter: fo.winter });
    if (!fo.ohneBank) gesimsMalen(g, F, B, x - 0.1, x + w + 0.1, y + h, 0.12, 0.07, fo.winter);
  }
  function bogenPfadVersatz(g, x, y, w, h, st) {
    if (st <= 0.001) { g.rect(x, y, w, h); return; }
    const R = (w * w / 4 + st * st) / (2 * st), a = Math.asin(Math.min(1, (w / 2) / R));
    g.moveTo(x, y + h); g.lineTo(x, y + st); g.arc(x + w / 2, y + R, R, -Math.PI / 2 - a, -Math.PI / 2 + a); g.lineTo(x + w, y + h); g.closePath();
  }
  function bogenLicht(g, F, B, x, y, w, h, fo) {
    if (fo.leer || !fo.an) return;
    const a = F.nacht * fo.an;
    if (a <= 0.01) return;
    const st = fo.stich == null ? Math.min(0.2, w * 0.18) : fo.stich;
    const pT = parallaxe(F, B, fo.tiefe || 0.22);
    g.save(); bogenPfad(g, x, y, w, h, st); g.clip();
    const fx = x + pT[0], fy = y + pT[1];
    bogenPfad(g, fx, fy, w, h, st); g.clip();
    const farbe = fo.farbe || [255, 196, 118];
    const gr = g.createRadialGradient(fx + w / 2, fy + h * 0.8, 0, fx + w / 2, fy + h * 0.6, Math.max(w, h));
    gr.addColorStop(0, "rgba(255,230,176," + (0.95 * a).toFixed(3) + ")"); gr.addColorStop(0.6, "rgba(" + farbe.join(",") + "," + (0.82 * a).toFixed(3) + ")"); gr.addColorStop(1, "rgba(" + farbe.map((v) => (v * 0.55) | 0).join(",") + "," + (0.75 * a).toFixed(3) + ")");
    g.fillStyle = gr; g.fillRect(fx, fy, w, h);
    g.fillStyle = "rgba(140,56,36," + (0.45 * a).toFixed(3) + ")"; g.fillRect(fx, fy, w * 0.18, h); g.fillRect(fx + w * 0.82, fy, w * 0.18, h);
    if (fo.deko) schwibbogen(g, F, fx + 0.06, fy + st + 0.06, w - 0.12, h - st - 0.12, true);
    g.fillStyle = "rgba(46,32,24," + (0.9 * a).toFixed(3) + ")";
    const kz = fy + st + (fo.kaempfer == null ? h * 0.26 : fo.kaempfer);
    if (!fo.ohneKaempfer) g.fillRect(fx, kz - 0.03, w, 0.06);
    const fl = fo.fluegel || 2;
    for (let i = 1; i < fl; i++) g.fillRect(fx + w * i / fl - 0.03, fo.ohneKaempfer ? fy : kz, 0.06, h);
    const zeilen = fo.zeilen || 2;
    for (let k = 1; k < zeilen; k++) g.fillRect(fx, kz + (fy + h - kz) * k / zeilen - 0.012, w, 0.024);
    g.restore();
    F.leuchtPunkt(x + w / 2, y + h * 0.55, Math.max(w, h) * 1.2, farbe.join(","), 0.5 * fo.an);
  }
  /* Zweiflügelige Tür mit Glasfüllungen, Oberlicht im Bogen */
  function bogenTuer(g, F, B, x, y, w, h, T) {
    const px = F.px, st = T.stich == null ? Math.min(0.22, w * 0.16) : T.stich;
    const tiefe = 0.24, pT = parallaxe(F, B, tiefe);
    const lb = [196, 184, 166];
    g.save(); bogenPfad(g, x, y, w, h, st); g.clip();
    g.fillStyle = rgb(hell(lb, -0.08)); g.fillRect(x - 0.1, y - 0.1, w + 0.2, h + 0.2);
    const u = F.flaeche.u;
    if (pT[0] > 0) { g.fillStyle = malVerh(lb, lichtVerh(F, B, u)); poly(g, [[x, y], [x + pT[0], y + pT[1]], [x + pT[0], y + h + pT[1]], [x, y + h]]); g.fill(); }
    if (pT[0] < 0) { g.fillStyle = malVerh(lb, lichtVerh(F, B, mul(u, -1))); poly(g, [[x + w, y], [x + w + pT[0], y + pT[1]], [x + w + pT[0], y + h + pT[1]], [x + w, y + h]]); g.fill(); }
    g.translate(pT[0], pT[1]);
    if (T.leer) { g.fillStyle = "rgb(28,24,22)"; g.fillRect(x, y, w, h); g.restore(); return; }
    const f = T.farbe || GRUEN;
    const oz = y + st + 0.34;                  // Unterkante Oberlicht
    /* Oberlicht */
    g.fillStyle = "rgb(40,46,56)"; g.fillRect(x, y, w, oz - y);
    const tag = 1 - F.nacht;
    g.fillStyle = "rgba(190,208,230," + (0.35 * tag + 0.1).toFixed(3) + ")"; g.fillRect(x, y, w, oz - y);
    g.fillStyle = rgb(CREME);
    for (let k = 1; k < 5; k++) g.fillRect(x + w * k / 5 - 0.012, y, 0.024, oz - y);
    g.fillRect(x, oz - 0.05, w, 0.06);
    /* Flügel: unten Füllung, oben Glas */
    const fl = w > 1.1 ? 2 : 1;
    for (let i = 0; i < fl; i++) {
      const fx = x + w * i / fl, fw = w / fl;
      g.fillStyle = rgb(f); g.fillRect(fx, oz, fw, y + h - oz);
      g.fillStyle = "rgba(255,255,255,0.08)"; g.fillRect(fx, oz, fw * 0.12, y + h - oz);
      const gl = 0.1;
      const gy0 = oz + 0.12, gy1 = oz + (y + h - oz) * 0.55;
      g.fillStyle = "rgb(36,40,48)"; g.fillRect(fx + gl, gy0, fw - 2 * gl, gy1 - gy0);
      g.fillStyle = "rgba(190,208,230," + (0.3 * tag + 0.08).toFixed(3) + ")"; g.fillRect(fx + gl, gy0, fw - 2 * gl, gy1 - gy0);
      if (px > 12) {
        g.fillStyle = rgb(f); g.fillRect(fx + fw / 2 - 0.015, gy0, 0.03, gy1 - gy0);
        /* Kassette unten */
        g.strokeStyle = rgb(hell(f, -0.35)); g.lineWidth = Math.max(0.01, 1 / px);
        g.strokeRect(fx + gl, gy1 + 0.1, fw - 2 * gl, y + h - gy1 - 0.25);
        g.strokeStyle = rgb(hell(f, 0.2)); g.strokeRect(fx + gl + 0.012, gy1 + 0.112, fw - 2 * gl, y + h - gy1 - 0.25);
      }
      g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(fx + fw - 0.01, oz, 0.01, y + h - oz);
    }
    /* Drücker aus Messing */
    if (px > 16) { g.fillStyle = "rgb(214,178,96)"; const kx = fl === 2 ? x + w / 2 - 0.1 : x + w - 0.12; g.fillRect(kx, oz + (y + h - oz) * 0.58, 0.09, 0.018); g.fillRect(kx + 0.03, oz + (y + h - oz) * 0.56, 0.02, 0.07); }
    rausch(g, x, y, w, h, 0.9, 0.18, 12, 3);
    if (T.kranz && T.winter && px > 8) {
      const cx = x + w / 2, cy = oz + (y + h - oz) * 0.3;
      kranz(g, cx, cy, Math.min(0.22, w * 0.18));
    }
    g.restore();
    const sv = F.schatten(tiefe);
    if (sv) { g.fillStyle = "rgba(20,15,22,0.36)"; g.beginPath(); g.rect(x - 1, y - 1, w + 2, h + 2); bogenPfadVersatz(g, x + sv[0], y + sv[1], w, h + 1, st); g.save(); bogenPfad(g, x, y, w, h, st); g.clip(); g.beginPath(); g.rect(x - 1, y - 1, w + 2, h + 2); bogenPfadVersatz(g, x + sv[0], y + sv[1], w, h + 1, st); g.fill("evenodd"); g.restore(); }
    bogenSturz(g, F, x, y, w, st, { winter: T.winter });
  }
  function kranz(g, cx, cy, r) {
    const rng = zufall(77);
    for (let i = 0; i < 50; i++) {
      const a = rng() * TAU, rr = r * (0.7 + rng() * 0.35);
      g.fillStyle = rgb([28 + rng() * 20, 66 + rng() * 22, 40]);
      g.beginPath(); g.ellipse(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, r * 0.16, r * 0.065, a + 1.4, 0, TAU); g.fill();
    }
    for (let i = 0; i < 6; i++) { const a = i * TAU / 6 + 0.3; g.fillStyle = i % 2 ? "#b8182c" : "#d8a640"; g.beginPath(); g.arc(cx + Math.cos(a) * r * 0.85, cy + Math.sin(a) * r * 0.85, r * 0.09, 0, TAU); g.fill(); }
    g.fillStyle = "#b3122a";
    const by = cy + r * 0.9;
    g.beginPath(); g.moveTo(cx, by); g.quadraticCurveTo(cx - r * 0.4, by - r * 0.3, cx - r * 0.36, by + r * 0.12); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(cx, by); g.quadraticCurveTo(cx + r * 0.4, by - r * 0.3, cx + r * 0.36, by + r * 0.12); g.closePath(); g.fill();
  }

  /* =====================================================================
     FACHWERK DES OBERGESCHOSSES (Ziegelausfachung)
     Plan nach den Fenstern: Ständer neben jedem Fenster, Brust- und
     Sturzriegel, dazwischen Streben und Andreaskreuze, an den Ecken
     Fußstreben. Wandkoordinaten a (entlang), z (Höhe).
     ===================================================================== */
  function fwPlan(L, z0, z1, fenster, opt) {
    opt = opt || {};
    const H = [], FE = [];
    const holz = (a0, h0, a1, h1, b, art) => H.push({ p0: [a0, h0], p1: [a1, h1], b: b, art: art });
    const zS = z0 + 0.2, zR = z1 - 0.18;
    holz(-0.02, z0 + 0.1, L + 0.02, z0 + 0.1, 0.2, "schwelle");
    holz(-0.02, z1 - 0.09, L + 0.02, z1 - 0.09, 0.18, "raehm");
    const zB = zS + (opt.bruestung || 0.72), fh = opt.fensterH || 1.3;
    const staender = [0.1, L - 0.1];
    for (const f of fenster) {
      const a0 = f.a - f.w / 2, a1 = f.a + f.w / 2;
      staender.push(a0 - 0.085, a1 + 0.085);
      holz(a0 - 0.02, zB - 0.065, a1 + 0.02, zB - 0.065, 0.13, "riegel");
      holz(a0 - 0.02, zB + fh + 0.065, a1 + 0.02, zB + fh + 0.065, 0.13, "riegel");
      FE.push({ a: a0, z: zB, w: f.w, h: fh });
      if (f.kreuz) { holz(a0 + 0.03, zS + 0.03, a1 - 0.03, zB - 0.13, 0.11, "strebe"); holz(a1 - 0.03, zS + 0.03, a0 + 0.03, zB - 0.13, 0.11, "strebe"); }
    }
    staender.sort((a, b) => a - b);
    for (const a of staender) holz(a, zS - 0.02, a, zR + 0.02, a < 0.2 || a > L - 0.2 ? 0.2 : 0.17, "staender");
    /* Felder zwischen den Ständern ohne Fenster */
    for (let i = 0; i + 1 < staender.length; i++) {
      const aL = staender[i] + 0.09, aR = staender[i + 1] - 0.09;
      if (aR - aL < 0.35) continue;
      const mitFenster = fenster.some((f) => f.a > aL && f.a < aR);
      if (mitFenster) continue;
      const zM = (zS + zR) / 2;
      holz(aL - 0.02, zM, aR + 0.02, zM, 0.13, "riegel");
      if (i === 0) { holz(aL, zS + 1.5, aL + Math.min(0.9, aR - aL), zS + 0.02, 0.15, "strebe"); }
      else if (i === staender.length - 2) { holz(aR, zS + 1.5, aR - Math.min(0.9, aR - aL), zS + 0.02, 0.15, "strebe"); }
      else if (aR - aL > 0.7) {
        /* Andreaskreuz unten, Feuerbock oben */
        holz(aL + 0.02, zS + 0.02, aR - 0.02, zM - 0.07, 0.12, "strebe"); holz(aR - 0.02, zS + 0.02, aL + 0.02, zM - 0.07, 0.12, "strebe");
        holz(aL + 0.02, zM + 0.07, (aL + aR) / 2, zR - 0.02, 0.12, "strebe"); holz(aR - 0.02, zM + 0.07, (aL + aR) / 2, zR - 0.02, 0.12, "strebe");
      } else holz(aL + 0.02, zS + 0.02, aR - 0.02, zR - 0.02, 0.13, "strebe");
    }
    return { H: H, F: FE };
  }
  /* Giebeldreieck: Kehlriegel, Ständer, Streben, Fensterpaar oder Uhr */
  function fwGiebelPlan(L, zU, zO, opt) {
    opt = opt || {};
    const H = [], FE = [];
    const holz = (a0, h0, a1, h1, b, art) => H.push({ p0: [a0, h0], p1: [a1, h1], b: b, art: art });
    const m = L / 2, hG = zO - zU, st = hG / m;
    const dach = (a) => zO - Math.abs(a - m) * st;
    holz(-0.02, zU - 0.1, L + 0.02, zU - 0.1, 0.2, "schwelle");
    const off = 0.09 * Math.hypot(1, st);
    holz(0, zU - off, m, zO - off, 0.18, "ortsparren");
    holz(L, zU - off, m, zO - off, 0.18, "ortsparren");
    if (opt.uhr) {
      /* Zwerchgiebel: Ständer seitlich der Uhr, Riegel darunter, Kopfbänder */
      const r = opt.uhr;
      holz(m - r - 0.2, zU, m - r - 0.2, dach(m - r - 0.2) - 0.05, 0.15, "staender");
      holz(m + r + 0.2, zU, m + r + 0.2, dach(m + r + 0.2) - 0.05, 0.15, "staender");
      holz(0.25, zU + 0.45, m - r - 0.25, zU + 0.45, 0.12, "riegel");
      holz(L - 0.25, zU + 0.45, m + r + 0.25, zU + 0.45, 0.12, "riegel");
      holz(m - r - 0.25, zU + 0.05, 0.35, zU + 0.42, 0.12, "strebe");
      holz(m + r + 0.25, zU + 0.05, L - 0.35, zU + 0.42, 0.12, "strebe");
      return { H: H, F: FE };
    }
    const zK = zU + hG * 0.42;
    const fw = opt.fensterW || 0.62, fh = opt.fensterH || 0.95, fz = zU + 0.55;
    for (const a of [m - fw - 0.2, m + fw + 0.2, m]) if (dach(a) - zU > 0.5) holz(a, zU, a, dach(a) - 0.05, 0.16, "staender");
    holz(0.4, zK, L - 0.4, zK, 0.13, "riegel");
    holz(m - fw - 0.1, fz - 0.065, m + fw + 0.1, fz - 0.065, 0.13, "riegel");
    for (const s of [-1, 1]) {
      const a0 = m + s * (fw + 0.2);
      holz(a0 + s * 0.08, zU + 0.05, a0 + s * Math.min(1.2, m - fw - 0.5), zK - 0.07, 0.12, "strebe");
      holz(a0 + s * 0.08, zK + 0.07, a0 + s * 0.7, Math.min(dach(a0 + s * 0.7) - 0.1, zK + 0.9), 0.12, "strebe");
    }
    FE.push({ a: m - fw - 0.12, z: fz, w: fw, h: fh }, { a: m + 0.12, z: fz, w: fw, h: fh });
    /* Ochsenauge in der Spitze */
    if (hG > 3) FE.push({ a: m - 0.2, z: zO - 1.15, w: 0.4, h: 0.4, rund: true });
    return { H: H, F: FE };
  }
  /* Ausfachung aus Ziegeln (kleinformatig, im Läuferverband) */
  function ausfachungMalen(g, F, x, y, w, h, saat, lehm) {
    if (lehm) {
      g.fillStyle = "rgb(176,148,112)"; g.fillRect(x, y, w, h);
      rausch(g, x, y, w, h, 1.2, 0.3, saat, 3);
      return;
    }
    backsteinMalen(g, F, x, y, w, h, { saat: saat + 30 });
    g.fillStyle = "rgba(255,240,230,0.06)"; g.fillRect(x, y, w, h);
  }

  /* =====================================================================
     DIE WÄNDE DES EMPFANGSGEBÄUDES
     Jede Wand ist eine Fläche: Sockel, Backstein-Erdgeschoss, Gurtgesims,
     Fachwerk-Obergeschoss, Giebel. Öffnungen nach Mitte (Wandkoordinate a).
     ===================================================================== */
  const FEN_EG = { w: 1.1, h: 2.15, z: 1.4 };
  const FEN_OG = { w: 0.86, h: 1.25 };
  const WAENDE = (function () {
    const gleis = {
      name: "gleis", n: [0, -1, 0], o: [HX1, HY0, QZ], L: HX1 - HX0, top: QZ, zU: ZB, saat: 21, ax: (x) => HX1 - x,
      egF: [-6.5, -4.9, 0.15].map((x) => HX1 - x),
      tueren: [{ a: HX1 - QX, w: 1.5, h: 2.85, haupt: true, schild: "Wartesaal" }, { a: HX1 - 1.85, w: 1.0, h: 2.6, schild: "Dienstraum" }],
      ogF: [-6.5, -4.9, -2.9, -1.1, 0.15, 1.85].map((x) => HX1 - x),
      zwerch: true
    };
    const strasse = {
      name: "strasse", n: [0, 1, 0], o: [HX0, HY1, TR], L: HX1 - HX0, top: TR, zU: 0, saat: 22, ax: (x) => x - HX0, sockel: true,
      egF: [-6.3, -4.7, 0.7, 2.3].map((x) => x - HX0),
      tueren: [{ a: QX - HX0, w: 1.6, h: 2.9, haupt: true, strasse: true }],
      ogF: [-6.3, -4.7, -2.9, -1.1, 0.7, 2.3].map((x) => x - HX0),
      name2: true
    };
    const west = {
      name: "west", n: [-1, 0, 0], o: [HX0, HY0, GZ], L: HY1 - HY0, top: GZ, zU: 0, saat: 23, sockel: true, giebel: true,
      egF: [1.9, 5.6], tueren: [], ogF: [1.9, 5.6]
    };
    const ost = {
      name: "ost", n: [1, 0, 0], o: [HX1, HY1, GZ], L: HY1 - HY0, top: GZ, zU: 0, saat: 24, sockel: true, giebel: true,
      egF: [], tueren: [], ogF: [1.2, 6.2]
    };
    for (const W of [gleis, strasse, west, ost]) {
      W.fw = fwPlan(W.L, EG1 + 0.15, OG1, W.ogF.map((a, i) => ({ a: a, w: FEN_OG.w, kreuz: i % 2 === 0 })), { bruestung: 0.62, fensterH: FEN_OG.h });
      if (W.giebel) W.gp = fwGiebelPlan(W.L, TR, GZ, {});
      if (W.zwerch) W.gp = fwGiebelPlan(2 * QB, TR, QZ, { uhr: 0.4 });
    }
    return [gleis, strasse, west, ost];
  })();
  /* Uhr tief im Zwerchgiebel, damit der Ortgang sie von oben nicht verdeckt */
  const UHR_Z = TR + 0.53, UHR_R = 0.4;
  function wandUmriss(W) {
    const t = W.top;
    if (W.zwerch) {
      const aR = HX1 - (QX + QB), aL = HX1 - (QX - QB), aM = HX1 - QX;
      return [[0, t - TR], [aR, t - TR], [aM, 0], [aL, t - TR], [W.L, t - TR], [W.L, t - W.zU], [0, t - W.zU]];
    }
    if (W.giebel) return [[0, t - TR], [W.L / 2, 0], [W.L, t - TR], [W.L, t - W.zU], [0, t - W.zU]];
    return [[0, 0], [W.L, 0], [W.L, t - W.zU], [0, t - W.zU]];
  }
  function fensterArtB(W, i, S, Z, og) {
    const h = ST.hash2(W.saat * 13 + i, 5, S.saat);
    return {
      leer: !Z.fenster, winter: S.winter && Z.fertig,
      vorhang: og ? (h < 0.5 ? "#6e3a2c" : "#3e5a46") : "#7a2e2a",
      an: Z.fertig ? (og ? (h < 0.55 ? 0.9 : 0) : (W.name === "gleis" || W.name === "strasse" ? 1 : 0.7)) : 0,
      deko: S.winter && Z.fertig && og && h > 0.3 && h < 0.85
    };
  }
  function hausWandMaler(W, B, S, Z, teil) {
    return function (g, F) {
      const w = F.w, t = W.top, px = F.px, winter = S.winter;
      const yz = (z) => t - z;                       // Flächen-y einer Höhe
      const zBis = Z.mauerZ;                          // bis wohin gemauert ist
      g.save();
      /* ---- Obergeschoss und Giebel: Fachwerk mit Ziegelausfachung ---- */
      if (Z.fw > 0 && teil !== "eg") {
        const zo = Math.min(t, Z.fwZ);
        g.save(); g.beginPath(); g.rect(-0.2, yz(zo), w + 0.4, zo - EG1 + 0.2); g.clip();
        /* ohne Ausfachung bleibt das Gefach offen (man sieht hindurch) */
        if (Z.ausfachung > 0) ausfachungMalen(g, F, -0.05, yz(zo) - 0.05, w + 0.1, zo - EG1 + 0.1, W.saat, false);
        /* Fenster im Obergeschoss (schlicht, weiß, im Holzrahmen) */
        if (Z.ausfachung > 0) {
          for (let i = 0; i < W.fw.F.length; i++) {
            const fe = W.fw.F[i];
            const fo = Object.assign(fensterArtB(W, i, S, Z, true), { stich: 0, ohneSturz: true, ohneBank: true, tiefe: 0.1, kaempfer: 0.34, zeilen: 2 });
            bogenFenster(g, F, B, fe.a, yz(fe.z + fe.h), fe.w, fe.h, fo);
            if (!fo.leer && px > 8) {
              /* Sohlbrett, im Winter mit Schnee; im Frühling Blumenkasten */
              g.fillStyle = rgb(CREME); g.fillRect(fe.a - 0.05, yz(fe.z) - 0.01, fe.w + 0.1, 0.05);
              if (winter) { g.fillStyle = "rgb(244,247,252)"; PI.rundRechteck(g, fe.a - 0.06, yz(fe.z) - 0.04, fe.w + 0.12, 0.05, 0.02); g.fill(); }
              else if (Z.fertig && (i + W.saat) % 2 === 0) blumenkasten(g, fe.a, yz(fe.z), fe.w, W.saat + i);
            }
          }
          if (W.gp) for (let i = 0; i < W.gp.F.length; i++) {
            const fe = W.gp.F[i];
            if (fe.rund) { rundFenster(g, F, fe.a + fe.w / 2, yz(fe.z + fe.h / 2), fe.w / 2, Z); continue; }
            const fo = Object.assign(fensterArtB(W, 50 + i, S, Z, true), { stich: 0, ohneSturz: true, ohneBank: true, tiefe: 0.1, kaempfer: 0.3, zeilen: 2, fluegel: 1 });
            bogenFenster(g, F, B, fe.a, yz(fe.z + fe.h), fe.w, fe.h, fo);
          }
          /* die Uhr kommt mit den Fenstern; vorher nur die runde Öffnung */
          if (W.zwerch) { if (Z.fenster) uhrMalen(g, F, HX1 - QX, yz(UHR_Z), UHR_R, Z, S); else rundFenster(g, F, HX1 - QX, yz(UHR_Z), UHR_R, Z); }
        }
        const H = W.fw.H.concat(W.gp ? (W.zwerch ? W.gp.H.map((m) => ({ p0: [m.p0[0] + (HX1 - (QX + QB)), m.p0[1]], p1: [m.p1[0] + (HX1 - (QX + QB)), m.p1[1]], b: m.b, art: m.art })) : W.gp.H) : []);
        const lf = Z.ausfachung > 0 ? [1, 1, 1] : ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
        hoelzerMalen(g, F, H.filter(Z.holzNur), t, [Z.holzC[0] * lf[0], Z.holzC[1] * lf[1], Z.holzC[2] * lf[2]], W.saat, { ohneSchatten: Z.ausfachung <= 0 });
        g.restore();
        /* Dachbalkenlage zwischen Obergeschoss und Traufe */
      }
      /* ---- Erdgeschoss: Sockel, Backstein, Öffnungen ---- */
      if (zBis > W.zU + 0.01 && teil !== "og") {
        const zS = W.sockel ? 0.95 : W.zU;
        const zTop = Math.min(EG1, zBis);
        g.save(); g.beginPath(); g.rect(-0.2, yz(zTop), w + 0.4, zTop - W.zU + 0.01); g.clip();
        if (W.sockel) {
          quaderMalen(g, F, 0, yz(Math.min(zS, zBis)), w, Math.min(zS, zBis), { farbe: SANDSTEIN, lage: 0.48, laenge: 0.9, saat: W.saat });
        }
        if (zTop > zS) {
          const baender = [[yz(FEN_EG.z) - 0.02, yz(FEN_EG.z) + 0.155], [yz(3.25), yz(3.1)]].map((b) => [Math.min(b[0], b[1]), Math.max(b[0], b[1])]);
          backsteinMalen(g, F, 0, yz(EG1), w, EG1 - zS, { saat: W.saat, bis: zTop - zS, baender: baender });
          /* Ecklisenen: 12 cm vorstehende Backsteinpfeiler an den Ecken */
          if (px > 6) for (const [x0, sgn] of [[0, 1], [w, -1]]) {
            const b = 0.4;
            const sv = F.schatten(0.12);
            if (sv) { g.fillStyle = "rgba(30,16,12,0.3)"; const xs = sgn > 0 ? x0 + b : x0 - b; g.fillRect(Math.min(xs, xs + sv[0]), yz(zTop), Math.abs(sv[0]) + 0.01, zTop - zS); }
            g.fillStyle = "rgba(255,230,210,0.07)"; g.fillRect(sgn > 0 ? x0 : x0 - b, yz(zTop), b, zTop - zS);
          }
        }
        if (W.sockel && zBis >= zS) gesimsMalen(g, F, B, -0.05, w + 0.05, yz(zS) - 0.06, 0.12, 0.06, winter && Z.fertig);
        for (let i = 0; i < W.egF.length; i++) {
          const a = W.egF[i];
          if (FEN_EG.z > zBis) continue;
          const fo = fensterArtB(W, i, S, Z, false);
          bogenFenster(g, F, B, a - FEN_EG.w / 2, yz(FEN_EG.z + FEN_EG.h), FEN_EG.w, FEN_EG.h, fo);
        }
        for (const T of W.tueren) {
          const zT = W.zU === 0 ? ZB : W.zU;
          bogenTuer(g, F, B, T.a - T.w / 2, yz(zT + T.h), T.w, T.h, { leer: !Z.tueren, winter: winter && Z.fertig, kranz: T.haupt, farbe: T.strasse ? [70, 44, 30] : GRUEN });
          if (T.schild && Z.fertig && px > 14) emailSchild(g, T.a, yz(zT + T.h) - 0.5, T.schild, 0.09);
        }
        if (W.name2 && Z.fertig) schriftBand(g, F, QX - HX0, yz(3.95), "WINTERHAUSEN", winter);
        if (W.name === "strasse" && Z.fertig && px > 6) { wandLampe(g, F, QX - HX0 + 1.15, yz(3.35), false); briefkasten(g, F, 1.6 + 7.5, yz(1.55)); }
        if (W.name === "gleis" && Z.fertig && px > 10) fahrplan(g, F, HX1 - (-3.4), yz(2.9), winter);
        /* Spritzwasser, Schneewehe */
        const gr = g.createLinearGradient(0, yz(W.zU), 0, yz(W.zU) - 0.6);
        gr.addColorStop(0, winter ? "rgba(60,64,80,0.22)" : "rgba(60,60,40,0.25)"); gr.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = gr; g.fillRect(0, yz(W.zU) - 0.6, w, 0.6);
        if (winter && Z.fertig && W.zU === 0) schneeWehe(g, w, yz(0), W.saat, W.tueren.length ? [W.tueren[0].a - 1.2, W.tueren[0].a + 1.2] : null);
        /* unter dem Bahnsteigdach: weniger Himmelslicht, die Wand wird nach oben dunkler */
        if (W.name === "gleis" && Z.vordach >= 0.7) {
          const gd = g.createLinearGradient(0, yz(VZW), 0, yz(ZB + 1.2));
          gd.addColorStop(0, "rgba(24,22,34,0.42)"); gd.addColorStop(1, "rgba(24,22,34,0.08)");
          g.fillStyle = gd; g.fillRect(-0.1, yz(VZW), w + 0.2, VZW - ZB);
        }
        g.restore();
      }
      /* ---- Gurtgesims zwischen den Geschossen ---- */
      if (zBis >= EG1 - 0.01 && teil !== "og") gesimsMalen(g, F, B, -0.08, w + 0.08, yz(EG1 + 0.15), 0.26, 0.1, winter && Z.fertig);
      /* ---- Schlagschatten von Bahnsteigdach und Güterschuppen ---- */
      schlagschatten(g, F, B, schattenKoerper("wand-" + W.name, Z));
      /* ---- Schatten der Traufe/des Ortgangs ---- */
      if (Z.dach && (W.giebel || W.zwerch) && teil !== "eg") {
        const sv = F.schatten(W.zwerch ? UE : OGV);
        if (sv) {
          const U = wandUmriss(W).filter((p) => p[1] < t - TR + 0.01);
          g.fillStyle = "rgba(30,34,60,0.24)";
          g.beginPath(); g.moveTo(U[0][0] - 1, U[0][1] - 1);
          for (const p of U) g.lineTo(p[0], p[1]);
          g.lineTo(U[U.length - 1][0] + 1, U[U.length - 1][1] - 1);
          for (let i = U.length - 1; i >= 0; i--) g.lineTo(U[i][0] + sv[0], U[i][1] + sv[1] + 0.12);
          g.closePath(); g.fill();
        }
      }
      g.restore();
    };
  }
  function hausWandLeuchten(W, B, S, Z, teil) {
    return function (g, F0) {
      const t = W.top, yz = (z) => t - z;
      /* Lichtschein nur, wo das Auge hinsieht; unter dem Bahnsteigdach
         spart die Leuchtschicht den Umriss des Dachs aus */
      const F = gepruefterSchein(F0, B);
      g.save();
      if (W.name === "gleis" && teil === "eg") aussparen(g, F, B, schattenKoerper("wand-gleis"));
      if (teil === "eg") {
        for (let i = 0; i < W.egF.length; i++) {
          const a = W.egF[i];
          bogenLicht(g, F, B, a - FEN_EG.w / 2, yz(FEN_EG.z + FEN_EG.h), FEN_EG.w, FEN_EG.h, fensterArtB(W, i, S, Z, false));
        }
        for (const T of W.tueren) {
          /* Glas der Türen und des Oberlichts leuchtet warm */
          const zT = W.zU === 0 ? ZB : W.zU, x = T.a - T.w / 2, y = yz(zT + T.h);
          const a = F.nacht;
          g.fillStyle = "rgba(255,200,130," + (0.55 * a).toFixed(3) + ")";
          g.fillRect(x + 0.08, y + 0.05, T.w - 0.16, 0.34);
          F.leuchtPunkt(T.a, y + 0.6, 1.4, "255,196,120", 0.35);
        }
        if (W.name === "strasse") wandLampe(g, F, QX - HX0 + 1.15, yz(3.35), true);
      } else {
        for (let i = 0; i < W.fw.F.length; i++) {
          const fe = W.fw.F[i];
          bogenLicht(g, F, B, fe.a, yz(fe.z + fe.h), fe.w, fe.h, Object.assign(fensterArtB(W, i, S, Z, true), { stich: 0, tiefe: 0.1, kaempfer: 0.34, zeilen: 2 }));
        }
        if (W.zwerch) uhrLicht(g, F, HX1 - QX, yz(UHR_Z), UHR_R);
      }
      g.restore();
    };
  }
  /* Bahnhofsuhr im Zwerchgiebel: Zifferblatt aus Email, Stundenstriche,
     gusseiserner Rahmen. Die Zeiger zeigen die echte Uhrzeit (lebendig). */
  function uhrMalen(g, F, cx, cy, r, Z, S) {
    g.fillStyle = "rgb(36,34,34)"; g.beginPath(); g.arc(cx, cy, r + 0.07, 0, TAU); g.fill();
    g.fillStyle = "rgb(140,120,70)"; g.beginPath(); g.arc(cx, cy, r + 0.035, 0, TAU); g.fill();
    const gr = g.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
    gr.addColorStop(0, "rgb(252,250,244)"); gr.addColorStop(1, "rgb(222,218,208)");
    g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill();
    if (F.px > 10) {
      g.fillStyle = "rgb(24,22,22)";
      for (let i = 0; i < 12; i++) { const a = i * TAU / 12; g.save(); g.translate(cx + Math.sin(a) * r * 0.8, cy - Math.cos(a) * r * 0.8); g.rotate(a); g.fillRect(-0.014, -0.05, 0.028, i % 3 === 0 ? 0.12 : 0.08); g.restore(); }
      if (F.px > 40) for (let i = 0; i < 60; i++) { if (i % 5 === 0) continue; const a = i * TAU / 60; g.fillRect(cx + Math.sin(a) * r * 0.86 - 0.004, cy - Math.cos(a) * r * 0.86 - 0.004, 0.008, 0.008); }
    }
    if (!Z.lebend) uhrZeiger(g, cx, cy, r, 10 + 10 / 60, "rgb(20,18,18)");
    if (S.winter && Z.fertig) { g.fillStyle = "rgba(244,247,252,0.95)"; g.beginPath(); g.ellipse(cx, cy - r - 0.06, r * 0.7, 0.04, 0, 0, TAU); g.fill(); }
  }
  function uhrZeiger(g, cx, cy, r, std, farbe) {
    const aH = std / 12 * TAU, aM = (std % 1) * TAU;
    g.fillStyle = farbe;
    for (const [a, l, b] of [[aH, 0.52, 0.05], [aM, 0.78, 0.035]]) {
      g.save(); g.translate(cx, cy); g.rotate(a);
      g.beginPath(); g.moveTo(-b / 2 * r / 0.42, 0.1 * r); g.lineTo(-b * 0.35 * r / 0.42, -l * r); g.lineTo(b * 0.35 * r / 0.42, -l * r); g.lineTo(b / 2 * r / 0.42, 0.1 * r); g.closePath(); g.fill();
      g.restore();
    }
    g.beginPath(); g.arc(cx, cy, 0.025, 0, TAU); g.fill();
  }
  function uhrLicht(g, F, cx, cy, r) {
    const a = F.nacht;
    if (a <= 0) return;
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, r);
    gr.addColorStop(0, "rgba(255,246,214," + (0.85 * a).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,226,170," + (0.6 * a).toFixed(3) + ")");
    g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill();
    g.fillStyle = "rgba(24,22,22," + (0.9 * a).toFixed(3) + ")";
    for (let i = 0; i < 12; i++) { const w = i * TAU / 12; g.save(); g.translate(cx + Math.sin(w) * r * 0.8, cy - Math.cos(w) * r * 0.8); g.rotate(w); g.fillRect(-0.014, -0.05, 0.028, i % 3 === 0 ? 0.12 : 0.08); g.restore(); }
    F.leuchtPunkt(cx, cy, 1.4, "255,236,190", 0.45);
  }
  function uhrzeit() { const d = new Date(); return (d.getHours() % 12) + d.getMinutes() / 60 + d.getSeconds() / 3600; }
  function rundFenster(g, F, cx, cy, r, Z) {
    g.fillStyle = rgb(SANDSTEIN); g.beginPath(); g.arc(cx, cy, r + 0.08, 0, TAU); g.fill();
    g.fillStyle = Z.fenster ? "rgb(44,50,60)" : "rgb(26,22,20)"; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill();
    if (Z.fenster) { g.strokeStyle = rgb(CREME); g.lineWidth = 0.035; g.beginPath(); g.moveTo(cx - r, cy); g.lineTo(cx + r, cy); g.moveTo(cx, cy - r); g.lineTo(cx, cy + r); g.stroke(); g.beginPath(); g.arc(cx, cy, r - 0.015, 0, TAU); g.stroke(); }
  }
  /* Emailschild: weiße Schrift auf Blau (Wartesaal, Dienstraum) */
  function emailSchild(g, cx, y, text, hs) {
    const w = text.length * hs * 0.62 + 0.14, h = hs * 1.7;
    g.fillStyle = "rgba(0,0,0,0.25)"; PI.rundRechteck(g, cx - w / 2 + 0.015, y + 0.015, w, h, 0.02); g.fill();
    g.fillStyle = "rgb(28,52,110)"; PI.rundRechteck(g, cx - w / 2, y, w, h, 0.02); g.fill();
    g.strokeStyle = "rgba(240,240,240,0.9)"; g.lineWidth = 0.012; PI.rundRechteck(g, cx - w / 2 + 0.02, y + 0.02, w - 0.04, h - 0.04, 0.012); g.stroke();
    g.fillStyle = "rgb(248,248,248)"; g.font = "bold " + hs + "px Georgia, 'Times New Roman', serif"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(text, cx, y + h / 2 + 0.005);
  }
  /* Schriftband aus Sandstein mit dem Ortsnamen (Straßenseite) */
  function schriftBand(g, F, cx, y, text, winter) {
    const w = 3.6, h = 0.34;
    g.fillStyle = rgb(hell(SANDSTEIN, 0.05)); g.fillRect(cx - w / 2, y, w, h);
    g.strokeStyle = rgb(hell(SANDSTEIN, -0.25)); g.lineWidth = 0.02; g.strokeRect(cx - w / 2 + 0.04, y + 0.04, w - 0.08, h - 0.08);
    if (F.px > 8) {
      g.font = "bold 0.2px Georgia, 'Times New Roman', serif"; g.textAlign = "center"; g.textBaseline = "middle";
      if (g.letterSpacing !== undefined) g.letterSpacing = "0.04px";
      g.fillStyle = "rgba(255,255,255,0.35)"; g.fillText(text, cx - 0.008, y + h / 2 - 0.008);
      g.fillStyle = "rgb(56,40,30)"; g.fillText(text, cx, y + h / 2);
      if (g.letterSpacing !== undefined) g.letterSpacing = "0px";
    }
    if (winter) { g.fillStyle = "rgba(244,247,252,0.95)"; g.fillRect(cx - w / 2, y - 0.02, w, 0.04); }
  }
  function wandLampe(g, F, x, y, leuchten) {
    if (leuchten) {
      if (F.nacht <= 0) return;
      const gg = g.createRadialGradient(x, y + 0.22, 0, x, y + 0.22, 0.16);
      gg.addColorStop(0, "rgba(255,240,196," + F.nacht + ")"); gg.addColorStop(1, "rgba(255,180,90,0)");
      g.fillStyle = gg; g.fillRect(x - 0.17, y + 0.05, 0.34, 0.34);
      F.leuchtPunkt(x, y + 0.22, 2.4, "255,196,120", 0.7, true);
      return;
    }
    g.strokeStyle = "#1e1c1c"; g.lineWidth = 0.025;
    g.beginPath(); g.moveTo(x - 0.25, y); g.quadraticCurveTo(x - 0.1, y - 0.12, x, y - 0.02); g.stroke();
    g.fillStyle = "#1e1c1c"; g.beginPath(); g.moveTo(x - 0.11, y + 0.05); g.lineTo(x + 0.11, y + 0.05); g.lineTo(x, y - 0.04); g.closePath(); g.fill();
    g.fillStyle = "rgba(250,236,190,0.9)"; g.fillRect(x - 0.075, y + 0.06, 0.15, 0.28);
    g.strokeStyle = "#1e1c1c"; g.lineWidth = 0.014; g.strokeRect(x - 0.08, y + 0.055, 0.16, 0.29);
    g.fillStyle = "#1e1c1c"; g.fillRect(x - 0.1, y + 0.34, 0.2, 0.03);
  }
  function briefkasten(g, F, x, y) {
    g.fillStyle = "rgba(0,0,0,0.3)"; PI.rundRechteck(g, x + 0.02, y + 0.02, 0.34, 0.46, 0.04); g.fill();
    g.fillStyle = "rgb(30,58,120)"; PI.rundRechteck(g, x, y, 0.34, 0.46, 0.04); g.fill();
    g.fillStyle = "rgb(20,20,24)"; g.fillRect(x + 0.06, y + 0.1, 0.22, 0.03);
    g.fillStyle = "rgb(214,178,96)"; g.beginPath(); g.arc(x + 0.17, y + 0.28, 0.045, 0, TAU); g.fill();
    g.fillStyle = "rgba(255,255,255,0.18)"; g.fillRect(x + 0.03, y + 0.03, 0.05, 0.4);
  }
  /* Aushangfahrplan hinter Glas, gelbes Blatt */
  function fahrplan(g, F, x, y, winter) {
    g.fillStyle = "rgb(64,42,30)"; g.fillRect(x - 0.3, y, 0.6, 0.8);
    g.fillStyle = "rgb(236,222,168)"; g.fillRect(x - 0.25, y + 0.05, 0.5, 0.7);
    g.fillStyle = "rgb(40,36,30)"; g.font = "bold 0.05px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "top";
    if (F.px > 50) g.fillText("Abfahrt", x, y + 0.08);
    g.fillStyle = "rgba(40,36,30,0.55)";
    for (let i = 0; i < 9; i++) g.fillRect(x - 0.21, y + 0.16 + i * 0.06, 0.42 * (0.6 + ((i * 7) % 4) * 0.1), 0.012);
    g.fillStyle = "rgba(255,255,255,0.2)"; g.beginPath(); g.moveTo(x - 0.25, y + 0.75); g.lineTo(x - 0.05, y + 0.05); g.lineTo(x + 0.05, y + 0.05); g.lineTo(x - 0.15, y + 0.75); g.closePath(); g.fill();
    if (winter) { g.fillStyle = "rgb(244,247,252)"; g.fillRect(x - 0.32, y - 0.02, 0.64, 0.035); }
  }
  function schneeWehe(g, w, yB, saat, luecke) {
    const hoch = (x) => 0.18 + 0.1 * Math.sin(x * 1.3 + saat) + 0.05 * Math.sin(x * 3.7 + saat * 2);
    g.beginPath(); g.moveTo(-0.05, yB + 0.05);
    for (let x = -0.05; x <= w + 0.05; x += 0.1) { let hh = hoch(x); if (luecke && x > luecke[0] && x < luecke[1]) hh = 0.03; g.lineTo(x, yB - hh); }
    g.lineTo(w + 0.05, yB + 0.05); g.closePath();
    const gr = g.createLinearGradient(0, yB - 0.3, 0, yB);
    gr.addColorStop(0, "rgb(248,250,254)"); gr.addColorStop(1, "rgb(226,234,246)");
    g.fillStyle = gr; g.fill();
  }
  function blumenkasten(g, x, y, w, saat) {
    const rng = zufall(saat * 17 + 3);
    for (let i = 0; i < w * 24; i++) { g.fillStyle = rgb(PI.streu([62, 112, 46], rng, 0.2)); g.beginPath(); g.arc(x + 0.04 + rng() * (w - 0.08), y - rng() * 0.15, 0.034, 0, TAU); g.fill(); }
    for (let i = 0; i < w * 8; i++) { const cx = x + 0.06 + rng() * (w - 0.12), cy = y - 0.08 - rng() * 0.13; g.fillStyle = rng() < 0.6 ? "#cf2233" : "#f0f0f0"; g.beginPath(); g.arc(cx, cy, 0.026, 0, TAU); g.fill(); }
    g.fillStyle = "#4a3624"; g.fillRect(x - 0.02, y - 0.02, w + 0.04, 0.16);
  }

  /* =====================================================================
     DACHDECKUNGEN
     ===================================================================== */
  /* Schiefer in Schuppendeckung: Reihen runder Schuppen, bläulich-grau,
     gebündelt nach Farbeimern. x entlang der Traufe, y vom First (0). */
  const SB_ = 0.2;
  function schieferMalen(g, F, x0, x1, yTraufe, yOben, saat, opt) {
    opt = opt || {};
    const px = F.px, basis = opt.farbe || SCHIEFER, w = x1 - x0;
    g.fillStyle = rgb(hell(basis, -0.4)); g.fillRect(x0 - 0.05, yOben - 0.05, w + 0.1, yTraufe - yOben + 0.1);
    if (px * ZR_ < 2.4) {
      const rng = zufall(saat);
      for (let yy = yTraufe; yy > yOben - ZR_; yy -= ZR_) { g.fillStyle = rgb(PI.streu(basis, rng, 0.06)); g.fillRect(x0 - 0.05, yy - ZR_, w + 0.1, ZR_ * 0.78); }
      rausch(g, x0, yOben, w, yTraufe - yOben, 3.5, 0.2, saat + 5, 3);
      return;
    }
    const NE = 6;
    const TOENE = [[74, 80, 94], [66, 72, 86], [82, 86, 98], [70, 72, 84], [60, 66, 80], [88, 90, 100]];
    for (let k = 0; ; k++) {
      const yu = yTraufe - k * ZR_;
      if (yu < yOben - 0.02) break;
      if (opt.bisReihe != null && k > opt.bisReihe) break;
      const rr = zufall(saat * 31 + k * 7919);
      const vers = (k % 2) * SB_ / 2;
      const eimer = [];
      for (let i = 0; i < NE; i++) eimer.push([]);
      g.fillStyle = "rgba(10,12,20,0.35)";
      g.beginPath();
      for (let xx = x0 - SB_ + vers - 0.02; xx < x1 + SB_; xx += SB_) {
        const b = SB_ - 0.008, xa = xx + 0.004;
        g.moveTo(xa + 0.008, yu - ZR_); g.lineTo(xa + 0.008, yu - b * 0.4 + 0.014); g.quadraticCurveTo(xa + b / 2 + 0.008, yu + 0.02, xa + b + 0.008, yu - b * 0.4 + 0.014); g.lineTo(xa + b + 0.008, yu - ZR_); g.closePath();
        eimer[(rr() * NE) | 0].push(xa);
      }
      g.fill();
      for (let i = 0; i < NE; i++) {
        if (!eimer[i].length) continue;
        g.fillStyle = rgb(misch(TOENE[i], basis, 0.3));
        g.beginPath();
        const b = SB_ - 0.008, lang = 2.2 * ZR_;
        for (const xa of eimer[i]) { g.moveTo(xa, yu - lang); g.lineTo(xa, yu - b * 0.4); g.quadraticCurveTo(xa + b / 2, yu + 0.006, xa + b, yu - b * 0.4); g.lineTo(xa + b, yu - lang); g.closePath(); }
        g.fill();
      }
      if (px * SB_ > 9) {
        g.strokeStyle = "rgba(210,220,236,0.2)"; g.lineWidth = Math.max(0.004, 0.8 / px);
        g.beginPath();
        const b = SB_ - 0.008;
        for (let xx = x0 - SB_ + vers - 0.02; xx < x1 + SB_; xx += SB_) { const xa = xx + 0.004; g.moveTo(xa + 0.01, yu - b * 0.34); g.quadraticCurveTo(xa + b / 2, yu - 0.004, xa + b - 0.01, yu - b * 0.34); }
        g.stroke();
      }
    }
    rausch(g, x0, yOben, w, yTraufe - yOben, 4.2, 0.16, saat + 8, 4);
    bleich(g, x0, yOben, w, yTraufe - yOben, 2.6, 0.08, saat + 3);
  }
  /* Teerpappe mit Leisten (Güterschuppen) oder Zinkblech (Bahnsteigdach) */
  function pappeMalen(g, F, w, h, saat, zink) {
    if (zink) { zinkMalen(g, F, w, h, saat); return; }
    const c = [62, 64, 68];
    g.fillStyle = rgb(c); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
    rausch(g, 0, 0, w, h, 2.2, 0.25, saat, 3);
    if (F.px > 6) {
      const ab = 0.5;
      g.fillStyle = "rgba(120,124,130,0.55)"; g.beginPath(); for (let x = ab / 2; x < w; x += ab) g.rect(x - 0.02, -0.05, 0.03, h + 0.1); g.fill();
      g.fillStyle = "rgba(0,0,0,0.3)"; g.beginPath(); for (let x = ab / 2; x < w; x += ab) g.rect(x + 0.01, -0.05, 0.015, h + 0.1); g.fill();
    }
    bleich(g, 0, 0, w, h, 1.6, 0.08, saat + 2);
  }
  /* Zinkblech mit Stehfalzen (Bahnsteigdach): matt-grau, Bahnen mit
     leicht verschiedener Patina, Falze mit Licht- und Schattenkante,
     Laufspuren vom Regen, vorn die Rinne */
  function zinkMalen(g, F, w, h, saat) {
    const rng = zufall(saat);
    const bahn = 0.6;
    for (let x = 0; x < w; x += bahn) { g.fillStyle = rgb(PI.streu([128, 134, 138], rng, 0.04)); g.fillRect(x, -0.05, bahn + 0.01, h + 0.1); }
    rausch(g, 0, 0, w, h, 2.0, 0.16, saat, 3);
    /* Laufspuren zur Traufe hin */
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "rgba(255,255,255,0.06)"); gr.addColorStop(0.7, "rgba(60,66,70,0.05)"); gr.addColorStop(1, "rgba(50,56,60,0.22)");
    g.fillStyle = gr; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
    if (F.px > 10) {
      g.fillStyle = "rgba(70,74,78,0.18)";
      g.beginPath(); for (let i = 0; i < w * 3; i++) { const x = rng() * w, l = 0.3 + rng() * 1.2; g.rect(x, h - l, 0.02 + rng() * 0.04, l); } g.fill();
    }
    if (F.px > 5) {
      const d = Math.max(0.012, 0.9 / F.px);
      g.fillStyle = "rgba(236,240,242,0.55)"; g.beginPath(); for (let x = bahn; x < w; x += bahn) g.rect(x - d, -0.05, d, h + 0.1); g.fill();
      g.fillStyle = "rgba(20,24,28,0.35)"; g.beginPath(); for (let x = bahn; x < w; x += bahn) g.rect(x, -0.05, d * 1.6, h + 0.1); g.fill();
    }
    /* Rinne an der Traufe */
    g.fillStyle = "rgb(150,156,158)"; g.fillRect(-0.05, h - 0.1, w + 0.1, 0.1);
    g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(-0.05, h - 0.1, w + 0.1, 0.02);
    bleich(g, 0, 0, w, h, 2.4, 0.05, saat + 2);
  }
  function firstBlech(g, F, x0, x1) {
    g.fillStyle = "rgb(120,128,134)"; g.fillRect(x0, -0.02, x1 - x0, 0.1);
    g.fillStyle = "rgba(255,255,255,0.3)"; g.fillRect(x0, -0.02, x1 - x0, 0.02);
  }

  /* =====================================================================
     DACH DES EMPFANGSGEBÄUDES MIT ZWERCHGIEBEL
     ===================================================================== */
  function dachBauen(M, B, S, Z) {
    const winter = S.winter;
    const cos = Math.cos(NEIG), sin = Math.sin(NEIG);
    const wD = XD1 - XD0, hD = (HD + UE) / cos;
    const aN = (x) => XD1 - x, bN = (y) => (HYM - y) / cos;
    const umS = [[0, 0], [wD, 0], [wD, hD], [0, hD]];
    const umN = [[0, 0], [wD, 0], [wD, hD], [aN(QX - QE), hD], [aN(QX), bN(QY1)], [aN(QX + QE), hD], [0, hD]];
    const reihen = Z.dachReihen;
    const deck = (saat, x0, x1) => function (g, F) {
      const h = F.h;
      if (reihen != null) { schieferMalen(g, F, x0, x1, h, 0, saat, { bisReihe: reihen }); return; }
      if (winter) { dachSchnee(g, F, x0 - 0.05, x1 + 0.05, h, 0, saat, {}); g.fillStyle = "rgba(248,250,255,0.9)"; g.fillRect(x0, -0.02, x1 - x0, 0.1); }
      else { schieferMalen(g, F, x0 - 0.05, x1 + 0.05, h, 0, saat, {}); firstBlech(g, F, x0, x1); }
    };
    /* Den Schatten wirft schon das Haus (Giebel bis unter den First) */
    M.teil("dach", { mitte: [HAUS_M[0], HAUS_M[1], HAUS_M[2] + 10], schatten: false });
    M.flaeche({ name: "dach-s", lichtExtra: S.winter ? 0.07 : 0, o: [XD0, HYM, ZF], u: [1, 0, 0], v: [0, cos, -sin], w: wD, h: hD, umriss: umS, malen: deck(S.saat + 1, 0, wD) });
    M.flaeche({ name: "dach-n", lichtExtra: S.winter ? 0.07 : 0, o: [XD1, HYM, ZF], u: [-1, 0, 0], v: [0, -cos, -sin], w: wD, h: hD, umriss: umN, malen: deck(S.saat + 2, 0, wD) });
    /* Zwerchgiebel-Dach: zwei Dreiecke bis in die Kehle */
    const wq = QY1 - YD0, hq = QE / cos;
    /* Kehle: Blech in der Kehle, Schattenkante zum Hauptdach, im Winter ein Schneewulst */
    const kehle = (mal, a0, b0, a1, b1) => (g, F) => {
      mal(g, F);
      const L = belichter(F, 0), d = Math.hypot(a1 - a0, b1 - b0), nx = -(b1 - b0) / d, ny = (a1 - a0) / d;
      const zur = (nx * (wq / 3 - a0) + ny * (hq / 3 - b0)) > 0 ? 1 : -1;       // Normale ins Dreieck
      const gr = g.createLinearGradient(a0, b0, a0 + nx * zur * 0.35, b0 + ny * zur * 0.35);
      gr.addColorStop(0, winter ? "rgba(90,104,140,0.45)" : "rgba(10,12,20,0.55)"); gr.addColorStop(1, "rgba(10,12,20,0)");
      g.fillStyle = gr; g.beginPath(); g.moveTo(a0, b0); g.lineTo(a1, b1); g.lineTo(a1 + nx * zur * 0.35, b1 + ny * zur * 0.35); g.lineTo(a0 + nx * zur * 0.35, b0 + ny * zur * 0.35); g.closePath(); g.fill();
      g.strokeStyle = winter ? L([236, 241, 250]) : L([120, 128, 134]); g.lineWidth = winter ? 0.09 : 0.05;
      g.beginPath(); g.moveTo(a0, b0); g.lineTo(a1, b1); g.stroke();
    };
    M.flaeche({ name: "zw-w", lichtExtra: S.winter ? 0.07 : 0, o: [QX, YD0, QF], u: [0, 1, 0], v: [-cos, 0, -sin], w: wq, h: hq, umriss: [[0, 0], [wq, 0], [0, hq]], malen: kehle(deck(S.saat + 3, 0, wq), wq, 0, 0, hq) });
    M.flaeche({ name: "zw-o", lichtExtra: S.winter ? 0.07 : 0, o: [QX, QY1, QF], u: [0, -1, 0], v: [cos, 0, -sin], w: wq, h: hq, umriss: [[0, 0], [wq, 0], [wq, hq]], malen: kehle(deck(S.saat + 4, 0, wq), 0, 0, wq, hq) });
    /* Traufbretter */
    const brett = (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, CREME, 71, { ohneAst: true }); g.fillStyle = "rgba(40,60,50,0.9)"; g.fillRect(-0.02, F.h - 0.05, F.w + 0.04, 0.05); if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.05); } };
    const db = 0.24;
    M.flaeche({ name: "tr-s", o: [XD0, YD1, ZTE], u: [1, 0, 0], v: [0, 0, -1], w: wD, h: db, malen: brett, keinAo: true });
    M.flaeche({ name: "tr-n1", o: [XD1, YD0, ZTE], u: [-1, 0, 0], v: [0, 0, -1], w: XD1 - (QX + QE), h: db, malen: brett, keinAo: true });
    M.flaeche({ name: "tr-n2", o: [QX - QE, YD0, ZTE], u: [-1, 0, 0], v: [0, 0, -1], w: (QX - QE) - XD0, h: db, malen: brett, keinAo: true });
    /* Windbretter mit Zierschnitt, Zierbundwerk und Giebelspieß */
    ortgang(M, "west", [XD0, YD0, ZF + 1.0], [0, 1, 0], YD1 - YD0, ZF + 1.0 - (ZTE - 0.45), ZTE, ZF, S, Z);
    ortgang(M, "ost", [XD1, YD1, ZF + 1.0], [0, -1, 0], YD1 - YD0, ZF + 1.0 - (ZTE - 0.45), ZTE, ZF, S, Z);
    ortgang(M, "zwerch", [QX + QE, YD0, QF + 1.0], [-1, 0, 0], 2 * QE, QF + 1.0 - (ZTE - 0.45), ZTE, QF, S, Z);
    /* Dachrinnen, im Winter Schneewechte und Eiszapfen */
    const rinnen = [[XD0 - 0.04, YD1 + 0.08, 1, wD + 0.08], [XD1 + 0.04, YD0 - 0.08, -1, XD1 - (QX + QE) + 0.04], [QX - QE, YD0 - 0.08, -1, (QX - QE) - XD0 + 0.04]];
    rinnen.forEach(([x, y, t, w], i) => {
      M.teil("rinne" + i, { schatten: false, mitte: [x + t * w / 2, y > 0 ? HAUS_M[1] + 20 : HAUS_M[1] - 20, HAUS_M[2] + 10] });
      const u = [t, 0, 0];
      M.flaeche({ name: "rinne" + i, o: [x, y, ZTE - 0.04], u: u, v: [0, 0, -1], w: w, h: 0.14, malen: rinneMal(winter), keinAo: true });
      if (winter) {
        M.flaeche({ name: "wechte" + i, o: [x - t * 0.04, y + (y > 0 ? 0.07 : -0.07), ZTE + 0.2], u: u, v: [0, 0, -1], w: w + 0.08, h: 0.34, malen: wechteMal(31 + i), keinLicht: true, keinAo: true });
        M.flaeche({ name: "zapfen" + i, o: [x, y + (y > 0 ? 0.02 : -0.02), ZTE - 0.17], u: u, v: [0, 0, -1], w: w, h: 0.7, malen: (g, F) => eiszapfenMalen(g, F, 0.1, F.w - 0.1, 0, 0.55, 700 + i, belichter(F, 0.15)), keinLicht: true, keinAo: true });
      }
    });
  }
  function rinneMal(winter) {
    return function (g, F) {
      const w = F.w, h = F.h;
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, "rgb(170,178,182)"); gr.addColorStop(0.35, "rgb(214,220,222)"); gr.addColorStop(0.7, "rgb(136,146,150)"); gr.addColorStop(1, "rgb(96,104,110)");
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
      if (F.px > 16) { g.fillStyle = "rgba(60,64,70,0.6)"; for (let x = 0.4; x < w; x += 0.9) g.fillRect(x, 0, 0.02, h); }
      if (winter) { g.fillStyle = "rgb(244,247,252)"; g.fillRect(0, -0.02, w, 0.06); }
    };
  }
  function wechteMal(saat) {
    return function (g, F) {
      const w = F.w, L = belichter(F, 0.06), rng = zufall(saat);
      const unten = (x) => 0.22 + Math.sin(x * 2.1 + saat) * 0.04 + Math.sin(x * 5.3 + saat * 3) * 0.02;
      g.beginPath(); g.moveTo(-0.02, 0.02); g.lineTo(w + 0.02, 0.02);
      for (let x = w; x >= -0.02; x -= 0.12) g.lineTo(x, unten(x));
      g.closePath();
      const gr = g.createLinearGradient(0, 0, 0, 0.3);
      gr.addColorStop(0, L([248, 250, 254])); gr.addColorStop(0.5, L([240, 244, 251])); gr.addColorStop(1, L([196, 208, 230]));
      g.fillStyle = gr; g.fill();
      if (F.px > 18) { g.fillStyle = L([255, 255, 255], 0.9); g.beginPath(); for (let i = 0; i < w * 30; i++) { const r = (0.6 + rng()) / F.px; g.rect(rng() * w, 0.03 + rng() * 0.15, r, r); } g.fill(); }
    };
  }
  /* Ortgang eines Giebels: Windbrett mit Zierschnitt (Bogenfries), darunter
     das Zierbundwerk (Zange, Hängesäule, Bügen) und oben der Giebelspieß.
     Die Fläche liegt in der Ebene des Windbretts und ist sonst durchsichtig. */
  function ortgang(M, name, o, u, w, h, zT, zF, S, Z) {
    if (!Z.dach && Z.dachReihen == null) return;
    const top = o[2];
    const hDach = zF - zT;
    const dachY = (a) => top - (zT + Math.min(a, w - a) * (hDach / (w / 2)));   // Flächen-y der Dachkante
    const n = kreuz(u, [0, 0, -1]);
    /* Umriss eng um Brett, Bundwerk und Spieß (sonst würfe die ganze
       Rechteckfläche einen Schatten) */
    const mO = w / 2, umO = [[0, dachY(0) - 0.12], [mO - 0.12, dachY(mO) - 0.12], [mO - 0.12, 0], [mO + 0.12, 0], [mO + 0.12, dachY(mO) - 0.12], [w, dachY(w) - 0.12], [w, h], [0, h]];
    M.flaeche({ name: "ort-" + name, o: o, u: u, v: [0, 0, -1], w: w, h: h, umriss: umO, keinLicht: true, keinAo: true, ebene: 1, malen: function (g, F) {
      const L = belichter(F, 0.04), px = F.px, winter = S.winter;
      const bh = 0.3, m = w / 2;
      const kante = (a, d) => dachY(a) + d;
      /* Zierbundwerk hinter dem Brett */
      if (Z.fertig || Z.dachReihen == null) {
        /* am Zwerchgiebel sitzt die Zange höher und ohne Zapfen: darunter hängt die Uhr */
        const kurz = name === "zwerch";
        const yA = dachY(m), zangeY = yA + (kurz ? 0.62 : 1.35), hs = 0.12;
        const zb = (y) => { const d = y - yA; return d * (w / 2) / hDach; };
        g.fillStyle = L(hell(CREME, -0.08));
        const xz = zb(zangeY);
        g.fillRect(m - xz + 0.1, zangeY - hs / 2, 2 * xz - 0.2, hs);
        g.fillRect(m - hs / 2, yA + 0.1, hs, zangeY - yA + (kurz ? 0.06 : 0.35));
        g.strokeStyle = L(hell(CREME, -0.08)); g.lineWidth = 0.09;
        g.beginPath(); g.moveTo(m - 0.05, zangeY - 0.35); g.quadraticCurveTo(m - xz * 0.35, zangeY - 0.2, m - xz * 0.62, yA + (zangeY - yA) * 0.55);
        g.moveTo(m + 0.05, zangeY - 0.35); g.quadraticCurveTo(m + xz * 0.35, zangeY - 0.2, m + xz * 0.62, yA + (zangeY - yA) * 0.55); g.stroke();
        /* gedrechselter Zapfen unter der Hängesäule */
        if (!kurz) {
          g.fillStyle = L(GRUEN); g.beginPath(); g.ellipse(m, zangeY + 0.42, 0.07, 0.1, 0, 0, TAU); g.fill();
          g.fillStyle = L(hell(CREME, -0.1)); g.beginPath(); g.moveTo(m - 0.04, zangeY + 0.5); g.lineTo(m + 0.04, zangeY + 0.5); g.lineTo(m, zangeY + 0.66); g.closePath(); g.fill();
        }
        if (px > 20) { g.strokeStyle = L([40, 30, 24], 0.5); g.lineWidth = Math.max(0.004, 0.8 / px); g.strokeRect(m - xz + 0.1, zangeY - hs / 2, 2 * xz - 0.2, hs); }
      }
      /* Windbrett entlang beider Dachschrägen mit Bogenfries */
      g.fillStyle = L(CREME);
      g.beginPath();
      g.moveTo(0, kante(0, -0.02)); g.lineTo(m, kante(m, -0.02)); g.lineTo(w, kante(w, -0.02));
      const schritt = 0.16;
      for (let a = w; a >= m; a -= schritt * 0.5) g.lineTo(a, kante(a, bh + (Math.abs(Math.sin((a - m) / schritt * Math.PI)) * 0.07)));
      for (let a = m; a >= 0; a -= schritt * 0.5) g.lineTo(a, kante(a, bh + (Math.abs(Math.sin((a - m) / schritt * Math.PI)) * 0.07)));
      g.closePath(); g.fill();
      /* grüne Kante und Schatten des Überstands */
      g.strokeStyle = L(GRUEN); g.lineWidth = 0.045;
      g.beginPath(); g.moveTo(0, kante(0, 0.02)); g.lineTo(m, kante(m, 0.02)); g.lineTo(w, kante(w, 0.02)); g.stroke();
      if (px > 14) {
        g.fillStyle = L([30, 40, 34], 0.8);
        for (let a = 0.3; a < w; a += 0.6) { if (Math.abs(a - m) < 0.2) continue; g.beginPath(); g.arc(a, kante(a, bh * 0.55), 0.025, 0, TAU); g.fill(); }
      }
      /* Giebelspieß */
      const yA = dachY(m);
      g.fillStyle = L([60, 58, 56]);
      g.fillRect(m - 0.03, yA - 0.95, 0.06, 0.95);
      g.beginPath(); g.arc(m, yA - 0.62, 0.08, 0, TAU); g.fill();
      g.beginPath(); g.moveTo(m - 0.05, yA - 0.95); g.lineTo(m, yA - 1.05); g.lineTo(m + 0.05, yA - 0.95); g.closePath(); g.fill();
      g.fillStyle = L([200, 170, 90]); g.beginPath(); g.arc(m, yA - 0.62, 0.03, 0, TAU); g.fill();
      if (winter) {
        g.fillStyle = L([244, 247, 252]);
        g.beginPath(); g.moveTo(0, kante(0, -0.05)); g.lineTo(m, kante(m, -0.05)); g.lineTo(w, kante(w, -0.05)); g.lineTo(w, kante(w, 0.03)); g.lineTo(m, kante(m, 0.03)); g.lineTo(0, kante(0, 0.03)); g.closePath(); g.fill();
        g.beginPath(); g.ellipse(m, yA - 0.7, 0.09, 0.035, 0, 0, TAU); g.fill();
      }
      void n;
    } });
  }
  /* Schornsteine auf dem First */
  const KAMINE = [-5.2, 1.0];
  function kaminBauen(M, S, Z) {
    const h = 1.35 * Z.kamin;
    if (h <= 0.02) return;
    const b = 0.64;
    const zRoof = (y) => ZF - Math.abs(y - HYM);
    for (let i = 0; i < KAMINE.length; i++) {
      const kx = KAMINE[i], x0 = kx - b / 2, x1 = kx + b / 2, y0 = HYM - b / 2, y1 = HYM + b / 2, zO = ZF + h;
      M.teil("kamin" + i, { mitte: [kx, HYM, HAUS_M[2] + 12], schatten: false });
      const mal = (saat) => (g, F) => {
        backsteinMalen(g, F, 0, 0, F.w, F.h, { saat: saat, baender: [[0.12, 0.2]] });
        const gr = g.createLinearGradient(0, 0, 0, 0.5); gr.addColorStop(0, "rgba(20,16,16,0.5)"); gr.addColorStop(1, "rgba(20,16,16,0)");
        g.fillStyle = gr; g.fillRect(0, 0, F.w, 0.5);
      };
      const hS = zO - zRoof(y1);
      wand(M, [x0, y1, zO], [0, 1, 0], b, hS, mal(60 + i), { name: "k-s" + i, keinAo: true });
      wand(M, [x1, y0, zO], [0, -1, 0], b, hS, mal(62 + i), { name: "k-n" + i, keinAo: true });
      wand(M, [x1, y1, zO], [1, 0, 0], b, hS + 0.02, mal(64 + i), { name: "k-o" + i, keinAo: true, umriss: [[0, 0], [b, 0], [b, zO - zRoof(y0)], [b / 2, zO - ZF], [0, zO - zRoof(y1)]] });
      wand(M, [x0, y0, zO], [-1, 0, 0], b, hS + 0.02, mal(66 + i), { name: "k-w" + i, keinAo: true, umriss: [[0, 0], [b, 0], [b, zO - zRoof(y1)], [b / 2, zO - ZF], [0, zO - zRoof(y0)]] });
      if (Z.kamin >= 1) {
        M.teil("kaminkopf" + i, { schatten: false, mitte: [kx, HYM, HAUS_M[2] + 13] });
        const d = 0.07;
        const kopf = (g, F) => { g.fillStyle = rgb(hell(ZIEGEL, -0.1)); g.fillRect(0, 0, F.w, F.h); g.fillStyle = "rgba(20,16,16,0.45)"; g.fillRect(0, 0, F.w, F.h); };
        kiste(M, x0 - d, y0 - d, zO, x1 + d, y1 + d, zO + 0.16, { s: kopf, n: kopf, o: kopf, w: kopf, t: S.winter ? schneeOben(null) : (g, F) => { kopf(g, F); g.fillStyle = "rgb(20,18,18)"; g.fillRect(F.w * 0.25, F.h * 0.25, F.w * 0.5, F.h * 0.5); } }, { name: "kk" + i, keinAo: true });
      }
    }
  }
  /* Offener Dachstuhl im Bau */
  function dachstuhlBauen(M, S, Z) {
    const c = HOLZ_ROH;
    const mal = () => (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, c, 13, { ohneAst: true }); if (S.winter) { g.fillStyle = "rgba(242,246,252,0.5)"; g.fillRect(0, 0, F.w, F.h * 0.3); } };
    const t = phase(Z.bau, 0.5, 0.56);
    M.teil("dachstuhl", { mitte: [HAUS_M[0], HAUS_M[1], HAUS_M[2] + 9] });
    const zF = ZF - DV - 0.1;
    const n = Math.max(1, Math.round(14 * t));
    for (let i = 0; i < n; i++) {
      const x = HX0 + 0.1 + (HX1 - HX0 - 0.2) * i / 13;
      for (const s of [1, -1]) balken3(M, [x, HYM + s * (HD + UE - 0.1), TR - (UE - 0.1)], [x, HYM, zF], [1, 0, 0], 0.1, 0.16, mal, { name: "sp" + i + s, seiten: "QqR" });
      balken3(M, [x, HYM - 1.4, TR + 2.3], [x, HYM + 1.4, TR + 2.3], [1, 0, 0], 0.08, 0.16, mal, { name: "kb" + i, seiten: "QqR" });
    }
    if (t >= 1) {
      balken3(M, [HX0 - 0.3, HYM, zF + 0.08], [HX1 + 0.3, HYM, zF + 0.08], [0, 1, 0], 0.14, 0.16, mal, { name: "fp", seiten: "QqR" });
      /* Zwerchgiebel: First bis ins Hauptdach, Sparren beidseits */
      const zQ = QF - DV - 0.1;
      balken3(M, [QX, YD0 + 0.1, zQ + 0.06], [QX, QY1, zQ + 0.06], [1, 0, 0], 0.12, 0.14, mal, { name: "zfp", seiten: "QqR" });
      for (let y = YD0 + 0.15; y < QY1 - 0.3; y += 0.62) {
        const lang = QE - 0.1 - Math.max(0, y - (HY0 + 0.2)) * 0.0;
        for (const sg of [1, -1]) balken3(M, [QX + sg * lang, y, TR - (UE - 0.1)], [QX, y, zQ], [0, 1, 0], 0.1, 0.14, mal, { name: "zs" + y.toFixed(2) + sg, seiten: "QqR" });
      }
    }
    if (Z.bau >= 0.56 && Z.bau < 0.7) {
      M.teil("richtbaum", { schatten: false, mitte: [HAUS_M[0], HAUS_M[1], ZF + 12] });
      M.figur({ x: -2, y: HYM, z: ZF - 0.1, breite: 1.4, hoehe: 2.0, schatten: false, malen: richtbaum(S.winter) });
    }
  }
  function richtbaum(winter) {
    return function (g, s, F) {
      if (F.schatten) return;
      const k = s;
      g.fillStyle = "rgb(84,60,40)"; g.fillRect(-0.03 * k, -1.8 * k, 0.06 * k, 1.8 * k);
      for (let i = 0; i < 6; i++) {
        const y = -1.9 * k + i * 0.22 * k, b = (0.15 + i * 0.09) * k;
        g.fillStyle = winter ? "rgb(40,74,52)" : "rgb(36,86,46)";
        g.beginPath(); g.moveTo(0, y - 0.1 * k); g.lineTo(-b, y + 0.2 * k); g.lineTo(b, y + 0.2 * k); g.closePath(); g.fill();
      }
      const farben = ["#c8202c", "#f2c230", "#2a62b8", "#ffffff", "#2a9a4a"];
      g.lineWidth = Math.max(1, 0.03 * k);
      for (let i = 0; i < 5; i++) { g.strokeStyle = farben[i]; g.beginPath(); g.moveTo(0, -1.7 * k); g.quadraticCurveTo((i - 2) * 0.25 * k, -1.2 * k, (i - 2) * 0.32 * k, -0.8 * k); g.stroke(); }
    };
  }
  /* Dach im Bau: Latten über allem, Schiefer Reihe für Reihe von der Traufe */
  function dachImBau(M, S, Z) {
    const cos = Math.cos(NEIG), sin = Math.sin(NEIG);
    const wD = XD1 - XD0, hD = (HD + UE) / cos;
    const aN = (x) => XD1 - x, bN = (y) => (HYM - y) / cos;
    const flaechen = [
      { name: "s", o: [XD0, HYM, ZF], u: [1, 0, 0], v: [0, cos, -sin], w: wD, h: hD, umr: [[0, 0], [wD, 0], [wD, hD], [0, hD]] },
      { name: "n", o: [XD1, HYM, ZF], u: [-1, 0, 0], v: [0, -cos, -sin], w: wD, h: hD, umr: [[0, 0], [wD, 0], [wD, hD], [aN(QX - QE), hD], [aN(QX), bN(QY1)], [aN(QX + QE), hD], [0, hD]] }
    ];
    const wq = QY1 - YD0, hq = QE / cos;
    flaechen.push(
      { name: "zw", o: [QX, YD0, QF], u: [0, 1, 0], v: [-cos, 0, -sin], w: wq, h: hq, umr: [[0, 0], [wq, 0], [0, hq]] },
      { name: "zo", o: [QX, QY1, QF], u: [0, -1, 0], v: [cos, 0, -sin], w: wq, h: hq, umr: [[0, 0], [wq, 0], [wq, hq]] }
    );
    const t = phase(Z.bau, 0.58, 0.72);
    M.teil("dach", { mitte: [HAUS_M[0], HAUS_M[1], HAUS_M[2] + 10] });
    for (const f of flaechen) {
      M.flaeche({ name: "latten-" + f.name, o: f.o, u: f.u, v: f.v, w: f.w, h: f.h, umriss: f.umr, keinLicht: true, keinAo: true, malen: (g, F) => {
        const L = belichter(F, 0);
        g.fillStyle = L(hell(HOLZ_ROH, 0.06));
        g.beginPath(); for (let y = F.h - 0.1; y > 0; y -= 0.3) g.rect(-0.1, y - 0.025, F.w + 0.2, 0.05); g.fill();
      } });
      const yCut = f.h * (1 - t);
      if (t > 0.01) {
        const um = schneide(f.umr, (p) => p[1] - yCut);
        if (um.length >= 3) M.flaeche({ name: "schiefer-" + f.name, o: f.o, u: f.u, v: f.v, w: f.w, h: f.h, umriss: um, ebene: 1, malen: (g, F) => schieferMalen(g, F, -0.05, F.w + 0.05, F.h, Math.max(0, yCut - 0.3), S.saat + f.name.length, {}) });
      }
    }
  }

  /* =====================================================================
     GÜTERSCHUPPEN: Holzständerbau mit Deckleistenschalung (ochsenblutrot)
     auf Backsteinsockel, Schiebetore zu Gleis und Straße, flaches
     Pappdach mit weitem Überstand zur Gleisseite.
     ===================================================================== */
  function schuppenWandMaler(art, S, Z) {
    return function (g, F) {
      const w = F.w, h = F.h, px = F.px, winter = S.winter;
      const top = art === "ost" ? SGZ : SH;
      const yz = (z) => top - z;
      const zS = 0.85;
      /* Sockel */
      const zb = Math.min(zS, Z.schuppenZ);
      if (zb > 0) {
        backsteinMalen(g, F, 0, yz(zb), w, zb, { saat: 40 + art.length });
        if (Z.bretter <= 0) {
          /* Fläche ohne Kernlicht (offenes Ständerwerk): Sockel selbst belichten */
          const lf = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
          g.save(); g.globalCompositeOperation = "multiply"; g.fillStyle = rgb([lf[0] * 255, lf[1] * 255, lf[2] * 255]); g.fillRect(-0.05, yz(zb), w + 0.1, zb + 0.05); g.restore();
        }
      }
      if (Z.schuppenZ <= zS) return;
      const zo = Math.min(top, Z.schuppenZ);
      g.save(); g.beginPath(); g.rect(-0.1, yz(zo), w + 0.2, zo - zS); g.clip();
      if (Z.bretter > 0) {
        /* Bretter senkrecht, Deckleisten auf den Fugen */
        const bb = 0.24;
        const rng = zufall(art.length * 7 + 3);
        for (let x = 0; x < w; x += bb) {
          const c = PI.streu(OCHSENBLUT, rng, 0.06);
          g.fillStyle = rgb(c); g.fillRect(x, yz(top), bb, top - zS);
        }
        rausch(g, 0, yz(top), w, top - zS, 1.4, 0.22, 17, 3);
        if (px > 8) {
          const sv = F.schatten(0.025);
          for (let x = bb; x < w; x += bb) {
            if (sv) { g.fillStyle = "rgba(20,8,6,0.3)"; g.fillRect(x - 0.025 + sv[0], yz(top), 0.05, top - zS); }
            g.fillStyle = rgb(hell(OCHSENBLUT, 0.08)); g.fillRect(x - 0.025, yz(top), 0.05, top - zS);
            g.fillStyle = "rgba(255,220,200,0.12)"; g.fillRect(x - 0.025, yz(top), 0.012, top - zS);
          }
        }
        /* Verwitterung unten, Spritzwasser */
        const gr = g.createLinearGradient(0, yz(zS), 0, yz(zS + 0.6));
        gr.addColorStop(0, "rgba(30,20,16,0.35)"); gr.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = gr; g.fillRect(0, yz(zS + 0.6), w, 0.6);
      } else {
        /* Ständerwerk ohne Schalung: man sieht hindurch */
        const L = belichter(F, 0);
        g.fillStyle = L(HOLZ_ROH);
        g.beginPath();
        for (let x = 0.1; x < w; x += 1.2) g.rect(x - 0.07, yz(zo), 0.14, zo - zS);
        g.rect(0, yz(zS + 0.14), w, 0.14); g.rect(0, yz(zo), w, 0.14);
        g.fill();
        if (winter) { g.fillStyle = L([244, 247, 252]); g.fillRect(0, yz(zo) - 0.02, w, 0.04); }
      }
      if (Z.bretter > 0) {
        if (art !== "ost") {
          /* Schiebetor mit Laufschiene und Streben */
          const tx = 1.8, tw = 2.4, tz0 = ZB, tz1 = 3.3;
          g.fillStyle = "rgb(40,38,38)"; g.fillRect(tx - 0.3, yz(tz1 + 0.2), tw + 1.8, 0.07);
          const tc = hell(OCHSENBLUT, -0.12);
          g.fillStyle = rgb(tc); g.fillRect(tx, yz(tz1), tw, tz1 - tz0);
          if (px > 8) {
            g.fillStyle = rgb(hell(tc, 0.12));
            g.fillRect(tx, yz(tz1), tw, 0.12); g.fillRect(tx, yz(tz0 + 0.12), tw, 0.12); g.fillRect(tx, yz((tz0 + tz1) / 2 + 0.06), tw, 0.12);
            g.save(); g.beginPath(); g.rect(tx, yz(tz1), tw, tz1 - tz0); g.clip();
            g.strokeStyle = rgb(hell(tc, 0.12)); g.lineWidth = 0.12;
            g.beginPath(); g.moveTo(tx, yz(tz0 + 0.12)); g.lineTo(tx + tw, yz((tz0 + tz1) / 2)); g.moveTo(tx, yz((tz0 + tz1) / 2 + 0.06)); g.lineTo(tx + tw, yz(tz1 - 0.1)); g.stroke();
            g.restore();
            g.fillStyle = "rgb(30,28,28)"; g.fillRect(tx + 0.2, yz(tz1 + 0.13), 0.12, 0.12); g.fillRect(tx + tw - 0.32, yz(tz1 + 0.13), 0.12, 0.12);
            g.fillStyle = "rgb(60,56,52)"; g.fillRect(tx + tw - 0.25, yz(1.6), 0.05, 0.3);
          }
          const sv = F.schatten(0.06);
          if (sv) { g.fillStyle = "rgba(20,10,8,0.25)"; g.fillRect(tx + tw + (sv[0] > 0 ? 0 : sv[0]), yz(tz1) + Math.max(0, sv[1]), Math.abs(sv[0]), tz1 - tz0); }
          if (winter && Z.fertig) { g.fillStyle = "rgb(244,247,252)"; g.fillRect(tx - 0.3, yz(tz1 + 0.2) - 0.03, tw + 1.8, 0.04); }
        }
        /* kleine Fenster hoch in der Wand */
        const fx = art === "ost" ? [w / 2 - 0.45] : [0.5, w - 1.3];
        for (const x of fx) {
          const fz = art === "ost" ? 2.5 : 2.55;
          g.fillStyle = rgb(CREME); g.fillRect(x - 0.06, yz(fz + 0.72), 0.92, 0.84);
          g.fillStyle = "rgb(40,44,52)"; g.fillRect(x, yz(fz + 0.66), 0.8, 0.6);
          g.fillStyle = "rgba(190,208,230," + (0.3 * (1 - F.nacht) + 0.1).toFixed(3) + ")"; g.fillRect(x, yz(fz + 0.66), 0.8, 0.6);
          g.fillStyle = rgb(CREME); g.fillRect(x + 0.385, yz(fz + 0.66), 0.03, 0.6); g.fillRect(x, yz(fz + 0.36), 0.8, 0.03);
          if (winter && Z.fertig) { g.fillStyle = "rgb(244,247,252)"; g.fillRect(x - 0.08, yz(fz) - 0.04, 0.96, 0.05); }
        }
        if (art === "gleis" && Z.fertig && px > 12) emailSchild(g, 3.0, yz(3.55), "Güterabfertigung", 0.085);
        if (art === "ost" && Z.fertig) {
          /* Lüftungsschlitze im Giebel */
          g.fillStyle = "rgba(20,10,8,0.7)";
          for (let i = 0; i < 4; i++) g.fillRect(w / 2 - 0.3 + i * 0.18, yz(SGZ - 0.5), 0.06, 0.4);
        }
      }
      g.restore();
      if (winter && Z.fertig && art === "strasse") schneeWehe(g, w, yz(0), 5, [1.6, 4.4]);
    };
  }
  function schuppenBauen(M, B, S, Z) {
    if (Z.schuppenZ <= 0.01) return;
    const winter = S.winter;
    M.teil("schuppen", { mitte: [AUSSEN + (SX0 + SX1) / 2, SYM, 2] });
    const zo = Math.min(SGZ, Z.schuppenZ);
    const umG = (top) => { const um = [[0, top - Math.min(SH, zo)], [SX1 - SX0, top - Math.min(SH, zo)], [SX1 - SX0, top], [0, top]]; return um; };
    const offen = Z.bretter <= 0;
    const umGl = schneide(umG(SH), (p) => (SH - ZB) - p[1]);
    if (umGl.length >= 3) M.flaeche({ name: "s-gleis", o: [SX1, SY0, SH], u: [-1, 0, 0], v: [0, 0, -1], w: SX1 - SX0, h: SH - ZB, umriss: umGl, malen: mitSchatten(schuppenWandMaler("gleis", S, Z), B, "schuppen-wand"), ao: true, traufe: Z.schuppenDach ? S_UE_G : 0, traufeY: 0, keinLicht: offen, beidseitig: offen });
    M.flaeche({ name: "s-strasse", o: [SX0, SY1, SH], u: [1, 0, 0], v: [0, 0, -1], w: SX1 - SX0, h: SH, umriss: umG(SH), malen: mitSchatten(schuppenWandMaler("strasse", S, Z), B, "schuppen-wand"), ao: true, traufe: Z.schuppenDach ? S_UE_S : 0, traufeY: 0, keinLicht: offen, beidseitig: offen });
    if (offen && Z.schuppenZ > 0.85) M.flaeche({ name: "s-boden", o: [SX0, SY0, 0.86], u: [1, 0, 0], v: [0, 1, 0], w: SX1 - SX0, h: SY1 - SY0, ebene: -1, malen: (g, F) => { bretterMalen(g, F, 0, 0, F.w, F.h, HOLZ_ROH, 61, { breite: 0.22 }); if (winter) { g.fillStyle = "rgba(242,246,252,0.75)"; g.fillRect(0, 0, F.w, F.h); } } });
    let umO = [[0, SGZ - SH], [SD, 0], [2 * SD, SGZ - SH], [2 * SD, SGZ], [0, SGZ]];
    if (zo < SGZ - 0.01) umO = schneide(umO, (p) => p[1] - (SGZ - zo));
    if (umO.length >= 3) M.flaeche({ name: "s-ost", o: [SX1, SY1, SGZ], u: [0, -1, 0], v: [0, 0, -1], w: SY1 - SY0, h: SGZ, umriss: umO, malen: schuppenWandMaler("ost", S, Z), ao: true, keinLicht: offen, beidseitig: offen });
    if (!Z.schuppenDach) return;
    /* Dach */
    const cos = Math.cos(SNEIG), sin = Math.sin(SNEIG);
    const wS = SX1 + S_OGV - SX0, hG = (SD + S_UE_G) / cos, hS2 = (SD + S_UE_S) / cos;
    const dm = (saat) => (g, F) => { if (winter) { dachSchnee(g, F, -0.05, F.w + 0.05, F.h, 0, saat, {}); } else { pappeMalen(g, F, F.w, F.h, saat, false); firstBlech(g, F, 0, F.w); } };
    M.teil("schuppendach", { mitte: [AUSSEN + (SX0 + SX1) / 2, SYM, 12], schatten: false });
    M.flaeche({ name: "sd-g", lichtExtra: S.winter ? 0.07 : 0, o: [SX1 + S_OGV, SYM, SZF], u: [-1, 0, 0], v: [0, -cos, -sin], w: wS, h: hG, malen: mitSchatten(dm(3), B, "schuppen-dach") });
    M.flaeche({ name: "sd-s", lichtExtra: S.winter ? 0.07 : 0, o: [SX0, SYM, SZF], u: [1, 0, 0], v: [0, cos, -sin], w: wS, h: hS2, malen: mitSchatten(dm(4), B, "schuppen-dach") });
    const brett = (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, CREME, 5, { ohneAst: true }); if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.05); } };
    const zG = SZF - hG * sin, zS2 = SZF - hS2 * sin;
    M.flaeche({ name: "sd-tg", o: [SX1 + S_OGV, SY0 - S_UE_G, zG], u: [-1, 0, 0], v: [0, 0, -1], w: wS, h: 0.2, malen: brett, keinAo: true });
    M.flaeche({ name: "sd-ts", o: [SX0, SY1 + S_UE_S, zS2], u: [1, 0, 0], v: [0, 0, -1], w: wS, h: 0.2, malen: brett, keinAo: true });
    /* Windbrett am Ostgiebel */
    const xo = SX1 + S_OGV, yA = SY1 + S_UE_S, yB = SY0 - S_UE_G;
    const wO = yA - yB, top = SZF + 0.05;
    const kz = (y) => top - (y > SYM ? SZF - (y - SYM) * STN : SZF - (SYM - y) * STN);
    M.flaeche({ name: "sd-ort", o: [xo, yA, top], u: [0, -1, 0], v: [0, 0, -1], w: wO, h: top - zG + 0.25, keinAo: true, umriss: [[0, kz(yA)], [yA - SYM, kz(SYM)], [wO, kz(yB)], [wO, kz(yB) + 0.22], [yA - SYM, kz(SYM) + 0.22], [0, kz(yA) + 0.22]], malen: (g, F) => { brett(g, F); } });
    /* Kopfbänder unter dem weiten Überstand zur Gleisseite */
    const hc = hell(OCHSENBLUT, -0.1);
    for (const x of [4.3, 6.5, 8.7]) balken3(M, [x, SY0, 3.0], [x, SY0 - 0.85, SH - 0.1], [1, 0, 0], 0.12, 0.12, () => (g, F) => { holzMalen(g, F, 0, 0, F.w, F.h, hc, 9, { ohneAst: true }); }, { name: "kb" + x, seiten: "QqR" });
    if (winter) {
      for (const [y, t, w0, n] of [[SY0 - S_UE_G - 0.02, -1, wS, "g"], [SY1 + S_UE_S + 0.02, 1, wS, "s"]]) {
        const o = t > 0 ? [SX0, y, (t > 0 ? zS2 : zG) - 0.03] : [SX1 + S_OGV, y, zG - 0.03];
        M.flaeche({ name: "sd-zapfen" + n, o: o, u: [t, 0, 0], v: [0, 0, -1], w: w0, h: 0.6, keinLicht: true, keinAo: true, malen: (g, F) => eiszapfenMalen(g, F, 0.1, F.w - 0.1, 0, 0.45, 800 + n.length, belichter(F, 0.15)) });
      }
    }
  }

  /* =====================================================================
     BAHNSTEIGDACH: Gusseisensäulen mit Kapitell, Zierkonsolen, Holzdach
     mit Zinkblech, vorn der gesägte Behang (Lambrequin). Im Winter
     Tannengirlande mit roten Schleifen und eine Lichterkette.
     ===================================================================== */
  function behangMalen(g, F, w, oben, S, lichter) {
    /* oben: Flächen-y der Oberkante über w (Funktion) */
    const L = belichter(F, 0.04), px = F.px;
    const hb = 0.38, zahn = 0.2;
    const unten = (a) => oben(a) + 0.2 + hb;
    /* Stirnbrett */
    g.fillStyle = L(GRUEN);
    g.beginPath(); g.moveTo(0, oben(0)); g.lineTo(w, oben(w)); g.lineTo(w, oben(w) + 0.2); g.lineTo(0, oben(0) + 0.2); g.closePath(); g.fill();
    g.fillStyle = L(hell(GRUEN, 0.2)); g.beginPath(); g.moveTo(0, oben(0)); g.lineTo(w, oben(w)); g.lineTo(w, oben(w) + 0.03); g.lineTo(0, oben(0) + 0.03); g.closePath(); g.fill();
    /* Behang: senkrechte Bretter, unten gesägt (Spitze mit Kleeblattloch) */
    g.fillStyle = L(CREME);
    g.beginPath();
    for (let a = 0; a < w - 0.01; a += zahn) {
      const a1 = Math.min(w, a + zahn), m = (a + a1) / 2, y0 = oben(a) + 0.2;
      g.moveTo(a + 0.005, y0); g.lineTo(a1 - 0.005, oben(a1) + 0.2);
      g.lineTo(a1 - 0.005, unten(a1) - 0.1); g.lineTo(m, unten(m)); g.lineTo(a + 0.005, unten(a) - 0.1); g.closePath();
    }
    g.fill();
    if (px > 14) {
      g.fillStyle = L([50, 56, 50], 0.85);
      g.beginPath();
      for (let a = 0; a < w - 0.01; a += zahn) { const m = a + zahn / 2; const y = unten(m) - 0.17; g.moveTo(m + 0.028, y); g.arc(m, y, 0.028, 0, TAU); }
      g.fill();
      g.strokeStyle = L([60, 50, 40], 0.4); g.lineWidth = Math.max(0.004, 0.8 / px);
      g.beginPath(); for (let a = zahn; a < w; a += zahn) { g.moveTo(a, oben(a) + 0.2); g.lineTo(a, unten(a) - 0.1); } g.stroke();
    }
    if (S.winter && S.fertig) {
      /* Tannengirlande in Bögen mit roten Schleifen */
      const rng = zufall(21);
      const bog = 1.3;
      g.save();
      for (let i = 0; i < w * 26; i++) {
        const a = rng() * w, t = (a % bog) / bog, y = oben(a) + 0.2 + Math.sin(t * Math.PI) * 0.22 + (rng() - 0.5) * 0.07;
        g.fillStyle = L([26 + rng() * 22, 62 + rng() * 26, 38]);
        g.beginPath(); g.ellipse(a, y, 0.06, 0.02, rng() * 3, 0, TAU); g.fill();
      }
      g.fillStyle = L([246, 249, 255], 0.9);
      for (let i = 0; i < w * 6; i++) { const a = rng() * w, t = (a % bog) / bog; g.beginPath(); g.ellipse(a, oben(a) + 0.18 + Math.sin(t * Math.PI) * 0.2, 0.05, 0.014, 0, 0, TAU); g.fill(); }
      for (let a = 0; a <= w + 0.01; a += bog) {
        const y = oben(a) + 0.22;
        g.fillStyle = L([178, 18, 40]);
        g.beginPath(); g.moveTo(a, y); g.quadraticCurveTo(a - 0.1, y - 0.08, a - 0.09, y + 0.04); g.closePath(); g.fill();
        g.beginPath(); g.moveTo(a, y); g.quadraticCurveTo(a + 0.1, y - 0.08, a + 0.09, y + 0.04); g.closePath(); g.fill();
        g.fillRect(a - 0.02, y, 0.018, 0.18); g.fillRect(a + 0.004, y, 0.018, 0.15);
      }
      g.restore();
      /* Lichterkette am Stirnbrett */
      if (lichter) {
        g.strokeStyle = L([30, 40, 30]); g.lineWidth = Math.max(0.006, 0.7 / px);
        g.beginPath(); for (let a = 0.1; a < w; a += 0.6) { g.moveTo(a, oben(a) + 0.12); g.quadraticCurveTo(a + 0.3, oben(a + 0.3) + 0.2, Math.min(w, a + 0.6), oben(Math.min(w, a + 0.6)) + 0.12); } g.stroke();
        g.fillStyle = L([240, 226, 186]);
        g.beginPath(); for (let a = 0.25; a < w; a += 0.3) { const y = oben(a) + 0.16 + 0.03 * Math.sin((a - 0.1) / 0.6 * Math.PI) ** 2; g.moveTo(a + 0.014, y); g.arc(a, y, 0.014, 0, TAU); } g.fill();
      }
    }
    /* Eiszapfen am Behang */
    if (S.winter && S.fertig) {
      const rng = zufall(77);
      g.fillStyle = L([226, 238, 250], 0.75);
      g.beginPath();
      for (let a = 0.1; a < w; a += zahn) { if (rng() < 0.45) continue; const m = a + zahn / 2 - 0.1, y = unten(m), l = 0.05 + rng() * 0.18; g.moveTo(m - 0.012, y - 0.02); g.lineTo(m, y + l); g.lineTo(m + 0.012, y - 0.02); g.closePath(); }
      g.fill();
    }
  }
  function behangLicht(g, F, w, oben) {
    const a = F.nacht;
    if (a <= 0) return;
    for (let x = 0.25, i = 0; x < w; x += 0.3, i++) {
      const y = oben(x) + 0.16 + 0.03 * Math.sin((x - 0.1) / 0.6 * Math.PI) ** 2;
      const gg = g.createRadialGradient(x, y, 0, x, y, 0.07);
      gg.addColorStop(0, "rgba(255,246,214," + a + ")"); gg.addColorStop(0.3, "rgba(255,206,120," + (0.8 * a) + ")"); gg.addColorStop(1, "rgba(255,170,70,0)");
      g.fillStyle = gg; g.fillRect(x - 0.07, y - 0.07, 0.14, 0.14);
      if (i % 3 === 0) F.leuchtPunkt(x, y, 0.6, "255,196,110", 0.25, true);
    }
  }
  function vordachBauen(M, B, S, Z) {
    if (Z.vordach <= 0) return;
    const winter = S.winter;
    const n = Math.round(SAEULEN.length * klemm(Z.vordach * 3, 0, 1));
    /* Säulen (rundum gleich → Figuren) */
    for (let i = 0; i < n; i++) {
      const x = SAEULEN[i];
      M.teil("saeule" + i, { mitte: [x, SAEULE_Y - AUSSEN, 2], schatten: false });
      M.figur({ x: x, y: SAEULE_Y, z: ZB, breite: 1.0, hoehe: VZV - 0.05 - ZB, schatten: false, malen: saeuleFigur(VZV - 0.05 - ZB, winter && Z.fertig, { lampe: Z.fertig && (i === 1 || i === 2), z0: ZB, lampeZ: 3.0, pos: [x, SAEULE_Y], B: B, schmuck: Z.fertig ? 31 + i : 0 }) });
    }
    if (Z.vordach < 0.4) return;
    M.teil("vordach", { mitte: [(VX0 + VX1) / 2, (VY0 + VY1) / 2 - AUSSEN, 8] });
    /* Konsolen (Zierguss) je Säule, in der Ebene quer zum Gleis */
    for (const x of SAEULEN) {
      M.flaeche({ name: "konsole" + x, o: [x, VY0, VZW + 0.05], u: [0, 1, 0], v: [0, 0, -1], w: VY1 - VY0, h: 1.3, beidseitig: true, keinLicht: true, keinAo: true, malen: (g, F) => {
        const L = belichter(F, 0.05);
        const ys = SAEULE_Y - VY0;                       // Säulenachse in Flächenkoordinaten
        const yd = (a) => (VZW + 0.05) - vdZ(VY0 + a) + 0.1;      // Unterkante Dach
        g.fillStyle = L([40, 46, 44]);
        /* Pfette über der Säule, Sparren darüber (Stirnseite) */
        g.fillRect(ys - 0.12, yd(ys) - 0.02, 0.24, 0.2);
        g.beginPath(); g.moveTo(0, yd(0)); g.lineTo(F.w, yd(F.w)); g.lineTo(F.w, yd(F.w) + 0.14); g.lineTo(0, yd(0) + 0.14); g.closePath(); g.fill();
        /* Bügen: geschwungene Streben mit Ring und Ranken */
        g.strokeStyle = L([40, 46, 44]); g.lineWidth = 0.05;
        const yk = yd(ys) + 0.9;
        g.beginPath(); g.moveTo(ys, yk); g.quadraticCurveTo(ys + 0.1, yd(ys + 0.9) + 0.2, ys + 1.1, yd(ys + 1.1) + 0.15); g.stroke();
        g.beginPath(); g.moveTo(ys, yk); g.quadraticCurveTo(ys - 0.05, yd(ys - 0.4) + 0.25, ys - 0.45, yd(ys - 0.45) + 0.15); g.stroke();
        g.lineWidth = 0.025;
        g.beginPath(); g.arc(ys + 0.45, yd(ys + 0.45) + 0.42, 0.14, 0, TAU); g.stroke();
        g.beginPath(); g.arc(ys + 0.8, yd(ys + 0.8) + 0.3, 0.08, 0, TAU); g.stroke();
        g.beginPath(); g.moveTo(ys + 0.2, yk - 0.2); g.bezierCurveTo(ys + 0.4, yk - 0.1, ys + 0.3, yk - 0.4, ys + 0.5, yk - 0.45); g.stroke();
        if (F.px > 20) { g.fillStyle = L([200, 170, 90]); g.beginPath(); g.arc(ys + 0.45, yd(ys + 0.45) + 0.42, 0.03, 0, TAU); g.fill(); }
      } });
    }
    if (Z.vordach < 0.7) return;
    /* Dachhaut */
    const vL = [0, VY0 - VY1, VZV - VZW], lang = Math.hypot(vL[1], vL[2]);
    M.flaeche({ name: "vd-dach", lichtExtra: winter ? 0.07 : 0, o: [VX1, VY1, VZW], u: [-1, 0, 0], v: nrm(vL), w: VX1 - VX0, h: lang, ebene: 1, malen: (g, F) => {
      if (winter) {
        schneeFlaeche(g, F, -0.05, -0.05, F.w + 0.1, F.h + 0.1, 51);
        g.fillStyle = "rgba(170,188,222,0.2)"; g.fillRect(-0.05, 0, F.w + 0.1, 0.25);
      } else pappeMalen(g, F, F.w, F.h, 52, true);
      schlagschatten(g, F, B, schattenKoerper("vordach"));
    } });
    if (Z.vordach < 0.9) return;
    /* Behang vorn und an den Seiten */
    const hB = 0.62;
    const mitLicht = winter && Z.fertig;
    M.flaeche({ name: "vd-behang", o: [VX1, VY0, VZV + 0.06], u: [-1, 0, 0], v: [0, 0, -1], w: VX1 - VX0, h: hB, keinLicht: true, keinAo: true, ebene: 2, malen: (g, F) => behangMalen(g, F, F.w, () => 0, Object.assign({ fertig: Z.fertig }, S), mitLicht), leuchten: mitLicht ? (g, F) => behangLicht(g, F, F.w, () => 0) : null });
    const seiteOben = (a) => (VZW + 0.06) - vdZ(VY0 + a);
    M.flaeche({ name: "vd-behang-w", o: [VX0, VY0, VZW + 0.06], u: [0, 1, 0], v: [0, 0, -1], w: VY1 - VY0, h: hB + (VZW - VZV), keinLicht: true, keinAo: true, ebene: 2, malen: (g, F) => behangMalen(g, F, F.w, seiteOben, Object.assign({ fertig: Z.fertig }, S), false) });
    M.flaeche({ name: "vd-behang-o", o: [VX1, VY1, VZW + 0.06], u: [0, -1, 0], v: [0, 0, -1], w: VY1 - VY0, h: hB + (VZW - VZV), keinLicht: true, keinAo: true, ebene: 2, malen: (g, F) => behangMalen(g, F, F.w, (a) => seiteOben(F.w - a), Object.assign({ fertig: Z.fertig }, S), false) });
  }
  /* Gusseisensäule: Sockel, kannelierter Schaft, Blattkapitell. Die
     beiden mittleren tragen je eine Bahnsteiglampe am Arm zum Gleis. */
  function saeuleFigur(hoehe, winter, opt) {
    opt = opt || {};
    return function (g, s, F) {
      const k = s, KZ = ST.KZ, H = hoehe * KZ * k;
      const gier = F.gier != null ? F.gier : (opt.B ? opt.B.gier : 0);
      const r = gier * RAD, c = Math.cos(r), sn = Math.sin(r);
      /* Arm zum Gleis (Modell −y) im Bild */
      const armX = (0.36 * sn + 0.36 * c) * ST.KX * k, armY = (0.36 * sn - 0.36 * c) * ST.KY * k;
      const zL = opt.lampeZ != null ? opt.lampeZ - opt.z0 : 0;
      const E = [0.6124 * (c + sn), 0.6124 * (c - sn), 0.5];
      if (F.schatten) {
        g.fillStyle = "#000"; g.fillRect(-0.06 * k, -H, 0.12 * k, H);
        g.fillRect(-0.16 * k, -H - 0.3 * k, 0.32 * k, 0.3 * k);
        if (opt.lampe) { g.beginPath(); g.moveTo(0, -zL * KZ * k - 0.3 * k); g.lineTo(armX, armY - zL * KZ * k - 0.3 * k); g.lineWidth = 0.04 * k; g.strokeStyle = "#000"; g.stroke(); g.fillRect(armX - 0.1 * k, armY - zL * KZ * k - 0.28 * k, 0.2 * k, 0.3 * k); }
        return;
      }
      const lL = ST.lichtFaktor([-0.707, 0.707, 0], F.Z, 0, F.jahr), lR = ST.lichtFaktor([0.707, -0.707, 0], F.Z, 0, F.jahr), lV = ST.lichtFaktor([0.707, 0.707, 0], F.Z, 0, F.jahr), lO = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
      const lit = (cc, l, a) => rgb([cc[0] * l[0], cc[1] * l[1], cc[2] * l[2]], a);
      const C = [52, 82, 68];
      const schaft = (x0, w, y0, y1) => {
        const gr = g.createLinearGradient(x0, 0, x0 + w, 0);
        gr.addColorStop(0, lit(hell(C, 0.2), lL)); gr.addColorStop(0.35, lit(hell(C, 0.08), lV)); gr.addColorStop(0.8, lit(hell(C, -0.2), lR)); gr.addColorStop(1, lit(hell(C, -0.35), lR));
        g.fillStyle = gr; g.fillRect(x0, y0, w, y1 - y0);
      };
      const lampe = () => {
        if (!opt.lampe) return;
        const yA = -zL * KZ * k;
        /* geschwungener Arm mit Ranke */
        g.strokeStyle = lit(C, lV); g.lineWidth = Math.max(1, 0.035 * k);
        g.beginPath(); g.moveTo(0, yA - 0.34 * k); g.quadraticCurveTo(armX * 0.5, yA - 0.46 * k + armY * 0.5, armX, armY + yA - 0.36 * k); g.stroke();
        g.lineWidth = Math.max(0.8, 0.018 * k);
        g.beginPath(); g.moveTo(0, yA - 0.14 * k); g.quadraticCurveTo(armX * 0.2, yA - 0.34 * k + armY * 0.2, armX * 0.6, armY * 0.6 + yA - 0.4 * k); g.stroke();
        /* Lampe: Schirm aus Emaille, darunter die Glasglocke */
        const lx = armX, ly = armY + yA - 0.36 * k;
        g.fillStyle = lit([40, 44, 42], lV); g.fillRect(lx - 0.01 * k, ly, 0.02 * k, 0.08 * k);
        g.fillStyle = lit([232, 232, 226], lO);
        g.beginPath(); g.moveTo(lx - 0.2 * k, ly + 0.2 * k); g.quadraticCurveTo(lx, ly + 0.02 * k, lx + 0.2 * k, ly + 0.2 * k); g.closePath(); g.fill();
        g.fillStyle = lit([34, 60, 50], lV); g.beginPath(); g.moveTo(lx - 0.08 * k, ly + 0.1 * k); g.quadraticCurveTo(lx, ly + 0.05 * k, lx + 0.08 * k, ly + 0.1 * k); g.lineTo(lx + 0.05 * k, ly + 0.12 * k); g.lineTo(lx - 0.05 * k, ly + 0.12 * k); g.closePath(); g.fill();
        const an = F.nacht > 0.05;
        g.fillStyle = an ? "rgba(255,236,190,0.95)" : lit([214, 220, 222], lV, 0.9);
        g.beginPath(); g.ellipse(lx, ly + 0.26 * k, 0.07 * k, 0.07 * k, 0, 0, TAU); g.fill();
        if (winter) { g.fillStyle = lit([246, 248, 253], lO); g.beginPath(); g.ellipse(lx, ly + 0.1 * k, 0.12 * k, 0.03 * k, 0, 0, TAU); g.fill(); }
        if (an) {
          const gg = g.createRadialGradient(lx, ly + 0.26 * k, 0, lx, ly + 0.26 * k, 0.3 * k);
          gg.addColorStop(0, "rgba(255,240,200," + (0.9 * F.nacht).toFixed(3) + ")"); gg.addColorStop(1, "rgba(255,190,110,0)");
          g.fillStyle = gg; g.fillRect(lx - 0.3 * k, ly - 0.04 * k, 0.6 * k, 0.6 * k);
          if (opt.pos && strahlFrei([opt.pos[0], opt.pos[1] - 0.36, opt.lampeZ - 0.3], E)) F.leuchtPunkt(lx, ly + 0.26 * k, 3.2 * k, "255,214,150", 0.55);
        }
      };
      g.save();
      if (opt.lampe && E[1] > 0) lampe();
      /* Sockel */
      schaft(-0.1 * k, 0.2 * k, -0.35 * KZ * k, 0);
      schaft(-0.08 * k, 0.16 * k, -0.45 * KZ * k, -0.33 * KZ * k);
      /* Schaft */
      schaft(-0.055 * k, 0.11 * k, -H + 0.35 * KZ * k, -0.45 * KZ * k);
      if (k > 18) {
        g.fillStyle = "rgba(0,0,0,0.22)";
        for (const x of [-0.03, 0, 0.03]) g.fillRect(x * k - 0.004 * k, -H + 0.4 * KZ * k, 0.008 * k, H - 0.9 * KZ * k);
        g.fillStyle = lit(hell(C, 0.15), lV); g.fillRect(-0.07 * k, -H * 0.62, 0.14 * k, 0.03 * k);
      }
      /* Kapitell mit Akanthus-Blättern */
      const yk = -H + 0.35 * KZ * k;
      g.fillStyle = lit(hell(C, 0.05), lV);
      g.beginPath(); g.moveTo(-0.055 * k, yk); g.quadraticCurveTo(-0.16 * k, yk - 0.12 * k, -0.15 * k, yk - 0.28 * k); g.lineTo(0.15 * k, yk - 0.28 * k); g.quadraticCurveTo(0.16 * k, yk - 0.12 * k, 0.055 * k, yk); g.closePath(); g.fill();
      if (k > 18) { g.fillStyle = lit(hell(C, -0.3), lR); for (const x of [-0.08, 0, 0.08]) { g.beginPath(); g.ellipse(x * k, yk - 0.14 * k, 0.03 * k, 0.1 * k, 0, 0, TAU); g.fill(); } }
      g.fillStyle = lit(hell(C, 0.2), lO); g.fillRect(-0.17 * k, yk - 0.34 * k, 0.34 * k, 0.07 * k);
      if (winter) {
        g.fillStyle = lit([246, 248, 253], lO); g.fillRect(-0.1 * k, -0.35 * KZ * k - 0.02 * k, 0.2 * k, 0.03 * k);
        /* Tannengrün um den Schaft mit roter Schleife */
        if (opt.schmuck) {
          const rng = zufall(opt.schmuck);
          g.fillStyle = lit([34, 70, 44], lV);
          g.beginPath();
          for (let i = 0; i < 28; i++) { const t = i / 28, y = -0.5 * KZ * k - t * (H - 0.9 * KZ * k), x = Math.sin(t * 14) * 0.07 * k; g.moveTo(x + 0.05 * k, y); g.ellipse(x, y, 0.05 * k, 0.025 * k, rng() * 3, 0, TAU); }
          g.fill();
          g.fillStyle = "rgb(176,20,36)"; const yb = -H * 0.72;
          g.beginPath(); g.moveTo(0, yb); g.quadraticCurveTo(-0.1 * k, yb - 0.07 * k, -0.09 * k, yb + 0.04 * k); g.closePath(); g.fill();
          g.beginPath(); g.moveTo(0, yb); g.quadraticCurveTo(0.1 * k, yb - 0.07 * k, 0.09 * k, yb + 0.04 * k); g.closePath(); g.fill();
          g.fillRect(-0.015 * k, yb, 0.012 * k, 0.14 * k); g.fillRect(0.005 * k, yb, 0.012 * k, 0.12 * k);
        }
      }
      if (opt.lampe && E[1] <= 0) lampe();
      g.restore();
    };
  }

  /* =====================================================================
     GLEIS: Schotterbett, Holzschwellen, Schienen (Profil S 49 mit Fuß,
     Steg und Kopf), Rippenplatten und Schwellenschrauben. Die Höhen
     (Schwelle 6 cm, Schiene 20 cm über dem Schotter) kommen über die
     Parallaxe – aus jedem Winkel richtig.
     ===================================================================== */
  function gleisMaler(B, S, Z) {
    return function (g, F) {
      const w = F.w, h = F.h, px = F.px, winter = S.winter && Z.fertig;
      const rng = zufall(91);
      /* Schotter: grau-braun, viele kleine Steine (gebündelt); im Winter
         liegt Schnee darüber, nur an den Flanken schaut Schotter heraus */
      g.fillStyle = "rgb(118,96,72)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      if (Z.schotter > 0) {
        const bisX = w * Z.schotter;
        g.save(); g.beginPath(); g.rect(-0.05, -0.05, bisX + 0.05, h + 0.1); g.clip();
        g.fillStyle = "rgb(122,116,108)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
        rausch(g, 0, 0, w, h, 1.1, 0.35, 5, 3);
        if (px > 10) {
          const n = Math.min(winter ? 2500 : 9000, Math.round(w * h * Math.min(90, px * 1.6)));
          const T = [[150, 144, 134], [104, 98, 92], [132, 124, 112], [168, 160, 150], [90, 86, 82]];
          const eimer = T.map(() => []);
          for (let i = 0; i < n; i++) eimer[(rng() * T.length) | 0].push([rng() * bisX, rng() * h, 0.018 + rng() * 0.025, rng() * 3]);
          for (let k = 0; k < T.length; k++) { g.fillStyle = rgb(T[k]); g.beginPath(); for (const [x, y, r, a] of eimer[k]) { g.moveTo(x + r, y); g.ellipse(x, y, r, r * 0.7, a, 0, TAU); } g.fill(); }
        }
        /* Rost- und Ölflecken zwischen den Schienen */
        const y0 = SCHIENEN[0] - (YG - BETT), y1 = SCHIENEN[1] - (YG - BETT);
        const gr = g.createLinearGradient(0, y0, 0, y1);
        gr.addColorStop(0, "rgba(96,58,34,0.25)"); gr.addColorStop(0.5, "rgba(40,30,24,0.28)"); gr.addColorStop(1, "rgba(96,58,34,0.25)");
        g.fillStyle = gr; g.fillRect(0, y0, bisX, y1 - y0);
        if (winter) {
          /* Schneedecke: in der Mitte geschlossen, zu den Flanken ausfransend */
          const sg = g.createLinearGradient(0, 0, 0, h);
          sg.addColorStop(0, "rgba(236,241,249,0.55)"); sg.addColorStop(0.12, "rgba(238,242,250,0.93)"); sg.addColorStop(0.88, "rgba(238,242,250,0.93)"); sg.addColorStop(1, "rgba(236,241,249,0.55)");
          g.fillStyle = sg; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
          rausch(g, 0, 0, w, h, 1.3, 0.1, 71, 3);
        }
        g.restore();
      }
      /* Schwellen */
      const yS0 = BETT - 1.3, yS1 = BETT + 1.3;
      const xStart = X_PRELL - GX0 + 0.18;
      const schwellen = [];
      for (let x = xStart; x < w - 0.1; x += 0.65) schwellen.push(x);
      const nS = Math.round(schwellen.length * Z.schwellen);
      if (nS > 0) {
        const p6 = parallaxe(F, B, -0.06), sv6 = F.schatten(0.06);
        const holz = [92, 70, 50];
        if (winter) {
          /* verschneite Schwellen: nur als flache Buckel mit Schattenkante */
          if (sv6) { g.fillStyle = "rgba(120,136,176,0.22)"; g.beginPath(); for (let i = 0; i < nS; i++) g.rect(schwellen[i] - 0.13 + sv6[0], yS0 + 0.1 + sv6[1], 0.26, yS1 - yS0 - 0.2); g.fill(); }
          g.fillStyle = "rgba(96,78,62,0.55)"; g.beginPath(); for (let i = 0; i < nS; i++) { g.rect(schwellen[i] - 0.13 + p6[0], yS0 + p6[1], 0.26, 0.12); g.rect(schwellen[i] - 0.13 + p6[0], yS1 - 0.12 + p6[1], 0.26, 0.12); } g.fill();
          g.fillStyle = "rgb(246,248,253)"; g.beginPath(); for (let i = 0; i < nS; i++) g.rect(schwellen[i] - 0.12 + p6[0], yS0 + 0.08 + p6[1], 0.24, yS1 - yS0 - 0.16); g.fill();
        } else {
          if (sv6) { g.fillStyle = "rgba(20,16,14,0.35)"; g.beginPath(); for (let i = 0; i < nS; i++) g.rect(schwellen[i] - 0.13 + sv6[0], yS0 + sv6[1], 0.26, yS1 - yS0); g.fill(); }
          g.fillStyle = rgb(hell(holz, -0.35)); g.beginPath(); for (let i = 0; i < nS; i++) g.rect(schwellen[i] - 0.13, yS0, 0.26, yS1 - yS0); g.fill();
          g.fillStyle = rgb(holz); g.beginPath(); for (let i = 0; i < nS; i++) g.rect(schwellen[i] - 0.13 + p6[0], yS0 + p6[1], 0.26, yS1 - yS0); g.fill();
          if (px > 16) {
            g.strokeStyle = rgb(hell(holz, -0.3), 0.6); g.lineWidth = Math.max(0.004, 0.8 / px);
            g.beginPath();
            for (let i = 0; i < nS; i++) { const x = schwellen[i] + p6[0]; for (const d of [-0.06, 0.02, 0.07]) { g.moveTo(x + d, yS0 + p6[1] + 0.05); g.lineTo(x + d + (rng() - 0.5) * 0.02, yS1 + p6[1] - 0.05); } }
            g.stroke();
          }
        }
      }
      /* Schienen */
      if (Z.schienen > 0) {
        const bisX = xStart - 0.2 + (w - xStart + 0.2) * Z.schienen;
        const p6 = parallaxe(F, B, -0.06), p19 = parallaxe(F, B, -0.19), p20 = parallaxe(F, B, -0.2);
        const sv = F.schatten(0.2);
        const x0 = xStart - 0.12;
        for (const ys of SCHIENEN) {
          const y = ys - (YG - BETT);
          if (sv) { g.fillStyle = winter ? "rgba(90,104,150,0.3)" : "rgba(20,16,14,0.4)"; poly(g, [[x0, y - 0.07], [bisX, y - 0.07], [bisX + sv[0], y + 0.07 + sv[1]], [x0 + sv[0], y + 0.07 + sv[1]]]); g.fill(); }
          /* Rippenplatten und Schrauben auf jeder Schwelle */
          if (px > 14 && nS > 0 && !winter) {
            g.fillStyle = "rgb(58,50,46)"; g.beginPath();
            for (let i = 0; i < nS; i++) { const x = schwellen[i]; if (x > bisX) break; g.rect(x - 0.1 + p6[0], y - 0.12 + p6[1], 0.2, 0.24); }
            g.fill();
            if (px > 30) { g.fillStyle = "rgb(34,30,28)"; g.beginPath(); for (let i = 0; i < nS; i++) { const x = schwellen[i]; if (x > bisX) break; for (const d of [-0.09, 0.09]) { g.moveTo(x + p6[0] + 0.02, y + d + p6[1]); g.arc(x + p6[0], y + d + p6[1], 0.02, 0, TAU); } } g.fill(); }
          }
          /* Fuß, Steg (Seite zur Kamera), Kopf */
          g.fillStyle = "rgb(84,58,42)";
          poly(g, [[x0 + p6[0], y - 0.075 + p6[1]], [bisX + p6[0], y - 0.075 + p6[1]], [bisX + p6[0], y + 0.075 + p6[1]], [x0 + p6[0], y + 0.075 + p6[1]]]); g.fill();
          if (winter) { g.fillStyle = "rgb(244,247,252)"; g.fillRect(x0 + p6[0], y - 0.1 + p6[1], bisX - x0, 0.045); g.fillRect(x0 + p6[0], y + 0.055 + p6[1], bisX - x0, 0.045); }
          const seite = p19[1] < 0 ? 0.035 : -0.035;
          g.fillStyle = "rgb(96,64,44)";
          poly(g, [[x0 + p6[0], y + seite + p6[1]], [bisX + p6[0], y + seite + p6[1]], [bisX + p19[0], y + seite + p19[1]], [x0 + p19[0], y + seite + p19[1]]]); g.fill();
          g.fillStyle = "rgb(120,82,58)";
          poly(g, [[x0 + p19[0], y - 0.036 + p19[1]], [bisX + p19[0], y - 0.036 + p19[1]], [bisX + p20[0], y + 0.036 + p20[1]], [x0 + p20[0], y + 0.036 + p20[1]]]); g.fill();
          /* blanke Lauffläche (im Winter vom letzten Zug freigefahren) */
          g.fillStyle = "rgb(214,216,220)"; g.fillRect(x0 + p20[0], y - 0.018 + p20[1], bisX - x0, 0.036);
          g.fillStyle = "rgba(255,255,255,0.5)"; g.fillRect(x0 + p20[0], y - 0.008 + p20[1], bisX - x0, 0.012);
        }
      }
      schlagschatten(g, F, B, schattenKoerper("gleis", Z));
    };
  }
  function gleisBauen(M, B, S, Z) {
    if (Z.schotter <= 0) return;
    const winter = S.winter;
    M.teil("gleis", { ebene: -1, mitte: [0, YG, 0.1], schatten: false });
    const y0 = YG - BETT;
    M.flaeche({ name: "schotter", o: [GX0, y0, Z_SCHOTTER], u: [1, 0, 0], v: [0, 1, 0], w: GX1 - GX0, h: 2 * BETT, malen: gleisMaler(B, S, Z) });
    /* Böschung auf der Feldseite */
    const vB = nrm([0, -0.75, -Z_SCHOTTER]);
    M.flaeche({ name: "boeschung", o: [GX1, y0, Z_SCHOTTER], u: [-1, 0, 0], v: vB, w: GX1 - GX0, h: Math.hypot(0.75, Z_SCHOTTER), malen: (g, F) => {
      g.fillStyle = winter ? "rgb(232,238,246)" : "rgb(118,110,100)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      rausch(g, 0, 0, F.w, F.h, 0.6, 0.35, 8, 3);
      if (!winter) { const rng = zufall(3); g.fillStyle = "rgba(70,100,50,0.5)"; g.beginPath(); for (let i = 0; i < F.w * 8; i++) { const x = rng() * F.w, y = F.h - rng() * 0.3; g.moveTo(x + 0.08, y); g.ellipse(x, y, 0.08, 0.04, 0, 0, TAU); } g.fill(); }
    } });
    /* Stirnseiten des Schotterbetts */
    for (const [x, n] of [[GX0, -1], [GX1, 1]]) {
      const um = [[0, 0], [2 * BETT, 0], [2 * BETT + 0.75, Z_SCHOTTER], [0, Z_SCHOTTER]];
      const o = n > 0 ? [x, YG + BETT, Z_SCHOTTER] : [x, y0 - 0.75, Z_SCHOTTER];
      const u = n > 0 ? [0, -1, 0] : [0, 1, 0];
      const umR = n > 0 ? um : [[0.75, 0], [2 * BETT + 0.75, 0], [2 * BETT + 0.75, Z_SCHOTTER], [0, Z_SCHOTTER]];
      M.flaeche({ name: "gleis-ende" + n, o: o, u: u, v: [0, 0, -1], w: 2 * BETT + 0.75, h: Z_SCHOTTER, umriss: umR, malen: (g, F) => { g.fillStyle = winter ? "rgb(226,232,242)" : "rgb(116,110,102)"; g.fillRect(0, 0, F.w, F.h); rausch(g, 0, 0, F.w, F.h, 0.5, 0.4, 9, 3); } });
    }
  }

  /* =====================================================================
     BAHNSTEIG: Granitkante, Kies, unter dem Dach Klinkerpflaster
     ===================================================================== */
  function bahnsteigBauen(M, B, S, Z) {
    if (Z.bahnsteig <= 0) return;
    const winter = S.winter;
    M.teil("bahnsteig", { ebene: -1, mitte: [0, (YK + HY0) / 2, 0.3], schatten: false });
    const zTop = Z_SCHOTTER + (ZB - Z_SCHOTTER) * Math.min(1, Z.bahnsteig * 1.5);
    const granit = (g, F) => {
      g.fillStyle = "rgb(150,148,144)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      const rng = zufall(4);
      for (let x = 0; x < F.w; x += 0.9 + rng() * 0.3) { g.fillStyle = rgb(PI.streu([164, 162, 158], rng, 0.08)); g.fillRect(x + 0.01, 0.01, 0.88, F.h - 0.02); }
      rausch(g, 0, 0, F.w, F.h, 0.5, 0.3, 11, 3);
      const gr = g.createLinearGradient(0, F.h, 0, 0); gr.addColorStop(0, "rgba(40,36,30,0.4)"); gr.addColorStop(1, "rgba(40,36,30,0)"); g.fillStyle = gr; g.fillRect(0, 0, F.w, F.h);
    };
    /* Vorderwand zum Gleis (nur über dem Schotter sichtbar) */
    wand(M, [XB1, YK, zTop], [0, -1, 0], XB1 - XB0, zTop - Z_SCHOTTER, granit, { name: "bst-v", keinAo: true });
    /* Rückwand, wo kein Haus steht */
    wand(M, [XB0, HY0, zTop], [0, 1, 0], HX0 - XB0, zTop, granit, { name: "bst-r1", ao: true });
    wand(M, [SX1, HY0, zTop], [0, 1, 0], XB1 - SX1, zTop, granit, { name: "bst-r2", ao: true });
    if (Z.bahnsteig < 1) {
      /* Auffüllung sichtbar */
      M.flaeche({ name: "bst-fuell", o: [XB0, YK, zTop], u: [1, 0, 0], v: [0, 1, 0], w: XB1 - XB0, h: HY0 - YK, malen: (g, F) => { g.fillStyle = "rgb(140,118,86)"; g.fillRect(0, 0, F.w, F.h); rausch(g, 0, 0, F.w, F.h, 0.8, 0.4, 3, 3); } });
      return;
    }
    const hB = HY0 - YK;
    M.flaeche({ name: "bst-oben", o: [XB0, YK, ZB], u: [1, 0, 0], v: [0, 1, 0], w: XB1 - XB0, h: hB, leuchten: Z.fertig ? (g, F) => pfuetzenMalen(g, F, B, bahnsteigPfuetzen(S), XB0, YK, JETZT.verdeckerBahnsteig) : null, malen: (g, F) => {
      const w = F.w, px = F.px, rng = zufall(12);
      /* Kies */
      g.fillStyle = "rgb(176,164,140)"; g.fillRect(-0.05, -0.05, w + 0.1, hB + 0.1);
      rausch(g, 0, 0, w, hB, 1.2, 0.3, 6, 3);
      if (px > 14) { g.fillStyle = "rgba(120,110,96,0.5)"; g.beginPath(); for (let i = 0; i < Math.min(5000, w * hB * px); i++) { const x = rng() * w, y = rng() * hB; g.moveTo(x + 0.012, y); g.arc(x, y, 0.012, 0, TAU); } g.fill(); }
      /* Klinkerpflaster unter dem Dach und vor dem Schuppen */
      const kx0 = VX0 - XB0, kx1 = SX1 - XB0, ky0 = VY0 - YK - 0.05;
      g.fillStyle = "rgb(110,58,44)"; g.fillRect(kx0, ky0, kx1 - kx0, hB - ky0);
      if (px * 0.1 > 2) {
        const eimer = [[], [], []];
        let r = 0;
        for (let y = ky0; y < hB; y += 0.1, r++) for (let x = kx0 - (r % 2) * 0.1; x < kx1; x += 0.2) eimer[(rng() * 3) | 0].push([Math.max(kx0, x) + 0.008, y + 0.008, Math.min(kx1, x + 0.2) - Math.max(kx0, x) - 0.016, 0.084]);
        const T = [[124, 64, 48], [104, 52, 40], [136, 76, 56]];
        for (let k = 0; k < 3; k++) { g.fillStyle = rgb(T[k]); g.beginPath(); for (const b of eimer[k]) if (b[2] > 0) g.rect(b[0], b[1], b[2], b[3]); g.fill(); }
      }
      /* Granitkante */
      g.fillStyle = "rgb(168,166,162)"; g.fillRect(-0.05, -0.02, w + 0.1, 0.42);
      for (let x = 0; x < w; x += 1.0) { g.fillStyle = "rgba(60,58,56,0.6)"; g.fillRect(x, -0.02, 0.012, 0.42); }
      g.fillStyle = "rgba(255,255,255,0.25)"; g.fillRect(-0.05, -0.02, w + 0.1, 0.03);
      if (winter) {
        /* Schnee: auf dem offenen Bahnsteig, unter dem Dach nur ein Hauch;
           an der Kante freigefegt */
        g.save();
        g.beginPath(); g.rect(-0.1, 0.42, w + 0.2, hB); g.rect(kx0, ky0 + 0.35, kx1 - kx0, hB - ky0); g.clip("evenodd");
        schneeFlaeche(g, F, -0.1, 0.42, w + 0.2, hB, 17);
        g.restore();
        g.fillStyle = "rgba(242,246,252,0.35)"; g.fillRect(kx0, ky0 + 0.35, kx1 - kx0, hB - ky0);
        /* Trittspuren entlang des Bahnsteigs */
        g.fillStyle = "rgba(150,164,196,0.35)";
        g.beginPath(); for (let x = 0.3; x < w; x += 0.34) { if (x > kx0 && x < kx1) continue; const y = 1.1 + Math.sin(x * 0.7) * 0.25 + ((x * 3) % 2 ? 0.12 : -0.12); g.moveTo(x + 0.06, y); g.ellipse(x, y, 0.06, 0.035, 0, 0, TAU); } g.fill();
      }
      schlagschatten(g, F, B, schattenKoerper("bahnsteig"));
    } });
    /* Rampen an den Enden */
    for (const s of [-1, 1]) {
      const xE = s < 0 ? XB0 : XB1;
      const v = nrm([s * XR, 0, -ZB]);
      const o = s < 0 ? [xE, YK, ZB] : [xE, HY0, ZB];
      const u = s < 0 ? [0, 1, 0] : [0, -1, 0];
      M.flaeche({ name: "rampe" + s, o: o, u: u, v: v, w: hB, h: Math.hypot(XR, ZB), malen: (g, F) => { g.fillStyle = winter ? "rgb(238,242,250)" : "rgb(170,158,136)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); rausch(g, 0, 0, F.w, F.h, 0.8, 0.3, 14, 3); } });
      /* Seitendreieck zur Gleisseite */
      const oT = s < 0 ? [xE, YK, ZB] : [xE + XR, YK, ZB];
      M.flaeche({ name: "rampe-s" + s, o: oT, u: [-1, 0, 0], v: [0, 0, -1], w: XR, h: ZB, umriss: s < 0 ? [[0, 0], [XR, ZB], [0, ZB]] : [[XR, 0], [XR, ZB], [0, ZB]], malen: granit, keinAo: true });
    }
  }
  /* Straßenseite: Pflaster des Vorplatzes, Freitreppe vor dem Eingang */
  function vorplatzBauen(M, B, S, Z) {
    if (!Z.moebel) return;
    const winter = S.winter;
    M.teil("vorplatz", { ebene: -1, schatten: false, mitte: [0, 7.4, 0] });
    /* Pflaster vor Empfangsgebäude und Güterschuppen (L-förmig: vor dem
       zurückgesetzten Schuppen reicht es bis an dessen Tor) */
    const PX0 = HX0 - 0.6, PX1 = SX1 + 0.3, y0 = SY1, y1 = 8.3, hP = y1 - y0;
    const umP = [[0, HY1 - y0], [HX1 - PX0, HY1 - y0], [HX1 - PX0, 0], [PX1 - PX0, 0], [PX1 - PX0, hP], [0, hP]];
    M.flaeche({ name: "pflaster", o: [PX0, y0, 0.01], u: [1, 0, 0], v: [0, 1, 0], w: PX1 - PX0, h: hP, umriss: umP, leuchten: Z.fertig ? (g, F) => pfuetzenMalen(g, F, B, vorplatzPfuetzen(), PX0, y0, JETZT.verdeckerPflaster) : null, malen: (g, F) => {
      const w = F.w, h = F.h, rng = zufall(8);
      g.fillStyle = "rgb(118,112,104)"; g.fillRect(0, 0, w, h);
      if (F.px * 0.14 > 2.5) {
        /* Kopfsteinpflaster in Reihen, gebündelt nach drei Tönen */
        const T = [[146, 140, 130], [132, 126, 118], [158, 150, 138]];
        const E = [[], [], []];
        let r = 0;
        for (let y = 0; y < h; y += 0.14, r++) for (let x = -(r % 2) * 0.07; x < w; x += 0.14) E[(rng() * 3) | 0].push([x + 0.012, y + 0.012]);
        for (let k = 0; k < 3; k++) { g.fillStyle = rgb(T[k]); g.beginPath(); for (const [x, y] of E[k]) g.rect(x, y, 0.116, 0.116); g.fill(); }
      }
      rausch(g, 0, 0, w, h, 1.5, 0.25, 4, 3);
      /* Bordstein zur Straße */
      g.fillStyle = "rgb(168,164,156)"; g.fillRect(0, h - 0.16, w, 0.16);
      g.fillStyle = "rgba(40,36,32,0.35)"; g.fillRect(0, h - 0.17, w, 0.015);
      if (winter) {
        /* festgetretener Schnee; zur Tür und vor dem Schuppentor
           freigeschaufelt, am Rand die aufgeworfenen Haufen */
        const tx = QX - PX0, sx = SX0 + 3.0 - PX0;
        g.save();
        g.beginPath(); g.rect(-0.1, -0.1, w + 0.2, h + 0.2);
        g.rect(tx - 0.8, HY1 - y0 - 0.1, 1.6, h - (HY1 - y0) + 0.2);
        g.rect(sx - 1.3, -0.1, 2.6, 1.3);
        g.clip("evenodd");
        schneeFlaeche(g, F, -0.1, -0.1, w + 0.2, h + 0.2, 23);
        /* Spuren: Fußtritte und zwei Schlittenkufen */
        g.fillStyle = "rgba(150,164,196,0.35)";
        g.beginPath(); for (let i = 0; i < w * 3; i++) { const x = rng() * w, y = h * 0.35 + rng() * h * 0.5; g.moveTo(x + 0.06, y); g.ellipse(x, y, 0.06, 0.035, rng() * 3, 0, TAU); } g.fill();
        g.strokeStyle = "rgba(150,164,196,0.4)"; g.lineWidth = 0.05;
        g.beginPath(); for (const d of [0, 0.42]) { g.moveTo(0, h - 0.9 + d); g.bezierCurveTo(w * 0.3, h - 0.78 + d, w * 0.6, h - 1.02 + d, w, h - 0.88 + d); } g.stroke();
        g.restore();
        /* aufgeworfene Schneehaufen an den Rändern des Wegs */
        g.fillStyle = "rgb(250,252,255)";
        for (const xr of [tx - 0.95, tx + 0.8]) { g.beginPath(); g.rect(xr, HY1 - y0, 0.15, h - (HY1 - y0) - 0.16); g.fill(); }
        g.fillStyle = "rgba(90,96,110,0.25)"; g.fillRect(tx - 0.8, HY1 - y0, 0.06, h - (HY1 - y0)); g.fillRect(sx - 1.3, 0, 2.6, 0.08);
        /* nasser Stein im geräumten Weg */
        g.fillStyle = "rgba(60,64,72,0.25)"; g.fillRect(tx - 0.8, HY1 - y0, 1.6, h - (HY1 - y0)); g.fillRect(sx - 1.3, 0, 2.6, 1.2);
      }
      schlagschatten(g, F, B, schattenKoerper("pflaster"));
    } });
    /* Freitreppe: drei Stufen aus Sandstein */
    M.teil("treppe", { mitte: [QX, HY1 + 0.6 + AUSSEN, 0.3], schatten: false });
    for (let i = 0; i < 3; i++) {
      const z1 = ZB - i * ZB / 3, yA = HY1 + i * 0.3;
      const st = (g, F) => { g.fillStyle = rgb(SANDSTEIN); g.fillRect(0, 0, F.w, F.h); rausch(g, 0, 0, F.w, F.h, 0.6, 0.3, 3 + i, 3); g.fillStyle = "rgba(255,240,220,0.3)"; g.fillRect(0, 0, F.w, 0.02); };
      kiste(M, QX - 1.0 - i * 0.12, yA, 0, QX + 1.0 + i * 0.12, yA + 0.3, z1, { s: st, o: st, w: st, t: winter ? schneeOben(st) : st }, { name: "st" + i, keinAo: true });
    }
  }
  /* Prellbock am Westende: gebogene Schienenstreben, Prellbalken,
     Schutzhaltscheibe (Sh 2: rotes Quadrat mit weißem Rand) */
  function prellbockBauen(M, S, Z) {
    if (Z.schienen < 1) return;
    const x0 = X_PRELL, winter = S.winter;
    M.teil("prellbock", { mitte: [x0 - 0.5, YG - AUSSEN, 0.8], schatten: false });
    const rost = () => (g, F) => { g.fillStyle = "rgb(88,58,42)"; g.fillRect(0, 0, F.w, F.h); g.fillStyle = "rgba(0,0,0,0.2)"; g.fillRect(0, F.h * 0.6, F.w, F.h * 0.4); if (winter) { g.fillStyle = "rgba(244,247,252,0.8)"; g.fillRect(0, 0, F.w, 0.02); } };
    for (const ys of SCHIENEN) {
      balken3(M, [x0, ys, Z_SCHIENE], [x0 - 0.5, ys, 1.0], [0, 1, 0], 0.07, 0.14, rost, { name: "pv" + ys, seiten: "QqRr" });
      balken3(M, [x0 - 1.5, ys, Z_SCHOTTER], [x0 - 0.5, ys, 1.0], [0, 1, 0], 0.07, 0.14, rost, { name: "ph" + ys, seiten: "QqRr" });
    }
    const balken = (g, F) => {
      holzMalen(g, F, 0, 0, F.w, F.h, [120, 90, 64], 5, {});
      if (F.flaeche.u[1] !== 0 && F.flaeche.u[2] === 0 && Math.abs(F.flaeche.u[1]) > 0.5) {
        /* rot-weiße Schrägstreifen auf der Stirn */
        g.save(); g.beginPath(); g.rect(0, 0, F.w, F.h); g.clip();
        for (let x = -F.h; x < F.w; x += 0.3) { g.fillStyle = "rgb(190,30,34)"; g.beginPath(); g.moveTo(x, F.h); g.lineTo(x + 0.15, F.h); g.lineTo(x + 0.15 + F.h, 0); g.lineTo(x + F.h, 0); g.closePath(); g.fill(); }
        g.restore();
      }
      if (winter) { g.fillStyle = "rgb(244,247,252)"; g.fillRect(0, 0, F.w, 0.04); }
    };
    kiste(M, x0 - 0.65, YG - 1.05, 0.9, x0 - 0.35, YG + 1.05, 1.22, { s: balken, n: balken, o: balken, w: balken, t: winter ? schneeOben(null) : balken }, { name: "pb", keinAo: true });
    /* Schutzhaltscheibe auf kurzem Pfosten */
    balken3(M, [x0 - 0.5, YG, 1.22], [x0 - 0.5, YG, 1.95], [0, 1, 0], 0.06, 0.06, () => (g, F) => { g.fillStyle = "rgb(60,60,60)"; g.fillRect(0, 0, F.w, F.h); }, { name: "shp", seiten: "QqRr" });
    M.flaeche({ name: "sh2", o: [x0 - 0.47, YG + 0.28, 2.05], u: [0, -1, 0], v: [0, 0, -1], w: 0.56, h: 0.56, keinAo: true, malen: (g, F) => {
      g.fillStyle = "rgb(250,250,250)"; g.fillRect(0, 0, F.w, F.h);
      g.fillStyle = "rgb(196,24,30)"; g.fillRect(0.07, 0.07, F.w - 0.14, F.h - 0.14);
      g.strokeStyle = "rgb(30,30,30)"; g.lineWidth = 0.015; g.strokeRect(0.005, 0.005, F.w - 0.01, F.h - 0.01);
      if (winter) { g.fillStyle = "rgb(244,247,252)"; g.fillRect(0, 0, F.w, 0.04); }
    } });
    M.flaeche({ name: "sh2-r", o: [x0 - 0.53, YG - 0.28, 2.05], u: [0, 1, 0], v: [0, 0, -1], w: 0.56, h: 0.56, keinAo: true, malen: "rgb(70,70,72)" });
  }

  /* =====================================================================
     VERDECKUNG UND SCHLAGSCHATTEN
     Der Kern malt Lichtschein und Leuchtschichten über alles, und Schatten
     nur auf den Boden unter dem Bild. Was hinter Haus, Schuppen oder
     Bahnsteigdach liegt, darf nicht durchscheinen (Strahltest zum Auge,
     ausgesparte Umrisse), und was auf Bahnsteig, Gleis und Pflaster
     Schatten wirft, malen wir selbst in diese Flächen.
     ===================================================================== */
  function koerperKasten(x0, y0, z0, x1, y1, z1) {
    return {
      pts: [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]],
      ebenen: [[[-1, 0, 0], -x0], [[1, 0, 0], x1], [[0, -1, 0], -y0], [[0, 1, 0], y1], [[0, 0, -1], -z0], [[0, 0, 1], z1]]
    };
  }
  /* Haus mit Satteldach, First entlang x (Traufe zT, First zF) */
  function koerperSattel(x0, y0, z0, x1, y1, zT, zF) {
    const ym = (y0 + y1) / 2, k = (zF - zT) / ((y1 - y0) / 2);
    const K = koerperKasten(x0, y0, z0, x1, y1, zF);
    K.ebenen.pop();
    K.ebenen.push([[0, k, 1], zF + k * ym], [[0, -k, 1], zF - k * ym]);
    K.pts = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, zT], [x1, y0, zT], [x1, y1, zT], [x0, y1, zT], [x0, ym, zF], [x1, ym, zF]];
    return K;
  }
  function koerperZwerch(z0) {
    const K = koerperKasten(QX - QB, HY0, z0, QX + QB, HYM, QF);
    K.ebenen.pop();
    K.ebenen.push([[1, 0, 1], QF + QX], [[-1, 0, 1], QF - QX]);
    K.pts = [[QX - QB, HY0, z0], [QX + QB, HY0, z0], [QX + QB, HYM, z0], [QX - QB, HYM, z0], [QX - QB, HY0, TR], [QX + QB, HY0, TR], [QX + QB, HYM, TR], [QX - QB, HYM, TR], [QX, HY0, QF], [QX, HYM, QF]];
    return K;
  }
  /* Pyramide (Christbaum): nur für Schatten */
  function koerperKegel(x, y, z0, r, z1) {
    return { pts: [[x - r, y - r, z0], [x + r, y - r, z0], [x + r, y + r, z0], [x - r, y + r, z0], [x, y, z1]], ebenen: [] };
  }
  /* Trifft der Strahl vom Punkt p zum Auge (Richtung E) den Körper? */
  function strahlTrifft(p, E, K) {
    if (!K.ebenen.length) return false;
    let t0 = 0.03, t1 = 1e9;
    for (const [n, d] of K.ebenen) {
      const den = dot(n, E), num = d - dot(n, p);
      if (Math.abs(den) < 1e-9) { if (num < 0) return false; continue; }
      const t = num / den;
      if (den > 0) { if (t < t1) t1 = t; } else if (t > t0) t0 = t;
      if (t0 > t1) return false;
    }
    return true;
  }
  /* Zustand des gerade gemalten Bahnhofs (die Maler laufen gleich nach bauen) */
  let JETZT = { verdecker: [], schatten: {} };
  function strahlFrei(p, E, liste) {
    for (const K of (liste || JETZT.verdecker)) if (strahlTrifft(p, E, K)) return false;
    return true;
  }
  /* Lichtschein nur anmelden, wenn die Stelle vom Auge aus zu sehen ist */
  function gepruefterSchein(F, B) {
    const f = F.flaeche, F2 = Object.create(F);
    F2.leuchtPunkt = function (a, b, r, farbe, k, fl) {
      const p = add(add(f.o, mul(f.u, a)), mul(f.v, b));
      if (strahlFrei(add(p, mul(kreuz(f.u, f.v), 0.05)), B.e)) F.leuchtPunkt(a, b, r, farbe, k, fl);
    };
    return F2;
  }
  /* Umrisse der Körper vor der Fläche (entlang der Blickrichtung auf die
     Fläche gelegt) aussparen: dort darf kein Licht der Fläche erscheinen */
  function aussparen(g, F, B, koerper) {
    const f = F.flaeche, n = kreuz(f.u, f.v), E = B.e, en = dot(n, E);
    if (en < 1e-3) return;
    for (const K of koerper) {
      const q = [];
      let vorn = false;
      for (const p of K.pts) {
        const d = dot(n, sub(p, f.o));
        if (d > 0.01) vorn = true;
        const r = sub(add(p, mul(E, -d / en)), f.o);
        q.push([dot(r, f.u), dot(r, f.v)]);
      }
      if (!vorn) continue;
      const H = huelle2(q);
      if (H.length < 3) continue;
      g.beginPath(); g.rect(-200, -200, 400, 400);
      g.moveTo(H[0][0], H[0][1]); for (let i = 1; i < H.length; i++) g.lineTo(H[i][0], H[i][1]); g.closePath();
      g.clip("evenodd");
    }
  }
  /* Richtung des Sonnenlichts im Modell (Versatz je Meter Abstieg) */
  function schattenRichtung(B) {
    const sx = -ST.LICHT[0] / ST.LICHT[2], sy = -ST.LICHT[1] / ST.LICHT[2];
    return [sx * B.c + sy * B.s, -sx * B.s + sy * B.c, -1];
  }
  function schattenKoerper(art) { return JETZT.schatten[art] || []; }
  /* Schlagschatten der Körper auf eine ebene Fläche (in Flächenkoordinaten) */
  function schlagschatten(g, F, B, koerper) {
    if (!koerper || !koerper.length) return;
    if (F.lichtN <= 0.04) return;
    const f = F.flaeche, n = kreuz(f.u, f.v), Ld = schattenRichtung(B), nL = dot(n, Ld);
    if (nL >= -1e-3) return;
    const a = (F.zeit && F.zeit.schatten != null ? F.zeit.schatten : 0.3) * (F.jahr === "winter" ? 1.12 : 1);
    g.save();
    g.beginPath();
    let irgend = false;
    for (const K of koerper) {
      const q = [];
      let vorn = false;
      for (const p of K.pts) {
        const d = dot(n, sub(p, f.o));
        let P = p;
        if (d > 0.002) { vorn = true; P = add(p, mul(Ld, -d / nL)); }
        const r = sub(P, f.o);
        q.push([dot(r, f.u), dot(r, f.v)]);
      }
      if (!vorn) continue;
      const H = huelle2(q);
      if (H.length < 3) continue;
      g.moveTo(H[0][0], H[0][1]); for (let i = 1; i < H.length; i++) g.lineTo(H[i][0], H[i][1]); g.closePath();
      irgend = true;
    }
    if (irgend) { g.fillStyle = "rgba(18,22,48," + a.toFixed(3) + ")"; g.fill(); }
    g.restore();
  }
  function mitSchatten(mal, B, art) {
    return function (g, F) { mal(g, F); schlagschatten(g, F, B, schattenKoerper(art)); };
  }

  /* =====================================================================
     AUSSTATTUNG DES BAHNSTEIGS
     ===================================================================== */
  const LATERNEN = [[-13.05, -2.75], [4.75, -2.95], [13.05, -2.75]];
  const LATERNE_H = 3.75;                              // Oberkante Laternenkopf über Bahnsteig
  const SCHILDER = [-11.2, 11.1];
  const SCHILD_Y = -3.2, SCHILD_B = 2.7, SCHILD_H = 0.56, SCHILD_Z = ZB + 1.95;
  const BAENKE = [[-11.2, -1.55, 1.8], [-5.7, -1.45, 1.6], [0.55, -1.45, 1.5], [11.1, -1.55, 1.8]];
  const CHRISTBAUM = [-8.5, -2.45], CHRISTBAUM_H = 3.5;
  const KARREN = [7.0, -2.95];
  const KANNEN = [8.95, -1.75];
  const KUEBEL = [[-7.0, -1.35], [3.15, -1.35]];

  /* Gaslaterne um 1900: Sockel, kannelierter Mast, Leiterstütze, Kopf aus
     Glas mit Haube; auf dem Glas der Ortsname. Nachts Schein (nur, wenn
     vom Auge aus zu sehen). Im Winter Tannengrün mit Schleife. */
  function laterneFigur(pos, S, Z, B) {
    return function (g, s, F) {
      const k = s, KZ = ST.KZ, h = (z) => -z * KZ * k;
      const H = LATERNE_H;
      if (F.schatten) {
        g.fillStyle = "#000";
        g.fillRect(-0.12 * k, h(0.5), 0.24 * k, 0.5 * KZ * k);
        g.fillRect(-0.045 * k, h(H - 0.7), 0.09 * k, (H - 1.2) * KZ * k);
        g.fillRect(-0.3 * k, h(2.72), 0.6 * k, 0.05 * k);
        g.beginPath(); g.moveTo(-0.14 * k, h(H - 0.72)); g.lineTo(-0.21 * k, h(H - 0.2)); g.lineTo(0, h(H + 0.05)); g.lineTo(0.21 * k, h(H - 0.2)); g.lineTo(0.14 * k, h(H - 0.72)); g.closePath(); g.fill();
        return;
      }
      const winter = S.winter && Z.fertig;
      const lL = ST.lichtFaktor([-0.707, 0.707, 0], F.Z, 0, F.jahr), lR = ST.lichtFaktor([0.707, -0.707, 0], F.Z, 0, F.jahr), lV = ST.lichtFaktor([0.707, 0.707, 0], F.Z, 0, F.jahr), lO = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
      const lit = (c, l, a) => rgb([c[0] * l[0], c[1] * l[1], c[2] * l[2]], a);
      const C = [44, 66, 56];
      const zyl = (x0, w, y0, y1, c) => {
        const gr = g.createLinearGradient(x0, 0, x0 + w, 0);
        gr.addColorStop(0, lit(hell(c, 0.18), lL)); gr.addColorStop(0.35, lit(hell(c, 0.06), lV)); gr.addColorStop(0.8, lit(hell(c, -0.2), lR)); gr.addColorStop(1, lit(hell(c, -0.35), lR));
        g.fillStyle = gr; g.fillRect(x0, y0, w, y1 - y0);
      };
      /* Sockel (achteckig, gestuft) und Mast */
      zyl(-0.12 * k, 0.24 * k, h(0.42), 0, C);
      zyl(-0.09 * k, 0.18 * k, h(0.62), h(0.4), C);
      g.fillStyle = lit(hell(C, 0.12), lO); g.fillRect(-0.13 * k, h(0.44), 0.26 * k, 0.03 * k);
      zyl(-0.045 * k, 0.09 * k, h(H - 0.72), h(0.6), C);
      if (k > 16) { g.fillStyle = "rgba(0,0,0,0.2)"; g.fillRect(-0.012 * k, h(H - 0.8), 0.006 * k, (H - 1.5) * KZ * k); g.fillRect(0.012 * k, h(H - 0.8), 0.006 * k, (H - 1.5) * KZ * k); }
      /* Ring und Leiterstütze */
      g.fillStyle = lit(hell(C, 0.1), lV); g.fillRect(-0.065 * k, h(1.5), 0.13 * k, 0.05 * k);
      g.fillStyle = lit(C, lV); g.fillRect(-0.3 * k, h(2.74), 0.6 * k, 0.035 * k);
      g.beginPath(); g.arc(-0.3 * k, h(2.72), 0.025 * k, 0, TAU); g.arc(0.3 * k, h(2.72), 0.025 * k, 0, TAU); g.fill();
      /* Kopf: Tragring, Glaskörper (nach oben weiter), Haube mit Knauf */
      const zK0 = H - 0.72, zK1 = H - 0.22;
      g.fillStyle = lit(C, lV);
      g.beginPath(); g.moveTo(-0.06 * k, h(zK0 - 0.05)); g.lineTo(0.06 * k, h(zK0 - 0.05)); g.lineTo(0.12 * k, h(zK0)); g.lineTo(-0.12 * k, h(zK0)); g.closePath(); g.fill();
      const an = Z.fertig && F.nacht > 0.05;
      const glas = g.createLinearGradient(-0.2 * k, 0, 0.2 * k, 0);
      if (an) { glas.addColorStop(0, "rgba(255,236,186,0.98)"); glas.addColorStop(0.5, "rgba(255,248,222,1)"); glas.addColorStop(1, "rgba(255,214,150,0.95)"); }
      else { glas.addColorStop(0, lit([200, 212, 222], lL, 0.9)); glas.addColorStop(0.5, lit([232, 238, 244], lV, 0.9)); glas.addColorStop(1, lit([150, 162, 176], lR, 0.9)); }
      g.fillStyle = glas;
      g.beginPath(); g.moveTo(-0.12 * k, h(zK0)); g.lineTo(0.12 * k, h(zK0)); g.lineTo(0.19 * k, h(zK1)); g.lineTo(-0.19 * k, h(zK1)); g.closePath(); g.fill();
      /* Sprossen des Kopfes */
      g.strokeStyle = lit(C, lV); g.lineWidth = Math.max(0.7, 0.018 * k);
      g.beginPath(); g.moveTo(-0.12 * k, h(zK0)); g.lineTo(-0.19 * k, h(zK1)); g.moveTo(0.12 * k, h(zK0)); g.lineTo(0.19 * k, h(zK1)); g.moveTo(0, h(zK0)); g.lineTo(0, h(zK1)); g.stroke();
      if (k > 30 && Z.fertig) {
        /* Ortsname auf dem Glas */
        g.fillStyle = an ? "rgba(90,50,20,0.8)" : "rgba(30,30,34,0.75)";
        g.font = "bold " + (0.05 * k).toFixed(2) + "px Georgia, 'Times New Roman', serif"; g.textAlign = "center"; g.textBaseline = "middle";
        g.fillText("Winterhausen", 0, h((zK0 + zK1) / 2 + 0.05));
      }
      /* Haube */
      g.fillStyle = lit(C, lV);
      g.beginPath(); g.moveTo(-0.23 * k, h(zK1)); g.lineTo(0.23 * k, h(zK1)); g.lineTo(0.06 * k, h(H)); g.lineTo(-0.06 * k, h(H)); g.closePath(); g.fill();
      g.fillStyle = lit(hell(C, -0.25), lR); g.beginPath(); g.moveTo(0, h(zK1)); g.lineTo(0.23 * k, h(zK1)); g.lineTo(0.06 * k, h(H)); g.lineTo(0, h(H)); g.closePath(); g.fill();
      g.fillStyle = lit(C, lV); g.fillRect(-0.035 * k, h(H + 0.08), 0.07 * k, 0.08 * KZ * k);
      g.beginPath(); g.arc(0, h(H + 0.11), 0.03 * k, 0, TAU); g.fill();
      if (winter) {
        g.fillStyle = lit([246, 248, 253], lO);
        g.beginPath(); g.moveTo(-0.25 * k, h(zK1) + 0.01 * k); g.quadraticCurveTo(-0.12 * k, h(H - 0.02), 0, h(H + 0.02)); g.quadraticCurveTo(0.14 * k, h(H - 0.02), 0.25 * k, h(zK1) + 0.01 * k); g.closePath(); g.fill();
        g.fillRect(-0.3 * k, h(2.74) - 0.02 * k, 0.6 * k, 0.025 * k);
        g.beginPath(); g.ellipse(0, h(0.44), 0.13 * k, 0.03 * k, 0, 0, TAU); g.fill();
        /* Tannengrün mit roter Schleife am Mast */
        const rng = zufall(Math.round(pos[0] * 10) + 50);
        g.fillStyle = lit([30, 66, 42], lV);
        g.beginPath();
        for (let i = 0; i < 18; i++) { const x = (rng() - 0.5) * 0.26 * k, y = h(2.5 + (rng() - 0.5) * 0.14); g.moveTo(x + 0.05 * k, y); g.ellipse(x, y, 0.05 * k, 0.018 * k, rng() * 3, 0, TAU); }
        g.fill();
        g.fillStyle = "rgb(176,20,36)";
        const yb = h(2.52);
        g.beginPath(); g.moveTo(0, yb); g.quadraticCurveTo(-0.09 * k, yb - 0.06 * k, -0.08 * k, yb + 0.04 * k); g.closePath(); g.fill();
        g.beginPath(); g.moveTo(0, yb); g.quadraticCurveTo(0.09 * k, yb - 0.06 * k, 0.08 * k, yb + 0.04 * k); g.closePath(); g.fill();
        g.fillRect(-0.012 * k, yb, 0.01 * k, 0.12 * k); g.fillRect(0.004 * k, yb, 0.01 * k, 0.1 * k);
      }
      if (an) {
        const zy = h((zK0 + zK1) / 2);
        const gg = g.createRadialGradient(0, zy, 0, 0, zy, 0.45 * k);
        gg.addColorStop(0, "rgba(255,238,200," + (0.75 * F.nacht).toFixed(3) + ")"); gg.addColorStop(1, "rgba(255,190,110,0)");
        g.fillStyle = gg; g.fillRect(-0.45 * k, zy - 0.45 * k, 0.9 * k, 0.9 * k);
        const r = (F.gier || 0) * RAD, E = [0.6124 * (Math.cos(r) + Math.sin(r)), 0.6124 * (Math.cos(r) - Math.sin(r)), 0.5];
        if (strahlFrei([pos[0], pos[1], ZB + H - 0.45], E)) F.leuchtPunkt(0, zy, 4.2 * k, "255,206,140", 0.75);
      }
    };
  }
  /* Stationsschild „Winterhausen": weiße Emailletafel mit schwarzer
     Antiqua, schwarzem Rand, auf zwei gusseisernen Pfosten; beidseitig */
  function schildBauen(M, S, Z, xm) {
    const winter = S.winter && Z.fertig;
    const x0 = xm - SCHILD_B / 2, x1 = xm + SCHILD_B / 2, y0 = SCHILD_Y - 0.03, y1 = SCHILD_Y + 0.03;
    const z0 = SCHILD_Z, z1 = SCHILD_Z + SCHILD_H;
    M.teil("schild" + xm, { mitte: [xm, SCHILD_Y - AUSSEN, 2.4], schatten: false });
    const pf = () => (g, F) => { g.fillStyle = "rgb(40,52,46)"; g.fillRect(0, 0, F.w, F.h); g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(0, 0, F.w, F.h * 0.25); };
    for (const x of [x0 + 0.12, x1 - 0.12]) {
      balken3(M, [x, SCHILD_Y, ZB], [x, SCHILD_Y, z1 + 0.12], [0, 1, 0], 0.07, 0.07, pf, { name: "sp" + x, seiten: "QqRr" });
    }
    const tafel = (g, F) => {
      const w = F.w, hh = F.h;
      g.fillStyle = "rgb(24,24,26)"; g.fillRect(0, 0, w, hh);
      g.fillStyle = "rgb(246,245,240)"; g.fillRect(0.04, 0.04, w - 0.08, hh - 0.08);
      g.strokeStyle = "rgb(24,24,26)"; g.lineWidth = 0.014; g.strokeRect(0.07, 0.07, w - 0.14, hh - 0.14);
      if (F.px > 5) {
        g.fillStyle = "rgb(20,20,22)";
        g.font = "bold 0.32px Georgia, 'Times New Roman', serif"; g.textAlign = "center"; g.textBaseline = "middle";
        if (g.letterSpacing !== undefined) g.letterSpacing = "0.02px";
        g.fillText("Winterhausen", w / 2, hh / 2 + 0.015);
        if (g.letterSpacing !== undefined) g.letterSpacing = "0px";
      }
      /* Emaille: leichter Glanz, am Rand Rostpunkte */
      const gl = g.createLinearGradient(0, 0, w, hh);
      gl.addColorStop(0, "rgba(255,255,255,0.18)"); gl.addColorStop(0.5, "rgba(255,255,255,0)"); gl.addColorStop(1, "rgba(0,0,0,0.06)");
      g.fillStyle = gl; g.fillRect(0, 0, w, hh);
      if (F.px > 40) { g.fillStyle = "rgba(120,70,40,0.5)"; for (const [a, b] of [[0.05, 0.08], [w - 0.08, hh - 0.06], [w * 0.4, 0.05]]) { g.beginPath(); g.arc(a, b, 0.012, 0, TAU); g.fill(); } }
      if (winter) { g.fillStyle = "rgba(246,248,253,0.95)"; g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(w, 0.03); for (let a = w; a > 0; a -= 0.2) g.lineTo(a - 0.1, 0.03 + (Math.sin(a * 7) + 1) * 0.012); g.lineTo(0, 0.03); g.closePath(); g.fill(); }
    };
    const kante = (g, F) => { g.fillStyle = "rgb(30,30,32)"; g.fillRect(0, 0, F.w, F.h); };
    kiste(M, x0, y0, z0, x1, y1, z1, { s: tafel, n: tafel, o: kante, w: kante, t: winter ? (g, F) => { g.fillStyle = "rgb(246,248,253)"; g.fillRect(0, 0, F.w, F.h); } : kante }, { name: "tafel" + xm, keinAo: true });
    /* Tannenzweig mit Schleife oben auf der Tafel (Winter) */
    if (winter) {
      M.figur({ x: xm, y: SCHILD_Y, z: z1, breite: 1.2, hoehe: 0.35, schatten: false, malen(g, s, F) {
        if (F.schatten) return;
        const k = s, rng = zufall(Math.round(xm * 3) + 9);
        const lf = ST.lichtFaktor([0.707, 0.707, 0], F.Z, 0, F.jahr);
        g.fillStyle = rgb([30 * lf[0] * 1.2, 70 * lf[1] * 1.2, 44 * lf[2] * 1.2]);
        g.beginPath();
        for (let i = 0; i < 26; i++) { const x = (rng() - 0.5) * 0.7 * k, y = -rng() * 0.12 * k; g.moveTo(x + 0.06 * k, y); g.ellipse(x, y, 0.06 * k, 0.02 * k, (rng() - 0.5) * 0.8, 0, TAU); }
        g.fill();
        g.fillStyle = "rgb(178,20,36)";
        g.beginPath(); g.moveTo(0, -0.05 * k); g.quadraticCurveTo(-0.1 * k, -0.12 * k, -0.09 * k, 0); g.closePath(); g.fill();
        g.beginPath(); g.moveTo(0, -0.05 * k); g.quadraticCurveTo(0.1 * k, -0.12 * k, 0.09 * k, 0); g.closePath(); g.fill();
        g.fillStyle = "rgba(246,248,253,0.9)";
        for (let i = 0; i < 8; i++) { g.beginPath(); g.ellipse((rng() - 0.5) * 0.6 * k, -0.08 * k - rng() * 0.05 * k, 0.04 * k, 0.012 * k, 0, 0, TAU); g.fill(); }
      } });
    }
  }
  /* Bahnsteigbank: gusseiserne Wangen, Sitz und Lehne aus Holzlatten */
  function bankBauen(M, S, Z, x, y, L, i) {
    const winter = S.winter && Z.fertig;
    const y0 = y - 0.3, zS = ZB + 0.46;
    const HB = [124, 88, 56], GUSS = [40, 50, 46];
    M.teil("bank" + i, { mitte: [x, y - AUSSEN, ZB + 0.45], schatten: false });
    const wange = (g, F) => {
      const L_ = belichter(F, 0.05);
      g.strokeStyle = L_(GUSS); g.lineCap = "round"; g.lineWidth = 0.045;
      g.beginPath();
      g.moveTo(0.1, F.h - 0.01); g.quadraticCurveTo(0.03, F.h - 0.3, 0.08, F.h - 0.47);      // Vorderbein
      g.moveTo(0.02, F.h - 0.48); g.lineTo(0.47, F.h - 0.5);                                  // Sitzträger
      g.moveTo(0.5, F.h - 0.01); g.quadraticCurveTo(0.44, F.h - 0.4, 0.5, F.h - 0.5); g.quadraticCurveTo(0.56, F.h - 0.75, 0.6, F.h - 0.93);   // Hinterbein und Lehne
      g.stroke();
      g.lineWidth = 0.02;
      g.beginPath(); g.arc(0.26, F.h - 0.33, 0.1, Math.PI * 1.1, Math.PI * 2.4); g.stroke();       // Schnörkel
      g.beginPath(); g.arc(0.52, F.h - 0.66, 0.06, 0, TAU); g.stroke();
      if (winter) { g.strokeStyle = L_([246, 248, 253]); g.lineWidth = 0.02; g.beginPath(); g.moveTo(0.58, F.h - 0.95); g.lineTo(0.61, F.h - 0.93); g.stroke(); }
    };
    for (const xs of [x - L / 2 + 0.12, x + L / 2 - 0.12]) M.flaeche({ name: "bw" + i + xs, o: [xs, y0, ZB + 0.95], u: [0, 1, 0], v: [0, 0, -1], w: 0.62, h: 0.95, beidseitig: true, keinLicht: true, keinAo: true, malen: wange });
    const latten = (n, quer) => (g, F) => {
      const L_ = belichter(F, 0.02), rng = zufall(i * 7 + n);
      const b = F.h / n;
      for (let k = 0; k < n; k++) {
        g.fillStyle = L_(PI.streu(HB, rng, 0.06));
        g.fillRect(0, k * b + 0.012, F.w, b - 0.024);
        if (F.px > 30) { g.fillStyle = L_(hell(HB, -0.3), 0.6); g.fillRect(0, k * b + b - 0.03, F.w, 0.012); }
        if (winter) { g.fillStyle = L_([246, 248, 253], 0.95); g.fillRect(0, k * b + 0.012, F.w, (b - 0.024) * (quer ? 0.4 : 0.85)); }
      }
    };
    M.flaeche({ name: "bs" + i, o: [x - L / 2, y0 + 0.04, zS], u: [1, 0, 0], v: [0, 1, 0], w: L, h: 0.42, keinLicht: true, keinAo: true, malen: latten(4, false) });
    M.flaeche({ name: "bv" + i, o: [x + L / 2, y0 + 0.04, zS], u: [-1, 0, 0], v: [0, 0, -1], w: L, h: 0.04, keinAo: true, malen: (g, F) => { g.fillStyle = rgb(hell(HB, -0.15)); g.fillRect(0, 0, F.w, F.h); } });
    const vL = nrm([0, -0.1, -0.4]);
    M.flaeche({ name: "bl" + i, o: [x + L / 2, y0 + 0.58, ZB + 0.93], u: [-1, 0, 0], v: vL, w: L, h: 0.4, beidseitig: true, keinLicht: true, keinAo: true, malen: latten(3, true) });
  }
  /* Gepäckkarren: zwei große Räder in der Mitte, zwei kleine vorn,
     Deichsel, Koffer und Überseekiste; im Winter Pakete mit Schleife */
  function karrenBauen(M, S, Z) {
    const winter = S.winter && Z.fertig;
    const [xm, ym] = KARREN, x0 = xm - 1.0, x1 = xm + 1.0, y0 = ym - 0.45, y1 = ym + 0.45, zb = ZB + 0.42;
    const HK = [118, 86, 58];
    M.teil("karren", { mitte: [xm, ym - AUSSEN, 0.9], schatten: false });
    const bretter = (saat) => (g, F) => { bretterMalen(g, F, 0, 0, F.w, F.h, HK, saat, { breite: 0.15, richtung: "v" }); if (winter && F.flaeche.u[2] === 0 && F.flaeche.v[2] === 0) { g.fillStyle = "rgba(244,247,252,0.85)"; g.fillRect(0, 0, F.w, F.h); } };
    const eisen = (g, F) => { g.fillStyle = rgb(EISEN); g.fillRect(0, 0, F.w, F.h); };
    kiste(M, x0, y0, zb, x1, y1, zb + 0.08, { s: eisen, n: eisen, o: eisen, w: eisen, t: bretter(3) }, { name: "kb", keinAo: true });
    /* Räder */
    const rad = (x, y, r, name) => {
      M.flaeche({ name: name, o: [x - r, y, ZB + 2 * r], u: [1, 0, 0], v: [0, 0, -1], w: 2 * r, h: 2 * r, umriss: Array.from({ length: 18 }, (_, i) => [r + r * Math.cos(i / 18 * TAU), r + r * Math.sin(i / 18 * TAU)]), beidseitig: true, keinAo: true, keinLicht: true, malen: (g, F) => {
        const L_ = belichter(F, 0.04);
        g.strokeStyle = L_([34, 34, 36]); g.lineWidth = 0.05; g.beginPath(); g.arc(r, r, r - 0.025, 0, TAU); g.stroke();
        g.strokeStyle = L_([60, 48, 36]); g.lineWidth = 0.03; g.beginPath(); for (let i = 0; i < 10; i++) { const a = i * TAU / 10; g.moveTo(r, r); g.lineTo(r + Math.cos(a) * (r - 0.04), r + Math.sin(a) * (r - 0.04)); } g.stroke();
        g.fillStyle = L_([40, 40, 42]); g.beginPath(); g.arc(r, r, 0.05, 0, TAU); g.fill();
        if (winter) { g.strokeStyle = L_([246, 248, 253]); g.lineWidth = 0.03; g.beginPath(); g.arc(r, r, r - 0.01, Math.PI * 1.2, Math.PI * 1.8); g.stroke(); }
      } });
    };
    for (const y of [y0 - 0.03, y1 + 0.03]) { rad(xm - 0.15, y, 0.44, "rg" + y); rad(x1 - 0.2, y, 0.16, "rk" + y); }
    /* Stirngitter an der hinteren Seite und Deichsel vorn */
    const holz = () => (g, F) => { holzMalen(g, F, 0, 0, F.w, F.h, hell(HK, -0.1), 4, { ohneAst: true }); };
    for (const y of [y0 + 0.05, y1 - 0.05]) balken3(M, [x0 + 0.05, y, zb + 0.08], [x0 + 0.05, y, zb + 0.7], [1, 0, 0], 0.06, 0.06, holz, { name: "kp" + y, seiten: "QqRr" });
    for (const z of [zb + 0.4, zb + 0.68]) balken3(M, [x0 + 0.05, y0 + 0.05, z], [x0 + 0.05, y1 - 0.05, z], [1, 0, 0], 0.05, 0.06, holz, { name: "kq" + z, seiten: "QqR" });
    balken3(M, [x1, ym, zb + 0.02], [x1 + 0.95, ym, zb + 0.55], [0, 1, 0], 0.05, 0.05, holz, { name: "kd", seiten: "QqR" });
    balken3(M, [x1 + 0.95, ym - 0.22, zb + 0.55], [x1 + 0.95, ym + 0.22, zb + 0.55], [1, 0, 0], 0.045, 0.045, holz, { name: "kg", seiten: "QqR" });
    /* Ladung */
    const leder = (c, riemen, saat) => (g, F) => {
      const L_ = belichter(F, 0.03);
      g.fillStyle = L_(c); g.fillRect(0, 0, F.w, F.h);
      rausch(g, 0, 0, F.w, F.h, 0.4, 0.25, saat, 3);
      if (riemen && F.px > 10) {
        g.fillStyle = L_([46, 30, 20]);
        for (const t of [0.25, 0.75]) g.fillRect(F.w * t - 0.025, 0, 0.05, F.h);
        g.fillStyle = L_([200, 164, 84]);
        for (const t of [0.25, 0.75]) g.fillRect(F.w * t - 0.03, F.h * 0.45, 0.06, 0.05);
        g.fillStyle = L_([180, 150, 80]); const e = Math.min(0.06, F.h * 0.3);
        for (const [a, b] of [[0, 0], [F.w - e, 0], [0, F.h - e], [F.w - e, F.h - e]]) g.fillRect(a, b, e, e);
      }
      if (winter && F.flaeche.v[2] === 0) { g.fillStyle = "rgba(246,248,253,0.9)"; g.fillRect(0, 0, F.w, F.h); }
    };
    const kz = zb + 0.08;
    const K1 = [60, 44, 34], K2 = [120, 72, 40];
    kiste(M, x0 + 0.15, y0 + 0.08, kz, x0 + 1.05, y0 + 0.66, kz + 0.52, { s: leder(K1, true, 1), n: leder(K1, true, 2), o: leder(K1, true, 3), w: leder(K1, true, 4), t: leder(hell(K1, 0.05), true, 5) }, { name: "koffer1", keinLicht: true, keinAo: true });
    kiste(M, x0 + 1.12, y0 + 0.14, kz, x0 + 1.72, y0 + 0.56, kz + 0.2, { s: leder(K2, true, 6), n: leder(K2, true, 7), o: leder(K2, true, 8), w: leder(K2, true, 9), t: leder(hell(K2, 0.08), true, 10) }, { name: "koffer2", keinLicht: true, keinAo: true });
    if (winter) {
      /* Weihnachtspakete: Packpapier mit roter Kordel */
      const paket = (saat) => (g, F) => {
        const L_ = belichter(F, 0.03);
        g.fillStyle = L_([190, 160, 116]); g.fillRect(0, 0, F.w, F.h);
        g.fillStyle = L_([186, 24, 36]); g.fillRect(F.w / 2 - 0.02, 0, 0.04, F.h); if (F.flaeche.v[2] === 0) g.fillRect(0, F.h / 2 - 0.02, F.w, 0.04);
        if (F.flaeche.v[2] === 0) { g.fillStyle = "rgba(246,248,253,0.8)"; g.fillRect(0, 0, F.w, F.h * 0.6); }
      };
      kiste(M, x0 + 1.15, y0 + 0.14, kz + 0.2, x0 + 1.6, y0 + 0.5, kz + 0.44, { s: paket(1), n: paket(2), o: paket(3), w: paket(4), t: paket(5) }, { name: "paket1", keinLicht: true, keinAo: true });
      kiste(M, x0 + 0.3, y0 + 0.2, kz + 0.52, x0 + 0.72, y0 + 0.52, kz + 0.72, { s: paket(6), n: paket(7), o: paket(8), w: paket(9), t: paket(10) }, { name: "paket2", keinLicht: true, keinAo: true });
    }
  }
  /* Milchkannen (Figur, rundum gleich) */
  function kannenFigur(S, Z) {
    return function (g, s, F) {
      const k = s, KZ = ST.KZ;
      const kannen = [[-0.2, 0.08], [0.18, 0.02], [0.02, -0.14]].sort((a, b) => a[1] - b[1]);
      if (F.schatten) { g.fillStyle = "#000"; for (const [dx] of kannen) g.fillRect((dx - 0.16) * k, -0.66 * KZ * k, 0.32 * k, 0.66 * KZ * k); return; }
      const lL = ST.lichtFaktor([-0.707, 0.707, 0], F.Z, 0, F.jahr), lR = ST.lichtFaktor([0.707, -0.707, 0], F.Z, 0, F.jahr), lO = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
      const lit = (c, l, a) => rgb([c[0] * l[0], c[1] * l[1], c[2] * l[2]], a);
      const winter = S.winter && Z.fertig;
      for (const [dx, dy] of kannen) {
        const cx = dx * k, cy = dy * k * 0.5;
        const gr = g.createLinearGradient(cx - 0.16 * k, 0, cx + 0.16 * k, 0);
        gr.addColorStop(0, lit([200, 204, 206], lL)); gr.addColorStop(0.3, lit([236, 238, 240], lL)); gr.addColorStop(0.7, lit([150, 156, 160], lR)); gr.addColorStop(1, lit([110, 114, 118], lR));
        g.fillStyle = gr;
        g.beginPath();
        g.moveTo(cx - 0.16 * k, cy); g.lineTo(cx - 0.16 * k, cy - 0.42 * KZ * k); g.quadraticCurveTo(cx - 0.16 * k, cy - 0.52 * KZ * k, cx - 0.08 * k, cy - 0.56 * KZ * k);
        g.lineTo(cx - 0.08 * k, cy - 0.64 * KZ * k); g.lineTo(cx + 0.08 * k, cy - 0.64 * KZ * k); g.lineTo(cx + 0.08 * k, cy - 0.56 * KZ * k);
        g.quadraticCurveTo(cx + 0.16 * k, cy - 0.52 * KZ * k, cx + 0.16 * k, cy - 0.42 * KZ * k); g.lineTo(cx + 0.16 * k, cy); g.closePath(); g.fill();
        g.fillStyle = lit([120, 124, 128], lR, 0.8); g.fillRect(cx - 0.16 * k, cy - 0.06 * KZ * k, 0.32 * k, 0.03 * k); g.fillRect(cx - 0.16 * k, cy - 0.34 * KZ * k, 0.32 * k, 0.02 * k);
        g.fillStyle = lit([176, 180, 184], lO); g.beginPath(); g.ellipse(cx, cy - 0.65 * KZ * k, 0.1 * k, 0.035 * k, 0, 0, TAU); g.fill();
        g.strokeStyle = lit([90, 94, 98], lR); g.lineWidth = Math.max(0.6, 0.015 * k);
        g.beginPath(); g.moveTo(cx - 0.16 * k, cy - 0.44 * KZ * k); g.quadraticCurveTo(cx - 0.24 * k, cy - 0.46 * KZ * k, cx - 0.16 * k, cy - 0.5 * KZ * k); g.stroke();
        if (winter) { g.fillStyle = lit([246, 248, 253], lO); g.beginPath(); g.ellipse(cx, cy - 0.67 * KZ * k, 0.11 * k, 0.045 * k, 0, 0, TAU); g.fill(); }
      }
    };
  }
  /* Pflanzkübel aus einem halben Fass: im Frühling Geranien, im Winter
     eine kleine Fichte mit roter Schleife */
  function kuebelFigur(S, Z, saat) {
    return function (g, s, F) {
      const k = s, KZ = ST.KZ, winter = S.winter;
      const lL = ST.lichtFaktor([-0.707, 0.707, 0], F.Z, 0, F.jahr), lR = ST.lichtFaktor([0.707, -0.707, 0], F.Z, 0, F.jahr), lO = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr), lV = ST.lichtFaktor([0.707, 0.707, 0], F.Z, 0, F.jahr);
      const lit = (c, l, a) => rgb([c[0] * l[0], c[1] * l[1], c[2] * l[2]], a);
      const hK = 0.46 * KZ * k, r = 0.3 * k;
      if (F.schatten) {
        g.fillStyle = "#000"; g.fillRect(-r, -hK, 2 * r, hK);
        if (winter) { g.beginPath(); g.moveTo(-0.32 * k, -hK); g.lineTo(0, -hK - 0.95 * KZ * k); g.lineTo(0.32 * k, -hK); g.closePath(); g.fill(); }
        else { g.beginPath(); g.ellipse(0, -hK - 0.1 * k, 0.36 * k, 0.16 * k, 0, 0, TAU); g.fill(); }
        return;
      }
      const HK = [128, 90, 56];
      const gr = g.createLinearGradient(-r, 0, r, 0);
      gr.addColorStop(0, lit(hell(HK, 0.1), lL)); gr.addColorStop(0.4, lit(HK, lV)); gr.addColorStop(1, lit(hell(HK, -0.3), lR));
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(-r * 0.9, 0); g.quadraticCurveTo(-r * 1.02, -hK * 0.5, -r, -hK); g.lineTo(r, -hK); g.quadraticCurveTo(r * 1.02, -hK * 0.5, r * 0.9, 0); g.closePath(); g.fill();
      if (k > 14) { g.strokeStyle = "rgba(40,24,14,0.4)"; g.lineWidth = Math.max(0.5, 0.008 * k); g.beginPath(); for (let x = -0.8; x <= 0.81; x += 0.2) { g.moveTo(x * r, -2); g.lineTo(x * r * 1.05, -hK + 2); } g.stroke(); }
      g.fillStyle = lit([36, 36, 38], lV); g.fillRect(-r * 0.98, -hK * 0.3, 1.96 * r, 0.035 * k); g.fillRect(-r * 1.0, -hK * 0.8, 2 * r, 0.035 * k);
      g.fillStyle = lit([60, 44, 30], lO); g.beginPath(); g.ellipse(0, -hK, r, 0.1 * k, 0, 0, TAU); g.fill();
      const rng = zufall(saat);
      if (winter) {
        /* Fichte, Schnee, Schleife */
        const hT = 0.95 * KZ * k;
        for (let i = 0; i < 5; i++) {
          const y = -hK - hT * (i / 5), b = 0.3 * k * (1 - i / 5.5);
          g.fillStyle = lit([28 + i * 3, 62 + i * 4, 40], i % 2 ? lR : lL);
          g.beginPath(); g.moveTo(-b, y); g.lineTo(0, y - hT * 0.34); g.lineTo(b, y); g.closePath(); g.fill();
          g.fillStyle = lit([246, 248, 253], lO, 0.95); g.beginPath(); g.moveTo(-b * 0.9, y - 0.01 * k); g.lineTo(0, y - hT * 0.3); g.lineTo(b * 0.2, y - hT * 0.2); g.lineTo(-b * 0.3, y - 0.02 * k); g.closePath(); g.fill();
        }
        g.fillStyle = "rgb(178,20,36)"; const yb = -hK - 0.06 * k;
        g.beginPath(); g.moveTo(0, yb); g.quadraticCurveTo(-0.1 * k, yb - 0.07 * k, -0.09 * k, yb + 0.03 * k); g.closePath(); g.fill();
        g.beginPath(); g.moveTo(0, yb); g.quadraticCurveTo(0.1 * k, yb - 0.07 * k, 0.09 * k, yb + 0.03 * k); g.closePath(); g.fill();
        g.fillStyle = lit([246, 248, 253], lO); g.beginPath(); g.ellipse(0, -hK - 0.01 * k, r * 0.9, 0.06 * k, 0, 0, TAU); g.fill();
      } else {
        g.fillStyle = lit([58, 104, 44], lV);
        g.beginPath(); for (let i = 0; i < 40; i++) { const a = rng() * TAU, rr = rng() * 0.3 * k; const x = Math.cos(a) * rr, y = -hK - 0.06 * k - Math.abs(Math.sin(a)) * rr * 0.6 - rng() * 0.08 * k; g.moveTo(x + 0.05 * k, y); g.ellipse(x, y, 0.05 * k, 0.035 * k, rng() * 3, 0, TAU); } g.fill();
        g.fillStyle = lit([200, 30, 44], lV);
        g.beginPath(); for (let i = 0; i < 16; i++) { const x = (rng() - 0.5) * 0.5 * k, y = -hK - 0.12 * k - rng() * 0.18 * k; g.moveTo(x + 0.035 * k, y); g.arc(x, y, 0.035 * k, 0, TAU); } g.fill();
        g.fillStyle = lit([244, 240, 236], lV);
        g.beginPath(); for (let i = 0; i < 6; i++) { const x = (rng() - 0.5) * 0.5 * k, y = -hK - 0.1 * k - rng() * 0.16 * k; g.moveTo(x + 0.03 * k, y); g.arc(x, y, 0.03 * k, 0, TAU); } g.fill();
      }
    };
  }
  /* Christbaum auf dem Bahnsteig: Fichte, Schnee auf den Zweigen, rote
     und goldene Kugeln, warmweiße Lichter, Stern. Nachts leuchtet er. */
  function christbaumFigur(S, Z) {
    return function (g, s, F) {
      const k = s, KZ = ST.KZ, H = CHRISTBAUM_H * KZ * k, R = 1.15 * k;
      const lagen = 9;
      const ast = (i) => { const t = i / lagen; return { y: -0.35 * KZ * k - (H - 0.5 * KZ * k) * t, b: R * (1 - t * 0.92) }; };
      if (F.schatten) {
        g.fillStyle = "#000";
        g.beginPath(); g.moveTo(-R, -0.35 * KZ * k); g.lineTo(0, -H - 0.2 * k); g.lineTo(R, -0.35 * KZ * k); g.closePath(); g.fill();
        g.fillRect(-0.3 * k, -0.4 * KZ * k, 0.6 * k, 0.4 * KZ * k);
        return;
      }
      const lL = ST.lichtFaktor([-0.707, 0.707, 0], F.Z, 0, F.jahr), lR = ST.lichtFaktor([0.707, -0.707, 0], F.Z, 0, F.jahr), lO = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr), lV = ST.lichtFaktor([0.707, 0.707, 0], F.Z, 0, F.jahr);
      const lit = (c, l, a) => rgb([c[0] * l[0], c[1] * l[1], c[2] * l[2]], a);
      const rng = zufall(404);
      /* Holzkreuz-Ständer mit Tannengrün verkleidet */
      g.fillStyle = lit([96, 70, 46], lV); g.fillRect(-0.32 * k, -0.12 * KZ * k, 0.64 * k, 0.12 * KZ * k);
      g.fillStyle = lit([70, 50, 34], lV); g.fillRect(-0.05 * k, -0.45 * KZ * k, 0.1 * k, 0.35 * KZ * k);
      /* Zweiglagen von hinten (oben) nach vorn: je Lage eine gezackte Silhouette */
      const lagePfad = (y, b, hh, zack) => {
        g.beginPath(); g.moveTo(-b, y);
        const n = Math.max(5, Math.round(b / k * 9));
        for (let i = 0; i <= n; i++) { const t = i / n, x = -b + 2 * b * t; g.lineTo(x, y + (i % 2 ? 0.05 * k : -0.02 * k) * zack); }
        g.lineTo(b * 0.2, y - hh); g.lineTo(0, y - hh * 1.08); g.lineTo(-b * 0.2, y - hh); g.closePath();
      };
      for (let i = lagen - 1; i >= 0; i--) {
        const { y, b } = ast(i), hh = (H / lagen) * 1.9;
        const gr = g.createLinearGradient(-b, 0, b, 0);
        gr.addColorStop(0, lit([34, 76, 46], lL)); gr.addColorStop(0.45, lit([26, 62, 38], lV)); gr.addColorStop(1, lit([14, 36, 24], lR));
        g.fillStyle = gr; lagePfad(y, b, hh, 1); g.fill();
        /* Schnee auf den Zweigspitzen der Lage */
        if (S.winter) {
          g.fillStyle = lit([244, 247, 253], lO, 0.95);
          g.beginPath();
          const n = Math.max(4, Math.round(b / k * 5));
          for (let j = 0; j < n; j++) { const x = -b * 0.92 + 1.84 * b * (j + rng() * 0.5) / n, yy = y - 0.05 * k - Math.abs(x) / b * 0.02 * k - rng() * 0.05 * k; g.moveTo(x + 0.09 * k, yy); g.ellipse(x, yy, 0.09 * k * (0.6 + rng() * 0.5), 0.025 * k, 0, 0, TAU); }
          g.fill();
        }
      }
      /* Kugeln (rot, gold) mit Glanzpunkt */
      const kugeln = [];
      for (let i = 0; i < 26; i++) { const t = 0.08 + rng() * 0.82, b = R * (1 - t * 0.92) * 0.85; kugeln.push([(rng() * 2 - 1) * b, -0.35 * KZ * k - (H - 0.5 * KZ * k) * t, rng() < 0.6]); }
      for (const [x, y, rot] of kugeln) { g.fillStyle = rot ? lit([196, 24, 34], lV) : lit([214, 170, 70], lV); g.beginPath(); g.arc(x, y, 0.055 * k, 0, TAU); g.fill(); }
      g.fillStyle = "rgba(255,255,255,0.6)"; for (const [x, y] of kugeln) { g.beginPath(); g.arc(x - 0.018 * k, y - 0.018 * k, 0.016 * k, 0, TAU); g.fill(); }
      /* Lichterkette in Bögen */
      const lichter = [];
      for (let i = 0; i < 44; i++) { const t = 0.06 + (i / 44) * 0.88, b = R * (1 - t * 0.92) * 0.9, u = Math.sin(i * 1.9) ; lichter.push([u * b, -0.35 * KZ * k - (H - 0.5 * KZ * k) * t + Math.cos(i * 1.9) * 0.03 * k]); }
      const an = F.nacht > 0.05 && Z.fertig;
      g.fillStyle = an ? "rgb(255,240,196)" : "rgb(236,226,190)";
      g.beginPath(); for (const [x, y] of lichter) { g.moveTo(x + 0.018 * k, y); g.arc(x, y, 0.018 * k, 0, TAU); } g.fill();
      if (an) {
        for (const [x, y] of lichter) { const gg = g.createRadialGradient(x, y, 0, x, y, 0.09 * k); gg.addColorStop(0, "rgba(255,236,180," + (0.8 * F.nacht).toFixed(3) + ")"); gg.addColorStop(1, "rgba(255,190,90,0)"); g.fillStyle = gg; g.fillRect(x - 0.09 * k, y - 0.09 * k, 0.18 * k, 0.18 * k); }
      }
      /* Stern auf der Spitze */
      const ys = -H - 0.12 * k;
      g.fillStyle = an ? "rgb(255,232,150)" : lit([226, 186, 80], lV);
      g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = (i % 2 ? 0.07 : 0.17) * k; g.lineTo(Math.cos(a) * rr, ys + Math.sin(a) * rr); } g.closePath(); g.fill();
      if (an) {
        const r = (F.gier || 0) * RAD, E = [0.6124 * (Math.cos(r) + Math.sin(r)), 0.6124 * (Math.cos(r) - Math.sin(r)), 0.5];
        if (strahlFrei([CHRISTBAUM[0], CHRISTBAUM[1], ZB + CHRISTBAUM_H * 0.5], E)) {
          F.leuchtPunkt(0, -H * 0.45, 2.8 * k, "255,214,150", 0.5);
          F.leuchtPunkt(0, ys, 1.2 * k, "255,236,170", 0.6);
        }
      }
    };
  }
  function ausstattungBauen(M, B, S, Z) {
    const winter = S.winter && Z.fertig;
    for (const [x, y] of LATERNEN) {
      M.teil("laterne" + x, { mitte: [x, y - AUSSEN, 2], schatten: false });
      M.figur({ x: x, y: y, z: ZB, breite: 1.0, hoehe: LATERNE_H + 0.2, schatten: false, malen: laterneFigur([x, y], S, Z, B) });
    }
    for (const x of SCHILDER) schildBauen(M, S, Z, x);
    BAENKE.forEach(([x, y, L], i) => bankBauen(M, S, Z, x, y, L, i));
    karrenBauen(M, S, Z);
    M.teil("kannen", { mitte: [KANNEN[0], KANNEN[1] - AUSSEN, 0.9], schatten: false });
    M.figur({ x: KANNEN[0], y: KANNEN[1], z: ZB, breite: 1.2, hoehe: 0.8, schatten: false, malen: kannenFigur(S, Z) });
    KUEBEL.forEach(([x, y], i) => {
      M.teil("kuebel" + i, { mitte: [x, y - AUSSEN, 0.9], schatten: false });
      M.figur({ x: x, y: y, z: ZB, breite: 1.4, hoehe: winter ? 1.5 : 0.8, schatten: false, malen: kuebelFigur(S, Z, 11 + i) });
    });
    if (winter) {
      M.teil("christbaum", { mitte: [CHRISTBAUM[0], CHRISTBAUM[1] - AUSSEN, 2], schatten: false });
      M.figur({ x: CHRISTBAUM[0], y: CHRISTBAUM[1], z: ZB, breite: 2.4, hoehe: CHRISTBAUM_H + 0.3, schatten: false, malen: christbaumFigur(S, Z) });
    }
  }

  /* =====================================================================
     LICHTPFÜTZEN (nachts): Laternen, Säulenlampen, Türen und Fenster
     werfen warmes Licht auf Bahnsteig und Vorplatz. Was vom Haus oder
     Schuppen verdeckt ist, bleibt ausgespart.
     ===================================================================== */
  function pfuetzenMalen(g, F, B, liste, ox, oy, verdecker) {
    const a = F.nacht;
    if (a <= 0.02) return;
    g.save();
    aussparen(g, F, B, verdecker);
    g.globalCompositeOperation = "lighter";
    for (const [x, y, r, k, farbe] of liste) {
      const cx = x - ox, cy = y - oy, c = farbe || "255,188,110";
      const gr = g.createRadialGradient(cx, cy, 0, cx, cy, r);
      gr.addColorStop(0, "rgba(" + c + "," + (0.4 * a * k).toFixed(3) + ")"); gr.addColorStop(0.45, "rgba(" + c + "," + (0.15 * a * k).toFixed(3) + ")"); gr.addColorStop(1, "rgba(" + c + ",0)");
      g.fillStyle = gr; g.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    }
    g.restore();
  }
  function bahnsteigPfuetzen(S) {
    const L = [];
    for (const [x, y] of LATERNEN) L.push([x, y, 3.4, 0.85, "255,206,140"]);
    for (const x of [SAEULEN[1], SAEULEN[2]]) L.push([x, SAEULE_Y - 0.4, 2.6, 0.8, "255,214,150"]);
    L.push([QX, HY0 - 0.9, 1.8, 0.55], [1.85, HY0 - 0.7, 1.2, 0.35]);
    for (const x of [-6.5, -4.9, 0.15]) L.push([x, HY0 - 0.6, 1.2, 0.3]);
    if (S.winter) L.push([CHRISTBAUM[0], CHRISTBAUM[1], 2.4, 0.55, "255,210,150"]);
    return L;
  }
  function vorplatzPfuetzen() {
    const L = [[QX, HY1 + 1.2, 2.8, 0.75], [QX + 1.15, HY1 + 0.9, 2.2, 0.5, "255,206,140"]];
    for (const x of [-6.3, -4.7, 0.7, 2.3]) L.push([x, HY1 + 0.7, 1.3, 0.3]);
    return L;
  }

  /* =====================================================================
     DAS EMPFANGSGEBÄUDE: jede Wand als zwei Flächen – Erdgeschoss
     (Backstein) und Obergeschoss mit Giebel (Fachwerk). So kann das
     offene Fachwerk im Bau durchsichtig sein, das Mauerwerk nicht.
     ===================================================================== */
  const DW = 0.38;                                     // Mauerstärke Erdgeschoss (1½ Stein)
  const Z_OG = EG1 + 0.15;                             // Oberkante Gurtgesims = Fuß des Fachwerks
  function hausBauen(M, B, S, Z) {
    M.teil("haus", { mitte: HAUS_M });
    const offen = !Z.dach;
    for (const W of WAENDE) {
      const u = kreuz(W.n, Z3), top = W.top, um = wandUmriss(W);
      const zE = Math.min(Z_OG, Z.mauerZ);
      if (zE > W.zU + 0.01) {
        const e = schneide(um, (p) => p[1] - (top - zE));
        if (e.length >= 3) M.flaeche({ name: "eg-" + W.name, o: W.o, u: u, v: [0, 0, -1], w: W.L, h: top - W.zU, umriss: e, malen: hausWandMaler(W, B, S, Z, "eg"), leuchten: Z.fertig ? hausWandLeuchten(W, B, S, Z, "eg") : null, ao: true });
      }
      if (Z.fw > 0) {
        let og = schneide(um, (p) => (top - Z_OG) - p[1]);
        if (Z.fwZ < top - 0.01) og = schneide(og, (p) => p[1] - (top - Z.fwZ));
        if (og.length >= 3) M.flaeche({ name: "og-" + W.name, o: W.o, u: u, v: [0, 0, -1], w: W.L, h: top - W.zU, umriss: og, malen: hausWandMaler(W, B, S, Z, "og"), leuchten: Z.fertig ? hausWandLeuchten(W, B, S, Z, "og") : null, keinLicht: Z.ausfachung <= 0, beidseitig: offen, keinAo: true, traufe: W.name === "strasse" && Z.dach ? UE : 0, traufeY: 0 });
      }
    }
    if (offen) rohbauInnen(M, B, S, Z);
  }
  /* Öffnungen einer Wand in Modellkoordinaten (für die Innenseiten) */
  function oeffnungen(W) {
    const u = kreuz(W.n, Z3), L = [];
    const punkt = (a) => add(W.o, mul(u, a));
    for (const a of W.egF) L.push({ p: punkt(a), w: FEN_EG.w, z0: FEN_EG.z, z1: FEN_EG.z + FEN_EG.h });
    for (const T of W.tueren) L.push({ p: punkt(T.a), w: T.w, z0: ZB, z1: ZB + T.h });
    return L;
  }
  function rohbauInnen(M, B, S, Z) {
    const x0 = HX0 + DW, x1 = HX1 - DW, y0 = HY0 + DW, y1 = HY1 - DW;
    const bis = Math.min(Z_OG, Z.mauerZ);
    const winter = S.winter;
    const schnee = (g, F, a) => { if (winter) { g.fillStyle = "rgba(242,246,252," + (a || 0.75) + ")"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); } };
    const ogDa = Z.fw > 0;
    if (!ogDa) {
      /* Boden des Erdgeschosses (Beton), Innenseiten und Mauerkronen */
      M.flaeche({ name: "boden-eg", o: [x0, y0, ZB + 0.01], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, ebene: -1, malen: (g, F) => { g.fillStyle = "rgb(158,156,150)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); rausch(g, 0, 0, F.w, F.h, 1.3, 0.25, 31, 3); schnee(g, F, 0.6); } });
      if (bis > ZB + 0.03) {
        const innen = [
          { W: WAENDE[0], o: [x0, y0, bis], n: [0, 1, 0], L: x1 - x0 },
          { W: WAENDE[1], o: [x1, y1, bis], n: [0, -1, 0], L: x1 - x0 },
          { W: WAENDE[2], o: [x0, y1, bis], n: [1, 0, 0], L: y1 - y0 },
          { W: WAENDE[3], o: [x1, y0, bis], n: [-1, 0, 0], L: y1 - y0 }
        ];
        for (const I of innen) {
          const ui = kreuz(I.n, Z3), hoch = bis - ZB;
          const offen = oeffnungen(I.W).map((q) => ({ a: dot(sub(q.p, I.o), ui), w: q.w, z0: q.z0, z1: q.z1 }));
          wand(M, I.o, I.n, I.L, hoch, (g, F) => {
            g.save();
            g.beginPath(); g.rect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
            for (const q of offen) if (q.z0 < bis) g.rect(q.a - q.w / 2, bis - Math.min(bis, q.z1), q.w, Math.min(bis, q.z1) - q.z0);
            g.clip("evenodd");
            backsteinMalen(g, F, 0, 0, F.w, F.h, { saat: 70 + I.L * 3 });
            g.fillStyle = "rgba(40,26,20,0.22)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
            const lf = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
            g.globalCompositeOperation = "multiply";
            g.fillStyle = rgb([lf[0] * 255, lf[1] * 255, lf[2] * 255]); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
            g.globalCompositeOperation = "source-over";
            /* Stürze aus Sandstein über den Öffnungen */
            g.fillStyle = rgb([SANDSTEIN[0] * lf[0] * 0.85, SANDSTEIN[1] * lf[1] * 0.85, SANDSTEIN[2] * lf[2] * 0.85]);
            for (const q of offen) if (q.z1 < bis) g.fillRect(q.a - q.w / 2 - 0.1, bis - q.z1 - 0.2, q.w + 0.2, 0.2);
            g.restore();
          }, { name: "in-" + I.W.name, keinLicht: true, keinAo: true });
        }
        /* Mauerkronen: frisch gemauert, Mörtel sichtbar */
        const krone = (g, F) => {
          g.fillStyle = "rgb(188,180,166)"; g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04);
          if (F.px * LB > 2.5) {
            const rng = zufall(Math.round(F.w * 100));
            g.fillStyle = rgb(ZIEGEL); g.beginPath();
            const lang = F.w > F.h;
            if (lang) for (let x = 0; x < F.w; x += LL) { g.rect(x + 0.005, 0.01, LL - 0.01, F.h / 2 - 0.015); g.rect(x + 0.005 + (rng() < 0.5 ? LB : 0), F.h / 2 + 0.005, LL - 0.01, F.h / 2 - 0.015); }
            else for (let y = 0; y < F.h; y += LL) { g.rect(0.01, y + 0.005, F.w / 2 - 0.015, LL - 0.01); g.rect(F.w / 2 + 0.005, y + 0.005 + (rng() < 0.5 ? LB : 0), F.w / 2 - 0.015, LL - 0.01); }
            g.fill();
          } else { g.fillStyle = rgb(hell(ZIEGEL, 0.05)); g.fillRect(0, 0, F.w, F.h); }
          schnee(g, F, 0.85);
        };
        const k = (o, w, h, n) => M.flaeche({ name: "krone-" + n, o: o, u: [1, 0, 0], v: [0, 1, 0], w: w, h: h, malen: krone, ebene: 1, keinAo: true });
        const zK = bis;
        k([HX0, HY0, zK], HX1 - HX0, DW, "n");
        k([HX0, HY1 - DW, zK], HX1 - HX0, DW, "s");
        k([HX0, HY0 + DW, zK], DW, HY1 - HY0 - 2 * DW, "w");
        k([HX1 - DW, HY0 + DW, zK], DW, HY1 - HY0 - 2 * DW, "o");
      }
    }
    /* Dielenboden des Obergeschosses, später der Dachboden */
    const diele = (g, F) => { bretterMalen(g, F, 0, 0, F.w, F.h, HOLZ_ROH, 44, { richtung: "v", breite: 0.2 }); schnee(g, F, 0.8); };
    if (ogDa) M.flaeche({ name: "diele-og", o: [HX0 + 0.2, HY0 + 0.2, Z_OG + 0.02], u: [1, 0, 0], v: [0, 1, 0], w: HX1 - HX0 - 0.4, h: HY1 - HY0 - 0.4, malen: diele, ebene: -1 });
    if (Z.bau >= 0.5) M.flaeche({ name: "diele-db", o: [HX0 + 0.2, HY0 + 0.2, TR + 0.02], u: [1, 0, 0], v: [0, 1, 0], w: HX1 - HX0 - 0.4, h: HY1 - HY0 - 0.4, malen: diele, ebene: -1 });
  }
  /* Solange der Bahnsteig fehlt, sieht man den Sockel der Gleisseite
     (Haus und Schuppen) bis zum Boden */
  function gleisSockelBauen(M, B, S, Z) {
    if (Z.bahnsteig >= 1 || Z.bau < 0.14) return;
    const zU = Z.bahnsteig > 0 ? Z_SCHOTTER + (ZB - Z_SCHOTTER) * Math.min(1, Z.bahnsteig * 1.5) : 0;
    const zO = Math.min(ZB, Math.max(Z.mauerZ, 0));
    if (zO - zU < 0.02) return;
    const mal = (saat) => (g, F) => { backsteinMalen(g, F, 0, 0, F.w, F.h, { saat: saat }); };
    M.teil("gleissockel", { mitte: [HAUS_M[0], HY0 - 0.2, 0.3], schatten: false });
    wand(M, [HX1, HY0, zO], [0, -1, 0], HX1 - HX0, zO - zU, mal(81), { name: "gs-haus", ao: true });
    if (Z.schuppenZ > 0.01) wand(M, [SX1, SY0, Math.min(zO, Z.schuppenZ)], [0, -1, 0], SX1 - SX0, Math.min(zO, Z.schuppenZ) - zU, mal(82), { name: "gs-schuppen", ao: true });
  }

  /* =====================================================================
     BAUGRUBE UND FUNDAMENT
     ===================================================================== */
  const GRUBE = [HX0 - 0.7, HY0 - 0.7, SX1 + 0.7, HY1 + 0.7];
  function grubeBauen(M, B, S, Z) {
    const R = GRUBE, T = Math.max(0.05, Z.grubeT), winter = S.winter;
    const [x0, y0, x1, y1] = R;
    const ex = { keinLicht: true, keinAo: true };
    M.teil("baugrube", { ebene: -3, mitte: [0, 0, -3], schatten: false });
    const wandMal = (saat) => (g, F) => {
      g.save();
      if (!lochClip(g, F, B, R)) { g.restore(); return; }
      erdeMalen(g, F, F.w, F.h, saat, winter);
      grubenSchatten(g, F, R, F.w, F.h);
      g.restore();
    };
    M.flaeche(Object.assign({ name: "gb", o: [x0, y0, -T], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, ebene: -1, malen: (g, F) => {
      g.save();
      if (!lochClip(g, F, B, R)) { g.restore(); return; }
      const L = belichter(F, 0.05);
      g.fillStyle = L([118, 88, 60]); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      if (F.px > 6) rausch(g, 0, 0, F.w, F.h, 1.2, 0.3, 17, 3);
      /* Fahrspuren des Baggers */
      if (F.px > 6) { g.strokeStyle = L([90, 66, 44], 0.6); g.lineWidth = 0.35; g.beginPath(); g.moveTo(1, F.h - 1); g.quadraticCurveTo(F.w * 0.4, F.h * 0.4, F.w - 2, 1.5); g.stroke(); }
      if (winter) { g.fillStyle = L([236, 240, 248], 0.5); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); }
      grubenSchatten(g, F, R, F.w, F.h);
      g.restore();
    } }, ex));
    wand(M, [x0, y0, 0], [0, 1, 0], x1 - x0, T, wandMal(101), Object.assign({ name: "gw-n" }, ex));
    wand(M, [x1, y1, 0], [0, -1, 0], x1 - x0, T, wandMal(102), Object.assign({ name: "gw-s" }, ex));
    wand(M, [x1, y0, 0], [-1, 0, 0], y1 - y0, T, wandMal(103), Object.assign({ name: "gw-o" }, ex));
    wand(M, [x0, y1, 0], [1, 0, 0], y1 - y0, T, wandMal(104), Object.assign({ name: "gw-w" }, ex));
    /* Streifenfundamente unter allen Wänden: erst Schalung, dann Beton */
    if (Z.fundament > 0) {
      const zt = -T + T * glatt(Z.fundament);
      const hF = zt + T;
      const nass = Z.bau < 0.115;
      const beton = (g, F) => {
        g.save(); if (!lochClip(g, F, B, R)) { g.restore(); return; }
        const L = belichter(F, 0.03), w = F.w, h = F.h;
        if (Z.fundament < 0.5) bretterMalen(g, F, 0, 0, w, h, [150, 118, 80], 5, { breite: 0.2 });
        else {
          g.fillStyle = L(nass ? [128, 128, 124] : [170, 168, 160]); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
          if (F.px > 8) {
            rausch(g, 0, 0, w, h, 1.1, 0.25, 40, 3);
            /* Abdrücke der Schalbretter und Spannstellen */
            g.strokeStyle = L([118, 116, 110], 0.6); g.lineWidth = Math.max(0.005, 0.7 / F.px);
            g.beginPath(); for (let y = 0.2; y < h; y += 0.2) { g.moveTo(0, y); g.lineTo(w, y); } g.stroke();
            g.fillStyle = L([70, 70, 68]); g.beginPath(); for (let x = 0.5; x < w; x += 1.0) { g.moveTo(x + 0.012, h * 0.5); g.arc(x, h * 0.5, 0.012, 0, TAU); } g.fill();
          }
        }
        g.restore();
      };
      const fx0 = HX0 - 0.15, fx1 = SX1 + 0.15, fy0 = HY0 - 0.15, fy1 = HY1 + 0.15;
      if (hF > 0.02) {
        const exF = { keinLicht: true, keinAo: true };
        wand(M, [fx0, fy1, zt], [0, 1, 0], fx1 - fx0, hF, beton, Object.assign({ name: "f-s" }, exF));
        wand(M, [fx1, fy0, zt], [0, -1, 0], fx1 - fx0, hF, beton, Object.assign({ name: "f-n" }, exF));
        wand(M, [fx1, fy1, zt], [1, 0, 0], fy1 - fy0, hF, beton, Object.assign({ name: "f-o" }, exF));
        wand(M, [fx0, fy0, zt], [-1, 0, 0], fy1 - fy0, hF, beton, Object.assign({ name: "f-w" }, exF));
        M.flaeche({ name: "f-t", o: [fx0, fy0, zt], u: [1, 0, 0], v: [0, 1, 0], w: fx1 - fx0, h: fy1 - fy0, ebene: 1, malen: (g, F) => {
          const w = F.w, h = F.h;
          g.fillStyle = nass ? "rgb(112,114,116)" : "rgb(174,172,164)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
          if (F.px > 8) rausch(g, 0, 0, w, h, 0.9, 0.2, 31, 3);
          /* Bewehrung, solange betoniert wird; die Mauerlinien angerissen */
          if (Z.fundament < 0.7) { g.strokeStyle = "rgb(96,64,44)"; g.lineWidth = 0.02; g.beginPath(); for (let x = 0.3; x < w; x += 0.3) { g.moveTo(x, 0.1); g.lineTo(x, h - 0.1); } for (let y = 0.3; y < h; y += 0.3) { g.moveTo(0.1, y); g.lineTo(w - 0.1, y); } g.stroke(); }
          else if (F.px > 6) { g.strokeStyle = "rgba(40,40,40,0.5)"; g.lineWidth = 0.03; g.strokeRect(0.15, 0.15, HX1 - HX0, HY1 - HY0); g.strokeRect(HX1 - HX0 + 0.15, 0.15, SX1 - SX0, SY1 - SY0); }
          if (winter && !nass) { g.fillStyle = "rgba(240,244,250,0.5)"; g.fillRect(0, 0, w, h); }
        } });
      }
    }
    /* Aushub neben der Grube */
    M.teil("aushub", { mitte: [HX0 - 3, 3 + AUSSEN, 0.5] });
    M.figur({ x: HX0 - 3.2, y: 2.5, z: 0, breite: 5, hoehe: 1.8, malen: aushubFigur(glatt(Z.grubeT / 1.3), winter) });
  }
  function aushubFigur(k, winter) {
    return function (g, s, F) {
      const b = 2.4 * s * Math.cbrt(Math.max(0.05, k)), h = 1.3 * s * ST.KZ * Math.cbrt(Math.max(0.05, k));
      g.beginPath(); g.moveTo(-b, 0); g.bezierCurveTo(-b * 0.6, -h * 0.9, b * 0.4, -h * 1.1, b, 0); g.closePath();
      if (F.schatten) { g.fillStyle = "#000"; g.fill(); return; }
      const lf = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
      const gr = g.createLinearGradient(-b, -h, b, 0);
      gr.addColorStop(0, rgb([150 * lf[0], 112 * lf[1], 76 * lf[2]])); gr.addColorStop(1, rgb([92 * lf[0], 66 * lf[1], 44 * lf[2]]));
      g.fillStyle = gr; g.fill();
      const rng = zufall(5);
      g.fillStyle = rgb([60 * lf[0], 44 * lf[1], 30 * lf[2]], 0.6);
      g.beginPath(); for (let i = 0; i < 40; i++) { const x = (rng() - 0.5) * b * 1.6, y = -rng() * h * 0.7, r = Math.max(0.6, s * 0.03); g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU); } g.fill();
      if (winter) { g.fillStyle = rgb([244 * lf[0], 247 * lf[1], 252 * lf[2]], 0.9); g.beginPath(); g.moveTo(-b * 0.6, -h * 0.55); g.bezierCurveTo(-b * 0.3, -h * 1.0, b * 0.3, -h * 1.05, b * 0.6, -h * 0.5); g.bezierCurveTo(b * 0.2, -h * 0.7, -b * 0.2, -h * 0.72, -b * 0.6, -h * 0.55); g.fill(); }
    };
  }

  /* =====================================================================
     KÖRPER FÜR SCHATTEN UND VERDECKUNG (je nach Bauzustand)
     ===================================================================== */
  function koerperListen(Z) {
    const hausH = Z.dach ? null : (Z.fw > 0 ? Math.min(TR, Z.fwZ) : Z.mauerZ);
    const haus = (z0) => hausH == null ? koerperSattel(HX0, HY0, z0, HX1, HY1, TR, ZF) : (hausH > z0 + 0.05 ? koerperKasten(HX0, HY0, z0, HX1, HY1, hausH) : null);
    const zwerch = (z0) => Z.dach ? koerperZwerch(z0) : null;
    const schuppen = (z0) => Z.schuppenDach ? koerperSattel(SX0, SY0, z0, SX1, SY1, SH, SZF) : (Z.schuppenZ > z0 + 0.05 ? koerperKasten(SX0, SY0, z0, SX1, SY1, Math.min(SH, Z.schuppenZ)) : null);
    const vordach = Z.vordach >= 0.7 ? koerperKasten(VX0, VY0, VZV + 0.06 - 0.62, VX1, VY1, VZW + 0.1) : null;
    const saeulen = Z.vordach > 0 ? SAEULEN.map((x) => koerperKasten(x - 0.06, SAEULE_Y - 0.06, ZB, x + 0.06, SAEULE_Y + 0.06, VZV)) : [];
    const bst = Z.bahnsteig > 0 ? koerperKasten(XB0, YK, 0, XB1, HY0, Z_SCHOTTER + (ZB - Z_SCHOTTER) * Math.min(1, Z.bahnsteig * 1.5)) : null;
    const moebel = [];
    if (Z.moebel) {
      for (const [x, y] of LATERNEN) moebel.push(koerperKasten(x - 0.05, y - 0.05, ZB, x + 0.05, y + 0.05, ZB + LATERNE_H - 0.7), koerperKasten(x - 0.19, y - 0.19, ZB + LATERNE_H - 0.72, x + 0.19, y + 0.19, ZB + LATERNE_H + 0.1));
      for (const xm of SCHILDER) {
        moebel.push(koerperKasten(xm - SCHILD_B / 2, SCHILD_Y - 0.03, SCHILD_Z, xm + SCHILD_B / 2, SCHILD_Y + 0.03, SCHILD_Z + SCHILD_H));
        for (const x of [xm - SCHILD_B / 2 + 0.12, xm + SCHILD_B / 2 - 0.12]) moebel.push(koerperKasten(x - 0.035, SCHILD_Y - 0.035, ZB, x + 0.035, SCHILD_Y + 0.035, SCHILD_Z));
      }
      for (const [x, y, L] of BAENKE) moebel.push(koerperKasten(x - L / 2, y - 0.26, ZB + 0.42, x + L / 2, y + 0.16, ZB + 0.47), koerperKasten(x - L / 2, y + 0.18, ZB + 0.52, x + L / 2, y + 0.28, ZB + 0.93));
      moebel.push(koerperKasten(KARREN[0] - 1.0, KARREN[1] - 0.45, ZB + 0.35, KARREN[0] + 1.0, KARREN[1] + 0.45, ZB + 1.0));
      moebel.push(koerperKasten(KANNEN[0] - 0.36, KANNEN[1] - 0.2, ZB, KANNEN[0] + 0.36, KANNEN[1] + 0.2, ZB + 0.66));
      for (const [x, y] of KUEBEL) moebel.push(koerperKasten(x - 0.28, y - 0.28, ZB, x + 0.28, y + 0.28, ZB + 0.46));
    }
    const baum = [];
    if (Z.moebel && JETZT_WINTER) {
      baum.push(koerperKegel(CHRISTBAUM[0], CHRISTBAUM[1], ZB + 0.35, 0.95, ZB + CHRISTBAUM_H));
      for (const [x, y] of KUEBEL) baum.push(koerperKegel(x, y, ZB + 0.46, 0.28, ZB + 1.4));
    }
    const ohne = (L) => L.filter((K) => K);
    const H0 = haus(0), Q0 = zwerch(0), S0 = schuppen(0);
    return {
      verdecker: ohne([H0, Q0, S0, vordach]),
      verdeckerBahnsteig: ohne([haus(ZB), zwerch(ZB), schuppen(ZB), vordach]),
      verdeckerPflaster: ohne([H0, Q0, S0]),
      schatten: {
        gleis: ohne([H0, Q0, S0, vordach, bst].concat(saeulen, moebel, baum)),
        bahnsteig: ohne([H0, Q0, S0, vordach].concat(saeulen, moebel, baum)),
        pflaster: ohne([H0, Q0, S0]),
        "wand-gleis": ohne([vordach]),
        "wand-ost": ohne([S0]),
        "wand-west": ohne(baum.slice(0, 1)),
        vordach: ohne([H0, Q0]),
        "schuppen-wand": ohne([H0]),
        "schuppen-dach": ohne([H0, Q0])
      }
    };
  }
  let JETZT_WINTER = false;

  /* =====================================================================
     BAUZUSTAND
     Grube → Fundament → Erdgeschoss Schicht für Schicht → Fachwerk
     (Schwellen, Ständer, Rähm, Riegel, Streben) → Giebel → Dachstuhl mit
     Richtbaum → Ausfachung → Schieferdeckung → Güterschuppen, Bahnsteig,
     Gleis, Bahnsteigdach → Fenster, Türen → Ausstattung.
     ===================================================================== */
  function zustand(bau, lebend) {
    const k = (a, b) => phase(bau, a, b);
    const fwT = k(0.4, 0.5);
    const Z = {
      bau: bau, fertig: bau >= 1, lebend: lebend,
      grubeT: 1.3 * glatt(k(0, 0.07)),
      fundament: k(0.07, 0.13),
      mauerZ: bau < 0.14 ? 0 : Z_OG * k(0.14, 0.4),
      fw: fwT,
      fwZ: fwT >= 1 ? 99 : Z_OG + (TR - Z_OG) * Math.min(1, fwT / 0.7) + (fwT > 0.7 ? (GZ - TR) * (fwT - 0.7) / 0.3 : 0) + 0.001,
      ausfachung: bau >= 0.52 ? 1 : 0,
      holzC: misch(HOLZ_ROH, HOLZ_FW, k(0.86, 0.9)),
      dach: bau >= 0.72,
      dachReihen: bau >= 0.72 ? null : 0,
      kamin: k(0.64, 0.72),
      schuppenZ: bau < 0.14 ? 0 : SGZ * k(0.3, 0.5),
      bretter: bau >= 0.5 ? 1 : 0,
      schuppenDach: bau >= 0.55,
      bahnsteig: k(0.6, 0.72),
      schotter: k(0.66, 0.74),
      schwellen: k(0.74, 0.8),
      schienen: k(0.8, 0.86),
      vordach: k(0.76, 0.9),
      fenster: bau >= 0.9,
      tueren: bau >= 0.93,
      moebel: bau >= 0.97
    };
    /* Hölzer in der Reihenfolge des Abbunds: Schwellen, Ständer, Rähm,
       Riegel, Streben; die Giebel zuletzt */
    const artZeit = { schwelle: 0.0, staender: 0.12, raehm: 0.3, riegel: 0.42, strebe: 0.55, ortsparren: 0.74 };
    Z.holzNur = (m) => fwT >= (artZeit[m.art] || 0) + 0.02 && (Math.max(m.p0[1], m.p1[1]) <= TR + 0.05 || fwT >= 0.74);
    return Z;
  }

  /* =====================================================================
     LEBENDIG: die Bahnhofsuhr zeigt die echte Uhrzeit
     ===================================================================== */
  function ansichtLeben(P) {
    const c = P.c, sn = P.sn;
    return { s: P.s, c: c, sn: sn, Z: P.Z, jahr: P.jahr, E: [0.6124 * (c + sn), 0.6124 * (c - sn), 0.5], p: (x, y, z) => P.proj(x, y, z) };
  }
  function lebenMalen(g, P) {
    const A = ansichtLeben(P);
    if (A.E[1] > -0.03) return;                     // Zifferblatt nur von der Gleisseite zu sehen
    g.save();
    ebeneA(g, A, [QX, HY0 - 0.04, UHR_Z], [-1, 0, 0], [0, 0, -1]);
    const lf = lichtA(A, [0, -1, 0]), n = P.Z.nacht || 0;
    const c = n > 0.3 ? [16, 14, 14] : [20 * lf[0] * 1.3, 18 * lf[1] * 1.3, 18 * lf[2] * 1.3];
    uhrZeiger(g, 0, 0, UHR_R, uhrzeit(), rgb(c));
    g.restore();
  }

  /* =====================================================================
     MODELL
     ===================================================================== */
  ST.modell("bahnhof", {
    name: "Bahnhof", gruppe: "Häuser", grund: [30, 16.6], hoehe: 13, bauzeit: 15 * 60,
    bauen(M, o) {
      const B = neuerBlick();
      M.teil("blick", { ebene: -90, schatten: false, mitte: [0, 0, 0] });
      M.figur({ x: 0, y: 0, z: 0, breite: 0.01, hoehe: 0.01, schatten: false, malen(g, s, F) { if (!F.schatten && F.gier != null) blickSetzen(B, F.gier); } });
      const winter = o.jahr === "winter";
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      const lebend = !!o.objekt && bau >= 1;
      const Z = zustand(bau, lebend);
      const S = { winter: winter, saat: 7 + ((o.saat || 0) % 5), fertig: Z.fertig };
      JETZT_WINTER = winter;
      JETZT = koerperListen(Z);
      if (bau < 0.14) grubeBauen(M, B, S, Z);
      else {
        hausBauen(M, B, S, Z);
        gleisSockelBauen(M, B, S, Z);
        if (bau >= 0.5 && bau < 0.72) dachstuhlBauen(M, S, Z);
        if (bau >= 0.58 && bau < 0.72) dachImBau(M, S, Z);
        if (Z.dach) dachBauen(M, B, S, Z);
        kaminBauen(M, S, Z);
        schuppenBauen(M, B, S, Z);
      }
      gleisBauen(M, B, S, Z);
      bahnsteigBauen(M, B, S, Z);
      prellbockBauen(M, S, Z);
      vordachBauen(M, B, S, Z);
      vorplatzBauen(M, B, S, Z);
      if (Z.moebel) ausstattungBauen(M, B, S, Z);
      if (Z.fertig) for (const kx of KAMINE) M.rauchAus(kx, HYM, ZF + 1.35 + 0.2, winter ? 0.9 : 0.5);
      if (lebend) M.lebendig((g, P) => lebenMalen(g, P));
    }
  });
})();
