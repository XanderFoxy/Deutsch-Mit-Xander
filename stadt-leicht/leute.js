/* =====================================================================
   LEICHTE STADT — DIE MENSCHEN (gebackene Laufbilder)
   ---------------------------------------------------------------------
   XANDER: „Klappt das dann auch mit den Menschen, dass sie ähnlich gut
   performen …"

   Die Spaziergänger von Winterhausen (stadt/modelle/menschen.js) sind
   einmal gebacken: je Person ein Blatt mit 12 Schritten × 8 Richtungen,
   Schatten schon darin (werkzeug/stadt-backen.js, „leute"). Hier gehen
   sie nur noch: auf einem Wegenetz (Anger, Ringstraße, Gassen, Land-
   straßen), mit eigenem Tempo und etwas Abstand zur Wegmitte. Der
   Schritt passt zur Strecke (ein Doppelschritt ≈ 1,43 m), die Richtung
   zur Kamera (8 Blickrichtungen). Nachts sind weniger Leute unterwegs.
   Zwischen die Häuser werden sie richtig einsortiert: ein Mensch steht
   vor allem, dessen Grundriss ganz hinter ihm liegt.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, K = ST.kamera, SZ = ST.szene, LB = ST.bilder;
  const LE = (ST.leute = { liste: [] });
  const rad = (g) => g * Math.PI / 180;

  /* ---------------- Wegenetz ---------------- */
  const knoten = [], nachbarn = [];
  function neu(x, y) { knoten.push([x, y]); nachbarn.push([]); return knoten.length - 1; }
  function kante(a, b) { if (a === b || nachbarn[a].indexOf(b) >= 0) return; nachbarn[a].push(b); nachbarn[b].push(a); }
  function naechster(x, y, aus) { let b = -1, d0 = Infinity; for (const i of aus) { const d = Math.hypot(knoten[i][0] - x, knoten[i][1] - y); if (d < d0) { d0 = d; b = i; } } return b; }
  function netzRundling() {
    const markt = [], ring = [];
    for (let i = 0; i < 12; i++) markt.push(neu(Math.cos(rad(i * 30)) * 10.2, Math.sin(rad(i * 30)) * 10.2));
    for (let i = 0; i < 12; i++) kante(markt[i], markt[(i + 1) % 12]);
    for (let i = 0; i < 36; i++) ring.push(neu(Math.cos(rad(i * 10)) * 34, Math.sin(rad(i * 10)) * 34));
    for (let i = 0; i < 36; i++) kante(ring[i], ring[(i + 1) % 36]);
    /* Gassen zwischen den inneren Häusern */
    for (let k = 0; k < 8; k++) {
      const w = rad(22.5 + k * 45), a = naechster(Math.cos(w) * 10.2, Math.sin(w) * 10.2, markt);
      const m1 = neu(Math.cos(w) * 18, Math.sin(w) * 18), m2 = neu(Math.cos(w) * 26, Math.sin(w) * 26);
      const e = naechster(Math.cos(w) * 34, Math.sin(w) * 34, ring);
      knoten[a] = [Math.cos(w) * 10.2, Math.sin(w) * 10.2];
      kante(a, m1); kante(m1, m2); kante(m2, e); knoten[e] = [Math.cos(w) * 34, Math.sin(w) * 34];
    }
    /* Landstraßen hinaus (Sackgassen: dort drehen sie um) */
    for (const [w, pts] of [[270, [[1.5, -44], [0, -52]]], [90, [[-1.5, 44], [0, 53]]], [180, [[-44, 1.5], [-52, 0]]], [0, [[44, -1], [54, 0]]]]) {
      let v = naechster(Math.cos(rad(w)) * 34, Math.sin(rad(w)) * 34, ring);
      for (const p of pts) { const n = neu(p[0], p[1]); kante(v, n); v = n; }
    }
  }
  /* FASSUNG 807 — Originalkarte: die Leute gehen auf den Wegen von dorf.js (D.WEGE); Punkte, die sich treffen, werden
     zu einer Kreuzung zusammengelegt. */
  /* FASSUNG 826 — XANDER: „ich möchte Bewegung auf den Straßen auf den Weg Leute sollen über die Brücke laufen". Die
     Wegpunkte auf einer Brücke (Auffahrt, Mitte, Abfahrt – dorf.js D.BRUECKEN) werden immer Knoten, damit niemand
     neben der Brücke durchs Wasser abkürzt; wer an eine Brücke kommt, geht gern hinüber. */
  const brueckenPunkt = (x, y) => (ST.dorf && ST.dorf.BRUECKEN || []).some((b) => Math.hypot(b.x - x, b.y - y) < 7.2);
  LE.brueckenKnoten = new Set();
  function netzWege(wege) {
    const finde = (x, y) => { for (let i = 0; i < knoten.length; i++) if (Math.hypot(knoten[i][0] - x, knoten[i][1] - y) < 2.5) return i; return neu(x, y); };
    for (const w of wege) {
      let v = finde(w[0][0], w[0][1]), seit = 0;
      for (let i = 1; i < w.length; i++) {
        seit += Math.hypot(w[i][0] - w[i - 1][0], w[i][1] - w[i - 1][1]);
        const br = brueckenPunkt(w[i][0], w[i][1]);
        if (br || (i + 1 < w.length && brueckenPunkt(w[i + 1][0], w[i + 1][1]))) { seit = 0; const n = finde(w[i][0], w[i][1]); kante(v, n); v = n; if (br) LE.brueckenKnoten.add(n); continue; }
        if (seit < 5 && i < w.length - 1) continue;
        seit = 0; const n = finde(w[i][0], w[i][1]); kante(v, n); v = n;
      }
    }
  }
  function netzBauen() {
    if (knoten.length) return;
    if (ST.dorf && ST.dorf.WEGE) netzWege(ST.dorf.WEGE); else netzRundling();
    LE.knoten = knoten; LE.nachbarn = nachbarn;   // FASSUNG 810: auch für die Fuhrwerke (Rundling)
  }

  /* ---------------- Leute ---------------- */
  const ARTEN = 6;
  function menschNeu(i, rng) {
    const start = Math.floor(rng() * knoten.length);
    const nb = nachbarn[start];
    /* FASSUNG 796 — Sparmodus: nur zwei Figurenblätter statt sechs (je ≈ 90 KB) */
    return { art: i % (ST.bilder && ST.bilder.spar ? 2 : ARTEN), von: start, nach: nb[Math.floor(rng() * nb.length)], t: rng(), tempo: 1.15 + rng() * 0.35, seite: (rng() - 0.5) * 1.3, ph: rng(), rng: rng, nachts: rng() < 0.35, pause: 0 };
  }
  LE.setzen = function (anzahl) {
    netzBauen();
    const rng = ST.zufall(20251224);
    LE.liste = [];
    for (let i = 0; i < anzahl; i++) LE.liste.push(menschNeu(i, rng));
  };
  function lage(m) {
    const a = knoten[m.von], b = knoten[m.nach], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const nx = -dy / l, ny = dx / l;
    return { x: a[0] + dx * m.t + nx * m.seite, y: a[1] + dy * m.t + ny * m.seite, h: Math.atan2(dy, dx), l: l };
  }
  let letzte = 0;
  LE.bewegen = function (jetzt) {
    const dt = Math.min(0.1, Math.max(0, (jetzt - (letzte || jetzt)) / 1000)); letzte = jetzt;
    for (const m of LE.liste) {
      if (m.pause > 0) { m.pause -= dt; continue; }
      const L = lage(m);
      const s = m.tempo * dt;
      m.t += s / L.l;
      m.ph = (m.ph + s / 1.43) % 1;
      if (m.t >= 1) {
        const alt = m.von; m.von = m.nach; m.t = 0;
        const nb = nachbarn[m.von].filter((n) => n !== alt);
        /* FASSUNG 826 — an einer Kreuzung vor der Brücke geht man meist hinüber */
        const zurBruecke = nb.filter((n) => LE.brueckenKnoten.has(n));
        m.nach = zurBruecke.length && m.rng() < 0.6 ? zurBruecke[Math.floor(m.rng() * zurBruecke.length)] : nb.length ? nb[Math.floor(m.rng() * nb.length)] : alt;
        if (m.rng() < 0.06) m.pause = 1 + m.rng() * 4;       // stehen bleiben, schauen
      }
    }
  };

  /* ---------------- Zeichnen (von szene.js aufgerufen) ---------------- */
  /* Liste der sichtbaren Leute mit Bildpunkt und Blatt */
  LE.sichtbar = function (Z) {
    const aus = [];
    if (LB.nurKlein) return aus;   // FASSUNG 805: im kleinen Rahmen keine Laufblätter (je ≈ 90 KB)
    const jahr = SZ.jahr === "winter" ? "winter" : "herbst", zeit = Z.nacht > 0.5 ? "nacht" : "tag";
    for (const m of LE.liste) {
      if (Z.nacht > 0.9 && !m.nachts) continue;
      /* FASSUNG 826 — auf einer Brücke: um die Deckhöhe gehoben und nach der Brücke gemalt (wie die Fuhrwerke) */
      const L = lage(m), br = ST.fuhrwerk && ST.fuhrwerk.aufBruecke ? ST.fuhrwerk.aufBruecke(L.x, L.y) : null, P = ST.proj(L.x, L.y, br ? br.z : 0);
      if (P[0] < -80 || P[0] > K.W + 80 || P[1] < -80 || P[1] > K.H + 200) continue;
      const name = "l_geher" + m.art + "_" + jahr + "_" + zeit, meta = LB.vz[name];
      if (!meta) continue;
      const img = LB.bild(name); if (!img) continue;
      const gier = Math.atan2(-Math.cos(L.h), Math.sin(L.h)) * 180 / Math.PI + K.dreh * 90;
      const reihe = ((Math.round(gier / 45) % 8) + 8) % 8;
      const schritt = m.pause > 0 ? 0 : Math.floor(m.ph * meta.n) % meta.n;
      const r = ST.drehXY(L.x, L.y, K.dreh);
      aus.push({ X: P[0], Y: P[1], a: r[0], b: r[1], img: img, meta: meta, reihe: reihe, schritt: schritt, auf: br ? br.o : null, bh: br ? 2 + br.z : 2 });
    }
    return aus;
  };
  LE.malen = function (g, p) {
    const m = p.meta, k = K.s / m.s;
    g.drawImage(p.img, p.schritt * m.zw, p.reihe * m.zh, m.zw, m.zh, p.X - m.ax * k, p.Y - m.ay * k, m.zw * k, m.zh * k);
  };
})();
