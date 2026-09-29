/* =====================================================================
   EISDIELE (Gelateria) — Schmuck für die Stadt
   ---------------------------------------------------------------------
   FASSUNG 829 — XANDER: „bei den Schmück-Sachen oder Bausachen eine
   Eisdiele machen, wo dann die Leute auch mal Eis essen gehen können".

   Eine kleine italienische Eisdiele: ockergelber Pavillon mit weißem
   Gesims, vorn die offene Theke mit der Glasvitrine voller bunter
   Eiswannen (Pistazie, Erdbeere, Zitrone, Schokolade, Stracciatella …),
   darüber eine gestreifte Markise in Grün-Weiß-Rot mit gewellter
   Blende, auf dem Dach eine große Eiswaffel mit drei Kugeln, an der
   Brüstung das Schild „GELATERIA". Davor eine Terrasse aus Terrakotta-
   platten mit drei Bistrotischen, Stühlen und Sonnenschirmen, Blumen-
   kübeln – und Leute: eine Frau sitzt am Tisch mit einem Eisbecher, ein
   Mann steht an der Theke und hält seine Waffel, ein Kind schleckt am
   Tisch rechts ein Eis. Im Winter sind die Schirme zugeklappt, die
   Leute tragen Mäntel und trinken heiße Schokolade.
   Nacht: die Vitrine leuchtet, unter der Markise hängt eine Lichterkette.
   Maße (Meter, vorn = +y): Pavillon 4,4 × 2,8 m, Traufe 2,9 m;
   Terrasse 7,2 × 3,8 m; Grund 7,4 × 7,0 m.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const X0 = -2.2, X1 = 2.2, Y0 = -3.3, Y1 = -0.5, H = 2.9, DACH = 0.22;
  const TX0 = -3.6, TX1 = 3.6, TY1 = 3.5;              // Terrasse
  const OCKER = [226, 182, 110], WEISS = [244, 240, 230], GRUEN = [34, 140, 72], ROT = [206, 43, 55];
  const EIS = ["#b8d98a", "#f2a0b4", "#fff2a0", "#6b3f2a", "#f4efe2", "#f6c46a", "#c0392b", "#8fd3e8"];
  const rgb = (f, a) => a == null ? "rgb(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + ")" : "rgba(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + "," + a + ")";
  const hell = (f, k) => f.map((v) => Math.max(0, Math.min(255, k > 0 ? v + (255 - v) * k : v * (1 + k))));
  const TISCHE = [[-2.4, 1.6], [0.9, 2.7], [2.7, 1.2]];

  function putz(g, F, farbe, saat) {
    g.fillStyle = rgb(farbe); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
    if (F.px > 4) { PI.rauschen(g, 0, 0, F.w, F.h, 1.6, 0.16, saat, 3); PI.bleichen(g, 0, 0, F.w, F.h, 1.2, 0.1, saat); }
    /* weißes Gesims oben, Sockel unten */
    g.fillStyle = rgb(WEISS); g.fillRect(-0.05, 0, F.w + 0.1, 0.18);
    g.fillStyle = "rgba(90,70,40,0.25)"; g.fillRect(-0.05, 0.18, F.w + 0.1, 0.04);
    g.fillStyle = "#b9ad98"; g.fillRect(-0.05, F.h - 0.3, F.w + 0.1, 0.35);
  }
  function fenster(g, F, x, y, w, h) {
    g.fillStyle = rgb(WEISS); g.fillRect(x - 0.08, y - 0.08, w + 0.16, h + 0.16);
    const gl = g.createLinearGradient(x, y, x + w * 0.6, y + h);
    gl.addColorStop(0, "#a9c2cf"); gl.addColorStop(0.5, "#4a5d69"); gl.addColorStop(1, "#2d3942");
    g.fillStyle = gl; g.fillRect(x, y, w, h);
    g.fillStyle = rgb(WEISS); g.fillRect(x + w / 2 - 0.025, y, 0.05, h);
    /* grüne Fensterläden */
    g.fillStyle = "#2f6b44"; g.fillRect(x - 0.4, y - 0.05, 0.3, h + 0.1); g.fillRect(x + w + 0.1, y - 0.05, 0.3, h + 0.1);
    if (F.px > 12) { g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 0.02; for (let yy = y; yy < y + h; yy += 0.1) { g.beginPath(); g.moveTo(x - 0.4, yy); g.lineTo(x - 0.1, yy); g.moveTo(x + w + 0.1, yy); g.lineTo(x + w + 0.4, yy); g.stroke(); } }
  }
  /* Vorderwand mit der großen Thekenöffnung, Vitrine und Eiswannen */
  const OX0 = 0.55, OX1 = 3.85, OZ0 = 1.0, OZ1 = 2.35;   // Öffnung (Flächenmaß: x von links, z von unten)
  function vorn(g, F) {
    putz(g, F, OCKER, 3);
    const y = (z) => F.h - z;
    /* Öffnung: dunkler Raum, Regal mit Waffeln und Gläsern */
    g.fillStyle = "#3b2f28"; g.fillRect(OX0, y(OZ1), OX1 - OX0, OZ1 - OZ0);
    g.fillStyle = "#6b5646"; g.fillRect(OX0, y(OZ1 - 0.35), OX1 - OX0, 0.06);
    if (F.px > 10) for (let x = OX0 + 0.15; x < OX1 - 0.1; x += 0.22) { g.fillStyle = x % 0.44 < 0.22 ? "#d9a45a" : "#e9e2d0"; g.fillRect(x, y(OZ1 - 0.35) - 0.16, 0.12, 0.16); }
    /* Vitrine: schräge Glasscheibe über den Eiswannen */
    const vy = y(OZ0 + 0.42);
    for (let i = 0; i < 12; i++) {
      const x = OX0 + 0.12 + i * (OX1 - OX0 - 0.24) / 12, bw = (OX1 - OX0 - 0.24) / 12 - 0.03;
      g.fillStyle = EIS[i % EIS.length]; g.fillRect(x, vy, bw, 0.2);
      g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.ellipse(x + bw / 2, vy + 0.02, bw * 0.4, 0.06, 0, Math.PI, 0); g.fill();
      if (F.px > 16) { g.fillStyle = "#e9e5dc"; g.fillRect(x + bw * 0.25, vy + 0.21, bw * 0.5, 0.05); }
    }
    g.fillStyle = "rgba(200,230,240,0.28)"; g.fillRect(OX0 + 0.05, vy - 0.32, OX1 - OX0 - 0.1, 0.34);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.fillRect(OX0 + 0.05, vy - 0.32, OX1 - OX0 - 0.1, 0.03);
    /* Rahmen */
    g.strokeStyle = rgb(WEISS); g.lineWidth = 0.1; g.strokeRect(OX0, y(OZ1), OX1 - OX0, OZ1 - OZ0);
    /* Theke unter der Öffnung: Holzpaneele mit einem grün-weiß-roten Band */
    g.fillStyle = "#e8dcc4"; g.fillRect(OX0 - 0.1, y(OZ0), OX1 - OX0 + 0.2, OZ0 - 0.3);
    const bw = (OX1 - OX0 + 0.2) / 3;
    [GRUEN, WEISS, ROT].forEach((c, i) => { g.fillStyle = rgb(c); g.fillRect(OX0 - 0.1 + i * bw, y(OZ0) + 0.12, bw, 0.12); });
    if (F.px > 8) { g.strokeStyle = "rgba(120,96,70,0.4)"; g.lineWidth = 0.03; for (let x = OX0 + 0.3; x < OX1; x += 0.55) g.strokeRect(x, y(OZ0) + 0.34, 0.4, OZ0 - 0.75); }
  }
  function vornLicht(g, F) {
    const y = (z) => F.h - z;
    g.fillStyle = "rgba(255,226,170," + (0.75 * F.nacht).toFixed(3) + ")"; g.fillRect(OX0, y(OZ1), OX1 - OX0, OZ1 - OZ0 - 0.1);
    F.leuchtPunkt((OX0 + OX1) / 2, y((OZ0 + OZ1) / 2), 3.2, "255,220,160", 0.9);
  }
  function seite(fx) {
    return function (g, F) { putz(g, F, OCKER, 5 + fx); fenster(g, F, F.w / 2 - 0.45, 0.8, 0.9, 1.1); };
  }
  const hinten = (g, F) => { putz(g, F, hell(OCKER, -0.04), 9); g.fillStyle = "#7a5a3a"; g.fillRect(F.w * 0.65, F.h - 2.3, 0.85, 2.0); };
  /* Dachplatte */
  const dach = (g, F) => { g.fillStyle = "#d8c8a8"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); if (F.px > 4) PI.rauschen(g, 0, 0, F.w, F.h, 1.5, 0.25, 13, 3); if (F.jahr === "winter") { g.fillStyle = "rgba(246,248,252,0.95)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); } };
  const weissMal = (g, F) => { g.fillStyle = rgb(WEISS); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); };
  /* Schild „GELATERIA" auf der Brüstung */
  function schild(g, F) {
    g.fillStyle = rgb(WEISS); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
    g.fillStyle = "#1f5a36"; g.fillRect(0.06, 0.05, F.w - 0.12, F.h - 0.1);
    if (F.px * F.h > 5) {
      g.fillStyle = "#fbf4e2"; g.textAlign = "center"; g.textBaseline = "middle";
      g.font = "italic bold 0.3px Georgia, 'DejaVu Serif', serif";
      g.save(); g.translate(F.w / 2, F.h / 2 + 0.01);
      const w = g.measureText("GELATERIA").width || 1, k = Math.min(1, (F.w - 0.4) / w);
      g.scale(k, 1); g.fillText("GELATERIA", 0, 0); g.restore();
    }
  }
  /* Markise: Streifen Grün-Weiß-Rot (quer zur Neigung), dazu Schattierung zur Kante */
  function markise(g, F) {
    const n = Math.max(6, Math.round(F.w / 0.34)), sw = F.w / n;
    for (let i = 0; i < n; i++) { g.fillStyle = rgb([GRUEN, WEISS, ROT][i % 3]); g.fillRect(i * sw - 0.01, -0.05, sw + 0.02, F.h + 0.1); }
    const gr = g.createLinearGradient(0, 0, 0, F.h);
    gr.addColorStop(0, "rgba(0,0,0,0.12)"); gr.addColorStop(1, "rgba(255,255,255,0.08)");
    g.fillStyle = gr; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
    if (F.jahr === "winter") { g.fillStyle = "rgba(246,248,252,0.85)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h * 0.8); }
  }
  function blende(g, F) {
    const n = Math.max(6, Math.round(F.w / 0.34)), sw = F.w / n;
    for (let i = 0; i < n; i++) { g.fillStyle = rgb([GRUEN, WEISS, ROT][i % 3]); g.fillRect(i * sw - 0.01, -0.05, sw + 0.02, F.h + 0.1); }
  }
  function blendeLicht(g, F) {
    /* Lichterkette unter der Markise */
    for (let x = 0.2; x < F.w; x += 0.4) {
      g.fillStyle = "rgba(255,230,160," + F.nacht.toFixed(3) + ")"; g.beginPath(); g.arc(x, F.h + 0.08, 0.05, 0, Math.PI * 2); g.fill();
      if (Math.round(x / 0.4) % 3 === 0) F.leuchtPunkt(x, F.h + 0.08, 1.2, "255,214,150", 0.35);
    }
  }
  /* Terrasse: Terrakottaplatten, im Winter Schnee (mit Trittspur zur Theke) */
  function terrasse(g, F) {
    g.fillStyle = "#b8664a"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
    if (F.px * 0.4 > 3) {
      const rng = F.rng;
      for (let x = 0; x < F.w; x += 0.4) for (let y = 0; y < F.h; y += 0.4) { g.fillStyle = rgb(hell([184, 102, 74], (rng() - 0.5) * 0.18)); g.fillRect(x + 0.015, y + 0.015, 0.37, 0.37); }
    }
    if (F.px > 4) PI.rauschen(g, 0, 0, F.w, F.h, 2, 0.2, 17, 3);
    if (F.jahr === "winter") { g.fillStyle = "rgba(244,247,252,0.9)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.fillStyle = "rgba(170,120,96,0.35)"; g.fillRect(F.w / 2 - 0.4, 0, 0.8, F.h); }
  }

  /* ---------------- Figuren (aufrecht gemalt, Ursprung am Fuß, y nach oben negativ) ---------------- */
  /* Bistrotisch mit zwei Stühlen und Sonnenschirm */
  function tischMalen(g, s, F, i) {
    if (F.schatten) return;
    const winter = F.jahr === "winter", m = (v) => v * s;
    /* Stühle links und rechts (Metall, grün) */
    g.strokeStyle = "#2c5a3c"; g.lineWidth = Math.max(1, m(0.035));
    for (const sx of [-1, 1]) {
      const x = m(sx * 0.55);
      g.beginPath(); g.moveTo(x - m(0.18), 0); g.lineTo(x - m(0.18), -m(0.45)); g.moveTo(x + m(0.18), 0); g.lineTo(x + m(0.18), -m(0.45));
      g.moveTo(x - m(0.2), -m(0.45)); g.lineTo(x + m(0.2), -m(0.45));
      g.moveTo(x + sx * m(0.2), -m(0.45)); g.lineTo(x + sx * m(0.22), -m(0.9)); g.stroke();
    }
    /* Tisch: Säulenfuß und runde Marmorplatte */
    g.fillStyle = "#3a3a3a"; g.fillRect(-m(0.03), -m(0.72), m(0.06), m(0.72));
    g.beginPath(); g.ellipse(0, -m(0.02), m(0.22), m(0.06), 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#efeae0"; g.beginPath(); g.ellipse(0, -m(0.74), m(0.36), m(0.1), 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#cfc8ba"; g.fillRect(-m(0.36), -m(0.74), m(0.72), m(0.04));
    /* Eisbecher auf dem Tisch */
    if (!winter && s > 20) { g.fillStyle = "#e8f0f4"; g.fillRect(m(0.08), -m(0.9), m(0.08), m(0.14)); g.fillStyle = EIS[(i * 3) % EIS.length]; g.beginPath(); g.arc(m(0.12), -m(0.92), m(0.06), 0, Math.PI * 2); g.fill(); }
    /* Sonnenschirm */
    g.fillStyle = "#6b5b4b"; g.fillRect(-m(0.025), -m(2.35), m(0.05), m(1.6));
    const farbe = i % 2 ? [236, 230, 214] : [206, 43, 55];
    if (winter) {
      /* zugeklappt */
      g.fillStyle = rgb(farbe); g.beginPath(); g.moveTo(-m(0.1), -m(1.5)); g.lineTo(m(0.1), -m(1.5)); g.lineTo(m(0.04), -m(2.45)); g.lineTo(-m(0.04), -m(2.45)); g.closePath(); g.fill();
      g.fillStyle = "rgba(246,248,252,0.95)"; g.beginPath(); g.ellipse(0, -m(2.45), m(0.06), m(0.03), 0, 0, Math.PI * 2); g.fill();
      return;
    }
    const r = m(1.05), top = -m(2.5), rand = -m(2.12);
    const gr = g.createLinearGradient(-r, 0, r, 0);
    gr.addColorStop(0, rgb(hell(farbe, 0.15))); gr.addColorStop(0.6, rgb(farbe)); gr.addColorStop(1, rgb(hell(farbe, -0.25)));
    g.fillStyle = gr;
    g.beginPath(); g.moveTo(0, top); g.lineTo(r, rand); g.quadraticCurveTo(0, rand + m(0.16), -r, rand); g.closePath(); g.fill();
    /* Volant */
    g.fillStyle = rgb(i % 2 ? [206, 43, 55] : [236, 230, 214]);
    for (let k = 0; k < 8; k++) { const x = -r + (k + 0.5) * 2 * r / 8; g.beginPath(); g.arc(x, rand + m(0.02) + Math.sin((k + 0.5) / 8 * Math.PI) * m(0.07), m(0.07), 0, Math.PI); g.fill(); }
    g.fillStyle = "#6b5b4b"; g.beginPath(); g.arc(0, top - m(0.03), m(0.04), 0, Math.PI * 2); g.fill();
  }
  /* Mensch (schlicht, aber mit echten Proportionen): art "sitzt", "steht", "kind" */
  function menschMalen(g, s, F, art, farben) {
    if (F.schatten) return;
    const winter = F.jahr === "winter", m = (v) => v * s;
    const H = art === "kind" ? 1.2 : 1.72, kr = 0.065 * H;
    const jacke = winter ? farben.mantel : farben.hemd, hose = farben.hose, haut = farben.haut, haar = farben.haar;
    const sitzt = art === "sitzt";
    const hueft = sitzt ? 0.47 : 0.52 * H, schulter = sitzt ? hueft + 0.32 * H : 0.82 * H;
    g.lineCap = "round";
    /* Beine */
    g.strokeStyle = rgb(hose); g.lineWidth = Math.max(1, m(0.11 * H / 1.72));
    if (sitzt) { g.beginPath(); g.moveTo(-m(0.06), -m(hueft)); g.lineTo(m(0.22), -m(hueft - 0.02)); g.lineTo(m(0.24), -m(0.05)); g.stroke(); g.beginPath(); g.moveTo(m(0.05), -m(hueft)); g.lineTo(m(0.3), -m(hueft - 0.04)); g.lineTo(m(0.33), -m(0.05)); g.stroke(); }
    else for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(sx * m(0.06 * H), -m(hueft)); g.lineTo(sx * m(0.07 * H), -m(0.04)); g.stroke(); }
    /* Schuhe */
    g.fillStyle = "#2b2622";
    if (sitzt) { g.fillRect(m(0.2), -m(0.06), m(0.12), m(0.06)); g.fillRect(m(0.29), -m(0.06), m(0.12), m(0.06)); }
    else for (const sx of [-1, 1]) g.fillRect(sx * m(0.07 * H) - m(0.05), -m(0.05), m(0.11), m(0.05));
    /* Rumpf */
    const br = m((winter ? 0.2 : 0.17) * H / 1.72);
    const gr = g.createLinearGradient(-br, 0, br, 0);
    gr.addColorStop(0, rgb(hell(jacke, 0.1))); gr.addColorStop(1, rgb(hell(jacke, -0.25)));
    g.fillStyle = gr;
    g.beginPath(); g.moveTo(-br * 0.85, -m(hueft) + (winter && !sitzt ? m(0.18) : 0)); g.lineTo(-br, -m(schulter)); g.quadraticCurveTo(0, -m(schulter + 0.05), br, -m(schulter)); g.lineTo(br * 0.85, -m(hueft) + (winter && !sitzt ? m(0.18) : 0)); g.closePath(); g.fill();
    /* Arme: einer hält Eis (Waffel) oder Becher zum Mund */
    g.strokeStyle = rgb(hell(jacke, -0.1)); g.lineWidth = Math.max(1, m(0.075 * H / 1.72));
    g.beginPath(); g.moveTo(-br * 0.9, -m(schulter - 0.04)); g.lineTo(-br * 1.05, -m(schulter - 0.3 * H / 1.72)); g.lineTo(-br * 0.9, -m(hueft + 0.02)); g.stroke();
    const hx = br * 0.7, hy = -m(schulter + 0.02);
    g.beginPath(); g.moveTo(br * 0.9, -m(schulter - 0.04)); g.lineTo(br * 1.15, -m(schulter - 0.24 * H / 1.72)); g.lineTo(hx, hy); g.stroke();
    /* Hals und Kopf */
    const kz = schulter + 0.1 * H / 1.72 + kr;
    g.fillStyle = rgb(haut); g.beginPath(); g.ellipse(0, -m(kz), m(kr * 0.85), m(kr), 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = rgb(haar); g.beginPath(); g.ellipse(0, -m(kz + kr * 0.25), m(kr * 0.9), m(kr * 0.8), 0, Math.PI, 0); g.fill();
    if (farben.lang) { g.fillRect(-m(kr * 0.9), -m(kz + kr * 0.2), m(kr * 0.35), m(kr * 1.6)); g.fillRect(m(kr * 0.55), -m(kz + kr * 0.2), m(kr * 0.35), m(kr * 1.6)); }
    if (winter) { g.fillStyle = rgb(farben.muetze); g.beginPath(); g.ellipse(0, -m(kz + kr * 0.45), m(kr * 0.95), m(kr * 0.7), 0, Math.PI, 0); g.fill(); g.fillStyle = rgb(farben.schal); g.fillRect(-m(0.09), -m(schulter + 0.05), m(0.18), m(0.08)); }
    /* was die Hand hält: Waffel mit Kugeln (Sommer/Herbst) oder Tasse (Winter) */
    g.fillStyle = rgb(haut); g.beginPath(); g.arc(hx, hy, m(0.035), 0, Math.PI * 2); g.fill();
    if (winter) { g.fillStyle = "#f4efe6"; g.fillRect(hx - m(0.04), hy - m(0.1), m(0.08), m(0.09)); g.fillStyle = "#6b3f2a"; g.fillRect(hx - m(0.035), hy - m(0.1), m(0.07), m(0.02)); }
    else {
      g.fillStyle = "#d9a45a"; g.beginPath(); g.moveTo(hx - m(0.045), hy - m(0.06)); g.lineTo(hx + m(0.045), hy - m(0.06)); g.lineTo(hx, hy + m(0.08)); g.closePath(); g.fill();
      g.fillStyle = farben.eis[0]; g.beginPath(); g.arc(hx, hy - m(0.09), m(0.05), 0, Math.PI * 2); g.fill();
      g.fillStyle = farben.eis[1]; g.beginPath(); g.arc(hx + m(0.01), hy - m(0.16), m(0.045), 0, Math.PI * 2); g.fill();
    }
  }
  /* Eiswaffel auf dem Dach (Reklame) */
  function waffelMalen(g, s, F) {
    if (F.schatten) return;
    const m = (v) => v * s;
    g.fillStyle = "#6b5b4b"; g.fillRect(-m(0.04), -m(0.4), m(0.08), m(0.4));
    const gr = g.createLinearGradient(-m(0.35), 0, m(0.35), 0);
    gr.addColorStop(0, "#e8b86a"); gr.addColorStop(1, "#b07a3a");
    g.fillStyle = gr; g.beginPath(); g.moveTo(-m(0.36), -m(1.3)); g.lineTo(m(0.36), -m(1.3)); g.lineTo(0, -m(0.35)); g.closePath(); g.fill();
    if (s > 16) { g.strokeStyle = "rgba(120,70,30,0.5)"; g.lineWidth = Math.max(1, m(0.02)); for (let k = -3; k <= 3; k++) { g.beginPath(); g.moveTo(k * m(0.1), -m(1.3)); g.lineTo(k * m(0.1) + m(0.25), -m(0.8)); g.stroke(); } }
    const kugeln = F.jahr === "winter" ? ["#f4efe2", "#f4efe2", "#f4efe2"] : ["#f2a0b4", "#b8d98a", "#6b3f2a"];
    [[-0.17, 1.45, 0.24, 0], [0.17, 1.45, 0.24, 1], [0, 1.78, 0.25, 2]].forEach(([x, z, r, i]) => {
      const gk = g.createRadialGradient(m(x - r * 0.3), -m(z + r * 0.3), m(r * 0.1), m(x), -m(z), m(r));
      gk.addColorStop(0, "#ffffff"); gk.addColorStop(0.25, kugeln[i]); gk.addColorStop(1, rgb(hell([120, 100, 90], -0.2)));
      g.fillStyle = gk; g.beginPath(); g.arc(m(x), -m(z), m(r), 0, Math.PI * 2); g.fill();
    });
    g.fillStyle = "#c0392b"; g.beginPath(); g.arc(m(0.03), -m(2.08), m(0.06), 0, Math.PI * 2); g.fill();
  }
  /* Blumenkübel (Terrakotta, rote Geranien; im Winter ein Buchs mit Schnee) */
  function kuebelMalen(g, s, F) {
    if (F.schatten) return;
    const m = (v) => v * s, winter = F.jahr === "winter";
    g.fillStyle = "#a65a3a"; g.beginPath(); g.moveTo(-m(0.25), -m(0.5)); g.lineTo(m(0.25), -m(0.5)); g.lineTo(m(0.19), 0); g.lineTo(-m(0.19), 0); g.closePath(); g.fill();
    g.fillStyle = winter ? "#2f5b35" : "#3f7a3a"; g.beginPath(); g.ellipse(0, -m(0.72), m(0.34), m(0.28), 0, 0, Math.PI * 2); g.fill();
    if (winter) { g.fillStyle = "rgba(246,248,252,0.95)"; g.beginPath(); g.ellipse(0, -m(0.9), m(0.26), m(0.1), 0, 0, Math.PI * 2); g.fill(); }
    else for (let k = 0; k < 9; k++) { const a = k * 0.7; g.fillStyle = k % 3 ? "#d8283a" : "#f07aa0"; g.beginPath(); g.arc(Math.cos(a) * m(0.22), -m(0.74) + Math.sin(a) * m(0.16), m(0.06), 0, Math.PI * 2); g.fill(); }
  }

  ST.modell("eisdiele", {
    name: "Eisdiele", gruppe: "Deko", grund: [7.4, 7.0], hoehe: 5.2, bauzeit: 180,
    bauen(M, o) {
      /* Terrasse */
      M.teil("terrasse", { ebene: -1 });
      M.flaeche({ name: "terrasse", o: [TX0, Y1 - 0.2, 0.03], u: [1, 0, 0], v: [0, 1, 0], w: TX1 - TX0, h: TY1 - Y1 + 0.2, malen: terrasse });
      /* Pavillon */
      M.teil("pavillon");
      M.quader({ x: X0, y: Y0, z: 0, b: X1 - X0, t: Y1 - Y0, h: H }, { sued: vorn, nord: hinten, ost: seite(1), west: seite(2) }, {});
      /* Leuchten der Vorderwand (Vitrine) anmelden */
      M.akt.flaechen.forEach((f) => { if (f.name === "sued") f.leuchten = vornLicht; });
      M.teil("dach");
      M.quader({ x: X0 - 0.15, y: Y0 - 0.15, z: H, b: X1 - X0 + 0.3, t: Y1 - Y0 + 0.3, h: DACH }, { sued: weissMal, nord: weissMal, ost: weissMal, west: weissMal, oben: dach });
      /* Brüstung mit Schild vorn */
      M.teil("schild");
      M.flaeche({ name: "schild", o: [X0 + 0.5, Y1 + 0.17, H + DACH + 0.55], u: [1, 0, 0], v: [0, 0, -1], w: X1 - X0 - 1.0, h: 0.55, malen: schild, beidseitig: false });
      M.quader({ x: X0 + 0.5, y: Y1 + 0.02, z: H + DACH, b: X1 - X0 - 1.0, t: 0.14, h: 0.55 }, { ost: weissMal, west: weissMal, oben: weissMal, nord: weissMal });
      /* Markise: vom Gesims schräg nach vorn, mit gewellter Blende */
      M.teil("markise");
      const mz0 = H - 0.2, my1 = Y1 + 0.95, mz1 = 2.42;
      M.flaeche({ name: "markise", o: [X0 - 0.1, Y1, mz0], u: [1, 0, 0], v: [0, my1 - Y1, mz1 - mz0], w: X1 - X0 + 0.2, h: Math.hypot(my1 - Y1, mz1 - mz0), malen: markise, beidseitig: true });
      const bl = X1 - X0 + 0.2, wellen = [];
      wellen.push([0, 0]);
      for (let k = 0; k <= 24; k++) { const x = k / 24 * bl; wellen.push([x, 0.17 + Math.abs(Math.sin(k / 24 * Math.PI * 12)) * 0.08]); }
      wellen.push([bl, 0]);
      M.flaeche({ name: "blende", o: [X0 - 0.1, my1, mz1], u: [1, 0, 0], v: [0, 0, -1], w: bl, h: 0.26, umriss: wellen, malen: blende, leuchten: blendeLicht, beidseitig: true });
      /* Tische, Leute, Kübel, Waffel */
      /* jedes Ding ein eigener Teil, damit Leute vor und hinter den Tischen richtig einsortiert werden */
      TISCHE.forEach(([x, y], i) => M.teil("tisch" + i) && M.figur({ x: x, y: y, z: 0.03, breite: 2.3, hoehe: 2.6, malen: (g, s, F) => tischMalen(g, s, F, i) }));
      const leute = [
        { x: TISCHE[0][0] - 0.55, y: TISCHE[0][1] + 0.1, art: "sitzt", f: { hemd: [230, 120, 140], mantel: [120, 40, 60], hose: [60, 70, 110], haut: [236, 196, 170], haar: [90, 60, 40], lang: true, muetze: [230, 230, 230], schal: [200, 60, 60], eis: ["#f2a0b4", "#fff2a0"] } },
        { x: -0.7, y: Y1 + 0.75, art: "steht", f: { hemd: [80, 130, 190], mantel: [60, 66, 80], hose: [50, 50, 56], haut: [220, 180, 150], haar: [40, 32, 28], muetze: [40, 60, 110], schal: [220, 180, 60], eis: ["#b8d98a", "#6b3f2a"] } },
        { x: TISCHE[2][0] + 0.45, y: TISCHE[2][1] + 0.35, art: "kind", f: { hemd: [250, 200, 60], mantel: [200, 60, 50], hose: [70, 110, 160], haut: [240, 204, 176], haar: [170, 110, 50], muetze: [60, 140, 90], schal: [240, 240, 240], eis: ["#f6c46a", "#f2a0b4"] } }
      ];
      leute.forEach((l, i) => M.teil("leute" + i) && M.figur({ x: l.x, y: l.y, z: 0.03, breite: 0.8, hoehe: l.art === "kind" ? 1.3 : 1.85, malen: (g, s, F) => menschMalen(g, s, F, l.art, l.f) }));
      M.teil("kuebel");
      for (const [x, y] of [[TX0 + 0.35, TY1 - 0.35], [TX1 - 0.35, TY1 - 0.35], [TX0 + 0.35, Y1 + 0.2]]) M.figur({ x: x, y: y, z: 0.03, breite: 0.8, hoehe: 1.0, malen: kuebelMalen });
      M.teil("waffel");
      M.figur({ x: 1.2, y: (Y0 + Y1) / 2, z: H + DACH, breite: 1.0, hoehe: 2.2, malen: waffelMalen });
      M.licht(0, Y1 + 0.3, 1.8, 2.2, "255,214,150", 0.8);
      M.bodenlicht(0, Y1 + 1.5, 3.4, "255,214,150", 0.5);
    }
  });
})();
