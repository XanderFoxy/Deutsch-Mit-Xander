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

   ZWEIGE: je Ast ein gezahnter Zweigkörper (jeder Zahn eine Triebspitze),
   darüber eine Nadelkachel (je Maßstab einmal gemalt), verjüngte
   Seitentriebe erster und zweiter Ordnung und ab s ≥ 45 einzelne Nadeln.
   Das Innere ist ein Nadelkegel mit Seitenlicht und Etagenschatten unter
   jedem Quirl. Schnee liegt als Polster mit Dicke (unten bläulich).
   Nachts: jedes Lämpchen mit weichem Hof (0,3 m), Zweige daneben warm,
   Bodenlicht 6,5 m und drei schwache Kronenlichter; einzelne Lämpchen
   funkeln (M.lebendig). Rechenzeit (Prüfumgebung, s = 40): 130–170 ms.

   Maße: Baum 12 m, unterste Äste auf 1,35 m (Platz für Zaun und
   Geschenke), Kronenradius unten 3 m, Herrnhuter Stern mit 1,2 m
   Durchmesser, Zaun aus Kanthölzern im Achteck (Radius 3,5 m, 1,05 m hoch).
   Frühling: Maibaum (20 m) mit weiß-blau gewundenem Stamm, Wipfelbäumchen,
   zwei Kränzen, Bändern, Wimpel und acht ausgesägten Zunftfiguren; im
   Sandstein-Achteck mit Tulpenbeet, Stützen, zwei Bänken und Kübeln.
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
    for (const l of D.lampen) l.a.glut = (l.a.glut || 0) + (l.tief ? 0.15 : 0.32);
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
  /* Zweig-Geometrie je Ast, einmal gerechnet (und je Öffnungsgrad beim
     Aufrichten): Seitentriebe in Modellmetern mit Farbeimer, dazu die
     Schneepolster. Beim Malen wird nur noch projiziert. */
  function klemm(v, a, b) { return v < a ? a : v > b ? b : v; }
  function kurveP(a, m, b, u) { const iu = 1 - u; return [iu * iu * a[0] + 2 * iu * u * m[0] + u * u * b[0], iu * iu * a[1] + 2 * iu * u * m[1] + u * u * b[1], iu * iu * a[2] + 2 * iu * u * m[2] + u * u * b[2]]; }
  function zweigDaten(A, offen) {
    const key = Math.round(offen * 200);
    if (A._z && A._zk === key) return A._z;
    const rr = ST.zufall(A.id * 97 + 3);
    const lange = A.L * offen;
    const dt = Math.max(0.028, 0.075 / Math.max(0.2, lange));
    const triebe = [];
    for (let t = 0.06 + rr() * dt * 0.5; t < 0.96; t += dt * (0.8 + rr() * 0.4)) {
      for (let side = -1; side <= 1; side += 2) {
        if (rr() < 0.1) continue;                                   // Lücken: Luft zwischen den Trieben
        const lang = 0.09 + 0.08 * rr();
        const tb = Math.min(1.02, t + lang * (1 - t * 0.45));
        const l = side * (0.78 + 0.35 * rr()) * (t > 0.88 ? 0.55 : 1);
        const a = astP(A, t, 0, offen), m = astP(A, (t + tb) / 2, l * 0.55, offen), b = astP(A, tb, l, offen);
        m[2] += 0.01 * lange; b[2] -= 0.025 * rr() * lange;          // gewölbt, die Spitze hängt leicht
        const tr = { t: t, a: a, m: m, b: b, eimer: rr() < 0.28 ? 0 : rr() < 0.68 ? 1 : 2, r: rr(), side: side };
        triebe.push(tr);
        /* Triebe zweiter Ordnung: die Tanne ist doppelt gefiedert */
        const lenT = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
        if (lenT > 0.12) for (const [u, s2] of [[0.34, 1], [0.58, -1], [0.8, 1]]) {
          if (rr() < 0.2) continue;
          const c = kurveP(a, m, b, u), c2 = kurveP(a, m, b, Math.min(1, u + 0.05));
          let dx = c2[0] - c[0], dy = c2[1] - c[1]; const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
          const sd = s2 * side, lk = lenT * (0.26 + rr() * 0.12) * (1 - u * 0.5);
          const e = [c[0] + (dx * 0.72 - dy * sd * 0.7) * lk, c[1] + (dy * 0.72 + dx * sd * 0.7) * lk, c[2] - 0.01];
          const mm = [(c[0] + e[0]) / 2, (c[1] + e[1]) / 2, (c[2] + e[2]) / 2 + 0.006];
          triebe.push({ t: t, a: c, m: mm, b: e, eimer: rr() < 0.4 ? 1 : 2, r: rr(), side: side, klein: true });
        }
      }
    }
    triebe.push({ t: 0.93, a: astP(A, 0.86, 0, offen), m: astP(A, 0.95, 0, offen), b: astP(A, 1.03, 0, offen), eimer: 2, r: 0.5, side: 1 });
    /* Schneepolster: unregelmäßig auf dem Hauptast und auf einzelnen
       Trieben; flache Äste tragen mehr als hängende */
    const polster = [];
    if (A.schnee > 0.22) {
      const menge = (A.schnee - 0.22) / 0.78, flach = klemm(1.15 - A.hang * 0.5, 0.35, 1);
      let t = 0.22 + rr() * 0.1;
      while (t < 0.9) {
        const len = 0.07 + rr() * 0.16 + menge * 0.12;
        if (rr() < 0.3 + 0.6 * menge) {
          const tb = Math.min(0.95, t + len), lc = (rr() - 0.5) * 0.3, lw = 0.16 + rr() * 0.2 + menge * 0.14, pts = [], q = [];
          for (let i = 0; i <= 5; i++) { const tt = t + (tb - t) * i / 5, c = astP(A, tt, lc, offen), e = astP(A, tt, lc + lw, offen); pts.push(c); q.push([e[0] - c[0], e[1] - c[1], e[2] - c[2]]); }
          polster.push({ t: (t + tb) / 2, pts: pts, q: q, h: (0.02 + 0.05 * menge) * flach * (0.7 + 0.6 * rr()), saat: rr() * 100 });
        }
        t += len + 0.03 + rr() * 0.12;
      }
      for (const tr of triebe) {
        if (tr.klein || tr.t < 0.34 || tr.t > 0.9 || rr() > 0.05 + 0.16 * menge) continue;
        const pts = [], q = [], bis = 0.3 + rr() * 0.25;
        for (let i = 0; i <= 4; i++) {
          const u = 0.06 + (bis - 0.06) * i / 4, c = kurveP(tr.a, tr.m, tr.b, u), c2 = kurveP(tr.a, tr.m, tr.b, Math.min(1, u + 0.05));
          const d = [c2[0] - c[0], c2[1] - c[1]], dl = Math.hypot(d[0], d[1]) || 1, w = 0.045 + 0.03 * menge;
          pts.push(c); q.push([-d[1] / dl * w, d[0] / dl * w, 0]);
        }
        polster.push({ t: tr.t, pts: pts, q: q, h: (0.015 + 0.025 * menge) * flach, saat: rr() * 100 });
      }
    }
    A._z = { triebe: triebe, polster: polster }; A._zk = key;
    return A._z;
  }
  /* Umriss eines Schneepolsters (unten: Auflage, oben: um die Dicke gehoben) */
  function polsterPfad(g, V, p, oben) {
    const n = p.pts.length, L = [], R = [];
    for (let i = 0; i < n; i++) {
      const u = (i + 0.5) / n, zu = Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, i / (n - 1)))), 0.45);
      const k = (0.7 + 0.55 * ST.rausch(i * 1.3 + p.saat, p.saat, 3)) * (0.25 + 0.75 * zu) * (oben ? 0.9 : 1);
      const k2 = (0.7 + 0.55 * ST.rausch(i * 1.3 + p.saat, p.saat + 7, 3)) * (0.25 + 0.75 * zu) * (oben ? 0.9 : 1);
      const c = p.pts[i], q = p.q[i], dz = oben ? p.h * (0.6 + 0.5 * ST.rausch(i * 2.1, p.saat, 5)) : 0.01;
      L.push(V.p(c[0] + q[0] * k, c[1] + q[1] * k, c[2] + q[2] * k + dz));
      R.push(V.p(c[0] - q[0] * k2, c[1] - q[1] * k2, c[2] - q[2] * k2 + dz));
      void u;
    }
    g.moveTo(L[0][0], L[0][1]);
    for (let i = 1; i < n; i++) g.quadraticCurveTo(L[i - 1][0], L[i - 1][1], (L[i - 1][0] + L[i][0]) / 2, (L[i - 1][1] + L[i][1]) / 2);
    g.lineTo(L[n - 1][0], L[n - 1][1]);
    g.quadraticCurveTo((L[n - 1][0] + R[n - 1][0]) / 2 + (L[n - 1][0] - L[n - 2][0]) * 0.6, (L[n - 1][1] + R[n - 1][1]) / 2 + (L[n - 1][1] - L[n - 2][1]) * 0.6, R[n - 1][0], R[n - 1][1]);
    for (let i = n - 1; i > 0; i--) g.quadraticCurveTo(R[i][0], R[i][1], (R[i][0] + R[i - 1][0]) / 2, (R[i][1] + R[i - 1][1]) / 2);
    g.lineTo(R[0][0], R[0][1]);
    g.quadraticCurveTo((L[0][0] + R[0][0]) / 2 - (L[1][0] - L[0][0]) * 0.6, (L[0][1] + R[0][1]) / 2 - (L[1][1] - L[0][1]) * 0.6, L[0][0], L[0][1]);
    g.closePath();
  }
  /* Nadelkachel: 128 px = 0,85 m, nahtlos. Kurze Borsten in drei Helligkeiten,
     meist schräg nach unten (die Nadeln stehen seitlich vom Trieb ab und
     hängen leicht). Wird als halbdurchsichtige Schicht über die Grundfarbe
     gelegt, damit kein Zweigkörper und nicht das Innere glatt wie Pappe
     wirkt. Farbneutral – eine Kachel für alle Grüntöne. */
  /* Die Kachel wird je Maßstab einmal in Bildpunkten gemalt (dann ist das
     Füllen ein reines Kopieren ohne Umrechnen – deutlich schneller). */
  const NADEL_KACHELN = new Map();
  function nadelKachel(s) {
    const k = Math.round(s);
    if (NADEL_KACHELN.has(k)) return NADEL_KACHELN.get(k);
    const N = Math.max(24, Math.round(0.85 * k)), f = N / 128;
    const c = document.createElement("canvas"); c.width = c.height = N;
    const g = c.getContext("2d", { willReadFrequently: true });
    const rr = ST.zufall(4242);
    g.lineCap = "round";
    const lagen = [["rgba(0,10,4,0.5)", 1500, 1.25], ["rgba(150,200,140,0.2)", 700, 1.0], ["rgba(214,240,196,0.26)", 260, 0.9]];
    for (const [farbe, n, lw] of lagen) {
      g.strokeStyle = farbe; g.lineWidth = Math.max(0.6, lw * f); g.beginPath();
      for (let i = 0; i < n; i++) {
        const x = rr() * N, y = rr() * N, a = (rr() < 0.5 ? 0.35 : Math.PI - 0.35) + (rr() - 0.5) * 1.3, l = (3 + rr() * 3.5) * f;
        const ex = Math.cos(a) * l, ey = Math.sin(a) * l;
        for (const ox of [-N, 0, N]) for (const oy of [-N, 0, N]) {
          const x0 = x + ox, y0 = y + oy;
          if (Math.max(x0, x0 + ex) < -1 || Math.min(x0, x0 + ex) > N + 1 || Math.max(y0, y0 + ey) < -1 || Math.min(y0, y0 + ey) > N + 1) continue;
          g.moveTo(x0, y0); g.lineTo(x0 + ex, y0 + ey);
        }
      }
      g.stroke();
    }
    if (NADEL_KACHELN.size > 12) NADEL_KACHELN.clear();
    NADEL_KACHELN.set(k, c);
    return c;
  }
  function nadelMuster(g, s) { return g.createPattern(nadelKachel(s), "repeat"); }
  /* Ein Stück Zweigfächer (t0…t1). stufe 0: nur der dunkle Umriss (hinten,
     weit weg), 1: verjüngte Seitentriebe in drei Grüntönen mit Lichtkante,
     2: dazu die Nadeln – je Trieb zwei Reihen feiner, halbdurchsichtiger
     Nadeln, oben hell (Himmelslicht), unten dunkel. Schnee liegt als
     unregelmäßiges Polster mit Dicke auf: unten bläulich, oben weiß. */
  function astStueck(g, V, A, t0, t1, st, offen, stufe) {
    const s = V.s, lange = A.L * offen;
    const P = (t, l) => { const q = astP(A, t, l, offen); return V.p(q[0], q[1], q[2]); };
    const fA = st.farbe(A, t0), fB = st.farbe(A, t1), fm = misch(fA, fB, 0.55);
    /* 1. Unterschicht: der Körper des Zweigs. Hinten/fern (stufe 0) ein
       ausgefranster dunkler Umriss; vorn gezahnt – jeder Zahn ist eine
       Triebspitze, die schräg zur Astspitze zeigt –, darüber die Nadelkachel */
    const pts = [];
    if (s < 12) {
      const n = Math.max(2, Math.min(12, Math.round((t1 - t0) * lange * s / 7)));
      for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; pts.push(P(t, -(0.9 + 0.3 * ST.rausch(t * 11 + A.rausch, 1.5, 5)))); }
      for (let i = n; i >= 0; i--) { const t = t0 + (t1 - t0) * i / n; pts.push(P(t, 0.9 + 0.3 * ST.rausch(t * 11 + A.rausch, 4.5, 5))); }
    } else {
      const dz = Math.max(0.075, (stufe ? 3.2 : 5.5) / s) / Math.max(0.15, lange), nz = Math.max(2, Math.min(40, Math.round((t1 - t0) / dz))), d = (t1 - t0) / nz;
      for (const sd of [-1, 1]) {
        const seite = [];
        for (let i = 0; i < nz; i++) {
          const t = t0 + d * i, h = ST.hash2(A.id, ((t * 400) | 0) + (sd > 0 ? 7 : 0), 11);
          seite.push(P(t, sd * (0.46 + 0.12 * h)));
          seite.push(P(Math.min(t1, t + d * 0.72), sd * (0.84 + 0.26 * h)));
        }
        seite.push(P(t1, sd * 0.5));
        if (sd < 0) pts.push(...seite); else pts.push(...seite.reverse());
      }
    }
    vieleck(g, pts);
    const kU = stufe ? 0.62 : 0.82;
    if (s >= 30) {
      const pA = P(t0, 0), pB = P(t1, 0);
      if (Math.hypot(pB[0] - pA[0], pB[1] - pA[1]) > 1.5) { const gr = g.createLinearGradient(pA[0], pA[1], pB[0], pB[1]); gr.addColorStop(0, rgb(skal(fA, kU * 0.85))); gr.addColorStop(1, rgb(skal(fB, kU))); g.fillStyle = gr; }
      else g.fillStyle = rgb(skal(fm, kU));
    } else g.fillStyle = rgb(skal(fm, kU));
    g.fill();
    if (!stufe) return;
    if (st.muster) { g.fillStyle = st.muster; g.fill(); }
    const Z = zweigDaten(A, offen);
    const liste = [];
    for (const tr of Z.triebe) if (tr.t >= t0 && tr.t < t1) liste.push(tr);
    /* 2. Seitentriebe: verjüngt vom Ast zur Spitze */
    const F3 = [skal(fm, 0.74), fm, plus(skal(fm, 1.18), [10, 16, 8])];
    const w0 = Math.max(0.45, 0.017 * s), proj = new Map();
    const pj = (tr) => { let q = proj.get(tr); if (!q) { q = [V.p(tr.a[0], tr.a[1], tr.a[2]), V.p(tr.m[0], tr.m[1], tr.m[2]), V.p(tr.b[0], tr.b[1], tr.b[2])]; proj.set(tr, q); } return q; };
    for (let k = 0; k < 3; k++) {
      g.beginPath();
      for (const tr of liste) {
        if (tr.eimer !== k) continue;
        const [a, m, b] = pj(tr);
        let dx = m[0] - a[0], dy = m[1] - a[1]; const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
        const ww = tr.klein ? w0 * 0.6 : w0, nx = -dy * ww, ny = dx * ww;
        g.moveTo(a[0] + nx, a[1] + ny); g.quadraticCurveTo(m[0] + nx * 0.55, m[1] + ny * 0.55, b[0], b[1]); g.quadraticCurveTo(m[0] - nx * 0.55, m[1] - ny * 0.55, a[0] - nx, a[1] - ny); g.closePath();
      }
      g.fillStyle = rgb(F3[k]); g.fill();
    }
    /* Lichtkante: die Oberseite der Triebe fängt das Himmelslicht */
    g.beginPath();
    for (const tr of liste) { if (stufe >= 2 && !tr.klein) continue; const [a, m, b] = pj(tr); g.moveTo(a[0], a[1] - w0 * 0.5); g.quadraticCurveTo(m[0], m[1] - w0 * 0.5, b[0], b[1]); }
    g.strokeStyle = rgb(plus(skal(fm, 1.3), [14, 20, 10]), 0.55); g.lineWidth = Math.max(0.4, w0 * 0.55); g.stroke();
    if (stufe >= 2) {
      /* 3. Nadeln: je Haupttrieb zwei Reihen feiner Borsten, schräg nach vorn,
         zur Spitze kürzer; die nach oben weisenden hell (Himmelslicht),
         die nach unten dunkel, die jungen Spitzen hellgrün */
      const nl = 0.028 * s, hell = new Path2D(), mittel = new Path2D(), dunkel = new Path2D(), jung = new Path2D();
      for (const tr of liste) {
        if (tr.klein) continue;
        const [a, m, b] = pj(tr), lenPx = Math.hypot(b[0] - a[0], b[1] - a[1]), nN = Math.max(6, Math.min(22, Math.round(lenPx / Math.max(2.2, 0.03 * s))));
        for (let k = 1; k <= nN; k++) {
          const u = k / (nN + 1), iu = 1 - u;
          const x = iu * iu * a[0] + 2 * iu * u * m[0] + u * u * b[0], y = iu * iu * a[1] + 2 * iu * u * m[1] + u * u * b[1];
          let dx = 2 * iu * (m[0] - a[0]) + 2 * u * (b[0] - m[0]), dy = 2 * iu * (m[1] - a[1]) + 2 * u * (b[1] - m[1]);
          const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
          const zf = (tr.r * 7.3 + k * 0.618) % 1;
          for (const sd of [1, -1]) {
            const px = -dy * sd, py = dx * sd;
            const len = nl * (0.7 + 0.55 * ((zf + (sd > 0 ? 0 : 0.5)) % 1)) * (1 - 0.4 * u);
            const ex = x + (dx * 0.62 + px * 0.78) * len, ey = y + (dy * 0.62 + py * 0.78) * len;
            const ziel = u > 0.78 ? jung : py < -0.25 ? hell : py > 0.25 ? dunkel : mittel;
            ziel.moveTo(x, y); ziel.lineTo(ex, ey);
          }
        }
      }
      g.lineCap = "round"; g.lineWidth = Math.max(0.55, 0.0075 * s);
      g.strokeStyle = rgb(skal(fm, 0.55), 0.85); g.stroke(dunkel);
      g.strokeStyle = rgb(skal(fm, 0.95), 0.8); g.stroke(mittel);
      g.strokeStyle = rgb(plus(skal(fm, 1.32), [14, 20, 10]), 0.78); g.stroke(hell);
      g.strokeStyle = rgb(plus(misch(fm, [96, 140, 80], 0.45), [10, 14, 6]), 0.8); g.stroke(jung);
    }
    /* 4. Schneepolster */
    if (st.schnee && Z.polster.length) {
      const pads = Z.polster.filter((p) => p.t >= t0 && p.t < t1);
      if (pads.length) {
        g.beginPath(); for (const p of pads) polsterPfad(g, V, p, false);
        g.fillStyle = rgb(st.schneeSchatten, 0.96); g.fill();
        if (s > 50) {
          /* Volumen: oben im Licht fast weiß, zur Unterkante bläulich */
          for (const p of pads) {
            let oy = 1e9, uy = -1e9;
            for (const c of p.pts) { const q = V.p(c[0], c[1], c[2] + p.h); if (q[1] < oy) oy = q[1]; if (q[1] + p.h * s > uy) uy = q[1] + p.h * s; }
            oy -= 0.04 * s; uy += 0.04 * s;
            const gs = g.createLinearGradient(0, oy, 0, uy);
            gs.addColorStop(0, rgb(plus(st.schneeFarbe, [8, 8, 8]))); gs.addColorStop(1, rgb(misch(st.schneeFarbe, st.schneeSchatten, 0.4)));
            g.beginPath(); polsterPfad(g, V, p, true); g.fillStyle = gs; g.fill();
          }
        } else {
          g.beginPath(); for (const p of pads) polsterPfad(g, V, p, true);
          g.fillStyle = rgb(st.schneeFarbe); g.fill();
        }
        if (s > 50) {
          g.fillStyle = "rgba(255,255,255,0.95)";
          const rr = ST.zufall(A.id * 31 + ((t0 * 20) | 0));
          for (const p of pads) if (rr() < 0.7) { const c = p.pts[(rr() * p.pts.length) | 0], q = V.p(c[0], c[1], c[2] + p.h); g.fillRect(q[0] + (rr() - 0.5) * 3, q[1] - 1, 1.1, 1.1); }
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

  /* Leuchtschein eines Lämpchens als kleines Bild (je Größe einmal):
     weicher Hof von 0,3 m, der die Nadeln ringsum warm aufhellt, mit
     einem kleinen, nicht harten Kern */
  const HOEFE = new Map();
  function hof(r) {
    const k = Math.max(2, Math.round(r));
    if (HOEFE.has(k)) return HOEFE.get(k);
    const c = document.createElement("canvas"); c.width = c.height = k * 2 + 2;
    const g = c.getContext("2d", { willReadFrequently: true });
    const gr = g.createRadialGradient(k + 1, k + 1, 0, k + 1, k + 1, k);
    gr.addColorStop(0, "rgba(255,250,232,1)"); gr.addColorStop(0.06, "rgba(255,238,196,0.95)"); gr.addColorStop(0.12, "rgba(255,210,136,0.4)");
    gr.addColorStop(0.3, "rgba(255,180,96,0.06)"); gr.addColorStop(0.6, "rgba(255,160,70,0.012)"); gr.addColorStop(1, "rgba(255,150,60,0)");
    g.fillStyle = gr; g.fillRect(0, 0, c.width, c.height);
    HOEFE.set(k, c);
    return c;
  }
  /* Blick auf einen gekippten Baum (Anlieferung am Kranhaken): Punkte
     werden um die x-Achse am Stammfuß gedreht und angehoben */
  function kippBlick(V, w, hub) {
    const c = Math.cos(w), sn = Math.sin(w);
    const R = (x, y, z) => [x, y * c + z * sn, -y * sn + z * c + hub];
    return {
      c: V.c, sn: V.sn, s: V.s, gekippt: true,
      p: (x, y, z) => { const q = R(x, y, z); return V.p(q[0], q[1], q[2]); },
      tiefe: (x, y, z) => { const q = R(x, y, z); return V.tiefe(q[0], q[1], q[2]); },
      waag: () => 1,
      n: (x, y, z) => { const q = R(x, y, z); return V.n(q[0], q[1], q[2] - hub); },
      boden: (x, y, z) => { const q = R(x, y, z); return V.boden(q[0], q[1], q[2]); }
    };
  }

  /* Der ganze Baum als Figur. D = Baumdaten, A = Bauzustand */
  function tanneMalen(g, s, F, D, A) {
    let V = blick(F.gier, s);
    if (A.kipp) V = kippBlick(V, A.kipp, A.hub || 0);
    const Z = F.Z, jahr = F.jahr, kr = D.kr;
    const nacht = F.nacht;
    const offen = A.offen;
    if (F.schatten) {
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
      if (A.stern || !A.ohneStamm) quaderSchatten(g, V, [[-0.03, -0.03, kr.H - 1.5], [0.03, 0.03, kr.H - 1.5], [-0.03, 0.03, kr.H + (A.stern ? 0.55 : 0)], [0.03, -0.03, kr.H + (A.stern ? 0.55 : 0)]]);
      /* Stern: ein kleiner achtzackiger Schatten am Ende des Leittriebs –
         ganz klein gezoomt weggelassen (sonst ein runder Fleck) */
      if (A.stern && s >= 14) {
        const q = V.boden(0, 0, kr.H + 0.55), pts = [];
        const ax = V.boden(1, 0, kr.H + 0.55), ay = V.boden(0, 1, kr.H + 0.55);
        const ex = [(ax[0] - q[0]), (ax[1] - q[1])], ey = [(ay[0] - q[0]), (ay[1] - q[1])];
        for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, r = i % 2 ? 0.14 : 0.36; pts.push([q[0] + (ex[0] * Math.cos(a) + ey[0] * Math.sin(a)) * r, q[1] + (ex[1] * Math.cos(a) + ey[1] * Math.sin(a)) * r]); }
        dazu(g, pts);
      }
      if (A.zaun) zaunSchatten(g, V, A.zaun);
      if (!A.nurPfad) g.fill();
      return;
    }
    /* ---- Farben dieses Bilds (Licht hängt vom Drehwinkel ab) ---- */
    const kUp = lichtK([0, 0, 1], Z, jahr);
    const astK = D.aeste.map((a) => {
      const k = lichtK(V.n(a.ca * 0.62, a.sa * 0.62, 0.78), Z, jahr);
      const h = Math.min(1, Math.max(0, (a.z - kr.zU) / (kr.H - kr.zU)));
      const ao = 0.78 + 0.22 * h - (a.zw ? 0.12 : 0);
      return [k[0] * ao, k[1] * ao, k[2] * ao];
    });
    const lampenAn = A.lichter > 0 && A.leuchten;
    /* „abend" (nacht 0,75) soll schon voll wirken */
    const warmN = lampenAn ? Math.min(1, nacht * 1.3) : 0;
    const st = {
      schnee: jahr === "winter",
      muster: s >= 40 ? nadelMuster(g, s) : null,
      schneeFarbe: plus(mul([244, 247, 253], kUp), [30 * warmN, 18 * warmN, 4 * warmN]),
      schneeSchatten: plus(mul([168, 184, 214], kUp), [18 * warmN, 10 * warmN, 2 * warmN]),
      farbe: function (a, t) {
        const k = astK[a.id], ao = 0.36 + 0.64 * Math.pow(Math.max(0, t), 0.8);
        let f = mul(a.farbe, [k[0] * ao, k[1] * ao, k[2] * ao]);
        if (t > 0.85) f = misch(f, mul([70, 108, 62], k), (t - 0.85) * 2.2);
        /* nachts: Zweige mit Lämpchen werden warm angestrahlt */
        if (warmN > 0) { const w = warmN * Math.min(0.7, (a.glut || 0)) * t * t; f = plus(f, [13 * w, 10 * w, 1 * w]); }
        return f;
      }
    };
    /* ---- Dinge sammeln ---- */
    const vorn = [], hinten = [];
    /* d.cw: Kosinus zur Blickrichtung (1 = ganz vorn, 0 = am Umriss, −1 = hinten) */
    const rein = (d, x, y, z) => { const w = V.waag(x, y); (w >= 0 ? vorn : hinten).push(d); d.t = V.tiefe(x, y, z); d.cw = w / ((Math.hypot(x, y) || 1) * AUGE[0]); };
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
    const zeigBis = (anteil, z) => z >= kr.H - (kr.H - kr.zU + 0.5) * anteil;
    if (A.kugeln > 0) for (const k of D.kugeln) if (zeigBis(A.kugeln, k.p[2])) { const q = lage(k); rein({ art: 1, k: k, q: q }, q[0], q[1], q[2]); }
    if (A.kugeln > 0) for (const k of D.schleifen) if (zeigBis(A.kugeln, k.p[2])) { const q = lage(k); rein({ art: 3, k: k, q: q }, q[0], q[1], q[2]); }
    if (A.lichter > 0) for (const l of D.lampen) if (zeigBis(A.lichter, l.p[2])) { const q = lage(l); rein({ art: 2, l: l, q: q }, q[0], q[1], q[2]); }
    if (A.geschenke > 0) { const n = Math.round(D.geschenke.length * A.geschenke); for (let i = 0; i < n; i++) { const p = D.geschenke[i]; rein({ art: 4, p: p }, p.x, p.y, p.z + p.h / 2); } }
    hinten.sort((a, b) => a.t - b.t); vorn.sort((a, b) => a.t - b.t);
    /* Lichterkette tagsüber: Kabel von Lämpchen zu Lämpchen je Ast */
    const kabel = new Map();
    if (A.lichter > 0 && (!lampenAn || nacht < 0.5)) for (const l of D.lampen) if (!l.tief && zeigBis(A.lichter, l.p[2])) { let e = kabel.get(l.a); if (!e) kabel.set(l.a, (e = [])); e.push(l); }

    const kugelR = (r) => Math.max(0.8, r * s);
    const lr = Math.max(0.5, 0.016 * s), hr = Math.max(3, 0.3 * s), H = hof(hr);
    const glut = new Map();
    /* hinten: bis s < 60 nur der dunkle Umriss (das Innere verdeckt fast alles) */
    const stufeHinten = s < 100 ? 0 : 1, stufeVorn = s < 22 ? 0 : s < 45 ? 1 : 2;
    const malDing = (d, vornDran) => {
      if (d.art === 0) {
        /* hinten, aber am Umriss sichtbar: dort genauso fein wie vorn */
        astStueck(g, V, d.a, d.t0, d.t1, st, offen, vornDran || d.cw > -0.3 ? stufeVorn : d.cw > -0.6 ? Math.min(1, stufeVorn) : stufeHinten);
        const kb = kabel.get(d.a);
        if (kb && d.t1 >= 1 && s > 20) {
          const pts = kb.slice().sort((a, b) => a.t - b.t).map((l) => { const q = lage(l); return V.p(q[0], q[1], q[2]); });
          g.strokeStyle = "rgba(24,30,20,0.85)"; g.lineWidth = Math.max(0.5, 0.008 * s); g.beginPath();
          const q0 = astP(d.a, 0.5, 0, offen), p0 = V.p(q0[0], q0[1], q0[2]); g.moveTo(p0[0], p0[1]);
          for (let i = 0; i < pts.length; i++) { const a = i ? pts[i - 1] : p0, b = pts[i]; g.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.05 * s, b[0], b[1]); }
          g.stroke();
        }
      } else if (d.art === 1) {
        const k = d.k, p = V.p(d.q[0], d.q[1], d.q[2]);
        kugelMalen(g, p[0], p[1], kugelR(k.r), k.farbe, lichtK(V.n(k.p[0], k.p[1], 0.3), Z, jahr), warmN, k.matt, k.zufall);
      } else if (d.art === 2) {
        const l = d.l, p = V.p(d.q[0], d.q[1], d.q[2]);
        if (lampenAn && nacht > 0) {
          g.globalCompositeOperation = "lighter";
          g.globalAlpha = Math.min(1, warmN * l.hell * (l.tief ? 0.6 : 1));
          g.drawImage(H, p[0] - H.width / 2, p[1] - H.height / 2);
          g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
          if (!l.tief && V.waag(l.p[0], l.p[1]) > -0.3) {
            const kx = Math.round(p[0] / (1.3 * s)), ky = Math.round(p[1] / (1.3 * s)), sk = kx + "," + ky;
            const e = glut.get(sk) || [0, 0, 0]; e[0] += p[0]; e[1] += p[1]; e[2]++; glut.set(sk, e);
          }
        } else if (s > 12) {
          /* aus: dunkle Fassung, darunter das klare Birnchen */
          const k = lichtK(V.n(l.p[0], l.p[1], 0.4), Z, jahr);
          g.fillStyle = rgb(mul([34, 44, 32], k)); g.fillRect(p[0] - lr * 0.7, p[1] - lr * 1.6, lr * 1.4, lr * 1.2);
          g.fillStyle = rgb(mul([236, 226, 196], k), 0.95); g.beginPath(); g.ellipse(p[0], p[1], lr * 0.75, lr, 0, 0, TAU); g.fill();
        }
      } else if (d.art === 3) {
        const k = d.k, p = V.p(d.q[0], d.q[1], d.q[2]);
        schleifeMalen(g, p[0], p[1], k.gr, s, mul([150, 14, 26], lichtK(V.n(k.a.ca, k.a.sa, 0.4), Z, jahr)));
      } else if (d.art === 4) paketMalen(g, V, d.p, Z, jahr, warmN);
    };
    for (const d of hinten) malDing(d, false);
    if (!V.gekippt) {
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
      /* ---- dunkles Inneres: nachts golden von innen ---- */
      const kI = lichtK(V.n(0.7, 0.7, 0.2), Z, jahr);
      const inner = mul([16, 36, 24], kI);
      const pts = [], links = [];
      const z0 = kr.zU + 0.05;
      for (let z = z0; z <= kr.H - 0.3; z += 0.14) {
        const r = kronenRadius(kr, z) * (0.6 - 0.28 * Math.max(0, 1 - (kr.H - z) / 2.6)) * offen * s;
        const zi = (z * 7.1) | 0;
        pts.push([r * (0.78 + 0.26 * ST.rausch(z * 3.1, 1, 9) + 0.14 * ST.hash2(zi, 1, 17)), -z * KZ * s]);
        links.push([-r * (0.78 + 0.26 * ST.rausch(z * 3.1, 7, 9) + 0.14 * ST.hash2(zi, 2, 17)), -z * KZ * s]);
      }
      links.reverse();
      const r0 = kronenRadius(kr, z0) * 0.6 * offen;
      const bogen = [];
      for (let i = 0; i <= 12; i++) { const ph = (135 - i * 15) * Math.PI / 180, a = r0 * Math.cos(ph), b = r0 * Math.sin(ph); bogen.push([(a - b) * KX * s, (a + b) * KY * s - z0 * KZ * s]); }
      vieleck(g, pts.concat(links, bogen));
      const mz = -(kr.zU + (kr.H - kr.zU) * 0.35) * KZ * s;
      if (s >= 30) {
        /* Seitenlicht: die Lichtseite des Nadelkegels heller, die andere
           Seite dunkler (Normalen in Weltrichtung: Bild-links/vorn/rechts) */
        const kLi = lichtK([-0.62, 0.62, 0.48], Z, jahr), kVo = lichtK([0.62, 0.62, 0.48], Z, jahr), kRe = lichtK([0.62, -0.62, 0.48], Z, jahr);
        const rB = kronenRadius(kr, kr.zU) * 0.6 * s, basis = [30, 62, 40];
        const gi = g.createLinearGradient(-rB, 0, rB, 0);
        gi.addColorStop(0, rgb(skal(mul(basis, kLi), 0.62))); gi.addColorStop(0.45, rgb(skal(mul(basis, kVo), 0.66))); gi.addColorStop(1, rgb(skal(mul(basis, kRe), 0.5)));
        g.fillStyle = gi; g.fill();
        if (st.muster) { g.fillStyle = st.muster; g.fill(); }
        /* Etagen: unter jedem Quirl liegt Schatten, darüber fängt der
           Kegel Licht – so liest sich das Innere als Nadelmasse */
        g.save(); g.clip();
        const quirle = [];
        for (const a of D.aeste) if (!a.zw && (!quirle.length || Math.abs(quirle[quirle.length - 1] - a.z) > 0.15)) quirle.push(a.z);
        for (const zq of quirle) {
          const y0 = -zq * KZ * s, hB = 0.3 * KZ * s;
          const gq = g.createLinearGradient(0, y0 - hB * 0.25, 0, y0 + hB);
          gq.addColorStop(0, "rgba(160,200,150,0.1)"); gq.addColorStop(0.25, "rgba(0,8,4,0.34)"); gq.addColorStop(1, "rgba(0,8,4,0)");
          g.fillStyle = gq; g.fillRect(-kr.R * s, y0 - hB * 0.25, 2 * kr.R * s, hB * 1.25);
        }
        g.restore();
      } else {
        const gi = g.createRadialGradient(0, mz, 0, 0, mz, (kr.H - kr.zU) * 0.6 * s);
        gi.addColorStop(0, rgb(inner)); gi.addColorStop(1, rgb(skal(inner, 0.8)));
        g.fillStyle = gi; g.fill();
      }
      if (warmN > 0) {
        vieleck(g, pts.concat(links, bogen));
        g.save(); g.clip();
        g.globalCompositeOperation = "lighter";
        const gw = g.createRadialGradient(0, mz, 0, 0, mz, (kr.H - kr.zU) * 0.55 * s);
        gw.addColorStop(0, "rgba(255,160,70," + (0.12 * warmN).toFixed(3) + ")"); gw.addColorStop(0.6, "rgba(230,140,50," + (0.05 * warmN).toFixed(3) + ")"); gw.addColorStop(1, "rgba(200,120,40,0)");
        g.fillStyle = gw; g.fillRect(-kr.R * s, -kr.H * KZ * s, 2 * kr.R * s, kr.H * KZ * s);
        g.restore();
      }
      const a = V.p(0, 0, kr.H - 1.2), b = V.p(0, 0, kr.H + 0.05);
      g.strokeStyle = rgb(mul([52, 86, 50], kI)); g.lineWidth = Math.max(0.8, s * 0.05);
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    } else if (!A.ohneStamm) {
      /* gekippt: Stamm als Walze, sichtbar unter dem eingenetzten Baum */
      const u = V.p(0, 0, 0), o = V.p(0, 0, kr.zU + 0.8);
      g.strokeStyle = rgb(mul([96, 74, 58], lichtK([0, 0.5, 0.8], Z, jahr))); g.lineWidth = Math.max(1, 0.34 * s); g.lineCap = "round";
      g.beginPath(); g.moveTo(u[0], u[1]); g.lineTo(o[0], o[1]); g.stroke();
    }
    for (const d of vorn) malDing(d, true);
    /* Netz um den gebundenen Baum (Anlieferung) */
    if (A.netz > 0) {
      g.strokeStyle = "rgba(220,220,210," + (0.55 * A.netz) + ")"; g.lineWidth = Math.max(0.5, s * 0.01);
      g.beginPath();
      for (let z = kr.zU; z < kr.H; z += 0.35) {
        const r = kronenRadius(kr, z) * offen * 0.9, r2 = kronenRadius(kr, z + 0.35) * offen * 0.9;
        const w = Math.atan2(V.sn, V.c) + Math.PI / 4;
        const a1 = V.p(-Math.cos(w) * r, Math.sin(w) * r, z), b1 = V.p(Math.cos(w) * r2, -Math.sin(w) * r2, z + 0.35);
        const a2 = V.p(Math.cos(w) * r, -Math.sin(w) * r, z), b2 = V.p(-Math.cos(w) * r2, Math.sin(w) * r2, z + 0.35);
        g.moveTo(a1[0], a1[1]); g.lineTo(b1[0], b1[1]); g.moveTo(a2[0], a2[1]); g.lineTo(b2[0], b2[1]);
      }
      g.stroke();
    }
    /* ---- Stern ---- */
    if (A.stern) sternMalen(g, V, kr.H + 0.55, 0.6, F, lampenAn ? Math.min(1, 1.3 * nacht) / Math.max(0.01, nacht) : 0.0001);
    /* ---- Lichtschein der Lämpchengruppen (die großen Lichter meldet bauen) ---- */
    if (lampenAn && nacht > 0 && F.leuchtPunkt) {
      for (const e of glut.values()) F.leuchtPunkt(e[0] / e[2], e[1] / e[2], 0.75 * s, "255,196,120", Math.min(0.32, 0.032 * e[2]), e[2] % 3 === 0);
    }
  }

  /* =====================================================================
     DER MAIBAUM (Frühling)
     Wie in Bayern und Franken: ein geschälter Fichtenstamm von 20 m,
     weiß-blau gewunden, mit Wipfel, zwei Kränzen, langen Bändern, einem
     Wimpel und den Zunftzeichen – ausgesägte, bemalte Figuren auf
     Auslegern, abwechselnd links und rechts. Er überragt das Dorf.
     ===================================================================== */
  const MB = { H: 20, rU: 0.22, rO: 0.12, kraenze: [{ z: 16.4, r: 0.78 }, { z: 13.9, r: 0.62 }] };
  const ZUNFT = ["Bäcker", "Brauer", "Zimmerer", "Schmied", "Metzger", "Feuerwehr", "Schreiner", "Landwirt", "Maurer", "Schneider"];
  function maibaumDaten(saat) {
    const rng = ST.zufall((saat | 0) * 131 + 7);
    const D = { schilder: [], baender: [], blumen: [] };
    const start = rng() * TAU;
    for (let i = 0; i < 8; i++) {
      const z = 4.6 + i * 1.08, az = start + (i % 2) * Math.PI + i * 0.3;
      D.schilder.push({ z: z, az: az, zunft: ZUNFT[(i + ((saat | 0) % 5)) % ZUNFT.length], i: i });
    }
    const BF = [[246, 246, 246], [30, 86, 170], [246, 246, 246], [30, 86, 170], [200, 30, 40], [240, 200, 40], [40, 130, 60]];
    for (let i = 0; i < 20; i++) D.baender.push({ az: i / 20 * TAU + rng() * 0.2, laenge: 2.2 + rng() * 1.3, farbe: BF[i % BF.length], wehen: rng() * TAU });
    const BL = [[228, 40, 50], [248, 210, 40], [246, 246, 240], [236, 110, 150], [150, 70, 170], [250, 150, 40]];
    for (let i = 0; i < 90; i++) {
      const a = rng() * TAU, r = 0.45 + Math.sqrt(rng()) * 0.8;
      D.blumen.push({ x: r * Math.cos(a), y: r * Math.sin(a), h: 0.16 + rng() * 0.18, farbe: BL[(rng() * BL.length) | 0], art: rng() < 0.6 ? 0 : 1, neig: (rng() - 0.5) * 0.3 });
    }
    return D;
  }
  /* Zunftzeichen als ausgesägte Figur (Flächenmeter, Kasten 0,9 × 0,7):
     farbig bemalt, mit dunkler Sägekante */
  function zunftFigur(g, zunft, L, px) {
    const C = (f, a) => rgb(mul(f, L), a);
    const kante = C([60, 40, 26]);
    g.lineJoin = "round"; g.lineCap = "round";
    const umriss = (fill, lw) => { g.fillStyle = fill; g.fill(); g.strokeStyle = kante; g.lineWidth = lw || 0.022; g.stroke(); };
    switch (zunft) {
      case "Bäcker": {
        g.beginPath(); g.moveTo(0.18, 0.5); g.bezierCurveTo(-0.05, 0.1, 0.45, -0.02, 0.47, 0.34); g.bezierCurveTo(0.49, 0.56, 0.3, 0.58, 0.36, 0.36); g.moveTo(0.72, 0.5); g.bezierCurveTo(0.95, 0.1, 0.45, -0.02, 0.43, 0.34); g.bezierCurveTo(0.41, 0.56, 0.6, 0.58, 0.54, 0.36);
        g.strokeStyle = kante; g.lineWidth = 0.14; g.stroke(); g.strokeStyle = C([176, 104, 44]); g.lineWidth = 0.1; g.stroke(); g.strokeStyle = C([214, 150, 80], 0.8); g.lineWidth = 0.03; g.stroke();
        if (px > 30) { g.fillStyle = C([250, 250, 244]); for (let i = 0; i < 12; i++) { g.fillRect(0.2 + (i * 0.43) % 0.5, 0.12 + (i * 0.27) % 0.3, 0.014, 0.014); } }
        break;
      }
      case "Brauer": {
        g.beginPath(); g.moveTo(0.22, 0.12); g.lineTo(0.6, 0.12); g.lineTo(0.58, 0.66); g.lineTo(0.24, 0.66); g.closePath(); umriss(C([222, 170, 60]));
        g.beginPath(); g.ellipse(0.41, 0.12, 0.22, 0.08, 0, 0, TAU); umriss(C([250, 248, 240]));
        g.beginPath(); g.arc(0.66, 0.38, 0.13, -1.2, 1.2); g.strokeStyle = kante; g.lineWidth = 0.07; g.stroke(); g.strokeStyle = C([200, 150, 50]); g.lineWidth = 0.045; g.stroke();
        g.fillStyle = C([255, 230, 150], 0.5); g.fillRect(0.28, 0.2, 0.05, 0.42);
        break;
      }
      case "Zimmerer": {
        g.beginPath(); g.moveTo(0.1, 0.4); g.lineTo(0.45, 0.06); g.lineTo(0.8, 0.4); g.lineTo(0.72, 0.4); g.lineTo(0.72, 0.68); g.lineTo(0.18, 0.68); g.lineTo(0.18, 0.4); g.closePath(); umriss(C([236, 226, 206]));
        g.strokeStyle = C([110, 60, 34]); g.lineWidth = 0.045;
        g.beginPath(); g.moveTo(0.18, 0.4); g.lineTo(0.72, 0.4); g.moveTo(0.45, 0.4); g.lineTo(0.45, 0.68); g.moveTo(0.18, 0.68); g.lineTo(0.45, 0.4); g.lineTo(0.72, 0.68); g.moveTo(0.45, 0.1); g.lineTo(0.45, 0.4); g.stroke();
        break;
      }
      case "Schmied": {
        g.beginPath(); g.arc(0.3, 0.3, 0.2, Math.PI * 0.75, Math.PI * 2.25); g.strokeStyle = kante; g.lineWidth = 0.12; g.stroke(); g.strokeStyle = C([150, 156, 164]); g.lineWidth = 0.08; g.stroke();
        g.beginPath(); g.moveTo(0.46, 0.46); g.lineTo(0.86, 0.46); g.lineTo(0.8, 0.54); g.lineTo(0.72, 0.54); g.lineTo(0.72, 0.68); g.lineTo(0.56, 0.68); g.lineTo(0.56, 0.54); g.lineTo(0.5, 0.54); g.closePath(); umriss(C([56, 58, 62]));
        break;
      }
      case "Metzger": {
        g.beginPath(); g.ellipse(0.42, 0.42, 0.28, 0.17, 0, 0, TAU); g.moveTo(0.78, 0.36); g.arc(0.72, 0.38, 0.12, 0, TAU); umriss(C([236, 170, 170]));
        g.beginPath(); for (const x of [0.24, 0.34, 0.52, 0.62]) { g.rect(x, 0.54, 0.05, 0.14); } umriss(C([226, 158, 160]), 0.012);
        g.fillStyle = kante; g.beginPath(); g.arc(0.76, 0.34, 0.015, 0, TAU); g.fill(); g.fillStyle = C([210, 130, 130]); g.beginPath(); g.ellipse(0.83, 0.41, 0.04, 0.03, 0, 0, TAU); g.fill();
        g.strokeStyle = C([200, 120, 120]); g.lineWidth = 0.02; g.beginPath(); g.moveTo(0.14, 0.38); g.bezierCurveTo(0.06, 0.3, 0.12, 0.26, 0.1, 0.34); g.stroke();
        break;
      }
      case "Feuerwehr": {
        g.beginPath(); g.moveTo(0.14, 0.5); g.bezierCurveTo(0.14, 0.12, 0.76, 0.12, 0.76, 0.5); g.lineTo(0.84, 0.54); g.lineTo(0.06, 0.54); g.closePath(); umriss(C([190, 30, 34]));
        g.fillStyle = C([230, 190, 70]); g.fillRect(0.42, 0.18, 0.06, 0.34); g.fillRect(0.14, 0.46, 0.62, 0.04);
        g.strokeStyle = C([160, 110, 60]); g.lineWidth = 0.03; g.beginPath(); g.moveTo(0.2, 0.68); g.lineTo(0.7, 0.58); g.moveTo(0.2, 0.62); g.lineTo(0.7, 0.52); for (let k = 0; k < 6; k++) { const x = 0.24 + k * 0.08; g.moveTo(x, 0.67 - k * 0.016); g.lineTo(x, 0.61 - k * 0.016); } g.stroke();
        break;
      }
      case "Schreiner": {
        g.beginPath(); g.moveTo(0.08, 0.5); g.lineTo(0.62, 0.5); g.lineTo(0.62, 0.6); g.lineTo(0.08, 0.6); g.closePath(); umriss(C([176, 120, 64]));
        g.beginPath(); g.moveTo(0.24, 0.5); g.lineTo(0.24, 0.38); g.bezierCurveTo(0.24, 0.3, 0.36, 0.3, 0.38, 0.38); g.lineTo(0.38, 0.5); umriss(C([120, 70, 36]));
        g.beginPath(); g.moveTo(0.5, 0.12); g.lineTo(0.86, 0.46); g.lineTo(0.8, 0.5); g.lineTo(0.44, 0.18); g.closePath(); umriss(C([180, 186, 196]));
        break;
      }
      case "Landwirt": {
        g.beginPath(); g.ellipse(0.42, 0.4, 0.28, 0.16, 0, 0, TAU); g.moveTo(0.84, 0.3); g.ellipse(0.74, 0.3, 0.1, 0.08, 0.3, 0, TAU); umriss(C([246, 244, 238]));
        g.fillStyle = C([30, 30, 32]); g.beginPath(); g.ellipse(0.34, 0.36, 0.1, 0.07, 0.4, 0, TAU); g.fill(); g.beginPath(); g.ellipse(0.52, 0.46, 0.07, 0.05, 0, 0, TAU); g.fill();
        g.beginPath(); for (const x of [0.2, 0.3, 0.52, 0.62]) g.rect(x, 0.52, 0.05, 0.15); umriss(C([240, 238, 232]), 0.012);
        g.strokeStyle = C([220, 200, 160]); g.lineWidth = 0.02; g.beginPath(); g.moveTo(0.7, 0.23); g.lineTo(0.66, 0.16); g.moveTo(0.78, 0.23); g.lineTo(0.82, 0.16); g.stroke();
        break;
      }
      case "Maurer": {
        for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) { g.beginPath(); g.rect(0.1 + k * 0.16 + (r % 2) * 0.08, 0.42 + r * 0.09, 0.15, 0.08); umriss(C([184, 84, 52]), 0.012); }
        g.beginPath(); g.moveTo(0.5, 0.1); g.lineTo(0.78, 0.26); g.lineTo(0.56, 0.36); g.closePath(); umriss(C([176, 182, 190]));
        g.strokeStyle = kante; g.lineWidth = 0.05; g.beginPath(); g.moveTo(0.52, 0.2); g.lineTo(0.38, 0.12); g.stroke();
        break;
      }
      default: {
        g.beginPath(); g.arc(0.3, 0.52, 0.09, 0, TAU); g.moveTo(0.63, 0.52); g.arc(0.54, 0.52, 0.09, 0, TAU); g.strokeStyle = kante; g.lineWidth = 0.06; g.stroke(); g.strokeStyle = C([190, 196, 204]); g.lineWidth = 0.035; g.stroke();
        g.beginPath(); g.moveTo(0.36, 0.45); g.lineTo(0.7, 0.08); g.moveTo(0.48, 0.45); g.lineTo(0.14, 0.08); g.strokeStyle = kante; g.lineWidth = 0.06; g.stroke(); g.strokeStyle = C([190, 196, 204]); g.lineWidth = 0.035; g.stroke();
      }
    }
  }
  /* Weiß-blau gewundener Stamm: die blauen Bänder als durchgehende
     Flächen – je Bildzeile das sichtbare Stück jedes Bands (exakt aus der
     Schraubenlinie), alle Zeilen in EINEM Pfad → glatte, schräge Kanten */
  function stammMalen(g, V, zA, zE, rA, rE, F, streifen) {
    const s = V.s, Z = F.Z, jahr = F.jahr;
    const u0 = V.p(0, 0, zA), u1 = V.p(0, 0, zE);
    const pts = [[u0[0] - rA * s, u0[1]], [u1[0] - rE * s, u1[1]], [u1[0] + rE * s, u1[1]], [u0[0] + rA * s, u0[1]]];
    g.save();
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); g.lineTo(pts[1][0], pts[1][1]); g.lineTo(pts[2][0], pts[2][1]); g.lineTo(pts[3][0], pts[3][1]);
    g.ellipse(u0[0], u0[1], rA * s, rA * s * 0.5, 0, 0, Math.PI); g.closePath();
    g.clip();
    g.fillStyle = "#f4f2ec"; g.fillRect(pts[0][0] - 2, pts[1][1] - 2, (rA * 2) * s + 4, pts[0][1] - pts[1][1] + rA * s + 4);
    if (streifen) {
      const kamW = Math.atan2(V.sn, V.c), steig = 1.6;
      const dz = Math.max(0.01, 1.2 / s);
      g.beginPath();
      let vorher = null;
      for (let z = zA; z <= zE + dz; z += dz) {
        const zz = Math.min(z, zE), r = (rA + (rE - rA) * (zz - zA) / (zE - zA)) * s, y = u0[1] + (u1[1] - u0[1]) * (zz - zA) / (zE - zA);
        /* Phase am linken Rand der sichtbaren Hälfte; blau, wo frac ∈ [0,5; 1) */
        const u = ((-Math.PI / 2 - Math.PI / 4 - kamW) / TAU + zz / steig) % 1, f0 = (u + 1) % 1;
        let wa, wb;
        if (f0 < 0.5) { wa = -Math.PI / 2 + (0.5 - f0) * TAU; wb = Math.PI / 2; } else { wa = -Math.PI / 2; wb = -Math.PI / 2 + (1 - f0) * TAU; }
        const xa = Math.sin(Math.max(-Math.PI / 2, Math.min(Math.PI / 2, wa))) * r, xb = Math.sin(Math.max(-Math.PI / 2, Math.min(Math.PI / 2, wb))) * r;
        if (vorher) { g.moveTo(u0[0] + vorher[0], vorher[2]); g.lineTo(u0[0] + vorher[1], vorher[2]); g.lineTo(u0[0] + xb, y); g.lineTo(u0[0] + xa, y); g.closePath(); }
        vorher = [xa, xb, y];
      }
      g.fillStyle = "#2a62b0"; g.fill();
    }
    /* Zylinderlicht (multiply, nur im Stamm) */
    const gr = g.createLinearGradient(-rA * s + u0[0], 0, rA * s + u0[0], 0);
    for (let i = 0; i <= 8; i++) {
      const w = -Math.PI / 2 + Math.PI * i / 8;
      const n = [(Math.sin(w) * Math.SQRT1_2 + Math.cos(w) * Math.SQRT1_2), (-Math.sin(w) * Math.SQRT1_2 + Math.cos(w) * Math.SQRT1_2), 0];
      gr.addColorStop((Math.sin(w) + 1) / 2, rgb(skal(lichtK(n, Z, jahr), 255)));
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
      if (A.kranz) for (const K of MB.kraenze) for (let i = 0; i < 16; i++) {
        const w = i / 16 * TAU, q = V.boden(Math.cos(w) * K.r, Math.sin(w) * K.r, K.z), r = 0.1 * s;
        dazu(g, [[q[0] - r, q[1] - r * 0.6], [q[0] + r, q[1] - r * 0.6], [q[0] + r, q[1] + r * 0.6], [q[0] - r, q[1] + r * 0.6]]);
      }
      for (const S of D.schilder.slice(0, Math.round(D.schilder.length * A.schilder))) {
        const ax = Math.cos(S.az), ay = Math.sin(S.az);
        dazu(g, [V.boden(ax * 0.2, ay * 0.2, S.z + 0.72), V.boden(ax * 1.2, ay * 1.2, S.z + 0.72), V.boden(ax * 1.2, ay * 1.2, S.z), V.boden(ax * 0.2, ay * 0.2, S.z)]);
      }
      if (A.zaun) zaunSchatten(g, V, A.zaun);
      g.fill();
      return;
    }
    const liste = [];
    if (A.kranz) for (const B of D.baender) {
      const K = MB.kraenze[0], x = Math.cos(B.az) * K.r, y = Math.sin(B.az) * K.r;
      liste.push({ art: 1, b: B, t: V.tiefe(x, y, K.z - 1), h: V.waag(x, y) });
    }
    const nS = Math.round(D.schilder.length * A.schilder);
    for (let i = 0; i < nS; i++) {
      const S = D.schilder[i], x = Math.cos(S.az) * 0.7, y = Math.sin(S.az) * 0.7;
      liste.push({ art: 2, sch: S, t: V.tiefe(x, y, S.z), h: V.waag(x, y) });
    }
    const hinten = liste.filter((d) => d.h < 0).sort((a, b) => a.t - b.t), vorn = liste.filter((d) => d.h >= 0).sort((a, b) => a.t - b.t);
    const malDing = (d) => {
      if (d.art === 1) {
        const B = d.b, K = MB.kraenze[0], x = Math.cos(B.az) * K.r, y = Math.sin(B.az) * K.r;
        const k = lichtK(V.n(Math.cos(B.az), Math.sin(B.az), 0.1), Z, jahr);
        g.strokeStyle = rgb(mul(B.farbe, k)); g.lineWidth = Math.max(0.7, 0.07 * s); g.lineCap = "butt";
        g.beginPath();
        for (let i = 0; i <= 12; i++) {
          const u = i / 12, zz = K.z - 0.05 - u * B.laenge, sw = Math.sin(u * 5 + B.wehen) * 0.14 * u;
          const p = V.p(x + Math.cos(B.az + 1.5) * sw, y + Math.sin(B.az + 1.5) * sw, zz);
          if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]);
        }
        g.stroke();
      } else {
        const S = d.sch, ax = Math.cos(S.az), ay = Math.sin(S.az);
        const kA = lichtK(V.n(0, 0, 1), Z, jahr);
        /* Ausleger: weiß-blau, mit Strebe zum Stamm */
        const a = V.p(ax * 0.12, ay * 0.12, S.z), b = V.p(ax * 1.25, ay * 1.25, S.z), c = V.p(ax * 0.12, ay * 0.12, S.z - 0.45);
        g.lineCap = "butt"; g.lineWidth = Math.max(0.8, 0.07 * s);
        for (let k = 0; k < 6; k++) { const u0 = k / 6, u1 = (k + 1) / 6; g.strokeStyle = rgb(mul(k % 2 ? [42, 98, 176] : [240, 240, 236], kA)); g.beginPath(); g.moveTo(a[0] + (b[0] - a[0]) * u0, a[1] + (b[1] - a[1]) * u0); g.lineTo(a[0] + (b[0] - a[0]) * u1, a[1] + (b[1] - a[1]) * u1); g.stroke(); }
        const m = V.p(ax * 0.7, ay * 0.7, S.z); g.strokeStyle = rgb(mul([120, 86, 56], kA)); g.lineWidth = Math.max(0.6, 0.035 * s); g.beginPath(); g.moveTo(c[0], c[1]); g.lineTo(m[0], m[1]); g.stroke();
        /* Figur auf dem Ausleger: die zur Kamera gewandte Seite */
        let eu = [ax, ay, 0], o = [ax * 0.3, ay * 0.3, S.z + 0.72];
        if (sicht3(V, [-ay, ax, 0]) < 0) { eu = [-ax, -ay, 0]; o = [ax * 1.2, ay * 1.2, S.z + 0.72]; }
        const k = lichtK(V.n(-eu[1], eu[0], 0), Z, jahr);
        g.save(); affin(g, V, o, eu, [0, 0, -1]);
        zunftFigur(g, S.zunft, k, s);
        if (s > 45) { g.fillStyle = rgb(mul([240, 236, 226], k)); g.fillRect(0.22, 0.73, 0.46, 0.1); g.fillStyle = rgb(mul([35, 60, 110], k)); g.font = "bold 0.07px Georgia, serif"; g.textAlign = "center"; g.fillText(S.zunft, 0.45, 0.805); }
        g.restore();
      }
    };
    for (const d of hinten) malDing(d);
    const kranz = (K, vornTeil) => {
      if (!A.kranz) return;
      const n = Math.max(28, Math.round(K.r * s * 1.8)), rr = ST.zufall(K.z * 10 | 0);
      const kU = lichtK([0, 0.3, 0.95], Z, jahr);
      for (let i = 0; i < n; i++) {
        const w = i / n * TAU, x = Math.cos(w) * K.r, y = Math.sin(w) * K.r;
        const r1 = rr(), r2 = rr(), r3 = rr();
        if ((V.waag(x, y) >= 0) !== vornTeil) continue;
        const p = V.p(x, y, K.z + (r1 - 0.5) * 0.06);
        const kk = lichtK(V.n(Math.cos(w), Math.sin(w), 0.6), Z, jahr);
        g.fillStyle = rgb(mul([40 + r2 * 20, 84 + r3 * 24, 46], kk));
        g.beginPath(); g.ellipse(p[0], p[1], Math.max(1, 0.1 * s), Math.max(0.8, 0.07 * s), r1 * 3, 0, TAU); g.fill();
        if (s > 26) { g.strokeStyle = rgb(mul([70, 120, 60], kk), 0.8); g.lineWidth = Math.max(0.5, 0.008 * s); g.beginPath(); g.moveTo(p[0] - 0.07 * s, p[1]); g.lineTo(p[0] + 0.07 * s, p[1] - 0.02 * s); g.stroke(); }
        if (i % 4 === 0 && s > 20) { g.fillStyle = rgb(mul(i % 8 ? [246, 246, 246] : [40, 90, 180], kU)); g.beginPath(); g.arc(p[0], p[1] - 0.04 * s, Math.max(0.6, 0.035 * s), 0, TAU); g.fill(); }
      }
    };
    for (const K of MB.kraenze) kranz(K, false);
    stammMalen(g, V, 0, H, MB.rU, MB.rO, F, true);
    if (A.hoch >= 1 && W) tanneMalen(g, s, F, W, { offen: 1, hoehe: 1, kugeln: 0, lichter: 0, geschenke: 0, stern: false, leuchten: false, netz: 0, ohneStamm: true });
    for (const K of MB.kraenze) kranz(K, true);
    for (const d of vorn) malDing(d);
    /* Wimpel unter dem Wipfel: lang, weiß-blau, im Wind */
    if (A.kranz) {
      const kW = lichtK(V.n(0.3, 0.8, 0.2), Z, jahr), z0 = MB.H - 0.6, dir = [Math.cos(0.9), Math.sin(0.9)];
      const pt = (u, seite) => { const w = Math.sin(u * 7 + 0.5) * 0.22 * u, b = 0.28 * (1 - u) * seite; return V.p(dir[0] * (0.15 + u * 2.6) - dir[1] * w, dir[1] * (0.15 + u * 2.6) + dir[0] * w, z0 - b - u * 0.5); };
      for (const [f, s0, s1] of [[[246, 246, 244], 1, 0], [[42, 98, 176], 0, -1]]) {
        g.beginPath(); for (let i = 0; i <= 16; i++) { const p = pt(i / 16, s0); if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); } for (let i = 16; i >= 0; i--) { const p = pt(i / 16, s1); g.lineTo(p[0], p[1]); } g.closePath();
        g.fillStyle = rgb(mul(f, kW)); g.fill();
      }
      const a = V.p(0, 0, z0 + 0.02), b = V.p(dir[0] * 0.2, dir[1] * 0.2, z0 + 0.02); g.strokeStyle = rgb(mul([120, 90, 60], kW)); g.lineWidth = Math.max(0.6, 0.03 * s); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    }
  }
  function sicht3(V, n) { const q = V.n(n[0], n[1], n[2]); return q[0] * AUGE[0] + q[1] * AUGE[1] + q[2] * AUGE[2]; }
  /* Tulpen und Narzissen im Beet innerhalb der Einfassung (nach Tiefe) */
  function blumenMalen(g, V, D, F, anteil, zBeet) {
    const Z = F.Z, jahr = F.jahr, s = V.s;
    const n = Math.round(D.blumen.length * anteil);
    const l = D.blumen.slice(0, n).map((b) => ({ b: b, t: V.tiefe(b.x, b.y, 0) })).sort((a, b) => a.t - b.t);
    const kS = lichtK([0, 0.5, 0.85], Z, jahr), kB = lichtK(V.n(-0.3, 0.6, 0.7), Z, jahr);
    for (const e of l) {
      const b = e.b, f = V.p(b.x, b.y, zBeet), k = V.p(b.x + b.neig * b.h, b.y, zBeet + b.h);
      g.strokeStyle = rgb(mul([62, 118, 50], kS)); g.lineWidth = Math.max(0.6, 0.014 * s);
      g.beginPath(); g.moveTo(f[0], f[1]); g.lineTo(k[0], k[1]); g.stroke();
      g.fillStyle = rgb(mul([70, 130, 58], kS));
      g.beginPath(); g.ellipse(f[0] + 0.025 * s, f[1] - 0.05 * s, Math.max(0.7, 0.025 * s), Math.max(1, 0.08 * s), 0.3, 0, TAU); g.fill();
      const r = Math.max(0.8, 0.04 * s);
      const gr = g.createLinearGradient(k[0] - r, 0, k[0] + r, 0);
      if (b.art === 0) {
        gr.addColorStop(0, rgb(mul(misch(b.farbe, [255, 255, 255], 0.25), kB))); gr.addColorStop(1, rgb(mul(skal(b.farbe, 0.72), kB)));
        g.fillStyle = gr;
        g.beginPath(); g.moveTo(k[0] - r, k[1] - r * 1.4); g.quadraticCurveTo(k[0] - r * 1.1, k[1] + r * 0.4, k[0], k[1] + r * 0.3); g.quadraticCurveTo(k[0] + r * 1.1, k[1] + r * 0.4, k[0] + r, k[1] - r * 1.4); g.lineTo(k[0] + r * 0.3, k[1] - r * 0.9); g.lineTo(k[0], k[1] - r * 1.5); g.lineTo(k[0] - r * 0.3, k[1] - r * 0.9); g.closePath(); g.fill();
      } else {
        g.fillStyle = rgb(mul(b.farbe[0] > 240 && b.farbe[1] > 240 ? [250, 246, 220] : [250, 226, 90], kB));
        g.beginPath(); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, rr = i % 2 ? r * 0.5 : r * 1.05; g.lineTo(k[0] + Math.cos(a) * rr, k[1] - r * 0.3 + Math.sin(a) * rr * 0.65); } g.closePath(); g.fill();
        g.fillStyle = rgb(mul([240, 150, 30], kB)); g.beginPath(); g.arc(k[0], k[1] - r * 0.3, r * 0.38, 0, TAU); g.fill();
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
    }
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
     FRÜHLING: kein Zaun – eine niedrige Sandstein-Einfassung mit
     Blumenbeet um den Maibaumständer, zwei Bänke, vier Blumenkübel
     ===================================================================== */
  const ER = 1.5, EB = 0.26, EH = 0.3;
  function eck8(r, k) { const a = (k + 0.5) * Math.PI / 4; return [r * Math.cos(a), r * Math.sin(a)]; }
  function sandsteinFlaeche(saat) {
    return gebacken(function (g, F) {
      const rng = ST.zufall(saat), basis = [184, 132, 102];
      g.fillStyle = rgb(skal(basis, 0.62)); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      let x = -rng() * 0.3;
      while (x < F.w) { const lw = 0.4 + rng() * 0.5, c = skal(basis, 0.88 + rng() * 0.2); const gr = g.createLinearGradient(0, 0, 0, F.h); gr.addColorStop(0, rgb(skal(c, 1.1))); gr.addColorStop(0.25, rgb(c)); gr.addColorStop(1, rgb(skal(c, 0.86))); g.fillStyle = gr; g.fillRect(Math.max(0, x) + 0.008, 0.008, Math.min(F.w, x + lw) - Math.max(0, x) - 0.016, F.h - 0.016); x += lw; }
      if (F.px > 14) PI.rauschen(g, 0, 0, F.w, F.h, 0.9, 0.3, saat % 40, 3);
    });
  }
  function einfassungBauen(M, saat) {
    M.teil("einfassung", { ebene: 0 });
    for (let k = 0; k < 8; k++) {
      const a = eck8(ER, k), b = eck8(ER, k + 1), ai = eck8(ER - EB, k), bi = eck8(ER - EB, k + 1);
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(a[0] - b[0]) / L, (a[1] - b[1]) / L, 0];
      M.flaeche({ name: "einf-aussen" + k, o: [b[0], b[1], EH], u: u, v: [0, 0, -1], w: L, h: EH, malen: sandsteinFlaeche(saat + k), ao: true });
      const Li = Math.hypot(bi[0] - ai[0], bi[1] - ai[1]), ui = [(bi[0] - ai[0]) / Li, (bi[1] - ai[1]) / Li, 0];
      M.flaeche({ name: "einf-innen" + k, o: [ai[0], ai[1], EH], u: ui, v: [0, 0, -1], w: Li, h: EH - 0.2, malen: sandsteinFlaeche(saat + 20 + k) });
      const ox = Math.min(a[0], b[0], ai[0], bi[0]), oy = Math.min(a[1], b[1], ai[1], bi[1]);
      const w = Math.max(a[0], b[0], ai[0], bi[0]) - ox, h = Math.max(a[1], b[1], ai[1], bi[1]) - oy;
      M.flaeche({ name: "einf-oben" + k, o: [ox, oy, EH], u: [1, 0, 0], v: [0, 1, 0], w: w, h: h, umriss: [a, b, bi, ai].map((q) => [q[0] - ox, q[1] - oy]), malen: gebacken(function (g, F) { g.fillStyle = "rgb(202,156,124)"; g.fillRect(0, 0, F.w, F.h); PI.rauschen(g, 0, 0, F.w, F.h, 0.6, 0.35, 40 + k, 3); g.fillStyle = "rgba(90,60,40,0.35)"; g.fillRect(0, 0, 0.015, F.h); }) });
    }
    /* Erde im Beet */
    const um = []; const R = ER - EB + 0.02; for (let k = 0; k < 8; k++) { const p = eck8(R, k); um.push([p[0] + R, p[1] + R]); }
    M.teil("beet", { ebene: -1, schatten: false });
    M.flaeche({ name: "beet", o: [-R, -R, 0.2], u: [1, 0, 0], v: [0, 1, 0], w: 2 * R, h: 2 * R, umriss: um, malen: gebacken(function (g, F) {
      const rng = ST.zufall(saat + 7);
      g.fillStyle = "#4a3526"; g.fillRect(0, 0, F.w, F.h);
      PI.rauschen(g, 0, 0, F.w, F.h, 0.5, 0.45, 12, 4);
      const n = F.px > 20 ? 500 : 120;
      for (let i = 0; i < n; i++) { const x = rng() * F.w, y = rng() * F.h, r = 0.008 + rng() * 0.02; g.fillStyle = rgb([70 + rng() * 40, 52 + rng() * 26, 36 + rng() * 18]); g.beginPath(); g.ellipse(x, y, r, r * 0.7, rng() * 3, 0, TAU); g.fill(); }
      g.fillStyle = "rgba(20,12,8,0.35)"; for (let i = 0; i < n * 0.3; i++) { g.beginPath(); g.arc(rng() * F.w, rng() * F.h, 0.012, 0, TAU); g.fill(); }
      /* Rand im Schatten der Einfassung */
      const gr = g.createRadialGradient(R, R, R * 0.6, R, R, R); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(10,6,4,0.45)"); g.fillStyle = gr; g.fillRect(0, 0, F.w, F.h);
    }) });
  }
  /* Parkbank aus Latten auf gusseisernen Füßen (Lehne nach außen) */
  function bankBauen(M, y, sd, name) {
    M.teil(name, { ebene: 0 });
    const holzL = gebacken(function (g, F) { holz(g, F.w, F.h, [150, 104, 62], F, 7); });
    const eisen = "#2c2e30";
    for (const x of [-0.7, 0.62]) {
      M.quader({ x: x, y: y - 0.22, z: 0, b: 0.08, t: 0.44, h: 0.42 }, { sued: eisen, nord: eisen, ost: eisen, west: eisen });
      M.quader({ x: x, y: sd > 0 ? y + 0.18 : y - 0.26, z: 0.42, b: 0.08, t: 0.08, h: 0.45 }, { sued: eisen, nord: eisen, ost: eisen, west: eisen });
    }
    for (let i = 0; i < 4; i++) M.quader({ x: -0.8, y: y - 0.2 + i * 0.105, z: 0.42, b: 1.6, t: 0.09, h: 0.035 }, { sued: holzL, nord: holzL, ost: holzL, west: holzL, oben: holzL });
    for (let i = 0; i < 3; i++) M.quader({ x: -0.8, y: sd > 0 ? y + 0.2 : y - 0.28, z: 0.55 + i * 0.12, b: 1.6, t: 0.035, h: 0.09 }, { sued: holzL, nord: holzL, ost: holzL, west: holzL, oben: holzL });
  }
  /* Terrakotta-Kübel mit Tulpen und Vergissmeinnicht (Figur) */
  function kuebelMalen(g, s, F, farbe) {
    if (F.schatten) { g.fillStyle = "#000"; g.beginPath(); g.ellipse(0, -0.35 * s, 0.3 * s, 0.35 * s, 0, 0, TAU); g.fill(); return; }
    const k = lichtK([-0.3, 0.6, 0.7], F.Z, F.jahr), m = s, H = 0.45 * KZ * m;
    const gr = g.createLinearGradient(-0.3 * m, 0, 0.3 * m, 0);
    gr.addColorStop(0, rgb(mul([206, 118, 76], skal(k, 1.08)))); gr.addColorStop(0.45, rgb(mul([186, 100, 62], k))); gr.addColorStop(1, rgb(mul([130, 66, 40], skal(k, 0.8))));
    g.fillStyle = gr; g.beginPath(); g.moveTo(-0.22 * m, 0); g.lineTo(-0.28 * m, -H); g.lineTo(0.28 * m, -H); g.lineTo(0.22 * m, 0); g.ellipse(0, 0, 0.22 * m, 0.11 * m, 0, 0, Math.PI); g.fill();
    g.fillStyle = rgb(mul([214, 128, 86], k)); g.beginPath(); g.ellipse(0, -H, 0.3 * m, 0.15 * m, 0, 0, TAU); g.fill();
    g.fillStyle = rgb(mul([70, 50, 36], k)); g.beginPath(); g.ellipse(0, -H, 0.26 * m, 0.12 * m, 0, 0, TAU); g.fill();
    const rng = ST.zufall(farbe[0] * 3 + farbe[2]);
    for (let i = 0; i < 26; i++) { const a = rng() * TAU, r = rng() * 0.24 * m, x = Math.cos(a) * r, y = -H + Math.sin(a) * r * 0.45 - rng() * 0.08 * m; g.fillStyle = rgb(mul([60 + rng() * 26, 116 + rng() * 26, 50], k)); g.beginPath(); g.ellipse(x, y, Math.max(0.8, 0.05 * m), Math.max(0.6, 0.022 * m), a, 0, TAU); g.fill(); }
    for (let i = 0; i < 30; i++) { const a = rng() * TAU, r = rng() * 0.22 * m; g.fillStyle = rgb(mul([120, 150, 230], k)); g.beginPath(); g.arc(Math.cos(a) * r, -H + Math.sin(a) * r * 0.45 - 0.05 * m, Math.max(0.5, 0.012 * m), 0, TAU); g.fill(); }
    for (let i = 0; i < 9; i++) {
      const a = rng() * TAU, r = rng() * 0.16 * m, x = Math.cos(a) * r, y0 = -H + Math.sin(a) * r * 0.45, h = (0.25 + rng() * 0.12) * KZ * m;
      g.strokeStyle = rgb(mul([70, 120, 50], k)); g.lineWidth = Math.max(0.6, 0.012 * m); g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y0 - h); g.stroke();
      const rr = Math.max(0.9, 0.035 * m), gt = g.createLinearGradient(x - rr, 0, x + rr, 0); gt.addColorStop(0, rgb(mul(misch(farbe, [255, 255, 255], 0.25), k))); gt.addColorStop(1, rgb(mul(skal(farbe, 0.7), k)));
      g.fillStyle = gt; g.beginPath(); g.moveTo(x - rr, y0 - h - rr * 1.3); g.quadraticCurveTo(x - rr * 1.1, y0 - h + rr * 0.4, x, y0 - h + rr * 0.3); g.quadraticCurveTo(x + rr * 1.1, y0 - h + rr * 0.4, x + rr, y0 - h - rr * 1.3); g.lineTo(x, y0 - h - rr * 0.9); g.closePath(); g.fill();
    }
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  const KRONE = { zU: 1.35, H: 12, R: 3.0 };
  const WIPFEL = { zU: MB.H - 0.25, H: MB.H + 1.8, R: 0.72 };

  ST.modell("weihnachtsbaum", {
    /* Im Baumenü: im Frühling steht hier der Maibaum */
    get name() { return ST.szene && ST.szene.jahr && ST.szene.jahr !== "winter" ? "Maibaum" : "Christbaum"; },
    gruppe: "Weihnachten", grund: [7.4, 7.4], hoehe: 21.8, bauzeit: 4 * 60,
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
      /* ---- 3. Zaun (Winter) bzw. Einfassung, Bänke, Kübel (Frühling) ---- */
      const plan = winter ? zaunPlan(phase(bau, 0.42, 0.5), phase(bau, 0.48, 0.56)) : null;
      if (winter) {
        if (bau >= 0.52) bodenBauen(M, o);
        zaunBauen(M, o, plan, phase(bau, 0.86, 0.94) >= 1 ? 1 : 0);
      } else if (bau >= 0.45) {
        einfassungBauen(M, saat);
        if (bau >= 0.8) {
          bankBauen(M, 2.75, 1, "bank-sued"); bankBauen(M, -2.75, -1, "bank-nord");
          const TF = [[220, 40, 60], [250, 200, 40], [240, 110, 160], [150, 80, 200]];
          for (let k = 0; k < 4; k++) {
            const a = (k * 2 + 1) * Math.PI / 4, r = 3.05;
            M.teil("kuebel" + k, { ebene: 0 });
            M.figur({ x: Math.cos(a) * r, y: Math.sin(a) * r, z: 0, breite: 0.8, hoehe: 0.9, malen: function (g, s, F) { kuebelMalen(g, s, F, TF[(k + saat) % 4]); } });
          }
        }
      }
      if (bau < 0.16) return;
      /* Unsichtbare Hilfsfläche an der Spitze: die Bildgrenzen nehmen so den
         langen Schatten mit auf (Figurenschatten zählt der Kern nicht) */
      M.teil("schattenhilfe", { mitte: [0, 0, 0] });
      M.flaeche({ name: "hilfe", o: [-0.02, -0.02, winter ? 13.2 : MB.H + 1.9], u: [1, 0, 0], v: [0, 1, 0], w: 0.04, h: 0.04, malen: function () {}, keinLicht: true });
      if (winter) {
        const D = baumDaten(saat, KRONE);
        /* Anlieferung (0,16 … 0,27): der eingenetzte Baum liegt schräg am
           Kranhaken und wird aufgerichtet, dann in die Hülse gesetzt */
        const pk = phase(bau, 0.16, 0.27), glatt = pk * pk * (3 - 2 * pk);
        const kipp = bau < 0.27 ? (1 - glatt) * 1.35 : 0, hub = bau < 0.27 ? 0.35 * Math.sin(Math.PI * glatt) + (1 - glatt) * 0.6 : 0;
        const A = {
          offen: 0.3 + 0.7 * phase(bau, 0.27, 0.42), hoehe: 1, netz: 1 - phase(bau, 0.25, 0.3), kipp: kipp, hub: hub,
          lichter: phase(bau, 0.56, 0.72), kugeln: phase(bau, 0.72, 0.88), geschenke: phase(bau, 0.9, 0.99),
          stern: bau >= 0.66, leuchten: bau >= 0.98, zaun: plan
        };
        M.teil("baum", { mitte: [0, 0, 0] });
        const liegt = kipp > 0.05;
        M.figur({ x: 0, y: 0, z: 0, breite: liegt ? 26 : 5.6, hoehe: 13.6, malen: mitGier(function (g, s, F) {
          if (F.schatten || liegt) return tanneMalen(g, s, F, D, A);
          aufCpu(g, -3.9 * s, -13.4 * KZ * s, 7.8 * s, 13.4 * KZ * s + 2.4 * s, function (cg) { tanneMalen(cg, s, F, D, A); });
        }) });
        if (A.leuchten) {
          /* Der Baum als Lichtquelle: warmes Licht auf den Platz und in der
             Krone (die Szene addiert es; der Baum ist rundum gleich) */
          M.bodenlicht(0, 0, 6.5, "255,190,110", 0.8);
          M.licht(0, 0, 3, 2.6, "255,186,104", 0.2);
          M.licht(0, 0, 6, 2.0, "255,190,110", 0.18);
          M.licht(0, 0, 9, 1.4, "255,196,120", 0.16);
          /* Funkeln: einzelne Lämpchen blitzen kurz als weicher Stern auf */
          const fun = D.lampen.filter((l, i) => i % 4 === 1 && !l.tief);
          M.lebendig(function (g, P) {
            if (!P.Z || P.Z.nacht < 0.1) return;
            const a0 = Math.min(1, P.Z.nacht * 1.3);
            g.save(); g.globalCompositeOperation = "lighter";
            for (const l of fun) {
              const a = l.p[0] * P.c - l.p[1] * P.sn, b = l.p[0] * P.sn + l.p[1] * P.c;
              const r = Math.hypot(a, b) || 1;
              if ((a + b) / (r * Math.SQRT2) < 0.35) continue;
              const k = Math.pow(Math.max(0, Math.sin(P.t * l.w * 0.8 + l.ph * 7)), 40) * a0;
              if (k < 0.04) continue;
              const q = P.proj(l.p[0], l.p[1], l.p[2] - 0.02), L = Math.max(3, 0.34 * P.s) * (0.5 + 0.5 * k), w = Math.max(0.6, 0.022 * P.s);
              const gr = g.createRadialGradient(q[0], q[1], 0, q[0], q[1], L);
              gr.addColorStop(0, "rgba(255,246,220," + (0.9 * k).toFixed(3) + ")"); gr.addColorStop(0.3, "rgba(255,214,150," + (0.35 * k).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,190,110,0)");
              g.fillStyle = gr;
              g.beginPath();
              for (let i = 0; i < 6; i++) {
                const wi = i / 6 * TAU + l.ph, lr = i % 2 ? L * 0.55 : L, c = Math.cos(wi), s2 = Math.sin(wi);
                g.moveTo(q[0] - s2 * w, q[1] + c * w); g.lineTo(q[0] + c * lr, q[1] + s2 * lr); g.lineTo(q[0] + s2 * w, q[1] - c * w); g.closePath();
              }
              g.fill();
              g.beginPath(); g.arc(q[0], q[1], L * 0.28, 0, TAU); g.fill();
            }
            g.restore();
          });
        }
      } else {
        const D = maibaumDaten(saat);
        const W = baumDaten(saat, WIPFEL, true);
        const A = { hoch: 1, schilder: phase(bau, 0.3, 0.6), kranz: bau >= 0.66, zaun: null };
        M.teil("baum", { mitte: [0, 0, 0] });
        M.figur({ x: 0, y: 0, z: 0, breite: 7, hoehe: MB.H + 2.2, malen: mitGier(function (g, s, F) {
          if (F.schatten) return maibaumMalen(g, s, F, D, W, A);
          aufCpu(g, -4.2 * s, -(MB.H + 2.2) * KZ * s, 8.4 * s, (MB.H + 2.2) * KZ * s + 2.4 * s, function (cg) { maibaumMalen(cg, s, F, D, W, A); });
        }) });
        if (bau >= 0.84) {
          M.teil("blumen", { ebene: 0, schatten: false, mitte: [0, 0, 0.5] });
          M.figur({ x: 0, y: 0, z: 0, breite: 3.4, hoehe: 0.6, schatten: false, malen: mitGier(function (g, s, F) { if (!F.schatten) blumenMalen(g, blick(F.gier, s), D, F, phase(bau, 0.84, 1), 0.2); }) });
        }
        /* Maibaumständer: zwei Kanthölzer mit Stahlbändern */
        for (const seite of [-1, 1]) {
          M.teil("stuetze" + seite);
          const x = seite * (MB.rU + 0.14);
          const m = gebacken((g, F) => {
            holz(g, F.w, F.h, [120, 88, 58], F, 40 + seite);
            g.fillStyle = "#5b5f66"; for (const y of [0.35, 1.4, 2.4]) { g.fillRect(0, y, F.w, 0.08); g.fillStyle = "#2a2c30"; g.beginPath(); g.arc(F.w / 2, y + 0.04, 0.028, 0, TAU); g.fill(); g.fillStyle = "#5b5f66"; }
          });
          M.quader({ x: x - 0.13, y: -0.16, z: 0, b: 0.26, t: 0.32, h: 3.0 }, { sued: m, nord: m, ost: m, west: m, oben: "#7a5a3c" });
        }
      }
    }
  });
})();
