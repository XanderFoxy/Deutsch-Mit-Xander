/* =====================================================================
   FASSUNG 833 — JAGDHÜTTE: dunkles Blockhaus mit Hirschgeweih über der
   Tür, kleiner Veranda mit Bank und einem hölzernen Hochsitz
   ---------------------------------------------------------------------
   XANDER (Funk 255): „die Sachen die ich weiter baue tauchen niemals auf
   der Karte auf die Jagdhütte oder Kuhstall oder sowas" – deshalb hat
   jedes Spielgebäude jetzt ein eigenes Modell.
   XANDER: „richtig filigran. Richtig schön ausarbeiten mit schönen
   Texturen" · „keine Comic Grafik … viel mehr am Realismus" · „Man soll
   das Fundament sehen beim Aufbauen".

   VORBILD: Jagdhütten im Schwarzwald und in den Alpen: Blockbau aus
   dunkel lasierten Fichtenstämmen auf einem Bruchsteinsockel, steiles
   Satteldach (48°) mit Holzschindeln, Giebel mit senkrechter Schalung.
   Die Tür liegt im Giebel, darüber auf einem Brett das Hirschgeweih
   (ein Zehnender). Davor eine kleine Veranda: Bretterboden auf Stein-
   füßen, Geländer mit Andreaskreuzen, Pultdach auf zwei Pfosten, unter
   dem Fenster die Bank. Grüne Fensterläden mit Herz, Brennholz an der
   Südwand, die Regentonne an der Ecke. Daneben ein geschlossener
   Hochsitz: vier gespreizte Rundholzstangen mit Kreuzstreben, oben die
   Kanzel mit Schießluke und Pultdach, die Leiter lehnt an der Seite.
   Keine Tiere, keine Beute – nur das alte Geweih.

   MASSE (Meter; x Osten, y Süden, Grundrissmitte auf 0,0)
     Hütte      6,0 × 5,0 m (x −4,6…1,4, y −2,9…2,1), Sockel 0,45 m,
                Traufe 2,65 m, Dachneigung 48°, First 5,6 m, Kamin 6,4 m
     Veranda    1,4 m tief vor dem Ostgiebel, Pultdach 2,7 → 2,25 m
     Hochsitz   1,6 × 1,6 m am Fuß, Kanzel 1,2 × 1,2 m auf 3,0 m,
                Dach bis 4,6 m, Leiter 70°
   AUFBAU (o.bau): Schnurgerüst → Grube → Bruchsteinsockel → Dielen →
   Blockwand Lage für Lage → Pfetten, Giebel → Sparren → Schalung und
   Schindeln Reihe für Reihe → Kamin → Fenster, Tür, Läden, Geweih →
   Veranda → Hochsitz (Stangen, Streben, Kanzel, Leiter) → Brennholz.
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
  const HX0 = -4.6, HX1 = 1.4, HY0 = -2.9, HY1 = 2.1, YM = (HY0 + HY1) / 2;
  const D = 0.22, ZS = 0.45, NK = 10, ZT = ZS + NK * D;    // Stammdicke, Sockel, Lagen, Traufe 2,65 m
  const VK = 0.3;                                          // Vorköpfe
  const NEIG = 48 * RAD, TN = Math.tan(NEIG);
  const UET = 0.5, UEG = 0.6, DD = 0.16;
  const ZD = ZT + 0.14;
  const HF = (HY1 - HY0) / 2 * TN;
  const zDach = (y) => ZD + HF - Math.abs(y - YM) * TN;
  const HAUS_M = [(HX0 + HX1) / 2, YM, 1.4];
  const KX0 = HX0 + 1.0, KX1 = HX0 + 1.55, KY0 = YM - 1.0, KY1 = YM - 0.45, ZK = ZD + HF + 0.8;   // Kamin (Nordseite, Westende)
  /* Veranda vor dem Ostgiebel */
  const VX1 = HX1 + 1.4, VY0 = YM - 2.3, VY1 = YM + 2.3, VZE = 2.25, VXE = HX1 + 1.58;
  /* Hochsitz */
  const HSX = 4.25, HSY = -3.85, HSF = 0.8, HSO = 0.56, HSZ = 3.0, HSK = 4.25;
  const OEFF = {
    sued: [{ art: "fenster", a0: 3.95, a1: 4.6, z0: 1.3, z1: 2.1 }],
    nord: [{ art: "fenster", a0: 1.4, a1: 2.05, z0: 1.3, z1: 2.1 }, { art: "fenster", a0: 4.0, a1: 4.65, z0: 1.3, z1: 2.1 }],
    ost: [{ art: "fenster", a0: 0.85, a1: 1.55, z0: 1.3, z1: 2.1 }, { art: "tuer", a0: 2.65, a1: 3.55, z0: ZS, z1: ZS + 1.95 }],
    west: [{ art: "fenster", a0: 2.2, a1: 2.8, z0: 1.4, z1: 2.05 }]
  };
  const HOLZ = [86, 64, 48];              // dunkel lasierte Fichte
  const HOLZ_ROH = [196, 160, 112];
  const BRETT = [74, 58, 46];

  /* =====================================================================
     BAUPHASEN
       0,00–0,08  Schnurgerüst, Grube
       0,06–0,18  Bruchsteinsockel, Grube verfüllt
       0,18–0,24  Dielen
       0,24–0,50  Blockwand Lage für Lage
       0,50–0,60  Pfetten, Giebelschalung
       0,58–0,64  Sparren
       0,64–0,78  Schalung, Holzschindeln Reihe für Reihe
       0,76–0,82  Kamin
       0,82–0,86  Fenster, Tür, Läden, Geweih
       0,84–0,90  Veranda (Füße, Boden, Pfosten, Geländer, Dach, Bank)
       0,88–0,97  Hochsitz: Stangen, Streben, Kanzel, Dach, Leiter
       0,95–1,00  Brennholz, Regentonne
     ===================================================================== */
  function zustand(bau) {
    const f = (a, b) => klemm((bau - a) / (b - a), 0, 1);
    const Z = { bau: bau, fertig: bau >= 0.999 };
    Z.grube = bau < 0.2 ? { schnur: bau < 0.07, tiefe: f(0.004, 0.06), beton: 0, verfuellt: f(0.13, 0.19) } : null;
    Z.aushub = bau < 0.13 ? f(0.004, 0.06) : bau < 0.26 ? 1 - 0.9 * f(0.13, 0.26) : 0;
    Z.sockel = f(0.06, 0.18);
    Z.dielen = f(0.18, 0.24);
    Z.waende = f(0.24, 0.5);
    Z.pfetten = f(0.5, 0.54);
    Z.giebel = f(0.53, 0.6);
    Z.sparren = f(0.58, 0.64);
    Z.dach = bau >= 0.64; Z.pappe = f(0.66, 0.78);
    Z.kamin = f(0.76, 0.82);
    Z.fenster = bau >= 0.82; Z.tuer = bau >= 0.83; Z.laeden = bau >= 0.85; Z.geweih = bau >= 0.86;
    Z.veranda = f(0.84, 0.9);
    Z.hochsitz = f(0.88, 0.97);
    Z.stapel = f(0.95, 0.995); Z.tonne = bau >= 0.97; Z.platz = f(0.95, 1);
    Z.alt = bau >= 0.82;
    return Z;
  }

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
    g.save(); g.globalCompositeOperation = "multiply"; g.fillStyle = "rgb(150,118,96)"; g.fillRect(-0.05, -0.05, w + 0.1, zTop - zUnten + 0.1); g.restore();
  }
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

  /* ---------------- Hirschgeweih (Zehnender) auf einem Brett ----------------
     Rosenstöcke auf der gebleichten Schädelplatte, die Stangen schwingen
     nach außen und oben, je fünf Enden: Aug-, Eis-, Mittelsprosse und die
     Gabel oben. */
  function geweihMalen(g, F, cx, cy) {
    const px = F.px;
    const sv = F.schatten ? F.schatten(0.18) : null;
    const brett = () => { g.beginPath(); g.moveTo(cx - 0.2, cy - 0.08); g.quadraticCurveTo(cx, cy - 0.2, cx + 0.2, cy - 0.08); g.lineTo(cx + 0.17, cy + 0.2); g.quadraticCurveTo(cx, cy + 0.34, cx - 0.17, cy + 0.2); g.closePath(); };
    /* Stangen als Bezier-Linien je Seite */
    const stange = (s) => {
      const P = [];
      const bx = cx + s * 0.06, by = cy - 0.02;
      P.push([[bx, by], [bx + s * 0.18, by - 0.12], [bx + s * 0.3, by - 0.42], [bx + s * 0.32, by - 0.72]]);
      P.push([[bx + s * 0.05, by - 0.04], [bx + s * 0.02, by - 0.14], [bx - s * 0.06, by - 0.22], [bx - s * 0.12, by - 0.24]]);      // Augsprosse
      P.push([[bx + s * 0.12, by - 0.1], [bx + s * 0.1, by - 0.2], [bx + s * 0.04, by - 0.28], [bx - s * 0.02, by - 0.33]]);       // Eissprosse
      P.push([[bx + s * 0.27, by - 0.4], [bx + s * 0.22, by - 0.46], [bx + s * 0.14, by - 0.52], [bx + s * 0.1, by - 0.56]]);      // Mittelsprosse
      P.push([[bx + s * 0.31, by - 0.64], [bx + s * 0.36, by - 0.72], [bx + s * 0.42, by - 0.78], [bx + s * 0.46, by - 0.84]]);    // Gabel außen
      P.push([[bx + s * 0.32, by - 0.68], [bx + s * 0.28, by - 0.76], [bx + s * 0.24, by - 0.82], [bx + s * 0.22, by - 0.86]]);    // Gabel innen
      return P;
    };
    const linien = (dx, dy, farbe, b0, spitze) => {
      for (const s of [-1, 1]) {
        stange(s).forEach((p, i) => {
          const b = i === 0 ? b0 : b0 * 0.62;
          g.strokeStyle = farbe; g.lineWidth = b; g.lineCap = "round";
          g.beginPath(); g.moveTo(p[0][0] + dx, p[0][1] + dy); g.bezierCurveTo(p[1][0] + dx, p[1][1] + dy, p[2][0] + dx, p[2][1] + dy, p[3][0] + dx, p[3][1] + dy); g.stroke();
          if (spitze) { g.strokeStyle = spitze; g.lineWidth = b * 0.7; g.beginPath(); const t = 0.85, q = (a, k) => a[0][k] * Math.pow(1 - t, 3) + 3 * a[1][k] * t * Math.pow(1 - t, 2) + 3 * a[2][k] * t * t * (1 - t) + a[3][k] * t * t * t; g.moveTo(q(p, 0) + dx, q(p, 1) + dy); g.lineTo(p[3][0] + dx, p[3][1] + dy); g.stroke(); }
        });
      }
    };
    if (sv) { g.fillStyle = "rgba(14,10,8,0.4)"; g.save(); g.translate(sv[0] * 0.4, sv[1] * 0.4); brett(); g.fill(); g.restore(); linien(sv[0], sv[1], "rgba(14,10,8,0.35)", 0.05); }
    /* Brett mit Rand */
    brett(); g.fillStyle = "rgb(150,98,58)"; g.fill();
    if (px > 12) { g.save(); brett(); g.clip(); maser(g, cx - 0.22, cy - 0.22, 0.44, 0.58, 0.02, 0.4, 0.5, 7, true); g.fillStyle = "rgba(255,220,180,0.15)"; g.fillRect(cx - 0.22, cy - 0.2, 0.44, 0.05); g.restore(); g.strokeStyle = "rgb(58,34,22)"; g.lineWidth = 0.015; brett(); g.stroke(); }
    /* Stangen: dunkelbraun geperlt, Enden hell poliert */
    linien(0, 0, "rgb(150,120,88)", 0.048, "rgb(236,226,204)");
    if (px > 18) linien(-0.008, -0.008, "rgba(214,190,150,0.55)", 0.016); if (px > 18) linien(0.008, 0.01, "rgba(60,40,26,0.45)", 0.014);
    /* Rosen und Schädelplatte */
    g.fillStyle = "rgb(226,218,200)"; g.beginPath(); g.ellipse(cx, cy + 0.03, 0.085, 0.06, 0, 0, TAU); g.fill();
    g.fillStyle = "rgb(120,96,70)"; for (const s of [-1, 1]) { g.beginPath(); g.arc(cx + s * 0.06, cy - 0.02, 0.032, 0, TAU); g.fill(); }
    if (px > 20) { g.fillStyle = "rgba(150,140,120,0.6)"; g.beginPath(); g.ellipse(cx, cy + 0.05, 0.05, 0.02, 0, 0, TAU); g.fill(); }
  }

  /* ---------------- Wandmaler ---------------- */
  function wandMaler(name, zTop, versatz, Z, S) {
    return function (g, F) {
      const w = F.w, H = F.h, zU = zTop - H;
      blockMalen(g, F, w, zTop, zU, versatz, Z.alt ? S.holz : HOLZ_ROH, S.saat + name.length * 11);
      oeffnungenMalen(g, F, name, zTop, Z, S);
      const yZ = (z) => zTop - z;
      if (Z.fertig && name === "ost") {
        laterneMalen(g, F, 3.85, yZ(2.2), F.nacht > 0.3);
        /* Hufeisen über der Tür */
        if (F.px > 14) { g.strokeStyle = "rgb(60,56,52)"; g.lineWidth = 0.025; g.beginPath(); g.arc(3.1, yZ(2.47), 0.06, 0.15 * Math.PI, 0.85 * Math.PI, true); g.stroke(); }
      }
      if (Z.dach && (name === "sued" || name === "nord")) {
        const gr = g.createLinearGradient(0, 0, 0, 0.7);
        gr.addColorStop(0, "rgba(20,20,34,0.45)"); gr.addColorStop(1, "rgba(20,20,34,0)");
        g.fillStyle = gr; g.fillRect(-0.1, 0, w + 0.2, 0.7);
      }
      if (name === "ost" && Z.veranda >= 0.85) {
        /* Schatten des Vordachs über der Tür */
        const t = OEFF.ost[1], gr = g.createLinearGradient(0, yZ(ZT), 0, yZ(ZT) + 0.8);
        gr.addColorStop(0, "rgba(20,20,34,0.5)"); gr.addColorStop(1, "rgba(20,20,34,0)");
        g.fillStyle = gr; g.fillRect(t.a0 - 0.35, yZ(ZT), t.a1 - t.a0 + 0.7, 0.8);
      }
      if (F.jahr === "herbst" && Z.fertig && name !== "ost") { g.save(); g.beginPath(); g.rect(-0.1, H - 0.3, w + 0.2, 0.32); g.clip(); laubMalen(g, F, 0, H - 0.12, w, 0.13, S.saat + 3, 2, H); g.restore(); }
      const ge = g.createLinearGradient(0, 0, 0.3, 0); ge.addColorStop(0, "rgba(20,14,10,0.22)"); ge.addColorStop(1, "rgba(20,14,10,0)");
      g.fillStyle = ge; g.fillRect(0, 0, 0.3, H);
      const ge2 = g.createLinearGradient(w, 0, w - 0.3, 0); ge2.addColorStop(0, "rgba(20,14,10,0.22)"); ge2.addColorStop(1, "rgba(20,14,10,0)");
      g.fillStyle = ge2; g.fillRect(w - 0.3, 0, 0.3, H);
    };
  }
  function wandLeuchten(name, zTop) {
    return function (g, F) {
      const B = blickAus(F), yZ = (z) => zTop - z;
      for (const o of OEFF[name]) if (o.art === "fenster") fensterLichtMalen(g, F, B, o.a0, yZ(o.z1), o.a1 - o.a0, o.z1 - o.z0, { tiefe: 0.12, sprossen: [2, 2], an: name === "nord" ? 0.7 : 1 });
      if (name === "ost") {
        laterneMalen(g, F, 3.85, yZ(2.2), true);
        F.leuchtPunkt(3.85, yZ(2.08), 1.6, "255,200,120", 1.0, true);
      }
    };
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  const LADEN = [[52, 82, 56], [44, 70, 50], [110, 50, 40]];
  const TUER = [[70, 50, 36], [58, 72, 54], [96, 66, 44]];
  ST.modell("jagdhuette", {
    name: "Jagdhütte", gruppe: "Häuser", grund: [11, 10], hoehe: 7, bauzeit: 9 * 60,
    bauen(M, o) {
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      const Z = zustand(bau);
      const saat = ((o.saat || 7) >>> 0) % 100000;
      const winter = o.jahr === "winter";
      const S = { saat: saat, winter: winter, jahr: o.jahr, holz: PI.streu(HOLZ, zufall(saat + 1), 0.05), laden: LADEN[saat % LADEN.length], tuer: TUER[(saat + 1) % TUER.length] };
      if (Z.grube || Z.aushub > 0.02) {
        if (Z.grube) grubeBauen(M, Z.grube, [HX0 - 0.1, HY0 - 0.1, HX1 + 0.1, HY1 + 0.1], 0.5, null, winter, saat);
        if (Z.aushub > 0.02) { M.teil("aushub", { mitte: [3.6, 1.0, 0.4] }); M.figur({ x: 3.6, y: 1.2, z: 0, breite: 3.4, hoehe: 1.0, malen: aushubFigur(Z.aushub, winter) }); }
      }
      if (Z.sockel > 0) sockelBauen(M, Z, S);
      if (Z.waende > 0) waendeBauen(M, Z, S);
      if (Z.pfetten > 0) pfettenBauen(M, Z, S);
      if (Z.giebel > 0) giebelBauen(M, Z, S);
      if (Z.sparren > 0 && !Z.dach) sparrenBauen(M, Z, S);
      if (Z.dach) dachBauen(M, Z, S);
      if (Z.kamin > 0) kaminBauen(M, Z, S);
      if (Z.platz > 0) platzBauen(M, Z, S);
      if (Z.veranda > 0) verandaBauen(M, Z, S);
      if (Z.hochsitz > 0) hochsitzBauen(M, Z, S);
      if (Z.stapel > 0) stapelBauen(M, Z, S);
      if (Z.tonne) tonneBauen(M, Z, S);
      if (Z.fertig) {
        M.rauchAus((KX0 + KX1) / 2, (KY0 + KY1) / 2, ZK + 0.15, 0.55);
        M.bodenlicht(HX1 + 1.2, HY1 - 2.0, 2.0, "255,196,120", 0.65);
        M.bodenlicht(HX0 + 4.3, HY1 + 0.8, 1.2, "255,190,110", 0.3);
      }
    }
  });

  /* ---------------- Bruchsteinsockel und Dielen ---------------- */
  function sockelBauen(M, Z, S) {
    const winter = S.winter && Z.fertig, G = Z.grube;
    const tief = G ? 0.5 * G.tiefe * (1 - G.verfuellt) : 0;
    const z0 = -tief, z1 = Math.max(0.02, -tief + (ZS + tief) * Z.sockel);
    M.teil("sockel", { mitte: [HAUS_M[0], HAUS_M[1], 0.2] });
    const x0 = HX0 - 0.06, x1 = HX1 + 0.06, y0 = HY0 - 0.06, y1 = HY1 + 0.06;
    const stein = (sa, frei) => (g, F) => {
      bruchsteinMalen(g, F, 0, 0, F.w, F.h, { saat: S.saat + sa, bis: F.h, klein: 0.85, hell: -0.04 });
      if (winter) weheMalen(g, F, F.w, F.h, S.saat + sa, frei, 1.15);
      else if (S.jahr === "herbst" && Z.fertig) laubMalen(g, F, 0, F.h - 0.12, F.w, 0.13, sa, 2.5, F.h);
    };
    const top = (g, F) => {
      if (Z.dielen <= 0 || Z.dach) { g.fillStyle = "rgb(140,132,118)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); rausch(g, 0, 0, F.w, F.h, 1.2, 0.35, 5, 3); return; }
      const rng = zufall(S.saat + 4), bis = F.w * Z.dielen;
      g.fillStyle = "rgb(110,96,80)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      for (let x = 0; x < bis; x += 0.18) { g.fillStyle = rgb(PI.streu([190, 156, 112], rng, 0.07)); g.fillRect(x, -0.05, Math.min(0.18, bis - x), F.h + 0.1); }
      maser(g, 0, 0, bis, F.h, 0.03, 1.2, 0.4, 5, true);
      g.fillStyle = "rgba(60,40,24,0.5)"; for (let x = 0.18; x < bis; x += 0.18) g.fillRect(x - 0.005, 0, 0.01, F.h);
    };
    kiste(M, x0, y0, z0, x1, y1, z1, { s: stein(1), n: stein(2), o: stein(3), w: stein(4), t: top }, { name: "sockel" });
  }

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

  /* ---------------- Giebel: senkrechte Schalung, Geweih über der Tür ---------------- */
  function giebelBauen(M, Z, S) {
    const zTop = ZT + (zDach(YM) - DD - 0.02 - ZT) * Z.giebel;
    const zO = (y) => zDach(y) - DD - 0.02;
    const c = Z.alt ? BRETT : [192, 158, 112];
    const tuer = OEFF.ost[1];
    const mal = (sa, ost) => (g, F) => {
      const w = F.w, h = F.h, voll = zDach(YM) - DD - 0.02 - ZT;
      bretterMalen(g, F, -0.05, -0.05, w + 0.1, h + 0.1, c, S.saat + sa, 0.18, true, Z.alt);
      if (F.px * 0.05 > 1.2) {
        const sv = F.schatten(0.025);
        for (let x = 0.18; x < w; x += 0.18) {
          if (sv) { g.fillStyle = "rgba(14,10,8,0.4)"; g.fillRect(x - 0.022 + sv[0], 0, 0.044, h); }
          g.fillStyle = rgb(hell(c, 0.08)); g.fillRect(x - 0.022, 0, 0.044, h);
          g.fillStyle = rgb(hell(c, -0.35)); g.fillRect(x + 0.012, 0, 0.01, h);
        }
      }
      /* Zierbrett: Fries mit ausgesägten Kreisen über der Traufe */
      if (Z.giebel >= 1) {
        const yb = h - 0.02;
        holzMalen(g, F, -0.05, yb - 0.16, w + 0.1, 0.16, hell(c, -0.1), 5, false);
        if (F.px > 10) { g.fillStyle = "rgb(18,14,12)"; for (let x = 0.3; x < w - 0.2; x += 0.3) { g.beginPath(); g.arc(x, yb - 0.08, 0.035, 0, TAU); g.fill(); } }
        /* kleines Fenster in der Spitze (Dachboden) */
        const lx = w / 2 - 0.22, ly = h - voll + 0.75, lw = 0.44, lh = 0.5;
        if (!ost && ly + lh < yb - 0.3) {
          holzFenster(g, F, blickAus(F), lx, ly, lw, lh, { tiefe: 0.08, laibung: [70, 56, 44], rahmen: [226, 218, 200], sprossen: [2, 2] });
          holzMalen(g, F, lx - 0.06, ly - 0.06, lw + 0.12, 0.06, hell(c, -0.2), 3, false);
          holzMalen(g, F, lx - 0.08, ly + lh, lw + 0.16, 0.05, hell(c, -0.2), 4, false);
        }
        /* das Geweih über der Tür (nur am Ostgiebel) */
        if (ost && Z.geweih) {
          const a = w - (tuer.a0 + tuer.a1) / 2;   // Fläche läuft von Nord nach Süd → von rechts gemessen
          g.save(); const gx = ost === "o" ? (tuer.a0 + tuer.a1) / 2 : a, gy = h - 0.85; g.translate(gx, gy); g.scale(1.25, 1.25); geweihMalen(g, F, 0, 0); g.restore();
        }
      }
      const gr = g.createLinearGradient(0, 0, 0, 0.5);
      gr.addColorStop(0, "rgba(20,20,34,0.4)"); gr.addColorStop(1, "rgba(20,20,34,0)");
      g.fillStyle = gr; g.fillRect(-0.1, 0, w + 0.2, 0.5);
    };
    M.teil("giebel", { mitte: [HAUS_M[0], YM, ZT + 1.0] });
    for (const [x, n, u, sa, ost] of [[HX1, [1, 0, 0], [0, -1, 0], 5, "o"], [HX0, [-1, 0, 0], [0, 1, 0], 9, null]]) {
      const pts = unterZ([[x, HY1, ZT], [x, YM, zO(YM)], [x, HY0, ZT]], zTop);
      if (pts.length < 3) continue;
      vieleck(M, "giebel" + sa, pts, n, u, mal(sa, ost), { beidseitig: !Z.dach });
    }
  }
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

  /* ---------------- Dach: Holzschindeln ---------------- */
  const SCH_T = [[92, 74, 60], [80, 66, 56], [104, 86, 68], [72, 62, 54], [112, 94, 76], [88, 80, 70]];
  const SCH_R = 0.13;
  function schindelMalen(g, F, w, h, saat, bis, herbst) {
    const px = F.px, rng = zufall(saat), R = SCH_R;
    /* Schalung darunter */
    holzMalen(g, F, -0.05, -0.05, w + 0.1, h + 0.1, [184, 150, 106], saat, false);
    g.fillStyle = "rgba(60,40,24,0.4)"; for (let y = 0.16; y < h; y += 0.16) g.fillRect(-0.05, y, w + 0.1, 0.008);
    g.save();
    if (bis != null) { const yb = h - Math.floor(bis * h / R) * R; g.beginPath(); g.rect(-0.1, yb, w + 0.2, h - yb + 0.1); g.clip(); }
    g.fillStyle = "rgb(36,30,26)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
    if (px * R < 2.4) {
      for (let y = h; y > -R; y -= R) { g.fillStyle = rgb(PI.streu(SCH_T[0], rng, 0.06)); g.fillRect(-0.05, y - R, w + 0.1, R * 0.82); }
    } else {
      const E = SCH_T.map(() => new Path2D()), fuge = new Path2D(), kante = new Path2D(), schatten = new Path2D(), riss = new Path2D();
      for (let y = h; y > -R; y -= R) {
        let x = -rng() * 0.1;
        while (x < w + 0.05) {
          const b = 0.075 + rng() * 0.095;
          E[(rng() * E.length) | 0].rect(x, y - R, b, R);
          fuge.rect(x + b - Math.max(0.006, 0.6 / px), y - R, Math.max(0.006, 0.6 / px), R);
          if (px > 30 && rng() < 0.3) { const rx = x + rng() * b; riss.moveTo(rx, y); riss.lineTo(rx + (rng() - 0.5) * 0.01, y - R * (0.3 + rng() * 0.5)); }
          x += b;
        }
        schatten.rect(-0.05, y - R, w + 0.1, R * 0.3);
        kante.rect(-0.05, y - Math.max(0.01, 0.8 / px), w + 0.1, Math.max(0.01, 0.8 / px));
      }
      for (let i = 0; i < E.length; i++) { g.fillStyle = rgb(SCH_T[i]); g.fill(E[i]); }
      if (px > 9) maser(g, 0, 0, w, h, 0.02, 0.35, 0.4, saat + 3, true);
      g.fillStyle = "rgba(14,10,8,0.6)"; g.fill(fuge);
      g.fillStyle = "rgba(14,10,8,0.32)"; g.fill(schatten);
      g.fillStyle = "rgba(220,206,186,0.22)"; g.fill(kante);
      if (px > 30) { g.strokeStyle = "rgba(20,14,10,0.5)"; g.lineWidth = Math.max(0.004, 0.7 / px); g.stroke(riss); }
    }
    /* Moos und Flechten, zur Traufe hin mehr; Silbergrau in der Sonne */
    tonFlecken(g, 0, 0, w, h, 0.8, 0.28, saat + 5, "#5c6a3c");
    tonFlecken(g, 0, h * 0.6, w, h * 0.4, 0.45, 0.25, saat + 7, "#4a5a32");
    tonFlecken(g, 0, 0, w, h, 1.4, 0.18, saat + 9, "#9c9a92");
    rausch(g, 0, 0, w, h, 3, 0.2, saat + 8, 4);
    /* Firstbrett */
    holzMalen(g, F, -0.05, -0.05, w + 0.1, 0.18, [70, 56, 46], 9, false);
    g.fillStyle = "rgba(10,8,6,0.4)"; g.fillRect(-0.05, 0.13, w + 0.1, 0.03);
    if (herbst) laubMalen(g, F, 0, 0, w, h, saat + 5, 1.0, h);
    g.restore();
  }
  function dachBauen(M, Z, S) {
    const winter = S.winter && Z.fertig;
    M.teil("dach", { mitte: [HAUS_M[0], YM, 9] });
    const mal = (sa) => (g, F) => {
      schindelMalen(g, F, F.w, F.h, S.saat + sa, Z.pappe >= 1 ? null : Z.pappe, S.jahr === "herbst" && Z.fertig);
      if (winter) dachSchneeMalen(g, F, F.w, F.h, S.saat + sa, { oben: 0.05, reihe: SCH_R });
    };
    const kante = (g, F) => {
      holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, Z.alt ? [66, 50, 38] : [186, 150, 104], 7, false);
      g.fillStyle = "rgba(10,8,6,0.4)"; g.fillRect(-0.02, F.h - 0.03, F.w + 0.04, 0.03);
      if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.05); }
    };
    const ort = (g, F) => {
      holzMalen(g, F, -0.05, -0.05, F.w + 0.1, F.h + 0.1, Z.alt ? [62, 48, 36] : [186, 150, 104], 8, false);
      /* gesägte Zierkante am Windbrett */
      if (F.px > 14 && Z.alt) { const um = F.flaeche.umriss; g.fillStyle = "rgba(10,8,6,0.5)"; for (const [p, q] of [[um[5], um[4]], [um[4], um[3]]]) { const L = Math.hypot(q[0] - p[0], q[1] - p[1]); for (let a = 0.1; a < L; a += 0.16) { const t = a / L; g.beginPath(); g.arc(p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t - 0.02, 0.03, 0, TAU); g.fill(); } } }
      if (winter) { const um = F.flaeche.umriss; g.strokeStyle = "rgb(242,246,252)"; g.lineWidth = 0.09; g.lineJoin = "round"; g.beginPath(); g.moveTo(um[0][0], um[0][1]); g.lineTo(um[1][0], um[1][1]); g.lineTo(um[2][0], um[2][1]); g.stroke(); }
    };
    const d = M.satteldach({ x: HX0, y: HY0, b: HX1 - HX0, t: HY1 - HY0, z: ZD, hf: HF, ueT: UET, ueG: UEG, dicke: 0.22 }, mal(1), mal(2), { kante: "#3e3026", traufeMalen: kante, ortMalen: ort, lichtExtra: winter ? 0.05 : 0 });
    if (winter) {
      const xm0 = d.xm0, xm1 = d.xm1;
      M.teil("zapfen", { schatten: false, mitte: [HAUS_M[0], d.yE1 + 4, 9.2] });
      M.flaeche({ name: "zapfen-s", o: [xm0, d.yE1 + 0.01, d.zE - 0.22], u: [1, 0, 0], v: [0, 0, -1], w: xm1 - xm0, h: 0.5, keinLicht: true, keinAo: true, malen: zapfenMal(S.saat + 3, 0.4) });
      M.flaeche({ name: "wechte-s", o: [xm0 - 0.02, d.yE1 + 0.03, d.zE + 0.17], u: [1, 0, 0], v: [0, 0, -1], w: xm1 - xm0 + 0.04, h: 0.32, keinLicht: true, keinAo: true, malen: wechteMal(S.saat + 5, [0, Math.sin(NEIG), Math.cos(NEIG)]) });
      M.teil("zapfen-n", { schatten: false, mitte: [HAUS_M[0], d.yE0 - 4, 9.2] });
      M.flaeche({ name: "zapfen-n", o: [xm1, d.yE0 - 0.01, d.zE - 0.22], u: [-1, 0, 0], v: [0, 0, -1], w: xm1 - xm0, h: 0.5, keinLicht: true, keinAo: true, malen: zapfenMal(S.saat + 7, 0.35) });
      M.flaeche({ name: "wechte-n", o: [xm1 + 0.02, d.yE0 - 0.03, d.zE + 0.17], u: [-1, 0, 0], v: [0, 0, -1], w: xm1 - xm0 + 0.04, h: 0.32, keinLicht: true, keinAo: true, malen: wechteMal(S.saat + 9, [0, -Math.sin(NEIG), Math.cos(NEIG)]) });
    }
  }
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
     VERANDA: Bretterboden auf Steinfüßen, Geländer mit Andreaskreuzen,
     Pultdach auf zwei Pfosten, Bank unter dem Fenster
     ===================================================================== */
  function verandaBauen(M, Z, S) {
    const winter = S.winter && Z.fertig, k = Z.veranda;
    const holz = Z.alt ? hell(S.holz, 0.08) : HOLZ_ROH;
    const hz = (sa) => () => (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, holz, sa, F.h > F.w); g.fillStyle = "rgba(14,10,8,0.25)"; g.fillRect(-0.02, F.h * 0.75, F.w + 0.04, F.h * 0.25); };
    const zB = ZS;                       // Oberkante Boden
    /* Steinfüße */
    M.teil("vfuesse", { mitte: [(HX1 + VX1) / 2, YM, 0.1] });
    const st = (g, F) => { g.fillStyle = "rgb(140,134,124)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); tonFlecken(g, 0, 0, F.w, F.h, 0.4, 0.5, 4, "#6e665a"); };
    for (const y of [VY0 + 0.2, YM, VY1 - 0.2]) kiste(M, VX1 - 0.32, y - 0.14, 0, VX1 - 0.04, y + 0.14, zB - 0.2, { s: st, n: st, o: st, w: st }, { name: "vf" + y });
    if (k < 0.2) return;
    /* Boden: Bretter quer (in y), Stirnbrett vorn */
    M.teil("vboden", { mitte: [(HX1 + VX1) / 2, YM, zB - 0.1] });
    const boden = (g, F) => {
      const rng = zufall(S.saat + 61), bis = Math.min(F.h, F.h * (k - 0.2) / 0.2);
      g.fillStyle = "rgb(40,30,24)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      for (let x = 0; x < F.w; x += 0.15) { g.fillStyle = rgb(PI.streu(hell(holz, 0.05), rng, 0.07)); g.fillRect(x + 0.006, -0.05, 0.138, bis + 0.05); }
      maser(g, 0, 0, F.w, F.h, 0.03, 1.1, 0.4, 7, true);
      tonFlecken(g, 0, 0, F.w, F.h, 0.7, 0.3, 9, "#3a2c22");
      if (F.jahr === "winter" && Z.fertig) { tonFlecken(g, 0, 0, F.w, F.h, 0.9, 0.85, 5, "#eef2f8", true); g.fillStyle = "rgba(240,244,250,0.9)"; g.fillRect(F.w - 0.35, -0.05, 0.4, F.h + 0.1); }
      if (F.jahr === "herbst" && Z.fertig) laubMalen(g, F, 0, 0, F.w, F.h, 77, 0.8);
    };
    const stirn = (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, hell(holz, -0.1), 3, false); g.fillStyle = "rgba(14,10,8,0.3)"; g.fillRect(-0.02, F.h - 0.04, F.w + 0.04, 0.04); };
    kiste(M, HX1 + 0.02, VY0, zB - 0.2, VX1, VY1, zB, { s: stirn, n: stirn, o: stirn, t: boden }, { name: "vb" });
    /* Treppe: zwei Stufen vor der Tür */
    const tuer = OEFF.ost[1], ty0 = HY1 - tuer.a1 - 0.1, ty1 = HY1 - tuer.a0 + 0.1;
    M.teil("vtreppe", { mitte: [VX1 + 0.3, (ty0 + ty1) / 2, 0.15] });
    const stufe = (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, hell(holz, -0.04), 11, false); if (F.jahr === "winter" && Z.fertig && F.h > 0.3) tonFlecken(g, 0, 0, F.w, F.h, 0.5, 0.7, 3, "#eef2f8", true); };
    kiste(M, VX1, ty0, 0, VX1 + 0.56, ty1, 0.15, { s: stufe, n: stufe, o: stufe, t: stufe }, { name: "st1" });
    kiste(M, VX1, ty0, 0.15, VX1 + 0.28, ty1, 0.3, { s: stufe, n: stufe, o: stufe, t: stufe }, { name: "st2" });
    if (k < 0.45) return;
    /* Pfosten und Geländer */
    const zH = zB + 0.95;
    const pfosten = [[VX1 - 0.08, VY0 + 0.08], [VX1 - 0.08, VY1 - 0.08], [VX1 - 0.08, ty0 - 0.04], [VX1 - 0.08, ty1 + 0.04], [HX1 + 0.45, VY0 + 0.08], [HX1 + 0.45, VY1 - 0.08]];
    pfosten.forEach(([x, y], i) => {
      const hoch = zH + 0.06;
      M.teil("vpf" + i, { mitte: [x, y, hoch / 2] });
      balken3(M, [x, y, zB], [x, y, hoch], [1, 0, 0], 0.11, 0.11, hz(20 + i), { name: "vpf" + i, seiten: "QqRre" });
    });
    /* Geländerfelder: Handlauf, Fußholz, Andreaskreuz (durchsichtig, selbst belichtet) */
    const felder = [[[VX1 - 0.08, VY0 + 0.08], [VX1 - 0.08, ty0 - 0.04]], [[VX1 - 0.08, ty1 + 0.04], [VX1 - 0.08, VY1 - 0.08]], [[HX1 + 0.45, VY0 + 0.08], [VX1 - 0.08, VY0 + 0.08]], [[HX1 + 0.45, VY1 - 0.08], [VX1 - 0.08, VY1 - 0.08]]];
    felder.forEach(([p, q], i) => {
      const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), u = [dx / L, dy / L, 0];
      M.teil("vgel" + i, { mitte: [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, zB + 0.5] });
      M.flaeche({ name: "vgel" + i, o: [p[0] + u[0] * 0.055, p[1] + u[1] * 0.055, zH], u: u, v: [0, 0, -1], w: L - 0.11, h: zH - zB, beidseitig: true, keinLicht: true, keinAo: true, malen: (g, F) => {
        const Lt = belichter2(F, 0.04), w = F.w, h = F.h;
        const latte = (x0, y0, x1, y1, b, c) => { g.strokeStyle = Lt(c); g.lineWidth = b; g.lineCap = "butt"; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); };
        const c = holz, cd = hell(holz, -0.18);
        latte(0, h - 0.12, w, 0.12, 0.07, cd); latte(0, 0.12, w, h - 0.12, 0.07, cd);
        latte(0, 0.05, w, 0.05, 0.1, c); latte(0, h - 0.08, w, h - 0.08, 0.08, c);
        if (F.px > 14) { g.fillStyle = Lt(hell(c, 0.2), 0.7); g.fillRect(0, 0.0, w, 0.015); }
        if (F.jahr === "winter" && Z.fertig) { g.fillStyle = Lt([246, 249, 253]); PI.rundRechteck(g, -0.02, -0.035, w + 0.04, 0.05, 0.02); g.fill(); }
      } });
    });
    if (k < 0.7) return;
    /* Vordach über der Tür: Schindeln auf zwei Kopfbändern */
    const zW = ZT + 0.12, VT = 0.9, zV = zW - 0.22, vy0 = ty0 - 0.25, vy1 = ty1 + 0.25;
    M.teil("vkopf", { mitte: [HX1 + 0.3, (vy0 + vy1) / 2, 2.4] });
    for (const y of [vy0 + 0.12, vy1 - 0.12]) {
      balken3(M, [HX1 + 0.02, y, zW - 0.1], [HX1 + VT - 0.05, y, zV - 0.08], [0, 1, 0], 0.09, 0.12, hz(41), { name: "vsp" + y, seiten: "QqRre" });
      balken3(M, [HX1 + 0.02, y, zW - 0.75], [HX1 + 0.6, y, zV - 0.1], [0, 1, 0], 0.08, 0.08, hz(42), { name: "vkb" + y, seiten: "QqRr" });
    }
    M.teil("vdach", { mitte: [HX1 + 0.45, (vy0 + vy1) / 2, 6] });
    const nV = nrm([zW - zV, 0, VT]);
    const vmal = (g, F) => {
      schindelMalen(g, F, F.w, F.h, S.saat + 41, k >= 0.85 ? null : (k - 0.7) / 0.15, S.jahr === "herbst" && Z.fertig);
      if (winter) dachSchneeMalen(g, F, F.w, F.h, S.saat + 43, { oben: 0.02, reihe: SCH_R });
    };
    vieleck(M, "vdach", [[HX1, vy0, zW], [HX1, vy1, zW], [HX1 + VT, vy1, zV], [HX1 + VT, vy0, zV]], nV, [0, 1, 0], vmal, { lichtExtra: winter ? 0.05 : 0 });
    const kb = (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, Z.alt ? [66, 50, 38] : HOLZ_ROH, 13, false); if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.05); } };
    wand(M, [HX1 + VT, vy1, zV], [1, 0, 0], vy1 - vy0, 0.12, kb, { name: "vdach-k", keinAo: true });
    vieleck(M, "vdach-ks", [[HX1, vy1, zW], [HX1 + VT, vy1, zV], [HX1 + VT, vy1, zV - 0.12], [HX1, vy1, zW - 0.12]], [0, 1, 0], [1, 0, 0], kb, { keinAo: true });
    vieleck(M, "vdach-kn", [[HX1 + VT, vy0, zV], [HX1, vy0, zW], [HX1, vy0, zW - 0.12], [HX1 + VT, vy0, zV - 0.12]], [0, -1, 0], [-1, 0, 0], kb, { keinAo: true });
    if (winter) {
      M.teil("vzapfen", { schatten: false, mitte: [HX1 + VT + 3, (vy0 + vy1) / 2, 6.2] });
      M.flaeche({ name: "vzapfen", o: [HX1 + VT + 0.01, vy1, zV - 0.12], u: [0, -1, 0], v: [0, 0, -1], w: vy1 - vy0, h: 0.3, keinLicht: true, keinAo: true, malen: zapfenMal(S.saat + 13, 0.22) });
    }
    if (k < 0.9) return;
    /* Bank unter dem Fenster: Sitzbrett auf zwei Wangen */
    const f = OEFF.ost[0], by0 = HY1 - f.a1 - 0.35, by1 = HY1 - f.a0 + 0.35, bx0 = HX1 + 0.04, bx1 = HX1 + 0.42, zs = zB + 0.45;
    M.teil("bank", { mitte: [(bx0 + bx1) / 2, (by0 + by1) / 2, zs - 0.2] });
    const bh = (g, F) => holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, hell(holz, 0.04), 17, false);
    for (const y of [by0 + 0.1, by1 - 0.16]) kiste(M, bx0 + 0.04, y, zB, bx1 - 0.04, y + 0.06, zs - 0.05, { s: bh, n: bh, o: bh }, { name: "wange" + y });
    kiste(M, bx0, by0, zs - 0.05, bx1, by1, zs, { s: bh, n: bh, o: bh, t: schneeOben((g, F) => { bh(g, F); g.fillStyle = "rgba(10,8,6,0.4)"; g.fillRect(-0.02, F.h / 2 - 0.006, F.w + 0.04, 0.012); }) }, { name: "sitz" });
  }

  /* =====================================================================
     HOCHSITZ: vier gespreizte Stangen, Kreuzstreben, Kanzel, Leiter
     ===================================================================== */
  function hochsitzBauen(M, Z, S) {
    const winter = S.winter && Z.fertig, k = Z.hochsitz;
    const holz = [118, 100, 82], bretter = [104, 92, 78];
    const stange = (i) => (g, F) => { const sk = F.h > F.w; holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, PI.streu(holz, zufall(i + 3), 0.06), 50 + i, sk); tonFlecken(g, 0, 0, F.w, F.h, 0.5, 0.3, i, "#4a3e30"); };
    const ecke = (sx, sy, z) => { const t = z / HSK, r = HSF + (HSO - HSF) * t; return [HSX + sx * r, HSY + sy * r, z]; };
    const E = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    /* Steinplatten unter den Füßen */
    M.teil("hsfuss", { ebene: -1, schatten: false, mitte: [HSX, HSY, 0] });
    for (const [sx, sy] of E) { const p = ecke(sx, sy, 0); kiste(M, p[0] - 0.14, p[1] - 0.14, 0, p[0] + 0.14, p[1] + 0.14, 0.04, { t: (g, F) => { g.fillStyle = "rgb(130,124,116)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); } }, { name: "hsf" + sx + sy }); }
    /* Stangen wachsen */
    const zS = Math.max(0.3, HSK * Math.min(1, k / 0.3));
    E.forEach(([sx, sy], i) => {
      const a = ecke(sx, sy, 0), b = ecke(sx, sy, zS + (k >= 0.3 ? 0.08 : 0));
      M.teil("hsst" + i, { mitte: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, zS / 2] });
      rohr(M, a, b, 0.065, 6, () => stange(i), () => (g, F) => { g.fillStyle = winter ? "rgb(236,240,248)" : "rgb(150,124,96)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); }, { name: "hss" + i, ohneKappe: -1, ao: true });
    });
    if (k < 0.3) return;
    /* Kreuzstreben auf allen vier Seiten */
    const nS = Math.ceil(8 * Math.min(1, (k - 0.3) / 0.2));
    const streben = [];
    for (let s = 0; s < 4; s++) { const A = E[s], B = E[(s + 1) % 4]; streben.push([ecke(A[0], A[1], 0.35), ecke(B[0], B[1], 2.75), s]); streben.push([ecke(B[0], B[1], 0.35), ecke(A[0], A[1], 2.75), s]); }
    streben.slice(0, nS).forEach(([p, q, s], i) => {
      const n = [E[s][0] + E[(s + 1) % 4][0], E[s][1] + E[(s + 1) % 4][1], 0];
      const off = mul(nrm(n), 0.07 + (i % 2) * 0.05);
      M.teil("hsstr" + i, { mitte: add(mul(add(p, q), 0.5), off) });
      balken3(M, add(p, off), add(q, off), n, 0.04, 0.09, () => stange(10 + i), { name: "hsstr" + i, seiten: "QqRr" });
    });
    if (k < 0.5) return;
    /* Kanzel: Boden, Wände aus Brettern, Luken */
    const h = HSO + 0.02, x0 = HSX - h, x1 = HSX + h, y0 = HSY - h, y1 = HSY + h;
    const zw = HSZ + (HSK - HSZ) * Math.min(1, (k - 0.5) / 0.2);
    M.teil("kanzel", { mitte: [HSX, HSY, (HSZ + HSK) / 2] });
    const brettM = (sa, luke) => (g, F) => {
      const w = F.w, hh = F.h;
      bretterMalen(g, F, -0.05, -0.05, w + 0.1, hh + 0.1, bretter, sa, 0.14, true, true);
      tonFlecken(g, 0, 0, w, hh, 0.6, 0.25, sa + 2, "#5a6448");
      const yZ = (z) => zw - z;
      if (luke && zw > HSZ + 1.05) {
        const lw = luke === 2 ? 0.42 : (luke === 3 ? 0.4 : 0.6), lz0 = HSZ + (luke === 1 ? 0.7 : 0.75), lz1 = Math.min(zw - 0.08, HSZ + 1.08), lx = luke === 2 ? 0.12 : (w - lw) / 2;
        const B = blickAus(F);
        g.save(); g.beginPath(); g.rect(lx, yZ(lz1), lw, lz1 - lz0); g.clip();
        const pT = laibung(g, F, B, lx, yZ(lz1), lw, lz1 - lz0, 0.05, bretter);
        g.fillStyle = "rgb(16,12,10)"; g.fillRect(lx + pT[0], yZ(lz1) + pT[1], lw, lz1 - lz0);
        g.restore();
        holzMalen(g, F, lx - 0.04, yZ(lz0), lw + 0.08, 0.04, hell(bretter, -0.1), 3, false);
      }
      /* Einstieg mit Tür auf der Leiterseite */
      if (luke === 2) {
        const tx = w - 0.52, tz1 = Math.min(zw - 0.05, HSZ + 0.98);
        g.fillStyle = "rgb(16,12,10)"; g.fillRect(tx, yZ(tz1), 0.42, tz1 - HSZ);
        g.fillStyle = "rgba(80,66,52,0.85)"; g.fillRect(tx + 0.06, yZ(tz1) + 0.04, 0.36, tz1 - HSZ - 0.04);
      }
      const gr = g.createLinearGradient(0, 0, 0, 0.35); gr.addColorStop(0, "rgba(20,20,30,0.4)"); gr.addColorStop(1, "rgba(20,20,30,0)");
      if (zw >= HSK) { g.fillStyle = gr; g.fillRect(-0.05, 0, w + 0.1, 0.35); }
      const gu = g.createLinearGradient(0, hh - 0.2, 0, hh); gu.addColorStop(0, "rgba(20,14,10,0)"); gu.addColorStop(1, "rgba(20,14,10,0.35)");
      g.fillStyle = gu; g.fillRect(-0.05, hh - 0.2, w + 0.1, 0.2);
    };
    const bodenM = (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, hell(bretter, -0.12), 61, false); };
    kiste(M, x0 - 0.06, y0 - 0.06, HSZ - 0.12, x1 + 0.06, y1 + 0.06, HSZ, { s: bodenM, n: bodenM, o: bodenM, w: bodenM }, { name: "hsboden" });
    kiste(M, x0, y0, HSZ, x1, y1, zw, { o: brettM(71, 1), s: brettM(72, 3), n: brettM(73, 3), w: brettM(74, 2), t: zw < HSK ? (g, F) => { g.fillStyle = "rgb(60,50,40)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); } : null }, { name: "kanzel" });
    if (k >= 0.75) {
      /* Pultdach nach Westen fallend, Dachpappe mit Leisten */
      M.teil("hsdach", { mitte: [HSX, HSY, HSK + 3] });
      const ue = 0.16, zO = HSK + 0.3, zU = HSK + 0.05;
      const nD = nrm([zU - zO, 0, (x1 + ue) - (x0 - ue)]);
      vieleck(M, "hsdach", [[x1 + ue, y0 - ue, zO], [x1 + ue, y1 + ue, zO], [x0 - ue, y1 + ue, zU], [x0 - ue, y0 - ue, zU]], mul(nD, -1)[2] > 0 ? mul(nD, -1) : nD, [0, 1, 0], (g, F) => {
        g.fillStyle = "rgb(58,62,60)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
        tonFlecken(g, 0, 0, F.w, F.h, 0.5, 0.35, 3, "#5a6a3e");
        g.fillStyle = "rgba(255,255,255,0.12)"; for (let a = 0.25; a < F.w; a += 0.4) g.fillRect(a, 0, 0.04, F.h);
        if (winter) schneeFlaeche(g, F, 0.02, 0.02, F.w - 0.04, F.h - 0.04, 9, {});
      });
      const kb = (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [70, 58, 46], 5, false); if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.04); } };
      wand(M, [x1 + ue, y1 + ue, zO], [1, 0, 0], y1 - y0 + 2 * ue, 0.1, kb, { name: "hsdk-o", keinAo: true });
      wand(M, [x0 - ue, y0 - ue, zU], [-1, 0, 0], y1 - y0 + 2 * ue, 0.1, kb, { name: "hsdk-w", keinAo: true });
      vieleck(M, "hsdk-s", [[x0 - ue, y1 + ue, zU], [x1 + ue, y1 + ue, zO], [x1 + ue, y1 + ue, zO - 0.1], [x0 - ue, y1 + ue, zU - 0.1]], [0, 1, 0], [1, 0, 0], kb, { keinAo: true });
      vieleck(M, "hsdk-n", [[x1 + ue, y0 - ue, zO], [x0 - ue, y0 - ue, zU], [x0 - ue, y0 - ue, zU - 0.1], [x1 + ue, y0 - ue, zO - 0.1]], [0, -1, 0], [-1, 0, 0], kb, { keinAo: true });
    }
    if (k < 0.85) return;
    /* Leiter: zwei Holme, Sprossen alle 30 cm; lehnt an der Westseite */
    const lx0 = x0 - 1.15, lx1 = x0 - 0.02, ly = HSY + 0.12;
    M.teil("leiter", { mitte: [(lx0 + lx1) / 2 - 0.2, ly, 1.6] });
    const holm = (i) => () => (g, F) => holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [128, 108, 86], 80 + i, F.h > F.w);
    for (const dy of [-0.24, 0.24]) rohr(M, [lx0, ly + dy, 0], [lx1 + 0.06, ly + dy, HSZ + 0.8], 0.045, 5, holm(dy > 0 ? 1 : 2), null, { name: "holm" + dy });
    const sp = () => (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [140, 118, 92], 90, false); if (winter && F.h < F.w) { g.fillStyle = "rgba(242,246,252,0.9)"; g.fillRect(-0.02, -0.02, F.w + 0.04, F.h * 0.45); } };
    for (let z = 0.3; z < HSZ; z += 0.3) {
      const t = z / (HSZ + 0.8), x = lx0 + (lx1 + 0.06 - lx0) * t;
      balken3(M, [x, ly - 0.24, z], [x, ly + 0.24, z], [1, 0, 0], 0.045, 0.045, sp, { name: "spr" + z, seiten: "QRr" });
    }
  }

  /* =====================================================================
     BRENNHOLZ an der Südwand, REGENTONNE, zertretener Platz
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
  function stapelBauen(M, Z, S) {
    const x0 = HX0 + 0.55, x1 = HX0 + 3.3, y0 = HY1 + 0.08, y1 = HY1 + 0.52, H = 1.55;
    const z0 = 0.1, z1 = z0 + (H - z0) * Z.stapel, sa = S.saat + 300;
    M.teil("stapel", { mitte: [(x0 + x1) / 2, (y0 + y1) / 2, z1 / 2] });
    const ul = () => (g, F) => holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [80, 64, 50], 3, false);
    balken3(M, [x0 - 0.08, y0 + 0.25, 0.05], [x1 + 0.08, y0 + 0.25, 0.05], [0, 1, 0], 0.1, 0.1, ul, { name: "su", seiten: "QRae" });
    const oben = (g, F) => { stapelOben(g, F, F.w, F.h, sa + 9, false); if (S.winter && Z.fertig) { g.fillStyle = "rgba(242,246,252,0.92)"; g.fillRect(-0.02, F.h * 0.55, F.w + 0.04, F.h * 0.5); } };
    kiste(M, x0, y0, z0, x1, y1, z1, { s: (g, F) => scheiteMalen(g, F, F.w, F.h, sa + 1, false), o: (g, F) => kreuzMalen(g, F, F.w, F.h, sa + 3), w: (g, F) => kreuzMalen(g, F, F.w, F.h, sa + 4), t: oben }, { name: "stapel" });
  }
  function tonneBauen(M, Z, S) {
    const cx = HX1 - 0.75, cy = HY1 + 0.62, r = 0.3, h = 0.85;
    M.teil("tonne", { mitte: [cx, cy, h / 2] });
    rohr(M, [cx, cy, 0], [cx, cy, h], r, 14, (i) => (g, F) => {
      const c = PI.streu([112, 82, 56], zufall(i + 7), 0.08);
      holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, c, 120 + i, true);
      g.fillStyle = "rgba(14,10,8,0.6)"; g.fillRect(F.w - 0.008, -0.02, 0.012, F.h + 0.04);
      /* drei Eisenreifen */
      for (const z of [0.1, h / 2, h - 0.1]) { g.fillStyle = "rgb(46,42,40)"; g.fillRect(-0.02, h - z - 0.025, F.w + 0.04, 0.05); g.fillStyle = "rgba(160,120,90,0.35)"; g.fillRect(-0.02, h - z + 0.01, F.w + 0.04, 0.015); }
      tonFlecken(g, 0, 0, F.w, F.h, 0.4, 0.3, i, "#3e4a2c");
    }, () => (g, F) => {
      g.fillStyle = "rgb(84,62,44)"; g.beginPath(); g.ellipse(F.w / 2, F.h / 2, F.w / 2, F.h / 2, 0, 0, TAU); g.fill();
      const winter = F.jahr === "winter" && Z.fertig;
      const gr = g.createLinearGradient(0, 0, F.w, F.h);
      if (winter) { gr.addColorStop(0, "rgb(214,226,238)"); gr.addColorStop(1, "rgb(176,194,214)"); }
      else { gr.addColorStop(0, "rgb(60,74,86)"); gr.addColorStop(0.5, "rgb(30,38,44)"); gr.addColorStop(1, "rgb(70,84,96)"); }
      g.fillStyle = gr; g.beginPath(); g.ellipse(F.w / 2, F.h / 2, F.w / 2 - 0.035, F.h / 2 - 0.035, 0, 0, TAU); g.fill();
      if (!winter) { g.fillStyle = "rgba(220,234,250,0.25)"; g.beginPath(); g.ellipse(F.w * 0.4, F.h * 0.4, F.w * 0.18, F.h * 0.08, -0.6, 0, TAU); g.fill(); }
    }, { name: "tonne", ohneKappe: -1, ao: true });
  }
  function platzBauen(M, Z, S) {
    M.teil("platz", { ebene: -3, schatten: false, mitte: [3.2, -1.5, 0] });
    const x0 = VX1 - 0.4, y0 = -4.9, w = 3.0, h = 6.0;
    const rng = zufall(S.saat + 17), um = [];
    for (let i = 0; i < 22; i++) { const a = i / 22 * TAU, r = 0.82 + rng() * 0.16; um.push([w / 2 + Math.cos(a) * w / 2 * r, h / 2 + Math.sin(a) * h / 2 * r]); }
    M.flaeche({ name: "platz", o: [x0, y0, 0.012], u: [1, 0, 0], v: [0, 1, 0], w: w, h: h, umriss: um, keinLicht: true, keinAo: true, malen: (g, F) => {
      const winter = F.jahr === "winter";
      const lf = ST.lichtFaktor([0, 0, 1], F.zeit, 0, F.jahr);
      const lit = (c, a) => rgb([c[0] * lf[0], c[1] * lf[1], c[2] * lf[2]], a);
      const litH = (c) => "#" + c.map((v, i) => ("0" + Math.round(Math.min(255, v * lf[i])).toString(16)).slice(-2)).join("");
      /* Trampelpfad von der Treppe zum Hochsitz */
      g.save();
      g.beginPath(); g.moveTo(0.6, h * 0.62); g.bezierCurveTo(1.6, h * 0.55, 1.4, h * 0.3, 0.6, h * 0.18);
      g.strokeStyle = "rgba(255,255,255," + (0.8 * Z.platz).toFixed(3) + ")"; g.lineWidth = 0.7; g.lineCap = "round"; g.stroke();
      g.globalCompositeOperation = "source-in";
      g.fillStyle = lit(winter ? [208, 216, 230] : [112, 92, 66]); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
      g.globalCompositeOperation = "source-atop";
      tonFlecken(g, 0, 0, w, h, 0.9, 0.5, 3, litH(winter ? [240, 244, 250] : [140, 116, 84]), true);
      if (!winter) tonFlecken(g, 0, 0, w, h, 0.7, 0.45, 8, litH([86, 104, 56]));
      if (F.jahr === "herbst") laubMalen(g, F, 0, 0, w, h, 31, 0.6);
      g.restore();
      void rng;
    } });
  }
})();
