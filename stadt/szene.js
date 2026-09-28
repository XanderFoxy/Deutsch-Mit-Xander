/* =====================================================================
   BAUKASTEN-STADT — DIE SZENE (alles zusammensetzen, jedes Bild neu)
   ---------------------------------------------------------------------
   Reihenfolge je Bild:
     1. Boden (WebGL, Wiese/Schnee/Bach)
     2. Schatten aller Dinge auf einer eigenen Ebene (so werden zwei
        überlappende Schatten nicht doppelt dunkel), bläulich auf Schnee
     3. Gebäude, Bäume, Menschen – von hinten nach vorn
     4. Lebendiges: Rauch, Arbeiter, Fahnen
     5. Lichtschein (Fenster, Laternen, Lichterketten) – addierend
     6. Wetter und Himmel: Schneefall, Weihnachtsmann
   ===================================================================== */
(function () {
  "use strict";
  const ST = (window.STADT = window.STADT || {});
  const K = ST.kamera;

  const SZ = (ST.szene = {
    objekte: [],
    jahr: "winter",
    zeit: "abend",
    naechsteId: 1,
    auswahl: null,
    geist: null,          // Vorschau beim Platzieren
    zeitraffer: 1,        // Baustellen schneller ablaufen lassen
    schneefall: true,
    zuhoerer: []
  });

  SZ.zeitDaten = function () { return Object.assign({ name: SZ.zeit }, ST.ZEITEN[SZ.zeit]); };

  /* Objekt hinzufügen */
  SZ.neu = function (typ, x, y, gier, extra) {
    const def = ST.MODELLE[typ];
    if (!def) throw new Error("Unbekanntes Modell " + typ);
    const o = Object.assign({ id: SZ.naechsteId++, typ: typ, x: x, y: y, gier: gier || 0, saat: (Math.random() * 1e9) | 0, bau: null }, extra || {});
    SZ.objekte.push(o);
    return o;
  };
  SZ.weg = function (o) { const i = SZ.objekte.indexOf(o); if (i >= 0) SZ.objekte.splice(i, 1); if (SZ.auswahl === o) SZ.auswahl = null; };

  /* Baufortschritt 0…1 (null = fertig) */
  SZ.fortschritt = function (o, jetzt) {
    if (!o.bau) return 1;
    if (o.bau.fest != null) return o.bau.fest;
    const p = (jetzt - o.bau.start) * SZ.zeitraffer / 1000 / o.bau.dauer + (o.bau.vorher || 0);
    return Math.max(0, Math.min(1, p));
  };

  /* Grundriss eines Objekts im Kameraraum (für Reihenfolge und Treffer) */
  function grundKam(o) {
    const def = ST.MODELLE[o.typ];
    const b = (def.grund && def.grund[0]) || 1, t = (def.grund && def.grund[1]) || 1;
    const gier = (o.gier + K.dreh * 90) * Math.PI / 180, c = Math.cos(gier), s = Math.sin(gier);
    const m = ST.drehXY(o.x - K.x, o.y - K.y, K.dreh);
    let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
    for (const [px, py] of [[-b / 2, -t / 2], [b / 2, -t / 2], [b / 2, t / 2], [-b / 2, t / 2]]) {
      const x = m[0] + px * c - py * s, y = m[1] + px * s + py * c;
      a0 = Math.min(a0, x); a1 = Math.max(a1, x); b0 = Math.min(b0, y); b1 = Math.max(b1, y);
    }
    return { a0, a1, b0, b1, ma: m[0], mb: m[1] };
  }

  /* Reihenfolge: A liegt hinter B, wenn A auf einer der beiden
     Bodenachsen ganz vor B endet (beide Achsen zeigen zum Betrachter). */
  function sortieren(liste) {
    const n = liste.length;
    for (const e of liste) { e.nah = (e.g.ma + e.g.mb) * 0.61237; e.vor = []; e.grad = 0; }
    const eps = 0.02;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const A = liste[i], B = liste[j];
      if (A.x1 < B.x0 || B.x1 < A.x0 || A.y1 < B.y0 || B.y1 < A.y0) continue;   // überdecken sich im Bild nicht
      let aHinten;
      if (A.g.a1 <= B.g.a0 + eps || A.g.b1 <= B.g.b0 + eps) aHinten = true;
      else if (B.g.a1 <= A.g.a0 + eps || B.g.b1 <= A.g.b0 + eps) aHinten = false;
      else aHinten = A.nah < B.nah;
      if (aHinten) { A.vor.push(B); B.grad++; } else { B.vor.push(A); A.grad++; }
    }
    /* Kahn mit Vorrang der entfernteren */
    const bereit = liste.filter((e) => e.grad === 0).sort((a, b) => b.nah - a.nah);
    const aus = [];
    while (bereit.length) {
      const e = bereit.pop();
      aus.push(e);
      for (const v of e.vor) { v.grad--; if (v.grad === 0) { let k = bereit.length; while (k > 0 && bereit[k - 1].nah < v.nah) k--; bereit.splice(k, 0, v); } }
    }
    if (aus.length < n) { const rest = liste.filter((e) => aus.indexOf(e) < 0).sort((a, b) => a.nah - b.nah); aus.push(...rest); }
    return aus;
  }

  /* ---------------- Zeichenflächen ---------------- */
  let g = null, leinwand = null, schattenBild = null, sg = null;
  SZ.start = function (flaeche2d) {
    leinwand = flaeche2d; g = leinwand.getContext("2d");
    schattenBild = document.createElement("canvas"); sg = schattenBild.getContext("2d");
  };

  /* Objekt-Optionen für den Modellbauer */
  function optionen(o, jetzt) {
    const bau = SZ.fortschritt(o, jetzt);
    return { jahr: SZ.jahr, bau: bau, saat: o.saat, variante: o.variante, schluessel: (o.variante || "") + "|" + o.saat, objekt: o };
  }

  let sBau = 0, sLetzt = 0, sWechsel = 0, bildStart = 0, nachholen = false;
  const BUDGET_MS = 28;
  SZ.nachholen = function () { return nachholen; };
  const LEER = { leben: [], rauch: [], lichter: [], schatten: null, bild: null, W: 0, H: 0 };
  /* Lichtschein eines Dings: nurBoden = Lichtpfützen (vor allen Dingen),
     sonst Punktlichter (gleich nach dem Ding – was davor steht, verdeckt es) */
  function lichtMalen(g, e, Z, t, nurBoden) {
    if (Z.nacht <= 0.02 || !e.sp.lichter || !e.sp.lichter.length) return;
    g.save();
    g.globalCompositeOperation = "lighter";
    for (const l of e.sp.lichter) {
      if (!!l.boden !== nurBoden) continue;
      const x = e.x0 + l.x * e.k, y = e.y0 + l.y * e.k, r = l.r * e.k;
      if (r < 1) continue;
      const flacker = l.flacker ? 0.85 + 0.15 * Math.sin(t * 9 + x) : 1;
      const a = Z.nacht * l.k * flacker;
      if (l.boden) {
        g.save(); g.translate(x, y); g.scale(1, 0.5);
        const gr = g.createRadialGradient(0, 0, 0, 0, 0, r);
        gr.addColorStop(0, "rgba(" + l.farbe + "," + (0.42 * a).toFixed(3) + ")");
        gr.addColorStop(0.45, "rgba(" + l.farbe + "," + (0.16 * a).toFixed(3) + ")");
        gr.addColorStop(1, "rgba(" + l.farbe + ",0)");
        g.fillStyle = gr; g.fillRect(-r, -r, 2 * r, 2 * r);
        g.restore();
        continue;
      }
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, "rgba(" + l.farbe + "," + (0.55 * a).toFixed(3) + ")");
      gr.addColorStop(0.25, "rgba(" + l.farbe + "," + (0.22 * a).toFixed(3) + ")");
      gr.addColorStop(1, "rgba(" + l.farbe + ",0)");
      g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
    }
    g.restore();
  }
  SZ.sichtbare = [];
  /* Bewegung lebender Dinge (Menschen laufen, Schlitten fliegen): je Bild */
  let letzteZeit = 0;
  SZ.bewegen = function (jetzt) {
    const dt = Math.min(0.1, Math.max(0, (jetzt - (letzteZeit || jetzt)) / 1000));
    letzteZeit = jetzt;
    for (const o of SZ.objekte) { const d = ST.MODELLE[o.typ]; if (d && d.bewegen) { try { d.bewegen(o, dt, jetzt / 1000, SZ); } catch (err) { console.error(err); } } }
    if (ST.himmel && ST.himmel.bewegen) ST.himmel.bewegen(dt, jetzt / 1000, SZ);
  };
  SZ.zeichnen = function (jetzt) {
    const Z = SZ.zeitDaten();
    const t = jetzt / 1000;
    ST.jetzt = jetzt;
    bildStart = performance.now();
    nachholen = false;
    /* Zoom: erst wenn die Finger ruhen, wird in der neuen Größe gemalt */
    if (K.s !== sLetzt) { sLetzt = K.s; sWechsel = jetzt; }
    if (sBau === 0 || SZ.ohneBudget || (sBau !== K.s && jetzt - sWechsel > 160)) sBau = K.s;
    if (leinwand.width !== K.W || leinwand.height !== K.H) { leinwand.width = K.W; leinwand.height = K.H; }
    if (schattenBild.width !== K.W || schattenBild.height !== K.H) { schattenBild.width = K.W; schattenBild.height = K.H; }
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, K.W, K.H);
    sg.setTransform(1, 0, 0, 1, 0, 0);
    sg.clearRect(0, 0, K.W, K.H);

    /* Sichtbare Objekte + ihre Sprites */
    const liste = [];
    const alle = SZ.geist ? SZ.objekte.concat([SZ.geist]) : SZ.objekte;
    for (const o of alle) {
      const def = ST.MODELLE[o.typ];
      if (!def || o.versteckt) continue;
      const P = ST.proj(o.x, o.y, 0);
      const gross = ((def.grund ? Math.max(def.grund[0], def.grund[1]) : 2) + (def.hoehe || 10)) * K.s;
      if (P[0] < -gross || P[0] > K.W + gross || P[1] < -gross * 0.2 || P[1] > K.H + gross) continue;
      const opt = optionen(o, jetzt);
      if (def.live) {
        /* Lebendes (Menschen, Tiere, Fahrzeuge): jedes Bild neu gemalt,
           aber trotzdem richtig hinter/vor Häusern einsortiert */
        const b = Math.max(def.grund[0], def.grund[1]) * K.s, h = (def.hoehe || 2) * K.s;
        liste.push({ o: o, sp: LEER, live: true, X: P[0], Y: P[1], x0: P[0] - b, y0: P[1] - h * 1.2, x1: P[0] + b, y1: P[1] + b * 0.6, g: grundKam(o), opt: opt });
        continue;
      }
      let sp = null;
      const gier = o.gier + K.dreh * 90;
      /* Neu malen nur, wenn es in dieses Bild noch passt – sonst das
         zuletzt benutzte Bild dieses Objekts (anders gezoomt) strecken */
      const schl = ST.spriteSchluessel(o.typ, opt, gier, sBau, Z);
      if (ST.SPEICHER.has(schl) || performance.now() - bildStart < BUDGET_MS || SZ.ohneBudget) {
        try { sp = ST.spriteHolen(o.typ, opt, gier, sBau, Z, t); o._sp = sp; }
        catch (e) { console.error(o.typ, e); continue; }
      } else {
        /* Budget erschöpft: das alte Bild strecken – oder, wenn es noch keins
           gibt, im nächsten Bild malen (so bleibt die Seite flüssig) */
        nachholen = true;
        if (!o._sp || !o._sp.bild || o._sp.bild.width === 0) continue;
        sp = o._sp;
        sp.zuletzt = jetzt;
      }
      let k = K.s / sp.s;
      if (Math.abs(k - 1) < 0.002) k = 1;
      const x0 = P[0] + sp.ox * k, y0 = P[1] + sp.oy * k;
      liste.push({ o: o, sp: sp, k: k, X: P[0], Y: P[1], x0: x0, y0: y0, x1: x0 + sp.W * k, y1: y0 + sp.H * k, g: grundKam(o), opt: opt });
    }
    const reihe = sortieren(liste);
    SZ.sichtbare = reihe;

    /* Hilfen je Objekt: Projektion in Modellkoordinaten (gedreht) */
    for (const e of reihe) {
      const ob = e.o, s = K.s;
      const gier = (ob.gier + K.dreh * 90) * Math.PI / 180, c = Math.cos(gier), sn = Math.sin(gier);
      const proj = (x, y, z) => { const a = x * c - y * sn, b = x * sn + y * c; return [e.X + (a - b) * ST.KX * s, e.Y + (a + b) * ST.KY * s - (z || 0) * ST.KZ * s]; };
      /* Schattenpunkt: wohin ein Punkt (x,y,z) seinen Schatten auf den Boden wirft */
      const schattenAuf = (x, y, z) => { const a = x * c - y * sn, b = x * sn + y * c; const L = ST.LICHT; const sa = a - L[0] / L[2] * (z || 0), sb = b - L[1] / L[2] * (z || 0); return [e.X + (sa - sb) * ST.KX * s, e.Y + (sa + sb) * ST.KY * s]; };
      e.P = { proj: proj, schattenAuf: schattenAuf, s: s, t: t, Z: Z, o: e.opt, g: g, c: c, sn: sn, objekt: ob, def: ST.MODELLE[ob.typ], gier: ob.gier + K.dreh * 90, jahr: SZ.jahr, dpr: K.dpr };
    }
    /* 2. Schatten */
    for (const e of reihe) {
      if (e.live) { const d = ST.MODELLE[e.o.typ]; if (d.schatten) { sg.save(); try { d.schatten(sg, e.P); } catch (err) { console.error(err); } sg.restore(); } }
      else if (e.k === 1) sg.drawImage(e.sp.schatten, Math.round(e.x0), Math.round(e.y0));
      else sg.drawImage(e.sp.schatten, e.x0, e.y0, e.sp.W * e.k, e.sp.H * e.k);
      if (e.o.bau && ST.baustelle && ST.baustelle.schatten) { sg.save(); try { ST.baustelle.schatten(sg, e.P, e.o, e.opt.bau); } catch (err) { console.error(err); } sg.restore(); }
    }
    sg.globalCompositeOperation = "source-in";
    sg.fillStyle = SZ.jahr === "winter" ? "rgb(40,62,120)" : "rgb(22,34,52)";
    sg.fillRect(0, 0, K.W, K.H);
    sg.globalCompositeOperation = "source-over";
    g.globalAlpha = Z.schatten * (SZ.jahr === "winter" ? 1.15 : 1);
    g.drawImage(schattenBild, 0, 0);
    g.globalAlpha = 1;

    /* Lichtpfützen auf dem Boden: vor allen Dingen */
    for (const e of reihe) lichtMalen(g, e, Z, t, true);
    /* 3. + 4. Dinge, von hinten nach vorn, mit ihrem Leben */
    for (const e of reihe) {
      if (e.o === SZ.geist) g.globalAlpha = 0.72;
      const bauAktiv = e.o.bau && ST.baustelle && e.o !== SZ.geist;
      if (bauAktiv && ST.baustelle.hinten) { g.save(); try { ST.baustelle.hinten(g, e.P, e.o, e.opt.bau); } catch (err) { console.error(err); } g.restore(); }
      if (e.live) { g.save(); try { ST.MODELLE[e.o.typ].zeichnen(g, e.P); } catch (err) { console.error(err); } g.restore(); }
      else if (e.k === 1) g.drawImage(e.sp.bild, Math.round(e.x0), Math.round(e.y0));
      else g.drawImage(e.sp.bild, e.x0, e.y0, e.sp.W * e.k, e.sp.H * e.k);
      if (e.sp.leben.length) {
        for (const fn of e.sp.leben) { g.save(); try { fn(g, e.P); } catch (err) { console.error(err); } g.restore(); }
      }
      lichtMalen(g, e, Z, t, false);
      if (bauAktiv && ST.baustelle.vorne) { g.save(); try { ST.baustelle.vorne(g, e.P, e.o, e.opt.bau); } catch (err) { console.error(err); } g.restore(); }
      g.globalAlpha = 1;
      if (e.o === SZ.auswahl) auswahlRahmen(e);
    }
    /* Rauch aus Schornsteinen */
    for (const e of reihe) for (const r of e.sp.rauch) rauchMalen(g, e.x0 + r.x * e.k, e.y0 + r.y * e.k, K.s, t, r.k, e.o.id, Z);
    /* Dunst: weiter hinten (oben im Bild) wird die Luft sichtbar – gibt Tiefe */
    {
      const h = K.H * 0.32;
      const farbe = Z.nacht > 0.8 ? "18,26,58" : Z.nacht > 0.3 ? "70,86,130" : SZ.jahr === "winter" ? "215,226,240" : "196,214,232";
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, "rgba(" + farbe + "," + (0.34 * Math.min(1, 14 * K.dpr / K.s + 0.25)).toFixed(3) + ")");
      gr.addColorStop(1, "rgba(" + farbe + ",0)");
      g.fillStyle = gr; g.fillRect(0, 0, K.W, h);
    }
    /* 6. Himmel, Wetter */
    if (ST.himmel && ST.himmel.zeichnen) { try { ST.himmel.zeichnen(g, t, Z, SZ); } catch (err) { console.error(err); } }
    if (SZ.jahr === "winter" && SZ.schneefall) schneefall(g, t);
    for (const fn of SZ.zuhoerer) fn(g, t, Z);
  };

  function auswahlRahmen(e) {
    const def = ST.MODELLE[e.o.typ];
    const b = def.grund[0] / 2 + 0.3, t = def.grund[1] / 2 + 0.3;
    const gier = e.o.gier * Math.PI / 180, c = Math.cos(gier), s = Math.sin(gier);
    g.save();
    g.beginPath();
    [[-b, -t], [b, -t], [b, t], [-b, t]].forEach(([x, y], i) => { const P = ST.proj(e.o.x + x * c - y * s, e.o.y + x * s + y * c, 0); if (i) g.lineTo(P[0], P[1]); else g.moveTo(P[0], P[1]); });
    g.closePath();
    g.lineWidth = Math.max(2, K.s * 0.06);
    g.strokeStyle = SZ.geist && e.o === SZ.geist && SZ.geist.frei === false ? "rgba(230,70,60,0.95)" : "rgba(255,235,160,0.95)";
    g.setLineDash([K.s * 0.3, K.s * 0.2]);
    g.stroke();
    g.restore();
  }

  /* Rauch: weiche Wölkchen steigen auf, werden größer, verwehen */
  function rauchMalen(g, x, y, s, t, k, id, Z) {
    const n = 9;
    for (let i = 0; i < n; i++) {
      const ph = (t * 0.16 + i / n + (id % 7) * 0.13) % 1;
      const hoch = ph * 5.5 * s * k;
      const wind = ph * ph * 3.2 * s + Math.sin(t * 0.7 + i * 1.7) * 0.25 * s * ph;
      const r = (0.28 + ph * 1.35) * s * k;
      const a = (1 - ph) * (ph < 0.12 ? ph / 0.12 : 1) * 0.36;
      const cx = x + wind, cy = y - hoch;
      const hell = Z.nacht > 0.5 ? "150,158,180" : Z.nacht > 0.2 ? "200,196,205" : "235,236,240";
      const gr = g.createRadialGradient(cx, cy, 0, cx, cy, r);
      gr.addColorStop(0, "rgba(" + hell + "," + a.toFixed(3) + ")");
      gr.addColorStop(0.6, "rgba(" + hell + "," + (a * 0.45).toFixed(3) + ")");
      gr.addColorStop(1, "rgba(" + hell + ",0)");
      g.fillStyle = gr;
      g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
    }
  }

  /* Schneefall: drei Tiefen, Flocken in echter Größe (≈ 1 cm – im Bild
     nie kleiner als ein Pünktchen), sie taumeln und treiben im Wind */
  function schneefall(g, t) {
    const W = K.W, H = K.H, dpr = K.dpr;
    const ebenen = [[170, 0.55, 0.45, 0.9], [110, 0.85, 0.6, 1.35], [40, 1.25, 0.8, 2.0]];
    g.save();
    for (const [anzahl, tempo, alpha, groesse] of ebenen) {
      const menge = Math.round(anzahl * (W * H) / (1200 * 800) / Math.max(1, dpr * 0.8));
      g.fillStyle = "rgba(255,255,255," + alpha + ")";
      for (let i = 0; i < menge; i++) {
        const h1 = ST.hash2(i, anzahl, 3), h2 = ST.hash2(i, anzahl, 7), h3 = ST.hash2(i, anzahl, 11);
        const fall = (t * tempo * 48 * dpr + h1 * H * 1.2) % (H * 1.2) - H * 0.1;
        const x = ((h2 * W * 1.3 + t * 14 * dpr * tempo + Math.sin(t * (0.8 + h3) + i) * 18 * dpr * tempo) % (W * 1.3)) - W * 0.15;
        const r = (0.7 + h3 * 0.9) * groesse * dpr;
        g.beginPath(); g.arc(x, fall, r, 0, Math.PI * 2); g.fill();
      }
    }
    g.restore();
  }

  /* Treffer: welches Objekt liegt an Bildpunkt (px,py)? Vorderstes zuerst,
     auf den Pixel genau (durchsichtige Stellen zählen nicht). */
  SZ.treffer = function (px, py) {
    const r = SZ.sichtbare;
    for (let i = r.length - 1; i >= 0; i--) {
      const e = r[i];
      if (e.o === SZ.geist || e.live || e.o.rand) continue;
      /* Modelle mit eigener Trefferprüfung (große Wahrzeichen, die in Kacheln malen) */
      const dt = ST.MODELLE[e.o.typ];
      if (dt && typeof dt.treffer === "function") { try { if (dt.treffer(px, py, e.P)) return e.o; } catch (err) { console.error(err); } continue; }
      if (px < e.x0 || px >= e.x1 || py < e.y0 || py >= e.y1) continue;
      try {
        const d = e.sp.bild.getContext("2d").getImageData(Math.floor((px - e.x0) / e.k), Math.floor((py - e.y0) / e.k), 1, 1).data;
        if (d[3] > 30) return e.o;
      } catch (err) { return e.o; }
    }
    return null;
  };

  /* Passt ein Objekt an diese Stelle? (Grundrisse als gedrehte Rechtecke) */
  function ecken(typ, x, y, gier, rand) {
    const def = ST.MODELLE[typ];
    const b = def.grund[0] / 2 + (rand || 0), t = def.grund[1] / 2 + (rand || 0);
    const r = gier * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
    return [[-b, -t], [b, -t], [b, t], [-b, t]].map(([px, py]) => [x + px * c - py * s, y + px * s + py * c]);
  }
  function trennt(A, B) {
    for (const P of [A, B]) for (let i = 0; i < 4; i++) {
      const p = P[i], q = P[(i + 1) % 4], nx = q[1] - p[1], ny = p[0] - q[0];
      let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
      for (const v of A) { const d = v[0] * nx + v[1] * ny; a0 = Math.min(a0, d); a1 = Math.max(a1, d); }
      for (const v of B) { const d = v[0] * nx + v[1] * ny; b0 = Math.min(b0, d); b1 = Math.max(b1, d); }
      if (a1 <= b0 || b1 <= a0) return true;
    }
    return false;
  }
  SZ.passt = function (typ, x, y, gier, ohne) {
    const def = ST.MODELLE[typ];
    if (def.ueberall) return true;
    const A = ecken(typ, x, y, gier, -0.05);
    const halb = ST.boden.GROESSE / 2;
    for (const p of A) if (Math.abs(p[0]) > halb || Math.abs(p[1]) > halb) return false;
    for (const o of SZ.objekte) {
      if (o === ohne || o.rand || ST.MODELLE[o.typ].ueberall || ST.MODELLE[o.typ].live) continue;
      if (!trennt(A, ecken(o.typ, o.x, o.y, o.gier, -0.05))) return false;
    }
    return true;
  };

  /* Speichern im Browser */
  SZ.alsText = function () {
    return JSON.stringify({ v: 1, jahr: SZ.jahr, zeit: SZ.zeit, objekte: SZ.objekte.filter((o) => !ST.MODELLE[o.typ].live).map((o) => ({ typ: o.typ, x: +o.x.toFixed(2), y: +o.y.toFixed(2), gier: Math.round(o.gier), saat: o.saat, variante: o.variante, bau: o.bau, rand: o.rand ? 1 : undefined })), boden: ST.boden.speichern() });
  };
  SZ.ausText = function (txt) {
    const d = JSON.parse(txt);
    SZ.objekte = []; SZ.naechsteId = 1;
    for (const o of d.objekte) if (ST.MODELLE[o.typ]) SZ.neu(o.typ, o.x, o.y, o.gier, { saat: o.saat, variante: o.variante, bau: o.bau, rand: !!o.rand });
    if (d.boden) ST.boden.laden(d.boden);
    if (d.jahr) SZ.jahr = d.jahr;
    if (d.zeit) SZ.zeit = d.zeit;
  };
})();
