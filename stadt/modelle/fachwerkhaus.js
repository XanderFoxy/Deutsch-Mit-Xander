/* =====================================================================
   FACHWERKHAUS — fränkisch-hessisches Bürgerhaus mit Zierfachwerk
   ---------------------------------------------------------------------
   XANDER: „fang mit einem Detail an, mit einem Fachwerkhaus … so geil
   wie möglich und noch geiler als das."
   „Richtig filigran. Richtig schön ausarbeiten mit schönen Texturen."
   „Das soll keine Comic Grafik sein. Das soll noch viel mehr am
   Realismus dran sein."

   Vorbild: Marktplatzhäuser in Miltenberg, Rothenburg, Bad Wimpfen.
   Traufständig (Traufe zur Straße = Süden, +y), hoher Sockel aus rotem
   Mainsandstein, Erdgeschoss und Obergeschoss in Fachwerk, das
   Obergeschoss kragt rundum 40 cm vor (Balkenköpfe, Füllhölzer,
   Knaggen), der Giebel kragt noch einmal 25 cm vor. Steiles Satteldach
   (52°) mit Aufschiebling an der Traufe, Biberschwanz-Doppeldeckung,
   zwei Schleppgauben, Kamin auf dem First.

   MASSE (Meter, Mitte des Grundrisses = 0,0,0)
     Sockel      9,1 × 7,1 m, 0,80 m hoch
     Erdgeschoss 9,0 × 7,0 m, 2,80 m (Schwelle, Ständer, Rähm)
     Balkenlage  0,24 m, Auskragung 0,40 m
     Obergeschoss 9,8 × 7,8 m, 2,70 m
     Dachbalken  0,22 m, Giebelauskragung 0,25 m
     First       12,24 m (Ziegeloberfläche), Kamin bis 13,5 m

   WIE ES GEBAUT IST
     • Jede Wand wird in ihrem eigenen Koordinatensystem gemalt: Gefache
       (einzeln verputzt, leicht gewölbt, Risse, Begleitstrich), Hölzer
       (Maserung, Risse, Holznägel, leicht unregelmäßige Kanten), Fenster
       mit echter Laibungstiefe (Parallaxe aus dem Blickwinkel).
     • Was wirklich vorsteht, ist ein eigener Körper: Balkenköpfe,
       Füllhölzer, Knaggen, Fensterbänke, Blumenkästen, Treppe, Gauben,
       Kamin, Rinne, Fallrohr, Schnee mit dickem Rand.
     • Die Reihenfolge (hinten zuerst) kommt aus den Mittelpunkten der
       Teile: Angebautes liegt immer „Wirt + Normale·δ", dann stimmt es
       in jedem Drehwinkel.
     • Bauphasen (o.bau 0…1): Baugrube, Fundament, Sockel Lage für Lage,
       offenes Fachwerk-Gerippe, Ausfachen, Obergeschoss, Dachstuhl mit
       Richtbaum, Lattung, Ziegel Reihe für Reihe, Ausbau.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const hex = PI.hex, rgb = PI.rgb, misch = PI.misch, hell = PI.hell;

  /* ---------------- kleine Werkzeuge ---------------- */
  const klemm = (x, a, b) => (x < a ? a : x > b ? b : x);
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const kreuz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const Z = [0, 0, 1];
  const RAD = Math.PI / 180;

  /* ---------------- Hauptmaße ---------------- */
  const S0 = 0.80;                 // Sockelhöhe
  const SV = 0.05;                 // Sockelvorsprung
  const XE = 4.5, YE = 3.5;        // Erdgeschoss (Außenseite Fachwerk)
  const ZE0 = S0, ZE1 = 3.60;      // EG unten / oben
  const KR = 0.40;                 // Stockwerksauskragung
  const XO = XE + KR, YO = YE + KR;
  const ZB1 = 3.84;                // Oberkante Balkenlage = Unterkante OG
  const ZO1 = 6.54;                // Oberkante OG
  const KG = 0.25;                 // Giebelauskragung
  const XG = XO + KG;              // Giebelwand
  const ZD = 6.76;                 // Oberkante Dachbalkenlage
  const NEIG = 52 * RAD, TN = Math.tan(NEIG);
  const DICKE = 0.30;              // Dachaufbau senkrecht zur Fläche
  const DV = DICKE / Math.cos(NEIG);
  const ZF = ZD + DV + YO * TN;    // First (Ziegeloberfläche) ≈ 12,24
  const YK = 3.40;                 // Knick zum Aufschiebling
  const ZK = ZF - YK * TN;
  const NA = 32 * RAD, TA = Math.tan(NA);
  const YT = 4.45;                 // Traufkante
  const ZT = ZK - (YT - YK) * TA;
  const UEG = 0.30;                // Ortgangüberstand
  const XD = XG + UEG;             // Dachkante x
  const ZGS = ZF - DV;             // Giebelspitze (Unterseite Dach)
  const dachZ = (y) => { const a = Math.abs(y); return a <= YK ? ZF - a * TN : ZK - (a - YK) * TA; };

  /* =====================================================================
     BLICK: aus welcher Richtung schaut die Kamera auf das Modell?
     bauen() kennt den Drehwinkel nicht – eine unsichtbare Figur, die als
     allererste gemalt wird, merkt ihn sich. Damit rechnen Laibungen,
     Baugrube und Parallaxe in jedem Winkel richtig.
     ===================================================================== */
  function neuerBlick() { return { c: 1, s: 0, e: [0.6124, 0.6124, 0.5] }; }
  function blickSetzen(B, gier) {
    const r = gier * RAD, c = Math.cos(r), s = Math.sin(r);
    B.c = c; B.s = s;
    B.e = [0.6124 * (c + s), 0.6124 * (c - s), 0.5];
  }
  /* Versatz eines Punkts in der Tiefe d (hinter der Fläche, d>0) in Flächenkoordinaten */
  function parallaxe(F, B, d) {
    const f = F.flaeche, u = f.u, v = f.v, n = kreuz(u, v);
    const en = Math.max(0.12, dot(B.e, n));
    return [d * dot(B.e, u) / en, d * dot(B.e, v) / en];
  }

  /* =====================================================================
     FLÄCHEN-HILFEN
     ===================================================================== */
  /* Rechteck mit Mittelpunkt c, Normale n, Richtung u (v = n × u) */
  function rechteck(M, c, n, u, w, h, malen, extra) {
    n = nrm(n); u = nrm(u);
    const v = kreuz(n, u);
    const o = sub(sub(c, mul(u, w / 2)), mul(v, h / 2));
    return M.flaeche(Object.assign({ o: o, u: u, v: v, w: w, h: h, malen: malen }, extra || {}));
  }
  /* Senkrechte Fläche mit Normale n (waagerecht), o = linke obere Ecke von außen */
  function wandFlaeche(M, o, n, w, h, malen, extra) {
    const u = kreuz(n, Z);
    return M.flaeche(Object.assign({ o: o, u: u, v: [0, 0, -1], w: w, h: h, malen: malen }, extra || {}));
  }
  /* Kasten mit beliebiger Achse: von P0 nach P1, Breite bb entlang B, Tiefe
     entlang D von d0 bis d1. seiten: welche Flächen (+B,-B,+D,-D,a,e). */
  function stab(M, P0, P1, B, bb, D, d0, d1, mal, opt) {
    opt = opt || {};
    const ax = sub(P1, P0), L = Math.hypot(ax[0], ax[1], ax[2]);
    if (L < 1e-4) return;
    const U = mul(ax, 1 / L);
    const mid = add(P0, mul(ax, 0.5));
    const dm = (d0 + d1) / 2, dt = d1 - d0;
    const e = opt.ebene || 0;
    const zeige = opt.seiten || "BbDdae";
    const ex = (x) => Object.assign({ keinAo: true, ebene: e }, opt.extra || {}, x || {});
    /* Vorder- und Rückseite (±D) */
    if (zeige.indexOf("D") >= 0) rechteck(M, add(mid, mul(D, d1)), D, U, L, bb, mal("D", L, bb), ex({ ebene: e + (opt.dEbene == null ? 2 : opt.dEbene) }));
    if (zeige.indexOf("d") >= 0) rechteck(M, add(mid, mul(D, d0)), mul(D, -1), U, L, bb, mal("d", L, bb), ex({ ebene: e + (opt.dEbene == null ? 2 : opt.dEbene) }));
    /* Seiten (±B) */
    if (zeige.indexOf("B") >= 0) rechteck(M, add(add(mid, mul(B, bb / 2)), mul(D, dm)), B, U, L, dt, mal("B", L, dt), ex());
    if (zeige.indexOf("b") >= 0) rechteck(M, add(add(mid, mul(B, -bb / 2)), mul(D, dm)), mul(B, -1), U, L, dt, mal("b", L, dt), ex());
    /* Enden */
    if (zeige.indexOf("a") >= 0) rechteck(M, add(P0, mul(D, dm)), mul(U, -1), B, bb, dt, mal("a", bb, dt), ex());
    if (zeige.indexOf("e") >= 0) rechteck(M, add(P1, mul(D, dm)), U, B, bb, dt, mal("e", bb, dt), ex());
  }

  /* Licht selbst auftragen (für Flächen mit durchsichtigen Stellen):
     nur innerhalb des aktuellen Clips, der genau das Gemalte umfasst. */
  function lichtAuf(g, F, x, y, w, h) {
    const lf = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
    g.globalCompositeOperation = "multiply";
    g.fillStyle = "rgb(" + Math.round(lf[0] * 255) + "," + Math.round(lf[1] * 255) + "," + Math.round(lf[2] * 255) + ")";
    g.fillRect(x, y, w, h);
    g.globalCompositeOperation = "source-over";
  }
  function lichtRGB(F) { return ST.lichtFaktor(F.n, F.zeit, 0, F.jahr); }

  /* Vieleck als Pfad */
  function poly(g, p) { g.beginPath(); g.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]); g.closePath(); }

  /* =====================================================================
     FARBEN UND VARIANTEN (über o.saat)
     ===================================================================== */
  const HOLZ = [
    { name: "dunkelbraun", f: "#3e2c22", roh: "#b08a5e" },
    { name: "ochsenblut", f: "#6a2a20", roh: "#b08a5e" },
    { name: "graublau", f: "#4a5866", roh: "#b08a5e" }
  ];
  const PUTZ = ["#efebe2", "#efe4c9", "#ead3a2"];
  const LADEN = ["#2f5a3c", "#7a2c24", "#3b5877", "#55624a", "#2d4b57"];
  const TUER = ["#5a2e1c", "#2e4a3a", "#6a2922", "#34465c", "#4a3524"];
  const NAMEN = ["Weber", "Müller", "Schneider", "Fischer", "Wagner", "Becker", "Hoffmann", "Schäfer", "Koch", "Bauer",
    "Richter", "Klein", "Wolf", "Schröder", "Neumann", "Schwarz", "Zimmermann", "Braun", "Krüger", "Hartmann",
    "Lange", "Schmitt", "Werner", "Krause", "Meier", "Lehmann", "Huber", "Kaiser", "Fuchs", "Vogel", "Seitz", "Endres"];
  function varianten(o) {
    const r = ST.zufall(((o.saat || 7) * 2654435761) >>> 0);
    r(); r();
    const holz = HOLZ[Math.floor(r() * HOLZ.length)];
    const putz = PUTZ[Math.floor(r() * PUTZ.length)];
    let laden = LADEN[Math.floor(r() * LADEN.length)];
    if (holz.name === "graublau" && laden === "#3b5877") laden = "#2f5a3c";
    const tuer = TUER[Math.floor(r() * TUER.length)];
    const nummer = 1 + Math.floor(r() * 38);
    const name = NAMEN[Math.floor(r() * NAMEN.length)];
    const jahr = 1612 + Math.floor(r() * 150);
    return { holz: holz, putz: putz, laden: laden, tuer: tuer, nummer: nummer, name: name, jahr: jahr, r: r };
  }

  /* =====================================================================
     MODELL
     ===================================================================== */
  ST.modell("fachwerkhaus", {
    name: "Fachwerkhaus", gruppe: "Häuser", grund: [10.4, 9.6], hoehe: 13.5, bauzeit: 15 * 60,
    bauen(M, o) {
      const B = neuerBlick();
      M.teil("blick", { ebene: -90, schatten: false, mitte: [0, 0, 0] });
      M.figur({ x: 0, y: 0, z: 0, breite: 0.01, hoehe: 0.01, schatten: false, malen(g, s, F) { if (!F.schatten && F.gier != null) blickSetzen(B, F.gier); } });

      const V = varianten(o);
      const holzF = V.holz.f, putzF = V.putz;
      const flach = (f) => f;

      /* Sockel */
      M.teil("sockel", { mitte: [0, 0, 0.4] });
      M.quader({ x: -XE - SV, y: -YE - SV, z: 0, b: 2 * (XE + SV), t: 2 * (YE + SV), h: S0 }, { sued: "#a8705f", nord: "#a8705f", ost: "#a8705f", west: "#a8705f", oben: "#9a6a5a" });
      /* Erdgeschoss */
      M.teil("eg", { mitte: [0, 0, 2.2] });
      M.quader({ x: -XE, y: -YE, z: ZE0, b: 2 * XE, t: 2 * YE, h: ZE1 - ZE0 }, { sued: putzF, nord: putzF, ost: putzF, west: putzF }, { traufe: 0.4 });
      /* Balkenlage */
      M.teil("band1", { mitte: [0, 0, 3.72] });
      M.quader({ x: -XO, y: -YO, z: ZE1, b: 2 * XO, t: 2 * YO, h: ZB1 - ZE1 }, { sued: holzF, nord: holzF, ost: holzF, west: holzF });
      /* Obergeschoss */
      M.teil("og", { mitte: [0, 0, 5.2] });
      M.quader({ x: -XO, y: -YO, z: ZB1, b: 2 * XO, t: 2 * YO, h: ZO1 - ZB1 }, { sued: putzF, nord: putzF, ost: putzF, west: putzF }, { traufe: 0.55 });
      /* Dachbalkenlage (Giebelseiten) */
      M.teil("band2", { mitte: [0, 0, 6.65] });
      for (const sg of [1, -1]) {
        const x0 = sg > 0 ? XO : -XG;
        M.quader({ x: x0, y: -YO, z: ZO1, b: KG, t: 2 * YO, h: ZD - ZO1 }, sg > 0 ? { ost: holzF, sued: holzF, nord: holzF } : { west: holzF, sued: holzF, nord: holzF });
      }
      wandFlaeche(M, [-XO, YO, ZD], [0, 1, 0], 2 * XO, ZD - ZO1, holzF);
      wandFlaeche(M, [XO, -YO, ZD], [0, -1, 0], 2 * XO, ZD - ZO1, holzF);
      /* Giebel */
      M.teil("giebel", { mitte: [0, 0, 7.0] });
      const gh = ZGS - ZD;
      for (const sg of [1, -1]) {
        const n = [sg, 0, 0];
        const o0 = [sg * XG, sg * YO, ZGS];
        wandFlaeche(M, o0, n, 2 * YO, gh, putzF, { umriss: [[0, gh], [YO, 0], [2 * YO, gh]] });
      }
      /* Dach */
      for (const sy of [1, -1]) {
        M.teil(sy > 0 ? "dachS" : "dachN", { mitte: [0, sy * 0.5, 10] });
        const u = [sy, 0, 0];
        /* Hauptfläche: First → Knick */
        const oM = [-sy * XD, 0, ZF];
        M.flaeche({ name: "dach" + sy, o: oM, u: u, v: [0, sy * YK, ZK - ZF], w: 2 * XD, h: Math.hypot(YK, ZF - ZK), malen: "#9c4a31" });
        const oA = [-sy * XD, sy * YK, ZK];
        M.flaeche({ name: "aufsch" + sy, o: oA, u: u, v: [0, sy * (YT - YK), ZT - ZK], w: 2 * XD, h: Math.hypot(YT - YK, ZK - ZT), malen: "#a4553a" });
        /* Traufbrett */
        wandFlaeche(M, [-sy * XD, sy * YT, ZT], [0, sy, 0], 2 * XD, 0.2, "#4a3224");
      }
      /* Ortgang */
      M.teil("ortgang", { mitte: [0, 0, 10.2] });
      for (const sx of [1, -1]) {
        const pts = [[-YT, ZT], [-YK, ZK], [0, ZF], [YK, ZK], [YT, ZT]];
        const w = 2 * YT;
        /* in Flächenkoordinaten: u = n × Z */
        const n = [sx, 0, 0], u = kreuz(n, Z);
        const o0 = [sx * XD, -u[1] * YT, ZF];
        const um = [];
        for (const [yy, zz] of pts) um.push([(yy - o0[1]) * u[1], ZF - zz]);
        for (let i = pts.length - 1; i >= 0; i--) um.push([(pts[i][0] - o0[1]) * u[1], ZF - pts[i][1] + 0.22]);
        wandFlaeche(M, o0, n, w, 5.9, "#4a3224", { umriss: um });
      }
      /* Kamin */
      M.teil("kamin", { ebene: 1 });
      M.quader({ x: 0.2, y: -0.3, z: ZF - 0.5, b: 0.6, t: 0.6, h: 1.8 }, { sued: "#8c4a3a", ost: "#8c4a3a", west: "#8c4a3a", nord: "#8c4a3a", oben: "#333" });
      void flach;
    }
  });
})();
