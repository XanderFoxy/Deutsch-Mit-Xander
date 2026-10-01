/* =====================================================================
   FASSUNG 833 — STERNWARTE: runder Sandsteinturm mit drehbarer Kuppel,
   geöffnetem Spalt und Fernrohr, daneben ein kleiner Anbau
   ---------------------------------------------------------------------
   XANDER (Funk 255): „die Sachen die ich weiter baue tauchen niemals auf
   der Karte auf die Jagdhütte oder Kuhstall oder sowas" – deshalb hat
   jedes Spielgebäude jetzt ein eigenes Modell.
   XANDER: „richtig filigran. Richtig schön ausarbeiten mit schönen
   Texturen" · „keine Comic Grafik … viel mehr am Realismus" · „Man soll
   das Fundament sehen beim Aufbauen".

   VORBILD: kleine Volks- und Schulsternwarten der Kaiserzeit: ein
   Rundturm aus hellem Sandstein (Quader in Schichten, rustizierter
   Sockel, Gurtgesims mit Inschrift, Kranzgesims mit Zahnschnitt), die
   Kuppel aus Kupferblech mit Stehfalzen (grün patiniert, bei manchen
   Saaten blankes Zinkblech), der Beobachtungsspalt geöffnet, der Schieber
   über den Scheitel nach hinten geschoben, das Fernrohr (Refraktor mit
   Taukappe) schaut heraus. Rundbogentür mit Sandsteingewände über eine
   Freitreppe mit Wangen, schmale Rundbogenfenster in zwei Reihen. An der
   Westseite ein verputzter Anbau (Rechenzimmer) mit Pultdach aus Zink,
   Sprossenfenstern, Tür mit Klingel. Davor eine Sonnenuhr. Nachts glimmt
   warmes Licht im Spalt.

   MASSE (Meter; x Osten, y Süden, Grundrissmitte auf 0,0)
     Turm       Ø 6,0 m (Mitte x 1,0, y −0,6), Sockel 0,6 m, Wand bis 5,6 m,
                Gurtgesims 3,15 m, Kuppel Ø 5,7 m bis rund 8,5 m,
                Fernrohr bis rund 9,5 m
     Tür        1,25 × 2,2 m (Rundbogen) bei 20° (Ost-Südost), Treppe 4 Stufen
     Spalt      zwei Felder bei 77° (Süden), rund 1,25 m breit
     Anbau      3,5 × 2,6 m, Traufe 3,0 m, Pultdach zum Turm hin 3,5 m
   AUFBAU (o.bau): Schnurgerüst → Baugrube → Ringfundament (Beton) →
   Verfüllen → Sockel → Turmwand Schicht für Schicht, Anbau → Kranzgesims,
   Anbaudach → Stahlgerippe der Kuppel → Kupferblech Band für Band →
   Schieber, Fernrohr → Fenster, Türen → Treppe, Lampen, Sonnenuhr.
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

  /* =====================================================================
     MASSE
     ===================================================================== */
  const TC = [1.0, -0.6], RT = 3.0, RS = 3.12, RF = 3.2, RK = 2.86;
  const ZS = 0.6, ZW = 5.6, ZGU = 3.15, ZK = ZW + 0.06;     // Sockel, Wandkrone, Gurtgesims, Kuppelfuß
  const UMF = TAU * RT;                                     // Abwicklung der Turmwand
  const SCHICHT = (ZW - ZS) / 13;                           // Quaderschicht ≈ 0,385 m
  const KN = 28, KB = 7;                                    // Kuppel: Meridiane, Bänder
  const SPALT = [5, 6];                                     // Meridiane des Spalts (64°…90°)
  const SPALT_A = (SPALT[0] + 1) * 360 / KN, ERH = 36;      // Richtung und Erhebung des Fernrohrs
  const ALPHA_TUER = 20;
  /* Anbau im Westen, Ostwand als Sehne am Turm */
  const A_X0 = -5.2, A_Y0 = -1.9, A_Y1 = 0.7;
  const kreisX = (y) => TC[0] - Math.sqrt(Math.max(0, RT * RT - (y - TC[1]) * (y - TC[1])));
  const A_X1 = kreisX(A_Y0);
  const zAD = (x) => 3.0 + 0.13 * (x + 5.35);               // Oberkante Anbaudach
  const A_ZT = 2.85;                                         // Traufe (Westwand)
  /* Lage eines Winkels in der Abwicklung (rechts = abnehmender Winkel) */
  const abw = (alpha) => ((360 - alpha) % 360) / 360 * UMF;
  /* Öffnungen im Turm */
  const TURM_OEFF = [
    { art: "tuer", alpha: ALPHA_TUER, w: 1.25, z0: ZS, z1: ZS + 2.2 },
    { art: "fenster", alpha: 100, w: 0.5, z0: 1.55, z1: 2.75 }, { art: "fenster", alpha: 250, w: 0.5, z0: 1.55, z1: 2.75 }, { art: "fenster", alpha: 320, w: 0.5, z0: 1.55, z1: 2.75 },
    { art: "fenster", alpha: 20, w: 0.5, z0: 3.75, z1: 4.95 }, { art: "fenster", alpha: 100, w: 0.5, z0: 3.75, z1: 4.95 }, { art: "fenster", alpha: 180, w: 0.5, z0: 3.75, z1: 4.95 },
    { art: "fenster", alpha: 250, w: 0.5, z0: 3.75, z1: 4.95 }, { art: "fenster", alpha: 320, w: 0.5, z0: 3.75, z1: 4.95 }
  ];
  const STEIN = [214, 198, 168], STEIN_D = [180, 162, 132];
  const KUPFER = [[96, 156, 134], [92, 152, 130], [100, 160, 138], [98, 150, 128]];
  const ZINK = [[168, 174, 178], [164, 170, 175], [172, 177, 181], [160, 166, 171]];

  /* =====================================================================
     BAUPHASEN
       0,00–0,07  Schnurgerüst, Baugrube
       0,07–0,15  Ringfundament (Beton)
       0,15–0,20  Verfüllen
       0,18–0,26  Sockel
       0,26–0,56  Turmwand Schicht für Schicht; 0,36–0,56 Anbau
       0,56–0,62  Kranzgesims; 0,58–0,64 Anbaudach
       0,62–0,70  Stahlgerippe der Kuppel
       0,70–0,84  Kupferblech Band für Band
       0,84–0,90  Schieber, Fernrohr
       0,88–0,94  Fenster, Türen
       0,90–1,00  Treppe, Lampen, Sonnenuhr
     ===================================================================== */
  function zustand(bau) {
    const f = (a, b) => klemm((bau - a) / (b - a), 0, 1);
    const Z = { bau: bau, fertig: bau >= 0.999 };
    Z.grube = bau < 0.21 ? { schnur: bau < 0.07, tiefe: f(0.004, 0.06), beton: 0, verfuellt: f(0.15, 0.2) } : null;
    Z.ring = bau < 0.21 ? f(0.07, 0.15) : 0;
    Z.aushub = bau < 0.15 ? f(0.004, 0.06) : bau < 0.3 ? 1 - 0.9 * f(0.15, 0.3) : 0;
    Z.sockel = f(0.18, 0.26);
    Z.turm = f(0.26, 0.56);
    Z.anbau = f(0.36, 0.56);
    Z.kranz = f(0.56, 0.62);
    Z.adach = f(0.58, 0.64);
    Z.gerippe = f(0.62, 0.7);
    Z.blech = f(0.7, 0.84);
    Z.schieber = bau >= 0.85; Z.fernrohr = f(0.86, 0.9);
    Z.fenster = bau >= 0.88; Z.tuer = bau >= 0.9;
    Z.treppe = f(0.9, 0.95); Z.uhr = bau >= 0.96;
    Z.alt = bau >= 0.88;
    return Z;
  }

  /* =====================================================================
     RUNDE KÖRPER mit weichem Licht
     ===================================================================== */
  /* Licht über eine Facette verlaufen lassen (links → Mitte → rechts),
     damit der Turm rund wirkt statt kantig */
  function weich(maler, n, ao) {
    return function (g, F) {
      maler(g, F);
      const nC = F.n, uC = nrm(kreuz(nC, Z3)), t = Math.tan(Math.PI / n);
      const lfC = ST.lichtFaktor(nC, F.zeit, 0, F.jahr), lfL = ST.lichtFaktor(nrm(sub(nC, mul(uC, t))), F.zeit, 0, F.jahr), lfR = ST.lichtFaktor(nrm(add(nC, mul(uC, t))), F.zeit, 0, F.jahr);
      const c = (lf) => "rgb(" + Math.round(lf[0] * 255) + "," + Math.round(lf[1] * 255) + "," + Math.round(lf[2] * 255) + ")";
      g.save();
      g.globalCompositeOperation = "multiply";
      const gr = g.createLinearGradient(0, 0, F.w, 0);
      gr.addColorStop(0, c(lfL)); gr.addColorStop(0.5, c(lfC)); gr.addColorStop(1, c(lfR));
      g.fillStyle = gr; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      if (ao) {
        const hoch = Math.min(0.55, F.h * 0.5), ga = g.createLinearGradient(0, F.h, 0, F.h - hoch);
        ga.addColorStop(0, "rgb(70,70,90)"); ga.addColorStop(1, "rgb(255,255,255)");
        g.fillStyle = ga; g.fillRect(-0.05, F.h - hoch, F.w + 0.1, hoch + 0.05);
      }
      g.restore();
    };
  }
  /* Zylindermantel aus n Facetten; mal(i, A0, w) → Maler in der Facette
     (A0 = Lage der linken Kante in der Abwicklung) */
  function zylinder(M, C, r, z0, z1, n, mal, opt) {
    opt = opt || {};
    const w = 2 * r * Math.sin(Math.PI / n), ra = r * Math.cos(Math.PI / n);
    for (let i = 0; i < n; i++) {
      const am = (i + 0.5) * TAU / n, d = [Math.cos(am), Math.sin(am), 0], u = [Math.sin(am), -Math.cos(am), 0];
      const c = [C[0] + d[0] * ra, C[1] + d[1] * ra];
      const A0 = (n - i - 1) * w;
      M.flaeche(Object.assign({ name: (opt.name || "z") + i, o: [c[0] - u[0] * w * 0.502, c[1] - u[1] * w * 0.502, z1], u: u, v: [0, 0, -1], w: w * 1.004, h: z1 - z0, malen: weich(mal(i, A0, w), n, opt.ao), keinLicht: true,
        leuchten: opt.leuchten ? opt.leuchten(i, A0, w) : null, beidseitig: !!opt.beidseitig }, opt.extra || {}));
    }
  }
  /* waagerechter Ring (Abdeckung) zwischen r0 und r1 auf Höhe z */
  function ringOben(M, C, r0, r1, z, n, mal, name) {
    for (let i = 0; i < n; i++) {
      const a0 = i * TAU / n, a1 = (i + 1) * TAU / n;
      const P = (r, a) => [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a), z];
      vieleck(M, (name || "ro") + i, [P(r1, a0), P(r1, a1), P(r0, a1), P(r0, a0)], Z3, [1, 0, 0], mal(i));
    }
  }

  /* =====================================================================
     SANDSTEIN: Quader in Schichten über die ganze Abwicklung
     ===================================================================== */
  const QL = {};
  function quaderLage(saat, hoehe, z0, z1, lmin, lmax, umf) {
    umf = umf || UMF;
    const k = saat + "|" + hoehe + "|" + umf.toFixed(3);
    if (QL[k]) return QL[k];
    const rng = zufall(saat * 31 + 7), reihen = [];
    for (let z = z0; z < z1 - 0.01; z += hoehe) {
      const fugen = [];
      let a = rng() * lmax;
      while (a < umf - lmin * 0.5) { fugen.push(a); a += lmin + rng() * (lmax - lmin); }
      reihen.push({ z0: z, z1: Math.min(z1, z + hoehe), fugen: fugen, farben: fugen.map(() => (rng() * 4) | 0), k: fugen.map(() => rng()) });
    }
    return (QL[k] = reihen);
  }
  /* Quader in [A0, A0+w] zeichnen; yZ(z) = Flächen-y; bossen: rustiziert */
  function quaderMalen(g, F, A0, w, yZ, reihen, basis, bossen, umf) {
    umf = umf || UMF;
    const px = F.px, eimer = [new Path2D(), new Path2D(), new Path2D(), new Path2D()], licht = new Path2D(), schatten = new Path2D();
    const fb = Math.max(0.008, 0.8 / px);
    for (const R of reihen) {
      const y0 = yZ(R.z1), y1 = yZ(R.z0), n = R.fugen.length;
      for (let i = 0; i < n; i++) {
        const a = R.fugen[i], b = i + 1 < n ? R.fugen[i + 1] : R.fugen[0] + umf;
        for (const sh of [0, -umf, umf]) {
          const x0 = a + sh, x1 = b + sh;
          if (x1 < A0 - 0.05 || x0 > A0 + w + 0.05) continue;
          const e = bossen ? 0.035 : fb / 2;
          eimer[R.farben[i]].rect(x0 + e, y0 + e, x1 - x0 - 2 * e, y1 - y0 - 2 * e);
          if (px > 14) { licht.rect(x0 + e, y0 + e, x1 - x0 - 2 * e, bossen ? 0.04 : 0.015); schatten.rect(x0 + e, y1 - e - (bossen ? 0.05 : 0.015), x1 - x0 - 2 * e, bossen ? 0.05 : 0.015); }
        }
      }
    }
    g.fillStyle = rgb(hell(basis, -0.12)); g.fillRect(A0 - 0.05, yZ(reihen[reihen.length - 1].z1) - 0.05, w + 0.1, 99);
    for (let k = 0; k < 4; k++) { g.fillStyle = rgb(hell(basis, [0.02, -0.05, 0.06, -0.1][k])); g.fill(eimer[k]); }
    if (px > 14) { g.fillStyle = "rgba(255,248,230,0.22)"; g.fill(licht); g.fillStyle = "rgba(60,40,20," + (bossen ? 0.3 : 0.16) + ")"; g.fill(schatten); }
  }

  /* ---------------- Öffnungen am Turm ---------------- */
  function rundbogenPfad(g, x, y, w, h) { const r = w / 2; g.beginPath(); g.moveTo(x, y + h); g.lineTo(x, y + r); g.arc(x + r, y + r, r, Math.PI, 0); g.lineTo(x + w, y + h); g.closePath(); }
  function turmFenster(g, F, x, y, w, h, Z, saat) {
    const px = F.px, tag = 1 - F.nacht, r = w / 2, B = blickAus(F);
    /* Gewände: hellere Sandsteinrahmung mit Schlussstein */
    const gw = 0.11;
    g.fillStyle = rgb(hell(STEIN, 0.08)); rundbogenPfad(g, x - gw, y - gw, w + 2 * gw, h + gw); g.fill();
    g.fillStyle = rgb(hell(STEIN, 0.14)); g.beginPath(); g.moveTo(x + r - 0.07, y - gw - 0.03); g.lineTo(x + r + 0.07, y - gw - 0.03); g.lineTo(x + r + 0.05, y + 0.06); g.lineTo(x + r - 0.05, y + 0.06); g.closePath(); g.fill();
    if (px > 16) { g.strokeStyle = "rgba(120,100,70,0.5)"; g.lineWidth = Math.max(0.006, 0.6 / px); rundbogenPfad(g, x - gw, y - gw, w + 2 * gw, h + gw); g.stroke(); }
    g.save(); rundbogenPfad(g, x, y, w, h); g.clip();
    const pT = laibung(g, F, B, x, y, w, h, 0.22, hell(STEIN, -0.05));
    const fx = x + pT[0], fy = y + pT[1];
    if (!Z.fenster) { g.fillStyle = "rgb(24,20,18)"; g.fillRect(fx - 0.1, fy - 0.1, w + 0.2, h + 0.2); g.restore(); return; }
    const gi = g.createLinearGradient(0, fy, 0, fy + h); gi.addColorStop(0, "rgb(30,30,34)"); gi.addColorStop(1, "rgb(56,50,46)");
    g.fillStyle = gi; g.fillRect(fx - 0.1, fy - 0.1, w + 0.2, h + 0.2);
    const himmel = (F.zeit && F.zeit.himmel) || ["#bcd3ea", "#e9f1f8"];
    const sp = g.createLinearGradient(0, fy, 0, fy + h), an = 0.5 * (0.3 + 0.7 * tag);
    sp.addColorStop(0, rgb(misch(hex(himmel[0]), [196, 210, 226], 0.4), an.toFixed(3))); sp.addColorStop(1, rgb([110, 120, 100], (an * 0.6).toFixed(3)));
    g.fillStyle = sp; g.fillRect(fx - 0.1, fy - 0.1, w + 0.2, h + 0.2);
    if (px > 12) { g.fillStyle = "rgba(255,255,255," + (0.06 + 0.1 * tag).toFixed(3) + ")"; poly(g, [[fx + w * 0.1, fy + h], [fx + w * 0.5, fy], [fx + w * 0.7, fy], [fx + w * 0.3, fy + h]]); g.fill(); }
    /* Rahmen und Sprossen (dunkelgrün gestrichen) */
    const rc = "rgb(52,70,58)", sb = Math.max(0.022, 0.8 / px);
    g.strokeStyle = rc; g.lineWidth = 0.05; rundbogenPfad(g, fx + 0.025, fy + 0.025, w - 0.05, h - 0.05); g.stroke();
    g.fillStyle = rc;
    g.fillRect(fx + w / 2 - sb / 2, fy, sb, h);
    for (let k = 1; k < 4; k++) g.fillRect(fx, fy + r + (h - r) * k / 4 - sb / 2, w, sb);
    g.fillRect(fx, fy + r - sb / 2, w, sb);
    schattenL(g, F, x, y, w, h, 0.22, 0.32);
    g.restore();
    /* Sohlbank */
    const sv = F.schatten(0.08);
    if (sv) { g.fillStyle = "rgba(40,30,20,0.3)"; g.fillRect(x - 0.12 + sv[0], y + h + 0.07, w + 0.24, Math.max(0.02, sv[1])); }
    g.fillStyle = rgb(hell(STEIN, 0.1)); g.fillRect(x - 0.12, y + h, w + 0.24, 0.07);
    g.fillStyle = "rgba(60,40,20,0.3)"; g.fillRect(x - 0.12, y + h + 0.055, w + 0.24, 0.015);
    PI.schliere(g, x - 0.05, y + h + 0.07, w + 0.1, 0.6 + (saat % 5) * 0.1, F);
    if (F.jahr === "winter" && Z.fertig) { g.fillStyle = "rgb(242,246,252)"; PI.rundRechteck(g, x - 0.12, y + h - 0.025, w + 0.24, 0.04, 0.015); g.fill(); }
  }
  function turmFensterLicht(g, F, x, y, w, h) {
    const a = F.nacht;
    if (a <= 0.01) return;
    const B = blickAus(F), pT = parallaxe(F, B, 0.22), r = w / 2;
    g.save(); rundbogenPfad(g, x, y, w, h); g.clip();
    const fx = x + pT[0], fy = y + pT[1];
    const gr = g.createRadialGradient(fx + w / 2, fy + h * 0.8, 0, fx + w / 2, fy + h * 0.5, h);
    gr.addColorStop(0, "rgba(255,212,140," + (0.9 * a).toFixed(3) + ")"); gr.addColorStop(1, "rgba(180,100,50," + (0.75 * a).toFixed(3) + ")");
    g.fillStyle = gr; g.fillRect(fx - 0.1, fy - 0.1, w + 0.2, h + 0.2);
    g.fillStyle = "rgba(40,34,30," + (0.9 * a).toFixed(3) + ")";
    g.fillRect(fx + w / 2 - 0.012, fy, 0.024, h);
    for (let k = 0; k < 4; k++) g.fillRect(fx, fy + r + (h - r) * k / 4 - 0.012, w, 0.024);
    g.restore();
    F.leuchtPunkt(x + w / 2, y + h * 0.6, 1.0, "255,190,110", 0.4);
  }
  /* Wandleuchte (schmiedeeisern) neben der Tür */
  function wandLampe(g, F, x, y, an) {
    g.strokeStyle = "rgb(36,34,32)"; g.lineWidth = 0.025;
    g.beginPath(); g.moveTo(x, y - 0.25); g.quadraticCurveTo(x + 0.02, y - 0.12, x, y - 0.06); g.stroke();
    g.fillStyle = "rgb(40,38,36)"; g.beginPath(); g.moveTo(x - 0.09, y - 0.04); g.lineTo(x + 0.09, y - 0.04); g.lineTo(x, y - 0.12); g.closePath(); g.fill();
    g.fillStyle = an ? "rgb(255,224,150)" : "rgb(186,196,196)"; g.fillRect(x - 0.06, y - 0.04, 0.12, 0.16);
    g.fillStyle = "rgb(40,38,36)"; g.fillRect(x - 0.07, y + 0.12, 0.14, 0.03); g.fillRect(x - 0.008, y - 0.04, 0.016, 0.16);
  }

  /* =====================================================================
     DER RUNDE TURM als eine Figur: die Abwicklung (Sandstein, Gesims,
     Fenster, Tür) wird als Bild gemalt und Spalte für Spalte auf den
     Zylinder gelegt; das Licht verläuft weich um den Turm herum. So gibt
     es keine Facettenkanten und keine hellen Haarlinien dazwischen.
     ===================================================================== */
  const umfang = (r) => TAU * r;
  /* Meter in der Abwicklung zu einem Winkel (Bogenmaß, Modell) */
  const abwR = (a, r) => { let t = (TAU - a) % TAU; if (t < 0) t += TAU; return t * r; };
  /* eine gedachte Fläche an der Stelle alpha (Grad) – für Laibungen und Schatten */
  function flaechenF(alpha, gier, basis) {
    const am = alpha * RAD, th = am + gier;
    const n = [Math.cos(th), Math.sin(th), 0], uc = [Math.sin(th), -Math.cos(th), 0], v = [0, 0, -1];
    const L = ST.LICHT, lU = dot(L, uc), lV = dot(L, v), lN = dot(L, n);
    const F = Object.assign({}, basis);
    F.n = n; F.flaeche = { u: [Math.sin(am), -Math.cos(am), 0], v: v, umriss: [] };
    F.lichtU = lU; F.lichtV = lV; F.lichtN = lN; F.licht = Math.max(0, lN);
    F.schatten = function (d) { if (lN <= 0.04) return null; let dx = -lU * d / lN, dy = -lV * d / lN; const l = Math.hypot(dx, dy), mx = d * 2.6; if (l > mx) { dx *= mx / l; dy *= mx / l; } return [dx, dy]; };
    return F;
  }
  /* Leinwände der Abwicklungen: fertige Bilder merken (gleiche Ansicht in
     anderer Tageszeit, mehrere Sternwarten), freie gleicher Größe wiederverwenden –
     eine neue Leinwand anzulegen kostet mehr als das Malen selbst */
  const BILDER = new Map(), FREI = [];
  function leinwand(w, h) {
    w = Math.max(1, Math.ceil(w)); h = Math.max(1, Math.ceil(h));
    const i = FREI.findIndex((c) => c.width === w && c.height === h);
    if (i >= 0) { const c = FREI.splice(i, 1)[0]; c.getContext("2d").setTransform(1, 0, 0, 1, 0, 0); c.getContext("2d").clearRect(0, 0, w, h); return c; }
    const c = document.createElement("canvas"); c.width = w; c.height = h; return c;
  }
  function gemerkt(schl, malen) {
    let c = BILDER.get(schl);
    if (c) { BILDER.delete(schl); BILDER.set(schl, c); return c; }
    c = malen();
    BILDER.set(schl, c);
    while (BILDER.size > 10) { const k = BILDER.keys().next().value; FREI.push(BILDER.get(k)); BILDER.delete(k); if (FREI.length > 6) FREI.shift(); }
    return c;
  }
  /* Abwicklung der Wand (z von ZS bis zTop), Maßstab res Pixel je Meter */
  /* in einen Streifen der Sammelleinwand malen (ziel = { c, y0 } in Bildpunkten) */
  function streifen(ziel, w, h, res) {
    const c = ziel ? ziel.c : leinwand(w * res, h * res), g = c.getContext("2d"), y0 = ziel ? ziel.y0 : 0;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.save(); g.beginPath(); g.rect(0, y0, c.width, Math.ceil(h * res)); g.clip();
    g.setTransform(res, 0, 0, res, 0, y0);
    return { c: c, g: g };
  }
  function wandBild(res, Z, S, zTop, gier, basis, licht, ziel) {
    const U = umfang(RT), H = zTop - ZS, st = streifen(ziel, U, H, res), c = st.c, g = st.g;
    const yZ = (z) => zTop - z, Fb = Object.assign({}, basis, { px: res });
    const offen = (o) => !(o.z0 >= zTop - 0.05);
    const lage = (o) => { const xm = abwR(o.alpha * RAD, RT); return [xm - o.w / 2, xm]; };
    if (licht) {
      /* nur das Leuchtende: Fenster, Lampen */
      for (const o of TURM_OEFF) {
        if (!offen(o)) continue;
        const [x] = lage(o), Fo = flaechenF(o.alpha, gier, Fb);
        if (o.art === "fenster") turmFensterLicht(g, Fo, x, yZ(o.z1), o.w, o.z1 - o.z0);
        else { wandLampe(g, Fo, x - 0.35, yZ(2.25), true); wandLampe(g, Fo, x + o.w + 0.35, yZ(2.25), true); }
      }
      g.restore();
      return c;
    }
    const reihen = quaderLage(S.saat + 11, SCHICHT, ZS, ZW, 0.55, 1.25, U);
    quaderMalen(g, Fb, 0, U, yZ, reihen.filter((R) => R.z0 < zTop - 0.01), STEIN, false, U);
    rausch(g, 0, 0, U, H, 3.2, 0.18, S.saat + 5, 4);
    tonFlecken(g, 0, 0, U, H, 2.2, 0.25, S.saat + 7, "#a89878");
    if (res > 10) bleich(g, 0, 0, U, H, 2.4, 0.08, S.saat + 3);
    /* Gurtgesims mit Inschrift über der Tür */
    if (zTop > ZGU + 0.17) {
      const yg = yZ(ZGU + 0.17), n = 24;
      for (let k = 0; k < n; k++) {
        const a0 = k * U / n, Fk = flaechenF(360 - (a0 + U / n / 2) / U * 360, gier, Fb), sv = Fk.schatten(0.1);
        if (sv) { g.fillStyle = "rgba(50,36,20,0.3)"; g.fillRect(a0 - 0.01, yg + 0.17, U / n + 0.02, Math.max(0.03, sv[1] * 1.2)); }
      }
      g.fillStyle = rgb(hell(STEIN, 0.1)); g.fillRect(0, yg, U, 0.17);
      g.fillStyle = "rgba(255,250,236,0.35)"; g.fillRect(0, yg, U, 0.03);
      g.fillStyle = "rgba(90,70,40,0.35)"; g.fillRect(0, yg + 0.13, U, 0.04);
      if (res > 22) {
        g.fillStyle = "rgba(70,52,30,0.85)"; g.font = "bold 0.11px serif"; g.textAlign = "center"; g.textBaseline = "middle";
        g.fillText("STERNWARTE", abwR(ALPHA_TUER * RAD, RT), yg + 0.085);
      }
    }
    /* Öffnungen */
    for (const o of TURM_OEFF) {
      if (!offen(o)) continue;
      const [x, xm] = lage(o), Fo = flaechenF(o.alpha, gier, Fb);
      const z1 = Math.min(o.z1, zTop), y = yZ(z1), h = z1 - o.z0;
      if (z1 < o.z1) { g.fillStyle = "rgb(22,18,16)"; g.fillRect(x, y, o.w, h); continue; }
      if (o.art === "tuer") {
        if (Z.tuer) PI.tuer(g, x, y, o.w, h, Fo, { bogen: true, farbe: "#3c4e40", gewaendeFarbe: "#d8c6a2", stufe: false, jahr: "1887" });
        else { g.fillStyle = rgb(hell(STEIN, 0.08)); rundbogenPfad(g, x - 0.13, y - 0.13, o.w + 0.26, h + 0.13); g.fill(); g.fillStyle = "rgb(22,18,16)"; rundbogenPfad(g, x, y, o.w, h); g.fill(); }
        if (Z.fertig) { wandLampe(g, Fo, x - 0.35, yZ(2.25), Fo.nacht > 0.3); wandLampe(g, Fo, x + o.w + 0.35, yZ(2.25), Fo.nacht > 0.3); }
      } else turmFenster(g, Fo, x, y, o.w, h, Z, (o.alpha * 7) | 0);
      void xm;
    }
    /* Schatten unter dem Kranzgesims, Schmutz am Fuß, frischer Mörtel */
    if (Z.kranz > 0 && zTop >= ZW - 0.01) { const gr = g.createLinearGradient(0, 0, 0, 0.6); gr.addColorStop(0, "rgba(30,24,30,0.5)"); gr.addColorStop(1, "rgba(30,24,30,0)"); g.fillStyle = gr; g.fillRect(0, 0, U, 0.6); }
    const gu = g.createLinearGradient(0, H - 0.5, 0, H); gu.addColorStop(0, "rgba(80,70,50,0)"); gu.addColorStop(1, "rgba(80,70,50,0.25)");
    g.fillStyle = gu; g.fillRect(0, H - 0.5, U, 0.5);
    if (zTop < ZW - 0.01) { g.fillStyle = "rgba(120,116,108,0.5)"; g.fillRect(0, 0, U, 0.03); }
    g.restore();
    return c;
  }
  /* Abwicklung des rustizierten Sockels (z von −0,9 bis ZS) */
  function sockelBild(res, S, winter, herbst, ziel) {
    const U = umfang(RS), H = ZS + 0.9, st = streifen(ziel, U, H, res), c = st.c, g = st.g;
    const yZ = (z) => ZS - z, Fb = { px: res };
    const reihen = quaderLage(S.saat + 3, 0.3, -0.9, ZS, 0.7, 1.5, U);
    quaderMalen(g, Fb, 0, U, yZ, reihen, STEIN_D, true, U);
    tonFlecken(g, 0, 0, U, H, 1.2, 0.3, S.saat + 9, "#7a7056");
    g.fillStyle = rgb(hell(STEIN_D, 0.12)); g.fillRect(0, 0, U, 0.08);
    g.fillStyle = "rgba(255,250,236,0.3)"; g.fillRect(0, 0, U, 0.02);
    const gr = g.createLinearGradient(0, yZ(0) - 0.35, 0, yZ(0)); gr.addColorStop(0, "rgba(70,80,50,0)"); gr.addColorStop(1, "rgba(70,80,50,0.3)");
    g.fillStyle = gr; g.fillRect(0, yZ(0) - 0.35, U, 0.35);
    if (winter) weheMalen(g, { px: res }, U, yZ(0), S.saat + 3, null, 1.1);
    else if (herbst) laubMalen(g, { px: res }, 0, yZ(0) - 0.13, U, 0.13, 5, 2.5, yZ(0));
    g.restore();
    return c;
  }
  /* Abwicklung des Kranzgesimses (Platte, Zahnschnitt, Karnies) */
  function kranzBild(res, S, winter, ziel) {
    const U = umfang(RF), H = 0.4, st = streifen(ziel, U, H, res), c = st.c, g = st.g;
    g.fillStyle = rgb(hell(STEIN, 0.06)); g.fillRect(0, 0, U, H);
    g.fillStyle = "rgba(255,250,236,0.35)"; g.fillRect(0, 0, U, 0.03);
    g.fillStyle = "rgba(90,70,40,0.4)"; g.fillRect(0, 0.1, U, 0.02);
    g.fillStyle = "rgba(70,52,30,0.55)";
    if (res > 12) for (let a = 0; a < U; a += 0.14) g.fillRect(a + 0.04, 0.14, 0.06, 0.08); else g.fillRect(0, 0.14, U, 0.08);
    const gk = g.createLinearGradient(0, 0.24, 0, H); gk.addColorStop(0, "rgba(60,40,20,0.1)"); gk.addColorStop(1, "rgba(60,40,20,0.45)");
    g.fillStyle = gk; g.fillRect(0, 0.24, U, H - 0.24);
    rausch(g, 0, 0, U, H, 1.5, 0.2, S.saat + 2, 3);
    if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(0, 0, U, 0.05); }
    g.restore();
    return c;
  }
  /* Mantel r, z0…z1 aus dem Bild tex (dessen Oberkante bei texZ liegt) */
  function mantel(g, s, gier, r, z0, z1, tex, texZ, res, Zt, jahr, beleuchten, syOff) {
    if (z1 - z0 < 0.005) return;
    const KZs = ST.KZ * s, W = r * s;
    const sy = (syOff || 0) + Math.max(0, (texZ - z1) * res), sh = Math.max(1, Math.min(tex.height - sy, (z1 - z0) * res));
    for (let x = Math.floor(-W); x < Math.ceil(W); x++) {
      const c = (x + 0.5) / W;
      if (c <= -1 || c >= 1) continue;
      const phi = Math.acos(c), alpha = phi - Math.PI / 4 - gier;
      const sx = Math.min(tex.width - 1, Math.max(0, Math.floor(abwR(alpha, r) * res)));
      const yb = 0.5 * W * Math.sin(phi);
      g.drawImage(tex, sx, sy, 1, sh, x, yb - z1 * KZs, x + 1 < W ? 2.02 : 1.02, (z1 - z0) * KZs);   // doppelt breit: die Figur liegt nicht pixelgenau, sonst schimmert es durch
    }
    if (!beleuchten) return;
    g.save();
    g.beginPath();
    for (let i = 0; i <= 48; i++) { const phi = Math.PI * (1 - i / 48); g.lineTo(W * Math.cos(phi), 0.5 * W * Math.sin(phi) - z1 * KZs); }
    for (let i = 0; i <= 48; i++) { const phi = Math.PI * (i / 48); g.lineTo(W * Math.cos(phi), 0.5 * W * Math.sin(phi) - z0 * KZs); }
    g.closePath(); g.clip();
    const gr = g.createLinearGradient(-W, 0, W, 0);
    for (let i = 0; i <= 24; i++) {
      const c = -0.999 + 1.998 * i / 24, th = Math.acos(c) - Math.PI / 4;
      const lf = ST.lichtFaktor([Math.cos(th), Math.sin(th), 0], Zt, 0, jahr);
      gr.addColorStop(i / 24, "rgb(" + Math.round(lf[0] * 255) + "," + Math.round(lf[1] * 255) + "," + Math.round(lf[2] * 255) + ")");
    }
    g.globalCompositeOperation = "multiply"; g.fillStyle = gr;
    g.fillRect(-W - 2, -z1 * KZs - W, 2 * W + 4, (z1 - z0) * KZs + 2 * W);
    g.restore();
  }
  /* Deckel (waagerechte Ellipse) bei Höhe z mit Halbmesser r */
  function deckel(g, s, r, z, farbe) { g.fillStyle = farbe; g.beginPath(); g.ellipse(0, -z * ST.KZ * s, r * s, 0.5 * r * s, 0, 0, TAU); g.fill(); }
  function turmFigur(Z, S, zTop) {
    return function (g, s, F) {
      const gier = (F.gier || 0) * RAD, KZs = ST.KZ * s;
      const G = Z.grube, tief = G ? 0.9 * G.tiefe * (1 - G.verfuellt) : 0;
      const zSo = Math.max(0.02, -tief + (ZS + tief) * Z.sockel);
      const mitWand = Z.turm > 0 && zTop > ZS + 0.05, mitKranz = mitWand && Z.kranz > 0 && zTop >= ZW - 0.01;
      const zKr = ZW - 0.34 + 0.4 * Math.max(0.3, Z.kranz);
      const zMax = mitKranz ? zKr : mitWand ? zTop : zSo, rMax = mitKranz ? RF : RS;
      if (F.schatten) {
        g.fillStyle = "#000";
        g.beginPath(); g.ellipse(0, -zMax * KZs, rMax * s, 0.5 * rMax * s, 0, 0, TAU); g.fill();
        g.fillRect(-rMax * s, -zMax * KZs, 2 * rMax * s, zMax * KZs);
        g.beginPath(); g.ellipse(0, 0, RS * s, 0.5 * RS * s, 0, 0, TAU); g.fill();
        return;
      }
      const Zt = F.Z || ST.ZEITEN.tag, winter = F.jahr === "winter" && Z.fertig, herbst = F.jahr === "herbst" && Z.fertig;
      const res = Math.max(8, Math.min(180, s));
      const basis = { px: res, jahr: F.jahr, nacht: F.nacht, zeit: Zt, o: F.o, rng: zufall(77), leuchtPunkt: function () {}, name: "turm" };
      const lfO = ST.lichtFaktor([0, 0, 1], Zt, 0, F.jahr), oben = (c) => rgb([c[0] * lfO[0], c[1] * lfO[1], c[2] * lfO[2]]);
      /* Sockel */
      const kopf = [res, S.saat, F.jahr, Z.fertig ? 1 : 0].join("|");
      /* eine Sammelleinwand: oben die Wand, darunter Sockel und Kranz */
      const hW = mitWand ? Math.ceil((zTop - ZS) * res) : 0, hS = Math.ceil((ZS + 0.9) * res);
      const wk = kopf + "|" + zTop.toFixed(3) + "|" + Math.round(F.gier || 0) + "|" + (F.nacht > 0.3 ? 1 : 0) + "|" + [Z.tuer, Z.fenster, Z.kranz > 0, mitWand].map(Number).join("") + "|" + (Zt.name || "");
      const atlas = gemerkt("a|" + wk, () => {
        const c = leinwand(umfang(RF) * res, hW + hS + Math.ceil(0.4 * res));
        if (mitWand) wandBild(res, Z, S, zTop, gier, basis, false, { c: c, y0: 0 });
        sockelBild(res, S, winter, herbst, { c: c, y0: hW });
        kranzBild(res, S, winter, { c: c, y0: hW + hS });
        return c;
      });
      mantel(g, s, gier, RS, -tief, zSo, atlas, ZS, res, Zt, F.jahr, true, hW);
      deckel(g, s, RS, zSo, oben(winter ? [236, 240, 248] : hell(STEIN_D, 0.1)));
      if (!mitWand) {
        /* Estrich im Rund */
        deckel(g, s, RT - 0.5, zSo + 0.005, oben([150, 148, 142]));
        return;
      }
      /* Wand */
      mantel(g, s, gier, RT, ZS, zTop, atlas, zTop, res, Zt, F.jahr, true, 0);
      if (!mitKranz) {
        /* offener Kopf im Bau: Mauerkrone, innen Schatten */
        deckel(g, s, RT, zTop, oben(hell(STEIN, 0.05)));
        g.save(); g.beginPath(); g.ellipse(0, -zTop * KZs, (RT - 0.55) * s, 0.5 * (RT - 0.55) * s, 0, 0, TAU); g.clip();
        const gi = g.createLinearGradient(0, -zTop * KZs - 0.5 * RT * s, 0, -zTop * KZs + 0.5 * RT * s);
        gi.addColorStop(0, "rgb(70,62,52)"); gi.addColorStop(1, oben([150, 146, 138]));
        g.fillStyle = gi; g.fillRect(-RT * s, -zTop * KZs - RT * s, 2 * RT * s, 2 * RT * s);
        g.restore();
      } else {
        mantel(g, s, gier, RF, ZW - 0.34, zKr, atlas, ZW + 0.06, res, Zt, F.jahr, true, hW + hS);
        /* Laufring (Zinkabdeckung) – die Kuppel deckt die Mitte */
        deckel(g, s, RF, zKr, oben(winter ? [238, 242, 250] : [150, 156, 158]));
      }
      /* Nachtlicht der Fenster und Lampen */
      if (F.nacht > 0.01 && Z.fertig) {
        mantel(g, s, gier, RT, ZS, zTop, gemerkt("l|" + wk, () => wandBild(res, Z, S, zTop, gier, basis, true)), zTop, res, Zt, F.jahr, false);
        for (const o of TURM_OEFF) {
          const phi = ((o.alpha * RAD + gier + Math.PI / 4) % TAU + TAU) % TAU;
          if (Math.sin(phi) < 0.2) continue;
          const x = RT * s * Math.cos(phi), yb = 0.5 * RT * s * Math.sin(phi);
          if (o.art === "fenster") F.leuchtPunkt(x, yb - (o.z0 + o.z1) / 2 * KZs, 1.0 * s, "255,190,110", 0.4);
          else F.leuchtPunkt(x, yb - 2.2 * KZs, 1.6 * s, "255,200,120", 0.9, true);
        }
      }
    };
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  ST.modell("sternwarte", {
    name: "Sternwarte", gruppe: "Häuser", grund: [11, 10], hoehe: 10, bauzeit: 16 * 60,
    bauen(M, o) {
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      const Z = zustand(bau);
      const saat = ((o.saat || 7) >>> 0) % 100000;
      const winter = o.jahr === "winter";
      const S = { saat: saat, winter: winter, jahr: o.jahr, blech: saat % 3 === 0 ? ZINK : KUPFER };
      if (Z.grube || Z.aushub > 0.02) {
        if (Z.grube) grubeBauen(M, Z.grube, [TC[0] - RS, TC[1] - RS, TC[0] + RS, TC[1] + RS], 0.9, null, winter, saat);
        if (Z.ring > 0) ringFundament(M, Z, S);
        if (Z.aushub > 0.02) { M.teil("aushub", { mitte: [-3.6, 3.2, 0.4] }); M.figur({ x: -3.4, y: 3.3, z: 0, breite: 3.4, hoehe: 1.0, malen: aushubFigur(Z.aushub, winter) }); }
      }
      if (Z.sockel > 0) turmBauen(M, Z, S);
      if (Z.anbau > 0) anbauBauen(M, Z, S);
      if (Z.gerippe > 0) kuppelBauen(M, Z, S);
      if (Z.fernrohr > 0) fernrohrBauen(M, Z, S);
      if (Z.treppe > 0) treppeBauen(M, Z, S);
      if (Z.uhr) sonnenuhrBauen(M, Z, S);
      if (Z.fertig) {
        const a = ALPHA_TUER * RAD;
        M.bodenlicht(TC[0] + Math.cos(a) * 4.0, TC[1] + Math.sin(a) * 4.0, 2.2, "255,196,120", 0.65);
        M.bodenlicht(-3.15, A_Y1 + 0.9, 1.3, "255,190,110", 0.35);
        if (winter) M.rauchAus(-4.6, -1.3, 4.0, 0.35);
      }
    }
  });

  /* ---------------- Ringfundament ---------------- */
  function ringFundament(M, Z, S) {
    const T = 0.9, zt = -T + T * Z.ring;
    M.teil("ringfund", { ebene: -1, mitte: [TC[0], TC[1], -0.5] });
    const bet = () => (g, F) => betonMalen(g, F, F.w, F.h, S.saat + 11, Z.ring < 1);
    zylinder(M, TC, RS + 0.15, -T, zt, 24, () => (g, F) => betonMalen(g, F, F.w, F.h, S.saat + 12, Z.ring < 1), { name: "rf" });
    ringOben(M, TC, RT - 0.55, RS + 0.15, zt, 24, bet, "rft");
  }
  /* ---------------- Turm (eine Figur: Sockel, Wand, Kranzgesims) ---------------- */
  function turmBauen(M, Z, S) {
    const n = Math.round(Z.turm * 13), zTop = ZS + n * SCHICHT;
    M.teil("turm", { mitte: [TC[0], TC[1], 2.8] });
    M.figur({ x: TC[0], y: TC[1], z: 0, breite: 11, hoehe: 7.4, schatten: true, malen: turmFigur(Z, S, zTop) });
  }

  /* =====================================================================
     KUPPEL: Stehfalzbleche auf Stahlrippen, Spalt, Schieber
     ===================================================================== */
  const KM = [TC[0], TC[1], ZK];
  const kP = (j, b, r) => {
    const th = j * TAU / KN, ph = Math.min(1, b / KB) * Math.PI / 2, R = r || RK;
    return [KM[0] + R * Math.cos(ph) * Math.cos(th), KM[1] + R * Math.cos(ph) * Math.sin(th), KM[2] + R * Math.sin(ph)];
  };
  function kuppelBauen(M, Z, S) {
    const winter = S.winter && Z.fertig, nacht = Z.fertig;
    const rippen = Math.ceil(KN * Math.min(1, Z.gerippe * 1.15));
    const baender = Math.floor(Z.blech * KB + 1e-6);
    M.teil("kuppel", { mitte: [TC[0], TC[1], ZK + 1.4] });
    for (let j = 0; j < KN; j++) {
      const spalt = SPALT.indexOf(j) >= 0;
      for (let b = 0; b < KB; b++) {
        const oben = b === KB - 1;
        const pts = oben ? [kP(j, b), kP(j + 1, b), kP(j, KB)] : [kP(j, b), kP(j + 1, b), kP(j + 1, b + 1), kP(j, b + 1)];
        const thm = (j + 0.5) * TAU / KN, phm = (b + 0.5) / KB * Math.PI / 2;
        let n = [Math.cos(phm) * Math.cos(thm), Math.cos(phm) * Math.sin(thm), Math.sin(phm)];
        const ex = nrm(kreuz(sub(pts[1], pts[0]), sub(pts[pts.length - 1], pts[0])));
        n = dot(ex, n) < 0 ? mul(ex, -1) : ex;
        const u = nrm(kreuz(n, Z3));
        const geblecht = b < baender && !(spalt && Z.blech >= 1);
        if (geblecht) {
          vieleck(M, "k" + j + "-" + b, pts, n, u, blechMaler(j, b, S, winter), { keinLicht: true });
        } else if (spalt && Z.blech >= 1) {
          vieleck(M, "s" + j + "-" + b, pts, n, u, spaltMaler(j, b, S), { keinLicht: true, leuchten: nacht ? spaltLicht(j, b) : null });
        } else if (j < rippen) {
          vieleck(M, "r" + j + "-" + b, pts, n, u, rippenMaler(b), { keinLicht: true, beidseitig: true, keinAo: true });
        }
      }
    }
    /* Schieber: über den Scheitel nach hinten geschoben (auf den Meridianen gegenüber) */
    if (Z.schieber) {
      M.teil("schieber", { mitte: [TC[0], TC[1], ZK + 3.2] });
      for (const j0 of SPALT) {
        const j = (j0 + KN / 2) % KN;
        for (let b = 3; b < KB - 1; b++) {
          const pts = [kP(j, b, RK + 0.07), kP(j + 1, b, RK + 0.07), kP(j + 1, b + 1, RK + 0.07), kP(j, b + 1, RK + 0.07)];
          const ex = nrm(kreuz(sub(pts[1], pts[0]), sub(pts[3], pts[0])));
          const thm = (j + 0.5) * TAU / KN, phm = (b + 0.5) / KB * Math.PI / 2;
          const n = dot(ex, [Math.cos(phm) * Math.cos(thm), Math.cos(phm) * Math.sin(thm), Math.sin(phm)]) < 0 ? mul(ex, -1) : ex;
          vieleck(M, "sch" + j + "-" + b, pts, n, nrm(kreuz(n, Z3)), blechMaler(j + 100, b, S, winter, true), { keinLicht: true });
        }
      }
    }
  }
  /* Bleche malen schon belichtet (keinLicht): so verschwinden die hellen
     Haarlinien zwischen den Feldern, die sonst nachts als Gitter leuchten */
  function blechMaler(j, b, S, winter, schieber) {
    return function (g, F) {
      const um = F.flaeche.umriss, px = F.px;
      const lf = ST.lichtFaktor(F.n, F.zeit, winter && b >= 4 ? 0.05 : 0, F.jahr);
      const L = (c, a) => rgb([Math.min(255, c[0] * lf[0]), Math.min(255, c[1] * lf[1]), Math.min(255, c[2] * lf[2])], a);
      const Lh = (c) => "#" + c.map((v, i) => ("0" + Math.round(Math.min(255, v * lf[i])).toString(16)).slice(-2)).join("");
      const c = S.blech[(j * 7 + b * 3) % S.blech.length];
      g.fillStyle = L(c); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      /* Patina: Läufer und Flecken, dunkler Kupferton */
      if (px > 7) {
        tonFlecken(g, 0, 0, F.w, F.h, 1.6, 0.22, 3, Lh(S.blech === KUPFER ? [90, 138, 116] : [138, 144, 150]));
        if (S.blech === KUPFER) tonFlecken(g, 0, 0, F.w, F.h, 1.1, 0.1, 5, Lh([138, 90, 58]));
      }
      /* Regenläufer: senkrechte helle und dunkle Streifen */
      if (px > 8) { const r2 = zufall(j * 13 + 1); for (let k = 0; k < 3; k++) { const x = r2() * F.w; g.fillStyle = r2() < 0.5 ? L([255, 255, 255], 0.07) : "rgba(20,40,40,0.08)"; g.fillRect(x, -0.05, 0.04 + r2() * 0.08, F.h + 0.1); } }
      if (px > 8) maser(g, 0, 0, F.w, F.h, 0.04, 0.9, 0.18, j * 5 + b, true);
      if (px > 7) rausch(g, 0, 0, F.w, F.h, 1.4, 0.14, j + b, 3);
      /* Stehfalze an den Meridiankanten, Querfalz in der Mitte (versetzt) */
      const lw = Math.max(0.012, 0.8 / px);
      g.lineWidth = lw * 1.6; g.strokeStyle = L(hell(c, 0.22));
      g.beginPath(); g.moveTo(um[0][0] + lw, um[0][1]); g.lineTo(um[um.length - 1][0] + lw, um[um.length - 1][1]); g.stroke();
      g.strokeStyle = L(hell(c, -0.35)); g.lineWidth = lw;
      g.beginPath(); g.moveTo(um[1][0] - lw, um[1][1]); g.lineTo(um[2][0] - lw, um[2][1]); g.stroke();
      if (um.length === 4 && px > 6) {
        const t = (j % 2) ? 0.35 : 0.65, yA = um[0][1] + (um[3][1] - um[0][1]) * t;
        g.strokeStyle = L(hell(c, -0.25), 0.7); g.lineWidth = lw * 0.8;
        g.beginPath(); g.moveTo(-0.05, yA); g.lineTo(F.w + 0.05, yA); g.stroke();
      }
      if (schieber) { g.fillStyle = "rgba(30,30,34,0.35)"; g.fillRect(-0.05, -0.05, 0.06, F.h + 0.1); g.fillRect(F.w - 0.01, -0.05, 0.06, F.h + 0.1); }
      if (winter && b >= 4) {
        /* Schnee hält nur auf den flacheren oberen Bändern: oben geschlossen,
           darunter eine weiche Abbruchkante, von Feld zu Feld verschieden */
        const r3 = zufall(j * 7 + b * 131 + 3)(), anteil = b >= 6 ? 1.2 : b === 5 ? 0.35 + 0.5 * r3 : 0.08 + 0.3 * r3;
        const yk = (x) => F.h * anteil + 0.012 * Math.sin(x * 17 + j * 3);
        g.save();
        g.beginPath(); g.moveTo(-0.05, -0.05); g.lineTo(F.w + 0.05, -0.05);
        for (let x = F.w + 0.05; x >= -0.05; x -= 0.05) g.lineTo(x, yk(x));
        g.closePath();
        const gs = g.createLinearGradient(0, 0, 0, F.h);
        gs.addColorStop(0, L([246, 249, 253])); gs.addColorStop(1, L([222, 230, 242]));
        g.fillStyle = gs; g.fill();
        g.strokeStyle = L([160, 176, 206], 0.5); g.lineWidth = Math.max(0.01, 0.8 / px); g.stroke();
        g.restore();
      }
    };
  }

  /* Spalt: dunkles Innere, Rippen, Spaltrahmen an den Kanten */
  function spaltMaler(j, b, S) {
    return function (g, F) {
      const um = F.flaeche.umriss, lf = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
      const L = (c, a) => rgb([c[0] * lf[0], c[1] * lf[1], c[2] * lf[2]], a);
      const gr = g.createLinearGradient(0, 0, 0, F.h);
      gr.addColorStop(0, "rgb(16,16,22)"); gr.addColorStop(1, "rgb(34,30,32)");
      g.fillStyle = gr; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      /* innen: Spanten und die Unterseite der Bleche */
      g.strokeStyle = "rgba(90,86,84,0.6)"; g.lineWidth = 0.03;
      g.beginPath(); g.moveTo(-0.05, F.h * 0.5); g.lineTo(F.w + 0.05, F.h * 0.5); g.stroke();
      /* Spaltrahmen (U-Profil) an der Außenkante des Spalts */
      const aussen = j === SPALT[0] ? [um[1], um[2]] : [um[0], um[um.length - 1]];
      g.strokeStyle = L(S.blech === KUPFER ? [120, 110, 96] : [190, 194, 198]); g.lineWidth = 0.09;
      g.beginPath(); g.moveTo(aussen[0][0], aussen[0][1]); g.lineTo(aussen[1][0], aussen[1][1]); g.stroke();
      g.strokeStyle = "rgba(0,0,0,0.4)"; g.lineWidth = 0.02;
      const dx = j === SPALT[0] ? -0.055 : 0.055;
      g.beginPath(); g.moveTo(aussen[0][0] + dx, aussen[0][1]); g.lineTo(aussen[1][0] + dx, aussen[1][1]); g.stroke();
      if (b === 0) { g.fillStyle = L([110, 104, 98]); g.fillRect(-0.05, F.h - 0.08, F.w + 0.1, 0.1); }
    };
  }
  function spaltLicht(j, b) {
    return function (g, F) {
      const a = F.nacht;
      if (a <= 0.01) return;
      const gr = g.createLinearGradient(0, 0, 0, F.h);
      const k = 1 - b / KB;
      gr.addColorStop(0, "rgba(255,170,90," + (0.35 * a * k).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,196,120," + (0.75 * a * (k + 0.1)).toFixed(3) + ")");
      g.fillStyle = gr; g.fillRect(0.06, -0.05, F.w - 0.12, F.h + 0.1);
      if (b === 1 && j === SPALT[0]) F.leuchtPunkt(F.w, F.h * 0.5, 2.6, "255,190,110", 0.8);
    };
  }
  function rippenMaler(b) {
    return function (g, F) {
      const um = F.flaeche.umriss, L = belichter2(F, 0.05);
      g.strokeStyle = L([70, 74, 80]); g.lineWidth = 0.07; g.lineCap = "round";
      g.beginPath(); g.moveTo(um[0][0], um[0][1]); g.lineTo(um[um.length - 1][0], um[um.length - 1][1]); g.stroke();
      if (b % 2 === 0) { g.lineWidth = 0.05; g.beginPath(); g.moveTo(um[0][0], um[0][1]); g.lineTo(um[1][0], um[1][1]); g.stroke(); }
    };
  }

  /* ---------------- Fernrohr (Refraktor mit Taukappe) ---------------- */
  function fernrohrBauen(M, Z, S) {
    const az = SPALT_A * RAD, el = ERH * RAD;
    const d = [Math.cos(el) * Math.cos(az), Math.cos(el) * Math.sin(az), Math.sin(el)];
    const P0 = [TC[0], TC[1], ZK + 0.9];
    const s1 = 1.35, s2 = 1.35 + 1.85 * Z.fernrohr;
    const at = (s) => add(P0, mul(d, s));
    M.teil("fernrohr", { mitte: at(2.7) });
    const weiss = (i) => (g, F) => {
      const c = [232, 228, 214];
      g.fillStyle = rgb(c); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      const gr = g.createLinearGradient(0, 0, F.w, 0); gr.addColorStop(0, "rgba(255,255,255,0.15)"); gr.addColorStop(1, "rgba(120,110,90,0.15)");
      g.fillStyle = gr; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      /* Messingringe */
      g.fillStyle = "rgb(186,150,70)"; for (const a of [0.12, F.w * 0.55]) g.fillRect(a, -0.05, 0.05, F.h + 0.1);
      void i;
    };
    rohr(M, at(s1), at(s2), 0.22, 12, (i) => weiss(i), null, { name: "fr", dreh: 0.2 });
    if (Z.fernrohr < 1) return;
    const schwarz = () => (g, F) => { g.fillStyle = "rgb(30,30,32)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(-0.05, -0.05, F.w + 0.1, 0.02); };
    rohr(M, at(s2 - 0.02), at(s2 + 0.42), 0.25, 12, schwarz, (s) => s > 0 ? (g, F) => {
      g.fillStyle = "rgb(14,14,18)"; g.beginPath(); g.ellipse(F.w / 2, F.h / 2, F.w / 2, F.h / 2, 0, 0, TAU); g.fill();
      const gr = g.createRadialGradient(F.w * 0.4, F.h * 0.4, 0, F.w / 2, F.h / 2, F.w * 0.4);
      gr.addColorStop(0, "rgba(140,170,210,0.55)"); gr.addColorStop(1, "rgba(30,40,70,0.2)");
      g.fillStyle = gr; g.beginPath(); g.ellipse(F.w / 2, F.h / 2, F.w * 0.38, F.h * 0.38, 0, 0, TAU); g.fill();
    } : (g, F) => { g.fillStyle = "rgb(20,20,22)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); }, { name: "tk", dreh: 0.2, ohneKappe: -1 });
    /* Sucherfernrohr obenauf */
    const q = nrm(kreuz(d, Z3)), up = nrm(kreuz(q, d));
    const sp = (s) => add(at(s), mul(up, 0.3));
    rohr(M, sp(2.0), sp(2.75), 0.05, 6, () => (g, F) => { g.fillStyle = "rgb(40,40,44)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); }, null, { name: "su" });
  }

  /* =====================================================================
     ANBAU: verputzt, Sandstein-Eckquader, Pultdach aus Zink
     ===================================================================== */
  const PUTZ = "#e2d6bc";
  function anbauBauen(M, Z, S) {
    const winter = S.winter && Z.fertig;
    const zW = 0.4 + (A_ZT + 0.6 - 0.4) * Z.anbau;      // wachsende Mauerkrone (Ost höher)
    const zO = (x) => Math.min(zW, zAD(x) - 0.12);
    M.teil("anbau", { mitte: [(A_X0 + A_X1) / 2, (A_Y0 + A_Y1) / 2, 1.5] });
    /* zTop = höchster Punkt der Fläche (Flächen-y 0), ecken = [links, rechts] */
    const putzMal = (name, zTop, ecken) => (g, F) => {
      const w = F.w, h = F.h, yZ = (z) => zTop - z;
      PI.putz(g, -0.05, -0.05, w + 0.1, h + 0.1, PUTZ, F, { saat: S.saat + name.length, boden: true });
      /* Sockel aus Sandstein */
      g.fillStyle = rgb(STEIN_D); g.fillRect(-0.05, h - 0.45, w + 0.1, 0.45);
      g.fillStyle = "rgba(255,250,236,0.3)"; g.fillRect(-0.05, h - 0.45, w + 0.1, 0.03);
      rausch(g, 0, h - 0.45, w, 0.45, 0.8, 0.3, 5, 3);
      /* Eckquader im Wechsel lang/kurz */
      const ecke = (rechts) => { for (let z = 0.45, k = 0; z < h; z += 0.32, k++) { const lw = k % 2 ? 0.28 : 0.46, xx = rechts ? w - lw : 0; g.fillStyle = rgb(hell(STEIN, k % 3 ? 0 : 0.05)); g.fillRect(xx, h - z - 0.3, lw, 0.3); g.fillStyle = "rgba(90,70,40,0.35)"; g.fillRect(xx, h - z - 0.012, lw, 0.012); } };
      if (ecken[0]) ecke(false); if (ecken[1]) ecke(true);
      for (const o of ANBAU_OEFF[name] || []) {
        if (o.z0 >= zW - 0.05) continue;
        const z1 = Math.min(o.z1, zW), yy = yZ(z1), hh = z1 - o.z0;
        if (z1 < o.z1 || (o.art === "fenster" && !Z.fenster) || (o.art === "tuer" && !Z.tuer)) { g.fillStyle = "rgb(24,20,18)"; g.fillRect(o.a0, yy, o.a1 - o.a0, hh); continue; }
        if (o.art === "fenster") PI.fenster(g, o.a0, yy, o.a1 - o.a0, hh, F, { rahmen: "#ece6d8", fluegel: 2, sprossen: [1, 3], bank: true, tiefe: 0.14, laibung: "#d6cbb0", bankFarbe: "#c9b48e", vorhangFarbe: "#d8cfb8" });
        else {
          PI.tuer(g, o.a0, yy, o.a1 - o.a0, hh, F, { farbe: "#4a3426", gewaendeFarbe: "#d0bc96", stufe: false });
          if (F.px > 18) { PI.klingel(g, o.a1 + 0.22, yy + hh * 0.42, F, "Sternwarte"); PI.hausnummer(g, o.a1 + 0.17, yy + 0.25, F, 1); }
        }
      }
      if (Z.adach >= 1) { const gr = g.createLinearGradient(0, 0, 0, 0.6); gr.addColorStop(0, "rgba(30,26,34,0.35)"); gr.addColorStop(1, "rgba(30,26,34,0)"); g.fillStyle = gr; g.fillRect(-0.1, 0, w + 0.2, 0.6); }
      if (F.jahr === "winter" && Z.fertig) weheMalen(g, F, w, h, S.saat + name.length * 3, name === "s" ? [[ANBAU_OEFF.s[1].a0 - 0.2, ANBAU_OEFF.s[1].a1 + 0.2]] : null, 1);
      if (F.jahr === "herbst" && Z.fertig) laubMalen(g, F, 0, h - 0.12, w, 0.13, 7, 2, h);
    };
    const ex = (n, zt) => ({ name: "an-" + n, ao: true, beidseitig: Z.adach < 1, leuchten: Z.fertig ? anbauLeuchten(n, zt) : null });
    /* Süd- und Nordwand mit schräger Krone */
    const sued = [[A_X0, A_Y1, zO(A_X0)], [A_X1, A_Y1, zO(A_X1)], [A_X1, A_Y1, 0], [A_X0, A_Y1, 0]];
    vieleck(M, "an-s", sued, [0, 1, 0], [1, 0, 0], putzMal("s", zO(A_X1), [true, false]), ex("s", zO(A_X1)));
    const nord = [[A_X1, A_Y0, zO(A_X1)], [A_X0, A_Y0, zO(A_X0)], [A_X0, A_Y0, 0], [A_X1, A_Y0, 0]];
    vieleck(M, "an-n", nord, [0, -1, 0], [-1, 0, 0], putzMal("n", zO(A_X1), [false, true]), ex("n", zO(A_X1)));
    wand(M, [A_X0, A_Y0, zO(A_X0)], [-1, 0, 0], A_Y1 - A_Y0, zO(A_X0), putzMal("w", zO(A_X0), [true, true]), ex("w", zO(A_X0)));
    if (Z.adach > 0) anbauDach(M, Z, S, winter);
    /* kleiner Kamin des Ofens im Rechenzimmer */
    if (Z.adach >= 1) {
      const kx0 = -4.85, kx1 = -4.45, ky0 = -1.5, ky1 = -1.1, zb = zAD(kx0), zt = 4.0;
      M.teil("akamin", { mitte: [(kx0 + kx1) / 2, (ky0 + ky1) / 2, 6] });
      const zg = (g, F) => { g.fillStyle = "rgb(150,70,50)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); g.fillStyle = "rgba(220,210,190,0.6)"; for (let y = 0.075; y < F.h; y += 0.075) g.fillRect(-0.05, y, F.w + 0.1, 0.01); rausch(g, 0, 0, F.w, F.h, 0.6, 0.3, 3, 3); g.fillStyle = "rgb(60,56,52)"; g.fillRect(-0.05, -0.05, F.w + 0.1, 0.08); };
      kiste(M, kx0, ky0, zb - 0.05, kx1, ky1, zt, { s: zg, n: zg, o: zg, w: zg, t: schneeOben("#2a2624") }, { name: "akamin" });
    }
  }
  const ANBAU_OEFF = {
    s: [{ art: "fenster", a0: 0.5, a1: 1.3, z0: 1.15, z1: 2.4 }, { art: "tuer", a0: 1.75, a1: 2.7, z0: 0.4, z1: 2.55 }],
    w: [{ art: "fenster", a0: 0.9, a1: 1.7, z0: 1.15, z1: 2.4 }],
    n: [{ art: "fenster", a0: 1.2, a1: 2.0, z0: 1.15, z1: 2.4 }]
  };
  function anbauLeuchten(name, zTop) {
    return function (g, F) {
      for (const o of ANBAU_OEFF[name] || []) if (o.art === "fenster") PI.fensterLicht(g, o.a0, zTop - o.z1, o.a1 - o.a0, o.z1 - o.z0, F, { sprossen: [1, 3], an: 0.9 });
    };
  }
  function anbauDach(M, Z, S, winter) {
    M.teil("adach", { mitte: [(A_X0 + A_X1) / 2, (A_Y0 + A_Y1) / 2, 6] });
    const ue = 0.18, x0 = A_X0 - ue, y0 = A_Y0 - ue, y1 = A_Y1 + ue;
    /* Ostrand folgt dem Turm (Kreisbogen) */
    const pts = [[x0, y1, zAD(x0)], [x0, y0, zAD(x0)]];
    const yb0 = Math.max(y0, TC[1] - RT + 0.01), yb1 = Math.min(y1, TC[1] + RT - 0.01);
    pts.push([kreisX(y0) + 0.02, y0, zAD(kreisX(y0))]);
    for (let k = 0; k <= 10; k++) { const y = yb0 + (yb1 - yb0) * k / 10; const x = kreisX(y) + 0.01; pts.push([x, y, zAD(x)]); }
    pts.push([kreisX(y1) + 0.02, y1, zAD(kreisX(y1))]);
    const nD = nrm([-0.13, 0, 1]);
    const zinkMal = (g, F) => {
      const bis = Z.adach;
      holzMalen(g, F, -0.05, -0.05, F.w + 0.1, F.h + 0.1, [184, 150, 106], 3, false);
      g.save(); g.beginPath(); g.rect(-0.1, -0.1, (F.w + 0.2) * bis, F.h + 0.2); g.clip();
      g.fillStyle = "rgb(156,162,166)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      tonFlecken(g, 0, 0, F.w, F.h, 0.9, 0.3, 5, "#7c8288");
      rausch(g, 0, 0, F.w, F.h, 1.2, 0.18, 9, 3);
      /* Stehfalze in Gefällerichtung (entlang x) */
      const lw = Math.max(0.012, 0.8 / F.px);
      for (let y = 0.45; y < F.h; y += 0.5) { g.fillStyle = "rgba(230,234,236,0.7)"; g.fillRect(-0.05, y - lw, F.w + 0.1, lw); g.fillStyle = "rgba(60,64,68,0.6)"; g.fillRect(-0.05, y, F.w + 0.1, lw); }
      if (winter) schneeFlaeche(g, F, -0.05, -0.05, F.w + 0.1, F.h + 0.1, 17, {});
      g.restore();
    };
    vieleck(M, "adach", pts, nD, [0, 1, 0], zinkMal, { lichtExtra: winter ? 0.05 : 0 });
    /* Stirnbretter West, Süd, Nord; Rinne an der Westtraufe */
    const kante = (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [96, 84, 70], 5, false); const gr = g.createLinearGradient(0, F.h * 0.3, 0, F.h); gr.addColorStop(0, "rgb(150,156,158)"); gr.addColorStop(0.5, "rgb(196,200,202)"); gr.addColorStop(1, "rgb(110,114,116)"); g.fillStyle = gr; g.fillRect(-0.02, F.h * 0.3, F.w + 0.04, F.h * 0.7); if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.05); } };
    const brett = (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [96, 84, 70], 6, false); if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.04); } };
    wand(M, [x0, y0, zAD(x0)], [-1, 0, 0], y1 - y0, 0.18, kante, { name: "ad-w", keinAo: true });
    vieleck(M, "ad-s", [[x0, y1, zAD(x0)], [kreisX(y1), y1, zAD(kreisX(y1))], [kreisX(y1), y1, zAD(kreisX(y1)) - 0.14], [x0, y1, zAD(x0) - 0.14]], [0, 1, 0], [1, 0, 0], brett, { keinAo: true });
    vieleck(M, "ad-n", [[kreisX(y0), y0, zAD(kreisX(y0))], [x0, y0, zAD(x0)], [x0, y0, zAD(x0) - 0.14], [kreisX(y0), y0, zAD(kreisX(y0)) - 0.14]], [0, -1, 0], [-1, 0, 0], brett, { keinAo: true });
    if (winter) {
      M.teil("azapfen", { schatten: false, mitte: [x0 - 3, (y0 + y1) / 2, 6.1] });
      M.flaeche({ name: "azapfen", o: [x0 - 0.01, y0, zAD(x0) - 0.18], u: [0, 1, 0], v: [0, 0, -1], w: y1 - y0, h: 0.35, keinLicht: true, keinAo: true, malen: zapfenMal(S.saat + 3, 0.28) });
    }
  }

  /* =====================================================================
     FREITREPPE mit Wangen, SONNENUHR
     ===================================================================== */
  function treppeBauen(M0, Z, S) {
    /* im gedrehten Achsenkreuz: x zeigt von der Turmmitte zur Tür */
    const M = drehBauer(M0, ALPHA_TUER);
    const cxw = TC[0] * Math.cos(-ALPHA_TUER * RAD) - TC[1] * Math.sin(-ALPHA_TUER * RAD);
    const cyw = TC[0] * Math.sin(-ALPHA_TUER * RAD) + TC[1] * Math.cos(-ALPHA_TUER * RAD);
    const winter = S.winter && Z.fertig, k = Z.treppe;
    const B = 0.85, T = 0.34, HS = ZS / 4;
    const stein = (sa) => (g, F) => { g.fillStyle = rgb(hell(STEIN, -0.04)); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); rausch(g, 0, 0, F.w, F.h, 0.8, 0.3, sa, 3); tonFlecken(g, 0, 0, F.w, F.h, 0.6, 0.25, sa + 1, "#9a8a6a"); g.fillStyle = "rgba(255,250,236,0.25)"; g.fillRect(-0.05, -0.05, F.w + 0.1, 0.025); };
    const tritt = (sa) => (g, F) => { stein(sa)(g, F); if (winter) { g.fillStyle = "rgba(242,246,252,0.92)"; PI.rundRechteck(g, 0.05, 0.03, F.w - 0.1, F.h - 0.06, 0.04); g.fill(); } else { g.fillStyle = "rgba(90,70,50,0.18)"; g.fillRect(F.w * 0.3, 0, F.w * 0.4, F.h); } };
    const n = Math.max(1, Math.ceil(4 * k));
    for (let i = 0; i < n; i++) {
      const x0 = cxw + RT - 0.03, x1 = cxw + RS + 0.04 + (4 - i) * T;
      M.teil("stufe" + i, { mitte: [cxw + 4.6, cyw, (i + 0.5) * HS] });
      kiste(M, x0, cyw - B, i * HS, x1, cyw + B, (i + 1) * HS, { o: stein(10 + i), s: stein(20 + i), n: stein(30 + i), t: tritt(40 + i) }, { name: "st" + i });
      void x0;
    }
    if (k < 1) return;
    /* Wangen mit Abdeckplatte */
    for (const s of [-1, 1]) {
      const y0 = cyw + s * B, y1 = y0 + s * 0.28, xa = cxw + RT - 0.03 + (RT - Math.sqrt(RT * RT - (B + 0.28) * (B + 0.28))), xe = cxw + RS + 0.04 + 4 * T + 0.06;
      M.teil("wange" + s, { mitte: [cxw + 4.7, (y0 + y1) / 2, 0.5] });
      const ya = Math.min(y0, y1), yb = Math.max(y0, y1);
      const zA = ZS + 0.35, zE = 0.45;
      vieleck(M, "wa-o" + s, [[xe, yb, zE], [xe, ya, zE], [xe, ya, 0], [xe, yb, 0]], [1, 0, 0], [0, -1, 0], stein(51));
      const seitlich = [[xa, s > 0 ? yb : ya, zA], [xe, s > 0 ? yb : ya, zE], [xe, s > 0 ? yb : ya, 0], [xa, s > 0 ? yb : ya, 0]];
      vieleck(M, "wa-s" + s, seitlich, [0, s, 0], [s, 0, 0], stein(52), { ao: true });
      const innen = seitlich.map((p) => [p[0], s > 0 ? ya : yb, p[2]]);
      vieleck(M, "wa-i" + s, innen, [0, -s, 0], [-s, 0, 0], stein(54), { ao: true });
      const deckN = nrm([zA - zE, 0, xe - xa]);
      vieleck(M, "wa-t" + s, [[xa, ya, zA], [xe, ya, zE], [xe, yb, zE], [xa, yb, zA]], deckN, [1, 0, 0], schneeOben(stein(53)));
    }
  }
  function sonnenuhrBauen(M, Z, S) {
    const x = 4.2, y = 3.3;
    M.teil("uhr", { mitte: [x, y, 0.5] });
    const stein = (sa) => (i) => (g, F) => { g.fillStyle = rgb(hell(STEIN, -0.02)); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); rausch(g, 0, 0, F.w, F.h, 0.6, 0.3, sa + i, 3); tonFlecken(g, 0, 0, F.w, F.h, 0.5, 0.3, sa, "#8a8a6a"); };
    rohr(M, [x, y, 0], [x, y, 0.95], 0.16, 8, stein(3), null, { name: "us", ao: true });
    kiste(M, x - 0.3, y - 0.3, 0.95, x + 0.3, y + 0.3, 1.03, { s: stein(5)(0), n: stein(5)(1), o: stein(5)(2), w: stein(5)(3), t: (g, F) => {
      g.fillStyle = "rgb(200,184,150)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      g.fillStyle = "rgb(150,140,110)"; g.beginPath(); g.arc(F.w / 2, F.h / 2, 0.25, 0, TAU); g.fill();
      g.strokeStyle = "rgb(60,50,40)"; g.lineWidth = 0.008; g.beginPath(); for (let k = 0; k < 12; k++) { const a = Math.PI + k * Math.PI / 11; g.moveTo(F.w / 2, F.h / 2); g.lineTo(F.w / 2 + Math.cos(a) * 0.24, F.h / 2 + Math.sin(a) * 0.24); } g.stroke();
      if (F.jahr === "winter" && Z.fertig) { g.fillStyle = "rgba(242,246,252,0.95)"; PI.rundRechteck(g, 0.02, 0.02, F.w - 0.04, F.h - 0.04, 0.05); g.fill(); }
    } }, { name: "up" });
    /* Schattenstab (Gnomon) aus Messing, nach Norden */
    vieleck(M, "gnomon", [[x, y + 0.2, 1.03], [x, y - 0.2, 1.03], [x, y - 0.2, 1.28]], [1, 0, 0], [0, -1, 0], (g, F) => { g.fillStyle = "rgb(176,140,62)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); }, { beidseitig: true, keinAo: true });
  }
})();
