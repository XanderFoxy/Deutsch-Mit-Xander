/* =====================================================================
   LEICHTE STADT — DER WEIHNACHTSMANN AM HIMMEL
   ---------------------------------------------------------------------
   XANDER: „mit Santa Claus, der animiert durch den Himmel fliegt".
   Das Gespann aus Winterhausen (stadt/himmel.js) ist gebacken
   (werkzeug/santa-backen.js): 8 Flugrichtungen × 8 Galopp-Schritte je
   Blatt, bei Tag und bei Nacht. Etwa jede Minute zieht es geradeaus
   über das Bild (12,5 m/s wie in Winterhausen), hinter dem Schlitten
   ein weicher Sternenschleier. Nur im Winter.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, K = ST.kamera, SZ = ST.szene, LB = ST.bilder;
  const q = new URLSearchParams(location.search);
  let flug = null, naechster = q.has("santa") ? 0 : 20;
  const funken = [];

  /* Bildrichtung (Kurs, 0 = nach rechts, 90 = auf den Betrachter zu) → Bildpunkte je Sekunde */
  function tempo(kurs) {
    const c = Math.cos(kurs * Math.PI / 180), s = Math.sin(kurs * Math.PI / 180);
    const a = (c / ST.KX + s / ST.KY) / 2, b = (s / ST.KY - c / ST.KX) / 2, l = Math.hypot(a, b) || 1;
    return 12.5 * K.s / l;           // 12,5 m/s in der Welt
  }
  SZ.zuhoerer.push(function (g, t, Z) {
    if (SZ.jahr !== "winter") { flug = null; return; }
    if (!flug) {
      if (t < naechster) return;
      const r = q.has("santa") ? (+q.get("santa") || 0) & 7 : Math.floor(Math.random() * 8);
      const kurs = r * 45, v = tempo(kurs), dx = Math.cos(kurs * Math.PI / 180), dy = Math.sin(kurs * Math.PI / 180);
      /* durch einen Punkt nahe der Bildmitte, vom Rand zum Rand */
      const mx = K.W * (0.3 + Math.random() * 0.4), my = K.H * (0.22 + Math.random() * 0.3);
      const weg = Math.hypot(K.W, K.H) * 0.75;
      flug = { r: r, x0: mx - dx * weg, y0: my - dy * weg, dx: dx * v, dy: dy * v, t0: t, dauer: 2 * weg / v };
      if (q.has("santa")) flug.t0 = t - flug.dauer / 2;
    }
    const p = t - flug.t0;
    if (p > flug.dauer) { flug = null; naechster = t + 55 + Math.random() * 25; return; }
    const zeit = Z.nacht > 0.5 ? "nacht" : "tag", name = "santa_" + zeit, m = LB.vz[name];
    if (!m) return;
    const img = LB.bild(name); if (!img) return;
    const x = flug.x0 + flug.dx * p, y = flug.y0 + flug.dy * p;
    const sF = Math.max(K.s, Math.sqrt(24 * K.dpr * K.s)), k = sF / m.s;
    /* Sternenschleier: kleine Funken, die hinter dem Schlitten zurückbleiben */
    if (Math.random() < 0.8) funken.push({ x: x, y: y + 4 * k, t: t, r: (0.6 + Math.random()) * K.dpr });
    g.save(); g.globalCompositeOperation = "lighter";
    for (let i = funken.length - 1; i >= 0; i--) {
      const f = funken[i], a = 1 - (t - f.t) / 1.6;
      if (a <= 0) { funken.splice(i, 1); continue; }
      g.fillStyle = "rgba(255,236,190," + (0.55 * a).toFixed(3) + ")";
      g.beginPath(); g.arc(f.x + (Math.random() - 0.5) * 2, f.y + (t - f.t) * 6 * K.dpr, f.r, 0, Math.PI * 2); g.fill();
    }
    g.restore();
    const schritt = Math.floor(t * 2.1 * m.n) % m.n;
    g.drawImage(img, schritt * m.zw, flug.r * m.zh, m.zw, m.zh, x - m.ax * k, y - m.ay * k, m.zw * k, m.zh * k);
    if (ST.leicht) ST.leicht.unruhe = Math.max(ST.leicht.unruhe || 0, 1);
  });
})();

/* =====================================================================
   FASSUNG 808 — HIMMEL UND ALPEN HINTER DER HORIZONTLINIE
   ---------------------------------------------------------------------
   XANDER: „oben war die Horizontlinie … die Alpen dahinter, das kann ja
   die Spielbegrenzung sein" – „soll genau das selbe Bild sein … man soll
   das direkt wieder erkennen können" – „realistisch in der Nacht mit
   Sternen, zufälligen Wolken, Vögeln".
   Beim Blick nach Norden (Kamera 0) liegt quer über dem Bild die
   Horizontlinie (ST.dorf.HORIZONT, v = x + y). Darüber: der Himmel nach
   der Uhrzeit des Geräts (Tag, Dämmerung, Nacht fließend), Sonne oder
   Mond, nachts Sterne und ab und zu eine Sternschnuppe, zufällige Wolken,
   die langsam ziehen, tagsüber Vogelschwärme; davor die Alpen mit Schnee
   und bewaldete Vorberge im Dunst – wie im alten gemalten Dorf
   (spiel.js dmLandschaft). Die Berge werden einmal vorgemalt (je Jahres-
   und Tageszeit-Stufe) und dann nur noch skaliert gezeichnet.
   Maße in „Bildmetern": waagerecht u · 0,707, senkrecht wie die Welt.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, K = ST.kamera, SZ = ST.szene, LB = ST.bilder;
  const HM = (ST.himmel = ST.himmel || {});
  const h2 = ST.hash2;
  /* FASSUNG 826 — XANDER: „wenn man die große Karte hat in der Panoramaansicht … die Berge aber wie so ne Hintergrund
     Leinwand einfach abschneiden kann man die weich ausführen lassen … dass das die irgendwie so spitz zu laufen und dann
     … ausklingen". Die Kette ist breiter (±330 Bildmeter), wird zu den Enden hin niedriger bis auf null (HUELLE), und die
     Leinwand blendet an beiden Enden weich aus; dahinter liegt über die ganze Bildbreite ein flacher, blasser Höhenzug im
     Dunst – keine senkrechte Kante mehr, auch nicht oben. */
  const LINKS = -330, RECHTS = 330, OBEN = 47, UNTEN = 3, HOCH = 1.4;   // FASSUNG 826 — Berge 1,4-mal so hoch (Xander: „könnte die Berge ein bisschen höher machen")
  const glatt = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const HUELLE = (x) => 1 - glatt(175, 318, Math.abs(x));
  const HUELLE_VOR = (x) => 1 - glatt(215, 326, Math.abs(x));
  let vorrat = { schl: "", c: null, R: 0 };
  const mischF = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const rgb = (f, a) => a == null ? "rgb(" + f.join(",") + ")" : "rgba(" + f.join(",") + "," + a + ")";

  /* Gebrochener Grat (wie spiel.js grat): jede Strecke mehrfach geteilt und in der Höhe verschoben */
  function grat(pts, rau, saat) {
    let p = pts.slice();
    for (let runde = 0; runde < 5; runde++) {
      const neu = [p[0]];
      for (let j = 1; j < p.length; j++) {
        const a = p[j - 1], b = p[j], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + (h2(j, runde, saat) - 0.5) * rau * Math.abs(b[0] - a[0]) * 0.3;
        neu.push([mx, my], b);
      }
      p = neu;
    }
    return p;
  }
  /* Die Berge einmal vormalen: stufe 0 Tag … 4 Nacht */
  function vormalen(jahr, stufe, R) {
    const W = Math.ceil((RECHTS - LINKS) * R), H = Math.ceil((OBEN + UNTEN) * R);
    const c = vorrat.c && vorrat.c.width === W && vorrat.c.height === H ? vorrat.c : document.createElement("canvas");
    c.width = W; c.height = H;
    const g = c.getContext("2d");
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
    /* Bildmeter → Leinwand: x nach rechts, y nach oben ab der Horizontlinie */
    g.setTransform(R, 0, 0, -R, -LINKS * R, OBEN * R);
    const winter = jahr === "winter";
    /* Die Alpenkette: markante Gipfel (einer spitz wie das Matterhorn), dazwischen Sättel */
    const kette = grat([[-340, 6], [-300, 12], [-262, 18], [-240, 11], [-200, 17], [-170, 13], [-150, 21], [-122, 15], [-96, 27], [-84, 19], [-60, 16], [-38, 20], [-14, 14], [8, 23], [30, 18], [56, 25],
      [74, 29], [96, 20], [118, 17], [140, 22], [166, 15], [190, 24], [214, 16], [240, 12], [268, 19], [302, 11], [340, 7]], 1, 808)
      .map((q) => [q[0], -UNTEN + (q[1] * HOCH + UNTEN) * HUELLE(q[0])]);
    const schnee = (winter ? 8 : 16.5) * HOCH;
    g.save();
    g.beginPath(); g.moveTo(LINKS - 10, -UNTEN); for (const q of kette) g.lineTo(q[0], q[1]); g.lineTo(RECHTS + 10, -UNTEN); g.closePath();
    g.clip();
    const fels = g.createLinearGradient(0, 30, 0, 0);
    fels.addColorStop(0, "#9aa5ba"); fels.addColorStop(0.55, "#77829a"); fels.addColorStop(1, "#8b97ab");
    g.fillStyle = fels; g.fillRect(LINKS - 10, -UNTEN, RECHTS - LINKS + 20, OBEN + UNTEN);
    /* Schnee als Fläche: alles über der Schneegrenze, der untere Rand ausgefranst (Rinnen ziehen Zungen nach unten) */
    const rand = [];
    for (let x = LINKS - 10; x <= RECHTS + 10; x += 1.5) {
      const zunge = Math.pow(h2(Math.round(x * 2), 3, 811), 3) * (winter ? 5 : 4);
      rand.push([x, schnee + Math.sin(x * 0.21) * 1.2 + Math.sin(x * 0.047 + 1) * 1.8 + (h2(Math.round(x), 2, 811) - 0.5) * 1.4 - zunge]);
    }
    g.fillStyle = "rgba(247,250,255,0.96)";
    g.beginPath(); g.moveTo(LINKS - 10, OBEN + 5); g.lineTo(RECHTS + 10, OBEN + 5); for (let i = rand.length - 1; i >= 0; i--) g.lineTo(rand[i][0], rand[i][1]); g.closePath(); g.fill();
    /* Flanken nach Neigung belichtet (Sonne rechts oben): nach rechts fallend = hell, steigend = im Schatten – auf Fels und Schnee */
    for (let j = 1; j < kette.length; j++) {
      const a = kette[j - 1], b = kette[j], steig = (b[1] - a[1]) / Math.max(0.1, b[0] - a[0]);
      const licht = steig < 0 ? Math.min(0.3, -steig * 0.35) : 0, schatten = steig > 0 ? Math.min(0.36, steig * 0.45) : 0;
      const oben = Math.max(a[1], b[1]), tief = 5 + Math.abs(b[0] - a[0]) * 0.8;
      const fl = g.createLinearGradient(0, oben, 0, oben - tief);
      if (licht) { fl.addColorStop(0, "rgba(255,244,222," + licht.toFixed(3) + ")"); fl.addColorStop(1, "rgba(255,244,222,0)"); }
      else { fl.addColorStop(0, "rgba(40,50,92," + schatten.toFixed(3) + ")"); fl.addColorStop(1, "rgba(40,50,92,0)"); }
      g.fillStyle = fl; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(b[0] + 1.2, oben - tief); g.lineTo(a[0] + 1.2, oben - tief); g.closePath(); g.fill();
    }
    /* Rinnen (Couloirs) vom Grat nach unten: im Fels dunkel, im Schnee bläulich */
    for (let j = 0; j < 140; j++) {
      const ix = Math.floor(h2(j, 11, 808) * (kette.length - 1)), p = kette[ix];
      let x = p[0], y = p[1] - 0.3;
      const lang = (p[1] - 2) * (0.2 + h2(j, 13, 808) * 0.35), seite = h2(j, 16, 808) > 0.5 ? 1 : -1;
      for (let st = 1; st <= 5; st++) {
        const nx = x + seite * (0.25 + h2(j, 20 + st, 808) * 0.4), ny = y - lang / 5, imSchnee = ny > schnee;
        g.strokeStyle = imSchnee ? "rgba(120,140,178," + (0.3 * (1 - st / 6)).toFixed(3) + ")" : "rgba(30,36,62," + (0.26 * (1 - st / 6)).toFixed(3) + ")";
        g.lineWidth = 0.35 * (1 - st / 7);
        g.beginPath(); g.moveTo(x, y); g.lineTo(nx, ny); g.stroke();
        x = nx; y = ny;
      }
    }
    g.restore();
    g.strokeStyle = "rgba(255,250,236,0.4)"; g.lineWidth = 0.12; g.beginPath(); kette.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.stroke();
    /* Dunst vor der Kette */
    const du = g.createLinearGradient(0, 14, 0, 0);
    du.addColorStop(0, "rgba(226,236,246,0)"); du.addColorStop(1, "rgba(226,236,246,0.62)");
    g.fillStyle = du; g.fillRect(LINKS - 10, 0, RECHTS - LINKS + 20, 14);
    /* Bewaldete Vorberge, bläulich im Dunst, mit Tannenspitzen */
    const vor = grat([[-340, 3], [-290, 6], [-240, 4], [-190, 7.5], [-150, 5], [-110, 8.5], [-70, 5.5], [-30, 7], [10, 4.5], [50, 8], [90, 6], [130, 9], [170, 5.5], [240, 6.5], [290, 5], [340, 3]], 0.8, 909)
      .map((q) => [q[0], -UNTEN + (q[1] + UNTEN) * HUELLE_VOR(q[0])]);
    g.save();
    g.beginPath(); g.moveTo(LINKS - 10, -UNTEN); for (const q of vor) g.lineTo(q[0], q[1]); g.lineTo(RECHTS + 10, -UNTEN); g.closePath(); g.clip();
    const vg = g.createLinearGradient(0, 9, 0, -UNTEN);
    vg.addColorStop(0, winter ? "#8a9aa8" : "#58765f"); vg.addColorStop(1, winter ? "#a4b2bc" : "#6d8a5c");
    g.fillStyle = vg; g.fillRect(LINKS - 10, -UNTEN, RECHTS - LINKS + 20, 13);
    for (let i = 0; i < 740; i++) {
      const tx = LINKS + h2(i, 1, 177) * (RECHTS - LINKS), ty = -UNTEN + h2(i, 2, 177) * 11, tr = 0.35 + h2(i, 3, 177) * 0.45;
      g.fillStyle = h2(i, 4, 177) > 0.5 ? (winter ? "rgba(70,86,96,0.5)" : "rgba(34,62,44,0.55)") : (winter ? "rgba(236,242,248,0.55)" : "rgba(104,136,96,0.45)");
      g.beginPath(); g.moveTo(tx, ty + tr * 2.4); g.lineTo(tx + tr, ty); g.lineTo(tx - tr, ty); g.closePath(); g.fill();
    }
    g.restore();
    const du2 = g.createLinearGradient(0, 8, 0, -UNTEN);
    du2.addColorStop(0, "rgba(230,240,248,0)"); du2.addColorStop(1, "rgba(230,240,248,0.35)");
    g.fillStyle = du2; g.fillRect(LINKS - 10, -UNTEN, RECHTS - LINKS + 20, 11);
    /* FASSUNG 826 — an beiden Enden weich ausblenden („ausklingen") */
    g.save(); g.globalCompositeOperation = "destination-out";
    for (const seite of [-1, 1]) {
      const a = seite * 262, b = seite * RECHTS, ag = g.createLinearGradient(a, 0, b, 0);
      ag.addColorStop(0, "rgba(0,0,0,0)"); ag.addColorStop(0.55, "rgba(0,0,0,0.55)"); ag.addColorStop(1, "rgba(0,0,0,1)");
      g.fillStyle = ag; g.fillRect(Math.min(a, b), -UNTEN - 1, Math.abs(b - a) + 0.01, OBEN + UNTEN + 2);
    }
    /* … und unten: die Vorberge gehen weich in die Wiese über statt mit einer Kante */
    const ug = g.createLinearGradient(0, -UNTEN + 2.6, 0, -UNTEN);
    ug.addColorStop(0, "rgba(0,0,0,0)"); ug.addColorStop(1, "rgba(0,0,0,1)");
    g.fillStyle = ug; g.fillRect(LINKS - 10, -UNTEN - 1, RECHTS - LINKS + 20, 3.6);
    g.restore();
    /* Tageszeit: Dämmerung rötlich, Nacht tiefblau (nur auf den Bergen) */
    if (stufe > 0) {
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalCompositeOperation = "source-atop";
      g.fillStyle = stufe >= 4 ? "rgba(8,14,34,0.74)" : stufe === 3 ? "rgba(20,26,60,0.6)" : stufe === 2 ? "rgba(70,50,90,0.42)" : "rgba(150,90,80,0.22)";
      g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = "source-over";
    }
    return c;
  }

  /* Himmelsfarben: oben, Mitte, Horizont – Tag, Abend, Nacht */
  const TAG = [[104, 172, 222], [168, 210, 238], [226, 239, 240]];
  const ABEND = [[58, 76, 132], [196, 132, 150], [246, 186, 138]];
  const NACHT = [[3, 5, 14], [10, 18, 40], [30, 44, 70]];
  function farben(n) {
    if (n <= 0.75) { const t = n / 0.75; return TAG.map((f, i) => mischF(f, ABEND[i], t)); }
    const t = (n - 0.75) / 0.25; return ABEND.map((f, i) => mischF(f, NACHT[i], t));
  }

  /* Zufällige Wolken (bei jedem Laden anders), langsam nach rechts ziehend */
  const wolken = [];
  function wolkenMachen() {
    const n = 5 + Math.floor(Math.random() * 4);
    for (let i = 0; i < n; i++) {
      const w = 14 + Math.random() * 26, h = w * (0.3 + Math.random() * 0.14), R = 6;
      const W = Math.ceil(w * R), H = Math.ceil(h * R);
      /* Haufenwolke: runde Ballen oben, unten eine flache, weiche Basis – alle Ballen ganz in der Leinwand */
      const ballen = [], zahl = 9 + Math.floor(Math.random() * 8);
      for (let b = 0; b < zahl; b++) {
        const t = b / (zahl - 1), br = H * (0.2 + Math.random() * 0.16) * (1 - Math.abs(t - 0.5) * 0.9);
        const bx = Math.max(br, Math.min(W - br, W * (0.12 + t * 0.76) + (Math.random() - 0.5) * W * 0.08));
        const by = Math.max(br, Math.min(H * 0.72 - br * 0.25, H * 0.62 - Math.random() * H * 0.25 * (1 - Math.abs(t - 0.5))));
        ballen.push([bx, by, br]);
      }
      const malen = (hell, dunkel, unten) => {
        const c = document.createElement("canvas"); c.width = W; c.height = H;
        const g = c.getContext("2d");
        for (const [bx, by, br] of ballen) {
          const gr = g.createRadialGradient(bx - br * 0.2, by - br * 0.35, br * 0.1, bx, by, br);
          gr.addColorStop(0, hell(0.95)); gr.addColorStop(0.65, hell(0.6)); gr.addColorStop(1, hell(0));
          g.fillStyle = gr; g.beginPath(); g.arc(bx, by, br, 0, Math.PI * 2); g.fill();
        }
        g.globalCompositeOperation = "source-atop";
        const ug = g.createLinearGradient(0, H * 0.35, 0, H * 0.8);
        ug.addColorStop(0, dunkel(0)); ug.addColorStop(1, dunkel(unten));
        g.fillStyle = ug; g.fillRect(0, 0, W, H);
        /* flache Basis weich auslaufen lassen */
        g.globalCompositeOperation = "destination-out";
        const bg = g.createLinearGradient(0, H * 0.7, 0, H);
        bg.addColorStop(0, "rgba(0,0,0,0)"); bg.addColorStop(1, "rgba(0,0,0,1)");
        g.fillStyle = bg; g.fillRect(0, 0, W, H);
        return c;
      };
      const tag = malen((a) => "rgba(255,255,255," + a + ")", (a) => "rgba(128,140,164," + a + ")", 0.55);
      const nacht = malen((a) => "rgba(60,68,92," + a + ")", (a) => "rgba(16,20,34," + a + ")", 0.7);
      wolken.push({ tag: tag, nacht: nacht, w: w, h: h, x: LINKS + Math.random() * (RECHTS - LINKS), y: 13 + Math.random() * 30, v: 0.35 + Math.random() * 0.7 });
    }
  }
  /* Vogelschwarm: kommt alle 25–70 s, fliegt in Keilform quer über den Himmel */
  let schwarm = null, naechsterSchwarm = 6;
  let schnuppe = null, naechsteSchnuppe = 12;

  HM.hinten = function (g, t, Z) {
    const D = ST.dorf; if (!D || D.HORIZONT == null) return;
    const A = ST.proj(D.HORIZONT / 2, D.HORIZONT / 2, 0), Yh = A[1], X0 = A[0], s = K.s;
    if (Yh <= 0) return;
    const n = Z.grad != null ? Z.grad : Z.nacht || 0;
    const X = (mx) => X0 + mx * s, Y = (my) => Yh - my * s;
    /* 1. Himmel */
    const f = farben(n);
    const hg = g.createLinearGradient(0, Math.min(0, Y(60)), 0, Yh);
    hg.addColorStop(0, rgb(f[0])); hg.addColorStop(0.62, rgb(f[1])); hg.addColorStop(1, rgb(f[2]));
    g.fillStyle = hg; g.fillRect(0, 0, K.W, Math.ceil(Yh) + 1);
    /* 2. Sterne (nachts), mit leisem Funkeln */
    if (n > 0.55) {
      const a0 = Math.min(1, (n - 0.55) / 0.35);
      g.fillStyle = "#fff";
      for (let i = 0; i < 260; i++) {
        const mx = LINKS + h2(i, 1, 991) * (RECHTS - LINKS), my = 6 + Math.pow(h2(i, 2, 991), 0.8) * 70;
        const x = X(mx), y = Y(my); if (x < -2 || x > K.W + 2 || y < -2 || y > Yh) continue;
        const fk = 0.55 + 0.45 * Math.sin(t * (1.3 + h2(i, 5, 991) * 2.4) + i);
        g.globalAlpha = a0 * (0.35 + h2(i, 4, 991) * 0.65) * fk * Math.min(1, (Yh - y) / (12 * s));
        const r = (0.5 + h2(i, 3, 991) * 0.9) * K.dpr;
        g.fillRect(x - r / 2, y - r / 2, r, r);
      }
      g.globalAlpha = 1;
      /* Sternschnuppe ab und zu */
      if (!schnuppe && t > naechsteSchnuppe) schnuppe = { t0: t, mx: -120 + Math.random() * 200, my: 40 + Math.random() * 25, dx: 18 + Math.random() * 10, dy: -(7 + Math.random() * 5) };
      if (schnuppe) {
        const p = (t - schnuppe.t0) / 0.9;
        if (p > 1) { schnuppe = null; naechsteSchnuppe = t + 20 + Math.random() * 40; }
        else {
          const x1 = X(schnuppe.mx + schnuppe.dx * p), y1 = Y(schnuppe.my + schnuppe.dy * p), x0 = X(schnuppe.mx + schnuppe.dx * Math.max(0, p - 0.25)), y0 = Y(schnuppe.my + schnuppe.dy * Math.max(0, p - 0.25));
          const sg = g.createLinearGradient(x0, y0, x1, y1); sg.addColorStop(0, "rgba(255,255,255,0)"); sg.addColorStop(1, "rgba(255,255,255," + (a0 * (1 - p) * 0.9).toFixed(3) + ")");
          g.strokeStyle = sg; g.lineWidth = 1.4 * K.dpr; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
        }
      }
    }
    /* 3. Sonne (Tag, rechts oben) bzw. Mond (Nacht) */
    if (n < 0.9) {
      const sx = X(95), sy = Y(30 - n * 22), r = 60 * s * 0.18 + 30 * K.dpr;
      const so = g.createRadialGradient(sx, sy, 0, sx, sy, r * 2.2);
      so.addColorStop(0, "rgba(255,248,214," + (0.9 * (1 - n)).toFixed(3) + ")"); so.addColorStop(0.25, "rgba(255,236,190," + (0.4 * (1 - n)).toFixed(3) + ")"); so.addColorStop(1, "rgba(255,236,190,0)");
      g.fillStyle = so; g.fillRect(sx - r * 2.2, sy - r * 2.2, r * 4.4, r * 4.4);
    }
    if (n > 0.6) {
      const mx = X(-70), my = Y(44), r = Math.max(4 * K.dpr, 2.2 * s), a = Math.min(1, (n - 0.6) / 0.3);
      const mg = g.createRadialGradient(mx, my, 0, mx, my, r * 5); mg.addColorStop(0, "rgba(226,232,255," + (0.3 * a).toFixed(3) + ")"); mg.addColorStop(1, "rgba(226,232,255,0)");
      g.fillStyle = mg; g.fillRect(mx - r * 5, my - r * 5, r * 10, r * 10);
      g.globalAlpha = a; g.fillStyle = "#f3f0de"; g.beginPath(); g.arc(mx, my, r, 0, Math.PI * 2); g.fill();
      g.fillStyle = "rgba(150,150,140,0.35)"; g.beginPath(); g.arc(mx - r * 0.3, my - r * 0.2, r * 0.25, 0, Math.PI * 2); g.arc(mx + r * 0.35, my + r * 0.3, r * 0.18, 0, Math.PI * 2); g.fill();
      g.globalAlpha = 1;
    }
    /* 4. Wolken */
    if (!wolken.length) wolkenMachen();
    const dt = Math.min(0.2, Math.max(0, t - (HM.tAlt || t))); HM.tAlt = t;
    for (const w of wolken) {
      w.x += w.v * dt; if (w.x > RECHTS + 20) w.x = LINKS - w.w - 20;
      const x = X(w.x), y = Y(w.y + w.h), ww = w.w * s, hh = w.h * s;
      if (x > K.W || x + ww < 0 || y > Yh) continue;
      /* tags weiß mit grauer Unterseite, in der Dämmerung überblendet, nachts dunkel vor den Sternen */
      const na = Math.max(0, Math.min(1, (n - 0.45) / 0.45));
      if (na < 1) { g.globalAlpha = 0.95 * (1 - na); g.drawImage(w.tag, x, y, ww, hh); }
      if (na > 0) { g.globalAlpha = 0.85 * na; g.drawImage(w.nacht, x, y, ww, hh); }
    }
    g.globalAlpha = 1;
    /* 5. Vögel (tagsüber) */
    if (n < 0.45) {
      if (!schwarm && t > naechsterSchwarm) {
        const zahl = 3 + Math.floor(Math.random() * 6), rechts = Math.random() < 0.5;
        schwarm = { t0: t, zahl: zahl, rechts: rechts, my: 16 + Math.random() * 24, v: 7 + Math.random() * 4, x0: rechts ? LINKS - 10 : RECHTS + 10 };
      }
      if (schwarm) {
        const S = schwarm, weg = (t - S.t0) * S.v, kopf = S.rechts ? S.x0 + weg : S.x0 - weg;
        if (kopf > RECHTS + 40 || kopf < LINKS - 40) { schwarm = null; naechsterSchwarm = t + 25 + Math.random() * 45; }
        else {
          g.strokeStyle = n > 0.3 ? "rgba(30,26,40,0.8)" : "rgba(36,40,48,0.78)"; g.lineWidth = Math.max(1, 0.12 * s); g.lineCap = "round";
          for (let i = 0; i < S.zahl; i++) {
            const reihe = Math.ceil(i / 2), seite = i % 2 ? 1 : -1;
            const bx = kopf - (S.rechts ? 1 : -1) * reihe * 2.2, by = S.my + seite * reihe * 1.1 + Math.sin(t * 0.7 + i) * 0.3;
            const x = X(bx), y = Y(by), sp = Math.max(3 * K.dpr, 0.7 * s), fl = Math.sin(t * 9 + i * 1.7) * 0.6;
            if (y > Yh) continue;
            g.beginPath(); g.moveTo(x - sp, y - sp * 0.35 * fl); g.quadraticCurveTo(x - sp * 0.45, y - sp * (0.25 + 0.3 * fl), x, y); g.quadraticCurveTo(x + sp * 0.45, y - sp * (0.25 + 0.3 * fl), x + sp, y - sp * 0.35 * fl); g.stroke();
          }
        }
      }
    }
    /* FASSUNG 826 — 5b. Ferner Höhenzug im Dunst über die ganze Bildbreite (hinter den Alpen), blass wie der Horizont */
    {
      const ferne = mischF(f[2], [118, 138, 150], 0.3 * (1 - n * 0.6)), schritt = Math.max(4, 6 * K.dpr);
      const fg = g.createLinearGradient(0, Y(6), 0, Yh);
      fg.addColorStop(0, rgb(ferne, 0.3)); fg.addColorStop(1, rgb(ferne, 0.9));
      g.fillStyle = fg;
      g.beginPath(); g.moveTo(0, Yh + 1);
      for (let x = 0; x <= K.W + schritt; x += schritt) {
        const mx = (x - X0) / s, hh = 2.4 + 1.6 * Math.sin(mx * 0.021 + 1.1) + 1.1 * Math.sin(mx * 0.057 + 0.3) + 0.5 * Math.sin(mx * 0.13);
        g.lineTo(x, Y(Math.max(0.6, hh)));
      }
      g.lineTo(K.W + schritt, Yh + 1); g.closePath(); g.fill();
    }
    /* 6. Die Alpen davor (vorgemalt, skaliert) */
    const stufe = n < 0.2 ? 0 : n < 0.5 ? 1 : n < 0.8 ? 2 : n < 0.95 ? 3 : 4;
    const R = LB.nurKlein ? 3 : LB.spar ? 5 : 7;
    const schl = SZ.jahr + "|" + stufe + "|" + R;
    if (vorrat.schl !== schl) { vorrat.c = vormalen(SZ.jahr, stufe, R); vorrat.R = R; vorrat.schl = schl; }
    g.drawImage(vorrat.c, X(LINKS), Y(OBEN), (RECHTS - LINKS) * s, (OBEN + UNTEN) * s);
    /* FASSUNG 826 — 7. Dunst am Horizont über die ganze Breite: Berge, ferner Höhenzug und Umland gehen ineinander über,
       statt dass der Himmel hart auf die Wiese stößt */
    {
      const a0 = 0.5 * (1 - n * 0.4), y0 = Y(9), y1 = Yh + 7 * s;
      const dg = g.createLinearGradient(0, y0, 0, y1);
      dg.addColorStop(0, rgb(f[2], 0)); dg.addColorStop(0.45, rgb(f[2], (a0 * 0.75).toFixed(3))); dg.addColorStop(0.56, rgb(f[2], a0.toFixed(3))); dg.addColorStop(1, rgb(f[2], 0));
      g.fillStyle = dg; g.fillRect(0, y0, K.W, y1 - y0);
    }
  };
})();
