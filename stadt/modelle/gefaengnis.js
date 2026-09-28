/* =====================================================================
   GEFÄNGNIS  („gefaengnis") – der alte Stadtturm als Amtsgefängnis
   ---------------------------------------------------------------------
   XANDER: „richtig filigran. Richtig schön ausarbeiten mit schönen
   Texturen" · „keine Comic Grafik … viel mehr am Realismus" · „ohne
   Pixelkanten und komische Vektorrückstände" · „Man soll das Fundament
   sehen beim Aufbauen" · „Du bist dein schlimmster Kritiker".

   Vorbild: die runden „Diebstürme" und Gefängnistürme alter Stadt-
   befestigungen (Lindau, Mühlhausen, Rothenburg). Ein gedrungener
   Rundturm aus Sandsteinquadern, 6 m Durchmesser, 10,6 m Mauerhöhe, mit
   kleinen, tief in die meterdicke Mauer geschnittenen Zellenfenstern und
   schweren Kreuzgittern, Gurtgesims, Konsolfries unter der Traufe und
   einem spitzen Kegeldach aus Schiefer in Schuppendeckung mit
   Wetterfahne. Vor dem Eingang ein Portalvorbau mit rundbogiger,
   ganz mit Eisen beschlagener Tür und Inschrifttafel. Östlich lehnt die
   verputzte Wachstube mit Pultdach, grünen Läden, Schornstein und
   Laterne am Turm.

   Maße (Meter): Turm r = 3,0, Mauer bis 10,6, Kegel bis 15,9, Knauf und
   Fahne bis 17; Wachstube 2,4 × 5,7, Pultdach 5,0 → 3,7. Grund 9 × 9.
   Eingang bei Drehung 0 nach Süden (+y).

   RUNDUNG: Die Turmmauer besteht aus 24 ebenen Feldern. Damit man keine
   Kanten sieht, trägt jedes Feld sein Licht selbst auf – als Verlauf
   zwischen den Normalen seiner beiden Ränder (wie ein weich schattierter
   Zylinder). Die Quader liegen als Muster an der Bogenlänge: jede Fuge
   läuft ohne Sprung über die Feldgrenzen.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const hex = PI.hex, rgb = PI.rgb, misch = PI.misch, hell = PI.hell;
  const RAD = Math.PI / 180;
  const klemm = (x, a, b) => Math.max(a, Math.min(b, x));
  const hash = (a, b, c) => ST.hash2(a, b, c);
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const lerp = (a, b, t) => a + (b - a) * t;
  /* =====================================================================
     HILFEN: Blick und Licht im Modellraum
     ===================================================================== */
  /* Aus Fläche und Licht die Drehung des Modells zurückrechnen: so kennen
     wir die Blickrichtung im Modellraum – für Laibungen, Nischen und die
     Baugrube, in jedem Drehwinkel richtig. */
  function sicht(F) {
    if (F._si) return F._si;
    const f = F.flaeche, u = f.u, v = f.v, n = ST.kreuz(u, v);
    const Lm = [0, 1, 2].map((i) => F.lichtU * u[i] + F.lichtV * v[i] + F.lichtN * n[i]);
    const L = ST.LICHT, th = Math.atan2(L[1], L[0]) - Math.atan2(Lm[1], Lm[0]);
    const c = Math.cos(th), s = Math.sin(th), E = ST.ZUM_AUGE;
    const Em = [E[0] * c + E[1] * s, -E[0] * s + E[1] * c, E[2]];
    const en = dot(Em, n), enS = Math.sign(en || 1) * Math.max(0.14, Math.abs(en));
    const S = { c: c, s: s, E: Em, n: n, eu: dot(Em, u), ev: dot(Em, v), en: en };
    /* Versatz eines um d hinter der Fläche liegenden Punkts */
    S.tief = (d) => [S.eu * d / enS, S.ev * d / enS];
    S.rot = (p) => [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]];
    S.lf = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
    /* Licht einer Teilfläche mit Modellnormale nm relativ zur Trägerfläche */
    S.rel = (nm) => { const l = ST.lichtFaktor(S.rot(nrm(nm)), F.zeit, 0, F.jahr); return [l[0] / Math.max(0.05, S.lf[0]), l[1] / Math.max(0.05, S.lf[1]), l[2] / Math.max(0.05, S.lf[2])]; };
    S.u = u; S.v = v;
    F._si = S;
    return S;
  }
  const mal = (c, k) => [Math.min(255, c[0] * k[0]), Math.min(255, c[1] * k[1]), Math.min(255, c[2] * k[2])];
  function vieleck(g, p) { g.beginPath(); g.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]); g.closePath(); }

  /* Rauschen über wenige Grundmuster (jedes neue Muster kostet Rechenzeit) */
  function rausch(g, x, y, w, h, meter, staerke, saat, okt) {
    const basis = [3, 17, 29][Math.abs(saat | 0) % 3];
    const dx = hash(saat, 1, 2) * meter * 3.1, dy = hash(saat, 2, 3) * meter * 2.7;
    g.save(); g.translate(dx, dy);
    PI.rauschen(g, x - dx, y - dy, w, h, meter, staerke, basis, okt && okt < 4 ? 3 : 4);
    g.restore();
  }

  /* Beliebiges ebenes Vieleck im Raum (Außenseite = n) */
  function polyFlaeche(M, pts, n, malen, extra) {
    n = nrm(n);
    let u = sub(pts[1], pts[0]);
    u = nrm(sub(u, mul(n, dot(u, n))));
    const v = ST.kreuz(n, u);
    const q = pts.map((P) => { const d = sub(P, pts[0]); return [dot(d, u), dot(d, v)]; });
    let a0 = 1e9, b0 = 1e9, a1 = -1e9, b1 = -1e9;
    for (const [a, b] of q) { a0 = Math.min(a0, a); b0 = Math.min(b0, b); a1 = Math.max(a1, a); b1 = Math.max(b1, b); }
    const o = add(pts[0], add(mul(u, a0), mul(v, b0)));
    return M.flaeche(Object.assign({ o: o, u: u, v: v, w: a1 - a0, h: b1 - b0, umriss: q.map(([a, b]) => [a - a0, b - b0]), malen: malen, keinAo: true }, extra || {}));
  }
  /* Senkrechte Wand von p0 nach p1 (von außen gesehen links → rechts) */
  function wandFlaeche(M, name, p0, p1, z0, z1, malen, opt) {
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1], w = Math.hypot(dx, dy);
    if (z1 - z0 < 0.005 || w < 0.005) return null;
    return M.flaeche(Object.assign({ name: name, o: [p0[0], p0[1], z1], u: [dx / w, dy / w, 0], v: [0, 0, -1], w: w, h: z1 - z0, malen: malen, leuchten: malen && malen.leuchten, ao: z0 < 0.05 }, opt || {}));
  }
  /* Waagerechte Fläche (nach oben) über dem Rechteck */
  function deckel(M, name, x0, y0, x1, y1, z, malen, opt) {
    return M.flaeche(Object.assign({ name: name, o: [x0, y0, z], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, malen: malen }, opt || {}));
  }
  /* Vieleck an Halbebene b <= grenze abschneiden (Flächenkoordinaten) */
  function kappen(p, grenze) {
    const aus = [];
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length];
      const ia = a[1] >= grenze, ib = b[1] >= grenze;
      if (ia) aus.push(a);
      if (ia !== ib) { const t = (grenze - a[1]) / (b[1] - a[1]); aus.push([a[0] + (b[0] - a[0]) * t, grenze]); }
    }
    return aus;
  }

  function werkstein(g, F, x, y, w, h, saat, opt) {
    opt = opt || {};
    const c = opt.farbe || SAND;
    const gr = g.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, rgb(hell(c, 0.1))); gr.addColorStop(0.2, rgb(c)); gr.addColorStop(1, rgb(hell(c, -0.1)));
    g.fillStyle = gr; g.fillRect(x, y, w, h);
    if (F.px > 10) rausch(g, x, y, w, h, 0.9, 0.24, saat, 3);
    if (F.px > 30) rausch(g, x, y, w, h, 0.25, 0.14, saat + 1, 3);
    if (opt.fugen && F.px > 8) {
      g.fillStyle = rgb(hell(c, -0.38), 0.8);
      const f = Math.max(0.01, 0.8 / F.px);
      for (const fx of opt.fugen) g.fillRect(fx - f / 2, y, f, h);
    }
  }
  /* Vorspringendes Band (Gesims, Sohlbank): Oberseite hell, Stirn, Schatten */
  function band(g, F, x0, x1, y, h, vor, c, saat) {
    const sv = F.schatten ? F.schatten(vor) : null;
    if (sv && sv[1] > 0) {
      g.fillStyle = "rgba(30,22,26,0.34)";
      g.beginPath(); g.moveTo(x0, y + h); g.lineTo(x1, y + h); g.lineTo(x1 + sv[0], y + h + sv[1]); g.lineTo(x0 + sv[0], y + h + sv[1]); g.closePath(); g.fill();
    } else {
      const gr = g.createLinearGradient(0, y + h, 0, y + h + 0.2); gr.addColorStop(0, "rgba(20,18,26,0.28)"); gr.addColorStop(1, "rgba(20,18,26,0)");
      g.fillStyle = gr; g.fillRect(x0, y + h, x1 - x0, 0.2);
    }
    g.fillStyle = rgb(hell(c, 0.18)); g.fillRect(x0, y, x1 - x0, h * 0.3);
    g.fillStyle = rgb(c); g.fillRect(x0, y + h * 0.3, x1 - x0, h * 0.52);
    g.fillStyle = rgb(hell(c, -0.3)); g.fillRect(x0, y + h * 0.82, x1 - x0, h * 0.18);
    if (F.px > 12) rausch(g, x0, y, x1 - x0, h, 0.8, 0.22, saat, 3);
    if (F.px * 1.1 > 7) {
      g.fillStyle = rgb(hell(c, -0.4), 0.5);
      for (let x = x0 + 0.9 + hash(saat, 3, 1) * 0.4; x < x1 - 0.1; x += 0.9 + hash(Math.round(x * 10), saat, 2) * 0.5) g.fillRect(x, y, Math.max(0.008, 0.7 / F.px), h);
    }
  }
  /* weiche Schneekante auf einem Sims (Oberkante bei y) */
  function schneeKante(g, x0, x1, y, dick, saat, F) {
    g.fillStyle = rgb(SCHNEE);
    g.beginPath(); g.moveTo(x0 - 0.01, y + 0.012);
    const st = 0.09;
    for (let x = x0; x <= x1 + st; x += st) g.lineTo(Math.min(x, x1 + 0.01), y - dick * (0.6 + 0.4 * hash(Math.round(x * 11), saat, 1)));
    g.lineTo(x1 + 0.01, y + 0.012); g.closePath(); g.fill();
    /* Schattenseite der Wulst */
    g.fillStyle = "rgba(150,170,205,0.35)"; g.fillRect(x0, y - dick * 0.25, x1 - x0, dick * 0.25 + 0.01);
    if (F && F.px > 40) { g.fillStyle = "rgba(255,255,255,0.8)"; g.fillRect(x0, y - dick * 0.95, x1 - x0, Math.max(0.004, 0.6 / F.px)); }
  }

  function laibung(g, F, x0, y0, x1, y1, d, c) {
    const S = sicht(F), [ox, oy] = S.tief(d);
    g.fillStyle = rgb(c); g.fillRect(x0, y0, x1 - x0, y1 - y0);
    if (oy < 0) { g.fillStyle = rgb(mal(c, S.rel([0, 0, 1]))); vieleck(g, [[x0, y1], [x1, y1], [x1 + ox, y1 + oy], [x0 + ox, y1 + oy]]); g.fill(); }
    else if (oy > 0) { g.fillStyle = rgb(mal(hell(c, -0.2), S.rel([0, 0, -1]))); vieleck(g, [[x0, y0], [x1, y0], [x1 + ox, y0 + oy], [x0 + ox, y0 + oy]]); g.fill(); }
    if (ox > 0) { g.fillStyle = rgb(mal(c, S.rel(S.u))); vieleck(g, [[x0, y0], [x0 + ox, y0 + oy], [x0 + ox, y1 + oy], [x0, y1]]); g.fill(); }
    else if (ox < 0) { g.fillStyle = rgb(mal(c, S.rel(mul(S.u, -1)))); vieleck(g, [[x1, y0], [x1 + ox, y0 + oy], [x1 + ox, y1 + oy], [x1, y1]]); g.fill(); }
    return [ox, oy];
  }
  /* Eisengitter vor einem Fenster (Stäbe in Tiefe d) */
  function gitter(g, F, x0, y0, x1, y1, d, nacht) {
    const S = sicht(F), [ox, oy] = S.tief(d), px = F.px;
    const sb = Math.max(0.018, 0.9 / px), ab = 0.13;
    const n = Math.max(2, Math.round((x1 - x0) / ab));
    const sv = F.schatten ? F.schatten(0.07) : null;
    const stab = (fn) => {
      for (let i = 1; i < n; i++) { const x = x0 + (x1 - x0) * i / n; fn(x - sb / 2, y0 - 0.02, sb, y1 - y0 + 0.04); }
      for (const t of [0.3, 0.72]) { const y = y0 + (y1 - y0) * t; fn(x0 - 0.01, y - sb * 0.7, x1 - x0 + 0.02, sb * 1.4); }
    };
    g.save(); g.beginPath(); g.rect(x0, y0, x1 - x0, y1 - y0); g.clip();
    if (sv && !nacht) { g.fillStyle = "rgba(10,10,20,0.35)"; stab((a, b, w, h) => g.fillRect(a + ox + sv[0] * 0.6, b + oy + sv[1] * 0.6, w, h)); }
    g.fillStyle = nacht ? "rgba(26,20,18,0.95)" : rgb(EISEN); stab((a, b, w, h) => g.fillRect(a + ox, b + oy, w, h));
    if (!nacht && px > 30) { g.fillStyle = "rgba(170,170,180,0.45)"; stab((a, b, w, h) => g.fillRect(a + ox, b + oy, Math.min(w, h) * 0.35 + (w > h ? w - Math.min(w, h) * 0.35 : 0), Math.min(w, h) * 0.35 + (h > w ? h - Math.min(w, h) * 0.35 : 0))); }
    g.restore();
  }
  /* Stichbogen aus hochkant gestellten Ziegeln (Rollschicht) über einer Öffnung */
  function laubFuss(g, F, x0, x1, h, saat) {
    const rng = ST.zufall(saat * 31 + 7), n = Math.round((x1 - x0) * 9);
    const farben = [[176, 92, 34], [198, 140, 48], [140, 60, 30], [120, 84, 40]];
    for (let i = 0; i < n; i++) {
      const x = x0 + rng() * (x1 - x0), y = h - rng() * rng() * 0.25, r = 0.03 + rng() * 0.03;
      g.fillStyle = rgb(farben[(rng() * 4) | 0]);
      g.beginPath(); g.ellipse(x, y, r, r * 0.55, rng() * 3, 0, Math.PI * 2); g.fill();
    }
  }
  function schneeWehe(g, F, x0, x1, h, saat) {
    g.fillStyle = rgb(SCHNEE);
    g.beginPath(); g.moveTo(x0 - 0.05, h + 0.05);
    for (let x = x0; x <= x1 + 0.2; x += 0.2) g.lineTo(Math.min(x, x1 + 0.05), h - 0.1 - 0.12 * hash(Math.round(x * 5), saat, 3));
    g.lineTo(x1 + 0.05, h + 0.05); g.closePath(); g.fill();
    const gr = g.createLinearGradient(0, h - 0.25, 0, h); gr.addColorStop(0, "rgba(160,180,215,0)"); gr.addColorStop(1, "rgba(160,180,215,0.35)");
    g.fillStyle = gr; g.fillRect(x0 - 0.05, h - 0.25, x1 - x0 + 0.1, 0.3);
  }
  /* Rundbogenfries: kleine Bögen auf Konsolsteinen, darüber eine Schicht vor */
  function lochClip(g, F) {
    const S = sicht(F), f = F.flaeche, n = S.n, E = S.E;
    const en = dot(E, n);
    if (Math.abs(en) < 1e-3) return false;
    g.beginPath();
    GRUBE.forEach(([x, y], i) => {
      const C = [x, y, 0], t = dot(sub(f.o, C), n) / en, P = add(C, mul(E, t)), d = sub(P, f.o);
      const a = dot(d, f.u), b = dot(d, f.v);
      if (i) g.lineTo(a, b); else g.moveTo(a, b);
    });
    g.closePath(); g.clip();
    return true;
  }
  /* Licht selbst auftragen (nur innerhalb der Grubenöffnung): sonst malt
     die Lichtschicht des Kerns außerhalb des Lochs eine helle Fläche */
  function lichtAuf(g, F, dunkel) {
    const lf = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr), k = dunkel || 1;
    g.globalCompositeOperation = "multiply";
    g.fillStyle = "rgb(" + Math.round(lf[0] * 255 * k) + "," + Math.round(lf[1] * 255 * k) + "," + Math.round(lf[2] * 255 * k) + ")";
    g.fillRect(-1, -1, F.w + 2, F.h + 2);
    g.globalCompositeOperation = "source-over";
  }
  function erdeMaler(art, K) {
    return function (g, F) {
      g.save();
      if (!lochClip(g, F)) { g.restore(); return; }
      const w = F.w, h = F.h;
      if (art === "boden") {
        g.fillStyle = "rgb(104,84,64)"; g.fillRect(-0.2, -0.2, w + 0.4, h + 0.4);
        rausch(g, 0, 0, w, h, 1.6, 0.4, 5, 4);
        if (F.px > 10) rausch(g, 0, 0, w, h, 0.35, 0.25, 6, 3);
        /* Pfützen, Fußspuren */
        const rng = ST.zufall(77);
        for (let i = 0; i < 8; i++) { g.fillStyle = K.winter ? "rgba(210,220,236,0.5)" : "rgba(60,54,50,0.35)"; g.beginPath(); g.ellipse(rng() * w, rng() * h, 0.3 + rng() * 0.5, 0.15 + rng() * 0.2, rng() * 3, 0, Math.PI * 2); g.fill(); }
      } else {
        /* Erdschichten: Mutterboden, Lehm, Sand */
        const schichten = [[0, "rgb(70,54,40)"], [0.28, "rgb(128,96,62)"], [0.75, "rgb(150,122,82)"], [1.05, "rgb(120,100,76)"]];
        for (let i = 0; i < schichten.length; i++) {
          const ya = schichten[i][0], yb = i + 1 < schichten.length ? schichten[i + 1][0] : h + 0.2;
          g.fillStyle = schichten[i][1]; g.fillRect(-0.2, ya, w + 0.4, yb - ya + 0.02);
        }
        rausch(g, 0, 0, w, h, 1.1, 0.35, 8, 4);
        if (F.px > 12) {
          const rng = ST.zufall(Math.round(F.w * 100));
          for (let i = 0; i < w * 6; i++) { g.fillStyle = "rgba(180,170,150,0.5)"; g.beginPath(); g.ellipse(rng() * w, 0.3 + rng() * (h - 0.3), 0.03 + rng() * 0.05, 0.02 + rng() * 0.03, 0, 0, Math.PI * 2); g.fill(); }
        }
        if (K.winter) { g.fillStyle = rgb(SCHNEE); g.fillRect(-0.2, -0.05, w + 0.4, 0.09); }
        /* Tiefe: unten dunkler */
        const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "rgba(20,16,20,0)"); gr.addColorStop(1, "rgba(20,16,20,0.35)");
        g.fillStyle = gr; g.fillRect(-0.2, 0, w + 0.4, h + 0.2);
      }
      lichtAuf(g, F, art === "boden" ? 0.8 : 0.9);
      g.restore();
    };
  }
  function feldstein(g, F) {
    const w = F.w, h = F.h;
    g.fillStyle = "rgb(120,114,104)"; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
    if (F.px > 6) {
      const rng = ST.zufall(Math.round(w * 97 + h * 13));
      const n = Math.min(400, Math.round(w * h * 14));
      for (let i = 0; i < n; i++) {
        const x = rng() * w, y = rng() * h, r = 0.08 + rng() * 0.12, c = [[140, 132, 120], [116, 110, 104], [150, 138, 118], [104, 100, 96]][(rng() * 4) | 0];
        g.fillStyle = rgb(c); g.beginPath(); g.ellipse(x, y, r, r * (0.6 + rng() * 0.3), rng() * 3, 0, Math.PI * 2); g.fill();
      }
    }
    rausch(g, 0, 0, w, h, 1, 0.25, 9, 3);
  }
  /* Aushubhaufen */
  function haufen(M, x, y, r, hh, K, saat) {
    M.figur({
      x: x, y: y, z: 0, breite: r * 2.2, hoehe: hh,
      malen(g, s, F) {
        const rx = r * s, ry = r * s * 0.5, H = hh * ST.KZ * s;
        const rng = ST.zufall(saat);
        const umriss = () => {
          g.beginPath(); g.moveTo(-rx, 0);
          const n = 14;
          for (let i = 1; i < n; i++) { const t = i / n, a = Math.PI * (1 - t); const k = Math.pow(Math.sin(Math.PI * t), 0.8); g.lineTo(Math.cos(a) * rx * (0.95 + 0.08 * hash(i, saat, 1)), -H * k * (0.9 + 0.15 * hash(i, saat, 2)) + ry * 0.2 * (1 - k)); }
          g.lineTo(rx, 0); g.ellipse(0, 0, rx, ry, 0, 0, Math.PI); g.closePath();
        };
        if (F.schatten) { g.fillStyle = "#000"; umriss(); g.fill(); return; }
        const Zl = F.Z, L = ST.lichtFaktor([-0.5, 0.5, 0.7], Zl, 0, F.jahr), D = ST.lichtFaktor([0.6, 0.3, 0.5], Zl, 0, F.jahr);
        const erde = [124, 94, 64];
        const gr = g.createLinearGradient(-rx, -H, rx, ry);
        gr.addColorStop(0, rgb(mal(erde, L))); gr.addColorStop(1, rgb(mal(hell(erde, -0.25), D)));
        g.fillStyle = gr; umriss(); g.fill();
        g.save(); umriss(); g.clip();
        for (let i = 0; i < 40; i++) {
          const a = rng() * Math.PI, rr = rng();
          const x = Math.cos(a) * rx * rr * 0.9, yy = -H * (1 - rr) * rng() + ry * 0.3 * rng();
          g.fillStyle = rgb(mal(rng() < 0.5 ? [150, 140, 126] : [84, 64, 46], L), 0.8);
          g.beginPath(); g.ellipse(x, yy, s * 0.06 * (0.5 + rng()), s * 0.035 * (0.5 + rng()), 0, 0, Math.PI * 2); g.fill();
        }
        if (K.winter) {
          g.fillStyle = rgb(mal(SCHNEE, ST.lichtFaktor([0, 0, 1], Zl, 0, F.jahr)), 0.92);
          g.beginPath(); g.ellipse(0, -H * 0.72, rx * 0.72, H * 0.42, 0, 0, Math.PI * 2); g.fill();
        }
        g.restore();
      }
    });
  }

  function biber(g, F, w, h, farbe, saat) {
    const base = hex(farbe), zb = 0.18, zr = 0.15;
    const pxE = Math.max(F.px, Math.sqrt((F.pxU || F.px) * (F.pxV || F.px)));
    g.fillStyle = rgb(hell(base, -0.5)); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
    if (pxE * zr < 2.5) {
      for (let y = h; y > -zr; y -= zr) { g.fillStyle = rgb(hell(base, (hash(Math.round(y * 50), saat, 1) - 0.5) * 0.12)); g.fillRect(-0.1, y - zr * 0.85, w + 0.2, zr * 0.85); }
      rausch(g, 0, 0, w, h, 3, 0.2, saat, 3);
      return;
    }
    const nF = 6, eimer = [], schatten = new Path2D(), kante = new Path2D();
    for (let i = 0; i < nF; i++) eimer.push(new Path2D());
    const b = zb * 0.92, r = b / 2, lang = zr * 2.1;
    const nR = Math.ceil(h / zr) + 1;
    const fein = pxE * zb > 10;
    /* gemalt wird von oben nach unten je Reihe getrennt: erst Schatten
       aller Reihen, dann die Ziegel von der obersten zur untersten Reihe,
       so liegt jedes runde Ende sichtbar über der Reihe darunter */
    const reihen = [];
    for (let k = 0; k < nR; k++) {
      const yu = h - k * zr;                     // Unterkante (Spitze) dieser Reihe
      const vers = (k % 2) * zb / 2;
      const liste = [];
      for (let x = -zb + vers; x < w + zb; x += zb) liste.push(x + (zb - b) / 2);
      reihen.push({ yu: yu, liste: liste, k: k });
    }
    for (const R of reihen) {
      for (const x0 of R.liste) {
        const i = Math.round(x0 * 20) + 1000;
        let c = (hash(i, R.k, saat) * nF) | 0;
        const p = eimer[c], yu = R.yu, yo = yu - lang;
        p.moveTo(x0, yo); p.lineTo(x0, yu - r); p.arc(x0 + r, yu - r, r, Math.PI, 0, true); p.lineTo(x0 + b, yo); p.closePath();
        schatten.moveTo(x0 + 0.01, yu - r + 0.02); schatten.arc(x0 + r + 0.01, yu - r + 0.025, r, Math.PI, 0, true); schatten.lineTo(x0 + b + 0.01, yu - r); schatten.closePath();
        if (fein) { kante.moveTo(x0, yu - r); kante.arc(x0 + r, yu - r, r, Math.PI, 0, true); }
      }
    }
    /* Reihe für Reihe von oben: so verdeckt die untere Reihe nichts Falsches */
    g.fillStyle = "rgba(30,10,6,0.45)"; g.fill(schatten);
    for (let i = 0; i < nF; i++) {
      const c = hell(base, (i - 2.5) * 0.045 + (i === 5 ? -0.08 : 0));
      g.fillStyle = rgb(i === 4 ? misch(c, [120, 104, 70], 0.18) : c); g.fill(eimer[i]);
    }
    /* Wölbung und Schatten der Reihe darüber: Verlauf je Reihe */
    if (!biber.cv) {
      const cv = document.createElement("canvas"); cv.width = 4; cv.height = 32;
      const cg = cv.getContext("2d", { willReadFrequently: true }), gr = cg.createLinearGradient(0, 0, 0, 32);
      gr.addColorStop(0, "rgba(20,8,4,0.42)"); gr.addColorStop(0.35, "rgba(20,8,4,0.08)"); gr.addColorStop(0.85, "rgba(255,230,210,0.06)"); gr.addColorStop(1, "rgba(20,8,4,0.12)");
      cg.fillStyle = gr; cg.fillRect(0, 0, 4, 32);
      biber.cv = cv;
    }
    const mu = g.createPattern(biber.cv, "repeat");
    mu.setTransform(new DOMMatrix([1, 0, 0, zr / 32, 0, (h % zr) - zr]));
    g.fillStyle = mu; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
    if (fein) { g.strokeStyle = "rgba(40,14,8,0.45)"; g.lineWidth = Math.max(0.006, 0.7 / pxE); g.stroke(kante); }
    rausch(g, 0, 0, w, h, 3.5, 0.16, saat + 1, 4);
  }

  /* Schornstein auf der Nordseite nahe dem First */
  function abbild(F, s) {
    const a = (F.gier || 0) * RAD, c = Math.cos(a), sn = Math.sin(a);
    const KX = ST.KX, KY = ST.KY, KZ = ST.KZ;
    return {
      c: c, s: sn,
      p: (x, y, z) => { const X = x * c - y * sn, Y = x * sn + y * c; return [(X - Y) * KX * s, (X + Y) * KY * s - z * KZ * s]; },
      tiefe: (x, y, z) => { const X = x * c - y * sn, Y = x * sn + y * c; return (X + Y) * 0.61 + z * 0.5; },
      licht: (n) => { const N = [n[0] * c - n[1] * sn, n[0] * sn + n[1] * c, n[2]]; return ST.lichtFaktor(nrm(N), F.Z, 0, F.jahr); },
      sicht: (n) => { const N = [n[0] * c - n[1] * sn, n[0] * sn + n[1] * c, n[2]]; return dot(nrm(N), ST.ZUM_AUGE); }
    };
  }
  function flaecheZ(g, A, pts, farbe, n, F) {
    g.beginPath();
    pts.forEach((q, i) => { const P = A.p(q[0], q[1], q[2]); if (i) g.lineTo(P[0], P[1]); else g.moveTo(P[0], P[1]); });
    g.closePath();
    g.fillStyle = F.schatten ? "#000" : rgb(mal(farbe, A.licht(n)));
    g.fill();
  }
  /* Quader als Figur-Teil: sichtbare Seiten */
  function kastenZ(g, A, F, x0, y0, z0, x1, y1, z1, farbe, oben) {
    const S = [
      { n: [0, 1, 0], p: [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]] },
      { n: [0, -1, 0], p: [[x1, y0, z1], [x0, y0, z1], [x0, y0, z0], [x1, y0, z0]] },
      { n: [1, 0, 0], p: [[x1, y1, z1], [x1, y0, z1], [x1, y0, z0], [x1, y1, z0]] },
      { n: [-1, 0, 0], p: [[x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [x0, y0, z0]] },
      { n: [0, 0, 1], p: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], c: oben }
    ];
    for (const f of S) if (A.sicht(f.n) > 0.001) flaecheZ(g, A, f.p, f.c || farbe, f.n, F);
  }

  /* Wandlaterne am Turm: Ausleger, sechseckige Laterne */
  function wandLaterne(M, x, y, z, K, Z, n) {
    n = n || [0, 1, 0];
    M.figur({
      x: x + n[0] * 0.42, y: y + n[1] * 0.42, z: z - 0.62, breite: 0.5, hoehe: 1.0, schatten: true,
      malen(g, s, F) {
        const A = abbild(F, s);
        const sch = F.schatten;
        const eisen = sch ? "#000" : rgb(mal(EISEN, A.licht([0, 0, 1])));
        /* Ausleger zur Wand (−y) mit Zierbogen */
        const pW = A.p(-n[0] * 0.42, -n[1] * 0.42, 0.95), pA = A.p(0, 0, 0.95), pS = A.p(-n[0] * 0.42, -n[1] * 0.42, 0.62);
        g.strokeStyle = eisen; g.lineWidth = Math.max(1, s * 0.03);
        g.beginPath(); g.moveTo(pW[0], pW[1]); g.lineTo(pA[0], pA[1]); g.stroke();
        g.beginPath(); g.moveTo(pS[0], pS[1]); g.quadraticCurveTo(A.p(-n[0] * 0.2, -n[1] * 0.2, 0.7)[0], A.p(-n[0] * 0.2, -n[1] * 0.2, 0.7)[1], A.p(-n[0] * 0.05, -n[1] * 0.05, 0.93)[0], A.p(-n[0] * 0.05, -n[1] * 0.05, 0.93)[1]); g.stroke();
        /* Laterne: Dach, Glas, Boden */
        const P = A.p(0, 0, 0);
        const b = 0.2 * s, hG = 0.36 * ST.KZ * s, yG = P[1] - 0.12 * ST.KZ * s;
        if (sch) { g.fillStyle = "#000"; g.fillRect(P[0] - b / 2, yG - hG, b, hG + 0.12 * s); return; }
        const an = F.nacht > 0.05 && Z.licht;
        const glas = g.createLinearGradient(P[0] - b / 2, 0, P[0] + b / 2, 0);
        if (an) { glas.addColorStop(0, "rgba(255,214,140,0.95)"); glas.addColorStop(0.5, "rgba(255,244,210,1)"); glas.addColorStop(1, "rgba(255,190,110,0.95)"); }
        else { glas.addColorStop(0, "rgba(180,196,210,0.9)"); glas.addColorStop(0.5, "rgba(120,136,150,0.9)"); glas.addColorStop(1, "rgba(70,80,92,0.9)"); }
        g.fillStyle = glas;
        g.beginPath(); g.moveTo(P[0] - b * 0.42, yG); g.lineTo(P[0] + b * 0.42, yG); g.lineTo(P[0] + b / 2, yG - hG); g.lineTo(P[0] - b / 2, yG - hG); g.closePath(); g.fill();
        g.strokeStyle = rgb(hell(EISEN, 0.1)); g.lineWidth = Math.max(0.6, s * 0.012);
        g.beginPath(); g.moveTo(P[0], yG); g.lineTo(P[0], yG - hG); g.stroke();
        g.beginPath(); g.moveTo(P[0] - b * 0.42, yG); g.lineTo(P[0] - b / 2, yG - hG); g.moveTo(P[0] + b * 0.42, yG); g.lineTo(P[0] + b / 2, yG - hG); g.stroke();
        /* Dach und Knauf */
        g.fillStyle = rgb(mal(hell(EISEN, 0.1), A.licht([0, 0, 1])));
        g.beginPath(); g.moveTo(P[0] - b * 0.62, yG - hG); g.lineTo(P[0] + b * 0.62, yG - hG); g.lineTo(P[0], yG - hG - 0.2 * s); g.closePath(); g.fill();
        g.beginPath(); g.arc(P[0], yG - hG - 0.21 * s, 0.025 * s, 0, Math.PI * 2); g.fill();
        if (K.schnee > 0) { g.fillStyle = rgb(mal(SCHNEE, A.licht([0, 0, 1]))); g.beginPath(); g.moveTo(P[0] - b * 0.5, yG - hG - 0.02 * s); g.quadraticCurveTo(P[0], yG - hG - 0.25 * s, P[0] + b * 0.5, yG - hG - 0.02 * s); g.closePath(); g.fill(); }
        /* Boden mit Tropfen */
        g.fillStyle = rgb(mal(EISEN, A.licht([0, 0, -1])));
        g.beginPath(); g.moveTo(P[0] - b * 0.45, yG); g.lineTo(P[0] + b * 0.45, yG); g.lineTo(P[0], yG + 0.1 * s); g.closePath(); g.fill();
        if (an) {
          g.fillStyle = "rgba(255,250,230,1)"; g.beginPath(); g.ellipse(P[0], yG - hG * 0.45, b * 0.12, hG * 0.2, 0, 0, Math.PI * 2); g.fill();
          /* Schein nur, wenn die Turmseite zum Betrachter zeigt – sonst
             leuchtete die Laterne durch den Turm hindurch */
          if (F.leuchtPunkt && A.sicht(n) > -0.15) F.leuchtPunkt(P[0], yG - hG * 0.5, s * 2.4, "255,200,130", 0.8 * F.nacht);
        }
      }
    });
    if (Z.licht) M.bodenlicht(x + n[0] * 1.3, y + n[1] * 1.3, 2.0, "255,200,130", 0.6);
  }

  /* Fahnenmast auf dem Turm: rot-weiße Stadtfahne */
  /* ---------------- Maße ---------------- */
  const CX = -1.2, CY = -1.1, R = 3.0, WDT = 0.9, N = 24;            // Turm: Mitte, Radius, Mauerstärke, Felder
  const Z_SO = 0.6, Z_GG = 7.25, Z_TW = 10.6;                         // Sockel, Gurtgesims, Mauerkrone
  const RE = R + 0.34, Z_SP = 15.9, KEG = (Z_SP - Z_TW) / R, Z_TE = Z_SP - RE * KEG;   // Kegeldach: Traufradius, Spitze, Steigung, Traufe
  const AX0 = 1.8, AX1 = 4.2, AY0 = -2.8, AY1 = 2.9, Z_AH = 4.6, Z_AL = 3.4, A_UE = 0.3, A_D = 0.12;   // Wachstube mit Pultdach
  const A_NEIG = (Z_AH - Z_AL) / (AX1 - AX0);
  const PO = { x0: CX - 0.95, x1: CX + 0.95, y0: CY + R - 0.5, y1: CY + R + 0.38, z: 3.3 };   // Portalvorbau
  const TUER = { w: 1.06, zk: 2.05, z0: 0.28 };                        // Eisentür: Breite, Kämpfer (über Schwelle)
  const WINKEL = (i) => -Math.PI + (i / N) * Math.PI * 2;
  const KAMIN = { x: 2.4, y: -1.9, b: 0.5 };

  /* ---------------- Farben ---------------- */
  const SAND = [196, 182, 150];
  const QUADER = [[180, 164, 134], [194, 178, 144], [164, 152, 130], [190, 168, 128], [170, 162, 146], [200, 186, 154], [156, 144, 122]];
  const MOERTEL = [204, 198, 184];
  const SCHNEE = [242, 246, 252];
  const EISEN = [46, 44, 46];
  const SCHIEFER = ["#4e5664", "#565a66", "#4a5260"];
  const PUTZ = ["#d9c8a0", "#e0d4b8", "#d6c09a"];
  const LAEDEN = ["#3c5e44", "#6e2e26", "#3e5670"];
  const DACHA = ["#8e4430", "#7e3e2e"];

  const VAR = {};
  function variante(o) {
    const k = o.saat || 1;
    if (VAR[k]) return VAR[k];
    const r = ST.zufall(k * 6151 + 29);
    const nimm = (a) => a[Math.floor(r() * a.length) % a.length];
    const v = { saat: k, schiefer: nimm(SCHIEFER), putz: nimm(PUTZ), laeden: nimm(LAEDEN), dach: nimm(DACHA), jahr: ["1563", "1588", "1602", "1547"][Math.floor(r() * 4) % 4] };
    VAR[k] = v;
    return v;
  }

  /* Baugrube: Hülle um Turm (+0,4) und Wachstube (+0,35) */
  const GRUBE = (function () {
    const p = [];
    for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; p.push([CX + Math.cos(a) * (R + 0.4), CY + Math.sin(a) * (R + 0.4)]); }
    p.push([AX0 - 0.3, AY0 - 0.35], [AX1 + 0.3, AY0 - 0.35], [AX1 + 0.3, AY1 + 0.35], [AX0 - 0.3, AY1 + 0.35]);
    const s = p.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const kr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], hi = [];
    for (const q of s) { while (lo.length >= 2 && kr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (let i = s.length - 1; i >= 0; i--) { const q = s[i]; while (hi.length >= 2 && kr(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop(); hi.push(q); }
    hi.pop(); lo.pop();
    let h = lo.concat(hi);
    /* Umlauf so, dass (−uy, ux) ins Innere zeigt */
    const m = h.reduce((a, q) => [a[0] + q[0] / h.length, a[1] + q[1] / h.length], [0, 0]);
    const u = [h[1][0] - h[0][0], h[1][1] - h[0][1]];
    if ((-u[1]) * (m[0] - h[0][0]) + u[0] * (m[1] - h[0][1]) < 0) h = h.reverse();
    return h;
  })();
  const G_TIEF = 1.4;

  /* =====================================================================
     BAUPHASEN (Bauzeit 16 min)
       0,00–0,10  Baugrube mit Aushubhaufen
       0,10–0,18  Fundament aus Feldstein: runder Turmring, Streifen der Wachstube
       0,18–0,21  verfüllen
       0,20–0,26  Sockel
       0,26–0,66  Turmmauer Lage für Lage (Quader), Innenseite und Krone sichtbar
       0,30–0,50  Wachstube (verputzt erst ab 0,48)
       0,50–0,64  Pultdach: Sparren, Latten, Ziegel von der Traufe her
       0,60–0,70  Schornstein
       0,66–0,77  Kegeldach: Sparren um die Kaiserstiel-Spitze, Latten
       0,77–0,88  Schiefer von der Traufe zur Spitze, dann Knauf und Fahne
       0,88–1,00  Fenster, Gitter, Eisentür, Laternen, Schild; Schnee
     ===================================================================== */
  function zustand(bau) {
    const f = (a, b) => klemm((bau - a) / (b - a), 0, 1);
    const Z = { bau: bau, fertig: bau >= 0.999 };
    Z.grube = bau < 0.2;
    Z.tiefe = f(0.004, 0.06);
    Z.fund = f(0.1, 0.18);
    Z.haufen = bau < 0.18 ? f(0.004, 0.07) : bau < 0.21 ? 1 - 0.75 * f(0.18, 0.21) : bau < 0.3 ? 0.25 * (1 - f(0.26, 0.3)) : 0;
    Z.sockel = f(0.2, 0.26);
    Z.turmZ = Z_SO + (Z_TW - Z_SO) * f(0.26, 0.66);
    Z.anbauZ = Z_SO + (Z_AH - Z_SO) * f(0.3, 0.5);
    Z.putz = bau >= 0.48;
    Z.aSparren = f(0.5, 0.55); Z.aLatten = f(0.55, 0.57); Z.aZiegel = f(0.57, 0.64); Z.aZu = bau >= 0.64;
    Z.kamin = f(0.6, 0.7);
    Z.kSparren = f(0.66, 0.74); Z.kLatten = f(0.74, 0.77); Z.kSchiefer = f(0.77, 0.88); Z.kZu = bau >= 0.88;
    Z.knauf = bau >= 0.88;
    Z.fenster = bau >= 0.9; Z.gitter = bau >= 0.91; Z.tuer = bau >= 0.92; Z.laterne = bau >= 0.94; Z.schild = bau >= 0.95;
    Z.schnee = Z.fertig ? 1 : f(0.88, 0.98);
    Z.licht = Z.fertig;
    return Z;
  }

  /* =====================================================================
     QUADERMAUERWERK – Sandstein in durchgehenden Lagen
     Nahtlose Kachel mit der Breite eines Drittels des Turmumfangs: legt man
     sie an die Bogenlänge, schließt sie sich rund um den Turm.
     ===================================================================== */
  const QK = { W: 2 * Math.PI * R / 3, L: [0.46, 0.38, 0.44, 0.4, 0.46, 0.36, 0.44, 0.42] };
  QK.H = QK.L.reduce((a, b) => a + b, 0);
  const QKACHELN = new Map();
  let qPixel = 0;
  function quaderKachel(pt, sd, grob) {
    const schl = [pt, sd[0], sd[1], sd[2], grob ? 1 : 0].join("|");
    let K = QKACHELN.get(schl);
    if (K) return K;
    const cw = Math.max(4, Math.round(QK.W * pt)), ch = Math.max(4, Math.round(QK.H * pt));
    if (qPixel + cw * ch > 12e6) { QKACHELN.clear(); qPixel = 0; }
    const cv = document.createElement("canvas"); cv.width = cw; cv.height = ch;
    const g = cv.getContext("2d", { willReadFrequently: true });
    g.scale(cw / QK.W, ch / QK.H);
    g.fillStyle = rgb(MOERTEL); g.fillRect(0, 0, QK.W, QK.H);
    const f = Math.max(0.014, 0.8 / pt);
    const nF = QUADER.length, eimer = [], alle = new Path2D(), oben = new Path2D(), unten = new Path2D(), alt = new Path2D();
    for (let i = 0; i < nF * 2; i++) eimer.push(new Path2D());
    let z = 0;
    for (let r = 0; r < QK.L.length; r++) {
      const lh = QK.L[r], y = QK.H - z - lh;
      /* Steinlängen, genau auf die Kachelbreite */
      const L = []; let sum = 0, k = 0;
      while (sum < QK.W - 0.01) { let l = 0.62 + 0.62 * hash(k, r, 41); if (QK.W - sum - l < 0.45) l = QK.W - sum; L.push(l); sum += l; k++; }
      const off = hash(r, 3, 43) * QK.W;
      let x = off;
      for (let i = 0; i < L.length; i++) {
        const l = L[i];
        for (const dx of [0, -QK.W]) {
          const bx = x + dx + f / 2, by = y + f / 2, bw = l - f, bh = lh - f;
          if (bx > QK.W || bx + bw < 0) continue;
          const c = (hash(i, r, 45) * nF) | 0, v = hash(i, r, 46) < 0.5 ? 0 : 1;
          const rr = Math.min(0.025, bh * 0.08);
          const p = eimer[c * 2 + v];
          if (grob) p.rect(bx, by, bw, bh);
          else {
            /* abgestoßene Kanten: kleine Unregelmäßigkeiten an den Ecken */
            const J = (n) => (hash(i * 7 + n, r, 47) - 0.5) * 0.02;
            p.moveTo(bx + rr, by + J(1)); p.lineTo(bx + bw - rr, by + J(2)); p.quadraticCurveTo(bx + bw, by, bx + bw + J(3), by + rr);
            p.lineTo(bx + bw + J(4), by + bh - rr); p.quadraticCurveTo(bx + bw, by + bh, bx + bw - rr, by + bh + J(5));
            p.lineTo(bx + rr, by + bh + J(6)); p.quadraticCurveTo(bx, by + bh, bx + J(7), by + bh - rr); p.lineTo(bx + J(8), by + rr); p.quadraticCurveTo(bx, by, bx + rr, by);
            p.closePath();
            alle.rect(bx, by, bw, bh);
            oben.rect(bx, by, bw, Math.min(0.03, bh * 0.08));
            unten.rect(bx, by + bh - Math.min(0.035, bh * 0.1), bw, Math.min(0.035, bh * 0.1));
            if (hash(i, r, 48) < 0.18) alt.rect(bx, by + bh * 0.4, bw, bh * 0.6);
          }
        }
        x += l;
      }
      z += lh;
    }
    if (!grob) { g.save(); g.translate(sd[0], Math.max(f * 0.3, sd[1])); g.fillStyle = sd[2] ? "rgba(70,60,50,0.5)" : "rgba(70,60,50,0.3)"; g.fill(alle); g.restore(); }
    for (let i = 0; i < nF; i++) for (let v = 0; v < 2; v++) { g.fillStyle = rgb(hell(QUADER[i], (v - 0.5) * 0.06)); g.fill(eimer[i * 2 + v]); }
    if (!grob) {
      g.fillStyle = "rgba(255,250,236,0.22)"; g.fill(oben);
      g.fillStyle = "rgba(60,50,40,0.16)"; g.fill(unten);
      g.fillStyle = "rgba(96,88,70,0.16)"; g.fill(alt);
      rausch(g, 0, 0, QK.W, QK.H, 0.7, 0.26, 5, 3);
      rausch(g, 0, 0, QK.W, QK.H, 0.22, 0.16, 6, 3);
      /* Scharrierung (feine Hiebe) nur ganz nah */
      if (pt > 90) {
        g.strokeStyle = "rgba(90,80,64,0.1)"; g.lineWidth = 0.6 / pt; g.beginPath();
        for (let x = 0; x < QK.W; x += 0.02) { g.moveTo(x, 0); g.lineTo(x + 0.004, QK.H); }
        g.stroke();
      }
    }
    K = { bild: cv, cw: cw, ch: ch };
    QKACHELN.set(schl, K); qPixel += cw * ch;
    return K;
  }
  function quader(g, F, x0, y0, x1, y1, A0, top) {
    const px = F.px;
    if (px < 8) {
      const m = QUADER.reduce((a, c) => [a[0] + c[0] / QUADER.length, a[1] + c[1] / QUADER.length, a[2] + c[2] / QUADER.length], [0, 0, 0]);
      g.fillStyle = rgb(misch(m, MOERTEL, 0.1)); g.fillRect(x0, y0, x1 - x0, y1 - y0);
      if (px > 3.5) {
        g.fillStyle = "rgba(120,110,90,0.25)";
        let z = 0, r = 0; while (z < top + 1) { z += QK.L[r % QK.L.length]; r++; if (top - z > y0 - 0.05 && top - z < y1) g.fillRect(x0, top - z, x1 - x0, 0.03); }
      }
      rausch(g, x0, y0, x1 - x0, y1 - y0, 3.2, 0.2, 8, 3);
      return;
    }
    const sv = F.schatten ? F.schatten(0.02) : null;
    const sd = sv ? [Math.round(sv[0] / 0.008) * 0.008, Math.round(sv[1] / 0.008) * 0.008, 1] : [0, 0.006, 0];
    const pt = Math.min(170, Math.pow(2, Math.ceil(Math.log2(Math.max(F.pxU || px, F.pxV || px) * 1.05) * 4) / 4));
    const K = quaderKachel(pt, sd, px < 14);
    const mu = g.createPattern(K.bild, "repeat");
    mu.setTransform(new DOMMatrix([QK.W / K.cw, 0, 0, QK.H / K.ch, -A0, top - QK.H]));
    g.fillStyle = mu; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    rausch(g, x0, y0, x1 - x0, y1 - y0, 3.6, 0.22, 9, 4);
  }

  /* Gepuffert malen: Werkstoff und Eigenlicht erst auf einer eigenen
     Leinwand, dann EIN Mal ins Sprite. Sonst addieren sich an den weichen
     Feldkanten Farbe und Licht-Multiplikation zu hellen Haarlinien – genau
     die „komischen Vektorrückstände", die Xander nicht will. */
  const PUF = new Map();
  function puffer(w, h) {
    const st = (a) => Math.ceil(a / 128) * 128, k = st(w) + "x" + st(h);
    let c = PUF.get(k);
    if (c) { PUF.delete(k); PUF.set(k, c); return c; }
    while (PUF.size >= 6) { const alt = PUF.keys().next().value; PUF.get(alt).canvas.width = 0; PUF.delete(alt); }
    const cv = document.createElement("canvas"); cv.width = st(w); cv.height = st(h);
    /* Prozessor-Leinwand: viele kleine Striche sind dort viel schneller */
    c = cv.getContext("2d", { willReadFrequently: true }); PUF.set(k, c);
    return c;
  }
  function gepuffert(m) {
    const f = function (g, F) {
      const T = g.getTransform();
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const p of F.flaeche.umriss) {
        const X = T.a * p[0] + T.c * p[1] + T.e, Y = T.b * p[0] + T.d * p[1] + T.f;
        x0 = Math.min(x0, X); x1 = Math.max(x1, X); y0 = Math.min(y0, Y); y1 = Math.max(y1, Y);
      }
      x0 = Math.floor(x0) - 3; y0 = Math.floor(y0) - 3; x1 = Math.ceil(x1) + 3; y1 = Math.ceil(y1) + 3;
      const w = x1 - x0, h = y1 - y0;
      if (w <= 0 || h <= 0) return;
      if (w * h > 6e6) { m(g, F); return; }
      const c = puffer(w, h);
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
      c.clearRect(0, 0, w + 2, h + 2);
      c.setTransform(T.a, T.b, T.c, T.d, T.e - x0, T.f - y0);
      c.save(); m(c, F); c.restore();
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.drawImage(c.canvas, 0, 0, w, h, x0, y0, w, h);
      g.setTransform(T);
    };
    f.leuchten = m.leuchten;
    return f;
  }

  /* Licht selbst: Verlauf zwischen den Normalen der Feldränder (weich rund) */
  function rundLicht(g, F, aL, aR, nz, opt) {
    const S = sicht(F);
    const lf = (a) => ST.lichtFaktor(S.rot(nrm([Math.cos(a), Math.sin(a), nz])), F.zeit, 0, F.jahr);
    const c = (l) => "rgb(" + Math.round(l[0] * 255) + "," + Math.round(l[1] * 255) + "," + Math.round(l[2] * 255) + ")";
    g.save(); g.globalCompositeOperation = "multiply";
    const gr = g.createLinearGradient(0, 0, F.w, 0);
    gr.addColorStop(0, c(lf(aL))); gr.addColorStop(1, c(lf(aR)));
    g.fillStyle = gr; g.fillRect(-1, -1, F.w + 2, F.h + 2);
    if (opt && opt.ao) {
      const h = F.h, hoch = Math.min(0.55, h * 0.5), ga = g.createLinearGradient(0, h, 0, h - hoch);
      ga.addColorStop(0, "rgb(80,80,98)"); ga.addColorStop(1, "rgb(255,255,255)");
      g.fillStyle = ga; g.fillRect(-1, h - hoch, F.w + 2, hoch + 1);
    }
    if (opt && opt.traufe) {
      const t = opt.traufe, gt = g.createLinearGradient(0, 0, 0, t);
      gt.addColorStop(0, "rgb(110,116,150)"); gt.addColorStop(0.65, "rgb(205,208,225)"); gt.addColorStop(1, "rgb(255,255,255)");
      g.fillStyle = gt; g.fillRect(-1, -0.02, F.w + 2, t + 0.02);
    }
    g.restore();
  }

  /* =====================================================================
     TURMMAUER
     ===================================================================== */
  /* Zellenfenster: Feld, Unterkante, Oberkante, Breite, Licht */
  const TFENSTER = [
    { i: 15, z0: 3.3, z1: 4.05, w: 0.5 }, { i: 20, z0: 3.3, z1: 4.05, w: 0.5 }, { i: 1, z0: 3.3, z1: 4.05, w: 0.5 }, { i: 5, z0: 3.3, z1: 4.05, w: 0.5 },
    { i: 13, z0: 5.9, z1: 6.65, w: 0.5 }, { i: 17, z0: 5.9, z1: 6.65, w: 0.5 }, { i: 21, z0: 5.9, z1: 6.65, w: 0.5 }, { i: 3, z0: 5.9, z1: 6.65, w: 0.5 }, { i: 7, z0: 5.9, z1: 6.65, w: 0.5 }, { i: 11, z0: 5.9, z1: 6.65, w: 0.5 },
    { i: 14, z0: 8.5, z1: 9.3, w: 0.52 }, { i: 18, z0: 8.5, z1: 9.3, w: 0.52, licht: 0.9 }, { i: 22, z0: 8.5, z1: 9.3, w: 0.52 }, { i: 2, z0: 8.5, z1: 9.3, w: 0.52 }, { i: 6, z0: 8.5, z1: 9.3, w: 0.52 }, { i: 10, z0: 8.5, z1: 9.3, w: 0.52 }
  ];
  function turm(M, Z, K) {
    if (Z.sockel <= 0) return;
    const zO = Z.sockel < 1 ? Z_SO * Z.sockel : Math.min(Z.turmZ, Z_TW);
    const offen = zO < Z_TW - 0.01;
    M.teil("turm", { mitte: [CX, CY, 5] });
    for (let i = 0; i < N; i++) {
      const a0 = WINKEL(i), a1 = WINKEL(i + 1);
      const P0 = [CX + R * Math.cos(a0), CY + R * Math.sin(a0)], P1 = [CX + R * Math.cos(a1), CY + R * Math.sin(a1)];
      const ops = TFENSTER.filter((f) => f.i === i);
      const m = gepuffert(turmMaler(i, a1, a0, zO, ops, K));
      wandFlaeche(M, "turm-" + i, P1, P0, 0, zO, m, { keinLicht: true, ao: false });
    }
    if (offen && zO > Z_SO + 0.02) {
      const Ri = R - WDT;
      const innen = (a1, a0) => (g, F) => { quader(g, F, -0.05, -0.05, F.w + 0.05, F.h + 0.05, -Ri * a0 * 1.3, zO); g.fillStyle = "rgba(30,24,20,0.18)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); };
      const krone = (g, F) => { g.fillStyle = rgb(hell(QUADER[1], 0.04)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); if (F.px > 8) rausch(g, 0, 0, F.w, F.h, 0.5, 0.3, 4, 3); g.fillStyle = "rgba(240,236,224,0.35)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h * 0.4); };
      const boden = [];
      for (let i = 0; i < N; i++) {
        const a0 = WINKEL(i), a1 = WINKEL(i + 1);
        const I0 = [CX + Ri * Math.cos(a0), CY + Ri * Math.sin(a0)], I1 = [CX + Ri * Math.cos(a1), CY + Ri * Math.sin(a1)];
        const O0 = [CX + R * Math.cos(a0), CY + R * Math.sin(a0)], O1 = [CX + R * Math.cos(a1), CY + R * Math.sin(a1)];
        wandFlaeche(M, "turm-in-" + i, I0, I1, Z_SO, zO, innen(a1, a0), { ao: false });
        polyFlaeche(M, [[O1[0], O1[1], zO], [O0[0], O0[1], zO], [I0[0], I0[1], zO], [I1[0], I1[1], zO]], [0, 0, 1], krone, { name: "krone-" + i });
        boden.push([I0[0], I0[1], Z_SO]);
      }
      polyFlaeche(M, boden, [0, 0, 1], (g, F) => { g.fillStyle = "rgb(150,142,132)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); rausch(g, 0, 0, F.w, F.h, 1.2, 0.3, 7, 3); if (K.winter) { g.fillStyle = "rgba(240,244,250,0.6)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); } }, { name: "turm-boden", ebene: -1 });
    }
  }
  function turmMaler(i, aL, aR, top, ops, K) {
    const A0 = -R * aL, mitteA = (aL + aR) / 2;
    const m = function (g, F) {
      const w = F.w, h = F.h, Z = K.Z;
      quader(g, F, -0.05, -0.05, w + 0.05, h + 0.05, A0, top);
      /* Konsolfries unter der Traufe */
      if (top >= Z_TW - 0.01) konsolfries(g, F, w, A0);
      /* Gurtgesims */
      if (top > Z_GG + 0.02) {
        band(g, F, -0.05, w + 0.05, top - Z_GG, 0.22, 0.12, hell(SAND, 0.03), 60 + i);
        if (K.schnee > 0) schneeKante(g, -0.05, w + 0.05, top - Z_GG + 0.004, 0.09 * K.schnee, i, F);
      }
      for (const op of ops) if (op.z0 < top) zellenFenster(g, F, K, op, top, w);
      /* Wilder Wein an der Südwestseite */
      const grad = mitteA * 180 / Math.PI;
      if (grad > 92 && grad < 212) efeu(g, F, K, A0, top, w, h);
      /* Sockel mit Schräge */
      const zs = Math.min(Z_SO, top);
      werkstein(g, F, -0.05, top - zs, w + 0.1, zs + 0.05, 80 + i, { farbe: hell(QUADER[6], -0.05), fugen: [((-A0 % 1.1) + 1.1) % 1.1 + 0.2] });
      if (top >= Z_SO) {
        g.fillStyle = rgb(hell(SAND, 0.2)); g.fillRect(-0.05, top - Z_SO, w + 0.1, 0.06);
        g.fillStyle = "rgba(40,34,30,0.35)"; g.fillRect(-0.05, top - Z_SO + 0.06, w + 0.1, 0.015);
        if (K.schnee > 0) schneeKante(g, -0.05, w + 0.05, top - Z_SO + 0.004, 0.06 * K.schnee, i + 30, F);
      }
      /* Spritzwasser, dunkle Flechten unten, Regenspuren von oben */
      const gr = g.createLinearGradient(0, h, 0, h - 1.4);
      gr.addColorStop(0, K.winter ? "rgba(60,60,70,0.3)" : "rgba(60,70,44,0.34)"); gr.addColorStop(1, "rgba(60,60,50,0)");
      g.fillStyle = gr; g.fillRect(-0.05, h - 1.4, w + 0.1, 1.4);
      if (top >= Z_TW - 0.01 && F.px > 6) {
        const gs = g.createLinearGradient(0, 0.4, 0, 3.5);
        gs.addColorStop(0, "rgba(60,54,44,0.22)"); gs.addColorStop(1, "rgba(60,54,44,0)");
        for (let k = 0; k < 3; k++) { const x = (hash(i, k, 71) * w); g.fillStyle = gs; g.fillRect(x, 0.4, 0.08 + 0.2 * hash(i, k, 72), 3.1 * hash(i, k, 73)); }
      }
      if (K.herbst && top >= Z_SO) laubFuss(g, F, 0, w, h, i + 5);
      if (K.winter && Z.fertig) schneeWehe(g, F, -0.02, w + 0.02, h, i + 9);
      if (F.px > 8) PI.bleichen(g, 0, 0, w, h, 2.4, 0.06, 3);
      /* Mauerkrone beim Bauen: frische Lage heller */
      if (top < Z_TW - 0.01 && F.px > 5) { g.fillStyle = "rgba(240,236,222,0.3)"; g.fillRect(-0.05, 0, w + 0.1, 0.2); }
      rundLicht(g, F, aL, aR, 0, { ao: true, traufe: top >= Z_TW - 0.01 && K.Z.kSchiefer > 0.3 ? 0.9 : 0 });
    };
    if (ops.some((o) => o.licht)) m.leuchten = function (g, F) {
      if (!K.Z.licht) return;
      for (const op of ops) if (op.licht) zellenLicht(g, F, K, op, top, F.w);
    };
    return m;
  }
  function konsolfries(g, F, w, A0) {
    const ab = 0.46, px = F.px;
    const sv = F.schatten ? F.schatten(0.14) : [0.03, 0.06];
    /* Gesimsplatte oben */
    band(g, F, -0.05, w + 0.05, 0.12, 0.2, 0.16, hell(SAND, 0.05), 3);
    if (px < 5) return;
    const erste = Math.ceil(A0 / ab) * ab - A0;
    for (let x = erste - ab; x < w + ab; x += ab) {
      /* Konsole: zwei Stufen, darunter Schatten */
      const kx = x + 0.1;
      if (sv) { g.fillStyle = "rgba(30,26,30,0.35)"; g.fillRect(kx + sv[0] * 0.8, 0.32 + sv[1] * 0.3, 0.16, 0.32); }
      g.fillStyle = rgb(hell(SAND, 0.08)); g.fillRect(kx, 0.32, 0.16, 0.14);
      g.fillStyle = rgb(hell(SAND, -0.06)); g.fillRect(kx + 0.02, 0.46, 0.12, 0.12);
      g.fillStyle = rgb(hell(SAND, -0.3)); g.fillRect(kx + 0.02, 0.56, 0.12, 0.025);
      /* Bogen dazwischen */
      g.strokeStyle = rgb(hell(SAND, -0.02)); g.lineWidth = 0.05;
      g.beginPath(); g.arc(kx + 0.08 + ab / 2, 0.4, (ab - 0.16) / 2, Math.PI, 0); g.stroke();
      g.fillStyle = "rgba(40,34,30,0.22)"; g.beginPath(); g.arc(kx + 0.08 + ab / 2, 0.42, (ab - 0.2) / 2, Math.PI, 0); g.fill();
    }
  }
  /* Zellenfenster: tiefe Laibung, Fase, schweres Kreuzgitter, Rostfahne */
  function zellenFenster(g, F, K, op, top, w) {
    const cx = w / 2, x0 = cx - op.w / 2, x1 = cx + op.w / 2, y0 = top - op.z1, y1 = top - op.z0, hh = y1 - y0;
    const sv = F.schatten ? F.schatten(0.04) : null;
    /* Gewände mit Fase */
    const gw = 0.12;
    werkstein(g, F, x0 - gw, y0 - gw, op.w + 2 * gw, hh + 2 * gw, op.i * 3, { farbe: hell(SAND, 0.04) });
    g.strokeStyle = "rgba(70,60,48,0.4)"; g.lineWidth = Math.max(0.008, 0.7 / F.px); g.strokeRect(x0 - gw, y0 - gw, op.w + 2 * gw, hh + 2 * gw);
    g.fillStyle = "rgba(255,250,236,0.25)"; vieleck(g, [[x0 - 0.05, y0 - 0.05], [x1 + 0.05, y0 - 0.05], [x1, y0], [x0, y0]]); g.fill();
    /* Rostfahne unter dem Fenster */
    const gr = g.createLinearGradient(0, y1 + gw, 0, y1 + 1.4);
    gr.addColorStop(0, "rgba(128,70,36,0.32)"); gr.addColorStop(1, "rgba(128,70,36,0)");
    g.fillStyle = gr; g.fillRect(cx - 0.1, y1 + gw, 0.2, 1.3);
    g.save(); g.beginPath(); g.rect(x0, y0, op.w, hh); g.clip();
    const [ox, oy] = laibung(g, F, x0, y0, x1, y1, 0.75, hell(SAND, -0.12));
    g.fillStyle = "rgb(20,18,22)"; g.fillRect(x0 + ox, y0 + oy, op.w, hh);
    if (K.Z.fenster) {
      /* kleine Bleiverglasung ganz hinten, matt */
      g.fillStyle = "rgba(120,140,160,0.35)"; g.fillRect(x0 + ox + 0.04, y0 + oy + 0.04, op.w - 0.08, hh - 0.08);
      g.strokeStyle = "rgba(20,20,24,0.6)"; g.lineWidth = 0.012;
      for (let x = x0 + ox + 0.1; x < x1 + ox; x += 0.11) { g.beginPath(); g.moveTo(x, y0 + oy); g.lineTo(x - 0.05, y1 + oy); g.stroke(); }
    }
    g.restore();
    if (K.Z.gitter) kreuzGitter(g, F, x0, y0, x1, y1, 0.14, false);
    band(g, F, x0 - gw - 0.04, x1 + gw + 0.04, y1 + gw, 0.08, 0.06, hell(SAND, 0.02), op.i);
    if (K.schnee > 0) schneeKante(g, x0 - gw - 0.04, x1 + gw + 0.04, y1 + gw + 0.004, 0.07 * K.schnee, op.i, F);
    void sv;
  }
  function zellenLicht(g, F, K, op, top, w) {
    const cx = w / 2, x0 = cx - op.w / 2, y0 = top - op.z1, hh = op.z1 - op.z0, a = F.nacht * op.licht;
    const [ox, oy] = sicht(F).tief(0.75);
    g.save(); g.beginPath(); g.rect(x0, y0, op.w, hh); g.clip();
    /* Kerzenschein fällt auf die Laibung, dahinter die hell erleuchtete Zelle */
    g.fillStyle = "rgba(214,130,60," + (0.75 * a) + ")"; g.fillRect(x0, y0, op.w, hh);
    const gr = g.createRadialGradient(cx + ox, y0 + oy + hh * 0.7, 0, cx + ox, y0 + oy + hh * 0.6, hh);
    gr.addColorStop(0, "rgba(255,214,140," + a + ")"); gr.addColorStop(1, "rgba(236,150,70," + (0.85 * a) + ")");
    g.fillStyle = gr; g.fillRect(x0 + ox, y0 + oy, op.w, hh);
    g.restore();
    kreuzGitter(g, F, x0, y0, x0 + op.w, y0 + hh, 0.14, true);
    if (F.leuchtPunkt) F.leuchtPunkt(cx, y0 + hh / 2, 1.1, "255,190,110", 0.5 * op.licht);
  }
  function kreuzGitter(g, F, x0, y0, x1, y1, d, nacht) {
    const S = sicht(F), [ox, oy] = S.tief(d), px = F.px;
    const sb = Math.max(0.022, 0.9 / px);
    const nv = Math.max(2, Math.round((x1 - x0) / 0.11)), nh = Math.max(2, Math.round((y1 - y0) / 0.15));
    const sv = F.schatten ? F.schatten(d + 0.3) : null;
    const staebe = (fn) => {
      for (let i = 1; i < nv; i++) { const x = x0 + (x1 - x0) * i / nv; fn(x - sb / 2, y0 - 0.03, sb, y1 - y0 + 0.06); }
      for (let i = 1; i < nh; i++) { const y = y0 + (y1 - y0) * i / nh; fn(x0 - 0.03, y - sb / 2, x1 - x0 + 0.06, sb); }
    };
    g.save(); g.beginPath(); g.rect(x0, y0, x1 - x0, y1 - y0); g.clip();
    if (sv && !nacht) { g.fillStyle = "rgba(0,0,0,0.35)"; staebe((a, b, w, h) => g.fillRect(a + ox + sv[0] * 0.3, b + oy + sv[1] * 0.3, w, h)); }
    g.fillStyle = nacht ? "rgba(22,18,16,0.95)" : "rgb(52,46,44)"; staebe((a, b, w, h) => g.fillRect(a + ox, b + oy, w, h));
    if (!nacht && px > 30) {
      /* Knoten (durchgesteckt) und Lichtkante */
      g.fillStyle = "rgba(190,180,170,0.4)";
      staebe((a, b, w, h) => g.fillRect(a + ox, b + oy, w > h ? w : Math.max(0.006, w * 0.3), w > h ? Math.max(0.006, h * 0.3) : h));
      g.fillStyle = "rgba(120,64,36,0.5)";
      for (let i = 1; i < nv; i++) for (let k = 1; k < nh; k++) { const x = x0 + (x1 - x0) * i / nv, y = y0 + (y1 - y0) * k / nh; g.beginPath(); g.arc(x + ox, y + oy, sb * 0.9, 0, Math.PI * 2); g.fill(); }
    }
    g.restore();
  }
  /* Wilder Wein: an der Bogenlänge verankert, Höhe wellig; Farbe nach Jahreszeit */
  function efeu(g, F, K, A0, top, w, h) {
    const px = F.px;
    if (px < 3) return;
    const jahr = F.jahr;
    const grenze = (A) => 2.6 + 3.2 * (0.5 + 0.5 * Math.sin(A * 0.8 + 2.4)) + 1.3 * ST.rausch(A * 1.5, 3, 11);
    const d = px > 30 ? 0.1 : px > 14 ? 0.16 : 0.26;
    const farben = jahr === "herbst" ? [[168, 40, 30], [196, 70, 34], [140, 30, 28], [210, 120, 44]] : jahr === "fruehling" ? [[130, 170, 76], [110, 156, 64], [150, 186, 90], [96, 140, 58]] : [[62, 104, 46], [48, 88, 40], [76, 118, 52], [40, 74, 36]];
    const dicht = jahr === "fruehling" ? 0.45 : jahr === "winter" ? 0 : jahr === "herbst" ? 0.8 : 1;
    /* Ranken (immer, im Winter allein): unregelmäßig verzweigt */
    g.strokeStyle = jahr === "winter" ? "rgba(88,72,58,0.55)" : "rgba(80,64,48,0.5)"; g.lineWidth = Math.max(0.01, 0.7 / px);
    g.beginPath();
    for (let A = Math.floor(A0 / 0.5) * 0.5; A < A0 + w + 0.5; A += 0.5) {
      const ia = Math.round(A * 2), hz = grenze(A);
      let x = A - A0 + (hash(ia, 1, 7) - 0.5) * 0.3, y = h;
      g.moveTo(x, y);
      for (let z = 0.25, k = 0; z < Math.min(hz, top); z += 0.22, k++) {
        x += (hash(ia, k, 8) - 0.5) * 0.18; y = top - z; g.lineTo(x, y);
        if (hash(ia, k, 9) < 0.22) { const l = 0.15 + 0.3 * hash(ia, k, 10), s2 = hash(ia, k, 11) < 0.5 ? -1 : 1; g.moveTo(x, y); g.quadraticCurveTo(x + s2 * l * 0.6, y - l * 0.2, x + s2 * l, y - l * 0.7); g.moveTo(x, y); }
      }
    }
    g.stroke();
    if (dicht <= 0) return;
    const eimer = [new Path2D(), new Path2D(), new Path2D(), new Path2D()], schatten = new Path2D();
    const sv = (F.schatten && F.schatten(0.06)) || [0.015, 0.03];
    for (let A = Math.floor(A0 / d) * d; A < A0 + w + d; A += d) {
      const ia = Math.round(A / d), hz = grenze(A);
      for (let z = 0.1; z < Math.min(hz, top); z += d) {
        const iz = Math.round(z / d);
        const rz = hash(ia, iz, 17);
        const rand = (hz - z) / 0.8;
        if (rz > dicht * Math.min(1, rand + 0.2)) continue;
        const x = A - A0 + (hash(ia, iz, 18) - 0.5) * d, y = top - z + (hash(ia, iz, 19) - 0.5) * d, r = d * (0.55 + 0.35 * hash(ia, iz, 20));
        const p = eimer[(hash(ia, iz, 21) * 4) | 0];
        p.moveTo(x + r, y); p.ellipse(x, y, r, r * 0.8, hash(ia, iz, 22) * 3, 0, Math.PI * 2);
        schatten.moveTo(x + r + sv[0], y + sv[1]); schatten.ellipse(x + sv[0], y + sv[1], r, r * 0.8, 0, 0, Math.PI * 2);
      }
    }
    g.fillStyle = "rgba(30,26,24,0.3)"; g.fill(schatten);
    for (let i = 0; i < 4; i++) { g.fillStyle = rgb(farben[i]); g.fill(eimer[i]); }
    if (px > 20) { g.fillStyle = "rgba(255,255,230,0.12)"; g.fill(eimer[2]); }
  }

  /* =====================================================================
     PORTALVORBAU mit Eisentür
     ===================================================================== */
  function portal(M, Z, K) {
    if (Z.turmZ < Z_SO + 0.3) return;
    const zO = Math.min(PO.z, Z.turmZ);
    M.teil("portal", { mitte: [CX, PO.y1, 5] });
    const w = PO.x1 - PO.x0;
    const front = (g, F) => {
      const top = zO, cx = w / 2;
      quader(g, F, -0.05, -0.05, F.w + 0.05, F.h + 0.05, 3.1, top);
      if (top >= PO.z - 0.01) { band(g, F, -0.05, F.w + 0.05, 0, 0.18, 0.08, hell(SAND, 0.05), 5); }
      eisenTuer(g, F, K, cx, top);
      /* Inschrift */
      if (top >= PO.z - 0.01) {
        const ty = top - 3.05, tw = 1.5, th = 0.36;
        const sv = F.schatten ? F.schatten(0.05) : null;
        if (sv) { g.fillStyle = "rgba(30,20,20,0.3)"; g.fillRect(cx - tw / 2 + sv[0], ty + sv[1], tw, th); }
        werkstein(g, F, cx - tw / 2, ty, tw, th, 71, { farbe: hell(SAND, 0.06) });
        g.strokeStyle = rgb(hell(SAND, -0.3), 0.8); g.lineWidth = Math.max(0.01, 0.8 / F.px); g.strokeRect(cx - tw / 2 + 0.04, ty + 0.04, tw - 0.08, th - 0.08);
        if (F.px > 22) {
          g.fillStyle = "rgba(64,50,36,0.9)"; g.textAlign = "center"; g.textBaseline = "middle";
          g.font = "bold 0.15px Georgia, serif"; g.fillText("GEFÄNGNIS", cx, ty + th * 0.42);
          g.font = "0.07px Georgia, serif"; g.fillText("ERBAUT " + K.V.jahr, cx, ty + th * 0.8);
        } else if (F.px > 8) { g.fillStyle = "rgba(90,70,50,0.45)"; g.fillRect(cx - 0.5, ty + 0.13, 1.0, 0.06); }
      }
      const gr = g.createLinearGradient(0, F.h, 0, F.h - 0.9); gr.addColorStop(0, "rgba(60,60,60,0.3)"); gr.addColorStop(1, "rgba(60,60,60,0)");
      g.fillStyle = gr; g.fillRect(-0.05, F.h - 0.9, F.w + 0.1, 0.9);
      if (K.winter && Z.fertig) { schneeWehe(g, F, -0.02, 0.2, F.h, 3); schneeWehe(g, F, F.w - 0.2, F.w + 0.02, F.h, 4); }
      if (F.px > 8) PI.bleichen(g, 0, 0, F.w, F.h, 2.4, 0.06, 5);
    };
    const seite = (A0) => (g, F) => {
      quader(g, F, -0.05, -0.05, F.w + 0.05, F.h + 0.05, A0, zO);
      if (zO >= PO.z - 0.01) band(g, F, -0.05, F.w + 0.05, 0, 0.18, 0.08, hell(SAND, 0.05), 6);
      const gr = g.createLinearGradient(0, F.h, 0, F.h - 0.9); gr.addColorStop(0, "rgba(60,60,60,0.3)"); gr.addColorStop(1, "rgba(60,60,60,0)");
      g.fillStyle = gr; g.fillRect(-0.05, F.h - 0.9, F.w + 0.1, 0.9);
    };
    wandFlaeche(M, "portal-s", [PO.x0, PO.y1], [PO.x1, PO.y1], 0, zO, front);
    wandFlaeche(M, "portal-o", [PO.x1, PO.y1], [PO.x1, PO.y0], 0, zO, seite(9));
    wandFlaeche(M, "portal-w", [PO.x0, PO.y0], [PO.x0, PO.y1], 0, zO, seite(11));
    if (zO >= PO.z - 0.01) {
      /* Abdeckplatte, leicht vorstehend, mit Wasserschlag */
      deckel(M, "portal-deckel", PO.x0 - 0.08, PO.y0, PO.x1 + 0.08, PO.y1 + 0.08, PO.z + 0.02, (g, F) => {
        g.fillStyle = rgb(hell(SAND, 0.08)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
        if (F.px > 8) rausch(g, 0, 0, F.w, F.h, 0.6, 0.25, 7, 3);
        if (K.schnee > 0) { g.fillStyle = rgb(SCHNEE, 0.4 + 0.58 * K.schnee); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); }
      });
    }
    /* Stufen */
    if (Z.turmZ >= Z_TW - 0.01 || Z.tuer) {
      const stufe = (g, F) => { g.fillStyle = rgb(hell(SAND, -0.02)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); if (F.px > 8) rausch(g, 0, 0, F.w, F.h, 0.5, 0.3, 8, 3); g.fillStyle = "rgba(40,30,26,0.3)"; g.fillRect(-0.1, F.h - 0.02, F.w + 0.2, 0.03); };
      const stufeO = (g, F) => { g.fillStyle = rgb(hell(SAND, 0.1)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); if (F.px > 8) rausch(g, 0, 0, F.w, F.h, 0.5, 0.25, 9, 3); if (K.schnee > 0) { g.fillStyle = rgb(SCHNEE, 0.3 + 0.6 * K.schnee); g.fillRect(-0.1, F.h * 0.4, F.w + 0.2, F.h); } };
      M.quader({ x: CX - 0.8, y: PO.y1, z: 0, b: 1.6, t: 0.72, h: 0.14 }, { sued: stufe, ost: stufe, west: stufe, oben: stufeO });
      M.quader({ x: CX - 0.7, y: PO.y1, z: 0.14, b: 1.4, t: 0.38, h: 0.14 }, { sued: stufe, ost: stufe, west: stufe, oben: stufeO });
    }
    if (Z.laterne) wandLaterne(M, CX + 0.74, PO.y1, 2.55, K, Z, [0, 1, 0]);
  }
  function tuerPfad(p, x0, x1, yB, yK) {
    const r = (x1 - x0) / 2;
    p.moveTo(x0, yB); p.lineTo(x0, yK); p.arc(x0 + r, yK, r, Math.PI, 0); p.lineTo(x1, yB); p.closePath();
  }
  function eisenTuer(g, F, K, cx, top) {
    const S = sicht(F), px = F.px, r = TUER.w / 2;
    const x0 = cx - r, x1 = cx + r, yB = top - TUER.z0, yK = top - TUER.zk - TUER.z0;
    if (yK - r < 0) return;
    /* Keilsteinbogen und Gewände */
    const ring = 0.26;
    const sv = F.schatten ? F.schatten(0.03) : null;
    const stein = (p, c) => { if (sv) { g.save(); g.translate(sv[0], sv[1]); g.fillStyle = "rgba(40,30,24,0.3)"; g.fill(p); g.restore(); } g.fillStyle = rgb(c); g.fill(p); };
    const nK = 9;
    for (let k = 0; k < nK; k++) {
      const a0 = Math.PI + Math.PI * k / nK, a1 = Math.PI + Math.PI * (k + 1) / nK, sch = k === 4;
      const p = new Path2D(); p.arc(cx, yK, r + 0.005, a0 + 0.006, a1 - 0.006); p.arc(cx, yK, r + ring + (sch ? 0.08 : 0), a1 - 0.006, a0 + 0.006, true); p.closePath();
      stein(p, hell(SAND, sch ? 0.1 : (hash(k, 3, 3) - 0.5) * 0.1));
    }
    let z = 0, i = 0;
    while (z < TUER.zk - 0.01) { const hq = Math.min(TUER.zk - z, i % 2 ? 0.36 : 0.44), bq = i % 2 ? 0.2 : 0.3; for (const s of [-1, 1]) { const p = new Path2D(); p.rect(s < 0 ? x0 - bq + 0.006 : x1 + 0.006, yB - z - hq + 0.006, bq - 0.012, hq - 0.012); stein(p, hell(SAND, (hash(i, s, 5) - 0.5) * 0.1)); } z += hq; i++; }
    if (px > 10) rausch(g, x0 - 0.35, yK - r - 0.4, TUER.w + 0.7, TUER.zk + r + 0.5, 0.7, 0.2, 13, 3);
    const ob = new Path2D(); tuerPfad(ob, x0, x1, yB, yK);
    g.save(); g.clip(ob);
    const d = 0.32, [ox, oy] = S.tief(d);
    g.fillStyle = rgb(mal(hell(SAND, -0.14), S.rel([0, 0, -1]))); g.fill(ob);
    if (ox > 0) { g.fillStyle = rgb(mal(hell(SAND, -0.06), S.rel(S.u))); g.fillRect(x0, yK - r, ox, TUER.zk + r + 1); }
    else { g.fillStyle = rgb(mal(hell(SAND, -0.06), S.rel(mul(S.u, -1)))); g.fillRect(x1 + ox, yK - r, -ox, TUER.zk + r + 1); }
    g.translate(ox, oy);
    const tb = new Path2D(); tuerPfad(tb, x0, x1, yB + 0.1, yK);
    g.clip(tb);
    if (!K.Z.tuer) { g.fillStyle = "rgb(26,24,26)"; g.fill(tb); }
    else {
      /* Eisenplatten, rautenförmig beschlagen, Nieten, Kastenschloss */
      const w = TUER.w, hT = yB - (yK - r);
      const gr = g.createLinearGradient(x0, 0, x1, 0);
      gr.addColorStop(0, "rgb(74,70,70)"); gr.addColorStop(0.5, "rgb(62,58,58)"); gr.addColorStop(1, "rgb(48,44,46)");
      g.fillStyle = gr; g.fill(tb);
      if (px > 10) { rausch(g, x0, yK - r, w, hT, 0.5, 0.35, 21, 3); g.save(); g.globalAlpha = 0.25; g.fillStyle = "rgb(140,72,36)"; g.fillRect(x0, yB - 0.5, w, 0.5); g.restore(); }
      /* Plattenfugen */
      g.strokeStyle = "rgba(20,18,18,0.8)"; g.lineWidth = Math.max(0.01, 0.8 / px);
      for (let y = yB - 0.42; y > yK - r; y -= 0.42) { g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); }
      g.beginPath(); g.moveTo(cx, yK - r); g.lineTo(cx, yB); g.stroke();
      /* Rautenbänder */
      g.strokeStyle = "rgb(36,34,36)"; g.lineWidth = 0.045;
      const st = 0.3;
      g.beginPath();
      for (let k = -8; k < 8; k++) { const xa = x0 + k * st; g.moveTo(xa, yB); g.lineTo(xa + hT, yB - hT); g.moveTo(xa + w, yB); g.lineTo(xa + w - hT, yB - hT); }
      g.stroke();
      if (px > 24) {
        g.strokeStyle = "rgba(170,166,160,0.35)"; g.lineWidth = 0.012; g.stroke();
        g.fillStyle = "rgb(30,28,28)";
        for (let a = 0; a < 16; a++) for (let b = 0; b < 16; b++) {
          const X = x0 + (a - b) * st / 2 + st / 2, Y = yB - (a + b) * st / 2 - st / 2 + st / 2;
          if (X < x0 || X > x1 || Y < yK - r || Y > yB) continue;
          g.beginPath(); g.arc(X, Y, 0.022, 0, Math.PI * 2); g.fill();
        }
      }
      /* Kastenschloss, Ring, Guckloch */
      g.fillStyle = "rgb(30,28,28)"; g.fillRect(x1 - 0.3, yB - 1.2, 0.22, 0.3);
      g.fillStyle = "rgba(180,176,170,0.4)"; g.fillRect(x1 - 0.3, yB - 1.2, 0.22, 0.03);
      g.fillStyle = "rgb(12,10,10)"; g.fillRect(x1 - 0.2, yB - 1.08, 0.03, 0.07);
      g.strokeStyle = "rgb(34,32,32)"; g.lineWidth = 0.03; g.beginPath(); g.arc(cx - 0.18, yB - 1.02, 0.08, 0, Math.PI * 2); g.stroke();
      g.fillStyle = "rgb(16,14,16)"; g.fillRect(cx - 0.1, yB - 1.72, 0.2, 0.14);
      g.strokeStyle = "rgb(60,56,56)"; g.lineWidth = 0.015; for (let x = cx - 0.06; x < cx + 0.1; x += 0.05) { g.beginPath(); g.moveTo(x, yB - 1.72); g.lineTo(x, yB - 1.58); g.stroke(); }
      /* Bänder (Angeln) links */
      g.fillStyle = "rgb(30,28,30)"; for (const y of [yB - 0.4, yB - 1.7]) g.fillRect(x0, y - 0.035, 0.45, 0.07);
      const gu = g.createLinearGradient(0, yB, 0, yB - 0.5); gu.addColorStop(0, "rgba(20,16,12,0.5)"); gu.addColorStop(1, "rgba(20,16,12,0)");
      g.fillStyle = gu; g.fillRect(x0, yB - 0.5, w, 0.5);
    }
    g.restore();
    /* Schatten des Bogens in der Laibung */
    const s2 = F.schatten ? F.schatten(d) : null;
    g.save(); g.clip(ob);
    if (s2) { const sp = new Path2D(); sp.rect(x0 - 1, yK - r - 1, TUER.w + 2, TUER.zk + r + 2); tuerPfad(sp, x0 + s2[0], x1 + s2[0], yB + s2[1] + 1, yK + s2[1]); g.fillStyle = "rgba(16,14,24,0.42)"; g.fill(sp, "evenodd"); }
    else { g.fillStyle = "rgba(16,14,24,0.28)"; g.fill(ob); }
    g.restore();
    /* Schwelle */
    werkstein(g, F, x0 - 0.1, yB - 0.06, TUER.w + 0.2, 0.08, 23);
  }

  /* =====================================================================
     KEGELDACH (Schiefer, Schuppendeckung) mit Knauf und Wetterfahne
     ===================================================================== */
  function kegel(M, Z, K) {
    if (Z.kSparren <= 0) return;
    M.teil("kegel", { mitte: [CX, CY, 12.5], schatten: Z.kSchiefer > 0.3 });
    const A = [CX, CY, Z_SP];
    for (let i = 0; i < N; i++) {
      const a0 = WINKEL(i), a1 = WINKEL(i + 1), am = (a0 + a1) / 2;
      const B0 = [CX + RE * Math.cos(a0), CY + RE * Math.sin(a0), Z_TE], B1 = [CX + RE * Math.cos(a1), CY + RE * Math.sin(a1), Z_TE];
      polyFlaeche(M, [B1, B0, A], [KEG * Math.cos(am), KEG * Math.sin(am), 1], gepuffert(kegelMaler(i, a1, a0, Z, K)), { name: "kegel-" + i, keinLicht: true });
      if (Z.kLatten > 0) wandFlaeche(M, "kegel-traufe-" + i, [B1[0], B1[1]], [B0[0], B0[1]], Z_TE - 0.16, Z_TE, gepuffert(traufRing(i, a1, a0, Z, K)), { keinLicht: true, ao: false });
    }
    if (!Z.kZu) {
      /* Dachboden (Balkenlage) auf der Mauerkrone, sichtbar durch den Dachstuhl */
      const p = [];
      for (let i = 0; i < N; i++) { const a = WINKEL(i); p.push([CX + R * Math.cos(a), CY + R * Math.sin(a), Z_TW + 0.01]); }
      polyFlaeche(M, p, [0, 0, 1], (g, F) => {
        g.fillStyle = "rgb(170,132,92)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
        if (F.px > 8) for (let x = 0; x < F.w; x += 0.22) { g.fillStyle = "rgba(60,40,24,0.35)"; g.fillRect(x, 0, 0.012, F.h); }
        rausch(g, 0, 0, F.w, F.h, 1.2, 0.2, 11, 3);
        if (K.winter) { g.fillStyle = "rgba(242,246,252,0.5)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); }
      }, { name: "dachboden", ebene: -1 });
    }
    if (Z.knauf) knauf(M, K);
  }
  function kegelMaler(i, aL, aR, Z, K) {
    return function (g, F) {
      const w = F.w, h = F.h, nz = 1 / KEG;
      const offen = !Z.kZu;
      if (offen) {
        /* Sparren an den Feldkanten und in der Mitte, Latten, Schiefer von unten */
        const S = sicht(F), lf = S.lf, holz = [170, 130, 88];
        const yS = h * (1 - Z.kSchiefer);
        if (Z.kSchiefer > 0) {
          g.save(); g.beginPath(); g.rect(-0.1, yS, w + 0.2, h - yS + 0.1); g.clip();
          biber(g, F, w, h, K.V.schiefer, 30 + (i % 3));
          rundLicht(g, F, aL, aR, nz);
          g.restore();
        }
        g.save(); g.beginPath(); g.rect(-0.1, -0.1, w + 0.2, yS + 0.1); g.clip();
        const c = (k) => rgb(mal(hell(holz, k), lf));
        const sp = (xa, xb, b) => { g.fillStyle = c(0); vieleck(g, [[w / 2 - b * 0.2, 0], [w / 2 + b * 0.2, 0], [xb, h], [xa, h]]); g.fill(); };
        if (Z.kSparren > ((i - 9 + N) % N) / N) { sp(-0.07, 0.07, 0.14); sp(w / 2 - 0.07, w / 2 + 0.07, 0.14); sp(w - 0.07, w + 0.07, 0.14); }
        if (Z.kLatten > 0) {
          const nl = Math.floor(h / 0.35);
          for (let k = 0; k < nl; k++) {
            if ((k + 1) / nl > Z.kLatten * 1.0001) continue;
            const y = h - k * 0.35 - 0.1, t = y / h;
            g.fillStyle = c(0.1); g.fillRect(w / 2 - w / 2 * t - 0.05, y, w * t + 0.1, 0.045);
          }
        } else if (Z.kSparren > ((i - 9 + N) % N) / N) {
          /* Kehlbalkenringe halten die Sparren zusammen */
          for (const t of [0.35, 0.68]) { g.fillStyle = c(-0.1); g.fillRect(w / 2 - w / 2 * t - 0.05, h * t, w * t + 0.1, 0.1); }
        }
        g.restore();
        return;
      }
      biber(g, F, w, h, K.V.schiefer, 30 + (i % 3));
      /* Silberner Glanz des Schiefers, Flechten */
      if (F.px > 6) { g.fillStyle = "rgba(200,210,230,0.06)"; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2); rausch(g, 0, 0, w, h, 2.5, 0.12, 14, 3); }
      /* Gratlinie oben, Ruß-/Wasserspuren */
      if (K.schnee > 0) {
        g.save(); g.globalAlpha = Math.min(1, K.schnee * 1.05);
        PI.schneeDach(g, 0, h * 0.3, w, h * 0.7, F, { deck: 0.55 * K.schnee, saat: 40 + (i % 4), durch: true });
        g.restore();
        /* Schneefang über der Traufe */
        g.fillStyle = "rgba(50,50,56,0.8)"; g.fillRect(0, h - 0.5, w, 0.03);
      }
      rundLicht(g, F, aL, aR, nz);
    };
  }
  function traufRing(i, aL, aR, Z, K) {
    return function (g, F) {
      g.fillStyle = "rgb(88,70,54)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      if (Z.kZu) { g.fillStyle = "rgb(126,130,132)"; g.fillRect(-0.1, 0, F.w + 0.2, F.h * 0.6); g.fillStyle = "rgba(255,255,255,0.3)"; g.fillRect(-0.1, 0.01, F.w + 0.2, 0.02); }
      if (K.schnee > 0 && Z.kZu) { g.fillStyle = rgb(SCHNEE); g.fillRect(-0.1, -0.03, F.w + 0.2, 0.06); PI.eiszapfen(g, 0.05, F.w - 0.05, F.h, F, { laenge: 0.4 * K.schnee, saat: 5 + i }); }
      rundLicht(g, F, aL, aR, 0);
    };
  }
  /* Kaiserstiel mit Knauf, Wetterfahne mit Jahreszahl */
  function knauf(M, K) {
    M.figur({
      x: CX, y: CY, z: Z_SP - 0.05, breite: 0.9, hoehe: 1.5, schatten: true,
      malen(g, s, F) {
        const KZ = ST.KZ, sch = F.schatten, A = abbild(F, s);
        const L = A.licht([-0.6, 0.6, 0.5]);
        const gold = sch ? "#000" : rgb(mal([214, 170, 76], L)), eisen = sch ? "#000" : rgb(mal([50, 48, 50], L));
        const y = (m) => -m * KZ * s;
        /* Blechhaube über der Spitze */
        g.fillStyle = sch ? "#000" : rgb(mal([80, 90, 96], L));
        g.beginPath(); g.moveTo(-0.1 * s, y(0.05)); g.lineTo(0.1 * s, y(0.05)); g.lineTo(0.03 * s, y(0.35)); g.lineTo(-0.03 * s, y(0.35)); g.closePath(); g.fill();
        g.strokeStyle = eisen; g.lineWidth = Math.max(1, 0.035 * s);
        g.beginPath(); g.moveTo(0, y(0.3)); g.lineTo(0, y(1.45)); g.stroke();
        g.fillStyle = gold; g.beginPath(); g.arc(0, y(0.55), 0.1 * s, 0, Math.PI * 2); g.fill();
        if (!sch) { g.fillStyle = "rgba(255,245,210,0.6)"; g.beginPath(); g.arc(-0.03 * s, y(0.58), 0.035 * s, 0, Math.PI * 2); g.fill(); }
        /* Fahne: je nach Blickwinkel breiter oder schmaler (dreht mit dem Modell) */
        const br = Math.max(0.25, Math.abs(Math.cos((F.gier || 0) * RAD + 0.6)));
        g.fillStyle = eisen;
        g.beginPath(); g.moveTo(0, y(1.05)); g.lineTo(0.55 * s * br, y(1.08)); g.lineTo(0.48 * s * br, y(1.18)); g.lineTo(0.55 * s * br, y(1.28)); g.lineTo(0, y(1.3)); g.closePath(); g.fill();
        g.fillStyle = gold; g.beginPath(); g.arc(0, y(1.47), 0.04 * s, 0, Math.PI * 2); g.fill();
        if (K.schnee > 0 && !sch) { g.fillStyle = rgb(mal(SCHNEE, L)); g.beginPath(); g.ellipse(0, y(0.63), 0.08 * s, 0.03 * s, 0, 0, Math.PI * 2); g.fill(); }
      }
    });
  }

  /* =====================================================================
     WACHSTUBE (verputzt, Pultdach)
     ===================================================================== */
  const AFENSTER = {
    ost: [{ x: 1.55, z0: 1.05, z1: 2.35, w: 0.8, licht: 1 }, { x: 4.1, z0: 1.05, z1: 2.35, w: 0.8, licht: 0.85 }],
    sued: [{ x: 1.2, z0: 0.5, z1: 2.6, w: 0.95, art: "tuer" }, { x: 0.75, z0: 3.3, z1: 3.85, w: 0.45, art: "luke" }],
    nord: [{ x: 1.25, z0: 1.3, z1: 2.3, w: 0.6 }],
    west: [{ x: 2.9, z0: 1.3, z1: 2.3, w: 0.6 }]
  };
  function anbau(M, Z, K) {
    if (Z.sockel <= 0) return;
    const zN = Z.sockel < 1 ? Z_SO * Z.sockel : Z.anbauZ;
    M.teil("wachstube", { mitte: [(AX0 + AX1) / 2, (AY0 + AY1) / 2, 2.2] });
    const ld = (x) => Z_AH - A_NEIG * (x - AX0);           // Oberkante der Wand über x
    /* Süd: links hoch (AX0), rechts niedrig */
    const wS = AX1 - AX0;
    const trapez = (links, rechts) => { let p = [[0, Z_AH - links], [wS, Z_AH - rechts], [wS, Z_AH], [0, Z_AH]]; return kappen(p, Z_AH - zN); };
    const pS = trapez(ld(AX0), ld(AX1)), pN = trapez(ld(AX1), ld(AX0));
    const mS = anbauMaler("sued", 0, Z_AH, K, wS, true), mN = anbauMaler("nord", 7, Z_AH, K, wS, true);
    if (pS.length >= 3) M.flaeche({ name: "a-sued", o: [AX0, AY1, Z_AH], u: [1, 0, 0], v: [0, 0, -1], w: wS, h: Z_AH, umriss: pS, malen: mS, leuchten: mS.leuchten, ao: true, traufe: zN >= Z_AH - 0.01 ? 0 : 0 });
    if (pN.length >= 3) M.flaeche({ name: "a-nord", o: [AX1, AY0, Z_AH], u: [-1, 0, 0], v: [0, 0, -1], w: wS, h: Z_AH, umriss: pN, malen: mN, leuchten: mN.leuchten, ao: true });
    const zO = Math.min(zN, Z_AL);
    const mO = anbauMaler("ost", 3, zO, K, AY1 - AY0, false);
    wandFlaeche(M, "a-ost", [AX1, AY1], [AX1, AY0], 0, zO, mO, { traufe: zN >= Z_AH - 0.01 ? A_UE + 0.1 : 0, traufeY: 0 });
    const zW = Math.min(zN, Z_AH);
    wandFlaeche(M, "a-west", [AX0, CY], [AX0, AY1], 0, zW, anbauMaler("west", 11, zW, K, AY1 - CY, false));
    /* offen: Innenseiten, Krone, Boden */
    if (!Z.aZu && zN > Z_SO + 0.02) {
      const d = 0.4, x0 = AX0 + d, x1 = AX1 - d, y0 = AY0 + d, y1 = AY1 - d, zi = Math.min(zN, Z_AL);
      const innen = (g, F) => { g.fillStyle = "rgb(150,140,126)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); rausch(g, 0, 0, F.w, F.h, 0.8, 0.3, 5, 3); g.fillStyle = "rgba(30,24,20,0.2)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); };
      wandFlaeche(M, "a-in-n", [x0, y0], [x1, y0], Z_SO, zi, innen);
      wandFlaeche(M, "a-in-o", [x1, y0], [x1, y1], Z_SO, zi, innen);
      wandFlaeche(M, "a-in-w", [x0, y1], [x0, y0], Z_SO, zi, innen);
      wandFlaeche(M, "a-in-s", [x1, y1], [x0, y1], Z_SO, zi, innen);
      const krone = (g, F) => { g.fillStyle = "rgb(160,152,140)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.fillStyle = "rgba(240,236,224,0.4)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h * 0.4); };
      deckel(M, "a-kr-n", AX0, AY0, AX1, y0, zi, krone); deckel(M, "a-kr-s", AX0, y1, AX1, AY1, zi, krone);
      deckel(M, "a-kr-w", AX0, y0, x0, y1, zi, krone); deckel(M, "a-kr-o", x1, y0, AX1, y1, zi, krone);
      deckel(M, "a-boden", x0, y0, x1, y1, Z_SO, (g, F) => { g.fillStyle = "rgb(160,150,138)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); if (K.winter) { g.fillStyle = "rgba(240,244,250,0.6)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); } });
    }
    /* Laterne am Eingang der Wache und Schild */
    if (Z.laterne) wandLaterne(M, AX0 + 0.42, AY1, 2.75, K, Z, [0, 1, 0]);
  }
  function anbauMaler(seite, saat, top, K, laenge, trapez) {
    const ops = AFENSTER[seite] || [];
    const m = function (g, F) {
      const w = F.w, h = F.h, Z = K.Z;
      /* Mauerwerk vor dem Putz: Bruchstein; dann Kalkputz */
      if (Z.putz) PI.putz(g, -0.05, -0.05, w + 0.1, h + 0.1, K.V.putz, F, { saat: saat + 3, boden: true });
      else { g.fillStyle = "rgb(150,140,124)"; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2); feldsteinFein(g, F, w, h); }
      /* Eckquader an beiden Kanten */
      if (F.px > 5) for (const kante of [0, 1]) eckquader(g, F, kante ? w : 0, kante ? -1 : 1, top, h, saat + kante);
      for (const op of ops) {
        if (op.z0 > top) continue;
        const y0 = top - op.z1, y1 = top - op.z0, x0 = op.x - op.w / 2;
        if (op.art === "tuer") {
          if (Z.tuer) {
            PI.tuer(g, x0, y0, op.w, y1 - y0, F, { farbe: K.V.laeden, gewaendeFarbe: rgb(SAND), bogen: false, stufe: true });
            /* Schild „WACHE" über der Tür */
            if (Z.schild) {
              g.fillStyle = "rgba(20,16,12,0.3)"; g.fillRect(x0 - 0.06, y0 - 0.44, op.w + 0.12, 0.26);
              g.fillStyle = "rgb(236,230,214)"; g.fillRect(x0 - 0.08, y0 - 0.46, op.w + 0.12, 0.26);
              g.strokeStyle = rgb(hex(K.V.laeden)); g.lineWidth = 0.025; g.strokeRect(x0 - 0.06, y0 - 0.44, op.w + 0.08, 0.22);
              if (F.px > 18) { g.fillStyle = "rgb(30,30,34)"; g.font = "bold 0.14px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("WACHE", op.x - 0.02, y0 - 0.33); }
            }
          } else {
            werkstein(g, F, x0 - 0.12, y0 - 0.12, op.w + 0.24, y1 - y0 + 0.12, 33);
            g.save(); g.beginPath(); g.rect(x0, y0, op.w, y1 - y0); g.clip();
            const [ox, oy] = laibung(g, F, x0, y0, x0 + op.w, y1, 0.4, hell(SAND, -0.1));
            g.fillStyle = "rgb(30,27,28)"; g.fillRect(x0 + ox, y0 + oy, op.w, y1 - y0); g.restore();
          }
          continue;
        }
        if (op.art === "luke") {
          werkstein(g, F, x0 - 0.08, y0 - 0.08, op.w + 0.16, y1 - y0 + 0.16, 44);
          g.save(); g.beginPath(); g.rect(x0, y0, op.w, y1 - y0); g.clip();
          const [ox, oy] = laibung(g, F, x0, y0, x0 + op.w, y1, 0.3, hell(SAND, -0.1));
          g.fillStyle = "rgb(26,24,28)"; g.fillRect(x0 + ox, y0 + oy, op.w, y1 - y0);
          g.restore();
          if (Z.gitter) kreuzGitter(g, F, x0, y0, x0 + op.w, y1, 0.06, false);
          continue;
        }
        /* Fenster mit Läden */
        werkstein(g, F, x0 - 0.1, y0 - 0.1, op.w + 0.2, y1 - y0 + 0.2, 50 + saat);
        g.save(); g.beginPath(); g.rect(x0, y0, op.w, y1 - y0); g.clip();
        const [ox, oy] = laibung(g, F, x0, y0, x0 + op.w, y1, 0.25, hell(SAND, -0.08));
        if (Z.fenster) { const [fx, fy] = sicht(F).tief(0.12); PI.fenster(g, x0 + fx, y0 + fy, op.w, y1 - y0, F, { fluegel: 2, sprossen: [1, 3], bank: false, rahmen: "#ece6d8", laibung: "#c8bca4", tiefe: 0.12, rahmenBreite: 0.055 }); }
        else { g.fillStyle = "rgb(30,27,28)"; g.fillRect(x0 + ox, y0 + oy, op.w, y1 - y0); }
        g.restore();
        if (Z.fenster) PI.laeden(g, x0, y0, op.w, y1 - y0, F, { laeden: K.V.laeden });
        band(g, F, x0 - 0.14, x0 + op.w + 0.14, y1, 0.08, 0.06, SAND, 55 + saat);
        if (K.schnee > 0) schneeKante(g, x0 - 0.14, x0 + op.w + 0.14, y1 + 0.004, 0.07 * K.schnee, saat, F);
        if (K.Z.fenster && seite === "ost" && !K.winter && F.px > 8) PI.blumenkasten(g, x0 - 0.02, y1 - 0.02, op.w + 0.04, F, "sommer", {});
      }
      /* Sockel */
      const zs = Math.min(0.5, top);
      werkstein(g, F, -0.05, h - zs, w + 0.1, zs + 0.05, saat + 90, { farbe: hell(SAND, -0.06), fugen: [0.9, 1.9, 2.8, 3.8, 4.7] });
      if (top >= 0.5 && K.schnee > 0) schneeKante(g, -0.05, w + 0.05, h - 0.5 + 0.004, 0.05 * K.schnee, saat + 1, F);
      if (K.herbst) laubFuss(g, F, 0, w, h, saat + 7);
      if (K.winter && Z.fertig) schneeWehe(g, F, 0, w, h, saat + 2);
    };
    const hell0 = ops.filter((o) => o.licht);
    if (hell0.length) m.leuchten = function (g, F) {
      if (!K.Z.licht) return;
      for (const op of hell0) {
        const y0 = top - op.z1, x0 = op.x - op.w / 2, hh = op.z1 - op.z0;
        const [fx, fy] = sicht(F).tief(0.12);
        g.save(); g.beginPath(); g.rect(x0, y0, op.w, hh); g.clip();
        PI.fensterLicht(g, x0 + fx, y0 + fy, op.w, hh, F, { an: op.licht, fluegel: 2, sprossen: [1, 3], rahmenBreite: 0.055, farbe: [255, 188, 108] });
        g.restore();
      }
    };
    return m;
  }
  function feldsteinFein(g, F, w, h) {
    if (F.px < 6) return;
    const rng = ST.zufall(Math.round(w * 31 + h * 7));
    const n = Math.min(500, Math.round(w * h * 12));
    for (let i = 0; i < n; i++) { const x = rng() * w, y = rng() * h, r = 0.1 + rng() * 0.1; g.fillStyle = rgb([[160, 150, 134], [138, 130, 118], [172, 160, 140]][(rng() * 3) | 0]); g.beginPath(); g.ellipse(x, y, r, r * 0.6, 0, 0, Math.PI * 2); g.fill(); }
  }
  /* Eckquader: abwechselnd lange und kurze Steine an einer Kante */
  function eckquader(g, F, x, dir, top, h, saat) {
    const sv = F.schatten ? F.schatten(0.02) : null;
    for (let z = 0.5, k = 0; z < top - 0.05; z += 0.36, k++) {
      const hq = Math.min(0.34, top - z), L = k % 2 ? 0.32 : 0.52;
      const xa = dir > 0 ? x : x - L, y = top - z - hq;
      if (sv) { g.fillStyle = "rgba(40,30,24,0.25)"; g.fillRect(xa + sv[0], y + sv[1], L, hq); }
      g.fillStyle = rgb(hell(SAND, (hash(k, saat, 3) - 0.5) * 0.12)); g.fillRect(xa, y, L, hq);
      g.fillStyle = "rgba(255,250,236,0.25)"; g.fillRect(xa, y, L, 0.02);
    }
    void h;
  }
  /* Pultdach der Wachstube */
  function anbauDach(M, Z, K) {
    if (Z.aSparren <= 0) return;
    M.teil("wachstube-dach", { mitte: [(AX0 + AX1) / 2, (AY0 + AY1) / 2, 4.6], schatten: Z.aZiegel > 0.2 });
    const zH = Z_AH + A_D, lauf = AX1 + A_UE - AX0, fall = lauf * A_NEIG, L = Math.hypot(lauf, fall), zE = zH - fall;
    const wD = AY1 - AY0 + 2 * A_UE;
    const m = (g, F) => {
      const w = F.w, h = F.h, offen = !Z.aZu;
      if (offen) {
        const S = sicht(F), lf = S.lf, holz = [168, 128, 86];
        const yZ = h * (1 - Z.aZiegel);
        if (Z.aZiegel > 0) { g.save(); g.beginPath(); g.rect(-0.1, yZ, w + 0.2, h - yZ + 0.1); g.clip(); biber(g, F, w, h, K.V.dach, 5); g.globalCompositeOperation = "multiply"; g.fillStyle = rgb(lf.map((v) => v * 255)); g.fillRect(-0.1, yZ, w + 0.2, h); g.restore(); }
        g.save(); g.beginPath(); g.rect(-0.1, -0.1, w + 0.2, yZ + 0.1); g.clip();
        const n = Math.round(w / 0.8);
        for (let i = 0; i <= n; i++) { if (i / n > Z.aSparren + 1e-6) break; const x = w * i / n; g.fillStyle = rgb(mal(hell(holz, -0.25), lf)); g.fillRect(x - 0.06, 0.04, 0.12, h); g.fillStyle = rgb(mal(holz, lf)); g.fillRect(x - 0.06, 0, 0.12, h); }
        if (Z.aLatten > 0) for (let y = h - 0.1; y > 0; y -= 0.3) { if ((h - y) / h > Z.aLatten) break; g.fillStyle = rgb(mal(hell(holz, 0.1), lf)); g.fillRect(-0.05, y, w + 0.1, 0.045); }
        g.restore();
        return;
      }
      biber(g, F, w, h, K.V.dach, 5);
      if (K.schnee > 0) { g.save(); g.globalAlpha = Math.min(1, K.schnee * 1.1); PI.schneeDach(g, 0, 0.05, w, h - 0.05, F, { deck: 0.95 * K.schnee, saat: 21 }); g.restore(); }
      else if (K.herbst && F.px > 8) { const rng = ST.zufall(9); for (let i = 0; i < w * 10; i++) { g.fillStyle = rgb([[176, 92, 34], [198, 140, 48], [140, 60, 30]][(rng() * 3) | 0], 0.85); g.beginPath(); g.ellipse(rng() * w, rng() * h, 0.04, 0.025, rng() * 3, 0, Math.PI * 2); g.fill(); } }
      /* Anschluss an den Turm: Blechstreifen, Schatten */
      g.fillStyle = "rgba(90,96,100,0.9)"; g.fillRect(-0.1, 0, w + 0.2, 0.08);
      const gr = g.createLinearGradient(0, 0, 0, 0.6); gr.addColorStop(0, "rgba(20,16,20,0.35)"); gr.addColorStop(1, "rgba(20,16,20,0)");
      g.fillStyle = gr; g.fillRect(-0.1, 0, w + 0.2, 0.6);
    };
    M.flaeche({ name: "a-dach", o: [AX0, AY1 + A_UE, zH], u: [0, -1, 0], v: nrm([lauf, 0, -fall]), w: wD, h: L, malen: m, keinLicht: !Z.aZu, dach: true });
    if (Z.aLatten > 0) {
      const brett = (g, F) => { g.fillStyle = "rgb(96,74,54)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); if (Z.aZu) { g.fillStyle = "rgb(120,124,126)"; g.fillRect(-0.1, 0, F.w + 0.2, F.h * 0.55); if (K.schnee > 0) { g.fillStyle = rgb(SCHNEE); g.fillRect(-0.1, -0.03, F.w + 0.2, 0.06); PI.eiszapfen(g, 0.1, F.w - 0.1, F.h, F, { laenge: 0.3 * K.schnee, saat: 3 }); } } };
      wandFlaeche(M, "a-traufe", [AX1 + A_UE, AY1 + A_UE], [AX1 + A_UE, AY0 - A_UE], zE - 0.15, zE, brett, { ao: false, keinAo: true });
      const ort = (g, F) => { g.fillStyle = "rgb(96,74,54)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); if (K.schnee > 0 && Z.aZu) { g.fillStyle = rgb(SCHNEE); g.fillRect(-0.1, -0.1, F.w + 0.2, 0.07); } };
      polyFlaeche(M, [[AX0, AY1 + A_UE, zH], [AX1 + A_UE, AY1 + A_UE, zE], [AX1 + A_UE, AY1 + A_UE, zE - 0.15], [AX0, AY1 + A_UE, zH - 0.15]], [0, 1, 0], ort, { name: "a-ort-s" });
      polyFlaeche(M, [[AX1 + A_UE, AY0 - A_UE, zE], [AX0, AY0 - A_UE, zH], [AX0, AY0 - A_UE, zH - 0.15], [AX1 + A_UE, AY0 - A_UE, zE - 0.15]], [0, -1, 0], ort, { name: "a-ort-n" });
    }
  }
  /* Schornstein der Wachstube (Backstein, Abdeckplatte) */
  function kamin(M, Z, K) {
    if (Z.kamin <= 0) return;
    const zD = (x) => Z_AH + A_D - A_NEIG * (x - AX0);
    const x0 = KAMIN.x - KAMIN.b / 2, x1 = KAMIN.x + KAMIN.b / 2, y0 = KAMIN.y - KAMIN.b / 2, y1 = KAMIN.y + KAMIN.b / 2;
    const zO = lerp(zD(x0) + 0.2, 6.3, Z.kamin);
    M.teil("kamin", { mitte: [KAMIN.x, KAMIN.y, 7.5] });
    const km = (g, F) => {
      g.fillStyle = "rgb(150,70,50)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      if (F.px > 10) { g.fillStyle = "rgba(210,200,186,0.55)"; for (let y = 0.08; y < F.h; y += 0.08) g.fillRect(-0.1, y, F.w + 0.2, 0.012); for (let y = 0, k = 0; y < F.h; y += 0.08, k++) for (let x = (k % 2) * 0.12; x < F.w; x += 0.24) g.fillRect(x, y, 0.012, 0.08); }
      rausch(g, 0, 0, F.w, F.h, 0.8, 0.25, 3, 3);
      if (Z.kamin >= 1) { g.fillStyle = "rgba(20,18,18,0.35)"; g.fillRect(-0.1, 0, F.w + 0.2, 0.25); }
    };
    const seite = (name, p0, p1, zA, zB) => {
      const dx = p1[0] - p0[0], dy = p1[1] - p0[1], w = Math.hypot(dx, dy);
      M.flaeche({ name: name, o: [p0[0], p0[1], zO], u: [dx / w, dy / w, 0], v: [0, 0, -1], w: w, h: zO - Math.min(zA, zB), umriss: [[0, 0], [w, 0], [w, zO - zB], [0, zO - zA]], malen: km });
    };
    seite("k-s", [x0, y1], [x1, y1], zD(x0), zD(x1));
    seite("k-n", [x1, y0], [x0, y0], zD(x1), zD(x0));
    seite("k-o", [x1, y1], [x1, y0], zD(x1), zD(x1));
    seite("k-w", [x0, y0], [x0, y1], zD(x0), zD(x0));
    deckel(M, "k-oben", x0 - 0.05, y0 - 0.05, x1 + 0.05, y1 + 0.05, zO, (g, F) => {
      g.fillStyle = rgb(hell(SAND, 0.05)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      g.fillStyle = "rgb(24,20,20)"; g.fillRect(0.12, 0.12, F.w - 0.24, F.h - 0.24);
      if (K.schnee > 0) { g.fillStyle = rgb(SCHNEE); g.fillRect(-0.1, -0.1, F.w + 0.2, 0.12); g.fillRect(-0.1, F.h - 0.12, F.w + 0.2, 0.22); }
    });
    if (Z.fertig) M.rauchAus(KAMIN.x, KAMIN.y, zO + 0.05, 0.7);
  }

  /* =====================================================================
     BAUGRUBE: Fundament – runder Turmring und Streifen der Wachstube
     ===================================================================== */
  function grubeBauen(M, Z, K) {
    const D = G_TIEF * Z.tiefe;
    if (D < 0.02) return;
    M.teil("grube", { mitte: [0, 0, -4], ebene: -5, schatten: false });
    const poly = GRUBE;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      wandFlaeche(M, "grube-" + i, a, b, -D, 0, erdeMaler("wand", K), { keinAo: true, ao: false, keinLicht: true });
    }
    polyFlaeche(M, poly.map(([x, y]) => [x, y, -D]), [0, 0, 1], erdeMaler("boden", K), { name: "grubenboden", keinLicht: true });
    if (Z.fund > 0) {
      const zt = -D + (D + 0.02) * Z.fund;
      M.teil("fundament", { mitte: [0, 0, -2], ebene: -4, schatten: false });
      const fm = (g, F) => { g.save(); if (lochClip(g, F)) { feldstein(g, F); lichtAuf(g, F, 0.85); } g.restore(); };
      const n = 16, Ra = R + 0.15, top = [];
      for (let i = 0; i < n; i++) {
        const a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2;
        const P0 = [CX + Ra * Math.cos(a0), CY + Ra * Math.sin(a0)], P1 = [CX + Ra * Math.cos(a1), CY + Ra * Math.sin(a1)];
        wandFlaeche(M, "fund-" + i, P1, P0, -D, zt, fm, { keinAo: true, ao: false, keinLicht: true });
        top.push([P0[0], P0[1], zt]);
      }
      polyFlaeche(M, top, [0, 0, 1], fm, { name: "fund-deckel", keinLicht: true });
      const st = [[AX0 - 0.1, AY0 - 0.1, AX1 + 0.1, AY0 + 0.45], [AX0 - 0.1, AY1 - 0.45, AX1 + 0.1, AY1 + 0.1], [AX1 - 0.45, AY0 + 0.45, AX1 + 0.1, AY1 - 0.45]];
      for (const [x0, y0, x1, y1] of st) M.quader({ x: x0, y: y0, z: -D, b: x1 - x0, t: y1 - y0, h: zt + D }, { sued: fm, nord: fm, ost: fm, west: fm, oben: fm }, { keinAo: true, keinLicht: true });
    }
  }

  /* =====================================================================
     MODELL
     ===================================================================== */
  ST.modell("gefaengnis", {
    name: "Gefängnis", gruppe: "Häuser", grund: [9, 9], hoehe: 15, bauzeit: 16 * 60,
    bauen(M, o) {
      const bau = o.bau == null ? 1 : o.bau;
      const Z = zustand(bau);
      const V = variante(o);
      const winter = o.jahr === "winter";
      const K = { Z: Z, V: V, winter: winter, herbst: o.jahr === "herbst", schnee: winter ? Z.schnee : 0 };
      if (Z.grube) grubeBauen(M, Z, K);
      if (Z.haufen > 0.02) {
        M.teil("aushub", { mitte: [-3.4, 3.5, 0.4] });
        haufen(M, -3.4, 3.5, 1.05 * Math.sqrt(Z.haufen), 0.95 * Z.haufen, K, 13);
      }
      turm(M, Z, K);
      portal(M, Z, K);
      anbau(M, Z, K);
      anbauDach(M, Z, K);
      kamin(M, Z, K);
      kegel(M, Z, K);
    }
  });
})();
