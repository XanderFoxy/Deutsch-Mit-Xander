/* =====================================================================
   FACHWERKHAUS — fränkisch-hessisches Bürgerhaus mit Zierfachwerk
   ---------------------------------------------------------------------
   XANDER: „fang mit einem Detail an, mit einem Fachwerkhaus … so geil
   wie möglich und noch geiler als das."
   „Richtig filigran. Richtig schön ausarbeiten mit schönen Texturen."
   „Das soll keine Comic Grafik sein. Das soll noch viel mehr am
   Realismus dran sein."
   „mit feinen Texturen im Fensterglas, Blumenkästen auf dem Fensterbrett,
   ne Klingel an der Tür, Hausnummer. Alles mit Struktur, so der Mörtel
   und … Beton, alles mal schön die Häuserwände."

   Vorbild: Marktplatzhäuser in Miltenberg, Rothenburg, Bad Wimpfen.
   Traufständig (Traufe zur Straße = Süden, +y), hoher Sockel aus rotem
   Mainsandstein, Erdgeschoss und Obergeschoss in Fachwerk, das
   Obergeschoss kragt rundum 40 cm vor (Balkenköpfe, Füllhölzer,
   Knaggen), der Giebel kragt noch einmal 25 cm vor. Steiles Satteldach
   (52°) mit Aufschiebling an der Traufe, Biberschwanz-Doppeldeckung,
   zwei Schleppgauben, Kamin auf dem First.

   MASSE (Meter, Mitte des Grundrisses = 0,0,0)
     Keller        2,2 m tief (Bruchstein), Streifenfundament
     Sockel        9,1 × 7,1 m, 1,20 m hoch (Mainsandstein)
     Erdgeschoss   9,0 × 7,0 m, 2,80 m (Schwelle, Ständer, Rähm)
     Balkenlage    0,24 m, Auskragung 0,40 m
     Obergeschoss  9,8 × 7,8 m, 2,70 m
     Dachbalken    0,22 m, Giebelauskragung 0,25 m
     First         12,64 m (Ziegeloberfläche), Kamin bis 14,0 m

   WIE ES GEBAUT IST
     • Jede Wand wird in ihrem eigenen Koordinatensystem gemalt: Gefache
       (einzeln verputzt, leicht gewölbt, Risse, Begleitstrich), Hölzer
       (Maserung, Risse, Holznägel, leicht unregelmäßige Kanten), Fenster
       mit echter Laibungstiefe (Parallaxe aus dem Blickwinkel).
     • Was wirklich vorsteht, ist ein eigener Körper: Balkenköpfe,
       Füllhölzer, Knaggen, Fensterbänke, Blumenkästen, Treppe, Gauben,
       Kamin, Rinne, Fallrohr, Schnee mit dickem Rand (Wechte). Das
       Schneefanggitter ist gemalt, steht aber per Parallaxe auf dem Dach.
     • Die Reihenfolge (hinten zuerst) kommt aus den Mittelpunkten der
       Teile: Angebautes liegt immer bei „Wirt + Normale·δ", dann stimmt
       es in jedem Drehwinkel.
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
  const zufall = (n) => ST.zufall((n >>> 0) || 1);
  /* weiche Kurve (0…1) */
  const glatt = (x) => { x = klemm(x, 0, 1); return x * x * (3 - 2 * x); };

  /* ---------------- Hauptmaße ---------------- */
  /* Hoher Sockel: „EG auf hohem Sandsteinsockel" – 1,2 m, darin der
     Keller (Kellerfenster mit Gitter, Kellertür unter dem Treppenpodest). */
  const S0 = 1.20;                 // Sockelhöhe
  const SV = 0.05;                 // Sockelvorsprung
  const XE = 4.5, YE = 3.5;        // Erdgeschoss (Außenseite Fachwerk)
  const ZE0 = S0, ZE1 = S0 + 2.80; // EG unten / oben
  const KR = 0.40;                 // Stockwerksauskragung
  const XO = XE + KR, YO = YE + KR;
  const ZB1 = ZE1 + 0.24;          // Oberkante Balkenlage = Unterkante OG
  const ZO1 = ZB1 + 2.70;          // Oberkante OG
  const KG = 0.25;                 // Giebelauskragung
  const XG = XO + KG;              // Giebelwand
  const ZD = ZO1 + 0.22;           // Oberkante Dachbalkenlage
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
  const LM = Math.hypot(YK, ZF - ZK);       // Länge Hauptfläche (First → Knick)
  const LA = Math.hypot(YT - YK, ZK - ZT);  // Länge Aufschiebling
  const dachZ = (y) => { const a = Math.abs(y); return a <= YK ? ZF - a * TN : ZK - (a - YK) * TA; };
  const ZDM = ZD + 3.24;           // Höhe der Dachmitte (nur für die Reihenfolge der Teile)

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
  /* Versatz eines Punkts in der Tiefe d (hinter der Fläche, d > 0) in Flächenkoordinaten */
  function parallaxe(F, B, d) {
    const f = F.flaeche, u = f.u, v = f.v, n = kreuz(u, v);
    const en = Math.max(0.14, dot(B.e, n));
    return [d * dot(B.e, u) / en, d * dot(B.e, v) / en];
  }
  /* Modellpunkt → Bildversatz (Pixel) relativ zu einem Fußpunkt (für Figuren) */
  function bildVersatz(B, s, d) {
    const a = d[0] * B.c - d[1] * B.s, b = d[0] * B.s + d[1] * B.c;
    return [(a - b) * ST.KX * s, (a + b) * ST.KY * s - d[2] * ST.KZ * s];
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
     entlang D von d0 bis d1. seiten: welche Flächen (B b D d a e). */
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
    const de = e + (opt.dEbene == null ? 2 : opt.dEbene);
    if (zeige.indexOf("D") >= 0) rechteck(M, add(mid, mul(D, d1)), D, U, L, bb, mal("D", L, bb), ex({ ebene: de }));
    if (zeige.indexOf("d") >= 0) rechteck(M, add(mid, mul(D, d0)), mul(D, -1), U, L, bb, mal("d", L, bb), ex({ ebene: de }));
    if (zeige.indexOf("B") >= 0) rechteck(M, add(add(mid, mul(B, bb / 2)), mul(D, dm)), B, U, L, dt, mal("B", L, dt), ex());
    if (zeige.indexOf("b") >= 0) rechteck(M, add(add(mid, mul(B, -bb / 2)), mul(D, dm)), mul(B, -1), U, L, dt, mal("b", L, dt), ex());
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

  /* Lichtschein in der Szene anmelden. Jeder Schein kostet in JEDEM Bild
     einen weichen Verlauf – deshalb wenige (höchstens rund 12 je Haus),
     und gedämpft, wenn die Fläche fast von der Kante gesehen wird (sonst
     quillt der Schein über die Hauskante hinaus). */
  function schein(F, a, b, r, farbe, k, flacker) {
    if (!F.leuchtPunkt) return;
    const s = klemm((F.sicht == null ? 1 : F.sicht) * 3, 0, 1);
    if (s < 0.05 || k <= 0) return;
    F.leuchtPunkt(a, b, r * s, farbe, k * s, flacker);
  }
  /* Ein gemeinsamer Schein für alle hellen Fenster einer Fläche:
     Schwerpunkt der Fenster, Radius nach ihrer Streuung */
  function fensterSchein(F, liste) {
    if (!liste.length) return;
    let sx = 0, sy = 0, sk = 0;
    for (const [x, y, k] of liste) { sx += x * k; sy += y * k; sk += k; }
    const mx = sx / sk, my = sy / sk;
    let r = 0; for (const [x, y] of liste) r = Math.max(r, Math.hypot(x - mx, y - my));
    schein(F, mx, my, 1.3 + r * 0.7, "255,190,110", Math.min(0.9, 0.3 * Math.sqrt(sk)));
  }

  /* ---------------- Vielecke ---------------- */
  function poly(g, p) { g.beginPath(); g.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]); g.closePath(); }
  function halbEbene(P, n, c) {           // behält n·p ≥ c
    const out = [];
    for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length];
      const da = n[0] * a[0] + n[1] * a[1] - c, db = n[0] * b[0] + n[1] * b[1] - c;
      if (da >= 0) out.push(a);
      if ((da >= 0) !== (db >= 0)) { const t = da / (da - db); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return out;
  }
  function vFlaeche(P) { let s = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; s += a[0] * b[1] - b[0] * a[1]; } return s / 2; }
  function vMitte(P) { let x = 0, y = 0; for (const p of P) { x += p[0]; y += p[1]; } return [x / P.length, y / P.length]; }
  function vBox(P) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const p of P) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; } return [x0, y0, x1, y1]; }
  /* Konvexes Vieleck um d nach innen versetzen */
  function einruecken(P, d) {
    const sg = vFlaeche(P) > 0 ? 1 : -1;
    let Q = P;
    for (let i = 0; i < P.length && Q.length >= 3; i++) {
      const a = P[i], b = P[(i + 1) % P.length];
      const ex = b[0] - a[0], ey = b[1] - a[1], l = Math.hypot(ex, ey) || 1;
      const n = [-ey / l * sg, ex / l * sg];     // nach innen
      Q = halbEbene(Q, n, n[0] * a[0] + n[1] * a[1] + d);
    }
    return Q;
  }
  /* Vielecke mit einem Holz (Band der Breite b um die Achse) zerschneiden */
  function zerschneiden(polys, m) {
    const d = [m.p1[0] - m.p0[0], m.p1[1] - m.p0[1]], L = Math.hypot(d[0], d[1]) || 1;
    const n = [-d[1] / L, d[0] / L], c = n[0] * m.p0[0] + n[1] * m.p0[1], w = m.b / 2;
    const out = [];
    for (const P of polys) {
      if (m.bereich) { const q = vMitte(P), B = m.bereich; if (q[0] < B[0] || q[0] > B[2] || q[1] < B[1] || q[1] > B[3]) { out.push(P); continue; } }
      const A = halbEbene(P, n, c + w), C = halbEbene(P, [-n[0], -n[1]], -c + w);
      const hatA = A.length >= 3 && Math.abs(vFlaeche(A)) > 2e-3, hatC = C.length >= 3 && Math.abs(vFlaeche(C)) > 2e-3;
      if (!hatA && !hatC) { if (Math.abs(vFlaeche(P)) > 2e-3 && (Math.abs(n[0] * vMitte(P)[0] + n[1] * vMitte(P)[1] - c) > w)) out.push(P); continue; }
      if (hatA) out.push(A);
      if (hatC) out.push(C);
    }
    return out;
  }

  /* =====================================================================
     FARBEN UND VARIANTEN (über o.saat)
     ===================================================================== */
  const HOLZ = [
    { name: "dunkelbraun", f: [60, 43, 33] },
    { name: "ochsenblut", f: [106, 48, 37] },
    { name: "graublau", f: [78, 90, 102] }
  ];
  /* Rohbau: frisches Eichenholz hell und gelblich, Lehm grau-ocker –
     so bleibt das Gerippe vor dem Lehm als Fachwerk lesbar */
  const HOLZ_ROH = [208, 172, 118];
  const PUTZ = [[240, 236, 226], [240, 229, 203], [236, 214, 166]];
  const LEHM = [116, 102, 84];
  const LADEN = ["#2f5a3c", "#7a2c24", "#3b5877", "#55624a", "#2d4b57"];
  const TUER = ["#5a2e1c", "#2e4a3a", "#6a2922", "#34465c", "#4a3524"];
  const VORHANG = ["#b8423a", "#3f6a4a", "#c9a45a", "#8a5a7a", "#e8dcc6"];
  const BLUMEN = [[214, 30, 42], [226, 58, 110], [240, 120, 90], [246, 242, 236], [140, 60, 160], [80, 100, 205], [250, 196, 60]];
  const NAMEN = ["Weber", "Müller", "Schneider", "Fischer", "Wagner", "Becker", "Hoffmann", "Schäfer", "Koch", "Bauer",
    "Richter", "Klein", "Wolf", "Schröder", "Neumann", "Schwarz", "Zimmermann", "Braun", "Krüger", "Hartmann",
    "Lange", "Schmitt", "Werner", "Krause", "Meier", "Lehmann", "Huber", "Kaiser", "Fuchs", "Vogel", "Seitz", "Endres"];
  function varianten(o) {
    const r = zufall(((o.saat || 7) * 2654435761) >>> 0);
    r(); r();
    const hi = Math.floor(r() * HOLZ.length);
    const holz = HOLZ[hi];
    const putz = PUTZ[Math.floor(r() * PUTZ.length)];
    let laden = LADEN[Math.floor(r() * LADEN.length)];
    if (holz.name === "graublau" && laden === "#3b5877") laden = "#2f5a3c";
    if (holz.name === "ochsenblut" && laden === "#7a2c24") laden = "#2f5a3c";
    const tuer = TUER[Math.floor(r() * TUER.length)];
    const nummer = 1 + Math.floor(r() * 38);
    const name = NAMEN[Math.floor(r() * NAMEN.length)];
    const jahr = 1612 + Math.floor(r() * 150);
    const vorhang = VORHANG[Math.floor(r() * VORHANG.length)];
    /* Blumen je Haus: Geranien in einer Hauptfarbe, dazu zwei Farben
       für Hängepflanzen (Petunien, Männertreu) */
    const bl = BLUMEN.slice(), blumen = [];
    for (let i = 0; i < 3; i++) blumen.push(bl.splice(Math.floor(r() * bl.length), 1)[0]);
    /* Begleitstrich: grau zu weißem Putz, rötlich bei Ochsenblut */
    const begleit = holz.name === "ochsenblut" ? "rgba(122,52,42,0.6)" : holz.name === "graublau" ? "rgba(70,84,98,0.55)" : "rgba(72,62,54,0.55)";
    /* Begleitstrich nur bei etwa jedem zweiten Haus */
    const begleitAn = r() < 0.5;
    return { holz: holz, putz: putz, laden: laden, tuer: tuer, nummer: nummer, name: name, jahr: jahr, vorhang: vorhang, begleit: begleit, begleitAn: begleitAn, blumen: blumen, saat: (o.saat || 7) };
  }

  /* =====================================================================
     WERKSTOFFE
     ===================================================================== */

  /* ---------------- Rauschen ----------------
     Wie PI.rauschen, aber mit wenigen Grundmustern (Speicher, Zeit): die
     Saat verschiebt, spiegelt und DREHT das Muster (15–40°), statt ein
     neues zu erzeugen. Gedreht fällt die 128er-Kachel nicht mehr als
     Raster auf („keine sichtbare Wiederholung"). */
  function musterLage(m, meter, s, sx) {
    const k = meter / 128, a = (15 + ((s * 7.37) % 25)) * RAD, ca = Math.cos(a) * k, sa = Math.sin(a) * k;
    m.setTransform(new DOMMatrix([ca * sx, sa * sx, -sa, ca, (s * 0.37) % meter, (s * 0.61) % meter]));
  }
  function rausch(g, x, y, w, h, meter, staerke, saat, okt) {
    const s = Math.abs(saat | 0);
    const bild = PI.rauschBild(1 + (s % 5), 128, 4, okt || 3, 1.6);
    const m = g.createPattern(bild, "repeat");
    musterLage(m, meter, s, (s >> 3) % 2 ? -1 : 1);
    g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }
  /* Zwei Maßstäbe im Verhältnis 1 : 1,73 übereinander – großflächige
     Wolkigkeit ohne Kachelraster (Schnee, Grubenboden, Dachalterung) */
  function rausch2(g, x, y, w, h, meter, staerke, saat) {
    rausch(g, x, y, w, h, meter, staerke, saat, 3);
    rausch(g, x, y, w, h, meter * 1.73, staerke, saat + 3, 3);
  }
  function bleich(g, x, y, w, h, meter, staerke, saat) {
    const s = Math.abs(saat | 0);
    const bild = PI.rauschBild(51 + (s % 3), 128, 3, 3, 2.2);
    const m = g.createPattern(bild, "repeat");
    musterLage(m, meter, s + 5, 1);
    g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }

  /* ---------------- Putz: ganze Wand ----------------
     Kalkputz: große wolkige Flecken (3,4 m), mittleres und feines Korn und
     – erst nah – das sandige Kalkkorn. Das Rauschen wird ÜBER die schon
     getönten Gefache gelegt, so behält jedes Gefach Ton UND Struktur.
     Die Korngröße des Kalkkorns folgt dem Zoom (1,5–2 Bildpunkte), sonst
     mittelt die Grafikkarte es zu einem glatten Grau weg. */
  function putzBasis(g, w, h, farbe) { g.fillStyle = rgb(farbe); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1); }
  function putzStruktur(g, F, w, h, saat) {
    const px = F.px, x = -0.05, y = -0.05, W = w + 0.1, H = h + 0.1;
    rausch(g, x, y, W, H, 3.4, 0.15, saat, 4);
    if (px > 22) rausch(g, x, y, W, H, 0.55, 0.1, saat + 7, 3);
    if (px > 30) rausch(g, x, y, W, H, 0.16, 0.1, saat + 13, 2);
    if (px > 45) {
      const korn = Math.max(0.06, 14 / px);
      rausch(g, x, y, W, H, korn, 0.2, saat + 17, 2);
      bleich(g, x, y, W, H, korn * 1.3, 0.13, saat + 3);
    }
    bleich(g, x, y, W, H, 2.4, 0.08, saat);
  }
  function putzGrund(g, F, w, h, farbe, saat) { putzBasis(g, w, h, farbe); putzStruktur(g, F, w, h, saat); }
  /* Vieleck an den aktuellen Pfad anhängen (ohne beginPath) */
  function polyPfad(g, P, ox, oy) {
    ox = ox || 0; oy = oy || 0;
    g.moveTo(P[0][0] + ox, P[0][1] + oy);
    for (let i = 1; i < P.length; i++) g.lineTo(P[i][0] + ox, P[i][1] + oy);
    g.closePath();
  }
  /* geschlossene, weich gerundete Kurve durch Punkte (Mittelpunkt-Bezier) */
  function glattPfad(g, P) {
    const n = P.length, m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const s = m(P[n - 1], P[0]);
    g.moveTo(s[0], s[1]);
    for (let i = 0; i < n; i++) { const q = m(P[i], P[(i + 1) % n]); g.quadraticCurveTo(P[i][0], P[i][1], q[0], q[1]); }
    g.closePath();
  }
  /* offene Linienzüge anhängen; glatt: Mittelpunkt-Bezier (keine Knicke) */
  function linienPfad(g, liste, glatt) {
    for (const P of liste) {
      g.moveTo(P[0][0], P[0][1]);
      if (!glatt || P.length < 3) { for (let i = 1; i < P.length; i++) g.lineTo(P[i][0], P[i][1]); continue; }
      for (let i = 1; i < P.length - 1; i++) { const q = [(P[i][0] + P[i + 1][0]) / 2, (P[i][1] + P[i + 1][1]) / 2]; g.quadraticCurveTo(P[i][0], P[i][1], q[0], q[1]); }
      g.lineTo(P[P.length - 1][0], P[P.length - 1][1]);
    }
  }

  /* =====================================================================
     HÖLZER ALS BÄNDER
     Jedes Holz wird einmal als Umriss berechnet (Wandkoordinaten, y nach
     unten): zwei Kanten mit sanften, niederfrequenten Wellen von bis zu
     1 cm (alte Hölzer sind nie ganz gerade – aber keine Zacken), Bögen als
     abgetastetes Band. Mit diesen Umrissen werden Schatten, Wölbung der
     Gefache, Begleitstrich, Kanten, Risse und Maserung für ALLE Hölzer
     einer Wand in je EINEM Pfad gezeichnet: wenige Zeichenbefehle statt
     tausender (jeder Befehl kostet auf der Grafikkarte Zeit).
     ===================================================================== */
  function holzForm(m, rng) {
    const b = m.b;
    if (m.k) {
      const n = 12, ob = [], un = [];
      for (let i = 0; i <= n; i++) {
        const t = i / n, u = 1 - t;
        const x = u * u * m.p0[0] + 2 * u * t * m.k[0] + t * t * m.p1[0], y = u * u * m.p0[1] + 2 * u * t * m.k[1] + t * t * m.p1[1];
        const dx = 2 * u * (m.k[0] - m.p0[0]) + 2 * t * (m.p1[0] - m.k[0]), dy = 2 * u * (m.k[1] - m.p0[1]) + 2 * t * (m.p1[1] - m.k[1]);
        const l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
        ob.push([x - nx * b / 2, y - ny * b / 2]); un.push([x + nx * b / 2, y + ny * b / 2]);
      }
      const mi = n / 2, mx = (ob[mi][0] + un[mi][0]) / 2, my = (ob[mi][1] + un[mi][1]) / 2;
      const nx = (un[mi][0] - ob[mi][0]) / b, ny = (un[mi][1] - ob[mi][1]) / b;
      return { m: m, b: b, ob: ob, un: un, bogen: true, mitte: [mx, my], n: [nx, ny], L: 1 };
    }
    const dx = m.p1[0] - m.p0[0], dy = m.p1[1] - m.p0[1], L = Math.hypot(dx, dy) || 1e-3;
    const ca = dx / L, sa = dy / L;
    /* lange Hölzer wellen sich um bis zu 1 cm, kurze kaum */
    const amp = L > 2 ? 0.01 : Math.min(0.006, b * 0.03);
    const n = Math.max(1, Math.round(L / 0.5));
    const obL = [], unL = [];
    for (let i = 0; i <= n; i++) { const t = i / n * L; obL.push([t, -b / 2 + (rng() - 0.5) * 2 * amp]); unL.push([t, b / 2 + (rng() - 0.5) * 2 * amp]); }
    /* Setzung: Rähm hängt zwischen den Ecken durch (Unterkante), die
       Schwelle ist in der Mitte eingedrückt (Oberkante) */
    if (m.durchhang) {
      const unten = ca >= 0 ? unL : obL, oben = ca >= 0 ? obL : unL, sg = ca >= 0 ? 1 : -1;
      const reihe = m.kante === "oben" ? oben : unten;
      for (let i = 0; i <= n; i++) { const t = i / n; reihe[i][1] += sg * m.durchhang * 4 * t * (1 - t); }
    }
    const W = (q) => [m.p0[0] + ca * q[0] - sa * q[1], m.p0[1] + sa * q[0] + ca * q[1]];
    return { m: m, b: b, L: L, ca: ca, sa: sa, x0: m.p0[0], y0: m.p0[1], ob: obL.map(W), un: unL.map(W), bogen: false,
      mitte: [m.p0[0] + dx / 2, m.p0[1] + dy / 2], n: [-sa, ca] };
  }
  /* Umriss eines Holzes (verschoben um ox, oy) an den Pfad anhängen */
  function formPfad(g, f, ox, oy) {
    ox = ox || 0; oy = oy || 0;
    const ob = f.ob, un = f.un, n = ob.length - 1;
    g.moveTo(ob[0][0] + ox, ob[0][1] + oy);
    if (f.bogen) {
      for (let i = 1; i <= n; i++) g.lineTo(ob[i][0] + ox, ob[i][1] + oy);
      for (let i = n; i >= 0; i--) g.lineTo(un[i][0] + ox, un[i][1] + oy);
      g.closePath(); return;
    }
    for (let i = 1; i <= n; i++) g.quadraticCurveTo(ob[i - 1][0] + ox, ob[i - 1][1] + oy, (ob[i - 1][0] + ob[i][0]) / 2 + ox, (ob[i - 1][1] + ob[i][1]) / 2 + oy);
    g.lineTo(ob[n][0] + ox, ob[n][1] + oy); g.lineTo(un[n][0] + ox, un[n][1] + oy);
    for (let i = n - 1; i >= 0; i--) g.quadraticCurveTo(un[i + 1][0] + ox, un[i + 1][1] + oy, (un[i + 1][0] + un[i][0]) / 2 + ox, (un[i + 1][1] + un[i][1]) / 2 + oy);
    g.lineTo(un[0][0] + ox, un[0][1] + oy); g.closePath();
  }
  /* Eine Kante (ob oder un), um d zur Holzmitte hin eingerückt */
  function kantePfad(g, f, seite, d) {
    const P = seite > 0 ? f.un : f.ob, sx = -seite * f.n[0] * d, sy = -seite * f.n[1] * d;
    const n = P.length - 1;
    g.moveTo(P[0][0] + sx, P[0][1] + sy);
    if (f.bogen || n < 2) { for (let i = 1; i <= n; i++) g.lineTo(P[i][0] + sx, P[i][1] + sy); return; }
    for (let i = 1; i < n; i++) g.quadraticCurveTo(P[i][0] + sx, P[i][1] + sy, (P[i][0] + P[i + 1][0]) / 2 + sx, (P[i][1] + P[i + 1][1]) / 2 + sy);
    g.lineTo(P[n][0] + sx, P[n][1] + sy);
  }
  /* Einzelheiten aller Hölzer einer Wand (fest je Saat): Maserung,
     Schwundrisse alle 0,3–0,8 m längs der Faser, Äste, abgeriebene Kanten */
  function holzDetails(formen, saat) {
    const rng = zufall(saat * 7 + 5);
    const D = { maser: [], fein: [], risse: [], lippe: [], aeste: [], abrieb: [], grau: [] };
    for (const f of formen) {
      const b = f.b;
      if (f.bogen) {
        for (const o of [-0.22, 0.05, 0.25]) D.maser.push(f.ob.map((p, i) => [p[0] + (f.un[i][0] - p[0]) * (0.5 + o), p[1] + (f.un[i][1] - p[1]) * (0.5 + o)]));
        continue;
      }
      const L = f.L, P = (t, y) => [f.x0 + f.ca * t - f.sa * y, f.y0 + f.sa * t + f.ca * y];
      const nm = Math.max(3, Math.min(7, Math.round(b * 32)));
      for (let i = 0; i < nm; i++) {
        const yy = -b / 2 + b * (i + 0.5) / nm + (rng() - 0.5) * b * 0.1;
        const t0 = rng() * L * 0.3, t1 = L - rng() * L * 0.3;
        const st = Math.max(2, Math.round((t1 - t0) / 0.35)), pts = [];
        let w = yy;
        for (let k = 0; k <= st; k++) { pts.push(P(t0 + (t1 - t0) * k / st, w)); w = klemm(w + (rng() - 0.5) * b * 0.06, -b * 0.46, b * 0.46); }
        (i % 2 ? D.fein : D.maser).push(pts);
      }
      /* Schwundrisse: alle 0,3–0,8 m beginnt ein neuer (0,15–0,55 m lang) */
      let t = rng() * 0.5;
      while (t < L - 0.2) {
        const len = 0.15 + rng() * 0.4, yy = (rng() - 0.5) * b * 0.45, e = Math.min(L - 0.06, t + len);
        const q = [P(t, yy), P((t + e) / 2, yy + (rng() - 0.5) * 0.01), P(e, yy + (rng() - 0.5) * 0.008)];
        D.risse.push(q);
        D.lippe.push(q.map((p) => [p[0] - f.n[0] * 0.006, p[1] - f.n[1] * 0.006]));
        t = e + 0.3 + rng() * 0.5;
      }
      const na = Math.floor(L * 0.35 * rng() + 0.3);
      for (let i = 0; i < na; i++) { const p = P(0.1 + rng() * (L - 0.2), (rng() - 0.5) * b * 0.5); D.aeste.push([p[0], p[1], 0.011 + rng() * 0.012, Math.atan2(f.sa, f.ca)]); }
      /* abgeriebene, hellere Kanten: einzelne Stücke entlang beider Kanten */
      for (const s of [-1, 1]) {
        let u = rng() * 0.6;
        while (u < L - 0.05) { const l = 0.08 + rng() * 0.35; D.abrieb.push([P(u, s * (b / 2 - 0.009)), P(Math.min(L, u + l), s * (b / 2 - 0.009))]); u += l + 0.25 + rng() * 0.9; }
      }
      /* waagerechte Hölzer: Oberseite vom Regen grau (obere 25 %) */
      if (Math.abs(f.sa) < 0.3) {
        const s = f.ca >= 0 ? -1 : 1, rand = [], innen = [];
        for (let k = 0; k <= 6; k++) { const u = L * k / 6; rand.push(P(u, s * b / 2)); innen.unshift(P(u, s * b * 0.22)); }
        D.grau.push(rand.concat(innen));
      }
    }
    return D;
  }
  /* Alle Hölzer einer Wand malen: je Holz eine Füllung (Fase: Lichtkante
     heller, Schattenkante dunkler, ±6 % Farbton), dann Maserung, Risse,
     Abrieb, Lichtkante, Fuge und Äste gebündelt. */
  function hoelzerMalen(g, F, formen, D, toene) {
    const px = F.px;
    if (!formen.length) return;
    if (px < 4) { g.beginPath(); for (const f of formen) formPfad(g, f); g.fillStyle = rgb(toene[0]); g.fill(); return; }
    const lU = F.lichtU || 0, lV = F.lichtV || 0;
    /* Grundton: die Hölzer nach ihrem Farbton (±6 %) in vier Stufen
       gebündelt – je Stufe EIN Pfad (früher je Holz ein eigener Verlauf) */
    const stufen = new Map();
    for (let i = 0; i < formen.length; i++) {
      const c = toene[i], k = Math.round((c[0] + c[1] + c[2]) / 12);
      if (!stufen.has(k)) stufen.set(k, { c: c, f: [] });
      stufen.get(k).f.push(formen[i]);
    }
    for (const st of stufen.values()) { g.beginPath(); for (const f of st.f) formPfad(g, f); g.fillStyle = rgb(st.c); g.fill(); }
    /* Wölbung und gebrochene Kanten: zur Sonne ein heller, zur Schatten-
       seite ein dunkler Saum (je ein gebündelter Strich) */
    if (px > 8) {
      g.lineCap = "butt"; g.lineJoin = "round";
      g.beginPath(); for (const f of formen) { const ly = f.n[0] * lU + f.n[1] * lV; kantePfad(g, f, ly > 0 ? -1 : 1, 0.018); }
      g.lineWidth = 0.034; g.strokeStyle = rgb(hell(toene[0], -0.5), 0.14); g.stroke();
      g.beginPath(); for (const f of formen) { const ly = f.n[0] * lU + f.n[1] * lV; kantePfad(g, f, ly > 0 ? 1 : -1, 0.016); }
      g.lineWidth = 0.03; g.strokeStyle = rgb(hell(toene[0], 0.35), 0.1); g.stroke();
    }
    const dunkel = hell(toene[0], -0.62);
    if (px > 8 && D.grau.length) {
      g.beginPath(); for (const P of D.grau) polyPfad(g, P);
      g.fillStyle = "rgba(168,164,156,0.13)"; g.fill();
    }
    g.lineCap = "round"; g.lineJoin = "round";
    if (px > 10) {
      g.lineWidth = Math.max(0.0035, 0.8 / px);
      g.beginPath(); linienPfad(g, D.maser, true); g.strokeStyle = rgb(dunkel, 0.24); g.stroke();
      if (px > 28) { g.beginPath(); linienPfad(g, D.fein, true); g.strokeStyle = rgb(dunkel, 0.15); g.stroke(); }
    }
    if (px > 18) {
      g.lineWidth = Math.max(0.005, 1.05 / px);
      g.beginPath(); linienPfad(g, D.risse, true); g.strokeStyle = rgb(hell(toene[0], -0.75), 0.55); g.stroke();
      if (px > 55) { g.lineWidth = Math.max(0.003, 0.7 / px); g.beginPath(); linienPfad(g, D.lippe, true); g.strokeStyle = "rgba(255,236,214,0.16)"; g.stroke(); }
    }
    /* abgeriebene Kanten und 1 cm helle Lichtkante */
    if (px > 22) { g.lineWidth = 0.014; g.beginPath(); linienPfad(g, D.abrieb, false); g.strokeStyle = "rgba(255,236,214,0.15)"; g.stroke(); }
    if (px > 10) {
      g.beginPath();
      for (const f of formen) { const ly = f.n[0] * lU + f.n[1] * lV; kantePfad(g, f, ly > 0 ? 1 : -1, 0.007); }
      g.lineWidth = Math.max(0.01, 0.9 / px); g.strokeStyle = "rgba(255,244,228,0.24)"; g.stroke();
    }
    /* Fuge zum Putz */
    g.beginPath(); for (const f of formen) formPfad(g, f);
    g.lineWidth = Math.max(0.006, 0.8 / px); g.strokeStyle = rgb(dunkel, 0.5); g.stroke();
    if (px > 45 && D.aeste.length) {
      g.beginPath(); for (const [x, y, r, a] of D.aeste) { g.moveTo(x + Math.cos(a) * r * 1.7, y + Math.sin(a) * r * 1.7); g.ellipse(x, y, r * 1.7, r, a, 0, Math.PI * 2); }
      g.fillStyle = rgb(dunkel, 0.55); g.fill();
      g.beginPath(); for (const [x, y, r, a] of D.aeste) { g.moveTo(x + Math.cos(a) * r * 2.8, y + Math.sin(a) * r * 2.8); g.ellipse(x, y, r * 2.8, r * 1.7, a, 0, Math.PI * 2); }
      g.lineWidth = 0.004; g.strokeStyle = rgb(dunkel, 0.3); g.stroke();
    }
  }
  /* Farbabrieb und Wetter: Rauschen nur auf den Hölzern (ein Clip für alle) */
  function holzAbrieb(g, F, formen, saat) {
    if (F.px > 16 && formen.length) {
      g.save(); g.beginPath(); for (const f of formen) formPfad(g, f); g.clip();
      const bx = vBox(formen.map((f) => f.mitte));
      rausch(g, bx[0] - 1, bx[1] - 1, bx[2] - bx[0] + 2, bx[3] - bx[1] + 2, 0.7, 0.2, saat + 61, 3);
      bleich(g, bx[0] - 1, bx[1] - 1, bx[2] - bx[0] + 2, bx[3] - bx[1] + 2, 1.1, 0.09, saat + 62);
      g.restore();
    }
  }
  /* ---------------- Roter Mainsandstein (Quader in Lagen) ----------------
     lagen: Höhen von unten nach oben (der Sockel: drei Lagen 0,42 / 0,38 /
     0,34 m, nach oben niedriger, wie gemauert wird). Gedecktes Rotbraun,
     kein Rosé: jeder Stein ±10 % Helligkeit, jeder zehnte gelblich-grau
     gebleicht. Steine 0,8–1,4 m lang; an den Ecken abwechselnd lange und
     kurze Ecksteine mit 2,5 cm Randschlag, im Spiegel (nah) eine diagonale
     Scharrierung. Die Kalkfugen (1 cm) liegen zurück – der Stein wirft
     seinen Schatten hinein. Unten Spritzwasserzone, an der Nordseite und im
     Frühling Moos. „Alles mit Struktur, so der Mörtel“ – Rauschen einmal
     über die ganze Fläche statt je Stein.
     Jede Lage hat ihren eigenen Zufall (Saat + Lagennummer): so sieht eine
     Lage beim Bauen genauso aus wie später am fertigen Haus (opt.ab =
     Nummer der untersten gemalten Lage). Alle Steine gleicher Tonstufe in
     EINEM Pfad, keine Clips. */
  const SANDSTEIN = [140, 78, 62];
  let SCHARR = null;
  function scharrMuster() {
    if (SCHARR) return SCHARR;
    const c = document.createElement("canvas"); c.width = c.height = 32;
    const g = c.getContext("2d");
    g.strokeStyle = "rgba(40,20,14,1)"; g.lineWidth = 1.6;
    g.beginPath(); for (let i = -4; i <= 8; i++) { g.moveTo(i * 8, 32); g.lineTo(i * 8 + 32, 0); } g.stroke();
    SCHARR = c;
    return c;
  }
  function sandsteinMalen(g, F, x, y, w, h, lagen, saat, opt) {
    opt = opt || {};
    const px = F.px, ab = opt.ab || 0, ecken = opt.ecken !== false;
    const fuge = Math.max(0.01, 0.9 / px);
    g.fillStyle = "rgb(118,106,94)"; g.fillRect(x - 0.02, y - 0.02, w + 0.04, h + 0.04);   // Mörtel, zurückliegend
    let yy = y + h;
    const sv = F.schatten ? F.schatten(0.015) : null;
    const steine = [], lagenY = [];
    for (let li = 0; li < lagen.length && yy > y + 0.001; li++) {
      const lh = Math.min(lagen[li], yy - y), y0 = yy - lh, nr = li + ab;
      const rng = zufall(saat * 977 + nr * 7919 + 13);
      lagenY.push([y0, lh]);
      /* Längen: Eckstein links, Läufer, Eckstein rechts (lang/kurz im Wechsel) */
      const lang = 0.72, kurz = 0.38, laenge = opt.laenge || 1.1;
      const liste = [];
      let xx = x;
      if (ecken) { const l0 = nr % 2 ? kurz : lang; liste.push([xx, l0, true]); xx += l0; }
      else xx = x - rng() * 0.3 * laenge;
      const ende = ecken ? x + w - (nr % 2 ? lang : kurz) : x + w;
      while (xx < ende - 0.02) {
        let lw = laenge * (0.72 + rng() * 0.55);
        if (ende - (xx + lw) < laenge * 0.45) lw = ende - xx;        // kein Stummel am Ende
        liste.push([xx, lw, false]); xx += lw;
      }
      if (ecken) liste.push([ende, x + w - ende, true]);
      for (const [sx, sl, eck] of liste) {
        const hh = 0.9 + rng() * 0.2, r = rng();
        let c = [SANDSTEIN[0] * hh, SANDSTEIN[1] * hh * (0.96 + rng() * 0.08), SANDSTEIN[2] * hh * (0.96 + rng() * 0.08)];
        let art = 0;
        if (eck) c = hell(c, 0.05);
        else if (r < 0.1) { c = misch(c, [150, 122, 100], 0.75); art = 1; }   // gelblich-grau gebleicht
        else if (r < 0.18) { c = misch(c, [128, 104, 96], 0.4); art = 2; }     // graurote Bank
        const bx = Math.max(x, sx) + fuge / 2, bw = Math.min(x + w, sx + sl) - Math.max(x, sx) - fuge;
        if (bw > 0.03) steine.push({ bx: bx, y0: y0 + fuge / 2, bw: bw, lh: lh - fuge, c: c, k: rng(), eck: eck, stufe: art * 10 + Math.round((hh - 0.9) * 20) });
      }
      yy = y0;
    }
    /* Schatten der Steinkanten in die zurückliegenden Fugen */
    if (sv && px > 10) {
      g.beginPath(); for (const st of steine) g.rect(st.bx + sv[0], st.y0 + sv[1], st.bw, st.lh);
      g.fillStyle = "rgb(84,72,64)"; g.fill();
    }
    /* Steine nach Tonstufen gebündelt */
    const gruppen = new Map();
    for (const st of steine) { const k = st.eck ? "e" + st.stufe : st.stufe; if (!gruppen.has(k)) gruppen.set(k, []); gruppen.get(k).push(st); }
    const rund = (st) => Math.min(0.02, st.lh * 0.1);
    for (const liste of gruppen.values()) {
      g.beginPath(); for (const st of liste) rundPfad(g, st.bx, st.y0, st.bw, st.lh, rund(st));
      g.fillStyle = rgb(liste[0].c); g.fill();
    }
    /* jede Lage leicht gewölbt: oben heller, unten dunkler (ein Verlauf je Lage) */
    if (px > 8) for (const [y0, lh] of lagenY) {
      const gr = g.createLinearGradient(0, y0, 0, y0 + lh);
      gr.addColorStop(0, "rgba(255,236,222,0.12)"); gr.addColorStop(0.2, "rgba(255,236,222,0)"); gr.addColorStop(0.75, "rgba(40,20,14,0)"); gr.addColorStop(1, "rgba(40,20,14,0.2)");
      g.fillStyle = gr; g.fillRect(x, y0, w, lh);
    }
    /* Schichtung (Buntsandstein ist geschichtet), ab und zu schräg –
       zwei Tonstufen, je ein Pfad, ohne Clip (Linien enden am Stein) */
    if (px > 30) {
      const schicht = [[], []];
      for (const st of steine) {
        if (st.k > 0.6) continue;                                   // nicht jeder Stein zeigt Schichten
        const n = 1 + ((st.k * 3) | 0), schraeg = st.k < 0.2 ? (st.k - 0.1) * 0.25 : 0;
        for (let k = 0; k < n; k++) {
          const yk = st.y0 + st.lh * (0.2 + 0.6 * ((st.k * 7.3 + k * 0.37) % 1));
          const P = []; for (let t = 0.03; t <= st.bw - 0.03; t += 0.1) P.push([st.bx + t, klemm(yk + schraeg * t + Math.sin(t * 7 + k * 3) * 0.006, st.y0 + 0.02, st.y0 + st.lh - 0.02)]);
          P.push([st.bx + st.bw - 0.03, P[P.length - 1][1]]);
          schicht[k % 2].push(P);
        }
      }
      g.lineWidth = Math.max(0.005, 0.7 / px);
      schicht.forEach((liste, k) => { g.beginPath(); for (const P of liste) P.forEach(([a, b], i) => (i ? g.lineTo(a, b) : g.moveTo(a, b))); g.strokeStyle = k ? "rgba(70,34,26,0.13)" : "rgba(214,160,136,0.12)"; g.stroke(); });
    }
    /* Kanten: oben Licht, unten Schatten (gebündelt) */
    if (px > 12) {
      g.lineWidth = Math.max(0.012, 1 / px);
      g.beginPath(); for (const st of steine) { g.moveTo(st.bx + 0.02, st.y0 + 0.008); g.lineTo(st.bx + st.bw - 0.02, st.y0 + 0.008); } g.strokeStyle = "rgba(255,232,214,0.2)"; g.stroke();
      g.beginPath(); for (const st of steine) { g.moveTo(st.bx + 0.02, st.y0 + st.lh - 0.008); g.lineTo(st.bx + st.bw - 0.02, st.y0 + st.lh - 0.008); } g.strokeStyle = "rgba(40,18,12,0.28)"; g.stroke();
    }
    /* Randschlag der Ecksteine (2,5 cm, glatter und heller) */
    if (px > 30) {
      const rs = 0.025;
      g.beginPath(); for (const st of steine) if (st.eck) g.rect(st.bx + rs / 2, st.y0 + rs / 2, st.bw - rs, st.lh - rs);
      g.lineWidth = rs; g.strokeStyle = "rgba(236,196,176,0.22)"; g.stroke();
      g.beginPath(); for (const st of steine) if (st.eck) g.rect(st.bx + rs, st.y0 + rs, st.bw - 2 * rs, st.lh - 2 * rs);
      g.lineWidth = Math.max(0.004, 0.6 / px); g.strokeStyle = "rgba(60,28,20,0.3)"; g.stroke();
    }
    /* Scharrierung im Spiegel: feine diagonale Hiebe, nur ganz nah */
    if (px > 90) {
      const sp = Math.max(0.012, 3 / px), m = g.createPattern(scharrMuster(), "repeat");
      m.setTransform(new DOMMatrix([sp / 8, 0, 0, sp / 8, 0, 0]));
      g.beginPath(); for (const st of steine) g.rect(st.bx + 0.03, st.y0 + 0.03, st.bw - 0.06, st.lh - 0.06);
      g.save(); g.globalAlpha = 0.12; g.fillStyle = m; g.fill(); g.restore();
    }
    /* Struktur einmal über die ganze Fläche */
    if (px > 18) rausch(g, x, y, w, h, 0.5, 0.2, saat + 3, 3);
    rausch(g, x, y, w, h, 2.6, 0.12, saat + 21, 4);
    /* Spritzwasserzone: unten dunkler, erdig; dazu ein eigener, weicher
       Kontaktschatten (der des Kerns ist 55 cm hoch und grau – am Sockel
       machte er die unterste Lage zu einem grauen Band) */
    if (opt.spritz !== false && h > 0.35) {
      const gr = g.createLinearGradient(0, y + h, 0, y + h - 0.35);
      gr.addColorStop(0, "rgba(52,40,30,0.34)"); gr.addColorStop(0.35, "rgba(56,44,34,0.14)"); gr.addColorStop(1, "rgba(56,44,34,0)");
      g.fillStyle = gr; g.fillRect(x, y + h - 0.35, w, 0.35);
      if (px > 20) tonFlecken(g, x, y + h - 0.25, w, 0.25, 0.35, 0.3, saat + 4, "#4a3a2c");
    }
    /* Nordseite (altes Haus): grünlicher Anflug unten und Moos in den Fugen */
    if (opt.nord) {
      tonFlecken(g, x, y + h - 0.6, w, 0.6, 0.9, 0.35, saat + 9, "#4f6a34");
      const gr = g.createLinearGradient(0, y + h, 0, y + h - 0.6);
      gr.addColorStop(0, "rgba(60,84,36,0.3)"); gr.addColorStop(1, "rgba(60,84,36,0)");
      g.fillStyle = gr; g.fillRect(x, y + h - 0.6, w, 0.6);
    }
    /* Moos in den unteren Lagerfugen (Frühling am alten Haus, Nordseite) */
    if ((opt.fruehling || opt.nord) && px > 12) {
      const rm = zufall(saat + 5), grenze = opt.nord ? 0.8 : 0.45;
      g.beginPath();
      for (const st of steine) {
        if (st.y0 + st.lh < y + h - grenze || rm() < 0.35) continue;
        const l = st.bw * (0.2 + rm() * 0.5), sx = st.bx + rm() * (st.bw - l);
        g.moveTo(sx + l, st.y0 + st.lh); g.ellipse(sx + l / 2, st.y0 + st.lh + fuge * 0.3, l / 2, fuge * 1.1, 0, 0, Math.PI * 2);
      }
      g.fillStyle = "rgba(84,112,48,0.72)"; g.fill();
    }
  }

  /* ---------------- Biberschwanz, Doppeldeckung ----------------
     Reihen von der Traufe nach oben (jede höhere Reihe liegt auf der
     unteren). yEnde = Abstand dieser Fläche zur Traufe (für nahtlose
     Reihen über den Knick). Nur Reihen im Bereich [yVon, yBis] (Schnee). */
  const ZB_ = 0.18, ZR_ = 0.155, ZB = ZB_, ZR = ZR_;
  function biberMalen(g, F, w, h, yEnde, saat, opt) {
    opt = opt || {};
    const px = F.px, pxV = F.pxV || px, pxU = F.pxU || px;
    const basis = opt.farbe || [150, 70, 46];
    const ZB = opt.breite || ZB_, ZR = opt.reihe || ZR_;
    const yVon = opt.yVon == null ? -1 : opt.yVon, yBis = opt.yBis == null ? h + 1 : opt.yBis;
    g.fillStyle = rgb(hell(basis, -0.42)); g.fillRect(-0.05, Math.max(-0.05, yVon - 0.3), w + 0.1, Math.min(h + 0.1, yBis + 0.3) - Math.max(-0.05, yVon - 0.3));
    /* Detailstufe quer zu den Reihen: unter 4 Bildpunkten je Reihe nur
       weiche Reihenstreifen (sonst flimmert es wie Wellblech) */
    const nurReihen = pxV * ZR < 4, ohneFugen = pxU * ZB < 5;
    /* ausgebesserte Stellen: 2–4 Ziegel breit, 2–4 Reihen hoch */
    const flicken = [];
    if (opt.alt) { const rf = zufall(saat * 13 + 5); for (let i = 0, n = Math.round(w * h / 10); i < n; i++) { const x = rf() * w, kk = Math.floor(rf() * (h / ZR)); flicken.push([x, x + ZB * (2 + Math.floor(rf() * 3)), kk, kk + 2 + Math.floor(rf() * 3)]); } }
    for (let k = 0; ; k++) {
      const yu = h + yEnde - k * ZR;
      if (yu < -0.02) break;
      if (yu - 2.1 * ZR > h + 0.05) continue;
      if (yu < yVon - 0.05 || yu - ZR > yBis + 0.05) continue;
      const rr = zufall(saat * 31 + k * 7919);
      const rc = PI.streu(basis, rr, 0.025);
      if (nurReihen) {
        const gr = g.createLinearGradient(0, yu - ZR, 0, yu + 0.03);
        gr.addColorStop(0, rgb(hell(rc, -0.12))); gr.addColorStop(0.25, rgb(rc)); gr.addColorStop(0.8, rgb(hell(rc, 0.05))); gr.addColorStop(1, rgb(hell(rc, -0.35)));
        g.fillStyle = gr; g.fillRect(-0.05, yu - ZR, w + 0.1, ZR + 0.03);
        continue;
      }
      const vers = (k % 2) * ZB / 2;
      if (ohneFugen) {
        /* Reihe als ein Band mit runden Schwänzen (ein Pfad je Reihe) */
        const zeile = (dy, farbe) => {
          g.fillStyle = farbe; g.beginPath(); g.moveTo(-0.05, yu - 2.05 * ZR);
          for (let xx = -ZB + vers - 0.02; xx < w + ZB; xx += ZB) { g.lineTo(xx, yu - ZB * 0.42 + dy); g.quadraticCurveTo(xx + ZB / 2, yu + dy + 0.004, xx + ZB, yu - ZB * 0.42 + dy); }
          g.lineTo(w + 0.1, yu - 2.05 * ZR); g.closePath(); g.fill();
        };
        zeile(0.022, "rgba(25,10,6,0.45)");
        zeile(0, rgb(rc));
        continue;
      }
      /* Ziegel der Reihe nach Tonstufen gebündelt (je Stufe EIN Pfad):
         ±3,5 % je Ziegel, wenige Nachzügler; am alten Haus Gruppen
         verwitterter (dunkler, grünstichiger) Ziegel und hellere,
         orangere Flicken aus neu eingesetzten Ziegeln */
      const gruppen = new Map(), alle = [];
      for (let xx = -ZB + vers - 0.02; xx < w + ZB; xx += ZB) {
        const q = rr(), v = rr();
        let key, c;
        const alt = opt.alt ? ST.fbm(xx * 0.5 + saat, yu * 0.6, 2, saat) : 0;
        const flick = opt.alt && flicken.some((f) => xx >= f[0] && xx < f[1] && k >= f[2] && k < f[3]);
        if (flick) { key = "r" + (v < 0.5 ? 0 : 1); c = hell(misch(rc, [184, 92, 58], 0.5), v < 0.5 ? 0.04 : 0.09); }
        else if (alt > 0.64) { key = "a" + (v < 0.5 ? 0 : 1); c = v < 0.5 ? misch(hell(rc, -0.16), [86, 92, 58], 0.28) : hell(rc, -0.1); }
        else if (q < 0.02) { key = "d"; c = hell(rc, -0.12); }
        else if (q < 0.035) { key = "h"; c = hell(rc, 0.07); }
        else { const t = Math.floor(v * 4); key = "n" + t; c = hell(rc, (t - 1.5) * 0.022); }
        if (!gruppen.has(key)) gruppen.set(key, { c: c, x: [] });
        gruppen.get(key).x.push(xx + 0.004);
        alle.push(xx + 0.004);
      }
      const b = ZB - 0.008, lang = 2.05 * ZR, y0 = yu - lang;
      /* dunkler Saum unter dem Schwanzbogen (2–3 cm) */
      g.beginPath();
      for (const x0 of alle) { g.moveTo(x0 + 0.01, yu - ZR); g.lineTo(x0 + 0.01, yu - b * 0.45 + 0.025); g.quadraticCurveTo(x0 + b / 2 + 0.01, yu + 0.028, x0 + b + 0.01, yu - b * 0.45 + 0.025); g.lineTo(x0 + b + 0.01, yu - ZR); g.closePath(); }
      g.fillStyle = "rgba(25,10,6,0.45)"; g.fill();
      /* Ziegel mit Segmentschnitt */
      for (const gr of gruppen.values()) {
        g.beginPath();
        for (const x0 of gr.x) { g.moveTo(x0, y0); g.lineTo(x0, yu - b * 0.42); g.quadraticCurveTo(x0 + b / 2, yu + 0.004, x0 + b, yu - b * 0.42); g.lineTo(x0 + b, y0); g.closePath(); }
        g.fillStyle = rgb(gr.c); g.fill();
      }
      if (px * ZB > 9) {
        g.lineWidth = Math.max(0.004, 0.8 / px);
        g.beginPath(); for (const x0 of alle) { g.moveTo(x0 + 0.01, yu - b * 0.36); g.quadraticCurveTo(x0 + b / 2, yu - 0.004, x0 + b - 0.01, yu - b * 0.36); }
        g.strokeStyle = rgb(hell(rc, 0.18), 0.5); g.stroke();
        g.beginPath(); for (const x0 of alle) { g.moveTo(x0 + b, yu - ZR * 0.95); g.lineTo(x0 + b, yu - b * 0.42); }
        g.strokeStyle = rgb(hell(rc, -0.45), 0.45); g.stroke();
      }
      /* Schattenkante der nächsthöheren Reihe (Überdeckung) */
      if (pxV * ZR > 5) {
        const gr = g.createLinearGradient(0, yu - ZR - 0.01, 0, yu - ZR + 0.05);
        gr.addColorStop(0, "rgba(30,12,8,0.3)"); gr.addColorStop(1, "rgba(30,12,8,0)");
        g.fillStyle = gr; g.fillRect(-0.05, yu - ZR - 0.01, w + 0.1, 0.06);
      }
    }
    /* Großflächige Alterung (±8 %): Sonne bleicht, Regen dunkelt nach */
    const y0 = Math.max(0, yVon - 0.2), y1 = Math.min(h, yBis + 0.3);
    if (y1 > y0) {
      rausch2(g, 0, y0, w, y1 - y0, 2.6, 0.13, saat + 8);
      if (px * ZB > 3) rausch(g, 0, y0, w, y1 - y0, ZB * 5.3, 0.1, saat + 17, 2);
      bleich(g, 0, y0, w, y1 - y0, 3.3, 0.06, saat + 3);
      if (opt.alt) {
        /* Patina: grünlich-graue Wolken (wirkt auch weit weg, wo keine
           einzelnen Ziegel mehr gemalt werden) */
        tonFlecken(g, 0, y0, w, y1 - y0, 2.4, 0.2, saat + 41, "#4e5234");
        /* Schmutzfahnen unter Gauben und Kamin: 1,5 m lang, oben 0,15 */
        for (const [xa, xb, yt] of opt.streifen || []) {
          const gs = g.createLinearGradient(0, yt, 0, yt + 1.5);
          gs.addColorStop(0, "rgba(40,30,24,0.15)"); gs.addColorStop(1, "rgba(40,30,24,0)");
          g.fillStyle = gs; g.fillRect(xa, yt, xb - xa, 1.5);
          g.fillRect(xa + (xb - xa) * 0.2, yt, (xb - xa) * 0.25, 1.1);
        }
        /* Moosstreifen in der Falllinie (Nordseite): wo das Wasser läuft */
        if (opt.moosStreifen && px > 4) {
          const rm = zufall(saat + 77);
          for (let i = 0, n = Math.round(w * 0.9); i < n; i++) {
            const x = rm() * w, bw = 0.06 + rm() * 0.1, ya = y0 + rm() * (y1 - y0) * 0.6, l = 1 + rm() * 2.2;
            const gm = g.createLinearGradient(0, ya, 0, ya + l);
            gm.addColorStop(0, "rgba(92,110,54,0)"); gm.addColorStop(0.3, "rgba(92,110,54,0.22)"); gm.addColorStop(1, "rgba(92,110,54,0.08)");
            g.fillStyle = gm; g.fillRect(x, ya, bw, l);
          }
        }
      }
      /* Moos und Flechten: Nordseite, unten, wo es lange feucht bleibt */
      if (opt.moos) {
        const ab = Math.max(y0, h - opt.moos);
        const gm = g.createLinearGradient(0, h, 0, ab);
        gm.addColorStop(0, "rgba(96,112,58,0.55)"); gm.addColorStop(1, "rgba(96,112,58,0)");
        g.save();
        g.globalCompositeOperation = "multiply"; g.fillStyle = gm; g.fillRect(-0.05, ab, w + 0.1, h - ab + 0.05);
        g.restore();
        if (px * ZB > 5) {
          const rm = zufall(saat + 99);
          /* Moospolster sitzen in Grüppchen an den Unterkanten der Ziegel
             (dort bleibt das Wasser stehen), dazu graugelbe Flechten */
          const farben = ["rgba(98,118,52,0.62)", "rgba(122,138,66,0.55)", "rgba(80,96,46,0.6)", "rgba(172,168,116,0.5)"];
          for (let i = 0; i < w * opt.moos * 2.4; i++) {
            const k = Math.floor(Math.pow(rm(), 1.7) * opt.moos / ZR);
            const yu = h + yEnde - k * ZR, cx = rm() * w, farbe = farben[Math.floor(rm() * farben.length)];
            if (yu > h + 0.02) continue;
            g.fillStyle = farbe;
            for (let j = 0, n = 2 + Math.floor(rm() * 4); j < n; j++) {
              const r = 0.012 + rm() * 0.03;
              g.beginPath(); g.ellipse(cx + (rm() - 0.5) * 0.2, yu - 0.012 - rm() * 0.03, r * 1.5, r * 0.75, 0, 0, Math.PI * 2); g.fill();
            }
          }
        }
      }
    }
  }

  /* ---------------- Getönte Flecken ----------------
     Ein Rauschmuster als Farbe mit Deckkraft (statt grauer Multiplikation):
     so bekommt Schnee bläuliche Mulden und weiße Kuppen, Putz grünliche
     Algen – mit einem einzigen Füllbefehl. */
  const TON = {};
  function tonMuster(saat, farbe, weich) {
    const k = saat + "|" + farbe + "|" + (weich || 0);
    if (TON[k]) return TON[k];
    const quelle = PI.rauschBild(1 + (saat % 5), 128, 4, 3, 1.6);
    const d = quelle.getContext("2d").getImageData(0, 0, 128, 128).data;
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d"), id = g.createImageData(128, 128), f = hex(farbe);
    const u = weich ? 0.2 : 0.35, o = weich ? 0.8 : 0.5;
    for (let i = 0; i < 128 * 128; i++) {
      const v = klemm((d[i * 4] / 255 - u) / o, 0, 1);
      id.data[i * 4] = f[0]; id.data[i * 4 + 1] = f[1]; id.data[i * 4 + 2] = f[2];
      id.data[i * 4 + 3] = Math.round(v * v * (3 - 2 * v) * 255);
    }
    g.putImageData(id, 0, 0);
    TON[k] = c;
    return c;
  }
  function tonFlecken(g, x, y, w, h, meter, staerke, saat, farbe, weich) {
    const s = Math.abs(saat | 0);
    const m = g.createPattern(tonMuster(s % 7, farbe, weich), "repeat");
    musterLage(m, meter, s, (s >> 2) % 2 ? -1 : 1);
    g.save(); g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }
  /* Glitzer: viele winzige Lichtpunkte in EINEM Pfad */
  function glitzer(g, F, x, y, w, h, dichte, rng, farbe) {
    if (F.px <= 18 || F.licht < 0.2) return;
    const k = Math.min(900, Math.round(w * h * dichte));
    g.beginPath();
    for (let i = 0; i < k; i++) { const r = (0.5 + rng() * 0.8) / F.px; g.rect(x + rng() * w, y + rng() * h, r, r); }
    g.fillStyle = farbe || "rgba(255,255,255,0.95)"; g.fill();
  }

  /* ---------------- Schnee (Fläche) ----------------
     Pulverschnee ist nie reinweiß und nie glatt: Grundton #e8edf5, darüber
     großflächige, bläuliche Mulden (bis #b9c6da) und weiße Kuppen (bis
     #f4f7fc) aus zwei gedrehten Rauschmaßstäben – 12–18 % Helligkeits-
     spanne –, dazu lange Windverwehungen und Glitzer auf der Sonnenseite. */
  function schneeFlaeche(g, F, x, y, w, h, saat, opt) {
    opt = opt || {};
    const rng = zufall(saat * 131 + 7);
    g.fillStyle = "rgb(232,237,245)"; g.fillRect(x, y, w, h);
    /* Wind- und Leeseite: ein breiter, weicher Verlauf quer über die Fläche */
    const wl = g.createLinearGradient(x, 0, x + w, 0);
    const a0 = 0.04 + rng() * 0.08, a1 = 0.04 + rng() * 0.08;
    wl.addColorStop(0, "rgba(160,178,212," + a0.toFixed(3) + ")"); wl.addColorStop(0.5, "rgba(160,178,212,0)"); wl.addColorStop(1, "rgba(160,178,212," + a1.toFixed(3) + ")");
    g.fillStyle = wl; g.fillRect(x, y, w, h);
    if (F.px > 3) {
      tonFlecken(g, x, y, w, h, 3.3, 0.55, saat + 31, "#b9c6da", true);
      /* Ziegelrelief (Rippen) unter den weißen Kuppen: wo Schnee
         zusammengeweht ist, verschwinden die Reihen – kein Wellblech */
      if (opt.zwischen) opt.zwischen();
      tonFlecken(g, x, y, w, h, 1.9, 0.75, saat + 47, "#f6f8fc", true);
      if (F.px > 16) tonFlecken(g, x, y, w, h, 0.7, 0.3, saat + 53, "#c9d4e6");
    }
    /* lange, flache Verwehungen quer zum Hang */
    const n = Math.min(6, Math.round(w * h * 0.08) + 2);
    for (let i = 0; i < n; i++) {
      const cx = x + rng() * w, cy = y + rng() * h, rx = 0.9 + rng() * 2.2, ry = 0.08 + rng() * 0.16;
      const gg = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
      const hellK = rng() < 0.5;
      gg.addColorStop(0, hellK ? "rgba(252,253,255,0.5)" : "rgba(150,168,206,0.22)"); gg.addColorStop(1, hellK ? "rgba(252,253,255,0)" : "rgba(150,168,206,0)");
      g.save(); g.translate(cx, cy); g.scale(1, ry / rx); g.fillStyle = gg; g.beginPath(); g.arc(0, 0, rx, 0, Math.PI * 2); g.fill(); g.restore();
    }
    if (opt.glitzer !== false) glitzer(g, F, x, y, w, h, 6, rng);
  }

  /* =====================================================================
     FACHWERK-PLAN
     Koordinaten der Wand: a (entlang, von links von außen gesehen),
     h (Höhe über Wandunterkante). felder: [Typ, Breite (Ständermitte zu
     Ständermitte), Zier]. Typen: E Eckfeld (halber Mann an der Ecke),
     F Fenster, G Riegelfeld, M Mann, T Tür.
     ===================================================================== */
  function fachwerkPlan(L, H, felder, opt) {
    opt = opt || {};
    const b = 0.2, hs = opt.hs == null ? 0.22 : opt.hs, hr = opt.hr == null ? 0.2 : opt.hr, rb = 0.15;
    const fu = opt.fu, fo = opt.fo;
    const P = { L: L, H: H, hs: hs, hr: hr, b: b, glieder: [], oeff: [], gefache: [], naegel: [], felder: felder };
    const G = P.glieder;
    const neu = (art, p0, p1, bb, x) => { const m = Object.assign({ art: art, p0: p0, p1: p1, b: bb || b, teilt: true }, x || {}); G.push(m); return m; };
    const pos = [b / 2]; for (const f of felder) pos.push(pos[pos.length - 1] + f[1]);
    P.pfosten = pos;
    /* Schwelle (an Türen unterbrochen) und Rähm */
    let sa = -0.02;
    felder.forEach((f, i) => { if (f[0] === "T") { const t0 = pos[i] + b / 2, t1 = pos[i + 1] - b / 2; neu("schwelle", [sa, hs / 2], [t0, hs / 2], hs, { teilt: false }); sa = t1; } });
    neu("schwelle", [sa, hs / 2], [L + 0.02, hs / 2], hs, { teilt: false });
    neu("raehm", [-0.02, H - hr / 2], [L + 0.02, H - hr / 2], hr, { teilt: false });
    pos.forEach((a, i) => neu("staender", [a, hs - 0.04], [a, H - hr + 0.04], b, { teilt: false, ecke: i === 0 || i === pos.length - 1 }));
    const zellen = [];
    /* Strebe: Achse von p nach q, an beiden Enden in die Nachbarhölzer verlängert */
    const strebe = (p, q, bereich, bb, art, ext) => {
      const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy), e = ext == null ? 0.22 : ext;
      return neu(art || "strebe", [p[0] - dx / l * e, p[1] - dy / l * e], [q[0] + dx / l * e, q[1] + dy / l * e], bb || 0.18, { bereich: bereich });
    };
    const bogen = (p, k, q, bereich, bb) => neu("bogen", p, q, bb || 0.16, { k: k, teilt: false, bereich: bereich });
    const nagel = (a, h) => P.naegel.push([a, h]);
    const box = (x0, y0, x1, y1) => [x0 - 0.03, y0 - 0.03, x1 + 0.03, y1 + 0.03];
    /* Brüstungszier im Feld x0…x1, h0…h1 */
    const bruestung = (art, x0, x1, h0, h1) => {
      const bx = box(x0, h0, x1, h1), am = (x0 + x1) / 2, hm = (h0 + h1) / 2;
      if (!art) return;
      if (art === "kreuz" || art === "kreuzraute") {
        strebe([x0, h0], [x1, h1], bx, 0.15); strebe([x1, h0], [x0, h1], bx, 0.15);
      }
      if (art === "raute" || art === "kreuzraute") {
        const e = 0.06;
        strebe([am, h0], [x1, hm], bx, 0.13, "strebe", e); strebe([x1, hm], [am, h1], bx, 0.13, "strebe", e);
        strebe([am, h1], [x0, hm], bx, 0.13, "strebe", e); strebe([x0, hm], [am, h0], bx, 0.13, "strebe", e);
      }
      if (art === "feuerbock") {
        neu("staender", [am, h0 - 0.04], [am, h1 + 0.04], 0.14, { bereich: bx });
        bogen([x0 - 0.06, h1 + 0.04], [x0 + (am - x0) * 0.62, h1 - (h1 - h0) * 0.12], [am, h0 + 0.1], bx, 0.13);
        bogen([x1 + 0.06, h1 + 0.04], [x1 - (x1 - am) * 0.62, h1 - (h1 - h0) * 0.12], [am, h0 + 0.1], bx, 0.13);
        bogen([x0 - 0.06, h0 - 0.04], [x0 + (am - x0) * 0.62, h0 + (h1 - h0) * 0.12], [am, h1 - 0.1], bx, 0.13);
        bogen([x1 + 0.06, h0 - 0.04], [x1 - (x1 - am) * 0.62, h0 + (h1 - h0) * 0.12], [am, h1 - 0.1], bx, 0.13);
      }
      if (art === "geschweift") {
        bogen([x0 - 0.05, h0 - 0.05], [am + (x1 - x0) * 0.08, hm - (h1 - h0) * 0.32], [x1 + 0.05, h1 + 0.05], bx, 0.14);
        bogen([x1 + 0.05, h0 - 0.05], [am - (x1 - x0) * 0.08, hm - (h1 - h0) * 0.32], [x0 - 0.05, h1 + 0.05], bx, 0.14);
      }
    };
    const hBr = fu - rb / 2, hSt = fo + rb / 2;
    felder.forEach((f, i) => {
      const typ = f[0], zier = f[2];
      const a0 = pos[i] + b / 2, a1 = pos[i + 1] - b / 2, h0 = hs, h1 = H - hr, am = (a0 + a1) / 2;
      const bx = box(a0, h0, a1, h1);
      const sturz = fo + rb <= h1 - 0.05;
      const riegel = (x0, x1, h, ber) => { nagel(x0 - 0.1, h); nagel(x1 + 0.1, h); return neu("riegel", [x0 - 0.12, h], [x1 + 0.12, h], rb, { bereich: ber }); };
      if (typ === "T") { P.oeff.push({ art: "tuer", a0: a0, a1: a1, h0: 0, h1: h1 }); return; }
      zellen.push([[a0, h0], [a1, h0], [a1, h1], [a0, h1]]);
      if (typ === "F") {
        riegel(a0, a1, hBr, bx);
        if (sturz) riegel(a0, a1, hSt, bx);
        P.oeff.push({ art: "fenster", a0: a0, a1: a1, h0: fu, h1: sturz ? fo : h1, feld: i });
        bruestung(zier, a0, a1, h0, fu - rb);
      } else if (typ === "G") {
        riegel(a0, a1, hBr, bx);
        if (sturz) riegel(a0, a1, hSt, bx);
        bruestung(zier, a0, a1, h0, fu - rb);
      } else if (typ === "M") {
        neu("staender", [am, h0 - 0.04], [am, h1 + 0.04], b, { bereich: bx });
        for (const s of [-1, 1]) {
          const x0 = s < 0 ? a0 : am + b / 2, x1 = s < 0 ? am - b / 2 : a1;
          const hb = box(x0, h0, x1, h1);
          riegel(x0, x1, hBr, hb);
          const ax = s < 0 ? a0 : a1, pxx = s < 0 ? am - b / 2 : am + b / 2;
          strebe([ax, h0], [pxx, h0 + (h1 - h0) * 0.66], hb, 0.18);
          nagel(am, h0 + (h1 - h0) * 0.62);
          strebe([pxx, h1 - 0.58], [pxx + s * 0.5, h1], hb, 0.15);
          nagel(am, h1 - 0.5);
        }
      } else if (typ === "E") {
        const links = i === 0;
        const ec = links ? a0 : a1, inn = links ? a1 : a0, s = links ? 1 : -1;
        riegel(a0, a1, hBr, bx);
        strebe([inn, h0], [ec, h0 + (h1 - h0) * 0.68], bx, 0.18);
        strebe([ec, h1 - 0.58], [ec + s * 0.5, h1], bx, 0.15);
        nagel(ec - s * 0.1, h0 + (h1 - h0) * 0.64); nagel(ec - s * 0.1, h1 - 0.5);
      }
    });
    /* Gefache: Zellen mit allen teilenden Hölzern zerschneiden */
    let polys = zellen;
    for (const m of G) if (m.teilt) polys = zerschneiden(polys, m);
    gefacheSortieren(P, polys);
    return P;
  }

  /* Gefache auf Öffnungen verwerfen; sehr schmale Reste (Dicke 2·A/U
     unter 6 cm) sind keine echten Gefache – ein Zimmermann hätte dort die
     Hölzer zusammengeschoben. Sie werden als Holz gemalt (P.fueller). */
  function gefacheSortieren(P, polys) {
    P.gefache = []; P.fueller = [];
    for (const Q of polys) {
      const c = vMitte(Q);
      if (P.oeff.some((o) => c[0] > o.a0 && c[0] < o.a1 && c[1] > o.h0 && c[1] < o.h1)) continue;
      let U = 0; for (let i = 0; i < Q.length; i++) { const a = Q[i], b = Q[(i + 1) % Q.length]; U += Math.hypot(b[0] - a[0], b[1] - a[1]); }
      const dicke = 2 * Math.abs(vFlaeche(Q)) / Math.max(1e-6, U);
      if (dicke < 0.06) P.fueller.push(Q); else { Q.dicke = dicke; P.gefache.push(Q); }
    }
  }
  /* Giebel-Plan: Dreieck, Basis L = 2·w2, Höhe gh (bis Unterkante Dach) */
  function giebelPlan(w2, gh, opt) {
    opt = opt || {};
    const L = 2 * w2, b = 0.2, hs = 0.2, st = gh / w2;
    const P = { L: L, H: gh, hs: hs, hr: 0, b: b, glieder: [], oeff: [], gefache: [], naegel: [], giebel: true };
    const G = P.glieder;
    const neu = (art, p0, p1, bb, x) => { const m = Object.assign({ art: art, p0: p0, p1: p1, b: bb || b, teilt: true }, x || {}); G.push(m); return m; };
    const dachH = (a) => gh - Math.abs(a - w2) * st;            // Oberkante (Dachunterseite)
    const innenH = (a) => dachH(a) - 0.2 / Math.cos(Math.atan(st)) - 0.02;
    const strebe = (p, q, ber, bb, e) => {
      const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy); e = e == null ? 0.22 : e;
      return neu("strebe", [p[0] - dx / l * e, p[1] - dy / l * e], [q[0] + dx / l * e, q[1] + dy / l * e], bb || 0.17, { bereich: ber });
    };
    const box = (x0, y0, x1, y1) => [x0 - 0.03, y0 - 0.03, x1 + 0.03, y1 + 0.03];
    /* Schwelle, Ortgangsparren (unter dem Dach, in der Giebelebene) */
    neu("schwelle", [-0.3, hs / 2], [L + 0.3, hs / 2], hs, { teilt: false });
    const sp = 0.2 / Math.cos(Math.atan(st)) / 2;
    neu("raehm", [-0.4, -0.4 * st - sp + 0.0], [w2, gh - sp], 0.2, { teilt: false });
    neu("raehm", [w2, gh - sp], [L + 0.4, -0.4 * st - sp], 0.2, { teilt: false });
    const hK = 2.42;                                      // Kehlbalkenlage
    const kRand = (gh - 0.26 - hK) / st;                  // halbe Breite auf Höhe hK
    neu("riegel", [w2 - kRand - 0.3, hK], [w2 + kRand + 0.3, hK], 0.18, { teilt: true });
    P.kehle = hK;
    /* Ständer */
    const post = (a, h0, h1) => neu("staender", [a, h0 - 0.04], [a, h1 + 0.04], b, { teilt: true, bereich: [-9, h0 - 0.1, 99, h1 + 0.1] });
    post(w2, hs, gh);
    for (const s of [-1, 1]) {
      post(w2 + s * 1.3, hs, hK);
      post(w2 + s * 2.55, hs, innenH(w2 + s * 2.55) + 0.1);
      post(w2 + s * 0.8, hK, innenH(w2 + s * 0.8) + 0.1);
    }
    /* Zellen: zuerst Dreieck innerhalb der Sparren über der Schwelle */
    let tri = [[0, hs], [L, hs], [w2, gh]];
    const nS = st / Math.hypot(1, st);
    tri = halbEbene(tri, [nS * 1, -1 / Math.hypot(1, st)].map((v) => v), 0);
    let polys = [[[-1, hs], [L + 1, hs], [L + 1, gh + 1], [-1, gh + 1]]];
    /* innen der Sparren: n = nach innen gerichtet */
    for (const s of [-1, 1]) {
      const d = [s, -st]; const l = Math.hypot(d[0], d[1]);
      const n = [-s * st / l, -1 / l];        // zeigt nach unten-innen
      const pSp = [w2, gh];
      const c = n[0] * pSp[0] + n[1] * pSp[1] + 0.2 / 1.0;
      polys = polys.map((Q) => halbEbene(Q, n, c)).filter((Q) => Q.length >= 3);
    }
    void tri;
    /* Kehlriegel und Ständer schneiden global/bereichsweise */
    const rb = 0.15;
    /* Der Sturzriegel liegt direkt unter dem Kehlbalken (Oberkante Sturz =
       Unterkante Kehlbalken) – sonst bliebe ein 6 cm schmaler Putzstreifen,
       den kein Zimmermann so baut */
    const fu = 0.98, fo = hK - 0.09 - rb;
    for (const s of [-1, 1]) {
      /* Fenster im Dachgeschoss zwischen Mittelständer und 1,3-Ständer */
      const x0 = s < 0 ? w2 - 1.2 : w2 + 0.1, x1 = s < 0 ? w2 - 0.1 : w2 + 1.2;
      const bx = box(x0, hs, x1, hK);
      neu("riegel", [x0 - 0.12, fu - rb / 2], [x1 + 0.12, fu - rb / 2], rb, { bereich: bx });
      neu("riegel", [x0 - 0.12, fo + rb / 2], [x1 + 0.12, fo + rb / 2], rb, { bereich: bx });
      P.oeff.push({ art: "fenster", a0: x0, a1: x1, h0: fu, h1: fo, klein: false });
      P.naegel.push([x0 - 0.1, fu - rb / 2], [x1 + 0.1, fu - rb / 2]);
      /* Brüstung: am Ostgiebel ein Andreaskreuz, am Westgiebel ein
         geschweiftes Kreuz (zwei Bögen) – zwei Giebel desselben Hauses
         bekamen oft verschiedene Zierformen */
      const hb = fu - rb;
      const bb = box(x0, hs, x1, hb);
      if (opt.west) {
        const am = (x0 + x1) / 2, hm = (hs + hb) / 2;
        neu("bogen", [x0 - 0.05, hs - 0.02], [x1 + 0.05, hb + 0.02], 0.14, { k: [am + (x1 - x0) * 0.1, hm - (hb - hs) * 0.35], teilt: false, bereich: bb });
        neu("bogen", [x1 + 0.05, hs - 0.02], [x0 - 0.05, hb + 0.02], 0.14, { k: [am - (x1 - x0) * 0.1, hm - (hb - hs) * 0.35], teilt: false, bereich: bb });
      } else { strebe([x0, hs], [x1, hb], bb, 0.14); strebe([x1, hs], [x0, hb], bb, 0.14); }
      /* Mann-Hälfte zwischen 1,3 und 2,55: Fußstrebe und Riegel */
      const y0 = s < 0 ? w2 - 2.45 : w2 + 1.4, y1 = s < 0 ? w2 - 1.4 : w2 + 2.45;
      const mb = box(y0, hs, y1, hK);
      neu("riegel", [y0 - 0.12, fu - rb / 2], [y1 + 0.12, fu - rb / 2], rb, { bereich: mb });
      strebe([s < 0 ? y0 : y1, hs], [s < 0 ? y1 : y0, hs + 1.55], mb, 0.17);
      /* äußerer Zwickel: kurze Strebe */
      const z0 = s < 0 ? -0.5 : w2 + 2.65, z1 = s < 0 ? w2 - 2.65 : L + 0.5;
      const zb = box(z0, hs, z1, gh);
      strebe([s < 0 ? w2 - 2.65 : w2 + 2.65, hs + 0.02], [s < 0 ? w2 - 3.35 : w2 + 3.35, innenH(s < 0 ? w2 - 3.35 : w2 + 3.35) + 0.05], zb, 0.14, 0.18);
      /* Spitzboden: kleines Fenster neben dem Mittelständer */
      const k0 = s < 0 ? w2 - 0.7 : w2 + 0.1, k1 = s < 0 ? w2 - 0.1 : w2 + 0.7;
      const kb = box(k0, hK, k1, gh);
      neu("riegel", [k0 - 0.12, 2.98], [k1 + 0.12, 2.98], 0.13, { bereich: kb });
      neu("riegel", [k0 - 0.12, 3.62], [k1 + 0.12, 3.62], 0.13, { bereich: kb });
      P.oeff.push({ art: "fenster", a0: k0, a1: k1, h0: 3.045, h1: 3.555, klein: true });
      /* Kopfbänder am Mittelständer */
      strebe([w2 + s * 0.1, 3.8], [w2 + s * 0.52, innenH(w2 + s * 0.52) + 0.02], s < 0 ? box(w2 - 0.8, 3.7, w2, gh) : box(w2, 3.7, w2 + 0.8, gh), 0.12, 0.15);
    }
    for (const m of G) if (m.teilt) polys = zerschneiden(polys, m);
    gefacheSortieren(P, polys);
    P.dachH = dachH;
    return P;
  }

  /* Plan in Flächenkoordinaten (y nach unten) umrechnen */
  function planFlaeche(P) {
    const H = P.H;
    const f = (p) => [p[0], H - p[1]];
    return {
      L: P.L, H: H, plan: P,
      glieder: P.glieder.map((m) => Object.assign({}, m, { p0: f(m.p0), p1: f(m.p1), k: m.k ? f(m.k) : null })),
      gefache: P.gefache.map((Q) => { const R = Q.map(f); R.dicke = Q.dicke; return R; }),
      fueller: (P.fueller || []).map((Q) => Q.map(f)),
      oeff: P.oeff.map((o) => Object.assign({}, o, { x: o.a0, y: H - o.h1, w: o.a1 - o.a0, h: o.h1 - o.h0 })),
      naegel: P.naegel.map(f)
    };
  }

  /* =====================================================================
     FENSTER
     x, y, w, h = Öffnung in Flächenkoordinaten. Das Fenster sitzt 5 cm
     hinter der Außenkante, die Scheiben 9 cm, Gardinen 20 cm – durch die
     Parallaxe sieht man aus jedem Winkel die richtige Laibung.
     XANDER: „mit feinen Texturen im Fensterglas"
     Die Fenster sind die „Augen" der Fassade: dunkles Glas, in dem sich
     der Himmel nur zu einem Viertel bis gut einem Drittel spiegelt.
     ===================================================================== */
  function fensterMalen(g, F, B, x, y, w, h, S, fo) {
    const px = F.px;
    const holzC = S.holzC;
    g.save();
    g.beginPath(); g.rect(x, y, w, h); g.clip();
    /* Laibung (die Hölzer ringsum, innen) */
    g.fillStyle = rgb(hell(holzC, -0.2)); g.fillRect(x, y, w, h);
    const pF = parallaxe(F, B, 0.05);
    if (pF[1] < 0) { g.fillStyle = rgb(hell(holzC, 0.06)); g.fillRect(x, y + h + pF[1], w, -pF[1]); }
    if (fo.leer) {
      /* noch kein Fenster eingebaut: Blick in den dunklen Rohbau */
      const pI = parallaxe(F, B, 0.2);
      const gi = g.createLinearGradient(0, y, 0, y + h);
      gi.addColorStop(0, "rgb(20,18,18)"); gi.addColorStop(1, "rgb(46,38,32)");
      g.fillStyle = gi; g.fillRect(x + Math.max(0, pI[0]), y + Math.max(0, pI[1]), w - Math.abs(pI[0]), h - Math.abs(pI[1]));
      g.restore();
      return;
    }
    const fx = x + pF[0], fy = y + pF[1];
    const rb = Math.min(0.06, w * 0.08), kb = 0.065, sb = Math.max(0.022, 0.9 / px);
    const rahmen = hex(S.rahmen || "#ece6da");
    const zeigeDetail = px > 9;
    const nacht = F.nacht, tag = 1 - nacht;
    const gx = fx + rb, gy = fy + rb, gw = w - 2 * rb, gh = h - 2 * rb;
    /* Innenraum: warmes Dunkel – die Fenster sollen sich klar von der
       hellen Wand abheben */
    const innen = g.createLinearGradient(0, gy, 0, gy + gh);
    innen.addColorStop(0, "rgb(28,26,26)"); innen.addColorStop(0.45, "rgb(38,34,32)"); innen.addColorStop(1, "rgb(48,42,38)");
    g.fillStyle = innen; g.fillRect(gx, gy, gw, gh);
    const kaempfer = fo.klein ? null : gy + gh * 0.3;
    if (zeigeDetail && !fo.klein) {
      /* Übergardinen an den Seiten, tiefer im Raum: Stoff mit zwei, drei
         weichen Faltenschatten */
      const pV = parallaxe(F, B, 0.24);
      const vf = hex(fo.vorhang || S.vorhang);
      for (const s of [0, 1]) {
        const vw = gw * 0.19;
        const vx = (s ? gx + gw - vw : gx) + pV[0], vy = gy + pV[1] - 0.05;
        const gv = g.createLinearGradient(vx, 0, vx + vw, 0);
        const f0 = hell(vf, -0.42);
        gv.addColorStop(0, rgb(s ? hell(f0, 0.08) : f0)); gv.addColorStop(0.3, rgb(hell(f0, 0.12))); gv.addColorStop(0.55, rgb(hell(f0, -0.1)));
        gv.addColorStop(0.8, rgb(hell(f0, 0.08))); gv.addColorStop(1, rgb(s ? f0 : hell(f0, 0.08)));
        g.fillStyle = gv;
        g.beginPath();
        if (s) { g.moveTo(vx + vw, vy); g.lineTo(vx, vy); g.quadraticCurveTo(vx + vw * 0.25, vy + gh * 0.6, vx + vw * 0.5, vy + gh + 0.1); g.lineTo(vx + vw, vy + gh + 0.1); }
        else { g.moveTo(vx, vy); g.lineTo(vx + vw, vy); g.quadraticCurveTo(vx + vw * 0.75, vy + gh * 0.6, vx + vw * 0.5, vy + gh + 0.1); g.lineTo(vx, vy + gh + 0.1); }
        g.closePath(); g.fill();
      }
      /* Scheibengardine (nur in etwa 40 % der Fenster): weißer Store auf
         halber Höhe des unteren Flügels, an einer Stange; nah mit
         Spitzenmuster und Bogenkante */
      if (fo.gardine) {
        const pS = parallaxe(F, B, 0.1);
        const sy0 = kaempfer + (gy + gh - kaempfer) * 0.48 + pS[1], sx0 = gx + pS[0], sh = gy + gh + 0.2 - sy0;
        const gs = g.createLinearGradient(sx0, 0, sx0 + gw, 0);
        const nf = Math.max(3, Math.round(gw / 0.07));
        for (let i = 0; i <= nf; i++) gs.addColorStop(i / nf, i % 2 ? "rgba(206,204,198,0.6)" : "rgba(244,242,236,0.62)");
        g.fillStyle = gs; g.fillRect(sx0, sy0, gw, sh);
        if (px > 45) {
          /* Spitze: Rosettenreihen (ein Pfad) und Bogenkante oben */
          g.beginPath();
          for (let yy = sy0 + 0.045, r = 0; yy < gy + gh - 0.015; yy += 0.045, r++) for (let xx = sx0 + (r % 2 ? 0.02 : 0.042); xx < sx0 + gw - 0.01; xx += 0.045) { g.moveTo(xx + 0.009, yy); g.arc(xx, yy, 0.009, 0, Math.PI * 2); }
          g.fillStyle = "rgba(120,116,108,0.28)"; g.fill();
          g.beginPath();
          for (let xx = sx0; xx < sx0 + gw; xx += 0.045) { g.moveTo(xx, sy0 + 0.012); g.arc(xx + 0.0225, sy0 + 0.012, 0.0225, Math.PI, 0, true); }
          g.lineWidth = Math.max(0.003, 0.7 / px); g.strokeStyle = "rgba(250,250,246,0.7)"; g.stroke();
        }
        g.fillStyle = "rgba(120,110,96,0.7)"; g.fillRect(sx0, sy0 - 0.008, gw, Math.max(0.008, 0.8 / px));
      }
    }
    /* Glas: spiegelt Himmel und Boden. Wie stark, hängt vom Blickwinkel
       ab (Fresnel: schräg gesehen spiegelt es mehr), 25–38 % am Tag. Jede
       Scheibe ist mundgeblasenes Zylinderglas: eigene Helligkeit (±6 %),
       eigener, leicht verdrehter Reflexstreifen, feine gebogene Lichtlinien. */
    const fl = F.flaeche, nM = kreuz(fl.u, fl.v);
    const cosT = klemm(dot(B.e, nM), 0, 1);
    const anteil = (0.25 + 0.13 * Math.pow(1 - cosT, 1.5)) * (0.35 + 0.65 * tag);
    const himmel = (F.zeit && F.zeit.himmel) || ["#bcd3ea", "#e9f1f8"];
    const oben = misch([150, 170, 200], misch(hex(himmel[0]), hex(himmel[1]), 0.35), nacht * 0.8);
    const unten = misch(F.jahr === "winter" ? [84, 94, 110] : [70, 80, 95], hex(himmel[0]), nacht * 0.3).map((v) => v * (0.45 + 0.55 * tag));
    const scheiben = [];
    if (!zeigeDetail || px < 30) scheiben.push([gx, gy, gw, gh]);
    else if (fo.klein) scheiben.push([gx, gy, gw / 2, gh], [gx + gw / 2, gy, gw / 2, gh]);
    else {
      const kh = kaempfer - gy, uh = gh - kh;
      scheiben.push([gx, gy, gw / 2, kh], [gx + gw / 2, gy, gw / 2, kh]);
      for (const sx of [0, 1]) for (const sy of [0, 1]) scheiben.push([gx + sx * gw / 2, kaempfer + sy * uh / 2, gw / 2, uh / 2]);
    }
    g.save();
    g.beginPath(); g.rect(gx, gy, gw, gh); g.clip();
    const rr = zufall(((x * 1000) | 0) * 7 + ((y * 100) | 0) + (F.name || "").length);
    const reflex = [], linien = [], kitt = [];
    for (let i = 0; i < scheiben.length; i++) {
      const [sx, sy, sw, sh] = scheiben[i];
      const k = 1 + (rr() - 0.5) * 0.12;
      const sp = g.createLinearGradient(0, sy, 0, sy + sh);
      sp.addColorStop(0, rgb(oben.map((v) => Math.min(255, v * k)), (anteil * 1.1).toFixed(3)));
      sp.addColorStop(0.5, rgb(misch(oben, unten, 0.55).map((v) => v * k), anteil.toFixed(3)));
      sp.addColorStop(1, rgb(unten.map((v) => v * k), (anteil * 0.9).toFixed(3)));
      g.fillStyle = sp; g.fillRect(sx, sy, sw, sh);
      if (!zeigeDetail) continue;
      /* Reflexstreifen, je Scheibe um ±3° verdreht */
      const dw = (rr() - 0.5) * 0.105 * sh, m0 = sx + sw * (0.3 + rr() * 0.25);
      reflex.push([[m0 - sw * 0.18 + dw, sy + sh], [m0 + sw * 0.1 - dw, sy], [m0 + sw * 0.3 - dw, sy], [m0 + sw * 0.03 + dw, sy + sh]]);
      if (px > 60) {
        const nL = 2 + (rr() < 0.5 ? 1 : 0);
        for (let j = 0; j < nL; j++) { const yy = sy + sh * (0.2 + 0.6 * rr()); linien.push([sx, yy, sx + sw * 0.35, yy - 0.02 - rr() * 0.02, sx + sw * 0.65, yy + 0.02 + rr() * 0.02, sx + sw, yy - 0.005]); }
      }
      kitt.push([sx, sy, sw]);
    }
    if (reflex.length) { g.beginPath(); for (const P of reflex) polyPfad(g, P); g.fillStyle = "rgba(255,255,255," + (0.05 + 0.08 * tag).toFixed(3) + ")"; g.fill(); }
    if (linien.length) {
      g.beginPath(); for (const q of linien) { g.moveTo(q[0], q[1]); g.bezierCurveTo(q[2], q[3], q[4], q[5], q[6], q[7]); }
      g.strokeStyle = "rgba(255,255,255," + (0.1 + 0.08 * tag).toFixed(3) + ")"; g.lineWidth = Math.max(0.003, 0.7 / px); g.stroke();
    }
    if (kitt.length && zeigeDetail) { g.beginPath(); const kh = Math.max(0.006, 0.7 / px); for (const [sx, sy, sw] of kitt) g.rect(sx, sy, sw, kh); g.fillStyle = "rgba(20,18,20,0.25)"; g.fill(); }
    g.restore();
    /* Deko dicht hinter dem Glas (Schwibbogen, Stern) */
    if (fo.deko && zeigeDetail) {
      fensterDeko(g, F, B, gx, gy, gw, gh, fo, false);
      g.save(); g.beginPath(); g.rect(gx, gy, gw, gh); g.clip();
      g.fillStyle = "rgba(180,196,220," + (0.08 * tag).toFixed(3) + ")"; g.fillRect(gx, gy, gw, gh);
      g.restore();
    }
    /* Frühling: der linke untere Flügel steht halb offen (nach innen
       gedreht, 35°) – dahinter der Raum, die Gardine weht heraus */
    if (fo.offen && zeigeDetail && !fo.klein) {
      const ky0 = kaempfer, fwl = w / 2, dx = fwl * (1 - Math.cos(35 * RAD)), pT = parallaxe(F, B, fwl * Math.sin(35 * RAD));
      g.fillStyle = "rgb(50,42,36)"; g.fillRect(gx, ky0, gw / 2, gy + gh - ky0);
      const gi = g.createLinearGradient(0, ky0, 0, gy + gh);
      gi.addColorStop(0, "rgba(240,236,226,0.4)"); gi.addColorStop(1, "rgba(240,236,226,0.15)");
      g.fillStyle = gi; g.fillRect(gx + gw * 0.05, ky0, gw * 0.3, gy + gh - ky0);
      const ax = fx, bx = fx + fwl - dx + pT[0], y0 = ky0 - 0.01, y1 = fy + h - rb * 0.5;
      g.fillStyle = "rgba(120,140,166,0.45)";
      g.beginPath(); g.moveTo(ax, y0); g.lineTo(bx, y0 + pT[1]); g.lineTo(bx, y1 + pT[1]); g.lineTo(ax, y1); g.closePath(); g.fill();
      g.strokeStyle = rgb(rahmen); g.lineWidth = Math.max(0.03, 1 / px);
      g.stroke();
      g.beginPath(); g.moveTo(ax, (y0 + y1) / 2); g.lineTo(bx, (y0 + y1) / 2 + pT[1]); g.lineWidth = sb; g.stroke();
    }
    /* Rahmen, Flügel, Kämpfer, Sprossen – je Farbton EIN Pfad */
    const rf = [], rd = [], rh = [];
    const leiste = (x0, y0, x1, y1, bb) => {
      if (Math.abs(x1 - x0) > Math.abs(y1 - y0)) { rf.push([x0, y0 - bb / 2, x1 - x0, bb]); if (zeigeDetail) { rd.push([x0, y0 + bb / 2 - bb * 0.24, x1 - x0, bb * 0.24]); rh.push([x0, y0 - bb / 2, x1 - x0, bb * 0.18]); } }
      else { rf.push([x0 - bb / 2, y0, bb, y1 - y0]); if (zeigeDetail) { rd.push([x0 + bb / 2 - bb * 0.22, y0, bb * 0.22, y1 - y0]); rh.push([x0 - bb / 2, y0, bb * 0.18, y1 - y0]); } }
    };
    leiste(fx, fy + rb / 2, fx + w, fy + rb / 2, rb);
    leiste(fx, fy + h - rb / 2, fx + w, fy + h - rb / 2, rb);
    leiste(fx + rb / 2, fy, fx + rb / 2, fy + h, rb);
    leiste(fx + w - rb / 2, fy, fx + w - rb / 2, fy + h, rb);
    if (!fo.klein) {
      if (kaempfer) leiste(fx, kaempfer - gy + fy + rb, fx + w, kaempfer - gy + fy + rb, kb);
      const ky = kaempfer ? kaempfer - gy + fy + rb : fy;
      leiste(fx + w / 2, fy, fx + w / 2, fy + h, kb * 0.9);
      if (px > 7) leiste(fo.offen ? fx + w / 2 : fx, ky + (fy + h - ky) * 0.5, fx + w, ky + (fy + h - ky) * 0.5, sb);
    } else leiste(fx + w / 2, fy, fx + w / 2, fy + h, sb);
    const fuell = (liste, farbe) => { if (!liste.length) return; g.beginPath(); for (const r of liste) g.rect(r[0], r[1], r[2], r[3]); g.fillStyle = farbe; g.fill(); };
    fuell(rf, rgb(rahmen)); fuell(rd, rgb(hell(rahmen, -0.3))); fuell(rh, rgb(hell(rahmen, 0.35)));
    /* Schatten der Laibung ins Fenster */
    const sv = F.schatten ? F.schatten(0.06) : null;
    if (sv) {
      g.fillStyle = "rgba(20,22,36,0.38)";
      const [dx, dy] = sv;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y); g.lineTo(x + w + dx, y + dy); g.lineTo(x + dx, y + dy); g.closePath();
      if (dx > 0) { g.moveTo(x, y); g.lineTo(x + dx, y + dy); g.lineTo(x + dx, y + h + dy); g.lineTo(x, y + h); g.closePath(); }
      else { g.moveTo(x + w, y); g.lineTo(x + w + dx, y + dy); g.lineTo(x + w + dx, y + h + dy); g.lineTo(x + w, y + h); g.closePath(); }
      g.fill();
    } else {
      g.fillStyle = "rgba(20,22,36,0.2)"; g.fillRect(x, y, w, 0.05);
    }
    g.restore();
    if (fo.offen && px > 9 && !fo.klein) {
      /* Gardine weht aus dem offenen Flügel über die Fensterbank */
      const gx0 = x + 0.08, gy0 = y + h * 0.36, rr2 = zufall(77);
      const gg = g.createLinearGradient(gx0, 0, gx0 + w * 0.45, 0);
      gg.addColorStop(0, "rgba(250,249,244,0.92)"); gg.addColorStop(0.5, "rgba(228,226,218,0.85)"); gg.addColorStop(1, "rgba(250,249,244,0.9)");
      g.fillStyle = gg;
      g.beginPath(); g.moveTo(gx0, gy0);
      g.bezierCurveTo(gx0 + w * 0.3, gy0 + h * 0.15, gx0 + w * 0.15, y + h * 0.8, gx0 + w * 0.42, y + h + 0.16);
      g.bezierCurveTo(gx0 + w * 0.32, y + h + 0.1, gx0 + w * 0.2, y + h + 0.14, gx0 + w * 0.08, y + h + 0.05);
      g.bezierCurveTo(gx0 + 0.02, y + h * 0.8, gx0 + 0.04, y + h * 0.6, gx0, gy0);
      g.closePath(); g.fill();
      g.strokeStyle = "rgba(170,166,154,0.5)"; g.lineWidth = Math.max(0.004, 0.7 / px);
      g.beginPath();
      for (let i = 0; i < 3; i++) { const t = 0.2 + i * 0.25 + rr2() * 0.05; g.moveTo(gx0 + w * 0.05 * t, gy0 + 0.05); g.quadraticCurveTo(gx0 + w * 0.3 * t, y + h * 0.7, gx0 + w * (0.1 + 0.3 * t), y + h + 0.1); }
      g.stroke();
    }
  }
  /* Schwibbogen und Herrnhuter Stern im Fenster (Winter).
     Schwibbogen: erzgebirgischer Lichterbogen als Scherenschnitt aus
     dunklem Holz – Bogen 3,5 cm stark, darunter ausgesägte Häuser, Tannen
     und Figuren, oben sieben cremefarbene Kerzen (1,5 × 5 cm) mit goldenen
     Flammen. Weit weg nur ein dunkles Band mit fünf hellen Punkten. */
  function fensterDeko(g, F, B, gx, gy, gw, gh, fo, leuchtend) {
    const pD = parallaxe(F, B, 0.2), px = F.px;
    if (fo.deko === "schwibbogen" || fo.deko === "beides") {
      const bx = gx + gw * 0.08 + pD[0], by = gy + gh + pD[1] - 0.012, bw = gw * 0.84, bh = Math.min(gh * 0.3, bw * 0.55);
      const holz = leuchtend ? [34, 20, 12] : [62, 42, 28];
      g.save();
      if (px < 60) {
        g.fillStyle = rgb(holz); g.fillRect(bx, by - 0.035, bw, 0.035);
        g.beginPath(); for (let i = 0; i < 5; i++) { const cx = bx + bw * (i + 0.5) / 5; g.moveTo(cx + 0.012, by - 0.05); g.arc(cx, by - 0.05, 0.012, 0, Math.PI * 2); }
        g.fillStyle = leuchtend ? "rgb(255,214,140)" : "rgb(236,226,200)"; g.fill();
        g.restore();
        return;
      }
      const d = 0.035, cy0 = by - 0.03;
      const bogenPfad = (r) => { g.moveTo(bx + r, cy0); g.lineTo(bx + r, cy0 - bh * 0.35); g.quadraticCurveTo(bx + bw / 2, cy0 - bh * 1.35 + r * 2, bx + bw - r, cy0 - bh * 0.35); g.lineTo(bx + bw - r, cy0); };
      /* gefüllter Bogen: Außenkante hin, Innenkante zurück */
      g.beginPath();
      g.moveTo(bx, by); g.lineTo(bx, cy0 - bh * 0.35); g.quadraticCurveTo(bx + bw / 2, cy0 - bh * 1.35, bx + bw, cy0 - bh * 0.35); g.lineTo(bx + bw, by);
      g.lineTo(bx + bw - d, by); g.lineTo(bx + bw - d, cy0 - bh * 0.33); g.quadraticCurveTo(bx + bw / 2, cy0 - bh * 1.35 + d * 2, bx + d, cy0 - bh * 0.33); g.lineTo(bx + d, by); g.closePath();
      /* Sockelbrett */
      g.rect(bx - 0.01, by - 0.03, bw + 0.02, 0.03);
      /* ausgesägte Szene: zwei Häuser mit Satteldach, Tannen, Bergmann */
      const sz = (x0, w0, h0) => { g.moveTo(x0, cy0); g.lineTo(x0, cy0 - h0); g.lineTo(x0 + w0 / 2, cy0 - h0 - w0 * 0.55); g.lineTo(x0 + w0, cy0 - h0); g.lineTo(x0 + w0, cy0); g.closePath(); };
      sz(bx + bw * 0.14, bw * 0.13, bh * 0.2); sz(bx + bw * 0.7, bw * 0.15, bh * 0.25);
      for (const t of [0.34, 0.6]) { const tx = bx + bw * t, th = bh * 0.42; g.moveTo(tx - bw * 0.045, cy0); g.lineTo(tx, cy0 - th); g.lineTo(tx + bw * 0.045, cy0); g.closePath(); }
      const mx = bx + bw * 0.48; g.moveTo(mx - 0.012, cy0); g.lineTo(mx - 0.008, cy0 - bh * 0.22); g.arc(mx, cy0 - bh * 0.27, 0.012, Math.PI * 0.8, Math.PI * 2.2); g.lineTo(mx + 0.012, cy0); g.closePath();
      g.fillStyle = rgb(holz); g.fill();
      /* helle Oberkante des Bogens (Holz, Licht von oben) */
      if (!leuchtend) { g.beginPath(); bogenPfad(0); g.lineWidth = Math.max(0.004, 0.8 / px); g.strokeStyle = "rgba(200,168,120,0.55)"; g.stroke(); }
      /* Kerzen mit Flammen */
      const n = 7;
      g.beginPath();
      const flammen = [];
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n, cx = bx + bw * t;
        const q = (1 - t) * (1 - t) * (cy0 - bh * 0.35) + 2 * (1 - t) * t * (cy0 - bh * 1.35) + t * t * (cy0 - bh * 0.35);
        g.rect(cx - 0.0075, q - 0.05, 0.015, 0.05);
        flammen.push([cx, q - 0.062]);
      }
      g.fillStyle = leuchtend ? "rgb(255,236,200)" : "rgb(238,230,208)"; g.fill();
      g.beginPath(); for (const [cx, cy] of flammen) { g.moveTo(cx, cy - 0.014); g.quadraticCurveTo(cx + 0.008, cy, cx, cy + 0.008); g.quadraticCurveTo(cx - 0.008, cy, cx, cy - 0.014); }
      g.fillStyle = leuchtend ? "rgb(255,210,110)" : "rgb(214,170,70)"; g.fill();
      if (leuchtend) {
        for (const [cx, cy] of flammen) {
          const gg = g.createRadialGradient(cx, cy, 0, cx, cy, 0.07);
          gg.addColorStop(0, "rgba(255,230,160,0.9)"); gg.addColorStop(0.3, "rgba(255,190,90,0.5)"); gg.addColorStop(1, "rgba(255,160,60,0)");
          g.fillStyle = gg; g.fillRect(cx - 0.07, cy - 0.07, 0.14, 0.14);
        }
      }
      g.restore();
    }
    if (fo.deko === "stern" || fo.deko === "beides") {
      const sx = gx + gw * 0.5 + pD[0] * 1.3, sy = gy + gh * (fo.sternGross ? 0.45 : 0.34) + pD[1] * 1.3, r = fo.sternGross ? 0.3 : Math.min(gw, gh) * (fo.deko === "beides" ? 0.22 : 0.3);
      g.save();
      if (px > 20) { g.strokeStyle = "rgba(30,30,30,0.7)"; g.lineWidth = Math.max(0.004, 0.6 / px); g.beginPath(); g.moveTo(sx, gy - 0.02); g.lineTo(sx, sy - r * 0.95); g.stroke(); }
      herrnhuter(g, sx, sy, r, fo.sternFarbe || [206, 34, 44], leuchtend, px);
      g.restore();
    }
  }
  /* Herrnhuter Stern: neun klar geformte Zacken im Kranz, dazwischen
     kürzere, nach hinten weisende, vorn eine auf den Betrachter
     gerichtete Zacke. Jede Zacke hat eine helle und eine dunkle Fläche
     (Licht von links oben bzw. von innen), feine Kanten, oben die
     Aufhängung mit Öse. Nachts leuchtet das Papier von innen. */
  function herrnhuter(g, sx, sy, r, farbe, leuchtend, px) {
    const glut = (k) => misch(farbe, [255, 226, 170], k);
    const zacke = (a, len, br, hellK, fuss) => {
      const tx = sx + Math.cos(a) * len, ty = sy + Math.sin(a) * len;
      const rr = r * (fuss || 0.3);
      const ax = sx + Math.cos(a - br) * rr, ay = sy + Math.sin(a - br) * rr, cx = sx + Math.cos(a + br) * rr, cy = sy + Math.sin(a + br) * rr;
      const licht = 0.5 + 0.5 * Math.cos(a + 2.3);
      const f1 = leuchtend ? glut(0.55 + 0.25 * licht) : hell(farbe, 0.08 + 0.22 * licht * hellK);
      const f2 = leuchtend ? glut(0.25 + 0.15 * licht) : hell(farbe, -0.32 + 0.12 * licht);
      g.fillStyle = rgb(f1); g.beginPath(); g.moveTo(sx, sy); g.lineTo(ax, ay); g.lineTo(tx, ty); g.closePath(); g.fill();
      g.fillStyle = rgb(f2); g.beginPath(); g.moveTo(sx, sy); g.lineTo(cx, cy); g.lineTo(tx, ty); g.closePath(); g.fill();
      if (px > 40) { g.strokeStyle = leuchtend ? "rgba(120,40,20,0.5)" : "rgba(40,10,10,0.45)"; g.lineWidth = Math.max(0.003, 0.6 / px); g.beginPath(); g.moveTo(ax, ay); g.lineTo(tx, ty); g.lineTo(cx, cy); g.moveTo(sx, sy); g.lineTo(tx, ty); g.stroke(); }
    };
    /* hintere, kürzere Zacken zuerst */
    for (let i = 0; i < 9; i++) zacke((i + 0.5) / 9 * Math.PI * 2 - Math.PI / 2, r * 0.62, 0.3, 0.8, 0.32);
    for (let i = 0; i < 9; i++) zacke(i / 9 * Math.PI * 2 - Math.PI / 2, r, 0.21, 1, 0.3);
    /* vordere Zacke: kurzes Viereck mit Lichtseite */
    const q = r * 0.3;
    g.fillStyle = rgb(leuchtend ? glut(0.8) : hell(farbe, 0.22)); g.beginPath(); g.moveTo(sx, sy - q); g.lineTo(sx + q * 0.9, sy); g.lineTo(sx, sy); g.lineTo(sx - q * 0.9, sy); g.closePath(); g.fill();
    g.fillStyle = rgb(leuchtend ? glut(0.4) : hell(farbe, -0.22)); g.beginPath(); g.moveTo(sx, sy + q); g.lineTo(sx + q * 0.9, sy); g.lineTo(sx - q * 0.9, sy); g.closePath(); g.fill();
    /* Öse */
    g.fillStyle = leuchtend ? "rgb(90,70,50)" : "rgb(70,60,50)"; g.fillRect(sx - r * 0.05, sy - r * 1.04, r * 0.1, r * 0.1);
  }
  /* Leuchtendes Fenster (nach dem Licht gemalt): gleichmäßig warmes
     Innenlicht mit einem weichen Lampenfleck; die Übergardinen stehen als
     zwei, drei weiche, dunklere Falten am Rand. gibt die Leuchtkraft
     zurück (für einen gemeinsamen Lichtschein je Wand). */
  function fensterLicht(g, F, B, x, y, w, h, S, fo) {
    const an = fo.leer ? 0 : fo.an;
    if (!an || F.nacht <= 0) return 0;
    const a = F.nacht * an;
    const pF = parallaxe(F, B, 0.05);
    const fx = x + pF[0], fy = y + pF[1];
    const rb = Math.min(0.06, w * 0.08);
    const gx = fx + rb, gy = fy + rb, gw = w - 2 * rb, gh = h - 2 * rb;
    g.save();
    g.beginPath(); g.rect(x, y, w, h); g.clip();
    const warm = fo.farbe || [255, 190, 110];
    g.fillStyle = "rgba(" + warm.map((v) => v * 0.86 | 0).join(",") + "," + (0.9 * a).toFixed(3) + ")"; g.fillRect(gx, gy, gw, gh);
    /* Lampe: weicher, heller Fleck (Decken- oder Tischlampe) */
    const lx = gx + gw * (fo.lampeX == null ? 0.5 : fo.lampeX), ly = gy + gh * 0.62;
    const gr = g.createRadialGradient(lx, ly, 0, lx, ly, Math.max(gw, gh) * 0.75);
    gr.addColorStop(0, "rgba(255,238,196," + (0.85 * a).toFixed(3) + ")"); gr.addColorStop(0.5, "rgba(255,214,150," + (0.35 * a).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,200,130,0)");
    g.fillStyle = gr; g.fillRect(gx, gy, gw, gh);
    if (!fo.klein) {
      /* Scheibengardine (wo sie hängt) leuchtet durch */
      const pS = parallaxe(F, B, 0.1);
      if (fo.gardine) { g.fillStyle = "rgba(255,240,210," + (0.28 * a).toFixed(3) + ")"; g.fillRect(gx + pS[0], gy + gh * 0.64 + pS[1], gw, gh * 0.4); }
      /* Vorhänge: weiche Faltenschatten am Rand */
      const pV = parallaxe(F, B, 0.24);
      for (const s of [0, 1]) {
        const x0 = s ? gx + gw * 0.8 + pV[0] : gx + pV[0], vw = gw * 0.2;
        const gv = g.createLinearGradient(x0, 0, x0 + vw, 0);
        const d = "rgba(110,48,24,", st = s ? [0.15, 0.45, 0.2, 0.55] : [0.55, 0.2, 0.45, 0.15];
        gv.addColorStop(0, d + (st[0] * a).toFixed(3) + ")"); gv.addColorStop(0.35, d + (st[1] * a).toFixed(3) + ")"); gv.addColorStop(0.65, d + (st[2] * a).toFixed(3) + ")"); gv.addColorStop(1, d + (st[3] * a).toFixed(3) + ")");
        g.fillStyle = gv; g.fillRect(x0, gy, vw, gh);
      }
    }
    if (fo.deko) fensterDeko(g, F, B, gx, gy, gw, gh, fo, true);
    /* Rahmen dunkel vor dem Licht */
    g.fillStyle = "rgba(50,36,28," + (0.92 * a).toFixed(3) + ")";
    const kb = 0.065, sb = 0.024;
    g.beginPath();
    g.rect(fx, fy, w, rb); g.rect(fx, fy + h - rb, w, rb); g.rect(fx, fy, rb, h); g.rect(fx + w - rb, fy, rb, h);
    if (!fo.klein) {
      const ky = gy + gh * 0.3;
      g.rect(fx, ky - kb / 2, w, kb);
      g.rect(fx + w / 2 - kb * 0.45, fy, kb * 0.9, h);
      g.rect(fx, ky + (fy + h - ky) * 0.5 - sb / 2, w, sb);
    } else g.rect(fx + w / 2 - sb / 2, fy, sb, h);
    g.fill();
    g.restore();
    return an * (fo.sternGross ? 2.2 : 1);
  }

  /* ---------------- Fensterläden (Füllungsläden) ----------------
     Offen an die Wand geklappt, 3 cm dick (Parallaxe). Zwei Füllungen mit
     Fase (Lichtkante oben links, Schattenkante unten rechts), schwarze
     Langbänder mit gerundetem Ende und Kloben, an den Kanten abgeriebene
     Farbe, offen ein 2–3 cm Schlagschatten auf der Wand. */
  function ladenMalen(g, F, B, x, y, w, h, farbe, zu, saat) {
    const f = hex(farbe), px = F.px;
    const lw = w / 2 + 0.01;
    const sv = F.schatten ? F.schatten(0.035) : null;
    const pK = parallaxe(F, B, -0.03);
    const teile = zu ? [[x, 0], [x + w / 2, 1]] : [[x - lw - 0.015, 0], [x + w + 0.015, 1]];
    const ww = zu ? w / 2 : lw;
    if (sv && !zu) { g.beginPath(); for (const [lx] of teile) g.rect(lx + sv[0], y + sv[1], ww, h); g.fillStyle = "rgba(24,24,34,0.32)"; g.fill(); }
    /* Kante (Dicke) als Parallelogramm, dann das Blatt */
    g.beginPath();
    for (const [lx] of teile) g.rect(lx + Math.min(0, pK[0]), y + Math.min(0, pK[1]), ww + Math.abs(pK[0]), h + Math.abs(pK[1]));
    g.fillStyle = rgb(hell(f, -0.38)); g.fill();
    const dunkel = [], hellF = [], mitte = [], baender = [], kloben = [], abrieb = [];
    for (const [lx, seite] of teile) {
      const ox = lx + pK[0], oy = y + pK[1];
      const gr = g.createLinearGradient(ox, oy, ox + ww, oy + h);
      gr.addColorStop(0, rgb(hell(f, 0.07))); gr.addColorStop(1, rgb(hell(f, -0.08)));
      g.fillStyle = gr; g.fillRect(ox, oy, ww, h);
      if (px > 10) {
        const r = Math.min(0.07, ww * 0.16), k = Math.min(0.022, r * 0.4);
        for (const [fy0, fh] of [[oy + h * 0.07, h * 0.4], [oy + h * 0.53, h * 0.4]]) {
          const x0 = ox + r, x1 = ox + ww - r, y0 = fy0, y1 = fy0 + fh;
          /* Fase: oben und links hell, unten und rechts dunkel */
          hellF.push([[x0, y0], [x1, y0], [x1 - k, y0 + k], [x0 + k, y0 + k]], [[x0, y0], [x0 + k, y0 + k], [x0 + k, y1 - k], [x0, y1]]);
          dunkel.push([[x1, y0], [x1, y1], [x1 - k, y1 - k], [x1 - k, y0 + k]], [[x0, y1], [x0 + k, y1 - k], [x1 - k, y1 - k], [x1, y1]]);
          mitte.push([x0 + k, y0 + k, x1 - x0 - 2 * k, y1 - y0 - 2 * k]);
        }
        /* Langbänder: vom Scharnier aus, gerundetes Ende */
        const scharnierLinks = zu ? seite === 0 : seite === 1;
        const bl = ww * 0.72, bx = scharnierLinks ? ox : ox + ww - bl;
        for (const yy of [oy + h * 0.14, oy + h * 0.84]) {
          baender.push([bx, yy - 0.011, bl, 0.022, scharnierLinks]);
          kloben.push([scharnierLinks ? ox - 0.012 : ox + ww + 0.012, yy]);
        }
        if (px > 25) {
          const rr = zufall((saat | 0) + seite * 17);
          for (let i = 0; i < 5; i++) { const yy = oy + rr() * h, l = 0.05 + rr() * 0.2; abrieb.push([[ox + (i % 2 ? ww - 0.006 : 0.006), yy], [ox + (i % 2 ? ww - 0.006 : 0.006), Math.min(oy + h, yy + l)]]); }
          abrieb.push([[ox + rr() * ww * 0.5, oy + h - 0.006], [ox + ww * (0.5 + rr() * 0.5), oy + h - 0.006]]);
        }
      }
    }
    const fuellP = (liste, farbe) => { if (!liste.length) return; g.beginPath(); for (const P of liste) polyPfad(g, P); g.fillStyle = farbe; g.fill(); };
    fuellP(hellF, rgb(hell(f, 0.16))); fuellP(dunkel, rgb(hell(f, -0.28)));
    if (mitte.length) { g.beginPath(); for (const r of mitte) g.rect(r[0], r[1], r[2], r[3]); g.fillStyle = rgb(hell(f, 0.02)); g.fill(); }
    if (abrieb.length) { g.beginPath(); linienPfad(g, abrieb, false); g.lineWidth = 0.012; g.strokeStyle = "rgba(190,160,120,0.35)"; g.stroke(); }
    if (baender.length) {
      g.beginPath();
      for (const [bx, by, bl, bh, links] of baender) {
        if (links) { g.moveTo(bx, by); g.lineTo(bx + bl - bh, by); g.arc(bx + bl - bh, by + bh / 2, bh * 0.9, -Math.PI / 2, Math.PI / 2); g.lineTo(bx, by + bh); g.closePath(); }
        else { g.moveTo(bx + bl, by); g.lineTo(bx + bh, by); g.arc(bx + bh, by + bh / 2, bh * 0.9, -Math.PI / 2, Math.PI / 2, true); g.lineTo(bx + bl, by + bh); g.closePath(); }
      }
      for (const [kx, ky] of kloben) { g.moveTo(kx + 0.014, ky); g.arc(kx, ky, 0.014, 0, Math.PI * 2); }
      g.fillStyle = "rgb(30,28,27)"; g.fill();
      if (px > 30) { g.beginPath(); for (const [bx, by, bl] of baender) g.rect(bx, by, bl * 0.9, 0.005); g.fillStyle = "rgba(255,255,255,0.18)"; g.fill(); }
    }
    g.beginPath(); for (const [lx] of teile) g.rect(lx + pK[0], y + pK[1], ww, h);
    g.strokeStyle = rgb(hell(f, -0.5), 0.6); g.lineWidth = Math.max(0.006, 0.8 / px); g.stroke();
    if (px > 12) for (const [lx, seite] of teile) rausch(g, lx + pK[0], y + pK[1], ww, h, 0.7, 0.16, 55 + seite, 3);
  }
  /* =====================================================================
     WAND-MALER: Putz, Gefache, Hölzer, Öffnungen, Zubehör
     XANDER: „Alles mit Struktur, so der Mörtel und … Beton, alles mal
     schön die Häuserwände."
     ===================================================================== */
  /* Reihenfolge der Hölzer (gemalt in Schichten, jede Schicht gebündelt):
     Streben und Bögen zuerst – ihre über das Feld hinaus verlängerten
     Enden verschwinden unter Riegeln, Ständern, Schwelle und Rähm. Würden
     die Streben zuletzt gemalt, stäken ihre Enden sichtbar durch die
     Riegel, und ihre Kantenlinien liefen quer über das Nachbarholz. */
  function holzReihenfolge(m) { return m.art === "strebe" || m.art === "bogen" || m.k ? 0 : m.art === "riegel" ? 1 : m.art === "staender" ? 2 : 3; }
  /* Hölzer in Malschichten teilen (je Schicht gebündelte Einzelheiten) */
  function holzSchichten(formen, toene, saat) {
    return [0, 1, 2, 3].map((k) => {
      const idx = []; formen.forEach((f, i) => { if (holzReihenfolge(f.m) === k) idx.push(i); });
      const fs = idx.map((i) => formen[i]);
      return { formen: fs, toene: idx.map((i) => toene[i]), D: holzDetails(fs, saat + k * 101) };
    }).filter((x) => x.formen.length);
  }
  /* Modellnormale in den Kameraraum drehen (für das Licht gemalter Vorsprünge) */
  function drehN(B, n) { return B && B.e ? [n[0] * B.c - n[1] * B.s, n[0] * B.s + n[1] * B.c, n[2]] : n; }
  /* Lichtverhältnis einer anderen Richtung zur Fläche: gemalte Vorsprünge
     (Fensterbank oben, Seiten) bekommen ihr eigenes Licht, obwohl der Kern
     über die ganze Wand das Wandlicht legt */
  function lichtVerh(F, B, nModell) {
    const a = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr), b = ST.lichtFaktor(drehN(B, nModell), F.zeit, 0, F.jahr);
    return [0, 1, 2].map((i) => b[i] / Math.max(0.05, a[i]));
  }
  const malF = (c, k) => [Math.min(255, c[0] * k[0]), Math.min(255, c[1] * k[1]), Math.min(255, c[2] * k[2])];

  function wandMaler(W, PF, S, B, extra) {
    const saat = S.saat + W.saatZ;
    /* Ein altes Haus hat sich gesetzt: Ständer stehen bis ±0,4° schief,
       das Rähm hängt 1–2 cm durch, die Schwelle ist in der Mitte etwas
       eingedrückt. Die Ecken bleiben lotrecht (sonst klafft die Kante). */
    const rngV = zufall(saat * 5 + 1);
    const glieder = PF.glieder.slice().sort((a, b) => holzReihenfolge(a) - holzReihenfolge(b)).map((m) => {
      if (m.k) return m;
      const waag = Math.abs(m.p1[1] - m.p0[1]) < 0.05;
      if (m.art === "staender" && !m.ecke) {
        const L = Math.abs(m.p1[1] - m.p0[1]), d = (rngV() - 0.5) * 2 * 0.007 * L;
        return Object.assign({}, m, { p1: [m.p1[0] + d, m.p1[1]] });
      }
      if (m.art === "raehm" && waag && m.p1[0] - m.p0[0] > 3) return Object.assign({}, m, { durchhang: 0.012 + rngV() * 0.008, kante: "unten" });
      if (m.art === "schwelle" && waag && m.p1[0] - m.p0[0] > 3) return Object.assign({}, m, { durchhang: 0.008 + rngV() * 0.006, kante: "oben" });
      return m;
    });
    const rngF = zufall(saat * 23 + 9);
    const formen = glieder.map((m) => holzForm(m, rngF));
    /* jedes Holz ein eigener Stamm: ±6 % Helligkeit, ±4 % Sättigung */
    const rngT = zufall(saat * 29 + 11);
    const toene = formen.map((f) => holzTon(S.holzC, rngT, f.m));
    const schichten = holzSchichten(formen, toene, saat);
    const ecken = formen.filter((f) => f.m.art === "staender" && f.m.ecke);
    /* Gefache: jedes wurde einzeln verputzt → vier Tongruppen (±3 %) */
    const gruppen = [[], [], [], []];
    PF.gefache.forEach((Q, i) => gruppen[Math.floor(ST.hash2(i, saat, 3) * 4) & 3].push(Q));
    /* 1–2 Ausbesserungen je Wand: ein Stück neuer Putz, 3–5 % anderer Ton */
    const flicken = [];
    {
      const rr = zufall(saat * 41 + 3);
      const gross = PF.gefache.filter((Q) => Math.abs(vFlaeche(Q)) > 0.35);
      const n = gross.length ? 1 + (rr() < 0.5 ? 1 : 0) : 0;
      for (let k = 0; k < n; k++) {
        const Q = gross[Math.floor(rr() * gross.length)], bx = vBox(Q);
        const cx = bx[0] + (bx[2] - bx[0]) * (0.3 + rr() * 0.4), cy = bx[1] + (bx[3] - bx[1]) * (0.35 + rr() * 0.4);
        const rx = (bx[2] - bx[0]) * (0.28 + rr() * 0.22), ry = (bx[3] - bx[1]) * (0.22 + rr() * 0.2);
        const pts = []; for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, r = 0.72 + rr() * 0.4; pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); }
        flicken.push({ Q: Q, pts: pts, ton: (rr() < 0.5 ? -1 : 1) * (0.03 + rr() * 0.02) });
      }
    }
    /* Haarrisse im Putz: aus den Gefach-Ecken, leicht verzweigt */
    const putzRisse = [];
    {
      const rr = zufall(saat * 43 + 1);
      for (const Q of PF.gefache) {
        if (rr() > 0.5) continue;
        const i = Math.floor(rr() * Q.length), a = Q[i], m = vMitte(Q);
        let x = a[0] + (m[0] - a[0]) * 0.07, y = a[1] + (m[1] - a[1]) * 0.07, ang = Math.atan2(m[1] - a[1], m[0] - a[0]) + (rr() - 0.5) * 0.9;
        const len = 0.1 + rr() * 0.26, pts = [[x, y]];
        for (let s = 0; s < 4; s++) { ang += (rr() - 0.5) * 0.7; x += Math.cos(ang) * len / 4; y += Math.sin(ang) * len / 4; pts.push([x, y]); }
        putzRisse.push(pts);
      }
    }
    /* Kellenstriche: flache Bögen über die ganze Wand (unter den Hölzern) */
    const kellen = [[], []];
    {
      const rr = zufall(saat * 47 + 5), n = Math.round(PF.L * PF.H * 1.3);
      for (let i = 0; i < n; i++) {
        const x = rr() * PF.L, y = rr() * PF.H, l = 0.22 + rr() * 0.45, a = (rr() - 0.5) * 0.6, bu = (rr() - 0.5) * 0.1;
        kellen[i % 2].push([[x, y], [x + Math.cos(a) * l * 0.5, y + Math.sin(a) * l * 0.5 + bu], [x + Math.cos(a) * l, y + Math.sin(a) * l]]);
      }
    }
    /* Schmutzfahnen: unter jedem Riegel läuft Regenwasser ab (0,3–0,5 m) */
    const fahnen = [];
    {
      const rr = zufall(saat * 13 + 7);
      for (const m of PF.glieder) {
        if (m.art !== "riegel" || m.k || Math.abs(m.p1[1] - m.p0[1]) > 0.05) continue;
        const unterFenster = PF.oeff.some((o) => o.art === "fenster" && Math.abs(o.y + o.h + m.b / 2 - m.p0[1]) < 0.05);
        fahnen.push({ x0: Math.min(m.p0[0], m.p1[0]) + 0.1, x1: Math.max(m.p0[0], m.p1[0]) - 0.1, y: m.p0[1] + m.b / 2, len: 0.3 + rr() * 0.25, a: (0.15 + rr() * 0.05) * (unterFenster ? 1.25 : 1), s: rr() * 50 });
      }
    }
    const begleit = S.begleit && !S.lehm && S.begleitAn;
    const nord = W.N && W.N[1] < -0.5;
    return function (g, F) {
      const px = F.px, L = PF.L, H = PF.H, pc = S.putzC;
      /* 1. Putz, Gefache mit eigenem Ton, Ausbesserungen */
      putzBasis(g, L, H, pc);
      if (px > 4) {
        const dt = [-0.035, -0.012, 0.012, 0.03];
        gruppen.forEach((grp, k) => { if (!grp.length) return; g.beginPath(); for (const Q of grp) polyPfad(g, Q); g.fillStyle = rgb(hell(pc, dt[k])); g.fill(); });
        if (px > 10 && !S.lehm) for (const fl of flicken) {
          g.save(); g.beginPath(); polyPfad(g, fl.Q); g.clip();
          g.beginPath(); glattPfad(g, fl.pts); g.fillStyle = rgb(hell(pc, fl.ton)); g.fill();
          if (px > 30) { g.lineWidth = Math.max(0.006, 0.8 / px); g.strokeStyle = "rgba(255,255,250,0.2)"; g.stroke(); }
          g.restore();
        }
      }
      putzStruktur(g, F, L, H, saat);
      if (px > 38 && !S.lehm) {
        g.lineCap = "round"; g.lineWidth = 0.035;
        g.beginPath(); linienPfad(g, kellen[0], true); g.strokeStyle = "rgba(255,255,252,0.1)"; g.stroke();
        g.beginPath(); linienPfad(g, kellen[1], true); g.strokeStyle = "rgba(112,96,72,0.09)"; g.stroke();
      }
      /* Spritzwasser und (Nordseite) grünlicher Anflug über dem Sockel */
      if (W.unten || nord) {
        const hh = nord ? 1.3 : 0.7, gr = g.createLinearGradient(0, H, 0, H - hh);
        gr.addColorStop(0, nord ? "rgba(84,104,58,0.3)" : "rgba(96,98,70,0.22)"); gr.addColorStop(1, "rgba(96,98,70,0)");
        g.fillStyle = gr; g.fillRect(-0.05, H - hh, L + 0.1, hh + 0.05);
      }
      /* Schmutzfahnen unter den Riegeln */
      if (px > 8 && !S.lehm) {
        for (const f of fahnen) {
          const gr = g.createLinearGradient(0, f.y, 0, f.y + f.len);
          gr.addColorStop(0, "rgba(92,80,60," + f.a.toFixed(3) + ")"); gr.addColorStop(0.35, "rgba(92,80,60," + (f.a * 0.5).toFixed(3) + ")"); gr.addColorStop(1, "rgba(92,80,60,0)");
          g.fillStyle = gr;
          g.beginPath(); g.moveTo(f.x0, f.y);
          for (let x = f.x0; x <= f.x1 + 0.001; x += 0.07) g.lineTo(x, f.y + f.len * (0.45 + 0.55 * Math.abs(Math.sin(x * 9.1 + f.s) * Math.sin(x * 3.3 + f.s * 2))));
          g.lineTo(f.x1, f.y); g.closePath(); g.fill();
        }
      }
      /* 2. Wölbung der Gefache: der Putz ist zum Holz hin leicht
         eingezogen → weiche, 8–12 cm breite Randverschattung. Ein Pfad
         aus allen Holzumrissen, in drei Breiten gestrichen – die Hölzer
         decken danach die innere Hälfte zu. */
      g.lineJoin = "miter"; g.miterLimit = 2;
      g.beginPath(); for (const f of formen) formPfad(g, f);
      if (px > 6) {
        g.strokeStyle = S.lehm ? "rgba(60,44,28,0.07)" : "rgba(104,90,72," + (px > 20 ? 0.055 : 0.075) + ")";
        for (const lw of px > 20 ? [0.24, 0.16, 0.09] : [0.2, 0.1]) { g.lineWidth = lw; g.stroke(); }
      }
      /* 3. Begleitstrich direkt am Holz (2 cm), nur bei etwa jedem zweiten
         Haus – mit weichem, wie von Hand gezogenem Rand */
      if (begleit && px > 10) {
        g.lineJoin = "round";
        g.lineWidth = 0.056; g.strokeStyle = S.begleit.replace(/[\d.]+\)$/, "0.16)"); g.stroke();
        g.lineWidth = 0.042; g.strokeStyle = S.begleit; g.stroke();
      }
      /* 4. Haarrisse */
      if (px > 30 && !S.lehm && putzRisse.length) {
        g.lineCap = "round"; g.lineJoin = "round"; g.lineWidth = Math.max(0.003, 0.75 / px);
        g.beginPath(); linienPfad(g, putzRisse, true); g.strokeStyle = "rgba(78,66,52,0.42)"; g.stroke();
      }
      /* 5. Schlagschatten der Hölzer (stehen 1–2 cm vor dem Putz) */
      const sv = F.schatten ? F.schatten(0.02) : null;
      if (sv && px > 5) { g.beginPath(); for (const f of formen) formPfad(g, f, sv[0], sv[1]); g.fillStyle = "rgba(34,26,20,0.36)"; g.fill(); }
      /* 6. zu schmale Reste zwischen Hölzern: Holz */
      if (PF.fueller && PF.fueller.length) { g.beginPath(); for (const Q of PF.fueller) polyPfad(g, Q); g.fillStyle = rgb(hell(S.holzC, -0.12)); g.fill(); }
      /* 7. Hölzer, Schicht für Schicht */
      for (const sch of schichten) hoelzerMalen(g, F, sch.formen, sch.D, sch.toene);
      holzAbrieb(g, F, formen, saat);
      if (W.schnitz && px > 22) for (const f of ecken) eckSchnitz(g, F, f, toene[formen.indexOf(f)]);
      /* Holznägel */
      if (px > 24 && PF.naegel.length) {
        g.beginPath(); for (const [a, h] of PF.naegel) { g.moveTo(a + 0.017, h); g.arc(a, h, 0.017, 0, Math.PI * 2); }
        g.fillStyle = rgb(hell(S.holzC, 0.16)); g.fill();
        g.beginPath(); for (const [a, h] of PF.naegel) { g.moveTo(a + 0.013, h + 0.004); g.arc(a + 0.004, h + 0.004, 0.009, 0, Math.PI * 2); }
        g.fillStyle = rgb(hell(S.holzC, -0.45), 0.6); g.fill();
      }
      /* Inschrift auf der Schwelle */
      if (W.inschrift && px > 40) inschrift(g, F, W.inschrift, L, H, S);
      /* 8. Öffnungen, Läden, Fensterbänke */
      for (const o of PF.oeff) {
        if (o.art !== "fenster") continue;
        const fo = Object.assign({ klein: o.klein }, W.fenster ? W.fenster(o) : {});
        fensterMalen(g, F, B, o.x, o.y, o.w, o.h, S, fo);
        if (fo.laeden) ladenMalen(g, F, B, o.x, o.y, o.w, o.h, S.laden, fo.zu, saat + o.x * 10);
        if (!fo.leer && fo.bank !== false) bankMalen(g, F, B, o.x, o.y + o.h, o.w, W.stock !== "eg", S, F.jahr === "winter" && W.winterDach !== false, saat + o.x * 7);
      }
      /* 9. Zubehör (Tür, Schilder, Rose …) */
      if (extra) extra(g, F);
      /* 10. Schlagschatten von Auskragung bzw. Dachüberstand */
      if (W.ueber) ueberstandSchatten(g, F, W.ueber, L, H);
      /* 11. Verwitterung über alles */
      if (px > 6) rausch(g, 0, 0, L, H, 5.5, 0.08, saat + 99, 3);
      if (px > 20) rausch(g, 0, 0, L, H, 0.9, 0.07, saat + 57, 3);
    };
  }
  /* Jedes Holz ein eigener Stamm: ±6 % Helligkeit, ±4 % Sättigung */
  function holzTon(c, rng, m) {
    const k = 1 + (rng() - 0.5) * 0.12, sat = 1 + (rng() - 0.5) * 0.08;
    const l = (c[0] + c[1] + c[2]) / 3;
    let t = [(l + (c[0] - l) * sat) * k, (l + (c[1] - l) * sat) * k, (l + (c[2] - l) * sat) * k];
    if (m.art === "schwelle") t = hell(t, -0.08);
    return t;
  }
  /* Geschnitzter Eckständer: Taustab (gedrehte Kordel) – Wülste unter 45°
     mit 7 cm Steigung, jeder mit Licht oben links und Schattenkerbe; oben
     und unten ein Wulstring als Kapitell und Basis */
  function eckSchnitz(g, F, f, c) {
    const m = f.m, x = (m.p0[0] + m.p1[0]) / 2, y0 = Math.min(m.p0[1], m.p1[1]), y1 = Math.max(m.p0[1], m.p1[1]);
    const a = y0 + (y1 - y0) * 0.2, e = y0 + (y1 - y0) * 0.8, bw = m.b * 0.7, per = 0.07;
    g.save();
    g.beginPath(); g.rect(x - bw / 2, a, bw, e - a); g.clip();
    g.fillStyle = rgb(hell(c, -0.2)); g.fillRect(x - bw / 2, a, bw, e - a);
    g.beginPath();
    for (let yy = a - bw; yy < e + bw; yy += per) { g.moveTo(x - bw / 2, yy); g.lineTo(x + bw / 2, yy - bw); g.lineTo(x + bw / 2, yy - bw + per * 0.55); g.lineTo(x - bw / 2, yy + per * 0.55); g.closePath(); }
    g.fillStyle = rgb(hell(c, 0.1)); g.fill();
    g.beginPath();
    for (let yy = a - bw; yy < e + bw; yy += per) { g.moveTo(x - bw / 2, yy + per * 0.55); g.lineTo(x + bw / 2, yy - bw + per * 0.55); }
    g.lineWidth = Math.max(0.006, 0.9 / F.px); g.strokeStyle = rgb(hell(c, -0.5), 0.75); g.stroke();
    /* Rundung quer: links hell, rechts im Schatten */
    const gr = g.createLinearGradient(x - bw / 2, 0, x + bw / 2, 0);
    gr.addColorStop(0, "rgba(255,240,220,0.14)"); gr.addColorStop(0.35, "rgba(255,240,220,0)"); gr.addColorStop(0.7, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,0.3)");
    g.fillStyle = gr; g.fillRect(x - bw / 2, a, bw, e - a);
    g.restore();
    g.beginPath();
    for (const yy of [a, e]) { g.rect(x - m.b / 2 + 0.008, yy - 0.024, m.b - 0.016, 0.028); }
    g.fillStyle = rgb(hell(c, 0.08)); g.fill();
    g.beginPath(); for (const yy of [a, e]) g.rect(x - m.b / 2 + 0.008, yy + 0.004, m.b - 0.016, 0.012);
    g.fillStyle = rgb(hell(c, -0.35)); g.fill();
  }
  /* Schlagschatten von Stockwerksauskragung bzw. Dachüberstand auf der
     Wand (nur bei Sonne). U = { d: Tiefe der Vorderkante, hoch: wie weit
     die Kante über der Wandoberkante liegt, koepfe: [a] (4 cm tiefer),
     knaggen: [{a, tief, hoch}], giebel: {w2, st} }. Der Rand wird in drei
     Stufen weich (Halbschatten 5 cm). */
  function ueberstandSchatten(g, F, U, L, H) {
    if (!F.schatten || F.px < 5) return;
    const k = F.schatten(1);
    if (!k) return;
    /* so dunkel, wie die Sonne auf der Wand stark ist: im Schatten bleibt
       nur das Himmelslicht (≈ 30–40 % weniger) */
    const a0 = klemm(F.licht * 1.6, 0, 1) * 0.42;
    if (a0 < 0.03) return;
    const lagen = F.px > 25 ? [0, 0.025, 0.05] : [0.02];
    const sp = (d) => [k[0] * d, k[1] * d];
    for (const e of lagen) {
      g.beginPath();
      if (U.giebel) {
        const w2 = U.giebel.w2, st = U.giebel.st, d = U.d - e, s = sp(d);
        const lin = [[-0.8, (w2 + 0.8) * st], [w2, 0], [2 * w2 + 0.8, (w2 + 0.8) * st]];
        g.moveTo(lin[0][0], lin[0][1] - 0.02); g.lineTo(lin[1][0], lin[1][1] - 0.02); g.lineTo(lin[2][0], lin[2][1] - 0.02);
        for (let i = 2; i >= 0; i--) g.lineTo(lin[i][0] + s[0], lin[i][1] + s[1] + U.unter);
        g.closePath();
      } else {
        const d = U.d - e, s = sp(d), dy = s[1] - U.hoch;
        if (dy > 0.004) { g.moveTo(-1, -0.1); g.lineTo(L + 1, -0.1); g.lineTo(L + 1 + s[0], dy); g.lineTo(-1 + s[0], dy); g.closePath(); }
        if (U.koepfe && dy > -0.02) {
          const s4 = sp(U.kopfD - e), dy4 = s4[1] - U.hoch;
          for (const a of U.koepfe) { g.moveTo(a - 0.1 + s[0], Math.max(-0.05, dy - 0.01)); g.lineTo(a - 0.1 + s4[0], dy4); g.lineTo(a + 0.1 + s4[0], dy4); g.lineTo(a + 0.1 + s[0], Math.max(-0.05, dy - 0.01)); g.closePath(); }
        }
        for (const q of U.knaggen || []) {
          /* Knagge: Profil (Tiefe, Höhe) → Schatten auf der Wand */
          const n = 6, tief = q.tief - e, hoch = q.hoch;
          for (const off of [-0.06, 0.06]) {
            const ax = q.a + off, P = (dd, hh) => [ax + k[0] * dd, hh + k[1] * dd];
            const pts = [P(0, 0), P(tief, 0), P(tief, 0.04)];
            for (let i = n; i >= 0; i--) { const t = i / n * Math.PI / 2; pts.push(P(tief - (tief - 0.05) * Math.cos(t), hoch - (hoch - 0.04) * Math.sin(t))); }
            pts.push(P(0, hoch));
            polyPfad(g, pts);
          }
        }
      }
      g.fillStyle = "rgba(34,40,70," + (a0 / lagen.length).toFixed(3) + ")"; g.fill();
    }
  }
  /* Fensterbank als gemalter Vorsprung (8 cm tief, 5,5 cm stark): Oberseite,
     sichtbare Seitenfläche und Stirn per Parallaxe, jede mit ihrem eigenen
     Licht, darunter Schlagschatten und Regenschliere. Im Winter liegt
     Schnee darauf, vorn mit gerundeter Lippe. holz: im Fachwerk Eiche,
     im Sockelgeschoss Sandstein. */
  function bankMalen(g, F, B, x, y, w, holz, S, winter, saat) {
    const px = F.px;
    if (px < 3) return;
    const d = 0.08, hB = 0.055, x0 = x - 0.06, bw = w + 0.12;
    const p = parallaxe(F, B, -d);
    const u = F.flaeche.u, nW = kreuz(F.flaeche.u, F.flaeche.v);
    const c = holz ? hell(S.holzC, 0.14) : [172, 112, 92];
    /* Regenschliere und Schlagschatten auf der Wand */
    if (px > 8) {
      const gr = g.createLinearGradient(0, y + hB, 0, y + hB + 0.5);
      gr.addColorStop(0, "rgba(70,62,48,0.2)"); gr.addColorStop(1, "rgba(70,62,48,0)");
      g.fillStyle = gr; g.beginPath(); g.moveTo(x0 + 0.08, y + hB); g.lineTo(x0 + bw - 0.08, y + hB); g.lineTo(x0 + bw - 0.2, y + hB + 0.5); g.lineTo(x0 + 0.2, y + hB + 0.5); g.closePath(); g.fill();
    }
    const sv = F.schatten ? F.schatten(d) : null;
    if (sv) {
      g.beginPath(); g.moveTo(x0, y + hB); g.lineTo(x0 + bw, y + hB); g.lineTo(x0 + bw + sv[0], y + hB + sv[1]); g.lineTo(x0 + sv[0], y + hB + sv[1]); g.closePath();
      g.fillStyle = "rgba(30,26,34,0.34)"; g.fill();
    }
    const kO = lichtVerh(F, B, [0, 0, 1]);
    /* Oberseite */
    g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + bw, y); g.lineTo(x0 + bw + p[0], y + p[1]); g.lineTo(x0 + p[0], y + p[1]); g.closePath();
    g.fillStyle = rgb(winter ? malF([242, 246, 252], kO) : malF(hell(c, 0.06), kO)); g.fill();
    /* sichtbare Seite */
    if (Math.abs(p[0]) > 0.002) {
      const xs = p[0] > 0 ? x0 : x0 + bw, kS = lichtVerh(F, B, p[0] > 0 ? mul(u, -1) : u);
      g.beginPath(); g.moveTo(xs, y); g.lineTo(xs + p[0], y + p[1]); g.lineTo(xs + p[0], y + p[1] + hB); g.lineTo(xs, y + hB); g.closePath();
      g.fillStyle = rgb(malF(hell(c, -0.04), kS)); g.fill();
    }
    /* Stirn */
    const fx = x0 + p[0], fy = y + p[1];
    g.fillStyle = rgb(c); g.fillRect(fx, fy, bw, hB);
    if (px > 12) {
      g.fillStyle = "rgba(255,248,236,0.22)"; g.fillRect(fx, fy, bw, Math.max(0.006, 0.8 / px));
      g.fillStyle = "rgba(20,12,8,0.3)"; g.fillRect(fx, fy + hB - Math.max(0.006, 0.8 / px), bw, Math.max(0.006, 0.8 / px));
      if (px > 20) rausch(g, fx, fy, bw, hB, holz ? 0.4 : 0.5, 0.22, saat | 0, 3);
    }
    if (winter) {
      /* Schneepolster mit gerundeter Lippe über der Stirn */
      const rr = zufall(saat | 0);
      g.beginPath(); g.moveTo(fx - 0.01, fy + 0.012);
      for (let t = 0; t <= 1.0001; t += 0.125) g.lineTo(fx + bw * t, fy + 0.012 + Math.sin(t * Math.PI) * 0.006 + rr() * 0.006);
      g.lineTo(fx + bw + 0.01, fy - 0.004); g.quadraticCurveTo(fx + bw * 0.5, fy - 0.03, fx - 0.01, fy - 0.004); g.closePath();
      g.fillStyle = rgb(malF([244, 247, 252], kO)); g.fill();
    }
  }
  /* Eingeschnitzte Inschrift auf der Schwelle des Obergeschosses */
  function inschrift(g, F, text, L, H, S) {
    g.save();
    g.font = "600 0.095px Georgia, 'Times New Roman', serif";
    g.textAlign = "center"; g.textBaseline = "middle";
    const y = H - 0.1;
    g.fillStyle = rgb(hell(S.holzC, 0.25), 0.55); g.fillText(text, L / 2 + 0.004, y + 0.005);
    g.fillStyle = rgb(hell(S.holzC, -0.55), 0.85); g.fillText(text, L / 2, y);
    g.restore();
  }

  /* =====================================================================
     KÖRPER VOR DER WAND
     Rahmen einer Wand: a entlang (von außen gesehen nach rechts), h nach
     oben, d nach außen. kasten() baut einen Quader vor der Wand.
     ===================================================================== */
  /* Für durchsichtige Flächen (keinLicht): Licht gleich in die Farben
     einrechnen. L([r,g,b], alpha) → Farbzeichenkette. */
  function belichter(F, extra) {
    const lf = ST.lichtFaktor(F.n, F.zeit, extra || 0, F.jahr);
    return (c, a) => rgb([c[0] * lf[0], c[1] * lf[1], c[2] * lf[2]], a);
  }
  function rahmen3(O, N) {
    const A = kreuz(N, Z);
    return { O: O, N: N, A: A, p: (a, h, d) => [O[0] + A[0] * a + N[0] * d, O[1] + A[1] * a + N[1] * d, O[2] + h] };
  }
  function kasten(M, R, a0, a1, h0, h1, d0, d1, mal, opt) {
    opt = opt || {};
    const am = (a0 + a1) / 2, hm = (h0 + h1) / 2, dm = (d0 + d1) / 2;
    const ex = (e, x) => Object.assign({ keinAo: true, ebene: (opt.ebene || 0) + (e || 0), name: opt.name }, opt.extra || {}, x || {});
    if (mal.vorn) rechteck(M, R.p(am, hm, d1), R.N, R.A, a1 - a0, h1 - h0, mal.vorn, ex(opt.vornEbene));
    if (mal.oben) rechteck(M, R.p(am, h1, dm), Z, R.A, a1 - a0, d1 - d0, mal.oben, ex(opt.obenEbene));
    if (mal.links) rechteck(M, R.p(a0, hm, dm), mul(R.A, -1), R.N, d1 - d0, h1 - h0, mal.links, ex(opt.seitenEbene));
    if (mal.rechts) rechteck(M, R.p(a1, hm, dm), R.A, mul(R.N, -1), d1 - d0, h1 - h0, mal.rechts, ex(opt.seitenEbene));
  }

  /* ---------------- Holzflächen einfacher Körper (Knaggen) ----------------
     Grundton, eine leichte Wölbung quer zur Faser und die Maserung als
     EIN Pfad – früher lief hier der alte Einzelbalken-Maler mit vielen
     Einzelstrichen je Fläche. */
  function holzFlaeche(c, saat, quer) {
    return function (g, F) {
      const w = F.w, h = F.h, px = F.px, rng = zufall(saat);
      g.fillStyle = rgb(c); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      if (px * Math.min(w, h) <= 4) return;
      const gr = quer ? g.createLinearGradient(0, 0, w, 0) : g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, rgb(hell(c, -0.07))); gr.addColorStop(0.2, rgb(hell(c, 0.03))); gr.addColorStop(0.75, rgb(c)); gr.addColorStop(1, rgb(hell(c, -0.1)));
      g.fillStyle = gr; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      if (px > 14) {
        const L = quer ? h : w, Q = quer ? w : h, n = Math.max(3, Math.round(Q / 0.035));
        g.beginPath();
        for (let i = 0; i < n; i++) {
          const q = (i + 0.5 + (rng() - 0.5) * 0.6) * Q / n, a1 = (rng() - 0.5) * 0.012, a2 = (rng() - 0.5) * 0.012, e = (rng() - 0.5) * 0.01;
          if (quer) { g.moveTo(q, -0.02); g.bezierCurveTo(q + a1, L * 0.35, q + a2, L * 0.65, q + e, L + 0.02); }
          else { g.moveTo(-0.02, q); g.bezierCurveTo(L * 0.35, q + a1, L * 0.65, q + a2, L + 0.02, q + e); }
        }
        g.lineWidth = Math.max(0.003, 0.7 / px); g.strokeStyle = rgb(hell(c, -0.35), 0.35); g.stroke();
      }
    };
  }
  function schneeOben(basis, dicke) {
    return function (g, F) {
      if (basis) { if (typeof basis === "string") { g.fillStyle = basis; g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04); } else basis(g, F); }
      g.fillStyle = "rgb(242,246,252)";
      PI.rundRechteck(g, -0.01, -0.01, F.w + 0.02, F.h + 0.02, Math.min(0.03, F.h * 0.3)); g.fill();
      const gr = g.createLinearGradient(0, 0, 0, F.h);
      gr.addColorStop(0, "rgba(200,212,235,0.35)"); gr.addColorStop(0.4, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(215,225,245,0.25)");
      g.fillStyle = gr; g.fillRect(0, 0, F.w, F.h);
      void dicke;
    };
  }

  /* =====================================================================
     BALKENLAGE mit Balkenköpfen, Füllhölzern und Knaggen
     ===================================================================== */
  function fuellholz(c, saat, koepfe, kopf) {
    /* Profil von oben: Platte, tiefe Kehle, Wulst, Plättchen, Fase – mit
       kräftigen Schatten, damit die Balkenlage plastisch wirkt, obwohl die
       Köpfe nur 4 cm vorstehen. koepfe: Mitten der Köpfe (Flächen-x). */
    return function (g, F) {
      const w = F.w, h = F.h;
      g.fillStyle = rgb(c); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      const band = (y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, rgb(hell(c, a))); gr.addColorStop(1, rgb(hell(c, b))); g.fillStyle = gr; g.fillRect(-0.05, y0, w + 0.1, y1 - y0); };
      band(0, h * 0.16, 0.12, 0.0);
      band(h * 0.16, h * 0.4, -0.5, -0.12);
      band(h * 0.4, h * 0.72, 0.14, -0.28);
      band(h * 0.72, h * 0.82, 0.02, -0.1);
      band(h * 0.82, h, -0.2, -0.5);
      if (F.px > 16) {
        const rng = zufall(saat);
        g.lineWidth = Math.max(0.003, 0.7 / F.px);
        for (let i = 0; i < 6; i++) {
          const yy = rng() * h;
          g.strokeStyle = rgb(hell(c, -0.3), 0.25);
          g.beginPath(); g.moveTo(0, yy); g.bezierCurveTo(w * 0.3, yy + 0.01, w * 0.6, yy - 0.01, w, yy + 0.005); g.stroke();
        }
      }
      /* Schatten der vorstehenden Köpfe auf die Füllhölzer */
      if (koepfe && F.schatten) {
        const sv = F.schatten(0.04);
        if (sv) {
          g.fillStyle = "rgba(20,12,8,0.42)";
          for (const a of koepfe) g.fillRect(a - 0.1 + sv[0], sv[1], 0.2, h);
        }
      }
      /* weit weg: Köpfe nur als dunklere Stirnflächen andeuten */
      if (koepfe && F.px < 8) { g.fillStyle = rgb(hell(c, -0.16)); g.beginPath(); for (const a of koepfe) g.rect(a - 0.1, 0, 0.2, h); g.fill(); }
      else if (koepfe && kopf) koepfeMalen(g, F, koepfe, c, kopf);
    };
  }
  /* Balkenköpfe, auf die Bandfläche GEMALT statt als je vier eigene
     Flächen (64 Köpfe × 3 sichtbare Seiten waren ein Drittel aller
     Flächen des Hauses und kosteten entsprechend Zeichenbefehle). Die
     Köpfe stehen nur 4 cm vor: Stirn um die Parallaxe versetzt, dazu die
     sichtbare Seitenwange und die Oberseite, jede mit ihrem eigenen Licht.
     Alle Köpfe eines Bands in wenigen gebündelten Pfaden. */
  function koepfeMalen(g, F, koepfe, c, kopf) {
    const B = kopf.B, h = F.h, px = F.px, bw = 0.2;
    const p = B && B.e ? parallaxe(F, B, -0.04) : [0, 0.02];
    const N = kreuz(F.flaeche.v, F.flaeche.u), A = F.flaeche.u;
    /* sichtbare Seite: die, von der die Stirn weggerückt ist */
    const sx = p[0] > 0 ? -1 : 1, nSeite = mul(A, sx);
    const lS = B && B.e ? lichtVerh(F, B, nSeite) : [0.8, 0.8, 0.8], lO = B && B.e ? lichtVerh(F, B, Z) : [1.1, 1.1, 1.1];
    const seiteC = malF(hell(c, -0.1), lS), obenC = kopf.winter ? malF([244, 247, 252], lO) : malF(hell(c, 0.02), lO);
    const d = hell(c, -0.14);
    /* Seitenwangen */
    if (Math.abs(p[0]) > 0.002) {
      g.beginPath();
      for (const a of koepfe) { const x = a + sx * bw / 2; g.moveTo(x, 0); g.lineTo(x + p[0], p[1]); g.lineTo(x + p[0], h + p[1]); g.lineTo(x, h); g.closePath(); }
      g.fillStyle = rgb(seiteC); g.fill();
    }
    /* Oberseiten (im Winter mit Schnee) */
    if (p[1] > 0.002) {
      g.beginPath();
      for (const a of koepfe) { g.moveTo(a - bw / 2, 0); g.lineTo(a + bw / 2, 0); g.lineTo(a + bw / 2 + p[0], p[1]); g.lineTo(a - bw / 2 + p[0], p[1]); g.closePath(); }
      g.fillStyle = rgb(obenC); g.fill();
    }
    /* Stirn: Hirnholz, unten ein Rundstab (ein Verlauf für alle Köpfe) */
    const fr = (y0, y1) => { g.beginPath(); for (const a of koepfe) g.rect(a - bw / 2 + p[0], y0 + p[1], bw, y1 - y0); };
    fr(0, h); g.fillStyle = rgb(d); g.fill();
    if (px * h > 5) {
      const gr = g.createLinearGradient(0, h * 0.6 + p[1], 0, h + p[1]);
      gr.addColorStop(0, rgb(hell(d, -0.25))); gr.addColorStop(0.12, rgb(hell(c, 0.1))); gr.addColorStop(0.45, rgb(c)); gr.addColorStop(0.8, rgb(hell(c, -0.3))); gr.addColorStop(1, rgb(hell(c, -0.5)));
      fr(h * 0.6, h); g.fillStyle = gr; g.fill();
    }
    /* Jahresringe und Trockenriss (nah), gebündelt */
    if (px * bw > 8) {
      const rng = zufall(kopf.saat), ringe = [], risse = [];
      for (const a of koepfe) {
        const cx = a - bw / 2 + p[0] + bw * (0.35 + rng() * 0.3), cy = p[1] + h * (0.28 + rng() * 0.12), rmax = Math.min(bw * 0.45, h * 0.3);
        for (let r = 0.02; r < rmax; r += 0.018 + rng() * 0.012) ringe.push([cx, cy, r]);
        risse.push([cx, cy, cx + (rng() - 0.5) * bw * 0.8, rng() < 0.5 ? p[1] + 0.01 : p[1] + h * 0.58]);
      }
      g.beginPath(); for (const [x, y, r] of ringe) { g.moveTo(x + r * 1.05, y); g.ellipse(x, y, r * 1.05, r, 0, 0, Math.PI * 2); }
      g.lineWidth = Math.max(0.003, 0.7 / px); g.strokeStyle = rgb(hell(d, -0.3), 0.35); g.stroke();
      g.beginPath(); for (const [x0, y0, x1, y1] of risse) { g.moveTo(x0, y0); g.lineTo(x1, y1); }
      g.lineWidth = Math.max(0.004, 1 / px); g.strokeStyle = rgb(hell(d, -0.6), 0.8); g.stroke();
    }
    /* Lichtkante oben an der Stirn, Fuge zum Band */
    fr(0, Math.min(0.012, h * 0.08)); g.fillStyle = rgb(hell(c, 0.06)); g.fill();
    if (kopf.winter) { g.beginPath(); for (const a of koepfe) { const x0 = a - bw / 2 + p[0]; g.moveTo(x0 - 0.01, p[1] - 0.005); g.lineTo(x0 + bw + 0.01, p[1] - 0.005); g.lineTo(x0 + bw + 0.01, p[1] + 0.014); g.quadraticCurveTo(x0 + bw / 2, p[1] + 0.024, x0 - 0.01, p[1] + 0.016); g.closePath(); } g.fillStyle = "rgb(244,247,252)"; g.fill(); }
    void N;
  }
  /* Knagge: geschwungene Stütze unter einem Balkenkopf, in der Ebene
     senkrecht zur Wand (Rahmen R, bei a). Aus zwei Seitenflächen und der
     gekrümmten Unterseite (in Facetten). tief = Auskragung + Kopf. */
  function knagge(M, R, a, tief, hoch, c, saat, ebene) {
    const bw = 0.075;
    const pts = [];
    const n = 5;                     // fünf Facetten reichen für den Bogen (je Facette eine Fläche)
    for (let k = 0; k <= n; k++) {
      const t = k / n * Math.PI / 2;
      pts.push([tief - (tief - 0.05) * Math.cos(t), -hoch + (hoch - 0.04) * Math.sin(t)]);   // (d, h)
    }
    /* Profil: oben an der Wand, entlang des Balkens bis zur Spitze, Bogen zurück */
    const profil = [[0, 0], [tief, 0], [tief, -0.04]];
    for (let k = n; k >= 0; k--) profil.push(pts[k]);
    profil.push([0, -hoch]);
    const holz = holzFlaeche(hell(c, -0.02), saat, true);
    const mal = (g, F) => {
      holz(g, F);
      if (F.px > 18) {
        /* eingeschnittene Zierlinie parallel zum Bogen */
        g.strokeStyle = rgb(hell(c, -0.55), 0.7); g.lineWidth = Math.max(0.006, 0.9 / F.px);
        g.beginPath();
        for (let k = 0; k <= n; k++) { const q = F.umrechnen([pts[k][0] * 0.82 + 0.01, pts[k][1] * 0.82 - 0.02]); if (k) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); }
        g.stroke();
      }
    };
    for (const s of [-1, 1]) {
      /* +A-Seite: u = -N, v = -Z (Flächen-x = tief - d); −A-Seite: u = N (Flächen-x = d) */
      const o = s > 0 ? R.p(a + bw, 0, tief) : R.p(a - bw, 0, 0);
      const u = s > 0 ? mul(R.N, -1) : R.N;
      const um = profil.map(([d, h]) => [s > 0 ? tief - d : d, -h]);
      const f = M.flaeche({ name: "knagge", o: o, u: u, v: [0, 0, -1], w: tief, h: hoch, umriss: um, malen: mal, keinAo: true, ebene: ebene });
      f.umrechnen = null;
      const umr = (p) => [s > 0 ? tief - p[0] : p[0], -p[1]];
      f.malen = (g, F) => { F.umrechnen = umr; mal(g, F); };
    }
    /* Unterseite in Facetten */
    for (let k = 0; k < n; k++) {
      const p0 = pts[k], p1 = pts[k + 1];
      const dm = (p0[0] + p1[0]) / 2, hm = (p0[1] + p1[1]) / 2;
      const td = p1[0] - p0[0], th = p1[1] - p0[1], l = Math.hypot(td, th);
      /* Normale in der (d,h)-Ebene, weg von der Wandecke (0,0): nach außen-unten */
      let nd = th / l, nh = -td / l;
      if (nd * (dm - 0) + nh * (hm - 0) < 0) { nd = -nd; nh = -nh; }
      const n3 = [R.N[0] * nd, R.N[1] * nd, nh];
      rechteck(M, R.p(a, hm, dm), n3, R.A, 2 * bw, l + 0.004, holzFlaeche(hell(c, -0.12), saat + k, false), { keinAo: true, ebene: ebene, name: "knagge-u" });
    }
  }

  /* =====================================================================
     HAUSTÜR im Fachwerk: Eichen-Türstock mit geschnitztem Kielbogen-Sturz
     Ein Steinbogen kann in einer Holzwand nicht tragen – im Fachwerk sitzt
     die Tür in einem hölzernen Türstock: zwei Pfosten mit gefaster Kante,
     darüber ein kräftiger Sturz, in den ein Kielbogen (Eselsrücken)
     eingeschnitzt ist, in den Zwickeln Rosetten, im Bogenfeld die
     Jahreszahl. Unter dem Sturz ein rechteckiges Oberlicht mit Sprossen,
     darunter die zweiflügelige Füllungstür. XANDER: „ne Klingel an der
     Tür, Hausnummer" – Klingel und Hausnummer sitzen rechts daneben, das
     Namensschild aus Messing auf dem rechten Türflügel.
     x, y, w, h: Öffnung im Fachwerk (Flächenkoordinaten, unten = Sockel)
     ===================================================================== */
  const TUERSTOCK = { stock: 0.14, sturz: 0.34, ober: 0.34 };
  function tuerMaße(x, y, w, h) {
    const st = TUERSTOCK.stock, lx = x + st, lw = w - 2 * st, ys = y + TUERSTOCK.sturz, yk = ys + TUERSTOCK.ober, yb = y + h;
    return { st: st, lx: lx, lw: lw, ys: ys, yk: yk, yb: yb, cx: x + w / 2 };
  }
  function tuerMalen(g, F, B, x, y, w, h, S, D) {
    const px = F.px, T = tuerMaße(x, y, w, h), eiche = hell(S.holzC, -0.06);
    const rng = zufall(D.saat || 5);
    /* Türstock: Pfosten und Sturz (Eiche, im Holzton des Hauses) */
    g.fillStyle = rgb(eiche); g.fillRect(x, y, w, h);
    if (px > 12) rausch(g, x, y, w, h, 0.6, 0.2, 71, 3);
    /* Maserung der Pfosten und des Sturzes */
    if (px > 20) {
      g.beginPath();
      for (const px0 of [x, x + w - T.st]) for (let i = 1; i < 4; i++) { const xx = px0 + T.st * i / 4 + (rng() - 0.5) * 0.01; g.moveTo(xx, T.ys); g.bezierCurveTo(xx + 0.008, T.ys + h * 0.3, xx - 0.008, T.ys + h * 0.6, xx, T.yb); }
      for (let i = 1; i < 4; i++) { const yy = y + TUERSTOCK.sturz * i / 4; g.moveTo(x, yy); g.bezierCurveTo(x + w * 0.3, yy + 0.006, x + w * 0.6, yy - 0.006, x + w, yy); }
      g.lineWidth = Math.max(0.003, 0.7 / px); g.strokeStyle = rgb(hell(eiche, -0.45), 0.3); g.stroke();
    }
    /* Fase an den Pfosten (Lichtkante und Schattenkante) mit Auslauf unten */
    if (px > 10) {
      const f = 0.025;
      g.fillStyle = rgb(hell(eiche, 0.14)); g.fillRect(T.lx - f, T.yk, f, T.yb - T.yk - 0.25);
      g.fillStyle = rgb(hell(eiche, -0.25)); g.fillRect(T.lx + T.lw, T.yk, f, T.yb - T.yk - 0.25);
    }
    /* Sturz: Kielbogen als geschnitzte Kerbe, Rosetten, Inschrift */
    const kiel = (dy) => {
      const a = T.lx, e = T.lx + T.lw, ys = y + TUERSTOCK.sturz - 0.02 + dy, top = y + 0.06 + dy, cx = T.cx;
      g.moveTo(a, ys);
      g.bezierCurveTo(a, ys - 0.16, cx - T.lw * 0.3, ys - 0.12, cx - 0.04, top + 0.06);
      g.quadraticCurveTo(cx - 0.01, top + 0.02, cx, top);
      g.quadraticCurveTo(cx + 0.01, top + 0.02, cx + 0.04, top + 0.06);
      g.bezierCurveTo(cx + T.lw * 0.3, ys - 0.12, e, ys - 0.16, e, ys);
    };
    if (px > 12) {
      g.lineCap = "round"; g.lineJoin = "round";
      g.beginPath(); kiel(0.012); g.lineWidth = Math.max(0.012, 1 / px); g.strokeStyle = rgb(hell(eiche, 0.2), 0.7); g.stroke();
      g.beginPath(); kiel(0); g.lineWidth = Math.max(0.014, 1.1 / px); g.strokeStyle = rgb(hell(eiche, -0.55), 0.85); g.stroke();
      /* Rosetten in den Zwickeln */
      if (px > 25) for (const rx of [x + w * 0.16, x + w * 0.84]) {
        const ry = y + 0.13, r = 0.055;
        g.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; g.moveTo(rx, ry); g.quadraticCurveTo(rx + Math.cos(a - 0.4) * r * 1.1, ry + Math.sin(a - 0.4) * r * 1.1, rx + Math.cos(a) * r, ry + Math.sin(a) * r); g.quadraticCurveTo(rx + Math.cos(a + 0.4) * r * 1.1, ry + Math.sin(a + 0.4) * r * 1.1, rx, ry); }
        g.fillStyle = rgb(hell(eiche, -0.35)); g.fill();
        g.lineWidth = Math.max(0.003, 0.6 / px); g.strokeStyle = rgb(hell(eiche, 0.25), 0.6); g.stroke();
      }
      if (px > 30) {
        g.font = "600 0.07px Georgia, 'Times New Roman', serif"; g.textAlign = "center"; g.textBaseline = "middle";
        g.fillStyle = rgb(hell(eiche, 0.25), 0.6); g.fillText(String(D.jahr), T.cx + 0.004, y + 0.235);
        g.fillStyle = rgb(hell(eiche, -0.6), 0.9); g.fillText(String(D.jahr), T.cx, y + 0.231);
        if (px > 60 && D.kuerzel) { g.font = "600 0.045px Georgia, serif"; g.fillText(D.kuerzel, T.cx, y + 0.3); }
      }
    }
    /* Öffnung: alles darin liegt 14 cm zurück (Parallaxe) */
    g.save();
    g.beginPath(); g.rect(T.lx, T.ys, T.lw, T.yb - T.ys); g.clip();
    g.fillStyle = rgb(hell(eiche, -0.3)); g.fillRect(T.lx, T.ys, T.lw, T.yb - T.ys);
    const pL = parallaxe(F, B, 0.14);
    if (pL[1] < 0) { g.fillStyle = rgb(hell(eiche, 0.05)); g.fillRect(T.lx, T.yb + pL[1], T.lw, -pL[1]); }
    g.translate(pL[0], pL[1]);
    if (D.leer) { g.fillStyle = "rgb(24,20,18)"; g.fillRect(T.lx - 0.2, T.ys - 0.2, T.lw + 0.4, T.yb - T.ys + 0.4); }
    else tuerBlatt(g, F, B, T, S, D);
    g.restore();
    /* Laibungsschatten: Oberkante und sonnenzugewandte Seite */
    const sv = F.schatten ? F.schatten(0.14) : null;
    if (sv) {
      g.save(); g.beginPath(); g.rect(T.lx, T.ys, T.lw, T.yb - T.ys); g.clip();
      g.fillStyle = "rgba(25,15,15,0.4)";
      g.beginPath(); g.rect(T.lx - 1, T.ys - 1, T.lw + 2, T.yb - T.ys + 2);
      g.rect(T.lx + sv[0], T.ys + sv[1], T.lw, T.yb - T.ys + 1);
      g.fill("evenodd");
      g.restore();
    }
    /* Schwelle (Sandstein) */
    g.fillStyle = "rgb(150,98,80)"; g.fillRect(T.lx - 0.04, T.yb - 0.05, T.lw + 0.08, 0.06);
    if (D.girlande) girlande(g, F, x, y, w, h, false);
  }
  /* Innenleben der Türöffnung: Oberlicht mit Sprossen, Kämpfer, zwei
     Flügel mit je zwei Füllungen (Fase: Licht oben links), Beschläge,
     Namensschild aus Messing, im Winter der Kranz */
  function tuerBlatt(g, F, B, T, S, D) {
    const px = F.px, f = hex(D.farbe), lx = T.lx, lw = T.lw;
    /* Oberlicht */
    const oy = T.ys, oh = TUERSTOCK.ober - 0.06;
    g.fillStyle = "rgb(26,26,30)"; g.fillRect(lx, oy, lw, oh);
    const gl = g.createLinearGradient(lx, oy, lx + lw * 0.4, oy + oh);
    gl.addColorStop(0, "rgba(150,170,200,0.32)"); gl.addColorStop(1, "rgba(70,80,95,0.2)");
    g.fillStyle = gl; g.fillRect(lx, oy, lw, oh);
    g.beginPath();
    for (let i = 1; i < 4; i++) g.rect(lx + lw * i / 4 - 0.012, oy, 0.024, oh);
    g.rect(lx, oy, lw, 0.03); g.rect(lx, oy, 0.03, oh); g.rect(lx + lw - 0.03, oy, 0.03, oh);
    g.fillStyle = rgb(hell(f, -0.15)); g.fill();
    /* Kämpferholz */
    g.fillStyle = rgb(hell(f, -0.1)); g.fillRect(lx, T.yk - 0.06, lw, 0.07);
    g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(lx, T.yk - 0.06, lw, 0.012);
    /* zwei Flügel mit Füllungen */
    const fy = T.yk + 0.01, fh = T.yb - fy - 0.05;
    const hellP = [], dunkelP = [], mitteR = [];
    for (const s of [0, 1]) {
      const fx = lx + s * lw / 2, fw = lw / 2;
      const gr = g.createLinearGradient(fx, 0, fx + fw, 0);
      gr.addColorStop(0, rgb(hell(f, 0.05))); gr.addColorStop(1, rgb(hell(f, -0.08)));
      g.fillStyle = gr; g.fillRect(fx, fy, fw, fh);
      if (px > 8) {
        const rb = 0.085, k = 0.03;
        for (const [y0, hh] of [[fy + rb, fh * 0.52 - rb * 1.5], [fy + fh * 0.52 + rb * 0.5, fh * 0.48 - rb * 1.5]]) {
          const x0 = fx + rb, ww = fw - 2 * rb;
          hellP.push([[x0, y0], [x0 + ww, y0], [x0 + ww - k, y0 + k], [x0 + k, y0 + k]], [[x0, y0], [x0 + k, y0 + k], [x0 + k, y0 + hh - k], [x0, y0 + hh]]);
          dunkelP.push([[x0 + ww, y0], [x0 + ww, y0 + hh], [x0 + ww - k, y0 + hh - k], [x0 + ww - k, y0 + k]], [[x0, y0 + hh], [x0 + k, y0 + hh - k], [x0 + ww - k, y0 + hh - k], [x0 + ww, y0 + hh]]);
          mitteR.push([x0 + k, y0 + k, ww - 2 * k, hh - 2 * k]);
        }
      }
    }
    const fuellP = (liste, farbe) => { if (!liste.length) return; g.beginPath(); for (const P of liste) polyPfad(g, P); g.fillStyle = farbe; g.fill(); };
    fuellP(hellP, rgb(hell(f, 0.16))); fuellP(dunkelP, rgb(hell(f, -0.26)));
    if (mitteR.length) { g.beginPath(); for (const r of mitteR) g.rect(r[0], r[1], r[2], r[3]); g.fillStyle = rgb(hell(f, 0.02)); g.fill(); }
    if (px > 12) rausch(g, lx, fy, lw, fh, 0.8, 0.15, 12, 3);
    /* Mittelstoß (Schlagleiste) */
    g.fillStyle = rgb(hell(f, -0.4)); g.fillRect(T.cx - 0.008, fy, 0.016, fh);
    g.fillStyle = rgb(hell(f, 0.12)); g.fillRect(T.cx + 0.008, fy, 0.012, fh);
    /* Beschläge: Drücker mit Langschild, Schlüsselloch, Türklopfer */
    if (px > 14) {
      const mx = T.cx, my = fy + fh * 0.5;
      g.fillStyle = "#b8903f"; PI.rundRechteck(g, mx + 0.03, my - 0.1, 0.045, 0.22, 0.02); g.fill();
      g.fillStyle = "#e1bd68"; g.fillRect(mx + 0.04, my - 0.012, 0.12, 0.024);
      g.fillStyle = "#3a2a14"; g.beginPath(); g.arc(mx + 0.052, my + 0.07, 0.009, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#c79a45"; g.lineWidth = 0.014; g.beginPath(); g.arc(mx - 0.13, my - 0.36, 0.05, 0, Math.PI * 2); g.stroke();
      g.fillStyle = "#c79a45"; g.beginPath(); g.arc(mx - 0.13, my - 0.41, 0.022, 0, Math.PI * 2); g.fill();
    }
    /* Namensschild (Messing, graviert) auf dem rechten Flügel: der Name
       erst, wenn die Buchstaben mindestens 5 Bildpunkte hoch sind, sonst
       zwei feine Striche als Andeutung */
    namensschild(g, F, T.cx + lw * 0.25 - 0.1, fy + fh * 0.2, D.name);
    if (D.kranz) kranzMalen(g, F, T.cx - lw * 0.25, fy + fh * 0.27, 0.17, D.winterLicht);
  }
  function namensschild(g, F, x, y, name) {
    const px = F.px, w = 0.2, h = 0.06;
    g.fillStyle = "rgba(20,15,10,0.35)"; PI.rundRechteck(g, x + 0.006, y + 0.008, w, h, 0.008); g.fill();
    const gr = g.createLinearGradient(x, y, x + w, y + h);
    gr.addColorStop(0, "#f0d58a"); gr.addColorStop(0.5, "#cfa855"); gr.addColorStop(1, "#a7843f");
    g.fillStyle = gr; PI.rundRechteck(g, x, y, w, h, 0.008); g.fill();
    if (!name) return;
    if (px * 0.036 >= 5) {
      g.font = "600 0.036px Georgia, 'Times New Roman', serif"; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillStyle = "rgba(255,240,200,0.5)"; g.fillText(name, x + w / 2 + 0.002, y + h / 2 + 0.003, w - 0.02);
      g.fillStyle = "#3a2a12"; g.fillText(name, x + w / 2, y + h / 2 + 0.001, w - 0.02);
    } else if (px > 20) {
      g.fillStyle = "rgba(58,42,18,0.8)"; g.fillRect(x + 0.03, y + h / 2 - 0.004, w * 0.45, 0.008); g.fillRect(x + 0.04 + w * 0.47, y + h / 2 - 0.004, w * 0.2, 0.008);
    }
  }
  /* Türkranz: 36 Nadelbüschel im Ring, jedes mit Licht oben links und
     Schatten zur Mitte hin (Volumen), dazu Zapfen, rote Beeren, oben ein
     rotes Band zum Nagel, unten eine Schleife; im Winter Schneeflocken */
  function kranzMalen(g, F, cx, cy, r, leuchtend) {
    const px = F.px, rng = zufall(4242);
    g.save();
    g.strokeStyle = "rgba(160,20,30,0.9)"; g.lineWidth = 0.02;
    g.beginPath(); g.moveTo(cx, cy - r); g.lineTo(cx, cy - r - 0.3); g.stroke();
    /* Schlagschatten auf dem Türblatt */
    g.fillStyle = "rgba(15,20,15,0.35)"; g.beginPath(); g.arc(cx + 0.02, cy + 0.025, r * 1.06, 0, Math.PI * 2); g.arc(cx + 0.02, cy + 0.025, r * 0.48, 0, Math.PI * 2, true); g.fill("evenodd");
    /* Grundring: dunkel innen, heller oben links */
    const gr = g.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.2, cx, cy, r * 1.05);
    gr.addColorStop(0, "rgb(64,104,64)"); gr.addColorStop(0.6, "rgb(38,70,44)"); gr.addColorStop(1, "rgb(20,40,26)");
    g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.arc(cx, cy, r * 0.5, 0, Math.PI * 2, true); g.fill("evenodd");
    if (px > 14) {
      /* Nadelbüschel: Fächer aus 3–5 cm Strichen, Licht von links oben */
      const toene = [[], [], []];
      for (let i = 0; i < 36; i++) {
        const a = i / 36 * Math.PI * 2 + rng() * 0.1, rr = r * (0.62 + rng() * 0.3);
        const bx = cx + Math.cos(a) * rr, by = cy + Math.sin(a) * rr, t = a + Math.PI / 2;
        const licht = 0.5 + 0.5 * Math.cos(a + 2.35);
        const k = licht > 0.66 ? 2 : licht > 0.33 ? 1 : 0;
        for (let j = -2; j <= 2; j++) { const aa = t + j * 0.35 + (rng() - 0.5) * 0.2, l = 0.03 + rng() * 0.02; toene[k].push([bx, by, bx + Math.cos(aa) * l, by + Math.sin(aa) * l]); }
      }
      const farben = [[26, 50, 32], [42, 80, 50], [80, 124, 78]];
      g.lineCap = "round"; g.lineWidth = Math.max(0.006, 0.8 / px);
      toene.forEach((liste, k) => { g.beginPath(); for (const [a, b, c, d] of liste) { g.moveTo(a, b); g.lineTo(c, d); } g.strokeStyle = rgb(farben[k]); g.stroke(); });
      /* Beeren und Zapfen */
      g.beginPath();
      for (let i = 0; i < 9; i++) { const a = rng() * Math.PI * 2, rr = r * (0.62 + rng() * 0.3); g.moveTo(cx + Math.cos(a) * rr + 0.016, cy + Math.sin(a) * rr); g.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 0.016, 0, Math.PI * 2); }
      g.fillStyle = "rgb(186,22,34)"; g.fill();
      for (let i = 0; i < 3; i++) { const a = Math.PI * (0.2 + i * 0.6), rr = r * 0.75; g.fillStyle = "rgb(108,70,40)"; g.beginPath(); g.ellipse(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 0.022, 0.034, a, 0, Math.PI * 2); g.fill(); }
      if (F.jahr === "winter") { g.beginPath(); for (let i = 0; i < 9; i++) { const a = Math.PI * (1.15 + rng() * 0.7), rr = r * (0.66 + rng() * 0.3), x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr, q = 0.01 + rng() * 0.008; g.moveTo(x + q, y); g.ellipse(x, y, q, q * 0.45, a + Math.PI / 2, 0, Math.PI * 2); } g.fillStyle = "rgba(244,247,252,0.75)"; g.fill(); }
    }
    /* Schleife unten */
    const sx = cx, sy = cy + r * 0.88;
    g.fillStyle = "rgb(186,22,32)";
    g.beginPath(); g.moveTo(sx, sy); g.bezierCurveTo(sx - 0.12, sy - 0.1, sx - 0.14, sy + 0.05, sx, sy); g.fill();
    g.beginPath(); g.moveTo(sx, sy); g.bezierCurveTo(sx + 0.12, sy - 0.1, sx + 0.14, sy + 0.05, sx, sy); g.fill();
    g.fillStyle = "rgb(150,16,26)";
    g.beginPath(); g.moveTo(sx - 0.01, sy); g.lineTo(sx - 0.06, sy + 0.2); g.lineTo(sx - 0.03, sy + 0.19); g.lineTo(sx + 0.005, sy); g.fill();
    g.beginPath(); g.moveTo(sx + 0.01, sy); g.lineTo(sx + 0.07, sy + 0.19); g.lineTo(sx + 0.04, sy + 0.2); g.lineTo(sx - 0.005, sy); g.fill();
    g.fillStyle = "rgb(130,12,22)"; g.beginPath(); g.arc(sx, sy, 0.022, 0, Math.PI * 2); g.fill();
    void leuchtend;
    g.restore();
  }
  /* Tannengirlande um den Türstock: hängt am Sturz in zwei Bögen durch
     und läuft an den Pfosten 0,7 m herab. Gefiederte Silhouette aus 3–5 cm
     langen Nadelstrichen in drei Tönen, Zapfen, zwei rote Schleifen an den
     Ecken, darin ein Lämpchenstrang. */
  function girlande(g, F, x, y, w, h, leuchten) {
    const rng = zufall(777), px = F.px;
    const pts = [];
    const l0 = [x + 0.02, y + 0.85], l1 = [x + 0.04, y + 0.1], r1 = [x + w - 0.04, y + 0.1], r0 = [x + w - 0.02, y + 0.85];
    for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push([l0[0] + (l1[0] - l0[0]) * t + Math.sin(t * 9) * 0.01, l0[1] + (l1[1] - l0[1]) * t]); }
    for (let i = 1; i <= 16; i++) { const t = i / 16; pts.push([l1[0] + (r1[0] - l1[0]) * t, l1[1] + 0.07 * Math.abs(Math.sin(t * Math.PI * 2))]); }
    for (let i = 1; i <= 8; i++) { const t = i / 8; pts.push([r1[0] + (r0[0] - r1[0]) * t - Math.sin(t * 9) * 0.01, r1[1] + (r0[1] - r1[1]) * t]); }
    const linie = (dx, dy) => { g.beginPath(); pts.forEach(([a, b], i) => (i ? g.lineTo(a + dx, b + dy) : g.moveTo(a + dx, b + dy))); };
    if (!leuchten) {
      g.save();
      g.lineCap = "round"; g.lineJoin = "round";
      /* weicher Schlagschatten und ein dunkler Kern – die Form selbst
         entsteht aus den Nadelbüscheln, damit der Rand gefiedert ist und
         nicht wie ein grünes Band aussieht */
      linie(0.025, 0.035); g.strokeStyle = "rgba(10,16,12,0.22)"; g.lineWidth = 0.16; g.stroke();
      linie(0, 0); g.strokeStyle = "rgb(20,40,27)"; g.lineWidth = px > 14 ? 0.05 : 0.1; g.stroke();
      if (px > 14) {
        const toene = [[], [], []];
        for (let i = 0; i + 1 < pts.length; i++) {
          const [a, b] = pts[i], [c, d] = pts[i + 1], dir = Math.atan2(d - b, c - a);
          for (let k = 0; k < 11; k++) {
            const t = rng(), px0 = a + (c - a) * t, py0 = b + (d - b) * t;
            for (const sg of [-1, 1]) {
              const aa = dir + sg * (0.5 + rng() * 0.9), l = 0.035 + rng() * 0.045, ton = rng() < 0.25 ? 2 : rng() < 0.55 ? 1 : 0;
              toene[ton].push([px0, py0, px0 + Math.cos(aa) * l, py0 + Math.sin(aa) * l + 0.006]);
            }
          }
        }
        const farben = [[31, 61, 42], [47, 90, 58], [77, 122, 79]];
        g.lineWidth = Math.max(0.007, 0.8 / px);
        toene.forEach((liste, k) => { g.beginPath(); for (const [a, b, c, d] of liste) { g.moveTo(a, b); g.lineTo(c, d); } g.strokeStyle = rgb(farben[k]); g.stroke(); });
        /* Zapfen: länglich, mit hellen Schuppenkanten */
        g.beginPath();
        for (let i = 3; i < pts.length - 3; i += 5) { const [a, b] = pts[i], dx = (rng() - 0.5) * 0.04; g.moveTo(a + dx + 0.017, b + 0.045); g.ellipse(a + dx, b + 0.045, 0.017, 0.032, 0.15, 0, Math.PI * 2); }
        g.fillStyle = "rgb(102,66,38)"; g.fill();
        if (px > 40) { g.strokeStyle = "rgba(170,126,80,0.8)"; g.lineWidth = 0.4 / px * 2; g.stroke(); }
        /* ein wenig Schnee nur oben auf den Zweigen (Winter) */
        if (F.jahr === "winter") {
          g.beginPath();
          for (let i = 0; i < 18; i++) { const [a, b] = pts[1 + Math.floor(rng() * (pts.length - 2))], rx = 0.012 + rng() * 0.014; g.moveTo(a + rx, b - 0.028); g.ellipse(a + (rng() - 0.5) * 0.03, b - 0.028, rx, rx * 0.4, (rng() - 0.5) * 0.4, 0, Math.PI * 2); }
          g.fillStyle = "rgba(240,244,250,0.85)"; g.fill();
        }
      }
      /* zwei rote Schleifen in den oberen Ecken */
      for (const p of [l1, r1]) {
        g.fillStyle = "rgb(186,22,32)";
        g.beginPath(); g.moveTo(p[0], p[1]); g.bezierCurveTo(p[0] - 0.1, p[1] - 0.08, p[0] - 0.11, p[1] + 0.05, p[0], p[1]); g.fill();
        g.beginPath(); g.moveTo(p[0], p[1]); g.bezierCurveTo(p[0] + 0.1, p[1] - 0.08, p[0] + 0.11, p[1] + 0.05, p[0], p[1]); g.fill();
        g.fillStyle = "rgb(150,16,26)"; g.fillRect(p[0] - 0.012, p[1], 0.024, 0.14);
        g.fillStyle = "rgb(120,12,20)"; g.beginPath(); g.arc(p[0], p[1], 0.018, 0, Math.PI * 2); g.fill();
      }
      g.restore();
    }
    /* Lämpchen: kleine warmweiße Birnchen (Ø 2 cm) zwischen den Zweigen */
    const lampen = pts.filter((_, i) => i % 2 === 1).map(([a, b], i) => [a + Math.sin(i * 2.3) * 0.02, b + 0.015 + Math.cos(i * 1.7) * 0.015]);
    if (leuchten) {
      const a = F.nacht;
      g.save(); g.globalCompositeOperation = "lighter";
      for (const [r, al, f] of [[0.05, 0.06, "255,190,110"], [0.026, 0.2, "255,206,130"], [0.011, 0.95, "255,238,196"]]) {
        g.beginPath(); for (const [p0, p1] of lampen) { g.moveTo(p0 + r, p1); g.arc(p0, p1, r, 0, Math.PI * 2); }
        g.fillStyle = "rgba(" + f + "," + (al * a).toFixed(3) + ")"; g.fill();
      }
      g.restore();
    } else if (px > 20) {
      g.beginPath(); for (const [p0, p1] of lampen) { g.moveTo(p0 + 0.009, p1); g.arc(p0, p1, 0.009, 0, Math.PI * 2); }
      g.fillStyle = "rgb(243,226,176)"; g.fill();
    }
  }

  /* Klingel (Messingplatte mit Knopf) am Türpfosten */
  function klingelMalen(g, F, x, y) {
    const px = F.px, w = 0.1, h = 0.16;
    g.fillStyle = "rgba(20,15,10,0.35)"; PI.rundRechteck(g, x + 0.008, y + 0.01, w, h, 0.014); g.fill();
    const gr = g.createLinearGradient(x, y, x + w, y + h);
    gr.addColorStop(0, "#f2d88e"); gr.addColorStop(0.5, "#d1ad5c"); gr.addColorStop(1, "#a88440");
    g.fillStyle = gr; PI.rundRechteck(g, x, y, w, h, 0.014); g.fill();
    g.fillStyle = "#6f5220"; g.beginPath(); g.arc(x + w / 2, y + h * 0.58, 0.028, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#f8e6ae"; g.beginPath(); g.arc(x + w / 2 - 0.003, y + h * 0.58 - 0.003, 0.019, 0, Math.PI * 2); g.fill();
    if (px > 40) { g.fillStyle = "#555"; for (const yy of [y + 0.02, y + h - 0.02]) { g.beginPath(); g.arc(x + w / 2, yy, 0.006, 0, Math.PI * 2); g.fill(); } }
  }

  function hausnummerMalen(g, F, x, y, nummer) {
    const w = 0.21, h = 0.16;
    g.fillStyle = "rgba(0,0,0,0.3)"; PI.rundRechteck(g, x + 0.012, y + 0.014, w, h, 0.024); g.fill();
    const gr = g.createLinearGradient(x, y, x, y + h);
    gr.addColorStop(0, "#2c55b0"); gr.addColorStop(1, "#173a86");
    g.fillStyle = gr; PI.rundRechteck(g, x, y, w, h, 0.024); g.fill();
    g.strokeStyle = "#f2f2f2"; g.lineWidth = 0.011; PI.rundRechteck(g, x + 0.014, y + 0.014, w - 0.028, h - 0.028, 0.016); g.stroke();
    if (F.px > 18) {
      g.fillStyle = "#fafafa"; g.font = "700 0.1px Helvetica, Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText(String(nummer), x + w / 2, y + h / 2 + 0.006);
    }
    g.fillStyle = "rgba(255,255,255,0.28)"; PI.rundRechteck(g, x + 0.024, y + 0.02, w * 0.5, h * 0.22, 0.012); g.fill();
    g.fillStyle = "#555"; for (const [a, b] of [[0.03, 0.03], [w - 0.03, h - 0.03]]) { g.beginPath(); g.arc(x + a, y + b, 0.006, 0, Math.PI * 2); g.fill(); }
  }

  /* Kletterrose (Frühling/Sommer): wächst am Sockel aus dem Boden und
     rankt am Erdgeschoss bis unter die Auskragung. nurStamm: der Teil am
     Sockel – kräftige, verholzte Triebe, wenig Laub. */
  function kletterrose(g, F, x0, yBoden, hoehe, breite, saat, nurStamm) {
    const rng = zufall(saat), px = F.px;
    g.save();
    g.lineCap = "round";
    if (nurStamm) {
      g.strokeStyle = "rgb(86,66,42)";
      for (let i = 0; i < 3; i++) {
        const xe = x0 - 0.075 + i * 0.075;
        g.lineWidth = 0.03 - i * 0.004;
        g.beginPath(); g.moveTo(x0 + (i - 1) * 0.02, yBoden); g.bezierCurveTo(x0 + (rng() - 0.5) * 0.1, yBoden - hoehe * 0.4, xe + (rng() - 0.5) * 0.08, yBoden - hoehe * 0.7, xe, yBoden - hoehe); g.stroke();
      }
      if (px > 6) for (let k = 0; k < 16; k++) {
        const y = yBoden - hoehe * (0.3 + rng() * 0.7), x = x0 + (rng() - 0.5) * 0.3, r = 0.03 + rng() * 0.02;
        g.fillStyle = rgb([44 + rng() * 26, 90 + rng() * 36, 38 + rng() * 18]);
        g.beginPath(); g.ellipse(x, y, r * 1.3, r * 0.8, rng() * Math.PI, 0, Math.PI * 2); g.fill();
      }
      g.restore();
      return;
    }
    const triebe = [];
    for (let i = 0; i < 6; i++) {
      let x = x0 + (i - 2.5) * 0.03, y = yBoden;
      const pts = [[x, y]];
      const ziel = yBoden - hoehe * (0.6 + rng() * 0.4);
      let dx = (rng() - 0.5) * 0.4;
      while (y > ziel) { y -= 0.16; dx += (rng() - 0.5) * 0.25; dx = klemm(dx, -0.6, 0.6); x += dx * 0.16 + (rng() - 0.5) * 0.04; x = klemm(x, x0 - breite / 2, x0 + breite / 2); pts.push([x, y]); }
      triebe.push(pts);
    }
    g.strokeStyle = "rgb(82,64,40)";
    for (const t of triebe) { g.lineWidth = 0.022; g.beginPath(); g.moveTo(t[0][0], t[0][1]); for (let i = 1; i < t.length; i++) g.quadraticCurveTo(t[i - 1][0], t[i - 1][1], (t[i - 1][0] + t[i][0]) / 2, (t[i - 1][1] + t[i][1]) / 2); g.stroke(); }
    if (px < 6) { g.restore(); return; }
    for (const t of triebe) {
      for (let i = 1; i < t.length; i++) {
        const [x, y] = t[i];
        const oben = (yBoden - y) / hoehe;
        for (let k = 0; k < 4; k++) {
          const lx = x + (rng() - 0.5) * 0.24, ly = y + (rng() - 0.5) * 0.16, r = 0.035 + rng() * 0.025;
          g.fillStyle = rgb([40 + rng() * 30, 86 + rng() * 40, 36 + rng() * 20]);
          g.beginPath(); g.ellipse(lx, ly, r * 1.3, r * 0.8, rng() * Math.PI, 0, Math.PI * 2); g.fill();
        }
        if (rng() < 0.35 + oben * 0.4) {
          const bx = x + (rng() - 0.5) * 0.2, by = y + (rng() - 0.5) * 0.12, r = 0.035 + rng() * 0.02;
          const rot = rng() < 0.6 ? [206, 38, 66] : [236, 120, 150];
          g.fillStyle = rgb(hell(rot, -0.2)); g.beginPath(); g.arc(bx, by, r, 0, Math.PI * 2); g.fill();
          g.fillStyle = rgb(rot); g.beginPath(); g.arc(bx - r * 0.15, by - r * 0.15, r * 0.72, 0, Math.PI * 2); g.fill();
          if (px > 40) { g.strokeStyle = rgb(hell(rot, -0.35), 0.7); g.lineWidth = 0.004; g.beginPath(); g.arc(bx - r * 0.1, by - r * 0.1, r * 0.35, 0.5, 5); g.stroke(); }
        }
      }
    }
    g.restore();
  }

  /* =====================================================================
     BLUMENKASTEN (echter Körper) mit Pflanzen als aufrechte Figur
     XANDER: „Blumenkästen auf dem Fensterbrett" · „Ich möchte einen
     Liebreiz zur Weihnachtsdeko … mit Schmücken, mit Schnee"
     Die Pflanzen werden im Bild gemalt (Figur): jede Wurzel sitzt an
     ihrem echten Ort im Kasten und wird mit dem Blickwinkel projiziert –
     so ist der Kasten aus JEDEM Winkel bepflanzt, auch fast von der Kante
     gesehen (vorher lag das Grün auf einer Fläche parallel zur Wand und
     verschwand in der Kantenansicht).
     Winter: 40–60 Tannenzweige je Meter in drei Tönen (hinten dunkel,
     Mitte, helle Spitzen), überlappend und über die Kastenkante hängend,
     Schneehauben, zwei rote Schleifen, Kugeln rot und gold mit Glanz,
     Zapfen. Frühling: Geranien in Dolden, Hängepflanzen in zwei Farben.
     ===================================================================== */
  function schleife(g, L, sx, sy, s) {
    g.fillStyle = L([186, 22, 32]);
    g.beginPath(); g.moveTo(sx, sy); g.bezierCurveTo(sx - 0.09 * s, sy - 0.08 * s, sx - 0.1 * s, sy + 0.04 * s, sx, sy); g.fill();
    g.beginPath(); g.moveTo(sx, sy); g.bezierCurveTo(sx + 0.09 * s, sy - 0.08 * s, sx + 0.1 * s, sy + 0.04 * s, sx, sy); g.fill();
    g.fillStyle = L([150, 16, 26]);
    g.beginPath(); g.moveTo(sx - 0.006 * s, sy); g.lineTo(sx - 0.04 * s, sy + 0.12 * s); g.lineTo(sx - 0.02 * s, sy + 0.115 * s); g.lineTo(sx + 0.004 * s, sy); g.fill();
    g.beginPath(); g.moveTo(sx + 0.006 * s, sy); g.lineTo(sx + 0.045 * s, sy + 0.11 * s); g.lineTo(sx + 0.025 * s, sy + 0.12 * s); g.lineTo(sx - 0.004 * s, sy); g.fill();
    g.fillStyle = L([130, 12, 22]); g.beginPath(); g.arc(sx, sy, 0.018 * s, 0, Math.PI * 2); g.fill();
    if (s > 60) { g.strokeStyle = L([235, 90, 96], 0.6); g.lineWidth = Math.max(0.6, 0.006 * s); g.beginPath(); g.moveTo(sx - 0.07 * s, sy - 0.035 * s); g.quadraticCurveTo(sx - 0.04 * s, sy - 0.06 * s, sx - 0.015 * s, sy - 0.01 * s); g.moveTo(sx + 0.07 * s, sy - 0.035 * s); g.quadraticCurveTo(sx + 0.04 * s, sy - 0.06 * s, sx + 0.015 * s, sy - 0.01 * s); g.stroke(); }
  }
  /* Tannenzweig im Bild: gebogene Achse (Wurzel → Spitze), Nadeln paarweise
     schräg nach vorn. Alle Zweige einer Tonlage kommen in EINEN Pfad. */
  function zweigPfad(g, r, k, t, nl, n) {
    g.moveTo(r[0], r[1]); g.quadraticCurveTo(k[0], k[1], t[0], t[1]);
    for (let i = 1; i <= n; i++) {
      const u = i / (n + 0.5), v = 1 - u;
      const bx = v * v * r[0] + 2 * v * u * k[0] + u * u * t[0], by = v * v * r[1] + 2 * v * u * k[1] + u * u * t[1];
      const dx = 2 * v * (k[0] - r[0]) + 2 * u * (t[0] - k[0]), dy = 2 * v * (k[1] - r[1]) + 2 * u * (t[1] - k[1]);
      const a = Math.atan2(dy, dx), l = nl * (1.15 - u * 0.5);
      g.moveTo(bx, by); g.lineTo(bx + Math.cos(a + 0.95) * l, by + Math.sin(a + 0.95) * l);
      g.moveTo(bx, by); g.lineTo(bx + Math.cos(a - 0.95) * l, by + Math.sin(a - 0.95) * l);
    }
  }
  function pflanzenFigur(B, R, a0, a1, k0, art, saat, pal) {
    const fuss = R.p((a0 + a1) / 2, k0, 0.13);
    return function (g, s, F) {
      if (F.schatten) return;
      const L = figurLicht(F), rng = zufall(saat);
      const P = (a, h, d) => { const q = R.p(a, h, d); return bildVersatz(B, s, [q[0] - fuss[0], q[1] - fuss[1], q[2] - fuss[2]]); };
      const lang = a1 - a0;
      g.save(); g.lineCap = "round"; g.lineJoin = "round";
      if (s < 14) {
        /* weit weg: ein grünes Polster mit Schnee bzw. Blütenpunkten */
        const p0 = P(a0 + 0.02, k0, 0.13), p1 = P(a1 - 0.02, k0, 0.13), h = 0.16 * ST.KZ * s;
        g.beginPath(); g.moveTo(p0[0], p0[1] + 1); g.lineTo(p0[0], p0[1] - h * 0.7); g.quadraticCurveTo((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 - h * 1.3, p1[0], p1[1] - h * 0.7); g.lineTo(p1[0], p1[1] + 1); g.closePath();
        g.fillStyle = L(art === "winter" ? [34, 62, 42] : [58, 100, 48]); g.fill();
        if (art === "winter") { g.fillStyle = L([240, 244, 250], 0.85); g.beginPath(); g.moveTo(p0[0], p0[1] - h * 0.7); g.quadraticCurveTo((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 - h * 1.3, p1[0], p1[1] - h * 0.7); g.quadraticCurveTo((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 - h * 0.95, p0[0], p0[1] - h * 0.7); g.fill(); }
        else { g.fillStyle = L(pal[0]); for (let i = 0; i < 5; i++) { const t = (i + 0.5) / 5; g.fillRect(p0[0] + (p1[0] - p0[0]) * t - 0.8, p0[1] + (p1[1] - p0[1]) * t - h * 0.9, 1.6, 1.6); } }
        g.restore(); return;
      }
      if (art === "winter") {
        const nl = 0.034 * s, lw = Math.max(0.7, 0.011 * s), nw = Math.max(0.5, 0.0055 * s);
        const nNad = s > 30 ? 7 : 4;
        const hinten = [], mitte = [], vorn = [], haube = [];
        const n = Math.round(lang * 52);
        for (let i = 0; i < n; i++) {
          const a = a0 + 0.03 + rng() * (lang - 0.06), d = 0.04 + rng() * 0.16;
          const lean = (rng() - 0.5) * 1.7, len = 0.1 + rng() * 0.15, tilt = (rng() - 0.3) * 0.9;
          const r = P(a, k0 - 0.01, d), t = P(a + Math.sin(lean) * len, k0 + Math.cos(lean) * len * 0.85, d + Math.sin(tilt) * len * 0.5);
          const k = P(a + Math.sin(lean) * len * 0.4, k0 + Math.cos(lean) * len * 0.62, d + Math.sin(tilt) * len * 0.15);
          (d < 0.11 ? hinten : mitte).push([r, k, t, d]);
          if (rng() < 0.45) haube.push([t[0] * 0.7 + k[0] * 0.3, t[1] * 0.7 + k[1] * 0.3 - nl * 0.25, 0.028 * s * (0.7 + rng() * 0.6)]);
        }
        /* über die Vorderkante hängende Zweige */
        for (let i = 0; i < Math.round(lang * 26); i++) {
          const a = a0 + 0.01 + rng() * (lang - 0.02), len = 0.08 + rng() * 0.13, sd = (rng() - 0.5) * 0.16;
          vorn.push([P(a, k0 - 0.005, 0.225), P(a + sd * 0.4, k0 + 0.01, 0.29), P(a + sd, k0 - len, 0.27)]);
        }
        mitte.sort((x, y) => x[3] - y[3]);
        const lage = (liste, farbe, spitze) => {
          g.beginPath(); for (const z of liste) zweigPfad(g, z[0], z[1], z[2], nl, nNad);
          g.lineWidth = nw; g.strokeStyle = L(farbe); g.stroke();
          g.beginPath(); for (const z of liste) { g.moveTo(z[0][0], z[0][1]); g.quadraticCurveTo(z[1][0], z[1][1], z[2][0], z[2][1]); }
          g.lineWidth = lw; g.strokeStyle = L(hell(farbe, -0.25)); g.stroke();
          if (spitze && s > 22) {
            /* helle junge Triebspitzen */
            g.beginPath(); for (const z of liste) { const dx = z[2][0] - z[1][0], dy = z[2][1] - z[1][1]; g.moveTo(z[2][0] - dx * 0.35, z[2][1] - dy * 0.35); g.lineTo(z[2][0], z[2][1]); }
            g.lineWidth = lw * 1.4; g.strokeStyle = L([77, 122, 79]); g.stroke();
          }
        };
        lage(hinten, [31, 61, 42], false);
        lage(mitte, [47, 90, 58], true);
        /* Schneehauben auf den Zweigen */
        g.beginPath(); for (const [x, y, r] of haube) { g.moveTo(x + r, y); g.ellipse(x, y, r, r * 0.42, 0, 0, Math.PI, true); g.closePath(); }
        g.fillStyle = L([244, 247, 252], 0.95); g.fill();
        lage(vorn, [40, 78, 50], true);
        /* Zapfen, Kugeln, Schleifen */
        if (s > 22) {
          for (let i = 0; i < 2; i++) {
            const c = P(a0 + lang * (0.3 + 0.45 * i) + (rng() - 0.5) * 0.06, k0 - 0.03, 0.27);
            g.fillStyle = L([104, 68, 40]); g.beginPath(); g.ellipse(c[0], c[1] + 0.03 * s, 0.02 * s, 0.034 * s, 0.25, 0, Math.PI * 2); g.fill();
            if (s > 40) { g.strokeStyle = L([66, 40, 22], 0.8); g.lineWidth = Math.max(0.5, 0.004 * s); g.beginPath(); for (let k = -1; k <= 1; k++) { g.moveTo(c[0] - 0.018 * s, c[1] + (0.03 + k * 0.012) * s); g.lineTo(c[0] + 0.018 * s, c[1] + (0.036 + k * 0.012) * s); } g.stroke(); }
          }
          const kn = 2 + (rng() < 0.5 ? 1 : 0);
          for (let i = 0; i < kn; i++) {
            const c = P(a0 + lang * (0.2 + 0.6 * i / Math.max(1, kn - 1)) + (rng() - 0.5) * 0.05, k0 - 0.06 - rng() * 0.05, 0.27), r = 0.028 * s;
            const gold = i % 2 === 1;
            g.strokeStyle = L([150, 130, 90]); g.lineWidth = Math.max(0.5, 0.003 * s); g.beginPath(); g.moveTo(c[0], c[1] - r - 0.04 * s); g.lineTo(c[0], c[1] - r); g.stroke();
            const kg = g.createRadialGradient(c[0] - r * 0.35, c[1] - r * 0.35, r * 0.1, c[0], c[1], r);
            const kf = gold ? [214, 168, 62] : [190, 22, 34];
            kg.addColorStop(0, L(hell(kf, 0.35))); kg.addColorStop(0.6, L(kf)); kg.addColorStop(1, L(hell(kf, -0.45)));
            g.fillStyle = kg; g.beginPath(); g.arc(c[0], c[1], r, 0, Math.PI * 2); g.fill();
            g.fillStyle = L([255, 255, 255], 0.85); g.beginPath(); g.arc(c[0] - r * 0.35, c[1] - r * 0.4, r * 0.18, 0, Math.PI * 2); g.fill();
          }
          for (const t of [0.2, 0.8]) { const c = P(a0 + lang * t, k0 - 0.015, 0.265); schleife(g, L, c[0], c[1], s * 1.05); }
        }
      } else {
        const hauptfarbe = pal[0], zweite = pal[1] || pal[0], dritte = pal[2] || zweite;
        const r0 = 0.034 * s;
        /* Geranienlaub: runde, gelappte Blätter in drei Tönen, hinten dunkler */
        const blaetter = [[], [], []];
        for (let i = 0; i < Math.round(lang * 34); i++) {
          const a = a0 + 0.03 + rng() * (lang - 0.06), d = 0.04 + rng() * 0.18, h = k0 + 0.01 + rng() * 0.14;
          const p = P(a, h, d);
          blaetter[d < 0.09 ? 0 : d < 0.16 ? 1 : 2].push([p[0], p[1], r0 * (0.8 + rng() * 0.5)]);
        }
        const toene = [[40, 78, 38], [58, 104, 48], [78, 128, 60]];
        blaetter.forEach((liste, k) => {
          g.beginPath(); for (const [x, y, r] of liste) { g.moveTo(x + r, y); g.arc(x, y, r, 0, Math.PI * 2); }
          g.fillStyle = L(toene[k]); g.fill();
          if (s > 30) { g.beginPath(); for (const [x, y, r] of liste) { g.moveTo(x + r * 0.55, y); g.arc(x, y, r * 0.55, 0, Math.PI * 2); } g.strokeStyle = L(hell(toene[k], -0.3), 0.5); g.lineWidth = Math.max(0.5, 0.004 * s); g.stroke(); }
        });
        /* Dolden: Stiel, dann ein Ball aus Einzelblüten */
        const dolden = [];
        for (let i = 0; i < Math.round(lang * 9) + 1; i++) {
          const a = a0 + 0.06 + rng() * (lang - 0.12), d = 0.05 + rng() * 0.14;
          dolden.push([P(a, k0 + 0.1, d), P(a + (rng() - 0.5) * 0.04, k0 + 0.2 + rng() * 0.08, d), rng() < 0.72 ? hauptfarbe : zweite]);
        }
        g.beginPath(); for (const [f0, f1] of dolden) { g.moveTo(f0[0], f0[1]); g.lineTo(f1[0], f1[1]); }
        g.strokeStyle = L([70, 110, 50]); g.lineWidth = Math.max(0.6, 0.006 * s); g.stroke();
        for (const farbe of [hauptfarbe, zweite]) {
          const liste = dolden.filter((x) => x[2] === farbe);
          if (!liste.length) continue;
          g.beginPath();
          for (const [, c] of liste) for (let k = 0; k < 9; k++) { const x = c[0] + (rng() - 0.5) * 0.07 * s, y = c[1] + (rng() - 0.5) * 0.05 * s, r = (0.014 + rng() * 0.008) * s; g.moveTo(x + r, y); g.arc(x, y, r, 0, Math.PI * 2); }
          g.fillStyle = L(farbe); g.fill();
          if (s > 30) { g.beginPath(); for (const [, c] of liste) { g.moveTo(c[0] + 0.012 * s, c[1] + 0.006 * s); g.arc(c[0], c[1] + 0.006 * s, 0.012 * s, 0, Math.PI * 2); } g.fillStyle = L(hell(farbe, -0.35), 0.6); g.fill(); }
        }
        /* Hängepflanzen über die Kante */
        const ranken = [];
        for (let i = 0; i < Math.round(lang * 12); i++) {
          const a = a0 + rng() * lang, len = 0.08 + rng() * 0.15, sd = (rng() - 0.5) * 0.14;
          ranken.push([P(a, k0 - 0.005, 0.225), P(a + sd * 0.3, k0 + 0.01, 0.28), P(a + sd, k0 - len, 0.27), rng() < 0.6 ? dritte : zweite]);
        }
        g.beginPath(); for (const [r, k, t] of ranken) { g.moveTo(r[0], r[1]); g.quadraticCurveTo(k[0], k[1], t[0], t[1]); }
        g.strokeStyle = L([60, 100, 44]); g.lineWidth = Math.max(0.6, 0.006 * s); g.stroke();
        g.beginPath(); for (const [r, , t] of ranken) for (let k = 1; k <= 3; k++) { const u = k / 3.5, x = r[0] + (t[0] - r[0]) * u, y = r[1] + (t[1] - r[1]) * u; g.moveTo(x + 0.02 * s, y); g.ellipse(x, y, 0.02 * s, 0.012 * s, 0.4, 0, Math.PI * 2); }
        g.fillStyle = L([56, 100, 42]); g.fill();
        for (const farbe of [dritte, zweite]) {
          g.beginPath(); for (const [, , t, f] of ranken) if (f === farbe) { const r = 0.022 * s; g.moveTo(t[0] + r, t[1]); g.arc(t[0], t[1], r, 0, Math.PI * 2); }
          g.fillStyle = L(farbe); g.fill();
        }
      }
      g.restore();
    };
  }
  /* Blumenkasten an einer Wand (Rahmen R, Öffnung o in Wandkoordinaten):
     hängt vor dem Brustriegel, Oberkante knapp unter der Fensterbank. Jeder
     Kasten ist ein eigenes Teil – aus der Kantenansicht verdeckt dann der
     nähere Kasten den ferneren richtig. */
  function fensterVorbau(M, B, W, R, o, S, winter, art, saat, V, mitteBasis) {
    if (!art) return;
    const a0 = o.a0, a1 = o.a1, hf = o.h0, am = (a0 + a1) / 2;
    M.teil(W.name + "-kasten" + am.toFixed(2), { mitte: add(mitteBasis, mul(W.A, (am - W.L / 2) * 0.02)), schatten: false });
    const kf = hex(S.kasten || "#4d3a2a");
    const kastenMal = (g, F) => {
      const gr = g.createLinearGradient(0, 0, 0, F.h);
      gr.addColorStop(0, rgb(hell(kf, 0.12))); gr.addColorStop(1, rgb(hell(kf, -0.18)));
      g.fillStyle = gr; g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04);
      if (F.px > 12) {
        g.beginPath(); for (let i = 1; i < 3; i++) g.rect(0, F.h * i / 3, F.w, 0.006);
        g.fillStyle = rgb(hell(kf, -0.35)); g.fill();
        rausch(g, 0, 0, F.w, F.h, 0.6, 0.18, saat + 3, 3);
      }
    };
    const k0 = hf - 0.07, k1 = k0 - 0.19;
    kasten(M, R, a0 + 0.02, a1 - 0.02, k1, k0, 0.03, 0.23, {
      oben: (g, F) => { g.fillStyle = winter ? "rgb(235,240,248)" : "rgb(62,44,30)"; g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04); },
      vorn: winter ? (g, F) => { kastenMal(g, F); g.fillStyle = "rgb(243,247,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.02); } : kastenMal,
      links: kastenMal, rechts: kastenMal
    }, { ebene: 1, vornEbene: 2, seitenEbene: 2, name: "kasten" });
    const pal = (V && V.blumen) || [[214, 30, 42], [236, 110, 140], [245, 240, 235]];
    const f = R.p(am, k0, 0.13);
    M.figur({ x: f[0], y: f[1], z: f[2], breite: a1 - a0 + 0.4, hoehe: 0.5, schatten: false, malen: pflanzenFigur(B, R, a0, a1, k0, art, saat, pal) });
  }
  /* =====================================================================
     DACH: Ziegel, Schnee mit dickem Rand, Rinne, Eiszapfen, Lichterkette
     ===================================================================== */
  /* abgerundetes Rechteck an den aktuellen Pfad anhängen (ohne beginPath) */
  function rundPfad(g, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
    g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r);
    g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
  }
  /* Schnee auf der Hauptfläche. XANDER: „mit Schnee" – aber kein
     Styropor: Am First weht der Wind ihn weg; 0,25–0,5 m sieht man die
     roten Biberreihen, Schnee liegt dort nur in den Absätzen. Darunter die
     geschlossene Decke mit gerundeter, heller Abbruchkante: bläuliche
     Mulden, weiße Kuppen, Ziegelreihen als Rippen, zwischen den Sparren
     über warmen Stuben etwas getaut, Wehen an Kamin und Gauben. */
  function dachSchnee(g, F, w, h, yEnde, saat, oben, zusatz) {
    const rng = zufall(saat * 7 + 3), px = F.px, pxV = F.pxV || px;
    /* Grenze der geschlossenen Decke: in Zungen fast bis an den First, in
       Buchten bis 0,65 m darunter – nie ein gleichmäßiger Streifen */
    const grenze = (x) => klemm((0.05 + (ST.fbm(x * 0.42 + saat * 0.7, saat * 0.31, 3, saat) - 0.3) * 1.5) * oben / 0.36 + Math.sin(x * 1.7 + saat) * 0.03, 0.03, 0.85);
    const kante = []; for (let x = -0.1; x <= w + 0.15; x += 0.1) kante.push([x, grenze(x)]);
    /* 1. freie Ziegel: feiner Reif, Schnee in den Absätzen der Reihen */
    g.fillStyle = "rgba(226,232,242,0.2)"; g.fillRect(-0.1, -0.1, w + 0.2, oben + 0.45);
    if (pxV * ZR > 2.5) {
      g.beginPath();
      for (let k = 0; ; k++) {
        const yu = h + yEnde - k * ZR;
        if (yu < 0.01) break;
        if (yu > oben + 0.4) continue;
        let x = -0.1 - rng() * 0.2;
        while (x < w) {
          const len = 0.05 + Math.pow(rng(), 2) * 0.7, gap = 0.03 + Math.pow(rng(), 1.5) * 0.5, d = 0.012 + rng() * 0.03;
          if (yu < grenze(x) + 0.06 && rng() < 0.8) rundPfad(g, x, yu - d, len, d + 0.008, d * 0.5);
          x += len + gap;
        }
      }
      g.fillStyle = "rgba(240,244,250,0.93)"; g.fill();
    }
    /* 2. geschlossene Decke */
    g.save();
    g.beginPath(); g.moveTo(-0.1, h + 0.1); for (const [x, y] of kante) g.lineTo(x, y); g.lineTo(w + 0.15, h + 0.1); g.closePath(); g.clip();
    schneeFlaeche(g, F, -0.1, 0, w + 0.25, h + 0.1, saat, { glitzer: false, zwischen: () => schneeRippen(g, F, w, h, yEnde, oben + 0.2, saat) });
    /* Sparren zeichnen sich ab: dazwischen weiche, längliche Tauzonen */
    if (zusatz.sparren && px > 6) {
      const sp = zusatz.sparren, v0 = oben + 0.35, v1 = h - 0.3;
      for (let j = 0; j + 1 < sp.length; j++) {
        const a = Math.min(sp[j], sp[j + 1]), b = Math.max(sp[j], sp[j + 1]);
        const st = rng() < 0.35 ? 0.04 : 0.08 + rng() * 0.08;
        const cx = (a + b) / 2, cy = (v0 + v1) / 2, rx = (b - a) * 0.5, ry = (v1 - v0) * 0.5;
        const gr = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
        gr.addColorStop(0, "rgba(146,164,204," + st.toFixed(3) + ")"); gr.addColorStop(0.6, "rgba(146,164,204," + (st * 0.6).toFixed(3) + ")"); gr.addColorStop(1, "rgba(146,164,204,0)");
        g.save(); g.translate(cx, cy); g.scale(1, ry / rx); g.translate(-cx, -cy); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, rx, 0, Math.PI * 2); g.fill(); g.restore();
      }
    }
    /* 3. Mulden (bläulicher Umgebungsschatten) und Wehen (0,45 Deckkraft) */
    const blob = (cx, cy, rx, ry, farbe, a) => {
      const gg = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
      gg.addColorStop(0, "rgba(" + farbe + "," + a + ")"); gg.addColorStop(0.55, "rgba(" + farbe + "," + (a * 0.5) + ")"); gg.addColorStop(1, "rgba(" + farbe + ",0)");
      g.save(); g.translate(cx, cy); g.scale(1, ry / rx); g.translate(-cx, -cy); g.fillStyle = gg; g.beginPath(); g.arc(cx, cy, rx, 0, Math.PI * 2); g.fill(); g.restore();
    };
    if (zusatz.kamin) {
      const [kxF, kyF] = zusatz.kamin;
      blob(kxF, kyF + 0.15, 1.0, 0.8, "104,124,178", 0.38);
      blob(kxF, kyF - 0.7, 0.85, 0.34, "252,253,255", 0.5);
    }
    for (const q of zusatz.gauben || []) {
      const cx = (q.x0 + q.x1) / 2;
      blob(cx, q.y0 + 0.05, (q.x1 - q.x0) / 2 + 0.5, 0.5, "104,124,178", 0.34);
      for (const sx of [q.x0 - 0.04, q.x1 + 0.04]) {
        const d = sx < cx ? -0.4 : 0.4, gg = g.createLinearGradient(sx + d, 0, sx, 0);
        gg.addColorStop(0, "rgba(104,124,178,0)"); gg.addColorStop(1, "rgba(104,124,178,0.36)");
        g.fillStyle = gg; g.fillRect(Math.min(sx, sx + d), q.y0, 0.4, q.y1 - q.y0);
      }
      blob(cx, q.y0 - 0.14, (q.x1 - q.x0) / 2 + 0.35, 0.3, "252,253,255", 0.5);
    }
    g.restore();
    /* 4. gerundete Abbruchkante der Decke: helle Lichtkante, darunter ein
       Hauch Schatten (die Decke hat Dicke) */
    g.lineJoin = "round"; g.lineCap = "round";
    g.beginPath(); kante.forEach(([x, y], i) => (i ? g.lineTo(x, y + 0.04) : g.moveTo(x, y + 0.04)));
    g.strokeStyle = "rgba(140,158,200,0.28)"; g.lineWidth = Math.max(0.035, 1.2 / px); g.stroke();
    g.beginPath(); kante.forEach(([x, y], i) => (i ? g.lineTo(x, y + 0.01) : g.moveTo(x, y + 0.01)));
    g.strokeStyle = "rgba(250,252,255,0.95)"; g.lineWidth = Math.max(0.025, 1.0 / px); g.stroke();
    /* 5. Glitzer nur auf der Sonnenseite */
    if (F.licht > 0.3) glitzer(g, F, 0, oben, w, h - oben, 5, rng);
  }
  /* Ziegelreihen unter dem Schnee: jede Reihe eine weiche Stufe – oben
     eine Lichtkante (Deckkraft 0,28), darunter ein 4–5 cm breiter, blauer
     Schatten (0,3). Alle Reihen in zwei Pfaden (oben kräftiger, zur
     Traufe hin schwächer: dort liegt mehr Schnee). */
  function schneeRippen(g, F, w, h, yEnde, ab, saat) {
    const pxV = F.pxV || F.px;
    if (pxV * ZR < 2.2) return;
    const rng = zufall(saat * 3 + 1);
    const st = klemm((pxV * ZR - 2.2) / 3, 0.35, 1);
    /* jede Reihe in Stücke von 0,6–3 m zerlegt, jedes mit eigener Stärke
       (oder ganz zugeweht) – sonst wirkt es wie Wellblech */
    const reihen = [[], [], []];
    for (let k = 1; ; k++) {
      const yu = h + yEnde - k * ZR;
      if (yu < ab) break;
      if (yu > h - 0.03) continue;
      const t = klemm((yu + (yEnde ? 0 : LM)) / (LM + LA), 0, 1);
      let x = -0.1 - rng() * 0.5;
      while (x < w + 0.1) {
        const l = 0.6 + rng() * 2.4, q = rng() + t * 0.35;
        if (q < 0.9) {
          /* Stück mit spitz auslaufenden Enden (Linse statt Strich): der
             dritte Wert ist die Dicke 0…1 entlang des Stücks */
          const pts = [], n = Math.max(4, Math.round(l / 0.25));
          for (let i = 0; i <= n; i++) { const u = i / n; pts.push([x + l * u, yu + (rng() - 0.5) * 0.02, Math.pow(Math.sin(Math.PI * u), 0.6)]); }
          reihen[q < 0.3 ? 0 : q < 0.6 ? 1 : 2].push(pts);
        }
        x += l;
      }
    }
    const band = (liste, d0, d1) => {
      g.beginPath();
      for (const P of liste) {
        g.moveTo(P[0][0], P[0][1] + d0 * P[0][2]);
        for (let i = 1; i < P.length; i++) g.lineTo(P[i][0], P[i][1] + d0 * P[i][2]);
        for (let i = P.length - 1; i >= 0; i--) g.lineTo(P[i][0], P[i][1] + d1 * P[i][2]);
        g.closePath();
      }
    };
    reihen.forEach((liste, k) => {
      if (!liste.length) return;
      const m = st * [1, 0.65, 0.35][k];
      band(liste, -0.024, 0); g.fillStyle = "rgba(255,255,255," + (0.26 * m).toFixed(3) + ")"; g.fill();
      band(liste, 0, 0.048); g.fillStyle = "rgba(112,130,184," + (0.15 * m).toFixed(3) + ")"; g.fill();
      band(liste, 0, 0.022); g.fillStyle = "rgba(112,130,184," + (0.14 * m).toFixed(3) + ")"; g.fill();
    });
  }
  /* Knick zum Aufschiebling: statt einer harten Linie ein 0,3 m weicher
     Helligkeitswechsel – die hellere Fläche wird zur Kante hin so weit
     abgedunkelt, dass sie dort genau wie die andere Fläche aussieht. */
  function knickWeich(g, F, B, w, h, nAnders, obenKante) {
    if (!B || !B.e) return;
    const nA = [nAnders[0] * B.c - nAnders[1] * B.s, nAnders[0] * B.s + nAnders[1] * B.c, nAnders[2]];
    const l1 = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr), l2 = ST.lichtFaktor(nA, F.zeit, 0, F.jahr);
    const r = [0, 1, 2].map((i) => Math.min(1, l2[i] / Math.max(0.01, l1[i])));
    if (r[0] + r[1] + r[2] > 2.985) return;
    const y0 = obenKante ? 0 : h, y1 = obenKante ? 0.32 : h - 0.32;
    const gr = g.createLinearGradient(0, y0, 0, y1);
    gr.addColorStop(0, rgb(r.map((v) => v * 255))); gr.addColorStop(1, "rgb(255,255,255)");
    g.save(); g.globalCompositeOperation = "multiply"; g.fillStyle = gr; g.fillRect(-0.05, Math.min(y0, y1) - 0.01, w + 0.1, 0.34); g.restore();
  }
  /* Es schneit an: zuerst bleibt der Schnee auf den Ziegelabsätzen
     liegen (weiße Reihenstreifen, Ziegel dazwischen noch rot), erst
     danach schließt sich die Decke – kein gleichmäßiger rosa Schleier.
     Die geschlossene Decke kommt ab deck 0,45 mit steigender Deckkraft. */
  function schneeAnsatz(g, F, w, h, yEnde, deck, saat) {
    const a = klemm(deck / 0.55, 0, 1), px = F.pxV || F.px;
    const hS = ZR_ * (0.18 + 0.62 * a), rs = zufall(saat + 71);
    g.fillStyle = "rgba(242,246,252," + (0.08 + 0.2 * a).toFixed(3) + ")"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
    if (px * ZR_ < 2.5) { g.fillStyle = "rgba(242,246,252," + (0.5 * a).toFixed(3) + ")"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1); return; }
    for (let k = 0; ; k++) {
      const yu = h + yEnde - k * ZR_;
      if (yu < -0.02) break;
      if (yu - ZR_ > h + 0.05) continue;
      const gr = g.createLinearGradient(0, yu - hS - 0.02, 0, yu);
      gr.addColorStop(0, "rgba(244,247,252,0)"); gr.addColorStop(0.35, "rgba(244,247,252," + (0.55 + 0.4 * a).toFixed(3) + ")"); gr.addColorStop(1, "rgba(236,241,250," + (0.7 + 0.3 * a).toFixed(3) + ")");
      g.fillStyle = gr; g.fillRect(-0.05, yu - hS - 0.02, w + 0.1, hS + 0.02);
      /* Lücken, wo der Wind den Absatz frei hält */
      if (px > 30 && a < 1) { g.fillStyle = "rgba(150,70,46,0.5)"; for (let x = rs() * 0.4; x < w; x += 0.2 + rs() * 0.6) { g.beginPath(); g.ellipse(x, yu - hS * 0.6, 0.04 + rs() * 0.08, hS * 0.3, 0, 0, Math.PI * 2); g.fill(); } }
    }
    /* große, vom Wind freigehaltene Flächen brechen die gleichmäßigen Streifen */
    if (a < 1) {
      g.fillStyle = "rgba(150,72,48," + (0.3 * (1 - a) + 0.08).toFixed(3) + ")";
      const n = Math.min(24, Math.ceil(w * h / 2.5));
      for (let i = 0; i < n; i++) { g.beginPath(); g.ellipse(rs() * w, rs() * h, 0.4 + rs() * 1.1, 0.15 + rs() * 0.35, (rs() - 0.5) * 0.4, 0, Math.PI * 2); g.fill(); }
    }
  }
  function dachMaler(o) {
    return function (g, F) {
      const w = F.w, h = F.h;
      const deck = o.deck == null ? 1 : o.deck;
      if (!o.winter || deck <= 0) {
        biberMalen(g, F, w, h, o.yEnde, o.saat, { moos: o.moos, alt: o.alt, streifen: o.streifen, moosStreifen: o.moosStreifen });
        wurfSchatten(g, F, o.koerper, "rgba(30,12,8,0.42)");
        if (o.anschluss) gaubenAnschluss(g, F, o.anschluss, false);
        if (o.fang != null) schneefang(g, F, o.B, w, o.fang, false);
        return;
      }
      /* Unter geschlossener Schneedecke keine Ziegel malen (Rechenzeit),
         außer während es noch schneit (deck < 1) */
      if (deck < 1) biberMalen(g, F, w, h, o.yEnde, o.saat, {});
      else if (o.haupt) biberMalen(g, F, w, h, o.yEnde, o.saat, { yBis: o.oben + 0.6 });
      if (deck < 1) schneeAnsatz(g, F, w, h, o.yEnde, deck, o.saat);
      g.save();
      g.globalAlpha = deck >= 1 ? 1 : klemm((deck - 0.45) / 0.55, 0, 1);
      if (o.haupt) dachSchnee(g, F, w, h, o.yEnde, o.saat, o.oben, o);
      else schneeFlaeche(g, F, -0.05, -0.05, w + 0.1, h + 0.1, o.saat + 5, { zwischen: () => schneeRippen(g, F, w, h, o.yEnde, 0, o.saat) });
      g.restore();
      if (deck >= 1 && o.knick) knickWeich(g, F, o.B, w, h, o.knick.n, o.knick.oben);
      wurfSchatten(g, F, o.koerper, "rgba(84,106,164,0.3)");
      if (o.anschluss) gaubenAnschluss(g, F, o.anschluss, true);
      if (o.fang != null) schneefang(g, F, o.B, w, o.fang, true);
    };
  }
  /* Anschluss der Gauben ans Hauptdach: 6 cm Blechkehle rundum und ein
     10 cm Umgebungsschatten – so wirkt der Körper aus jedem Winkel
     verbunden. q = { x0, x1, y0, y1 } in Dachflächen-Koordinaten. */
  function gaubenAnschluss(g, F, liste, winter) {
    if (F.px < 4) return;
    for (const q of liste) {
      const ao = winter ? "rgba(96,116,170," : "rgba(30,14,10,";
      for (const [x, d] of [[q.x0, -1], [q.x1, 1]]) {
        const gr = g.createLinearGradient(x, 0, x + d * 0.16, 0);
        gr.addColorStop(0, ao + "0.4)"); gr.addColorStop(1, ao + "0)");
        g.fillStyle = gr; g.fillRect(Math.min(x, x + d * 0.16), q.y0 - 0.05, 0.16, q.y1 - q.y0 + 0.05);
        if (!winter) { g.fillStyle = "rgb(150,158,163)"; g.fillRect(Math.min(x, x + d * 0.06), q.y0 - 0.03, 0.06, q.y1 - q.y0 + 0.03); g.fillStyle = "rgba(255,255,255,0.3)"; g.fillRect(Math.min(x, x + d * 0.06), q.y0 - 0.03, 0.06, 0.012); }
      }
      const gk = g.createLinearGradient(0, q.y0, 0, q.y0 - 0.14);
      gk.addColorStop(0, ao + "0.35)"); gk.addColorStop(1, ao + "0)");
      g.fillStyle = gk; g.fillRect(q.x0 - 0.1, q.y0 - 0.14, q.x1 - q.x0 + 0.2, 0.14);
      if (!winter) { g.fillStyle = "rgb(150,158,163)"; g.fillRect(q.x0 - 0.06, q.y0 - 0.06, q.x1 - q.x0 + 0.12, 0.06); }
    }
  }
  /* Schneefanggitter (verzinkt): Stützen etwa alle 0,9 m, zwei Rohre
     (Ø 3 cm, Stützen 2 cm) – mit echten Maßen, ohne Mindestbreite in
     Bildpunkten (sonst wird das Gitter beim Herauszoomen immer dicker und
     liest sich als Naht oder Leiter). Stattdessen blendet es mit dem Zoom
     aus: unter 8 Bildpunkten je Meter gar nicht, Schatten erst ab 20,
     Stützen erst ab 25. Es steht senkrecht auf der Dachfläche; wie hoch es
     herausragt, zeigt die Parallaxe. Im Winter staut sich der Schnee
     bergseitig bis fast an das obere Rohr. */
  function schneefang(g, F, B, w, yS, winter) {
    const px = F.px;
    if (px < 8 || !B || !B.e) return;
    const a = klemm((px - 8) / 16, 0, 1);
    const auf = (t) => parallaxe(F, B, -t);
    const T = 0.2;
    const p1 = auf(0.08), p2 = auf(0.17), pT = auf(T);
    const x0 = 0.12, x1 = w - 0.12;
    const xs = []; for (let x = 0.3; x < w - 0.15; x += 0.9) xs.push(x);
    g.save();
    g.globalAlpha = a; g.lineCap = "round";
    if (px > 20 && F.schatten) {
      const s1 = F.schatten(0.08), s2 = F.schatten(0.17), sT = F.schatten(T);
      g.strokeStyle = winter ? "rgba(84,106,164,0.3)" : "rgba(30,12,8,0.36)"; g.lineWidth = 0.03;
      g.beginPath();
      if (s1) { g.moveTo(x0 + s1[0], yS + s1[1]); g.lineTo(x1 + s1[0], yS + s1[1]); }
      if (s2) { g.moveTo(x0 + s2[0], yS + s2[1]); g.lineTo(x1 + s2[0], yS + s2[1]); }
      if (sT && px > 25) for (const x of xs) { g.moveTo(x, yS); g.lineTo(x + sT[0], yS + sT[1]); }
      g.stroke();
    }
    if (winter) {
      /* gestauter Schneewulst hinter dem Gitter: Stirn leicht bläulich, oben weiß */
      const pS = auf(0.15), rng = zufall(911);
      const kante = []; for (let x = x0; x <= x1 + 0.01; x += 0.3) kante.push([x + pS[0], yS + pS[1] + (rng() - 0.5) * 0.02]);
      g.fillStyle = "rgb(222,230,243)";
      g.beginPath(); g.moveTo(x0, yS); g.lineTo(x1, yS);
      for (let i = kante.length - 1; i >= 0; i--) g.lineTo(kante[i][0], kante[i][1]);
      g.closePath(); g.fill();
      const gr = g.createLinearGradient(0, yS - 0.7, 0, yS);
      gr.addColorStop(0, "rgba(250,252,255,0)"); gr.addColorStop(1, "rgba(250,252,255,0.9)");
      g.fillStyle = gr; g.fillRect(x0, yS - 0.7, x1 - x0, 0.7 + Math.min(0, pS[1]));
    }
    if (px > 25) {
      g.strokeStyle = "rgb(88,94,100)"; g.lineWidth = 0.02;
      g.beginPath(); for (const x of xs) { g.moveTo(x, yS); g.lineTo(x + pT[0], yS + pT[1]); } g.stroke();
    }
    g.lineWidth = 0.03;
    g.beginPath(); for (const p of [p1, p2]) { g.moveTo(x0 + p[0], yS + p[1]); g.lineTo(x1 + p[0], yS + p[1]); }
    g.strokeStyle = "rgb(118,124,130)"; g.stroke();
    if (px > 30) {
      g.lineWidth = 0.009;
      g.beginPath(); for (const p of [p1, p2]) { g.moveTo(x0 + p[0], yS + p[1] - 0.008); g.lineTo(x1 + p[0], yS + p[1] - 0.008); }
      g.strokeStyle = "rgba(220,226,232,0.8)"; g.stroke();
    }
    /* Schneehauben auf dem oberen Rohr */
    if (winter && px > 16) {
      const rng = zufall(47);
      g.strokeStyle = "rgb(248,250,254)"; g.lineWidth = 0.032;
      g.beginPath();
      let x = x0;
      while (x < x1) { const l = 0.2 + rng() * 0.9; g.moveTo(x + p2[0], yS + p2[1] - 0.02); g.lineTo(Math.min(x1, x + l) + p2[0], yS + p2[1] - 0.02); x += l + 0.05 + rng() * 0.4; }
      g.stroke();
    }
    g.restore();
  }
  /* Traufbrett / Ortbrett: gestrichenes Holz mit Profilkante */
  function brettMal(c, saat) {
    return function (g, F) {
      const w = F.w, h = F.h;
      g.fillStyle = rgb(c); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      const gr = g.createLinearGradient(0, 0, 0, Math.min(h, 0.25));
      gr.addColorStop(0, rgb(hell(c, 0.14))); gr.addColorStop(0.3, rgb(c)); gr.addColorStop(1, rgb(hell(c, -0.2)));
      g.fillStyle = gr; g.fillRect(-0.05, 0, w + 0.1, h);
      if (F.px > 14) rausch(g, 0, 0, w, h, 0.9, 0.2, saat, 3);
    };
  }
  /* Rinne (halbrund, Zink): Vorderseite mit Wulst, Rinnenhaken */
  function rinneVorn(saat, winter, rohr) {
    return function (g, F) {
      const w = F.w, h = F.h, z = [150, 158, 163];
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, rgb(hell(z, 0.4))); gr.addColorStop(0.12, rgb(hell(z, 0.1))); gr.addColorStop(0.2, rgb(hell(z, -0.15)));
      gr.addColorStop(0.35, rgb(hell(z, 0.12))); gr.addColorStop(0.75, rgb(hell(z, -0.12))); gr.addColorStop(1, rgb(hell(z, -0.3)));
      g.fillStyle = gr; g.fillRect(-0.05, -0.02, w + 0.1, h + 0.04);
      if (F.px > 10) {
        rausch(g, 0, 0, w, h, 1.2, 0.22, saat, 3);
        g.fillStyle = "rgba(40,42,46,0.85)";
        for (let x = 0.3; x < w; x += 0.9) { g.fillRect(x, -0.02, 0.022, 0.05); g.fillRect(x, h - 0.02, 0.022, 0.02); }
        /* Lötnähte */
        g.fillStyle = "rgba(90,95,100,0.5)";
        for (let x = 2.1; x < w; x += 2.0) g.fillRect(x, 0, 0.012, h);
      }
      for (const x of rohr || []) {
        g.fillStyle = rgb(hell(z, -0.2)); g.fillRect(x - 0.06, h * 0.5, 0.12, h * 0.5 + 0.02);
      }
      if (winter) { g.fillStyle = "rgb(243,247,252)"; g.fillRect(-0.05, -0.03, w + 0.1, 0.03); }
    };
  }
  /* Stirnkappe der Rinne: gewölbtes Zinkblech (Glanz oben, Schatten
     unten wie beim Fallrohr), im Winter mit einer kleinen Schneehaube */
  function rinneKappe(winter) {
    return function (g, F) {
      const w = F.w, h = F.h, z = [150, 158, 163];
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, rgb(hell(z, 0.3))); gr.addColorStop(0.3, rgb(z)); gr.addColorStop(1, rgb(hell(z, -0.35)));
      g.fillStyle = gr; g.fillRect(-0.02, -0.02, w + 0.04, h + 0.04);
      g.fillStyle = "rgba(40,44,48,0.5)"; g.fillRect(-0.02, -0.02, w + 0.04, 0.012);
      if (winter) { g.fillStyle = "rgb(243,247,252)"; g.beginPath(); g.moveTo(-0.02, -0.02); g.lineTo(w + 0.02, -0.02); g.lineTo(w + 0.02, 0.02); g.quadraticCurveTo(w / 2, 0.05, -0.02, 0.025); g.closePath(); g.fill(); }
    };
  }
  function rinneOben(winter) {
    return function (g, F) {
      if (winter) { schneeOben("rgb(240,244,250)")(g, F); return; }
      g.fillStyle = "rgb(58,62,66)"; g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04);
      g.fillStyle = "rgb(170,176,180)"; g.fillRect(-0.02, F.h - 0.03, F.w + 0.04, 0.03);
    };
  }
  /* Lichtfaktor einer Dachfläche (Modellnormale n) im aktuellen Blick –
     damit Wechte und Schneekante wie DIESELBE Schneedecke aussehen */
  function dachLicht(F, B, n) {
    if (!B || !B.e) return ST.lichtFaktor(F.n, F.zeit, 0.06, F.jahr);
    const nc = [n[0] * B.c - n[1] * B.s, n[0] * B.s + n[1] * B.c, n[2]];
    return ST.lichtFaktor(nc, F.zeit, 0, F.jahr);
  }
  const lichtMal = (lf) => (c, a, k) => rgb([Math.min(255, c[0] * lf[0] * (k || 1)), Math.min(255, c[1] * lf[1] * (k || 1)), Math.min(255, c[2] * lf[2] * (k || 1))], a);
  /* Schneewechte an der Traufe: dicke, gerundete Kante, die über die Rinne
     hängt – mit durchhängenden Buckeln (die Wechte sackt zwischen den
     Sparren durch) und zwei, drei Abbruchstellen, an denen ein Stück
     abgebrochen ist. Oben 4–8 % heller als die Dachfläche, zur Unterseite
     hin bläulich (Eigenschatten). Licht der zugehörigen Dachfläche (nDach),
     damit Wechte und Decke wie DIESELBE Schneedecke aussehen.
     mass: Größe der Buckel (Gaube: 0,5). */
  function schneeKante(saat, dick, tief, B, nDach, mass) {
    mass = mass || 1;
    return function (g, F) {
      const w = F.w, h = F.h, lf = dachLicht(F, B, nDach), L = lichtMal(lf), rng = zufall(saat);
      const brueche = [];
      for (let i = 0, nb = 2 + (rng() < 0.5 ? 1 : 0); i < nb; i++) brueche.push([0.6 + rng() * Math.max(0.1, w - 1.2), (0.25 + rng() * 0.45) * mass]);
      const buckel = (0.5 + rng() * 0.25) * mass, ph = rng() * 6;
      const unten = (x) => {
        let y = dick + tief * (0.45 + 0.2 * Math.sin(x * 2.3 / mass + saat) + 0.1 * Math.sin(x * 5.7 / mass + saat * 3));
        y += tief * 0.5 * Math.pow(0.5 + 0.5 * Math.cos(x / buckel * Math.PI * 2 + ph), 1.6);
        for (const [bx, bl] of brueche) { const d = Math.abs(x - bx); if (d < bl / 2) y -= (dick * 0.45 + tief * 0.7) * Math.sqrt(Math.max(0, 1 - Math.pow(d / (bl / 2), 6))); }
        return Math.max(0.03, y);
      };
      g.save();
      g.beginPath(); g.moveTo(-0.05, 0); g.lineTo(w + 0.05, 0); g.lineTo(w + 0.05, unten(w));
      for (let x = w; x >= -0.05; x -= 0.05) g.lineTo(x, unten(x));
      g.closePath(); g.clip();
      const gr = g.createLinearGradient(0, 0, 0, dick + tief * 1.3);
      gr.addColorStop(0, L([248, 250, 254], 1, 1.05)); gr.addColorStop(0.3, L([242, 246, 252])); gr.addColorStop(0.65, L([226, 234, 247], 1, 0.94)); gr.addColorStop(1, L([188, 202, 228], 1, 0.84));
      g.fillStyle = gr; g.fillRect(-0.05, 0, w + 0.1, h);
      if (F.px > 8) {
        const q = (v, i) => Math.min(255, Math.round(v * lf[i] / 8) * 8).toString(16).padStart(2, "0");
        tonFlecken(g, 0, 0, w, h, 1.2, 0.4, saat + 3, "#" + [192, 206, 228].map(q).join(""), true);
      }
      glitzer(g, F, 0, 0, w, dick, 25, rng, L([255, 255, 255], 0.9, 1.1));
      g.restore();
    };
  }
  /* Eiszapfen: durchscheinend, leicht bläulich, mit Lichtkante */
  function eiszapfen(saat, luecken) {
    return function (g, F) {
      const w = F.w, h = F.h, rng = zufall(saat), L = belichter(F, 0.15);
      let x = 0.1 + rng() * 0.3;
      while (x < w - 0.05) {
        if ((luecken || []).some((l) => Math.abs(x - l) < 0.2)) { x += 0.25; continue; }
        const gruppe = rng() < 0.35;
        const l = h * (gruppe ? 0.45 + rng() * 0.55 : 0.06 + Math.pow(rng(), 2) * 0.5), b = 0.018 + l * 0.07;
        const y0 = 0.02 + rng() * 0.04;
        const gr = g.createLinearGradient(x - b, 0, x + b, 0);
        gr.addColorStop(0, L([190, 214, 236], 0.55)); gr.addColorStop(0.35, L([248, 252, 255], 0.95)); gr.addColorStop(0.6, L([220, 236, 250], 0.8)); gr.addColorStop(1, L([150, 180, 212], 0.55));
        g.fillStyle = gr;
        g.beginPath(); g.moveTo(x - b, y0); g.quadraticCurveTo(x - b * 0.5, y0 + l * 0.55, x + (rng() - 0.5) * 0.01, y0 + l); g.quadraticCurveTo(x + b * 0.5, y0 + l * 0.55, x + b, y0); g.closePath(); g.fill();
        if (F.px > 30) { g.fillStyle = L([255, 255, 255], 0.9); g.beginPath(); g.arc(x - b * 0.3, y0 + l * 0.2, Math.max(0.004, 0.8 / F.px), 0, Math.PI * 2); g.fill(); }
        x += gruppe ? 0.035 + rng() * 0.06 : 0.12 + rng() * 0.45;
      }
    };
  }
  /* Lichterkette: das Kabel ist alle 0,6–0,8 m an einem Haken befestigt
     und hängt dazwischen 4–8 cm durch (an den Enden kaum); die Birnchen
     hängen an kurzen Fassungen etwas unter dem Kabel, jede ±15 % groß,
     etwa jede vierzigste ist durchgebrannt. Tagsüber warm getöntes Glas
     (#f3e2b0) mit Glanzpunkt, abends und nachts glühen sie mit weichem
     Hof. Fast von der Kante gesehen blendet die Kette aus (sonst hinge
     ein loser Strich neben dem Haus). Szenenschein: einer je 4 m. */
  function lichterKette(linie, luecken, opt) {
    opt = opt || {};
    const HAK = 0.7, rng = zufall(opt.saat || 5), durch = opt.durch || [0.04, 0.04];
    const seg = [];
    let laenge = 0;
    for (let i = 0; i + 1 < linie.length; i++) {
      const A = linie[i], Bp = linie[i + 1], l = Math.hypot(Bp[0] - A[0], Bp[1] - A[1]), n = Math.max(1, Math.round(l / HAK));
      laenge += l;
      for (let k = 0; k < n; k++) seg.push({ A: [A[0] + (Bp[0] - A[0]) * k / n, A[1] + (Bp[1] - A[1]) * k / n], B: [A[0] + (Bp[0] - A[0]) * (k + 1) / n, A[1] + (Bp[1] - A[1]) * (k + 1) / n], sag: durch[0] + rng() * durch[1] });
    }
    if (seg.length && opt.enden) { seg[0].sag *= 0.25; seg[seg.length - 1].sag *= 0.25; }
    const kp = (s) => [(s.A[0] + s.B[0]) / 2, (s.A[1] + s.B[1]) / 2 + s.sag * 2];
    const punkt = (s, t) => { const c = kp(s), u = 1 - t; return [u * u * s.A[0] + 2 * u * t * c[0] + t * t * s.B[0], u * u * s.A[1] + 2 * u * t * c[1] + t * t * s.B[1]]; };
    const birnen = [];
    for (const s of seg) for (let k = 0; k < 3; k++) {
      const p = punkt(s, (k + 0.5) / 3);
      if ((luecken || []).some((q) => Math.abs(p[0] - q) < 0.18)) continue;
      birnen.push({ x: p[0], y: p[1] + 0.012, r: 1 + (rng() - 0.5) * 0.3, aus: rng() < 0.025 });
    }
    /* Szenenschein: je angefangene 4 m Kette einer */
    const scheine = [];
    const nS = Math.max(1, Math.round(laenge / 4));
    for (let i = 0; i < nS; i++) { const b = birnen[Math.floor((i + 0.5) / nS * birnen.length)]; if (b) scheine.push(b); }
    const draht = (g) => { g.beginPath(); for (const s of seg) { const c = kp(s); g.moveTo(s.A[0], s.A[1]); g.quadraticCurveTo(c[0], c[1], s.B[0], s.B[1]); } };
    const sichtbar = (F) => klemm((F.sicht == null ? 1 : F.sicht) * 3, 0, 1);
    return {
      malen(g, F) {
        const a = sichtbar(F);
        if (a < 0.05) return;
        const L = belichter(F, 0.05), px = F.px;
        g.save(); g.globalAlpha = a;
        draht(g); g.strokeStyle = L([34, 46, 32]); g.lineWidth = Math.max(0.006, 0.7 / px); g.stroke();
        if (px > 8) {
          g.beginPath(); for (const b of birnen) g.rect(b.x - 0.007 * b.r, b.y - 0.012, 0.014 * b.r, 0.016); g.fillStyle = L([46, 52, 44]); g.fill();
          g.beginPath(); for (const b of birnen) if (!b.aus) { g.moveTo(b.x + 0.011 * b.r, b.y + 0.016 * b.r); g.ellipse(b.x, b.y + 0.016 * b.r, 0.011 * b.r, 0.017 * b.r, 0, 0, Math.PI * 2); }
          g.fillStyle = L([243, 226, 176]); g.fill();
          g.beginPath(); for (const b of birnen) if (b.aus) { g.moveTo(b.x + 0.011 * b.r, b.y + 0.016 * b.r); g.ellipse(b.x, b.y + 0.016 * b.r, 0.011 * b.r, 0.017 * b.r, 0, 0, Math.PI * 2); }
          g.fillStyle = L([118, 112, 100]); g.fill();
          if (px > 25) { g.beginPath(); for (const b of birnen) { g.moveTo(b.x - 0.0035 * b.r + 0.004, b.y + 0.01 * b.r); g.arc(b.x - 0.0035 * b.r, b.y + 0.01 * b.r, 0.004, 0, Math.PI * 2); } g.fillStyle = L([255, 255, 255], 0.85); g.fill(); }
        } else { g.beginPath(); for (const b of birnen) g.rect(b.x - 0.014, b.y, 0.028, 0.032); g.fillStyle = L([243, 226, 176]); g.fill(); }
        g.restore();
      },
      leuchten(g, F) {
        const a = F.nacht * sichtbar(F);
        if (a < 0.02) return;
        g.save(); g.globalCompositeOperation = "lighter";
        /* Lichtsaum entlang der ganzen Kette */
        g.lineCap = "round"; g.lineJoin = "round";
        for (const [lw, al] of [[0.5, 0.05], [0.24, 0.07]]) { draht(g); g.strokeStyle = "rgba(255,186,104," + (al * a).toFixed(3) + ")"; g.lineWidth = lw; g.stroke(); }
        if (F.px > 60) {
          for (const b of birnen) {
            if (b.aus) continue;
            const cy = b.y + 0.016, gg = g.createRadialGradient(b.x, cy, 0, b.x, cy, 0.14);
            gg.addColorStop(0, "rgba(255,250,228," + a.toFixed(3) + ")"); gg.addColorStop(0.16, "rgba(255,226,150," + (0.9 * a).toFixed(3) + ")"); gg.addColorStop(0.45, "rgba(255,186,96," + (0.3 * a).toFixed(3) + ")"); gg.addColorStop(1, "rgba(255,160,70,0)");
            g.fillStyle = gg; g.fillRect(b.x - 0.14, cy - 0.14, 0.28, 0.28);
          }
        } else {
          /* weiter weg: gestufter Hof in drei Ringen (je ein Pfad) */
          for (const [r, al] of [[0.1, 0.12], [0.055, 0.28], [0.022, 0.95]]) {
            g.beginPath(); for (const b of birnen) if (!b.aus) { g.moveTo(b.x + r, b.y + 0.016); g.arc(b.x, b.y + 0.016, r, 0, Math.PI * 2); }
            g.fillStyle = "rgba(255,214,140," + (al * a).toFixed(3) + ")"; g.fill();
          }
        }
        g.restore();
        for (const b of scheine) schein(F, b.x, b.y + 0.02, 1.1, "255,196,110", 0.4, true);
      }
    };
  }
  /* Firstziegel (halbrund, vermörtelt). Winter: ein runder Schneekamm –
     oben hell, zur Dachfläche hin bläulich */
  function firstMal(saat, winter, sag) {
    return function (g, F) {
      const w = F.w, h = F.h, c = [146, 66, 44], rng = zufall(saat);
      if (winter) {
        g.fillStyle = "rgb(236,241,248)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.25);
        const gr = g.createLinearGradient(0, 0, 0, h);
        gr.addColorStop(0, "rgba(255,255,255,0.35)"); gr.addColorStop(0.5, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(150,168,210,0.35)");
        g.fillStyle = gr; g.fillRect(-0.05, 0, w + 0.1, h);
        if (F.px > 8) tonFlecken(g, 0, 0, w, h, 1.4, 0.4, saat + 3, "#c9d4e6", true);
        return;
      }
      g.fillStyle = rgb(c); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.25);
      /* jeder Firstziegel folgt dem Durchhang (sag: Versatz entlang der Fläche) */
      const dv = (x) => (sag ? sag(x) : 0);
      for (let x = -0.1; x < w; x += 0.33) {
        const cc = PI.streu(c, rng, 0.08), d = dv(x + 0.17);
        const gr = g.createLinearGradient(0, d, 0, h + d);
        gr.addColorStop(0, rgb(hell(cc, 0.18))); gr.addColorStop(0.6, rgb(cc)); gr.addColorStop(1, rgb(hell(cc, -0.25)));
        g.fillStyle = gr; g.fillRect(x, d, 0.34, h);
      }
      g.beginPath(); for (let x = -0.1; x < w; x += 0.33) g.rect(x + 0.32, dv(x + 0.33), 0.02, h);
      g.fillStyle = "rgba(30,12,8,0.4)"; g.fill();
      /* Mörtelband am Fuß, dem Durchhang folgend */
      g.beginPath(); for (let x = -0.05; x <= w + 0.06; x += 0.25) { const y = h - 0.015 + dv(x); if (x < 0) g.moveTo(x, y); else g.lineTo(x, y); }
      g.strokeStyle = "rgb(190,182,168)"; g.lineWidth = 0.04; g.stroke();
    };
  }

  /* ---------------- Klinker für den Kamin ----------------
     Reichsformat im Läuferverband, jeder Stein ±12 % (einige dunkel
     gebrannt, einige violettstichig). Die Steine je Farbton in EINEM Pfad.
     fahne: Rußfahne an dieser Seite (Anteil der Breite, wo sie herunterläuft) */
  function klinkerMal(saat, winter, rusz, fahne) {
    return function (g, F) {
      const w = F.w, h = F.h, rng = zufall(saat), px = F.px;
      g.fillStyle = "rgb(126,116,106)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      const sh = 0.0813, sl = 0.25;
      if (px * sh < 2.2) {
        g.fillStyle = "rgb(130,58,44)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      } else {
        const toene = [[], [], [], []];
        const reihen = Math.ceil(h / sh) + 1;
        for (let r = 0; r < reihen; r++) {
          const y = r * sh, off = (r % 2) * sl / 2 + (saat % 3) * 0.04;
          for (let x = -off; x < w; x += sl) { const q = rng(); toene[q < 0.12 ? 0 : q < 0.2 ? 3 : q < 0.6 ? 1 : 2].push([x + 0.005, y + 0.005, sl - 0.01, sh - 0.01]); }
        }
        const farben = [[98, 42, 34], [128, 56, 42], [140, 64, 48], [112, 60, 72]];
        toene.forEach((liste, k) => { if (!liste.length) return; g.beginPath(); for (const r of liste) g.rect(r[0], r[1], r[2], r[3]); g.fillStyle = rgb(farben[k]); g.fill(); });
        if (px > 40) { g.beginPath(); for (const liste of toene) for (const r of liste) g.rect(r[0], r[1], r[2], 0.008); g.fillStyle = "rgba(255,210,180,0.18)"; g.fill(); }
      }
      if (px > 12) rausch(g, 0, 0, w, h, 0.6, 0.22, saat + 3, 3);
      /* Ruß oben rundum */
      if (rusz) {
        const gr = g.createLinearGradient(0, 0, 0, Math.min(h, 0.3));
        gr.addColorStop(0, "rgba(20,16,14," + rusz + ")"); gr.addColorStop(1, "rgba(20,16,14,0)");
        g.fillStyle = gr; g.fillRect(-0.05, 0, w + 0.1, Math.min(h, 0.3));
      }
      /* Rußfahne: auf der Leeseite läuft vom Kopf eine dunkle, ausfransende Spur herunter */
      if (fahne != null && px > 6) {
        const fx = w * fahne, rr = zufall(saat + 9), len = Math.min(h, 0.7 + rr() * 0.4);
        const gr = g.createLinearGradient(0, 0, 0, len);
        gr.addColorStop(0, "rgba(24,18,16,0.55)"); gr.addColorStop(1, "rgba(24,18,16,0)");
        g.fillStyle = gr;
        g.beginPath(); g.moveTo(fx - 0.14, 0);
        g.bezierCurveTo(fx - 0.12, len * 0.3, fx - 0.05 + rr() * 0.03, len * 0.7, fx - 0.01, len);
        g.bezierCurveTo(fx + 0.04, len * 0.6, fx + 0.1, len * 0.35, fx + 0.13, 0); g.closePath(); g.fill();
      }
      void winter;
    };
  }

  /* =====================================================================
     FIGUREN: Fallrohr, Laterne, Handlauf (aufrecht gemalt, selbst belichtet)
     ===================================================================== */
  function figurLicht(F) {
    const lf = ST.lichtFaktor(ST.ZUM_AUGE, F.Z, 0.05, F.jahr);
    return (c, a) => rgb([c[0] * lf[0], c[1] * lf[1], c[2] * lf[2]], a);
  }
  /* Polylinie im Modell (relativ zum Fußpunkt) als Rohr: Zink mit Glanzkante */
  function rohrFigur(B, pts, dm, farbe, schellen, winter) {
    return function (g, s, F) {
      if (F.schatten) return;
      const L = figurLicht(F);
      const P = pts.map((p) => bildVersatz(B, s, p));
      const pfad = (dx) => { g.beginPath(); g.moveTo(P[0][0] + dx, P[0][1]); for (let i = 1; i < P.length; i++) g.lineTo(P[i][0] + dx, P[i][1]); };
      g.lineJoin = "round"; g.lineCap = "butt";
      const b = dm * s;
      pfad(0); g.strokeStyle = L(hell(farbe, -0.35)); g.lineWidth = b; g.stroke();
      pfad(-b * 0.12); g.strokeStyle = L(farbe); g.lineWidth = b * 0.62; g.stroke();
      pfad(-b * 0.22); g.strokeStyle = L(hell(farbe, 0.38)); g.lineWidth = b * 0.2; g.stroke();
      for (const i of schellen || []) {
        const p = bildVersatz(B, s, pts[i[0]].map((v, k) => v + (pts[i[0] + 1][k] - v) * i[1]));
        g.fillStyle = L([50, 52, 56]); g.fillRect(p[0] - b * 0.62, p[1] - b * 0.18, b * 1.24, b * 0.36);
      }
      if (winter) {
        /* Schnee auf den waagerechten Stücken und Schellen */
        g.strokeStyle = L([244, 247, 252]); g.lineWidth = Math.max(1, b * 0.3);
        for (let i = 0; i < P.length - 1; i++) {
          const d = pts[i + 1][2] - pts[i][2], hz = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
          if (hz > Math.abs(d) * 0.6) { g.beginPath(); g.moveTo(P[i][0], P[i][1] - b * 0.45); g.lineTo(P[i + 1][0], P[i + 1][1] - b * 0.45); g.stroke(); }
        }
      }
    };
  }
  /* Wandlaterne an geschmiedetem Arm (Blickwinkel beachtet) */
  function laterneFigur(B, wandN, winter) {
    return function (g, s, F) {
      if (F.schatten) return;
      const L = figurLicht(F), kz = ST.KZ * s;
      /* Kernfehler umgehen: Lichtpunkte werden ohne Verdeckung über alles
         gelegt – ist die Wand abgewandt, bleibt die Laterne dunkel */
      const zuSehen = B && B.e && dot(B.e, wandN) > 0.05;
      const eisen = [34, 34, 36];
      /* Arm: vom Wandhalter zum Haken über der Laterne */
      const w0 = bildVersatz(B, s, [-wandN[0] * 0.32, -wandN[1] * 0.32, 0.72]);
      const w1 = bildVersatz(B, s, [-wandN[0] * 0.32, -wandN[1] * 0.32, 0.5]);
      const top = [0, -0.62 * kz];
      g.lineCap = "round";
      g.strokeStyle = L(eisen); g.lineWidth = Math.max(1, 0.025 * s);
      g.beginPath(); g.moveTo(w0[0], w0[1]); g.quadraticCurveTo(top[0] + (w0[0] - top[0]) * 0.3, w0[1], top[0], top[1] - 0.02 * kz); g.stroke();
      g.lineWidth = Math.max(1, 0.018 * s);
      g.beginPath(); g.moveTo(w1[0], w1[1]); g.quadraticCurveTo((w1[0] + top[0]) / 2, (w1[1] + top[1]) / 2 + 0.05 * kz, top[0] + (w0[0] - top[0]) * 0.45, w0[1] + 0.02 * kz); g.stroke();
      /* Wandplatte */
      g.fillStyle = L(eisen); g.fillRect(w0[0] - 0.03 * s, w0[1] - 0.04 * kz, 0.06 * s, 0.28 * kz);
      /* Haken, Dach, Gehäuse */
      g.beginPath(); g.moveTo(0, top[1]); g.lineTo(0, -0.52 * kz); g.stroke();
      const bw = 0.24 * s;
      g.fillStyle = L([44, 44, 46]);
      g.beginPath(); g.moveTo(-bw * 0.62, -0.42 * kz); g.lineTo(0, -0.54 * kz); g.lineTo(bw * 0.62, -0.42 * kz); g.closePath(); g.fill();
      g.fillRect(-bw * 0.56, -0.44 * kz, bw * 1.12, 0.03 * kz);
      /* Glas */
      const nacht = zuSehen ? F.nacht : 0;
      const gy0 = -0.41 * kz, gy1 = -0.08 * kz;
      g.beginPath(); g.moveTo(-bw * 0.5, gy0); g.lineTo(bw * 0.5, gy0); g.lineTo(bw * 0.38, gy1); g.lineTo(-bw * 0.38, gy1); g.closePath();
      if (nacht > 0.05) {
        const gg = g.createRadialGradient(0, (gy0 + gy1) / 2, 0, 0, (gy0 + gy1) / 2, bw * 0.7);
        gg.addColorStop(0, "rgba(255,244,210,1)"); gg.addColorStop(0.5, "rgba(255,200,110,0.95)"); gg.addColorStop(1, "rgba(220,140,60,0.9)");
        g.fillStyle = gg;
      } else {
        const gg = g.createLinearGradient(-bw / 2, gy0, bw / 2, gy1);
        gg.addColorStop(0, L([200, 214, 228])); gg.addColorStop(0.5, L([90, 100, 114])); gg.addColorStop(1, L([150, 164, 180]));
        g.fillStyle = gg;
      }
      g.fill();
      g.strokeStyle = L([30, 30, 32]); g.lineWidth = Math.max(1, 0.014 * s); g.stroke();
      g.beginPath(); g.moveTo(0, gy0); g.lineTo(0, gy1); g.stroke();
      g.fillStyle = L([44, 44, 46]); g.fillRect(-bw * 0.42, gy1, bw * 0.84, 0.04 * kz);
      g.beginPath(); g.moveTo(-bw * 0.2, gy1 + 0.04 * kz); g.lineTo(0, gy1 + 0.1 * kz); g.lineTo(bw * 0.2, gy1 + 0.04 * kz); g.fill();
      if (winter) { g.fillStyle = L([244, 247, 252]); g.beginPath(); g.ellipse(0, -0.5 * kz, bw * 0.5, 0.035 * kz, 0, Math.PI, 0); g.fill(); }
      if (nacht > 0.05 && F.leuchtPunkt) F.leuchtPunkt(0, (gy0 + gy1) / 2, 2.4 * s, "255,196,120", 0.95, true);
    };
  }
  /* Geschmiedetes Geländer: Pfosten an den Ecken, Stäbe alle ~12 cm,
     Handlauf 0,92 m über der Stufe, Schnecke am Anfang */
  function handlaufFigur(B, pts, winter) {
    return function (g, s, F) {
      if (F.schatten) return;
      const L = figurLicht(F);
      const H = pts.map((p) => bildVersatz(B, s, [p[0], p[1], p[2] + 0.92]));
      g.strokeStyle = L([32, 32, 34]); g.lineCap = "round"; g.lineJoin = "round";
      g.lineWidth = Math.max(0.7, 0.012 * s);
      g.beginPath();
      for (let i = 0; i < pts.length - 1; i++) {
        const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]), n = Math.max(1, Math.round(l / 0.12));
        for (let k = 1; k < n; k++) {
          const t = k / n, p = pts[i].map((v, j) => v + (pts[i + 1][j] - v) * t);
          const a = bildVersatz(B, s, [p[0], p[1], p[2] + 0.06]), b = bildVersatz(B, s, [p[0], p[1], p[2] + 0.9]);
          g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]);
        }
      }
      g.stroke();
      /* Pfosten und Fußleiste */
      g.lineWidth = Math.max(1, 0.03 * s);
      g.beginPath();
      for (const p of pts) { const a = bildVersatz(B, s, p), b = bildVersatz(B, s, [p[0], p[1], p[2] + 0.95]); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
      const U = pts.map((p) => bildVersatz(B, s, [p[0], p[1], p[2] + 0.06]));
      g.moveTo(U[0][0], U[0][1]); for (let i = 1; i < U.length; i++) g.lineTo(U[i][0], U[i][1]);
      g.stroke();
      g.lineWidth = Math.max(1, 0.035 * s);
      g.beginPath(); g.moveTo(H[0][0], H[0][1]); for (let i = 1; i < H.length; i++) g.lineTo(H[i][0], H[i][1]); g.stroke();
      const e = H[0];
      g.lineWidth = Math.max(0.8, 0.02 * s);
      g.beginPath(); g.arc(e[0] - 0.05 * s, e[1] + 0.05 * s, 0.05 * s, 0, Math.PI * 1.6); g.stroke();
      if (winter) { g.strokeStyle = L([244, 247, 252]); g.lineWidth = Math.max(1, 0.03 * s); g.beginPath(); g.moveTo(H[0][0], H[0][1] - 0.025 * s); for (let i = 1; i < H.length; i++) g.lineTo(H[i][0], H[i][1] - 0.025 * s); g.stroke(); }
    };
  }

  /* =====================================================================
     GARTEN AM SOCKEL (Figuren): Stockrosen, Buchskugeln, Kübel auf dem
     Podest – im Winter ein Tännchen mit Lichtern, im Frühling Geranien.
     Kein Kreis mit Tupfen: Jede Pflanze bekommt eine unruhige Silhouette,
     Kugel- bzw. Zweiglicht von links oben und viele kleine Blätter, in
     wenigen Tonstufen gebündelt (je Tonstufe EIN Pfad).
     ===================================================================== */
  const FIG_LICHT = [-0.52, -0.56, 0.64];
  /* 5-lappiges Stockrosenblatt (handförmig) an den Pfad anhängen */
  function lappenBlatt(g, x, y, r, dreh) {
    const n = 5;
    for (let i = 0; i <= n * 2; i++) {
      const a = dreh + Math.PI * 2 * i / (n * 2), rr = i % 2 ? r * 0.62 : r;
      const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr * 0.72;
      if (i === 0) g.moveTo(px, py); else g.quadraticCurveTo(x + Math.cos(a - Math.PI / (n * 2)) * r * 1.02, y + Math.sin(a - Math.PI / (n * 2)) * r * 0.74, px, py);
    }
    g.closePath();
  }
  function stockroseFigur(saat) {
    return function (g, s, F) {
      const rng = zufall(saat), kz = ST.KZ * s, sw = F.schatten;
      /* Schatten: ein einziger schlanker Umriss (jeder Pinselstrich auf der
         weichgezeichneten Schattenebene kostet viel Zeit) */
      if (sw) { g.fillStyle = "#000"; g.beginPath(); g.moveTo(-0.25 * s, 0); g.quadraticCurveTo(-0.2 * s, -1.2 * kz, 0, -1.9 * kz); g.quadraticCurveTo(0.2 * s, -1.2 * kz, 0.25 * s, 0); g.closePath(); g.fill(); return; }
      const L = figurLicht(F);
      const farben = [[214, 76, 128], [242, 226, 232], [150, 22, 54], [236, 140, 172]];
      const c0 = farben[Math.floor(rng() * farben.length)];
      const stiele = [], blaetter = [[], [], []], blueten = [], knospen = [];
      for (let i = 0; i < 3; i++) {
        const dx = (i - 1) * 0.13 * s + (rng() - 0.5) * 0.05 * s, hh = (1.35 + rng() * 0.5) * kz, neig = (rng() - 0.5) * 0.16 * s;
        stiele.push([dx, hh, neig]);
        /* große, gelappte Grundblätter unten, nach oben kleiner */
        for (let k = 0; k < 7; k++) {
          const t = k < 4 ? rng() * 0.25 : 0.25 + rng() * 0.3, r = (k < 4 ? 0.1 : 0.065) * s * (0.8 + rng() * 0.4);
          const bx = dx + neig * t * t + (rng() - 0.5) * (k < 4 ? 0.34 : 0.16) * s, by = -hh * t - 0.04 * kz;
          const ton = bx < dx - 0.02 * s ? 2 : rng() < 0.5 ? 1 : 0;
          blaetter[ton].push([bx, by, r, rng() * 6]);
        }
        /* Blüten die obere Hälfte entlang, oben Knospen */
        for (let k = 0; k < 10; k++) {
          const t = 0.42 + k / 10 * 0.5, seite = (k % 2 ? 1 : -1);
          const bx = dx + neig * t * t + seite * (0.035 + rng() * 0.02) * s, by = -hh * t, r = (0.052 - t * 0.02) * s;
          blueten.push([bx, by, r, seite, Math.floor(rng() * 3)]);
        }
        for (let k = 0; k < 4; k++) { const t = 0.93 + k * 0.025; knospen.push([dx + neig * t * t + (k % 2 ? 1 : -1) * 0.015 * s, -hh * t, (0.018 - k * 0.003) * s]); }
      }
      /* Stiele */
      g.lineCap = "round"; g.strokeStyle = L([66, 92, 46]); g.lineWidth = Math.max(1, 0.022 * s);
      g.beginPath(); for (const [dx, hh, neig] of stiele) { g.moveTo(dx, 0); g.quadraticCurveTo(dx + neig * 0.3, -hh * 0.5, dx + neig, -hh); } g.stroke();
      /* Blätter in drei Tönen (dunkel, mittel, Lichtseite) */
      const bt = [[40, 70, 34], [58, 94, 44], [86, 124, 60]];
      blaetter.forEach((liste, k) => {
        g.beginPath();
        for (const [x, y, r, d] of liste) { if (s > 30) lappenBlatt(g, x, y, r, d); else { g.moveTo(x + r, y); g.ellipse(x, y, r, r * 0.7, 0, 0, Math.PI * 2); } }
        g.fillStyle = L(bt[k]); g.fill();
      });
      if (s > 45) { g.beginPath(); for (const [x, y, r, d] of blaetter[1].concat(blaetter[2])) { g.moveTo(x, y); g.lineTo(x + Math.cos(d) * r * 0.8, y + Math.sin(d) * r * 0.55); } g.strokeStyle = L([30, 52, 26], 0.5); g.lineWidth = Math.max(0.5, 0.004 * s); g.stroke(); }
      /* Schalenblüten: dunkler Außenrand, heller Kelch, dunkles Auge mit
         hellem Stempel; der Kelch ist zur Seite geneigt (Ellipse). Drei
         Tonstufen je Pflanze, jede Ebene EIN Pfad je Stufe. */
      const ton = [hell(c0, -0.08), c0, hell(c0, 0.08)];
      const lage = (k, dx, dy, f, fy) => { g.beginPath(); for (const [x, y, r, seite, t] of blueten) { if (t !== k) continue; g.moveTo(x + dx * r + r * f, y + dy * r); g.ellipse(x + dx * r, y + dy * r, r * f, r * fy, seite * 0.3, 0, Math.PI * 2); } };
      for (let k = 0; k < 3; k++) {
        lage(k, 0, 0, 1, 0.86); g.fillStyle = L(hell(ton[k], -0.28)); g.fill();
        lage(k, -0.12, -0.1, 0.8, 0.68); g.fillStyle = L(ton[k]); g.fill();
        if (s > 30) { lage(k, -0.3, -0.3, 0.34, 0.24); g.fillStyle = L(hell(ton[k], 0.25)); g.fill(); lage(k, 0.05, 0.02, 0.3, 0.3); g.fillStyle = L(hell(ton[k], -0.45)); g.fill(); }
      }
      if (s > 30) {
        g.beginPath(); for (const [x, y, r] of blueten) { g.moveTo(x + r * 0.1, y); g.arc(x, y, r * 0.1, 0, Math.PI * 2); } g.fillStyle = L([240, 226, 150]); g.fill();
        if (s > 60) { g.beginPath(); for (const [x, y, r] of blueten) for (let k = 0; k < 5; k++) { const a = k * 1.2566 + 0.3; g.moveTo(x + Math.cos(a) * r * 0.32, y + Math.sin(a) * r * 0.28); g.lineTo(x + Math.cos(a) * r * 0.85, y + Math.sin(a) * r * 0.72); } g.strokeStyle = "rgba(60,20,30,0.25)"; g.lineWidth = Math.max(0.5, 0.004 * s); g.stroke(); }
      }
      g.beginPath(); for (const [x, y, r] of knospen) { g.moveTo(x + r, y); g.ellipse(x, y, r, r * 1.3, 0, 0, Math.PI * 2); } g.fillStyle = L([96, 124, 64]); g.fill();
    };
  }
  /* Buchskugel: unruhiger Umriss aus vielen kleinen Büscheln, Kugellicht
     von links oben, 200–300 Blättchen in vier Tonstufen; im Winter eine
     Schneehaube mit welligem, bläulich beschattetem Rand */
  function buchsFigur(winter, gross) {
    return function (g, s, F) {
      const r = gross * s, sw = F.schatten, rng = zufall(17 + (gross * 100 | 0));
      const cy = -r * 0.92;
      const umriss = [];
      for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2, q = 1 + (rng() - 0.5) * 0.08 + Math.sin(a * 5 + gross * 9) * 0.025; umriss.push([Math.cos(a) * r * q, cy + Math.sin(a) * r * 0.94 * q]); }
      const form = () => { g.beginPath(); umriss.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };
      if (sw) { g.fillStyle = "#000"; form(); g.fill(); return; }
      const L = figurLicht(F);
      /* Kontaktschatten am Boden */
      g.fillStyle = "rgba(10,16,10,0.35)"; g.beginPath(); g.ellipse(r * 0.08, -r * 0.02, r * 0.95, r * 0.22, 0, 0, Math.PI * 2); g.fill();
      form(); g.fillStyle = L([30, 54, 30]); g.fill();
      const gr = g.createRadialGradient(-r * 0.38, cy - r * 0.4, r * 0.05, -r * 0.1, cy - r * 0.1, r * 1.05);
      gr.addColorStop(0, L([96, 134, 66], 0.95)); gr.addColorStop(0.55, L([52, 88, 44], 0.55)); gr.addColorStop(1, L([14, 28, 16], 0.7));
      g.fillStyle = gr; form(); g.fill();
      if (s > 18) {
        const n = s > 45 ? 280 : s > 28 ? 200 : 110, toene = [[], [], [], []];
        const blatt = Math.max(1.1, 0.024 * s);
        for (let i = 0; i < n; i++) {
          const a = rng() * Math.PI * 2, q = Math.sqrt(rng()) * 0.97, x = Math.cos(a) * q, y = Math.sin(a) * q;
          const nz = Math.sqrt(Math.max(0, 1 - q * q)), h = x * FIG_LICHT[0] + y * FIG_LICHT[1] + nz * FIG_LICHT[2] + (rng() - 0.5) * 0.5;
          const k = h > 0.75 ? 3 : h > 0.35 ? 2 : h > -0.05 ? 1 : 0;
          toene[k].push([x * r, cy + y * r * 0.94, blatt * (0.7 + rng() * 0.6), rng() * Math.PI]);
        }
        const farben = [[20, 40, 22], [44, 76, 38], [74, 110, 54], [118, 150, 80]];
        toene.forEach((liste, k) => {
          if (!liste.length) return;
          g.beginPath(); for (const [x, y, b, d] of liste) { g.moveTo(x + Math.cos(d) * b, y + Math.sin(d) * b); g.ellipse(x, y, b, b * 0.55, d, 0, Math.PI * 2); }
          g.fillStyle = L(farben[k]); g.fill();
        });
      }
      if (winter) {
        /* Schneehaube: folgt oben dem Umriss, unten ein welliger Rand */
        const oben = umriss.filter(([x, y]) => y < cy - r * 0.2).sort((p, q) => p[0] - q[0]);
        g.beginPath(); g.moveTo(oben[0][0], oben[0][1] + r * 0.04);
        for (const [x, y] of oben) g.lineTo(x * 0.98, y - r * 0.03);
        const n = 9;
        for (let i = n; i >= 0; i--) { const t = i / n, x = oben[0][0] + (oben[oben.length - 1][0] - oben[0][0]) * t; g.lineTo(x, cy - r * (0.28 + 0.1 * Math.sin(t * Math.PI)) + (rng() - 0.3) * r * 0.1); }
        g.closePath();
        const sg = g.createLinearGradient(-r, cy - r, r * 0.6, cy - r * 0.2);
        sg.addColorStop(0, L([250, 252, 255])); sg.addColorStop(1, L([196, 208, 228]));
        g.fillStyle = sg; g.fill();
        /* einzelne Schneeflocken in den Büscheln darunter */
        g.beginPath(); for (let i = 0; i < 14; i++) { const x = (rng() - 0.5) * 1.5 * r, y = cy - r * (0.1 + rng() * 0.3), b = Math.max(0.8, 0.018 * s); g.moveTo(x + b, y); g.ellipse(x, y, b, b * 0.6, 0, 0, Math.PI * 2); }
        g.fillStyle = L([236, 241, 250], 0.85); g.fill();
      }
    };
  }
  /* Kübel auf dem Podest: Holzkübel mit Eisenreifen; im Winter eine kleine,
     leicht schiefe Fichte (Zweigetagen mit ungleich langen Ästen, Schnee
     nur auf den Oberseiten), im Frühling Geranien */
  function kuebelFigur(winter) {
    return function (g, s, F) {
      const kz = ST.KZ * s, sw = F.schatten, rng = zufall(29);
      if (sw) { g.fillStyle = "#000"; g.beginPath(); g.moveTo(-0.2 * s, 0); g.lineTo(-0.22 * s, -0.34 * kz); g.lineTo(-0.3 * s, -0.4 * kz); g.lineTo(0, -1.15 * kz); g.lineTo(0.3 * s, -0.4 * kz); g.lineTo(0.22 * s, -0.34 * kz); g.lineTo(0.2 * s, 0); g.closePath(); g.fill(); return; }
      const L = figurLicht(F);
      /* Holzkübel mit Dauben und Eisenreifen */
      const kw = 0.2 * s, kh = 0.34 * kz;
      const kg = g.createLinearGradient(-kw, 0, kw, 0);
      kg.addColorStop(0, L([138, 96, 60])); kg.addColorStop(0.6, L([104, 70, 42])); kg.addColorStop(1, L([72, 48, 30]));
      g.fillStyle = kg; g.beginPath(); g.moveTo(-kw, -kh); g.lineTo(kw, -kh); g.lineTo(kw * 0.82, 0); g.lineTo(-kw * 0.82, 0); g.closePath(); g.fill();
      if (s > 25) { g.beginPath(); for (let i = 1; i < 5; i++) { const t = -1 + i * 0.4; g.moveTo(kw * t, -kh); g.lineTo(kw * 0.82 * t, 0); } g.strokeStyle = L([50, 32, 20], 0.6); g.lineWidth = Math.max(0.6, 0.006 * s); g.stroke(); }
      g.fillStyle = L([40, 40, 42]); g.fillRect(-kw * 0.95, -kh * 0.8, kw * 1.9, Math.max(1, 0.02 * s)); g.fillRect(-kw * 0.88, -kh * 0.25, kw * 1.76, Math.max(1, 0.02 * s));
      if (winter) {
        /* Fichte: Stamm, dann Etagen von unten nach oben */
        const hoch = 0.78 * kz, fuss = -kh - 0.02 * kz, lean = 0.03 * s;
        g.strokeStyle = L([70, 50, 34]); g.lineWidth = Math.max(1, 0.025 * s);
        g.beginPath(); g.moveTo(0, -kh); g.lineTo(lean, fuss - hoch); g.stroke();
        const etagen = 6, dunkel = [], mittel = [], hellT = [], schnee = [], nadeln = [[], []];
        for (let i = 0; i < etagen; i++) {
          const t = i / etagen, y = fuss - t * hoch * 0.92, ax = lean * t;
          const breite = (0.3 - t * 0.24) * s;
          for (const sg of [-1, 1]) {
            const l = breite * (0.75 + rng() * 0.45), tip = [ax + sg * l, y + 0.03 * kz * (0.6 + rng())];
            /* Astfläche: oben leicht gewölbt, unten gezackt hängende Zweige */
            const P = [[ax, y - 0.1 * kz], [ax + sg * l * 0.5, y - 0.06 * kz], tip];
            const zacken = []; for (let k = 5; k >= 0; k--) { const f = k / 5; zacken.push([ax + sg * l * f, y + (0.02 + (k % 2) * 0.035 + rng() * 0.02) * kz]); }
            (sg < 0 ? mittel : dunkel).push(P.concat(zacken));
            hellT.push([[ax, y - 0.1 * kz], [ax + sg * l * 0.5, y - 0.06 * kz], [ax + sg * l * 0.9, y - 0.01 * kz], [ax + sg * l * 0.45, y - 0.03 * kz]]);
            schnee.push([ax + sg * l * 0.08, y - 0.1 * kz, ax + sg * l * (0.7 + rng() * 0.2), y - 0.02 * kz, sg]);
            for (let k = 0; k < 6; k++) { const f = rng(), bx = ax + sg * l * f, by = y - 0.04 * kz + f * 0.05 * kz; nadeln[k % 2].push([bx, by, bx + sg * 0.03 * s, by + 0.03 * kz * (rng() - 0.3)]); }
          }
        }
        /* Spitze */
        mittel.push([[lean, fuss - hoch - 0.12 * kz], [lean + 0.05 * s, fuss - hoch + 0.02 * kz], [lean - 0.05 * s, fuss - hoch + 0.02 * kz]]);
        const flaeche = (liste, farbe) => { g.beginPath(); for (const P of liste) { P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); } g.fillStyle = farbe; g.fill(); };
        flaeche(dunkel, L([22, 50, 32])); flaeche(mittel, L([32, 66, 42])); flaeche(hellT, L([50, 90, 58], 0.8));
        if (s > 30) nadeln.forEach((liste, k) => { g.beginPath(); for (const [a, b, c, d] of liste) { g.moveTo(a, b); g.lineTo(c, d); } g.strokeStyle = L(k ? [72, 112, 70] : [16, 36, 24]); g.lineWidth = Math.max(0.6, 0.006 * s); g.stroke(); });
        /* Schnee nur auf den Astoberseiten, ungleich lang */
        g.beginPath();
        for (const [x0, y0, x1, y1, sg] of schnee) { const d = 0.022 * kz; g.moveTo(x0, y0 - d * 0.3); g.quadraticCurveTo((x0 + x1) / 2, y0 - d, x1, y1); g.quadraticCurveTo((x0 + x1) / 2 + sg * 0.01 * s, (y0 + y1) / 2 + d * 0.6, x0, y0 + d * 0.4); }
        g.fillStyle = L([240, 244, 250]); g.fill();
        if (!sw) {
          const a = F.nacht || 0;
          /* Lichterkette: kleine Birnchen, nachts mit Hof */
          const pkte = [];
          for (let i = 0; i < 16; i++) { const t = (i + rng() * 0.6) / 17, y = fuss - t * hoch * 0.9, w2 = (0.26 - t * 0.2) * s; pkte.push([lean * t + Math.sin(i * 2.4) * w2 * 0.8, y + 0.02 * kz]); }
          if (a > 0.05) {
            g.save(); g.globalCompositeOperation = "lighter";
            for (const [rr, al, f] of [[0.05, 0.08, "255,190,110"], [0.022, 0.3, "255,210,140"], [0.009, 1, "255,240,200"]]) { g.beginPath(); for (const [x, y] of pkte) { g.moveTo(x + rr * s, y); g.arc(x, y, rr * s, 0, Math.PI * 2); } g.fillStyle = "rgba(" + f + "," + (al * a).toFixed(3) + ")"; g.fill(); }
            g.restore();
          } else if (s > 20) { g.beginPath(); for (const [x, y] of pkte) { const b = Math.max(0.7, 0.008 * s); g.moveTo(x + b, y); g.arc(x, y, b, 0, Math.PI * 2); } g.fillStyle = L([243, 226, 176]); g.fill(); }
        }
      } else {
        /* Geranien im Kübel: runde, gezonte Blätter in drei Tönen, darüber
           Dolden aus vielen kleinen roten Blüten */
        const blatt = [[], [], []], dolde = [[], []];
        for (let i = 0; i < 26; i++) { const a = Math.PI * (0.05 + rng() * 0.9), rr = (0.05 + rng() * 0.2) * s, x = Math.cos(a) * rr, y = -kh - Math.sin(a) * rr * 0.7 + 0.02 * kz; blatt[x < -0.05 * s ? 2 : rng() < 0.5 ? 1 : 0].push([x, y, (0.035 + rng() * 0.015) * s]); }
        for (let i = 0; i < 6; i++) { const x = (rng() - 0.5) * 0.34 * s, y = -kh - (0.14 + rng() * 0.12) * kz; for (let k = 0; k < 9; k++) dolde[rng() < 0.4 ? 1 : 0].push([x + (rng() - 0.5) * 0.07 * s, y + (rng() - 0.5) * 0.06 * s, (0.012 + rng() * 0.008) * s]); }
        const kreise = (liste, farbe) => { g.beginPath(); for (const [x, y, r] of liste) { g.moveTo(x + r, y); g.arc(x, y, r, 0, Math.PI * 2); } g.fillStyle = farbe; g.fill(); };
        kreise(blatt[0], L([44, 82, 38])); kreise(blatt[1], L([60, 104, 46])); kreise(blatt[2], L([88, 132, 62]));
        kreise(dolde[0], L([196, 26, 40])); kreise(dolde[1], L([236, 72, 76]));
      }
    };
  }
  function gartenBauen(M, B, V, winter) {
    const yS = YE + SV;
    const setz = (name, x, y, z, br, ho, malen, mitte) => {
      M.teil(name, { mitte: mitte });
      M.figur({ x: x, y: y, z: z, breite: br, hoehe: ho, malen: malen });
    };
    if (!winter) [-4.0, -3.45, -2.85].forEach((x, i) => setz("stockrose" + i, x, yS + 0.28, 0, 0.8, 2.2, stockroseFigur(V.saat + i * 7), [x * 0.2, yS + 0.9, 1.2]));
    setz("buchs-w", -1.05, yS + 0.55, 0, 0.8, 0.8, buchsFigur(winter, 0.3), [-0.2, yS + 1.1, 0.4]);
    setz("buchs-o", 3.45, yS + 0.35, 0, 0.8, 0.8, buchsFigur(winter, 0.27), [3.45, yS + 1.0, 0.6]);
    setz("kuebel", 2.78, yS + 0.8, S0, 0.9, 1.3, kuebelFigur(winter), [2.78, yS + 1.35, S0 + 0.6]);
  }

  /* =====================================================================
     GAUBE (Schleppgaube) auf der Südseite
     ===================================================================== */
  /* Schleppgaube, 2,4 m breit, Dach 30° (Biberschwanz-Doppeldeckung
     braucht mindestens rund 30°; flacher wäre es Blech). Zwillingsfenster
     2 × 0,65 × 0,9 m. Die Front steht 2,9 m vor dem First auf dem Dach. */
  const GAUBE_TG = Math.tan(30 * RAD), GAUBE_DD = 0.16;
  function gaubeMasse(xg) {
    const x0 = xg - 1.2, x1 = xg + 1.2, yf = 2.9;
    const zr0 = dachZ(yf), ze = zr0 + 1.42;
    const tg = GAUBE_TG, dd = GAUBE_DD;
    const yj = (ZF - ze - dd - yf * tg) / (TN - tg), zj = ZF - yj * TN;
    const yv = yf + 0.22, zv = ze + dd - 0.22 * tg;
    return { x0: x0, x1: x1, yf: yf, zr0: zr0, ze: ze, tg: tg, yj: yj, zj: zj, yv: yv, zv: zv,
      punkte: [[x0, yf, zr0], [x1, yf, zr0], [x0, yf, ze], [x1, yf, ze], [x0 - 0.12, yv, zv], [x1 + 0.12, yv, zv], [x0 - 0.12, yj, zj], [x1 + 0.12, yj, zj]] };
  }
  /* Schiefer (Schuppendeckung) für die Gaubenwangen: mittleres Blaugrau
     #6f7a86 – dunkler wirkten die Wangen neben dem weißen Dach wie Löcher.
     Schuppen 20 × 25 cm (11 cm sichtbar), jede mit gerundeter Unterkante:
     darunter ein feiner Schatten, darauf eine helle Lichtkante, dazwischen
     die Stoßfugen. Alle Reihen in je EINEM Pfad; die Tonunterschiede der
     einzelnen Platten kommen aus einem Rauschmuster in Schuppengröße.
     Weit weg (unter 15 Bildpunkten je Meter) nur der gemittelte Ton. */
  function schieferMalen(g, F, w, h, saat, y0) {
    const px = F.pxV || F.px, basis = [111, 122, 134];
    y0 = y0 == null ? 0 : y0;
    g.fillStyle = rgb(basis); g.fillRect(-0.05, y0 - 0.3, w + 0.1, h - y0 + 0.4);
    /* weit weg: gemittelter, 15 % hellerer Ton (die hellen Plattenkanten
       fehlen, sonst wirkt die Wange neben dem Schnee wie ein Loch) */
    if (px < 15) { g.fillStyle = rgb(hell(basis, 0.15)); g.fillRect(-0.05, y0 - 0.3, w + 0.1, h - y0 + 0.4); rausch(g, 0, y0 - 0.3, w, h - y0 + 0.3, 1.2, 0.08, saat, 3); return; }
    const zr = 0.11, zb = 0.2;
    rausch(g, 0, y0 - 0.3, w, h - y0 + 0.3, 0.26, 0.2, saat + 3, 2);
    if (px * zr >= 4) {
      const kanten = [], fugen = [];
      let r = 0;
      for (let yy = h + zr; yy > y0 - 0.3; yy -= zr, r++) {
        const vers = (r % 2) * zb / 2;
        for (let x = -zb + vers; x < w + zb; x += zb) {
          kanten.push([x, yy]);
          fugen.push([x, yy - zb * 0.3, yy - zr]);
        }
      }
      const kurve = (dy) => { for (const [x, yy] of kanten) { g.moveTo(x, yy - zb * 0.3 + dy); g.quadraticCurveTo(x + zb * 0.08, yy + zb * 0.05 + dy, x + zb * 0.5, yy + dy); g.quadraticCurveTo(x + zb * 0.92, yy + zb * 0.05 + dy, x + zb, yy - zb * 0.3 + dy); } };
      g.lineCap = "round";
      g.beginPath(); kurve(0.012); g.lineWidth = Math.max(0.012, 1.2 / px); g.strokeStyle = "rgba(24,30,42,0.42)"; g.stroke();
      g.beginPath(); for (const [x, a, b] of fugen) { g.moveTo(x, a); g.lineTo(x, b); } g.lineWidth = Math.max(0.004, 0.7 / px); g.strokeStyle = "rgba(30,36,48,0.4)"; g.stroke();
      g.beginPath(); kurve(-0.004); g.lineWidth = Math.max(0.006, 0.8 / px); g.strokeStyle = "rgba(214,222,232,0.45)"; g.stroke();
    }
    bleich(g, 0, y0 - 0.3, w, h - y0 + 0.3, 1.6, 0.07, saat + 1);
  }
  /* Kräftiger Kamin für ein Bürgerhaus mit mehreren Öfen: 0,84 × 0,68 m,
     Oberkante Abdeckplatte 1,35 m über dem First. Er steht dicht hinter
     dem First auf der Nordseite – so schneidet ihn das Dach in einer
     schrägen Linie und nicht in einem spitzen Λ (das wirkte als Zacke). */
  const KAMIN = { x: 0.6, y: -0.85, bx: 0.42, by: 0.34, zS: ZF + 1.05, zO: ZF + 1.35 };
  KAMIN.punkte = [];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) { KAMIN.punkte.push([KAMIN.x + sx * (KAMIN.bx + 0.12), KAMIN.y + sy * (KAMIN.by + 0.12), KAMIN.zO], [KAMIN.x + sx * KAMIN.bx, KAMIN.y + sy * KAMIN.by, dachZ(KAMIN.y + sy * KAMIN.by)]); }
  /* Schlagschatten von Körpern (Punktlisten im Modell) auf eine ebene
     Fläche: Hülle aus Fußpunkten und den entlang des Lichts geworfenen
     Punkten. F.schatten liefert den Versatz für eine Höhe über der Fläche. */
  function huelle2(pts) {
    pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (pts.length < 3) return pts;
    const kr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], hi = [];
    for (const p of pts) { while (lo.length >= 2 && kr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (hi.length >= 2 && kr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
    hi.pop(); lo.pop();
    return lo.concat(hi);
  }
  function wurfSchatten(g, F, koerper, farbe) {
    if (!F.schatten || !koerper || !koerper.length) return;
    const f = F.flaeche, n = kreuz(f.u, f.v);
    g.save();
    g.fillStyle = farbe;
    for (const pts of koerper) {
      const pr = [];
      let ok = true;
      for (const P of pts) {
        const d = sub(P, f.o), a = dot(d, f.u), b = dot(d, f.v), h = dot(d, n);
        /* Punkte unter der Ebene werfen keinen Schatten auf diese Fläche
           (z. B. der Kamin hinter dem First auf das Süddach) */
        if (h < -0.02) continue;
        pr.push([a, b]);
        if (h > 0.01) { const sv = F.schatten(h); if (!sv) { ok = false; break; } pr.push([a + sv[0], b + sv[1]]); }
      }
      if (pr.length < 3) continue;
      if (!ok) break;
      const H = huelle2(pr);
      if (H.length >= 3) { poly(g, H); g.fill(); }
    }
    g.restore();
  }
  /* ph: { geruest (nur Holzgerippe), wand (Front + Wangen), dach (gedeckt),
     deck (Schnee 0…1) } – so entsteht die Gaube im Bau Schritt für Schritt */
  function gaubeBauen(M, xg, S, V, B, winter, fensterOpt, ph) {
    ph = ph || { wand: true, dach: true, deck: 1 };
    const GM = gaubeMasse(xg);
    const x0 = GM.x0, x1 = GM.x1, yf = GM.yf, zr0 = GM.zr0, ze = GM.ze, yj = GM.yj, zj = GM.zj, yv = GM.yv, zv = GM.zv;
    const nS = [0, Math.sin(NEIG), Math.cos(NEIG)];
    const nG = [0, Math.sin(30 * RAD), Math.cos(30 * RAD)];
    M.teil("gaube" + xg, { mitte: [xg * 0.08, 0.5 + nS[1] * 1.2, ZDM + nS[2] * 1.2], schatten: false });
    const fw = x1 - x0, fh = ze - zr0;
    const deck = winter ? (ph.deck == null ? 1 : ph.deck) : 0;
    if (ph.geruest) {
      /* Gerippe: Eckpfosten, Mittelpfosten, Rähm, drei Gaubensparren, Wechsel */
      const mal = rohHolz(HOLZ_ROH, 83 + (xg > 0 ? 1 : 0), winter);
      for (const x of [x0 + 0.07, xg, x1 - 0.07]) stab(M, [x, yf - 0.06, zr0], [x, yf - 0.06, ze], [1, 0, 0], 0.12, [0, 1, 0], -0.06, 0.06, mal, { dEbene: 2 });
      stab(M, [x0, yf - 0.06, ze + 0.06], [x1, yf - 0.06, ze + 0.06], Z3, 0.12, [0, 1, 0], -0.06, 0.06, mal, { dEbene: 2 });
      for (const x of [x0 + 0.06, xg, x1 - 0.06]) stab(M, [x, yj, zj - 0.08], [x, yv, zv - 0.08], [1, 0, 0], 0.1, nG, -0.07, 0.07, mal, { dEbene: 2 });
      stab(M, [x0, yj + 0.1, zj - 0.1], [x1, yj + 0.1, zj - 0.1], [0, 1, 0], 0.14, Z3, -0.07, 0.07, mal, { dEbene: 2 });
      return { x0: x0, x1: x1, yj: yj, yf: yf };
    }
    /* Front und Wangen reichen 10 cm höher bis unter das Gaubendach –
       sonst blitzte zwischen Wange, Ortbrett und Dach ein heller Spalt */
    const ext = 0.1, zt = ze + ext;
    const fen = [[0.43, 0.14, 0.65, 0.9], [1.32, 0.14, 0.65, 0.9]];
    /* Front: Fachwerkrahmen mit Zwillingsfenster, darunter Biberschwanz-Behang */
    const glieder = [
      { art: "staender", p0: [0.07, -0.02], p1: [0.07, fh + 0.02], b: 0.14 },
      { art: "staender", p0: [fw - 0.07, -0.02], p1: [fw - 0.07, fh + 0.02], b: 0.14 },
      { art: "raehm", p0: [-0.02, 0.065], p1: [fw + 0.02, 0.065], b: 0.13 },
      { art: "riegel", p0: [-0.02, 1.09], p1: [fw + 0.02, 1.09], b: 0.1 },
      { art: "staender", p0: [0.33, 0.12], p1: [0.33, 1.06], b: 0.1 },
      { art: "staender", p0: [fw - 0.33, 0.12], p1: [fw - 0.33, 1.06], b: 0.1 },
      { art: "staender", p0: [fw / 2, 0.12], p1: [fw / 2, 1.06], b: 0.12 }
    ];
    const rngF = zufall(V.saat + (xg > 0 ? 31 : 17));
    const formen = glieder.map((m) => holzForm(m, rngF));
    const rngT = zufall(V.saat + (xg > 0 ? 37 : 19));
    const toene = formen.map((f) => holzTon(S.holzC, rngT, f.m));
    const schichten = holzSchichten(formen, toene, V.saat + 900);
    const front = (g, F) => {
      const px = F.px;
      g.translate(0, ext);
      putzGrund(g, F, fw, fh, S.putzC, V.saat + 900);
      /* Untersicht des Gaubendachs über der Front */
      g.fillStyle = rgb(hell(S.holzC, -0.35)); g.fillRect(-0.05, -ext - 0.05, fw + 0.1, ext + 0.05);
      g.save(); g.beginPath(); g.rect(-0.05, 1.14, fw + 0.1, fh); g.clip();
      g.translate(0, 1.14);
      biberMalen(g, F, fw, fh - 1.14, 0, V.saat + 77, { farbe: [138, 64, 42], breite: 0.16, reihe: 0.1 });
      g.restore();
      const sv = F.schatten ? F.schatten(0.02) : null;
      if (sv && px > 5) { g.beginPath(); for (const f of formen) formPfad(g, f, sv[0], sv[1]); g.fillStyle = "rgba(34,26,20,0.36)"; g.fill(); }
      for (const sch of schichten) hoelzerMalen(g, F, sch.formen, sch.D, sch.toene);
      holzAbrieb(g, F, formen, V.saat + 5);
      for (const [x, y, w, h] of fen) fensterMalen(g, F, B, x, y, w, h, S, fensterOpt);
      if (px > 6) rausch(g, 0, 0, fw, fh, 3, 0.08, V.saat + 5, 3);
    };
    if (ph.wand) {
      const f = wandFlaeche(M, [x0, yf, zt], [0, 1, 0], fw, fh + ext, front, { name: "gaube-front", traufe: 0.22 });
      /* die kleinen Gaubenfenster leuchten nur im Bild (kein eigener
         Schein in der Szene – der kostet in jedem Bild Zeit) */
      f.leuchten = (g, F) => { g.translate(0, ext); for (const [x, y, w, h] of fen) fensterLicht(g, F, B, x, y, w, h, S, fensterOpt); };
      /* Wangen: Schiefer, unten entlang der Dachlinie ein mattes
         Anschlussblech (5 cm, nur so lang wie die Wange), darüber ein
         weicher Schatten; im Winter ein Schneekeil in der Kehle zum
         Hauptdach und ein schmaler Schneestreifen oben unter dem Ortbrett */
      const L0 = yf - yj, H0 = zt - zr0, Hj = zt - zj;
      const wange = (saat, A, Bp, T0, T1) => (g, F) => {
        schieferMalen(g, F, F.w, F.h, saat, Math.min(0, Hj));
        const band = (d0, d1) => { g.beginPath(); g.moveTo(A[0], A[1] - d0); g.lineTo(Bp[0], Bp[1] - d0); g.lineTo(Bp[0], Bp[1] - d1); g.lineTo(A[0], A[1] - d1); g.closePath(); };
        band(0.05, 0.1); g.fillStyle = "rgba(20,24,34,0.2)"; g.fill();
        band(-0.05, 0.05); g.fillStyle = "rgb(138,147,154)"; g.fill();
        band(0.042, 0.05); g.fillStyle = "rgba(40,44,52,0.35)"; g.fill();
        if (winter && deck > 0.3) {
          const rr = zufall(saat), n = 14;
          g.beginPath(); g.moveTo(A[0], A[1] + 0.03);
          for (let i = 0; i <= n; i++) {
            const t = i / n, x = A[0] + (Bp[0] - A[0]) * t, y = A[1] + (Bp[1] - A[1]) * t;
            const th = (0.05 + 0.14 * Math.sin(Math.PI * Math.min(1, t * 1.15))) * deck + (rr() - 0.5) * 0.02;
            g.lineTo(x, y - th);
          }
          g.lineTo(Bp[0], Bp[1] + 0.03); g.closePath();
          const gr = g.createLinearGradient(0, Math.min(A[1], Bp[1]) - 0.2, 0, Math.max(A[1], Bp[1]));
          gr.addColorStop(0, "rgb(248,250,254)"); gr.addColorStop(1, "rgb(206,218,238)");
          g.fillStyle = gr; g.fill();
          g.beginPath(); g.moveTo(T0[0], T0[1] - 0.02); g.lineTo(T1[0], T1[1] - 0.02); g.lineTo(T1[0], T1[1] + 0.035); g.lineTo(T0[0], T0[1] + 0.045); g.closePath();
          g.fillStyle = "rgb(238,242,249)"; g.fill();
        }
      };
      M.flaeche({ name: "wange-o", o: [x1, yf, zt], u: [0, -1, 0], v: [0, 0, -1], w: L0, h: H0, umriss: [[0, 0], [L0, Hj], [0, H0]], malen: wange(V.saat + 31, [0, H0], [L0, Hj], [0, 0], [L0, Hj]) });
      M.flaeche({ name: "wange-w", o: [x0, yj, zt], u: [0, 1, 0], v: [0, 0, -1], w: L0, h: H0, umriss: [[0, Hj], [L0, 0], [L0, H0]], malen: wange(V.saat + 37, [0, Hj], [L0, H0], [0, Hj], [L0, 0]) });
    }
    /* Dach */
    const dl = Math.hypot(yv - yj, zj - zv), dw = x1 - x0 + 0.24;
    if (ph.dach) {
      M.flaeche({
        name: "gaube-dach", o: [x0 - 0.12, yj, zj], u: [1, 0, 0], v: [0, yv - yj, zv - zj], w: dw, h: dl, ebene: 1,
        malen: (g, F) => {
          if (deck < 1) biberMalen(g, F, dw, dl, 0, V.saat + 91, { moos: winter ? 0 : 0.25 });
          if (deck > 0 && deck < 1) schneeAnsatz(g, F, dw, dl, 0, deck, V.saat + 91);
          if (deck > 0.45) { g.save(); g.globalAlpha = deck >= 1 ? 1 : (deck - 0.45) / 0.55; schneeFlaeche(g, F, -0.05, -0.05, dw + 0.1, dl + 0.1, V.saat + xg * 7 | 0, { zwischen: () => schneeRippen(g, F, dw, dl, 0, 0, V.saat + 3) }); g.restore(); }
        }
      });
    } else {
      /* Lattung auf den Gaubensparren */
      M.flaeche({ name: "gaube-latten", o: [x0 - 0.12, yj, zj], u: [1, 0, 0], v: [0, yv - yj, zv - zj], w: dw, h: dl, ebene: 1, keinLicht: true,
        malen: (g, F) => { const L = belichter(F, 0.03); for (const x of [0.06, dw / 2, dw - 0.06]) { g.fillStyle = L([176, 140, 96]); g.fillRect(x - 0.05, 0, 0.1, dl); } for (let y = 0.05; y < dl; y += 0.155) { g.fillStyle = L([188, 150, 104]); g.fillRect(-0.02, y, dw + 0.04, 0.045); g.fillStyle = L([120, 92, 60]); g.fillRect(-0.02, y + 0.04, dw + 0.04, 0.006); } } });
    }
    const brett = brettMal(hell(S.holzC, 0.05), V.saat + 3);
    wandFlaeche(M, [x0 - 0.12, yv, zv], [0, 1, 0], dw, 0.11, brett, { ebene: 2, keinAo: true, name: "gaube-traufe" });
    /* Ortbretter links und rechts entlang der Dachneigung */
    const hO = zj - zv + 0.12;
    M.flaeche({ name: "gaube-ort", o: [x1 + 0.12, yv, zj], u: [0, -1, 0], v: [0, 0, -1], w: yv - yj, h: hO,
      umriss: [[0, zj - zv], [yv - yj, 0], [yv - yj, 0.11], [0, zj - zv + 0.11]], malen: brett, ebene: 2, keinAo: true });
    M.flaeche({ name: "gaube-ort", o: [x0 - 0.12, yj, zj], u: [0, 1, 0], v: [0, 0, -1], w: yv - yj, h: hO,
      umriss: [[0, 0], [yv - yj, zj - zv], [yv - yj, zj - zv + 0.11], [0, 0.11]], malen: brett, ebene: 2, keinAo: true });
    if (ph.dach && deck > 0.3) {
      /* Schneekante vorn: gerundet, 5–8 cm überhängend, mit Buckeln
         (Licht des Gaubendachs); an den Seiten eine Schneelippe über den
         Ortbrettern mit bläulicher Unterseite */
      rechteck(M, [xg, yv + 0.06, zv + 0.02], [0, 1, 0], [1, 0, 0], dw + 0.08, 0.3, schneeKante(V.saat + xg * 3 | 0, 0.1 * deck, 0.08 * deck, B, nG, 0.5), { keinLicht: true, ebene: 3, name: "gaube-schnee" });
      if (ph.eis) rechteck(M, [xg, yv + 0.07, zv - 0.16], [0, 1, 0], [1, 0, 0], dw, 0.4, eiszapfen(V.saat + 17 + xg * 5 | 0, []), { keinLicht: true, ebene: 4, name: "gaube-eis" });
      const hS = 0.14 * deck, dl2 = yv - yj;
      const seitenSchnee = (links, saat) => (g, F) => {
        const L = lichtMal(dachLicht(F, B, nG)), w = F.w, rr = zufall(saat);
        const rake = (x) => { const t = links ? x / w : 1 - x / w; return hS + (zj - zv) * t; };
        const oben = [], unten = [];
        for (let i = 0; i <= 12; i++) {
          const x = w * i / 12;
          oben.push([x, rake(x) - hS - 0.015 * Math.sin(x * 9 + xg) - rr() * 0.01]);
          unten.push([x, rake(x) + 0.03 + 0.025 * Math.pow(Math.abs(Math.sin(x * 5.5 + saat)), 2) + rr() * 0.01]);
        }
        g.beginPath(); g.moveTo(oben[0][0], oben[0][1]);
        for (let i = 1; i <= 12; i++) g.quadraticCurveTo(oben[i - 1][0], oben[i - 1][1], (oben[i - 1][0] + oben[i][0]) / 2, (oben[i - 1][1] + oben[i][1]) / 2);
        g.lineTo(unten[12][0], unten[12][1]);
        for (let i = 11; i >= 0; i--) g.quadraticCurveTo(unten[i + 1][0], unten[i + 1][1], (unten[i + 1][0] + unten[i][0]) / 2, (unten[i + 1][1] + unten[i][1]) / 2);
        g.closePath();
        const gr = g.createLinearGradient(0, 0, 0, hS + zj - zv + 0.06);
        gr.addColorStop(0, L([248, 250, 254], 1, 1.03)); gr.addColorStop(0.6, L([232, 238, 248], 1, 0.95)); gr.addColorStop(1, L([196, 210, 234], 1, 0.85));
        g.fillStyle = gr; g.fill();
      };
      M.flaeche({ name: "gaube-schnee-o", o: [x1 + 0.14, yv, zj + hS], u: [0, -1, 0], v: [0, 0, -1], w: dl2, h: zj - zv + hS + 0.1, malen: seitenSchnee(false, V.saat + 5), keinLicht: true, ebene: 3 });
      M.flaeche({ name: "gaube-schnee-w", o: [x0 - 0.14, yj, zj + hS], u: [0, 1, 0], v: [0, 0, -1], w: dl2, h: zj - zv + hS + 0.1, malen: seitenSchnee(true, V.saat + 9), keinLicht: true, ebene: 3 });
    }
    return { x0: x0, x1: x1, yj: yj, yf: yf };
  }

  /* =====================================================================
     KAMIN auf dem First: Klinker, Kaminkopf, Abdeckplatte
     ===================================================================== */
  function kaminBauen(M, S, V, B, winter, wachs, deck) {
    wachs = wachs == null ? 1 : wachs;
    deck = deck == null ? 1 : deck;
    const kx = KAMIN.x, ky = KAMIN.y, bx = KAMIN.bx, by = KAMIN.by;
    /* Der Schaft wächst Schicht für Schicht aus dem Dach, zuletzt Kopf und Platte */
    const zS = wachs >= 1 ? KAMIN.zS : ZF + 0.2 + (KAMIN.zS - ZF - 0.2) * Math.floor(klemm(wachs / 0.85, 0, 1) * 10) / 10;
    /* Reihenfolge: von Süden gesehen hinter First und Süddach, von Norden
       und schräg von hinten (190–220°) VOR dem First. Die Mitte liegt
       deshalb auf Firsthöhe weit im Norden: bei 200° 6,76 > First 6,32,
       bei 0° 5,16 < Süddach 5,5 < First. */
    M.teil("kamin", { mitte: [KAMIN.x, -2.5, ZF] });
    const zB = dachZ(ky + by), zT = dachZ(ky - by);        // Dach an der Berg- und Talseite
    const schnee = winter && deck > 0.5;
    const mal = klinkerMal(V.saat + 11, winter, wachs >= 1 ? 0.3 : 0);
    const malO = wachs >= 1 ? klinkerMal(V.saat + 11, winter, 0.3, 0.58) : mal;
    /* Blechverwahrung: 12 cm hohes Band parallel zur Dachlinie; im
       Winter staut sich bergseitig ein weicher Schneewulst */
    const fuss = (h0, h1, wulst0, wulst1, m) => (g, F) => {
      (m || mal)(g, F);
      const bh = 0.12, W = F.w;
      const linie = (d) => { g.beginPath(); g.moveTo(-0.05, h0 - d - 0.05 * (h1 - h0) / W); g.lineTo(W + 0.05, h1 - d + 0.05 * (h1 - h0) / W); };
      linie(bh); g.lineTo(W + 0.1, Math.max(h0, h1) + 0.3); g.lineTo(-0.1, Math.max(h0, h1) + 0.3); g.closePath();
      g.fillStyle = "rgb(134,142,148)"; g.fill();
      linie(bh); g.strokeStyle = "rgba(220,226,230,0.7)"; g.lineWidth = Math.max(0.012, 0.8 / F.px); g.stroke();
      if (schnee) {
        const rr = zufall(V.saat + (h0 * 100 | 0));
        g.beginPath(); g.moveTo(-0.05, h0 - wulst0);
        for (let x = 0; x <= W + 0.05; x += 0.08) { const t = klemm(x / W, 0, 1); g.lineTo(x, h0 + (h1 - h0) * t - (wulst0 + (wulst1 - wulst0) * t) - rr() * 0.03); }
        g.lineTo(W + 0.1, Math.max(h0, h1) + 0.3); g.lineTo(-0.1, Math.max(h0, h1) + 0.3); g.closePath();
        const gs = g.createLinearGradient(0, Math.min(h0, h1) - 0.3, 0, Math.max(h0, h1));
        gs.addColorStop(0, "rgb(250,252,255)"); gs.addColorStop(1, "rgb(230,236,246)");
        g.fillStyle = gs; g.fill();
      }
    };
    const hB = zS - zB, hT = zS - zT;
    wandFlaeche(M, [kx - bx, ky + by, zS], [0, 1, 0], 2 * bx, hB, fuss(hB, hB, 0.26, 0.26), { name: "kamin-s", keinAo: true });
    wandFlaeche(M, [kx + bx, ky - by, zS], [0, -1, 0], 2 * bx, hT, fuss(hT, hT, 0.1, 0.1), { name: "kamin-n", keinAo: true });
    wandFlaeche(M, [kx + bx, ky + by, zS], [1, 0, 0], 2 * by, hT, fuss(hB, hT, 0.24, 0.1, malO), { name: "kamin-o", keinAo: true, umriss: [[0, 0], [2 * by, 0], [2 * by, hT], [0, hB]] });
    wandFlaeche(M, [kx - bx, ky - by, zS], [-1, 0, 0], 2 * by, hT, fuss(hT, hB, 0.1, 0.24), { name: "kamin-w", keinAo: true, umriss: [[0, 0], [2 * by, 0], [2 * by, hB], [0, hT]] });
    const box = (o, z0, z1, m, ob, mO) => {
      M.quader({ x: kx - bx - o, y: ky - by - o, z: z0, b: 2 * (bx + o), t: 2 * (by + o), h: z1 - z0 }, { sued: m, nord: m, ost: mO || m, west: m, oben: ob }, { keinAo: true });
    };
    if (wachs < 1) {
      box(0, zS - 0.01, zS, null, (g, F) => { g.fillStyle = "rgb(128,118,106)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); g.fillStyle = "rgb(30,26,24)"; g.fillRect(F.w / 2 - 0.14, F.h / 2 - 0.1, 0.28, 0.2); });
      return kx;
    }
    /* Kaminkopf: drei auskragende Klinkerschichten, verrußt; auf der
       Leeseite (Osten) läuft eine Rußfahne herunter */
    const kopf = klinkerMal(V.saat + 13, winter, 0.9), kopfO = klinkerMal(V.saat + 13, winter, 0.9, 0.58);
    const deckRuss = (g, F) => { g.fillStyle = "rgb(58,50,46)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); };
    for (let k = 0; k < 3; k++) box(0.03 * (k + 1), zS + 0.08 * k, zS + 0.08 * (k + 1), kopf, k === 2 ? null : deckRuss, kopfO);
    /* Abdeckplatte (Sandstein, 6 cm): helle Oberkante, darunter die
       Tropfnase (Rille); im Winter Schnee nur auf den Ecken */
    const platte = (g, F) => {
      const w = F.w, h = F.h;
      g.fillStyle = "rgb(152,142,132)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      if (F.px > 10) rausch(g, 0, 0, w, h, 0.4, 0.3, 5, 3);
      g.fillStyle = "rgba(255,248,236,0.35)"; g.fillRect(-0.05, 0, w + 0.1, Math.min(0.01, h * 0.2));
      g.fillStyle = "rgba(30,24,20,0.45)"; g.fillRect(-0.05, h * 0.68, w + 0.1, Math.max(0.006, h * 0.12));
      g.fillStyle = "rgba(30,24,20,0.25)"; g.fillRect(-0.05, h * 0.8, w + 0.1, h * 0.25);
      if (schnee) {
        g.fillStyle = "rgb(243,246,251)";
        for (const x of [0, w]) { g.beginPath(); g.ellipse(x, 0.004, 0.09, 0.022, 0, Math.PI, 0); g.lineTo(x + 0.09, 0.012); g.lineTo(x - 0.09, 0.012); g.closePath(); g.fill(); }
      }
    };
    /* Deckel: Schnee liegt nur auf den Ecken – um den Zug hat die warme
       Luft ihn weggetaut: ein nasser, dunkler Fleck mit unregelmäßigem,
       scharfem Rand. Direkt am Zug ein 2–3 cm Rußrand, der Zug selbst
       hat Tiefe (Innenwände per Parallaxe). */
    const deckel = (g, F) => {
      const w = F.w, h = F.h, cx = w / 2, cy = h / 2, px = F.px, zb = 0.28, zh = 0.2;
      g.fillStyle = "rgb(160,152,142)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      if (px > 10) rausch(g, 0, 0, w, h, 0.4, 0.3, 7, 3);
      if (schnee) {
        g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
        const rr = zufall(V.saat + 61), pts = [], matsch = [];
        for (let i = 0; i < 16; i++) {
          const a = i / 16 * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
          const k = Math.pow(Math.pow(Math.abs(ca), 3) + Math.pow(Math.abs(sa), 3), -1 / 3);
          const f = 0.55 + 0.3 * ST.fbm(Math.cos(a) * 1.3 + 3, Math.sin(a) * 1.3 + V.saat * 0.1, 2, V.saat) + rr() * 0.12;
          pts.push([cx + ca * k * (w / 2) * f, cy + sa * k * (h / 2) * f]);
          matsch.push([cx + ca * k * (w / 2) * (f + 0.06 + rr() * 0.05), cy + sa * k * (h / 2) * (f + 0.06 + rr() * 0.05)]);
        }
        /* Rand: nasser Matsch, dann der dunkle, nasse Stein */
        g.beginPath(); glattPfad(g, matsch); g.fillStyle = "rgb(196,200,206)"; g.fill();
        g.beginPath(); glattPfad(g, pts); g.fillStyle = "rgb(108,100,94)"; g.fill();
        if (px > 30) { g.fillStyle = "rgba(255,255,255,0.12)"; g.beginPath(); g.ellipse(cx - w * 0.12, cy - h * 0.1, w * 0.12, h * 0.05, -0.3, 0, Math.PI * 2); g.fill(); }
      }
      g.beginPath(); rundPfad(g, cx - zb / 2 - 0.028, cy - zh / 2 - 0.028, zb + 0.056, zh + 0.056, 0.03);
      g.fillStyle = "rgba(30,24,22,0.85)"; g.fill();
      g.save(); g.beginPath(); g.rect(cx - zb / 2, cy - zh / 2, zb, zh); g.clip();
      g.fillStyle = "rgb(52,42,38)"; g.fillRect(cx - zb / 2, cy - zh / 2, zb, zh);
      const p = B && B.e ? parallaxe(F, B, 0.35) : [0, 0.1];
      g.fillStyle = "rgb(10,8,8)"; g.fillRect(cx - zb / 2 + p[0], cy - zh / 2 + p[1], zb, zh);
      g.restore();
      if (px > 25) { g.strokeStyle = "rgba(255,240,225,0.25)"; g.lineWidth = 0.01; g.strokeRect(cx - zb / 2 - 0.028, cy - zh / 2 - 0.028, zb + 0.056, zh + 0.056); }
    };
    box(0.12, zS + 0.24, zS + 0.3, platte, deckel);
    M.rauchAus(kx, ky, zS + 0.36, 1);
    return kx;
  }

  /* =====================================================================
     TREPPE vor der Haustür (Sandsteinstufen, Wangen, Fußabtreter)
     ===================================================================== */
  /* Freitreppe parallel zur Fassade (wie am Marktplatz üblich): Podest
     vor der Haustür, fünf Stufen nach Westen hinab, unter dem Podest die
     Kellertür. hMax: so hoch ist das Mauerwerk schon (wächst mit dem
     Sockel). geländer: erst mit der Tür (Ausbau). */
  const TR = { x0: 1.0, x1: 3.0, tief: 1.1, auf: 0.3, st: 0.2 };
  TR.xa = (k) => TR.x0 - (6 - k) * TR.auf;           // Vorderkante Stufe k (1…5)
  /* Schein der Hauslaterne auf den Trittflächen. Als „danach" gemalt
     (nach dem Licht, in der richtigen Tiefenreihenfolge): so liegt das
     Geländer davor und nicht unter einem aufgemalten Lichtband. Weicher,
     runder Abfall über gut 1,5 m, keine harten Ränder; die Setzstufen
     (von der Laterne abgewandt) bleiben dunkel. */
  function treppenLicht(B, x0, y0, z0) {
    return function (g, F) {
      if (F.nacht <= 0.02) return;
      const lx = -XE + 5.45 - x0, ly = YE + 0.3 - y0, dz = ZE0 + 1.95 - z0;
      const r = 1.5 + dz * 0.35, a = F.nacht * 0.3 / (1 + dz * 0.3);
      g.save(); g.globalCompositeOperation = "lighter";
      const gg = g.createRadialGradient(lx, ly, 0, lx, ly, r);
      gg.addColorStop(0, "rgba(255,186,110," + a.toFixed(3) + ")");
      gg.addColorStop(0.35, "rgba(255,176,100," + (a * 0.55).toFixed(3) + ")");
      gg.addColorStop(0.7, "rgba(255,166,90," + (a * 0.16).toFixed(3) + ")");
      gg.addColorStop(1, "rgba(255,160,80,0)");
      g.fillStyle = gg; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      g.restore();
    };
  }
  function treppeBauen(M, B, winter, V, hMax, gelaender, fruehling) {
    const y0 = YE + SV, y1 = y0 + TR.tief, st = TR.st;
    hMax = Math.min(S0, hMax == null ? S0 : hMax);
    if (hMax < 0.05) return;
    M.teil("treppe", { mitte: [1.0, y0 + 0.6, 0.6] });
    const stein = [168, 108, 88];
    /* Trittfläche: Kante zum Abgang (Flächen-x = 0) gerundet und heller,
       in der Mitte ausgetreten; Winter: Schneereste in den Ecken */
    const tritt = (k, w, h, kante) => (g, F) => {
      g.fillStyle = rgb(hell(stein, 0.08)); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      if (F.px > 10) rausch(g, 0, 0, w, h, 0.5, 0.3, 40 + k, 3);
      const gg = g.createRadialGradient(w * 0.45, h * 0.55, 0, w * 0.45, h * 0.55, Math.max(w, h) * 0.45);
      gg.addColorStop(0, "rgba(255,236,220,0.16)"); gg.addColorStop(1, "rgba(255,236,220,0)");
      g.fillStyle = gg; g.fillRect(0, 0, w, h);
      if (kante) {
        const gk = g.createLinearGradient(0, 0, 0.06, 0);
        gk.addColorStop(0, "rgba(255,245,235,0.3)"); gk.addColorStop(1, "rgba(255,245,235,0)");
        g.fillStyle = gk; g.fillRect(0, 0, 0.06, h);
      }
      if (k === 6 && F.px > 8) {
        /* Fußabtreter aus Kokos vor der Tür */
        const mx = (2.0 - TR.x0) - 0.45, my = 0.12;
        g.fillStyle = "rgb(120,86,52)"; PI.rundRechteck(g, mx, my, 0.9, 0.5, 0.02); g.fill();
        if (F.px > 20) { rausch(g, mx, my, 0.9, 0.5, 0.12, 0.45, 9, 2); g.strokeStyle = "rgba(70,48,28,0.8)"; g.lineWidth = 0.015; PI.rundRechteck(g, mx + 0.03, my + 0.03, 0.84, 0.44, 0.015); g.stroke(); }
      }
      if (winter) {
        g.fillStyle = "rgb(243,247,252)";
        /* an der Hauswand (Flächen-y = 0) und am Setzstufen-Winkel liegt Schnee */
        g.beginPath(); g.moveTo(-0.05, -0.05); g.lineTo(w + 0.05, -0.05); g.lineTo(w + 0.05, 0.12);
        for (let x = w; x > -0.05; x -= 0.1) g.lineTo(x, 0.1 + Math.sin(x * 11 + k) * 0.04);
        g.closePath(); g.fill();
        if (k < 6) { g.beginPath(); g.moveTo(w + 0.05, -0.05); g.lineTo(w - 0.1, -0.05); for (let y = 0; y < h + 0.05; y += 0.1) g.lineTo(w - 0.06 - Math.sin(y * 13 + k) * 0.035, y); g.lineTo(w + 0.05, h + 0.05); g.closePath(); g.fill(); }
        g.fillStyle = "rgba(236,242,250,0.35)"; g.fillRect(0, 0, w, h);
      }
    };
    const setz = (k) => (g, F) => {
      const w = F.w, h = F.h;
      g.fillStyle = rgb(stein); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      if (F.px > 10) rausch(g, 0, 0, w, h, 0.5, 0.3, 60 + k, 3);
      g.fillStyle = "rgba(255,240,230,0.2)"; g.fillRect(-0.05, 0, w + 0.1, 0.03);
      g.fillStyle = "rgba(40,20,15,0.3)"; g.fillRect(-0.05, h - 0.02, w + 0.1, 0.02);
      if (winter) { g.fillStyle = "rgb(243,247,252)"; g.fillRect(w - 0.12, -0.05, 0.17, 0.05); }
    };
    /* Trittflächen der Stufen und Setzstufen (nach Westen gewandt) */
    for (let k = 1; k <= 6; k++) {
      const z = k * st;
      if (z > hMax + 0.001) break;
      const xa = k < 6 ? TR.xa(k) : TR.x0, xb = k < 6 ? xa + TR.auf : TR.x1;
      if (k < 6 || hMax >= S0 - 0.001) M.flaeche({ name: "tritt" + k, o: [xa, y0, z], u: [1, 0, 0], v: [0, 1, 0], w: xb - xa, h: TR.tief, malen: tritt(k, xb - xa, TR.tief, true), danach: treppenLicht(B, xa, y0, z) });
      wandFlaeche(M, [xa, y0, z], [-1, 0, 0], TR.tief, st, setz(k), { name: "setz" + k, keinAo: k > 1, ao: k === 1 });
    }
    /* Oberseite des noch wachsenden Podests */
    if (hMax < S0 - 0.001) {
      const kk = Math.floor(hMax / st + 1e-6), xa = kk >= 5 ? TR.x0 : TR.xa(kk + 1);
      M.flaeche({ name: "podest-roh", o: [xa, y0, hMax], u: [1, 0, 0], v: [0, 1, 0], w: TR.x1 - xa, h: TR.tief, malen: (g, F) => { g.fillStyle = "rgb(150,98,80)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); if (F.px > 8) rausch(g, 0, 0, F.w, F.h, 0.6, 0.3, 17, 3); g.fillStyle = "rgba(200,190,170,0.8)"; g.fillRect(-0.05, F.h * 0.5, F.w + 0.1, 0.02); if (winter) { g.fillStyle = "rgba(240,244,250,0.6)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); } } });
    }
    /* Südwange: Treppenprofil + Podest, Mainsandstein in Stufenhöhe
       gemauert, im Podest die Kellertür */
    const xs = TR.xa(1), prof = [[xs, 0]];
    for (let k = 1; k <= 5; k++) { const z = Math.min(hMax, k * st); prof.push([TR.xa(k), z], [TR.xa(k) + TR.auf, z]); }
    prof.push([TR.x0, hMax], [TR.x1, hMax], [TR.x1, 0]);
    const wS = TR.x1 - xs;
    const um = prof.map(([x, z]) => [x - xs, S0 - z]);
    const suedMal = (g, F) => {
      sandsteinMalen(g, F, 0, 0, wS, S0, [0.2, 0.2, 0.2, 0.2, 0.2, 0.2], V.saat + 5, { laenge: 0.6, fruehling: fruehling, ecken: false });
      if (hMax >= S0 - 0.001) kellertuer(g, F, B, (TR.x0 + TR.x1) / 2 - xs, S0, winter);
    };
    M.flaeche({ name: "treppe-sued", o: [xs, y1, S0], u: [1, 0, 0], v: [0, 0, -1], w: wS, h: S0, umriss: um, malen: suedMal, ao: true });
    const ostMal = (g, F) => sandsteinMalen(g, F, 0, 0, F.w, F.h, [0.2, 0.2, 0.2, 0.2, 0.2, 0.2].slice(0, Math.ceil(hMax / 0.2 - 1e-6)), V.saat + 9, { laenge: 0.6, fruehling: fruehling, ecken: false });
    wandFlaeche(M, [TR.x1, y1, hMax], [1, 0, 0], TR.tief, hMax, ostMal, { name: "treppe-ost", ao: true });
    /* Geländer erst im Ausbau */
    if (gelaender) {
      const pts = [[xs + 0.08, y1 - 0.06, st], [TR.x0, y1 - 0.06, S0], [TR.x1 - 0.06, y1 - 0.06, S0], [TR.x1 - 0.06, y0 + 0.06, S0]];
      const f = pts[0];
      M.figur({ x: f[0], y: f[1], z: f[2], breite: 4.2, hoehe: 2.4, schatten: false,
        malen: handlaufFigur(B, pts.map((p) => [p[0] - f[0], p[1] - f[1], p[2] - f[2]]).map((p, i) => i === 0 ? p : p), winter) });
    }
  }
  /* Kellertür unter dem Podest: Rundbogen aus Sandstein, Bohlentür mit
     Bändern und kleinem Gitterfenster, 12 cm zurückliegend */
  function kellertuer(g, F, B, cx, yBoden, winter) {
    const w = 0.76, hT = 0.98, r = w / 2, x = cx - r, ys = yBoden - hT + r, gw = 0.12;
    g.save();
    g.fillStyle = "rgb(176,120,98)";
    g.beginPath(); g.moveTo(x - gw, yBoden); g.lineTo(x - gw, ys); g.arc(cx, ys, r + gw, Math.PI, 0); g.lineTo(x + w + gw, yBoden); g.closePath(); g.fill();
    if (F.px > 10) { g.strokeStyle = "rgba(90,56,44,0.6)"; g.lineWidth = Math.max(0.008, 0.8 / F.px); for (let i = 1; i < 6; i++) { const a = Math.PI + Math.PI * i / 6; g.beginPath(); g.moveTo(cx + Math.cos(a) * r, ys + Math.sin(a) * r); g.lineTo(cx + Math.cos(a) * (r + gw), ys + Math.sin(a) * (r + gw)); g.stroke(); } }
    const loch = () => { g.beginPath(); g.moveTo(x, yBoden); g.lineTo(x, ys); g.arc(cx, ys, r, Math.PI, 0); g.lineTo(x + w, yBoden); g.closePath(); };
    loch(); g.clip();
    g.fillStyle = "rgb(96,62,50)"; g.fillRect(x - 0.1, ys - r - 0.1, w + 0.2, hT + 0.2);
    const p = parallaxe(F, B, 0.12);
    g.translate(p[0], p[1]);
    const holz = [92, 64, 44];
    for (let i = 0; i < 5; i++) { const c = hell(holz, (i % 2 ? -0.06 : 0.04)); g.fillStyle = rgb(c); g.fillRect(x + w * i / 5, ys - r, w / 5 + 0.002, hT + 0.1); g.fillStyle = "rgba(20,12,8,0.5)"; g.fillRect(x + w * (i + 1) / 5 - 0.006, ys - r, 0.006, hT + 0.1); }
    if (F.px > 10) rausch(g, x, ys - r, w, hT, 0.6, 0.25, 33, 3);
    g.fillStyle = "rgb(30,28,28)";
    for (const yy of [ys + 0.1, yBoden - 0.22]) g.fillRect(x, yy, w * 0.7, 0.025);
    g.fillRect(cx - 0.1, ys - 0.12, 0.2, 0.12);
    g.strokeStyle = "rgb(60,58,56)"; g.lineWidth = 0.012; for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(cx - 0.1 + i * 0.05, ys - 0.12); g.lineTo(cx - 0.1 + i * 0.05, ys); g.stroke(); }
    g.restore();
    const sv = F.schatten ? F.schatten(0.12) : null;
    if (sv) { g.save(); loch(); g.clip(); g.fillStyle = "rgba(20,12,12,0.35)"; g.beginPath(); g.rect(x - 1, ys - 1, w + 2, hT + 2); g.moveTo(x + sv[0], yBoden + 1); g.lineTo(x + sv[0], ys + sv[1]); g.arc(cx + sv[0], ys + sv[1], r, Math.PI, 0); g.lineTo(x + w + sv[0], yBoden + 1); g.closePath(); g.fill("evenodd"); g.restore(); }
    if (winter) { g.fillStyle = "rgb(243,247,252)"; g.beginPath(); g.ellipse(cx, yBoden, w * 0.7, 0.08, 0, Math.PI, 0); g.fill(); }
  }

  /* =====================================================================
     DAS FERTIGE HAUS
     ===================================================================== */
  function wandDef(name, O, N, L, H, x) {
    return Object.assign({ name: name, O: O, N: N, A: kreuz(N, Z), L: L, H: H, saatZ: ST.textHash(name) % 997 }, x || {});
  }
  const HEG = ZE1 - ZE0, HOG = ZO1 - ZB1, GH = ZGS - ZD;
  /* Die Pläne hängen nur von den Maßen ab → einmal ausrechnen */
  const PLAENE = (function () {
    const egO = { fu: 1.1, fo: 2.44 }, ogO = { fu: 1.0, fo: 2.34, hs: 0.2 };
    return {
      "eg-sued": fachwerkPlan(2 * XE, HEG, [["E", 1.3], ["F", 1.15, "kreuz"], ["G", 1.1, "raute"], ["F", 1.15, "kreuz"], ["G", 0.9], ["T", 1.6], ["E", 1.6]], egO),
      "eg-ost": fachwerkPlan(2 * YE, HEG, [["E", 1.6], ["F", 1.15, "kreuz"], ["G", 1.3, "raute"], ["F", 1.15, "kreuz"], ["E", 1.6]], egO),
      "eg-nord": fachwerkPlan(2 * XE, HEG, [["E", 1.4], ["F", 1.15], ["G", 1.25], ["M", 1.6], ["G", 1.25], ["F", 1.15], ["E", 1.0]], egO),
      "eg-west": fachwerkPlan(2 * YE, HEG, [["E", 1.6], ["F", 1.15, "kreuz"], ["G", 1.3], ["F", 1.15, "kreuz"], ["E", 1.6]], egO),
      "og-sued": fachwerkPlan(2 * XO, HOG, [["E", 1.15], ["F", 1.05, "feuerbock"], ["G", 0.8, "kreuz"], ["F", 1.05, "raute"], ["M", 1.5], ["F", 1.05, "raute"], ["G", 0.8, "kreuz"], ["F", 1.05, "feuerbock"], ["E", 1.15]], ogO),
      "og-ost": fachwerkPlan(2 * YO, HOG, [["E", 1.425], ["F", 1.05, "geschweift"], ["G", 0.8, "kreuz"], ["F", 1.05, "kreuzraute"], ["G", 0.8, "kreuz"], ["F", 1.05, "geschweift"], ["E", 1.425]], ogO),
      "og-nord": fachwerkPlan(2 * XO, HOG, [["E", 1.15], ["F", 1.05, "kreuz"], ["G", 0.8], ["F", 1.05, "kreuz"], ["M", 1.5], ["F", 1.05, "kreuz"], ["G", 0.8], ["F", 1.05, "kreuz"], ["E", 1.15]], ogO),
      "og-west": fachwerkPlan(2 * YO, HOG, [["E", 1.425], ["F", 1.05, "raute"], ["G", 0.8, "kreuz"], ["F", 1.05, "feuerbock"], ["G", 0.8, "kreuz"], ["F", 1.05, "raute"], ["E", 1.425]], ogO),
      "giebel": giebelPlan(YO, GH),
      "giebel-west": giebelPlan(YO, GH, { west: true })
    };
  })();
  const PLAENE_F = {};
  for (const k in PLAENE) PLAENE_F[k] = planFlaeche(PLAENE[k]);

  function wandListe() {
    return [
      wandDef("eg-sued", [-XE, YE, ZE0], [0, 1, 0], 2 * XE, HEG, { unten: true, stock: "eg" }),
      wandDef("eg-ost", [XE, YE, ZE0], [1, 0, 0], 2 * YE, HEG, { unten: true, stock: "eg" }),
      wandDef("eg-nord", [XE, -YE, ZE0], [0, -1, 0], 2 * XE, HEG, { unten: true, stock: "eg" }),
      wandDef("eg-west", [-XE, -YE, ZE0], [-1, 0, 0], 2 * YE, HEG, { unten: true, stock: "eg" }),
      wandDef("og-sued", [-XO, YO, ZB1], [0, 1, 0], 2 * XO, HOG, { schnitz: true, stock: "og" }),
      wandDef("og-ost", [XO, YO, ZB1], [1, 0, 0], 2 * YO, HOG, { schnitz: true, stock: "og" }),
      wandDef("og-nord", [XO, -YO, ZB1], [0, -1, 0], 2 * XO, HOG, { stock: "og" }),
      wandDef("og-west", [-XO, -YO, ZB1], [-1, 0, 0], 2 * YO, HOG, { schnitz: true, stock: "og" }),
      wandDef("giebel-ost", [XG, YO, ZD], [1, 0, 0], 2 * YO, GH, { stock: "giebel", plan: "giebel" }),
      wandDef("giebel-west", [-XG, -YO, ZD], [-1, 0, 0], 2 * YO, GH, { stock: "giebel", plan: "giebel-west" })
    ];
  }

  /* Welches Fenster bekommt was? (fest je Saat, Wand und Nummer) */
  function fensterWahl(W, i, o, V, winter) {
    const h = ST.hash2(ST.textHash(W.name) % 1000, i, V.saat);
    const h2 = ST.hash2(i + 7, ST.textHash(W.name) % 777, V.saat + 3);
    const sued = W.N[1] > 0.5, nord = W.N[1] < -0.5;
    const h3 = ST.hash2(i + 13, ST.textHash(W.name) % 555, V.saat + 5);
    const fo = { vorhang: h2 < 0.6 ? V.vorhang : "#ece2cc", an: h < 0.72 ? 1 : 0, klein: o.klein, gardine: h3 < 0.4, lampeX: 0.3 + h3 * 0.4 };
    /* Läden nur im Erdgeschoss. Im Zierfachwerk-Giebel stehen die beiden
       Fenster nur 20 cm auseinander – aufgeklappte Läden würden sich dort
       gegenseitig (und den großen Stern) überdecken; an Marktplatzhäusern
       haben die Giebelfenster deshalb keine Läden. */
    fo.laeden = W.stock === "eg";
    if (winter && nord && W.stock === "og" && i === 1) { fo.zu = true; fo.laeden = true; fo.an = 0; }
    if (winter && !o.klein) {
      if (W.stock === "og" && sued && (i === 1 || i === 2)) fo.deko = "stern";
      else if (h2 < 0.55) fo.deko = "schwibbogen";
      else if (h2 < 0.65 && !nord) fo.deko = "beides";
    }
    /* Großer Herrnhuter Stern (Ø 0,6 m) im Ostgiebel – leuchtet weit */
    if (winter && W.name === "giebel-ost" && i === 0) { fo.deko = "stern"; fo.sternGross = true; fo.an = 1; fo.laeden = false; }
    /* Frühling: ein Flügel steht halb offen, die Gardine weht heraus */
    if (!winter && W.name === "og-sued" && i === 2) fo.offen = true;
    if (W.stock !== "giebel" && !nord) fo.kasten = winter ? "winter" : "sommer";
    if (W.stock === "eg" && nord) fo.kasten = null;
    fo.farbe = h < 0.2 ? [255, 206, 140] : [255, 188, 104];
    fo.blumen = V.blumen;
    return fo;
  }

  /* Innenschale einer Wand (nur im Bau, solange das Geschoss oben offen
     ist): sonst fehlen von oben gesehen die hinteren Wände */
  function innenSchale(M, W, SW, umriss) {
    const PF = W.PF, L = PF.L, H = PF.H;
    const o = add(add(add(W.O, [0, 0, W.H]), mul(W.N, -0.18)), mul(W.A, W.L));
    wandFlaeche(M, o, mul(W.N, -1), L, H, (g, F) => {
      const c = hell(SW.putzC, -0.1), hc = hell(SW.holzC, -0.08);
      g.fillStyle = rgb(c); g.fillRect(-0.05, -0.05, L + 0.1, H + 0.1);
      if (F.px > 4) {
        g.strokeStyle = rgb(hc); g.lineCap = "butt";
        for (const m of PF.glieder) { g.lineWidth = m.b; g.beginPath(); g.moveTo(L - m.p0[0], m.p0[1]); if (m.k) g.quadraticCurveTo(L - m.k[0], m.k[1], L - m.p1[0], m.p1[1]); else g.lineTo(L - m.p1[0], m.p1[1]); g.stroke(); }
        if (F.px > 10) rausch(g, 0, 0, L, H, 2, 0.12, 5, 3);
      }
      for (const op of PF.oeff) {
        const gr = g.createLinearGradient(0, op.y, 0, op.y + op.h);
        gr.addColorStop(0, "rgb(170,190,214)"); gr.addColorStop(1, "rgb(120,134,150)");
        g.fillStyle = op.art === "tuer" ? rgb(hell(hc, -0.2)) : gr; g.fillRect(L - op.x - op.w, op.y, op.w, op.h);
      }
      const gs = g.createLinearGradient(0, H, 0, H - 0.8);
      gs.addColorStop(0, "rgba(40,30,24,0.35)"); gs.addColorStop(1, "rgba(40,30,24,0)");
      g.fillStyle = gs; g.fillRect(0, H - 0.8, L, 0.8);
    }, { name: W.name + "-innen", keinAo: true, umriss: umriss ? umriss.map(([a, b]) => [L - a, b]) : undefined });
  }

  /* Wasserschlag: schräge Sandsteinkante oben am Sockel, damit Regen
     vom Fachwerk weg abläuft */
  function wasserschlag(M, X, Y, d, zU, zO, winter) {
    const hs = Math.hypot(d, zO - zU);
    const mal = (g, F) => {
      g.fillStyle = "rgb(166,112,94)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      g.fillStyle = "rgba(255,240,230,0.25)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h * 0.3);
      if (F.px > 12) rausch(g, 0, 0, F.w, F.h, 0.6, 0.25, 51, 3);
      if (winter) { g.fillStyle = "rgba(243,247,252,0.85)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h * 0.7); }
    };
    const seiten = [
      { o: [-X + d, Y - d, zO], u: [1, 0, 0], v: [0, d, zU - zO], w: 2 * X },
      { o: [X - d, -Y + d, zO], u: [-1, 0, 0], v: [0, -d, zU - zO], w: 2 * X },
      { o: [X - d, Y - d, zO], u: [0, -1, 0], v: [d, 0, zU - zO], w: 2 * Y },
      { o: [-X + d, -Y + d, zO], u: [0, 1, 0], v: [-d, 0, zU - zO], w: 2 * Y }
    ];
    for (const q of seiten) {
      const o = sub(q.o, mul(q.u, d));
      M.flaeche({ name: "wasserschlag", o: o, u: q.u, v: q.v, w: q.w, h: hs, umriss: [[d, 0], [q.w - d, 0], [q.w, hs], [0, hs]], malen: mal, keinAo: true });
    }
  }
  /* Kellerfenster: Sandsteingewände, dunkle Öffnung mit Laibung, Gitter */
  /* Kellerfenster: Gewände aus demselben Sandstein (Sturz, Bank, zwei
     Pfosten, 9 cm breit, innen gefast), 25 cm tiefe Laibung mit Schatten,
     geschmiedetes Gitter */
  function kellerfensterMalen(g, F, B, xm, yo, winter) {
    const w = 0.6, h = 0.4, x = xm - w / 2, y = yo, gw = 0.09, px = F.px;
    const stein = hell(SANDSTEIN, 0.08);
    g.fillStyle = rgb(stein); g.fillRect(x - gw, y - gw, w + 2 * gw, h + 2 * gw + 0.02);
    if (px > 12) {
      rausch(g, x - gw, y - gw, w + 2 * gw, h + 2 * gw, 0.4, 0.22, 17, 3);
      /* Fugen zwischen Sturz, Pfosten und Bank */
      g.beginPath();
      g.moveTo(x - gw, y); g.lineTo(x, y); g.moveTo(x + w, y); g.lineTo(x + w + gw, y);
      g.moveTo(x - gw, y + h); g.lineTo(x, y + h); g.moveTo(x + w, y + h); g.lineTo(x + w + gw, y + h);
      g.rect(x - gw, y - gw, w + 2 * gw, h + 2 * gw + 0.02);
      g.lineWidth = Math.max(0.008, 0.8 / px); g.strokeStyle = "rgba(70,44,36,0.55)"; g.stroke();
      /* Fase: oben und links im Licht, unten und rechts dunkel */
      const f = 0.025;
      g.fillStyle = "rgba(255,232,214,0.22)";
      g.beginPath(); g.moveTo(x - f, y - f); g.lineTo(x + w + f, y - f); g.lineTo(x + w, y); g.lineTo(x, y); g.lineTo(x, y + h); g.lineTo(x - f, y + h + f); g.closePath(); g.fill();
      g.fillStyle = "rgba(50,24,18,0.3)";
      g.beginPath(); g.moveTo(x + w + f, y - f); g.lineTo(x + w + f, y + h + f); g.lineTo(x - f, y + h + f); g.lineTo(x, y + h); g.lineTo(x + w, y + h); g.lineTo(x + w, y); g.closePath(); g.fill();
    }
    /* Laibung und dunkler Keller dahinter */
    const gi = g.createLinearGradient(0, y, 0, y + h);
    gi.addColorStop(0, "rgb(12,11,11)"); gi.addColorStop(1, "rgb(30,26,24)");
    g.fillStyle = gi; g.fillRect(x, y, w, h);
    const p = parallaxe(F, B, 0.25);
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    g.fillStyle = rgb(hell(stein, -0.25)); if (p[1] < 0) g.fillRect(x, y + h + p[1], w, -p[1]);
    g.fillStyle = rgb(hell(stein, -0.45)); if (p[0] > 0) g.fillRect(x, y, p[0], h); else g.fillRect(x + w + p[0], y, -p[0], h);
    const sv = F.schatten ? F.schatten(0.25) : null;
    if (sv) { g.fillStyle = "rgba(10,8,8,0.45)"; g.beginPath(); g.rect(x - 1, y - 1, w + 2, h + 2); g.rect(x + sv[0], y + sv[1], w, h); g.fill("evenodd"); }
    /* Gitter: Stäbe mit Lichtkante, ein Querstab */
    g.beginPath();
    for (let i = 1; i < 6; i++) { g.moveTo(x + w * i / 6, y - 0.05); g.lineTo(x + w * i / 6, y + h + 0.05); }
    g.moveTo(x, y + h * 0.5); g.lineTo(x + w, y + h * 0.5);
    g.strokeStyle = "rgb(34,34,36)"; g.lineWidth = Math.max(0.016, 0.8 / px); g.stroke();
    if (px > 40) {
      g.beginPath(); for (let i = 1; i < 6; i++) { g.moveTo(x + w * i / 6 - 0.004, y); g.lineTo(x + w * i / 6 - 0.004, y + h); }
      g.strokeStyle = "rgba(170,176,186,0.35)"; g.lineWidth = Math.max(0.004, 0.6 / px); g.stroke();
    }
    g.restore();
    if (winter) { g.fillStyle = "rgb(243,247,252)"; g.fillRect(x, y + h - 0.03, w, 0.03); }
  }
  const KELLERFENSTER = { sued: [2.6], ost: [3.55], nord: [3.0, 6.4], westen: [3.55] };
  const SOCKEL_LAGEN = [0.42, 0.38, 0.34];

  /* Was wirft bei Sonne einen Schlagschatten auf diese Wand? (Wand-
     koordinaten: a entlang, y nach unten ab Wandoberkante)
     EG: die Auskragung des Obergeschosses (40 cm, Köpfe 44 cm, Knaggen),
     OG Traufseite: Dachüberstand mit Rinne, OG Giebelseite: die 25 cm
     vorkragende Giebelwand, Giebel: der Ortgang (30 cm). */
  function ueberDaten(W, Q) {
    const aVon = (x, y) => (x - W.O[0]) * W.A[0] + (y - W.O[1]) * W.A[1];
    if (W.stock === "eg") {
      if (!Q.band1) return null;
      const lang = W.N[1] !== 0, sy = W.N[1], sx = W.N[0];
      const an = (v) => (lang ? aVon(v, sy * YE) : aVon(sx * XE, v));
      const kn = lang ? [-4.4, 4.4].concat(sy > 0 ? [1.2, 2.8] : []) : [-3.4, 3.4];
      return { d: KR, hoch: 0, koepfe: (lang ? KOEPFE_X : KOEPFE_Y).map(an), kopfD: KR + 0.04, knaggen: kn.map((v) => ({ a: an(v), tief: KR + 0.04, hoch: 0.58 })) };
    }
    if (W.stock === "og") {
      if (W.N[1] !== 0) return Q.dachFertig ? { d: YT + 0.2 - YO, hoch: ZT - 0.2 - ZO1 } : null;
      if (!Q.band2) return null;
      const sx = W.N[0], an = (v) => aVon(sx * XO, v);
      return { d: KG, hoch: 0, koepfe: KOEPFE_Y.concat([-3.78, 3.78]).map(an), kopfD: KG + 0.04, knaggen: [-3.78, 3.78].map((v) => ({ a: an(v), tief: KG + 0.04, hoch: 0.5 })) };
    }
    if (W.stock === "giebel") return Q.first ? { d: UEG, giebel: { w2: YO, st: TN }, unter: 0.13 } : null;
    return null;
  }

  function fertigesHaus(M, o, B, V, S, winter, Q) {
    const waende = wandListe();
    const fo = {};
    for (const W of waende) {
      const PF = PLAENE_F[W.plan || W.name];
      W.PF = PF;
      W.fos = PF.oeff.map((op, i) => op.art === "fenster" ? fensterWahl(W, i, op, V, winter) : null);
      W.fenster = (op) => W.fos[PF.oeff.indexOf(op)] || {};
      W.fos.forEach((f, i) => {
        if (!f) return;
        f.leer = !Q.fensterDrin(W, i);
        if (!Q.deko) { f.laeden = false; f.zu = false; f.kasten = null; f.deko = null; f.offen = false; }
        if (f.leer) { f.an = 0; f.laeden = false; f.zu = false; }
      });
      /* Wand für Wand: erst weiß gekalkt, dann das Holz gestrichen */
      const fw = Q.farbeW(W.name);
      W.S = Object.assign({}, S, { putzC: misch(LEHM, V.putz, fw.kalk), holzC: misch(HOLZ_ROH, V.holz.f, fw.holz), begleit: fw.holz > 0.8 ? V.begleit : null, lehm: fw.kalk < 0.5 });
      W.ueber = ueberDaten(W, Q);
      fo[W.name] = W;
    }
    fo["og-sued"].inschrift = "ANNO " + V.jahr + " · GOTT BEHÜTE DIESES HAUS";
    const fruehling = !winter;

    /* ---------- Sockel mit Wasserschlag und Kellerfenstern ---------- */
    if (Q.sockel) {
      M.teil("sockel", { mitte: [0, 0, 0.6] });
      const hS = S0 - 0.06;
      const sockelMal = (name) => (g, F) => {
        sandsteinMalen(g, F, 0, 0, F.w, F.h, SOCKEL_LAGEN, V.saat + name.length * 13, { fruehling: fruehling && Q.alt, nord: name === "nord" && Q.alt });
        for (const kx of KELLERFENSTER[name] || []) kellerfensterMalen(g, F, B, kx, hS - 0.84, winter);
        /* Frühling: die Kletterrose kommt aus dem Boden am Sockel hoch */
        if (name === "sued" && fruehling && Q.deko) kletterrose(g, F, 8.3, hS + 0.02, hS + 0.3, 0.5, V.saat + 9, true);
      };
      M.quader({ x: -XE - SV, y: -YE - SV, z: 0, b: 2 * (XE + SV), t: 2 * (YE + SV), h: hS },
        { sued: sockelMal("sued"), nord: sockelMal("nord"), ost: sockelMal("ost"), west: sockelMal("westen"), oben: Q.bau < 0.62 ? sockelDeckel(Q, winter, V, B) : "#8a5a4a" }, { ao: false });
      wasserschlag(M, XE + SV, YE + SV, SV, hS, S0, winter);
      /* ---------- Freitreppe ---------- */
      treppeBauen(M, B, winter, V, S0, Q.tuer, fruehling);
    }

    /* ---------- Garten am Sockel: Buchs, Stockrosen, Tännchen ---------- */
    if (Q.deko) gartenBauen(M, B, V, winter);

    /* ---------- Erdgeschoss ---------- */
    const tuerOp = fo["eg-sued"].PF.oeff.find((q) => q.art === "tuer");
    const D = { farbe: V.tuer, jahr: V.jahr, kuerzel: V.name.slice(0, 1) + " · " + "M", saat: V.saat, kranz: winter && Q.deko, girlande: winter && Q.deko, leer: !Q.tuer, name: Q.deko ? V.name : "" };
    const laterneA = 5.45, laterneH = 1.95;
    const extraSued = (g, F) => {
      tuerMalen(g, F, B, tuerOp.x, tuerOp.y, tuerOp.w, tuerOp.h, fo["eg-sued"].S, D);
      if (!Q.deko) return;
      klingelMalen(g, F, 7.23, HEG - 1.6);
      hausnummerMalen(g, F, 7.45, HEG - 2.16, V.nummer);
      if (fruehling) kletterrose(g, F, 8.3, HEG + 0.02, HEG - 0.25, 1.1, V.saat + 5);
      /* Schatten des Laternenarms auf der Wand */
      const sv = F.schatten ? F.schatten(0.3) : null;
      if (sv) { g.fillStyle = "rgba(30,24,20,0.22)"; g.beginPath(); g.ellipse(laterneA + sv[0], HEG - laterneH - 0.25 + sv[1], 0.13, 0.22, 0, 0, Math.PI * 2); g.fill(); }
    };
    const lichtSued = (g, F) => {
      if (F.nacht <= 0 || !Q.deko) return;
      /* Lichtkegel der Laterne auf Wand und Tür */
      const cx = laterneA, cy = HEG - laterneH - 0.25, a = F.nacht;
      g.save(); g.globalCompositeOperation = "lighter";
      const gg = g.createRadialGradient(cx, cy, 0, cx, cy, 1.6);
      gg.addColorStop(0, "rgba(255,190,110," + (0.34 * a) + ")"); gg.addColorStop(0.4, "rgba(255,160,80," + (0.14 * a) + ")"); gg.addColorStop(1, "rgba(255,150,70,0)");
      g.fillStyle = gg; g.fillRect(cx - 1.6, cy - 1.6, 3.2, 3.2);
      g.restore();
      /* rechteckiges Oberlicht der Tür (Flur beleuchtet), gleiche Tiefe
         wie das Türblatt (Parallaxe 0,14 m), die Sprossen bleiben dunkel */
      if (Q.tuer) {
        const T = tuerMaße(tuerOp.x, tuerOp.y, tuerOp.w, tuerOp.h), p = parallaxe(F, B, 0.14);
        const ox = T.lx + 0.04, oy = T.ys + 0.03, ow = T.lw - 0.08, oh = TUERSTOCK.ober - 0.1;
        g.save(); g.translate(p[0], p[1]);
        const og = g.createLinearGradient(0, oy, 0, oy + oh);
        og.addColorStop(0, "rgba(255,206,136," + (0.7 * a).toFixed(3) + ")"); og.addColorStop(1, "rgba(255,176,96," + (0.85 * a).toFixed(3) + ")");
        g.fillStyle = og; g.fillRect(ox, oy, ow, oh);
        g.beginPath(); for (let i = 1; i < 4; i++) { const xx = ox + ow * i / 4; g.moveTo(xx, oy); g.lineTo(xx, oy + oh); }
        g.strokeStyle = "rgba(52,32,22," + a.toFixed(3) + ")"; g.lineWidth = 0.025; g.stroke();
        g.restore();
      }
      if (winter && Q.deko) girlande(g, F, tuerOp.x, tuerOp.y, tuerOp.w, tuerOp.h, true);
    };
    const ZEM = (ZE0 + ZE1) / 2, ZOM = (ZB1 + ZO1) / 2;
    /* Schattenwurf: Ist das Dach fertig, liegt der Schatten aller Wände,
       Balkenlagen und Anbauten ohnehin im Schatten des Dachs – dann werfen
       nur Dach, Sockel, Treppe und Kamin (spart viele weichgezeichnete
       Schattenflächen, jede kostet spürbar Rechenzeit) */
    const sch = !Q.dachFertig;
    if (Q.egFertig) {
      M.teil("eg", { mitte: [0, 0, ZEM], schatten: sch });
      for (const W of waende.filter((w) => w.stock === "eg")) wandBauen(M, W, W.S, B, W.name === "eg-sued" ? extraSued : null, W.name === "eg-sued" ? lichtSued : null, { traufe: 0.45 });
      if (Q.innenEG) for (const W of waende.filter((w) => w.stock === "eg")) innenSchale(M, W, W.S);
      for (const W of waende.filter((w) => w.stock === "eg")) {
        const basis = add([0, 0, ZEM], mul(W.N, (W.N[0] ? XE : YE) + 0.5));
        M.teil(W.name + "-vor", { mitte: basis, schatten: sch });
        const R = rahmen3(W.O, W.N);
        if (W.name === "eg-sued" && Q.deko) {
          /* Briefkasten (Blech, dunkelgrün) */
          const bk = (g, F) => { g.fillStyle = "rgb(46,74,58)"; g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04); const gr = g.createLinearGradient(0, 0, 0, F.h); gr.addColorStop(0, "rgba(255,255,255,0.2)"); gr.addColorStop(1, "rgba(0,0,0,0.2)"); g.fillStyle = gr; g.fillRect(0, 0, F.w, F.h); };
          kasten(M, R, 5.0, 5.36, 0.95, 1.28, 0, 0.12, {
            vorn: (g, F) => { bk(g, F); g.fillStyle = "rgb(24,30,26)"; g.fillRect(0.06, 0.07, F.w - 0.12, 0.02); g.fillStyle = "rgb(200,168,90)"; g.fillRect(0.05, 0.1, F.w - 0.1, 0.02); if (F.px > 50) { g.fillStyle = "rgb(230,220,190)"; g.font = "600 0.035px Helvetica, sans-serif"; g.textAlign = "center"; g.fillText("BRIEFE", F.w / 2, 0.2); } },
            oben: winter ? schneeOben(bk) : bk, links: bk, rechts: bk
          }, { ebene: 0, name: "briefkasten" });
          M.figur({ x: -XE + laterneA, y: YE + 0.3, z: ZE0 + laterneH, breite: 0.8, hoehe: 1.0, schatten: false, malen: laterneFigur(B, W.N, winter) });
        }
        W.PF.plan.oeff.forEach((op, i) => { if (op.art === "fenster") { const f = W.fos[i]; if (!f.leer) fensterVorbau(M, B, W, R, op, W.S, winter, f.kasten, V.saat + i * 17 + W.saatZ, V, basis); } });
      }
    }

    /* ---------- Balkenlage mit Köpfen und Knaggen ---------- */
    const hb = ZB1 - ZE1;
    const koepfeX = KOEPFE_X, koepfeY = KOEPFE_Y;
    if (Q.band1) {
      M.teil("band1", { mitte: [0, 0, ZE1 + 0.12], schatten: sch });
      for (const [n, L] of [[[0, 1, 0], 2 * XO], [[0, -1, 0], 2 * XO], [[1, 0, 0], 2 * YO], [[-1, 0, 0], 2 * YO]]) {
        const A = kreuz(n, Z);
        const O = n[1] ? [-A[0] * XO, n[1] * YO, ZE1] : [n[0] * XO, -A[1] * YO, ZE1];
        const R = rahmen3(O, n);
        const pos = (n[1] ? koepfeX : koepfeY).map((v) => (n[1] ? v * A[0] + XO : v * A[1] + YO));
        rechteck(M, R.p(L / 2, hb / 2, 0), n, A, L, hb, fuellholz(S.holzC, V.saat + L * 10 | 0, pos, { B: B, winter: winter, saat: V.saat * 13 + L * 7 | 0 }), { name: "band", keinAo: true });
        /* Knaggen unter Eck- und Türköpfen */
        const RE = rahmen3([O[0] - n[0] * KR, O[1] - n[1] * KR, ZE1], n);
        const knaggenAn = n[1] ? [-4.4, 4.4].concat(n[1] > 0 ? [1.2, 2.8] : []) : [-3.4, 3.4];
        for (const v of knaggenAn) {
          const a = n[1] ? v * A[0] + XO : v * A[1] + YO;
          knagge(M, RE, a, KR + 0.04, 0.58, S.holzC, V.saat + Math.round(v * 10), -1);
        }
      }
    }

    /* ---------- Obergeschoss ---------- */
    if (Q.ogFertig) {
      M.teil("og", { mitte: [0, 0, ZOM], schatten: sch });
      for (const W of waende.filter((w) => w.stock === "og")) wandBauen(M, W, W.S, B, null, null, { traufe: W.N[1] !== 0 ? 0.55 : 0 });
      if (Q.innenOG) for (const W of waende.filter((w) => w.stock === "og")) innenSchale(M, W, W.S);
      for (const W of waende.filter((w) => w.stock === "og")) {
        const basis = add([0, 0, ZOM], mul(W.N, (W.N[0] ? XO : YO) + 0.5));
        const R = rahmen3(W.O, W.N);
        W.PF.plan.oeff.forEach((op, i) => { if (op.art === "fenster") { const f = W.fos[i]; if (!f.leer) fensterVorbau(M, B, W, R, op, W.S, winter, f.kasten, V.saat + i * 19 + W.saatZ, V, basis); } });
      }
    }

    /* ---------- Dachbalkenlage an den Giebeln ---------- */
    const hb2 = ZD - ZO1;
    if (Q.band2) {
      M.teil("band2", { mitte: [0, 0, ZO1 + 0.11], schatten: sch });
      for (const sg of [1, -1]) {
        const n = [sg, 0, 0], A = kreuz(n, Z);
        const R = rahmen3([sg * XG, sg * YO, ZO1], n);
        const pos2 = koepfeY.concat([-3.78, 3.78]).map((v) => v * A[1] + YO);
        rechteck(M, R.p(YO, hb2 / 2, 0), n, A, 2 * YO, hb2, fuellholz(S.holzC, V.saat + 5 + sg, pos2, { B: B, winter: winter, saat: V.saat * 17 + sg }), { name: "band2", keinAo: true });
        /* Stirnseiten der Auskragung */
        for (const sy of [1, -1]) rechteck(M, [sg * (XO + KG / 2), sy * YO, ZO1 + hb2 / 2], [0, sy, 0], [sy, 0, 0], KG, hb2, rgb(hell(S.holzC, -0.05)), { keinAo: true });
        const RE = rahmen3([sg * XO, sg * YO, ZO1], n);
        for (const v of [-3.78, 3.78]) knagge(M, RE, v * A[1] + YO, KG + 0.04, 0.5, S.holzC, V.saat + 3, -1);
      }
      /* Traufseiten: Dachbalkenlage unter dem Überstand */
      for (const sy of [1, -1]) rechteck(M, [0, sy * YO, ZO1 + hb2 / 2], [0, sy, 0], [sy, 0, 0], 2 * XO, hb2, fuellholz(S.holzC, V.saat + 9), { keinAo: true, name: "band2t" });
    }

    /* ---------- Giebel: jede Giebelwand ein eigenes Teil ---------- */
    const giebelUmriss = [[0, GH], [YO, 0], [2 * YO, GH]];
    if (Q.giebelFertig) {
      for (const W of waende.filter((w) => w.stock === "giebel")) {
        M.teil(W.name, { mitte: [W.N[0] * XG, 0, ZD + GH * 0.35], schatten: sch });
        wandBauen(M, W, W.S, B, null, null, { umriss: giebelUmriss });
        if (Q.innenGiebel) innenSchale(M, W, W.S, giebelUmriss);
      }
    }

    /* ---------- Dach ---------- */
    const kx = KAMIN.x;
    const gauben = [-2.5, 2.5];
    const gaubenFlaeche = gauben.map((xg) => { const GM = gaubeMasse(xg); return { x0: GM.x0 + XD, x1: GM.x1 + XD, y0: GM.yj * LM / YK, y1: GM.yf * LM / YK }; });
    const deck = winter ? Q.schneeDeck : 0;
    const schneeDach = winter && Q.dachFertig && deck > 0;
    const nM = (sy) => [0, sy * Math.sin(NEIG), Math.cos(NEIG)], nA = (sy) => [0, sy * Math.sin(NA), Math.cos(NA)];
    for (const sy of [1, -1]) {
      if (!Q.dachFertig) break;
      const seite = sy > 0 ? "S" : "N";
      M.teil("dach" + seite, { mitte: [0, sy * 0.5, ZDM] });
      const u = [sy, 0, 0], w = 2 * XD;
      const saat = V.saat + (sy > 0 ? 1 : 2);
      const gFl = sy > 0 && Q.gaube ? gaubenFlaeche : [];
      M.flaeche({ name: "dachM" + seite, o: [-sy * XD, 0, ZF], u: u, v: [0, sy * YK, ZK - ZF], w: w, h: LM,
        malen: dachMaler({ winter: winter, deck: deck, haupt: true, yEnde: LA, saat: saat, oben: 0.36, kamin: sy < 0 ? [XD - kx, Math.abs(KAMIN.y) * LM / YK] : null, gauben: gFl, anschluss: gFl,
          koerper: [KAMIN.punkte].concat(sy > 0 && Q.gaube ? gauben.map((xg) => gaubeMasse(xg).punkte) : []),
          alt: Q.alt && fruehling, moosStreifen: sy < 0,
          streifen: (sy < 0 ? [[XD - kx - 0.3, XD - kx + 0.3, Math.abs(KAMIN.y) * LM / YK + 0.45]] : []).concat(gFl.map((q) => [q.x0 + 0.15, q.x1 - 0.15, q.y1 + 0.05])),
          B: B, fang: Q.rinne ? LM - 0.45 : null, knick: { n: nA(sy), oben: false }, sparren: Array.from({ length: SP_N }, (_, j) => sy > 0 ? sparrenX(j) + XD : XD - sparrenX(j)) }) });
      M.flaeche({ name: "dachA" + seite, o: [-sy * XD, sy * YK, ZK], u: u, v: [0, sy * (YT - YK), ZT - ZK], w: w, h: LA,
        malen: dachMaler({ winter: winter, deck: deck, haupt: false, yEnde: 0, saat: saat, koerper: [], moos: sy < 0 && fruehling ? LA : 0, alt: Q.alt && fruehling, B: B, knick: { n: nM(sy), oben: true } }) });
      /* Traufe als eigenes Teil an ihrer echten Stelle: Traufbrett, Rinne */
      M.teil("traufe" + seite, { mitte: [0, sy * (YT + 0.15), ZT], schatten: false });
      wandFlaeche(M, [-sy * XD, sy * YT, ZT], [0, sy, 0], w, 0.2, brettMal(hell(S.holzC, 0.05), saat), { ebene: 1, keinAo: true, name: "traufbrett" });
      const rohrX = sy > 0 ? [4.2 + XD] : [XD - (-4.2)];
      if (Q.rinne) {
        wandFlaeche(M, [-sy * (XD + 0.03), sy * (YT + 0.17), ZT - 0.05], [0, sy, 0], w + 0.06, 0.15, rinneVorn(saat, schneeDach, rohrX), { ebene: 2, keinAo: true, name: "rinne" });
        M.flaeche({ name: "rinne-o", o: [-sy * (XD + 0.03), sy * (YT - 0.01), ZT - 0.05], u: u, v: [0, sy, 0], w: w + 0.06, h: 0.18, malen: rinneOben(schneeDach), ebene: 2 });
        for (const ex of [-1, 1]) {
          const um = []; for (let k = 0; k <= 8; k++) { const a = Math.PI * k / 8; um.push([0.09 - Math.cos(a) * 0.09, 0.0 + Math.sin(a) * 0.14]); }
          M.flaeche({ name: "rinne-ende", o: ex > 0 ? [XD + 0.03, sy > 0 ? YT + 0.17 : -YT + 0.01, ZT - 0.05] : [-XD - 0.03, sy > 0 ? YT - 0.01 : -YT - 0.17, ZT - 0.05], u: ex > 0 ? [0, -1, 0] : [0, 1, 0], v: [0, 0, -1], w: 0.18, h: 0.15,
            umriss: ex > 0 ? um.map(([a, b]) => [sy > 0 ? a : 0.18 - a, b]) : um.map(([a, b]) => [sy > 0 ? 0.18 - a : a, b]), malen: rinneKappe(schneeDach), ebene: 2, keinAo: true });
        }
      }
      if (schneeDach) {
        /* Schneewechte: eigenes Teil, liegt auf der Dachfläche → nach der
           Dachfläche der nahen Seite, vor Giebel und Wänden der fernen Seite */
        M.teil("wechte" + seite, { mitte: [0, sy * 4.6, ZDM], schatten: false });
        const nD = nA(sy);
        M.flaeche({ name: "wechte", o: [-sy * (XD + 0.08), sy * (YT - 0.1), ZT + 0.03], u: u, v: [0, sy * 0.32, 0.245 * deck], w: w + 0.16, h: Math.hypot(0.32, 0.245 * deck), ebene: 3, keinAo: true, keinLicht: true,
          malen: (g, F) => {
            const L = lichtMal(dachLicht(F, B, nD));
            const gr = g.createLinearGradient(0, 0, 0, F.h);
            gr.addColorStop(0, L([246, 249, 253])); gr.addColorStop(1, L([250, 252, 255], 1, 1.05));
            g.fillStyle = gr; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
          } });
        wandFlaeche(M, [-sy * (XD + 0.08), sy * (YT + 0.2), ZT + 0.03 + 0.23 * deck], [0, sy, 0], w + 0.16, 0.56, schneeKante(saat + 7, 0.3 * deck, 0.16 * deck, B, nD), { ebene: 4, keinLicht: true, keinAo: true, name: "schneekante" });
        if (Q.rinne && Q.eis) wandFlaeche(M, [-sy * XD, sy * (YT + 0.21), ZT - 0.12], [0, sy, 0], w, 0.85, eiszapfen(saat + 9, rohrX), { ebene: 5, keinLicht: true, keinAo: true, name: "eis" });
        if (Q.deko) {
          /* Kette an der Unterkante der Rinne (Haken am Rinnenwulst), unter
             der Schneewechte, hinter den Eiszapfen */
          const lk = lichterKette([[0.15, 0.1], [w - 0.1, 0.1]], rohrX, { saat: saat + 21 });
          wandFlaeche(M, [-sy * XD, sy * (YT + 0.175), ZT - 0.1], [0, sy, 0], w, 0.4, lk.malen, { ebene: 4.5, keinLicht: true, keinAo: true, name: "lichter", leuchten: lk.leuchten });
        }
      }
    }
    /* Gauben */
    for (const xg of gauben) {
      if (!Q.gaube) break;
      const GW = { name: "gaube" + xg, N: [0, 1, 0], stock: "gaube" };
      const fw = fensterWahl(GW, 0, {}, V, winter);
      fw.laeden = false; fw.kasten = null; fw.gardine = true; fw.offen = false;
      if (winter && Q.deko) fw.deko = xg > 0 ? "stern" : "schwibbogen"; else fw.deko = null;
      fw.leer = !Q.fensterDrin(GW, 0); if (fw.leer) fw.an = 0;
      gaubeBauen(M, xg, S, V, B, winter && Q.dachFertig, fw, Object.assign({}, Q.gaube, { deck: deck, eis: Q.eis }));
    }
    /* First, Ortgang je Giebelseite, Schnee am Ortgang */
    if (Q.first) {
      M.teil("first", { mitte: [0, 0, ZF], schatten: false });
      const fy = 0.13, fz = dachZ(fy) + 0.02;
      for (const sy of [1, -1]) {
        /* Setzung: der First hängt in der Mitte 6–9 cm durch (die Sparren
           haben sich in 300 Jahren gesetzt), am stärksten etwas außermittig.
           Die Ebene bleibt, nur Umriss und Malerei folgen dem Durchhang. */
        const wF = 2 * XD + 0.04, hF = Math.hypot(fy, ZF + 0.12 - fz), vz = (ZF + 0.12 - fz) / hF;
        const tiefe = (0.06 + (V.saat % 7) * 0.004) / vz, mitteF = 0.45 + (V.saat % 5) * 0.02;
        const sag = (x) => { const t = klemm((sy > 0 ? x : wF - x) / wF, 0, 1); return tiefe * Math.sin(Math.PI * Math.pow(t, Math.log(0.5) / Math.log(mitteF))); };
        const um = []; for (let i = 0; i <= 16; i++) { const x = wF * i / 16; um.push([x, sag(x)]); }
        for (let i = 16; i >= 0; i--) { const x = wF * i / 16; um.push([x, hF + sag(x)]); }
        M.flaeche({ name: "first" + sy, o: [-sy * (XD + 0.02), 0, ZF + 0.12], u: [sy, 0, 0], v: [0, sy * fy, fz - ZF - 0.12], w: wF, h: hF, umriss: um, malen: firstMal(V.saat + sy, schneeDach, sag), keinAo: true });
      }
      for (const sx of [1, -1]) ortgangBauen(M, sx, S, V, B, schneeDach, deck, winter && Q.deko && Q.dachFertig);
    }
    /* Kamin */
    if (Q.kamin > 0) kaminBauen(M, S, V, B, winter && Q.dachFertig, Q.kamin, deck);
    /* Fallrohre (Süd: Ost-Ecke, Nord: West-Ecke) */
    for (const sy of [1, -1]) {
      if (!Q.rinne) break;
      const x = sy * 4.2;
      const yE = sy * (YE + SV + 0.07), yO = sy * (YO + 0.08), yG = sy * (YT + 0.085);
      const abs = [[x, yE + sy * 0.18, 0.06], [x, yE, 0.22], [x, yE, ZE1 - 0.5], [x, yO, ZE1 - 0.12], [x, yO, ZT - 0.62], [x, yG, ZT - 0.3], [x, yG, ZT - 0.2]];
      const fuss = abs[0];
      const rel = abs.map((p) => [p[0] - fuss[0], p[1] - fuss[1], p[2] - fuss[2]]);
      M.teil("fallrohr" + sy, { mitte: [0, sy * (YO + 0.5), (ZE0 + ZO1) / 2], schatten: false });
      M.figur({ x: fuss[0], y: fuss[1], z: fuss[2], breite: 1.4, hoehe: ZT + 0.2, schatten: false, malen: rohrFigur(B, rel, 0.1, [150, 158, 163], [[1, 0.3], [1, 0.8], [3, 0.35], [3, 0.8]], winter) });
    }
  }

  /* Ortgang einer Giebelseite: Windbrett über die ganze Dachstärke plus
     13 cm darunter (sonst sieht man durch das Dach), Flugsparrenköpfe an
     der Traufe, Schneekappe, im Advent eine Lichterkette entlang */
  function ortgangBauen(M, sx, S, V, B, schneeDach, deck, lichter) {
    M.teil("ortgang" + sx, { mitte: [sx * (XD + 0.1), 0, ZD + GH * 0.5], schatten: false });
    const n = [sx, 0, 0], u = kreuz(n, Z);
    const o0 = [sx * XD, -u[1] * YT, ZF + 0.3];
    const fx = (y) => (y - o0[1]) * u[1];
    const linie = [];
    for (const y of [-YT, -YK, 0, YK, YT]) linie.push([fx(y), ZF + 0.3 - dachZ(y)]);
    linie.sort((a, b) => a[0] - b[0]);
    const HB = DV + 0.13;
    const unten = linie.map(([a, b]) => [a, b + HB]).reverse();
    const ortMal = (g, F) => {
      const c = hell(S.holzC, 0.05);
      g.fillStyle = rgb(c); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      /* Profil: helle Oberkante, dunklere Unterkante (Windbrett mit Deckleiste) */
      const band = (d0, d1, farbe, lw) => { g.strokeStyle = farbe; g.lineWidth = lw; g.lineJoin = "round"; g.beginPath(); linie.forEach(([a, b], i) => (i ? g.lineTo(a, b + (d0 + d1) / 2) : g.moveTo(a, b + (d0 + d1) / 2))); g.stroke(); };
      band(0, 0.1, schneeDach ? "rgb(236,240,248)" : "rgb(120,52,34)", 0.1);
      band(0.12, 0.16, rgb(hell(c, 0.12)), 0.04);
      band(HB - 0.06, HB, rgb(hell(c, -0.3)), 0.06);
      if (F.px > 14) rausch(g, 0, 0, F.w, F.h, 1, 0.2, 7, 3);
      /* Flugsparrenköpfe an beiden Traufenden: Hirnholz, unten gerundet */
      for (const [a, b] of [linie[0], linie[linie.length - 1]]) {
        const x0 = a < F.w / 2 ? a : a - 0.14;
        g.fillStyle = rgb(hell(c, -0.22)); g.beginPath(); g.moveTo(x0, b + 0.05); g.lineTo(x0 + 0.14, b + 0.05); g.lineTo(x0 + 0.14, b + HB - 0.04); g.quadraticCurveTo(x0 + 0.07, b + HB + 0.02, x0, b + HB - 0.04); g.closePath(); g.fill();
      }
    };
    wandFlaeche(M, o0, n, 2 * YT, 6.4, ortMal, { umriss: linie.concat(unten), keinAo: true, name: "ortgang" });
    if (schneeDach) {
      const saat = V.saat + sx * 3;
      const dS = 0.28 * deck;
      /* Schneelippe am Ortgang: oben gewellt (75–100 % der Deckenstärke),
         unten 6–12 cm über das Windbrett gerollt, in weichen Buckeln
         (Bézier + Rauschen), die Unterseite bläulich im Eigenschatten –
         keine Kastenkante */
      const rr = zufall(saat), lin2 = linie;
      const probe = [];
      for (let i = 0; i + 1 < lin2.length; i++) {
        const [a0, b0] = lin2[i], [a1, b1] = lin2[i + 1], n2 = Math.max(2, Math.round((a1 - a0) / 0.18));
        for (let k = (i ? 1 : 0); k <= n2; k++) { const t = k / n2; probe.push([a0 + (a1 - a0) * t, b0 + (b1 - b0) * t]); }
      }
      const oben = probe.map(([a, b]) => [a, b - dS * (0.78 + 0.16 * Math.sin(a * 2.7 + saat) + rr() * 0.06)]);
      const lippe = probe.map(([a, b]) => [a, b + 0.05 + 0.055 * Math.pow(Math.abs(Math.sin(a * 3.4 + saat * 1.7)), 1.5) + rr() * 0.012]);
      const um = oben.map(([a, b]) => [a, b - 0.02]).concat(lippe.slice().reverse().map(([a, b]) => [a, b + 0.02]));
      const f = wandFlaeche(M, [o0[0] + sx * 0.02, o0[1], o0[2]], n, 2 * YT, 6.4, null, { umriss: um, keinLicht: true, keinAo: true, ebene: 1, name: "ortschnee" });
      const kurve = (P, rueck) => {
        const Q = rueck ? P.slice().reverse() : P;
        for (let i = 1; i < Q.length; i++) g_.quadraticCurveTo(Q[i - 1][0], Q[i - 1][1], (Q[i - 1][0] + Q[i][0]) / 2, (Q[i - 1][1] + Q[i][1]) / 2);
        g_.lineTo(Q[Q.length - 1][0], Q[Q.length - 1][1]);
      };
      let g_ = null;
      f.malen = (g, F) => {
        const L = belichter(F, 0.08);
        g_ = g;
        g.beginPath(); g.moveTo(oben[0][0], oben[0][1]); kurve(oben, false); g.lineTo(lippe[lippe.length - 1][0], lippe[lippe.length - 1][1]); kurve(lippe, true); g.closePath();
        g.fillStyle = L([240, 244, 250]); g.fill();
        /* Unterseite der Lippe im Eigenschatten */
        g.beginPath(); g.moveTo(probe[0][0], probe[0][1] - 0.02); kurve(probe.map(([a, b]) => [a, b - 0.02]), false); g.lineTo(lippe[lippe.length - 1][0], lippe[lippe.length - 1][1]); kurve(lippe, true); g.closePath();
        const gr = g.createLinearGradient(0, 0, 0, 0.5);
        g.fillStyle = L([176, 192, 222], 0.6); g.fill();
        void gr;
        /* helle, gerundete Oberkante */
        g.beginPath(); g.moveTo(oben[0][0], oben[0][1] + 0.012); kurve(oben.map(([a, b]) => [a, b + 0.012]), false);
        g.strokeStyle = L([255, 255, 255], 0.8); g.lineWidth = Math.max(0.02, 1 / F.px); g.lineCap = "round"; g.stroke();
      };
    }
    if (lichter) {
      /* Lichterkette am unteren Rand des Windbretts, von Traufe zu Traufe */
      const haken = linie.map(([a, b]) => [a, b + HB + 0.02]);
      const lk = lichterKette(haken, [], { enden: true, durch: [0.025, 0.025], saat: V.saat + sx * 5 });
      wandFlaeche(M, [o0[0] + sx * 0.05, o0[1], o0[2]], n, 2 * YT, 6.8, lk.malen, { keinLicht: true, keinAo: true, ebene: 2, name: "ortlichter", leuchten: lk.leuchten });
    }
  }

  /* Eine Wand als gemalte Fläche (mit Leuchten der Fenster) */
  function wandBauen(M, W, S, B, extra, extraLicht, opt) {
    opt = opt || {};
    const PF = W.PF;
    const malen = wandMaler(W, PF, S, B, extra);
    const leuchten = (g, F) => {
      const hell = [];
      PF.oeff.forEach((op, i) => {
        if (op.art !== "fenster") return;
        const f = W.fos[i];
        if (f.zu) return;
        const k = fensterLicht(g, F, B, op.x, op.y, op.w, op.h, S, f);
        if (k > 0) hell.push([op.x + op.w / 2, op.y + op.h * 0.55, k, op.w, op.h]);
      });
      /* warmer Hof um jedes helle Fenster auf der Wand */
      if (hell.length && F.px > 3) {
        g.save(); g.globalCompositeOperation = "lighter";
        for (const [x, y, k, w, h] of hell) {
          const r = Math.max(w, h) * 0.95, gg = g.createRadialGradient(x, y, 0, x, y, r);
          gg.addColorStop(0, "rgba(255,180,100," + (0.16 * F.nacht * Math.min(1, k)).toFixed(3) + ")"); gg.addColorStop(1, "rgba(255,160,80,0)");
          g.fillStyle = gg; g.fillRect(x - r, y - r, 2 * r, 2 * r);
        }
        g.restore();
      }
      fensterSchein(F, hell);
      if (extraLicht) extraLicht(g, F);
    };
    return wandFlaeche(M, add(W.O, [0, 0, W.H]), W.N, W.L, W.H, malen, Object.assign({ name: W.name, leuchten: leuchten, ao: false }, opt));
  }

  /* =====================================================================
     BAUPHASEN
     XANDER: „Man soll das Fundament sehen beim Aufbauen. Man soll richtig
     sehen, wie es konstruiert wird … Schritt für Schritt, wie das nach
     2 Minuten aussieht, wie es nach 5 Minuten aussieht, nach 10 Minuten,
     15 Minuten, bis es fertig ist."
       0,00–0,12  Baugrube mit Erdschichten, Aushubhaufen, Schnurgerüst
       0,12–0,22  Schalung, Beton, Streifenfundament, Verfüllen
       0,22–0,32  Sandsteinsockel Lage für Lage, Dielenboden
       0,32–0,50  Fachwerk-Gerippe EG (Schwelle, Ständer, Rähm, Streben, Riegel)
       0,50–0,60  Ausfachen (Staken, Lehm), Deckenbalken, Knaggen
       0,60–0,72  Boden, Gerippe und Gefache OG
       0,72–0,80  Dachbalken, Dachboden, Sparren mit Kehlbalken, Giebel, Richtbaum
       0,80–0,90  Lattung, Biberschwänze Reihe für Reihe von der Traufe
       0,90–1,00  Kalkputz, Farbe, Fenster, Tür, Kamin, Rinnen, Schmuck
     ===================================================================== */
  const KOEPFE_X = []; for (let k = 0; k < 12; k++) KOEPFE_X.push(-4.4 + k * 0.8);
  const KOEPFE_Y = []; for (let k = 0; k < 9; k++) KOEPFE_Y.push(-3.4 + k * 0.85);
  const WAND_FOLGE = ["eg-sued", "eg-ost", "eg-nord", "eg-west", "og-sued", "og-ost", "og-nord", "og-west", "giebel-ost", "giebel-west"];
  function zustand(bau) {
    const k = (a, b) => klemm((bau - a) / (b - a), 0, 1);
    return {
      bau: bau, k: k,
      sockel: bau >= 0.3,
      egFertig: bau >= 0.6, band1: bau >= 0.62, ogFertig: bau >= 0.72,
      band2: bau >= 0.735, giebelFertig: bau >= 0.8, dachFertig: bau >= 0.895,
      /* offene Geschosse: Innenschalen, bis Decke bzw. Dachboden liegen */
      innenEG: bau < 0.62, innenOG: bau < 0.745, innenGiebel: bau < 0.895,
      /* Gauben: erst Gerippe, dann Wände, gedeckt, wenn die Ziegel so weit sind */
      gaube: bau < 0.84 ? null : { geruest: bau < 0.86, wand: bau >= 0.86, dach: bau >= 0.885 },
      first: bau >= 0.88, kamin: bau >= 1 ? 1 : k(0.93, 0.965), rinne: bau >= 0.955,
      tuer: bau >= 0.94, deko: bau >= 0.97,
      /* das fertige Haus steht schon lange: Moos, Patina, ausgebesserte Ziegel */
      alt: bau >= 0.99,
      /* Schnee fällt erst nach und nach aufs neue Dach, Eiszapfen zuletzt */
      schneeDeck: k(0.9, 0.96), eis: bau >= 0.96,
      /* Wand für Wand: erst kalken (weiß), dann das Holz streichen */
      farbeW: (name) => { const i = Math.max(0, WAND_FOLGE.indexOf(name)), t0 = 0.86 + i * 0.0035; return { kalk: k(t0, t0 + 0.012), holz: k(t0 + 0.02, t0 + 0.032) }; },
      farbe: k(0.88, 0.915),
      fensterDrin: (W, i) => bau >= 0.92 + 0.028 * ST.hash2(ST.textHash(W.name) % 1000, i, 5)
    };
  }

  /* ---------------- rohes Holz für Gerippe, Balken, Sparren ---------------- */
  function rohHolz(c, saat, winter) {
    return function (seite, L, bb) {
      const ende = seite === "a" || seite === "e";
      return function (g, F) {
        const w = F.w, h = F.h, px = F.px;
        const rng = zufall(saat * 7 + seite.charCodeAt(0));
        const n = kreuz(F.flaeche.u, F.flaeche.v);
        if (ende) {
          g.fillStyle = rgb(hell(c, -0.08)); g.fillRect(-0.02, -0.02, w + 0.04, h + 0.04);
          if (px * w > 6) { g.strokeStyle = rgb(hell(c, -0.3), 0.4); g.lineWidth = Math.max(0.003, 0.7 / px); for (let r = 0.02; r < 0.2; r += 0.022) { g.beginPath(); g.arc(w * 0.45, h * 0.55, r, 0, Math.PI * 2); g.stroke(); } }
          return;
        }
        const t = hell(c, (rng() - 0.5) * 0.12);
        g.fillStyle = rgb(t); g.fillRect(-0.02, -0.02, w + 0.04, h + 0.04);
        if (px * Math.min(w, h) > 3) {
          g.lineWidth = Math.max(0.003, 0.7 / px);
          const lang = w > h;
          const zahl = Math.min(6, Math.round((lang ? h : w) * px / 3));
          for (let i = 0; i < zahl; i++) {
            g.strokeStyle = rgb(hell(t, -0.2 - rng() * 0.15), 0.3);
            g.beginPath();
            if (lang) { const y = h * (i + 0.5) / zahl; g.moveTo(0, y); g.bezierCurveTo(w * 0.3, y + (rng() - 0.5) * 0.02, w * 0.7, y + (rng() - 0.5) * 0.02, w, y); }
            else { const x = w * (i + 0.5) / zahl; g.moveTo(x, 0); g.bezierCurveTo(x + (rng() - 0.5) * 0.02, h * 0.3, x + (rng() - 0.5) * 0.02, h * 0.7, x, h); }
            g.stroke();
          }
          g.fillStyle = rgb(hell(t, -0.35), 0.5);
          if (lang) { g.fillRect(0, 0, w, Math.min(0.012, h * 0.1)); g.fillRect(0, h - Math.min(0.012, h * 0.1), w, Math.min(0.012, h * 0.1)); }
          else { g.fillRect(0, 0, Math.min(0.012, w * 0.1), h); g.fillRect(w - Math.min(0.012, w * 0.1), 0, Math.min(0.012, w * 0.1), h); }
        }
        /* Schnee bleibt auf den Oberseiten liegen */
        if (winter && n[2] > 0.7) { g.fillStyle = "rgb(242,246,252)"; PI.rundRechteck(g, -0.01, -0.01, w + 0.02, h + 0.02, Math.min(0.03, Math.min(w, h) * 0.4)); g.fill(); }
      };
    };
  }
  /* Zeitfenster eines Gliedes: Reihenfolge nach Art, dann Lage */
  const PHASEN = { schwelle: [0, 0.12], staender: [0.12, 0.46], raehm: [0.46, 0.58], strebe: [0.58, 0.8], bogen: [0.58, 0.8], riegel: [0.8, 1] };
  /* Segment eines Plan-Gliedes auf seine echte Länge kürzen (die Pläne sind
     zum Malen in die Nachbarhölzer verlängert) */
  function gliedEchte(m, P, ecken) {
    const b = P.b;
    if (m.art === "schwelle" || m.art === "raehm") {
      const a0 = Math.max(ecken ? 0 : 0.2, m.p0[0]), a1 = Math.min(ecken ? P.L : P.L - 0.2, m.p1[0]);
      if (a1 - a0 < 0.05) return null;
      return [[a0, m.p0[1]], [a1, m.p1[1]]];
    }
    if (m.art === "staender") return [[m.p0[0], m.p0[1] + 0.04], [m.p1[0], m.p1[1] - 0.04]];
    if (m.art === "riegel") return [[m.p0[0] + 0.12, m.p0[1]], [m.p1[0] - 0.12, m.p1[1]]];
    /* Streben: auf ihr Feld begrenzen */
    const B0 = m.bereich || [-1e3, -1e3, 1e3, 1e3];
    const bx0 = B0[0] + 0.03, by0 = B0[1] + 0.03, bx1 = B0[2] - 0.03, by1 = B0[3] - 0.03;
    let [p, q] = [m.p0, m.p1];
    const dx = q[0] - p[0], dy = q[1] - p[1];
    let t0 = 0, t1 = 1;
    const kl = (pp, qq) => { if (pp === 0) return qq >= 0; const r = qq / pp; if (pp < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; } return true; };
    if (!(kl(-dx, p[0] - bx0) && kl(dx, bx1 - p[0]) && kl(-dy, p[1] - by0) && kl(dy, by1 - p[1]))) return null;
    void b;
    return [[p[0] + dx * t0, p[1] + dy * t0], [p[0] + dx * t1, p[1] + dy * t1]];
  }
  /* Gerippe einer Wand als echte Balken; t0…t1 = Zeitfenster dieses Stockwerks */
  function geruestWand(M, W, P, Z, t0, t1, c, winter, opt) {
    opt = opt || {};
    const R = rahmen3(W.O, W.N);
    const liste = [];
    for (const m of P.glieder) {
      if (m.art === "staender" && m.ecke && !opt.ecken) continue;
      if (opt.ohneSparren && m.art === "raehm" && P.giebel) continue;
      const seg = m.k ? null : gliedEchte(m, P, opt.ecken);
      if (m.k) {
        /* Bogen: drei gerade Stücke entlang der Kurve */
        const pt = (t) => [(1 - t) * (1 - t) * m.p0[0] + 2 * (1 - t) * t * m.k[0] + t * t * m.p1[0], (1 - t) * (1 - t) * m.p0[1] + 2 * (1 - t) * t * m.k[1] + t * t * m.p1[1]];
        for (let i = 0; i < 3; i++) liste.push({ art: "bogen", seg: [pt(0.08 + i * 0.28), pt(0.08 + (i + 1) * 0.28)], b: m.b });
        continue;
      }
      if (seg) liste.push({ art: m.art, seg: seg, b: m.b });
    }
    const zaehl = {};
    for (const e of liste) zaehl[e.art] = (zaehl[e.art] || 0) + 1;
    const nr = {};
    liste.sort((a, b) => a.seg[0][0] - b.seg[0][0]);
    const Zeit = (e) => {
      const ph = PHASEN[e.art] || [0, 1];
      const i = nr[e.art] = (nr[e.art] || 0) + 1;
      const n = zaehl[e.art];
      const a = ph[0] + (ph[1] - ph[0]) * (i - 1) / n, b = ph[0] + (ph[1] - ph[0]) * i / n;
      return [t0 + (t1 - t0) * a, t0 + (t1 - t0) * b];
    };
    const mal = rohHolz(c, ST.textHash(W.name) % 97, winter);
    const mitte = add(add(W.O, [0, 0, W.H / 2]), mul(W.N, 0.45));
    M.teil(W.name + "-geruest", { mitte: [mitte[0] * 0.1, mitte[1] * 0.1, mitte[2]] });
    for (const e of liste) {
      const [ta, tb] = Zeit(e);
      const gz = Z.k(ta, tb);
      if (gz <= 0) continue;
      let [p, q] = e.seg;
      if (p[1] > q[1] + 0.01) { const t = p; p = q; q = t; }
      /* Ein Zimmermann setzt ganze, abgebundene Hölzer: das Holz schwebt
         am Kran ein und senkt sich die letzten 40 cm in seine Lage */
      const dz = (1 - gz) * 0.4, Q = q;
      const P0 = R.p(p[0], p[1] + dz, 0), P1 = R.p(Q[0], Q[1] + dz, 0);
      const L = Math.hypot(Q[0] - p[0], Q[1] - p[1]);
      if (L < 0.02) continue;
      const da = (Q[0] - p[0]) / L, dh = (Q[1] - p[1]) / L;
      const Bv = add(mul(R.A, -dh), mul(Z3, da));
      stab(M, P0, P1, Bv, e.b, W.N, -0.2, 0, mal, { dEbene: 2 });
    }
    return R;
  }
  const Z3 = [0, 0, 1];
  /* Ausfachung: Staken (Flechtwerk) und Lehm, Gefach für Gefach.
     Zwei Flächen (außen und innen), durchsichtig, wo noch offen. */
  function ausfachung(M, W, PF, Z, t0, t1, winter) {
    const pz = Z.k(t0, t1);
    if (pz <= 0) return;
    const gef = PF.gefache.map((P) => ({ P: P, m: vMitte(P) })).sort((a, b) => (Math.round(a.m[0] * 2) - Math.round(b.m[0] * 2)) || (b.m[1] - a.m[1]));
    const n = gef.length;
    const zustandVon = (i) => klemm((pz * (n + 2) - i) / 2, 0, 1);
    const maler = (spiegel) => (g, F) => {
      const L = belichter(F, 0.04), px = F.px;
      for (let i = 0; i < n; i++) {
        const st = zustandVon(i);
        if (st <= 0) continue;
        let P = gef[i].P;
        if (spiegel) P = P.map(([a, b]) => [PF.L - a, b]);
        const B = vBox(P);
        g.save(); poly(g, P); g.clip();
        /* Staken: senkrechte Stäbe, dazwischen Weidenruten */
        const anteil = klemm(st / 0.4, 0, 1);
        const x1 = B[0] + (B[2] - B[0]) * anteil + 0.01;
        g.fillStyle = L([166, 132, 92]);
        for (let x = B[0] + 0.05; x < x1; x += 0.14) g.fillRect(x - 0.015, B[1] - 0.05, 0.03, B[3] - B[1] + 0.1);
        if (st > 0.2 && px > 8) {
          g.strokeStyle = L([130, 104, 70]); g.lineWidth = 0.018;
          for (let y = B[1] + 0.06; y < B[3]; y += 0.09) { g.beginPath(); g.moveTo(B[0], y); for (let x = B[0]; x < x1; x += 0.14) g.quadraticCurveTo(x + 0.07, y + ((x * 7 | 0) % 2 ? 0.015 : -0.015), x + 0.14, y); g.stroke(); }
        }
        if (st > 0.4) {
          /* Lehm wird von unten angeworfen */
          const f = klemm((st - 0.4) / 0.6, 0, 1);
          const yL = B[3] - (B[3] - B[1] + 0.05) * f;
          g.fillStyle = L(LEHM);
          g.beginPath(); g.moveTo(B[0] - 0.05, B[3] + 0.05);
          for (let x = B[0] - 0.05; x <= B[2] + 0.1; x += 0.08) g.lineTo(x, yL + Math.sin(x * 23 + i) * 0.02);
          g.lineTo(B[2] + 0.1, B[3] + 0.05); g.closePath(); g.fill();
          if (px > 14) {
            g.strokeStyle = L([196, 170, 110], 0.6); g.lineWidth = Math.max(0.003, 0.6 / px);
            const rr = zufall(i * 31 + 7);
            for (let k = 0; k < 18; k++) { const x = B[0] + rr() * (B[2] - B[0]), y = yL + rr() * (B[3] - yL), a = rr() * 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 0.05, y + Math.sin(a) * 0.05); g.stroke(); }
          }
          if (winter && f >= 1) { g.fillStyle = L([240, 244, 250], 0.0); }
        }
        g.restore();
      }
    };
    wandFlaeche(M, add(add(W.O, [0, 0, W.H]), mul(W.N, -0.015)), W.N, W.L, W.H, maler(false), { keinLicht: true, keinAo: true, ebene: 1, name: W.name + "-lehm" });
    const innen = mul(W.N, -1);
    const oI = add(add(add(W.O, [0, 0, W.H]), mul(W.N, -0.185)), mul(W.A, W.L));
    wandFlaeche(M, oI, innen, W.L, W.H, maler(true), { keinLicht: true, keinAo: true, ebene: 1, name: W.name + "-lehm-i" });
  }

  /* ---------------- Boden-Maler (Dielen), wachsend ---------------- */
  function dielen(w, h, anteil, saat, winter) {
    return function (g, F) {
      const L = belichter(F, 0.02), rng = zufall(saat), px = F.px;
      const bis = w * anteil;
      g.save(); g.beginPath(); g.rect(-0.02, -0.02, bis + 0.02, h + 0.04); g.clip();
      g.fillStyle = L([176, 142, 100]); g.fillRect(-0.02, -0.02, w + 0.04, h + 0.04);
      for (let x = 0; x < bis; x += 0.22) {
        g.fillStyle = L(hell([176, 142, 100], (rng() - 0.5) * 0.14)); g.fillRect(x, -0.02, 0.215, h + 0.04);
        if (px > 10) { g.fillStyle = L([90, 66, 44], 0.6); g.fillRect(x + 0.212, -0.02, 0.008, h + 0.04); }
        if (px > 20) { let y = rng() * 3; while (y < h) { g.fillStyle = L([90, 66, 44], 0.5); g.fillRect(x, y, 0.22, 0.006); y += 2.5 + rng() * 2; } }
      }
      if (winter) { g.fillStyle = L([240, 244, 250], 0.3); g.fillRect(-0.02, -0.02, bis + 0.02, h + 0.04); }
      g.restore();
    };
  }
  /* Sockel-Oberseite während des Baus: Mauerkrone (50 cm), darin der
     Blick in den dunklen Keller (Parallaxe: der Kellerboden liegt tief),
     dann die Kellerdecke (Balken), dann Dielen */
  function sockelDeckel(Z, winter, V, B, hTop) {
    hTop = hTop == null ? S0 - 0.06 : hTop;
    return function (g, F) {
      const w = F.w, h = F.h, px = F.px, d = 0.5;
      g.fillStyle = "rgb(146,92,76)"; g.fillRect(-0.02, -0.02, w + 0.04, h + 0.04);
      if (px > 8) rausch(g, 0, 0, w, h, 0.8, 0.3, 17, 3);
      const ix = d, iy = d, iw = w - 2 * d, ih = h - 2 * d;
      const balken = Z.k(0.28, 0.3), boden = Z.k(0.3, 0.32);
      if (boden < 1) {
        /* Keller: Innenwände (Bruchstein, nach unten dunkler), Boden tief */
        g.save(); g.beginPath(); g.rect(ix, iy, iw, ih); g.clip();
        const gi = g.createLinearGradient(0, iy, 0, iy + ih);
        gi.addColorStop(0, "rgb(96,72,60)"); gi.addColorStop(1, "rgb(70,52,44)");
        g.fillStyle = gi; g.fillRect(ix, iy, iw, ih);
        const tief = hTop + 1.7;
        const p = B && B.e ? parallaxe(F, B, tief) : [0, 1];
        /* sichtbare Innenwände aus Bruchstein: Lagen parallel zur Kante,
           von oben nach unten dunkler (je Tonstufe ein Pfad) */
        if (px > 8 && Math.abs(p[1]) > 0.05) {
          const rb = zufall(41), toene = [[], [], []], schritt = 0.24 / tief;
          for (let t = 0; t < 1; t += schritt * (0.8 + rb() * 0.4)) {
            const yy = iy + p[1] * t, xx0 = ix + p[0] * t, hh = p[1] * schritt * 0.85;
            for (let x = xx0 - rb() * 0.3; x < xx0 + iw; ) { const sw = 0.25 + rb() * 0.35; toene[Math.min(2, Math.floor(t * 2.2 + rb() * 0.8))].push([x + 0.015, yy, sw - 0.03, hh]); x += sw; }
          }
          const farben = ["rgb(118,104,90)", "rgb(92,80,70)", "rgb(66,56,50)"];
          toene.forEach((liste, k) => { g.beginPath(); for (const [x, y, ww, hh] of liste) rundPfad(g, x, y, ww, Math.abs(hh), 0.03); g.fillStyle = farben[k]; g.fill(); });
        }
        g.fillStyle = "rgb(40,32,28)"; g.fillRect(ix + p[0], iy + p[1], iw, ih);
        const gs = g.createLinearGradient(0, iy + p[1], 0, iy + p[1] + 0.8);
        gs.addColorStop(0, "rgba(10,8,8,0.6)"); gs.addColorStop(1, "rgba(10,8,8,0)");
        g.fillStyle = gs; g.fillRect(ix + p[0], iy + p[1], iw, 0.8);
        /* Kellertreppe an der hinteren Wand: acht Sandsteinstufen, jede
           mit ihrer eigenen Tiefe (Parallaxe) – von unten nach oben gemalt */
        if (B && B.e && px > 6) {
          const n = 8, sb = 0.9, x0 = ix + 0.4;
          for (let i = 1; i <= n; i++) {
            const d = tief - i * tief / (n + 1), q = parallaxe(F, B, d), q0 = parallaxe(F, B, d + tief / (n + 1));
            const x = x0 + (i - 1) * 0.28;
            g.fillStyle = "rgb(70,44,36)"; g.fillRect(x + q0[0], iy + q0[1], 0.3, q[1] - q0[1] + sb);     // Setzstufe
            g.fillStyle = rgb(hell([150, 98, 80], -0.35 + i * 0.03)); g.fillRect(x + q[0], iy + q[1], 0.3, sb);   // Trittfläche
            g.fillStyle = "rgba(255,230,210,0.12)"; g.fillRect(x + q[0], iy + q[1], 0.3, 0.03);
          }
        }
        g.restore();
        /* Kellerdecke: Balken quer, einer nach dem anderen */
        if (balken > 0) {
          const n = Math.floor((iw) / 0.8) + 1, bis = Math.ceil(n * balken);
          for (let i = 0; i < bis; i++) {
            const x = ix + 0.2 + i * 0.8;
            if (x > ix + iw - 0.1) break;
            g.fillStyle = "rgba(20,14,10,0.5)"; g.fillRect(x + 0.04, iy - 0.05, 0.2, ih + 0.1);
            g.fillStyle = rgb(hell(HOLZ_ROH, -0.05)); g.fillRect(x, iy - 0.1, 0.2, ih + 0.2);
            g.fillStyle = rgb(hell(HOLZ_ROH, 0.1)); g.fillRect(x, iy - 0.1, 0.03, ih + 0.2);
          }
        }
      }
      /* Mauerkrone: Mörtelbett und Fugen */
      g.strokeStyle = "rgba(200,190,170,0.5)"; g.lineWidth = Math.max(0.012, 0.7 / px);
      g.strokeRect(d * 0.5, d * 0.5, w - d, h - d);
      if (boden > 0) dielen(w - 0.1, h - 0.1, boden, V.saat + 4, false)(g, { w: w, h: h, px: px, n: F.n, zeit: F.zeit, jahr: F.jahr });
      if (winter) {
        /* Schnee nur auf der Mauerkrone (und dünn auf fertigen Dielen) –
           nicht als Schleier über dem offenen Kellerloch */
        g.fillStyle = "rgba(240,244,250,0.55)";
        g.beginPath(); g.rect(-0.02, -0.02, w + 0.04, h + 0.04); g.rect(ix, iy + ih, iw, -ih); g.fill();
        if (boden > 0) { g.fillStyle = "rgba(240,244,250," + (0.3 * boden).toFixed(3) + ")"; g.fillRect(ix, iy, iw, ih); }
      }
    };
  }

  /* =====================================================================
     BAUGRUBE, FUNDAMENT, KELLER
     Alles unter der Erde ist nur durch die Öffnung der Grube zu sehen:
     jede Fläche wird auf den Teil beschnitten, der durch das Loch sichtbar
     ist (Öffnung entlang der Blickrichtung auf die Fläche gelegt).
     Grube 2,2 m tief mit steiler Böschung (~76°), Streifenfundament aus
     Beton, Kellermauern aus Bruchstein, dann wird verfüllt.
     ===================================================================== */
  const GX = 5.2, GY = 4.4, TG = 2.2, GXU = 4.7, GYU = 3.8;
  const KX_ = XE + SV, KY_ = YE + SV;          // Außenkante Kellermauer = Sockel
  const KI = 0.5;                              // Mauerstärke
  const ZFU = -TG + 0.5;                       // Oberkante Streifenfundament
  function lochClip(g, F, B, loch) {
    const f = F.flaeche, n = kreuz(f.u, f.v), e = B.e;
    const en = dot(e, n);
    if (Math.abs(en) < 1e-3) return false;
    const [x0, y0, x1, y1] = loch || [-GX, -GY, GX, GY];
    const pts = [];
    for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]) {
      const C = [x, y, 0];
      const t = dot(sub(C, f.o), n) / en;
      const P = sub(C, mul(e, t));
      const d = sub(P, f.o);
      pts.push([dot(d, f.u), dot(d, f.v)]);
    }
    poly(g, pts); g.clip();
    return true;
  }
  /* Schatten des Grubenrands: beleuchtet ist nur, was durch die Öffnung
     entlang des Lichts erreichbar ist. */
  function grubenSchatten(g, F, w, h) {
    const f = F.flaeche, n = kreuz(f.u, f.v);
    g.save();
    g.beginPath(); g.rect(-0.5, -0.5, w + 1, h + 1);
    let licht = true;
    const pts = [];
    for (const [x, y] of [[-GX, -GY], [GX, -GY], [GX, GY], [-GX, GY]]) {
      const d = sub([x, y, 0], f.o), a = dot(d, f.u), b = dot(d, f.v), hh = dot(d, n);
      if (hh < -0.01) { licht = false; break; }
      const sv = hh > 0.005 ? F.schatten(hh) : [0, 0];
      if (!sv) { licht = false; break; }
      pts.push([a + sv[0], b + sv[1]]);
    }
    if (licht) { const H = huelle2(pts); if (H.length >= 3) { g.moveTo(H[0][0], H[0][1]); for (let i = H.length - 1; i > 0; i--) g.lineTo(H[i][0], H[i][1]); g.closePath(); } }
    g.fillStyle = "rgba(20,24,52,0.32)";
    g.fill("evenodd");
    g.restore();
  }
  /* Beliebiges ebenes Vieleck im Raum (Außenseite = n) */
  function polyFlaeche(M, pts, n, malen, extra) {
    n = nrm(n);
    let u = sub(pts[1], pts[0]);
    u = nrm(sub(u, mul(n, dot(u, n))));
    const v = kreuz(n, u);
    const q = pts.map((P) => { const d = sub(P, pts[0]); return [dot(d, u), dot(d, v)]; });
    let a0 = 1e9, b0 = 1e9, a1 = -1e9, b1 = -1e9;
    for (const [a, b] of q) { a0 = Math.min(a0, a); b0 = Math.min(b0, b); a1 = Math.max(a1, a); b1 = Math.max(b1, b); }
    const o = add(pts[0], add(mul(u, a0), mul(v, b0)));
    return M.flaeche(Object.assign({ o: o, u: u, v: v, w: a1 - a0, h: b1 - b0, umriss: q.map(([a, b]) => [a - a0, b - b0]), malen: malen, keinAo: true }, extra || {}));
  }
  /* Erde: Grubenboden (zwei gedrehte Rauschmaßstäbe, Ränder dunkel) oder
     Böschung mit kräftigen Schichten und heller Schnittkante oben */
  function erdeMal(B, art, T, winter, saat, sauber) {
    return function (g, F) {
      const w = F.w, h = F.h, L = belichter(F, 0.05), rng = zufall(saat), px = F.px;
      g.save();
      if (!lochClip(g, F, B)) { g.restore(); return; }
      if (art === "boden") {
        g.fillStyle = L([112, 84, 58]); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
        if (px > 4) { rausch(g, 0, 0, w, h, 1.37, 0.14, saat, 3); rausch(g, 0, 0, w, h, 3.1, 0.14, saat + 11, 3); }
        if (sauber > 0 && px > 5) {
          g.fillStyle = L([150, 146, 140], sauber); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
          if (px > 12) for (let i = 0; i < Math.min(1400, w * h * 22); i++) { g.fillStyle = L(hell([150, 146, 140], (rng() - 0.5) * 0.5), sauber); g.beginPath(); g.ellipse(rng() * w, rng() * h, 0.02 + rng() * 0.02, 0.015, rng() * 3, 0, Math.PI * 2); g.fill(); }
        }
        /* Reifenspuren des Baggers */
        if (px > 8 && sauber < 0.5) { g.strokeStyle = L([80, 58, 40], 0.3); g.lineWidth = 0.35; g.beginPath(); g.moveTo(w * 0.1, h * 0.8); g.bezierCurveTo(w * 0.35, h * 0.5, w * 0.6, h * 0.55, w * 0.9, h * 0.3); g.stroke(); }
        /* zu den Wänden hin stark abgedunkelt (Umgebungsschatten) */
        for (const [x0, y0, x1, y1] of [[0, 0, 0, 0.6], [0, h, 0, h - 0.6], [0, 0, 0.6, 0], [w, 0, w - 0.6, 0]]) {
          const gr = g.createLinearGradient(x0, y0, x1, y1);
          gr.addColorStop(0, "rgba(14,10,16,0.45)"); gr.addColorStop(1, "rgba(14,10,16,0)");
          g.fillStyle = gr; g.fillRect(Math.min(x0, x1) - (x0 === x1 ? 0.1 : 0), Math.min(y0, y1) - (y0 === y1 ? 0.1 : 0), x0 === x1 ? w + 0.2 : 0.6, y0 === y1 ? h + 0.2 : 0.6);
        }
        grubenSchatten(g, F, w, h);
      } else {
        /* Erdschichten nach der Tiefe: Mutterboden, Lehm, Sand und Kies */
        const f = F.flaeche;
        const yT = (d) => (-d - f.o[2]) / (f.v[2] || -1);
        const sch = [[0, [58, 42, 30]], [0.3, [132, 94, 56]], [1.25, [178, 142, 92]], [1.85, [150, 138, 120]]];
        for (let i = 0; i < sch.length; i++) {
          const y0 = yT(sch[i][0]), c = sch[i][1];
          if (y0 > h + 0.2) continue;
          g.fillStyle = L(c);
          g.beginPath(); g.moveTo(-0.1, h + 0.2); g.lineTo(-0.1, y0);
          for (let x = 0; x <= w + 0.3; x += 0.3) g.lineTo(x, y0 + (i ? Math.sin(x * 1.7 + i * 3 + saat) * 0.06 + Math.sin(x * 4.1 + i) * 0.03 : 0));
          g.lineTo(w + 0.3, h + 0.2); g.closePath(); g.fill();
        }
        if (px > 6) rausch(g, 0, 0, w, h, 0.9, 0.3, saat + 3, 3);
        if (px > 10) {
          for (let i = 0; i < w * h * 7; i++) { const x = rng() * w, y = yT(0.3) + rng() * (h - yT(0.3)), r = 0.015 + rng() * 0.035; g.fillStyle = L(hell([140, 130, 118], (rng() - 0.5) * 0.4)); g.beginPath(); g.ellipse(x, y, r * 1.3, r, rng() * 3, 0, Math.PI * 2); g.fill(); }
          g.strokeStyle = L([40, 28, 20], 0.7); g.lineWidth = Math.max(0.004, 0.7 / px);
          for (let i = 0; i < w * 1.2; i++) { const x = rng() * w; g.beginPath(); g.moveTo(x, 0.05); g.quadraticCurveTo(x + (rng() - 0.5) * 0.2, 0.15, x + (rng() - 0.5) * 0.25, 0.1 + rng() * 0.3); g.stroke(); }
          g.strokeStyle = L([30, 20, 14], 0.16); g.lineWidth = 0.02;
          for (let x = rng() * 0.3; x < w; x += 0.25 + rng() * 0.2) { g.beginPath(); g.moveTo(x, yT(0.3)); g.lineTo(x + 0.03, h); g.stroke(); }
        }
        /* dunkler zum Grund hin */
        const gd = g.createLinearGradient(0, 0, 0, h);
        gd.addColorStop(0, "rgba(10,8,20,0)"); gd.addColorStop(1, "rgba(10,8,20,0.3)");
        g.fillStyle = gd; g.fillRect(-0.1, 0, w + 0.2, h + 0.1);
        grubenSchatten(g, F, w, h);
        /* helle Schnittkante oben: Schneedecke bzw. Grasnarbe */
        const yk = yT(0.12);
        if (winter) { g.fillStyle = L([242, 246, 252]); g.fillRect(-0.1, -0.1, w + 0.2, yk + 0.1); g.fillStyle = L([200, 212, 234]); g.fillRect(-0.1, yk - 0.02, w + 0.2, 0.02); }
        else { g.fillStyle = L([86, 118, 52]); g.fillRect(-0.1, -0.1, w + 0.2, yk * 0.5 + 0.1); g.fillStyle = L([70, 52, 34]); g.fillRect(-0.1, yk * 0.5, w + 0.2, yk * 0.5); }
      }
      g.restore();
    };
  }
  /* Quader unter der Erde (durch die Grubenöffnung beschnitten) */
  function erdQuader(M, B, x0, x1, y0, y1, z0, z1, mal, seiten, extra) {
    const hh = z1 - z0;
    /* Kern: das Licht wird per „multiply" über die GANZE Fläche gelegt –
       auf durchsichtigen Stellen malt das die Lichtfarbe hin. Deshalb
       keinLicht und das Licht selbst innerhalb der Grubenöffnung auftragen. */
    /* Unter der Erde liegt fast alles im Schatten des Grubenrands – sonst
       leuchten schmale Kanten (Fundamentabsatz im engen Arbeitsraum) weiß. */
    const w = (fn) => (g, F) => { g.save(); if (lochClip(g, F, B)) { fn(g, F); lichtAuf(g, F, -1, -1, F.w + 2, F.h + 2); if (z1 < 0.01) grubenSchatten(g, F, F.w, F.h); } g.restore(); };
    const q = { x: x0, y: y0, z: z0, b: x1 - x0, t: y1 - y0, h: hh };
    const m = {}, liste = seiten || ["sued", "nord", "ost", "west", "oben"];
    for (const k of liste) if (k !== "oben") m[k] = w(mal(k));
    const opt = Object.assign({ keinAo: true, keinLicht: true }, extra || {});
    M.quader(q, m, opt);
    /* Kern: M.quader gibt die Optionen nicht an die Deckfläche weiter – die
       bekäme wieder Licht per „multiply" auf die beschnittenen, durchsichtigen
       Stellen (weiße Rahmen vor der Grube). Deckfläche deshalb selbst. */
    if (liste.indexOf("oben") >= 0) M.flaeche(Object.assign({ name: "oben", o: [x0, y0, z1], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, malen: w(mal("oben")) }, opt));
  }
  /* Beton mit Schalungsspuren (Brettfugen, Ankerlöcher) */
  function betonMal(nass, saat) {
    return (seite) => (g, F) => {
      const w = F.w, h = F.h;
      g.fillStyle = nass ? "rgb(118,120,122)" : "rgb(168,166,158)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      if (F.px > 6) rausch(g, 0, 0, w, h, 1.1, 0.25, saat + seite.length, 3);
      if (seite !== "oben" && F.px > 8) {
        g.strokeStyle = "rgba(110,108,102,0.7)"; g.lineWidth = Math.max(0.005, 0.7 / F.px);
        for (let y = 0.1; y < h; y += 0.2) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
        g.fillStyle = "rgb(70,70,68)"; for (let x = 0.4; x < w; x += 1.0) { g.beginPath(); g.arc(x, h * 0.5, 0.012, 0, Math.PI * 2); g.fill(); }
      }
      if (nass) { g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(-0.05, -0.05, w + 0.1, 0.03); }
    };
  }
  /* Bruchstein (Kellermauer): unregelmäßige Steine in Lagen, Kalkmörtel */
  function bruchsteinMal(saat) {
    return (seite) => (g, F) => {
      const w = F.w, h = F.h, rng = zufall(saat + seite.length * 7), px = F.px;
      g.fillStyle = "rgb(150,142,128)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      if (seite === "oben") { if (px > 8) rausch(g, 0, 0, w, h, 0.5, 0.3, saat, 3); return; }
      if (px > 6) {
        for (let y = h; y > -0.3; y -= 0.24 + rng() * 0.08) {
          for (let x = -rng() * 0.3; x < w; ) {
            const sw = 0.25 + rng() * 0.35, sh = 0.18 + rng() * 0.08;
            const c = hell([128, 116, 100], (rng() - 0.5) * 0.3);
            g.fillStyle = rgb(misch(c, [150, 100, 80], rng() * 0.4));
            PI.rundRechteck(g, x + 0.015, y - sh, sw - 0.03, sh - 0.02, 0.05); g.fill();
            x += sw;
          }
        }
        rausch(g, 0, 0, w, h, 0.7, 0.2, saat + 2, 3);
      }
    };
  }
  function grubeBauen(M, B, Z, winter, V) {
    const bau = Z.bau;
    const T = TG * glatt(Z.k(0.0, 0.09));
    const sauber = Z.k(0.09, 0.12);
    const zf = bau < 0.205 ? -TG : -TG + TG * glatt(Z.k(0.205, 0.22));
    const hK = bau < 0.17 ? ZFU : ZFU + (-ZFU) * Math.floor(Z.k(0.17, 0.205) * 12 + 1e-6) / 12;
    const dxG = (GX - GXU) / TG, dyG = (GY - GYU) / TG;
    const ohneGrund = { schatten: false };
    if (T > 0.02) {
      const xu = GX - dxG * T, yu = GY - dyG * T;
      M.teil("grube", Object.assign({ mitte: [0, 0, -3], ebene: -5 }, ohneGrund));
      polyFlaeche(M, [[-xu, -yu, -T], [xu, -yu, -T], [xu, yu, -T], [-xu, yu, -T]], [0, 0, 1], erdeMal(B, "boden", T, winter, V.saat + 1, sauber), { keinLicht: true, name: "grube-boden" });
      const wand = (pts, n, s2) => polyFlaeche(M, pts, n, erdeMal(B, "wand", T, winter, V.saat + s2, 0), { keinLicht: true, name: "grube-w" + s2 });
      wand([[-GX, -GY, 0], [GX, -GY, 0], [xu, -yu, -T], [-xu, -yu, -T]], [0, T, GY - yu], 2);
      wand([[GX, GY, 0], [-GX, GY, 0], [-xu, yu, -T], [xu, yu, -T]], [0, -T, GY - yu], 3);
      wand([[GX, -GY, 0], [GX, GY, 0], [xu, yu, -T], [xu, -yu, -T]], [-T, 0, GX - xu], 4);
      wand([[-GX, GY, 0], [-GX, -GY, 0], [-xu, -yu, -T], [-xu, yu, -T]], [T, 0, GX - xu], 5);
    }
    /* Kellerboden (Stampflehm) innerhalb der Mauern */
    if (bau >= 0.175) {
      M.teil("kellerboden", Object.assign({ mitte: [0, 0, -2.5], ebene: -4.5 }, ohneGrund));
      polyFlaeche(M, [[-KX_ + KI, -KY_ + KI, ZFU], [KX_ - KI, -KY_ + KI, ZFU], [KX_ - KI, KY_ - KI, ZFU], [-KX_ + KI, KY_ - KI, ZFU]], [0, 0, 1],
        (g, F) => { g.save(); if (lochClip(g, F, B)) { g.fillStyle = "rgb(84,70,58)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); if (F.px > 6) rausch(g, 0, 0, F.w, F.h, 1.2, 0.3, 8, 3); lichtAuf(g, F, -1, -1, F.w + 2, F.h + 2); grubenSchatten(g, F, F.w, F.h); } g.restore(); }, { keinLicht: true, name: "kellerboden" });
    }
    /* Je Seite ein Teil: Streifenfundament, Kellermauer, Verfüllung */
    if (bau >= 0.12) {
      const schal = bau < 0.17, bew = bau < 0.15, betonH = 0.5 * Z.k(0.135, 0.15), nass = bau < 0.16;
      const rest = 1 - Z.k(0.155, 0.17);
      const fa = 0.1, seiten = [
        { n: "n", mitte: [0, -3.9, -1.2], fund: [-KX_ - fa, KX_ + fa, -KY_ - fa, -KY_ + KI + fa], wand: [-KX_, KX_, -KY_, -KY_ + KI] },
        { n: "s", mitte: [0, 3.9, -1.2], fund: [-KX_ - fa, KX_ + fa, KY_ - KI - fa, KY_ + fa], wand: [-KX_, KX_, KY_ - KI, KY_] },
        { n: "o", mitte: [4.9, 0, -1.2], fund: [KX_ - KI - fa, KX_ + fa, -KY_ + KI + fa, KY_ - KI - fa], wand: [KX_ - KI, KX_, -KY_ + KI, KY_ - KI] },
        { n: "w", mitte: [-4.9, 0, -1.2], fund: [-KX_ - fa, -KX_ + KI + fa, -KY_ + KI + fa, KY_ - KI - fa], wand: [-KX_, -KX_ + KI, -KY_ + KI, KY_ - KI] }
      ];
      const xp = GXU + dxG * (zf + TG), yp = GYU + dyG * (zf + TG);
      for (const sd of seiten) {
        M.teil("keller-" + sd.n, Object.assign({ mitte: sd.mitte, ebene: -4 }, ohneGrund));
        const [fx0, fx1, fy0, fy1] = sd.fund;
        if (betonH > 0.01) erdQuader(M, B, fx0, fx1, fy0, fy1, -TG, -TG + betonH, betonMal(nass, V.saat + 3));
        /* Schalung: Bretter innen und außen, nach dem Ausschalen hängen noch einzelne */
        if (schal) {
          const brett = (seite) => (g, F) => {
            const rng = zufall(seite.length * 13 + sd.n.charCodeAt(0));
            for (let y = -0.05; y < F.h; y += 0.2) { g.fillStyle = rgb(hell([196, 160, 104], (rng() - 0.5) * 0.2)); g.fillRect(-0.05, y, F.w + 0.1, 0.195); g.fillStyle = "rgb(110,84,52)"; g.fillRect(-0.05, y + 0.195, F.w + 0.1, 0.005); }
            g.fillStyle = "rgb(120,92,58)"; for (let x = 0.3; x < F.w; x += 0.9) g.fillRect(x, -0.05, 0.06, F.h + 0.1);
          };
          const d = 0.03, zS = -TG + 0.55;
          const bretter = sd.n === "n" || sd.n === "s" ? [[fx0 - d, fx1 + d, fy0 - d, fy0], [fx0 - d, fx1 + d, fy1, fy1 + d]] : [[fx0 - d, fx0, fy0, fy1], [fx1, fx1 + d, fy0, fy1]];
          bretter.forEach((bq, i) => {
            if (rest < 1) {
              /* Ausschalen: es bleiben einzelne Brettabschnitte hängen */
              const lang = bq[1] - bq[0] > bq[3] - bq[2];
              for (let k = 0; k < 4; k++) {
                if (ST.hash2(k, i, sd.n.charCodeAt(0)) > rest * 0.9) continue;
                const t0 = k / 4, t1 = t0 + 0.12;
                const q = lang ? [bq[0] + (bq[1] - bq[0]) * t0, bq[0] + (bq[1] - bq[0]) * t1, bq[2], bq[3]] : [bq[0], bq[1], bq[2] + (bq[3] - bq[2]) * t0, bq[2] + (bq[3] - bq[2]) * t1];
                erdQuader(M, B, q[0], q[1], q[2], q[3], -TG, zS, brett);
              }
            } else erdQuader(M, B, bq[0], bq[1], bq[2], bq[3], -TG, zS, brett);
          });
          if (bew) {
            /* Bewehrungskorb von oben: Längsstäbe und Bügel */
            polyFlaeche(M, [[fx0, fy0, -TG + 0.45], [fx1, fy0, -TG + 0.45], [fx1, fy1, -TG + 0.45], [fx0, fy1, -TG + 0.45]], [0, 0, 1], (g, F) => {
              g.save(); if (lochClip(g, F, B)) {
                g.strokeStyle = "rgb(92,58,40)"; g.lineWidth = Math.max(0.016, 0.7 / F.px);
                for (let t = 0.12; t < F.h; t += 0.18) { g.beginPath(); g.moveTo(0, t); g.lineTo(F.w, t); g.stroke(); }
                for (let t = 0.1; t < F.w; t += 0.25) { g.beginPath(); g.moveTo(t, 0.05); g.lineTo(t, F.h - 0.05); g.stroke(); }
              } g.restore();
            }, { keinLicht: true, name: "bewehrung" });
          }
        }
        /* Anschlusseisen ragen aus dem frischen Beton, bis die Mauer steht */
        if (bau >= 0.15 && hK < ZFU + 0.45) {
          const cx = (sd.wand[0] + sd.wand[1]) / 2, cy = (sd.wand[2] + sd.wand[3]) / 2, lang = sd.n === "n" || sd.n === "s";
          const L2 = lang ? sd.wand[1] - sd.wand[0] : sd.wand[3] - sd.wand[2];
          const pts = lang ? [[sd.wand[0], cy, ZFU + 0.5], [sd.wand[1], cy, ZFU + 0.5], [sd.wand[1], cy, ZFU], [sd.wand[0], cy, ZFU]] : [[cx, sd.wand[2], ZFU + 0.5], [cx, sd.wand[3], ZFU + 0.5], [cx, sd.wand[3], ZFU], [cx, sd.wand[2], ZFU]];
          polyFlaeche(M, pts, lang ? [0, 1, 0] : [1, 0, 0], (g, F) => {
            g.save(); if (lochClip(g, F, B)) { g.strokeStyle = "rgb(96,60,40)"; g.lineWidth = Math.max(0.014, 0.8 / F.px); for (let x = 0.15; x < L2; x += 0.3) { g.beginPath(); g.moveTo(x, F.h); g.lineTo(x, Math.max(0, (hK - ZFU) > 0 ? 0 : 0)); g.stroke(); } } g.restore();
          }, { keinLicht: true, beidseitig: true, name: "anschluss" });
        }
        /* Kellermauer aus Bruchstein, Lage für Lage */
        if (hK > ZFU + 0.01) {
          const [wx0, wx1, wy0, wy1] = sd.wand;
          erdQuader(M, B, wx0, wx1, wy0, wy1, ZFU, hK, bruchsteinMal(V.saat + sd.n.charCodeAt(0)));
        }
        /* Verfüllung zwischen Mauer und Böschung */
        if (zf > -TG + 0.02) {
          const r = sd.n === "n" ? [[-xp, -yp], [xp, -yp], [xp, -KY_], [-xp, -KY_]] : sd.n === "s" ? [[-xp, KY_], [xp, KY_], [xp, yp], [-xp, yp]] : sd.n === "o" ? [[KX_, -KY_], [xp, -KY_], [xp, KY_], [KX_, KY_]] : [[-xp, -KY_], [-KX_, -KY_], [-KX_, KY_], [-xp, KY_]];
          polyFlaeche(M, r.map(([x, y]) => [x, y, zf]), [0, 0, 1], (g, F) => {
            g.save(); if (lochClip(g, F, B)) {
              g.fillStyle = "rgb(94,70,50)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
              if (F.px > 6) { rausch(g, 0, 0, F.w, F.h, 0.9, 0.35, 12, 3); rausch(g, 0, 0, F.w, F.h, 0.3, 0.2, 13, 2); }
              if (winter && zf > -0.05) { g.fillStyle = "rgba(240,244,250,0.35)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); }
              lichtAuf(g, F, -1, -1, F.w + 2, F.h + 2);
              grubenSchatten(g, F, F.w, F.h);
            } g.restore();
          }, { keinLicht: true, name: "verfuellung" });
        }
      }
    }
    /* Aushub: zwei Haufen am Rand – Mutterboden dunkel, Unterboden lehmgelb */
    const wachs = glatt(Z.k(0.0, 0.09)) * (1 - 0.9 * Z.k(0.205, 0.235));
    if (wachs > 0.03) {
      haufenBauen(M, B, "aushub-m", -2.4, -5.8, 2.5, 1.6, 1.5, [74, 54, 38], wachs, winter, V.saat + 1);
      haufenBauen(M, B, "aushub-l", 2.6, -5.85, 2.3, 1.5, 1.35, [166, 128, 80], wachs * Math.min(1, glatt(Z.k(0.02, 0.09)) * 1.2), winter, V.saat + 2);
    }
    /* Schnurgerüst: Böcke an den Ecken, Schnüre auf den Hausfluchten */
    /* Schnurgerüst: bleibt, bis die erste Sockellage die Ecken festlegt */
    if (bau < 0.25) schnurgeruest(M, winter);
  }
  /* Erdhaufen als weicher Hügel (Figur): die Oberfläche wird als Netz
     aus 7 Ringen × 28 Sektoren im Modell berechnet, jede Masche bekommt das
     Licht ihrer Normalen – in 12 Helligkeitsstufen gebündelt, je Stufe ein
     Pfad. Darauf Krümel, einzelne Steine und im Winter fleckiger Schnee
     nur auf den flachen, oben liegenden Stellen. Keine Facetten, die wie
     geschliffene Kristalle aussehen. */
  function haufenBauen(M, B, name, cx, cy, rx, ry, h, farbe, wachs, winter, saat) {
    const k = Math.cbrt(wachs), hh = h * Math.sqrt(wachs);
    M.teil(name, { mitte: [cx, cy, hh * 0.35] });
    M.figur({ x: cx, y: cy, z: 0, breite: 1.8 * (rx + ry) * k + 0.4, hoehe: hh + (rx + ry) * k * 0.6, malen: haufenFigur(B, rx * k, ry * k, hh, farbe, winter, saat) });
  }
  function haufenFigur(B, rx, ry, h, farbe, winter, saat) {
    const NR = 7, NT = 28;
    const rr = zufall(saat), wel = []; for (let i = 0; i < 6; i++) wel.push([rr() * 6.28, 0.05 + rr() * 0.08, 1 + Math.floor(rr() * 5)]);
    const hoch = (r, t) => { let q = 1; for (const [ph, a, f] of wel) q += a * Math.sin(t * f + ph); return h * Math.pow(Math.max(0, 1 - r * r), 1.1) * q; };
    const punkt = (r, t) => { const f = 1 + 0.08 * Math.sin(t * 3 + saat) + 0.05 * Math.sin(t * 5 + saat * 2); return [Math.cos(t) * rx * r * f, Math.sin(t) * ry * r * f, hoch(r, t)]; };
    return function (g, s, F) {
      if (!B || !B.e) return;
      if (F.schatten) {
        /* Schatten: nur das Profil (eine halbe Ellipse) */
        const w = Math.max(rx, ry) * s * 0.9;
        g.fillStyle = "#000"; g.beginPath(); g.moveTo(-w, 0); g.quadraticCurveTo(-w * 0.6, -h * ST.KZ * s * 1.3, 0, -h * ST.KZ * s); g.quadraticCurveTo(w * 0.6, -h * ST.KZ * s * 1.3, w, 0); g.closePath(); g.fill();
        return;
      }
      const e = B.e, stufen = 12, gruppen = []; for (let i = 0; i < stufen; i++) gruppen.push([]);
      const schnee = [], maschen = [];
      const P = [];
      for (let j = 0; j <= NR; j++) { P.push([]); for (let i = 0; i < NT; i++) P[j].push(punkt(j / NR, i / NT * Math.PI * 2)); }
      for (let j = 0; j < NR; j++) for (let i = 0; i < NT; i++) {
        const a = P[j][i], b = P[j + 1][i], c = P[j + 1][(i + 1) % NT], d = P[j][(i + 1) % NT];
        let n = nrm(kreuz(sub(c, a), sub(d, b)));
        if (n[2] < 0) n = mul(n, -1);
        if (dot(n, e) <= 0.02) continue;
        const m = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2, (a[2] + c[2]) / 2];
        maschen.push({ q: [a, b, c, d], n: n, tiefe: dot(m, e), m: m });
      }
      maschen.sort((u, v) => u.tiefe - v.tiefe);
      /* Licht je Masche aus der Lichtrechnung des Kerns (Kamera-Normale) */
      const L0 = ST.lichtFaktor(drehN(B, [0, 0, 1]), F.Z, 0, F.jahr);
      let lmin = Infinity, lmax = -Infinity;
      /* Licht etwas überzeichnet (×1,6 um das Licht der Oberseite) und
         unten am Fuß dunkler (Umgebungsverdeckung): so liest man die Form */
      for (const mm of maschen) {
        const lf0 = ST.lichtFaktor(drehN(B, mm.n), F.Z, 0, F.jahr), fuss = 0.82 + 0.18 * klemm(mm.m[2] / (h * 0.35), 0, 1);
        const lf = lf0.map((v, i) => Math.max(0.05, (L0[i] + (v - L0[i]) * 1.6) * fuss));
        mm.l = (lf[0] + lf[1] + lf[2]) / 3; mm.lf = lf; lmin = Math.min(lmin, mm.l); lmax = Math.max(lmax, mm.l);
      }
      for (const mm of maschen) {
        const st = Math.min(stufen - 1, Math.floor((mm.l - lmin) / Math.max(1e-3, lmax - lmin) * stufen));
        gruppen[st].push(mm);
        if (winter && mm.n[2] > 0.6 && ST.fbm(mm.m[0] * 1.8 + saat, mm.m[1] * 1.8, 3, saat) > 0.6 - 0.4 * (mm.n[2] - 0.6)) schnee.push(mm);
      }
      const bild = (p) => bildVersatz(B, s, p);
      const flaeche = (liste) => { g.beginPath(); for (const mm of liste) { mm.q.forEach((p, i) => { const b = bild(p); if (i) g.lineTo(b[0], b[1]); else g.moveTo(b[0], b[1]); }); g.closePath(); } };
      g.lineJoin = "round"; g.lineWidth = 1;
      gruppen.forEach((liste) => {
        if (!liste.length) return;
        const lf = liste[0].lf, c = rgb([farbe[0] * lf[0], farbe[1] * lf[1], farbe[2] * lf[2]].map((v) => Math.min(255, v)));
        flaeche(liste); g.fillStyle = c; g.fill(); g.strokeStyle = c; g.stroke();
      });
      /* Krümel, Klumpen und Steine (nur auf sichtbaren Maschen) */
      if (s > 10) {
        const rk = zufall(saat + 9), hellK = [], dunkelK = [], steine = [];
        const n = Math.min(400, Math.round(maschen.length * (s > 30 ? 3 : 1.2)));
        for (let i = 0; i < n; i++) {
          const mm = maschen[Math.floor(rk() * maschen.length)], t = rk(), u = rk();
          const [a, b, c] = mm.q, p = [a[0] + (b[0] - a[0]) * t + (c[0] - b[0]) * u * t, a[1] + (b[1] - a[1]) * t + (c[1] - b[1]) * u * t, a[2] + (b[2] - a[2]) * t + (c[2] - b[2]) * u * t];
          const q = bild(p), r = Math.max(0.6, (0.02 + rk() * 0.04) * s);
          (rk() < 0.08 ? steine : rk() < 0.5 ? hellK : dunkelK).push([q[0], q[1], r * (steine.length ? 1 : 1)]);
        }
        const L = L0;
        const tupf = (liste, c, sx) => { g.beginPath(); for (const [x, y, r] of liste) { g.moveTo(x + r * sx, y); g.ellipse(x, y, r * sx, r * 0.6, 0, 0, Math.PI * 2); } g.fillStyle = c; g.fill(); };
        tupf(dunkelK, rgb(hell(farbe, -0.3).map((v, i) => v * L[i])), 1.2);
        tupf(hellK, rgb(hell(farbe, 0.2).map((v, i) => Math.min(255, v * L[i]))), 1);
        tupf(steine, rgb([128 * L[0], 122 * L[1], 112 * L[2]]), 1.6);
        if (s > 25) tupf(steine.map(([x, y, r]) => [x - r * 0.4, y - r * 0.25, r * 0.5]), rgb([196 * L[0], 190 * L[1], 180 * L[2]].map((v) => Math.min(255, v))), 1.4);
      }
      /* Winter: fleckiger Schnee auf den oberen, flachen Stellen */
      if (schnee.length) {
        /* weiche Flecken: je Masche ein paar Tupfen – so entstehen runde,
           zusammenwachsende Ränder statt Maschenkanten */
        const sl = ST.lichtFaktor(drehN(B, [0, 0, 1]), F.Z, 0, F.jahr), rs = zufall(saat + 21);
        const c = rgb([244 * sl[0], 247 * sl[1], 252 * sl[2]].map((v) => Math.min(255, v)));
        const sb = rgb([206 * sl[0], 216 * sl[1], 234 * sl[2]].map((v) => Math.min(255, v)));
        const tupfen = [];
        for (const mm of schnee) for (let k = 0; k < 3; k++) {
          const q = bild([mm.m[0] + (rs() - 0.5) * 0.5, mm.m[1] + (rs() - 0.5) * 0.5, mm.m[2] + 0.02]);
          tupfen.push([q[0], q[1], (0.05 + rs() * 0.1) * s, rs() * 3]);
        }
        void sb;
        g.save(); g.globalAlpha = 0.82;
        g.beginPath(); for (const [x, y, r, d] of tupfen) { g.moveTo(x + r, y); g.ellipse(x, y, r, r * 0.45, d * 0.2, 0, Math.PI * 2); } g.fillStyle = c; g.fill();
        g.restore();
      }
    };
  }
  /* Schnurgerüst aus echten Körpern: Pflöcke, Bretter, Schnüre */
  function schnurgeruest(M, winter) {
    const ox = 5.7, oy = 4.9, zb = 0.72;
    const holz = (c) => (g, F) => { g.fillStyle = rgb(c); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); if (winter && F.n && F.n[2] > 0.5) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); } };
    const pfl = holz([150, 116, 74]), br = holz([200, 164, 108]);
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      M.teil("bock" + sx + sy, { mitte: [sx * (ox - 0.5), sy * (oy - 0.5), 0.4] });
      const ec = [sx * ox, sy * oy];
      for (const [x, y] of [[ec[0], ec[1]], [sx * (ox - 1.3), ec[1]], [ec[0], sy * (oy - 1.3)]]) M.quader({ x: x - 0.03, y: y - 0.03, z: 0, b: 0.06, t: 0.06, h: zb + 0.1 }, { sued: pfl, nord: pfl, ost: pfl, west: pfl, oben: pfl });
      const x0 = Math.min(ec[0], sx * (ox - 1.3)), y0 = Math.min(ec[1], sy * (oy - 1.3));
      M.quader({ x: x0, y: ec[1] + sy * 0.035 - 0.015, z: zb - 0.12, b: 1.3, t: 0.03, h: 0.12 }, { sued: br, nord: br, ost: br, west: br, oben: br });
      M.quader({ x: ec[0] + sx * 0.035 - 0.015, y: y0, z: zb - 0.12, b: 0.03, t: 1.3, h: 0.12 }, { sued: br, nord: br, ost: br, west: br, oben: br });
    }
    const schnur = (seite) => (g, F) => { g.fillStyle = "rgb(214,52,44)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); if (F.px * 0.2 > 2) { g.fillStyle = "rgb(240,236,230)"; for (let x = 0; x < F.w; x += 0.4) g.fillRect(x, -0.05, 0.2, F.h + 0.1); } void seite; };
    const d = 0.012;
    for (const sy of [-1, 1]) { M.teil("schnur-y" + sy, { mitte: [0, sy * KY_, zb] }); stab(M, [-ox + 0.1, sy * KY_, zb + 0.01], [ox - 0.1, sy * KY_, zb + 0.01], [0, 1, 0], d, Z3, -d / 2, d / 2, schnur, { seiten: "BbD" }); }
    for (const sx of [-1, 1]) { M.teil("schnur-x" + sx, { mitte: [sx * KX_, 0, zb] }); stab(M, [sx * KX_, -oy + 0.1, zb + 0.01], [sx * KX_, oy - 0.1, zb + 0.01], [1, 0, 0], d, Z3, -d / 2, d / 2, schnur, { seiten: "BbD" }); }
  }

  /* ---------------- Sockel Lage für Lage (0,22–0,30) ----------------
     Die erste Lage beginnt sofort mit einem Stück; der frisch verfüllte
     Erdring um den Sockel verschwindet langsam unter Schnee bzw. Gras. */
  function sockelBau(M, Z, V, winter, B) {
    const lagen = SOCKEL_LAGEN, hS = S0 - 0.06;
    const p = Z.k(0.22, 0.3) * lagen.length;
    const fertigN = Math.floor(p), teil = Math.max(p - fertigN, fertigN < lagen.length ? 0.05 : 0);
    let hF = 0; for (let i = 0; i < fertigN; i++) hF += lagen[i];
    /* frische Erde rund um den Sockel */
    const frisch = 1 - Z.k(0.23, 0.3);          // bis 0,30 zugewachsen: kein Sprung zum fertigen Sockel
    if (frisch > 0.02) {
      M.teil("erdring", { mitte: [0, 0, 0], ebene: -3, schatten: false });
      /* Außenrand unregelmäßig (festgefahrene Erde läuft aus), innen der Sockel */
      const aussen = [];
      /* weiche Wellen statt Zacken: Versatz nach außen als Summe zweier Sinus */
      let lauf = 0;
      const rand = (x, y, nx, ny) => { lauf += 0.45; const d = 0.12 * Math.sin(lauf * 0.9 + 1.3) + 0.08 * Math.sin(lauf * 2.3 + 0.4); return [x + nx * d, y + ny * d]; };
      for (let i = 0; i < 24; i++) aussen.push(rand(-GX + 2 * GX * i / 24, -GY, 0, -1));
      for (let i = 0; i < 20; i++) aussen.push(rand(GX, -GY + 2 * GY * i / 20, 1, 0));
      for (let i = 0; i < 24; i++) aussen.push(rand(GX - 2 * GX * i / 24, GY, 0, 1));
      for (let i = 0; i < 20; i++) aussen.push(rand(-GX, GY - 2 * GY * i / 20, -1, 0));
      const R0 = GX + 0.3, R1 = GY + 0.3;
      const um = aussen.map(([x, y]) => [x + R0, y + R1]);
      um.push(um[0], [R0 - KX_, R1 - KY_], [R0 - KX_, R1 + KY_], [R0 + KX_, R1 + KY_], [R0 + KX_, R1 - KY_], [R0 - KX_, R1 - KY_]);
      M.flaeche({ name: "erdring", o: [-R0, -R1, 0.005], u: [1, 0, 0], v: [0, 1, 0], w: 2 * R0, h: 2 * R1, umriss: um, keinAo: true,
        malen: (g, F) => {
          /* deckend malen und nach und nach mit Schnee bzw. Gras zuwachsen
             lassen (Transparenz vertrüge sich nicht mit dem Licht des Kerns):
             erst dünner Schleier, dann Flecken, die zusammenwachsen */
          g.fillStyle = "rgb(94,70,50)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
          if (F.px > 6) { rausch(g, 0, 0, F.w, F.h, 0.9, 0.35, 12, 3); rausch(g, 0, 0, F.w, F.h, 2.7, 0.2, 14, 3); }
          /* Fahrspuren und Trittsiegel in der frischen Erde */
          if (F.px > 8) { g.strokeStyle = "rgba(60,42,30,0.35)"; g.lineWidth = 0.28; g.beginPath(); g.moveTo(0.2, F.h * 0.9); g.bezierCurveTo(F.w * 0.3, F.h * 0.97, F.w * 0.6, F.h * 0.96, F.w - 0.2, F.h * 0.93); g.stroke(); }
          const zu = 1 - frisch, rz = zufall(31);
          const farbe = winter ? [240, 244, 251] : [92, 124, 58];
          g.fillStyle = "rgba(" + farbe.join(",") + "," + (0.12 + 0.5 * zu).toFixed(3) + ")";
          g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
          g.fillStyle = "rgb(" + farbe.join(",") + ")";
          if (F.px > 4) for (let i = 0; i < 40 + 260 * zu; i++) { g.beginPath(); g.ellipse(rz() * F.w, rz() * F.h, (0.08 + rz() * 0.3) * (0.6 + zu), (0.05 + rz() * 0.12) * (0.6 + zu), rz() * 3, 0, Math.PI * 2); g.fill(); }
        } });
    }
    /* solange noch keine volle Lage liegt: der Keller ist offen zu sehen */
    if (hF < 0.01) {
      const loch = [-KX_ + KI, -KY_ + KI, KX_ - KI, KY_ - KI];
      M.teil("keller-innen", { mitte: [0, 0, -1], ebene: -4, schatten: false });
      const innen = (pts, n, nm) => polyFlaeche(M, pts, n, (g, F) => { g.save(); if (lochClip(g, F, B, loch)) { g.fillStyle = nm === "boden" ? "rgb(70,58,48)" : "rgb(120,110,98)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); if (F.px > 6) rausch(g, 0, 0, F.w, F.h, 0.6, 0.35, nm.length, 3); const gd = g.createLinearGradient(0, 0, 0, F.h); gd.addColorStop(0, "rgba(10,8,8,0)"); gd.addColorStop(1, "rgba(10,8,8,0.5)"); g.fillStyle = gd; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); lichtAuf(g, F, -1, -1, F.w + 2, F.h + 2); } g.restore(); }, { keinLicht: true, name: "keller-" + nm });
      const [a0, b0, a1, b1] = loch;
      innen([[a0, b0, ZFU], [a1, b0, ZFU], [a1, b1, ZFU], [a0, b1, ZFU]], [0, 0, 1], "boden");
      innen([[a0, b0, 0], [a1, b0, 0], [a1, b0, ZFU], [a0, b0, ZFU]], [0, 1, 0], "n");
      innen([[a1, b1, 0], [a0, b1, 0], [a0, b1, ZFU], [a1, b1, ZFU]], [0, -1, 0], "s");
      innen([[a1, b0, 0], [a1, b1, 0], [a1, b1, ZFU], [a1, b0, ZFU]], [-1, 0, 0], "o");
      innen([[a0, b1, 0], [a0, b0, 0], [a0, b0, ZFU], [a0, b1, ZFU]], [1, 0, 0], "w");
      /* Mauerkrone der Kellermauern (bis die erste Sockellage liegt) */
      M.teil("mauerkrone", { mitte: [0, 0, 0], ebene: -2, schatten: false });
      M.flaeche({ name: "mauerkrone", o: [-KX_, -KY_, 0.004], u: [1, 0, 0], v: [0, 1, 0], w: 2 * KX_, h: 2 * KY_, keinAo: true,
        umriss: [[0, 0], [2 * KX_, 0], [2 * KX_, 2 * KY_], [0, 2 * KY_], [0, 0], [KI, KI], [KI, 2 * KY_ - KI], [2 * KX_ - KI, 2 * KY_ - KI], [2 * KX_ - KI, KI], [KI, KI]],
        malen: (g, F) => { g.fillStyle = "rgb(150,142,128)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); if (F.px > 6) rausch(g, 0, 0, F.w, F.h, 0.4, 0.35, 3, 3); if (winter) { g.fillStyle = "rgba(240,244,250,0.5)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); } } });
    }
    M.teil("sockel", { mitte: [0, 0, 0.6] });
    const X = XE + SV, Y = YE + SV;
    const sm = (name) => (g, F) => {
      sandsteinMalen(g, F, 0, 0, F.w, F.h, lagen.slice(0, fertigN), V.saat + name.length * 13, {});
      if (hF >= hS - 0.3) for (const kx of KELLERFENSTER[name] || []) kellerfensterMalen(g, F, B, kx, hF - 0.84, winter);
    };
    if (hF > 0.01) M.quader({ x: -X, y: -Y, z: 0, b: 2 * X, t: 2 * Y, h: hF }, { sued: sm("sued"), nord: sm("nord"), ost: sm("ost"), west: sm("westen"), oben: sockelDeckel(Z, winter, V, B, hF) }, { ao: false });
    if (fertigN < lagen.length && teil > 0) {
      /* laufende Lage rund um den Sockel: Süd, Ost, Nord, West */
      const lh = lagen[fertigN], d = KI;
      const seiten = [[-X, Y, 1, 0, 2 * X], [X, Y, 0, -1, 2 * Y], [X, -Y, -1, 0, 2 * X], [-X, -Y, 0, 1, 2 * Y]];
      const U = 4 * (X + Y);
      let rest = teil * U;
      /* dieselbe Saat und Lagennummer wie am fertigen Sockel: kein Sprung */
      const stein = (name) => (g, F) => sandsteinMalen(g, F, 0, 0, F.w, F.h, [lh], V.saat + name.length * 13, { ab: fertigN });
      /* Oberseite der laufenden Lage: Sandstein mit Struktur, Stoßfugen
         (etwa jeden Meter) und das frische Mörtelbett für die nächste Lage */
      const deckel = (g, F) => { g.fillStyle = rgb(hell(SANDSTEIN, 0.06)); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); if (F.px > 8) rausch(g, 0, 0, F.w, F.h, 0.4, 0.25, 19, 3); if (F.px > 10) { const lang = F.w > F.h; g.beginPath(); for (let t = 0.9; t < (lang ? F.w : F.h); t += 1.1) { if (lang) { g.moveTo(t, 0); g.lineTo(t, F.h); } else { g.moveTo(0, t); g.lineTo(F.w, t); } } g.lineWidth = Math.max(0.01, 0.8 / F.px); g.strokeStyle = "rgba(200,188,168,0.7)"; g.stroke(); } g.fillStyle = "rgba(200,190,170,0.55)"; g.fillRect(-0.05, F.h * 0.35, F.w + 0.1, 0.03); if (winter) { g.fillStyle = "rgba(240,244,250,0.7)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); } };
      for (const [x0, y0, ux, uy, len] of seiten) {
        if (rest <= 0) break;
        const l = Math.min(len, rest); rest -= l;
        const xa = Math.min(x0, x0 + ux * l), xb = Math.max(x0, x0 + ux * l);
        const ya = Math.min(y0, y0 + uy * l), yb = Math.max(y0, y0 + uy * l);
        const q = uy === 0 ? { x: xa, y: y0 > 0 ? y0 - d : y0, b: xb - xa, t: d } : { x: x0 > 0 ? x0 - d : x0, y: ya, b: d, t: yb - ya };
        M.quader(Object.assign(q, { z: hF, h: lh }), { sued: stein("sued"), nord: stein("nord"), ost: stein("ost"), west: stein("westen"), oben: deckel }, { keinAo: true, ebene: 1 });
      }
    }
    /* Freitreppe wächst mit dem Sockel */
    treppeBauen(M, B, winter, V, Math.min(S0, hF + (teil > 0 && fertigN < lagen.length ? lagen[fertigN] * 0.5 : 0)), false, !winter);
  }

  /* ---------------- Balkenlagen (Decke EG, Dachbalken) ---------------- */
  function balkenlage(M, Z, t0, t1, z0, z1, xs, ys, xAus, yAus, xInnen, c, winter, name) {
    const mal = rohHolz(c, 55, winter), zm = (z0 + z1) / 2, hh = (z1 - z0) / 2;
    const n = xs.length + ys.length * 2;
    let i = 0;
    const zeit = () => { const a = t0 + (t1 - t0) * i / n; i++; return Z.k(a, a + (t1 - t0) / n); };
    for (const x of xs) {
      /* ganze Balken, die sich die letzten 40 cm auf ihr Lager senken */
      const gz = zeit(); if (gz <= 0) continue;
      const dz = (1 - gz) * 0.4;
      M.teil(name + x, { mitte: [x * 0.05, 0, zm + dz], schatten: false });
      stab(M, [x, -yAus, zm + dz], [x, yAus, zm + dz], [1, 0, 0], 0.2, Z3, -hh, hh, mal, { dEbene: 1 });
    }
    for (const sx of [-1, 1]) for (const y of ys) {
      const gz = zeit(); if (gz <= 0) continue;
      const dz = (1 - gz) * 0.4;
      M.teil(name + "s" + sx + y, { mitte: [sx * 0.2, y * 0.05, zm + dz], schatten: false });
      stab(M, [sx * xInnen, y, zm + dz], [sx * xAus, y, zm + dz], [0, 1, 0], 0.2, Z3, -hh, hh, mal, { dEbene: 1 });
    }
  }
  /* Bretterboden (OG-Boden, Dachboden), wächst von West nach Ost */
  function bodenFlaeche(M, Z, t0, t1, z, x0, y0, w, h, winter, name, bis) {
    const a = Z.k(t0, t1);
    if (a <= 0 || Z.bau >= bis) return;
    M.teil(name, { mitte: [0, 0, z + 0.05] });
    M.flaeche({ name: name, o: [x0, y0, z], u: [1, 0, 0], v: [0, 1, 0], w: w, h: h, malen: dielen(w, h, a, 91, winter), keinLicht: true });
  }

  /* ---------------- Dachstuhl ---------------- */
  const SP_N = 13;
  function sparrenX(j) { const e = XG - 0.1; return -e + j * (2 * e) / (SP_N - 1); }
  function dachstuhl(M, Z, c, winter) {
    const mal = rohHolz(c, 71, winter);
    const nS = [0, Math.sin(NEIG), Math.cos(NEIG)], nN = [0, -Math.sin(NEIG), Math.cos(NEIG)];
    const tief = 0.21 / Math.cos(NEIG);
    const zc = (y) => ZF - Math.abs(y) * TN - tief;
    const zk = ZD + 2.55, yk = (ZF - tief - zk) / TN - 0.05;
    const nA = [0, Math.sin(NA), Math.cos(NA)];
    for (let j = 0; j < SP_N; j++) {
      const x = sparrenX(j), rand = j === 0 || j === SP_N - 1;
      const a = 0.745 + 0.04 * j / SP_N, gz = Z.k(a, a + 0.04 / SP_N);
      if (gz <= 0) continue;
      const bb = rand ? 0.2 : 0.14;
      const dz = (1 - gz) * 0.4;
      for (const sy of [1, -1]) {
        const n = sy > 0 ? nS : nN;
        /* unter die Dachhaut sortieren (Mitte um die Dachnormale nach
           innen versetzt): Lattung und Ziegel liegen immer darüber */
        /* Sparren ohne eigenen Bodenschatten: jeder weichgezeichnete
           Schatten kostet im Kern rund 10 ms (26 Sparren = 0,3 s) */
        M.teil("sparren" + sy + j, { mitte: [x * 0.05, sy * 0.2, ZDM - 0.8], schatten: false });
        const P0 = [x, sy * YO, zc(YO) + dz], P1 = [x, 0, zc(0) + dz];
        stab(M, P0, P1, [1, 0, 0], bb, n, -0.09, 0.09, mal, { dEbene: 2 });
        /* Aufschiebling am Sparrenfuß */
        const zA = (y) => ZK - (y - YK) * TA - 0.07;
        if (gz >= 1) stab(M, [x, sy * YK, zA(YK)], [x, sy * YT, zA(YT)], [1, 0, 0], bb * 0.8, sy > 0 ? nA : [0, -nA[1], nA[2]], -0.035, 0.035, mal, { dEbene: 2 });
      }
      if (gz >= 1) {
        M.teil("kehl" + j, { mitte: [x * 0.05, 0, ZDM - 0.7], schatten: false });
        stab(M, [x, -yk, zk], [x, yk, zk], Z3, 0.18, [1, 0, 0], 0.07, 0.19, mal, { dEbene: 2 });
      }
    }
  }
  /* Richtbaum: kleine Tanne mit bunten Bändern auf dem First (Richtfest) */
  function richtbaumFigur(winter) {
    return function (g, s, F) {
      const kz = ST.KZ * s;
      if (F.schatten) { g.fillStyle = "#000"; g.beginPath(); g.moveTo(0, 0); g.lineTo(-0.5 * s, -0.3 * kz); g.lineTo(0, -1.8 * kz); g.lineTo(0.5 * s, -0.3 * kz); g.closePath(); g.fill(); return; }
      const L = figurLicht(F);
      g.strokeStyle = L([110, 80, 50]); g.lineWidth = Math.max(1, 0.05 * s);
      g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -1.75 * kz); g.stroke();
      for (let i = 0; i < 5; i++) {
        const y = -0.35 * kz - i * 0.28 * kz, bw = (0.55 - i * 0.09) * s;
        g.fillStyle = L(i % 2 ? [36, 76, 44] : [30, 66, 38]);
        g.beginPath(); g.moveTo(-bw, y + 0.12 * kz); g.quadraticCurveTo(0, y + 0.05 * kz, bw, y + 0.12 * kz); g.lineTo(0, y - 0.32 * kz); g.closePath(); g.fill();
        if (winter) { g.fillStyle = L([240, 244, 251]); g.beginPath(); g.moveTo(-bw * 0.5, y - 0.05 * kz); g.lineTo(0, y - 0.28 * kz); g.lineTo(bw * 0.5, y - 0.05 * kz); g.quadraticCurveTo(0, y - 0.1 * kz, -bw * 0.5, y - 0.05 * kz); g.fill(); }
      }
      /* Bänder im Wind */
      const farben = [[200, 30, 40], [240, 240, 236], [40, 90, 170], [240, 190, 40], [60, 140, 60]];
      g.lineWidth = Math.max(1, 0.035 * s); g.lineCap = "round";
      for (let i = 0; i < farben.length; i++) {
        const y0 = -1.6 * kz + i * 0.06 * kz;
        g.strokeStyle = L(farben[i]);
        g.beginPath(); g.moveTo(0, y0); g.bezierCurveTo(0.35 * s, y0 + 0.1 * kz, 0.5 * s, y0 + 0.4 * kz + i * 0.05 * kz, 0.75 * s + i * 0.04 * s, y0 + 0.55 * kz + i * 0.08 * kz); g.stroke();
      }
    };
  }
  /* Dachfläche im Bau: Lattung (durchsichtig) und Ziegel bis zur laufenden Reihe */
  function dachImBau(M, Z, S, V, winter) {
    const pl = Z.k(0.8, 0.83), pt = Z.k(0.83, 0.895);
    const gesamt = LM + LA, reihen = Math.floor(gesamt / ZR);
    const eL = gesamt * pl;
    const rT = pt * reihen, fertigR = Math.floor(rT), teilR = rT - fertigR;
    for (const sy of [1, -1]) {
      const seite = sy > 0 ? "S" : "N";
      M.teil("dach" + seite, { mitte: [0, sy * 0.5, ZDM] });
      const u = [sy, 0, 0], w = 2 * XD, saat = V.saat + (sy > 0 ? 1 : 2);
      const flaechen = [
        { name: "M", o: [-sy * XD, 0, ZF], v: [0, sy * YK, ZK - ZF], h: LM, yEnde: LA },
        { name: "A", o: [-sy * XD, sy * YK, ZK], v: [0, sy * (YT - YK), ZT - ZK], h: LA, yEnde: 0 }
      ];
      for (const fl of flaechen) {
        const e = (y) => fl.h + fl.yEnde - y;         // Abstand zur Traufe
        /* Lattung */
        const yL = Math.max(0, fl.h + fl.yEnde - eL);
        if (yL < fl.h) {
          const latten = (g, F) => {
            const L = belichter(F, 0.03);
            for (let k = 0; ; k++) {
              const ee = 0.06 + k * ZR, y = fl.h + fl.yEnde - ee;
              if (y < yL - 0.01) break;
              if (y > fl.h + 0.05) continue;
              g.fillStyle = L([188, 150, 104]); g.fillRect(-0.05, y - 0.02, w + 0.1, 0.045);
              g.fillStyle = L([120, 92, 60]); g.fillRect(-0.05, y + 0.02, w + 0.1, 0.006);
            }
          };
          M.flaeche({ name: "latten" + seite + fl.name, o: add(fl.o, mul(nrm(fl.v), yL)), u: u, v: fl.v, w: w, h: fl.h - yL, malen: (g, F) => { g.save(); g.translate(0, -yL); latten(g, F); g.restore(); }, keinLicht: true });
        }
        /* Ziegel bis zur laufenden Reihe (Umriss mit Stufe für die halbe Reihe) */
        const oberkante = (r) => fl.h + fl.yEnde - r * ZR - 1.05 * ZR;
        const y1 = oberkante(fertigR), y2 = oberkante(fertigR + 1);
        if (fertigR <= 0 && teilR <= 0) continue;
        const xp = w * teilR;
        const unten = fl.h;
        const oben1 = klemm(y1, 0, fl.h), oben2 = klemm(y2, 0, fl.h);
        if (oben1 >= fl.h - 0.01 && (teilR <= 0 || oben2 >= fl.h - 0.01)) continue;
        const um = teilR > 0 && oben2 < oben1 ? [[0, oben2], [xp, oben2], [xp, oben1], [w, oben1], [w, unten], [0, unten]] : [[0, oben1], [w, oben1], [w, unten], [0, unten]];
        void e;
        /* nur die schon gedeckten Reihen malen (Rechenzeit) */
        M.flaeche({ name: "ziegel" + seite + fl.name, o: fl.o, u: u, v: fl.v, w: w, h: fl.h, umriss: um, malen: (g, F) => biberMalen(g, F, w, fl.h, fl.yEnde, saat, { yVon: Math.min(oben1, oben2) - ZR }), ebene: 1 });
      }
      M.teil("traufe" + seite, { mitte: [0, sy * (YT + 0.15), ZT] });
      wandFlaeche(M, [-sy * XD, sy * YT, ZT], [0, sy, 0], w, 0.2, brettMal(hell(S.holzC, 0.05), saat), { ebene: 2, keinAo: true, name: "traufbrett" });
    }
  }

  /* ---------------- alles, was im Bau ist ---------------- */
  function baustelleBauen(M, o, B, V, S, winter, Z) {
    const bau = Z.bau, c = HOLZ_ROH;
    if (bau < 0.22) grubeBauen(M, B, Z, winter, V);
    if (bau >= 0.22 && !Z.sockel) sockelBau(M, Z, V, winter, B);
    const waende = wandListe();
    for (const W of waende) { W.P = PLAENE[W.plan || W.name]; W.PF = PLAENE_F[W.plan || W.name]; }
    /* Erdgeschoss: Gerippe 0,32–0,50, Ausfachen 0,50–0,56 */
    if (bau >= 0.32 && !Z.egFertig) {
      for (const W of waende.filter((w) => w.stock === "eg")) {
        geruestWand(M, W, W.P, Z, 0.32, 0.5, c, winter, { ecken: W.N[1] !== 0 });
        ausfachung(M, W, W.PF, Z, 0.5, 0.56, winter);
      }
    }
    /* Deckenbalken mit Stichbalken, Knaggen */
    if (bau >= 0.56 && !Z.band1) {
      balkenlage(M, Z, 0.56, 0.595, ZE1, ZB1, KOEPFE_X, KOEPFE_Y, XO + 0.13, YO + 0.13, XE - 0.3, c, winter, "decke");
      if (bau >= 0.59) {
        M.teil("knaggen", { mitte: [0, 0, ZE1 - 0.2] });
        for (const n of [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0]]) {
          const A = kreuz(n, Z3);
          const O = n[1] ? [-A[0] * XO, n[1] * YO, ZE1] : [n[0] * XO, -A[1] * YO, ZE1];
          const RE = rahmen3([O[0] - n[0] * KR, O[1] - n[1] * KR, ZE1], n);
          const an = n[1] ? [-4.4, 4.4].concat(n[1] > 0 ? [1.2, 2.8] : []) : [-3.4, 3.4];
          for (const v of an) knagge(M, RE, n[1] ? v * A[0] + XO : v * A[1] + YO, KR + 0.04, 0.58, c, V.saat + Math.round(v * 10), 0);
        }
      }
    }
    /* Boden des Obergeschosses */
    bodenFlaeche(M, Z, 0.6, 0.62, ZB1, -XO, -YO, 2 * XO, 2 * YO, winter, "og-boden", 0.745);
    /* Obergeschoss: Gerippe 0,62–0,67, Ausfachen 0,67–0,72 */
    if (bau >= 0.62 && !Z.ogFertig) {
      for (const W of waende.filter((w) => w.stock === "og")) {
        geruestWand(M, W, W.P, Z, 0.62, 0.67, c, winter, { ecken: W.N[1] !== 0 });
        ausfachung(M, W, W.PF, Z, 0.67, 0.72, winter);
      }
    }
    /* Dachbalken, Dachboden */
    if (bau >= 0.72 && !Z.band2) balkenlage(M, Z, 0.72, 0.735, ZO1, ZD, KOEPFE_X, KOEPFE_Y, XG + 0.12, YO, XO - 0.3, c, winter, "dachbalken");
    bodenFlaeche(M, Z, 0.735, 0.745, ZD, -XG, -YO, 2 * XG, 2 * YO, winter, "dachboden", 0.9);
    /* Sparren, Kehlbalken, Giebelgerippe, Richtbaum */
    if (bau >= 0.745 && !Z.dachFertig) dachstuhl(M, Z, c, winter);
    if (bau >= 0.76 && !Z.giebelFertig) {
      for (const W of waende.filter((w) => w.stock === "giebel")) {
        geruestWand(M, W, W.P, Z, 0.76, 0.785, c, winter, { ecken: true, ohneSparren: true });
        ausfachung(M, W, W.PF, Z, 0.785, 0.8, winter);
      }
    }
    if (bau >= 0.775 && bau < 0.87) {
      M.teil("richtbaum", { mitte: [0, 0, ZF + 2], schatten: false });
      M.figur({ x: -0.8, y: 0, z: ZF - 0.3, breite: 1.4, hoehe: 2.0, schatten: false, malen: richtbaumFigur(winter) });
    }
    /* Lattung und Ziegel */
    if (bau >= 0.8 && !Z.dachFertig) dachImBau(M, Z, S, V, winter);
  }

  /* =====================================================================
     MODELL
     ===================================================================== */
  ST.modell("fachwerkhaus", {
    name: "Fachwerkhaus", gruppe: "Häuser", grund: [10.4, 9.6], hoehe: 14.2, bauzeit: 15 * 60,
    bauen(M, o) {
      const B = neuerBlick();
      M.teil("blick", { ebene: -90, schatten: false, mitte: [0, 0, 0] });
      M.figur({ x: 0, y: 0, z: 0, breite: 0.01, hoehe: 0.01, schatten: false, malen(g, s, F) { if (!F.schatten && F.gier != null) blickSetzen(B, F.gier); } });
      const V = varianten(o);
      const winter = o.jahr === "winter";
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      const Z = zustand(bau);
      /* Rohbau: frisches Eichenholz und Lehm; ab 0,86 Wand für Wand Kalk
         und Farbe (die Wände selbst: Q.farbeW), Köpfe und Gauben zuletzt */
      const S = {
        saat: V.saat, holzC: misch(HOLZ_ROH, V.holz.f, Z.farbe), putzC: misch(LEHM, V.putz, Z.farbe),
        begleit: Z.farbe > 0.8 ? V.begleit : null, lehm: Z.farbe < 0.5,
        laden: V.laden, vorhang: V.vorhang, rahmen: "#ece6da", kasten: "#4a3a2c", begleitAn: V.begleitAn
      };
      if (bau < 1) baustelleBauen(M, o, B, V, S, winter, Z);
      fertigesHaus(M, o, B, V, S, winter, Z);
    }
  });
})();
