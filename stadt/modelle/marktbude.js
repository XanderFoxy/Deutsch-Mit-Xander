/* =====================================================================
   BAUKASTEN-STADT — DIE MARKTBUDE (Weihnachtsmarkt · Frühlingsmarkt)
   ---------------------------------------------------------------------
   XANDER: „Ich möchte einen Liebreiz zur Weihnachtsdeko … dieses
   Weihnachtsdorf … mit Schmücken, mit Schnee … alles dabei. Das möchte
   ich in Perfektion." – „Richtig filigran. Richtig schön ausarbeiten mit
   schönen Texturen." – „Das soll keine Comic Grafik sein." – „ohne
   Pixelkanten und komische Vektorrückstände." – „Man soll sie in jedem
   Winkel aufstellen können."

   EINE ECHTE WEIHNACHTSMARKTHÜTTE (Runde 2, neu gebaut)
   3,0 × 2,2 m auf Kanthölzern, Blockbohlen, Traufe 2,4 m, Satteldach mit
   Lärchenschindeln, First entlang der Front. Vorn (+y) eine große, oben
   angeschlagene Verkaufsklappe (2,74 × 1,25 m), 50° über die Waagrechte
   hochgestellt und auf zwei Streben gestützt. Warum 50° und nicht
   waagrecht: die Kamera schaut mit 30° von oben – jede flachere Klappe
   verdeckte den Kopf der Verkäuferin, bei genau 30° sähe man die Klappe
   nur als Strich. Bei 50° sieht man ihre Unterseite mit der Lichterkette.
   Darunter Theke mit Auslage, drinnen die Verkäuferin (echte 3D-Gestalt
   wie die Menschen der Stadt), Regale und eine warme Lichterkette.
   Auf dem First das handgemalte Schild und je Ware ein Dachaufsatz, an
   dem man die Bude schon von weitem erkennt: Holzfass (Glühwein),
   Riesenherz (Lebkuchen), Spitztüte (Mandeln), Nussknacker (Holzkunst),
   Kerze (Kerzen), Blumenkasten und Erdbeerkorb (Frühling).
   Hinten: Tür mit Leuchte, Plakat, Stromkasten, Getränkekisten,
   Gasflasche und Kabeltrommel; an der Seite Brennholz und Mülltonne –
   im Budenkreis sieht man ja oft die Rückseiten.

   SCHNEE (Winter): gewölbte Decke mit Verwehungen, Schindelreihen als
   weiche Wellen darunter, am First dünn (Schindeln schauen durch),
   bläuliche Mulden, Glitzer. Traufe und Ortgang haben eine eigene
   Schneekante mit Dicke (10 cm), die 5 cm überhängt, darunter Eiszapfen.
   Nachts wärmt die Lichterkette das untere Dachdrittel.

   REIHENFOLGE (Kern: Teile nach ihrer Mitte, „ebene" zuerst). Alles,
   was vor der Frontwand liegt (Theke, Auslage, Klappe, Streben), hat eine
   weit nach vorn (+y) gelegte Mitte: zeigt die Front zum Betrachter,
   kommt es nach der Hülle, sonst davor – die Hülle verdeckt es dann bis
   auf das, was seitlich übersteht. So trennt die Ebene der Frontwand
   Vorn und Hinten in jedem Drehwinkel (dasselbe hinten und seitlich).
   LICHTSCHEIN: die Szene addiert Lichtschein über alles. Deshalb werden
   Lichtpunkte nur in „danach" sichtbarer Flächen angemeldet (die Innen-
   leuchte in der Ebene der Öffnung, die Türleuchte klein) und Licht-
   pfützen am Boden als eigene Bodenfläche gemalt, die das Haus verdeckt.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const KX = ST.KX, KY = ST.KY, KZ = ST.KZ, LICHT = ST.LICHT, AUGE = ST.ZUM_AUGE;
  const TAU = Math.PI * 2;

  /* =====================================================================
     HELFER
     ===================================================================== */
  function blick(gier, s, ox, oy, oz) {
    const r = gier * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
    const lx = -LICHT[0] / LICHT[2], ly = -LICHT[1] / LICHT[2];
    const X0 = ox || 0, Y0 = oy || 0, Z0 = oz || 0;
    return {
      c: c, sn: sn, s: s, X0: X0, Y0: Y0, Z0: Z0,
      p: function (x, y, z) { x -= X0; y -= Y0; z -= Z0; const a = x * c - y * sn, b = x * sn + y * c; return [(a - b) * KX * s, (a + b) * KY * s - z * KZ * s]; },
      tiefe: function (x, y, z) { return (x * c - y * sn + x * sn + y * c) * AUGE[0] + z * AUGE[2]; },
      n: function (x, y, z) { const l = Math.hypot(x, y, z) || 1; return [(x * c - y * sn) / l, (x * sn + y * c) / l, z / l]; },
      boden: function (x, y, z) { x -= X0; y -= Y0; const a = x * c - y * sn + lx * z, b = x * sn + y * c + ly * z; return [(a - b) * KX * s, (a + b) * KY * s]; }
    };
  }
  /* Kern-Lücke: beim Figurenschatten fehlt F.gier (kern.js, figurSchatten).
     Der Kern malt den Schatten im selben Sprite direkt nach dem Bild. */
  function mitGier(malen) {
    let merk = 0;
    return function (g, s, F) {
      if (F.gier != null && isFinite(F.gier)) merk = F.gier; else F = Object.assign({}, F, { gier: merk });
      return malen(g, s, F);
    };
  }
  /* Kern-Fläche „gebacken": in eine CPU-Leinwand (willReadFrequently) in
     Flächenauflösung malen und als EIN Bild einsetzen – tausende kleine
     Pfade sind auf der GPU-Leinwand des Sprites sehr teuer. */
  function gebacken(fn) {
    return function (g, F) {
      const sx = Math.max(1, F.pxU), sy = Math.max(1, F.pxV);
      const W = Math.ceil(F.w * sx) + 4, H = Math.ceil(F.h * sy) + 4;
      if (W * H > 6e6) return fn(g, F);
      const c = document.createElement("canvas"); c.width = W; c.height = H;
      const cg = c.getContext("2d", { willReadFrequently: true });
      cg.scale(sx, sy); cg.translate(2 / sx, 2 / sy);
      fn(cg, F);
      g.drawImage(c, -2 / sx, -2 / sy, W / sx, H / sy);
      c.width = c.height = 0;
    };
  }
  function aufCpu(g, links, oben, breite, hoehe, fn) {
    const x0 = Math.floor(links), y0 = Math.floor(oben), W = Math.max(1, Math.ceil(breite) + 2), H = Math.max(1, Math.ceil(hoehe) + 2);
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const cg = c.getContext("2d", { willReadFrequently: true });
    cg.translate(-x0, -y0); fn(cg); g.drawImage(c, x0, y0); c.width = c.height = 0;
  }
  function rgb(f, a) { return a == null ? "rgb(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + ")" : "rgba(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + "," + a + ")"; }
  function mul(f, k) { return [Math.min(255, f[0] * k[0]), Math.min(255, f[1] * k[1]), Math.min(255, f[2] * k[2])]; }
  function skal(f, k) { return [f[0] * k, f[1] * k, f[2] * k]; }
  function misch(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  function hexVon(f) { return "#" + f.map((v) => Math.max(0, Math.min(255, v | 0)).toString(16).padStart(2, "0")).join(""); }
  function klemm(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lichtK(n, Z, jahr) { return ST.lichtFaktor(ST.norm(n), Z, 0, jahr); }
  function phase(bau, a, b) { return Math.max(0, Math.min(1, (bau - a) / (b - a))); }
  function vieleck(g, pts) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); }
  function affin(g, V, o, eu, ev) {
    const p0 = V.p(o[0], o[1], o[2]), pu = V.p(o[0] + eu[0], o[1] + eu[1], o[2] + eu[2]), pv = V.p(o[0] + ev[0], o[1] + ev[1], o[2] + ev[2]);
    g.transform(pu[0] - p0[0], pu[1] - p0[1], pv[0] - p0[0], pv[1] - p0[1], p0[0], p0[1]);
  }
  function v3(a, b, k) { return [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]; }
  function norm3(a) { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function kreuz3(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function sicht(V, n) { const q = V.n(n[0], n[1], n[2]); return q[0] * AUGE[0] + q[1] * AUGE[1] + q[2] * AUGE[2]; }
  function huelle2(pts) {
    pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (pts.length < 3) return pts;
    const kr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], hi = [];
    for (const p of pts) { while (lo.length >= 2 && kr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (hi.length >= 2 && kr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
    hi.pop(); lo.pop(); return lo.concat(hi);
  }
  function rundPfad(g, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r); g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
  }

  /* Walze (Zylinder oder Kegelstumpf) im Raum, echt schattiert: der Verlauf
     quer zur Achse kommt aus den Normalen der sichtbaren Hälfte – Tasse,
     Kessel, Fass, Gasflasche, Kerze, Holzscheit. L(nKamera) → Lichtfaktor. */
  function walze(g, V, p0, p1, r0, r1, alb, L, opt) {
    opt = opt || {};
    const s = V.s, ax = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]], len = Math.hypot(ax[0], ax[1], ax[2]) || 1e-6;
    const a = [ax[0] / len, ax[1] / len, ax[2] / len];
    const e1 = norm3(kreuz3(a, Math.abs(a[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), e2 = kreuz3(a, e1);
    const R = Math.max(r0, r1) * s;
    const N = R > 16 ? 40 : R > 6 ? 24 : 12;
    const S0 = V.p(p0[0], p0[1], p0[2]), S1 = V.p(p1[0], p1[1], p1[2]);
    let Ax = S1[0] - S0[0], Ay = S1[1] - S0[1], la = Math.hypot(Ax, Ay);
    if (la < 1e-3) { Ax = 0; Ay = -1; la = 1; }
    Ax /= la; Ay /= la;
    const Px = -Ay, Py = Ax, cx = (S0[0] + S1[0]) / 2, cy = (S0[1] + S1[1]) / 2, kon = (r0 - r1) / len;
    const P0 = [], P1 = [], st = [];
    for (let k = 0; k < N; k++) {
      const t = k / N * TAU, c = Math.cos(t), sn = Math.sin(t);
      const n = [e1[0] * c + e2[0] * sn, e1[1] * c + e2[1] * sn, e1[2] * c + e2[2] * sn];
      const A0 = V.p(p0[0] + n[0] * r0, p0[1] + n[1] * r0, p0[2] + n[2] * r0), A1 = V.p(p1[0] + n[0] * r1, p1[1] + n[1] * r1, p1[2] + n[2] * r1);
      P0.push(A0); P1.push(A1);
      const nn = norm3(v3(n, a, kon)), nk = V.n(nn[0], nn[1], nn[2]);
      if (nk[0] * AUGE[0] + nk[1] * AUGE[1] + nk[2] * AUGE[2] > -0.03) st.push([((A0[0] + A1[0]) / 2 - cx) * Px + ((A0[1] + A1[1]) / 2 - cy) * Py, nk]);
    }
    const H = huelle2(P0.concat(P1));
    vieleck(g, H);
    if (st.length > 1 && R > 1.2 && !opt.flach) {
      st.sort((x, y) => x[0] - y[0]);
      const u0 = st[0][0], u1 = st[st.length - 1][0], du = (u1 - u0) || 1;
      const gr = g.createLinearGradient(cx + Px * u0, cy + Py * u0, cx + Px * u1, cy + Py * u1);
      const schritt = Math.max(1, Math.floor(st.length / 8));
      for (let i = 0; i < st.length; i += schritt) gr.addColorStop(klemm((st[i][0] - u0) / du, 0, 1), rgb(mul(alb, L(st[i][1]))));
      gr.addColorStop(1, rgb(mul(alb, L(st[st.length - 1][1]))));
      g.fillStyle = gr;
    } else g.fillStyle = rgb(mul(alb, L(V.n(-0.3, 0.5, 0.5))));
    g.fill();
    const da = sicht(V, a), oben = da >= 0 ? P1 : P0;
    if (opt.kappe !== false && Math.abs(da) > 0.02) { vieleck(g, oben); g.fillStyle = rgb(mul(opt.kappe || alb, L(V.n(a[0] * Math.sign(da), a[1] * Math.sign(da), a[2] * Math.sign(da))))); g.fill(); }
    return { P0: P0, P1: P1, oben: oben, da: da, e1: e1, e2: e2, a: a, S0: S0, S1: S1, H: H };
  }
  /* sichtbarer Teil eines Kreises im Raum (Reifen, Rand) als Linie */
  function ringLinie(g, V, c, e1, e2, r, farbe, breite, nur) {
    const s = V.s, N = r * s > 12 ? 36 : 18;
    g.beginPath(); let an = false;
    for (let k = 0; k <= N; k++) {
      const t = k / N * TAU, n = [e1[0] * Math.cos(t) + e2[0] * Math.sin(t), e1[1] * Math.cos(t) + e2[1] * Math.sin(t), e1[2] * Math.cos(t) + e2[2] * Math.sin(t)];
      const ok = nur === "alle" || sicht(V, n) > -0.02;
      const p = V.p(c[0] + n[0] * r, c[1] + n[1] * r, c[2] + n[2] * r);
      if (ok) { if (an) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); an = true; } else an = false;
    }
    g.strokeStyle = farbe; g.lineWidth = Math.max(0.5, breite * s); g.stroke();
  }

  /* Getönte Flecken: Rauschmuster als Farbe mit Deckkraft – bläuliche
     Mulden und weiße Kuppen im Schnee mit einem einzigen Füllbefehl */
  const TON = {};
  function tonMuster(saat, farbe, weich) {
    const k = saat + "|" + farbe + "|" + (weich ? 1 : 0);
    if (TON[k]) return TON[k];
    const q = PI.rauschBild(1 + (saat % 5), 128, 4, 3, 1.6).getContext("2d").getImageData(0, 0, 128, 128).data;
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d"), id = g.createImageData(128, 128), f = PI.hex(farbe);
    const u = weich ? 0.2 : 0.35, o = weich ? 0.8 : 0.5;
    for (let i = 0; i < 128 * 128; i++) {
      const v = klemm((q[i * 4] / 255 - u) / o, 0, 1);
      id.data[i * 4] = f[0]; id.data[i * 4 + 1] = f[1]; id.data[i * 4 + 2] = f[2]; id.data[i * 4 + 3] = Math.round(v * v * (3 - 2 * v) * 255);
    }
    g.putImageData(id, 0, 0);
    return (TON[k] = c);
  }
  function tonFlecken(g, x, y, w, h, meter, staerke, saat, farbe, weich) {
    const sd = Math.abs(saat | 0), m = g.createPattern(tonMuster(sd % 7, farbe, weich), "repeat");
    const k = meter / 128, a = (sd * 0.73) % TAU;
    m.setTransform(new DOMMatrix([k * Math.cos(a), k * Math.sin(a), -k * Math.sin(a), k * Math.cos(a), (sd * 0.37) % meter, (sd * 0.61) % meter]));
    g.save(); g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }
  function glitzer(g, F, x, y, w, h, dichte, rng, farbe) {
    if (F.px <= 18 || F.licht < 0.15) return;
    const k = Math.min(700, Math.round(w * h * dichte));
    g.beginPath();
    for (let i = 0; i < k; i++) { const r = (0.5 + rng() * 0.8) / F.px; g.rect(x + rng() * w, y + rng() * h, r, r); }
    g.fillStyle = farbe || "rgba(255,255,255,0.95)"; g.fill();
  }

  /* =====================================================================
     MASSE
     ===================================================================== */
  const B = 3.0, T = 2.2, S0 = 0.15, HW = 2.4, HF = 0.9, D = 0.08;
  const FIRST = HW + HF, NEIG = HF / (T / 2);
  const UEV = 0.06, UEH = 0.38, UEG = 0.22, DD = 0.1, SN = 0.1;   // Überstände vorn/hinten/Giebel, Dachdicke, Schneehöhe
  const OX = 1.3, OZ0 = 1.0, OZ1 = 2.2, TZ = 1.0;                // Öffnung 2,6 × 1,2 m, Thekenoberkante
  const KW = 2 * OX + 0.14, KL = 1.2, KD = 0.04, KWI = 65;         // Klappe (Winkel über der Waagrechten)
  const HY = T / 2 + 0.03, HZ = OZ1 - 0.02;                       // Scharnier der Klappe
  const SBW = 1.9, SBX = -0.45, AX = 0.95;                        // Schild (Breite, Mitte), Dachaufsatz
  const VORN = 40;                                                // Mitte weit vor der Front (Reihenfolge)
  const HOLZ = [[112, 72, 44], [128, 54, 40], [150, 112, 72], [92, 64, 46]];

  /* Licht im Inneren: tagsüber gedämpftes Himmelslicht, abends die warme
     Lichterkette unter dem Sturz */
  function innenLicht(Z, jahr, nacht, k) {
    const a = lichtK([0.2, 0.6, 0.77], Z, jahr);
    const w = (0.26 + 0.72 * nacht) * (k == null ? 1 : k);
    return [a[0] * 0.5 + w * 1.0, a[1] * 0.5 + w * 0.76, a[2] * 0.5 + w * 0.48];
  }

  /* =====================================================================
     WERKSTOFFE
     ===================================================================== */
  /* Blockbohlen: waagerechte Bohlen mit Nut und Feder, Eckbretter */
  function bohlen(g, W, H, farbe, F, saat, ohneEcken) {
    const rng = ST.zufall(saat);
    const bh = 0.14;
    g.fillStyle = rgb(skal(farbe, 0.62)); g.fillRect(-0.05, -0.05, W + 0.1, H + 0.1);
    for (let y = H, i = 0; y > -bh; y -= bh, i++) {
      const c = skal(farbe, 0.9 + rng() * 0.18);
      if (F.px * bh > 3) {
        const gr = g.createLinearGradient(0, y - bh, 0, y);
        gr.addColorStop(0, rgb(skal(c, 1.14))); gr.addColorStop(0.14, rgb(c)); gr.addColorStop(0.8, rgb(skal(c, 0.9))); gr.addColorStop(1, rgb(skal(c, 0.56)));
        g.fillStyle = gr;
      } else g.fillStyle = rgb(c);
      g.fillRect(-0.05, y - bh + 0.005, W + 0.1, bh - 0.005);
      if (F.px > 36) {
        g.lineWidth = Math.max(0.003, 0.7 / F.px);
        for (let k = 0; k < 3; k++) {
          const yy = y - bh * (0.25 + 0.25 * k) + (rng() - 0.5) * 0.02;
          g.strokeStyle = rgb(skal(c, 0.72), 0.4); g.beginPath(); g.moveTo(0, yy);
          for (let x = 0.35; x < W + 0.4; x += 0.35) g.lineTo(x, yy + (rng() - 0.5) * 0.012);
          g.stroke();
        }
        if (rng() < 0.45) { const x = rng() * W; g.fillStyle = rgb(skal(c, 0.5)); g.beginPath(); g.ellipse(x, y - bh / 2, 0.022, 0.013, 0, 0, TAU); g.fill(); g.strokeStyle = rgb(skal(c, 0.62), 0.6); g.beginPath(); g.ellipse(x, y - bh / 2, 0.04, 0.022, 0, 0, TAU); g.stroke(); }
      }
    }
    if (F.px > 20) PI.rauschen(g, 0, 0, W, H, 1.2, 0.18, saat % 50, 3);
    if (!ohneEcken) {
      for (const x of [0, W - 0.09]) {
        const gr = g.createLinearGradient(x, 0, x + 0.09, 0);
        gr.addColorStop(0, rgb(skal(farbe, 0.84))); gr.addColorStop(0.5, rgb(skal(farbe, 1.04))); gr.addColorStop(1, rgb(skal(farbe, 0.78)));
        g.fillStyle = gr; g.fillRect(x, -0.05, 0.09, H + 0.1);
      }
    }
  }
  /* Glattes Brett (Traufbrett, Ortgang, Klappe) mit Maserung */
  function brett(g, w, h, farbe, F, saat) {
    const rng = ST.zufall(saat);
    g.fillStyle = rgb(farbe); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
    if (F.px * h > 6) {
      g.lineWidth = Math.max(0.003, 0.7 / F.px);
      for (let i = 0; i < Math.max(2, h * 60); i++) {
        const y = rng() * h; g.strokeStyle = rgb(skal(farbe, 0.7 + rng() * 0.15), 0.35);
        g.beginPath(); g.moveTo(-0.05, y); for (let x = 0.4; x < w + 0.45; x += 0.4) g.lineTo(x, y + (rng() - 0.5) * 0.01); g.stroke();
      }
    }
    if (F.px > 20) PI.rauschen(g, 0, 0, w, h, 0.9, 0.16, saat % 40, 3);
  }

  /* Lärchenschindeln: Reihen von der Traufe zum First gelegt, jede Reihe
     überdeckt die darunter; ihr Fuß wirft einen Schatten auf die untere
     Reihe. Silbergrau verwittert mit braunen Nachzüglern.
     Dachfläche: x entlang der Traufe, y vom First (0) zur Traufe (h). */
  const REIHE = 0.13;
  function schindelnMalen(g, F, w, h, saat, opt) {
    opt = opt || {};
    const rng = ST.zufall(saat), px = F.pxV || F.px, bis = opt.bis == null ? h + 0.05 : Math.min(h + 0.05, opt.bis);
    g.fillStyle = "#34291f"; g.fillRect(-0.05, -0.05, w + 0.1, bis + 0.1);
    const FARBEN = [[132, 104, 78], [118, 92, 70], [146, 136, 124], [128, 120, 110], [104, 78, 56], [156, 120, 86]];
    const n = Math.ceil(h / REIHE) + 1;
    if (px * REIHE < 3.2) {
      /* weit weg: Reihenstreifen mit Fugenschatten */
      for (let r = 0; r < n; r++) {
        const y = r * REIHE; if (y > bis) break;
        g.fillStyle = rgb(streu(FARBEN[r % 3], rng, 0.08)); g.fillRect(-0.05, y, w + 0.1, REIHE);
        g.fillStyle = "rgba(24,16,10,0.4)"; g.fillRect(-0.05, y + REIHE - 0.018, w + 0.1, 0.018);
      }
      PI.rauschen(g, 0, 0, w, bis, 1.6, 0.25, 7, 3);
      return;
    }
    /* von der Traufe (unten) nach oben: jede Reihe legt sich über die untere */
    for (let r = n - 1; r >= 0; r--) {
      const y0 = r * REIHE;
      if (y0 > bis) continue;
      const fuss = y0 + REIHE;
      /* Schatten dieser Reihe auf die untere (sie liegt 1,5 cm höher) */
      g.fillStyle = "rgba(18,12,8,0.5)"; g.fillRect(-0.05, fuss - 0.004, w + 0.1, 0.024);
      g.fillStyle = "rgba(18,12,8,0.22)"; g.fillRect(-0.05, fuss + 0.02, w + 0.1, 0.02);
      let x = -(r % 2) * 0.06 - rng() * 0.05;
      while (x < w + 0.05) {
        const b = 0.07 + rng() * 0.09, ext = (rng() - 0.3) * 0.014;
        let c = FARBEN[(rng() * FARBEN.length) | 0];
        c = streu(c, rng, 0.07);
        if (opt.moos && rng() < 0.06 && y0 > h * 0.5) c = misch(c, [92, 104, 60], 0.45);
        const gr = g.createLinearGradient(0, y0, 0, fuss + ext);
        gr.addColorStop(0, rgb(skal(c, 0.62))); gr.addColorStop(0.55, rgb(skal(c, 0.92))); gr.addColorStop(0.9, rgb(skal(c, 1.08))); gr.addColorStop(1, rgb(skal(c, 0.78)));
        g.fillStyle = gr; g.fillRect(x + 0.005, y0, b - 0.01, REIHE + ext);
        if (px > 60) {
          g.strokeStyle = rgb(skal(c, 0.72), 0.5); g.lineWidth = 0.7 / px;
          g.beginPath(); for (let k = 0; k < 3; k++) { const xx = x + 0.015 + rng() * (b - 0.03); g.moveTo(xx, y0 + 0.02); g.lineTo(xx + (rng() - 0.5) * 0.01, fuss + ext - 0.01); } g.stroke();
          if (rng() < 0.2) { g.strokeStyle = "rgba(20,12,8,0.6)"; g.beginPath(); const xx = x + rng() * b; g.moveTo(xx, fuss + ext - 0.05); g.lineTo(xx + 0.004, fuss + ext); g.stroke(); }
        }
        x += b;
      }
    }
    PI.rauschen(g, 0, 0, w, bis, 2.2, 0.16, 9, 3);
  }
  function streu(a, rng, k) { const d = (rng() - 0.5) * 2 * k; return [a[0] * (1 + d), a[1] * (1 + d * 0.95), a[2] * (1 + d * 0.9)]; }

  /* Pulverschnee: Grundton, großflächige bläuliche Mulden, weiße Kuppen,
     lange flache Verwehungen */
  function schneeFlaeche(g, F, x, y, w, h, saat, opt) {
    opt = opt || {};
    const rng = ST.zufall(saat * 131 + 7);
    g.fillStyle = "rgb(233,238,246)"; g.fillRect(x, y, w, h);
    const wl = g.createLinearGradient(x, 0, x + w, 0);
    wl.addColorStop(0, "rgba(160,178,212," + (0.04 + rng() * 0.08).toFixed(3) + ")"); wl.addColorStop(0.5, "rgba(160,178,212,0)"); wl.addColorStop(1, "rgba(160,178,212," + (0.04 + rng() * 0.08).toFixed(3) + ")");
    g.fillStyle = wl; g.fillRect(x, y, w, h);
    if (F.px > 3) {
      tonFlecken(g, x, y, w, h, 2.6, 0.55, saat + 31, "#b9c6da", true);
      if (opt.zwischen) opt.zwischen();
      tonFlecken(g, x, y, w, h, 1.5, 0.75, saat + 47, "#f6f8fc", true);
      if (F.px > 16) tonFlecken(g, x, y, w, h, 0.55, 0.3, saat + 53, "#c9d4e6");
    }
    const n = Math.min(5, Math.round(w * h * 0.25) + 2);
    for (let i = 0; i < n; i++) {
      const cx = x + rng() * w, cy = y + rng() * h, rx = 0.6 + rng() * 1.2, ry = 0.06 + rng() * 0.12, hellK = rng() < 0.5;
      const gg = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
      gg.addColorStop(0, hellK ? "rgba(252,253,255,0.5)" : "rgba(150,168,206,0.2)"); gg.addColorStop(1, hellK ? "rgba(252,253,255,0)" : "rgba(150,168,206,0)");
      g.save(); g.translate(cx, cy); g.scale(1, ry / rx); g.fillStyle = gg; g.beginPath(); g.arc(0, 0, rx, 0, TAU); g.fill(); g.restore();
    }
  }
  /* Schindelreihen unter dem Schnee als weiche Wellen: oben eine
     Lichtkante, darunter ein blauer Schatten – stückweise, mit eigener
     Stärke, zur Traufe hin schwächer (dort liegt mehr Schnee) */
  function rippen(g, F, w, h, saat) {
    const pxV = F.pxV || F.px;
    if (pxV * REIHE < 2.2) return;
    const rng = ST.zufall(saat * 3 + 1), st = klemm((pxV * REIHE - 2.2) / 3, 0.35, 1);
    const reihen = [[], [], []];
    for (let yu = REIHE; yu < h - 0.08; yu += REIHE) {
      const t = yu / h;
      let x = -0.1 - rng() * 0.4;
      while (x < w + 0.1) {
        const l = 0.3 + rng() * 1.3, q = rng() + t * 0.45;
        if (q < 0.95) { const pts = []; for (let xx = x; xx <= x + l + 0.001; xx += Math.min(0.25, l / 2)) pts.push([xx, yu + (rng() - 0.5) * 0.016]); reihen[q < 0.35 ? 0 : q < 0.65 ? 1 : 2].push(pts); }
        x += l;
      }
    }
    const band = (liste, d0, d1) => { g.beginPath(); for (const P of liste) { g.moveTo(P[0][0], P[0][1] + d0); for (let i = 1; i < P.length; i++) g.lineTo(P[i][0], P[i][1] + d0); for (let i = P.length - 1; i >= 0; i--) g.lineTo(P[i][0], P[i][1] + d1); g.closePath(); } };
    reihen.forEach((liste, k) => {
      if (!liste.length) return;
      const m = st * [1, 0.65, 0.35][k];
      band(liste, -0.02, 0); g.fillStyle = "rgba(255,255,255," + (0.3 * m).toFixed(3) + ")"; g.fill();
      band(liste, 0, 0.04); g.fillStyle = "rgba(112,130,184," + (0.16 * m).toFixed(3) + ")"; g.fill();
      band(liste, 0, 0.016); g.fillStyle = "rgba(100,118,176," + (0.16 * m).toFixed(3) + ")"; g.fill();
    });
  }

  /* Schnee auf einer Dachfläche der Bude. o = { saat, schild: [x0,x1]
     (Schildfuß in Flächen-x) }. Am First weht der Wind ihn dünn: dort
     schauen Schindeln durch, Schnee nur in den Absätzen; darunter die
     geschlossene, leicht gewölbte Decke mit gerundeter Abbruchkante. */
  function dachSchnee(g, F, w, h, o) {
    const saat = o.saat, rng = ST.zufall(saat * 7 + 3), pxV = F.pxV || F.px;
    schindelnMalen(g, F, w, h, saat + 7, { bis: 0.6 });
    const grenze = (x) => klemm(0.06 + (ST.fbm(x * 0.9 + saat * 0.7, saat * 0.31, 3, saat) - 0.36) * 0.95 + 0.025 * Math.sin(x * 2.3 + saat), 0.03, 0.42);
    const kante = []; for (let x = -0.1; x <= w + 0.12; x += 0.06) kante.push([x, grenze(x)]);
    g.fillStyle = "rgba(226,232,242,0.3)"; g.fillRect(-0.1, -0.1, w + 0.2, 0.75);
    if (pxV * REIHE > 2.5) {
      g.beginPath();
      for (let yu = REIHE; yu < 0.62; yu += REIHE) {
        let x = -0.1 - rng() * 0.2;
        while (x < w) {
          const len = 0.04 + Math.pow(rng(), 2) * 0.45, gap = 0.03 + Math.pow(rng(), 1.5) * 0.32, d = 0.008 + rng() * 0.02;
          if (yu < grenze(x) + 0.1 && rng() < 0.85) rundPfad(g, x, yu - d, len, d + 0.006, d * 0.5);
          x += len + gap;
        }
      }
      g.fillStyle = "rgba(240,244,250,0.92)"; g.fill();
    }
    g.save();
    g.beginPath(); g.moveTo(-0.1, h + 0.1); for (const [x, y] of kante) g.lineTo(x, y); g.lineTo(w + 0.12, h + 0.1); g.closePath(); g.clip();
    schneeFlaeche(g, F, -0.1, 0, w + 0.25, h + 0.1, saat, { zwischen: () => rippen(g, F, w, h, saat) });
    /* Verwehung an der Traufe: ein heller Wulst, darüber eine bläuliche Mulde */
    const wulst = []; for (let x = -0.1; x <= w + 0.12; x += 0.08) wulst.push([x, h - 0.2 - 0.07 * ST.fbm(x * 1.3 + saat, 3.1, 3, saat + 5) + 0.02 * Math.sin(x * 4.1 + saat)]);
    g.beginPath(); g.moveTo(-0.1, h + 0.1); for (const [x, y] of wulst) g.lineTo(x, y); g.lineTo(w + 0.12, h + 0.1); g.closePath();
    const gw = g.createLinearGradient(0, h - 0.3, 0, h);
    gw.addColorStop(0, "rgba(252,253,255,0)"); gw.addColorStop(0.35, "rgba(252,253,255,0.55)"); gw.addColorStop(1, "rgba(246,249,255,0.35)");
    g.fillStyle = gw; g.fill();
    g.beginPath(); wulst.forEach(([x, y], i) => (i ? g.lineTo(x, y - 0.02) : g.moveTo(x, y - 0.02)));
    g.strokeStyle = "rgba(128,146,196,0.2)"; g.lineWidth = 0.06; g.stroke();
    /* bläuliche Verdeckung am First und am Schildfuß */
    const gf = g.createLinearGradient(0, 0, 0, 0.4);
    gf.addColorStop(0, "rgba(116,136,188,0.34)"); gf.addColorStop(1, "rgba(116,136,188,0)");
    g.fillStyle = gf; g.fillRect(-0.1, 0, w + 0.2, 0.4);
    if (o.schild) {
      const cx = (o.schild[0] + o.schild[1]) / 2, rx = (o.schild[1] - o.schild[0]) / 2 + 0.35;
      const gs = g.createRadialGradient(cx, 0.02, 0, cx, 0.02, rx);
      gs.addColorStop(0, "rgba(104,124,180,0.32)"); gs.addColorStop(1, "rgba(104,124,180,0)");
      g.save(); g.translate(cx, 0.02); g.scale(1, 0.5 / rx); g.translate(-cx, -0.02); g.fillStyle = gs; g.beginPath(); g.arc(cx, 0.02, rx, 0, TAU); g.fill(); g.restore();
    }
    if (o.aufsatz) {
      const cx = o.aufsatz, gs = g.createRadialGradient(cx, 0.02, 0, cx, 0.02, 0.7);
      gs.addColorStop(0, "rgba(104,124,180,0.3)"); gs.addColorStop(1, "rgba(104,124,180,0)");
      g.fillStyle = gs; g.fillRect(cx - 0.7, 0, 1.4, 0.7);
    }
    g.restore();
    /* gerundete Abbruchkante: Schatten unten, Lichtkante oben */
    g.lineJoin = "round"; g.lineCap = "round";
    g.beginPath(); kante.forEach(([x, y], i) => (i ? g.lineTo(x, y + 0.03) : g.moveTo(x, y + 0.03)));
    g.strokeStyle = "rgba(136,154,200,0.3)"; g.lineWidth = Math.max(0.03, 1.2 / F.px); g.stroke();
    g.beginPath(); kante.forEach(([x, y], i) => (i ? g.lineTo(x, y + 0.006) : g.moveTo(x, y + 0.006)));
    g.strokeStyle = "rgba(250,252,255,0.95)"; g.lineWidth = Math.max(0.02, 1.0 / F.px); g.stroke();
    if (F.licht > 0.25) glitzer(g, F, 0, 0.1, w, h - 0.1, 7, rng);
  }

  /* Schneekante an der Traufe (eigene Fläche, 5 cm vor dem Traufbrett,
     keinLicht → selbst beleuchtet): oben im Licht der Dachfläche, vorn
     im Licht der Wand, unten bläulich im Eigenschatten; Buckel, zwei
     Abbruchstellen, darunter Eiszapfen am Traufbrett. */
  function schneeKante(o) {
    return function (g, F) {
      const w = F.w, rng = ST.zufall(o.saat), th = Math.atan(NEIG), sT = Math.sin(th), cT = Math.cos(th);
      const lD = lichtK([F.n[0] * sT, F.n[1] * sT, cT], F.zeit, F.jahr), lV = lichtK(F.n, F.zeit, F.jahr), lU = lichtK([F.n[0] * 0.6, F.n[1] * 0.6, -0.8], F.zeit, F.jahr);
      const ph = rng() * 6, br = [];
      for (let i = 0; i < 2; i++) br.push([0.4 + rng() * Math.max(0.1, w - 0.8), 0.18 + rng() * 0.3]);
      const unten = (x) => {
        let y = o.dick + 0.02 * Math.sin(x * 6.1 + ph) + 0.012 * Math.sin(x * 13.7 + ph * 2) + o.haengt * Math.pow(0.5 + 0.5 * Math.cos(x * 2.6 + ph), 3);
        for (const [bx, bl] of br) { const d = Math.abs(x - bx); if (d < bl / 2) y -= (o.dick * 0.35) * Math.sqrt(1 - Math.pow(d / (bl / 2), 4)); }
        return Math.max(0.03, y);
      };
      g.save();
      g.beginPath(); g.moveTo(-0.02, 0); for (let x = -0.02; x <= w + 0.02; x += 0.03) g.lineTo(x, -0.004 + 0.004 * Math.sin(x * 9)); for (let x = w + 0.02; x >= -0.02; x -= 0.025) g.lineTo(x, unten(x)); g.closePath();
      const ym = o.dick + o.haengt;
      const gr = g.createLinearGradient(0, 0, 0, ym);
      gr.addColorStop(0, rgb(mul([252, 253, 255], lD))); gr.addColorStop(0.22, rgb(mul([244, 247, 253], misch(lD, lV, 0.6)))); gr.addColorStop(0.65, rgb(mul([226, 233, 247], lV))); gr.addColorStop(1, rgb(mul([178, 194, 224], lU)));
      g.fillStyle = gr; g.fill();
      g.clip();
      if (F.px > 8) tonFlecken(g, 0, 0, w, ym, 0.9, 0.35, o.saat + 3, "#b4c2dc", true);
      glitzer(g, F, 0, 0, w, o.dick * 0.5, 30, rng, rgb(mul([255, 255, 255], lD), 0.9));
      if (o.warm && F.nacht > 0) {
        const gw = g.createLinearGradient(0, 0, 0, ym);
        gw.addColorStop(0, "rgba(255,176,90,0)"); gw.addColorStop(1, "rgba(255,176,90," + (0.35 * F.nacht).toFixed(3) + ")");
        g.globalCompositeOperation = "lighter"; g.fillStyle = gw; g.fillRect(0, 0, w, ym); g.globalCompositeOperation = "source-over";
      }
      g.restore();
      /* Lichtkante der Rundung */
      g.beginPath(); for (let x = 0; x <= w; x += 0.05) g.lineTo(x, 0.012 + 0.004 * Math.sin(x * 9));
      g.strokeStyle = rgb(mul([255, 255, 255], lD), 0.75); g.lineWidth = Math.max(0.006, 0.8 / F.px); g.stroke();
      if (o.eis > 0) eiszapfen(g, F, 0.06, w - 0.06, o.eisY, o.eis, rng, lV, o.warm);
    };
  }
  /* Eiszapfen: in Gruppen, durchscheinend, mit heller Kernlinie und Tropfen */
  function eiszapfen(g, F, x0, x1, y, laenge, rng, lV, warm) {
    const L = (c, a) => rgb(mul(c, lV), a);
    let x = x0 + rng() * 0.1;
    while (x < x1) {
      const gruppe = rng() < 0.4;
      const l = laenge * (gruppe ? 0.4 + rng() * 0.6 : 0.08 + Math.pow(rng(), 2) * 0.45), b = 0.012 + l * 0.07;
      const gr = g.createLinearGradient(x - b, 0, x + b, 0);
      gr.addColorStop(0, L([176, 204, 232], 0.45)); gr.addColorStop(0.35, L([246, 251, 255], 0.9)); gr.addColorStop(0.6, L([214, 232, 250], 0.7)); gr.addColorStop(1, L([140, 172, 210], 0.45));
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(x - b, y); g.quadraticCurveTo(x - b * 0.45, y + l * 0.55, x + (rng() - 0.5) * 0.006, y + l); g.quadraticCurveTo(x + b * 0.45, y + l * 0.55, x + b, y); g.closePath(); g.fill();
      if (F.px > 30) {
        g.strokeStyle = L([255, 255, 255], 0.6); g.lineWidth = Math.max(0.003, 0.6 / F.px);
        g.beginPath(); g.moveTo(x - b * 0.3, y + 0.004); g.lineTo(x - b * 0.1, y + l * 0.7); g.stroke();
        g.fillStyle = L([240, 248, 255], 0.8); g.beginPath(); g.arc(x, y + l, Math.max(0.003, b * 0.25), 0, TAU); g.fill();
      }
      if (warm && F.nacht > 0.1) { g.fillStyle = "rgba(255,196,120," + (0.5 * F.nacht).toFixed(3) + ")"; g.beginPath(); g.arc(x + b * 0.2, y + l * 0.3, Math.max(0.004, b * 0.3), 0, TAU); g.fill(); }
      x += gruppe ? 0.025 + rng() * 0.05 : 0.09 + rng() * 0.3;
    }
  }

  /* Lichterkette in Flächen-Koordinaten: Kabel, alle 0,5–0,7 m an einem
     Haken, dazwischen durchhängend; Birnchen an Fassungen, tagsüber
     warm getöntes Glas mit Glanzpunkt, abends mit weichem Hof. Jeder
     angefangene Meter bekommt einen Lichtpunkt für den Schein der Szene. */
  function lichterKette(g, F, pts, opt) {
    opt = opt || {};
    const an = opt.an !== false && F.nacht > 0.01, rng = ST.zufall(opt.saat || 5), px = F.px;
    const L = opt.L || [1, 1, 1];
    const seg = [];
    let laenge = 0;
    for (let i = 0; i + 1 < pts.length; i++) {
      const A = pts[i], Bp = pts[i + 1], l = Math.hypot(Bp[0] - A[0], Bp[1] - A[1]), n = Math.max(1, Math.round(l / 0.6));
      laenge += l;
      for (let k = 0; k < n; k++) seg.push({ A: [A[0] + (Bp[0] - A[0]) * k / n, A[1] + (Bp[1] - A[1]) * k / n], B: [A[0] + (Bp[0] - A[0]) * (k + 1) / n, A[1] + (Bp[1] - A[1]) * (k + 1) / n], sag: (opt.sag == null ? 0.05 : opt.sag) * (0.7 + rng() * 0.6) });
    }
    const punkt = (s, t) => { const cx = (s.A[0] + s.B[0]) / 2, cy = (s.A[1] + s.B[1]) / 2 + s.sag * 2, u = 1 - t; return [u * u * s.A[0] + 2 * u * t * cx + t * t * s.B[0], u * u * s.A[1] + 2 * u * t * cy + t * t * s.B[1]]; };
    const birnen = [];
    const abst = opt.abstand || 0.15;
    for (const s of seg) { const l = Math.hypot(s.B[0] - s.A[0], s.B[1] - s.A[1]), n = Math.max(1, Math.round(l / abst)); for (let k = 0; k < n; k++) { const p = punkt(s, (k + 0.5) / n); birnen.push([p[0], p[1] + 0.012, 1 + (rng() - 0.5) * 0.3, rng() < 0.03]); } }
    g.save();
    g.beginPath(); for (const s of seg) { g.moveTo(s.A[0], s.A[1]); g.quadraticCurveTo((s.A[0] + s.B[0]) / 2, (s.A[1] + s.B[1]) / 2 + s.sag * 2, s.B[0], s.B[1]); }
    g.strokeStyle = rgb(mul([34, 44, 30], L)); g.lineWidth = Math.max(0.006, 0.7 / px); g.stroke();
    if (px > 10) {
      g.beginPath(); for (const b of birnen) g.rect(b[0] - 0.007 * b[2], b[1] - 0.012, 0.014 * b[2], 0.016); g.fillStyle = rgb(mul([44, 50, 42], L)); g.fill();
      g.beginPath(); for (const b of birnen) { g.moveTo(b[0] + 0.012 * b[2], b[1] + 0.017 * b[2]); g.ellipse(b[0], b[1] + 0.017 * b[2], 0.012 * b[2], 0.018 * b[2], 0, 0, TAU); }
      g.fillStyle = an ? "rgb(255,236,190)" : rgb(mul([243, 226, 176], L)); g.fill();
      if (!an && px > 28) { g.beginPath(); for (const b of birnen) { g.moveTo(b[0] - 0.004 + 0.004, b[1] + 0.011); g.arc(b[0] - 0.004, b[1] + 0.011, 0.004, 0, TAU); } g.fillStyle = rgb(mul([255, 255, 255], L), 0.85); g.fill(); }
    } else { g.beginPath(); for (const b of birnen) g.rect(b[0] - 0.014, b[1], 0.028, 0.032); g.fillStyle = an ? "rgb(255,226,160)" : rgb(mul([243, 226, 176], L)); g.fill(); }
    if (an) {
      const a = F.nacht;
      g.globalCompositeOperation = "lighter";
      if (px > 50) {
        for (const b of birnen) {
          if (b[3]) continue;
          const cy = b[1] + 0.017, gg = g.createRadialGradient(b[0], cy, 0, b[0], cy, 0.13);
          gg.addColorStop(0, "rgba(255,248,224," + a.toFixed(3) + ")"); gg.addColorStop(0.15, "rgba(255,222,150," + (0.8 * a).toFixed(3) + ")"); gg.addColorStop(0.45, "rgba(255,184,96," + (0.25 * a).toFixed(3) + ")"); gg.addColorStop(1, "rgba(255,160,70,0)");
          g.fillStyle = gg; g.fillRect(b[0] - 0.13, cy - 0.13, 0.26, 0.26);
        }
      } else {
        for (const [r, al] of [[0.1, 0.1], [0.055, 0.26], [0.024, 0.9]]) {
          g.beginPath(); for (const b of birnen) if (!b[3]) { g.moveTo(b[0] + r, b[1] + 0.017); g.arc(b[0], b[1] + 0.017, r, 0, TAU); }
          g.fillStyle = "rgba(255,212,140," + (al * a).toFixed(3) + ")"; g.fill();
        }
      }
      g.globalCompositeOperation = "source-over";
      if (F.leuchtPunkt && opt.schein !== false) {
        const n = Math.max(1, Math.round(laenge / (opt.scheinAbstand || 1.2)));
        for (let i = 0; i < n; i++) { const b = birnen[Math.floor((i + 0.5) / n * birnen.length)]; if (b) F.leuchtPunkt(b[0], b[1] + 0.02, opt.scheinR || 0.5, "255,196,110", opt.scheinK || 0.3, true); }
      }
    }
    g.restore();
  }

  /* Tannengirlande entlang einer Linie (Flächen-Koordinaten): gebundenes
     Tannengrün aus einzelnen Zweiglein – jedes verjüngt, mit Nadeln –,
     obenauf Schneehäubchen mit unruhigem Umriss (Winter). L = Lichtfaktor. */
  function tannenGirlande(g, F, linie, dicke, winter, L, saat) {
    const rng = ST.zufall(saat), px = F.px;
    const P = (t) => { const n = linie.length - 1, i = Math.min(n - 1, Math.floor(t * n)), u = t * n - i; return [linie[i][0] + (linie[i + 1][0] - linie[i][0]) * u, linie[i][1] + (linie[i + 1][1] - linie[i][1]) * u]; };
    let lang = 0; for (let i = 0; i + 1 < linie.length; i++) lang += Math.hypot(linie[i + 1][0] - linie[i][0], linie[i + 1][1] - linie[i][1]);
    /* Grundkörper: dunkles, weiches Band */
    g.lineCap = "round"; g.lineJoin = "round";
    g.beginPath(); linie.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
    g.strokeStyle = rgb(mul(winter ? [18, 40, 26] : [34, 70, 34], L)); g.lineWidth = dicke * 0.8; g.stroke();
    const n = Math.round(lang * (px > 40 ? 70 : px > 16 ? 30 : 12));
    const eimer = [[], [], []];
    for (let i = 0; i < n; i++) {
      const p = P(rng()), a = rng() * TAU, l = dicke * (0.45 + rng() * 0.4);
      const x = p[0] + (rng() - 0.5) * dicke * 0.5, y = p[1] + (rng() - 0.5) * dicke * 0.35;
      eimer[(rng() * 3) | 0].push([x, y, x + Math.cos(a) * l, y + Math.sin(a) * l * 0.8, a]);
    }
    const FF = winter ? [[24, 58, 34], [34, 76, 44], [52, 98, 58]] : [[46, 96, 40], [62, 118, 48], [86, 140, 60]];
    eimer.forEach((liste, k) => {
      g.beginPath();
      for (const [x0, y0, x1, y1, a] of liste) {
        g.moveTo(x0, y0); g.lineTo(x1, y1);
        if (px > 45) for (let j = 1; j <= 4; j++) { const u = j / 5, bx = x0 + (x1 - x0) * u, by = y0 + (y1 - y0) * u, nl = dicke * 0.14 * (1 - u * 0.5); g.moveTo(bx, by); g.lineTo(bx + Math.cos(a + 0.8) * nl, by + Math.sin(a + 0.8) * nl); g.moveTo(bx, by); g.lineTo(bx + Math.cos(a - 0.8) * nl, by + Math.sin(a - 0.8) * nl); }
      }
      g.strokeStyle = rgb(mul(FF[k], L)); g.lineWidth = Math.max(0.004, dicke * (px > 45 ? 0.07 : 0.16)); g.stroke();
    });
    if (winter) {
      /* Schneehäubchen: unruhige Polster aus überlappenden Tupfen, oben
         weiß, unten bläulich – keine gleichförmigen Pillen */
      const nS = Math.round(lang * (px > 30 ? 9 : 4));
      for (let i = 0; i < nS; i++) {
        const p = P(rng()), bw = dicke * (0.35 + rng() * 0.5), y = p[1] - dicke * 0.28;
        g.beginPath();
        for (let k = 0; k < 4; k++) { const cx = p[0] + (k - 1.5) * bw * 0.28 + (rng() - 0.5) * bw * 0.1, r = bw * (0.18 + rng() * 0.14); g.moveTo(cx + r, y); g.ellipse(cx, y + (rng() - 0.5) * r * 0.4, r, r * (0.45 + rng() * 0.2), 0, 0, TAU); }
        g.fillStyle = rgb(mul([198, 212, 236], L), 0.9); g.fill();
        g.save(); g.translate(0, -dicke * 0.05); g.fillStyle = rgb(mul([248, 250, 255], L), 0.95); g.fill(); g.restore();
      }
    }
  }

  /* Herz, Stern */
  function herzPfad(g, x, y, r) {
    g.beginPath(); g.moveTo(x, y + r * 0.9);
    g.bezierCurveTo(x - r * 1.3, y + r * 0.1, x - r * 0.8, y - r * 0.9, x, y - r * 0.35);
    g.bezierCurveTo(x + r * 0.8, y - r * 0.9, x + r * 1.3, y + r * 0.1, x, y + r * 0.9); g.closePath();
  }
  function sternPfad(g, x, y, r, n, innen) { g.beginPath(); for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * TAU - Math.PI / 2, rr = i % 2 ? r * innen : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); }
  /* Lebkuchenherz mit Zuckerguss: Rand, Schrift, Blümchen */
  function lebkuchenHerz(g, x, y, r, L, px, text, farbe) {
    herzPfad(g, x, y, r);
    const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r * 1.2);
    gr.addColorStop(0, rgb(mul([176, 104, 52], L))); gr.addColorStop(1, rgb(mul([120, 64, 30], L)));
    g.fillStyle = gr; g.fill();
    g.strokeStyle = rgb(mul([250, 248, 240], L)); g.lineWidth = r * 0.07;
    g.save(); g.setLineDash([r * 0.06, r * 0.05]); herzPfad(g, x, y, r * 0.84); g.stroke(); g.restore();
    g.fillStyle = rgb(mul(farbe || [200, 30, 40], L));
    if (px * r > 22 && text) { g.font = "bold " + (r * 0.26).toFixed(3) + "px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, x, y + r * 0.02); }
    else { g.fillRect(x - r * 0.45, y - r * 0.06, r * 0.9, r * 0.14); }
    for (const dx of [-0.42, 0.42]) { g.fillStyle = rgb(mul([238, 190, 214], L)); g.beginPath(); g.arc(x + dx * r, y - r * 0.38, r * 0.09, 0, TAU); g.fill(); g.fillStyle = rgb(mul([60, 140, 70], L)); g.beginPath(); g.ellipse(x + dx * r + r * 0.1, y - r * 0.3, r * 0.07, r * 0.03, 0.5, 0, TAU); g.fill(); }
  }

  /* =====================================================================
     VARIANTEN
     ===================================================================== */
  const WINTER = [
    { id: "gluehwein", schild: "Glühwein", unter: "heißer Punsch · Kinderpunsch", brett: [96, 22, 30], tuch: [150, 28, 36] },
    { id: "lebkuchen", schild: "Lebkuchen", unter: "Herzen · Printen · Pfeffernüsse", brett: [60, 36, 22], tuch: [120, 70, 36] },
    { id: "mandeln", schild: "Gebrannte Mandeln", unter: "frisch aus dem Kupferkessel", brett: [30, 58, 40], tuch: [42, 92, 60] },
    { id: "holzkunst", schild: "Erzgebirgische Holzkunst", unter: "Nussknacker · Räuchermännchen", brett: [34, 46, 78], tuch: [40, 60, 120] },
    { id: "kerzen", schild: "Kerzen & Wachs", unter: "handgezogen · Bienenwachs", brett: [70, 30, 60], tuch: [120, 40, 90] }
  ];
  const FRUEHLING = [
    { id: "blumen", schild: "Blumen", unter: "Tulpen · Narzissen · Sträuße", brett: [42, 88, 58], tuch: [60, 130, 80] },
    { id: "spargel", schild: "Spargel & Erdbeeren", unter: "frisch vom Feld", brett: [230, 224, 206], hell: true, tuch: [190, 40, 50] }
  ];
  function variante(o) {
    const s = Math.abs((o.saat | 0)) || 1;
    if (o.jahr === "winter") return WINTER[s % WINTER.length];
    return FRUEHLING[s % FRUEHLING.length];
  }
  function schildText(g, text, x, y, w, groesse, farbe, px) {
    if (px * groesse < 5) { g.fillStyle = farbe; g.fillRect(x - w * 0.35, y - groesse * 0.35, w * 0.7, groesse * 0.4); return; }
    g.save();
    g.font = "italic bold " + groesse + "px Georgia, 'DejaVu Serif', serif";
    g.textAlign = "center"; g.textBaseline = "middle";
    const m = g.measureText(text).width;
    if (m > w) { g.translate(x, y); g.scale(w / m, 1); g.translate(-x, -y); }
    g.fillStyle = "rgba(0,0,0,0.35)"; g.fillText(text, x + groesse * 0.04, y + groesse * 0.05);
    g.fillStyle = farbe; g.fillText(text, x, y);
    g.restore();
  }

  /* =====================================================================
     DIE GESTALT (Verkäuferin, Nussknacker) – mit ST.gestalt wie die
     Menschen der Stadt: Ellipsoide und Kapseln, echt schattiert
     ===================================================================== */
  function buehne(F, s, ox, oy, oz, dim, lampen) {
    const GS = ST.gestalt; if (!GS) return null;
    const r = F.gier * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
    const Z = F.Z, d = dim == null ? 1 : dim;
    const Zi = { name: Z.name, amb: skal(Z.amb, d), sonne: skal(Z.sonne, d * d), nacht: Z.nacht, schatten: Z.schatten };
    const Bh = new GS.Buehne({ s: s, X0: 0, Y0: 0, Z: Zi, jahr: F.jahr });
    Bh.rahmen(GS.modellRahmen(c, sn));
    if (lampen) Bh.lampen = lampen.map((l) => ({ p: Bh.pk([l.p[0] - ox, l.p[1] - oy, l.p[2] - oz]), r: l.r, farbe: l.farbe, k: l.k }));
    return Bh;
  }
  function ik(S, Tz, L1, L2, pol) {
    const d = [Tz[0] - S[0], Tz[1] - S[1], Tz[2] - S[2]];
    let l = Math.hypot(d[0], d[1], d[2]);
    const dir = [d[0] / (l || 1), d[1] / (l || 1), d[2] / (l || 1)];
    l = klemm(l, Math.abs(L1 - L2) + 1e-3, L1 + L2 - 1e-3);
    const ca = (L1 * L1 + l * l - L2 * L2) / (2 * L1 * l), h = L1 * Math.sqrt(Math.max(0, 1 - ca * ca));
    const pd = pol[0] * dir[0] + pol[1] * dir[1] + pol[2] * dir[2];
    const pp = norm3([pol[0] - dir[0] * pd, pol[1] - dir[1] * pd, pol[2] - dir[2] * pd]);
    return [[S[0] + dir[0] * ca * L1 + pp[0] * h, S[1] + dir[1] * ca * L1 + pp[1] * h, S[2] + dir[2] * ca * L1 + pp[2] * h], [S[0] + dir[0] * l, S[1] + dir[1] * l, S[2] + dir[2] * l]];
  }
  /* Die Verkäuferin / der Verkäufer: steht dicht an der Theke, die linke
     Hand liegt auf dem Brett, die rechte hält eine Tasse, eine Tüte oder
     die Kelle. Kleidung wie die Leute der Stadt (menschen.js). */
  const JACKE = [[132, 34, 40], [40, 62, 104], [58, 84, 52], [96, 74, 58], [70, 70, 80], [52, 54, 60]];
  const HAUT = [[236, 198, 172], [228, 184, 154], [214, 164, 132], [178, 126, 94]];
  const HAAR = [[58, 40, 28], [28, 24, 22], [190, 154, 98], [168, 166, 162], [118, 62, 36]];
  function verkaeuferMalen(g, s, F, o, art, fx, fy, fz) {
    if (F.schatten) return;
    const rng = ST.zufall((o.saat | 0) * 3 + 1);
    const w = (L) => L[(rng() * L.length) | 0];
    const frau = rng() < 0.5, winter = F.jahr === "winter";
    const jacke = w(JACKE), haut = w(HAUT), haar = w(HAAR);
    const nacht = F.nacht;
    const Bh = buehne(F, s, fx, fy, fz, 0.8, [{ p: [0.1, T / 2 - 0.05, OZ1 - 0.1], r: 2.0, farbe: [1, 0.74, 0.44], k: 0.5 + 1.3 * nacht }, { p: [0.3, T / 2 + 0.6, 1.6], r: 1.8, farbe: [0.6, 0.62, 0.7], k: 0.35 * (1 - nacht) }]);
    if (!Bh) return;
    Bh.gruppe(0);
    const H = frau ? 1.66 : 1.78, kr = 0.066 * H, sb = 0.1 * H;
    const hz = 0.53 * H, schulter = 0.815 * H;
    /* Rumpf mit Jacke (bis unter die Theke), Schürze davor */
    const flecken = s > 26 ? [{ c: [0, 0.075 * H, 0.64 * H], a: [[0.006 * H, 0, 0], [0, 0.01 * H, 0], [0, 0, 0.14 * H]], alb: skal(jacke, 0.7), n: [0, 1, 0], k: 0.5 }] : null;
    Bh.koerper([
      { c: [0, -0.004 * H, schulter + 0.012 * H], a: [[0.112 * H, 0, 0], [0, 0.066 * H, 0], [0, 0, 0.045 * H]] },
      { c: [0, 0.006 * H, 0.72 * H], a: [[0.106 * H, 0, 0], [0, 0.076 * H, 0], [0, 0, 0.07 * H]] },
      { c: [0, 0.002 * H, 0.58 * H], a: [[0.098 * H, 0, 0], [0, 0.07 * H, 0], [0, 0, 0.05 * H]] },
      { c: [0, 0, 0.44 * H], a: [[0.1 * H, 0, 0], [0, 0.07 * H, 0], [0, 0, 0.03 * H]] }
    ], jacke, { flecken: flecken });
    const schuerze = art === "gluehwein" || art === "mandeln" ? [70, 30, 30] : art === "blumen" || art === "spargel" ? [70, 100, 60] : [226, 218, 200];
    Bh.platte([[-0.075 * H, 0.08 * H, 0.66 * H], [0.075 * H, 0.08 * H, 0.66 * H], [0.09 * H, 0.078 * H, 0.42 * H], [-0.09 * H, 0.078 * H, 0.42 * H]], schuerze, { n: [0, 1, 0.05], tiefe: 0.05 });
    if (s > 30) Bh.band([[-0.075 * H, 0.081 * H, 0.66 * H], [-0.05 * H, 0.06 * H, 0.8 * H], [0, 0.07 * H, 0.82 * H], [0.05 * H, 0.06 * H, 0.8 * H], [0.075 * H, 0.081 * H, 0.66 * H]], 0.012, skal(schuerze, 0.8), { tiefe: 0.051 });
    /* Arme */
    const theke = TZ - fz + 0.03, vor = (T / 2 + 0.08) - fy;
    const hand = [[-0.17, vor, theke], art === "gluehwein" ? [0.12, vor - 0.06, theke + 0.24] : art === "mandeln" ? [0.16, vor - 0.02, theke + 0.12] : [0.18, vor, theke + 0.02]];
    const handPunkte = [];
    for (let i = 0; i < 2; i++) {
      const sd = i ? 1 : -1, S = [sd * sb, 0, schulter];
      const [E, Hd] = ik(S, hand[i], 0.172 * H, 0.152 * H, [sd * 0.6, -0.5, -0.6]);
      Bh.glied(S, 0.043 * H, E, 0.036 * H, jacke);
      Bh.glied(E, 0.035 * H, [E[0] + (Hd[0] - E[0]) * 0.9, E[1] + (Hd[1] - E[1]) * 0.9, E[2] + (Hd[2] - E[2]) * 0.9], 0.031 * H, skal(jacke, 0.95));
      if (s > 18) {
        const dir = norm3([Hd[0] - E[0], Hd[1] - E[1], Hd[2] - E[2]]);
        Bh.ei([Hd[0] + dir[0] * 0.02 * H, Hd[1] + dir[1] * 0.02 * H, Hd[2] + dir[2] * 0.02 * H], [dir[0] * 0.034 * H, dir[1] * 0.034 * H, dir[2] * 0.034 * H], norm3(kreuz3(dir, [0, 0, 1])).map((x) => x * 0.024 * H), [0, 0, 0.022 * H], winter ? [60, 50, 44] : haut, { tiefe: 0.004 });
      }
      handPunkte.push(Hd);
    }
    /* was die rechte Hand hält */
    const hd = handPunkte[1];
    if (art === "gluehwein") { Bh.glied([hd[0], hd[1] + 0.03, hd[2] - 0.03], 0.034, [hd[0], hd[1] + 0.03, hd[2] + 0.06], 0.036, [178, 30, 38], { tiefe: 0.02 }); Bh.ei([hd[0], hd[1] + 0.03, hd[2] + 0.062], [0.03, 0, 0], [0, 0.03, 0], [0, 0, 0.004], [80, 14, 22], { tiefe: 0.021 }); }
    else if (art === "mandeln") Bh.glied([hd[0], hd[1] + 0.02, hd[2] - 0.08], 0.01, [hd[0], hd[1] + 0.04, hd[2] + 0.08], 0.05, [236, 228, 206], { tiefe: 0.02 });
    /* Hals, Schal, Kopf, Haar, Mütze */
    const K = [0, 0.01 * H, 0.927 * H];
    if (winter) {
      const schal = frau ? [196, 44, 52] : [44, 90, 60];
      Bh.ei([0, 0.006 * H, 0.84 * H - 0.004 * H], [0.058 * H, 0, 0], [0, 0.054 * H, 0], [0, 0, 0.03 * H], schal, { tiefe: 0.01 });
      if (s > 30) Bh.platte([[0.02 * H, 0.056 * H, 0.83 * H], [0.07 * H, 0.056 * H, 0.83 * H], [0.074 * H, 0.07 * H, 0.66 * H], [0.03 * H, 0.07 * H, 0.66 * H]], skal(schal, 0.96), { n: [0, 1, 0.1], beidseitig: true, tiefe: 0.06 });
    } else Bh.glied([0, 0, 0.84 * H], 0.028 * H, [0, 0, 0.89 * H], 0.026 * H, haut);
    const kopfOpt = { flecken: [{ c: [0, -0.34 * kr + 0.01 * H, 0.927 * H + 0.55 * kr], a: [[1.02 * kr, 0, 0], [0, 1.02 * kr, 0], [0, 0, 0.82 * kr]], alb: haar, n: [0, 0, 1], k: 1, hart: 0.9 }] };
    if (s > 26 && winter) kopfOpt.flecken.push({ c: [0.45 * kr, 0.7 * kr + 0.01 * H, K[2] - 0.2 * kr], a: [[0.3 * kr, 0, 0], [0, 0.3 * kr, 0], [0, 0, 0.25 * kr]], alb: [226, 128, 118], n: [0, 1, 0], k: 0.35 }, { c: [-0.45 * kr, 0.7 * kr + 0.01 * H, K[2] - 0.2 * kr], a: [[0.3 * kr, 0, 0], [0, 0.3 * kr, 0], [0, 0, 0.25 * kr]], alb: [226, 128, 118], n: [0, 1, 0], k: 0.35 });
    Bh.ei(K, [0.78 * kr, 0, 0], [0, 0.86 * kr, 0], [0, 0, kr], s < 24 ? misch(haut, haar, 0.4) : haut, kopfOpt);
    Bh.ei([0, K[1] - 0.14 * kr, K[2] + 0.14 * kr], [0.82 * kr, 0, 0], [0, 0.84 * kr, 0], [0, 0, 0.93 * kr], haar, { tiefe: -0.02 });
    if (frau) Bh.ei([0, K[1] - 0.5 * kr, K[2] - 0.75 * kr], [0.8 * kr, 0, 0], [0, 0.42 * kr, 0], [0, 0, 1.0 * kr], haar, { tiefe: -0.03 });
    if (s > 26) {
      Bh.ei([0, K[1] + 0.86 * kr, K[2] - 0.1 * kr], [0.13 * kr, 0, 0], [0, 0.16 * kr, 0], [0, 0, 0.2 * kr], skal(haut, 0.97), { tiefe: 0.02 });
      for (const sd of [1, -1]) Bh.ei([sd * 0.78 * kr, K[1], K[2]], [0.08 * kr, 0, 0], [0, 0.16 * kr, 0], [0, 0, 0.24 * kr], skal(haut, 0.95), { tiefe: -0.005 });
    }
    if (s > 70) for (const sd of [1, -1]) {
      Bh.ei([sd * 0.3 * kr, K[1] + 0.78 * kr, K[2] + 0.12 * kr], [0.07 * kr, 0, 0], [0, 0.04 * kr, 0], [0, 0, 0.05 * kr], [48, 36, 32], { tiefe: 0.015 });
      Bh.ei([sd * 0.31 * kr, K[1] + 0.74 * kr, K[2] + 0.26 * kr], [0.12 * kr, 0, 0], [0, 0.04 * kr, 0], [0, 0, 0.03 * kr], haar, { tiefe: 0.016 });
    }
    if (winter) {
      const mf = frau ? [230, 226, 214] : [60, 64, 74];
      Bh.ei([0, K[1] - 0.06 * kr, K[2] + 0.42 * kr], [0.86 * kr, 0, 0], [0, 0.93 * kr, 0], [0, 0, 0.78 * kr], mf, { tiefe: 0.01 });
      Bh.ei([0, K[1] - 0.03 * kr, K[2] + 0.2 * kr], [0.88 * kr, 0, 0], [0, 0.95 * kr, 0], [0, 0, 0.26 * kr], skal(mf, 0.86), { tiefe: 0.012 });
      Bh.kugel([0, K[1] - 0.1 * kr, K[2] + 1.22 * kr], 0.3 * kr, frau ? [196, 44, 52] : [200, 190, 170], { tiefe: 0.02 });
    }
    Bh.malen(g);
  }
  /* Nussknacker (gedrechselt, bemalt), Blick nach +y. p = Fuß (lokal) */
  function nussknacker(Bh, p, h, rock, hut, fein) {
    const x = p[0], y = p[1], z = p[2];
    Bh.gruppe(0);
    Bh.ei([x, y, z + 0.03 * h], [0.14 * h, 0, 0], [0, 0.11 * h, 0], [0, 0, 0.03 * h], [96, 64, 40]);
    for (const sd of [-1, 1]) {
      Bh.glied([x + sd * 0.065 * h, y, z + 0.06 * h], 0.05 * h, [x + sd * 0.065 * h, y, z + 0.22 * h], 0.045 * h, [24, 22, 24]);
      Bh.glied([x + sd * 0.065 * h, y, z + 0.22 * h], 0.045 * h, [x + sd * 0.07 * h, y, z + 0.42 * h], 0.05 * h, [236, 232, 222]);
    }
    Bh.koerper([{ c: [x, y, z + 0.5 * h], a: [[0.13 * h, 0, 0], [0, 0.1 * h, 0], [0, 0, 0.08 * h]] }, { c: [x, y, z + 0.66 * h], a: [[0.15 * h, 0, 0], [0, 0.11 * h, 0], [0, 0, 0.1 * h]] }], rock, { glanz: 0.35 });
    Bh.ei([x, y, z + 0.47 * h], [0.135 * h, 0, 0], [0, 0.104 * h, 0], [0, 0, 0.018 * h], [26, 24, 26], { tiefe: 0.01, glanz: 0.4 });
    if (fein) for (let k = 0; k < 3; k++) Bh.kugel([x, y + 0.1 * h, z + (0.56 + k * 0.07) * h], 0.014 * h, [222, 180, 70], { tiefe: 0.03, glanz: 0.8 });
    for (const sd of [-1, 1]) {
      Bh.glied([x + sd * 0.15 * h, y, z + 0.72 * h], 0.045 * h, [x + sd * 0.18 * h, y + 0.03 * h, z + 0.5 * h], 0.038 * h, rock);
      Bh.kugel([x + sd * 0.185 * h, y + 0.04 * h, z + 0.46 * h], 0.035 * h, [236, 204, 176]);
    }
    Bh.ei([x, y, z + 0.84 * h], [0.095 * h, 0, 0], [0, 0.095 * h, 0], [0, 0, 0.11 * h], [238, 206, 180]);
    Bh.ei([x, y + 0.05 * h, z + 0.79 * h], [0.08 * h, 0, 0], [0, 0.06 * h, 0], [0, 0, 0.06 * h], [246, 244, 238], { tiefe: 0.02 });
    Bh.kugel([x, y + 0.095 * h, z + 0.85 * h], 0.02 * h, [214, 150, 130], { tiefe: 0.03 });
    if (fein) for (const sd of [-1, 1]) Bh.kugel([x + sd * 0.035 * h, y + 0.085 * h, z + 0.88 * h], 0.009 * h, [20, 20, 24], { tiefe: 0.03 });
    Bh.glied([x, y, z + 0.93 * h], 0.098 * h, [x, y, z + 1.1 * h], 0.1 * h, hut, { glanz: 0.3 });
    Bh.ei([x, y, z + 0.95 * h], [0.102 * h, 0, 0], [0, 0.102 * h, 0], [0, 0, 0.02 * h], [220, 176, 64], { tiefe: 0.01, glanz: 0.7 });
    Bh.ei([x, y + 0.02 * h, z + 1.15 * h], [0.03 * h, 0, 0], [0, 0.03 * h, 0], [0, 0, 0.05 * h], [246, 244, 238], { tiefe: 0.02 });
  }
  function raeuchermann(Bh, p, h, jacke) {
    const x = p[0], y = p[1], z = p[2];
    Bh.gruppe(0);
    Bh.ei([x, y, z + 0.03 * h], [0.15 * h, 0, 0], [0, 0.12 * h, 0], [0, 0, 0.03 * h], [96, 64, 40]);
    for (const sd of [-1, 1]) Bh.glied([x + sd * 0.07 * h, y, z + 0.06 * h], 0.06 * h, [x + sd * 0.07 * h, y, z + 0.35 * h], 0.06 * h, [60, 50, 44]);
    Bh.ei([x, y + 0.01 * h, z + 0.52 * h], [0.17 * h, 0, 0], [0, 0.15 * h, 0], [0, 0, 0.2 * h], jacke);
    Bh.ei([x, y, z + 0.8 * h], [0.11 * h, 0, 0], [0, 0.11 * h, 0], [0, 0, 0.12 * h], [236, 204, 176]);
    Bh.ei([x, y + 0.06 * h, z + 0.74 * h], [0.08 * h, 0, 0], [0, 0.06 * h, 0], [0, 0, 0.05 * h], [230, 226, 220], { tiefe: 0.02 });
    Bh.ei([x, y, z + 0.92 * h], [0.15 * h, 0, 0], [0, 0.15 * h, 0], [0, 0, 0.03 * h], [40, 60, 40]);
    Bh.glied([x, y, z + 0.93 * h], 0.1 * h, [x, y, z + 1.02 * h], 0.08 * h, [40, 60, 40]);
    Bh.band([[x + 0.03 * h, y + 0.1 * h, z + 0.77 * h], [x + 0.12 * h, y + 0.2 * h, z + 0.7 * h], [x + 0.14 * h, y + 0.22 * h, z + 0.78 * h]], 0.012 * h, [80, 50, 30], { tiefe: 0.05 });
  }

  /* =====================================================================
     AUSLAGE AUF DER THEKE (3D in einer Figur)
     Lesbare Kerndinge maßvoll vergrößert (Tassen 11 cm, Herzen 24 cm),
     in Stufen nach hinten gestaffelt, je Variante eine große Leitfigur.
     ===================================================================== */
  const AY = T / 2 + 0.2;          // Fußpunkt der Auslage-Figur (Thekenmitte)
  function auslageMalen(g, s, F, art, o) {
    if (F.schatten) return;
    const V = blick(F.gier, s, 0, AY, TZ), Z = F.Z, jahr = F.jahr, nacht = F.nacht;
    const warm = nacht * 0.55;
    /* Lichtschein nur anmelden, wenn die Front zu sehen ist (sonst schiene er durchs Haus) */
    const Fl = sicht(V, [0, 1, 0]) > 0.02 ? F : { leuchtPunkt: null };
    const L = (n) => { const a = lichtK(n, Z, jahr); return [a[0] * 0.86 + warm, a[1] * 0.86 + warm * 0.74, a[2] * 0.86 + warm * 0.45]; };
    const Lo = L([0, 0, 1]), Lv = L(V.n(0, 1, 0.3));
    const rng = ST.zufall((o.saat | 0) + 5);
    const dinge = [];
    const setz = (x, y, z, fn) => dinge.push({ t: V.tiefe(x, y, z), fn: fn });
    const z = TZ;
    /* flaches Rechteck auf der Theke (Tablett, Brett, Kiste): Oberseite + Vorderkante */
    const brettchen = (x0, y0, b, t, h, farbe) => {
      g.save(); affin(g, V, [x0, y0, z + h], [1, 0, 0], [0, 1, 0]); g.fillStyle = rgb(mul(farbe, Lo)); g.fillRect(0, 0, b, t); g.strokeStyle = rgb(mul(skal(farbe, 0.7), Lo)); g.lineWidth = 0.012; g.strokeRect(0.01, 0.01, b - 0.02, t - 0.02); g.restore();
      if (sicht(V, [0, 1, 0]) > 0) { g.save(); affin(g, V, [x0, y0 + t, z + h], [1, 0, 0], [0, 0, -1]); g.fillStyle = rgb(mul(skal(farbe, 0.85), Lv)); g.fillRect(0, 0, b, h); g.restore(); }
      for (const sx of [0, 1]) { const nx = sx ? 1 : -1; if (sicht(V, [nx, 0, 0]) > 0) { g.save(); affin(g, V, [x0 + sx * b, y0 + (sx ? t : 0), z + h], [0, sx ? -1 : 1, 0], [0, 0, -1]); g.fillStyle = rgb(mul(skal(farbe, 0.75), L(V.n(nx, 0, 0.2)))); g.fillRect(0, 0, t, h); g.restore(); } }
    };
    const tasse = (x, y, zz, f) => {
      const r = 0.052, h = 0.11, W = walze(g, V, [x, y, zz], [x, y, zz + h], r * 0.92, r, f, L, { kappe: [78, 12, 22] });
      /* heller Rand und Henkel */
      if (s > 26) {
        ringLinie(g, V, [x, y, zz + h], [1, 0, 0], [0, 1, 0], r, rgb(mul(misch(f, [255, 255, 255], 0.5), Lo)), 0.008, "alle");
        const e = [x + r * 1.05, y + 0.012, zz + h * 0.55], a0 = V.p(x + r * 0.9, y, zz + h * 0.85), a1 = V.p(e[0] + 0.03, e[1], e[2]), a2 = V.p(x + r * 0.9, y, zz + h * 0.22);
        g.strokeStyle = rgb(mul(f, L(V.n(1, 0.3, 0.2)))); g.lineWidth = Math.max(0.8, 0.014 * s); g.lineCap = "round";
        g.beginPath(); g.moveTo(a0[0], a0[1]); g.quadraticCurveTo(a1[0], a1[1], a2[0], a2[1]); g.stroke();
      }
      if (s > 50 && f[0] > 150 && f[1] < 80) { const m = V.p(x, y + r, zz + h * 0.5); g.fillStyle = rgb(mul([246, 240, 226], Lv)); g.beginPath(); g.ellipse(m[0], m[1], 0.02 * s, 0.012 * s, 0, 0, TAU); g.fill(); }
      void W;
    };
    if (art === "gluehwein") {
      /* Leitfigur: Glühweinkessel aus Edelstahl mit Zapfhahn */
      setz(-1.05, 1.28, z + 0.25, () => {
        walze(g, V, [-1.05, 1.28, z], [-1.05, 1.28, z + 0.46], 0.19, 0.19, [196, 200, 206], L, { kappe: [70, 72, 78] });
        for (const hz of [0.08, 0.4]) ringLinie(g, V, [-1.05, 1.28, z + hz], [1, 0, 0], [0, 1, 0], 0.192, rgb(mul([150, 154, 160], Lv)), 0.012);
        const hp = V.p(-1.05, 1.49, z + 0.1), hq = V.p(-1.05, 1.53, z + 0.06);
        g.strokeStyle = rgb(mul([200, 160, 70], Lv)); g.lineWidth = Math.max(1, 0.03 * s); g.lineCap = "round"; g.beginPath(); g.moveTo(hp[0], hp[1]); g.lineTo(hq[0], hq[1]); g.stroke();
        const dk = V.p(-1.05, 1.28, z + 0.5); g.fillStyle = rgb(mul([40, 40, 44], Lo)); g.beginPath(); g.ellipse(dk[0], dk[1], 0.03 * s, 0.018 * s, 0, 0, TAU); g.fill();
        if (s > 40) { g.strokeStyle = "rgba(255,255,255,0.45)"; g.lineWidth = Math.max(0.6, s * 0.01); const a = V.p(-1.14, 1.4, z + 0.08), b = V.p(-1.14, 1.4, z + 0.4); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
      });
      /* zwei Holztabletts mit je 2 × 4 Tassen */
      const FT = [[178, 30, 38], [178, 30, 38], [236, 232, 222], [30, 70, 130]];
      for (const [tx, n0] of [[-0.74, 0], [0.24, 8]]) {
        setz(tx + 0.28, 1.3, z, () => brettchen(tx, 1.14, 0.58, 0.32, 0.02, [150, 108, 64]));
        for (let i = 0; i < 8; i++) {
          const x = tx + 0.08 + (i % 4) * 0.14, y = 1.2 + Math.floor(i / 4) * 0.15, f = FT[(i + n0 + (rng() * 2 | 0)) % 4];
          setz(x, y, z + 0.08, () => tasse(x, y, z + 0.02, f));
        }
      }
      /* Preistafel (Kreide) */
      setz(1.12, 1.26, z + 0.2, () => {
        g.save(); affin(g, V, [0.96, 1.3, z + 0.34], [1, 0, 0], [0, 0.18, -0.98]);
        g.fillStyle = rgb(mul([120, 84, 52], Lv)); g.fillRect(0, 0, 0.34, 0.34); g.fillStyle = rgb(mul([30, 36, 34], Lv)); g.fillRect(0.02, 0.02, 0.3, 0.3);
        g.fillStyle = rgb(mul([236, 236, 226], Lv), 0.85);
        if (s > 60) { g.font = "bold 0.05px sans-serif"; g.textAlign = "center"; g.fillText("Glühwein", 0.17, 0.09); g.font = "0.042px sans-serif"; g.fillText("3,50 €", 0.17, 0.15); g.fillText("Pfand 3 €", 0.17, 0.22); }
        else for (let i = 0; i < 3; i++) g.fillRect(0.06, 0.07 + i * 0.07, 0.18 - (i % 2) * 0.05, 0.015);
        g.restore();
      });
    } else if (art === "lebkuchen") {
      /* Leitfigur: schräger Aufsteller mit großen Herzen in zwei Reihen */
      const eu = [1, 0, 0], ev = [0, 0.42, -0.906];
      setz(-0.55, 1.22, z + 0.3, () => {
        g.save(); affin(g, V, [-1.3, 1.1, z + 0.62], eu, ev);
        g.fillStyle = rgb(mul([112, 76, 46], Lv)); g.fillRect(0, 0, 1.4, 0.66);
        g.strokeStyle = rgb(mul([80, 52, 30], Lv)); g.lineWidth = 0.02; g.strokeRect(0.01, 0.01, 1.38, 0.64);
        const TX = ["Ich mag dich", "Frohes Fest", "Für dich", "Schatz", "Danke", "Winterhausen", "Liebe Oma", "Du & ich"];
        for (let i = 0; i < 8; i++) { const x = 0.19 + (i % 4) * 0.34, y = 0.18 + Math.floor(i / 4) * 0.3; if (s > 30) { g.strokeStyle = rgb(mul([200, 30, 40], Lv)); g.lineWidth = 0.012; g.beginPath(); g.moveTo(x, y - 0.14); g.lineTo(x, y - 0.1); g.stroke(); } lebkuchenHerz(g, x, y, 0.12, Lv, s, TX[i], [[200, 30, 40], [30, 110, 60], [60, 90, 180], [200, 30, 40]][i % 4]); }
        g.restore();
        const f = V.p(-1.28, 1.36, z), f2 = V.p(-1.28, 1.1, z + 0.62); g.strokeStyle = rgb(mul([90, 60, 36], Lv)); g.lineWidth = Math.max(0.8, 0.025 * s); g.beginPath(); g.moveTo(f[0], f[1]); g.lineTo(f2[0], f2[1]); g.stroke();
      });
      /* Korb mit Pfeffernüssen, Stapel Printen */
      setz(0.55, 1.3, z + 0.1, () => {
        walze(g, V, [0.55, 1.3, z], [0.55, 1.3, z + 0.1], 0.16, 0.19, [150, 110, 60], L, { kappe: [96, 60, 34] });
        const m = V.p(0.55, 1.3, z + 0.1); g.fillStyle = rgb(mul([212, 200, 180], Lo));
        for (let i = 0; i < 26; i++) { const a = rng() * TAU, r = rng() * 0.15; g.beginPath(); g.ellipse(m[0] + Math.cos(a) * r * s * 0.7, m[1] + Math.sin(a) * r * s * 0.35, 0.022 * s, 0.016 * s, 0, 0, TAU); g.fill(); }
      });
      for (let k = 0; k < 4; k++) setz(1.05, 1.28, z + 0.02 * k, () => brettchen(0.88, 1.16, 0.34, 0.22, 0.03 + k * 0.03, k % 2 ? [120, 70, 36] : [200, 40, 44]));
    } else if (art === "mandeln") {
      /* Leitfigur: Kupferkessel auf dem Gasbrenner, Mandeln im Karamell */
      setz(-0.95, 1.28, z + 0.25, () => {
        for (const a of [0, 2.1, 4.2]) { const f0 = V.p(-0.95 + Math.cos(a) * 0.2, 1.28 + Math.sin(a) * 0.2, z), f1 = V.p(-0.95 + Math.cos(a) * 0.14, 1.28 + Math.sin(a) * 0.14, z + 0.18); g.strokeStyle = rgb(mul([40, 40, 44], Lv)); g.lineWidth = Math.max(0.8, 0.02 * s); g.beginPath(); g.moveTo(f0[0], f0[1]); g.lineTo(f1[0], f1[1]); g.stroke(); }
        const m = V.p(-0.95, 1.28, z + 0.42), R = 0.3 * s;
        const gr = g.createLinearGradient(m[0] - R, 0, m[0] + R, 0);
        gr.addColorStop(0, rgb(mul([222, 140, 80], Lv))); gr.addColorStop(0.35, rgb(mul([196, 108, 52], Lv))); gr.addColorStop(1, rgb(mul([110, 54, 26], Lv)));
        g.fillStyle = gr; g.beginPath(); g.ellipse(m[0], m[1], R, R * 0.5, 0, 0, Math.PI); g.ellipse(m[0], m[1], R, R * 0.85, 0, Math.PI, 0, true); g.fill();
        g.fillStyle = rgb(mul([120, 62, 28], Lo)); g.beginPath(); g.ellipse(m[0], m[1], R * 0.95, R * 0.47, 0, 0, TAU); g.fill();
        for (let i = 0; i < 40; i++) { const a = rng() * TAU, r = Math.sqrt(rng()) * 0.9; g.fillStyle = rgb(mul(rng() < 0.5 ? [168, 104, 54] : [196, 132, 70], Lo)); g.beginPath(); g.ellipse(m[0] + Math.cos(a) * r * R * 0.9, m[1] + Math.sin(a) * r * R * 0.44, R * 0.07, R * 0.045, rng() * 3, 0, TAU); g.fill(); }
        g.strokeStyle = rgb(mul([240, 180, 120], Lo), 0.7); g.lineWidth = Math.max(0.6, s * 0.012); g.beginPath(); g.ellipse(m[0], m[1], R, R * 0.5, 0, Math.PI * 1.05, Math.PI * 1.7); g.stroke();
        const sp = V.p(-0.8, 1.2, z + 0.7); g.strokeStyle = rgb(mul([170, 124, 70], Lv)); g.lineWidth = Math.max(0.8, 0.025 * s); g.beginPath(); g.moveTo(m[0] + R * 0.1, m[1]); g.lineTo(sp[0], sp[1]); g.stroke();
      });
      /* Block mit Spitztüten, rot-weiß, in zwei Reihen */
      setz(0.2, 1.3, z + 0.05, () => brettchen(-0.45, 1.16, 1.3, 0.3, 0.06, [132, 92, 56]));
      for (let i = 0; i < 12; i++) {
        const x = -0.36 + (i % 6) * 0.22, y = 1.22 + Math.floor(i / 6) * 0.15, zz = z + 0.06;
        setz(x, y, zz + 0.12, () => {
          const f = i % 2 ? [236, 228, 206] : [186, 36, 42];
          walze(g, V, [x, y, zz], [x, y, zz + 0.24], 0.012, 0.07, f, L, { kappe: [150, 92, 50] });
          if (s > 40) { const m = V.p(x, y, zz + 0.25); g.fillStyle = rgb(mul([176, 110, 58], Lo)); for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(m[0] + (k - 1.5) * 0.02 * s, m[1] - (k % 2) * 0.01 * s, 0.018 * s, 0.012 * s, k, 0, TAU); g.fill(); } }
        });
      }
    } else if (art === "holzkunst") {
      /* Stufenpodest, hinten große Nussknacker, vorn Räuchermännchen */
      setz(0, 1.2, z + 0.05, () => brettchen(-1.3, 1.1, 2.6, 0.2, 0.14, [120, 84, 52]));
      setz(0, 1.3, z, () => {
        const Bh = buehne(F, s, 0, AY, TZ, 0.86, [{ p: [0, T / 2, OZ1], r: 1.6, farbe: [1, 0.74, 0.44], k: 0.8 * nacht }]);
        if (!Bh) return;
        const ROCK = [[168, 24, 32], [30, 60, 130], [36, 90, 50]];
        for (let i = 0; i < 4; i++) nussknacker(Bh, [-1.1 + i * 0.62, 1.2 - AY, 0.14], 0.5, ROCK[i % 3], i % 2 ? [24, 24, 28] : [150, 20, 30], s > 50);
        for (let i = 0; i < 5; i++) raeuchermann(Bh, [-0.95 + i * 0.44, 1.42 - AY, 0], 0.3, [[40, 70, 120], [120, 40, 36], [60, 90, 50]][i % 3]);
        Bh.malen(g);
      });
    } else if (art === "kerzen") {
      /* Stufenständer mit Stumpenkerzen, abends brennt jede dritte */
      setz(0, 1.2, z + 0.05, () => brettchen(-1.3, 1.1, 2.6, 0.2, 0.12, [120, 84, 52]));
      const KF = [[236, 226, 196], [176, 30, 40], [226, 190, 80], [40, 90, 60], [200, 120, 150], [236, 226, 196]];
      for (let i = 0; i < 18; i++) {
        const reihe = i < 9 ? 0 : 1, x = -1.18 + (i % 9) * 0.29, y = reihe ? 1.2 : 1.42, zz = z + (reihe ? 0.12 : 0), h = 0.12 + ((i * 7) % 5) * 0.05, r = 0.045 + (i % 3) * 0.012, f = KF[i % KF.length];
        setz(x, y, zz + h / 2, () => {
          walze(g, V, [x, y, zz], [x, y, zz + h], r, r, f, L, { kappe: skal(f, 1.05) });
          if (i % 3 === 0) { const t = V.p(x, y, zz + h); flamme(g, t[0], t[1], s, nacht, Fl); }
        });
      }
    } else if (art === "blumen") {
      /* Zinkeimer mit Tulpenbunden, gestaffelt */
      const BL = [[220, 30, 50], [250, 210, 40], [246, 240, 236], [230, 110, 160], [140, 70, 170], [250, 140, 40]];
      for (let i = 0; i < 8; i++) {
        const reihe = i < 4 ? 1 : 0, x = -1.1 + (i % 4) * 0.62 + (reihe ? 0 : 0.3), y = reihe ? 1.18 : 1.4, f = BL[(i + (o.saat | 0)) % BL.length];
        setz(x, y, z + 0.2, () => {
          walze(g, V, [x, y, z], [x, y, z + 0.26], 0.12, 0.15, [150, 156, 162], L, { kappe: [60, 70, 50] });
          const rr = ST.zufall(i * 31 + 7), top = V.p(x, y, z + 0.26);
          for (let j = 0; j < 16; j++) {
            const a = rr() * TAU, d = rr() * 0.12, hh = 0.2 + rr() * 0.16;
            const q = V.p(x + Math.cos(a) * d, y + Math.sin(a) * d, z + 0.26 + hh);
            g.strokeStyle = rgb(mul([70, 120, 50], L(V.n(0.3, 0.5, 0.8)))); g.lineWidth = Math.max(0.5, 0.01 * s); g.beginPath(); g.moveTo(top[0] + (q[0] - top[0]) * 0.2, top[1]); g.lineTo(q[0], q[1]); g.stroke();
            const r = Math.max(0.9, 0.028 * s), kf = L(V.n(-0.3, 0.6, 0.7));
            const gr = g.createLinearGradient(q[0] - r, 0, q[0] + r, 0); gr.addColorStop(0, rgb(mul(misch(f, [255, 255, 255], 0.2), kf))); gr.addColorStop(1, rgb(mul(skal(f, 0.7), kf)));
            g.fillStyle = gr; g.beginPath(); g.moveTo(q[0] - r, q[1] - r * 1.3); g.quadraticCurveTo(q[0] - r * 1.1, q[1] + r * 0.4, q[0], q[1] + r * 0.35); g.quadraticCurveTo(q[0] + r * 1.1, q[1] + r * 0.4, q[0] + r, q[1] - r * 1.3); g.lineTo(q[0] + r * 0.3, q[1] - r * 0.9); g.lineTo(q[0], q[1] - r * 1.45); g.lineTo(q[0] - r * 0.3, q[1] - r * 0.9); g.closePath(); g.fill();
          }
        });
      }
    } else if (art === "spargel") {
      /* Holzsteigen mit stehenden Spargelbunden, Erdbeerschalen, Waage */
      for (let i = 0; i < 3; i++) {
        const x0 = -1.3 + i * 0.44;
        setz(x0 + 0.2, 1.28, z + 0.1, () => {
          brettchen(x0, 1.12, 0.4, 0.32, 0.12, [176, 136, 90]);
          const rr = ST.zufall(i * 13 + 3);
          for (let k = 0; k < 6; k++) { const x = x0 + 0.08 + (k % 3) * 0.12, y = 1.2 + Math.floor(k / 3) * 0.13; walze(g, V, [x, y, z + 0.12], [x, y, z + 0.28 + rr() * 0.03], 0.05, 0.045, [240, 234, 214], L, { kappe: [200, 170, 190] }); }
        });
      }
      for (let i = 0; i < 6; i++) {
        const x = 0.2 + (i % 3) * 0.3, y = 1.2 + Math.floor(i / 3) * 0.16;
        setz(x, y, z + 0.05, () => {
          brettchen(x - 0.11, y - 0.07, 0.22, 0.14, 0.07, [70, 120, 60]);
          const m = V.p(x, y, z + 0.08), kb = L(V.n(-0.3, 0.5, 0.8));
          for (let j = 0; j < 9; j++) { const dx = ((j % 3) - 1) * 0.055, dy = (Math.floor(j / 3) - 1) * 0.035; const p = [m[0] + (dx - dy) * KX * s, m[1] + (dx + dy) * KY * s - 0.015 * s]; const r = Math.max(0.8, 0.026 * s); const gr = g.createRadialGradient(p[0] - r * 0.3, p[1] - r * 0.3, 0, p[0], p[1], r); gr.addColorStop(0, rgb(mul([236, 60, 60], kb))); gr.addColorStop(1, rgb(mul([150, 14, 24], kb))); g.fillStyle = gr; g.beginPath(); g.arc(p[0], p[1], r, 0, TAU); g.fill(); if (s > 60) { g.fillStyle = rgb(mul([60, 130, 50], kb)); g.fillRect(p[0] - r * 0.4, p[1] - r, r * 0.8, r * 0.3); } }
        });
      }
    }
    dinge.sort((a, b) => a.t - b.t);
    for (const d of dinge) d.fn();
  }
  function flamme(g, x, y, s, nacht, F) {
    const h = Math.max(1.5, 0.05 * s);
    const gr = g.createRadialGradient(x, y - h * 0.5, 0, x, y - h * 0.5, h);
    gr.addColorStop(0, "rgba(255,250,220,1)"); gr.addColorStop(0.4, "rgba(255,200,90,0.9)"); gr.addColorStop(1, "rgba(255,140,40,0)");
    g.fillStyle = gr; g.beginPath(); g.ellipse(x, y - h * 0.55, h * 0.3, h * 0.72, 0, 0, TAU); g.fill();
    if (nacht > 0 && F.leuchtPunkt) F.leuchtPunkt(x, y - h * 0.6, 0.3 * s, "255,190,100", 0.3, true);
  }

  /* =====================================================================
     DACHAUFSATZ je Ware – man erkennt die Bude schon von weitem
     ===================================================================== */
  function aufsatzMalen(g, s, F, art, zB, winter) {
    if (F.schatten) return;
    const V = blick(F.gier, s, AX, 0, zB), Z = F.Z, jahr = F.jahr, nacht = F.nacht;
    const L = (n) => lichtK(n, Z, jahr), Lo = L([0, 0, 1]);
    const schnee = (pts, dick) => { if (!winter || pts.length < 2) return; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.strokeStyle = rgb(mul([190, 204, 230], Lo)); g.lineWidth = dick * s; g.stroke(); g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1] - dick * s * 0.2) : g.moveTo(p[0], p[1] - dick * s * 0.2))); g.strokeStyle = rgb(mul([248, 250, 255], Lo)); g.lineWidth = dick * s * 0.7; g.stroke(); };
    /* zwei Holzklötze als Lager auf dem First */
    const klotz = (x) => { g.save(); const a = V.p(x, -0.12, zB), b = V.p(x, 0.12, zB); g.strokeStyle = rgb(mul([90, 60, 36], Lo)); g.lineWidth = Math.max(1, 0.08 * s); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); g.restore(); };
    if (art === "gluehwein") {
      klotz(AX - 0.25); klotz(AX + 0.25);
      const zc = zB + 0.32;
      const Wh = walze(g, V, [AX - 0.38, 0, zc], [AX, 0, zc], 0.27, 0.31, [150, 100, 56], L, { kappe: false });
      const Wv = walze(g, V, [AX, 0, zc], [AX + 0.38, 0, zc], 0.31, 0.27, [150, 100, 56], L, { kappe: false });
      if (s > 18) {
        g.save(); vieleck(g, huelle2(Wh.P0.concat(Wh.P1, Wv.P1))); g.clip();
        g.strokeStyle = "rgba(40,24,12,0.45)"; g.lineWidth = Math.max(0.5, 0.006 * s);
        for (let k = 0; k < 12; k++) { const t = k / 12 * TAU, n = [0, Math.cos(t), Math.sin(t)]; const a = V.p(AX - 0.4, n[1] * 0.28, zc + n[2] * 0.28), b = V.p(AX, n[1] * 0.31, zc + n[2] * 0.31), c = V.p(AX + 0.4, n[1] * 0.28, zc + n[2] * 0.28); g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(b[0] * 2 - (a[0] + c[0]) / 2, b[1] * 2 - (a[1] + c[1]) / 2, c[0], c[1]); g.stroke(); }
        g.restore();
      }
      for (const [x, r] of [[AX - 0.33, 0.28], [AX - 0.14, 0.305], [AX + 0.14, 0.305], [AX + 0.33, 0.28]]) ringLinie(g, V, [x, 0, zc], [0, 1, 0], [0, 0, 1], r + 0.004, rgb(mul([46, 44, 44], L(V.n(0, 0.5, 0.8)))), 0.035);
      /* sichtbarer Boden mit Zapfhahn */
      const ende = sicht(V, [1, 0, 0]) > 0 ? 1 : -1, ex = AX + ende * 0.38;
      g.save(); affin(g, V, [ex, -0.27 * ende, zc + 0.27], [0, ende, 0], [0, 0, -1]);
      g.beginPath(); g.arc(0.27, 0.27, 0.27, 0, TAU); g.fillStyle = rgb(mul([168, 118, 70], L(V.n(ende, 0, 0)))); g.fill();
      g.strokeStyle = rgb(mul([110, 70, 40], L(V.n(ende, 0, 0)))); g.lineWidth = 0.012; for (let k = 1; k < 5; k++) { g.beginPath(); g.moveTo(0.27 - Math.sqrt(0.0729 - Math.pow(k * 0.1 - 0.27, 2)), k * 0.1); g.lineTo(0.27 + Math.sqrt(0.0729 - Math.pow(k * 0.1 - 0.27, 2)), k * 0.1); g.stroke(); }
      g.fillStyle = rgb(mul([196, 150, 60], L(V.n(ende, 0, 0)))); g.fillRect(0.24, 0.38, 0.06, 0.1);
      if (s > 50) { g.fillStyle = rgb(mul([240, 220, 180], L(V.n(ende, 0, 0)))); g.font = "bold 0.07px Georgia, serif"; g.textAlign = "center"; g.fillText("Winzer", 0.27, 0.24); }
      g.restore();
      const top = []; for (let k = 0; k <= 8; k++) { const x = AX - 0.34 + k * 0.085; top.push(V.p(x, 0, zc + 0.27 + 0.04 * Math.sin(k / 8 * Math.PI))); } schnee(top, 0.07);
    } else if (art === "lebkuchen") {
      /* Riesenherz auf einem Pfosten, beidseitig bemalt */
      const pf0 = V.p(AX, 0, zB), pf1 = V.p(AX, 0, zB + 0.25); g.strokeStyle = rgb(mul([90, 60, 36], Lo)); g.lineWidth = Math.max(1, 0.06 * s); g.beginPath(); g.moveTo(pf0[0], pf0[1]); g.lineTo(pf1[0], pf1[1]); g.stroke();
      const ny = sicht(V, [0, 1, 0]) >= 0 ? 1 : -1, Lh = L(V.n(0, ny, 0.2));
      g.save(); affin(g, V, [AX - 0.45 * ny, 0.02 * ny, zB + 0.95], [ny, 0, 0], [0, 0, -1]);
      g.fillStyle = "rgba(0,0,0,0.25)"; herzPfad(g, 0.46, 0.4, 0.44); g.fill();
      lebkuchenHerz(g, 0.45, 0.38, 0.42, Lh, s, "Frohes Fest", [196, 30, 40]);
      g.strokeStyle = rgb(mul([196, 24, 36], Lh)); g.lineWidth = 0.035; g.beginPath(); g.moveTo(0.45, -0.02); g.lineTo(0.45, 0.06); g.stroke();
      g.restore();
      if (winter) { const a = V.p(AX - 0.3, 0, zB + 0.93), m = V.p(AX, 0, zB + 0.84), b = V.p(AX + 0.3, 0, zB + 0.93); schnee([a, [(a[0] + m[0]) / 2, (a[1] + m[1]) / 2 - 0.03 * s], m], 0.05); schnee([m, [(b[0] + m[0]) / 2, (b[1] + m[1]) / 2 - 0.03 * s], b], 0.05); }
    } else if (art === "mandeln") {
      /* Riesen-Spitztüte, rot-weiß gestreift, obenauf Mandeln */
      const W = walze(g, V, [AX, 0, zB + 0.02], [AX, 0, zB + 0.85], 0.03, 0.24, [236, 228, 206], L, { kappe: [150, 92, 50] });
      if (s > 10) {
        g.save(); vieleck(g, W.H); g.clip();
        g.lineWidth = 0.07 * s; g.strokeStyle = rgb(mul([186, 36, 42], L(V.n(-0.3, 0.6, 0.3))), 0.9);
        for (let k = -3; k < 5; k++) { const a = V.p(AX - 0.3, 0, zB + k * 0.2), b = V.p(AX + 0.3, 0, zB + k * 0.2 + 0.35); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
        g.restore();
      }
      const m = V.p(AX, 0, zB + 0.86), R = 0.23 * s, rr = ST.zufall(4);
      for (let i = 0; i < 22; i++) { const a = rr() * TAU, r = Math.sqrt(rr()); g.fillStyle = rgb(mul(rr() < 0.5 ? [168, 104, 54] : [200, 138, 72], Lo)); g.beginPath(); g.ellipse(m[0] + Math.cos(a) * r * R * 0.85, m[1] + Math.sin(a) * r * R * 0.4 - (1 - r) * R * 0.25, R * 0.13, R * 0.08, rr() * 3, 0, TAU); g.fill(); }
      if (winter) schnee([V.p(AX - 0.12, 0.05, zB + 0.95), V.p(AX + 0.1, 0.02, zB + 0.96)], 0.06);
    } else if (art === "holzkunst") {
      const Bh = buehne(F, s, AX, 0, zB, 1);
      if (Bh) {
        nussknacker(Bh, [0, 0, 0], 1.15, [168, 24, 32], [24, 24, 28], s > 30);
        Bh.malen(g);
        if (winter) { const h = V.p(AX, 0, zB + 1.27); g.fillStyle = rgb(mul([246, 249, 255], Lo)); g.beginPath(); g.ellipse(h[0], h[1], 0.1 * s, 0.045 * s, 0, 0, TAU); g.fill(); }
      }
    } else if (art === "kerzen") {
      /* große rote Stumpenkerze mit Wachsnasen; brennt abends */
      walze(g, V, [AX, 0, zB], [AX, 0, zB + 0.08], 0.2, 0.2, [180, 150, 70], L, { kappe: [200, 170, 90] });
      walze(g, V, [AX, 0, zB + 0.08], [AX, 0, zB + 0.8], 0.13, 0.13, [176, 26, 36], L, { kappe: [196, 40, 48] });
      if (s > 16) { g.fillStyle = rgb(mul([200, 40, 48], L(V.n(-0.3, 0.6, 0.3)))); for (const [dx, l] of [[-0.08, 0.14], [0.03, 0.22], [0.09, 0.1]]) { const a = V.p(AX + dx * 0.7, 0.1, zB + 0.8), b = V.p(AX + dx * 0.7, 0.1, zB + 0.8 - l); g.beginPath(); g.moveTo(a[0] - 0.02 * s, a[1]); g.lineTo(b[0], b[1]); g.lineTo(a[0] + 0.02 * s, a[1]); g.fill(); } }
      const t = V.p(AX, 0, zB + 0.81);
      g.strokeStyle = "#2a2020"; g.lineWidth = Math.max(0.6, 0.012 * s); g.beginPath(); g.moveTo(t[0], t[1]); g.lineTo(t[0], t[1] - 0.04 * s); g.stroke();
      if (nacht > 0.05) { const h = 0.12 * s, gr = g.createRadialGradient(t[0], t[1] - h * 0.6, 0, t[0], t[1] - h * 0.6, h); gr.addColorStop(0, "rgba(255,250,220,1)"); gr.addColorStop(0.4, "rgba(255,200,90,0.9)"); gr.addColorStop(1, "rgba(255,140,40,0)"); g.fillStyle = gr; g.beginPath(); g.ellipse(t[0], t[1] - h * 0.6, h * 0.3, h * 0.75, 0, 0, TAU); g.fill(); if (F.leuchtPunkt) F.leuchtPunkt(t[0], t[1] - h * 0.6, 0.9 * s, "255,190,100", 0.45, true); }
      if (winter) schnee([V.p(AX - 0.1, 0.06, zB + 0.81), V.p(AX - 0.02, 0.1, zB + 0.815)], 0.05);
    } else if (art === "blumen") {
      /* Blumenkasten mit Tulpen */
      g.save(); affin(g, V, [AX - 0.42, 0.16, zB + 0.28], [1, 0, 0], [0, 0, -1]); g.fillStyle = rgb(mul([150, 104, 60], L(V.n(0, 1, 0)))); g.fillRect(0, 0, 0.84, 0.28); g.restore();
      const rr = ST.zufall(8), BL = [[220, 30, 50], [250, 210, 40], [230, 110, 160], [246, 240, 236]];
      for (let i = 0; i < 16; i++) { const x = AX - 0.36 + (i % 8) * 0.1, y = -0.06 + Math.floor(i / 8) * 0.12, h = 0.25 + rr() * 0.12; const f = V.p(x, y, zB + 0.28), q = V.p(x, y, zB + 0.28 + h); g.strokeStyle = rgb(mul([70, 120, 50], Lo)); g.lineWidth = Math.max(0.6, 0.012 * s); g.beginPath(); g.moveTo(f[0], f[1]); g.lineTo(q[0], q[1]); g.stroke(); const r = Math.max(0.9, 0.035 * s); g.fillStyle = rgb(mul(BL[i % 4], L(V.n(-0.3, 0.6, 0.6)))); g.beginPath(); g.ellipse(q[0], q[1] - r * 0.4, r * 0.8, r, 0, 0, TAU); g.fill(); }
    } else if (art === "spargel") {
      /* Korb mit Riesen-Erdbeeren */
      walze(g, V, [AX, 0, zB], [AX, 0, zB + 0.3], 0.28, 0.34, [176, 136, 80], L, { kappe: [110, 80, 44] });
      const kb = L(V.n(-0.3, 0.6, 0.7)), rr = ST.zufall(9);
      for (let i = 0; i < 7; i++) { const a = i / 7 * TAU, r = i ? 0.17 : 0; const p = V.p(AX + Math.cos(a) * r, Math.sin(a) * r, zB + 0.36 + (i ? 0 : 0.08)); const R = 0.1 * s; const gr = g.createRadialGradient(p[0] - R * 0.3, p[1] - R * 0.3, 0, p[0], p[1], R * 1.2); gr.addColorStop(0, rgb(mul([240, 70, 70], kb))); gr.addColorStop(1, rgb(mul([150, 14, 24], kb))); g.fillStyle = gr; g.beginPath(); g.moveTo(p[0] - R, p[1] - R * 0.3); g.quadraticCurveTo(p[0] - R, p[1] + R, p[0], p[1] + R * 1.2); g.quadraticCurveTo(p[0] + R, p[1] + R, p[0] + R, p[1] - R * 0.3); g.quadraticCurveTo(p[0], p[1] - R * 0.9, p[0] - R, p[1] - R * 0.3); g.fill(); g.fillStyle = rgb(mul([60, 130, 50], kb)); g.beginPath(); g.ellipse(p[0], p[1] - R * 0.5, R * 0.5, R * 0.18, rr(), 0, TAU); g.fill(); if (s > 40) { g.fillStyle = rgb(mul([250, 220, 120], kb)); for (let k = 0; k < 6; k++) g.fillRect(p[0] + (rr() - 0.5) * R * 1.2, p[1] + rr() * R * 0.8, 1, 1); } }
    }
  }

  /* =====================================================================
     INNEN: Rückwand mit Regalen, Seiten, Boden
     ===================================================================== */
  function rueckwandInnen(art, holz, saat) {
    return function (g, F) {
      const Z = F.zeit, jahr = F.jahr, nacht = F.nacht, k = innenLicht(Z, jahr, nacht);
      bohlen(g, F.w, F.h, holz, F, saat + 3, true);
      const rng = ST.zufall(saat + 11);
      /* Arbeitstisch hinten (0,8 m hoch) und ein Regalbrett darüber */
      for (const y of [HW - 1.25, HW - 1.75]) {
        g.fillStyle = "rgba(20,10,5,0.45)"; g.fillRect(0.1, y + 0.03, F.w - 0.2, 0.06);
        g.fillStyle = rgb(skal(holz, 1.25)); g.fillRect(0.1, y, F.w - 0.2, 0.04);
        for (let x = 0.18; x < F.w - 0.25; x += 0.12 + rng() * 0.08) {
          const hh = 0.12 + rng() * 0.18;
          let c;
          if (art === "gluehwein") c = rng() < 0.5 ? [80, 20, 30] : [40, 60, 40];
          else if (art === "lebkuchen") c = [150 + rng() * 30, 90, 46];
          else if (art === "mandeln") c = rng() < 0.5 ? [196, 120, 60] : [236, 226, 200];
          else if (art === "holzkunst") c = [[168, 24, 32], [30, 60, 130], [36, 90, 50], [220, 190, 120]][(rng() * 4) | 0];
          else if (art === "kerzen") c = [[236, 226, 196], [176, 30, 40], [226, 190, 80], [40, 90, 60]][(rng() * 4) | 0];
          else if (art === "blumen") c = [[220, 30, 50], [250, 210, 40], [246, 240, 236], [230, 110, 160]][(rng() * 4) | 0];
          else c = [[240, 234, 214], [196, 24, 34], [230, 200, 80]][(rng() * 3) | 0];
          g.fillStyle = rgb(c);
          if (art === "gluehwein") { g.fillRect(x, y - hh, 0.06, hh); g.fillRect(x + 0.02, y - hh - 0.05, 0.02, 0.05); }
          else if (art === "lebkuchen") { herzPfad(g, x + 0.05, y - 0.12, 0.08); g.fill(); }
          else if (art === "blumen") { g.fillStyle = "#6b7078"; g.fillRect(x, y - 0.12, 0.1, 0.12); g.fillStyle = rgb(c); g.beginPath(); g.arc(x + 0.05, y - 0.17, 0.06, 0, TAU); g.fill(); }
          else { g.beginPath(); rundPfad(g, x, y - hh, 0.08, hh, 0.02); g.fill(); }
        }
      }
      /* Arbeitstisch an der Rückwand (0,85 m): Platte, Beine, darunter Schatten und Vorräte */
      const ty = F.h - 0.85;
      g.fillStyle = "rgba(10,6,4,0.55)"; g.fillRect(0.05, ty + 0.04, F.w - 0.1, 0.81);
      for (let i = 0; i < 4; i++) { const x = 0.25 + i * 0.75 + rng() * 0.15, w = 0.32 + rng() * 0.15, h = 0.22 + rng() * 0.12; g.fillStyle = rgb([118 - i * 8, 92, 64]); g.fillRect(x, F.h - h, w, h); g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(x + w - 0.05, F.h - h, 0.05, h); g.fillStyle = "rgba(210,190,150,0.5)"; g.fillRect(x + w * 0.4, F.h - h, 0.05, h); }
      g.fillStyle = rgb(skal(holz, 1.3)); g.fillRect(0.05, ty, F.w - 0.1, 0.045); g.fillStyle = "rgba(0,0,0,0.4)"; g.fillRect(0.05, ty + 0.045, F.w - 0.1, 0.015);
      g.fillStyle = rgb(skal(holz, 0.9)); for (const x of [0.12, F.w - 0.18]) g.fillRect(x, ty + 0.04, 0.06, 0.81);
      for (let x = 0.2; x < F.w - 0.3; x += 0.16 + rng() * 0.1) { const h = 0.1 + rng() * 0.2; g.fillStyle = rgb(art === "gluehwein" ? (rng() < 0.5 ? [70, 16, 26] : [40, 70, 44]) : [150 + rng() * 60, 110, 70]); g.beginPath(); rundPfad(g, x, ty - h, 0.07, h, 0.02); g.fill(); }
      if (art === "lebkuchen") for (let i = 0; i < 7; i++) { const x = 0.25 + i * 0.37; g.strokeStyle = "rgba(220,200,160,0.8)"; g.lineWidth = 0.008; g.beginPath(); g.moveTo(x, 0.1); g.lineTo(x, 0.25); g.stroke(); lebkuchenHerz(g, x, 0.36, 0.1, [1, 1, 1], F.px, null); }
      /* Innenlicht: multiply, nach unten dunkler */
      g.globalCompositeOperation = "multiply";
      g.fillStyle = rgb(skal(k, 255)); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      const gr = g.createLinearGradient(0, 0, 0, F.h);
      gr.addColorStop(0, "rgb(255,255,255)"); gr.addColorStop(0.55, "rgb(235,228,222)"); gr.addColorStop(1, "rgb(116,104,104)");
      g.fillStyle = gr; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      g.globalCompositeOperation = "source-over";
      if (nacht > 0) {
        const gl = g.createRadialGradient(F.w * 0.5, 0.1, 0, F.w * 0.5, 0.1, 1.5);
        gl.addColorStop(0, "rgba(255,210,140," + (0.4 * nacht) + ")"); gl.addColorStop(1, "rgba(255,190,110,0)");
        g.globalCompositeOperation = "lighter"; g.fillStyle = gl; g.fillRect(0, 0, F.w, F.h); g.globalCompositeOperation = "source-over";
      }
    };
  }
  function innenFlaeche(holz, saat, boden) {
    return function (g, F) {
      const k = innenLicht(F.zeit, F.jahr, F.nacht, boden ? 0.8 : 0.7);
      if (boden) {
        g.fillStyle = rgb(skal(holz, 0.8)); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
        g.fillStyle = "rgba(0,0,0,0.25)"; for (let x = 0.14; x < F.w; x += 0.14) g.fillRect(x, 0, 0.008, F.h);
        PI.rauschen(g, 0, 0, F.w, F.h, 1, 0.2, saat % 40, 3);
      } else bohlen(g, F.w, F.h, holz, F, saat, true);
      g.globalCompositeOperation = "multiply"; g.fillStyle = rgb(skal(k, 255 * (boden ? 0.85 : 0.8))); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      g.globalCompositeOperation = "source-over";
    };
  }
  /* Lichterkette innen unter dem Sturz (hinter der Öffnung) */
  function innenKetteMalen(g, s, F) {
    if (F.schatten) return;
    const V = blick(F.gier, s);
    if (sicht(V, [0, 1, 0]) < 0.02) return;
    const glut = 0.35 + 0.65 * F.nacht, y = T / 2 - 0.1;
    const P = (u) => { const x = -OX + 0.05 + u * (2 * OX - 0.1); return V.p(x, y, OZ1 - 0.06 - 0.09 * Math.abs(Math.sin(u * Math.PI * 3))); };
    g.strokeStyle = "rgba(30,30,24,0.8)"; g.lineWidth = Math.max(0.5, 0.007 * s); g.beginPath();
    for (let i = 0; i <= 48; i++) { const p = P(i / 48); if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }
    g.stroke();
    for (let i = 0; i < 16; i++) {
      const p = P((i + 0.5) / 16), r = Math.max(1, 0.045 * s);
      const gr = g.createRadialGradient(p[0], p[1] + r * 0.4, 0, p[0], p[1] + r * 0.4, r * 2.4);
      gr.addColorStop(0, "rgba(255,248,220," + glut + ")"); gr.addColorStop(0.28, "rgba(255,206,130," + (0.6 * glut) + ")"); gr.addColorStop(1, "rgba(255,170,80,0)");
      g.fillStyle = gr; g.fillRect(p[0] - r * 2.4, p[1] - r * 2, r * 4.8, r * 4.8);
    }
  }

  /* =====================================================================
     RÜCKSEITE UND SEITEN: was an echten Buden herumsteht
     ===================================================================== */
  function rundDingMalen(g, s, F, art, winter, fx, fy) {
    const V = blick(F.gier, s, fx, fy, 0), Z = F.Z, jahr = F.jahr;
    const L = (n) => lichtK(n, Z, jahr);
    if (F.schatten) {
      g.fillStyle = "#000";
      if (art === "gas") { const a = V.p(-1.18, -T / 2 - 0.2, 0), b = V.p(-1.18, -T / 2 - 0.2, 0.62); g.fillRect(a[0] - 0.15 * s, b[1], 0.3 * s, a[1] - b[1]); }
      return;
    }
    if (art === "gas") {
      /* Propangasflasche 11 kg mit Schutzkragen und Ventil */
      const x = -1.18, y = -T / 2 - 0.2;
      walze(g, V, [x, y, 0], [x, y, 0.5], 0.15, 0.15, [120, 132, 150], L, { kappe: [110, 120, 140] });
      walze(g, V, [x, y, 0.5], [x, y, 0.56], 0.15, 0.09, [120, 132, 150], L, { kappe: false });
      walze(g, V, [x, y, 0.54], [x, y, 0.64], 0.09, 0.09, [190, 36, 40], L, { kappe: [170, 30, 36] });
      if (winter) { const t = V.p(x, y, 0.645); g.fillStyle = rgb(mul([246, 249, 255], L([0, 0, 1]))); g.beginPath(); g.ellipse(t[0], t[1], 0.07 * s, 0.03 * s, 0, 0, TAU); g.fill(); }
      /* Schlauch zur Wand */
      const a = V.p(x, y, 0.6), b = V.p(x + 0.05, -T / 2, 0.3); g.strokeStyle = "rgba(24,24,26,0.95)"; g.lineWidth = Math.max(0.6, 0.015 * s); g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(a[0] + 0.1 * s, (a[1] + b[1]) / 2 + 0.1 * s, b[0], b[1]); g.stroke();
    } else if (art === "trommel") {
      /* Kabeltrommel: zwei rote Scheiben, schwarzes Kabel dazwischen */
      const x = -0.78, y = -T / 2 - 0.18, zc = 0.18;
      const ende = sicht(V, [1, 0, 0]) > 0 ? 1 : -1;
      const A = [x - ende * 0.08, y, zc], Bv = [x + ende * 0.08, y, zc];
      walze(g, V, v3(A, [ende, 0, 0], -0.015), A, 0.18, 0.18, [190, 40, 34], L);
      const Wk = walze(g, V, A, Bv, 0.13, 0.13, [28, 28, 30], L, { kappe: false });
      if (s > 30) { g.save(); vieleck(g, Wk.H); g.clip(); for (let k = 0; k < 7; k++) { const xx = A[0] + (Bv[0] - A[0]) * (k + 0.5) / 7; ringLinie(g, V, [xx, y, zc], [0, 1, 0], [0, 0, 1], 0.13, "rgba(90,90,96,0.5)", 0.006); } g.restore(); }
      walze(g, V, Bv, v3(Bv, [ende, 0, 0], 0.015), 0.18, 0.18, [200, 46, 38], L, { kappe: [210, 52, 42] });
      const m = V.p(Bv[0] + ende * 0.016, y, zc); g.fillStyle = "#222"; g.beginPath(); g.arc(m[0], m[1], 0.035 * s, 0, TAU); g.fill();
    }
  }

  /* =====================================================================
     GRUBE (Punktfundamente)
     ===================================================================== */
  function grubenMalen(g, V, F, loecher, tiefe, fuell) {
    if (F.schatten) return;
    const Z = F.Z, jahr = F.jahr, s = V.s;
    const kU = lichtK([0, 0, 1], Z, jahr);
    for (const [cx, cy, r] of loecher) {
      const loch = [[cx - r, cy - r], [cx + r, cy - r], [cx + r, cy + r], [cx - r, cy + r]];
      const oben = loch.map((q) => V.p(q[0], q[1], 0));
      const bo = fuell != null ? fuell : -tiefe;
      g.save(); vieleck(g, oben); g.clip();
      vieleck(g, loch.map((q) => V.p(q[0], q[1], bo)));
      g.fillStyle = rgb(mul(fuell != null ? [170, 168, 160] : [88, 66, 48], skal(kU, fuell != null ? 0.9 : 0.6))); g.fill();
      for (let i = 0; i < 4; i++) {
        const a = loch[i], b = loch[(i + 1) % 4];
        const nx = -(b[1] - a[1]), ny = b[0] - a[0], l = Math.hypot(nx, ny);
        const nk = V.n(-nx / l, -ny / l, 0);
        if (nk[0] * AUGE[0] + nk[1] * AUGE[1] <= 0) continue;
        vieleck(g, [V.p(a[0], a[1], 0), V.p(b[0], b[1], 0), V.p(b[0], b[1], bo), V.p(a[0], a[1], bo)]);
        g.fillStyle = rgb(mul([110, 84, 60], skal(lichtK(nk, Z, jahr), 0.75))); g.fill();
      }
      g.restore();
      g.strokeStyle = "rgba(90,70,50,0.6)"; g.lineWidth = Math.max(1, s * 0.06); vieleck(g, oben); g.stroke();
    }
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  ST.modell("marktbude", {
    name: "Marktbude", gruppe: "Weihnachten", grund: [4.0, 3.2], hoehe: 4.2, bauzeit: 5 * 60,
    bauen: function (M, o) {
      const bau = o.bau == null ? 1 : o.bau;
      const winter = o.jahr === "winter";
      const saat = Math.abs(o.saat | 0) || 1;
      const holzF = HOLZ[saat % HOLZ.length];
      const V_ = variante(o);
      const art = V_.id;
      const fertig = bau >= 1;
      const schneeAn = winter && bau >= 0.72;
      const sn = schneeAn ? SN : 0;

      /* ---- 1. Punktfundamente ---- */
      const punkte = [[-1.35, -0.95], [0, -0.95], [1.35, -0.95], [-1.35, 0.95], [0, 0.95], [1.35, 0.95]];
      if (bau < 0.2) {
        const fuell = bau < 0.1 ? null : -0.5 + 0.5 * phase(bau, 0.1, 0.16);
        M.teil("gruben", { ebene: -2, schatten: false, mitte: [0, 0, -1] });
        M.figur({ x: 0, y: 0, z: 0, breite: 5.5, hoehe: 0.3, schatten: false, malen: mitGier(function (g, s, F) { grubenMalen(g, blick(F.gier, s), F, punkte.map((p) => [p[0], p[1], 0.18]), 0.5, fuell); }) });
        if (bau < 0.16) return;
      }
      if (bau < 0.3) {
        for (const [x, y] of punkte) {
          M.teil("klotz" + x + y, { ebene: -1, schatten: false });
          const beton = (g, F) => { g.fillStyle = "#b9b6ac"; g.fillRect(0, 0, F.w, F.h); g.fillStyle = "rgba(90,86,76,0.35)"; for (let xx = 0.08; xx < F.w; xx += 0.09) g.fillRect(xx, 0, 0.006, F.h); };
          M.quader({ x: x - 0.17, y: y - 0.17, z: 0, b: 0.34, t: 0.34, h: 0.06 }, { sued: beton, nord: beton, ost: beton, west: beton, oben: "#c3c0b6" });
        }
      }
      /* ---- 2. Sockel aus Kanthölzern ---- */
      const dunkel = skal(holzF, 0.62);
      const sockel = phase(bau, 0.2, 0.3);
      if (sockel > 0) {
        M.teil("sockel", { ebene: 0 });
        const balken = gebacken((g, F) => { g.fillStyle = rgb(dunkel); g.fillRect(0, 0, F.w, F.h); g.fillStyle = "rgba(0,0,0,0.3)"; for (let x = 0.5; x < F.w; x += 0.6) g.fillRect(x, 0, 0.01, F.h); if (F.px > 20) PI.rauschen(g, 0, 0, F.w, F.h, 0.8, 0.2, 5, 3); });
        const tb = (T + 0.1) * sockel;
        M.quader({ x: -B / 2 - 0.05, y: -T / 2 - 0.05, z: 0, b: B + 0.1, t: tb, h: S0 }, {
          sued: balken, nord: balken, ost: balken, west: balken,
          oben: bau < 0.45 ? function (g, F) { g.fillStyle = rgb(skal(holzF, 1.05)); g.fillRect(0, 0, F.w, F.h); g.fillStyle = "rgba(0,0,0,0.3)"; for (let x = 0.14; x < F.w; x += 0.14) g.fillRect(x, 0, 0.008, F.h); } : null
        });
      }
      if (bau < 0.3) return;

      /* ---- 3. Wände ---- */
      const wandHoch = phase(bau, 0.32, 0.5);
      const zTop = S0 + (HW - S0) * wandHoch;
      if (bau < 0.62) {
        const staender = [[-B / 2 + 0.05, -T / 2 + 0.05], [B / 2 - 0.05, -T / 2 + 0.05], [-B / 2 + 0.05, T / 2 - 0.05], [B / 2 - 0.05, T / 2 - 0.05], [-OX, T / 2 - 0.05], [OX, T / 2 - 0.05], [0, -T / 2 + 0.05]];
        const hS = S0 + (HW - S0) * phase(bau, 0.3, 0.36);
        staender.forEach(([x, y], i) => {
          M.teil("staender" + i, { ebene: 1, schatten: false });
          const h = (g, F) => { g.fillStyle = "#c9a878"; g.fillRect(0, 0, F.w, F.h); g.fillStyle = "rgba(90,60,30,0.3)"; g.fillRect(0, 0, 0.012, F.h); };
          M.quader({ x: x - 0.05, y: y - 0.05, z: S0, b: 0.1, t: 0.1, h: hS - S0 }, { sued: h, nord: h, ost: h, west: h, oben: "#d8bc90" });
        });
      }
      const stueck = (W, H, xoff, yoff, fn) => gebacken(function (g, F) { g.save(); g.translate(-xoff, -yoff); fn(g, F, W, H); g.restore(); });
      const frontWand = (g, F, W, H) => {
        bohlen(g, W, H, holzF, F, saat);
        /* Zierrahmen um die Öffnung */
        const ox0 = B / 2 - OX, ox1 = B / 2 + OX, oy0 = HW - OZ1, oy1 = HW - OZ0, rb = 0.07;
        const rf = skal(holzF, 1.35);
        g.fillStyle = "rgba(20,10,5,0.35)"; g.fillRect(ox0 - rb + 0.012, oy0 - rb + 0.015, rb, oy1 - oy0 + rb); g.fillRect(ox0 - rb + 0.012, oy0 - rb + 0.015, ox1 - ox0 + 2 * rb, rb);
        g.fillStyle = rgb(rf); g.fillRect(ox0 - rb, oy0 - rb, rb, oy1 - oy0 + rb); g.fillRect(ox1, oy0 - rb, rb, oy1 - oy0 + rb); g.fillRect(ox0 - rb, oy0 - rb, ox1 - ox0 + 2 * rb, rb);
        g.fillStyle = rgb(skal(rf, 1.12)); g.fillRect(ox0 - rb, oy0 - rb, ox1 - ox0 + 2 * rb, 0.012);
        /* Stoffblende unter der Theke (Norwegermuster) */
        if (bau >= 0.88) {
          const ty = HW - TZ + 0.02, th = 0.42, tf = V_.tuch;
          g.fillStyle = "rgba(0,0,0,0.3)"; g.fillRect(ox0 - 0.05, ty + 0.02, ox1 - ox0 + 0.1, th);
          const gr = g.createLinearGradient(0, ty, 0, ty + th); gr.addColorStop(0, rgb(skal(tf, 0.75))); gr.addColorStop(0.2, rgb(tf)); gr.addColorStop(1, rgb(skal(tf, 0.8)));
          g.fillStyle = gr; g.beginPath(); g.moveTo(ox0 - 0.06, ty); g.lineTo(ox1 + 0.06, ty); for (let x = ox1 + 0.06; x >= ox0 - 0.06; x -= 0.1) g.lineTo(x, ty + th - 0.02 * Math.abs(Math.sin(x * 16))); g.closePath(); g.fill();
          if (F.px > 22) {
            g.fillStyle = V_.hell ? "rgba(255,255,255,0.8)" : "rgba(246,240,226,0.85)";
            for (let x = ox0 + 0.1; x < ox1 - 0.05; x += 0.26) { sternPfad(g, x, ty + th * 0.5, 0.06, 4, 0.35); g.fill(); }
            for (const yy of [ty + 0.06, ty + th - 0.08]) for (let x = ox0; x < ox1; x += 0.06) { g.beginPath(); g.moveTo(x, yy); g.lineTo(x + 0.03, yy - 0.025); g.lineTo(x + 0.06, yy); g.lineTo(x + 0.03, yy + 0.025); g.closePath(); g.fill(); }
            g.fillStyle = "rgba(0,0,0,0.12)"; for (let x = ox0; x < ox1; x += 0.18) g.fillRect(x, ty, 0.05, th);
          }
        }
        if (art === "gluehwein" || art === "spargel") {
          const x = 0.02, y = H - (OZ1 - S0) + 0.1;
          g.fillStyle = "#1e2320"; g.fillRect(x + 0.01, y, 0.14, 0.45);
          if (F.px > 50) { g.fillStyle = "rgba(240,240,230,0.85)"; for (let i = 0; i < 6; i++) g.fillRect(x + 0.04, y + 0.06 + i * 0.07, 0.08 + (i % 3) * 0.03, 0.01); }
        }
      };
      M.teil("huelle", { ebene: 1 });
      const fw = (xa, xb, za, zb, name, danach) => {
        const zt = Math.min(zb, zTop);
        if (zt <= za + 0.001) return;
        M.flaeche({ name: name, o: [xa, T / 2, zt], u: [1, 0, 0], v: [0, 0, -1], w: xb - xa, h: zt - za, malen: stueck(B, HW - S0, xa + B / 2, HW - zt, frontWand), ao: za < 0.2, traufe: zb >= HW ? 0.12 : 0, danach: danach });
      };
      /* Innenlicht: in der Ebene der Öffnung, nur wenn die Front sichtbar ist */
      const innenSchein = fertig ? function (g, F) { if (F.nacht > 0.01) F.leuchtPunkt(B / 2, HW - (OZ0 + OZ1) / 2, 0.85, "255,196,120", 0.42, false); } : null;
      fw(-B / 2, B / 2, S0, OZ0, "front-unten");
      fw(-B / 2, -OX, OZ0, OZ1, "front-links");
      fw(OX, B / 2, OZ0, OZ1, "front-rechts");
      fw(-B / 2, B / 2, OZ1, HW, "front-oben", innenSchein);
      /* Rückwand: Tür rechts, Stromkasten, Plakat, Türleuchte */
      const TUER_A = 0.25, TUER_B = 0.78;       // Tür (Flächen-x von der Ostecke), Breite
      if (zTop > S0) {
        M.flaeche({
          name: "nord", o: [B / 2, -T / 2, zTop], u: [-1, 0, 0], v: [0, 0, -1], w: B, h: zTop - S0, ao: true, traufe: zTop >= HW ? 0.4 : 0,
          danach: fertig ? function (g, F) {
            if (F.nacht <= 0.01) return;
            const x = TUER_A + TUER_B / 2, y = (HW - S0) - 2.06 - (HW - zTop);
            const gr = g.createRadialGradient(x, y, 0, x, y, 0.5);
            gr.addColorStop(0, "rgba(255,236,190," + F.nacht + ")"); gr.addColorStop(0.1, "rgba(255,210,140," + (0.6 * F.nacht) + ")"); gr.addColorStop(1, "rgba(255,170,90,0)");
            g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - 0.5, y - 0.2, 1.0, 1.2); g.globalCompositeOperation = "source-over";
            F.leuchtPunkt(x, y + 0.03, 0.32, "255,200,130", 0.55, false);
          } : null,
          malen: stueck(B, HW - S0, 0, HW - zTop, function (g, F, W, H) {
            bohlen(g, W, H, holzF, F, saat + 1);
            if (bau < 0.6) return;
            PI.tuer(g, TUER_A, H - 1.95, TUER_B, 1.95, F, { farbe: hexVon(skal(holzF, 0.8)), gewaende: false, stufe: false });
            if (winter) { g.fillStyle = "#f4f7fc"; g.fillRect(TUER_A - 0.05, H - 1.97, TUER_B + 0.1, 0.03); }
            /* Türleuchte (Wandleuchte mit Glas) */
            const lx = TUER_A + TUER_B / 2, ly = H - 2.06;
            g.fillStyle = "#24262a"; g.fillRect(lx - 0.02, ly - 0.08, 0.04, 0.06); g.fillRect(lx - 0.07, ly - 0.03, 0.14, 0.02);
            g.fillStyle = "#e8dcc0"; g.beginPath(); g.moveTo(lx - 0.06, ly - 0.01); g.lineTo(lx + 0.06, ly - 0.01); g.lineTo(lx + 0.045, ly + 0.09); g.lineTo(lx - 0.045, ly + 0.09); g.closePath(); g.fill();
            /* Stromkasten, Kabel */
            const sx = 1.2;
            g.fillStyle = "#9aa0a6"; g.fillRect(sx, H - 1.45, 0.24, 0.32); g.fillStyle = "#7a8086"; g.fillRect(sx, H - 1.45, 0.24, 0.03); g.fillStyle = "#c33"; g.fillRect(sx + 0.09, H - 1.38, 0.06, 0.04);
            g.strokeStyle = "#1a1a1a"; g.lineWidth = 0.02; g.beginPath(); g.moveTo(sx + 0.12, H - 1.13); g.quadraticCurveTo(sx + 0.2, H - 0.5, sx + 0.08, H + 0.1); g.stroke();
            /* Plakat des Weihnachtsmarkts, leicht verwittert */
            const px0 = 1.9, py0 = H - 1.95, pw = 0.56, ph = 0.78;
            g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(px0 + 0.015, py0 + 0.02, pw, ph);
            const gp = g.createLinearGradient(0, py0, 0, py0 + ph); gp.addColorStop(0, "#1d2c5a"); gp.addColorStop(1, "#0f1a3a");
            g.fillStyle = gp; g.fillRect(px0, py0, pw, ph);
            g.fillStyle = "#f2d27a"; sternPfad(g, px0 + pw / 2, py0 + 0.2, 0.11, 8, 0.45); g.fill();
            if (F.px > 45) {
              g.fillStyle = "#f7efe0"; g.textAlign = "center"; g.font = "bold 0.058px Georgia, serif"; g.fillText("Weihnachtsmarkt", px0 + pw / 2, py0 + 0.43);
              g.font = "0.05px Georgia, serif"; g.fillText("Winterhausen", px0 + pw / 2, py0 + 0.51); g.font = "0.038px sans-serif"; g.fillText("1.–23. Dezember", px0 + pw / 2, py0 + 0.6); g.fillText("täglich 11–21 Uhr", px0 + pw / 2, py0 + 0.66);
            } else { g.fillStyle = "#f7efe0"; g.fillRect(px0 + 0.08, py0 + 0.4, pw - 0.16, 0.04); g.fillRect(px0 + 0.12, py0 + 0.5, pw - 0.24, 0.03); }
            g.fillStyle = "rgba(255,255,255,0.12)"; g.beginPath(); g.moveTo(px0 + pw, py0 + ph); g.lineTo(px0 + pw - 0.12, py0 + ph); g.lineTo(px0 + pw, py0 + ph - 0.1); g.fill();
            PI.rauschen(g, px0, py0, pw, ph, 0.5, 0.25, 33, 3);
          })
        });
      }
      /* Seitenwände mit Giebel, das westliche mit Fenster */
      const mitGiebel = bau >= 0.52;
      const giebelH = mitGiebel ? HF : 0;
      const hWand = zTop - S0;
      if (hWand > 0) {
        const um = mitGiebel ? [[0, HF], [T / 2, 0], [T, HF], [T, HF + hWand], [0, HF + hWand]] : null;
        const W_FEN = { x: T * 0.5 - 0.3, y: HF + 0.5 };
        const seite = (name, o, u, saatW, fenster) => M.flaeche({
          name: name, o: o, u: u, v: [0, 0, -1], w: T, h: giebelH + hWand, umriss: um || undefined, ao: true,
          malen: stueck(T, HF + HW - S0, 0, HF + (HW - zTop) - giebelH, function (g, F, W, H) {
            bohlen(g, W, H, holzF, F, saatW);
            if (bau < 0.9) return;
            const kx = W / 2, ky = HF * 0.6;
            if (winter) {
              /* Türkranz aus Tannengrün mit Schleife */
              const L = [1, 1, 1], pts = []; for (let i = 0; i <= 24; i++) { const a = i / 24 * TAU; pts.push([kx + Math.cos(a) * 0.17, ky + Math.sin(a) * 0.17]); }
              tannenGirlande(g, F, pts, 0.09, true, L, saatW);
              g.fillStyle = "#b0142a"; g.beginPath(); g.moveTo(kx, ky + 0.17); g.quadraticCurveTo(kx - 0.1, ky + 0.1, kx - 0.09, ky + 0.22); g.closePath(); g.fill(); g.beginPath(); g.moveTo(kx, ky + 0.17); g.quadraticCurveTo(kx + 0.1, ky + 0.1, kx + 0.09, ky + 0.22); g.closePath(); g.fill();
              g.fillRect(kx - 0.02, ky + 0.17, 0.02, 0.14); g.fillRect(kx + 0.005, ky + 0.17, 0.02, 0.12);
            } else {
              const BL = ["#e0405a", "#f5c83a", "#f4f0ea", "#a060c8"];
              const pts = []; for (let i = 0; i <= 24; i++) { const a = i / 24 * TAU; pts.push([kx + Math.cos(a) * 0.17, ky + Math.sin(a) * 0.17]); }
              tannenGirlande(g, F, pts, 0.08, false, [1, 1, 1], saatW);
              for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; g.fillStyle = BL[i % 4]; g.beginPath(); g.arc(kx + Math.cos(a) * 0.17, ky + Math.sin(a) * 0.17, 0.035, 0, TAU); g.fill(); }
            }
            if (fenster) PI.fenster(g, W_FEN.x, W_FEN.y, 0.6, 0.5, F, { fluegel: 1, sprossen: [2, 2], rahmen: "#e8e0cc", bank: false, vorhang: true, laibung: "#6a4a30" });
          }),
          danach: fenster && fertig ? function (g, F) { g.save(); g.translate(0, giebelH - HF); PI.fensterLicht(g, W_FEN.x, W_FEN.y, 0.6, 0.5, F, { fluegel: 1, sprossen: [2, 2] }); g.restore(); } : null
        });
        seite("ost", [B / 2, T / 2, S0 + giebelH + hWand], [0, -1, 0], saat + 2, false);
        seite("west", [-B / 2, -T / 2, S0 + giebelH + hWand], [0, 1, 0], saat + 5, true);
      }
      if (bau < 0.5) return;

      /* ---- 4. Dach: Sparren, dann Schindeln, dann Schnee ---- */
      const yEv = T / 2 + UEV, yEh = T / 2 + UEH, zEv = HW - UEV * NEIG, zEh = HW - UEH * NEIG;
      const xm0 = -B / 2 - UEG, xm1 = B / 2 + UEG, WD = xm1 - xm0;
      const eindecken = phase(bau, 0.58, 0.72);
      if (bau < 0.72 && eindecken <= 0) {
        const holzS = (g, F) => { g.fillStyle = "#c29a66"; g.fillRect(0, 0, F.w, F.h); g.fillStyle = "rgba(90,60,30,0.25)"; g.fillRect(0, F.h * 0.8, F.w, F.h * 0.2); };
        M.teil("sparren", { ebene: 2, schatten: false });
        for (let i = 0; i < 5; i++) {
          const x = -B / 2 + 0.05 + i * (B - 0.1) / 4;
          for (const sg of [-1, 1]) {
            const Ly = sg > 0 ? yEv : yEh, dz = Ly * NEIG, L = Math.hypot(Ly, dz), d = 0.12;
            M.flaeche({ name: "sp-o", o: [x - sg * 0.04, 0, FIRST + d], u: [sg, 0, 0], v: [0, sg * Ly, -dz], w: 0.08, h: L, malen: holzS });
            for (const sx of [-1, 1]) {
              const ecken = [[0, FIRST + d], [sg * Ly, FIRST + d - dz], [sg * Ly, FIRST - dz], [0, FIRST]];
              const yo = (-sx * 0) <= (-sx * sg * Ly) ? 0 : sg * Ly, zmax = FIRST + d;
              const umS = ecken.map(([y, z]) => [(-sx) * y - (-sx) * yo, zmax - z]);
              M.flaeche({ name: "sp-s", o: [x + sx * 0.04, yo, zmax], u: [0, -sx, 0], v: [0, 0, -1], w: Ly, h: dz + d, umriss: umS, malen: holzS });
            }
          }
        }
      }
      const schildFuss = [SBX - SBW / 2 - xm0, SBX + SBW / 2 - xm0];
      if (eindecken > 0) {
        const dachMaler = (vorn) => function (g, F) {
          const h = F.h * eindecken;
          g.save(); g.beginPath(); g.rect(-0.1, F.h - h, F.w + 0.2, h + 0.1); g.clip();
          if (schneeAn) dachSchnee(g, F, F.w, F.h, { saat: saat + (vorn ? 0 : 5), schild: bau >= 0.8 ? (vorn ? schildFuss : [WD - schildFuss[1], WD - schildFuss[0]]) : null, aufsatz: bau >= 0.86 ? (vorn ? AX - xm0 : xm1 - AX) : null });
          else schindelnMalen(g, F, F.w, F.h, saat + (vorn ? 7 : 8), { moos: !winter });
          g.restore();
          if (eindecken < 1) {
            g.fillStyle = "#b8905e"; for (let i = 0; i < 5; i++) g.fillRect(UEG + 0.05 + i * (B - 0.1) / 4 - 0.04, 0, 0.08, F.h - h + 0.02);
            g.fillStyle = "#c79d68"; for (let y = 0.1; y < F.h - h; y += 0.28) g.fillRect(0, y, F.w, 0.05);
          }
        };
        /* nachts: warmer Widerschein der Lichterketten auf dem unteren Drittel und an den Giebelkanten */
        const warmDach = (vorn) => fertig && winter ? function (g, F) {
          if (F.nacht <= 0.01) return;
          const a = F.nacht;
          g.save(); g.globalCompositeOperation = "screen";
          const gr = g.createLinearGradient(0, F.h, 0, F.h * (vorn ? 0.75 : 0.62));
          gr.addColorStop(0, "rgba(255,170,90," + ((vorn ? 0.16 : 0.24) * a).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,170,90,0)");
          g.fillStyle = gr; g.fillRect(0, F.h * 0.5, F.w, F.h * 0.5);
          for (const [x0, x1] of [[0, 0.3], [F.w, F.w - 0.3]]) { const gk = g.createLinearGradient(x0, 0, x1, 0); gk.addColorStop(0, "rgba(255,176,96," + (0.18 * a).toFixed(3) + ")"); gk.addColorStop(1, "rgba(255,176,96,0)"); g.fillStyle = gk; g.fillRect(Math.min(x0, x1), 0, 0.3, F.h); }
          g.restore();
        } : null;
        M.teil("dach", { ebene: 2 });
        const LS = Math.hypot(yEv, FIRST - zEv), LN = Math.hypot(yEh, FIRST - zEh);
        M.flaeche({ name: "dach-sued", o: [xm0, 0, FIRST + sn], u: [1, 0, 0], v: [0, yEv, zEv - FIRST], w: WD, h: LS, malen: gebacken(dachMaler(true)), danach: warmDach(true), lichtExtra: schneeAn ? 0.03 : 0 });
        M.flaeche({ name: "dach-nord", o: [xm1, 0, FIRST + sn], u: [-1, 0, 0], v: [0, -yEh, zEh - FIRST], w: WD, h: LN, malen: gebacken(dachMaler(false)), danach: warmDach(false), lichtExtra: schneeAn ? 0.03 : 0 });
        /* Traufbretter (im Winter oben der Anschnitt der Schneedecke) */
        const traufe = (g, F) => { brett(g, F.w, F.h, skal(holzF, 0.72), F, saat + 31); if (sn > 0) { g.fillStyle = "#eef3fa"; g.fillRect(-0.05, -0.05, F.w + 0.1, sn + 0.05); g.fillStyle = "rgba(150,166,204,0.5)"; g.fillRect(-0.05, sn - 0.02, F.w + 0.1, 0.02); } g.fillStyle = "rgba(0,0,0,0.3)"; g.fillRect(-0.05, F.h - 0.015, F.w + 0.1, 0.015); };
        M.flaeche({ name: "traufe-sued", o: [xm0, yEv, zEv + sn], u: [1, 0, 0], v: [0, 0, -1], w: WD, h: DD + sn, malen: gebacken(traufe), keinAo: true });
        M.flaeche({ name: "traufe-nord", o: [xm1, -yEh, zEh + sn], u: [-1, 0, 0], v: [0, 0, -1], w: WD, h: DD + sn, malen: gebacken(traufe), keinAo: true });
        /* Ortgang: Windbrett entlang beider Schrägen, im Winter mit Schneeband und Lichterkette */
        const top = FIRST + sn, wO = yEv + yEh, dO = DD * 1.25 + sn;
        const ortMaler = (oberkante) => function (g, F) {
          brett(g, F.w, F.h, skal(holzF, 0.7), F, saat + 41);
          if (sn > 0) {
            g.beginPath();
            for (let x = -0.02; x <= F.w + 0.02; x += 0.04) g.lineTo(x, oberkante(x) - 0.01);
            for (let x = F.w + 0.02; x >= -0.02; x -= 0.04) g.lineTo(x, oberkante(x) + sn + 0.02 + 0.022 * Math.pow(0.5 + 0.5 * Math.sin(x * 5.3 + saat), 2));
            g.closePath();
            const gr = g.createLinearGradient(0, 0, 0, 0.3); gr.addColorStop(0, "rgb(250,252,255)"); gr.addColorStop(1, "rgb(214,224,242)");
            g.fillStyle = "rgb(236,241,250)"; g.fill();
            g.save(); g.clip(); tonFlecken(g, 0, 0, F.w, F.h, 0.8, 0.35, saat + 9, "#b8c6de", true); g.restore();
          }
        };
        const ortLicht = (oberkante) => fertig && winter ? function (g, F) {
          const pts = []; for (let x = 0.06; x <= F.w - 0.05; x += (F.w - 0.11) / 8) pts.push([x, oberkante(x) + sn + 0.07]);
          lichterKette(g, F, pts, { sag: 0.025, abstand: 0.14, L: lichtK(F.n, F.zeit, F.jahr), saat: saat + 3, scheinAbstand: 1.4, scheinR: 0.45, scheinK: 0.28 });
        } : null;
        const kOst = (x) => x <= yEv ? (top - zEv - sn) * (1 - x / yEv) : (top - zEh - sn) * ((x - yEv) / yEh);
        const kWest = (x) => x <= yEh ? (top - zEh - sn) * (1 - x / yEh) : (top - zEv - sn) * ((x - yEh) / yEv);
        M.flaeche({ name: "ort-ost", o: [xm1, yEv, top], u: [0, -1, 0], v: [0, 0, -1], w: wO, h: top - Math.min(zEv, zEh) + dO + 0.1,
          umriss: [[0, top - zEv - sn], [yEv, 0], [wO, top - zEh - sn], [wO, top - zEh - sn + dO], [yEv, dO], [0, top - zEv - sn + dO]], malen: gebacken(ortMaler(kOst)), danach: ortLicht(kOst), keinAo: true });
        M.flaeche({ name: "ort-west", o: [xm0, -yEh, top], u: [0, 1, 0], v: [0, 0, -1], w: wO, h: top - Math.min(zEv, zEh) + dO + 0.1,
          umriss: [[0, top - zEh - sn], [yEh, 0], [wO, top - zEv - sn], [wO, top - zEv - sn + dO], [yEh, dO], [0, top - zEh - sn + dO]], malen: gebacken(ortMaler(kWest)), danach: ortLicht(kWest), keinAo: true });
        /* Schneekanten mit Dicke an den Traufen, hinten mit Eiszapfen */
        if (schneeAn) {
          M.flaeche({ name: "wechte-nord", o: [xm1 + 0.03, -yEh - 0.05, zEh + sn + 0.012], u: [-1, 0, 0], v: [0, 0, -1], w: WD + 0.06, h: sn + DD + 0.5, keinLicht: true, keinAo: true, ebene: 1,
            malen: gebacken(schneeKante({ saat: saat + 13, dick: sn + 0.03, haengt: 0.06, eis: bau >= 0.9 ? 0.34 : 0, eisY: sn + DD + 0.005, warm: fertig })) });
          M.flaeche({ name: "wechte-sued", o: [xm0 - 0.03, yEv + 0.035, zEv + sn + 0.012], u: [1, 0, 0], v: [0, 0, -1], w: WD + 0.06, h: sn + 0.1, keinLicht: true, keinAo: true, ebene: 1,
            malen: gebacken(schneeKante({ saat: saat + 17, dick: sn + 0.02, haengt: 0.03, eis: 0, warm: fertig })) });
        }
      }
      if (bau < 0.72) return;

      /* ---- 5. Innen: Rückwand, Seiten, Boden, Verkäuferin, Lichterkette ---- */
      M.teil("innen", { ebene: 1, schatten: false, mitte: [0, 0, -2] });
      M.flaeche({ name: "innen-rueck", o: [-B / 2 + D, -T / 2 + D, HW], u: [1, 0, 0], v: [0, 0, -1], w: B - 2 * D, h: HW - S0, malen: gebacken(rueckwandInnen(art, holzF, saat)), keinLicht: true });
      M.flaeche({ name: "innen-west", o: [-B / 2 + D, T / 2 - D, HW], u: [0, -1, 0], v: [0, 0, -1], w: T - 2 * D, h: HW - S0, malen: gebacken(innenFlaeche(holzF, saat + 21, false)), keinLicht: true });
      M.flaeche({ name: "innen-ost", o: [B / 2 - D, -T / 2 + D, HW], u: [0, 1, 0], v: [0, 0, -1], w: T - 2 * D, h: HW - S0, malen: gebacken(innenFlaeche(holzF, saat + 22, false)), keinLicht: true });
      M.flaeche({ name: "innen-boden", o: [-B / 2 + D, -T / 2 + D, S0 + 0.002], u: [1, 0, 0], v: [0, 1, 0], w: B - 2 * D, h: T - 2 * D, malen: gebacken(innenFlaeche(holzF, saat, true)), keinLicht: true });
      const laib = (g, F) => { g.fillStyle = rgb(skal(holzF, 1.1)); g.fillRect(0, 0, F.w, F.h); };
      M.flaeche({ name: "laibung-l", o: [-OX, T / 2, OZ1], u: [0, -1, 0], v: [0, 0, -1], w: D, h: OZ1 - OZ0, malen: laib });
      M.flaeche({ name: "laibung-r", o: [OX, T / 2 - D, OZ1], u: [0, 1, 0], v: [0, 0, -1], w: D, h: OZ1 - OZ0, malen: laib });
      M.flaeche({ name: "sturz-unten", o: [-OX, T / 2 - D, OZ1], u: [1, 0, 0], v: [0, 1, 0], w: 2 * OX, h: D, malen: laib });
      if (bau >= 0.9) {
        const fx = 0.32, fy = T / 2 - 0.32;
        M.figur({ x: fx, y: fy, z: S0, breite: 0.8, hoehe: 1.85, schatten: false, malen: mitGier(function (g, s, F) { verkaeuferMalen(g, s, F, o, art, fx, fy, S0); }) });
        M.figur({ x: 0, y: 0, z: 0, breite: 3, hoehe: 2.4, schatten: false, malen: mitGier(innenKetteMalen) });
      }

      /* ---- 6. Theke mit Konsolen und Auslage (vor der Frontwand) ---- */
      M.teil("konsolen", { ebene: 1, schatten: false, mitte: [0, T / 2 + VORN, TZ - 0.4] });
      for (const x of [-1.05, 1.05]) M.flaeche({ name: "konsole" + x, o: [x - 0.02, T / 2, TZ - 0.06], u: [0, 1, 0], v: [0, 0, -1], w: 0.4, h: 0.34, umriss: [[0, 0], [0.4, 0], [0.03, 0.34], [0, 0.34]], malen: rgb(skal(holzF, 0.9)), beidseitig: true });
      M.teil("theke", { ebene: 1, mitte: [0, T / 2 + VORN, TZ] });
      const thekeHolz = (g, F) => { g.fillStyle = rgb(skal(holzF, 1.15)); g.fillRect(0, 0, F.w, F.h); g.fillStyle = "rgba(0,0,0,0.2)"; g.fillRect(0, F.h - 0.01, F.w, 0.01); };
      M.quader({ x: -OX - 0.12, y: T / 2 - 0.04, z: TZ - 0.06, b: 2 * OX + 0.24, t: 0.46, h: 0.06 }, {
        sued: thekeHolz, ost: thekeHolz, west: thekeHolz,
        oben: gebacken(function (g, F) {
          brett(g, F.w, F.h, skal(holzF, 1.25), F, saat + 51);
          g.fillStyle = "rgba(60,30,10,0.25)"; for (let y = 0.115; y < F.h; y += 0.115) g.fillRect(0, y, F.w, 0.006);
          if (winter) { g.fillStyle = "rgba(245,248,253,0.9)"; g.beginPath(); g.moveTo(0, F.h); for (let x = 0; x <= F.w; x += 0.08) g.lineTo(x, F.h - 0.04 - 0.02 * Math.abs(Math.sin(x * 7))); g.lineTo(F.w, F.h); g.fill(); }
        })
      });
      if (bau >= 0.88) {
        M.teil("auslage", { ebene: 1, schatten: false, mitte: [0, T / 2 + VORN, TZ + 0.4] });
        M.figur({ x: 0, y: AY, z: TZ, breite: 3.2, hoehe: 0.9, schatten: false, malen: mitGier(function (g, s, F) { auslageMalen(g, s, F, art, o); }) });
        /* Dampf: weiche Schwaden, die im Gegenlicht der Bude sichtbar werden */
        if (art === "gluehwein" || art === "mandeln") {
          const quellen = art === "gluehwein" ? [[-1.05, 1.28, TZ + 0.5, 1.4], [-0.52, 1.25, TZ + 0.14, 0.6], [0.52, 1.32, TZ + 0.14, 0.6]] : [[-0.95, 1.28, TZ + 0.45, 1.2]];
          M.lebendig(function (g, P) {
            if ((-P.sn + P.c) * 0.7 < 0.05) return;
            const s = P.s, nacht = P.Z ? P.Z.nacht : 0, farbe = nacht > 0.3 ? "255,226,196" : "246,246,250";
            for (let q = 0; q < quellen.length; q++) {
              const [x, y, z, k] = quellen[q];
              for (let i = 0; i < 5; i++) {
                const ph = (P.t * 0.28 + i / 5 + q * 0.31) % 1;
                const hoch = ph * 0.8 * k, r = (0.1 + ph * 0.18) * s * k;
                const c = P.proj(x + Math.sin(P.t * 0.7 + i + q) * 0.06 * ph, y + ph * 0.05, z + hoch);
                const a = (1 - ph) * (ph < 0.18 ? ph / 0.18 : 1) * 0.35 * (nacht > 0.3 ? 1 : 0.8);
                const gr = g.createRadialGradient(c[0], c[1], 0, c[0], c[1], r);
                gr.addColorStop(0, "rgba(" + farbe + "," + a.toFixed(3) + ")"); gr.addColorStop(0.55, "rgba(" + farbe + "," + (a * 0.45).toFixed(3) + ")"); gr.addColorStop(1, "rgba(" + farbe + ",0)");
                g.fillStyle = gr; g.beginPath(); g.ellipse(c[0], c[1], r, r * 0.85, 0, 0, TAU); g.fill();
              }
            }
          });
        }
      }

      /* ---- 7. Verkaufsklappe (zu bis 0,92, dann wird sie hochgestellt) ---- */
      if (bau >= 0.8) {
        const wkl = -90 + (90 + KWI) * phase(bau, 0.92, 0.97), ka = wkl * Math.PI / 180;
        const d = [0, Math.cos(ka), Math.sin(ka)], nT = [0, -Math.sin(ka), Math.cos(ka)], nU = [0, Math.sin(ka), -Math.cos(ka)];
        const auf = bau >= 0.97;
        const spitze = [0, HY + d[1] * KL, HZ + d[2] * KL];
        M.teil("klappe", { ebene: 2, mitte: [0, T / 2 + VORN, 2.6] });
        const unterseite = gebacken(function (g, F) {
          const bretter = 6, rng = ST.zufall(saat + 61);
          for (let i = 0; i < bretter; i++) { const c = skal(holzF, 0.95 + rng() * 0.2); g.fillStyle = rgb(c); g.fillRect(F.w * i / bretter, -0.05, F.w / bretter, F.h + 0.1); g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(F.w * (i + 1) / bretter - 0.006, -0.05, 0.006, F.h + 0.1); }
          if (F.px > 20) PI.rauschen(g, 0, 0, F.w, F.h, 1, 0.2, saat % 30, 3);
          g.fillStyle = rgb(skal(holzF, 0.8)); for (const y of [0.16, F.h - 0.16]) { g.fillRect(0.05, y - 0.04, F.w - 0.1, 0.08); g.fillStyle = "rgba(0,0,0,0.3)"; g.fillRect(0.05, y + 0.04, F.w - 0.1, 0.015); g.fillStyle = rgb(skal(holzF, 0.8)); }
          g.fillStyle = "#3a3a3e"; for (const x of [0.3, F.w - 0.3]) g.fillRect(x - 0.03, 0, 0.06, 0.12);
        });
        const unterLicht = fertig ? function (g, F) {
          const Lk = lichtK(F.n, F.zeit, F.jahr);
          if (F.nacht > 0.01) {
            const gr = g.createLinearGradient(0, 0, 0, F.h); gr.addColorStop(0, "rgba(255,190,110," + (0.45 * F.nacht).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,190,110," + (0.12 * F.nacht).toFixed(3) + ")");
            g.save(); g.globalCompositeOperation = "screen"; g.fillStyle = gr; g.fillRect(0, 0, F.w, F.h); g.restore();
          }
          if (winter) {
            for (const yy of [F.h - 0.1, 0.5]) { const pts = []; for (let k = 0; k <= 6; k++) pts.push([0.08 + k * (F.w - 0.16) / 6, yy]); lichterKette(g, F, pts, { sag: 0.03, abstand: 0.13, L: Lk, saat: saat + (yy > 1 ? 5 : 6), scheinAbstand: 1.3, scheinR: 0.55, scheinK: 0.3 }); }
          }
        } : null;
        M.flaeche({ name: "klappe-unten", o: [KW / 2, HY, HZ], u: [-1, 0, 0], v: d, w: KW, h: KL, malen: unterseite, danach: unterLicht });
        M.flaeche({ name: "klappe-oben", o: v3([-KW / 2, HY, HZ], nT, KD), u: [1, 0, 0], v: d, w: KW, h: KL, malen: gebacken(function (g, F) {
          /* Außenseite: waagrechte Stülpschalung (wie die Wände), vergraut */
          brett(g, F.w, F.h, misch(skal(holzF, 1.1), [130, 120, 110], 0.35), F, saat + 71);
          g.fillStyle = "rgba(0,0,0,0.3)"; for (let y = 0.2; y < F.h; y += 0.2) g.fillRect(-0.05, y, F.w + 0.1, 0.012);
          g.fillStyle = "rgba(255,240,220,0.12)"; for (let y = 0.212; y < F.h; y += 0.2) g.fillRect(-0.05, y, F.w + 0.1, 0.01);
          if (winter && auf) {
            /* steile Klappe: der Schnee rutscht ab – nur Reif und ein
               schmaler Streifen an der Oberkante */
            tonFlecken(g, 0, 0, F.w, F.h, 0.6, 0.35, saat + 4, "#e6edf7", true);
            g.fillStyle = "rgba(244,247,252,0.95)"; g.beginPath(); g.moveTo(0, F.h); for (let x = 0; x <= F.w; x += 0.06) g.lineTo(x, F.h - 0.03 - 0.02 * Math.abs(Math.sin(x * 4.3 + saat))); g.lineTo(F.w, F.h); g.fill();
          }
        }) });
        M.flaeche({ name: "klappe-kante", o: v3(spitze.map((v, i) => i === 0 ? -KW / 2 : v), nT, KD), u: [1, 0, 0], v: nU, w: KW, h: KD, malen: rgb(skal(holzF, 0.7)) });
        M.flaeche({ name: "klappe-ost", o: v3([KW / 2, spitze[1], spitze[2]], nT, KD), u: [0, -d[1], -d[2]], v: nU, w: KL, h: KD, malen: rgb(skal(holzF, 0.7)) });
        M.flaeche({ name: "klappe-west", o: v3([-KW / 2, HY, HZ], nT, KD), u: d, v: nU, w: KL, h: KD, malen: rgb(skal(holzF, 0.7)) });
        if (auf && bau >= 0.97) {
          /* Girlande an der Klappenkante mit Hängeschmuck bzw. Wimpeln */
          M.flaeche({ name: "klappe-girlande", o: [-KW / 2 - 0.04, spitze[1] + 0.03, spitze[2] + 0.02], u: [1, 0, 0], v: [0, 0, -1], w: KW + 0.08, h: 0.62, keinLicht: true, malen: gebacken(function (g, F) {
            const Lk = lichtK([F.n[0] * 0.6, F.n[1] * 0.6, 0.8], F.zeit, F.jahr);
            const kk = [Math.max(Lk[0], 0.36), Math.max(Lk[1], 0.38), Math.max(Lk[2], 0.44)];
            const w = F.w, bogen = (x) => 0.06 + 0.1 * Math.abs(Math.sin(Math.PI * x / w * 3));
            const linie = []; for (let x = 0; x <= w + 0.001; x += w / 36) linie.push([x, bogen(x)]);
            if (art === "lebkuchen" || art === "holzkunst") {
              const n = art === "lebkuchen" ? 7 : 8;
              for (let i = 0; i < n; i++) {
                const x = (i + 0.5) / n * w, l = 0.12 + (i % 2) * 0.1;
                g.strokeStyle = rgb(mul([200, 30, 40], kk)); g.lineWidth = 0.012; g.beginPath(); g.moveTo(x, bogen(x) + 0.02); g.lineTo(x, bogen(x) + l); g.stroke();
                if (art === "lebkuchen") lebkuchenHerz(g, x, bogen(x) + l + 0.12, 0.13, kk, F.px, ["Ich mag dich", "Frohes Fest", "Für dich", "Schatz"][i % 4], [[200, 30, 40], [30, 110, 60], [60, 90, 180]][i % 3]);
                else { sternPfad(g, x, bogen(x) + l + 0.1, 0.09, 5, 0.45); g.fillStyle = rgb(mul([214, 176, 112], kk)); g.fill(); g.strokeStyle = rgb(mul([150, 110, 60], kk)); g.lineWidth = 0.008; g.stroke(); }
              }
            }
            if (winter) {
              tannenGirlande(g, F, linie, 0.12, true, kk, saat + 81);
              for (let j = 0; j <= 3; j++) { const x = j * w / 3, y = 0.06; g.fillStyle = rgb(mul([170, 16, 28], kk)); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x - 0.09, y - 0.08, x - 0.08, y + 0.03); g.closePath(); g.fill(); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 0.09, y - 0.08, x + 0.08, y + 0.03); g.closePath(); g.fill(); g.fillRect(x - 0.015, y, 0.02, 0.12); g.fillRect(x + 0.005, y, 0.02, 0.1); }
              lichterKette(g, F, linie.filter((_, i) => i % 3 === 0).map(([x, y]) => [x, y + 0.03]), { sag: 0.02, abstand: 0.12, L: kk, saat: saat + 9, scheinAbstand: 1.3, scheinR: 0.5, scheinK: 0.28 });
            } else {
              g.strokeStyle = rgb(mul([230, 230, 230], kk)); g.lineWidth = 0.012; g.beginPath(); linie.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
              const WF = [[220, 40, 50], [250, 200, 40], [40, 120, 200], [60, 160, 80], [240, 120, 170]];
              for (let i = 0; i < 18; i++) { const x = (i + 0.5) / 18 * w, y = bogen(x); const gr = g.createLinearGradient(x - 0.07, 0, x + 0.07, 0); const f = WF[i % WF.length]; gr.addColorStop(0, rgb(mul(f, kk))); gr.addColorStop(1, rgb(mul(skal(f, 0.75), kk))); g.fillStyle = gr; g.beginPath(); g.moveTo(x - 0.07, y); g.lineTo(x + 0.07, y); g.lineTo(x + 0.005, y + 0.17); g.closePath(); g.fill(); }
            }
          }) });
          /* Streben: Stahlrohr von der Wand zur Klappenunterseite */
          M.teil("streben", { ebene: 2, schatten: false, mitte: [0, T / 2 + VORN + 1, 2] });
          M.figur({ x: 0, y: 0, z: 0, breite: 3.2, hoehe: 3.2, schatten: false, malen: mitGier(function (g, s, F) {
            if (F.schatten) return;
            const V = blick(F.gier, s), L = (n) => lichtK(n, F.Z, F.jahr);
            for (const sx of [-1, 1]) {
              const a = [sx * (OX + 0.06), T / 2 + 0.015, OZ0 + 0.3], b = v3(v3([sx * (OX + 0.06), HY, HZ], d, KL * 0.62), nU, 0.01);
              walze(g, V, a, b, 0.018, 0.018, [70, 72, 78], L, { kappe: false });
            }
          }) });
        }
      }

      /* ---- 8. Schild auf dem First, Dachaufsatz ---- */
      if (bau >= 0.8) {
        M.teil("schild", { ebene: 3, mitte: [SBX, 0, FIRST + 0.3] });
        const sh = 0.46, z0 = FIRST + sn - 0.02, x0 = SBX - SBW / 2, x1 = SBX + SBW / 2;
        M.flaeche({ name: "schild-vorn", o: [x0, 0.03, z0 + sh], u: [1, 0, 0], v: [0, 0, -1], w: SBW, h: sh, malen: gebacken(function (g, F) {
          const w = F.w, h = F.h, brettF = V_.brett;
          g.fillStyle = rgb(skal(brettF, 0.8)); g.fillRect(0, 0, w, h);
          PI.rundRechteck(g, 0.03, 0.03, w - 0.06, h - 0.06, 0.04); g.fillStyle = rgb(brettF); g.fill();
          if (F.px > 20) PI.rauschen(g, 0, 0, w, h, 0.8, 0.2, 3, 3);
          const schrift = V_.hell ? "#2c4a2a" : "#f1e2b8";
          g.strokeStyle = V_.hell ? "rgba(60,90,50,0.7)" : "rgba(220,190,120,0.8)"; g.lineWidth = 0.012;
          PI.rundRechteck(g, 0.06, 0.06, w - 0.12, h - 0.12, 0.03); g.stroke();
          schildText(g, V_.schild, w / 2, h * 0.42, w * 0.84, h * 0.46, schrift, F.px);
          if (F.px > 50) schildText(g, V_.unter, w / 2, h * 0.8, w * 0.7, h * 0.14, schrift, F.px);
          if (F.px > 16) { g.fillStyle = V_.hell ? "#c0392b" : "#e2b85a"; for (const x of [0.15, w - 0.15]) { sternPfad(g, x, h * 0.45, 0.065, 5, 0.42); g.fill(); } }
        }) });
        M.flaeche({ name: "schild-hinten", o: [x1, -0.03, z0 + sh], u: [-1, 0, 0], v: [0, 0, -1], w: SBW, h: sh, malen: gebacken(function (g, F) { bohlen(g, F.w, F.h, skal(holzF, 0.9), F, saat + 9, true); }) });
        M.flaeche({ name: "schild-oben", o: [x0, -0.03, z0 + sh], u: [1, 0, 0], v: [0, 1, 0], w: SBW, h: 0.06, malen: winter ? "#f3f6fb" : rgb(skal(holzF, 0.8)) });
        M.flaeche({ name: "schild-seite-o", o: [x1, 0.03, z0 + sh], u: [0, -1, 0], v: [0, 0, -1], w: 0.06, h: sh, malen: rgb(skal(holzF, 0.8)) });
        M.flaeche({ name: "schild-seite-w", o: [x0, -0.03, z0 + sh], u: [0, 1, 0], v: [0, 0, -1], w: 0.06, h: sh, malen: rgb(skal(holzF, 0.8)) });
        if (winter) M.flaeche({ name: "schild-schnee", o: [x0 - 0.02, 0.05, z0 + sh + 0.05], u: [1, 0, 0], v: [0, 0, -1], w: SBW + 0.04, h: 0.08, malen: function (g, F) { g.fillStyle = "#f5f8fd"; g.beginPath(); g.moveTo(0, F.h); for (let x = 0; x <= F.w; x += 0.06) g.lineTo(x, 0.02 + 0.03 * Math.abs(Math.sin(x * 7))); g.lineTo(F.w, F.h); g.fill(); g.fillStyle = "rgba(150,166,206,0.45)"; g.fillRect(0, F.h - 0.02, F.w, 0.02); } });
      }
      if (bau >= 0.86) {
        M.teil("aufsatz", { ebene: 3, schatten: false, mitte: [AX, 0, FIRST + 0.5] });
        M.figur({ x: AX, y: 0, z: FIRST + sn, breite: 1.2, hoehe: 1.4, schatten: false, malen: mitGier(function (g, s, F) { aufsatzMalen(g, s, F, art, FIRST + sn, winter); }) });
      }
      /* ---- 9. Girlande an der hinteren Traufe (unter dem Traufbrett) ---- */
      if (bau >= 0.84) {
        M.teil("girlande-hinten", { ebene: 3, schatten: false, mitte: [0, -T / 2 - VORN, 2.1] });
        M.flaeche({ name: "girlande-h", o: [B / 2 + 0.15, -yEh - 0.09, zEh - DD + 0.03], u: [-1, 0, 0], v: [0, 0, -1], w: B + 0.3, h: 0.42, keinLicht: true, malen: gebacken(function (g, F) {
          const Lk = lichtK([F.n[0] * 0.6, F.n[1] * 0.6, 0.8], F.zeit, F.jahr), kk = [Math.max(Lk[0], 0.34), Math.max(Lk[1], 0.36), Math.max(Lk[2], 0.42)];
          const w = F.w, bogen = (x) => 0.05 + 0.1 * Math.abs(Math.sin(Math.PI * x / w * 3));
          const linie = []; for (let x = 0; x <= w + 0.001; x += w / 36) linie.push([x, bogen(x)]);
          if (winter) {
            tannenGirlande(g, F, linie, 0.12, true, kk, saat + 91);
            for (let j = 0; j <= 3; j++) { const x = j * w / 3, y = 0.05; g.fillStyle = rgb(mul([170, 16, 28], kk)); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x - 0.09, y - 0.08, x - 0.08, y + 0.03); g.closePath(); g.fill(); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 0.09, y - 0.08, x + 0.08, y + 0.03); g.closePath(); g.fill(); }
            lichterKette(g, F, linie.filter((_, i) => i % 3 === 0).map(([x, y]) => [x, y + 0.03]), { an: fertig, sag: 0.02, abstand: 0.12, L: kk, saat: saat + 11, scheinAbstand: 1.2, scheinR: 0.5, scheinK: 0.3 });
          } else {
            g.strokeStyle = rgb(mul([230, 230, 230], kk)); g.lineWidth = 0.012; g.beginPath(); linie.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
            const WF = [[220, 40, 50], [250, 200, 40], [40, 120, 200], [60, 160, 80], [240, 120, 170]];
            for (let i = 0; i < 16; i++) { const x = (i + 0.5) / 16 * w, y = bogen(x); g.fillStyle = rgb(mul(WF[(i + 2) % WF.length], kk)); g.beginPath(); g.moveTo(x - 0.07, y); g.lineTo(x + 0.07, y); g.lineTo(x, y + 0.16); g.closePath(); g.fill(); }
          }
        }) });
      }

      /* ---- 10. Rückseite und Seiten: Kisten, Gas, Trommel, Holz, Tonne ---- */
      if (bau >= 0.9) {
        const KF = [[176, 34, 40], [38, 72, 140], [200, 170, 40]];
        const kiste = (x, y, z, i) => {
          const f = KF[(i + saat) % 3];
          const seite = gebacken(function (g, F) {
            g.fillStyle = rgb(f); g.fillRect(0, 0, F.w, F.h);
            g.fillStyle = rgb(skal(f, 0.7)); for (let k = 1; k < 5; k++) g.fillRect(F.w * k / 5 - 0.008, 0.03, 0.016, F.h - 0.06);
            g.fillStyle = rgb(skal(f, 0.55)); g.fillRect(0, 0, F.w, 0.025); g.fillRect(0, F.h - 0.02, F.w, 0.02);
            if (F.w > 0.35) { g.fillStyle = "rgba(10,10,10,0.8)"; PI.rundRechteck(g, F.w / 2 - 0.06, 0.04, 0.12, 0.035, 0.015); g.fill(); }
          });
          M.quader({ x: x, y: y, z: z, b: 0.4, t: 0.3, h: 0.28 }, { sued: seite, nord: seite, ost: seite, west: seite, oben: gebacken(function (g, F) {
            g.fillStyle = rgb(skal(f, 0.5)); g.fillRect(0, 0, F.w, F.h);
            for (let a = 0; a < 5; a++) for (let b = 0; b < 4; b++) { const cx = 0.04 + a * 0.08, cy = 0.04 + b * 0.075; g.fillStyle = "#2c3a2c"; g.beginPath(); g.arc(cx, cy, 0.03, 0, TAU); g.fill(); g.fillStyle = ["#c9a13b", "#d8d8d8", "#b0302c"][(a + b + i) % 3]; g.beginPath(); g.arc(cx, cy, 0.016, 0, TAU); g.fill(); }
            if (winter) { g.save(); g.globalAlpha = 0.85; tonFlecken(g, 0, 0, F.w, F.h, 0.35, 1, i + 3, "#f2f5fb"); g.restore(); }
          }) });
        };
        const yK = -T / 2 - 0.32;
        let ki = 0;
        for (const [x, n] of [[-0.62, 3], [-0.18, 2]]) {
          M.teil("kisten" + x, { ebene: 1, mitte: [x + 0.2, -T / 2 - VORN, 0.4] });
          for (let k = 0; k < n; k++) kiste(x, yK, k * 0.28, ki++);
        }
        M.teil("gas", { ebene: 1, mitte: [-1.18, -T / 2 - VORN, 0.3] });
        M.figur({ x: -1.18, y: -T / 2 - 0.2, z: 0, breite: 0.6, hoehe: 0.7, malen: mitGier(function (g, s, F) { rundDingMalen(g, s, F, "gas", winter, -1.18, -T / 2 - 0.2); }) });
        M.teil("trommel", { ebene: 1, schatten: false, mitte: [-0.78, -T / 2 - VORN - 0.5, 0.2] });
        M.figur({ x: -0.78, y: -T / 2 - 0.18, z: 0, breite: 0.5, hoehe: 0.4, schatten: false, malen: mitGier(function (g, s, F) { if (!F.schatten) rundDingMalen(g, s, F, "trommel", winter, -0.78, -T / 2 - 0.18); }) });
        /* Brennholz an der Ostwand: Stirnseiten der Scheite */
        M.teil("holzstapel", { ebene: 1, mitte: [B / 2 + VORN, -0.2, 0.45] });
        const hx0 = B / 2 + 0.02, hy0 = -0.95, hb = 0.34, ht = 1.3, hh = 0.9;
        const stirn = gebacken(function (g, F) {
          const rng = ST.zufall(saat + 101);
          g.fillStyle = "#3a2a1c"; g.fillRect(0, 0, F.w, F.h);
          for (let y = F.h - 0.06; y > 0.02; y -= 0.1) for (let x = 0.05 + (Math.round(y * 10) % 2) * 0.05; x < F.w - 0.02; x += 0.1) {
            const r = 0.042 + rng() * 0.012, cx = x + (rng() - 0.5) * 0.015, cy = y + (rng() - 0.5) * 0.015;
            g.fillStyle = "#5a3c24"; g.beginPath(); g.arc(cx, cy, r + 0.008, 0, TAU); g.fill();
            const gr = g.createRadialGradient(cx - r * 0.2, cy - r * 0.2, 0, cx, cy, r); gr.addColorStop(0, "#e2c08e"); gr.addColorStop(1, "#b88c58");
            g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill();
            if (F.px > 40) { g.strokeStyle = "rgba(120,84,48,0.5)"; g.lineWidth = 0.004; for (const rr of [0.35, 0.65]) { g.beginPath(); g.arc(cx, cy, r * rr, 0, TAU); g.stroke(); } g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + r * 0.9, cy - r * 0.3); g.stroke(); }
          }
          if (winter) { g.fillStyle = "rgba(246,249,255,0.95)"; g.beginPath(); g.moveTo(0, 0); for (let x = 0; x <= F.w; x += 0.04) g.lineTo(x, 0.03 + 0.025 * Math.abs(Math.sin(x * 11))); g.lineTo(F.w, 0); g.fill(); }
        });
        const rinde = gebacken(function (g, F) {
          const rng = ST.zufall(saat + 103);
          g.fillStyle = "#3a2a1c"; g.fillRect(0, 0, F.w, F.h);
          for (let y = F.h - 0.06; y > 0.02; y -= 0.1) { const gr = g.createLinearGradient(0, y - 0.05, 0, y + 0.05); gr.addColorStop(0, "#6a4a30"); gr.addColorStop(0.5, "#8a6440"); gr.addColorStop(1, "#4a3220"); g.fillStyle = gr; g.fillRect(0, y - 0.045, F.w, 0.09); if (F.px > 30) { g.fillStyle = "rgba(30,20,12,0.5)"; for (let k = 0; k < F.w * 12; k++) g.fillRect(rng() * F.w, y - 0.04 + rng() * 0.08, 0.03 + rng() * 0.05, 0.006); } }
          if (winter) { g.fillStyle = "rgba(246,249,255,0.95)"; g.fillRect(0, 0, F.w, 0.03); }
        });
        M.quader({ x: hx0, y: hy0, z: 0, b: hb, t: ht, h: hh }, { ost: rinde, sued: stirn, nord: stirn, oben: winter ? gebacken(function (g, F) { g.fillStyle = "#eef3fa"; g.fillRect(0, 0, F.w, F.h); tonFlecken(g, 0, 0, F.w, F.h, 0.6, 0.6, saat + 7, "#c4d0e4", true); }) : "#6a4a30" });
        /* Mülltonne (120 l) an der Westseite */
        M.teil("tonne", { ebene: 1, mitte: [-B / 2 - VORN, -0.75, 0.45] });
        const tf = [52, 70, 60];
        const tonne = gebacken(function (g, F) { const gr = g.createLinearGradient(0, 0, 0, F.h); gr.addColorStop(0, rgb(skal(tf, 1.05))); gr.addColorStop(1, rgb(skal(tf, 0.8))); g.fillStyle = gr; g.fillRect(0, 0, F.w, F.h); g.fillStyle = rgb(skal(tf, 0.7)); for (let k = 1; k < 4; k++) g.fillRect(0.04, F.h * k / 4, F.w - 0.08, 0.015); g.fillStyle = "rgba(255,255,255,0.08)"; g.fillRect(0.03, 0, 0.04, F.h); });
        M.quader({ x: -B / 2 - 0.5, y: -1.02, z: 0, b: 0.48, t: 0.55, h: 0.86 }, { sued: tonne, nord: tonne, ost: tonne, west: tonne });
        M.quader({ x: -B / 2 - 0.52, y: -1.05, z: 0.86, b: 0.52, t: 0.6, h: 0.06 }, { sued: rgb(skal(tf, 0.85)), nord: rgb(skal(tf, 0.85)), ost: rgb(skal(tf, 0.85)), west: rgb(skal(tf, 0.85)), oben: winter ? gebacken(function (g, F) { g.fillStyle = "#eef3fa"; g.fillRect(0, 0, F.w, F.h); tonFlecken(g, 0, 0, F.w, F.h, 0.5, 0.5, saat + 17, "#c4d0e4", true); g.fillStyle = "rgba(150,166,206,0.4)"; g.fillRect(0, F.h - 0.03, F.w, 0.03); }) : rgb(skal(tf, 1.05)) });
      }

      /* ---- 11. Lichtpfützen am Boden (nachts), vom Haus verdeckt ---- */
      if (fertig) {
        M.teil("bodenlicht", { ebene: -2, schatten: false, mitte: [0, 0, -1] });
        const pfuetze = (cx, cy, rx, ry, k) => function (g, F) {
          if (F.nacht <= 0.01) return;
          const gr = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
          gr.addColorStop(0, "rgba(255,196,120," + (k * F.nacht).toFixed(3) + ")"); gr.addColorStop(0.45, "rgba(255,180,100," + (k * 0.4 * F.nacht).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,170,90,0)");
          g.save(); g.translate(cx, cy); g.scale(1, ry / rx); g.translate(-cx, -cy); g.fillStyle = gr; g.fillRect(cx - rx, cy - rx, 2 * rx, 2 * rx); g.restore();
        };
        M.flaeche({ name: "pfuetze-vorn", o: [-B / 2 - 0.8, T / 2, 0.012], u: [1, 0, 0], v: [0, 1, 0], w: B + 1.6, h: 2.4, keinLicht: true, malen: pfuetze(B / 2 + 0.8, 0.5, 2.1, 1.5, 0.34) });
        const tx = B / 2 - TUER_A - TUER_B / 2;
        M.flaeche({ name: "pfuetze-hinten", o: [tx - 1.2, -T / 2 - 1.6, 0.012], u: [1, 0, 0], v: [0, 1, 0], w: 2.4, h: 1.6, keinLicht: true, malen: pfuetze(1.2, 1.6, 1.1, 0.9, 0.26) });
      }
    }
  });
})();
