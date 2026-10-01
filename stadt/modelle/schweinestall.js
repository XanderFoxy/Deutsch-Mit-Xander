/* =====================================================================
   FASSUNG 833 — SCHWEINESTALL: niedriger Backsteinstall mit Auslauf,
   Suhle, Trog und Strohhaufen
   ---------------------------------------------------------------------
   XANDER (Funk 255): „die Sachen die ich weiter baue tauchen niemals auf
   der Karte auf die Jagdhütte oder Kuhstall oder sowas" – deshalb hat
   jedes Spielgebäude jetzt ein eigenes Modell.
   XANDER: „richtig filigran. Richtig schön ausarbeiten mit schönen
   Texturen" · „keine Comic Grafik … viel mehr am Realismus" · „Man soll
   das Fundament sehen beim Aufbauen".

   VORBILD: Schweineställe der Gründerzeit auf norddeutschen Höfen:
   Ziegelrohbau aus roten Handstrichziegeln auf einem Feldsteinsockel,
   unter der Traufe ein Deutsches Band (übereck gestellte Ziegel) und
   eine Rollschicht, kleine gusseiserne Stallfenster mit Stichbögen, die
   geteilte Stalltür, unten die Schweineklappen zum Auslauf. Im Giebel
   ein Eulenloch und ein Lüftungsgitter aus ausgesparten Steinen, auf dem
   First zwei hölzerne Lüftungsschlote, das Dach mit Hohlpfannen. Davor
   der Auslauf hinter einem Bretterzaun: zertretener Lehm, die Suhle
   (Schlammpfütze mit Himmelsspiegel), der Betontrog an der Stallwand,
   ein Scheuerpfahl; daneben der Strohhaufen mit der Forke. Die Schweine
   setzt die Stadt selbst (schwein.js) – im Modell sind keine Tiere.

   MASSE (Meter; im eigenen Achsenkreuz gebaut: x längs des Firsts,
   y zum Auslauf; dann um −90° gedreht, der Auslauf liegt im Osten)
     Stall      7,0 × 5,0 m, Sockel 0,25 m, Traufe 2,65 m (32 Schichten),
                Dachneigung 42°, First rund 5 m, Lüftungsschlote 5,6 m
     Fenster    0,8 × 0,7 m mit Stichbogen, Tür 1,0 × 2,0 m,
                Schweineklappen 0,55 × 0,75 m
     Auslauf    8,0 × 3,4 m, Bretterzaun 1,05 m, Tor 1,1 m
     Suhle      rund 2,6 × 1,6 m, Trog 1,6 m, Strohhaufen 2,6 × 2,4 m
   AUFBAU (o.bau): Schnurgerüst → Baugrube → Streifenfundament (Beton) →
   Verfüllen → Feldsteinsockel → Ziegelwände Schicht für Schicht →
   Giebel → Sparren → Lattung, Pfannen Reihe für Reihe → Lüftungsschlote →
   Fenster, Türen, Klappen → Zaunpfosten, Bretter → Suhle, Trog, Stroh.
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
     MASSE (eigenes Achsenkreuz: x längs des Firsts, y zum Auslauf)
     ===================================================================== */
  const SX0 = -5.0, SX1 = 2.0, SY0 = -4.1, SY1 = 0.9, YM = (SY0 + SY1) / 2;
  const ZH = 0.075, ZL = 0.25;                        // Ziegelschicht, Ziegellänge
  const ZS = 0.25, ZT = ZS + 32 * ZH;                 // Sockel, Traufe 2,65 m
  const NEIG = 42 * RAD, TN = Math.tan(NEIG);
  const UET = 0.35, UEG = 0.3;
  const ZD = ZT + 0.12;
  const HF = (SY1 - SY0) / 2 * TN;
  const zDach = (y) => ZD + HF - Math.abs(y - YM) * TN;
  const STALL_M = [(SX0 + SX1) / 2, YM, 1.3];
  /* Auslauf */
  const AX0 = -5.2, AX1 = 2.8, AY0 = SY1, AY1 = 4.3, ZZ = 1.05, TOR = [-1.15, 0.0];
  /* Lüftungsschlote auf dem First */
  const SCHLOTE = [-3.4, 0.0];
  const OEFF = {
    sued: [{ art: "klappe", a0: 0.55, a1: 1.1 }, { art: "fenster", a0: 1.6, a1: 2.4 }, { art: "tuer", a0: 3.0, a1: 4.0 }, { art: "fenster", a0: 4.6, a1: 5.4 }, { art: "klappe", a0: 5.9, a1: 6.45, offen: true }],
    nord: [{ art: "fenster", a0: 0.9, a1: 1.7 }, { art: "fenster", a0: 3.1, a1: 3.9 }, { art: "fenster", a0: 5.3, a1: 6.1 }],
    ost: [{ art: "tuer", a0: 1.9, a1: 2.9 }, { art: "fenster", a0: 3.6, a1: 4.3 }],
    west: [{ art: "fenster", a0: 2.1, a1: 2.9 }]
  };
  for (const n in OEFF) for (const o of OEFF[n]) {
    if (o.art === "fenster") { o.z0 = 1.3; o.z1 = 1.95; o.s = 0.09; }
    else if (o.art === "tuer") { o.z0 = ZS; o.z1 = ZS + 1.8; o.s = 0.09; }
    else { o.z0 = ZS; o.z1 = ZS + 0.75; o.s = 0; }
  }
  const TUERFARBEN = [[64, 92, 70], [122, 50, 38], [74, 84, 98]];
  const PFANNE = [174, 80, 48];
  const PF_B = 0.21, PF_R = 0.3;
  const MOOS = [104, 106, 70], FLECHTE = [168, 160, 118];
  const FUGE = [192, 186, 172];
  const ZIEGEL_T = [[150, 62, 44], [163, 75, 50], [138, 56, 41], [173, 92, 60], [116, 48, 36], [156, 68, 50], [146, 80, 58]];
  const BRETT_ROH = [188, 152, 108], EICHE_ROH = [172, 134, 94];
  const STROH = [206, 172, 98];

  /* =====================================================================
     BAUPHASEN
       0,00–0,07  Schnurgerüst, Baugrube
       0,07–0,14  Streifenfundament (Beton)
       0,14–0,19  Verfüllen
       0,18–0,26  Feldsteinsockel
       0,26–0,56  Ziegelwände Schicht für Schicht
       0,54–0,62  Giebel
       0,60–0,66  Sparren
       0,66–0,82  Lattung, Pfannen Reihe für Reihe
       0,80–0,85  Lüftungsschlote
       0,85–0,88  Fenster, Türen, Klappen
       0,86–0,92  Zaunpfosten, Bretter, Tor
       0,92–1,00  Auslauf, Trog, Suhle, Strohhaufen, Ballen
     ===================================================================== */
  function zustand(bau) {
    const f = (a, b) => klemm((bau - a) / (b - a), 0, 1);
    const Z = { bau: bau, fertig: bau >= 0.999 };
    Z.grube = bau < 0.2 ? { schnur: bau < 0.07, tiefe: f(0.004, 0.06), beton: f(0.07, 0.14), verfuellt: f(0.14, 0.19) } : null;
    Z.aushub = bau < 0.14 ? f(0.004, 0.06) : bau < 0.28 ? 1 - 0.9 * f(0.14, 0.28) : 0;
    Z.sockel = f(0.18, 0.26);
    Z.waende = f(0.26, 0.56);
    Z.giebel = f(0.54, 0.62);
    Z.sparren = f(0.6, 0.66);
    Z.dach = bau >= 0.66; Z.ziegel = f(0.68, 0.82);
    Z.schlote = f(0.8, 0.85);
    Z.fenster = bau >= 0.85; Z.tuer = bau >= 0.86; Z.klappe = bau >= 0.87;
    Z.pfosten = f(0.86, 0.89); Z.bretter = f(0.89, 0.92);
    Z.boden = f(0.92, 0.97); Z.trog = bau >= 0.94; Z.stroh = f(0.95, 1); Z.ballen = bau >= 0.97; Z.pfahl = bau >= 0.96;
    Z.alt = bau >= 0.85;
    return Z;
  }

  /* =====================================================================
     ZIEGEL, DACH (aus dem Kuhstall)
     ===================================================================== */
  function ziegelMalen(g, F, x, y, w, h, saat, opt) {
    opt = opt || {};
    const px = F.px;
    g.fillStyle = rgb(FUGE); g.fillRect(x, y, w, h);
    if (px * ZH < 1.8) {
      g.fillStyle = "rgb(150,68,48)"; g.fillRect(x, y, w, h);
      if (px * ZH > 1.1) { g.fillStyle = "rgba(210,200,186,0.22)"; for (let yy = y + h; yy > y; yy -= ZH) g.fillRect(x, yy - 0.01, w, 0.012); }
      rausch(g, x, y, w, h, 2.5, 0.22, saat, 3);
      return;
    }
    const rng = zufall(saat * 17 + 5);
    const j = Math.max(0.011, 0.75 / px);
    const pf = ZIEGEL_T.map(() => new Path2D());
    const schatten = new Path2D(), licht = new Path2D();
    const sd = Math.max(0.006, 0.9 / px);
    let yb = y + h, reihe = 0;
    while (yb > y - 0.001) {
      const yt = yb - ZH, off = ((reihe + (opt.lage || 0)) % 2) * ZL / 2;
      for (let xx = x - off; xx < x + w; xx += ZL) {
        const r = rng();
        const k = r < 0.22 ? 0 : r < 0.42 ? 1 : r < 0.6 ? 2 : r < 0.7 ? 3 : r < 0.76 ? 4 : r < 0.92 ? 5 : 6;
        pf[k].rect(xx + j / 2, yt + j / 2, ZL - j, ZH - j);
        if (px > 22) { schatten.rect(xx + j / 2, yb - j / 2 - sd, ZL - j, sd); licht.rect(xx + j / 2, yt + j / 2, ZL - j, sd * 0.8); }
      }
      yb = yt; reihe++;
    }
    for (let i = 0; i < pf.length; i++) { g.fillStyle = rgb(ZIEGEL_T[i]); g.fill(pf[i]); }
    if (px > 22) {
      g.fillStyle = "rgba(40,16,10,0.32)"; g.fill(schatten);
      g.fillStyle = "rgba(255,220,190,0.18)"; g.fill(licht);
    }
    if (px > 30) rausch(g, x, y, w, h, 0.35, 0.16, saat + 9, 2);
    rausch(g, x, y, w, h, 2.6, 0.2, saat + 3, 4);
    if (px > 10) bleich(g, x, y, w, h, 1.9, 0.08, saat);
  }
  let PF_BILD = null;
  function pfannenBild() {
    if (PF_BILD) return PF_BILD;
    const W = 72, H = Math.round(72 * PF_R / PF_B);
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d");
    /* Profilhelligkeit quer: Mulde (0…0,62) und Wulst (0,62…1) */
    const P = [[0, 0.58], [0.06, 0.78], [0.26, 0.68], [0.44, 0.9], [0.6, 1.04], [0.72, 1.2], [0.8, 1.12], [0.92, 0.66], [1, 0.5]];
    const prof = (t) => { for (let i = 1; i < P.length; i++) if (t <= P[i][0]) { const a = P[i - 1], b = P[i], k = (t - a[0]) / (b[0] - a[0]); const s = k * k * (3 - 2 * k); return a[1] + (b[1] - a[1]) * s; } return P[P.length - 1][1]; };
    for (let x = 0; x < W; x++) {
      const k = prof((x + 0.5) / W);
      g.fillStyle = rgb(PFANNE.map((v) => Math.min(255, v * k)));
      g.fillRect(x, 0, 1, H);
    }
    /* Längs: unter der Überdeckung dunkler, zur Nase hin heller */
    const gl = g.createLinearGradient(0, 0, 0, H);
    gl.addColorStop(0, "rgba(40,14,8,0.28)"); gl.addColorStop(0.35, "rgba(40,14,8,0.05)"); gl.addColorStop(0.85, "rgba(255,210,170,0.06)"); gl.addColorStop(1, "rgba(255,210,170,0.12)");
    g.fillStyle = gl; g.fillRect(0, 0, W, H);
    /* Schlagschatten der oberen Reihe: in der Mulde länger als am Wulst */
    const tiefe = (t) => (t < 0.62 ? Math.sin(t / 0.62 * Math.PI) : -0.35 * Math.sin((t - 0.62) / 0.38 * Math.PI));
    g.beginPath(); g.moveTo(0, 0);
    for (let x = 0; x <= W; x += 2) g.lineTo(x, H * (0.1 + 0.07 * tiefe(x / W)));
    g.lineTo(W, 0); g.closePath();
    g.fillStyle = "rgba(34,10,6,0.55)"; g.fill();
    g.beginPath(); g.moveTo(0, 0);
    for (let x = 0; x <= W; x += 2) g.lineTo(x, H * (0.16 + 0.08 * tiefe(x / W)));
    g.lineTo(W, 0); g.closePath();
    g.fillStyle = "rgba(34,10,6,0.18)"; g.fill();
    /* Nase der eigenen Pfanne unten: helle Kante */
    g.strokeStyle = "rgba(255,214,176,0.35)"; g.lineWidth = 1.4;
    g.beginPath(); for (let x = 0; x <= W; x += 2) { const y = H - 1.5 - 3 * Math.max(0, -tiefe(x / W)); if (x) g.lineTo(x, y); else g.moveTo(x, y); } g.stroke();
    /* Tonkorn */
    const id = g.getImageData(0, 0, W, H), d = id.data, rng = zufall(77);
    for (let i = 0; i < W * H; i++) { const n = (rng() - 0.5) * 16; d[i * 4] = klemm(d[i * 4] + n, 0, 255); d[i * 4 + 1] = klemm(d[i * 4 + 1] + n * 0.8, 0, 255); d[i * 4 + 2] = klemm(d[i * 4 + 2] + n * 0.7, 0, 255); }
    g.putImageData(id, 0, 0);
    PF_BILD = c;
    return c;
  }
  function pfannenMalen(g, F, x0, x1, yTraufe, yOben, saat, opt) {
    opt = opt || {};
    const px = F.px, w = x1 - x0, h = yTraufe - yOben;
    const nord = opt.nord || 0, ow = opt.welt || 0;
    const moos = (x, y) => {
      const r = ST.fbm((x + ow) * 0.45, y * 0.6 + saat * 0.13, 3, 7 + saat);
      const traufe = klemm(1 - (yTraufe - y) / 1.8, 0, 1);
      return klemm((r - 0.5) * 2.2 + traufe * 0.5 + nord * 0.5 - 0.3, 0, 1);
    };
    const yGrenze = opt.bisReihe != null ? yTraufe - (opt.bisReihe + 1) * PF_R : yOben - 0.1;
    g.save();
    if (opt.bisReihe != null) {
      g.beginPath();
      g.moveTo(x0 - 0.1, yTraufe + 0.1); g.lineTo(x1 + 0.1, yTraufe + 0.1); g.lineTo(x1 + 0.1, yGrenze + PF_R);
      const xt = x0 + w * (opt.teilReihe == null ? 1 : opt.teilReihe);
      g.lineTo(xt, yGrenze + PF_R); g.lineTo(xt, yGrenze); g.lineTo(x0 - 0.1, yGrenze); g.closePath(); g.clip();
    }
    if (px * PF_R < 3) {
      /* weit weg: Reihenstreifen */
      g.fillStyle = rgb(PFANNE); g.fillRect(x0 - 0.05, yOben - 0.05, w + 0.1, h + 0.1);
      g.fillStyle = "rgba(60,20,10,0.28)";
      for (let y = yTraufe; y > yOben; y -= PF_R) g.fillRect(x0 - 0.05, y - PF_R, w + 0.1, PF_R * 0.22);
    } else {
      const bild = pfannenBild();
      const m = g.createPattern(bild, "repeat");
      const k = PF_B / bild.width;
      m.setTransform(new DOMMatrix([k, 0, 0, PF_R / bild.height, x0, yTraufe]));
      g.fillStyle = m; g.fillRect(x0 - 0.05, yOben - 0.05, w + 0.1, h + 0.1);
      /* Farbe je Pfanne (gebrannt, nachgekauft, bemoost) – vier Eimer */
      if (px * PF_B > 4) {
        const rr = zufall(saat * 13 + 1);
        const E = [new Path2D(), new Path2D(), new Path2D(), new Path2D(), new Path2D()];
        for (let y = yTraufe; y > yOben - PF_R; y -= PF_R) {
          for (let x = x0 + Math.floor((-0.001) / PF_B) * PF_B; x < x1; x += PF_B) {
            const r = rr(), mo = moos(x, y);
            if (mo > 0.55 && rr() < mo) E[3].rect(x, y - PF_R, PF_B, PF_R);
            else if (mo > 0.3 && rr() < mo) E[4].rect(x, y - PF_R * 0.45, PF_B * 0.62, PF_R * 0.45);
            else if (r < 0.14) E[0].rect(x, y - PF_R, PF_B, PF_R);
            else if (r < 0.26) E[1].rect(x, y - PF_R, PF_B, PF_R);
            else if (r < 0.33) E[2].rect(x, y - PF_R, PF_B, PF_R);
          }
        }
        g.fillStyle = "rgba(60,18,8,0.16)"; g.fill(E[0]);
        g.fillStyle = "rgba(255,186,140,0.12)"; g.fill(E[1]);
        g.fillStyle = "rgba(96,86,76,0.2)"; g.fill(E[2]);
        g.fillStyle = rgb(MOOS, 0.34); g.fill(E[3]);
        g.fillStyle = rgb(MOOS, 0.45); g.fill(E[4]);
      }
      /* Flechten: gelbgraue Tupfen (nah) */
      if (px > 30) {
        const rr = zufall(saat + 51);
        g.fillStyle = rgb(FLECHTE, 0.55);
        g.beginPath();
        for (let i = 0; i < Math.min(900, w * h * 5); i++) { const x = x0 + rr() * w, y = yOben + rr() * h; if (moos(x, y) < 0.25) continue; const r = 0.008 + rr() * 0.02; g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU); }
        g.fill();
      }
    }
    /* großes Moos und Verwitterung */
    tonFlecken(g, x0, yOben, w, h, 2.6, 0.22 + nord * 0.2, saat + 31, "#6a6a46");
    rausch(g, x0, yOben, w, h, 4.2, 0.2, saat + 8, 4);
    if (px > 12) bleich(g, x0, yOben, w, h, 3.1, 0.07, saat + 3);
    if (opt.laub) laubMalen(g, F, x0, yOben, w, h, saat + 91, 1.4, yTraufe);
    g.restore();
  }
  function firstBand(g, F, p, q, winter) {
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]);
    if (L < 0.05) return;
    g.save(); g.translate(p[0], p[1]); g.rotate(Math.atan2(q[1] - p[1], q[0] - p[0]));
    if (winter) { g.fillStyle = "rgba(246,249,253,0.95)"; g.fillRect(-0.02, -0.05, L + 0.04, 0.16); g.restore(); return; }
    g.fillStyle = "rgb(186,180,166)"; g.fillRect(-0.02, -0.02, L + 0.04, 0.2);
    rausch(g, 0, -0.02, L, 0.2, 0.6, 0.3, 7, 3);
    const c = hell(PFANNE, -0.08);
    for (let a = 0; a < L; a += 0.38) {
      const gr = g.createLinearGradient(0, -0.04, 0, 0.14);
      gr.addColorStop(0, rgb(hell(c, 0.14))); gr.addColorStop(0.5, rgb(c)); gr.addColorStop(1, rgb(hell(c, -0.3)));
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(a, -0.04); g.lineTo(a + 0.4, -0.04); g.quadraticCurveTo(a + 0.42, 0.05, a + 0.4, 0.14); g.lineTo(a + 0.02, 0.14); g.closePath(); g.fill();
      if (F.px > 20) { g.fillStyle = "rgba(40,14,8,0.35)"; g.fillRect(a + 0.38, -0.04, 0.02, 0.18); }
    }
    g.restore();
  }
  function lattungMalen(g, F, x0, w, h) {
    holzMalen(g, F, x0 - 0.05, -0.05, w + 0.1, h + 0.1, hell(BRETT_ROH, -0.08), 41, true);
    g.fillStyle = "rgba(40,30,20,0.35)";
    for (let x = x0 + 0.2; x < x0 + w; x += 0.2) g.fillRect(x, -0.05, 0.008, h + 0.1);
    for (let y = h - 0.05; y > 0; y -= PF_R) {
      g.fillStyle = "rgba(30,22,16,0.4)"; g.fillRect(x0 - 0.05, y - 0.01, w + 0.1, 0.05);
      g.fillStyle = rgb(hell(EICHE_ROH, 0.08)); g.fillRect(x0 - 0.05, y - 0.03, w + 0.1, 0.04);
    }
  }
  function schneeRippen(g, F, x0, x1, yTraufe, yAb, saat) {
    const pxV = F.pxV || F.px, ZR = PF_R;
    if (pxV * ZR < 2.2) return;
    const rng = zufall(saat * 3 + 1);
    const st = klemm((pxV * ZR - 2.2) / 3, 0.4, 1);
    const reihen = [[], [], []];
    for (let k = 1; ; k++) {
      const yu = yTraufe - k * ZR;
      if (yu < yAb) break;
      const t = klemm((yTraufe - yu) / Math.max(0.5, yTraufe - yAb), 0, 1);
      let x = x0 - 0.1 - rng() * 0.5;
      while (x < x1 + 0.1) {
        const l = 0.6 + rng() * 2.4, q = rng() + (1 - t) * 0.35;
        if (q < 0.9) {
          const pts = [], nn = Math.max(4, Math.round(l / 0.25));
          for (let i = 0; i <= nn; i++) { const u = i / nn; pts.push([x + l * u, yu + (rng() - 0.5) * 0.02, Math.pow(Math.sin(Math.PI * u), 0.6)]); }
          reihen[q < 0.3 ? 0 : q < 0.6 ? 1 : 2].push(pts);
        }
        x += l;
      }
    }
    const band = (liste, d0, d1) => {
      g.beginPath();
      for (const P of liste) {
        g.moveTo(P[0][0], P[0][1] + d0 * P[0][2]);
        for (let i = 1; i < P.length; i++) g.lineTo(P[i][0], P[i][1] + d0 * P[i][2]);
        for (let i = P.length - 1; i >= 0; i--) g.lineTo(P[i][0], P[i][1] + d1 * P[i][2]);
        g.closePath();
      }
    };
    reihen.forEach((liste, k) => {
      if (!liste.length) return;
      const m = st * [0.5, 0.3, 0.15][k];
      band(liste, -0.026, 0); g.fillStyle = "rgba(255,255,255," + (0.3 * m).toFixed(3) + ")"; g.fill();
      band(liste, 0, 0.055); g.fillStyle = "rgba(104,124,180," + (0.2 * m).toFixed(3) + ")"; g.fill();
    });
  }
  function dachSchnee(g, F, x0, x1, yTraufe, yOben, saat, opt) {
    opt = opt || {};
    const w = x1 - x0, h = yTraufe - yOben, rng = zufall(saat * 7 + 3), px = F.px;
    const oben = opt.oben == null ? 0.3 : opt.oben;
    const grenze = (x) => yOben + klemm((0.05 + (ST.fbm(x * 0.42 + saat * 0.7, saat * 0.31, 3, saat) - 0.3) * 1.5) * oben / 0.36 + Math.sin(x * 1.7 + saat) * 0.03, 0.03, 0.95);
    const kanteP = []; for (let x = x0 - 0.1; x <= x1 + 0.15; x += 0.1) kanteP.push([x, grenze(x)]);
    if (oben > 0.01) {
      g.save(); g.beginPath(); g.rect(x0 - 0.1, yOben - 0.1, w + 0.2, oben + 0.9); g.clip();
      pfannenMalen(g, F, x0 - 0.05, x1 + 0.05, yTraufe, yOben, saat, { nord: opt.nord });
      g.fillStyle = "rgba(226,232,242,0.2)"; g.fillRect(x0 - 0.1, yOben - 0.1, w + 0.2, oben + 0.9);
      /* Schnee in den Mulden */
      if (px * PF_B > 3) {
        g.beginPath();
        for (let x = x0 + Math.floor(-0.001 / PF_B) * PF_B; x < x1; x += PF_B) {
          const lg = rng();
          const y1 = grenze(x + PF_B * 0.3) + 0.08, y0 = Math.min(y1 - 0.03, yOben + 0.02 + Math.pow(rng(), 0.7) * (y1 - yOben));
          if (lg < 0.3) continue;
          const bx = x + PF_B * (0.1 + rng() * 0.06), bw = PF_B * (0.34 + rng() * 0.1);
          g.moveTo(bx, y1); g.lineTo(bx, y0 + 0.03); g.quadraticCurveTo(bx + bw / 2, y0 - 0.02, bx + bw, y0 + 0.03); g.lineTo(bx + bw, y1); g.closePath();
        }
        g.fillStyle = "rgba(240,244,250,0.94)"; g.fill();
      }
      g.restore();
    }
    g.save();
    g.beginPath(); g.moveTo(x0 - 0.1, yTraufe + 0.1); for (const [x, y] of kanteP) g.lineTo(x, oben > 0.01 ? y : yOben - 0.05); g.lineTo(x1 + 0.15, yTraufe + 0.1); g.closePath(); g.clip();
    schneeFlaeche(g, F, x0 - 0.1, yOben - 0.05, w + 0.25, h + 0.15, saat, { glitzer: false, zwischen: () => schneeRippen(g, F, x0, x1, yTraufe, yOben + oben + 0.15, saat) });
    if (opt.reiter != null) {
      /* Lee hinter dem Lüftungsreiter: blaue Mulde, davor eine Wehe */
      const blob = (cx, cy, rx, ry, farbe, a) => {
        const gg = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
        gg.addColorStop(0, "rgba(" + farbe + "," + a + ")"); gg.addColorStop(1, "rgba(" + farbe + ",0)");
        g.save(); g.translate(cx, cy); g.scale(1, ry / rx); g.translate(-cx, -cy); g.fillStyle = gg; g.beginPath(); g.arc(cx, cy, rx, 0, TAU); g.fill(); g.restore();
      };
      blob(opt.reiter, yOben + 1.0, 1.2, 0.7, "104,124,178", 0.3);
      blob(opt.reiter, yOben + 0.3, 1.0, 0.3, "252,253,255", 0.5);
    }
    g.restore();
    if (oben > 0.01) {
      g.lineJoin = "round"; g.lineCap = "round";
      g.beginPath(); kanteP.forEach(([x, y], i) => (i ? g.lineTo(x, y + 0.04) : g.moveTo(x, y + 0.04)));
      g.strokeStyle = "rgba(128,148,196,0.34)"; g.lineWidth = Math.max(0.035, 1.2 / px); g.stroke();
      g.beginPath(); kanteP.forEach(([x, y], i) => (i ? g.lineTo(x, y + 0.01) : g.moveTo(x, y + 0.01)));
      g.strokeStyle = "rgba(250,252,255,0.95)"; g.lineWidth = Math.max(0.025, 1.0 / px); g.stroke();
    }
    if (F.licht > 0.3) glitzer(g, F, x0, yOben + oben, w, h - oben, 5, rng);
  }
  function mistgabel(g, s, F) {
    const FL = F.schatten ? null : figurLicht(F);
    const col = (c, l) => (FL ? FL.lit(c, l) : "#000");
    g.lineCap = "round";
    g.strokeStyle = col([150, 116, 78], FL && FL.lV); g.lineWidth = Math.max(1, 0.035 * s);
    g.beginPath(); g.moveTo(0, 0); g.lineTo(0.35 * s, -1.2 * s * ST.KZ); g.stroke();
    g.strokeStyle = col([60, 58, 58], FL && FL.lV); g.lineWidth = Math.max(0.8, 0.02 * s);
    g.beginPath(); g.moveTo(-0.08 * s, 0.05 * s); g.lineTo(0.08 * s, -0.02 * s); g.stroke();
  }

  /* ---------------- Stichbogen-Öffnungen ---------------- */
  function bogenPfad(g, x, y, w, h, s) {
    g.beginPath(); g.moveTo(x, y + h); g.lineTo(x, y + s);
    if (s > 0) g.quadraticCurveTo(x + w / 2, y - s, x + w, y + s); else g.lineTo(x + w, y);
    g.lineTo(x + w, y + h); g.closePath();
  }
  /* Rollschicht über dem Bogen: hochkant gestellte Ziegel, strahlenförmig */
  function rollBogen(g, F, x, y, w, s, saat) {
    const rng = zufall(saat), d = 0.24, px = F.px;
    const innen = (t) => { const a = (1 - t) * (1 - t), b = 2 * t * (1 - t), c = t * t; return [a * x + b * (x + w / 2) + c * (x + w), a * (y + s) + b * (y - s) + c * (y + s)]; };
    const aussen = (t) => { const x0 = x - 0.1, x1 = x + w + 0.1, ya = y + s, yc = y - s - 2 * d; const a = (1 - t) * (1 - t), b = 2 * t * (1 - t), c = t * t; return [a * x0 + b * (x0 + x1) / 2 + c * x1, a * ya + b * yc + c * ya]; };
    const n = Math.max(6, Math.round((w + 0.2) / 0.08));
    const sv = F.schatten ? F.schatten(0.02) : null;
    for (let i = 0; i < n; i++) {
      const t0 = i / n, t1 = (i + 1) / n, p0 = innen(t0), p1 = innen(t1), q0 = aussen(t0), q1 = aussen(t1);
      g.fillStyle = rgb(hell(ZIEGEL_T[(rng() * ZIEGEL_T.length) | 0], -0.05));
      poly(g, [p0, p1, q1, q0]); g.fill();
      if (px * 0.08 > 3) { g.strokeStyle = rgb(FUGE, 0.9); g.lineWidth = Math.max(0.008, 0.7 / px); g.beginPath(); g.moveTo(p1[0], p1[1]); g.lineTo(q1[0], q1[1]); g.stroke(); }
    }
    if (px > 8) {
      g.strokeStyle = rgb(FUGE, 0.9); g.lineWidth = Math.max(0.01, 0.9 / px);
      g.beginPath(); for (let i = 0; i <= n; i++) { const q = aussen(i / n); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); } g.stroke();
    }
    if (sv) { g.strokeStyle = "rgba(20,10,8,0.3)"; g.lineWidth = 0.02; g.beginPath(); for (let i = 0; i <= n; i++) { const q = aussen(i / n); if (i) g.lineTo(q[0] + sv[0], q[1] + sv[1]); else g.moveTo(q[0] + sv[0], q[1] + sv[1]); } g.stroke(); }
  }
  /* Sohlbank: Rollschicht, leicht vorstehend */
  function sohlbank(g, F, x, y, w) {
    const sv = F.schatten(0.06), px = F.px;
    if (sv) { g.fillStyle = "rgba(20,10,8,0.35)"; g.fillRect(x - 0.06 + sv[0], y + 0.1, w + 0.12, Math.max(0.02, sv[1] * 0.8)); }
    g.fillStyle = rgb([128, 54, 40]); g.fillRect(x - 0.06, y, w + 0.12, 0.1);
    g.fillStyle = "rgba(255,220,190,0.2)"; g.fillRect(x - 0.06, y, w + 0.12, 0.02);
    if (px * 0.075 > 2.5) { g.fillStyle = rgb(FUGE, 0.8); for (let a = x - 0.06 + 0.075; a < x + w + 0.06; a += 0.075) g.fillRect(a - 0.005, y, 0.01, 0.1); }
  }
  /* Gusseisernes Stallfenster: Sprossengitter 4 × 3, Mitte oben Kippflügel */
  function eisenFenster(g, F, B, x, y, w, h, s, Z, saat) {
    const px = F.px, tag = 1 - F.nacht;
    g.save(); bogenPfad(g, x, y, w, h, s); g.clip();
    const pT = laibung(g, F, B, x, y, w, h, 0.14, [150, 70, 50]);
    const fx = x + pT[0], fy = y + pT[1];
    const gi = g.createLinearGradient(0, fy, 0, fy + h); gi.addColorStop(0, "rgb(26,22,20)"); gi.addColorStop(1, "rgb(52,42,34)");
    g.fillStyle = gi; g.fillRect(fx - 0.1, fy - 0.2, w + 0.2, h + 0.3);
    if (Z.fenster) {
      const himmel = (F.zeit && F.zeit.himmel) || ["#bcd3ea", "#e9f1f8"];
      const sp = g.createLinearGradient(0, fy - s, 0, fy + h), an = 0.4 * (0.3 + 0.7 * tag);
      sp.addColorStop(0, rgb(misch(hex(himmel[0]), [190, 204, 220], 0.4), an.toFixed(3))); sp.addColorStop(1, rgb([110, 116, 96], (an * 0.7).toFixed(3)));
      g.fillStyle = sp; g.fillRect(fx - 0.1, fy - 0.2, w + 0.2, h + 0.3);
      g.fillStyle = "rgba(150,138,110," + (0.25 * (0.4 + 0.6 * tag)).toFixed(3) + ")"; g.fillRect(fx - 0.1, fy - 0.2, w + 0.2, h + 0.3);
      /* Kippflügel: Mitte der oberen Reihe, nach innen gekippt (dunkler Spalt) */
      g.fillStyle = "rgba(10,8,8,0.55)"; g.fillRect(fx + w * 0.25, fy + s * 0.5, w * 0.5, h / 3 - s * 0.5);
      if (px > 10) { g.fillStyle = "rgba(255,255,255," + (0.06 + 0.1 * tag).toFixed(3) + ")"; poly(g, [[fx + w * 0.1, fy + h], [fx + w * 0.42, fy - s], [fx + w * 0.58, fy - s], [fx + w * 0.26, fy + h]]); g.fill(); }
      /* Gusssprossen */
      const c = "rgb(42,40,40)", sb = Math.max(0.018, 0.8 / px);
      g.fillStyle = c;
      for (let k = 0; k <= 4; k++) g.fillRect(fx + w * k / 4 - (k % 4 ? sb / 2 : 0) - (k === 4 ? 0.035 : 0), fy - s - 0.05, k % 4 ? sb : 0.035, h + s + 0.1);
      for (let k = 1; k < 3; k++) g.fillRect(fx, fy + h * k / 3 - sb / 2, w, sb);
      g.fillRect(fx, fy + h - 0.035, w, 0.035);
      g.strokeStyle = c; g.lineWidth = 0.035; g.beginPath(); g.moveTo(fx, fy + s); g.quadraticCurveTo(fx + w / 2, fy - s, fx + w, fy + s); g.stroke();
      if (px > 20) { g.fillStyle = "rgba(160,90,50,0.45)"; const r = zufall(saat); for (let i = 0; i < 8; i++) g.fillRect(fx + r() * w, fy + r() * h, 0.02 + r() * 0.03, 0.01 + r() * 0.02); }
    }
    schattenL(g, F, x, y, w, h, 0.14, 0.34);
    g.restore();
  }
  function eisenFensterLicht(g, F, B, x, y, w, h, s) {
    const a = F.nacht;
    if (a <= 0.01) return;
    const pT = parallaxe(F, B, 0.14);
    g.save(); bogenPfad(g, x, y, w, h, s); g.clip();
    const fx = x + pT[0], fy = y + pT[1];
    const gr = g.createRadialGradient(fx + w * 0.5, fy + h * 0.9, 0, fx + w / 2, fy + h * 0.5, w);
    gr.addColorStop(0, "rgba(255,206,130," + (0.85 * a).toFixed(3) + ")"); gr.addColorStop(1, "rgba(170,96,44," + (0.7 * a).toFixed(3) + ")");
    g.fillStyle = gr; g.fillRect(fx - 0.1, fy - 0.2, w + 0.2, h + 0.3);
    g.fillStyle = "rgba(40,30,24," + (0.9 * a).toFixed(3) + ")";
    for (let k = 1; k < 4; k++) g.fillRect(fx + w * k / 4 - 0.01, fy - s, 0.02, h + s);
    for (let k = 1; k < 3; k++) g.fillRect(fx, fy + h * k / 3 - 0.01, w, 0.02);
    g.restore();
    F.leuchtPunkt(x + w / 2, y + h * 0.6, 1.0, "255,180,100", 0.38);
  }
  /* Schweineklappe: Brettklappe oben angeschlagen; offen: dunkles Loch */
  function klappeMalen(g, F, B, x, y, w, h, Z, offen) {
    const px = F.px;
    /* Sturz: Eichenbohle */
    holzMalen(g, F, x - 0.12, y - 0.12, w + 0.24, 0.12, [96, 76, 58], 5, false);
    g.fillStyle = "rgba(16,10,8,0.35)"; g.fillRect(x - 0.12, y - 0.012, w + 0.24, 0.012);
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    const pT = laibung(g, F, B, x, y, w, h, 0.25, [140, 66, 48]);
    g.fillStyle = "rgb(16,12,10)"; g.fillRect(x + pT[0], y + pT[1], w, h);
    if (offen && px > 10) { g.strokeStyle = "rgba(200,170,100,0.7)"; g.lineWidth = Math.max(0.008, 0.8 / px); g.beginPath(); const r = zufall(3); for (let i = 0; i < 20; i++) { const xx = x + r() * w, yy = y + h - r() * 0.12; g.moveTo(xx, yy); g.lineTo(xx + (r() - 0.5) * 0.1, yy - r() * 0.04); } g.stroke(); }
    g.restore();
    if (!Z.klappe) return;
    const c = [124, 98, 72];
    if (!offen) {
      const sv = F.schatten(0.04);
      if (sv) { g.fillStyle = "rgba(16,10,8,0.35)"; g.fillRect(x + sv[0], y + sv[1], w, h - 0.06); }
      bretterMalen(g, F, x, y, w, h - 0.06, c, 7, 0.14, true, true);
      for (const yy of [y + 0.08, y + h - 0.2]) langband(g, x + 0.02, yy, w * 0.7, 0.04, false);
    } else {
      /* hochgeklappt: man sieht die Unterkante als schmalen Streifen über der Öffnung */
      const sv = F.schatten(0.4);
      if (sv) { g.fillStyle = "rgba(16,10,8,0.3)"; g.fillRect(x + sv[0] * 0.5, y - 0.02 + sv[1] * 0.3, w, 0.2); }
      bretterMalen(g, F, x, y - 0.2, w, 0.16, hell(c, -0.2), 9, 0.14, true, true);
      g.fillStyle = "rgba(16,10,8,0.4)"; g.fillRect(x, y - 0.06, w, 0.02);
    }
  }
  /* Stalllaterne über der Tür */
  function lampeMalen(g, F, x, y, an) {
    g.strokeStyle = "rgb(40,38,36)"; g.lineWidth = 0.022;
    g.beginPath(); g.moveTo(x, y - 0.18); g.lineTo(x, y - 0.05); g.moveTo(x - 0.08, y - 0.18); g.lineTo(x + 0.08, y - 0.18); g.stroke();
    g.fillStyle = "rgb(56,54,50)"; g.beginPath(); g.moveTo(x - 0.14, y + 0.02); g.lineTo(x, y - 0.06); g.lineTo(x + 0.14, y + 0.02); g.closePath(); g.fill();
    g.fillStyle = an ? "rgb(255,222,150)" : "rgb(200,204,196)"; g.beginPath(); g.ellipse(x, y + 0.07, 0.05, 0.07, 0, 0, TAU); g.fill();
  }

  /* ---------------- Traufgesims: Deutsches Band und Rollschicht ---------------- */
  function traufGesims(g, F, w) {
    const px = F.px;
    const sv = F.schatten(0.04);
    /* Rollschicht ganz oben */
    g.fillStyle = rgb([140, 58, 42]); g.fillRect(-0.02, 0, w + 0.04, 0.11);
    if (px * 0.075 > 2.5) { g.fillStyle = rgb(FUGE, 0.8); for (let a = 0.075; a < w; a += 0.075) g.fillRect(a - 0.005, 0, 0.01, 0.11); }
    g.fillStyle = rgb(FUGE); g.fillRect(-0.02, 0.11, w + 0.04, 0.012);
    /* Deutsches Band: übereck gestellte Ziegel (Sägezahn mit Schatten) */
    const y0 = 0.122 + ZH, y1 = y0 + ZH;
    if (px * ZH > 2) {
      g.fillStyle = "rgb(60,30,24)"; g.fillRect(-0.02, y0, w + 0.04, ZH);
      const rng = zufall(5);
      for (let a = 0; a < w; a += 0.12) {
        g.fillStyle = rgb(ZIEGEL_T[(rng() * ZIEGEL_T.length) | 0]);
        g.beginPath(); g.moveTo(a, y0); g.lineTo(a + 0.12, y0); g.lineTo(a + 0.06, y1); g.closePath(); g.fill();
        g.fillStyle = "rgba(255,220,190,0.2)"; g.beginPath(); g.moveTo(a, y0); g.lineTo(a + 0.06, y0); g.lineTo(a + 0.03, y0 + ZH / 2); g.closePath(); g.fill();
      }
      if (sv) { g.fillStyle = "rgba(20,10,8,0.3)"; g.fillRect(-0.02, y1, w + 0.04, Math.max(0.015, sv[1] * 0.5)); }
    } else { g.fillStyle = "rgb(110,48,36)"; g.fillRect(-0.02, y0, w + 0.04, ZH); }
  }

  /* ---------------- Wandmaler ---------------- */
  function wandMaler(name, zTop, Z, S) {
    return function (g, F) {
      const w = F.w, H = F.h, yZ = (z) => zTop - z, B = blickAus(F), saat = S.saat + name.length * 7;
      ziegelMalen(g, F, -0.02, 0, w + 0.04, H, saat, {});
      if (zTop < ZT - 0.001) { g.fillStyle = "rgba(120,116,108,0.5)"; g.fillRect(-0.1, 0, w + 0.2, 0.025); }   // frischer Mörtel
      for (const o of OEFF[name]) {
        if (o.z0 >= zTop - 0.02) continue;
        const x = o.a0, ow = o.a1 - o.a0, z1 = Math.min(o.z1, zTop), y = yZ(z1), h = z1 - o.z0, fertig = z1 >= o.z1;
        if (o.art === "fenster") {
          if (fertig) { eisenFenster(g, F, B, x, y, ow, h, o.s, Z, saat + x * 10); rollBogen(g, F, x, y, ow, o.s, saat + x * 10); }
          else { g.fillStyle = "rgb(24,20,18)"; g.fillRect(x, y, ow, h); }
          if (o.z0 < zTop) sohlbank(g, F, x, yZ(o.z0), ow);
        } else if (o.art === "tuer") {
          g.save(); bogenPfad(g, x, y, ow, h, fertig ? o.s : 0); g.clip();
          brettTuer(g, F, B, x, y - 0.02, ow, h + 0.02, { roh: !Z.tuer, farbe: S.tuer, saat: saat + 3, tiefe: 0.16, mitte: true, laibung: [150, 70, 50] });
          g.restore();
          if (fertig) rollBogen(g, F, x, y, ow, o.s, saat + x * 10);
        } else klappeMalen(g, F, B, x, y, ow, h, Z, o.offen);
      }
      if (zTop >= ZT - 0.001 && (name === "sued" || name === "nord")) traufGesims(g, F, w);
      if (Z.fertig && name === "sued") lampeMalen(g, F, 4.28, yZ(2.12), F.nacht > 0.3);
      /* Schmutz und Spritzwasser unten, im Auslauf mehr */
      const hs = name === "sued" ? 0.75 : 0.45;
      const gu = g.createLinearGradient(0, H - hs, 0, H);
      gu.addColorStop(0, "rgba(60,44,30,0)"); gu.addColorStop(1, "rgba(60,44,30," + (name === "sued" ? 0.55 : 0.3) + ")");
      g.fillStyle = gu; g.fillRect(-0.05, H - hs, w + 0.1, hs);
      if (name === "sued" && Z.fertig && F.px > 6) tonFlecken(g, 0, H - 0.5, w, 0.5, 0.5, 0.4, saat + 9, "#4a3624");
      if (Z.dach && (name === "sued" || name === "nord")) {
        const gr = g.createLinearGradient(0, 0, 0, 0.55);
        gr.addColorStop(0, "rgba(20,20,34,0.38)"); gr.addColorStop(1, "rgba(20,20,34,0)");
        g.fillStyle = gr; g.fillRect(-0.1, 0, w + 0.2, 0.55);
      }
      if (F.jahr === "herbst" && Z.fertig) { g.save(); g.beginPath(); g.rect(-0.1, H - 0.3, w + 0.2, 0.32); g.clip(); laubMalen(g, F, 0, H - 0.12, w, 0.13, saat + 3, 2, H); g.restore(); }
      if (F.jahr === "winter" && Z.fertig) {
        const frei = OEFF[name].filter((o) => o.art !== "fenster").map((o) => [o.a0 - 0.15, o.a1 + 0.15]);
        weheMalen(g, F, w, H, saat + 9, frei, 0.9);
        for (const o of OEFF[name]) if (o.art === "fenster") { g.fillStyle = "rgb(242,246,252)"; PI.rundRechteck(g, o.a0 - 0.06, yZ(o.z0) - 0.03, o.a1 - o.a0 + 0.12, 0.045, 0.015); g.fill(); }
      }
      const ge = g.createLinearGradient(0, 0, 0.3, 0); ge.addColorStop(0, "rgba(30,20,16,0.18)"); ge.addColorStop(1, "rgba(30,20,16,0)");
      g.fillStyle = ge; g.fillRect(0, 0, 0.3, H);
      const ge2 = g.createLinearGradient(w, 0, w - 0.3, 0); ge2.addColorStop(0, "rgba(30,20,16,0.18)"); ge2.addColorStop(1, "rgba(30,20,16,0)");
      g.fillStyle = ge2; g.fillRect(w - 0.3, 0, 0.3, H);
    };
  }
  function wandLeuchten(name, zTop) {
    return function (g, F) {
      const B = blickAus(F), yZ = (z) => zTop - z;
      for (const o of OEFF[name]) if (o.art === "fenster") eisenFensterLicht(g, F, B, o.a0, yZ(o.z1), o.a1 - o.a0, o.z1 - o.z0, o.s);
      if (name === "sued") { lampeMalen(g, F, 4.28, yZ(2.12), true); F.leuchtPunkt(4.28, yZ(2.05), 1.6, "255,200,120", 0.95, true); }
    };
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  ST.modell("schweinestall", {
    name: "Schweinestall", gruppe: "Häuser", grund: [9, 11], hoehe: 6, bauzeit: 10 * 60,
    bauen(M0, o) {
      /* im eigenen Achsenkreuz bauen, dann drehen: der Auslauf liegt im Osten */
      const M = drehBauer(M0, -90);
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      const Z = zustand(bau);
      const saat = ((o.saat || 7) >>> 0) % 100000;
      const winter = o.jahr === "winter";
      const S = { saat: saat, winter: winter, jahr: o.jahr, tuer: TUERFARBEN[saat % TUERFARBEN.length] };
      if (Z.grube || Z.aushub > 0.02) {
        const b = 0.6, e = 0.1;
        if (Z.grube) grubeBauen(M, Z.grube, [SX0, SY0, SX1, SY1], 0.8, [[SX0 - e, SY1 - b + e, SX1 + e, SY1 + e], [SX0 - e, SY0 - e, SX1 + e, SY0 + b - e], [SX0 - e, SY0 + b - e, SX0 + b - e, SY1 - b + e], [SX1 - b + e, SY0 + b - e, SX1 + e, SY1 - b + e]], winter, saat);
        if (Z.aushub > 0.02) { M.teil("aushub", { mitte: [0.5, 2.6, 0.4] }); M.figur({ x: 0.5, y: 2.6, z: 0, breite: 3.4, hoehe: 1.0, malen: aushubFigur(Z.aushub, winter) }); }
      }
      if (Z.sockel > 0) sockelBauen(M, Z, S);
      if (Z.waende > 0) waendeBauen(M, Z, S);
      if (Z.giebel > 0) giebelBauen(M, Z, S);
      if (Z.sparren > 0 && !Z.dach) sparrenBauen(M, Z, S);
      if (Z.dach) dachBauen(M, Z, S);
      if (Z.schlote > 0) schloteBauen(M, Z, S);
      if (Z.pfosten > 0) zaunBauen(M, Z, S);
      if (Z.boden > 0) auslaufBauen(M, Z, S);
      if (Z.trog) trogBauen(M, Z, S);
      if (Z.pfahl) pfahlBauen(M, Z, S);
      if (Z.stroh > 0) strohBauen(M, Z, S);
      if (Z.fertig) {
        M.bodenlicht(SX0 + 3.5, SY1 + 1.0, 2.0, "255,196,120", 0.6);
        M.bodenlicht(SX0 + 2.0, SY1 + 0.5, 1.0, "255,190,110", 0.22);
      }
    }
  });

  /* ---------------- Feldsteinsockel ---------------- */
  function sockelBauen(M, Z, S) {
    const winter = S.winter && Z.fertig;
    const h = ZS * Z.sockel;
    if (h < 0.01) return;
    M.teil("sockel", { mitte: [STALL_M[0], STALL_M[1], 0.1] });
    const stein = (sa) => (g, F) => bruchsteinMalen(g, F, 0, 0, F.w, F.h, { saat: S.saat + sa, bis: F.h, klein: 0.7 });
    const top = (g, F) => {
      if (Z.waende <= 0) { betonMalen(g, F, F.w, F.h, S.saat + 21, Z.sockel < 1); g.fillStyle = "rgba(60,58,54,0.35)"; g.fillRect(0, F.h * 0.55, F.w, 0.3); return; }
      g.fillStyle = "rgb(150,146,138)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); rausch(g, 0, 0, F.w, F.h, 1.2, 0.3, 5, 3);
      if (!Z.dach) { betonMalen(g, F, F.w, F.h, S.saat + 22, false); g.fillStyle = "rgba(60,58,54,0.35)"; g.fillRect(0, F.h * 0.55, F.w, 0.3); }
    };
    const e = 0.05;
    kiste(M, SX0 - e, SY0 - e, 0, SX1 + e, SY1 + e, h, { s: stein(1), n: stein(2), o: stein(3), w: stein(4), t: top }, { name: "sockel" });
    void winter;
    /* Rampen vor den Klappen und Stufen vor den Türen (Beton) */
    if (Z.klappe) {
      M.teil("rampen", { mitte: [STALL_M[0], SY1 + 0.3, 0.1] });
      const bet = (g, F) => { betonMalen(g, F, F.w, F.h, 41, false); g.fillStyle = "rgba(60,44,30,0.35)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); if (F.jahr === "winter" && Z.fertig && F.h > 0.3) tonFlecken(g, 0, 0, F.w, F.h, 0.5, 0.6, 3, "#e8eef6", true); };
      for (const o of OEFF.sued) if (o.art !== "fenster") kiste(M, SX0 + o.a0 - 0.12, SY1 + e, 0, SX0 + o.a1 + 0.12, SY1 + 0.45, ZS - 0.02, { s: bet, o: bet, w: bet, t: bet }, { name: "rampe" + o.a0 });
      const t = OEFF.ost[0];
      M.teil("stufe-o", { mitte: [SX1 + 0.3, SY1 - (t.a0 + t.a1) / 2, 0.1] });
      kiste(M, SX1 + e, SY1 - t.a1 - 0.12, 0, SX1 + 0.45, SY1 - t.a0 + 0.12, ZS - 0.02, { s: bet, n: bet, o: bet, t: bet }, { name: "stufe-o" });
    }
  }
  /* ---------------- Ziegelwände ---------------- */
  function waendeBauen(M, Z, S) {
    const n = Math.round(Z.waende * 32), zW = ZS + n * ZH;
    if (zW < ZS + 0.01) return;
    M.teil("stall", { mitte: STALL_M });
    const ex = (name) => ({ name: "w-" + name, ao: true, beidseitig: !Z.dach, leuchten: Z.fertig ? wandLeuchten(name, zW) : null });
    wand(M, [SX0, SY1, zW], [0, 1, 0], SX1 - SX0, zW - ZS, wandMaler("sued", zW, Z, S), ex("sued"));
    wand(M, [SX1, SY0, zW], [0, -1, 0], SX1 - SX0, zW - ZS, wandMaler("nord", zW, Z, S), ex("nord"));
    wand(M, [SX1, SY1, zW], [1, 0, 0], SY1 - SY0, zW - ZS, wandMaler("ost", zW, Z, S), ex("ost"));
    wand(M, [SX0, SY0, zW], [-1, 0, 0], SY1 - SY0, zW - ZS, wandMaler("west", zW, Z, S), ex("west"));
  }
  /* ---------------- Giebel mit Eulenloch und Lüftungsgitter ---------------- */
  function giebelBauen(M, Z, S) {
    const zO = (y) => zDach(y) - 0.2;
    const voll = zO(YM) - ZT;
    const zTop = ZT + Math.round(voll * Z.giebel / ZH) * ZH;
    if (zTop < ZT + 0.01) return;
    const mal = (sa) => (g, F) => {
      const w = F.w, h = F.h;
      ziegelMalen(g, F, -0.02, 0, w + 0.04, h, S.saat + sa, {});
      if (Z.giebel < 1) return;
      const yA = h - voll;                     // Spitze in Flächenkoordinaten
      /* Lüftungsgitter: Raute aus ausgesparten Steinen */
      const cx = w / 2, cy = yA + voll * 0.55;
      g.fillStyle = "rgb(22,16,14)";
      for (let r = -3; r <= 3; r++) {
        const n = 3 - Math.abs(r);
        for (let k = -n; k <= n; k += 2) g.fillRect(cx + k * ZL / 2 - ZL * 0.22, cy + r * ZH * 2 - ZH * 0.45, ZL * 0.44, ZH * 0.9);
      }
      /* Eulenloch: kleines Dreieck unter der Spitze */
      g.beginPath(); g.moveTo(cx, yA + 0.32); g.lineTo(cx + 0.16, yA + 0.56); g.lineTo(cx - 0.16, yA + 0.56); g.closePath(); g.fill();
      /* Ortgang: Mörtelband mit Schatten unter den Pfannen */
      const gr = g.createLinearGradient(0, yA, 0, yA + 0.5);
      gr.addColorStop(0, "rgba(20,20,34,0.35)"); gr.addColorStop(1, "rgba(20,20,34,0)");
      g.fillStyle = gr; g.fillRect(-0.1, yA, w + 0.2, 0.5);
      if (F.jahr === "herbst" && Z.fertig) { g.fillStyle = "rgba(90,98,60,0.35)"; g.fillRect(0, h - 0.06, w, 0.06); }
    };
    M.teil("giebel", { mitte: [STALL_M[0], YM, ZT + 0.9] });
    for (const [x, n, u, sa] of [[SX1, [1, 0, 0], [0, -1, 0], 5], [SX0, [-1, 0, 0], [0, 1, 0], 9]]) {
      const pts = unterZ([[x, SY1, ZT], [x, YM, zO(YM)], [x, SY0, ZT]], zTop);
      if (pts.length < 3) continue;
      vieleck(M, "giebel" + sa, pts, n, u, mal(sa), { beidseitig: !Z.dach });
    }
  }
  /* ---------------- Sparren (Rohbau) ---------------- */
  function sparrenBauen(M, Z, S) {
    const hz = () => (g, F) => holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, EICHE_ROH, 13, false);
    const n = 8, k = Math.max(1, Math.round(n * Z.sparren));
    for (let i = 0; i < k; i++) {
      const x = SX0 - UEG + 0.12 + (SX1 - SX0 + 2 * UEG - 0.24) * i / (n - 1);
      M.teil("sparren" + i, { mitte: [x, YM, ZT + 1.5] });
      for (const s of [1, -1]) {
        const yE = YM + s * ((SY1 - SY0) / 2 + UET);
        balken3(M, [x, YM, zDach(YM) - 0.1], [x, yE, zDach(yE) - 0.1], [1, 0, 0], 0.08, 0.14, hz, { name: "sp" + i + s });
      }
      if (i % 2 === 0) balken3(M, [x, YM - 1.2, zDach(YM - 1.2) - 0.2], [x, YM + 1.2, zDach(YM + 1.2) - 0.2], [1, 0, 0], 0.06, 0.14, hz, { name: "kehl" + i });
    }
  }
  /* ---------------- Dach: Hohlpfannen ---------------- */
  function dachBauen(M, Z, S) {
    const winter = S.winter && Z.fertig, herbst = S.jahr === "herbst" && Z.fertig;
    M.teil("dach", { mitte: [STALL_M[0], YM, 8] });
    const lang = ((SY1 - SY0) / 2 + UET) / Math.cos(NEIG);
    const rTotal = Math.ceil(lang / PF_R), reihen = Z.ziegel >= 1 ? null : Z.ziegel * rTotal;
    const mal = (seite) => (g, F) => {
      const nord = seite ? 0.6 : 0.1;
      if (reihen != null) {
        lattungMalen(g, F, 0, F.w, F.h);
        if (reihen > 0) pfannenMalen(g, F, -0.05, F.w + 0.05, F.h, 0, S.saat + seite, { bisReihe: Math.floor(reihen), teilReihe: reihen - Math.floor(reihen), nord: nord });
        return;
      }
      if (winter) dachSchnee(g, F, -0.05, F.w + 0.05, F.h, 0, S.saat + seite, { oben: seite ? 0 : 0.18, nord: nord });
      else { pfannenMalen(g, F, -0.05, F.w + 0.05, F.h, 0, S.saat + seite, { nord: nord, welt: seite * 17, laub: herbst }); firstBand(g, F, [-0.05, -0.02], [F.w + 0.05, -0.02], false); }
    };
    const traufe = (g, F) => {
      /* Traufbohle mit Zinkrinne */
      holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [96, 76, 58], 7, false);
      if (Z.alt) {
        const gr = g.createLinearGradient(0, F.h * 0.35, 0, F.h);
        gr.addColorStop(0, "rgb(150,156,158)"); gr.addColorStop(0.45, "rgb(196,200,202)"); gr.addColorStop(1, "rgb(110,114,116)");
        g.fillStyle = gr; g.fillRect(-0.02, F.h * 0.35, F.w + 0.04, F.h * 0.65);
        rausch(g, 0, F.h * 0.35, F.w, F.h * 0.65, 1.4, 0.25, 9, 3);
      }
      if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.06); }
    };
    const ort = (g, F) => {
      g.fillStyle = "rgb(178,170,156)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      rausch(g, 0, 0, F.w, F.h, 0.8, 0.35, 4, 3);
      const um = F.flaeche.umriss;
      g.strokeStyle = rgb(hell(PFANNE, -0.1)); g.lineWidth = 0.09; g.lineJoin = "round";
      g.beginPath(); g.moveTo(um[0][0], um[0][1] + 0.04); g.lineTo(um[1][0], um[1][1] + 0.04); g.lineTo(um[2][0], um[2][1] + 0.04); g.stroke();
      if (winter) { g.strokeStyle = "rgb(242,246,252)"; g.lineWidth = 0.1; g.beginPath(); g.moveTo(um[0][0], um[0][1]); g.lineTo(um[1][0], um[1][1]); g.lineTo(um[2][0], um[2][1]); g.stroke(); }
    };
    const d = M.satteldach({ x: SX0, y: SY0, b: SX1 - SX0, t: SY1 - SY0, z: ZD, hf: HF, ueT: UET, ueG: UEG, dicke: 0.2 }, mal(0), mal(1), { kante: "#6a3a28", traufeMalen: traufe, ortMalen: ort, lichtExtra: winter ? 0.05 : 0 });
    if (winter) {
      const xm0 = d.xm0, xm1 = d.xm1;
      M.teil("zapfen", { schatten: false, mitte: [STALL_M[0], d.yE1 + 4, 8.2] });
      M.flaeche({ name: "zapfen-s", o: [xm0, d.yE1 + 0.02, d.zE - 0.2], u: [1, 0, 0], v: [0, 0, -1], w: xm1 - xm0, h: 0.45, keinLicht: true, keinAo: true, malen: zapfenMal(S.saat + 3, 0.35) });
      M.flaeche({ name: "wechte-s", o: [xm0 - 0.02, d.yE1 + 0.03, d.zE + 0.17], u: [1, 0, 0], v: [0, 0, -1], w: xm1 - xm0 + 0.04, h: 0.32, keinLicht: true, keinAo: true, malen: wechteMal(S.saat + 5, [0, Math.sin(NEIG), Math.cos(NEIG)]) });
      M.teil("zapfen-n", { schatten: false, mitte: [STALL_M[0], d.yE0 - 4, 8.2] });
      M.flaeche({ name: "zapfen-n", o: [xm1, d.yE0 - 0.02, d.zE - 0.2], u: [-1, 0, 0], v: [0, 0, -1], w: xm1 - xm0, h: 0.45, keinLicht: true, keinAo: true, malen: zapfenMal(S.saat + 7, 0.3) });
      M.flaeche({ name: "wechte-n", o: [xm1 + 0.02, d.yE0 - 0.03, d.zE + 0.17], u: [-1, 0, 0], v: [0, 0, -1], w: xm1 - xm0 + 0.04, h: 0.32, keinLicht: true, keinAo: true, malen: wechteMal(S.saat + 9, [0, -Math.sin(NEIG), Math.cos(NEIG)]) });
    }
  }
  /* ---------------- Lüftungsschlote auf dem First ---------------- */
  function schloteBauen(M, Z, S) {
    const winter = S.winter && Z.fertig, b = 0.24, zF = ZD + HF;
    const zTop = zF + 0.05 + 0.5 * Z.schlote;
    const holz = [150, 136, 116];
    SCHLOTE.forEach((x, i) => {
      M.teil("schlot" + i, { mitte: [x, YM, 9 + i * 0.01] });
      const lam = (sa) => (g, F) => {
        bretterMalen(g, F, -0.05, -0.05, F.w + 0.1, F.h + 0.1, holz, sa, 0.12, true, true);
        const ly0 = 0.06, ly1 = Math.min(F.h - 0.2, 0.42);
        if (ly1 > ly0 + 0.1 && Z.schlote >= 1) {
          g.fillStyle = "rgb(18,14,12)"; g.fillRect(0.04, ly0, F.w - 0.08, ly1 - ly0);
          for (let y = ly0 + 0.01; y < ly1; y += 0.07) { g.fillStyle = rgb(hell(holz, 0.08)); g.fillRect(0.04, y, F.w - 0.08, 0.045); g.fillStyle = "rgba(0,0,0,0.3)"; g.fillRect(0.04, y + 0.035, F.w - 0.08, 0.01); }
        }
      };
      const zb = zDach(YM + b);
      wand(M, [x - b, YM + b, zTop], [0, 1, 0], 2 * b, zTop - zb, lam(31 + i), { name: "sl-s" + i, ao: true });
      wand(M, [x + b, YM - b, zTop], [0, -1, 0], 2 * b, zTop - zb, lam(33 + i), { name: "sl-n" + i, ao: true });
      vieleck(M, "sl-o" + i, [[x + b, YM + b, zTop], [x + b, YM - b, zTop], [x + b, YM - b, zb], [x + b, YM, zF], [x + b, YM + b, zb]], [1, 0, 0], [0, -1, 0], lam(35 + i));
      vieleck(M, "sl-w" + i, [[x - b, YM - b, zTop], [x - b, YM + b, zTop], [x - b, YM + b, zb], [x - b, YM, zF], [x - b, YM - b, zb]], [-1, 0, 0], [0, 1, 0], lam(37 + i));
      if (Z.schlote < 1) return;
      /* Hütchen: kleines Satteldach aus Brettern */
      const ue = 0.1, zr = zTop + 0.2, zt = zTop - 0.02;
      const dm = (g, F) => { bretterMalen(g, F, -0.05, -0.05, F.w + 0.1, F.h + 0.1, [70, 64, 58], 41 + i, 0.1, false, true); if (winter) schneeFlaeche(g, F, 0, 0, F.w, F.h, 7, {}); };
      for (const s of [1, -1]) {
        const y = YM + s * (b + ue);
        vieleck(M, "slh" + s + i, [[x - b - ue, YM, zr], [x + b + ue, YM, zr], [x + b + ue, y, zt], [x - b - ue, y, zt]], [0, s * (zr - zt) / (b + ue), 1], [1, 0, 0], dm);
      }
      for (const s of [1, -1]) vieleck(M, "slg" + s + i, [[x + s * b, YM - b - ue, zt], [x + s * b, YM, zr], [x + s * b, YM + b + ue, zt]], [s, 0, 0], [0, -s, 0], (g, F) => holzMalen(g, F, -0.05, -0.05, F.w + 0.1, F.h + 0.1, holz, 3, false));
    });
  }

  /* =====================================================================
     AUSLAUF: Bretterzaun, Lehmboden, Suhle, Trog, Scheuerpfahl
     ===================================================================== */
  const PFOSTEN = [[AX0, AY0], [AX0, (AY0 + AY1) / 2], [AX0, AY1], [-3.6, AY1], [-2.3, AY1], [TOR[0], AY1], [TOR[1], AY1], [1.4, AY1], [AX1, AY1], [AX1, (AY0 + AY1) / 2], [AX1, AY0], [SX1 + 0.1, AY0]];
  const FELDER = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6, "tor"], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11]];
  function zaunBauen(M, Z, S) {
    const winter = S.winter && Z.fertig;
    const holz = Z.alt ? [126, 108, 88] : [188, 152, 108];
    const hz = (i) => () => (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, PI.streu(holz, zufall(i), 0.06), 40 + i, F.h > F.w); g.fillStyle = "rgba(40,30,20,0.35)"; g.fillRect(-0.02, F.h - 0.3, F.w + 0.04, 0.3); };
    const n = Math.ceil(PFOSTEN.length * Z.pfosten);
    PFOSTEN.slice(0, n).forEach(([x, y], i) => {
      M.teil("pfosten" + i, { mitte: [x, y, 0.6] });
      balken3(M, [x, y, 0], [x, y, ZZ + 0.1], [1, 0, 0], 0.12, 0.12, hz(i), { name: "pf" + i, seiten: "QqRre" });
      if (winter) M.flaeche({ name: "pfs" + i, o: [x - 0.06, y - 0.06, ZZ + 0.11], u: [1, 0, 0], v: [0, 1, 0], w: 0.12, h: 0.12, malen: schneeOben("#eef2f8") });
    });
    if (Z.bretter <= 0) return;
    const nf = Math.ceil(FELDER.length * Z.bretter);
    FELDER.slice(0, nf).forEach(([i, j, tor], k) => {
      const p = PFOSTEN[i], q = PFOSTEN[j];
      const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), u = [dx / L, dy / L, 0];
      M.teil("bretter" + k, { schatten: false, mitte: [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, 0.55] });
      M.flaeche({ name: "zf" + k, o: [p[0] + u[0] * 0.06, p[1] + u[1] * 0.06, ZZ], u: u, v: [0, 0, -1], w: L - 0.12, h: ZZ - 0.04, beidseitig: true, keinLicht: true, keinAo: true, malen: (g, F) => {
        const Lt = belichter2(F, 0.03), w = F.w, h = F.h, rng = zufall(S.saat + k * 7);
        const brett = (y, b) => {
          const c = PI.streu(holz, rng, 0.07);
          g.fillStyle = Lt(c); g.fillRect(-0.02, y, w + 0.04, b);
          if (F.px > 10) { g.fillStyle = Lt(hell(c, 0.15), 0.8); g.fillRect(-0.02, y, w + 0.04, 0.012); g.fillStyle = Lt(hell(c, -0.3), 0.8); g.fillRect(-0.02, y + b - 0.012, w + 0.04, 0.012); }
          if (F.px > 16) { g.fillStyle = Lt([40, 34, 30], 0.9); g.beginPath(); for (const x of [0.04, w - 0.04]) for (const yy of [y + b * 0.3, y + b * 0.7]) { g.moveTo(x + 0.008, yy); g.arc(x, yy, 0.008, 0, TAU); } g.fill(); }
          if (F.jahr === "winter" && Z.fertig) { g.fillStyle = Lt([246, 249, 253]); PI.rundRechteck(g, -0.02, y - 0.03, w + 0.04, 0.04, 0.015); g.fill(); }
        };
        if (tor) {
          /* Tor: Bretter dichter, Z-Strebe, Bänder, Riegel */
          for (const y of [0.0, 0.3, 0.6, h - 0.16]) brett(y, 0.15);
          g.strokeStyle = Lt(hell(holz, -0.12)); g.lineWidth = 0.1; g.beginPath(); g.moveTo(0.08, h - 0.12); g.lineTo(w - 0.08, 0.12); g.stroke();
          g.fillStyle = Lt([46, 44, 42]); g.fillRect(-0.02, 0.05, 0.22, 0.03); g.fillRect(-0.02, h - 0.1, 0.22, 0.03); g.fillRect(w - 0.2, h * 0.45, 0.24, 0.035);
        } else for (const y of [0.0, 0.33, 0.66, h - 0.18]) brett(y, 0.16);
        /* unten Matsch an den Brettern */
        if (!(F.jahr === "winter") && Z.fertig) { const gu = g.createLinearGradient(0, h - 0.3, 0, h); gu.addColorStop(0, "rgba(60,44,30,0)"); gu.addColorStop(1, "rgba(60,44,30,0.6)"); g.save(); g.globalCompositeOperation = "source-atop"; g.fillStyle = gu; g.fillRect(-0.05, h - 0.3, w + 0.1, 0.3); g.restore(); }
      } });
    });
  }
  /* Lehmboden des Auslaufs mit der Suhle (durchsichtiger Rand, selbst belichtet) */
  function auslaufBauen(M, Z, S) {
    M.teil("auslauf", { ebene: -3, schatten: false, mitte: [(AX0 + AX1) / 2, (AY0 + AY1) / 2, 0] });
    const x0 = AX0 + 0.05, y0 = AY0 + 0.02, w = AX1 - AX0 - 0.1, h = AY1 - AY0 - 0.06;
    const SU = { x: 0.95 - x0, y: 3.0 - y0, rx: 1.3, ry: 0.78 };
    M.flaeche({ name: "auslauf", o: [x0, y0, 0.012], u: [1, 0, 0], v: [0, 1, 0], w: w, h: h, keinLicht: true, keinAo: true, malen: (g, F) => {
      const winter = F.jahr === "winter", px = F.px;
      const lf = ST.lichtFaktor([0, 0, 1], F.zeit, 0, F.jahr);
      const lit = (c, a) => rgb([c[0] * lf[0], c[1] * lf[1], c[2] * lf[2]], a);
      const litH = (c) => "#" + c.map((v, i) => ("0" + Math.round(Math.min(255, v * lf[i])).toString(16)).slice(-2)).join("");
      const k = Z.boden;
      /* Maske: zum Rand hin weich (unter dem Zaun wächst noch Gras) */
      g.fillStyle = "rgba(255,255,255," + (0.95 * k).toFixed(3) + ")";
      g.fillRect(0.12, 0.0, w - 0.24, h - 0.12);
      g.globalCompositeOperation = "source-in";
      g.fillStyle = lit(winter ? [204, 210, 220] : [104, 82, 58]); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
      g.globalCompositeOperation = "source-atop";
      tonFlecken(g, 0, 0, w, h, 1.2, 0.6, 3, litH(winter ? [168, 178, 196] : [74, 56, 38]));
      tonFlecken(g, 0, 0, w, h, 0.8, 0.45, 5, litH(winter ? [240, 244, 250] : [140, 112, 80]), true);
      if (winter) tonFlecken(g, 0, 0, w, h, 0.9, 0.55, 11, litH([110, 92, 72]));
      /* Stroh vor der Tür, Wühlstellen, Klauenabdrücke */
      if (px > 8) {
        const r = zufall(S.saat + 31);
        const tx = SX0 + 3.5 - x0;
        g.strokeStyle = lit(winter ? [190, 170, 120] : [214, 182, 108], 0.85); g.lineWidth = Math.max(0.01, 0.9 / px);
        g.beginPath(); for (let i = 0; i < 260; i++) { const a = r() * TAU, d = Math.pow(r(), 0.8) * 1.3, x = tx + Math.cos(a) * d * 1.3, y = 0.4 + Math.abs(Math.sin(a)) * d * 0.8, l = 0.06 + r() * 0.1, b = r() * TAU; g.moveTo(x, y); g.lineTo(x + Math.cos(b) * l, y + Math.sin(b) * l); } g.stroke();
        g.fillStyle = lit([46, 34, 24], 0.4);
        g.beginPath(); for (let i = 0; i < 12; i++) { const x = r() * w, y = 0.5 + r() * (h - 0.6), rx = 0.15 + r() * 0.3; g.moveTo(x + rx, y); g.ellipse(x, y, rx, rx * 0.5, r() * 3, 0, TAU); } g.fill();
        if (px > 22) {
          g.fillStyle = lit([40, 28, 20], 0.55);
          g.beginPath(); for (let i = 0; i < 160; i++) { const x = r() * w, y = r() * h, a = r() * 3; for (const s of [-1, 1]) { const xx = x + Math.cos(a + 1.57) * 0.018 * s, yy = y + Math.sin(a + 1.57) * 0.018 * s; g.moveTo(xx + 0.02, yy); g.ellipse(xx, yy, 0.02, 0.012, a, 0, TAU); } } g.fill();
        }
      }
      /* die Suhle */
      const sx = SU.x, sy = SU.y;
      const rand = (sk) => { g.beginPath(); for (let i = 0; i <= 28; i++) { const a = i / 28 * TAU, q = 1 + 0.12 * Math.sin(a * 3 + 1) + 0.07 * Math.sin(a * 5 + 2); const x = sx + Math.cos(a) * SU.rx * q * sk, y = sy + Math.sin(a) * SU.ry * q * sk; if (i) g.lineTo(x, y); else g.moveTo(x, y); } g.closePath(); };
      rand(1.25); g.fillStyle = lit(winter ? [150, 140, 128] : [70, 52, 36], 0.75); g.fill();
      rand(1.0);
      if (winter) {
        const gi = g.createLinearGradient(sx - SU.rx, sy - SU.ry, sx + SU.rx, sy + SU.ry);
        gi.addColorStop(0, lit([196, 210, 224])); gi.addColorStop(0.5, lit([150, 168, 186])); gi.addColorStop(1, lit([200, 214, 228]));
        g.fillStyle = gi; g.fill();
        if (px > 12) { g.save(); rand(1.0); g.clip(); g.strokeStyle = lit([240, 246, 252], 0.7); g.lineWidth = Math.max(0.006, 0.7 / px); g.beginPath(); const r = zufall(7); for (let i = 0; i < 9; i++) { let x = sx + (r() - 0.5) * SU.rx * 2, y = sy + (r() - 0.5) * SU.ry * 2; g.moveTo(x, y); for (let k2 = 0; k2 < 4; k2++) { x += (r() - 0.5) * 0.4; y += (r() - 0.5) * 0.25; g.lineTo(x, y); } } g.stroke(); tonFlecken(g, sx - SU.rx, sy - SU.ry, 2 * SU.rx, 2 * SU.ry, 0.6, 0.6, 3, litH([246, 249, 253]), true); g.restore(); }
      } else {
        /* nasser Schlamm, in der Mitte stehendes Wasser mit Himmelsspiegel */
        g.fillStyle = lit([58, 42, 30]); g.fill();
        g.save(); rand(1.0); g.clip();
        tonFlecken(g, sx - SU.rx * 1.2, sy - SU.ry * 1.2, SU.rx * 2.4, SU.ry * 2.4, 0.5, 0.5, 9, litH([36, 26, 18]));
        const hi = (F.zeit && F.zeit.himmel) || ["#bcd3ea", "#e9f1f8"];
        rand(0.45);
        const gs = g.createLinearGradient(sx - SU.rx, sy - SU.ry, sx + SU.rx * 0.5, sy + SU.ry);
        gs.addColorStop(0, rgb(misch(misch(hex(hi[0]), [52, 42, 32], 0.8), [0, 0, 0], 1 - lf[1]), 0.7)); gs.addColorStop(1, rgb(misch(misch(hex(hi[1] || hi[0]), [48, 38, 28], 0.88), [0, 0, 0], 1 - lf[1]), 0.65));
        g.fillStyle = gs; g.fill();
        if (px > 14) { g.strokeStyle = "rgba(255,255,255,0.25)"; g.lineWidth = Math.max(0.008, 0.8 / px); for (const q of [0.3, 0.45]) { g.beginPath(); g.ellipse(sx + 0.2, sy - 0.05, SU.rx * q, SU.ry * q, 0, 0.2, 2.4); g.stroke(); } }
        g.fillStyle = "rgba(255,255,255,0.14)"; g.beginPath(); g.ellipse(sx - SU.rx * 0.25, sy - SU.ry * 0.25, SU.rx * 0.22, SU.ry * 0.08, -0.2, 0, TAU); g.fill();
        g.restore();
        /* nasser Glanzrand */
        rand(1.0); g.strokeStyle = lit([120, 100, 80], 0.6); g.lineWidth = Math.max(0.02, 1.2 / px); g.stroke();
      }
      if (F.jahr === "herbst") laubMalen(g, F, 0, 0, w, h, 41, 0.35);
      g.globalCompositeOperation = "source-over";
    } });
  }
  /* Betontrog an der Stallwand */
  function trogBauen(M, Z, S) {
    const winter = S.winter && Z.fertig;
    const x0 = -3.65, x1 = -2.25, y0 = AY0 + 0.1, y1 = AY0 + 0.55, z1 = 0.36;
    M.teil("trog", { mitte: [(x0 + x1) / 2, (y0 + y1) / 2, 0.2] });
    const bet = (g, F) => { betonMalen(g, F, F.w, F.h, 51, false); g.fillStyle = "rgba(60,44,30,0.3)"; g.fillRect(-0.05, F.h * 0.5, F.w + 0.1, F.h); };
    kiste(M, x0, y0, 0, x1, y1, z1, { s: bet, o: bet, w: bet, n: bet, t: (g, F) => {
      betonMalen(g, F, F.w, F.h, 52, false);
      const r = 0.07;
      const gi = g.createLinearGradient(0, r, 0, F.h - r);
      if (winter) { gi.addColorStop(0, "rgb(214,222,234)"); gi.addColorStop(1, "rgb(238,242,248)"); }
      else { gi.addColorStop(0, "rgb(40,32,24)"); gi.addColorStop(0.5, "rgb(120,96,62)"); gi.addColorStop(1, "rgb(150,122,80)"); }
      g.fillStyle = gi; PI.rundRechteck(g, r, r, F.w - 2 * r, F.h - 2 * r, 0.08); g.fill();
      if (!winter && F.px > 14) { const rr = zufall(4); g.fillStyle = "rgba(196,170,110,0.8)"; for (let i = 0; i < 60; i++) g.fillRect(r + rr() * (F.w - 2 * r), F.h * 0.4 + rr() * (F.h * 0.5 - r), 0.015, 0.012); }
      for (const a of [F.w / 3, 2 * F.w / 3]) { g.fillStyle = "rgb(150,148,142)"; g.fillRect(a - 0.025, r, 0.05, F.h - 2 * r); }
      if (winter) schneeOben(null)(g, { w: F.w, h: 0.08, jahr: "winter" });
    } }, { name: "trog" });
  }
  /* Scheuerpfahl (glatt gescheuert, unten verschmiert) */
  function pfahlBauen(M, Z, S) {
    const x = -1.9, y = 3.55;
    M.teil("scheuer", { mitte: [x, y, 0.5] });
    rohr(M, [x, y, 0], [x, y, 1.0], 0.11, 8, (i) => (g, F) => {
      holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [112, 92, 72], 60 + i, true);
      const gu = g.createLinearGradient(0, F.h - 0.65, 0, F.h);
      gu.addColorStop(0, "rgba(70,52,36,0)"); gu.addColorStop(0.3, "rgba(70,52,36,0.75)"); gu.addColorStop(1, "rgba(50,36,24,0.9)");
      g.fillStyle = gu; g.fillRect(-0.02, F.h - 0.65, F.w + 0.04, 0.67);
      g.fillStyle = "rgba(255,240,220,0.12)"; g.fillRect(-0.02, F.h - 0.55, F.w + 0.04, 0.25);
    }, () => (g, F) => { hirnholz(g, F, F.w / 2, F.h / 2, F.w / 2, F.h / 2, 3, false, [80, 64, 50]); if (F.jahr === "winter" && Z.fertig) { g.fillStyle = "rgb(240,244,250)"; g.beginPath(); g.ellipse(F.w / 2, F.h / 2, F.w / 2, F.h / 2, 0, 0, TAU); g.fill(); } }, { name: "sp", ohneKappe: -1, ao: true });
  }

  /* =====================================================================
     STROHHAUFEN mit Forke, zwei Ballen
     ===================================================================== */
  function strohMalen(sa, winter, oben) {
    return (g, F) => {
      g.fillStyle = rgb(STROH); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      tonFlecken(g, 0, 0, F.w, F.h, 0.6, 0.45, sa, "#8a6e3c");
      tonFlecken(g, 0, 0, F.w, F.h, 0.9, 0.35, sa + 2, "#e6cc8a", true);
      if (F.px > 10) {
        const r = zufall(sa + 9), n = Math.min(700, F.w * F.h * 160);
        const hell1 = new Path2D(), dunkel = new Path2D();
        for (let i = 0; i < n; i++) { const x = r() * F.w, y = r() * F.h, a = r() * TAU, l = 0.05 + r() * 0.12, p = r() < 0.6 ? hell1 : dunkel; p.moveTo(x, y); p.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); }
        g.lineWidth = Math.max(0.006, 0.8 / F.px); g.lineCap = "round";
        g.strokeStyle = "rgba(246,222,150,0.8)"; g.stroke(hell1);
        g.strokeStyle = "rgba(110,84,40,0.6)"; g.stroke(dunkel);
      }
      const gr = g.createLinearGradient(0, 0, 0, F.h);
      gr.addColorStop(0, "rgba(255,240,200,0.06)"); gr.addColorStop(1, "rgba(60,44,20,0.3)");
      g.fillStyle = gr; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      if (winter && oben) { g.save(); tonFlecken(g, 0, 0, F.w, F.h * 0.75, 0.7, 0.95, sa + 5, "#eef2f8", true); g.restore(); }
    };
  }
  function strohBauen(M, Z, S) {
    const winter = S.winter && Z.fertig;
    const ax0 = 2.7, ax1 = 5.2, ay0 = -3.85, ay1 = -1.45, zH = 1.75 * Z.stroh;
    const ym = (ay0 + ay1) / 2, xk0 = ax0 + 0.95, xk1 = ax1 - 0.95;
    M.teil("stroh", { mitte: [(ax0 + ax1) / 2, ym, 0.6] });
    /* zwei Stufen: steile Flanken unten, flacher Rücken oben – wirkt rund */
    const zSch = zH * 0.55, ein = 0.42;
    const U = [[ax0, ay0, 0], [ax1, ay0, 0], [ax1, ay1, 0], [ax0, ay1, 0]];
    const Sch = [[ax0 + ein, ay0 + ein * 0.8, zSch], [ax1 - ein, ay0 + ein * 0.8, zSch], [ax1 - ein, ay1 - ein * 0.8, zSch], [ax0 + ein, ay1 - ein * 0.8, zSch]];
    const K0 = [xk0, ym, zH], K1 = [xk1, ym, zH], mitte = [(ax0 + ax1) / 2, ym, zH * 0.3];
    const flaeche = (name, pts, sa) => {
      let n = nrm(kreuz(sub(pts[1], pts[0]), sub(pts[2], pts[0])));
      const c = pts.reduce((q, p) => add(q, mul(p, 1 / pts.length)), [0, 0, 0]);
      if (dot(n, sub(c, mitte)) < 0) n = mul(n, -1);
      let u = kreuz(n, Z3); if (Math.hypot(u[0], u[1]) < 1e-3) u = [1, 0, 0];
      vieleck(M, name, pts, n, u, strohMalen(S.saat + sa, winter, true), { ao: true });
    };
    for (let i = 0; i < 4; i++) flaeche("stroh-u" + i, [U[i], U[(i + 1) % 4], Sch[(i + 1) % 4], Sch[i]], i * 2 + 1);
    flaeche("stroh-n", [Sch[0], Sch[1], K1, K0], 11);
    flaeche("stroh-o", [Sch[1], Sch[2], K1], 13);
    flaeche("stroh-s", [Sch[2], Sch[3], K0, K1], 15);
    flaeche("stroh-w", [Sch[3], Sch[0], K0], 17);
    if (Z.stroh >= 1) M.figur({ x: xk0 + 0.4, y: ym + 0.2, z: zH - 0.25, breite: 0.6, hoehe: 1.3, schatten: true, malen: mistgabel });
    if (!Z.ballen) return;
    /* zwei Strohballen an der Stallecke */
    const bal = (stirn) => (g, F) => {
      strohMalen(S.saat + (stirn ? 11 : 13), false, false)(g, F);
      maser(g, 0, 0, F.w, F.h, stirn ? 0.08 : 0.02, stirn ? 0.08 : 0.5, 0.4, 3, false);
      if (!stirn) { g.fillStyle = "rgba(90,70,40,0.6)"; for (const k of [0.3, 0.7]) g.fillRect(F.w * k - 0.01, 0, 0.02, F.h); }
    };
    const top = (g, F) => { bal(false)(g, F); if (winter) schneeOben(null)(g, F); };
    for (const [x, y, z] of [[2.75, -0.95, 0], [2.8, -0.95, 0.38]]) {
      M.teil("ballen" + z, { mitte: [x + 0.45, y, z + 0.2] });
      kiste(M, x, y - 0.24, z, x + 0.9, y + 0.24, z + 0.37, { s: bal(false), n: bal(false), o: bal(true), w: bal(true), t: top }, { name: "ballen" + z });
    }
  }
})();
