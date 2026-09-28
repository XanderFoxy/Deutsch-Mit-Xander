/* =====================================================================
   BAUKASTEN-STADT — DAS BOOTSHAUS (Tretbootverleih am See)
   ---------------------------------------------------------------------
   XANDER: „vielleicht so ein kleines Bootshaus für den Verleih vom
   Wassertreter".

   Ein kleines Holzhaus am Ufer, wie es an Stadtparkteichen steht:
   Stülpschalung aus Brettern mit Deckleisten (schwedenrot, verwittert),
   weiße Eckbretter und Fensterrahmen, Satteldach mit Biberschwanz, im
   Winter Schnee darauf. Zur Wiese (Süden) die Verleihklappe: aufgestellte
   Klappe als Vordach, darunter die Theke, drinnen hängen orange
   Schwimmwesten; im Giebel zum Steg das grüne Schild „TRETBOOTVERLEIH".
   Zum Wasser (Osten) die Tür, daneben ein rot-weißer Rettungsring und
   eine kleine Laterne. Vom Haus führt ein Holzsteg 6 m ins Wasser
   (Bohlen quer, Pfähle, an der Spitze zwei Poller) – dort legen die
   Schwanenboote an (stadt-leicht/boote.js).
   Maße: Haus 4 × 3,2 m, Traufe 2,6 m, First 3,8 m; Steg 6 × 1,4 m,
   Deck 0,45 m über dem Wasser. Grundriss 10 × 3,4 m, Mitte in (0,0);
   Haus bei x −5 … −1, Steg bei x −1 … +5 (Steg zeigt nach Osten, +x).
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const X0 = -5, X1 = -1, Y0 = -1.6, Y1 = 1.6, SO = 0.2, H = 2.4, HF = 1.2;
  const ZT = SO + H;                        // Traufe
  const ROT = [142, 60, 44], LEISTE = [118, 48, 36], WEISS = [238, 234, 224], GRUEN = [34, 78, 58];
  const rgb = (f, a) => a == null ? "rgb(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + ")" : "rgba(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + "," + a + ")";
  const hell = (f, k) => f.map((v) => Math.max(0, Math.min(255, k > 0 ? v + (255 - v) * k : v * (1 + k))));

  /* Bretterwand: senkrechte Bretter mit Deckleisten, Maserung, Verwitterung */
  function bretter(g, F, x, y, w, h, farbe, saat) {
    const rng = ST.zufall(saat * 977 + 3), bb = 0.2;
    g.fillStyle = rgb(farbe); g.fillRect(x - 0.02, y - 0.02, w + 0.04, h + 0.04);
    if (F.px * bb > 2.5) for (let xx = x; xx < x + w; xx += bb) { const k = (rng() - 0.5) * 0.12; g.fillStyle = rgb(hell(farbe, k)); g.fillRect(xx, y, bb, h); }
    if (F.px > 6) PI.rauschen(g, x, y, w, h, 0.9, 0.22, saat + 5, 3);
    if (F.px * 0.05 > 1) {
      const sv = F.schatten ? F.schatten(0.02) : null;
      for (let xx = x + bb; xx < x + w - 0.05; xx += bb) {
        if (sv) { g.fillStyle = "rgba(20,10,8,0.35)"; g.fillRect(xx - 0.025 + sv[0], y, 0.05, h); }
        g.fillStyle = rgb(LEISTE); g.fillRect(xx - 0.025, y, 0.05, h);
        g.fillStyle = rgb(hell(LEISTE, 0.18)); g.fillRect(xx - 0.025, y, 0.012, h);
      }
    }
    PI.bleichen(g, x, y, w, h, 1.6, 0.12, saat);
    /* Spritzwasser unten */
    const gr = g.createLinearGradient(0, y + h, 0, y + h - 0.5);
    gr.addColorStop(0, "rgba(40,34,26,0.35)"); gr.addColorStop(1, "rgba(40,34,26,0)");
    g.fillStyle = gr; g.fillRect(x, y + h - 0.5, w, 0.5);
  }
  function brett(g, F, x, y, w, h, farbe) {
    const sv = F.schatten ? F.schatten(0.025) : null;
    if (sv) { g.fillStyle = "rgba(20,12,10,0.3)"; g.fillRect(x + sv[0], y + sv[1], w, h); }
    g.fillStyle = rgb(farbe); g.fillRect(x, y, w, h);
  }
  function sockel(g, F) {
    g.fillStyle = "#8d877c"; g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04);
    if (F.px > 8) PI.rauschen(g, 0, 0, F.w, F.h, 0.6, 0.35, 11, 3);
  }
  /* Fenster mit weißem Rahmen und Kreuz */
  function fenster(g, F, x, y, w, h) {
    brett(g, F, x - 0.07, y - 0.07, w + 0.14, h + 0.14, WEISS);
    const gl = g.createLinearGradient(x, y, x + w * 0.5, y + h);
    gl.addColorStop(0, "#9fb6c4"); gl.addColorStop(0.5, "#40505c"); gl.addColorStop(1, "#27313a");
    g.fillStyle = gl; g.fillRect(x, y, w, h);
    g.fillStyle = rgb(WEISS); g.fillRect(x + w / 2 - 0.025, y, 0.05, h); g.fillRect(x, y + h * 0.45 - 0.025, w, 0.05);
  }
  function fensterLicht(g, F, x, y, w, h) {
    g.fillStyle = "rgba(255,196,120," + (0.85 * F.nacht).toFixed(3) + ")"; g.fillRect(x, y, w, h);
    F.leuchtPunkt(x + w / 2, y + h / 2, 1.6, "255,190,110", 0.7);
  }
  /* Rettungsring: Ring mit vier roten und vier weißen Feldern, Leine */
  function ring(g, F, cx, cy, r) {
    const ri = r * 0.55;
    const sv = F.schatten ? F.schatten(0.08) : null;
    if (sv) { g.fillStyle = "rgba(20,10,8,0.35)"; g.beginPath(); g.arc(cx + sv[0], cy + sv[1], r, 0, Math.PI * 2); g.arc(cx + sv[0], cy + sv[1], ri, 0, Math.PI * 2, true); g.fill(); }
    for (let i = 0; i < 8; i++) {
      g.fillStyle = i % 2 ? "#f4f1ea" : "#d8322a";
      g.beginPath(); g.arc(cx, cy, r, i * Math.PI / 4 + 0.39, (i + 1) * Math.PI / 4 + 0.39); g.arc(cx, cy, ri, (i + 1) * Math.PI / 4 + 0.39, i * Math.PI / 4 + 0.39, true); g.closePath(); g.fill();
    }
    if (F.px > 14) {
      g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = r * 0.08;
      g.beginPath(); g.arc(cx, cy, (r + ri) / 2, Math.PI * 1.05, Math.PI * 1.5); g.stroke();
      g.strokeStyle = "#e8e0c8"; g.lineWidth = 0.018;
      g.beginPath(); g.arc(cx, cy, (r + ri) / 2, 0, Math.PI * 2); g.stroke();
    }
  }
  /* Schild „TRETBOOTVERLEIH" – grünes Brett mit weißer Schrift und Rand */
  function schild(g, F) {
    g.fillStyle = rgb(GRUEN); g.fillRect(0, 0, F.w, F.h);
    if (F.px > 6) PI.rauschen(g, 0, 0, F.w, F.h, 0.7, 0.2, 21, 3);
    g.strokeStyle = rgb(WEISS); g.lineWidth = 0.03; g.strokeRect(0.05, 0.05, F.w - 0.1, F.h - 0.1);
    if (F.px * F.h > 5) {
      g.fillStyle = rgb(WEISS); g.textAlign = "center"; g.textBaseline = "middle";
      g.font = "bold 0.25px Georgia, 'DejaVu Serif', serif";
      g.save(); g.translate(F.w / 2, F.h / 2 + 0.01);
      const w = g.measureText("TRETBOOTVERLEIH").width || 1, k = Math.min(1, (F.w - 0.3) / w);
      g.scale(k, 1); g.fillText("TRETBOOTVERLEIH", 0, 0); g.restore();
    }
  }
  /* Verleihklappe: dunkle Öffnung, Schwimmwesten, Theke */
  function klappe(g, F, x, y, w, h) {
    brett(g, F, x - 0.08, y - 0.08, w + 0.16, h + 0.08, WEISS);
    g.fillStyle = "#2a221c"; g.fillRect(x, y, w, h);
    const gr = g.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, "rgba(0,0,0,0.5)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    if (F.px > 10) for (let i = 0; i < 4; i++) {
      const vx = x + 0.2 + i * 0.36, vy = y + 0.2;
      g.fillStyle = i % 2 ? "#e4671e" : "#f07a22";
      PI.rundRechteck(g, vx, vy, 0.24, 0.38, 0.06); g.fill();
      g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(vx + 0.11, vy + 0.05, 0.02, 0.33);
    }
    g.fillStyle = gr; g.fillRect(x, y, w, h);
  }
  function klappeLicht(g, F, x, y, w, h) {
    g.fillStyle = "rgba(255,190,110," + (0.7 * F.nacht).toFixed(3) + ")"; g.fillRect(x, y, w, h * 0.9);
    F.leuchtPunkt(x + w / 2, y + h / 2, 2, "255,190,110", 0.6);
  }
  function tuer(g, F, x, y, w, h) {
    brett(g, F, x - 0.08, y - 0.08, w + 0.16, h + 0.08, WEISS);
    bretter(g, F, x, y, w, h, [92, 64, 44], 41);
    g.fillStyle = "#c8b060"; g.beginPath(); g.arc(x + w - 0.12, y + h * 0.52, 0.035, 0, Math.PI * 2); g.fill();
  }
  /* Bohlen des Stegs (quer zur Laufrichtung) */
  function bohlen(g, F, schnee) {
    const rng = ST.zufall(77), bb = 0.16;
    g.fillStyle = "#3a2c20"; g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04);
    for (let x = 0; x < F.w; x += bb) {
      const k = (rng() - 0.5) * 0.18, f = hell([150, 118, 84], k);
      g.fillStyle = rgb(f); g.fillRect(x + 0.008, 0, bb - 0.016, F.h);
    }
    if (F.px > 8) PI.rauschen(g, 0, 0, F.w, F.h, 0.8, 0.25, 31, 3);
    PI.bleichen(g, 0, 0, F.w, F.h, 1.4, 0.14, 7);
    if (schnee) {
      g.fillStyle = "rgba(240,244,250,0.92)"; g.fillRect(0, 0, F.w, F.h);
      if (F.px > 6) PI.rauschen(g, 0, 0, F.w, F.h, 1.2, 0.12, 9, 3);
      g.fillStyle = "rgba(160,170,190,0.25)"; g.fillRect(0, F.h * 0.45, F.w, F.h * 0.1);   // Trittspur
    }
  }
  const holz = (f) => (g, F) => { g.fillStyle = rgb(f); g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04); if (F.px > 8) PI.rauschen(g, 0, 0, F.w, F.h, 0.5, 0.3, 5, 3); };

  ST.modell("bootshaus", {
    name: "Bootshaus", gruppe: "Deko", grund: [10, 3.4], hoehe: 4, bauzeit: 120,
    bauen(M, o) {
      const winter = o.jahr === "winter", B = X1 - X0, T = Y1 - Y0;
      /* ---------------- Steg ---------------- */
      M.teil("steg");
      const SX0 = X1 - 0.1, SX1 = 5, SY = 0.7, SZ = 0.45;
      for (let x = SX0 + 0.9; x < SX1; x += 1.5) for (const y of [-SY - 0.05, SY - 0.09]) {
        M.quader({ x: x, y: y, z: 0, b: 0.14, t: 0.14, h: SZ - 0.1 }, { sued: holz([74, 58, 44]), nord: holz([74, 58, 44]), ost: holz([64, 50, 38]), west: holz([74, 58, 44]) });
      }
      M.quader({ x: SX0, y: -SY, z: SZ - 0.1, b: SX1 - SX0, t: 2 * SY, h: 0.1 }, { sued: holz([96, 74, 52]), nord: holz([96, 74, 52]), ost: holz([96, 74, 52]), west: holz([96, 74, 52]), oben: (g, F) => bohlen(g, F, winter) });
      M.teil("poller");
      for (const y of [-SY + 0.02, SY - 0.2]) M.quader({ x: SX1 - 0.22, y: y, z: SZ, b: 0.18, t: 0.18, h: 0.42 }, { sued: holz([70, 54, 40]), nord: holz([70, 54, 40]), ost: holz([60, 46, 34]), west: holz([70, 54, 40]), oben: winter ? "#eef2f8" : "#5a4430" });
      /* ---------------- Haus ---------------- */
      M.teil("sockel");
      M.quader({ x: X0 - 0.05, y: Y0 - 0.05, z: 0, b: B + 0.1, t: T + 0.1, h: SO }, { sued: sockel, nord: sockel, ost: sockel, west: sockel, oben: sockel });
      M.teil("haus");
      const wand = (name, w, h, extra) => (g, F) => {
        bretter(g, F, 0, 0, w, h, ROT, name.length * 7);
        /* weiße Eckbretter */
        brett(g, F, 0, 0, 0.12, h, WEISS); brett(g, F, w - 0.12, 0, 0.12, h, WEISS);
        if (extra) extra(g, F);
      };
      /* Süden: Verleihklappe und Schild */
      const KX = 1.0, KW = 1.8, KY = 0.75, KH = 0.9;
      M.flaeche({ name: "sued", o: [X0, Y1, ZT], u: [1, 0, 0], v: [0, 0, -1], w: B, h: H, ao: true, traufe: 0.35,
        malen: wand("sued", B, H, (g, F) => { klappe(g, F, KX, KY, KW, KH); brett(g, F, KX - 0.15, KY + KH, KW + 0.3, 0.08, [168, 128, 88]); }),
        leuchten: (g, F) => klappeLicht(g, F, KX, KY, KW, KH) });
      /* Theke (Brett vor der Klappe) und aufgestellte Klappe als Vordach */
      M.quader({ x: X0 + KX - 0.1, y: Y1, z: ZT - KY - KH - 0.06, b: KW + 0.2, t: 0.28, h: 0.06 }, { sued: "#8a6440", ost: "#8a6440", west: "#8a6440", oben: holz([176, 136, 94]) });
      M.flaeche({ name: "klappe", o: [X0 + KX - 0.05, Y1 + 0.02, ZT - KY + 0.06], u: [1, 0, 0], v: [0, 0.9, 0.42], w: KW + 0.1, h: 0.8, beidseitig: true,
        malen: (g, F) => bretter(g, F, 0, 0, F.w, F.h, ROT, 17) });
      /* Norden: kleines Fenster */
      M.flaeche({ name: "nord", o: [X1, Y0, ZT], u: [-1, 0, 0], v: [0, 0, -1], w: B, h: H, ao: true, traufe: 0.35,
        malen: wand("nord", B, H, (g, F) => fenster(g, F, 1.6, 0.7, 0.8, 0.8)), leuchten: (g, F) => fensterLicht(g, F, 1.6, 0.7, 0.8, 0.8) });
      /* Giebel Ost (zum Steg): Tür, Rettungsring, Laterne; Giebel West: Fenster */
      const giebel = [[0, HF], [T / 2, 0], [T, HF], [T, HF + H], [0, HF + H]];
      M.flaeche({ name: "ost", o: [X1, Y1, ZT + HF], u: [0, -1, 0], v: [0, 0, -1], w: T, h: H + HF, umriss: giebel, ao: true,
        malen: wand("ost", T, H + HF, (g, F) => { tuer(g, F, T / 2 - 0.45, HF + 0.45, 0.9, H - 0.45); ring(g, F, T - 0.5, HF + 1.0, 0.32); brett(g, F, 0.35, HF + 0.55, 0.28, 0.36, [40, 40, 42]); }),
        leuchten: (g, F) => { g.fillStyle = "rgba(255,210,140," + F.nacht.toFixed(3) + ")"; g.fillRect(0.39, HF + 0.6, 0.2, 0.26); F.leuchtPunkt(0.49, HF + 0.73, 2.6, "255,196,120", 1); } });
      /* Schild im Giebel über der Tür – vom Wasser und von der Wiese aus zu lesen */
      M.flaeche({ name: "schild", o: [X1 + 0.04, Y1 - (T - 2.5) / 2, ZT + 0.2], u: [0, -1, 0], v: [0, 0, -1], w: 2.5, h: 0.44, malen: schild });
      M.flaeche({ name: "west", o: [X0, Y0, ZT + HF], u: [0, 1, 0], v: [0, 0, -1], w: T, h: H + HF, umriss: giebel, ao: true,
        malen: wand("west", T, H + HF, (g, F) => fenster(g, F, T / 2 - 0.4, HF + 0.55, 0.8, 0.8)), leuchten: (g, F) => fensterLicht(g, F, T / 2 - 0.4, HF + 0.55, 0.8, 0.8) });
      /* ---------------- Dach ---------------- */
      M.teil("dach");
      const dach = (g, F) => { PI.biberschwanz(g, 0, 0, F.w, F.h, F, {}); if (winter) PI.schneeDach(g, 0, 0, F.w, F.h, F, {}); };
      M.satteldach({ x: X0, y: Y0, b: B, t: T, z: ZT, hf: HF, ueT: 0.35, ueG: 0.3, dicke: 0.16 }, dach, dach, { kante: "#ece6d8" });
      M.bodenlicht(X1 + 0.8, 0, 2.4, "255,196,120", 0.8);
    }
  });
})();
