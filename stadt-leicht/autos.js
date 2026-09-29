/* =====================================================================
   LEICHTE STADT — AUTOS (Dodge Viper und Batmobil fahren durchs Dorf)
   ---------------------------------------------------------------------
   XANDER: „mein neuen Dodge Viper und mein Batmobil habe ich immer noch
   nicht in der Map … Du sagst, sie sind fertig, aber ich seh sie noch
   immer nicht. Ich kann sie nicht dazu kaufen. Ich kann sie im Spiel
   überhaupt nicht ausprobieren." – und früher: „dieses Batmobil hätte
   ich nicht nur in dem Spiel gerne, das als fahrendes Auto zu sehen ist".

   KAUFEN: In der Schmücken-Leiste stehen beide Autos mit Preis und
   „Kaufen" (oberflaeche.js). Gekauft wird mit den Punkten des Spiels
   (spiel.js → spiel_auto_kaufen; solange es diese Serverfunktion noch
   nicht gibt, wird der Besitz wie der eigene Schmuck gespeichert). Wer
   nicht angemeldet ist, kann eine Probefahrt machen. Gekaufte Autos
   fahren in der eigenen Stadt – auch im kleinen Bild im Spiel (mini=1,
   Zwergblatt) – und lassen sich als Schmuck abstellen („Abstellen",
   „Losfahren").

   FAHREN: auf den Wegen des Dorfes (ST.dorf.WEGE, ohne die Straße der
   Pferdebahn) den kürzesten Weg zu einem zufälligen Ziel – einem Haus,
   einem Wahrzeichen oder dem Markt. Vor dem Haus hält das Auto ein paar
   Sekunden. Tempo im Dorf 7 bzw. 7,5 m/s (≈ 25 km/h), sanft anfahren und
   bremsen, in Kurven langsamer; die Ecken der Wege werden wie bei den
   Fuhrwerken abgerundet – für ein Auto mit Kreisbögen und gleitend
   gemittelt –, so fährt es im Bogen. Rechtsverkehr: das Auto fährt rechts
   vom Weg und weicht Entgegenkommenden weiter nach rechts aus (immer unter
   2 m vom Weg). Wer vorn im Weg steht (Kornwagen, Pferdebahn, ein anderes
   Auto), bei dem wartet das Auto und fährt hinterher. Geht der Weg zurück
   (die Wege sind ein Baum: vor vielen Häusern ist Schluss, an manchen
   Abzweigen geht es spitz zurück), wendet es in drei Zügen – vorwärts
   eingeschlagen, rückwärts, vorwärts – zur Seite des neuen Weges hin.

   BILDER: gebackene Laufblätter l_auto_viper / l_auto_batmobil (werk-
   zeug/stadt-backen.js, backplan „leute"): 16 Richtungen × 3 Radstel-
   lungen, Winter/Herbst × Tag/Nacht, Schatten im Blatt; im kleinen
   Rahmen die Zwergblätter _z (ein Bild je Richtung). Scheinwerfer mit
   Lichtkegel, Rücklichter (heller beim Bremsen) und das Glühen der
   Batmobil-Turbine beim Anfahren malt dieses Modul genau in Fahrt-
   richtung dazu.

   EINHÄNGEN: start.js ruft bewegen() in der Bildschleife, szene.js
   sortiert sichtbar() wie die Fuhrwerke zwischen die Häuser. Das Wege-
   netz entsteht hier neu, sobald die Fuhrwerke (fuhrwerk.js) ihres neu
   gebaut haben (nach jedem Aufbauen der Stadt).
   Prüfen: node werkzeug/pruefe-815-autos.js
   Testparameter: stadt-leicht.html?demo=1&autos=viper,batmobil
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, K = ST.kamera, SZ = ST.szene, LB = ST.bilder;
  const q = new URLSearchParams(location.search);
  const AU = (ST.autos = { liste: [], t: 0, grund: "" });
  const TAU = Math.PI * 2;
  const klemm = (v, a, b) => (v < a ? a : v > b ? b : v);
  const winkel = (a) => ((a % TAU) + 3 * Math.PI) % TAU - Math.PI;   // auf −π … π

  /* ---------------- Die Autos ----------------
     Maße aus den Modellen (stadt/modelle/auto_*.js): Mitte des Grundrisses im Ursprung, Front nach +y.
     lampen/rueck: Scheinwerfer und Rücklichter [quer, längs, Höhe]; zyklus: Weg (m), nach dem das Rad wieder gleich
     aussieht (Viper: drei Speichen = ⅓ Umdrehung, Batmobil: zehn Rippen = ⅒ Umdrehung). */
  const ARTEN = {
    viper: { id: "viper", name: "Dodge Viper", er: "er", bild: "v_viper", blatt: "l_auto_viper", preis: 300, V: 7, vorn: 2.25, hinten: 2.25, halb: 0.96,
      fuss: [1.92, 4.45], hoehe: 1.12, lampen: [[0.6, 2.15, 0.59], [-0.6, 2.15, 0.59]], rueck: [[0.6, -2.2, 0.63], [-0.6, -2.2, 0.63]], zyklus: 0.69 },
    batmobil: { id: "batmobil", name: "Batmobil", er: "es", bild: "v_batmobil", blatt: "l_auto_batmobil", preis: 450, V: 7.5, vorn: 2.95, hinten: 2.95, halb: 1.05,
      fuss: [2.1, 5.9], hoehe: 1.12, lampen: [[0.81, 2.86, 0.58], [-0.81, 2.86, 0.58]], rueck: [[0.7, -2.56, 0.4], [-0.7, -2.56, 0.4]], duese: [0, -2.62, 0.45], zyklus: 0.226 }
  };
  AU.ARTEN = ARTEN;
  AU.REIHE = ["viper", "batmobil"];

  /* ---------------- Fahrweise ---------------- */
  const GAS = 2.2;          // Anfahren (m/s²)
  const BREMS = 2.6;        // gewöhnliches Bremsen (m/s²)
  const NOT = 6;            // stärkstes Bremsen, wenn plötzlich jemand im Weg steht
  const QUER = 3.2;         // Querbeschleunigung in Kurven (m/s²) → bei 5 m Halbmesser ≈ 4 m/s
  const SEITE = 0.5;        // rechts vom Weg (Mitte des Autos)
  const AUSWEICHEN = 1.6;   // bei Gegenverkehr weiter rechts (höchstens 2 m vom Weg)
  const ABSTAND = 1.2;      // Lücke zum Vordermann beim Warten
  const WENDE_R = 2.6;      // Wenden in drei Zügen: Halbmesser je Zug (60° je Zug)
  const HALT = [4, 8];      // Sekunden vor einem Haus

  /* ---------------- Besitz ---------------- */
  const PROBE = 90;         // Sekunden Probefahrt
  const probe = {};         // id → Ende (AU.t)
  const testAutos = (q.get("autos") || "").split(",").filter((a) => ARTEN[a]);
  const SP = () => ST.spiel || {};
  AU.hat = function (id) { const s = SP(); return testAutos.indexOf(id) >= 0 || (Array.isArray(s.autos) && s.autos.indexOf(id) >= 0); };
  AU.geparkt = function (id) {
    const s = SP(), A = ARTEN[id];
    return !!(A && Array.isArray(s.autosGeparkt) && s.autosGeparkt.indexOf(id) >= 0 && SZ.objekte.some((o) => o.art === "eigen" && o.bild === A.bild && !o.geist));
  };
  /* wer fährt: gekauft und nicht abgestellt – oder auf Probefahrt (die endet erst, wenn das Auto vor einem Haus hält) */
  function sollFahren() {
    return AU.REIHE.filter((id) => {
      if (AU.hat(id) && !AU.geparkt(id)) return true;
      if (!probe[id]) return false;
      const a = AU.auto(id);
      return probe[id] > AU.t || !!(a && a.zustand !== "haelt");
    });
  }
  AU.kaufen = function (id) {
    const s = SP();
    if (!ARTEN[id]) return Promise.reject(new Error("unbekanntes Auto"));
    if (AU.hat(id)) return Promise.resolve({ ok: true, schon: true });
    if (!s.autoKaufen) return Promise.reject(new Error("Geht gerade nicht"));
    return s.autoKaufen(id, ARTEN[id].preis).then((r) => { AU.neu = true; return r; });
  };
  AU.probefahrt = function (id) { if (!ARTEN[id]) return; probe[id] = AU.t + PROBE; AU.neu = true; };
  AU.probeRest = function (id) { return Math.max(0, (probe[id] || 0) - AU.t); };
  /* abstellen (als Schmuck) oder wieder losfahren; das Speichern macht spiel.js (mit dem Schmuck) */
  AU.parken = function (id, an, wo) {
    const s = SP(); s.autosGeparkt = (s.autosGeparkt || []).filter((a) => a !== id);
    if (an) s.autosGeparkt.push(id);
    if (!an && wo) AU.startBei = Object.assign({}, AU.startBei || {}, { [id]: wo });
    AU.neu = true;
  };
  AU.auto = function (id) { return AU.liste.find((a) => a.id === id) || null; };

  /* ---------------- Strecken ---------------- */
  const strecke = (pts) => ST.fuhrwerk.strecke(pts);
  const an = (W, s, c) => ST.fuhrwerk.an(W, s, c);
  /* genauer Fußpunkt eines Punktes auf der Strecke (Bogenlänge und Abstand mit Vorzeichen: + = rechts im Bild) */
  function fusspunkt(W, x, y, bis, von) {
    let best = { s: 0, d: Infinity, q: 0 };
    for (let i = 0; i < W.n; i++) {
      if (bis != null && W.S[i] > bis) break;
      if (von != null && W.S[i + 1] < von) continue;
      const ax = W.X[i], ay = W.Y[i], dx = W.X[i + 1] - ax, dy = W.Y[i + 1] - ay, l2 = dx * dx + dy * dy || 1e-9;
      const t = klemm(((x - ax) * dx + (y - ay) * dy) / l2, 0, 1), px = ax + dx * t, py = ay + dy * t, d = Math.hypot(x - px, y - py);
      if (d < best.d) { const l = Math.sqrt(l2); best = { s: W.S[i] + t * (W.S[i + 1] - W.S[i]), d: d, q: ((x - px) * -dy + (y - py) * dx) / l }; }
    }
    return best;
  }
  /* Ecken abrunden – wie fuhrwerk.js fahrt(), aber für ein Auto mit größeren Bögen: erst die Wegpunkte auf das
     Nötige verdichten (Douglas-Peucker, 0,25 m), dann jede Ecke durch einen Kreisbogen ersetzen (Wunsch 12 m Halbmesser;
     höchstens so groß, dass der Bogen die Ecke um 1,5 m abkürzt und die Hälfte der Nachbarstrecken nicht überschreitet). */
  function verdichten(pts, tol) {
    if (pts.length < 3) return pts.slice();
    const behalten = new Uint8Array(pts.length); behalten[0] = behalten[pts.length - 1] = 1;
    const stapel = [[0, pts.length - 1]];
    while (stapel.length) {
      const [i, j] = stapel.pop(), A = pts[i], B = pts[j], dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy) || 1e-9;
      let m = -1, dm = tol;
      for (let k = i + 1; k < j; k++) { const d = Math.abs((pts[k][0] - A[0]) * dy - (pts[k][1] - A[1]) * dx) / l; if (d > dm) { dm = d; m = k; } }
      if (m >= 0) { behalten[m] = 1; stapel.push([i, m], [m, j]); }
    }
    return pts.filter((p, i) => behalten[i]);
  }
  function rund(pts) {
    const P = verdichten(pts.filter((p, i) => !i || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > 0.05), 0.25);
    if (P.length < 3) return P;
    const aus = [P[0]];
    for (let i = 1; i < P.length - 1; i++) {
      const A = P[i - 1], B = P[i], C = P[i + 1];
      const l1 = Math.hypot(B[0] - A[0], B[1] - A[1]), l2 = Math.hypot(C[0] - B[0], C[1] - B[1]);
      const u1 = [(B[0] - A[0]) / l1, (B[1] - A[1]) / l1], u2 = [(C[0] - B[0]) / l2, (C[1] - B[1]) / l2];
      const th = Math.acos(klemm(u1[0] * u2[0] + u1[1] * u2[1], -1, 1));
      if (th < 0.03) { aus.push(B); continue; }
      const t = Math.min(12 * Math.tan(th / 2), 0.48 * l1, 0.48 * l2, 1.5 / Math.tan(th / 4));
      const r = t / Math.tan(th / 2), links = u1[0] * u2[1] - u1[1] * u2[0] > 0 ? 1 : -1;
      const P1 = [B[0] - u1[0] * t, B[1] - u1[1] * t], M = [P1[0] - u1[1] * r * links, P1[1] + u1[0] * r * links];
      const a0 = Math.atan2(P1[1] - M[1], P1[0] - M[0]), n = Math.max(2, Math.ceil(th * r / 0.5));
      for (let k = 0; k <= n; k++) { const a = a0 + links * th * k / n; aus.push([M[0] + Math.cos(a) * r, M[1] + Math.sin(a) * r]); }
    }
    aus.push(P[P.length - 1]);
    return aus;
  }
  /* Strecke fürs Auto: abrunden, dann dreimal gleitend mitteln (±2,5 m) – so bleiben auch an den engen Knicken der
     Dorfwege (Bögen um die Häuser) keine Ecken, die kein Auto fahren kann. Anfang und Ende bleiben, wo sie sind. */
  /* FASSUNG 830 — vorher um Hindernisse herum (umfahren), danach nie in eines hinein (wegschieben); ohne = das Haus, vor
     dem das Auto halten will (dort hält fussIm es auf Abstand) */
  function fahrStrecke(pts, ohne) {
    pts = umfahren(pts, ohne);
    let W = strecke(rund(pts));
    for (let r = 0; r < 3 && W.n > 10; r++) {
      const X = W.X, Y = W.Y, n = W.n, neu = [];
      for (let i = 0; i <= n; i++) {
        const k = Math.min(5, i, n - i);
        let sx = 0, sy = 0; for (let j = i - k; j <= i + k; j++) { sx += X[j]; sy += Y[j]; }
        neu.push([sx / (2 * k + 1), sy / (2 * k + 1)]);
      }
      W = strecke(neu);
    }
    return wegschieben(W, ohne);
  }

  /* ---------------- FASSUNG 830: Hindernisse umfahren ----------------
     XANDER (wörtlich): „die Autos … fahren durch den Brunnen durch". Die Wege des Dorfes laufen über den Markt – mitten
     durch Brunnen, Bänke, Buden, den Christbaum – und wer Schmuck oder ein Wahrzeichen auf einen Weg stellt (oder ein Haus
     dorthin versetzt), dem fuhren die Autos einfach hindurch. Jetzt ist jedes Ding mit Grundfläche (Schmuck, Wahrzeichen,
     Kulisse, Häuser; nicht Brücken, Laternen, Flaches und Bäume) ein Hindernis:
       · umfahren(): führt die Strecke in ein Hindernis (Rechteck fuss × stufe, gedreht, mit Abstand FREI – so bleibt auch
         ein Auto rechts vom Weg frei), geht sie außen herum – über die Ecken, auf der kürzeren Seite, die nicht in ein
         anderes Ding, einen Rathausflügel oder ins Wasser führt. Dinge, zwischen denen kein Auto hindurchpasst (im Winter
         Christbaum, Buden, Bänke und Krippe auf dem Markt), werden als ein Haufen umfahren (ihre konvexe Hülle). Endet die
         Fahrt in einem Hindernis (Portal hinter dem Brunnen, Markt unter dem Christbaum), führt sie außen herum bis an
         die Stelle des Randes, die dem Ziel am nächsten ist; beginnt sie daneben, geht es zuerst auf kurzem Weg hinaus.
       · ausDingen(): streift der Wagenkasten beim Wenden doch einmal ein Ding, gleitet das Auto sanft daran entlang statt
         hindurch; wo gewendet wird, hält es so weit davor, dass das Wenden frei ist (wendeTreffer).
       · wegschieben(): was das Abrunden danach doch wieder hineinzieht, wird bis an den Rand geschoben.
       · abweichung()/spurBereich(): am Hindernis gilt die umfahrene Strecke als Weg, und die Spur bleibt so schmal, dass
         das Auto das Ding nicht streift.
       · der Halt (bis) und das Hinstellen liegen nie in einem Hindernis. */
  const HALB_MAX = 1.05;                         // halbe Breite des breitesten Autos (Batmobil)
  const FREI = HALB_MAX + SEITE + 1.0;           // ≈ 2,5 m zwischen Strecke und Rand von Schmuck und Wahrzeichen (auch das lange Batmobil schwenkt im Bogen nicht hinein)
  const FREI_HAUS = HALB_MAX + SEITE + 0.1;      // an Häusern: nur, wenn der Weg (fast) hindurchführt
  const lokal = (H, x, y) => { const dx = x - H.x, dy = y - H.y; return [dx * H.c + dy * H.s, -dx * H.s + dy * H.c]; };
  const weltVon = (H, u, v) => [H.x + u * H.c - v * H.s, H.y + u * H.s + v * H.c];
  const eckenVon = (H, r) => [[H.hw + r, H.hd + r], [-H.hw - r, H.hd + r], [-H.hw - r, -H.hd - r], [H.hw + r, -H.hd - r]].map((q) => weltVon(H, q[0], q[1]));
  /* konvexe Hülle (gegen den Uhrzeigersinn) */
  function huelle(p) {
    p = p.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const kr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const u = [], o = [];
    for (const q of p) { while (u.length >= 2 && kr(u[u.length - 2], u[u.length - 1], q) <= 0) u.pop(); u.push(q); }
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (o.length >= 2 && kr(o[o.length - 2], o[o.length - 1], q) <= 0) o.pop(); o.push(q); }
    return u.slice(0, -1).concat(o.slice(0, -1));
  }
  /* liegen zwei Vierecke (Ecken im Umlauf) übereinander? (Trennachsen) */
  function ueber(A, B) {
    for (const P of [A, B]) for (let i = 0; i < P.length; i++) {
      const p = P[i], q = P[(i + 1) % P.length], nx = q[1] - p[1], ny = p[0] - q[0];
      let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
      for (const e of A) { const d = e[0] * nx + e[1] * ny; if (d < a0) a0 = d; if (d > a1) a1 = d; }
      for (const e of B) { const d = e[0] * nx + e[1] * ny; if (d < b0) b0 = d; if (d > b1) b1 = d; }
      if (a1 < b0 || b1 < a0) return false;
    }
    return true;
  }
  function inHuelle(Hu, x, y) {
    for (let i = 0; i < Hu.length; i++) { const p = Hu[i], q = Hu[(i + 1) % Hu.length]; if ((q[0] - p[0]) * (y - p[1]) - (q[1] - p[1]) * (x - p[0]) < 0) return false; }
    return true;
  }
  function huelleAbstand(Hu, x, y) {
    if (inHuelle(Hu, x, y)) return 0;
    let d = Infinity;
    for (let i = 0; i < Hu.length; i++) { const a = Hu[i], b = Hu[(i + 1) % Hu.length], dx = b[0] - a[0], dy = b[1] - a[1], t = klemm(((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1), 0, 1); d = Math.min(d, Math.hypot(x - a[0] - dx * t, y - a[1] - dy * t)); }
    return d;
  }
  let hindMerk = null, hindStand = -1;
  function hindernisse() {
    if (hindMerk && hindStand === SZ.stand + ":" + SZ.jahr) return hindMerk;
    const aus = [];
    for (const o of SZ.objekte) {
      /* (Zäune nicht: sie säumen Weiden und Wege, ein Weg durch ein Tor ist gewollt) */
      if (!o.fuss || o.versteckt || o.geist || o.art === "natur" || SZ.flach(o) || /^d_(bruecke|laterne|zaun)/.test(o.bild || "")) continue;
      const k = o.stufe || 1, w = (o.dreh || 0) * Math.PI / 2, haus = o.art === "haus";
      const H = { o: o, x: o.x, y: o.y, c: Math.cos(w), s: Math.sin(w), hw: o.fuss[0] * k / 2, hd: o.fuss[1] * k / 2, rand: haus ? FREI_HAUS : FREI, haus: haus };
      /* Häuser aus Flügeln (Rathaus): ihr Rechteck deckt den Platz vor dem Portal – dort zählen nur die Flügel, und nur beim
         Wählen der Seite (die Wege des Dorfes führen nie hinein) */
      if (o.grundriss) { const oc = Math.cos(w), os = Math.sin(w); H.teile = o.grundriss.map((poly) => poly.map((p) => [o.x + (p[0] * oc - p[1] * os) * k, o.y + (p[0] * os + p[1] * oc) * k])); }
      H.r = Math.hypot(H.hw, H.hd) + H.rand + 2;
      aus.push(H);
    }
    /* Haufen: Dinge, zwischen denen kein Auto mit Abstand hindurchpasst (Markt im Winter: Christbaum, Buden, Bänke, Krippe),
       werden als Ganzes umfahren – außen um ihre gemeinsame konvexe Hülle. Häuser bleiben für sich (vor ihnen wird gehalten). */
    const frei = aus.filter((H) => !H.teile), n = frei.length, eltern = frei.map((H, i) => i);
    const wurzel = (i) => (eltern[i] === i ? i : (eltern[i] = wurzel(eltern[i])));
    const E = frei.map((H) => eckenVon(H, H.rand));
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      if (frei[i].haus || frei[j].haus || Math.hypot(frei[i].x - frei[j].x, frei[i].y - frei[j].y) > frei[i].r + frei[j].r) continue;
      if (ueber(E[i], E[j])) eltern[wurzel(i)] = wurzel(j);
    }
    const gruppen = new Map();
    frei.forEach((H, i) => { const w = wurzel(i); if (!gruppen.has(w)) gruppen.set(w, []); gruppen.get(w).push(H); });
    const haufen = [];
    for (const glieder of gruppen.values()) {
      const treff = huelle([].concat(...glieder.map((H) => eckenVon(H, H.rand)))), um = huelle([].concat(...glieder.map((H) => eckenVon(H, H.rand + 1))));
      let cx = 0, cy = 0; for (const p of um) { cx += p[0]; cy += p[1]; } cx /= um.length; cy /= um.length;
      let r = 0; for (const p of um) r = Math.max(r, Math.hypot(p[0] - cx, p[1] - cy));
      const hf = { glieder: glieder, treff: treff, um: um, x: cx, y: cy, r: r + 2 };
      for (const H of glieder) H.haufen = hf;
      haufen.push(hf);
    }
    aus.haufen = haufen;
    hindMerk = aus; hindStand = SZ.stand + ":" + SZ.jahr;
    return aus;
  }
  AU.hindernisse = hindernisse;
  function imKasten(H, x, y, r) { const q = lokal(H, x, y); return Math.abs(q[0]) < H.hw + r && Math.abs(q[1]) < H.hd + r; }
  function inFluegeln(H, x, y, r) {
    for (const poly of H.teile) {
      let innen = false, dd = Infinity;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const a = poly[i], b = poly[j];
        if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) innen = !innen;
        const dx = b[0] - a[0], dy = b[1] - a[1], t = klemm(((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1), 0, 1);
        dd = Math.min(dd, Math.hypot(x - a[0] - dx * t, y - a[1] - dy * t));
      }
      if (innen || dd < r) return true;
    }
    return false;
  }
  /* Abstand eines Punktes vom Rechteck (innen 0) */
  function randAbstand(H, x, y) { const q = lokal(H, x, y); return Math.hypot(Math.max(0, Math.abs(q[0]) - H.hw), Math.max(0, Math.abs(q[1]) - H.hd)); }
  function nahe(liste, pts, extra) {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const p of pts) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
    return liste.filter((H) => H.x + H.r + extra > x0 && H.x - H.r - extra < x1 && H.y + H.r + extra > y0 && H.y - H.r - extra < y1);
  }
  function dicht(pts, d) {
    const aus = [pts[0].slice()];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / d));
      for (let k = 1; k <= n; k++) aus.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
    }
    return aus;
  }
  /* Ist ein Punkt für ein Auto verbaut (anderes Hindernis, Rathausflügel, Wasser)? – zum Wählen der Seite */
  function verbaut(liste, hf, x, y) {
    for (const G of liste) {
      if (G.haufen === hf && hf) continue;
      if (G.teile ? inFluegeln(G, x, y, HALB_MAX + 0.3) : imKasten(G, x, y, HALB_MAX + 0.3)) return true;
    }
    const B = ST.boden;
    return !!(B && B.wert && B.wert(x, y, 1) > 0.3);
  }
  /* von e (vor dem Haufen) nach x (dahinter) außen herum: über die Ecken seiner Hülle (mit 1 m Zugabe), auf der kürzeren
     Seite, die nicht in ein anderes Ding, einen Rathausflügel oder ins Wasser führt */
  function herum(hf, e, x, liste) {
    const U = hf.um, TAU2 = Math.PI * 2, wink = (p) => ((Math.atan2(p[1] - hf.y, p[0] - hf.x) % TAU2) + TAU2) % TAU2;
    const we = wink(e), wx = wink(x), eckW = U.map(wink);
    const weg = (dir) => {
      const span = dir > 0 ? ((wx - we) % TAU2 + TAU2) % TAU2 : ((we - wx) % TAU2 + TAU2) % TAU2, l2 = [];
      for (let k = 0; k < U.length; k++) {
        const d = dir > 0 ? ((eckW[k] - we) % TAU2 + TAU2) % TAU2 : ((we - eckW[k]) % TAU2 + TAU2) % TAU2;
        if (d > 1e-6 && d < span) l2.push([d, k]);
      }
      l2.sort((u, v) => u[0] - v[0]);
      const pts = l2.map((z) => U[z[1]].slice());
      let L = 0, strafe = 0, alt = e;
      for (const p of pts.concat([x])) {
        L += Math.hypot(p[0] - alt[0], p[1] - alt[1]);
        for (const t of [0.5, 1]) if (verbaut(liste, hf, alt[0] + (p[0] - alt[0]) * t, alt[1] + (p[1] - alt[1]) * t)) strafe += 1000;
        alt = p;
      }
      return { pts: pts, kosten: L + strafe };
    };
    const a = weg(1), b = weg(-1);
    return (a.kosten <= b.kosten ? a : b).pts;
  }
  /* nächster Punkt auf dem Rand einer Hülle */
  function aufHuelle(Hu, x, y) {
    let best = null, d0 = Infinity;
    for (let i = 0; i < Hu.length; i++) {
      const a = Hu[i], b = Hu[(i + 1) % Hu.length], dx = b[0] - a[0], dy = b[1] - a[1], t = klemm(((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1), 0, 1);
      const px = a[0] + dx * t, py = a[1] + dy * t, d = Math.hypot(x - px, y - py);
      if (d < d0) { d0 = d; best = [px, py]; }
    }
    return best;
  }
  function umfahren(pts, ohne) {
    if (!pts || pts.length < 2) return pts;
    const alle = hindernisse(), liste = nahe(alle, pts, 4);
    const haufen = alle.haufen.filter((hf) => liste.some((H) => H.haufen === hf) && !(hf.glieder.length === 1 && hf.glieder[0].o === ohne));
    if (!haufen.length) return pts;
    let P = dicht(pts, 0.5);
    const drin = (hf, p) => Math.abs(p[0] - hf.x) < hf.r && Math.abs(p[1] - hf.y) < hf.r && inHuelle(hf.treff, p[0], p[1]);
    const erledigt = new Set();
    for (let runde = 0; runde < 8; runde++) {
      let neu = null;
      for (const hf of haufen) {
        if (erledigt.has(hf)) continue;
        let i0 = -1;
        /* steht das Auto selbst schon am Rand (P[0] im Abstand): herum erst dort, wo die Strecke das Ding selbst träfe */
        if (drin(hf, P[0])) {
          erledigt.add(hf);
          const hart = (q) => hf.glieder.some((H) => imKasten(H, q[0], q[1], HALB_MAX + 1.2));
          let j = -1; for (let i = 1; i < P.length && drin(hf, P[i]); i++) if (hart(P[i])) { j = i; break; }
          if (j < 0) continue;
          let k = j; while (k + 1 < P.length && drin(hf, P[k + 1])) k++;
          const ende = k === P.length - 1 ? aufHuelle(hf.um, P[k][0], P[k][1]) : P[k + 1];
          neu = P.slice(0, j).concat(herum(hf, P[j - 1], ende, liste), k === P.length - 1 ? [ende] : P.slice(k + 1));
          break;
        }
        for (let i = 1; i < P.length; i++) if (drin(hf, P[i])) { i0 = i; break; }
        if (i0 < 0) continue;
        let i1 = i0; while (i1 + 1 < P.length && drin(hf, P[i1 + 1])) i1++;
        const letzt = i1 === P.length - 1;
        /* endet die Fahrt darin (das Portal hinter dem Brunnen, der Markt unter dem Christbaum): außen herum bis an die
           Stelle des Randes, die dem Ziel am nächsten ist – dort hält das Auto */
        const ende = letzt ? aufHuelle(hf.um, P[i1][0], P[i1][1]) : P[i1 + 1];
        neu = P.slice(0, i0).concat(herum(hf, P[i0 - 1], ende, liste), letzt ? [ende] : P.slice(i1 + 1));
        if (letzt) erledigt.add(hf);
        break;
      }
      if (!neu) break;
      P = dicht(neu, 0.5);
    }
    return P;
  }
  function wegschieben(W, ohne) {
    const liste = nahe(hindernisse(), [[Math.min(...W.X), Math.min(...W.Y)], [Math.max(...W.X), Math.max(...W.Y)]], 2).filter((H) => !H.teile && H.o !== ohne);
    if (!liste.length) return W;
    const X = Array.from(W.X), Y = Array.from(W.Y);
    const schieben = () => {
      let n = 0;
      for (let i = 1; i < X.length - 1; i++) for (const H of liste) {
        const r = H.rand - 0.35, q = lokal(H, X[i], Y[i]), eu = H.hw + r - Math.abs(q[0]), ev = H.hd + r - Math.abs(q[1]);
        if (eu <= 0 || ev <= 0 || Math.min(eu, ev) > 1.2) continue;   // (nur flache Anschnitte – tiefer hinein führt umfahren nie)
        if (eu < ev) q[0] = Math.sign(q[0] || 1) * (H.hw + r); else q[1] = Math.sign(q[1] || 1) * (H.hd + r);
        const p = weltVon(H, q[0], q[1]); X[i] = p[0]; Y[i] = p[1]; n++;
      }
      return n;
    };
    if (!schieben()) return W;
    /* leicht glätten, dann noch einmal schieben */
    for (let i = 2; i < X.length - 2; i++) { X[i] = (X[i - 1] + X[i] + X[i + 1]) / 3; Y[i] = (Y[i - 1] + Y[i] + Y[i + 1]) / 3; }
    schieben();
    return strecke(X.map((x, i) => [x, Y[i]]));
  }
  /* steht ein Auto bei s auf der Strecke W (Spur rechts) in einem Hindernis? */
  function imHindernis(W, s, A, ohne, rand) {
    const liste = hindernisse();
    for (let d = -A.hinten; d <= A.vorn + 0.01; d += 0.7) {
      const p = an(W, s + d);
      for (const H of liste) {
        if (H.teile || H.o === ohne || Math.abs(H.x - p.x) > H.r || Math.abs(H.y - p.y) > H.r) continue;
        if (imKasten(H, p.x - p.ty * SEITE, p.y + p.tx * SEITE, rand != null ? rand : A.halb + 0.2)) return true;
      }
    }
    return false;
  }
  /* Letzte Sicherung: streift der Wagenkasten doch ein Hindernis (enges Wenden an einer Spitzkehre neben dem Brunnen, ein
     Bogen dicht an einer Bank), wird das Auto um genau so viel zur Seite geschoben, wie es eindringt (kleinste Trennachse) –
     es gleitet am Ding entlang statt hindurch. */
  function ausDingen(a, dt, grenze) {
    let rest = grenze != null ? grenze : 0.4 * (dt || 0.05) + 0.002;   // beim Wenden zusammen höchstens ≈ 0,45 m/s zur Seite: kein Ruck
    const liste = hindernisse(), A = a.A, c = Math.cos(a.h), s = Math.sin(a.h), R = Math.hypot(Math.max(A.vorn, A.hinten), A.halb) + 0.2;
    for (const H of liste) {
      if (H.teile || H.haus || Math.abs(H.x - a.x) > H.r + R || Math.abs(H.y - a.y) > H.r + R) continue;   // (Häuser: nur umfahren)
      const auto = [[A.vorn + 0.1, A.halb + 0.1], [A.vorn + 0.1, -A.halb - 0.1], [-A.hinten - 0.1, -A.halb - 0.1], [-A.hinten - 0.1, A.halb + 0.1]].map((p) => [a.x + p[0] * c - p[1] * s, a.y + p[0] * s + p[1] * c]);
      const ding = eckenVon(H, 0);
      let best = null;
      for (const ax of [[H.c, H.s], [-H.s, H.c], [c, s], [-s, c]]) {
        let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
        for (const p of auto) { const d = p[0] * ax[0] + p[1] * ax[1]; if (d < a0) a0 = d; if (d > a1) a1 = d; }
        for (const p of ding) { const d = p[0] * ax[0] + p[1] * ax[1]; if (d < b0) b0 = d; if (d > b1) b1 = d; }
        if (a1 <= b0 || b1 <= a0) { best = null; break; }   // getrennt
        const rechts = b1 - a0, links = a1 - b0, t = rechts < links ? rechts : -links;
        if (!best || Math.abs(t) < Math.abs(best.t)) best = { t: t, ax: ax };
      }
      if (best && Math.abs(best.t) < 1.5 && rest > 0) { const t = klemm(best.t, -rest, rest); rest -= Math.abs(t); a.x += best.ax[0] * t; a.y += best.ax[1] * t; a.geschoben = (a.geschoben || 0) + Math.abs(t); }
    }
  }
  /* Wie oft streift der Wagenkasten beim Wenden in drei Zügen (Richtung dir) ein Hindernis? (grob nachgefahren) */
  function wendeTreffer(a, dir, x, y, h, nebenWeg, ohne) {
    if (x == null) { x = a.x; y = a.y; h = a.h; }
    if (nebenWeg) {   // kommt das Auto beim Wenden weiter als 1,9 m vom Weg?
      const L = WENDE_R * Math.PI / 3;
      for (let zug = 0; zug < 3; zug++) for (let d = 0; d < L; d += 0.3) { h += dir * 0.3 / WENDE_R; const r = zug === 1 ? -1 : 1; x += Math.cos(h) * 0.3 * r; y += Math.sin(h) * 0.3 * r; if (AU.wegAbstand(x, y) > 1.9) return 1; }
      return 0;
    }
    const liste = hindernisse().filter((H) => !H.teile && !H.haus && H.o !== ohne && Math.hypot(H.x - x, H.y - y) < H.r + 8);
    if (!liste.length) return 0;
    const A = a.A, L = WENDE_R * Math.PI / 3;
    let n = 0;
    for (let zug = 0; zug < 3; zug++) for (let d = 0; d < L; d += 0.3) {
      h += dir * 0.3 / WENDE_R; const r = zug === 1 ? -1 : 1; x += Math.cos(h) * 0.3 * r; y += Math.sin(h) * 0.3 * r;
      const c = Math.cos(h), s = Math.sin(h);
      const auto = [[A.vorn, A.halb], [A.vorn, -A.halb], [-A.hinten, -A.halb], [-A.hinten, A.halb]].map((p) => [x + p[0] * c - p[1] * s, y + p[0] * s + p[1] * c]);
      for (const H of liste) if (ueber(auto, eckenVon(H, 0.1))) n++;
    }
    return n;
  }
  /* für Sonden: liegt der Punkt an einem Hindernis (dort weicht die Strecke vom Weg des Dorfes ab)? */
  AU.inUmfahrung = function (x, y, extra) {
    const e = extra == null ? 4 : extra;   // (2,5 m Band um die Hülle, dazu die Spur neben der Strecke)
    for (const hf of hindernisse().haufen) if (Math.abs(x - hf.x) < hf.r + e && Math.abs(y - hf.y) < hf.r + e && huelleAbstand(hf.um, x, y) < e) return true;
    return false;
  };
  /* Tempo je Streckenpunkt aus der Krümmung (Richtungswechsel über ±1,5 m) */
  /* dazu die Krümmung mit Vorzeichen (+ = Bogen nach rechts im Bild, dort ist rechts innen) */
  function kurvenTempo(W, V, kr) {
    const v = new Float32Array(W.n + 1);
    for (let i = 0; i <= W.n; i++) {
      const A = an(W, W.S[i] - 1.5), B = an(W, W.S[i] + 1.5);
      const dw = winkel(Math.atan2(B.ty, B.tx) - Math.atan2(A.ty, A.tx)), l = Math.max(0.5, Math.min(3, W.S[i] + 1.5, W.L - W.S[i] + 1.5));
      /* dazu die Krümmung dicht an der Stelle (±0,75 m): enge Knicke bremsen, und die Spur braucht sie */
      const C = an(W, W.S[i] - 0.75), D2 = an(W, W.S[i] + 0.75), lk = Math.max(0.3, Math.min(1.5, W.S[i] + 0.75, W.L - W.S[i] + 0.75));
      const kn = winkel(Math.atan2(D2.ty, D2.tx) - Math.atan2(C.ty, C.tx)) / lk;
      const k = Math.max(Math.abs(dw) / l, Math.abs(kn));
      v[i] = k > 1e-4 ? Math.min(V, Math.sqrt(QUER / k)) : V;
      if (kr) kr[i] = kn;
    }
    return v;
  }

  /* ---------------- Wegenetz der Autos ----------------
     Knoten = Punkte der Wege des Dorfes (fast gleiche Punkte = Kreuzung). Die Straße der Pferdebahn gehört der Bahn;
     genommen wird das größte zusammenhängende Stück. */
  let netz = null, fwNetz = null;
  function netzBauen() {
    const D = ST.dorf || {}, P = [], N = [], raster = new Map();
    const finde = (x, y) => {
      const gx = Math.round(x), gy = Math.round(y);
      for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) {
        const l = raster.get((gx + a) + "," + (gy + b)); if (!l) continue;
        for (const i of l) if (Math.hypot(P[i][0] - x, P[i][1] - y) < 0.8) return i;
      }
      P.push([x, y]); N.push([]);
      const k = gx + "," + gy; if (!raster.has(k)) raster.set(k, []); raster.get(k).push(P.length - 1);
      return P.length - 1;
    };
    const kante = (a, b) => { if (a === b || N[a].indexOf(b) >= 0) return; N[a].push(b); N[b].push(a); };
    let linien = [];
    if (Array.isArray(D.WEGE) && D.WEGE.length) linien = D.WEGE.filter((w) => w !== D.PFERDEBAHN);
    else if (ST.fuhrwerk && ST.fuhrwerk.netz) linien = ST.fuhrwerk.netz.linien || [];
    for (const w of linien) { let v = finde(w[0][0], w[0][1]); for (let i = 1; i < w.length; i++) { const n = finde(w[i][0], w[i][1]); kante(v, n); v = n; } }
    /* größtes zusammenhängendes Stück */
    const teil = new Int32Array(P.length).fill(-1), groesse = [];
    for (let i = 0; i < P.length; i++) {
      if (teil[i] >= 0) continue;
      const nr = groesse.length, st = [i]; teil[i] = nr; let n = 0;
      while (st.length) { const u = st.pop(); n++; for (const v of N[u]) if (teil[v] < 0) { teil[v] = nr; st.push(v); } }
      groesse.push(n);
    }
    const gross = groesse.indexOf(Math.max(0, ...groesse));
    netz = { P: P, N: N, im: (i) => teil[i] === gross, linien: linien, W: linien.map((w) => strecke(w)) };
    AU.netz = netz;
  }
  function knotenBei(x, y) {
    let b = -1, d0 = Infinity;
    for (let i = 0; i < netz.P.length; i++) { if (!netz.im(i)) continue; const d = Math.hypot(netz.P[i][0] - x, netz.P[i][1] - y); if (d < d0) { d0 = d; b = i; } }
    return { i: b, d: d0 };
  }
  function weg(a, b) {
    const n = netz.P.length, dist = new Float64Array(n).fill(Infinity), vor = new Int32Array(n).fill(-1), fertig = new Uint8Array(n);
    dist[a] = 0;
    for (;;) {
      let u = -1, du = Infinity;
      for (let i = 0; i < n; i++) if (!fertig[i] && dist[i] < du) { du = dist[i]; u = i; }
      if (u < 0 || u === b) break;
      fertig[u] = 1;
      for (const v of netz.N[u]) { const d = du + Math.hypot(netz.P[u][0] - netz.P[v][0], netz.P[u][1] - netz.P[v][1]); if (d < dist[v]) { dist[v] = d; vor[v] = u; } }
    }
    if (!isFinite(dist[b])) return null;
    const aus = []; for (let v = b; v >= 0; v = vor[v]) aus.push(v);
    return aus.reverse();
  }
  /* Abstand zum nächsten Weg des Autonetzes (für Sonden) */
  AU.wegAbstand = function (x, y) { let d = Infinity; if (!netz) return d; for (const W of netz.W) d = Math.min(d, fusspunkt(W, x, y).d); return d; };

  /* ---------------- Ziele: vor Häusern, Wahrzeichen, Markt ---------------- */
  function drin(o, x, y, rand) {
    const w = (o.dreh || 0) * Math.PI / 2, c = Math.cos(w), s = Math.sin(w), dx = x - o.x, dy = y - o.y;
    const lx = dx * c + dy * s, ly = -dx * s + dy * c, k = o.stufe || 1;
    return Math.abs(lx) < o.fuss[0] * k / 2 + rand && Math.abs(ly) < o.fuss[1] * k / 2 + rand;
  }
  let ziele = [];
  function zieleFinden() {
    ziele = [];
    const genommen = {};
    for (const o of SZ.objekte) {
      if (!(o.art === "haus" || o.art === "wunder") || !o.fuss || o.versteckt) continue;
      /* vor Mühle und Bäckerei halten die Kornwagen – dort parken die Autos nicht */
      if (o.spiel === "muehle" || o.spiel === "baeckerei") continue;
      /* vor die Front (dorf.js legt den Weg 8–9 m vor die Hausmitte) */
      const r = ((o.dreh || 0) * 90 + 90) * Math.PI / 180, d = o.art === "haus" ? (o.spiel === "muehle" ? 9 : 8) : (o.fuss[0] + o.fuss[1]) * (o.stufe || 1) / 4 + 3;
      const k = knotenBei(o.x + Math.cos(r) * d, o.y + Math.sin(r) * d);
      if (k.i < 0 || k.d > 6 || genommen[k.i]) continue;
      genommen[k.i] = 1;
      ziele.push({ i: k.i, haus: o, name: o.name || o.spiel || o.bild });
    }
    const M = (ST.dorf && ST.dorf.MARKT) || [0, 0], km = knotenBei(M[0], M[1]);
    if (km.i >= 0 && !genommen[km.i]) ziele.push({ i: km.i, haus: null, name: "Markt" });
    AU.ziele = ziele;
  }

  /* ---------------- Aufbauen ---------------- */
  let gebaut = null, netzSig = "";
  function aufbauen() {
    fwNetz = ST.fuhrwerk && ST.fuhrwerk.netz;
    const D = ST.dorf || {}, W0 = (D.WEGE || []).filter((w) => w !== D.PFERDEBAHN);
    /* Im Spiel kommt der Spielstand oft neu (die Stadt baut sich neu auf): sind die Wege dieselben, fahren die Autos
       einfach weiter, ohne Ruck */
    const sig = W0.length + ":" + W0.reduce((s, w) => s + w.length + w[0][0] * 3 + w[0][1] * 7 + w[w.length - 1][0] * 11, 0).toFixed(1);
    const gleich = netz && sig === netzSig && netz.P.length;
    netzSig = sig;
    if (!gleich) netzBauen();
    zieleFinden();
    const alt = AU.liste; AU.liste = [];
    AU.grund = !netz.P.length ? "kein Wegenetz" : ziele.length < 2 ? "zu wenig Ziele" : "";
    if (AU.grund) return;
    const soll = sollFahren();
    soll.forEach((id, n) => {
      const war = alt.find((a) => a.id === id);
      if (war && war.gast) { war.gast = null; war.fertig = false; }   // FASSUNG 830 — der Gast wird zum eigenen Auto (gekauft, Probefahrt)
      if (war && gleich) {
        /* Ziel noch da? sonst nach dem nächsten Halt ein neues */
        if (war.ziel) { const z = ziele.find((x) => x.i === war.ziel.i); if (z) war.ziel = z; else war.ziel = Object.assign({}, war.ziel, { haus: null }); }
        AU.liste.push(war); return;
      }
      /* wer schon fuhr, fährt weiter (neu geplant ab seinem Platz) */
      const a = { id: id, A: ARTEN[id], v: 0, s: 0, W: null, x: 0, y: 0, h: 0, seite: 0, ph: n * 0.37, zustand: "haelt", halt: 1 + n * 1.5, ziel: null, knoten: -1,
        warte: 0, geist: 0, rueck: false, gas: 0, bremst: 0, weg: 0 };
      if (war && war.x) { Object.assign(a, { x: war.x, y: war.y, h: war.h, ph: war.ph }); a.knoten = knotenBei(a.x, a.y).i; }
      else {
        const wo = AU.startBei && AU.startBei[id];
        if (wo) { const k = knotenBei(wo.x, wo.y); a.knoten = k.i; delete AU.startBei[id]; }
        else {
          /* FASSUNG 830 — nicht in ein Hindernis stellen (im Winter steht auf dem Markt der Christbaum): dann das nächste Ziel */
          const k0 = Math.floor(ST.hash2(n, 3, 815) * ziele.length) + n * 5;
          for (let k = 0; k < ziele.length; k++) { a.knoten = ziele[(k0 + k) % ziele.length].i; if (hinstellen(a, a.knoten)) break; }
        }
        if (wo) hinstellen(a, a.knoten);
      }
      AU.liste.push(a);
    });
    /* FASSUNG 830 — ein Gast (Besuch am Tag) fährt weiter, solange die Wege dieselben sind */
    if (gleich) for (const g of alt) if (g.gast && !g.fertig && !AU.liste.some((a) => a.id === g.id)) AU.liste.push(g);
  }
  /* am Knoten stehen: 4,5 m davor auf einer seiner Kanten, Blick zum Knoten */
  function hinstellen(a, i) {
    const nb = netz.N[i].filter((j) => netz.im(j));
    const P = netz.P[i];
    let x = P[0], y = P[1], h = 0, frei = false;
    if (nb.length) {
      /* ein paar Punkte zurück auf der Kante (die Wege haben alle ~3 m einen Punkt) */
      let vor = i, j = nb[0], l = 0; const pts = [P];
      while (l < 14 && j >= 0) { const Q = netz.P[j]; l += Math.hypot(Q[0] - pts[pts.length - 1][0], Q[1] - pts[pts.length - 1][1]); pts.push(Q); const w = netz.N[j].filter((m) => m !== vor && netz.im(m)); vor = j; j = w.length === 1 ? w[0] : -1; }
      const W = strecke(pts.slice().reverse());
      /* FASSUNG 830 — nicht in ein Hindernis stellen (Markt unter dem Christbaum): dann ein Stück weiter zurück */
      let d = 4.5; while (d < W.L - 3 && imHindernis(W, W.L - d, a.A, null)) d += 1.5;
      const e = an(W, Math.max(0, W.L - Math.min(d, W.L)), 1.2);
      x = e.x; y = e.y; h = Math.atan2(e.ty, e.tx);
      frei = !imHindernis(W, W.L - Math.min(d, W.L), a.A, null);
    }
    a.x = x; a.y = y; a.h = h; a.seite = 0; a.W = null; a.v = 0;
    return frei;
  }

  /* ---------------- Fahrten ---------------- */
  function zielWaehlen(a) {
    /* FASSUNG 830 — ein Gast fährt ein Ziel an und dann wieder hinaus (zu einem Weg am Kartenrand) */
    if (a.gast) { if (a.gast.ziele > 0) a.gast.ziele--; else return { i: a.gast.raus, haus: null, name: "Ausfahrt", raus: true }; }
    const moegl = ziele.filter((z) => z.i !== a.knoten && !AU.liste.some((b) => b !== a && b.ziel && b.ziel.i === z.i));
    const liste = moegl.length ? moegl : ziele.filter((z) => z.i !== a.knoten);
    /* nicht immer ganz nah: unter den zufälligen Zielen eher eins mit etwas Weg */
    a.zaehl = (a.zaehl || 0) + 1;
    const r = ST.hash2(a.zaehl, a.id.length, 815 + Math.floor(AU.t));
    return liste[Math.floor(r * liste.length) % liste.length];
  }
  /* Strecke vom Standort zum Ziel; wenn sie zurück führt, erst wenden */
  /* Die nächste Fahrt planen – schon beim Heranfahren an den Halt (dann weiß das Auto, ob es wenden muss, und hält
     dafür in der Wegmitte). knoten: wo die Fahrt beginnt; x, y, h: wo und wie das Auto dann steht. */
  /* Spitzkehre im Weg (die Dorfwege sind ein Baum: an manchen Abzweigen geht es spitz zurück)? Dann fährt das Auto bis
     kurz davor, wendet und fährt den Rest. Gibt die Stelle (Punktnummer) der ersten Spitzkehre zurück oder −1. */
  function spitzkehre(pts) {
    const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    for (let k = 1; k < pts.length - 1; k++) {
      if (L[k] < 5 || L[L.length - 1] - L[k] < 3) continue;
      let i = k; while (i > 0 && L[k] - L[i] < 3) i--;
      let j = k; while (j < pts.length - 1 && L[j] - L[k] < 3) j++;
      const a1 = Math.atan2(pts[k][1] - pts[i][1], pts[k][0] - pts[i][0]), a2 = Math.atan2(pts[j][1] - pts[k][1], pts[j][0] - pts[k][0]);
      if (Math.abs(winkel(a2 - a1)) > 2.0) return k;
    }
    return -1;
  }
  /* eine Fahrt (Punkte ab dem Startknoten) – bis zur ersten Spitzkehre, der Rest kommt nach dem Wenden */
  function teilen(pts, z) {
    const k = spitzkehre(pts);
    if (k < 0) return { pts: pts, z: z };
    const knoten = knotenBei(pts[k][0], pts[k][1]).i;
    return { pts: pts.slice(0, k + 1), z: { i: knoten, haus: null, name: "Spitzkehre", kehre: { pts: pts.slice(k), z: z } } };
  }
  function planen(a, knoten, x, y, h, zFest, ptsFest) {
    const z = zFest || zielWaehlen(a); if (!z) return null;
    let pts = ptsFest;
    if (!pts) { const k = weg(knoten, z.i); if (!k || k.length < 2) return null; pts = k.map((i) => netz.P[i]); }
    pts = umfahren(pts, z.haus);   // FASSUNG 830 — um Brunnen, Bänke, Schmuck herum
    const T = teilen(pts, z);
    const W0 = fahrStrecke(T.pts.slice(), z.haus);
    const f = fusspunkt(W0, x, y, 12), p = an(W0, f.s, 1.2);
    const blick = Math.cos(winkel(Math.atan2(p.ty, p.tx) - h));
    /* der Weg führt zurück, am Auto vorbei: wenden, dann auf W0 ab dem Fußpunkt */
    if (f.d < 2.2 && blick < -0.3) return { z: T.z, wenden: true, W0: W0, pts: T.pts, endZ: z };
    return { z: T.z, wenden: false, W0: W0, pts: T.pts, endZ: z };
  }
  function losfahren(a) {
    let pl = a.plan && a.plan.z && (ziele.indexOf(a.plan.endZ) >= 0 || a.plan.kehre) ? a.plan : planen(a, a.knoten, a.x, a.y, a.h);
    a.plan = null;
    if (!pl) { a.halt = 3; return; }
    const z = pl.z;
    const ohne = (pl.endZ || z).haus || null;   // FASSUNG 830 — vor diesem Haus hält das Auto (kein Hindernis)
    const wenden = (nach) => {
      /* zu der Seite hin wenden, auf der die neue Strecke liegt (bei Spitzkehren der andere Ast) */
      const fq = fusspunkt(pl.W0, a.x, a.y, 16), q0 = an(pl.W0, fq.s), kr = Math.cos(a.h) * (q0.y - a.y) - Math.sin(a.h) * (q0.x - a.x);
      let dir = kr < -0.05 ? -1 : 1;
      /* FASSUNG 830 — streift das Wenden auf dieser Seite ein Hindernis (Spitzkehre neben dem Brunnen), dann zur anderen */
      /* (aber nicht, wenn das Auto dabei vom Pflaster käme – mehr als 1,9 m neben dem Weg) */
      if (wendeTreffer(a, dir) > wendeTreffer(a, -dir) && !wendeTreffer(a, -dir, null, null, null, true)) dir = -dir;
      a.wende = { zug: 0, rest: WENDE_R * Math.PI / 3, v: 0, dir: dir };
      a.zustand = "wendet"; a.W = null; a.nachWende = nach;
    };
    if (pl.wenden) { wenden({ W: pl.W0, z: z, ohne: ohne }); return; }
    /* steht das Auto schon auf dem Weg, dann ab dort; sonst vom Standort aus hinein (die Ecke wird rund) */
    const f = fusspunkt(pl.W0, a.x, a.y, 12), p = an(pl.W0, f.s, 1.2);
    if (f.d < 0.9 && Math.cos(winkel(Math.atan2(p.ty, p.tx) - a.h)) > 0.3) { fahrtBeginnen(a, pl.W0, f.s, z); return; }
    /* liegt der erste Knoten hinter dem Auto, erst wenden – dann vom Standort aus hinein */
    /* FASSUNG 830 — steht das Auto (fast) auf dem ersten Knoten, zählt der erste Punkt, der 2 m weg liegt (sonst begann die
       Strecke mit einem spitzen Knick zurück) */
    let N = pl.pts[0], dN = Math.hypot(N[0] - a.x, N[1] - a.y);
    if (dN <= 1) { const N2 = pl.pts.find((q) => Math.hypot(q[0] - a.x, q[1] - a.y) >= 2); if (N2) { N = N2; dN = Math.hypot(N[0] - a.x, N[1] - a.y); } }
    if (dN > 1 &&Math.cos(Math.atan2(N[1] - a.y, N[0] - a.x) - a.h) < -0.2) { wenden({ pts: pl.pts, z: z, ohne: ohne }); return; }
    fahrtBeginnen(a, fahrStrecke([[a.x, a.y]].concat(pl.pts), ohne), 0, z);
  }
  function fahrtBeginnen(a, W, s0, z) {
    const f = fusspunkt(W, a.x, a.y, s0 + 12, s0 - 3);
    const hAlt = a.h;
    a.kr = new Float32Array(W.n + 1);
    a.W = W; a.s = f.s; a.ziel = z; a.vk = kurvenTempo(W, a.A.V, a.kr); a.zustand = "faehrt"; a.rueck = false;
    /* Stelle und Spur genau so, wie lage() rechnet – dann steht das Auto nach dem Umsteigen auf den Zentimeter gleich */
    for (let k = 0; k < 3; k++) {
      const p = an(W, a.s, 0.9), dx = a.x - p.x, dy = a.y - p.y;
      a.s = klemm(a.s + dx * p.tx + dy * p.ty, 0, W.L); a.seite = dx * -p.ty + dy * p.tx;
    }
    /* die Blickrichtung springt nicht: der Unterschied zur neuen Strecke baut sich auf den ersten Metern ab */
    const p0 = an(W, a.s, 0.9); a.hq = winkel(hAlt - Math.atan2(p0.ty, p0.tx));
    /* Ende: 4,5 m vor dem Knoten (vor dem Haus; Platz für einen Bogen beim Weiterfahren und fürs Wenden), nicht in der Grundfläche des Hauses */
    let bis = Math.max(a.s + 1, W.L - (z.kehre ? 3 : 4.5));
    if (z.haus) { while (bis > a.s + 1 && fussIm(W, bis, a.A, z.haus)) bis -= 0.5; }
    /* FASSUNG 830 — und nie in einem Hindernis (Brunnen, Christbaum auf dem Markt …) */
    while (bis > a.s + 1 && imHindernis(W, bis, a.A, z.haus)) bis -= 0.5;
    /* an einer Spitzkehre (und oft auch nach dem Halt) wird gewendet: nicht so dicht an einem Hindernis, dass es der
       Wagenkasten dabei streift – an einer Spitzkehre bis 12 m früher halten, sonst bis 4 m */
    /* (frei heißt: in eine Richtung ohne Streifen und ohne vom Pflaster zu kommen; findet sich so keine Stelle, bleibt der Halt) */
    const bis0 = bis; let frei = false;
    for (let k = 0, kmax = z.kehre ? 12 : 4; k < kmax && bis > a.s + 1; k++) {
      const e = an(W, bis, 1.2), ex = e.x - e.ty * SEITE, ey = e.y + e.tx * SEITE, eh = Math.atan2(e.ty, e.tx);
      if ([1, -1].some((d) => !wendeTreffer(a, d, ex, ey, eh) && !wendeTreffer(a, d, ex, ey, eh, true))) { frei = true; break; }
      bis -= 1;
    }
    if (!frei) bis = bis0;
    a.bis = bis;
    a.dev = abweichung(W);
    a.plan = null;
    /* FASSUNG 830 — steht das Auto neben dem Anfang der Strecke (nach dem Wenden), bleibt es, wo es ist: der Rest wird auf
       den ersten 1,5 m abgebaut, statt dass es einen Ruck macht */
    const x0 = a.x, y0 = a.y; a.rest = null;
    lage(a, 0, 0);
    if (Math.hypot(a.x - x0, a.y - y0) > 0.005) { a.rest = { x: x0 - a.x, y: y0 - a.y, weg: 0 }; a.x = x0; a.y = y0; }
  }
  /* Wie weit liegt die (abgerundete) Strecke neben den Wegen des Dorfes? + = rechts (je Streckenpunkt).
     Damit bleibt das Auto samt Spur und Ausweichen immer unter 2 m vom Weg. */
  function abweichung(W) {
    const dev = new Float32Array(W.n + 1);
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (let i = 0; i <= W.n; i++) { x0 = Math.min(x0, W.X[i]); x1 = Math.max(x1, W.X[i]); y0 = Math.min(y0, W.Y[i]); y1 = Math.max(y1, W.Y[i]); }
    const nah = netz.W.filter((V) => { for (let i = 0; i <= V.n; i += 4) if (V.X[i] > x0 - 8 && V.X[i] < x1 + 8 && V.Y[i] > y0 - 8 && V.Y[i] < y1 + 8) return true; return false; });
    dev.quer = new Float32Array(W.n + 1);
    for (let i = 0; i <= W.n; i++) {
      let best = null;
      for (const V of nah) { const f = fusspunkt(V, W.X[i], W.Y[i]); if (!best || f.d < best.d) best = { d: f.d, V: V, s: f.s }; }
      if (!best) continue;
      const q = an(best.V, best.s), p = an(W, W.S[i]), dx = W.X[i] - q.x, dy = W.Y[i] - q.y;
      dev[i] = dx * -p.ty + dy * p.tx;           // quer zur Fahrtrichtung (+ = rechts)
      dev.quer[i] = Math.abs(dx * p.tx + dy * p.ty);   // längs (an Abzweigen liegt der nächste Weg schräg)
    }
    /* FASSUNG 830 — an einem Hindernis gilt die (umfahrene) Strecke selbst als Weg; die Spur bleibt dort so schmal, dass
       das Auto das Ding nicht streift (dev.eng: größter Abstand der Automitte von der Strecke) */
    dev.eng = new Float32Array(W.n + 1).fill(9);
    const hind = nahe(hindernisse(), [[x0, y0], [x1, y1]], 4).filter((H) => !H.teile);
    const hfs = [...new Set(hind.map((H) => H.haufen))];
    if (hind.length) for (let i = 0; i <= W.n; i++) {
      const x = W.X[i], y = W.Y[i];
      for (const hf of hfs) if (Math.abs(x - hf.x) < hf.r + 3 && Math.abs(y - hf.y) < hf.r + 3 && huelleAbstand(hf.um, x, y) < 2.5) { dev[i] = 0; dev.quer[i] = 0; }
      for (const H of hind) {
        const d = randAbstand(H, x, y);
        if (d >= H.rand + 2.5) continue;
        dev[i] = 0; dev.quer[i] = 0;
        dev.eng[i] = Math.min(dev.eng[i], Math.max(0.3, d - HALB_MAX - 0.15));
      }
    }
    return dev;
  }
  /* erlaubte Spur um die Stelle s (s0 … s1): so, dass die Mitte des Autos höchstens R vom Weg des Dorfes entfernt
     bleibt – auch dort, wo die abgerundete Strecke innen abkürzt. Dazu in engen Bögen innen nie weiter als der halbe
     Halbmesser (sonst liefe das Auto rückwärts). Gibt [links, rechts] zurück (+ = rechts). */
  function spurBereich(a, s0, s1, R) {
    let lo = -9, hi = 9;
    for (let i = Math.max(0, Math.floor(s0 * 2) - 2); i <= a.W.n && a.W.S[i] <= s1; i++) {
      if (a.W.S[i] < s0) continue;
      const w = Math.sqrt(Math.max(0, R * R - a.dev.quer[i] * a.dev.quer[i]));
      hi = Math.min(hi, w - a.dev[i]); lo = Math.max(lo, -w - a.dev[i]);
      if (a.dev.eng) { hi = Math.min(hi, a.dev.eng[i]); lo = Math.max(lo, -a.dev.eng[i]); }   // FASSUNG 830
      if (a.kr[i] > 0.02) hi = Math.min(hi, 0.5 / a.kr[i]);
      if (a.kr[i] < -0.02) lo = Math.max(lo, -0.5 / -a.kr[i]);
    }
    return lo <= hi ? [lo, hi] : [(lo + hi) / 2, (lo + hi) / 2];
  }
  function fussIm(W, s, A, o) {
    /* FASSUNG 830 — vor einem Wahrzeichen mit dem ganzen Wagenkasten (und etwas Luft zum Wenden) davor */
    const r = o.art === "haus" ? A.halb * 0.6 : A.halb + 0.8;
    for (let d = -A.hinten; d <= A.vorn + 0.01; d += 0.7) { const p = an(W, s + d); if (drin(o, p.x, p.y, r)) return true; }
    return false;
  }

  /* ---------------- Wer steht im Weg? ---------------- */
  /* Umrisse aller Fahrzeuge (Mitte, Richtung, vorn, hinten, halbe Breite) */
  function fahrzeuge() {
    const liste = [];
    for (const b of AU.liste) liste.push({ auto: b, x: b.x, y: b.y, h: b.h, vorn: b.A.vorn, hinten: b.A.hinten, halb: b.A.halb, v: b.v, rueck: b.rueck });
    const FW = ST.fuhrwerk;
    if (FW) {
      for (const w of FW.wagen || []) liste.push({ wagen: w, x: w.x, y: w.y, h: w.h, vorn: 3.4, hinten: 3.2, halb: 1.0, v: w.v || 0 });
      const P = FW.bahn;
      if (P && P.x != null) liste.push({ bahn: P, x: P.x, y: P.y, h: P.h, vorn: 4.8, hinten: 4.7, halb: 1.2, v: P.v || 0 });
    }
    return liste;
  }
  function imUmriss(f, x, y, rand) {
    const c = Math.cos(f.h), s = Math.sin(f.h), dx = x - f.x, dy = y - f.y, l = dx * c + dy * s, qq = -dx * s + dy * c;
    return l < f.vorn + rand && l > -f.hinten - rand && Math.abs(qq) < f.halb + rand;
  }
  /* freie Strecke vor dem Auto (m) auf der Fahrspur „seite", höchstens bis max */
  function freiVorAus(a, seite, max, alle) {
    const W = a.W, A = a.A, andere = alle.filter((f) => f.auto !== a && !(a.geist > 0 && f.auto));
    if (!andere.length) return { d: max };
    const nah = andere.filter((f) => Math.hypot(f.x - a.x, f.y - a.y) < max + A.vorn + 12);
    if (!nah.length) return { d: max };
    for (let d = 0; d <= max; d += 0.5) {
      const sv = a.s + d + A.vorn;
      if (sv > W.L + 0.5) break;
      const p = an(W, sv, 1.2), nx = -p.ty, ny = p.tx;
      /* die Spur wechselt allmählich: nah die heutige, weiter vorn die gewünschte */
      const sq = d < 3 ? a.seite : seite;
      for (const b of [-0.85, 0, 0.85]) {
        const x = p.x + nx * (sq + b * A.halb), y = p.y + ny * (sq + b * A.halb);
        for (const f of nah) if (imUmriss(f, x, y, 0.25)) return { d: d, f: f };
      }
    }
    return { d: max };
  }
  /* kommt jemand entgegen (auf meinem Weg, bis 22 m voraus)? */
  function gegenverkehr(a, alle) {
    const W = a.W;
    for (const f of alle) {
      if (f.auto === a || Math.hypot(f.x - a.x, f.y - a.y) > 30) continue;
      const fp = fusspunkt(W, f.x, f.y, Math.min(W.L, a.s + 26));
      if (fp.s < a.s - 2 || fp.d > 3.2) continue;
      const p = an(W, fp.s, 1.2);
      if (Math.cos(winkel(f.h - Math.atan2(p.ty, p.tx))) < -0.5 && (f.v > 0.05 || fp.s > a.s + 1)) return true;
    }
    return false;
  }

  /* ---------------- Bewegen ---------------- */
  function schritt(a, dt, alle) {
    const A = a.A;
    a.gas = 0;
    if (a.geist > 0) a.geist -= dt;
    if (a.zustand === "haelt") {
      a.v = 0; a.halt -= dt;
      if (a.halt <= 0) losfahren(a);
      return;
    }
    if (a.zustand === "wendet") { wenden(a, dt, alle); return; }
    /* Fahrt auf der Strecke */
    const W = a.W, rest = a.bis - a.s;
    const gegen = gegenverkehr(a, alle);
    /* die nächste Fahrt schon beim Heranfahren planen: muss das Auto wenden, hält es in der Wegmitte */
    if (!a.plan && rest < 14) {
      const e = an(W, a.bis, 1.2);
      const kz = a.ziel.kehre;
      a.plan = (kz ? planen(a, a.ziel.i, e.x, e.y, Math.atan2(e.ty, e.tx), kz.z, kz.pts) : planen(a, a.ziel.i, e.x - e.ty * SEITE, e.y + e.tx * SEITE, Math.atan2(e.ty, e.tx))) || { keiner: true };
      if (kz) a.plan.kehre = true;
    }
    let soll = gegen ? AUSWEICHEN : SEITE;
    if (a.plan && a.plan.wenden && rest < 9) soll = 0;
    /* auf dem Pflaster bleiben (Mitte höchstens 1,15 m neben dem Weg); zum Ausweichen bis 1,75 m */
    const sb = spurBereich(a, a.s - 0.5, a.s + 5, soll > SEITE ? 1.75 : 1.15);
    soll = klemm(soll, sb[0], sb[1]);
    /* FASSUNG 830 — auf Brücken fährt das Auto mittig (wie die Fuhrwerke: zwischen den Brüstungen ist nur 2,9 m Platz) */
    if (ST.fuhrwerk && ST.fuhrwerk.brueckenFaktor) soll *= ST.fuhrwerk.brueckenFaktor(a.x, a.y);
    /* Tempo: Kurven voraus, Ziel, Hindernis */
    let vz = A.V, grenze = "frei";
    const i0 = Math.max(0, Math.floor(a.s * 2) - 2);
    for (let i = i0; i <= W.n && W.S[i] <= a.s + 30; i++) { const d = Math.max(0, W.S[i] - a.s), v = Math.sqrt(a.vk[i] * a.vk[i] + 2 * BREMS * d); if (v < vz) { vz = v; grenze = "kurve"; } }
    /* v ist das Tempo des Autos selbst: neben der Wegmitte ist der Bogen außen länger, innen kürzer */
    const ik = Math.min(W.n, Math.max(0, Math.round(a.s * 2))), bogen = klemm(1 - a.seite * a.kr[ik], 0.7, 1.5);
    /* zum Ziel: so bremsen, dass das Auto genau dort steht (nötige Verzögerung v²/2s) */
    const zielWeg = Math.max(1e-3, rest * bogen), zielBrems = a.v * a.v / (2 * zielWeg);
    /* Bremsweg zum Halt mit 80 % der gewöhnlichen Bremskraft (bleibt Luft für den Rest) */
    const vZiel = Math.sqrt(1.6 * BREMS * zielWeg);
    if (vZiel < vz) { vz = vZiel; grenze = "ziel"; }
    if (gegen && vz > 4) { vz = 4; grenze = "gegenverkehr"; }
    const fr = freiVorAus(a, soll, 28, alle);
    const luecke = fr.d - ABSTAND;
    const vFrei = luecke <= 0 ? 0 : Math.sqrt(2 * BREMS * luecke);
    a.vor = fr.f ? (fr.f.auto ? "auto:" + fr.f.auto.id : fr.f.wagen ? "kornwagen" : "pferdebahn") : "";
    if (vFrei < vz) { vz = vFrei; grenze = "vordermann"; }
    const v0 = a.v;
    if (vz >= a.v) a.v = Math.min(vz, a.v + GAS * dt);
    else a.v = Math.max(vz, a.v - (vFrei < a.v - 0.5 ? NOT : BREMS * 1.3) * dt);
    /* zum Halt: genau so stark bremsen, wie es der Rest braucht (nie ruckartig, am Ende ≈ 0) */
    /* zu schnell für den Rest (etwa weil die Strecke kürzer wurde)? genau so stark bremsen, wie es braucht */
    if (zielBrems > BREMS * 1.25 && v0 > 0) { a.v = Math.min(a.v, Math.max(0, v0 - Math.min(zielBrems, NOT) * dt)); grenze = "ziel"; }
    a.grenze = grenze;
    if (vz < 0.02 && a.v < 0.02 && rest > 0.3) { a.v = 0; a.zustand = "faehrt"; a.wartet = true; a.warte += dt; }
    else { a.wartet = false; a.warte = Math.max(0, a.warte - dt); }
    /* lange blockiert (zwei Autos voreinander)? kurz aneinander vorbei */
    a.vorAuto = fr.f && fr.f.auto ? fr.f.auto : null;
    /* warten zwei Autos aufeinander (gegenseitig), fährt eins nach 6 s kurz vorbei; sonst erst nach 25 s */
    if (a.vorAuto && ((a.warte > 6 && a.vorAuto.wartet && a.vorAuto.vorAuto === a) || a.warte > 25)) { a.geist = 4; a.warte = 0; }
    /* steht ein Fuhrwerk lange im Weg (lädt ab, ruht über Nacht) oder pendelt die Pferdebahn immer wieder davor,
       sucht sich das Auto ein anderes Ziel – notfalls wenden */
    /* FASSUNG 810 — die Pferdebahn hält planmäßig (10 s) und fährt dann weiter: dahinter geduldig warten (bis 30 s),
       statt dicht neben ihr zu wenden */
    const geduld = fr.f && !fr.f.wagen && !fr.f.auto ? 30 : 15;
    if (!a.vorAuto && fr.f && (a.warte > geduld || (a.warte > Math.min(12, geduld) && (fr.f.v || 0) < 0.05 && geduld < 30))) {
      const p = an(W, Math.max(0, a.s - 3)), k = knotenBei(p.x, p.y);
      a.warte = 0; a.zustand = "haelt"; a.halt = 0.5; a.W = null; a.plan = null; a.knoten = k.i; a.umkehr = (a.umkehr || 0) + 1; a.v = 0;
      return;
    }
    a.gas = (a.v - v0) / Math.max(dt, 1e-3);
    a.bremst = a.gas < -0.4 ? 1 : 0;
    let ds = Math.min(a.v * dt / bogen, Math.max(0, rest));
    /* nachmessen: das Auto selbst soll genau v·dt weit kommen (auch in engen Bögen neben der Wegmitte) */
    if (ds > 1e-4) {
      const p = an(W, a.s + ds, 0.9), weit = Math.hypot(p.x - p.ty * a.seite - a.x, p.y + p.tx * a.seite - a.y);
      if (weit > 1e-4) ds = Math.min(ds * klemm(a.v * dt / weit, 0.5, 2), Math.max(0, rest));
    }
    a.s += ds; a.weg += a.v * dt;
    /* Spur: sanft nach rechts oder zum Ausweichen weiter rechts – nur beim Fahren (0,22 m quer je Meter, ≈ 12°) */
    const dq = klemm(soll - a.seite, -0.22 * ds, 0.22 * ds);
    a.seite += dq;
    rad(a, ds, dt);
    lage(a, ds > 1e-4 ? dq / ds : 0, ds, Math.max(a.v, v0) * dt * 1.25 + 0.005);
    /* angekommen, wenn der Rest (fast) null ist und das Auto (fast) steht – sonst bremst es auf der Stelle aus */
    if (a.bis - a.s < 0.05 && a.v < 0.14 && !a.wartet) {
      /* angekommen: vor dem Haus halten */
      a.zustand = "haelt"; a.knoten = a.ziel.i; a.W = null;   // (v geht im nächsten Schritt auf 0)
      /* an einer Spitzkehre nur kurz (dann wenden und weiter), vor einem Haus ein paar Sekunden */
      a.halt = a.ziel.kehre ? 0.4 : HALT[0] + ST.hash2(a.zaehl || 0, 7, 815) * (HALT[1] - HALT[0]);
      a.ankuenfte = (a.ankuenfte || 0) + 1;
      a.halte = a.halte || []; a.halte.push({ t: +AU.t.toFixed(1), ziel: a.ziel.name, haus: !!a.ziel.haus, x: a.x, y: a.y });
      if (a.halte.length > 30) a.halte.shift();
      if (a.gast && a.ziel.raus) a.fertig = true;   // FASSUNG 830 — der Gast ist wieder draußen (Nachbardorf)
    }
  }
  /* Lage auf der Strecke; beim Spurwechsel schaut das Auto schräg in die neue Spur (quer = seitlicher Weg je Meter) */
  function lage(a, quer, ds, maxWeg) {
    const p = an(a.W, a.s, 0.9), nx = -p.ty, ny = p.tx, px = p.x + nx * a.seite, py = p.y + ny * a.seite;
    const hq = Math.atan(quer || 0);
    a.hq = (a.hq || 0) + (hq - (a.hq || 0)) * Math.min(1, (ds || 0) / 1.6);
    a.h = Math.atan2(p.ty, p.tx) + a.hq;
    let x = px, y = py;
    if (a.rest) { a.rest.weg += ds || 0; const f = 1 - a.rest.weg / 1.5; if (f <= 0) a.rest = null; else { x += a.rest.x * f; y += a.rest.y * f; } }
    if (maxWeg != null) {
      /* FASSUNG 830 — in einem engen Knick gleich am Anfang einer umfahrenen Strecke macht das Auto keinen Satz: es kommt
         nie weiter als sein Tempo erlaubt, der Rest wird auf den nächsten 1,5 m abgebaut */
      const xa = x, ya = y;
      const dx = x - a.x, dy = y - a.y, d = Math.hypot(dx, dy);
      if (d > maxWeg) { x = a.x + dx * maxWeg / d; y = a.y + dy * maxWeg / d; }
      if (Math.hypot(x - xa, y - ya) > 1e-4) a.rest = { x: x - px, y: y - py, weg: 0 };
    }
    a.x = x; a.y = y;
  }
  function rad(a, ds, dt) {
    /* nicht schneller als ~3,5 Radbilder-Umläufe je Sekunde (sonst flimmert es) */
    const cap = a.A.zyklus * 3.5 * dt;
    a.ph = ((a.ph + klemm(ds, -cap, cap) / a.A.zyklus) % 1 + 1) % 1;
  }
  /* Wenden in drei Zügen (je 60°): vorwärts mit Links-Einschlag, rückwärts mit Rechts-Einschlag, vorwärts links.
     Danach steht das Auto am selben Fleck, um 180° gedreht. */
  function wenden(a, dt, alle) {
    const w = a.wende, rueck = w.zug === 1, L = WENDE_R * Math.PI / 3;
    /* anfahren, 1,5 m/s, bremsen – je Zug */
    const vmax = Math.min(2, Math.sqrt(2 * 1.5 * Math.max(0, w.rest)) + 0.02);
    /* der Schwenkbereich liegt vor dem Startplatz (bis ≈ 2,4 m voraus, 1,4 m zu jeder Seite): steht oder fährt dort
       jemand, wird gewartet. Wer hinter dem Auto wartet, ist nie im Weg. */
    if (!w.start) w.start = { x: a.x, y: a.y, h: a.h };
    const S = w.start, c0 = Math.cos(S.h), s0 = Math.sin(S.h);
    /* die Mitte des Autos bleibt im Rechteck 0 … 2,5 m voraus, ±1,4 m zur Seite; der Wagenkasten reicht bis zum
       Eckenhalbmesser darüber hinaus, nie aber hinter das Heck am Startplatz. Wer auf uns wartet, stört nicht. */
    const Rk = Math.hypot(Math.max(a.A.vorn, a.A.hinten), a.A.halb) + 0.15;
    const frei = !alle.some((f) => {
      if (f.auto === a || a.geist > 0 || (f.wagen && f.wagen.wartet) || (f.auto && f.auto.wartet && f.auto.vorAuto === a)) return false;
      const c = Math.cos(f.h), s = Math.sin(f.h);
      for (const [l0, q0] of [[f.vorn, f.halb], [f.vorn, -f.halb], [-f.hinten, f.halb], [-f.hinten, -f.halb], [0, 0], [f.vorn, 0], [-f.hinten, 0]]) {
        const x = f.x + l0 * c - q0 * s, y = f.y + l0 * s + q0 * c, dx = x - S.x, dy = y - S.y, l = dx * c0 + dy * s0, q = -dx * s0 + dy * c0;
        if (l < -a.A.hinten - 0.2) continue;
        if (Math.hypot(l - klemm(l, 0, 2.5), q - klemm(q, -1.4, 1.4)) < Rk) return true;
      }
      return false;
    });
    const soll = frei ? vmax : 0;
    w.v = soll > w.v ? Math.min(soll, w.v + 1.6 * dt) : Math.max(soll, w.v - 2.5 * dt);
    /* (wer lange wartet – etwa weil die Pferdebahn auf ihrem Gleis nebenan hin und her fährt –, wendet nach 8 s trotzdem) */
    a.wartet = !frei; if (!frei) { a.warte += dt; if (a.warte > 8) { a.geist = 3; a.warte = 0; } }
    const ds = Math.min(w.v * dt, w.rest);
    w.rest -= ds;
    a.h += (w.dir || 1) * ds / WENDE_R;
    const r = rueck ? -1 : 1;
    a.x += Math.cos(a.h) * ds * r; a.y += Math.sin(a.h) * ds * r;
    a.v = w.v; a.rueck = rueck; a.weg += ds;
    rad(a, ds * r, dt);
    if (w.rest <= 1e-4 && w.v < 0.12) {
      if (w.zug < 2) {
        w.zug++; w.rest = L; w.v = 0;
        /* der letzte Zug dreht genau so weit, dass das Auto in Richtung der neuen Strecke schaut */
        if (w.zug === 2 && a.nachWende) {
          const n = a.nachWende;
          let ziel;
          if (n.pts) ziel = Math.atan2(n.pts[0][1] - a.y, n.pts[0][0] - a.x);
          else { const f = fusspunkt(n.W, a.x, a.y, 16), p = an(n.W, f.s, 0.9); ziel = Math.atan2(p.ty, p.tx); }
          const rest = winkel(ziel - a.h) * (w.dir || 1);
          if (rest > 0.2 && rest < 1.9) w.rest = rest * WENDE_R;
        }
      } else {
        a.wende = null; a.rueck = false; a.wenden = (a.wenden || 0) + 1; const n = a.nachWende; a.nachWende = null;
        if (n.pts) fahrtBeginnen(a, fahrStrecke([[a.x, a.y]].concat(n.pts), n.ohne), 0, n.z);
        else { const f = fusspunkt(n.W, a.x, a.y, 16); fahrtBeginnen(a, n.W, f.s, n.z); }
      }
    }
  }

  /* ---------------- FASSUNG 830: Besuch am Tag ----------------
     XANDER (wörtlich): „Autos auch tagsüber mit Geräuschen". Bisher fuhren nur gekaufte Autos (oder die Probefahrt) – wer
     keins hat, sah und hörte nie eins. Jetzt kommt tagsüber (bis in die Dämmerung) ab und zu ein Gast aus dem Nachbardorf:
     eines der Autos, das man nicht hat (Viper oder Batmobil), rollt an einem Weg vom Kartenrand herein, hält vor einem
     Haus, am Markt oder einem Wahrzeichen und fährt an einem anderen Rand wieder hinaus; danach dauert es 35–80 s bis zum
     nächsten. Er fährt wie die eigenen Autos (Wege, Rechtsverkehr, Warten, Brücken, Hindernisse) und hat denselben leisen
     Motor (ton.js T.motorSchleife, FASSUNG 825): lauter, je näher und je weiter hineingezoomt, ohne Ton aus. Ein Tipp auf ihn
     öffnet wie bei den eigenen die Auto-Schau (dort kann man ihn kaufen). Sparsam: im kleinen Rahmen kommt ein Gast nur,
     wenn sein Blatt schon geladen ist (kein zusätzliches Bild); nie im stillen Prüfbild; ?gaeste=0 schaltet ihn ab,
     ?gaeste=1 lässt den ersten gleich kommen (Sonde pruefe-830-verkehr). */
  const GAST = { an: q.get("gaeste") !== "0", schnell: q.get("gaeste") === "1", naechst: null, zahl: 0 };
  AU.gast = GAST;
  function randKnoten() {
    /* Enden des Wegenetzes, die am weitesten draußen liegen (die Landstraßen hinaus) */
    const L = [];
    for (let i = 0; i < netz.P.length; i++) if (netz.im(i) && netz.N[i].filter((j) => netz.im(j)).length === 1) L.push(i);
    const weit = (i) => Math.max(Math.abs(netz.P[i][0]), Math.abs(netz.P[i][1]));
    L.sort((i, j) => weit(j) - weit(i));
    return L.slice(0, 5);
  }
  AU.randKnoten = () => (netz ? randKnoten().map((i) => netz.P[i]) : []);
  function gastTakt() {
    if (!GAST.an || !netz || !netz.P.length || ziele.length < 2 || (ST.leicht && ST.leicht.still)) return;
    if (AU.liste.some((a) => a.gast)) return;
    if (GAST.naechst == null) GAST.naechst = AU.t + (GAST.schnell ? 0.5 : 12 + ST.hash2(3, 8, 830) * 10);
    if (AU.t < GAST.naechst) return;
    GAST.naechst = AU.t + 20;   // (falls jetzt keiner kommen kann: in 20 s wieder fragen)
    const Z = SZ.zeitDaten(); if ((Z.nacht || 0) > 0.55) return;   // nur tagsüber und in der Dämmerung
    const frei = AU.REIHE.filter((id) => !AU.hat(id) && !AU.liste.some((a) => a.id === id));   // (kein Doppelgänger eines eigenen, auch abgestellten Autos)
    if (!frei.length) return;
    const n = GAST.zahl, id = frei[Math.floor(ST.hash2(n, 5, 830) * frei.length) % frei.length], A = ARTEN[id];
    if (klein()) { const b = blatt(A.blatt + "_" + jahrName() + "_" + (Z.nacht > 0.5 ? "nacht" : "tag")); if (!b || !LB.fertig(b.name)) return; }
    const R = randKnoten(); if (R.length < 2) return;
    const rein = R[Math.floor(ST.hash2(n, 7, 830) * R.length) % R.length], rest = R.filter((i) => i !== rein);
    const raus = rest[Math.floor(ST.hash2(n, 9, 830) * rest.length) % rest.length];
    const a = { id: id, A: A, v: 0, s: 0, W: null, x: 0, y: 0, h: 0, seite: 0, ph: 0, zustand: "haelt", halt: 0.3, ziel: null, knoten: rein,
      warte: 0, geist: 0, rueck: false, gas: 0, bremst: 0, weg: 0, gast: { raus: raus, ziele: 1, nr: n, t0: AU.t } };
    /* am Rand herein: ein paar Meter innen auf dem Weg, Blick nach innen */
    const P0 = netz.P[rein], nb = netz.N[rein].find((j) => netz.im(j)), pts = [P0];
    let vor = rein, j = nb, l = 0;
    while (l < 8 && j != null && j >= 0) { const Q = netz.P[j]; l += Math.hypot(Q[0] - pts[pts.length - 1][0], Q[1] - pts[pts.length - 1][1]); pts.push(Q); const w = netz.N[j].filter((m) => m !== vor && netz.im(m)); vor = j; j = w.length === 1 ? w[0] : -1; }
    const W = strecke(pts), e = an(W, Math.min(2, W.L), 1.2);
    a.x = e.x - e.ty * SEITE; a.y = e.y + e.tx * SEITE; a.h = Math.atan2(e.ty, e.tx);
    GAST.zahl++;
    AU.liste.push(a);
  }

  AU.t = 0;
  function takt(dt) {
    AU.t += dt;
    /* neu aufbauen, wenn die Fuhrwerke ihr Netz neu gebaut haben (neue Stadt) oder sich der Besitz geändert hat */
    const soll = sollFahren().join(","), fn = ST.fuhrwerk && ST.fuhrwerk.netz;
    if (!netz || fn !== fwNetz || AU.neu || soll !== gebaut) { AU.neu = false; gebaut = soll; aufbauen(); }
    gastTakt();   // FASSUNG 830 — Besuch am Tag
    if (!AU.liste.length) { if (motoren.size) motorTon(); return; }   // FASSUNG 825 — kein Auto mehr: Motoren aus
    const alle = fahrzeuge();
    for (const a of AU.liste) {
      schritt(a, dt, alle);
      if (a.zustand === "wendet") ausDingen(a, dt);   // FASSUNG 830 — nie durch Brunnen, Bänke, Schmuck (beim Fahren: lage)
      const f = alle.find((x) => x.auto === a); if (f) { f.x = a.x; f.y = a.y; f.h = a.h; f.v = a.v; }
    }
    if (AU.liste.some((a) => a.fertig)) {
      AU.liste = AU.liste.filter((a) => !a.fertig);
      GAST.naechst = AU.t + 35 + ST.hash2(GAST.zahl, 11, 830) * 45;   // der nächste Besuch in 35–80 s
      if (AU.folge && !AU.auto(AU.folge)) AU.folge = null;
    }
    /* der Kamera folgen („Hinfahren") */
    const F = AU.folge && AU.auto(AU.folge);
    if (F && ST.leicht) { K.x += (F.x - K.x) * Math.min(1, dt * 3); K.y += (F.y - K.y) * Math.min(1, dt * 3); ST.leicht.unruhe = 2; }
    motorTon();
  }
  /* FASSUNG 825 — XANDER (wörtlich): „am Tag möchte ich auch Autos fahren sehen … vielleicht auch mit Fahrgeräusche".
     Jedes fahrende Auto hat einen leisen Motor (ST.ton.motorSchleife): lauter, je näher es der Bildmitte ist und je
     näher man heranzoomt; Drehzahl nach Tempo und Gas; nur wenn die Stadt Töne darf; weit weg oder ohne Ton: aus. */
  const motoren = new Map();
  AU.motoren = motoren; AU.motorTon = () => motorTon();   // (Sonde 825)
  function motorLaut(a) {
    const c = ST.aufBoden(K.W / 2, K.H / 2), d = Math.hypot(a.x - c[0], a.y - c[1]);
    const sc = K.s / (K.dpr || 1), R = klemm(520 / Math.max(1, sc), 22, 65);
    const nah = Math.pow(klemm(1 - d / R, 0, 1), 1.6), zoom = klemm(sc / 16, 0.3, 1);
    const P = ST.proj(a.x, a.y, 0);
    return { laut: 0.2 * nah * zoom * (0.35 + 0.65 * klemm(a.v / 7, 0, 1)), pan: klemm((P[0] / K.W - 0.5) * 1.6, -0.85, 0.85) };
  }
  function motorTon() {
    const T = ST.ton; if (!T || !T.motorSchleife) return;
    const darf = T.darf();
    for (const a of AU.liste) {
      let m = motoren.get(a.id);
      const L = darf ? motorLaut(a) : { laut: 0, pan: 0 };
      a.motorLaut = L.laut;
      if (L.laut > 0.003) {
        if (!m) { m = T.motorSchleife(a.id === "batmobil" ? "turbine" : "v10"); if (m) motoren.set(a.id, m); }
        if (m) m.setzen(L.laut, L.pan, a.v / 7.5, klemm((a.gas || 0) / 3, 0, 1));
      } else if (m) { m.aus(); motoren.delete(a.id); }
    }
    for (const [id, m] of motoren) if (!AU.liste.some((a) => a.id === id)) { m.aus(); motoren.delete(id); }
  }
  let letzte = 0;
  AU.bewegen = function (jetzt) {
    if (!ST.fuhrwerk || !ST.fuhrwerk.strecke) return;
    const dt = Math.min(0.1, Math.max(0, (jetzt - (letzte || jetzt)) / 1000)); letzte = jetzt;
    takt(dt);
  };
  /* für Sonden: ein Auto auf eine Strecke W (Format von fuhrwerk.js strecke()) an die Stelle s setzen, Fahrt bis zum Ende */
  AU.setzeAuf = function (id, W, s) {
    const a = AU.auto(id); if (!a) return false;
    const p = an(W, s, 0.9);
    a.x = p.x - p.ty * SEITE; a.y = p.y + p.tx * SEITE; a.h = Math.atan2(p.ty, p.tx); a.v = 0; a.wende = null; a.plan = null;
    fahrtBeginnen(a, W, s, { i: knotenBei(W.X[W.n], W.Y[W.n]).i, haus: null, name: "Probe" });
    a.bis = W.L; a.plan = { keiner: true };
    return true;
  };
  AU.kurvenTempo = kurvenTempo;
  /* für die Fuhrwerke (fuhrwerk.js): steht ein Auto vor einem Fahrzeug (Mitte x, y, Richtung h, vorn, halbe Breite)
     im Weg – in den nächsten 2,5 m voraus? */
  AU.imWeg = function (x, y, h, vorn, halb) {
    if (!AU.liste.length) return false;
    const c = Math.cos(h), s = Math.sin(h);
    for (const a of AU.liste) {
      if (Math.hypot(a.x - x, a.y - y) > vorn + 9) continue;
      /* ein entgegenkommendes Auto weicht selbst aus (oder wartet) – dafür hält das Pferd nicht */
      if (Math.cos(a.h - h) < -0.5 && !a.rueck) continue;
      /* nur ein fahrendes Auto lässt das Pferd warten; einem stehenden oder wendenden gegenüber hat das Fuhrwerk Vorrang */
      if (a.v < 0.3 || a.zustand !== "faehrt") continue;
      const f = { x: a.x, y: a.y, h: a.h, vorn: a.A.vorn, hinten: a.A.hinten, halb: a.A.halb };
      for (let d = vorn; d <= vorn + 2.5; d += 0.5) for (const q of [-halb * 0.8, 0, halb * 0.8]) if (imUmriss(f, x + c * d - s * q, y + s * d + c * q, 0.2)) return true;
    }
    return false;
  };
  /* für Sonden: n Sekunden in kleinen Schritten vorspulen (mit Mitschrift je Schritt) */
  AU.vorspulen = function (sek, dt, opt) {
    dt = dt || 0.1; opt = opt || {};
    for (let t = 0; t < sek - 1e-9; t += dt) {
      if (opt.fuhrwerke && ST.fuhrwerk && ST.fuhrwerk.vorspulen) ST.fuhrwerk.vorspulen(dt);
      takt(dt);
      if (opt.mit) opt.mit.push(AU.liste.map((a) => ({ g: a.grenze, id: a.id, x: +a.x.toFixed(3), y: +a.y.toFixed(3), h: +a.h.toFixed(4), v: +a.v.toFixed(3), z: a.zustand, r: !!a.rueck, w: !!a.wartet, vor: a.vor || "", s: a.seite })));
    }
  };

  /* ---------------- Zeichnen ---------------- */
  const jahrName = () => (SZ.jahr === "winter" ? "winter" : "herbst");
  function klein() { return !!(LB.nurKlein || (document.body && document.body.classList.contains("lk-mini-modus"))); }
  function blatt(basis) {
    const z = LB.vz[basis + "_z"], g = LB.vz[basis];
    if (z && (!g || (klein() && K.s <= z.s * 1.35))) return { name: basis + "_z", meta: z };
    return g ? { name: basis, meta: g } : null;
  }
  /* Welt-Punkt eines Punktes im Auto (quer, längs, Höhe) – Modell: +y vorn, +x = (sin h, −cos h) */
  function imAuto(a, lx, ly) { const c = Math.cos(a.h), s = Math.sin(a.h); return [a.x + ly * c + lx * s, a.y + ly * s - lx * c]; }
  AU.sichtbar = function (Z) {
    const aus = [];
    for (const a of AU.liste) {
      if (AU.ohne === a.id) continue;   // (für Sonden: ohne dieses Auto malen)
      /* FASSUNG 830 — XANDER: „die Autos verschmelzen mit der Brücke". Auf einer Brücke fährt das Auto oben auf dem Buckel:
         gehoben um die mittlere Deckhöhe unter Front, Mitte und Heck, und gemalt nach der Brücke (p.auf, szene.js) – wie
         die Fuhrwerke (fuhrwerk.js). Vorher lag es auf Bodenhöhe und die Brücke malte sich darüber. */
      let z = 0, auf = null;
      const FW = ST.fuhrwerk;
      if (FW && FW.aufBruecke) {
        const c = Math.cos(a.h), s = Math.sin(a.h), q = [a.A.vorn * 0.8, 0, -a.A.hinten * 0.8].map((d) => FW.aufBruecke(a.x + c * d, a.y + s * d));
        const o = q.find(Boolean);
        if (o) { auf = o.o; z = q.reduce((n, e) => n + (e && e.o === o.o ? e.z : 0), 0) / 3; }
      }
      a.z = z; a.auf = auf;
      const P = ST.proj(a.x, a.y, z), rand = 140 * K.dpr;
      if (P[0] < -rand || P[0] > K.W + rand || P[1] < -rand || P[1] > K.H + rand * 1.5) continue;
      const b = blatt(a.A.blatt + "_" + jahrName() + "_" + (Z.nacht > 0.5 ? "nacht" : "tag")); if (!b) continue;
      /* FASSUNG 830 — ein Gast im kleinen Rahmen nur mit einem Blatt, das schon geladen ist (kein zusätzliches Bild) */
      if (a.gast && klein() && !LB.fertig(b.name)) continue;
      const img = LB.bild(b.name, true); if (!img) continue;   // dringend: das Auto soll gleich zu sehen sein
      const ri = b.meta.ri || 8, gier = Math.atan2(-Math.cos(a.h), Math.sin(a.h)) * 180 / Math.PI + K.dreh * 90;
      const n = b.meta.n || 1, spalte = n > 1 ? Math.floor(a.ph * n) % n : 0;
      const r = ST.drehXY(a.x, a.y, K.dreh);
      a.reihe = ((Math.round(gier / (360 / ri)) % ri) + ri) % ri; a.blatt = b.name;
      aus.push({ X: P[0], Y: P[1], a: r[0], b: r[1], img: img, meta: b.meta, reihe: a.reihe, schritt: spalte, malen: malen, bx: a.A.vorn * 0.9, bh: 1.4 + z, Z: Z, auto: a, auf: auf, alpha: gastAlpha(a) });
    }
    AU.gezeigt = aus.length;
    return aus;
  };
  /* FASSUNG 830 — ein Gast blendet am Ende des Wegenetzes sanft ein (1,2 s) und auf den letzten 5 m hinaus wieder aus */
  function gastAlpha(a) {
    if (!a.gast) return 1;
    let al = klemm((AU.t - (a.gast.t0 || 0)) / 1.2, 0, 1);
    if (a.ziel && a.ziel.raus && a.W && a.zustand === "faehrt") al *= klemm((a.bis - a.s) / 5, 0, 1);
    return al;
  }
  function glut(g, x, y, R, farbe, a) {
    if (R < 0.8 || a <= 0.003) return;
    const gr = g.createRadialGradient(x, y, 0, x, y, R);
    gr.addColorStop(0, "rgba(" + farbe + "," + Math.min(1, a).toFixed(3) + ")"); gr.addColorStop(0.3, "rgba(" + farbe + "," + (a * 0.35).toFixed(3) + ")"); gr.addColorStop(1, "rgba(" + farbe + ",0)");
    g.fillStyle = gr; g.fillRect(x - R, y - R, 2 * R, 2 * R);
  }
  function malen(g, p) {
    const m = p.meta, k = K.s / m.s, a = p.auto, A = a.A, Z = p.Z, nacht = Z.nacht || 0, zb = a.z || 0;   // zb: Höhe auf der Brücke (FASSUNG 830)
    const licht = AU.ohneLicht ? 0 : klemm((nacht - 0.25) / 0.45, 0, 1);
    a.licht = licht;
    /* Lichtkegel auf dem Boden – unter dem Auto, vor ihm her (nur im großen Bild) */
    if (licht > 0 && !klein()) {
      const e = [[-0.8, A.vorn], [0.8, A.vorn], [4.4, A.vorn + 12], [-4.4, A.vorn + 12]].map((q) => { const w = imAuto(a, q[0], q[1]); return ST.proj(w[0], w[1], 0.02 + zb); });
      const m0 = imAuto(a, 0, A.vorn), P0 = ST.proj(m0[0], m0[1], 0.02 + zb), R = Math.hypot(e[2][0] - P0[0], e[2][1] - P0[1]) * 1.05;
      if (R > 2) {
        g.save(); g.globalCompositeOperation = "lighter";
        const gr = g.createRadialGradient(P0[0], P0[1], 0, P0[0], P0[1], R);
        gr.addColorStop(0, "rgba(255,238,196," + (0.42 * licht).toFixed(3) + ")"); gr.addColorStop(0.45, "rgba(255,232,180," + (0.2 * licht).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,226,170,0)");
        g.beginPath(); e.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); g.closePath();
        g.fillStyle = gr; g.fill(); g.restore();
      }
    }
    if (p.alpha != null && p.alpha < 1) { if (p.alpha <= 0.01) return; g.globalAlpha = p.alpha; }
    g.drawImage(p.img, p.schritt * m.zw, p.reihe * m.zh, m.zw, m.zh, p.X - m.ax * k, p.Y - m.ay * k, m.zw * k, m.zh * k);
    /* Lichter: Scheinwerfer, Rücklichter (beim Bremsen hell), Bat-Licht aus dem Blatt, Turbine */
    const bremse = a.bremst || a.wartet || a.zustand === "haelt" ? 1 : 0;
    const Ks = K.s;
    g.save(); g.globalCompositeOperation = "lighter";
    if (licht > 0) for (const l of A.lampen) { const w = imAuto(a, l[0], l[1]), P = ST.proj(w[0], w[1], l[2] + zb); glut(g, P[0], P[1], Ks * 0.9, "255,244,215", 0.95 * licht); }
    const rot = Math.max(licht * 0.55, bremse ? 0.75 : 0) * (a.rueck ? 0.8 : 1);
    if (rot > 0) for (const l of A.rueck) { const w = imAuto(a, l[0], l[1]), P = ST.proj(w[0], w[1], l[2] + zb); glut(g, P[0], P[1], Ks * (bremse ? 0.6 : 0.45), "255,40,28", rot); }
    if (a.rueck) for (const l of A.rueck) { const w = imAuto(a, l[0] * 0.8, l[1]), P = ST.proj(w[0], w[1], l[2] + zb); glut(g, P[0], P[1], Ks * 0.35, "255,255,240", 0.8); }
    if (nacht > 0.3 && m.l) for (const l of m.l) {
      if (l[0] !== p.reihe) continue;
      glut(g, p.X + l[1] * k, p.Y + l[2] * k, l[3] * k * 0.5, l[4], nacht * l[5] * (0.85 + 0.15 * Math.sin(AU.t * 9)));
    }
    /* FASSUNG 815 — „das Batmobil … als fahrendes Auto": beim Anfahren glüht die Düse der Turbine, ein Flammenstoß nach hinten */
    if (A.duese && (a.gas > 0.3 || a.feuer > 0.02)) {
      a.feuer = Math.max(klemm(a.gas / GAS, 0, 1) * (a.v < 5.5 ? 1 : 0.3), (a.feuer || 0) * 0.9);
      const f = a.feuer * (0.8 + 0.2 * Math.sin(AU.t * 31) * Math.sin(AU.t * 17));
      const d0 = imAuto(a, A.duese[0], A.duese[1]), P0 = ST.proj(d0[0], d0[1], A.duese[2] + zb);
      const d1 = imAuto(a, A.duese[0], A.duese[1] - 0.7 - 1.3 * f), P1 = ST.proj(d1[0], d1[1], A.duese[2] + zb);
      glut(g, P1[0], P1[1], Ks * (0.5 + 0.6 * f), "255,120,40", 0.55 * f);
      glut(g, P0[0], P0[1], Ks * (0.35 + 0.35 * f), "255,196,110", 0.9 * f);
      glut(g, P0[0], P0[1], Ks * 0.16, "190,220,255", 0.9 * f);
    } else a.feuer = 0;
    g.restore();
    g.globalAlpha = 1;
  }
  /* Tipp auf ein fahrendes Auto (oberflaeche.js) */
  AU.treffer = function (px, py) {
    let best = null, d0 = Math.max(20 * K.dpr, 1.6 * K.s);
    for (const a of AU.liste) { const P = ST.proj(a.x, a.y, 0.5 + (a.z || 0)), d = Math.hypot(P[0] - px, P[1] - py); if (d < d0) { d0 = d; best = a; } }
    return best;
  };
})();
