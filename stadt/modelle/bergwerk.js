/* =====================================================================
   BERGWERK — Erzbergwerk im Harz/Erzgebirge („bergwerk")
   ---------------------------------------------------------------------
   XANDER: „richtig filigran. Richtig schön ausarbeiten mit schönen
   Texturen" · „keine Comic Grafik … viel mehr am Realismus" · „ohne
   Pixelkanten und komische Vektorrückstände" · „Man soll das Fundament
   sehen beim Aufbauen" · „Du bist dein schlimmster Kritiker" · Stil
   „von Anno oder geiler", „trotzdem mit SVG Grafiken".

   VORBILD: kleine Erzgruben im Oberharz (Clausthal, St. Andreasberg,
   Rammelsberg) und im Erzgebirge (Freiberg, Schneeberg) um 1880:
   Über dem Schacht steht ein genietetes Stahl-Fördergerüst („deutsches
   Strebengerüst"): vier Eckstiele aus Gitterträgern, Riegel und
   Andreaskreuze, oben die Seilscheibenbühne mit zwei Seilscheiben
   nebeneinander. Zur Maschine hin stützt eine Strebe mit zwei Beinen
   den Seilzug ab. Die Förderseile laufen von den Scheiben schräg hinab
   in das Maschinenhaus: Bruchstein (Grauwacke) mit Backsteinbögen über
   Rundbogenfenstern, Eckverzahnung und Traufgesims aus Ziegeln, Sockel
   aus Sandstein, Schieferdach. Hinten die Esse der Dampfmaschine.
   Im Felshang vorn links das Mundloch des Stollens mit Türstockausbau
   (zwei Türstöcke, Verzug aus Schwarten, Schild „Glück auf!" mit
   Schlägel und Eisen, Grubenlampe). Aus dem Stollen läuft die
   Grubenbahn (600 mm Spur) zur Erzhalde; zwei Hunte (Loren) stehen
   auf dem Gleis. Vor dem Mundloch ein Stapel Grubenholz.

   MASSE (Meter; Front = Süden = +y, x Osten, z oben; Grund 12 × 12)
     Förderturm   Mitte (−3,7 | −2,3) hinten links, Stiele unten 2,9 × 2,5,
                  oben 2,0 × 1,9, Seilscheibenbühne auf 13,3 m, zwei
                  Scheiben Ø 2,0 m (Achse 14,9 m) → höchster Punkt ≈ 16 m
     Strebe       zwei Beine von der Bühne (x −1,65) zum Fuß (x 1,5)
     Maschinenhaus 3,6 × 6,0 (x 2,3…5,9 · y −4,7…1,3), Traufe 5,4 m,
                  Dachneigung 42°, First ≈ 7,0 m, Tor im Südgiebel
     Esse         1,0 × 1,0 m, 11,6 m hoch, an der Nordgiebelwand
     Felshang     Südwestecke, bis 4,5 m hoch; das Mundloch liegt in der
                  Ostwand (y = 3,6) und schaut damit in der Grundansicht
                  zum Betrachter (Runde 1: im Norden verschwand es ganz
                  hinter Turm und Haus)
     Grubenbahn   gerade vom Mundloch nach Osten bis an die Halde
     Halde        Mitte (3,75 | 4,1) vorn rechts, 3,9 × 3,6 m, 1,6 m hoch

   REIHENFOLGE (Maler-Verfahren des Kerns): Jeder Stahlstab des Gerüsts
   ist ein eigenes Teil (ein schmaler konvexer Kasten) – so wirft das
   Gitter auch einen Gitterschatten statt eines vollen Trapezes, und
   vorn/hinten stimmt in jedem Drehwinkel. Wo zwei Körper sich im Bild
   überdecken können (Haus – Strebenfuß – Seilende, Felshang – Mundloch),
   bekommen die Teile Mitten, die sich nur entlang der trennenden Ebene
   unterscheiden (gleiche Höhe) – dann entscheidet allein die Seite, auf
   der der Betrachter steht.

   AUFBAU (o.bau, Bauzeit 20 min)
     0,00–0,20  Baugruben (Haus, Schacht, Streben), Aushubhaufen,
                Streifenfundament und Einzelfundamente aus Beton
     0,12–0,20  Schachtkragen, Sandsteinsockel
     0,20–0,45  Bruchsteinmauern wachsen Lage für Lage, die Esse bis 0,55
     0,26–0,60  Förderturm Feld für Feld (erst Stiele, dann Riegel, dann
                Kreuze) – in Mennige-Grundierung, Deckanstrich ab 0,85
     0,45–0,52  Dachstuhl (Sparren), 0,50–0,62 Schiefer von der Traufe
     0,55–0,68  Strebe, 0,60 Bühne, 0,64–0,70 Seilscheiben, Geländer
     0,60–0,72  Türstockausbau am Mundloch
     0,72–0,82  Gleis: erst Schwellen, dann Schienen
     0,78–0,80  Förderkörbe und Seile, ab 0,80 wächst die Halde
     0,86–0,95  Fenster, Tor · 0,90 Hunte · 0,95 Schild und Lampe
     1,00       Rauch aus der Esse, Licht in der Nacht
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const hex = PI.hex, rgb = PI.rgb, misch = PI.misch, hell = PI.hell, streu = PI.streu;

  /* ---------------- kleine Werkzeuge ---------------- */
  const TAU = Math.PI * 2, RAD = Math.PI / 180;
  const klemm = (x, a, b) => (x < a ? a : x > b ? b : x);
  const phase = (bau, a, b) => klemm((bau - a) / (b - a), 0, 1);
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const kreuz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const laenge = (a) => Math.hypot(a[0], a[1], a[2]);
  const nrm = (a) => { const l = laenge(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const lerp3 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  const Z3 = [0, 0, 1];
  const zufall = (n) => ST.zufall((n >>> 0) || 1);
  function vieleck(g, p) { g.beginPath(); g.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]); g.closePath(); }
  const malK = (c, k) => [Math.min(255, c[0] * k[0]), Math.min(255, c[1] * k[1]), Math.min(255, c[2] * k[2])];
  /* Rauschen (multiply) und Bleiche (screen) mit versetztem Muster */
  function rausch(g, x, y, w, h, meter, staerke, saat, okt) {
    const s = Math.abs(saat | 0);
    const bild = PI.rauschBild(1 + (s % 5), 128, 4, okt || 3, 1.6);
    const m = g.createPattern(bild, "repeat");
    const k = meter / 128, sx = (s >> 3) % 2 ? -k : k;
    m.setTransform(new DOMMatrix([sx, 0, 0, k, (s * 0.37) % meter, (s * 0.61) % meter]));
    g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }
  function bleich(g, x, y, w, h, meter, staerke, saat) {
    const s = Math.abs(saat | 0);
    const bild = PI.rauschBild(51 + (s % 3), 128, 3, 3, 2.2);
    const m = g.createPattern(bild, "repeat");
    const k = meter / 128;
    m.setTransform(new DOMMatrix([k, 0, 0, k, (s * 0.29) % meter, (s * 0.53) % meter]));
    g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }
  /* Vieleck an einer Halbebene beschneiden: behält f(p) ≥ 0 */
  function schneide(P, f) {
    const aus = [];
    for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length], fa = f(a), fb = f(b);
      if (fa >= 0) aus.push(a);
      if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); aus.push(a.map((v, k) => v + (b[k] - v) * t)); }
    }
    return aus;
  }

  /* ---------------- Licht ----------------
     Durchsichtige Flächen (Geländer, Seilscheiben, Fahrwerk der Hunte,
     Bodenbilder) malen mit keinLicht und belichten sich selbst. */
  function lichtN(F, n) {
    let nn = n || F.n;
    if (!n && F.sicht < 0) nn = [-nn[0], -nn[1], -nn[2]];
    return ST.lichtFaktor(nn, F.zeit, 0, F.jahr);
  }
  const litF = (c, L, a) => rgb(malK(c, L), a);
  /* Licht für aufrecht gemalte Figuren (links Sonne, rechts Schatten) */
  function figurLicht(F) {
    const Zt = F.Z || ST.ZEITEN.tag;
    const L = ST.lichtFaktor([-0.707, 0.707, 0], Zt, 0, F.jahr), R = ST.lichtFaktor([0.707, -0.707, 0], Zt, 0, F.jahr), O = ST.lichtFaktor([0, 0, 1], Zt, 0, F.jahr);
    return { L: L, R: R, O: O, lit: (c, l, a) => rgb(malK(c, l), a) };
  }
  /* Versatz in Flächenkoordinaten für einen Punkt, der d Meter entlang
     der Außennormale vor (d > 0) bzw. hinter (d < 0) der Fläche liegt.
     Damit malen wir Laibungen, Stollentiefe und Radkränze so, wie man sie
     aus DIESEM Winkel wirklich sieht. */
  function tiefe(g, F, d) {
    const m = g.getTransform(), n = F.n, s = F.s;
    const X = (n[0] - n[1]) * ST.KX * s * d, Y = ((n[0] + n[1]) * ST.KY - n[2] * ST.KZ) * s * d;
    const det = m.a * m.d - m.b * m.c || 1e-9;
    return [(X * m.d - Y * m.c) / det, (m.a * Y - m.b * X) / det];
  }

  /* Drehung Modell → Kamera aus der Flächenabbildung zurückrechnen (u
     liegt bei polyF immer waagerecht) – für eigenes, weiches Licht */
  function drehung(g, F) {
    const m = g.getTransform(), f = F.flaeche, s = F.s;
    const d = m.a / (ST.KX * s), e = (m.b + f.u[2] * ST.KZ * s) / (ST.KY * s);
    const th = Math.atan2((e - d) / 2, (d + e) / 2) - Math.atan2(f.u[1], f.u[0]);
    return [Math.cos(th), Math.sin(th)];
  }
  /* Weiches Licht (Gouraud): Die Fläche malt ihren Werkstoff, danach
     wird das Licht aus den Eckennormalen linear über das Dreieck gelegt.
     So zeigt ein aus Dreiecken gebauter Haufen oder Hang keine harten
     Facettenkanten. Fläche braucht ecken (Weltpunkte) und vn (Normalen). */
  /* Die Fläche wird auf einer eigenen Leinwand fertig gemalt und belichtet
     und erst dann (im Kern-Umriss) übertragen: sonst blieben an den
     kantengeglätteten Rändern Säume aus unbelichtetem Werkstoff stehen
     (nachts als helle Netzlinien über dem Haufen zu sehen). */
  let NEBEN = null;
  function nebenLeinwand(w, h) {
    if (!NEBEN) NEBEN = document.createElement("canvas").getContext("2d");
    const c = NEBEN.canvas;
    if (c.width < w || c.height < h) { c.width = Math.max(c.width, w, 64); c.height = Math.max(c.height, h, 64); }
    return NEBEN;
  }
  function weich(malen) {
    return function (g, F) {
      const f = F.flaeche, [c, sn] = drehung(g, F);
      const m = g.getTransform();
      const ecken = [[0, 0], [F.w, 0], [0, F.h], [F.w, F.h]].map(([a, b]) => [m.a * a + m.c * b + m.e, m.b * a + m.d * b + m.f]);
      const x0 = Math.floor(Math.min(...ecken.map((p) => p[0]))) - 2, y0 = Math.floor(Math.min(...ecken.map((p) => p[1]))) - 2;
      const x1 = Math.ceil(Math.max(...ecken.map((p) => p[0]))) + 2, y1 = Math.ceil(Math.max(...ecken.map((p) => p[1]))) + 2;
      const W = x1 - x0, H = y1 - y0;
      if (W <= 0 || H <= 0 || W * H > 16e6) return;
      const q = nebenLeinwand(W, H);
      q.setTransform(1, 0, 0, 1, 0, 0); q.clearRect(0, 0, W + 2, H + 2);
      q.globalAlpha = 1; q.globalCompositeOperation = "source-over";
      q.setTransform(m.a, m.b, m.c, m.d, m.e - x0, m.f - y0);
      q.save(); malen(q, F); q.restore();
      const Ls = f.vn.map((n) => ST.lichtFaktor([n[0] * c - n[1] * sn, n[0] * sn + n[1] * c, n[2]], F.zeit, 0, F.jahr));
      const Q = f.ecken.map((p) => { const d = sub(p, f.o); return [dot(d, f.u), dot(d, f.v)]; });
      q.save(); q.globalCompositeOperation = "multiply";
      const farbe = (L) => rgb(L.map((v) => Math.min(255, v * 255)));
      if (Q.length === 3) {
        const l = Ls.map((L) => L[1]);
        const a1 = Q[1][0] - Q[0][0], b1 = Q[1][1] - Q[0][1], a2 = Q[2][0] - Q[0][0], b2 = Q[2][1] - Q[0][1];
        const det = a1 * b2 - a2 * b1, dl1 = l[1] - l[0], dl2 = l[2] - l[0];
        const al = det ? (dl1 * b2 - dl2 * b1) / det : 0, be = det ? (a1 * dl2 - a2 * dl1) / det : 0;
        let imin = 0, imax = 0;
        for (let i = 1; i < 3; i++) { if (l[i] < l[imin]) imin = i; if (l[i] > l[imax]) imax = i; }
        const dd = al * al + be * be, span = l[imax] - l[imin];
        if (dd > 1e-8 && span > 1e-4) {
          const p0 = Q[imin], k = span / dd;
          const gr = q.createLinearGradient(p0[0], p0[1], p0[0] + al * k, p0[1] + be * k);
          gr.addColorStop(0, farbe(Ls[imin])); gr.addColorStop(1, farbe(Ls[imax]));
          q.fillStyle = gr;
        } else q.fillStyle = farbe(Ls[0]);
      } else {
        const mm = [0, 1, 2].map((k) => Ls.reduce((a, L) => a + L[k], 0) / Ls.length);
        q.fillStyle = farbe(mm);
      }
      q.fillRect(-1, -1, F.w + 2, F.h + 2);
      /* Kontaktschatten am Fuß (wie im Kern) */
      if (f.aoWeich && Math.abs(f.N[2]) < 0.5) {
        const hoch = Math.min(0.55, F.h * 0.5), gr = q.createLinearGradient(0, F.h, 0, F.h - hoch);
        gr.addColorStop(0, "rgba(70,70,90,1)"); gr.addColorStop(1, "rgba(255,255,255,1)");
        q.fillStyle = gr; q.fillRect(-1, F.h - hoch, F.w + 2, hoch + 1);
      }
      q.restore();
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
      g.drawImage(q.canvas, 0, 0, W, H, x0, y0, W, H);
      g.restore();
    };
  }
  /* Eckennormalen: Flächennormalen (nach außen) je Ecke gemittelt */
  function eckNormalen(dreiecke, innen) {
    const key = (p) => p[0].toFixed(3) + "," + p[1].toFixed(3) + "," + p[2].toFixed(3);
    const summe = new Map();
    for (const D of dreiecke) {
      let n = nrm(kreuz(sub(D[1], D[0]), sub(D[2], D[0])));
      const c = [(D[0][0] + D[1][0] + D[2][0]) / 3, (D[0][1] + D[1][1] + D[2][1]) / 3, (D[0][2] + D[1][2] + D[2][2]) / 3];
      const inn = typeof innen === "function" ? innen(D) : innen;
      if (dot(n, sub(c, inn)) < 0) n = mul(n, -1);
      for (const p of D) { const k = key(p); summe.set(k, add(summe.get(k) || [0, 0, 0], n)); }
    }
    return (p) => nrm(summe.get(key(p)) || Z3);
  }

  /* ---------------- Flächen ----------------
     polyF: ebenes Vieleck aus Weltpunkten. u liegt waagerecht (entlang
     der Fläche), v zeigt die Fläche hinab – bei Wänden also nach unten,
     bei Dächern von First zur Traufe. innen = Punkt im Körper: danach
     wird die Außenseite gewählt. */
  function polyF(M, name, P, malen, opt) {
    opt = opt || {};
    let nx = 0, ny = 0, nz = 0;
    for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length];
      nx += (a[1] - b[1]) * (a[2] + b[2]); ny += (a[2] - b[2]) * (a[0] + b[0]); nz += (a[0] - b[0]) * (a[1] + b[1]);
    }
    let N = nrm([nx, ny, nz]);
    if (opt.innen) {
      const c = P.reduce((s, p) => add(s, p), [0, 0, 0]).map((v) => v / P.length);
      if (dot(N, sub(c, opt.innen)) < 0) { P = P.slice().reverse(); N = mul(N, -1); }
    }
    let u = kreuz(N, Z3);
    u = laenge(u) < 0.05 ? (N[2] > 0 ? [1, 0, 0] : [1, 0, 0]) : nrm(u);
    const v = kreuz(N, u);
    const Q = P.map((p) => { const d = sub(p, P[0]); return [dot(d, u), dot(d, v)]; });
    let a0 = Infinity, b0 = Infinity, a1 = -Infinity, b1 = -Infinity;
    for (const q of Q) { a0 = Math.min(a0, q[0]); a1 = Math.max(a1, q[0]); b0 = Math.min(b0, q[1]); b1 = Math.max(b1, q[1]); }
    const o = add(add(P[0], mul(u, a0)), mul(v, b0));
    const f = Object.assign({ name: name, o: o, u: u, v: v, w: a1 - a0, h: b1 - b0, umriss: Q.map((q) => [q[0] - a0, q[1] - b0]), malen: malen }, opt);
    delete f.innen; delete f.vnFn;
    f.N = N; f.ecken = P;
    if (opt.vnFn) { f.vn = opt.vnFn === "flach" ? P.map(() => N) : P.map(opt.vnFn); f.keinLicht = true; f.aoWeich = !!opt.ao; f.malen = weich(malen); }
    return M.flaeche(f);
  }
  /* Senkrechte Wand von p0 nach p1 (von außen: links → rechts), z0…z1 */
  function wandF(M, name, p0, p1, z0, z1, malen, opt) {
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1], w = Math.hypot(dx, dy);
    return M.flaeche(Object.assign({ name: name, o: [p0[0], p0[1], z1], u: [dx / w, dy / w, 0], v: [0, 0, -1], w: w, h: z1 - z0, malen: malen }, opt || {}));
  }
  /* Weltpunkt eines Flächenpunkts */
  function welt(f, a, b) { return [f.o[0] + f.u[0] * a + f.v[0] * b, f.o[1] + f.u[1] * a + f.v[1] * b, f.o[2] + f.u[2] * a + f.v[2] * b]; }
  /* Unsichtbare Fläche (Bildgrenzen) */
  const LEER = { malen: null, keinLicht: true, keinAo: true };

  /* Stab: Kasten beliebiger Richtung P0 → P1, Querschnitt b (quer) × d
     (entlang R, meist „oben"). Vier Mantelflächen, je Stab ein Teil.
     mal(N, rolle) liefert den Maler einer Seite (N = Außennormale). */
  function stab(M, name, P0, P1, b, d, mal, opt) {
    opt = opt || {};
    const ax = sub(P1, P0), L = laenge(ax);
    if (L < 1e-3) return;
    const A = mul(ax, 1 / L);
    let R = opt.oben || Z3;
    R = sub(R, mul(A, dot(R, A)));
    if (laenge(R) < 0.12) { R = opt.quer || [1, 0, 0]; R = sub(R, mul(A, dot(R, A))); }
    R = nrm(R);
    const Q = nrm(kreuz(A, R));
    const mid = add(P0, mul(ax, 0.5));
    if (opt.teil !== false) M.teil(name, Object.assign({ schatten: opt.schatten !== false }, opt.mitte ? { mitte: opt.mitte } : {}, opt.ebene ? { ebene: opt.ebene } : {}));
    const seiten = [[R, d / 2, b, "R"], [mul(R, -1), d / 2, b, "r"], [Q, b / 2, d, "Q"], [mul(Q, -1), b / 2, d, "q"]];
    for (const [N, halb, breite, rolle] of seiten) {
      const c = add(mid, mul(N, halb));
      const v = kreuz(N, A);
      const o = sub(sub(c, mul(A, L / 2)), mul(v, breite / 2));
      M.flaeche(Object.assign({ name: name + rolle, o: o, u: A, v: v, w: L, h: breite, malen: mal(N, rolle, L, breite), keinAo: !opt.ao, ao: !!opt.ao }, opt.extra || {}));
    }
    if (opt.enden) {
      for (const [P, s] of [[P0, -1], [P1, 1]]) {
        const N = mul(A, s), v = kreuz(N, Q);
        const o = sub(sub(P, mul(Q, b / 2)), mul(v, d / 2));
        M.flaeche({ name: name + (s > 0 ? "e" : "a"), o: o, u: Q, v: v, w: b, h: d, malen: mal(N, "ende", b, d), keinAo: true });
      }
    }
  }

  /* =====================================================================
     MASSE
     ===================================================================== */
  const TX = -3.7, TY = -2.3;                       // Förderturm über dem Schacht
  const BX0 = 1.45, BY0 = 1.25, BX1 = 1.0, BY1 = 0.95;
  const Z_FUSS = 0.35, Z_BUEHNE = 13.3, Z_DECK = 13.55;
  const EBENEN = [0.35, 2.9, 5.5, 8.1, 10.7, 13.3];
  const BUEHNE = { x0: TX - 1.2, x1: TX + 2.25, y0: TY - 1.12, y1: TY + 1.12 };
  const SCHEIBE = { x: TX + 0.95, z: 14.9, r: 1.0, ys: [TY - 0.55, TY + 0.55], b: 0.2 };
  const STREBE_OBEN = [TX + 2.05, 13.3], STREBE_FUSS = [1.5, 0.35], STREBE_YO = 1.0, STREBE_YU = 1.35;
  const HAUS = { x0: 2.3, x1: 5.9, y0: -4.7, y1: 1.3, zs: 0.55, ze: 5.4 };
  HAUS.xm = (HAUS.x0 + HAUS.x1) / 2;
  HAUS.neig = Math.tan(42 * RAD);
  HAUS.zf = HAUS.ze + (HAUS.xm - HAUS.x0) * HAUS.neig;       // First ≈ 7,02
  const UE_T = 0.32, UE_G = 0.26;                             // Überstand Traufe / Giebel
  const HAUS_MITTE = [HAUS.xm, TY, 2.0];
  const SEIL_ZIEL = [HAUS.x0, null, 4.62];                    // Seile treten auf 4,6 m in die Westwand
  const KAMIN = { x: HAUS.xm, y: HAUS.y0 - 0.55, b0: 1.0, b1: 0.78, h: 11.6 };
  const HALDE = { x: 3.75, y: 4.1, r: 1.95, h: 1.6 };
  const STOLLEN_Y = 3.6, PORTAL_X = -1.8;                 // Mundloch in der Ostwand des Felshangs
  /* Grubenbahn: gerade aus dem Stollen nach Süden, im Bogen (r 2,2) nach Westen */
  const GLEIS_ENDE = 1.75;

  /* ---------------- Varianten (o.saat) ---------------- */
  const STAHL = [[112, 48, 36], [48, 70, 58], [62, 64, 68]];        // Oxidrot, Grubengrün, Anthrazit
  const MENNIGE = [190, 86, 48];
  const TORFARBE = [[58, 74, 60], [96, 52, 36], [70, 60, 48]];
  const JAHRE = [1869, 1872, 1874, 1878, 1881, 1886];
  const VAR = {};
  function variante(o) {
    const k = o.saat || 1;
    if (VAR[k]) return VAR[k];
    const r = zufall(k * 7919 + 71);
    const nimm = (a) => a[Math.floor(r() * a.length) % a.length];
    const v = { stahl: nimm(STAHL), tor: nimm(TORFARBE), jahr: nimm(JAHRE), saat: k, erzA: r() < 0.5, fichten: 2 + ((r() * 2) | 0) };
    VAR[k] = v;
    return v;
  }

  /* =====================================================================
     WERKSTOFFE
     ===================================================================== */
  const MOERTEL = [178, 172, 160];
  const SANDSTEIN = [184, 160, 128];
  const ZIEGEL = [150, 66, 46];
  const HOLZ = [118, 86, 58], HOLZ_ALT = [104, 88, 70], RINDE = [86, 66, 48];
  const BETON = [168, 166, 158];
  const SCHNEE = [244, 247, 252];

  /* ---------------- Bruchstein (Grauwacke) ----------------
     nach dem Verfahren der Wassermühle: Lagen aus unregelmäßigen,
     bossierten Steinen, nach Farbeimern gebündelt gemalt. Die Harzer
     Grauwacke ist grau bis grünlich braun, einzelne Steine rostig. */
  const BS_FARBEN = [[126, 122, 112], [110, 106, 98], [140, 134, 120], [102, 96, 88], [150, 144, 130], [122, 112, 96], [94, 92, 86], [136, 118, 98], [116, 116, 108], [132, 128, 122]];
  const BS_CACHE = new Map(), BS_PFADE = new Map();
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
  function bruchLayout(saat, w, h) {
    const key = saat + "|" + w.toFixed(2) + "|" + h.toFixed(2);
    let L = BS_CACHE.get(key);
    if (L) return L;
    const rng = zufall(saat * 977 + 13);
    const steine = [];
    const neu = (s0, t0, s1, t1, yb, yt) => {
      if (s1 - s0 < 0.04 || t1 - t0 < 0.03) return;
      steine.push({ pts: steinUmriss(rng, s0, t0, s1, t1), box: [s0, t0, s1, t1], c: (rng() * BS_FARBEN.length) | 0, k: (rng() * 3) | 0, yb: yb, yt: yt, fl: rng() });
    };
    let yb = h, reihe = 0;
    while (yb > 0.005) {
      const gross = reihe < 2;
      let rh = (gross ? 0.28 : 0.17) + rng() * (gross ? 0.14 : 0.16);
      if (yb - rh < 0.12) rh = yb;
      const yt = yb - rh;
      let x = -rng() * 0.4;
      while (x < w) {
        const lw = Math.max(0.18, rh * (0.9 + rng() * 1.9));
        const x1 = x + lw, m = 0.022 + rng() * 0.018, art = rng();
        if (art < 0.22 && rh > 0.22) {
          const tm = yt + rh * (0.38 + rng() * 0.24);
          neu(x + m, yt + m * 0.7, x1 - m, tm - m * 0.5, yb, yt);
          neu(x + m, tm + m * 0.5, x1 - m, yb - m * 0.7, yb, yt);
        } else if (art < 0.36) {
          const tz = yt + rh * (0.16 + rng() * 0.12);
          neu(x + m, tz + m * 0.4, x1 - m, yb - m * 0.7, yb, yt);
          const za = x + (x1 - x) * (0.15 + rng() * 0.4);
          neu(za, yt + m * 0.6, za + Math.min(x1 - za - m, 0.12 + rng() * 0.18), tz - m * 0.3, yb, yt);
        } else neu(x + m, yt + m * 0.7 + (rng() < 0.3 ? rng() * 0.04 : 0), x1 - m, yb - m * 0.7, yb, yt);
        x = x1;
      }
      yb = yt; reihe++;
    }
    L = { steine: steine };
    BS_CACHE.set(key, L);
    if (BS_CACHE.size > 60) BS_CACHE.delete(BS_CACHE.keys().next().value);
    return L;
  }
  function bruchPfade(L, key, fein, ab) {
    const k = key + (fein ? "|f" : "|g") + "|" + (ab == null ? "" : ab.toFixed(2));
    let P = BS_PFADE.get(k);
    if (P) return P;
    const eimer = new Map(), licht = new Path2D(), fuge = new Path2D();
    for (const s of L.steine) {
      if (ab != null && s.yt < ab - 0.01) continue;
      const ek = s.c * 3 + s.k;
      let e = eimer.get(ek);
      if (!e) { e = { stein: new Path2D(), kern: fein ? new Path2D() : null }; eimer.set(ek, e); }
      if (fein) {
        const p = s.pts; e.stein.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) e.stein.lineTo(p[i][0], p[i][1]); e.stein.closePath();
        const b = s.box, cx = (b[0] + b[2]) / 2 - 0.012, cy = (b[1] + b[3]) / 2 - 0.012, kk = 0.6;
        e.kern.moveTo(cx + (p[0][0] - cx) * kk, cy + (p[0][1] - cy) * kk);
        for (let i = 1; i < p.length; i++) e.kern.lineTo(cx + (p[i][0] - cx) * kk, cy + (p[i][1] - cy) * kk);
        e.kern.closePath();
        licht.moveTo(p[14][0], p[14][1]); for (const i of [15, 16, 0, 1, 2, 3]) licht.lineTo(p[i][0], p[i][1]);
        fuge.moveTo(p[6][0], p[6][1]); for (let i = 7; i <= 13; i++) fuge.lineTo(p[i][0], p[i][1]);
      } else e.stein.rect(s.box[0], s.box[1], s.box[2] - s.box[0], s.box[3] - s.box[1]);
    }
    P = { eimer: eimer, licht: licht, fuge: fuge };
    BS_PFADE.set(k, P);
    if (BS_PFADE.size > 100) BS_PFADE.delete(BS_PFADE.keys().next().value);
    return P;
  }
  /* ab = Flächen-y, oberhalb dessen noch nicht gemauert ist (Bau) */
  function bruchsteinMalen(g, F, x, y, w, h, saat, ab) {
    const px = F.px;
    const y0 = ab == null ? y : Math.max(y, ab);
    g.fillStyle = rgb(MOERTEL); g.fillRect(x - 0.02, y0 - 0.02, w + 0.04, y + h - y0 + 0.04);
    if (px < 5) { g.fillStyle = "rgba(118,112,102,0.85)"; g.fillRect(x, y0, w, y + h - y0); rausch(g, x, y0, w, y + h - y0, 3, 0.2, saat, 3); return; }
    if (px > 20) rausch(g, x, y0, w, y + h - y0, 0.7, 0.16, saat + 2, 3);
    const L = bruchLayout(saat, w, h);
    const fein = px > 30;
    const P = bruchPfade(L, saat + "|" + w.toFixed(2) + "|" + h.toFixed(2), fein, ab == null ? null : ab - y);
    g.save(); g.translate(x, y);
    for (const [key, e] of P.eimer) {
      const c = hell(BS_FARBEN[(key / 3) | 0], (key % 3 - 1) * 0.07);
      g.fillStyle = rgb(c); g.fill(e.stein);
      if (e.kern) { g.fillStyle = rgb(hell(c, 0.07)); g.fill(e.kern); }
    }
    if (fein) {
      g.lineWidth = Math.max(0.006, 1.1 / px);
      g.strokeStyle = "rgba(250,246,236," + (F.lichtN > 0.05 ? 0.28 : 0.13) + ")"; g.stroke(P.licht);
      g.strokeStyle = "rgba(34,30,26,0.42)"; g.lineWidth = Math.max(0.008, 1.4 / px); g.stroke(P.fuge);
    } else if (px > 12) {
      g.fillStyle = "rgba(36,30,26,0.26)"; g.beginPath();
      for (const s of L.steine) if (ab == null || s.yt >= ab - y - 0.01) g.rect(s.box[0], s.box[3] - Math.max(0.012, 1.1 / px), s.box[2] - s.box[0], Math.max(0.012, 1.1 / px));
      g.fill();
    }
    g.restore();
    rausch(g, x, y0, w, y + h - y0, 2.8, 0.14, saat + 5, 4);
    if (px > 12) bleich(g, x, y0, w, y + h - y0, 2.2, 0.06, saat + 1);
  }

  /* ---------------- Ziegel ----------------
     Läuferverband, Ziegel 25 × 6,5 cm, Fuge 1 cm */
  function ziegelMalen(g, F, x, y, w, h, saat, opt) {
    opt = opt || {};
    const px = F.px, basis = opt.farbe || ZIEGEL, rh = 0.075, lb = 0.26;
    g.fillStyle = rgb(opt.fuge || [170, 160, 146]); g.fillRect(x, y, w, h);
    if (px * rh < 2.2) { g.fillStyle = rgb(basis); g.fillRect(x, y, w, h); rausch(g, x, y, w, h, 2, 0.2, saat, 3); return; }
    const rng = zufall(saat * 13 + 5);
    const TOENE = 5, eimer = [];
    for (let i = 0; i < TOENE; i++) eimer.push(new Path2D());
    for (let yy = y + h, r = 0; yy > y - rh; yy -= rh, r++) {
      const v = (r % 2) * lb / 2;
      for (let xx = x - v; xx < x + w; xx += lb) eimer[(rng() * TOENE) | 0].rect(xx + 0.005, yy - rh + 0.005, lb - 0.01, rh - 0.01);
    }
    for (let i = 0; i < TOENE; i++) { g.fillStyle = rgb(hell(basis, (i - 2) * 0.07)); g.fill(eimer[i]); }
    rausch(g, x, y, w, h, 1.6, 0.18, saat + 3, 3);
  }

  /* ---------------- Sandsteinquader ---------------- */
  function quaderMalen(g, F, x, y, w, h, saat, opt) {
    opt = opt || {};
    const rng = zufall(saat), px = F.px, basis = opt.farbe || SANDSTEIN, lage = opt.lage || 0.3;
    g.fillStyle = rgb(hell(basis, -0.3)); g.fillRect(x, y, w, h);
    let yy = y + h, reihe = 0;
    while (yy > y + 0.001) {
      const lh = Math.min(lage * (0.85 + rng() * 0.3), yy - y);
      let xx = x - (reihe % 2 ? lage * 0.9 : 0) - rng() * 0.1;
      while (xx < x + w) {
        const lw = (opt.laenge || lage * 2) * (0.8 + rng() * 0.5);
        const c = streu(basis, rng, 0.08);
        const bx = Math.max(x, xx) + 0.008, bw = Math.min(x + w, xx + lw) - Math.max(x, xx) - 0.016;
        if (bw > 0.02) {
          g.fillStyle = rgb(c); g.fillRect(bx, yy - lh + 0.008, bw, lh - 0.016);
          if (px > 18) {
            g.fillStyle = "rgba(255,244,226,0.2)"; g.fillRect(bx, yy - lh + 0.008, bw, Math.max(0.006, 1 / px));
            g.fillStyle = "rgba(40,24,16,0.22)"; g.fillRect(bx, yy - 0.008 - Math.max(0.006, 1 / px), bw, Math.max(0.006, 1 / px));
          }
        }
        xx += lw;
      }
      yy -= lh; reihe++;
    }
    rausch(g, x, y, w, h, 1.6, 0.2, saat + 3, 3);
  }

  /* ---------------- Holz ---------------- */
  function holzMalen(g, F, x, y, w, h, c, saat, opt) {
    opt = opt || {};
    const rng = zufall(saat);
    g.fillStyle = rgb(c); g.fillRect(x, y, w, h);
    const px = F.px;
    if (px * h > 3 && px > 10) {
      const n = Math.max(2, Math.min(24, Math.round(h * 40)));
      g.lineWidth = Math.max(0.003, 0.9 / px);
      for (let i = 0; i < n; i++) {
        const yy = y + h * (i + 0.5) / n + (rng() - 0.5) * h * 0.04;
        g.strokeStyle = rgb(hell(c, -0.2 - rng() * 0.2), 0.16 + rng() * 0.22);
        g.beginPath(); g.moveTo(x + rng() * w * 0.2, yy);
        for (let k = 1; k <= 4; k++) g.lineTo(x + w * k / 4, yy + (rng() - 0.5) * h * 0.05);
        g.stroke();
      }
    }
    if (opt.rauh !== false) rausch(g, x, y, w, h, 0.9, 0.2, saat + 3, 3);
  }
  /* Bretter nebeneinander (senkrecht = Fugen senkrecht) */
  function bretterMalen(g, F, x, y, w, h, c, saat, opt) {
    opt = opt || {};
    const rng = zufall(saat), bb = opt.breite || 0.2, senk = opt.senkrecht !== false;
    const L = senk ? w : h, n = Math.max(1, Math.round(L / bb));
    for (let i = 0; i < n; i++) {
      const cc = streu(c, rng, 0.1);
      if (senk) { g.save(); g.translate(x + w * i / n, y + h); g.rotate(-Math.PI / 2); holzMalen(g, F, 0, 0, h, w / n, cc, saat + i * 7, { rauh: false }); g.restore(); }
      else holzMalen(g, F, x, y + h * i / n, w, h / n, cc, saat + i * 7, { rauh: false });
    }
    if (F.px * bb > 4) {
      g.fillStyle = rgb(hell(c, -0.6), 0.8);
      for (let i = 1; i < n; i++) { if (senk) g.fillRect(x + w * i / n - 0.006, y, 0.012, h); else g.fillRect(x, y + h * i / n - 0.006, w, 0.012); }
    }
    rausch(g, x, y, w, h, 1.2, 0.2, saat + 11, 3);
  }

  /* ---------------- Schnee als Decke auf einer Fläche ---------------- */
  function schneeDecke(g, F, x, y, w, h, saat, deck) {
    const rng = zufall(saat);
    g.save();
    g.globalAlpha = deck == null ? 1 : deck;
    g.fillStyle = rgb(SCHNEE); g.fillRect(x, y, w, h);
    g.globalAlpha = 1;
    rausch(g, x, y, w, h, 2.4, 0.08, saat, 3);
    if (F.px > 10) {
      for (let i = 0; i < w * h * 0.5 + 1; i++) {
        const cx = x + rng() * w, cy = y + rng() * h, rx = 0.3 + rng() * 0.8;
        const gg = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
        gg.addColorStop(0, "rgba(168,188,222,0.16)"); gg.addColorStop(1, "rgba(168,188,222,0)");
        g.fillStyle = gg; g.fillRect(cx - rx, cy - rx, rx * 2, rx * 2);
      }
    }
    if (F.px > 22) { g.fillStyle = "rgba(255,255,255,0.9)"; for (let i = 0; i < w * h * 5; i++) { const r = (0.5 + rng()) / F.px; g.fillRect(x + rng() * w, y + rng() * h, r, r); } }
    g.restore();
  }

  /* =====================================================================
     BAUPHASEN
     ===================================================================== */
  function zustand(bau) {
    const f = (a, b) => phase(bau, a, b);
    const Z = { bau: bau, fertig: bau >= 0.999 };
    Z.grube = bau < 0.2 ? { tiefe: f(0.005, 0.06), beton: f(0.08, 0.13), verfuellt: f(0.13, 0.19) } : null;
    Z.haufen = bau < 0.14 ? f(0.005, 0.08) : bau < 0.24 ? 1 - f(0.14, 0.24) : 0;
    Z.fundament = bau >= 0.1;
    Z.kragen = f(0.12, 0.2);
    Z.sockel = f(0.15, 0.2);
    Z.wand = f(0.2, 0.45);
    Z.kamin = f(0.22, 0.55);
    Z.turm = f(0.26, 0.6);
    Z.stuhl = bau >= 0.45 && bau < 0.64 ? f(0.45, 0.5) : 0;
    Z.dach = f(0.5, 0.62);
    Z.strebe = f(0.55, 0.68);
    Z.buehne = bau >= 0.6;
    Z.scheiben = bau >= 0.66;
    Z.gelaender = bau >= 0.68;
    Z.tuerstock = f(0.6, 0.72);
    Z.gleis = f(0.72, 0.82);
    Z.korb = bau >= 0.78;
    Z.seile = bau >= 0.8;
    Z.halde = bau >= 0.8 ? 0.15 + 0.85 * f(0.8, 1) : 0;
    Z.fenster = bau >= 0.86;
    Z.tor = bau >= 0.9;
    Z.anstrich = bau >= 0.85;
    Z.loren = bau >= 0.9;
    Z.schild = bau >= 0.95;
    Z.laterne = bau >= 0.95;
    Z.holz = bau >= 0.26;
    Z.schnee = bau >= 0.9;
    Z.licht = Z.fertig;
    return Z;
  }

  /* =====================================================================
     STAHL — genietete Profile und Gitterträger
     ===================================================================== */
  function stahlFarbe(V, Z) { return Z.anstrich ? V.stahl : MENNIGE; }
  /* art: "gitter" (Stiele, Riegel: zwei Gurte, dazwischen Diagonalen –
     man sieht hindurch ins Dunkle), "winkel" (Kreuze), "blech" (Bühne) */
  function stahlMaler(c, art, N, winter, saat) {
    const oben = N[2];
    return function (g, F) {
      const w = F.w, h = F.h, px = F.px;
      g.fillStyle = rgb(c); g.fillRect(-0.02, -0.02, w + 0.04, h + 0.04);
      if (art === "gitter" && px * h > 6) {
        const gb = h * 0.2;
        g.fillStyle = rgb(hell(c, -0.62)); g.fillRect(0, gb, w, h - 2 * gb);
        const st = (h - 2 * gb) * 1.15;
        g.strokeStyle = rgb(hell(c, -0.06)); g.lineWidth = Math.max(h * 0.1, 0.9 / px); g.lineCap = "butt";
        g.beginPath();
        for (let x = -st; x < w + st; x += st) { g.moveTo(x, gb); g.lineTo(x + st / 2, h - gb); g.lineTo(x + st, gb); }
        g.stroke();
        if (px * h > 26) {
          g.strokeStyle = rgb(hell(c, -0.06)); g.lineWidth = h * 0.06;
          g.beginPath(); for (let x = -st; x < w + st; x += st) { g.moveTo(x + st / 2, gb); g.lineTo(x, h - gb); } g.stroke();
        }
        /* Gurte mit Lichtkante */
        g.fillStyle = rgb(hell(c, 0.1)); g.fillRect(0, 0, w, gb * 0.35);
        g.fillStyle = rgb(hell(c, -0.2)); g.fillRect(0, gb * 0.8, w, gb * 0.2); g.fillRect(0, h - gb, w, gb * 0.2);
      } else if (art === "gitter") {
        g.fillStyle = rgb(hell(c, -0.35)); g.fillRect(0, h * 0.3, w, h * 0.4);
      } else if (art === "winkel" && px * h > 5) {
        g.fillStyle = rgb(hell(c, -0.3)); g.fillRect(0, h * 0.62, w, h * 0.38);
        g.fillStyle = rgb(hell(c, 0.12)); g.fillRect(0, 0, w, h * 0.16);
      }
      /* Niete an den Gurten */
      if (px > 42 && art !== "blech") {
        const r = Math.max(0.008, Math.min(0.016, h * 0.05)), ab = 0.11;
        g.fillStyle = rgb(hell(c, -0.45));
        g.beginPath();
        for (let x = ab / 2; x < w; x += ab) for (const yy of art === "gitter" ? [h * 0.1, h * 0.9] : [h * 0.3]) { g.moveTo(x + r, yy); g.arc(x, yy, r, 0, TAU); }
        g.fill();
        g.fillStyle = "rgba(255,240,220,0.35)";
        g.beginPath();
        for (let x = ab / 2; x < w; x += ab) for (const yy of art === "gitter" ? [h * 0.1, h * 0.9] : [h * 0.3]) { g.moveTo(x - r * 0.2 + r * 0.45, yy - r * 0.3); g.arc(x - r * 0.2, yy - r * 0.3, r * 0.45, 0, TAU); }
        g.fill();
      }
      /* Rost und Schmutz: Rostläufer unter den Knoten, Staub */
      if (px > 8) rausch(g, 0, 0, w, h, 1.4, 0.24, saat, 3);
      if (px > 30) {
        const rng = zufall(saat + 5);
        g.fillStyle = "rgba(120,58,26,0.22)";
        for (let i = 0; i < w * 1.5; i++) { const x = rng() * w; g.fillRect(x, 0, 0.012 + rng() * 0.02, h); }
      }
      /* Kanten */
      const k = Math.max(0.006, 0.8 / px);
      g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(0, 0, w, k);
      g.fillStyle = "rgba(0,0,0,0.3)"; g.fillRect(0, h - k, w, k);
      /* Schnee auf allem, was nach oben schaut */
      if (winter && oben > 0.3) {
        const rng = zufall(saat + 17), dk = klemm((oben - 0.3) / 0.5, 0, 1);
        g.fillStyle = rgb(SCHNEE);
        g.beginPath(); g.moveTo(0, h * (1 - dk * 0.95));
        for (let x = 0; x <= w + 0.1; x += 0.12) g.lineTo(x, h * (1 - dk * (0.75 + rng() * 0.25)));
        g.lineTo(w, 0); g.lineTo(0, 0); g.closePath();
        g.save(); g.clip(); g.fillRect(0, 0, w, h);
        g.fillStyle = "rgba(170,190,225,0.35)"; g.fillRect(0, 0, w, h * 0.12);
        g.restore();
      }
    };
  }
  function stahlStab(M, name, P0, P1, b, d, c, art, winter, opt) {
    const saat = ST.textHash(name) % 997;
    stab(M, name, P0, P1, b, d, (N) => stahlMaler(c, art, N, winter, saat), opt);
  }

  /* =====================================================================
     FÖRDERGERÜST
     ===================================================================== */
  function stielPunkt(sx, sy, z) {
    const k = (z - Z_FUSS) / (Z_BUEHNE - Z_FUSS);
    return [TX + sx * (BX0 + (BX1 - BX0) * k), TY + sy * (BY0 + (BY1 - BY0) * k), z];
  }
  function strebePunkt(sy, k) {
    /* k = 0 oben an der Bühne, 1 am Fuß */
    const x = STREBE_OBEN[0] + (STREBE_FUSS[0] - STREBE_OBEN[0]) * k, z = STREBE_OBEN[1] + (STREBE_FUSS[1] - STREBE_OBEN[1]) * k;
    return [x, TY + sy * (STREBE_YO + (STREBE_YU - STREBE_YO) * k), z];
  }
  /* Zeitpunkt (Anteil der Turmphase), wann ein Stab steht */
  function turmZeit(feld, art) { return feld / 5 + (art === "stiel" ? 0 : art === "riegel" ? 0.07 : 0.13); }

  function foerderturm(M, V, Z, winter) {
    const c = stahlFarbe(V, Z);
    const t = Z.turm;
    const ECKEN = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    /* Stiele: je Feld ein Stück (bessere Reihenfolge, wächst Feld für Feld) */
    for (let i = 0; i < 5; i++) {
      if (t < turmZeit(i, "stiel")) continue;
      for (const [sx, sy] of ECKEN) {
        const a = stielPunkt(sx, sy, EBENEN[i]), b = stielPunkt(sx, sy, EBENEN[i + 1]);
        stahlStab(M, "stiel" + sx + sy + i, a, b, 0.34, 0.34, c, "gitter", winter, { quer: [sx, 0, 0], oben: [0, sy, 0] });
      }
    }
    /* Riegel auf jeder Ebene, an allen vier Seiten */
    const SEITEN = [[[-1, 1], [1, 1]], [[1, 1], [1, -1]], [[1, -1], [-1, -1]], [[-1, -1], [-1, 1]]];
    for (let i = 1; i <= 5; i++) {
      if (t < turmZeit(i - 1, "riegel")) continue;
      SEITEN.forEach(([p, q], si) => {
        const a = stielPunkt(p[0], p[1], EBENEN[i]), b = stielPunkt(q[0], q[1], EBENEN[i]);
        const inn = mul(sub(b, a), 0.5 / laenge(sub(b, a)) * 0.0);
        stahlStab(M, "riegel" + i + si, add(a, inn), sub(b, inn), 0.2, 0.26, c, "gitter", winter, {});
      });
    }
    /* Andreaskreuze; im untersten Feld Süd- und Ostseite offen (Zugang,
       Gleis zur Hängebank) */
    for (let i = 0; i < 5; i++) {
      if (t < turmZeit(i, "kreuz")) continue;
      SEITEN.forEach(([p, q], si) => {
        if (i === 0 && (si === 0 || si === 1)) return;
        const z0 = EBENEN[i] + (i === 0 ? 0.1 : 0.14), z1 = EBENEN[i + 1] - 0.14;
        const a0 = stielPunkt(p[0], p[1], z0), b0 = stielPunkt(q[0], q[1], z0), a1 = stielPunkt(p[0], p[1], z1), b1 = stielPunkt(q[0], q[1], z1);
        const n = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, 0];
        stahlStab(M, "kreuz" + i + si + "a", a0, b1, 0.1, 0.1, c, "winkel", winter, { oben: n });
        stahlStab(M, "kreuz" + i + si + "b", b0, a1, 0.1, 0.1, c, "winkel", winter, { oben: n });
      });
    }
    /* Spurlatten (Holz, Führung der Förderkörbe) und Förderkörbe */
    /* sie wachsen eine Ebene hinter den Stielen her */
    const feld = Math.min(5, Math.floor(t * 5 + 1e-6));
    if (feld >= 2) {
      const zo = feld >= 5 ? Z_BUEHNE - 0.2 : EBENEN[feld - 1];
      for (const ys of SCHEIBE.ys) for (const dx of [-0.52, 0.52]) {
        stab(M, "spur" + ys + dx, [TX + dx - 0.02, ys, Z_FUSS], [TX + dx - 0.02, ys, zo], 0.12, 0.16, () => (g, F) => { holzMalen(g, F, 0, 0, F.w, F.h, HOLZ_ALT, 3); }, { quer: [0, 1, 0] });
      }
    }
    if (Z.korb) {
      foerderkorb(M, V, [TX - 0.02, SCHEIBE.ys[0], 7.6], winter, c);
      foerderkorb(M, V, [TX - 0.02, SCHEIBE.ys[1], Z_FUSS], winter, c);
    }
    if (Z.buehne) buehne(M, V, Z, winter, c);
    if (Z.strebe > 0) strebe(M, V, Z, winter, c);
    if (Z.scheiben) seilscheiben(M, V, Z, winter, c);
    if (Z.seile) seile(M, V, Z, winter);
  }

  /* Förderkorb: Stahlrahmen mit Blechdach, zwei Etagen */
  function foerderkorb(M, V, P, winter, c) {
    const [x, y, z] = P, b = 0.86, t = 0.7, h = 2.0;
    M.teil("korb" + y, { schatten: true });
    const seite = (g, F) => {
      const L = lichtN(F);
      g.fillStyle = litF([26, 26, 28], L, 0.82); g.fillRect(0, 0, F.w, F.h);
      g.fillStyle = litF(hell(c, 0.05), L);
      for (const yy of [0, F.h / 2 - 0.03, F.h - 0.06]) g.fillRect(0, yy, F.w, 0.06);
      for (const xx of [0, F.w - 0.05]) g.fillRect(xx, 0, 0.05, F.h);
      g.strokeStyle = litF(hell(c, -0.1), L); g.lineWidth = 0.025;
      g.beginPath(); for (let xx = 0.14; xx < F.w - 0.08; xx += 0.14) { g.moveTo(xx, 0.06); g.lineTo(xx, F.h / 2 - 0.03); g.moveTo(xx, F.h / 2 + 0.03); g.lineTo(xx, F.h - 0.06); } g.stroke();
    };
    const kf = { keinLicht: true };
    wandF(M, "korb-s", [x - b / 2, y + t / 2], [x + b / 2, y + t / 2], z, z + h, seite, kf);
    wandF(M, "korb-n", [x + b / 2, y - t / 2], [x - b / 2, y - t / 2], z, z + h, seite, kf);
    wandF(M, "korb-o", [x + b / 2, y + t / 2], [x + b / 2, y - t / 2], z, z + h, seite, kf);
    wandF(M, "korb-w", [x - b / 2, y - t / 2], [x - b / 2, y + t / 2], z, z + h, seite, kf);
    M.flaeche({ name: "korb-dach", o: [x - b / 2, y - t / 2, z + h], u: [1, 0, 0], v: [0, 1, 0], w: b, h: t, malen: (g, F) => { g.fillStyle = rgb(hell(c, -0.2)); g.fillRect(0, 0, F.w, F.h); if (winter) schneeDecke(g, F, 0.03, 0.03, F.w - 0.06, F.h - 0.06, 5, 0.9); } });
  }

  /* Seilscheibenbühne: Trägerrost, Riffelblech, Geländer, Lagerböcke */
  function buehne(M, V, Z, winter, c) {
    const B = BUEHNE, z0 = Z_BUEHNE, z1 = Z_DECK;
    M.teil("buehne", { schatten: true });
    const rand = (g, F) => { stahlMaler(c, "gitter", [0, 0, 0], false, 31)(g, F); };
    M.quader({ x: B.x0, y: B.y0, z: z0, b: B.x1 - B.x0, t: B.y1 - B.y0, h: z1 - z0 }, {
      sued: rand, nord: rand, ost: rand, west: rand,
      oben: (g, F) => {
        const w = F.w, h = F.h;
        g.fillStyle = rgb(hell(c, -0.12)); g.fillRect(0, 0, w, h);
        if (F.px > 25) {
          /* Riffelblech */
          g.strokeStyle = rgb(hell(c, 0.1), 0.6); g.lineWidth = 0.012;
          g.beginPath();
          for (let yy = 0.05, r = 0; yy < h; yy += 0.07, r++) for (let xx = (r % 2) * 0.05; xx < w; xx += 0.1) { g.moveTo(xx, yy); g.lineTo(xx + 0.03, yy + (r % 2 ? 0.02 : -0.02)); }
          g.stroke();
        }
        g.fillStyle = "rgba(0,0,0,0.25)"; for (let x = 1.1; x < w; x += 1.1) g.fillRect(x, 0, 0.012, h);
        rausch(g, 0, 0, w, h, 1.2, 0.2, 7, 3);
        if (winter && Z.schnee) schneeDecke(g, F, 0, 0, w, h, 9, 0.93);
      }
    }, { keinAo: true });
    /* Lagerböcke und Achse */
    for (const ys of [SCHEIBE.ys[0] - 0.22, SCHEIBE.ys[0] + 0.22, SCHEIBE.ys[1] - 0.22, SCHEIBE.ys[1] + 0.22]) {
      stahlStab(M, "lager" + ys, [SCHEIBE.x - 0.28, ys, z1], [SCHEIBE.x + 0.28, ys, z1], 0.14, 0.2, c, "blech", winter, {});
      stahlStab(M, "bock" + ys, [SCHEIBE.x, ys, z1 + 0.02], [SCHEIBE.x, ys, SCHEIBE.z - 0.05], 0.13, 0.1, c, "blech", winter, { quer: [1, 0, 0] });
    }
    /* Geländer (durchsichtig: selbst belichtet) */
    if (Z.gelaender) {
      M.teil("gelaender", { schatten: true });
      const H = 1.0;
      const gel = (g, F) => {
        const L = lichtN(F), w = F.w;
        const cc = litF(hell(c, 0.05), L);
        g.fillStyle = cc;
        g.fillRect(0, 0, w, 0.05); g.fillRect(0, H * 0.5, w, 0.035); g.fillRect(0, H - 0.1, w, 0.1);
        for (let x = 0; x <= w + 0.01; x += Math.max(0.5, w / Math.max(1, Math.round(w / 1.0)))) g.fillRect(Math.min(x, w - 0.05), 0, 0.05, H);
        if (winter && Z.schnee) { g.fillStyle = litF(SCHNEE, L); g.fillRect(0, -0.035, w, 0.04); g.fillRect(0, H * 0.5 - 0.03, w, 0.03); }
      };
      const kf = { keinLicht: true, beidseitig: true };
      wandF(M, "gel-s", [B.x0, B.y1], [B.x1, B.y1], z1, z1 + H, gel, kf);
      wandF(M, "gel-n", [B.x1, B.y0], [B.x0, B.y0], z1, z1 + H, gel, kf);
      wandF(M, "gel-o", [B.x1, B.y1], [B.x1, B.y0], z1, z1 + H, gel, kf);
      wandF(M, "gel-w", [B.x0, B.y0], [B.x0, B.y1], z1, z1 + H, gel, kf);
    }
  }

  /* Strebe: zwei Beine aus Gitterträgern, dazwischen Riegel und Kreuze,
     auf halber Höhe mit dem Turm verbunden */
  function strebe(M, V, Z, winter, c) {
    const t = Z.strebe;
    const TEILE = 5;
    for (let i = 0; i < TEILE; i++) {
      if (t < (TEILE - 1 - i) / TEILE * 0.8) continue;                  // von unten nach oben
      for (const sy of [-1, 1]) {
        const a = strebePunkt(sy, i / TEILE), b = strebePunkt(sy, (i + 1) / TEILE);
        stahlStab(M, "strebe" + sy + i, a, b, 0.34, 0.34, c, "gitter", winter, { oben: [0, sy, 0] });
      }
    }
    if (t < 0.85) return;
    for (let i = 1; i < TEILE; i++) {
      const a = strebePunkt(-1, i / TEILE), b = strebePunkt(1, i / TEILE);
      stahlStab(M, "streberiegel" + i, a, b, 0.16, 0.2, c, "gitter", winter, {});
      if (i < TEILE - 1) {
        const a2 = strebePunkt(-1, (i + 1) / TEILE), b2 = strebePunkt(1, (i + 1) / TEILE);
        stahlStab(M, "strebekreuz" + i + "a", a, b2, 0.09, 0.09, c, "winkel", winter, {});
        stahlStab(M, "strebekreuz" + i + "b", b, a2, 0.09, 0.09, c, "winkel", winter, {});
      }
    }
    /* Verbindungsriegel Strebe → Turm */
    for (const zz of [EBENEN[3], EBENEN[4]]) {
      const k = (STREBE_OBEN[1] - zz) / (STREBE_OBEN[1] - STREBE_FUSS[1]);
      for (const sy of [-1, 1]) {
        const a = stielPunkt(1, sy, zz), b = strebePunkt(sy, k);
        stahlStab(M, "verb" + sy + zz, [a[0] + 0.15, a[1], zz], b, 0.16, 0.2, c, "gitter", winter, {});
      }
    }
  }

  /* Tangentenpunkt an der Seilscheibe zum Ziel (xz-Ebene) */
  function tangente(xt, zt) {
    const dx = xt - SCHEIBE.x, dz = zt - SCHEIBE.z, D = Math.hypot(dx, dz);
    const al = Math.atan2(dz, dx), be = Math.acos(SCHEIBE.r / D);
    const w = al + be;
    return { w: w, x: SCHEIBE.x + Math.cos(w) * SCHEIBE.r, z: SCHEIBE.z + Math.sin(w) * SCHEIBE.r };
  }

  /* Seilscheiben: flache Zeichnung in der xz-Ebene, der Kranz mit echter
     Breite (Rückseite, Mantel, Vorderseite – je nach Blickwinkel) */
  function seilscheiben(M, V, Z, winter, c) {
    const S = SCHEIBE, R = S.r, rand = 0.3;
    const tg = tangente(SEIL_ZIEL[0], SEIL_ZIEL[2]);
    SCHEIBE.ys.forEach((ys, i) => {
      M.teil("scheibe" + i, { schatten: true });
      const w = 2 * (R + rand);
      M.flaeche({
        name: "scheibe" + i, o: [S.x - R - rand, ys, S.z + R + rand], u: [1, 0, 0], v: [0, 0, -1], w: w, h: w,
        umriss: (function () { const P = []; for (let k = 0; k < 24; k++) { const a = k / 24 * TAU; P.push([R + rand + Math.cos(a) * (R + 0.08), R + rand + Math.sin(a) * (R + 0.08)]); } return P; })(),
        keinLicht: true, beidseitig: true,
        malen: (g, F) => {
          const cx = R + rand, cy = R + rand;
          const vorn = F.sicht >= 0 ? 1 : -1;
          const L = lichtN(F);
          const Lm = ST.lichtFaktor([0, 0, 1], F.zeit, 0, F.jahr);
          const cc = hell(c, 0.08);
          const dv = tiefe(g, F, vorn * S.b / 2), dh = tiefe(g, F, -vorn * S.b / 2);
          const ring = (d, r0, r1) => { g.beginPath(); g.arc(cx + d[0], cy + d[1], r1, 0, TAU); g.arc(cx + d[0], cy + d[1], r0, 0, TAU, true); };
          /* hinterer Kranz */
          g.fillStyle = litF(hell(cc, -0.35), L); ring(dh, R - 0.1, R); g.fill();
          /* Mantel (Lauffläche) zwischen hinten und vorn */
          const n = Math.max(3, Math.min(10, Math.round(F.px * S.b / 2)));
          for (let k = 0; k <= n; k++) {
            const d = [dh[0] + (dv[0] - dh[0]) * k / n, dh[1] + (dv[1] - dh[1]) * k / n];
            g.fillStyle = litF(hell(cc, -0.22), Lm); ring(d, R - 0.035, R + 0.01); g.fill();
          }
          /* Seil in der Rille: vom senkrechten Trum (180°) über den Scheitel
             bis zur Tangente zum Maschinenhaus */
          if (Z.seile) {
            const dm = [(dv[0] + dh[0]) / 2, (dv[1] + dh[1]) / 2];
            g.strokeStyle = litF([46, 46, 48], Lm); g.lineWidth = 0.05;
            g.beginPath(); g.arc(cx + dm[0], cy + dm[1], R - 0.01, Math.PI, TAU - tg.w, false); g.stroke();
          }
          /* Speichen (zwei Speichenkränze, versetzt) */
          const dS1 = tiefe(g, F, vorn * 0.05), dS2 = tiefe(g, F, -vorn * 0.05);
          g.lineCap = "round";
          for (const [d, off, hk] of [[dS2, 0.5, -0.3], [dS1, 0, -0.08]]) {
            g.strokeStyle = litF(hell(cc, hk), L); g.lineWidth = 0.045;
            g.beginPath();
            for (let k = 0; k < 10; k++) { const a = (k + off) / 10 * TAU; g.moveTo(cx + d[0] + Math.cos(a) * 0.16, cy + d[1] + Math.sin(a) * 0.16); g.lineTo(cx + d[0] + Math.cos(a) * (R - 0.08), cy + d[1] + Math.sin(a) * (R - 0.08)); }
            g.stroke();
          }
          /* vorderer Kranz mit Lichtkante oben links */
          g.fillStyle = litF(cc, L); ring(dv, R - 0.1, R); g.fill();
          g.strokeStyle = litF(hell(cc, 0.3), L, 0.7); g.lineWidth = Math.max(0.01, 0.8 / F.px);
          g.beginPath(); g.arc(cx + dv[0], cy + dv[1], R - 0.005, Math.PI * 1.05, Math.PI * 1.6); g.stroke();
          if (F.px > 40) {
            g.fillStyle = litF(hell(cc, -0.4), L);
            g.beginPath(); for (let k = 0; k < 40; k++) { const a = k / 40 * TAU; const x = cx + dv[0] + Math.cos(a) * (R - 0.05), y = cy + dv[1] + Math.sin(a) * (R - 0.05); g.moveTo(x + 0.012, y); g.arc(x, y, 0.012, 0, TAU); } g.fill();
          }
          /* Nabe und Achse */
          g.fillStyle = litF(hell(cc, -0.3), L); g.beginPath(); g.arc(cx + dh[0], cy + dh[1], 0.2, 0, TAU); g.fill();
          g.fillStyle = litF(cc, L); g.beginPath(); g.arc(cx + dv[0], cy + dv[1], 0.2, 0, TAU); g.fill();
          g.fillStyle = litF([60, 60, 62], L); g.beginPath(); g.arc(cx + dv[0], cy + dv[1], 0.08, 0, TAU); g.fill();
          if (winter && Z.schnee) {
            g.strokeStyle = litF(SCHNEE, Lm); g.lineWidth = 0.05;
            g.beginPath(); g.arc(cx + dv[0], cy + dv[1] - 0.02, R, Math.PI * 1.3, Math.PI * 1.7); g.stroke();
          }
        }
      });
    });
    /* Achse zwischen den Lagern */
    stab(M, "achse", [S.x, S.ys[0] - 0.4, S.z], [S.x, S.ys[1] + 0.4, S.z], 0.12, 0.12, () => (g, F) => { g.fillStyle = "rgb(70,70,72)"; g.fillRect(0, 0, F.w, F.h); g.fillStyle = "rgba(255,255,255,0.2)"; g.fillRect(0, 0, F.w, F.h * 0.25); }, {});
  }

  /* Seile: Unterseil senkrecht zum Korb, Oberseil schräg ins Haus.
     Das Stück am Haus bekommt eine Mitte auf Haushöhe – so entscheidet
     nur die Hauswand (x = 2,3), ob es vor oder hinter dem Haus liegt. */
  function seile(M, V, Z, winter) {
    const tg = tangente(SEIL_ZIEL[0], SEIL_ZIEL[2]);
    const mal = () => (g, F) => {
      g.fillStyle = "rgb(58,58,60)"; g.fillRect(0, 0, F.w, F.h);
      if (F.px > 50) { g.strokeStyle = "rgba(160,160,165,0.5)"; g.lineWidth = 0.006; g.beginPath(); for (let x = 0; x < F.w; x += 0.03) { g.moveTo(x, 0); g.lineTo(x + 0.02, F.h); } g.stroke(); }
      g.fillStyle = "rgba(255,255,255,0.18)"; g.fillRect(0, 0, F.w, F.h * 0.3);
    };
    SCHEIBE.ys.forEach((ys, i) => {
      const oben = [tg.x, ys, tg.z], ziel = [SEIL_ZIEL[0] + 0.05, ys, SEIL_ZIEL[2]];
      const teile = 4;
      for (let k = 0; k < teile; k++) {
        const a = lerp3(oben, ziel, k / teile), b = lerp3(oben, ziel, (k + 1) / teile);
        const m = lerp3(a, b, 0.5);
        const mitte = k === teile - 1 ? [m[0], HAUS_MITTE[1], HAUS_MITTE[2]] : null;
        stab(M, "seil" + i + k, a, b, 0.045, 0.045, mal, mitte ? { mitte: mitte } : {});
      }
      /* senkrechtes Trum zum Korb */
      const zKorb = i === 0 ? 7.6 + 2.0 : Z_FUSS + 2.0;
      stab(M, "trum" + i, [SCHEIBE.x - SCHEIBE.r, ys, SCHEIBE.z], [SCHEIBE.x - SCHEIBE.r, ys, zKorb + 0.35], 0.045, 0.045, mal, { quer: [1, 0, 0] });
    });
  }

  /* Fundamente unter Stielen und Strebe, Schachtkragen */
  function fundamente(M, V, Z, winter) {
    const beton = (g, F) => {
      g.fillStyle = rgb(BETON); g.fillRect(0, 0, F.w, F.h);
      rausch(g, 0, 0, F.w, F.h, 0.8, 0.25, 21, 3);
      if (F.px > 30) { g.fillStyle = "rgba(0,0,0,0.12)"; for (let y = 0.1; y < F.h; y += 0.25) g.fillRect(0, y, F.w, 0.01); }
    };
    const betonOben = (g, F) => { beton(g, F); if (winter && Z.schnee) schneeDecke(g, F, 0.03, 0.03, F.w - 0.06, F.h - 0.06, 3, 0.95); };
    const fu = [];
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const p = stielPunkt(sx, sy, 0); fu.push([p[0], p[1], 0.75]); }
    for (const sy of [-1, 1]) { const p = strebePunkt(sy, 1); fu.push([p[0], p[1], 0.8]); }
    fu.forEach(([x, y, b], i) => {
      M.teil("fund" + i, { schatten: true });
      M.quader({ x: x - b / 2, y: y - b / 2, z: 0, b: b, t: b, h: Z_FUSS }, { sued: beton, nord: beton, ost: beton, west: beton, oben: betonOben });
      /* Fußplatte mit Ankerschrauben */
      if (Z.turm > 0) M.flaeche({ name: "fussplatte" + i, o: [x - 0.25, y - 0.25, Z_FUSS + 0.01], u: [1, 0, 0], v: [0, 1, 0], w: 0.5, h: 0.5, malen: (g, F) => { g.fillStyle = "rgb(60,58,56)"; g.fillRect(0, 0, 0.5, 0.5); g.fillStyle = "rgb(30,30,30)"; for (const [a, b2] of [[0.07, 0.07], [0.43, 0.07], [0.07, 0.43], [0.43, 0.43]]) { g.beginPath(); g.arc(a, b2, 0.03, 0, TAU); g.fill(); } } });
    });
    /* Schachtkragen: gemauerter Rand um den Schacht, zwei Trume */
    if (Z.kragen > 0) {
      const hk = Z_FUSS * Z.kragen;
      M.teil("kragen", { schatten: true });
      const x0 = TX - 1.0, x1 = TX + 1.0, y0 = TY - 1.0, y1 = TY + 1.0;
      const kr = (g, F) => { quaderMalen(g, F, 0, 0, F.w, F.h, 41, { lage: 0.18, laenge: 0.5 }); };
      M.quader({ x: x0, y: y0, z: 0, b: x1 - x0, t: y1 - y0, h: hk }, {
        sued: kr, nord: kr, ost: kr, west: kr,
        oben: (g, F) => {
          const w = F.w, h = F.h;
          quaderMalen(g, F, 0, 0, w, h, 43, { lage: 0.25, laenge: 0.6 });
          /* die beiden Schachttrume: schwarz, mit Holzausbau am Rand */
          for (const ys of SCHEIBE.ys) {
            const yy = ys - y0 - 0.42, xx = 0.5;
            const d = tiefe(g, F, -3);
            g.save(); g.beginPath(); g.rect(xx, yy, 1.0, 0.84); g.clip();
            g.fillStyle = "rgb(12,10,10)"; g.fillRect(xx, yy, 1.0, 0.84);
            /* Ausbau im Schacht: Bohlen, die nach unten im Dunkel verschwinden */
            for (let k = 1; k <= 4; k++) {
              const dd = tiefe(g, F, -0.35 * k), a = 0.55 - k * 0.12;
              g.strokeStyle = "rgba(120,90,60," + a + ")"; g.lineWidth = 0.06;
              g.strokeRect(xx + dd[0], yy + dd[1], 1.0, 0.84);
            }
            void d;
            g.restore();
            g.strokeStyle = rgb(HOLZ); g.lineWidth = 0.08; g.strokeRect(xx - 0.04, yy - 0.04, 1.08, 0.92);
          }
          if (winter && Z.schnee) {
            g.save(); g.globalAlpha = 0.85; g.fillStyle = rgb(SCHNEE);
            g.fillRect(0, 0, w, 0.12); g.fillRect(0, h - 0.12, w, 0.12); g.fillRect(0, 0, 0.14, h); g.fillRect(w - 0.14, 0, 0.14, h);
            g.restore();
          }
        }
      }, { keinAo: false });
    }
  }

  /* =====================================================================
     MASCHINENHAUS
     ===================================================================== */
  /* Öffnungen je Wand: x (Flächenkoordinate), z unten, Breite, Höhe (bis
     Bogenscheitel) */
  const OEFF = {
    sued: [{ art: "tor", x: 1.05, z: 0.05, w: 1.5, h: 3.05 }, { art: "rund", x: 1.45, z: 5.75, w: 0.7, h: 0.7 }],
    ost: [{ art: "fenster", x: 0.85, z: 1.55, w: 1.0, h: 2.65 }, { art: "fenster", x: 2.5, z: 1.55, w: 1.0, h: 2.65 }, { art: "fenster", x: 4.15, z: 1.55, w: 1.0, h: 2.65 }],
    /* Westwand: die zwei Seildurchlässe liegen genau in der Flucht der
       Seilscheiben (y = TY ∓ 0,55), daneben ein Fenster */
    west: [{ art: "fenster", x: 4.2, z: 1.55, w: 1.0, h: 2.65 },
      { art: "seil", x: TY - 0.55 - HAUS.y0 - 0.2, z: 4.35, w: 0.4, h: 0.55 }, { art: "seil", x: TY + 0.55 - HAUS.y0 - 0.2, z: 4.35, w: 0.4, h: 0.55 }],
    nord: []
  };
  function bogenPfad(g, x, yTop, w, h) {
    const r = w / 2;
    g.beginPath(); g.moveTo(x, yTop + h); g.lineTo(x, yTop + r); g.arc(x + r, yTop + r, r, Math.PI, 0); g.lineTo(x + w, yTop + h); g.closePath();
  }
  function rundPfad(g, x, yTop, w) { g.beginPath(); g.arc(x + w / 2, yTop + w / 2, w / 2, 0, TAU); }
  /* Backsteinbogen (Rollschicht) über einer Rundbogenöffnung */
  function ziegelBogen(g, F, x, yTop, w, dicke, rund) {
    const r0 = w / 2, r1 = r0 + dicke, cx = x + r0, cy = yTop + r0;
    const n = Math.max(7, Math.round((rund ? TAU : Math.PI) * (r0 + dicke / 2) / 0.085));
    const a0 = rund ? 0 : Math.PI, a1 = rund ? TAU : TAU;
    const rng = zufall(Math.round(x * 100 + yTop * 7));
    g.fillStyle = "rgb(168,158,144)";
    g.beginPath(); g.arc(cx, cy, r1, a0, a1); g.arc(cx, cy, r0, a1, a0, true); g.closePath(); g.fill();
    if (F.px * 0.085 < 2) { g.fillStyle = rgb(ZIEGEL); g.fill(); return; }
    for (let i = 0; i < n; i++) {
      const b0 = a0 + (a1 - a0) * i / n + 0.012, b1 = a0 + (a1 - a0) * (i + 1) / n - 0.012;
      g.fillStyle = rgb(hell(streu(ZIEGEL, rng, 0.14), (i % 2) * -0.05));
      g.beginPath(); g.arc(cx, cy, r1 - 0.01, b0, b1); g.arc(cx, cy, r0 + 0.01, b1, b0, true); g.closePath(); g.fill();
    }
    if (!rund) {
      /* Schlussstein aus Sandstein */
      g.fillStyle = rgb(SANDSTEIN);
      g.beginPath(); g.moveTo(cx - 0.07, cy - r0 + 0.01); g.lineTo(cx + 0.07, cy - r0 + 0.01); g.lineTo(cx + 0.1, cy - r1 - 0.03); g.lineTo(cx - 0.1, cy - r1 - 0.03); g.closePath(); g.fill();
      g.fillStyle = "rgba(0,0,0,0.2)"; g.fillRect(cx + 0.05, cy - r1 - 0.03, 0.05, r1 - r0 + 0.04);
    }
  }
  /* Laibung und Sonnenschatten in einer Öffnung (Pfad schon gesetzt über fn) */
  function laibung(g, F, pfad, tief, farbe) {
    g.save(); pfad(); g.clip();
    g.fillStyle = rgb(farbe || [120, 114, 104]); g.fillRect(-50, -50, 100, 100);
    g.restore();
    return tiefe(g, F, -tief);
  }
  /* Eisenfenster mit kleinen Scheiben (Industriefenster) */
  function eisenFenster(g, F, x, yTop, w, h, rund, nacht, zu) {
    const pfad = () => rund ? rundPfad(g, x, yTop, w) : bogenPfad(g, x, yTop, w, h);
    const tief = 0.24;
    const d = laibung(g, F, pfad, tief, [112, 106, 96]);
    g.save(); pfad(); g.clip();
    g.translate(d[0], d[1]);
    if (!zu) {
      /* Rohbau: ins dunkle Innere */
      g.fillStyle = "rgb(30,28,26)"; g.fillRect(x - 1, yTop - 1, w + 2, h + 2);
    } else {
      const tag = 1 - (nacht || 0);
      const gl = g.createLinearGradient(x, yTop, x + w * 0.5, yTop + h);
      gl.addColorStop(0, "rgb(" + [148, 170, 196].map((v) => Math.round(v * (0.5 + 0.5 * tag))).join(",") + ")");
      gl.addColorStop(0.5, "rgb(62,74,90)"); gl.addColorStop(1, "rgb(34,38,48)");
      g.fillStyle = gl; g.fillRect(x, yTop, w, h);
      /* Scheiben unterschiedlich getönt (altes Glas) */
      const rng = zufall(Math.round(x * 31 + yTop * 17));
      const sw = w / 4, sh = 0.26;
      for (let yy = yTop + h - sh; yy > yTop - sh; yy -= sh) for (let xx = x; xx < x + w - 0.01; xx += sw) {
        const k = rng();
        if (k < 0.18) { g.fillStyle = "rgba(255,255,255,0.08)"; g.fillRect(xx, yy, sw, sh); }
        else if (k > 0.9) { g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(xx, yy, sw, sh); }
      }
      /* Himmelsspiegelung */
      g.fillStyle = "rgba(255,255,255," + (0.07 + 0.08 * tag) + ")";
      g.beginPath(); g.moveTo(x + w * 0.1, yTop + h); g.lineTo(x + w * 0.6, yTop); g.lineTo(x + w * 0.8, yTop); g.lineTo(x + w * 0.3, yTop + h); g.closePath(); g.fill();
      sprossen(g, F, x, yTop, w, h, rund, [52, 56, 58]);
    }
    g.restore();
    /* Sonnenschatten der Laibung */
    const sv = F.schatten(tief);
    g.save(); pfad(); g.clip();
    g.fillStyle = sv ? "rgba(16,18,30,0.42)" : "rgba(16,18,30,0.2)";
    g.beginPath(); g.rect(x - 2, yTop - 2, w + 4, h + 4);
    if (sv) { g.save(); g.translate(sv[0], sv[1]); if (rund) { g.moveTo(x + w, yTop + w / 2); g.arc(x + w / 2, yTop + w / 2, w / 2, 0, TAU, true); } else { g.moveTo(x, yTop + h); g.lineTo(x + w, yTop + h); g.lineTo(x + w, yTop + w / 2); g.arc(x + w / 2, yTop + w / 2, w / 2, 0, Math.PI, true); g.closePath(); } g.restore(); }
    g.fill("evenodd");
    g.restore();
  }
  function sprossen(g, F, x, yTop, w, h, rund, farbe) {
    const b = Math.max(0.028, 0.9 / F.px);
    g.fillStyle = rgb(farbe);
    if (rund) {
      const cx = x + w / 2, cy = yTop + w / 2;
      g.fillRect(cx - b / 2, yTop, b, w); g.fillRect(x, cy - b / 2, w, b);
      g.save(); g.translate(cx, cy); g.rotate(Math.PI / 4); g.fillRect(-b / 2, -w / 2, b, w); g.fillRect(-w / 2, -b / 2, w, b); g.restore();
      g.strokeStyle = rgb(farbe); g.lineWidth = b * 1.6; g.beginPath(); g.arc(cx, cy, w / 2 - b * 0.8, 0, TAU); g.stroke();
      return;
    }
    const sw = w / 4, sh = 0.26;
    for (let k = 1; k < 4; k++) g.fillRect(x + sw * k - b / 2, yTop, b, h);
    for (let yy = yTop + h - sh; yy > yTop + 0.05; yy -= sh) g.fillRect(x, yy - b / 2, w, b);
    /* Rahmen und Kämpfer mit Kippflügel */
    g.fillRect(x, yTop + w / 2 - b, w, b * 1.6);
    g.strokeStyle = rgb(farbe); g.lineWidth = b * 1.8;
    g.beginPath(); g.moveTo(x + b * 0.9, yTop + h); g.lineTo(x + b * 0.9, yTop + w / 2); g.arc(x + w / 2, yTop + w / 2, w / 2 - b * 0.9, Math.PI, 0); g.lineTo(x + w - b * 0.9, yTop + h); g.stroke();
  }
  function fensterbank(g, F, x, y, w) {
    const s2 = F.schatten(0.07);
    if (s2) { g.fillStyle = "rgba(24,22,30,0.3)"; g.fillRect(x - 0.08 + s2[0], y + 0.08, w + 0.16, Math.max(0.02, s2[1] * 0.9)); }
    g.fillStyle = rgb(hell(SANDSTEIN, 0.15)); g.fillRect(x - 0.08, y, w + 0.16, 0.035);
    g.fillStyle = rgb(SANDSTEIN); g.fillRect(x - 0.08, y + 0.035, w + 0.16, 0.05);
    g.fillStyle = "rgba(60,40,20,0.3)"; g.fillRect(x - 0.08, y + 0.075, w + 0.16, 0.01);
    /* Regenschliere */
    const gr = g.createLinearGradient(0, y + 0.085, 0, y + 0.7);
    gr.addColorStop(0, "rgba(40,36,30,0.18)"); gr.addColorStop(1, "rgba(40,36,30,0)");
    g.fillStyle = gr; g.beginPath(); g.moveTo(x + 0.05, y + 0.085); g.lineTo(x + w - 0.05, y + 0.085); g.lineTo(x + w - 0.2, y + 0.7); g.lineTo(x + 0.2, y + 0.7); g.closePath(); g.fill();
  }
  /* Rundbogentor: zweiflügelig, Bretter mit Rahmen, Oberlicht im Bogen */
  function torMalen(g, F, x, yTop, w, h, V, zu, nacht) {
    const pfad = () => bogenPfad(g, x, yTop, w, h);
    const d = laibung(g, F, pfad, 0.3, [110, 104, 94]);
    const r = w / 2;
    g.save(); pfad(); g.clip(); g.translate(d[0], d[1]);
    if (!zu) { g.fillStyle = "rgb(28,26,24)"; g.fillRect(x - 1, yTop - 1, w + 2, h + 2); g.restore(); return; }
    /* Oberlicht (Fächer) */
    const tag = 1 - (nacht || 0);
    g.fillStyle = "rgb(" + [70, 82, 98].map((v) => Math.round(v * (0.55 + 0.45 * tag))).join(",") + ")";
    g.fillRect(x, yTop, w, r + 0.05);
    g.strokeStyle = "rgb(50,52,54)"; g.lineWidth = 0.035;
    g.beginPath(); for (let k = 1; k < 6; k++) { const a = Math.PI + k / 6 * Math.PI; g.moveTo(x + r, yTop + r); g.lineTo(x + r + Math.cos(a) * r, yTop + r + Math.sin(a) * r); } g.stroke();
    g.beginPath(); g.arc(x + r, yTop + r, r * 0.35, Math.PI, 0); g.stroke();
    /* Kämpferholz */
    g.fillStyle = rgb(hell(V.tor, -0.2)); g.fillRect(x, yTop + r, w, 0.1);
    /* Flügel */
    const fy = yTop + r + 0.1, fh = h - r - 0.1;
    for (const s of [0, 1]) {
      const fx = x + s * w / 2, fw = w / 2;
      bretterMalen(g, F, fx, fy, fw, fh, V.tor, 70 + s, { breite: 0.13 });
      /* Rahmen und Füllungskreuz */
      g.fillStyle = rgb(hell(V.tor, 0.08));
      g.fillRect(fx, fy, fw, 0.08); g.fillRect(fx, fy + fh - 0.12, fw, 0.12); g.fillRect(fx, fy + fh * 0.48, fw, 0.08);
      g.fillRect(fx, fy, 0.07, fh); g.fillRect(fx + fw - 0.07, fy, 0.07, fh);
      g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(fx, fy + 0.08, fw, 0.015); g.fillRect(fx, fy + fh * 0.48 + 0.08, fw, 0.015);
      /* Beschläge */
      g.fillStyle = "rgb(40,38,36)";
      for (const yy of [fy + 0.3, fy + fh - 0.35]) g.fillRect(s ? fx + fw * 0.45 : fx, yy, fw * 0.55, 0.045);
    }
    g.fillStyle = "rgba(0,0,0,0.5)"; g.fillRect(x + w / 2 - 0.01, fy, 0.02, fh);
    /* Griff */
    g.fillStyle = "rgb(30,30,30)"; g.fillRect(x + w / 2 - 0.08, fy + fh * 0.52, 0.04, 0.12);
    g.restore();
    /* Laibungsschatten */
    const sv = F.schatten(0.3);
    g.save(); pfad(); g.clip();
    g.fillStyle = sv ? "rgba(16,18,30,0.42)" : "rgba(16,18,30,0.2)";
    g.beginPath(); g.rect(x - 2, yTop - 2, w + 4, h + 4);
    if (sv) { g.save(); g.translate(sv[0], sv[1]); g.moveTo(x, yTop + h + 0.5); g.lineTo(x + w, yTop + h + 0.5); g.lineTo(x + w, yTop + r); g.arc(x + r, yTop + r, r, 0, Math.PI, true); g.closePath(); g.restore(); }
    g.fill("evenodd");
    g.restore();
    /* Schwelle */
    g.fillStyle = rgb(hell(SANDSTEIN, -0.05)); g.fillRect(x - 0.1, yTop + h - 0.06, w + 0.2, 0.08);
  }
  /* Eckverzahnung aus Ziegeln an einer senkrechten Kante */
  function eckverzahnung(g, F, x, y0, y1, rechts, saat) {
    const rng = zufall(saat), lh = 0.225;
    let k = 0;
    for (let yy = y1; yy > y0 + 0.02; yy -= lh, k++) {
      const lang = k % 2 ? 0.5 : 0.28, xx = rechts ? x - lang : x;
      g.fillStyle = "rgb(168,158,144)"; g.fillRect(xx, yy - lh, lang, lh);
      if (F.px * 0.075 < 2) { g.fillStyle = rgb(ZIEGEL); g.fillRect(xx, yy - lh + 0.01, lang, lh - 0.02); continue; }
      for (let r = 0; r < 3; r++) {
        const by = yy - (r + 1) * 0.075;
        const off = (r % 2) * 0.13;
        for (let bx = xx - off; bx < xx + lang; bx += 0.26) {
          const a = Math.max(xx, bx), b = Math.min(xx + lang, bx + 0.26);
          if (b - a < 0.03) continue;
          g.fillStyle = rgb(hell(streu(ZIEGEL, rng, 0.14), -0.02));
          g.fillRect(a + 0.005, by + 0.005, b - a - 0.01, 0.065);
        }
      }
    }
  }
  /* Deutsches Band + Rollschicht als Traufgesims */
  function traufgesims(g, F, x, y, w) {
    g.fillStyle = "rgb(160,150,136)"; g.fillRect(x, y, w, 0.34);
    g.fillStyle = rgb(ZIEGEL); g.fillRect(x, y, w, 0.1);
    g.fillStyle = rgb(hell(ZIEGEL, -0.15)); g.fillRect(x, y + 0.1, w, 0.08);
    /* Zahnfries: übereck gestellte Ziegel */
    if (F.px * 0.12 > 2.5) {
      g.fillStyle = rgb(ZIEGEL);
      g.beginPath();
      for (let xx = x; xx < x + w; xx += 0.16) { g.moveTo(xx, y + 0.19); g.lineTo(xx + 0.08, y + 0.3); g.lineTo(xx + 0.16, y + 0.19); }
      g.fill();
      g.fillStyle = "rgba(20,14,12,0.35)";
      g.beginPath();
      for (let xx = x; xx < x + w; xx += 0.16) { g.moveTo(xx + 0.08, y + 0.3); g.lineTo(xx + 0.16, y + 0.19); g.lineTo(xx + 0.16, y + 0.3); }
      g.fill();
    }
    g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(x, y + 0.33, w, 0.02);
  }

  /* Wandmaler: Bruchstein, Sockel, Eckverzahnung, Gesims, Öffnungen.
     zTop = Weltwert von Flächen-y 0; gebaut = Mauerhöhe (Bau) */
  function wandMaler(seite, zTop, V, Z, winter, opt) {
    const saat = { sued: 11, ost: 13, nord: 17, west: 19 }[seite];
    return function (g, F) {
      const w = F.w, h = F.h;
      const hb = opt.gebaut;                              // gebaute Höhe (Welt)
      const ab = hb == null ? null : zTop - hb;
      const ys = zTop - HAUS.zs;                          // Oberkante Sockel in Flächen-y
      bruchsteinMalen(g, F, 0, 0, w, ys, saat, ab);
      quaderMalen(g, F, 0, ys, w, h - ys, saat + 3, { lage: HAUS.zs / 2, laenge: 0.7 });
      g.fillStyle = "rgba(0,0,0,0.3)"; g.fillRect(0, ys - 0.01, w, 0.02);
      g.fillStyle = rgb(hell(SANDSTEIN, 0.1)); g.fillRect(0, ys - 0.05, w, 0.04);
      /* Eckverzahnung (nur Längswände und Giebel bis Traufe) */
      const zE = zTop - HAUS.ze;
      eckverzahnung(g, F, 0, Math.max(zE, ab == null ? -9 : ab), ys - 0.05, false, saat + 1);
      eckverzahnung(g, F, w, Math.max(zE, ab == null ? -9 : ab), ys - 0.05, true, saat + 2);
      if (opt.gesims && (hb == null || hb >= HAUS.ze - 0.05)) traufgesims(g, F, 0, 0, w);
      /* Öffnungen */
      for (const op of OEFF[seite]) {
        const yTop = zTop - (op.z + op.h), ybot = zTop - op.z;
        if (hb != null && op.z > hb) continue;
        const fertigBis = hb == null || hb >= op.z + op.h + 0.3;
        if (op.art === "seil") {
          g.fillStyle = rgb(hell(SANDSTEIN, -0.05)); g.fillRect(op.x - 0.08, yTop - 0.1, op.w + 0.16, op.h + 0.2);
          const pf = () => { g.beginPath(); g.rect(op.x, yTop, op.w, op.h); };
          const d = laibung(g, F, pf, 0.45, [96, 92, 86]);
          g.save(); pf(); g.clip(); g.fillStyle = "rgb(22,20,20)"; g.fillRect(op.x + d[0], yTop + d[1], op.w, op.h); g.restore();
          continue;
        }
        if (op.art === "rund") {
          if (!fertigBis) { g.save(); rundPfad(g, op.x, yTop, op.w); g.fillStyle = "rgb(30,28,26)"; g.fill(); g.restore(); continue; }
          ziegelBogen(g, F, op.x, yTop, op.w, 0.14, true);
          eisenFenster(g, F, op.x, yTop, op.w, op.w, true, F.nacht, Z.fenster);
          continue;
        }
        if (fertigBis) ziegelBogen(g, F, op.x, yTop, op.w, 0.26, false);
        if (op.art === "tor") torMalen(g, F, op.x, yTop, op.w, op.h, V, Z.tor, F.nacht);
        else {
          eisenFenster(g, F, op.x, yTop, op.w, Math.min(op.h, hb == null ? op.h : hb - op.z), false, F.nacht, Z.fenster && fertigBis);
          fensterbank(g, F, op.x, ybot, op.w);
        }
      }
      /* Datumstein über dem Tor */
      if (seite === "sued" && (hb == null || hb > 4.2) && F.px > 14) {
        const cx = w / 2, y = zTop - 4.22;
        g.fillStyle = rgb(SANDSTEIN); PI.rundRechteck(g, cx - 0.32, y, 0.64, 0.26, 0.03); g.fill();
        g.strokeStyle = "rgba(60,40,20,0.35)"; g.lineWidth = 0.012; PI.rundRechteck(g, cx - 0.29, y + 0.03, 0.58, 0.2, 0.02); g.stroke();
        if (F.px > 30) { g.fillStyle = "rgba(70,48,30,0.85)"; g.font = "bold 0.14px 'DejaVu Serif', Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(V.jahr), cx, y + 0.135); }
      }
      /* Verwitterung: Ruß unter der Traufe, Spritzwasser am Sockel */
      const gr = g.createLinearGradient(0, h, 0, h - 0.9);
      gr.addColorStop(0, "rgba(60,54,44,0.3)"); gr.addColorStop(1, "rgba(60,54,44,0)");
      g.fillStyle = gr; g.fillRect(0, h - 0.9, w, 0.9);
      if (winter && Z.schnee) {
        /* Schneewehe am Sockel */
        const rng = zufall(saat + 50);
        g.fillStyle = rgb(SCHNEE);
        g.beginPath(); g.moveTo(-0.1, h + 0.1);
        for (let x = -0.1; x <= w + 0.2; x += 0.25) g.lineTo(x, h - 0.06 - rng() * 0.16);
        g.lineTo(w + 0.2, h + 0.1); g.closePath(); g.fill();
      }
    };
  }
  function wandLeuchten(seite) {
    return function (g, F) {
      const zTop = F.flaeche.zTop;
      for (const op of OEFF[seite]) {
        if (op.art === "seil") continue;
        const yTop = zTop - (op.z + op.h);
        const rund = op.art === "rund";
        const pfad = () => rund ? rundPfad(g, op.x, yTop, op.w) : op.art === "tor" ? (g.beginPath(), g.arc(op.x + op.w / 2, yTop + op.w / 2, op.w / 2, Math.PI, 0), g.closePath()) : bogenPfad(g, op.x, yTop, op.w, op.h);
        const d = tiefe(g, F, -0.24);
        g.save(); pfad(); g.clip(); g.translate(d[0], d[1]);
        const a = F.nacht * (op.art === "tor" ? 0.8 : 0.9);
        const gr = g.createRadialGradient(op.x + op.w / 2, yTop + op.h * 0.7, 0, op.x + op.w / 2, yTop + op.h * 0.5, op.h);
        gr.addColorStop(0, "rgba(255,214,150," + a + ")"); gr.addColorStop(0.6, "rgba(250,176,96," + (a * 0.85) + ")"); gr.addColorStop(1, "rgba(190,110,60," + (a * 0.7) + ")");
        g.fillStyle = gr; g.fillRect(op.x - 0.2, yTop - 0.2, op.w + 0.4, op.h + 0.4);
        if (op.art !== "tor") sprossen(g, F, op.x, yTop, op.w, rund ? op.w : op.h, rund, [44, 32, 24]);
        else { g.strokeStyle = "rgb(44,32,24)"; g.lineWidth = 0.035; g.beginPath(); const r = op.w / 2; for (let k = 1; k < 6; k++) { const a2 = Math.PI + k / 6 * Math.PI; g.moveTo(op.x + r, yTop + r); g.lineTo(op.x + r + Math.cos(a2) * r, yTop + r + Math.sin(a2) * r); } g.stroke(); }
        g.restore();
        F.leuchtPunkt(op.x + op.w / 2, yTop + op.h * 0.55, Math.max(op.w, op.h) * 1.1, "255,196,120", op.art === "rund" ? 0.35 : 0.6);
      }
    };
  }

  /* Schieferdach (Schuppendeckung): in der Dachfläche x entlang der
     Traufe, y vom First (0) zur Traufe (h). bis = Anteil gedeckt */
  function schieferMalen(g, F, w, h, saat, bis) {
    const px = F.px, ZR = 0.19, SB = 0.3, basis = [70, 76, 88];
    const yAb = bis == null ? 0 : h * (1 - bis);
    g.fillStyle = rgb(hell(basis, -0.45)); g.fillRect(-0.05, yAb - 0.05, w + 0.1, h - yAb + 0.1);
    if (px * ZR < 2.4) {
      const rng = zufall(saat);
      for (let yy = h; yy > yAb; yy -= ZR) { g.fillStyle = rgb(streu(basis, rng, 0.06)); g.fillRect(-0.05, yy - ZR, w + 0.1, ZR * 0.8); }
      rausch(g, 0, yAb, w, h - yAb, 3.5, 0.2, saat + 5, 3);
      return;
    }
    const TOENE = [[74, 80, 94], [66, 72, 86], [82, 86, 98], [70, 72, 84], [60, 66, 80], [88, 90, 100]];
    for (let k = 0; ; k++) {
      const yu = h - k * ZR;
      if (yu < yAb - 0.02) break;
      const rr = zufall(saat * 31 + k * 7919);
      const vers = (k % 2) * SB / 2;
      const eimer = TOENE.map(() => []);
      g.fillStyle = "rgba(8,10,18,0.4)";
      g.beginPath();
      for (let xx = -SB + vers - 0.02; xx < w + SB; xx += SB) {
        const b = SB - 0.008, xa = xx + 0.004;
        g.moveTo(xa + 0.01, yu - ZR); g.lineTo(xa + 0.01, yu - b * 0.4 + 0.016); g.quadraticCurveTo(xa + b / 2 + 0.01, yu + 0.022, xa + b + 0.01, yu - b * 0.4 + 0.016); g.lineTo(xa + b + 0.01, yu - ZR); g.closePath();
        eimer[(rr() * TOENE.length) | 0].push(xa);
      }
      g.fill();
      TOENE.forEach((t, i) => {
        if (!eimer[i].length) return;
        g.fillStyle = rgb(misch(t, basis, 0.3));
        g.beginPath();
        const b = SB - 0.008, lang = 2.2 * ZR;
        for (const xa of eimer[i]) { g.moveTo(xa, yu - lang); g.lineTo(xa, yu - b * 0.4); g.quadraticCurveTo(xa + b / 2, yu + 0.006, xa + b, yu - b * 0.4); g.lineTo(xa + b, yu - lang); g.closePath(); }
        g.fill();
      });
      if (px * SB > 9) {
        g.strokeStyle = "rgba(210,220,236,0.2)"; g.lineWidth = Math.max(0.004, 0.8 / px);
        g.beginPath();
        for (let xx = -SB + vers - 0.02; xx < w + SB; xx += SB) { const xa = xx + 0.004, b = SB - 0.008; g.moveTo(xa + 0.01, yu - b * 0.34); g.quadraticCurveTo(xa + b / 2, yu - 0.004, xa + b - 0.01, yu - b * 0.34); }
        g.stroke();
      }
    }
    rausch(g, 0, yAb, w, h - yAb, 4.2, 0.16, saat + 8, 4);
    bleich(g, 0, yAb, w, h - yAb, 2.6, 0.07, saat + 3);
  }

  function maschinenhaus(M, V, Z, winter) {
    const H = HAUS;
    M.teil("haus", { schatten: true, mitte: HAUS_MITTE });
    const bauend = Z.wand < 1;
    /* gebaute Höhe: erst die Traufwände, die Giebel wachsen bis zum First */
    const hb = bauend ? H.zs + (H.zf - H.zs) * Z.wand : null;
    const hbT = hb == null ? H.ze : Math.min(H.ze, hb);
    const opt = (seite, zTop, extra) => Object.assign({ ao: true, zTop: zTop, leuchten: Z.licht ? wandLeuchten(seite) : null }, extra || {});
    /* Traufwände */
    const umTrauf = (w) => {
      const P = [[0, 0], [w, 0], [w, H.ze], [0, H.ze]];
      return hb == null ? P : schneide(P, (p) => p[1] - (H.ze - hbT));
    };
    const L = H.y1 - H.y0, B = H.x1 - H.x0;
    wandF(M, "wand-ost", [H.x1, H.y1], [H.x1, H.y0], 0, H.ze, wandMaler("ost", H.ze, V, Z, winter, { gebaut: hb, gesims: true }), opt("ost", H.ze, { umriss: umTrauf(L), traufe: hb == null ? UE_T : 0, traufeY: 0.34 }));
    wandF(M, "wand-west", [H.x0, H.y0], [H.x0, H.y1], 0, H.ze, wandMaler("west", H.ze, V, Z, winter, { gebaut: hb, gesims: true }), opt("west", H.ze, { umriss: umTrauf(L), traufe: hb == null ? UE_T : 0, traufeY: 0.34 }));
    /* Giebelwände (Fünfeck) */
    const umGiebel = () => {
      const P = [[0, H.zf - H.ze], [B / 2, 0], [B, H.zf - H.ze], [B, H.zf], [0, H.zf]];
      return hb == null ? P : schneide(P, (p) => p[1] - (H.zf - hb));
    };
    wandF(M, "wand-sued", [H.x0, H.y1], [H.x1, H.y1], 0, H.zf, wandMaler("sued", H.zf, V, Z, winter, { gebaut: hb }), opt("sued", H.zf, { umriss: umGiebel() }));
    wandF(M, "wand-nord", [H.x1, H.y0], [H.x0, H.y0], 0, H.zf, wandMaler("nord", H.zf, V, Z, winter, { gebaut: hb }), opt("nord", H.zf, { umriss: umGiebel() }));
    /* Rohbau: Mauerkrone, Innenseiten und Boden (man sieht hinein) */
    if (Z.dach < 1) {
      const d = 0.45, zk = hb == null ? H.ze : hbT;
      const innen = (g, F) => { g.fillStyle = "rgb(150,144,132)"; g.fillRect(0, 0, F.w, F.h); rausch(g, 0, 0, F.w, F.h, 1.5, 0.3, 5, 3); };
      M.flaeche({ name: "boden-innen", o: [H.x0 + d, H.y0 + d, 0.2], u: [1, 0, 0], v: [0, 1, 0], w: B - 2 * d, h: L - 2 * d, ebene: -1, malen: (g, F) => {
        g.fillStyle = "rgb(128,124,116)"; g.fillRect(0, 0, F.w, F.h); rausch(g, 0, 0, F.w, F.h, 1.2, 0.3, 8, 3);
        /* Fundament der Fördermaschine (Beton) */
        g.fillStyle = "rgb(170,168,160)"; g.fillRect(0.5, 1.6, F.w - 1.0, 2.6);
        g.fillStyle = "rgba(0,0,0,0.2)"; g.fillRect(0.5, 4.15, F.w - 1.0, 0.05);
        if (winter) schneeDecke(g, F, 0, 0, F.w, F.h, 12, 0.55);
      } });
      wandF(M, "innen-ost", [H.x1 - d, H.y0 + d], [H.x1 - d, H.y1 - d], 0.2, zk, innen, { ebene: -1 });
      wandF(M, "innen-west", [H.x0 + d, H.y1 - d], [H.x0 + d, H.y0 + d], 0.2, zk, innen, { ebene: -1 });
      wandF(M, "innen-sued", [H.x1 - d, H.y1 - d], [H.x0 + d, H.y1 - d], 0.2, zk, innen, { ebene: -1 });
      wandF(M, "innen-nord", [H.x0 + d, H.y0 + d], [H.x1 - d, H.y0 + d], 0.2, zk, innen, { ebene: -1 });
      const krone = (g, F) => { g.fillStyle = "rgb(150,146,136)"; g.fillRect(0, 0, F.w, F.h); rausch(g, 0, 0, F.w, F.h, 0.5, 0.35, 9, 3); if (winter && Z.schnee) schneeDecke(g, F, 0, 0, F.w, F.h, 4, 0.9); };
      for (const [x, y, b, t] of [[H.x0, H.y0, B, d], [H.x0, H.y1 - d, B, d], [H.x0, H.y0 + d, d, L - 2 * d], [H.x1 - d, H.y0 + d, d, L - 2 * d]]) {
        M.flaeche({ name: "krone", o: [x, y, zk], u: [1, 0, 0], v: [0, 1, 0], w: b, h: t, malen: krone });
      }
    }
    /* Dachstuhl (offen) */
    if (Z.stuhl > 0) {
      const n = Math.round(L / 0.9);
      for (let i = 0; i <= n; i++) {
        if (i / n > Z.stuhl + 0.001) continue;
        const y = H.y0 + 0.1 + (L - 0.2) * i / n;
        for (const s of [-1, 1]) {
          const xE = s < 0 ? H.x0 - UE_T : H.x1 + UE_T, zE = H.ze - UE_T * H.neig;
          stab(M, "sparren" + i + s, [xE, y, zE + 0.08], [H.xm, y, H.zf + 0.08], 0.1, 0.16, () => (g, F) => { holzMalen(g, F, 0, 0, F.w, F.h, [176, 136, 92], i * 3 + s); }, { quer: [0, 1, 0], mitte: [H.xm + s * 0.8, y, 2.2] });
        }
      }
      M.teil("haus2", { schatten: true, mitte: HAUS_MITTE });
    }
    /* Dach */
    if (Z.dach > 0) dachBauen(M, V, Z, winter);
  }
  function dachBauen(M, V, Z, winter) {
    const H = HAUS, t = Z.dach;
    M.teil("dach", { schatten: true, mitte: [HAUS_MITTE[0], HAUS_MITTE[1], HAUS_MITTE[2] + 0.2] });
    const ya = H.y0 - UE_G, yb = H.y1 + UE_G;
    const zE = H.ze - UE_T * H.neig, zF = H.zf + 0.06;
    const xO = H.x1 + UE_T, xW = H.x0 - UE_T;
    const schnee = winter && Z.schnee;
    const dachMal = (saat) => (g, F) => {
      schieferMalen(g, F, F.w, F.h, saat, t < 1 ? t : null);
      if (schnee) {
        PI.schneeDach(g, 0, 0, F.w, F.h, F, { deck: 0.93, saat: saat + 3 });
        g.fillStyle = "rgba(176,196,228,0.35)"; g.fillRect(0, F.h - 0.08, F.w, 0.08);
      }
      /* Lattung sichtbar, wo noch nicht gedeckt */
      if (t < 1) {
        const yAb = F.h * (1 - t);
        g.fillStyle = "rgb(186,150,104)";
        for (let yy = 0.05; yy < yAb; yy += 0.19) g.fillRect(0, yy, F.w, 0.04);
      }
    };
    polyF(M, "dach-ost", [[xO, yb, zE], [xO, ya, zE], [H.xm, ya, zF], [H.xm, yb, zF]], dachMal(21), { innen: [H.xm, 0, 4] });
    polyF(M, "dach-west", [[xW, ya, zE], [xW, yb, zE], [H.xm, yb, zF], [H.xm, ya, zF]], dachMal(23), { innen: [H.xm, 0, 4] });
    if (t < 1) return;
    /* Traufbretter und Ortgang */
    const brett = (g, F) => { holzMalen(g, F, 0, 0, F.w, F.h, [72, 60, 50], 5); if (schnee) { g.fillStyle = rgb(SCHNEE); g.fillRect(0, 0, F.w, F.h * 0.3); } };
    wandF(M, "traufe-o", [xO, yb], [xO, ya], zE - 0.2, zE, brett, { keinAo: true });
    wandF(M, "traufe-w", [xW, ya], [xW, yb], zE - 0.2, zE, brett, { keinAo: true });
    for (const [y, s] of [[yb, 1], [ya, -1]]) {
      const P = s > 0 ? [[xW, y, zE - 0.2], [H.xm, y, zF - 0.2], [xO, y, zE - 0.2], [xO, y, zE], [H.xm, y, zF + 0.02], [xW, y, zE]] : [[xO, y, zE - 0.2], [H.xm, y, zF - 0.2], [xW, y, zE - 0.2], [xW, y, zE], [H.xm, y, zF + 0.02], [xO, y, zE]];
      polyF(M, "ortgang" + s, P, (g, F) => { g.fillStyle = "rgb(70,60,52)"; g.fillRect(0, 0, F.w, F.h); rausch(g, 0, 0, F.w, F.h, 1, 0.2, 3, 3); if (schnee) { g.fillStyle = rgb(SCHNEE); g.fillRect(0, 0, F.w, 0.08); } }, { innen: [H.xm, 0, 5], keinAo: true });
    }
    /* Firstblech */
    stab(M, "first", [H.xm, ya, zF + 0.05], [H.xm, yb, zF + 0.05], 0.18, 0.1, (N) => (g, F) => { g.fillStyle = N[2] > 0.3 && schnee ? rgb(SCHNEE) : "rgb(96,100,108)"; g.fillRect(0, 0, F.w, F.h); }, { teil: false });
    /* Eiszapfen an der Traufe (durchsichtige Fläche unter der Traufe) */
    if (schnee) {
      const belicht = (F) => { const L = ST.lichtFaktor([0, 0, 1], F.zeit, 0, F.jahr); return L; };
      for (const [x, p0, p1] of [[xO + 0.01, [xO + 0.01, yb], [xO + 0.01, ya]], [xW - 0.01, [xW - 0.01, ya], [xW - 0.01, yb]]]) {
        void x;
        wandF(M, "zapfen" + x, p0, p1, zE - 0.75, zE - 0.19, (g, F) => {
          const L = belicht(F);
          g.save(); g.globalAlpha = 0.95;
          PI.eiszapfen(g, 0.2, F.w - 0.2, 0, F, { laenge: 0.45, saat: Math.round(x * 10) });
          g.restore();
          g.globalCompositeOperation = "multiply"; g.fillStyle = rgb(L.map((v) => v * 255)); g.fillRect(0, 0, F.w, F.h * 0.02); g.globalCompositeOperation = "source-over";
        }, { keinLicht: true, keinAo: true, beidseitig: false });
      }
    }
  }

  /* Esse (Schornstein) der Kesselanlage: Ziegel, Eisenringe, Kopf */
  function esse(M, V, Z, winter) {
    const K = KAMIN, hK = K.h * Z.kamin;
    if (hK < 0.1) return;
    M.teil("esse", { schatten: true, mitte: [K.x, K.y, HAUS_MITTE[2]] });
    const halb = (z) => (K.b0 + (K.b1 - K.b0) * (z / K.h)) / 2;
    const zs = 1.1;                                  // Sandsteinsockel
    const h0 = halb(0), hs = halb(zs), ht = halb(hK);
    const pts = (z, hh) => [[K.x - hh, K.y + hh, z], [K.x + hh, K.y + hh, z], [K.x + hh, K.y - hh, z], [K.x - hh, K.y - hh, z]];
    const S0 = pts(0, h0 + 0.08), S1 = pts(Math.min(hK, zs), h0 + 0.08);
    const sockel = (g, F) => { quaderMalen(g, F, 0, 0, F.w, F.h, 61, { lage: 0.28, laenge: 0.55 }); };
    const innen = [K.x, K.y, 1];
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      polyF(M, "essesockel" + i, [S1[i], S1[j], S0[j], S0[i]], sockel, { innen: innen, ao: true });
    }
    if (hK > zs) {
      const A = pts(zs, hs), E = pts(hK, ht);
      const schaft = (g, F) => {
        ziegelMalen(g, F, 0, 0, F.w, F.h, 71, { farbe: [140, 62, 44] });
        /* Ruß nach oben, Eisenringe */
        const gr = g.createLinearGradient(0, 0, 0, 3);
        gr.addColorStop(0, "rgba(20,16,14,0.55)"); gr.addColorStop(1, "rgba(20,16,14,0)");
        g.fillStyle = gr; g.fillRect(0, 0, F.w, 3);
        for (let z = zs + 1.6; z < hK - 0.4; z += 1.6) {
          const y = F.h - (z - zs) * F.h / (hK - zs);
          g.fillStyle = "rgb(44,40,38)"; g.fillRect(0, y, F.w, 0.05);
          g.fillStyle = "rgba(120,60,30,0.3)"; g.fillRect(0, y + 0.05, F.w, 0.12);
        }
      };
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4;
        polyF(M, "esse" + i, [E[i], E[j], A[j], A[i]], schaft, { innen: [K.x, K.y, hK / 2] });
      }
      polyF(M, "essedeckel", [S1[0], S1[1], S1[2], S1[3]], (g, F) => { quaderMalen(g, F, 0, 0, F.w, F.h, 63, {}); if (winter && Z.schnee) schneeDecke(g, F, 0, 0, F.w, F.h, 8, 0.9); }, { innen: innen });
      if (Z.kamin >= 1) {
        /* Kopf: vorkragender Kranz */
        M.teil("essekopf", { schatten: true, mitte: [K.x, K.y, HAUS_MITTE[2] + 0.5] });
        const k0 = hK - 0.55, kk = ht + 0.1;
        const kopf = (g, F) => {
          ziegelMalen(g, F, 0, 0, F.w, F.h, 73, { farbe: [120, 54, 40] });
          g.fillStyle = "rgba(14,12,10,0.55)"; g.fillRect(0, 0, F.w, F.h);
          g.fillStyle = "rgba(0,0,0,0.3)"; g.fillRect(0, F.h * 0.45, F.w, 0.04);
        };
        const P0 = pts(k0, kk), P1 = pts(hK + 0.05, kk);
        for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; polyF(M, "kopf" + i, [P1[i], P1[j], P0[j], P0[i]], kopf, { innen: [K.x, K.y, hK - 0.2] }); }
        polyF(M, "kopfoben", P1, (g, F) => {
          g.fillStyle = "rgb(40,36,34)"; g.fillRect(0, 0, F.w, F.h);
          g.fillStyle = "rgb(8,6,6)"; g.fillRect(0.2, 0.2, F.w - 0.4, F.h - 0.4);
          if (winter && Z.schnee) { g.fillStyle = rgb(SCHNEE); g.fillRect(0, 0, F.w, 0.12); g.fillRect(0, F.h - 0.12, F.w, 0.12); g.fillRect(0, 0, 0.12, F.h); g.fillRect(F.w - 0.12, 0, 0.12, F.h); }
        }, { innen: [K.x, K.y, hK - 0.2] });
      }
    }
  }

  /* =====================================================================
     FELSHANG UND STOLLEN
     ===================================================================== */
  /* Felsklotz in der Südwestecke: Fußring G (z = 0), Kantenring T oben,
     drei innere Firstpunkte I. Die Ostwand zwischen G4/G5 und T4/T5 ist
     eben und leicht zurückgelehnt (0,12 m je Meter) – darin das Mundloch. */
  const PORTAL_H = 3.65, PORTAL_K = 0.12;
  const PX_OBEN = PORTAL_X - PORTAL_K * PORTAL_H;
  const HANG_G = [[-6.0, 1.2], [-4.6, 0.85], [-2.9, 1.05], [-1.95, 1.85], [PORTAL_X, 2.65], [PORTAL_X, 4.55], [-2.3, 5.9], [-4.2, 6.0], [-6.0, 5.8]];
  const HANG_T = [[-5.7, 1.6, 2.4], [-4.6, 1.35, 3.2], [-3.0, 1.5, 3.4], [-2.35, 2.05, 3.5], [PX_OBEN, 2.65, PORTAL_H], [PX_OBEN, 4.55, PORTAL_H], [-2.7, 5.45, 2.9], [-4.2, 5.6, 2.6], [-5.6, 5.4, 2.3]];
  const HANG_I = [[-4.4, 2.6, 4.05], [-3.3, 3.75, 3.95], [-4.6, 4.4, 3.75]];
  const HANG_INNEN = [-3.8, 3.5, 1.2];
  const HANG_MITTE = [-3.8, STOLLEN_Y, 1.2];
  /* Die Kanten zwischen den Stützpunkten werden in ~0,8-m-Stücke geteilt
     und verwackelt (Fuß etwas vor/zurück, Oberkante höher/tiefer und
     mehr oder weniger zurückgesetzt): so bekommt der Klotz eine zerklüftete
     Silhouette und viele verschieden belichtete Wandstücke. Die
     Portalwand bleibt eine ebene Fläche. Jede Ringkante merkt sich den
     inneren Firstpunkt, zu dem die Oberseite hin trianguliert wird. */
  const HANG_ZU_I = [0, 0, 0, 1, 1, 1, 2, 2, 2];
  const HANG_RING = (function () {
    const r = zufall(90210), G = [], T = [], I = [], portal = [];
    const n = HANG_G.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, A = HANG_G[i], B = HANG_G[j], TA = HANG_T[i], TB = HANG_T[j];
      const teile = i === 4 ? 1 : Math.max(1, Math.round(Math.hypot(B[0] - A[0], B[1] - A[1]) / 0.8));
      for (let k = 0; k < teile; k++) {
        const t = k / teile, erster = k === 0;
        let g = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, 0];
        let o = [TA[0] + (TB[0] - TA[0]) * t, TA[1] + (TB[1] - TA[1]) * t, TA[2] + (TB[2] - TA[2]) * t];
        if (!erster) {
          const dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy), nx = dy / l, ny = -dx / l;
          const a = (r() - 0.5) * 0.3, b = (r() - 0.3) * 0.35;
          g = [g[0] + nx * a, g[1] + ny * a, 0];
          o = [o[0] + nx * (a - b), o[1] + ny * (a - b), o[2] + (r() - 0.45) * 0.7];
        }
        G.push(g); T.push(o); I.push(HANG_ZU_I[i]); portal.push(i === 4);
      }
    }
    return { G: G, T: T, I: I, portal: portal };
  })();
  /* Felsfarbe: Harzer Grauwacke und Tonschiefer */
  const FELS = [112, 108, 98];

  /* Fels an einer steilen Fläche: Grauwacke in Bänken. Die Bankfugen
     liegen auf festen Welthöhen (leicht geneigt), damit sie über die
     Kanten der Flächen weiterlaufen. Jede Bank ist ein wenig vorgewölbt:
     oben eine Lichtkante, unten Schatten auf die nächste Bank; dazwischen
     senkrechte Klüfte, die Bank für Bank versetzt sind. Moos und Flechten
     sitzen in den Fugen, im Winter liegt Schnee auf den Absätzen. */
  const BANK_Z = (function () {
    const r = zufall(4711), Z = [0];
    while (Z[Z.length - 1] < 6) Z.push(Z[Z.length - 1] + 0.26 + r() * 0.34);
    return Z;
  })();
  function felsMaler(saat, winter, jahr, opt) {
    opt = opt || {};
    return function (g, F) {
      const f = F.flaeche, w = F.w, h = F.h, px = F.px;
      const rng = zufall(saat);
      g.fillStyle = rgb(FELS); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
      rausch(g, -0.1, -0.1, w + 0.2, h + 0.2, 3.2, 0.3, 3, 4);
      rausch(g, -0.1, -0.1, w + 0.2, h + 0.2, 0.9, 0.22, 8, 3);
      /* Farbwolken: ockrig verwittert, grünlich, bläulich-grau */
      const TINT = ["rgba(150,118,80,0.22)", "rgba(96,110,84,0.18)", "rgba(92,98,112,0.2)"];
      for (let i = 0; i < 2 + w * h * 0.15; i++) {
        const cx = rng() * w, cy = rng() * h, r = 0.6 + rng() * 1.2;
        const gg = g.createRadialGradient(cx, cy, 0, cx, cy, r);
        gg.addColorStop(0, TINT[(rng() * 3) | 0]); gg.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = gg; g.fillRect(cx - r, cy - r, 2 * r, 2 * r);
      }
      const vz = f.v[2], oz = f.o[2];
      if (Math.abs(vz) > 0.3 && px > 5) {
        /* Flächen-y einer Welthöhe z an der Stelle x (mit Neigung der Bänke) */
        const yAus = (z, x) => { const q = welt(f, x, 0); return (z + (q[0] * 0.05 + q[1] * 0.035) + Math.sin(q[0] * 1.7 + q[1] * 1.1 + z * 7) * 0.04 - oz) / vz; };
        const schritt = 0.25;
        for (let k = 0; k < BANK_Z.length - 1; k++) {
          const z0 = BANK_Z[k], z1 = BANK_Z[k + 1];
          const yu = (x) => yAus(z0, x), yo = (x) => yAus(z1, x);
          if (yo(0) > h + 0.6 && yo(w) > h + 0.6) continue;
          if (yu(0) < -0.6 && yu(w) < -0.6) continue;
          const kr = zufall(saat * 31 + k * 97);
          /* Bank in Blöcke zerlegt: jeder Block eigener Ton, oben Licht,
             unten Schatten; mal springt ein Block vor, mal zurück */
          const basis = hell(streu(FELS, kr, 0.08), (kr() - 0.5) * 0.16);
          const kl = [-0.2];
          while (kl[kl.length - 1] < w + 0.2) kl.push(kl[kl.length - 1] + 0.3 + kr() * 0.9);
          for (let q = 0; q < kl.length - 1; q++) {
            const xa = kl[q], xb = kl[q + 1], ton = hell(streu(basis, kr, 0.07), (kr() - 0.5) * 0.14);
            g.beginPath();
            g.moveTo(xa, yo(xa)); for (let x = xa + schritt; x < xb; x += schritt) g.lineTo(x, yo(x)); g.lineTo(xb, yo(xb));
            g.lineTo(xb, yu(xb)); for (let x = xb - schritt; x > xa; x -= schritt) g.lineTo(x, yu(x)); g.lineTo(xa, yu(xa));
            g.closePath();
            const xm = (xa + xb) / 2, y1 = yo(xm), y2 = yu(xm);
            const gr = g.createLinearGradient(0, y1, 0, y2);
            gr.addColorStop(0, rgb(hell(ton, 0.16), 0.9)); gr.addColorStop(0.3, rgb(ton, 0.75)); gr.addColorStop(0.85, rgb(hell(ton, -0.22), 0.85)); gr.addColorStop(1, rgb(hell(ton, -0.42), 0.9));
            g.fillStyle = gr; g.fill();
            /* Kluft am Blockrand: dunkle Fuge, daneben Lichtkante */
            if (px > 10 && q > 0) {
              g.strokeStyle = "rgba(24,22,20,0.6)"; g.lineWidth = Math.max(0.012, 1.2 / px);
              const j = (kr() - 0.5) * 0.12;
              g.beginPath(); g.moveTo(xa, y1 < y2 ? yo(xa) : yo(xa)); g.lineTo(xa + j, (yo(xa) + yu(xa)) / 2); g.lineTo(xa + j * 0.4, yu(xa)); g.stroke();
              g.strokeStyle = "rgba(236,232,220,0.14)"; g.lineWidth = Math.max(0.01, 0.9 / px);
              g.beginPath(); g.moveTo(xa + 0.025, yo(xa) + 0.03); g.lineTo(xa + j + 0.025, (yo(xa) + yu(xa)) / 2); g.stroke();
            }
            /* feine Risse im Block */
            if (px > 30 && kr() < 0.5) {
              g.strokeStyle = "rgba(30,28,24,0.35)"; g.lineWidth = Math.max(0.006, 0.7 / px);
              g.beginPath(); let x = xa + (xb - xa) * kr(), y = y1 + 0.03; g.moveTo(x, y);
              for (let t = 0; t < 3; t++) { x += (kr() - 0.5) * 0.12; y += (y2 - y1) / 3; g.lineTo(x, y); }
              g.stroke();
            }
          }
          /* Bankfuge: dunkle Schattenfuge, darüber (Unterkante der Bank
             darüber) eine feine Lichtkante */
          g.strokeStyle = "rgba(22,20,18,0.62)"; g.lineWidth = Math.max(0.018, 1.6 / px);
          g.beginPath(); for (let x = -0.1; x <= w + 0.1; x += schritt) { if (x < 0) g.moveTo(x, yu(x)); else g.lineTo(x, yu(x)); } g.stroke();
          if (winter) {
            g.strokeStyle = rgb(SCHNEE, 0.95); g.lineWidth = 0.045;
            g.beginPath(); let an = false;
            for (let x = -0.1; x <= w + 0.1; x += 0.12) {
              const q = welt(f, x, 0), ja = Math.sin(q[0] * 2.9 + q[1] * 2.1 + z0 * 5) + Math.sin(q[0] * 7.3 - q[1] * 5.1 + z0 * 3) > 0.7;
              const y = yo(x) + 0.01;
              if (ja && an) g.lineTo(x, y); else g.moveTo(x, y);
              an = ja;
            }
            g.stroke();
          } else if (px > 16) {
            /* Moos in den Fugen */
            g.strokeStyle = jahr === "herbst" ? "rgba(118,110,52,0.5)" : "rgba(72,98,44,0.5)"; g.lineWidth = 0.04;
            g.beginPath(); let an = false;
            for (let x = -0.1; x <= w + 0.1; x += 0.1) {
              const q = welt(f, x, 0), ja = Math.sin(q[0] * 3.3 - q[1] * 2.3 + z0 * 9) > 0.45;
              if (ja && an) g.lineTo(x, yu(x) - 0.015); else g.moveTo(x, yu(x) - 0.015);
              an = ja;
            }
            g.stroke();
          }
        }
        /* Flechten und Rostläufer */
        if (px > 14) {
          /* Flechten: feine, unregelmäßige Krusten in Gruppen */
          g.fillStyle = winter ? "rgba(200,200,190,0.18)" : "rgba(188,186,150,0.22)";
          g.beginPath();
          for (let i = 0; i < w * h * 0.8; i++) {
            const cx = rng() * w, cy = rng() * h;
            for (let k = 0; k < 7; k++) { const x = cx + (rng() - 0.5) * 0.18, y = cy + (rng() - 0.5) * 0.1, r = 0.006 + rng() * 0.018; g.moveTo(x + r, y); g.ellipse(x, y, r * 1.4, r, rng() * 3, 0, TAU); }
          }
          g.fill();
        }
        g.fillStyle = "rgba(122,66,30,0.16)";
        for (let i = 0; i < w * 0.5; i++) { const x = rng() * w; g.fillRect(x, rng() * h * 0.5, 0.04 + rng() * 0.08, 0.5 + rng() * 1.2); }
      }
      bleich(g, 0, 0, w, h, 2.4, 0.06, saat + 3);
      /* feuchter, dunkler Fuß; im Winter Schnee angeweht */
      const gr = g.createLinearGradient(0, h, 0, h - 0.6);
      if (winter) { gr.addColorStop(0, "rgba(244,247,252,1)"); gr.addColorStop(1, "rgba(244,247,252,0)"); }
      else { gr.addColorStop(0, "rgba(40,36,30,0.35)"); gr.addColorStop(1, "rgba(40,36,30,0)"); }
      g.fillStyle = gr; g.fillRect(0, h - 0.6, w, 0.6);
      if (opt.nach) opt.nach(g, F);
    };
  }
  /* Oberseite des Hangs: Heide, Gras, Blaubeeren, Felsköpfe; im Winter Schnee */
  function hangObenMaler(saat, jahr) {
    return function (g, F) {
      const w = F.w, h = F.h, px = F.px, rng = zufall(saat);
      const winter = jahr === "winter";
      const gras = jahr === "herbst" ? [128, 112, 64] : jahr === "fruehling" ? [104, 132, 64] : [92, 116, 58];
      g.fillStyle = rgb(winter ? SCHNEE : gras); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
      if (!winter) {
        rausch(g, 0, 0, w, h, 1.6, 0.4, saat, 4);
        /* Heidekraut und Blaubeeren als Büschel */
        const n = Math.round(w * h * (px > 20 ? 14 : 5));
        for (let i = 0; i < n; i++) {
          const x = rng() * w, y = rng() * h, r = 0.05 + rng() * 0.12, k = rng();
          g.fillStyle = k < 0.3 ? (jahr === "herbst" ? "rgba(140,74,52,0.5)" : "rgba(58,80,40,0.55)") : k < 0.5 ? (jahr === "sommer" ? "rgba(118,92,104,0.3)" : jahr === "herbst" ? "rgba(120,84,70,0.35)" : "rgba(80,100,50,0.5)") : "rgba(146,146,92,0.3)";
          g.beginPath(); g.ellipse(x, y, r, r * 0.7, 0, 0, TAU); g.fill();
        }
        if (jahr === "herbst") { g.fillStyle = "rgba(196,120,40,0.5)"; for (let i = 0; i < w * h * 4; i++) { g.beginPath(); g.ellipse(rng() * w, rng() * h, 0.05, 0.03, rng() * 3, 0, TAU); g.fill(); } }
        if (jahr === "fruehling") { for (let i = 0; i < w * h * 3; i++) { g.fillStyle = rng() < 0.5 ? "rgba(250,246,220,0.9)" : "rgba(240,210,60,0.9)"; g.beginPath(); g.arc(rng() * w, rng() * h, 0.03, 0, TAU); g.fill(); } }
      } else {
        rausch(g, 0, 0, w, h, 2.6, 0.07, 5, 3);
        /* Windmulden: flache, bläuliche Mulden in Weltlage (flächenübergreifend) */
        const f = F.flaeche;
        g.save(); g.translate(-dot(f.o, f.u), -dot(f.o, f.v));
        const r2 = zufall(4242);
        for (let i = 0; i < 40; i++) {
          const wx = -6 + r2() * 5, wy = 1 + r2() * 5, rx = 0.3 + r2() * 0.6;
          const p = [wx * f.u[0] + wy * f.u[1], wx * f.v[0] + wy * f.v[1]];
          const gg = g.createRadialGradient(p[0], p[1], 0, p[0], p[1], rx);
          gg.addColorStop(0, "rgba(160,182,220,0.14)"); gg.addColorStop(1, "rgba(160,182,220,0)");
          g.fillStyle = gg; g.fillRect(p[0] - rx, p[1] - rx, 2 * rx, 2 * rx);
        }
        g.restore();
      }
      /* Felsköpfe, die durchstoßen: flache, gebänderte Platten */
      for (let i = 0; i < w * h * (winter ? 0.07 : 0.18); i++) {
        const cx = rng() * w, cy = rng() * h, r = 0.18 + rng() * 0.3;
        const P = []; for (let j = 0; j < 9; j++) { const a = j / 9 * TAU; P.push([cx + Math.cos(a) * r * (0.7 + rng() * 0.4), cy + Math.sin(a) * r * 0.55 * (0.7 + rng() * 0.4)]); }
        const gr = g.createLinearGradient(cx - r, cy - r * 0.5, cx + r * 0.6, cy + r * 0.6);
        gr.addColorStop(0, rgb(hell(FELS, 0.12))); gr.addColorStop(1, rgb(hell(FELS, -0.25)));
        g.fillStyle = gr; vieleck(g, P); g.fill();
        g.strokeStyle = "rgba(30,28,24,0.35)"; g.lineWidth = Math.max(0.01, 0.8 / px);
        g.beginPath(); g.moveTo(cx - r * 0.6, cy); g.lineTo(cx + r * 0.6, cy + r * 0.1); g.stroke();
        if (winter) {
          /* Schnee deckt die Platte bis auf die Schattenkante unten */
          g.save(); vieleck(g, P); g.clip();
          g.fillStyle = rgb(SCHNEE);
          g.beginPath(); g.moveTo(cx - r * 1.5, cy - r * 1.5); g.lineTo(cx + r * 1.5, cy - r * 1.5);
          for (let k = 6; k >= -6; k--) g.lineTo(cx + r * k / 4, cy + r * (0.12 + 0.12 * Math.sin(k * 2.1 + cx * 9)));
          g.closePath(); g.fill();
          g.restore();
        }
      }
      if (winter && px > 20) { g.fillStyle = "rgba(255,255,255,0.9)"; for (let i = 0; i < w * h * 4; i++) { const r = (0.5 + rng()) / px; g.fillRect(rng() * w, rng() * h, r, r); } }
    };
  }

  function felshang(M, V, Z, winter, jahr) {
    const R = HANG_RING, G = R.G, T = R.T, I = HANG_I, n = G.length;
    /* ein Teil: der Klotz ist fast konvex; seine Mitte liegt auf der Höhe
       des Mundlochs, damit Türstock und Hang nur über x entschieden werden */
    M.teil("hang", { schatten: true, mitte: HANG_MITTE });
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      if (R.portal[i]) {
        polyF(M, "portalwand", [T[i], T[j], G[j], G[i]], felsMaler(97, winter, jahr, { nach: (g, F) => mundloch(g, F, Z, winter) }), { innen: HANG_INNEN, ao: true, vnFn: "flach", leuchten: Z.licht ? mundlochLicht : null });
        continue;
      }
      polyF(M, "hang" + i + "a", [G[i], G[j], T[j]], felsMaler(100 + i * 7, winter, jahr), { innen: HANG_INNEN, ao: true, vnFn: "flach" });
      polyF(M, "hang" + i + "b", [G[i], T[j], T[i]], felsMaler(103 + i * 7, winter, jahr), { innen: HANG_INNEN, ao: true, vnFn: "flach" });
    }
    /* Oberseite: Fächer zu den drei Firstpunkten, Übergangsdreiecke wo
       der Firstpunkt wechselt, in der Mitte das Dreieck der Firstpunkte */
    const DREI = [];
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      DREI.push([T[i], T[j], I[R.I[i]]]);
      if (R.I[j] !== R.I[i]) DREI.push([T[j], I[R.I[j]], I[R.I[i]]]);
    }
    DREI.push([I[0], I[1], I[2]]);
    const unten = (D) => [(D[0][0] + D[1][0] + D[2][0]) / 3, (D[0][1] + D[1][1] + D[2][1]) / 3, -5];
    const vn = eckNormalen(DREI, unten);
    DREI.forEach((D, k) => {
      const nn = nrm(kreuz(sub(D[1], D[0]), sub(D[2], D[0])));
      /* im Winter hält sich der Schnee auch auf steileren Stücken */
      const steil = Math.abs(nn[2]) < (winter ? 0.5 : 0.7);
      polyF(M, "hangoben" + k, D, steil ? felsMaler(200 + k, winter, jahr) : hangObenMaler(300 + k, jahr), steil ? { innen: unten(D), vnFn: "flach" } : { innen: unten(D), vnFn: vn });
    });
    /* Fichten auf dem Hang */
    const baeume = [[-5.1, 2.3, 5.0, 11], [-4.9, 4.9, 4.3, 23], [-3.5, 5.2, 3.5, 37]].slice(0, V.fichten + 1);
    baeume.forEach(([x, y, hh, sd], i) => {
      const zb = hangHoehe(x, y);
      M.teil("fichte" + i, { schatten: true, mitte: [x, y, zb + 0.5] });
      fichte(M, x, y, zb - 0.05, hh, sd, jahr);
    });
    /* Geröll am Fuß der Wände (flach auf dem Boden) */
    M.teil("geroell", { schatten: false, ebene: -8 });
    M.flaeche({ name: "geroell", o: [-6, 0.2, 0.01], u: [1, 0, 0], v: [0, 1, 0], w: 5.2, h: 5.8, keinLicht: true, malen: (g, F) => {
      const L = ST.lichtFaktor([0, 0, 1], F.zeit, 0, F.jahr), rng = zufall(77);
      g.save(); g.translate(6, -0.2);                   // Weltkoordinaten
      const Pd = new Path2D(), Ph = [new Path2D(), new Path2D(), new Path2D()];
      for (let i = 0; i < n; i++) {
        const A = G[i], B = G[(i + 1) % n], dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy);
        /* Außennormale (Ring läuft im Uhrzeigersinn von oben gesehen) */
        let nx = dy / l, ny = -dx / l;
        if ((A[0] + nx - HANG_INNEN[0]) * nx + (A[1] + ny - HANG_INNEN[1]) * ny < 0) { nx = -nx; ny = -ny; }
        for (let k = 0; k < l * 22; k++) {
          const t = rng(), px = A[0] + dx * t, py = A[1] + dy * t;
          if (px > PORTAL_X - 0.3 && Math.abs(py - STOLLEN_Y) < 1.15) continue;     // vor dem Mundloch freigeräumt
          const d = Math.pow(rng(), 1.7) * 0.9, r = 0.035 + rng() * 0.11 * (1 - d);
          const x = px + nx * (d + 0.05), y = py + ny * (d + 0.05);
          Pd.moveTo(x + r * 1.5, y + r * 0.45); Pd.ellipse(x + r * 0.3, y + r * 0.45, r * 1.2, r * 0.55, 0, 0, TAU);
          Ph[(rng() * 3) | 0].moveTo(x + r * 1.3, y); Ph[(rng() * 3) | 0].ellipse(x, y, r * 1.3, r, rng(), 0, TAU);
        }
      }
      g.fillStyle = litF([26, 24, 22], L, 0.35); g.fill(Pd);
      [[96, 92, 84], [120, 114, 104], [140, 132, 120]].forEach((c, k) => { g.fillStyle = litF(winter ? hell(c, 0.25) : c, L); g.fill(Ph[k]); });
      if (winter) { g.fillStyle = litF(SCHNEE, L, 0.45); g.fill(Ph[2]); }
      g.restore();
    } });
  }
  /* Höhe der Hangoberseite über (x, y) – grob, für Bäume */
  function hangHoehe(x, y) {
    let best = 0, bw = 0;
    for (const p of HANG_I.concat(HANG_RING.T)) { const d = Math.hypot(p[0] - x, p[1] - y) + 0.3; const w = 1 / (d * d * d); best += p[2] * w; bw += w; }
    return best / bw;
  }

  /* Mundloch: grob gebrochene Öffnung im Fels, drinnen Dunkel, die
     Türstöcke des Stollens verlieren sich in der Tiefe, das Gleis läuft
     hinein. Maße in Flächenkoordinaten der Portalwand. */
  const IN_BERG = [-1, 0, 0];
  function mundlochMasse(F) {
    const f = F.flaeche;
    const ac = dot(sub([PORTAL_X, STOLLEN_Y, 0], f.o), f.u);
    return { a0: ac - 0.86, a1: ac + 0.86, ac: ac, bTop: (f.o[2] - 2.42) / Math.abs(f.v[2]), bBot: F.h };
  }
  function mundlochPfad(g, m) {
    g.beginPath();
    g.moveTo(m.a0, m.bBot + 0.05);
    g.lineTo(m.a0 - 0.03, m.bTop + 0.55);
    g.quadraticCurveTo(m.a0 + 0.02, m.bTop - 0.08, m.ac - 0.2, m.bTop - 0.14);
    g.lineTo(m.ac + 0.15, m.bTop - 0.1);
    g.quadraticCurveTo(m.a1 - 0.02, m.bTop - 0.06, m.a1 + 0.03, m.bTop + 0.5);
    g.lineTo(m.a1, m.bBot + 0.05);
    g.closePath();
  }
  function reinVersatz(g, F, t) {
    const f = F.flaeche, N = f.N || F.n;
    const d = tiefe(g, F, dot(N, IN_BERG) * t);
    return [dot(f.u, IN_BERG) * t + d[0], dot(f.v, IN_BERG) * t + d[1]];
  }
  function mundloch(g, F, Z, winter) {
    const m = mundlochMasse(F);
    /* nasser, dunkler Rand und ausgebrochene Kanten */
    g.save();
    g.strokeStyle = "rgba(34,30,26,0.55)"; g.lineWidth = 0.18; mundlochPfad(g, m); g.stroke();
    g.clip();
    g.fillStyle = "rgb(9,8,7)"; g.fillRect(m.a0 - 0.5, m.bTop - 0.5, m.a1 - m.a0 + 1, m.bBot - m.bTop + 1);
    const tMax = 7, pf = reinVersatz(g, F, tMax);
    /* Sohle mit Gleis */
    const sg = g.createLinearGradient(m.ac, m.bBot, m.ac + pf[0], m.bBot + pf[1]);
    sg.addColorStop(0, "rgb(52,44,36)"); sg.addColorStop(0.5, "rgb(20,17,14)"); sg.addColorStop(1, "rgb(9,8,7)");
    g.fillStyle = sg;
    g.beginPath(); g.moveTo(m.a0, m.bBot); g.lineTo(m.a1, m.bBot); g.lineTo(m.a1 + pf[0], m.bBot + pf[1]); g.lineTo(m.a0 + pf[0], m.bBot + pf[1]); g.closePath(); g.fill();
    if (Z.gleis >= 0.8) {
      g.lineWidth = 0.045;
      for (const q of [-0.3, 0.3]) {
        const gr = g.createLinearGradient(m.ac + q, m.bBot, m.ac + q + pf[0], m.bBot + pf[1]);
        gr.addColorStop(0, "rgba(150,140,130,0.9)"); gr.addColorStop(0.6, "rgba(60,56,52,0.4)"); gr.addColorStop(1, "rgba(20,18,16,0)");
        g.strokeStyle = gr; g.beginPath(); g.moveTo(m.ac + q, m.bBot); g.lineTo(m.ac + q + pf[0], m.bBot + pf[1]); g.stroke();
      }
    }
    /* Türstöcke im Stollen, dunkler je tiefer */
    for (let k = 1; k <= 6; k++) {
      const d = reinVersatz(g, F, k * 0.85), a = Math.max(0, 0.7 - k * 0.12);
      const x0 = m.ac - 0.74 + d[0], x1 = m.ac + 0.74 + d[0], yb = m.bBot + d[1], yt = m.bBot - 2.25 + d[1];
      g.strokeStyle = "rgba(118,90,60," + a + ")"; g.lineWidth = 0.15;
      g.beginPath(); g.moveTo(x0, yb); g.lineTo(x0 + 0.1, yt); g.lineTo(x1 - 0.1, yt); g.lineTo(x1, yb); g.stroke();
    }
    g.restore();
    void winter;
  }
  function mundlochLicht(g, F) {
    const m = mundlochMasse(F), a = F.nacht;
    g.save(); mundlochPfad(g, m); g.clip();
    const d = reinVersatz(g, F, 3.5);
    const cx = m.ac + d[0], cy = m.bBot - 1.1 + d[1];
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, 1.6);
    gr.addColorStop(0, "rgba(255,196,118," + 0.6 * a + ")"); gr.addColorStop(1, "rgba(255,160,80,0)");
    g.fillStyle = gr; g.fillRect(cx - 2, cy - 2, 4, 4);
    g.restore();
    F.leuchtPunkt(m.ac, m.bBot - 1.0, 1.1, "255,180,100", 0.3);
  }

  /* Türstockausbau vor dem Mundloch: zwei
     Türstöcke (Stempel, Kappe; ragt 0,6 m aus dem Fels), Seitenverzug aus Schwarten, oben Verzug
     mit Erde; Schild „Glück auf!" mit Schlägel und Eisen, Grubenlampe.
     Mitten der Teile auf Höhe und y des Hangs – dann entscheidet x. */
  function tuerstock(M, V, Z, winter) {
    const t = Z.tuerstock, Y = STOLLEN_Y, X0 = PORTAL_X, X1 = PORTAL_X + 0.62;
    const mitte = (x) => [x, HANG_MITTE[1], HANG_MITTE[2]];
    const holzMal = (N) => (g, F) => {
      holzMalen(g, F, 0, 0, F.w, F.h, N[2] > 0.5 ? [128, 98, 66] : HOLZ, Math.round(F.w * 100));
      if (F.px > 25) { g.fillStyle = "rgba(60,44,30,0.4)"; g.fillRect(0, 0, F.w, F.h * 0.12); g.fillRect(0, F.h * 0.88, F.w, F.h * 0.12); }
      if (winter && Z.schnee && N[2] > 0.5) schneeDecke(g, F, 0, 0, F.w, F.h, 3, 0.95);
    };
    const RAHMEN = [X0 + 0.08, X1 - 0.1];
    RAHMEN.forEach((x, i) => {
      if (t < 0.2 + i * 0.3) return;
      for (const s of [-1, 1]) stab(M, "stempel" + i + s, [x, Y + s * 0.72, 0], [x, Y + s * 0.62, 2.26], 0.2, 0.2, holzMal, { quer: [1, 0, 0], mitte: mitte(x + 0.05) });
      stab(M, "kappe" + i, [x, Y - 0.86, 2.36], [x, Y + 0.86, 2.36], 0.22, 0.22, holzMal, { mitte: mitte(x + 0.06) });
    });
    if (t < 0.85) return;
    M.teil("verzug", { schatten: true, mitte: mitte((X0 + X1) / 2) });
    const schwarten = (g, F) => { bretterMalen(g, F, 0, 0, F.w, F.h, HOLZ_ALT, 91, { breite: 0.18, senkrecht: false }); g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(0, F.h - 0.25, F.w, 0.25); };
    const innenS = (g, F) => { schwarten(g, F); g.fillStyle = "rgba(6,5,4,0.78)"; g.fillRect(0, 0, F.w, F.h); };
    /* Sohle unter dem Ausbau: nasser Grus, das Gleis läuft hinein */
    M.flaeche({ name: "verzug-sohle", o: [X0 - 0.3, Y - 0.62, 0.03], u: [1, 0, 0], v: [0, 1, 0], w: X1 - X0 + 0.3, h: 1.24, ebene: -2, malen: (g, F) => {
      g.fillStyle = "rgb(46,40,34)"; g.fillRect(0, 0, F.w, F.h);
      const gr = g.createLinearGradient(0, 0, F.w, 0); gr.addColorStop(0, "rgba(0,0,0,0.6)"); gr.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gr; g.fillRect(0, 0, F.w, F.h);
      if (Z.gleis >= 0.8) { g.fillStyle = "rgb(120,112,104)"; g.fillRect(0, 0.3, F.w, 0.035); g.fillRect(0, 0.9, F.w, 0.035); }
    } });
    const um = (w) => [[0, 0.1], [w, 0.1], [w, 2.25], [0, 2.25]];
    wandF(M, "verzug-s", [X0, Y + 0.8], [X1, Y + 0.8], 0, 2.25, schwarten, { ao: true, umriss: um(X1 - X0) });
    wandF(M, "verzug-n", [X1, Y - 0.8], [X0, Y - 0.8], 0, 2.25, schwarten, { ao: true, umriss: um(X1 - X0) });
    wandF(M, "verzug-si", [X1, Y + 0.62], [X0, Y + 0.62], 0, 2.25, innenS, { ebene: -1 });
    wandF(M, "verzug-ni", [X0, Y - 0.62], [X1, Y - 0.62], 0, 2.25, innenS, { ebene: -1 });
    /* Dachverzug mit Erde und Steinen, reicht bis an die Felswand */
    const xR = PORTAL_X - PORTAL_K * 2.5;
    M.flaeche({ name: "verzug-oben", o: [xR, Y - 0.95, 2.48], u: [1, 0, 0], v: [0, 1, 0], w: X1 + 0.04 - xR, h: 1.9, malen: (g, F) => {
      bretterMalen(g, F, 0, 0, F.w, F.h, [100, 82, 60], 93, { breite: 0.16, senkrecht: false });
      const rng = zufall(94);
      g.fillStyle = "rgba(92,74,54,0.92)";
      g.beginPath(); g.moveTo(0, 0.1); g.quadraticCurveTo(F.w * 0.95, F.h / 2, 0, F.h - 0.1); g.closePath(); g.fill();
      for (let i = 0; i < 30; i++) { g.fillStyle = rgb(streu(FELS, rng, 0.2)); g.beginPath(); g.ellipse(rng() * F.w * 0.5, 0.2 + rng() * (F.h - 0.4), 0.04 + rng() * 0.06, 0.03 + rng() * 0.04, rng() * 3, 0, TAU); g.fill(); }
      if (winter && Z.schnee) schneeDecke(g, F, 0, 0, F.w, F.h, 95, 0.96);
    } });
    wandF(M, "verzug-stirn", [X1 + 0.04, Y + 0.95], [X1 + 0.04, Y - 0.95], 2.47, 2.53, (g, F) => { g.fillStyle = "rgb(88,70,52)"; g.fillRect(0, 0, F.w, F.h); if (winter && Z.schnee) { g.fillStyle = rgb(SCHNEE); g.fillRect(0, 0, F.w, F.h * 0.6); } }, { keinAo: true });
    if (Z.schild) schild(M, V, Z, winter, X1 + 0.05, Y);
    if (Z.laterne) grubenlampe(M, Z, [X1 - 0.1, Y + 0.66], [X1 + 0.18, Y + 0.95]);
  }
  /* Schild auf dem vorderen Türstock, Schrift zur Ostseite */
  function schild(M, V, Z, winter, x, y) {
    M.teil("schild", { schatten: true, mitte: [x + 0.1, HANG_MITTE[1], HANG_MITTE[2]] });
    const w = 1.62, z0 = 2.6, z1 = 3.08;
    const brett = (g, F) => {
      const W = F.w, H = F.h;
      bretterMalen(g, F, 0, 0, W, H, [70, 52, 36], 211, { breite: 0.16, senkrecht: false });
      g.fillStyle = "rgba(20,14,10,0.55)"; g.fillRect(0, 0, W, H);
      g.strokeStyle = "rgb(46,34,24)"; g.lineWidth = 0.035; g.strokeRect(0.02, 0.02, W - 0.04, H - 0.04);
      if (F.px > 9) {
        /* Schlägel und Eisen, gekreuzt */
        g.save(); g.translate(0.25, H / 2);
        g.strokeStyle = "rgb(214,196,150)"; g.fillStyle = "rgb(214,196,150)"; g.lineWidth = 0.022; g.lineCap = "round";
        for (const s of [-1, 1]) {
          g.save(); g.rotate(s * Math.PI / 4);
          g.beginPath(); g.moveTo(0, 0.17); g.lineTo(0, -0.12); g.stroke();
          if (s < 0) g.fillRect(-0.065, -0.18, 0.13, 0.065);                       // Schlägel (Hammer)
          else { g.beginPath(); g.moveTo(-0.075, -0.12); g.lineTo(0.075, -0.12); g.lineTo(0.015, -0.21); g.lineTo(-0.015, -0.21); g.closePath(); g.fill(); }  // Eisen
          g.restore();
        }
        g.restore();
        g.fillStyle = "rgb(226,206,156)";
        g.font = "bold italic 0.21px 'DejaVu Serif', Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle";
        g.fillText("Glück auf!", W / 2 + 0.16, H / 2 + 0.01);
      }
      if (winter && Z.schnee) { g.fillStyle = rgb(SCHNEE); g.fillRect(0, 0, W, 0.03); }
    };
    const dunkel = "#3a2a1c";
    M.quader({ x: x - 0.02, y: y - w / 2, z: z0, b: 0.05, t: w, h: z1 - z0 }, {
      ost: brett, west: dunkel, sued: dunkel, nord: dunkel,
      oben: (g, F) => { g.fillStyle = winter && Z.schnee ? rgb(SCHNEE) : "#4a3624"; g.fillRect(0, 0, F.w, F.h); }
    }, { keinAo: true });
    for (const s of [-0.55, 0.55]) M.quader({ x: x - 0.01, y: y + s - 0.03, z: 2.47, b: 0.04, t: 0.06, h: 0.14 }, { ost: dunkel, sued: "#2a1e14", nord: "#2a1e14" }, { keinAo: true });
  }
  /* Grubenlampe am Ausleger (Froschlampe aus Messing) */
  function grubenlampe(M, Z, post, lampe) {
    const zL = 1.72, dx = post[0] - lampe[0], dy = post[1] - lampe[1];
    M.teil("lampe", { schatten: true, mitte: [lampe[0] + 0.1, HANG_MITTE[1], HANG_MITTE[2]] });
    M.figur({
      x: lampe[0], y: lampe[1], z: zL, breite: 0.6, hoehe: 0.62, schatten: true,
      malen(g, s, F) {
        const gier = (F.gier || 0) * RAD, c = Math.cos(gier), sn = Math.sin(gier);
        const P = (ex, ey, ez) => { const a = ex * c - ey * sn, b = ex * sn + ey * c; return [(a - b) * ST.KX * s, (a + b) * ST.KY * s - ez * ST.KZ * s]; };
        const Lt = figurLicht(F);
        const eisen = F.schatten ? "#000" : Lt.lit([40, 38, 36], Lt.O);
        g.lineCap = "round";
        const a = P(dx, dy, 0.5), b = P(0, 0, 0.5), h0 = P(0, 0, 0.36);
        g.strokeStyle = eisen; g.lineWidth = Math.max(1, 0.03 * s);
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(h0[0], h0[1]); g.stroke();
        const k = 0.075 * s, kz = ST.KZ * s;
        const mess = F.schatten ? "#000" : Lt.lit([176, 138, 70], Lt.L), messD = F.schatten ? "#000" : Lt.lit([120, 88, 40], Lt.R);
        g.fillStyle = messD; g.beginPath(); g.ellipse(0, -0.02 * kz, k * 1.05, k * 0.45, 0, 0, TAU); g.fill();
        g.fillStyle = mess; g.fillRect(-k, -0.1 * kz, k * 2, 0.08 * kz);
        const an = F.schatten ? 0 : F.nacht;
        g.fillStyle = F.schatten ? "#000" : an > 0.05 ? "rgba(255," + Math.round(200 + 40 * an) + ",140,1)" : "rgba(170,190,200,0.75)";
        g.fillRect(-k * 0.75, -0.24 * kz, k * 1.5, 0.14 * kz);
        g.strokeStyle = messD; g.lineWidth = Math.max(0.6, 0.012 * s);
        for (const ex of [-k * 0.75, 0, k * 0.75]) { g.beginPath(); g.moveTo(ex, -0.24 * kz); g.lineTo(ex, -0.1 * kz); g.stroke(); }
        g.fillStyle = mess; g.beginPath(); g.moveTo(-k * 0.9, -0.24 * kz); g.lineTo(k * 0.9, -0.24 * kz); g.lineTo(k * 0.3, -0.33 * kz); g.lineTo(-k * 0.3, -0.33 * kz); g.closePath(); g.fill();
        g.strokeStyle = messD; g.beginPath(); g.arc(0, -0.37 * kz, k * 0.35, Math.PI, 0); g.stroke();
        if (an > 0.05) F.leuchtPunkt(0, -0.17 * kz, 0.9 * s, "255,196,120", 0.9 * an, true);
      }
    });
    if (Z.licht) {
      M.licht(lampe[0], lampe[1], zL + 0.17, 3.2, "255,190,110", 0.55);
      M.licht(lampe[0], lampe[1], zL + 0.17, 0.5, "255,236,190", 0.9);
      M.bodenlicht(lampe[0] + 0.4, lampe[1] - 0.2, 1.7, "255,190,110", 0.35);
    }
  }

  /* Fichte: eigene schlichte Zeichnung, falls das Tannen-Modell fehlt;
     sonst die echte Fichte aus tanne.js, verkleinert */
  function fichte(M, x, y, z, hoehe, saat, jahr) {
    const T = ST.MODELLE && ST.MODELLE.tanne;
    let fremd = null;
    if (T) {
      try {
        const fang = { teil() { }, figur(fi) { fremd = fremd || fi; }, flaeche() { }, licht() { }, bodenlicht() { }, rauchAus() { }, lebendig() { } };
        let sd = saat;
        /* eine Fichte (nicht die Nordmanntanne) aus den Varianten suchen */
        for (let k = 0; k < 12; k++) { fremd = null; T.bauen(fang, { saat: sd, jahr: jahr, bau: 1 }); if (fremd && fremd.hoehe > 3) break; sd += 101; }
      } catch (e) { fremd = null; }
    }
    if (fremd) {
      const k = hoehe / Math.max(1, fremd.hoehe - 0.4);
      M.figur({ x: x, y: y, z: z, breite: fremd.breite * k, hoehe: hoehe + 0.3, schatten: true, malen(g, s, F) { fremd.malen(g, s * k, F); } });
      return;
    }
    M.figur({
      x: x, y: y, z: z, breite: hoehe * 0.5, hoehe: hoehe, schatten: true,
      malen(g, s, F) {
        const Lt = figurLicht(F), rng = zufall(saat);
        const H = hoehe * s * ST.KZ, B = hoehe * 0.34 * s;
        g.fillStyle = F.schatten ? "#000" : Lt.lit([70, 50, 36], Lt.R); g.fillRect(-0.06 * s, -H * 0.2, 0.12 * s, H * 0.2);
        for (let i = 0; i < 9; i++) {
          const t0 = 0.12 + i * 0.1, yb = -H * t0, yt = -H * Math.min(1, t0 + 0.2), bb = B * (1 - t0) * (0.9 + rng() * 0.2);
          g.fillStyle = F.schatten ? "#000" : Lt.lit(hell([40, 70, 44], i * 0.02), Lt.L);
          g.beginPath(); g.moveTo(-bb, yb); g.quadraticCurveTo(0, yb + H * 0.03, bb, yb); g.lineTo(0, yt); g.closePath(); g.fill();
          if (!F.schatten) { g.fillStyle = Lt.lit([22, 40, 26], Lt.R, 0.6); g.beginPath(); g.moveTo(0, yb + H * 0.015); g.lineTo(bb, yb); g.lineTo(0, yt); g.closePath(); g.fill(); }
          if (!F.schatten && jahr === "winter") { g.fillStyle = Lt.lit(SCHNEE, Lt.O, 0.9); g.beginPath(); g.moveTo(-bb * 0.8, yb - H * 0.01); g.quadraticCurveTo(0, yb - H * 0.04, bb * 0.7, yb - H * 0.01); g.lineTo(0, yt + H * 0.06); g.closePath(); g.fill(); }
        }
      }
    });
  }

  /* =====================================================================
     GRUBENBAHN, HUNTE, HALDE, GRUBENHOLZ
     ===================================================================== */
  /* Mittellinie des Gleises: Punkte mit Richtung – gerade aus dem
     Mundloch nach Osten bis an den Fuß der Halde */
  function gleisLinie() {
    const P = [];
    for (let x = PORTAL_X - 0.05; x < GLEIS_ENDE; x += 0.1) P.push([x, STOLLEN_Y, 1, 0]);
    return P;
  }
  const GLEIS = gleisLinie();
  function gleisBoden(M, V, Z, winter, jahr) {
    const x0 = -6, y0 = -6, w = 12, h = 12;
    M.teil("boden", { schatten: false, ebene: -10 });
    M.flaeche({ name: "zechenplatz", o: [x0, y0, 0.012], u: [1, 0, 0], v: [0, 1, 0], w: w, h: h, keinLicht: true, malen: (g, F) => {
      const L = ST.lichtFaktor([0, 0, 1], F.zeit, 0, F.jahr);
      const rng = zufall(401);
      g.save(); g.translate(-x0, -y0);                     // ab hier Weltkoordinaten
      /* Platz: festgefahrene Erde und Kohlengrus rund um Schacht, Gleis
         und Tor – weich auslaufend in Wiese oder Schnee */
      const flecken = [[TX + 0.3, TY + 0.2, 2.7, 2.3], [0.2, STOLLEN_Y, 2.6, 1.0], [HAUS.xm - 0.3, HAUS.y1 + 1.0, 1.5, 1.0], [0.0, TY + 0.3, 1.7, 1.7], [-0.6, 1.2, 1.2, 1.6]];
      const erde = winter ? [212, 214, 220] : jahr === "herbst" ? [112, 94, 70] : [104, 90, 72];
      for (const [cx, cy, rx, ry] of flecken) {
        const gr = g.createRadialGradient(cx, cy, 0, cx, cy, 1);
        gr.addColorStop(0, litF(erde, L, 0.92)); gr.addColorStop(0.65, litF(erde, L, 0.7)); gr.addColorStop(1, litF(erde, L, 0));
        g.save(); g.translate(cx, cy); g.scale(rx, ry); g.translate(-cx, -cy); g.fillStyle = gr; g.fillRect(cx - 1, cy - 1, 2, 2); g.restore();
      }
      if (F.px > 8) {
        /* Steinchen, Grus, im Winter Fußspuren und Karrenspuren */
        const Pk = [new Path2D(), new Path2D()];
        for (let i = 0; i < 420; i++) {
          const [cx, cy, rx, ry] = flecken[(rng() * flecken.length) | 0];
          const a = rng() * TAU, r = Math.sqrt(rng()) * 0.8, k = rng() < 0.5 ? 0 : 1;
          const x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r, rr = 0.02 + rng() * 0.03;
          Pk[k].moveTo(x + rr, y); Pk[k].arc(x, y, rr, 0, TAU);
        }
        g.fillStyle = litF(winter ? [150, 146, 140] : [58, 54, 50], L, winter ? 0.4 : 0.6); g.fill(Pk[0]);
        g.fillStyle = litF(winter ? [190, 188, 184] : [140, 128, 110], L, 0.6); g.fill(Pk[1]);
        if (winter) {
          g.strokeStyle = litF([150, 160, 184], L, 0.35); g.lineWidth = 0.09;
          g.beginPath(); g.moveTo(HAUS.xm - 0.2, HAUS.y1 + 0.2); g.quadraticCurveTo(1.0, TY + 2.4, TX + 1.2, TY + 1.4); g.stroke();
          g.beginPath(); g.moveTo(HAUS.xm + 0.2, HAUS.y1 + 0.2); g.quadraticCurveTo(1.6, STOLLEN_Y - 0.6, 0.0, STOLLEN_Y - 0.55); g.stroke();
        }
      }
      if (Z.gleis > 0) gleisMalen(g, F, L, Z, winter);
      g.restore();
    } });
  }
  function gleisMalen(g, F, L, Z, winter) {
    const n = GLEIS.length;
    const bis = Math.floor(n * Math.min(1, Z.gleis * 1.25));          // Schwellen zuerst
    const schienen = Z.gleis >= 0.8;
    /* Schotterbett */
    g.lineCap = "round"; g.lineJoin = "round";
    const linie = (q, von, bisN) => { g.beginPath(); for (let i = von; i < bisN; i++) { const p = GLEIS[i], x = p[0] - p[3] * q, y = p[1] + p[2] * q; if (i === von) g.moveTo(x, y); else g.lineTo(x, y); } };
    g.strokeStyle = litF(winter ? [226, 228, 234] : [118, 110, 100], L); g.lineWidth = 1.05; linie(0, 0, bis); g.stroke();
    if (F.px > 10 && !winter) {
      const rng = zufall(9);
      for (let i = 0; i < bis; i += 1) {
        const p = GLEIS[i];
        for (let k = 0; k < 6; k++) { const q = (rng() - 0.5) * 1.0; g.fillStyle = litF(streu([128, 120, 110], rng, 0.25), L); g.fillRect(p[0] - p[3] * q, p[1] + p[2] * q, 0.03, 0.03); }
      }
    }
    /* Schwellen */
    let s = 0;
    for (let i = 0; i < bis; i++) {
      const p = GLEIS[i];
      if (i > 0) s += Math.hypot(p[0] - GLEIS[i - 1][0], p[1] - GLEIS[i - 1][1]);
      if (s < 0.45 && i > 0) continue;
      s = 0;
      g.save(); g.translate(p[0], p[1]); g.rotate(Math.atan2(p[3], p[2]));
      g.fillStyle = litF([30, 26, 22], L, 0.4); g.fillRect(-0.06 + 0.03, -0.44 + 0.03, 0.13, 0.88);
      g.fillStyle = litF(winter ? [120, 104, 86] : [104, 80, 56], L); g.fillRect(-0.065, -0.44, 0.13, 0.88);
      if (winter) { g.fillStyle = litF(SCHNEE, L, 0.7); g.fillRect(-0.065, -0.44, 0.13, 0.88); }
      g.restore();
    }
    if (!schienen) return;
    /* Schienen: Schatten, Fuß, Kopf mit Glanz */
    for (const q of [-0.3, 0.3]) {
      g.strokeStyle = litF([20, 18, 20], L, 0.5); g.lineWidth = 0.07; g.save(); g.translate(0.03, 0.04); linie(q, 0, n); g.stroke(); g.restore();
      g.strokeStyle = litF([70, 62, 56], L); g.lineWidth = 0.065; linie(q, 0, n); g.stroke();
      g.strokeStyle = litF([176, 176, 180], L); g.lineWidth = 0.025; linie(q, 0, n); g.stroke();
    }
    /* Prellbock am Ende */
    const e = GLEIS[n - 1];
    g.fillStyle = litF([96, 70, 44], L); g.fillRect(e[0] - 0.12, e[1] - 0.5, 0.18, 1.0);
  }
  /* Prellbock als Körper (zwei Schwellen hochkant, verstrebt) */
  function prellbock(M, winter, Z) {
    const e = GLEIS[GLEIS.length - 1], x = e[0] - 0.05, y = e[1];
    M.teil("prellbock", { schatten: true });
    const holz = (g, F) => { holzMalen(g, F, 0, 0, F.w, F.h, [96, 70, 44], 7); };
    M.quader({ x: x - 0.2, y: y - 0.5, z: 0, b: 0.18, t: 1.0, h: 0.55 }, { sued: holz, nord: holz, ost: holz, west: holz, oben: (g, F) => { holz(g, F); if (winter && Z.schnee) schneeDecke(g, F, 0, 0, F.w, F.h, 3, 0.95); } });
  }

  /* Hunt (Förderwagen) auf dem Gleis */
  function hunt(M, V, name, x, y, dx, dy, voll, winter, Z) {
    const e1 = [dx, dy, 0], e2 = [-dy, dx, 0];
    const P = (l, q, z) => [x + e1[0] * l + e2[0] * q, y + e1[1] * l + e2[1] * q, z];
    M.teil(name, { schatten: true });
    const innen = P(0, 0, 0.6);
    const c = V.stahl === STAHL[0] ? [74, 70, 66] : [92, 60, 44];
    const blech = (g, F) => {
      const w = F.w, h = F.h;
      g.fillStyle = rgb(c); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      rausch(g, 0, 0, w, h, 0.5, 0.45, name.length * 7, 3);
      g.fillStyle = "rgba(140,70,30,0.35)"; for (let k = 0; k < 6; k++) g.fillRect(0.08 + k * w / 6, 0.08, 0.05, h - 0.1);
      g.fillStyle = rgb(hell(c, 0.15)); g.fillRect(0, 0, w, 0.06);
      g.fillStyle = rgb(hell(c, -0.3)); g.fillRect(0, 0.06, w, 0.02);
      if (F.px > 40) { g.fillStyle = rgb(hell(c, -0.4)); g.beginPath(); for (let xx = 0.06; xx < w; xx += 0.1) { g.moveTo(xx + 0.012, 0.03); g.arc(xx, 0.03, 0.012, 0, TAU); g.moveTo(xx + 0.012, h - 0.04); g.arc(xx, h - 0.04, 0.012, 0, TAU); } g.fill(); }
      if (winter && Z.schnee) { g.fillStyle = rgb(SCHNEE); g.fillRect(0, -0.01, w, 0.04); }
    };
    const lu = 0.46, qu = 0.29, lo = 0.56, qo = 0.37, zu = 0.3, zo = 0.88;
    const U = [P(-lu, -qu, zu), P(lu, -qu, zu), P(lu, qu, zu), P(-lu, qu, zu)], O = [P(-lo, -qo, zo), P(lo, -qo, zo), P(lo, qo, zo), P(-lo, qo, zo)];
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; polyF(M, name + "s" + i, [O[i], O[j], U[j], U[i]], blech, { innen: innen, keinAo: true }); }
    /* Ladung */
    polyF(M, name + "oben", [O[0], O[1], O[2], O[3]], (g, F) => {
      const w = F.w, h = F.h, rng = zufall(name.length * 13);
      g.fillStyle = "rgb(30,26,22)"; g.fillRect(0, 0, w, h);
      if (voll) {
        const L = ["rgb(96,92,88)", "rgb(120,112,100)", "rgb(80,76,74)", "rgb(150,146,140)", "rgb(128,96,60)", "rgb(170,160,120)"];
        for (let i = 0; i < 70; i++) {
          const cx = 0.05 + rng() * (w - 0.1), cy = 0.05 + rng() * (h - 0.1), r = 0.03 + rng() * 0.06;
          g.fillStyle = L[(rng() * L.length) | 0]; g.beginPath(); g.ellipse(cx, cy, r * 1.2, r, rng() * 3, 0, TAU); g.fill();
          if (rng() < 0.3) { g.fillStyle = "rgba(230,230,240,0.8)"; g.fillRect(cx - r * 0.3, cy - r * 0.4, r * 0.4, r * 0.25); }     // Bleiglanz glänzt
        }
      }
      if (winter && Z.schnee) schneeDecke(g, F, 0.02, 0.02, w - 0.04, h - 0.04, 7, voll ? 0.5 : 0.6);
    }, { innen: P(0, 0, 0), keinAo: true });
    /* Fahrgestell mit Rädern (durchsichtig) */
    for (const q of [-0.26, 0.26]) {
      const p0 = P(-0.5, q, 0.34), p1 = P(0.5, q, 0.34);
      const nach = q > 0 ? 1 : -1;
      const f = { name: name + "rad" + q, o: nach > 0 ? p1 : p0, u: nach > 0 ? mul(e1, -1) : e1, v: [0, 0, -1], w: 1.0, h: 0.34, keinLicht: true, keinAo: true };
      /* Außenseite: u × v muss nach außen (±e2) zeigen */
      f.u = nach > 0 ? e1 : mul(e1, -1); f.o = nach > 0 ? P(-0.5, q, 0.34) : P(0.5, q, 0.34);
      f.malen = (g, F) => {
        const L = lichtN(F);
        g.fillStyle = litF([36, 34, 32], L); g.fillRect(0, 0.0, F.w, 0.08);
        for (const a of [0.24, 0.76]) {
          g.fillStyle = litF([30, 28, 28], L); g.beginPath(); g.arc(a, 0.19, 0.15, 0, TAU); g.fill();
          g.fillStyle = litF([90, 86, 82], L); g.beginPath(); g.arc(a, 0.19, 0.11, 0, TAU); g.fill();
          g.fillStyle = litF([40, 38, 36], L); g.beginPath(); g.arc(a, 0.19, 0.04, 0, TAU); g.fill();
          if (winter && Z.schnee) { g.strokeStyle = litF(SCHNEE, L); g.lineWidth = 0.025; g.beginPath(); g.arc(a, 0.19, 0.14, Math.PI * 1.2, Math.PI * 1.8); g.stroke(); }
        }
        /* Puffer */
        g.fillStyle = litF([50, 48, 46], L); g.fillRect(-0.02, 0.02, 0.08, 0.08); g.fillRect(F.w - 0.06, 0.02, 0.08, 0.08);
      };
      M.flaeche(f);
    }
  }

  /* Halde: Kegel aus Ringen, Stein und Grus, Rostfarben vom verwitterten
     Kies; im Winter Schnee auf den flacheren Teilen */
  function halde(M, V, Z, winter) {
    const k = Z.halde;
    if (k <= 0) return;
    M.teil("halde", { schatten: true });
    const H = HALDE, r = H.r * Math.sqrt(k), h = H.h * Math.pow(k, 0.8);
    const n = 18, rng = zufall(31);
    /* Schüttkegel: vier Ringe (Fuß, Böschung, Schulter, Plateau) – der
       Böschungswinkel des Haufwerks (~35°) oben, unten flach auslaufend */
    const RINGE = [[1, 0], [0.78, 0.36], [0.52, 0.78], [0.26, 1]];
    const jit = [], ecc = [];
    for (let i = 0; i < n; i++) { jit.push(1 + (rng() - 0.5) * 0.16); ecc.push(1 - 0.16 * Math.cos(i / n * TAU)); }
    const R = RINGE.map(([f, z], ri) => {
      const P = [];
      for (let i = 0; i < n; i++) {
        const a = i / n * TAU, j = ri === 3 ? 1 : jit[i], e = ri === 3 ? 1 : ecc[i];
        const cx = H.x - 0.25 * (ri / 3), zz = h * z * (ri === 3 ? 1 : 1 + (rng() - 0.5) * 0.06 * ri);
        P.push([cx + Math.cos(a) * r * f * j * e, H.y + Math.sin(a) * r * f * j * 0.92, zz]);
      }
      return P;
    });
    const innen = [H.x, H.y, -0.5];
    const mal = (saat) => haldeMaler(saat, winter && Z.schnee, winter);
    const D = [];
    for (let ri = 0; ri < 3; ri++) {
      const A = R[ri], B = R[ri + 1];
      for (let i = 0; i < n; i++) { const j = (i + 1) % n; D.push([A[i], A[j], B[j]], [A[i], B[j], B[i]]); }
    }
    const vn = eckNormalen(D.concat([[R[3][0], R[3][6], R[3][12]]]), innen);
    D.forEach((T, k) => polyF(M, "halde" + k, T, mal(k * 3 + 1), { innen: innen, vnFn: vn }));
    polyF(M, "halde-oben", R[3], mal(199), { innen: innen, vnFn: () => Z3 });
  }
  /* Brocken und Schneeflecken liegen in WELTkoordinaten fest und werden
     in jede Dreiecksfläche projiziert – so laufen sie über die Kanten der
     Facetten hinweg, und der Haufen wirkt wie ein Stück. */
  const HALDE_TEILE = (function () {
    const r = zufall(8080), H = HALDE, stein = [], schnee = [];
    for (let i = 0; i < 900; i++) {
      const a = r() * TAU, d = Math.sqrt(r()) * H.r * 1.2;
      stein.push({ x: H.x + Math.cos(a) * d * 1.15, y: H.y + Math.sin(a) * d * 0.95, r: 0.03 + Math.pow(r(), 2.2) * 0.13, k: (r() * 6) | 0, w: r() * 3, kap: 0.1 + r() * 0.4 });
    }
    for (let i = 0; i < 260; i++) {
      const a = r() * TAU, d = Math.sqrt(r()) * H.r * 1.2;
      schnee.push({ x: H.x + Math.cos(a) * d * 1.15, y: H.y + Math.sin(a) * d * 0.95, r: 0.12 + r() * 0.3, e: 0.4 + r() * 0.4, w: r() * 3, d: d / (H.r * 1.2) });
    }
    return { stein: stein, schnee: schnee };
  })();
  function haldeMaler(saat, schnee, winter) {
    return function (g, F) {
      const w = F.w, h = F.h, px = F.px, f = F.flaeche, N = f.N || Z3, rng = zufall(saat + 700);
      /* Weltpunkt (x, y) auf der Ebene dieser Fläche → Flächenkoordinaten */
      const inF = (x, y) => {
        const z = f.o[2] - (N[0] * (x - f.o[0]) + N[1] * (y - f.o[1])) / (Math.abs(N[2]) > 0.05 ? N[2] : 0.05);
        const d = [x - f.o[0], y - f.o[1], z - f.o[2]];
        return [dot(d, f.u), dot(d, f.v)];
      };
      const drin = (p, r) => p[0] > -r && p[0] < w + r && p[1] > -r && p[1] < h + r;
      g.fillStyle = "rgb(118,108,96)"; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
      rausch(g, -0.1, -0.1, w + 0.2, h + 0.2, 1.4, 0.3, 11, 4);
      /* Eisenocker: rostige Schlieren die Böschung hinab */
      g.fillStyle = "rgba(160,96,44,0.18)";
      for (let i = 0; i < w; i++) { const x = rng() * w; g.beginPath(); g.ellipse(x, h * 0.5, 0.1 + rng() * 0.18, h * 0.7, 0, 0, TAU); g.fill(); }
      const T = [[92, 88, 84], [140, 132, 120], [110, 100, 90], [70, 66, 64], [150, 120, 84], [128, 124, 118]];
      /* Schnee zuerst als Grund: flache Stücke dichter */
      if (schnee) {
        const flach = N[2];
        g.fillStyle = rgb(SCHNEE, klemm((flach - 0.3) / 0.5, 0.25, 0.8)); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
        g.fillStyle = rgb(SCHNEE);
        g.beginPath();
        for (const S of HALDE_TEILE.schnee) {
          if (S.d > 0.85 && flach < 0.6) continue;
          const p = inF(S.x, S.y);
          if (!drin(p, S.r * 1.5)) continue;
          g.moveTo(p[0] + S.r * 1.3, p[1]); g.ellipse(p[0], p[1], S.r * 1.3, S.r * S.e, S.w * 0.2, 0, TAU);
        }
        g.fill();
      }
      if (px > 8) {
        const P = T.map(() => new Path2D()), Sh = new Path2D(), K = new Path2D();
        const liste = [];
        for (const S of HALDE_TEILE.stein) {
          if (px < 20 && S.r < 0.05) continue;
          const p = inF(S.x, S.y);
          if (!drin(p, S.r)) continue;
          if (schnee && S.r < 0.06 && S.kap > 0.3) continue;              // kleine liegen unter dem Schnee
          liste.push([p, S]);
          const r = S.r;
          Sh.moveTo(p[0] + r * 1.3, p[1] + r * 0.4); Sh.ellipse(p[0] + r * 0.25, p[1] + r * 0.4, r * 1.05, r * 0.45, 0, 0, TAU);
          const pk = P[S.k];
          pk.moveTo(p[0] + r, p[1]);
          for (let j = 1; j < 6; j++) { const a = j / 6 * TAU + S.w; pk.lineTo(p[0] + Math.cos(a) * r * (0.8 + 0.25 * Math.sin(j * 3 + S.w)), p[1] + Math.sin(a) * r * 0.72); }
          pk.closePath();
          if (r > 0.06) { K.moveTo(p[0] + r * 0.6, p[1] - r * 0.3); K.ellipse(p[0], p[1] - r * 0.3, r * 0.6, r * 0.28, 0, 0, TAU); }
        }
        g.fillStyle = "rgba(30,26,22,0.35)"; g.fill(Sh);
        T.forEach((c, k) => { g.fillStyle = rgb(c); g.fill(P[k]); });
        g.fillStyle = schnee ? rgb(SCHNEE) : "rgba(255,248,236,0.12)"; g.fill(K);
      }
      if (schnee) rausch(g, 0, 0, w, h, 1.8, 0.06, saat, 3);
      else if (winter) { g.fillStyle = "rgba(240,244,250,0.4)"; g.fillRect(0, 0, w, h); }
    };
  }

  /* Grubenholz: Stapel runder Stempel (Fichte, entrindet) */
  function grubenholz(M, V, Z, winter) {
    const x0 = -1.35, x1 = 0.75, yc = 5.2, B = 1.5, T = 0.7, H = 0.95;
    M.teil("holzstapel", { schatten: true });
    const S = [[x0, yc + B / 2, 0], [x0, yc + T / 2, H], [x0, yc - T / 2, H], [x0, yc - B / 2, 0]];
    const E = S.map((p) => [x1, p[1], p[2]]);
    const innen = [(x0 + x1) / 2, yc, 0.3];
    const stirn = (g, F) => {
      /* Hirnholz: Kreise in Reihen */
      const w = F.w, h = F.h, rng = zufall(Math.round(F.w * 100));
      g.fillStyle = "rgb(58,44,32)"; g.fillRect(0, 0, w, h);
      const r = 0.085;
      for (let row = 0, yy = h - r; yy > 0; yy -= r * 1.75, row++) {
        const breite = w - 2 * (h - yy) * ((B - T) / 2) / H;
        const xa = (w - breite) / 2;
        for (let xx = xa + r + (row % 2) * r; xx < xa + breite - r * 0.8; xx += r * 2.02) {
          const rr = r * (0.8 + rng() * 0.25);
          g.fillStyle = "rgb(150,120,84)"; g.beginPath(); g.arc(xx, yy, rr, 0, TAU); g.fill();
          g.fillStyle = "rgb(208,178,128)"; g.beginPath(); g.arc(xx, yy, rr * 0.8, 0, TAU); g.fill();
          if (F.px > 30) { g.strokeStyle = "rgba(150,110,70,0.5)"; g.lineWidth = 0.006; for (let k = 1; k < 4; k++) { g.beginPath(); g.arc(xx + 0.005, yy, rr * 0.2 * k, 0, TAU); g.stroke(); } }
          if (winter && Z.schnee) { g.fillStyle = rgb(SCHNEE, 0.9); g.beginPath(); g.arc(xx, yy - rr * 0.6, rr * 0.55, Math.PI, 0); g.fill(); }
        }
      }
    };
    const mantel = (g, F) => {
      const w = F.w, h = F.h;
      g.fillStyle = "rgb(60,46,34)"; g.fillRect(0, 0, w, h);
      for (let yy = 0; yy < h; yy += 0.15) {
        const gr = g.createLinearGradient(0, yy, 0, yy + 0.15);
        gr.addColorStop(0, "rgb(206,174,124)"); gr.addColorStop(0.5, "rgb(176,140,96)"); gr.addColorStop(1, "rgb(110,84,58)");
        g.fillStyle = gr; g.fillRect(0, yy + 0.005, w, 0.14);
      }
      rausch(g, 0, 0, w, h, 0.8, 0.25, 17, 3);
      if (winter && Z.schnee && F.flaeche.N[2] > 0.3) schneeDecke(g, F, 0, 0, w, h, 5, 0.92);
    };
    polyF(M, "holz-w", S, stirn, { innen: innen, ao: true });
    polyF(M, "holz-o", E.slice().reverse(), stirn, { innen: innen, ao: true });
    polyF(M, "holz-s", [S[0], S[1], E[1], E[0]], mantel, { innen: innen, ao: true });
    polyF(M, "holz-n", [S[2], S[3], E[3], E[2]], mantel, { innen: innen, ao: true });
    polyF(M, "holz-t", [S[1], S[2], E[2], E[1]], mantel, { innen: innen });
  }

  /* =====================================================================
     BAUSTELLE: Gruben und Aushub
     ===================================================================== */
  const GRUBEN = [
    { x0: HAUS.x0 - 0.3, y0: HAUS.y0 - 0.3, x1: HAUS.x1 + 0.1, y1: HAUS.y1 + 0.3, d: 1.2 },
    { x0: TX - 1.9, y0: TY - 1.7, x1: TX + 1.9, y1: TY + 1.7, d: 1.0 },
    { x0: STREBE_FUSS[0] - 0.55, y0: TY - STREBE_YU - 0.55, x1: STREBE_FUSS[0] + 0.55, y1: TY + STREBE_YU + 0.55, d: 0.9 }
  ];
  function gruben(M, V, Z, winter) {
    const G = Z.grube;
    if (G && (G.tiefe > 0.01)) {
      M.teil("grube", { schatten: false, ebene: -9 });
      GRUBEN.forEach((R, i) => {
        const w = R.x1 - R.x0, h = R.y1 - R.y0;
        M.flaeche({ name: "grube" + i, o: [R.x0, R.y0, 0.006], u: [1, 0, 0], v: [0, 1, 0], w: w, h: h, keinLicht: true, malen: (g, F) => {
          const D = R.d * G.tiefe * (1 - G.verfuellt * 0.8);
          const dd = tiefe(g, F, -D);
          const e = D * 0.4;
          const P = (x, y, t) => [x + dd[0] * t, y + dd[1] * t];
          const Lb = ST.lichtFaktor([0, 0, 1], F.zeit, 0, F.jahr);
          /* Wände (Böschung) */
          const wand = (a, b, c2, d2, n) => { g.fillStyle = litF([112, 88, 60], ST.lichtFaktor(n, F.zeit, 0, F.jahr)); vieleck(g, [a, b, c2, d2]); g.fill(); };
          g.fillStyle = litF([90, 70, 48], Lb); g.fillRect(0, 0, w, h);
          wand([0, 0], [w, 0], P(w - e, e, 1), P(e, e, 1), [0, 0.7, 0.7]);
          wand([0, 0], [0, h], P(e, h - e, 1), P(e, e, 1), [0.7, 0, 0.7]);
          wand([w, 0], [w, h], P(w - e, h - e, 1), P(w - e, e, 1), [-0.7, 0, 0.7]);
          wand([0, h], [w, h], P(w - e, h - e, 1), P(e, h - e, 1), [0, -0.7, 0.7]);
          /* Sohle */
          const sohle = [P(e, e, 1), P(w - e, e, 1), P(w - e, h - e, 1), P(e, h - e, 1)];
          g.fillStyle = litF(G.beton > 0 ? [140, 132, 118] : [124, 96, 64], Lb); vieleck(g, sohle); g.fill();
          g.save(); vieleck(g, sohle); g.clip(); rausch(g, -1, -1, w + 2, h + 2, 1.2, 0.4, 3 + i, 3);
          /* Beton der Fundamente in der Sohle */
          if (G.beton > 0) {
            g.fillStyle = litF(BETON, Lb, Math.min(1, G.beton * 1.5));
            if (i === 0) { const b = 0.55; for (const [x, y, ww, hh] of [[0.3, 0.3, w - 0.6, b], [0.3, h - 0.3 - b, w - 0.6, b], [0.3, 0.3, b, h - 0.6], [w - 0.3 - b, 0.3, b, h - 0.6]]) { const a = P(x, y, 1); g.fillRect(a[0], a[1], ww, hh); } }
            else if (i === 1) { for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const p = stielPunkt(sx, sy, 0), a = P(p[0] - R.x0 - 0.4, p[1] - R.y0 - 0.4, 1); g.fillRect(a[0], a[1], 0.8, 0.8); } const a = P(0.9, 0.7, 1); g.fillStyle = "rgb(12,10,10)"; g.fillRect(a[0], a[1], 2.0, 2.0); }
            else { for (const sy of [-1, 1]) { const p = strebePunkt(sy, 1), a = P(p[0] - R.x0 - 0.4, p[1] - R.y0 - 0.4, 1); g.fillRect(a[0], a[1], 0.8, 0.8); } }
          } else if (i === 1) {
            /* der Schacht selbst: schwarzes Loch mit Bohlenrand */
            const a = P(0.9, 0.7, 1);
            g.fillStyle = "rgb(12,10,10)"; g.fillRect(a[0], a[1], 2.0, 2.0);
            g.strokeStyle = litF(HOLZ, Lb); g.lineWidth = 0.1; g.strokeRect(a[0] - 0.05, a[1] - 0.05, 2.1, 2.1);
          }
          if (winter) { g.fillStyle = "rgba(240,244,250,0.35)"; g.fillRect(-1, -1, w + 2, h + 2); }
          g.restore();
        } });
      });
    }
    /* Aushub (Figuren, damit der Bagger sie findet) */
    if (Z.haufen > 0.02) {
      const hs = [[1.2, 4.9, 2.8, 1.5, 19], [4.4, 5.0, 2.4, 1.3, 23]];
      hs.forEach(([x, y, B, Hh, sd], i) => {
        M.teil("aushub" + i, { schatten: true, mitte: [x, y, 0.5] });
        M.figur({ x: x, y: y, z: 0, breite: B + 0.6, hoehe: Hh + 0.3, schatten: true, malen: haufenMaler(Z.haufen, winter, B, Hh, sd) });
      });
    }
  }
  function haufenMaler(k, winter, Bm, Hm, saat) {
    return function (g, s, F) {
      const r = zufall(saat);
      const B = Bm * Math.sqrt(k) * s, H = Hm * Math.pow(k, 0.7) * s * ST.KZ;
      const pts = [];
      for (let i = 1; i < 11; i++) { const t = i / 11; pts.push([-B / 2 + B * t, -H * Math.pow(Math.sin(t * Math.PI), 0.8) * (0.88 + r() * 0.2)]); }
      const form = () => { g.beginPath(); g.moveTo(-B / 2, 0); for (const [x, y] of pts) g.lineTo(x, y); g.lineTo(B / 2, 0); g.quadraticCurveTo(0, B * 0.14, -B / 2, 0); g.closePath(); };
      if (F.schatten) { g.fillStyle = "#000"; form(); g.fill(); return; }
      const Lt = figurLicht(F);
      const gr = g.createLinearGradient(-B / 2, -H, B / 2, 0);
      gr.addColorStop(0, Lt.lit([150, 118, 80], Lt.L)); gr.addColorStop(0.55, Lt.lit([112, 86, 58], Lt.O)); gr.addColorStop(1, Lt.lit([70, 54, 38], Lt.R));
      form(); g.fillStyle = gr; g.fill();
      const Pd = new Path2D(), Ph = new Path2D();
      for (let i = 0; i < 120 * k; i++) {
        const x = (r() - 0.5) * B, rr = (0.05 + r() * 0.12) * s;
        const hier = H * Math.pow(Math.max(0, Math.sin((x / B + 0.5) * Math.PI)), 0.8) * 0.9, y = -r() * Math.max(0, hier - rr * 0.6);
        Pd.moveTo(x + rr * 1.15, y + rr * 0.2); Pd.ellipse(x + rr * 0.15, y + rr * 0.2, rr, rr * 0.7, 0, 0, TAU);
        Ph.moveTo(x + rr * 0.85, y); Ph.ellipse(x, y, rr * 0.85, rr * 0.6, 0, 0, TAU);
      }
      g.fillStyle = Lt.lit([70, 60, 50], Lt.R); g.fill(Pd);
      g.fillStyle = Lt.lit([140, 132, 120], Lt.L); g.fill(Ph);
      if (winter) {
        g.fillStyle = Lt.lit(SCHNEE, Lt.O, 0.95);
        g.beginPath(); g.moveTo(pts[1][0], pts[1][1] + H * 0.25);
        for (let i = 1; i < pts.length - 1; i++) g.lineTo(pts[i][0], pts[i][1] - s * 0.04);
        for (let i = pts.length - 2; i >= 1; i--) g.lineTo(pts[i][0], pts[i][1] + H * (0.18 + r() * 0.25));
        g.closePath(); g.fill();
      }
    };
  }

  /* =====================================================================
     NACHT: Lampen an der Hängebank und über dem Tor
     ===================================================================== */
  function lampen(M, Z) {
    if (!Z.licht) return;
    /* Hängebank-Lampe am Südost-Stiel */
    const p = stielPunkt(1, 1, 3.2);
    M.licht(p[0] + 0.2, p[1] + 0.2, 3.1, 4.0, "255,200,130", 0.5);
    M.licht(p[0] + 0.2, p[1] + 0.2, 3.1, 0.5, "255,236,196", 0.9);
    M.bodenlicht(p[0] + 0.3, p[1] + 0.6, 2.2, "255,196,120", 0.3);
    /* über dem Tor */
    M.licht(HAUS.xm, HAUS.y1 + 0.3, 3.55, 2.8, "255,196,120", 0.5);
    M.bodenlicht(HAUS.xm, HAUS.y1 + 1.2, 1.8, "255,196,120", 0.3);
    /* Laterne auf der Bühne (Warnlicht) */
    M.licht(BUEHNE.x1 - 0.1, BUEHNE.y1 - 0.1, Z_DECK + 1.1, 1.6, "255,120,80", 0.6);
  }
  function torlampe(M, Z) {
    M.teil("torlampe", { schatten: true, mitte: [HAUS.xm, HAUS.y1 + 0.3, HAUS_MITTE[2]] });
    M.figur({
      x: HAUS.xm, y: HAUS.y1 + 0.28, z: 3.35, breite: 0.4, hoehe: 0.5, schatten: true,
      malen(g, s, F) {
        const Lt = figurLicht(F), kz = ST.KZ * s, k = 0.08 * s;
        const eisen = F.schatten ? "#000" : Lt.lit([36, 36, 36], Lt.O);
        g.fillStyle = eisen; g.fillRect(-0.015 * s, -0.42 * kz, 0.03 * s, 0.1 * kz);
        g.beginPath(); g.moveTo(-k * 1.4, -0.32 * kz); g.lineTo(k * 1.4, -0.32 * kz); g.lineTo(0, -0.42 * kz); g.closePath(); g.fill();
        const an = F.schatten ? 0 : F.nacht;
        g.fillStyle = F.schatten ? "#000" : an > 0.05 ? "rgb(255,222,160)" : Lt.lit([130, 140, 150], Lt.L);
        g.beginPath(); g.moveTo(-k, -0.32 * kz); g.lineTo(k, -0.32 * kz); g.lineTo(k * 0.7, -0.08 * kz); g.lineTo(-k * 0.7, -0.08 * kz); g.closePath(); g.fill();
        g.fillStyle = eisen; g.fillRect(-k * 0.8, -0.1 * kz, k * 1.6, 0.04 * kz);
        if (an > 0.05) F.leuchtPunkt(0, -0.2 * kz, 1.0 * s, "255,200,130", 0.8 * an, false);
      }
    });
  }

  /* =====================================================================
     ANMELDEN
     ===================================================================== */
  ST.modell("bergwerk", {
    name: "Bergwerk", gruppe: "Häuser", grund: [12, 12], hoehe: 16, bauzeit: 20 * 60,
    baustelle: { wand: { x0: HAUS.x0, x1: HAUS.x1, y0: HAUS.y0, y1: HAUS.y1 }, traufe: HAUS.ze, first: HAUS.zf },
    bauen(M, o) {
      const V = variante(o);
      const bau = o.bau == null ? 1 : klemm(+o.bau || 0, 0, 1);
      const Z = zustand(bau);
      const jahr = o.jahr || "winter", winter = jahr === "winter";
      /* Bildgrenzen: Schatten des Turms und Rauch brauchen Platz */
      M.teil("huelle", { schatten: false, mitte: [0, 0, -50] });
      M.flaeche(Object.assign({ name: "huelle", o: [-6.2, -6.2, 0], u: [1, 0, 0], v: [0, 1, 0], w: 12.4, h: 12.4 }, LEER));
      gleisBoden(M, V, Z, winter, jahr);
      gruben(M, V, Z, winter);
      felshang(M, V, Z, winter, jahr);
      if (Z.tuerstock > 0) tuerstock(M, V, Z, winter);
      if (Z.fundament) fundamente(M, V, Z, winter);
      if (Z.sockel > 0 || Z.wand > 0) maschinenhaus(M, V, Z, winter);
      if (Z.kamin > 0) esse(M, V, Z, winter);
      if (Z.turm > 0) foerderturm(M, V, Z, winter);
      if (Z.gleis >= 0.8) prellbock(M, winter, Z);
      if (Z.loren) {
        hunt(M, V, "hunt1", PORTAL_X + 1.35, STOLLEN_Y, 1, 0, true, winter, Z);
        hunt(M, V, "hunt2", GLEIS_ENDE - 0.95, STOLLEN_Y, 1, 0, V.erzA, winter, Z);
      }
      halde(M, V, Z, winter);
      if (Z.holz) grubenholz(M, V, Z, winter);
      if (Z.tor) torlampe(M, Z);
      lampen(M, Z);
      if (Z.fertig) M.rauchAus(KAMIN.x, KAMIN.y, KAMIN.h + 0.2, winter ? 1.1 : 0.8);
    }
  });
})();
