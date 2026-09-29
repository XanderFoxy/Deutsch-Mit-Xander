/* =====================================================================
   KOLOSSEUM (Rom, Amphitheatrum Flavium, 72–80 n. Chr.)
   ---------------------------------------------------------------------
   FASSUNG 829 — XANDER: „Guck mal, dass du noch ein realistisches
   Kolosseum baust … dass das dann von der Größenordnung zum Döbelner
   Rathaus passt … weil ich Fan von Italien bin."

   VORBILD: der ovale Bau aus hellem Travertin, außen vier Geschosse –
   drei Arkadenreihen mit je 80 Bögen, zwischen den Bögen Halbsäulen:
   unten tuskisch-dorisch, darüber ionisch, oben korinthisch, jedes
   Geschoss mit Gebälk (Architrav, Fries, Gesims). Darüber das Attika-
   geschoss mit korinthischen Pilastern, kleinen Rechteckfenstern in
   jedem zweiten Feld und den Kragsteinen für die Masten des Sonnen-
   segels. Innen steigen die Ränge (cavea, heute Ruinen aus Ziegel und
   Tuff mit den Umgängen) zur Arena ab; der Arenaboden fehlt zum großen
   Teil, man sieht in die Gänge des Hypogäums, an einem Ende liegt ein
   neuer Holzboden. Auf der Südseite ist der äußere Ring eingestürzt: dort
   steht nur der zweite Ring, zwei Geschosse hoch; an den Bruchstellen
   sieht man den Schnitt durch Mauern und Umgänge (gestuft). Im Modell
  liegt die eingestürzte Seite rechts (in der Grundansicht zu sehen).

   MASSSTAB: echte Maße 189 × 156 m, 48 m hoch, Arena 87 × 55 m. Das
   Döbelner Rathaus ist als Modell 1:1,5 gebaut und steht im Dorf mit
   D.MASS 0,7 – also 1:2,14 (0,467 der echten Größe). Das Kolosseum ist
   gleich in diesem Maßstab gebaut (K = 0,4667): 88,2 × 72,8 m, 22,4 m
   hoch – so steht es im selben Verhältnis zum Rathaus wie in echt (gut
   dreimal so lang wie das Rathaus, etwas niedriger als sein Turm).

   AUFBAU: Der Ring ist in N Segmente geteilt (je ein Teil für die
   Tiefensortierung des Kerns): Außenwand, Mauerkrone, Attika innen,
   Ränge (zwei Dreiecke), Podium; die Arena ist ein eigener Teil ganz
   hinten. Alle Punkte eines Segments liegen auf der Strecke von der
   Außen- zur Arenaellipse (E(t)), so passen Schnitte und Ränge genau.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const RAD = Math.PI / 180;
  const K = 0.4667;                                   // Maßstab zur echten Größe (wie das Rathaus im Dorf)
  const A = 94.5 * K, B = 78 * K;                     // Außenellipse (Halbachsen)
  const AA = 43.5 * K, BA = 27.5 * K;                 // Arena
  /* Geschosse (echte Höhen 10,5 / 11,85 / 11,6 / 13,9 m) */
  const Z1 = 10.5 * K, Z2 = 22.35 * K, Z3 = 33.95 * K, Z4 = 47.9 * K;
  const ZP = 4.2 * K;                                 // Oberkante Podium (Arenamauer)
  const ZR = 21.5 * K;                                // Oberkante des zweiten Rings (eingestürzte Seite)
  const RING = A - AA;                                // Ringbreite (≈ B − BA)
  const T_AT = 2.8 * K / RING;                        // Attika-Innenseite
  const T_R2 = 9 * K / RING, T_R2I = 11.6 * K / RING; // zweiter Ring: Außen- und Innenkante
  const N = 40;                                       // Segmente (je zwei Bögen: 80 Bögen ringsum)
  /* eingestürzter Bereich (Winkel der Ellipse, 0° = +x, 90° = vorn): rechts, von hinten bis schräg vorn – so sieht man
     in der Grundansicht den niedrigen zweiten Ring und den gestuften Schnitt */
  const EIN0 = -72, EIN1 = 36;
  const TRAVERTIN = [230, 208, 166], TRAV_D = [196, 172, 132], TRAV_H = [242, 228, 198];
  const ZIEGEL = [164, 104, 76], TUFF = [170, 150, 116];
  const rgb = (f, a) => a == null ? "rgb(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + ")" : "rgba(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + "," + a + ")";
  const hell = (f, k) => f.map((v) => Math.max(0, Math.min(255, k > 0 ? v + (255 - v) * k : v * (1 + k))));
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const kreuz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

  /* Punkt auf der Ellipse E(t) (t = 0 außen, 1 Arena) beim Winkel th (Grad), Höhe z */
  const E = (t, th, z) => [(A + t * (AA - A)) * Math.cos(th * RAD), (B + t * (BA - B)) * Math.sin(th * RAD), z];
  const eingestuerzt = (th) => th > EIN0 + 1e-6 && th < EIN1 - 1e-6;

  /* Ebene Fläche aus beliebigen (ebenen) Punkten; hinweis = grob die Richtung, in die sie schauen soll. u liegt
     waagrecht, wenn es geht (dann ist v „nach unten" wie bei Wänden). */
  function flaeche(M, name, pts, hinweis, malen, extra) {
    let n = [0, 0, 0];
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1]); }
    n = nrm(n);
    if (dot(n, hinweis) < 0) n = n.map((z) => -z);
    let u = kreuz(n, [0, 0, 1]);
    if (Math.hypot(u[0], u[1], u[2]) < 1e-6) u = [1, 0, 0]; else u = nrm(u);
    const v = kreuz(n, u);
    const q = pts.map((p) => { const d = sub(p, pts[0]); return [dot(d, u), dot(d, v)]; });
    let a0 = Infinity, b0 = Infinity, a1 = -Infinity, b1 = -Infinity;
    for (const [a, b] of q) { a0 = Math.min(a0, a); b0 = Math.min(b0, b); a1 = Math.max(a1, a); b1 = Math.max(b1, b); }
    const o = [pts[0][0] + u[0] * a0 + v[0] * b0, pts[0][1] + u[1] * a0 + v[1] * b0, pts[0][2] + u[2] * a0 + v[2] * b0];
    return M.flaeche(Object.assign({ name: name, o: o, u: u, v: v, w: a1 - a0, h: b1 - b0, umriss: q.map(([a, b]) => [a - a0, b - b0]), malen: malen }, extra || {}));
  }

  /* ---------------- Malen ---------------- */
  function stein(g, F, x, y, w, h, farbe, saat) {
    g.fillStyle = rgb(farbe); g.fillRect(x - 0.05, y - 0.05, w + 0.1, h + 0.1);
    if (F.px > 2) { PI.rauschen(g, x, y, w, h, 4.5, 0.22, saat, 3); PI.rauschen(g, x, y, w, h, 1.2, 0.12, saat + 3, 3); }
    if (F.px > 3) PI.bleichen(g, x, y, w, h, 3, 0.12, saat);
  }
  /* Quaderfugen (waagrecht alle 0,6 m echt ≈ 0,28 m) */
  function fugen(g, F, x, y, w, h) {
    if (F.px * 0.28 < 3) return;
    g.strokeStyle = "rgba(90,74,52,0.22)"; g.lineWidth = 0.03;
    g.beginPath(); for (let yy = y + 0.28; yy < y + h; yy += 0.28) { g.moveTo(x, yy); g.lineTo(x + w, yy); } g.stroke();
  }
  /* Rundbogenöffnung mit dunklem Umgang dahinter (Gewölbe schwach sichtbar) */
  function bogen(g, F, cx, yU, bw, bh, ruine) {
    const r = bw / 2, yK = yU - bh + r;
    const pfad = () => { g.beginPath(); g.moveTo(cx - r, yU); g.lineTo(cx - r, yK); g.arc(cx, yK, r, Math.PI, 0); g.lineTo(cx + r, yU); g.closePath(); };
    pfad();
    const gr = g.createLinearGradient(0, yK - r, 0, yU);
    gr.addColorStop(0, "#2a211a"); gr.addColorStop(0.55, "#3d3126"); gr.addColorStop(1, ruine ? "#6a5a44" : "#51432f");
    g.fillStyle = gr; g.fill();
    /* Licht, das von hinten durch den nächsten Bogen fällt */
    if (F.px > 6) { g.save(); pfad(); g.clip(); g.fillStyle = "rgba(210,190,150,0.16)"; g.fillRect(cx - r * 0.2, yK - r * 0.3, r * 0.9, bh); g.restore(); }
    /* Archivolte (Bogenlaibung) und Kämpfer */
    if (F.px > 4) {
      g.strokeStyle = rgb(TRAV_H, 0.7); g.lineWidth = Math.min(0.14, bw * 0.08);
      g.beginPath(); g.arc(cx, yK, r + 0.06, Math.PI, 0); g.stroke();
      g.fillStyle = rgb(TRAV_H, 0.6); g.fillRect(cx - r - 0.1, yK - 0.05, 0.16, 0.1); g.fillRect(cx + r - 0.06, yK - 0.05, 0.16, 0.1);
      const sv = F.schatten ? F.schatten(0.4) : null;
      if (sv) { g.save(); pfad(); g.clip(); g.fillStyle = "rgba(0,0,0,0.35)"; g.translate(sv[0], sv[1]); pfad(); g.globalCompositeOperation = "destination-out"; g.fill(); g.restore(); }
    }
  }
  /* Halbsäule (oder Pilaster) mit Basis und Kapitell nach Ordnung: "d" dorisch, "i" ionisch, "k" korinthisch */
  function saeule(g, F, cx, yU, yO, b, ord, pilaster) {
    const sv = F.schatten ? F.schatten(pilaster ? 0.08 : 0.2) : null;
    if (sv) { g.fillStyle = "rgba(60,48,32,0.28)"; g.fillRect(cx - b / 2 + sv[0], yO, b, yU - yO); }
    if (pilaster) { g.fillStyle = rgb(hell(TRAVERTIN, 0.08)); g.fillRect(cx - b / 2, yO, b, yU - yO); }
    else {
      const gr = g.createLinearGradient(cx - b / 2, 0, cx + b / 2, 0);
      gr.addColorStop(0, rgb(hell(TRAVERTIN, -0.08))); gr.addColorStop(0.35, rgb(TRAV_H)); gr.addColorStop(1, rgb(TRAV_D));
      g.fillStyle = gr; g.fillRect(cx - b / 2, yO, b, yU - yO);
    }
    if (F.px < 5) return;
    /* Basis */
    g.fillStyle = rgb(TRAV_H); g.fillRect(cx - b * 0.62, yU - 0.16, b * 1.24, 0.16);
    /* Kapitell */
    const kh = ord === "d" ? 0.18 : ord === "i" ? 0.24 : 0.42;
    g.fillStyle = rgb(hell(TRAVERTIN, 0.12)); g.fillRect(cx - b * 0.66, yO, b * 1.32, 0.09);
    if (ord === "d") { g.fillStyle = rgb(TRAV_H); g.fillRect(cx - b * 0.56, yO + 0.09, b * 1.12, kh - 0.09); }
    else if (ord === "i") {
      g.fillStyle = rgb(TRAV_H); g.fillRect(cx - b * 0.55, yO + 0.09, b * 1.1, 0.08);
      g.fillStyle = rgb(TRAV_D);
      for (const s of [-1, 1]) { g.beginPath(); g.arc(cx + s * b * 0.5, yO + 0.18, 0.07, 0, Math.PI * 2); g.fill(); }
    } else {
      /* Akanthusblätter: zwei Reihen kleiner Bögen */
      g.fillStyle = rgb(TRAV_H); g.fillRect(cx - b * 0.55, yO + 0.09, b * 1.1, kh - 0.09);
      if (F.px > 9) { g.fillStyle = rgb(TRAV_D, 0.7); for (let i = 0; i < 3; i++) for (const r of [0, 1]) { g.beginPath(); g.arc(cx - b * 0.33 + i * b * 0.33, yO + kh - 0.06 - r * 0.14, 0.06, Math.PI, 0); g.fill(); } }
    }
  }
  /* Gebälk: Architrav, Fries, vorspringendes Gesims mit Schatten darunter */
  function gebaelk(g, F, y, w, h) {
    g.fillStyle = rgb(hell(TRAVERTIN, 0.06)); g.fillRect(-0.1, y, w + 0.2, h);
    g.fillStyle = rgb(TRAV_H); g.fillRect(-0.1, y, w + 0.2, h * 0.3);
    g.fillStyle = "rgba(70,56,38,0.35)"; g.fillRect(-0.1, y + h * 0.3, w + 0.2, 0.06);
    g.fillStyle = "rgba(70,56,38,0.18)"; g.fillRect(-0.1, y + h, w + 0.2, 0.12);
  }
  /* Außenwand: drei Arkadengeschosse, Attika; zwei Felder je Segment */
  function aussenwand(saat) {
    return function (g, F) {
      const w = F.w, h = F.h, n = 2, bw = w / n;
      stein(g, F, 0, 0, w, h, TRAVERTIN, saat);
      fugen(g, F, 0, 0, w, h);
      const y = (z) => h - z;                             // Höhe → Flächenkoordinate
      const geschosse = [[0, Z1, "d"], [Z1, Z2, "i"], [Z2, Z3, "k"]];
      for (const [z0, z1, ord] of geschosse) {
        const gh = z1 - z0, sockel = z0 === 0 ? 0.25 : gh * 0.1, bh = (gh - sockel) * 0.72;
        for (let i = 0; i < n; i++) bogen(g, F, bw * (i + 0.5), y(z0 + sockel), bw * 0.58, bh, false);
        /* Brüstung in den oberen Geschossen */
        if (z0 > 0 && F.px > 4) { g.fillStyle = rgb(hell(TRAVERTIN, 0.04)); g.fillRect(0, y(z0 + sockel), w, sockel * 0.9); }
        for (let i = 0; i <= n; i++) saeule(g, F, bw * i, y(z0 + sockel * 0.4), y(z1 - gh * 0.14), bw * 0.16, ord, false);
        gebaelk(g, F, y(z1), w, gh * 0.14);
      }
      /* Attika: Pilaster, Fenster in jedem zweiten Feld, Kragsteine für die Masten des Sonnensegels */
      const za = Z3, zh = Z4 - Z3;
      for (let i = 0; i <= n; i++) saeule(g, F, bw * i, y(za + 0.2), y(Z4 - zh * 0.12), bw * 0.13, "k", true);
      if (F.px > 3) {
        const fx = bw * 0.5 + ((saat % 2) ? bw : 0);
        g.fillStyle = "#3a2e22"; g.fillRect(fx - bw * 0.12, y(za + zh * 0.55), bw * 0.24, zh * 0.2);
        g.strokeStyle = rgb(TRAV_H, 0.8); g.lineWidth = 0.06; g.strokeRect(fx - bw * 0.12 - 0.05, y(za + zh * 0.55) - 0.05, bw * 0.24 + 0.1, zh * 0.2 + 0.1);
        g.fillStyle = rgb(TRAV_D);
        for (let i = 0; i < n * 3; i++) { const kx = bw * (i + 0.5) / 3; g.fillRect(kx - 0.08, y(Z4 - zh * 0.2), 0.16, 0.22); }
        /* Löcher der Mastbalken und Verwitterung: dunkle Rinnspuren von oben */
        g.fillStyle = "rgba(40,32,22,0.5)";
        for (let i = 0; i < n * 3; i++) { const kx = bw * (i + 0.5) / 3; g.fillRect(kx - 0.05, y(Z4 - zh * 0.07), 0.1, 0.12); }
      }
      g.fillStyle = rgb(TRAV_H); g.fillRect(-0.1, 0, w + 0.2, zh * 0.1);
      g.fillStyle = "rgba(70,56,38,0.3)"; g.fillRect(-0.1, zh * 0.1, w + 0.2, 0.08);
      /* dunkle Patina (Ruß, Regenspuren) */
      if (F.px > 2) {
        const rng = F.rng;
        for (let i = 0; i < 5; i++) { const x = rng() * w, l = 2 + rng() * 6; const gr = g.createLinearGradient(0, 0, 0, l); gr.addColorStop(0, "rgba(60,52,40,0.22)"); gr.addColorStop(1, "rgba(60,52,40,0)"); g.fillStyle = gr; g.fillRect(x, 0, 0.3 + rng() * 0.6, l); }
        PI.rauschen(g, 0, 0, w, h, 9, 0.14, saat + 11, 3);
      }
    };
  }
  /* Nachts: warmes Licht aus den Bögen (wie in Rom angestrahlt) */
  function aussenLicht(saat, geschosse) {
    return function (g, F) {
      const w = F.w, h = F.h, n = 2, bw = w / n, y = (z) => h - z;
      g.save(); g.globalCompositeOperation = "lighter";
      for (const [z0, z1] of geschosse) {
        const gh = z1 - z0, sockel = z0 === 0 ? 0.25 : gh * 0.1, bh = (gh - sockel) * 0.72, r = bw * 0.29;
        for (let i = 0; i < n; i++) {
          const cx = bw * (i + 0.5), yU = y(z0 + sockel), yK = yU - bh + r;
          g.beginPath(); g.moveTo(cx - r, yU); g.lineTo(cx - r, yK); g.arc(cx, yK, r, Math.PI, 0); g.lineTo(cx + r, yU); g.closePath();
          g.fillStyle = "rgba(255,170,80," + (0.55 * F.nacht).toFixed(3) + ")"; g.fill();
        }
      }
      g.restore();
      if (saat % 3 === 0) F.leuchtPunkt(w / 2, h - Z1 * 0.5, 5, "255,176,96", 0.35);
    };
  }
  /* Zweiter Ring (eingestürzte Seite): zwei Geschosse, verwitterter, mit Ziegelflicken */
  function zweiterRing(saat) {
    return function (g, F) {
      const w = F.w, h = F.h, n = 2, bw = w / n, y = (z) => h - z;
      stein(g, F, 0, 0, w, h, hell(TRAVERTIN, -0.05), saat);
      fugen(g, F, 0, 0, w, h);
      for (const [z0, z1] of [[0, Z1], [Z1, ZR]]) {
        const gh = z1 - z0, bh = gh * 0.7;
        for (let i = 0; i < n; i++) bogen(g, F, bw * (i + 0.5), y(z0 + 0.2), bw * 0.62, bh, true);
        g.fillStyle = rgb(TRAV_H, 0.8); g.fillRect(-0.1, y(z1), w + 0.2, 0.3);
      }
      if (F.px > 3) {
        const rng = F.rng;
        for (let i = 0; i < 3; i++) { g.fillStyle = rgb(ZIEGEL, 0.75); g.fillRect(rng() * w, rng() * h * 0.6, 0.8 + rng() * 1.2, 0.6 + rng() * 1.5); }
      }
    };
  }
  /* Mauerkrone: Travertin, im Winter Schnee */
  const krone = (saat) => (g, F) => { stein(g, F, 0, 0, F.w, F.h, TRAV_H, saat); if (F.jahr === "winter") { g.fillStyle = "rgba(246,248,252,0.92)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); } };
  /* Attika innen und Schnittflächen: Ziegelkern mit Travertin-Resten */
  function innenwand(saat) {
    return function (g, F) {
      stein(g, F, 0, 0, F.w, F.h, ZIEGEL, saat);
      if (F.px * 0.12 > 2) { g.strokeStyle = "rgba(90,50,34,0.35)"; g.lineWidth = 0.025; g.beginPath(); for (let yy = 0.12; yy < F.h; yy += 0.12) { g.moveTo(0, yy); g.lineTo(F.w, yy); } g.stroke(); }
      if (F.px > 3) { const rng = F.rng; for (let i = 0; i < 4; i++) { g.fillStyle = rgb(TRAVERTIN, 0.8); g.fillRect(rng() * F.w, rng() * F.h, 0.6 + rng(), 0.4 + rng() * 0.8); } }
    };
  }
  /* Schnitt an der Bruchstelle: Mauerwerk mit den Umgängen (dunkle Bogengänge je Geschoss) */
  function schnittMalen(g, F) {
    innenwand(71)(g, F);
    const f = F.flaeche, rng = F.rng;
    /* Flächenpunkt → Höhe z (linear) */
    const zAt = (a, b) => f.o[2] + f.u[2] * a + f.v[2] * b;
    const yVon = (z) => (z - f.o[2]) / (f.v[2] || -1);
    void zAt;
    for (const [z0, z1] of [[0, Z1], [Z1, Z2], [Z2, Z3]]) {
      const yU = yVon(z0 + 0.2), hh = (z1 - z0) * 0.62;
      for (let i = 0; i < 2; i++) {
        const x = (i + 0.3) * 1.3, bw = 0.9;
        g.fillStyle = "#2e241b"; g.beginPath(); g.moveTo(x, yU); g.lineTo(x, yU - hh + bw / 2); g.arc(x + bw / 2, yU - hh + bw / 2, bw / 2, Math.PI, 0); g.lineTo(x + bw, yU); g.closePath(); g.fill();
      }
    }
    if (F.px > 3) for (let i = 0; i < 6; i++) { g.fillStyle = rgb(TUFF, 0.6); g.fillRect(rng() * F.w, rng() * F.h, 0.5, 0.35); }
  }
  /* Ränge: Ruinen der Sitzstufen – Streifen gleicher Höhe (Ringe) aus Ziegel, Tuff und Travertin, dazu die
     Umgangsmauern (Praecinctiones), dunkle Öffnungen der Gewölbe und radiale Mauern */
  function raengeMalen(saat) {
    return function (g, F) {
      const f = F.flaeche, winter = F.jahr === "winter";
      const a = f.u[2], b = f.v[2], l = Math.hypot(a, b) || 1;
      g.fillStyle = rgb(ZIEGEL); g.fillRect(-1, -1, F.w + 2, F.h + 2);
      g.save();
      /* gedrehtes Bild: x' läuft die Ränge hinauf (Höhe), y' quer */
      g.rotate(Math.atan2(b, a));
      const z0 = f.o[2], B2 = F.w + F.h + 4;
      const band = (za, zb, farbe) => { const t0 = (za - z0) / l, t1 = (zb - z0) / l; g.fillStyle = farbe; g.fillRect(Math.min(t0, t1), -B2, Math.abs(t1 - t0), 2 * B2); };
      const stufe = 0.42 * K * 2;                         // Höhe einer Rangstufe (echt ~0,9 m)
      for (let z = ZP; z < Z4; z += stufe) {
        const k = ST.hash2(Math.round(z * 10), saat, 901);
        const c = k < 0.35 ? rgb(hell(ZIEGEL, -0.12)) : k < 0.6 ? rgb(TUFF) : k < 0.8 ? rgb(hell(ZIEGEL, 0.08)) : rgb(TRAVERTIN);
        band(z, z + stufe * 0.55, c);
        band(z + stufe * 0.55, z + stufe * 0.7, "rgba(60,40,28,0.45)");
      }
      /* Praecinctiones (Umgänge): hellere Mauerbänder, darunter dunkle Gewölbeöffnungen */
      for (const zr of [ZP + 0.3, Z1 * 0.95, Z2 * 0.92]) { band(zr, zr + 0.35, rgb(TRAV_H)); band(zr - 0.5, zr, "rgba(40,28,20,0.55)"); }
      /* radiale Mauern (quer): dunkle Fugen alle ~2,5 m */
      if (F.px > 2) {
        g.fillStyle = "rgba(70,44,30,0.45)";
        for (let s = -B2; s < B2; s += 2.4) g.fillRect(-B2, s, 2 * B2, 0.22);
      }
      g.restore();
      if (F.px > 2) PI.rauschen(g, 0, 0, F.w, F.h, 5, 0.25, saat, 3);
      if (winter) { g.fillStyle = "rgba(244,247,252,0.78)"; g.fillRect(-1, -1, F.w + 2, F.h + 2); if (F.px > 2) PI.rauschen(g, 0, 0, F.w, F.h, 3, 0.15, saat + 4, 3); }
    };
  }
  /* Podium: die Arenamauer (Travertin, oben Marmorplatten) */
  const podium = (saat) => (g, F) => { stein(g, F, 0, 0, F.w, F.h, TRAV_D, saat); g.fillStyle = rgb(TRAV_H); g.fillRect(-0.1, 0, F.w + 0.2, 0.25); };
  /* Arena: Sand, zum großen Teil offen mit den Gängen des Hypogäums, am Ostende der neue Holzboden */
  function arenaMalen(g, F) {
    const winter = F.jahr === "winter", w = F.w, h = F.h, cx = w / 2, cy = h / 2;
    g.fillStyle = winter ? "#eef2f8" : "#c9ae82"; g.fillRect(-1, -1, w + 2, h + 2);
    if (F.px > 2) PI.rauschen(g, 0, 0, w, h, 6, 0.25, 911, 3);
    /* offenes Hypogäum: dunkler Grund, darauf Mauerzüge */
    g.save();
    g.beginPath(); g.ellipse(cx - w * 0.06, cy, w * 0.36, h * 0.34, 0, 0, Math.PI * 2); g.clip();
    g.fillStyle = "#3b2e22"; g.fillRect(0, 0, w, h);
    g.fillStyle = rgb(hell(ZIEGEL, -0.05));
    /* Längsgänge und Querwände */
    for (let i = -4; i <= 4; i++) g.fillRect(0, cy + i * h * 0.075 - 0.25, w, 0.5);
    for (let x = 0.8; x < w; x += 1.9) g.fillRect(x, 0, 0.35, h);
    g.fillStyle = "#2a2019"; g.fillRect(0, cy - 0.9, w, 1.8);                 // Hauptgang in der Längsachse
    if (winter) { g.fillStyle = "rgba(240,244,250,0.55)"; g.fillRect(0, 0, w, h); }
    g.restore();
    /* neuer Holzboden am Ostende */
    g.save();
    g.beginPath(); g.rect(w * 0.7, 0, w * 0.3, h); g.clip();
    g.beginPath(); g.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2); g.clip();
    g.fillStyle = winter ? "#e9edf4" : "#9a7650"; g.fillRect(w * 0.7, 0, w * 0.3, h);
    if (!winter && F.px * 0.25 > 2) { g.strokeStyle = "rgba(60,40,24,0.35)"; g.lineWidth = 0.05; g.beginPath(); for (let y = 0; y < h; y += 0.25) { g.moveTo(w * 0.7, y); g.lineTo(w, y); } g.stroke(); }
    g.restore();
  }
  /* Boden des eingestürzten Rings: Travertinplatten mit Pfeilerstümpfen */
  function truemmerBoden(saat) {
    return function (g, F) {
      stein(g, F, 0, 0, F.w, F.h, [196, 184, 160], saat);
      const rng = F.rng;
      if (F.px > 2) for (let i = 0; i < 10; i++) { const x = rng() * F.w, y = rng() * F.h; g.fillStyle = rgb(TRAV_D); g.fillRect(x, y, 0.5 + rng() * 0.6, 0.5 + rng() * 0.6); g.fillStyle = "rgba(50,40,28,0.35)"; g.fillRect(x + 0.1, y + 0.55, 0.6, 0.12); }
      if (F.jahr === "winter") { g.fillStyle = "rgba(244,247,252,0.85)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); }
    };
  }

  ST.modell("kolosseum", {
    name: "Kolosseum", gruppe: "Wahrzeichen", grund: [2 * A, 2 * B], hoehe: Z4, bauzeit: 60 * 60,
    /* für die Sonde: Maße und Maßstab */
    masse: { K: K, laenge: 2 * A, breite: 2 * B, hoehe: Z4, arena: [2 * AA, 2 * BA], echt: [189, 156, 48], eingestuerzt: [EIN0, EIN1] },
    bauen(M, o) {
      const bau = o.bau == null ? 1 : o.bau;
      const zMax = bau >= 1 ? Infinity : 0.3 + Z4 * Math.max(0, Math.min(1, (bau - 0.05) / 0.9));
      const hoch = (z) => Math.min(z, zMax);
      /* Arena zuerst (ganz hinten in der Reihenfolge) */
      M.teil("arena", { ebene: -1 });
      const aPts = [];
      for (let i = 0; i < 48; i++) { const th = i * 7.5; aPts.push([AA * Math.cos(th * RAD), BA * Math.sin(th * RAD), 0.05]); }
      flaeche(M, "arena", aPts, [0, 0, 1], arenaMalen, { keinAo: true });
      const dth = 360 / N;
      for (let i = 0; i < N; i++) {
        const t0 = -180 + i * dth, t1 = t0 + dth, tm = (t0 + t1) / 2, weg = eingestuerzt(tm), saat = i * 7 + 3;
        M.teil("seg" + i);
        const aussenN = nrm([Math.cos(tm * RAD) / A, Math.sin(tm * RAD) / B, 0]), innenN = aussenN.map((z) => -z);
        if (!weg) {
          const zt = hoch(Z4);
          /* Außenwand */
          flaeche(M, "aussen" + i, [E(0, t1, zt), E(0, t0, zt), E(0, t0, 0), E(0, t1, 0)], aussenN, aussenwand(saat),
            { ao: true, leuchten: aussenLicht(saat, [[0, Z1], [Z1, Z2], [Z2, Z3]].filter(([a]) => a < zMax)) });
          if (zt > Z3) {
            flaeche(M, "krone" + i, [E(0, t0, zt), E(0, t1, zt), E(T_AT, t1, zt), E(T_AT, t0, zt)], [0, 0, 1], krone(saat));
            flaeche(M, "attika" + i, [E(T_AT, t0, zt), E(T_AT, t1, zt), E(T_AT, t1, Z3), E(T_AT, t0, Z3)], innenN, innenwand(saat));
          } else flaeche(M, "krone" + i, [E(0, t0, zt), E(0, t1, zt), E(T_AT, t1, zt), E(T_AT, t0, zt)], [0, 0, 1], krone(saat));
          /* Ränge von der Attika hinab zum Podium (zwei Dreiecke) */
          const zc = hoch(Z3), zp = hoch(ZP);
          if (zc > zp + 0.1) {
            flaeche(M, "rang" + i + "a", [E(T_AT, t0, zc), E(T_AT, t1, zc), E(1, t1, zp)], [innenN[0], innenN[1], 1.2], raengeMalen(saat));
            flaeche(M, "rang" + i + "b", [E(T_AT, t0, zc), E(1, t1, zp), E(1, t0, zp)], [innenN[0], innenN[1], 1.2], raengeMalen(saat + 1));
          }
        } else {
          /* eingestürzt: Boden des äußeren Rings, der zweite Ring zwei Geschosse hoch, niedrigere Ränge */
          flaeche(M, "truemmer" + i, [E(0, t0, 0.06), E(0, t1, 0.06), E(T_R2, t1, 0.06), E(T_R2, t0, 0.06)], [0, 0, 1], truemmerBoden(saat), { keinAo: true });
          const zr = hoch(ZR);
          flaeche(M, "ring2" + i, [E(T_R2, t1, zr), E(T_R2, t0, zr), E(T_R2, t0, 0), E(T_R2, t1, 0)], aussenN, zweiterRing(saat),
            { ao: true, leuchten: aussenLicht(saat, [[0, Z1]]) });
          flaeche(M, "krone2" + i, [E(T_R2, t0, zr), E(T_R2, t1, zr), E(T_R2I, t1, zr), E(T_R2I, t0, zr)], [0, 0, 1], krone(saat));
          const zp = hoch(ZP);
          if (zr > zp + 0.1) {
            flaeche(M, "rang" + i + "a", [E(T_R2I, t0, zr), E(T_R2I, t1, zr), E(1, t1, zp)], [innenN[0], innenN[1], 1.2], raengeMalen(saat));
            flaeche(M, "rang" + i + "b", [E(T_R2I, t0, zr), E(1, t1, zp), E(1, t0, zp)], [innenN[0], innenN[1], 1.2], raengeMalen(saat + 1));
          }
        }
        /* Podium (Arenamauer) */
        const zp = hoch(ZP);
        flaeche(M, "podium" + i, [E(1, t0, zp), E(1, t1, zp), E(1, t1, 0), E(1, t0, 0)], innenN, podium(saat), { ao: true });
      }
      /* Bruchstellen: der Schnitt durch den äußeren Ring, gestuft bis auf den zweiten Ring */
      for (const [th, seite] of [[EIN0, -1], [EIN1, 1]]) {
        M.teil("schnitt" + (seite > 0 ? "O" : "W"));
        /* Richtung, in die der Schnitt schaut: zur eingestürzten Seite (tangential) */
        const tang = nrm([-A * Math.sin(th * RAD) * -seite, B * Math.cos(th * RAD) * -seite, 0]);
        const zc = hoch(Z3), zt = hoch(Z4), zr = hoch(ZR), zp = hoch(ZP);
        const zRangR2 = zc - (T_R2I - T_AT) / (1 - T_AT) * (zc - zp);   // Höhe der Ränge über der Kante des zweiten Rings
        const pts = [E(0, th, 0), E(0, th, zt), E(T_AT, th, zt), E(T_AT, th, zc), E(T_R2I, th, Math.max(zr, zRangR2)), E(T_R2I, th, zr), E(T_R2, th, zr), E(T_R2, th, 0)];
        flaeche(M, "schnitt" + seite, pts, tang, schnittMalen, { ao: true });
        if (zRangR2 > zr + 0.05) flaeche(M, "stufe" + seite, [E(T_R2I, th, zRangR2), E(1, th, zp), E(T_R2I, th, zr)], tang, innenwand(seite > 0 ? 81 : 83));
      }
    }
  });
})();
