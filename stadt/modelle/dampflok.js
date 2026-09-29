/* =====================================================================
   BAUKASTEN-STADT — DIE DAMPFLOK MIT TENDER (lebendes Modell, gebacken)
   ---------------------------------------------------------------------
   XANDER: „die Lok soll aber mehr hinten lang fahren hinten in der
   Stadt" – „dass ich die Eisenbahn wieder hinten lang fahren [sehe] und
   die Eisenbahn brauchen wir auch unbedingt".

   VORBILD: Güterzuglok der Baureihe 50 der Deutschen Reichsbahn (1'E h2,
   ab 1939, die häufigste deutsche Dampflok): Kessel, Rauchkammer,
   Führerhaus und Umlauf schwarz, Rahmen und Räder rot, weiße Radreifen-
   kanten, große Wagner-Windleitbleche neben der Rauchkammer, Schornstein,
   Sand- und Dampfdom auf dem Kessel, vorn das Dreilicht-Spitzensignal
   (zwei Lampen auf der Pufferbohle, eine oben an der Rauchkammer).
   Dazu der Kastentender 2'2' T26 auf zwei Drehgestellen, oben die Kohle.

   MASSE (Meter, Mitte = 0,0,0 auf Schienenoberkante; +y = vorn):
     Lok     12,2 m über Puffer, 3,1 m breit, Schornstein 4,3 m hoch,
             Kuppelräder 1,40 m (5 Achsen), Laufrad 0,85 m
     Tender  8,6 m über Puffer, 2,9 m breit, Kohle bis 3,7 m,
             Räder 1,0 m in zwei Drehgestellen
   NACHT: Stirnlampen hell, im Führerhaus der Schein des Feuers.
   WINTER: Schnee auf dem Dach des Führerhauses, den Windleitblechen und
   der Kohle (der warme Kessel bleibt schwarz).

   Die leichte Stadt bekommt beide als gebackene Blätter (werkzeug/stadt-
   backen.js, backplan.json „leute": je 8 Richtungen, l_bahn_lok und
   l_bahn_tender). Die Schatten wirft die Stadt selbst (stadt-leicht/
   bahn.js), deshalb malen die Modelle keine.

   DER ZUGMALER (ST.zugMaler, auch für die Güterwagen in gueterwagen.js):
   Flächen, Kästen, liegende und stehende Zylinder, Räder, Scheiben und
   Striche kommen in eine Liste; abgewandte Flächen fallen weg (Rückseiten-
   test), der Rest wird nach Schichten (hinteres Fahrwerk → Rahmen →
   vorderes Fahrwerk → Aufbau) und in jeder Schicht nach der Tiefe zum
   Auge sortiert und mit dem Licht der Stadt (ST.lichtFaktor) schattiert.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const AUGE = ST.ZUM_AUGE || [0.6124, 0.6124, 0.5];
  const TAU = Math.PI * 2;
  const rgb = (f, a) => a == null ? "rgb(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + ")" : "rgba(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + "," + a + ")";
  const mal = (f, k) => [Math.min(255, f[0] * k[0]), Math.min(255, f[1] * k[1]), Math.min(255, f[2] * k[2])];
  const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const kreuz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const minus = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

  /* ================= DER ZUGMALER ================= */
  /* Schichten: 0 hinteres Fahrwerk, 1 Rahmen, 2 vorderes Fahrwerk, 3 Aufbau, 4 obenauf */
  function Maler(P) {
    this.P = P; this.t = [];
    this.c = P.c; this.sn = P.sn;
    this.Z = P.Z; this.jahr = P.jahr;
    this.nacht = (P.Z && P.Z.nacht) || 0;
    this.winter = P.jahr === "winter";
  }
  const M = Maler.prototype;
  M.dreh = function (v) { return [v[0] * this.c - v[1] * this.sn, v[0] * this.sn + v[1] * this.c, v[2]]; };
  M.tiefe = function (p) { const r = this.dreh(p); return (r[0] + r[1]) * AUGE[0] + r[2] * AUGE[2]; };
  M.blick = function (n) { const r = this.dreh(n); return r[0] * AUGE[0] + r[1] * AUGE[1] + r[2] * AUGE[2]; };
  M.licht = function (n, f) { return mal(f, ST.lichtFaktor(this.dreh(n), this.Z, 0, this.jahr)); };
  M.bild = function (p) { return this.P.proj(p[0], p[1], p[2]); };
  /* Seite (+1 rechts / −1 links), die zum Auge zeigt */
  M.nahSeite = function () { return this.blick([1, 0, 0]) >= 0 ? 1 : -1; };
  M.schichtVon = function (seite, o) { return o && o.schicht != null ? o.schicht : seite == null ? 3 : (seite === this.nahSeite() ? 2 : 0); };
  /* ebenes Vieleck. o: { n (Normale), innen (Farbe der Rückseite), bias, schicht, hell (leuchtet selbst), linien, alpha } */
  M.flaeche = function (pts, farbe, o) {
    o = o || {};
    let n = o.n || norm(kreuz(minus(pts[1], pts[0]), minus(pts[pts.length - 1], pts[0])));
    let f = farbe;
    if (this.blick(n) < 0) { if (!o.innen) return null; n = [-n[0], -n[1], -n[2]]; f = o.innen; }
    const m = [0, 0, 0]; for (const p of pts) { m[0] += p[0] / pts.length; m[1] += p[1] / pts.length; m[2] += p[2] / pts.length; }
    const it = { art: 0, s: o.schicht != null ? o.schicht : 3, d: this.tiefe(m) + (o.bias || 0), pts: pts,
      farbe: o.hell ? rgb(f) : rgb(this.licht(n, f)), linien: o.linien, alpha: o.alpha, rand: o.rand };
    this.t.push(it); return it;
  };
  /* Quader; farbe = [r,g,b] oder { seite, stirn, oben }; nur sichtbare Flächen, kein Boden */
  M.kasten = function (x0, x1, y0, y1, z0, z1, farbe, o) {
    o = o || {};
    const F = Array.isArray(farbe) ? { seite: farbe, stirn: farbe, oben: farbe } : farbe;
    const b = o.bias || 0, s = o.schicht;
    const oo = (n, extra) => Object.assign({ n: n, bias: b, schicht: s }, extra || {});
    if (!o.ohneOben) this.flaeche([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], F.oben || F.seite, oo([0, 0, 1], { linien: o.linienOben }));
    this.flaeche([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], F.seite, oo([1, 0, 0], { linien: o.linienR || o.linienSeite }));
    this.flaeche([[x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1]], F.seite, oo([-1, 0, 0], { linien: o.linienL || o.linienSeite }));
    if (!o.ohneVorn) this.flaeche([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], F.stirn || F.seite, oo([0, 1, 0], { linien: o.linienVorn }));
    if (!o.ohneHinten) this.flaeche([[x1, y0, z0], [x0, y0, z0], [x0, y0, z1], [x1, y0, z1]], F.stirn || F.seite, oo([0, -1, 0], { linien: o.linienHinten }));
  };
  /* liegender Zylinder längs y (Kessel, Tank). o: { n, kappen: [hinten, vorn] (Farben oder false), von/bis (Winkel), stuecke } */
  M.zylY = function (x, z, r, y0, y1, farbe, o) {
    o = o || {};
    const n = o.n || 18, st = o.stuecke || Math.max(1, Math.round((y1 - y0) / 2.2));
    const a0 = o.von != null ? o.von : 0, a1 = o.bis != null ? o.bis : TAU;
    for (let k = 0; k < st; k++) {
      const ya = y0 + (y1 - y0) * k / st, yb = y0 + (y1 - y0) * (k + 1) / st;
      for (let i = 0; i < n; i++) {
        const u0 = a0 + (a1 - a0) * i / n, u1 = a0 + (a1 - a0) * (i + 1) / n, um = (u0 + u1) / 2;
        const p = (u, y) => [x + Math.cos(u) * r, y, z + Math.sin(u) * r];
        this.flaeche([p(u0, ya), p(u0, yb), p(u1, yb), p(u1, ya)], farbe, { n: [Math.cos(um), 0, Math.sin(um)], bias: o.bias, schicht: o.schicht,
          linien: o.linien ? o.linien.filter((l) => l.y >= ya && l.y < yb).map((l) => [p(u0, l.y), p(u1, l.y), l.b, l.f]) : null });
      }
    }
    const kappe = (y, sgn, f) => {
      if (!f) return;
      const pts = []; for (let i = 0; i < 24; i++) { const u = i / 24 * TAU; pts.push([x + Math.cos(u) * r, y, z + Math.sin(u) * r]); }
      this.flaeche(sgn > 0 ? pts : pts.reverse(), f, { n: [0, sgn, 0], bias: o.bias, schicht: o.schicht, linien: o.kappenLinien });
    };
    if (o.kappen) { kappe(y0, -1, o.kappen[0]); kappe(y1, 1, o.kappen[1]); }
  };
  /* stehender Zylinder (Schornstein, Dom); oben eine Kappe (Farbe oder gewölbt) */
  M.zylZ = function (x, y, r, z0, z1, farbe, o) {
    o = o || {};
    const n = o.n || 14;
    for (let i = 0; i < n; i++) {
      const u0 = i / n * TAU, u1 = (i + 1) / n * TAU, um = (u0 + u1) / 2;
      const r1 = o.r1 != null ? o.r1 : r;
      this.flaeche([[x + Math.cos(u0) * r, y + Math.sin(u0) * r, z0], [x + Math.cos(u1) * r, y + Math.sin(u1) * r, z0], [x + Math.cos(u1) * r1, y + Math.sin(u1) * r1, z1], [x + Math.cos(u0) * r1, y + Math.sin(u0) * r1, z1]],
        farbe, { n: [Math.cos(um), Math.sin(um), (r - r1) / Math.max(0.01, z1 - z0)], bias: o.bias, schicht: o.schicht });
    }
    if (o.kuppel) {
      /* gewölbte Kappe: zwei Ringe */
      const r1 = o.r1 != null ? o.r1 : r, h = o.kuppel;
      const ring = (rr, zz) => { const a = []; for (let i = 0; i < n; i++) { const u = i / n * TAU; a.push([x + Math.cos(u) * rr, y + Math.sin(u) * rr, zz]); } return a; };
      const A = ring(r1, z1), Bq = ring(r1 * 0.62, z1 + h * 0.72);
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n, um = (i + 0.5) / n * TAU;
        this.flaeche([A[i], A[j], Bq[j], Bq[i]], o.kappe || farbe, { n: norm([Math.cos(um), Math.sin(um), 0.9]), bias: (o.bias || 0) + 0.01, schicht: o.schicht });
      }
      this.flaeche(Bq, o.kappe || farbe, { n: [0, 0, 1], bias: (o.bias || 0) + 0.02, schicht: o.schicht });
    } else if (o.kappe !== false) {
      const r1 = o.r1 != null ? o.r1 : r, pts = [];
      for (let i = 0; i < n; i++) { const u = i / n * TAU; pts.push([x + Math.cos(u) * r1, y + Math.sin(u) * r1, z1]); }
      this.flaeche(pts, o.kappe || farbe, { n: [0, 0, 1], bias: (o.bias || 0) + 0.01, schicht: o.schicht });
    }
  };
  /* Rad: kurzer Zylinder quer (Achse x), außen die Scheibe mit Speichen und weißer Reifenkante */
  M.rad = function (seite, xm, y, r, o) {
    o = o || {};
    const breite = o.breite || 0.14, x0 = xm - breite / 2, x1 = xm + breite / 2, z = r;
    const sch = this.schichtVon(seite, o);
    const n = 16;
    for (let i = 0; i < n; i++) {
      const u0 = i / n * TAU, u1 = (i + 1) / n * TAU, um = (u0 + u1) / 2;
      const p = (xx, u) => [xx, y + Math.cos(u) * r, z + Math.sin(u) * r];
      this.flaeche([p(x0, u0), p(x1, u0), p(x1, u1), p(x0, u1)], [70, 70, 72], { n: [0, Math.cos(um), Math.sin(um)], schicht: sch, bias: -0.01 });
    }
    const xs = seite > 0 ? x1 : x0;
    const nrm = [seite, 0, 0];
    if (this.blick(nrm) < 0) return;
    const it = { art: 2, s: sch, d: this.tiefe([xs, y, z]) + 0.02, x: xs, y: y, z: z, r: r, speichen: o.speichen == null ? 12 : o.speichen,
      farbe: rgb(this.licht(nrm, o.farbe || [150, 28, 24])), reifen: rgb(this.licht(nrm, [64, 64, 66])), kante: rgb(this.licht(nrm, [226, 226, 222])),
      dunkel: rgb(this.licht(nrm, (o.farbe || [150, 28, 24]).map((v) => v * 0.55))), gegen: o.gegen, kurbel: o.kurbel,
      /* FASSUNG 818 — Radstellung (Speichen und Gegengewicht drehen sich mit), Reifen- und Kantenfarbe wählbar */
      dreh: o.dreh || 0 };
    if (o.reifen) it.reifen = rgb(this.licht(nrm, o.reifen));
    if (o.kante) it.kante = rgb(this.licht(nrm, o.kante));
    this.t.push(it);
  };
  /* Scheibe mit Normale n (Puffer, Lampen, Rauchkammertür) */
  M.scheibe = function (c, n, r, farbe, o) {
    o = o || {};
    if (this.blick(n) < 0) return null;
    const a = Math.abs(n[2]) > 0.9 ? [1, 0, 0] : norm(kreuz(n, [0, 0, 1])), b = norm(kreuz(n, a));
    const pts = [], k = o.n || 16;
    for (let i = 0; i < k; i++) { const u = i / k * TAU; pts.push([c[0] + (a[0] * Math.cos(u) + b[0] * Math.sin(u)) * r, c[1] + (a[1] * Math.cos(u) + b[1] * Math.sin(u)) * r, c[2] + (a[2] * Math.cos(u) + b[2] * Math.sin(u)) * r]); }
    return this.flaeche(pts, farbe, { n: n, bias: o.bias, schicht: o.schicht, hell: o.hell, linien: o.linien });
  };
  /* Strich im Raum (Griffstangen, Stangen, Kanten); breite in Metern */
  M.strich = function (pts, breite, farbe, o) {
    o = o || {};
    const m = pts[Math.floor(pts.length / 2)], m0 = pts[Math.max(0, Math.floor(pts.length / 2) - 1)];
    const mm = [(m[0] + m0[0]) / 2, (m[1] + m0[1]) / 2, (m[2] + m0[2]) / 2];
    this.t.push({ art: 1, s: o.schicht != null ? o.schicht : 3, d: this.tiefe(mm) + (o.bias || 0), pts: pts, b: breite, f: typeof farbe === "string" ? farbe : rgb(farbe) });
  };
  /* FASSUNG 818 — Nieten: Punkte auf einer Fläche mit Normale n (nur wenn sie zum Auge zeigt) */
  M.nieten = function (pts, r, farbe, o) {
    o = o || {};
    if (o.n && this.blick(o.n) < 0.05) return;
    const m = pts[Math.floor(pts.length / 2)];
    const f = o.n ? this.licht(o.n, farbe) : farbe;
    this.t.push({ art: 3, s: o.schicht != null ? o.schicht : 3, d: this.tiefe(m) + (o.bias || 0), pts: pts, r: r, f: rgb(f), glanz: rgb(f.map((v) => Math.min(255, v * 1.6 + 30))) });
  };
  M.malen = function (g) {
    const s = this.P.s;
    this.t.sort((u, v) => (u.s - v.s) || (u.d - v.d));
    g.lineJoin = "round"; g.lineCap = "round";
    const linie = (pts, b, f) => { g.strokeStyle = f; g.lineWidth = Math.max(0.5, b * s); g.beginPath(); pts.forEach((p, i) => { const q = this.bild(p); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); }); g.stroke(); };
    for (const t of this.t) {
      if (t.art === 0) {
        g.beginPath();
        t.pts.forEach((p, i) => { const q = this.bild(p); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); });
        g.closePath();
        if (t.alpha != null) g.globalAlpha = t.alpha;
        g.fillStyle = t.farbe; g.fill();
        /* gleichfarbiger Rand gegen feine Spalten zwischen den Flächen */
        if (t.rand !== false) { g.strokeStyle = t.farbe; g.lineWidth = 0.6; g.stroke(); }
        g.globalAlpha = 1;
        if (t.linien) for (const l of t.linien) linie([l[0], l[1]], l[2], l[3]);
      } else if (t.art === 1) {
        linie(t.pts, t.b, t.f);
      } else if (t.art === 3) {
        /* FASSUNG 818 — Nietreihen: kleine runde Köpfe mit Glanzpunkt */
        const r = Math.max(0.45, t.r * s);
        if (r < 0.6) continue;
        for (const p of t.pts) { const q = this.bild(p); g.fillStyle = t.f; g.beginPath(); g.arc(q[0], q[1], r, 0, TAU); g.fill(); if (r > 1.2) { g.fillStyle = t.glanz; g.beginPath(); g.arc(q[0] - r * 0.3, q[1] - r * 0.3, r * 0.4, 0, TAU); g.fill(); } }
      } else if (t.art === 2) {
        /* Radscheibe: Reifen, rote Scheibe mit Speichen, Nabe, weiße Kante */
        const ring = (rr, fn) => { g.beginPath(); for (let i = 0; i <= 24; i++) { const u = i / 24 * TAU, q = this.bild([t.x, t.y + Math.cos(u) * rr, t.z + Math.sin(u) * rr]); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); } g.closePath(); fn(); };
        ring(t.r, () => { g.fillStyle = t.reifen; g.fill(); });
        ring(t.r * 0.9, () => { g.strokeStyle = t.kante; g.lineWidth = Math.max(0.5, 0.035 * s); g.stroke(); });
        ring(t.r * 0.84, () => { g.fillStyle = t.farbe; g.fill(); });
        if (t.speichen && t.r * s > 5) {
          g.strokeStyle = t.dunkel; g.lineWidth = Math.max(0.5, 0.045 * s);
          g.beginPath();
          for (let i = 0; i < t.speichen; i++) {
            const u = i / t.speichen * TAU + 0.2 + t.dreh, a = this.bild([t.x, t.y + Math.cos(u) * t.r * 0.2, t.z + Math.sin(u) * t.r * 0.2]), b = this.bild([t.x, t.y + Math.cos(u) * t.r * 0.8, t.z + Math.sin(u) * t.r * 0.8]);
            g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]);
          }
          g.stroke();
        }
        if (t.gegen) {
          /* Gegengewicht: dunkler Halbmond */
          g.fillStyle = t.dunkel; g.beginPath();
          for (let i = 0; i <= 10; i++) { const u = Math.PI * 0.95 + i / 10 * Math.PI * 1.1 + t.dreh, q = this.bild([t.x, t.y + Math.cos(u) * t.r * 0.8, t.z + Math.sin(u) * t.r * 0.8]); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); }
          g.closePath(); g.fill();
        }
        ring(t.r * 0.2, () => { g.fillStyle = t.dunkel; g.fill(); });
      }
    }
  };
  /* Schnee: weiße Decke knapp über einer Fläche (leicht unregelmäßiger Rand) */
  M.schneeDach = function (pts, o) {
    if (!this.winter) return;
    this.flaeche(pts, [246, 248, 252], Object.assign({ n: [0, 0, 1], bias: 0.03 }, o || {}));
  };
  ST.zugMaler = function (P) { return new Maler(P); };
  ST.zugFarbe = rgb;

  /* ================= GEMEINSAME TEILE ================= */
  const SCHWARZ = [44, 44, 48], ROT = [156, 30, 26], GRAPHIT = [66, 66, 70], STAHL = [150, 150, 154], MESSING = [196, 160, 72];
  const LAMPE_AUS = [214, 218, 206], LAMPE_AN = [255, 244, 196];
  ST.zugTeile = { SCHWARZ: SCHWARZ, ROT: ROT, STAHL: STAHL };
  /* Puffer (Hülse + Teller) an einem Ende: sgn +1 vorn, −1 hinten; y = Stirn der Pufferbohle */
  function puffer(Mw, y, sgn, o) {
    o = o || {};
    for (const x of [-0.875, 0.875]) {
      const y1 = y + sgn * 0.42;
      Mw.zylY(x, 1.06, 0.12, Math.min(y, y + sgn * 0.3), Math.max(y, y + sgn * 0.3), o.huelse || SCHWARZ, { n: 8, stuecke: 1, bias: 0.02 });
      Mw.zylY(x, 1.06, 0.08, Math.min(y + sgn * 0.3, y1), Math.max(y + sgn * 0.3, y1), STAHL, { n: 8, stuecke: 1, bias: 0.02 });
      Mw.scheibe([x, y1, 1.06], [0, sgn, 0], 0.19, [120, 120, 124], { bias: 0.05 });
    }
    /* Schraubenkupplung und Zughaken */
    Mw.strich([[0, y, 1.06], [0, y + sgn * 0.36, 1.02]], 0.07, rgb(Mw.licht([0, sgn, 0], [60, 60, 62])), { bias: 0.03 });
  }
  ST.zugPuffer = puffer;
  /* Lampe: Gehäuse und Glas (nachts hell) */
  function lampe(Mw, x, y, z, sgn, farbeAn) {
    Mw.kasten(x - 0.13, x + 0.13, y - 0.12, y + 0.12, z - 0.14, z + 0.14, SCHWARZ, { bias: 0.04 });
    const an = Mw.nacht > 0.4;
    Mw.scheibe([x, y + sgn * 0.125, z], [0, sgn, 0], 0.095, an ? (farbeAn || LAMPE_AN) : LAMPE_AUS, { hell: an, bias: 0.08, n: 12 });
  }
  ST.zugLampe = lampe;

  /* ================= DIE LOK ================= */
  /* Achsen: Laufachse und fünf Kuppelachsen (y, Radius) */
  const ACHSEN = [[4.55, 0.425, 0], [2.95, 0.7, 1], [1.35, 0.7, 1], [-0.25, 0.7, 1], [-1.85, 0.7, 1], [-3.45, 0.7, 1]];
  const Y_VORN = 5.7, Y_HINTEN = -5.75;          // Pufferbohle vorn / Zugkasten hinten
  const KESSEL_Z = 2.45, KESSEL_R = 0.82, RK_Y0 = 4.05, RK_Y1 = 5.35;
  const FH_Y0 = -5.55, FH_Y1 = -2.45, FH_Z0 = 1.6, FH_Z1 = 3.72, FH_X = 1.45;
  function lokBauen(Mw) {
    const nah = Mw.nahSeite();
    /* --- Fahrwerk --- */
    Mw.kasten(-0.52, 0.52, -5.6, 5.55, 0.62, 1.3, ROT, { schicht: 1 });
    for (const [y, r, kuppel] of ACHSEN) for (const sd of [-1, 1]) Mw.rad(sd, sd * 0.78, y, r, { speichen: kuppel ? 14 : 10, gegen: !!kuppel });
    /* Kuppelstange und Treibstange (vorderes Fahrwerk, außen) */
    for (const sd of [-1, 1]) {
      const sch = sd === nah ? 2 : 0, x = sd * 0.93;
      Mw.strich([[x, 2.95, 0.62], [x, -3.45, 0.62]], 0.1, rgb(Mw.licht([sd, 0, 0], STAHL)), { schicht: sch, bias: 0.3 });
      Mw.strich([[x + sd * 0.05, 4.1, 1.0], [x + sd * 0.05, -0.25, 0.9]], 0.11, rgb(Mw.licht([sd, 0, 0], [170, 170, 172])), { schicht: sch, bias: 0.4 });
      /* Kreuzkopfführung und Steuerung */
      Mw.strich([[x + sd * 0.04, 4.3, 1.05], [x + sd * 0.04, 3.3, 1.05]], 0.08, rgb(Mw.licht([sd, 0, 0], STAHL)), { schicht: sch, bias: 0.35 });
      Mw.strich([[x + sd * 0.07, 3.0, 1.35], [x + sd * 0.07, 1.6, 0.95]], 0.05, rgb(Mw.licht([sd, 0, 0], [120, 120, 124])), { schicht: sch, bias: 0.45 });
      /* Zylinder */
      Mw.zylY(sd * 1.02, 1.08, 0.34, 3.55, 4.85, SCHWARZ, { n: 12, stuecke: 1, schicht: sch, bias: 0.2, kappen: [GRAPHIT, GRAPHIT] });
      Mw.kasten(sd * 1.02 - 0.22, sd * 1.02 + 0.22, 3.6, 4.8, 1.38, 1.55, SCHWARZ, { schicht: sch, bias: 0.25 });
      /* Sandfallrohre vor die Kuppelräder */
      for (const y of [2.95, 1.35]) Mw.strich([[sd * 1.0, y + 0.55, 1.55], [sd * 0.85, y + 0.72, 0.3]], 0.035, rgb(Mw.licht([sd, 0, 0], [60, 60, 62])), { schicht: sch, bias: 0.5 });
    }
    /* Pufferbohle (rot) mit Puffern, Lampen und Kupplung */
    Mw.kasten(-1.5, 1.5, Y_VORN - 0.2, Y_VORN, 0.72, 1.4, { seite: ROT, stirn: ROT, oben: [60, 58, 58] });
    puffer(Mw, Y_VORN, 1);
    /* Schienenräumer */
    Mw.flaeche([[-1.0, Y_VORN + 0.02, 0.72], [1.0, Y_VORN + 0.02, 0.72], [0.6, Y_VORN + 0.3, 0.12], [-0.6, Y_VORN + 0.3, 0.12]], [58, 58, 60], { n: norm([0, 0.9, 0.3]), bias: 0.03 });
    /* Umlauf (Laufblech) mit rotem Rand */
    for (const sd of [-1, 1]) {
      const x0 = sd > 0 ? 0.6 : -1.52, x1 = sd > 0 ? 1.52 : -0.6;
      Mw.kasten(x0, x1, -2.45, Y_VORN - 0.2, 1.48, 1.58, { seite: [70, 26, 22], stirn: [70, 26, 22], oben: [52, 52, 55] }, { bias: -0.2 });
    }
    /* --- Kessel --- */
    const ringe = [];
    for (const y of [-1.8, -0.6, 0.6, 1.8, 3.0]) ringe.push({ y: y, b: 0.05, f: "rgba(120,122,128,0.55)" });
    Mw.zylY(0, KESSEL_Z, KESSEL_R, -2.45, RK_Y0, SCHWARZ, { n: 20, linien: ringe });
    /* Rauchkammer: etwas dicker, graphitgrau, vorn die runde Tür mit Zentralverschluss */
    Mw.zylY(0, KESSEL_Z, KESSEL_R + 0.05, RK_Y0, RK_Y1, GRAPHIT, { n: 20, stuecke: 1 });
    Mw.scheibe([0, RK_Y1 + 0.01, KESSEL_Z], [0, 1, 0], KESSEL_R + 0.05, [58, 58, 62], { bias: 0.01, n: 24 });
    Mw.scheibe([0, RK_Y1 + 0.06, KESSEL_Z], [0, 1, 0], 0.68, [70, 70, 74], { bias: 0.02, n: 24,
      linien: [[[0, RK_Y1 + 0.08, KESSEL_Z - 0.55], [0, RK_Y1 + 0.08, KESSEL_Z + 0.55], 0.04, "rgba(40,40,44,0.8)"], [[-0.5, RK_Y1 + 0.08, KESSEL_Z], [0.5, RK_Y1 + 0.08, KESSEL_Z], 0.05, "rgba(170,170,174,0.9)"]] });
    Mw.scheibe([0, RK_Y1 + 0.1, KESSEL_Z], [0, 1, 0], 0.09, [170, 170, 174], { bias: 0.05, n: 10 });
    /* Rauchkammerträger (Sattel) */
    Mw.kasten(-0.7, 0.7, RK_Y0 + 0.15, RK_Y1 - 0.1, 1.3, 1.9, SCHWARZ, { bias: -0.3 });
    /* Schornstein, Sanddom, Dampfdom, Pfeife, Sicherheitsventile */
    Mw.zylZ(0, 4.72, 0.28, KESSEL_Z + 0.7, 4.12, SCHWARZ, { r1: 0.27, kappe: [26, 26, 28], bias: 0.1 });
    Mw.zylZ(0, 4.72, 0.35, 4.08, 4.28, [36, 36, 40], { kappe: [16, 16, 18], bias: 0.12 });
    Mw.zylZ(0, 2.75, 0.4, KESSEL_Z + 0.6, 3.52, SCHWARZ, { kuppel: 0.18, bias: 0.1 });
    Mw.zylZ(0, 1.3, 0.46, KESSEL_Z + 0.6, 3.62, SCHWARZ, { kuppel: 0.2, bias: 0.1 });
    Mw.zylZ(0.12, 0.4, 0.05, 3.2, 3.62, MESSING, { kappe: MESSING, n: 8, bias: 0.12 });
    Mw.zylZ(-0.14, -1.9, 0.07, 3.15, 3.5, MESSING, { kappe: MESSING, n: 8, bias: 0.12 });
    /* Speisewasservorwärmer quer vor dem Schornstein */
    Mw.zylY(0, KESSEL_Z + 0.95, 0.2, 3.7, 4.35, GRAPHIT, { n: 10, stuecke: 1, kappen: [GRAPHIT, GRAPHIT], bias: 0.08 });
    /* Griffstangen längs am Kessel */
    for (const sd of [-1, 1]) Mw.strich([[sd * 0.9, -2.3, KESSEL_Z + 0.35], [sd * 0.9, RK_Y1 - 0.1, KESSEL_Z + 0.35]], 0.03, "rgb(170,170,170)", { bias: 0.3 });
    /* Wagner-Windleitbleche */
    for (const sd of [-1, 1]) {
      const x = sd * 1.36, pts = [[x, 3.95, 1.58], [x, Y_VORN - 0.25, 1.58], [x, Y_VORN - 0.25, 3.25], [x, 5.1, 3.5], [x, 3.95, 3.5]];
      Mw.flaeche(sd > 0 ? pts : pts.slice().reverse(), SCHWARZ, { n: [sd, 0, 0], innen: [40, 40, 44], bias: 0.15 });
      Mw.strich([[x, 3.95, 3.5], [x, 5.1, 3.5], [x, Y_VORN - 0.25, 3.25]], 0.05, "rgb(80,80,84)", { bias: 0.2 });
      if (Mw.winter) Mw.strich([[x, 3.95, 3.53], [x, 5.1, 3.53]], 0.09, rgb(Mw.licht([0, 0, 1], [246, 248, 252])), { bias: 0.25 });
    }
    /* Stirnlampen: zwei unten auf der Pufferbohle, eine oben an der Rauchkammer */
    lampe(Mw, -0.95, Y_VORN - 0.05, 1.58, 1); lampe(Mw, 0.95, Y_VORN - 0.05, 1.58, 1); lampe(Mw, 0, RK_Y1 + 0.05, KESSEL_Z + 0.98, 1);
    /* Nummernschild an der Rauchkammertür */
    Mw.flaeche([[-0.3, RK_Y1 + 0.09, KESSEL_Z - 0.38], [0.3, RK_Y1 + 0.09, KESSEL_Z - 0.38], [0.3, RK_Y1 + 0.09, KESSEL_Z - 0.24], [-0.3, RK_Y1 + 0.09, KESSEL_Z - 0.24]], [30, 30, 30], { n: [0, 1, 0], bias: 0.06,
      linien: [[[-0.24, RK_Y1 + 0.1, KESSEL_Z - 0.31], [0.24, RK_Y1 + 0.1, KESSEL_Z - 0.31], 0.035, "rgba(230,230,226,0.9)"]] });
    /* --- Führerhaus --- */
    const glut = Mw.nacht > 0.4;
    const fenster = glut ? [255, 176, 92] : [70, 86, 104];
    const fo = { hell: glut };
    /* Seitenwände mit zwei Fenstern und Türöffnung, rote Zierlinie */
    Mw.kasten(-FH_X, FH_X, FH_Y0, FH_Y1, FH_Z0, FH_Z1, SCHWARZ, { ohneOben: true, bias: 0.05 });
    for (const sd of [-1, 1]) {
      const x = sd * (FH_X + 0.01), n = [sd, 0, 0];
      if (Mw.blick(n) < 0) continue;
      for (const [y0, y1] of [[-4.95, -4.2], [-3.95, -3.2]]) Mw.flaeche(sd > 0 ? [[x, y0, 2.62], [x, y1, 2.62], [x, y1, 3.38], [x, y0, 3.38]] : [[x, y1, 2.62], [x, y0, 2.62], [x, y0, 3.38], [x, y1, 3.38]], fenster, Object.assign({ n: n, bias: 0.1 }, fo));
      Mw.flaeche(sd > 0 ? [[x, -2.95, 1.62], [x, -2.55, 1.62], [x, -2.55, 3.1], [x, -2.95, 3.1]] : [[x, -2.55, 1.62], [x, -2.95, 1.62], [x, -2.95, 3.1], [x, -2.55, 3.1]], [22, 22, 24], { n: n, bias: 0.09 });
      Mw.strich([[x, FH_Y0 + 0.05, 2.4], [x, FH_Y1 - 0.05, 2.4]], 0.035, "rgba(170,40,34,0.9)", { bias: 0.12 });
      /* Griffstangen an der Tür */
      Mw.strich([[x + sd * 0.03, -3.02, 1.7], [x + sd * 0.03, -3.02, 3.0]], 0.03, "rgb(190,190,190)", { bias: 0.13 });
    }
    /* Stirnwand: Fenster links und rechts vom Kessel */
    {
      const y = FH_Y1 + 0.01, n = [0, 1, 0];
      if (Mw.blick(n) > 0) for (const sd of [-1, 1]) {
        const x0 = sd * 0.95, x1 = sd * 1.3;
        Mw.flaeche(sd > 0 ? [[x0, y, 2.95], [x1, y, 2.95], [x1, y, 3.4], [x0, y, 3.4]] : [[x1, y, 2.95], [x0, y, 2.95], [x0, y, 3.4], [x1, y, 3.4]], fenster, Object.assign({ n: n, bias: 0.1 }, fo));
      }
    }
    /* Dach: gewölbt, steht über */
    const dach = [], DN = 8;
    for (let i = 0; i <= DN; i++) { const u = -1 + 2 * i / DN; dach.push([u * (FH_X + 0.12), FH_Z1 + 0.34 * (1 - u * u)]); }
    for (let i = 0; i < DN; i++) {
      const a = dach[i], b = dach[i + 1], nx = -(b[1] - a[1]), nz = b[0] - a[0];
      Mw.flaeche([[a[0], FH_Y0 - 0.12, a[1]], [b[0], FH_Y0 - 0.12, b[1]], [b[0], FH_Y1 + 0.12, b[1]], [a[0], FH_Y1 + 0.12, a[1]]], [58, 58, 62], { n: norm([nx, 0, nz]), bias: 0.2 });
      if (Mw.winter) Mw.flaeche([[a[0] * 0.96, FH_Y0 - 0.06, a[1] + 0.07], [b[0] * 0.96, FH_Y0 - 0.06, b[1] + 0.07], [b[0] * 0.96, FH_Y1 + 0.06, b[1] + 0.07], [a[0] * 0.96, FH_Y1 + 0.06, a[1] + 0.07]], [246, 248, 252], { n: norm([nx, 0, nz]), bias: 0.24 });
    }
    /* Stirnseiten des Dachs (Bogen) */
    for (const [y, sg] of [[FH_Y0 - 0.12, -1], [FH_Y1 + 0.12, 1]]) {
      const pts = dach.map((d) => [d[0], y, d[1]]).concat([[FH_X + 0.12, y, FH_Z1 - 0.06], [-FH_X - 0.12, y, FH_Z1 - 0.06]].reverse());
      Mw.flaeche(sg > 0 ? pts.slice().reverse() : pts, [40, 40, 44], { n: [0, sg, 0], bias: 0.19 });
    }
    /* Lüfteraufsatz */
    Mw.kasten(-0.35, 0.35, -4.4, -3.6, FH_Z1 + 0.3, FH_Z1 + 0.5, [50, 50, 54], { bias: 0.3 });
    if (Mw.winter) Mw.kasten(-0.36, 0.36, -4.41, -3.59, FH_Z1 + 0.5, FH_Z1 + 0.55, [246, 248, 252], { bias: 0.32 });
    /* Rückwand (zum Tender) mit Öffnung */
    Mw.flaeche([[FH_X, Y_HINTEN + 0.2, 1.6], [-FH_X, Y_HINTEN + 0.2, 1.6], [-FH_X, Y_HINTEN + 0.2, 2.2], [FH_X, Y_HINTEN + 0.2, 2.2]], [30, 30, 32], { n: [0, -1, 0], bias: -0.1 });
    /* Führerhausboden und Aufstieg */
    Mw.kasten(-FH_X, FH_X, Y_HINTEN, FH_Y0, 1.3, 1.6, SCHWARZ, { bias: -0.2 });
    for (const sd of [-1, 1]) Mw.kasten(sd * FH_X - 0.1, sd * FH_X + 0.1, -3.05, -2.6, 0.55, 0.62, [60, 60, 62], { bias: 0.1 });
    /* Nachts: Feuerschein auf dem Führerhausboden */
    if (glut) Mw.flaeche([[-0.8, -3.2, 1.62], [0.8, -3.2, 1.62], [0.8, -2.6, 1.62], [-0.8, -2.6, 1.62]], [255, 150, 60], { n: [0, 0, 1], hell: true, alpha: 0.7, bias: 0.5 });
  }

  /* ================= DER TENDER ================= */
  const T_Y = 3.85, T_X = 1.42, T_Z0 = 1.3, T_Z1 = 3.3;
  function tenderBauen(Mw) {
    const nah = Mw.nahSeite();
    /* Drehgestelle */
    for (const yd of [-2.35, 2.35]) {
      for (const dy of [-0.85, 0.85]) for (const sd of [-1, 1]) Mw.rad(sd, sd * 0.78, yd + dy, 0.5, { speichen: 0, farbe: ROT });
      for (const sd of [-1, 1]) {
        const sch = sd === nah ? 2 : 0, x = sd * 0.98;
        Mw.flaeche(sd > 0 ? [[x, yd - 1.35, 0.45], [x, yd + 1.35, 0.45], [x, yd + 1.2, 0.85], [x, yd - 1.2, 0.85]] : [[x, yd + 1.35, 0.45], [x, yd - 1.35, 0.45], [x, yd - 1.2, 0.85], [x, yd + 1.2, 0.85]], [60, 30, 26], { n: [sd, 0, 0], schicht: sch, bias: 0.3 });
        for (const dy of [-0.85, 0.85]) Mw.kasten(x - 0.08, x + 0.08, yd + dy - 0.18, yd + dy + 0.18, 0.35, 0.65, [50, 50, 52], { schicht: sch, bias: 0.4 });
      }
    }
    Mw.kasten(-1.2, 1.2, -T_Y - 0.1, T_Y + 0.1, 0.85, T_Z0, ROT, { schicht: 1 });
    /* Kasten mit Kohlenbunker vorn und Wasserkasten hinten */
    Mw.kasten(-T_X, T_X, -T_Y, T_Y, T_Z0, T_Z1, SCHWARZ, {
      linienSeite: [[[T_X * 1, -T_Y + 0.1, T_Z1 - 0.12], [T_X * 1, T_Y - 0.1, T_Z1 - 0.12], 0.03, "rgba(170,40,34,0.85)"]],
      ohneOben: true });
    for (const sd of [-1, 1]) Mw.strich([[sd * (T_X + 0.01), -T_Y + 0.1, T_Z1 - 0.12], [sd * (T_X + 0.01), T_Y - 0.1, T_Z1 - 0.12]], 0.035, "rgba(170,40,34,0.85)", { bias: 0.1 });
    /* Wasserkasten-Deckel mit Füllöffnung (hinten) */
    Mw.flaeche([[-T_X, -T_Y, T_Z1], [T_X, -T_Y, T_Z1], [T_X, -0.8, T_Z1], [-T_X, -0.8, T_Z1]], [52, 52, 56], { n: [0, 0, 1] });
    Mw.zylZ(0, -2.5, 0.32, T_Z1, T_Z1 + 0.12, [40, 40, 44], { bias: 0.05 });
    if (Mw.winter) Mw.flaeche([[-T_X + 0.05, -T_Y + 0.05, T_Z1 + 0.02], [T_X - 0.05, -T_Y + 0.05, T_Z1 + 0.02], [T_X - 0.05, -0.85, T_Z1 + 0.02], [-T_X + 0.05, -0.85, T_Z1 + 0.02]], [246, 248, 252], { n: [0, 0, 1], bias: 0.03 });
    /* Aufsatzbleche um den Kohlenbunker */
    for (const sd of [-1, 1]) {
      const x = sd * T_X, pts = [[x, -0.8, T_Z1], [x, T_Y, T_Z1], [x, T_Y, T_Z1 + 0.45], [x, -0.5, T_Z1 + 0.45]];
      Mw.flaeche(sd > 0 ? pts : pts.slice().reverse(), SCHWARZ, { n: [sd, 0, 0], innen: [34, 34, 36], bias: 0.1 });
    }
    Mw.flaeche([[T_X, -0.8, T_Z1], [-T_X, -0.8, T_Z1], [-T_X, -0.8, T_Z1 + 0.45], [T_X, -0.8, T_Z1 + 0.45]], SCHWARZ, { n: [0, -1, 0], innen: [34, 34, 36], bias: 0.05 });
    /* Kohle: ein Haufen aus Brocken (grauschwarz, glänzend), im Winter mit Schnee */
    const kohle = [];
    const KX = 5, KY = 7;
    const hoehe = (i, j) => { const u = i / KX * 2 - 1, v = j / KY; const h = T_Z1 + 0.35 + 0.35 * (1 - u * u) * Math.sin(Math.min(1, v * 1.3) * Math.PI * 0.9); return h + (ST.hash2(i, j, 51) - 0.5) * 0.14; };
    for (let j = 0; j <= KY; j++) { kohle.push([]); for (let i = 0; i <= KX; i++) kohle[j].push([(-1 + 2 * i / KX) * (T_X - 0.05), -0.75 + (T_Y - 0.05 + 0.75) * j / KY, hoehe(i, j)]); }
    for (let j = 0; j < KY; j++) for (let i = 0; i < KX; i++) {
      const a = kohle[j][i], b = kohle[j][i + 1], c = kohle[j + 1][i + 1], d = kohle[j + 1][i];
      const n = norm(kreuz(minus(b, a), minus(d, a)));
      const f = ST.hash2(i, j, 77) < 0.5 ? [40, 40, 44] : [58, 58, 64];
      Mw.flaeche([a, b, c, d], f, { n: n, bias: 0.2 });
      if (Mw.winter && ST.hash2(i, j, 91) < 0.7) Mw.flaeche([a, b, c, d].map((p) => [p[0], p[1], p[2] + 0.03]), [242, 245, 250], { n: n, bias: 0.22, alpha: 0.85 });
    }
    /* Leiter hinten, Werkzeugkästen */
    for (const sd of [-1, 1]) Mw.strich([[sd * 0.55, -T_Y - 0.03, 1.2], [sd * 0.55, -T_Y - 0.03, T_Z1]], 0.035, "rgb(120,120,124)", { bias: 0.1 });
    for (let z = 1.5; z < T_Z1; z += 0.35) Mw.strich([[-0.55, -T_Y - 0.03, z], [0.55, -T_Y - 0.03, z]], 0.03, "rgb(120,120,124)", { bias: 0.11 });
    Mw.kasten(-1.4, 1.4, T_Y - 0.05, T_Y + 0.2, 1.3, 1.9, SCHWARZ, { bias: 0.02 });
    /* Pufferbohle hinten mit Puffern und zwei Lampen (Zugschluss bei Rückwärtsfahrt) */
    Mw.kasten(-1.45, 1.45, -T_Y - 0.25, -T_Y, 0.8, 1.35, { seite: ROT, stirn: ROT, oben: [60, 58, 58] });
    puffer(Mw, -T_Y - 0.25, -1);
    lampe(Mw, -0.95, -T_Y - 0.2, 1.52, -1, [255, 90, 70]); lampe(Mw, 0.95, -T_Y - 0.2, 1.52, -1, [255, 90, 70]);
  }

  function malenMit(bau) {
    return function (g, P) { const Mw = new Maler(P); bau(Mw, P); g.save(); Mw.malen(g); g.restore(); };
  }
  ST.modell("dampflok", {
    name: "Dampflok (BR 50)", gruppe: "Deko", versteckt: true, live: true, grund: [3.1, 12.2], hoehe: 4.4,
    zeichnen: malenMit(lokBauen)
  });
  ST.modell("tender", {
    name: "Tender (2'2' T26)", gruppe: "Deko", versteckt: true, live: true, grund: [2.9, 8.6], hoehe: 3.8,
    zeichnen: malenMit(tenderBauen)
  });
})();
