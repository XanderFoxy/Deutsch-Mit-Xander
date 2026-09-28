/* =====================================================================
   GLEIS FÜR DIE PFERDEBAHN — Rillenschienen im Kopfsteinpflaster
   ---------------------------------------------------------------------
   XANDER: „Da gibt's auch Gleise im Stadtbild dafür … dass man dann auch
   entsprechend die Gleise für die Pferdebahn legt, damit die Pferdebahn
   auch weiß, wo sie lang fahren soll."

   Die vorhandene Gleisstrecke (bahnstrecke in bahnhof.js) ist ein
   Eisenbahngleis mit Schotterbett, Schwellen und Böschung, 13 m lang und
   erhöht – für ein Straßenbahngleis im Pflaster taugt sie nicht. Hier
   liegen die Schienen bündig im Pflaster wie am Döbelner Obermarkt:
   Meterspur (1000 mm zwischen den Schienenköpfen), Rillenschienen
   (blanker Kopf, dunkle Rille innen), neben jeder Schiene eine Reihe
   längs gelegter Läufersteine, dazwischen und außen Reihenpflaster aus
   rötlich-grauen Steinen mit Fugen, am Rand eine Zeile Randsteine.

   STÜCKE (vorn = +y, wie bei der Pferdebahn):
     gleis_pferdebahn         gerades Stück, 3 m breit, 4 m lang; die
                              Steinreihen haben 16 cm Teilung, deshalb
                              gehen aneinandergesetzte Stücke nahtlos
                              ineinander über. variante "kurve" = Bogen.
     gleis_pferdebahn_kurve   Viertelbogen, Radius 6 m (Gleismitte),
                              Grundfläche 7,5 × 7,5 m. Einfahrt am Rand
                              −y bei x = −2,25 (Richtung +y), Ausfahrt am
                              Rand +x bei y = +2,25 (Richtung +x). Linkskurve
                              = dasselbe Stück, um 90° gedreht und in
                              Gegenrichtung befahren.
   Für die Automatik: ST.gleisPferdebahn.weg(variante) gibt die
   Gleismitte als Punktliste (Modellraum) zurück.

   flach: true — liegt auf dem Boden; die Szene soll flache Stücke vor
   allen anderen Dingen malen (sonst kann ein Gleisstück über einem
   Fahrzeug liegen, das darauf steht). ueberall: true — man darf
   Fahrzeuge auf das Gleis stellen.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const TAU = Math.PI * 2;
  const rgb = (c, a) => a == null ? "rgb(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + ")" : "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + a + ")";

  const SPUR = 1.0, KOPF = 0.058, RILLE = 0.032;   // Meterspur, Schienenkopf, Rille
  const B = 3.0, L = 4.0, TEIL = 0.16;              // gerades Stück, Steinteilung
  const R = 6.0, KB = 1.5, KS = R + KB;             // Bogen: Radius, halbe Breite, Kachelgröße
  const STEINE = [[162, 128, 110], [148, 116, 100], [176, 142, 122], [138, 118, 108], [168, 150, 136], [124, 102, 90]];
  const FUGE = [70, 62, 56], KOPF_F = [150, 138, 126], ROST = [104, 76, 58];

  /* Ein Stein: leicht unregelmäßiges, abgerundetes Viereck mit Licht oben links */
  function stein(g, cx, cy, w, h, dreh, farbe, F, rng) {
    g.save(); g.translate(cx, cy); g.rotate(dreh);
    const r = Math.min(w, h) * 0.28, jx = (rng() - 0.5) * 0.012, jy = (rng() - 0.5) * 0.012;
    g.fillStyle = rgb(farbe);
    if (PI && PI.rundRechteck) { PI.rundRechteck(g, -w / 2 + jx, -h / 2 + jy, w, h, r); g.fill(); }
    else g.fillRect(-w / 2, -h / 2, w, h);
    if (F.px > 30) {
      /* gewölbte Oberfläche: hell oben links, dunkel unten rechts */
      g.fillStyle = "rgba(255,255,255,0.13)"; g.fillRect(-w / 2 + r * 0.5, -h / 2 + r * 0.4, w * 0.55, h * 0.3);
      g.fillStyle = "rgba(0,0,0,0.12)"; g.fillRect(-w / 2 + r * 0.4, h / 2 - h * 0.28, w - r * 0.8, h * 0.22);
    }
    g.restore();
  }
  function steinFarbe(rng, winter) {
    const c = STEINE[Math.floor(rng() * STEINE.length)], k = 0.9 + rng() * 0.2;
    return winter ? [c[0] * k * 0.9 + 20, c[1] * k * 0.9 + 22, c[2] * k * 0.9 + 28] : [c[0] * k, c[1] * k, c[2] * k];
  }
  /* Schnee: weiße Decke, auf den Schienen weggefahren (loecher fügt dem
     Pfad die freien Streifen hinzu, ausgeschnitten mit evenodd) */
  function schnee(g, F, w, h, loecher) {
    g.save();
    g.beginPath(); g.rect(-0.1, -0.1, w + 0.2, h + 0.2); loecher(g); g.clip("evenodd");
    g.fillStyle = "rgba(238,242,248,0.84)"; g.fillRect(0, 0, w, h);
    if (PI && F.px > 8) PI.rauschen(g, 0, 0, w, h, 1.4, 0.12, 71, 3);
    g.restore();
  }

  /* ---------------- Gerades Stück ---------------- */
  function geradeMalen(winter) {
    return (g, F) => {
      const w = F.w, h = F.h, mx = w / 2;
      const rng = ST.zufall(17);
      g.fillStyle = rgb(FUGE); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      const schienen = [-(SPUR / 2 + KOPF / 2), SPUR / 2 + KOPF / 2].map((x) => mx + x);
      if (F.px < 7) {
        g.fillStyle = "rgb(150,122,106)"; g.fillRect(0, 0, w, h);
        if (PI) PI.rauschen(g, 0, 0, w, h, 1.5, 0.25, 5, 3);
      } else {
        /* Reihenpflaster quer zum Gleis; Läufer längs neben den Schienen */
        const laeufer = [];
        for (const sx of schienen) laeufer.push([sx - KOPF / 2 - RILLE - 0.1, sx - KOPF / 2 - RILLE], [sx + KOPF / 2, sx + KOPF / 2 + 0.1]);
        for (let r = 0; r < Math.round(h / TEIL); r++) {
          const y = (r + 0.5) * TEIL;
          let x = -((r * 0.37) % 1) * 0.14;
          while (x < w) {
            const sw = 0.11 + rng() * 0.08;
            const a = Math.max(0, x), b = Math.min(w, x + sw);
            x += sw + 0.012;
            if (b - a < 0.03) continue;
            /* nicht in den Läuferstreifen und Schienen */
            let frei = true;
            for (const sx of schienen) if (b > sx - KOPF / 2 - RILLE - 0.1 && a < sx + KOPF / 2 + 0.1) frei = false;
            if (!frei) continue;
            const rand = a < 0.18 || b > w - 0.18;
            stein(g, (a + b) / 2, y, b - a, TEIL - 0.014, 0, rand ? [112, 104, 100] : steinFarbe(rng, winter), F, rng);
          }
        }
        for (const [a, b] of laeufer) {
          let y = -((a * 3.1) % 1) * 0.2;
          while (y < h) { const sl = 0.2 + rng() * 0.08; const y0 = Math.max(0, y), y1 = Math.min(h, y + sl); if (y1 - y0 > 0.03) stein(g, (a + b) / 2, (y0 + y1) / 2, b - a - 0.012, y1 - y0 - 0.012, 0, steinFarbe(rng, winter), F, rng); y += sl + 0.012; }
        }
        if (PI && F.px > 10) PI.rauschen(g, 0, 0, w, h, 1.3, 0.14, 9, 3);
      }
      if (winter) schnee(g, F, w, h, (p) => { for (const sx of schienen) p.rect(sx - KOPF / 2 - RILLE - 0.05, -0.1, KOPF + 2 * RILLE + 0.1, h + 0.2); });
      /* Schienen: Rille innen, Kopf mit blanker Lauffläche */
      for (const sx of schienen) {
        const innen = sx < mx ? 1 : -1;
        g.fillStyle = "rgb(34,30,28)"; g.fillRect(innen > 0 ? sx + KOPF / 2 : sx - KOPF / 2 - RILLE, 0, RILLE, h);
        g.fillStyle = rgb(ROST); g.fillRect(sx - KOPF / 2, 0, KOPF, h);
        g.fillStyle = rgb(KOPF_F); g.fillRect(sx - KOPF * 0.28, 0, KOPF * 0.56, h);
        if (F.px > 20) { g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(sx - KOPF * 0.1, 0, KOPF * 0.14, h); }
        if (F.px > 40) { g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(sx - KOPF / 2, 0, 0.006, h); g.fillRect(sx + KOPF / 2 - 0.006, 0, 0.006, h); }
      }
    };
  }

  /* ---------------- Viertelbogen ---------------- */
  /* Kachelraum: x0 = −KS/2, y0 = −KS/2; Bogenmitte (Mittelpunkt) bei (R, 0) in
     Kachelkoordinaten ab der Einfahrt: Einfahrt (0, 0) → Ausfahrt (R, R).
     In Flächenkoordinaten (Ursprung links oben = Modell (−KS/2, −KS/2)):
     Mittelpunkt M = (KB + R, 0) … die Einfahrt liegt bei fx = KB, fy = 0. */
  const MX = KB + R, MY = 0;
  function bogenUmriss() {
    const um = [];
    for (let i = 0; i <= 24; i++) { const t = Math.PI - i / 24 * Math.PI / 2; um.push([MX + Math.cos(t) * (R + KB), MY + Math.sin(t) * (R + KB)]); }
    for (let i = 24; i >= 0; i--) { const t = Math.PI - i / 24 * Math.PI / 2; um.push([MX + Math.cos(t) * (R - KB), MY + Math.sin(t) * (R - KB)]); }
    return um;
  }
  function bogenMalen(winter) {
    return (g, F) => {
      const rng = ST.zufall(23);
      g.fillStyle = rgb(FUGE); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      const radien = [R - SPUR / 2 - KOPF / 2, R + SPUR / 2 + KOPF / 2];
      const t0 = Math.PI / 2, t1 = Math.PI;       // Winkelbereich (Flächenkoordinaten, y nach unten = +y Modell)
      if (F.px < 7) {
        g.fillStyle = "rgb(150,122,106)"; g.fillRect(0, 0, F.w, F.h);
      } else {
        /* Segmentpflaster: Steine in Ringen um den Bogenmittelpunkt */
        const n = Math.round(2 * KB / TEIL);
        for (let k = 0; k < n; k++) {
          const r = R - KB + (k + 0.5) * TEIL;
          let lauf = false;
          for (const rs of radien) if (Math.abs(r - rs) < KOPF / 2 + RILLE + 0.1) lauf = true;
          if (lauf) continue;
          const rand = k === 0 || k === n - 1;
          let t = t0 + ((k * 0.29) % 1) * 0.02;
          while (t < t1) {
            const sw = (0.11 + rng() * 0.08) / r;
            const a = Math.max(t0, t), b = Math.min(t1, t + sw);
            t += sw + 0.012 / r;
            if ((b - a) * r < 0.03) continue;
            const m = (a + b) / 2;
            stein(g, MX + Math.cos(m) * r, MY + Math.sin(m) * r, TEIL - 0.014, (b - a) * r, m, rand ? [112, 104, 100] : steinFarbe(rng, winter), F, rng);
          }
        }
        /* Läufer entlang der Schienen */
        for (const rs of radien) for (const [d0, d1] of [[-KOPF / 2 - RILLE - 0.1, -KOPF / 2 - RILLE], [KOPF / 2, KOPF / 2 + 0.1]]) {
          const r = rs + (d0 + d1) / 2;
          let t = t0;
          while (t < t1) { const sl = (0.2 + rng() * 0.08) / r; const a = t, b = Math.min(t1, t + sl); const m = (a + b) / 2; if ((b - a) * r > 0.03) stein(g, MX + Math.cos(m) * r, MY + Math.sin(m) * r, d1 - d0 - 0.012, (b - a) * r - 0.012, m, steinFarbe(rng, winter), F, rng); t += sl + 0.012 / r; }
        }
        if (PI && F.px > 10) PI.rauschen(g, 0, 0, F.w, F.h, 1.3, 0.14, 13, 3);
      }
      const bogen = (h2, r, b) => { h2.lineWidth = b; h2.beginPath(); h2.arc(MX, MY, r, t0, t1); h2.stroke(); };
      if (winter) schnee(g, F, F.w, F.h, (p) => {
        for (const rs of radien) { const ra = rs + KOPF / 2 + RILLE + 0.05, ri = rs - KOPF / 2 - RILLE - 0.05; p.moveTo(MX + Math.cos(t0 - 0.1) * ra, MY + Math.sin(t0 - 0.1) * ra); p.arc(MX, MY, ra, t0 - 0.1, t1 + 0.1); p.arc(MX, MY, ri, t1 + 0.1, t0 - 0.1, true); p.closePath(); }
      });
      for (const rs of radien) {
        const innen = rs < R ? 1 : -1;
        g.strokeStyle = "rgb(34,30,28)"; bogen(g, rs + innen * (KOPF / 2 + RILLE / 2), RILLE);
        g.strokeStyle = rgb(ROST); bogen(g, rs, KOPF);
        g.strokeStyle = rgb(KOPF_F); bogen(g, rs, KOPF * 0.56);
        if (F.px > 20) { g.strokeStyle = "rgba(255,255,255,0.35)"; bogen(g, rs, KOPF * 0.14); }
      }
    };
  }

  /* Gleismitte als Punktliste (für die Automatik der Pferdebahn) */
  ST.gleisPferdebahn = {
    SPUR: SPUR, LAENGE: L, BREITE: B, RADIUS: R, KACHEL: KS,
    weg(variante) {
      if (variante === "kurve") {
        const p = [];
        for (let i = 0; i <= 16; i++) { const t = Math.PI - i / 16 * Math.PI / 2; p.push([-KS / 2 + MX + Math.cos(t) * R, -KS / 2 + MY + Math.sin(t) * R]); }
        return p;
      }
      return [[0, -L / 2], [0, L / 2]];
    }
  };

  function bauen(M, o, kurve) {
    const winter = o.jahr === "winter";
    M.teil("gleis", { ebene: -5, schatten: false, mitte: [0, 0, 0] });
    if (kurve) M.flaeche({ name: "bogen", o: [-KS / 2, -KS / 2, 0.012], u: [1, 0, 0], v: [0, 1, 0], w: KS, h: KS, umriss: bogenUmriss(), malen: bogenMalen(winter), keinAo: true });
    else M.flaeche({ name: "gerade", o: [-B / 2, -L / 2, 0.012], u: [1, 0, 0], v: [0, 1, 0], w: B, h: L, malen: geradeMalen(winter), keinAo: true });
  }
  ST.modell("gleis_pferdebahn", {
    name: "Pferdebahngleis", gruppe: "Deko", grund: [B, L], hoehe: 0.1, bauzeit: 30, flach: true, ueberall: true,
    bauen(M, o) { bauen(M, o, o.variante === "kurve"); }
  });
  ST.modell("gleis_pferdebahn_kurve", {
    name: "Pferdebahngleis (Bogen)", gruppe: "Deko", grund: [KS, KS], hoehe: 0.1, bauzeit: 45, flach: true, ueberall: true,
    bauen(M, o) { bauen(M, o, true); }
  });
})();
