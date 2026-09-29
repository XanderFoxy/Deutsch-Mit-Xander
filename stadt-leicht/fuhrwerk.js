/* =====================================================================
   LEICHTE STADT — FUHRWERKE (Kornwagen zur Mühle, Mehl zur Bäckerei,
   die Döbelner Pferdebahn vom Markt zum Bahnhof)
   ---------------------------------------------------------------------
   XANDER: „Pferdebahn driving plus horse carts taking grain to the mill
   and flour to the bakery" – „Pferde, die Mehl transportieren" – „die
   Pferdebahn, die wir in Döbeln haben".

   KORNWAGEN (stadt/modelle/pferdewagen_korn.js, ein Pferd in der Schere,
   Fuhrmann auf dem Bock): fährt auf den Wegen des Dorfes (ST.dorf.WEGE,
   kürzester Weg) vom Feld zur Mühle, lädt dort ab (aus Korn wird Mehl),
   fährt mit den Mehlsäcken zur Bäckerei, lädt ab und fährt leer zurück
   aufs Feld. Die Felder sind die Beete der Bodenkarte (Bodenart 2); das
   Feld, das einem Weg am nächsten liegt, bekommt einen kurzen Feldweg
   (Erdspur, flach gemalt). Nur wenn Mühle bzw. Bäckerei im Spielstand
   stehen. Tempo Schritt (1,4 m/s), sanftes Anfahren und Anhalten, das
   Pferd geht im Viertakt (vier Gangbilder im Laufblatt, beim Halten
   steht es). Nachts (Nachtgrad > 0,6) fährt keiner los: wer unterwegs
   ist, fährt zu seinem Halt und ruht dort bis zum Morgen.

   PFERDEBAHN (stadt/modelle/pferdebahn.js, Wagen Nr. 1): ein Gleis
   (Meterspur im Pflaster, flach gemalt) auf dem Weg vom Markt zum
   Bahnhof. Die Bahn pendelt nach der Uhr (für alle gleich) mit je 10 s
   Halt an beiden Enden; an der Endstelle wird das Pferd an die andere
   Stirnseite gespannt (wie früher: der Wagen dreht nicht, das Pferd geht
   um ihn herum).

   Alles sind gebackene Laufblätter (werkzeug/stadt-backen.js, backplan
   „leute": l_fuhr_korn / _mehl / _leer / _bahn, je 5 Spalten = vier
   Gangbilder und Stehen × 8 Richtungen, Schatten im Blatt; im kleinen
   Rahmen die Zwergblätter _z). Positionen kommen nur zur Laufzeit aus
   ST.dorf (dorf.js wird unabhängig davon umgebaut).
   Im kleinen Rahmen und im Sparmodus höchstens ein Wagen, sonst zwei
   Kornwagen und die Pferdebahn.

   ZEICHNEN (szene.js ruft wie bei der Eisenbahn): boden() – Feldwege und
   Pferdebahngleis flach unter allem; sichtbar() – je Fuhrwerk ein
   Eintrag wie bei den Leuten (Tiefensortierung zwischen die Häuser).
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, K = ST.kamera, SZ = ST.szene, LB = ST.bilder;
  const FW = (ST.fuhrwerk = { wagen: [], bahn: null, feldwege: [], t: 0, versatz: 0 });
  const TAU = Math.PI * 2;
  const klemm = (v, a, b) => (v < a ? a : v > b ? b : v);

  /* ---------------- Maße und Tempo ---------------- */
  /* Kornwagen: Modellursprung zwischen Kutschbock und Pferd; Pferdenase 3,3 m davor, Wagenende 3,2 m dahinter, 2 m breit */
  const WAGEN = { vorn: 3.4, hinten: 3.2, breit: 1.0, V: 1.4, HALT: 12, seite: 0.45 };
  /* Pferdebahn: Wagenmitte 1,6 m hinter dem Modellursprung (pferdebahn.js YW), Pferd bis 6,4 m vor der Wagenmitte,
     hinteres Stirnende 3,1 m dahinter, 2,3 m breit */
  const BAHN = { YW: 1.6, vorn: 6.4, hinten: 3.1, breit: 1.2, V: 1.8, HALT: 10, SPUR: 0.5 };
  const BESCHL = 0.45;              // Anfahren und Anhalten (m/s²), ein Pferd im Schritt
  const SCHRITT_L = 1.75;           // ein Gangzyklus (vier Tritte) ≈ 1,75 m
  const NACHT = 0.6;                // ab diesem Nachtgrad ruhen die Kornwagen

  /* ---------------- Strecken (Polylinien, alle 0,5 m ein Punkt) ---------------- */
  function strecke(pts) {
    const X = [pts[0][0]], Y = [pts[0][1]];
    for (let j = 1; j < pts.length; j++) {
      const ax = pts[j - 1][0], ay = pts[j - 1][1], dx = pts[j][0] - ax, dy = pts[j][1] - ay, L = Math.hypot(dx, dy);
      if (L < 1e-6) continue;
      const n = Math.max(1, Math.round(L / 0.5));
      for (let k = 1; k <= n; k++) { X.push(ax + dx * k / n); Y.push(ay + dy * k / n); }
    }
    /* Bogenlänge je Punkt (nicht ganz gleichmäßig, weil jede Kante auf ganze Halbmeter gerundet ist) */
    const S = [0];
    for (let i = 1; i < X.length; i++) S.push(S[i - 1] + Math.hypot(X[i] - X[i - 1], Y[i] - Y[i - 1]));
    return { X: X, Y: Y, S: S, n: X.length - 1, L: S[S.length - 1] };
  }
  /* Punkt auf der Strecke bei Bogenlänge s, Richtung aus der Sehne ±c (ruhig in Kurven) */
  function an(W, s, c) {
    s = klemm(s, 0, W.L);
    let lo = 0, hi = W.n;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (W.S[m] <= s) lo = m; else hi = m; }
    const i = lo, j = Math.min(W.n, i + 1), seg = (W.S[j] - W.S[i]) || 1, f = klemm((s - W.S[i]) / seg, 0, 1);
    const x = W.X[i] + (W.X[j] - W.X[i]) * f, y = W.Y[i] + (W.Y[j] - W.Y[i]) * f;
    let tx = W.X[j] - W.X[i], ty = W.Y[j] - W.Y[i];
    if (c) { const A = an(W, s - c), B = an(W, s + c); tx = B.x - A.x; ty = B.y - A.y; }
    const l = Math.hypot(tx, ty) || 1;
    return { x: x, y: y, tx: tx / l, ty: ty / l };
  }
  FW.an = an;
  FW.strecke = strecke;   // FASSUNG 815 — die Autos (autos.js) rechnen mit denselben Strecken
  function naechsteStelle(W, x, y, bis) {
    let b = 0, d0 = Infinity;
    for (let i = 0; i <= W.n; i++) { if (bis != null && W.S[i] > bis) break; const d = (W.X[i] - x) * (W.X[i] - x) + (W.Y[i] - y) * (W.Y[i] - y); if (d < d0) { d0 = d; b = i; } }
    return { s: W.S[b], d: Math.sqrt(d0) };
  }

  /* ---------------- Wegenetz aus den Wegen des Dorfes ---------------- */
  /* Knoten = alle Punkte der Wege; Punkte, die (fast) zusammenfallen, sind eine Kreuzung */
  let netz = null;
  function netzBauen() {
    const D = ST.dorf || {}, P = [], N = [], raster = new Map();
    const schl = (x, y) => Math.round(x) + "," + Math.round(y);
    const finde = (x, y) => {
      const gx = Math.round(x), gy = Math.round(y);
      for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) {
        const l = raster.get((gx + a) + "," + (gy + b)); if (!l) continue;
        for (const i of l) if (Math.hypot(P[i][0] - x, P[i][1] - y) < 0.8) return i;
      }
      P.push([x, y]); N.push([]);
      const k = schl(x, y); if (!raster.has(k)) raster.set(k, []); raster.get(k).push(P.length - 1);
      return P.length - 1;
    };
    const kante = (a, b) => { if (a === b || N[a].indexOf(b) >= 0) return; N[a].push(b); N[b].push(a); };
    let linien = [];
    if (Array.isArray(D.WEGE) && D.WEGE.length) linien = D.WEGE;
    else if (ST.leute && ST.leute.knoten && ST.leute.knoten.length && ST.leute.nachbarn) {
      /* Rundling (?vorlage=rundling): das Netz der Leute */
      const kn = ST.leute.knoten, nb = ST.leute.nachbarn;
      for (let i = 0; i < kn.length; i++) for (const j of nb[i]) if (j > i) linien.push([kn[i], kn[j]]);
    }
    for (const w of linien) {
      let v = finde(w[0][0], w[0][1]);
      for (let i = 1; i < w.length; i++) { const n = finde(w[i][0], w[i][1]); kante(v, n); v = n; }
    }
    netz = { P: P, N: N, linien: linien };
    FW.netz = netz;
    return netz;
  }
  function knotenBei(x, y) {
    let b = -1, d0 = Infinity;
    for (let i = 0; i < netz.P.length; i++) { const d = Math.hypot(netz.P[i][0] - x, netz.P[i][1] - y); if (d < d0) { d0 = d; b = i; } }
    return { i: b, d: d0 };
  }
  /* kürzester Weg (Dijkstra) als Punktliste */
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
    const aus = []; for (let v = b; v >= 0; v = vor[v]) aus.push(netz.P[v]);
    return aus.reverse();
  }

  /* ---------------- Hindernisse (Häuser, Wahrzeichen, Kulisse, Schmuck) ---------------- */
  /* Grundfläche mit Maßstab (die Bilder werden mit o.stufe gemalt); Brücken und Flaches stören nicht */
  function hindernisse() {
    return SZ.objekte.filter((o) => o.art !== "natur" && !SZ.flach(o) && !/^d_(bruecke|laterne)/.test(o.bild || "") && o.fuss);
  }
  function drin(o, x, y, rand) {
    const w = (o.dreh || 0) * Math.PI / 2, c = Math.cos(w), s = Math.sin(w), dx = x - o.x, dy = y - o.y;
    const lx = dx * c + dy * s, ly = -dx * s + dy * c, k = o.stufe || 1;
    return Math.abs(lx) < o.fuss[0] * k / 2 + rand && Math.abs(ly) < o.fuss[1] * k / 2 + rand;
  }
  /* Steht ein Fahrzeug bei s (Blick in Richtung dir = ±1 längs der Strecke) frei von den Dingen in liste? */
  function fussFrei(W, s, dir, M, liste) {
    for (let d = -M.hinten; d <= M.vorn + 0.01; d += 0.8) {
      const p = an(W, s + dir * d);
      for (const o of liste) if (drin(o, p.x, p.y, M.breit * 0.8)) return false;
    }
    return true;
  }

  /* ---------------- Brücken: über den Buckel fahren ---------------- */
  /* Längsprofil wie stadt/modelle/bruecke.js: 11,2 m lang (Modell-y), Scheitel 1,68 m, Kuppe r = 2,4 m, Fuß r = 0,9 m,
     2,9 m zwischen den Brüstungen – ein Fuhrwerk passt gerade hindurch (mittig) */
  const BR = { L: 5.6, krone: 1.68, rk: 2.4, rf: 0.9, halb: 1.8 };
  const BRP = (() => { const S = BR.rk + BR.rf, m = (BR.L - Math.sqrt(BR.L * BR.L - 2 * S * BR.krone)) / S; return { m: m, u1: m * BR.rk, u2: BR.L - m * BR.rf, z1: BR.krone - m * m * BR.rk / 2 }; })();
  function zDeck(y) {
    const u = Math.abs(y);
    if (u >= BR.L) return 0;
    if (u <= BRP.u1) return BR.krone - u * u / (2 * BR.rk);
    if (u <= BRP.u2) return BRP.z1 - BRP.m * (u - BRP.u1);
    const d = BR.L - u; return d * d / (2 * BR.rf);
  }
  let bruecken = [];
  function aufBruecke(x, y) {
    for (const o of bruecken) {
      const w = (o.dreh || 0) * Math.PI / 2, c = Math.cos(w), s = Math.sin(w), dx = x - o.x, dy = y - o.y, k = o.stufe || 1;
      const lx = (dx * c + dy * s) / k, ly = (-dx * s + dy * c) / k;
      if (Math.abs(lx) < BR.halb && Math.abs(ly) < BR.L) return { o: o, z: zDeck(ly) * k };
    }
    return null;
  }
  /* FASSUNG 826 — auch die Fußgänger (leute.js) gehen über den Buckel */
  FW.aufBruecke = aufBruecke;
  /* 1 weit weg von Brücken, 0 auf der Brücke (dort fährt man mittig) */
  function brueckenFaktor(x, y) {
    let f = 1;
    for (const o of bruecken) f = Math.min(f, klemm((Math.hypot(x - o.x, y - o.y) - 6) / 4, 0, 1));
    return f;
  }
  /* FASSUNG 830 — XANDER: „die Autos verschmelzen mit der Brücke". Die Autos (autos.js) fahren wie die Fuhrwerke über den
     Buckel: dieselbe Deckhöhe und dieselbe Mitte auf der Brücke. */
  FW.aufBruecke = aufBruecke; FW.brueckenFaktor = brueckenFaktor;

  /* ---------------- Felder (Bodenart 2) und Feldwege ---------------- */
  function felderFinden() {
    const B = ST.boden; if (!B || !B.wert) return [];
    const G = 112, zellen = new Map();
    for (let y = -G; y <= G; y += 1) for (let x = -G; x <= G; x += 1) if (B.wert(x, y, 2) > 0.5) zellen.set(x + "," + y, [x, y]);
    /* zusammenhängende Flächen */
    const felder = [], gesehen = new Set();
    for (const [k, z] of zellen) {
      if (gesehen.has(k)) continue;
      const f = [], stapel = [z]; gesehen.add(k);
      while (stapel.length) {
        const p = stapel.pop(); f.push(p);
        for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) {
          const kk = (p[0] + a) + "," + (p[1] + b);
          if (zellen.has(kk) && !gesehen.has(kk)) { gesehen.add(kk); stapel.push(zellen.get(kk)); }
        }
      }
      if (f.length >= 6) felder.push(f);
    }
    return felder;
  }
  /* Für jedes Feld: der nächste Wegknoten und ein Feldweg vom Weg bis an den Feldrand (nicht durchs Wasser, nicht durch Häuser) */
  function feldAnschluss(f, liste) {
    const B = ST.boden;
    let best = null;
    for (const z of f) for (let i = 0; i < netz.P.length; i++) {
      const d = Math.hypot(netz.P[i][0] - z[0], netz.P[i][1] - z[1]);
      if (!best || d < best.d) best = { d: d, i: i, z: z };
    }
    if (!best || best.d > 36) return null;
    const a = netz.P[best.i], zx = best.z[0], zy = best.z[1], L = best.d;
    const pts = [a.slice()];
    if (L > 3) {
      for (let t = 1; t <= Math.ceil(L); t++) {
        const k = Math.min(1, t / L), x = a[0] + (zx - a[0]) * k, y = a[1] + (zy - a[1]) * k;
        if (B.wert(x, y, 1) > 0.2) return null;
        if (liste.some((o) => drin(o, x, y, WAGEN.breit))) return null;
      }
      pts.push([zx, zy]);
    }
    const mx = f.reduce((s, p) => s + p[0], 0) / f.length, my = f.reduce((s, p) => s + p[1], 0) / f.length;
    return { knoten: best.i, abstand: L, weg: pts, mitte: [mx, my], groesse: f.length };
  }

  /* ---------------- Aufbauen ---------------- */
  function haus(name) {
    return SZ.objekte.find((o) => o.art === "haus" && o.spiel === name && (o.stufenZahl || 0) > 0) || null;
  }
  /* Vorplatz eines Hauses: da endet sein Weg (dorf.js legt die Wege an die Hausfront, 8–9 m vor die Mitte) */
  function vorplatz(o) {
    const r = ((o.dreh || 0) * 90 + 90) * Math.PI / 180, d = o.spiel === "muehle" ? 9 : 8;
    return knotenBei(o.x + Math.cos(r) * d, o.y + Math.sin(r) * d).i;
  }
  function anzahl() { return LB.nurKlein || LB.spar ? 1 : 3; }
  FW.aufbauen = function () {
    FW.wagen = []; FW.bahn = null; FW.feldwege = []; FW.grund = "";
    netzBauen();
    bruecken = SZ.objekte.filter((o) => /^d_bruecke/.test(o.bild || ""));
    if (!netz.P.length) { FW.grund = "kein Wegenetz"; return; }
    const liste = hindernisse();
    let platz = anzahl();
    /* --- Kornwagen --- */
    const muehle = haus("muehle"), baeckerei = haus("baeckerei");
    FW.muehle = muehle; FW.baeckerei = baeckerei;
    if (muehle) {
      const felder = felderFinden().map((f) => feldAnschluss(f, liste)).filter(Boolean).sort((a, b) => a.abstand - b.abstand || b.groesse - a.groesse);
      FW.felder = felder;
      const km = vorplatz(muehle), kb = baeckerei ? vorplatz(baeckerei) : -1;
      const n = Math.min(platz, 2, felder.length ? 2 : 0);
      for (let i = 0; i < n; i++) {
        const f = felder[Math.min(i, felder.length - 1)];
        if (!weg(f.knoten, km)) continue;
        if (FW.feldwege.indexOf(f) < 0 && f.weg.length > 1) FW.feldwege.push(f);
        const w = { nr: i, art: "korn", feld: f, km: km, kb: kb, v: 0, ph: i * 0.37, halt: 0, W: null, s: 0, x: 0, y: 0, h: 0, zustand: "laden" };
        /* Start: Wagen 1 lädt auf dem Feld, Wagen 2 steht gerade an der Mühle */
        if (i === 0) wagenAn(w, "feld"); else wagenAn(w, "muehle");
        FW.wagen.push(w);
      }
      platz -= FW.wagen.length;
    } else FW.grund = "keine Mühle im Spielstand";
    /* --- Pferdebahn --- */
    if (platz > 0) bahnBauen(liste);
    /* Bäume auf Feldwegen und Gleis weg (wie bei der Eisenbahn) */
    const lin = FW.feldwege.map((f) => strecke(f.weg)).concat(FW.bahn ? [FW.bahn.W] : []);
    const weg0 = [];
    for (const o of SZ.objekte) {
      if (o.art !== "natur") continue;
      const r = (o.fuss ? Math.max(o.fuss[0], o.fuss[1]) / 2 : 1.5);
      if (lin.some((W) => naechsteStelle(W, o.x, o.y).d < r + 1.6)) weg0.push(o);
    }
    for (const o of weg0) SZ.weg(o);
    FW.geraeumt = weg0.length;
  };

  /* ---------------- Kornwagen: Fahrten ---------------- */
  /* Halt: "feld" (Korn laden), "muehle" (Korn abladen, Mehl laden), "baeckerei" (Mehl abladen) */
  function wagenAn(w, wo) {
    w.wo = wo; w.v = 0; w.W = null;
    const f = w.feld, p = wo === "feld" ? f.weg[f.weg.length - 1] : null;
    if (p) { w.x = p[0]; w.y = p[1]; }
    else {
      /* an Mühle oder Bäckerei: ans Ende der Fahrt dorthin stellen (vom Feld bzw. von der Mühle aus) */
      const W = fahrt(w, wo === "muehle" ? "feld" : "muehle", wo);
      if (W) { const e = an(W.W, W.bis, 2); w.x = e.x; w.y = e.y; w.h = Math.atan2(e.ty, e.tx); }
    }
    w.art = wo === "feld" ? "korn" : wo === "muehle" ? "mehl" : "leer";
    w.zustand = wo === "feld" ? "laden" : "abladen";
    w.halt = wo === "feld" ? WAGEN.HALT * 0.5 : WAGEN.HALT * 0.4;
    if (wo === "feld") { const a = f.weg[0], b = f.weg[f.weg.length - 1]; w.h = Math.atan2(b[1] - a[1], b[0] - a[0]) || 0; }
  }
  function naechsterHalt(w) {
    if (w.wo === "feld") return "muehle";
    if (w.wo === "muehle") return w.kb >= 0 ? "baeckerei" : "feld";
    return "feld";
  }
  /* Eine Fahrt von → nach als Strecke; bis = wo sie endet (vor dem Zielhaus, nicht hinein) */
  function fahrt(w, von, nach) {
    const f = w.feld, knoten = { feld: f.knoten, muehle: w.km, baeckerei: w.kb };
    const k = weg(knoten[von], knoten[nach]); if (!k) return null;
    let pts = k.slice();
    if (von === "feld" && f.weg.length > 1) pts = f.weg.slice().reverse().concat(pts.slice(1));
    if (nach === "feld" && f.weg.length > 1) pts = pts.concat(f.weg.slice(1));
    /* FASSUNG 808 — an Weggabelungen knickt der Weg: Ecken zweimal abrunden (Chaikin), damit das Gespann im Bogen fährt */
    for (let r = 0; r < 2 && pts.length > 2; r++) {
      const neu = [pts[0]];
      for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; neu.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]); }
      neu.push(pts[pts.length - 1]); pts = neu;
    }
    const W = strecke(pts);
    /* Anfang und Ende: nicht im Haus stehen (Grundfläche des Start- und Zielhauses) */
    const hausVon = von === "muehle" ? FW.muehle : von === "baeckerei" ? FW.baeckerei : null;
    const hausNach = nach === "muehle" ? FW.muehle : nach === "baeckerei" ? FW.baeckerei : null;
    let ab = 0, bis = W.L;
    if (hausVon) while (ab < W.L - 1 && !fussFrei(W, ab, 1, WAGEN, [hausVon])) ab += 0.5;
    if (hausNach) while (bis > ab + 1 && !fussFrei(W, bis, 1, WAGEN, [hausNach])) bis -= 0.5;
    return { W: W, ab: ab, bis: bis };
  }
  function losfahren(w) {
    const nach = naechsterHalt(w), F = fahrt(w, w.wo, nach);
    if (!F) { w.halt = WAGEN.HALT; return; }
    /* vom Standort aus: an der nächsten Stelle der ersten 25 m einsteigen, sonst ein kurzes Stück dorthin */
    const st = naechsteStelle(F.W, w.x, w.y, F.ab + 25);
    let W = F.W, ab = Math.max(F.ab, st.s), bis = F.bis;
    if (st.d > 0.6) {
      const p = an(W, ab), rest = [];
      for (let i = 0; i <= W.n; i++) if (W.S[i] > ab) rest.push([W.X[i], W.Y[i]]);
      const neu = strecke([[w.x, w.y], [p.x, p.y]].concat(rest));
      bis = bis - ab + (neu.L - (W.L - ab)); ab = 0; W = neu;
    }
    w.W = W; w.s = ab; w.bis = bis; w.nach = nach; w.v = 0; w.zustand = "faehrt";
  }
  function wagenSchritt(w, dt, nacht) {
    if (!w.W) {
      /* Halt: laden/abladen; nachts ruhen */
      if (nacht) { w.zustand = "ruht"; w.v = 0; return; }
      if (w.zustand === "ruht") w.zustand = w.wo === "feld" ? "laden" : "abladen";
      w.halt -= dt;
      /* nach der halben Zeit ist umgeladen */
      if (w.neueLadung && w.halt <= WAGEN.HALT / 2) { w.art = w.neueLadung; w.neueLadung = null; }
      /* in den letzten 3 s dreht der Fuhrmann das Gespann in die neue Richtung */
      if (w.halt <= 3 && !w.dreh) {
        const F = fahrt(w, w.wo, naechsterHalt(w));
        if (F) { const st = naechsteStelle(F.W, w.x, w.y, F.ab + 25), p = an(F.W, Math.max(F.ab, st.s), 2); w.dreh = { von: w.h, nach: Math.atan2(p.ty, p.tx) }; }
        else w.dreh = { von: w.h, nach: w.h };
      }
      if (w.dreh) { const k = klemm(1 - w.halt / 3, 0, 1), d = ((w.dreh.nach - w.dreh.von) % TAU + 3 * Math.PI) % TAU - Math.PI; w.h = w.dreh.von + d * k * k * (3 - 2 * k); }
      if (w.halt <= 0) { w.dreh = null; losfahren(w); }
      return;
    }
    const rest = w.bis - w.s;
    const vmax = Math.min(WAGEN.V, Math.sqrt(Math.max(0, 2 * BESCHL * rest)) + 0.05);
    /* FASSUNG 815 — steht ein Auto (autos.js) vorn im Weg, hält das Pferd an, bis es weg ist */
    if (ST.autos && ST.autos.imWeg && ST.autos.imWeg(w.x, w.y, w.h, WAGEN.vorn, WAGEN.breit)) w.v = Math.max(0, w.v - 2 * BESCHL * dt);
    else w.v = Math.min(vmax, w.v + BESCHL * dt);
    w.wartet = w.v < 0.02 && rest > 0.1;
    w.s = Math.min(w.bis, w.s + w.v * dt);
    w.ph = (w.ph + w.v * dt / SCHRITT_L) % 1;
    lage(w);
    if (w.bis - w.s < 0.02) {
      /* angekommen: Ladung wechseln */
      w.wo = w.nach; w.W = null; w.v = 0; w.halt = WAGEN.HALT;
      w.neueLadung = w.wo === "feld" ? "korn" : w.wo === "muehle" ? "mehl" : "leer";
      w.zustand = w.wo === "feld" ? "laden" : "abladen";
      w.ankuenfte = (w.ankuenfte || 0) + 1;
      (w.besucht || (w.besucht = {}))[w.wo] = (w.besucht[w.wo] || 0) + 1;
    }
  }
  /* Lage auf der Strecke: rechts vom Weg (Rechtsverkehr), Blick längs der Sehne */
  function lage(w) {
    const p = an(w.W, w.s, 2.2), nx = -p.ty, ny = p.tx;
    /* am Anfang und Ende der Fahrt (Feldrand, Vorplatz) mittig */
    const k = klemm(Math.min(w.s, w.bis - w.s) / 4, 0, 1) * WAGEN.seite * brueckenFaktor(p.x, p.y);
    /* FASSUNG 815 — die Schrägansicht spiegelt (Welt-x nach rechts unten, Welt-y nach links unten): (−ty, tx) liegt im Bild
       RECHTS der Fahrtrichtung. Vorher stand hier „−", und die Wagen fuhren im Bild links; jetzt Rechtsverkehr wie die
       Autos (autos.js) – so fährt ein Auto hinter einem Kornwagen in derselben Spur und weicht entgegenkommenden aus. */
    w.x = p.x + nx * k; w.y = p.y + ny * k; w.h = Math.atan2(p.ty, p.tx);
  }

  /* ---------------- Pferdebahn ---------------- */
  function bahnPunkt() {
    const D = ST.dorf || {};
    const b = D.BAHNHOF;
    if (Array.isArray(b)) return [b[0], b[1]];
    if (b && b.x != null) return [b.x, b.y];
    const kb = SZ.objekte.find((o) => o.bild === "k_bahnhof");
    if (kb) { const r = ((kb.dreh || 0) * 90 + 90) * Math.PI / 180, d = kb.fuss[1] / 2 + 3; return [kb.x + Math.cos(r) * d, kb.y + Math.sin(r) * d]; }
    if (Array.isArray(D.BAHN_HALT)) return [D.BAHN_HALT[0], D.BAHN_HALT[1] + 12];
    return null;
  }
  function bahnBauen(liste) {
    const bp = bahnPunkt(); if (!bp) { FW.bahnGrund = "kein Bahnhof"; return; }
    const MARKT = ST.dorf && ST.dorf.MARKT ? ST.dorf.MARKT : [-1, -1];
    const a = knotenBei(MARKT[0], MARKT[1]).i, b = knotenBei(bp[0], bp[1]).i;
    /* FASSUNG 808 — hat die Karte eine eigene Pferdebahn-Straße (ST.dorf.PFERDEBAHN), fährt sie darauf */
    const eigen = ST.dorf && Array.isArray(ST.dorf.PFERDEBAHN) && ST.dorf.PFERDEBAHN.length > 2 ? ST.dorf.PFERDEBAHN : null;
    const k = eigen || (a >= 0 && b >= 0 ? weg(a, b) : null);
    if (!k || k.length < 2) { FW.bahnGrund = "kein Weg vom Markt zum Bahnhof"; return; }
    const W = strecke(k);
    /* frei: an jeder Stelle hat die Bahn (2,3 m breit) Platz; die längste freie Strecke wird Gleis */
    const frei = [];
    for (let i = 0; i <= W.n; i++) frei.push(!liste.some((o) => drin(o, W.X[i], W.Y[i], BAHN.breit)) && ST.boden.wert(W.X[i], W.Y[i], 1) < 0.3);
    let best = null;
    for (let i = 0; i <= W.n;) {
      if (!frei[i]) { i++; continue; }
      let j = i; while (j < W.n && frei[j + 1]) j++;
      if (!best || W.S[j] - W.S[i] > best[1] - best[0]) best = [W.S[i], W.S[j]];
      i = j + 1;
    }
    if (!best || best[1] - best[0] < BAHN.vorn * 2 + 12) { FW.bahnGrund = "zu wenig Platz für ein Gleis"; return; }
    /* Gleis: die freie Strecke; die Wagenmitte hält so, dass das Pferd noch aufs Gleis passt */
    const pts = []; for (let i = 0; i <= W.n; i++) if (W.S[i] >= best[0] - 1e-6 && W.S[i] <= best[1] + 1e-6) pts.push([W.X[i], W.Y[i]]);
    const G = strecke(pts);
    const sA = BAHN.vorn + 0.3, sB = G.L - BAHN.vorn - 0.3;
    /* Fahrplan: anfahren, Schritt, anhalten; Halt je 10 s */
    const L = sB - sA, ta = BAHN.V / BESCHL, da = BAHN.V * ta / 2;
    const fahr = L >= 2 * da ? 2 * ta + (L - 2 * da) / BAHN.V : 2 * Math.sqrt(L / BESCHL);
    FW.bahn = { W: G, sA: sA, sB: sB, fahr: fahr, takt: 2 * (BAHN.HALT + fahr), ph: 0, x: 0, y: 0, h: 0, v: 0, zustand: "steht" };
  }
  /* Weg nach t Sekunden Fahrt (Anfahren – Schritt – Anhalten) */
  function fahrWeg(L, t) {
    const ta = BAHN.V / BESCHL, da = BAHN.V * ta / 2;
    if (L < 2 * da) { const tm = Math.sqrt(L / BESCHL); return t < tm ? { d: BESCHL * t * t / 2, v: BESCHL * t } : { d: L - BESCHL * (2 * tm - t) * (2 * tm - t) / 2, v: BESCHL * (2 * tm - t) }; }
    const tc = (L - 2 * da) / BAHN.V;
    if (t < ta) return { d: BESCHL * t * t / 2, v: BESCHL * t };
    if (t < ta + tc) return { d: da + BAHN.V * (t - ta), v: BAHN.V };
    const r = Math.max(0, 2 * ta + tc - t);
    return { d: L - BESCHL * r * r / 2, v: BESCHL * r };
  }
  /* Stand der Pferdebahn zur Zeit t im Umlauf: Halt am Markt, Fahrt zum Bahnhof, Halt, Fahrt zurück */
  FW.bahnStand = function (t) {
    const P = FW.bahn; if (!P) return null;
    const H = BAHN.HALT, L = P.sB - P.sA;
    t = ((t % P.takt) + P.takt) % P.takt;
    if (t < H) return { s: P.sA, v: 0, dir: t < H / 2 ? -1 : 1, zustand: "haelt", wo: "markt" };
    if (t < H + P.fahr) { const f = fahrWeg(L, t - H); return { s: P.sA + f.d, v: f.v, dir: 1, zustand: "faehrt" }; }
    if (t < 2 * H + P.fahr) return { s: P.sB, v: 0, dir: t < 1.5 * H + P.fahr ? 1 : -1, zustand: "haelt", wo: "bahnhof" };
    const f = fahrWeg(L, t - 2 * H - P.fahr);
    return { s: P.sB - f.d, v: f.v, dir: -1, zustand: "faehrt" };
  };
  FW.bahnUhr = function () { const P = FW.bahn; if (!P) return 0; if (FW.bahnFest != null) return FW.bahnFest; return Date.now() / 1000 + FW.versatz; };
  function bahnSchritt(dt) {
    const P = FW.bahn; if (!P) return;
    const st = FW.bahnStand(FW.bahnUhr());
    const p = an(P.W, st.s, 1.0), tx = p.tx * st.dir, ty = p.ty * st.dir;
    /* Modellursprung liegt 1,6 m vor der Wagenmitte (in Richtung des Pferdes) */
    P.x = p.x + tx * BAHN.YW; P.y = p.y + ty * BAHN.YW; P.mx = p.x; P.my = p.y;
    P.h = Math.atan2(ty, tx); P.v = st.v; P.s = st.s; P.dir = st.dir; P.zustand = st.zustand; P.wo = st.wo;
    P.ph = (P.ph + st.v * dt / SCHRITT_L) % 1;
  }

  /* ---------------- Bewegen (Bildschleife) ---------------- */
  let letzte = 0;
  function schritt(dt) {
    FW.t += dt;
    const Z = SZ.zeitDaten(), nacht = Z.nacht > NACHT;
    FW.nacht = nacht;
    for (const w of FW.wagen) {
      /* nachts: wer unterwegs ist, fährt zu seinem Halt; dort ruht er */
      wagenSchritt(w, dt, nacht);
    }
    bahnSchritt(dt);
  }
  FW.bewegen = function (jetzt) {
    if (!netz) return;
    /* Rundling: das Netz der Leute entsteht erst nach dem Aufbauen – dann einmal nachholen */
    if (!netz.P.length && !FW.nachgeholt && ST.leute && ST.leute.knoten && ST.leute.knoten.length) { FW.nachgeholt = true; FW.aufbauen(); }
    const dt = Math.min(0.1, Math.max(0, (jetzt - (letzte || jetzt)) / 1000)); letzte = jetzt;
    schritt(dt);
  };
  /* für Sonden: n Sekunden in Zehntelschritten vorspulen */
  FW.vorspulen = function (sek) { for (let t = 0; t < sek; t += 0.1) schritt(0.1); };

  /* ---------------- Zeichnen: Boden (Feldwege, Gleis) ---------------- */
  function lichtK(Z) { return [0, 1, 2].map((i) => Math.min(1.05, Z.amb[i] + Z.sonne[i] * 0.9)); }
  const farbe = (f, k, a) => "rgba(" + Math.round(f[0] * k[0]) + "," + Math.round(f[1] * k[1]) + "," + Math.round(f[2] * k[2]) + "," + (a == null ? 1 : a) + ")";
  function sichtbarerBereich() {
    const r = 40 * K.dpr, e = [[-r, -r], [K.W + r, -r], [K.W + r, K.H + r], [-r, K.H + r]].map((p) => ST.aufBoden(p[0], p[1]));
    return { x0: Math.min(...e.map((p) => p[0])), x1: Math.max(...e.map((p) => p[0])), y0: Math.min(...e.map((p) => p[1])), y1: Math.max(...e.map((p) => p[1])) };
  }
  function imBild(W, B) {
    for (let i = 0; i <= W.n; i += 4) if (W.X[i] > B.x0 - 6 && W.X[i] < B.x1 + 6 && W.Y[i] > B.y0 - 6 && W.Y[i] < B.y1 + 6) return true;
    return false;
  }
  /* Band längs einer Strecke (Abstand a … b quer zur Richtung) */
  function band(g, W, a, b, z, schritt) {
    const P = (i, d) => { const j = Math.min(W.n, i + 1), k = Math.max(0, i - 1), tx = W.X[j] - W.X[k], ty = W.Y[j] - W.Y[k], l = Math.hypot(tx, ty) || 1; return ST.proj(W.X[i] - ty / l * d, W.Y[i] + tx / l * d, z); };
    g.beginPath();
    const idx = []; for (let i = 0; i < W.n; i += schritt) idx.push(i); idx.push(W.n);
    idx.forEach((i, n) => { const p = P(i, a); if (n) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); });
    for (let n = idx.length - 1; n >= 0; n--) { const p = P(idx[n], b); g.lineTo(p[0], p[1]); }
    g.closePath();
  }
  function linie(g, W, d, z, schritt) {
    g.beginPath();
    const idx = []; for (let i = 0; i < W.n; i += schritt) idx.push(i); idx.push(W.n);
    idx.forEach((i, n) => {
      const j = Math.min(W.n, i + 1), k = Math.max(0, i - 1), tx = W.X[j] - W.X[k], ty = W.Y[j] - W.Y[k], l = Math.hypot(tx, ty) || 1;
      const p = ST.proj(W.X[i] - ty / l * d, W.Y[i] + tx / l * d, z);
      if (n) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]);
    });
  }
  FW.boden = function (g, t, Z) {
    if (!netz) return;
    const B = sichtbarerBereich(), k = lichtK(Z), winter = SZ.jahr === "winter", s = K.s;
    const grob = s < 5 * K.dpr ? 4 : s < 12 ? 2 : 1;
    g.save();
    /* Feldwege: festgefahrene Erde mit zwei Radspuren, Ränder weich ins Gras */
    for (const f of FW.feldwege) {
      const W = f._W || (f._W = strecke(f.weg));
      if (!imBild(W, B)) continue;
      band(g, W, 1.35, -1.35, 0, grob); g.fillStyle = farbe(winter ? [214, 218, 226] : [150, 128, 96], k, 0.45); g.fill();
      band(g, W, 1.05, -1.05, 0, grob); g.fillStyle = farbe(winter ? [206, 208, 214] : [140, 116, 84], k, 0.9); g.fill();
      if (s >= 4 * K.dpr) {
        g.lineCap = "round"; g.lineJoin = "round";
        for (const d of [-0.8, 0.8]) { linie(g, W, d, 0.01, grob); g.strokeStyle = farbe(winter ? [176, 178, 186] : [108, 88, 62], k, 0.8); g.lineWidth = Math.max(1, 0.22 * s); g.stroke(); }
      }
    }
    /* Pferdebahngleis: Pflasterstreifen, zwei Rillenschienen (Meterspur) */
    const P = FW.bahn;
    if (P && imBild(P.W, B)) {
      const W = P.W;
      band(g, W, 1.25, -1.25, 0.01, grob); g.fillStyle = farbe(winter ? [200, 204, 214] : [132, 126, 118], k, 0.9); g.fill();
      if (s >= 6 * K.dpr) {
        /* Pflasterfugen quer (alle 0,5 m) */
        g.beginPath();
        for (let i = 0; i <= W.n; i += (s < 14 * K.dpr ? 2 : 1)) {
          const j = Math.min(W.n, i + 1), kk = Math.max(0, i - 1), tx = W.X[j] - W.X[kk], ty = W.Y[j] - W.Y[kk], l = Math.hypot(tx, ty) || 1;
          const a = ST.proj(W.X[i] - ty / l * 1.2, W.Y[i] + tx / l * 1.2, 0.012), b = ST.proj(W.X[i] + ty / l * 1.2, W.Y[i] - tx / l * 1.2, 0.012);
          g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]);
        }
        g.strokeStyle = farbe([90, 86, 82], k, 0.35); g.lineWidth = Math.max(0.5, 0.04 * s); g.stroke();
      }
      g.lineCap = "butt"; g.lineJoin = "round";
      for (const d of [-BAHN.SPUR, BAHN.SPUR]) {
        linie(g, W, d, 0.02, grob); g.strokeStyle = farbe([62, 58, 56], k); g.lineWidth = Math.max(1, 0.1 * s); g.stroke();
        linie(g, W, d + 0.03, 0.025, grob); g.strokeStyle = farbe(winter ? [214, 218, 228] : [188, 190, 196], k, 0.9); g.lineWidth = Math.max(0.6, 0.04 * s); g.stroke();
      }
      /* Prellbock-Schwellen an beiden Enden */
      for (const s0 of [0.2, W.L - 0.2]) {
        const p = an(W, s0), nx = -p.ty, ny = p.tx, a = ST.proj(p.x + nx * 0.9, p.y + ny * 0.9, 0.03), b = ST.proj(p.x - nx * 0.9, p.y - ny * 0.9, 0.03);
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.strokeStyle = farbe([96, 70, 48], k); g.lineWidth = Math.max(1.5, 0.25 * s); g.stroke();
      }
    }
    g.restore();
  };

  /* ---------------- Fuhrwerke als Einträge für die Tiefensortierung (wie leute.sichtbar) ---------------- */
  const jahrName = () => (SZ.jahr === "winter" ? "winter" : "herbst");
  function klein() { return !!(LB.nurKlein || (document.body && document.body.classList.contains("lk-mini-modus"))); }
  function blatt(basis) {
    const z = LB.vz[basis + "_z"], g = LB.vz[basis];
    if (z && (!g || ((LB.nurKlein || klein()) && K.s <= z.s * 1.35))) return { name: basis + "_z", meta: z };
    return g ? { name: basis, meta: g } : null;
  }
  function eintrag(aus, Z, art, x, y, h, laeuft, ph, bx, dazu) {
    /* auf einer Brücke: gehoben um die mittlere Deckhöhe unter Pferd, Mitte und Wagenende, und nach der Brücke gemalt */
    let br = null;
    if (bruecken.length) {
      const c = Math.cos(h), s = Math.sin(h), q = [2.8, 0, -2.8].map((d) => aufBruecke(x + c * d, y + s * d));
      const o = q.find(Boolean);
      if (o) br = { o: o.o, z: q.reduce((n, e) => n + (e && e.o === o.o ? e.z : 0), 0) / 3 };
    }
    const P = ST.proj(x, y, br ? br.z : 0), rand = 120 * K.dpr;
    if (P[0] < -rand || P[0] > K.W + rand || P[1] < -rand || P[1] > K.H + rand * 1.5) return;
    const b = blatt("l_fuhr_" + art + "_" + jahrName() + "_" + (Z.nacht > 0.5 ? "nacht" : "tag")); if (!b) return;
    const img = LB.bild(b.name); if (!img) return;
    const gier = Math.atan2(-Math.cos(h), Math.sin(h)) * 180 / Math.PI + K.dreh * 90;
    /* Spalten: vier Gangbilder und Stehen (das Zwergblatt im kleinen Rahmen hat nur ein Bild je Richtung) */
    const n = b.meta.n || 1, gang = n - 1, spalte = n < 3 ? 0 : laeuft ? Math.floor(ph * gang) % gang : gang;
    const r = ST.drehXY(x, y, K.dreh);
    aus.push(Object.assign({ X: P[0], Y: P[1], a: r[0], b: r[1], img: img, meta: b.meta, reihe: ((Math.round(gier / 45) % 8) + 8) % 8, schritt: spalte,
      malen: malen, bx: bx, bh: 3.2 + (br ? br.z : 0), Z: Z, art: art, auf: br ? br.o : null }, dazu));
  }
  FW.sichtbar = function (Z) {
    const aus = [];
    if (!netz) return aus;
    for (const w of FW.wagen) eintrag(aus, Z, w.art, w.x, w.y, w.h, w.v > 0.05, w.ph, 3.3, { wagen: w });
    const P = FW.bahn;
    if (P) eintrag(aus, Z, "bahn", P.x, P.y, P.h, P.v > 0.05, P.ph, 4.8, { bahn: P });
    FW.gezeigt = aus.length;
    return aus;
  };
  function malen(g, p) {
    const m = p.meta, k = K.s / m.s;
    g.drawImage(p.img, p.schritt * m.zw, p.reihe * m.zh, m.zw, m.zh, p.X - m.ax * k, p.Y - m.ay * k, m.zw * k, m.zh * k);
    /* Nachts: Schein der Laterne und der Fenster (Pferdebahn; im Blatt je Zeile gemessen) */
    const Z = p.Z; if (!(Z.nacht > 0.3) || !m.l) return;
    g.save(); g.globalCompositeOperation = "lighter";
    for (const l of m.l) {
      if (l[0] !== p.reihe) continue;
      const x = p.X + l[1] * k, y = p.Y + l[2] * k, R = l[3] * k * 0.8;
      if (R < 1) continue;
      const a = Z.nacht * l[5] * (l[6] ? 0.9 + 0.1 * Math.sin(FW.t * 9) : 1);
      const gr = g.createRadialGradient(x, y, 0, x, y, R);
      gr.addColorStop(0, "rgba(" + l[4] + "," + (0.55 * a).toFixed(3) + ")"); gr.addColorStop(0.25, "rgba(" + l[4] + "," + (0.22 * a).toFixed(3) + ")"); gr.addColorStop(1, "rgba(" + l[4] + ",0)");
      g.fillStyle = gr; g.fillRect(x - R, y - R, 2 * R, 2 * R);
    }
    g.restore();
  }
})();
