/* =====================================================================
   HÜHNERSTALL — kleiner Holzstall mit Pultdach, Nistkasten-Anbau und
   eingezäuntem Auslauf
   ---------------------------------------------------------------------
   XANDER: „richtig filigran. Richtig schön ausarbeiten mit schönen
   Texturen" · „keine Comic Grafik … viel mehr am Realismus" · „ohne
   Pixelkanten und komische Vektorrückstände" · „Man soll das Fundament
   sehen beim Aufbauen".

   VORBILD: Hühnerställe in Bauerngärten und Kleinsiedlungen: ein
   Holzständerbau auf Feldsteinen (die Hühner scharren darunter), außen
   Boden-Deckel-Schalung in Schwedenrot mit weißen Eckbrettern, Pultdach
   mit Dachpappe auf Leisten, die Hühnerklappe mit Schieber und Zugseil,
   davor die Hühnerleiter mit Sprossen. An der Ostseite der Nistkasten-
   Anbau mit aufklappbarem Deckel (Eier holen, ohne in den Stall zu
   müssen). Davor der Auslauf: Rundholzpfähle, Maschendraht, Spanndraht,
   ein kleines Tor; drinnen zerscharrter Boden, Futtertrog und Tränke.

   MASSE (Meter; x Osten, y Süden, Grundrissmitte auf 0,0)
     Stall      3,6 × 2,2 m (x −3,3…0,3, y −3,2…−1,0), Boden auf 0,4 m,
                Wand vorn 2,35 m, hinten 1,85 m, Dach bis rund 2,5 m
     Nistkasten 0,6 × 1,4 m an der Ostwand
     Auslauf    7,4 × 4,3 m, Zaun 1,5 m hoch, Tor 0,9 m
   AUFBAU (o.bau): Punktfundamente aus Feldstein → Schwellen und Dielen →
   Ständer und Rähm → Schalung von unten nach oben → Sparren → Bretter und
   Dachpappe Bahn für Bahn → Nistkasten, Fenster, Tür, Klappe → Pfähle →
   Maschendraht Feld für Feld → Leiter, Trog, Tränke → Hühner.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const hex = PI.hex, rgb = PI.rgb, misch = PI.misch, hell = PI.hell;

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
  function glitzer(g, F, x, y, w, h, dichte, rng) {
    if (F.px <= 40 || F.licht < 0.2) return;
    const k = Math.min(400, Math.round(w * h * dichte));
    g.beginPath();
    for (let i = 0; i < k; i++) { const r = (0.5 + rng() * 0.8) / F.px; g.rect(x + rng() * w, y + rng() * h, r, r); }
    g.fillStyle = "rgba(255,255,255,0.95)"; g.fill();
  }
  /* ---------------- Licht ---------------- */
  /* Licht für durchsichtige, beidseitig sichtbare Flächen (Draht): die
     hellere der beiden Seiten, damit der Zaun von hinten nicht schwarz wird */
  function belichter(F, extra) {
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
  function kiste(M, x0, y0, z0, x1, y1, z1, m, extra) {
    const ex = (name) => Object.assign({}, extra || {}, { name: ((extra && extra.name) || "k") + "-" + name });
    const h = z1 - z0, ao = z0 < 0.05;
    if (m.s) wand(M, [x0, y1, z1], [0, 1, 0], x1 - x0, h, m.s, Object.assign({ ao: ao }, ex("s")));
    if (m.n) wand(M, [x1, y0, z1], [0, -1, 0], x1 - x0, h, m.n, Object.assign({ ao: ao }, ex("n")));
    if (m.o) wand(M, [x1, y1, z1], [1, 0, 0], y1 - y0, h, m.o, Object.assign({ ao: ao }, ex("o")));
    if (m.w) wand(M, [x0, y0, z1], [-1, 0, 0], y1 - y0, h, m.w, Object.assign({ ao: ao }, ex("w")));
    if (m.t) M.flaeche(Object.assign({ o: [x0, y0, z1], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, malen: m.t }, ex("t")));
  }
  function vieleck(M, name, pts, n, u, malen, extra) {
    n = nrm(n); u = nrm(u);
    const v = kreuz(n, u), p0 = pts[0];
    const ab = pts.map((p) => { const d = sub(p, p0); return [dot(d, u), dot(d, v)]; });
    let a0 = Infinity, b0 = Infinity, a1 = -Infinity, b1 = -Infinity;
    for (const [a, b] of ab) { a0 = Math.min(a0, a); b0 = Math.min(b0, b); a1 = Math.max(a1, a); b1 = Math.max(b1, b); }
    const o = add(add(p0, mul(u, a0)), mul(v, b0));
    return M.flaeche(Object.assign({ name: name, o: o, u: u, v: v, w: a1 - a0, h: b1 - b0, umriss: ab.map(([a, b]) => [a - a0, b - b0]), malen: malen }, extra || {}));
  }
  function balken3(M, P0, P1, Q, b, d, mal, opt) {
    opt = opt || {};
    const ax = sub(P1, P0), L = Math.hypot(ax[0], ax[1], ax[2]);
    if (L < 1e-4) return;
    const U = mul(ax, 1 / L);
    Q = nrm(sub(Q, mul(U, dot(Q, U))));
    const R = nrm(kreuz(U, Q)), mid = add(P0, mul(ax, 0.5));
    const rechteck = (c, n, u, w, h, malen, name) => {
      n = nrm(n); u = nrm(u);
      const v = kreuz(n, u);
      M.flaeche({ o: sub(sub(c, mul(u, w / 2)), mul(v, h / 2)), u: u, v: v, w: w, h: h, malen: malen, name: (opt.name || "b") + name, keinAo: true });
    };
    const langU = (n) => { let u = U; if (dot(kreuz(n, u), Z3) > 0) u = mul(U, -1); return u; };
    rechteck(add(mid, mul(Q, b / 2)), Q, langU(Q), L, d, mal(), "Q");
    rechteck(add(mid, mul(Q, -b / 2)), mul(Q, -1), langU(mul(Q, -1)), L, d, mal(), "q");
    rechteck(add(mid, mul(R, d / 2)), R, langU(R), L, b, mal(), "R");
    rechteck(add(mid, mul(R, -d / 2)), mul(R, -1), langU(mul(R, -1)), L, b, mal(), "r");
  }

  /* =====================================================================
     MASSE
     ===================================================================== */
  const SX0 = -3.3, SX1 = 0.3, SY0 = -3.2, SY1 = -1.0;
  const ZB = 0.4, ZSW = 0.25;                      // Dielenboden, Unterkante Schalung
  const ZS = 2.35, ZN = 1.85;                      // Wandhöhe vorn / hinten
  const KD = (ZS - ZN) / (SY1 - SY0);              // Dachneigung (Steigung je Meter)
  const DT = 0.12 * Math.hypot(1, KD);             // Dachstärke senkrecht
  const zU = (y) => ZN + KD * (y - SY0);           // Unterseite des Dachs
  const zO = (y) => zU(y) + DT;                    // Oberfläche (Pappe)
  const DX0 = SX0 - 0.25, DX1 = SX1 + 0.25, DYN = SY0 - 0.25, DYS = SY1 + 0.38;
  const NX1 = SX1 + 0.6, NY0 = -2.8, NY1 = -1.4, NZ0 = 0.55, NZW = 1.38, NZA = 1.18;   // Nistkasten
  const ZH = 1.5;                                  // Zaunhöhe
  const AX0 = -3.7, AX1 = 3.7, AY0 = -1.0, AY1 = 3.3;   // Auslauf
  const TOR = [1.9, 2.8];
  const STALL_M = [(SX0 + SX1) / 2, (SY0 + SY1) / 2, 1.2];
  const OEFF = {
    sued: [{ art: "fenster", a0: 0.4, a1: 1.0, z0: 1.35, z1: 1.85 }, { art: "fenster", a0: 1.3, a1: 1.9, z0: 1.35, z1: 1.85 }, { art: "klappe", a0: 2.45, a1: 2.8, z0: 0.45, z1: 0.85 }],
    west: [{ art: "tuer", a0: 0.85, a1: 1.6, z0: 0.3, z1: 1.95 }],
    nord: [{ art: "luft", a0: 1.6, a1: 2.0, z0: 1.45, z1: 1.65 }],
    ost: []
  };
  const WANDFARBEN = [[150, 50, 36], [150, 50, 36], [96, 106, 88], [138, 112, 82]];   // Schwedenrot, Graugrün, Holz natur
  const WEISS = [236, 232, 222];
  const PAPPE = [70, 74, 70];
  const HOLZ = [150, 118, 82];
  const DRAHT = [150, 158, 152];

  /* =====================================================================
     BAUPHASEN
       0,00–0,12  Löcher für die Punktfundamente, Feldsteine gesetzt
       0,12–0,25  Schwellen, Dielenboden
       0,25–0,40  Ständer, Rähm
       0,40–0,56  Schalung wächst von unten
       0,54–0,62  Sparren; 0,62–0,74 Dachbretter und Dachpappe
       0,74–0,84  Nistkasten, Fenster, Tür, Klappe
       0,82–0,92  Zaunpfähle, dann Maschendraht Feld für Feld
       0,92–1,00  Leiter, Trog, Tränke, Scharrplatz, Hühner
     ===================================================================== */
  function zustand(bau) {
    const f = (a, b) => klemm((bau - a) / (b - a), 0, 1);
    const Z = { bau: bau, fertig: bau >= 0.999 };
    Z.loecher = bau < 0.14 ? f(0.0, 0.06) : 0;
    Z.steine = f(0.05, 0.12);
    Z.boden = f(0.12, 0.25);
    Z.staender = f(0.25, 0.4);
    Z.schalung = f(0.4, 0.56);
    Z.sparren = f(0.54, 0.62);
    Z.dach = bau >= 0.62; Z.pappe = f(0.64, 0.74);
    Z.innen = bau < 0.62;
    Z.nist = f(0.74, 0.78); Z.fenster = bau >= 0.78; Z.tuer = bau >= 0.8; Z.klappe = bau >= 0.82;
    Z.pfaehle = f(0.82, 0.86); Z.draht = f(0.86, 0.92);
    Z.leiter = bau >= 0.92; Z.trog = bau >= 0.94; Z.platz = f(0.94, 0.99); Z.huehner = Z.fertig;
    Z.alt = bau >= 0.8;
    return Z;
  }

  /* =====================================================================
     WERKSTOFFE UND BAUTEILE (in der Fläche)
     ===================================================================== */
  function holzMalen(g, F, x, y, w, h, c, saat, senkrecht) {
    g.fillStyle = rgb(c); g.fillRect(x, y, w, h);
    if (F.px > 9) maser(g, x, y, w, h, 0.03, 1.2, 0.45, saat, senkrecht);
    rausch(g, x, y, w, h, 1.0, 0.2, saat + 3, 3);
  }
  /* Boden-Deckel-Schalung, deckend gestrichen, mit Farbabnutzung */
  function schalungMalen(g, F, x, y, w, h, c, saat) {
    const rng = zufall(saat), px = F.px, bb = 0.2;
    g.fillStyle = rgb(c); g.fillRect(x, y, w, h);
    if (px * bb > 3) for (let xx = x; xx < x + w; xx += bb) { g.fillStyle = rgb(PI.streu(c, rng, 0.05)); g.fillRect(xx, y, bb, h); }
    if (px > 9) maser(g, x, y, w, h, 0.03, 1.4, 0.3, saat, true);
    if (px * 0.05 > 1.2) {
      const sv = F.schatten ? F.schatten(0.022) : null;
      for (let xx = x + bb; xx < x + w; xx += bb) {
        if (sv) { g.fillStyle = "rgba(20,12,10,0.35)"; g.fillRect(xx - 0.025 + sv[0], y, 0.05, h); }
        const gr = g.createLinearGradient(xx - 0.025, 0, xx + 0.025, 0);
        gr.addColorStop(0, rgb(hell(c, 0.12))); gr.addColorStop(0.5, rgb(c)); gr.addColorStop(1, rgb(hell(c, -0.28)));
        g.fillStyle = gr; g.fillRect(xx - 0.025, y, 0.05, h);
      }
    } else if (px * bb > 2.5) { g.fillStyle = rgb(hell(c, -0.3), 0.6); for (let xx = x + bb; xx < x + w; xx += bb) g.fillRect(xx - 0.008, y, 0.016, h); }
    /* Farbe verwittert: helles Holz schimmert durch, unten Spritzwasser */
    if (px > 12) tonFlecken(g, x, y, w, h, 0.9, 0.25, saat + 3, "#a88e6c");
    rausch(g, x, y, w, h, 2.2, 0.2, saat + 5, 4);
    bleich(g, x, y, w, h, 1.8, 0.1, saat + 2);
  }
  /* weißes Brett (Ecke, Rahmen) mit Schatten */
  function weissBrett(g, F, x, y, w, h) {
    const sv = F.schatten ? F.schatten(0.025) : null;
    if (sv) { g.fillStyle = "rgba(20,14,12,0.3)"; g.fillRect(x + sv[0], y + sv[1], w, h); }
    g.fillStyle = rgb(WEISS); g.fillRect(x, y, w, h);
    g.fillStyle = "rgba(120,110,96,0.35)"; g.fillRect(x + w - Math.min(w, h) * 0.2, y, Math.min(w, h) * 0.2, h);
    rausch(g, x, y, w, h, 0.6, 0.18, 9, 3);
  }
  function laubMalen(g, F, x, y, w, h, saat, dichte) {
    if (F.px < 6) return;
    const rng = zufall(saat), px = F.px;
    const T = [[186, 104, 34], [204, 146, 46], [150, 70, 30], [120, 84, 44], [214, 170, 70]];
    const pf = T.map(() => new Path2D());
    for (let i = 0; i < Math.min(900, w * h * 5 * dichte); i++) {
      const xx = x + rng() * w, yy = y + rng() * h, r = Math.max(0.025, 0.7 / px) * (0.8 + rng() * 0.8), a = rng() * TAU;
      const p = pf[(rng() * pf.length) | 0]; p.moveTo(xx + Math.cos(a) * r, yy + Math.sin(a) * r * 0.6); p.ellipse(xx, yy, r, r * 0.55, a, 0, TAU);
    }
    for (let i = 0; i < pf.length; i++) { g.fillStyle = rgb(T[i], 0.9); g.fill(pf[i]); }
  }
  function schneeFlaeche(g, F, x, y, w, h, saat) {
    const rng = zufall(saat * 131 + 7);
    g.fillStyle = "rgb(234,239,247)"; g.fillRect(x, y, w, h);
    if (F.px > 3) { tonFlecken(g, x, y, w, h, 2.4, 0.5, saat + 31, "#b8c6dc", true); tonFlecken(g, x, y, w, h, 1.4, 0.7, saat + 47, "#f7f9fc", true); }
    glitzer(g, F, x, y, w, h, 6, rng);
  }
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
  function eiszapfen(g, F, x0, x1, y0, maxL, saat, L) {
    const rng = zufall(saat), Zp = [];
    let x = x0 + rng() * 0.2;
    while (x < x1 - 0.03) { const l = maxL * (0.1 + Math.pow(rng(), 2) * 0.9), b = 0.012 + l * 0.07; Zp.push([x, l, b]); x += 0.1 + rng() * 0.4; }
    g.beginPath(); for (const [x, l, b] of Zp) { g.moveTo(x - b, y0); g.quadraticCurveTo(x - b * 0.5, y0 + l * 0.55, x, y0 + l); g.quadraticCurveTo(x + b * 0.5, y0 + l * 0.55, x + b, y0); g.closePath(); }
    g.fillStyle = L([214, 232, 248], 0.75); g.fill();
    g.strokeStyle = L([255, 255, 255], 0.85); g.lineWidth = Math.max(0.004, 0.9 / F.px);
    g.beginPath(); for (const [x, l, b] of Zp) { g.moveTo(x - b * 0.4, y0 + 0.01); g.lineTo(x - b * 0.1, y0 + l * 0.7); } g.stroke();
  }
  /* Schneewehe unten an einer Wand */
  function weheMalen(g, F, w, hWand, saat, frei) {
    const rng = zufall(saat), ph = rng() * 6;
    const hoehe = (a) => {
      let k = 0.14 + 0.07 * Math.sin(a * 1.7 + ph) + 0.05 * Math.sin(a * 4.3 + ph * 2);
      for (const [a0, a1] of frei || []) { const d = a < a0 ? a0 - a : a > a1 ? a - a1 : 0; k *= klemm(d / 0.3, 0, 1); }
      return Math.max(0, k);
    };
    g.beginPath(); g.moveTo(-0.05, hWand + 0.05);
    for (let a = -0.05; a <= w + 0.05; a += 0.06) g.lineTo(a, hWand - hoehe(klemm(a, 0, w)));
    g.lineTo(w + 0.05, hWand + 0.05); g.closePath();
    const gr = g.createLinearGradient(0, hWand - 0.3, 0, hWand);
    gr.addColorStop(0, "rgb(246,249,253)"); gr.addColorStop(1, "rgb(206,216,234)");
    g.fillStyle = gr; g.fill();
  }
  function schattenL(g, F, x, y, w, h, tiefe, a) {
    const sv = F.schatten(tiefe);
    if (!sv) { g.fillStyle = "rgba(18,16,24,0.18)"; g.fillRect(x, y, w, h); return; }
    const [dx, dy] = sv;
    g.fillStyle = "rgba(18,16,24," + (a || 0.36) + ")";
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y); g.lineTo(x + w + dx, y + dy); g.lineTo(x + dx, y + dy); g.closePath(); g.fill();
    g.beginPath();
    if (dx > 0) { g.moveTo(x, y); g.lineTo(x + dx, y + dy); g.lineTo(x + dx, y + h); g.lineTo(x, y + h); }
    else { g.moveTo(x + w, y); g.lineTo(x + w + dx, y + dy); g.lineTo(x + w + dx, y + h); g.lineTo(x + w, y + h); }
    g.closePath(); g.fill();
  }
  /* Fenster: weißer Rahmen, vier Scheiben, davor feiner Draht (Marder!) */
  function fensterMalen(g, F, B, x, y, w, h, Z) {
    const px = F.px, tag = 1 - F.nacht;
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    const pT = parallaxe(F, B, 0.06);
    g.fillStyle = "rgb(40,32,26)"; g.fillRect(x, y, w, h);
    if (Z.fenster) {
      const fx = x + pT[0], fy = y + pT[1];
      const gi = g.createLinearGradient(0, fy, 0, fy + h);
      gi.addColorStop(0, "rgb(36,32,30)"); gi.addColorStop(1, "rgb(64,52,40)");
      g.fillStyle = gi; g.fillRect(fx, fy, w, h);
      const hi = (F.zeit && F.zeit.himmel) || ["#bcd3ea", "#e9f1f8"];
      const sp = g.createLinearGradient(0, fy, 0, fy + h);
      sp.addColorStop(0, rgb(misch(hex(hi[0]), [200, 212, 226], 0.5), (0.45 * (0.3 + 0.7 * tag)).toFixed(3))); sp.addColorStop(1, rgb([120, 130, 110], (0.3 * (0.3 + 0.7 * tag)).toFixed(3)));
      g.fillStyle = sp; g.fillRect(fx, fy, w, h);
      if (px > 12) { g.fillStyle = "rgba(255,255,255," + (0.06 + 0.08 * tag).toFixed(3) + ")"; poly(g, [[fx + w * 0.1, fy + h], [fx + w * 0.45, fy], [fx + w * 0.6, fy], [fx + w * 0.25, fy + h]]); g.fill(); }
      g.fillStyle = rgb(WEISS);
      const rb = 0.045, sb = Math.max(0.025, 0.9 / px);
      g.fillRect(fx, fy, w, rb); g.fillRect(fx, fy + h - rb, w, rb); g.fillRect(fx, fy, rb, h); g.fillRect(fx + w - rb, fy, rb, h);
      g.fillRect(fx + w / 2 - sb / 2, fy, sb, h); g.fillRect(fx, fy + h / 2 - sb / 2, w, sb);
    }
    schattenL(g, F, x, y, w, h, 0.06, 0.3);
    g.restore();
    /* Bekleidung (weiße Bretter ringsum), Sohlbank */
    weissBrett(g, F, x - 0.07, y - 0.07, w + 0.14, 0.07); weissBrett(g, F, x - 0.07, y, 0.07, h); weissBrett(g, F, x + w, y, 0.07, h);
    weissBrett(g, F, x - 0.1, y + h, w + 0.2, 0.05);
    if (F.jahr === "winter" && Z.fertig) { g.fillStyle = "rgb(242,246,252)"; PI.rundRechteck(g, x - 0.1, y + h - 0.02, w + 0.2, 0.035, 0.012); g.fill(); }
  }
  function fensterLicht(g, F, B, x, y, w, h) {
    const a = F.nacht;
    if (a <= 0.01) return;
    const pT = parallaxe(F, B, 0.06);
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    const gx = x + pT[0] + 0.045, gy = y + pT[1] + 0.045, gw = w - 0.09, gh = h - 0.09;
    const gr = g.createRadialGradient(gx + gw * 0.5, gy + gh * 0.8, 0, gx + gw / 2, gy + gh * 0.5, gw);
    gr.addColorStop(0, "rgba(255,210,140," + (0.9 * a).toFixed(3) + ")"); gr.addColorStop(1, "rgba(200,120,60," + (0.7 * a).toFixed(3) + ")");
    g.fillStyle = gr; g.fillRect(gx, gy, gw, gh);
    g.fillStyle = "rgba(60,36,24," + (0.9 * a).toFixed(3) + ")";
    g.fillRect(x + pT[0] + w / 2 - 0.014, y, 0.028, h); g.fillRect(x, y + pT[1] + h / 2 - 0.014, w, 0.028);
    g.restore();
    F.leuchtPunkt(x + w / 2, y + h / 2, 0.8, "255,190,110", 0.4);
  }
  /* Brettertür mit Z-Strebe, weiß gerahmt */
  function tuerMalen(g, F, B, x, y, w, h, Z, c) {
    const px = F.px;
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    g.fillStyle = "rgb(30,24,20)"; g.fillRect(x, y, w, h);
    if (Z.tuer) {
      const pT = parallaxe(F, B, 0.04), fx = x + pT[0], fy = y + pT[1];
      const n = 4, rng = zufall(5);
      for (let i = 0; i < n; i++) { g.fillStyle = rgb(PI.streu(hell(c, -0.1), rng, 0.06)); g.fillRect(fx + w * i / n, fy, w / n + 0.002, h); }
      if (px > 9) maser(g, fx, fy, w, h, 0.03, 1.2, 0.35, 7, true);
      g.fillStyle = rgb(hell(c, -0.55), 0.7); for (let i = 1; i < n; i++) g.fillRect(fx + w * i / n - 0.006, fy, 0.012, h);
      /* Querleisten und Strebe, weiß */
      const L = (x0, y0, x1, y1, b) => { g.strokeStyle = rgb(WEISS); g.lineWidth = b; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); };
      L(fx, fy + 0.2, fx + w, fy + 0.2, 0.09); L(fx, fy + h - 0.2, fx + w, fy + h - 0.2, 0.09); L(fx + 0.06, fy + h - 0.24, fx + w - 0.06, fy + 0.24, 0.08);
      if (px > 10) { g.fillStyle = "rgb(40,38,38)"; g.fillRect(fx + w - 0.12, fy + h * 0.5, 0.08, 0.025); for (const yy of [fy + 0.2, fy + h - 0.2]) g.fillRect(fx, yy - 0.015, w * 0.45, 0.03); }
      rausch(g, fx, fy, w, h, 0.9, 0.25, 11, 3);
    }
    schattenL(g, F, x, y, w, h, 0.05, 0.3);
    g.restore();
    weissBrett(g, F, x - 0.07, y - 0.07, w + 0.14, 0.07); weissBrett(g, F, x - 0.07, y, 0.07, h); weissBrett(g, F, x + w, y, 0.07, h);
  }
  /* Hühnerklappe mit Schieber in Führungsleisten, Zugseil über eine Rolle */
  function klappeMalen(g, F, x, y, w, h, Z, c, offen) {
    const px = F.px;
    g.fillStyle = "rgb(22,18,16)"; g.fillRect(x, y, w, h);
    if (!Z.klappe) return;
    /* Führungen */
    weissBrett(g, F, x - 0.06, y - 0.5, 0.05, h + 0.52); weissBrett(g, F, x + w + 0.01, y - 0.5, 0.05, h + 0.52);
    const sy = offen ? y - 0.44 : y;
    const sv = F.schatten(0.03);
    if (sv) { g.fillStyle = "rgba(20,14,12,0.35)"; g.fillRect(x + sv[0], sy + sv[1], w, h); }
    g.fillStyle = rgb([172, 140, 100]); g.fillRect(x, sy, w, h);
    if (px > 9) maser(g, x, sy, w, h, 0.03, 0.8, 0.35, 3, true);
    g.fillStyle = rgb(hell(c, -0.5), 0.6); g.fillRect(x + w / 2 - 0.006, sy, 0.012, h);
    /* Seil zur Rolle unter dem Dach und weiter zur Tür */
    if (px > 8) {
      g.strokeStyle = "rgba(200,184,140,0.95)"; g.lineWidth = Math.max(0.01, 0.8 / px);
      g.beginPath(); g.moveTo(x + w / 2, sy); g.lineTo(x + w / 2, 0.14); g.lineTo(x + w / 2 + 0.8, 0.12); g.stroke();
      g.fillStyle = "rgb(60,56,54)"; g.beginPath(); g.arc(x + w / 2, 0.12, 0.035, 0, TAU); g.fill();
      g.fillStyle = "rgb(40,38,38)"; g.fillRect(x + w / 2 - 0.02, sy - 0.02, 0.04, 0.03);
    }
    /* Anflugbrett (Sitzbrett) unter der Klappe */
    weissBrett(g, F, x - 0.08, y + h, w + 0.16, 0.04);
  }

  /* ---------------- Wand ---------------- */
  function wandMaler(name, Z, S, topAt) {
    const oe = OEFF[name];
    return function (g, F) {
      const w = F.w, B = blickAus(F);
      /* topAt(a) → Flächen-y der Oberkante (schräge Seitenwände) */
      const yZ = (a, z) => F.h - (z - ZSW);
      const hBis = Z.schalung >= 1 ? null : (F.h * Z.schalung);
      g.save();
      if (hBis != null) { g.beginPath(); g.rect(-0.1, F.h - hBis, w + 0.2, hBis + 0.1); g.clip(); }
      schalungMalen(g, F, -0.05, -0.05, w + 0.1, F.h + 0.1, Z.alt ? S.farbe : [192, 156, 112], S.saat + name.length * 7);
      /* Eckbretter, unten Sockelbrett, oben Traufbrett */
      if (Z.alt) {
        weissBrett(g, F, 0, 0, 0.1, F.h); weissBrett(g, F, w - 0.1, 0, 0.1, F.h);
      }
      holzMalen(g, F, -0.05, F.h - 0.16, w + 0.1, 0.16, [96, 76, 58], 5, false);
      g.fillStyle = "rgba(20,14,10,0.4)"; g.fillRect(-0.05, F.h - 0.165, w + 0.1, 0.012);
      for (const o of oe) {
        const x = o.a0, y = yZ(x, o.z1), ow = o.a1 - o.a0, oh = o.z1 - o.z0;
        if (o.art === "fenster") fensterMalen(g, F, B, x, y, ow, oh, Z);
        else if (o.art === "tuer") tuerMalen(g, F, B, x, y, ow, oh, Z, S.farbe);
        else if (o.art === "klappe") klappeMalen(g, F, x, y, ow, oh, Z, S.farbe, F.nacht < 0.5);
        else if (o.art === "luft") {
          g.fillStyle = "rgb(24,20,18)"; g.fillRect(x, y, ow, oh);
          if (F.px > 10) { g.strokeStyle = "rgba(170,176,170,0.8)"; g.lineWidth = 0.008; g.beginPath(); for (let k = x; k < x + ow; k += 0.03) { g.moveTo(k, y); g.lineTo(k, y + oh); } g.stroke(); }
          weissBrett(g, F, x - 0.04, y - 0.04, ow + 0.08, 0.04); weissBrett(g, F, x - 0.04, y + oh, ow + 0.08, 0.04);
        }
      }
      /* Dachüberstand wirft Schatten oben (auch an den Schrägwänden) */
      const gr = g.createLinearGradient(0, 0, 0, 0.5);
      gr.addColorStop(0, "rgba(20,20,34,0.35)"); gr.addColorStop(1, "rgba(20,20,34,0)");
      g.save(); g.fillStyle = gr;
      if (topAt) { g.beginPath(); for (let a = 0; a <= w + 0.001; a += w / 8) { const t = topAt(a); if (a) g.lineTo(a, t); else g.moveTo(a, t); } for (let a = w; a >= -0.001; a -= w / 8) g.lineTo(a, topAt(a) + 0.5); g.closePath(); g.clip(); g.fillRect(-0.1, 0, w + 0.2, F.h); }
      else g.fillRect(-0.1, 0, w + 0.2, 0.5);
      g.restore();
      if (F.jahr === "herbst" && Z.fertig) { g.save(); g.beginPath(); g.rect(-0.1, F.h - 0.3, w + 0.2, 0.32); g.clip(); laubMalen(g, F, 0, F.h - 0.14, w, 0.15, S.saat + 3, 2); g.restore(); }
      if (F.jahr === "winter" && Z.fertig) weheMalen(g, F, w, F.h, S.saat + name.length, oe.filter((o) => o.art === "tuer").map((o) => [o.a0 - 0.1, o.a1 + 0.1]));
      g.restore();
    };
  }
  function wandLeuchten(name, S) {
    return function (g, F) {
      if (!S.licht) return;
      const B = blickAus(F);
      for (const o of OEFF[name]) if (o.art === "fenster") fensterLicht(g, F, B, o.a0, F.h - (o.z1 - ZSW), o.a1 - o.a0, o.z1 - o.z0);
    };
  }

  /* ---------------- Dach: Dachpappe auf Leisten ---------------- */
  function pappeMalen(g, F, w, h, saat, bis) {
    const px = F.px, rng = zufall(saat);
    /* Bretter darunter (während des Deckens sichtbar) */
    holzMalen(g, F, -0.05, -0.05, w + 0.1, h + 0.1, [176, 142, 100], saat, false);
    g.fillStyle = "rgba(60,40,24,0.4)"; for (let y = 0.14; y < h; y += 0.14) g.fillRect(-0.05, y, w + 0.1, 0.008);
    g.save();
    if (bis != null) { g.beginPath(); g.rect(-0.1, -0.1, w * bis + 0.1, h + 0.2); g.clip(); }
    g.fillStyle = rgb(PAPPE); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
    if (px > 20) rausch(g, 0, 0, w, h, 0.15, 0.3, saat + 1, 2);
    tonFlecken(g, 0, 0, w, h, 1.2, 0.35, saat + 2, "#8a9084");
    tonFlecken(g, 0, 0, w, h, 1.6, 0.3, saat + 5, "#5e6a44");
    /* Leisten mit Kappen, quer zur Traufe (entlang y der Fläche) */
    const sv = F.schatten ? F.schatten(0.05) : null;
    for (let x = 0.3; x < w - 0.1; x += 0.55) {
      if (sv) { g.fillStyle = "rgba(10,10,12,0.4)"; g.fillRect(x - 0.03 + sv[0], 0, 0.06, h); }
      const gr = g.createLinearGradient(x - 0.03, 0, x + 0.03, 0);
      gr.addColorStop(0, rgb(hell(PAPPE, 0.22))); gr.addColorStop(0.5, rgb(hell(PAPPE, 0.08))); gr.addColorStop(1, rgb(hell(PAPPE, -0.35)));
      g.fillStyle = gr; g.fillRect(x - 0.03, 0, 0.06, h);
    }
    /* Bahnstöße und Nagelreihen */
    if (px > 10) {
      g.fillStyle = "rgba(20,22,20,0.35)";
      for (let y = 0.9; y < h; y += 0.9) g.fillRect(0, y, w, 0.012);
      if (px > 30) { g.fillStyle = "rgba(170,170,160,0.5)"; for (let y = 0.9; y < h; y += 0.9) for (let x = 0.1; x < w; x += 0.12) g.fillRect(x, y - 0.03 + rng() * 0.01, 0.01, 0.01); }
    }
    bleich(g, 0, 0, w, h, 2, 0.12, saat + 7);
    g.restore();
  }

  /* =====================================================================
     FIGUREN: Pfähle, Tränke, Hühner
     ===================================================================== */
  function pfahl(hoch, winter) {
    return function (g, s, F) {
      const r = 0.055 * s, H = hoch * s * ST.KZ;
      if (F.schatten) { g.fillStyle = "#000"; g.fillRect(-r, -H, 2 * r, H); return; }
      const FL = figurLicht(F), c = [120, 96, 70];
      const gr = g.createLinearGradient(-r, 0, r, 0);
      gr.addColorStop(0, FL.lit(hell(c, 0.05), FL.lL)); gr.addColorStop(0.35, FL.lit(hell(c, 0.15), FL.lL)); gr.addColorStop(1, FL.lit(hell(c, -0.3), FL.lR));
      g.fillStyle = gr; g.fillRect(-r, -H, 2 * r, H);
      if (s > 25) { const rng = zufall(r * 100 | 0); g.fillStyle = FL.lit([60, 46, 34], FL.lV, 0.45); for (let i = 0; i < 6; i++) g.fillRect(-r + rng() * r * 1.6, -H + rng() * H, r * 0.3, 0.06 * s); }
      g.fillStyle = FL.lit(hell(c, 0.25), FL.lO); g.beginPath(); g.ellipse(0, -H, r, r * 0.5, 0, 0, TAU); g.fill();
      /* feuchter Fuß */
      const gb = g.createLinearGradient(0, -0.3 * s, 0, 0); gb.addColorStop(0, "rgba(30,24,18,0)"); gb.addColorStop(1, "rgba(30,24,18,0.45)"); g.fillStyle = gb; g.fillRect(-r, -0.3 * s, 2 * r, 0.3 * s);
      if (winter) { g.fillStyle = FL.lit([246, 249, 253], FL.lO); g.beginPath(); g.ellipse(0, -H - 0.01 * s, r * 1.1, r * 0.6, 0, Math.PI, 0); g.quadraticCurveTo(0, -H - 0.07 * s, -r * 1.1, -H - 0.01 * s); g.fill(); }
    };
  }
  function traenke(winter) {
    return function (g, s, F) {
      const r = 0.17 * s, H = 0.42 * s * ST.KZ;
      const um = () => { g.beginPath(); g.moveTo(-r, -0.05 * s); g.lineTo(-r * 0.62, -H * 0.3); g.lineTo(-r * 0.62, -H * 0.9); g.quadraticCurveTo(0, -H * 1.12, r * 0.62, -H * 0.9); g.lineTo(r * 0.62, -H * 0.3); g.lineTo(r, -0.05 * s); g.ellipse(0, -0.05 * s, r, r * 0.45, 0, 0, Math.PI); g.closePath(); };
      um();
      if (F.schatten) { g.fillStyle = "#000"; g.fill(); return; }
      const FL = figurLicht(F), c = [170, 176, 176];
      const gr = g.createLinearGradient(-r, 0, r, 0);
      gr.addColorStop(0, FL.lit(c, FL.lL)); gr.addColorStop(0.3, FL.lit(hell(c, 0.25), FL.lL)); gr.addColorStop(1, FL.lit(hell(c, -0.3), FL.lR));
      g.fillStyle = gr; g.fill();
      g.fillStyle = FL.lit([60, 80, 96], FL.lO); g.beginPath(); g.ellipse(0, -0.05 * s, r * 0.9, r * 0.35, 0, Math.PI, TAU); g.fill();
      g.strokeStyle = FL.lit(hell(c, -0.4), FL.lV); g.lineWidth = Math.max(0.6, 0.012 * s);
      g.beginPath(); g.arc(0, -H * 1.02, 0.04 * s, Math.PI, TAU); g.stroke();
      if (winter) { g.fillStyle = FL.lit([200, 222, 240], FL.lO, 0.9); g.beginPath(); g.ellipse(0, -0.05 * s, r * 0.85, r * 0.3, 0, Math.PI, TAU); g.fill(); }
    };
  }
  /* Hühner: Legehenne (braun, weiß, schwarz, gesperbert) und Hahn.
     rich = Blickrichtung im Modell (Grad) → im Bild nach links oder rechts;
     pose: 0 stehen, 1 picken, 2 Kopf hoch */
  const HUHN = { braun: [150, 82, 40], weiss: [236, 232, 222], schwarz: [44, 44, 50], sperber: [150, 150, 146] };
  function huhn(art, rich, pose, hahn, saat) {
    return function (g, s, F) {
      /* nachts sitzen die Hühner im Stall auf der Stange */
      if (F.Z && F.Z.nacht > 0.5) return;
      const gier = (F.gier || 0) * RAD, a = rich * RAD;
      const dx = Math.cos(a), dy = Math.sin(a);
      const bx = (dx * Math.cos(gier) - dy * Math.sin(gier)) - (dx * Math.sin(gier) + dy * Math.cos(gier));
      const sx = bx < 0 ? -1 : 1, k = s * (hahn ? 1.2 : 1), kz = k * ST.KZ;
      g.save(); g.scale(sx, 1);
      const c = HUHN[art] || HUHN.braun;
      const kx = pose === 1 ? 0.19 : 0.13, ky = pose === 1 ? 0.08 : pose === 2 ? 0.36 : 0.31;
      const koerper = () => {
        g.beginPath();
        g.moveTo(0.16 * k, -0.2 * kz);
        g.bezierCurveTo(0.16 * k, -0.08 * kz, 0.02 * k, -0.06 * kz, -0.08 * k, -0.09 * kz);
        g.bezierCurveTo(-0.16 * k, -0.11 * kz, -0.2 * k, -0.2 * kz, -0.19 * k, -0.3 * kz);
        g.lineTo(-0.23 * k, -0.42 * kz); g.quadraticCurveTo(-0.12 * k, -0.36 * kz, -0.06 * k, -0.26 * kz);
        g.bezierCurveTo(0.02 * k, -0.24 * kz, 0.08 * k, -0.28 * kz, kx - 0.03 * k, ky * -kz + 0.03 * kz);
        g.lineTo(kx + 0.02 * k, -ky * kz + 0.05 * kz);
        g.quadraticCurveTo(0.16 * k, -0.26 * kz, 0.16 * k, -0.2 * kz);
        g.closePath();
      };
      if (F.schatten) { koerper(); g.fillStyle = "#000"; g.fill(); g.beginPath(); g.arc(kx * 1, -ky * kz, 0.045 * k, 0, TAU); g.fill(); g.restore(); return; }
      const FL = figurLicht(F);
      /* Beine */
      g.strokeStyle = FL.lit([206, 170, 70], FL.lV); g.lineWidth = Math.max(0.7, 0.014 * k); g.lineCap = "round";
      g.beginPath(); g.moveTo(0.0, -0.09 * kz); g.lineTo(-0.01 * k, 0); g.moveTo(0.04 * k, -0.09 * kz); g.lineTo(0.05 * k, 0); g.stroke();
      if (k > 30) { g.beginPath(); g.moveTo(-0.04 * k, 0); g.lineTo(0.02 * k, 0); g.moveTo(0.02 * k, 0); g.lineTo(0.08 * k, 0); g.stroke(); }
      /* Körper */
      koerper();
      const gr = g.createLinearGradient(0, -0.4 * kz, 0, -0.07 * kz);
      gr.addColorStop(0, FL.lit(hell(c, 0.12), FL.lO)); gr.addColorStop(0.5, FL.lit(c, FL.lV)); gr.addColorStop(1, FL.lit(hell(c, -0.35), FL.lR));
      g.fillStyle = gr; g.fill();
      if (hahn) {
        /* Sichelfedern (schwarz, grün schimmernd) und goldener Behang */
        g.strokeStyle = FL.lit([30, 44, 40], FL.lV); g.lineWidth = Math.max(0.8, 0.02 * k);
        g.beginPath(); g.moveTo(-0.15 * k, -0.3 * kz); g.quadraticCurveTo(-0.32 * k, -0.52 * kz, -0.3 * k, -0.2 * kz); g.moveTo(-0.14 * k, -0.28 * kz); g.quadraticCurveTo(-0.28 * k, -0.44 * kz, -0.26 * k, -0.16 * kz); g.stroke();
        g.fillStyle = FL.lit([200, 120, 40], FL.lV);
        g.beginPath(); g.moveTo(kx - 0.05 * k, -ky * kz + 0.02 * kz); g.quadraticCurveTo(0.02 * k, -0.24 * kz, 0.1 * k, -0.18 * kz); g.lineTo(kx + 0.03 * k, -ky * kz + 0.06 * kz); g.closePath(); g.fill();
      }
      /* Flügel angedeutet */
      if (k > 18) { g.strokeStyle = FL.lit(hell(c, -0.3), FL.lV, 0.7); g.lineWidth = Math.max(0.5, 0.01 * k); g.beginPath(); g.moveTo(0.1 * k, -0.2 * kz); g.quadraticCurveTo(0.0, -0.15 * kz, -0.13 * k, -0.2 * kz); g.stroke(); }
      if (art === "sperber" && k > 20) { const r = zufall(saat); g.fillStyle = FL.lit([60, 60, 60], FL.lV, 0.5); for (let i = 0; i < 12; i++) g.fillRect((r() - 0.6) * 0.3 * k, -(0.12 + r() * 0.18) * kz, 0.03 * k, 0.012 * k); }
      /* Kopf, Kamm, Kehllappen, Schnabel, Auge */
      const hx = kx, hy = -ky * kz;
      g.fillStyle = FL.lit(art === "schwarz" ? c : hell(c, 0.05), FL.lV); g.beginPath(); g.arc(hx, hy, 0.042 * k, 0, TAU); g.fill();
      g.fillStyle = FL.lit([200, 30, 30], FL.lL);
      const kk = hahn ? 1.7 : 1;
      g.beginPath(); g.moveTo(hx - 0.035 * k, hy - 0.025 * k);
      for (let i = 0; i <= 3; i++) g.quadraticCurveTo(hx - 0.03 * k + i * 0.022 * k, hy - (0.07 + 0.012 * kk) * k * kk * 0.7, hx - 0.02 * k + i * 0.022 * k, hy - 0.03 * k);
      g.closePath(); g.fill();
      g.beginPath(); g.ellipse(hx + 0.03 * k, hy + 0.045 * k, 0.014 * k, 0.022 * k * kk, 0, 0, TAU); g.fill();
      g.fillStyle = FL.lit([220, 180, 80], FL.lV); g.beginPath(); g.moveTo(hx + 0.035 * k, hy - 0.01 * k); g.lineTo(hx + 0.075 * k, hy + 0.008 * k); g.lineTo(hx + 0.035 * k, hy + 0.018 * k); g.fill();
      if (k > 24) { g.fillStyle = "rgb(20,16,12)"; g.beginPath(); g.arc(hx + 0.012 * k, hy - 0.006 * k, Math.max(0.5, 0.008 * k), 0, TAU); g.fill(); }
      g.restore();
    };
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  ST.modell("huehnerstall", {
    name: "Hühnerstall", gruppe: "Häuser", grund: [8, 7], hoehe: 4, bauzeit: 6 * 60,
    bauen(M, o) {
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      const Z = zustand(bau);
      const saat = ((o.saat || 7) >>> 0) % 100000;
      const S = { saat: saat, winter: o.jahr === "winter", jahr: o.jahr, farbe: WANDFARBEN[(saat + 1) % WANDFARBEN.length], licht: Z.fertig, nachtZu: false };
      fundamentBauen(M, Z, S);
      if (Z.boden > 0) bodenBauen(M, Z, S);
      if (Z.staender > 0) staenderBauen(M, Z, S);
      if (Z.schalung > 0) waendeBauen(M, Z, S);
      if (Z.sparren > 0 && !Z.dach) sparrenBauen(M, Z, S);
      if (Z.dach) dachBauen(M, Z, S);
      if (Z.nist > 0) nistBauen(M, Z, S);
      if (Z.leiter) leiterBauen(M, Z, S);
      if (Z.pfaehle > 0) zaunBauen(M, Z, S);
      if (Z.platz > 0) platzBauen(M, Z, S);
      if (Z.trog) trogBauen(M, Z, S);
      if (Z.huehner) huehnerBauen(M, Z, S);
      if (Z.fertig) M.bodenlicht(SX0 + 1.0, SY1 + 0.9, 1.4, "255,196,120", 0.35);
    }
  });

  /* ---------------- Punktfundamente aus Feldstein ---------------- */
  const STEINE = [[SX0 + 0.15, SY0 + 0.15], [SX0 + 0.15, SY1 - 0.15], [SX1 - 0.15, SY0 + 0.15], [SX1 - 0.15, SY1 - 0.15], [(SX0 + SX1) / 2, SY0 + 0.15], [(SX0 + SX1) / 2, SY1 - 0.15]];
  function fundamentBauen(M, Z, S) {
    if (Z.loecher > 0) {
      M.teil("loecher", { ebene: -2, schatten: false, mitte: [STALL_M[0], STALL_M[1], -0.5] });
      M.flaeche({ name: "bauflaeche", o: [SX0 - 0.4, SY0 - 0.4, 0.008], u: [1, 0, 0], v: [0, 1, 0], w: SX1 - SX0 + 0.8, h: SY1 - SY0 + 0.8, malen: (g, F) => {
        g.fillStyle = "rgb(110,86,60)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
        tonFlecken(g, 0, 0, F.w, F.h, 1.2, 0.5, 3, "#5e4630");
        if (F.jahr === "winter") tonFlecken(g, 0, 0, F.w, F.h, 1.0, 0.5, 7, "#e6ecf4", true);
        for (const [x, y] of STEINE) {
          const cx = x - SX0 + 0.4, cy = y - SY0 + 0.4, r = 0.3 * Z.loecher;
          const gr = g.createRadialGradient(cx - 0.05, cy - 0.05, 0, cx, cy, r);
          gr.addColorStop(0, "rgb(40,30,22)"); gr.addColorStop(1, "rgb(84,64,44)");
          g.fillStyle = gr; g.beginPath(); g.ellipse(cx, cy, r, r * 0.9, 0.3, 0, TAU); g.fill();
        }
      } });
    }
    if (Z.steine <= 0) return;
    const n = Math.ceil(STEINE.length * Z.steine);
    STEINE.slice(0, n).forEach(([x, y], i) => {
      M.teil("stein" + i, { mitte: [x, y, 0.2] });
      const r = zufall(S.saat + i), fb = PI.streu([146, 138, 124], r, 0.15);
      const st = (g, F) => {
        g.fillStyle = rgb(fb); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
        tonFlecken(g, 0, 0, F.w, F.h, 0.4, 0.45, i * 3 + 1, "#6e665a");
        tonFlecken(g, 0, 0, F.w, F.h, 0.3, 0.3, i * 3 + 2, "#c8c0b0");
        g.fillStyle = "rgba(255,250,240,0.25)"; g.fillRect(-0.05, -0.05, F.w + 0.1, 0.03);
      };
      const d = 0.16, dz = ZB - 0.15;
      kiste(M, x - d, y - d, 0, x + d, y + d, dz, { s: st, n: st, o: st, w: st, t: st }, { name: "st" + i });
    });
  }
  /* ---------------- Schwellen und Dielenboden ---------------- */
  function bodenBauen(M, Z, S) {
    M.teil("boden", { mitte: [STALL_M[0], STALL_M[1], 0.3] });
    const hz = (g, F) => holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [176, 140, 96], 3, false);
    const z0 = ZB - 0.15, z1 = ZB - 0.02;
    const b = 0.12;
    const k = Math.min(1, Z.boden * 2);
    /* Schwellen ringsum */
    kiste(M, SX0, SY1 - b, z0, SX0 + (SX1 - SX0) * k, SY1, z1, { s: hz, n: hz, o: hz, w: hz, t: hz }, { name: "sws" });
    if (k >= 1) {
      kiste(M, SX0, SY0, z0, SX1, SY0 + b, z1, { s: hz, n: hz, o: hz, w: hz, t: hz }, { name: "swn" });
      kiste(M, SX0, SY0 + b, z0, SX0 + b, SY1 - b, z1, { o: hz, w: hz, t: hz }, { name: "sww" });
      kiste(M, SX1 - b, SY0 + b, z0, SX1, SY1 - b, z1, { o: hz, w: hz, t: hz }, { name: "swo" });
    }
    /* Dielen, eine nach der anderen (nur solange man hineinsieht) */
    if (Z.boden > 0.5 && Z.innen) {
      const t = (Z.boden - 0.5) * 2;
      M.flaeche({ name: "dielen", o: [SX0 + 0.02, SY0 + 0.02, z1 + 0.005], u: [1, 0, 0], v: [0, 1, 0], w: (SX1 - SX0 - 0.04) * t, h: SY1 - SY0 - 0.04, malen: (g, F) => {
        const rng = zufall(S.saat + 4);
        for (let x = 0; x < F.w; x += 0.14) { g.fillStyle = rgb(PI.streu([186, 150, 106], rng, 0.07)); g.fillRect(x, -0.02, 0.14, F.h + 0.04); }
        maser(g, 0, 0, F.w, F.h, 0.03, 1.2, 0.4, 5, true);
        g.fillStyle = "rgba(60,40,24,0.5)"; for (let x = 0.14; x < F.w; x += 0.14) g.fillRect(x - 0.005, 0, 0.01, F.h);
        if (Z.schalung > 0.3) { tonFlecken(g, 0, 0, F.w, F.h, 0.6, 0.5, 9, "#d8c080"); }   // Einstreu
        if (F.jahr === "winter") tonFlecken(g, 0, 0, F.w, F.h, 1, 0.4, 5, "#e8eef6", true);
      } });
    }
  }
  /* ---------------- Ständer und Rähm (Rohbau) ---------------- */
  function staenderBauen(M, Z, S) {
    if (Z.schalung >= 1) return;
    const hz = () => (g, F) => holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [182, 146, 100], 11, F.h > F.w);
    const pts = [];
    for (let x = SX0 + 0.05; x <= SX1 - 0.04; x += (SX1 - SX0 - 0.1) / 4) { pts.push([x, SY1 - 0.05]); pts.push([x, SY0 + 0.05]); }
    pts.push([SX0 + 0.05, (SY0 + SY1) / 2], [SX1 - 0.05, (SY0 + SY1) / 2]);
    const n = Math.round(pts.length * Math.min(1, Z.staender * 1.25));
    pts.slice(0, n).forEach(([x, y], i) => {
      M.teil("ständer" + i, { mitte: [x, y, 1.2] });
      balken3(M, [x, y, ZB - 0.02], [x, y, zU(y) - 0.01], [1, 0, 0], 0.08, 0.08, hz, { name: "st" + i });
    });
    if (Z.staender >= 0.85) {
      M.teil("rähm", { mitte: [STALL_M[0], STALL_M[1], 2.1] });
      balken3(M, [SX0, SY1 - 0.05, ZS - 0.05], [SX1, SY1 - 0.05, ZS - 0.05], [0, 1, 0], 0.1, 0.1, hz, { name: "rs" });
      balken3(M, [SX0, SY0 + 0.05, ZN - 0.05], [SX1, SY0 + 0.05, ZN - 0.05], [0, 1, 0], 0.1, 0.1, hz, { name: "rn" });
    }
  }
  /* ---------------- Wände ---------------- */
  function waendeBauen(M, Z, S) {
    M.teil("stall", { mitte: STALL_M });
    const ex = (name) => ({ name: "w-" + name, ao: true, beidseitig: !Z.dach, leuchten: Z.fertig ? wandLeuchten(name, S) : null });
    wand(M, [SX0, SY1, ZS], [0, 1, 0], SX1 - SX0, ZS - ZSW, wandMaler("sued", Z, S), ex("sued"));
    wand(M, [SX1, SY0, ZN], [0, -1, 0], SX1 - SX0, ZN - ZSW, wandMaler("nord", Z, S), ex("nord"));
    /* Seitenwände schräg oben: Fläche bis ZS hoch, Umriss folgt dem Dach */
    const hOst = ZS - ZSW;
    M.flaeche(Object.assign({ o: [SX1, SY1, ZS], u: [0, -1, 0], v: [0, 0, -1], w: SY1 - SY0, h: hOst, umriss: [[0, 0], [SY1 - SY0, ZS - ZN], [SY1 - SY0, hOst], [0, hOst]], malen: wandMaler("ost", Z, S, (a) => (ZS - zU(SY1 - a))) }, ex("ost")));
    M.flaeche(Object.assign({ o: [SX0, SY0, ZS], u: [0, 1, 0], v: [0, 0, -1], w: SY1 - SY0, h: hOst, umriss: [[0, ZS - ZN], [SY1 - SY0, 0], [SY1 - SY0, hOst], [0, hOst]], malen: wandMaler("west", Z, S, (a) => (ZS - zU(SY0 + a))) }, ex("west")));
    /* Türstein vor der Tür (West) */
    if (Z.tuer) {
      M.teil("tuerstein", { mitte: [SX0 - 0.3, -1.95, 0.1] });
      const st = (g, F) => { g.fillStyle = "rgb(150,144,132)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); tonFlecken(g, 0, 0, F.w, F.h, 0.5, 0.5, 4, "#6e665a"); if (F.jahr === "winter" && Z.fertig && F.h > 0.2) tonFlecken(g, 0, 0, F.w, F.h, 0.5, 0.6, 6, "#eef2f8", true); };
      kiste(M, SX0 - 0.5, -2.3, 0, SX0, -1.55, 0.22, { s: st, n: st, o: st, w: st, t: st }, { name: "ts" });
    }
  }
  /* ---------------- Sparren (offen) ---------------- */
  function sparrenBauen(M, Z, S) {
    const hz = () => (g, F) => holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [182, 146, 100], 13, false);
    const n = Math.max(1, Math.round(6 * Z.sparren));
    for (let i = 0; i < n; i++) {
      const x = DX0 + 0.1 + (DX1 - DX0 - 0.2) * i / 5;
      M.teil("sparren" + i, { mitte: [x, STALL_M[1], 2.4] });
      balken3(M, [x, DYN, zU(DYN) + 0.05], [x, DYS, zU(DYS) + 0.05], [1, 0, 0], 0.06, 0.1, hz, { name: "sp" + i });
    }
  }
  /* ---------------- Dach ---------------- */
  function dachBauen(M, Z, S) {
    const winter = S.winter && Z.fertig;
    M.teil("dach", { mitte: [STALL_M[0], STALL_M[1], 3.6] });
    const nD = [0, -KD, 1];
    const pts = [[DX0, DYN, zO(DYN)], [DX1, DYN, zO(DYN)], [DX1, DYS, zO(DYS)], [DX0, DYS, zO(DYS)]];
    vieleck(M, "dach", pts, nD, [1, 0, 0], (g, F) => {
      pappeMalen(g, F, F.w, F.h, S.saat + 3, Z.pappe >= 1 ? null : Z.pappe);
      if (winter) {
        /* Schnee: dicke Decke, an den Rändern gerundet, an den Leisten gewellt */
        g.save(); g.beginPath(); PI.rundRechteck(g, 0.03, 0.03, F.w - 0.06, F.h - 0.06, 0.12); g.clip();
        schneeFlaeche(g, F, 0, 0, F.w, F.h, S.saat + 9);
        g.fillStyle = "rgba(150,168,204,0.12)"; for (let x = 0.3; x < F.w; x += 0.55) g.fillRect(x - 0.05, 0, 0.1, F.h);
        g.restore();
      } else if (S.jahr === "herbst" && Z.fertig) laubMalen(g, F, 0, 0, F.w, F.h, S.saat + 5, 1.2);
    }, { lichtExtra: winter ? 0.05 : 0 });
    /* Stirnbretter ringsum */
    const brett = (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [104, 82, 62], 7, false); g.fillStyle = "rgba(20,14,10,0.4)"; g.fillRect(-0.02, F.h - 0.03, F.w + 0.04, 0.03); if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.05); } };
    const db = 0.08;
    vieleck(M, "stirn-s", [[DX0, DYS, zO(DYS)], [DX1, DYS, zO(DYS)], [DX1, DYS, zU(DYS) - db], [DX0, DYS, zU(DYS) - db]], [0, 1, 0], [1, 0, 0], brett, { keinAo: true });
    vieleck(M, "stirn-n", [[DX1, DYN, zO(DYN)], [DX0, DYN, zO(DYN)], [DX0, DYN, zU(DYN) - db], [DX1, DYN, zU(DYN) - db]], [0, -1, 0], [-1, 0, 0], brett, { keinAo: true });
    vieleck(M, "stirn-o", [[DX1, DYS, zO(DYS)], [DX1, DYN, zO(DYN)], [DX1, DYN, zU(DYN) - db], [DX1, DYS, zU(DYS) - db]], [1, 0, 0], [0, -1, 0], brett, { keinAo: true });
    vieleck(M, "stirn-w", [[DX0, DYN, zO(DYN)], [DX0, DYS, zO(DYS)], [DX0, DYS, zU(DYS) - db], [DX0, DYN, zU(DYN) - db]], [-1, 0, 0], [0, 1, 0], brett, { keinAo: true });
    if (winter) {
      M.teil("zapfen", { schatten: false, mitte: [STALL_M[0], DYS + 5, 3] });
      M.flaeche({ name: "zapfen", o: [DX0, DYS + 0.01, zU(DYS) - db], u: [1, 0, 0], v: [0, 0, -1], w: DX1 - DX0, h: 0.4, keinLicht: true, keinAo: true, malen: (g, F) => {
        const lf = ST.lichtFaktor(F.n, F.zeit, 0.15, F.jahr);
        eiszapfen(g, F, 0.1, F.w - 0.1, 0, 0.3, S.saat + 1, (c, a) => rgb([c[0] * lf[0], c[1] * lf[1], c[2] * lf[2]], a));
      } });
      /* Schneewulst über der Vorderkante */
      M.teil("wulst", { schatten: false, mitte: [STALL_M[0], DYS + 6, 4] });
      M.flaeche({ name: "wulst", o: [DX0 - 0.02, DYS + 0.03, zO(DYS) + 0.2], u: [1, 0, 0], v: [0, 0, -1], w: DX1 - DX0 + 0.04, h: 0.32, keinLicht: true, keinAo: true, malen: (g, F) => {
        const lf = ST.lichtFaktor(nrm([0, 0.6, 1]), F.zeit, 0.06, F.jahr), L = (c, a) => rgb([Math.min(255, c[0] * lf[0]), Math.min(255, c[1] * lf[1]), Math.min(255, c[2] * lf[2])], a);
        g.beginPath(); g.moveTo(0, 0.24);
        for (let x = 0; x <= F.w; x += 0.1) g.lineTo(x, 0.06 + 0.03 * Math.sin(x * 3.1 + 1) + 0.02 * Math.sin(x * 7.3));
        for (let x = F.w; x >= 0; x -= 0.1) g.lineTo(x, 0.25 + 0.04 * Math.sin(x * 2.3) + 0.03 * Math.cos(x * 5.9));
        g.closePath();
        const gr = g.createLinearGradient(0, 0.05, 0, 0.3);
        gr.addColorStop(0, L([250, 252, 255])); gr.addColorStop(0.6, L([236, 242, 250])); gr.addColorStop(1, L([190, 204, 230]));
        g.fillStyle = gr; g.fill();
      } });
    }
  }
  /* ---------------- Nistkasten-Anbau ---------------- */
  function nistBauen(M, Z, S) {
    const winter = S.winter && Z.fertig;
    M.teil("nist", { mitte: [(SX1 + NX1) / 2, (NY0 + NY1) / 2, 0.9] });
    const zT = NZ0 + (NZW - NZ0) * Z.nist;
    const brett = (g, F) => {
      schalungMalen(g, F, -0.05, -0.05, F.w + 0.1, F.h + 0.1, Z.alt ? S.farbe : [192, 156, 112], S.saat + 41);
      weissBrett(g, F, 0, 0, 0.06, F.h); weissBrett(g, F, F.w - 0.06, 0, 0.06, F.h);
      if (F.jahr === "herbst" && Z.fertig) laubMalen(g, F, 0, F.h - 0.08, F.w, 0.08, 3, 2);
    };
    const zA = NZ0 + (NZA - NZ0) * Z.nist;
    wand(M, [NX1, NY1, zA], [1, 0, 0], NY1 - NY0, zA - NZ0, brett, { name: "nist-o" });
    const tz = (x) => zT + (zA - zT) * (x - SX1) / (NX1 - SX1);
    vieleck(M, "nist-s", [[SX1, NY1, tz(SX1)], [NX1, NY1, tz(NX1)], [NX1, NY1, NZ0], [SX1, NY1, NZ0]], [0, 1, 0], [1, 0, 0], brett);
    vieleck(M, "nist-n", [[NX1, NY0, tz(NX1)], [SX1, NY0, tz(SX1)], [SX1, NY0, NZ0], [NX1, NY0, NZ0]], [0, -1, 0], [-1, 0, 0], brett);
    /* Konsolen darunter */
    const hz = () => (g, F) => holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [110, 88, 64], 9, false);
    for (const y of [NY0 + 0.12, NY1 - 0.12]) balken3(M, [SX1, y, NZ0 - 0.35], [NX1 - 0.05, y, NZ0 - 0.02], [0, 1, 0], 0.06, 0.06, hz, { name: "kons" + y });
    kiste(M, SX1, NY0, NZ0 - 0.05, NX1, NY1, NZ0, { s: "#6a5440", n: "#6a5440", o: "#6a5440" }, { name: "nboden" });
    if (Z.nist < 1) return;
    /* Deckel: Dachpappe, Scharniere an der Wand, Griff vorn */
    const ue = 0.06, nL = nrm([-(NZW - NZA), 0, NX1 - SX1]);
    vieleck(M, "nist-deckel", [[SX1, NY0 - ue, NZW + 0.03], [SX1, NY1 + ue, NZW + 0.03], [NX1 + ue, NY1 + ue, NZA + 0.02], [NX1 + ue, NY0 - ue, NZA + 0.02]], nL, [0, 1, 0], (g, F) => {
      pappeMalen(g, F, F.w, F.h, S.saat + 17, null);
      if (F.px > 10) { g.fillStyle = "rgb(40,38,38)"; for (const x of [0.25, F.w - 0.4]) g.fillRect(x, 0, 0.15, 0.12); }
      if (winter) { g.save(); g.beginPath(); PI.rundRechteck(g, 0.02, 0.02, F.w - 0.04, F.h - 0.04, 0.08); g.clip(); schneeFlaeche(g, F, 0, 0, F.w, F.h, 23); g.restore(); }
    }, { keinAo: true });
    vieleck(M, "nist-deckelk", [[NX1 + ue, NY1 + ue, NZA + 0.02], [NX1 + ue, NY0 - ue, NZA + 0.02], [NX1 + ue, NY0 - ue, NZA - 0.03], [NX1 + ue, NY1 + ue, NZA - 0.03]], [1, 0, 0], [0, -1, 0], (g, F) => { g.fillStyle = rgb(hell(PAPPE, -0.2)); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); if (F.px > 12) { g.fillStyle = "rgb(60,56,54)"; g.fillRect(F.w / 2 - 0.08, 0, 0.16, F.h); } }, { keinAo: true });
  }
  /* ---------------- Hühnerleiter ---------------- */
  function leiterBauen(M, Z, S) {
    const o = OEFF.sued[2];
    const x0 = SX0 + o.a0 - 0.02, x1 = SX0 + o.a1 + 0.02, y0 = SY1 + 0.02, y1 = SY1 + 1.25, zA = o.z0 - 0.02;
    M.teil("leiter", { mitte: [(x0 + x1) / 2, (y0 + y1) / 2, 0.25] });
    const n = nrm(kreuz([1, 0, 0], [0, y1 - y0, -zA]));
    const nn = n[2] > 0 ? n : mul(n, -1);
    vieleck(M, "leiter", [[x0, y0, zA], [x1, y0, zA], [x1, y1, 0.01], [x0, y1, 0.01]], nn, [1, 0, 0], (g, F) => {
      holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [150, 124, 92], 21, true);
      const sv = F.schatten(0.025);
      for (let y = 0.12; y < F.h - 0.05; y += 0.16) {
        if (sv) { g.fillStyle = "rgba(20,14,10,0.4)"; g.fillRect(sv[0], y + sv[1], F.w, 0.03); }
        g.fillStyle = "rgb(128,100,72)"; g.fillRect(0, y, F.w, 0.03);
        g.fillStyle = "rgba(255,230,190,0.25)"; g.fillRect(0, y, F.w, 0.008);
      }
      tonFlecken(g, 0, 0, F.w, F.h, 0.3, 0.4, 5, "#6a5a40");
      if (F.jahr === "winter" && Z.fertig) tonFlecken(g, 0, 0, F.w, F.h, 0.4, 0.6, 9, "#eef2f8", true);
    });
  }
  /* ---------------- Zaun: Pfähle und Maschendraht ---------------- */
  const PFAEHLE = [[AX0, AY0], [AX0, 1.15], [AX0, AY1], [-1.85, AY1], [0, AY1], [TOR[0], AY1], [TOR[1], AY1], [AX1, AY1], [AX1, 1.15], [AX1, AY0], [2.0, AY0], [SX1 + 0.05, AY0]];
  /* Felder: [von, bis, tor] als Pfahlindizes (−1 = Stallecke West) */
  const FELDER = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6, "tor"], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [-1, 0]];
  function drahtMaler(S, tor) {
    return function (g, F) {
      const w = F.w, h = F.h, px = F.px, L = belichter(F, 0.08), rng = zufall(S.saat + (w * 100 | 0));
      const winter = F.jahr === "winter";
      const d = 0.05;
      const sack = (x) => 0.03 * Math.sin(Math.PI * x / w);
      if (tor) {
        /* Tor: Holzrahmen mit Strebe, Draht innen, Riegel */
        const rb = 0.07;
        const holz = (x0, y0, x1, y1) => { g.strokeStyle = L([150, 120, 86]); g.lineWidth = rb; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); };
        drahtFeld(g, F, 0.05, 0.15, w - 0.1, h - 0.2, L, px, d, () => 0);
        holz(0.04, 0.12, w - 0.04, 0.12); holz(0.04, h - 0.06, w - 0.04, h - 0.06); holz(0.04, 0.08, 0.04, h - 0.02); holz(w - 0.04, 0.08, w - 0.04, h - 0.02); holz(0.08, h - 0.08, w - 0.08, 0.16);
        g.fillStyle = L([50, 48, 48]); g.fillRect(w - 0.16, h * 0.45, 0.2, 0.03);
        if (winter) { g.fillStyle = L([246, 249, 253]); g.fillRect(0, 0.08, w, 0.03); }
        return;
      }
      drahtFeld(g, F, 0, 0.04, w, h - 0.04, L, px, d, sack);
      /* Spanndrähte oben, Mitte, unten */
      g.strokeStyle = L([120, 126, 122], 0.95); g.lineWidth = Math.max(0.006, 0.9 / px);
      g.beginPath();
      for (const y of [0.04, h * 0.5, h - 0.03]) { g.moveTo(0, y + sack(0)); for (let x = 0; x <= w; x += w / 10) g.lineTo(x, y + sack(x)); }
      g.stroke();
      if (winter) {
        g.fillStyle = L([246, 249, 253], 0.95);
        g.beginPath(); for (let x = 0; x < w; x += 0.08 + rng() * 0.2) { const l = 0.05 + rng() * 0.25; g.rect(x, 0.025 + sack(x), l, 0.018); x += l; } g.fill();
      }
    };
  }
  /* Maschendraht (Rautengeflecht 5 cm): nah als echte Drähte, fern als
     feiner Schleier mit weitem Rautenmuster – kein Moiré */
  function drahtFeld(g, F, x, y, w, h, L, px, d, sack) {
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    let dd = d, alpha = 0.8;
    if (px * d < 5) { const k = Math.ceil(5 / (px * d)); dd = d * k; alpha = 0.8 / Math.sqrt(k); g.fillStyle = L([150, 158, 152], (0.1 + 0.06 * Math.min(4, k)).toFixed(3)); g.fillRect(x, y, w, h); }
    g.strokeStyle = L([150, 158, 152], alpha.toFixed(3)); g.lineWidth = Math.max(0.004, 0.7 / px);
    g.beginPath();
    for (let a = x - h; a < x + w + h; a += dd) { g.moveTo(a, y + sack(a - x)); g.lineTo(a + h, y + h); g.moveTo(a + h, y + sack(a + h - x)); g.lineTo(a, y + h); }
    g.stroke();
    g.restore();
  }
  function zaunBauen(M, Z, S) {
    const winter = S.winter && Z.fertig;
    const n = Math.ceil(PFAEHLE.length * Z.pfaehle);
    PFAEHLE.slice(0, n).forEach(([x, y], i) => {
      M.teil("pfahl" + i, { mitte: [x, y, 0.75] });
      M.figur({ x: x, y: y, z: 0, breite: 0.3, hoehe: ZH + 0.1, schatten: true, malen: pfahl(ZH + 0.08 + (i % 3) * 0.02, winter) });
    });
    if (Z.draht <= 0) return;
    const nf = Math.ceil(FELDER.length * Z.draht);
    FELDER.slice(0, nf).forEach(([i, j, tor], k) => {
      const p = i < 0 ? [SX0, AY0] : PFAEHLE[i], q = PFAEHLE[j];
      const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
      const u = [dx / L, dy / L, 0];
      const a0 = i < 0 ? 0 : 0.05, a1 = L - 0.05;
      M.teil("draht" + k, { schatten: false, mitte: [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, 0.75] });
      M.flaeche({ name: "draht" + k, o: [p[0] + u[0] * a0, p[1] + u[1] * a0, ZH], u: u, v: [0, 0, -1], w: a1 - a0, h: ZH, beidseitig: true, keinLicht: true, keinAo: true, malen: drahtMaler(S, tor) });
    });
  }
  /* ---------------- Scharrplatz im Auslauf ---------------- */
  function platzBauen(M, Z, S) {
    M.teil("platz", { ebene: -3, schatten: false, mitte: [0, 1.2, 0] });
    const x0 = AX0 + 0.1, y0 = AY0 + 0.05, w = AX1 - AX0 - 0.2, h = AY1 - AY0 - 0.15;
    const rng = zufall(S.saat + 13), um = [];
    for (let i = 0; i < 22; i++) { const a = i / 22 * TAU, r = 0.86 + rng() * 0.12; um.push([w / 2 + Math.cos(a) * w / 2 * r, h / 2 + Math.sin(a) * h / 2 * r]); }
    M.flaeche({ name: "platz", o: [x0, y0, 0.012], u: [1, 0, 0], v: [0, 1, 0], w: w, h: h, umriss: um, keinLicht: true, keinAo: true, malen: (g, F) => {
      const winter = F.jahr === "winter";
      /* halb durchsichtig: selbst belichten (sonst legt der Kern einen hellen Schleier darüber) */
      const lf = ST.lichtFaktor([0, 0, 1], F.zeit, 0, F.jahr);
      const lit = (c) => { const f = typeof c === "string" ? hex(c) : c; return rgb([f[0] * lf[0], f[1] * lf[1], f[2] * lf[2]]); };
      const litH = (c) => { const f = hex(c); return "#" + [0, 1, 2].map((i) => ("0" + Math.round(Math.min(255, f[i] * lf[i])).toString(16)).slice(-2)).join(""); };
      /* weicher Rand: der Boden ist zertreten, zum Zaun hin wächst noch Gras */
      const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.5);
      gr.addColorStop(0, "rgba(255,255,255," + (0.85 * Z.platz).toFixed(3) + ")"); gr.addColorStop(0.7, "rgba(255,255,255," + (0.6 * Z.platz).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,255,255,0)");
      g.save(); g.scale(1, h / w * 1.0); g.fillStyle = gr; g.fillRect(-0.1, -0.1, w + 0.2, w + 0.2); g.restore();
      g.globalCompositeOperation = "source-in";
      g.fillStyle = lit(winter ? [206, 212, 222] : [122, 98, 68]); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
      g.globalCompositeOperation = "source-atop";
      tonFlecken(g, 0, 0, w, h, 1.3, 0.55, 3, litH(winter ? "#aab4c4" : "#6a5236"));
      tonFlecken(g, 0, 0, w, h, 0.8, 0.45, 5, litH(winter ? "#eef2f8" : "#9c8058"), true);
      if (!winter) tonFlecken(g, 0, 0, w, h, 1.1, 0.35, 8, litH("#5c7a3a"));
      /* Schatten des Stalls und der Pfähle liegen darunter: etwas dunkler an der Stallseite */
      const gs = g.createLinearGradient(0, 0, 0, 1.4); gs.addColorStop(0, "rgba(20,24,40,0.25)"); gs.addColorStop(1, "rgba(20,24,40,0)");
      g.fillStyle = gs; g.fillRect(-0.1, -0.1, w + 0.2, 1.5);
      if (F.px > 14) {
        const r = zufall(21);
        /* Stroh, Federn, Scharrmulden, im Winter Hühnerspuren */
        g.strokeStyle = winter ? "rgba(120,110,90,0.5)" : "rgba(214,188,120,0.75)"; g.lineWidth = Math.max(0.008, 0.8 / F.px);
        g.beginPath(); for (let i = 0; i < 160; i++) { const x = r() * w, y = r() * h, a = r() * TAU, l = 0.05 + r() * 0.1; g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); } g.stroke();
        g.fillStyle = "rgba(246,244,238,0.85)"; g.beginPath(); for (let i = 0; i < 14; i++) { const x = r() * w, y = r() * h; g.moveTo(x, y); g.ellipse(x, y, 0.04, 0.012, r() * 3, 0, TAU); } g.fill();
        g.fillStyle = winter ? "rgba(110,120,140,0.35)" : "rgba(60,44,28,0.35)";
        g.beginPath(); for (let i = 0; i < 9; i++) { const x = r() * w, y = r() * h; g.moveTo(x + 0.2, y); g.ellipse(x, y, 0.2, 0.12, r() * 3, 0, TAU); } g.fill();
        if (winter && F.px > 25) {
          g.strokeStyle = "rgba(90,100,124,0.55)"; g.lineWidth = 0.012;
          g.beginPath();
          for (let i = 0; i < 70; i++) { const x = r() * w, y = r() * h, a = r() * TAU; for (const da of [-0.5, 0, 0.5]) { g.moveTo(x, y); g.lineTo(x + Math.cos(a + da) * 0.05, y + Math.sin(a + da) * 0.05); } }
          g.stroke();
        }
      }
      if (F.jahr === "herbst") laubMalen(g, F, 0, 0, w, h, 31, 0.5);
      g.globalCompositeOperation = "source-over";
    } });
  }
  /* ---------------- Futtertrog und Tränke ---------------- */
  function trogBauen(M, Z, S) {
    const winter = S.winter && Z.fertig;
    const x0 = 1.0, x1 = 2.2, y0 = 0.9, y1 = 1.18, z0 = 0.12, z1 = 0.3;
    M.teil("trog", { mitte: [(x0 + x1) / 2, (y0 + y1) / 2, 0.2] });
    const hz = (g, F) => holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [140, 112, 80], 31, false);
    kiste(M, x0, y0, z0, x1, y1, z1, { s: hz, n: hz, o: hz, w: hz, t: (g, F) => {
      g.fillStyle = "rgb(120,96,70)"; g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04);
      g.fillStyle = "rgb(60,44,30)"; g.fillRect(0.03, 0.03, F.w - 0.06, F.h - 0.06);
      /* Körner */
      const r = zufall(9);
      g.fillStyle = "rgb(214,178,80)"; g.fillRect(0.04, F.h * 0.35, F.w - 0.08, F.h * 0.55);
      if (F.px > 18) { g.fillStyle = "rgba(150,110,40,0.8)"; for (let i = 0; i < 90; i++) g.fillRect(0.04 + r() * (F.w - 0.08), F.h * 0.35 + r() * F.h * 0.55, 0.012, 0.01); }
      if (winter) schneeOben(null)(g, F);
    } }, { name: "trog" });
    for (const x of [x0 + 0.08, x1 - 0.14]) kiste(M, x, y0 - 0.04, 0, x + 0.06, y1 + 0.04, z0, { s: hz, n: hz, o: hz, w: hz }, { name: "fuss" + x });
    M.teil("traenke", { mitte: [-1.6, 1.3, 0.2] });
    M.figur({ x: -1.6, y: 1.3, z: 0, breite: 0.45, hoehe: 0.5, malen: traenke(winter) });
  }
  /* ---------------- Hühner ---------------- */
  function huehnerBauen(M, Z, S) {
    const winter = S.winter;
    const rng = zufall(S.saat + 77);
    const arten = ["braun", "braun", "weiss", "sperber", "schwarz", "braun"];
    const plaetze = winter
      ? [[-0.6, 0.7, 1], [1.4, 0.7, 1], [-0.75, SY1 + 0.55, 0]]
      : [[1.3, 0.62, 1], [1.9, 1.5, 1], [-1.2, 1.8, 0], [-2.6, 0.4, 2], [0.4, 2.4, 1], [-0.75, SY1 + 0.6, 0]];
    plaetze.forEach(([x, y, pose], i) => {
      const z = i === plaetze.length - 1 ? (OEFF.sued[2].z0 - 0.02) * (1 - (y - SY1) / 1.25) : 0;
      M.teil("huhn" + i, { mitte: [x, y, z + 0.2] });
      M.figur({ x: x, y: y, z: z, breite: 0.5, hoehe: 0.45, schatten: true, malen: huhn(arten[i % arten.length], rng() * 360, pose, false, i) });
    });
    if (!winter) {
      M.teil("hahn", { mitte: [2.9, 2.2, 0.3] });
      M.figur({ x: 2.9, y: 2.2, z: 0, breite: 0.6, hoehe: 0.6, schatten: true, malen: huhn("braun", 200 + S.saat % 60, 2, true, 99) });
    }
  }
})();
