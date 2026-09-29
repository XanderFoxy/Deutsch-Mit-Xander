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
  function fahrStrecke(pts) {
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
    return W;
  }
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
        else a.knoten = ziele[(Math.floor(ST.hash2(n, 3, 815) * ziele.length) + n * 5) % ziele.length].i;
        hinstellen(a, a.knoten);
      }
      AU.liste.push(a);
    });
  }
  /* am Knoten stehen: 4,5 m davor auf einer seiner Kanten, Blick zum Knoten */
  function hinstellen(a, i) {
    const nb = netz.N[i].filter((j) => netz.im(j));
    const P = netz.P[i];
    let x = P[0], y = P[1], h = 0;
    if (nb.length) {
      /* ein paar Punkte zurück auf der Kante (die Wege haben alle ~3 m einen Punkt) */
      let vor = i, j = nb[0], l = 0; const pts = [P];
      while (l < 4.5 && j >= 0) { const Q = netz.P[j]; l += Math.hypot(Q[0] - pts[pts.length - 1][0], Q[1] - pts[pts.length - 1][1]); pts.push(Q); const w = netz.N[j].filter((m) => m !== vor && netz.im(m)); vor = j; j = w.length === 1 ? w[0] : -1; }
      const W = strecke(pts.slice().reverse()), e = an(W, Math.max(0, W.L - 4.5), 1.2);
      x = e.x; y = e.y; h = Math.atan2(e.ty, e.tx);
    }
    a.x = x; a.y = y; a.h = h; a.seite = 0; a.W = null; a.v = 0;
  }

  /* ---------------- Fahrten ---------------- */
  function zielWaehlen(a) {
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
    const T = teilen(pts, z);
    const W0 = fahrStrecke(T.pts.slice());
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
    const wenden = (nach) => {
      /* zu der Seite hin wenden, auf der die neue Strecke liegt (bei Spitzkehren der andere Ast) */
      const fq = fusspunkt(pl.W0, a.x, a.y, 16), q0 = an(pl.W0, fq.s), kr = Math.cos(a.h) * (q0.y - a.y) - Math.sin(a.h) * (q0.x - a.x);
      a.wende = { zug: 0, rest: WENDE_R * Math.PI / 3, v: 0, dir: kr < -0.05 ? -1 : 1 };
      a.zustand = "wendet"; a.W = null; a.nachWende = nach;
    };
    if (pl.wenden) { wenden({ W: pl.W0, z: z }); return; }
    /* steht das Auto schon auf dem Weg, dann ab dort; sonst vom Standort aus hinein (die Ecke wird rund) */
    const f = fusspunkt(pl.W0, a.x, a.y, 12), p = an(pl.W0, f.s, 1.2);
    if (f.d < 0.9 && Math.cos(winkel(Math.atan2(p.ty, p.tx) - a.h)) > 0.3) { fahrtBeginnen(a, pl.W0, f.s, z); return; }
    /* liegt der erste Knoten hinter dem Auto, erst wenden – dann vom Standort aus hinein */
    const N = pl.pts[0], dN = Math.hypot(N[0] - a.x, N[1] - a.y);
    if (dN > 1 && Math.cos(Math.atan2(N[1] - a.y, N[0] - a.x) - a.h) < -0.2) { wenden({ pts: pl.pts, z: z }); return; }
    fahrtBeginnen(a, fahrStrecke([[a.x, a.y]].concat(pl.pts)), 0, z);
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
    a.bis = bis;
    a.dev = abweichung(W);
    a.plan = null;
    lage(a, 0, 0);
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
      if (a.kr[i] > 0.02) hi = Math.min(hi, 0.5 / a.kr[i]);
      if (a.kr[i] < -0.02) lo = Math.max(lo, -0.5 / -a.kr[i]);
    }
    return lo <= hi ? [lo, hi] : [(lo + hi) / 2, (lo + hi) / 2];
  }
  function fussIm(W, s, A, o) {
    for (let d = -A.hinten; d <= A.vorn + 0.01; d += 0.7) { const p = an(W, s + d); if (drin(o, p.x, p.y, A.halb * 0.6)) return true; }
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
    lage(a, ds > 1e-4 ? dq / ds : 0, ds);
    /* angekommen, wenn der Rest (fast) null ist und das Auto (fast) steht – sonst bremst es auf der Stelle aus */
    if (a.bis - a.s < 0.05 && a.v < 0.14 && !a.wartet) {
      /* angekommen: vor dem Haus halten */
      a.zustand = "haelt"; a.knoten = a.ziel.i; a.W = null;   // (v geht im nächsten Schritt auf 0)
      /* an einer Spitzkehre nur kurz (dann wenden und weiter), vor einem Haus ein paar Sekunden */
      a.halt = a.ziel.kehre ? 0.4 : HALT[0] + ST.hash2(a.zaehl || 0, 7, 815) * (HALT[1] - HALT[0]);
      a.ankuenfte = (a.ankuenfte || 0) + 1;
      a.halte = a.halte || []; a.halte.push({ t: +AU.t.toFixed(1), ziel: a.ziel.name, haus: !!a.ziel.haus, x: a.x, y: a.y });
      if (a.halte.length > 30) a.halte.shift();
    }
  }
  /* Lage auf der Strecke; beim Spurwechsel schaut das Auto schräg in die neue Spur (quer = seitlicher Weg je Meter) */
  function lage(a, quer, ds) {
    const p = an(a.W, a.s, 0.9), nx = -p.ty, ny = p.tx;
    a.x = p.x + nx * a.seite; a.y = p.y + ny * a.seite;
    const hq = Math.atan(quer || 0);
    a.hq = (a.hq || 0) + (hq - (a.hq || 0)) * Math.min(1, (ds || 0) / 1.6);
    a.h = Math.atan2(p.ty, p.tx) + a.hq;
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
        if (n.pts) fahrtBeginnen(a, fahrStrecke([[a.x, a.y]].concat(n.pts)), 0, n.z);
        else { const f = fusspunkt(n.W, a.x, a.y, 16); fahrtBeginnen(a, n.W, f.s, n.z); }
      }
    }
  }

  AU.t = 0;
  function takt(dt) {
    AU.t += dt;
    /* neu aufbauen, wenn die Fuhrwerke ihr Netz neu gebaut haben (neue Stadt) oder sich der Besitz geändert hat */
    const soll = sollFahren().join(","), fn = ST.fuhrwerk && ST.fuhrwerk.netz;
    if (!netz || fn !== fwNetz || AU.neu || soll !== gebaut) { AU.neu = false; gebaut = soll; aufbauen(); }
    if (!AU.liste.length) { if (motoren.size) motorTon(); return; }   // FASSUNG 825 — kein Auto mehr: Motoren aus
    const alle = fahrzeuge();
    for (const a of AU.liste) {
      schritt(a, dt, alle);
      const f = alle.find((x) => x.auto === a); if (f) { f.x = a.x; f.y = a.y; f.h = a.h; f.v = a.v; }
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
      const P = ST.proj(a.x, a.y, 0), rand = 140 * K.dpr;
      if (P[0] < -rand || P[0] > K.W + rand || P[1] < -rand || P[1] > K.H + rand * 1.5) continue;
      const b = blatt(a.A.blatt + "_" + jahrName() + "_" + (Z.nacht > 0.5 ? "nacht" : "tag")); if (!b) continue;
      const img = LB.bild(b.name, true); if (!img) continue;   // dringend: das Auto soll gleich zu sehen sein
      const ri = b.meta.ri || 8, gier = Math.atan2(-Math.cos(a.h), Math.sin(a.h)) * 180 / Math.PI + K.dreh * 90;
      const n = b.meta.n || 1, spalte = n > 1 ? Math.floor(a.ph * n) % n : 0;
      const r = ST.drehXY(a.x, a.y, K.dreh);
      a.reihe = ((Math.round(gier / (360 / ri)) % ri) + ri) % ri; a.blatt = b.name;
      aus.push({ X: P[0], Y: P[1], a: r[0], b: r[1], img: img, meta: b.meta, reihe: a.reihe, schritt: spalte, malen: malen, bx: a.A.vorn * 0.9, bh: 1.4, Z: Z, auto: a });
    }
    AU.gezeigt = aus.length;
    return aus;
  };
  function glut(g, x, y, R, farbe, a) {
    if (R < 0.8 || a <= 0.003) return;
    const gr = g.createRadialGradient(x, y, 0, x, y, R);
    gr.addColorStop(0, "rgba(" + farbe + "," + Math.min(1, a).toFixed(3) + ")"); gr.addColorStop(0.3, "rgba(" + farbe + "," + (a * 0.35).toFixed(3) + ")"); gr.addColorStop(1, "rgba(" + farbe + ",0)");
    g.fillStyle = gr; g.fillRect(x - R, y - R, 2 * R, 2 * R);
  }
  function malen(g, p) {
    const m = p.meta, k = K.s / m.s, a = p.auto, A = a.A, Z = p.Z, nacht = Z.nacht || 0;
    const licht = AU.ohneLicht ? 0 : klemm((nacht - 0.25) / 0.45, 0, 1);
    a.licht = licht;
    /* Lichtkegel auf dem Boden – unter dem Auto, vor ihm her (nur im großen Bild) */
    if (licht > 0 && !klein()) {
      const e = [[-0.8, A.vorn], [0.8, A.vorn], [4.4, A.vorn + 12], [-4.4, A.vorn + 12]].map((q) => { const w = imAuto(a, q[0], q[1]); return ST.proj(w[0], w[1], 0.02); });
      const m0 = imAuto(a, 0, A.vorn), P0 = ST.proj(m0[0], m0[1], 0.02), R = Math.hypot(e[2][0] - P0[0], e[2][1] - P0[1]) * 1.05;
      if (R > 2) {
        g.save(); g.globalCompositeOperation = "lighter";
        const gr = g.createRadialGradient(P0[0], P0[1], 0, P0[0], P0[1], R);
        gr.addColorStop(0, "rgba(255,238,196," + (0.42 * licht).toFixed(3) + ")"); gr.addColorStop(0.45, "rgba(255,232,180," + (0.2 * licht).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,226,170,0)");
        g.beginPath(); e.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); g.closePath();
        g.fillStyle = gr; g.fill(); g.restore();
      }
    }
    g.drawImage(p.img, p.schritt * m.zw, p.reihe * m.zh, m.zw, m.zh, p.X - m.ax * k, p.Y - m.ay * k, m.zw * k, m.zh * k);
    /* Lichter: Scheinwerfer, Rücklichter (beim Bremsen hell), Bat-Licht aus dem Blatt, Turbine */
    const bremse = a.bremst || a.wartet || a.zustand === "haelt" ? 1 : 0;
    const Ks = K.s;
    g.save(); g.globalCompositeOperation = "lighter";
    if (licht > 0) for (const l of A.lampen) { const w = imAuto(a, l[0], l[1]), P = ST.proj(w[0], w[1], l[2]); glut(g, P[0], P[1], Ks * 0.9, "255,244,215", 0.95 * licht); }
    const rot = Math.max(licht * 0.55, bremse ? 0.75 : 0) * (a.rueck ? 0.8 : 1);
    if (rot > 0) for (const l of A.rueck) { const w = imAuto(a, l[0], l[1]), P = ST.proj(w[0], w[1], l[2]); glut(g, P[0], P[1], Ks * (bremse ? 0.6 : 0.45), "255,40,28", rot); }
    if (a.rueck) for (const l of A.rueck) { const w = imAuto(a, l[0] * 0.8, l[1]), P = ST.proj(w[0], w[1], l[2]); glut(g, P[0], P[1], Ks * 0.35, "255,255,240", 0.8); }
    if (nacht > 0.3 && m.l) for (const l of m.l) {
      if (l[0] !== p.reihe) continue;
      glut(g, p.X + l[1] * k, p.Y + l[2] * k, l[3] * k * 0.5, l[4], nacht * l[5] * (0.85 + 0.15 * Math.sin(AU.t * 9)));
    }
    /* FASSUNG 815 — „das Batmobil … als fahrendes Auto": beim Anfahren glüht die Düse der Turbine, ein Flammenstoß nach hinten */
    if (A.duese && (a.gas > 0.3 || a.feuer > 0.02)) {
      a.feuer = Math.max(klemm(a.gas / GAS, 0, 1) * (a.v < 5.5 ? 1 : 0.3), (a.feuer || 0) * 0.9);
      const f = a.feuer * (0.8 + 0.2 * Math.sin(AU.t * 31) * Math.sin(AU.t * 17));
      const d0 = imAuto(a, A.duese[0], A.duese[1]), P0 = ST.proj(d0[0], d0[1], A.duese[2]);
      const d1 = imAuto(a, A.duese[0], A.duese[1] - 0.7 - 1.3 * f), P1 = ST.proj(d1[0], d1[1], A.duese[2]);
      glut(g, P1[0], P1[1], Ks * (0.5 + 0.6 * f), "255,120,40", 0.55 * f);
      glut(g, P0[0], P0[1], Ks * (0.35 + 0.35 * f), "255,196,110", 0.9 * f);
      glut(g, P0[0], P0[1], Ks * 0.16, "190,220,255", 0.9 * f);
    } else a.feuer = 0;
    g.restore();
  }
  /* Tipp auf ein fahrendes Auto (oberflaeche.js) */
  AU.treffer = function (px, py) {
    let best = null, d0 = Math.max(20 * K.dpr, 1.6 * K.s);
    for (const a of AU.liste) { const P = ST.proj(a.x, a.y, 0.5), d = Math.hypot(P[0] - px, P[1] - py); if (d < d0) { d0 = d; best = a; } }
    return best;
  };
})();
