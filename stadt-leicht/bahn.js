/* =====================================================================
   LEICHTE STADT — DIE EISENBAHN (Gleis, Fahrplan, Zug, Rauch, Lichter)
   ---------------------------------------------------------------------
   XANDER: „die Lok soll aber mehr hinten lang fahren hinten in der
   Stadt" – „dass ich die Eisenbahn wieder hinten lang fahren [sehe] und
   die Eisenbahn brauchen wir auch unbedingt".

   Wie im alten gemalten Dorf (spiel.js, BAHN_…): ein Güterzug nach der
   Uhr, für alle gleich. Er kommt vom einen Kartenrand (aus dem Nachbar-
   dorf), bremst, hält 14 s am Bahnhof, pfeift, fährt wieder an und rollt
   zum anderen Rand hinaus; beim nächsten Mal kommt er von der anderen
   Seite. Der Zug: Dampflok BR 50 mit Tender, gedeckter Güterwagen,
   Rungenwagen mit Stämmen, Kesselwagen mit Schlusslampen
   (stadt/modelle/dampflok.js, gueterwagen.js; gebacken als Laufblätter
   l_bahn_… mit 8 Richtungen, im kleinen Rahmen die Zwergblätter _z).

   STRECKE: ST.dorf.BAHN (Weltpunkte [[x,y],…], dorf.js). Fehlt sie, gilt
   die Ersatzstrecke hinten (Norden) hinter Kirche und Schloss durch den
   Waldsaum. Halt: ST.dorf.BAHN_HALT (Weltpunkt am Bahnsteig), sonst die
   Gleismitte des Bahnhofs (k_bahnhof), wenn er an der Strecke steht,
   sonst ein eigener Haltepunkt mit gemaltem Bahnsteig.
   Bäume, die auf dem Gleis stünden, werden beim Aufbauen weggenommen.

   ZEICHNEN (szene.js ruft): boden() – Schotterbett, Schwellen, Schienen
   und nachts der Lichtkegel flach unter allem; schatten() – Zugschatten
   in die Schattenebene; sichtbar() – je Fahrzeug ein Eintrag wie bei den
   Leuten (Tiefensortierung zwischen die Häuser); der Rauch kommt über
   allem (SZ.zuhoerer). Die Schienenoberkante liegt wie im Bahnhofsmodell
   0,5 m über dem Boden.

   FASSUNG 818 — XANDER (wörtlich): „unser Lok sieht nicht mehr so schön
   wie vorher aus die war viel detaillierter diese schöne alte Lok die
   wir … in der Vektorgrafik bei den Reisen hier im Chat … haben … diese
   schönen klassischen Wagen daran und irgendwie scheint sie nur die eine
   Richtung zu fahren … sie muss ja wegfahren und … ankommen und so wie
   sie früher in die Richtung gefahren ist so muss das auch wieder möglich
   sein" – und „unsere Lokomotive hat noch keinen Klang".
   Der Zug ist jetzt die klassische Reiselok aus dem Chat mit Tender und
   drei weinroten Abteilwagen (stadt/modelle/reiselok.js, Blätter
   l_bahn_reiselok mit sechs Radstellungen, l_bahn_reisetender,
   l_bahn_personenwagen). Die Räder drehen sich mit dem gefahrenen Weg
   (Stangen und Gegengewichte laufen mit). Der Fahrplan wechselt die
   Richtung bei jedem Umlauf: einmal kommt der Zug von links, hält am
   Bahnhof und fährt nach rechts hinaus, beim nächsten Mal von rechts nach
   links (wie früher im alten Dorf) – die Lok fährt immer vorn. Ton
   (stadt-leicht/ton.js): Schnaufen im Takt der Räder (vier Stöße je
   Radumdrehung, beim Anfahren schwer), Pfiff bei der Einfahrt und kurz–
   lang vor der Abfahrt, Bremsquietschen am Halt, Dampf ablassen im Stand,
   Schienenstöße – leise, nach Nähe und Zoom, nur wenn die Seite Töne darf.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, K = ST.kamera, SZ = ST.szene, LB = ST.bilder;
  const BA = (ST.bahn = { zug: [], puffs: [], versatz: 0, t: 0 });
  const TAU = Math.PI * 2;
  const klemm = (v, a, b) => (v < a ? a : v > b ? b : v);
  const q = (function () { try { return new URLSearchParams(location.search); } catch (e) { return new URLSearchParams(""); } })();

  /* ---------------- Der Zug ---------------- */
  /* Teil, Blatt, vorn/hinten ab der Modellmitte (m, über Puffer), Höhe, Lücke dahinter */
  /* FASSUNG 818 — die Reiselok (Treibrad Ø 1,9 m), Tender und drei Abteilwagen (stadt/modelle/reiselok.js) */
  const WAGEN = [
    { art: "lok", bild: "l_bahn_reiselok", vorn: 5.87, hinten: 5.5, h: 4.9, luecke: 0.15, radR: 0.95 },
    { art: "tender", bild: "l_bahn_reisetender", vorn: 3.3, hinten: 3.69, h: 3.9, luecke: 0 },
    { art: "wagen1", bild: "l_bahn_personenwagen", vorn: 6.32, hinten: 6.32, h: 4.2, luecke: 0 },
    { art: "wagen2", bild: "l_bahn_personenwagen", vorn: 6.32, hinten: 6.32, h: 4.2, luecke: 0 },
    { art: "wagen3", bild: "l_bahn_personenwagen", vorn: 6.32, hinten: 6.32, h: 4.2, luecke: 0, schluss: true }
  ];
  const ZUG_L = WAGEN.reduce((n, w) => n + w.vorn + w.hinten + w.luecke, 0);
  BA.WAGEN = WAGEN; BA.ZUG_L = ZUG_L;
  const GLEIS_Z = 0.5, SCHOTTER_Z = 0.3, SPUR = 0.75, BETT = 1.65, BOESCHUNG = 0.75;
  /* Fahrplan: Streckentempo 45 km/h, Bremsen 0,9 m/s², Anfahren 0,6 m/s², 14 s Halt (wie BAHN_HALT) */
  const V = 12.5, BREMS = 0.9, ANFAHR = 0.6, HALT = 14;
  BA.V = V; BA.HALT = HALT;
  /* Ersatzstrecke hinten: vom Westrand hinter Schloss und Kirche durch den Waldsaum zum Ostrand */
  const ERSATZ = [[-112, -74], [-84, -84], [-40, -88], [0, -88.5], [40, -87], [84, -82], [112, -72]];
  const ERSATZ_HALT = [-36, -88];
  /* Die Bodenkarte endet bei ±112 m (stadt/boden.js GROESSE/2 + RAND), dahinter geht der Schnee/die Wiese weiter:
     das Gleis läuft bis ±126 m und blendet auf den letzten 18 m aus, der Zug ebenso (Nachbardorf hinter dem Horizont) */
  const RAND = 126;
  const AUSLAUF = 70;               // so weit läuft die Strecke unsichtbar über den Rand hinaus

  /* ---------------- Strecke ---------------- */
  let weg = null;                   // { X, Y, S, n, laenge, s0, s1 } – alle 0,5 m ein Punkt
  function glatt(pts, n) {
    const aus = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (let k = 0; k < n; k++) {
        const t = k / n, t2 = t * t, t3 = t2 * t;
        aus.push([0, 1].map((a) => 0.5 * ((2 * p1[a]) + (-p0[a] + p2[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * t3)));
      }
    }
    aus.push(pts[pts.length - 1].slice());
    return aus;
  }
  function wegBauen() {
    const D = ST.dorf || {};
    const roh = Array.isArray(D.BAHN) && D.BAHN.length >= 2 ? D.BAHN : ERSATZ;
    BA.ersatz = roh === ERSATZ;
    /* Auslauf: geradeaus über die Enden hinaus */
    const a = roh[0], a1 = roh[1], b = roh[roh.length - 1], b1 = roh[roh.length - 2];
    const la = Math.hypot(a[0] - a1[0], a[1] - a1[1]) || 1, lb = Math.hypot(b[0] - b1[0], b[1] - b1[1]) || 1;
    const vor = [a[0] + (a[0] - a1[0]) / la * AUSLAUF, a[1] + (a[1] - a1[1]) / la * AUSLAUF];
    const nach = [b[0] + (b[0] - b1[0]) / lb * AUSLAUF, b[1] + (b[1] - b1[1]) / lb * AUSLAUF];
    /* erst gleichmäßig alle ≈ 4 m verdichten: ungleiche Abstände ließen die Kurve sonst überschwingen (Schleifen) */
    const dicht = [];
    const kette = [vor].concat(roh.map((p) => [p[0], p[1]]), [nach]);
    for (let i = 0; i < kette.length - 1; i++) {
      const p = kette[i], q2 = kette[i + 1], n = Math.max(1, Math.round(Math.hypot(q2[0] - p[0], q2[1] - p[1]) / 4));
      for (let k = 0; k < n; k++) dicht.push([p[0] + (q2[0] - p[0]) * k / n, p[1] + (q2[1] - p[1]) * k / n]);
    }
    dicht.push(nach);
    const pts = glatt(dicht, 8);
    /* gleichmäßig alle 0,5 m */
    const X = [pts[0][0]], Y = [pts[0][1]];
    let rest = 0;
    for (let j = 1; j < pts.length; j++) {
      const dx = pts[j][0] - pts[j - 1][0], dy = pts[j][1] - pts[j - 1][1], L = Math.hypot(dx, dy);
      let d0 = 0.5 - rest;
      while (d0 <= L) { X.push(pts[j - 1][0] + dx * d0 / L); Y.push(pts[j - 1][1] + dy * d0 / L); d0 += 0.5; }
      rest = L - (d0 - 0.5);
    }
    weg = { X: X, Y: Y, n: X.length - 1, laenge: (X.length - 1) * 0.5 };
    /* sichtbarer Teil: solange innerhalb der Bodenkarte */
    let i0 = 0, i1 = weg.n;
    while (i0 < weg.n && (Math.abs(X[i0]) > RAND || Math.abs(Y[i0]) > RAND)) i0++;
    while (i1 > 0 && (Math.abs(X[i1]) > RAND || Math.abs(Y[i1]) > RAND)) i1--;
    weg.i0 = i0; weg.i1 = i1;
    BA.weg = weg;
    plan = null;
    return weg;
  }
  /* Punkt auf der Strecke: s in Metern ab dem Anfang; Richtung (tx, ty) */
  function an(s) {
    const W = weg || wegBauen(), u = klemm(s / 0.5, 0, W.n - 1e-6), i = Math.floor(u), f = u - i;
    const j = Math.min(W.n, i + 1);
    const tx = W.X[j] - W.X[i], ty = W.Y[j] - W.Y[i], l = Math.hypot(tx, ty) || 1;
    return { x: W.X[i] + (W.X[j] - W.X[i]) * f, y: W.Y[i] + (W.Y[j] - W.Y[i]) * f, tx: tx / l, ty: ty / l };
  }
  BA.an = an;
  function naechstes(x, y) {
    const W = weg || wegBauen();
    let b = 0, d0 = Infinity;
    for (let i = 0; i <= W.n; i++) { const d = (W.X[i] - x) * (W.X[i] - x) + (W.Y[i] - y) * (W.Y[i] - y); if (d < d0) { d0 = d; b = i; } }
    return { s: b * 0.5, d: Math.sqrt(d0) };
  }
  BA.naechstes = naechstes;

  /* ---------------- Halt am Bahnhof ---------------- */
  function haltBestimmen() {
    const D = ST.dorf || {};
    BA.eigenerSteig = false;
    if (Array.isArray(D.BAHN_HALT)) { BA.halt = naechstes(D.BAHN_HALT[0], D.BAHN_HALT[1]).s; return; }
    const b = SZ.objekte.find((o) => o.bild === "k_bahnhof");
    if (b) {
      /* Gleismitte im Bahnhofsmodell: 5,9 m vor dem Haus (stadt/modelle/bahnhof.js YG) */
      const w = (b.dreh || 0) * Math.PI / 2, gx = b.x + 5.9 * Math.sin(w), gy = b.y - 5.9 * Math.cos(w);
      const n = naechstes(gx, gy);
      if (n.d < 25) { BA.halt = n.s; BA.bahnhof = b; return; }
    }
    /* Kein Bahnhof an der Strecke: eigener Haltepunkt mit Bahnsteig */
    const h = BA.ersatz ? ERSATZ_HALT : (function () { const W = weg; const m = Math.round((W.i0 + W.i1) / 2); return [W.X[m], W.Y[m]]; })();
    BA.halt = naechstes(h[0], h[1]).s;
    BA.eigenerSteig = true;
  }

  /* ---------------- Fahrplan ---------------- */
  let plan = null;
  function planBauen() {
    if (!weg) wegBauen();
    if (BA.halt == null) haltBestimmen();
    const bremsWeg = V * V / (2 * BREMS), bremsZeit = V / BREMS, anfZeit = V / ANFAHR, anfWeg = V * anfZeit / 2;
    const L = weg.laenge;
    /* Richtung +1: Spitze von s = 0 bis zum Halt (Zugmitte am Bahnsteig), dann bis Schluss hinter dem Ende */
    const mk = (dir) => {
      const sStart = dir > 0 ? 0 : L, sHalt = BA.halt + dir * ZUG_L / 2, sEnde = dir > 0 ? L + ZUG_L : -ZUG_L;
      const ein = Math.abs(sHalt - sStart), aus = Math.abs(sEnde - sHalt);
      const t1 = Math.max(0, (ein - bremsWeg) / V), tAn = t1 + bremsZeit, tAb = tAn + HALT;
      const tEnde = tAb + anfZeit + Math.max(0, aus - anfWeg) / V;
      return { dir: dir, sStart: sStart, sHalt: sHalt, t1: t1, tAn: tAn, tAb: tAb, tEnde: tEnde, anfZeit: anfZeit, anfWeg: anfWeg, bremsWeg: bremsWeg };
    };
    plan = { hin: mk(1), her: mk(-1) };
    /* Umlauf wie im alten Dorf (60 s), aber nie kürzer als die Fahrt plus eine kleine Pause */
    plan.takt = Math.max(60, Math.ceil(Math.max(plan.hin.tEnde, plan.her.tEnde) + 8));
    BA.plan = plan;
    return plan;
  }
  /* Stand zur Zeit t (Sekunden im Umlauf) auf dem Fahrplan P */
  function stand(P, t) {
    if (t < 0 || t > P.tEnde) return null;
    const d = P.dir;
    if (t < P.t1) return { s: P.sStart + d * V * t, v: V, art: "faehrt", tau: t };
    if (t < P.tAn) { const tau = t - P.t1; return { s: P.sStart + d * (V * P.t1 + V * tau - BREMS * tau * tau / 2), v: V - BREMS * tau, art: "bremst", tau: tau }; }
    if (t < P.tAb) return { s: P.sHalt, v: 0, art: "steht", tau: t - P.tAn };
    const tau = t - P.tAb;
    if (tau < P.anfZeit) return { s: P.sHalt + d * ANFAHR * tau * tau / 2, v: ANFAHR * tau, art: "anfahren", tau: tau };
    return { s: P.sHalt + d * (P.anfWeg + V * (tau - P.anfZeit)), v: V, art: "faehrt", tau: tau };
  }
  BA.stand = stand;
  /* Uhr: für alle gleich (Date.now); ?bahnt=35 hält die Zeit im Umlauf fest (Prüfbilder), ?bahnr=-1 die Richtung */
  /* (Sonden können die Zeit auch vor dem Laden setzen: window.__bahnt, z. B. im eingebetteten Rahmen) */
  const FEST_T = q.get("bahnt") != null ? +q.get("bahnt") : window.__bahnt != null ? +window.__bahnt : null, FEST_R = q.get("bahnr") != null ? +q.get("bahnr") : null;
  BA.uhr = function () {
    const P = plan || planBauen();
    if (BA.fest) return BA.fest;
    if (FEST_T != null) return { t: FEST_T, dir: FEST_R || 1 };
    const T = Date.now() / 1000 + BA.versatz, n = Math.floor(T / P.takt);
    return { t: T - n * P.takt, dir: n % 2 ? -1 : 1 };
  };

  /* ---------------- Aufbauen: Bäume vom Gleis nehmen ---------------- */
  function abstand(x, y) {
    const W = weg; let d0 = Infinity;
    for (let i = W.i0; i <= W.i1; i += 2) { const d = (W.X[i] - x) * (W.X[i] - x) + (W.Y[i] - y) * (W.Y[i] - y); if (d < d0) d0 = d; }
    return Math.sqrt(d0);
  }
  BA.aufbauen = function () {
    wegBauen(); BA.halt = null; BA.bahnhof = null; haltBestimmen(); planBauen();
    const weg0 = [];
    for (const o of SZ.objekte) {
      if (o.art !== "natur") continue;
      const r = (o.fuss ? Math.max(o.fuss[0], o.fuss[1]) / 2 : 1.5);
      if (abstand(o.x, o.y) < BETT + BOESCHUNG + r + 0.6) weg0.push(o);
    }
    for (const o of weg0) SZ.weg(o);
    BA.geraeumt = weg0.length;
    /* gleich einmal stellen: dann lädt das Prüfbild (still=1) die Blätter schon beim Warten */
    BA.bewegen(0);
  };

  /* ---------------- Bewegen ---------------- */
  let letzte = 0, rauchWeg = null, stampf = 0, naechsterFaden = 0, altArt = "";
  function klein() { return !!(LB.nurKlein || (document.body && document.body.classList.contains("lk-mini-modus"))); }
  BA.bewegen = function (jetzt) {
    const dt = Math.min(0.1, Math.max(0, (jetzt - (letzte || jetzt)) / 1000)); letzte = jetzt;
    BA.t += dt;
    const P = plan || planBauen(), u = BA.uhr(), fp = u.dir > 0 ? P.hin : P.her, st = stand(fp, u.t);
    BA.st = st; BA.dir = u.dir;
    BA.zug = [];
    if (st) {
      /* Die Wagen hängen hintereinander: jeder mit seinen Achsen auf dem Gleis, Blickrichtung aus der Sehne */
      let vorn = st.s;
      for (const w of WAGEN) {
        const mitte = vorn - u.dir * w.vorn, halb = (w.vorn + w.hinten) * 0.32;
        const A = an(mitte - u.dir * halb), Bq = an(mitte + u.dir * halb), M = an(mitte);
        const hx = Bq.x - A.x, hy = Bq.y - A.y, l = Math.hypot(hx, hy) || 1;
        BA.zug.push({ w: w, x: (A.x + Bq.x) / 2 * 0.5 + M.x * 0.5, y: (A.y + Bq.y) / 2 * 0.5 + M.y * 0.5, h: Math.atan2(hy / l, hx / l), s: mitte });
        vorn = mitte - u.dir * (w.hinten + w.luecke);
      }
      /* Rauch: beim Anfahren Stoß für Stoß (wie „lokstampf"), in Fahrt alle paar Meter, im Stand ein dünner Faden */
      const lok = BA.zug[0], c = Math.cos(lok.h), s = Math.sin(lok.h);
      const sx = lok.x + c * 4.3, sy = lok.y + s * 4.3, sz = GLEIS_Z + 4.9;
      if (st.art === "anfahren" && altArt !== "anfahren") stampf = 0;
      if (st.art === "anfahren" && stampf < 7) {
        const STOSS = [0, 0.46, 0.868, 1.224, 1.528, 1.78, 1.98];
        while (stampf < 7 && st.tau >= STOSS[stampf]) {
          puff(sx, sy, sz, stampf < 3 ? "russ" : "dampf", 1.25);
          for (const sd of [-1, 1]) puff(lok.x + c * 3.9 - s * sd * 1.3, lok.y + s * 3.9 + c * sd * 1.3, GLEIS_Z + 0.9, "zylinder", 0.8, [-s * sd * 1.6, c * sd * 1.6]);
          stampf++;
        }
        rauchWeg = null;
      } else if (st.v > 0.5) {
        const abst = 1.4 + st.v * 0.22;
        /* nach der Uhr (nicht nach der Strecke), damit auch das Prüfbild mit fester Zeit raucht */
        if (rauchWeg == null || BA.t >= rauchWeg) { rauchWeg = BA.t + abst / st.v; puff(sx, sy, sz, BA.t % 1 < 0.3 ? "russ" : "dampf", 0.8 + Math.min(0.5, 3 / (st.v + 1)), [c * st.v * 0.25, s * st.v * 0.25]); }
      } else if (BA.t >= naechsterFaden) {
        naechsterFaden = BA.t + (st.art === "steht" ? 0.8 : 0.5); rauchWeg = null;
        puff(sx, sy, sz, "leise", 0.7);
      }
      tonTakt(st, u.dir, lok);
      altArt = st.art;
    } else { altArt = ""; tonS = null; }
    /* Rauchwolken altern: steigen gebremst, wachsen, verwehen mit dem Wind und vergehen */
    const wind = [0.9, -0.35];
    for (const p of BA.puffs) {
      const a = BA.t - p.t0;
      p.x += (wind[0] + p.vx) * dt; p.y += (wind[1] + p.vy) * dt; p.vx *= Math.pow(0.4, dt); p.vy *= Math.pow(0.4, dt);
      p.z += (p.art === "zylinder" ? 0.25 : 1.6 * Math.exp(-a * 0.7) + 0.25) * dt;
    }
    BA.puffs = BA.puffs.filter((p) => BA.t - p.t0 < p.dauer);
  };
  /* ---------------- FASSUNG 818: Ton der Lok ---------------- */
  /* Lautstärke nach Nähe (Abstand der Lok zur Bildmitte) und Zoom; Richtung im Bild → links/rechts */
  let tonS = null, schnaufPh = 0, klackWeg = 0, bremsSpielt = false, abPfiff = false;
  BA.radWeg = 0;
  function tonLaut(lok) {
    const c = ST.aufBoden(K.W / 2, K.H / 2), d = Math.hypot(lok.x - c[0], lok.y - c[1]);
    const sc = K.s / (K.dpr || 1), R = klemm(1200 / Math.max(1, sc), 45, 170);
    const nah = Math.pow(klemm(1 - d / R, 0, 1), 1.5), zoom = klemm(sc / 16, 0.25, 1);
    const P = ST.proj(lok.x, lok.y, 0);
    return { laut: 0.6 * nah * zoom * randAlpha(lok), pan: klemm((P[0] / K.W - 0.5) * 1.6, -0.85, 0.85) };
  }
  function tonTakt(st, dir, lok) {
    /* gefahrener Weg seit dem letzten Bild (bei festgehaltener Uhr oder Sprüngen: nichts) */
    let weg = tonS == null ? 0 : (st.s - tonS) * dir;
    tonS = st.s;
    if (!(weg >= 0 && weg < 6)) weg = 0;
    BA.radWeg += weg;
    const T = ST.ton;
    if (!T) return;
    const L = tonLaut(lok);
    BA.tonInfo = L;
    const hoerbar = L.laut > 0.004 && T.darf();
    /* Einfahrt: langer Pfiff, dann in den letzten 2,6 s das Bremsquietschen */
    if (st.art === "bremst" && altArt !== "bremst") { bremsSpielt = false; if (hoerbar) T.pfiff(L.laut * 0.9, L.pan, "ein"); }
    if (st.art === "bremst" && !bremsSpielt && st.v / BREMS <= 2.6) { bremsSpielt = true; if (hoerbar) T.bremse(L.laut, L.pan, st.v / BREMS + 0.35); }
    /* Halt: Dampf ablassen; kurz vor der Abfahrt kurz–lang pfeifen */
    if (st.art === "steht" && altArt && altArt !== "steht") { abPfiff = false; if (hoerbar) T.zisch(L.laut * 0.8, L.pan); }
    if (st.art === "steht" && !abPfiff && st.tau >= HALT - 1.9) { abPfiff = true; if (hoerbar) T.pfiff(L.laut, L.pan, "ab"); }
    /* Schnaufen: vier Dampfstöße je Radumdrehung, beim Anfahren schwer */
    if (st.art === "anfahren" || st.art === "faehrt") {
      schnaufPh += weg / (TAU * WAGEN[0].radR) * 4;
      let n = 0;
      while (schnaufPh >= 1 && n < 2) {
        schnaufPh -= 1; n++;
        const kraft = st.art === "anfahren" ? klemm(1 - st.v / V, 0.2, 1) : 0.12;
        if (hoerbar) T.schnauf(L.laut * (0.45 + 0.55 * kraft), L.pan, kraft);
      }
      if (schnaufPh >= 1) schnaufPh %= 1;
    } else schnaufPh = 0.85;
    /* Schienenstöße alle 15 m */
    klackWeg += weg;
    if (klackWeg >= 15) { klackWeg %= 15; if (hoerbar && st.v > 3) T.klack(L.laut * 0.55, L.pan); }
  }
  function puff(x, y, z, art, gr, v) {
    if (BA.puffs.length > (klein() ? 18 : 44)) BA.puffs.shift();
    BA.puffs.push({ x: x, y: y, z: z, t0: BA.t, art: art, gr: gr || 1, vx: v ? v[0] : 0, vy: v ? v[1] : 0,
      dauer: art === "zylinder" ? 1.2 : art === "leise" ? 3.0 : 3.8, dreh: Math.random() * TAU });
  }

  /* ---------------- Zeichnen: Hilfen ---------------- */
  const jahrName = () => (SZ.jahr === "winter" ? "winter" : "herbst");
  /* FASSUNG 818 — Radstellung der Lok (Spalte im Blatt): rollen ohne Rutschen */
  function radSpalte(w, meta) {
    const n = (meta && meta.n) || 1;
    if (n <= 1 || !w.radR) return 0;
    const ph = ((BA.radWeg / (TAU * w.radR)) % 1 + 1) % 1;
    return Math.floor(ph * n) % n;
  }
  function lichtK(Z) { return [0, 1, 2].map((i) => Math.min(1.05, Z.amb[i] + Z.sonne[i] * 0.9)); }
  const farbe = (f, k, a) => "rgba(" + Math.round(f[0] * k[0]) + "," + Math.round(f[1] * k[1]) + "," + Math.round(f[2] * k[2]) + "," + (a == null ? 1 : a) + ")";
  function sichtbarerBereich() {
    /* Weltpunkte der vier Bildecken (etwas Rand) → grobe Grenze für das Gleis */
    const r = 40 * K.dpr, e = [[-r, -r], [K.W + r, -r], [K.W + r, K.H + r], [-r, K.H + r]].map((p) => ST.aufBoden(p[0], p[1]));
    return { x0: Math.min(...e.map((p) => p[0])), x1: Math.max(...e.map((p) => p[0])), y0: Math.min(...e.map((p) => p[1])), y1: Math.max(...e.map((p) => p[1])) };
  }
  /* Band längs der Strecke (Abstand links/rechts, Höhe) als Pfad */
  function band(g, i0, i1, schritt, a, b, z) {
    const W = weg;
    const P = (i, d) => { const j = Math.min(W.n, i + 1), k = Math.max(0, i - 1); const tx = W.X[j] - W.X[k], ty = W.Y[j] - W.Y[k], l = Math.hypot(tx, ty) || 1; return ST.proj(W.X[i] - ty / l * d, W.Y[i] + tx / l * d, z); };
    g.beginPath();
    let erst = true;
    for (let i = i0; i <= i1; i += schritt) { const p = P(Math.min(i, i1), a); if (erst) { g.moveTo(p[0], p[1]); erst = false; } else g.lineTo(p[0], p[1]); }
    const p1 = P(i1, a); g.lineTo(p1[0], p1[1]);
    for (let i = i1; i >= i0; i -= schritt) { const p = P(Math.max(i, i0), b); g.lineTo(p[0], p[1]); }
    const p0 = P(i0, b); g.lineTo(p0[0], p0[1]);
    g.closePath();
  }
  function linie(g, i0, i1, schritt, d, z) {
    const W = weg;
    g.beginPath();
    let erst = true;
    for (let i = i0; i <= i1 + schritt - 1; i += schritt) {
      const ii = Math.min(i, i1), j = Math.min(W.n, ii + 1), k = Math.max(0, ii - 1), tx = W.X[j] - W.X[k], ty = W.Y[j] - W.Y[k], l = Math.hypot(tx, ty) || 1;
      const p = ST.proj(W.X[ii] - ty / l * d, W.Y[ii] + tx / l * d, z);
      if (erst) { g.moveTo(p[0], p[1]); erst = false; } else g.lineTo(p[0], p[1]);
    }
  }

  /* ---------------- Boden: Gleis flach unter allem (vor den Schatten) ---------------- */
  BA.boden = function (g, t, Z) {
    if (!weg) wegBauen();
    if (BA.halt == null) { haltBestimmen(); planBauen(); }
    const W = weg, B = sichtbarerBereich();
    /* nur der sichtbare Abschnitt (mit Rand) */
    let i0 = -1, i1 = -1;
    for (let i = W.i0; i <= W.i1; i++) {
      const x = W.X[i], y = W.Y[i];
      if (x > B.x0 - 6 && x < B.x1 + 6 && y > B.y0 - 6 && y < B.y1 + 6) { if (i0 < 0) i0 = i; i1 = i; }
    }
    BA.gleisSichtbar = i0 >= 0;
    if (i0 < 0) return;
    const k = lichtK(Z), winter = SZ.jahr === "winter", s = K.s;
    const grob = s < 5 * K.dpr ? 8 : s < 12 ? 4 : 2;
    g.save();
    /* Böschung und Schotterbett */
    band(g, i0, i1, grob, BETT + BOESCHUNG, -(BETT + BOESCHUNG), 0);
    g.fillStyle = farbe(winter ? [206, 214, 226] : [104, 98, 90], k); g.fill();
    band(g, i0, i1, grob, BETT, -BETT, SCHOTTER_Z);
    g.fillStyle = farbe(winter ? [226, 232, 242] : [128, 122, 112], k); g.fill();
    /* Bahnsteig am eigenen Haltepunkt (wenn kein Bahnhof an der Strecke steht) */
    if (BA.eigenerSteig) steig(g, k, winter);
    /* Schwellen: alle 0,65 m, 2,6 m lang (erst ab etwas Nähe) */
    if (s >= 4 * K.dpr) {
      g.beginPath();
      const sch = s < 9 * K.dpr ? 1.3 : 0.65;
      for (let d = i0 * 0.5; d <= i1 * 0.5; d += sch) {
        const p = an(d), nx = -p.ty, ny = p.tx, bx = p.tx * 0.13, by = p.ty * 0.13;
        const e = [[p.x + nx * 1.3 - bx, p.y + ny * 1.3 - by], [p.x + nx * 1.3 + bx, p.y + ny * 1.3 + by], [p.x - nx * 1.3 + bx, p.y - ny * 1.3 + by], [p.x - nx * 1.3 - bx, p.y - ny * 1.3 - by]].map((q) => ST.proj(q[0], q[1], 0.36));
        g.moveTo(e[0][0], e[0][1]); g.lineTo(e[1][0], e[1][1]); g.lineTo(e[2][0], e[2][1]); g.lineTo(e[3][0], e[3][1]); g.closePath();
      }
      g.fillStyle = farbe(winter ? [150, 146, 146] : [86, 68, 52], k); g.fill();
      if (winter) { g.fillStyle = "rgba(240,244,250,0.35)"; g.fill(); }
    } else {
      band(g, i0, i1, grob, 1.3, -1.3, 0.36);
      g.fillStyle = farbe(winter ? [178, 180, 188] : [98, 84, 70], k, 0.7); g.fill();
    }
    /* Schienen: dunkler Steg, blanker Kopf */
    g.lineJoin = "round"; g.lineCap = "round";
    for (const d of [-SPUR, SPUR]) {
      linie(g, i0, i1, grob, d, GLEIS_Z - 0.05);
      g.strokeStyle = farbe([70, 62, 56], k); g.lineWidth = Math.max(1, 0.14 * s); g.stroke();
      linie(g, i0, i1, grob, d, GLEIS_Z);
      g.strokeStyle = farbe([196, 198, 204], k, 0.9); g.lineWidth = Math.max(0.6, 0.06 * s); g.stroke();
    }
    /* an den Kartenenden weich ausblenden */
    for (const [ie, sg] of [[W.i0, 1], [W.i1, -1]]) {
      if (ie < i0 - 40 || ie > i1 + 40) continue;
      const ii = ie + sg * 36, a0 = an(ii * 0.5), a1 = an(ie * 0.5), P0 = ST.proj(a0.x, a0.y, 0), P1 = ST.proj(a1.x, a1.y, 0);
      const gr = g.createLinearGradient(P0[0], P0[1], P1[0], P1[1]);
      gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,1)");
      g.globalCompositeOperation = "destination-out"; g.fillStyle = gr;
      band(g, Math.min(ie, ii), Math.max(ie, ii), 2, 4, -4, 0.3); g.fill();
      /* über das Ende hinaus alles weg (auch die Schienen, die bis dorthin reichen) */
      g.fillStyle = "#000"; band(g, Math.max(0, Math.min(ie, ie - sg * 8)), Math.min(W.n, Math.max(ie, ie - sg * 8)), 2, 4, -4, 0.3); g.fill();
      g.globalCompositeOperation = "source-over";
    }
    /* Nachts: Lichtkegel der Stirnlampen auf dem Gleis vor der Lok */
    if (Z.nacht > 0.3 && BA.zug.length) {
      const lok = BA.zug[0], c = Math.cos(lok.h), sn = Math.sin(lok.h);
      const m = ST.proj(lok.x + c * 13, lok.y + sn * 13, SCHOTTER_Z), f = ST.proj(lok.x + c * 6.2, lok.y + sn * 6.2, SCHOTTER_Z);
      const r = 7 * s, ga = Z.nacht * 0.5 * randAlpha(lok);
      g.globalCompositeOperation = "lighter";
      const gr = g.createRadialGradient(f[0], f[1], 0, m[0], m[1], r);
      gr.addColorStop(0, "rgba(255,236,180," + (ga * 0.8).toFixed(3) + ")"); gr.addColorStop(0.5, "rgba(255,226,160," + (ga * 0.3).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,220,150,0)");
      g.fillStyle = gr; g.beginPath(); g.ellipse(m[0], m[1], r, r * 0.42, Math.atan2(m[1] - f[1], m[0] - f[0]), 0, TAU); g.fill();
      g.globalCompositeOperation = "source-over";
    }
    g.restore();
  };
  /* ein einfacher Bahnsteig (Pflaster, weiße Kante) auf der Stadtseite des Haltepunkts */
  function steig(g, k, winter) {
    const L = ZUG_L + 8, a = BA.halt - L / 2, b = BA.halt + L / 2, M = an(BA.halt);
    /* Stadtseite: die Normale, die zur Kartenmitte zeigt */
    const seite = (-M.ty * -M.x + M.tx * -M.y) > 0 ? 1 : -1;
    const P = (d, q, z) => { const p = an(d); return ST.proj(p.x - p.ty * q * seite, p.y + p.tx * q * seite, z); };
    const kante = (q0, q1, z, f) => {
      g.beginPath();
      for (let d = a; d <= b; d += 2) { const p = P(d, q0, z); if (d === a) g.moveTo(p[0], p[1]); else g.lineTo(p[0], p[1]); }
      for (let d = b; d >= a; d -= 2) { const p = P(d, q1, z); g.lineTo(p[0], p[1]); }
      g.closePath(); g.fillStyle = f; g.fill();
    };
    kante(BETT + 0.1, BETT + 4.2, 0, farbe(winter ? [170, 176, 186] : [120, 112, 104], k));                  // Mauer (Schatten)
    kante(BETT + 0.1, BETT + 4.2, 0.55, farbe(winter ? [236, 240, 246] : [176, 168, 156], k));              // Pflaster
    kante(BETT + 0.1, BETT + 0.35, 0.56, farbe([238, 236, 228], k));                                       // weiße Kante
  }

  /* ---------------- Schatten des Zuges (in die Schattenebene, halbe Auflösung) ---------------- */
  function huelle(p) {
    p = p.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const kr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const u = [], o = [];
    for (const q of p) { while (u.length >= 2 && kr(u[u.length - 2], u[u.length - 1], q) <= 0) u.pop(); u.push(q); }
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (o.length >= 2 && kr(o[o.length - 2], o[o.length - 1], q) <= 0) o.pop(); o.push(q); }
    return u.slice(0, -1).concat(o.slice(0, -1));
  }
  BA.schatten = function (sg) {
    if (!BA.zug.length) return;
    const L = ST.LICHT, d = ST.drehXY(-L[0] / L[2], -L[1] / L[2], (4 - (K.dreh & 3)) & 3);   // Versatz je Meter Höhe (Welt)
    sg.save(); sg.fillStyle = "#000";
    for (const z of BA.zug) {
      const a = randAlpha(z); if (a <= 0.01) continue;
      const c = Math.cos(z.h), s = Math.sin(z.h), w = 1.35, pts = [];
      for (const [l, q] of [[z.w.vorn - 0.3, w], [z.w.vorn - 0.3, -w], [-z.w.hinten + 0.3, w], [-z.w.hinten + 0.3, -w]]) {
        const x = z.x + c * l - s * q, y = z.y + s * l + c * q;
        for (const hz of [0.4, z.w.h * 0.92]) { const p = ST.proj(x + d[0] * (hz + GLEIS_Z - SCHOTTER_Z), y + d[1] * (hz + GLEIS_Z - SCHOTTER_Z), SCHOTTER_Z); pts.push([p[0] / 2, p[1] / 2]); }
      }
      const h = huelle(pts);
      sg.globalAlpha = a * 0.9;
      sg.beginPath(); h.forEach((p, i) => (i ? sg.lineTo(p[0], p[1]) : sg.moveTo(p[0], p[1]))); sg.closePath(); sg.fill();
    }
    sg.restore();
  };

  /* ---------------- Fahrzeuge als Einträge für die Tiefensortierung (wie leute.sichtbar) ---------------- */
  /* Am Kartenrand blendet der Zug weich aus (dahinter ist keine Landschaft mehr) */
  function randAlpha(z) { return klemm((RAND - 2 - Math.max(Math.abs(z.x), Math.abs(z.y))) / 12, 0, 1); }
  function blatt(basis) {
    /* im kleinen Rahmen das Zwergblatt, solange es scharf genug ist */
    const z = LB.vz[basis + "_z"], g = LB.vz[basis];
    if (z && (!g || (LB.nurKlein && K.s <= z.s * 1.35))) return { name: basis + "_z", meta: z };
    return g ? { name: basis, meta: g } : null;
  }
  BA.blatt = blatt;
  BA.sichtbar = function (Z) {
    const aus = [];
    if (!BA.zug.length) return aus;
    const zeit = Z.nacht > 0.5 ? "nacht" : "tag", jahr = jahrName(), kl = klein();
    const rand = 120 * K.dpr;
    for (let i = 0; i < BA.zug.length; i++) {
      const z = BA.zug[i];
      /* im kleinen Rahmen: Lok, Tender und zwei Wagen */
      if (kl && z.w.art === "wagen3") continue;
      const alpha = randAlpha(z); if (alpha <= 0.01) continue;
      const P = ST.proj(z.x, z.y, GLEIS_Z);
      if (P[0] < -rand || P[0] > K.W + rand || P[1] < -rand || P[1] > K.H + rand * 1.5) continue;
      const b = blatt(z.w.bild + "_" + jahr + "_" + zeit); if (!b) continue;
      const img = LB.bild(b.name); if (!img) continue;
      const gier = Math.atan2(-Math.cos(z.h), Math.sin(z.h)) * 180 / Math.PI + K.dreh * 90;
      const r = ST.drehXY(z.x, z.y, K.dreh);
      aus.push({ X: P[0], Y: P[1], a: r[0], b: r[1], img: img, meta: b.meta, reihe: ((Math.round(gier / 45) % 8) + 8) % 8, schritt: radSpalte(z.w, b.meta),
        malen: wagenMalen, bx: (z.w.vorn + z.w.hinten) / 2, bh: z.w.h + 1, z: z, alpha: alpha, Z: Z, bahn: i });
    }
    BA.gezeigt = aus.length;
    return aus;
  };
  function wagenMalen(g, p) {
    const m = p.meta, k = K.s / m.s;
    if (p.alpha < 1) g.globalAlpha = p.alpha;
    g.drawImage(p.img, p.schritt * m.zw, p.reihe * m.zh, m.zw, m.zh, p.X - m.ax * k, p.Y - m.ay * k, m.zw * k, m.zh * k);
    g.globalAlpha = 1;
    /* Nachts: Lichthöfe der Lampen (vorn weiß-gelb, am Zugschluss rot, im Führerhaus das Feuer) */
    const Z = p.Z; if (!(Z.nacht > 0.3)) return;
    const z = p.z, c = Math.cos(z.h), s = Math.sin(z.h), a = Z.nacht * p.alpha;
    const hof = (l, q, hz, r, f, st) => {
      const P = ST.proj(z.x + c * l - s * q, z.y + s * l + c * q, GLEIS_Z + hz), R = r * K.s;
      if (R < 1) return;
      const gr = g.createRadialGradient(P[0], P[1], 0, P[0], P[1], R);
      gr.addColorStop(0, "rgba(" + f + "," + (st * a).toFixed(3) + ")"); gr.addColorStop(0.25, "rgba(" + f + "," + (st * a * 0.35).toFixed(3) + ")"); gr.addColorStop(1, "rgba(" + f + ",0)");
      g.fillStyle = gr; g.fillRect(P[0] - R, P[1] - R, 2 * R, 2 * R);
    };
    g.save(); g.globalCompositeOperation = "lighter";
    /* Lampen nur auf der Seite, die zur Kamera zeigt, voll */
    const vornSicht = ST.tiefe(c, s) > -0.3 ? 1 : 0.35;
    if (z.w.art === "lok") {
      for (const q of [-0.95, 0.95]) hof(5.55, q, 1.62, 1.1, "255,238,190", 0.9 * vornSicht);
      hof(4.95, 0, 3.83, 1.0, "255,238,190", 0.85 * vornSicht);
      hof(-3.9, 0, 3.0, 1.8, "255,150,70", 0.35);
    } else if (z.w.schluss) {
      for (const q of [-1.05, 1.05]) hof(-6.1, q, 1.58, 0.8, "255,60,40", 0.8 * (ST.tiefe(-c, -s) > -0.3 ? 1 : 0.35));
    }
    /* warmes Licht aus den Abteilfenstern */
    if (/^wagen/.test(z.w.art)) for (const sd of [-1, 1]) for (const l of [-3.5, 0, 3.5]) hof(l, sd * 1.5, 2.6, 1.3, "255,206,130", 0.16);
    g.restore();
  }

  /* ---------------- Rauch über allem ---------------- */
  SZ.zuhoerer.push(function (g, t, Z) {
    if (!BA.puffs.length) return;
    const hell = Z.nacht > 0.5 ? [150, 156, 176] : Z.nacht > 0.2 ? [200, 196, 205] : [238, 238, 242];
    const russ = Z.nacht > 0.5 ? [70, 72, 86] : [96, 94, 98];
    for (const p of BA.puffs) {
      const a = BA.t - p.t0, f = a / p.dauer;
      if (Math.max(Math.abs(p.x), Math.abs(p.y)) > RAND + 6) continue;
      const P = ST.proj(p.x, p.y, p.z);
      const r = (p.art === "zylinder" ? 0.35 + f * 1.2 : 0.45 + Math.sqrt(f) * 2.2) * p.gr * K.s;
      if (P[0] < -r || P[0] > K.W + r || P[1] < -r || P[1] > K.H + r) continue;
      const deck = (1 - f) * (f < 0.08 ? f / 0.08 : 1) * (p.art === "leise" ? 0.45 : p.art === "zylinder" ? 0.55 : 0.62);
      /* Ruß wird mit der Zeit heller (vermischt sich mit Dampf); der dünne Faden im Stand ist grau */
      const fa = p.art === "russ" ? russ.map((v, i) => v + (hell[i] - v) * f * 0.8) : p.art === "leise" ? russ.map((v, i) => v + (hell[i] - v) * (0.45 + f * 0.4)) : hell;
      /* drei Ballen je Wolke: sie quillt, statt als Scheibe aufzusteigen */
      for (const [dx, dy, rk, ak] of [[0, 0, 1, 1], [-0.42, 0.2, 0.74, 0.8], [0.45, 0.24, 0.7, 0.75]]) {
        const cx = P[0] + (dx * Math.cos(p.dreh) - dy * Math.sin(p.dreh)) * r, cy = P[1] + (dx * Math.sin(p.dreh) + dy * Math.cos(p.dreh)) * r * 0.8, rr = r * rk;
        const gr = g.createRadialGradient(cx, cy - rr * 0.2, 0, cx, cy, rr);
        const fs = "rgba(" + (fa[0] | 0) + "," + (fa[1] | 0) + "," + (fa[2] | 0) + ",";
        gr.addColorStop(0, fs + (deck * ak).toFixed(3) + ")"); gr.addColorStop(0.55, fs + (deck * ak * 0.55).toFixed(3) + ")"); gr.addColorStop(1, fs + "0)");
        g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, rr, 0, TAU); g.fill();
      }
    }
  });
})();
