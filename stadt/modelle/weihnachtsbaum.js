/* =====================================================================
   BAUKASTEN-STADT — DER GROSSE CHRISTBAUM (Winter) · MAIBAUM (Frühling)
   ---------------------------------------------------------------------
   XANDER: „Ich möchte einen Liebreiz zur Weihnachtsdeko … dieses
   Weihnachtsdorf … mit Schmücken, mit Schnee, mit Santa Claus … alles
   dabei. Das möchte ich in Perfektion." – „dass wir das später in einen
   Frühlingsgewand packen können." – „Das soll keine Comic Grafik sein.
   Das soll noch viel mehr am Realismus dran sein." – „Richtig filigran."

   WIE DER BAUM GEBAUT IST
   Eine Tanne ist kein Kasten aus Flächen. Deshalb ist der Baum eine
   „Figur" des Kerns, die sich aber selbst in echtem 3D ausrechnet:
   jeder Ast ist ein Zweigfächer im Raum (Quirl für Quirl, nach oben
   kürzer), jede Kugel, jedes Lämpchen, jedes Geschenk hat seinen Platz
   in Metern. Beim Malen wird alles mit derselben Kamera wie die Häuser
   abgebildet und nach der Tiefe sortiert – so wandern Kugeln und
   Lichter beim Drehen richtig mit („Man soll sie in jedem Winkel
   aufstellen können"), und hinten liegende Äste verschwinden hinter
   dem dunklen Inneren des Baums. Licht: dieselbe Rechnung wie der Kern
   (ST.lichtFaktor) – jede Zweigfläche kennt ihre Richtung.

   Maße: Baum 12 m, unterste Äste auf 1,35 m (Platz für Zaun und
   Geschenke), Kronenradius unten 3 m, Herrnhuter Stern mit 1,2 m
   Durchmesser, Zaun aus Kanthölzern im Achteck (Radius 3,5 m, 1,05 m hoch).
   Frühling: Maibaum mit weiß-blauem Stamm, Kranz, Bändern, Zunftzeichen.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const KX = ST.KX, KY = ST.KY, KZ = ST.KZ, LICHT = ST.LICHT, AUGE = ST.ZUM_AUGE;
  const TAU = Math.PI * 2;

  /* =====================================================================
     HELFER (in dieser Datei, damit das Modell allein lauffähig ist)
     ===================================================================== */
  /* Blick: bildet Modellpunkte in der Figur ab (Ursprung = Fußpunkt der
     Figur, Pixel). gier = Drehung inkl. Kamera (F.gier). */
  function blick(gier, s) {
    const r = gier * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
    const lx = -LICHT[0] / LICHT[2], ly = -LICHT[1] / LICHT[2];
    return {
      c: c, sn: sn, s: s,
      p: function (x, y, z) { const a = x * c - y * sn, b = x * sn + y * c; return [(a - b) * KX * s, (a + b) * KY * s - z * KZ * s]; },
      tiefe: function (x, y, z) { return (x * c - y * sn + x * sn + y * c) * AUGE[0] + z * AUGE[2]; },
      waag: function (x, y) { return (x * c - y * sn + x * sn + y * c) * AUGE[0]; },
      n: function (x, y, z) { const l = Math.hypot(x, y, z) || 1; return [(x * c - y * sn) / l, (x * sn + y * c) / l, z / l]; },
      boden: function (x, y, z) { const a = x * c - y * sn + lx * z, b = x * sn + y * c + ly * z; return [(a - b) * KX * s, (a + b) * KY * s]; }
    };
  }
  /* Kern-Lücke: beim Figurenschatten (kern.js, figurSchatten) fehlt F.gier.
     Der Schatten wird im selben Sprite direkt nach dem Bild gemalt – also
     merken wir uns den Winkel aus dem Bilddurchgang. */
  function mitGier(malen) {
    let merk = 0;
    return function (g, s, F) {
      if (F.gier != null && isFinite(F.gier)) merk = F.gier; else F = Object.assign({}, F, { gier: merk });
      return malen(g, s, F);
    };
  }
  /* Viele tausend kleine Pfade (Nadeln, Triebe, Lämpchen) sind auf einer
     GPU-Leinwand sehr teuer (jeder Pfad ein eigener Zeichenaufruf). Darum
     malt die Figur in eine eigene CPU-Leinwand (willReadFrequently) und
     setzt das Ergebnis mit EINEM drawImage ins Sprite. Gemessen in der
     Prüfumgebung: 10 000 Verlaufspfade 3,3 s (GPU) gegen 0,06 s (CPU). */
  function aufCpu(g, links, oben, breite, hoehe, fn) {
    const x0 = Math.floor(links), y0 = Math.floor(oben), W = Math.max(1, Math.ceil(breite) + 2), H = Math.max(1, Math.ceil(hoehe) + 2);
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const cg = c.getContext("2d", { willReadFrequently: true });
    cg.translate(-x0, -y0);
    fn(cg);
    g.drawImage(c, x0, y0);
    c.width = c.height = 0;
  }
  /* Kern-Fläche „gebacken": den Werkstoff in eine CPU-Leinwand (willReadFrequently)
     in Flächenauflösung malen und als EIN Bild einsetzen. Tausende kleine
     Pfade auf der GPU-Leinwand des Sprites sind sonst sehr teuer. */
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
  function rgb(f, a) { return a == null ? "rgb(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + ")" : "rgba(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + "," + a + ")"; }
  function mul(f, k) { return [Math.min(255, f[0] * k[0]), Math.min(255, f[1] * k[1]), Math.min(255, f[2] * k[2])]; }
  function skal(f, k) { return [f[0] * k, f[1] * k, f[2] * k]; }
  function plus(f, d) { return [Math.min(255, f[0] + d[0]), Math.min(255, f[1] + d[1]), Math.min(255, f[2] + d[2])]; }
  function misch(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  function lichtK(n, Z, jahr) { return ST.lichtFaktor(n, Z, 0, jahr); }
  function phase(bau, a, b) { return Math.max(0, Math.min(1, (bau - a) / (b - a))); }
  /* Vieleck an den laufenden Pfad hängen, immer gleich herum (dann
     vereinigen sich überlappende Schattenstücke bei einem einzigen fill()) */
  function dazu(g, pts) {
    let fl = 0;
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; fl += a[0] * b[1] - b[0] * a[1]; }
    if (fl < 0) pts = pts.slice().reverse();
    g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    g.closePath();
  }
  function huelle(pts) {
    pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (pts.length < 3) return pts;
    const kr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], hi = [];
    for (const p of pts) { while (lo.length >= 2 && kr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (hi.length >= 2 && kr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
    hi.pop(); lo.pop();
    return lo.concat(hi);
  }
  /* Schatten eines Quaders (Ecken im Modell) als Hülle am Boden */
  function quaderSchatten(g, V, ecken) {
    dazu(g, huelle(ecken.map((q) => V.boden(q[0], q[1], q[2]))));
  }
  function vieleck(g, pts) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); }

  /* Fläche im Raum für Malarbeiten in Flächenmetern abbilden
     (o = Ecke, eu/ev = Einheitsrichtungen im Modell) */
  function affin(g, V, o, eu, ev) {
    const p0 = V.p(o[0], o[1], o[2]);
    const pu = V.p(o[0] + eu[0], o[1] + eu[1], o[2] + eu[2]);
    const pv = V.p(o[0] + ev[0], o[1] + ev[1], o[2] + ev[2]);
    g.transform(pu[0] - p0[0], pu[1] - p0[1], pv[0] - p0[0], pv[1] - p0[1], p0[0], p0[1]);
  }

  /* Holzmaserung in einer Kern-Fläche (Fasern entlang x) */
  function holz(g, w, h, farbe, F, saat) {
    const rng = ST.zufall(saat || 3);
    g.fillStyle = rgb(farbe); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
    if (F.px * h > 9) {
      const n = Math.max(2, Math.round(h * 90));
      g.lineWidth = Math.max(0.003, 0.8 / F.px);
      for (let i = 0; i < n; i++) {
        const y = h * (i + 0.5) / n + (rng() - 0.5) * h * 0.05;
        g.strokeStyle = rgb(skal(farbe, 0.72 + rng() * 0.12), 0.35 + rng() * 0.3);
        g.beginPath(); g.moveTo(0, y);
        for (let x = 0.3; x < w + 0.3; x += 0.3) g.lineTo(x, y + (rng() - 0.5) * h * 0.06);
        g.stroke();
      }
      if (F.px > 70) PI.rauschen(g, 0, 0, w, h, 0.5, 0.25, (saat | 0) % 97, 3);
    }
    /* Kanten: oben heller, unten dunkler */
    g.fillStyle = "rgba(255,240,210,0.16)"; g.fillRect(0, 0, w, Math.min(h * 0.18, 0.012));
    g.fillStyle = "rgba(20,10,5,0.25)"; g.fillRect(0, h - Math.min(h * 0.2, 0.014), w, Math.min(h * 0.2, 0.014));
  }

  /* Schräger Kasten aus Kern-Flächen: Mittellinie (x0,y0)→(x1,y1),
     Breite b quer, Höhe h ab z0. m = { links, rechts, anfang, ende, oben } */
  function kasten(M, x0, y0, x1, y1, z0, b, h, m, opt) {
    const L = Math.hypot(x1 - x0, y1 - y0); if (L < 1e-6) return;
    const dx = (x1 - x0) / L, dy = (y1 - y0) / L, lx = -dy, ly = dx, hb = b / 2, z1 = z0 + h;
    const f = (name, o, u, w, malen) => { if (malen == null) return; M.flaeche(Object.assign({ name: name, o: o, u: u, v: [0, 0, -1], w: w, h: h, malen: malen, ao: z0 <= 0.05 }, opt || {})); };
    f("links", [x0 + lx * hb, y0 + ly * hb, z1], [dx, dy, 0], L, m.links);
    f("rechts", [x1 - lx * hb, y1 - ly * hb, z1], [-dx, -dy, 0], L, m.rechts);
    f("ende", [x1 + lx * hb, y1 + ly * hb, z1], [-lx, -ly, 0], b, m.ende);
    f("anfang", [x0 - lx * hb, y0 - ly * hb, z1], [lx, ly, 0], b, m.anfang);
    if (m.oben != null) M.flaeche({ name: "oben", o: [x0 - lx * hb, y0 - ly * hb, z1], u: [dx, dy, 0], v: [lx, ly, 0], w: L, h: b, malen: m.oben });
  }

  /* Baugrube als Figur: Öffnung (Vieleck in Modellmetern auf z = 0),
     Tiefe, Füllung mit Beton bis zur Höhe „fuell" (≤ 0). Beschnitten auf
     die Öffnung – man sieht nur, was durch das Loch sichtbar ist. */
  function grubeMalen(g, V, F, loch, tiefe, fuell) {
    if (F.schatten) return;
    const Z = F.Z, jahr = F.jahr, s = V.s;
    const oben = loch.map((q) => V.p(q[0], q[1], 0));
    const boden = fuell != null && fuell > -tiefe ? fuell : -tiefe;
    const beton = fuell != null && fuell > -tiefe + 0.01;
    g.save();
    vieleck(g, oben); g.clip();
    /* Sohle bzw. Betonoberfläche */
    const kU = lichtK([0, 0, 1], Z, jahr);
    const sohle = loch.map((q) => V.p(q[0], q[1], boden));
    vieleck(g, sohle);
    g.fillStyle = rgb(mul(beton ? [168, 166, 158] : [92, 70, 52], skal(kU, beton ? 0.9 : 0.62))); g.fill();
    if (beton && boden > -0.3) {
      /* Bodenhülse: Stahlrohr ragt aus dem frischen Beton */
      const m = V.p(0, 0, boden), r = 0.24 * s;
      g.fillStyle = "#4a4d52"; g.beginPath(); g.ellipse(m[0], m[1], r, r * 0.5, 0, 0, TAU); g.fill();
      g.fillStyle = "#16171a"; g.beginPath(); g.ellipse(m[0], m[1], r * 0.78, r * 0.39, 0, 0, TAU); g.fill();
    }
    if (beton && s > 20) {
      /* frischer Beton: Abziehspuren */
      g.strokeStyle = "rgba(255,255,255,0.10)"; g.lineWidth = Math.max(0.6, s * 0.01);
      const a = V.p(loch[0][0], loch[0][1], boden), b = V.p(loch[2][0], loch[2][1], boden);
      for (let i = 1; i < 8; i++) { const k = i / 8; g.beginPath(); g.moveTo(a[0] + (b[0] - a[0]) * k - s * 0.6, a[1] + (b[1] - a[1]) * k); g.lineTo(a[0] + (b[0] - a[0]) * k + s * 0.6, a[1] + (b[1] - a[1]) * k); g.stroke(); }
    }
    /* Wände: nur die, deren Innenseite zum Betrachter zeigt */
    let fl = 0; for (let i = 0; i < loch.length; i++) { const a = loch[i], b = loch[(i + 1) % loch.length]; fl += a[0] * b[1] - b[0] * a[1]; }
    const sg = fl > 0 ? 1 : -1;
    const rng = ST.zufall(7);
    for (let i = 0; i < loch.length; i++) {
      const a = loch[i], b = loch[(i + 1) % loch.length];
      const ex = b[0] - a[0], ey = b[1] - a[1], l = Math.hypot(ex, ey) || 1;
      const nx = -ey / l * sg, ny = ex / l * sg;          // Innennormale
      const nk = V.n(nx, ny, 0);
      if (nk[0] * AUGE[0] + nk[1] * AUGE[1] <= 0.001) continue;
      const k = lichtK(nk, Z, jahr);
      const q = [V.p(a[0], a[1], 0), V.p(b[0], b[1], 0), V.p(b[0], b[1], boden), V.p(a[0], a[1], boden)];
      vieleck(g, q);
      const gr = g.createLinearGradient(0, q[0][1], 0, q[3][1]);
      gr.addColorStop(0, rgb(mul([118, 90, 64], skal(k, 0.85))));
      gr.addColorStop(1, rgb(mul([70, 52, 38], skal(k, 0.55))));
      g.fillStyle = gr; g.fill();
      if (s > 18) {
        /* Erdschichten und Steinchen */
        g.save(); vieleck(g, q); g.clip();
        for (let j = 1; j < 5; j++) {
          const zz = boden * j / 5 * (0.9 + rng() * 0.2);
          const p1 = V.p(a[0], a[1], zz), p2 = V.p(b[0], b[1], zz);
          g.strokeStyle = "rgba(40,28,18,0.35)"; g.lineWidth = Math.max(0.6, s * 0.012);
          g.beginPath(); g.moveTo(p1[0], p1[1]); g.lineTo((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2 + (rng() - 0.5) * s * 0.05); g.lineTo(p2[0], p2[1]); g.stroke();
        }
        g.fillStyle = "rgba(170,160,140,0.7)";
        for (let j = 0; j < l * 8; j++) {
          const u = rng(), zz = boden * rng();
          const p = V.p(a[0] + ex * u, a[1] + ey * u, zz);
          g.beginPath(); g.arc(p[0], p[1], Math.max(0.5, s * 0.02 * (0.5 + rng())), 0, TAU); g.fill();
        }
        g.restore();
      }
      if (beton && boden > -tiefe) {
        /* Beton an der Wand: glatte, graue Fläche unter der Oberfläche verschwindet */
      }
    }
    g.restore();
    /* Aushubrand: zertretene Erde um das Loch */
    g.save();
    g.strokeStyle = jahr === "winter" ? "rgba(96,80,64,0.55)" : "rgba(90,68,46,0.6)";
    g.lineWidth = Math.max(1, s * 0.12); g.lineJoin = "round";
    vieleck(g, oben); g.stroke();
    g.restore();
  }

  /* =====================================================================
     DIE TANNE — Daten (je Saat einmal gerechnet)
     ===================================================================== */
  /* Krone: kr = { zU (unterster Quirl), H (Spitze), R (Radius unten) } */
  function kronenRadius(kr, z) {
    if (z < kr.zU - 0.25 || z > kr.H) return 0;
    const k = Math.max(0, Math.min(1.03, (kr.H - z) / (kr.H - kr.zU)));
    return kr.R * Math.pow(k, 0.93) * (1 + 0.035 * Math.sin(z * 2.1));
  }
  function astNeu(D, rng, z, az, L, zwischen, kr) {
    /* Nordmanntanne: tiefes, leicht bläuliches Grün, junge Spitzen heller */
    const g0 = 58 + rng() * 18;
    D.aeste.push({
      id: D.aeste.length, z: z, az: az, ca: Math.cos(az), sa: Math.sin(az), L: L, W: L * (0.25 + rng() * 0.07),
      hang: 0.75 + rng() * 0.45 + (z < kr.zU + 2.5 ? 0.35 : 0), farbe: [26 + rng() * 10, g0, 38 + rng() * 12],
      schnee: rng(), zw: zwischen, rausch: rng() * 100
    });
  }
  function breite(t) { return t <= 0 || t >= 1 ? 0 : Math.pow(Math.sin(Math.PI * t), 0.55); }
  /* Punkt auf dem Zweigfächer: t = 0 (Stamm) … 1 (Spitze), l = −1 … +1 (quer) */
  function astP(A, t, l, offen) {
    const o = offen == null ? 1 : offen;
    const d = t * A.L * o, w = A.W * breite(t) * l * (0.55 + 0.45 * o);
    const hang = A.hang * (0.3 * t - 0.17 * t * t) * o + (1 - o) * t * 0.9;
    return [A.ca * d - A.sa * w, A.sa * d + A.ca * w, A.z - A.L * hang - Math.abs(w) * 0.3];
  }

  const BAEUME = new Map();
  function baumDaten(saat, kr, ohneSchmuck) {
    const key = (saat | 0) + "|" + kr.H + "|" + kr.R + "|" + (ohneSchmuck ? 1 : 0);
    if (BAEUME.has(key)) return BAEUME.get(key);
    const rng = ST.zufall((saat | 0) * 7919 + 101);
    const D = { kr: kr, aeste: [], kugeln: [], lampen: [], schleifen: [], geschenke: [] };
    let z = kr.zU, az = rng() * TAU;
    while (z < kr.H - 0.42) {
      const r = kronenRadius(kr, z);
      const n = Math.max(4, Math.min(8, Math.round(3.6 + r * 1.45)));
      az += 2.39996;
      for (let i = 0; i < n; i++) astNeu(D, rng, z + (rng() - 0.5) * 0.05, az + (i + (rng() - 0.5) * 0.5) / n * TAU, r * (0.86 + rng() * 0.2), false, kr);
      /* Zwischenäste füllen die Lücken zwischen den Quirlen */
      const zz = z + 0.19, rz = kronenRadius(kr, zz), nz = Math.max(3, Math.round(n * 0.65));
      for (let i = 0; i < nz; i++) astNeu(D, rng, zz, az + 0.55 + i / nz * TAU + (rng() - 0.5) * 0.6, rz * (0.6 + rng() * 0.25), true, kr);
      z += (kr.R < 1 ? 0.2 : 0.36) + rng() * (kr.R < 1 ? 0.05 : 0.09);
    }
    /* Leittrieb: die letzten Zentimeter */
    for (let i = 0; i < 4; i++) astNeu(D, rng, kr.H - 0.4 + i * 0.07, rng() * TAU, 0.18 - i * 0.03, false, kr);
    if (ohneSchmuck) { BAEUME.set(key, D); return D; }
    const grosse = D.aeste.filter((a) => !a.zw && a.L > 0.5);
    const summeL = grosse.reduce((s, a) => s + a.L, 0);
    const astZiehen = () => { let x = rng() * summeL; for (const a of grosse) { x -= a.L; if (x <= 0) return a; } return grosse[grosse.length - 1]; };
    /* Kugeln: rot und gold, glänzend und matt, an den Zweigenden */
    const ROT = [168, 18, 30], GOLD = [206, 160, 62], TIEFROT = [120, 12, 24], HELLGOLD = [226, 196, 120];
    for (let i = 0; i < 210; i++) {
      const A = astZiehen(), t = 0.7 + rng() * 0.24, l = (rng() - 0.5) * 0.9, haeng = 0.1 + rng() * 0.05;
      const p = astP(A, t, l); p[2] -= haeng;
      const w = rng();
      D.kugeln.push({ p: p, t: t, l: l, haeng: haeng, r: 0.085 + rng() * 0.055, farbe: w < 0.42 ? ROT : w < 0.78 ? GOLD : w < 0.9 ? TIEFROT : HELLGOLD, matt: rng() < 0.3, a: A, zufall: rng() });
    }
    /* Schleifen aus rotem Samt */
    for (let i = 0; i < 20; i++) {
      const A = astZiehen(), p = astP(A, 0.9, 0); p[2] += 0.02;
      D.schleifen.push({ p: p, t: 0.9, l: 0, haeng: -0.02, gr: 0.2 + rng() * 0.06, a: A, dreh: rng() });
    }
    /* Lichter: an den Zweigen befestigt (die Kette läuft von Zweig zu Zweig),
       außen dicht, dazu Streulichter tiefer im Baum */
    for (const A of D.aeste) {
      if (A.zw || A.L < 0.3) continue;
      const n = Math.round(A.L * 1.15 + rng() * 1.3);
      for (let i = 0; i < n; i++) {
        const t = 0.6 + rng() * 0.36, l = (rng() - 0.5) * 1.3, p = astP(A, t, l); p[2] -= 0.02;
        D.lampen.push({ p: p, a: A, t: t, l: l, haeng: 0.02, hell: 0.75 + rng() * 0.25, ph: rng() * TAU, w: 0.7 + rng() * 2.2 });
      }
      if (rng() < 0.3) { const t = 0.3 + rng() * 0.25, p = astP(A, t, 0); p[2] -= 0.08; D.lampen.push({ p: p, a: A, t: t, l: 0, haeng: 0.08, hell: 0.5 + rng() * 0.4, ph: rng() * TAU, w: 1, tief: true }); }
    }
    /* Geschenke unter dem Baum (Deko-Pakete, wetterfest) */
    const PAPIER = [[172, 22, 34], [28, 84, 52], [206, 166, 72], [238, 234, 224], [32, 58, 122], [120, 16, 36], [214, 206, 188]];
    const BAND = [[222, 186, 92], [196, 24, 36], [246, 244, 236], [30, 92, 56]];
    const platz = [];
    for (let v = 0; v < 90 && D.geschenke.length < 13; v++) {
      const a = rng() * TAU, r = 1.9 + rng() * 1.15, b = 0.38 + rng() * 0.42, t = 0.32 + rng() * 0.4, h = 0.22 + rng() * 0.38;
      const x = r * Math.cos(a), y = r * Math.sin(a), rr = Math.hypot(b, t) / 2;
      if (platz.some((q) => Math.hypot(q[0] - x, q[1] - y) < q[2] + rr + 0.04)) continue;
      platz.push([x, y, rr]);
      const pap = PAPIER[(rng() * PAPIER.length) | 0];
      let band = BAND[(rng() * BAND.length) | 0];
      if (Math.abs(band[0] - pap[0]) + Math.abs(band[1] - pap[1]) < 90) band = BAND[(BAND.indexOf(band) + 1) % BAND.length];
      D.geschenke.push({ x: x, y: y, z: 0.02, b: b, t: t, h: h, rot: rng() * TAU, papier: pap, band: band, muster: (rng() * 3) | 0 });
      /* manchmal ein kleines Paket obendrauf */
      if (rng() < 0.3) D.geschenke.push({ x: x + (rng() - 0.5) * 0.1, y: y + (rng() - 0.5) * 0.1, z: 0.02 + h, b: b * 0.55, t: t * 0.6, h: h * 0.6, rot: rng() * TAU, papier: PAPIER[(rng() * PAPIER.length) | 0], band: BAND[(rng() * BAND.length) | 0], muster: (rng() * 3) | 0 });
    }
    BAEUME.set(key, D);
    return D;
  }

  /* =====================================================================
     DIE TANNE — Malen
     ===================================================================== */
  /* Ein Stück Zweigfächer (t0…t1). So ist ein Tannenzweig gebaut:
     ein Hauptast, links und rechts Seitentriebe, die schräg nach vorn
     zeigen, auf jedem Trieb zwei Reihen Nadeln. Gemalt wird in Schichten:
     dunkle Unterschicht (Schatten im Zweig), Triebe in der Astfarbe, obenauf
     eine hellere Lichtkante; in der Nähe einzelne Nadeln. Schnee liegt als
     einzelne Polster auf den Trieben – nie als flache weiße Fläche. */
  function astStueck(g, V, A, t0, t1, st, offen) {
    const s = V.s;
    const lange = A.L * offen;
    const n = Math.max(2, Math.min(14, Math.round((t1 - t0) * lange * s / 6)));
    const P = (t, l) => { const q = astP(A, t, l, offen); return V.p(q[0], q[1], q[2]); };
    const fA = st.farbe(A, t0), fB = st.farbe(A, t1), fm = misch(fA, fB, 0.55);
    /* 1. Unterschicht: Umriss, dunkel (Selbstschatten im Zweig) */
    const rand = s >= 16 ? 0.7 : 0.92;
    const pts = [];
    for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; pts.push(P(t, -(rand + 0.25 * ST.rausch(t * 9 + A.rausch, 1.5, 5)))); }
    for (let i = n; i >= 0; i--) { const t = t0 + (t1 - t0) * i / n; pts.push(P(t, rand + 0.25 * ST.rausch(t * 9 + A.rausch, 4.5, 5))); }
    const pA = P(t0, 0), pB = P(t1, 0);
    vieleck(g, pts);
    if (Math.hypot(pB[0] - pA[0], pB[1] - pA[1]) > 1.5) {
      const gr = g.createLinearGradient(pA[0], pA[1], pB[0], pB[1]);
      gr.addColorStop(0, rgb(skal(fA, s >= 16 ? 0.62 : 0.9))); gr.addColorStop(1, rgb(skal(fB, s >= 16 ? 0.62 : 0.9)));
      g.fillStyle = gr;
    } else g.fillStyle = rgb(skal(fm, s >= 16 ? 0.62 : 0.9));
    g.fill();
    /* 2. Seitentriebe */
    if (s >= 16) {
      const dt = Math.max(0.035, 0.085 / Math.max(0.2, lange));
      const rr = ST.zufall(A.id * 97 + ((t0 * 50) | 0));
      const triebe = [];
      for (let t = Math.max(0.1, t0 + dt * 0.3); t < t1; t += dt) {
        for (let side = -1; side <= 1; side += 2) {
          const lang = 0.12 + 0.06 * rr();
          const tb = Math.min(1, t + lang * (1 - t * 0.4));
          const l = side * (0.95 + 0.25 * rr()) * (t > 0.9 ? 0.6 : 1);
          triebe.push([P(t, 0), P((t + tb) / 2, l * 0.55), P(tb, l), rr()]);
        }
      }
      /* Spitze des Hauptasts */
      if (t1 >= 1) triebe.push([P(0.9, 0), P(0.96, 0), P(1.02, 0), 0.5]);
      const breiteT = Math.max(0.9, 0.06 * s);
      g.lineCap = "round"; g.lineJoin = "round";
      for (let gruppe = 0; gruppe < 2; gruppe++) {
        g.beginPath();
        for (const tr of triebe) { if ((tr[3] < 0.5) !== (gruppe === 0)) continue; g.moveTo(tr[0][0], tr[0][1]); g.quadraticCurveTo(tr[1][0], tr[1][1], tr[2][0], tr[2][1]); }
        g.strokeStyle = rgb(skal(fm, gruppe ? 1.0 : 0.86)); g.lineWidth = breiteT; g.stroke();
      }
      /* Lichtkante: Oberseite der Triebe fängt das Himmelslicht */
      g.beginPath();
      for (const tr of triebe) { g.moveTo(tr[0][0], tr[0][1] - breiteT * 0.2); g.quadraticCurveTo(tr[1][0], tr[1][1] - breiteT * 0.2, tr[2][0], tr[2][1] - breiteT * 0.2); }
      g.strokeStyle = rgb(plus(skal(fm, 1.18), [10, 14, 8])); g.lineWidth = breiteT * 0.38; g.stroke();
      /* Hauptast sichtbar, wo der Zweig dünn ist */
      if (s >= 30) {
        g.beginPath(); g.moveTo(pA[0], pA[1]); const pm = P((t0 + t1) / 2, 0); g.quadraticCurveTo(pm[0], pm[1], pB[0], pB[1]);
        g.strokeStyle = rgb(misch(skal(fm, 0.8), [70, 52, 36], 0.35)); g.lineWidth = Math.max(0.6, 0.02 * s); g.stroke();
      }
      /* 3. Nadeln: zwei Reihen je Trieb, schräg nach vorn */
      if (s >= 52) {
        g.beginPath();
        const nl = 0.028 * s;
        for (const tr of triebe) {
          const [a, m, b] = tr;
          for (let k = 1; k <= 6; k++) {
            const u = k / 7, iu = 1 - u;
            const x = iu * iu * a[0] + 2 * iu * u * m[0] + u * u * b[0], y = iu * iu * a[1] + 2 * iu * u * m[1] + u * u * b[1];
            let dx = 2 * iu * (m[0] - a[0]) + 2 * u * (b[0] - m[0]), dy = 2 * iu * (m[1] - a[1]) + 2 * u * (b[1] - m[1]);
            const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
            g.moveTo(x, y); g.lineTo(x + (dx * 0.5 - dy) * nl, y + (dy * 0.5 + dx) * nl);
            g.moveTo(x, y); g.lineTo(x + (dx * 0.5 + dy) * nl, y + (dy * 0.5 - dx) * nl);
          }
        }
        g.strokeStyle = rgb(skal(fm, 1.08), 0.9); g.lineWidth = Math.max(0.5, 0.009 * s); g.stroke();
      }
    }
    /* 4. Schnee liegt AUF den Trieben: er folgt ihrer Form (Striche entlang
       der Zweige), unten bläulicher Schatten, oben Licht – keine Wattebäusche */
    if (st.schnee && A.schnee > 0.25 && t1 > 0.25) {
      const menge = (A.schnee - 0.25) / 0.75;
      const rr = ST.zufall(A.id * 53 + ((t0 * 70) | 0) + 1);
      const wB = Math.max(1, (0.035 + 0.035 * menge) * s);
      const schnur = [];
      /* Grat entlang des Hauptasts */
      const ta = Math.max(t0, 0.3), tb = Math.min(t1, 0.93);
      if (tb > ta + 0.03) {
        const k = Math.max(2, Math.round((tb - ta) * lange * s / 5));
        let lauf = [];
        for (let i = 0; i <= k; i++) {
          const t = ta + (tb - ta) * i / k;
          if (ST.rausch(t * 14 + A.rausch, 3, 7) < 0.3 - menge * 0.25) { if (lauf.length > 1) schnur.push([lauf, 1.25]); lauf = []; continue; }
          const q = astP(A, t, 0.08 * Math.sin(t * 20 + A.rausch), offen); q[2] += 0.035;
          lauf.push(V.p(q[0], q[1], q[2]));
        }
        if (lauf.length > 1) schnur.push([lauf, 1.25]);
      }
      /* auf einzelnen Seitentrieben */
      if (s >= 16) {
        const dt = Math.max(0.035, 0.085 / Math.max(0.2, lange));
        for (let t = Math.max(0.3, t0 + dt * 0.3); t < Math.min(t1, 0.95); t += dt) {
          for (let side = -1; side <= 1; side += 2) {
            if (rr() > 0.16 + 0.46 * menge) continue;
            const bis = 0.3 + 0.45 * rr();
            const lauf = [];
            for (let k = 0; k <= 3; k++) {
              const u = 0.08 + (bis - 0.08) * k / 3;
              const q = astP(A, t + u * 0.13, side * 0.95 * u, offen); q[2] += 0.03;
              lauf.push(V.p(q[0], q[1], q[2]));
            }
            schnur.push([lauf, 0.75 + 0.35 * rr()]);
          }
        }
      }
      if (schnur.length) {
        g.lineCap = "round"; g.lineJoin = "round";
        const zug = (dy, k) => { g.beginPath(); for (const [l, b] of schnur) { if (Math.abs(b - k) > 0.26) continue; g.moveTo(l[0][0], l[0][1] + dy); for (let i = 1; i < l.length; i++) g.lineTo(l[i][0], l[i][1] + dy); } };
        for (const k of [0.8, 1.05, 1.25]) {
          /* weicher Rand: breiter, halbdurchsichtiger Strich zuerst (Pulverschnee franst aus) */
          if (s >= 30) { zug(wB * 0.1 * k, k); g.strokeStyle = rgb(st.schneeFarbe, 0.3); g.lineWidth = wB * k * 1.4; g.stroke(); }
          zug(wB * 0.28 * k, k); g.strokeStyle = rgb(st.schneeSchatten); g.lineWidth = wB * k; g.stroke();
          zug(-wB * 0.12 * k, k); g.strokeStyle = rgb(st.schneeFarbe); g.lineWidth = wB * k * 0.78; g.stroke();
        }
        if (s >= 60) {
          g.fillStyle = "rgba(255,255,255,0.95)";
          for (const [l] of schnur) if (rr() < 0.6) { const q = l[(rr() * l.length) | 0]; g.fillRect(q[0] - 0.6, q[1] - wB * 0.3, 1.2, 1.2); }
        }
      }
    }
  }

  /* Christbaumkugel (Glas, glänzend oder matt) */
  function kugelMalen(g, X, Y, r, f, k, nacht, matt, zuf) {
    const c = mul(f, k);
    const gr = g.createRadialGradient(X - r * 0.42, Y - r * 0.3, r * 0.05, X - r * 0.1, Y, r * 1.05);
    gr.addColorStop(0, rgb(plus(c, [70, 60, 50])));
    gr.addColorStop(0.3, rgb(c));
    gr.addColorStop(0.8, rgb(skal(c, 0.45)));
    gr.addColorStop(1, rgb(skal(c, 0.62)));
    g.fillStyle = gr; g.beginPath(); g.arc(X, Y, r, 0, TAU); g.fill();
    if (r > 1.6) {
      if (!matt) {
        g.fillStyle = "rgba(255,255,255," + (0.85 - nacht * 0.35) + ")";
        g.beginPath(); g.ellipse(X - r * 0.44, Y - r * 0.28, r * 0.2, r * 0.13, -0.6, 0, TAU); g.fill();
        /* Spiegelung des dunklen Baums unten */
        g.fillStyle = "rgba(10,30,18,0.25)"; g.beginPath(); g.ellipse(X + r * 0.1, Y + r * 0.45, r * 0.7, r * 0.3, 0, 0, TAU); g.fill();
      } else {
        g.fillStyle = "rgba(255,250,235,0.18)"; g.beginPath(); g.arc(X - r * 0.35, Y - r * 0.25, r * 0.45, 0, TAU); g.fill();
      }
      if (nacht > 0.1) {
        /* warme Lichtpunkte der Lämpchen im Glas */
        g.fillStyle = "rgba(255,226,160," + (0.9 * nacht) + ")";
        for (let i = 0; i < 3; i++) { const a = zuf * 9 + i * 2.1; g.beginPath(); g.arc(X + Math.cos(a) * r * 0.62, Y + Math.sin(a) * r * 0.55, Math.max(0.5, r * 0.09), 0, TAU); g.fill(); }
      }
      /* Aufhänger */
      g.fillStyle = rgb(mul([200, 170, 90], k));
      g.fillRect(X - r * 0.22, Y - r * 1.12, r * 0.44, r * 0.22);
    }
  }

  /* Samtschleife */
  function schleifeMalen(g, X, Y, gr, s, f) {
    const w = gr * s;
    if (w < 2) { g.fillStyle = rgb(f); g.fillRect(X - 1, Y - 1, 2, 2); return; }
    g.fillStyle = rgb(f);
    g.beginPath(); g.moveTo(X, Y); g.bezierCurveTo(X - w * 0.9, Y - w * 0.7, X - w * 1.05, Y + w * 0.25, X, Y); g.fill();
    g.beginPath(); g.moveTo(X, Y); g.bezierCurveTo(X + w * 0.9, Y - w * 0.7, X + w * 1.05, Y + w * 0.25, X, Y); g.fill();
    g.beginPath(); g.moveTo(X - w * 0.08, Y); g.lineTo(X - w * 0.45, Y + w * 0.95); g.lineTo(X - w * 0.25, Y + w * 0.9); g.lineTo(X, Y + w * 0.1); g.fill();
    g.beginPath(); g.moveTo(X + w * 0.08, Y); g.lineTo(X + w * 0.4, Y + w * 1.0); g.lineTo(X + w * 0.2, Y + w * 0.92); g.lineTo(X, Y + w * 0.1); g.fill();
    g.fillStyle = rgb(skal(f, 0.65)); g.beginPath(); g.arc(X, Y, w * 0.14, 0, TAU); g.fill();
    if (w > 6) { g.fillStyle = "rgba(255,200,200,0.18)"; g.beginPath(); g.ellipse(X - w * 0.45, Y - w * 0.25, w * 0.22, w * 0.1, -0.5, 0, TAU); g.fill(); }
  }

  /* Geschenkpaket: Quader mit Papier, Band und Schleife */
  function paketMalen(g, V, P, Z, jahr, nacht) {
    const c = Math.cos(P.rot), sn = Math.sin(P.rot), hb = P.b / 2, ht = P.t / 2;
    const ecke = (u, v, w) => [P.x + u * c - v * sn, P.y + u * sn + v * c, P.z + w];
    const warm = [70 * nacht, 44 * nacht, 16 * nacht];
    const seiten = [
      { o: ecke(-hb, ht, P.h), eu: [c, sn, 0], ev: [0, 0, -1], w: P.b, h: P.h, n: [-sn, c, 0] },
      { o: ecke(hb, -ht, P.h), eu: [-c, -sn, 0], ev: [0, 0, -1], w: P.b, h: P.h, n: [sn, -c, 0] },
      { o: ecke(hb, ht, P.h), eu: [sn, -c, 0], ev: [0, 0, -1], w: P.t, h: P.h, n: [c, sn, 0] },
      { o: ecke(-hb, -ht, P.h), eu: [-sn, c, 0], ev: [0, 0, -1], w: P.t, h: P.h, n: [-c, -sn, 0] },
      { o: ecke(-hb, -ht, P.h), eu: [c, sn, 0], ev: [-sn, c, 0], w: P.b, h: P.t, n: [0, 0, 1], oben: true }
    ];
    for (const S of seiten) {
      const nk = V.n(S.n[0], S.n[1], S.n[2]);
      if (nk[0] * AUGE[0] + nk[1] * AUGE[1] + nk[2] * AUGE[2] <= 0.01) continue;
      const k = lichtK(nk, Z, jahr);
      g.save();
      affin(g, V, S.o, S.eu, S.ev);
      g.fillStyle = rgb(plus(mul(P.papier, k), warm)); g.fillRect(0, 0, S.w, S.h);
      if (V.s > 40 && P.muster === 1) { g.fillStyle = rgb(plus(mul(misch(P.papier, [255, 255, 255], 0.5), k), warm), 0.5); for (let x = 0.06; x < S.w; x += 0.12) for (let y = 0.06; y < S.h; y += 0.12) { g.beginPath(); g.arc(x + ((y * 8) % 2) * 0.06, y, 0.018, 0, TAU); g.fill(); } }
      if (V.s > 40 && P.muster === 2) { g.strokeStyle = rgb(plus(mul(misch(P.papier, [255, 240, 200], 0.4), k), warm), 0.45); g.lineWidth = 0.02; for (let x = -S.h; x < S.w; x += 0.1) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + S.h, S.h); g.stroke(); } }
      const bk = plus(mul(P.band, k), warm), bb = Math.min(S.w, S.h) * 0.14 + 0.02;
      g.fillStyle = rgb(bk);
      g.fillRect(S.w / 2 - bb / 2, 0, bb, S.h);
      if (S.oben) g.fillRect(0, S.h / 2 - bb / 2, S.w, bb);
      /* Kante leicht dunkler: Papier liegt nicht ganz glatt */
      g.strokeStyle = "rgba(0,0,0,0.18)"; g.lineWidth = 0.012; g.strokeRect(0, 0, S.w, S.h);
      if (S.oben && jahr === "winter") {
        /* Schneehäubchen */
        g.fillStyle = rgb(mul([246, 249, 255], k), 0.92);
        g.beginPath(); g.ellipse(S.w * 0.5, S.h * 0.5, S.w * 0.46, S.h * 0.44, 0, 0, TAU); g.fill();
      }
      g.restore();
    }
    /* Schleife obendrauf */
    const top = V.p(P.x, P.y, P.z + P.h + 0.02);
    const kb = lichtK(V.n(0, 0.3, 1), Z, jahr);
    schleifeMalen(g, top[0], top[1], Math.min(P.b, P.t) * 0.34, V.s, plus(mul(P.band, kb), warm));
  }

  /* ---------------- Herrnhuter Stern ----------------
     25 Zacken auf einem Rhombenkuboktaeder (18 vierseitige, 8 dreiseitige
     Zacken; der untere Zacken fehlt – dort sitzt die Halterung). */
  const STERN = (function () {
    const q = 1 + Math.SQRT2, V = [];
    for (const pm of [[0, 1, 2], [1, 2, 0], [2, 0, 1]]) for (const a of [-1, 1]) for (const b of [-1, 1]) for (const c of [-1, 1]) { const w = [a, b, c * q]; V.push([w[pm[0]], w[pm[1]], w[pm[2]]]); }
    const dirs = [];
    for (let i = 0; i < 3; i++) for (const sg of [-1, 1]) { const d = [0, 0, 0]; d[i] = sg; dirs.push(d); }
    for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) for (const a of [-1, 1]) for (const b of [-1, 1]) { const d = [0, 0, 0]; d[i] = a; d[j] = b; dirs.push(d); }
    for (const a of [-1, 1]) for (const b of [-1, 1]) for (const c of [-1, 1]) dirs.push([a, b, c]);
    const zacken = [];
    const L = 7.2;
    for (const d0 of dirs) {
      const l = Math.hypot(d0[0], d0[1], d0[2]), d = [d0[0] / l, d0[1] / l, d0[2] / l];
      if (d[2] < -0.99) continue;
      let max = -1e9; for (const v of V) max = Math.max(max, v[0] * d[0] + v[1] * d[1] + v[2] * d[2]);
      const fl = V.filter((v) => v[0] * d[0] + v[1] * d[1] + v[2] * d[2] > max - 1e-6);
      /* um die Achse sortieren */
      const hx = Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
      const e1 = ST.norm(ST.kreuz(d, hx)), e2 = ST.kreuz(d, e1);
      fl.sort((a, b) => Math.atan2(ST.punkt(a, e2), ST.punkt(a, e1)) - Math.atan2(ST.punkt(b, e2), ST.punkt(b, e1)));
      const spitze = [d[0] * L, d[1] * L, d[2] * L];
      for (let i = 0; i < fl.length; i++) {
        const a = fl[i], b = fl[(i + 1) % fl.length];
        let n = ST.kreuz([a[0] - spitze[0], a[1] - spitze[1], a[2] - spitze[2]], [b[0] - spitze[0], b[1] - spitze[1], b[2] - spitze[2]]);
        n = ST.norm(n);
        const m = [(a[0] + b[0] + spitze[0]) / 3, (a[1] + b[1] + spitze[1]) / 3, (a[2] + b[2] + spitze[2]) / 3];
        if (ST.punkt(n, m) < 0) n = [-n[0], -n[1], -n[2]];
        zacken.push({ a: a, b: b, sp: spitze, n: n, m: m, basis: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2] });
      }
    }
    return { dreiecke: zacken, L: L };
  })();
  function sternMalen(g, V, zM, R, F, an) {
    const k = R / STERN.L, s = V.s, Z = F.Z, jahr = F.jahr;
    const nacht = F.nacht * an;
    const mitte = V.p(0, 0, zM);
    /* Halterung: Messingrohr in die Spitze */
    g.strokeStyle = rgb(mul([150, 120, 60], lichtK(V.n(-1, 1, 0), Z, jahr))); g.lineWidth = Math.max(1, s * 0.035);
    const u = V.p(0, 0, zM - R * 0.9); g.beginPath(); g.moveTo(u[0], u[1]); g.lineTo(mitte[0], mitte[1]); g.stroke();
    if (R * s < 7) {
      /* sehr klein: nur ein leuchtender Punkt mit Strahlen */
      g.fillStyle = nacht > 0.1 ? "rgb(255,236,170)" : rgb(mul([236, 200, 90], lichtK(V.n(0, 1, 1), Z, jahr)));
      g.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, rr = i % 2 ? R * s * 0.45 : R * s; g.lineTo(mitte[0] + Math.cos(a) * rr, mitte[1] + Math.sin(a) * rr); } g.closePath(); g.fill();
    } else {
      const liste = STERN.dreiecke.map((d) => {
        const nk = V.n(d.n[0], d.n[1], d.n[2]);
        return { d: d, nk: nk, sicht: nk[0] * AUGE[0] + nk[1] * AUGE[1] + nk[2] * AUGE[2], t: V.tiefe(d.m[0] * k, d.m[1] * k, d.m[2] * k) };
      }).filter((x) => x.sicht > 0).sort((a, b) => a.t - b.t);
      const PAPIER = [242, 204, 92];
      for (const x of liste) {
        const d = x.d;
        const A = V.p(d.a[0] * k, d.a[1] * k, zM + d.a[2] * k), B = V.p(d.b[0] * k, d.b[1] * k, zM + d.b[2] * k), S = V.p(d.sp[0] * k, d.sp[1] * k, zM + d.sp[2] * k);
        const Bm = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
        const kl = lichtK(x.nk, Z, jahr);
        let fBasis = mul(PAPIER, kl), fSpitze = mul(skal(PAPIER, 0.86), kl);
        if (nacht > 0) {
          /* von innen durchleuchtet: an der Wurzel fast weiß, zur Spitze goldener */
          const glut = 0.55 + 0.45 * x.sicht;
          fBasis = misch(fBasis, [255, 246, 208], nacht * glut);
          fSpitze = misch(fSpitze, [255, 196, 90], nacht * glut * 0.9);
        }
        const gr = g.createLinearGradient(Bm[0], Bm[1], S[0], S[1]);
        gr.addColorStop(0, rgb(fBasis)); gr.addColorStop(1, rgb(fSpitze));
        g.fillStyle = gr;
        g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); g.lineTo(S[0], S[1]); g.closePath(); g.fill();
        if (s > 26) { g.strokeStyle = rgb(skal(fSpitze, 0.72), 0.7); g.lineWidth = Math.max(0.5, s * 0.004); g.stroke(); }
      }
    }
    if (nacht > 0 && F.leuchtPunkt) {
      F.leuchtPunkt(mitte[0], mitte[1], R * s * 2.6, "255,214,130", 0.95 * an, false);
      F.leuchtPunkt(mitte[0], mitte[1], R * s * 6, "255,200,120", 0.35 * an, true);
    }
  }

  /* Leuchtschein eines Lämpchens als kleines Bild (je Größe einmal) */
  const HOEFE = new Map();
  function hof(r) {
    const k = Math.max(2, Math.round(r));
    if (HOEFE.has(k)) return HOEFE.get(k);
    const c = document.createElement("canvas"); c.width = c.height = k * 2 + 2;
    const g = c.getContext("2d", { willReadFrequently: true });
    const gr = g.createRadialGradient(k + 1, k + 1, 0, k + 1, k + 1, k);
    gr.addColorStop(0, "rgba(255,240,206,0.95)"); gr.addColorStop(0.1, "rgba(255,216,150,0.5)"); gr.addColorStop(0.3, "rgba(255,186,100,0.12)"); gr.addColorStop(0.65, "rgba(255,160,70,0.03)"); gr.addColorStop(1, "rgba(255,150,60,0)");
    g.fillStyle = gr; g.fillRect(0, 0, c.width, c.height);
    HOEFE.set(k, c);
    return c;
  }

  /* Der ganze Baum als Figur. D = Baumdaten, opt = { bau-Anteile } */
  function tanneMalen(g, s, F, D, A) {
    const V = blick(F.gier, s), Z = F.Z, jahr = F.jahr, kr = D.kr;
    const nacht = F.nacht;
    const offen = A.offen;
    if (F.schatten) {
      /* Schatten: Scheibe je Höhe, entlang des Lichts auf den Boden gelegt –
         alles in EINEM Pfad, damit der Kern nur einmal weichzeichnet */
      if (!A.nurPfad) { const T = g.getTransform(); g.setTransform(1, 0, 0, 1, T.e, T.f); g.fillStyle = "#000"; g.beginPath(); }
      if (!A.ohneStamm) quaderSchatten(g, V, [[-0.2, -0.2, 0], [0.2, -0.2, 0], [0.2, 0.2, 0], [-0.2, 0.2, 0], [-0.15, -0.15, kr.zU + 0.3], [0.15, -0.15, kr.zU + 0.3], [0.15, 0.15, kr.zU + 0.3], [-0.15, 0.15, kr.zU + 0.3]]);
      for (let z = kr.zU; z < kr.H; z += 0.32) {
        const r = kronenRadius(kr, z) * (0.35 + 0.65 * offen) * 0.92;
        if (r < 0.05) continue;
        const pts = [];
        for (let i = 0; i < 18; i++) {
          const a = i / 18 * TAU, rr = r * (0.82 + 0.3 * ST.hash2(i, (z * 10) | 0, 3));
          pts.push(V.boden(Math.cos(a) * rr, Math.sin(a) * rr, z - 0.15));
        }
        dazu(g, pts);
      }
      if (A.stern || !A.ohneStamm) quaderSchatten(g, V, [[-0.04, -0.04, kr.H - 1.5], [0.04, 0.04, kr.H - 1.5], [-0.04, 0.04, kr.H + (A.stern ? 0.6 : 0)], [0.04, -0.04, kr.H + (A.stern ? 0.6 : 0)]]);
      if (A.stern) { const q = V.boden(0, 0, kr.H + 0.55); const pts = []; for (let i = 0; i < 12; i++) pts.push([q[0] + Math.cos(i / 12 * TAU) * 0.45 * s, q[1] + Math.sin(i / 12 * TAU) * 0.45 * s]); dazu(g, pts); }
      if (A.zaun) zaunSchatten(g, V, A.zaun);
      if (!A.nurPfad) g.fill();
      return;
    }
    /* ---- Farben dieses Bilds (Licht hängt vom Drehwinkel ab) ---- */
    const kUp = lichtK([0, 0, 1], Z, jahr);
    const astK = D.aeste.map((a) => {
      const k = lichtK(V.n(a.ca * 0.62, a.sa * 0.62, 0.78), Z, jahr);
      /* unten und innen beschattet die Krone sich selbst */
      const h = Math.min(1, Math.max(0, (a.z - kr.zU) / (kr.H - kr.zU)));
      const ao = 0.78 + 0.22 * h - (a.zw ? 0.12 : 0);
      return [k[0] * ao, k[1] * ao, k[2] * ao];
    });
    const lampenAn = A.lichter > 0 && A.leuchten;
    const warmN = lampenAn ? nacht : 0;
    const st = {
      schnee: jahr === "winter",
      schneeFarbe: plus(mul([244, 247, 253], kUp), [16 * warmN, 10 * warmN, 2 * warmN]),
      schneeSchatten: mul([176, 190, 218], kUp),
      farbe: function (a, t) {
        const k = astK[a.id], ao = 0.36 + 0.64 * Math.pow(Math.max(0, t), 0.8);
        let f = mul(a.farbe, [k[0] * ao, k[1] * ao, k[2] * ao]);
        if (t > 0.85) f = misch(f, mul([70, 108, 62], k), (t - 0.85) * 2.2);   // junge, hellere Triebe
        if (warmN > 0) f = plus(f, [9 * warmN * t, 6 * warmN * t, 1 * warmN * t]);
        return f;
      }
    };
    /* ---- Dinge sammeln ---- */
    const vorn = [], hinten = [];
    const rein = (d, x, y, z) => { (V.waag(x, y) >= 0 ? vorn : hinten).push(d); d.t = V.tiefe(x, y, z); };
    const stuecke = s < 14 ? [[0.12, 1]] : s < 30 ? [[0.12, 0.6], [0.55, 1]] : [[0.12, 0.45], [0.4, 0.75], [0.7, 1]];
    for (const a of D.aeste) {
      if (a.z > kr.zU + (kr.H - kr.zU) * A.hoehe + 0.2) continue;
      if (a.zw && s < 12) continue;
      for (const [t0, t1] of stuecke) {
        const m = astP(a, (t0 + t1) / 2, 0, offen);
        rein({ art: 0, a: a, t0: t0, t1: t1 }, m[0], m[1], m[2]);
      }
    }
    const lage = (k) => { const q = astP(k.a, k.t, k.l, offen); q[2] -= k.haeng; return q; };
    const zeigBis = (anteil, z) => z >= kr.H - (kr.H - kr.zU + 0.5) * anteil;   // von oben nach unten angebracht
    if (A.kugeln > 0) for (const k of D.kugeln) if (zeigBis(A.kugeln, k.p[2])) { const q = lage(k); rein({ art: 1, k: k, q: q }, q[0], q[1], q[2]); }
    if (A.kugeln > 0) for (const k of D.schleifen) if (zeigBis(A.kugeln, k.p[2])) { const q = lage(k); rein({ art: 3, k: k, q: q }, q[0], q[1], q[2]); }
    if (A.lichter > 0) for (const l of D.lampen) if (zeigBis(A.lichter, l.p[2])) { const q = lage(l); rein({ art: 2, l: l, q: q }, q[0], q[1], q[2]); }
    if (A.geschenke > 0) { const n = Math.round(D.geschenke.length * A.geschenke); for (let i = 0; i < n; i++) { const p = D.geschenke[i]; rein({ art: 4, p: p }, p.x, p.y, p.z + p.h / 2); } }
    hinten.sort((a, b) => a.t - b.t); vorn.sort((a, b) => a.t - b.t);

    const kugelR = (r) => Math.max(0.8, r * s);
    const lr = Math.max(0.6, 0.03 * s), hr = Math.max(2.4, 0.2 * s), H = hof(hr);
    const glut = new Map();
    const malDing = (d) => {
      if (d.art === 0) astStueck(g, V, d.a, d.t0, d.t1, st, offen);
      else if (d.art === 1) {
        const k = d.k, p = V.p(d.q[0], d.q[1], d.q[2]);
        kugelMalen(g, p[0], p[1], kugelR(k.r), k.farbe, lichtK(V.n(k.p[0], k.p[1], 0.3), Z, jahr), warmN, k.matt, k.zufall);
      } else if (d.art === 2) {
        const l = d.l, p = V.p(d.q[0], d.q[1], d.q[2]);
        if (lampenAn && nacht > 0) {
          g.globalCompositeOperation = "lighter";
          g.globalAlpha = Math.min(1, nacht * l.hell * (l.tief ? 0.6 : 1));
          g.drawImage(H, p[0] - H.width / 2, p[1] - H.height / 2);
          g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
          g.fillStyle = "rgb(255,248,226)"; g.beginPath(); g.arc(p[0], p[1], lr, 0, TAU); g.fill();
          /* sichtbare Lämpchen für den Schein in der Szene sammeln */
          if (!l.tief && V.waag(l.p[0], l.p[1]) > -0.3) {
            const kx = Math.round(p[0] / (1.3 * s)), ky = Math.round(p[1] / (1.3 * s)), sk = kx + "," + ky;
            const e = glut.get(sk) || [0, 0, 0]; e[0] += p[0]; e[1] += p[1]; e[2]++; glut.set(sk, e);
          }
        } else {
          const k = lichtK(V.n(l.p[0], l.p[1], 0.4), Z, jahr);
          g.fillStyle = rgb(mul([236, 230, 212], k), 0.9); g.beginPath(); g.arc(p[0], p[1], lr * 0.85, 0, TAU); g.fill();
        }
      } else if (d.art === 3) {
        const k = d.k, p = V.p(d.q[0], d.q[1], d.q[2]);
        schleifeMalen(g, p[0], p[1], k.gr, s, mul([150, 14, 26], lichtK(V.n(k.a.ca, k.a.sa, 0.4), Z, jahr)));
      } else if (d.art === 4) paketMalen(g, V, d.p, Z, jahr, warmN);
    };
    for (const d of hinten) malDing(d);
    /* ---- Stamm ---- */
    if (!A.ohneStamm) {
      const zO = kr.zU + 0.6, rU = 0.2 * s, rO = 0.15 * s;
      const u = V.p(0, 0, 0), o = V.p(0, 0, zO);
      const kL = lichtK(V.n(-1, 1, 0), Z, jahr);
      const gr = g.createLinearGradient(-rU, 0, rU, 0);
      const rinde = [96, 74, 58];
      gr.addColorStop(0, rgb(mul(rinde, lichtK([-0.9, -0.1, 0], Z, jahr))));
      gr.addColorStop(0.3, rgb(mul(rinde, kL)));
      gr.addColorStop(1, rgb(mul(rinde, lichtK([0.2, 0.9, 0], Z, jahr))));
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(u[0] - rU, u[1]); g.lineTo(o[0] - rO, o[1]); g.lineTo(o[0] + rO, o[1]); g.lineTo(u[0] + rU, u[1]); g.ellipse(u[0], u[1], rU, rU * 0.5, 0, 0, Math.PI); g.fill();
      if (s > 30) {
        g.strokeStyle = "rgba(30,20,14,0.45)"; g.lineWidth = Math.max(0.6, s * 0.008);
        const rr = ST.zufall(5);
        for (let i = 0; i < 9; i++) { const x = (rr() - 0.5) * 1.6 * rU; g.beginPath(); g.moveTo(u[0] + x, u[1]); g.lineTo(o[0] + x * 0.8 + (rr() - 0.5) * 3, o[1]); g.stroke(); }
      }
    }
    /* ---- dunkles Inneres ---- */
    {
      const kI = lichtK(V.n(0.7, 0.7, 0.2), Z, jahr);
      const inner = mul([16, 36, 24], kI);
      const pts = [], links = [];
      const z0 = kr.zU + 0.05;
      for (let z = z0; z <= kr.H - 0.3; z += 0.14) {
        const r = kronenRadius(kr, z) * 0.6 * offen * s;
        pts.push([r * (0.82 + 0.3 * ST.rausch(z * 3.1, 1, 9)), -z * KZ * s]);
        links.push([-r * (0.82 + 0.3 * ST.rausch(z * 3.1, 7, 9)), -z * KZ * s]);
      }
      links.reverse();
      const r0 = kronenRadius(kr, z0) * 0.6 * offen;
      const bogen = [];
      for (let i = 0; i <= 12; i++) { const ph = (135 - i * 15) * Math.PI / 180, a = r0 * Math.cos(ph), b = r0 * Math.sin(ph); bogen.push([(a - b) * KX * s, (a + b) * KY * s - z0 * KZ * s]); }
      vieleck(g, pts.concat(links, bogen));
      const mz = -(kr.zU + (kr.H - kr.zU) * 0.35) * KZ * s;
      const gr = g.createRadialGradient(0, mz, 0, 0, mz, (kr.H - kr.zU) * 0.6 * s);
      gr.addColorStop(0, rgb(plus(inner, [34 * warmN, 20 * warmN, 6 * warmN])));
      gr.addColorStop(1, rgb(plus(skal(inner, 0.8), [10 * warmN, 6 * warmN, 1 * warmN])));
      g.fillStyle = gr; g.fill();
      /* Leittrieb */
      const a = V.p(0, 0, kr.H - 1.2), b = V.p(0, 0, kr.H + 0.05);
      g.strokeStyle = rgb(mul([52, 86, 50], kI)); g.lineWidth = Math.max(0.8, s * 0.05);
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    }
    /* Einschnürung beim Anliefern: Netz um den gebundenen Baum */
    for (const d of vorn) malDing(d);
    if (A.netz > 0) {
      g.strokeStyle = "rgba(220,220,210," + (0.6 * A.netz) + ")"; g.lineWidth = Math.max(0.5, s * 0.01);
      for (let z = kr.zU; z < kr.H; z += 0.35) {
        const r = kronenRadius(kr, z) * offen * 0.9 * s, y = -z * KZ * s;
        g.beginPath(); g.moveTo(-r, y); g.lineTo(r, y - 0.35 * KZ * s * 1.3); g.moveTo(r, y); g.lineTo(-r, y - 0.35 * KZ * s * 1.3); g.stroke();
      }
    }
    /* ---- Stern ---- */
    if (A.stern) sternMalen(g, V, kr.H + 0.55, 0.6, F, lampenAn ? 1 : 0.0001);
    /* ---- Lichtschein anmelden ---- */
    if (lampenAn && nacht > 0 && F.leuchtPunkt) {
      for (const e of glut.values()) F.leuchtPunkt(e[0] / e[2], e[1] / e[2], 1.0 * s, "255,196,120", Math.min(0.4, 0.035 * e[2]), e[2] % 3 === 0);
      F.leuchtPunkt(0, -(kr.zU + (kr.H - kr.zU) * 0.3) * KZ * s, 7 * s, "255,180,100", s < 24 ? 0.34 : 0.22, false);
    }
  }

  /* =====================================================================
     DER MAIBAUM (Frühling)
     ===================================================================== */
  const MB = { H: 12.4, rU: 0.17, rO: 0.1, kranzZ: 9.7, kranzR: 0.62 };
  const ZUNFT = ["Bäcker", "Brauer", "Zimmerer", "Schmied", "Metzger", "Feuerwehr", "Schreiner", "Landwirt", "Maurer", "Schneider"];
  function maibaumDaten(saat) {
    const rng = ST.zufall((saat | 0) * 131 + 7);
    const D = { schilder: [], baender: [], blumen: [] };
    const start = rng() * TAU;
    for (let i = 0; i < 5; i++) {
      const z = 3.4 + i * 1.28, az = start + i * Math.PI / 2 * 1.02;
      for (const seite of [0, 1]) D.schilder.push({ z: z, az: az + seite * Math.PI, zunft: ZUNFT[(i * 2 + seite + ((saat | 0) % 3)) % ZUNFT.length], i: i * 2 + seite });
    }
    const BF = [[246, 246, 246], [30, 86, 170], [246, 246, 246], [30, 86, 170], [200, 30, 40], [240, 200, 40], [40, 130, 60]];
    for (let i = 0; i < 16; i++) D.baender.push({ az: i / 16 * TAU + rng() * 0.2, laenge: 1.6 + rng() * 0.9, farbe: BF[i % BF.length], wehen: rng() * TAU });
    const BL = [[228, 40, 50], [248, 210, 40], [246, 246, 240], [236, 110, 150], [150, 70, 170], [250, 150, 40]];
    for (let i = 0; i < 70; i++) {
      const a = rng() * TAU, r = 0.7 + rng() * 2.4;
      D.blumen.push({ x: r * Math.cos(a), y: r * Math.sin(a), h: 0.22 + rng() * 0.2, farbe: BL[(rng() * BL.length) | 0], art: rng() < 0.55 ? 0 : 1, neig: (rng() - 0.5) * 0.3 });
    }
    return D;
  }
  /* Zunftzeichen: bemalte Tafel mit Handwerkssymbol */
  function zunftSymbol(g, w, h, zunft, px) {
    g.fillStyle = "#f4efe2"; g.fillRect(0, 0, w, h);
    g.strokeStyle = "#2a5ea8"; g.lineWidth = 0.05; g.strokeRect(0.025, 0.025, w - 0.05, h - 0.05);
    g.fillStyle = "#c9a13b"; for (const [x, y] of [[0.06, 0.06], [w - 0.06, 0.06], [0.06, h - 0.06], [w - 0.06, h - 0.06]]) { g.beginPath(); g.arc(x, y, 0.025, 0, TAU); g.fill(); }
    if (px < 10) { g.fillStyle = "#8a5a30"; g.fillRect(w * 0.3, h * 0.3, w * 0.4, h * 0.4); return; }
    const cx = w / 2, cy = h / 2;
    g.save(); g.translate(cx, cy); g.lineCap = "round"; g.lineJoin = "round";
    const braun = "#7a4a22", dunkel = "#2b2b2b", rot = "#b3202a";
    switch (zunft) {
      case "Bäcker": g.strokeStyle = "#a8662a"; g.lineWidth = 0.055; g.beginPath(); g.moveTo(-0.16, 0.08); g.bezierCurveTo(-0.3, -0.2, 0.05, -0.2, 0.02, 0.02); g.bezierCurveTo(0, 0.12, -0.08, 0.1, -0.05, -0.02); g.moveTo(0.16, 0.08); g.bezierCurveTo(0.3, -0.2, -0.05, -0.2, -0.02, 0.02); g.bezierCurveTo(0, 0.12, 0.08, 0.1, 0.05, -0.02); g.stroke(); break;
      case "Brauer": g.fillStyle = "#e8c050"; g.fillRect(-0.09, -0.1, 0.16, 0.2); g.fillStyle = "#fffaf0"; g.fillRect(-0.1, -0.13, 0.18, 0.05); g.strokeStyle = "#8a6a30"; g.lineWidth = 0.02; g.strokeRect(-0.09, -0.1, 0.16, 0.2); g.beginPath(); g.arc(0.1, 0, 0.05, -1.3, 1.3); g.stroke(); break;
      case "Zimmerer": g.strokeStyle = braun; g.lineWidth = 0.03; g.beginPath(); g.moveTo(-0.15, 0.12); g.lineTo(0.12, -0.12); g.moveTo(0.15, 0.12); g.lineTo(-0.12, -0.12); g.stroke(); g.fillStyle = "#8a8f98"; g.beginPath(); g.moveTo(0.08, -0.16); g.lineTo(0.18, -0.08); g.lineTo(0.12, -0.04); g.closePath(); g.fill(); g.beginPath(); g.moveTo(-0.08, -0.16); g.lineTo(-0.18, -0.08); g.lineTo(-0.12, -0.04); g.closePath(); g.fill(); break;
      case "Schmied": g.strokeStyle = "#555a60"; g.lineWidth = 0.05; g.beginPath(); g.arc(0, 0.02, 0.1, Math.PI * 0.85, Math.PI * 2.15, false); g.stroke(); g.fillStyle = dunkel; g.fillRect(-0.03, -0.17, 0.06, 0.08); break;
      case "Metzger": g.fillStyle = "#8a8f98"; g.beginPath(); g.moveTo(-0.14, -0.1); g.lineTo(0.06, -0.1); g.lineTo(0.08, 0.06); g.lineTo(-0.14, 0.06); g.closePath(); g.fill(); g.fillStyle = braun; g.fillRect(0.06, -0.06, 0.12, 0.035); break;
      case "Feuerwehr": g.fillStyle = rot; g.beginPath(); g.arc(0, 0.04, 0.12, Math.PI, 0); g.lineTo(0.15, 0.06); g.lineTo(-0.15, 0.06); g.closePath(); g.fill(); g.fillStyle = "#e0b040"; g.fillRect(-0.015, -0.09, 0.03, 0.14); break;
      case "Schreiner": g.fillStyle = braun; g.fillRect(-0.15, -0.03, 0.3, 0.08); g.fillStyle = "#8a8f98"; g.fillRect(-0.03, -0.08, 0.05, 0.06); g.fillStyle = "#5a3418"; g.beginPath(); g.arc(0.08, -0.05, 0.04, Math.PI, 0); g.fill(); break;
      case "Landwirt": g.fillStyle = "#f8f8f4"; g.beginPath(); g.ellipse(0, 0.01, 0.13, 0.07, 0, 0, TAU); g.fill(); g.fillStyle = dunkel; g.beginPath(); g.ellipse(-0.03, 0, 0.045, 0.035, 0.4, 0, TAU); g.fill(); g.fillRect(-0.1, 0.05, 0.025, 0.08); g.fillRect(0.07, 0.05, 0.025, 0.08); g.beginPath(); g.ellipse(0.14, -0.04, 0.045, 0.035, 0, 0, TAU); g.fill(); break;
      case "Maurer": g.fillStyle = "#8a8f98"; g.beginPath(); g.moveTo(-0.14, 0.08); g.lineTo(0.02, -0.1); g.lineTo(0.08, -0.04); g.closePath(); g.fill(); g.fillStyle = braun; g.fillRect(0.06, -0.12, 0.1, 0.04); g.fillStyle = "#b5552e"; g.fillRect(-0.02, 0.05, 0.16, 0.07); break;
      default: g.strokeStyle = "#555a60"; g.lineWidth = 0.025; g.beginPath(); g.arc(-0.07, 0.07, 0.045, 0, TAU); g.arc(0.07, 0.07, 0.045, 0, TAU); g.moveTo(-0.04, 0.03); g.lineTo(0.12, -0.14); g.moveTo(0.04, 0.03); g.lineTo(-0.12, -0.14); g.stroke();
    }
    g.restore();
    if (px > 45) { g.fillStyle = "#23406e"; g.font = "bold 0.07px serif"; g.textAlign = "center"; g.fillText(zunft, cx, h - 0.06); }
  }
  /* Weiß-blau gewundener Stamm: erst die Farben, dann das Zylinderlicht */
  function stammMalen(g, V, zA, zE, rA, rE, F, streifen) {
    const s = V.s, Z = F.Z, jahr = F.jahr;
    const umriss = [V.p(0, 0, zA), V.p(0, 0, zE)];
    const pts = [[umriss[0][0] - rA * s, umriss[0][1]], [umriss[1][0] - rE * s, umriss[1][1]], [umriss[1][0] + rE * s, umriss[1][1]], [umriss[0][0] + rA * s, umriss[0][1]]];
    g.save();
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); g.lineTo(pts[1][0], pts[1][1]); g.lineTo(pts[2][0], pts[2][1]); g.lineTo(pts[3][0], pts[3][1]);
    g.ellipse(umriss[0][0], umriss[0][1], rA * s, rA * s * 0.5, 0, 0, Math.PI); g.closePath();
    g.clip();
    g.fillStyle = "#f3f1ea"; g.fillRect(pts[0][0] - 2, pts[1][1] - 2, (rA * 2) * s + 4, pts[0][1] - pts[1][1] + rA * s + 4);
    if (streifen) {
      /* Spirale: Farbe hängt von Winkel + Höhe ab. Je sichtbarem Winkel ein Band. */
      const kamW = Math.atan2(V.sn, V.c);
      const steig = 1.5, zahl = 1;
      const dz = Math.max(0.03, 2.2 / s);
      g.fillStyle = "#2a62b0";
      for (let z = zA; z < zE; z += dz) {
        const r = (rA + (rE - rA) * (z - zA) / (zE - zA)) * s, y = -z * KZ * s;
        /* sichtbare Hälfte: Kamerawinkel −90°…+90° um die Blickrichtung */
        const N = 14;
        for (let i = 0; i < N; i++) {
          const w0 = -Math.PI / 2 + Math.PI * i / N, w1 = w0 + Math.PI / N, wm = (w0 + w1) / 2;
          const welt = wm - Math.PI / 4 - kamW;
          const ph = ((welt / TAU * zahl * 2 + z / steig * 2) % 2 + 2) % 2;
          if (ph < 1) continue;
          const x0 = Math.sin(w0) * r, x1 = Math.sin(w1) * r;
          g.fillRect(x0, y - dz * KZ * s - 0.5, x1 - x0 + 0.6, dz * KZ * s + 1);
        }
      }
    }
    /* Zylinderlicht (multiply, nur im Stamm) */
    const gr = g.createLinearGradient(-rA * s, 0, rA * s, 0);
    for (let i = 0; i <= 8; i++) {
      const w = -Math.PI / 2 + Math.PI * i / 8;
      /* Normale im Kameraraum: seitlich (a−b) und zum Betrachter (a+b) */
      const n = [(Math.sin(w) * Math.SQRT1_2 + Math.cos(w) * Math.SQRT1_2), (-Math.sin(w) * Math.SQRT1_2 + Math.cos(w) * Math.SQRT1_2), 0];
      const k = lichtK(n, Z, jahr);
      gr.addColorStop((Math.sin(w) + 1) / 2, rgb(skal(k, 255)));
    }
    g.globalCompositeOperation = "multiply"; g.fillStyle = gr;
    g.fillRect(pts[0][0] - 2, pts[1][1] - 2, (rA * 2) * s + 4, pts[0][1] - pts[1][1] + rA * s + 4);
    g.restore();
  }
  function maibaumMalen(g, s, F, D, W, A) {
    const V = blick(F.gier, s), Z = F.Z, jahr = F.jahr;
    const H = MB.H * A.hoch;
    if (F.schatten) {
      const T = g.getTransform(); g.setTransform(1, 0, 0, 1, T.e, T.f);
      g.fillStyle = "#000";
      g.beginPath();
      if (A.hoch >= 1 && W) tanneMalen(g, s, F, W, { offen: 1, hoehe: 1, kugeln: 0, lichter: 0, geschenke: 0, stern: false, leuchten: false, netz: 0, ohneStamm: true, nurPfad: true });
      const r0 = MB.rU, r1 = MB.rO;
      quaderSchatten(g, V, [[-r0, -r0, 0], [r0, -r0, 0], [r0, r0, 0], [-r0, r0, 0], [-r1, -r1, H], [r1, -r1, H], [r1, r1, H], [-r1, r1, H]]);
      for (const x of [-1, 1]) { const x0 = x * (MB.rU + 0.13) - 0.12; quaderSchatten(g, V, [[x0, -0.15, 0], [x0 + 0.24, -0.15, 0], [x0 + 0.24, 0.15, 0], [x0, 0.15, 0], [x0, -0.15, 2.1], [x0 + 0.24, -0.15, 2.1], [x0 + 0.24, 0.15, 2.1], [x0, 0.15, 2.1]]); }
      if (A.kranz) for (let i = 0; i < 16; i++) {
        const w = i / 16 * TAU, x = Math.cos(w) * MB.kranzR, y = Math.sin(w) * MB.kranzR, q = V.boden(x, y, MB.kranzZ), r = 0.1 * s;
        dazu(g, [[q[0] - r, q[1] - r * 0.6], [q[0] + r, q[1] - r * 0.6], [q[0] + r, q[1] + r * 0.6], [q[0] - r, q[1] + r * 0.6]]);
      }
      for (const S of D.schilder.slice(0, Math.round(D.schilder.length * A.schilder))) {
        const ax = Math.cos(S.az), ay = Math.sin(S.az);
        dazu(g, [V.boden(ax * 0.2, ay * 0.2, S.z + 0.1), V.boden(ax * 1.15, ay * 1.15, S.z + 0.1), V.boden(ax * 1.15, ay * 1.15, S.z - 0.58), V.boden(ax * 0.2, ay * 0.2, S.z - 0.58)]);
      }
      if (A.zaun) zaunSchatten(g, V, A.zaun);
      g.fill();
      return;
    }
    const liste = [];
    /* Bänder und Schilder werden nach Tiefe mit dem Stamm verzahnt */
    if (A.kranz) for (const B of D.baender) {
      const x = Math.cos(B.az) * MB.kranzR, y = Math.sin(B.az) * MB.kranzR;
      liste.push({ art: 1, b: B, t: V.tiefe(x, y, MB.kranzZ - 1), h: V.waag(x, y) });
    }
    const nS = Math.round(D.schilder.length * A.schilder);
    for (let i = 0; i < nS; i++) {
      const S = D.schilder[i], x = Math.cos(S.az) * 0.7, y = Math.sin(S.az) * 0.7;
      liste.push({ art: 2, sch: S, t: V.tiefe(x, y, S.z), h: V.waag(x, y) });
    }
    const hinten = liste.filter((d) => d.h < 0).sort((a, b) => a.t - b.t), vorn = liste.filter((d) => d.h >= 0).sort((a, b) => a.t - b.t);
    const malDing = (d) => {
      if (d.art === 1) {
        const B = d.b, x = Math.cos(B.az) * MB.kranzR, y = Math.sin(B.az) * MB.kranzR;
        const k = lichtK(V.n(Math.cos(B.az), Math.sin(B.az), 0.1), Z, jahr);
        g.strokeStyle = rgb(mul(B.farbe, k)); g.lineWidth = Math.max(0.7, 0.07 * s); g.lineCap = "butt";
        g.beginPath();
        for (let i = 0; i <= 10; i++) {
          const u = i / 10, zz = MB.kranzZ - 0.05 - u * B.laenge;
          const sw = Math.sin(u * 5 + B.wehen) * 0.12 * u;
          const p = V.p(x + Math.cos(B.az + 1.5) * sw, y + Math.sin(B.az + 1.5) * sw, zz);
          if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]);
        }
        g.stroke();
      } else {
        const S = d.sch, ax = Math.cos(S.az), ay = Math.sin(S.az);
        const kA = lichtK(V.n(0, 0, 1), Z, jahr);
        /* Querholz vom Stamm */
        const a = V.p(ax * 0.1, ay * 0.1, S.z + 0.08), b = V.p(ax * 1.2, ay * 1.2, S.z + 0.08);
        g.strokeStyle = rgb(mul([122, 88, 58], kA)); g.lineWidth = Math.max(0.8, 0.06 * s); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
        /* Tafel: zur Kamera gewandte Seite malen */
        let eu = [ax, ay, 0], o = [ax * 0.3, ay * 0.3, S.z];
        const n0 = V.n(-ay, ax, 0);
        if (n0[0] * AUGE[0] + n0[1] * AUGE[1] < 0) { eu = [-ax, -ay, 0]; o = [ax * 1.15, ay * 1.15, S.z]; }
        const nk = V.n(-eu[1], eu[0], 0);
        const k = lichtK(nk, Z, jahr);
        g.save();
        affin(g, V, o, eu, [0, 0, -1]);
        zunftSymbol(g, 0.85, 0.58, S.zunft, s);
        g.globalCompositeOperation = "multiply"; g.fillStyle = rgb(skal(k, 255)); g.fillRect(0, 0, 0.85, 0.58);
        g.restore();
      }
    };
    for (const d of hinten) malDing(d);
    /* Kranz hintere Hälfte, Stamm, vordere Hälfte */
    const kranz = (vornTeil) => {
      if (!A.kranz) return;
      const kz = MB.kranzZ, R = MB.kranzR;
      const kU = lichtK([0, 0.3, 0.95], Z, jahr);
      const n = Math.max(24, Math.round(R * s * 1.5));
      for (let i = 0; i < n; i++) {
        const w = i / n * TAU, x = Math.cos(w) * R, y = Math.sin(w) * R;
        const h = V.waag(x, y);
        if ((h >= 0) !== vornTeil) continue;
        const p = V.p(x, y, kz);
        const kk = lichtK(V.n(Math.cos(w), Math.sin(w), 0.6), Z, jahr);
        g.fillStyle = rgb(mul([44 + (i % 3) * 8, 88 + (i % 4) * 6, 50], kk));
        g.beginPath(); g.ellipse(p[0], p[1], Math.max(1, 0.1 * s), Math.max(0.8, 0.075 * s), (i % 5) * 0.6, 0, TAU); g.fill();
        if (i % 4 === 0 && s > 20) { g.fillStyle = rgb(mul(i % 8 ? [246, 246, 246] : [40, 90, 180], kU)); g.beginPath(); g.arc(p[0], p[1] - 0.04 * s, Math.max(0.6, 0.035 * s), 0, TAU); g.fill(); }
      }
    };
    kranz(false);
    stammMalen(g, V, 0, H, MB.rU, MB.rO, F, true);
    /* Wipfel: kleine Fichtenkrone oben auf dem Stamm */
    if (A.hoch >= 1 && W) tanneMalen(g, s, F, W, { offen: 1, hoehe: 1, kugeln: 0, lichter: 0, geschenke: 0, stern: false, leuchten: false, netz: 0, ohneStamm: true });
    kranz(true);
    for (const d of vorn) malDing(d);
  }
  /* Blumen um den Maibaum (in der Figur, nach Tiefe) */
  function blumenMalen(g, V, D, F, anteil) {
    const Z = F.Z, jahr = F.jahr, s = V.s;
    const n = Math.round(D.blumen.length * anteil);
    const l = D.blumen.slice(0, n).map((b) => ({ b: b, t: V.tiefe(b.x, b.y, 0) })).sort((a, b) => a.t - b.t);
    const kS = lichtK([0, 0.5, 0.85], Z, jahr), kB = lichtK(V.n(-0.3, 0.6, 0.7), Z, jahr);
    for (const e of l) {
      const b = e.b, f = V.p(b.x, b.y, 0), k = V.p(b.x + b.neig * b.h, b.y, b.h);
      g.strokeStyle = rgb(mul([62, 118, 50], kS)); g.lineWidth = Math.max(0.6, 0.018 * s);
      g.beginPath(); g.moveTo(f[0], f[1]); g.lineTo(k[0], k[1]); g.stroke();
      /* Blätter */
      g.fillStyle = rgb(mul([70, 130, 58], kS));
      g.beginPath(); g.ellipse(f[0] + 0.03 * s, f[1] - 0.06 * s, Math.max(0.8, 0.03 * s), Math.max(1.2, 0.09 * s), 0.3, 0, TAU); g.fill();
      const r = Math.max(0.9, 0.045 * s);
      if (b.art === 0) {
        /* Tulpe: Kelch */
        g.fillStyle = rgb(mul(b.farbe, kB));
        g.beginPath(); g.moveTo(k[0] - r, k[1] - r * 1.4); g.quadraticCurveTo(k[0] - r * 1.1, k[1] + r * 0.4, k[0], k[1] + r * 0.3); g.quadraticCurveTo(k[0] + r * 1.1, k[1] + r * 0.4, k[0] + r, k[1] - r * 1.4); g.lineTo(k[0] + r * 0.3, k[1] - r * 0.9); g.lineTo(k[0], k[1] - r * 1.5); g.lineTo(k[0] - r * 0.3, k[1] - r * 0.9); g.closePath(); g.fill();
      } else {
        /* Narzisse: Stern mit Trompete */
        g.fillStyle = rgb(mul(b.farbe[0] > 240 && b.farbe[1] > 240 ? [250, 246, 220] : [250, 226, 90], kB));
        g.beginPath(); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, rr = i % 2 ? r * 0.45 : r * 1.1; g.lineTo(k[0] + Math.cos(a) * rr, k[1] - r * 0.3 + Math.sin(a) * rr * 0.7); } g.closePath(); g.fill();
        g.fillStyle = rgb(mul([240, 150, 30], kB)); g.beginPath(); g.arc(k[0], k[1] - r * 0.3, r * 0.4, 0, TAU); g.fill();
      }
    }
  }

  /* =====================================================================
     ZAUN, BODEN, FUNDAMENT (Kern-Flächen)
     ===================================================================== */
  const ZR = 3.5, PFOSTEN = 0.14;
  function girlandeMalen(fruehling, anteil, idx) {
    return function (g, F) {
      const w = F.w, h = F.h, s = F.px, Z = F.zeit, jahr = F.jahr;
      const k = lichtK(F.n[2] > 0.5 ? F.n : [F.n[0] * 0.6, F.n[1] * 0.6, 0.8], Z, jahr);
      const kk = [Math.max(k[0], 0.45), Math.max(k[1], 0.45), Math.max(k[2], 0.5)];
      const rng = ST.zufall(idx * 17 + 3);
      /* Durchhang: von Pfosten zu Pfosten */
      const y = (x) => 0.1 + 0.2 * Math.sin(Math.PI * x / w);
      const n = Math.max(10, Math.round(w * (s > 40 ? 36 : 14)));
      for (let i = 0; i < n; i++) {
        const x = rng() * w, yy = y(x) + (rng() - 0.5) * 0.08;
        const c = fruehling ? [60 + rng() * 20, 118 + rng() * 20, 52] : [26 + rng() * 14, 64 + rng() * 18, 38];
        g.fillStyle = rgb(mul(c, kk));
        g.beginPath(); g.ellipse(x, yy, 0.05 + rng() * 0.03, 0.028, (rng() - 0.5) * 1.2, 0, TAU); g.fill();
      }
      if (!fruehling) {
        g.fillStyle = rgb(mul([246, 249, 255], kk), 0.85);
        for (let i = 0; i < n * 0.25; i++) { const x = rng() * w; g.beginPath(); g.ellipse(x, y(x) - 0.03, 0.04, 0.014, 0, 0, TAU); g.fill(); }
        /* rote Schleife am Pfosten */
        const bx = 0.05, by = 0.08, r = 0.09;
        g.fillStyle = rgb(mul([168, 16, 28], kk));
        g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(bx - r, by - r * 0.9, bx - r * 0.9, by + r * 0.2); g.closePath(); g.fill();
        g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(bx + r, by - r * 0.9, bx + r * 0.9, by + r * 0.2); g.closePath(); g.fill();
        g.fillRect(bx - 0.02, by, 0.03, r * 1.3); g.fillRect(bx + 0.01, by, 0.03, r * 1.2);
        /* Lichterkette in der Girlande */
        if (anteil >= 1 && F.nacht > 0) {
          for (let i = 0; i < 9; i++) {
            const x = (i + 0.5) / 9 * w, yy = y(x) + 0.01;
            const gr = g.createRadialGradient(x, yy, 0, x, yy, 0.07);
            gr.addColorStop(0, "rgba(255,244,210," + F.nacht + ")"); gr.addColorStop(0.3, "rgba(255,200,120," + (0.6 * F.nacht) + ")"); gr.addColorStop(1, "rgba(255,170,80,0)");
            g.fillStyle = gr; g.fillRect(x - 0.07, yy - 0.07, 0.14, 0.14);
          }
          if (F.sicht > 0) F.leuchtPunkt(w / 2, 0.25, 0.8, "255,196,120", 0.28, true);
        } else {
          g.fillStyle = rgb(mul([230, 224, 206], kk), 0.9);
          for (let i = 0; i < 9; i++) { const x = (i + 0.5) / 9 * w; g.beginPath(); g.arc(x, y(x) + 0.01, 0.014, 0, TAU); g.fill(); }
        }
      } else {
        /* Frühling: Blüten und weiß-blaue Bänder */
        const BL = [[240, 70, 90], [250, 220, 60], [250, 250, 245], [200, 120, 220]];
        for (let i = 0; i < n * 0.35; i++) { const x = rng() * w, yy = y(x) + (rng() - 0.5) * 0.06; g.fillStyle = rgb(mul(BL[(rng() * 4) | 0], kk)); g.beginPath(); g.arc(x, yy, 0.028, 0, TAU); g.fill(); }
        for (const [c, off] of [[[246, 246, 246], 0], [[34, 90, 176], 0.05]]) {
          g.strokeStyle = rgb(mul(c, kk)); g.lineWidth = 0.035;
          g.beginPath(); g.moveTo(0.05, 0.05); g.lineTo(0.02 + off, 0.45); g.stroke();
        }
      }
    };
  }
  /* Wo Pfosten und Latten stehen (für Bau und Schatten gemeinsam) */
  function zaunPlan(anteilPfosten, anteilLatten) {
    const ecken = [];
    for (let i = 0; i < 8; i++) { const a = (i + 0.5) / 8 * TAU; ecken.push([Math.cos(a) * ZR, Math.sin(a) * ZR]); }
    const pf = Math.round(8 * anteilPfosten), nl = Math.round(8 * anteilLatten);
    const pfosten = [], latten = [];
    for (let i = 0; i < pf; i++) pfosten.push({ i: i, x: ecken[i][0], y: ecken[i][1] });
    for (let i = 0; i < nl && i < pf; i++) {
      if ((i + 1) % 8 >= pf && pf < 8) continue;
      const a = ecken[i], b = ecken[(i + 1) % 8];
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), dx = (b[0] - a[0]) / L, dy = (b[1] - a[1]) / L;
      latten.push({ i: i, a: a, b: b, L: L, dx: dx, dy: dy, x0: a[0] + dx * PFOSTEN / 2, y0: a[1] + dy * PFOSTEN / 2, x1: b[0] - dx * PFOSTEN / 2, y1: b[1] - dy * PFOSTEN / 2 });
    }
    return { pfosten: pfosten, latten: latten };
  }
  const PFOSTEN_H = 1.05, LATTEN_Z = [0.34, 0.84];
  function zaunSchatten(g, V, plan) {
    for (const p of plan.pfosten) {
      const h = PFOSTEN / 2, e = [];
      for (const z of [0, PFOSTEN_H]) for (const [dx, dy] of [[-h, -h], [h, -h], [h, h], [-h, h]]) e.push([p.x + dx, p.y + dy, z]);
      quaderSchatten(g, V, e);
    }
    for (const l of plan.latten) for (const z0 of LATTEN_Z) {
      const e = [];
      for (const z of [z0, z0 + 0.1]) for (const [x, y] of [[l.x0, l.y0], [l.x1, l.y1]]) e.push([x - l.dy * 0.035, y + l.dx * 0.035, z], [x + l.dy * 0.035, y - l.dx * 0.035, z]);
      quaderSchatten(g, V, e);
    }
  }
  /* Der Zaun wirft keinen Kern-Schatten (je Teil ein Weichzeichnen wäre
     teuer): sein Schatten kommt mit dem Baum in einem Pfad (zaunSchatten). */
  function zaunBauen(M, o, plan, anteilSchmuck) {
    const winter = o.jahr === "winter";
    const holzF = [118, 84, 54];
    const schnee = (g, F) => { g.fillStyle = "#f5f8fd"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); };
    for (const p of plan.pfosten) {
      const i = p.i, x = p.x, y = p.y, l = Math.hypot(x, y), ux = x / l, uy = y / l;
      M.teil("pfosten" + i, { schatten: false });
      const m = gebacken((g, F) => { holz(g, F.w, F.h, holzF, F, i + 11); g.fillStyle = "rgba(30,20,10,0.2)"; g.fillRect(0, 0, F.w, 0.03); });
      kasten(M, x - ux * PFOSTEN / 2, y - uy * PFOSTEN / 2, x + ux * PFOSTEN / 2, y + uy * PFOSTEN / 2, 0, PFOSTEN, PFOSTEN_H, { links: m, rechts: m, anfang: m, ende: m, oben: winter ? schnee : "#8a6644" });
      if (winter) {
        /* Schneehäubchen auf dem Pfosten */
        M.teil("pfostenkappe" + i, { schatten: false });
        kasten(M, x - ux * 0.08, y - uy * 0.08, x + ux * 0.08, y + uy * 0.08, PFOSTEN_H, 0.16, 0.05, { links: schnee, rechts: schnee, anfang: schnee, ende: schnee, oben: schnee });
      }
    }
    for (const la of plan.latten) {
      const i = la.i;
      for (const [z0, nm] of [[LATTEN_Z[0], "unten"], [LATTEN_Z[1], "oben"]]) {
        M.teil("latte" + nm + i, { schatten: false });
        const m = gebacken((g, F) => holz(g, F.w, F.h, [128, 92, 60], F, i * 3 + (nm === "oben" ? 1 : 2)));
        kasten(M, la.x0, la.y0, la.x1, la.y1, z0, 0.07, 0.1, { links: m, rechts: m, oben: winter ? schnee : "#96704a" });
        if (nm === "oben" && anteilSchmuck > 0) {
          /* Girlande in der Lattenebene, von beiden Seiten sichtbar */
          M.flaeche({ name: "girlande" + i, o: [la.a[0], la.a[1], 1.08], u: [la.dx, la.dy, 0], v: [0, 0, -1], w: la.L, h: 0.55, malen: gebacken(girlandeMalen(!winter, anteilSchmuck, i)), beidseitig: true, keinLicht: true, ebene: 1 });
        }
      }
    }
  }
  /* Bodenbelag im Zaun: Achteck knapp innerhalb der Pfosten */
  function bodenBauen(M, o) {
    const winter = o.jahr === "winter";
    const R = ZR - 0.06, um = [];
    for (let i = 0; i < 8; i++) { const a = (i + 0.5) / 8 * TAU; um.push([Math.cos(a) * R + R, Math.sin(a) * R + R]); }
    M.teil("bodenbelag", { ebene: -1, schatten: false });
    if (winter) {
      /* Winter: kein eigener Boden (der Schnee der Stadt liegt ja schon da) –
         nur Tannenreisig, das aus dem Schnee lugt, und weiche Schneehügel.
         keinLicht: Licht selbst rechnen, sonst färbte der Kern die ganze
         Achteckfläche ein und man sähe eine Kante zum Stadtboden. */
      M.flaeche({
        name: "reisig", o: [-R, -R, 0.012], u: [1, 0, 0], v: [0, 1, 0], w: 2 * R, h: 2 * R, umriss: um, keinLicht: true,
        malen: gebacken(function (g, F) {
          const rng = ST.zufall(99), k = lichtK([0, 0, 1], F.zeit, F.jahr);
          const n = F.px > 20 ? 110 : 40;
          g.lineCap = "round";
          for (let i = 0; i < n; i++) {
            const a = rng() * TAU, r = R * (0.3 + rng() * 0.62), x = R + Math.cos(a) * r, y = R + Math.sin(a) * r, l = 0.22 + rng() * 0.3, w = a + (rng() - 0.5) * 2.2;
            const c = rgb(mul([30 + rng() * 14, 64 + rng() * 18, 40], k));
            g.strokeStyle = c; g.lineWidth = 0.035;
            g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(w) * l, y + Math.sin(w) * l); g.stroke();
            if (F.px > 26) {
              g.lineWidth = 0.02; g.beginPath();
              for (let j = 1; j < 6; j++) { const bx = x + Math.cos(w) * l * j / 6, by = y + Math.sin(w) * l * j / 6; g.moveTo(bx, by); g.lineTo(bx + Math.cos(w + 0.8) * 0.07, by + Math.sin(w + 0.8) * 0.07); g.moveTo(bx, by); g.lineTo(bx + Math.cos(w - 0.8) * 0.07, by + Math.sin(w - 0.8) * 0.07); }
              g.stroke();
            }
            /* Schnee darauf */
            if (rng() < 0.6) { g.fillStyle = rgb(mul([246, 249, 255], k), 0.9); g.beginPath(); g.ellipse(x + Math.cos(w) * l * 0.5, y + Math.sin(w) * l * 0.5, l * 0.3, 0.035, w, 0, TAU); g.fill(); }
          }
        })
      });
      return;
    }
    M.flaeche({
      name: "belag", o: [-R, -R, 0.012], u: [1, 0, 0], v: [0, 1, 0], w: 2 * R, h: 2 * R, umriss: um,
      malen: gebacken(function (g, F) {
        const rng = ST.zufall(99);
        /* Rindenmulch mit Moos */
        g.fillStyle = "#6d4c34"; g.fillRect(0, 0, F.w, F.h);
        const n = F.px > 20 ? 700 : 160;
        for (let i = 0; i < n; i++) { g.fillStyle = rgb([80 + rng() * 60, 56 + rng() * 40, 36 + rng() * 26]); g.save(); g.translate(rng() * F.w, rng() * F.h); g.rotate(rng() * 3); g.fillRect(-0.04, -0.012, 0.08, 0.024); g.restore(); }
        PI.rauschen(g, 0, 0, F.w, F.h, 1.2, 0.2, 17, 3);
        g.fillStyle = "rgba(90,130,60,0.35)";
        for (let i = 0; i < 14; i++) { g.beginPath(); g.ellipse(rng() * F.w, rng() * F.h, 0.2 + rng() * 0.3, 0.15 + rng() * 0.2, rng(), 0, TAU); g.fill(); }
      })
    });
  }
  /* Fundament: Betonplatte mit Schalungsspuren und Bodenhülse */
  function fundamentBauen(M, o, anteil) {
    const b = 1.8, h = 0.08;
    M.teil("fundament", { ebene: -1 });
    const seite = gebacken((g, F) => {
      g.fillStyle = "#b7b4aa"; g.fillRect(0, 0, F.w, F.h);
      /* Schalungsspuren: Brettabdrücke */
      g.fillStyle = "rgba(90,86,76,0.35)"; for (let x = 0.2; x < F.w; x += 0.2) g.fillRect(x, 0, 0.008, F.h);
      PI.rauschen(g, 0, 0, F.w, F.h, 0.6, 0.3, 19, 3);
    });
    M.quader({ x: -b / 2, y: -b / 2, z: 0, b: b, t: b, h: h }, {
      sued: seite, nord: seite, ost: seite, west: seite,
      oben: gebacken(function (g, F) {
        g.fillStyle = "#c4c1b6"; g.fillRect(0, 0, F.w, F.h);
        PI.rauschen(g, 0, 0, F.w, F.h, 0.9, 0.28, 23, 4);
        /* Brettfugen der Schalung am Rand, Abzieh-Spuren */
        g.strokeStyle = "rgba(100,96,86,0.4)"; g.lineWidth = 0.012;
        for (let y = 0.15; y < F.h; y += 0.15) { g.beginPath(); g.moveTo(0.05, y); g.lineTo(F.w - 0.05, y + 0.02); g.stroke(); }
        /* Bodenhülse: Stahlrohr in der Mitte */
        g.fillStyle = "#4a4d52"; g.beginPath(); g.arc(F.w / 2, F.h / 2, 0.26, 0, TAU); g.fill();
        g.fillStyle = "#1c1d20"; g.beginPath(); g.arc(F.w / 2, F.h / 2, 0.2, 0, TAU); g.fill();
        g.strokeStyle = "#8a8f96"; g.lineWidth = 0.02; g.beginPath(); g.arc(F.w / 2, F.h / 2, 0.24, 3.6, 5.6); g.stroke();
        if (o.jahr === "winter") { g.fillStyle = "rgba(246,249,255,0.7)"; for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(0.2 + i * 0.25, (i % 2) * 1.3 + 0.2, 0.2, 0.08, 0, 0, TAU); g.fill(); } }
      })
    });
    void anteil;
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  const KRONE = { zU: 1.35, H: 12, R: 3.0 };
  const WIPFEL = { zU: 11.75, H: 13.45, R: 0.62 };

  ST.modell("weihnachtsbaum", {
    name: "Christbaum", gruppe: "Weihnachten", grund: [7.4, 7.4], hoehe: 13.4, bauzeit: 4 * 60,
    bauen: function (M, o) {
      const bau = o.bau == null ? 1 : o.bau;
      const winter = o.jahr === "winter";
      const saat = o.saat || 1;
      /* ---- 1. Grube für die Bodenhülse (0 … 0,16) ---- */
      if (bau < 0.16) {
        const loch = [[-0.9, -0.9], [0.9, -0.9], [0.9, 0.9], [-0.9, 0.9]];
        const fuell = bau < 0.08 ? null : -1.2 + 1.2 * phase(bau, 0.08, 0.155);
        M.teil("grube", { ebene: -2, schatten: false, mitte: [0, 0, -1] });
        M.figur({ x: 0, y: 0, z: 0, breite: 4, hoehe: 0.5, schatten: false, malen: function (g, s, F) { grubeMalen(g, blick(F.gier, s), F, loch, 1.2, fuell); } });
        return;
      }
      /* ---- 2. Fundamentplatte mit Bodenhülse ---- */
      if (bau < 0.6) fundamentBauen(M, o, 1);
      if (bau >= 0.52) bodenBauen(M, o);
      /* ---- 3. Zaun ---- */
      const plan = zaunPlan(phase(bau, 0.42, 0.5), phase(bau, 0.48, 0.56));
      zaunBauen(M, o, plan, phase(bau, 0.86, 0.94) >= 1 ? 1 : 0);
      if (bau < 0.2) return;
      /* Unsichtbare Hilfsfläche an der Spitze: damit die Bildgrenzen den
         langen Schatten des Baums mit aufnehmen (Figurenschatten zählt der
         Kern nicht zu den Grenzen). */
      M.teil("schattenhilfe", { mitte: [0, 0, 0] });
      M.flaeche({ name: "hilfe", o: [-0.02, -0.02, 13.2], u: [1, 0, 0], v: [0, 1, 0], w: 0.04, h: 0.04, malen: function () {}, keinLicht: true });
      if (winter) {
        const D = baumDaten(saat, KRONE);
        const A = {
          offen: 0.3 + 0.7 * phase(bau, 0.27, 0.42), hoehe: 1, netz: 1 - phase(bau, 0.25, 0.3),
          lichter: phase(bau, 0.56, 0.72), kugeln: phase(bau, 0.72, 0.88), geschenke: phase(bau, 0.9, 0.99),
          stern: bau >= 0.66, leuchten: bau >= 0.98, zaun: plan
        };
        M.teil("baum", { mitte: [0, 0, 0] });
        M.figur({ x: 0, y: 0, z: 0, breite: 5.6, hoehe: 13.6, malen: mitGier(function (g, s, F) {
          if (F.schatten) return tanneMalen(g, s, F, D, A);
          aufCpu(g, -3.9 * s, -13.4 * KZ * s, 7.8 * s, 13.4 * KZ * s + 2.4 * s, function (cg) { tanneMalen(cg, s, F, D, A); });
        }) });
        /* Funkeln: einzelne Lämpchen blitzen kurz auf („leicht flackernd") */
        if (A.leuchten) {
          const fun = D.lampen.filter((l, i) => i % 5 === 2 && !l.tief);
          M.lebendig(function (g, P) {
            if (!P.Z || P.Z.nacht < 0.1) return;
            g.globalCompositeOperation = "lighter";
            for (const l of fun) {
              const a = l.p[0] * P.c - l.p[1] * P.sn, b = l.p[0] * P.sn + l.p[1] * P.c;
              const r = Math.hypot(a, b) || 1;
              if ((a + b) / (r * Math.SQRT2) < 0.3) continue;
              const k = Math.pow(Math.max(0, Math.sin(P.t * l.w + l.ph * 7)), 14) * P.Z.nacht;
              if (k < 0.05) continue;
              const q = P.proj(l.p[0], l.p[1], l.p[2]), L = Math.max(2, 0.22 * P.s) * k;
              g.strokeStyle = "rgba(255,236,200," + (0.8 * k).toFixed(3) + ")"; g.lineWidth = Math.max(0.6, 0.012 * P.s);
              g.beginPath(); g.moveTo(q[0] - L, q[1]); g.lineTo(q[0] + L, q[1]); g.moveTo(q[0], q[1] - L); g.lineTo(q[0], q[1] + L); g.stroke();
            }
            g.globalCompositeOperation = "source-over";
          });
        }
      } else {
        const D = maibaumDaten(saat);
        const W = baumDaten(saat, WIPFEL, true);
        const A = { hoch: 1, schilder: phase(bau, 0.3, 0.6), kranz: bau >= 0.66, zaun: plan };
        M.teil("baum", { mitte: [0, 0, 0] });
        M.figur({ x: 0, y: 0, z: 0, breite: 5.6, hoehe: 13.8, malen: mitGier(function (g, s, F) {
          if (F.schatten) return maibaumMalen(g, s, F, D, W, A);
          aufCpu(g, -3.9 * s, -13.8 * KZ * s, 7.8 * s, 13.8 * KZ * s + 2.4 * s, function (cg) {
            if (bau >= 0.84) blumenMalen(cg, blick(F.gier, s), D, F, phase(bau, 0.84, 1));
            maibaumMalen(cg, s, F, D, W, A);
          });
        }) });
        /* Stützen des Maibaums (Maibaumständer): zwei Kanthölzer mit Stahlbändern */
        for (const seite of [-1, 1]) {
          M.teil("stuetze" + seite);
          const x = seite * (MB.rU + 0.13);
          const m = gebacken((g, F) => {
            holz(g, F.w, F.h, [120, 88, 58], F, 40 + seite);
            g.fillStyle = "#5b5f66"; for (const y of [0.35, 1.2]) { g.fillRect(0, y, F.w, 0.07); g.fillStyle = "#2a2c30"; g.beginPath(); g.arc(F.w / 2, y + 0.035, 0.025, 0, TAU); g.fill(); g.fillStyle = "#5b5f66"; }
          });
          M.quader({ x: x - 0.12, y: -0.15, z: 0, b: 0.24, t: 0.3, h: 2.1 }, { sued: m, nord: m, ost: m, west: m, oben: "#7a5a3c" });
        }
      }
    }
  });
})();
