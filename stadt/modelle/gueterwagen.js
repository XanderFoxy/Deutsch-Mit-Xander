/* =====================================================================
   BAUKASTEN-STADT — DREI GÜTERWAGEN (lebende Modelle, gebacken)
   ---------------------------------------------------------------------
   XANDER: „dass ich die Eisenbahn wieder hinten lang fahren [sehe] und
   die Eisenbahn brauchen wir auch unbedingt". Hinter der Dampflok
   (dampflok.js) laufen wie im alten gemalten Dorf drei Güterwagen:

   GEDECKTER GÜTERWAGEN (Gattung G, Bauart G 10): rotbrauner Holzkasten
     mit senkrechten Brettern und Stahlstreben, Schiebetür in der Mitte,
     Lüftungsklappen oben, flaches graues Tonnendach; 9,1 m über Puffer.
   RUNGENWAGEN (Gattung R): offener Wagen mit Holzboden und je fünf
     Stahlrungen, beladen mit Baumstämmen (Rinde, helle Schnittflächen,
     Ketten); 10,4 m über Puffer.
   KESSELWAGEN: silbergrauer Tank auf schwarzem Rahmen, Dom mit Laufsteg
     und Geländer, Leiter, Spannbänder; 9,4 m über Puffer. Er fährt am
     Zugschluss und trägt hinten die zwei roten Schlusslampen.
   Alle: zwei Achsen (Räder 1,0 m), Puffer und Schraubenkupplung an
   beiden Enden, Rahmen schwarz. Winter: Schnee auf Dach, Stämmen, Tank.
   Nacht: nur die Schlusslampen leuchten (rot).
   +y = vorn (Fahrtrichtung). Der Zugmaler (ST.zugMaler) steht in
   dampflok.js; die Modelldateien laden unabhängig voneinander, darum
   holen die Wagen ihn erst beim Malen.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const TAU = Math.PI * 2;
  const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const SCHWARZ = [44, 44, 48], SCHNEE = [246, 248, 252];

  /* Fahrwerk eines zweiachsigen Wagens: Langträger, Achshalter, Blattfedern, Räder, Puffer an beiden Enden */
  function fahrwerk(Mw, halb, achse, o) {
    o = o || {};
    const nah = Mw.nahSeite(), rgb = ST.zugFarbe;
    for (const y of [-achse, achse]) for (const sd of [-1, 1]) Mw.rad(sd, sd * 0.78, y, 0.5, { speichen: 0, farbe: [66, 66, 70] });
    for (const sd of [-1, 1]) {
      const sch = sd === nah ? 2 : 0, x = sd * 0.98;
      for (const y of [-achse, achse]) {
        /* Achshalter und Blattfeder */
        Mw.kasten(x - 0.07, x + 0.07, y - 0.22, y + 0.22, 0.3, 0.85, [40, 40, 42], { schicht: sch, bias: 0.3 });
        Mw.strich([[x + sd * 0.08, y - 0.75, 0.86], [x + sd * 0.08, y, 0.72], [x + sd * 0.08, y + 0.75, 0.86]], 0.07, rgb(Mw.licht([sd, 0, 0], [70, 70, 72])), { schicht: sch, bias: 0.35 });
      }
      /* Bremsgestänge */
      Mw.strich([[x * 0.9, -achse + 0.6, 0.55], [x * 0.9, achse - 0.6, 0.55]], 0.04, rgb(Mw.licht([sd, 0, 0], [60, 60, 62])), { schicht: sch, bias: 0.2 });
    }
    /* Langträger (U-Profil, außen sichtbar) und Kopfstücke */
    Mw.kasten(-1.2, 1.2, -halb, halb, 0.88, o.z1 || 1.22, o.rahmen || SCHWARZ, { schicht: 1, ohneOben: !!o.ohneOben });
    ST.zugPuffer(Mw, halb, 1); ST.zugPuffer(Mw, -halb, -1);
  }

  /* ---------------- G 10 ---------------- */
  const G_HALB = 4.0, G_X = 1.38, G_Z0 = 1.22, G_Z1 = 3.28;
  const ROTBRAUN = [128, 52, 38], DACH = [128, 130, 134];
  function gwagenBauen(Mw) {
    fahrwerk(Mw, G_HALB + 0.15, 2.0);
    /* Kasten: Bretterfugen senkrecht, Stahlstreben (Z-Streben in jeder Hälfte), Schiebetür */
    const bretter = [], hell = "rgba(60,20,14,0.55)", streb = "rgba(34,30,30,0.9)";
    for (let y = -G_HALB + 0.18; y < G_HALB; y += 0.18) bretter.push(y);
    const seite = (sd) => {
      const x = sd * (G_X + 0.005), L = [];
      for (const y of bretter) L.push([[x, y, G_Z0 + 0.05], [x, y, G_Z1 - 0.05], 0.012, hell]);
      for (const y of [-G_HALB + 0.06, -2.2, -1.0, 1.0, 2.2, G_HALB - 0.06]) L.push([[x, y, G_Z0], [x, y, G_Z1], 0.07, streb]);
      L.push([[x, -2.2, G_Z0 + 0.1], [x, -G_HALB + 0.1, G_Z1 - 0.1], 0.06, streb], [[x, 2.2, G_Z0 + 0.1], [x, G_HALB - 0.1, G_Z1 - 0.1], 0.06, streb]);
      L.push([[x, -G_HALB, G_Z0 + 0.03], [x, G_HALB, G_Z0 + 0.03], 0.07, streb], [[x, -G_HALB, G_Z1 - 0.03], [x, G_HALB, G_Z1 - 0.03], 0.06, streb]);
      return L;
    };
    const stirn = (sg) => { const y = sg * (G_HALB + 0.005), L = []; for (let x = -G_X + 0.18; x < G_X; x += 0.18) L.push([[x, y, G_Z0 + 0.05], [x, y, G_Z1 + 0.2], 0.012, hell]); L.push([[-G_X + 0.05, y, G_Z0 + 0.05], [G_X - 0.05, y, G_Z1 - 0.1], 0.06, streb], [[G_X - 0.05, y, G_Z0 + 0.05], [-G_X + 0.05, y, G_Z1 - 0.1], 0.06, streb]); return L; };
    Mw.kasten(-G_X, G_X, -G_HALB, G_HALB, G_Z0, G_Z1, ROTBRAUN, { ohneOben: true, linienR: seite(1), linienL: seite(-1), linienVorn: stirn(1), linienHinten: stirn(-1) });
    /* Stirnwand bis unter das Tonnendach (Giebelbogen) */
    const DN = 8, bogen = [];
    for (let i = 0; i <= DN; i++) { const u = -1 + 2 * i / DN; bogen.push([u * (G_X + 0.12), G_Z1 + 0.42 * (1 - u * u)]); }
    for (const sg of [-1, 1]) {
      const y = sg * G_HALB, pts = bogen.map((b) => [b[0] * G_X / (G_X + 0.12), y, b[1] - 0.02]);
      Mw.flaeche(sg > 0 ? pts.slice().reverse() : pts, ROTBRAUN, { n: [0, sg, 0], bias: 0.01 });
    }
    /* Schiebetür: etwas vorstehend, mit Laufschiene und Griff */
    for (const sd of [-1, 1]) {
      const x = sd * (G_X + 0.06), n = [sd, 0, 0];
      if (Mw.blick(n) < 0) continue;
      const L = [];
      for (let y = -0.95; y <= 0.95; y += 0.19) L.push([[x, y, G_Z0 + 0.08], [x, y, G_Z1 - 0.12], 0.012, "rgba(60,20,14,0.6)"]);
      L.push([[x, -0.95, G_Z0 + 0.6], [x, 0.95, G_Z1 - 0.3], 0.06, "rgba(34,30,30,0.9)"]);
      L.push([[x, 0.8, G_Z0 + 0.9], [x, 0.8, G_Z0 + 1.2], 0.05, "rgba(200,200,200,0.9)"]);
      Mw.flaeche(sd > 0 ? [[x, -1.0, G_Z0 + 0.04], [x, 1.0, G_Z0 + 0.04], [x, 1.0, G_Z1 - 0.06], [x, -1.0, G_Z1 - 0.06]] : [[x, 1.0, G_Z0 + 0.04], [x, -1.0, G_Z0 + 0.04], [x, -1.0, G_Z1 - 0.06], [x, 1.0, G_Z1 - 0.06]],
        [138, 58, 42], { n: n, bias: 0.15, linien: L });
      Mw.strich([[x + sd * 0.02, -2.1, G_Z1 - 0.02], [x + sd * 0.02, 2.1, G_Z1 - 0.02]], 0.06, "rgb(50,46,46)", { bias: 0.2 });
      /* Lüftungsklappen oben an den Ecken, Anschriftenfeld */
      for (const y of [-3.3, 3.3]) Mw.flaeche(sd > 0 ? [[x - sd * 0.05, y - 0.35, G_Z1 - 0.45], [x - sd * 0.05, y + 0.35, G_Z1 - 0.45], [x - sd * 0.05, y + 0.35, G_Z1 - 0.15], [x - sd * 0.05, y - 0.35, G_Z1 - 0.15]] : [[x - sd * 0.05, y + 0.35, G_Z1 - 0.45], [x - sd * 0.05, y - 0.35, G_Z1 - 0.45], [x - sd * 0.05, y - 0.35, G_Z1 - 0.15], [x - sd * 0.05, y + 0.35, G_Z1 - 0.15]], [96, 40, 30], { n: n, bias: 0.12 });
      Mw.flaeche(sd > 0 ? [[x - sd * 0.05, -3.0, G_Z0 + 0.25], [x - sd * 0.05, -1.7, G_Z0 + 0.25], [x - sd * 0.05, -1.7, G_Z0 + 0.7], [x - sd * 0.05, -3.0, G_Z0 + 0.7]] : [[x - sd * 0.05, -1.7, G_Z0 + 0.25], [x - sd * 0.05, -3.0, G_Z0 + 0.25], [x - sd * 0.05, -3.0, G_Z0 + 0.7], [x - sd * 0.05, -1.7, G_Z0 + 0.7]], [36, 34, 34], { n: n, bias: 0.12,
        linien: [[[x, -2.9, G_Z0 + 0.55], [x, -1.8, G_Z0 + 0.55], 0.03, "rgba(235,235,230,0.85)"], [[x, -2.9, G_Z0 + 0.4], [x, -2.1, G_Z0 + 0.4], 0.03, "rgba(235,235,230,0.85)"]] });
    }
    /* Tonnendach: grau, steht vorn und hinten über; Schnee im Winter */
    for (let i = 0; i < DN; i++) {
      const a = bogen[i], b = bogen[i + 1], n = norm([-(b[1] - a[1]), 0, b[0] - a[0]]);
      Mw.flaeche([[a[0], -G_HALB - 0.12, a[1]], [b[0], -G_HALB - 0.12, b[1]], [b[0], G_HALB + 0.12, b[1]], [a[0], G_HALB + 0.12, a[1]]], DACH, { n: n, bias: 0.2 });
      if (Mw.winter && i > 0 && i < DN - 1) Mw.flaeche([[a[0], -G_HALB - 0.05, a[1] + 0.08], [b[0], -G_HALB - 0.05, b[1] + 0.08], [b[0], G_HALB + 0.05, b[1] + 0.08], [a[0], G_HALB + 0.05, a[1] + 0.08]], SCHNEE, { n: n, bias: 0.24 });
    }
    for (const sg of [-1, 1]) {
      const y = sg * (G_HALB + 0.12), pts = bogen.map((b) => [b[0], y, b[1]]).concat([[G_X + 0.12, y, G_Z1 - 0.05], [-G_X - 0.12, y, G_Z1 - 0.05]].reverse());
      Mw.flaeche(sg > 0 ? pts.slice().reverse() : pts, [96, 98, 102], { n: [0, sg, 0], bias: 0.19 });
    }
    /* Bremserbühne mit Geländer an einem Ende */
    Mw.kasten(-1.3, 1.3, G_HALB, G_HALB + 0.12, 1.22, 1.3, [52, 50, 50], { bias: 0.05 });
    for (const sd of [-1, 1]) Mw.strich([[sd * 1.25, G_HALB + 0.08, 1.3], [sd * 1.25, G_HALB + 0.08, 2.3], [sd * 0.5, G_HALB + 0.08, 2.3]], 0.035, "rgb(60,60,62)", { bias: 0.3 });
  }

  /* ---------------- Rungenwagen mit Stämmen ---------------- */
  const R_HALB = 4.95, R_X = 1.4, R_BODEN = 1.3;
  const RINDE = [[108, 80, 56], [96, 72, 52], [118, 90, 62]], HOLZ = [212, 180, 128];
  function rungenBauen(Mw) {
    fahrwerk(Mw, R_HALB + 0.1, 2.75, { z1: R_BODEN, rahmen: [110, 44, 34], ohneOben: true });
    /* Holzboden */
    const L = []; for (let x = -R_X + 0.2; x < R_X; x += 0.2) L.push([[x, -R_HALB, R_BODEN + 0.01], [x, R_HALB, R_BODEN + 0.01], 0.01, "rgba(70,50,30,0.5)"]);
    Mw.kasten(-R_X, R_X, -R_HALB, R_HALB, R_BODEN - 0.1, R_BODEN, { seite: [110, 44, 34], stirn: [110, 44, 34], oben: [150, 118, 82] }, { schicht: 1, linienOben: L });
    /* Stämme: 3 + 2 + 1, ganz leicht verschieden lang */
    const stamm = (x, z, r, k) => {
      const y0 = -R_HALB + 0.35 + ST.hash2(k, 1, 9) * 0.3, y1 = R_HALB - 0.35 - ST.hash2(k, 2, 9) * 0.3;
      Mw.zylY(x, z, r, y0, y1, RINDE[k % 3], { n: 10, stuecke: 3, kappen: [HOLZ, HOLZ], bias: z * 0.01,
        kappenLinien: null });
      /* Jahresringe: dunkler Kreis auf der Schnittfläche */
      for (const [y, sg] of [[y0, -1], [y1, 1]]) Mw.scheibe([x, y + sg * 0.005, z], [0, sg, 0], r * 0.55, [184, 148, 96], { bias: z * 0.01 + 0.02, n: 10 });
      if (Mw.winter) Mw.zylY(x, z + 0.04, r * 0.98, y0 + 0.1, y1 - 0.1, SCHNEE, { n: 5, stuecke: 3, von: Math.PI * 0.25, bis: Math.PI * 0.75, bias: z * 0.01 + 0.03 });
    };
    const r = 0.3;
    let k = 0;
    for (const x of [-0.84, -0.28, 0.28, 0.84]) stamm(x, R_BODEN + r, r, k++);
    for (const x of [-0.56, 0, 0.56]) stamm(x, R_BODEN + r * 2.7, r, k++);
    for (const x of [-0.28, 0.28]) stamm(x, R_BODEN + r * 4.4, r * 0.95, k++);
    /* Rungen und Ketten */
    for (const y of [-4.4, -2.2, 0, 2.2, 4.4]) for (const sd of [-1, 1]) {
      const x = sd * (R_X - 0.02);
      Mw.kasten(x - 0.06, x + 0.06, y - 0.07, y + 0.07, R_BODEN - 0.1, R_BODEN + 1.55, [40, 40, 42], { bias: 0.4 });
    }
    for (const y of [-3.3, 3.3]) Mw.strich([[-R_X, y, R_BODEN + 1.2], [-0.8, y, R_BODEN + 2.25], [0, y, R_BODEN + 2.35], [0.8, y, R_BODEN + 2.25], [R_X, y, R_BODEN + 1.2]], 0.04, "rgb(70,70,74)", { bias: 0.6 });
  }

  /* ---------------- Kesselwagen ---------------- */
  const K_HALB = 4.05, K_R = 1.02, K_Z = 2.38;
  const TANK = [182, 186, 190];
  function kesselBauen(Mw, P) {
    fahrwerk(Mw, K_HALB + 0.2, 2.25);
    /* Sattel und Tank */
    for (const y of [-2.6, 2.6]) Mw.kasten(-1.0, 1.0, y - 0.2, y + 0.2, 1.22, 1.6, SCHWARZ, { bias: -0.1 });
    const baender = [{ y: -2.6, b: 0.06, f: "rgba(40,40,44,0.8)" }, { y: 2.6, b: 0.06, f: "rgba(40,40,44,0.8)" }, { y: -0.02, b: 0.03, f: "rgba(120,120,126,0.5)" }];
    Mw.zylY(0, K_Z, K_R, -K_HALB, K_HALB, TANK, { n: 22, stuecke: 4, linien: baender, kappen: [[168, 172, 176], [168, 172, 176]] });
    /* gewölbte Böden: ein flacher Kegel an jedem Ende */
    for (const sg of [-1, 1]) {
      const y = sg * K_HALB, n = 16;
      for (let i = 0; i < n; i++) {
        const u0 = i / n * TAU, u1 = (i + 1) / n * TAU, um = (u0 + u1) / 2;
        const pts = [[Math.cos(u0) * K_R, y, K_Z + Math.sin(u0) * K_R], [Math.cos(u1) * K_R, y, K_Z + Math.sin(u1) * K_R], [0, y + sg * 0.28, K_Z]];
        Mw.flaeche(sg > 0 ? pts : [pts[1], pts[0], pts[2]], [170, 174, 178], { n: norm([Math.cos(um) * 0.28, sg * K_R, Math.sin(um) * 0.28]), bias: 0.02 });
      }
    }
    /* Anschrift (dunkles Feld) */
    for (const sd of [-1, 1]) {
      const n = [sd, 0, 0]; if (Mw.blick(n) < 0) continue;
      const x = sd * (K_R + 0.01);
      Mw.flaeche(sd > 0 ? [[x, -1.8, K_Z - 0.18], [x, -0.5, K_Z - 0.18], [x, -0.5, K_Z + 0.18], [x, -1.8, K_Z + 0.18]] : [[x, -0.5, K_Z - 0.18], [x, -1.8, K_Z - 0.18], [x, -1.8, K_Z + 0.18], [x, -0.5, K_Z + 0.18]], [64, 70, 80], { n: n, bias: 0.1,
        linien: [[[x, -1.7, K_Z], [x, -0.6, K_Z], 0.05, "rgba(240,240,236,0.85)"]] });
    }
    /* Schnee oben auf dem Tank */
    if (Mw.winter) Mw.zylY(0, K_Z + 0.03, K_R, -K_HALB + 0.1, K_HALB - 0.1, SCHNEE, { n: 4, stuecke: 4, von: Math.PI * 0.3, bis: Math.PI * 0.7, bias: 0.05 });
    /* Dom mit Deckel, Laufsteg, Geländer, Leiter */
    Mw.zylZ(0, 0, 0.42, K_Z + K_R - 0.1, K_Z + K_R + 0.35, TANK, { kappe: [150, 154, 158], bias: 0.1 });
    Mw.zylZ(0, 0, 0.3, K_Z + K_R + 0.35, K_Z + K_R + 0.42, [120, 124, 128], { bias: 0.12 });
    Mw.kasten(-0.6, 0.6, -0.9, 0.9, K_Z + K_R - 0.02, K_Z + K_R + 0.03, [80, 80, 84], { bias: 0.08 });
    for (const sd of [-1, 1]) Mw.strich([[sd * 0.6, -0.9, K_Z + K_R + 0.03], [sd * 0.6, -0.9, K_Z + K_R + 0.85], [sd * 0.6, 0.9, K_Z + K_R + 0.85], [sd * 0.6, 0.9, K_Z + K_R + 0.03]], 0.035, "rgb(230,200,40)", { bias: 0.3 });
    for (const sd of [-1, 1]) {
      const x = sd * (K_R + 0.12);
      Mw.strich([[x, 0.25, 1.2], [x, 0.25, K_Z + 0.6]], 0.035, "rgb(90,90,94)", { bias: 0.2 });
      Mw.strich([[x, -0.25, 1.2], [x, -0.25, K_Z + 0.6]], 0.035, "rgb(90,90,94)", { bias: 0.2 });
      for (let z = 1.4; z < K_Z + 0.6; z += 0.3) Mw.strich([[x, -0.25, z], [x, 0.25, z]], 0.03, "rgb(90,90,94)", { bias: 0.21 });
    }
    /* Zugschluss: zwei rote Schlusslampen hinten (nachts leuchtend) */
    if (!(P && P.objekt && P.objekt.ohneSchluss)) {
      ST.zugLampe(Mw, -0.95, -K_HALB - 0.32, 1.5, -1, [255, 60, 44]);
      ST.zugLampe(Mw, 0.95, -K_HALB - 0.32, 1.5, -1, [255, 60, 44]);
      /* Zugschlussscheiben tagsüber: rot-weiß */
      if (Mw.nacht <= 0.4) for (const sd of [-1, 1]) Mw.scheibe([sd * 0.95, -K_HALB - 0.46, 1.86], [0, -1, 0], 0.16, [214, 40, 34], { bias: 0.1, n: 12,
        linien: [[[sd * 0.95 - 0.1, -K_HALB - 0.47, 1.86], [sd * 0.95 + 0.1, -K_HALB - 0.47, 1.86], 0.07, "rgba(245,245,240,0.95)"]] });
    }
  }

  function malenMit(bau) {
    return function (g, P) { const Mw = ST.zugMaler(P); bau(Mw, P); g.save(); Mw.malen(g); g.restore(); };
  }
  ST.modell("gwagen", { name: "Gedeckter Güterwagen (G 10)", gruppe: "Deko", versteckt: true, live: true, grund: [3.0, 9.1], hoehe: 3.8, zeichnen: malenMit(gwagenBauen) });
  ST.modell("rungenwagen", { name: "Rungenwagen mit Stämmen", gruppe: "Deko", versteckt: true, live: true, grund: [2.9, 10.4], hoehe: 3.3, zeichnen: malenMit(rungenBauen) });
  ST.modell("kesselwagen", { name: "Kesselwagen", gruppe: "Deko", versteckt: true, live: true, grund: [2.9, 9.4], hoehe: 3.9, zeichnen: malenMit(kesselBauen) });
})();
