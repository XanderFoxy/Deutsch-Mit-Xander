/* =====================================================================
   RATHAUS DÖBELN (Obermarkt, erbaut 1910–1912) — Maßstab etwa 1:1,5
   ---------------------------------------------------------------------
   XANDER: „das Döbelner Rathaus getreu nachbauen, auch die Rückseite" ·
   „die Größenverhältnisse zu den Nachbarhäusern sollen stimmen" · „ich
   will es im Bausatz wiedererkennen" · „richtig filigran. Richtig schön
   ausarbeiten mit schönen Texturen" · „keine Comic Grafik … viel mehr am
   Realismus" · „Du bist dein schlimmster Kritiker".

   VORBILD (nach Xanders Fotos vom Obermarkt, vom Brunnen und im Winter)
   FASSUNG 819 — XANDER (Funk 206): „im Prinzip ist das ganze wie ein
   dreizackiger Stern … in der Draufsicht". Der Turm mit dem Hauptportal
   steht in der Mitte (wie am Obermarkt im Winkel zweier Straßen, die
   nicht rechtwinklig zusammenlaufen), drei Flügel gehen von ihm ab:
     • RATHAUSTURM (Mitte, Portal vorn = +y, zum Brunnen): glatter Schaft
       mit Eckquadern, unten das Hauptportal mit zwei Figuren, darüber
       der Erker mit Hauben-Dach. Oben ein Kranz aus Konsolen mit
       Balustrade (Umgang), die Glockenstube mit Schallarkaden, vier
       Ecktürmchen mit Zwiebelhauben, das eingezogene Uhrgeschoss mit
       vier Zifferblättern, darauf die geschweifte Haube, die offene
       Laterne, eine zweite Zwiebel, Kugel und Wetterfahne.
     • FLÜGEL A (rechts, im rechten Winkel). FASSUNG 829 — XANDER: „das
       was du als Dach da gemacht hast. Das ist eigentlich die Ansicht auf
       die wir gucken auf dem Foto … Also dieser dreieckige Teil den wir
       im Gesicht haben." Vorn der Giebelbau: der große Stufengiebel (vier
       Stufen mit Voluten, Rundbogen-Abschluss mit Wappen und Kugel)
       schaut zum Brunnen, dahinter läuft EIN Satteldach nach hinten und
       endet mit einem Walm (kein zweiter Giebel). Unten Rundbogenfenster
       im Sandstein-Sockel, „Ratskeller", links zum Turm hin im 1. OG der
       weit vorgezogene Balkon auf Konsolen mit Blumenkästen, links und
       rechts vom Giebel die zwei Türmchen mit dunkler Haube. Rechts
       daneben, 1 m zurückgesetzt, ein Haus zur Seite mit Zeltdach (kein
       eigener First, kein Giebel an der Seite). (FASSUNG 824 hatte einen
       First quer mit dem Giebel als Kopfseite rechts – das war falsch.)
     • FLÜGEL B (hinter dem Turm, etwas länger als A, rechtwinklig zu A –
       ein L): schlichter, dieselbe Geschossgliederung, Walmdach mit
       Gauben, am Turm die drei Ochsenaugen (Rundfenster), hinten ein
       Tor.
     • FLÜGEL C (schräg nach vorn links, C_WINKEL zur Front): Walmdach mit
       gerundeter Ecke, einem langen Dachhaus mit Fensterband, Fleder-
       mausgauben und dem kleinen Dachreiter mit Kupferhaube; unten
       Rundbogenfenster mit Gittern, im 1. OG Doppelfenster, im 2. OG große
       Rundbogenfenster. C liegt ganz links der Turmkante: das Portal
       bleibt vom Brunnen aus frei. (Der Balkon ist nach Xanders Foto an
       Flügel A gewandert – FASSUNG 824.)
   Maße: Das echte Rathaus ist gut 60 m lang, der Turm 59 m hoch
   (FASSUNG 829, Recherche: Winkelbau 1910–1912 nach Plänen von Stadt-
   baumeister Karl Otto Richter mit Hugo Licht, Leipzig; Turm 59 m).
   In 1:1,5 wird der Stern ~41 × 33 m groß, Traufe 12 m (C 10,8 m),
   Turmspitze 32,5 m. Die Geschosse bleiben mit ~2,8–3 m so hoch wie die
   der Fachwerkhäuser (Traufe ~6 m, zwei Geschosse) – das Rathaus hat
   vier Geschosse und überragt die Nachbarn wie am Obermarkt.

   WIE ES GEMALT WIRD
   Wie Holstentor und Neuschwanstein: konvexe Körper, für jede Ansicht
   über trennende Ebenen geordnet (Werk.ordnen). Das Licht legt der Kern
   darüber. Alle Fassadenteile (Fenster, Bänder, Portal) werden in
   Weltkoordinaten angegeben und beim Malen in die Fläche umgerechnet –
   so stimmen sie auf jeder Wand und bei jedem Drehwinkel. Turmhaube,
   Laterne, Zwiebeln und Kugeln sind Drehkörper (Figuren), die mit dem
   Sonnenlicht quer über die Rundung schattiert werden.
   Nacht: Fenster leuchten verstreut, die vier Zifferblätter glühen,
   Laternen am Portal. Winter: Schnee auf Dächern und Stufen.
   Bauen: alles wächst von unten nach oben (o.bau), Hauben zuletzt.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const KX = ST.KX, KY = ST.KY, KZ = ST.KZ;
  const RAD = Math.PI / 180;

  /* ---------------- Vektoren und Farben ---------------- */
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const kreuz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const klemm = (x, a, b) => (x < a ? a : x > b ? b : x);
  const hex = PI.hex, hell = PI.hell, misch = PI.misch;
  function rgbS(c, a) { return a == null ? "rgb(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + ")" : "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + (+a).toFixed(3) + ")"; }
  function zahl(p) { return ST.hash2(Math.round(p[0] * 10), Math.round(p[1] * 10) + Math.round(p[2] * 7) * 131, 77); }

  /* Farben nach den Fotos: heller, warmer Putz, gelblicher Elbsandstein,
     rote Biberschwänze, dunkelgrüngraue Turmhauben, grüne Kupferhaube */
  const PUTZ = "#eddfc3", PUTZ_W = "#eadbbd";
  const RUSTIKA = "#c7b48f", SOCKEL = "#a89a80";
  const SAND = [205, 187, 148], SAND_D = [168, 148, 110];
  const ZIEGEL = "#b35a3d";
  const SCHIEFER = [66, 78, 74], KUPFER = [112, 170, 150], GOLD = [226, 184, 88];
  const RAHMEN = "#f3f0e8";

  /* ---------------- Maße ----------------
     FASSUNG 819 — XANDER (Funk 206): „Stelle dir mal ein ganz simples Kirchengebäude vor dann hat man links den Turm
     und rechts das Seitenschiff … stell dir vor die Rückseite von dem Turm hat auch noch mal so ein Hausschiff abgehen
     … und das geht offenbar ein bisschen länger … und auf der linken Seite ist es nicht direkt nach links zur Seite
     sondern eher schräg nach vorne … deswegen darfst du niemals den Eingang irgendwie verbauen … im Prinzip ist das
     ganze wie ein dreizackiger Stern … in der Draufsicht … das seitliche rechts vom Eingang abgehend und das was hinter
     dem Turm ist ein perfekter rechter Winkel wie ein L und das einzige was schräg ist ist das seitliche Schiff".
     Der Grundriss ist darum ein dreizackiger Stern um den Turm (Turmmitte = Ursprung, Portal nach vorn = +y):
       Flügel A  Giebelbau mit dem großen Stufengiebel und Ostflügel, geht vom Turm im rechten Winkel nach rechts (+x);
                 seine Front liegt hinter der Turmfront – rechts neben dem Portal springt nichts nach vorn.
       Flügel B  hinter dem Turm nach hinten (−y), etwas länger als A, rechtwinklig zu A (L-Form).
       Flügel C  der Walmdach-Flügel mit Dachreiter und runder Ecke, geht an der linken Turmkante schräg nach vorn
                 links (C_WINKEL zur Front) – er liegt ganz links der Turmkante, das Portal bleibt frei.
     Beim Malen wird der Grundriss mittig gerückt (DX, DY aus dem Umriss, siehe unten). */
  const TRAUFE = 12.0, TRAUFE_W = 10.8;
  const Z_RUST = 3.8;                        // Oberkante Sandstein-Erdgeschoss
  const UE = 0.45;                           // Dachüberstand
  /* Turm (Mitte = Ursprung), Portal an der Front y = TY1 */
  const TX0 = -2.6, TX1 = 2.6, TY0 = -2.6, TY1 = 2.6, TXM = 0, TYM = 0;
  const T_SCHAFT = 18.6, T_KONS = 19.5, T_BAL = 20.4, T_STUBE = 23.0, T_UHR = 26.0, T_KRANZ = 26.35;
  /* Flügel A, vorderer Teil („Giebelbau" im Grundriss) rechts am Turm, Front 0,6 m hinter der Turmfront */
  const GX0 = TX1, GX1 = GX0 + 12, GY1 = TY1 - 0.6, GY0 = GY1 - 12.4;
  /* Flügel A, hinterer Teil („Ostflügel" im Grundriss), noch einmal 1 m zurückgesetzt, am Ende die Kopfseite */
  const OX0 = GX1, OX1 = OX0 + 7.2, OY1 = GY1 - 1.0, OY0 = OY1 - 9;
  /* FASSUNG 829 — XANDER (29.09., nach Fassung 824): „Da gibt es wirklich nicht dieses Dach auf der Seite. Das ist
     einfach nur ein Haus zur Seite und das was du als Dach da gemacht hast. Das ist eigentlich die Ansicht auf die wir
     gucken auf dem Foto … es ist trotzdem ein seitliches Haus mit dem Dach, dann eben zur Seite, wo wir frontal drauf
     gucken. Also dieser dreieckige Teil den wir im Gesicht haben."
     Darum steht der große Stufengiebel wieder VORN (schaut zum Brunnen, wie auf dem Foto vom Obermarkt), und der
     vordere Teil von A läuft mit EINEM Satteldach nach hinten: First G_FX entlang y von der Giebelfront bis G_FY0, hinten
     ein Walm (kein zweiter Giebel, der von vorn über dem ersten aufragt – das war das „doppelt gemoppelt" vor Fassung
     824). Der hintere Teil („Ostflügel" im Grundriss) ist nur ein Haus zur Seite: Zeltdach (vier Walmflächen, die in
     einer Spitze O_SPITZE zusammenlaufen) – kein eigener First, kein quer laufendes Dach, kein Giebel an der Seite. */
  const G_TAN = Math.tan(55 * RAD), G_FX = (GX0 + GX1) / 2, G_FIRST = TRAUFE + (GX1 - GX0) / 2 * G_TAN;
  const G_FY0 = GY0 + (GX1 - GX0) / 2;          // Ende des Firsts vor dem hinteren Walm (gleiche Neigung)
  const O_TANS = Math.tan(50 * RAD), O_XM = (OX0 + OX1 + UE) / 2, O_YM = (OY0 + OY1) / 2;
  const O_SPITZE = [O_XM, O_YM, TRAUFE + (O_XM - OX0) * O_TANS];
  const O_TANF = (O_SPITZE[2] - TRAUFE) / ((OY1 - OY0) / 2 + UE);   // Neigung der Walmflächen vorn und hinten
  /* Flügel B: hinter dem Turm, rechte Wand in der Flucht der rechten Turmwand (Kehle zum Giebelbau).
     FASSUNG 829 — XANDER: „wie der Teil, der hinterm Rathaus langgeht, dass der richtig vermessen ist und nicht zu weit
     links vom hinteren Rathaus weggeht". B stand 4,6 m links über die Turmkante hinaus und ragte von vorn als hohe rote
     Dachwand links neben dem Turm auf (auf dem Foto sieht man dort nur das Dach von Flügel C). Jetzt steht B nur noch
     1,4 m links über die Turmkante (6,6 m breit statt 9,8 m, First 15,9 m statt 17,8 m) – von vorn fast ganz hinter dem
     Turm. Länge (22 m nach hinten) und rechter Winkel zu A bleiben. */
  const BX0 = TX0 - 1.4, BX1 = TX1, BY1 = TY0, BY0 = TY0 - 22, B_TAN = Math.tan(50 * RAD);
  /* Flügel C: schräg nach vorn links. Eigenes Achsensystem (wie der frühere Westflügel): x läuft vom Turm (0) zum
     Ende (−C_LANG), y von der Front (0, zum Markt) nach hinten (−C_BREIT). TC bringt es in den Grundriss. */
  const C_WINKEL = 35, C_LANG = 13.5, C_BREIT = 9.6;
  const CD = [-Math.cos(C_WINKEL * RAD), Math.sin(C_WINKEL * RAD)];   // Richtung vom Turm zum Ende
  const CN = [Math.sin(C_WINKEL * RAD), Math.cos(C_WINKEL * RAD)];    // Außennormale der Front (nach vorn rechts)
  const CP0 = [TX0, GY1];                                               // Fußpunkt der Front an der linken Turmkante
  const TC = (p) => [CP0[0] - p[0] * CD[0] + p[1] * CN[0], CP0[1] - p[0] * CD[1] + p[1] * CN[1], p.length > 2 ? p[2] : 0];
  const TCn = (v) => [-v[0] * CD[0] + v[1] * CN[0], -v[0] * CD[1] + v[1] * CN[1]];
  const TCi = (m) => { const dx = m[0] - CP0[0], dy = m[1] - CP0[1]; return [-(dx * CD[0] + dy * CD[1]), dx * CN[0] + dy * CN[1]]; };
  const WX0 = -C_LANG, WX1 = 0, WY0 = -C_BREIT, WY1 = 0, W_R = 3.0, W_TAN = Math.tan(50 * RAD);
  const W_FIRST_Y = (WY0 + WY1) / 2, W_FIRST = TRAUFE_W + ((WY1 - WY0) / 2 + UE) * W_TAN;
  /* Anschluss von C: hinten an der Flucht der Turmrückwand (= Front von B), vorn an der linken Turmwand */
  const C_QB = [(CP0[1] + WY0 * CN[1] - TY0) / CD[1], WY0];            // Rückwand trifft die Flucht y = TY0
  const C_BE = TCi([BX0, BY1]), C_S = TCi([TX0, TY0]);
  const C_GRUND = (() => {
    const G = [[WX1, WY1]], cx = WX0 + W_R, cy = WY1 - W_R;
    for (let i = 0; i <= 4; i++) { const th = (90 + 90 * i / 4) * RAD; G.push([cx + Math.cos(th) * W_R, cy + Math.sin(th) * W_R]); }
    G.push([WX0, WY0], C_QB, C_BE, C_S);
    return G;
  })();
  /* Grundriss der Flügel (Wände, je Flügel konvexe Stücke) – für den Umriss, die Mitte und die Sonde (def.grundriss) */
  const FLUEGEL = {
    turm: [[[TX0, TY1], [TX1, TY1], [TX1, TY0], [TX0, TY0]]],
    A: [[[GX0, GY1], [GX1, GY1], [GX1, GY0], [GX0, GY0]], [[OX0, OY1], [OX1, OY1], [OX1, OY0], [OX0, OY0]]],
    B: [[[BX0, BY1], [BX1, BY1], [BX1, BY0], [BX0, BY0]]],
    C: [C_GRUND.map((p) => TC(p).slice(0, 2))]
  };
  const UMRISS = (() => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const k in FLUEGEL) for (const poly of FLUEGEL[k]) for (const [x, y] of poly) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    return [x0, y0, x1, y1];
  })();
  const DX = -Math.round((UMRISS[0] + UMRISS[2]) / 2 * 100) / 100, DY = -Math.round((UMRISS[1] + UMRISS[3]) / 2 * 100) / 100;   // rückt die Grundrissmitte auf (0,0)
  const S = (p) => [p[0] + DX, p[1] + DY, p[2]];
  const GRUND = [Math.round((UMRISS[2] - UMRISS[0]) * 10) / 10, Math.round((UMRISS[3] - UMRISS[1]) * 10) / 10];

  /* =====================================================================
     SCHNELLER MALEN — große Flächen erst im Hauptspeicher (wie Holstentor)
     ===================================================================== */
  const CPU = new Map();
  function cpuLeinwand(w, h) {
    const st = (a) => a <= 512 ? Math.ceil(a / 128) * 128 : Math.ceil(a / 256) * 256;
    const sw = st(w), sh = st(h), k = sw + "x" + sh;
    let c = CPU.get(k);
    if (c) { CPU.delete(k); CPU.set(k, c); return c; }
    const cv = document.createElement("canvas"); cv.width = sw; cv.height = sh;
    c = cv.getContext("2d", { willReadFrequently: true });
    CPU.set(k, c);
    while (CPU.size > 4) { const alt = CPU.keys().next().value, ac = CPU.get(alt); ac.canvas.width = ac.canvas.height = 0; CPU.delete(alt); }
    return c;
  }
  function aufCpu(m) {
    return function (g, F) {
      const T = g.getTransform();
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const p of F.flaeche.umriss) {
        const X = T.a * p[0] + T.c * p[1] + T.e, Y = T.b * p[0] + T.d * p[1] + T.f;
        if (X < x0) x0 = X; if (X > x1) x1 = X; if (Y < y0) y0 = Y; if (Y > y1) y1 = Y;
      }
      const W = g.canvas.width, H = g.canvas.height;
      x0 = Math.max(0, Math.floor(x0) - 2); y0 = Math.max(0, Math.floor(y0) - 2);
      x1 = Math.min(W, Math.ceil(x1) + 2); y1 = Math.min(H, Math.ceil(y1) + 2);
      const w = x1 - x0, h = y1 - y0;
      if (w <= 0 || h <= 0) return;
      if (w * h < 2500 || w * h > 2.5e6) { m(g, F); return; }
      const c = cpuLeinwand(w, h);
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, w + 2, h + 2);
      c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
      c.setTransform(T.a, T.b, T.c, T.d, T.e - x0, T.f - y0);
      c.save(); m(c, F); c.restore();
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.drawImage(c.canvas, 0, 0, w, h, x0, y0, w, h);
      g.setTransform(T);
    };
  }

  /* =====================================================================
     BLICK und WERK — Körper sammeln und nach trennenden Ebenen ordnen
     ===================================================================== */
  function blickVon(o) {
    const ob = o && o.objekt;
    const gier = ob ? (ob.gier || 0) + ((ST.kamera && ST.kamera.dreh) || 0) * 90 : 30;
    const r = gier * RAD, c = Math.cos(r), s = Math.sin(r), a = KZ * Math.SQRT1_2;
    return {
      gier: gier, e: [a * (c + s), a * (c - s), 0.5],
      bild(p) { const x = p[0] * c - p[1] * s, y = p[0] * s + p[1] * c; return [(x - y) * KX, (x + y) * KY - p[2] * KZ]; }
    };
  }
  /* Vieleck oberhalb zMax abschneiden (Bauphasen) */
  function kappen(pts, zMax) {
    if (!(zMax < Infinity)) return pts;
    const aus = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      const ia = a[2] <= zMax, ib = b[2] <= zMax;
      if (ia) aus.push(a);
      if (ia !== ib) { const t = (zMax - a[2]) / (b[2] - a[2]); aus.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, zMax]); }
    }
    return aus;
  }
  function Werk(M, B) { this.M = M; this.B = B; this.K = []; this.akt = null; this.zMax = Infinity; }
  Werk.prototype.teil = function (name) {
    const t = this.M.teil(name, { schatten: true });
    const k = { t: t, name: name, pts: [], pl: [] };
    this.K.push(k); this.akt = k;
    return k;
  };
  Werk.prototype.huelle = function (pts, pl) { const k = this.akt; for (const p of pts) k.pts.push(S(p)); for (const e of pl || []) k.pl.push(e); };
  /* Ebene Fläche aus Punkten im Grundriss-System. innen = ein Punkt im
     Körper; u liegt waagrecht, v zeigt in der Fläche nach unten. */
  Werk.prototype.poly = function (pts0, innen, malen, opt) {
    let pts = kappen(pts0.map(S), this.zMax);
    if (pts.length < 3) return null;
    innen = S(innen);
    let n = [0, 0, 0];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1]);
    }
    if (Math.hypot(n[0], n[1], n[2]) < 1e-9) return null;
    n = nrm(n);
    let m = [0, 0, 0]; for (const p of pts) m = add(m, p); m = mul(m, 1 / pts.length);
    if (dot(n, sub(m, innen)) < 0) n = mul(n, -1);
    let u = kreuz(n, [0, 0, 1]);
    if (Math.hypot(u[0], u[1], u[2]) < 1e-6) u = [1, 0, 0]; else u = nrm(u);
    const v = kreuz(n, u);
    const q = pts.map((p) => { const d = sub(p, pts[0]); return [dot(d, u), dot(d, v)]; });
    let a0 = Infinity, b0 = Infinity, a1 = -Infinity, b1 = -Infinity;
    for (const [a, b] of q) { a0 = Math.min(a0, a); b0 = Math.min(b0, b); a1 = Math.max(a1, a); b1 = Math.max(b1, b); }
    const o = add(pts[0], add(mul(u, a0), mul(v, b0)));
    const f = Object.assign({ o: o, u: u, v: v, w: a1 - a0, h: b1 - b0, umriss: q.map(([a, b]) => [a - a0, b - b0]), malen: malen }, opt || {});
    const r = this.M.flaeche(f);
    const k = this.akt;
    for (const p of pts) k.pts.push(p);
    k.pl.push([n, dot(n, pts[0])]);
    return r;
  };
  function huelle2(p) {
    p = p.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (p.length < 3) return p;
    const kr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], hi = [];
    for (const q of p) { while (lo.length >= 2 && kr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (hi.length >= 2 && kr(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop(); hi.push(q); }
    hi.pop(); lo.pop();
    return lo.concat(hi);
  }
  /* Trennachsen-Test zweier konvexer Vielecke (mit kleiner Toleranz) */
  function ueberdecken(P, Q) {
    if (P.length < 3 || Q.length < 3) return true;
    for (const V of [P, Q]) {
      for (let i = 0; i < V.length; i++) {
        const a = V[i], b = V[(i + 1) % V.length];
        const nx = b[1] - a[1], ny = a[0] - b[0], l = Math.hypot(nx, ny) || 1;
        let p0 = Infinity, p1 = -Infinity, q0 = Infinity, q1 = -Infinity;
        for (const p of P) { const d = (p[0] * nx + p[1] * ny) / l; if (d < p0) p0 = d; if (d > p1) p1 = d; }
        for (const q of Q) { const d = (q[0] * nx + q[1] * ny) / l; if (d < q0) q0 = d; if (d > q1) q1 = d; }
        if (p1 < q0 + 0.01 || q1 < p0 + 0.01) return false;
      }
    }
    return true;
  }
  Werk.prototype.ordnen = function () {
    const e = this.B.e, B = this.B, eps = 0.05;
    const L = this.K.filter((k) => k.pts.length);
    for (const k of L) {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, m = [0, 0, 0];
      for (const p of k.pts) { const q = B.bild(p); x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); m = add(m, p); }
      k.box = [x0, y0, x1, y1]; k.tief = dot(mul(m, 1 / k.pts.length), e);
      k.bildHuelle = huelle2(k.pts.map((p) => B.bild(p)));
    }
    /* Trennt eine Ebene die beiden Körper, die genau auf der Kante gesehen
       wird, überdecken sie sich im Bild nicht: dann keine Bedingung (2). */
    const trenne = (A, Bk) => {
      for (const [n, d] of A.pl.concat(Bk.pl)) {
        const ne = dot(n, e);
        let aMin = Infinity, aMax = -Infinity, bMin = Infinity, bMax = -Infinity;
        for (const p of A.pts) { const s = dot(n, p) - d; if (s < aMin) aMin = s; if (s > aMax) aMax = s; }
        for (const p of Bk.pts) { const s = dot(n, p) - d; if (s < bMin) bMin = s; if (s > bMax) bMax = s; }
        const getrennt = (aMax <= eps && bMin >= -eps) ? 1 : (bMax <= eps && aMin >= -eps) ? -1 : 0;
        if (!getrennt) continue;
        if (Math.abs(ne) < 1e-4) return 2;
        return (ne > 0 ? 1 : -1) * getrennt;
      }
      return 0;
    };
    const N = L.length, nach = L.map(() => []), grad = new Array(N).fill(0);
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const a = L[i].box, b = L[j].box;
      if (a[2] < b[0] - 0.02 || b[2] < a[0] - 0.02 || a[3] < b[1] - 0.02 || b[3] < a[1] - 0.02) continue;
      /* nur wenn sich die Bilder wirklich überdecken (konvexe Hüllen) –
         sonst entstehen unnötige Bedingungen und Kreise */
      if (!ueberdecken(L[i].bildHuelle, L[j].bildHuelle)) continue;
      let r = trenne(L[i], L[j]);
      if (r === 2) continue;
      if (!r) r = L[i].tief <= L[j].tief ? 1 : -1;
      if (r > 0) { nach[i].push(j); grad[j]++; } else { nach[j].push(i); grad[i]++; }
    }
    const fertig = new Array(N).fill(false);
    for (let rang = 0; rang < N; rang++) {
      let best = -1;
      for (let i = 0; i < N; i++) if (!fertig[i] && grad[i] === 0 && (best < 0 || L[i].tief < L[best].tief)) best = i;
      if (best < 0) for (let i = 0; i < N; i++) if (!fertig[i] && (best < 0 || grad[i] < grad[best] || (grad[i] === grad[best] && L[i].tief < L[best].tief))) best = i;
      fertig[best] = true; L[best].t.ebene = rang;
      for (const j of nach[best]) grad[j]--;
    }
  };
  /* Prisma: Grundriss (Punkte im Umlauf), z0…z1; maler(i) liefert je Kante
     { malen, leuchten, opt } oder null (verdeckte Wand weglassen). */
  Werk.prototype.prisma = function (name, grund, z0, z1, maler, oben) {
    this.teil(name);
    if (z0 >= this.zMax) { this.K.pop(); return; }
    let mx = 0, my = 0; for (const p of grund) { mx += p[0]; my += p[1]; }
    const innen = [mx / grund.length, my / grund.length, (z0 + Math.min(z1, this.zMax)) / 2];
    for (let i = 0; i < grund.length; i++) {
      const a = grund[i], b = grund[(i + 1) % grund.length];
      const m = maler(i, a, b);
      const pts = [[a[0], a[1], z1], [b[0], b[1], z1], [b[0], b[1], z0], [a[0], a[1], z0]];
      if (!m) { for (const p of kappen(pts.map(S), this.zMax)) this.akt.pts.push(p); continue; }
      this.poly(pts, innen, m.malen, Object.assign({ leuchten: m.leuchten, ao: z0 < 0.1, name: name + i }, m.opt || {}));
    }
    const zo = Math.min(z1, this.zMax);
    const baustelle = z1 > this.zMax;
    if (oben || baustelle) this.poly(grund.map((p) => [p[0], p[1], zo]), innen, baustelle ? mauerkrone : oben, { name: name + "o" });
  };
  Werk.prototype.kasten = function (name, x0, y0, z0, x1, y1, z1, m, oben) {
    /* Reihenfolge der Kanten: Süd (+y), Ost, Nord, West */
    const G = [[x0, y1], [x1, y1], [x1, y0], [x0, y0]];
    const seiten = [m.sued, m.ost, m.nord, m.west];
    this.prisma(name, G, z0, z1, (i) => seiten[i] || null, oben);
  };

  /* =====================================================================
     MAL-HILFEN
     ===================================================================== */
  /* Weltpunkt (Grundriss-System) → Flächenkoordinaten */
  function fk(F, p) { const f = F.flaeche, d = sub(S(p), f.o); return [dot(d, f.u), dot(d, f.v)]; }
  const bz = (F, z) => F.flaeche.o[2] - z;         // senkrechte Wand: Höhe → b
  function rausch(g, x, y, w, h, meter, k, saat) { PI.rauschen(g, x, y, w, h, meter, k, saat, 3); }
  function steinFlaeche(g, x, y, w, h, farbe, F, saat) {
    g.fillStyle = rgbS(farbe); g.fillRect(x, y, w, h);
    if (F.px > 4) rausch(g, x, y, w, h, 1.2, 0.16, saat || 5);
  }
  /* ---------------- Muster-Kacheln ----------------
     Ziegel und Sandsteinquader werden EINMAL je Detailstufe als nahtlose
     Kachel gemalt und dann als Füllmuster gelegt – zehntausende Ziegel
     einzeln zu malen wäre für ein so großes Haus viel zu langsam. */
  const KACHEL = new Map();
  function kachel(schl, wM, hM, dichte, malen) {
    const k = schl + "|" + dichte;
    let c = KACHEL.get(k);
    if (!c) {
      c = document.createElement("canvas");
      c.width = Math.max(4, Math.round(wM * dichte)); c.height = Math.max(4, Math.round(hM * dichte));
      const g = c.getContext("2d");
      g.scale(c.width / wM, c.height / hM);
      malen(g, wM, hM);
      KACHEL.set(k, c);
    }
    return c;
  }
  function musterFuellen(g, bild, wM, hM, x, y, w, h, dx, dy) {
    const m = g.createPattern(bild, "repeat");
    m.setTransform(new DOMMatrix([wM / bild.width, 0, 0, hM / bild.height, dx || 0, dy || 0]));
    g.fillStyle = m; g.fillRect(x, y, w, h);
  }
  /* Detailstufe nach der größeren Verzerrung der Fläche (schräg gesehene
     Dächer sind in einer Richtung gestaucht, in der anderen nicht) */
  const dichteVon = (F) => { const px = Math.max(F.pxU || F.px, F.pxV || F.px); return px < 12 ? 12 : px < 24 ? 24 : px < 48 ? 48 : 96; };
  const modw = (a, n) => ((a % n) + n) % n;
  /* Biberschwanz-Doppeldeckung: 12 Ziegel × 14 Reihen je Kachel */
  const ZB = 0.18, ZR = 0.15, ZN = 12, ZM = 14;
  function ziegelKachel(farbe) {
    return function (g, W, H) {
      const basis = hex(farbe);
      g.fillStyle = rgbS(hell(basis, -0.45)); g.fillRect(0, 0, W, H);
      /* von der Traufe zum First: jede höhere Reihe liegt über der
         unteren, sichtbar bleibt der runde Schwanz jedes Ziegels */
      for (let k = ZM - 1; k >= -2; k--) {
        const off = modw(k, 2) * ZB / 2, yy = k * ZR;
        for (let j = -1; j <= ZN; j++) {
          const h1 = ST.hash2(modw(j, ZN), modw(k, ZM), 31), h2 = ST.hash2(modw(j, ZN), modw(k, ZM), 57);
          let c = [basis[0] * (0.95 + h1 * 0.1), basis[1] * (0.95 + h1 * 0.1), basis[2] * (0.95 + h1 * 0.1)];
          if (h2 < 0.06) c = hell(c, -0.12); else if (h2 > 0.96) c = misch(c, [120, 110, 80], 0.25);
          const b = ZB * 0.94, lang = ZR * 2.05, x0 = j * ZB + off + (ZB - b) / 2, y0 = yy;
          g.fillStyle = "rgba(30,12,8,0.5)";
          g.beginPath();
          g.moveTo(x0, y0 + lang * 0.55); g.lineTo(x0, y0 + lang - b * 0.5 + ZR * 0.1);
          g.arc(x0 + b / 2, y0 + lang - b * 0.5 + ZR * 0.1, b / 2, Math.PI, 0, true);
          g.lineTo(x0 + b, y0 + lang * 0.55); g.closePath(); g.fill();
          const gr = g.createLinearGradient(0, y0 + lang * 0.4, 0, y0 + lang);
          gr.addColorStop(0, rgbS(hell(c, -0.06))); gr.addColorStop(0.7, rgbS(c)); gr.addColorStop(1, rgbS(hell(c, 0.07)));
          g.fillStyle = gr;
          g.beginPath();
          g.moveTo(x0, y0); g.lineTo(x0, y0 + lang - b * 0.5);
          g.arc(x0 + b / 2, y0 + lang - b * 0.5, b / 2, Math.PI, 0, true);
          g.lineTo(x0 + b, y0); g.closePath(); g.fill();
          g.strokeStyle = rgbS(hell(c, -0.4), 0.45); g.lineWidth = 0.008;
          g.beginPath(); g.moveTo(x0 + b, y0 + lang * 0.5); g.lineTo(x0 + b, y0 + lang - b * 0.5); g.arc(x0 + b / 2, y0 + lang - b * 0.5, b / 2, 0, Math.PI, false); g.stroke();
        }
      }
    };
  }
  /* Sandsteinquader in drei ungleich hohen Lagen (Kachel 3,6 × 1,26 m) */
  const QUADER_REIHEN = [[0.46, [0.9, 1.1, 0.7, 0.9]], [0.38, [0.6, 1.0, 0.8, 1.2]], [0.42, [1.2, 0.7, 0.9, 0.8]]];
  function quaderKachel(farbe) {
    return function (g, W, H) {
      const basis = hex(farbe);
      g.fillStyle = rgbS(hell(basis, -0.32)); g.fillRect(0, 0, W, H);
      let y = 0, r = 0;
      for (const [lh, breiten] of QUADER_REIHEN) {
        let x = 0, i = 0;
        for (const bw of breiten) {
          const hh = ST.hash2(i, r, 17);
          const c = [basis[0] * (0.9 + hh * 0.18), basis[1] * (0.9 + hh * 0.17), basis[2] * (0.9 + hh * 0.15)];
          const gr = g.createLinearGradient(0, y, 0, y + lh);
          gr.addColorStop(0, rgbS(hell(c, 0.14))); gr.addColorStop(0.18, rgbS(c)); gr.addColorStop(1, rgbS(hell(c, -0.12)));
          g.fillStyle = gr;
          PI.rundRechteck(g, x + 0.012, y + 0.012, bw - 0.024, lh - 0.024, 0.025); g.fill();
          x += bw; i++;
        }
        y += lh; r++;
      }
    };
  }
  function steinwerk(g, F, farbe, x, y, w, h, dy) {
    const d = dichteVon(F);
    musterFuellen(g, kachel("q" + farbe, 3.6, 1.26, d, quaderKachel(farbe)), 3.6, 1.26, x, y, w, h, 0, dy);
    if (F.px > 3) PI.rauschen(g, x, y, w, h, 2.5, 0.14, 21, 4);
  }

  /* Glatter, heller Kalkputz der Reformzeit: nur leise Wolken und Korn,
     unten etwas Spritzwasser */
  function putzMalen(g, F, farbe, saat) {
    g.fillStyle = farbe; g.fillRect(-1, -1, F.w + 2, F.h + 2);
    if (F.px > 3) PI.rauschen(g, 0, 0, F.w, F.h, 3.5, 0.06, saat, 3);
    if (F.px > 30) PI.rauschen(g, 0, 0, F.w, F.h, 0.5, 0.05, saat + 7, 2);
    if (F.px > 3) PI.bleichen(g, 0, 0, F.w, F.h, 2.6, 0.08, saat);
  }
  function mauerkrone(g, F) {
    g.fillStyle = "#8d8274"; g.fillRect(-1, -1, F.w + 2, F.h + 2);
    g.strokeStyle = "rgba(60,50,40,0.5)"; g.lineWidth = 0.04;
    for (let x = 0; x < F.w; x += 0.6) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, F.h); g.stroke(); }
  }
  /* Gesims/Band: vorstehende Sandsteinleiste mit Schatten darunter */
  function band(g, F, y, h, x0, x1) {
    x0 = x0 == null ? -0.1 : x0; x1 = x1 == null ? F.w + 0.1 : x1;
    const sv = F.schatten(0.12);
    if (sv) { g.fillStyle = "rgba(40,34,30,0.30)"; g.fillRect(x0 + sv[0], y + h, x1 - x0, Math.max(0.03, sv[1])); }
    const gr = g.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, rgbS(hell(SAND, 0.2))); gr.addColorStop(0.35, rgbS(SAND)); gr.addColorStop(1, rgbS(SAND_D));
    g.fillStyle = gr; g.fillRect(x0, y, x1 - x0, h);
    g.fillStyle = "rgba(60,48,32,0.35)"; g.fillRect(x0, y + h - 0.02, x1 - x0, 0.02);
  }
  /* Kranzgesims unter der Traufe: Platte, Zahnschnitt, Kehle */
  function kranz(g, F, y, h) {
    const sv = F.schatten(0.35);
    if (sv) { g.fillStyle = "rgba(40,34,40,0.32)"; g.fillRect(-0.1, y + h, F.w + 0.2, Math.max(0.05, sv[1] * 1.2)); }
    const gr = g.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, rgbS(hell(SAND, -0.1))); gr.addColorStop(0.25, rgbS(hell(SAND, 0.18))); gr.addColorStop(0.55, rgbS(SAND)); gr.addColorStop(1, rgbS(SAND_D));
    g.fillStyle = gr; g.fillRect(-0.1, y, F.w + 0.2, h);
    if (F.px > 10) {
      g.fillStyle = "rgba(70,56,38,0.45)";
      for (let x = 0.05; x < F.w; x += 0.22) g.fillRect(x, y + h * 0.58, 0.1, h * 0.22);
    }
    g.fillStyle = "rgba(60,48,32,0.4)"; g.fillRect(-0.1, y + h * 0.5, F.w + 0.2, 0.02);
  }
  /* Eckquader (Ortsteine) an einer senkrechten Kante bei a, nach innen dir */
  function eckquader(g, F, a, dir, yOben, yUnten) {
    let y = yOben, i = 0;
    while (y < yUnten - 0.05) {
      const h = Math.min(0.45, yUnten - y), l = i % 2 ? 0.42 : 0.7;
      const x = dir > 0 ? a : a - l;
      const gr = g.createLinearGradient(0, y, 0, y + h);
      gr.addColorStop(0, rgbS(hell(SAND, 0.12))); gr.addColorStop(1, rgbS(hell(SAND, -0.08)));
      g.fillStyle = gr; g.fillRect(x, y + 0.012, l, h - 0.024);
      g.fillStyle = "rgba(80,66,46,0.35)"; g.fillRect(x, y + h - 0.02, l, 0.02);
      y += h; i++;
    }
  }
  /* Fallrohr aus Zink */
  function fallrohr(g, F, a, y0, y1) {
    const gr = g.createLinearGradient(a - 0.06, 0, a + 0.06, 0);
    gr.addColorStop(0, "#4b4f52"); gr.addColorStop(0.4, "#7b8084"); gr.addColorStop(1, "#33373a");
    g.fillStyle = gr; g.fillRect(a - 0.055, y0, 0.11, y1 - y0);
    g.fillStyle = "#2b2e30";
    for (let y = y0 + 0.6; y < y1; y += 1.8) g.fillRect(a - 0.08, y, 0.16, 0.05);
    const sv = F.schatten(0.08);
    if (sv) { g.fillStyle = "rgba(30,30,40,0.18)"; g.fillRect(a + 0.055, y0, Math.max(0.02, Math.abs(sv[0])), y1 - y0); }
  }

  /* ---------------- Fenster ----------------
     e = { p: [x,y,z] Mitte unten der Öffnung, w, h, form: "r"|"b"|"o"|"d",
           verdach: "dreieck"|"gerade"|"segment", gitter, sprossen, gewaende } */
  function oeffnungPfad(g, x, y, w, h, form) {
    g.beginPath();
    if (form === "b") { const r = w / 2; g.moveTo(x, y + h); g.lineTo(x, y + r); g.arc(x + r, y + r, r, Math.PI, 0); g.lineTo(x + w, y + h); g.closePath(); }
    else if (form === "o") { g.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2); }
    else g.rect(x, y, w, h);
  }
  function fensterEinzeln(g, F, x, y, w, h, e) {
    if (F.px < 7) {
      /* weit weg: dunkles Glas mit hellem Rahmen */
      oeffnungPfad(g, x, y, w, h, e.form); g.fillStyle = "#3d4656"; g.fill();
      g.strokeStyle = RAHMEN; g.lineWidth = Math.max(0.05, 1 / F.px); g.stroke();
      return;
    }
    g.save(); oeffnungPfad(g, x, y, w, h, e.form); g.clip();
    PI.fenster(g, x, y, w, h, F, { rahmen: RAHMEN, sprossen: e.sprossen || [2, 3], fluegel: e.fluegel || 2, bank: false, laibung: "#cfc4ae", tiefe: 0.2, vorhangFarbe: "#f2ece0" });
    g.restore();
    if (e.form === "b" && F.px > 10) {
      /* Bogenfeld: Kämpfer und strahlenförmige Sprossen */
      const r = w / 2, cx = x + r, cy = y + r;
      g.strokeStyle = RAHMEN; g.lineWidth = 0.06;
      g.beginPath(); g.moveTo(x, cy); g.lineTo(x + w, cy); g.stroke();
      g.lineWidth = 0.03;
      for (const t of [0.25, 0.5, 0.75]) { const an = Math.PI + t * Math.PI; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(an) * r, cy + Math.sin(an) * r); g.stroke(); }
      g.lineWidth = 0.07; g.beginPath(); g.arc(cx, cy, r - 0.035, Math.PI, 0); g.stroke();
    }
    if (e.form === "o" && F.px > 10) {
      g.strokeStyle = RAHMEN; g.lineWidth = 0.04;
      g.beginPath(); g.moveTo(x + w / 2, y); g.lineTo(x + w / 2, y + h); g.moveTo(x, y + h / 2); g.lineTo(x + w, y + h / 2); g.stroke();
    }
    if (e.gitter && F.px > 9) {
      g.save(); oeffnungPfad(g, x, y, w, h, e.form); g.clip();
      g.strokeStyle = "rgba(34,34,36,0.9)"; g.lineWidth = 0.025;
      for (let xx = x + 0.12; xx < x + w; xx += 0.14) { g.beginPath(); g.moveTo(xx, y); g.lineTo(xx, y + h); g.stroke(); }
      for (let yy = y + h - 0.35; yy > y; yy -= 0.7) { g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy); g.stroke(); }
      g.restore();
    }
  }
  function gewaende(g, F, x, y, w, h, form, rb) {
    /* Sandstein-Gewände mit kleinen Ohren oben, Schatten der Laibung */
    const gr = g.createLinearGradient(x - rb, y - rb, x + w + rb, y + h);
    gr.addColorStop(0, rgbS(hell(SAND, 0.12))); gr.addColorStop(1, rgbS(hell(SAND, -0.06)));
    g.fillStyle = gr;
    oeffnungPfad(g, x - rb, y - rb, w + rb * 2, h + rb * 2, form); g.fill();
    if (form === "r") { g.fillRect(x - rb - 0.07, y - rb, 0.07, 0.22); g.fillRect(x + w + rb, y - rb, 0.07, 0.22); }
    if (form === "b") {
      /* Schlussstein */
      g.fillStyle = rgbS(hell(SAND, 0.05));
      g.beginPath(); g.moveTo(x + w / 2 - 0.12, y - rb - 0.08); g.lineTo(x + w / 2 + 0.12, y - rb - 0.08); g.lineTo(x + w / 2 + 0.08, y + 0.05); g.lineTo(x + w / 2 - 0.08, y + 0.05); g.closePath(); g.fill();
    }
    if (F.px > 8) {
      g.strokeStyle = "rgba(90,74,50,0.35)"; g.lineWidth = 0.02;
      oeffnungPfad(g, x - rb, y - rb, w + rb * 2, h + rb * 2, form); g.stroke();
    }
  }
  function verdachung(g, F, x, y, w, art) {
    const x0 = x - 0.28, x1 = x + w + 0.28, yb = y - 0.24;
    const sv = F.schatten(0.18);
    if (art === "dreieck") {
      const hp = 0.5;
      if (sv) { g.fillStyle = "rgba(40,34,36,0.28)"; g.beginPath(); g.moveTo(x0 + sv[0], yb + 0.1 + sv[1]); g.lineTo(x1 + sv[0], yb + 0.1 + sv[1]); g.lineTo(x1, yb + 0.1); g.lineTo(x0, yb + 0.1); g.fill(); }
      g.fillStyle = rgbS(SAND);
      g.beginPath(); g.moveTo(x0, yb); g.lineTo((x0 + x1) / 2, yb - hp); g.lineTo(x1, yb); g.closePath(); g.fill();
      g.fillStyle = rgbS(hell(SAND, -0.12));
      g.beginPath(); g.moveTo(x0 + 0.14, yb - 0.03); g.lineTo((x0 + x1) / 2, yb - hp + 0.12); g.lineTo(x1 - 0.14, yb - 0.03); g.closePath(); g.fill();
      g.fillStyle = rgbS(hell(SAND, 0.2)); g.fillRect(x0, yb, x1 - x0, 0.1);
      g.strokeStyle = rgbS(hell(SAND, 0.25)); g.lineWidth = 0.05;
      g.beginPath(); g.moveTo(x0, yb); g.lineTo((x0 + x1) / 2, yb - hp); g.lineTo(x1, yb); g.stroke();
      if (F.px > 16) { g.fillStyle = rgbS(hell(SAND, -0.2)); g.beginPath(); g.arc((x0 + x1) / 2, yb - hp * 0.38, 0.08, 0, Math.PI * 2); g.fill(); }
    } else if (art === "segment") {
      g.fillStyle = rgbS(SAND);
      g.beginPath(); g.moveTo(x0, yb + 0.1); g.quadraticCurveTo((x0 + x1) / 2, yb - 0.55, x1, yb + 0.1); g.closePath(); g.fill();
      g.fillStyle = rgbS(hell(SAND, 0.18)); g.fillRect(x0, yb, x1 - x0, 0.1);
    } else if (art === "gerade") {
      if (sv) { g.fillStyle = "rgba(40,34,36,0.28)"; g.fillRect(x0 + sv[0], yb + 0.14, x1 - x0, Math.max(0.03, sv[1])); }
      g.fillStyle = rgbS(hell(SAND, 0.15)); g.fillRect(x0 + 0.08, yb, x1 - x0 - 0.16, 0.14);
      g.fillStyle = rgbS(hell(SAND, -0.1)); g.fillRect(x0 + 0.08, yb + 0.1, x1 - x0 - 0.16, 0.04);
    }
  }
  function sohlbank(g, F, x, y, w) {
    const sv = F.schatten(0.1);
    if (sv) { g.fillStyle = "rgba(40,34,36,0.28)"; g.fillRect(x - 0.12 + sv[0], y + 0.09, w + 0.24, Math.max(0.03, sv[1] * 0.8)); }
    g.fillStyle = rgbS(hell(SAND, 0.15)); g.fillRect(x - 0.14, y, w + 0.28, 0.05);
    g.fillStyle = rgbS(SAND_D); g.fillRect(x - 0.14, y + 0.05, w + 0.28, 0.05);
  }
  function fensterMalen(g, F, e, a, b) {
    const w = e.w, h = e.h, y = b - h;
    const rb = e.gewaende == null ? 0.13 : e.gewaende;
    if (e.form === "d") {
      /* gekuppeltes Doppelfenster mit Mittelpfosten */
      const s = 0.18, w1 = (w - s) / 2, x = a - w / 2;
      gewaende(g, F, x, y, w, h, "r", rb);
      fensterEinzeln(g, F, x, y, w1, h, e);
      fensterEinzeln(g, F, x + w1 + s, y, w1, h, e);
      g.fillStyle = rgbS(hell(SAND, 0.05)); g.fillRect(x + w1, y, s, h);
    } else {
      const x = a - w / 2;
      if (rb > 0) gewaende(g, F, x, y, w, h, e.form, rb);
      fensterEinzeln(g, F, x, y, w, h, e);
    }
    if (e.verdach) verdachung(g, F, a - w / 2 - rb, y - rb, w + rb * 2, e.verdach);
    if (e.form !== "o" && e.bank !== false) sohlbank(g, F, a - w / 2, b + rb * 0.6, w);
  }
  function fensterLeuchten(g, F, e, a, b) {
    if (F.nacht <= 0.02) return;
    const an = zahl(e.p);
    if (an > (e.licht == null ? 0.5 : e.licht)) return;
    const farbe = an < 0.12 ? [255, 214, 160] : [255, 190, 110];
    /* Lichtschein in die Szene nur für untere Fenster und nur jedes zweite:
       hoch gelegene Fenster hinter Dächern würden sonst durchscheinen */
    const Fl = Object.create(F);
    Fl.leuchtPunkt = (e.p[2] < 8 && an < 0.28) ? function (a2, b2, r, f, k) { F.leuchtPunkt(a2, b2, r * 0.8, f, k * 0.6); } : null;
    const teile = e.form === "d" ? [[a - e.w / 2, (e.w - 0.18) / 2], [a + 0.09, (e.w - 0.18) / 2]] : [[a - e.w / 2, e.w]];
    for (const [x, w] of teile) {
      g.save(); oeffnungPfad(g, x, b - e.h, w, e.h, e.form === "d" ? "r" : e.form); g.clip();
      PI.fensterLicht(g, x, b - e.h, w, e.h, Fl, { sprossen: e.sprossen || [2, 3], fluegel: e.fluegel || 2, farbe: farbe, an: 0.9 });
      g.restore();
    }
  }

  /* ---------------- Besondere Stücke ---------------- */
  /* Stadtwappen als Sandstein-Kartusche */
  function wappen(g, F, a, b, w, h) {
    const x = a - w / 2, y = b - h;
    const sv = F.schatten(0.1);
    if (sv) { g.fillStyle = "rgba(40,34,36,0.25)"; g.beginPath(); g.ellipse(a + sv[0], b - h / 2 + sv[1], w / 2, h / 2, 0, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = rgbS(hell(SAND, 0.05));
    g.beginPath(); g.ellipse(a, b - h / 2, w / 2, h / 2, 0, 0, Math.PI * 2); g.fill();
    if (F.px < 8) return;
    /* Schild */
    const sw = w * 0.56, sh = h * 0.62, sx = a - sw / 2, sy = y + h * 0.2;
    g.fillStyle = rgbS(hell(SAND, -0.08));
    g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + sw, sy); g.lineTo(sx + sw, sy + sh * 0.55); g.quadraticCurveTo(sx + sw, sy + sh, a, sy + sh); g.quadraticCurveTo(sx, sy + sh, sx, sy + sh * 0.55); g.closePath(); g.fill();
    g.strokeStyle = rgbS(hell(SAND, 0.25)); g.lineWidth = 0.035; g.stroke();
    /* Rollwerk und Krone angedeutet */
    g.strokeStyle = rgbS(hell(SAND, -0.25)); g.lineWidth = 0.03;
    g.beginPath(); g.arc(x + w * 0.12, b - h * 0.5, w * 0.08, 0, Math.PI * 2); g.arc(x + w * 0.88, b - h * 0.5, w * 0.08, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.moveTo(a - sw * 0.25, sy + sh * 0.3); g.lineTo(a + sw * 0.25, sy + sh * 0.3); g.moveTo(a, sy + sh * 0.12); g.lineTo(a, sy + sh * 0.8); g.stroke();
    g.fillStyle = rgbS(hell(SAND, -0.15));
    g.beginPath(); g.moveTo(a - sw * 0.35, sy - 0.02); g.lineTo(a - sw * 0.25, sy - h * 0.13); g.lineTo(a, sy - 0.04); g.lineTo(a + sw * 0.25, sy - h * 0.13); g.lineTo(a + sw * 0.35, sy - 0.02); g.closePath(); g.fill();
  }
  /* Stehende Sandsteinfigur (am Portal) */
  function steinfigur(g, F, a, b, h) {
    const k = h / 1.8;
    const sv = F.schatten(0.25);
    const umriss = (dx, dy) => {
      g.beginPath();
      g.ellipse(a + dx, b - 1.62 * k + dy, 0.12 * k, 0.15 * k, 0, 0, Math.PI * 2);
      g.moveTo(a - 0.2 * k + dx, b - 1.42 * k + dy); g.lineTo(a + 0.2 * k + dx, b - 1.42 * k + dy);
      g.lineTo(a + 0.26 * k + dx, b - 0.7 * k + dy); g.lineTo(a + 0.3 * k + dx, b + dy); g.lineTo(a - 0.3 * k + dx, b + dy);
      g.lineTo(a - 0.26 * k + dx, b - 0.7 * k + dy); g.closePath();
    };
    if (sv) { g.fillStyle = "rgba(40,34,36,0.3)"; umriss(sv[0], sv[1]); g.fill(); }
    const gr = g.createLinearGradient(a - 0.3 * k, 0, a + 0.3 * k, 0);
    gr.addColorStop(0, rgbS(hell(SAND_D, 0.1))); gr.addColorStop(0.5, rgbS(SAND)); gr.addColorStop(1, rgbS(hell(SAND_D, -0.2)));
    g.fillStyle = gr; umriss(0, 0); g.fill();
    if (F.px > 14) { g.strokeStyle = "rgba(70,56,38,0.4)"; g.lineWidth = 0.02; for (const t of [-0.1, 0.05, 0.16]) { g.beginPath(); g.moveTo(a + t * k, b - 1.3 * k); g.lineTo(a + t * 1.3 * k, b); g.stroke(); } }
    /* Sockel */
    g.fillStyle = rgbS(hell(SAND, -0.05)); g.fillRect(a - 0.34 * k, b, 0.68 * k, 0.5);
  }
  /* Hauptportal: tiefer Rundbogen, Holztür, Figuren, Inschrift */
  function portal(g, F, a, b) {
    const w = 1.7, h = 3.0, x = a - w / 2, y = b - h;
    gewaende(g, F, x - 0.12, y - 0.12, w + 0.24, h + 0.12, "b", 0.3);
    /* Laibung (tief) */
    g.fillStyle = rgbS(hell(SAND_D, -0.15)); oeffnungPfad(g, x, y, w, h, "b"); g.fill();
    const sv = F.schatten(0.7);
    g.save(); oeffnungPfad(g, x, y, w, h, "b"); g.clip();
    const tx = x + 0.18, tw = w - 0.36, ty = y + 0.2;
    PI.tuer(g, tx, ty, tw, h - 0.2, F, { bogen: true, farbe: "#5a3a24", fluegel: 2 });
    if (sv) { g.fillStyle = "rgba(20,18,26,0.42)"; g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y); g.lineTo(x + w + sv[0], y + sv[1]); g.lineTo(x + sv[0], y + sv[1] + h); g.lineTo(x, y + h); g.fill(); }
    else { g.fillStyle = "rgba(20,18,26,0.25)"; g.fillRect(x, y, w, h); }
    g.restore();
    /* Figuren links und rechts auf Konsolen */
    steinfigur(g, F, a - 1.55, b - 0.9, 1.85);
    steinfigur(g, F, a + 1.55, b - 0.9, 1.85);
    /* Inschriftplatte */
    g.fillStyle = rgbS(hell(SAND, 0.1)); g.fillRect(a - 1.0, y - 0.72, 2.0, 0.36);
    if (F.px > 18) { g.fillStyle = "rgba(70,54,34,0.8)"; g.font = "bold 0.2px serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("RATHAUS", a, y - 0.54); }
  }
  /* Zifferblatt */
  function zifferblatt(g, F, a, zm, r) {
    const c = zm;
    const sv = F.schatten(0.08);
    if (sv) { g.fillStyle = "rgba(40,34,36,0.28)"; g.beginPath(); g.arc(a + sv[0], c + sv[1], r + 0.1, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = rgbS(hell(SAND, -0.05)); g.beginPath(); g.arc(a, c, r + 0.12, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#f4f1e6"; g.beginPath(); g.arc(a, c, r, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#2a2a2a"; g.lineWidth = r * 0.04; g.beginPath(); g.arc(a, c, r * 0.97, 0, Math.PI * 2); g.stroke();
    if (F.px > 6) {
      g.fillStyle = "#222";
      for (let i = 0; i < 12; i++) {
        const an = i * Math.PI / 6;
        g.save(); g.translate(a + Math.sin(an) * r * 0.8, c - Math.cos(an) * r * 0.8); g.rotate(an);
        g.fillRect(-r * 0.03, -r * 0.09, r * 0.06, r * 0.18); g.restore();
      }
    }
    /* Zeiger: zehn vor drei – wie auf Xanders Foto */
    const zeiger = (an, l, b) => { g.save(); g.translate(a, c); g.rotate(an); g.fillStyle = "#1b1b1b"; g.beginPath(); g.moveTo(-b, 0); g.lineTo(0, -l); g.lineTo(b, 0); g.lineTo(0, l * 0.15); g.closePath(); g.fill(); g.restore(); };
    zeiger((2 + 50 / 60) / 12 * Math.PI * 2, r * 0.55, r * 0.06);
    zeiger(50 / 60 * Math.PI * 2, r * 0.82, r * 0.045);
    g.fillStyle = "#1b1b1b"; g.beginPath(); g.arc(a, c, r * 0.06, 0, Math.PI * 2); g.fill();
  }
  /* Schallarkade der Glockenstube */
  function schallarkade(g, F, a, b, w, h) {
    const x = a - w / 2, y = b - h;
    gewaende(g, F, x, y, w, h, "b", 0.16);
    g.fillStyle = "#26282b"; oeffnungPfad(g, x, y, w, h, "b"); g.fill();
    if (F.px > 8) {
      g.save(); oeffnungPfad(g, x, y, w, h, "b"); g.clip();
      for (let yy = y + w / 2; yy < b; yy += 0.2) { g.fillStyle = "#5b4d3f"; g.fillRect(x, yy, w, 0.08); g.fillStyle = "#3a3129"; g.fillRect(x, yy + 0.08, w, 0.03); }
      g.restore();
    }
  }
  /* Schrift in Antiqua, erhaben */
  function schrift(g, F, a, b, text, h) {
    if (F.px < 10) return;
    g.save(); g.font = "bold " + h + "px serif"; g.textAlign = "center"; g.textBaseline = "alphabetic";
    g.fillStyle = "rgba(60,44,30,0.85)"; g.fillText(text, a + 0.015, b + 0.015);
    g.fillStyle = "#3a2c20"; g.fillText(text, a, b); g.restore();
  }
  /* Konsole unter dem Balkon */
  function konsole(g, F, a, b) {
    const sv = F.schatten(0.5);
    const pfad = (dx, dy) => { g.beginPath(); g.moveTo(a - 0.2 + dx, b + dy); g.lineTo(a + 0.2 + dx, b + dy); g.lineTo(a + 0.14 + dx, b + 0.9 + dy); g.quadraticCurveTo(a + dx, b + 1.15 + dy, a - 0.14 + dx, b + 0.9 + dy); g.closePath(); };
    if (sv) { g.fillStyle = "rgba(40,34,36,0.3)"; pfad(sv[0], sv[1]); g.fill(); }
    g.fillStyle = rgbS(hell(SAND_D, 0.05)); pfad(0, 0); g.fill();
    if (F.px > 10) { g.fillStyle = rgbS(hell(SAND, 0.1)); g.beginPath(); g.arc(a, b + 0.35, 0.1, 0, Math.PI * 2); g.fill(); }
  }

  /* FASSUNG 812 — LICHTERKETTE. XANDER zum Winterfoto vom Obermarkt: „im Winter kannst du es auch genauso darstellen".
     Auf dem Foto hängt eine warmweiße Lichterkette in flachen Bögen unter dem Sandstein-Gesims über dem Erdgeschoss,
     rund um Westflügel, Turm und Giebelbau. Tagsüber sieht man Draht und kleine Birnchen, nachts leuchten sie. */
  const KETTE_BOGEN = 2.1, KETTE_DURCH = 0.3;
  function kettenPunkte(F, E) {
    const y0 = bz(F, E.rustika) + 0.1, n = Math.max(1, Math.round(F.w / KETTE_BOGEN)), sp = F.w / n, aus = [];
    for (let i = 0; i < n; i++) for (let k = 1; k < 8; k++) { const t = k / 8; aus.push([i * sp + t * sp, y0 + 4 * KETTE_DURCH * t * (1 - t)]); }
    return { y0: y0, n: n, sp: sp, birnen: aus };
  }
  function lichterketteMalen(g, F, E) {
    if (F.jahr !== "winter" || !E.rustika || E.rustika >= F.flaeche.o[2] || F.px < 3) return;
    const K = kettenPunkte(F, E);
    g.strokeStyle = "rgba(38,42,34,0.75)"; g.lineWidth = Math.max(0.02, 0.6 / F.px);
    g.beginPath();
    for (let i = 0; i < K.n; i++) { const x = i * K.sp; g.moveTo(x, K.y0); g.quadraticCurveTo(x + K.sp / 2, K.y0 + 2 * KETTE_DURCH, x + K.sp, K.y0); }
    g.stroke();
    g.fillStyle = "rgba(255,238,196,0.95)";
    const r = Math.max(0.035, 0.8 / F.px);
    for (const [x, y] of K.birnen) { g.beginPath(); g.arc(x, y + r * 0.6, r, 0, Math.PI * 2); g.fill(); }
  }
  function lichterketteLeuchten(g, F, E) {
    if (F.jahr !== "winter" || !E.rustika || E.rustika >= F.flaeche.o[2] || F.nacht <= 0.02) return;
    const K = kettenPunkte(F, E), a = F.nacht;
    const r = Math.max(0.05, 1 / F.px);
    for (const [x, y] of K.birnen) {
      const gr = g.createRadialGradient(x, y, 0, x, y, r * 3.2);
      gr.addColorStop(0, "rgba(255,236,190," + (0.95 * a).toFixed(3) + ")"); gr.addColorStop(0.3, "rgba(255,214,140," + (0.5 * a).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,200,120,0)");
      g.fillStyle = gr; g.fillRect(x - r * 3.2, y - r * 3.2, r * 6.4, r * 6.4);
    }
    /* Schein in die Szene: einer je zweitem Bogen, schwach (sonst würde die Fassade überstrahlt) */
    for (let i = 0; i < K.n; i += 2) F.leuchtPunkt(i * K.sp + K.sp / 2, K.y0 + KETTE_DURCH, 1.7, "255,214,150", 0.22);
  }

  /* =====================================================================
     WAND-MALER: Putz, Rustika, Bänder, Eckquader, dann alle Stücke
     E = { putz, rustika (z), sockel (z), baender [z], kranz (z Unterkante),
           ecken [[x,y], …], el [ … ] }
     ===================================================================== */
  function wand(E) {
    const malen = function (g, F) {
      /* wenige Rauschbilder (jedes kostet beim ersten Mal Rechenzeit) */
      const saat = 1 + ((F.flaeche.name || "").length % 3);
      putzMalen(g, F, E.putz || PUTZ, saat);
      const zO = F.flaeche.o[2];
      if (E.rustika) {
        const y = bz(F, E.rustika), yS = bz(F, E.sockel || 0.65);
        steinwerk(g, F, RUSTIKA, -0.1, y, F.w + 0.2, yS - y, yS);
        steinwerk(g, F, SOCKEL, -0.1, yS, F.w + 0.2, F.h - yS + 0.2, yS);
        band(g, F, yS - 0.06, 0.1);
      }
      if (E.ecken) for (const c of E.ecken) {
        const a = fk(F, [c[0], c[1], 0])[0];
        const dir = a < F.w / 2 ? 1 : -1;
        eckquader(g, F, a, dir, E.kranz ? bz(F, E.kranz) : 0, E.rustika ? bz(F, E.rustika) : F.h);
      }
      for (const z of E.baender || []) if (z < zO) band(g, F, bz(F, z), 0.2);
      if (E.kranz && E.kranz < zO) kranz(g, F, bz(F, E.kranz), Math.min(0.5, zO - E.kranz));
      for (const e of E.el || []) {
        const [a, b] = fk(F, e.p);
        if (a < -2 || a > F.w + 2) continue;
        switch (e.t) {
          case "f": fensterMalen(g, F, e, a, b); break;
          case "wappen": wappen(g, F, a, b, e.w, e.h); break;
          case "portal": portal(g, F, a, b); break;
          case "uhr": zifferblatt(g, F, a, b, e.r); break;
          case "schall": schallarkade(g, F, a, b, e.w, e.h); break;
          case "schrift": schrift(g, F, a, b, e.text, e.h); break;
          case "rohr": fallrohr(g, F, a, bz(F, e.z1), bz(F, e.z0)); break;
          case "konsole": konsole(g, F, a, b); break;
          case "figur": steinfigur(g, F, a, b, e.h); break;
          case "band": band(g, F, b, e.h || 0.2, a - e.w / 2, a + e.w / 2); break;
        }
      }
      if (F.jahr === "winter" && F.px > 6) {
        /* Schnee auf Gesimsen und Fensterbänken */
        g.fillStyle = "rgba(248,250,255,0.9)";
        for (const z of E.baender || []) if (z < zO) g.fillRect(-0.1, bz(F, z) - 0.05, F.w + 0.2, 0.06);
        for (const e of E.el || []) if (e.t === "f" && e.form !== "o") { const [a, b] = fk(F, e.p); g.fillRect(a - e.w / 2 - 0.12, b + 0.04, e.w + 0.24, 0.05); }
      }
      lichterketteMalen(g, F, E);
    };
    const leuchten = function (g, F) {
      for (const e of E.el || []) {
        const [a, b] = fk(F, e.p);
        if (e.t === "f") fensterLeuchten(g, F, e, a, b);
        else if (e.t === "uhr") {
          /* beleuchtetes Zifferblatt */
          const gr = g.createRadialGradient(a, b, 0, a, b, e.r);
          gr.addColorStop(0, "rgba(255,244,210," + (0.85 * F.nacht) + ")"); gr.addColorStop(1, "rgba(255,226,170," + (0.6 * F.nacht) + ")");
          g.fillStyle = gr; g.beginPath(); g.arc(a, b, e.r * 0.95, 0, Math.PI * 2); g.fill();
          g.strokeStyle = "rgba(30,24,20," + F.nacht + ")"; g.lineCap = "round";
          const zg = (an, l, w) => { g.lineWidth = w; g.beginPath(); g.moveTo(a, b); g.lineTo(a + Math.sin(an) * l, b - Math.cos(an) * l); g.stroke(); };
          zg((2 + 50 / 60) / 12 * Math.PI * 2, e.r * 0.55, e.r * 0.09); zg(50 / 60 * Math.PI * 2, e.r * 0.82, e.r * 0.06);
          F.leuchtPunkt(a, b, e.r * 2.2, "255,226,170", 0.5);
        } else if (e.t === "portal") {
          F.leuchtPunkt(a, b - 1.4, 2.5, "255,190,120", 0.6);
        }
      }
      lichterketteLeuchten(g, F, E);
    };
    return { malen: aufCpu(malen), leuchten: leuchten };
  }

  /* ---------------- Dach ----------------
     Biberschwanz, dazu gemalte Fledermausgauben (Weltpunkte) und Schnee */
  function dach(E) {
    E = E || {};
    return aufCpu(function (g, F) {
      const fb = E.farbe || ZIEGEL;
      musterFuellen(g, kachel("z" + fb, ZB * ZN, ZR * ZM, dichteVon(F), ziegelKachel(fb)), ZB * ZN, ZR * ZM, -1, -1, F.w + 2, F.h + 2, 0, 0);
      if (F.px > 3) { PI.rauschen(g, 0, 0, F.w, F.h, 4.5, 0.18, 8, 4); PI.rauschen(g, 0, 0, F.w, F.h, 11, 0.12, 3, 3); }
      for (const p of E.fleder || []) {
        const [a, b] = fk(F, p);
        const w = 1.5, h = 0.55;
        const gr = g.createLinearGradient(0, b - h, 0, b);
        gr.addColorStop(0, "rgba(255,255,255,0.18)"); gr.addColorStop(1, "rgba(0,0,0,0.12)");
        g.fillStyle = rgbS(hell(hex(E.farbe || ZIEGEL), -0.1));
        g.beginPath(); g.moveTo(a - w, b); g.bezierCurveTo(a - w * 0.45, b, a - w * 0.4, b - h, a, b - h); g.bezierCurveTo(a + w * 0.4, b - h, a + w * 0.45, b, a + w, b); g.closePath(); g.fill();
        g.fillStyle = gr; g.fill();
        g.fillStyle = "#2c3038"; g.beginPath(); g.ellipse(a, b - 0.02, 0.42, 0.22, 0, Math.PI, 0); g.fill();
        g.strokeStyle = RAHMEN; g.lineWidth = 0.04; g.beginPath(); g.ellipse(a, b - 0.02, 0.42, 0.22, 0, Math.PI, 0); g.stroke();
        g.beginPath(); g.moveTo(a, b - 0.24); g.lineTo(a, b); g.stroke();
      }
      if (F.jahr === "winter") PI.schneeDach(g, 0, 0, F.w, F.h, F, { saat: 11 + (F.flaeche.name || "").length });
    });
  }
  /* Schiefer der kleinen Dächer (Erker, Türmchen) */
  function schiefer(farbe) {
    return function (g, F) {
      const c = farbe || SCHIEFER;
      g.fillStyle = rgbS(c); g.fillRect(-1, -1, F.w + 2, F.h + 2);
      if (F.px > 8) {
        g.strokeStyle = rgbS(hell(c, -0.3), 0.6); g.lineWidth = 0.015;
        for (let y = 0.2; y < F.h; y += 0.2) { g.beginPath(); g.moveTo(0, y); g.lineTo(F.w, y); g.stroke(); }
      }
      rausch(g, 0, 0, F.w, F.h, 1, 0.15, 3);
      if (F.jahr === "winter") { g.fillStyle = "rgba(246,248,252,0.85)"; g.fillRect(-1, -1, F.w + 2, F.h + 2); }
    };
  }
  const sandMaler = (g, F) => { steinFlaeche(g, -1, -1, F.w + 2, F.h + 2, SAND, F, 9); if (F.jahr === "winter" && F.flaeche.v[2] > -0.5 && Math.abs(F.flaeche.u[2]) < 0.01 && Math.abs(F.flaeche.v[2]) < 0.2) { g.fillStyle = "rgba(246,248,252,0.9)"; g.fillRect(-1, -1, F.w + 2, F.h + 2); } };
  const bodenMaler = (farbe) => (g, F) => {
    g.fillStyle = farbe; g.fillRect(-1, -1, F.w + 2, F.h + 2); rausch(g, 0, 0, F.w, F.h, 1, 0.14, 4);
    if (F.jahr === "winter") { g.fillStyle = "rgba(246,248,252,0.92)"; g.fillRect(-1, -1, F.w + 2, F.h + 2); }
  };

  /* =====================================================================
     DREHKÖRPER (Figuren): Turmhaube, Laterne, Zwiebeln, Kugeln
     profil: Abschnitte { h0, h1, r(t) , farbe, art } von unten nach oben
     ===================================================================== */
  function lichtFarbe(Z, nx, ny, nz, jahr) {
    return ST.lichtFaktor([nx, ny, nz], Z, 0, jahr);
  }
  function drehkoerper(profil, opt) {
    opt = opt || {};
    return function (g, s, F) {
      const k = KZ * s;
      for (const seg of profil) {
        const N = seg.n || 10;
        const rr = (t) => (typeof seg.r === "function" ? seg.r(t) : seg.r);
        const links = [], rechts = [];
        for (let i = 0; i <= N; i++) { const t = i / N, h = seg.h0 + (seg.h1 - seg.h0) * t, r = rr(t); links.push([-r * s, -h * k]); rechts.push([r * s, -h * k]); }
        const r0 = rr(0), r1 = rr(1);
        g.beginPath();
        /* unten die vordere Hälfte der Ellipse, oben die hintere */
        g.ellipse(0, -seg.h0 * k, Math.max(0.01, r0 * s), Math.max(0.01, r0 * s * 0.5), 0, Math.PI, 0, true);
        for (let i = 0; i <= N; i++) g.lineTo(rechts[i][0], rechts[i][1]);
        g.ellipse(0, -seg.h1 * k, Math.max(0.01, r1 * s), Math.max(0.01, r1 * s * 0.5), 0, 0, Math.PI, true);
        for (let i = N; i >= 0; i--) g.lineTo(links[i][0], links[i][1]);
        g.closePath();
        if (F.schatten) { g.fillStyle = "#000"; g.fill(); continue; }
        const rm = Math.max(r0, r1, rr(0.5), 0.01);
        /* Neigung der Mantellinie → Normale mit z-Anteil */
        const dz = (seg.h1 - seg.h0), dr = r1 - r0;
        const nzv = -dr / Math.hypot(dr, dz || 1e-6) * (dz >= 0 ? 1 : -1);
        const nh = Math.sqrt(Math.max(0, 1 - nzv * nzv));
        const gr = g.createLinearGradient(-rm * s, 0, rm * s, 0);
        const basis = seg.farbe;
        for (let i = 0; i <= 8; i++) {
          const t = -1 + i / 4;
          const tt = klemm(t, -0.999, 0.999), c = Math.sqrt(1 - tt * tt);
          /* Kamera: rechts = (1,-1)/√2, zum Auge = (1,1)/√2 */
          const nx = (tt + c) / Math.SQRT2 * nh, ny = (-tt + c) / Math.SQRT2 * nh;
          const lf = lichtFarbe(F.Z, nx, ny, nzv, F.jahr);
          gr.addColorStop(i / 8, rgbS([basis[0] * lf[0], basis[1] * lf[1], basis[2] * lf[2]]));
        }
        g.fillStyle = gr; g.fill();
        /* Oberseite (Gesims): hell */
        if (seg.deckel) {
          const lf = lichtFarbe(F.Z, 0, 0, 1, F.jahr);
          g.fillStyle = rgbS([seg.farbe[0] * lf[0], seg.farbe[1] * lf[1], seg.farbe[2] * lf[2]]);
          g.beginPath(); g.ellipse(0, -seg.h1 * k, r1 * s, r1 * s * 0.5, 0, 0, Math.PI * 2); g.fill();
        }
        /* Öffnungen (Laterne): dunkle Rundbögen quer über die Rundung */
        if (seg.oeffnungen && s > 5) {
          const hU = seg.h0 + (seg.h1 - seg.h0) * 0.12, hO = seg.h0 + (seg.h1 - seg.h0) * 0.82;
          for (const t of seg.oeffnungen) {
            const bw = rm * s * 0.34 * Math.sqrt(1 - t * t), cx = t * rm * s;
            g.fillStyle = "#1f2124";
            g.beginPath(); g.moveTo(cx - bw, -hU * k); g.lineTo(cx - bw, -hO * k + bw); g.arc(cx, -hO * k + bw, bw, Math.PI, 0); g.lineTo(cx + bw, -hU * k); g.closePath(); g.fill();
            if (F.nacht > 0.05 && seg.licht) { g.fillStyle = "rgba(255,200,120," + (0.7 * F.nacht) + ")"; g.fill(); }
          }
        }
        /* Fensterchen im Zylinder (Ecktürmchen) */
        if (seg.fensterchen && s > 6) {
          const hm = (seg.h0 + seg.h1) / 2;
          g.fillStyle = "#2c3038"; g.fillRect(-0.12 * s, -(hm + 0.3) * k, 0.24 * s, 0.6 * k);
        }
        /* Schnee oben auf Hauben */
        if (F.jahr === "winter" && seg.schnee) {
          g.save(); g.clip();
          g.fillStyle = "rgba(246,248,252,0.88)";
          g.beginPath(); g.ellipse(0, -seg.h1 * k, rm * s * 1.1, (seg.h1 - seg.h0) * k * 0.55, 0, 0, Math.PI * 2); g.fill();
          g.restore();
        }
      }
      /* Spitze: Stange, Kugel, Wetterfahne */
      if (opt.spitze) {
        const [h0, h1, rk] = opt.spitze;
        if (F.schatten) { g.fillStyle = "#000"; g.fillRect(-0.03 * s, -h1 * k, 0.06 * s, (h1 - h0) * k); g.beginPath(); g.arc(0, -(h0 + (h1 - h0) * 0.3) * k, rk * s, 0, Math.PI * 2); g.fill(); return; }
        g.fillStyle = "#3a3a36"; g.fillRect(-0.03 * s, -h1 * k, 0.06 * s, (h1 - h0) * k);
        const ky = -(h0 + (h1 - h0) * 0.3) * k;
        const gr = g.createRadialGradient(-rk * s * 0.4, ky - rk * s * 0.4, 0, 0, ky, rk * s);
        gr.addColorStop(0, "#fff2c0"); gr.addColorStop(0.4, rgbS(GOLD)); gr.addColorStop(1, rgbS(hell(GOLD, -0.45)));
        g.fillStyle = gr; g.beginPath(); g.arc(0, ky, rk * s, 0, Math.PI * 2); g.fill();
        if (opt.fahne) {
          g.fillStyle = rgbS(hell(GOLD, -0.2));
          g.beginPath(); g.moveTo(0.03 * s, -(h1 - 0.1) * k); g.lineTo(0.55 * s, -(h1 - 0.22) * k); g.lineTo(0.03 * s, -(h1 - 0.4) * k); g.closePath(); g.fill();
        }
      }
    };
  }
  /* Profil-Hilfen */
  const kurve = (a, b, form) => (t) => a + (b - a) * (form ? form(t) : t);
  const glocke = (t) => 1 - Math.sqrt(1 - (1 - t) * (1 - t));

  /* Turmhaube: geschweifte Haube, offene Laterne, zweite Zwiebel, Spitze */
  const HAUBE = drehkoerper([
    { h0: 0, h1: 0.3, r: kurve(1.95, 1.82), farbe: SCHIEFER, n: 2 },
    { h0: 0.3, h1: 0.8, r: kurve(1.82, 1.42, (t) => Math.sin(t * Math.PI / 2)), farbe: SCHIEFER, n: 6 },
    { h0: 0.8, h1: 2.3, r: (t) => 1.42 + (0.62 - 1.42) * t * t + Math.sin(t * Math.PI) * 0.34, farbe: SCHIEFER, n: 12, schnee: true },
    { h0: 2.3, h1: 2.42, r: 0.92, farbe: SAND, deckel: true, n: 2 },
    { h0: 2.42, h1: 3.55, r: 0.8, farbe: [226, 218, 198], oeffnungen: [-0.62, 0, 0.62], licht: true, n: 2 },
    { h0: 3.55, h1: 3.7, r: 0.94, farbe: SAND, deckel: true, n: 2 },
    { h0: 3.7, h1: 5.0, r: (t) => (0.86 + Math.sin(t * Math.PI * 0.85) * 0.2) * (1 - Math.pow(t, 2.2)) + 0.06, farbe: SCHIEFER, n: 12, schnee: true },
    { h0: 5.0, h1: 5.2, r: 0.08, farbe: SCHIEFER, n: 2 }
  ], { spitze: [5.15, 6.15, 0.17], fahne: true });
  /* Ecktürmchen am Umgang: runder Schaft, Gesims, Zwiebel */
  const ECKTURM = drehkoerper([
    { h0: 0, h1: 1.9, r: 0.36, farbe: [232, 224, 206], fensterchen: true, n: 2 },
    { h0: 1.9, h1: 2.05, r: 0.44, farbe: SAND, deckel: true, n: 2 },
    { h0: 2.05, h1: 3.15, r: (t) => (0.42 + Math.sin(t * Math.PI * 0.8) * 0.12) * (1 - Math.pow(t, 2.2)) + 0.03, farbe: SCHIEFER, n: 12, schnee: true }
  ], { spitze: [3.1, 3.6, 0.09] });
  /* Haube der Türmchen am Giebel: geschweifte Pyramide */
  const TUERMCHENHAUBE = drehkoerper([
    { h0: 0, h1: 0.25, r: kurve(1.0, 0.85), farbe: SCHIEFER, n: 3 },
    { h0: 0.25, h1: 1.6, r: kurve(0.85, 0.05, (t) => Math.sin(t * Math.PI / 2)), farbe: SCHIEFER, n: 10, schnee: true }
  ], { spitze: [1.55, 2.05, 0.1] });
  /* Dachreiter des Westflügels: Kupferhaube */
  /* FASSUNG 812 — nach Xanders Foto: unten ausgestellt, dann geschweift (eingezogen) zur Spitze, obenauf die goldene Kugel */
  const DACHREITERHAUBE = drehkoerper([
    { h0: 0, h1: 0.16, r: kurve(1.0, 0.92), farbe: KUPFER, n: 2 },
    { h0: 0.16, h1: 0.5, r: kurve(0.92, 0.66, (t) => Math.sin(t * Math.PI / 2)), farbe: KUPFER, n: 5 },
    { h0: 0.5, h1: 1.7, r: (t) => 0.66 * Math.pow(1 - t, 1.7) + 0.05, farbe: KUPFER, n: 10, schnee: true }
  ], { spitze: [1.65, 2.25, 0.12] });
  const KUGEL = (r) => drehkoerper([{ h0: 0, h1: 2 * r, r: (t) => Math.max(0.02, Math.sin(t * Math.PI) * r), farbe: SAND, n: 8, schnee: true }]);

  function figurKoerper(W, name, x, y, z, r, h, malen, zusatzEbenen) {
    if (z + h * 0.6 > W.zMax) return;
    W.teil(name);
    const pts = [];
    for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4; pts.push([x + Math.cos(an) * r, y + Math.sin(an) * r, z], [x + Math.cos(an) * r, y + Math.sin(an) * r, z + h]); }
    W.huelle(pts, [[[0, 0, -1], -z]].concat(zusatzEbenen || []));
    const p = S([x, y, z]);
    W.M.figur({ x: p[0], y: p[1], z: p[2], breite: r * 2.2, hoehe: h, malen: malen });
  }

  /* =====================================================================
     STUFENGIEBEL mit Voluten
     Liefert das Umriss-Vieleck (a, z) über der Breite b ab zB, dazu die
     Voluten-Augen und die Stufen (für Abdeckplatten und Schnee).
     ===================================================================== */
  function stufengiebel(b, zB, tan, ue, n, kr) {
    const zr = (a) => zB + (Math.min(a, b - a) + ue) * tan;
    const aK = b / 2 - kr;                         // Beginn des Rundbogen-Abschlusses
    const as = [], hs = [];
    for (let i = 0; i < n; i++) as.push(aK * i / n);
    for (let i = 0; i < n; i++) hs.push(zr(i + 1 < n ? as[i + 1] : aK) + 0.35);
    const zK = hs[n - 1] + 0.9;                    // Kämpfer des Abschlusses
    const L = [], augen = [];
    L.push([0, zB]);
    for (let i = 0; i < n; i++) {
      const a = as[i], hU = i ? hs[i - 1] : zB, hO = hs[i];
      /* Volute: runde Schnecke unten außen, eingezogener Hals nach oben */
      const r = Math.min(0.32, (hO - hU) * 0.22), cx = a - 0.3, cz = hU + r;
      if (i) L.push([cx, hU]);
      for (let k = 0; k <= 6; k++) { const th = (270 - k * 30) * RAD; L.push([cx + Math.cos(th) * r, cz + Math.sin(th) * r]); }
      for (let k = 1; k <= 5; k++) { const t = k / 5; L.push([cx + (a - cx) * (1 - (1 - t) * (1 - t)), cz + r + (hO - cz - r) * t]); }
      augen.push([cx, cz, r]);
      const aN = i + 1 < n ? as[i + 1] : aK;
      L.push([aN - (i + 1 < n ? 0.3 : 0), hO]);
    }
    L.push([aK, hs[n - 1]]);
    L.push([aK, zK]);
    for (let k = 1; k < 12; k++) { const th = (180 - k * 15) * RAD; L.push([b / 2 + Math.cos(th) * kr, zK + Math.sin(th) * kr]); }
    L.push([b - aK, zK]);
    /* rechte Hälfte gespiegelt */
    const links = L.slice(1, L.length - 12);   // von der Traufe bis zum Kämpfer links
    const R = [];
    for (let i = links.length - 1; i >= 0; i--) R.push([b - links[i][0], links[i][1]]);
    const umriss = L.concat(R.slice(1)).concat([[b, zB]]);
    const augen2 = augen.concat(augen.map(([x, z, r]) => [b - x, z, r]));
    return { umriss: umriss, augen: augen2, top: zK + kr, aK: aK, zK: zK, hs: hs, as: as, b: b };
  }
  /* Giebel als Scheibe (Dicke d) bauen: vorn bemalt, hinten Putz, Kanten
     als Abdeckplatten. p0 = linker Fußpunkt (Außenansicht), dir = Richtung
     entlang der Breite, nAus = Normale nach außen. */
  function giebelScheibe(W, name, p0, dir, nAus, d, G, E) {
    W.teil(name);
    const P = (a, z, t) => [p0[0] + dir[0] * a - nAus[0] * t, p0[1] + dir[1] * a - nAus[1] * t, z];
    const vorn = G.umriss.map(([a, z]) => P(a, z, 0)), hinten = G.umriss.map(([a, z]) => P(a, z, d));
    let mz = 0; for (const [, z] of G.umriss) mz += z; mz /= G.umriss.length;
    const innen = P(G.umriss.length ? (G.umriss[0][0] + G.umriss[G.umriss.length - 1][0]) / 2 : 0, mz, d / 2);
    const W1 = wand(E);
    const malenV = function (g, F) {
      W1.malen(g, F);
      /* Abdeckplatten entlang des Umrisses und Voluten-Augen */
      g.save();
      g.beginPath(); const um = F.flaeche.umriss; g.moveTo(um[0][0], um[0][1]); for (const q of um) g.lineTo(q[0], q[1]); g.closePath();
      g.strokeStyle = rgbS(hell(SAND, 0.05)); g.lineWidth = 0.42; g.stroke();
      g.strokeStyle = "rgba(90,74,50,0.35)"; g.lineWidth = 0.03; g.stroke();
      g.restore();
      for (const [a, z, r] of G.augen) {
        const [x, y] = fk(F, P(a, z, 0));
        g.fillStyle = rgbS(hell(SAND, -0.12)); g.beginPath(); g.arc(x, y, r * 0.75, 0, Math.PI * 2); g.fill();
        g.strokeStyle = rgbS(hell(SAND, 0.2)); g.lineWidth = 0.05; g.beginPath(); g.arc(x, y, r * 0.45, 0.3, Math.PI * 1.7); g.stroke();
        g.fillStyle = rgbS(hell(SAND, 0.18)); g.beginPath(); g.arc(x, y, r * 0.18, 0, Math.PI * 2); g.fill();
      }
      if (F.jahr === "winter") {
        /* Schnee auf den Stufen (beide Seiten) */
        g.fillStyle = "rgba(248,250,255,0.95)";
        const bb = G.b;
        for (let i = 0; i < G.hs.length; i++) {
          const aU = G.as[i], aN = i + 1 < G.as.length ? G.as[i + 1] : G.aK;
          for (const [x0, x1] of [[aU, aN], [bb - aN, bb - aU]]) {
            const A = fk(F, P(x0, G.hs[i], 0)), B2 = fk(F, P(x1, G.hs[i], 0));
            g.fillRect(Math.min(A[0], B2[0]), A[1] - 0.12, Math.abs(B2[0] - A[0]), 0.12);
          }
        }
      }
    };
    W.poly(vorn, innen, malenV, { leuchten: W1.leuchten, name: name + "v" });
    W.poly(hinten, innen, wand({ putz: PUTZ, el: [] }).malen, { name: name + "h" });
    /* Kanten der Scheibe (Abdeckplatten, Stirnseiten der Stufen). Der
       Umriss läuft im Uhrzeigersinn → Außennormale (−dz, da) je Kante. */
    for (let i = 0; i < vorn.length; i++) {
      const j = (i + 1) % vorn.length;
      if (Math.abs(vorn[i][2] - G.umriss[0][1]) < 0.01 && Math.abs(vorn[j][2] - G.umriss[0][1]) < 0.01) continue;
      const da = G.umriss[j][0] - G.umriss[i][0], dz = G.umriss[j][1] - G.umriss[i][1];
      const l = Math.hypot(da, dz); if (l < 1e-4) continue;
      const na = -dz / l, nz = da / l;
      const n3 = [dir[0] * na, dir[1] * na, nz];
      const m = mul(add(add(vorn[i], vorn[j]), add(hinten[i], hinten[j])), 0.25);
      W.poly([vorn[i], vorn[j], hinten[j], hinten[i]], sub(m, mul(n3, 0.1)), sandMaler, { name: name + "k" + i });
    }
  }

  /* =====================================================================
     GAUBE (Giebelgaube) auf einer Dachfläche
     e = Traufpunkt unter der Gaubenmitte, nA = waagrechte Normale nach
     außen, tan = Dachneigung, zE = Traufhöhe, s = Abstand der Front von
     der Traufe (waagrecht), w = Breite
     ===================================================================== */
  function gaube(W, name, e, nA, zE, tan, s, w) {
    const t = [-nA[1], nA[0]];                          // entlang der Traufe
    const P = (q, l, z) => [e[0] - nA[0] * q + t[0] * l, e[1] - nA[1] * q + t[1] * l, z];
    const zF = zE + s * tan, hw = 1.25, hg = 0.6;
    const zT = zF + hw, zR = zT + hg;
    const qT = s + hw / tan, qR = s + (hw + hg) / tan;
    if (zF >= W.zMax) return;
    W.teil(name);
    const innen = P(s + 0.4, 0, zF + 0.6);
    const hw2 = w / 2;
    /* Front mit Fenster und Giebeldreieck */
    const front = [P(s, -hw2, zT), P(s, 0, zR), P(s, hw2, zT), P(s, hw2, zF), P(s, -hw2, zF)];
    const fe = { t: "f", p: P(s, 0, zF + 0.18), w: 0.72, h: 0.95, form: "r", sprossen: [1, 2], gewaende: 0.08, bank: false, licht: 0.35 };
    const Wf = wand({ putz: PUTZ, el: [fe] });
    W.poly(front, innen, function (g, F) {
      Wf.malen(g, F);
      /* weißes Giebelgesims */
      const um = F.flaeche.umriss;
      g.strokeStyle = rgbS(hell(SAND, 0.1)); g.lineWidth = 0.12;
      g.beginPath(); g.moveTo(um[0][0], um[0][1]); g.lineTo(um[1][0], um[1][1]); g.lineTo(um[2][0], um[2][1]); g.lineTo(um[0][0], um[0][1]); g.stroke();
    }, { leuchten: Wf.leuchten, name: name + "f" });
    /* Seitenwangen */
    for (const sg of [-1, 1]) W.poly([P(s, sg * hw2, zT), P(qT, sg * hw2, zT), P(s, sg * hw2, zF)], innen, wand({ putz: PUTZ }).malen, { name: name + "w" + sg });
    /* Dach */
    const u = 0.15;
    for (const sg of [-1, 1]) W.poly([P(s - u, 0, zR + 0.05), P(qR, 0, zR + 0.05), P(qT, sg * (hw2 + u), zT - 0.03), P(s - u, sg * (hw2 + u), zT - 0.03)], innen, dach(), { name: name + "d" + sg });
  }

  /* =====================================================================
     BALKON — FASSUNG 824. XANDER: „schau dir mal das originale Foto an und
     dann siehst du auch, dass da auch so ne Art Balkon mit dabei ist. Den
     könntest du dann vielleicht mit anbringen zusätzlich da wird es richtig
     schön original aussehen". Auf dem Foto vom Obermarkt hängt er im 1. OG
     an der langen Seite des rechten Flügels (zum Brunnen), über den Bögen
     des Erdgeschosses: Steinplatte auf Konsolen, Balustrade mit Docken,
     Pfeiler mit Kugeln, Blumenkästen.
     Gebaut in eigenen Achsen: x entlang der Wand (xb0 … xb1), y von der
     Wand yW nach außen bis yb. kasten(name, x0, y0, z0, x1, y1, z1, seiten,
     oben) stellt einen Quader in den Grundriss, punkt(x, y) einen Punkt.
     ===================================================================== */
  function balkonMaler(g, F) {
    const n = Math.max(2, Math.round(F.w / 0.2));
    g.fillStyle = rgbS(hell(PI.hex(PUTZ), -0.25)); g.fillRect(-1, -1, F.w + 2, F.h + 2);
    for (let i = 0; i < n; i++) {
      const x = (i + 0.5) * F.w / n;
      const gr = g.createLinearGradient(x - 0.07, 0, x + 0.07, 0);
      gr.addColorStop(0, rgbS(hell(SAND, 0.15))); gr.addColorStop(1, rgbS(SAND_D));
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(x - 0.04, 0.16); g.quadraticCurveTo(x - 0.1, F.h * 0.6, x - 0.06, F.h - 0.08); g.lineTo(x + 0.06, F.h - 0.08); g.quadraticCurveTo(x + 0.1, F.h * 0.6, x + 0.04, 0.16); g.closePath(); g.fill();
    }
    for (const t of [0, 1 / 3, 2 / 3, 1]) { g.fillStyle = rgbS(SAND); g.fillRect(Math.min(F.w - 0.24, Math.max(0, t * F.w - 0.12)), 0, 0.24, F.h); }
    g.fillStyle = rgbS(hell(SAND, 0.2)); g.fillRect(-1, 0, F.w + 2, 0.15);
    if (F.jahr === "winter") { g.fillStyle = "rgba(248,250,255,0.95)"; g.fillRect(-1, 0, F.w + 2, 0.06); }
    else if (F.px > 8) {
      /* Blumen auf der Brüstung wie auf Xanders Foto (Geranien blühen bis zum ersten Frost, im Herbst etwas weniger) */
      const rng = F.rng, dicht = F.jahr === "herbst" ? 0.45 : 0.6;
      for (let x = 0.2; x < F.w - 0.2; x += 0.09) { g.fillStyle = rng() < dicht ? "#c8323a" : "#3f7a3a"; g.beginPath(); g.arc(x, -0.02 - rng() * 0.12, 0.05, 0, Math.PI * 2); g.fill(); }
      /* FASSUNG 829 — Ranken und Blüten aus den Blumenkästen hängen vorn über die Brüstung */
      for (let x = 0.1; x < F.w - 0.1; x += 0.11) {
        const l = 0.15 + rng() * 0.3;
        g.strokeStyle = rng() < 0.5 ? "#3f7a3a" : "#4f8a40"; g.lineWidth = 0.06;
        g.beginPath(); g.moveTo(x, 0.1); g.quadraticCurveTo(x + 0.05, 0.1 + l * 0.6, x + 0.02, 0.1 + l); g.stroke();
        if (rng() < 0.6) { g.fillStyle = rng() < 0.5 ? "#d8283a" : "#e84a6a"; g.beginPath(); g.arc(x + 0.02, 0.1 + l, 0.05, 0, Math.PI * 2); g.fill(); }
      }
    }
  }
  function balkonBauen(W, kasten, punkt, xb0, xb1, yW, yb, name) {
    const bz0 = 3.75, bz1 = 4.05, bz2 = 5.0, th = 0.18;
    kasten(name + "platte", xb0, yW, bz0, xb1, yb, bz1, { sued: { malen: sandMaler }, ost: { malen: sandMaler }, west: { malen: sandMaler } }, bodenMaler("#b9a888"));
    kasten(name + "br", xb0, yb - th, bz1, xb1, yb, bz2, { sued: { malen: balkonMaler }, nord: { malen: balkonMaler } }, sandMaler);
    kasten(name + "brW", xb0, yW, bz1, xb0 + th, yb - th, bz2, { west: { malen: balkonMaler }, ost: { malen: balkonMaler } }, sandMaler);
    kasten(name + "brO", xb1 - th, yW, bz1, xb1, yb - th, bz2, { west: { malen: balkonMaler }, ost: { malen: balkonMaler } }, sandMaler);
    const L = xb1 - xb0;
    for (const t of [0.02, 1 / 3, 2 / 3, 0.98]) { const q = punkt(xb0 + L * t, yb - 0.09); figurKoerper(W, name + "kugel" + t.toFixed(2), q[0], q[1], bz2, 0.2, 0.36, KUGEL(0.17)); }
    /* FASSUNG 829 — BLUMENKÄSTEN. XANDER: „dass das in diesem Seitenflügel noch so ein Balkon hat, so Blumenkästen, wo es
       sehr auffällig dort noch ist, wo das hervorsteht". Auf der Brüstung zwischen den Kugelpfeilern (vorn drei, an den
       Seiten je einer) stehen Kästen, aus denen rote und rosa Geranien quellen und grüne Ranken über die Brüstung hängen. */
    const kh = 0.7, kt = 0.34;
    for (let i = 0; i < 3; i++) {
      const a0 = xb0 + L * [0.02, 1 / 3, 2 / 3][i] + 0.26, a1 = xb0 + L * [1 / 3, 2 / 3, 0.98][i] - 0.26;
      kasten(name + "blumen" + i, a0, yb - kt + 0.06, bz2, a1, yb + 0.06, bz2 + kh, { sued: { malen: blumenkastenMaler }, ost: { malen: blumenkastenMaler }, west: { malen: blumenkastenMaler } }, blumenObenMaler);
    }
    for (const [x0, x1, s2] of [[xb0 - 0.04, xb0 + kt - 0.04, "W"], [xb1 - kt + 0.04, xb1 + 0.04, "O"]]) {
      kasten(name + "blumen" + s2, x0, yW + 0.15, bz2, x1, yb - 0.4, bz2 + kh, { sued: { malen: blumenkastenMaler }, ost: { malen: blumenkastenMaler }, west: { malen: blumenkastenMaler } }, blumenObenMaler);
    }
  }
  /* Kasten (unten, dunkelgrün mit hellem Rand) und darüber quellende Geranien; im Winter Tannengrün mit Schnee */
  function blumenkastenMaler(g, F) {
    const kb = 0.2, rng = F.rng || Math.random, winter = F.jahr === "winter";
    const yK = F.h - kb;
    g.fillStyle = "#2f5a3c"; g.fillRect(-0.05, yK, F.w + 0.1, kb + 0.05);
    g.fillStyle = "rgba(255,255,255,0.18)"; g.fillRect(-0.05, yK, F.w + 0.1, 0.035);
    g.fillStyle = "rgba(0,0,0,0.2)"; g.fillRect(-0.05, F.h - 0.04, F.w + 0.1, 0.04);
    const blueten = winter ? ["#2f5b35", "#3b6b3e"] : F.jahr === "herbst" ? ["#c8323a", "#d8465a", "#b82a32", "#e0607a"] : ["#d8283a", "#e84a6a", "#f07aa0", "#c8323a"];
    /* Laub */
    for (let x = 0.03; x < F.w; x += 0.07) {
      const hh = 0.2 + rng() * 0.22;
      g.fillStyle = rng() < 0.5 ? "#3f7a3a" : "#4f8a40";
      g.beginPath(); g.ellipse(x, yK - hh * 0.5, 0.07, hh * 0.6, 0, 0, Math.PI * 2); g.fill();
    }
    /* Blütendolden, dicht und auffällig */
    for (let x = 0.05; x < F.w - 0.02; x += 0.085) {
      const y = yK - 0.1 - rng() * 0.32;
      g.fillStyle = blueten[(rng() * blueten.length) | 0];
      g.beginPath(); g.arc(x + (rng() - 0.5) * 0.04, y, 0.065 + rng() * 0.03, 0, Math.PI * 2); g.fill();
      if (!winter && rng() < 0.5) { g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.arc(x - 0.015, y - 0.015, 0.018, 0, Math.PI * 2); g.fill(); }
    }
    /* Ranken, die vorn über den Kasten hängen */
    if (!winter) for (let x = 0.08; x < F.w - 0.05; x += 0.16 + rng() * 0.1) {
      g.strokeStyle = "#3f7a3a"; g.lineWidth = 0.035; g.beginPath(); g.moveTo(x, yK); g.quadraticCurveTo(x + 0.04, yK + 0.1, x + 0.01, F.h + 0.02); g.stroke();
    }
    if (winter) { g.fillStyle = "rgba(248,250,255,0.95)"; for (let x = 0; x < F.w; x += 0.1) { g.beginPath(); g.ellipse(x + 0.05, yK - 0.2, 0.07, 0.035, 0, 0, Math.PI * 2); g.fill(); } }
  }
  function blumenObenMaler(g, F) {
    const rng = F.rng || Math.random, winter = F.jahr === "winter";
    g.fillStyle = winter ? "#3b6b3e" : "#3f7a3a"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
    const blueten = winter ? ["rgba(248,250,255,0.95)"] : F.jahr === "herbst" ? ["#c8323a", "#d8465a", "#e0607a"] : ["#d8283a", "#e84a6a", "#f07aa0"];
    for (let x = 0.04; x < F.w; x += 0.08) for (let y = 0.04; y < F.h; y += 0.08) {
      if (rng() < 0.3) continue;
      g.fillStyle = blueten[(rng() * blueten.length) | 0];
      g.beginPath(); g.arc(x, y, 0.045, 0, Math.PI * 2); g.fill();
    }
  }

  /* =====================================================================
     BAUPHASEN
     ===================================================================== */
  function hoeheImBau(bau) {
    if (bau >= 1) return Infinity;
    if (bau < 0.05) return 0.25;
    const t = (bau - 0.05) / 0.9;
    return 0.25 + 33 * klemm(t, 0, 1);
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  ST.modell("rathaus_doebeln", {
    name: "Rathaus Döbeln", gruppe: "Wahrzeichen", grund: GRUND, hoehe: 32.5, bauzeit: 45 * 60,
    /* FASSUNG 819 — der Grundriss als Daten (schon mittig gerückt wie das Bild): je Flügel konvexe Stücke, das Portal
       (Mitte der Turmfront) und die Richtungen der Flügel vom Turm aus. Für die Sonde pruefe-819-rathaus-form.js und für
       dorf.js (D.GRUNDRISS.rathaus: Wege, Bäume, Leute vor dem Portal). */
    grundriss: {
      teile: Object.fromEntries(Object.keys(FLUEGEL).map((k) => [k, FLUEGEL[k].map((poly) => poly.map((p) => S([p[0], p[1], 0]).slice(0, 2).map((z) => Math.round(z * 100) / 100)))])),
      portal: S([TXM, TY1, 0]).slice(0, 2), turm: S([TXM, TYM, 0]).slice(0, 2),
      achsen: { A: [1, 0], B: [0, -1], C: CD.slice() }, grund: GRUND
    },
    bauen(M, o) {
      const B = blickVon(o), W = new Werk(M, B);
      const bau = o.bau == null ? 1 : o.bau;
      W.zMax = hoeheImBau(bau);

      /* ---------- Geschossraster ---------- */
      const EG = 1.1, OG1 = 4.45, OG2 = 6.95, OG3 = 9.95;
      const BAND = [Z_RUST, 6.65];
      const fEG = (x, y, extra) => Object.assign({ t: "f", p: [x, y, EG], w: 1.25, h: 2.2, form: "b", sprossen: [2, 3] }, extra);
      const fOG1 = (x, y, extra) => Object.assign({ t: "f", p: [x, y, OG1], w: 1.05, h: 1.75, form: "r", verdach: "gerade" }, extra);
      const fOG2 = (x, y, extra) => Object.assign({ t: "f", p: [x, y, OG2], w: 1.1, h: 2.15, form: "r", verdach: "dreieck", sprossen: [2, 3] }, extra);
      const fOG3 = (x, y, extra) => Object.assign({ t: "f", p: [x, y, OG3], w: 0.9, h: 1.2, form: "r", sprossen: [2, 2] }, extra);
      const keller = (x, y) => ({ t: "f", p: [x, y, 0.12], w: 0.6, h: 0.45, form: "b", sprossen: [1, 1], gewaende: 0.07, bank: false, licht: 0.1 });
      const reihe = (xs, fn) => xs.map(fn);

      /* ============ FLÜGEL A — rechts am Turm: vorn der Giebelbau (Stufengiebel zum Brunnen, EIN Satteldach nach
         hinten), rechts daneben ein Haus zur Seite mit Zeltdach ============
         FASSUNG 819 — Walkie 305: „rechts neben dem Eingang gibt es nichts was wie eine Mauer neben dem Eingang nach vorne
         geht sondern die Seite geht zur Seite nach rechts".
         FASSUNG 824 — XANDER: „Also dieses Doppeldach praktisch das gehört doch da gar nicht hin".
         FASSUNG 829 — XANDER: „Da gibt es wirklich nicht dieses Dach auf der Seite. Das ist einfach nur ein Haus zur Seite
         und das was du als Dach da gemacht hast. Das ist eigentlich die Ansicht auf die wir gucken auf dem Foto … Also
         dieser dreieckige Teil den wir im Gesicht haben." und „siehst du nicht im Foto, dass das in diesem Seitenflügel
         noch so ein Balkon hat, so Blumenkästen, wo es sehr auffällig dort noch ist, wo das hervorsteht".
         Auf dem Foto vom Obermarkt: der große Stufengiebel schaut zum Markt; links davon, zum Turm hin, hängt im 1. OG der
         Balkon auf Konsolen, die Brüstung voller Blumenkästen; links neben dem Giebel das vierkantige Türmchen mit
         dunkler Haube, rechts das runde. Darum hier:
           • Giebelbau (vorderer Teil des Grundrisses): Stufengiebel an der Front (+y), EIN First entlang y nach hinten
             (G_FX, G_FIRST), hinten ein Walm – kein zweiter Giebel, kein quer laufendes Dach.
           • Haus zur Seite (hinterer Teil des Grundrisses, 1 m zurückgesetzt): Zeltdach, niedriger als der Giebelbau,
             die rechte Seite ist eine schlichte Wand mit Fenstern – kein Giebel an der Seite. */
      const zGL = (x) => TRAUFE + (x - GX0) * G_TAN;                 // linke Dachfläche des Giebelbaus
      const zGR = (x) => TRAUFE + (GX1 - x) * G_TAN;                 // rechte Dachfläche des Giebelbaus
      /* Türmchen auf einer Dachfläche: vier Wände vom Dach (zAn(x, y)) bis tz1, Deckel, Haube */
      const tuermchen = (name, tx, ty, tb, tz1, zAn, fenster, haube, hr, hh) => {
        if (Math.min(zAn(tx - tb, ty - tb), zAn(tx + tb, ty + tb)) >= W.zMax) return;
        W.teil(name);
        const G4 = [[tx - tb, ty + tb], [tx + tb, ty + tb], [tx + tb, ty - tb], [tx - tb, ty - tb]];
        const innenT = [tx, ty, tz1 - 1];
        for (let i = 0; i < 4; i++) {
          const a = G4[i], b2 = G4[(i + 1) % 4];
          const We = wand({ putz: PUTZ, kranz: tz1 - 0.3, el: fenster(i, (a[0] + b2[0]) / 2, (a[1] + b2[1]) / 2) });
          W.poly([[a[0], a[1], tz1], [b2[0], b2[1], tz1], [b2[0], b2[1], zAn(b2[0], b2[1])], [a[0], a[1], zAn(a[0], a[1])]], innenT, We.malen, { leuchten: We.leuchten, name: name + i });
        }
        W.poly(G4.map(([x, y]) => [x, y, tz1]), innenT, schiefer(), { name: name + "o" });
        figurKoerper(W, name + "haube", tx, ty, tz1, hr, hh, haube);
      };
      /* ---- Giebelbau (am Turm) ---- */
      {
        const ax = (d) => GX0 + d;                              // Achsen, von der linken Kante gemessen
        const xs = [2.1, 4.7, 7.3, 9.9].map(ax);
        const balkonT = [1.8, 3.2].map(ax);                     // Balkontüren (links, zum Turm hin – wie auf dem Foto)
        const vorn = { putz: PUTZ, rustika: Z_RUST, baender: BAND, kranz: TRAUFE - 0.45, ecken: [[GX0, GY1], [GX1, GY1]], el: [] };
        vorn.el.push(...reihe(xs, (x) => fEG(x, GY1)), ...reihe(xs, (x) => keller(x, GY1)));
        vorn.el.push(...reihe(balkonT, (x) => ({ t: "f", p: [x, GY1, 4.05], w: 0.95, h: 2.2, form: "r", verdach: "gerade", sprossen: [2, 4] })));
        vorn.el.push(...reihe([8.8, 10.2].map(ax), (x) => fOG1(x, GY1, { w: 0.95, verdach: null })));
        vorn.el.push({ t: "band", p: [ax(9.5), GY1, OG1 + 1.75 + 0.45], w: 2.4, h: 0.16 });
        vorn.el.push({ t: "wappen", p: [ax(6), GY1, OG1 - 0.1], w: 1.5, h: 2.1 });
        for (const x of [0.9, 2.5, 4.1].map(ax)) vorn.el.push({ t: "konsole", p: [x, GY1, 3.75] });
        /* FASSUNG 812 — auf Xanders Foto (vom Brunnen aus) steht „Ratskeller" an der Giebelfront über dem dritten Bogen */
        vorn.el.push({ t: "schrift", p: [ax(8.6), GY1, 3.62], text: "Ratskeller", h: 0.4 });
        vorn.el.push(...reihe(xs, (x) => fOG2(x, GY1)));
        vorn.el.push(...reihe([3.9, 5.3, 6.7, 8.1].map(ax), (x) => fOG3(x, GY1, { w: 0.85, h: 1.1, p: [x, GY1, 10.2] })));
        vorn.el.push({ t: "rohr", p: [GX0 + 0.4, GY1, 0], z0: 0.3, z1: TRAUFE - 0.3 });
        const ostV = { putz: PUTZ, rustika: Z_RUST, baender: BAND, kranz: TRAUFE - 0.45, ecken: [[GX1, GY1]], el: [] };
        const ostH = { putz: PUTZ, rustika: Z_RUST, baender: BAND, kranz: TRAUFE - 0.45, ecken: [[GX1, GY0]], el: [] };
        for (const y of [(OY0 + GY0) / 2]) ostH.el.push(fEG(GX1, y), fOG1(GX1, y), fOG2(GX1, y, { verdach: "gerade" }), fOG3(GX1, y));
        const nord = { putz: PUTZ, rustika: Z_RUST, baender: BAND, kranz: TRAUFE - 0.45, ecken: [[GX1, GY0]], el: [] };
        for (const x of xs) nord.el.push(fEG(x, GY0), fOG1(x, GY0), fOG2(x, GY0, { verdach: "gerade" }), fOG3(x, GY0), keller(x, GY0));
        /* Körper: rechte Wand in zwei Teilen (vor dem Haus zur Seite / dahinter), links nichts (Turm, Flügel B) */
        const Wv = wand(vorn), Wo = wand(ostV), Wo2 = wand(ostH), Wn = wand(nord);
        W.prisma("fluegelA", [[GX0, GY1], [GX1, GY1], [GX1, OY1], [GX1, OY0], [GX1, GY0], [GX0, GY0]], 0, TRAUFE, (i) => {
          if (i === 0) return Wv;
          if (i === 1) return Wo;
          if (i === 3) return Wo2;
          if (i === 4) return Wn;
          return null;
        }, mauerkrone);
        /* Dach: EIN Satteldach, First entlang y von der Giebelfront nach hinten, hinten ein Walm */
        const d = 0.3;
        W.teil("giebeldach");
        const innen = [G_FX, (GY0 + GY1) / 2, TRAUFE + 2];
        W.poly([[GX0, GY1 - d, TRAUFE], [G_FX, GY1 - d, G_FIRST], [G_FX, G_FY0, G_FIRST], [GX0, GY0, TRAUFE]], innen,
          dach({ fleder: [GY1 - 7.4, GY1 - 4.4].map((y) => [GX0 + 3.2, y, zGL(GX0 + 3.2)]) }), { name: "gdw" });
        W.poly([[GX1, GY0, TRAUFE], [G_FX, G_FY0, G_FIRST], [G_FX, GY1 - d, G_FIRST], [GX1, GY1 - d, TRAUFE]], innen,
          dach({ fleder: [GY1 - 6.0].map((y) => [GX1 - 2.6, y, zGR(GX1 - 2.6)]) }), { name: "gdo" });
        W.poly([[GX0, GY0, TRAUFE], [G_FX, G_FY0, G_FIRST], [GX1, GY0, TRAUFE]], innen, dach(), { name: "gdwalm" });
        /* Der große Stufengiebel an der Front – „dieser dreieckige Teil den wir im Gesicht haben": vier Stufen mit
           Voluten, Rundbogen-Abschluss mit Wappen, obenauf die Kugel */
        const GG = stufengiebel(GX1 - GX0, TRAUFE, G_TAN, 0, 4, 1.35);
        const gVorn = { putz: PUTZ, el: [
          ...reihe([2.9, 3.9, 8.1, 9.1].map(ax), (x) => ({ t: "f", p: [x, GY1, 12.75], w: 0.78, h: 1.25, form: "r", sprossen: [2, 3], verdach: null })),
          ...reihe([5.4, 6.6].map(ax), (x) => ({ t: "f", p: [x, GY1, 14.9], w: 0.75, h: 1.15, form: "r", sprossen: [2, 3] })),
          { t: "f", p: [ax(6), GY1, 16.9], w: 0.6, h: 0.85, form: "r", sprossen: [1, 2] },
          { t: "band", p: [ax(6), GY1, 14.35], w: 8.6, h: 0.18 }, { t: "band", p: [ax(6), GY1, 16.55], w: 5.4, h: 0.16 },
          { t: "wappen", p: [ax(6), GY1, 19.9], w: 1.3, h: 1.9 }
        ] };
        giebelScheibe(W, "giebelvorn", [GX0, GY1, 0], [1, 0], [0, 1], d, GG, gVorn);
        figurKoerper(W, "giebelkugel", G_FX, GY1 - d / 2, GG.top, 0.24, 0.5, KUGEL(0.22));
        /* Gauben auf der linken Dachfläche (über der Kehle zu Flügel B) */
        for (const y of [GY1 - 8.4, GY1 - 5.8]) gaube(W, "gaubeGW" + y, [GX0, y], [-1, 0], TRAUFE, G_TAN, 0.8, 1.2);
        /* Türmchen links neben dem großen Giebel (vierkantig, Schallfenster) und rechts (rund) – wie auf dem Foto */
        tuermchen("tuermchenL", ax(2.0), GY1 - 1.9, 0.75, 17.9, (x) => zGL(x),
          (i, mx, my) => [-0.26, 0.26].map((dd) => ({ t: "f", p: [mx + (i % 2 === 0 ? dd : 0), my + (i % 2 ? dd : 0), 16.5], w: 0.4, h: 0.75, form: "b", sprossen: [1, 2], gewaende: 0.07, licht: 0.15 })),
          TUERMCHENHAUBE, 1.0, 2.1);
        tuermchen("tuermchenR", ax(10.3), GY1 - 1.9, 0.62, 16.4, (x) => zGR(x),
          (i, mx, my) => [{ t: "f", p: [mx, my, 16.4 - 1.35], w: 0.55, h: 0.8, form: "b", sprossen: [1, 2], gewaende: 0.08, licht: 0.2 }],
          drehkoerper([
            { h0: 0, h1: 0.2, r: 0.85, farbe: SCHIEFER, n: 2 },
            { h0: 0.2, h1: 1.5, r: kurve(0.8, 0.05, (t) => Math.sin(t * Math.PI / 2)), farbe: SCHIEFER, n: 10, schnee: true }
          ], { spitze: [1.45, 1.95, 0.09] }), 0.85, 2.0);
        /* FASSUNG 829 — der Balkon im 1. OG links an der Giebelfront (zum Turm hin), weit vorgezogen auf Konsolen, die
           Brüstung ringsum mit Blumenkästen („so Blumenkästen, wo es sehr auffällig dort noch ist, wo das hervorsteht") */
        if (Z_RUST < W.zMax) balkonBauen(W, (name, x0, y0, z0, x1, y1, z1, m, oben) => W.kasten(name, x0, y0, z0, x1, y1, z1, m, oben), (x, y) => [x, y], ax(0.5), ax(4.5), GY1, GY1 + 1.25, "balkonA");
      }

      /* ---- Haus zur Seite (1 m zurückgesetzt), Zeltdach ---- */
      {
        const ox = (dd) => OX0 + dd;
        const xs = [1.4, 3.6, 5.8].map(ox), ym = O_YM;
        const sued = { putz: PUTZ, rustika: Z_RUST, baender: BAND, kranz: TRAUFE - 0.45, ecken: [[OX1, OY1]], el: [] };
        for (const x of xs) sued.el.push(fEG(x, OY1), keller(x, OY1), fOG1(x, OY1), fOG2(x, OY1, { verdach: x === xs[1] ? "dreieck" : "gerade" }), fOG3(x, OY1));
        sued.el.push({ t: "rohr", p: [ox(0.4), OY1, 0], z0: 0.3, z1: TRAUFE - 0.3 });
        const ost = { putz: PUTZ, rustika: Z_RUST, baender: BAND, kranz: TRAUFE - 0.45, ecken: [[OX1, OY1], [OX1, OY0]], el: [] };
        for (const y of [ym + 2.9, ym, ym - 2.9]) ost.el.push(fEG(OX1, y), keller(OX1, y), fOG1(OX1, y), fOG2(OX1, y, { verdach: y === ym ? "dreieck" : "gerade" }), fOG3(OX1, y));
        const nord = { putz: PUTZ, rustika: Z_RUST, baender: BAND, kranz: TRAUFE - 0.45, ecken: [[OX1, OY0]], el: [] };
        for (const x of xs) { if (x !== xs[1]) nord.el.push(fEG(x, OY0, { gitter: true })); nord.el.push(fOG1(x, OY0), fOG2(x, OY0, { verdach: "gerade" }), fOG3(x, OY0)); }
        nord.el.push({ t: "f", p: [xs[1], OY0, 0.3], w: 1.5, h: 2.5, form: "b", sprossen: [2, 4], licht: 0.3 });
        const Ws = wand(sued), Wo = wand(ost), Wn = wand(nord);
        W.kasten("ostfluegel", OX0, OY0, 0, OX1, OY1, TRAUFE, { sued: Ws, ost: Wo, nord: Wn }, mauerkrone);
        /* Zeltdach: vier Walmflächen laufen in der Spitze zusammen; links liegt die Traufe in der Kehle am Giebelbau
           (ohne Überstand), vorn, rechts und hinten mit Überstand. Jede Fläche ein eigener Körper. */
        const P0 = [OX0, OY1 + UE, TRAUFE], P1 = [OX1 + UE, OY1 + UE, TRAUFE], P2 = [OX1 + UE, OY0 - UE, TRAUFE], P3 = [OX0, OY0 - UE, TRAUFE];
        const innen = [O_XM, ym, TRAUFE + 1];
        W.teil("zeltdachS"); W.poly([P0, P1, O_SPITZE], innen, dach(), { name: "zdS" });
        W.teil("zeltdachO"); W.poly([P1, P2, O_SPITZE], innen, dach(), { name: "zdO" });
        W.teil("zeltdachN"); W.poly([P2, P3, O_SPITZE], innen, dach({ fleder: [[O_XM, OY0 + 0.6, TRAUFE + (OY0 + 0.6 - (OY0 - UE)) * O_TANF]] }), { name: "zdN" });
        W.teil("zeltdachW"); W.poly([P3, P0, O_SPITZE], innen, dach(), { name: "zdW" });
        gaube(W, "gaubeOV", [O_XM, OY1 + UE], [0, 1], TRAUFE, O_TANF, 1.0, 1.2);
      }

      /* ============ TURM ============ */
      {
        const ecken = [[TX0, TY1], [TX1, TY1], [TX1, TY0], [TX0, TY0]];
        const fensterTurm = (p, w, h, extra) => Object.assign({ t: "f", p: p, w: w, h: h, form: "r", sprossen: [1, 3], fluegel: 2, gewaende: 0.12, licht: 0.3 }, extra);
        const seite = (nx, ny, mitte, extra) => {
          /* Fenster je Turmseite: einzeln, dann Paare */
          const at = (d, z) => [mitte[0] + (nx === 0 ? d : 0), mitte[1] + (ny === 0 ? d : 0), z];
          const el = [];
          if (!extra) { el.push(fensterTurm(at(0, 5.2), 0.8, 1.4), fensterTurm(at(0, 8.4), 0.8, 1.4)); }
          el.push(fensterTurm(at(0, 11.3), 0.75, 1.3));
          el.push(fensterTurm(at(-0.55, 13.6), 0.6, 1.0), fensterTurm(at(0.55, 13.6), 0.6, 1.0));
          el.push(fensterTurm(at(-0.55, 16.1), 0.6, 1.1), fensterTurm(at(0.55, 16.1), 0.6, 1.1));
          return el;
        };
        const sued = { putz: PUTZ, rustika: 3.3, ecken: [[TX0, TY1], [TX1, TY1]], el: [{ t: "portal", p: [TXM, TY1, 0.3] }].concat(seite(0, 1, [TXM, TY1], true)) };
        const west = { putz: PUTZ, ecken: [[TX0, TY0], [TX0, TY1]], el: seite(-1, 0, [TX0, TYM]) };
        const nord = { putz: PUTZ, ecken: [[TX0, TY0], [TX1, TY0]], el: seite(0, -1, [TXM, TY0]) };
        const ost = { putz: PUTZ, ecken: [[TX1, TY0], [TX1, TY1]], el: seite(1, 0, [TX1, TYM]) };
        W.kasten("turmschaft", TX0, TY0, 0, TX1, TY1, T_SCHAFT, { sued: wand(sued), west: wand(west), nord: wand(nord), ost: wand(ost) });
        /* Konsolenkranz */
        const ko = 0.35;
        const konsolenMaler = (g, F) => {
          steinFlaeche(g, -1, -1, F.w + 2, F.h + 2, hell(SAND, -0.02), F, 12);
          const n = Math.round(F.w / 0.55);
          for (let i = 0; i < n; i++) {
            const x = (i + 0.5) * F.w / n;
            g.fillStyle = rgbS(hell(SAND_D, -0.1)); g.fillRect(x - 0.13, 0.25, 0.26, F.h - 0.25);
            g.fillStyle = "rgba(40,34,36,0.35)"; g.fillRect(x + 0.13, 0.25, 0.08, F.h - 0.3);
            g.fillStyle = rgbS(hell(SAND, 0.15)); g.fillRect(x - 0.13, 0.25, 0.26, 0.08);
          }
          g.fillStyle = rgbS(hell(SAND, 0.18)); g.fillRect(-1, 0, F.w + 2, 0.22);
        };
        W.kasten("konsolen", TX0 - ko, TY0 - ko, T_SCHAFT, TX1 + ko, TY1 + ko, T_KONS, { sued: { malen: konsolenMaler }, nord: { malen: konsolenMaler }, ost: { malen: konsolenMaler }, west: { malen: konsolenMaler } });
        /* Balustrade des Umgangs */
        const balMaler = (g, F) => {
          g.fillStyle = rgbS(hell(PI.hex(PUTZ), -0.28)); g.fillRect(-1, -1, F.w + 2, F.h + 2);
          const n = Math.round(F.w / 0.24);
          for (let i = 0; i < n; i++) {
            const x = (i + 0.5) * F.w / n;
            const gr = g.createLinearGradient(x - 0.08, 0, x + 0.08, 0);
            gr.addColorStop(0, rgbS(hell(SAND, 0.15))); gr.addColorStop(1, rgbS(SAND_D));
            g.fillStyle = gr;
            g.beginPath(); g.moveTo(x - 0.05, 0.2); g.quadraticCurveTo(x - 0.11, F.h * 0.55, x - 0.07, F.h - 0.12); g.lineTo(x + 0.07, F.h - 0.12); g.quadraticCurveTo(x + 0.11, F.h * 0.55, x + 0.05, 0.2); g.closePath(); g.fill();
          }
          for (let i = 0; i <= 4; i++) { const x = i * F.w / 4; g.fillStyle = rgbS(SAND); g.fillRect(Math.min(F.w - 0.22, Math.max(0, x - 0.11)), 0, 0.22, F.h); }
          g.fillStyle = rgbS(hell(SAND, 0.2)); g.fillRect(-1, 0, F.w + 2, 0.18);
          g.fillStyle = rgbS(SAND_D); g.fillRect(-1, F.h - 0.12, F.w + 2, 0.12);
          if (F.jahr === "winter") { g.fillStyle = "rgba(248,250,255,0.95)"; g.fillRect(-1, 0, F.w + 2, 0.07); }
        };
        W.kasten("balustrade", TX0 - ko, TY0 - ko, T_KONS, TX1 + ko, TY1 + ko, T_BAL, { sued: { malen: balMaler }, nord: { malen: balMaler }, ost: { malen: balMaler }, west: { malen: balMaler } }, bodenMaler("#8f8a80"));
        /* Glockenstube mit Schallarkaden */
        const stube = (p0, p1) => {
          const el = [];
          for (const t of [0.29, 0.71]) el.push({ t: "schall", p: [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t, T_BAL + 0.35], w: 1.3, h: 1.85 });
          return wand({ putz: PUTZ, kranz: T_STUBE - 0.35, ecken: [p0, p1], el: el });
        };
        W.kasten("glockenstube", TX0, TY0, T_BAL, TX1, TY1, T_STUBE, { sued: stube([TX0, TY1], [TX1, TY1]), nord: stube([TX1, TY0], [TX0, TY0]), ost: stube([TX1, TY1], [TX1, TY0]), west: stube([TX0, TY0], [TX0, TY1]) }, bodenMaler("#5d6660"));
        /* Uhrgeschoss */
        const u = 1.8, ux0 = TXM - u, ux1 = TXM + u, uy0 = TYM - u, uy1 = TYM + u;
        const uhrW = (p) => wand({ putz: PUTZ, kranz: T_UHR - 0.3, el: [
          { t: "uhr", p: [p[0], p[1], 24.65], r: 0.85 },
          ...[-0.3, 0.3].map((d) => ({ t: "f", p: [p[0] + (p[1] === uy1 || p[1] === uy0 ? d : 0), p[1] + (p[0] === ux1 || p[0] === ux0 ? d : 0), 23.2], w: 0.28, h: 0.45, form: "r", sprossen: [1, 1], fluegel: 1, gewaende: 0.06, licht: 0.4 }))
        ], ecken: [] });
        W.kasten("uhrgeschoss", ux0, uy0, T_STUBE, ux1, uy1, T_UHR, { sued: uhrW([TXM, uy1]), nord: uhrW([TXM, uy0]), ost: uhrW([ux1, TYM]), west: uhrW([ux0, TYM]) });
        W.kasten("uhrkranz", ux0 - 0.15, uy0 - 0.15, T_UHR, ux1 + 0.15, uy1 + 0.15, T_KRANZ, { sued: { malen: sandMaler }, nord: { malen: sandMaler }, ost: { malen: sandMaler }, west: { malen: sandMaler } }, bodenMaler("#4d5854"));
        figurKoerper(W, "haube", TXM, TYM, T_KRANZ, 2.1, 6.1, HAUBE);
        /* Ecktürmchen mit Zwiebelhauben (tangential an den Ecken der Stube) */
        const rT = 0.4;
        for (const [sx, sy] of [[-1, 1], [1, 1], [1, -1], [-1, -1]]) {
          const ex = sx < 0 ? TX0 : TX1, ey = sy < 0 ? TY0 : TY1;
          const cx = ex + sx * rT * 0.72, cy = ey + sy * rT * 0.72;
          const n = nrm([sx, sy, 0]);
          figurKoerper(W, "eckturm" + sx + sy, cx, cy, T_BAL, rT + 0.05, 3.6, ECKTURM, [[n, dot(n, S([ex, ey, 0]))]]);
        }
        /* Erker über dem Portal */
        const ex0 = TXM - 1.3, ex1 = TXM + 1.3, ey1 = TY1 + 0.8, ez0 = 4.6, ez1 = 10.2;
        if (ez0 < W.zMax) {
          const erkerV = wand({ putz: PUTZ, kranz: ez1 - 0.35, ecken: [[ex0, ey1], [ex1, ey1]], baender: [7.45], el: [
            { t: "f", p: [TXM, ey1, 5.05], w: 1.0, h: 1.9, form: "b", sprossen: [2, 3] },
            { t: "f", p: [TXM, ey1, 7.85], w: 1.0, h: 1.75, form: "b", sprossen: [2, 3] }
          ] });
          const erkerS = (x, y) => wand({ putz: PUTZ, kranz: ez1 - 0.35, baender: [7.45], el: [{ t: "f", p: [x, y, 5.2], w: 0.4, h: 1.6, form: "r", sprossen: [1, 3], fluegel: 1, gewaende: 0.08 }, { t: "f", p: [x, y, 7.95], w: 0.4, h: 1.5, form: "r", sprossen: [1, 3], fluegel: 1, gewaende: 0.08 }] });
          W.teil("erker");
          const innen = [TXM, TY1 + 0.4, 7];
          const Wv = erkerV;
          W.poly([[ex0, ey1, ez1], [ex1, ey1, ez1], [ex1, ey1, ez0], [ex0, ey1, ez0]], innen, Wv.malen, { leuchten: Wv.leuchten, name: "erkerv" });
          const Wl = erkerS(ex0, TY1 + 0.4), Wr = erkerS(ex1, TY1 + 0.4);
          W.poly([[ex0, TY1, ez1], [ex0, ey1, ez1], [ex0, ey1, ez0], [ex0, TY1, ez0]], innen, Wl.malen, { leuchten: Wl.leuchten, name: "erkerw" });
          W.poly([[ex1, ey1, ez1], [ex1, TY1, ez1], [ex1, TY1, ez0], [ex1, ey1, ez0]], innen, Wr.malen, { leuchten: Wr.leuchten, name: "erkero" });
          /* Konsolfuß: zur Wand hin verjüngt */
          const zf = 3.75;
          W.poly([[ex0, ey1, ez0], [ex1, ey1, ez0], [ex1 - 0.5, TY1, zf], [ex0 + 0.5, TY1, zf]], innen, sandMaler, { name: "erkerfuss" });
          W.poly([[ex0, TY1, ez0], [ex0, ey1, ez0], [ex0 + 0.5, TY1, zf]], innen, sandMaler, { name: "erkerfw" });
          W.poly([[ex1, ey1, ez0], [ex1, TY1, ez0], [ex1 - 0.5, TY1, zf]], innen, sandMaler, { name: "erkerfo" });
          /* geschweiftes Walmdach */
          const zr = ez1 + 1.0, dr = 0.12;
          W.poly([[ex0 - dr, ey1 + dr, ez1], [ex1 + dr, ey1 + dr, ez1], [ex1 - 0.55, TY1, zr], [ex0 + 0.55, TY1, zr]], innen, schiefer(), { name: "erkerdach" });
          W.poly([[ex0 - dr, TY1, ez1], [ex0 - dr, ey1 + dr, ez1], [ex0 + 0.55, TY1, zr]], innen, schiefer(), { name: "erkerdw" });
          W.poly([[ex1 + dr, ey1 + dr, ez1], [ex1 + dr, TY1, ez1], [ex1 - 0.55, TY1, zr]], innen, schiefer(), { name: "erkerdo" });
        }
        /* Stufen vor dem Portal */
        W.kasten("stufen", TXM - 1.4, TY1, 0, TXM + 1.4, TY1 + 0.9, 0.3, { sued: { malen: sandMaler }, ost: { malen: sandMaler }, west: { malen: sandMaler } }, bodenMaler("#bba88a"));
      }

      /* ============ FLÜGEL C — schräg nach vorn links (der Walmdach-Flügel mit Dachreiter) ============
         FASSUNG 819 — XANDER: „auf der linken Seite ist es nicht direkt nach links zur Seite sondern eher schräg nach
         vorne … vom Eingang ab schräg so ein bisschen nach vorne zu uns … das Einzige was den Eingang einbaut ist dieses
         schräge". Gebaut in C-Achsen (x vom Turm 0 bis −C_LANG, y von der Front 0 nach hinten −C_BREIT); TC dreht alles
         um C_WINKEL in den Grundriss. Am Turm schließt C an die linke Turmwand und an die Front von Flügel B an. */
      {
        const cx = WX0 + W_R, cy = WY1 - W_R;              // Mittelpunkt der Eckrundung (vorn am Ende)
        const NB = 4;
        const G = C_GRUND.map((p) => TC(p).slice(0, 2));
        const EGw = 1.0, OG1w = 4.4, OG2w = 7.3;
        const bandW = [Z_RUST, 6.85];
        const pc = (x, y, z) => TC([x, y, z]);
        const fbM = (p, extra) => Object.assign({ t: "f", p: p, w: 1.3, h: 2.05, form: "b", sprossen: [2, 3] }, extra);
        const fb = (x, y, z, extra) => fbM(pc(x, y, z), extra);
        const fd = (x, y) => ({ t: "f", p: pc(x, y, OG1w), w: 1.6, h: 1.65, form: "d", sprossen: [2, 3], fluegel: 1, verdach: "gerade" });
        const kellerC = (x, y) => Object.assign(keller(0, 0), { p: pc(x, y, 0.12) });
        /* Front zum Markt: vier Achsen. FASSUNG 824 — der Balkon, der hier vor den mittleren Achsen hing, ist nach
           Xanders Foto an die lange Seite von Flügel A gewandert (an C ist auf dem Foto keiner) */
        const xsS = [-1.8, -4.2, -6.6, -9.0];
        const sued = { putz: PUTZ_W, rustika: Z_RUST, baender: bandW, kranz: TRAUFE_W - 0.45, el: [] };
        for (const x of xsS) {
          sued.el.push(fb(x, WY1, EGw, { gitter: true }), kellerC(x, WY1), fb(x, WY1, OG2w, { w: 1.25, h: 2.1, form: x === xsS[0] || x === xsS[3] ? "r" : "b", verdach: null }));
          sued.el.push(fd(x, WY1));
        }
        sued.el.push({ t: "rohr", p: pc(-0.45, WY1, 0), z0: 0.3, z1: TRAUFE_W - 0.3 }, { t: "rohr", p: pc(cx + 0.4, WY1, 0), z0: 0.3, z1: TRAUFE_W - 0.3 });
        /* Stirnseite am Ende (schaut schräg nach vorn links) */
        const west = { putz: PUTZ_W, rustika: Z_RUST, baender: bandW, kranz: TRAUFE_W - 0.45, el: [] };
        for (const y of [-4.4, -6.5, -8.5]) west.el.push(fb(WX0, y, EGw, { gitter: true }), fd(WX0, y), fb(WX0, y, OG2w, { form: "r", verdach: null }));
        /* Rückseite (bis zur Flucht der Turmrückwand) und das kurze Wandstück hinter dem Turm, das zu Flügel B schaut */
        const nord = { putz: PUTZ_W, rustika: Z_RUST, baender: bandW, kranz: TRAUFE_W - 0.45, ecken: [pc(WX0, WY0, 0)], el: [] };
        for (const x of [-7.4, -9.7, -12.0]) nord.el.push(fb(x, WY0, EGw, { gitter: true }), fOG1(0, 0, { p: pc(x, WY0, OG1w) }), fb(x, WY0, OG2w, { form: "r", w: 1.1, h: 2.0, verdach: "gerade" }));
        const hinten = { putz: PUTZ_W, rustika: Z_RUST, baender: bandW, kranz: TRAUFE_W - 0.45, el: [] };
        const xh0 = TC(C_QB)[0];
        for (const t of [0.3, 0.72]) {
          const x = xh0 + (BX0 - xh0) * t;
          hinten.el.push(fbM([x, TY0, EGw], { gitter: true }), fOG1(x, TY0, { p: [x, TY0, OG1w] }), fbM([x, TY0, OG2w], { form: "r", w: 1.1, h: 2.0, verdach: "gerade" }));
        }
        const rund = [];
        for (let i = 0; i < NB; i++) {
          const th = (90 + 90 * (i + 0.5) / NB) * RAD, px = cx + Math.cos(th) * W_R * 0.96, py = cy + Math.sin(th) * W_R * 0.96;
          rund.push(wand({ putz: PUTZ_W, rustika: Z_RUST, baender: bandW, kranz: TRAUFE_W - 0.45, el: [fb(px, py, EGw, { w: 0.75, gitter: true }), { t: "f", p: pc(px, py, OG1w), w: 0.72, h: 1.65, form: "r", verdach: "gerade" }, fb(px, py, OG2w, { w: 0.72, h: 2.0 })] }));
        }
        const Ws = wand(sued), Ww = wand(west), Wn = wand(nord), Wh = wand(hinten);
        /* Kanten: 0 Front, 1…NB Rundung, Stirn, Rückseite, Stück zu B, (an B), (am Turm) */
        W.prisma("westfluegel", G, 0, TRAUFE_W, (i) => {
          if (i === 0) return Ws;
          if (i >= 1 && i <= NB) return rund[i - 1];
          if (i === NB + 1) return Ww;
          if (i === NB + 2) return Wn;
          if (i === NB + 3) return Wh;
          return null;
        }, mauerkrone);
        /* Walmdach mit gerundeter Ecke. Am Turm und an Flügel B wird es abgeschnitten (Halbebenen in C-Achsen) */
        W.teil("westdach");
        const fy = W_FIRST_Y, fx0 = WX0 - UE + ((WY1 - WY0) / 2 + UE), zF = W_FIRST;
        const apex = [fx0, fy, zF];
        const innen = pc((WX0 + C_QB[0]) / 2, fy, TRAUFE_W + 1.5);
        const zVorn = (y) => TRAUFE_W + (WY1 + UE - y) * W_TAN, zHint = (y) => TRAUFE_W + (y - (WY0 - UE)) * W_TAN;
        const klipp = (poly, a, b, ref) => {
          const s = (p) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
          const sr = s(ref) > 0 ? 1 : -1, aus = [];
          for (let i = 0; i < poly.length; i++) {
            const P = poly[i], Q = poly[(i + 1) % poly.length], sp = s(P) * sr, sq = s(Q) * sr;
            if (sp >= -1e-9) aus.push(P);
            if ((sp > 1e-9 && sq < -1e-9) || (sp < -1e-9 && sq > 1e-9)) { const t = sp / (sp - sq); aus.push([P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t]); }
          }
          return aus;
        };
        const ref = [(WX0 + C_QB[0]) / 2, fy];
        const anschluss = (poly) => klipp(klipp(poly, [WX1, WY1], C_S, ref), C_QB, C_S, ref);
        const dS = dach({ fleder: [-5.3, -8.3].map((x) => pc(x, -2.2, zVorn(-2.2))) });
        W.poly(anschluss([[cx, WY1 + UE], [4, WY1 + UE], [4, fy], [fx0, fy]]).map(([x, y]) => pc(x, y, zVorn(y))), innen, dS, { name: "wdS" });
        for (let i = 0; i < NB; i++) {
          const t0 = (90 + 90 * i / NB) * RAD, t1 = (90 + 90 * (i + 1) / NB) * RAD, R2 = W_R + UE;
          W.poly([pc(cx + Math.cos(t0) * R2, cy + Math.sin(t0) * R2, TRAUFE_W), pc(cx + Math.cos(t1) * R2, cy + Math.sin(t1) * R2, TRAUFE_W), pc(apex[0], apex[1], zF)], innen, dach(), { name: "wdR" + i });
        }
        W.poly([pc(WX0 - UE, cy, TRAUFE_W), pc(WX0 - UE, WY0 - UE, TRAUFE_W), pc(apex[0], apex[1], zF)], innen, dach(), { name: "wdW" });
        W.poly(anschluss([[WX0 - UE, WY0 - UE], [4, WY0 - UE], [4, fy], [fx0, fy]]).map(([x, y]) => pc(x, y, zHint(y))), innen,
          dach({ fleder: [-9.8].map((x) => pc(x, -7.0, zHint(-7.0))) }), { name: "wdN" });
        /* Schnittfläche an der Flucht der Turmrückwand (schaut nach hinten über Flügel B): Putzgiebel */
        const bl = (y) => { const t = (y - C_QB[1]) / (C_S[1] - C_QB[1]); return [C_QB[0] + (C_S[0] - C_QB[0]) * t, y]; };
        const Eb = bl(WY0 - UE), Rx = bl(fy);
        W.poly([pc(Eb[0], Eb[1], TRAUFE_W), pc(Rx[0], Rx[1], zF), pc(C_S[0], C_S[1], zVorn(C_S[1])), pc(C_S[0], C_S[1], TRAUFE_W)], innen, wand({ putz: PUTZ_W }).malen, { name: "wdO" });
        /* Dachhaus mit Fensterband auf der Front (zum Markt) */
        const bx0 = -9.6, bx1 = -2.4, by = WY1 - 0.15;
        const zU = zVorn(by), zO2 = zU + 1.35, tanB = Math.tan(22 * RAD);
        /* Schnitt Pultdach/Hauptdach: zO2 + (by - y)·tanB = zVorn(y) */
        const yI = (TRAUFE_W + (WY1 + UE) * W_TAN - zO2 - by * tanB) / (W_TAN - tanB);
        const zI = zVorn(yI);
        if (zU < W.zMax) {
          W.teil("dachhaus");
          const innenB = pc((bx0 + bx1) / 2, by - 0.5, zU + 0.7);
          const el = [];
          for (let i = 0; i < 6; i++) el.push({ t: "f", p: pc(bx0 + 0.75 + i * (bx1 - bx0 - 1.5) / 5, by, zU + 0.25), w: 0.72, h: 0.85, form: "r", sprossen: [2, 2], gewaende: 0.08, bank: false, licht: 0.35 });
          const Wb = wand({ putz: PUTZ_W, kranz: zO2 - 0.22, el: el });
          W.poly([pc(bx0, by, zO2), pc(bx1, by, zO2), pc(bx1, by, zU), pc(bx0, by, zU)], innenB, Wb.malen, { leuchten: Wb.leuchten, name: "dhv" });
          for (const x of [bx0, bx1]) W.poly([pc(x, by, zO2), pc(x, yI, zI), pc(x, by, zU)], innenB, wand({ putz: PUTZ_W }).malen, { name: "dhs" + x });
          W.poly([pc(bx0 - 0.1, by + 0.2, zO2 - 0.02), pc(bx1 + 0.1, by + 0.2, zO2 - 0.02), pc(bx1 + 0.1, yI, zI), pc(bx0 - 0.1, yI, zI)], innenB, dach(), { name: "dhd" });
        }
        /* Gauben auf der Rückseite */
        for (const x of [-8.0, -11.6]) gaube(W, "gaubeWN" + x, pc(x, WY0 - UE, 0), TCn([0, -1]), TRAUFE_W, W_TAN, 1.0, 1.2);
        /* Dachreiter auf dem First (Kupferhaube) */
        const rx = -6.2, rb = 0.62, rz1 = zF + 1.9;
        if (zF - 0.5 < W.zMax) {
          W.teil("dachreiter");
          const zR = (y) => zF - Math.abs(y - fy) * W_TAN;
          const G4 = [[rx - rb, fy + rb], [rx + rb, fy + rb], [rx + rb, fy - rb], [rx - rb, fy - rb]];
          const innenR = pc(rx, fy, zF + 1);
          for (let i = 0; i < 4; i++) {
            const a = G4[i], b2 = G4[(i + 1) % 4];
            const mx = (a[0] + b2[0]) / 2, my = (a[1] + b2[1]) / 2;
            const qx = i % 2 === 0 ? 0.26 : 0, qy = i % 2 === 0 ? 0 : 0.26;
            const fe = (dd) => ({ t: "f", p: pc(mx + qx * dd, my + qy * dd, rz1 - 0.95), w: 0.34, h: 0.5, form: "r", sprossen: [1, 1], fluegel: 1, gewaende: 0.05, bank: false, licht: 0.1 });
            const We = wand({ putz: "#f1ece0", kranz: rz1 - 0.22, el: [fe(-1), fe(1)] });
            const pts = i % 2 === 0
              ? [[a[0], a[1], rz1], [b2[0], b2[1], rz1], [b2[0], b2[1], zR(b2[1])], [a[0], a[1], zR(a[1])]]
              : [[a[0], a[1], rz1], [b2[0], b2[1], rz1], [b2[0], b2[1], zR(b2[1])], [b2[0], fy, zF], [a[0], a[1], zR(a[1])]];
            W.poly(pts.map((p) => pc(p[0], p[1], p[2])), innenR, We.malen, { leuchten: We.leuchten, name: "dr" + i });
          }
          W.poly(G4.map(([x, y]) => pc(x, y, rz1)), innenR, schiefer(KUPFER), { name: "dro" });
          const hp = pc(rx, fy, 0);
          figurKoerper(W, "dachreiterhaube", hp[0], hp[1], rz1, 0.95, 2.0, DACHREITERHAUBE);
        }
      }

      /* ============ FLÜGEL B — hinter dem Turm nach hinten ============
         FASSUNG 819 — „die Rückseite von dem Turm hat auch noch mal so ein Hausschiff abgehen … und das geht offenbar ein
         bisschen länger". Rechtwinklig zu Flügel A (L-Form): die rechte Wand liegt in der Flucht der rechten Turmwand, vorn
         an A (Kehle zwischen den Dächern), dahinter frei zum Hof. Walmdach ohne Überstand, an der linken Wand am Turm die
         schmalen Achsen mit den drei Ochsenaugen (früher an der Westseite des Giebelbaus). */
      {
        const bxm = (BX0 + BX1) / 2;
        const ysN = [-4.1, -5.5, -6.9], ysW = [-9.4, -12.0, -14.6, -17.2, -19.8, -22.4];
        const west = { putz: PUTZ, rustika: Z_RUST, baender: BAND, kranz: TRAUFE - 0.45, ecken: [[BX0, BY0]], el: [] };
        west.el.push(...reihe(ysN, (y) => fEG(BX0, y, { w: 1.0, gitter: true })), ...reihe(ysN, (y) => fOG1(BX0, y, { w: 0.85, verdach: null })));
        west.el.push(...reihe(ysN, (y) => fOG2(BX0, y, { w: 0.85, h: 1.8, verdach: null, p: [BX0, y, 7.1] })));
        west.el.push(...reihe(ysN, (y) => ({ t: "f", p: [BX0, y, 10.3], w: 0.62, h: 0.62, form: "o", sprossen: [1, 1], gewaende: 0.1, licht: 0.2 })));
        for (const y of ysW) west.el.push(fEG(BX0, y, { gitter: true }), keller(BX0, y), fOG1(BX0, y), fOG2(BX0, y, { verdach: "gerade" }), fOG3(BX0, y));
        west.el.push({ t: "rohr", p: [BX0, -8.15, 0], z0: 0.3, z1: TRAUFE - 0.3 });
        const ost = { putz: PUTZ, rustika: Z_RUST, baender: BAND, kranz: TRAUFE - 0.45, ecken: [[BX1, BY0]], el: [] };
        for (const y of [-12.4, -15.0, -17.6, -20.2, -22.8]) ost.el.push(fEG(BX1, y), fOG1(BX1, y), fOG2(BX1, y, { verdach: "gerade" }), fOG3(BX1, y));
        const nord = { putz: PUTZ, rustika: Z_RUST, baender: BAND, kranz: TRAUFE - 0.45, ecken: [[BX0, BY0], [BX1, BY0]], el: [] };
        for (const x of [bxm - 3.2, bxm + 3.2]) nord.el.push(fEG(x, BY0, { gitter: true }), keller(x, BY0), fOG1(x, BY0), fOG2(x, BY0, { verdach: "gerade" }), fOG3(x, BY0));
        nord.el.push({ t: "f", p: [bxm, BY0, 0.3], w: 1.5, h: 2.5, form: "b", sprossen: [2, 4], licht: 0.3 }, fOG1(bxm, BY0), fOG2(bxm, BY0, { verdach: "dreieck" }), fOG3(bxm, BY0));
        const Ww = wand(west), Wo = wand(ost), Wn = wand(nord);
        /* Kanten: 0 vorn (Turm, Flügel C), 1 rechts an A, 2 rechts frei, 3 hinten, 4 links */
        W.prisma("fluegelB", [[BX0, BY1], [BX1, BY1], [BX1, GY0], [BX1, BY0], [BX0, BY0]], 0, TRAUFE, (i) => (i === 2 ? Wo : i === 3 ? Wn : i === 4 ? Ww : null), mauerkrone);
        W.teil("bdach");
        const hb = (BX1 - BX0) / 2, zF = TRAUFE + hb * B_TAN, yv = BY1 - hb, yh = BY0 + hb;
        const innen = [bxm, (BY0 + BY1) / 2, TRAUFE + 2];
        W.poly([[BX0, BY1, TRAUFE], [BX1, BY1, TRAUFE], [bxm, yv, zF]], innen, dach(), { name: "bdV" });
        /* links (von vorn über Flügel C zu sehen) nur Fledermausgauben – Giebelgauben stünden dort wie Mauerschlitze */
        W.poly([[BX0, BY0, TRAUFE], [BX0, BY1, TRAUFE], [bxm, yv, zF], [bxm, yh, zF]], innen, dach({ fleder: [-9.4, -14.6, -19.8].map((y) => [BX0 + 1.2, y, TRAUFE + 1.2 * B_TAN]).concat([-12.0, -17.2].map((y) => [BX0 + 2.2, y, TRAUFE + 2.2 * B_TAN])) }), { name: "bdW" });
        W.poly([[BX1, BY1, TRAUFE], [BX1, BY0, TRAUFE], [bxm, yh, zF], [bxm, yv, zF]], innen, dach({ fleder: [-17.6].map((y) => [BX1 - 2.0, y, TRAUFE + 2.0 * B_TAN]) }), { name: "bdO" });
        W.poly([[BX1, BY0, TRAUFE], [BX0, BY0, TRAUFE], [bxm, yh, zF]], innen, dach(), { name: "bdH" });
        for (const y of [-14.6, -20.2]) gaube(W, "gaubeBO" + y, [BX1, y], [1, 0], TRAUFE, B_TAN, 0.9, 1.2);
      }

      /* ---------- Lichter bei Nacht ---------- */
      if (bau >= 1) {
        const pl = S([TXM - 1.3, TY1 + 0.5, 2.9]), pr = S([TXM + 1.3, TY1 + 0.5, 2.9]);
        M.licht(pl[0], pl[1], pl[2], 1.4, "255,200,130", 0.7);
        M.licht(pr[0], pr[1], pr[2], 1.4, "255,200,130", 0.7);
        const pb = S([TXM, TY1 + 2.2, 0]);
        M.bodenlicht(pb[0], pb[1], 3.2, "255,190,120", 0.35);
      }

      W.ordnen();
    }
  });
})();
