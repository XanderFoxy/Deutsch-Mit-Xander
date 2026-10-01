/* =====================================================================
   FASSUNG 833 — HOLZFÄLLERHÜTTE: Blockhaus aus Rundholz mit Brennholz,
   Hackklotz, Sägebock und gestapelten Stämmen
   ---------------------------------------------------------------------
   XANDER (Funk 255): „die Sachen die ich weiter baue tauchen niemals auf
   der Karte auf die Jagdhütte oder Kuhstall oder sowas" – deshalb hat
   jedes Spielgebäude jetzt ein eigenes Modell.
   XANDER: „richtig filigran. Richtig schön ausarbeiten mit schönen
   Texturen" · „keine Comic Grafik … viel mehr am Realismus" · „Man soll
   das Fundament sehen beim Aufbauen".

   VORBILD: Holzfäller- und Waldarbeiterhütten im Harz und im Bayerischen
   Wald: Blockbau aus geschälten Fichtenstämmen (Ø 23 cm) mit Sattelkerben
   an den Ecken und vorstehenden Vorköpfen, Fugen mit Moos und Werg
   gestopft, das Holz silbergrau verwittert. Feldsteinsockel, flaches
   Satteldach (28°) mit Dachpappe auf Dreikantleisten, die Pfetten stehen
   am Giebel vor, der Giebel mit Boden-Deckel-Schalung. Ein Feldstein-
   kamin raucht. Vor der Hütte große Brennholzstapel (gespaltene Scheite,
   die Stirnseiten nach außen, an den Enden kreuzweise gestapelt), der
   Hackklotz mit der Axt, ein Sägebock mit einem Stammstück und auf
   Unterlegern die gerückten Stämme. An der Wand Bügelsäge und Zugsäge.

   MASSE (Meter; x Osten, y Süden, Grundrissmitte auf 0,0)
     Hütte      6,0 × 5,0 m (x −4,6…1,4, y −3,9…1,1), Vorköpfe 0,32 m,
                Sockel 0,4 m, Traufe 2,7 m (10 Lagen), First rund 4,2 m,
                Kamin bis 5,3 m
     Tür 0,9 × 1,95 m, Fenster 0,7 × 0,8 m mit Läden
     Brennholz  3,4 × 0,6 × 1,5 m (Süd) und 2,8 × 0,6 × 1,4 m (Ost)
     Stämme     6 Stück Ø 0,38 m, 3,4 m lang
   AUFBAU (o.bau): Schnurgerüst → Grube → Feldsteinsockel → Dielen →
   Blockwand Lage für Lage (abwechselnd Trauf- und Giebelwand) → Pfetten
   und Giebelschalung → Sparren → Schalung, Dachpappe Bahn für Bahn →
   Kamin → Fenster, Läden, Tür → Stämme, Brennholz, Sägebock, Hackklotz.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const hex = PI.hex, rgb = PI.rgb, misch = PI.misch, hell = PI.hell;

  /* ---------------- kleine Werkzeuge (wie im Kuhstall) ---------------- */
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
  function poly(g, p) { g.beginPath(); g.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]); g.closePath(); }

  /* ---------------- Rauschen, Maserung, Flecken ---------------- */
  function rausch(g, x, y, w, h, meter, staerke, saat, okt) {
    const s = Math.abs(saat | 0);
    const m = g.createPattern(PI.rauschBild(1 + (s % 5), 128, 4, okt || 3, 1.6), "repeat");
    const k = meter / 128, sx = (s >> 3) % 2 ? -k : k;
    m.setTransform(new DOMMatrix([sx, 0, 0, k, (s * 0.37) % meter, (s * 0.61) % meter]));
    g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }
  function bleich(g, x, y, w, h, meter, staerke, saat) {
    const s = Math.abs(saat | 0);
    const m = g.createPattern(PI.rauschBild(51 + (s % 3), 128, 3, 3, 2.2), "repeat");
    const k = meter / 128;
    m.setTransform(new DOMMatrix([k, 0, 0, k, (s * 0.29) % meter, (s * 0.53) % meter]));
    g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }
  /* Maserung: Rauschen entlang der Faser gestreckt – ein Füllbefehl */
  function maser(g, x, y, w, h, quer, laengs, staerke, saat, senkrecht) {
    const s = Math.abs(saat | 0);
    const m = g.createPattern(PI.rauschBild(1 + (s % 5), 128, 4, 3, 1.6), "repeat");
    const a = (senkrecht ? quer : laengs) / 128, d = (senkrecht ? laengs : quer) / 128;
    m.setTransform(new DOMMatrix([a, 0, 0, d, (s * 0.131) % 1, (s * 0.217) % 1]));
    g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }
  const TON = {};
  function tonMuster(saat, farbe, weich) {
    const k = saat + "|" + farbe + "|" + (weich || 0);
    if (TON[k]) return TON[k];
    const d = PI.rauschBild(1 + (saat % 5), 128, 4, 3, 1.6).getContext("2d").getImageData(0, 0, 128, 128).data;
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d"), id = g.createImageData(128, 128), f = hex(farbe);
    const u = weich ? 0.2 : 0.35, o = weich ? 0.8 : 0.5;
    for (let i = 0; i < 128 * 128; i++) {
      const v = klemm((d[i * 4] / 255 - u) / o, 0, 1);
      id.data[i * 4] = f[0]; id.data[i * 4 + 1] = f[1]; id.data[i * 4 + 2] = f[2];
      id.data[i * 4 + 3] = Math.round(v * v * (3 - 2 * v) * 255);
    }
    g.putImageData(id, 0, 0);
    TON[k] = c;
    return c;
  }
  function tonFlecken(g, x, y, w, h, meter, staerke, saat, farbe, weich) {
    const s = Math.abs(saat | 0);
    const m = g.createPattern(tonMuster(s % 7, farbe, weich), "repeat");
    const k = meter / 128, sx = (s >> 2) % 2 ? -k : k;
    m.setTransform(new DOMMatrix([sx, 0, 0, k, (s * 0.37) % meter, (s * 0.61) % meter]));
    g.save(); g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }
  function glitzer(g, F, x, y, w, h, dichte, rng, farbe) {
    if (F.px <= 40 || F.licht < 0.2) return;
    const k = Math.min(500, Math.round(w * h * dichte));
    g.beginPath();
    for (let i = 0; i < k; i++) { const r = (0.5 + rng() * 0.8) / F.px; g.rect(x + rng() * w, y + rng() * h, r, r); }
    g.fillStyle = farbe || "rgba(255,255,255,0.95)"; g.fill();
  }

  /* ---------------- Licht für durchsichtige Flächen und Figuren ---------------- */
  function belichter(F, extra) {
    const lf = ST.lichtFaktor(F.n, F.zeit, extra || 0, F.jahr);
    return (c, a, k) => rgb([Math.min(255, c[0] * lf[0] * (k || 1)), Math.min(255, c[1] * lf[1] * (k || 1)), Math.min(255, c[2] * lf[2] * (k || 1))], a);
  }
  /* beidseitig sichtbare Flächen (Geländer, Zaunlatten): die hellere Seite */
  function belichter2(F, extra) {
    const a = ST.lichtFaktor(F.n, F.zeit, extra || 0, F.jahr), b = ST.lichtFaktor(mul(F.n, -1), F.zeit, extra || 0, F.jahr);
    const lf = [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.max(a[2], b[2])];
    return (c, al, k) => rgb([Math.min(255, c[0] * lf[0] * (k || 1)), Math.min(255, c[1] * lf[1] * (k || 1)), Math.min(255, c[2] * lf[2] * (k || 1))], al);
  }
  function blickAus(F) {
    const f = F.flaeche, n0 = kreuz(f.u, f.v), n1 = F.n;
    let c = 1, s = 0;
    if (Math.hypot(n0[0], n0[1]) > 0.2) { const a = Math.atan2(n1[1], n1[0]) - Math.atan2(n0[1], n0[0]); c = Math.cos(a); s = Math.sin(a); }
    return { c: c, s: s, e: [0.6124 * (c + s), 0.6124 * (c - s), 0.5] };
  }
  function parallaxe(F, B, d) {
    const f = F.flaeche, n = kreuz(f.u, f.v);
    const en = Math.max(0.12, dot(B.e, n));
    return [d * dot(B.e, f.u) / en, d * dot(B.e, f.v) / en];
  }
  function lichtN(F, B, n, extra) {
    const nc = [n[0] * B.c - n[1] * B.s, n[0] * B.s + n[1] * B.c, n[2]];
    return ST.lichtFaktor(nc, F.zeit, extra || 0, F.jahr);
  }
  const lichtMal = (lf) => (c, a, k) => rgb([Math.min(255, c[0] * lf[0] * (k || 1)), Math.min(255, c[1] * lf[1] * (k || 1)), Math.min(255, c[2] * lf[2] * (k || 1))], a);
  function figurLicht(F) {
    const Zt = F.Z || ST.ZEITEN.tag;
    const lL = ST.lichtFaktor([-0.707, 0.707, 0], Zt, 0, F.jahr), lR = ST.lichtFaktor([0.707, -0.707, 0], Zt, 0, F.jahr);
    const lV = ST.lichtFaktor([0.707, 0.707, 0], Zt, 0, F.jahr), lO = ST.lichtFaktor([0, 0, 1], Zt, 0, F.jahr);
    const lit = (c, l, a) => rgb([Math.min(255, c[0] * l[0]), Math.min(255, c[1] * l[1]), Math.min(255, c[2] * l[2])], a);
    return { lL: lL, lR: lR, lV: lV, lO: lO, lit: lit };
  }

  /* ---------------- Flächen-Hilfen ---------------- */
  function wand(M, o, n, w, h, malen, extra) {
    return M.flaeche(Object.assign({ o: o, u: kreuz(n, Z3), v: [0, 0, -1], w: w, h: h, malen: malen }, extra || {}));
  }
  /* Kasten x0…x1, y0…y1, z0…z1; m = { s, n, o, w, t } Maler (Süd, Nord, Ost, West, oben) */
  function kiste(M, x0, y0, z0, x1, y1, z1, m, extra) {
    const ex = (name) => Object.assign({}, extra || {}, { name: ((extra && extra.name) || "k") + "-" + name });
    const h = z1 - z0, ao = z0 < 0.05;
    if (m.s) wand(M, [x0, y1, z1], [0, 1, 0], x1 - x0, h, m.s, Object.assign({ ao: ao }, ex("s")));
    if (m.n) wand(M, [x1, y0, z1], [0, -1, 0], x1 - x0, h, m.n, Object.assign({ ao: ao }, ex("n")));
    if (m.o) wand(M, [x1, y1, z1], [1, 0, 0], y1 - y0, h, m.o, Object.assign({ ao: ao }, ex("o")));
    if (m.w) wand(M, [x0, y0, z1], [-1, 0, 0], y1 - y0, h, m.w, Object.assign({ ao: ao }, ex("w")));
    if (m.t) M.flaeche(Object.assign({ o: [x0, y0, z1], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, malen: m.t }, ex("t")));
  }
  /* Ebenes Vieleck aus Raumpunkten: n = Außennormale, u = „rechts" */
  function vieleck(M, name, pts, n, u, malen, extra) {
    n = nrm(n); u = nrm(u);
    const v = kreuz(n, u), p0 = pts[0];
    const ab = pts.map((p) => { const d = sub(p, p0); return [dot(d, u), dot(d, v)]; });
    let a0 = Infinity, b0 = Infinity, a1 = -Infinity, b1 = -Infinity;
    for (const [a, b] of ab) { a0 = Math.min(a0, a); b0 = Math.min(b0, b); a1 = Math.max(a1, a); b1 = Math.max(b1, b); }
    const o = add(add(p0, mul(u, a0)), mul(v, b0));
    return M.flaeche(Object.assign({ name: name, o: o, u: u, v: v, w: a1 - a0, h: b1 - b0, umriss: ab.map(([a, b]) => [a - a0, b - b0]), malen: malen }, extra || {}));
  }
  /* Balken beliebiger Richtung: Achse P0→P1, Querschnitt b (entlang Q) × d.
     mal(seite, länge, breite) liefert den Maler; seiten z. B. "QqRrae". */
  function balken3(M, P0, P1, Q, b, d, mal, opt) {
    opt = opt || {};
    const ax = sub(P1, P0), L = Math.hypot(ax[0], ax[1], ax[2]);
    if (L < 1e-4) return;
    const U = mul(ax, 1 / L);
    Q = nrm(sub(Q, mul(U, dot(Q, U))));
    const R = nrm(kreuz(U, Q)), mid = add(P0, mul(ax, 0.5));
    const seiten = opt.seiten || "QqRrae";
    const rechteck = (c, n, u, w, h, malen, name) => {
      n = nrm(n); u = nrm(u);
      const v = kreuz(n, u);
      M.flaeche(Object.assign({ o: sub(sub(c, mul(u, w / 2)), mul(v, h / 2)), u: u, v: v, w: w, h: h, malen: malen, name: (opt.name || "b") + name, keinAo: true }, opt.extra || {}));
    };
    const langU = (n) => { let u = U; if (dot(kreuz(n, u), Z3) > 0) u = mul(U, -1); return u; };
    if (seiten.indexOf("Q") >= 0) rechteck(add(mid, mul(Q, b / 2)), Q, langU(Q), L, d, mal("Q", L, d), "Q");
    if (seiten.indexOf("q") >= 0) rechteck(add(mid, mul(Q, -b / 2)), mul(Q, -1), langU(mul(Q, -1)), L, d, mal("q", L, d), "q");
    if (seiten.indexOf("R") >= 0) rechteck(add(mid, mul(R, d / 2)), R, langU(R), L, b, mal("R", L, b), "R");
    if (seiten.indexOf("r") >= 0) rechteck(add(mid, mul(R, -d / 2)), mul(R, -1), langU(mul(R, -1)), L, b, mal("r", L, b), "r");
    if (seiten.indexOf("a") >= 0) rechteck(P0, mul(U, -1), Q, b, d, mal("a", b, d), "a");
    if (seiten.indexOf("e") >= 0) rechteck(P1, U, Q, b, d, mal("e", b, d), "e");
  }
  /* Rundholz / Rohr als n-seitiges Prisma: Achse P0→P1, Halbmesser r.
     mantel(i, L, b) → Maler je Seitenstreifen (Streifen läuft entlang der
     Achse: Flächen-x = Achse), kappe(ende) → Maler der Stirnflächen. */
  function rohr(M, P0, P1, r, n, mantel, kappe, opt) {
    opt = opt || {};
    const ax = sub(P1, P0), L = Math.hypot(ax[0], ax[1], ax[2]);
    if (L < 1e-4) return;
    const U = mul(ax, 1 / L), senk = Math.abs(U[2]) > 0.9;
    let Q = senk ? [1, 0, 0] : Z3;
    Q = nrm(sub(Q, mul(U, dot(Q, U))));
    const R = nrm(kreuz(U, Q)), mid = add(P0, mul(ax, 0.5));
    const b = 2 * r * Math.sin(Math.PI / n) * 1.02, ra = r * Math.cos(Math.PI / n);
    for (let i = 0; i < n; i++) {
      const a = (i + 0.5) * TAU / n + (opt.dreh || 0);
      const d = add(mul(Q, Math.cos(a)), mul(R, Math.sin(a)));
      const c = add(mid, mul(d, ra));
      const ex = Object.assign({ malen: mantel(i, L, b, d), name: (opt.name || "r") + i, keinAo: !opt.ao, ao: !!opt.ao }, opt.extra || {});
      if (senk) {
        /* stehend: Flächen-x waagerecht, y nach unten (wie eine Wand) */
        const u = nrm(kreuz(d, Z3)), top = Math.max(P0[2], P1[2]);
        M.flaeche(Object.assign({ o: [c[0] - u[0] * b / 2, c[1] - u[1] * b / 2, top], u: u, v: [0, 0, -1], w: b, h: L }, ex));
      } else {
        let u = U; if (dot(kreuz(d, u), Z3) > 0) u = mul(U, -1);
        const v = kreuz(d, u);
        M.flaeche(Object.assign({ o: sub(sub(c, mul(u, L / 2)), mul(v, b / 2)), u: u, v: v, w: L, h: b }, ex));
      }
    }
    if (kappe) for (const [P, s] of [[P0, -1], [P1, 1]]) {
      if (opt.ohneKappe === s) continue;
      const pts = [];
      for (let i = 0; i < n; i++) { const a = i * TAU / n + (opt.dreh || 0); pts.push(add(P, add(mul(Q, Math.cos(a) * r), mul(R, Math.sin(a) * r)))); }
      const nn = mul(U, s);
      let uu = kreuz(Z3, nn); if (Math.hypot(uu[0], uu[1], uu[2]) < 0.1) uu = [1, 0, 0];
      vieleck(M, (opt.name || "r") + "k" + s, pts, nn, uu, kappe(s), Object.assign({ keinAo: true }, opt.extra || {}));
    }
  }
  /* Bauer, der alles um die Hochachse dreht (Modell in eigenen Achsen bauen) */
  function drehBauer(M, grad) {
    const c = Math.cos(grad * RAD), s = Math.sin(grad * RAD);
    const R = (p) => [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]];
    return {
      o: M.o,
      teil: (n, opt) => M.teil(n, Object.assign({}, opt || {}, opt && opt.mitte ? { mitte: R(opt.mitte) } : {})),
      flaeche: (f) => { f.o = R(f.o); f.u = R(f.u); f.v = R(f.v); return M.flaeche(f); },
      figur: (fi) => { const p = R([fi.x, fi.y, fi.z || 0]); fi.x = p[0]; fi.y = p[1]; return M.figur(fi); },
      licht: (x, y, z, r, f, k) => { const p = R([x, y, z]); M.licht(p[0], p[1], z, r, f, k); },
      bodenlicht: (x, y, r, f, k) => { const p = R([x, y, 0]); M.bodenlicht(p[0], p[1], r, f, k); },
      rauchAus: (x, y, z, k) => { const p = R([x, y, z]); M.rauchAus(p[0], p[1], z, k); },
      lebendig: (fn) => M.lebendig(fn),
      /* Satteldach des Kerns, danach die neuen Flächen mitdrehen */
      satteldach: (d, a, b, opt) => { const t = M.akt, n0 = t.flaechen.length, r = M.satteldach(d, a, b, opt); for (const f of t.flaechen.slice(n0)) { f.o = R(f.o); f.u = R(f.u); f.v = R(f.v); } return r; }
    };
  }

  /* ---------------- Werkstoffe ---------------- */
  function holzMalen(g, F, x, y, w, h, c, saat, senkrecht) {
    g.fillStyle = rgb(c); g.fillRect(x, y, w, h);
    if (F.px > 9) maser(g, x, y, w, h, 0.035, 1.4, 0.45, saat, senkrecht);
    rausch(g, x, y, w, h, 1.1, 0.2, saat + 3, 3);
  }
  /* Bretter (waagerecht oder senkrecht) mit Fugen */
  function bretterMalen(g, F, x, y, w, h, c, saat, breit, senkrecht, alt) {
    const rng = zufall(saat), n = senkrecht ? w : h;
    for (let a = 0; a < n; a += breit) {
      g.fillStyle = rgb(PI.streu(c, rng, 0.09));
      if (senkrecht) g.fillRect(x + a, y, breit + 0.002, h); else g.fillRect(x, y + a, w, breit + 0.002);
    }
    if (F.px > 9) maser(g, x, y, w, h, 0.03, 1.3, 0.45, saat, senkrecht);
    if (F.px * breit > 3) {
      g.fillStyle = rgb(hell(c, -0.6), 0.7);
      for (let a = breit; a < n; a += breit) { if (senkrecht) g.fillRect(x + a - 0.006, y, 0.012, h); else g.fillRect(x, y + a - 0.006, w, 0.012); }
    }
    rausch(g, x, y, w, h, 1.2, 0.22, saat + 2, 3);
    if (alt) bleich(g, x, y, w, h, 1.6, 0.12, saat);
  }
  /* Hirnholz einer Stammscheibe: Rinde, Splint, Jahresringe, Trockenrisse */
  function hirnholz(g, F, cx, cy, rx, ry, saat, frisch, rinde) {
    const rng = zufall(saat), px = F.px * Math.min(rx, ry);
    const c = frisch ? [212, 172, 118] : [168, 140, 104];
    g.fillStyle = rgb(rinde || [74, 58, 44]); g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, TAU); g.fill();
    if (px < 1.5) return;
    const k = rinde === null ? 1 : 0.86;
    const gr = g.createRadialGradient(cx - rx * 0.1, cy - ry * 0.1, 0, cx, cy, rx * k);
    gr.addColorStop(0, rgb(hell(c, -0.12))); gr.addColorStop(0.3, rgb(c)); gr.addColorStop(0.85, rgb(hell(c, 0.08))); gr.addColorStop(1, rgb(hell(c, -0.1)));
    g.fillStyle = gr; g.beginPath(); g.ellipse(cx, cy, rx * k, ry * k, 0, 0, TAU); g.fill();
    if (px > 5) {
      g.strokeStyle = rgb(hell(c, -0.3), 0.45); g.lineWidth = Math.max(0.003, 0.6 / F.px);
      g.beginPath();
      const nr = Math.min(9, Math.round(px / 2.5));
      for (let i = 1; i <= nr; i++) { const f = i / (nr + 1) * k, ox = (rng() - 0.5) * rx * 0.08; g.moveTo(cx + ox + rx * f, cy); g.ellipse(cx + ox, cy, rx * f, ry * f, 0, 0, TAU); }
      g.stroke();
    }
    if (px > 7) {
      g.strokeStyle = "rgba(50,34,22,0.65)"; g.lineWidth = Math.max(0.004, 0.8 / F.px);
      g.beginPath();
      for (let i = 0, n = 1 + ((rng() * 3) | 0); i < n; i++) { const a = rng() * TAU; g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * rx * 0.8, cy + Math.sin(a) * ry * 0.8); }
      g.stroke();
    }
  }
  /* Herbstlaub: kleine Blätter, zur Unterkante hin dichter */
  const LAUB = [[186, 104, 34], [204, 146, 46], [150, 70, 30], [120, 84, 44], [214, 170, 70]];
  function laubMalen(g, F, x, y, w, h, saat, dichte, yDicht) {
    if (F.px < 6) return;
    const rng = zufall(saat), px = F.px;
    const pf = LAUB.map(() => new Path2D());
    const n = Math.min(1400, Math.round(w * h * 4 * dichte));
    for (let i = 0; i < n; i++) {
      let yy = y + rng() * h;
      if (yDicht != null && rng() < 0.5) yy = yDicht - Math.pow(rng(), 2) * h * 0.4;
      const xx = x + rng() * w, r = Math.max(0.025, 0.7 / px) * (0.8 + rng() * 0.8), a = rng() * TAU;
      const p = pf[(rng() * pf.length) | 0];
      p.moveTo(xx + Math.cos(a) * r, yy + Math.sin(a) * r * 0.6);
      p.ellipse(xx, yy, r, r * 0.55, a, 0, TAU);
    }
    for (let i = 0; i < pf.length; i++) { g.fillStyle = rgb(LAUB[i], 0.9); g.fill(pf[i]); }
  }

  /* ---------------- Schnee ---------------- */
  function schneeFlaeche(g, F, x, y, w, h, saat, opt) {
    opt = opt || {};
    const rng = zufall(saat * 131 + 7);
    g.fillStyle = "rgb(232,237,245)"; g.fillRect(x, y, w, h);
    if (F.px > 3) {
      tonFlecken(g, x, y, w, h, 3.3, 0.6, saat + 31, "#b4c2d8", true);
      if (opt.zwischen) opt.zwischen();
      tonFlecken(g, x, y, w, h, 1.9, 0.75, saat + 47, "#f6f8fc", true);
      if (F.px > 16) tonFlecken(g, x, y, w, h, 0.7, 0.3, saat + 53, "#c9d4e6");
    }
    const n = Math.min(6, Math.round(w * h * 0.08) + 1);
    for (let i = 0; i < n; i++) {
      const cx = x + rng() * w, cy = y + rng() * h, rx = 0.7 + rng() * 1.8, ry = 0.08 + rng() * 0.14;
      const gg = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
      const hk = rng() < 0.5;
      gg.addColorStop(0, hk ? "rgba(252,253,255,0.55)" : "rgba(140,160,200,0.26)"); gg.addColorStop(1, hk ? "rgba(252,253,255,0)" : "rgba(140,160,200,0)");
      g.save(); g.translate(cx, cy); g.scale(1, ry / rx); g.fillStyle = gg; g.beginPath(); g.arc(0, 0, rx, 0, TAU); g.fill(); g.restore();
    }
    if (opt.glitzer !== false) glitzer(g, F, x, y, w, h, 6, rng);
  }
  /* Schneedecke auf einer Dachfläche: gerundeter Rand, dünn am First */
  function dachSchneeMalen(g, F, w, h, saat, opt) {
    opt = opt || {};
    const rng = zufall(saat + 3), ph = rng() * 6;
    const oben = opt.oben == null ? 0.12 : opt.oben;
    g.save();
    g.beginPath(); g.moveTo(-0.1, h + 0.1);
    for (let x = -0.1; x <= w + 0.1; x += 0.15) g.lineTo(x, oben + 0.05 * Math.sin(x * 2.1 + ph) + 0.03 * Math.sin(x * 5.3));
    g.lineTo(w + 0.1, h + 0.1); g.closePath(); g.clip();
    schneeFlaeche(g, F, -0.1, -0.1, w + 0.2, h + 0.2, saat, { glitzer: false });
    /* Reihen der Deckung schimmern als weiche Stufen durch */
    if (opt.reihe && F.px * opt.reihe > 2.5) {
      g.fillStyle = "rgba(110,130,180,0.10)";
      for (let y = h - opt.reihe; y > oben; y -= opt.reihe) g.fillRect(-0.1, y, w + 0.2, opt.reihe * 0.25);
    }
    g.restore();
    g.strokeStyle = "rgba(250,252,255,0.9)"; g.lineWidth = Math.max(0.02, 1.0 / F.px);
    g.beginPath(); for (let x = -0.1; x <= w + 0.1; x += 0.15) { const y = oben + 0.05 * Math.sin(x * 2.1 + ph) + 0.03 * Math.sin(x * 5.3); if (x > -0.1) g.lineTo(x, y); else g.moveTo(x, y); } g.stroke();
    if (F.licht > 0.3) glitzer(g, F, 0, oben, w, h - oben, 5, rng);
  }
  /* Schneehaube auf einer schmalen Oberseite */
  function schneeOben(basis) {
    return function (g, F) {
      if (basis) { if (typeof basis === "function") basis(g, F); else { g.fillStyle = basis; g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04); } }
      if (F.jahr !== "winter") return;
      g.fillStyle = "rgb(242,246,252)";
      PI.rundRechteck(g, -0.01, -0.01, F.w + 0.02, F.h + 0.02, Math.min(0.03, F.h * 0.3)); g.fill();
      const gr = g.createLinearGradient(0, 0, 0, F.h);
      gr.addColorStop(0, "rgba(200,212,235,0.3)"); gr.addColorStop(0.4, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(215,225,245,0.25)");
      g.fillStyle = gr; g.fillRect(0, 0, F.w, F.h);
    };
  }
  function eiszapfenMalen(g, F, x0, x1, y0, maxL, saat, L) {
    const rng = zufall(saat), Zp = [];
    let x = x0 + rng() * 0.2;
    while (x < x1 - 0.03) {
      const gruppe = rng() < 0.3;
      const l = maxL * (gruppe ? 0.45 + rng() * 0.55 : 0.08 + Math.pow(rng(), 2) * 0.55), b = 0.014 + l * 0.07;
      Zp.push([x, l, b, (rng() - 0.5) * 0.01]);
      x += gruppe ? 0.03 + rng() * 0.06 : 0.12 + rng() * 0.45;
    }
    const form = (sx, sb) => { g.beginPath(); for (const [x, l, b, d] of Zp) { g.moveTo(x - b * sb + sx * b, y0); g.quadraticCurveTo(x - b * 0.5 * sb + sx * b, y0 + l * 0.55, x + d, y0 + l); g.quadraticCurveTo(x + b * 0.5 + sx * b, y0 + l * 0.55, x + b, y0); g.closePath(); } };
    form(0, 1); g.fillStyle = L([214, 232, 248], 0.72); g.fill();
    form(0.35, 0.4); g.fillStyle = L([150, 182, 214], 0.5); g.fill();
    g.strokeStyle = L([255, 255, 255], 0.85); g.lineWidth = Math.max(0.004, 0.9 / F.px);
    g.beginPath(); for (const [x, l, b] of Zp) { g.moveTo(x - b * 0.45, y0 + 0.01); g.lineTo(x - b * 0.1, y0 + l * 0.7); } g.stroke();
  }
  function zapfenMal(saat, maxL) {
    return function (g, F) { eiszapfenMalen(g, F, 0.1, F.w - 0.1, 0, maxL, saat, belichter(F, 0.15)); };
  }
  /* Schneewechte an der Traufe (im Licht der Dachfläche nDach) */
  function wechteMal(saat, nDach) {
    return function (g, F) {
      const w = F.w, rng = zufall(saat), B = blickAus(F);
      const L = lichtMal(nDach ? lichtN(F, B, nDach, 0.06) : ST.lichtFaktor(F.n, F.zeit, 0.06, F.jahr));
      const buckel = 0.5 + rng() * 0.25, ph = rng() * 6;
      const unten = (x) => Math.max(0.05, 0.17 + 0.05 * Math.sin(x * 2.3 + saat) + 0.03 * Math.sin(x * 5.7 + saat * 3) + 0.05 * Math.pow(0.5 + 0.5 * Math.cos(x / buckel * TAU + ph), 1.6));
      g.beginPath(); g.moveTo(-0.02, 0); g.lineTo(w + 0.02, 0);
      for (let x = w + 0.02; x >= -0.02; x -= 0.06) g.lineTo(x, unten(x));
      g.closePath();
      const gr = g.createLinearGradient(0, 0, 0, 0.3);
      gr.addColorStop(0, L([248, 250, 254], 1, 1.05)); gr.addColorStop(0.4, L([240, 245, 252])); gr.addColorStop(1, L([190, 204, 230], 1, 0.86));
      g.fillStyle = gr; g.fill();
      glitzer(g, F, 0, 0.02, w, 0.12, 25, rng, L([255, 255, 255], 0.9, 1.1));
    };
  }
  /* Schneewulst über einer schrägen Kante (Ortgang); kante(a) = Flächen-y */
  function schneeWulstMal(nDach, kante, saat, dick) {
    return function (g, F) {
      const w = F.w, rng = zufall(saat), B = blickAus(F), L = lichtMal(lichtN(F, B, nDach, 0.06));
      const d = dick || 0.16, ph = rng() * 6;
      const oben = (a) => kante(a) - d * (0.75 + 0.2 * Math.sin(a * 2.7 + ph) + 0.08 * Math.sin(a * 7.1 + ph * 2));
      g.beginPath(); g.moveTo(-0.02, kante(0) + 0.04);
      for (let a = -0.02; a <= w + 0.02; a += 0.06) g.lineTo(a, oben(klemm(a, 0, w)));
      for (let a = w + 0.02; a >= -0.02; a -= 0.06) g.lineTo(a, kante(klemm(a, 0, w)) + 0.04 + 0.02 * Math.sin(a * 5 + ph));
      g.closePath();
      g.fillStyle = L([240, 245, 252]); g.fill();
    };
  }
  /* Schneewehe unten an einer Wand; frei = [[a0,a1],…] (vor Türen geräumt) */
  function weheMalen(g, F, w, hWand, saat, frei, hoch) {
    const rng = zufall(saat), ph = rng() * 6, k0 = hoch || 1;
    const hoehe = (a) => {
      let k = (0.18 + 0.08 * Math.sin(a * 1.3 + ph) + 0.05 * Math.sin(a * 4.1 + ph * 2) + 0.1 * ST.fbm(a * 0.8, saat, 2, saat)) * k0;
      for (const [a0, a1] of frei || []) { const d = a < a0 ? a0 - a : a > a1 ? a - a1 : 0; k *= klemm(d / 0.4, 0, 1); }
      return Math.max(0, k);
    };
    g.beginPath(); g.moveTo(-0.05, hWand + 0.05);
    for (let a = -0.05; a <= w + 0.05; a += 0.08) g.lineTo(a, hWand - hoehe(klemm(a, 0, w)));
    g.lineTo(w + 0.05, hWand + 0.05); g.closePath();
    const gr = g.createLinearGradient(0, hWand - 0.4, 0, hWand);
    gr.addColorStop(0, "rgb(246,249,253)"); gr.addColorStop(0.6, "rgb(232,238,247)"); gr.addColorStop(1, "rgb(206,216,234)");
    g.fillStyle = gr; g.fill();
    g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = Math.max(0.012, 0.9 / F.px);
    g.beginPath(); for (let a = 0; a <= w; a += 0.08) { const y = hWand - hoehe(a) + 0.008; if (a) g.lineTo(a, y); else g.moveTo(a, y); } g.stroke();
  }

  /* ---------------- Öffnungen ---------------- */
  function laibung(g, F, B, x, y, w, h, tiefe, farbe) {
    const pT = parallaxe(F, B, tiefe);
    g.fillStyle = rgb(hell(farbe, -0.25)); g.fillRect(x, y, w, h);
    g.fillStyle = rgb(hell(farbe, 0.05));
    if (pT[0] > 0) poly(g, [[x, y], [x + pT[0], y + pT[1]], [x + pT[0], y + h + pT[1]], [x, y + h]]);
    else poly(g, [[x + w, y], [x + w + pT[0], y + pT[1]], [x + w + pT[0], y + h + pT[1]], [x + w, y + h]]);
    g.fill();
    g.fillStyle = rgb(hell(farbe, -0.4));
    if (pT[1] > 0) { poly(g, [[x, y], [x + w, y], [x + w + pT[0], y + pT[1]], [x + pT[0], y + pT[1]]]); g.fill(); }
    return pT;
  }
  function schattenL(g, F, x, y, w, h, tiefe, a) {
    const sv = F.schatten(tiefe);
    g.fillStyle = "rgba(18,16,24," + (a || 0.38) + ")";
    if (sv) {
      const [dx, dy] = sv;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y); g.lineTo(x + w + dx, y + dy); g.lineTo(x + dx, y + dy); g.closePath(); g.fill();
      g.beginPath();
      if (dx > 0) { g.moveTo(x, y); g.lineTo(x + dx, y + dy); g.lineTo(x + dx, y + h); g.lineTo(x, y + h); }
      else { g.moveTo(x + w, y); g.lineTo(x + w + dx, y + dy); g.lineTo(x + w + dx, y + h); g.lineTo(x + w, y + h); }
      g.closePath(); g.fill();
    } else { g.fillStyle = "rgba(18,16,24,0.18)"; g.fillRect(x, y, w, h); }
  }
  /* Holzfenster mit Sprossen (spalten × zeilen), Glas mit Spiegelung */
  function holzFenster(g, F, B, x, y, w, h, opt) {
    opt = opt || {};
    const px = F.px, tag = 1 - F.nacht, tiefe = opt.tiefe || 0.1;
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    const pT = laibung(g, F, B, x, y, w, h, tiefe, opt.laibung || [150, 120, 90]);
    const fx = x + pT[0], fy = y + pT[1];
    if (opt.roh) {
      const gi = g.createLinearGradient(0, fy, 0, fy + h); gi.addColorStop(0, "rgb(22,18,16)"); gi.addColorStop(1, "rgb(50,40,32)");
      g.fillStyle = gi; g.fillRect(fx, fy, w, h); schattenL(g, F, x, y, w, h, tiefe); g.restore(); return;
    }
    const gi = g.createLinearGradient(0, fy, 0, fy + h);
    gi.addColorStop(0, "rgb(30,28,28)"); gi.addColorStop(1, "rgb(58,48,40)");
    g.fillStyle = gi; g.fillRect(fx, fy, w, h);
    const himmel = (F.zeit && F.zeit.himmel) || ["#bcd3ea", "#e9f1f8"];
    const hO = misch(hex(himmel[0]), [190, 204, 220], tag * 0.5);
    const unten = (F.jahr === "winter" ? [210, 216, 226] : [100, 112, 86]).map((v) => v * (0.35 + 0.65 * tag));
    const sp = g.createLinearGradient(0, fy, 0, fy + h), an = 0.45 * (0.3 + 0.7 * tag);
    sp.addColorStop(0, rgb(hO, an.toFixed(3))); sp.addColorStop(1, rgb(unten, (an * 0.8).toFixed(3)));
    g.fillStyle = sp; g.fillRect(fx, fy, w, h);
    if (opt.vorhang && px > 14) {
      g.fillStyle = rgb(opt.vorhang, 0.75);
      g.beginPath(); g.moveTo(fx, fy); g.lineTo(fx + w * 0.3, fy); g.quadraticCurveTo(fx + w * 0.12, fy + h * 0.5, fx + w * 0.2, fy + h); g.lineTo(fx, fy + h); g.fill();
      g.beginPath(); g.moveTo(fx + w, fy); g.lineTo(fx + w * 0.7, fy); g.quadraticCurveTo(fx + w * 0.88, fy + h * 0.5, fx + w * 0.8, fy + h); g.lineTo(fx + w, fy + h); g.fill();
    }
    if (px > 12) { g.fillStyle = "rgba(255,255,255," + (0.06 + 0.1 * tag).toFixed(3) + ")"; poly(g, [[fx + w * 0.1, fy + h], [fx + w * 0.45, fy], [fx + w * 0.62, fy], [fx + w * 0.27, fy + h]]); g.fill(); }
    const rf = opt.rahmen || [232, 226, 214], rb = opt.rb || 0.055;
    const leiste = (x0, y0, x1, y1, b) => {
      g.fillStyle = rgb(rf);
      if (Math.abs(x1 - x0) > Math.abs(y1 - y0)) { g.fillRect(x0, y0 - b / 2, x1 - x0, b); if (px > 16) { g.fillStyle = rgb(hell(rf, -0.32)); g.fillRect(x0, y0 + b / 2 - b * 0.25, x1 - x0, b * 0.25); } }
      else { g.fillRect(x0 - b / 2, y0, b, y1 - y0); if (px > 16) { g.fillStyle = rgb(hell(rf, -0.32)); g.fillRect(x0 + b / 2 - b * 0.22, y0, b * 0.22, y1 - y0); } }
    };
    leiste(fx, fy + rb / 2, fx + w, fy + rb / 2, rb); leiste(fx, fy + h - rb / 2, fx + w, fy + h - rb / 2, rb);
    leiste(fx + rb / 2, fy, fx + rb / 2, fy + h, rb); leiste(fx + w - rb / 2, fy, fx + w - rb / 2, fy + h, rb);
    const [sp2, sz] = opt.sprossen || [2, 2];
    if (px > 6) {
      const sb = Math.max(0.026, 0.9 / px);
      for (let k = 1; k < sp2; k++) leiste(fx + w * k / sp2, fy, fx + w * k / sp2, fy + h, k === sp2 / 2 ? rb * 0.9 : sb);
      for (let k = 1; k < sz; k++) leiste(fx, fy + h * k / sz, fx + w, fy + h * k / sz, sb);
    }
    schattenL(g, F, x, y, w, h, tiefe, 0.34);
    g.restore();
  }
  function fensterLichtMalen(g, F, B, x, y, w, h, opt) {
    opt = opt || {};
    const a = F.nacht * (opt.an == null ? 1 : opt.an);
    if (a <= 0.01) return;
    const pT = parallaxe(F, B, opt.tiefe || 0.1), rb = opt.rb || 0.055;
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    const gx = x + pT[0] + rb, gy = y + pT[1] + rb, gw = w - 2 * rb, gh = h - 2 * rb;
    const gr = g.createRadialGradient(gx + gw * 0.45, gy + gh * 0.85, 0, gx + gw / 2, gy + gh * 0.6, Math.max(gw, gh) * 1.1);
    const f = opt.farbe || [255, 206, 136];
    gr.addColorStop(0, "rgba(" + f.join(",") + "," + (0.95 * a).toFixed(3) + ")");
    gr.addColorStop(0.6, "rgba(236,160,80," + (0.82 * a).toFixed(3) + ")");
    gr.addColorStop(1, "rgba(140,80,40," + (0.75 * a).toFixed(3) + ")");
    g.fillStyle = gr; g.fillRect(gx, gy, gw, gh);
    const [sp, sz] = opt.sprossen || [2, 2];
    g.fillStyle = "rgba(50,32,22," + (0.9 * a).toFixed(3) + ")";
    for (let k = 1; k < sp; k++) g.fillRect(x + pT[0] + w * k / sp - 0.014, y, 0.028, h);
    for (let k = 1; k < sz; k++) g.fillRect(x, y + pT[1] + h * k / sz - 0.014, w, 0.028);
    g.restore();
    F.leuchtPunkt(x + w / 2, y + h * 0.55, Math.max(0.9, w * 1.2), "255,184,104", 0.45 * (opt.an == null ? 1 : opt.an));
  }
  /* Langband mit Kloben */
  function langband(g, x, y, l, b, rechts, farbe) {
    g.fillStyle = farbe || "rgb(40,38,38)";
    const s = rechts ? -1 : 1;
    g.beginPath(); g.moveTo(x, y - b / 2); g.lineTo(x + s * l * 0.85, y - b * 0.35); g.lineTo(x + s * l, y); g.lineTo(x + s * l * 0.85, y + b * 0.35); g.lineTo(x, y + b / 2); g.closePath(); g.fill();
    g.beginPath(); g.arc(x, y, b * 0.7, 0, TAU); g.fill();
  }
  /* Brettertür mit Querleisten und Strebe (Z), Langbänder, Klinke */
  function brettTuer(g, F, B, x, y, w, h, opt) {
    opt = opt || {};
    const px = F.px, c = opt.farbe || [110, 80, 56], tiefe = opt.tiefe || 0.1;
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    const pT = laibung(g, F, B, x, y, w, h, tiefe, opt.laibung || [120, 96, 74]);
    const fx = x + pT[0], fy = y + pT[1];
    if (opt.roh) {
      const gi = g.createLinearGradient(0, fy, 0, fy + h); gi.addColorStop(0, "rgb(20,16,14)"); gi.addColorStop(1, "rgb(52,42,34)");
      g.fillStyle = gi; g.fillRect(fx, fy, w, h); schattenL(g, F, x, y, w, h, tiefe); g.restore(); return;
    }
    bretterMalen(g, F, fx, fy, w, h, c, opt.saat || 5, Math.max(0.12, w / 6), true, true);
    const lb = hell(c, -0.12);
    const L = (x0, y0, x1, y1, b) => {
      const sv = F.schatten ? F.schatten(0.03) : null;
      if (sv) { g.strokeStyle = "rgba(16,12,10,0.4)"; g.lineWidth = b; g.beginPath(); g.moveTo(x0 + sv[0], y0 + sv[1]); g.lineTo(x1 + sv[0], y1 + sv[1]); g.stroke(); }
      g.strokeStyle = rgb(lb); g.lineWidth = b; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
      if (px * b > 4) { g.strokeStyle = rgb(hell(lb, 0.15)); g.lineWidth = b * 0.2; g.beginPath(); g.moveTo(x0, y0 - b * 0.35); g.lineTo(x1, y1 - b * 0.35); g.stroke(); }
    };
    L(fx, fy + 0.25, fx + w, fy + 0.25, 0.1); L(fx, fy + h - 0.25, fx + w, fy + h - 0.25, 0.1); L(fx + 0.08, fy + h - 0.3, fx + w - 0.08, fy + 0.3, 0.09);
    if (opt.mitte) L(fx, fy + h * 0.5, fx + w, fy + h * 0.5, 0.09);
    if (px > 10) {
      for (const yy of [fy + 0.25, fy + h - 0.25]) langband(g, fx + 0.02, yy, w * 0.6, 0.045, false);
      g.fillStyle = "rgb(36,34,34)"; g.fillRect(fx + w - 0.16, fy + h * 0.52, 0.11, 0.03);
      g.beginPath(); g.arc(fx + w - 0.12, fy + h * 0.52 + 0.08, 0.012, 0, TAU); g.fill();
    }
    rausch(g, fx, fy, w, h, 0.9, 0.2, 11, 3);
    schattenL(g, F, x, y, w, h, tiefe, 0.32);
    g.restore();
  }

  /* ---------------- Beton und Erde (Bauphasen) ---------------- */
  const BETON = [168, 166, 160], ERDE = [112, 88, 62];
  function betonMalen(g, F, w, h, saat, frisch) {
    g.fillStyle = rgb(frisch ? hell(BETON, -0.12) : BETON); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
    rausch(g, 0, 0, w, h, 2.2, 0.25, saat, 4);
    if (F.px > 20) rausch(g, 0, 0, w, h, 0.3, 0.18, saat + 4, 2);
    bleich(g, 0, 0, w, h, 1.7, 0.1, saat + 1);
  }
  function erdeMalen(g, F, w, h, saat, winter) {
    g.fillStyle = rgb(ERDE); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
    tonFlecken(g, 0, 0, w, h, 1.6, 0.5, saat, "#5e4630");
    tonFlecken(g, 0, 0, w, h, 0.9, 0.35, saat + 3, "#9a7a56");
    if (F.px > 18) {
      const rng = zufall(saat + 11);
      g.fillStyle = "rgba(160,150,136,0.8)";
      g.beginPath();
      for (let i = 0; i < Math.min(400, w * h * 14); i++) { const x = rng() * w, y = rng() * h, r = 0.012 + rng() * 0.03; g.moveTo(x + r, y); g.ellipse(x, y, r, r * 0.7, rng() * 3, 0, TAU); }
      g.fill();
    }
    if (winter) tonFlecken(g, 0, 0, w, h, 1.3, 0.55, saat + 7, "#e6ecf4", true);
  }
  /* Baugrube mit Streifenfundament: G = { tiefe, beton, verfuellt, schnur },
     R = [x0, y0, x1, y1] Außenmaß des Baus, T = Grubentiefe, streifen =
     [[x0,y0,x1,y1], …] Betonstreifen (Draufsicht) */
  function grubeBauen(M, G, R, T, streifen, winter, saat) {
    const [x0, y0, x1, y1] = R, ra = 0.45;
    const X0 = x0 - ra, Y0 = y0 - ra, X1 = x1 + ra, Y1 = y1 + ra;
    const t = T * G.tiefe * (1 - G.verfuellt);
    if (t > 0.02) {
      M.teil("grube", { ebene: -2, schatten: false, mitte: [(X0 + X1) / 2, (Y0 + Y1) / 2, -1] });
      const erde = (sa) => (g, F) => {
        erdeMalen(g, F, F.w, F.h, sa, false);
        const gr = g.createLinearGradient(0, 0, 0, F.h);
        gr.addColorStop(0, "rgba(20,14,10,0.1)"); gr.addColorStop(1, "rgba(20,14,10,0.38)");
        g.fillStyle = gr; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      };
      M.flaeche({ name: "grube-boden", o: [X0, Y0, -t], u: [1, 0, 0], v: [0, 1, 0], w: X1 - X0, h: Y1 - Y0, malen: (g, F) => { erdeMalen(g, F, F.w, F.h, saat + 1, winter && G.tiefe < 0.3); g.fillStyle = "rgba(20,14,10,0.22)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); } });
      wand(M, [X0, Y0, 0], [0, 1, 0], X1 - X0, t, erde(saat + 2), { name: "gw-n", keinAo: true });
      wand(M, [X1, Y1, 0], [0, -1, 0], X1 - X0, t, erde(saat + 3), { name: "gw-s", keinAo: true });
      wand(M, [X0, Y1, 0], [1, 0, 0], Y1 - Y0, t, erde(saat + 4), { name: "gw-w", keinAo: true });
      wand(M, [X1, Y0, 0], [-1, 0, 0], Y1 - Y0, t, erde(saat + 5), { name: "gw-o", keinAo: true });
    }
    if (G.beton > 0 && streifen) {
      const zb = -T, zt = -T + T * G.beton;
      M.teil("fundament", { ebene: -1, mitte: [(X0 + X1) / 2, (Y0 + Y1) / 2, -0.5] });
      const bet = (g, F) => betonMalen(g, F, F.w, F.h, saat + 11, G.beton < 1);
      streifen.forEach(([a0, b0, a1, b1], i) => kiste(M, a0, b0, zb, a1, b1, zt, { s: bet, n: bet, o: bet, w: bet, t: bet }, { name: "fs" + i }));
    }
    if (G.schnur) {
      M.teil("schnur", { ebene: 1, schatten: false, mitte: [(X0 + X1) / 2, (Y0 + Y1) / 2, 0.6] });
      M.flaeche({
        name: "schnuere", o: [X0 - 0.6, Y0 - 0.6, 0.55], u: [1, 0, 0], v: [0, 1, 0], w: X1 - X0 + 1.2, h: Y1 - Y0 + 1.2, keinLicht: true,
        malen: (g, F) => {
          g.strokeStyle = "rgba(240,190,40,0.95)"; g.lineWidth = Math.max(0.008, 0.9 / F.px);
          const ox = X0 - 0.6, oy = Y0 - 0.6;
          g.beginPath();
          for (const x of [x0, x1]) { g.moveTo(x - ox, 0.1); g.lineTo(x - ox, F.h - 0.1); }
          for (const y of [y0, y1]) { g.moveTo(0.1, y - oy); g.lineTo(F.w - 0.1, y - oy); }
          g.stroke();
          g.fillStyle = "rgb(190,160,110)";
          for (const x of [x0, x1]) for (const y of [0.1, F.h - 0.2]) g.fillRect(x - ox - 0.03, y, 0.06, 0.1);
        }
      });
    }
  }
  /* Erdhaufen (Aushub) als Figur */
  function aushubFigur(k, winter) {
    return function (g, s, F) {
      const w = 1.6 * s * (0.5 + 0.5 * k), h = 0.7 * s * ST.KZ * k;
      g.beginPath(); g.moveTo(-w, 0); g.bezierCurveTo(-w * 0.6, -h * 0.9, w * 0.3, -h * 1.15, w, 0); g.closePath();
      if (F.schatten) { g.fillStyle = "#000"; g.fill(); return; }
      const FL = figurLicht(F);
      const gr = g.createLinearGradient(-w, 0, w, 0);
      gr.addColorStop(0, FL.lit(ERDE, FL.lL)); gr.addColorStop(0.45, FL.lit(hell(ERDE, 0.06), FL.lO)); gr.addColorStop(1, FL.lit(hell(ERDE, -0.25), FL.lR));
      g.fillStyle = gr; g.fill();
      if (winter) { g.save(); g.clip(); g.fillStyle = FL.lit([236, 240, 248], FL.lO, 0.85); g.beginPath(); g.ellipse(-w * 0.1, -h * 0.85, w * 0.7, h * 0.3, 0, 0, TAU); g.fill(); g.restore(); }
    };
  }

  /* ---------------- Bruchstein (Sockel, Kamin) ----------------
     Unregelmäßige Steine in Kalkmörtel (wie am Kuhstall) */
  const BS_FARBEN = [[150, 140, 126], [168, 156, 136], [132, 124, 114], [120, 108, 96], [176, 164, 142], [144, 128, 110], [158, 150, 138], [114, 110, 104]];
  const MOERTEL = [190, 184, 170];
  const BS_CACHE = new Map();
  function steinUmriss(rng, s0, t0, s1, t1) {
    const bw = s1 - s0, bh = t1 - t0, m = Math.min(bw, bh);
    const e = () => m * (0.12 + rng() * 0.3);
    const j = (a) => (rng() - 0.5) * a;
    const tl = e(), tr = e(), br = e(), bl = e();
    return [
      [s0 + tl, t0 + j(0.012)], [s0 + bw * (0.3 + j(0.2)), t0 - 0.004 + j(0.02)], [s0 + bw * (0.68 + j(0.2)), t0 + j(0.018)], [s1 - tr, t0 + j(0.012)],
      [s1 - tr * 0.3, t0 + tr * 0.35], [s1 + j(0.01), t0 + tr], [s1 + 0.004 + j(0.022), t0 + bh * (0.5 + j(0.3))], [s1 + j(0.01), t1 - br],
      [s1 - br * 0.35, t1 - br * 0.3], [s1 - br, t1 + j(0.01)], [s0 + bw * (0.55 + j(0.3)), t1 + 0.004 + j(0.02)], [s0 + bl, t1 + j(0.01)],
      [s0 + bl * 0.3, t1 - bl * 0.35], [s0 + j(0.01), t1 - bl], [s0 - 0.004 + j(0.022), t0 + bh * (0.5 + j(0.3))], [s0 + j(0.01), t0 + tl],
      [s0 + tl * 0.35, t0 + tl * 0.3]
    ];
  }
  function bruchLayout(saat, w, h, klein) {
    const key = saat + "|" + w.toFixed(2) + "|" + h.toFixed(2) + "|" + (klein || 1);
    let L = BS_CACHE.get(key);
    if (L) return L;
    const rng = zufall(saat * 977 + 13), k = klein || 1;
    const steine = [];
    const neu = (s0, t0, s1, t1, yb, yt) => {
      if (s1 - s0 < 0.04 || t1 - t0 < 0.03) return;
      steine.push({ pts: steinUmriss(rng, s0, t0, s1, t1), box: [s0, t0, s1, t1], c: (rng() * BS_FARBEN.length) | 0, k: (rng() * 3) | 0, yb: yb, yt: yt });
    };
    let yb = h, reihe = 0;
    while (yb > 0.005) {
      const gross = reihe < 1;
      let rh = ((gross ? 0.26 : 0.16) + rng() * (gross ? 0.1 : 0.12)) * k;
      if (yb - rh < 0.1 * k) rh = yb;
      const yt = yb - rh;
      let x = -rng() * 0.4;
      while (x < w) {
        const lw = Math.max(0.16 * k, rh * (1.0 + rng() * 1.8));
        const x1 = x + lw, m = (0.02 + rng() * 0.016) * Math.min(1, k * 1.2);
        if (rng() < 0.25 && rh > 0.22) {
          const tm = yt + rh * (0.4 + rng() * 0.2);
          neu(x + m, yt + m * 0.7, x1 - m, tm - m * 0.5, yb, yt);
          neu(x + m, tm + m * 0.5, x1 - m, yb - m * 0.7, yb, yt);
        } else neu(x + m, yt + m * 0.7 + (rng() < 0.3 ? rng() * 0.03 : 0), x1 - m, yb - m * 0.7, yb, yt);
        x = x1;
      }
      yb = yt; reihe++;
    }
    L = { steine: steine, pfade: new Map() };
    BS_CACHE.set(key, L);
    if (BS_CACHE.size > 60) BS_CACHE.delete(BS_CACHE.keys().next().value);
    return L;
  }
  function bruchPfade(L, fein, filter) {
    const k = fein ? "f" : "g";
    let P = filter ? null : L.pfade.get(k);
    if (P) return P;
    const eimer = new Map();
    for (const s of L.steine) {
      if (filter && !filter(s)) continue;
      const ek = s.c * 3 + s.k;
      let e = eimer.get(ek);
      if (!e) { e = { stein: new Path2D(), kern: fein ? new Path2D() : null }; eimer.set(ek, e); }
      if (fein) {
        const p = s.pts; e.stein.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) e.stein.lineTo(p[i][0], p[i][1]); e.stein.closePath();
        const b = s.box, cx = (b[0] + b[2]) / 2 - 0.012, cy = (b[1] + b[3]) / 2 - 0.012, kk = 0.62;
        e.kern.moveTo(cx + (p[0][0] - cx) * kk, cy + (p[0][1] - cy) * kk);
        for (let i = 1; i < p.length; i++) e.kern.lineTo(cx + (p[i][0] - cx) * kk, cy + (p[i][1] - cy) * kk);
        e.kern.closePath();
      } else e.stein.rect(s.box[0], s.box[1], s.box[2] - s.box[0], s.box[3] - s.box[1]);
    }
    const licht = new Path2D(), fuge = new Path2D();
    if (fein) for (const s of L.steine) {
      if (filter && !filter(s)) continue;
      const p = s.pts;
      licht.moveTo(p[14][0], p[14][1]); for (let i = 15; i <= 16; i++) licht.lineTo(p[i][0], p[i][1]); for (let i = 0; i <= 3; i++) licht.lineTo(p[i][0], p[i][1]);
      fuge.moveTo(p[6][0], p[6][1]); for (let i = 7; i <= 13; i++) fuge.lineTo(p[i][0], p[i][1]);
    }
    P = { eimer: eimer, licht: licht, fuge: fuge };
    if (!filter) L.pfade.set(k, P);
    return P;
  }
  /* opt: saat, bis (gemauerte Höhe von unten), klein (Steingröße), farbe (Mörtel) */
  function bruchsteinMalen(g, F, x, y, w, h, opt) {
    opt = opt || {};
    const px = F.px, saat = opt.saat || 1;
    const ob = opt.bis == null ? y : y + h - opt.bis;
    g.fillStyle = rgb(opt.moertel || MOERTEL);
    g.fillRect(x - 0.02, ob - 0.02, w + 0.04, y + h - ob + 0.04);
    if (px < 6) {
      g.fillStyle = "rgba(146,136,122,0.8)"; g.fillRect(x, ob, w, y + h - ob);
      rausch(g, x, ob, w, y + h - ob, 3, 0.2, saat, 3);
      return;
    }
    const L = bruchLayout(saat, w, h, opt.klein);
    const fein = px > 28;
    const filter = opt.bis == null || opt.bis >= h - 0.005 ? null : (s) => s.yt >= h - opt.bis - 0.01;
    const P = bruchPfade(L, fein, filter);
    g.save();
    g.translate(x, y);
    for (const [key, e] of P.eimer) {
      const c = hell(BS_FARBEN[(key / 3) | 0], (key % 3 - 1) * 0.08 + (opt.hell || 0));
      g.fillStyle = rgb(c); g.fill(e.stein);
      if (e.kern) { g.fillStyle = rgb(hell(c, 0.07)); g.fill(e.kern); }
    }
    if (fein) {
      g.lineWidth = Math.max(0.006, 1.1 / px);
      g.strokeStyle = "rgba(255,248,232," + (F.lichtN > 0.05 ? 0.3 : 0.14) + ")";
      g.stroke(P.licht);
      g.strokeStyle = "rgba(34,30,26,0.45)";
      g.lineWidth = Math.max(0.008, 1.4 / px);
      g.stroke(P.fuge);
    } else if (px > 12) {
      g.fillStyle = "rgba(34,30,26,0.28)";
      g.beginPath();
      for (const s of L.steine) if (!filter || filter(s)) g.rect(s.box[0], s.box[3] - Math.max(0.012, 1.1 / px), s.box[2] - s.box[0], Math.max(0.012, 1.1 / px));
      g.fill();
    }
    g.restore();
    rausch(g, x, ob, w, y + h - ob, 2.4, 0.16, saat + 5, 4);
    const gr = g.createLinearGradient(0, y + h, 0, y + h - 0.35);
    gr.addColorStop(0, "rgba(70,80,50,0.25)"); gr.addColorStop(1, "rgba(70,80,50,0)");
    g.fillStyle = gr; g.fillRect(x, y + h - 0.35, w, 0.35);
  }

  /* Vieleck (Raumpunkte) oberhalb zmax abschneiden – für wachsende Giebel */
  function unterZ(pts, zmax) {
    const aus = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      const ai = a[2] <= zmax + 1e-6, bi = b[2] <= zmax + 1e-6;
      if (ai) aus.push(a);
      if (ai !== bi) { const t = (zmax - a[2]) / (b[2] - a[2]); aus.push(add(a, mul(sub(b, a), t))); }
    }
    return aus;
  }

  /* =====================================================================
     MASSE
     ===================================================================== */
  const HX0 = -4.6, HX1 = 1.4, HY0 = -3.9, HY1 = 1.1, YM = (HY0 + HY1) / 2;
  const D = 0.23, ZS = 0.4, NK = 10, ZT = ZS + NK * D;     // Stammdicke, Sockel, Lagen, Traufe 2,7 m
  const VK = 0.32;                                         // Vorköpfe
  const NEIG = 28 * RAD, TN = Math.tan(NEIG);
  const UET = 0.55, UEG = 0.6, DD = 0.16;                  // Überstände, Dachstärke
  const ZD = ZT + 0.14;                                    // Dachoberfläche über der Wandflucht
  const HF = (HY1 - HY0) / 2 * TN;                         // Firsthöhe über ZD
  const zDach = (y) => ZD + HF - Math.abs(y - YM) * TN;    // Oberfläche der Pappe
  const HAUS_M = [(HX0 + HX1) / 2, YM, 1.4];
  const KX0 = HX1 - 1.55, KX1 = HX1 - 0.95, KY0 = YM - 1.05, KY1 = YM - 0.45, ZK = ZD + HF + 0.95;   // Kamin
  /* Öffnungen je Wand: a = Abstand von der linken Kante (von außen gesehen) */
  const OEFF = {
    sued: [{ art: "fenster", a0: 0.75, a1: 1.45, z0: 1.25, z1: 2.05 }, { art: "tuer", a0: 2.9, a1: 3.8, z0: ZS, z1: ZS + 1.95 }, { art: "fenster", a0: 4.55, a1: 5.25, z0: 1.25, z1: 2.05 }],
    nord: [{ art: "fenster", a0: 2.6, a1: 3.3, z0: 1.3, z1: 2.0 }],
    ost: [{ art: "fenster", a0: 2.15, a1: 2.85, z0: 1.25, z1: 2.05 }],
    west: [{ art: "fenster", a0: 2.2, a1: 2.8, z0: 1.4, z1: 2.0 }]
  };
  const HOLZ = [146, 124, 98];            // geschälte Fichte, silbergrau verwittert
  const HOLZ_ROH = [196, 160, 112];       // frisch geschält
  const BRETT = [118, 104, 88];
  const PAPPE = [62, 66, 64];

  /* =====================================================================
     BAUPHASEN
       0,00–0,08  Schnurgerüst, Grube wird ausgehoben
       0,06–0,18  Feldsteinsockel, Grube verfüllt
       0,18–0,24  Dielenboden
       0,24–0,52  Blockwand Lage für Lage
       0,52–0,62  Pfetten, Giebelschalung
       0,60–0,66  Sparren
       0,66–0,80  Schalung, Dachpappe Bahn für Bahn
       0,78–0,86  Kamin
       0,86–0,90  Fenster, Tür, Läden
       0,86–1,00  Stämme, Brennholz, Sägebock, Hackklotz
     ===================================================================== */
  function zustand(bau) {
    const f = (a, b) => klemm((bau - a) / (b - a), 0, 1);
    const Z = { bau: bau, fertig: bau >= 0.999 };
    Z.grube = bau < 0.2 ? { schnur: bau < 0.07, tiefe: f(0.004, 0.06), beton: 0, verfuellt: f(0.13, 0.19) } : null;
    Z.aushub = bau < 0.13 ? f(0.004, 0.06) : bau < 0.26 ? 1 - 0.9 * f(0.13, 0.26) : 0;
    Z.sockel = f(0.06, 0.18);
    Z.dielen = f(0.18, 0.24);
    Z.waende = f(0.24, 0.52);
    Z.pfetten = f(0.52, 0.56);
    Z.giebel = f(0.55, 0.62);
    Z.sparren = f(0.6, 0.66);
    Z.dach = bau >= 0.66; Z.pappe = f(0.68, 0.8);
    Z.kamin = f(0.78, 0.86);
    Z.fenster = bau >= 0.86; Z.tuer = bau >= 0.88; Z.laeden = bau >= 0.9;
    Z.staemme = f(0.86, 0.92); Z.stapelA = f(0.9, 0.97); Z.stapelB = f(0.92, 0.99);
    Z.bock = bau >= 0.94; Z.klotz = bau >= 0.96; Z.platz = f(0.95, 1);
    Z.alt = bau >= 0.86;
    return Z;
  }

  /* =====================================================================
     BLOCKWAND: liegende Rundhölzer, Moos und Werg in den Fugen
     ===================================================================== */
  /* versatz: Unterkante der ersten Lage über ZS (Giebelwände um eine
     halbe Lage versetzt – Sattelkerbe) */
  function blockMalen(g, F, w, zTop, zUnten, versatz, c, saat) {
    const px = F.px, rng = zufall(saat), H = zTop - zUnten;
    const yZ = (z) => zTop - z;
    g.fillStyle = "rgb(40,32,26)"; g.fillRect(-0.05, -0.05, w + 0.1, H + 0.1);
    const lagen = [];
    for (let k = -1; k < 40; k++) { const zb = ZS + versatz + k * D; if (zb >= zTop) break; if (zb + D > zUnten) lagen.push(zb); }
    for (const zb of lagen) {
      const y0 = yZ(zb + D), cc = PI.streu(c, rng, 0.08);
      if (px * D < 3.5) { g.fillStyle = rgb(cc); g.fillRect(-0.05, y0, w + 0.1, D); g.fillStyle = rgb(hell(cc, -0.4)); g.fillRect(-0.05, y0 + D * 0.78, w + 0.1, D * 0.22); continue; }
      const gr = g.createLinearGradient(0, y0, 0, y0 + D);
      gr.addColorStop(0, rgb(hell(cc, -0.3))); gr.addColorStop(0.1, rgb(hell(cc, 0.08))); gr.addColorStop(0.32, rgb(hell(cc, 0.12)));
      gr.addColorStop(0.7, rgb(hell(cc, -0.1))); gr.addColorStop(1, rgb(hell(cc, -0.48)));
      g.fillStyle = gr; g.fillRect(-0.05, y0 + 0.008, w + 0.1, D - 0.016);
    }
    if (px > 9) maser(g, -0.05, -0.05, w + 0.1, H + 0.1, 0.04, 1.8, 0.4, saat, false);
    tonFlecken(g, -0.05, -0.05, w + 0.1, H + 0.1, 1.4, 0.3, saat + 2, "#a8a49c");
    if (px > 12) {
      /* Fugen: Moos und Werg, unregelmäßig */
      const moos = new Path2D(), werg = new Path2D(), riss = new Path2D(), ast = new Path2D();
      for (const zb of lagen) {
        const y = yZ(zb);
        for (let x = -0.05; x < w; x += 0.06 + rng() * 0.12) {
          const l = 0.05 + rng() * 0.18, d = 0.012 + rng() * 0.016;
          (rng() < 0.55 ? moos : werg).rect(x, y - d / 2 + (rng() - 0.5) * 0.008, l, d);
        }
        if (px > 16) for (let i = 0, n = Math.round(w * 0.35 + rng() * 1.5); i < n; i++) {
          const x = rng() * w, l = 0.3 + rng() * 1.1, yy = y - D * (0.35 + rng() * 0.3);
          riss.moveTo(x, yy); riss.quadraticCurveTo(x + l / 2, yy + (rng() - 0.5) * 0.02, x + l, yy + (rng() - 0.5) * 0.02);
        }
        if (px > 24) for (let i = 0, n = Math.round(w * 0.3 * rng() + 0.3); i < n; i++) { const x = rng() * w, yy = y - D * (0.3 + rng() * 0.45), r = 0.018 + rng() * 0.02; ast.moveTo(x + r, yy); ast.ellipse(x, yy, r, r * 0.75, 0, 0, TAU); }
      }
      g.fillStyle = "rgba(92,98,62,0.85)"; g.fill(moos);
      g.fillStyle = "rgba(170,150,112,0.8)"; g.fill(werg);
      g.strokeStyle = "rgba(36,26,20,0.6)"; g.lineWidth = Math.max(0.005, 0.9 / px); g.stroke(riss);
      g.fillStyle = "rgba(70,50,34,0.75)"; g.fill(ast);
    }
    rausch(g, -0.05, -0.05, w + 0.1, H + 0.1, 2.6, 0.2, saat + 5, 4);
    if (px > 10) bleich(g, -0.05, -0.05, w + 0.1, H + 0.1, 2.0, 0.1, saat + 1);
    /* unten Spritzwasser */
    const zu = Math.max(zUnten, ZS);
    const gu = g.createLinearGradient(0, yZ(zu), 0, yZ(zu + 0.6));
    gu.addColorStop(0, "rgba(40,32,24,0.35)"); gu.addColorStop(1, "rgba(40,32,24,0)");
    g.fillStyle = gu; g.fillRect(-0.05, yZ(zu + 0.6), w + 0.1, 0.62);
  }
  /* Stirnseite der Vorköpfe: Hirnholz Lage über Lage */
  function vorkopfStirn(g, F, w, zTop, zUnten, versatz, saat) {
    const rng = zufall(saat), yZ = (z) => zTop - z;
    g.fillStyle = "rgb(36,28,22)"; g.fillRect(-0.05, -0.05, w + 0.1, zTop - zUnten + 0.1);
    g.save(); g.beginPath(); g.rect(-0.01, -0.01, w + 0.02, zTop - zUnten + 0.02); g.clip();
    for (let k = -1; k < 40; k++) {
      const zb = ZS + versatz + k * D;
      if (zb >= zTop) break;
      if (zb + D <= zUnten) continue;
      const r = D / 2 * (0.94 + rng() * 0.06);
      hirnholz(g, F, w / 2 + (rng() - 0.5) * 0.02, yZ(zb + D / 2), r, r, saat + k * 7, false, [84, 72, 60]);
    }
    g.restore();
    tonFlecken(g, 0, 0, w, zTop - zUnten, 0.8, 0.35, saat + 3, "#6a6458");
  }

  /* ---------------- Öffnungen in der Blockwand ---------------- */
  function bekleidung(g, F, x, y, w, h, c) {
    const sv = F.schatten ? F.schatten(0.04) : null, b = 0.1;
    const rahmen = [[x - b, y - b, w + 2 * b, b], [x - b, y, b, h], [x + w, y, b, h]];
    for (const [rx, ry, rw, rh] of rahmen) {
      if (sv) { g.fillStyle = "rgba(18,14,12,0.35)"; g.fillRect(rx + sv[0], ry + sv[1], rw, rh); }
    }
    for (const [rx, ry, rw, rh] of rahmen) holzMalen(g, F, rx, ry, rw, rh, c, 17, rh > rw);
    g.fillStyle = "rgba(20,14,10,0.4)"; g.fillRect(x - b, y - 0.012, w + 2 * b, 0.012);
  }
  function oeffnungenMalen(g, F, name, zTop, Z, S) {
    const B = blickAus(F), yZ = (z) => zTop - z;
    const bc = Z.alt ? hell(S.holz, -0.12) : HOLZ_ROH;
    for (const o of OEFF[name]) {
      if (o.z0 >= zTop - 0.02) continue;
      const x = o.a0, w = o.a1 - o.a0, z1 = Math.min(o.z1, zTop), y = yZ(z1), h = z1 - o.z0;
      const fertig = z1 >= o.z1;
      if (o.art === "fenster") {
        if (Z.laeden && fertig) PI.laeden(g, x, y, w, h, F, { laeden: toHexF(S.laden) });
        holzFenster(g, F, B, x, y, w, h, { roh: !Z.fenster || !fertig, tiefe: 0.12, laibung: [120, 100, 80], rahmen: [226, 220, 206], sprossen: [2, 2], vorhang: [176, 70, 52] });
        if (fertig) {
          bekleidung(g, F, x, y, w, h, bc);
          /* Sohlbank */
          const sv = F.schatten(0.08);
          if (sv) { g.fillStyle = "rgba(18,14,12,0.38)"; g.fillRect(x - 0.12 + sv[0], y + h + 0.05, w + 0.24, Math.max(0.02, sv[1])); }
          holzMalen(g, F, x - 0.13, y + h, w + 0.26, 0.06, hell(bc, 0.05), 5, false);
          if (F.jahr === "winter" && Z.fertig) { g.fillStyle = "rgb(242,246,252)"; PI.rundRechteck(g, x - 0.13, y + h - 0.025, w + 0.26, 0.04, 0.015); g.fill(); }
        }
      } else {
        brettTuer(g, F, B, x, y, w, h, { roh: !Z.tuer, farbe: S.tuer, saat: S.saat + 3, tiefe: 0.14 });
        if (fertig) bekleidung(g, F, x, y, w, h, bc);
      }
    }
  }
  function toHexF(c) { return "#" + c.map((v) => ("0" + Math.round(klemm(v, 0, 255)).toString(16)).slice(-2)).join(""); }
  /* Bügelsäge und Zugsäge an der Wand (mit Schlagschatten) */
  function saegeMalen(g, F, x, y, lang, zug) {
    const sv = F.schatten ? F.schatten(0.05) : null;
    const zeichne = (dx, dy, schatten) => {
      g.save(); g.translate(x + dx, y + dy);
      const holz = schatten ? "rgba(16,12,10,0.35)" : "rgb(150,112,70)", blatt = schatten ? "rgba(16,12,10,0.35)" : "rgb(150,156,160)";
      if (zug) {
        /* Zugsäge: langes Blatt mit Zähnen, Griffe an beiden Enden */
        g.fillStyle = blatt;
        g.beginPath(); g.moveTo(0, 0.03); g.quadraticCurveTo(lang / 2, 0.16, lang, 0.03); g.lineTo(lang, -0.03); g.quadraticCurveTo(lang / 2, 0.02, 0, -0.03); g.closePath(); g.fill();
        if (!schatten && F.px > 20) { g.fillStyle = "rgb(90,94,98)"; for (let a = 0.05; a < lang - 0.05; a += 0.025) { const yy = 0.03 + 0.13 * Math.sin(Math.PI * a / lang) * 0.95; g.beginPath(); g.moveTo(a, yy); g.lineTo(a + 0.012, yy + 0.02); g.lineTo(a + 0.024, yy); g.fill(); } }
        g.fillStyle = holz; g.fillRect(-0.05, -0.1, 0.035, 0.2); g.fillRect(lang + 0.015, -0.1, 0.035, 0.2);
      } else {
        /* Bügelsäge: Stahlbügel, Blatt unten, Nagel oben */
        g.strokeStyle = schatten ? "rgba(16,12,10,0.35)" : "rgb(176,52,40)"; g.lineWidth = 0.025;
        g.beginPath(); g.moveTo(0, 0.32); g.quadraticCurveTo(0.02, 0, lang / 2, -0.02); g.quadraticCurveTo(lang - 0.02, 0, lang, 0.32); g.stroke();
        g.fillStyle = blatt; g.fillRect(0, 0.3, lang, 0.025);
        if (!schatten && F.px > 24) { g.fillStyle = "rgb(80,84,88)"; for (let a = 0.02; a < lang; a += 0.02) g.fillRect(a, 0.325, 0.01, 0.012); }
        g.fillStyle = schatten ? "rgba(16,12,10,0.35)" : "rgb(46,42,40)"; g.beginPath(); g.arc(lang / 2, -0.03, 0.012, 0, TAU); g.fill();
      }
      g.restore();
    };
    if (sv) zeichne(sv[0], sv[1], true);
    zeichne(0, 0, false);
  }
  /* Stalllaterne am Wandhaken */
  function laterneMalen(g, F, x, y, an) {
    const sv = F.schatten ? F.schatten(0.12) : null;
    if (sv) { g.fillStyle = "rgba(16,12,10,0.3)"; g.fillRect(x - 0.07 + sv[0], y + sv[1], 0.14, 0.24); }
    g.strokeStyle = "rgb(40,38,36)"; g.lineWidth = 0.02;
    g.beginPath(); g.moveTo(x - 0.1, y - 0.12); g.lineTo(x, y - 0.12); g.lineTo(x, y); g.stroke();
    g.fillStyle = "rgb(52,50,46)"; g.fillRect(x - 0.075, y, 0.15, 0.04); g.fillRect(x - 0.075, y + 0.2, 0.15, 0.035);
    const gr = g.createLinearGradient(0, y + 0.04, 0, y + 0.2);
    if (an) { gr.addColorStop(0, "rgb(255,226,160)"); gr.addColorStop(1, "rgb(255,170,80)"); }
    else { gr.addColorStop(0, "rgb(170,180,186)"); gr.addColorStop(1, "rgb(110,116,120)"); }
    g.fillStyle = gr; g.fillRect(x - 0.06, y + 0.04, 0.12, 0.16);
    g.fillStyle = "rgb(52,50,46)"; g.fillRect(x - 0.008, y + 0.04, 0.016, 0.16);
  }

  /* ---------------- Wandmaler ---------------- */
  function wandMaler(name, zTop, versatz, Z, S) {
    return function (g, F) {
      const w = F.w, H = F.h, zU = zTop - H;
      blockMalen(g, F, w, zTop, zU, versatz, Z.alt ? S.holz : HOLZ_ROH, S.saat + name.length * 11);
      oeffnungenMalen(g, F, name, zTop, Z, S);
      const yZ = (z) => zTop - z;
      if (Z.fertig && name === "sued") {
        saegeMalen(g, F, 1.8, yZ(2.15), 0.75, false);
        laterneMalen(g, F, 4.05, yZ(2.25), F.nacht > 0.3);
      }
      if (Z.fertig && name === "ost") saegeMalen(g, F, 0.45, yZ(1.15), 1.45, true);
      /* Dachüberstand wirft Schatten oben */
      if (Z.dach && (name === "sued" || name === "nord")) {
        const gr = g.createLinearGradient(0, 0, 0, 0.6);
        gr.addColorStop(0, "rgba(20,20,34,0.4)"); gr.addColorStop(1, "rgba(20,20,34,0)");
        g.fillStyle = gr; g.fillRect(-0.1, 0, w + 0.2, 0.6);
      }
      if (F.jahr === "herbst" && Z.fertig) { g.save(); g.beginPath(); g.rect(-0.1, H - 0.3, w + 0.2, 0.32); g.clip(); laubMalen(g, F, 0, H - 0.12, w, 0.13, S.saat + 3, 2, H); g.restore(); }
      /* Ecken etwas dunkler (Umgebungsverdeckung) */
      const ge = g.createLinearGradient(0, 0, 0.3, 0); ge.addColorStop(0, "rgba(30,24,20,0.2)"); ge.addColorStop(1, "rgba(30,24,20,0)");
      g.fillStyle = ge; g.fillRect(0, 0, 0.3, H);
      const ge2 = g.createLinearGradient(w, 0, w - 0.3, 0); ge2.addColorStop(0, "rgba(30,24,20,0.2)"); ge2.addColorStop(1, "rgba(30,24,20,0)");
      g.fillStyle = ge2; g.fillRect(w - 0.3, 0, 0.3, H);
    };
  }
  function wandLeuchten(name, zTop) {
    return function (g, F) {
      const B = blickAus(F), yZ = (z) => zTop - z;
      for (const o of OEFF[name]) if (o.art === "fenster") fensterLichtMalen(g, F, B, o.a0, yZ(o.z1), o.a1 - o.a0, o.z1 - o.z0, { tiefe: 0.12, sprossen: [2, 2], an: name === "west" ? 0.6 : 1 });
      if (name === "sued") {
        laterneMalen(g, F, 4.05, yZ(2.25), true);
        F.leuchtPunkt(4.05, yZ(2.12), 1.6, "255,200,120", 1.0, true);
      }
    };
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  const LADEN = [[64, 86, 62], [96, 66, 44], [120, 52, 40]];
  const TUER = [[96, 70, 48], [70, 84, 66], [110, 82, 58]];
  ST.modell("holzhuette", {
    name: "Holzfällerhütte", gruppe: "Häuser", grund: [11, 9], hoehe: 6, bauzeit: 8 * 60,
    bauen(M, o) {
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      const Z = zustand(bau);
      const saat = ((o.saat || 7) >>> 0) % 100000;
      const winter = o.jahr === "winter";
      const S = { saat: saat, winter: winter, jahr: o.jahr, holz: PI.streu(HOLZ, zufall(saat + 1), 0.06), laden: LADEN[saat % LADEN.length], tuer: TUER[(saat + 1) % TUER.length] };
      if (Z.grube || Z.aushub > 0.02) {
        if (Z.grube) grubeBauen(M, Z.grube, [HX0 - 0.1, HY0 - 0.1, HX1 + 0.1, HY1 + 0.1], 0.5, null, winter, saat);
        if (Z.aushub > 0.02) { M.teil("aushub", { mitte: [3.5, -2.6, 0.4] }); M.figur({ x: 3.4, y: -2.4, z: 0, breite: 3.4, hoehe: 1.0, malen: aushubFigur(Z.aushub, winter) }); }
      }
      if (Z.sockel > 0) sockelBauen(M, Z, S);
      if (Z.waende > 0) waendeBauen(M, Z, S);
      if (Z.pfetten > 0) pfettenBauen(M, Z, S);
      if (Z.giebel > 0) giebelBauen(M, Z, S);
      if (Z.sparren > 0 && !Z.dach) sparrenBauen(M, Z, S);
      if (Z.dach) dachBauen(M, Z, S);
      if (Z.kamin > 0) kaminBauen(M, Z, S);
      if (Z.platz > 0) platzBauen(M, Z, S);
      if (Z.staemme > 0) staemmeBauen(M, Z, S);
      if (Z.stapelA > 0) stapelBauen(M, Z, S, "A", Z.stapelA);
      if (Z.stapelB > 0) stapelBauen(M, Z, S, "B", Z.stapelB);
      if (Z.bock) bockBauen(M, Z, S);
      if (Z.klotz) klotzBauen(M, Z, S);
      if (Z.fertig) {
        M.rauchAus((KX0 + KX1) / 2, (KY0 + KY1) / 2, ZK + 0.15, 0.7);
        M.bodenlicht(HX0 + 3.9, HY1 + 1.0, 2.0, "255,196,120", 0.7);
        M.bodenlicht(HX0 + 1.1, HY1 + 0.7, 1.1, "255,190,110", 0.25);
      }
    }
  });

  /* ---------------- Feldsteinsockel und Dielen ---------------- */
  function sockelBauen(M, Z, S) {
    const winter = S.winter && Z.fertig, G = Z.grube;
    const tief = G ? 0.5 * G.tiefe * (1 - G.verfuellt) : 0;
    const h = ZS * Z.sockel;
    const z0 = -tief, z1 = Math.max(0.02, -tief + (ZS + tief) * Z.sockel);
    void h;
    M.teil("sockel", { mitte: [HAUS_M[0], HAUS_M[1], 0.2] });
    const x0 = HX0 - 0.06, x1 = HX1 + 0.06, y0 = HY0 - 0.06, y1 = HY1 + 0.06;
    const stein = (sa, frei) => (g, F) => {
      bruchsteinMalen(g, F, 0, 0, F.w, F.h, { saat: S.saat + sa, bis: F.h, klein: 0.8 });
      if (winter) weheMalen(g, F, F.w, F.h, S.saat + sa, frei, 1.15);
      else if (S.jahr === "herbst" && Z.fertig) laubMalen(g, F, 0, F.h - 0.12, F.w, 0.13, sa, 2.5, F.h);
    };
    const tuer = OEFF.sued[1];
    const top = (g, F) => {
      if (Z.dielen <= 0 || Z.dach) { g.fillStyle = "rgb(150,140,124)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); rausch(g, 0, 0, F.w, F.h, 1.2, 0.35, 5, 3); return; }
      /* Dielen, eine nach der anderen */
      const rng = zufall(S.saat + 4), bis = F.w * Z.dielen;
      g.fillStyle = "rgb(110,96,80)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      for (let x = 0; x < bis; x += 0.18) { g.fillStyle = rgb(PI.streu([190, 156, 112], rng, 0.07)); g.fillRect(x, -0.05, Math.min(0.18, bis - x), F.h + 0.1); }
      maser(g, 0, 0, bis, F.h, 0.03, 1.2, 0.4, 5, true);
      g.fillStyle = "rgba(60,40,24,0.5)"; for (let x = 0.18; x < bis; x += 0.18) g.fillRect(x - 0.005, 0, 0.01, F.h);
      if (F.jahr === "winter") tonFlecken(g, 0, 0, F.w, F.h, 1, 0.4, 5, "#e8eef6", true);
    };
    kiste(M, x0, y0, z0, x1, y1, z1, {
      s: stein(1, [[tuer.a0 - 0.1, tuer.a1 + 0.1]]), n: stein(2), o: stein(3), w: stein(4),
      t: top
    }, { name: "sockel" });
    /* Türstufe: ein großer Feldstein */
    if (Z.tuer) {
      M.teil("stufe", { mitte: [HX0 + (tuer.a0 + tuer.a1) / 2, HY1 + 0.35, 0.1] });
      const st = (g, F) => { g.fillStyle = "rgb(150,144,132)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); tonFlecken(g, 0, 0, F.w, F.h, 0.5, 0.5, 4, "#6e665a"); tonFlecken(g, 0, 0, F.w, F.h, 0.4, 0.3, 6, "#c8c0b0"); if (winter && F.h > 0.3) tonFlecken(g, 0, 0, F.w, F.h, 0.5, 0.5, 6, "#eef2f8", true); };
      kiste(M, HX0 + tuer.a0 - 0.15, HY1 + 0.06, 0, HX0 + tuer.a1 + 0.15, HY1 + 0.62, 0.22, { s: st, o: st, w: st, t: st }, { name: "stufe" });
    }
  }

  /* ---------------- Blockwände und Vorköpfe ---------------- */
  /* Reihenfolge der Lagen: Giebelwand (halbes Holz), Traufwand, Giebelwand, … */
  function hoehen(Z) {
    const n = Math.floor(Z.waende * (2 * NK + 1) + 1e-6);
    const nY = Math.ceil(n / 2), nX = Math.floor(n / 2);
    return { zX: ZS + nX * D, zY: nY > 0 ? Math.min(ZT, ZS - D / 2 + nY * D) : ZS, nX: nX, nY: nY };
  }
  function waendeBauen(M, Z, S) {
    const Hh = hoehen(Z), zX = Hh.zX, zY = Hh.zY;
    M.teil("haus", { mitte: HAUS_M });
    const ex = (name, zTop) => ({ name: "w-" + name, ao: true, beidseitig: !Z.dach, leuchten: Z.fertig ? wandLeuchten(name, zTop) : null });
    if (zX > ZS + 0.01) {
      wand(M, [HX0, HY1, zX], [0, 1, 0], HX1 - HX0, zX - ZS, wandMaler("sued", zX, 0, Z, S), ex("sued", zX));
      wand(M, [HX1, HY0, zX], [0, -1, 0], HX1 - HX0, zX - ZS, wandMaler("nord", zX, 0, Z, S), ex("nord", zX));
    }
    if (zY > ZS + 0.01) {
      wand(M, [HX1, HY1, zY], [1, 0, 0], HY1 - HY0, zY - ZS, wandMaler("ost", zY, -D / 2, Z, S), ex("ost", zY));
      wand(M, [HX0, HY0, zY], [-1, 0, 0], HY1 - HY0, zY - ZS, wandMaler("west", zY, -D / 2, Z, S), ex("west", zY));
    }
    /* Vorköpfe: an jeder Ecke stehen die Traufwand-Hölzer in x und die
       Giebelwand-Hölzer in y über */
    const c = Z.alt ? S.holz : HOLZ_ROH;
    const seite = (zTop, versatz, sa) => (g, F) => blockMalen(g, F, F.w, zTop, zTop - F.h, versatz, hell(c, -0.04), sa);
    const stirn = (zTop, versatz, sa) => (g, F) => vorkopfStirn(g, F, F.w, zTop, zTop - F.h, versatz, sa);
    const oben = (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, hell(c, 0.05), 9, F.h > F.w); if (S.winter && Z.fertig) schneeOben(null)(g, F); };
    const ecken = [[HX0, HY0, -1, -1], [HX1, HY0, 1, -1], [HX0, HY1, -1, 1], [HX1, HY1, 1, 1]];
    ecken.forEach(([ex0, ey0, sx, sy], i) => {
      if (zX > ZS + 0.01) {
        /* Traufwand-Hölzer stehen in x über */
        const xa = sx > 0 ? ex0 : ex0 - VK, xb = sx > 0 ? ex0 + VK : ex0;
        const ya = sy > 0 ? ey0 - D : ey0, yb = sy > 0 ? ey0 : ey0 + D;
        M.teil("vkx" + i, { mitte: [(xa + xb) / 2, (ya + yb) / 2, (ZS + zX) / 2] });
        kiste(M, xa, ya, ZS, xb, yb, zX, { s: seite(zX, 0, 31 + i), n: seite(zX, 0, 35 + i), o: sx > 0 ? stirn(zX, 0, 41 + i) : null, w: sx < 0 ? stirn(zX, 0, 45 + i) : null, t: oben }, { name: "vkx" + i });
      }
      if (zY > ZS + 0.01) {
        const xa = sx > 0 ? ex0 - D : ex0, xb = sx > 0 ? ex0 : ex0 + D;
        const ya = sy > 0 ? ey0 : ey0 - VK, yb = sy > 0 ? ey0 + VK : ey0;
        M.teil("vky" + i, { mitte: [(xa + xb) / 2, (ya + yb) / 2, (ZS + zY) / 2] });
        kiste(M, xa, ya, ZS, xb, yb, zY, { o: seite(zY, -D / 2, 51 + i), w: seite(zY, -D / 2, 55 + i), s: sy > 0 ? stirn(zY, -D / 2, 61 + i) : null, n: sy < 0 ? stirn(zY, -D / 2, 65 + i) : null, t: oben }, { name: "vky" + i });
      }
    });
  }

  /* ---------------- Pfetten (Rundholz) ---------------- */
  const PFETTEN = [YM - (HY1 - HY0) / 4, YM, YM + (HY1 - HY0) / 4];
  function rundMantel(c, saat, rinde, schnee) {
    return (i, L, b, d) => (g, F) => {
      const senk = F.h > F.w;
      const cc = hell(c, (d && d[2] > 0.3 ? 0.06 : 0) + (i % 2 ? -0.02 : 0.02));
      if (rinde) {
        g.fillStyle = rgb(cc); g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04);
        if (F.px > 8) maser(g, 0, 0, F.w, F.h, 0.04, 0.5, 0.7, saat + i, senk);
        tonFlecken(g, 0, 0, F.w, F.h, 0.5, 0.4, saat + i * 3, "#3a2c24");
        tonFlecken(g, 0, 0, F.w, F.h, 0.8, 0.22, saat + i * 5, "#7e8462");
        if (F.px > 14) {
          /* Borkenschuppen: kurze dunkle Furchen längs, helle Kanten */
          const r = zufall(saat + i), n = Math.min(160, (F.w * F.h) * 260);
          const dun = new Path2D(), hel = new Path2D();
          for (let k = 0; k < n; k++) { const a = 0.04 + r() * 0.12, q = 0.006 + r() * 0.008, x = r() * F.w, y = r() * F.h; (k % 3 ? dun : hel).rect(x, y, senk ? q : a, senk ? a : q); }
          g.fillStyle = "rgba(26,18,14,0.6)"; g.fill(dun); g.fillStyle = "rgba(200,176,150,0.25)"; g.fill(hel);
        }
      } else holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, cc, saat + i, senk);
      if (schnee && d && d[2] > 0.55) { g.fillStyle = "rgba(242,246,252,0.95)"; g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04); }
    };
  }
  function pfettenBauen(M, Z, S) {
    const c = Z.alt ? hell(S.holz, -0.05) : HOLZ_ROH, r = 0.1;
    const kap = () => (g, F) => hirnholz(g, F, F.w / 2, F.h / 2, F.w / 2, F.h / 2, 21, !Z.alt, [90, 74, 60]);
    PFETTEN.forEach((y, i) => {
      const z = zDach(y) - DD - r;
      if (Z.pfetten < (i + 1) / 3 - 0.01) return;
      const innen = !Z.dach && Z.giebel < 1;
      const stuecke = innen ? [[HX0 - UEG + 0.04, HX1 + UEG - 0.04]] : [[HX0 - UEG + 0.04, HX0], [HX1, HX1 + UEG - 0.04]];
      stuecke.forEach(([a, b], k) => {
        M.teil("pfette" + i + k, { mitte: [(a + b) / 2, y, z] });
        rohr(M, [a, y, z], [b, y, z], r, 8, rundMantel(c, 70 + i * 3, false, S.winter && Z.fertig), kap, { name: "pf" + i + k, ohneKappe: innen ? 0 : (k === 0 ? 1 : -1) });
      });
    });
  }
  /* ---------------- Giebel: Boden-Deckel-Schalung ---------------- */
  function giebelBauen(M, Z, S) {
    const zTop = ZT + (zDach(YM) - DD - 0.02 - ZT) * Z.giebel;
    const zO = (y) => zDach(y) - DD - 0.02;
    const c = Z.alt ? BRETT : [192, 158, 112];
    const mal = (sa, ost) => (g, F) => {
      const w = F.w, h = F.h;
      /* senkrechte Bretter mit Deckleisten */
      bretterMalen(g, F, -0.05, -0.05, w + 0.1, h + 0.1, c, S.saat + sa, 0.2, true, Z.alt);
      if (F.px * 0.05 > 1.2) {
        const sv = F.schatten(0.025);
        for (let x = 0.2; x < w; x += 0.2) {
          if (sv) { g.fillStyle = "rgba(20,16,14,0.35)"; g.fillRect(x - 0.025 + sv[0], 0, 0.05, h); }
          g.fillStyle = rgb(hell(c, 0.06)); g.fillRect(x - 0.025, 0, 0.05, h);
          g.fillStyle = rgb(hell(c, -0.3)); g.fillRect(x + 0.015, 0, 0.01, h);
        }
      }
      /* Lüftungsluke mit Lamellen in der Spitze */
      if (Z.giebel >= 1) {
        const lx = w / 2 - 0.25, ly = h - (zDach(YM) - DD - 0.02 - ZT) + 0.35, lw = 0.5, lh = 0.4;
        g.fillStyle = "rgb(24,20,18)"; g.fillRect(lx, ly, lw, lh);
        for (let y = ly + 0.03; y < ly + lh - 0.02; y += 0.07) { g.fillStyle = rgb(hell(c, -0.1)); g.fillRect(lx, y, lw, 0.045); g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(lx, y, lw, 0.01); }
        holzMalen(g, F, lx - 0.06, ly - 0.06, lw + 0.12, 0.06, hell(c, -0.15), 3, false);
        holzMalen(g, F, lx - 0.06, ly + lh, lw + 0.12, 0.06, hell(c, -0.15), 4, false);
      }
      /* Schatten des Dachüberstands längs der Schrägen */
      const gr = g.createLinearGradient(0, 0, 0, 0.5);
      gr.addColorStop(0, "rgba(20,20,34,0.35)"); gr.addColorStop(1, "rgba(20,20,34,0)");
      g.save(); g.fillStyle = gr; g.fillRect(-0.1, 0, w + 0.2, 0.5); g.restore();
      void ost;
    };
    M.teil("giebel", { mitte: [HAUS_M[0], YM, ZT + 0.8] });
    for (const [x, n, u, sa] of [[HX1, [1, 0, 0], [0, -1, 0], 5], [HX0, [-1, 0, 0], [0, 1, 0], 9]]) {
      const pts = unterZ([[x, HY1, ZT], [x, HY1, zO(HY1)], [x, YM, zO(YM)], [x, HY0, zO(HY0)], [x, HY0, ZT]].filter((p, i) => i !== 1 && i !== 3 || p[2] > ZT + 0.01), zTop);
      if (pts.length < 3) continue;
      vieleck(M, "giebel" + sa, n[0] > 0 ? pts : pts.slice().reverse(), n, u, mal(sa, n[0] > 0), { beidseitig: !Z.dach });
    }
  }
  /* ---------------- Sparren (Rohbau) ---------------- */
  function sparrenBauen(M, Z, S) {
    const hz = () => (g, F) => holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, HOLZ_ROH, 13, false);
    const n = 7, k = Math.max(1, Math.round(n * Z.sparren));
    for (let i = 0; i < k; i++) {
      const x = HX0 - UEG + 0.15 + (HX1 - HX0 + 2 * UEG - 0.3) * i / (n - 1);
      M.teil("sparren" + i, { mitte: [x, YM, ZT + 1.5] });
      for (const s of [1, -1]) {
        const yE = YM + s * ((HY1 - HY0) / 2 + UET);
        balken3(M, [x, YM, zDach(YM) - DD - 0.02], [x, yE, zDach(yE) - DD - 0.02], [1, 0, 0], 0.08, 0.14, hz, { name: "sp" + i + s });
      }
    }
  }

  /* ---------------- Dach: Dachpappe auf Dreikantleisten ---------------- */
  function pappeMalen(g, F, w, h, saat, bis, herbst) {
    const px = F.px, rng = zufall(saat);
    /* Schalbretter (während des Deckens sichtbar) */
    holzMalen(g, F, -0.05, -0.05, w + 0.1, h + 0.1, [184, 150, 106], saat, false);
    g.fillStyle = "rgba(60,40,24,0.4)"; for (let y = 0.16; y < h; y += 0.16) g.fillRect(-0.05, y, w + 0.1, 0.008);
    g.save();
    if (bis != null) { g.beginPath(); g.rect(-0.1, h * (1 - bis), w + 0.2, h * bis + 0.1); g.clip(); }
    g.fillStyle = rgb(PAPPE); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
    if (px > 20) rausch(g, 0, 0, w, h, 0.15, 0.3, saat + 1, 2);
    tonFlecken(g, 0, 0, w, h, 0.9, 0.3, saat + 2, "#7c8278");
    tonFlecken(g, 0, 0, w, h, 0.55, 0.22, saat + 5, "#5a6a3e");     // Moos
    tonFlecken(g, 0, 0, w, h, 0.3, 0.18, saat + 9, "#3e4a2c");
    /* Leisten mit Kappen vom First zur Traufe */
    const sv = F.schatten ? F.schatten(0.05) : null;
    for (let x = 0.35; x < w - 0.1; x += 0.6) {
      if (sv) { g.fillStyle = "rgba(10,10,12,0.4)"; g.fillRect(x - 0.03 + sv[0], 0, 0.06, h); }
      const gr = g.createLinearGradient(x - 0.03, 0, x + 0.03, 0);
      gr.addColorStop(0, rgb(hell(PAPPE, 0.22))); gr.addColorStop(0.5, rgb(hell(PAPPE, 0.08))); gr.addColorStop(1, rgb(hell(PAPPE, -0.35)));
      g.fillStyle = gr; g.fillRect(x - 0.03, 0, 0.06, h);
    }
    if (px > 10) {
      g.fillStyle = "rgba(20,22,20,0.35)";
      for (let y = 0.9; y < h; y += 0.9) g.fillRect(0, y, w, 0.012);
      if (px > 30) { g.fillStyle = "rgba(170,170,160,0.5)"; for (let y = 0.9; y < h; y += 0.9) for (let x = 0.1; x < w; x += 0.12) g.fillRect(x, y - 0.03 + rng() * 0.01, 0.01, 0.01); }
    }
    /* Firstabdeckung: übergelegte Bahn */
    g.fillStyle = rgb(hell(PAPPE, -0.15)); g.fillRect(-0.05, -0.05, w + 0.1, 0.2);
    g.fillStyle = "rgba(255,255,255,0.08)"; g.fillRect(-0.05, 0.13, w + 0.1, 0.02);
    bleich(g, 0, 0, w, h, 2, 0.12, saat + 7);
    if (herbst) laubMalen(g, F, 0, 0, w, h, saat + 5, 1.1, h);
    g.restore();
  }
  function dachBauen(M, Z, S) {
    const winter = S.winter && Z.fertig;
    M.teil("dach", { mitte: [HAUS_M[0], YM, 7] });
    const mal = (sa) => (g, F) => {
      pappeMalen(g, F, F.w, F.h, S.saat + sa, Z.pappe >= 1 ? null : Z.pappe, S.jahr === "herbst" && Z.fertig);
      if (winter) dachSchneeMalen(g, F, F.w, F.h, S.saat + sa, { oben: 0.0 });
    };
    const kante = (g, F) => {
      holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, Z.alt ? [96, 82, 66] : [186, 150, 104], 7, false);
      g.fillStyle = "rgba(20,14,10,0.4)"; g.fillRect(-0.02, F.h - 0.03, F.w + 0.04, 0.03);
      if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.05); }
    };
    const ort = (g, F) => {
      holzMalen(g, F, -0.05, -0.05, F.w + 0.1, F.h + 0.1, Z.alt ? [92, 78, 62] : [186, 150, 104], 8, false);
      if (winter) { const um = F.flaeche.umriss; g.strokeStyle = "rgb(242,246,252)"; g.lineWidth = 0.09; g.lineJoin = "round"; g.beginPath(); g.moveTo(um[0][0], um[0][1]); g.lineTo(um[1][0], um[1][1]); g.lineTo(um[2][0], um[2][1]); g.stroke(); }
    };
    const d = M.satteldach({ x: HX0, y: HY0, b: HX1 - HX0, t: HY1 - HY0, z: ZD, hf: HF, ueT: UET, ueG: UEG, dicke: 0.2 }, mal(1), mal(2), { kante: "#5a4a3a", traufeMalen: kante, ortMalen: ort, lichtExtra: winter ? 0.05 : 0 });
    if (winter) {
      const xm0 = d.xm0, xm1 = d.xm1;
      M.teil("zapfen", { schatten: false, mitte: [HAUS_M[0], d.yE1 + 4, 7.2] });
      M.flaeche({ name: "zapfen-s", o: [xm0, d.yE1 + 0.01, d.zE - 0.2], u: [1, 0, 0], v: [0, 0, -1], w: xm1 - xm0, h: 0.45, keinLicht: true, keinAo: true, malen: zapfenMal(S.saat + 3, 0.35) });
      M.flaeche({ name: "wechte-s", o: [xm0 - 0.02, d.yE1 + 0.03, d.zE + 0.17], u: [1, 0, 0], v: [0, 0, -1], w: xm1 - xm0 + 0.04, h: 0.32, keinLicht: true, keinAo: true, malen: wechteMal(S.saat + 5, [0, Math.sin(NEIG), Math.cos(NEIG)]) });
      M.teil("zapfen-n", { schatten: false, mitte: [HAUS_M[0], d.yE0 - 4, 7.2] });
      M.flaeche({ name: "zapfen-n", o: [xm1, d.yE0 - 0.01, d.zE - 0.2], u: [-1, 0, 0], v: [0, 0, -1], w: xm1 - xm0, h: 0.45, keinLicht: true, keinAo: true, malen: zapfenMal(S.saat + 7, 0.3) });
      M.flaeche({ name: "wechte-n", o: [xm1 + 0.02, d.yE0 - 0.03, d.zE + 0.17], u: [-1, 0, 0], v: [0, 0, -1], w: xm1 - xm0 + 0.04, h: 0.32, keinLicht: true, keinAo: true, malen: wechteMal(S.saat + 9, [0, -Math.sin(NEIG), Math.cos(NEIG)]) });
    }
  }
  /* ---------------- Feldsteinkamin ---------------- */
  function kaminBauen(M, Z, S) {
    const winter = S.winter && Z.fertig;
    const zu0 = zDach(KY0) - 0.05, zu1 = zDach(KY1) - 0.05;
    const zTop = Math.max(zu1 + 0.1, zu0 + (ZK - zu0) * Z.kamin);
    M.teil("kamin", { mitte: [(KX0 + KX1) / 2, (KY0 + KY1) / 2, 8] });
    const st = (sa) => (g, F) => { bruchsteinMalen(g, F, 0, 0, F.w, F.h, { saat: S.saat + sa, klein: 0.55 }); g.fillStyle = "rgba(30,26,22,0.25)"; g.fillRect(0, F.h - 0.2, F.w, 0.2); };
    wand(M, [KX0, KY1, zTop], [0, 1, 0], KX1 - KX0, zTop - zu1, st(1), { name: "k-s" });
    wand(M, [KX1, KY0, zTop], [0, -1, 0], KX1 - KX0, zTop - zu0, st(2), { name: "k-n" });
    vieleck(M, "k-o", [[KX1, KY1, zTop], [KX1, KY0, zTop], [KX1, KY0, zu0], [KX1, KY1, zu1]], [1, 0, 0], [0, -1, 0], st(3));
    vieleck(M, "k-w", [[KX0, KY0, zTop], [KX0, KY1, zTop], [KX0, KY1, zu1], [KX0, KY0, zu0]], [-1, 0, 0], [0, 1, 0], st(4));
    if (Z.kamin < 1) return;
    /* Abdeckplatte auf vier Ecksteinen, darunter der dunkle Zug */
    const e = 0.06, zp = zTop + 0.16;
    const platte = (g, F) => { g.fillStyle = "rgb(120,116,110)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); rausch(g, 0, 0, F.w, F.h, 0.6, 0.4, 3, 3); g.fillStyle = "rgba(20,18,16,0.3)"; g.fillRect(-0.05, F.h * 0.6, F.w + 0.1, F.h); };
    const dunkel = (g, F) => { g.fillStyle = "rgb(20,16,14)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); g.fillStyle = "rgba(255,140,60," + (0.3 * F.nacht).toFixed(3) + ")"; g.fillRect(0, F.h * 0.5, F.w, F.h * 0.5); };
    kiste(M, KX0 + 0.1, KY0 + 0.1, zTop, KX1 - 0.1, KY1 - 0.1, zp, { s: dunkel, n: dunkel, o: dunkel, w: dunkel }, { name: "zug" });
    M.teil("kaminplatte", { mitte: [(KX0 + KX1) / 2, (KY0 + KY1) / 2, 9] });
    kiste(M, KX0 - e, KY0 - e, zp, KX1 + e, KY1 + e, zp + 0.07, { s: platte, n: platte, o: platte, w: platte, t: schneeOben((g, F) => { platte(g, F); tonFlecken(g, 0, 0, F.w, F.h, 0.4, 0.4, 2, "#2a2420"); }) }, { name: "platte" });
    void winter;
  }

  /* =====================================================================
     HOLZPLATZ: zertretener Boden, Späne und Sägemehl
     ===================================================================== */
  function platzBauen(M, Z, S) {
    M.teil("platz", { ebene: -3, schatten: false, mitte: [0.2, 2.4, 0] });
    const x0 = -2.6, y0 = HY1 + 0.25, w = 7.6, h = 2.9;
    const rng = zufall(S.saat + 13), um = [];
    for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, r = 0.84 + rng() * 0.14; um.push([w / 2 + Math.cos(a) * w / 2 * r, h / 2 + Math.sin(a) * h / 2 * r]); }
    M.flaeche({ name: "platz", o: [x0, y0, 0.012], u: [1, 0, 0], v: [0, 1, 0], w: w, h: h, umriss: um, keinLicht: true, keinAo: true, malen: (g, F) => {
      const winter = F.jahr === "winter";
      const lf = ST.lichtFaktor([0, 0, 1], F.zeit, 0, F.jahr);
      const lit = (c, a) => rgb([c[0] * lf[0], c[1] * lf[1], c[2] * lf[2]], a);
      const litH = (c) => "#" + c.map((v, i) => ("0" + Math.round(Math.min(255, v * lf[i])).toString(16)).slice(-2)).join("");
      const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.5);
      gr.addColorStop(0, "rgba(255,255,255," + (0.9 * Z.platz).toFixed(3) + ")"); gr.addColorStop(0.6, "rgba(255,255,255," + (0.7 * Z.platz).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,255,255,0)");
      g.save(); g.scale(1, h / w); g.fillStyle = gr; g.fillRect(-0.1, -0.1, w + 0.2, w + 0.2); g.restore();
      g.globalCompositeOperation = "source-in";
      g.fillStyle = lit(winter ? [214, 220, 230] : [120, 98, 70]); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
      g.globalCompositeOperation = "source-atop";
      tonFlecken(g, 0, 0, w, h, 1.3, 0.55, 3, litH(winter ? [170, 182, 200] : [96, 76, 52]));
      tonFlecken(g, 0, 0, w, h, 0.9, 0.4, 5, litH(winter ? [240, 244, 250] : [160, 130, 92]), true);
      if (!winter) tonFlecken(g, 0, 0, w, h, 1.2, 0.3, 8, litH([92, 110, 60]));
      if (F.px > 10) {
        const r = zufall(21);
        /* Späne um den Hackklotz, Sägemehl unter dem Bock, Rindenstücke */
        const kx = 0.3 - x0, ky = 2.45 - y0, bx = 3.2 - x0, by = 2.1 - y0;
        g.fillStyle = lit(winter ? [196, 176, 140] : [226, 196, 146], 0.95);
        g.beginPath();
        for (let i = 0; i < 140; i++) { const a = r() * TAU, d = 0.3 + Math.pow(r(), 0.7) * 1.3, x = kx + Math.cos(a) * d, y = ky + Math.sin(a) * d * 0.8, l = 0.03 + r() * 0.06; g.moveTo(x, y); g.ellipse(x, y, l, l * 0.35, r() * 3, 0, TAU); }
        g.fill();
        const gs = g.createRadialGradient(bx, by, 0, bx, by, 0.9);
        gs.addColorStop(0, lit([220, 190, 140], 0.85)); gs.addColorStop(1, lit([220, 190, 140], 0));
        g.fillStyle = gs; g.save(); g.translate(bx, by); g.scale(1.5, 0.7); g.translate(-bx, -by); g.beginPath(); g.arc(bx, by, 0.9, 0, TAU); g.fill(); g.restore();
        g.fillStyle = lit([70, 54, 40], 0.9);
        g.beginPath(); for (let i = 0; i < 40; i++) { const x = r() * w, y = r() * h, l = 0.05 + r() * 0.08; g.moveTo(x, y); g.ellipse(x, y, l, l * 0.4, r() * 3, 0, TAU); } g.fill();
        if (winter && F.px > 20) {
          /* Fußspuren im Schnee zwischen Tür, Klotz und Stapel */
          g.fillStyle = lit([150, 164, 190], 0.5);
          const tx = HX0 + 3.35 - x0, ty = 0.1;
          for (const [ax, ay, bx2, by2] of [[tx, ty, kx, ky], [kx, ky, 1.0, 0.6], [kx, ky, bx, by]]) {
            const L = Math.hypot(bx2 - ax, by2 - ay), n = Math.floor(L / 0.32), a = Math.atan2(by2 - ay, bx2 - ax);
            for (let i = 0; i < n; i++) { const t = i / n, s = i % 2 ? 0.09 : -0.09; const x = ax + (bx2 - ax) * t - Math.sin(a) * s, y = ay + (by2 - ay) * t + Math.cos(a) * s; g.beginPath(); g.ellipse(x, y, 0.07, 0.035, a, 0, TAU); g.fill(); }
          }
        }
      }
      if (F.jahr === "herbst") laubMalen(g, F, 0, 0, w, h, 31, 0.5);
      g.globalCompositeOperation = "source-over";
    } });
  }

  /* =====================================================================
     STÄMME auf Unterlegern
     ===================================================================== */
  const RINDE = [120, 94, 76];
  function stammKappe(saat, frisch) { return () => (g, F) => hirnholz(g, F, F.w / 2, F.h / 2, F.w / 2, F.h / 2, saat, frisch, [70, 56, 46]); }
  function staemmeBauen(M, Z, S) {
    const rng = zufall(S.saat + 51), r = 0.19, x0 = 1.95, x1 = 5.3;
    /* zwei Kanthölzer als Unterleger */
    const ul = () => (g, F) => holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [96, 80, 64], 3, false);
    for (const x of [2.5, 4.75]) { M.teil("unterleger" + x, { mitte: [x, -3.35, 0.07] }); balken3(M, [x, -4.08, 0.07], [x, -2.62, 0.07], [1, 0, 0], 0.14, 0.14, ul, { name: "ul" + x }); }
    const lagen = [[-3.76, 0], [-3.38, 0], [-3.0, 0], [-3.57, 1], [-3.19, 1], [-3.38, 2]];
    const n = Math.ceil(lagen.length * Z.staemme);
    lagen.slice(0, n).forEach(([y, l], i) => {
      const z = 0.14 + r + l * r * 1.732, a = x0 + (rng() - 0.5) * 0.25, b = x1 + (rng() - 0.5) * 0.25, rr = r * (0.9 + rng() * 0.15);
      M.teil("stamm" + i, { mitte: [(a + b) / 2, y, z] });
      rohr(M, [a, y, z], [b, y, z], rr, 10, rundMantel(PI.streu(RINDE, rng, 0.08), 80 + i * 7, true, S.winter && Z.fertig), stammKappe(90 + i, false), { name: "st" + i, dreh: rng() });
    });
  }
  /* =====================================================================
     BRENNHOLZSTAPEL: gespaltene Scheite, Stirnseiten außen, an den Enden
     kreuzweise gestapelt
     ===================================================================== */
  const SCHEIT_T = [[214, 176, 122], [196, 154, 104], [178, 146, 112], [160, 136, 112], [222, 196, 150], [150, 120, 90]];
  function scheiteMalen(g, F, w, h, saat, frisch) {
    const px = F.px, rng = zufall(saat);
    g.fillStyle = "rgb(34,26,20)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
    if (px < 5) {
      g.fillStyle = "rgb(176,142,104)"; g.fillRect(0, 0, w, h);
      rausch(g, 0, 0, w, h, 0.6, 0.45, saat, 3);
      return;
    }
    const koerper = SCHEIT_T.map(() => new Path2D()), rinde = new Path2D(), birke = new Path2D(), ringe = new Path2D(), schatten = new Path2D();
    let yb = h;
    while (yb > 0.02) {
      const rh = 0.1 + rng() * 0.06, yt = Math.max(0, yb - rh);
      let x = -rng() * 0.08;
      while (x < w) {
        const bw = 0.09 + rng() * 0.1, cx = x + bw / 2, cy = (yt + yb) / 2, R = Math.min(bw, yb - yt) * (0.62 + rng() * 0.12);
        /* Viertel- oder Halbscheit: Kreissektor mit zufälliger Lage */
        const art = rng(), dreh = rng() * TAU, sp = art < 0.6 ? Math.PI / 2 : art < 0.85 ? Math.PI * 0.7 : Math.PI;
        const ax = cx - Math.cos(dreh + sp / 2) * R * 0.45, ay = cy - Math.sin(dreh + sp / 2) * R * 0.45;
        const p = koerper[(rng() * koerper.length) | 0];
        p.moveTo(ax, ay); p.arc(ax, ay, R, dreh, dreh + sp); p.closePath();
        schatten.moveTo(ax + 0.012, ay + 0.012); schatten.arc(ax + 0.012, ay + 0.012, R, dreh, dreh + sp); schatten.closePath();
        const rb = rng() < 0.15 ? birke : rinde;
        rb.moveTo(ax + Math.cos(dreh) * R, ay + Math.sin(dreh) * R); rb.arc(ax, ay, R, dreh, dreh + sp);
        if (px > 34) for (let k = 0.3; k < 0.95; k += 0.17) { ringe.moveTo(ax + Math.cos(dreh) * R * k, ay + Math.sin(dreh) * R * k); ringe.arc(ax, ay, R * k, dreh, dreh + sp); }
        x += bw;
      }
      yb = yt;
    }
    g.fillStyle = "rgba(10,6,4,0.5)"; g.fill(schatten);
    for (let i = 0; i < koerper.length; i++) { g.fillStyle = rgb(frisch ? hell(SCHEIT_T[i], 0.05) : SCHEIT_T[i]); g.fill(koerper[i]); }
    g.lineCap = "round";
    g.strokeStyle = "rgb(72,54,40)"; g.lineWidth = Math.max(0.012, 1.2 / px); g.stroke(rinde);
    g.strokeStyle = "rgb(226,222,210)"; g.stroke(birke);
    if (px > 34) { g.strokeStyle = "rgba(120,86,54,0.35)"; g.lineWidth = Math.max(0.003, 0.6 / px); g.stroke(ringe); }
    if (!frisch) { tonFlecken(g, 0, 0, w, h, 0.8, 0.35, saat + 2, "#7a7468"); rausch(g, 0, 0, w, h, 1.4, 0.2, saat + 4, 3); }
    else rausch(g, 0, 0, w, h, 1.4, 0.15, saat + 4, 3);
  }
  /* Ende des Stapels: abwechselnd Lagen von der Seite (Rinde) und Hirnholz */
  function kreuzMalen(g, F, w, h, saat) {
    const rng = zufall(saat), px = F.px;
    g.fillStyle = "rgb(34,26,20)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
    let yb = h, k = 0;
    while (yb > 0.02) {
      const rh = 0.12 + rng() * 0.03, yt = Math.max(0, yb - rh);
      if (k % 2 === 0) {
        /* Scheite längs: Rindenseite */
        for (let x = 0; x < w - 0.05; x += w / 2) {
          const c = PI.streu([96, 76, 58], rng, 0.12);
          g.fillStyle = rgb(c); PI.rundRechteck(g, x + 0.01, yt + 0.008, w / 2 - 0.02, rh - 0.016, 0.03); g.fill();
          g.fillStyle = rgb(hell(c, 0.15)); g.fillRect(x + 0.02, yt + 0.012, w / 2 - 0.04, rh * 0.18);
          if (px > 20) { g.fillStyle = "rgba(30,20,14,0.5)"; for (let i = 0; i < 4; i++) g.fillRect(x + 0.03 + rng() * (w / 2 - 0.1), yt + rh * (0.3 + rng() * 0.5), 0.05 + rng() * 0.08, 0.01); }
        }
      } else {
        g.save(); g.beginPath(); g.rect(0, yt, w, rh); g.clip();
        scheiteMalen(g, F, w, h, saat + k * 13, false);
        g.restore();
      }
      yb = yt; k++;
    }
  }
  /* Oberseite: Scheite von oben (Spaltflächen und Rinde, quer zum Stapel) */
  function stapelOben(g, F, w, h, saat, quer) {
    const rng = zufall(saat), L = quer ? h : w, Q = quer ? w : h;
    g.fillStyle = "rgb(70,54,40)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
    for (let a = 0; a < L; a += 0.1 + rng() * 0.06) {
      const b = 0.08 + rng() * 0.05, c = rng() < 0.45 ? PI.streu([150, 122, 92], rng, 0.08) : PI.streu([112, 90, 70], rng, 0.1);
      g.fillStyle = rgb(c);
      if (quer) g.fillRect(0.01, a, Q - 0.02, b); else g.fillRect(a, 0.01, b, Q - 0.02);
    }
    if (F.px > 9) maser(g, 0, 0, w, h, 0.03, 0.6, 0.35, saat, !quer);
    rausch(g, 0, 0, w, h, 1, 0.2, saat + 3, 3);
  }
  function stapelBauen(M, Z, S, welcher, k) {
    const winter = S.winter && Z.fertig;
    const A = welcher === "A";
    /* A: längs x vor der Hütte (Stirnseiten nach Süden und Norden); B: längs y im Osten */
    const x0 = A ? -4.9 : 4.4, x1 = A ? -1.5 : 5.0, y0 = A ? 2.0 : -2.2, y1 = A ? 2.6 : 0.6, H = A ? 1.5 : 1.4;
    const z0 = 0.13, z1 = z0 + (H - z0) * k;
    const sa = S.saat + (A ? 100 : 200);
    M.teil("stapel" + welcher, { mitte: [(x0 + x1) / 2, (y0 + y1) / 2, z1 / 2] });
    /* Unterleger */
    const ul = () => (g, F) => holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [86, 70, 56], 3, false);
    for (const q of [0.15, 0.45]) {
      if (A) balken3(M, [x0 - 0.1, y0 + q, 0.065], [x1 + 0.1, y0 + q, 0.065], [0, 1, 0], 0.12, 0.13, ul, { name: "su" + welcher + q, seiten: "QqRae" });
      else balken3(M, [x0 + q, y0 - 0.1, 0.065], [x0 + q, y1 + 0.1, 0.065], [1, 0, 0], 0.12, 0.13, ul, { name: "su" + welcher + q, seiten: "QqRae" });
    }
    const stirn = (s2) => (g, F) => scheiteMalen(g, F, F.w, F.h, sa + s2, false);
    const ende = (s2) => (g, F) => kreuzMalen(g, F, F.w, F.h, sa + s2);
    const oben = (g, F) => { stapelOben(g, F, F.w, F.h, sa + 9, !A); if (winter) { schneeFlaeche(g, F, 0.02, 0.02, F.w - 0.04, F.h - 0.04, sa, {}); } };
    kiste(M, x0, y0, z0, x1, y1, z1, A ? { s: stirn(1), n: stirn(2), o: ende(3), w: ende(4), t: oben } : { o: stirn(1), w: stirn(2), s: ende(3), n: ende(4), t: oben }, { name: "stapel" + welcher });
    if (k < 1) return;
    /* Schneehaube rundlich über die Kanten */
    if (winter) {
      M.teil("stapelschnee" + welcher, { schatten: false, mitte: [(x0 + x1) / 2, (y0 + y1) / 2, H + 2] });
      const u = A ? [1, 0, 0] : [0, -1, 0];
      const o = A ? [x0 - 0.02, y1 + 0.02, H + 0.12] : [x1 + 0.02, y1 + 0.02, H + 0.12];
      M.flaeche({ name: "stapelwulst" + welcher, o: o, u: u, v: [0, 0, -1], w: A ? x1 - x0 + 0.04 : y1 - y0 + 0.04, h: 0.24, keinLicht: true, keinAo: true, malen: wechteMal(sa + 3, [0, 0, 1]) });
    }
    /* B: Pfähle an den Enden */
    if (!A) {
      const pm = () => (i) => (g, F) => holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [110, 90, 70], 30 + i, false);
      for (const [px, py] of [[x0 - 0.06, y0 - 0.06], [x1 + 0.06, y0 - 0.06], [x0 - 0.06, y1 + 0.06], [x1 + 0.06, y1 + 0.06]]) {
        M.teil("pfahl" + px + py, { mitte: [px, py, 0.8] });
        rohr(M, [px, py, 0], [px, py, H + 0.15], 0.05, 6, pm(), () => (g, F) => { g.fillStyle = winter ? "rgb(236,240,248)" : "rgb(150,120,86)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); }, { name: "pf" + px + py, ohneKappe: -1, ao: true });
      }
    }
  }

  /* =====================================================================
     SÄGEBOCK mit Stammstück, HACKKLOTZ mit Axt
     ===================================================================== */
  function bockBauen(M, Z, S) {
    const winter = S.winter && Z.fertig;
    const cx = 3.2, cy = 2.1, zk = 0.583;
    const hz = () => (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [128, 104, 78], 41, false); g.fillStyle = "rgba(20,14,10,0.25)"; g.fillRect(-0.02, F.h * 0.7, F.w + 0.04, F.h * 0.3); };
    for (const dx of [-0.45, 0.45]) {
      const x = cx + dx;
      M.teil("bockx" + dx, { mitte: [x, cy, 0.5] });
      balken3(M, [x, cy - 0.38, 0], [x, cy + 0.26, 1.0], [1, 0, 0], 0.07, 0.07, hz, { name: "ba" + dx });
      balken3(M, [x + 0.07, cy + 0.38, 0], [x + 0.07, cy - 0.26, 1.0], [1, 0, 0], 0.07, 0.07, hz, { name: "bb" + dx });
    }
    M.teil("bockriegel", { mitte: [cx, cy, 0.3] });
    balken3(M, [cx - 0.5, cy, 0.3], [cx + 0.55, cy, 0.3], [0, 1, 0], 0.05, 0.08, hz, { name: "br" });
    M.teil("bockstamm", { mitte: [cx + 0.05, cy, zk + 0.5] });
    const r = 0.14, zs = zk + r / Math.sin(Math.atan2(0.64, 1.0));
    rohr(M, [cx - 1.0, cy, zs], [cx + 0.95, cy, zs + 0.05], r, 10, rundMantel([110, 88, 72], 95, true, S.winter && Z.fertig), (s) => stammKappe(s > 0 ? 97 : 98, s > 0)(), { name: "bs" });
    void winter;
  }
  function axt(g, s, F) {
    const k = s;
    /* Stiel schräg nach oben, Klinge steckt im Klotz */
    const sx = 0.06 * k, sy = -0.02 * k, ex = 0.42 * k, ey = -0.62 * k * ST.KZ;
    if (F.schatten) {
      g.strokeStyle = "#000"; g.lineWidth = 0.04 * k; g.beginPath(); g.moveTo(sx, sy); g.lineTo(ex, ey); g.stroke();
      g.fillStyle = "#000"; g.beginPath(); g.moveTo(-0.08 * k, 0); g.lineTo(0.1 * k, -0.06 * k); g.lineTo(0.1 * k, 0.02 * k); g.closePath(); g.fill(); return;
    }
    const FL = figurLicht(F);
    g.lineCap = "round";
    g.strokeStyle = FL.lit([170, 128, 78], FL.lV); g.lineWidth = Math.max(1, 0.038 * k);
    g.beginPath(); g.moveTo(sx, sy); g.quadraticCurveTo((sx + ex) / 2 + 0.03 * k, (sy + ey) / 2, ex, ey); g.stroke();
    g.strokeStyle = FL.lit([210, 170, 116], FL.lL, 0.6); g.lineWidth = Math.max(0.5, 0.012 * k);
    g.beginPath(); g.moveTo(sx - 0.01 * k, sy - 0.01 * k); g.quadraticCurveTo((sx + ex) / 2 + 0.02 * k, (sy + ey) / 2 - 0.01 * k, ex - 0.01 * k, ey); g.stroke();
    /* Axtkopf: dunkler Stahl, blanke Schneide (halb im Holz) */
    g.fillStyle = FL.lit([60, 62, 66], FL.lV);
    g.beginPath(); g.moveTo(0.0, -0.07 * k); g.lineTo(0.14 * k, -0.06 * k); g.lineTo(0.14 * k, 0.0); g.lineTo(-0.02 * k, 0.01 * k); g.closePath(); g.fill();
    g.fillStyle = FL.lit([200, 204, 210], FL.lL); g.fillRect(-0.03 * k, -0.065 * k, 0.04 * k, 0.07 * k);
    if (F.jahr === "winter") { g.strokeStyle = FL.lit([246, 249, 253], FL.lO); g.lineWidth = Math.max(0.6, 0.01 * k); g.beginPath(); g.moveTo(sx + 0.05 * k, sy - 0.08 * k); g.lineTo(ex - 0.05 * k, ey + 0.06 * k); g.stroke(); }
  }
  function klotzBauen(M, Z, S) {
    const cx = 0.3, cy = 2.45, r = 0.3, h = 0.52;
    M.teil("klotz", { mitte: [cx, cy, 0.3] });
    rohr(M, [cx, cy, 0], [cx, cy, h], r, 14, rundMantel([96, 78, 64], 111, true, false), () => (g, F) => {
      hirnholz(g, F, F.w / 2, F.h / 2, F.w / 2, F.h / 2, 113, false, [70, 56, 46]);
      /* Kerben vom Spalten */
      if (F.px > 12) { const rr = zufall(5); g.strokeStyle = "rgba(60,40,26,0.7)"; g.lineWidth = Math.max(0.008, 1 / F.px); g.beginPath(); for (let i = 0; i < 9; i++) { const a = rr() * TAU, d = rr() * F.w * 0.3; const x = F.w / 2 + Math.cos(a) * d, y = F.h / 2 + Math.sin(a) * d, b = rr() * 3; g.moveTo(x - Math.cos(b) * 0.08, y - Math.sin(b) * 0.08); g.lineTo(x + Math.cos(b) * 0.08, y + Math.sin(b) * 0.08); } g.stroke(); }
      if (F.jahr === "winter" && Z.fertig) { g.fillStyle = "rgba(242,246,252,0.95)"; g.beginPath(); g.ellipse(F.w / 2 - 0.05, F.h / 2 + 0.03, F.w * 0.36, F.h * 0.3, 0.4, 0, TAU); g.fill(); }
    }, { name: "kl", ohneKappe: -1, ao: true });
    M.teil("axt", { mitte: [cx, cy, h + 0.4] });
    M.figur({ x: cx - 0.04, y: cy, z: h, breite: 0.9, hoehe: 0.75, schatten: true, malen: axt });
    /* ein paar gespaltene Scheite liegen daneben */
    const sch = (sa) => (g, F) => scheiteMalen(g, F, F.w, F.h, sa, true);
    const lang = (g, F) => holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [206, 170, 120], 7, false);
    M.teil("scheite", { mitte: [cx + 0.75, cy + 0.2, 0.1] });
    kiste(M, cx + 0.5, cy + 0.05, 0, cx + 0.62, cy + 0.42, 0.11, { s: sch(3), n: sch(4), o: lang, w: lang, t: lang }, { name: "sc1" });
    kiste(M, cx + 0.7, cy - 0.1, 0, cx + 1.07, cy + 0.02, 0.12, { o: sch(5), w: sch(6), s: lang, n: lang, t: lang }, { name: "sc2" });
  }
})();
