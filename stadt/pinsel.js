/* =====================================================================
   BAUKASTEN-STADT — DIE PINSEL (Werkstoffe und Bauteile)
   ---------------------------------------------------------------------
   Alles hier malt IN DER FLÄCHE: Einheit Meter, x nach rechts, y nach
   unten. Der Kern legt die Fläche danach perspektivisch ins Bild und
   legt das Licht darüber. Die Pinsel malen also „Werkstoff bei weißem
   Licht" – und nur die Tiefe (Laibungen, Vorsprünge) selbst, weil nur
   die Fläche weiß, wo eine Fensteröffnung zurückspringt.

   F (von kern.js): w, h, px (Pixel je Meter), rng(), jahr, nacht,
   schatten(d) → Versatz eines Vorsprungs der Tiefe d, leuchtPunkt(…).
   ===================================================================== */
(function () {
  "use strict";
  const ST = (window.STADT = window.STADT || {});
  const PI = (ST.pinsel = {});

  /* ---------------- Farbwerkzeuge ---------------- */
  function hex(c) { c = c.replace("#", ""); if (c.length === 3) c = c.split("").map((x) => x + x).join(""); return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; }
  function rgb(a, al) { return al == null ? "rgb(" + (a[0] | 0) + "," + (a[1] | 0) + "," + (a[2] | 0) + ")" : "rgba(" + (a[0] | 0) + "," + (a[1] | 0) + "," + (a[2] | 0) + "," + al + ")"; }
  function misch(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  function hell(a, k) { return k >= 0 ? misch(a, [255, 255, 255], k) : misch(a, [0, 0, 0], -k); }
  function streu(a, rng, k) { const d = (rng() - 0.5) * 2 * k; return [a[0] * (1 + d), a[1] * (1 + d * 0.95), a[2] * (1 + d * 0.9)]; }
  PI.hex = hex; PI.rgb = rgb; PI.misch = misch; PI.hell = hell; PI.streu = streu;

  /* ---------------- Rausch-Muster (einmal erzeugt, als Füllmuster) ---------------- */
  const MUSTER = {};
  function rauschBild(saat, groesse, frequenz, okt, kontrast) {
    const k = "r" + saat + "|" + groesse + "|" + frequenz + "|" + okt + "|" + kontrast;
    if (MUSTER[k]) return MUSTER[k];
    const c = document.createElement("canvas"); c.width = c.height = groesse;
    const g = c.getContext("2d"); const id = g.createImageData(groesse, groesse);
    /* nahtlos: Rauschen auf einem Torus */
    for (let y = 0; y < groesse; y++) for (let x = 0; x < groesse; x++) {
      const a = x / groesse * Math.PI * 2, b = y / groesse * Math.PI * 2;
      const r = frequenz / (Math.PI * 2) * groesse / 64;
      let v = 0, amp = 0.5, n = 0, f = 1;
      for (let o = 0; o < okt; o++) {
        const nx = Math.cos(a) * r * f, ny = Math.sin(a) * r * f, nz = Math.cos(b) * r * f, nw = Math.sin(b) * r * f;
        v += amp * (ST.rausch(nx + nz * 0.7 + 11 * o, ny + nw * 0.7 + saat, saat + o) * 0.5 + ST.rausch(nz + nx * 0.3 + 5, nw + ny * 0.3 + 3 * o, saat + 9 + o) * 0.5);
        n += amp; amp *= 0.5; f *= 2;
      }
      v = v / n;
      v = Math.max(0, Math.min(1, 0.5 + (v - 0.5) * kontrast));
      const i = (y * groesse + x) * 4;
      id.data[i] = id.data[i + 1] = id.data[i + 2] = Math.round(v * 255); id.data[i + 3] = 255;
    }
    g.putImageData(id, 0, 0);
    MUSTER[k] = c;
    return c;
  }
  PI.rauschBild = rauschBild;
  /* Fläche mit Rauschen überziehen (multiply): Flecken, Verwitterung.
     meter = wie groß ein Musterstück in der Welt ist */
  PI.rauschen = function (g, x, y, w, h, meter, staerke, saat, okt) {
    const bild = rauschBild(saat || 1, 128, 4, okt || 4, 1.6);
    const m = g.createPattern(bild, "repeat");
    const k = meter / 128;
    m.setTransform(new DOMMatrix([k, 0, 0, k, (saat || 0) * 0.37 % meter, (saat || 0) * 0.61 % meter]));
    g.save();
    g.globalCompositeOperation = "multiply";
    g.globalAlpha = staerke;
    g.fillStyle = m; g.fillRect(x, y, w, h);
    g.restore();
  };
  /* Aufhellen mit Rauschen (screen) – Ausblühungen, Sonnenbleiche */
  PI.bleichen = function (g, x, y, w, h, meter, staerke, saat) {
    const bild = rauschBild((saat || 1) + 50, 128, 3, 3, 2.2);
    const m = g.createPattern(bild, "repeat");
    const k = meter / 128;
    m.setTransform(new DOMMatrix([k, 0, 0, k, 0, 0]));
    g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  };

  /* ---------------- Putz ----------------
     Kalkputz: nie ganz gleichmäßig. Große wolkige Flecken, feines Korn,
     unten Spritzwasser und grünlicher Anflug, unter Fenstern
     Schlieren vom Regen. */
  PI.putz = function (g, x, y, w, h, farbe, F, opt) {
    opt = opt || {};
    const f = hex(farbe);
    g.fillStyle = rgb(f); g.fillRect(x, y, w, h);
    const saat = opt.saat || 3;
    PI.rauschen(g, x, y, w, h, 3.2, 0.16, saat, 4);
    if (F.px > 30) PI.rauschen(g, x, y, w, h, 0.45, 0.10, saat + 7, 3);
    PI.bleichen(g, x, y, w, h, 2.2, 0.10, saat);
    if (opt.boden) {
      /* Spritzwasser am Sockel */
      const gr = g.createLinearGradient(0, y + h, 0, y + h - 0.6);
      gr.addColorStop(0, "rgba(90,86,70,0.28)"); gr.addColorStop(1, "rgba(90,86,70,0)");
      g.fillStyle = gr; g.fillRect(x, y + h - 0.6, w, 0.6);
    }
  };
  /* Regenschliere unter einem Fenstersims */
  PI.schliere = function (g, x, y, w, laenge, F) {
    const gr = g.createLinearGradient(0, y, 0, y + laenge);
    gr.addColorStop(0, "rgba(70,64,50,0.16)"); gr.addColorStop(1, "rgba(70,64,50,0)");
    g.fillStyle = gr;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y); g.lineTo(x + w * 0.85, y + laenge); g.lineTo(x + w * 0.15, y + laenge); g.closePath(); g.fill();
  };

  /* ---------------- Holz ----------------
     Ein Balken von (x0,y0) nach (x1,y1), breit b (Meter). Mit Kanten,
     Maserung, Trockenrissen, abgerundeten Ecken; wirft einen kleinen
     Schatten auf den Putz (Balken stehen ~2 cm vor). */
  PI.balken = function (g, x0, y0, x1, y1, b, farbe, F, opt) {
    opt = opt || {};
    const L = Math.hypot(x1 - x0, y1 - y0); if (L < 1e-4) return;
    const f = hex(farbe);
    const rng = F.rng;
    const ang = Math.atan2(y1 - y0, x1 - x0);
    g.save();
    g.translate(x0, y0); g.rotate(ang);
    /* Schatten auf dem Putz */
    const sv = F.schatten ? F.schatten(opt.vor || 0.025) : null;
    if (sv && !opt.keinSchatten) {
      g.save();
      g.rotate(-ang); g.translate(sv[0], sv[1]); g.rotate(ang);
      g.fillStyle = "rgba(40,30,25,0.30)";
      g.fillRect(-b * 0.02, -b / 2, L + b * 0.04, b);
      g.restore();
    }
    const c = streu(f, rng, 0.08);
    const gr = g.createLinearGradient(0, -b / 2, 0, b / 2);
    gr.addColorStop(0, rgb(hell(c, 0.10)));
    gr.addColorStop(0.18, rgb(c));
    gr.addColorStop(0.82, rgb(hell(c, -0.08)));
    gr.addColorStop(1, rgb(hell(c, -0.30)));
    g.fillStyle = gr;
    g.fillRect(0, -b / 2, L, b);
    if (F.px * b > 5) {
      /* Maserung: lange, leicht wellige Linien */
      const n = Math.max(2, Math.round(b * 60));
      g.lineWidth = Math.max(0.004, 1.1 / F.px);
      for (let i = 0; i < n; i++) {
        const yy = -b / 2 + b * (i + 0.5) / n + (rng() - 0.5) * b * 0.08;
        g.strokeStyle = rgb(hell(c, -0.18 - rng() * 0.2), 0.18 + rng() * 0.25);
        g.beginPath(); g.moveTo(rng() * L * 0.2, yy);
        const st = 5;
        for (let k = 1; k <= st; k++) g.lineTo(L * k / st * (0.8 + 0.2 * rng()) + (k === st ? L * 0.2 : 0), yy + (rng() - 0.5) * b * 0.07);
        g.stroke();
      }
      /* Trockenrisse */
      const risse = Math.floor(L * 0.8 * rng() + (rng() < 0.4 ? 1 : 0));
      g.strokeStyle = rgb(hell(c, -0.55), 0.7);
      g.lineWidth = Math.max(0.006, 1.3 / F.px);
      for (let i = 0; i < risse; i++) {
        const sx = rng() * L * 0.8, yy = (rng() - 0.5) * b * 0.5, len = 0.15 + rng() * 0.5;
        g.beginPath(); g.moveTo(sx, yy); g.quadraticCurveTo(sx + len / 2, yy + (rng() - 0.5) * 0.02, Math.min(L, sx + len), yy + (rng() - 0.5) * 0.02); g.stroke();
      }
      /* Holznägel an den Enden (Zapfenverbindung) */
      if (opt.naegel !== false && L > 0.5) {
        g.fillStyle = rgb(hell(c, -0.35));
        for (const px of [b * 0.55, L - b * 0.55]) { g.beginPath(); g.arc(px, 0, b * 0.09, 0, Math.PI * 2); g.fill(); }
      }
    }
    /* feine dunkle Kante */
    g.strokeStyle = rgb(hell(c, -0.5), 0.55);
    g.lineWidth = Math.max(0.005, 0.9 / F.px);
    g.strokeRect(0, -b / 2, L, b);
    g.restore();
  };

  /* ---------------- Naturstein (Sandstein-Quader) ---------------- */
  PI.quader = function (g, x, y, w, h, F, opt) {
    opt = opt || {};
    const basis = hex(opt.farbe || "#b9a58a");
    const rng = F.rng;
    const hoehe = opt.lage || 0.32;
    g.fillStyle = rgb(hell(basis, -0.35)); g.fillRect(x, y, w, h);  // Mörtel
    const fuge = opt.fuge || 0.018;
    let yy = y, reihe = 0;
    while (yy < y + h - 0.01) {
      const lh = Math.min(hoehe * (0.8 + rng() * 0.4), y + h - yy);
      let xx = x - (reihe % 2 ? rng() * 0.4 : 0);
      while (xx < x + w) {
        const lw = hoehe * (1.3 + rng() * 1.4);
        const c = streu(basis, rng, 0.12);
        const bx = Math.max(x, xx) + fuge / 2, bw = Math.min(x + w, xx + lw) - Math.max(x, xx) - fuge;
        if (bw > 0.02) {
          const gr = g.createLinearGradient(0, yy, 0, yy + lh);
          gr.addColorStop(0, rgb(hell(c, 0.12))); gr.addColorStop(0.15, rgb(c)); gr.addColorStop(1, rgb(hell(c, -0.14)));
          g.fillStyle = gr;
          PI.rundRechteck(g, bx, yy + fuge / 2, bw, lh - fuge, Math.min(0.03, lh * 0.15));
          g.fill();
          if (F.px > 25) PI.rauschen(g, bx, yy, bw, lh, 0.6, 0.18, (rng() * 99) | 0, 3);
        }
        xx += lw;
      }
      yy += lh; reihe++;
    }
    PI.rauschen(g, x, y, w, h, 2.5, 0.14, 21, 4);
  };

  PI.rundRechteck = function (g, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    g.beginPath();
    g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
    g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r);
    g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
  };

  /* ---------------- Dachziegel (Biberschwanz, Doppeldeckung) ----------------
     In der Dachfläche: x entlang der Traufe, y vom First (0) zur Traufe (h).
     Jede Reihe überdeckt die vorige; der runde Schwanz jedes Ziegels
     wirft einen feinen Schatten auf die Reihe darunter. */
  PI.biberschwanz = function (g, x, y, w, h, F, opt) {
    opt = opt || {};
    const basis = hex(opt.farbe || "#9c4a31");
    const rng = F.rng;
    const zb = opt.breite || 0.18, zr = opt.reihe || 0.15;
    g.fillStyle = rgb(hell(basis, -0.45)); g.fillRect(x, y, w, h);
    if (F.px * zr < 2.2) {
      /* weit weg: nur Reihenstreifen */
      for (let yy = y; yy < y + h; yy += zr) { g.fillStyle = rgb(streu(basis, rng, 0.06)); g.fillRect(x, yy, w, zr * 0.8); }
      PI.rauschen(g, x, y, w, h, 3, 0.2, 5, 3);
      return;
    }
    let reihe = 0;
    for (let yy = y - zr; yy < y + h; yy += zr, reihe++) {
      const versatz = (reihe % 2) * zb / 2;
      for (let xx = x - zb + versatz; xx < x + w; xx += zb) {
        let c = streu(basis, rng, 0.10);
        if (rng() < 0.07) c = hell(c, -0.18);              // dunklere Nachzügler
        if (rng() < 0.05) c = misch(c, [120, 110, 80], 0.3); // Moos/Flechte
        const b = zb * 0.94, lang = zr * 2.05;
        const x0 = xx + (zb - b) / 2, y0 = yy;
        /* Schatten des Ziegels auf die Reihe darunter */
        g.fillStyle = "rgba(30,12,8,0.35)";
        g.beginPath();
        g.moveTo(x0, y0 + lang * 0.55); g.lineTo(x0, y0 + lang - b * 0.5 + zr * 0.1);
        g.arc(x0 + b / 2, y0 + lang - b * 0.5 + zr * 0.1, b / 2, Math.PI, 0, true);
        g.lineTo(x0 + b, y0 + lang * 0.55); g.closePath(); g.fill();
        /* der Ziegel */
        const gr = g.createLinearGradient(0, y0 + lang * 0.4, 0, y0 + lang);
        gr.addColorStop(0, rgb(hell(c, -0.06))); gr.addColorStop(0.7, rgb(c)); gr.addColorStop(1, rgb(hell(c, 0.07)));
        g.fillStyle = gr;
        g.beginPath();
        g.moveTo(x0, y0); g.lineTo(x0, y0 + lang - b * 0.5);
        g.arc(x0 + b / 2, y0 + lang - b * 0.5, b / 2, Math.PI, 0, true);
        g.lineTo(x0 + b, y0); g.closePath(); g.fill();
        if (F.px * zb > 9) {
          g.strokeStyle = rgb(hell(c, -0.4), 0.45); g.lineWidth = 0.8 / F.px;
          g.beginPath(); g.moveTo(x0 + b, y0 + lang * 0.5); g.lineTo(x0 + b, y0 + lang - b * 0.5); g.arc(x0 + b / 2, y0 + lang - b * 0.5, b / 2, 0, Math.PI, false); g.stroke();
        }
      }
    }
    PI.rauschen(g, x, y, w, h, 4.5, 0.18, 8, 4);
  };

  /* ---------------- Schnee auf dem Dach ----------------
     Deckt die Fläche, dünner zum First hin, mit einem dicken,
     überhängenden Rand an der Traufe. deck = 0…1 */
  PI.schneeDach = function (g, x, y, w, h, F, opt) {
    opt = opt || {};
    const rng = ST.zufall(opt.saat || 77);
    const deck = opt.deck == null ? 0.92 : opt.deck;
    g.save();
    /* Grundschicht mit Löchern, wo Ziegel durchschauen */
    const gr = g.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, "rgba(236,242,250," + (0.82 * deck) + ")");
    gr.addColorStop(0.4, "rgba(242,246,252," + (0.96 * deck) + ")");
    gr.addColorStop(1, "rgba(246,249,253,1)");
    g.fillStyle = gr;
    g.beginPath();
    g.moveTo(x, y + 0.04);
    for (let xx = x; xx <= x + w + 0.2; xx += 0.2) g.lineTo(xx, y + 0.03 + rng() * 0.05);
    g.lineTo(x + w, y + h); g.lineTo(x, y + h); g.closePath(); g.fill();
    /* Verwehungen: wellige, etwas dunklere Mulden quer zur Fläche */
    for (let i = 0; i < w * 1.3; i++) {
      const cx = x + rng() * w, cy = y + h * (0.2 + rng() * 0.7), rx = 0.4 + rng() * 1.2, ry = 0.08 + rng() * 0.18;
      const gg = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
      gg.addColorStop(0, "rgba(170,190,225,0.16)"); gg.addColorStop(1, "rgba(170,190,225,0)");
      g.fillStyle = gg; g.save(); g.translate(cx, cy); g.scale(1, ry / rx); g.beginPath(); g.arc(0, 0, rx, 0, Math.PI * 2); g.fill(); g.restore();
    }
    /* Ziegelreihen schimmern durch (oben, wo der Schnee dünn ist) */
    if (opt.durch !== false) {
      g.globalCompositeOperation = "multiply";
      for (let yy = y + 0.15; yy < y + h * 0.5; yy += 0.15) {
        g.fillStyle = "rgba(200,205,220," + (0.28 * (1 - (yy - y) / (h * 0.5))) + ")";
        g.fillRect(x, yy, w, 0.02);
      }
      g.globalCompositeOperation = "source-over";
    }
    PI.rauschen(g, x, y, w, h, 1.8, 0.07, 31, 3);
    /* Glitzer */
    if (F.px > 18) {
      g.fillStyle = "rgba(255,255,255,0.9)";
      for (let i = 0; i < w * h * 6; i++) { const r = (0.5 + rng()) / F.px; g.fillRect(x + rng() * w, y + rng() * h, r, r); }
    }
    g.restore();
  };

  /* ---------------- Eiszapfen ----------------
     Entlang einer Kante (x0…x1 auf Höhe y) nach unten */
  PI.eiszapfen = function (g, x0, x1, y, F, opt) {
    opt = opt || {};
    const rng = ST.zufall(opt.saat || 5);
    const max = opt.laenge || 0.45;
    let x = x0 + rng() * 0.2;
    while (x < x1) {
      const l = max * (0.15 + Math.pow(rng(), 2.2) * 0.85), b = 0.025 + l * 0.12;
      const gr = g.createLinearGradient(x - b, 0, x + b, 0);
      gr.addColorStop(0, "rgba(200,225,245,0.65)"); gr.addColorStop(0.35, "rgba(250,254,255,0.95)"); gr.addColorStop(1, "rgba(160,190,220,0.6)");
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(x - b, y); g.quadraticCurveTo(x - b * 0.4, y + l * 0.6, x, y + l); g.quadraticCurveTo(x + b * 0.4, y + l * 0.6, x + b, y); g.closePath(); g.fill();
      x += 0.06 + rng() * 0.28;
    }
  };

  /* ---------------- Fenster ----------------
     (x, y) = linke obere Ecke der Maueröffnung, w × h.
     opt: rahmen (Farbe), fluegel (1/2), sprossen [spalten, zeilen je Flügel],
     laeden (Farbe oder null), kasten ('winter'|'sommer'|null),
     bank (Sims), tiefe (Laibung), vorhang, bogen (Stichbogen), licht (0..1 Chance) */
  PI.fenster = function (g, x, y, w, h, F, opt) {
    opt = opt || {};
    const rng = F.rng;
    const rahmen = hex(opt.rahmen || "#f1ece2");
    const tiefe = opt.tiefe == null ? 0.12 : opt.tiefe;
    const rb = opt.rahmenBreite || Math.min(0.075, w * 0.09);
    /* Fensterläden (neben der Öffnung, auf der Wand) */
    if (opt.laeden) PI.laeden(g, x, y, w, h, F, opt);
    /* Laibung: die Mauer springt zurück – ringsum schmale Innenseite */
    g.fillStyle = rgb(hex(opt.laibung || "#d9d2c3"));
    g.fillRect(x, y, w, h);
    /* Glas */
    const gx = x + rb * 0.7, gy = y + rb * 0.7, gw = w - rb * 1.4, gh = h - rb * 1.4;
    const gl = g.createLinearGradient(gx, gy, gx + gw * 0.4, gy + gh);
    const tag = 1 - F.nacht;
    gl.addColorStop(0, "rgb(" + [150, 175, 205].map((v) => Math.round(v * (0.45 + 0.55 * tag))).join(",") + ")");
    gl.addColorStop(0.45, "rgb(" + [58, 72, 92].map((v) => Math.round(v * (0.6 + 0.4 * tag))).join(",") + ")");
    gl.addColorStop(1, "rgb(" + [30, 36, 48].join(",") + ")");
    g.fillStyle = gl; g.fillRect(gx, gy, gw, gh);
    /* Innenraum ahnen: dunkle Decke oben, Vorhänge an den Seiten */
    if (opt.vorhang !== false) {
      const vf = hex(opt.vorhangFarbe || "#efe6d4");
      for (const seite of [0, 1]) {
        const vw = gw * (0.2 + rng() * 0.08);
        const vx = seite ? gx + gw - vw : gx;
        const gv = g.createLinearGradient(vx, 0, vx + vw, 0);
        for (let i = 0; i <= 6; i++) gv.addColorStop(i / 6, rgb(hell(vf, i % 2 ? -0.18 : 0.02), 0.85));
        g.fillStyle = gv;
        g.beginPath();
        if (seite) { g.moveTo(vx + vw, gy); g.lineTo(vx, gy); g.quadraticCurveTo(vx + vw * 0.35, gy + gh * 0.55, vx + vw * 0.55, gy + gh); g.lineTo(vx + vw, gy + gh); }
        else { g.moveTo(vx, gy); g.lineTo(vx + vw, gy); g.quadraticCurveTo(vx + vw * 0.65, gy + gh * 0.55, vx + vw * 0.45, gy + gh); g.lineTo(vx, gy + gh); }
        g.closePath(); g.fill();
      }
    }
    /* Himmelsspiegelung: schräger heller Streifen */
    g.save();
    g.beginPath(); g.rect(gx, gy, gw, gh); g.clip();
    g.fillStyle = "rgba(255,255,255," + (0.10 + 0.12 * tag) + ")";
    g.beginPath(); g.moveTo(gx + gw * 0.15, gy + gh); g.lineTo(gx + gw * 0.55, gy); g.lineTo(gx + gw * 0.72, gy); g.lineTo(gx + gw * 0.32, gy + gh); g.closePath(); g.fill();
    g.fillStyle = "rgba(255,255,255," + (0.06 + 0.06 * tag) + ")";
    g.beginPath(); g.moveTo(gx + gw * 0.42, gy + gh); g.lineTo(gx + gw * 0.82, gy); g.lineTo(gx + gw * 0.88, gy); g.lineTo(gx + gw * 0.48, gy + gh); g.closePath(); g.fill();
    g.restore();
    /* Schatten der Laibung ins Fenster (Sonne) */
    const sv = F.schatten ? F.schatten(tiefe) : null;
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    g.fillStyle = "rgba(20,24,40,0.42)";
    if (sv) {
      /* L-förmiger Schatten von der Oberkante und der sonnenzugewandten Seite */
      const [dx, dy] = sv;
      g.beginPath();
      g.moveTo(x, y); g.lineTo(x + w, y);
      g.lineTo(x + w + dx, y + dy); g.lineTo(x + dx, y + dy);
      g.closePath(); g.fill();
      g.beginPath();
      if (dx > 0) { g.moveTo(x, y); g.lineTo(x + dx, y + dy); g.lineTo(x + dx, y + h + dy); g.lineTo(x, y + h); }
      else { g.moveTo(x + w, y); g.lineTo(x + w + dx, y + dy); g.lineTo(x + w + dx, y + h + dy); g.lineTo(x + w, y + h); }
      g.closePath(); g.fill();
    } else {
      g.fillStyle = "rgba(20,24,40,0.22)"; g.fillRect(x, y, w, tiefe * 0.6);
    }
    g.restore();
    /* Fensterrahmen + Flügel + Sprossen */
    const fl = opt.fluegel || 2;
    const rf = rgb(rahmen), rd = rgb(hell(rahmen, -0.25)), rh = rgb(hell(rahmen, 0.25));
    const strich = (x0, y0, x1, y1, b) => {
      g.fillStyle = rf;
      if (Math.abs(x1 - x0) > Math.abs(y1 - y0)) { g.fillRect(x0, y0 - b / 2, x1 - x0, b); g.fillStyle = rd; g.fillRect(x0, y0 + b / 2 - b * 0.22, x1 - x0, b * 0.22); g.fillStyle = rh; g.fillRect(x0, y0 - b / 2, x1 - x0, b * 0.18); }
      else { g.fillRect(x0 - b / 2, y0, b, y1 - y0); g.fillStyle = rd; g.fillRect(x0 + b / 2 - b * 0.2, y0, b * 0.2, y1 - y0); g.fillStyle = rh; g.fillRect(x0 - b / 2, y0, b * 0.16, y1 - y0); }
    };
    /* Blendrahmen */
    strich(x, y + rb / 2, x + w, y + rb / 2, rb);
    strich(x, y + h - rb / 2, x + w, y + h - rb / 2, rb);
    strich(x + rb / 2, y, x + rb / 2, y + h, rb);
    strich(x + w - rb / 2, y, x + w - rb / 2, y + h, rb);
    /* Kämpfer (Querholz) auf ~ 2/3 Höhe bei hohen Fenstern */
    const kaempfer = h > w * 1.25 ? y + h * 0.32 : null;
    if (kaempfer) strich(x, kaempfer, x + w, kaempfer, rb * 0.85);
    /* Flügel */
    for (let i = 1; i < fl; i++) strich(x + w * i / fl, y, x + w * i / fl, y + h, rb * 0.95);
    /* Sprossen */
    const [sp, sz] = opt.sprossen || [1, 2];
    const sb = rb * 0.45;
    for (let i = 0; i < fl; i++) {
      const fx = x + w * i / fl, fw = w / fl;
      const y0 = kaempfer || y;
      for (let k = 1; k < sp; k++) strich(fx + fw * k / sp, y0, fx + fw * k / sp, y + h, sb);
      for (let k = 1; k < sz; k++) strich(fx, y0 + (y + h - y0) * k / sz, fx + fw, y0 + (y + h - y0) * k / sz, sb);
    }
    if (kaempfer && sp > 1) for (let k = 1; k < sp * fl; k++) strich(x + w * k / (sp * fl), y, x + w * k / (sp * fl), kaempfer, sb);
    /* Fensterbank (Sandstein), steht vor und wirft Schatten */
    if (opt.bank !== false) {
      const bb = w + 0.12, bx = x - 0.06, by = y + h, bh = 0.07;
      const s2 = F.schatten ? F.schatten(0.06) : null;
      if (s2) { g.fillStyle = "rgba(30,26,30,0.32)"; g.fillRect(bx + s2[0], by + bh + Math.max(0, s2[1]) * 0.2, bb, Math.max(0.02, s2[1] * 0.9)); }
      const bf = hex(opt.bankFarbe || "#c7b596");
      g.fillStyle = rgb(hell(bf, 0.18)); g.fillRect(bx, by, bb, bh * 0.4);
      g.fillStyle = rgb(bf); g.fillRect(bx, by + bh * 0.4, bb, bh * 0.6);
      g.fillStyle = rgb(hell(bf, -0.3)); g.fillRect(bx, by + bh - 0.012, bb, 0.012);
      if (opt.schliere !== false) PI.schliere(g, bx + 0.1, by + bh, bb - 0.2, 0.5 + rng() * 0.4, F);
    }
    /* Blumenkasten */
    if (opt.kasten) PI.blumenkasten(g, x - 0.02, y + h - 0.02, w + 0.04, F, opt.kasten, opt);
  };

  /* Leuchten eines Fensters (in f.leuchten aufrufen) */
  PI.fensterLicht = function (g, x, y, w, h, F, opt) {
    opt = opt || {};
    const an = opt.an == null ? 1 : opt.an;
    if (an <= 0 || F.nacht <= 0) return;
    const a = F.nacht * an;
    const rb = opt.rahmenBreite || Math.min(0.075, w * 0.09);
    const gx = x + rb, gy = y + rb, gw = w - rb * 2, gh = h - rb * 2;
    const farbe = opt.farbe || [255, 196, 120];
    const gr = g.createRadialGradient(gx + gw / 2, gy + gh * 0.75, 0, gx + gw / 2, gy + gh * 0.6, Math.max(gw, gh));
    gr.addColorStop(0, "rgba(" + farbe.map((v) => Math.min(255, v + 20)).join(",") + "," + (0.95 * a) + ")");
    gr.addColorStop(0.6, "rgba(" + farbe.join(",") + "," + (0.8 * a) + ")");
    gr.addColorStop(1, "rgba(" + farbe.map((v) => v * 0.6).join(",") + "," + (0.7 * a) + ")");
    g.fillStyle = gr; g.fillRect(gx, gy, gw, gh);
    /* Vorhänge als warme Silhouetten */
    g.fillStyle = "rgba(150,80,40," + (0.35 * a) + ")";
    g.fillRect(gx, gy, gw * 0.18, gh); g.fillRect(gx + gw * 0.82, gy, gw * 0.18, gh);
    /* Sprossen dunkel vor dem Licht */
    const [sp, sz] = opt.sprossen || [1, 2];
    const fl = opt.fluegel || 2;
    g.fillStyle = "rgba(60,40,30," + (0.9 * a) + ")";
    for (let i = 1; i < fl; i++) g.fillRect(x + w * i / fl - rb * 0.45, y, rb * 0.9, h);
    const kaempfer = h > w * 1.25 ? y + h * 0.32 : null;
    if (kaempfer) g.fillRect(x, kaempfer - rb * 0.4, w, rb * 0.8);
    for (let i = 0; i < fl; i++) {
      const fx = x + w * i / fl, fw = w / fl, y0 = kaempfer || y;
      for (let k = 1; k < sp; k++) g.fillRect(fx + fw * k / sp - rb * 0.22, y0, rb * 0.44, y + h - y0);
      for (let k = 1; k < sz; k++) g.fillRect(fx, y0 + (y + h - y0) * k / sz - rb * 0.22, fw, rb * 0.44);
    }
    if (F.leuchtPunkt) F.leuchtPunkt(x + w / 2, y + h * 0.55, Math.max(w, h) * 1.3, farbe.join(","), 0.55 * an);
  };

  /* Fensterläden aus Brettern mit Z-Strebe */
  PI.laeden = function (g, x, y, w, h, F, opt) {
    const f = hex(opt.laeden);
    const lw = w / 2 * 0.98;
    for (const seite of [0, 1]) {
      const lx = seite ? x + w + 0.02 : x - lw - 0.02;
      const sv = F.schatten ? F.schatten(0.04) : null;
      if (sv) { g.fillStyle = "rgba(30,30,40,0.25)"; g.fillRect(lx + sv[0], y + sv[1], lw, h); }
      const bretter = 4;
      for (let i = 0; i < bretter; i++) {
        const c = streu(f, F.rng, 0.05);
        g.fillStyle = rgb(c); g.fillRect(lx + lw * i / bretter, y, lw / bretter, h);
        g.fillStyle = rgb(hell(c, -0.3)); g.fillRect(lx + lw * (i + 1) / bretter - 0.008, y, 0.008, h);
      }
      /* Querleisten und Strebe */
      g.fillStyle = rgb(hell(f, -0.12));
      g.fillRect(lx, y + h * 0.12, lw, 0.07); g.fillRect(lx, y + h * 0.82, lw, 0.07);
      g.save(); g.beginPath(); g.rect(lx, y + h * 0.12 + 0.07, lw, h * 0.7 - 0.07); g.clip();
      g.strokeStyle = rgb(hell(f, -0.12)); g.lineWidth = 0.07;
      g.beginPath(); if (seite) { g.moveTo(lx, y + h * 0.82); g.lineTo(lx + lw, y + h * 0.19); } else { g.moveTo(lx + lw, y + h * 0.82); g.lineTo(lx, y + h * 0.19); } g.stroke();
      g.restore();
      /* Herz-Ausschnitt oben */
      if (F.px > 20) {
        const hx = lx + lw / 2, hy = y + h * 0.05 + 0.03, r = 0.035;
        g.fillStyle = "rgba(25,20,18,0.85)";
        g.beginPath(); g.moveTo(hx, hy + r * 1.6); g.bezierCurveTo(hx - r * 2, hy + r * 0.2, hx - r * 0.9, hy - r * 1.1, hx, hy - r * 0.1); g.bezierCurveTo(hx + r * 0.9, hy - r * 1.1, hx + r * 2, hy + r * 0.2, hx, hy + r * 1.6); g.fill();
      }
      /* Beschläge */
      g.fillStyle = "rgba(35,32,30,0.9)";
      const bs = seite ? lx : lx + lw - 0.16;
      g.fillRect(bs, y + h * 0.15, 0.16, 0.02); g.fillRect(bs, y + h * 0.85, 0.16, 0.02);
    }
  };

  /* Blumenkasten: 'winter' = Tannengrün mit roten Schleifen,
     'sommer' = Geranien */
  PI.blumenkasten = function (g, x, y, w, F, art, opt) {
    const rng = ST.zufall(ST.textHash(F.name + x.toFixed(2)));
    const hk = 0.2;
    /* Pflanzen hinter der Kastenkante */
    if (art === "sommer") {
      for (let i = 0; i < w * 26; i++) {
        const px = x + 0.04 + rng() * (w - 0.08), py = y - rng() * 0.18;
        g.fillStyle = PI.rgb(PI.streu([60, 110, 45], rng, 0.2));
        g.beginPath(); g.arc(px, py, 0.035 + rng() * 0.025, 0, Math.PI * 2); g.fill();
      }
      for (let i = 0; i < w * 9; i++) {
        const px = x + 0.06 + rng() * (w - 0.12), py = y - 0.1 - rng() * 0.16;
        const c = rng() < 0.7 ? [205, 30, 40] : [235, 90, 120];
        for (let k = 0; k < 5; k++) { g.fillStyle = PI.rgb(PI.hell(c, (rng() - 0.5) * 0.3)); g.beginPath(); g.arc(px + (rng() - 0.5) * 0.06, py + (rng() - 0.5) * 0.05, 0.018 + rng() * 0.01, 0, Math.PI * 2); g.fill(); }
      }
    } else if (art === "winter") {
      /* Tannenzweige: feine Nadelbüschel, darauf etwas Schnee */
      for (let i = 0; i < w * 22; i++) {
        const px = x + rng() * w, py = y - rng() * 0.13, l = 0.12 + rng() * 0.12, a = -Math.PI / 2 + (rng() - 0.5) * 2.2;
        g.strokeStyle = PI.rgb(PI.streu([34, 72, 44], rng, 0.25)); g.lineWidth = 0.012;
        g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l * 0.7); g.stroke();
        for (let k = 1; k < 5; k++) {
          const bx = px + Math.cos(a) * l * k / 5, by = py + Math.sin(a) * l * 0.7 * k / 5;
          g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + Math.cos(a + 0.9) * 0.03, by + Math.sin(a + 0.9) * 0.03); g.moveTo(bx, by); g.lineTo(bx + Math.cos(a - 0.9) * 0.03, by + Math.sin(a - 0.9) * 0.03); g.stroke();
        }
      }
      g.fillStyle = "rgba(248,251,255,0.9)";
      for (let i = 0; i < w * 10; i++) { g.beginPath(); g.ellipse(x + rng() * w, y - 0.08 - rng() * 0.08, 0.04 + rng() * 0.03, 0.015, 0, 0, Math.PI * 2); g.fill(); }
      /* rote Schleifen und Zapfen */
      for (let i = 0; i < Math.max(1, Math.round(w * 1.6)); i++) {
        const px = x + (i + 0.5) * w / Math.max(1, Math.round(w * 1.6)), py = y - 0.07;
        g.fillStyle = "#b3122a";
        g.beginPath(); g.moveTo(px, py); g.quadraticCurveTo(px - 0.07, py - 0.06, px - 0.06, py + 0.02); g.closePath(); g.fill();
        g.beginPath(); g.moveTo(px, py); g.quadraticCurveTo(px + 0.07, py - 0.06, px + 0.06, py + 0.02); g.closePath(); g.fill();
        g.fillRect(px - 0.012, py - 0.012, 0.024, 0.024);
        g.fillStyle = "#6a4326"; g.beginPath(); g.ellipse(px + 0.09, py + 0.01, 0.022, 0.035, 0.3, 0, Math.PI * 2); g.fill();
      }
    }
    /* der Kasten (Holz, dunkelgrün gestrichen) */
    const kf = PI.hex((opt && opt.kastenFarbe) || "#5a3b26");
    const sv = F.schatten ? F.schatten(0.18) : null;
    if (sv) { g.fillStyle = "rgba(30,26,30,0.3)"; g.fillRect(x + sv[0], y + sv[1], w, hk); }
    const gr = g.createLinearGradient(0, y, 0, y + hk);
    gr.addColorStop(0, PI.rgb(PI.hell(kf, 0.15))); gr.addColorStop(1, PI.rgb(PI.hell(kf, -0.2)));
    g.fillStyle = gr; g.fillRect(x, y, w, hk);
    g.fillStyle = PI.rgb(PI.hell(kf, -0.35));
    for (let i = 1; i < 3; i++) g.fillRect(x, y + hk * i / 3, w, 0.006);
    if (art === "winter") { g.fillStyle = "rgba(250,252,255,0.95)"; g.fillRect(x - 0.01, y - 0.01, w + 0.02, 0.025); }
  };

  /* ---------------- Tür ----------------
     Holztür mit Rundbogen oder gerade, Kassetten, Beschläge,
     Türklinke, Klingel und Hausnummer (daneben) */
  PI.tuer = function (g, x, y, w, h, F, opt) {
    opt = opt || {};
    const f = PI.hex(opt.farbe || "#5b2f1c");
    const rng = F.rng;
    const bogen = opt.bogen ? w / 2 : 0;
    const tiefe = 0.18;
    /* Laibung / Türgewände aus Sandstein */
    if (opt.gewaende !== false) {
      const gw = 0.13;
      const gf = PI.hex(opt.gewaendeFarbe || "#c2ae8e");
      g.fillStyle = PI.rgb(gf);
      g.beginPath();
      g.moveTo(x - gw, y + h); g.lineTo(x - gw, y + bogen);
      if (bogen) g.arc(x + w / 2, y + bogen, w / 2 + gw, Math.PI, 0); else { g.lineTo(x - gw, y - gw); g.lineTo(x + w + gw, y - gw); }
      g.lineTo(x + w + gw, y + h); g.closePath(); g.fill();
      PI.rauschen(g, x - gw, y - gw, w + 2 * gw, h + gw, 0.8, 0.22, 44, 3);
      /* Schlussstein mit Jahreszahl */
      if (bogen && opt.jahr) {
        g.fillStyle = PI.rgb(PI.hell(gf, 0.08));
        g.beginPath(); g.moveTo(x + w / 2 - 0.1, y - gw - 0.02); g.lineTo(x + w / 2 + 0.1, y - gw - 0.02); g.lineTo(x + w / 2 + 0.07, y + 0.08); g.lineTo(x + w / 2 - 0.07, y + 0.08); g.closePath(); g.fill();
        if (F.px > 30) { g.fillStyle = "rgba(70,55,40,0.8)"; g.font = "bold 0.06px serif"; g.textAlign = "center"; g.fillText(opt.jahr, x + w / 2, y - 0.02); }
      }
    }
    /* Türblatt */
    g.save();
    g.beginPath();
    g.moveTo(x, y + h); g.lineTo(x, y + bogen);
    if (bogen) g.arc(x + w / 2, y + bogen, w / 2, Math.PI, 0); else g.lineTo(x, y);
    if (!bogen) g.lineTo(x + w, y);
    g.lineTo(x + w, y + h); g.closePath(); g.clip();
    /* senkrechte Bretter */
    const n = 5;
    for (let i = 0; i < n; i++) {
      const c = PI.streu(f, rng, 0.07);
      const gr = g.createLinearGradient(x + w * i / n, 0, x + w * (i + 1) / n, 0);
      gr.addColorStop(0, PI.rgb(PI.hell(c, 0.06))); gr.addColorStop(1, PI.rgb(PI.hell(c, -0.12)));
      g.fillStyle = gr; g.fillRect(x + w * i / n, y - 0.1, w / n, h + 0.2);
    }
    PI.rauschen(g, x, y, w, h, 0.9, 0.25, 12, 4);
    /* Kassetten (aufgesetzte Rahmen) */
    const kb = w * 0.12;
    g.strokeStyle = PI.rgb(PI.hell(f, -0.35)); g.lineWidth = 0.02;
    g.strokeRect(x + kb, y + bogen + 0.12, w - 2 * kb, h * 0.32);
    g.strokeRect(x + kb, y + bogen + 0.12 + h * 0.38, w - 2 * kb, h * 0.32 - bogen * 0.2);
    g.strokeStyle = PI.rgb(PI.hell(f, 0.2), 0.6); g.lineWidth = 0.01;
    g.strokeRect(x + kb + 0.015, y + bogen + 0.135, w - 2 * kb, h * 0.32);
    /* Oberlicht im Bogen */
    if (bogen) {
      g.fillStyle = "rgba(40,50,70,0.95)";
      g.beginPath(); g.arc(x + w / 2, y + bogen, w / 2 - 0.05, Math.PI, 0); g.closePath(); g.fill();
      g.strokeStyle = PI.rgb(PI.hell(f, -0.1)); g.lineWidth = 0.03;
      for (let i = 1; i < 4; i++) { const a = Math.PI + Math.PI * i / 4; g.beginPath(); g.moveTo(x + w / 2, y + bogen); g.lineTo(x + w / 2 + Math.cos(a) * w / 2, y + bogen + Math.sin(a) * w / 2); g.stroke(); }
    }
    g.restore();
    /* Laibungsschatten */
    const sv = F.schatten ? F.schatten(tiefe) : null;
    if (sv) {
      g.save(); g.beginPath(); g.rect(x, y - 1, w, h + 1); g.clip();
      g.fillStyle = "rgba(20,15,20,0.35)";
      g.beginPath(); g.moveTo(x, y + bogen); if (bogen) g.arc(x + w / 2, y + bogen, w / 2, Math.PI, 0); else g.lineTo(x + w, y);
      g.lineTo(x + w + sv[0], y + bogen + sv[1]); if (bogen) g.arc(x + w / 2 + sv[0], y + bogen + sv[1], w / 2, 0, Math.PI, true); else g.lineTo(x + sv[0], y + sv[1]);
      g.closePath(); g.fill();
      g.restore();
    }
    /* Beschläge: lange Langbänder, Klinke, Schlüsselloch */
    g.fillStyle = "#26211e";
    for (const yy of [y + bogen + 0.2, y + h - 0.35]) {
      g.beginPath(); g.moveTo(x, yy - 0.025); g.lineTo(x + w * 0.62, yy - 0.012); g.arc(x + w * 0.62, yy, 0.013, -Math.PI / 2, Math.PI / 2); g.lineTo(x, yy + 0.025); g.closePath(); g.fill();
    }
    const kx = x + w - 0.13, ky = y + h * 0.54;
    g.fillStyle = "#b08a42"; PI.rundRechteck(g, kx - 0.025, ky - 0.08, 0.05, 0.2, 0.02); g.fill();
    g.fillStyle = "#d9b25e"; g.fillRect(kx - 0.1, ky - 0.012, 0.11, 0.024);
    g.fillStyle = "#2a2018"; g.beginPath(); g.arc(kx, ky + 0.07, 0.009, 0, Math.PI * 2); g.fill();
    /* Stufe: Sandstein-Treppenstufe */
    if (opt.stufe !== false) {
      g.fillStyle = "#b5a386"; g.fillRect(x - 0.18, y + h - 0.02, w + 0.36, 0.05);
    }
  };

  /* Klingel mit Namensschild (Messing) */
  PI.klingel = function (g, x, y, F, name) {
    g.fillStyle = "#9c7b3a"; PI.rundRechteck(g, x, y, 0.1, 0.16, 0.012); g.fill();
    g.fillStyle = "#e3c67a"; PI.rundRechteck(g, x + 0.006, y + 0.006, 0.088, 0.148, 0.01); g.fill();
    g.fillStyle = "#f7f1e1"; g.fillRect(x + 0.017, y + 0.02, 0.066, 0.035);
    if (F.px > 60 && name) { g.fillStyle = "#333"; g.font = "0.022px sans-serif"; g.textAlign = "center"; g.fillText(name, x + 0.05, y + 0.046); }
    g.fillStyle = "#7b5d25"; g.beginPath(); g.arc(x + 0.05, y + 0.11, 0.024, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#f6e3a8"; g.beginPath(); g.arc(x + 0.047, y + 0.107, 0.016, 0, Math.PI * 2); g.fill();
  };

  /* Hausnummer: blaues Emailleschild, weißer Rand, weiße Ziffer */
  PI.hausnummer = function (g, x, y, F, nummer) {
    const w = 0.2, h = 0.15;
    g.fillStyle = "rgba(0,0,0,0.25)"; PI.rundRechteck(g, x + 0.01, y + 0.012, w, h, 0.02); g.fill();
    g.fillStyle = "#1d3e8f"; PI.rundRechteck(g, x, y, w, h, 0.02); g.fill();
    g.strokeStyle = "#f4f4f4"; g.lineWidth = 0.01; PI.rundRechteck(g, x + 0.012, y + 0.012, w - 0.024, h - 0.024, 0.014); g.stroke();
    g.fillStyle = "#fafafa"; g.font = "bold 0.1px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(String(nummer), x + w / 2, y + h / 2 + 0.005);
    g.fillStyle = "rgba(255,255,255,0.25)"; PI.rundRechteck(g, x + 0.02, y + 0.018, w * 0.5, h * 0.25, 0.01); g.fill();
  };
})();
