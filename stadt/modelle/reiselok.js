/* =====================================================================
   BAUKASTEN-STADT — DIE SCHÖNE ALTE LOK MIT KLASSISCHEN WAGEN
   ---------------------------------------------------------------------
   FASSUNG 818 — XANDER (wörtlich): „unser Lok sieht nicht mehr so schön
   wie vorher aus die war viel detaillierter diese schöne alte Lok die
   wir … in der Vektorgrafik bei den Reisen hier im Chat … haben … diese
   schönen klassischen Wagen daran".

   VORBILD ist die Reiselok im Chat (app.js lcLokSeiteSvg, lcLokWagen):
   ein schwarz lackierter Kessel mit Messingbändern und Handläufen, ein
   hoher Schlot mit Krempe, Dampfdom und Sanddom aus Messing, die runde
   Rauchkammer mit Tür, Kreuz und Griff, die Laterne vorn, rote Puffer-
   bohle, Zylinder, ein Führerhaus mit gewölbtem Dach – und große rote
   Speichenräder mit Gegengewicht und Kuppelstange. Dahinter der Tender
   (Kohle vorn, Messingdeckel hinten) und Abteilwagen in Weinrot mit
   Goldlinie, Oberlichtdach, Fenstern mit Reisenden und zwei Dreh-
   gestellen.

   Etwas mehr Wirklichkeit dazu (Länderbahn-Personenzuglok, 1'B, um
   1895): Nietreihen an Kessel, Rauchkammer, Führerhaus und Tender,
   messinggefasste Radkästen über den Treibrädern, Kreuzkopf, Treib- und
   Kuppelstange, Sicherheitsventile und Pfeife aus Messing, Sandfall-
   rohre, rote Innenrahmen.

   MASSE (Meter, Mitte = 0,0,0 auf Schienenoberkante; +y = vorn)
     Lok       10,9 m über Puffer, Kessel Ø 1,6 m (Mitte 2,35 m),
               Schlot bis 4,55 m, Treibräder Ø 1,9 m, Laufrad Ø 1,0 m
     Tender    6,6 m, drei Achsen (Ø 1,0 m)
     Wagen     12,4 m über Puffer, Kasten 2,8 m breit, Oberlicht bis
               4,15 m, zwei zweiachsige Drehgestelle (Ø 0,92 m)
   RÄDER: die Lok wird in sechs Radstellungen gebacken (o._m.ph = 0 … 5/6
   einer Umdrehung) – Speichen, Gegengewichte, Kurbelzapfen, Treib- und
   Kuppelstange bewegen sich mit; bahn.js wählt die Stellung nach dem
   gefahrenen Weg (rollen ohne Rutschen).
   NACHT: Laternen hell, im Führerhaus das Feuer, in den Wagen warmes
   Licht in den Fenstern (mit den Schemen der Reisenden).
   WINTER: Schnee auf Führerhausdach, Tenderkohle und Wagendächern.
   Den Schatten wirft die Stadt selbst (stadt-leicht/bahn.js).
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const TAU = Math.PI * 2;
  const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const rgbS = (f, a) => (a == null ? "rgb(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + ")" : "rgba(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + "," + a + ")");

  /* Farben wie im Chat: Lack fast schwarz, Messing, Rot der Räder und Bohle, Weinrot der Wagen, Gold der Linien */
  const LACK = [34, 38, 46], LACK_H = [58, 64, 76], MESSING = [214, 170, 72], MESSING_D = [150, 112, 40];
  const ROT = [150, 32, 30], ROT_D = [104, 24, 22], STAHL = [168, 170, 176], GRAPHIT = [52, 54, 60];
  const WEINROT = [112, 30, 40], GOLD = [231, 187, 78], DACH = [48, 52, 58], OBERLICHT = [62, 66, 72], CREME = [233, 220, 184];
  const SCHNEE = [246, 248, 252];
  const LAMPE_AUS = [214, 218, 206], LAMPE_AN = [255, 244, 196];

  /* Radstellung: 0 … 1 einer Umdrehung (aus dem Backlauf: o._m.ph), vorwärts rollend */
  const phaseVon = (P) => (P && P.objekt && P.objekt._m ? P.objekt._m.ph || 0 : 0);

  function lampe(Mw, x, y, z, sgn, gross) {
    const k = gross || 1;
    Mw.kasten(x - 0.15 * k, x + 0.15 * k, y - 0.13 * k, y + 0.13 * k, z - 0.17 * k, z + 0.17 * k, LACK, { bias: 0.04 });
    Mw.zylZ(x, y, 0.07 * k, z + 0.17 * k, z + 0.3 * k, LACK, { n: 8, bias: 0.05 });
    const an = Mw.nacht > 0.4;
    Mw.scheibe([x, y + sgn * 0.135 * k, z], [0, sgn, 0], 0.1 * k, an ? LAMPE_AN : LAMPE_AUS, { hell: an, bias: 0.08, n: 12 });
    Mw.scheibe([x, y + sgn * 0.14 * k, z], [0, sgn, 0], 0.125 * k, MESSING, { bias: 0.07, n: 12 });
    Mw.scheibe([x, y + sgn * 0.145 * k, z], [0, sgn, 0], 0.095 * k, an ? LAMPE_AN : LAMPE_AUS, { hell: an, bias: 0.09, n: 12 });
  }

  /* ================= DIE LOK ================= */
  const Y_VORN = 5.45, Y_HINTEN = -5.45;
  const KZ0 = 2.72, KR = 0.8, K_Y0 = -2.5, K_Y1 = 3.75, RK_Y1 = 4.85, RK_R = 0.86;
  const TREIB = [1.05, -1.25], TR_R = 0.95, LAUF_Y = 3.85, LAUF_R = 0.5, SCHLEPP_Y = -4.05, SCHLEPP_R = 0.55;
  const KURBEL = 0.36;                 // Kurbelradius
  const FH = { y0: -5.25, y1: -2.5, z0: 1.95, z1: 4.08, x: 1.42 };
  const ZYL = { y0: 3.35, y1: 4.55, z: 1.0, r: 0.36, x: 1.08 };
  function lokBauen(Mw, P) {
    const nah = Mw.nahSeite();
    const ph = phaseVon(P), dreh = -ph * TAU;
    /* --- Innenrahmen (rot) --- */
    Mw.kasten(-0.5, 0.5, -5.1, 5.2, 0.5, 1.28, ROT, { schicht: 1 });
    /* --- Räder --- */
    for (const sd of [-1, 1]) {
      const d0 = dreh + (sd > 0 ? Math.PI / 2 : 0);          // rechte Seite eilt 90° vor
      Mw.rad(sd, sd * 0.78, LAUF_Y, LAUF_R, { speichen: 10, dreh: dreh * TR_R / LAUF_R, farbe: ROT, kante: [236, 232, 222] });
      Mw.rad(sd, sd * 0.78, SCHLEPP_Y, SCHLEPP_R, { speichen: 10, dreh: dreh * TR_R / SCHLEPP_R, farbe: ROT, kante: [236, 232, 222] });
      for (const y of TREIB) Mw.rad(sd, sd * 0.78, y, TR_R, { speichen: 16, gegen: true, dreh: d0, farbe: ROT, kante: [236, 232, 222], breite: 0.16 });
    }
    /* --- Kurbeltrieb je Seite: Zylinder, Kolbenstange, Kreuzkopf, Treib- und Kuppelstange --- */
    for (const sd of [-1, 1]) {
      const sch = sd === nah ? 2 : 0, x = sd * 0.97;
      const w = dreh + (sd > 0 ? Math.PI / 2 : 0);
      /* Kurbelzapfen (auf dem Rad: Winkel w + 90° gegenüber dem Gegengewicht) */
      const zapfen = TREIB.map((y) => [x + sd * 0.1, y + Math.cos(w + Math.PI / 2 + 0.2) * KURBEL, TR_R + Math.sin(w + Math.PI / 2 + 0.2) * KURBEL]);
      /* Kuppelstange */
      Mw.strich([zapfen[0], zapfen[1]], 0.1, ST.zugFarbe(Mw.licht([sd, 0, 0], STAHL)), { schicht: sch, bias: 0.5 });
      for (const z of zapfen) Mw.scheibe(z, [sd, 0, 0], 0.07, MESSING, { schicht: sch, bias: 0.55, n: 8 });
      /* Kreuzkopf: bewegt sich längs, je nach Kurbelstellung */
      const lang = 2.25, yK = zapfen[0][1] + Math.sqrt(Math.max(0.1, lang * lang - (ZYL.z - zapfen[0][2]) * (ZYL.z - zapfen[0][2])));
      Mw.strich([[x + sd * 0.12, yK, ZYL.z], zapfen[0]], 0.12, ST.zugFarbe(Mw.licht([sd, 0, 0], [186, 188, 194])), { schicht: sch, bias: 0.6 });
      Mw.kasten(x + sd * 0.12 - 0.07, x + sd * 0.12 + 0.07, yK - 0.18, yK + 0.18, ZYL.z - 0.12, ZYL.z + 0.12, STAHL, { schicht: sch, bias: 0.45 });
      /* Gleitbahn und Kolbenstange */
      Mw.strich([[x + sd * 0.12, 2.35, ZYL.z + 0.16], [x + sd * 0.12, ZYL.y0, ZYL.z + 0.16]], 0.05, ST.zugFarbe(Mw.licht([sd, 0, 0], STAHL)), { schicht: sch, bias: 0.4 });
      Mw.strich([[x + sd * 0.12, yK, ZYL.z], [x + sd * 0.12, ZYL.y0, ZYL.z]], 0.05, ST.zugFarbe(Mw.licht([sd, 0, 0], [200, 200, 204])), { schicht: sch, bias: 0.42 });
      /* Zylinder: schwarz mit Messingdeckeln, Nieten */
      Mw.zylY(sd * ZYL.x, ZYL.z, ZYL.r, ZYL.y0, ZYL.y1, LACK, { n: 14, stuecke: 1, schicht: sch, bias: 0.2, kappen: [MESSING_D, MESSING_D] });
      Mw.strich([[sd * (ZYL.x + ZYL.r * 0.95), ZYL.y0 + 0.08, ZYL.z + 0.15], [sd * (ZYL.x + ZYL.r * 0.95), ZYL.y1 - 0.08, ZYL.z + 0.15]], 0.035, "rgba(255,255,255,0.18)", { schicht: sch, bias: 0.25 });
      Mw.kasten(sd * ZYL.x - 0.24, sd * ZYL.x + 0.24, ZYL.y0 + 0.1, ZYL.y1 - 0.1, ZYL.z + 0.3, ZYL.z + 0.5, LACK, { schicht: sch, bias: 0.22 });
      /* Sandfallrohre vor die Treibräder */
      for (const y of TREIB) Mw.strich([[sd * 1.05, y + 0.95, 1.9], [sd * 0.88, y + 0.98, 0.25]], 0.035, ST.zugFarbe(Mw.licht([sd, 0, 0], [70, 70, 74])), { schicht: sch, bias: 0.5 });
    }
    /* --- Pufferbohle rot, Puffer, Kupplung, Bahnräumer, zwei Lampen --- */
    Mw.kasten(-1.5, 1.5, Y_VORN - 0.22, Y_VORN, 0.72, 1.42, { seite: ROT, stirn: ROT, oben: LACK });
    ST.zugPuffer(Mw, Y_VORN, 1, { huelse: LACK });
    Mw.flaeche([[-0.95, Y_VORN + 0.02, 0.72], [0.95, Y_VORN + 0.02, 0.72], [0.55, Y_VORN + 0.35, 0.1], [-0.55, Y_VORN + 0.35, 0.1]], GRAPHIT, { n: norm([0, 0.9, 0.35]), bias: 0.03 });
    lampe(Mw, -0.95, Y_VORN - 0.05, 1.62, 1, 0.9); lampe(Mw, 0.95, Y_VORN - 0.05, 1.62, 1, 0.9);
    /* --- Umlauf (Laufblech) hoch über den Treibrädern, mit rotem Rand: so sieht man die großen Räder ganz --- */
    for (const sd of [-1, 1]) {
      const x0 = sd > 0 ? 0.5 : -1.36, x1 = sd > 0 ? 1.36 : -0.5;
      Mw.kasten(x0, x1, -2.5, Y_VORN - 0.22, 1.92, 2.02, { seite: ROT_D, stirn: ROT_D, oben: GRAPHIT }, { bias: -0.2 });
      Mw.strich([[sd * 1.37, -2.45, 1.92], [sd * 1.37, Y_VORN - 0.3, 1.92]], 0.03, ST.zugFarbe(Mw.licht([sd, 0, 0], MESSING)), { bias: -0.15 });
      /* Stützen des Umlaufs vorn und Aufstiegstritt */
      Mw.kasten(sd * 1.2 - 0.05, sd * 1.2 + 0.05, Y_VORN - 0.6, Y_VORN - 0.4, 1.42, 1.92, LACK, { bias: -0.25 });
    }
    /* --- Kessel: Lack mit Glanz, Messingbänder, Nietreihen, Handläufe --- */
    const baender = [-1.7, -0.3, 1.9, 3.1].map((y) => ({ y: y, b: 0.07, f: rgbS(MESSING) }));
    Mw.zylY(0, KZ0, KR, K_Y0, K_Y1, LACK, { n: 22, linien: baender });
    Mw.strich([[-0.28, K_Y0 + 0.1, KZ0 + KR * 0.96], [-0.28, K_Y1 - 0.1, KZ0 + KR * 0.96]], 0.07, "rgba(190,205,225,0.28)", { bias: 0.12 });
    for (const sd of [-1, 1]) {
      /* Nietreihen längs der Kesselschüsse (je Seite) und an den Bandkanten */
      const n = [sd * 0.87, 0, 0.5], pts = [];
      for (let y = K_Y0 + 0.15; y < K_Y1 - 0.1; y += 0.22) pts.push([sd * KR * 0.87, y, KZ0 + KR * 0.5]);
      Mw.nieten(pts, 0.025, [70, 74, 84], { n: norm(n), bias: 0.15 });
      /* Handlauf aus Messing auf Stützen */
      const hx = sd * (KR + 0.12), hz = KZ0 + 0.42;
      Mw.strich([[hx, K_Y0 + 0.1, hz], [hx, RK_Y1 - 0.2, hz]], 0.035, ST.zugFarbe(Mw.licht([sd, 0, 0.5], MESSING)), { bias: 0.3 });
      for (const y of [-2.0, -0.6, 0.8, 2.2, 3.6]) Mw.strich([[sd * KR * 0.92, y, hz], [hx, y, hz]], 0.03, ST.zugFarbe(Mw.licht([sd, 0, 0.5], MESSING_D)), { bias: 0.29 });
    }
    /* --- Rauchkammer mit runder Tür, Kreuz, Griff, Nieten, Nummernschild --- */
    Mw.zylY(0, KZ0, RK_R, K_Y1, RK_Y1, LACK, { n: 22, stuecke: 1 });
    Mw.scheibe([0, RK_Y1 + 0.01, KZ0], [0, 1, 0], RK_R, LACK, { bias: 0.01, n: 28 });
    Mw.scheibe([0, RK_Y1 + 0.06, KZ0], [0, 1, 0], 0.66, LACK_H, { bias: 0.02, n: 28,
      linien: [[[0, RK_Y1 + 0.08, KZ0 - 0.6], [0, RK_Y1 + 0.08, KZ0 + 0.6], 0.05, "rgba(20,22,26,0.9)"], [[-0.6, RK_Y1 + 0.08, KZ0], [0.6, RK_Y1 + 0.08, KZ0], 0.05, "rgba(20,22,26,0.9)"]] });
    Mw.scheibe([0, RK_Y1 + 0.12, KZ0], [0, 1, 0], 0.11, MESSING, { bias: 0.05, n: 12 });
    {
      const pts = []; for (let i = 0; i < 18; i++) { const a = i / 18 * TAU; pts.push([Math.cos(a) * 0.74, RK_Y1 + 0.03, KZ0 + Math.sin(a) * 0.74]); }
      Mw.nieten(pts, 0.03, [80, 84, 94], { n: [0, 1, 0], bias: 0.04 });
      const rp = []; for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI; rp.push([Math.cos(a) * (RK_R + 0.01), K_Y1 + 0.1, KZ0 + Math.sin(a) * (RK_R + 0.01)]); }
      Mw.nieten(rp, 0.028, [80, 84, 94], { n: [0, 0, 1], bias: 0.1 });
    }
    Mw.flaeche([[-0.28, RK_Y1 + 0.1, KZ0 - 0.4], [0.28, RK_Y1 + 0.1, KZ0 - 0.4], [0.28, RK_Y1 + 0.1, KZ0 - 0.26], [-0.28, RK_Y1 + 0.1, KZ0 - 0.26]], MESSING, { n: [0, 1, 0], bias: 0.07,
      linien: [[[-0.22, RK_Y1 + 0.11, KZ0 - 0.33], [0.22, RK_Y1 + 0.11, KZ0 - 0.33], 0.03, "rgba(40,30,10,0.9)"]] });
    /* Rauchkammerträger */
    Mw.kasten(-0.72, 0.72, K_Y1 + 0.1, RK_Y1 - 0.1, 1.28, KZ0 - 0.55, LACK, { bias: -0.3 });
    /* --- Schlot mit Krempe (hoch wie im Chat), Laterne oben an der Rauchkammer --- */
    Mw.zylZ(0, 4.3, 0.27, KZ0 + 0.7, 4.55, LACK, { r1: 0.3, kappe: false, bias: 0.1, n: 16 });
    Mw.zylZ(0, 4.3, 0.3, 4.55, 4.9, LACK, { r1: 0.46, kappe: [14, 14, 16], bias: 0.12, n: 16 });
    Mw.zylZ(0, 4.3, 0.47, 4.87, 4.93, MESSING, { kappe: [14, 14, 16], bias: 0.13, n: 16 });
    Mw.strich([[-0.12, 4.3 + 0.26, KZ0 + 0.9], [-0.1, 4.3 + 0.29, 4.5]], 0.05, "rgba(190,205,225,0.25)", { bias: 0.14 });
    lampe(Mw, 0, RK_Y1 - 0.05, KZ0 + RK_R + 0.25, 1, 1.15);
    /* --- Dampfdom und Sanddom aus Messing, Sicherheitsventile, Pfeife --- */
    Mw.zylZ(0, 0.75, 0.44, KZ0 + 0.55, KZ0 + 1.2, MESSING, { kuppel: 0.3, bias: 0.1, n: 22 });
    Mw.zylZ(0, 0.75, 0.52, KZ0 + 0.6, KZ0 + 0.82, MESSING_D, { bias: 0.09, n: 16 });
    Mw.strich([[-0.3, 0.75 + 0.25, KZ0 + 0.85], [-0.24, 0.75 + 0.2, KZ0 + 1.37]], 0.06, "rgba(255,248,210,0.6)", { bias: 0.15 });
    Mw.zylZ(0, -1.15, 0.34, KZ0 + 0.55, KZ0 + 1.0, MESSING, { kuppel: 0.22, bias: 0.1, n: 20 });
    Mw.zylZ(0, -1.15, 0.4, KZ0 + 0.6, KZ0 + 0.78, MESSING_D, { bias: 0.09, n: 14 });
    Mw.strich([[-0.24, -1.15 + 0.18, KZ0 + 0.8], [-0.18, -1.15 + 0.14, KZ0 + 1.13]], 0.05, "rgba(255,248,210,0.6)", { bias: 0.15 });
    for (const dx of [-0.13, 0.13]) Mw.zylZ(dx, -2.2, 0.06, KZ0 + 0.75, KZ0 + 1.1, MESSING, { n: 8, bias: 0.12 });
    Mw.zylZ(0.35, -2.4, 0.05, FH.z1 - 0.05, FH.z1 + 0.5, MESSING, { n: 8, bias: 0.13, kuppel: 0.06 });
    /* --- Führerhaus: Lack, rote Zierlinie, Fenster mit Rundbogen, gewölbtes Dach, runde Stirnfenster --- */
    const glut = Mw.nacht > 0.4;
    const glas = glut ? [255, 176, 92] : [70, 90, 112];
    Mw.kasten(-FH.x, FH.x, FH.y0, FH.y1, FH.z0, FH.z1, LACK, { ohneOben: true, bias: 0.05 });
    for (const sd of [-1, 1]) {
      const x = sd * (FH.x + 0.01), n = [sd, 0, 0];
      if (Mw.blick(n) < 0) continue;
      /* Seitenfenster mit Rundbogen */
      for (const [ya, yb] of [[-4.75, -3.95]]) {
        const pts = [[x, ya, 2.95], [x, yb, 2.95]];
        for (let i = 0; i <= 8; i++) { const a = i / 8 * Math.PI; pts.push([x, (ya + yb) / 2 - Math.cos(a) * (yb - ya) / 2 * -1 * -1, 3.1 + Math.sin(a) * (yb - ya) / 2]); }
        const poly = [[x, ya, 2.95], [x, yb, 2.95]].concat(Array.from({ length: 9 }, (_, i) => { const a = i / 8 * Math.PI; return [x, (ya + yb) / 2 + Math.cos(a) * (yb - ya) / 2, 3.5 + Math.sin(a) * (yb - ya) / 2]; }));
        Mw.flaeche(sd > 0 ? poly : poly.slice().reverse(), glas, { n: n, bias: 0.1, hell: glut });
        Mw.strich(poly.concat([poly[0]]).map((p) => [p[0] + sd * 0.01, p[1], p[2]]), 0.05, ST.zugFarbe(Mw.licht(n, MESSING)), { bias: 0.12 });
      }
      /* Türöffnung, Zierlinien, Griffstangen */
      Mw.flaeche(sd > 0 ? [[x, -3.55, 2.0], [x, -2.9, 2.0], [x, -2.9, 3.45], [x, -3.55, 3.45]] : [[x, -2.9, 2.0], [x, -3.55, 2.0], [x, -3.55, 3.45], [x, -2.9, 3.45]], [18, 18, 20], { n: n, bias: 0.09 });
      Mw.strich([[x, FH.y0 + 0.08, 2.1], [x, FH.y0 + 0.08, 3.95], [x, -3.7, 3.95], [x, -3.7, 2.1], [x, FH.y0 + 0.08, 2.1]], 0.035, "rgba(200,50,40,0.9)", { bias: 0.11 });
      Mw.strich([[x + sd * 0.03, -3.6, 1.4], [x + sd * 0.03, -3.6, 3.4]], 0.03, ST.zugFarbe(Mw.licht(n, MESSING)), { bias: 0.13 });
      Mw.strich([[x + sd * 0.03, -2.85, 1.4], [x + sd * 0.03, -2.85, 3.4]], 0.03, ST.zugFarbe(Mw.licht(n, MESSING)), { bias: 0.13 });
      /* Nieten an den Kanten des Führerhauses */
      const np = []; for (let y = FH.y0 + 0.1; y < FH.y1; y += 0.2) np.push([x, y, FH.z0 + 0.08]);
      for (let z = FH.z0 + 0.25; z < FH.z1 - 0.1; z += 0.2) np.push([x, FH.y1 - 0.06, z]);
      Mw.nieten(np, 0.022, [70, 74, 84], { n: n, bias: 0.12 });
    }
    /* Stirnwand: zwei runde Fenster mit Messingrand */
    for (const sd of [-1, 1]) {
      const c = [sd * 0.98, FH.y1 + 0.01, 3.55];
      Mw.scheibe(c, [0, 1, 0], 0.26, MESSING, { bias: 0.1, n: 16 });
      Mw.scheibe([c[0], c[1] + 0.01, c[2]], [0, 1, 0], 0.2, glas, { bias: 0.11, n: 16, hell: glut });
    }
    /* Dach: gewölbt, steht über, Regenleiste */
    const dach = [], DN = 8;
    for (let i = 0; i <= DN; i++) { const u = -1 + 2 * i / DN; dach.push([u * (FH.x + 0.14), FH.z1 + 0.38 * (1 - u * u)]); }
    for (let i = 0; i < DN; i++) {
      const a = dach[i], b = dach[i + 1], nx = -(b[1] - a[1]), nz = b[0] - a[0];
      Mw.flaeche([[a[0], FH.y0 - 0.15, a[1]], [b[0], FH.y0 - 0.15, b[1]], [b[0], FH.y1 + 0.2, b[1]], [a[0], FH.y1 + 0.2, a[1]]], [44, 46, 52], { n: norm([nx, 0, nz]), bias: 0.2 });
      if (Mw.winter) Mw.flaeche([[a[0] * 0.95, FH.y0 - 0.08, a[1] + 0.08], [b[0] * 0.95, FH.y0 - 0.08, b[1] + 0.08], [b[0] * 0.95, FH.y1 + 0.12, b[1] + 0.08], [a[0] * 0.95, FH.y1 + 0.12, a[1] + 0.08]], SCHNEE, { n: norm([nx, 0, nz]), bias: 0.24 });
    }
    for (const [y, sg] of [[FH.y0 - 0.15, -1], [FH.y1 + 0.2, 1]]) {
      const pts = dach.map((d) => [d[0], y, d[1]]).concat([[FH.x + 0.14, y, FH.z1 - 0.06], [-FH.x - 0.14, y, FH.z1 - 0.06]].reverse());
      Mw.flaeche(sg > 0 ? pts.slice().reverse() : pts, [30, 32, 36], { n: [0, sg, 0], bias: 0.19 });
    }
    Mw.flaeche([[FH.x, Y_HINTEN + 0.2, 1.95], [-FH.x, Y_HINTEN + 0.2, 1.95], [-FH.x, Y_HINTEN + 0.2, 2.6], [FH.x, Y_HINTEN + 0.2, 2.6]], [26, 26, 28], { n: [0, -1, 0], bias: -0.1 });
    Mw.kasten(-FH.x, FH.x, Y_HINTEN, FH.y0, 1.25, 1.95, LACK, { bias: -0.2 });
    Mw.kasten(-FH.x, FH.x, FH.y0, FH.y1, 1.25, 1.95, ROT_D, { bias: -0.25, ohneOben: true });
    Mw.kasten(-1.45, 1.45, Y_HINTEN, Y_HINTEN + 0.18, 0.72, 1.35, { seite: ROT, stirn: ROT, oben: LACK });
    for (const sd of [-1, 1]) for (const z of [0.6, 1.05, 1.5]) Mw.kasten(sd * FH.x - 0.12, sd * FH.x + 0.12, -3.4, -3.0, z, z + 0.07, [60, 60, 62], { bias: 0.1 });
    if (glut) Mw.flaeche([[-0.8, -3.2, 1.97], [0.8, -3.2, 1.97], [0.8, -2.6, 1.97], [-0.8, -2.6, 1.97]], [255, 150, 60], { n: [0, 0, 1], hell: true, alpha: 0.7, bias: 0.5 });
  }

  /* ================= DER TENDER ================= */
  const T_Y = 3.05, T_X = 1.38, T_Z0 = 1.3, T_Z1 = 3.05;
  function tenderBauen(Mw, P) {
    const nah = Mw.nahSeite();
    const dreh = -phaseVon(P) * TAU * 1.9;
    for (const y of [-2.0, 0, 2.0]) for (const sd of [-1, 1]) Mw.rad(sd, sd * 0.78, y, 0.5, { speichen: 10, farbe: ROT, dreh: dreh, kante: [236, 232, 222] });
    /* Außenrahmen mit Achshaltern und Federn */
    for (const sd of [-1, 1]) {
      const sch = sd === nah ? 2 : 0, x = sd * 1.0;
      Mw.flaeche(sd > 0 ? [[x, -T_Y + 0.1, 0.55], [x, T_Y - 0.1, 0.55], [x, T_Y - 0.1, 1.0], [x, -T_Y + 0.1, 1.0]] : [[x, T_Y - 0.1, 0.55], [x, -T_Y + 0.1, 0.55], [x, -T_Y + 0.1, 1.0], [x, T_Y - 0.1, 1.0]], ROT_D, { n: [sd, 0, 0], schicht: sch, bias: 0.3 });
      for (const y of [-2.0, 0, 2.0]) {
        Mw.kasten(x - 0.06, x + 0.06, y - 0.16, y + 0.16, 0.32, 0.72, GRAPHIT, { schicht: sch, bias: 0.4 });
        Mw.strich([[x + sd * 0.07, y - 0.6, 0.98], [x + sd * 0.07, y, 0.82], [x + sd * 0.07, y + 0.6, 0.98]], 0.07, ST.zugFarbe(Mw.licht([sd, 0, 0], [70, 70, 74])), { schicht: sch, bias: 0.45 });
      }
    }
    Mw.kasten(-1.3, 1.3, -T_Y - 0.1, T_Y + 0.1, 1.0, T_Z0, LACK, { schicht: 1 });
    /* Kasten: Lack, Goldlinie als Rahmen der Seitenwand (wie im Chat), Nieten */
    Mw.kasten(-T_X, T_X, -T_Y, T_Y, T_Z0, T_Z1, LACK, { ohneOben: true });
    for (const sd of [-1, 1]) {
      const x = sd * (T_X + 0.01), n = [sd, 0, 0];
      if (Mw.blick(n) < 0) continue;
      Mw.strich([[x, -T_Y + 0.25, T_Z0 + 0.25], [x, T_Y - 0.25, T_Z0 + 0.25], [x, T_Y - 0.25, T_Z1 - 0.25], [x, -T_Y + 0.25, T_Z1 - 0.25], [x, -T_Y + 0.25, T_Z0 + 0.25]], 0.05, ST.zugFarbe(Mw.licht(n, GOLD)), { bias: 0.1 });
      const np = []; for (let y = -T_Y + 0.1; y < T_Y; y += 0.22) { np.push([x, y, T_Z1 - 0.08]); np.push([x, y, T_Z0 + 0.08]); }
      Mw.nieten(np, 0.022, [70, 74, 84], { n: n, bias: 0.12 });
      Mw.strich([[x, -T_Y + 0.15, T_Z1 - 0.5], [x, T_Y - 0.15, T_Z1 - 0.5]], 0.06, "rgba(190,205,225,0.18)", { bias: 0.09 });
    }
    /* Wasserkasten hinten mit Messingdeckel, Kohle vorn (Aufsatzbleche) */
    Mw.flaeche([[-T_X, -T_Y, T_Z1], [T_X, -T_Y, T_Z1], [T_X, -0.6, T_Z1], [-T_X, -0.6, T_Z1]], [44, 46, 52], { n: [0, 0, 1] });
    Mw.zylZ(0, -1.9, 0.36, T_Z1, T_Z1 + 0.14, MESSING, { bias: 0.05, n: 14, kappe: MESSING_D });
    if (Mw.winter) Mw.flaeche([[-T_X + 0.05, -T_Y + 0.05, T_Z1 + 0.02], [T_X - 0.05, -T_Y + 0.05, T_Z1 + 0.02], [T_X - 0.05, -0.65, T_Z1 + 0.02], [-T_X + 0.05, -0.65, T_Z1 + 0.02]], SCHNEE, { n: [0, 0, 1], bias: 0.03 });
    for (const sd of [-1, 1]) {
      const x = sd * T_X, pts = [[x, -0.6, T_Z1], [x, T_Y, T_Z1], [x, T_Y, T_Z1 + 0.4], [x, -0.35, T_Z1 + 0.4]];
      Mw.flaeche(sd > 0 ? pts : pts.slice().reverse(), LACK, { n: [sd, 0, 0], innen: [30, 30, 34], bias: 0.1 });
    }
    Mw.flaeche([[T_X, -0.6, T_Z1], [-T_X, -0.6, T_Z1], [-T_X, -0.6, T_Z1 + 0.4], [T_X, -0.6, T_Z1 + 0.4]], LACK, { n: [0, -1, 0], innen: [30, 30, 34], bias: 0.05 });
    const kohle = [], KXn = 9, KYn = 12;
    const hoehe = (i, j) => { const u = i / KXn * 2 - 1, v = j / KYn; return T_Z1 + 0.3 + 0.38 * (1 - u * u) * Math.sin(Math.min(1, v * 1.25) * Math.PI * 0.9) + (ST.hash2(i, j, 51) - 0.5) * 0.1; };
    for (let j = 0; j <= KYn; j++) { kohle.push([]); for (let i = 0; i <= KXn; i++) kohle[j].push([(-1 + 2 * i / KXn) * (T_X - 0.05), -0.55 + (T_Y - 0.05 + 0.55) * j / KYn, hoehe(i, j)]); }
    for (let j = 0; j < KYn; j++) for (let i = 0; i < KXn; i++) {
      const a = kohle[j][i], b = kohle[j][i + 1], c = kohle[j + 1][i + 1], d = kohle[j + 1][i];
      const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
      let n = norm([u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]);
      if (n[2] < 0) n = n.map((q) => -q);
      const hk = ST.hash2(i, j, 77);
      Mw.flaeche([a, b, c, d], hk < 0.4 ? [30, 30, 34] : hk < 0.8 ? [42, 42, 48] : [64, 64, 72], { n: n, bias: 0.2 });
      if (Mw.winter && ST.hash2(i, j, 91) < 0.7) Mw.flaeche([a, b, c, d].map((p) => [p[0], p[1], p[2] + 0.03]), [242, 245, 250], { n: n, bias: 0.22, alpha: 0.85 });
    }
    /* Werkzeugkasten vorn, Leiter hinten, Puffer an beiden Enden */
    Mw.kasten(-1.35, 1.35, T_Y - 0.05, T_Y + 0.2, 1.3, 1.85, LACK, { bias: 0.02 });
    for (const sd of [-1, 1]) Mw.strich([[sd * 0.5, -T_Y - 0.03, 1.2], [sd * 0.5, -T_Y - 0.03, T_Z1]], 0.035, ST.zugFarbe(Mw.licht([0, -1, 0], MESSING_D)), { bias: 0.1 });
    for (let z = 1.5; z < T_Z1; z += 0.35) Mw.strich([[-0.5, -T_Y - 0.03, z], [0.5, -T_Y - 0.03, z]], 0.03, ST.zugFarbe(Mw.licht([0, -1, 0], MESSING_D)), { bias: 0.11 });
    Mw.kasten(-1.45, 1.45, -T_Y - 0.22, -T_Y, 0.8, 1.35, { seite: ROT, stirn: ROT, oben: LACK });
    ST.zugPuffer(Mw, -T_Y - 0.22, -1, { huelse: LACK });
  }

  /* ================= DER ABTEILWAGEN ================= */
  const W_Y = 5.9, W_X = 1.4, W_Z0 = 1.25, W_Z1 = 3.35, OB = { z: 3.72, h: 0.38, x: 0.62 };
  const BOGIE = [-3.9, 3.9], ACHS = 0.95;
  function wagenBauen(Mw, P) {
    const nah = Mw.nahSeite();
    const dreh = -phaseVon(P) * TAU * 2;
    /* Drehgestelle: vier Räder, Rahmen, Federn */
    for (const yb of BOGIE) {
      for (const dy of [-ACHS, ACHS]) for (const sd of [-1, 1]) Mw.rad(sd, sd * 0.78, yb + dy, 0.46, { speichen: 10, farbe: [58, 58, 62], dreh: dreh, kante: [210, 206, 198] });
      for (const sd of [-1, 1]) {
        const sch = sd === nah ? 2 : 0, x = sd * 0.98;
        Mw.flaeche(sd > 0 ? [[x, yb - 1.45, 0.5], [x, yb + 1.45, 0.5], [x, yb + 1.3, 0.88], [x, yb - 1.3, 0.88]] : [[x, yb + 1.45, 0.5], [x, yb - 1.45, 0.5], [x, yb - 1.3, 0.88], [x, yb + 1.3, 0.88]], [30, 32, 36], { n: [sd, 0, 0], schicht: sch, bias: 0.3 });
        Mw.strich([[x + sd * 0.06, yb - 0.75, 0.95], [x + sd * 0.06, yb, 0.8], [x + sd * 0.06, yb + 0.75, 0.95]], 0.08, ST.zugFarbe(Mw.licht([sd, 0, 0], [80, 80, 84])), { schicht: sch, bias: 0.4 });
      }
    }
    Mw.kasten(-1.25, 1.25, -W_Y + 0.15, W_Y - 0.15, 0.95, W_Z0, [30, 32, 36], { schicht: 1 });
    /* Kasten: Weinrot, Goldlinien oben und unten, Fenster mit Reisenden, Türen an den Enden */
    Mw.kasten(-W_X, W_X, -W_Y + 0.15, W_Y - 0.15, W_Z0, W_Z1, WEINROT, { ohneOben: true });
    const licht = Mw.nacht > 0.4;
    for (const sd of [-1, 1]) {
      const x = sd * (W_X + 0.01), n = [sd, 0, 0];
      if (Mw.blick(n) < 0) continue;
      const zl = (z) => [[x, -W_Y + 0.3, z], [x, W_Y - 0.3, z]];
      Mw.strich(zl(W_Z1 - 0.28), 0.05, ST.zugFarbe(Mw.licht(n, GOLD)), { bias: 0.1 });
      Mw.strich(zl(1.95), 0.05, ST.zugFarbe(Mw.licht(n, GOLD)), { bias: 0.1 });
      Mw.strich(zl(W_Z0 + 0.12), 0.04, ST.zugFarbe(Mw.licht(n, GOLD)), { bias: 0.1 });
      Mw.strich([[x, -W_Y + 0.4, W_Z1 - 0.62], [x, W_Y - 0.4, W_Z1 - 0.62]], 0.06, "rgba(255,210,210,0.12)", { bias: 0.09 });
      /* sieben Fenster (Abteile), Rundungen oben, cremefarbene Rahmen */
      const FN = 7, fb = 0.78, fa = 1.42;
      for (let i = 0; i < FN; i++) {
        const ym = (i - (FN - 1) / 2) * fa, y0 = ym - fb / 2, y1 = ym + fb / 2;
        const poly = [[x, y0, 2.18], [x, y1, 2.18], [x, y1, 2.95], [x, y1 - 0.12, 3.05], [x, y0 + 0.12, 3.05], [x, y0, 2.95]];
        Mw.flaeche(sd > 0 ? poly : poly.slice().reverse(), CREME, { n: n, bias: 0.11 });
        const inn = poly.map((p) => [x + sd * 0.005, p[1] + (p[1] < ym ? 0.07 : -0.07), p[2] + (p[2] < 2.5 ? 0.07 : -0.07)]);
        Mw.flaeche(sd > 0 ? inn : inn.slice().reverse(), licht ? [255, 214, 140] : [36, 50, 62], { n: n, bias: 0.12, hell: licht });
        /* Spiegelung bei Tag */
        if (!licht) Mw.strich([[x + sd * 0.01, y0 + 0.15, 2.3], [x + sd * 0.01, y0 + 0.45, 2.9]], 0.05, "rgba(210,230,245,0.35)", { bias: 0.13 });
        /* Reisende: Schemen hinter dem Glas (Kopf und Schultern) */
        if (ST.hash2(i, sd + 3, 17) < 0.62) {
          const yk = ym + (ST.hash2(i, 5, 19) - 0.5) * 0.3, f = licht ? [120, 80, 52] : [20, 26, 32];
          const sch = []; for (let k = 0; k <= 8; k++) { const a = k / 8 * Math.PI; sch.push([x + sd * 0.012, yk + Math.cos(a) * 0.2, 2.25 + Math.sin(a) * 0.2]); }
          Mw.flaeche(sd > 0 ? sch.slice().reverse() : sch, f, { n: n, bias: 0.14, hell: true, alpha: licht ? 0.8 : 0.7 });
          const kopf = []; for (let k = 0; k < 10; k++) { const a = k / 10 * TAU; kopf.push([x + sd * 0.013, yk + Math.cos(a) * 0.11, 2.58 + Math.sin(a) * 0.13]); }
          Mw.flaeche(sd > 0 ? kopf : kopf.slice().reverse(), f, { n: n, bias: 0.15, hell: true, alpha: licht ? 0.8 : 0.7 });
        }
      }
      /* Türen an beiden Enden: Goldrahmen, Griff */
      for (const yt of [-W_Y + 0.55, W_Y - 0.55]) {
        Mw.strich([[x, yt - 0.3, W_Z0 + 0.15], [x, yt - 0.3, 3.05], [x, yt + 0.3, 3.05], [x, yt + 0.3, W_Z0 + 0.15], [x, yt - 0.3, W_Z0 + 0.15]], 0.035, ST.zugFarbe(Mw.licht(n, GOLD)), { bias: 0.12 });
        Mw.scheibe([x + sd * 0.02, yt + 0.2, 2.1], n, 0.04, MESSING, { bias: 0.14, n: 8 });
        const f = [[x, yt - 0.22, 2.55], [x, yt + 0.22, 2.55], [x, yt + 0.22, 2.95], [x, yt - 0.22, 2.95]];
        Mw.flaeche(sd > 0 ? f : f.slice().reverse(), licht ? [255, 214, 140] : [36, 50, 62], { n: n, bias: 0.12, hell: licht });
      }
      /* Trittbrett */
      Mw.kasten(Math.min(x, x + sd * 0.22), Math.max(x, x + sd * 0.22), -W_Y + 0.3, W_Y - 0.3, 0.98, 1.04, [40, 40, 44], { bias: 0.05 });
    }
    /* Stirnwände mit Faltenbalg */
    for (const sg of [-1, 1]) {
      Mw.kasten(-0.55, 0.55, sg > 0 ? W_Y - 0.15 : -W_Y + 0.05, sg > 0 ? W_Y - 0.05 : -W_Y + 0.15, 1.3, 3.2, [40, 40, 44], { bias: 0.02 });
    }
    /* Tonnendach mit Oberlicht-Aufbau */
    const dach = [], DN = 8;
    for (let i = 0; i <= DN; i++) { const u = -1 + 2 * i / DN; dach.push([u * (W_X + 0.08), W_Z1 + 0.36 * (1 - u * u)]); }
    for (let i = 0; i < DN; i++) {
      const a = dach[i], b = dach[i + 1], nx = -(b[1] - a[1]), nz = b[0] - a[0];
      Mw.flaeche([[a[0], -W_Y + 0.05, a[1]], [b[0], -W_Y + 0.05, b[1]], [b[0], W_Y - 0.05, b[1]], [a[0], W_Y - 0.05, a[1]]], DACH, { n: norm([nx, 0, nz]), bias: 0.2 });
      if (Mw.winter) Mw.flaeche([[a[0] * 0.95, -W_Y + 0.12, a[1] + 0.05], [b[0] * 0.95, -W_Y + 0.12, b[1] + 0.05], [b[0] * 0.95, W_Y - 0.12, b[1] + 0.05], [a[0] * 0.95, W_Y - 0.12, a[1] + 0.05]], SCHNEE, { n: norm([nx, 0, nz]), bias: 0.21, alpha: 0.9 });
    }
    for (const [y, sg] of [[-W_Y + 0.05, -1], [W_Y - 0.05, 1]]) {
      const pts = dach.map((d) => [d[0], y, d[1]]).concat([[W_X + 0.08, y, W_Z1 - 0.04], [-W_X - 0.08, y, W_Z1 - 0.04]].reverse());
      Mw.flaeche(sg > 0 ? pts.slice().reverse() : pts, [36, 38, 42], { n: [0, sg, 0], bias: 0.19 });
    }
    /* Oberlicht: schmaler Aufbau mit kleinen Fenstern */
    const oz0 = OB.z - 0.05, oz1 = OB.z + OB.h, oy = W_Y - 0.9;
    Mw.kasten(-OB.x, OB.x, -oy, oy, oz0, oz1, { seite: OBERLICHT, stirn: OBERLICHT, oben: DACH }, { bias: 0.3 });
    for (const sd of [-1, 1]) {
      const x = sd * (OB.x + 0.01), n = [sd, 0, 0];
      if (Mw.blick(n) < 0) continue;
      for (let y = -oy + 0.35; y < oy - 0.2; y += 0.6) {
        const f = [[x, y, oz0 + 0.1], [x, y + 0.38, oz0 + 0.1], [x, y + 0.38, oz1 - 0.08], [x, y, oz1 - 0.08]];
        Mw.flaeche(sd > 0 ? f : f.slice().reverse(), licht ? [255, 220, 150] : [70, 86, 100], { n: n, bias: 0.32, hell: licht });
      }
    }
    if (Mw.winter) Mw.flaeche([[-OB.x, -oy, oz1 + 0.03], [OB.x, -oy, oz1 + 0.03], [OB.x, oy, oz1 + 0.03], [-OB.x, oy, oz1 + 0.03]], SCHNEE, { n: [0, 0, 1], bias: 0.34 });
    /* Lüfter auf dem Oberlicht */
    for (let y = -oy + 0.8; y < oy; y += 1.6) Mw.zylZ(0, y, 0.1, oz1, oz1 + 0.16, [40, 42, 46], { n: 8, bias: 0.35 });
    /* Puffer, Pufferbohlen, Schlusslaternen-Halter */
    for (const sg of [-1, 1]) {
      Mw.kasten(-1.45, 1.45, sg > 0 ? W_Y - 0.25 : -W_Y, sg > 0 ? W_Y : -W_Y + 0.25, 0.8, 1.3, { seite: [36, 36, 40], stirn: [36, 36, 40], oben: [36, 36, 40] });
      ST.zugPuffer(Mw, sg * W_Y, sg);
      for (const sd of [-1, 1]) Mw.kasten(sd * 1.05 - 0.1, sd * 1.05 + 0.1, sg * (W_Y + 0.02) - 0.1, sg * (W_Y + 0.02) + 0.1, 1.45, 1.7, [40, 40, 44], { bias: 0.05 });
    }
  }

  function malenMit(bau) {
    return function (g, P) { const Mw = ST.zugMaler(P); bau(Mw, P); g.save(); Mw.malen(g); g.restore(); };
  }
  ST.modell("reiselok", { name: "Reiselok (klassisch)", gruppe: "Deko", versteckt: true, live: true, grund: [3.0, 10.9], hoehe: 4.6, zeichnen: malenMit(lokBauen) });
  ST.modell("reisetender", { name: "Tender (klassisch)", gruppe: "Deko", versteckt: true, live: true, grund: [2.9, 6.6], hoehe: 3.8, zeichnen: malenMit(tenderBauen) });
  ST.modell("personenwagen", { name: "Abteilwagen (weinrot)", gruppe: "Deko", versteckt: true, live: true, grund: [2.9, 12.4], hoehe: 4.2, zeichnen: malenMit(wagenBauen) });
  /* Maße für stadt-leicht/bahn.js (vorn/hinten ab der Mitte über Puffer, Schlot, Lampen) */
  ST.REISEZUG = { lok: { vorn: Y_VORN + 0.42, hinten: -Y_HINTEN, schlot: [4.3, 4.93], treibR: TR_R }, tender: { vorn: T_Y + 0.2, hinten: T_Y + 0.64 }, wagen: { vorn: W_Y + 0.42, hinten: W_Y + 0.42 } };
})();
