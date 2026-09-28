/* =====================================================================
   FACHWERKHAUS MIT ERKER  („fachwerkerker")
   ---------------------------------------------------------------------
   XANDER: „fang mit einem Detail an, mit einem Fachwerkhaus … so geil
   wie möglich und noch geiler als das." · „Richtig filigran. Richtig
   schön ausarbeiten mit schönen Texturen." · „Das soll keine Comic
   Grafik sein. Das soll noch viel mehr am Realismus dran sein."

   Vorbild: Quedlinburg, Goslar, Wernigerode (niedersächsischer
   Fachwerkstil). Giebelständig zur Straße (Süden = +y), Laden im
   Erdgeschoss mit Schaufenstern und handgemaltem Schild, Obergeschoss
   kragt vor (Stockwerksauskragung mit Balkenköpfen und Füllhölzern),
   in der Mitte ein Erker mit Kupferhaube, darüber der dicht
   verzimmerte Giebel unter einem Krüppelwalmdach (Schopfwalm) mit
   Biberschwanz-Doppeldeckung, Gauben und Kamin.

   Maße (Meter): Erdgeschoss 6,4 × 10,2, Obergeschoss 6,9 × 10,65,
   Traufe 6,8, First 11,7, Dachneigung 55°, Schopfwalm ab 10,7.
   Grundfläche in der Stadt 8 × 12: Dachüberstände, Stufen, Fallrohre,
   Regentonne und Holzstapel gehören mit dazu (RUNDE 1: vorher 7 × 11,
   da ragten Überstände und Stufen über den Bauplatz hinaus).

   RUNDE 1 (Xander: „jeder Winkel muss stimmen", „keine komischen
   Vektorrückstände"): Baustelle mit Grube, Schnurgerüst, Aushub,
   Bodenplatte und Richtbaum; Schnee in Flecken statt Streifen; Wehe am
   Sockel; Haustür mit Fase, Inschrift, Kranz und Klingelschild;
   Kellerfenster mit Gitter; Fallrohr mit Etagenbogen, Speier bzw.
   Regentonne; Lichtpfützen und Schildleuchten in der Nacht.

   REIHENFOLGE DER TEILE (wichtig für jeden Drehwinkel): Der Kern sortiert
   Teile nach ihrer „Mitte". Wir setzen diese Mitte bewusst:
     Stockwerk (EG → OG → Dach → Kamin) bestimmt die grobe Reihenfolge,
     innerhalb des Stockwerks die Seite: Seiten, die vom Betrachter
     wegzeigen, zuerst, zugewandte zuletzt. Anbauten einer Seite (Erker,
     Balkenköpfe, Stufen, Rinne, Gaube) hängen an der Normalen ihrer
     Trägerfläche – so stimmt die Verdeckung in jedem Winkel.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const hex = PI.hex, rgb = PI.rgb, misch = PI.misch, hell = PI.hell;

  /* ---------------- Maße ---------------- */
  const EG_X = 3.2, EG_YS = 5.0, EG_YN = -5.2;          // Erdgeschoss (Außenkante)
  const OG_X = 3.45, OG_YS = 5.45, OG_YN = -5.2;        // Obergeschoss: kragt Süd 0,45, Ost/West 0,25 vor
  const GI_YS = 5.65, GI_YN = -5.2;                     // Südgiebel kragt nochmals 0,2 vor
  const BL_X = 3.35, BL_YS = 5.35;                      // Füllholz-Ebene der Balkenlage (Köpfe stehen 0,1 vor)
  const Z_SO = 0.55, Z_EGS = 0.75, Z_EGR = 3.35, Z_EG = 3.55;   // Sockel, EG-Schwelle, EG-Rähm
  const Z_BL = 3.8, Z_OGS = 4.0, Z_OGR = 6.35, Z_OG = 6.55, Z_T = 6.8;
  const ALPHA = 55 * Math.PI / 180, TA = Math.tan(ALPHA), CA = Math.cos(ALPHA), SA = Math.sin(ALPHA);
  const BETA = 62 * Math.PI / 180, TB = Math.tan(BETA), CB = Math.cos(BETA), SB = Math.sin(BETA);
  const Z_FI = Z_T + OG_X * TA;                          // First ≈ 11,73
  const Z_K = 10.7;                                      // Oberkante Giebel unter dem Schopf (RUNDE 1: 10,2 → 10,7, damit das Spitzbodenfenster frei bleibt)
  const UE_T = 0.45, UE_G = 0.25, D_DACH = 0.2;          // Überstände, Dachstärke an der Kante
  /* RUNDE 2: Aufschiebling. Die untersten 0,8 m der Traufseiten liegen mit
     35° flacher als das Hauptdach (55°) – der typische Knick alter
     deutscher Dächer („ihren Liebreiz haben"). Nebenbei hebt er die Traufe
     um fast einen halben Meter: vorher verdeckte der Überstand in der
     Standardansicht die Oberkanten der Obergeschossfenster. */
  const AUF_L = 0.8, AUF_A = 35 * Math.PI / 180, TAU = Math.tan(AUF_A), CAU = Math.cos(AUF_A), SAU = Math.sin(AUF_A);
  const X_KN = OG_X + UE_T - AUF_L * CAU;                // Knick im Grundriss (≈ 3,24)
  const KAMIN_Y = 1.45;
  const GAUBE_Y = -2.0, GAUBE_B = 1.7;                   // Gauben: Mitte und Breite
  const ERKER = { x0: -1.2, x1: 1.2, y: 6.05, z0: Z_BL, z1: 5.85 };

  /* Stockwerk-Stufen für die Teile-Reihenfolge */
  const ST_EG = 0, ST_OG = 8, ST_DACH = 16, ST_KAMIN = 24;

  /* ---------------- Varianten (über o.saat) ---------------- */
  const HOLZ = [[70, 48, 33], [98, 40, 30], [66, 76, 88], [58, 42, 32]];            // dunkelbraun, ochsenblutrot, grau-blau, schwarzbraun
  const PUTZ = [[232, 227, 214], [233, 222, 196], [228, 208, 164], [226, 222, 210]]; // weiß (gebrochen), creme, hellocker, kalkweiß
  const LAEDEN = [[46, 80, 56], [120, 44, 34], [74, 102, 128], [58, 70, 56], [140, 110, 52]];
  const TUEREN = [[44, 72, 54], [104, 34, 36], [82, 52, 34], [42, 60, 92]];
  const NAMEN = ["Hoffmann", "Krüger", "Schäfer", "Wagner", "Becker", "Lehmann", "Schulze", "Neumann", "Brandt", "Vogel", "Kühn", "Möller", "Ahrens", "Lindemann", "Voigt", "Hartmann", "Engelke", "Brauns"];
  const GESCHAEFTE = [
    { art: "baecker", text: "Bäckerei" },
    { art: "buch", text: "Buchbinderei" },
    { art: "uhr", text: "Uhrmacher" }
  ];
  const SCHILD = [[36, 64, 48], [96, 30, 28], [30, 44, 70], [48, 36, 28]];
  const VAR = {};
  function variante(o) {
    const k = o.saat || 1;
    if (VAR[k]) return VAR[k];
    const r = ST.zufall(k * 7919 + 13);
    const nimm = (a) => a[Math.floor(r() * a.length) % a.length];
    const v = {
      holz: nimm(HOLZ), putz: nimm(PUTZ), laden: nimm(LAEDEN), tuer: nimm(TUEREN),
      nummer: 1 + Math.floor(r() * 38), name: nimm(NAMEN), geschaeft: nimm(GESCHAEFTE), schild: nimm(SCHILD),
      rahmen: r() < 0.7 ? [238, 234, 224] : [222, 212, 188], saat: k
    };
    /* grau-blaues Holz → warme Läden; sonst frei */
    if (v.holz === HOLZ[2] && v.laden === LAEDEN[2]) v.laden = LAEDEN[1];
    VAR[k] = v;
    return v;
  }

  /* =====================================================================
     HILFEN: Blickrichtung, Licht, Formen
     ===================================================================== */
  /* Blickrichtung in Flächenkoordinaten: eu, ev (in der Fläche), en (aus
     der Fläche heraus). Damit malen wir Laibungen, Fensterbänke und
     Blumenkästen so, wie man sie aus DIESEM Winkel wirklich sieht. */
  function blick(F) {
    if (F._blick) return F._blick;
    const f = F.flaeche, L = ST.LICHT, E = ST.ZUM_AUGE;
    const nM = ST.kreuz(f.u, f.v);
    let c, s;
    if (Math.hypot(nM[0], nM[1]) > 0.3) {
      const th = Math.atan2(F.n[1], F.n[0]) - Math.atan2(nM[1], nM[0]);
      c = Math.cos(th); s = Math.sin(th);
    } else {
      const u = f.u, v = f.v;
      const a1 = L[0] * u[0] + L[1] * u[1], b1 = L[1] * u[0] - L[0] * u[1], r1 = F.lichtU - L[2] * u[2];
      const a2 = L[0] * v[0] + L[1] * v[1], b2 = L[1] * v[0] - L[0] * v[1], r2 = F.lichtV - L[2] * v[2];
      const det = a1 * b2 - a2 * b1 || 1e-6;
      c = (r1 * b2 - r2 * b1) / det; s = (a1 * r2 - a2 * r1) / det;
      const l = Math.hypot(c, s) || 1; c /= l; s /= l;
    }
    const rot = (p) => [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]];
    const u = rot(f.u), v = rot(f.v), n = F.n;
    const B = { eu: ST.punkt(E, u), ev: ST.punkt(E, v), en: ST.punkt(E, n), c: c, s: s };
    /* Versatz eines um d zurückliegenden Punkts (negativ = vorstehend) */
    const enS = Math.sign(B.en || 1) * Math.max(0.1, Math.abs(B.en));
    /* RUNDE 2: Vorsprünge (d < 0) blenden bei streifendem Blick (|en| < 0,3)
       ihren Tiefenversatz aus – sonst wuchs er bis aufs Zehnfache und Kästen
       ragten als lange Bretter schräg aus der Wand. Nischen (d > 0) bleiben. */
    B.flach = klemm((Math.abs(B.en) - 0.12) / 0.18, 0, 1);
    B.tief = (d) => { const k = d < 0 ? B.flach : 1; return [B.eu * d / enS * k, B.ev * d / enS * k]; };
    F._blick = B;
    return B;
  }
  /* Helligkeit einer Seitenfläche relativ zur Trägerfläche: Normale in
     Flächenkoordinaten (nu, nv, nn) → Faktor */
  function seitenHell(F, nu, nv, nn) {
    const L = F.lichtU * nu + F.lichtV * nv + F.lichtN * nn;
    const Z = F.zeit, a = Z.amb[1] * 0.95, so = Z.sonne[1] * 1.35;
    const eigen = a + so * Math.max(0, L), traeger = a + so * Math.max(0, F.lichtN);
    return Math.max(0.35, Math.min(1.6, eigen / Math.max(0.2, traeger)));
  }
  function vieleck(g, pts) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); }
  function fuelle(g, pts, farbe) { vieleck(g, pts); g.fillStyle = farbe; g.fill(); }
  const klemm = (x, a, b) => Math.max(a, Math.min(b, x));
  function rrect(g, x, y, w, h, r) { PI.rundRechteck(g, x, y, w, h, r); }

  /* ---------------- Muster (einmal erzeugt, nahtlos) ----------------
     Alle Strukturen liegen als halbdurchsichtige Farbe über dem Werkstoff
     (normales Überblenden). Das ist genauso fein wie „multiply", aber viel
     schneller – die Grafikkarte muss das Bild darunter nicht zurücklesen. */
  const MUSTER = {};
  /* Periodisches Gradientenrauschen (Perlin) mit Gitter-Periode Px × Py:
     eine echte Kachel ohne Spiegelachsen. RUNDE 1: Vorher lag das Rauschen
     auf einem „Torus" (cos a + 0,7·cos b) – diese Abbildung ist symmetrisch
     und erzeugte auf Beton, Grube und Putz ein sichtbares X-/Rautengitter,
     genau den „komischen Vektorrückstand", den Xander nicht will.
     Die Gradienten werden je Oktave einmal als Tabelle gerechnet (schnell). */
  function gradTabelle(Px, Py, s) {
    const t = new Float32Array(Px * Py * 2);
    for (let j = 0; j < Py; j++) for (let i = 0; i < Px; i++) {
      const a = ST.hash2(i, j, s) * Math.PI * 2;
      t[(j * Px + i) * 2] = Math.cos(a); t[(j * Px + i) * 2 + 1] = Math.sin(a);
    }
    return t;
  }
  function perlinT(T, Px, Py, x, y) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const x0 = ((xi % Px) + Px) % Px, y0 = ((yi % Py) + Py) % Py, x1 = (x0 + 1) % Px, y1 = (y0 + 1) % Py;
    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10), v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
    const a = (y0 * Px + x0) * 2, b = (y0 * Px + x1) * 2, c = (y1 * Px + x0) * 2, d = (y1 * Px + x1) * 2;
    const n00 = T[a] * xf + T[a + 1] * yf, n10 = T[b] * (xf - 1) + T[b + 1] * yf;
    const n01 = T[c] * xf + T[c + 1] * (yf - 1), n11 = T[d] * (xf - 1) + T[d + 1] * (yf - 1);
    const p = n00 + (n10 - n00) * u, q = n01 + (n11 - n01) * u;
    return p + (q - p) * v;
  }
  /* fbm über eine Kachel: fx, fy in [0,1), Px/Py = Zellen der ersten Oktave */
  function kachelRauschen(Px, Py, okt, s) {
    const tab = [];
    for (let o = 0; o < okt; o++) tab.push({ T: gradTabelle(Px << o, Py << o, s + o * 131), Px: Px << o, Py: Py << o, amp: Math.pow(0.52, o) });
    const norm = tab.reduce((a, t) => a + t.amp, 0);
    return (fx, fy) => { let v = 0; for (const t of tab) v += t.amp * perlinT(t.T, t.Px, t.Py, fx * t.Px, fy * t.Py); return 0.5 + v / norm * 1.05; };
  }
  function musterBild(art) {
    if (MUSTER[art]) return MUSTER[art];
    const holz = art === "holz" || art === "holzhell";
    const W = holz ? 512 : 192, H = holz ? 64 : 192;
    /* Leinwand auf dem Prozessor: das Muster wird fast nur auf
       Prozessor-Leinwänden benutzt (aufCpu) – so muss nichts von der
       Grafikkarte zurückgelesen werden */
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d", { willReadFrequently: true }), id = g.createImageData(W, H);
    const saat = { dunkel: 3, hell: 11, korn: 23, holz: 5, holzhell: 9, fein: 31, blau: 41, kelle: 53, moos: 61 }[art] || 1;
    let n1, n2, n3;
    if (holz) {
      /* lange Fasern längs x, Jahresringe quer – in beide Richtungen nahtlos */
      n1 = kachelRauschen(3, 2, 2, saat); n2 = kachelRauschen(10, 28, 2, saat + 7); n3 = kachelRauschen(3, 1, 2, saat + 13);
    } else {
      const P = art === "korn" ? 36 : art === "fein" ? 14 : art === "kelle" ? 22 : 5;
      n1 = kachelRauschen(P, P, art === "korn" ? 2 : 4, saat);
    }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const fx = x / W, fy = y / H;
      let v, farbe, al;
      if (holz) {
        const w1 = n1(fx, fy) * 1.8;
        const ring = 0.5 + 0.5 * Math.sin((fy * 26 + w1 * 2.4) * Math.PI);
        v = ring * 0.5 + n2(fx, fy) * 0.3 + n3(fx, fy) * 0.35;
        if (art === "holzhell") {
          /* helle Fasern: die Spätholz-Lücken zwischen den dunklen Ringen –
             erst beide Töne zusammen lesen sich auf dunklem Holz als Maserung */
          al = Math.max(0, Math.min(1, (0.62 - v) * 1.5)); farbe = [255, 240, 214];
        } else { al = Math.max(0, Math.min(1, (v - 0.35) * 0.9)); farbe = [28, 16, 8]; }
      } else {
        v = n1(fx, fy);
        if (art === "hell") { al = Math.max(0, (v - 0.5) * 2.2); farbe = [255, 252, 244]; }
        else if (art === "kelle") { al = Math.abs(v - 0.5) * 2.4; farbe = v > 0.5 ? [255, 253, 246] : [70, 60, 48]; al = al * al; }
        else if (art === "blau") { al = Math.max(0, (0.52 - v) * 1.8); farbe = [140, 160, 206]; }
        else if (art === "moos") { al = Math.max(0, (v - 0.47) * 2.4); farbe = [84, 96, 50]; }
        else { al = Math.max(0, (0.52 - v) * 2.2); farbe = [40, 32, 22]; }
        if (art === "korn") al = Math.pow(al, 1.4) * 1.3;
      }
      const i = (y * W + x) * 4;
      id.data[i] = farbe[0]; id.data[i + 1] = farbe[1]; id.data[i + 2] = farbe[2]; id.data[i + 3] = Math.round(Math.max(0, Math.min(1, al)) * 255);
    }
    g.putImageData(id, 0, 0);
    const m = { bild: c, W: W, H: H, muster: null };
    MUSTER[art] = m;
    return m;
  }
  function muster(g, art) {
    const m = musterBild(art);
    if (!m.je) m.je = new WeakMap();
    let p = m.je.get(g);
    if (!p) { p = g.createPattern(m.bild, "repeat"); m.je.set(g, p); }
    m.muster = p;
    return m;
  }
  /* Fläche mit Struktur überziehen: meter = Größe eines Musterstücks,
     dreh = Drehung des Musters (Bogenmaß) */
  function flecken(g, x, y, w, h, meter, staerke, art, versatz, dreh) {
    const m = muster(g, art || "dunkel");
    const k = meter / m.W, v = versatz || 0, c = Math.cos(dreh || 0) * k, s = Math.sin(dreh || 0) * k;
    m.muster.setTransform(new DOMMatrix([c, s, -s, c, (v * 0.37) % meter, (v * 0.61) % meter]));
    g.globalAlpha = staerke; g.fillStyle = m.muster; g.fillRect(x, y, w, h); g.globalAlpha = 1;
  }
  /* Zwei Lagen mit nicht zusammenpassenden Maßstäben (× 1,618) und 17°
     gedreht: auf großen Flächen (Betonplatte, Dach) wiederholt sich dann
     nichts Sichtbares mehr */
  function flecken2(g, x, y, w, h, meter, staerke, art, versatz) {
    flecken(g, x, y, w, h, meter, staerke * 0.62, art, versatz, 0);
    flecken(g, x, y, w, h, meter * 1.618, staerke * 0.55, art, (versatz || 0) + 17, 0.297);
  }
  /* Holzmaserung waagerecht über ein Rechteck (Bretter, Füllhölzer) */
  function maserung(g, x, y, w, h, laenge, dicke, staerke) {
    const m = muster(g, "holz");
    m.muster.setTransform(new DOMMatrix([laenge / m.W, 0, 0, dicke / m.H, x, y]));
    g.globalAlpha = staerke == null ? 0.7 : staerke; g.fillStyle = m.muster; g.fillRect(x, y, w, h); g.globalAlpha = 1;
  }

  /* =====================================================================
     WERKSTOFFE
     ===================================================================== */

  /* ---------------- Holzbalken ----------------
     h = { x0,y0,x1,y1 (Mittellinie, Flächenkoordinaten), b (Breite),
           clip [x,y,w,h]? (Strebe endet sauber am Feld), art, r (Zufall) }
     Jeder Balken ist ein Vieleck in Flächenkoordinaten – Streben werden
     rechnerisch am Feld abgeschnitten (kein Beschneiden der Leinwand, das
     wäre langsam). Kanten: die zum Licht gewandte Fase hell, die andere
     dunkel – aus F.lichtU/lichtV, damit es in jedem Winkel stimmt. */
  function balkenVieleck(h, erw) {
    if (h._poly && !erw) return h._poly;
    const dx = h.x1 - h.x0, dy = h.y1 - h.y0, L = Math.hypot(dx, dy) || 1e-6;
    const ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const e = erw || 0, ext = h.clip ? h.b * 2 : 0;
    const f = h.form || (h.form = { w1: (h.r() - 0.5) * 0.06, w2: (h.r() - 0.5) * 0.06 });
    const b0 = h.b / 2 + e;
    const pt = (s, q) => [h.x0 + ux * s + nx * q, h.y0 + uy * s + ny * q];
    /* RUNDE 2: Die Längskanten sind nicht linealgerade – ±0,5 cm auf rund
       0,5 m, von Hand gebeilt (Xander: „Alles mit Struktur"). Dicht
       abgetastete, glatte Wellen: keine Zacken, keine Treppen. Das Rähm
       hängt zusätzlich in der Mitte ein paar Zentimeter durch. */
    if (!f.p1) { f.p1 = h.r() * 6.3; f.p2 = h.r() * 6.3; f.l1 = 0.4 + h.r() * 0.25; f.l2 = 0.4 + h.r() * 0.25; }
    const s0 = -ext - e, s1 = L + ext + e, n = Math.max(2, Math.ceil((s1 - s0) / 0.1));
    const oben = [], unten = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, sx = s0 + (s1 - s0) * t, tt = klemm((sx) / L, 0, 1);
      const d = h.durch ? h.durch * Math.sin(Math.PI * tt) : 0;
      const w1 = 0.005 * Math.sin(sx / f.l1 * 6.283 + f.p1) + 0.0022 * Math.sin(sx / f.l1 * 15.1 + f.p2);
      const w2 = 0.005 * Math.sin(sx / f.l2 * 6.283 + f.p2) + 0.0022 * Math.sin(sx / f.l2 * 13.7 + f.p1);
      oben.push(pt(sx, -b0 - f.w1 * h.b * (1 - tt * 1.5) + d + w1));
      unten.push(pt(sx, b0 + f.w2 * h.b * (1 - tt * 1.5) + d + w2));
    }
    let p = oben.concat(unten.reverse());
    if (h.clip) p = schneideRechteck(p, h.clip[0] - e, h.clip[1] - e, h.clip[0] + h.clip[2] + e, h.clip[1] + h.clip[3] + e);
    if (!erw) h._poly = p;
    return p;
  }
  /* Sutherland-Hodgman: Vieleck an einem Rechteck abschneiden */
  function schneideRechteck(p, x0, y0, x1, y1) {
    const kante = (pts, drin, schnitt) => {
      const aus = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length], ia = drin(a), ib = drin(b);
        if (ia) aus.push(a);
        if (ia !== ib) aus.push(schnitt(a, b));
      }
      return aus;
    };
    const lerpX = (a, b, x) => [x, a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0])];
    const lerpY = (a, b, y) => [a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]), y];
    p = kante(p, (q) => q[0] >= x0, (a, b) => lerpX(a, b, x0));
    if (p.length) p = kante(p, (q) => q[0] <= x1, (a, b) => lerpX(a, b, x1));
    if (p.length) p = kante(p, (q) => q[1] >= y0, (a, b) => lerpY(a, b, y0));
    if (p.length) p = kante(p, (q) => q[1] <= y1, (a, b) => lerpY(a, b, y1));
    return p;
  }
  function inPfad(g, p, dx, dy) {
    if (p.length < 3) return;
    g.moveTo(p[0][0] + (dx || 0), p[0][1] + (dy || 0));
    for (let i = 1; i < p.length; i++) g.lineTo(p[i][0] + (dx || 0), p[i][1] + (dy || 0));
    g.closePath();
  }

  /* Schmutzrand und Schlagschatten aller Hölzer einer Wand – je Lage EIN Pfad */
  function hoelzerSchatten(g, F, liste) {
    if (F.px > 12) {
      /* „Rand der Gefache minimal dunkler": weiche Schmutzkante um jedes Holz */
      for (const [e, a] of [[0.06, 0.035], [0.035, 0.045], [0.016, 0.06]]) {
        g.fillStyle = "rgba(92,76,56," + a + ")";
        g.beginPath();
        for (const h of liste) inPfad(g, balkenVieleck(h, e));
        g.fill();
      }
    }
    /* RUNDE 2: Holz schwindet – zwischen Balken und Putz klafft rundum eine
       etwa 1 cm breite dunkle Schwundfuge (statt der hellen Naht aus Runde 1,
       die wie ein Vektorrand wirkte). Mindestens gut ein Bildpunkt breit. */
    const px = 1 / Math.max(1, F.px);
    const sv = F.schatten(0.03);
    const L = Math.hypot(F.lichtU, F.lichtV) || 1, lu = F.lichtU / L, lv = F.lichtV / L;
    if (F.px > 6) {
      g.fillStyle = "rgba(40,30,25,0.45)";
      g.beginPath();
      for (const h of liste) inPfad(g, balkenVieleck(h, Math.max(0.01, px * 1.1)));
      g.fill();
    }
    const d = sv ? [sv[0], sv[1]] : [-lu * 0.015, -lv * 0.015];
    const dl = Math.hypot(d[0], d[1]);
    if (dl < px * 1.2) { const k = px * 1.2 / Math.max(1e-6, dl); d[0] *= k; d[1] *= k; }
    g.fillStyle = sv ? "rgba(40,30,22,0.42)" : "rgba(40,30,22,0.25)";
    g.beginPath();
    for (const h of liste) inPfad(g, balkenVieleck(h), d[0], d[1]);
    g.fill();
  }

  function balkenMalen(g, F, h, farbe) {
    const r = h.r;
    const L = Math.hypot(h.x1 - h.x0, h.y1 - h.y0);
    if (L < 0.01) return;
    const p = balkenVieleck(h);
    if (p.length < 3) return;
    const b = h.b, ang = Math.atan2(h.y1 - h.y0, h.x1 - h.x0), ca = Math.cos(ang), sa = Math.sin(ang);
    /* jeder Balken eigen: etwas heller/dunkler, manche vergraut */
    if (h.ton == null) { h.ton = (r() - 0.5) * 0.22; h.grau = r() < 0.3 ? r() * 0.2 : 0; }
    let c = misch(hell(farbe, h.ton), [118, 114, 106], h.grau);
    /* RUNDE 2: Alterung nach Ort. Die Schwelle liegt im Spritzwasser und ist
       ein Viertel vergraut; die Südseite bleicht in der Sonne aus. */
    const alt = !(F.flaeche && F.flaeche.keinLicht);                  // frisches Holz auf der Baustelle altert nicht
    if (alt && h.art === "schwelle") c = misch(c, [120, 114, 106], 0.25);
    if (alt && F.name && /sued|erker|gaube-v1/.test(F.name)) c = misch(c, [176, 164, 146], 0.08);
    /* Licht im Balkensystem: welche Längskante zeigt zur Sonne? */
    const lx = F.lichtU * ca + F.lichtV * sa, ly = -F.lichtU * sa + F.lichtV * ca;
    const kL = Math.min(1, Math.hypot(lx, ly) * 1.8) * (F.lichtN > 0.02 ? 1 : 0.45);
    /* Querschnitt: 1,5 cm Fase an beiden Längskanten (zur Sonne hell, gegenüber
       dunkel), dazwischen die leicht gewölbte Ansichtsfläche */
    const hi = rgb(hell(c, 0.12 + 0.22 * kL)), lo = rgb(hell(c, -0.22 - 0.28 * kL)), mi = rgb(hell(c, 0.03)), mi2 = rgb(hell(c, -0.07));
    const nx = -sa, ny = ca, cx = h.x0, cy = h.y0;
    const gr = g.createLinearGradient(cx - nx * b / 2, cy - ny * b / 2, cx + nx * b / 2, cy + ny * b / 2);
    const fa = klemm(0.015 / b, 0.04, 0.2), fz = Math.min(0.01, 0.4 / Math.max(1, F.px * b));
    if (ly < 0) { gr.addColorStop(0, hi); gr.addColorStop(fa, hi); gr.addColorStop(fa + fz, mi); gr.addColorStop(1 - fa - fz, mi2); gr.addColorStop(1 - fa, lo); gr.addColorStop(1, lo); }
    else { gr.addColorStop(0, lo); gr.addColorStop(fa, lo); gr.addColorStop(fa + fz, mi2); gr.addColorStop(1 - fa - fz, mi); gr.addColorStop(1 - fa, hi); gr.addColorStop(1, hi); }
    g.beginPath(); inPfad(g, p);
    g.fillStyle = gr; g.fill();
    const breitPx = F.px * b;
    const P = (s, q) => [cx + ca * s + nx * q, cy + sa * s + ny * q];
    /* unten am Ständer: 0,4 m Spritzwasser, vergraut */
    if (alt && h.art === "staender" && breitPx > 2) {
      const A = P(0, 0), E = P(0.4, 0);
      const gs = g.createLinearGradient(A[0], A[1], E[0], E[1]);
      gs.addColorStop(0, "rgba(120,114,106,0.3)"); gs.addColorStop(1, "rgba(120,114,106,0)");
      g.beginPath(); inPfad(g, p); g.fillStyle = gs; g.fill();
    }
    if (breitPx < 3) return;
    /* Maserung zweifarbig: dunkle Jahresringe UND helle Fasern – erst beide
       zusammen lesen sich auch auf dunkelbraunem Holz (Kritik: „glattes
       Plastikholz"). Ab F.px > 100 nur eine Lage (Rechenzeit). */
    const kx = (2.4 + r() * 1.2) / 512, ky = b * (1.0 + r() * 0.6) / 64;
    const off = r() * 3;
    const lagen = F.px > 100 ? [["holzhell", 0.42]] : [["holz", breitPx > 8 ? 0.55 : 0.35], ["holzhell", breitPx > 8 ? 0.38 : 0.22]];
    for (const [art, al] of lagen) {
      g.beginPath(); inPfad(g, p);
      const m = muster(g, art), o2 = art === "holz" ? 0 : 1.37;
      m.muster.setTransform(new DOMMatrix([ca * kx, sa * kx, -sa * ky, ca * ky, cx - ca * (off + o2) + sa * b * 0.6, cy - sa * (off + o2) - ca * b * 0.6]));
      g.globalAlpha = al; g.fillStyle = m.muster; g.fill(); g.globalAlpha = 1;
    }
    const zu = !!h.geschnitten;
    if (zu) { g.save(); g.beginPath(); inPfad(g, p); g.clip(); }
    if (breitPx > 9 && !h.clip) {
      /* einzelne Faserlinien im Wechsel hell und dunkel: lange, ruhige Kurven */
      const n = Math.min(8, Math.round(breitPx / 6));
      g.lineWidth = Math.max(0.0035, 0.75 / F.px);
      for (const hellFaser of [false, true]) {
        g.strokeStyle = hellFaser ? rgb(hell(c, 0.18), 0.3) : rgb(hell(c, -0.4), 0.3);
        g.beginPath();
        for (let i = hellFaser ? 1 : 0; i < n; i += 2) {
          const q0 = -b / 2 + b * (i + 0.3 + r() * 0.4) / n;
          let s = 0.02 + r() * 0.3, q = q0;
          let a0 = P(s, q); g.moveTo(a0[0], a0[1]);
          while (s < L - 0.05) {
            const st = Math.min(L - 0.02 - s, 0.6 + r() * 1.1), nq = klemm(q0 + (r() - 0.5) * b * 0.14, -b * 0.42, b * 0.42);
            const k1 = P(s + st * 0.5, (q + nq) / 2 + (r() - 0.5) * b * 0.05), k2 = P(s + st, nq);
            g.quadraticCurveTo(k1[0], k1[1], k2[0], k2[1]);
            s += st; q = nq;
          }
        }
        g.stroke();
      }
    }
    if (F.px > 26) {
      /* Trockenrisse: schmale, spitz auslaufende Spalten längs der Faser */
      const n = h.clip ? 0 : Math.floor(L * 0.9 * r() + (r() < 0.5 ? 1 : 0));
      const t = Math.max(0.004, 1.3 / F.px);
      if (n) {
        g.fillStyle = rgb(hell(c, -0.62), 0.85);
        g.beginPath();
        for (let i = 0; i < n; i++) {
          const sx = r() * Math.max(0.1, L - 0.4), len = 0.25 + r() * Math.min(1.4, L * 0.6), q0 = (r() - 0.5) * b * 0.55, qe = q0 + (r() - 0.5) * b * 0.08;
          const A = P(sx, q0), E = P(Math.min(L, sx + len), qe), K1 = P(sx + len / 2, (q0 + qe) / 2 - t), K2 = P(sx + len / 2, (q0 + qe) / 2 + t * 0.8);
          g.moveTo(A[0], A[1]); g.quadraticCurveTo(K1[0], K1[1], E[0], E[1]); g.quadraticCurveTo(K2[0], K2[1], A[0], A[1]);
        }
        g.fill();
      }
      /* Äste */
      if (F.px > 45 && r() < 0.35 && !h.clip) {
        const A = P(0.2 + r() * Math.max(0.1, L - 0.4), (r() - 0.5) * b * 0.5), ar = 0.012 + r() * 0.014;
        g.fillStyle = rgb(hell(c, -0.45), 0.9); g.beginPath(); g.ellipse(A[0], A[1], ar * 1.5, ar, ang, 0, Math.PI * 2); g.fill();
        g.strokeStyle = rgb(hell(c, -0.3), 0.5); g.lineWidth = Math.max(0.003, 0.7 / F.px);
        g.beginPath(); g.ellipse(A[0], A[1], ar * 2.4, ar * 1.6, ang, 0, Math.PI * 2); g.stroke();
      }
    }
    /* eingeschnitzte Inschrift: lesbar erst ab ~10 Bildpunkten Balkenhöhe,
       darunter nur die Kerblinien */
    if (h.text && breitPx > 5) {
      g.save(); g.translate(cx + ca * L / 2, cy + sa * L / 2); g.rotate(ang);
      if (breitPx > 16) {
        const fs = b * 0.56;
        g.font = "bold " + fs.toFixed(3) + "px 'DejaVu Serif', serif"; g.textAlign = "center"; g.textBaseline = "middle";
        g.fillStyle = rgb(hell(c, 0.22), 0.8); g.fillText(h.text, 0, fs * 0.08);
        g.fillStyle = rgb(hell(c, -0.6), 0.9); g.fillText(h.text, 0, 0);
      } else {
        g.fillStyle = rgb(hell(c, -0.5), 0.7);
        g.fillRect(-L * 0.36, -b * 0.08, L * 0.72, b * 0.16);
      }
      g.restore();
    }
    /* Holznägel an den Zapfen */
    if (F.px > 30 && (h.art === "riegel" || h.art === "band")) {
      const pr = 0.014;
      g.fillStyle = rgb(hell(c, -0.28));
      g.beginPath();
      for (const s of [b * 0.55, L - b * 0.55]) { const A = P(s, 0); g.moveTo(A[0] + pr, A[1]); g.arc(A[0], A[1], pr, 0, Math.PI * 2); }
      g.fill();
    }
    if (zu) g.restore();
  }

  /* ---------------- Kalkputz der Gefache ----------------
     „Gefache verputzt (Kalk-/Lehmputz, leicht gewölbt: Rand der Gefache
     minimal dunkler, feine Risse, Flecken)". Jedes Gefach bekommt einen
     eigenen Ton – über die Jahrhunderte wurde nie alles gleichzeitig
     ausgebessert. */
  function putzGrund(g, F, x, y, w, h, farbe, saat) {
    g.fillStyle = rgb(farbe); g.fillRect(x, y, w, h);
    flecken(g, x, y, w, h, 3.1, 0.22, "dunkel", saat);
    flecken(g, x, y, w, h, 1.7, 0.2, "hell", saat + 2);
    /* Kalkputz: Kelle und Korn – nur sichtbar, wenn man nah dran ist */
    if (F.px > 18) flecken(g, x, y, w, h, 0.7, 0.1, "fein", saat + 7);
    if (F.px > 40) flecken(g, x, y, w, h, 0.3, 0.08, "korn", saat + 9);
  }
  function gefachTon(g, F, fe, farbe, r) {
    const [x, y, w, h] = fe;
    if (w < 0.05 || h < 0.05) return;
    const t = (r() - 0.5);
    g.fillStyle = t > 0 ? "rgba(255,252,240," + (t * 0.22).toFixed(3) + ")" : "rgba(150,130,100," + (-t * 0.12).toFixed(3) + ")";
    g.fillRect(x, y, w, h);
    /* leichte Wölbung: Mitte zum Licht hin heller */
    const cx = x + w * (0.5 + F.lichtU * 0.12), cy = y + h * (0.45 + F.lichtV * 0.1), rr = Math.max(w, h) * 0.75;
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, rr);
    gr.addColorStop(0, "rgba(255,255,250,0.10)"); gr.addColorStop(0.6, "rgba(255,255,250,0.03)"); gr.addColorStop(1, "rgba(120,105,85,0.07)");
    g.fillStyle = gr; g.fillRect(x, y, w, h);
    /* Flecken: Feuchte, ausgebesserte Stelle */
    if (F.px > 16 && r() < 0.35) {
      const fx = x + w * (0.2 + r() * 0.6), fy = y + h * (0.3 + r() * 0.6), fr = Math.min(w, h) * (0.2 + r() * 0.3);
      const gg = g.createRadialGradient(fx, fy, 0, fx, fy, fr);
      const art = r();
      gg.addColorStop(0, art < 0.5 ? "rgba(140,120,90,0.10)" : "rgba(255,255,248,0.16)"); gg.addColorStop(1, "rgba(140,120,90,0)");
      g.fillStyle = gg; g.fillRect(fx - fr, fy - fr, fr * 2, fr * 2);
    }
    /* feine Haarrisse, meist von einer Ecke aus */
    if (F.px > 40 && r() < 0.55) {
      g.strokeStyle = "rgba(95,80,62,0.42)"; g.lineWidth = Math.max(0.002, 0.7 / F.px);
      const ecke = Math.floor(r() * 4);
      let px = ecke % 2 ? x + w - 0.02 : x + 0.02, py = ecke < 2 ? y + 0.02 : y + h - 0.02;
      const zx = x + w / 2 - px, zy = y + h / 2 - py, len = 0.1 + r() * Math.min(w, h) * 0.6, st = Math.max(3, Math.round(len / 0.05));
      const zl = Math.hypot(zx, zy) || 1;
      g.beginPath(); g.moveTo(px, py);
      for (let i = 0; i < st; i++) {
        const nx = px + zx / zl * len / st + (r() - 0.5) * 0.025, ny = py + zy / zl * len / st + (r() - 0.5) * 0.025;
        g.quadraticCurveTo(px + (r() - 0.5) * 0.01, py + (r() - 0.5) * 0.01, nx, ny);
        px = nx; py = ny;
      }
      g.stroke();
    }
  }
  /* Regenspuren unter Fensterbänken und Balkenköpfen */
  function regenSpur(g, x, y, w, l, k) {
    const gr = g.createLinearGradient(0, y, 0, y + l);
    gr.addColorStop(0, "rgba(90,82,66," + (0.16 * k) + ")"); gr.addColorStop(1, "rgba(90,82,66,0)");
    g.fillStyle = gr;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y); g.quadraticCurveTo(x + w * 0.9, y + l * 0.6, x + w * 0.75, y + l); g.lineTo(x + w * 0.25, y + l); g.quadraticCurveTo(x + w * 0.1, y + l * 0.6, x, y); g.fill();
  }

  /* ---------------- Sockel aus Bruchstein ----------------
     XANDER: „Alles mit Struktur, so der Mörtel …". RUNDE 1: statt heller,
     glatter Quader jetzt Harzer Bruchstein (Grauwacke und roter
     Sandstein) in unregelmäßigen Lagen: Steine 0,2–0,45 m, jede Ecke
     versetzt, kissenförmig gewölbt (oben hell, unten dunkel), breite
     helle Mörtelfugen mit einer dunklen Schattenlinie unter jedem Stein.
     Oben eine Abdeckplatte aus Sandstein. */
  const BRUCH = [[128, 130, 118], [140, 138, 124], [150, 142, 126], [162, 140, 118], [170, 130, 110], [136, 128, 116], [146, 134, 120], [156, 150, 136], [120, 118, 110]];
  function sockelMalen(g, F, x0, yTop, w, hoch, saat, opt) {
    opt = opt || {};
    const r = ST.zufall(saat * 31 + 7);
    const yB = yTop + hoch;
    const decke = opt.decke === false ? 0 : 0.085;
    /* Mörtel */
    g.fillStyle = "rgb(205,198,184)"; g.fillRect(x0, yTop, w, hoch);
    flecken(g, x0, yTop, w, hoch, 0.7, 0.3, "dunkel", saat + 1);
    const yS = yTop + decke;
    if (F.px < 9) {
      /* weit weg: Lagenbänder in Steinfarben */
      for (let y = yB; y > yS; y -= 0.2) { g.fillStyle = rgb(PI.streu(BRUCH[Math.floor(r() * BRUCH.length)], r, 0.05)); g.fillRect(x0, Math.max(yS, y - 0.17), w, Math.min(0.17, y - yS)); }
    } else {
      const fuge = F.px > 30 ? 0.018 : 0.024;
      const lagen = [];
      let y = yB;
      while (y > yS + 0.06) { let lh = 0.14 + r() * 0.13; if (y - lh < yS + 0.1) lh = y - yS; lagen.push([y - lh, lh]); y -= lh; }
      const schatten = new Path2D();
      const steine = [];
      for (const [ly, lh] of lagen) {
        let x = x0 - r() * 0.3;
        while (x < x0 + w) {
          const lw = 0.2 + r() * 0.25;
          const j = () => (r() - 0.5) * Math.min(0.05, lh * 0.25);
          const f2 = fuge / 2;
          /* Vieleck mit versetzten Ecken, oben und unten je ein Knick */
          const p = [
            [x + f2 + j(), ly + f2 + Math.abs(j())],
            [x + lw * (0.3 + r() * 0.4), ly + f2 + j() * 0.6],
            [x + lw - f2 + j(), ly + f2 + Math.abs(j())],
            [x + lw - f2 + j() * 0.5, ly + lh * (0.4 + r() * 0.3)],
            [x + lw - f2 + j(), ly + lh - f2 - Math.abs(j())],
            [x + lw * (0.3 + r() * 0.4), ly + lh - f2 + j() * 0.5],
            [x + f2 + j(), ly + lh - f2 - Math.abs(j())],
            [x + f2 + j() * 0.5, ly + lh * (0.35 + r() * 0.3)]
          ];
          const c = PI.streu(BRUCH[Math.floor(r() * BRUCH.length)], r, 0.07);
          steine.push({ p: p, c: c, ly: ly, lh: lh });
          inPfad(schatten, p, 0.006, 0.012);
          x += lw;
        }
      }
      /* dunkle Schattenlinie unter jedem Stein (Fuge liegt zurück) */
      g.fillStyle = "rgba(70,62,52,0.55)"; g.fill(schatten);
      for (const S of steine) {
        const gr = g.createLinearGradient(0, S.ly, 0, S.ly + S.lh);
        gr.addColorStop(0, rgb(hell(S.c, 0.16))); gr.addColorStop(0.3, rgb(S.c)); gr.addColorStop(0.8, rgb(hell(S.c, -0.08))); gr.addColorStop(1, rgb(hell(S.c, -0.24)));
        g.fillStyle = gr; g.beginPath(); inPfad(g, S.p); g.fill();
      }
      if (F.px > 26) {
        /* Poren, Flechten, feine Risse – je Stein ein wenig */
        g.fillStyle = "rgba(60,56,48,0.3)";
        g.beginPath();
        for (const S of steine) for (let i = 0; i < 4; i++) { const q = S.p[Math.floor(r() * 8)], m = S.p[(Math.floor(r() * 8) + 4) % 8]; const t = 0.3 + r() * 0.4; const px = q[0] + (m[0] - q[0]) * t, py = q[1] + (m[1] - q[1]) * t; g.moveTo(px + 0.008, py); g.arc(px, py, 0.004 + r() * 0.006, 0, Math.PI * 2); }
        g.fill();
        g.fillStyle = "rgba(150,156,110,0.28)";
        for (const S of steine) if (r() < 0.25) { const q = S.p[5]; g.beginPath(); g.ellipse(q[0], q[1] - 0.03, 0.05, 0.02, 0, 0, Math.PI * 2); g.fill(); }
      }
    }
    flecken(g, x0, yTop, w, hoch, 1.6, 0.2, "dunkel", saat + 3);
    if (decke) {
      /* Abdeckplatte: oben Schräge (hell), Vorderkante, feine Stoßfugen */
      const c = [190, 176, 150];
      const gr = g.createLinearGradient(0, yTop, 0, yTop + decke);
      gr.addColorStop(0, rgb(hell(c, 0.2))); gr.addColorStop(0.4, rgb(hell(c, 0.08))); gr.addColorStop(0.45, rgb(c)); gr.addColorStop(1, rgb(hell(c, -0.1)));
      g.fillStyle = gr; g.fillRect(x0, yTop, w, decke - 0.012);
      g.fillStyle = "rgba(70,60,48,0.6)"; g.fillRect(x0, yTop + decke - 0.014, w, 0.016);
      flecken(g, x0, yTop, w, decke, 0.9, 0.3, "dunkel", saat + 5);
      if (F.px > 9) for (let xx = x0 + 0.6 + r() * 0.8; xx < x0 + w; xx += 0.9 + r() * 0.6) { g.fillStyle = "rgba(90,78,60,0.5)"; g.fillRect(xx, yTop, 0.012, decke - 0.012); }
    }
    /* Spritzwasser und Algenanflug unten */
    const gr = g.createLinearGradient(0, yB, 0, yB - 0.35);
    gr.addColorStop(0, "rgba(70,72,50,0.32)"); gr.addColorStop(1, "rgba(70,72,50,0)");
    g.fillStyle = gr; g.fillRect(x0, yB - 0.35, w, 0.35);
  }

  /* =====================================================================
     FACHWERK-PLAN: aus Öffnungen und Maßen die Hölzer einer Wand bauen
     ===================================================================== */
  /* Koordinaten im Plan: a = Meter entlang der Wand (von links, von außen
     gesehen), z = Höhe über Boden. Beim Malen: y = zOben − z. */
  function fachwerk(W, zs, oeff, opt) {
    opt = opt || {};
    const H = [];                      // Hölzer
    const felder = [];                 // Gefache [a0, z0, a1, z1]
    const pB = opt.pfosten || 0.2, eckB = opt.eck || 0.22, rB = opt.riegel || 0.16;
    let P = [];
    if (!opt.ohneLinks) P.push({ a: eckB / 2, b: eckB, eck: "l" });
    if (!opt.ohneRechts) P.push({ a: W - eckB / 2, b: eckB, eck: "r" });
    for (const o of oeff) {
      if (o.ohnePfosten) continue;
      P.push({ a: o.a0 - pB / 2, b: pB }); P.push({ a: o.a1 + pB / 2, b: pB });
    }
    (opt.pfostenBei || []).forEach((a) => P.push({ a: a, b: pB }));
    P.sort((p, q) => p.a - q.a);
    const M = [];
    for (const p of P) {
      const l = M[M.length - 1];
      if (l && p.a - p.b / 2 < l.a + l.b / 2 + 0.1) {
        const lo = Math.min(l.a - l.b / 2, p.a - p.b / 2), hi = Math.max(l.a + l.b / 2, p.a + p.b / 2);
        l.a = (lo + hi) / 2; l.b = Math.min(0.3, hi - lo); l.eck = l.eck || p.eck;
      } else M.push(Object.assign({}, p));
    }
    /* Lücken ohne Öffnung mit Ständern füllen (niedersächsisch: eng!) */
    const maxF = opt.maxFeld || 0.95;
    P = [];
    for (let i = 0; i < M.length; i++) {
      P.push(M[i]);
      if (i === M.length - 1) break;
      const a0 = M[i].a + M[i].b / 2, a1 = M[i + 1].a - M[i + 1].b / 2;
      const offen = oeff.some((o) => o.a0 >= a0 - 0.05 && o.a1 <= a1 + 0.05);
      if (offen || a1 - a0 < maxF) continue;
      const n = Math.ceil((a1 - a0 + pB) / (maxF + pB)) - 1;
      const f = (a1 - a0 - n * pB) / (n + 1);
      for (let k = 1; k <= n; k++) P.push({ a: a0 + k * f + (k - 0.5) * pB, b: pB });
    }
    const s0 = zs.s0, s1 = zs.s1, r0 = zs.r0, r1 = zs.r1;
    /* Schwelle und Rähm laufen durch */
    if (!opt.ohneSchwelle) H.push({ art: "schwelle", a0: opt.schwelleVon == null ? 0 : opt.schwelleVon, z0: (s0 + s1) / 2, a1: opt.schwelleBis == null ? W : opt.schwelleBis, z1: (s0 + s1) / 2, b: s1 - s0 });
    H.push({ art: "rahm", a0: 0, z0: (r0 + r1) / 2, a1: W, z1: (r0 + r1) / 2, b: r1 - r0 });
    const zBr = zs.brust, zSt = zs.sturz;
    const buchten = [];
    for (let i = 0; i < P.length; i++) {
      const p = P[i];
      H.push({ art: "staender", a0: p.a, z0: s1, a1: p.a, z1: r0, b: p.b, eck: p.eck });
      if (i < P.length - 1) buchten.push({ a0: p.a + p.b / 2, a1: P[i + 1].a - P[i + 1].b / 2, links: p.eck === "l", rechts: P[i + 1].eck === "r" });
    }
    for (const bu of buchten) {
      const o = oeff.find((q) => q.a0 >= bu.a0 - 0.06 && q.a1 <= bu.a1 + 0.06);
      const bw = bu.a1 - bu.a0;
      if (bw < 0.05) continue;
      if (o) {
        bu.oeff = o;
        const unten = o.z0 - rB / 2, oben = o.z1 + rB / 2;
        if (o.z0 > s1 + 0.12) {
          H.push({ art: "riegel", a0: bu.a0, z0: unten, a1: bu.a1, z1: unten, b: rB });
          const fz0 = s1, fz1 = o.z0 - rB;
          felder.push([bu.a0, fz0, bu.a1, fz1, o.bruestung || null]);
          if (o.bruestung === "kreuz") andreas(H, bu.a0, fz0, bu.a1, fz1, 0.13);
          else if (o.bruestung === "raute") raute(H, bu.a0, fz0, bu.a1, fz1, 0.12);
          else if (o.bruestung === "fussband") fussband(H, bu.a0, fz0, bu.a1, fz1, 0.13);
        }
        if (o.z1 < r0 - 0.12) {
          H.push({ art: "riegel", a0: bu.a0, z0: oben, a1: bu.a1, z1: oben, b: rB });
          felder.push([bu.a0, o.z1 + rB, bu.a1, r0, null]);
        }
        /* schmalere Öffnung in breiter Bucht: Stiele */
        if (o.a0 - bu.a0 > 0.1) H.push({ art: "staender", a0: o.a0 - 0.06, z0: Math.max(s1, o.z0 - rB), a1: o.a0 - 0.06, z1: Math.min(r0, o.z1 + rB), b: 0.12 });
        if (bu.a1 - o.a1 > 0.1) H.push({ art: "staender", a0: o.a1 + 0.06, z0: Math.max(s1, o.z0 - rB), a1: o.a1 + 0.06, z1: Math.min(r0, o.z1 + rB), b: 0.12 });
        continue;
      }
      /* Bucht ohne Öffnung: Riegel auf Brust- und Sturzhöhe */
      const riegelZ = [];
      if (zBr && zBr - rB / 2 > s1 + 0.2) riegelZ.push(zBr - rB / 2);
      if (zSt && zSt + rB / 2 < r0 - 0.2) riegelZ.push(zSt + rB / 2);
      if (!riegelZ.length) riegelZ.push((s1 + r0) / 2);
      for (const z of riegelZ) H.push({ art: "riegel", a0: bu.a0, z0: z, a1: bu.a1, z1: z, b: rB });
      const zz = [s1].concat(riegelZ.map((z) => [z - rB / 2, z + rB / 2]).flat(), [r0]);
      for (let k = 0; k < zz.length; k += 2) felder.push([bu.a0, zz[k], bu.a1, zz[k + 1], null]);
      /* Halber Mann an den Ecken: Fußstrebe zum Eckständer und Kopfband */
      if ((bu.links || bu.rechts) && opt.mann !== false && bw > 0.35) {
        const kl = [bu.a0, s1, bw, r0 - s1];
        const zm = s1 + (r0 - s1) * 0.62;
        if (bu.links) {
          H.push({ art: "strebe", a0: bu.a1 + 0.05, z0: s1 - 0.05, a1: bu.a0, z1: zm, b: 0.18, clip: kl });
          H.push({ art: "band", a0: bu.a0, z0: zm + 0.22, a1: bu.a0 + Math.min(bw, 0.55), z1: r0 + 0.02, b: 0.15, clip: kl });
        } else {
          H.push({ art: "strebe", a0: bu.a0 - 0.05, z0: s1 - 0.05, a1: bu.a1, z1: zm, b: 0.18, clip: kl });
          H.push({ art: "band", a0: bu.a1, z0: zm + 0.22, a1: bu.a1 - Math.min(bw, 0.55), z1: r0 + 0.02, b: 0.15, clip: kl });
        }
      }
    }
    return { H: H, felder: felder, pfosten: P, buchten: buchten };
  }
  function andreas(H, a0, z0, a1, z1, b) {
    const kl = [a0, z0, a1 - a0, z1 - z0];
    H.push({ art: "strebe", a0: a0, z0: z0, a1: a1, z1: z1, b: b, clip: kl, kreuz: 1 });
    H.push({ art: "strebe", a0: a0, z0: z1, a1: a1, z1: z0, b: b, clip: kl, kreuz: 2 });
  }
  /* Fußbänder: zwei kurze Streben von den Ständern schräg auf die Schwelle
     (niedersächsisch, typisch für Goslar und Quedlinburg) */
  function fussband(H, a0, z0, a1, z1, b) {
    const kl = [a0, z0, a1 - a0, z1 - z0], hh = z1 - z0, w = a1 - a0;
    H.push({ art: "band", a0: a0, z0: z0 + hh * 0.8, a1: a0 + w * 0.42, z1: z0 - 0.02, b: b, clip: kl });
    H.push({ art: "band", a0: a1, z0: z0 + hh * 0.8, a1: a1 - w * 0.42, z1: z0 - 0.02, b: b, clip: kl });
  }
  function raute(H, a0, z0, a1, z1, b) {
    const kl = [a0, z0, a1 - a0, z1 - z0], am = (a0 + a1) / 2, zm = (z0 + z1) / 2;
    H.push({ art: "band", a0: a0, z0: zm, a1: am, z1: z1, b: b, clip: kl });
    H.push({ art: "band", a0: am, z0: z1, a1: a1, z1: zm, b: b, clip: kl });
    H.push({ art: "band", a0: a1, z0: zm, a1: am, z1: z0, b: b, clip: kl });
    H.push({ art: "band", a0: am, z0: z0, a1: a0, z1: zm, b: b, clip: kl });
  }
  /* Plan-Hölzer (a, z) → Flächenkoordinaten (x, y) */
  function inFlaeche(H, zOben, saat) {
    const r = ST.zufall(saat);
    return H.map((h) => {
      const k = {
        art: h.art, x0: h.a0, y0: zOben - h.z0, x1: h.a1, y1: zOben - h.z1, b: h.b, r: ST.zufall((r() * 1e9) | 0), eck: h.eck, kreuz: h.kreuz, text: h.text
      };
      /* RUNDE 1: altes Haus – Ständer ±0,5–1° aus dem Lot, Rähm hängt
         2–4 cm durch (vorher: alles schnurgerade wie Modellbahn) */
      const kipp = (r() - 0.5) * 0.06;
      if (h.art === "staender" && Math.abs(h.a0 - h.a1) < 1e-3) k.x1 += kipp;
      if (h.art === "rahm" && Math.abs(h.z0 - h.z1) < 1e-3 && Math.abs(h.a1 - h.a0) > 2) k.durch = 0.02 + r() * 0.02;
      if (h.clip) k.clip = [h.clip[0], zOben - (h.clip[1] + h.clip[3]), h.clip[2], h.clip[3]];
      return k;
    });
  }

  /* =====================================================================
     ÖFFNUNGEN: Fenster, Schaufenster, Türen – mit echter Laibungstiefe
     ===================================================================== */
  /* Vertiefung: die Öffnung (x,y,w,h) liegt um „tiefe" zurück. Man sieht
     je nach Winkel die linke oder rechte Laibung und unten die Bank.
     innen(g) malt den zurückliegenden Inhalt in den Koordinaten der
     Öffnung. */
  function nische(g, F, x, y, w, h, tiefe, laib, innen) {
    const B = blick(F), d = B.tief(tiefe);
    const [dx, dy] = d;
    g.save();
    g.beginPath(); g.rect(x, y, w, h); g.clip();
    /* Laibungen (Seitenflächen der Mauer) */
    const L = laib || [226, 218, 200];
    g.fillStyle = rgb(hell(L, -0.25)); g.fillRect(x, y, w, h);
    const seite = (pts, nu, nv) => fuelle(g, pts, rgb(hell(L, (seitenHell(F, nu, nv, 0) - 1) * 0.8)));
    if (dx > 0) seite([[x, y], [x + dx, y + dy], [x + dx, y + h + dy], [x, y + h]], 1, 0);
    if (dx < 0) seite([[x + w, y], [x + w + dx, y + dy], [x + w + dx, y + h + dy], [x + w, y + h]], -1, 0);
    if (dy < 0) seite([[x, y + h], [x + w, y + h], [x + w + dx, y + h + dy], [x + dx, y + h + dy]], 0, -1);
    if (dy > 0) seite([[x, y], [x + w, y], [x + w + dx, y + dy], [x + dx, y + dy]], 0, 1);
    g.translate(dx, dy);
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    innen(g);
    /* Sonnenschatten der Laibung auf dem zurückliegenden Inhalt */
    const sv = F.schatten(tiefe);
    if (sv) {
      g.fillStyle = "rgba(24,26,40,0.38)";
      g.beginPath(); g.rect(x, y, w, h); g.rect(x + sv[0], y + sv[1], w, h); g.fill("evenodd");
    } else {
      const gr = g.createLinearGradient(0, y, 0, y + h * 0.4);
      gr.addColorStop(0, "rgba(20,24,40,0.25)"); gr.addColorStop(1, "rgba(20,24,40,0)");
      g.fillStyle = gr; g.fillRect(x, y, w, h * 0.4);
    }
    g.restore();
    g.restore();
    /* dunkle Fuge rundum */
    g.strokeStyle = "rgba(40,32,26,0.35)"; g.lineWidth = Math.max(0.004, 0.8 / F.px); g.strokeRect(x, y, w, h);
  }
  /* Vorspringender Kasten (Fensterbank, Blumenkasten, Briefkasten):
     Vorderseite, Oberseite und die sichtbare Seitenfläche – dazu der
     Schlagschatten auf die Wand. malVorn(g, x, y, w, h) bemalt die Front. */
  function vorsprung(g, F, x, y, w, h, t, farbe, opt) {
    opt = opt || {};
    const B = blick(F), d = B.tief(-t), sv = F.schatten(t);
    if (sv && opt.schatten !== false) {
      g.fillStyle = "rgba(34,28,30," + (opt.schattenK || 0.3) + ")";
      vieleck(g, huelle2([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x + sv[0], y + sv[1]], [x + w + sv[0], y + sv[1]], [x + w + sv[0], y + h + sv[1]], [x + sv[0], y + h + sv[1]]]));
      g.fill();
    }
    const [dx, dy] = d;
    const oben = opt.oben || hell(farbe, 0.16), seitl = hell(farbe, -0.1);
    if (dy > 0) fuelle(g, [[x, y], [x + w, y], [x + w + dx, y + dy], [x + dx, y + dy]], rgb(hellMal(oben, seitenHell(F, 0, -1, 0))));
    if (dx < 0) fuelle(g, [[x, y], [x + dx, y + dy], [x + dx, y + h + dy], [x, y + h]], rgb(hellMal(seitl, seitenHell(F, -1, 0, 0))));
    if (dx > 0) fuelle(g, [[x + w, y], [x + w + dx, y + dy], [x + w + dx, y + h + dy], [x + w, y + h]], rgb(hellMal(seitl, seitenHell(F, 1, 0, 0))));
    if (opt.vorn) opt.vorn(g, x + dx, y + dy, w, h);
    else { g.fillStyle = rgb(farbe); g.fillRect(x + dx, y + dy, w, h); }
    return [dx, dy];
  }
  function hellMal(c, k) { return [Math.min(255, c[0] * k), Math.min(255, c[1] * k), Math.min(255, c[2] * k)]; }
  function huelle2(pts) {
    pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const kr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], hi = [];
    for (const p of pts) { while (lo.length >= 2 && kr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (hi.length >= 2 && kr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
    hi.pop(); lo.pop();
    return lo.concat(hi);
  }

  /* ---------------- Glas ----------------
     XANDER: „feine Texturen im Fensterglas". RUNDE 1: Erst der Raum dahinter
     (dunkel, Gardinen, Auslage), darüber JE SCHEIBE eine eigene Spiegelung:
     eigene Helligkeit (±15 %) und eigener Winkel – altes Zylinderglas steht
     nie ganz plan. Oben spiegelt sich dunkel die Traufe, dazu geschwungene
     Schlieren; im Winter Eisblumen in den unteren Ecken und ein
     Kondensstreifen am Rahmen. opt.spiegel = Deckkraft der Spiegelung. */
  function glas(g, F, x, y, w, h, r, opt) {
    opt = opt || {};
    const Zn = F.nacht, Zt = F.zeit || {};
    /* der Raum dahinter */
    const gi = g.createLinearGradient(0, y, 0, y + h);
    gi.addColorStop(0, "rgb(26,24,28)"); gi.addColorStop(1, "rgb(44,38,36)");
    g.fillStyle = gi; g.fillRect(x, y, w, h);
    if (opt.innen) opt.innen(g, x, y, w, h);
    const scheiben = opt.scheiben || [[x, y, w, h]];
    const deck = opt.spiegel == null ? 0.62 : opt.spiegel;
    const fein = F.px > 40, winter = F.jahr === "winter";
    /* RUNDE 2 (Kritik: „Clipart-Doppelstreifen"): Das Glas spiegelt, was
       gegenüber ist – oben der Himmel der Tageszeit (hell), darunter als
       weich gezacktes, dunkleres Band die Dächer der Häuser gegenüber,
       unten sieht man in den Raum. Jede Scheibe steht bei altem Glas etwas
       anders (±3 % Helligkeit, die Dachlinie leicht versetzt), in den
       unteren Ecken sitzt Staub. XANDER: „feine Texturen im Fensterglas". */
    const hm = Zt.himmel || ["#bcd3ea", "#e9f1f8"];
    const hOben = hex(hm[0]), hHor = hex(hm[1]);
    const nacht = Zn > 0.9;
    const hellK = nacht ? 0.55 : 1;
    const dachZ = ST.zufall(ST.textHash((F.name || "") + x.toFixed(2)));
    const phase = dachZ() * 9, basis = 0.36 + dachZ() * 0.1;
    for (const [sx, sy, sw, sh] of scheiben) {
      if (sw < 0.01 || sh < 0.01) continue;
      const k = (1 + (r() - 0.5) * 0.06) * hellK;
      const c = (a, m) => rgb(hellMal(a, k * (m || 1)));
      g.save(); g.beginPath(); g.rect(sx, sy, sw, sh); g.clip();
      /* Himmel: oben das Blau, zum Horizont (Scheibenmitte) hell */
      const gr = g.createLinearGradient(0, sy, 0, sy + sh);
      gr.addColorStop(0, c(misch(hOben, hHor, 0.25))); gr.addColorStop(0.33, c(hHor)); gr.addColorStop(1, c(hHor, 0.9));
      g.globalAlpha = deck; g.fillStyle = gr; g.fillRect(sx, sy, sw, sh);
      /* gespiegelte Dachlinie gegenüber: weich gezackt (Giebel, Kamine) */
      const bOben = (a) => sy + sh * (basis + 0.06 * Math.sin(a * 5.3 + phase) + 0.035 * Math.sin(a * 13.7 + phase * 2) + 0.05 * Math.max(0, Math.sin(a * 2.1 + phase)));
      const bUnten = sy + sh * (basis + 0.3);
      g.beginPath(); g.moveTo(sx, bUnten);
      const st = Math.max(0.02, sw / 10);
      for (let a = sx; a <= sx + sw + st * 0.5; a += st) g.lineTo(a, bOben(a));
      g.lineTo(sx + sw, bUnten); g.closePath();
      g.fillStyle = c(hHor, 0.75); g.fill();
      /* unter der Dachlinie: die Straße, schwache Spiegelung – man sieht hinein */
      const gu = g.createLinearGradient(0, bUnten - sh * 0.04, 0, sy + sh);
      gu.addColorStop(0, c(hHor, 0.62)); gu.addColorStop(1, "rgba(30,32,40,0)");
      g.globalAlpha = deck * 0.55; g.fillStyle = gu; g.fillRect(sx, bUnten - sh * 0.04, sw, sy + sh - bUnten + sh * 0.04);
      g.globalAlpha = 1;
      /* Staub in den unteren Ecken */
      if (F.px * sw > 12) {
        for (const ex of [sx, sx + sw]) {
          const dg = g.createRadialGradient(ex, sy + sh, 0, ex, sy + sh, Math.min(sw, sh) * 0.45);
          dg.addColorStop(0, "rgba(96,88,72,0.16)"); dg.addColorStop(1, "rgba(96,88,72,0)");
          g.fillStyle = dg; g.fillRect(ex - sw * 0.5, sy + sh * 0.5, sw, sh * 0.5);
        }
      }
      if (fein) {
        /* Schlieren im Zylinderglas: sehr leise, lang gezogen */
        g.strokeStyle = "rgba(255,255,255,0.06)"; g.lineWidth = Math.max(0.003, 1 / F.px);
        const yy = sy + sh * (0.2 + r() * 0.6);
        g.beginPath(); g.moveTo(sx, yy); g.bezierCurveTo(sx + sw * 0.3, yy - sh * 0.06, sx + sw * 0.6, yy + sh * 0.06, sx + sw, yy - sh * 0.02); g.stroke();
      }
      if (winter && Zn < 0.95) {
        /* Kondensstreifen unten, Eisblumen in den Ecken */
        const gk = g.createLinearGradient(0, sy + sh, 0, sy + sh - 0.05);
        gk.addColorStop(0, "rgba(236,242,248,0.45)"); gk.addColorStop(1, "rgba(236,242,248,0)");
        g.fillStyle = gk; g.fillRect(sx, sy + sh - 0.05, sw, 0.05);
        if (F.px > 50) eisblumen(g, F, sx, sy, sw, sh, r);
      }
      g.restore();
    }
    /* Schaufenster: EIN großer, weicher Glanz von der oberen Ecke her
       (höchstens 12 % Weiß) statt Streifen je Scheibe */
    if (opt.glanz && !nacht) {
      g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
      const R = Math.max(w, h) * 0.9;
      const gg = g.createRadialGradient(x, y, 0, x, y, R);
      gg.addColorStop(0, "rgba(255,255,255,0.12)"); gg.addColorStop(0.55, "rgba(255,255,255,0.05)"); gg.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gg; g.fillRect(x, y, w, h);
      g.restore();
    }
  }
  /* Eisblumen: kleine Farnfraktale aus den unteren Ecken (5–10 cm) */
  function eisblumen(g, F, sx, sy, sw, sh, r) {
    g.strokeStyle = "rgba(240,246,252,0.55)"; g.lineWidth = Math.max(0.0015, 0.5 / F.px);
    const farn = (x, y, a, l, n) => {
      if (n <= 0 || l < 0.006) return;
      const x1 = x + Math.cos(a) * l, y1 = y + Math.sin(a) * l;
      g.moveTo(x, y); g.lineTo(x1, y1);
      farn(x + Math.cos(a) * l * 0.45, y + Math.sin(a) * l * 0.45, a - 0.8, l * 0.45, n - 1);
      farn(x + Math.cos(a) * l * 0.45, y + Math.sin(a) * l * 0.45, a + 0.8, l * 0.45, n - 1);
      farn(x1, y1, a + (r() - 0.5) * 0.4, l * 0.55, n - 1);
    };
    g.beginPath();
    for (const [x, dir] of [[sx, 1], [sx + sw, -1]]) {
      if (r() < 0.35) continue;
      for (let i = 0; i < 2; i++) farn(x, sy + sh - r() * 0.02, dir > 0 ? -0.5 - r() * 0.7 : Math.PI + 0.5 + r() * 0.7, 0.04 + r() * 0.04, 3);
    }
    g.stroke();
  }
  /* Raum hinter dem Glas (tagsüber): dunkle Decke, helle Gardine */
  function raumTag(g, F, x, y, w, h, r, opt) {
    g.fillStyle = "rgba(20,16,14,0.25)"; g.fillRect(x, y, w, h * 0.35);
    if (opt && opt.gardine) {
      /* Scheibengardine: weiße Spitze in der unteren Hälfte, gewellter Saum */
      const gy = y + h * 0.52;
      g.fillStyle = "rgba(246,244,238,0.82)";
      g.beginPath(); g.moveTo(x, gy);
      const n = Math.max(3, Math.round(w / 0.07));
      for (let i = 0; i <= n; i++) g.quadraticCurveTo(x + (i - 0.5) * w / n, gy + 0.02, x + i * w / n, gy);
      g.lineTo(x + w, y + h); g.lineTo(x, y + h); g.closePath(); g.fill();
      if (F.px > 60) {
        g.fillStyle = "rgba(180,176,168,0.45)";
        for (let yy = gy + 0.03; yy < y + h; yy += 0.035) for (let xx = x + 0.015 + ((yy * 100) % 2) * 0.012; xx < x + w; xx += 0.028) { g.beginPath(); g.arc(xx, yy, 0.005, 0, Math.PI * 2); g.fill(); }
      }
    }
    if (opt && opt.stern && F.jahr === "winter") herrnhuter(g, F, x + w / 2, y + h * 0.36, Math.min(0.3, w * 0.42), 1, true);
  }

  /* ---------------- Sprossenfenster ----------------
     op = { a0,a1,z0,z1 (Plan), sp: [Spalten je Flügel, Zeilen], fl: Flügel,
            kaempfer: true|false, laeden, kasten, licht, stern, bogen } */
  function rahmenHolz(g, x, y, w, h, c, F, senk) {
    /* Profil: helle Kante zum Licht, dunkle Kante gegenüber */
    g.fillStyle = rgb(c); g.fillRect(x, y, w, h);
    if (F.px * Math.min(w, h) < 1.2) return;
    const d = senk ? w : h, k = 0.2;
    g.fillStyle = rgb(hell(c, 0.18));
    if (senk) g.fillRect(x, y, d * k, h); else g.fillRect(x, y, w, d * k);
    g.fillStyle = rgb(hell(c, -0.28));
    if (senk) g.fillRect(x + w - d * k, y, d * k, h); else g.fillRect(x, y + h - d * k, w, d * k);
  }
  function fensterInhalt(g, F, x, y, w, h, op, V) {
    const r = ST.zufall(ST.textHash(F.name + op.a0.toFixed(2) + op.z0.toFixed(2)) + V.saat);
    const rc = op.rahmen || V.rahmen;
    const rb = Math.min(0.065, w * 0.08);                 // Blendrahmen
    const fl = op.fl || 2;
    const kae = op.kaempfer !== false && h > w * 1.1 ? y + h * 0.3 : null;
    /* Glas mit Innenraum – jede Scheibe (zwischen den Sprossen) für sich */
    const scheiben = [];
    {
      const [sS, sZ] = op.sp || [1, 2], gx = x + rb, gw = w - 2 * rb, u0 = kae || y + rb, u1 = y + h - rb;
      for (let i = 0; i < fl; i++) for (let a = 0; a < sS; a++) for (let b = 0; b < sZ; b++) {
        const fw = gw / fl / sS; scheiben.push([gx + (i * sS + a) * fw, u0 + (u1 - u0) * b / sZ, fw, (u1 - u0) / sZ]);
      }
      if (kae) { const n = fl * (op.obenSp || 1); for (let a = 0; a < n; a++) scheiben.push([gx + gw * a / n, y + rb, gw / n, kae - y - rb]); }
    }
    glas(g, F, x + rb, y + rb, w - 2 * rb, h - 2 * rb, r, { scheiben: F.px > 14 ? scheiben : null, innen: (gg, gx, gy, gw, gh) => raumTag(gg, F, gx, gy, gw, gh, r, { gardine: op.gardine !== false, stern: op.stern && F.nacht < 0.01 }) });
    const fein = F.px > 20;
    const sb = Math.max(0.022, 1.1 / F.px), fb = Math.min(0.055, w * 0.065);
    /* Sprossen */
    const [spS, spZ] = op.sp || [1, 2];
    const flaeche = (fx, fy, fw, fh, sS, sZ) => {
      if (!fein && F.px < 10) return;
      for (let k = 1; k < sS; k++) rahmenHolz(g, fx + fw * k / sS - sb / 2, fy, sb, fh, rc, F, true);
      for (let k = 1; k < sZ; k++) rahmenHolz(g, fx, fy + fh * k / sZ - sb / 2, fw, sb, rc, F, false);
    };
    const unten0 = kae ? kae : y;
    /* RUNDE 2 (Kritik: „ein geöffneter Fensterflügel mit wehender
       Gardine"): Im Frühling steht bei einem Fenster der rechte Flügel
       offen – nach innen gedreht (wie in Deutschland üblich), man sieht
       den dunklen Raum, den schräg stehenden Flügel am Band und die
       Gardine, die der Wind über die Fensterbank hinausweht. */
    const offen = op.offenFr && F.jahr === "fruehling" && F.px > 10 && (F.o.bau == null || F.o.bau >= 0.965);
    if (offen) {
      const fw = (w - 2 * rb) / fl, fx = x + rb + fw * (fl - 1), fy = unten0, fh = y + h - rb - unten0;
      const ri = g.createLinearGradient(0, fy, 0, fy + fh);
      ri.addColorStop(0, "rgb(30,24,22)"); ri.addColorStop(1, "rgb(58,46,38)");
      g.fillStyle = ri; g.fillRect(fx, fy, fw, fh);
      /* Laibung innen, zum Licht hin etwas heller */
      g.fillStyle = "rgba(210,200,180,0.35)"; g.fillRect(fx, fy, fw * 0.08, fh);
      /* der offene Flügel: schmal, am rechten Band, Glas spiegelt den Raum */
      const ow = fw * 0.34, ox = fx + fw - ow;
      g.fillStyle = rgb(hell(rc, -0.12));
      g.beginPath(); g.moveTo(ox, fy + fh * 0.04); g.lineTo(fx + fw, fy); g.lineTo(fx + fw, fy + fh); g.lineTo(ox, fy + fh * 0.96); g.closePath(); g.fill();
      const gl = g.createLinearGradient(ox, 0, fx + fw, 0);
      gl.addColorStop(0, "rgba(58,60,66,0.95)"); gl.addColorStop(1, "rgba(116,124,134,0.9)");
      g.fillStyle = gl;
      g.beginPath(); g.moveTo(ox + ow * 0.2, fy + fh * 0.07); g.lineTo(fx + fw - ow * 0.18, fy + fh * 0.04); g.lineTo(fx + fw - ow * 0.18, fy + fh * 0.96); g.lineTo(ox + ow * 0.2, fy + fh * 0.93); g.closePath(); g.fill();
      g.fillStyle = rgb(hell(rc, -0.2)); g.fillRect(ox + ow * 0.2, fy + fh * 0.49, ow * 0.62, Math.max(0.015, 0.8 / F.px));
      /* Gardine: oben an der Stange, unten vom Wind hinausgeweht */
      const gx0 = fx + fw * 0.05, gx1 = fx + fw * 0.4, gy0 = fy + 0.02, gy1 = fy + fh + 0.05;
      g.fillStyle = "rgba(246,244,238,0.86)";
      g.beginPath(); g.moveTo(gx0, gy0); g.lineTo(gx1, gy0);
      g.bezierCurveTo(gx1 - fw * 0.12, gy0 + fh * 0.35, gx1 + fw * 0.02, gy0 + fh * 0.72, gx1 + fw * 0.14, gy1);
      g.quadraticCurveTo(gx0 + fw * 0.45, gy1 + 0.03, gx0 + fw * 0.02, gy1 - 0.04);
      g.bezierCurveTo(gx0 - fw * 0.02, gy0 + fh * 0.6, gx0 + fw * 0.03, gy0 + fh * 0.3, gx0, gy0); g.closePath(); g.fill();
      if (F.px > 30) {
        g.strokeStyle = "rgba(170,166,158,0.4)"; g.lineWidth = Math.max(0.004, 0.6 / F.px);
        for (let k = 1; k < 5; k++) { const q = k / 5; g.beginPath(); g.moveTo(gx0 + (gx1 - gx0) * q, gy0); g.bezierCurveTo(gx0 + (gx1 - gx0) * q, gy0 + fh * 0.4, gx0 + (gx1 - gx0) * q + fw * 0.06 * q, gy0 + fh * 0.75, gx0 + (gx1 + fw * 0.14 - gx0) * q, gy1 - 0.01); g.stroke(); }
      }
    }
    for (let i = 0; i < fl; i++) {
      const fx = x + rb + (w - 2 * rb) * i / fl, fw = (w - 2 * rb) / fl;
      if (offen && i === fl - 1) continue;
      flaeche(fx, unten0, fw, y + h - rb - unten0, spS, spZ);
      if (fein) {
        /* Flügelrahmen */
        g.strokeStyle = rgb(hell(rc, -0.05)); g.lineWidth = fb;
        g.strokeRect(fx + fb / 2, unten0 + (kae ? fb / 2 : rb * 0 + fb / 2), fw - fb, y + h - rb - unten0 - fb);
        g.strokeStyle = rgb(hell(rc, -0.35), 0.5); g.lineWidth = Math.max(0.003, 0.7 / F.px);
        g.strokeRect(fx + fb, unten0 + fb, fw - 2 * fb, y + h - rb - unten0 - 2 * fb);
      }
    }
    if (kae) {
      flaeche(x + rb, y + rb, w - 2 * rb, kae - y - rb, fl * (op.obenSp || 1), 1);
      rahmenHolz(g, x, kae - rb * 0.5, w, rb, rc, F, false);
    }
    /* Mittelpfosten (Stulp) */
    for (let i = 1; i < fl; i++) rahmenHolz(g, x + w * i / fl - rb * 0.45, unten0, rb * 0.9, y + h - unten0, rc, F, true);
    /* Blendrahmen */
    rahmenHolz(g, x, y, w, rb, rc, F, false);
    rahmenHolz(g, x, y + h - rb * 1.2, w, rb * 1.2, rc, F, false);
    rahmenHolz(g, x, y, rb, h, rc, F, true);
    rahmenHolz(g, x + w - rb, y, rb, h, rc, F, true);
    if (F.px > 60) {
      /* Fenstergriffe (Oliven) */
      g.fillStyle = "#c9c2b0";
      for (let i = 1; i < fl; i++) { rrect(g, x + w * i / fl - 0.012, y + h * 0.62, 0.024, 0.07, 0.01); g.fill(); }
    }
  }
  /* Fenster komplett (Läden, Laibung, Inhalt, Bank, Kasten) in eine Wand */
  function fensterMalen(g, F, zOben, op, V) {
    const x = op.a0, w = op.a1 - op.a0, y = zOben - op.z1, h = op.z1 - op.z0;
    const ladenZu = op.laeden && op.ladenZuFr && F.jahr === "fruehling" && (F.o.bau == null || F.o.bau >= 0.965);
    if (op.laeden) laeden(g, F, x, y, w, h, op, V, ladenZu ? "links" : null);
    nische(g, F, x, y, w, h, op.tiefe || 0.1, op.laib, (gg) => fensterInhalt(gg, F, x, y, w, h, op, V));
    if (ladenZu) laeden(g, F, x, y, w, h, op, V, "zu");
    /* Fensterbank aus Sandstein (steht vor) */
    const bx = x - 0.05, bw = w + 0.1, by = y + h, bh = 0.06;
    if (F.px > 6) {
      vorsprung(g, F, bx, by, bw, bh, 0.07, [196, 182, 156], {
        vorn: (gg, vx, vy, vw, vh) => { gg.fillStyle = "rgb(186,172,146)"; gg.fillRect(vx, vy, vw, vh); gg.fillStyle = "rgba(60,50,40,0.35)"; gg.fillRect(vx, vy + vh - 0.012, vw, 0.012); }
      });
      if (F.jahr === "winter") schneeKante(g, F, bx, by, bw, 0.07, 0.035);
      regenSpur(g, bx + 0.08, by + bh + 0.01, bw - 0.16, 0.45 + (op.a0 * 7 % 1) * 0.3, 0.8);
    }
    /* Blumenkasten: RUNDE 2 ein echter kleiner Quader mit Pflanzen als Figur
       (kaesten()); auf der Wand bleiben nur Konsolen und sein Schatten */
    if (op.kasten && F.px > 7 && (F.o.bau == null || F.o.bau >= 0.965)) kastenAufWand(g, F, x - 0.04, y + h + 0.045, w + 0.08);
  }
  /* Schnee auf einer vorstehenden Kante (Fensterbank, Kasten): ein
     rundes Polster, das über die Vorderkante quillt */
  function schneeKante(g, F, x, y, w, t, dick) {
    const B = blick(F), d = B.tief(-t);
    const r = ST.zufall(ST.textHash(F.name + x.toFixed(2)));
    const y0 = y - dick, y1 = y + d[1] + 0.012;
    g.fillStyle = "rgb(236,242,250)";
    g.beginPath(); g.moveTo(x + 0.01, y);
    g.bezierCurveTo(x + 0.01, y0, x + w * 0.3, y0 - dick * 0.3 * r(), x + w * 0.5, y0 - dick * 0.1);
    g.bezierCurveTo(x + w * 0.7, y0 + dick * 0.1, x + w - 0.01, y0, x + w - 0.01, y);
    g.lineTo(x + w + d[0] - 0.01, y1); g.quadraticCurveTo(x + w / 2 + d[0], y1 + dick * 0.5, x + d[0] + 0.01, y1); g.closePath(); g.fill();
    g.fillStyle = "rgba(150,170,205,0.35)";
    g.beginPath(); g.moveTo(x + d[0] + 0.01, y1 - 0.01); g.quadraticCurveTo(x + w / 2 + d[0], y1 + dick * 0.5, x + w + d[0] - 0.01, y1 - 0.01); g.lineTo(x + w + d[0] - 0.01, y1 - dick * 0.3); g.quadraticCurveTo(x + w / 2 + d[0], y1 + dick * 0.1, x + d[0] + 0.01, y1 - dick * 0.3); g.fill();
  }

  /* ---------------- Fensterläden ----------------
     Aufgeklappt flach an der Wand: Rahmen mit Füllung (oben) und
     Brettern (unten), Kloben, Winkelbänder, Ladenhalter. */
  /* RUNDE 2 (Kritik: „die Läden ungleich weit offen"): modus "links" malt
     nur den linken, offenen Laden; modus "zu" den rechten Laden
     zugeklappt vor der rechten Fensterhälfte (angelehnt gegen die Sonne) */
  function laeden(g, F, x, y, w, h, op, V, modus) {
    const c = V.laden;
    const sv = F.schatten(0.035);
    for (const s of modus === "links" ? [0] : modus === "zu" ? [1] : [0, 1]) {
      const zu = modus === "zu";
      const lw = zu ? w / 2 + 0.012 : w / 2 - 0.01;
      const lx = zu ? x + w / 2 : s ? x + w + 0.015 : x - lw - 0.015;
      if (sv && !zu) { g.fillStyle = "rgba(30,26,30,0.3)"; g.fillRect(lx + sv[0], y + sv[1], lw, h); }
      if (zu) { g.fillStyle = "rgba(20,16,14,0.45)"; g.fillRect(lx - 0.012, y, 0.012, h); }
      const cc = hell(c, s ? -0.03 : 0.02);
      g.fillStyle = rgb(cc); g.fillRect(lx, y, lw, h);
      if (F.px > 12) {
        /* Rahmen und Füllungen */
        const rb = 0.05;
        g.fillStyle = rgb(hell(cc, -0.16));
        g.fillRect(lx + rb, y + rb, lw - 2 * rb, h * 0.38 - rb);
        g.fillRect(lx + rb, y + h * 0.38 + rb * 0.6, lw - 2 * rb, h * 0.62 - rb * 1.6);
        g.fillStyle = rgb(hell(cc, 0.06));
        g.fillRect(lx + rb * 1.5, y + rb * 1.5, lw - 3 * rb, h * 0.38 - rb * 2);
        /* untere Füllung: schräge Lamellen */
        const ly0 = y + h * 0.38 + rb * 1.1, lh = h * 0.62 - rb * 2.2;
        g.save(); g.beginPath(); g.rect(lx + rb * 1.5, ly0, lw - 3 * rb, lh); g.clip();
        g.fillStyle = rgb(hell(cc, 0.1));
        for (let yy = ly0; yy < ly0 + lh; yy += 0.045) g.fillRect(lx, yy, lw, 0.022);
        g.fillStyle = rgb(hell(cc, -0.3), 0.6);
        for (let yy = ly0 + 0.022; yy < ly0 + lh; yy += 0.045) g.fillRect(lx, yy, lw, 0.007);
        g.restore();
        flecken(g, lx, y, lw, h, 0.7, 0.2, "dunkel", 61 + s);
        /* Beschläge: Winkelbänder zur Wandseite */
        g.fillStyle = "rgba(30,28,26,0.9)";
        const bs = s && !zu ? lx : lx + lw - 0.14;
        g.fillRect(bs, y + 0.12, 0.14, 0.022); g.fillRect(bs, y + h - 0.14, 0.14, 0.022);
        /* Ladenhalter (Feststeller) */
        if (!zu && F.px > 40 && blick(F).flach > 0.99) { g.fillStyle = "rgba(30,28,26,0.9)"; g.beginPath(); g.arc(s ? lx + lw + 0.035 : lx - 0.035, y + h * 0.7, 0.014, 0, Math.PI * 2); g.fill(); }
      }
    }
  }

  /* ---------------- Blumenkasten ----------------
     Holzkasten auf Konsolen, steht 0,18 vor. Winter: Tannengrün mit
     roten Schleifen und Zapfen, Schnee darauf. Frühling: Geranien mit
     hängendem Efeu. */
  function blumenkasten(g, F, x, y, w, op, V) {
    const t = 0.18, hk = 0.17;
    const r = ST.zufall(ST.textHash(F.name + x.toFixed(2) + "k"));
    const B = blick(F), d = B.tief(-t);
    const kf = op.kastenFarbe || (F.jahr === "winter" ? [46, 70, 52] : hell(V.holz, 0.28));
    /* Pflanzen hinter und über dem Kasten (auf halber Tiefe) */
    const mitte = B.tief(-t * 0.5);
    const winter = F.jahr === "winter";
    const pflanzen = (hinten) => {
      const ox = mitte[0], oy = mitte[1];
      if (winter) {
        const n = Math.round(w * (hinten ? 16 : 10));
        for (let i = 0; i < n; i++) {
          const px = x + 0.03 + r() * (w - 0.06) + ox, py = y + oy - (hinten ? 0.02 : 0.0), l = 0.1 + r() * 0.13, a = -Math.PI / 2 + (r() - 0.5) * 2.3;
          zweig(g, F, px, py, l, a, r);
        }
        if (!hinten) {
          const m = Math.max(1, Math.round(w * 1.4));
          for (let i = 0; i < m; i++) {
            const px = x + (i + 0.5) * w / m + ox, py = y + oy - 0.06;
            schleife(g, px, py, 0.05, F);
            g.fillStyle = "#6b4527"; g.beginPath(); g.ellipse(px + 0.08, py + 0.03, 0.02, 0.032, 0.4, 0, Math.PI * 2); g.fill();
          }
          /* Schnee auf dem Grün */
          g.fillStyle = "rgba(246,249,255,0.95)";
          for (let i = 0; i < w * 9; i++) { g.beginPath(); g.ellipse(x + r() * w + ox, y + oy - 0.1 - r() * 0.07, 0.035 + r() * 0.03, 0.013, (r() - 0.5) * 0.4, 0, Math.PI * 2); g.fill(); }
        }
      } else {
        const n = Math.round(w * (hinten ? 26 : 14));
        for (let i = 0; i < n; i++) {
          const px = x + 0.03 + r() * (w - 0.06) + ox, py = y + oy - r() * 0.16;
          g.fillStyle = rgb(PI.streu([62, 108, 46], r, 0.22));
          g.beginPath(); g.ellipse(px, py, 0.034 + r() * 0.02, 0.026, r() * 3, 0, Math.PI * 2); g.fill();
        }
        if (!hinten) {
          const bl = op.bluete || (V.saat % 3 === 0 ? [224, 60, 110] : [206, 28, 36]);
          for (let i = 0; i < w * 8; i++) {
            const px = x + 0.06 + r() * (w - 0.12) + ox, py = y + oy - 0.1 - r() * 0.13;
            for (let k = 0; k < 6; k++) { g.fillStyle = rgb(hell(bl, (r() - 0.5) * 0.35)); g.beginPath(); g.arc(px + (r() - 0.5) * 0.06, py + (r() - 0.5) * 0.05, 0.016 + r() * 0.01, 0, Math.PI * 2); g.fill(); }
          }
        }
      }
    };
    pflanzen(true);
    const [dx, dy] = vorsprung(g, F, x, y, w, hk, t, kf, {
      schattenK: 0.34,
      vorn: (gg, vx, vy, vw, vh) => {
        const gr = gg.createLinearGradient(0, vy, 0, vy + vh);
        gr.addColorStop(0, rgb(hell(kf, 0.1))); gr.addColorStop(1, rgb(hell(kf, -0.22)));
        gg.fillStyle = gr; gg.fillRect(vx, vy, vw, vh);
        if (F.px > 18) {
          gg.fillStyle = rgb(hell(kf, -0.35), 0.8);
          for (let i = 1; i < 3; i++) gg.fillRect(vx, vy + vh * i / 3, vw, Math.max(0.004, 0.7 / F.px));
          gg.fillStyle = rgb(hell(kf, 0.2)); gg.fillRect(vx, vy, vw, 0.012);
        }
      }
    });
    pflanzen(false);
    /* Winter: Tannengrün hängt 5–8 cm über die Vorderkante */
    if (winter && F.px > 10) {
      const n = Math.round(w * (F.px > 40 ? 16 : 9));
      for (let i = 0; i < n; i++) {
        const px = x + dx + 0.03 + r() * (w - 0.06), py = y + dy + 0.005, a = Math.PI / 2 + (r() - 0.5) * 1.3;
        zweig(g, F, px, py, 0.06 + r() * 0.04, a, r);
      }
    }
    /* Efeu hängt über die Kante (Frühling) */
    if (!winter && F.px > 14) {
      g.strokeStyle = "rgba(52,90,40,0.9)"; g.lineWidth = Math.max(0.004, 0.8 / F.px);
      for (let i = 0; i < w * 3; i++) {
        const sx = x + dx + 0.05 + r() * (w - 0.1), l = 0.12 + r() * 0.2;
        g.beginPath(); g.moveTo(sx, y + dy); g.quadraticCurveTo(sx + (r() - 0.5) * 0.08, y + dy + l * 0.5, sx + (r() - 0.5) * 0.06, y + dy + hk + l); g.stroke();
        g.fillStyle = "rgb(60,104,44)";
        for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(sx + (r() - 0.5) * 0.04, y + dy + 0.05 + k * (hk + l) / 4, 0.018, 0.012, r() * 3, 0, Math.PI * 2); g.fill(); }
      }
    }
    if (winter) schneeKante(g, F, x, y - 0.1, w, t, 0.018);
  }
  /* Was vom echten Blumenkasten auf der Wand zu sehen ist: zwei
     geschmiedete Konsolen und der Schlagschatten des Kastens */
  function kastenAufWand(g, F, x, y, w) {
    const hk = 0.17, t = 0.18, sv = F.schatten(t);
    if (sv) {
      g.fillStyle = "rgba(34,28,30,0.32)";
      vieleck(g, huelle2([[x, y], [x + w, y], [x + w, y + hk], [x, y + hk], [x + sv[0], y + sv[1]], [x + w + sv[0], y + sv[1]], [x + w + sv[0], y + hk + sv[1]], [x + sv[0], y + hk + sv[1]]]));
      g.fill();
    }
    g.fillStyle = "rgba(30,28,26,0.9)";
    for (const kx of [x + 0.1, x + w - 0.13]) { g.beginPath(); g.moveTo(kx, y + hk - 0.01); g.lineTo(kx + 0.03, y + hk - 0.01); g.lineTo(kx + 0.03, y + hk + 0.16); g.lineTo(kx, y + hk + 0.13); g.closePath(); g.fill(); }
  }
  /* Echte Blumenkästen an allen Wänden: Quader + Pflanzenfigur.
     Kritik Runde 2: „grüne Kisten mit weißem Deckel", „große flache
     Bretter, die schräg aus der Wand ragen". Jetzt: Holzkasten mit zwei
     Brettfugen, darüber und davor Tannengrün in zwei Grüntönen mit roten
     Schleifen und Zapfen, Schnee nur als Tupfen auf den Zweigen – im
     Frühling Geranien mit runden Blattpolstern und Dolden. */
  function kaesten(M, V, P, winter) {
    const waende = [
      ["eg-ost", P.egO, [EG_X, EG_YS], [EG_X, EG_YN], N_O, ST_EG], ["eg-nord", P.egN, [EG_X, EG_YN], [-EG_X, EG_YN], N_N, ST_EG], ["eg-west", P.egW, [-EG_X, EG_YN], [-EG_X, EG_YS], N_W, ST_EG],
      ["og-sued", P.ogS, [-OG_X, OG_YS], [OG_X, OG_YS], N_S, ST_OG], ["og-ost", P.ogO, [OG_X, OG_YS], [OG_X, OG_YN], N_O, ST_OG], ["og-nord", P.ogN, [OG_X, OG_YN], [-OG_X, OG_YN], N_N, ST_OG], ["og-west", P.ogW, [-OG_X, OG_YN], [-OG_X, OG_YS], N_W, ST_OG]
    ];
    const kf = winter ? [46, 70, 52] : hell(V.holz, 0.28);
    for (const [name, plan, p0, p1, n, stufe] of waende) {
      const liste = plan.oeff.filter((op) => op.kasten);
      if (!liste.length) continue;
      teil(M, "kaesten-" + name, stufe, n, 0.25);
      const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), u = [(p1[0] - p0[0]) / L, (p1[1] - p0[1]) / L];
      for (const op of liste) {
        const a0 = op.a0 - 0.04, a1 = op.a1 + 0.04, z1 = op.z0 - 0.045, z0 = z1 - 0.17, t0 = 0.005, t1 = 0.185;
        const A = [p0[0] + u[0] * a0 + n[0] * t0, p0[1] + u[1] * a0 + n[1] * t0], B = [p0[0] + u[0] * a1 + n[0] * t1, p0[1] + u[1] * a1 + n[1] * t1];
        const x0 = Math.min(A[0], B[0]), x1 = Math.max(A[0], B[0]), y0 = Math.min(A[1], B[1]), y1 = Math.max(A[1], B[1]);
        const front = kastenFront(kf), seite = kastenFront(hell(kf, -0.04)), oben = kastenOben(winter);
        const m = n === N_S ? { sued: front, ost: seite, west: seite } : n === N_N ? { nord: front, ost: seite, west: seite } : n === N_O ? { ost: front, sued: seite, nord: seite } : { west: front, sued: seite, nord: seite };
        m.oben = oben;
        kasten(M, x0, y0, z0, x1, y1, z1, m);
        const am = (a0 + a1) / 2;
        M.figur({ x: p0[0] + u[0] * am + n[0] * 0.095, y: p0[1] + u[1] * am + n[1] * 0.095, z: z1, breite: a1 - a0 + 0.5, hoehe: 0.45, schatten: false,
          malen: pflanzenMaler(u, n, a1 - a0, winter, ST.textHash(name + op.a0.toFixed(2)) + V.saat, op.bluete || (V.saat % 3 === 0 ? [224, 60, 110] : [206, 28, 36])) });
      }
    }
  }
  function kastenFront(kf) {
    return function (g, F) {
      const gr = g.createLinearGradient(0, 0, 0, F.h);
      gr.addColorStop(0, rgb(hell(kf, 0.12))); gr.addColorStop(0.1, rgb(kf)); gr.addColorStop(1, rgb(hell(kf, -0.2)));
      g.fillStyle = gr; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      if (F.px > 14) {
        flecken(g, 0, 0, F.w, F.h, 0.6, 0.3, "dunkel", 67);
        /* nur zwei Brettfugen, die Deckleiste oben hell */
        g.fillStyle = rgb(hell(kf, -0.4), 0.85);
        for (let i = 1; i < 3; i++) g.fillRect(0, F.h * i / 3 - 0.004, F.w, Math.max(0.005, 0.8 / F.px));
        g.fillStyle = rgb(hell(kf, 0.22)); g.fillRect(0, 0, F.w, Math.max(0.008, 0.9 / F.px));
      }
    };
  }
  function kastenOben(winter) {
    return function (g, F) {
      g.fillStyle = winter ? "rgb(40,54,40)" : "rgb(70,54,40)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      flecken(g, 0, 0, F.w, F.h, 0.4, 0.4, "dunkel", 68);
    };
  }
  /* Pflanzen im Kasten als aufrechte Figur: jeder Zweig, jedes Blatt sitzt
     an einem echten Punkt (a entlang des Kastens, t nach vorn) und wird mit
     dem Drehwinkel projiziert – so stimmen sie in jeder Ansicht. */
  function pflanzenMaler(u, n, w, winter, saat, bluete) {
    return function (g, s, F) {
      if (F.schatten) return;
      const gier = (F.gier || 0) * Math.PI / 180, c = Math.cos(gier), sn = Math.sin(gier);
      const P = (a, t, dz) => { const dx = u[0] * a + n[0] * t, dy = u[1] * a + n[1] * t; const x = dx * c - dy * sn, y = dx * sn + dy * c; return [(x - y) * ST.KX * s, (x + y) * ST.KY * s - dz * ST.KZ * s]; };
      const Zt = F.Z || { amb: [0.64, 0.68, 0.78], sonne: [0.4, 0.36, 0.28] };
      const li = [0, 1, 2].map((i) => Math.min(1, Zt.amb[i] * 0.95 + Zt.sonne[i] * 0.9));
      const col = (cc, a) => "rgba(" + Math.round(cc[0] * li[0]) + "," + Math.round(cc[1] * li[1]) + "," + Math.round(cc[2] * li[2]) + "," + (a == null ? 1 : a) + ")";
      const r = ST.zufall(saat);
      const hw = w / 2 - 0.03;
      g.lineCap = "round"; g.lineJoin = "round";
      if (s < 18) {
        /* weit weg: ein Polster in zwei Tönen */
        const a = P(-hw, 0, 0), b = P(hw, 0, 0), m = P(0, 0.02, 0.12);
        g.fillStyle = col(winter ? [34, 72, 44] : [66, 110, 50]);
        g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(m[0], m[1] - 0.12 * s, b[0], b[1]); g.closePath(); g.fill();
        if (!winter) { g.fillStyle = col(bluete); for (let i = 0; i < 4; i++) { const q = P(-hw + (i + 0.5) * w / 4.2, 0.03, 0.1); g.beginPath(); g.arc(q[0], q[1], Math.max(0.8, 0.04 * s), 0, Math.PI * 2); g.fill(); } }
        return;
      }
      if (winter) {
        /* Tannengrün: Zweige ragen 15–25 cm auf und 5–10 cm vor die Kante */
        const zw = [];
        const nZ = Math.round(w * 26);
        for (let i = 0; i < nZ; i++) {
          const a = -hw + r() * 2 * hw, t = -0.07 + r() * 0.13, vorn = r() < 0.35;
          const l = vorn ? 0.1 + r() * 0.08 : 0.15 + r() * 0.1;
          const e = vorn ? [a + (r() - 0.5) * 0.1, t + 0.1 + r() * 0.05, -0.05 - r() * 0.05] : [a + (r() - 0.5) * 0.16, t + (r() - 0.3) * 0.08, l];
          zw.push({ A: P(a, t, 0.01), E: P(e[0], e[1], e[2]), c: r() < 0.5 ? [34, 72, 44] : [52, 96, 58], hinten: t < 0, schnee: !vorn && r() < 0.45 });
        }
        zw.sort((p, q) => (p.hinten ? 0 : 1) - (q.hinten ? 0 : 1));
        const nad = Math.max(0.8, 0.012 * s);
        for (const Z of zw) {
          const dx = Z.E[0] - Z.A[0], dy = Z.E[1] - Z.A[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
          g.strokeStyle = col(hell(Z.c, -0.25)); g.lineWidth = Math.max(0.7, 0.01 * s);
          g.beginPath(); g.moveTo(Z.A[0], Z.A[1]); g.lineTo(Z.E[0], Z.E[1]); g.stroke();
          /* Nadeln: kurze Striche schräg zum Zweig, zur Spitze kürzer */
          g.strokeStyle = col(Z.c); g.lineWidth = nad;
          g.beginPath();
          const k = Math.max(3, Math.round(L / Math.max(2, 0.025 * s)));
          for (let j = 1; j <= k; j++) {
            const q = j / k, px = Z.A[0] + dx * q, py = Z.A[1] + dy * q, nl = 0.035 * s * (1 - q * 0.5);
            g.moveTo(px, py); g.lineTo(px + (ux * 0.5 - uy) * nl, py + (uy * 0.5 + ux) * nl);
            g.moveTo(px, py); g.lineTo(px + (ux * 0.5 + uy) * nl, py + (uy * 0.5 - ux) * nl);
          }
          g.stroke();
          if (Z.schnee && s > 30) { g.fillStyle = col([246, 249, 255]); g.beginPath(); g.ellipse(Z.A[0] + dx * 0.6, Z.A[1] + dy * 0.6 - nad, 0.025 * s, 0.01 * s, Math.atan2(dy, dx), 0, Math.PI * 2); g.fill(); }
        }
        /* rote Schleifen (6–8 cm) und Zapfen vorn auf der Kante */
        const nS = w > 0.8 ? 3 : 2;
        for (let i = 0; i < nS; i++) {
          const a = -hw + (i + 0.5) * 2 * hw / nS, q = P(a, 0.095, 0.02), sz = 0.035 * s;
          g.fillStyle = col([178, 20, 42]);
          g.beginPath(); g.moveTo(q[0], q[1]); g.bezierCurveTo(q[0] - sz * 1.4, q[1] - sz * 1.1, q[0] - sz * 1.5, q[1] + sz * 0.7, q[0], q[1]); g.fill();
          g.beginPath(); g.moveTo(q[0], q[1]); g.bezierCurveTo(q[0] + sz * 1.4, q[1] - sz * 1.1, q[0] + sz * 1.5, q[1] + sz * 0.7, q[0], q[1]); g.fill();
          g.beginPath(); g.moveTo(q[0] - sz * 0.15, q[1]); g.lineTo(q[0] - sz * 0.6, q[1] + sz * 1.4); g.lineTo(q[0] - sz * 0.2, q[1] + sz * 1.2); g.lineTo(q[0], q[1] + sz * 0.2); g.lineTo(q[0] + sz * 0.2, q[1] + sz * 1.2); g.lineTo(q[0] + sz * 0.6, q[1] + sz * 1.4); g.lineTo(q[0] + sz * 0.15, q[1]); g.fill();
          g.fillStyle = col([220, 60, 76]); g.beginPath(); g.arc(q[0], q[1], sz * 0.3, 0, Math.PI * 2); g.fill();
          const z = P(a + 0.09, 0.1, 0.03);
          g.fillStyle = col([104, 68, 38]); g.beginPath(); g.ellipse(z[0], z[1], 0.018 * s, 0.03 * s, 0.4, 0, Math.PI * 2); g.fill();
          if (s > 60) { g.strokeStyle = col([150, 108, 66], 0.8); g.lineWidth = Math.max(0.5, 0.004 * s); for (let k = -1; k <= 1; k++) { g.beginPath(); g.ellipse(z[0], z[1] + k * 0.012 * s, 0.014 * s, 0.006 * s, 0.4, 0, Math.PI); g.stroke(); } }
        }
      } else {
        /* Geranien. RUNDE 2 (Kritik: „rote Kugeln"): ein gewölbtes Polster
           aus runden, leicht gewellten Blättern (5–8 cm) mit der typischen
           dunklen Zonenzeichnung, darüber lockere Dolden (8 cm) aus vielen
           einzelnen Blütchen – hinten dunkler, vorn heller, dazwischen
           Lücken, dazu hängende Knospen; vorn hängt Efeu über die Kante. */
        const blaetter = [];
        const nB = Math.round(w * 70);
        for (let i = 0; i < nB; i++) {
          const a = -hw + r() * 2 * hw, t = -0.07 + r() * 0.17, bog = 1 - Math.pow(Math.abs(a) / (hw + 0.1), 2);
          const h = 0.02 + r() * 0.1 * bog + 0.05 * bog - Math.max(0, t) * 0.25;
          blaetter.push({ q: P(a, t, h), r: (0.03 + r() * 0.016) * s, c: PI.streu(t < 0 ? [54, 94, 40] : [70, 116, 50], r, 0.14), t: t, dreh: r() * 6.3 });
        }
        blaetter.sort((p, q) => p.t - q.t);
        const welle = (x, y, R, dreh) => {
          g.beginPath();
          for (let k = 0; k <= 10; k++) { const a = dreh + k * 0.628, rr = R * (1 + 0.08 * Math.sin(k * 2.2)); const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr * 0.85; if (k) g.lineTo(px, py); else g.moveTo(px, py); }
          g.closePath();
        };
        for (const B of blaetter) {
          g.fillStyle = col(hell(B.c, -0.22)); welle(B.q[0], B.q[1] + B.r * 0.1, B.r, B.dreh); g.fill();
          g.fillStyle = col(B.c); welle(B.q[0], B.q[1], B.r * 0.96, B.dreh); g.fill();
          if (s > 45) {
            /* Zonenring (typisch für Pelargonien) und helle Mitte */
            g.strokeStyle = col([62, 58, 30], 0.5); g.lineWidth = Math.max(0.5, B.r * 0.2); g.beginPath(); g.arc(B.q[0], B.q[1], B.r * 0.55, 0, Math.PI * 2); g.stroke();
            g.fillStyle = col(hell(B.c, 0.18), 0.6); g.beginPath(); g.arc(B.q[0] - B.r * 0.15, B.q[1] - B.r * 0.2, B.r * 0.28, 0, Math.PI * 2); g.fill();
          }
        }
        /* Efeu über die Vorderkante */
        const nE = Math.round(w * 3);
        for (let i = 0; i < nE; i++) {
          const a = -hw + r() * 2 * hw, l = 0.12 + r() * 0.2, A = P(a, 0.1, 0.01), E = P(a + (r() - 0.5) * 0.08, 0.12, -l);
          g.strokeStyle = col([52, 90, 40]); g.lineWidth = Math.max(0.6, 0.005 * s);
          g.beginPath(); g.moveTo(A[0], A[1]); g.quadraticCurveTo(A[0] + (r() - 0.5) * 0.05 * s, (A[1] + E[1]) / 2, E[0], E[1]); g.stroke();
          g.fillStyle = col([58, 100, 44]);
          for (let k = 1; k <= 4; k++) { const q = k / 4.5; g.beginPath(); g.ellipse(A[0] + (E[0] - A[0]) * q + (r() - 0.5) * 0.02 * s, A[1] + (E[1] - A[1]) * q, 0.016 * s, 0.011 * s, r() * 3, 0, Math.PI * 2); g.fill(); }
        }
        /* Dolden: Stiel, dann Blütchen als kleine Fünfblätter */
        const nD = Math.max(3, Math.round(w * 6));
        const bluetchen = (x, y, R, c) => {
          g.fillStyle = col(c);
          if (R < 1.4) { g.beginPath(); g.arc(x, y, R * 1.3, 0, Math.PI * 2); g.fill(); return; }
          g.beginPath();
          for (let k = 0; k < 5; k++) { const a = k * 1.2566 + x; g.moveTo(x + Math.cos(a) * R * 0.55 + R * 0.5, y + Math.sin(a) * R * 0.55); g.arc(x + Math.cos(a) * R * 0.55, y + Math.sin(a) * R * 0.55, R * 0.5, 0, Math.PI * 2); }
          g.fill();
          g.fillStyle = col(hell(c, 0.3)); g.beginPath(); g.arc(x, y, R * 0.22, 0, Math.PI * 2); g.fill();
        };
        for (let i = 0; i < nD; i++) {
          const a = -hw * 0.9 + (i + 0.2 + r() * 0.6) * 1.8 * hw / nD, t = -0.02 + r() * 0.1, hD = 0.17 + r() * 0.09;
          const st = P(a, t, 0.08), q = P(a + (r() - 0.5) * 0.05, t, hD);
          g.strokeStyle = col([70, 100, 50]); g.lineWidth = Math.max(0.5, 0.005 * s); g.beginPath(); g.moveTo(st[0], st[1]); g.quadraticCurveTo(st[0], (st[1] + q[1]) / 2, q[0], q[1]); g.stroke();
          const R = 0.04 * s, n = 16, rb = Math.max(0.9, 0.009 * s);
          const bl = [];
          for (let k = 0; k < n; k++) { const aa = r() * Math.PI * 2, rr = Math.sqrt(r()) * R * 0.95, hy = Math.sin(aa) * rr * 0.75; bl.push([q[0] + Math.cos(aa) * rr, q[1] + hy - (R - Math.abs(hy)) * 0.25, hy]); }
          bl.sort((p1, p2) => p1[2] - p2[2]);
          for (const [bx, by, hy] of bl) bluetchen(bx, by, rb, hell(bluete, -0.22 + (hy / R + 1) * 0.16 + (r() - 0.5) * 0.08));
          /* eine hängende Knospe */
          if (s > 40 && r() < 0.6) { const kx = q[0] + (r() - 0.5) * R, ky = q[1] + R * 0.9; g.strokeStyle = col([70, 100, 50]); g.lineWidth = Math.max(0.4, 0.003 * s); g.beginPath(); g.moveTo(q[0], q[1]); g.quadraticCurveTo(kx, q[1], kx, ky); g.stroke(); g.fillStyle = col(hell(bluete, -0.35)); g.beginPath(); g.ellipse(kx, ky, rb * 0.6, rb, 0, 0, Math.PI * 2); g.fill(); }
        }
      }
    };
  }
  function zweig(g, F, px, py, l, a, r) {
    g.strokeStyle = rgb(PI.streu([30, 66, 40], r, 0.22)); g.lineWidth = 0.012;
    g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l * 0.75); g.stroke();
    if (F.px < 25) return;
    g.lineWidth = 0.007;
    g.beginPath();
    for (let k = 1; k < 6; k++) {
      const bx = px + Math.cos(a) * l * k / 6, by = py + Math.sin(a) * l * 0.75 * k / 6;
      g.moveTo(bx, by); g.lineTo(bx + Math.cos(a + 0.8) * 0.032, by + Math.sin(a + 0.8) * 0.032);
      g.moveTo(bx, by); g.lineTo(bx + Math.cos(a - 0.8) * 0.032, by + Math.sin(a - 0.8) * 0.032);
    }
    g.stroke();
    /* frische, helle Triebspitzen */
    if (F.px > 40) {
      g.strokeStyle = "rgba(70,120,70,0.9)"; g.lineWidth = 0.008;
      const ex = px + Math.cos(a) * l, ey = py + Math.sin(a) * l * 0.75;
      g.beginPath(); g.moveTo(ex - Math.cos(a) * 0.025, ey - Math.sin(a) * 0.019); g.lineTo(ex, ey); g.stroke();
    }
  }
  function schleife(g, x, y, s, F) {
    g.fillStyle = "#b1142a";
    g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x - s * 1.4, y - s * 1.1, x - s * 1.5, y + s * 0.7, x, y); g.fill();
    g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + s * 1.4, y - s * 1.1, x + s * 1.5, y + s * 0.7, x, y); g.fill();
    g.beginPath(); g.moveTo(x - s * 0.15, y); g.lineTo(x - s * 0.7, y + s * 1.3); g.lineTo(x - s * 0.35, y + s * 1.2); g.lineTo(x, y + s * 0.1); g.lineTo(x + s * 0.35, y + s * 1.2); g.lineTo(x + s * 0.7, y + s * 1.3); g.lineTo(x + s * 0.15, y); g.fill();
    g.fillStyle = "#d8374a"; g.beginPath(); g.arc(x, y, s * 0.28, 0, Math.PI * 2); g.fill();
    if (F.px > 40) { g.fillStyle = "rgba(255,255,255,0.3)"; g.beginPath(); g.ellipse(x - s * 0.7, y - s * 0.35, s * 0.3, s * 0.12, -0.4, 0, Math.PI * 2); g.fill(); }
  }

  /* =====================================================================
     WAND-MALER: Sockel, Putz, Hölzer, Öffnungen, Schmuck – eine Fläche
     ===================================================================== */
  /* plan = { w, h, zOben, sockel: {z1, luecken:[[a0,a1]]}, zonen: [fachwerk…],
              oeff: [...], deko: fn(g,F,V), nacht: fn } */
  function wandMaler(plan, V, o, Z) {
    Z = Z || FERTIG;
    return function (g, F) {
      const zO = plan.zOben;
      const saat = ST.textHash(plan.name) % 97 + 3;
      /* 1) Putzgrund über die ganze Fachwerkzone */
      const zU = plan.sockel ? plan.sockel.z1 : plan.zUnten || 0;
      putzGrund(g, F, -0.05, -0.05, F.w + 0.1, zO - zU + 0.1, V.putz, saat);
      /* Gefache-Töne */
      const r = ST.zufall(saat * 13 + V.saat);
      for (const z of plan.zonen) for (const fe of z.felder) gefachTon(g, F, [fe[0], zO - fe[3], fe[2] - fe[0], fe[3] - fe[1]], V.putz, r);
      /* Brüstungsbohlen mit Fächerrosetten */
      for (const z of plan.zonen) for (const fe of z.felder) if (fe[4] === "rosette") rosette(g, F, fe[0], zO - fe[3], fe[2] - fe[0], fe[3] - fe[1], V);
      /* 2) Hölzer */
      const H = [];
      for (const z of plan.zonen) H.push(...(z.fl || (z.fl = inFlaeche(z.H, zO, saat + z.H.length))));
      hoelzerSchatten(g, F, H);
      /* Reihenfolge: Schwelle/Rähm, Ständer, Riegel, Bänder, Streben (liegen oben) */
      const rang = { schwelle: 0, staender: 1, rahm: 1.5, riegel: 2, band: 3, strebe: 4 };
      const sortiert = H.slice().sort((a, b) => (rang[a.art] - rang[b.art]) || ((a.kreuz || 0) - (b.kreuz || 0)));
      for (const h of sortiert) balkenMalen(g, F, h, V.holz);
      /* Alterung: ausgebesserte Stellen. RUNDE 2 (Kritik: „Linsen mit
         Umrandung, wie ein Aufkleber"): Flicken folgen in echt dem
         Fachwerk – rechteckig, an eine Gefachkante gelehnt (unteres Drittel
         oder eine Ecke), nur 3–4 % heller, ohne Kontur. Der Rand läuft über
         2 cm in drei Stufen aus, innen eine eigene, feinere Kellenstruktur. */
      if (F.px > 12) {
        const fr = ST.zufall(saat * 7 + 1), alle = [];
        for (const z of plan.zonen) for (const fe of z.felder) if (!fe[4] && fe[2] - fe[0] > 0.6 && fe[3] - fe[1] > 0.6) alle.push(fe);
        const n = Math.min(alle.length, 1 + Math.floor(fr() * 2.6));
        for (let i = 0; i < n; i++) {
          const fe = alle.splice(Math.floor(fr() * alle.length), 1)[0], x = fe[0], y = zO - fe[3], w = fe[2] - fe[0], h = fe[3] - fe[1];
          const pw = Math.min(w - 0.04, 0.3 + fr() * 0.3), ph = Math.min(h - 0.04, 0.3 + fr() * 0.3);
          const art = fr();
          /* unteres Drittel über die ganze Breite oder eine Ecke */
          const fx = art < 0.45 ? x : fr() < 0.5 ? x : x + w - pw, fy = art < 0.45 ? y + h * 0.66 : fr() < 0.5 ? y : y + h - ph;
          const fw = art < 0.45 ? w : pw, fh = art < 0.45 ? h * 0.34 : ph;
          for (const [e, a] of [[0.02, 0.06], [0.012, 0.06], [0.004, 0.07]]) {
            g.fillStyle = "rgba(250,250,245," + a + ")"; g.fillRect(fx + e, fy + e, fw - 2 * e, fh - 2 * e);
          }
          g.save(); g.beginPath(); g.rect(fx + 0.02, fy + 0.02, fw - 0.04, fh - 0.04); g.clip();
          flecken(g, fx, fy, fw, fh, 0.25, 0.1, "kelle", saat + i * 7);
          g.restore();
        }
      }
      /* Spritzwassersaum über dem Sockel (auch auf der Schwelle) */
      if (plan.sockel) {
        const y1 = zO - plan.sockel.z1;
        const gr = g.createLinearGradient(0, y1, 0, y1 - 0.45);
        gr.addColorStop(0, "rgba(120,110,90,0.28)"); gr.addColorStop(1, "rgba(120,110,90,0)");
        g.fillStyle = gr; g.fillRect(0, y1 - 0.45, F.w, 0.45);
      }
      /* Nordseite: grünlicher Anflug (Algen), unten stärker */
      if (/nord/.test(plan.name)) {
        g.fillStyle = "rgba(110,125,95,0.12)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
        const gr = g.createLinearGradient(0, F.h, 0, F.h - 1.5);
        gr.addColorStop(0, "rgba(96,116,80,0.16)"); gr.addColorStop(1, "rgba(96,116,80,0)");
        g.fillStyle = gr; g.fillRect(-0.1, F.h - 1.5, F.w + 0.2, 1.5);
      }
      /* 3) Sockel */
      if (plan.sockel) {
        const yS = zO - plan.sockel.z1;
        g.save();
        if (plan.sockel.luecken) {
          g.beginPath(); g.rect(-1, yS - 0.01, F.w + 2, plan.sockel.z1 + 1);
          for (const [a0, a1] of plan.sockel.luecken) { g.rect(a1, yS - 0.02, a0 - a1, plan.sockel.z1 + 1); }
          g.clip("evenodd");
        }
        sockelMalen(g, F, 0, yS, F.w, plan.sockel.z1, saat, {});
        g.restore();
      }
      /* 4) Öffnungen */
      for (const op of plan.oeff) { if ((op.zeit || 0) <= Z.bau) oeffnungMalen(g, F, zO, op, V, o); else lochMalen(g, F, zO, op); }
      /* 5) Schmuck, Schilder, Schatten von Rohren */
      if (plan.deko) plan.deko(g, F, V, zO);
      /* 6) Verwitterung über alles, ganz fein */
      flecken(g, 0, 0, F.w, F.h, 4.2, 0.08, "dunkel", saat + 11);
    };
  }
  /* ---------------- Schneewehe am Sockel ----------------
     RUNDE 2 (Kritik: „weiße Styropor-Sockelleiste mit linealgerader
     Unterkante"): Die Wehe ist jetzt eigene Geometrie – je Wandstück eine
     geneigte Fläche, an der Wand 0,24 m hoch, 0,46 m hinaus bis auf den
     Boden, mit welligem Umriss; an den Hausecken ein Viertelkegel, damit
     sie um die Ecke läuft. Vor Türen und Stufen gefegt (weich auslaufend),
     vor dem Kellerfenster eine Mulde. Licht wie der Bodenschnee (gleiche
     Formel wie boden.js), damit der Übergang unsichtbar bleibt. */
  const WEHE_H = 0.24, WEHE_R = 0.46, WEHE_L = Math.hypot(WEHE_H, WEHE_R);
  function bodenSchnee(F) {
    const n = F.n, up = [0, 0, 1];
    const m = ST.norm([n[0] * 0.45 + up[0] * 0.55, n[1] * 0.45 + up[1] * 0.55, n[2] * 0.45 + up[2] * 0.55]);
    /* Liegt die Wehe auf der Schattenseite des Hauses, fällt der
       Hausschatten auf sie – dieselbe Mischung wie szene.js für den Boden
       (Schattenfarbe 40,62,120), sonst sähe man eine helle Kante */
    const Lh = Math.hypot(ST.LICHT[0], ST.LICHT[1]), nh = Math.hypot(n[0], n[1]) || 1;
    const aus = (n[0] * ST.LICHT[0] + n[1] * ST.LICHT[1]) / (Lh * nh);
    const imSchatten = klemm(0.5 - aus * 2.5, 0, 1);
    const sd = Math.max(0, ST.punkt(m, ST.LICHT)), Z = F.zeit;
    const f = [0.97, 0.99, 1.05], c = [0.93, 0.95, 0.99], sf = [40 / 255, 62 / 255, 120 / 255], a = (Z.schatten || 0.3) * 1.15 * imSchatten;
    return [0, 1, 2].map((i) => c[i] * Math.min(1.05, Z.amb[i] * f[i] + Z.sonne[i] * sd * 1.45) * (1 - a) + sf[i] * a);
  }
  function weheMaler(senken) {
    return function (g, F) {
      const L = bodenSchnee(F), farbe = (k, a) => "rgba(" + L.map((v) => Math.round(Math.min(255, 255 * v * k))).join(",") + "," + (a == null ? 1 : a) + ")";
      g.fillStyle = farbe(1); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      flecken(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, 1.1, 0.18, "blau", 5 + Math.round(F.w * 7));
      /* leicht gewölbt: oben an der Wand die blaugraue Kehle (6–8 cm), in der
         Mitte ein Hauch heller, zum Boden genau Bodenfarbe */
      const gr = g.createLinearGradient(0, 0, 0, F.h);
      gr.addColorStop(0, "rgba(112,130,172,0.5)"); gr.addColorStop(0.14, "rgba(150,166,204,0.18)"); gr.addColorStop(0.3, "rgba(255,255,255,0.12)"); gr.addColorStop(0.7, "rgba(255,255,255,0)");
      g.fillStyle = gr; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      /* außen genau so dunkel wie der Kontaktschatten des Kerns auf dem Boden */
      const gk = g.createLinearGradient(0, WEHE_L * 0.5, 0, WEHE_L * 1.2);
      gk.addColorStop(0, "rgba(40,62,120,0)"); gk.addColorStop(1, "rgba(40,62,120," + (0.1 * (F.zeit.schatten || 0.3) / 0.34).toFixed(3) + ")");
      g.fillStyle = gk; g.fillRect(-0.1, WEHE_L * 0.5, F.w + 0.2, F.h);
      for (const [a, tief] of senken) {
        /* Mulde vor dem Kellerfenster: dunkler, runder Verlauf */
        const rg = g.createRadialGradient(a, 0.02, 0, a, 0.02, 0.45);
        rg.addColorStop(0, "rgba(70,82,116," + (0.45 * tief).toFixed(3) + ")"); rg.addColorStop(0.6, "rgba(110,124,160," + (0.18 * tief).toFixed(3) + ")"); rg.addColorStop(1, "rgba(110,124,160,0)");
        g.fillStyle = rg; g.fillRect(a - 0.5, -0.1, 1, 0.6);
      }
      if (F.px > 12) {
        const r = ST.zufall(ST.textHash(F.name));
        g.fillStyle = farbe(1.12, 0.9); g.beginPath();
        for (let i = 0; i < F.w * F.h * 30; i++) { const q = (0.6 + r() * 0.7) / F.px; g.rect(r() * F.w, r() * F.h, q, q); }
        g.fill();
      }
    };
  }
  /* Wehe einer Wand. frei = [[a0,a1]] (gefegt), keller = [[a0,a1]] */
  function wehe(M, p0, p1, n, frei, keller, saat) {
    const W = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), u = [(p1[0] - p0[0]) / W, (p1[1] - p0[1]) / W, 0];
    const v = ST.norm([n[0] * WEHE_R, n[1] * WEHE_R, -WEHE_H]);
    /* Stücke zwischen den freien Stellen */
    const fr = frei.slice().sort((a, b) => a[0] - b[0]);
    const stuecke = [];
    let a = 0;
    for (const [f0, f1] of fr) { if (f0 > a + 0.6) stuecke.push([a, f0]); a = Math.max(a, f1); }
    if (W > a + 0.6) stuecke.push([a, W]);
    for (const [s0, s1] of stuecke) {
      const L = s1 - s0, nP = Math.max(6, Math.round(L / 0.12));
      const oben = [], unten = [], senken = [];
      for (let i = 0; i <= nP; i++) {
        const x = L * i / nP, aa = s0 + x;
        /* Unterkante: Umriss wellt sich im Grundriss (±10 %), an den
           Hausecken genau auf den Viertelkegel */
        const ecke = Math.min(aa, W - aa);
        const wel = 0.86 + 0.28 * ST.fbm(aa * 0.9 + saat * 0.3, saat * 0.17, 2, saat);
        let yb = WEHE_L * (ecke < 0.4 ? 1 + (wel - 1) * ecke / 0.4 : wel);
        /* Oberkante an der Wand: leicht gewellt (0–7 cm tiefer) */
        let yt = ecke < 0.3 ? 0 : 0.07 * ST.fbm(aa * 2.3 + saat, saat * 0.5 + 3, 2, saat + 1) * klemm((ecke - 0.3) / 0.3, 0, 1);
        /* gefegte Enden: die Wehe läuft auf 0,35 m weich aus */
        const dAnf = s0 > 0.01 ? x : 99, dEnd = s1 < W - 0.01 ? L - x : 99, d = Math.min(dAnf, dEnd);
        if (d < 0.35) { const k = 1 - Math.pow(d / 0.35, 0.7); yt = yt + (yb - 0.03 - yt) * k; }
        /* Mulde vor dem Kellerfenster */
        for (const [k0, k1] of keller) { const m = (k0 + k1) / 2, h = (k1 - k0) / 2 + 0.12, dd = Math.abs(aa - m); if (dd < h + 0.2) yt = Math.max(yt, (0.14 + 0.1 * Math.cos(Math.min(1, dd / (h + 0.2)) * Math.PI / 2)) * WEHE_L); }
        oben.push([x, Math.min(yt, yb - 0.02)]); unten.push([x, yb]);
      }
      for (const [k0, k1] of keller) if ((k0 + k1) / 2 > s0 && (k0 + k1) / 2 < s1) senken.push([(k0 + k1) / 2 - s0, 1]);
      const o = [p0[0] + u[0] * s0 + n[0] * 0.012, p0[1] + u[1] * s0 + n[1] * 0.012, WEHE_H];
      M.flaeche({ name: "wehe-" + saat + "-" + s0.toFixed(1), o: o, u: u, v: v, w: L, h: WEHE_L * 1.3, umriss: oben.concat(unten.reverse()), malen: weheMaler(senken), keinLicht: true, ebene: 1 });
    }
  }
  /* Viertelkegel an einer Hausecke (c = Eckpunkt, nA/nB = Wandnormalen) */
  function weheEcke(M, c, nA, nB) {
    const k = 9, pts = [];
    for (let i = 0; i <= k; i++) { const t = i / k * Math.PI / 2, d = [nA[0] * Math.cos(t) + nB[0] * Math.sin(t), nA[1] * Math.cos(t) + nB[1] * Math.sin(t)]; pts.push([c[0] + d[0] * (WEHE_R + 0.012), c[1] + d[1] * (WEHE_R + 0.012), 0]); }
    const A = [c[0] + (nA[0] + nB[0]) * 0.012, c[1] + (nA[1] + nB[1]) * 0.012, WEHE_H];
    for (let i = 0; i < k; i++) {
      const m = [(pts[i][0] + pts[i + 1][0]) / 2 - c[0], (pts[i][1] + pts[i + 1][1]) / 2 - c[1]];
      polyFlaeche(M, "wehe-ecke" + i, [A, pts[i], pts[i + 1]], [m[0], m[1], 0.6], weheMaler([]), { keinLicht: true });
    }
  }
  function wehen(M, winter) {
    if (!winter) return;
    const X = EG_X, YS = EG_YS, YN = EG_YN;
    /* Teile: die Wandstücke hängen an den Wandteilen (ebene 1 = nach der
       Wand); die Ecken bekommen eigene Teile in Eckrichtung */
    const plan = [
      ["eg-sued", [-X, YS], [X, YS], N_S, [[2.35, 4.05]], []],
      ["eg-ost", [X, YS], [X, YN], N_O, [[0.95, 2.8]], [[5.8, 6.45]]],
      ["eg-nord", [X, YN], [-X, YN], N_N, [[0.5, 2.0]], []],
      ["eg-west", [-X, YN], [-X, YS], N_W, [[4.1, 6.4], [9.2, 10.3]], []]
    ];
    /* Ecke „offen", wenn dort gefegt ist (Tür, Stufen): dann kein Kegel,
       beide Wände laufen an der Ecke weich aus */
    const offen = [];
    for (let i = 0; i < 4; i++) {
      const A = plan[i], B = plan[(i + 1) % 4], WA = Math.hypot(A[2][0] - A[1][0], A[2][1] - A[1][1]);
      const zu = A[4].some(([f0, f1]) => f1 > WA - 0.6) || B[4].some(([f0]) => f0 < 0.6);
      offen.push(zu);
      if (zu) { A[4].push([WA - 0.02, WA + 1]); B[4].push([-1, 0.02]); }
    }
    for (const [name, p0, p1, n, frei, keller] of plan) {
      const t = M.teile.find((tt) => tt.name === name);
      if (!t) continue;
      const alt = M.akt; M.akt = t;
      wehe(M, p0, p1, n, frei, keller, ST.textHash(name) % 97 + 3);
      M.akt = alt;
    }
    [[[X, YS], N_S, N_O, "so"], [[X, YN], N_O, N_N, "no"], [[-X, YN], N_N, N_W, "nw"], [[-X, YS], N_W, N_S, "sw"]].forEach(([c, nA, nB, nm], i) => {
      if (offen[i]) return;
      teil(M, "wehe-" + nm, ST_EG, [(nA[0] + nB[0]) * 0.7, (nA[1] + nB[1]) * 0.7, 0], 0.3);
      weheEcke(M, c, nA, nB);
    });
  }
  /* Öffnung, in der noch kein Fenster/keine Tür sitzt: dunkles Loch mit Laibung */
  function lochMalen(g, F, zO, op) {
    if (op.typ === "keller") return;
    const x = op.a0, w = op.a1 - op.a0, y = zO - op.z1, h = op.z1 - op.z0;
    nische(g, F, x, y, w, h, 0.2, [200, 190, 172], (gg) => {
      const gr = gg.createLinearGradient(0, y, 0, y + h);
      gr.addColorStop(0, "rgb(24,20,18)"); gr.addColorStop(1, "rgb(52,42,34)");
      gg.fillStyle = gr; gg.fillRect(x, y, w, h);
    });
  }
  function oeffnungMalen(g, F, zO, op, V, o) {
    if (op.typ === "fenster") return fensterMalen(g, F, zO, op, V);
    if (op.typ === "schaufenster") return schaufensterMalen(g, F, zO, op, V);
    if (op.typ === "ladentuer") return ladentuerMalen(g, F, zO, op, V);
    if (op.typ === "haustuer") return haustuerMalen(g, F, zO, op, V);
    if (op.typ === "hoftuer") return hoftuerMalen(g, F, zO, op, V);
    if (op.typ === "keller") return kellerMalen(g, F, zO, op, V);
    if (op.typ === "zu") return zugesetztMalen(g, F, zO, op, V);
    if (op.typ === "luke") return lukeMalen(g, F, zO, op, V);
  }
  /* Nachts: Fenster leuchten (nach dem Licht gemalt, deshalb über
     „danach" – so bleibt die Verdeckung richtig) */
  function wandNacht(plan, V, Z) {
    Z = Z || FERTIG;
    return function (g, F) {
      /* Winter: Schneewehe am Sockelfuß (15–30 cm), vor Türen gefegt, am
         Kellerfenster freigehalten. Nach dem Licht gemalt und selbst
         belichtet – sonst färbt der Kontaktschatten der Wand sie grau. */
      if (F.nacht <= 0.01 || !Z.licht) return;
      const zO = plan.zOben;
      for (const op of plan.oeff) {
        if (op.typ === "fenster" && op.licht) fensterLicht(g, F, zO, op, V);
        else if (op.typ === "schaufenster") schaufensterLicht(g, F, zO, op, V);
        else if (op.typ === "ladentuer") ladentuerLicht(g, F, zO, op, V);
      }
      if (plan.nachtDeko) plan.nachtDeko(g, F, V, zO);
    };
  }

  /* ---------------- Fächerrosette auf der Brüstungsbohle ----------------
     Typisch Quedlinburg/Halberstadt: halbrunder Fächer, geschnitzt, die
     Strahlen farbig gefasst. */
  function rosette(g, F, x, y, w, h, V) {
    const c = hell(V.holz, 0.08);
    g.fillStyle = rgb(c); g.fillRect(x, y, w, h);
    if (F.px * h < 4) return;
    const cx = x + w / 2, cy = y + h - 0.02, R = Math.min(w / 2, h) * 0.86;
    const n = 14;
    for (let i = 0; i < n; i++) {
      const a0 = Math.PI + Math.PI * i / n, a1 = Math.PI + Math.PI * (i + 1) / n;
      g.fillStyle = i % 2 ? rgb(hell(c, -0.22)) : rgb(misch(c, [176, 132, 58], 0.35));
      g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, R, a0, a1); g.closePath(); g.fill();
    }
    g.strokeStyle = rgb(hell(c, -0.45)); g.lineWidth = Math.max(0.006, 0.9 / F.px);
    g.beginPath(); g.arc(cx, cy, R, Math.PI, 0); g.stroke();
    g.beginPath(); g.arc(cx, cy, R * 1.12, Math.PI, 0); g.stroke();
    if (F.px > 30) {
      /* Taustab außen herum */
      g.fillStyle = rgb(hell(c, 0.15));
      for (let i = 0; i < 20; i++) { const a = Math.PI + Math.PI * (i + 0.5) / 20; g.beginPath(); g.ellipse(cx + Math.cos(a) * R * 1.06, cy + Math.sin(a) * R * 1.06, 0.012, 0.006, a + 0.8, 0, Math.PI * 2); g.fill(); }
    }
    g.fillStyle = rgb(hell(c, -0.4)); g.beginPath(); g.arc(cx, cy, R * 0.18, Math.PI, 0); g.fill();
    flecken(g, x, y, w, h, 0.8, 0.18, "dunkel", 71);
  }

  /* ---------------- Fensterlicht (Nacht) ---------------- */
  function fensterLicht(g, F, zO, op, V) {
    const x = op.a0, w = op.a1 - op.a0, y = zO - op.z1, h = op.z1 - op.z0;
    const B = blick(F), [dx, dy] = B.tief(op.tiefe || 0.1);
    const a = F.nacht * (op.licht || 1);
    const rb = Math.min(0.065, w * 0.08);
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.translate(dx, dy);
    const gx = x + rb, gy = y + rb, gw = w - 2 * rb, gh = h - 2 * rb;
    const warm = op.farbe || [255, 190, 110];
    /* RUNDE 2: Fenster mit Stern, Schwibbogen oder Kerze leuchten immer –
       aber das Raumlicht dahinter ist auf ein Drittel gedämpft, damit der
       Schmuck die hellste Form bleibt (vorher ging der Stern im gelben
       Fenster unter). */
    const deko = F.jahr === "winter" && (op.stern || op.bogen || op.kerze);
    const ar = a * (deko ? 0.3 : 1);
    const gr = g.createRadialGradient(gx + gw / 2, gy + gh * 0.7, gw * 0.1, gx + gw / 2, gy + gh * 0.55, Math.max(gw, gh) * 0.9);
    gr.addColorStop(0, "rgba(255,226,160," + ar + ")"); gr.addColorStop(0.55, "rgba(" + warm.join(",") + "," + (0.92 * ar) + ")"); gr.addColorStop(1, "rgba(" + warm.map((v) => v * 0.55 | 0).join(",") + "," + (0.9 * ar) + ")");
    g.fillStyle = gr; g.fillRect(gx, gy, gw, gh);
    /* Gardine im Gegenlicht */
    g.fillStyle = "rgba(255,244,220," + (0.35 * ar) + ")"; g.fillRect(gx, gy + gh * 0.52, gw, gh * 0.48);
    g.fillStyle = "rgba(140,70,30," + (0.3 * ar) + ")"; g.fillRect(gx, gy, gw * 0.14, gh); g.fillRect(gx + gw * 0.86, gy, gw * 0.14, gh);
    /* Weihnachtsschmuck im Fenster */
    if (deko) {
      if (op.stern) { const R = Math.min(0.33, gw * 0.45); herrnhuter(g, F, gx + gw / 2, gy + gh * 0.4, R, F.nacht); F.leuchtPunkt(gx + gw / 2 + dx, gy + gh * 0.4 + dy, 0.8, "255,236,190", 0.9); }
      if (op.bogen) { schwibbogen(g, F, gx + gw * 0.06, gy + gh, gw * 0.88, gh * 0.5, F.nacht); F.leuchtPunkt(gx + gw / 2 + dx, gy + gh * 0.75 + dy, 0.6, "255,214,150", 0.55, true); }
      else if (op.kerze) { kerze(g, gx + gw / 2, gy + gh - 0.02, Math.min(0.16, gh * 0.4), F.nacht); F.leuchtPunkt(gx + gw / 2 + dx, gy + gh * 0.6 + dy, 0.45, "255,200,120", 0.55, true); }
    }
    /* Sprossen dunkel davor */
    g.fillStyle = "rgba(46,34,26," + (0.92 * a) + ")";
    const fl = op.fl || 2, [spS, spZ] = op.sp || [1, 2], sb = Math.max(0.022, 1.1 / F.px);
    for (let i = 1; i < fl; i++) g.fillRect(x + w * i / fl - rb * 0.45, y, rb * 0.9, h);
    const kae = op.kaempfer !== false && h > w * 1.1 ? y + h * 0.3 : null;
    if (kae) g.fillRect(x, kae - rb * 0.5, w, rb);
    const u0 = kae || y;
    for (let i = 0; i < fl; i++) {
      const fx = x + rb + (w - 2 * rb) * i / fl, fw = (w - 2 * rb) / fl;
      for (let k = 1; k < spS; k++) g.fillRect(fx + fw * k / spS - sb / 2, u0, sb, y + h - u0);
      for (let k = 1; k < spZ; k++) g.fillRect(fx, u0 + (y + h - u0) * k / spZ - sb / 2, fw, sb);
    }
    g.restore();
    F.leuchtPunkt(x + w / 2, y + h * 0.55, Math.max(w, h) * 1.25, "255,190,110", 0.5 * (op.licht || 1) * (deko ? 0.4 : 1));
  }
  /* Herrnhuter Stern: 18 vierkantige und 8 dreikantige Zacken um eine
     Kugel. Gezeichnet als räumlicher Stern: die Zacken, die zur Seite
     zeigen, sind lang, die zum Betrachter hin kurz (verkürzt), hintere
     dunkler. RUNDE 1: Durchmesser 0,55–0,7 m statt 0,4 m, mittig im
     Fenster hängend; bei Tag ein weiß-roter Papierstern, nachts leuchtend. */
  function herrnhuter(g, F, cx, cy, R, a, tag) {
    const rot = [196, 34, 46], weiss = [250, 246, 236];
    if (!tag) {
      const gg = g.createRadialGradient(cx, cy, 0, cx, cy, R * 2.4);
      gg.addColorStop(0, "rgba(255,240,190," + (0.5 * a) + ")"); gg.addColorStop(1, "rgba(255,200,120,0)");
      g.fillStyle = gg; g.beginPath(); g.arc(cx, cy, R * 2.4, 0, Math.PI * 2); g.fill();
    }
    g.strokeStyle = "rgba(60,40,30," + (0.8 * a) + ")"; g.lineWidth = 0.008; g.beginPath(); g.moveTo(cx, cy - R * 0.5); g.lineTo(cx, cy - R * 2.6); g.stroke();
    /* Richtungen: gleichmäßig auf der Kugel verteilt (Fibonacci), projiziert */
    const zacken = [];
    const N = 26;
    for (let i = 0; i < N; i++) {
      const zz = 1 - 2 * (i + 0.5) / N, rr = Math.sqrt(1 - zz * zz), ph = i * 2.39996 + 0.3;
      zacken.push({ x: Math.cos(ph) * rr, y: zz * 0.95, z: Math.sin(ph) * rr, drei: i % 13 === 3 || i % 13 === 9 || i % 13 === 11 || i === 0 || i === N - 1 || i === 7 || i === 18 || i === 22 });
    }
    zacken.sort((p, q) => p.z - q.z);
    for (const Zk of zacken) {
      const L = R * (0.35 + 0.65 * Math.hypot(Zk.x, Zk.y)), px = cx + Zk.x * R, py = cy + Zk.y * R;
      const hin = Zk.z > 0 ? 1 : 0.62;
      const basis = R * (Zk.drei ? 0.2 : 0.24), ang = Math.atan2(Zk.y, Zk.x);
      const c = tag ? (zacken.indexOf(Zk) % 2 ? rot : weiss) : [255, 236, 190];
      let farbe;
      if (tag) farbe = rgb(hell(c, (hin - 1) * 0.6));
      else farbe = "rgba(" + [255, Math.round(236 * (0.86 + 0.14 * hin)), Math.round(190 * (0.78 + 0.22 * hin))].join(",") + "," + a + ")";
      g.fillStyle = farbe;
      g.beginPath();
      g.moveTo(cx + Math.cos(ang + 1.2) * basis, cy + Math.sin(ang + 1.2) * basis);
      g.lineTo(cx + Math.cos(ang) * (L + basis * 0.2), cy + Math.sin(ang) * (L + basis * 0.2));
      g.lineTo(cx + Math.cos(ang - 1.2) * basis, cy + Math.sin(ang - 1.2) * basis);
      if (!Zk.drei) g.lineTo(cx - Math.cos(ang) * basis * 0.3, cy - Math.sin(ang) * basis * 0.3);
      g.closePath(); g.fill();
      if (F.px > 60) { g.strokeStyle = tag ? "rgba(60,30,30,0.35)" : "rgba(200,120,50," + (0.5 * a) + ")"; g.lineWidth = Math.max(0.002, 0.5 / F.px); g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(ang) * L, cy + Math.sin(ang) * L); g.stroke(); }
      void px; void py;
    }
    g.fillStyle = tag ? "rgb(240,232,214)" : "rgba(255,250,232," + a + ")"; g.beginPath(); g.arc(cx, cy, R * 0.22, 0, Math.PI * 2); g.fill();
  }
  function schwibbogen(g, F, x, yUnten, w, h, a) {
    /* Erzgebirgischer Schwibbogen: dunkle Bogensilhouette vor dem gedämpften
       Raumlicht, darin Bergmann und Engel, obenauf sieben Kerzen – jede ein
       heller Punkt mit eigenem kleinen Schein */
    const cx = x + w / 2, b = Math.max(0.02, w * 0.06);
    g.fillStyle = "rgba(28,20,15," + (0.96 * a) + ")";
    g.beginPath(); g.moveTo(x, yUnten); g.lineTo(x, yUnten - h * 0.45); g.quadraticCurveTo(cx, yUnten - h * 1.35, x + w, yUnten - h * 0.45); g.lineTo(x + w, yUnten);
    g.lineTo(x + w - b, yUnten); g.lineTo(x + w - b, yUnten - h * 0.42); g.quadraticCurveTo(cx, yUnten - h * 1.2, x + b, yUnten - h * 0.42); g.lineTo(x + b, yUnten); g.closePath(); g.fill();
    g.fillRect(x - 0.01, yUnten - 0.035, w + 0.02, 0.035);
    /* Figuren im Bogen: Bergmann mit Lampe, Engel mit Flügeln, zwei Tännchen */
    g.beginPath(); g.moveTo(cx - w * 0.3, yUnten - 0.03); g.lineTo(cx - w * 0.25, yUnten - h * 0.38); g.lineTo(cx - w * 0.2, yUnten - 0.03); g.fill();
    g.beginPath(); g.moveTo(cx + w * 0.2, yUnten - 0.03); g.lineTo(cx + w * 0.25, yUnten - h * 0.38); g.lineTo(cx + w * 0.3, yUnten - 0.03); g.fill();
    g.beginPath(); g.arc(cx - w * 0.06, yUnten - h * 0.36, h * 0.07, 0, Math.PI * 2); g.fill(); g.fillRect(cx - w * 0.09, yUnten - h * 0.3, w * 0.06, h * 0.27);
    g.beginPath(); g.arc(cx + w * 0.07, yUnten - h * 0.36, h * 0.07, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.moveTo(cx + w * 0.07, yUnten - 0.03); g.lineTo(cx + w * 0.02, yUnten - h * 0.3); g.lineTo(cx + w * 0.12, yUnten - h * 0.3); g.closePath(); g.fill();
    for (let i = 0; i < 7; i++) {
      const t = (i + 0.5) / 7, px = x + w * t;
      const py = yUnten - h * 0.45 - Math.sin(t * Math.PI) * h * 0.58;
      kerze(g, px, py, Math.max(0.03, h * 0.14), a);
    }
  }
  function kerze(g, x, y, l, a) {
    g.fillStyle = "rgba(245,240,225," + a + ")"; g.fillRect(x - l * 0.12, y - l, l * 0.24, l);
    const gr = g.createRadialGradient(x, y - l * 1.3, 0, x, y - l * 1.3, l * 1.4);
    gr.addColorStop(0, "rgba(255,250,220," + a + ")"); gr.addColorStop(0.22, "rgba(255,206,110," + (0.75 * a) + ")"); gr.addColorStop(1, "rgba(255,160,60,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(x, y - l * 1.3, l * 1.4, 0, Math.PI * 2); g.fill();
    g.fillStyle = "rgba(255,255,230," + a + ")"; g.beginPath(); g.ellipse(x, y - l * 1.25, l * 0.08, l * 0.22, 0, 0, Math.PI * 2); g.fill();
  }

  /* ---------------- Schaufenster ----------------
     Großes Fenster mit Sprossen und Oberlicht, auf einer Brüstung aus
     Sandstein, dahinter die Auslage (je nach Geschäft). */
  function schaufensterMalen(g, F, zO, op, V) {
    const x = op.a0, w = op.a1 - op.a0, y = zO - op.z1, h = op.z1 - op.z0;
    const r = ST.zufall(ST.textHash(F.name + "sf" + op.a0.toFixed(2)) + V.saat);
    nische(g, F, x, y, w, h, 0.12, [206, 196, 176], (gg) => {
      const rc = hell(V.tuer, 0.05), rb = 0.07;
      const kae = y + h * 0.24, n = Math.max(2, Math.round(w / 0.42));
      /* Scheiben: Oberlichter über dem Kämpfer, drei große darunter */
      const sch = [];
      for (let i = 0; i < n; i++) sch.push([x + rb + (w - 2 * rb) * i / n, y + rb, (w - 2 * rb) / n, kae - y - rb]);
      for (let i = 0; i < 3; i++) sch.push([x + rb + (w - 2 * rb) * i / 3, kae, (w - 2 * rb) / 3, y + h - rb * 1.4 - kae]);
      /* RUNDE 1: Die Spiegelung deckt am Tag nur gut ein Drittel – man sieht
         in den Laden hinein und auf die Auslage */
      glas(gg, F, x + rb, y + rb, w - 2 * rb, h - 2 * rb, r, {
        spiegel: 0.34, scheiben: sch, glanz: true,
        innen: (g2, gx, gy, gw, gh) => {
          /* Ladenraum: auch am Tag warm beleuchtet, hinten Regale */
          const gr = g2.createLinearGradient(0, gy, 0, gy + gh);
          gr.addColorStop(0, "rgb(92,70,50)"); gr.addColorStop(1, "rgb(60,44,32)");
          g2.fillStyle = gr; g2.fillRect(gx, gy, gw, gh);
          g2.fillStyle = "rgba(40,28,20,0.6)";
          for (let k = 1; k < 4; k++) g2.fillRect(gx, gy + gh * (0.12 + k * 0.14), gw, 0.02);
          auslage(g2, F, gx, gy, gw, gh, V, r, false);
        }
      });
      rahmenHolz(gg, x, kae - 0.03, w, 0.06, rc, F, false);
      for (let i = 1; i < n; i++) rahmenHolz(gg, x + w * i / n - 0.018, y, 0.036, kae - y, rc, F, true);
      for (let i = 1; i < 3; i++) rahmenHolz(gg, x + w * i / 3 - 0.028, kae, 0.056, h - (kae - y), rc, F, true);
      rahmenHolz(gg, x, y, w, rb, rc, F, false); rahmenHolz(gg, x, y + h - rb * 1.4, w, rb * 1.4, rc, F, false);
      rahmenHolz(gg, x, y, rb, h, rc, F, true); rahmenHolz(gg, x + w - rb, y, rb, h, rc, F, true);
      if (F.px > 30) {
        /* Goldschrift auf dem Glas */
        gg.fillStyle = "rgba(214,178,92,0.9)"; gg.font = "italic bold 0.085px 'DejaVu Serif', serif"; gg.textAlign = "center"; gg.textBaseline = "middle";
        gg.fillText(op.glasText || "", x + w / 2, kae + (h - (kae - y)) * 0.14);
      }
    });
    /* Brüstung aus Sandstein unter dem Schaufenster */
    const by = y + h;
    vorsprung(g, F, x - 0.06, by, w + 0.12, 0.07, 0.08, [196, 182, 156], {});
    if (F.jahr === "winter") schneeKante(g, F, x - 0.06, by, w + 0.12, 0.08, 0.04);
  }
  function schaufensterLicht(g, F, zO, op, V) {
    const x = op.a0, w = op.a1 - op.a0, y = zO - op.z1, h = op.z1 - op.z0;
    const r = ST.zufall(ST.textHash(F.name + "sf" + op.a0.toFixed(2)) + V.saat);
    const B = blick(F), [dx, dy] = B.tief(0.12);
    const a = F.nacht;
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.translate(dx, dy);
    const rb = 0.07, gx = x + rb, gy = y + rb, gw = w - 2 * rb, gh = h - 2 * rb;
    const gr = g.createLinearGradient(0, gy, 0, gy + gh);
    gr.addColorStop(0, "rgba(255,214,150," + (0.95 * a) + ")"); gr.addColorStop(0.6, "rgba(255,190,110," + (0.95 * a) + ")"); gr.addColorStop(1, "rgba(200,120,60," + (0.95 * a) + ")");
    g.fillStyle = gr; g.fillRect(gx, gy, gw, gh);
    /* Hängelampen */
    for (let i = 0; i < 2; i++) {
      const lx = gx + gw * (0.28 + i * 0.44), ly = gy + gh * 0.16;
      const gg = g.createRadialGradient(lx, ly, 0, lx, ly, gw * 0.3);
      gg.addColorStop(0, "rgba(255,248,220," + a + ")"); gg.addColorStop(1, "rgba(255,220,150,0)");
      g.fillStyle = gg; g.fillRect(lx - gw * 0.3, ly - gw * 0.3, gw * 0.6, gw * 0.6);
    }
    g.globalAlpha = a;
    auslage(g, F, gx, gy, gw, gh, V, r, true);
    g.globalAlpha = 1;
    /* Sprossen im Gegenlicht */
    g.fillStyle = "rgba(40,30,24," + (0.9 * a) + ")";
    const kae = y + h * 0.24;
    g.fillRect(x, kae - 0.03, w, 0.06);
    const n = Math.max(2, Math.round(w / 0.42));
    for (let i = 1; i < n; i++) g.fillRect(x + w * i / n - 0.018, y, 0.036, kae - y);
    for (let i = 1; i < 3; i++) g.fillRect(x + w * i / 3 - 0.028, kae, 0.056, h);
    if (F.px > 30) { g.fillStyle = "rgba(255,226,140," + a + ")"; g.font = "italic bold 0.085px 'DejaVu Serif', serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(op.glasText || "", x + w / 2, kae + (h - (kae - y)) * 0.18); }
    g.restore();
    F.leuchtPunkt(x + w / 2, y + h * 0.6, w * 1.1, "255,196,120", 0.8);
  }
  /* Auslage je nach Geschäft. RUNDE 1: Stufenpodest mit rotem Samt, im
     Winter Watte auf der Fensterbank, oben ein Tannenzweig mit Kugeln und
     eine kleine Weihnachtspyramide oder ein Nussknacker. Uhrmacher:
     Standuhr, Kuckucksuhr, Wanduhren, Taschenuhren auf Kissen. */
  function auslage(g, F, x, y, w, h, V, r0, nacht) {
    const r = ST.zufall(V.saat * 3 + Math.round(x * 100));
    const art = V.geschaeft.art, winter = F.jahr === "winter";
    const boden = y + h;
    const samt = [110, 30, 40];
    /* Stufenpodest mit Samt */
    const stufe = (sx, sy, sw, sh) => {
      const gr = g.createLinearGradient(0, sy, 0, sy + sh);
      gr.addColorStop(0, rgb(hell(samt, 0.25))); gr.addColorStop(0.2, rgb(samt)); gr.addColorStop(1, rgb(hell(samt, -0.35)));
      g.fillStyle = gr; g.fillRect(sx, sy, sw, sh);
      if (F.px > 30) { g.fillStyle = "rgba(255,210,210,0.18)"; for (let i = 0; i < 6; i++) g.fillRect(sx + r() * sw, sy + 0.01, 0.06, 0.008); }
    };
    stufe(x, boden - h * 0.1, w, h * 0.1);
    stufe(x + w * 0.12, boden - h * 0.2, w * 0.76, h * 0.1);
    if (F.px < 12) return;
    const ebenen = [boden - h * 0.1, boden - h * 0.2];
    if (art === "baecker") {
      for (const [ei, ey] of ebenen.entries()) {
        const n = Math.round(w / 0.16);
        for (let i = 0; i < n; i++) {
          const px = x + w * (0.08 + ei * 0.12) + i * (w * (0.84 - ei * 0.24)) / n, k = r();
          if (k < 0.4) { /* Brotlaib */
            g.fillStyle = rgb(hell([176, 112, 54], (r() - 0.5) * 0.2)); g.beginPath(); g.ellipse(px + 0.06, ey - 0.001, 0.07, 0.05, 0, Math.PI, 0); g.fill();
            g.strokeStyle = "rgba(240,210,160,0.7)"; g.lineWidth = 0.008; g.beginPath(); g.moveTo(px + 0.02, ey - 0.02); g.lineTo(px + 0.05, ey - 0.035); g.moveTo(px + 0.06, ey - 0.02); g.lineTo(px + 0.09, ey - 0.035); g.stroke();
          } else if (k < 0.7) { /* Brezel */
            g.strokeStyle = "rgb(150,84,36)"; g.lineWidth = 0.018;
            g.beginPath(); g.ellipse(px + 0.04, ey - 0.04, 0.035, 0.03, 0, 0, Math.PI * 2); g.stroke();
            g.beginPath(); g.ellipse(px + 0.09, ey - 0.04, 0.035, 0.03, 0, 0, Math.PI * 2); g.stroke();
          } else { /* Stollen mit Puderzucker */
            g.fillStyle = "rgb(232,226,214)"; rrect(g, px, ey - 0.05, 0.13, 0.05, 0.02); g.fill();
          }
        }
      }
      /* Etagere mit Plätzchen */
      const ex = x + w * 0.82, ey = ebenen[1];
      g.fillStyle = "rgb(214,210,200)";
      for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(ex, ey - 0.08 - k * 0.12, 0.11 - k * 0.03, 0.018, 0, 0, Math.PI * 2); g.fill(); g.fillRect(ex - 0.006, ey - 0.08 - k * 0.12, 0.012, 0.12); }
      for (let k = 0; k < 9; k++) { g.fillStyle = r() < 0.5 ? "rgb(170,110,60)" : "rgb(120,70,40)"; g.beginPath(); g.arc(ex + (r() - 0.5) * 0.16, ey - 0.095 - Math.floor(k / 3) * 0.12, 0.014, 0, Math.PI * 2); g.fill(); }
      /* Lebkuchenherzen an Bändern */
      if (winter) for (let i = 0; i < 3; i++) {
        const hx = x + w * (0.2 + i * 0.3), hy = y + h * (0.38 + (i % 2) * 0.08);
        g.strokeStyle = "rgba(180,20,40,0.9)"; g.lineWidth = 0.006; g.beginPath(); g.moveTo(hx, y); g.lineTo(hx, hy - 0.05); g.stroke();
        g.fillStyle = "rgb(140,74,40)"; g.beginPath(); g.moveTo(hx, hy + 0.06); g.bezierCurveTo(hx - 0.09, hy, hx - 0.05, hy - 0.07, hx, hy - 0.03); g.bezierCurveTo(hx + 0.05, hy - 0.07, hx + 0.09, hy, hx, hy + 0.06); g.fill();
        g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 0.005; g.stroke();
      }
    } else if (art === "buch") {
      for (const ey of ebenen) {
        let px = x + w * 0.06;
        while (px < x + w * 0.66) {
          const bw = 0.025 + r() * 0.03, bh = 0.12 + r() * 0.1;
          g.fillStyle = rgb([[120, 30, 30], [40, 60, 90], [60, 80, 50], [140, 110, 60], [80, 50, 30]][Math.floor(r() * 5)]);
          g.fillRect(px, ey - bh, bw, bh);
          g.fillStyle = "rgba(220,190,110,0.8)"; g.fillRect(px, ey - bh * 0.8, bw, 0.008);
          px += bw + 0.004;
          if (r() < 0.15) px += 0.06;
        }
      }
      /* aufgeschlagenes Buch auf dem Lesepult, daneben ein Globus */
      const bx = x + w * 0.72, by = ebenen[1];
      g.fillStyle = "rgb(70,46,30)"; g.fillRect(bx + 0.06, by - 0.12, 0.02, 0.12);
      g.fillStyle = "rgb(240,232,212)"; g.beginPath(); g.moveTo(bx - 0.04, by - 0.2); g.quadraticCurveTo(bx + 0.07, by - 0.24, bx + 0.07, by - 0.15); g.quadraticCurveTo(bx + 0.07, by - 0.24, bx + 0.18, by - 0.2); g.lineTo(bx + 0.18, by - 0.12); g.quadraticCurveTo(bx + 0.07, by - 0.16, bx + 0.07, by - 0.1); g.quadraticCurveTo(bx + 0.07, by - 0.16, bx - 0.04, by - 0.12); g.closePath(); g.fill();
      g.fillStyle = "rgb(60,96,120)"; g.beginPath(); g.arc(x + w * 0.92, ebenen[0] - 0.12, 0.07, 0, Math.PI * 2); g.fill();
      g.fillStyle = "rgb(150,130,80)"; g.beginPath(); g.ellipse(x + w * 0.9, ebenen[0] - 0.14, 0.03, 0.02, 0.4, 0, Math.PI * 2); g.fill();
    } else {
      /* Uhrmacher: Wanduhren an der Rückwand */
      for (let i = 0; i < 3; i++) {
        const ux = x + w * (0.14 + i * 0.2), uy = y + h * (0.3 + (i % 2) * 0.1), ur = 0.055 + r() * 0.025;
        g.fillStyle = "rgb(110,70,40)"; g.beginPath(); g.arc(ux, uy, ur * 1.25, 0, Math.PI * 2); g.fill();
        g.fillStyle = "rgb(240,232,210)"; g.beginPath(); g.arc(ux, uy, ur, 0, Math.PI * 2); g.fill();
        g.strokeStyle = "#222"; g.lineWidth = 0.008; g.beginPath(); g.moveTo(ux, uy); g.lineTo(ux, uy - ur * 0.7); g.moveTo(ux, uy); g.lineTo(ux + ur * 0.5, uy + ur * 0.2); g.stroke();
      }
      /* Kuckucksuhr: Häuschen mit Dach, Zifferblatt, Zapfen an Ketten */
      {
        const kx = x + w * 0.62, ky = y + h * 0.3;
        g.fillStyle = "rgb(84,54,32)"; g.fillRect(kx - 0.08, ky - 0.05, 0.16, 0.16);
        g.beginPath(); g.moveTo(kx - 0.12, ky - 0.04); g.lineTo(kx, ky - 0.14); g.lineTo(kx + 0.12, ky - 0.04); g.closePath(); g.fill();
        g.fillStyle = "rgb(230,220,196)"; g.beginPath(); g.arc(kx, ky + 0.04, 0.04, 0, Math.PI * 2); g.fill();
        g.strokeStyle = "rgba(190,160,90,0.9)"; g.lineWidth = 0.005; g.beginPath(); g.moveTo(kx - 0.03, ky + 0.11); g.lineTo(kx - 0.03, ky + 0.34); g.moveTo(kx + 0.03, ky + 0.11); g.lineTo(kx + 0.03, ky + 0.28); g.stroke();
        g.fillStyle = "rgb(110,74,40)"; g.beginPath(); g.ellipse(kx - 0.03, ky + 0.37, 0.014, 0.035, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(kx + 0.03, ky + 0.31, 0.014, 0.035, 0, 0, Math.PI * 2); g.fill();
      }
      /* Standuhr rechts */
      g.fillStyle = "rgb(90,56,32)"; g.fillRect(x + w * 0.8, boden - h * 0.82, w * 0.12, h * 0.72);
      g.fillStyle = "rgb(120,80,46)"; g.fillRect(x + w * 0.81, boden - h * 0.84, w * 0.1, h * 0.04);
      g.fillStyle = "rgb(236,228,206)"; g.beginPath(); g.arc(x + w * 0.86, boden - h * 0.7, w * 0.04, 0, Math.PI * 2); g.fill();
      g.fillStyle = "rgba(200,170,90,0.9)"; g.beginPath(); g.arc(x + w * 0.86, boden - h * 0.42, w * 0.022, 0, Math.PI * 2); g.fill();
      /* Taschenuhren auf Kissen */
      for (let i = 0; i < 3; i++) {
        const tx = x + w * (0.22 + i * 0.16), ty = ebenen[1] - 0.02;
        g.fillStyle = rgb(hell(samt, 0.15)); rrect(g, tx - 0.05, ty - 0.025, 0.1, 0.035, 0.012); g.fill();
        g.fillStyle = i === 1 ? "rgb(200,200,196)" : "rgb(214,178,92)"; g.beginPath(); g.arc(tx, ty - 0.04, 0.026, 0, Math.PI * 2); g.fill();
        g.fillStyle = "rgb(244,238,222)"; g.beginPath(); g.arc(tx, ty - 0.04, 0.018, 0, Math.PI * 2); g.fill();
      }
    }
    if (winter) {
      /* Tannenzweig mit Kugeln oben quer */
      g.strokeStyle = "rgb(40,76,48)"; g.lineWidth = 0.012;
      for (let i = 0; i < w * 30; i++) { const px = x + r() * w, py = y + 0.03 + Math.sin((px - x) / w * Math.PI) * 0.06, a = r() * Math.PI * 2; g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(a) * 0.05, py + Math.sin(a) * 0.03); g.stroke(); }
      for (let i = 0; i < 5; i++) { const px = x + w * (0.1 + i * 0.2), py = y + 0.07 + Math.sin((i * 0.2 + 0.1) * Math.PI) * 0.06; g.fillStyle = i % 2 ? "rgb(200,30,40)" : "rgb(214,178,70)"; g.beginPath(); g.arc(px, py + 0.03, 0.022, 0, Math.PI * 2); g.fill(); g.fillStyle = "rgba(255,255,255,0.6)"; g.beginPath(); g.arc(px - 0.007, py + 0.022, 0.006, 0, Math.PI * 2); g.fill(); }
      /* kleine Weihnachtspyramide oder Nussknacker */
      const px = x + w * (art === "buch" ? 0.52 : 0.4), py = ebenen[1];
      if (art === "buch") {
        g.fillStyle = "rgb(170,30,36)"; g.fillRect(px - 0.03, py - 0.2, 0.06, 0.1);
        g.fillStyle = "rgb(30,40,90)"; g.fillRect(px - 0.03, py - 0.1, 0.06, 0.1);
        g.fillStyle = "rgb(236,206,170)"; g.beginPath(); g.arc(px, py - 0.235, 0.028, 0, Math.PI * 2); g.fill();
        g.fillStyle = "rgb(30,30,36)"; g.fillRect(px - 0.03, py - 0.3, 0.06, 0.05);
        g.fillStyle = "rgb(214,178,70)"; g.fillRect(px - 0.03, py - 0.26, 0.06, 0.01);
      } else {
        g.fillStyle = "rgb(120,80,44)";
        for (let k = 0; k < 3; k++) { g.fillRect(px - 0.09 + k * 0.02, py - 0.06 - k * 0.07, 0.18 - k * 0.04, 0.012); }
        g.fillRect(px - 0.004, py - 0.28, 0.008, 0.28);
        g.beginPath(); g.moveTo(px - 0.06, py - 0.28); g.lineTo(px + 0.06, py - 0.3); g.lineTo(px + 0.06, py - 0.29); g.lineTo(px - 0.06, py - 0.27); g.fill();
        g.fillStyle = "rgb(250,240,210)"; for (let k = 0; k < 4; k++) g.fillRect(px - 0.08 + k * 0.05, py - 0.08, 0.008, 0.03);
      }
      /* Watte auf der Fensterbank */
      g.fillStyle = "rgb(246,246,248)";
      g.beginPath(); g.moveTo(x, boden);
      for (let px2 = x; px2 <= x + w; px2 += 0.05) g.lineTo(px2, boden - 0.025 - r() * 0.025);
      g.lineTo(x + w, boden); g.closePath(); g.fill();
      if (F.px > 40) { g.fillStyle = "rgba(255,255,255,0.9)"; for (let i = 0; i < w * 20; i++) g.fillRect(x + r() * w, boden - r() * 0.04, 0.004, 0.004); }
    }
    void r0; void nacht;
  }

  /* ---------------- Ladentür mit Glas und Oberlicht ---------------- */
  function ladentuerMalen(g, F, zO, op, V) {
    const x = op.a0, w = op.a1 - op.a0, y = zO - op.z1, h = op.z1 - op.z0;
    const r = ST.zufall(ST.textHash(F.name + "lt") + V.saat);
    nische(g, F, x, y, w, h, 0.16, [200, 190, 170], (gg) => {
      const c = V.tuer, ob = 0.36;
      /* Oberlicht */
      glas(gg, F, x + 0.05, y + 0.05, w - 0.1, ob - 0.08, r, {});
      rahmenHolz(gg, x, y, w, 0.05, hell(c, 0.05), F, false);
      rahmenHolz(gg, x, y + ob - 0.05, w, 0.06, hell(c, 0.05), F, false);
      for (let i = 1; i < 3; i++) rahmenHolz(gg, x + w * i / 3 - 0.015, y, 0.03, ob, hell(c, 0.05), F, true);
      /* Türblatt: oben Glas mit Sprossen, unten Kassette */
      const ty = y + ob, th = h - ob;
      gg.fillStyle = rgb(c); gg.fillRect(x, ty, w, th);
      flecken(gg, x, ty, w, th, 0.8, 0.22, "dunkel", 17);
      const gy = ty + 0.1, ghh = th * 0.5;
      glas(gg, F, x + 0.12, gy, w - 0.24, ghh, r, { innen: (g2, a, b, c2, d) => { g2.fillStyle = "rgba(50,34,20,0.4)"; g2.fillRect(a, b, c2, d); raumTag(g2, F, a, b, c2, d, r, { gardine: true }); } });
      rahmenHolz(gg, x + w / 2 - 0.015, gy, 0.03, ghh, hell(c, 0.05), F, true);
      rahmenHolz(gg, x + 0.12, gy + ghh / 2 - 0.015, w - 0.24, 0.03, hell(c, 0.05), F, false);
      /* Kassette unten */
      const ky = gy + ghh + 0.1, kh = th - (ky - ty) - 0.12;
      gg.fillStyle = rgb(hell(c, -0.18)); gg.fillRect(x + 0.12, ky, w - 0.24, kh);
      gg.fillStyle = rgb(hell(c, 0.08)); gg.fillRect(x + 0.16, ky + 0.04, w - 0.32, kh - 0.08);
      /* Stoßgriff aus Messing und Türglocke */
      gg.fillStyle = "#c9a44e"; rrect(gg, x + w - 0.16, ty + th * 0.52, 0.03, 0.22, 0.012); gg.fill();
      gg.fillStyle = "#e9cf82"; gg.fillRect(x + w - 0.155, ty + th * 0.53, 0.008, 0.2);
      gg.fillStyle = "rgba(40,30,20,0.4)"; gg.fillRect(x, ty + th - 0.02, w, 0.02);
    });
  }
  function ladentuerLicht(g, F, zO, op, V) {
    const x = op.a0, w = op.a1 - op.a0, y = zO - op.z1, h = op.z1 - op.z0;
    const B = blick(F), [dx, dy] = B.tief(0.16), a = F.nacht;
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.translate(dx, dy);
    g.fillStyle = "rgba(255,200,120," + (0.85 * a) + ")";
    g.fillRect(x + 0.05, y + 0.05, w - 0.1, 0.28);
    g.fillRect(x + 0.12, y + 0.46, w - 0.24, (h - 0.36) * 0.5);
    g.fillStyle = "rgba(40,30,24," + (0.9 * a) + ")";
    g.fillRect(x + w / 2 - 0.015, y + 0.46, 0.03, (h - 0.36) * 0.5);
    for (let i = 1; i < 3; i++) g.fillRect(x + w * i / 3 - 0.015, y, 0.03, 0.36);
    g.restore();
  }

  /* ---------------- Haustür im Sandsteingewände ----------------
     Gewände mit Schlussstein und Jahreszahl, Oberlicht mit Fächer-
     sprossen, Kassettentür mit Messingklinke und Beschlägen. */
  function haustuerMalen(g, F, zO, op, V) {
    const x = op.a0, w = op.a1 - op.a0, y = zO - op.z1, h = op.z1 - op.z0;
    const r = ST.zufall(ST.textHash(F.name + "ht") + V.saat);
    const gw = 0.17, gf = [198, 180, 150], fa = 0.04;
    /* Gewände aus Sandstein (steht 3 cm vor) */
    const sv = F.schatten(0.03);
    if (sv) { g.fillStyle = "rgba(40,30,26,0.3)"; g.fillRect(x - gw + sv[0], y - gw + sv[1], w + 2 * gw, h + gw); }
    const gr = g.createLinearGradient(x - gw, 0, x + w + gw, 0);
    gr.addColorStop(0, rgb(hell(gf, 0.06))); gr.addColorStop(1, rgb(hell(gf, -0.06)));
    g.fillStyle = gr; g.fillRect(x - gw, y - gw, w + 2 * gw, h + gw);
    flecken(g, x - gw, y - gw, w + 2 * gw, h + gw, 0.7, 0.24, "dunkel", 44);
    /* Sandsteinkörnung und dunkle Verwitterung unten (Spritzwasser) */
    if (F.px > 30) flecken(g, x - gw, y - gw, w + 2 * gw, h + gw, 0.3, 0.35, "korn", 45);
    { const gs = g.createLinearGradient(0, y + h, 0, y + h - 0.6); gs.addColorStop(0, "rgba(80,74,60,0.3)"); gs.addColorStop(1, "rgba(80,74,60,0)"); g.fillStyle = gs; g.fillRect(x - gw, y + h - 0.6, w + 2 * gw, 0.6); }
    if (F.px > 18) {
      /* Fugen der Gewändesteine */
      g.fillStyle = "rgba(80,66,50,0.45)";
      for (const fy of [y + h * 0.35, y + h * 0.7]) { g.fillRect(x - gw, fy, gw, 0.012); g.fillRect(x + w, fy, gw, 0.012); }
      g.fillRect(x - gw, y - 0.006, w + 2 * gw, 0.012);
      /* Schlussstein: Kanten verwittert, zwei Abplatzer */
      const kx = x + w / 2, ko = y - gw - 0.04;
      const um = [[kx - 0.12, ko], [kx - 0.04, ko - 0.004], [kx + 0.05, ko + 0.003], [kx + 0.12, ko], [kx + 0.105, ko + 0.06], [kx + 0.08, y + 0.02], [kx - 0.03, y + 0.024], [kx - 0.08, y + 0.02], [kx - 0.1, ko + 0.08]];
      fuelle(g, um, rgb(hell(gf, 0.1)));
      if (F.px > 40) flecken(g, kx - 0.13, ko, 0.26, gw + 0.07, 0.3, 0.3, "korn", 46);
      g.fillStyle = rgb(hell(gf, -0.22)); g.beginPath(); g.ellipse(kx + 0.095, ko + 0.012, 0.02, 0.012, 0.4, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.ellipse(kx - 0.1, ko + 0.07, 0.012, 0.018, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "rgba(70,56,40,0.35)"; g.fillRect(kx - 0.12, ko, 0.24, 0.006);
    }
    /* RUNDE 2: umlaufende Fase 4 cm unter 45° an der Innenkante – zur Sonne
       15 % heller, gegenüber 20 % dunkler (vorher kaum zu sehen). Die Seite
       entscheidet das Licht in DIESEM Drehwinkel. */
    if (F.px > 10) {
      const fase = (pts, nu, nv) => { const d = F.lichtU * nu + F.lichtV * nv + F.lichtN * 0.7; fuelle(g, pts, rgb(hell(gf, d > 0.05 ? 0.15 : -0.2))); };
      fase([[x - fa, y - fa], [x, y], [x, y + h], [x - fa, y + h]], 1, 0);
      fase([[x + w + fa, y - fa], [x + w, y], [x + w, y + h], [x + w + fa, y + h]], -1, 0);
      fase([[x - fa, y - fa], [x + w + fa, y - fa], [x + w, y], [x, y]], 0, 1);
      g.strokeStyle = "rgba(60,48,36,0.35)"; g.lineWidth = Math.max(0.003, 0.7 / F.px);
      g.strokeRect(x - fa, y - fa, w + 2 * fa, h + fa);
    }
    /* Inschrift im Sturz, eingehauen: dunkle Kerbe, unten eine Lichtkante.
       Weiter weg nur eine eingeritzte Linie. */
    const jahr = op.jahr || "1612", iy = y - gw * 0.5;
    if (F.px > 100) {
      g.font = "bold 0.06px 'DejaVu Serif', serif"; g.textAlign = "center"; g.textBaseline = "middle";
      for (const [t, tx] of [["ANNO", x + w * 0.2], [jahr, x + w * 0.8]]) {
        g.fillStyle = "rgba(255,246,226,0.6)"; g.fillText(t, tx + 0.003, iy + 0.004);
        g.fillStyle = "rgba(66,52,38,0.88)"; g.fillText(t, tx, iy);
      }
    } else if (F.px > 30) {
      g.fillStyle = "rgba(76,60,44,0.5)";
      g.fillRect(x + w * 0.08, iy - 0.006, w * 0.24, 0.012); g.fillRect(x + w * 0.68, iy - 0.006, w * 0.24, 0.012);
    }
    nische(g, F, x, y, w, h, 0.18, [206, 190, 160], (gg) => {
      const c = V.tuer, ob = 0.4;
      /* Oberlicht mit Fächersprossen */
      glas(gg, F, x, y, w, ob, r, {});
      gg.strokeStyle = rgb(hell(c, 0.1)); gg.lineWidth = 0.025;
      for (let i = 1; i < 5; i++) { const a = Math.PI + Math.PI * i / 5; gg.beginPath(); gg.moveTo(x + w / 2, y + ob); gg.lineTo(x + w / 2 + Math.cos(a) * w, y + ob + Math.sin(a) * w); gg.stroke(); }
      gg.beginPath(); gg.arc(x + w / 2, y + ob, ob * 0.35, Math.PI, 0); gg.stroke();
      rahmenHolz(gg, x, y + ob - 0.04, w, 0.07, hell(c, 0.05), F, false);
      /* Türblatt: RUNDE 2 – aufgedoppelte Tür wie um 1612. Außen eine
         Rahmung aus senkrechten Brettern, innen 45°-Bretter, die sich zu
         Rauten um die Mitte fügen; geschmiedete Langbänder mit gerollten
         Enden, Nagelköpfe, ein Türklopfer. (Vorher: Vierfüllungstür wie aus
         dem Baumarkt der 1980er.) */
      const ty = y + ob + 0.03, th = h - ob - 0.03;
      const tg = gg.createLinearGradient(x, 0, x + w, 0);
      tg.addColorStop(0, rgb(hell(c, 0.06))); tg.addColorStop(1, rgb(hell(c, -0.06)));
      gg.fillStyle = tg; gg.fillRect(x, ty, w, th);
      const rw = 0.1, ix = x + rw, iy = ty + rw, iw = w - 2 * rw, ih = th - 2 * rw, mx = ix + iw / 2, my = iy + ih / 2;
      if (F.px > 10) {
        const lw = Math.max(0.004, 0.9 / F.px);
        gg.save(); gg.beginPath(); gg.rect(ix, iy, iw, ih); gg.clip();
        /* Rauten: konzentrische Fugen im Abstand einer Brettbreite (9 cm) */
        const st = 0.09, n = Math.ceil((iw / 2 + ih / 2) / st) + 1, kx2 = 1, ky2 = 1;
        for (let i = 0; i < n; i++) {
          const d = i * st + st * 0.5;
          const raute = (dx, dy) => { gg.beginPath(); gg.moveTo(mx + dx, my - d * ky2 + dy); gg.lineTo(mx + d * kx2 + dx, my + dy); gg.lineTo(mx + dx, my + d * ky2 + dy); gg.lineTo(mx - d * kx2 + dx, my + dy); gg.closePath(); gg.stroke(); };
          gg.lineWidth = lw * 1.4; gg.strokeStyle = rgb(hell(c, -0.42), 0.8); raute(0, 0);
          gg.lineWidth = lw; gg.strokeStyle = rgb(hell(c, 0.16), 0.45); raute(0.004, 0.004);
          /* jedes zweite Brett etwas anders im Ton */
          if (i % 2) { gg.fillStyle = rgb(hell(c, -0.05), 0.35); gg.beginPath(); gg.moveTo(mx, my - d); gg.lineTo(mx + d, my); gg.lineTo(mx, my + d); gg.lineTo(mx - d, my); gg.closePath(); gg.moveTo(mx, my - d - st); gg.lineTo(mx - d - st, my); gg.lineTo(mx, my + d + st); gg.lineTo(mx + d + st, my); gg.closePath(); gg.fill(); }
        }
        /* die Diagonalen, an denen die Bretter auf Gehrung stoßen */
        gg.strokeStyle = rgb(hell(c, -0.38), 0.7); gg.lineWidth = lw;
        gg.beginPath(); gg.moveTo(mx, iy); gg.lineTo(mx, iy + ih); gg.moveTo(ix, my); gg.lineTo(ix + iw, my); gg.stroke();
        gg.restore();
        flecken(gg, x, ty, w, th, 0.9, 0.25, "dunkel", 12);
        /* Rahmenbretter: Fugen, dunkle Kante zur Raute */
        gg.strokeStyle = rgb(hell(c, -0.45), 0.85); gg.lineWidth = lw * 1.5; gg.strokeRect(ix, iy, iw, ih);
        gg.strokeStyle = rgb(hell(c, 0.18), 0.5); gg.lineWidth = lw; gg.strokeRect(ix - 0.006, iy - 0.006, iw + 0.012, ih + 0.012);
        /* Nagelköpfe (Doppelung genagelt) */
        if (F.px > 45) {
          gg.fillStyle = "rgba(34,30,28,0.85)";
          gg.beginPath();
          for (let yy = ty + 0.05; yy < ty + th - 0.03; yy += 0.16) for (const xx of [x + 0.05, x + w - 0.05]) { gg.moveTo(xx + 0.007, yy); gg.arc(xx, yy, 0.007, 0, Math.PI * 2); }
          for (let xx = x + 0.12; xx < x + w - 0.08; xx += 0.14) for (const yy of [ty + 0.05, ty + th - 0.05]) { gg.moveTo(xx + 0.007, yy); gg.arc(xx, yy, 0.007, 0, Math.PI * 2); }
          gg.fill();
        }
      } else flecken(gg, x, ty, w, th, 0.9, 0.25, "dunkel", 12);
      /* geschmiedete Langbänder: von der Bandseite (links) weit ins Blatt,
         am Ende eingerollt, mit Nägeln */
      const band = (yy) => {
        gg.fillStyle = "#231e1b";
        gg.beginPath(); gg.moveTo(x, yy - 0.024); gg.lineTo(x + w * 0.66, yy - 0.012); gg.quadraticCurveTo(x + w * 0.76, yy - 0.03, x + w * 0.78, yy - 0.004); gg.quadraticCurveTo(x + w * 0.76, yy + 0.028, x + w * 0.7, yy + 0.012); gg.lineTo(x + w * 0.66, yy + 0.012); gg.lineTo(x, yy + 0.024); gg.closePath(); gg.fill();
        if (F.px > 50) {
          gg.strokeStyle = "rgba(160,150,140,0.35)"; gg.lineWidth = Math.max(0.002, 0.5 / F.px); gg.beginPath(); gg.moveTo(x, yy - 0.02); gg.lineTo(x + w * 0.66, yy - 0.009); gg.stroke();
          gg.fillStyle = "#3a3430"; for (const t of [0.12, 0.3, 0.48]) { gg.beginPath(); gg.arc(x + w * t, yy, 0.007, 0, Math.PI * 2); gg.fill(); }
        }
      };
      band(ty + 0.22); band(ty + th - 0.3);
      /* Türklopfer: Ring an einem Kloben in der Mitte */
      if (F.px > 20) {
        const ox = mx, oy = my + 0.02;
        gg.fillStyle = "#2a2420"; gg.beginPath(); gg.arc(ox, oy - 0.05, 0.018, 0, Math.PI * 2); gg.fill();
        gg.strokeStyle = "#2c2622"; gg.lineWidth = 0.014; gg.beginPath(); gg.ellipse(ox, oy + 0.01, 0.045, 0.055, 0, 0, Math.PI * 2); gg.stroke();
        if (F.px > 50) { gg.strokeStyle = "rgba(190,180,160,0.4)"; gg.lineWidth = 0.004; gg.beginPath(); gg.ellipse(ox - 0.004, oy + 0.006, 0.045, 0.055, 0, Math.PI * 1.05, Math.PI * 1.6); gg.stroke(); }
        gg.fillStyle = "#3a3430"; gg.beginPath(); gg.arc(ox, oy + 0.075, 0.012, 0, Math.PI * 2); gg.fill();
      }
      /* Klinke mit geschmiedetem Langschild, Schlüsselloch */
      const kx = x + w - 0.11, ky = ty + th * 0.5;
      gg.fillStyle = "#2a2420"; rrect(gg, kx - 0.02, ky - 0.09, 0.04, 0.22, 0.012); gg.fill();
      gg.fillStyle = "#b89448"; gg.fillRect(kx - 0.1, ky - 0.011, 0.11, 0.02);
      gg.fillStyle = "#f0dc9c"; gg.fillRect(kx - 0.1, ky - 0.011, 0.11, 0.005);
      gg.fillStyle = "#120e0c"; gg.beginPath(); gg.arc(kx, ky + 0.07, 0.008, 0, Math.PI * 2); gg.fill(); gg.fillRect(kx - 0.003, ky + 0.07, 0.006, 0.018);
      /* Türkranz im Winter – erst, wenn das Haus fertig und geschmückt ist */
      if (F.jahr === "winter" && (F.bau == null || F.bau >= 0.97)) kranz(gg, F, x + w / 2, ty + th * 0.25, 0.225);
      gg.fillStyle = "rgba(30,22,16,0.5)"; gg.fillRect(x, ty + th - 0.03, w, 0.03);
    });
  }
  /* Türkranz, Ø 45 cm: Tannengrün (innen dunkel, die Nadelspitzen hell),
     drei Zapfen, goldene Glöckchen, Beeren und eine große rote Schleife
     mit zwei 30 cm langen Bändern */
  function kranz(g, F, cx, cy, R) {
    const r = ST.zufall(99);
    const Rm = R * 0.72, rb = R * 0.28;
    /* Band, an dem der Kranz hängt */
    g.fillStyle = "#8e1022"; g.fillRect(cx - 0.012, cy - R - 0.26, 0.024, 0.26 + R * 0.4);
    const sv = F.schatten(0.07);
    if (sv) { g.strokeStyle = "rgba(14,8,6,0.34)"; g.lineWidth = rb * 2.2; g.beginPath(); g.arc(cx + sv[0], cy + sv[1], Rm, 0, Math.PI * 2); g.stroke(); }
    g.strokeStyle = "rgb(22,44,28)"; g.lineWidth = rb * 2; g.beginPath(); g.arc(cx, cy, Rm, 0, Math.PI * 2); g.stroke();
    if (F.px < 25) {
      g.fillStyle = "#b01428"; g.beginPath(); g.arc(cx, cy + Rm, rb * 0.8, 0, Math.PI * 2); g.fill();
      return;
    }
    /* Nadelbüschel, schräg zur Ringrichtung gelegt; oben links im Licht */
    g.lineCap = "round";
    const n = Math.round(klemm(F.px * 1.1, 50, 240));
    const spitzen = [];
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2, rr = Rm + (r() - 0.5) * rb * 1.9;
      const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr;
      const dir = a + Math.PI / 2 * (r() < 0.5 ? 1 : -1) * 0.7 + (r() - 0.5) * 0.8, l = 0.035 + r() * 0.05;
      const li = klemm(0.45 - (Math.cos(a) + Math.sin(a)) * 0.22 + (rr - Rm) / rb * 0.12 + (r() - 0.5) * 0.35, 0, 1);
      g.strokeStyle = rgb(misch([18, 40, 26], [46, 88, 52], li)); g.lineWidth = 0.011 + r() * 0.006;
      const ex = px + Math.cos(dir) * l, ey = py + Math.sin(dir) * l;
      g.beginPath(); g.moveTo(px, py); g.lineTo(ex, ey); g.stroke();
      if (li > 0.35) spitzen.push([ex, ey, dir, li]);
    }
    if (F.px > 45) {
      g.lineWidth = 0.006;
      for (const [ex, ey, dir, li] of spitzen) {
        g.strokeStyle = rgb(misch([52, 96, 56], [70, 120, 70], li), 0.9);
        g.beginPath(); g.moveTo(ex - Math.cos(dir) * 0.012, ey - Math.sin(dir) * 0.012); g.lineTo(ex + Math.cos(dir) * 0.006, ey + Math.sin(dir) * 0.006); g.stroke();
      }
    }
    /* drei Zapfen */
    for (const a of [3.6, 5.2, 0.6]) {
      const zx = cx + Math.cos(a) * Rm, zy = cy + Math.sin(a) * Rm, dr = a + Math.PI / 2;
      g.fillStyle = "#5a3a22"; g.beginPath(); g.ellipse(zx, zy, 0.022, 0.036, dr, 0, Math.PI * 2); g.fill();
      if (F.px > 60) {
        g.strokeStyle = "rgba(150,108,66,0.8)"; g.lineWidth = 0.004;
        for (let k = -2; k <= 2; k++) { g.beginPath(); g.ellipse(zx + Math.cos(dr) * k * 0.012, zy + Math.sin(dr) * k * 0.012, 0.016, 0.007, dr + Math.PI / 2, 0, Math.PI); g.stroke(); }
      }
    }
    /* Beeren in kleinen Trauben */
    for (const a of [4.3, 5.8, 1.2, 2.5]) for (let k = 0; k < 3; k++) {
      const bx = cx + Math.cos(a) * Rm + (r() - 0.5) * 0.035, by = cy + Math.sin(a) * Rm + (r() - 0.5) * 0.035;
      g.fillStyle = "#b8142c"; g.beginPath(); g.arc(bx, by, 0.011, 0, Math.PI * 2); g.fill();
      if (F.px > 70) { g.fillStyle = "rgba(255,220,220,0.7)"; g.beginPath(); g.arc(bx - 0.003, by - 0.004, 0.003, 0, Math.PI * 2); g.fill(); }
    }
    /* zwei goldene Glöckchen links unten */
    for (const [a, d] of [[2.2, 0], [2.0, 0.03]]) {
      const bx = cx + Math.cos(a) * Rm - d, by = cy + Math.sin(a) * Rm + 0.02 + d;
      const gg2 = g.createLinearGradient(bx - 0.02, by - 0.03, bx + 0.02, by + 0.02);
      gg2.addColorStop(0, "#fff0b0"); gg2.addColorStop(0.45, "#d8a93c"); gg2.addColorStop(1, "#7c5618");
      g.fillStyle = gg2; g.beginPath(); g.moveTo(bx - 0.012, by - 0.02); g.quadraticCurveTo(bx, by - 0.034, bx + 0.012, by - 0.02); g.lineTo(bx + 0.02, by + 0.012); g.lineTo(bx - 0.02, by + 0.012); g.closePath(); g.fill();
      g.fillStyle = "#6a4a14"; g.beginPath(); g.arc(bx, by + 0.016, 0.005, 0, Math.PI * 2); g.fill();
    }
    /* große Schleife unten mit zwei langen Bändern */
    const sx = cx, sy = cy + Rm + 0.01, s = 0.085;
    const band = (sg) => {
      g.beginPath();
      g.moveTo(sx + sg * 0.01, sy);
      g.bezierCurveTo(sx + sg * 0.05, sy + 0.1, sx + sg * 0.02, sy + 0.2, sx + sg * 0.07, sy + 0.3);
      g.lineTo(sx + sg * 0.085, sy + 0.27); g.lineTo(sx + sg * 0.105, sy + 0.31);
      g.bezierCurveTo(sx + sg * 0.06, sy + 0.2, sx + sg * 0.09, sy + 0.1, sx + sg * 0.045, sy);
      g.closePath();
    };
    for (const sg of [-1, 1]) {
      if (sv) { g.save(); g.translate(sv[0] * 0.6, sv[1] * 0.6); band(sg); g.fillStyle = "rgba(14,8,6,0.3)"; g.fill(); g.restore(); }
      band(sg); g.fillStyle = sg < 0 ? "#b01830" : "#9a1428"; g.fill();
    }
    for (const sg of [-1, 1]) {
      const lg = g.createLinearGradient(sx, sy, sx + sg * s * 1.5, sy - s * 0.5);
      lg.addColorStop(0, "#7e0e1e"); lg.addColorStop(0.55, "#c81c36"); lg.addColorStop(1, "#a4162c");
      g.fillStyle = lg;
      g.beginPath(); g.moveTo(sx, sy); g.bezierCurveTo(sx + sg * s * 1.5, sy - s * 1.2, sx + sg * s * 1.7, sy + s * 0.6, sx, sy); g.fill();
      if (F.px > 50) { g.fillStyle = "rgba(255,210,210,0.28)"; g.beginPath(); g.ellipse(sx + sg * s * 0.8, sy - s * 0.35, s * 0.35, s * 0.12, sg * -0.4, 0, Math.PI * 2); g.fill(); }
    }
    g.fillStyle = "#c02038"; rrect(g, sx - 0.02, sy - 0.022, 0.04, 0.044, 0.01); g.fill();
    g.fillStyle = "rgba(60,6,14,0.5)"; g.fillRect(sx - 0.02, sy + 0.012, 0.04, 0.01);
  }
  function hoftuerMalen(g, F, zO, op, V) {
    const x = op.a0, w = op.a1 - op.a0, y = zO - op.z1, h = op.z1 - op.z0;
    nische(g, F, x, y, w, h, 0.1, [206, 196, 176], (gg) => {
      const c = hell(V.holz, 0.15);
      const n = 6;
      for (let i = 0; i < n; i++) {
        const cc = PI.streu(c, Math.random, 0.0);
        gg.fillStyle = rgb(hell(cc, (i % 2 ? -0.04 : 0.03))); gg.fillRect(x + w * i / n, y, w / n, h);
        gg.fillStyle = rgb(hell(cc, -0.4)); gg.fillRect(x + w * (i + 1) / n - 0.008, y, 0.008, h);
      }
      flecken(gg, x, y, w, h, 0.9, 0.3, "dunkel", 19);
      gg.fillStyle = rgb(hell(c, -0.12));
      gg.fillRect(x, y + h * 0.15, w, 0.09); gg.fillRect(x, y + h * 0.8, w, 0.09);
      gg.save(); gg.beginPath(); gg.rect(x, y + h * 0.15 + 0.09, w, h * 0.65 - 0.09); gg.clip();
      gg.strokeStyle = rgb(hell(c, -0.12)); gg.lineWidth = 0.09; gg.beginPath(); gg.moveTo(x, y + h * 0.8); gg.lineTo(x + w, y + h * 0.2); gg.stroke(); gg.restore();
      gg.fillStyle = "#26211e"; gg.fillRect(x, y + h * 0.17, w * 0.7, 0.03); gg.fillRect(x, y + h * 0.82, w * 0.7, 0.03);
      gg.fillStyle = "#1d1a18"; gg.beginPath(); gg.arc(x + w - 0.12, y + h * 0.52, 0.03, 0, Math.PI * 2); gg.fill();
    });
  }
  /* Zugesetztes Fenster: vor langer Zeit zugemauert und verputzt – der Putz
     ist etwas anders im Ton, der alte Blendrahmen steckt noch in der Wand */
  function zugesetztMalen(g, F, zO, op, V) {
    const x = op.a0, w = op.a1 - op.a0, y = zO - op.z1, h = op.z1 - op.z0;
    const c = misch(V.putz, [214, 214, 208], 0.45);
    g.fillStyle = rgb(c); g.fillRect(x, y, w, h);
    flecken(g, x, y, w, h, 0.8, 0.3, "dunkel", 29);
    flecken(g, x, y, w, h, 0.5, 0.2, "hell", 31);
    /* alter Rahmen, grau verwittert, halb eingeputzt */
    g.strokeStyle = "rgba(118,110,98,0.75)"; g.lineWidth = 0.05; g.strokeRect(x + 0.025, y + 0.025, w - 0.05, h - 0.05);
    g.strokeStyle = "rgba(60,54,46,0.35)"; g.lineWidth = Math.max(0.004, 0.7 / F.px); g.strokeRect(x + 0.05, y + 0.05, w - 0.1, h - 0.1);
    /* Setzriss über dem Sturz */
    if (F.px > 20) { g.strokeStyle = "rgba(90,80,64,0.45)"; g.beginPath(); g.moveTo(x + w * 0.2, y + 0.06); g.lineTo(x + w * 0.35, y + h * 0.25); g.lineTo(x + w * 0.3, y + h * 0.45); g.stroke(); }
    /* die alte Sandsteinbank ist geblieben */
    vorsprung(g, F, x - 0.05, y + h, w + 0.1, 0.06, 0.06, [184, 172, 150], {});
    if (F.jahr === "winter") schneeKante(g, F, x - 0.05, y + h, w + 0.1, 0.06, 0.03);
  }
  /* Ladeluke im Nordgiebel: zweiflüglige Brettertür mit Bändern */
  function lukeMalen(g, F, zO, op, V) {
    const x = op.a0, w = op.a1 - op.a0, y = zO - op.z1, h = op.z1 - op.z0;
    nische(g, F, x, y, w, h, 0.08, [196, 184, 162], (gg) => {
      const c = hell(V.holz, 0.2);
      for (let i = 0; i < 6; i++) { gg.fillStyle = rgb(hell(c, (i % 2 ? -0.05 : 0.04) + (i === 3 ? -0.2 : 0))); gg.fillRect(x + w * i / 6, y, w / 6, h); gg.fillStyle = rgb(hell(c, -0.45)); gg.fillRect(x + w * (i + 1) / 6 - 0.008, y, 0.008, h); }
      flecken(gg, x, y, w, h, 0.8, 0.35, "dunkel", 23);
      gg.fillStyle = "#24201c";
      for (const yy of [y + h * 0.2, y + h * 0.78]) { gg.fillRect(x + 0.03, yy, w * 0.4, 0.03); gg.fillRect(x + w * 0.57, yy, w * 0.4, 0.03); }
      gg.fillRect(x + w / 2 - 0.01, y + h * 0.48, 0.02, 0.1);
    });
  }
  /* Kellerfenster: Sandsteinrahmen mit Fase, tiefe dunkle Öffnung mit
     blindem Glas weit hinten, drei Eisenstäbe davor; im Winter ein
     Schneebrett auf der unteren Laibung */
  function kellerMalen(g, F, zO, op, V) {
    const x = op.a0, w = op.a1 - op.a0, y = zO - op.z1, h = op.z1 - op.z0;
    const gf = [190, 174, 144], rb = 0.07;
    const sv = F.schatten(0.02);
    if (sv) { g.fillStyle = "rgba(30,24,20,0.3)"; g.fillRect(x - rb + sv[0], y - rb + sv[1], w + 2 * rb, h + 2 * rb); }
    g.fillStyle = rgb(gf); g.fillRect(x - rb, y - rb, w + 2 * rb, h + 2 * rb);
    flecken(g, x - rb, y - rb, w + 2 * rb, h + 2 * rb, 0.5, 0.35, "dunkel", 71);
    if (F.px > 20) {
      g.fillStyle = "rgba(80,66,50,0.5)";
      g.fillRect(x - rb, y - 0.006, rb, 0.012); g.fillRect(x + w, y - 0.006, rb, 0.012);
      g.fillRect(x - rb, y + h - 0.006, rb, 0.012); g.fillRect(x + w, y + h - 0.006, rb, 0.012);
      const k = Math.SQRT1_2, fa = 0.02;
      const fase = (pts, nu, nv) => fuelle(g, pts, rgb(hellMal(gf, seitenHell(F, nu * k, nv * k, k))));
      fase([[x - fa, y - fa], [x, y], [x, y + h], [x - fa, y + h + fa]], 1, 0);
      fase([[x + w + fa, y - fa], [x + w, y], [x + w, y + h], [x + w + fa, y + h + fa]], -1, 0);
      fase([[x - fa, y - fa], [x + w + fa, y - fa], [x + w, y], [x, y]], 0, 1);
      fase([[x - fa, y + h + fa], [x + w + fa, y + h + fa], [x + w, y + h], [x, y + h]], 0, -1);
    }
    const winter = F.jahr === "winter";
    nische(g, F, x, y, w, h, 0.32, [150, 140, 122], (gg) => {
      const gr = gg.createLinearGradient(0, y, 0, y + h);
      gr.addColorStop(0, "rgb(18,16,17)"); gr.addColorStop(1, "rgb(36,32,30)");
      gg.fillStyle = gr; gg.fillRect(x, y, w, h);
      /* blindes Kellerglas weit hinten, staubig */
      gg.fillStyle = "rgba(96,100,104,0.28)"; gg.fillRect(x + 0.05, y + 0.04, w - 0.1, h - 0.06);
      gg.fillStyle = "rgba(30,26,24,0.6)"; gg.fillRect(x + w / 2 - 0.01, y + 0.04, 0.02, h - 0.06);
      if (winter) {
        /* Schneebrett auf der unteren Laibung */
        gg.fillStyle = "rgb(226,233,246)";
        gg.beginPath(); gg.moveTo(x - 0.1, y + h + 0.1); gg.lineTo(x - 0.1, y + h - 0.05);
        for (let a = x; a <= x + w + 0.01; a += w / 6) gg.lineTo(a, y + h - 0.05 - Math.sin((a - x) / w * Math.PI) * 0.02 + Math.sin(a * 41) * 0.006);
        gg.lineTo(x + w + 0.1, y + h + 0.1); gg.closePath(); gg.fill();
      }
    });
    /* drei Vierkant-Eisenstäbe und ein Flacheisen, im Rahmen verbleit */
    const sb = Math.max(0.016, 1.1 / F.px);
    for (let i = 1; i <= 3; i++) {
      const bx = x + w * i / 4 - sb / 2;
      if (sv) { g.fillStyle = "rgba(10,10,12,0.35)"; g.fillRect(bx + sv[0] * 4, y + sv[1] * 4, sb, h); }
      g.fillStyle = "rgb(40,38,38)"; g.fillRect(bx, y - 0.02, sb, h + 0.04);
      if (F.px > 40) { g.fillStyle = "rgba(170,160,150,0.45)"; g.fillRect(bx, y - 0.02, sb * 0.3, h + 0.04); }
    }
    g.fillStyle = "rgb(44,40,38)"; g.fillRect(x - 0.02, y + h * 0.45, w + 0.04, Math.max(0.012, 0.8 / F.px));
    if (F.px > 30) { g.fillStyle = "rgba(120,70,40,0.35)"; g.fillRect(x + w * 0.25, y + h - 0.01, 0.02, 0.05); g.fillRect(x + w * 0.75, y + h - 0.01, 0.02, 0.06); }
    if (winter) {
      /* Schnee auf der Rahmenbank */
      g.fillStyle = "rgb(238,243,250)";
      g.beginPath(); g.moveTo(x - rb, y + h + rb * 0.4); g.quadraticCurveTo(x + w / 2, y + h + rb * 0.1, x + w + rb, y + h + rb * 0.4); g.lineTo(x + w + rb, y + h + rb * 0.7); g.lineTo(x - rb, y + h + rb * 0.7); g.closePath(); g.fill();
    }
  }

  /* ---------------- Klingel, Hausnummer, Briefkasten, Laterne ---------------- */
  function klingelPlatte(g, F, x, y, name) {
    /* Messingplatte 9 × 20 cm mit Glanzkante, Namensschild 7,5 × 3 cm und
       Klingelknopf. Den Namen schreiben wir erst, wenn er lesbar ist –
       vorher ist das Schild ein helles Feld. */
    const w = 0.09, h = 0.2;
    const sv = F.schatten(0.015);
    if (sv) { g.fillStyle = "rgba(0,0,0,0.3)"; rrect(g, x + sv[0], y + sv[1], w, h, 0.012); g.fill(); }
    const gr = g.createLinearGradient(x, y, x + w, y + h);
    gr.addColorStop(0, "rgb(236,206,128)"); gr.addColorStop(0.45, "rgb(200,160,80)"); gr.addColorStop(1, "rgb(138,102,42)");
    g.fillStyle = gr; rrect(g, x, y, w, h, 0.012); g.fill();
    if (F.px > 40) {
      const lw = Math.max(0.003, 0.8 / F.px);
      g.lineWidth = lw;
      g.strokeStyle = "rgba(255,244,200,0.85)"; g.beginPath(); g.moveTo(x + 0.004, y + h - 0.012); g.lineTo(x + 0.004, y + 0.012); g.quadraticCurveTo(x + 0.004, y + 0.004, x + 0.012, y + 0.004); g.lineTo(x + w - 0.012, y + 0.004); g.stroke();
      g.strokeStyle = "rgba(92,64,22,0.7)"; g.beginPath(); g.moveTo(x + w - 0.004, y + 0.012); g.lineTo(x + w - 0.004, y + h - 0.012); g.quadraticCurveTo(x + w - 0.004, y + h - 0.004, x + w - 0.012, y + h - 0.004); g.lineTo(x + 0.012, y + h - 0.004); g.stroke();
    }
    const nx = x + (w - 0.075) / 2, ny = y + 0.035;
    g.fillStyle = "#f6f2e6"; g.fillRect(nx, ny, 0.075, 0.03);
    if (F.px > 60) { g.strokeStyle = "rgba(110,80,34,0.8)"; g.lineWidth = Math.max(0.002, 0.6 / F.px); g.strokeRect(nx, ny, 0.075, 0.03); }
    if (F.px > 180 && name) { g.fillStyle = "#2a2a30"; g.font = "0.017px 'DejaVu Serif', serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(name, nx + 0.0375, ny + 0.0155, 0.068); }
    else if (F.px > 60) { g.fillStyle = "rgba(170,170,168,0.6)"; g.fillRect(nx + 0.012, ny + 0.012, 0.051, 0.006); }
    const kx = x + w / 2, ky = y + 0.13;
    g.fillStyle = "rgba(90,64,22,0.8)"; g.beginPath(); g.arc(kx, ky, 0.026, 0, Math.PI * 2); g.fill();
    const kg = g.createRadialGradient(kx - 0.006, ky - 0.006, 0, kx, ky, 0.022);
    kg.addColorStop(0, "#fff3c8"); kg.addColorStop(0.5, "#d6b25c"); kg.addColorStop(1, "#6c5020");
    g.fillStyle = kg; g.beginPath(); g.arc(kx, ky, 0.021, 0, Math.PI * 2); g.fill();
    if (F.px > 90) { g.fillStyle = "rgba(70,50,20,0.8)"; for (const yy of [y + 0.016, y + h - 0.016]) { g.beginPath(); g.arc(kx, yy, 0.004, 0, Math.PI * 2); g.fill(); } }
  }
  function hausnummerSchild(g, F, x, y, nr) {
    /* Blaues Emailleschild, gewölbt, weißer Rand, weiße Ziffern */
    const w = 0.2, h = 0.15;
    const sv = F.schatten(0.012);
    if (sv) { g.fillStyle = "rgba(0,0,0,0.3)"; rrect(g, x + sv[0], y + sv[1], w, h, 0.02); g.fill(); }
    const gr = g.createLinearGradient(x, y, x, y + h);
    gr.addColorStop(0, "#3355a8"); gr.addColorStop(0.5, "#1c3a8a"); gr.addColorStop(1, "#15296a");
    g.fillStyle = gr; rrect(g, x, y, w, h, 0.02); g.fill();
    if (F.px > 22) {
      g.strokeStyle = "#f2f2f0"; g.lineWidth = 0.009; rrect(g, x + 0.014, y + 0.014, w - 0.028, h - 0.028, 0.012); g.stroke();
      g.fillStyle = "#f8f8f6"; g.font = "bold 0.095px 'DejaVu Sans', sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText(String(nr), x + w / 2, y + h / 2 + 0.004);
      /* Glanz der Emaille und kleine Abplatzer */
      g.fillStyle = "rgba(255,255,255,0.28)"; rrect(g, x + 0.02, y + 0.016, w * 0.55, h * 0.22, 0.01); g.fill();
      if (F.px > 70) { g.fillStyle = "#1a1a1a"; g.beginPath(); g.arc(x + w - 0.03, y + h - 0.025, 0.006, 0, Math.PI * 2); g.fill(); g.beginPath(); g.arc(x + 0.02, y + h - 0.02, 0.004, 0, Math.PI * 2); g.fill(); }
    } else {
      g.fillStyle = "rgba(255,255,255,0.8)"; g.fillRect(x + w * 0.35, y + h * 0.25, w * 0.3, h * 0.5);
    }
  }
  function briefkasten(g, F, x, y) {
    /* grüner Blech-Briefkasten mit Klappe und Messingschild */
    const w = 0.34, h = 0.36, t = 0.12, c = [48, 78, 58];
    vorsprung(g, F, x, y, w, h, t, c, {
      oben: [70, 104, 80],
      vorn: (gg, vx, vy, vw, vh) => {
        const gr = gg.createLinearGradient(0, vy, 0, vy + vh);
        gr.addColorStop(0, rgb(hell(c, 0.12))); gr.addColorStop(1, rgb(hell(c, -0.18)));
        gg.fillStyle = gr; gg.fillRect(vx, vy, vw, vh);
        if (F.px > 20) {
          gg.fillStyle = rgb(hell(c, -0.35)); gg.fillRect(vx + 0.04, vy + 0.06, vw - 0.08, 0.02);
          gg.fillStyle = rgb(hell(c, 0.2)); gg.fillRect(vx + 0.04, vy + 0.045, vw - 0.08, 0.015);
          gg.fillStyle = "#c8a852"; gg.fillRect(vx + vw / 2 - 0.07, vy + 0.15, 0.14, 0.05);
          if (F.px > 70) { gg.fillStyle = "#3a2c18"; gg.font = "bold 0.03px 'DejaVu Sans', sans-serif"; gg.textAlign = "center"; gg.textBaseline = "middle"; gg.fillText("BRIEFE", vx + vw / 2, vy + 0.176); }
          gg.fillStyle = "#1f1f1f"; gg.beginPath(); gg.arc(vx + vw / 2, vy + 0.28, 0.01, 0, Math.PI * 2); gg.fill();
        }
      }
    });
    if (F.jahr === "winter") schneeKante(g, F, x, y, w, t, 0.03);
  }
  /* Wandlaterne: Ausleger aus Schmiedeeisen, Laterne mit Glas */
  function laterneMalen(g, F, x, y, an) {
    const B = blick(F), t = 0.32, d = B.tief(-t), dh = B.tief(-0.05);
    const sv = F.schatten(t);
    /* Wandplatte */
    g.fillStyle = "#26211d"; rrect(g, x - 0.04, y - 0.05, 0.08, 0.2, 0.02); g.fill();
    /* Schatten des Auslegers und der Laterne */
    if (sv) {
      g.fillStyle = "rgba(30,26,30,0.28)";
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + sv[0], y + sv[1] + 0.02); g.lineTo(x + sv[0], y + sv[1] + 0.04); g.lineTo(x, y + 0.03); g.fill();
      rrect(g, x + sv[0] - 0.08, y + sv[1] + 0.04, 0.16, 0.3, 0.03); g.fill();
    }
    /* Ausleger: geschwungener Arm von der Wand zur Laterne */
    const lx = x + d[0], ly = y + d[1];
    g.strokeStyle = "#1e1a17"; g.lineWidth = 0.022;
    g.beginPath(); g.moveTo(x + dh[0], y + dh[1]); g.quadraticCurveTo((x + lx) / 2, y - 0.08 + d[1] / 2, lx, ly); g.stroke();
    g.lineWidth = 0.012;
    g.beginPath(); g.moveTo(x + dh[0], y + 0.12 + dh[1]); g.quadraticCurveTo(x + d[0] * 0.3, y + 0.1 + d[1] * 0.3, (x + lx) / 2, y - 0.03 + d[1] / 2); g.stroke();
    if (F.px > 30) { g.beginPath(); g.arc(x + d[0] * 0.55, y + d[1] * 0.55 - 0.02, 0.03, 0, Math.PI * 1.5); g.stroke(); }
    /* Laterne: Dach, Glaskörper mit Sprossen, Boden */
    const top = ly + 0.02, lw = 0.15, lh = 0.24;
    g.fillStyle = "#1c1916";
    g.beginPath(); g.moveTo(lx - lw * 0.7, top + 0.06); g.lineTo(lx, top - 0.03); g.lineTo(lx + lw * 0.7, top + 0.06); g.closePath(); g.fill();
    g.fillRect(lx - 0.012, top - 0.06, 0.024, 0.04);
    const gl = top + 0.06, gh = lh - 0.08;
    g.beginPath(); g.moveTo(lx - lw / 2, gl); g.lineTo(lx + lw / 2, gl); g.lineTo(lx + lw * 0.38, gl + gh); g.lineTo(lx - lw * 0.38, gl + gh); g.closePath();
    if (an > 0) {
      const gr = g.createRadialGradient(lx, gl + gh * 0.55, 0, lx, gl + gh * 0.5, lw);
      gr.addColorStop(0, "rgb(255,246,210)"); gr.addColorStop(0.5, "rgb(255,208,120)"); gr.addColorStop(1, "rgb(220,140,60)");
      g.fillStyle = gr;
    } else {
      const gr = g.createLinearGradient(lx - lw / 2, gl, lx + lw / 2, gl + gh);
      gr.addColorStop(0, "rgb(190,204,214)"); gr.addColorStop(0.5, "rgb(110,122,134)"); gr.addColorStop(1, "rgb(70,76,86)");
      g.fillStyle = gr;
    }
    g.fill();
    g.strokeStyle = "#1c1916"; g.lineWidth = 0.012; g.stroke();
    g.beginPath(); g.moveTo(lx, gl); g.lineTo(lx, gl + gh); g.stroke();
    g.fillStyle = "#1c1916"; g.fillRect(lx - lw * 0.42, gl + gh, lw * 0.84, 0.025);
    g.beginPath(); g.moveTo(lx - 0.02, gl + gh + 0.025); g.lineTo(lx, gl + gh + 0.06); g.lineTo(lx + 0.02, gl + gh + 0.025); g.fill();
    if (F.jahr === "winter") { g.fillStyle = "rgba(240,246,252,0.95)"; g.beginPath(); g.ellipse(lx, top + 0.02, lw * 0.55, 0.03, 0, Math.PI, 0); g.fill(); }
    return [lx, gl + gh / 2];
  }

  /* Schildleuchte: Schwanenhals aus dunklem Eisen, kleiner Schirm, der
     aufs Schild strahlt. an: 0 (Tag) … 1 (Nacht, die Unterseite glüht) */
  function schildLeuchte(g, F, x, y, an) {
    const B = blick(F), d = B.tief(-0.34), dm = B.tief(-0.18);
    g.fillStyle = "#2a2622"; rrect(g, x - 0.03, y - 0.035, 0.06, 0.07, 0.01); g.fill();
    g.strokeStyle = "#302a24"; g.lineWidth = 0.016; g.lineCap = "round";
    const sx = x + d[0], sy = y + d[1] - 0.02;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + dm[0], y - 0.14 + dm[1], sx, sy - 0.02); g.stroke();
    g.fillStyle = "#24201c";
    g.beginPath(); g.moveTo(sx - 0.065, sy + 0.05); g.lineTo(sx - 0.022, sy - 0.025); g.lineTo(sx + 0.022, sy - 0.025); g.lineTo(sx + 0.065, sy + 0.05); g.closePath(); g.fill();
    if (an > 0) { g.fillStyle = "rgba(255,238,196," + Math.min(1, an).toFixed(3) + ")"; g.beginPath(); g.ellipse(sx, sy + 0.05, 0.06, 0.014, 0, 0, Math.PI * 2); g.fill(); }
    if (F.jahr === "winter") { g.fillStyle = "rgba(240,245,252,0.95)"; g.beginPath(); g.ellipse(sx, sy - 0.022, 0.034, 0.014, 0, Math.PI, 0); g.fill(); }
    return [sx, sy + 0.05];
  }
  /* ---------------- Ladenschild (handgemalt) ---------------- */
  function ladenschild(g, F, x, y, w, h, V) {
    const t = 0.04, c = V.schild;
    const sv = F.schatten(t);
    if (sv) { g.fillStyle = "rgba(30,24,20,0.35)"; g.fillRect(x + sv[0], y + sv[1], w, h); }
    const B = blick(F), d = B.tief(-t);
    if (d[1] > 0) fuelle(g, [[x, y], [x + w, y], [x + w + d[0], y + d[1]], [x + d[0], y + d[1]]], rgb(hell(c, 0.25)));
    const x1 = x + d[0], y1 = y + d[1];
    /* Brett mit Profilleiste */
    const gr = g.createLinearGradient(0, y1, 0, y1 + h);
    gr.addColorStop(0, rgb(hell(c, 0.12))); gr.addColorStop(0.5, rgb(c)); gr.addColorStop(1, rgb(hell(c, -0.18)));
    g.fillStyle = gr; g.fillRect(x1, y1, w, h);
    flecken(g, x1, y1, w, h, 0.9, 0.25, "dunkel", 33);
    g.strokeStyle = "rgb(196,160,78)"; g.lineWidth = Math.max(0.008, 0.9 / F.px);
    g.strokeRect(x1 + 0.03, y1 + 0.03, w - 0.06, h - 0.06);
    if (F.px > 9) {
      /* Schrift in Gold mit dunklem Schatten – handgemalt, etwas unruhig */
      const txt = V.geschaeft.text + " " + V.name;
      const fs = Math.min(h * 0.55, w / (txt.length * 0.52));
      g.font = "italic bold " + fs.toFixed(3) + "px 'DejaVu Serif', serif"; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillStyle = "rgba(20,14,10,0.6)"; g.fillText(txt, x1 + w / 2 + fs * 0.05, y1 + h / 2 + fs * 0.06);
      const tg = g.createLinearGradient(0, y1 + h * 0.25, 0, y1 + h * 0.75);
      tg.addColorStop(0, "#f7e3a0"); tg.addColorStop(0.5, "#d4a84c"); tg.addColorStop(1, "#9c7228");
      g.fillStyle = tg; g.fillText(txt, x1 + w / 2, y1 + h / 2);
      /* Schnörkel links und rechts */
      if (F.px > 30) {
        g.strokeStyle = "rgba(214,178,92,0.9)"; g.lineWidth = 0.01;
        for (const s of [-1, 1]) {
          const sx = x1 + w / 2 + s * (w / 2 - 0.12);
          g.beginPath(); g.moveTo(sx - s * 0.06, y1 + h / 2); g.bezierCurveTo(sx, y1 + h * 0.2, sx + s * 0.05, y1 + h * 0.8, sx + s * 0.02, y1 + h / 2); g.stroke();
        }
      }
    }
    /* Kanten, Abplatzer */
    g.fillStyle = "rgba(255,255,255,0.18)"; g.fillRect(x1, y1, w, 0.01);
    g.fillStyle = "rgba(0,0,0,0.3)"; g.fillRect(x1, y1 + h - 0.012, w, 0.012);
    if (F.jahr === "winter") {
      schneeKante(g, F, x, y, w, t, 0.035);
    }
  }
  /* Tannengirlande mit roten Schleifen (Winter), durchhängend */
  function girlande(g, F, x0, x1, y, durch, n) {
    const r = ST.zufall(ST.textHash(F.name + "gi" + x0.toFixed(1)));
    const pt = (t) => { const bog = Math.floor(t * n), f = t * n - bog; return [x0 + (x1 - x0) * t, y + Math.sin(f * Math.PI) * durch]; };
    const steps = Math.round((x1 - x0) * 30);
    for (let i = 0; i <= steps; i++) {
      const [px, py] = pt(i / steps);
      for (let k = 0; k < 3; k++) { const a = r() * Math.PI * 2, l = 0.05 + r() * 0.05; g.strokeStyle = rgb(PI.streu([32, 70, 42], r, 0.25)); g.lineWidth = 0.014; g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l * 0.7); g.stroke(); }
    }
    for (let i = 0; i <= n; i++) schleife(g, x0 + (x1 - x0) * i / n, y, 0.055, F);
    if (F.px > 30) for (let i = 0; i < n * 3; i++) { const [px, py] = pt(r()); g.fillStyle = r() < 0.5 ? "#c01830" : "#d9b24a"; g.beginPath(); g.arc(px, py + 0.02, 0.018, 0, Math.PI * 2); g.fill(); }
  }
  /* Kletterrose am Spalier (Frühling) */
  /* Kletterrose am Spalier. RUNDE 2 (Kritik: „wächst genau durch die
     Wandlaterne", „rosa Kugeln"): steht jetzt rechts neben dem Laden des
     Stubenfensters, fern der Laterne. Die Triebe fächern vom Stock aus
     nach oben, die Blätter sitzen als gefiederte Gruppen (fünf kleine,
     spitzovale Fiederblättchen), die Blüten sind gefüllte Rosen aus zwei
     Blütenblattkränzen mit dunklerer Mitte, dazu Knospen. */
  function kletterrose(g, F, x, yUnten, hoehe, breite) {
    const r = ST.zufall(ST.textHash(F.name + "rose"));
    const knoten = [];
    const nT = 6;
    for (let i = 0; i < nT; i++) {
      const ziel = x + (i / (nT - 1) - 0.5) * breite * (0.7 + r() * 0.3), hT = hoehe * (0.62 + r() * 0.38);
      let px = x + (r() - 0.5) * 0.05, py = yUnten;
      const pts = [[px, py]];
      for (let k = 1; k <= 7; k++) {
        const q = k / 7, nx = x + (ziel - x) * Math.pow(q, 0.7) + (r() - 0.5) * 0.06, ny = yUnten - hT * q;
        pts.push([nx, ny]);
      }
      /* Trieb: unten holzig und dicker, oben grün und dünn */
      for (let k = 1; k < pts.length; k++) {
        const q = k / (pts.length - 1);
        g.strokeStyle = rgb(misch([84, 64, 44], [70, 96, 48], q)); g.lineWidth = Math.max(0.6 / F.px, 0.024 - q * 0.014);
        g.beginPath(); g.moveTo(pts[k - 1][0], pts[k - 1][1]);
        g.quadraticCurveTo(pts[k - 1][0] + (r() - 0.5) * 0.05, (pts[k - 1][1] + pts[k][1]) / 2, pts[k][0], pts[k][1]); g.stroke();
        if (q > 0.25) knoten.push([pts[k][0], pts[k][1], q]);
      }
    }
    if (F.px < 12) {
      /* weit weg: ein Polster aus Grün mit ein paar rosa Tupfen */
      for (const [px, py] of knoten) { g.fillStyle = rgb(PI.streu([56, 92, 44], r, 0.2)); g.beginPath(); g.ellipse(px, py, 0.09, 0.07, 0, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = "rgb(212,104,132)";
      for (const [px, py, q] of knoten) if (q > 0.5 && r() < 0.5) { g.beginPath(); g.arc(px + (r() - 0.5) * 0.1, py, 0.04, 0, Math.PI * 2); g.fill(); }
      return;
    }
    /* Blätter: gefiederte Gruppen; Unterseite (dunkler, leicht versetzt) zuerst */
    const blatt = (bx, by, a, l, c) => {
      g.fillStyle = rgb(c);
      g.beginPath(); g.ellipse(bx, by, l, l * 0.55, a, 0, Math.PI * 2); g.fill();
    };
    for (const [px, py] of knoten) for (let k = 0; k < 3; k++) {
      const a0 = r() * Math.PI * 2, bx = px + Math.cos(a0) * 0.07, by = py + Math.sin(a0) * 0.06;
      const c = PI.streu([54, 92, 42], r, 0.2), d = hell(c, -0.3), ra = a0 + (r() - 0.5);
      for (let f = -2; f <= 2; f++) {
        const t = f * 0.022, fx = bx + Math.cos(ra) * t - Math.sin(ra) * Math.abs(f) * 0.012, fy = by + Math.sin(ra) * t + Math.cos(ra) * Math.abs(f) * 0.012;
        blatt(fx + 0.004, fy + 0.005, ra + f * 0.5, 0.019, d);
        blatt(fx, fy, ra + f * 0.5, 0.018, f === 0 ? hell(c, 0.08) : c);
      }
    }
    /* Blüten: gefüllte Rosen und Knospen, bevorzugt oben */
    const rose = (bx, by, br) => {
      const c = PI.streu([214, 96, 128], r, 0.1);
      g.fillStyle = rgb(hell(c, -0.2));
      for (let k = 0; k < 5; k++) { const a = k * 1.2566 + r() * 0.3; g.beginPath(); g.arc(bx + Math.cos(a) * br * 0.45, by + Math.sin(a) * br * 0.4, br * 0.55, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = rgb(c);
      for (let k = 0; k < 4; k++) { const a = k * 1.57 + 0.7; g.beginPath(); g.arc(bx + Math.cos(a) * br * 0.25, by + Math.sin(a) * br * 0.22 - br * 0.05, br * 0.42, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = rgb(hell(c, 0.22)); g.beginPath(); g.arc(bx - br * 0.12, by - br * 0.18, br * 0.3, 0, Math.PI * 2); g.fill();
      if (F.px * br > 3) { g.strokeStyle = rgb(hell(c, -0.35), 0.8); g.lineWidth = Math.max(0.6 / F.px, br * 0.08); g.beginPath(); g.arc(bx, by - br * 0.05, br * 0.2, 0.3, 4.2); g.stroke(); }
    };
    for (const [px, py, q] of knoten) {
      if (r() > 0.35 + q * 0.4) continue;
      const n = 1 + Math.floor(r() * 3);
      for (let k = 0; k < n; k++) {
        const bx = px + (r() - 0.5) * 0.12, by = py + (r() - 0.5) * 0.1;
        if (r() < 0.25) { g.fillStyle = "rgb(168,44,70)"; g.beginPath(); g.ellipse(bx, by, 0.012, 0.02, (r() - 0.5), 0, Math.PI * 2); g.fill(); g.fillStyle = "rgb(70,100,48)"; g.fillRect(bx - 0.008, by + 0.012, 0.016, 0.008); }
        else rose(bx, by, 0.026 + r() * 0.014);
      }
    }
  }

  /* =====================================================================
     DACH-WERKSTOFFE: Biberschwanz, Schnee, Kupfer, Klinker
     ===================================================================== */
  /* Biberschwanz-Doppeldeckung: jede Reihe liegt auf der darunter (von der
     Traufe zum First gemalt), sichtbar bleibt der runde Schwanz; er wirft
     einen feinen Schatten auf die Reihe darunter. In der Dachfläche:
     x entlang der Traufe, y vom First zur Traufe. Farben in wenigen
     „Eimern" gesammelt – je Eimer und Reihe ein Pfad (schnell). */
  /* RUNDE 2 (Kritik: „Ziegelfarbe zu gesättigt"): alle Töne um 12 % zum
     eigenen Grau hin entsättigt – alter Ton liegt stumpfer als neuer */
  const ZIEGEL = [[158, 72, 48], [148, 64, 44], [168, 82, 56], [138, 60, 42], [172, 90, 62], [134, 60, 44], [142, 96, 70], [154, 84, 58]]
    .map((c) => { const l = c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11; return c.map((v) => Math.round(v + (l - v) * 0.12)); });
  const ZIEGEL_W = [0.2, 0.2, 0.16, 0.14, 0.1, 0.08, 0.05, 0.07];
  const ZB = 0.18, ZR = 0.155;                          // Biberschwanz: Breite, Reihenabstand (Doppeldeckung)
  const ZIEGEL_RGB = ZIEGEL.map((c) => rgb(c));
  function ziegelWahl(r) { let t = r(), k = 0; while (k < ZIEGEL_W.length - 1 && t > ZIEGEL_W[k]) { t -= ZIEGEL_W[k]; k++; } return k; }
  /* Detailstufe aus den Pixeln je REIHE (quer, F.pxV) und je ZIEGEL (längs,
     F.pxU) getrennt. RUNDE 1: Vorher entschied min(pxU, pxV) – in schrägen
     Winkeln quetschten sich die Reihen auf 2–4 Pixel, die senkrechten Fugen
     liefen zu durchgehenden Streifen zusammen: das Dach sah aus wie
     Wellblech (Moiré). Jetzt: unter 4,2 Pixeln je Reihe nur Reihenbänder
     mit versetzter Farbstreuung, darüber blenden die Fugen weich ein. */
  function biberschwanz(g, F, x, y, w, h, saat, opt) {
    opt = opt || {};
    const r = ST.zufall(saat);
    const zb = ZB, zr = ZR;
    const rowPx = (F.pxV || F.px) * zr, colPx = (F.pxU || F.px) * zb;
    const reihen = Math.ceil(h / zr) + 2;
    /* RUNDE 2: leichte Reihenwelle (±1,5 cm auf 3 m) – ein altes Dach
       liegt nie linealgerade, die Lattung hat sich gesetzt */
    const ph = r() * 6.3;
    const welle = opt.welle === false ? () => 0 : (xx) => 0.015 * Math.sin(xx * 2.094 + ph);
    if (rowPx < 2.2) {
      /* weit weg: Reihen als Streifen mit Farbschwankung, dazu Flecken */
      g.fillStyle = "rgb(128,58,40)"; g.fillRect(x, y, w, h);
      for (let yy = y; yy < y + h; yy += zr) { g.fillStyle = rgb(PI.streu(ZIEGEL[Math.floor(r() * 3)], r, 0.05)); g.fillRect(x, yy, w, zr * 0.8); }
      flecken2(g, x, y, w, h, 2.8, 0.2, "dunkel", saat);
      return;
    }
    if (rowPx < 4.2) {
      /* mittlere Entfernung: jede Reihe ein Band aus einzelnen Ziegelfarben
         (versetzt), dünne Schattenlinie unter der Reihe – keine Bögen, keine Fugen */
      const kf = klemm((rowPx - 2.2) / 2, 0, 1);
      g.fillStyle = "rgb(118,52,36)"; g.fillRect(x, y, w, h);
      for (let ri = 0; ri < reihen; ri++) {
        const yy = y - zr + ri * zr, vers = (ri % 2) * zb / 2;
        const pf = ZIEGEL.map(() => new Path2D());
        for (let xx = x - zb + vers; xx < x + w + zb; xx += zb) pf[ziegelWahl(r)].rect(xx, yy + zr * 0.02 + welle(xx), zb, zr * 0.98);
        for (let k = 0; k < pf.length; k++) { g.fillStyle = ZIEGEL_RGB[k]; g.fill(pf[k]); }
        g.fillStyle = "rgba(46,16,10," + (0.18 + 0.2 * kf).toFixed(3) + ")"; g.fillRect(x, yy + zr * 0.82, w, zr * 0.18);
      }
      flecken2(g, x, y, w, h, 3.4, 0.1, "dunkel", saat + 5);
      flecken(g, x, y, w, h, 2.6, 0.1, "hell", saat);
      return;
    }
    /* nah: echte Schwänze. Fugen- und Reihenschatten blenden mit der Größe ein */
    const kf = klemm((rowPx - 3) / 4, 0, 1);
    g.fillStyle = rgb(misch([136, 62, 42], [82, 36, 26], kf)); g.fillRect(x, y, w, h);
    const fein = colPx > 9;
    const lang = zr * 2.1, b = colPx < 5 ? zb : zb * 0.955, rad = b / 2;
    const schwanz = (p, x0, y0) => { p.moveTo(x0, y0); p.lineTo(x0, y0 + lang - rad); p.arc(x0 + rad, y0 + lang - rad, rad, Math.PI, 0, true); p.lineTo(x0 + b, y0); p.closePath(); };
    const wg = g.createLinearGradient(0, zr, 0, lang);
    wg.addColorStop(0, "rgba(30,10,6," + (0.34 * kf).toFixed(3) + ")"); wg.addColorStop(0.45, "rgba(30,10,6,0.04)"); wg.addColorStop(0.9, "rgba(255,226,196,0.1)"); wg.addColorStop(1, "rgba(255,226,196,0)");
    for (let ri = reihen - 1; ri >= 0; ri--) {
      const yy = y - zr + ri * zr;
      const vers = (ri % 2) * zb / 2;
      /* Schatten der Reihe auf die darunterliegende */
      g.fillStyle = "rgba(38,12,6," + (0.42 * kf).toFixed(3) + ")";
      g.beginPath();
      for (let xx = x - zb + vers; xx < x + w + zb; xx += zb) schwanz(g, xx + (zb - b) / 2 + 0.01, yy + 0.02 + welle(xx));
      g.fill();
      const pf = ZIEGEL.map(() => new Path2D());
      for (let xx = x - zb + vers; xx < x + w + zb; xx += zb) schwanz(pf[ziegelWahl(r)], xx + (zb - b) / 2, yy + welle(xx));
      for (let k = 0; k < pf.length; k++) { g.fillStyle = ZIEGEL_RGB[k]; g.fill(pf[k]); }
      /* Wölbung: oben im Schatten der Reihe darüber, zum Schwanz hin heller */
      g.save(); g.translate(0, yy); g.fillStyle = wg; g.fillRect(x, zr, w, lang - zr); g.restore();
      if (fein) {
        g.strokeStyle = "rgba(58,20,12,0.4)"; g.lineWidth = Math.max(0.003, 0.7 / F.px);
        g.beginPath();
        for (let xx = x - zb + vers; xx < x + w + zb; xx += zb) { const x0 = xx + (zb - b) / 2, y0 = yy + welle(xx); g.moveTo(x0 + b, y0 + lang * 0.55); g.lineTo(x0 + b, y0 + lang - rad); g.arc(x0 + rad, y0 + lang - rad, rad, 0, Math.PI, false); }
        g.stroke();
      }
    }
    /* RUNDE 2 (Kritik: „große halbdurchsichtige dunkle Wolkenflecken wie
       ein Schmutzfilm"): die großen Flecken nur noch ganz leise (≤ 0,1);
       die Alterung macht dachAlterung() nach Regeln */
    flecken2(g, x, y, w, h, 3.4, 0.1, "dunkel", saat + 5);
    flecken(g, x, y, w, h, 2.6, 0.1, "hell", saat);
    if (F.px > 40) flecken(g, x, y, w, h, 0.5, 0.3, "korn", saat + 3);
  }
  /* RUNDE 2: Alterung eines Biberdachs nach Regeln statt Zufallswolken
     (Kritik: „Echte Alterung folgt Regeln"):
     1. über der Rinne (die untersten 1,2 m) bleibt es lange feucht – dort
        dunkler und grünlich (Moos [96,98,62], höchstens 20 %),
     2. unter Gaube und Kamin laufen Wasserspuren hinab,
     3. Flechtentupfen (blassgelbgrau, 2–4 cm) auf rund 3 % der Ziegel,
     4. zum First hin bleichen die Ziegel in Sonne und Wind aus.
     moos = Stärke (Wetterseite West und Nord stärker). */
  function dachAlterung(g, F, art, D, saat, moos) {
    const auf = /auf/.test(art), w = F.w, h = F.h, r = ST.zufall(saat + 77);
    /* 1. Traufzone: auf dem Aufschiebling ganz, auf der Hauptfläche die
       unteren 0,45 m (zusammen 1,2 m über der Rinne) */
    const zy0 = auf ? -0.2 : h - 0.45, zh = auf ? h + 0.4 : 0.65;
    const gr = g.createLinearGradient(0, auf ? 0 : h - 0.45, 0, h);
    const k = 0.55 + 0.45 * moos;
    gr.addColorStop(0, "rgba(90,92,58," + (auf ? 0.1 * k : 0).toFixed(3) + ")");
    gr.addColorStop(1, "rgba(90,92,58," + ((auf ? 0.2 : 0.1) * k).toFixed(3) + ")");
    g.fillStyle = gr; g.fillRect(-0.2, zy0, w + 0.4, zh);
    if (F.px > 10) {
      g.save(); g.beginPath(); g.rect(-0.2, zy0, w + 0.4, zh); g.clip();
      flecken(g, -0.2, zy0, w + 0.4, zh, 0.8, (auf ? 0.55 : 0.3) * k, "moos", saat + 3);
      g.restore();
    }
    /* 2. Wasserspuren unter Gaube und Kamin: drei weiche, nach unten
       schmaler werdende Bahnen übereinander */
    for (const A of dachAufbauten(art, D)) {
      let a0 = Infinity, a1 = -Infinity, b1 = -Infinity;
      for (const [a, b] of A.fuss) { a0 = Math.min(a0, a); a1 = Math.max(a1, a); b1 = Math.max(b1, b); }
      if (b1 < 0) continue;
      const L = Math.min(h - b1, A.art === "kamin" ? 2.2 : 1.6);
      if (L <= 0.1) continue;
      for (let i = 0; i < 3; i++) {
        const e = 0.06 + i * 0.1, sp = g.createLinearGradient(0, b1, 0, b1 + L * (1 - i * 0.2));
        sp.addColorStop(0, "rgba(66,70,44," + (0.09 * k).toFixed(3) + ")"); sp.addColorStop(1, "rgba(66,70,44,0)");
        g.fillStyle = sp;
        g.beginPath(); g.moveTo(a0 + e, b1); g.lineTo(a1 - e, b1);
        g.lineTo(a1 - e - L * 0.08, b1 + L * (1 - i * 0.2)); g.lineTo(a0 + e + L * 0.08, b1 + L * (1 - i * 0.2)); g.closePath(); g.fill();
      }
    }
    /* 4. zum First hin ausgebleicht */
    const bl = g.createLinearGradient(0, 0, 0, Math.min(h, 2.6));
    bl.addColorStop(0, "rgba(214,200,184," + (auf ? 0 : 0.1).toFixed(3) + ")"); bl.addColorStop(1, "rgba(214,200,184,0)");
    if (!auf) { g.fillStyle = bl; g.fillRect(-0.2, -0.2, w + 0.4, Math.min(h, 2.6) + 0.2); }
    /* 3. Flechten: nur, wenn ein Tupfen wenigstens 1 Pixel groß wird */
    if (F.px > 26) {
      const n = Math.round(w * h / (ZB * ZR) * 0.03);
      for (let i = 0; i < n; i++) {
        const a = r() * w, b = r() * h, rr = 0.01 + r() * 0.01;
        g.fillStyle = "rgba(170,168,128,0.55)"; g.beginPath(); g.ellipse(a, b, rr, rr * 0.75, r() * 3, 0, Math.PI * 2); g.fill();
        g.fillStyle = "rgba(196,194,156,0.45)"; g.beginPath(); g.ellipse(a - rr * 0.2, b - rr * 0.2, rr * 0.5, rr * 0.4, 0, 0, Math.PI * 2); g.fill();
      }
    }
  }

  /* ---------------- Geometrie auf einer Walmfläche ----------------
     Grundriss (x, y) → Dachfläche (a, b): a entlang der Traufe, b vom First
     die Falllinie hinab. hoch = [Verschiebung hangaufwärts, senkrechter
     Abstand] je Meter senkrechter Höhe über der Dachebene. */
  function dachAB(art, D) {
    if (art === "ost") return (x, y) => [D.yS - y, x / CA];
    if (art === "west") return (x, y) => [y - D.yN, -x / CA];
    if (art === "schopf-s") return (x, y) => [x + D.xGS, (y - D.yRS) / CB];
    return (x, y) => [D.xGN - x, (D.yRN - y) / CB];
  }
  function dachZ(art, D, x, y) {
    if (art === "ost") return D.zR - x * TA;
    if (art === "west") return D.zR + x * TA;
    if (art === "schopf-s") return D.zR - (y - D.yRS) * TB;
    return D.zR - (D.yRN - y) * TB;
  }
  const dachHoch = (art) => (/schopf/.test(art) ? [SB, CB] : [SA, CA]);
  function imVieleck(p, q) {
    let drin = false;
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      if ((p[i][1] > q[1]) !== (p[j][1] > q[1]) && q[0] < (p[j][0] - p[i][0]) * (q[1] - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0]) drin = !drin;
    }
    return drin;
  }
  function abstandStrecke(q, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy || 1e-9;
    const t = klemm(((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / l2, 0, 1);
    return Math.hypot(q[0] - a[0] - dx * t, q[1] - a[1] - dy * t);
  }
  /* Grate einer Fläche: schräge Kanten, die am First beginnen */
  function grate(um, h) {
    const aus = [];
    for (let i = 0; i < um.length; i++) {
      const a = um[i], b = um[(i + 1) % um.length];
      if (Math.abs(a[0] - b[0]) > 0.05 && Math.abs(a[1] - b[1]) > 0.05 && Math.min(a[1], b[1]) < 0.01 && Math.max(a[1], b[1]) < h - 0.05) aus.push([a, b]);
    }
    return aus;
  }
  /* Was auf einer Walmfläche steht (Kamin, Gaube) – in Flächenkoordinaten */
  function dachAufbauten(art, D) {
    const map = dachAB(art, D), aus = [];
    /* Kamin: Schaft 0,6 × 0,64, oben Kopf und Platte (steht auf dem First) */
    if (art === "ost" || art === "west") {
      const x0 = -0.3, x1 = 0.3, y0 = KAMIN_Y - 0.32, y1 = KAMIN_Y + 0.32;
      aus.push({ art: "kamin", x0, x1, y0, y1, zTop: Z_FI + 1.4, fuss: [map(x0, y0), map(x1, y0), map(x1, y1), map(x0, y1)] });
    }
    if (art === "ost" || art === "west") {
      const s = art === "ost" ? 1 : -1, G = gaubeMasse();
      const y0 = GAUBE_Y - GAUBE_B / 2, y1 = GAUBE_Y + GAUBE_B / 2;
      const x = (v) => s * v;
      aus.push({
        art: "gaube", s, G,
        fuss: [map(x(G.xHinten), y0), map(x(G.xF), y0), map(x(G.xF), y1), map(x(G.xHinten), y1), map(x(G.xFirst), GAUBE_Y)],
        spitzen: [[x(G.xF), y0, G.zF1], [x(G.xF), y1, G.zF1], [x(G.xF + 0.14), GAUBE_Y, G.zG + 0.1], [x(G.xFirst), GAUBE_Y, G.zG], [x(G.xF + 0.14), y0 - 0.14, G.zF1 - 0.14], [x(G.xF + 0.14), y1 + 0.14, G.zF1 - 0.14]]
      });
    }
    return aus;
  }
  /* Schlagschatten der Aufbauten (Kamin, Gaube) auf die Dachfläche – aus
     F.schatten, damit er in jedem Drehwinkel stimmt */
  function aufbautenSchatten(g, F, art, D, farbe) {
    const map = dachAB(art, D), [su, sn] = dachHoch(art);
    for (const A of dachAufbauten(art, D)) {
      const pts = A.fuss.slice();
      const oben = A.art === "kamin"
        ? [[A.x0, A.y0, A.zTop], [A.x1, A.y0, A.zTop], [A.x1, A.y1, A.zTop], [A.x0, A.y1, A.zTop]]
        : A.spitzen;
      let ok = false;
      for (const [x, y, z] of oben) {
        const hv = z - dachZ(art, D, x, y);
        if (hv <= 0) continue;
        const sv = F.schatten(hv * sn);
        if (!sv) return;
        const [a, b] = map(x, y);
        pts.push([a + sv[0], b - hv * su + sv[1]]);
        ok = true;
      }
      if (!ok) continue;
      g.fillStyle = farbe; vieleck(g, huelle2(pts)); g.fill();
    }
  }

  /* ---------------- First- und Gratziegel ----------------
     RUNDE 2 (Kritik: „der First ist ein Bleistiftstrich, die Grate bloße
     Knicke"): First und die beiden Schopfgrate bekommen echte Geometrie –
     ein Band halbrunder Hohlziegel, 0,22 m breit, je 0,4 m lang und
     überlappend, oben mit Glanzlicht (firstKappen). In den Dachflächen
     selbst liegt nur das Mörtelbett (3 cm hellgrau) und der Schlagschatten
     der Kappe (4 cm) – firstBett. */
  function firstKanten(F) {
    const um = F.flaeche.umriss, aus = [];
    for (let i = 0; i < um.length; i++) {
      const a = um[i], b = um[(i + 1) % um.length];
      const first = a[1] < 0.01 && b[1] < 0.01;
      const grat = (a[1] < 0.01) !== (b[1] < 0.01) && Math.abs(a[0] - b[0]) > 0.05 && Math.max(a[1], b[1]) < F.h - 0.05;
      if (first || grat) aus.push(a[1] <= b[1] ? [a, b] : [b, a]);
    }
    return aus;
  }
  /* Band entlang einer Kante auf der Flächenseite: von d0 bis d1 Abstand */
  function kantenBand(F, p, q, d0, d1) {
    const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1;
    let nx = -dy / L, ny = dx / L;
    /* Normale ins Flächeninnere */
    if (!imVieleck(F.flaeche.umriss, [(p[0] + q[0]) / 2 + nx * 0.25, (p[1] + q[1]) / 2 + ny * 0.25])) { nx = -nx; ny = -ny; }
    const e = 0.05;
    const P = (s, d) => [p[0] + dx / L * s + nx * d, p[1] + dy / L * s + ny * d];
    return [P(-e, d0), P(L + e, d0), P(L + e, d1), P(-e, d1)];
  }
  function firstBett(g, F) {
    for (const [p, q] of firstKanten(F)) {
      if (F.px * 0.03 < 0.6) { fuelle(g, kantenBand(F, p, q, 0.08, 0.14), "rgba(40,16,10,0.3)"); continue; }
      fuelle(g, kantenBand(F, p, q, 0.1, 0.135), "rgb(178,170,158)");
      const sv = F.schatten(0.08);
      const bb = kantenBand(F, p, q, 0.13, 0.13 + (sv ? 0.05 : 0.025));
      fuelle(g, bb, "rgba(34,14,10," + (sv ? 0.38 : 0.22) + ")");
    }
  }
  /* Die Kappen als echte Flächen: je Linie zwei schmale Flächen, die sich
     über der Kante zu einem gerundeten Rücken treffen. Winter: Schneehaube
     (breiter, ohne Ziegel, eigenes Schneelicht). */
  function firstKappen(M, D, winter, V) {
    const nO = [SA, 0, CA], nW = [-SA, 0, CA], nS = [0, SB, CB], nN = [0, -SB, CB];
    const linien = [
      [[0, D.yRN, D.zR], [0, D.yRS, D.zR], nO, nW, "first"],
      [[0, D.yRS, D.zR], [D.xGS, D.yS, D.zGS], nO, nS, "grat-so"], [[0, D.yRS, D.zR], [-D.xGS, D.yS, D.zGS], nW, nS, "grat-sw"],
      [[0, D.yRN, D.zR], [D.xGN, D.yN, D.zGN], nO, nN, "grat-no"], [[0, D.yRN, D.zR], [-D.xGN, D.yN, D.zGN], nW, nN, "grat-nw"]
    ];
    const add = (p, v, k) => [p[0] + v[0] * k, p[1] + v[1] * k, p[2] + v[2] * k];
    const breit = winter ? 0.2 : 0.115, hoch = winter ? 0.07 : 0.085;
    for (const [P0, P1, n1, n2, name] of linien) {
      const dir = ST.norm([P1[0] - P0[0], P1[1] - P0[1], P1[2] - P0[2]]);
      const m = ST.norm([n1[0] + n2[0], n1[1] + n2[1], n1[2] + n2[2]]);
      /* am Grat unten 0,3 m vor der Traufe enden (Kritik: roter Klotz am Schopffuß) */
      const L = Math.hypot(P1[0] - P0[0], P1[1] - P0[1], P1[2] - P0[2]), Q1 = name === "first" ? P1 : add(P0, dir, L - (winter ? 0.3 : 0.12));
      const Q0 = name === "first" ? P0 : add(P0, dir, winter ? 0.05 : 0);
      [n1, n2].forEach((n, i) => {
        let e = ST.norm(ST.kreuz(n, dir)); if (e[2] > 0) e = [-e[0], -e[1], -e[2]];
        const A = add(Q0, m, hoch), B = add(Q1, m, hoch), C = add(add(Q1, e, breit), n, 0.012), Dd = add(add(Q0, e, breit), n, 0.012);
        polyFlaeche(M, "kappe-" + name + i, [A, B, C, Dd], add(n, m, 1), winter ? kappeSchnee : kappeZiegel, { ebene: winter ? 6 : 3, keinLicht: !!winter });
      });
    }
  }
  /* u entlang der Kante, v quer: 0 = Rücken, F.h = Rand am Dach */
  function kappeZiegel(g, F) {
    const r = ST.zufall(ST.textHash(F.name));
    const gr = g.createLinearGradient(0, 0, 0, F.h);
    gr.addColorStop(0, "rgb(176,92,64)"); gr.addColorStop(0.3, "rgb(150,70,48)"); gr.addColorStop(1, "rgb(104,44,30)");
    g.fillStyle = gr; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
    if (F.px * 0.4 > 4) {
      /* Hohlziegel je 0,4 m: breites Ende überlappt den nächsten, davor ein
         dunkler Schattenbogen; jeder Ziegel eigener Ton */
      for (let s = 0; s < F.w; s += 0.4) {
        const c = PI.streu([150, 70, 48], r, 0.1);
        g.fillStyle = rgb(c, 0.5); g.fillRect(s, 0, 0.4, F.h);
        g.strokeStyle = "rgba(40,14,8,0.55)"; g.lineWidth = Math.max(0.01, 1 / F.px);
        g.beginPath(); g.moveTo(s + 0.02, 0); g.quadraticCurveTo(s + 0.05, F.h * 0.6, s + 0.015, F.h); g.stroke();
        g.strokeStyle = "rgba(255,210,180,0.35)"; g.lineWidth = Math.max(0.006, 0.7 / F.px);
        g.beginPath(); g.moveTo(s + 0.035, 0); g.quadraticCurveTo(s + 0.065, F.h * 0.6, s + 0.03, F.h * 0.9); g.stroke();
      }
      if (F.px > 30) flecken(g, 0, 0, F.w, F.h, 0.6, 0.25, "dunkel", 7);
    }
    /* Glanzlicht auf dem Rücken */
    g.fillStyle = "rgba(255,226,200,0.22)"; g.fillRect(-0.1, 0, F.w + 0.2, F.h * 0.18);
  }
  function kappeSchnee(g, F) {
    const M = schneeMul(F, 0.12);
    g.fillStyle = "rgb(252,253,255)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
    flecken(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, 1.3, 0.25, "blau", 19);
    /* gerundet: der Rücken hell, zum Rand ein Hauch Kehle */
    const gr = g.createLinearGradient(0, 0, 0, F.h);
    gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.7, "rgba(170,188,224,0.12)"); gr.addColorStop(1, "rgba(150,170,212,0.3)");
    g.fillStyle = gr; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
    mulFarbe(g, F, M);
    if (F.px > 10) glitzer(g, F, 0, 0, F.w, F.h * 0.5, 3, M);
  }

  /* ---------------- Schneelicht ----------------
     RUNDE 2 (Kritik: „blaue Filzplatte ohne Volumen"): Schnee wirft viel
     mehr Licht zurück als Putz oder Ziegel. Die Schneeflächen rechnen ihr
     Licht deshalb selbst (keinLicht): in der Sonne warmweiß (246,244,238),
     im Schatten kühl (206,218,240), dazwischen weich – und mit der
     Tageszeit gedämpft. So unterscheiden sich die Dachflächen deutlich. */
  const TAG_Z = ST.ZEITEN.tag;
  function schneeMul(F, heller) {
    const Lz = ST.lichtFaktor(F.n, F.zeit, 0, "winter"), Lt = ST.lichtFaktor(F.n, TAG_Z, 0, "winter");
    const k = Math.pow(klemm(F.licht / 0.6, 0, 1), 0.8);
    const ziel = hell(misch([204, 216, 238], [247, 245, 239], k), heller || 0);
    return [0, 1, 2].map((i) => Math.min(1.08, ziel[i] / 255 * Lz[i] / Math.max(0.05, Lt[i])));
  }
  function mulFarbe(g, F, M, rect) {
    g.save(); g.globalCompositeOperation = "multiply";
    g.fillStyle = "rgb(" + M.map((v) => Math.round(Math.min(1, v) * 255)).join(",") + ")";
    if (rect) g.fillRect(rect[0], rect[1], rect[2], rect[3]); else g.fillRect(-1, -1, F.w + 2, F.h + 2);
    g.restore();
  }
  /* Schneefarbe nach dem Licht (für Kanten, Tupfen, Lippen) */
  const schneeRGB = (M, k) => rgb([0, 1, 2].map((i) => Math.min(255, 252 * M[i] * (k || 1))));
  function glitzer(g, F, x, y, w, h, dichte, M) {
    const r = ST.zufall(ST.textHash(F.name) + 99);
    const w0 = F.licht > 0.3 ? [255, 250, 236] : [236, 244, 255];
    g.fillStyle = rgb([0, 1, 2].map((i) => Math.min(255, w0[i] * Math.min(1.1, M[i] * 1.12))), 0.9);
    g.beginPath();
    const n = Math.min(4000, w * h * dichte);
    for (let i = 0; i < n; i++) { const s = (0.6 + r() * 0.8) / F.px; g.rect(x + r() * w, y + r() * h, s, s); }
    g.fill();
  }

  /* ---------------- Schneefanggitter ----------------
     Zwei Zinkrohre (Ø 2 cm) auf L-Winkeln, gut einen Meter über der Traufe.
     RUNDE 2: erst ab F.px > 12, bei streifendem Blick gar nicht; Rohre
     durchgehend mit Glanzlinie, Stützen als kleine Winkel mit Schatten.
     Winter: dahinter ein durchgehendes Schneepolster mit hellem Kamm, das
     untere Rohr steckt darin, das obere liegt halb eingebettet. */
  function schneefang(g, F, w, bS, winter, farbe, M) {
    if (F.px <= 12) return;
    const B = blick(F);
    if (Math.abs(B.en) < 0.25) return;
    const a0 = 0.35, a1 = w - 0.35;
    const d1 = B.tief(-0.1), d2 = B.tief(-0.18), dS = B.tief(-0.15);
    const lw = Math.max(0.02, 1 / F.px);
    const rohr = (d, sch) => {
      g.lineCap = "butt";
      g.strokeStyle = farbe([70, 74, 78]); g.lineWidth = lw * 1.3;
      g.beginPath(); g.moveTo(a0 + d[0], bS + d[1] + lw * 0.2); g.lineTo(a1 + d[0], bS + d[1] + lw * 0.2); g.stroke();
      g.strokeStyle = farbe([150, 156, 160]); g.lineWidth = lw;
      g.beginPath(); g.moveTo(a0 + d[0], bS + d[1]); g.lineTo(a1 + d[0], bS + d[1]); g.stroke();
      if (F.px > 30) { g.strokeStyle = farbe([226, 232, 236]); g.lineWidth = lw * 0.3; g.beginPath(); g.moveTo(a0 + d[0], bS + d[1] - lw * 0.25); g.lineTo(a1 + d[0], bS + d[1] - lw * 0.25); g.stroke(); }
      if (sch) { g.strokeStyle = schneeRGB(M, 1.04); g.lineWidth = lw * 0.9; g.beginPath(); g.moveTo(a0 + d[0], bS + d[1] - lw * 0.7); g.lineTo(a1 + d[0], bS + d[1] - lw * 0.7); g.stroke(); }
    };
    const stuetzen = (ab) => {
      if (Math.abs(B.en) < 0.35) return;
      const n = Math.max(1, Math.round((a1 - a0) / (winter ? 1.8 : 1.2)));
      const sv = F.schatten(0.15);
      for (let i = 0; i <= n; i++) {
        const a = a0 + (a1 - a0) * i / n;
        if (sv && !winter) { g.strokeStyle = "rgba(30,12,8,0.3)"; g.lineWidth = 0.03; g.beginPath(); g.moveTo(a, bS); g.lineTo(a + sv[0], bS + sv[1]); g.stroke(); }
        g.fillStyle = farbe([90, 94, 98]); g.fillRect(a - 0.015, bS - 0.03, 0.03, 0.06);        // Fußplatte
        g.strokeStyle = farbe([110, 114, 118]); g.lineWidth = 0.03;
        g.beginPath(); g.moveTo(a + ab[0] * 0, bS + ab[1] * 0); g.lineTo(a + dS[0], bS + dS[1]); g.stroke();
      }
    };
    if (!winter) {
      const sv = F.schatten(0.14);
      if (sv) {
        g.strokeStyle = "rgba(30,12,8,0.28)"; g.lineWidth = lw;
        g.beginPath();
        for (const t of [0.1, 0.18]) { const sx = sv[0] * t / 0.14, sy = sv[1] * t / 0.14; g.moveTo(a0 + sx, bS + sy); g.lineTo(a1 + sx, bS + sy); }
        g.stroke();
      }
      stuetzen([0, 0]);
      rohr(d1); rohr(d2);
      return;
    }
    /* Winter: Schneepolster hinter dem Gitter (hangaufwärts), deckend */
    const r = ST.zufall(ST.textHash(F.name) + 31);
    const n = Math.max(6, Math.round((a1 - a0) / 0.3)), welle = [];
    for (let i = 0; i <= n; i++) welle.push(0.34 + r() * 0.12);
    const oben = (i) => bS - welle[i];
    stuetzen([0, 0]);
    g.beginPath();
    g.moveTo(a0 - 0.1, bS + 0.02);
    for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; g.lineTo(a, oben(i)); }
    g.lineTo(a1 + 0.1, bS + 0.02);
    for (let i = n; i >= 0; i--) { const a = a0 + (a1 - a0) * i / n; g.lineTo(a + d1[0], bS + d1[1] + 0.01); }
    g.closePath();
    const gp = g.createLinearGradient(0, bS - 0.45, 0, bS + 0.02);
    gp.addColorStop(0, schneeRGB(M, 0.99)); gp.addColorStop(0.6, schneeRGB(M, 1.03)); gp.addColorStop(0.85, schneeRGB(M, 0.97)); gp.addColorStop(1, schneeRGB(M, 0.86));
    g.fillStyle = gp; g.fill();
    /* Kamm des Polsters: helle Kante am Gitter */
    g.strokeStyle = schneeRGB(M, 1.06); g.lineWidth = Math.max(0.015, 1 / F.px);
    g.beginPath(); g.moveTo(a0 + d1[0], bS + d1[1]); g.lineTo(a1 + d1[0], bS + d1[1]); g.stroke();
    rohr(d2, true);
  }

  /* ---------------- Kamin-Durchtritt ----------------
     Winter: der warme Schlot hat einen schmalen Saum freigetaut – EINE Form
     um den Schaft (0,13 m), in beiden Dachflächen gleich gerechnet, damit
     sie über den First läuft; außen weich auslaufend. Die Verwahrung aus
     Zink ist echte Geometrie (kaminVerwahrung). */
  function kaminFuss(g, F, fuss, winter, saat, M, Lz, yWelt) {
    let a0 = Infinity, a1 = -Infinity, b1 = -Infinity;
    for (const [a, b] of fuss) { a0 = Math.min(a0, a); a1 = Math.max(a1, a); b1 = Math.max(b1, b); }
    /* Saum um den Schaft: Abstand e plus Rauschen in WELT-Koordinaten (y
       längs des Firsts, b quer) – beide Dachflächen rechnen dieselbe Form,
       sie läuft ohne Knick über den First */
    const yw = yWelt || ((a) => a);
    const saum = (e) => {
      const pts = [], n = 40, x0 = a0 - 0.02, x1 = a1 + 0.02, yU = b1 + 0.02;
      for (let i = 0; i < n; i++) {
        /* Umlauf um das Rechteck [x0,x1] × [−∞, yU]: linke Seite, Unterkante, rechte Seite */
        const t = i / (n - 1);
        let px, py, nx, ny;
        if (t < 0.25) { px = x0; py = -0.3 + (yU + 0.3) * t / 0.25; nx = -1; ny = 0; }
        else if (t < 0.3) { const k = (t - 0.25) / 0.05 * Math.PI / 2; px = x0; py = yU; nx = -Math.cos(k); ny = Math.sin(k); }
        else if (t < 0.7) { px = x0 + (x1 - x0) * (t - 0.3) / 0.4; py = yU; nx = 0; ny = 1; }
        else if (t < 0.75) { const k = (t - 0.7) / 0.05 * Math.PI / 2; px = x1; py = yU; nx = Math.sin(k); ny = Math.cos(k); }
        else { px = x1; py = yU - (yU + 0.3) * (t - 0.75) / 0.25; nx = 1; ny = 0; }
        const d = e + 0.035 * (ST.rausch(yw(px) * 5.3, py * 5.3, 7) - 0.5) * 2;
        pts.push([px + nx * d, py + ny * d]);
      }
      pts.push([x1 + e, -0.8], [x0 - e, -0.8]);
      glattPfad(g, pts);
    };
    if (!winter) {
      g.save(); g.beginPath(); saum(0.1); g.fillStyle = "rgba(30,14,10,0.22)"; g.fill(); g.restore();
      return;
    }
    /* nasse Ziegel im Saum */
    g.save(); g.beginPath(); saum(0.13); g.clip();
    biberschwanz(g, F, a0 - 0.4, -0.2 - 2 * ZR, a1 - a0 + 0.8, b1 + 0.8, saat + 3, {});
    mulFarbe(g, F, Lz.map((v) => v * 0.8), [a0 - 0.5, -0.5, a1 - a0 + 1, b1 + 1]);
    g.fillStyle = "rgba(92,70,72,0.1)"; g.fillRect(a0 - 0.5, -0.5, a1 - a0 + 1, b1 + 1);
    g.restore();
    /* weicher Rand: drei Ringe Schnee, außen dichter */
    g.lineWidth = 0.022;
    for (const [e, al] of [[0.105, 0.25], [0.125, 0.5], [0.145, 0.85]]) { g.strokeStyle = schneeRGB(M, 0.94).replace("rgb(", "rgba(").replace(")", "," + al + ")"); g.beginPath(); saum(e); g.stroke(); }
    /* Schmelzwasser: grauer, nasser Schnee um den Saum */
    g.fillStyle = "rgba(150,160,184,0.14)"; g.beginPath(); saum(0.26); saum(0.16); g.fill("evenodd");
  }

  /* ---------------- Schnee auf dem Dach ----------------
     XANDER: „mit Schnee … dieses Weihnachtsdorf". RUNDE 2: Unter dem Schnee
     liegt das Biberschwanzdach; es zeigt sich nur in wenigen getauten
     Flecken (3–5 je Hauptfläche, 1–2 je Schopf) am First, an den Graten,
     neben dem Kamin und auf der Sonnenseite – zusammenhängende Flächen
     statt der Strichreihen aus Runde 1 („Morsezeichen"). Jeder Fleck:
     Ziegel nass abgedunkelt, oben eine helle Schneelippe mit Schattenband,
     unten weich mit Schneeresten. In der Bauphase 0,90–0,98 wächst der
     Schnee RÄUMLICH (erst Puder in den Reihen, dann Inseln vom First
     her), nie als grauer Schleier über dem Rot. */
  function glattPfad(g, pts, dx, dy) {
    dx = dx || 0; dy = dy || 0;
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const p = pts[i], q = pts[(i + 1) % n], m = [(p[0] + q[0]) / 2 + dx, (p[1] + q[1]) / 2 + dy];
      if (!i) { const z = pts[n - 1], m0 = [(z[0] + p[0]) / 2 + dx, (z[1] + p[1]) / 2 + dy]; g.moveTo(m0[0], m0[1]); }
      g.quadraticCurveTo(p[0] + dx, p[1] + dy, m[0], m[1]);
    }
    g.closePath();
  }
  function schneeGeometrie(F, info) {
    if (F._sg) return F._sg;
    const { art, D, saat } = info;
    const w = F.w, h = F.h, um = F.flaeche.umriss, haupt = art === "ost" || art === "west";
    const r = ST.zufall(saat * 7 + 3);
    const G = { wellen: [], flecken: [], grate: grate(um, h), auf: dachAufbauten(art, D) };
    const nW = haupt ? 2 : /auf/.test(art) ? 0 : 1;
    for (let i = 0; i < nW; i++) G.wellen.push({ b: h * (0.35 + (i + r() * 0.7) * 0.45 / Math.max(1, nW)), amp: 0.05 + r() * 0.06, ph: r() * 9, f: 0.35 + r() * 0.5 });
    if (/auf/.test(art)) { F._sg = G; return G; }
    const gaube = G.auf.find((A) => A.art === "gaube"), kaminA = G.auf.find((A) => A.art === "kamin");
    const box = (A) => { let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity; for (const p of A.fuss) { a0 = Math.min(a0, p[0]); a1 = Math.max(a1, p[0]); b0 = Math.min(b0, p[1]); b1 = Math.max(b1, p[1]); } return [a0, b0, a1, b1]; };
    const gb = gaube ? box(gaube) : null, kb = kaminA ? box(kaminA) : null;
    /* Schopfflächen sind zu klein: dort nur Schnee */
    /* RUNDE 2 (eigene Schleife): drei gleich große Flecken am First lasen
       sich aus der Ferne wie eine Knopfreihe – jetzt ein bis zwei Flecken
       je Fläche, verschieden groß, bevorzugt an Grat, Kamin und Südseite */
    const n = haupt ? 1 + (r() < 0.4 ? 1 : 0) : 0;
    let versuche = 0;
    while (G.flecken.length < n && versuche++ < 80) {
      /* eigene Schleife 4: ein runder Fleck mitten in der Fläche las sich
         bei s = 55 wie ein Kanaldeckel. Getaut wird dort, wo es einen Grund
         gibt: unter dem warmen Kamin (erster Fleck, quer gezogen) und an
         einem Grat, wo der Wind den Schnee abträgt. */
      const wahl = G.flecken.length === 0 && kb ? 0.7 : r() < 0.7 ? 0.45 : r();
      let a, b;
      if (!haupt) { a = w / 2 + (r() - 0.5) * w * 0.35; b = h * (0.3 + r() * 0.35); }
      else if (G.flecken.length === 0 && kb && versuche < 40) { a = (kb[0] + kb[2]) / 2 + (r() - 0.5) * 0.3; b = kb[3] + 0.5 + r() * 0.3; }
      else if (wahl < 0.25) { a = 0.9 + r() * (w - 1.8); b = 0.3 + r() * 0.8; }                       // am First
      else if (wahl < 0.5 && G.grate.length) {                                                       // neben einem Grat
        const [p, q] = G.grate[Math.floor(r() * G.grate.length)], t = 0.35 + r() * 0.5;
        a = p[0] + (q[0] - p[0]) * t; b = p[1] + (q[1] - p[1]) * t + 0.35; a += (a < w / 2 ? 1 : -1) * (0.5 + r() * 0.4);
      } else if (wahl < 0.75 && kb) { a = (r() < 0.5 ? kb[0] - 0.9 - r() * 0.4 : kb[2] + 0.9 + r() * 0.4); b = kb[3] + 0.3 + r() * 0.6; }   // neben dem Kamin
      else { const sued = art === "ost" ? 0 : w; a = Math.abs(sued - (1.3 + r() * 2.2)); b = h * (0.3 + r() * 0.35); }   // Südseite
      const gross = G.flecken.length ? 0.45 + r() * 0.3 : 0.7 + r() * 0.4, Ra = gross, Rb = 0.16 + gross * 0.2 + r() * 0.06;
      if (b + Rb > h - 0.45 || a - Ra < 0.3 || a + Ra > w - 0.3) continue;
      if (!imVieleck(um, [a, Math.max(0.05, b)])) continue;
      if (gb && a + Ra > gb[0] - 0.35 && a - Ra < gb[2] + 0.35 && b + Rb > gb[1] - 0.3 && b - Rb < gb[3] + 0.3) continue;
      if (kb && a + Ra > kb[0] - 0.3 && a - Ra < kb[2] + 0.3 && b - Rb < kb[3] + 0.3) continue;
      if (G.flecken.some((T) => Math.abs(T.a - a) < T.Ra + Ra + 0.3 && Math.abs(T.b - b) < T.Rb + Rb + 0.2)) continue;
      /* Umriss: gestreckt längs der Reihen, gelappt (zwei Rauschlagen), der
         Unterrand stärker zerfranst als die Oberkante (dort bricht der Schnee
         als Kante ab, unten läuft er aus) */
      const sd = saat + G.flecken.length * 17, pts = [];
      const nP = 40;
      for (let k = 0; k < nP; k++) {
        const th = k / nP * Math.PI * 2, ct = Math.cos(th), st = Math.sin(th);
        const grob = ST.fbm(ct * 1.1 + sd * 0.13, st * 1.1 + sd * 0.07, 2, sd), fein = ST.rausch(ct * 4.3 + sd, st * 4.3, sd + 3);
        const rr = 0.62 + 0.62 * grob + (st > 0 ? 0.22 : 0.08) * (fein - 0.5);
        pts.push([a + ct * Ra * rr, b + st * Rb * rr * (st < 0 ? 0.8 : 1.15), st]);
      }
      G.flecken.push({ a, b, Ra, Rb, pts, sd });
    }
    F._sg = G;
    return G;
  }
  function schneeDachMalen(info) {
    return function (g, F) {
      const { art, deck, saat } = info;
      const w = F.w, h = F.h, haupt = art === "ost" || art === "west", auf = /auf/.test(art);
      const G = schneeGeometrie(F, info);
      const rowPx = (F.pxV || F.px) * ZR;
      const M = schneeMul(F), Lz = ST.lichtFaktor(F.n, F.zeit, 0, "winter");
      const voll = deck >= 0.999;
      const schneeGrund = (x, y, ww, hh) => {
        g.fillStyle = "rgb(252,253,255)"; g.fillRect(x, y, ww, hh);
        /* große, weiche Mulden und Wehen (zwei Lagen, keine Wiederholung) */
        flecken2(g, x, y, ww, hh, 5.5, 0.34, "blau", saat);
        flecken(g, x, y, ww, hh, 1.7, 0.14, "blau", saat + 9, 0.6);
        flecken2(g, x, y, ww, hh, 2.6, 0.3, "hell", saat + 4);
        if (F.px > 22) flecken(g, x, y, ww, hh, 0.6, 0.1, "fein", saat + 2);
        if (F.px > 6) for (const W of G.wellen) {
          const gw = g.createLinearGradient(0, W.b - 0.02, 0, W.b + 0.4);
          gw.addColorStop(0, "rgba(150,172,214,0.22)"); gw.addColorStop(1, "rgba(150,172,214,0)");
          g.fillStyle = gw; g.beginPath(); g.moveTo(-0.2, W.b);
          for (let a = -0.2; a <= w + 0.4; a += 0.3) g.lineTo(a, W.b + Math.sin(a * W.f + W.ph) * W.amp);
          for (let a = w + 0.4; a >= -0.2; a -= 0.3) g.lineTo(a, W.b + 0.4 + Math.sin(a * W.f + W.ph) * W.amp);
          g.closePath(); g.fill();
        }
        /* weiche Kehle neben First- und Grathaube */
        if (!auf) for (const [p, q] of firstKanten(F)) fuelle(g, kantenBand(F, p, q, 0.12, 0.34), "rgba(160,180,222,0.16)");
        /* Aufschiebling: zur Traufe hin ein Hauch dicker und heller */
        if (auf) { const ga = g.createLinearGradient(0, 0, 0, h); ga.addColorStop(0, "rgba(150,172,214,0.14)"); ga.addColorStop(0.35, "rgba(255,255,255,0)"); g.fillStyle = ga; g.fillRect(-0.2, -0.2, w + 0.4, h + 0.4); }
      };
      if (voll) {
        schneeGrund(-0.2, -0.2, w + 0.4, h + 0.4);
        mulFarbe(g, F, M);
      } else {
        /* 1) Ziegel, wie der Kern sie belichten würde */
        biberschwanz(g, F, -0.2, -0.2, w + 0.4, h + 0.4, saat, {});
        if (!auf) firstBett(g, F);
        aufbautenSchatten(g, F, art, info.D, "rgba(30,12,10,0.3)");
        mulFarbe(g, F, Lz);
        /* 2) Puder in den Reihenkanten: schmale, deckende Streifen, die mit
           dem Schneefall breiter werden */
        const pb = klemm(deck * 2.5, 0, 1) * ZR * 0.3;
        if (rowPx > 2 && pb > 0.004) {
          g.fillStyle = schneeRGB(M, 0.97);
          for (let yy = -0.2 - ZR + ZR * 1.02; yy < h; yy += ZR) g.fillRect(-0.2, yy, w + 0.4, pb);
        }
        /* 3) Inseln: Rauschen über einer sinkenden Schwelle, vom First
           und von der Traufe (Wind) her; deckend, mit Kontaktschatten */
        const thr = 1.02 - deck * 1.12;
        const inseln = new Path2D(), zell = 0.26, rr = ST.zufall(saat + 5);
        let viele = 0;
        for (let b = -0.1; b < h + 0.1; b += zell) for (let a = -0.1; a < w + 0.1; a += zell) {
          const jx = (rr() - 0.5) * zell * 0.6, jy = (rr() - 0.5) * zell * 0.6;
          const v = ST.fbm((a + jx) * 0.55 + saat * 0.3, (b + jy) * 0.7, 3, saat) + 0.18 * klemm(1 - b / 1.2, 0, 1) + 0.12 * klemm((b - h + 0.8) / 0.8, 0, 1);
          if (v < thr) continue;
          const R = zell * (0.55 + klemm((v - thr) * 3, 0, 0.5));
          inseln.moveTo(a + jx + R, b + jy); inseln.ellipse(a + jx, b + jy, R, R * 0.8, 0, 0, Math.PI * 2); viele++;
        }
        if (viele) {
          g.save(); g.translate(0.012, 0.03); g.fillStyle = "rgba(40,18,16,0.28)"; g.fill(inseln); g.restore();
          g.save(); g.clip(inseln); schneeGrund(-0.2, -0.2, w + 0.4, h + 0.4); mulFarbe(g, F, M); g.restore();
        }
      }
      /* 4) getaute Flecken (nur auf der geschlossenen Decke) */
      if (voll) for (const T of G.flecken) {
        const bx = [T.a - T.Ra * 1.3 - 0.1, T.b - T.Rb * 1.4 - 0.1, T.Ra * 2.6 + 0.2, T.Rb * 2.8 + 0.2];
        /* nasser, dünner Schnee als schmaler grauer Saum um das Loch */
        if (F.px > 40) { g.save(); g.beginPath(); glattPfad(g, T.pts, 0, 0.02); g.lineWidth = 0.05; g.strokeStyle = "rgba(168,180,204,0.14)"; g.stroke(); g.restore(); }
        g.save(); g.beginPath(); glattPfad(g, T.pts); g.clip();
        if (rowPx >= 2.2) {
          const y0 = -0.2 + 2 * ZR * Math.floor((bx[1] + 0.2) / (2 * ZR)) - 2 * ZR, x0 = -0.2 + ZB * Math.floor((bx[0] + 0.2) / ZB) - ZB;
          biberschwanz(g, F, x0, y0, bx[2] + 2 * ZB, bx[3] + 4 * ZR, saat + T.sd, {});
          /* belichtet wie der Kern, nass: × 0,82 und 8 % Violettgrau */
          mulFarbe(g, F, Lz.map((v) => v * 0.82), bx);
          g.fillStyle = "rgba(92,70,72,0.08)"; g.fillRect(bx[0], bx[1], bx[2], bx[3]);
          /* Schattenband unter der Schneelippe (oben, 8 cm) */
          for (const [d, al] of [[0.08, 0.12], [0.05, 0.14], [0.025, 0.16]]) {
            g.beginPath(); g.rect(bx[0], bx[1], bx[2], bx[3]); glattPfad(g, T.pts, 0, d);
            g.fillStyle = "rgba(120,140,180," + al + ")"; g.fill("evenodd");
          }
        } else {
          g.fillStyle = "rgba(170,120,100,0.05)"; g.fillRect(bx[0], bx[1], bx[2], bx[3]);
        }
        if (rowPx >= 2.2) {
          /* unten läuft der Schnee aus: Reste liegen noch in den Rillen der
             Reihen – schmale Streifen, die zum Lochinneren hin verschwinden */
          const yU = T.b + T.Rb * 0.15;
          const gp = g.createLinearGradient(0, yU, 0, T.b + T.Rb * 1.3);
          gp.addColorStop(0, schneeRGB(M, 0.93).replace("rgb(", "rgba(").replace(")", ",0)")); gp.addColorStop(1, schneeRGB(M, 0.93).replace("rgb(", "rgba(").replace(")", ",0.95)"));
          g.fillStyle = gp;
          const y0 = -0.2 + 2 * ZR * Math.floor((bx[1] + 0.2) / (2 * ZR)) - 2 * ZR;
          for (let yy = y0 + ZR * 1.02; yy < bx[1] + bx[3]; yy += ZR) if (yy > yU) g.fillRect(bx[0], yy, bx[2], ZR * 0.26);
        }
        g.restore();
        if (rowPx < 2.2) continue;
        /* oben: 3–5 cm helle Schneelippe über dem Loch */
        g.save(); g.beginPath(); g.rect(bx[0], bx[1] - 0.2, bx[2], T.b - bx[1] + 0.2); g.clip();
        g.beginPath(); glattPfad(g, T.pts, 0, -0.012); glattPfad(g, T.pts, 0, 0.028);
        g.fillStyle = schneeRGB(M, 1.07); g.fill("evenodd");
        g.restore();
      }
      /* 5) Kamin, Gauben, Schneefang */
      aufbautenSchatten(g, F, art, info.D, "rgba(96,118,170,0.3)");
      for (const A of G.auf) {
        if (A.art === "kamin") kaminFuss(g, F, A.fuss, voll || deck > 0.6, saat + 5, M, Lz, art === "ost" ? (a) => info.D.yS - a : (a) => info.D.yN + a);
        else if (voll || deck > 0.6) {
          /* Wehe vor der Gaubenvorderwand */
          let a0 = Infinity, a1 = -Infinity, bF = 0;
          for (const p of A.fuss.slice(0, 4)) { a0 = Math.min(a0, p[0]); a1 = Math.max(a1, p[0]); bF = Math.max(bF, p[1]); }
          const gw = g.createLinearGradient(0, bF - 0.05, 0, bF + 0.4);
          gw.addColorStop(0, schneeRGB(M, 1.04)); gw.addColorStop(0.7, schneeRGB(M, 1.0)); gw.addColorStop(1, schneeRGB(M, 0.92));
          g.fillStyle = gw;
          g.beginPath(); g.moveTo(a0 - 0.12, bF - 0.02);
          g.quadraticCurveTo(a0 - 0.1, bF + 0.3, (a0 + a1) / 2, bF + 0.36); g.quadraticCurveTo(a1 + 0.1, bF + 0.3, a1 + 0.12, bF - 0.02); g.closePath(); g.fill();
        }
      }
      if (haupt) {
        const zink = (c) => rgb([0, 1, 2].map((i) => c[i] * Lz[i]));
        schneefang(g, F, w, h - 0.45, voll || deck > 0.5, zink, M);
      }
    };
  }
  /* Nach dem Malen: Kammkanten der Wehen und Glitzer (ab F.px > 10) */
  function schneeDachDanach(info) {
    return function (g, F) {
      const G = F._sg; if (!G) return;
      if (info.deck < 0.999) return;
      const M = schneeMul(F);
      const w = F.w, h = F.h;
      g.lineCap = "round";
      if (F.px > 6) {
        /* Kammkanten nur stückweise, mit weichen Enden */
        g.lineWidth = Math.max(0.012, 0.9 / F.px);
        for (const W of G.wellen) {
          const yv = (a) => W.b + Math.sin(a * W.f + W.ph) * W.amp, sd = W.ph * 7;
          for (let a = -0.2; a < w + 0.2; a += 0.15) {
            const k = klemm((ST.rausch(a * 0.9 + sd, sd * 0.3, sd) - 0.45) * 3, 0, 1);
            if (k < 0.05) continue;
            g.strokeStyle = schneeRGB(M, 1.08).replace("rgb(", "rgba(").replace(")", "," + (0.5 * k).toFixed(3) + ")");
            g.beginPath(); g.moveTo(a, yv(a)); g.lineTo(a + 0.15, yv(a + 0.15)); g.stroke();
          }
        }
      }
      if (F.px > 10) glitzer(g, F, 0, 0, w, h, F.px > 25 ? 4 : 1.5, M);
    };
  }
  /* Kleine Schneeflächen (Kaminplatte, Gaubendach, Erkerhaube): weich, mit
     Mulden und Glitzer, Ränder leicht bläulich */
  /* RUNDE 2: alle Schneeflächen rechnen ihr Licht selbst (Schneelicht wie
     auf dem Dach) – die Fläche muss dafür „keinLicht" haben */
  function schneeFlaeche(g, F, x, y, w, h, saat, opt) {
    opt = opt || {};
    const gr = g.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, "rgb(246,249,254)"); gr.addColorStop(1, "rgb(252,253,255)");
    g.fillStyle = gr; g.fillRect(x, y, w, h);
    flecken(g, x, y, w, h, 2.2, 0.2, "blau", saat);
    flecken(g, x, y, w, h, 1.3, 0.25, "hell", saat + 4, 0.5);
    const M = schneeMul(F);
    mulFarbe(g, F, M, [x, y, w, h]);
    if (F.px > 10) glitzer(g, F, x, y, w, h, 3, M);
  }
  /* Schnee-Wulst an einer Kante (senkrechte Fläche, von vorn gesehen):
     wie ein liegender Zylinder schattiert – oben die Rundung im Licht,
     unten nach innen eingerollt und im Eigenschatten (150,170,210). */
  function schneeWulst(g, F, w, h, saat) {
    const r = ST.zufall(saat);
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "rgb(252,253,255)"); gr.addColorStop(0.2, "rgb(248,250,254)"); gr.addColorStop(0.5, "rgb(236,242,252)"); gr.addColorStop(0.8, "rgb(198,212,238)"); gr.addColorStop(1, "rgb(172,190,228)");
    g.fillStyle = gr; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
    flecken(g, -0.1, -0.1, w + 0.2, h + 0.2, 1.4, 0.26, "blau", saat, 0.3);
    flecken(g, -0.1, -0.1, w + 0.2, h * 0.6, 1.1, 0.3, "hell", saat + 3);
    if (F.px > 16) {
      /* Abbruchkanten: kleine, dunklere Nischen im unteren Rand */
      /* flach und blass – kräftige runde Flecken lasen sich als blaue Blasen */
      g.fillStyle = "rgba(140,160,204,0.16)";
      for (let i = 0; i < w * 1.4; i++) { const x = r() * w, y = h * (0.6 + r() * 0.3), rr = 0.025 + r() * 0.035; g.beginPath(); g.ellipse(x, y, rr * 2.4, rr * 0.55, (r() - 0.5) * 0.2, 0, Math.PI * 2); g.fill(); }
    }
    mulFarbe(g, F, schneeMul(F, 0.03));
  }
  /* Nach dem Licht: helle Rundung oben am Wulst und Glitzer */
  function schneeWulstDanach(g, F) {
    const M = schneeMul(F, 0.06);
    const c = M.map((v) => Math.round(Math.min(255, 255 * v * 1.02))).join(",");
    const gr = g.createLinearGradient(0, 0, 0, Math.min(0.1, F.h * 0.4));
    gr.addColorStop(0, "rgba(" + c + ",0.6)"); gr.addColorStop(1, "rgba(" + c + ",0)");
    g.fillStyle = gr; g.fillRect(-0.1, -0.02, F.w + 0.2, Math.min(0.1, F.h * 0.4) + 0.02);
    if (F.px > 12) glitzer(g, F, 0, 0, F.w, F.h * 0.5, 4, M);
  }
  /* Umriss eines gewellten Schneerands (unten) für eine Fläche w × h.
     ende = Länge, auf der der Rand an beiden Enden weich ausläuft
     (Höhe × sin) – so hängt nie eine Leiste frei in der Luft. */
  function wulstUmriss(w, h, saat, oben, ende) {
    const r = ST.zufall(saat);
    const pts = [];
    const e = ende || 0;
    if (oben) for (const p of oben) pts.push(p); else { pts.push([0, 0]); pts.push([w, 0]); }
    /* weicher Rand: zwei überlagerte Wellen und einzelne Abbrüche/Tropfnasen */
    const n = Math.max(4, Math.round(w / 0.05));
    const f1 = 0.6 + r() * 0.5, f2 = 2.1 + r() * 0.8, p1 = r() * 6, p2 = r() * 6;
    for (let i = n; i >= 0; i--) {
      const x = w * i / n;
      let k = 0.5 + 0.3 * Math.sin(x * f1 * Math.PI + p1) + 0.2 * Math.sin(x * f2 * Math.PI + p2);
      if (r() < 0.06) k -= 0.35;                 // Abbruch
      else if (r() < 0.05) k += 0.25;            // Tropfnase
      let y = h * (0.62 + 0.38 * klemm(k, 0, 1.2));
      if (e > 0) { const t = Math.min(x, w - x) / e; if (t < 1) y *= Math.sin(klemm(t, 0, 1) * Math.PI / 2); }
      pts.push([x, Math.max(0.004, y)]);
    }
    return pts;
  }

  /* Kupferblech mit Patina (Erkerhaube): gedämpftes Graugrün statt
     Plastik-Türkis, an Falzen und Kanten braune Kupferreste, Regenläufe,
     Stehfalze in Falllinie. */
  function kupfer(g, F, x, y, w, h, saat) {
    const r = ST.zufall(saat);
    const gr = g.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, "rgb(104,142,124)"); gr.addColorStop(1, "rgb(86,120,106)");
    g.fillStyle = gr; g.fillRect(x, y, w, h);
    flecken(g, x, y, w, h, 0.9, 0.35, "dunkel", saat);
    flecken(g, x, y, w, h, 0.6, 0.18, "hell", saat + 2, 0.5);
    /* braune Kupferreste, wo das Wasser nicht hinkommt (Falzränder, oben) */
    g.fillStyle = "rgba(150,95,60,0.35)";
    for (let i = 0; i < w * h * 12; i++) { g.beginPath(); g.ellipse(x + r() * w, y + r() * h * 0.6, 0.03 + r() * 0.06, 0.015 + r() * 0.02, 0, 0, Math.PI * 2); g.fill(); }
    /* Regenläufe: hellgrüne Schlieren in Falllinie */
    for (let i = 0; i < w * 5; i++) {
      const sx = x + r() * w; const sg = g.createLinearGradient(0, y, 0, y + h);
      sg.addColorStop(0, "rgba(130,176,150,0)"); sg.addColorStop(1, "rgba(130,176,150,0.25)");
      g.fillStyle = sg; g.fillRect(sx, y + r() * h * 0.3, 0.02 + r() * 0.04, h);
    }
    /* Stehfalze mit brauner Kante */
    if (F.px > 10) {
      for (let sx = x + 0.22; sx < x + w; sx += 0.26) {
        g.fillStyle = "rgba(170,196,178,0.5)"; g.fillRect(sx, y, 0.012, h);
        g.fillStyle = "rgba(120,78,50,0.45)"; g.fillRect(sx + 0.012, y, 0.01, h);
        g.fillStyle = "rgba(30,50,44,0.4)"; g.fillRect(sx + 0.022, y, 0.01, h);
      }
    }
  }
  /* Eine ebene Fläche aus Eckpunkten im Raum (für Hauben, Knaggen …).
     aussen = ungefähre Richtung nach außen (bestimmt die Vorderseite). */
  function polyFlaeche(M, name, pts, aussen, malen, opt) {
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    let n = ST.norm(ST.kreuz(sub(pts[1], pts[0]), sub(pts[2], pts[0])));
    if (ST.punkt(n, aussen) < 0) n = [-n[0], -n[1], -n[2]];
    const u = ST.norm(sub(pts[1], pts[0])), v = ST.kreuz(n, u);
    const ab = pts.map((p) => { const d = sub(p, pts[0]); return [ST.punkt(d, u), ST.punkt(d, v)]; });
    const a0 = Math.min(...ab.map((q) => q[0])), b0 = Math.min(...ab.map((q) => q[1]));
    const a1 = Math.max(...ab.map((q) => q[0])), b1 = Math.max(...ab.map((q) => q[1]));
    const o = [pts[0][0] + u[0] * a0 + v[0] * b0, pts[0][1] + u[1] * a0 + v[1] * b0, pts[0][2] + u[2] * a0 + v[2] * b0];
    return M.flaeche(Object.assign({ name: name, o: o, u: u, v: v, w: a1 - a0, h: b1 - b0, umriss: ab.map((q) => [q[0] - a0, q[1] - b0]), malen: malen }, opt || {}));
  }
  /* Klinker (Kamin): Läuferverband, Fugen, Brandfarben, Ruß oben */
  function klinker(g, F, x, y, w, h, saat, opt) {
    opt = opt || {};
    const r = ST.zufall(saat);
    const sh = 0.075, sl = 0.24;
    g.fillStyle = "rgb(150,140,128)"; g.fillRect(x, y, w, h);
    if (F.px * sh < 2) {
      g.fillStyle = "rgb(128,58,42)"; g.fillRect(x, y, w, h);
      for (let yy = y; yy < y + h; yy += sh) { g.fillStyle = "rgba(200,190,170,0.3)"; g.fillRect(x, yy, w, 0.012); }
    } else {
      let reihe = 0;
      for (let yy = y + h; yy > y - sh; yy -= sh, reihe++) {
        for (let xx = x - (reihe % 2) * sl / 2 - (opt.versatz || 0); xx < x + w; xx += sl) {
          let c = [[132, 54, 38], [118, 46, 34], [142, 64, 44], [104, 44, 36], [150, 76, 52]][Math.floor(r() * 5)];
          c = PI.streu(c, r, 0.06);
          g.fillStyle = rgb(c); g.fillRect(xx + 0.006, yy - sh + 0.006, sl - 0.012, sh - 0.012);
          if (F.px > 30) { g.fillStyle = rgb(hell(c, 0.15)); g.fillRect(xx + 0.006, yy - sh + 0.006, sl - 0.012, 0.008); }
        }
      }
    }
    flecken(g, x, y, w, h, 1.2, 0.2, "dunkel", saat);
    const rg = g.createLinearGradient(0, y, 0, y + 0.5);
    rg.addColorStop(0, "rgba(20,16,14,0.55)"); rg.addColorStop(1, "rgba(20,16,14,0)");
    g.fillStyle = rg; g.fillRect(x, y, w, 0.5);
  }
  /* Zinkblech (Rinne, Fallrohr, Gaubenwangen) */
  function zinkFarbe(k) { return rgb(hell([150, 156, 160], k)); }

  /* =====================================================================
     MALEN AUF EINER CPU-LEINWAND
     Jede Fläche wird in Geräte-Pixeln auf eine eigene, vom Prozessor
     gerasterte Leinwand gemalt (gleiche Abbildung, gleiche Pixel – also
     kein Unschärfe-Verlust, keine Pixelkanten) und dann als EIN Bild in
     das Sprite gesetzt. Hunderte kleine Pinselstriche sind so viel
     schneller als einzeln auf der Grafikkarten-Leinwand.
     ===================================================================== */
  /* Leinwände nach Größenstufen (Vielfache von 128 bzw. 256): beim
     Übertragen ins Sprite wird die ganze Leinwand hochgeladen – also keine
     riesige für kleine Flächen benutzen.
     RUNDE 1 (Speicher): Früher wurde auf Zweierpotenzen bis 4096 × 4096
     aufgerundet und nie etwas freigegeben – bei großem Zoom (iPad: bis
     300 Gerätepixel/m) lagen über 140 MB Leinwände dauerhaft herum. Jetzt:
     höchstens 4 Leinwände (zuletzt benutzte bleiben), keine über 2,5 Mio.
     Pixel – größere Flächen malen wir direkt ins Sprite. */
  const CPU = new Map();
  const CPU_MAX = 4, CPU_PX = 2.5e6;
  function cpuLeinwand(w, h) {
    const st = (a) => a <= 512 ? Math.ceil(a / 128) * 128 : Math.ceil(a / 256) * 256;
    const sw = st(w), sh = st(h);
    const k = sw + "x" + sh;
    let c = CPU.get(k);
    if (c) { CPU.delete(k); CPU.set(k, c); return c; }
    const cv = document.createElement("canvas"); cv.width = sw; cv.height = sh;
    c = cv.getContext("2d", { willReadFrequently: true });
    CPU.set(k, c);
    while (CPU.size > CPU_MAX) {
      const alt = CPU.keys().next().value, ac = CPU.get(alt);
      ac.canvas.width = ac.canvas.height = 0; CPU.delete(alt);
    }
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
      /* kleine Flächen direkt malen – das Übertragen lohnt nicht; sehr große
         ebenfalls (Speicher, Hochladezeit) */
      if (w * h < 2500 || w * h > CPU_PX) { m(g, F); return; }
      const c = cpuLeinwand(w, h);
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, w + 2, h + 2);
      c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
      c.setTransform(T.a, T.b, T.c, T.d, T.e - x0, T.f - y0);
      c.save();
      m(c, F);
      c.restore();
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.drawImage(c.canvas, 0, 0, w, h, x0, y0, w, h);
      g.setTransform(T);
    };
  }
  function beschleunigen(M) {
    for (const t of M.teile) for (const f of t.flaechen) {
      if (typeof f.malen === "function" && !f.direkt) f.malen = aufCpu(f.malen);
    }
  }

  /* =====================================================================
     TEILE mit bewusster Reihenfolge
     ===================================================================== */
  function teil(M, name, stufe, n, rang, opt) {
    const d = 1 + (rang || 0), nn = n || [0, 0, 0];
    return M.teil(name, Object.assign({ mitte: [nn[0] * d, nn[1] * d, stufe + nn[2] * d], schatten: false }, opt || {}));
  }
  const N_S = [0, 1, 0], N_N = [0, -1, 0], N_O = [1, 0, 0], N_W = [-1, 0, 0];
  const N_DO = [SA, 0, CA], N_DW = [-SA, 0, CA];

  /* Wand als Fläche: Grundlinie von p0 nach p1 (von außen: links → rechts),
     oben zOben, unten zUnten */
  function wandFlaeche(M, name, p0, p1, zUnten, zOben, malen, opt) {
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1], w = Math.hypot(dx, dy);
    return M.flaeche(Object.assign({ name: name, o: [p0[0], p0[1], zOben], u: [dx / w, dy / w, 0], v: [0, 0, -1], w: w, h: zOben - zUnten, malen: malen }, opt || {}));
  }
  /* Kasten mit eigenen Seiten (Balkenkopf, Stufe …) */
  function kasten(M, x0, y0, z0, x1, y1, z1, m, opt) {
    M.quader({ x: x0, y: y0, z: z0, b: x1 - x0, t: y1 - y0, h: z1 - z0 }, m, opt);
  }

  /* =====================================================================
     BAUPHASEN
     XANDER: „Man soll das Fundament sehen beim Aufbauen. Man soll richtig
     sehen, wie es konstruiert wird … Schritt für Schritt, wie das nach
     2 Minuten aussieht, wie es nach 5 Minuten aussieht, nach 10 Minuten,
     15 Minuten, bis es fertig ist."
     Bauzeit 15 min, bau = 0…1 (2 min ≈ 0,13 · 5 min ≈ 0,33 · 10 min ≈ 0,67):
       0,00–0,10  Baugrube: Schnurgerüst, Aushub (schon bei 0,03 gut 0,5 m
                  tief), zwei Aushubhaufen
       0,10–0,16  Streifenfundament: Eisen, Schalung, Beton, ausschalen
       0,17–0,24  Verfüllen (Haufen schrumpfen, Resthalde bis 0,3),
                  Bodenplatte mit Glättspuren
       0,22–0,32  Sockel, Steinlage für Steinlage (frische Lage heller)
       0,32–0,50  Fachwerk-Gerippe EG: erst alle Schwellen, dann Wand für
                  Wand Ständer mit Hilfslatten und gleich das Rähm, zuletzt
                  Riegel und Streben
       0,50–0,60  Balkenlage, Dielen, Ausfachen EG (Staken, Lehm, Putz)
       0,60–0,72  Obergeschoss und Erker (Gerippe, dann Gefache)
       0,72–0,80  Dachstuhl: Dachbalken, Gespärre paarweise von Süd nach
                  Nord, Kehlbalken, Giebelgerippe
       0,79–0,87  RICHTFEST: Richtkrone mit bunten Bändern auf dem First
       0,80–0,90  Lattung, Ziegel von der Traufe zum First, Gaubengerippe,
                  Gauben decken, wenn die Ziegelreihen sie erreichen, Kamin
       0,90–1,00  Fenster, Türen, Rinnen, Fallrohre, Läden, Kästen, Schild.
                  Winter: Schnee wächst 0,90–0,98 (Puder → Decke → Wulst,
                  Eiszapfen ab 0,95), Kranz 0,97, Lichterketten 0,985,
                  Stern und Licht erst, wenn alles fertig ist.
     ===================================================================== */
  function zustand(bau) {
    const f = (a, b) => klemm((bau - a) / (b - a), 0, 1);
    const Z = { bau: bau, fertig: bau >= 0.999 };
    Z.grube = bau < 0.24 ? {
      schnur: bau < 0.12, tiefe: f(0.004, 0.055), haufen: bau < 0.17 ? f(0.004, 0.07) : 1 - 0.8 * f(0.17, 0.24),
      eisen: f(0.095, 0.11), schalung: f(0.1, 0.12), beton: f(0.12, 0.15), ausgeschalt: bau >= 0.155, verfuellt: f(0.17, 0.24)
    } : null;
    /* Resthalde bis 0,3, dann abgefahren */
    Z.halde = bau < 0.17 ? 0 : bau < 0.24 ? 1 : bau < 0.3 ? 1 - f(0.26, 0.3) : 0;
    Z.platte = bau >= 0.2 && bau < 0.6 ? f(0.2, 0.215) : 0;
    Z.sockel = bau >= 0.22 ? f(0.22, 0.315) : 0;
    Z.eg = bau < 0.32 ? null : bau < 0.52 ? "gerippe" : bau < 0.6 ? "fachen" : "zu";
    Z.egHolz = f(0.32, 0.5); Z.egFach = f(0.52, 0.6);
    Z.balken = bau >= 0.5 ? f(0.5, 0.535) : 0;
    Z.dielen = f(0.535, 0.6);
    Z.fuellholz = bau >= 0.56;
    Z.ogBoden = bau >= 0.5 && bau < 0.8;
    Z.og = bau < 0.6 ? null : bau < 0.66 ? "gerippe" : bau < 0.72 ? "fachen" : "zu";
    Z.ogHolz = f(0.6, 0.66); Z.ogFach = f(0.66, 0.72);
    Z.dachbalken = bau >= 0.72 ? f(0.72, 0.745) : 0; Z.dachdielen = f(0.765, 0.8);
    Z.dachBoden = bau >= 0.72 && bau < 0.9;
    Z.giebel = bau < 0.72 ? null : bau < 0.8 ? "gerippe" : bau < 0.86 ? "fachen" : "zu";
    Z.giebelHolz = f(0.735, 0.795); Z.giebelFach = f(0.8, 0.86);
    Z.dach = bau < 0.745 ? null : bau < 0.9 ? "stuhl" : "zu";
    Z.sparren = f(0.745, 0.795); Z.kehl = f(0.77, 0.8); Z.latten = f(0.8, 0.84); Z.ziegel = f(0.84, 0.9);
    Z.richtkrone = bau >= 0.79 && bau < 0.87;
    Z.dachOffen = bau < 0.9;
    /* Gaube: 1 = Gerippe (mit den Sparren), 2 = Wand zu, Dach gelattet,
       3 = gedeckt (sobald die Ziegelreihen die Gaube erreichen), 4 = Schürze */
    Z.gaube = bau < 0.785 ? 0 : bau < 0.86 ? 1 : bau < 0.874 ? 2 : bau < 0.9 ? 3 : 4;
    Z.haube = bau >= 0.86;
    Z.kamin = f(0.82, 0.9); Z.kaminKopf = bau >= 0.9;
    Z.stufen = bau >= 0.9; Z.rinne = bau >= 0.93; Z.rohr = bau >= 0.94;
    Z.deko = bau >= 0.965; Z.schild = bau >= 0.975;
    Z.schneeDeck = Z.fertig ? 1 : f(0.9, 0.98);
    Z.schnee = Z.schneeDeck > 0;
    Z.kranz = bau >= 0.97; Z.schmuck = bau >= 0.975; Z.kette = bau >= 0.985; Z.stern = Z.fertig;
    Z.licht = Z.fertig;
    return Z;
  }
  const FERTIG = zustand(1);

  /* ---------------- Vielecke ---------------- */
  function polyNormalen(p) {
    let fl = 0;
    for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; fl += a[0] * b[1] - b[0] * a[1]; }
    const sg = fl > 0 ? 1 : -1;
    return p.map((a, i) => { const b = p[(i + 1) % p.length]; const nx = (b[1] - a[1]) * sg, ny = -(b[0] - a[0]) * sg, l = Math.hypot(nx, ny) || 1; return [nx / l, ny / l]; });
  }
  /* Vieleck an einem konvexen Vieleck abschneiden */
  function schneidePoly(p, k) {
    const nrm = polyNormalen(k);
    let aus = p;
    for (let i = 0; i < k.length && aus.length; i++) {
      const a = k[i], n = nrm[i];
      const d = (q) => (q[0] - a[0]) * n[0] + (q[1] - a[1]) * n[1];     // > 0 = außen
      const neu = [];
      for (let j = 0; j < aus.length; j++) {
        const p0 = aus[j], p1 = aus[(j + 1) % aus.length], d0 = d(p0), d1 = d(p1);
        if (d0 <= 0) neu.push(p0);
        if ((d0 <= 0) !== (d1 <= 0)) { const t = d0 / (d0 - d1); neu.push([p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t]); }
      }
      aus = neu;
    }
    return aus;
  }
  function streifen(x0, y0, x1, y1, b) {
    const L = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / L * b / 2, ny = (x1 - x0) / L * b / 2;
    return [[x0 + nx, y0 + ny], [x1 + nx, y1 + ny], [x1 - nx, y1 - ny], [x0 - nx, y0 - ny]];
  }
  const litC = (c, L) => [c[0] * L[0], c[1] * L[1], c[2] * L[2]];

  /* ---------------- Offene Bauteile als echte Prismen ----------------
     Für Gerippe, Balkenlagen und Dachstuhl: jedes Holz hat eine Tiefe
     hinter der Fläche (t0…t1). Aus der Blickrichtung wird die sichtbare
     Seite jedes Holzes gerechnet – so sieht man durch das Gerippe hindurch
     und trotzdem die Dicke der Balken, in jedem Winkel und von beiden
     Seiten. Licht rechnen wir selbst (Fläche ist durchsichtig). */
  function prismen(g, F, stuecke, zwischen) {
    const B = blick(F), vorn = B.en > 0;
    const n = vorn ? F.n : [-F.n[0], -F.n[1], -F.n[2]];
    const L = ST.lichtFaktor(n, F.zeit, 0, F.jahr);
    const Zz = F.zeit, amb = Zz.amb[1] * 0.95, so = Zz.sonne[1] * 1.35;
    const traeger = amb + so * Math.max(0, F.lichtN * (vorn ? 1 : -1));
    const seitK = (mx, my) => klemm((amb + so * Math.max(0, mx * F.lichtU + my * F.lichtV)) / Math.max(0.25, traeger), 0.45, 1.45);
    const lagen = {};
    for (const s of stuecke) { const k = s.lage || 0; (lagen[k] = lagen[k] || []).push(s); }
    const schl = new Set(Object.keys(lagen).map(Number));
    if (zwischen) for (const k of Object.keys(zwischen)) schl.add(Number(k));
    const reihe = [...schl].sort((a, b) => vorn ? a - b : b - a);
    for (const k of reihe) {
      const Ls = lagen[k] || [];
      for (const s of Ls) {
        const dn = B.tief(vorn ? s.t0 : s.t1), df = B.tief(vorn ? s.t1 : s.t0);
        const dd = [df[0] - dn[0], df[1] - dn[1]];
        if (Math.abs(dd[0]) + Math.abs(dd[1]) < 1e-4) continue;
        const nrm = polyNormalen(s.poly);
        const c = litC(hell(s.farbe, -0.1), L);
        for (let i = 0; i < s.poly.length; i++) {
          const m = nrm[i];
          if (m[0] * dd[0] + m[1] * dd[1] <= 1e-6) continue;
          const a = s.poly[i], b = s.poly[(i + 1) % s.poly.length];
          g.fillStyle = rgb(hellMal(c, seitK(m[0], m[1])));
          vieleck(g, [[a[0] + dn[0], a[1] + dn[1]], [b[0] + dn[0], b[1] + dn[1]], [b[0] + df[0], b[1] + df[1]], [a[0] + df[0], a[1] + df[1]]]);
          g.fill();
        }
      }
      if (zwischen && zwischen[k]) zwischen[k](g, B, vorn, L);
      for (const s of Ls) {
        const dn = B.tief(vorn ? s.t0 : s.t1);
        g.save(); g.translate(dn[0], dn[1]);
        if (s.malen) s.malen(g, L); else { g.fillStyle = rgb(litC(s.farbe, L)); vieleck(g, s.poly); g.fill(); }
        g.restore();
      }
    }
    return L;
  }

  /* ---------------- Gerippe einer Wand (offen, dann ausgefacht) ---------------- */
  /* RUNDE 1: erst liegen alle Schwellen (der Ring auf dem Sockel), dann
     wird Wand für Wand aufgerichtet: Ständer – mit Hilfslatten gegen
     Umkippen – und sofort das Rähm darauf. Riegel, Bänder und Streben
     kommen zuletzt. Vorher standen bei 0,45 nur lose Ständer ohne Rähm. */
  function holzZeit(h, W, wi) {
    const pos = klemm(((h.x0 + h.x1) / 2) / Math.max(1, W), 0, 1);
    let t;
    if (h.art === "schwelle") t = 0.02 + 0.12 * (wi + pos) / 4;
    else if (h.art === "staender") t = 0.16 + wi * 0.15 + pos * 0.09;
    else if (h.art === "rahm") t = 0.16 + wi * 0.15 + 0.1;
    else t = 0.78 + 0.2 * (wi + pos) / 4;
    return h._nz > 1 ? (h._zi + t) / h._nz : t;
  }
  function holzListe(plan) {
    if (plan._hl) return plan._hl;
    const zO = plan.zOben, saat = ST.textHash(plan.name) % 97 + 3;
    const H = [];
    plan.zonen.forEach((z, zi) => {
      const L = z.fl || (z.fl = inFlaeche(z.H, zO, saat + z.H.length));
      /* Giebel: Stockwerk für Stockwerk abbinden, die obere Stockschwelle
         kommt erst, wenn die Ständer darunter stehen */
      if (plan.stockweise) for (const h of L) { h._zi = zi; h._nz = plan.zonen.length; }
      H.push(...L);
    });
    if (plan.umriss) for (const h of H) { h._poly = schneidePoly(balkenVieleck(h), plan.umriss); h.geschnitten = true; }
    plan._hl = H;
    return H;
  }
  function felderListe(plan) {
    if (plan._fl) return plan._fl;
    const zO = plan.zOben, r = ST.zufall(ST.textHash(plan.name + "f"));
    const L = [];
    for (const z of plan.zonen) for (const fe of z.felder) {
      let p = [[fe[0], zO - fe[3]], [fe[2], zO - fe[3]], [fe[2], zO - fe[1]], [fe[0], zO - fe[1]]];
      if (plan.umriss) p = schneidePoly(p, plan.umriss);
      if (p.length >= 3) L.push({ poly: p, zeit: r() * 0.6, rng: ST.zufall((r() * 1e9) | 0) });
    }
    /* Felder im Gerippe, die kein Plan-Feld sind (Streben-Buchten), sind in
       den Buchtfeldern enthalten – alles andere bleibt Öffnung */
    plan._fl = L;
    return L;
  }
  function gefachZeichnen(g, fe, zustand, V, L, F) {
    const p = fe.poly, r = fe.rng;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const q of p) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }
    g.save(); vieleck(g, p); g.clip();
    if (zustand === "flecht") {
      /* Staken (senkrecht) und eingeflochtene Weidenruten – man sieht durch */
      const st = litC([150, 118, 78], L), ru = litC([128, 100, 62], L);
      g.fillStyle = rgb(st);
      for (let x = x0 + 0.06; x < x1 - 0.03; x += 0.14) g.fillRect(x - 0.015, y0, 0.03, y1 - y0);
      g.strokeStyle = rgb(ru); g.lineWidth = 0.022;
      for (let y = y0 + 0.05, k = 0; y < y1; y += 0.05, k++) {
        g.beginPath(); g.moveTo(x0, y);
        for (let x = x0 + 0.06; x < x1 + 0.14; x += 0.14) g.quadraticCurveTo(x - 0.07, y + ((k + Math.round((x - x0) / 0.14)) % 2 ? 0.012 : -0.012), x, y);
        g.stroke();
      }
    } else if (zustand === "lehm") {
      g.fillStyle = rgb(litC([148, 112, 74], L)); g.fillRect(x0, y0, x1 - x0, y1 - y0);
      flecken(g, x0, y0, x1 - x0, y1 - y0, 0.8, 0.5, "dunkel", 7);
      if (F.px > 20) {
        /* Stroh im Lehm */
        g.strokeStyle = rgb(litC([196, 170, 110], L), 0.7); g.lineWidth = Math.max(0.004, 0.6 / F.px);
        g.beginPath();
        for (let i = 0; i < (x1 - x0) * (y1 - y0) * 60; i++) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), a = r() * 3; g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 0.05, y + Math.sin(a) * 0.05); }
        g.stroke();
      }
    } else {
      /* frischer Kalkputz: noch etwas grauer, feucht */
      const c = litC(misch(V.putz, [196, 194, 188], 0.25), L);
      g.fillStyle = rgb(c); g.fillRect(x0, y0, x1 - x0, y1 - y0);
      flecken(g, x0, y0, x1 - x0, y1 - y0, 1.2, 0.25, "dunkel", 9);
      flecken(g, x0, y0, x1 - x0, y1 - y0, 0.6, 0.2, "hell", 4);
    }
    g.restore();
  }
  /* Gerippe-Maler: zeitHolz/zeitFach = Fortschritt der Phase (0…1) */
  function gerippeMaler(plan, V, wi, zeitHolz, zeitFach, dicke) {
    return function (g, F) {
      const H = holzListe(plan);
      const W = plan.w;
      const stuecke = [];
      for (const h of H) {
        if (h.zeitBau == null) h.zeitBau = holzZeit(h, W, wi);
        if (h.zeitBau > zeitHolz) continue;
        const p = balkenVieleck(h);
        if (p.length < 3) continue;
        stuecke.push({ poly: p, t0: 0, t1: dicke, lage: 0, farbe: V.holz, malen: (gg, L) => balkenMalen(gg, F, h, litC(V.holz, L)) });
      }
      /* Hilfslatten: frisch gesägte Schräglatten halten die Ständer, bis
         Riegel und Streben eingebaut sind */
      if (!plan.stockweise && W > 2.5 && zeitHolz < 0.8) {
        const st = H.filter((h) => h.art === "staender" && h.zeitBau <= zeitHolz && Math.abs(h.x0 - h.x1) < 0.01);
        if (st.length >= 2) {
          const oben = Math.min(...st.map((h) => Math.min(h.y0, h.y1))), unten = Math.max(...st.map((h) => Math.max(h.y0, h.y1)));
          const xs = st.map((h) => h.x0).sort((a, b) => a - b), xa = xs[0], xb = xs[xs.length - 1];
          const lat = [];
          if (xb - xa > 1.4) {
            lat.push([xa + 0.15, unten - 0.05, Math.min(xb, xa + 1.9), oben + 0.35]);
            if (xb - xa > 3.2) lat.push([xb - 0.15, unten - 0.05, Math.max(xa, xb - 1.9), oben + 0.35]);
          }
          lat.forEach(([x0, y0, x1, y1], i) => {
            const h = plan["_latte" + wi + i] || (plan["_latte" + wi + i] = { art: "latte", x0, y0, x1, y1, b: 0.07, r: ST.zufall(77 + i + wi * 5) });
            Object.assign(h, { x0, y0, x1, y1 }); h._poly = null;
            stuecke.push({ poly: balkenVieleck(h), t0: -0.035, t1: 0, lage: 1, farbe: [214, 180, 128], malen: (gg, L) => balkenMalen(gg, F, h, litC([214, 180, 128], L)) });
          });
        }
      }
      const zw = {};
      if (zeitFach > 0) {
        const felder = felderListe(plan);
        zw[0] = (gg, B, vorn, L) => {
          for (const fe of felder) {
            const pf = klemm((zeitFach - fe.zeit) / 0.4, 0, 1);
            if (pf <= 0) continue;
            const z = pf < 0.35 ? "flecht" : pf < 0.7 ? "lehm" : "putz";
            const d = B.tief(z === "flecht" ? dicke / 2 : (vorn ? 0.03 : dicke - 0.03));
            gg.save(); gg.translate(d[0], d[1]); gefachZeichnen(gg, fe, z, V, L, F); gg.restore();
          }
        };
      }
      prismen(g, F, stuecke, zw);
    };
  }
  function gerippeFlaeche(M, name, p0, p1, zUnten, plan, V, wi, zeitHolz, zeitFach, dicke) {
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1], w = Math.hypot(dx, dy);
    const h = plan.zOben - zUnten, m = 0.6;
    return M.flaeche({
      name: name, o: [p0[0], p0[1], plan.zOben], u: [dx / w, dy / w, 0], v: [0, 0, -1], w: w, h: h,
      umriss: [[-m, -m], [w + m, -m], [w + m, h + m], [-m, h + m]], beidseitig: true, keinLicht: true,
      malen: gerippeMaler(plan, V, wi, zeitHolz, zeitFach, dicke)
    });
  }

  /* ---------------- Innenseite einer geschlossenen Wand ----------------
     Solange kein Dach darüber ist, schaut man von oben hinein. */
  function innenMaler(plan, V) {
    return function (g, F) {
      const W = plan.w, zO = plan.zOben;
      putzGrund(g, F, -0.1, -0.1, F.w + 0.2, F.h + 0.2, misch(V.putz, [200, 196, 186], 0.35), 5);
      const H = holzListe(plan).map((h) => Object.assign({}, h, { x0: W - h.x0, x1: W - h.x1, _poly: null, clip: h.clip ? [W - h.clip[0] - h.clip[2], h.clip[1], h.clip[2], h.clip[3]] : null }));
      if (plan.umriss) for (const h of H) { h._poly = schneidePoly(balkenVieleck(h), plan.umriss.map((q) => [W - q[0], q[1]])); h.geschnitten = true; }
      for (const h of H) balkenMalen(g, F, h, hell(V.holz, 0.08));
      /* Öffnungen: durchsichtig */
      g.save(); g.globalCompositeOperation = "destination-out";
      for (const op of plan.oeff) { g.fillRect(W - op.a1, zO - op.z1, op.a1 - op.a0, op.z1 - op.z0); }
      g.restore();
    };
  }
  function innenFlaeche(M, name, p0, p1, n, dicke, zUnten, plan, V) {
    /* p0, p1 = Außenkante (von außen links → rechts); innen läuft sie umgekehrt */
    const q0 = [p1[0] - n[0] * dicke, p1[1] - n[1] * dicke], q1 = [p0[0] - n[0] * dicke, p0[1] - n[1] * dicke];
    wandFlaeche(M, name + "-innen", q0, q1, zUnten, plan.zOben, innenMaler(plan, V), plan.umriss ? { umriss: plan.umriss.map((q) => [plan.w - q[0], q[1]]) } : {});
    /* Oberkante der Wand (Rähm von oben) */
    const holz = (g, F) => { g.fillStyle = rgb(hell(V.holz, 0.05)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); maserung(g, 0, 0, F.w, F.h, 3, 0.2, 0.6); };
    if (!plan.umriss) M.flaeche({ name: name + "-oben", o: [q1[0], q1[1], plan.zOben], u: [p1[0] - p0[0], p1[1] - p0[1], 0], v: [n[0], n[1], 0], w: Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), h: dicke, malen: holz });
  }

  /* ---------------- Baugrube ----------------
     Das Loch liegt UNTER dem Boden. Wir malen es in eine waagerechte Fläche
     auf Bodenhöhe (die Öffnung): Grubenboden und Wände werden aus der
     Blickrichtung in diese Fläche projiziert – die hinteren Wände sind
     sichtbar, die vorderen verschwinden hinter der Kante, in jedem Winkel. */
  /* RUNDE 1: Grube, Rand und Schnurgerüst bleiben innerhalb des Grundrisses
     (8 × 12 m) – vorher ragten sie 1–4,5 m hinaus und lagen in der Stadt
     über Wegen und Nachbarn. Arbeitsraum 0,4 m, Böschung in der Grube. */
  const GR = { x0: -EG_X - 0.4, x1: EG_X + 0.4, y0: EG_YN - 0.4, y1: EG_YS + 0.4 };
  const SCHNUR_D = 0.62;                                  // Schnurböcke: Abstand von der Bauflucht
  function grube(M, V, Z, winter) {
    const G = Z.grube;
    if (G) {
      teil(M, "grube", -8, null, 0);
      const w = GR.x1 - GR.x0, h = GR.y1 - GR.y0;
      if (G.tiefe > 0.01 || G.verfuellt > 0) {
        M.flaeche({ name: "grube", o: [GR.x0, GR.y0, 0.004], u: [1, 0, 0], v: [0, 1, 0], w: w, h: h, keinLicht: true, malen: grubeMaler(G, winter, w, h) });
      }
      /* Rand: zertretener, aufgeworfener Boden um die Grube (0,3 m) */
      const rand = (g, F) => {
        const r = ST.zufall(ST.textHash(F.name));
        g.fillStyle = winter ? "rgba(206,212,222,1)" : "rgba(104,84,58,1)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
        flecken(g, 0, 0, F.w, F.h, 0.9, winter ? 0.35 : 0.5, "dunkel", 3);
        g.fillStyle = winter ? "rgba(110,88,64,0.6)" : "rgba(70,54,36,0.6)";
        for (let i = 0; i < F.w * F.h * 16; i++) { g.beginPath(); g.ellipse(r() * F.w, r() * F.h, 0.04 + r() * 0.08, 0.025 + r() * 0.04, r() * 3, 0, Math.PI * 2); g.fill(); }
        if (winter) { g.fillStyle = "rgba(240,244,250,0.5)"; for (let i = 0; i < F.w * 6; i++) { g.beginPath(); g.ellipse(r() * F.w, r() * F.h, 0.1 + r() * 0.2, 0.05, 0, 0, Math.PI * 2); g.fill(); } }
      };
      const b = 0.3 * Math.min(1, G.tiefe * 3 + G.verfuellt);
      if (b > 0.02 && G.verfuellt < 1) {
        const um = (L, B) => [[0, 0], [L, 0], [L - B, B], [B, B]];
        M.flaeche({ name: "rand-n", o: [GR.x0 - b, GR.y0 - b, 0.003], u: [1, 0, 0], v: [0, 1, 0], w: w + 2 * b, h: b, umriss: um(w + 2 * b, b), malen: rand });
        M.flaeche({ name: "rand-s", o: [GR.x1 + b, GR.y1 + b, 0.003], u: [-1, 0, 0], v: [0, -1, 0], w: w + 2 * b, h: b, umriss: um(w + 2 * b, b), malen: rand });
        M.flaeche({ name: "rand-w", o: [GR.x0 - b, GR.y1 + b, 0.003], u: [0, -1, 0], v: [1, 0, 0], w: h + 2 * b, h: b, umriss: um(h + 2 * b, b), malen: rand });
        M.flaeche({ name: "rand-o", o: [GR.x1 + b, GR.y0 - b, 0.003], u: [0, 1, 0], v: [-1, 0, 0], w: h + 2 * b, h: b, umriss: um(h + 2 * b, b), malen: rand });
      }
      /* Schnurgerüst: Böcke an den Ecken, die Schnüre laufen von Brett zu
         Brett (0,62 m hoch) genau über der Bauflucht */
      if (G.schnur) {
        teil(M, "schnur", -7, null, 0);
        for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
          const x = sx > 0 ? EG_X : -EG_X, y = sy > 0 ? EG_YS : EG_YN;
          M.figur({ x: x + sx * SCHNUR_D, y: y + sy * SCHNUR_D, z: 0, breite: 1.6, hoehe: 0.9, schatten: false, malen: schnurbock(sx, sy) });
        }
        M.flaeche({
          name: "schnuere", o: [GR.x0 - 1, GR.y0 - 1, 0.62], u: [1, 0, 0], v: [0, 1, 0], w: w + 2, h: h + 2, keinLicht: true, ebene: 5,
          malen: (g, F) => {
            g.strokeStyle = "rgba(240,190,40,0.95)"; g.lineWidth = Math.max(0.008, 0.9 / F.px);
            const ox = GR.x0 - 1, oy = GR.y0 - 1, d = SCHNUR_D;
            g.beginPath();
            for (const x of [-EG_X, EG_X]) { g.moveTo(x - ox, EG_YN - d - oy); g.lineTo(x - ox, EG_YS + d - oy); }
            for (const y of [EG_YN, EG_YS]) { g.moveTo(-EG_X - d - ox, y - oy); g.lineTo(EG_X + d - ox, y - oy); }
            g.stroke();
          }
        });
      }
    }
    /* Aushub: zwei Haufen an der Rückseite (Nord) auf dem Grubenrand, dazu
       Mutterboden. Der Rest fährt mit dem Laster weg. Beim Verfüllen
       schrumpfen sie; eine Resthalde bleibt bis 0,3 stehen. */
    const menge = G ? G.haufen : Z.halde * 0.2;
    if (menge > 0.02) {
      teil(M, "haufen", -8, null, 0, { schatten: true, mitte: [0, -6.4, 0.5] });
      const hs = [[-1.8, -6.35, 2.6, 1.5, 19], [1.2, -6.45, 2.8, 1.7, 23], [3.2, -6.2, 1.5, 0.9, 29]];
      hs.forEach(([x, y, B, H, sd], i) => {
        const k = i === 2 ? Math.min(1, menge * 2) : Math.max(0, Math.min(1, (menge - (i === 0 ? 0.25 : 0)) / 0.75));
        if (k > 0.03) M.figur({ x: x, y: y, z: 0, breite: B + 0.6, hoehe: H + 0.3, schatten: true, malen: haufenMaler(k, winter, B, H, sd, i === 2) });
      });
    }
  }
  function schnurbock(sx, sy) {
    return function (g, s, F) {
      const gier = (F.gier || 0) * Math.PI / 180, c = Math.cos(gier), sn = Math.sin(gier);
      const P = (dx, dy, dz) => { const a = dx * c - dy * sn, b = dx * sn + dy * c; return [(a - b) * ST.KX * s, (a + b) * ST.KY * s - dz * ST.KZ * s]; };
      /* Figuren bekommen kein Kernlicht: nachts dunkler malen */
      const Zt = F.Z || { amb: [0.6, 0.6, 0.7], sonne: [0.4, 0.4, 0.4] }, li = Math.min(1, Zt.amb[1] + Zt.sonne[1] * 0.8);
      const holz = F.schatten ? "#000" : rgb(hellMal([181, 138, 85], li)), dunkel = F.schatten ? "#000" : rgb(hellMal([122, 90, 52], li));
      g.lineCap = "round";
      /* drei Pflöcke, zwei Bretter quer über die Bauflucht (Schnurbock) */
      const L = SCHNUR_D + 0.25;
      const pf = [[-sx * L, 0], [0, -sy * L]];
      for (const [dx, dy] of [[0, 0], ...pf]) {
        const a = P(dx, dy, 0), b = P(dx, dy, 0.75);
        g.strokeStyle = dunkel; g.lineWidth = Math.max(1, 0.06 * s); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
      }
      g.strokeStyle = holz; g.lineWidth = Math.max(1, 0.1 * s);
      for (const [dx, dy] of pf) { const a = P(0, 0, 0.62), b = P(dx, dy, 0.62); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
    };
  }
  function haufenMaler(k, winter, Bm, Hm, saat, mutter) {
    return function (g, s, F) {
      const r = ST.zufall(saat);
      const B = Bm * Math.sqrt(k) * s, H = Hm * Math.pow(k, 0.7) * s * ST.KZ;
      const pts = [];
      const n = 11;
      for (let i = 1; i < n; i++) { const t = i / n; pts.push([-B / 2 + B * t, -H * Math.pow(Math.sin(t * Math.PI), 0.8) * (0.88 + r() * 0.2)]); }
      const form = () => {
        g.beginPath(); g.moveTo(-B / 2, 0);
        for (const [x, y] of pts) g.lineTo(x, y);
        g.lineTo(B / 2, 0); g.quadraticCurveTo(0, B * 0.14, -B / 2, 0); g.closePath();
      };
      if (F.schatten) { g.fillStyle = "#000"; form(); g.fill(); return; }
      const Z = F.Z || { amb: [0.6, 0.6, 0.7], sonne: [0.4, 0.4, 0.4] };
      const li = Math.min(1, Z.amb[1] + Z.sonne[1] * 0.7);
      const cA = mutter ? [96, 72, 50] : [158, 122, 80], cB = mutter ? [62, 46, 32] : [116, 86, 56], cC = mutter ? [40, 30, 22] : [72, 54, 38];
      const gr = g.createLinearGradient(-B / 2, -H, B / 2, 0);
      gr.addColorStop(0, rgb(hellMal(cA, li))); gr.addColorStop(0.55, rgb(hellMal(cB, li))); gr.addColorStop(1, rgb(hellMal(cC, li)));
      form(); g.fillStyle = gr; g.fill();
      /* Klumpen, Steine, Wurzeln – mit Licht von links oben. Gesammelt in
         sechs Pfaden (je Farbe dunkel/hell): ein Füllbefehl statt Hunderten */
      const farben = [[170, 164, 150], cB, cA], dunkelP = farben.map(() => new Path2D()), hellP = farben.map(() => new Path2D());
      for (let i = 0; i < 140 * k; i++) {
        /* ohne Clip (teuer): die Klumpen bleiben unter der örtlichen Höhe */
        const x = (r() - 0.5) * B, yr = r(), rr = (0.05 + r() * 0.12) * s;
        const hier = H * Math.pow(Math.max(0, Math.sin((x / B + 0.5) * Math.PI)), 0.8) * 0.9, y = -yr * Math.max(0, hier - rr * 0.6);
        const ci = r() < 0.18 ? 0 : r() < 0.5 ? 1 : 2, rot = r() * 3;
        dunkelP[ci].moveTo(x + rr * 1.15, y + rr * 0.2); dunkelP[ci].ellipse(x + rr * 0.15, y + rr * 0.2, rr, rr * 0.7, 0, 0, Math.PI * 2);
        hellP[ci].moveTo(x + rr * 0.85 * Math.cos(rot), y + rr * 0.85 * Math.sin(rot)); hellP[ci].ellipse(x, y, rr * 0.85, rr * 0.6, rot, 0, Math.PI * 2);
      }
      for (let ci = 0; ci < 3; ci++) { g.fillStyle = rgb(hellMal(hell(farben[ci], -0.25), li)); g.fill(dunkelP[ci]); }
      for (let ci = 0; ci < 3; ci++) { g.fillStyle = rgb(hellMal(hell(farben[ci], 0.08), li)); g.fill(hellP[ci]); }
      if (!mutter && s > 20) {
        g.strokeStyle = rgb(hellMal([70, 50, 34], li)); g.lineWidth = Math.max(1, 0.02 * s);
        for (let i = 0; i < 4; i++) { const x = (r() - 0.5) * B * 0.6, y = -r() * H * 0.6; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 0.2 * s, y - 0.1 * s, x + 0.35 * s, y + 0.05 * s); g.stroke(); }
      }
      if (winter) {
        /* Schnee obenauf, in den Mulden liegen geblieben */
        g.fillStyle = "rgba(238,243,250,0.95)";
        g.beginPath(); g.moveTo(pts[1][0], pts[1][1] + H * 0.25);
        for (let i = 1; i < pts.length - 1; i++) g.lineTo(pts[i][0], pts[i][1] - s * 0.04);
        for (let i = pts.length - 2; i >= 1; i--) g.lineTo(pts[i][0], pts[i][1] + H * (0.18 + r() * 0.25));
        g.closePath(); g.fill();
        /* weiche Mulden im Schnee, unregelmäßig verteilt */
        g.fillStyle = "rgba(160,180,215,0.18)";
        for (let i = 2; i < pts.length - 2; i++) { if (r() < 0.45) continue; g.beginPath(); g.ellipse(pts[i][0] + (r() - 0.5) * B * 0.06, pts[i][1] + H * (0.12 + r() * 0.12), B * (0.03 + r() * 0.04), H * 0.03, (r() - 0.5) * 0.5, 0, Math.PI * 2); g.fill(); }
      }
    };
  }
  function grubeMaler(G, winter, W, H) {
    return function (g, F) {
      const B = blick(F);
      const en = Math.max(0.1, B.en);
      const D = Math.max(0.02, 1.05 * G.tiefe * (1 - G.verfuellt * 0.85));
      const P = (x, y, z) => [x - z * B.eu / en, y - z * B.ev / en];
      const k = 0.35, e = D * k;                      // Böschung
      const rng = ST.zufall(5);
      const nachWelt = (n) => [n[0] * B.c - n[1] * B.s, n[0] * B.s + n[1] * B.c, n[2]];
      const Lf = (n) => ST.lichtFaktor(ST.norm(nachWelt(n)), F.zeit, 0, F.jahr);
      /* Grubenboden */
      const boden = [P(e, e, -D), P(W - e, e, -D), P(W - e, H - e, -D), P(e, H - e, -D)];
      const Lb = Lf([0, 0, 1]);
      vieleck(g, boden); g.fillStyle = rgb(litC(G.schalung > 0 ? [150, 140, 122] : [132, 98, 62], Lb)); g.fill();
      g.save(); vieleck(g, boden); g.clip();
      flecken2(g, -1, -1, W + 2, H + 2, 1.4, 0.5, "dunkel", 3);
      /* Baggerzähne: flache Bögen im Boden */
      if (F.px > 12 && G.schalung <= 0) {
        g.strokeStyle = "rgba(60,42,26,0.35)"; g.lineWidth = Math.max(0.012, 0.8 / F.px);
        g.beginPath();
        for (let i = 0; i < 26; i++) { const q = P(0.4 + rng() * (W - 0.8), 0.4 + rng() * (H - 0.8), -D); for (let t = -2; t <= 2; t++) { g.moveTo(q[0] + t * 0.07, q[1]); g.lineTo(q[0] + t * 0.07 + 0.02, q[1] + 0.25); } }
        g.stroke();
      }
      /* RUNDE 2: Reifenspuren des Kippers über die Sohle (zwei Spuren mit
         Profil), im Winter Schnee in den Ecken, wo der Bagger nicht hinkam */
      if (F.px > 10 && G.tiefe > 0.25) {
        for (const off of [0, 1.85]) {
          const A = P(W * 0.25 + off, H - e, -D), E = P(W * 0.45 + off, e, -D), dx = E[0] - A[0], dy = E[1] - A[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
          g.strokeStyle = "rgba(50,36,24,0.28)"; g.lineWidth = 0.34;
          g.beginPath(); g.moveTo(A[0], A[1]); g.quadraticCurveTo((A[0] + E[0]) / 2 + nx * 0.4, (A[1] + E[1]) / 2 + ny * 0.4, E[0], E[1]); g.stroke();
          if (F.px > 30) {
            g.strokeStyle = "rgba(34,24,16,0.35)"; g.lineWidth = 0.03;
            g.beginPath();
            for (let t = 0; t < 1; t += 0.12 / L) { const q = 1 - t, bx = q * q * A[0] + 2 * q * t * ((A[0] + E[0]) / 2 + nx * 0.4) + t * t * E[0], by = q * q * A[1] + 2 * q * t * ((A[1] + E[1]) / 2 + ny * 0.4) + t * t * E[1]; g.moveTo(bx - nx * 0.15, by - ny * 0.15); g.lineTo(bx + dx / L * 0.05, by + dy / L * 0.05); g.lineTo(bx + nx * 0.15, by + ny * 0.15); }
            g.stroke();
          }
        }
      }
      if (winter && G.schalung <= 0) {
        /* unregelmäßige Wehen in den Ecken: gerundeter Umriss, zur Wand hin
           dicker (heller), zur Sohle hin dünn auslaufend */
        for (const [cx, cy] of [[e, e], [W - e, e], [W - e, H - e], [e, H - e]]) {
          const q = P(cx, cy, -D), R = 0.7 + rng() * 0.5, pts = [];
          for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2, rr = R * (0.55 + rng() * 0.5); pts.push([q[0] + Math.cos(a) * rr, q[1] + Math.sin(a) * rr * 0.75]); }
          for (const [kk, al] of [[1, 0.55], [0.65, 0.9]]) {
            g.fillStyle = "rgba(238,243,250," + al + ")"; g.beginPath();
            for (let k = 0; k < 12; k++) { const A = pts[k], Bp = pts[(k + 1) % 12]; const a1 = [q[0] + (A[0] - q[0]) * kk, q[1] + (A[1] - q[1]) * kk], b1 = [q[0] + (Bp[0] - q[0]) * kk, q[1] + (Bp[1] - q[1]) * kk], m = [(a1[0] + b1[0]) / 2, (a1[1] + b1[1]) / 2]; if (!k) g.moveTo(m[0], m[1]); else g.quadraticCurveTo(a1[0], a1[1], m[0], m[1]); }
            g.closePath(); g.fill();
          }
        }
      }
      if (G.schalung > 0) {
        /* Sauberkeitsschicht aus Schotter */
        g.fillStyle = rgb(litC([176, 170, 156], Lb));
        for (let i = 0; i < W * H * 30; i++) { const q = P(e + rng() * (W - 2 * e), e + rng() * (H - 2 * e), -D); g.fillRect(q[0], q[1], 0.03, 0.02); }
      } else if (G.tiefe > 0.25 && G.tiefe < 0.95) {
        /* Pfütze in der tiefsten Ecke (Nordost), im Winter gefroren */
        const pf = P(W - 1.1, 1.0, -D);
        const pr = ST.zufall(17), pts = [];
        for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, rr = 0.75 + pr() * 0.3; pts.push([pf[0] + Math.cos(a) * rr * 0.75, pf[1] + Math.sin(a) * rr * 0.5]); }
        const rund = () => { g.beginPath(); for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; if (!i) g.moveTo(m[0], m[1]); else g.quadraticCurveTo(a[0], a[1], m[0], m[1]); } const a = pts[0], b = pts[1]; g.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); g.closePath(); };
        rund(); g.strokeStyle = "rgba(52,38,28,0.45)"; g.lineWidth = 0.14; g.stroke();
        const pg = g.createLinearGradient(pf[0] - 0.8, pf[1] - 0.3, pf[0] + 0.8, pf[1] + 0.3);
        if (winter) { pg.addColorStop(0, "rgba(176,192,206,0.9)"); pg.addColorStop(0.45, "rgba(214,226,236,0.85)"); pg.addColorStop(1, "rgba(150,166,182,0.9)"); }
        else { pg.addColorStop(0, "rgba(58,66,74,0.7)"); pg.addColorStop(0.5, "rgba(120,136,150,0.55)"); pg.addColorStop(1, "rgba(48,54,60,0.7)"); }
        rund(); g.fillStyle = pg; g.fill();
        if (winter && F.px > 10) {
          g.strokeStyle = "rgba(255,255,255,0.55)"; g.lineWidth = 0.02;
          for (let i = 0; i < 5; i++) { const x = pf[0] + (pr() - 0.5) * 0.9, y = pf[1] + (pr() - 0.5) * 0.4; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (pr() - 0.5) * 0.5, y + (pr() - 0.5) * 0.2); g.stroke(); }
        }
      }
      g.restore();
      /* Wände: nur die, die zum Betrachter schauen. Schichten: Humus,
         Lehm, Sand – kräftig, damit man das Loch als Loch liest */
      const waende = [
        { r: [[0, 0], [W, 0]], f: [[e, e], [W - e, e]], n: [0, 1, k] },
        { r: [[W, 0], [W, H]], f: [[W - e, e], [W - e, H - e]], n: [-1, 0, k] },
        { r: [[W, H], [0, H]], f: [[W - e, H - e], [e, H - e]], n: [0, -1, k] },
        { r: [[0, H], [0, 0]], f: [[e, H - e], [e, e]], n: [1, 0, k] }
      ];
      const auge = [B.eu, B.ev, B.en];
      const sicht = waende.filter((wd) => wd.n[0] * auge[0] + wd.n[1] * auge[1] + wd.n[2] * auge[2] > 0.01);
      const schichten = [[0, 0.3, [60, 44, 30]], [0.3, 0.72, [150, 110, 64]], [0.72, 2, [190, 164, 118]]];
      for (const wd of sicht) {
        const L = Lf(wd.n);
        const pt = (i, t) => { const a = wd.r[i], b = wd.f[i]; return P(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, -D * t); };
        for (const [t0, t1, c] of schichten) {
          const a = Math.min(1, t0 / D), b = Math.min(1, t1 / D);
          if (a >= 1) continue;
          vieleck(g, [pt(0, a), pt(1, a), pt(1, b), pt(0, b)]);
          g.fillStyle = rgb(litC(c, L)); g.fill();
        }
        g.save(); vieleck(g, [pt(0, 0), pt(1, 0), pt(1, 1), pt(0, 1)]); g.clip();
        flecken(g, -1, -1, W + 2, H + 2, 0.9, 0.5, "dunkel", 11, 0.4);
        /* nach unten dunkler (Eigenschatten der Grube) */
        { const a = pt(0, 0), b = pt(0, 1); const gr = g.createLinearGradient(a[0], a[1], b[0], b[1]); gr.addColorStop(0, "rgba(20,14,10,0)"); gr.addColorStop(1, "rgba(20,14,10,0.35)"); g.fillStyle = gr; g.fillRect(-1, -1, W + 2, H + 2); }
        if (F.px > 15) {
          /* Baggerspuren. RUNDE 2 (Kritik: „Haarlinien in exakt gleichen
             Abständen wie eine Spundwand"): Riefen in Gruppen zu 3–5 (die
             Zahnbreite eines Löffels, 7 cm), Gruppenabstand zufällig
             0,15–0,6 m, Länge 40–90 % der Wandhöhe, Neigung ±8°,
             Deckkraft 0,15–0,3 – erst ab 60 Pixeln je Meter */
          if (F.px > 60) {
            const lw = Math.hypot(wd.r[1][0] - wd.r[0][0], wd.r[1][1] - wd.r[0][1]), rr = ST.zufall(ST.textHash(F.name) + Math.round(lw * 10));
            const auf = (t, q) => { const a = pt(0, q), b = pt(1, q); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; };
            g.lineWidth = Math.max(0.008, 0.8 / F.px);
            for (let x = 0.1 + rr() * 0.3; x < lw - 0.2; x += 0.3 + rr() * 0.45) {
              const n = 3 + Math.floor(rr() * 3), q0 = 0.03 + rr() * 0.25, q1 = Math.min(0.97, q0 + 0.4 + rr() * 0.5), kipp = (rr() - 0.5) * 0.28 * D;
              g.strokeStyle = "rgba(40,28,18," + (0.15 + rr() * 0.15).toFixed(2) + ")";
              g.beginPath();
              for (let k = 0; k < n; k++) { const t0 = (x + k * 0.07) / lw, t1 = (x + k * 0.07 + kipp) / lw; const A = auf(t0, q0), E = auf(t1, q1); g.moveTo(A[0], A[1]); g.lineTo(E[0], E[1]); }
              g.stroke();
              x += n * 0.07;
            }
          }
          g.fillStyle = rgb(litC([160, 154, 140], L));
          for (let i = 0; i < 30; i++) { const s = rng(), t = rng(); const a = pt(0, t), b = pt(1, t); g.beginPath(); g.ellipse(a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, 0.05, 0.035, 0, 0, Math.PI * 2); g.fill(); }
        }
        g.restore();
        /* überhängende Oberkante: Grasnarbe (Frühling) oder Schneekante (Winter) */
        const a0 = pt(0, 0), a1 = pt(1, 0), lip = winter ? [236, 241, 249] : [86, 112, 58];
        g.fillStyle = rgb(litC(lip, Lf([0, 0, 1])));
        g.beginPath(); g.moveTo(a0[0], a0[1]);
        const nS = 16;
        for (let i = 0; i <= nS; i++) { const t = i / nS, q = [a0[0] + (a1[0] - a0[0]) * t, a0[1] + (a1[1] - a0[1]) * t], d = pt(0, 0.1); const dy = (d[1] - a0[1]) * (0.5 + 0.5 * Math.sin(t * 23 + 1)) * 0.6 + 0.03; g.lineTo(q[0] + (d[0] - a0[0]) * 0.3, q[1] + Math.max(0.03, dy)); }
        g.lineTo(a1[0], a1[1]); g.closePath(); g.fill();
      }
      /* Streifenfundament mit Eisen, Schalung und Beton (in der Grube) */
      if ((G.eisen > 0 || G.schalung > 0) && G.verfuellt < 1) {
        const bx = (x) => x - GR.x0, by = (y) => y - GR.y0;
        const kisten = [];
        const sb = 0.5, zT = 0.02;
        const ring = [
          [-EG_X - 0.05, EG_YS - sb + 0.05, EG_X + 0.05, EG_YS + 0.05],
          [-EG_X - 0.05, EG_YN - 0.05, EG_X + 0.05, EG_YN + sb - 0.05],
          [EG_X - sb + 0.05, EG_YN + sb - 0.05, EG_X + 0.05, EG_YS - sb + 0.05],
          [-EG_X - 0.05, EG_YN + sb - 0.05, -EG_X + sb - 0.05, EG_YS - sb + 0.05]
        ];
        const zb = -D;
        for (const [x0, y0, x1, y1] of ring) {
          const n = G.schalung;
          if (n > 0 && !G.ausgeschalt) {
            /* Schalbretter beidseits (Längsseiten) */
            const lang = x1 - x0 > y1 - y0;
            const bh = zb + (zT - zb) * n;
            if (lang) { kisten.push({ b: [bx(x0), by(y0 - 0.03), bx(x1), by(y0), zb, bh], art: "brett" }); kisten.push({ b: [bx(x0), by(y1), bx(x1), by(y1 + 0.03), zb, bh], art: "brett" }); }
            else { kisten.push({ b: [bx(x0 - 0.03), by(y0), bx(x0), by(y1), zb, bh], art: "brett" }); kisten.push({ b: [bx(x1), by(y0), bx(x1 + 0.03), by(y1), zb, bh], art: "brett" }); }
            /* RUNDE 2 (Kritik: „flache Pappflächen ohne Bretter, Pflöcke
               oder Streben"): alle 0,8 m ein Pflock außen an jedem Brett mit
               Schrägstrebe zum Boden, oben eine Latte mit Nagelköpfen */
            if (n > 0.5) {
              const L0 = lang ? x0 : y0, L1 = lang ? x1 : y1;
              for (const [seite, sg] of [[lang ? y0 - 0.03 : x0 - 0.03, -1], [lang ? y1 + 0.03 : x1 + 0.03, 1]]) {
                for (let t = L0 + 0.25; t < L1 - 0.1; t += 0.8) {
                  const pb = lang ? [bx(t - 0.03), by(sg < 0 ? seite - 0.05 : seite), bx(t + 0.03), by(sg < 0 ? seite : seite + 0.05)] : [bx(sg < 0 ? seite - 0.05 : seite), by(t - 0.03), bx(sg < 0 ? seite : seite + 0.05), by(t + 0.03)];
                  const fx = lang ? bx(t) : bx(seite + sg * 0.05), fy = lang ? by(seite + sg * 0.05) : by(t);
                  const ax = lang ? fx : fx + sg * 0.38, ay = lang ? fy + sg * 0.38 : fy;
                  kisten.push({ b: [pb[0], pb[1], pb[2], pb[3], zb, bh + 0.08], art: "pflock", strebe: [[fx, fy, bh - 0.04], [ax, ay, zb]] });
                }
                const lb = lang ? [bx(x0), by(sg < 0 ? seite - 0.045 : seite), bx(x1), by(sg < 0 ? seite : seite + 0.045)] : [bx(sg < 0 ? seite - 0.045 : seite), by(y0), bx(sg < 0 ? seite : seite + 0.045), by(y1)];
                kisten.push({ b: [lb[0], lb[1], lb[2], lb[3], bh - 0.1, bh - 0.02], art: "latte" });
              }
            }
          }
          if (G.beton > 0) kisten.push({ b: [bx(x0), by(y0), bx(x1), by(y1), zb, zb + (zT - 0.02 - zb) * G.beton], art: G.ausgeschalt ? "betonAlt" : "beton" });
          else kisten.push({ b: [bx(x0), by(y0), bx(x1), by(y1), zb, zb + 0.02], art: "eisen" });
        }
        kistenMalen(g, F, B, P, kisten, Lf);
      }
    };
  }
  /* Kästen in der Grube: nach Tiefe sortiert, sichtbare Seiten */
  function kistenMalen(g, F, B, P, kisten, Lf) {
    const a = [B.eu, B.ev, B.en];
    kisten.sort((p, q) => ((p.b[0] + p.b[2]) * a[0] + (p.b[1] + p.b[3]) * a[1]) - ((q.b[0] + q.b[2]) * a[0] + (q.b[1] + q.b[3]) * a[1]));
    const farben = { brett: [176, 132, 80], beton: [146, 146, 142], betonAlt: [176, 174, 166], eisen: [90, 70, 58], pflock: [150, 112, 70], latte: [192, 150, 96] };
    for (const k of kisten) {
      const [x0, y0, x1, y1, z0, z1] = k.b, c = farben[k.art];
      const seiten = [
        { n: [0, 1, 0], p: [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]] },
        { n: [0, -1, 0], p: [[x1, y0, z1], [x0, y0, z1], [x0, y0, z0], [x1, y0, z0]] },
        { n: [1, 0, 0], p: [[x1, y1, z1], [x1, y0, z1], [x1, y0, z0], [x1, y1, z0]] },
        { n: [-1, 0, 0], p: [[x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [x0, y0, z0]] },
        { n: [0, 0, 1], p: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]] }
      ];
      for (const sd of seiten) {
        if (sd.n[0] * a[0] + sd.n[1] * a[1] + sd.n[2] * a[2] <= 0) continue;
        const L = Lf(sd.n);
        const q = sd.p.map((p) => P(p[0], p[1], p[2]));
        vieleck(g, q); g.fillStyle = rgb(litC(c, L)); g.fill();
        if (k.art === "brett" && sd.n[2] === 0 && F.px > 10) {
          /* Schalbretter 0,2 m hoch mit dunklen Fugen, jedes Brett etwas anders */
          g.save(); vieleck(g, q); g.clip();
          const rr = ST.zufall(Math.round((x0 + y0) * 100));
          for (let z = z0; z < z1; z += 0.2) {
            const u0 = P(sd.p[0][0], sd.p[0][1], z), u1 = P(sd.p[1][0], sd.p[1][1], z), v0 = P(sd.p[0][0], sd.p[0][1], Math.min(z1, z + 0.2)), v1 = P(sd.p[1][0], sd.p[1][1], Math.min(z1, z + 0.2));
            g.fillStyle = rr() < 0.5 ? "rgba(255,240,210,0.1)" : "rgba(60,36,16,0.1)"; vieleck(g, [u0, u1, v1, v0]); g.fill();
            g.strokeStyle = "rgba(60,40,22,0.55)"; g.lineWidth = Math.max(0.008, 0.9 / F.px); g.beginPath(); g.moveTo(u0[0], u0[1]); g.lineTo(u1[0], u1[1]); g.stroke();
          }
          flecken(g, -20, -20, 60, 60, 0.8, 0.3, "holz", 5);
          g.restore();
        }
        if (k.art === "latte" && sd.n[2] === 0 && F.px > 30) {
          /* Nagelköpfe alle 0,4 m */
          g.fillStyle = "rgba(60,60,64,0.9)";
          const zm = (z0 + z1) / 2;
          for (let t = 0.1; t < 1; t += 0.4 / Math.max(0.4, Math.hypot(sd.p[1][0] - sd.p[0][0], sd.p[1][1] - sd.p[0][1]))) { const a = P(sd.p[0][0] + (sd.p[1][0] - sd.p[0][0]) * t, sd.p[0][1] + (sd.p[1][1] - sd.p[0][1]) * t, zm); g.beginPath(); g.arc(a[0], a[1], 0.012, 0, Math.PI * 2); g.fill(); }
        }
        if (k.art === "betonAlt" && sd.n[2] === 0 && F.px > 12) {
          /* Schalungsspuren: waagerechte Brettabdrücke */
          g.save(); vieleck(g, q); g.clip();
          g.strokeStyle = "rgba(90,90,86,0.4)"; g.lineWidth = Math.max(0.006, 0.7 / F.px);
          g.beginPath();
          for (let z = z0 + 0.12; z < z1; z += 0.12) { const u0 = P(sd.p[0][0], sd.p[0][1], z), u1 = P(sd.p[1][0], sd.p[1][1], z); g.moveTo(u0[0], u0[1]); g.lineTo(u1[0], u1[1]); }
          g.stroke(); g.restore();
        }
        if (k.strebe && sd.n[2] === 1) {
          const [A, E] = k.strebe, pa = P(A[0], A[1], A[2]), pe = P(E[0], E[1], E[2]);
          g.strokeStyle = rgb(litC([140, 104, 64], Lf([0, 0, 1]))); g.lineWidth = 0.05;
          g.beginPath(); g.moveTo(pa[0], pa[1]); g.lineTo(pe[0], pe[1]); g.stroke();
          g.strokeStyle = "rgba(255,236,200,0.25)"; g.lineWidth = 0.015;
          g.beginPath(); g.moveTo(pa[0], pa[1] - 0.012); g.lineTo(pe[0], pe[1] - 0.012); g.stroke();
        }
        if (k.art === "eisen" && sd.n[2] === 1) {
          g.strokeStyle = "rgba(60,40,32,0.9)"; g.lineWidth = 0.02;
          g.beginPath(); for (const t of [0.25, 0.75]) { const u0 = P(x0 + (x1 - x0) * (x1 - x0 > y1 - y0 ? 0 : t), y0 + (y1 - y0) * (x1 - x0 > y1 - y0 ? t : 0), z1 + 0.1), u1 = P(x0 + (x1 - x0) * (x1 - x0 > y1 - y0 ? 1 : t), y0 + (y1 - y0) * (x1 - x0 > y1 - y0 ? t : 1), z1 + 0.1); g.moveTo(u0[0], u0[1]); g.lineTo(u1[0], u1[1]); } g.stroke();
        }
      }
    }
  }

  /* ---------------- Bodenplatte ----------------
     Beton mit Glättspuren (Flügelglätter: flache Bögen), Kiesnestern und
     Abplatzungen am Rand; an den Seiten die Abdrücke der Schalbretter. */
  function bodenplatte(M, V, Z) {
    teil(M, "platte", -6, null, 0);
    const h = 0.1 * Z.platte;
    if (h < 0.005) return;
    const oben = (g, F) => {
      const r = ST.zufall(41);
      g.fillStyle = "rgb(176,175,170)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      flecken2(g, 0, 0, F.w, F.h, 2.6, 0.3, "dunkel", 13);
      flecken(g, 0, 0, F.w, F.h, 1.9, 0.22, "hell", 7, 0.3);
      if (F.px > 25) flecken(g, 0, 0, F.w, F.h, 0.4, 0.25, "korn", 5);
      if (F.px > 10) {
        /* Glättspuren: Fächer aus flachen Bögen, je Standplatz des Glätters */
        g.lineWidth = Math.max(0.01, 0.9 / F.px);
        for (let i = 0; i < F.w * F.h / 2.2; i++) {
          const cx = r() * F.w, cy = r() * F.h, R = 0.45 + r() * 0.35, a0 = r() * Math.PI * 2;
          for (let k = 0; k < 4; k++) {
            g.strokeStyle = k % 2 ? "rgba(214,212,206,0.35)" : "rgba(128,126,120,0.22)";
            g.beginPath(); g.arc(cx, cy, R - k * 0.06, a0, a0 + 1.1 + r() * 0.5); g.stroke();
          }
        }
        /* Kiesnester: grobe Körnung, wo der Beton nicht gut verdichtet ist */
        for (let i = 0; i < 5; i++) {
          const cx = r() < 0.5 ? r() * 0.4 : F.w - r() * 0.4, cy = r() * F.h;
          for (let k = 0; k < 16; k++) { g.fillStyle = r() < 0.5 ? "rgba(110,104,96,0.8)" : "rgba(196,190,178,0.8)"; g.beginPath(); g.ellipse(cx + (r() - 0.5) * 0.22, cy + (r() - 0.5) * 0.18, 0.012 + r() * 0.016, 0.01 + r() * 0.01, r() * 3, 0, Math.PI * 2); g.fill(); }
        }
        /* Abplatzungen an der Kante */
        g.fillStyle = "rgba(120,118,112,0.8)";
        for (let i = 0; i < 9; i++) { const t = r(), x = r() < 0.5 ? (r() < 0.5 ? 0 : F.w) : t * F.w, y = x === 0 || x === F.w ? t * F.h : (r() < 0.5 ? 0 : F.h); g.beginPath(); g.ellipse(x, y, 0.05 + r() * 0.06, 0.03 + r() * 0.03, r() * 3, 0, Math.PI * 2); g.fill(); }
      }
      /* Schnee: im Winter bleibt er in den Ecken und an den Rändern liegen */
      /* RUNDE 2 (Kritik: „weiße Punkte wie Konfetti am Rand"): unregelmäßige,
         weich gerandete Schneeflecken – in den Ecken, entlang der Ränder und
         im Windschatten, dazwischen Puder in den Glättspuren */
      if (F.jahr === "winter") {
        const fleck = (cx, cy, R) => {
          const pts = [];
          for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2, rr = R * (0.6 + r() * 0.55); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.8]); }
          g.beginPath();
          for (let k = 0; k < 12; k++) { const a = pts[k], b = pts[(k + 1) % 12]; const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; if (!k) g.moveTo(m[0], m[1]); else g.quadraticCurveTo(a[0], a[1], m[0], m[1]); }
          g.quadraticCurveTo(pts[0][0], pts[0][1], (pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2); g.closePath();
        };
        g.fillStyle = "rgba(238,243,250,0.9)";
        for (const [cx, cy] of [[0.2, 0.2], [F.w - 0.2, 0.3], [F.w - 0.3, F.h - 0.2], [0.25, F.h - 0.3]]) { fleck(cx, cy, 0.5 + r() * 0.4); g.fill(); }
        for (let i = 0; i < 7; i++) { const rand = r() < 0.5, x = rand ? (r() < 0.5 ? 0.15 : F.w - 0.15) : r() * F.w, y = rand ? r() * F.h : (r() < 0.5 ? 0.15 : F.h - 0.15); fleck(x, y, 0.25 + r() * 0.35); g.fill(); }
        g.fillStyle = "rgba(238,243,250,0.35)";
        for (let i = 0; i < 5; i++) { fleck(0.8 + r() * (F.w - 1.6), 0.8 + r() * (F.h - 1.6), 0.4 + r() * 0.5); g.fill(); }
      }
    };
    const seite = (g, F) => {
      g.fillStyle = "rgb(166,164,158)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      /* Schalungsspuren: Brettstöße und Maserung abgedruckt */
      g.fillStyle = "rgba(90,90,86,0.35)"; for (let y = 0.03; y < F.h; y += 0.06) g.fillRect(0, y, F.w, 0.006);
      g.fillStyle = "rgba(90,90,86,0.4)"; for (let x = 1.2; x < F.w; x += 2.5) g.fillRect(x, 0, 0.01, F.h);
    };
    M.quader({ x: -EG_X - 0.05, y: EG_YN - 0.05, z: 0, b: 2 * EG_X + 0.1, t: EG_YS - EG_YN + 0.1, h: h }, { sued: seite, nord: seite, ost: seite, west: seite, oben: oben });
  }

  /* ---------------- Sockel wächst Lage für Lage ----------------
     Solange das Fachwerk offen ist, ist der Sockel ein eigener Ring mit
     Innenseiten und Oberseite. RUNDE 1: Die frisch gesetzte Lage ist
     heller, oben liegt nasser Mörtel (Mauerkrone), an der Südwestecke
     stehen ein Steinstapel und ein Mörtelkübel – so sieht man „Steinlage
     für Steinlage" auch aus der Ferne. */
  function sockelRing(M, V, Z, winter) {
    const d = 0.45, lage = Z_SO / 3;
    const seiten = ["sued", "ost", "nord", "west"];
    const schritt = Z.sockel * 12;
    const lagenZahl = seiten.map((s, i) => { let k = 0; for (let j = 0; j < 3; j++) if (schritt >= j * 4 + i + 0.5) k++; return k; });
    const hoehe = lagenZahl.map((k) => (k === 3 ? Z_SO : k * lage));
    const X = EG_X, YS = EG_YS, YN = EG_YN;
    const fertig = Z.sockel >= 0.999;
    const stein = (voll, h) => (g, F) => {
      sockelMalen(g, F, -0.05, 0, F.w + 0.1, F.h, ST.textHash(F.name) % 50 + 3, { decke: voll });
      if (!fertig && F.jahr !== "sommer") {
        /* frische Lage: heller, der Mörtel noch dunkel-feucht */
        const lh = Math.min(lage, h);
        g.fillStyle = "rgba(255,252,240,0.16)"; g.fillRect(-0.1, 0, F.w + 0.2, lh);
        g.fillStyle = "rgba(90,84,74,0.25)"; g.fillRect(-0.1, lh - 0.02, F.w + 0.2, 0.02);
      }
    };
    const oben = (g, F) => {
      const c = [196, 180, 150];
      g.fillStyle = rgb(c); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      flecken(g, 0, 0, F.w, F.h, 1, 0.4, "dunkel", 17);
      g.fillStyle = "rgba(90,78,60,0.5)";
      const lang = F.w > F.h;
      for (let a = 0.7; a < (lang ? F.w : F.h); a += 0.75) { if (lang) g.fillRect(a, 0, 0.014, F.h); else g.fillRect(0, a, F.w, 0.014); }
      if (!fertig) {
        /* Mauerkrone: frischer Mörtel, wulstig aufgetragen */
        const r = ST.zufall(ST.textHash(F.name));
        g.fillStyle = "rgba(150,146,136,0.85)";
        for (let i = 0; i < (F.w + F.h) * 10; i++) { const x = lang ? r() * F.w : F.w * (0.2 + r() * 0.6), y = lang ? F.h * (0.2 + r() * 0.6) : r() * F.h; g.beginPath(); g.ellipse(x, y, lang ? 0.09 : 0.05, lang ? 0.05 : 0.09, 0, 0, Math.PI * 2); g.fill(); }
      }
    };
    const def = {
      sued: { p0: [-X, YS], p1: [X, YS], n: N_S, innen: [[X - d, YS - d], [-X + d, YS - d]], oben: { x: -X, y: YS - d, b: 2 * X, t: d } },
      ost: { p0: [X, YS], p1: [X, YN], n: N_O, innen: [[X - d, YN + d], [X - d, YS - d]], oben: { x: X - d, y: YN + d, b: d, t: YS - YN - 2 * d } },
      nord: { p0: [X, YN], p1: [-X, YN], n: N_N, innen: [[-X + d, YN + d], [X - d, YN + d]], oben: { x: -X, y: YN, b: 2 * X, t: d } },
      west: { p0: [-X, YN], p1: [-X, YS], n: N_W, innen: [[-X + d, YS - d], [-X + d, YN + d]], oben: { x: -X, y: YN + d, b: d, t: YS - YN - 2 * d } }
    };
    seiten.forEach((s, i) => {
      const h = hoehe[i];
      if (h < 0.01) return;
      const D2 = def[s];
      teil(M, "sockel-" + s, ST_EG - 1, D2.n, 0.2);
      wandFlaeche(M, "sockel-" + s, D2.p0, D2.p1, 0, h, stein(h >= Z_SO - 0.01, h), { ao: true });
      wandFlaeche(M, "sockel-i-" + s, D2.innen[0], D2.innen[1], 0, h, stein(false, h), {});
      const ob = D2.oben;
      M.flaeche({ name: "sockel-o-" + s, o: [ob.x, ob.y, h], u: [1, 0, 0], v: [0, 1, 0], w: ob.b, h: ob.t, malen: oben });
    });
    /* Baustoffe an der Südwestecke, solange gemauert wird */
    if (Z.bau < 0.33) {
      teil(M, "baustoff", ST_EG - 1, [-0.7, 0.7, 0], 5);
      const st = (c) => (g, F) => { g.fillStyle = rgb(c); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); flecken(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, 0.5, 0.4, "dunkel", 5); g.fillStyle = "rgba(40,36,30,0.4)"; for (let y = 0.1; y < F.h; y += 0.14) g.fillRect(-0.1, y, F.w + 0.2, 0.012); for (let x = 0.2; x < F.w; x += 0.27) g.fillRect(x, 0, 0.012, F.h); };
      kasten(M, -X - 0.75, YS - 0.9, 0, -X - 0.2, YS - 0.2, 0.42, { sued: st([150, 140, 124]), nord: st([150, 140, 124]), ost: st([140, 132, 118]), west: st([140, 132, 118]), oben: st([162, 150, 132]) });
      const kuebel = (g, F) => { g.fillStyle = "rgb(34,34,36)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(-0.1, 0, F.w + 0.2, 0.03); };
      kasten(M, -X - 0.7, YS + 0.05, 0, -X - 0.25, YS + 0.5, 0.3, { sued: kuebel, nord: kuebel, ost: kuebel, west: kuebel, oben: (g, F) => { g.fillStyle = "rgb(150,146,138)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.fillStyle = "rgb(34,34,36)"; g.lineWidth = 0.04; g.strokeRect(0, 0, F.w, F.h); } });
    }
    void winter;
  }

  /* ---------------- Balkenlagen (von oben: Balken, dann Dielen) ----------------
     balken: [[x0,y0,x1,y1,breite]] in Modellkoordinaten, von oben z */
  function balkenlage(M, name, z, rahmen, balken, hoehe, zeitBalken, dielen, V, dielenRichtung) {
    const m = 0.5, [X0, Y0, X1, Y1] = rahmen;
    const w = X1 - X0 + 2 * m, h = Y1 - Y0 + 2 * m;
    const ox = X0 - m, oy = Y0 - m;
    const r = ST.zufall(ST.textHash(name));
    const hl = balken.map((b, i) => ({ art: "riegel", x0: b[0] - ox, y0: b[1] - oy, x1: b[2] - ox, y1: b[3] - oy, b: b[4], r: ST.zufall((r() * 1e9) | 0), zeit: i / Math.max(1, balken.length), naegel: false }));
    M.flaeche({
      name: name, o: [ox, oy, z], u: [1, 0, 0], v: [0, 1, 0], w: w, h: h, keinLicht: true,
      malen: (g, F) => {
        const st = [];
        for (const hh of hl) if (hh.zeit < zeitBalken) st.push({ poly: balkenVieleck(hh), t0: 0, t1: hoehe, lage: 0, farbe: V.holz, malen: (gg, L) => balkenMalen(gg, F, hh, litC(hell(V.holz, 0.08), L)) });
        const zw = {};
        if (dielen > 0) {
          zw[1] = null;
          /* Dielen: Bretter quer zu den Balken, von Süden her verlegt */
          const X0d = rahmen[0] - ox, X1d = rahmen[2] - ox, Y0d = rahmen[1] - oy, Y1d = rahmen[3] - oy;
          const ende = dielenRichtung === "x" ? X0d + (X1d - X0d) * dielen : Y1d - (Y1d - Y0d) * dielen;
          const poly = dielenRichtung === "x" ? [[X0d, Y0d], [ende, Y0d], [ende, Y1d], [X0d, Y1d]] : [[X0d, ende], [X1d, ende], [X1d, Y1d], [X0d, Y1d]];
          st.push({
            poly: poly, t0: -0.03, t1: 0, lage: 1, farbe: [176, 140, 96], malen: (gg, L) => {
              const c = litC([178, 142, 98], L);
              gg.fillStyle = rgb(c); vieleck(gg, poly); gg.fill();
              gg.save(); vieleck(gg, poly); gg.clip();
              maserung(gg, X0d, Y0d, X1d - X0d, Y1d - Y0d, 2.5, 0.2, 0.45);
              /* Bretter liegen quer zu den Balken: verlegt wird in Richtung
                 dielenRichtung, die Fugen laufen quer dazu */
              gg.fillStyle = rgb(hellMal(c, 0.55), 0.8);
              if (dielenRichtung === "y") for (let y = Y0d; y < Y1d; y += 0.2) gg.fillRect(X0d, y, X1d - X0d, Math.max(0.006, 0.7 / F.px));
              else for (let x = X0d; x < X1d; x += 0.2) gg.fillRect(x, Y0d, Math.max(0.006, 0.7 / F.px), Y1d - Y0d);
              /* Stoßfugen versetzt */
              if (F.px > 15) {
                const rr = ST.zufall(7);
                if (dielenRichtung === "y") for (let y = Y0d; y < Y1d; y += 0.2) { const x = X0d + rr() * (X1d - X0d); gg.fillRect(x, y, Math.max(0.006, 0.7 / F.px), 0.2); }
                else for (let x = X0d; x < X1d; x += 0.2) { const y = Y0d + rr() * (Y1d - Y0d); gg.fillRect(x, y, 0.2, Math.max(0.006, 0.7 / F.px)); }
              }
              gg.restore();
            }
          });
        }
        prismen(g, F, st, zw);
      }
    });
  }

  /* ---------------- Dachstuhl: Sparren, Latten, Ziegel Reihe für Reihe ---------------- */
  function walmDefs(D) {
    const h = D.xK / CA, w = D.yS - D.yN, hs = (D.yS - D.yRS) / CB, hn = (D.yRN - D.yN) / CB, hA = (D.xE - D.xK) / CAU;
    const rechteck = [[0, 0], [w, 0], [w, hA], [0, hA]];
    return [
      { name: "ost", o: [0, D.yS, D.zR], u: [0, -1, 0], v: [CA, 0, -SA], w: w, h: h, n: N_DO, art: "haupt", unten: hA, umriss: [[D.yS - D.yRS, 0], [0, D.xGS / CA], [0, h], [w, h], [w, D.xGN / CA], [D.yS - D.yRN, 0]] },
      { name: "west", o: [0, D.yN, D.zR], u: [0, 1, 0], v: [-CA, 0, -SA], w: w, h: h, n: N_DW, art: "haupt", unten: hA, umriss: [[D.yRN - D.yN, 0], [0, D.xGN / CA], [0, h], [w, h], [w, D.xGS / CA], [D.yRS - D.yN, 0]] },
      /* Aufschieblinge: kurze Bohlen auf den Sparrenfüßen, vom Knick zur Traufe */
      { name: "auf-ost", o: [D.xK, D.yS, D.zKn], u: [0, -1, 0], v: [CAU, 0, -SAU], w: w, h: hA, n: N_DO, art: "auf", oben: h, umriss: rechteck },
      { name: "auf-west", o: [-D.xK, D.yN, D.zKn], u: [0, 1, 0], v: [-CAU, 0, -SAU], w: w, h: hA, n: N_DW, art: "auf", oben: h, umriss: rechteck },
      { name: "schopf-s", o: [-D.xGS, D.yRS, D.zR], u: [1, 0, 0], v: [0, CB, -SB], w: 2 * D.xGS, h: hs, n: [0, SB, CB], art: "schopf", umriss: [[D.xGS, 0], [2 * D.xGS, hs], [0, hs]] },
      { name: "schopf-n", o: [D.xGN, D.yRN, D.zR], u: [-1, 0, 0], v: [0, -CB, -SB], w: 2 * D.xGN, h: hn, n: [0, -SB, CB], art: "schopf", umriss: [[D.xGN, 0], [2 * D.xGN, hn], [0, hn]] }
    ];
  }
  function dachstuhl(M, V, Z, winter) {
    const D = walm(0, 0, 0);
    for (const d of walmDefs(D)) {
      teil(M, "stuhl-" + d.name, ST_DACH, d.n, 0);
      const m = 0.5;
      M.flaeche({
        name: "stuhl-" + d.name, o: d.o, u: d.u, v: d.v, w: d.w, h: d.h, beidseitig: true, keinLicht: true,
        umriss: [[-m, -m], [d.w + m, -m], [d.w + m, d.h + m], [-m, d.h + m]],
        malen: dachstuhlMaler(d, V, Z)
      });
    }
  }
  function dachstuhlMaler(d, V, Z) {
    return function (g, F) {
      const um = d.umriss, st = [];
      const r = ST.zufall(ST.textHash(d.name));
      const holz = (poly, t0, t1, lage, zeit, h) => { if (poly.length >= 3) st.push({ poly: poly, t0: t0, t1: t1, lage: lage, farbe: V.holz, malen: h ? (gg, L) => balkenMalen(gg, F, h, litC(hell([150, 110, 70], 0), L)) : null, zeit: zeit }); };
      const mk = (x0, y0, x1, y1, b, art) => ({ art: art || "sparren", x0, y0, x1, y1, b, r: ST.zufall((r() * 1e9) | 0), naegel: false });
      /* Sparren. Reihenfolge wie auf dem Bau: erst das volle Gespärre am
         Walmansatz, dann die Gratsparren, erst danach die Schifter (kurze
         Sparren zwischen Grat und Traufe) – nichts hängt in der Luft. */
      const abst = d.art === "schopf" ? 0.62 : 0.8;
      /* Latten und Ziegel laufen von der Traufe über den Knick bis zum First:
         erst der Aufschiebling, dann die Hauptfläche */
      const gesamt = d.h + (d.unten || 0) + (d.oben || 0);
      const bedeckt = (k) => { const L = k * gesamt; return d.art === "auf" ? Math.min(d.h, L) : d.art === "haupt" ? klemm(L - d.unten, 0, d.h) : L; };
      const n = Math.floor((d.w - 0.2) / abst);
      const sued = (u) => (/ost/.test(d.name) ? u < d.w / 2 : /west/.test(d.name) ? u > d.w / 2 : d.name === "schopf-s");
      for (let i = 0; i <= n; i++) {
        const a = 0.1 + i * (d.w - 0.2) / Math.max(1, n);
        const h = mk(a, -0.2, a, d.h + 0.2, 0.14);
        h._poly = schneidePoly(balkenVieleck(h), um); h.geschnitten = true;
        if (h._poly.length < 3) continue;
        let zeit;
        if (d.art === "haupt" || d.art === "auf") {
          const t = /ost/.test(d.name) ? a / d.w : 1 - a / d.w;
          const voll = Math.min(...h._poly.map((q) => q[1])) < 0.3;
          zeit = voll ? t : sued(a) ? 0.1 + t * 0.2 : 0.94 + (t - 0.9) * 0.5;
        } else zeit = sued(a) ? 0.1 + (a / d.w) * 0.05 : 0.95 + (a / d.w) * 0.04;
        if (zeit > Z.sparren) continue;
        holz(h._poly, 0.04, 0.22, 0, zeit, h);
      }
      /* Grat- und Ortgangsparren entlang der Kanten: im Süden gleich nach dem
         ersten vollen Gespärre, im Norden kurz vor dem Schluss; das Firstbrett zuletzt */
      for (let i = 0; i < um.length; i++) {
        const a = um[i], b = um[(i + 1) % um.length];
        if (Math.abs(a[1] - b[1]) < 0.01 && (a[1] > d.h - 0.01)) continue;   // Traufe
        const first = a[1] < 0.01 && b[1] < 0.01;
        if (first && d.art === "auf") continue;                              // Knick, kein Firstbrett
        const zeit = first ? 0.97 : sued((a[0] + b[0]) / 2) ? 0.09 : 0.93;
        if (zeit > Z.sparren) continue;
        const h = mk(a[0], a[1], b[0], b[1], 0.2);
        const nrm = polyNormalen(um)[i];
        const q = streifen(a[0] - nrm[0] * 0.1, a[1] - nrm[1] * 0.1, b[0] - nrm[0] * 0.1, b[1] - nrm[1] * 0.1, 0.2);
        h._poly = schneidePoly(q, um); h.geschnitten = true;
        holz(h._poly, 0.04, 0.24, 0, 1, h);
      }
      /* Latten von der Traufe her */
      if (Z.latten > 0) {
        const bis = d.h - bedeckt(Z.latten);
        for (let b = d.h - 0.08; b > bis; b -= 0.155) {
          const poly = schneidePoly([[-1, b - 0.025], [d.w + 1, b - 0.025], [d.w + 1, b + 0.025], [-1, b + 0.025]], um);
          if (poly.length >= 3) st.push({ poly: poly, t0: 0, t1: 0.04, lage: 1, farbe: [182, 150, 104] });
        }
      }
      const zw = {};
      /* Ziegel Reihe für Reihe von der Traufe zum First */
      if (Z.ziegel > 0) {
        const bf = d.h - Math.floor(bedeckt(Z.ziegel) / 0.155) * 0.155;
        const poly = schneidePoly([[-1, bf], [d.w + 1, bf], [d.w + 1, d.h + 1], [-1, d.h + 1]], um);
        zw[1] = (gg, B, vorn, L) => {
          if (poly.length < 3 || !vorn || bf > d.h - 0.01) return;
          gg.save(); vieleck(gg, poly); gg.clip();
          biberschwanz(gg, F, -0.2, bf - 0.3, d.w + 0.4, d.h - bf + 0.5, V.saat * 3 + 11 + Math.round(d.w * 10), {});
          gg.globalCompositeOperation = "multiply"; gg.fillStyle = rgb(litC([255, 255, 255], L)); gg.fillRect(-1, -1, d.w + 2, d.h + 2);
          gg.restore();
        };
      }
      prismen(g, F, st, zw);
    };
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  ST.modell("fachwerkerker", {
    name: "Fachwerkhaus mit Erker", gruppe: "Häuser", grund: [8, 12], hoehe: 13, bauzeit: 15 * 60,
    bauen(M, o) {
      const V = variante(o);
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      const winter = o.jahr === "winter";
      const Z = bau >= 0.999 ? FERTIG : zustand(bau);
      bauHaus(M, o, V, winter, Z);
      beschleunigen(M);
    }
  });

  /* =====================================================================
     DAS FERTIGE HAUS
     ===================================================================== */
  function plaene(V) {
    if (V._plaene) return V._plaene;
    const P = {};
    const zEG = { s0: Z_SO, s1: Z_EGS, r0: Z_EGR, r1: Z_EG, brust: 1.45, sturz: 2.75 };
    const zLaden = { s0: Z_SO, s1: Z_EGS, r0: Z_EGR, r1: Z_EG, brust: 0.92, sturz: 2.8 };
    const zOG = { s0: Z_BL, s1: Z_OGS, r0: Z_OGR, r1: Z_OG, brust: 4.75, sturz: 5.95 };
    const r = ST.zufall(V.saat * 17 + 1);
    const lichtAn = () => (r() < 0.62 ? 0.8 + r() * 0.2 : 0);
    /* Jeder Raum hat sein eigenes Licht: 2700 bis 3200 Kelvin */
    const rf = ST.zufall(V.saat * 29 + 5);
    const RAUMLICHT = [[255, 182, 100], [255, 192, 118], [255, 202, 140], [252, 210, 158]];
    /* Fensteroberkanten um ±2–3 cm versetzt: keine Reihe fluchtet exakt */
    const fen = (a0, z0, w, h, extra) => { const dz = (r() - 0.5) * 0.05; return Object.assign({ typ: "fenster", a0: a0, a1: a0 + w, z0: z0 + dz, z1: z0 + h + dz, sp: [1, 2], fl: 2, licht: lichtAn(), farbe: RAUMLICHT[Math.floor(rf() * RAUMLICHT.length)] }, extra || {}); };
    /* zugesetztes Fenster: Putzfläche, der alte Rahmen ist noch zu sehen */
    const zu = (a0, z0, w, h) => ({ typ: "zu", a0: a0, a1: a0 + w, z0: z0, z1: z0 + h, zeit: 0 });
    const gesch = V.geschaeft;

    /* ---- Erdgeschoss Süd: Ladenfront ---- */
    {
      const W = 2 * EG_X;
      const oeff = [
        { typ: "schaufenster", a0: 0.8, a1: 2.5, z0: 0.92, z1: 2.3, glasText: gesch.text },
        { typ: "ladentuer", a0: 2.7, a1: 3.7, z0: 0.36, z1: 2.33 },
        { typ: "schaufenster", a0: 3.9, a1: 5.6, z0: 0.92, z1: 2.3, glasText: V.name }
      ];
      const fw = fachwerk(W, zLaden, oeff, { schwelleVon: 0, mann: false });
      /* Schwelle an der Tür unterbrochen */
      const sw = fw.H.find((h) => h.art === "schwelle");
      fw.H.splice(fw.H.indexOf(sw), 1, Object.assign({}, sw, { a1: 2.6 }), Object.assign({}, sw, { a0: 3.8 }));
      P.egS = { name: "eg-sued", w: W, zOben: Z_EG, sockel: { z1: Z_SO, luecken: [[2.62, 3.78]] }, zonen: [fw], oeff: oeff };
    }
    /* ---- Erdgeschoss Ost: Haustür, Backstubenfenster ---- */
    {
      const W = EG_YS - EG_YN;
      const oeff = [
        { typ: "haustuer", a0: 1.35, a1: 2.35, z0: Z_SO, z1: 2.75, ohnePfosten: false, jahr: "1612" },
        fen(3.6, 1.45, 0.85, 1.25, { laeden: true, kasten: true, bruestung: null }),
        fen(5.7, 1.45, 0.85, 1.25, { kasten: false }),
        fen(7.9, 1.6, 0.7, 1.05, { laeden: true, kasten: true, sp: [1, 1] }),
        { typ: "keller", a0: 5.8, a1: 6.45, z0: 0.12, z1: 0.42, ohnePfosten: true }
      ];
      /* Tür: Fachwerköffnung um das Gewände */
      const fwOeff = oeff.map((q) => q.typ === "haustuer" ? Object.assign({}, q, { a0: q.a0 - 0.17, a1: q.a1 + 0.17, z1: q.z1 + 0.17 }) : q).filter((q) => q.typ !== "keller");
      const fw = fachwerk(W, zEG, fwOeff, {});
      const sw = fw.H.find((h) => h.art === "schwelle");
      fw.H.splice(fw.H.indexOf(sw), 1, Object.assign({}, sw, { a1: 1.18 }), Object.assign({}, sw, { a0: 2.52 }));
      P.egO = { name: "eg-ost", w: W, zOben: Z_EG, sockel: { z1: Z_SO, luecken: [[1.18, 2.52]] }, zonen: [fw], oeff: oeff };
    }
    /* ---- Erdgeschoss Nord: Hoftür, zwei Fenster ---- */
    {
      const W = 2 * EG_X;
      const oeff = [
        { typ: "hoftuer", a0: 0.8, a1: 1.7, z0: Z_SO, z1: 2.6 },
        fen(3.0, 1.45, 0.85, 1.25, { laeden: true }),
        fen(4.8, 1.45, 0.85, 1.25, { laeden: true, kasten: true })
      ];
      const fw = fachwerk(W, zEG, oeff, {});
      const sw = fw.H.find((h) => h.art === "schwelle");
      fw.H.splice(fw.H.indexOf(sw), 1, Object.assign({}, sw, { a1: 0.6 }), Object.assign({}, sw, { a0: 1.9 }));
      /* RUNDE 1: keine Sockellücke mehr – die Hoftür steht auf dem Sockel
         (Schwellstein), davor führen drei Stufen hinauf */
      P.egN = { name: "eg-nord", w: W, zOben: Z_EG, sockel: { z1: Z_SO }, zonen: [fw], oeff: oeff };
    }
    /* ---- Erdgeschoss West ---- */
    {
      const W = EG_YS - EG_YN;
      /* RUNDE 1: kein Baukastenrhythmus – ein kleines Fenster, ein
         zugesetztes, Läden nicht überall; davor der Holzstapel */
      const oeff = [fen(1.3, 1.45, 0.85, 1.25, { laeden: true, kasten: true }), fen(3.1, 1.6, 0.66, 1.0, { sp: [1, 1] }), zu(6.2, 1.5, 0.8, 1.2), fen(8.2, 1.45, 0.85, 1.25, { laeden: true })];
      P.egW = { name: "eg-west", w: W, zOben: Z_EG, sockel: { z1: Z_SO }, zonen: [fachwerk(W, zEG, oeff, {})], oeff: oeff };
    }
    /* ---- Obergeschoss Süd (Erker in der Mitte) ---- */
    {
      const W = 2 * OG_X;
      const oeff = [
        fen(0.75, 4.75, 0.85, 1.2, { kasten: true, bruestung: "kreuz", laeden: true, offenFr: true }),
        fen(6.15 - 0.85, 4.75, 0.85, 1.2, { kasten: true, bruestung: "kreuz", laeden: true })
      ];
      const fw = fachwerk(W, zOG, oeff.concat([{ a0: OG_X + ERKER.x0, a1: OG_X + ERKER.x1, z0: 4.2, z1: 6.0, typ: "erker" }]), {});
      P.ogS = { name: "og-sued", w: W, zOben: Z_OG, zUnten: Z_BL, zonen: [fw], oeff: oeff };
    }
    /* ---- Obergeschoss Ost/West: vier Fenster, Rauten ---- */
    {
      const W = OG_YS - OG_YN;
      /* RUNDE 1: Brüstungsfiguren wie in Quedlinburg und Goslar variiert –
         Fußbänder, Fächerrosette, Andreaskreuz, leeres Feld, höchstens eine
         Raute; ein Fenster kleiner, eines zugesetzt, Läden nicht an jedem */
      const oeffO = [fen(1.2, 4.75, 0.85, 1.2, { bruestung: "fussband", kasten: true }), fen(3.4, 4.75, 0.85, 1.2, { bruestung: "rosette", laeden: true }), fen(6.1, 4.9, 0.7, 1.0, { bruestung: "kreuz", kasten: true, sp: [1, 1] }), fen(8.4, 4.75, 0.85, 1.2, { laeden: true, ladenZuFr: true })];
      const oeffW = [fen(1.4, 4.75, 0.85, 1.2, { bruestung: "raute", laeden: true }), fen(3.8, 4.75, 0.85, 1.2, { bruestung: "fussband", kasten: true }), zu(6.4, 4.8, 0.8, 1.1), fen(8.6, 4.75, 0.85, 1.2, { bruestung: "rosette", kasten: true })];
      const zO2 = Object.assign({}, zOG);
      P.ogO = { name: "og-ost", w: W, zOben: Z_T, zUnten: Z_BL, zonen: [fachwerk(W, zO2, oeffO, {}), dachbalkenBand(W)], oeff: oeffO };
      P.ogW = { name: "og-west", w: W, zOben: Z_T, zUnten: Z_BL, zonen: [fachwerk(W, zO2, oeffW, {}), dachbalkenBand(W)], oeff: oeffW };
    }
    /* ---- Obergeschoss Nord ---- */
    {
      const W = 2 * OG_X;
      const oeff = [fen(1.4, 4.75, 0.85, 1.2, { bruestung: "kreuz", laeden: true }), fen(4.65, 4.75, 0.85, 1.2, { bruestung: "kreuz", laeden: true, kasten: true })];
      P.ogN = { name: "og-nord", w: W, zOben: Z_T, zUnten: Z_BL, zonen: [fachwerk(W, zOG, oeff, {}), dachbalkenBand(W)], oeff: oeff };
    }
    /* ---- Giebel Süd und Nord ---- */
    P.giS = giebelPlan("giebel-sued", V, true, lichtAn);
    P.giN = giebelPlan("giebel-nord", V, false, lichtAn);
    /* Wann jede Öffnung ihr Fenster / ihre Tür bekommt (Bauphase 0,9…0,95) */
    const rz = ST.zufall(V.saat * 29 + 5);
    for (const k of Object.keys(P)) for (const op of P[k].oeff) op.zeit = op.typ === "zu" ? 0 : op.typ === "fenster" ? 0.9 + rz() * 0.05 : op.typ === "keller" ? 0.9 : 0.92 + rz() * 0.03;
    V._plaene = P;
    return P;
  }
  /* Band der Dachbalkenlage unter der Traufe (6,55 … 6,8) */
  function dachbalkenBand(W) {
    return { H: [{ art: "rahm", a0: 0, z0: (Z_OG + Z_T) / 2, a1: W, z1: (Z_OG + Z_T) / 2, b: Z_T - Z_OG }], felder: [] };
  }
  /* Giebel: zwei Stockwerke Fachwerk unter dem Schopf, Fächerrosetten in
     der Brüstung, Streben parallel zu den Ortgängen. Fläche von Z_T bis Z_K. */
  function giebelPlan(name, V, sued, lichtAn) {
    const W = 2 * OG_X, zO = Z_K;
    const kante = (a) => Z_T + Math.min(a, W - a) * TA;      // Höhe der Dachschräge
    const z1 = { s0: Z_T, s1: Z_T + 0.18, r0: 8.92, r1: 9.1, brust: 7.5, sturz: 8.62 };
    const z2 = { s0: 9.1, s1: 9.26, r0: Z_K - 0.18, r1: Z_K, brust: 9.4, sturz: 9.95 };
    const oeff = sued
      ? [
        /* Herrnhuter Stern im linken Giebelfenster (immer erleuchtet), Schwibbogen
           rechts; das kleine Fenster unter dem Walm liegt im Winter halb unter
           dem Schneewulst, dort steht nur eine Kerze */
        { typ: "fenster", a0: 1.95, a1: 2.75, z0: 7.6, z1: 8.6, sp: [1, 2], fl: 2, licht: Math.max(0.9, lichtAn()), bruestung: "rosette", kaempfer: false, stern: true },
        { typ: "fenster", a0: 4.15, a1: 4.95, z0: 7.6, z1: 8.6, sp: [1, 2], fl: 2, licht: Math.max(0.9, lichtAn()), bruestung: "rosette", kaempfer: false, bogen: true },
        { typ: "fenster", a0: 3.1, a1: 3.8, z0: 9.4, z1: 9.95, sp: [1, 1], fl: 2, licht: Math.max(0.9, lichtAn()), kaempfer: false, kerze: true }
      ]
      : [
        { typ: "fenster", a0: 3.05, a1: 3.85, z0: 7.6, z1: 8.6, sp: [1, 2], fl: 2, licht: lichtAn(), bruestung: "kreuz", kaempfer: false },
        /* Ladeluke im Nordgiebel, darüber der Aufzugsbalken */
        { typ: "luke", a0: 3.05, a1: 3.85, z0: 9.28, z1: 9.9 }
      ];
    const unten = oeff.filter((q) => q.z1 < 9);
    const fw1 = fachwerk(W, z1, unten, { ohneLinks: true, ohneRechts: true, maxFeld: 0.9, pfostenBei: [0.75, W - 0.75], mann: false });
    const fw2 = fachwerk(W, z2, oeff.filter((q) => q.z0 > 9), { ohneLinks: true, ohneRechts: true, maxFeld: 0.8, pfostenBei: [2.55, W - 2.55], mann: false });
    /* Brüstungsfelder ohne Fenster auch mit Rosetten (Süd) */
    if (sued) for (const fe of fw1.felder) if (fe[1] < 7.4 && fe[3] < 7.5 && !fe[4]) fe[4] = "rosette";
    /* Geschnitzter Hausspruch auf der Stockschwelle (Quedlinburg, Goslar) */
    if (sued) { const sw = fw1.H.find((h) => h.art === "schwelle"); if (sw) sw.text = "ANNO 1612 · WER GOTT VERTRAUT HAT WOHL GEBAUT"; }
    /* Ortgang-Hölzer entlang der Schrägen, Fußstreben in den Ecken */
    const b = 0.2;
    const zs = (a) => kante(a) - b * 0.5 / CA;
    fw1.H.push({ art: "rahm", a0: 0, z0: zs(0), a1: W / 2 - (Z_K - Z_T) / TA + 0.0, z1: zs(W / 2 - (Z_K - Z_T) / TA), b: b });
    fw1.H.push({ art: "rahm", a0: W, z0: zs(W), a1: W / 2 + (Z_K - Z_T) / TA, z1: zs(W / 2 + (Z_K - Z_T) / TA), b: b });
    /* Streben in den äußeren Feldern (Halbe Männer im Giebel) */
    const p = fw1.pfosten;
    if (p.length > 3) {
      const l = p[0], l2 = p[1], rr = p[p.length - 1], rr2 = p[p.length - 2];
      fw1.H.push({ art: "strebe", a0: l2.a - l2.b / 2, z0: z1.s1, a1: l.a + 0.1, z1: kante(l.a) - 0.1, b: 0.16, clip: [l.a + l.b / 2, z1.s1, l2.a - l2.b / 2 - l.a - l.b / 2, 2] });
      fw1.H.push({ art: "strebe", a0: rr2.a + rr2.b / 2, z0: z1.s1, a1: rr.a - 0.1, z1: kante(rr.a) - 0.1, b: 0.16, clip: [rr2.a + rr2.b / 2, z1.s1, rr.a - rr.b / 2 - rr2.a - rr2.b / 2, 2] });
    }
    const umriss = (zOben) => {
      const aK = (Z_K - Z_T) / TA;
      return [[aK, zOben - Z_K], [W - aK, zOben - Z_K], [W, zOben - Z_T], [0, zOben - Z_T]];
    };
    return { name: name, w: W, zOben: zO, zUnten: Z_T, zonen: [fw1, fw2], stockweise: true, oeff: oeff, umriss: umriss(zO), kante: kante };
  }

  function bauHaus(M, o, V, winter, Z) {
    const P = plaene(V);
    const fruehling = !winter;
    const schmuck = winter && Z.schmuck;

    /* ================= BAUGRUBE, FUNDAMENT, SOCKEL ================= */
    if (Z.grube || Z.halde > 0) grube(M, V, Z, winter);
    if (Z.platte > 0) bodenplatte(M, V, Z);
    if (Z.sockel > 0 && Z.eg !== "zu") sockelRing(M, V, Z, winter);

    /* ================= ERDGESCHOSS ================= */
    const egW = [["sued", P.egS, [-EG_X, EG_YS], [EG_X, EG_YS], N_S], ["ost", P.egO, [EG_X, EG_YS], [EG_X, EG_YN], N_O], ["nord", P.egN, [EG_X, EG_YN], [-EG_X, EG_YN], N_N], ["west", P.egW, [-EG_X, EG_YN], [-EG_X, EG_YS], N_W]];
    if (Z.eg === "gerippe" || Z.eg === "fachen") {
      egW.forEach(([s, plan, p0, p1, n], i) => {
        teil(M, "eg-" + s, ST_EG, n, 0);
        gerippeFlaeche(M, "eg-" + s, p0, p1, Z_SO, plan, V, i, Z.egHolz, Z.eg === "fachen" ? Z.egFach : 0, 0.2);
      });
    } else if (Z.eg === "zu") {
      /* Süd: Ladenfront */
      teil(M, "eg-sued", ST_EG, N_S, 0);
      const planS = Object.assign({}, P.egS, {
        deko: (g, F, V2, zO) => {
          /* Schatten von Erker und Auskragung auf der Ladenfront */
          const sv = F.schatten(ERKER.y - EG_YS);
          if (sv) {
            const x0 = EG_X + ERKER.x0, x1 = EG_X + ERKER.x1;
            const gr = g.createLinearGradient(0, 0, 0, sv[1] + 0.3);
            gr.addColorStop(0, "rgba(30,28,44,0.32)"); gr.addColorStop(0.75, "rgba(30,28,44,0.24)"); gr.addColorStop(1, "rgba(30,28,44,0)");
            g.fillStyle = gr;
            g.beginPath(); g.moveTo(x0, 0); g.lineTo(x1, 0); g.lineTo(x1 + sv[0], sv[1] + 0.3); g.lineTo(x0 + sv[0], sv[1] + 0.3); g.closePath(); g.fill();
          }
          /* Ladenschild über Schaufenstern und Tür, darüber zwei Schildleuchten */
          if (Z.schild) {
            ladenschild(g, F, 0.72, zO - 2.8, 4.96, 0.4, V);
            for (const lx of [1.9, 4.5]) schildLeuchte(g, F, lx, zO - 3.02, 0);
          }
          if (schmuck) {
            girlande(g, F, 0.72, 3.2, zO - 2.37, 0.14, 2);
            girlande(g, F, 3.2, 5.68, zO - 2.37, 0.14, 2);
          }
          if (fruehling && Z.deko) {
            /* Schatten der Markisen auf Schaufenster und Wand */
            const sv = F.schatten(MARKISE.t);
            if (sv) {
              g.fillStyle = "rgba(34,30,40,0.3)";
              for (const [m0, m1] of MARKISE.x) {
                const a0 = m0 + EG_X, a1 = m1 + EG_X, yo = zO - MARKISE.z, yu = zO - MARKISE.z + MARKISE.dz + MARKISE.v;
                g.beginPath(); g.moveTo(a0, yo); g.lineTo(a1, yo); g.lineTo(a1 + sv[0], yu + sv[1]); g.lineTo(a0 + sv[0], yu + sv[1]); g.closePath(); g.fill();
              }
            }
            /* Weinstock an der Südostecke: Stamm am Eckständer, oben ein
               Leittrieb unter dem Rähm entlang (weiter im Obergeschoss) */
            weinrebe(g, F, [[6.2, zO], [6.12, zO - 0.8], [6.24, zO - 1.7], [6.14, zO - 2.6], [6.2, zO - 3.22]],
              [[[6.2, zO - 3.22], [5.8, zO - 3.2], [5.3, zO - 3.24], [4.9, zO - 3.2]], [[6.2, zO - 3.22], [6.36, zO - 3.26]], [[6.16, zO - 2.3], [5.95, zO - 2.45], [5.8, zO - 2.4]]], 71);
          }
        }
      });
      planS.nachtDeko = (g, F, V2, zO) => {
        if (!Z.schild) return;
        const a = F.nacht;
        for (const lx of [1.9, 4.5]) {
          const [sx, sy] = schildLeuchte(g, F, lx, zO - 3.02, a);
          g.save(); g.globalCompositeOperation = "lighter";
          const gl = g.createRadialGradient(sx, sy + 0.1, 0.02, sx, sy + 0.35, 1.3);
          gl.addColorStop(0, "rgba(255,214,150," + (0.42 * a).toFixed(3) + ")"); gl.addColorStop(0.45, "rgba(255,186,110," + (0.16 * a).toFixed(3) + ")"); gl.addColorStop(1, "rgba(255,186,110,0)");
          g.fillStyle = gl; g.fillRect(sx - 1.4, sy - 0.1, 2.8, 1.5);
          g.restore();
          F.leuchtPunkt(sx, sy, 0.45, "255,226,170", 0.6);
        }
      };
      wandFlaeche(M, "eg-sued", [-EG_X, EG_YS], [EG_X, EG_YS], 0, Z_EG, wandMaler(planS, V, o, Z), { ao: true, traufe: 0.45, danach: wandNacht(planS, V, Z) });
      if (Z.stufen) stufen(M, -0.7, 0.7, EG_YS, N_S, [0.18, 0.36], [0.62, 0.32], winter);
      /* Nasenschild (Zunftzeichen) am Ausleger */
      if (Z.schild) M.figur({ x: -2.95, y: EG_YS, z: 2.55, breite: 2.2, hoehe: 1.2, schatten: false, malen: nasenschild(V) });

      /* Ost: Haustür, Laterne, Briefkasten */
      teil(M, "eg-ost", ST_EG, N_O, 0);
      const planO = Object.assign({}, P.egO, {
        deko: (g, F, V2, zO) => {
          if (Z.rohr) rohrSchatten(g, F, 0.2, 0, zO - 0.05);
          if (!Z.deko) return;
          hausnummerSchild(g, F, 0.72, zO - 2.62, V.nummer);
          klingelPlatte(g, F, 2.62, zO - 1.62, V.name);
          briefkasten(g, F, 0.5, zO - 1.55);
          /* RUNDE 2: Rose fern der Laterne, rechts neben dem Laden des Stubenfensters */
          if (fruehling && Z.fertig) kletterrose(g, F, 5.22, zO - Z_SO, 2.55, 0.62);
          laterneMalen(g, F, 2.85, zO - 2.45, F.nacht > 0.01 && Z.licht ? 1 : 0);
        },
        nachtDeko: (g, F, V2, zO) => {
          /* warmer Lichthof der Laterne auf Putz und Holz */
          /* RUNDE 2: der Schein ADDIERT Licht (vorher nur ein Farbschleier) –
             so leuchten Gewände, Kranz, Klingel und Putz um die Laterne auf */
          const a = F.nacht;
          g.save(); g.globalCompositeOperation = "lighter";
          const gl = g.createRadialGradient(2.85, zO - 2.3, 0.04, 2.85, zO - 2.15, 1.25);
          gl.addColorStop(0, "rgba(255,190,110," + (0.5 * a).toFixed(3) + ")"); gl.addColorStop(0.35, "rgba(255,170,90," + (0.24 * a).toFixed(3) + ")"); gl.addColorStop(1, "rgba(255,150,70,0)");
          g.fillStyle = gl; g.fillRect(1.5, zO - 3.6, 2.7, 3.6);
          g.restore();
          const [lx, ly] = laterneMalen(g, F, 2.85, zO - 2.45, 1);
          F.leuchtPunkt(lx, ly, 1.6, "255,200,120", 0.9, true);
        }
      });
      wandFlaeche(M, "eg-ost", [EG_X, EG_YS], [EG_X, EG_YN], 0, Z_EG, wandMaler(planO, V, o, Z), { ao: true, traufe: 0.25, danach: wandNacht(planO, V, Z) });
      if (Z.stufen) stufenOst(M, EG_YS - 1.35 + 0.35, EG_YS - 2.35 - 0.35, winter);

      /* Nord */
      teil(M, "eg-nord", ST_EG, N_N, 0);
      wandFlaeche(M, "eg-nord", [EG_X, EG_YN], [-EG_X, EG_YN], 0, Z_EG, wandMaler(P.egN, V, o, Z), { ao: true, danach: wandNacht(P.egN, V, Z) });
      if (Z.stufen) stufenNord(M, winter);
      /* West */
      teil(M, "eg-west", ST_EG, N_W, 0);
      const planW = Object.assign({}, P.egW, { deko: (g, F, V2, zO) => { if (Z.rohr) rohrSchatten(g, F, 10.0, 0, zO - 0.05); } });
      wandFlaeche(M, "eg-west", [-EG_X, EG_YN], [-EG_X, EG_YS], 0, Z_EG, wandMaler(planW, V, o, Z), { ao: true, traufe: 0.25, danach: wandNacht(planW, V, Z) });
      if (Z.deko) { holzstapel(M, V, winter); regentonne(M, winter); }
    }

    /* ================= BALKENLAGE über dem EG, Fußboden OG ================= */
    if (Z.ogBoden) {
      M._bodenOg = teil(M, "boden-og", 3.6, null, 0);
      const bl = [];
      for (let x = -2.98; x <= 3.0; x += 0.66) bl.push([x, OG_YN + 0.18, x, OG_YS - 0.18, 0.2]);
      balkenlage(M, "boden-og", Z_BL, [-OG_X + 0.18, OG_YN + 0.18, OG_X - 0.18, OG_YS - 0.18], bl, Z_BL - Z_EG, Z.balken, Z.dielen, V, "y");
    }

    /* ================= OBERGESCHOSS ================= */
    ogSeite(M, "sued", P.ogS, V, o, winter, Z, 0);
    ogSeite(M, "ost", P.ogO, V, o, winter, Z, 1);
    ogSeite(M, "nord", P.ogN, V, o, winter, Z, 2);
    ogSeite(M, "west", P.ogW, V, o, winter, Z, 3);
    if (Z.balken > 0) erker(M, V, o, winter, Z);

    /* ================= DACHBODEN (Dachbalken, Dielen) ================= */
    if (Z.dachBoden) {
      teil(M, "boden-dach", 13, null, 0);
      const bl = [];
      for (let y = OG_YN + 0.3; y < GI_YS - 0.2; y += 0.8) bl.push([-OG_X - 0.1, y, OG_X + 0.1, y, 0.2]);
      balkenlage(M, "boden-dach", Z_T, [-OG_X + 0.18, OG_YN + 0.18, OG_X - 0.18, OG_YS - 0.18], bl, 0.22, Z.dachbalken, Z.dachdielen, V, "x");
    }

    /* ================= DACH ================= */
    if ((Z.giebel || Z.dachbalken > 0)) dach(M, V, o, winter, P, Z);
    if (Z.dach === "stuhl") dachstuhl(M, V, Z, winter);
    if (Z.rinne) { rinne(M, V, o, winter, 1, Z); rinne(M, V, o, winter, -1, Z); }
    if (Z.gaube) { gaube(M, V, o, winter, 1, Z); gaube(M, V, o, winter, -1, Z); }
    if (Z.kamin > 0) kamin(M, V, o, winter, Z);
    if (Z.richtkrone) richtbaum(M, V, winter);
    if (Z.licht) {
      /* Lichtpfützen im Schnee: vor den Schaufenstern, vor der Ladentür und
         unter der Laterne an der Haustür */
      for (const x of [-1.55, 1.55]) M.bodenlicht(x, EG_YS + 1.3, 2.5, "255,200,130", 0.75);
      M.bodenlicht(0, EG_YS + 0.9, 1.1, "255,204,140", 0.45);
      /* Laterne an der Haustür: Stufen und Schnee davor liegen im Licht */
      M.bodenlicht(EG_X + 0.8, EG_YS - 2.5, 2.2, "255,196,120", 0.8);
    }
    if (Z.deko) kaesten(M, V, P, winter);
    if (Z.deko && fruehling && Z.eg === "zu") fruehlingsSchmuck(M, V);
    if (Z.eg === "zu") wehen(M, winter);
    schattenKoerper(M, Z);
  }

  /* ---------------- Richtfest ----------------
     Sobald der Dachstuhl steht, kommt der Richtbaum auf den First: eine
     kleine Tanne mit bunten Bändern, die im Wind flattern. Für jeden sofort
     lesbar: „Das Dach steht." (0,79–0,87) */
  function richtbaum(M, V, winter) {
    const D = walm(0, 0, 0);
    const y = D.yRS - 0.45, z = Z_FI + 0.1;
    teil(M, "richtbaum", ST_KAMIN, null, 0, { mitte: [0, y, ST_KAMIN] });
    const baum = (g, s, F) => {
      const sch = F.schatten;
      const Zt = F.Z || { amb: [0.6, 0.6, 0.7], sonne: [0.4, 0.4, 0.4] }, li = Math.min(1, Zt.amb[1] + Zt.sonne[1] * 0.8);
      const gr = (c) => (sch ? "#000" : rgb(hellMal(c, li)));
      /* Stamm und Befestigung am Firstbrett */
      g.fillStyle = gr([96, 70, 46]); g.fillRect(-0.035 * s, -0.35 * s, 0.07 * s, 0.35 * s);
      g.strokeStyle = gr([60, 50, 40]); g.lineWidth = Math.max(1, 0.02 * s);
      g.beginPath(); g.moveTo(-0.3 * s, 0); g.lineTo(0, -0.25 * s); g.lineTo(0.3 * s, 0); g.stroke();
      /* Tanne in Etagen */
      const r = ST.zufall(5);
      for (let i = 0; i < 6; i++) {
        const t = i / 6, yb = -(0.25 + t * 1.15) * s, bw = (0.55 - t * 0.42) * s, hh = 0.42 * s;
        g.fillStyle = gr([34 + i * 3, 74 + i * 4, 46]);
        g.beginPath(); g.moveTo(-bw, yb); g.quadraticCurveTo(-bw * 0.4, yb - hh * 0.3, 0, yb - hh); g.quadraticCurveTo(bw * 0.4, yb - hh * 0.3, bw, yb); g.quadraticCurveTo(0, yb + 0.06 * s, -bw, yb); g.fill();
        if (!sch && s > 14) {
          g.fillStyle = rgb(hellMal([74, 118, 70], li));
          for (let k = 0; k < 5; k++) { const x = (r() - 0.5) * bw * 1.4; g.beginPath(); g.ellipse(x, yb - r() * hh * 0.4, 0.04 * s, 0.015 * s, 0, 0, Math.PI * 2); g.fill(); }
          if (winter) { g.fillStyle = rgb(hellMal([240, 244, 250], li)); g.beginPath(); g.ellipse(0, yb - hh * 0.55, bw * 0.45, 0.03 * s, 0, 0, Math.PI * 2); g.fill(); }
        }
      }
    };
    M.figur({ x: 0, y: y, z: z, breite: 1.4, hoehe: 1.9, schatten: true, malen: baum });
    /* Bänder: flattern im Wind (jedes Bild neu gemalt) */
    M.lebendig((g, P) => {
      const top = P.proj(0, y, z + 1.3), s = P.s, t = P.t || 0;
      const li = Math.max(0.35, 1 - (P.Z.nacht || 0) * 0.65);
      const farben = [[204, 30, 40], [240, 196, 40], [40, 90, 190], [40, 150, 70], [245, 245, 240], [210, 40, 120]];
      g.lineCap = "round"; g.lineJoin = "round";
      farben.forEach((c, i) => {
        const L = (0.7 + (i % 3) * 0.15) * s, n = 9;
        g.strokeStyle = rgb(hellMal(c, li)); g.lineWidth = Math.max(1, 0.035 * s);
        g.beginPath();
        for (let k = 0; k <= n; k++) {
          const q = k / n;
          const x = top[0] + (0.1 + i * 0.03) * s * (i % 2 ? -1 : 1) + q * L * 0.85 + Math.sin(t * 5.5 + q * 5 + i * 1.3) * 0.06 * s * q;
          const yy = top[1] + q * L * (0.35 + i * 0.05) + Math.cos(t * 4.3 + q * 4 + i) * 0.05 * s * q;
          if (k) g.lineTo(x, yy); else g.moveTo(x, yy);
        }
        g.stroke();
      });
    });
  }

  /* ---------------- Schattenkörper ----------------
     RUNDE 1 (Leistung): Der Kern zeichnet für JEDES Teil mit Schatten eine
     weichgezeichnete Hülle – bei elf Teilen kostete allein der Schatten
     bei s = 40 rund 2,8 s. Jetzt werfen nur noch Dach und Kamin eigene
     Schatten; alles andere steckt in EINEM unsichtbaren Körper aus nach
     unten zeigenden Flächen (die werden nie gemalt, liefern aber die
     Eckpunkte für Schlagschatten und den Kontaktschatten am Fuß). */
  function schattenKoerper(M, Z) {
    const lagen = [];                                     // [x0, y0, x1, y1, z]
    const EGr = [-EG_X, EG_YN, EG_X, EG_YS];
    if (Z.platte > 0 || Z.sockel > 0 || Z.eg) lagen.push(EGr.concat([0.01]));
    else return;
    if (Z.eg !== "zu" && Z.sockel > 0) lagen.push(EGr.concat([Math.max(0.05, Z_SO * Math.min(1, Z.sockel * 1.05))]));
    if (Z.eg === "gerippe" || Z.eg === "fachen") lagen.push(EGr.concat([Z_SO]));
    if (Z.eg === "zu") lagen.push(EGr.concat([Z.balken > 0 ? Z_BL : Z_EG]));
    if (Z.og === "zu") {
      lagen.push([-OG_X, OG_YN, OG_X, OG_YS, Z_BL + 0.05]);
      lagen.push([-OG_X, OG_YN, OG_X, GI_YS, Z_T]);
      lagen.push([ERKER.x0 - 0.12, OG_YS, ERKER.x1 + 0.12, ERKER.y + 0.12, 6.3]);
      if (Z.giebel === "zu") { const aK = (Z_K - Z_T) / TA; lagen.push([-OG_X + aK, GI_YN, OG_X - aK, GI_YS, Z_K]); }
      /* Dach: ein Firstkörper ohne Traufüberstand (Grundriss der Wände) –
         auf der Schattenseite fehlen so 0,45 m, das fällt nicht auf; auf der
         Sonnenseite liegt dafür kein falscher Streifen mehr vor der Wand */
      if (Z.dach === "zu") { const D = walm(0, 0, 0); lagen.push([-0.02, D.yRN, 0.02, D.yRS, Z_FI]); }
    }
    teil(M, "schattenkoerper", -30, null, 0, { schatten: true });
    for (const [x0, y0, x1, y1, z] of lagen) {
      /* u × v = (0,0,−1): zeigt nach unten → aus der Vogelschau unsichtbar */
      M.flaeche({ name: "sk", o: [x0, y1, z], u: [1, 0, 0], v: [0, -1, 0], w: x1 - x0, h: y1 - y0, malen: null, direkt: true });
    }
  }

  /* Schatten eines Fallrohrs auf der Wand (senkrechter Streifen) */
  function rohrSchatten(g, F, a, y0, y1) {
    const sv = F.schatten(0.1);
    if (!sv) return;
    g.fillStyle = "rgba(34,28,30,0.3)";
    g.fillRect(a - 0.05 + sv[0], y0 + sv[1], 0.1, y1 - y0);
  }

  /* ---------------- Stufen aus Sandstein ----------------
     Blockstufen: Trittfläche in der Mitte ausgetreten und heller, vorne
     eine gerundete Kante (Stufenkante mit Licht), Stoßfugen zwischen den
     Blöcken. Oberste Stufe mit Fußabtreter. */
  /* RUNDE 2 (Kritik: „makellose Quader wie aus Schaumstoff"): Die Stufen
     sind 400 Jahre begangen – in der Mitte der Trittfläche eine flache,
     glatt getretene Mulde, an der Vorderkante zwei, drei Abplatzer, an den
     Stoßfugen dunkler Schmutz, auf der Nordseite etwas Moos. */
  function stufeMaler(winter, art, matte, quer, nord) {
    return function (g, F) {
      const c = [164, 150, 126];
      const r = ST.zufall(ST.textHash(F.name + F.w.toFixed(2)));
      g.fillStyle = rgb(c); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      flecken(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, 0.9, 0.45, "dunkel", 5 + Math.round(F.w * 10));
      if (F.px > 30) flecken(g, 0, 0, F.w, F.h, 0.25, 0.3, "korn", 7);
      /* Stoßfugen mit Schmutz: je Fuge ein dunkler Strich und ein weicher,
         3 cm breiter Schmutzsaum */
      const fugen = (lang, laenge) => {
        if (F.px <= 16) return;
        for (let x = 0.55 + r() * 0.3; x < laenge - 0.15; x += 0.6 + r() * 0.3) {
          const sg = lang ? g.createLinearGradient(x - 0.035, 0, x + 0.045, 0) : g.createLinearGradient(0, x - 0.035, 0, x + 0.045);
          sg.addColorStop(0, "rgba(62,50,38,0)"); sg.addColorStop(0.45, "rgba(62,50,38,0.22)"); sg.addColorStop(1, "rgba(62,50,38,0)");
          g.fillStyle = sg; if (lang) g.fillRect(x - 0.035, 0, 0.08, F.h); else g.fillRect(0, x - 0.035, F.w, 0.08);
          g.fillStyle = "rgba(58,46,34,0.6)"; if (lang) g.fillRect(x, 0, 0.012, F.h); else g.fillRect(0, x, F.w, 0.012);
          if (nord && !winter) { g.save(); g.beginPath(); if (lang) g.rect(x - 0.05, 0, 0.11, F.h); else g.rect(0, x - 0.05, F.w, 0.11); g.clip(); flecken(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, 0.3, 0.8, "moos", 11); g.restore(); }
        }
      };
      if (nord && !winter && F.px > 12) flecken(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, 0.5, art === "oben" ? 0.35 : 0.6, "moos", 13 + Math.round(F.w * 10));
      if (art === "vorn") {
        /* Vorderseite: oben die runde Kante im Licht, unten Fuge */
        g.fillStyle = "rgba(255,248,230,0.35)"; g.fillRect(-0.1, 0, F.w + 0.2, 0.025);
        g.fillStyle = "rgba(60,48,36,0.25)"; g.fillRect(-0.1, 0.025, F.w + 0.2, 0.02);
        g.fillStyle = "rgba(40,30,24,0.4)"; g.fillRect(-0.1, F.h - 0.018, F.w + 0.2, 0.018);
        fugen(true, F.w);
        /* zwei, drei Abplatzer (3–6 cm) an der Vorderkante: oben die
           Bruchfläche im Schatten, darunter die frische, hellere Kante */
        if (F.px > 14) {
          const n = 2 + (r() < 0.5 ? 1 : 0);
          for (let i = 0; i < n; i++) {
            const ax = 0.1 + r() * (F.w - 0.2), b = 0.03 + r() * 0.03, t = 0.015 + r() * 0.02;
            g.fillStyle = "rgba(92,78,60,0.55)";
            g.beginPath(); g.moveTo(ax - b / 2, -0.01); g.lineTo(ax + b / 2, -0.01); g.lineTo(ax + b * 0.3, t * 0.7); g.lineTo(ax - b * 0.1, t); g.lineTo(ax - b * 0.4, t * 0.5); g.closePath(); g.fill();
            g.fillStyle = "rgba(214,202,176,0.45)";
            g.beginPath(); g.moveTo(ax - b * 0.1, t); g.lineTo(ax + b * 0.3, t * 0.7); g.lineTo(ax + b * 0.25, t * 0.7 + 0.006); g.lineTo(ax - b * 0.1, t + 0.006); g.closePath(); g.fill();
          }
        }
        /* Winter: an beiden Enden hängt der Schnee der Trittfläche über die Kante */
        if (winter) for (const sg of [0, 1]) {
          const b = 0.14 + r() * 0.08, x0 = sg ? F.w : 0, xi = sg ? F.w - b : b;
          g.fillStyle = "rgb(238,243,250)";
          g.beginPath(); g.moveTo(x0, -0.01); g.lineTo(xi, -0.01); g.quadraticCurveTo(xi + (sg ? -0.02 : 0.02), 0.03, (x0 + xi) / 2, 0.035 + r() * 0.015); g.quadraticCurveTo(x0, 0.05, x0, 0.05); g.closePath(); g.fill();
        }
      } else if (art === "seite") {
        g.fillStyle = "rgba(40,30,24,0.4)"; g.fillRect(-0.1, F.h - 0.018, F.w + 0.2, 0.018);
        g.fillStyle = "rgba(255,248,230,0.25)"; g.fillRect(-0.1, 0, F.w + 0.2, 0.02);
        /* Winter: Schneehaube über die ganze Stirnseite, unten gewellt */
        if (winter) {
          g.fillStyle = "rgb(238,243,250)";
          g.beginPath(); g.moveTo(-0.02, -0.01); g.lineTo(F.w + 0.02, -0.01);
          for (let a = F.w + 0.02; a >= -0.02; a -= 0.06) g.lineTo(a, 0.035 + Math.sin(a * 23 + F.w * 7) * 0.01 + r() * 0.012);
          g.closePath(); g.fill();
        }
      } else {
        /* Trittfläche: in der Mitte eine ausgetretene Mulde (40 % der
           Breite) – glatt getreten, dunkler im Grund, der Rand zum Licht hell */
        const lang = F.w > F.h, L = lang ? F.w : F.h, T = lang ? F.h : F.w;
        const mx = F.w / 2, my = F.h / 2, rx = lang ? L * 0.2 : T * 0.36, ry = lang ? T * 0.36 : L * 0.2;
        g.save(); g.translate(mx, my); g.scale(rx, ry);
        const gr = g.createRadialGradient(0, 0, 0, 0, 0, 1);
        gr.addColorStop(0, "rgba(96,82,64,0.2)"); gr.addColorStop(0.65, "rgba(96,82,64,0.1)"); gr.addColorStop(0.9, "rgba(255,246,226,0.14)"); gr.addColorStop(1, "rgba(255,246,226,0)");
        g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 1, 0, Math.PI * 2); g.fill();
        g.restore();
        fugen(lang, L);
        if (winter) schneeStufe(g, F, quer, r);
        if (matte) fussmatte(g, F);
      }
    };
  }
  /* Winter auf der Trittfläche: die Mitte ist gefegt und nass (dunkler
     Stein mit mattem Glanz, ein paar Besenstriche), an den Enden liegt
     der Schnee weich und ungleich breit. quer: Stufenbreite läuft entlang F.h. */
  function schneeStufe(g, F, quer, r) {
    const B = quer ? F.h : F.w, T = quer ? F.w : F.h;
    g.save();
    if (quer) g.transform(0, 1, 1, 0, 0, 0);
    const gm = g.createLinearGradient(0, 0, B, 0);
    gm.addColorStop(0, "rgba(58,50,44,0)"); gm.addColorStop(0.18, "rgba(58,50,44,0.3)"); gm.addColorStop(0.82, "rgba(58,50,44,0.3)"); gm.addColorStop(1, "rgba(58,50,44,0)");
    g.fillStyle = gm; g.fillRect(0, 0, B, T);
    if (F.px > 30) {
      g.fillStyle = "rgba(214,224,240,0.16)";
      for (let i = 0; i < 3; i++) { g.beginPath(); g.ellipse(B * (0.3 + r() * 0.4), T * (0.3 + r() * 0.4), B * 0.1, T * 0.12, 0, 0, Math.PI * 2); g.fill(); }
      g.strokeStyle = "rgba(240,244,250,0.4)"; g.lineWidth = Math.max(0.004, 0.6 / F.px);
      g.beginPath();
      for (let i = 0; i < 6; i++) { const x = B * (0.22 + r() * 0.56), l = 0.08 + r() * 0.1; g.moveTo(x, T * (0.1 + r() * 0.3)); g.quadraticCurveTo(x + l * 0.5, T * 0.5, x + l * 0.2, T * (0.6 + r() * 0.3)); }
      g.stroke();
    }
    for (const sg of [0, 1]) {
      const x0 = sg ? B + 0.03 : -0.03, bw = 0.13 + r() * 0.09;
      g.beginPath(); g.moveTo(x0, -0.03);
      const n = Math.max(3, Math.round(T / 0.05));
      for (let i = 0; i <= n; i++) { const t = -0.03 + (T + 0.06) * i / n, b = bw * (0.75 + r() * 0.5); g.lineTo(sg ? B - b : b, t); }
      g.lineTo(x0, T + 0.03); g.closePath();
      g.fillStyle = "rgb(238,243,250)"; g.fill();
      g.strokeStyle = "rgba(140,160,202,0.5)"; g.lineWidth = Math.max(0.008, 1 / F.px); g.stroke();
    }
    g.restore();
  }
  function stufen(M, x0, x1, y, n, hoehen, tiefen, winter) {
    teil(M, "stufen-sued", ST_EG, n, 0.6);
    for (let i = 0; i < hoehen.length; i++) {
      const z1 = hoehen[i], t = tiefen[i], letzte = i === hoehen.length - 1;
      M.quader({ x: x0 + i * 0.05, y: y, z: 0, b: x1 - x0 - i * 0.1, t: t, h: z1 }, { sued: stufeMaler(winter, "vorn"), ost: stufeMaler(winter, "seite"), west: stufeMaler(winter, "seite"), oben: stufeMaler(winter, "oben", letzte) });
    }
  }
  function stufenOst(M, yS, yN, winter) {
    teil(M, "stufen-ost", ST_EG, N_O, 0.6);
    const hs = [0.18, 0.36, Z_SO], ts = [0.78, 0.52, 0.34];
    for (let i = 0; i < 3; i++) {
      const e = i * 0.06;
      M.quader({ x: EG_X, y: yN + e, z: 0, b: ts[i], t: yS - yN - 2 * e, h: hs[i] }, { ost: stufeMaler(winter, "vorn"), sued: stufeMaler(winter, "seite"), nord: stufeMaler(winter, "seite"), oben: stufeMaler(winter, "oben", i === 2, true) });
    }
  }
  /* Hoftür Nord: drei Blockstufen hinauf zur Schwelle (0,55 m) */
  function stufenNord(M, winter) {
    teil(M, "stufen-nord", ST_EG, N_N, 0.6);
    const hs = [0.18, 0.36, Z_SO], ts = [0.78, 0.52, 0.34], x0 = 1.3, x1 = 2.6;
    for (let i = 0; i < 3; i++) {
      const e = i * 0.05;
      M.quader({ x: x0 + e, y: EG_YN - ts[i], z: 0, b: x1 - x0 - 2 * e, t: ts[i], h: hs[i] }, { nord: stufeMaler(winter, "vorn", false, false, true), ost: stufeMaler(winter, "seite", false, false, true), west: stufeMaler(winter, "seite", false, false, true), oben: stufeMaler(winter, "oben", i === 2, false, true) });
    }
  }
  /* Holzstapel unter der Traufe an der Westseite: gespaltene Scheite,
     Stirnseiten mit Jahresringen, oben Rinde; im Winter eine Schneehaube */
  function holzstapel(M, V, winter) {
    teil(M, "holzstapel", ST_EG, N_W, 0.7);
    const y0 = EG_YN + 4.25, y1 = EG_YN + 6.25, x0 = -EG_X - 0.48, x1 = -EG_X - 0.02, h = 1.2;
    const stirn = (g, F) => {
      const r = ST.zufall(ST.textHash(F.name) + 3);
      g.fillStyle = "rgb(58,44,32)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      if (F.px < 10) { g.fillStyle = "rgb(172,138,96)"; g.fillRect(0, 0.1, F.w, F.h - 0.1); flecken(g, 0, 0, F.w, F.h, 0.5, 0.5, "dunkel", 3); return; }
      for (let yy = F.h - 0.06; yy > 0.02; yy -= 0.11) for (let xx = 0.05 + r() * 0.04; xx < F.w; xx += 0.1 + r() * 0.04) {
        const rr = 0.045 + r() * 0.02, a = r() * Math.PI * 2;
        /* Viertel- und Halbscheite: Kreissegmente, hell mit Ringen, Rinde außen */
        g.fillStyle = "rgb(84,60,40)"; g.beginPath(); g.moveTo(xx, yy); g.arc(xx, yy, rr + 0.008, a, a + Math.PI * (0.6 + r() * 0.6)); g.closePath(); g.fill();
        const c = PI.streu([196, 158, 110], r, 0.12);
        g.fillStyle = rgb(c); g.beginPath(); g.moveTo(xx, yy); g.arc(xx, yy, rr, a, a + Math.PI * (0.6 + r() * 0.5)); g.closePath(); g.fill();
        if (F.px > 30) { g.strokeStyle = rgb(hell(c, -0.2), 0.6); g.lineWidth = Math.max(0.002, 0.5 / F.px); g.beginPath(); g.arc(xx, yy, rr * 0.55, a, a + 1.4); g.stroke(); }
      }
      flecken(g, 0, 0, F.w, F.h, 0.7, 0.25, "dunkel", 5);
      if (winter) { g.fillStyle = "rgba(240,244,250,0.95)"; g.beginPath(); g.moveTo(-0.1, -0.1); g.lineTo(F.w + 0.1, -0.1); g.lineTo(F.w + 0.1, 0.06); for (let a = F.w; a >= 0; a -= 0.1) g.lineTo(a, 0.05 + Math.sin(a * 13) * 0.02 + r() * 0.03); g.closePath(); g.fill(); }
    };
    const seite = (g, F) => { g.fillStyle = "rgb(86,64,44)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.fillStyle = "rgba(40,28,18,0.6)"; for (let yy = 0.05; yy < F.h; yy += 0.11) g.fillRect(-0.1, yy, F.w + 0.2, 0.02); flecken(g, 0, 0, F.w, F.h, 0.6, 0.4, "dunkel", 9); };
    const oben = (g, F) => { g.fillStyle = winter ? "rgb(238,243,250)" : "rgb(92,70,48)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); if (!winter) { g.fillStyle = "rgba(40,28,18,0.5)"; for (let xx = 0.05; xx < F.w; xx += 0.1) g.fillRect(xx, 0, 0.015, F.h); } else flecken(g, 0, 0, F.w, F.h, 1, 0.3, "blau", 3); };
    kasten(M, x0, y0, 0, x1, y1, h, { west: stirn, sued: seite, nord: seite, oben: oben });
  }
  /* Regentonne am Fallrohr (West): Eichendauben, zwei Eisenreifen */
  /* =====================================================================
     FRÜHLINGSSCHMUCK – RUNDE 2
     Kritik: „Außer winzigen roten Punkten in den Kästen und einer
     Kletterrose fehlt jeder Liebreiz." XANDER: „Die sollen wirklich ihren
     Liebreiz haben." Dazu kommen: eine Hausbank unter dem Stubenfenster
     neben der Haustür, zwei Buchskübel an der Ladentür, gestreifte
     Markisen über den Schaufenstern und ein Weinstock an der Südostecke
     (Maler weinrebe, auf Laden- und Obergeschosswand).
     ===================================================================== */
  const MARKISE = { x: [[-2.5, -0.62], [0.62, 2.5]], z: 2.4, t: 0.82, dz: 0.3, v: 0.18 };
  function fruehlingsSchmuck(M, V) {
    /* --- Hausbank (Ost, unter dem Stubenfenster): zwei Wangen, Sitz aus
       zwei Bohlen, Lehnbrett an der Wand – echtes Holz, echte Quader --- */
    const hb = [132, 108, 80];
    const bankMal = (c, fugen) => (g, F) => {
      g.fillStyle = rgb(c); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      if (F.px > 10) {
        flecken(g, -0.05, -0.05, F.w + 0.1, F.h + 0.1, 0.35, 0.45, "dunkel", 5 + Math.round(F.w * 10));
        if (F.px > 30) flecken(g, -0.05, -0.05, F.w + 0.1, F.h + 0.1, 0.5, 0.25, "holzhell", 9);
        if (fugen) { g.fillStyle = "rgba(40,30,22,0.7)"; if (F.w > F.h) g.fillRect(0, F.h / 2 - 0.004, F.w, 0.008); else g.fillRect(F.w / 2 - 0.004, 0, 0.008, F.h); }
        g.fillStyle = "rgba(255,244,222,0.18)"; g.fillRect(-0.05, -0.05, F.w + 0.1, 0.055);
      }
    };
    const yS = EG_YS - 3.3, yN = EG_YS - 4.75, xW = EG_X + 0.02;
    teil(M, "hausbank", ST_EG, N_O, 0.3, { schatten: true });
    kasten(M, xW, yN, 0.58, xW + 0.05, yS, 0.84, { ost: bankMal(hell(hb, -0.04)), sued: bankMal(hb), nord: bankMal(hb), oben: bankMal(hell(hb, 0.06)) });
    for (const y of [yS - 0.06, yN + 0.01]) kasten(M, xW + 0.06, y, 0, xW + 0.4, y + 0.05, 0.42, { ost: bankMal(hell(hb, -0.1)), sued: bankMal(hell(hb, -0.06)), nord: bankMal(hell(hb, -0.06)) });
    kasten(M, xW + 0.03, yN - 0.04, 0.42, xW + 0.44, yS + 0.04, 0.47, { ost: bankMal(hell(hb, -0.02)), sued: bankMal(hb), nord: bankMal(hb), oben: bankMal(hell(hb, 0.1), true) });
    /* auf der Bank: ein Kissen und eine Gießkanne daneben */
    M.figur({ x: xW + 0.24, y: yS - 0.35, z: 0.47, breite: 0.5, hoehe: 0.2, schatten: false, malen: (g, s, F) => {
      if (F.schatten || s < 16) return;
      const Zt = F.Z || { amb: [0.6, 0.6, 0.7], sonne: [0.4, 0.4, 0.4] }, li = Math.min(1, Zt.amb[1] + Zt.sonne[1] * 0.8);
      g.fillStyle = rgb(hellMal([150, 44, 46], li)); rrect(g, -0.17 * s, -0.08 * s, 0.34 * s, 0.1 * s, 0.04 * s); g.fill();
      g.fillStyle = rgb(hellMal([196, 82, 70], li)); rrect(g, -0.15 * s, -0.08 * s, 0.3 * s, 0.035 * s, 0.02 * s); g.fill();
      if (s > 40) { g.strokeStyle = rgb(hellMal([236, 222, 200], li), 0.6); g.lineWidth = Math.max(0.5, 0.004 * s); for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(k * 0.05 * s, -0.075 * s); g.lineTo(k * 0.05 * s, 0.015 * s); g.stroke(); } }
    } });
    M.figur({ x: xW + 0.3, y: yN - 0.3, z: 0, breite: 0.5, hoehe: 0.4, schatten: true, malen: (g, s, F) => {
      const R = 0.1 * s, H = 0.24 * s * ST.KZ, ry = R * 0.5;
      if (F.schatten) { g.fillStyle = "#000"; g.fillRect(-R, -H, 2 * R, H); return; }
      if (s < 14) return;
      const Zt = F.Z || { amb: [0.6, 0.6, 0.7], sonne: [0.4, 0.4, 0.4] }, li = Math.min(1, Zt.amb[1] + Zt.sonne[1] * 0.8);
      const gr = g.createLinearGradient(-R, 0, R, 0);
      gr.addColorStop(0, rgb(hellMal([168, 176, 170], li))); gr.addColorStop(0.4, rgb(hellMal([128, 138, 134], li))); gr.addColorStop(1, rgb(hellMal([78, 86, 84], li)));
      g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, R, ry, 0, 0, Math.PI); g.lineTo(-R, -H); g.ellipse(0, -H, R, ry, 0, Math.PI, 0, true); g.closePath(); g.fill();
      g.strokeStyle = rgb(hellMal([110, 118, 116], li)); g.lineWidth = Math.max(0.8, 0.012 * s);
      g.beginPath(); g.moveTo(R * 0.8, -H * 0.7); g.lineTo(R * 2.6, -H * 1.35); g.stroke();
      g.beginPath(); g.ellipse(-R * 0.1, -H - 0.07 * s, R * 0.75, 0.06 * s, 0, Math.PI, 0); g.stroke();
      g.fillStyle = rgb(hellMal([96, 104, 100], li)); g.beginPath(); g.ellipse(R * 2.7, -H * 1.4, 0.025 * s, 0.018 * s, -0.6, 0, Math.PI * 2); g.fill();
    } });

    /* --- Buchskübel links und rechts der Ladentür --- */
    teil(M, "kuebel", ST_EG, N_S, 0.7, { schatten: false });
    for (const x of [-1.0, 1.0]) M.figur({ x: x, y: EG_YS + 0.34, z: 0, breite: 0.8, hoehe: 1.1, schatten: true, malen: buchsKuebel(V.saat + (x > 0 ? 7 : 0)) });

    /* --- Markisen: ein geneigtes Tuch (0,82 m aus, 0,3 m Fall) und ein
       gebogter Volant; eigene Flächen, damit sie in jedem Winkel stimmen --- */
    const farben = [[[168, 40, 42], [240, 232, 214]], [[38, 90, 64], [238, 232, 212]], [[46, 68, 116], [240, 234, 220]]][V.saat % 3];
    teil(M, "markise", ST_EG, N_S, 0.5);
    const L = Math.hypot(MARKISE.t, MARKISE.dz);
    for (const [x0, x1] of MARKISE.x) {
      const w = x1 - x0;
      M.flaeche({ name: "markise-" + x0, o: [x0, EG_YS, MARKISE.z], u: [1, 0, 0], v: [0, MARKISE.t / L, -MARKISE.dz / L], w: w, h: L, malen: markiseMaler(farben, false) });
      const n = Math.max(3, Math.round(w / 0.25)), um = [[0, 0], [w, 0], [w, MARKISE.v * 0.62]];
      for (let i = n - 1; i >= 0; i--) for (let k = 1; k <= 6; k++) { const q = k / 6, a = w * (i + 1 - q) / n; um.push([a, MARKISE.v * (0.62 + 0.38 * Math.sin(q * Math.PI))]); }
      M.flaeche({ name: "volant-" + x0, o: [x0, EG_YS + MARKISE.t, MARKISE.z - MARKISE.dz], u: [1, 0, 0], v: [0, 0, -1], w: w, h: MARKISE.v, umriss: um, malen: markiseMaler(farben, true) });
    }
  }
  /* Markisentuch: Blockstreifen quer zur Wand, Tuchwelle zwischen den
     Gelenkarmen, oben die Tuchwelle-Kassette; der Volant mit Borte */
  function markiseMaler(farben, volant) {
    return function (g, F) {
      const [a, b] = farben, sb = 0.105;
      g.fillStyle = rgb(b); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      g.fillStyle = rgb(a);
      for (let x = sb * 0.5; x < F.w; x += 2 * sb) g.fillRect(x, -0.05, sb, F.h + 0.1);
      if (!volant) {
        /* Durchhang zwischen den Armen: in der Mitte etwas dunkler */
        const gq = g.createLinearGradient(0, 0, F.w, 0);
        gq.addColorStop(0, "rgba(255,255,255,0.06)"); gq.addColorStop(0.5, "rgba(30,20,20,0.1)"); gq.addColorStop(1, "rgba(255,255,255,0.06)");
        g.fillStyle = gq; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
        const gr = g.createLinearGradient(0, 0, 0, F.h);
        gr.addColorStop(0, "rgba(30,24,24,0.25)"); gr.addColorStop(0.18, "rgba(30,24,24,0)"); gr.addColorStop(0.9, "rgba(255,250,240,0.06)"); gr.addColorStop(1, "rgba(30,24,24,0.16)");
        g.fillStyle = gr; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
        /* Kassette an der Wand, Fallstange vorn */
        g.fillStyle = "rgb(84,80,74)"; g.fillRect(-0.05, -0.05, F.w + 0.1, 0.1);
        g.fillStyle = "rgba(220,214,204,0.5)"; g.fillRect(-0.05, 0.0, F.w + 0.1, 0.014);
        g.fillStyle = "rgb(70,66,62)"; g.fillRect(-0.05, F.h - 0.03, F.w + 0.1, 0.035);
      } else {
        g.fillStyle = "rgba(30,24,24,0.3)"; g.fillRect(-0.05, -0.05, F.w + 0.1, 0.075);
        g.fillStyle = "rgba(255,248,236,0.5)"; g.fillRect(-0.05, 0.035, F.w + 0.1, 0.01);
        g.fillStyle = "rgba(30,24,24,0.18)"; g.fillRect(-0.05, F.h * 0.7, F.w + 0.1, F.h * 0.4);
      }
      if (F.px > 22) flecken(g, -0.05, -0.05, F.w + 0.1, F.h + 0.1, 0.5, 0.14, "fein", 9);
    };
  }
  /* Buchskugel im Terrakottakübel: Kübel mit Rand und Verlauf, die Kugel
     mit Licht von der Sonnenseite und einem Blattpelz aus vielen kleinen
     Tupfen; der Umriss ist leicht bucklig, nie ein glatter Kreis. */
  function buchsKuebel(saat) {
    return function (g, s, F) {
      const r = ST.zufall(saat * 31 + 3);
      const Ru = 0.15 * s, Ro = 0.2 * s, H = 0.4 * s * ST.KZ, rb = 0.26 * s, cy = -H - rb * 0.82;
      const buckel = [];
      for (let k = 0; k < 24; k++) buckel.push(1 + (r() - 0.5) * 0.08);
      const kugel = () => { g.beginPath(); for (let k = 0; k <= 24; k++) { const a = k / 24 * Math.PI * 2, q = buckel[k % 24] * rb; if (k) g.lineTo(Math.cos(a) * q, cy + Math.sin(a) * q); else g.moveTo(Math.cos(a) * q, cy + Math.sin(a) * q); } g.closePath(); };
      if (F.schatten) {
        g.fillStyle = "#000"; g.beginPath(); g.moveTo(-Ru, 0); g.lineTo(-Ro, -H); g.lineTo(Ro, -H); g.lineTo(Ru, 0); g.closePath(); g.fill();
        kugel(); g.fill(); return;
      }
      const Zt = F.Z || { amb: [0.6, 0.6, 0.7], sonne: [0.4, 0.4, 0.4] };
      const li = [0, 1, 2].map((i) => Math.min(1.1, Zt.amb[i] * 0.95 + Zt.sonne[i] * 0.9));
      const col = (c, a) => rgb([c[0] * li[0], c[1] * li[1], c[2] * li[2]], a);
      /* Sonnenrichtung im Bild (für Glanz und Schattenseite) */
      const gi = (F.gier || 0) * Math.PI / 180, L = ST.LICHT, lx = L[0] * Math.cos(gi) - L[1] * Math.sin(gi), ly = L[0] * Math.sin(gi) + L[1] * Math.cos(gi);
      const sx = (lx - ly) * ST.KX, sy = (lx + ly) * ST.KY - L[2] * ST.KZ;
      /* Kübel */
      const gk = g.createLinearGradient(-Ro, 0, Ro, 0);
      const tk = [178, 98, 66];
      gk.addColorStop(0, col(hell(tk, sx < 0 ? 0.12 : -0.2))); gk.addColorStop(0.5, col(tk)); gk.addColorStop(1, col(hell(tk, sx < 0 ? -0.25 : 0.1)));
      g.fillStyle = gk; g.beginPath(); g.moveTo(-Ru, 0); g.ellipse(0, 0, Ru, Ru * 0.5, 0, Math.PI, 0, true); g.lineTo(Ro, -H); g.lineTo(-Ro, -H); g.closePath(); g.fill();
      if (s > 20) { g.fillStyle = col([120, 104, 82], 0.25); g.beginPath(); g.ellipse(0, -H * 0.15, Ru * 1.05, Ru * 0.35, 0, 0, Math.PI); g.fill(); }
      g.fillStyle = col(hell(tk, 0.08)); g.beginPath(); g.ellipse(0, -H, Ro * 1.06, Ro * 0.53, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = col([60, 44, 32]); g.beginPath(); g.ellipse(0, -H, Ro * 0.92, Ro * 0.44, 0, 0, Math.PI * 2); g.fill();
      /* Kugel */
      const gb = g.createRadialGradient(sx * rb * 0.55, cy + sy * rb * 0.55, rb * 0.1, 0, cy, rb * 1.05);
      gb.addColorStop(0, col([96, 132, 64])); gb.addColorStop(0.55, col([52, 88, 42])); gb.addColorStop(1, col([26, 48, 26]));
      g.fillStyle = gb; kugel(); g.fill();
      if (s > 24) {
        g.save(); kugel(); g.clip();
        const n = Math.round(Math.min(260, rb * rb * 0.9));
        for (let k = 0; k < n; k++) {
          const a = r() * Math.PI * 2, rr = Math.sqrt(r()) * rb, px = Math.cos(a) * rr, py = cy + Math.sin(a) * rr;
          const hl = ((px / rb) * sx + ((py - cy) / rb) * sy) * 0.5 + 0.5;
          g.fillStyle = col(hl > 0.62 ? [118, 150, 76] : hl > 0.4 ? [70, 108, 50] : [34, 62, 32], 0.8);
          g.beginPath(); g.ellipse(px, py, Math.max(0.6, 0.012 * s), Math.max(0.5, 0.008 * s), r() * 3, 0, Math.PI * 2); g.fill();
        }
        g.restore();
      }
    };
  }
  /* Weinrebe am Spalier: knorriger Stamm, Leittriebe, große fünflappige
     Blätter in frischem Frühlingsgrün (Unterseite heller, leicht versetzt),
     dazu Ranken; stamm und triebe in Wandkoordinaten */
  function weinrebe(g, F, stamm, triebe, saat) {
    const r = ST.zufall(saat * 13 + 5);
    const linie = (pts, b0, b1, c) => {
      for (let k = 1; k < pts.length; k++) {
        const q = (k - 1) / Math.max(1, pts.length - 2);
        g.strokeStyle = rgb(c); g.lineWidth = Math.max(0.7 / F.px, b0 + (b1 - b0) * q);
        g.beginPath(); g.moveTo(pts[k - 1][0], pts[k - 1][1]);
        g.quadraticCurveTo((pts[k - 1][0] + pts[k][0]) / 2 + (r() - 0.5) * 0.06, (pts[k - 1][1] + pts[k][1]) / 2, pts[k][0], pts[k][1]); g.stroke();
      }
    };
    linie(stamm, 0.05, 0.035, [86, 66, 46]);
    if (F.px > 20) { g.save(); g.translate(-0.008, 0); linie(stamm, 0.012, 0.008, [140, 116, 88]); g.restore(); }
    for (const t of triebe) linie(t, 0.022, 0.01, [98, 80, 52]);
    if (F.px < 8) return;
    const blatt = (bx, by, R, dreh, c) => {
      g.beginPath();
      for (let k = 0; k <= 20; k++) {
        const a = -Math.PI / 2 + (k / 20) * Math.PI * 2;
        const lap = 0.66 + 0.34 * Math.abs(Math.cos((a + Math.PI / 2) * 2.5));
        const kerbe = Math.abs(Math.sin((a + Math.PI / 2) / 2)) > 0.97 ? 0.45 : 1;
        const rr = R * lap * kerbe, px = bx + Math.cos(a + dreh) * rr, py = by + Math.sin(a + dreh) * rr * 0.92;
        if (k) g.lineTo(px, py); else g.moveTo(px, py);
      }
      g.closePath(); g.fillStyle = rgb(c); g.fill();
    };
    const orte = [];
    for (const t of triebe) for (let k = 1; k < t.length; k++) { const L = Math.hypot(t[k][0] - t[k - 1][0], t[k][1] - t[k - 1][1]); for (let j = 0; j < Math.max(2, L * 9); j++) { const q = r(); orte.push([t[k - 1][0] + (t[k][0] - t[k - 1][0]) * q, t[k - 1][1] + (t[k][1] - t[k - 1][1]) * q]); } }
    for (let k = 1; k < stamm.length; k++) for (let j = 0; j < 3; j++) { const q = r(); if (k === 1 && q < 0.6) continue; orte.push([stamm[k - 1][0] + (stamm[k][0] - stamm[k - 1][0]) * q, stamm[k - 1][1] + (stamm[k][1] - stamm[k - 1][1]) * q]); }
    for (const [px, py] of orte) {
      const n = 2 + Math.floor(r() * 2);
      for (let j = 0; j < n; j++) {
        const R = 0.07 + r() * 0.05, bx = px + (r() - 0.5) * 0.22, by = py + 0.02 + r() * 0.14, dreh = (r() - 0.5) * 0.9;
        const c = PI.streu([96, 142, 58], r, 0.14);
        blatt(bx + 0.008, by + 0.012, R, dreh, hell(c, -0.35));
        blatt(bx, by, R, dreh, c);
        if (F.px * R > 5) {
          g.strokeStyle = rgb(hell(c, 0.25), 0.7); g.lineWidth = Math.max(0.5 / F.px, R * 0.05);
          g.beginPath(); for (const a of [-Math.PI / 2, -Math.PI / 2 + 1.2, -Math.PI / 2 - 1.2, Math.PI / 2 - 0.9, Math.PI / 2 + 0.9]) { g.moveTo(bx, by + R * 0.3); g.lineTo(bx + Math.cos(a + dreh) * R * 0.75, by + R * 0.3 + Math.sin(a + dreh) * R * 0.7); } g.stroke();
        }
      }
      /* Ranke */
      if (F.px > 40 && r() < 0.4) { g.strokeStyle = "rgba(110,140,70,0.9)"; g.lineWidth = Math.max(0.5 / F.px, 0.004); g.beginPath(); g.arc(px + 0.05, py - 0.03, 0.02, 0, Math.PI * 1.6); g.arc(px + 0.06, py - 0.05, 0.01, Math.PI, Math.PI * 2.6); g.stroke(); }
    }
  }

  function regentonne(M, winter) {
    teil(M, "regentonne", ST_EG, N_W, 0.75);
    M.figur({ x: -EG_X - 0.38, y: EG_YS - 0.55, z: 0, breite: 0.8, hoehe: 1, schatten: true, malen: (g, s, F) => {
      const R = 0.3 * s, H = 0.78 * s * ST.KZ, ry = R * 0.5;
      if (F.schatten) { g.fillStyle = "#000"; g.beginPath(); g.ellipse(0, 0, R, ry, 0, 0, Math.PI); g.lineTo(-R, -H); g.ellipse(0, -H, R, ry, 0, Math.PI, 0, true); g.closePath(); g.fill(); return; }
      const Zt = F.Z || { amb: [0.6, 0.6, 0.7], sonne: [0.4, 0.4, 0.4] }, li = Math.min(1, Zt.amb[1] + Zt.sonne[1] * 0.8);
      const gr = g.createLinearGradient(-R, 0, R, 0);
      gr.addColorStop(0, rgb(hellMal([150, 110, 70], li))); gr.addColorStop(0.35, rgb(hellMal([126, 90, 58], li))); gr.addColorStop(1, rgb(hellMal([62, 44, 30], li)));
      g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, R, ry, 0, 0, Math.PI); g.lineTo(-R, -H); g.ellipse(0, -H, R, ry, 0, Math.PI, 0, true); g.closePath(); g.fill();
      g.strokeStyle = rgb(hellMal([40, 30, 22], li), 0.6); g.lineWidth = Math.max(0.5, 0.008 * s);
      for (let i = -3; i <= 3; i++) { const x = R * i / 3.5; g.beginPath(); g.moveTo(x, ry * Math.sqrt(Math.max(0, 1 - (x / R) * (x / R)))); g.lineTo(x, -H + ry * Math.sqrt(Math.max(0, 1 - (x / R) * (x / R)))); g.stroke(); }
      g.strokeStyle = rgb(hellMal([46, 46, 50], li)); g.lineWidth = Math.max(1, 0.03 * s);
      for (const t of [0.18, 0.82]) { g.beginPath(); g.ellipse(0, -H * t, R, ry, 0, 0, Math.PI); g.stroke(); }
      /* Wasser bzw. Eis mit Schnee */
      g.fillStyle = winter ? rgb(hellMal([236, 241, 249], li)) : rgb(hellMal([46, 58, 66], li));
      g.beginPath(); g.ellipse(0, -H, R * 0.92, ry * 0.9, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = rgb(hellMal([70, 52, 36], li)); g.lineWidth = Math.max(1, 0.03 * s); g.beginPath(); g.ellipse(0, -H, R, ry, 0, 0, Math.PI * 2); g.stroke();
    } });
  }
  /* Fußabtreter aus Kokos auf der obersten Stufe */
  function fussmatte(g, F) {
    const quer = F.h > F.w;
    const mw0 = Math.min(0.7, (quer ? F.h : F.w) * 0.55), mh0 = Math.min(0.3, (quer ? F.w : F.h) * 0.6);
    const mw = quer ? mh0 : mw0, mh = quer ? mw0 : mh0;
    const mx = (F.w - mw) / 2, my = (F.h - mh) / 2;
    g.fillStyle = "rgba(40,30,20,0.35)"; rrect(g, mx + 0.01, my + 0.012, mw, mh, 0.015); g.fill();
    g.fillStyle = "rgb(134,98,58)"; rrect(g, mx, my, mw, mh, 0.015); g.fill();
    flecken(g, mx, my, mw, mh, 0.3, 0.5, "korn", 3);
    if (F.px > 18) {
      /* Kokosfasern in Reihen, dunkler Rand eingewebt */
      g.strokeStyle = "rgba(90,62,34,0.45)"; g.lineWidth = Math.max(0.004, 0.6 / F.px);
      g.beginPath();
      if (quer) for (let k = my + 0.02; k < my + mh - 0.01; k += 0.022) { g.moveTo(mx + 0.02, k); g.lineTo(mx + mw - 0.02, k); }
      else for (let k = mx + 0.02; k < mx + mw - 0.01; k += 0.022) { g.moveTo(k, my + 0.02); g.lineTo(k, my + mh - 0.02); }
      g.stroke();
      g.strokeStyle = "rgba(70,46,24,0.55)"; g.lineWidth = 0.014; rrect(g, mx + 0.03, my + 0.03, mw - 0.06, mh - 0.06, 0.01); g.stroke();
    }
    if (F.jahr === "winter") { g.fillStyle = "rgba(240,245,252,0.35)"; g.fillRect(mx, my, mw, mh * 0.25); }
  }

  /* ---------------- Nasenschild (Zunftzeichen am Ausleger) ----------------
     Echte Figur in 3D gerechnet: Ausleger senkrecht zur Wand, Schild
     hängt in der Ebene senkrecht zur Wand – dreht sich mit. */
  function nasenschild(V) {
    return function (g, s, F) {
      const gier = (F.gier || 0) * Math.PI / 180, c = Math.cos(gier), sn = Math.sin(gier);
      const P = (dx, dy, dz) => { const a = dx * c - dy * sn, b = dx * sn + dy * c; return [(a - b) * ST.KX * s, (a + b) * ST.KY * s - dz * ST.KZ * s]; };
      const dunkel = F.schatten ? "#000" : "#1b1714";
      g.strokeStyle = dunkel; g.lineCap = "round";
      /* Ausleger: waagerechter Arm, Zierbogen darunter */
      const A0 = P(0, 0, 0.55), A1 = P(0, 0.95, 0.55);
      g.lineWidth = Math.max(1, 0.03 * s);
      g.beginPath(); g.moveTo(A0[0], A0[1]); g.lineTo(A1[0], A1[1]); g.stroke();
      g.lineWidth = Math.max(0.8, 0.018 * s);
      const B0 = P(0, 0, 0.15), Bm = P(0, 0.35, 0.3), B1 = P(0, 0.7, 0.55);
      g.beginPath(); g.moveTo(B0[0], B0[1]); g.quadraticCurveTo(Bm[0] - (B0[0] - B1[0]) * 0.1, Bm[1], B1[0], B1[1]); g.stroke();
      if (s > 25) { const K = P(0, 0.4, 0.43); g.beginPath(); g.arc(K[0], K[1], 0.06 * s, 0, Math.PI * 1.6); g.stroke(); }
      /* Schild: Ebene senkrecht zur Wand (dy, dz) */
      const Q = (dy, dz) => P(0, dy, dz);
      const k1 = Q(0.22, 0.5), k2 = Q(0.9, 0.5), k3 = Q(0.9, -0.15), k4 = Q(0.22, -0.15);
      g.lineWidth = Math.max(0.6, 0.01 * s);
      const h1 = Q(0.3, 0.55), h2 = Q(0.82, 0.55);
      g.beginPath(); g.moveTo(h1[0], h1[1]); g.lineTo(h1[0], k1[1] + (h1[1] - k1[1])); g.moveTo(h2[0], h2[1]); g.lineTo(h2[0], h2[1] + (k2[1] - h2[1])); g.stroke();
      const flach = Math.abs(k2[0] - k1[0]) < 0.08 * s;
      if (F.schatten) { g.fillStyle = "#000"; g.beginPath(); g.moveTo(k1[0], k1[1]); g.lineTo(k2[0], k2[1]); g.lineTo(k3[0], k3[1]); g.lineTo(k4[0], k4[1]); g.closePath(); g.fill(); return; }
      /* Die Figur bekommt kein Kernlicht: selbst belichten, sonst leuchtet
         das Schild nachts wie am Tag */
      const Zt = F.Z || { amb: [0.6, 0.6, 0.7], sonne: [0.4, 0.4, 0.4] };
      const L = [0, 1, 2].map((i) => Math.min(1, Zt.amb[i] + Zt.sonne[i] * 0.8));
      const mul = (c, a) => (a == null ? "rgb(" : "rgba(") + c.map((v, i) => Math.round(Math.min(255, v * L[i]))).join(",") + (a == null ? ")" : "," + a + ")");
      /* Schildfläche: Blech, dunkelgrün mit Goldrand; Zeichen je Geschäft */
      g.beginPath(); g.moveTo(k1[0], k1[1]); g.lineTo(k2[0], k2[1]); g.lineTo(k3[0], k3[1]); g.lineTo(k4[0], k4[1]); g.closePath();
      g.fillStyle = mul(hell(V.schild, -0.1)); g.fill();
      g.strokeStyle = mul([200, 162, 78]); g.lineWidth = Math.max(0.6, 0.02 * s); g.stroke();
      if (!flach && s > 12) {
        const M2 = Q(0.56, 0.18);
        const sx = (k2[0] - k1[0]) / 0.68;             // Pixel je Meter in Schildrichtung
        g.save(); g.translate(M2[0], M2[1]); g.transform(sx / s, (k2[1] - k1[1]) / 0.68 / s, 0, 1, 0, 0);
        zunftzeichen(g, s, V.geschaeft.art, mul);
        g.restore();
      }
      if (F.jahr === "winter") {
        /* Schnee liegt direkt auf dem Arm (Unterkante = Oberkante Arm) und
           als schmale Kappe auf der Schildkante */
        g.fillStyle = mul([244, 248, 253], 0.95); g.lineWidth = Math.max(1, 0.035 * s); g.strokeStyle = g.fillStyle;
        const hub = (0.015 + 0.0175) * s;
        g.beginPath(); g.moveTo(A0[0], A0[1] - hub); g.lineTo(A1[0], A1[1] - hub); g.stroke();
        const e0 = Q(0.22, 0.535), e1 = Q(0.9, 0.535), m1 = Q(0.56, 0.56);
        g.beginPath(); g.moveTo(k1[0], k1[1]); g.lineTo(k2[0], k2[1]); g.lineTo(e1[0], e1[1]); g.quadraticCurveTo(m1[0], m1[1], e0[0], e0[1]); g.closePath(); g.fill();
        if (flach) { g.lineWidth = Math.max(1, 0.025 * s); g.beginPath(); g.moveTo(k1[0], k1[1] - 0.01 * s); g.lineTo(k2[0], k2[1] - 0.01 * s); g.stroke(); }
      }
    };
  }
  function zunftzeichen(g, s, art, mul) {
    mul = mul || ((c) => rgb(c));
    const gold = g.createLinearGradient(0, -0.25 * s, 0, 0.25 * s);
    gold.addColorStop(0, mul([247, 226, 160])); gold.addColorStop(0.5, mul([210, 163, 71])); gold.addColorStop(1, mul([142, 101, 34]));
    g.strokeStyle = gold; g.fillStyle = gold; g.lineCap = "round";
    if (art === "baecker") {
      /* Brezel */
      g.lineWidth = 0.055 * s;
      g.beginPath(); g.moveTo(-0.02 * s, 0.14 * s); g.bezierCurveTo(-0.35 * s, 0.05 * s, -0.3 * s, -0.22 * s, -0.08 * s, -0.16 * s); g.bezierCurveTo(0.05 * s, -0.12 * s, 0.02 * s, 0.05 * s, 0.1 * s, 0.14 * s); g.stroke();
      g.beginPath(); g.moveTo(0.02 * s, 0.14 * s); g.bezierCurveTo(0.35 * s, 0.05 * s, 0.3 * s, -0.22 * s, 0.08 * s, -0.16 * s); g.bezierCurveTo(-0.05 * s, -0.12 * s, -0.02 * s, 0.05 * s, -0.1 * s, 0.14 * s); g.stroke();
    } else if (art === "buch") {
      g.fillRect(-0.18 * s, -0.14 * s, 0.36 * s, 0.26 * s);
      g.fillStyle = mul([106, 30, 26]); g.fillRect(-0.16 * s, -0.12 * s, 0.15 * s, 0.22 * s); g.fillRect(0.01 * s, -0.12 * s, 0.15 * s, 0.22 * s);
    } else {
      g.lineWidth = 0.03 * s;
      g.beginPath(); g.arc(0, 0, 0.2 * s, 0, Math.PI * 2); g.stroke();
      g.fillStyle = mul([242, 234, 210]); g.beginPath(); g.arc(0, 0, 0.17 * s, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#222"; g.lineWidth = 0.02 * s; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -0.12 * s); g.moveTo(0, 0); g.lineTo(0.08 * s, 0.04 * s); g.stroke();
    }
  }

  /* =====================================================================
     OBERGESCHOSS einer Seite: Balkenlage (Füllhölzer + Köpfe), Wand
     ===================================================================== */
  function ogSeite(M, seite, plan, V, o, winter, Z, wi) {
    const n = { sued: N_S, nord: N_N, ost: N_O, west: N_W }[seite];
    const geo = {
      sued: [[-OG_X, OG_YS], [OG_X, OG_YS], Z_OG],
      ost: [[OG_X, OG_YS], [OG_X, OG_YN], Z_T],
      nord: [[OG_X, OG_YN], [-OG_X, OG_YN], Z_T],
      west: [[-OG_X, OG_YN], [-OG_X, OG_YS], Z_T]
    }[seite];
    const offen = Z.og === "gerippe" || Z.og === "fachen";
    teil(M, "og-" + seite, ST_OG, n, 0);
    /* Balkenlage: Füllholzband (zurückgesetzt) und Balkenköpfe */
    if (Z.balken > 0) {
      /* RUNDE 1: Solange das Obergeschoss offen ist, gehören Füllhölzer und
         Balkenköpfe zur Balkenlage (gleiches Teil) – sonst wurden die Köpfe
         der fernen Seite nach der Dielung gemalt und ragten als dunkle
         Stifte über die Bodenkante. */
      const imBoden = Z.og !== "zu" && M._bodenOg, altTeil = M.akt;
      if (imBoden) M.akt = M._bodenOg;
      const eb = imBoden ? 0 : -2, ek = imBoden ? 0 : -1;
      const fuell = fuellholzMaler(V, seite);
      if (seite === "sued") {
        if (Z.fuellholz) M.flaeche({ name: "bl-sued", o: [-BL_X, BL_YS, Z_BL], u: [1, 0, 0], v: [0, 0, -1], w: 2 * BL_X, h: Z_BL - Z_EG, malen: fuell, ebene: eb });
        balkenKoepfe(M, V, "sued", winter, ek);
      } else if (seite === "ost") {
        if (Z.fuellholz) M.flaeche({ name: "bl-ost", o: [BL_X, BL_YS, Z_BL], u: [0, -1, 0], v: [0, 0, -1], w: BL_YS - OG_YN, h: Z_BL - Z_EG, malen: fuell, ebene: eb });
        balkenKoepfe(M, V, "ost", winter, ek);
      } else if (seite === "west") {
        if (Z.fuellholz) M.flaeche({ name: "bl-west", o: [-BL_X, OG_YN, Z_BL], u: [0, 1, 0], v: [0, 0, -1], w: BL_YS - OG_YN, h: Z_BL - Z_EG, malen: fuell, ebene: eb });
        balkenKoepfe(M, V, "west", winter, ek);
      } else if (Z.fuellholz) {
        M.flaeche({ name: "bl-nord", o: [BL_X, OG_YN, Z_BL], u: [-1, 0, 0], v: [0, 0, -1], w: 2 * BL_X, h: Z_BL - Z_EG, malen: fuell, ebene: eb });
      }
      M.akt = altTeil;
    }
    if (offen) {
      /* Gerippe (für Ost/West bis zur Traufe: Plan geht bis Z_T) */
      gerippeFlaeche(M, "og-" + seite, geo[0], geo[1], Z_BL, plan, V, wi, Z.ogHolz, Z.og === "fachen" ? Z.ogFach : 0, 0.18);
    } else if (Z.og === "zu") {
      const p = Object.assign({}, plan);
      if (seite === "ost") p.deko = (g, F, V2, zO) => { if (Z.rohr) rohrSchatten(g, F, 0.65, zO - Z_OG + 0.1, zO - Z_BL); };
      if (seite === "west") p.deko = (g, F, V2, zO) => { if (Z.rohr) rohrSchatten(g, F, 10.0, zO - Z_OG + 0.1, zO - Z_BL); };
      /* Frühling: der Weinstock der Südostecke rankt im Obergeschoss weiter –
         am Eckständer hinauf und unter dem Brüstungsriegel entlang */
      if (seite === "sued" && !winter && Z.deko) p.deko = (g, F, V2, zO) => weinrebe(g, F, [[6.72, zO - Z_BL + 0.02], [6.78, zO - 4.6], [6.7, zO - 5.4], [6.76, zO - 6.2]],
        [[[6.75, zO - 4.42], [6.4, zO - 4.46], [5.9, zO - 4.42], [5.4, zO - 4.47], [5.1, zO - 4.43]], [[6.76, zO - 6.2], [6.84, zO - 6.36]]], 73);
      const wm = wandMaler(p, V, o, Z), wn = wandNacht(p, V, Z);
      const tr = seite === "ost" || seite === "west" ? (Z.dach === "zu" ? 0.45 : 0) : 0;
      wandFlaeche(M, "og-" + seite, geo[0], geo[1], Z_BL, geo[2], wm, { traufe: tr, danach: wn });
      /* solange das Dach offen ist: Innenseite und Wandkrone sichtbar */
      if (Z.dachOffen) innenFlaeche(M, "og-" + seite, geo[0], geo[1], n, 0.18, Z_BL, Object.assign({}, plan, { zOben: geo[2] }), V);
    }
    /* Fallrohre als echte Figur (Rundung stimmt in jedem Winkel) */
    if (Z.rohr && seite === "ost") M.figur({ x: EG_X + 0.07, y: EG_YS - 0.2, z: 0, breite: 1.4, hoehe: 7, schatten: false, malen: fallrohr(1) });
    if (Z.rohr && seite === "west") M.figur({ x: -EG_X - 0.07, y: EG_YS - 0.2, z: 0, breite: 1.4, hoehe: 7, schatten: false, malen: fallrohr(-1, Z.deko) });
  }
  /* Füllhölzer zwischen den Balkenköpfen: Profil mit Perlstab */
  function fuellholzMaler(V) {
    return function (g, F) {
      const c = hell(V.holz, -0.12);
      g.fillStyle = rgb(c); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      maserung(g, 0, 0, F.w, F.h, 3, F.h, 0.65);
      /* Profil: oben Kehle (dunkel), Mitte Wulst (hell), unten Perlstab */
      g.fillStyle = rgb(hell(c, -0.3)); g.fillRect(0, F.h * 0.18, F.w, F.h * 0.08);
      g.fillStyle = rgb(hell(c, 0.14)); g.fillRect(0, F.h * 0.3, F.w, F.h * 0.12);
      if (F.px > 30) {
        g.fillStyle = rgb(hell(c, 0.1));
        for (let x = 0.02; x < F.w; x += 0.05) { g.beginPath(); g.ellipse(x, F.h * 0.72, 0.018, 0.022, 0, 0, Math.PI * 2); g.fill(); }
        g.fillStyle = rgb(hell(c, -0.35));
        for (let x = 0.045; x < F.w; x += 0.05) g.fillRect(x - 0.003, F.h * 0.62, 0.006, F.h * 0.2);
      } else {
        g.fillStyle = rgb(hell(c, -0.2)); g.fillRect(0, F.h * 0.62, F.w, F.h * 0.2);
      }
      /* im Schatten der Auskragung */
      const gr = g.createLinearGradient(0, 0, 0, F.h);
      gr.addColorStop(0, "rgba(20,16,20,0.45)"); gr.addColorStop(1, "rgba(20,16,20,0.15)");
      g.fillStyle = gr; g.fillRect(0, 0, F.w, F.h);
    };
  }
  /* Balkenköpfe: eigene kleine Quader (Front + Seiten), mit Rundstab und
     Kerbschnitt an der Stirn */
  function kopfMaler(V, seite) {
    return function (g, F) {
      let c = hell(V.holz, (F.w * 13 % 1 - 0.5) * 0.12);
      /* Hirnholz vergraut an der Wetterseite schneller */
      if (seite === "stirn") c = misch(hell(c, 0.1), [150, 140, 126], 0.18);
      const gr = g.createLinearGradient(0, 0, 0, F.h);
      gr.addColorStop(0, rgb(hell(c, 0.06))); gr.addColorStop(0.7, rgb(c)); gr.addColorStop(1, rgb(hell(c, -0.25)));
      g.fillStyle = gr; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      if (seite === "stirn" && F.px > 14) {
        /* RUNDE 2: Hirnholz statt Langholz – Jahresringe als konzentrische
           Ellipsen um das außermittige Mark, dazu ein, zwei radiale
           Schwindrisse (der Balken ist vierhundert Jahre getrocknet) */
        const rr = ST.zufall(Math.round(F.w * 1000 + F.h * 77) + ST.textHash(F.name || ""));
        const mx = F.w * (0.3 + rr() * 0.4), my = F.h * (0.35 + rr() * 0.3), R = Math.max(F.w, F.h) * 0.95;
        const hg = g.createRadialGradient(mx, my, 0, mx, my, R);
        hg.addColorStop(0, rgb(hell(c, 0.1))); hg.addColorStop(1, rgb(hell(c, -0.12)));
        g.fillStyle = hg; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
        g.lineWidth = Math.max(0.003, 1.3 / F.px);
        const nR = 6 + Math.floor(rr() * 2);
        for (let i = 1; i <= nR; i++) {
          const q = R * i / nR, el = 0.85 + rr() * 0.15;
          g.strokeStyle = i % 2 ? rgb(hell(c, -0.38), 0.7) : rgb(hell(c, 0.2), 0.45);
          g.beginPath(); g.ellipse(mx + (rr() - 0.5) * 0.004, my, q, q * el, rr() * 0.3, 0, Math.PI * 2); g.stroke();
        }
        g.fillStyle = rgb(hell(c, -0.45)); g.beginPath(); g.arc(mx, my, 0.006, 0, Math.PI * 2); g.fill();
        /* Schwindrisse: vom Mark nach außen, spitz auslaufend */
        g.fillStyle = rgb(hell(c, -0.6), 0.85);
        const nRiss = 1 + (rr() < 0.5 ? 1 : 0);
        for (let i = 0; i < nRiss; i++) {
          const a = rr() * Math.PI * 2, l = R * (0.55 + rr() * 0.4), br = 0.004 + rr() * 0.003;
          const ex = mx + Math.cos(a) * l, ey = my + Math.sin(a) * l, qx = -Math.sin(a) * br, qy = Math.cos(a) * br;
          g.beginPath(); g.moveTo(mx + qx * 0.3, my + qy * 0.3); g.quadraticCurveTo(mx + Math.cos(a) * l * 0.4 + qx, my + Math.sin(a) * l * 0.4 + qy, ex, ey); g.quadraticCurveTo(mx + Math.cos(a) * l * 0.4 - qx, my + Math.sin(a) * l * 0.4 - qy, mx - qx * 0.3, my - qy * 0.3); g.fill();
        }
        /* Kanten der Stirn abgerundet (Kopf dunkler zum Rand) */
        const kg = g.createLinearGradient(0, 0, 0, F.h);
        kg.addColorStop(0, "rgba(255,248,230,0.16)"); kg.addColorStop(0.12, "rgba(255,248,230,0)"); kg.addColorStop(0.85, "rgba(30,20,14,0)"); kg.addColorStop(1, "rgba(30,20,14,0.3)");
        g.fillStyle = kg; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      } else if (F.px > 14) {
        maserung(g, 0, 0, F.w, F.h, 2, F.h, 0.65);
      }
    };
  }
  function balkenKoepfe(M, V, seite, winter, ebene) {
    const eb = ebene == null ? -1 : ebene;
    const stirn = kopfMaler(V, "stirn"), flanke = kopfMaler(V, "flanke");
    const kb = 0.2, z0 = Z_EG - 0.02, z1 = Z_BL;
    if (seite === "sued") {
      const xs = [-2.98, -2.35, -1.7, -1.05, -0.52, 0, 0.52, 1.05, 1.7, 2.35, 2.98];
      for (const x of xs) {
        const unterErker = x > ERKER.x0 && x < ERKER.x1;
        const y1 = unterErker ? ERKER.y + 0.06 : OG_YS;
        M.quader({ x: x - kb / 2, y: BL_YS - 0.02, z: z0, b: kb, t: y1 - BL_YS + 0.02, h: z1 - z0 }, { sued: stirn, ost: flanke, west: flanke }, { ebene: eb });
      }
    } else {
      const s = seite === "ost" ? 1 : -1;
      for (let y = OG_YS - 0.35; y > OG_YN + 0.3; y -= 0.82) {
        const x0 = s > 0 ? BL_X - 0.02 : -OG_X, x1 = s > 0 ? OG_X : -BL_X + 0.02;
        M.quader({ x: x0, y: y - kb / 2, z: z0, b: x1 - x0, t: kb, h: z1 - z0 }, s > 0 ? { ost: stirn, sued: flanke, nord: flanke } : { west: stirn, sued: flanke, nord: flanke }, { ebene: eb });
      }
    }
    void winter;
  }

  /* ---------------- Fallrohr (Figur, 3D gerechnet) ----------------
     Vom Rinnenstutzen im Schwanenhals zur Wand, am Obergeschoss hinab,
     Etagenbogen zur zurückliegenden Erdgeschosswand, unten Standrohr mit
     Auslauf. Zink, rund schattiert, Rohrschellen. */
  function fallrohr(s, tonne) {
    return function (g, px, F) {
      const gier = (F.gier || 0) * Math.PI / 180, c = Math.cos(gier), sn = Math.sin(gier);
      const P = (dx, dy, dz) => { const a = dx * c - dy * sn, b = dx * sn + dy * c; return [(a - b) * ST.KX * px, (a + b) * ST.KY * px - dz * ST.KZ * px]; };
      /* Punkte relativ zum Fußpunkt (EG-Wand + 7 cm) */
      const dOG = (OG_X - EG_X) * s;          // Versatz der OG-Wand
      const xR = (OG_X + UE_T + 0.06 - EG_X - 0.07) * s;
      const zE = walm(0, 0, 0).zE;
      /* Etagenbogen erst unter den Balkenköpfen: zwei 45°-Bögen mit kurzem
         Schrägstück, wie ihn der Klempner setzt */
      const zK = Z_EG - 0.08, zK2 = zK - Math.abs(dOG);
      const pfad = [[xR, 0, zE - 0.2], [xR, 0, zE - 0.32], [dOG, 0, zE - 0.62], [dOG, 0, zK], [0, 0, zK2]];
      const winter = F.jahr === "winter";
      if (tonne) pfad.push([0, 0, 1.1], [0.14 * s, -0.16, 0.96], [0.27 * s, -0.3, 0.88]);
      else if (winter) pfad.push([0, 0, 0.36], [0.1 * s, 0, 0.22]);           // Winter: der Auslauf steckt in der Wehe
      else pfad.push([0, 0, 0.34], [0.11 * s, 0, 0.17], [0.3 * s, 0, 0.13]);
      const r = 0.05;
      const pts = pfad.map((p) => P(p[0], p[1], p[2]));
      const breit = Math.max(1.2, r * 2 * px);
      if (F.schatten) return;
      const Z = F.Z || { amb: [0.6, 0.6, 0.7], sonne: [0.4, 0.4, 0.4] };
      const k = Math.min(1, Z.amb[1] + Z.sonne[1] * 0.5);
      const f = (v) => Math.round(v * k);
      /* Speier: flacher Sandstein mit Rinne, der das Wasser vom Sockel wegführt */
      if (!tonne && !winter && px > 6) {
        const sichtbar = (nx, ny) => nx * (c + sn) + ny * (c - sn) > 0;
        const q = (x, y, z) => P(x * s, y, z);
        const x0 = 0.18, x1 = 0.66, y0 = -0.13, y1 = 0.13, z1 = 0.07;
        const st = [168, 156, 134];
        /* Kontaktsaum: der Stein liegt im Boden, 1–2 cm dunkler Rand darunter */
        { const e = 0.02, b0 = q(x0 - e, y0 - e, 0), b1 = q(x1 + e, y0 - e, 0), b2 = q(x1 + e, y1 + e, 0), b3 = q(x0 - e, y1 + e, 0); g.fillStyle = "rgba(24,22,20,0.4)"; g.beginPath(); g.moveTo(b0[0], b0[1] + 0.012 * px); g.lineTo(b1[0], b1[1] + 0.012 * px); g.lineTo(b2[0], b2[1] + 0.012 * px); g.lineTo(b3[0], b3[1] + 0.012 * px); g.closePath(); g.fill(); }
        const fl = (pts2, kk) => { g.fillStyle = "rgb(" + f(st[0] * kk) + "," + f(st[1] * kk) + "," + f(st[2] * kk) + ")"; g.beginPath(); pts2.forEach((p2, i) => { if (i) g.lineTo(p2[0], p2[1]); else g.moveTo(p2[0], p2[1]); }); g.closePath(); g.fill(); };
        if (sichtbar(s, 0)) fl([q(x1, y0, 0), q(x1, y1, 0), q(x1, y1, z1), q(x1, y0, z1)], 0.78);
        if (sichtbar(0, 1)) fl([q(x0, y1, 0), q(x1, y1, 0), q(x1, y1, z1), q(x0, y1, z1)], 0.86);
        if (sichtbar(0, -1)) fl([q(x0, y0, 0), q(x1, y0, 0), q(x1, y0, z1), q(x0, y0, z1)], 0.72);
        fl([q(x0, y0, z1), q(x1, y0, z1), q(x1, y1, z1), q(x0, y1, z1)], 1.05);
        /* die Rinne im Stein */
        g.fillStyle = "rgba(" + f(80) + "," + f(72) + "," + f(62) + ",0.7)";
        const r0 = q(x0 + 0.02, -0.045, z1), r1 = q(x1, -0.045, z1), r2 = q(x1, 0.045, z1), r3 = q(x0 + 0.02, 0.045, z1);
        g.beginPath(); g.moveTo(r0[0], r0[1]); g.lineTo(r1[0], r1[1]); g.lineTo(r2[0], r2[1]); g.lineTo(r3[0], r3[1]); g.closePath(); g.fill();
        if (F.jahr === "winter") {
          const w0 = q(x0, y0, z1 + 0.02), w1 = q(x1, y0, z1 + 0.02), w2 = q(x1, y1, z1 + 0.02), w3 = q(x0, y1, z1 + 0.02);
          g.fillStyle = "rgba(236,242,250,0.9)"; g.beginPath(); g.moveTo(w0[0], w0[1]); g.lineTo(w1[0], w1[1]); g.lineTo(w2[0], w2[1]); g.lineTo(w3[0], w3[1]); g.closePath(); g.fill();
        }
      }
      /* Rohr mit runden Bögen: dunkle Kontur, Körper, Glanzlinie */
      g.lineJoin = "round"; g.lineCap = "round";
      const rad = Math.max(1, 0.09 * px);
      const linie = (farbe, bw, dx) => {
        g.strokeStyle = farbe; g.lineWidth = bw; g.beginPath();
        g.moveTo(pts[0][0] + dx, pts[0][1]);
        for (let i = 1; i < pts.length - 1; i++) g.arcTo(pts[i][0] + dx, pts[i][1], pts[i + 1][0] + dx, pts[i + 1][1], rad);
        g.lineTo(pts[pts.length - 1][0] + dx, pts[pts.length - 1][1]);
        g.stroke();
      };
      linie("rgb(" + f(70) + "," + f(74) + "," + f(78) + ")", breit + Math.max(0.8, px * 0.01), 0);
      linie("rgb(" + f(146) + "," + f(152) + "," + f(156) + ")", breit * 0.8, 0);
      if (px > 12) linie("rgba(235,240,242," + (0.55 * k) + ")", breit * 0.18, -breit * 0.2);
      /* Muffen an den Bögen: etwas dicker */
      if (px > 20) {
        g.strokeStyle = "rgb(" + f(96) + "," + f(100) + "," + f(104) + ")"; g.lineWidth = Math.max(1, px * 0.02);
        for (const i of [3, 4]) { const p0 = pts[i]; g.beginPath(); g.moveTo(p0[0] - breit * 0.58, p0[1] - (i === 3 ? 0.12 : -0.12) * px); g.lineTo(p0[0] + breit * 0.58, p0[1] - (i === 3 ? 0.12 : -0.12) * px); g.stroke(); }
      }
      /* Rohrschellen etwa alle 1,5 m, mit Stift zur Wand */
      if (px > 14) {
        const schellen = [];
        for (let z = zK + 0.45; z < zE - 0.75; z += 1.5) schellen.push([dOG, z]);
        for (let z = tonne ? 1.45 : 0.75; z < zK2 - 0.2; z += 1.5) schellen.push([0, z]);
        g.strokeStyle = "rgb(" + f(52) + "," + f(54) + "," + f(58) + ")";
        for (const [dx, z] of schellen) {
          const p0 = P(dx, 0, z), pw = P(dx - 0.07 * s, 0, z);
          g.lineWidth = Math.max(1, px * 0.012); g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(pw[0], pw[1]); g.stroke();
          g.lineWidth = Math.max(1, px * 0.025); g.beginPath(); g.moveTo(p0[0] - breit * 0.62, p0[1]); g.lineTo(p0[0] + breit * 0.62, p0[1]); g.stroke();
        }
      }
      /* Winter: um den Auslauf ein kleiner Schneehügel, der ihn einbettet */
      if (winter && !tonne) {
        const pe = pts[pts.length - 1], Zs = F.Z || { amb: [0.64, 0.68, 0.78], sonne: [0.4, 0.36, 0.28] };
        const sc = [0.93, 0.95, 0.99].map((c0, i) => Math.round(255 * c0 * Math.min(1.05, Zs.amb[i] + Zs.sonne[i] * 0.9)));
        g.fillStyle = "rgb(" + sc.join(",") + ")";
        g.beginPath(); g.ellipse(pe[0], pe[1] + 0.02 * px, 0.09 * px, 0.045 * px, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = "rgba(120,138,176,0.3)"; g.beginPath(); g.ellipse(pe[0] + 0.01 * px, pe[1] + 0.035 * px, 0.07 * px, 0.02 * px, 0, 0, Math.PI); g.fill();
      }
    };
  }

  /* =====================================================================
     ERKER: Fachwerkkasten auf fünf verlängerten Balken der Balkenlage,
     Kupferhaube mit Patina (Knaggen darunter würden das Ladenschild verdecken)
     ===================================================================== */
  function erker(M, V, o, winter, Z) {
    if (Z.og === "zu") knaggen(M, V);
    teil(M, "erker", ST_OG, N_S, 0.5);
    const { x0, x1, y, z0, z1 } = ERKER, yW = OG_YS;
    const zS = { s0: z0, s1: z0 + 0.16, r0: z1 - 0.2, r1: z1, brust: 4.62, sturz: 5.6 };
    const r = ST.zufall(V.saat * 5 + 3);
    const la = () => (r() < 0.75 ? 1 : 0);
    const oeffV = [
      { typ: "fenster", a0: 0.2, a1: 0.82, z0: 4.62, z1: 5.62, sp: [1, 3], fl: 1, kaempfer: false, licht: la(), bruestung: "rosette", tiefe: 0.07, gardine: true },
      { typ: "fenster", a0: 0.89, a1: 1.51, z0: 4.62, z1: 5.62, sp: [1, 3], fl: 1, kaempfer: false, licht: 1, bruestung: "rosette", tiefe: 0.07, stern: true },
      { typ: "fenster", a0: 1.58, a1: 2.2, z0: 4.62, z1: 5.62, sp: [1, 3], fl: 1, kaempfer: false, licht: 1, bruestung: "rosette", tiefe: 0.07, bogen: true }
    ];
    const fwV = fachwerk(x1 - x0, zS, oeffV, { eck: 0.16, pfosten: 0.07, mann: false });
    const planV = { name: "erker-v", w: x1 - x0, zOben: z1, zUnten: z0, zonen: [fwV], oeff: oeffV };
    const oeffS = [{ typ: "fenster", a0: 0.16, a1: 0.44, z0: 4.62, z1: 5.62, sp: [1, 3], fl: 1, kaempfer: false, licht: la(), tiefe: 0.06, gardine: false }];
    const fwS = fachwerk(y - yW, zS, oeffS, { eck: 0.12, pfosten: 0.06, mann: false });
    const planO = { name: "erker-o", w: y - yW, zOben: z1, zUnten: z0, zonen: [fwS], oeff: oeffS };
    const planW = { name: "erker-w", w: y - yW, zOben: z1, zUnten: z0, zonen: [fwS], oeff: oeffS };
    /* Der Erker ruht auf den fünf verlängerten Balken der Balkenlage. */
    for (const q of oeffV.concat(oeffS)) q.zeit = 0.915;
    if (!Z.og) return;
    if (Z.og !== "zu") {
      const zh = Z.ogHolz, zf = Z.og === "fachen" ? Z.ogFach : 0;
      const e1 = gerippeFlaeche(M, "erker-v", [x0, y], [x1, y], z0, planV, V, 0, zh, zf, 0.14); e1.ebene = 1;
      const e2 = gerippeFlaeche(M, "erker-o", [x1, y], [x1, yW], z0, planO, V, 1, zh, zf, 0.12); e2.ebene = 1;
      const e3 = gerippeFlaeche(M, "erker-w", [x0, yW], [x0, y], z0, planW, V, 3, zh, zf, 0.12); e3.ebene = 1;
      return;
    }
    wandFlaeche(M, "erker-v", [x0, y], [x1, y], z0, z1, wandMaler(planV, V, o, Z), { danach: wandNacht(planV, V, Z), ebene: 1 });
    wandFlaeche(M, "erker-o", [x1, y], [x1, yW], z0, z1, wandMaler(planO, V, o, Z), { danach: wandNacht(planO, V, Z), ebene: 1 });
    wandFlaeche(M, "erker-w", [x0, yW], [x0, y], z0, z1, wandMaler(planW, V, o, Z), { danach: wandNacht(planW, V, Z), ebene: 1 });
    if (!Z.haube) {
      /* Haube noch offen: Deckenbalken des Erkers von oben */
      M.flaeche({ name: "erker-oben", o: [x0, yW, z1], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y - yW, ebene: 2, malen: (g, F) => { g.fillStyle = rgb(hell(V.holz, 0.1)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); maserung(g, 0, 0, F.w, F.h, 2.4, 0.2, 0.6); } });
      return;
    }
    /* Haube: RUNDE 1 – geschweift wie im Harz: unten ein flacher Aufschiebling
       (25°), darüber steil (55°), als Walm gegen die Wand. Vorher war sie
       mit 40° flach und plastiktürkis. Grate im Grundriss unter 45°. */
    const ue = 0.12, e0 = x0 - ue, e1 = x1 + ue, ey = y + ue, zT = z1 - ue * 0.84;
    const tief = ey - yW, dL = 0.18, zB = zT + dL * Math.tan(25 * Math.PI / 180), zOben = zB + (tief - dL) * TA;
    const xi0 = e0 + tief, xi1 = e1 - tief;                  // Gratfüße an der Wand
    const deck = winter ? Z.schneeDeck : 0;
    /* RUNDE 2 (Kritik: „Klappflächen mit harten Graten", „Linsenflecken"):
       Das Kupfer bleibt Kupfer. Schnee liegt als eigene, dünne Schicht
       (6–8 cm) nur auf dem flachen Aufschiebling – mit welliger Oberkante,
       zur Traufe dicker, an den Graten schaut das Kupfer durch. Auf dem
       steilen Teil halten sich nur kleine Polster an den Stehfalzen, jedes
       mit 1 cm Eigenschatten darunter. */
    const haube = () => (g, F) => kupfer(g, F, -0.2, -0.2, F.w + 0.4, F.h + 0.4, 51 + Math.round(F.w * 10));
    const polster = (g, F) => {
      if (deck <= 0.5 || F.px < 14) return;
      const r = ST.zufall(ST.textHash(F.name) + 3), M2 = schneeMul(F), k = klemm((deck - 0.5) / 0.4, 0, 1);
      for (let sx = 0.02; sx < F.w; sx += 0.26) {
        if (r() < 0.45) continue;
        /* ein schmaler, langer Schneestreifen, der sich oberhalb am Falz
           staut: an den Enden spitz, in der Mitte 1,5–3 cm breit (vorher
           runde Klumpen – aus der Ferne „Linsenflecken") */
        const L = (0.1 + r() * 0.22) * (0.6 + 0.4 * k), cy = F.h * (0.3 + r() * 0.55), B = (0.015 + r() * 0.015) * k, x = sx - 0.004;
        const pts = [];
        for (let i = 0; i <= 6; i++) { const q = i / 6; pts.push([x - B * Math.sin(q * Math.PI) * (0.8 + r() * 0.4), cy - L / 2 + L * q]); }
        pts.push([x + 0.004, cy + L / 2 - 0.01], [x + 0.004, cy - L / 2 + 0.01]);
        g.beginPath(); glattPfad(g, pts, 0, 0.01); g.fillStyle = "rgba(24,48,44,0.36)"; g.fill();
        g.beginPath(); glattPfad(g, pts); g.fillStyle = schneeRGB(M2, 1.0); g.fill();
      }
    };
    const P = (x, yy, z) => [x, yy, z];
    /* unten (Aufschiebling) */
    polyFlaeche(M, "haube-vu", [P(e0, ey, zT), P(e1, ey, zT), P(e1 - dL, ey - dL, zB), P(e0 + dL, ey - dL, zB)], [0, 1, 1], haube(true), { ebene: 2 });
    polyFlaeche(M, "haube-ou", [P(e1, ey, zT), P(e1, yW, zT), P(e1 - dL, yW, zB), P(e1 - dL, ey - dL, zB)], [1, 0, 1], haube(true), { ebene: 2 });
    polyFlaeche(M, "haube-wu", [P(e0, yW, zT), P(e0, ey, zT), P(e0 + dL, ey - dL, zB), P(e0 + dL, yW, zB)], [-1, 0, 1], haube(true), { ebene: 2 });
    /* oben (steil) */
    polyFlaeche(M, "haube-vo", [P(e0 + dL, ey - dL, zB), P(e1 - dL, ey - dL, zB), P(xi1, yW, zOben), P(xi0, yW, zOben)], [0, 1, 1], haube(false), { ebene: 2, danach: polster });
    polyFlaeche(M, "haube-oo", [P(e1 - dL, ey - dL, zB), P(e1 - dL, yW, zB), P(xi1, yW, zOben)], [1, 0, 1], haube(false), { ebene: 2, danach: polster });
    polyFlaeche(M, "haube-wo", [P(e0 + dL, yW, zB), P(e0 + dL, ey - dL, zB), P(xi0, yW, zOben)], [-1, 0, 1], haube(false), { ebene: 2, danach: polster });
    /* Schneeschicht auf dem Aufschiebling: bilinear im Trapez, 4 cm über
       dem Kupfer, unten 3 cm Überhang, an den Graten 5 % eingerückt */
    if (deck > 0.3) {
      const kd = klemm((deck - 0.3) / 0.6, 0, 1);
      const schicht = (name, A, B, C, D2, aussen, sd) => {
        const r = ST.zufall(sd);
        const seite = Math.abs(aussen[0]) > 0.5, n = ST.norm(aussen), t = (seite ? 0.022 : 0.04) * kd;
        const Q = (sx, sy) => { const u0 = [A[0] + (B[0] - A[0]) * sx, A[1] + (B[1] - A[1]) * sx, A[2] + (B[2] - A[2]) * sx], u1 = [D2[0] + (C[0] - D2[0]) * sx, D2[1] + (C[1] - D2[1]) * sx, D2[2] + (C[2] - D2[2]) * sx]; return [u0[0] + (u1[0] - u0[0]) * sy + n[0] * t, u0[1] + (u1[1] - u0[1]) * sy + n[1] * t, u0[2] + (u1[2] - u0[2]) * sy + n[2] * t]; };
        /* Reihenfolge so, dass die ersten drei Punkte nicht auf einer Linie
           liegen (polyFlaeche rechnet daraus die Ebene) */
        const unten = [], oben = [];
        for (let i = 0; i <= 8; i++) unten.push(Q(0.05 + 0.9 * i / 8, seite ? -0.02 : -0.14));
        for (let i = 8; i >= 0; i--) oben.push(Q(0.05 + 0.9 * i / 8, klemm((0.5 + 0.3 * kd) + 0.12 * Math.sin(i * 1.9 + sd) + (r() - 0.5) * 0.1, 0.25, 0.95)));
        const pts = [unten[8]].concat(oben, unten.slice(0, 8));
        polyFlaeche(M, name, pts, aussen, (g, F) => {
          schneeFlaeche(g, F, -0.2, -0.2, F.w + 0.4, F.h + 0.4, sd);
        }, { ebene: 3, keinLicht: true });
      };
      schicht("haube-su", P(e0, ey, zT), P(e1, ey, zT), P(e1 - dL, ey - dL, zB), P(e0 + dL, ey - dL, zB), [0, 1, 1.8], 77);
      schicht("haube-suo", P(e1, ey, zT), P(e1, yW, zT), P(e1 - dL, yW, zB), P(e1 - dL, ey - dL, zB), [1, 0, 1.8], 78);
      schicht("haube-suw", P(e0, yW, zT), P(e0, ey, zT), P(e0 + dL, ey - dL, zB), P(e0 + dL, yW, zB), [-1, 0, 1.8], 79);
    }
    /* Traufkante der Haube: Kupferkante mit Wulst */
    const kante = (g, F) => { g.fillStyle = "rgb(84,116,100)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.fillStyle = "rgba(150,95,60,0.4)"; g.fillRect(-0.1, F.h * 0.5, F.w + 0.2, F.h * 0.5); g.fillStyle = "rgba(200,226,210,0.55)"; g.fillRect(-0.1, 0, F.w + 0.2, 0.012); };
    M.flaeche({ name: "haube-kv", o: [e0, ey, zT], u: [1, 0, 0], v: [0, 0, -1], w: e1 - e0, h: 0.05, malen: kante, ebene: 2 });
    M.flaeche({ name: "haube-ko", o: [e1, ey, zT], u: [0, -1, 0], v: [0, 0, -1], w: ey - yW, h: 0.05, malen: kante, ebene: 2 });
    M.flaeche({ name: "haube-kw", o: [e0, yW, zT], u: [0, 1, 0], v: [0, 0, -1], w: ey - yW, h: 0.05, malen: kante, ebene: 2 });
    if (deck > 0.5) {
      /* Schneekissen: höchstens 5–8 cm Überhang, an den Ecken rund, die
         Seitenkanten laufen zur Wand hin auf null aus */
      const k = klemm((deck - 0.5) / 0.4, 0, 1), hk = 0.05 + 0.05 * k;
      const sw = (g, F) => schneeWulst(g, F, F.w, F.h, 41);
      M.flaeche({ name: "haube-sv", o: [e0 + 0.02, ey + 0.035, zT + 0.05], u: [1, 0, 0], v: [0, 0, -1], w: e1 - e0 - 0.04, h: hk + 0.04, umriss: wechteUmriss(e1 - e0 - 0.04, hk, 5, 0.1), malen: sw, danach: schneeWulstDanach, ebene: 4, keinLicht: true });
      const lS = tief - 0.02;
      const seite = (sd) => { const r = ST.zufall(sd), pts = [[0, 0], [lS, 0]]; for (let i = 10; i >= 0; i--) { const t = i / 10; pts.push([lS * t, hk * Math.sin(Math.min(1, t * 1.6) * Math.PI / 2) * (0.75 + 0.25 * r())]); } return pts; };
      /* RUNDE 2: keine seitlichen Wulste mehr – sie standen bei 20° und 330°
         als dünne weiße Klingen über der Haubenkontur. Die Seiten deckt die
         Schneeschicht auf dem Aufschiebling mit ihrem eigenen Überhang. */
      void tief;
    }
    if (winter && Z.kette) ketteFiguren(M, [[e0 + 0.04, ey + 0.08, zT - 0.06], [e1 - 0.04, ey + 0.08, zT - 0.06]], 0.05, 81);
  }
  /* Knaggen: geschnitzte Kopfbänder unter den Erkerecken – vom
     Erdgeschoss-Ständer schräg hinauf unter die Balkenköpfe. Die Unterseite
     ist gekehlt (Schiffskehle), die Seiten tragen eine Kerbe. So wirkt der
     Erker getragen und hängt nicht auf fünf dünnen Hölzern. */
  function knaggen(M, V) {
    teil(M, "knaggen", ST_EG + 3.2, N_S, 0.9);
    const zU = 2.92, zO = Z_EG - 0.02, yWand = EG_YS, yVorn = ERKER.y - 0.08, d = 0.08;
    const c = hell(V.holz, 0.1);
    const profil = [];
    /* Profil in (y, z): Wand unten → Wand oben → vorn oben → Kehle zurück */
    /* kräftiger Körper: vorn eine 0,14 m hohe Nase, darunter die Kehle */
    profil.push([yWand, zU], [yWand, zO], [yVorn, zO], [yVorn, zO - 0.14]);
    for (let i = 1; i <= 6; i++) { const t = i / 6; profil.push([yVorn - (yVorn - yWand - 0.1) * t, zO - 0.14 - (zO - 0.14 - zU) * Math.pow(t, 0.7) + Math.sin(t * Math.PI) * 0.05]); }
    const seiteMal = (g, F) => {
      g.fillStyle = rgb(c); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      maserung(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, 1.2, 0.2, 0.7);
      if (F.px > 18) {
        /* Kerbschnitt: kleine Dreiecke entlang der Kehle */
        g.fillStyle = rgb(hell(c, -0.45));
        for (let t = 0.2; t < 0.9; t += 0.18) { const x = F.w * t, y0 = F.h * (0.22 + t * 0.35); g.beginPath(); g.moveTo(x - 0.03, y0); g.lineTo(x + 0.03, y0); g.lineTo(x, y0 + 0.05); g.closePath(); g.fill(); }
      }
      const gr = g.createLinearGradient(0, 0, 0, F.h); gr.addColorStop(0, "rgba(0,0,0,0.25)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
    };
    const unterMal = (g, F) => { g.fillStyle = rgb(hell(c, -0.12)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); maserung(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, 1.2, 0.2, 0.6); g.fillStyle = rgb(hell(c, 0.15)); g.fillRect(-0.1, F.h / 2 - 0.01, F.w + 0.2, 0.02); };
    for (const xc of [ERKER.x0 + 0.09, ERKER.x1 - 0.09]) {
      for (const sx of [-1, 1]) polyFlaeche(M, "knagge-s", profil.map(([yy, z]) => [xc + sx * d, yy, z]), [sx, 0, 0], seiteMal, { ebene: 0 });
      for (let i = 2; i < profil.length; i++) {
        const a = profil[i], b = profil[(i + 1) % profil.length];
        polyFlaeche(M, "knagge-u", [[xc - d, a[0], a[1]], [xc + d, a[0], a[1]], [xc + d, b[0], b[1]], [xc - d, b[0], b[1]]], [0, 1, -1], unterMal, { ebene: 1 });
      }
    }
  }

  /* =====================================================================
     DACH: Krüppelwalm mit Biberschwanz, Giebel, Ortgang, Schnee
     ===================================================================== */
  /* Eckpunkte des Walmdachs; t = Anhebung (Schneeschicht), ext = Überstand-Zugabe */
  function walm(t, extT, extG) {
    const zR = Z_FI + t / CA, zK = Z_K + t / CB;
    /* Knick: Schnitt der (um t angehobenen) Hauptebene mit der ebenso
       angehobenen Aufschieblingsebene */
    const zKn0 = Z_FI - X_KN * TA;
    const xK = (zKn0 + t / CAU + X_KN * TAU - zR) / (TAU - TA), zKn = zR - xK * TA;
    const xE = OG_X + UE_T + extT, zE = zKn - (xE - xK) * TAU;
    const yS = GI_YS + UE_G + extG, yN = GI_YN - UE_G - extG;
    const yRS = GI_YS - (zR - zK) / TB, yRN = GI_YN + (zR - zK) / TB;
    const zGS = zK - (yS - GI_YS) * TB, zGN = zK - (GI_YN - yN) * TB;
    const xGS = (zR - zGS) / TA, xGN = (zR - zGN) / TA;
    return { zR, zK, xK, zKn, xE, zE, yS, yN, yRS, yRN, zGS, zGN, xGS, xGN };
  }
  /* Höhe der Dachoberfläche über dem Abstand x von der Firstlinie */
  function dachZx(D, x) { x = Math.abs(x); return x <= D.xK ? D.zR - x * TA : D.zKn - (x - D.xK) * TAU; }
  /* Die vier Walmflächen. mal(art) / danach(art) liefern je Fläche den Maler */
  function dachFlaechen(M, D, mal, ebene, namePre, danach, opt) {
    const h = D.xK / CA, w = D.yS - D.yN, hA = (D.xE - D.xK) / CAU;
    const dn = (art) => (danach ? danach(art) : undefined);
    const ex = opt || {};
    /* Aufschiebling Ost und West (vom Knick zur Traufe) */
    M.flaeche(Object.assign({ name: namePre + "auf-ost", o: [D.xK, D.yS, D.zKn], u: [0, -1, 0], v: [CAU, 0, -SAU], w: w, h: hA, dach: true, ebene: ebene,
      malen: mal("auf-ost"), danach: dn("auf-ost") }, ex));
    M.flaeche(Object.assign({ name: namePre + "auf-west", o: [-D.xK, D.yN, D.zKn], u: [0, 1, 0], v: [-CAU, 0, -SAU], w: w, h: hA, dach: true, ebene: ebene,
      malen: mal("auf-west"), danach: dn("auf-west") }, ex));
    /* Ost */
    M.flaeche(Object.assign({ name: namePre + "ost", o: [0, D.yS, D.zR], u: [0, -1, 0], v: [CA, 0, -SA], w: w, h: h, dach: true, ebene: ebene,
      umriss: [[D.yS - D.yRS, 0], [0, D.xGS / CA], [0, h], [w, h], [w, D.xGN / CA], [D.yS - D.yRN, 0]], malen: mal("ost"), danach: dn("ost") }, ex));
    /* West */
    M.flaeche(Object.assign({ name: namePre + "west", o: [0, D.yN, D.zR], u: [0, 1, 0], v: [-CA, 0, -SA], w: w, h: h, dach: true, ebene: ebene,
      umriss: [[D.yRN - D.yN, 0], [0, D.xGN / CA], [0, h], [w, h], [w, D.xGS / CA], [D.yRS - D.yN, 0]], malen: mal("west"), danach: dn("west") }, ex));
    /* Schopf Süd und Nord */
    const hs = (D.yS - D.yRS) / CB, hn = (D.yRN - D.yN) / CB;
    M.flaeche(Object.assign({ name: namePre + "schopf-s", o: [-D.xGS, D.yRS, D.zR], u: [1, 0, 0], v: [0, CB, -SB], w: 2 * D.xGS, h: hs, dach: true, ebene: ebene,
      umriss: [[D.xGS, 0], [2 * D.xGS, hs], [0, hs]], malen: mal("schopf-s"), danach: dn("schopf-s") }, ex));
    M.flaeche(Object.assign({ name: namePre + "schopf-n", o: [D.xGN, D.yRN, D.zR], u: [-1, 0, 0], v: [0, -CB, -SB], w: 2 * D.xGN, h: hn, dach: true, ebene: ebene,
      umriss: [[D.xGN, 0], [2 * D.xGN, hn], [0, hn]], malen: mal("schopf-n"), danach: dn("schopf-n") }, ex));
  }
  function dach(M, V, o, winter, P, Z) {
    winter = winter && Z.schneeDeck > 0;
    /* RUNDE 2: Der Kern nimmt für den Bodenschatten jedes Teils zusätzlich
       ALLE Eckpunkte senkrecht auf den Boden – beim Dach landete so der
       Überstand als Schattenstreifen auch vor sonnigen Wänden. Das Dach wirft
       deshalb keinen eigenen Schatten; das übernimmt der Schattenkörper. */
    M._kern = teil(M, "dach", ST_DACH, null, 0, { schatten: false });
    const D = walm(0, 0, 0);
    /* --- Giebel (Fachwerk bis unter den Schopf) --- */
    const gS = P.giS, gN = P.giN;
    if (Z.giebel === "gerippe" || Z.giebel === "fachen") {
      const zf = Z.giebel === "fachen" ? Z.giebelFach : 0;
      /* Der Südgiebel steht mit dem ersten Gespärre, der Nordgiebel erst mit
         dem letzten – sonst ragen im Norden lose Giebelständer in die Luft */
      const gz = (a, b) => klemm((Z.bau - a) / (b - a), 0, 1);
      gerippeFlaeche(M, "giebel-sued", [-OG_X, GI_YS], [OG_X, GI_YS], Z_T, gS, V, 0, gz(0.735, 0.772), zf, 0.18);
      gerippeFlaeche(M, "giebel-nord", [OG_X, GI_YN], [-OG_X, GI_YN], Z_T, gN, V, 2, gz(0.765, 0.797), zf, 0.18);
    } else if (Z.giebel === "zu") {
      const gsM = wandMaler(Object.assign({}, gS, { deko: (g, F) => { if (Z.dach === "zu") ortSchatten(g, F, gS); } }), V, o, Z);
      M.flaeche({ name: "giebel-sued", o: [-OG_X, GI_YS, Z_K], u: [1, 0, 0], v: [0, 0, -1], w: gS.w, h: Z_K - Z_T, umriss: gS.umriss, malen: gsM, danach: wandNacht(gS, V, Z), ebene: 0 });
      const gnM = wandMaler(Object.assign({}, gN, { deko: (g, F) => { if (Z.dach === "zu") ortSchatten(g, F, gN); } }), V, o, Z);
      M.flaeche({ name: "giebel-nord", o: [OG_X, GI_YN, Z_K], u: [-1, 0, 0], v: [0, 0, -1], w: gN.w, h: Z_K - Z_T, umriss: gN.umriss, malen: gnM, danach: wandNacht(gN, V, Z), ebene: 0 });
      /* Aufzugsbalken über der Ladeluke: mit Rolle und Haken, wie an den
         alten Kaufmannshäusern in Goslar */
      {
        const holzF = (g, F) => { g.fillStyle = rgb(hell(V.holz, 0.06)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); maserung(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, 1.5, 0.16, 0.6); };
        const stirnF = (g, F) => { g.fillStyle = rgb(misch(V.holz, [150, 145, 135], 0.35)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); };
        /* RUNDE 2: eigener Teil an der Nordseite – als Figur im Dachteil
           wurden Rolle und Haken NACH allen Dachflächen gemalt und lagen bei
           Blick von Süden mitten auf dem Dach */
        const altT = M.akt;
        teil(M, "aufzug", ST_DACH, N_N, 0.5);
        kasten(M, -0.08, GI_YN - 0.72, 9.98, 0.08, GI_YN, 10.14, { nord: stirnF, ost: holzF, west: holzF, oben: winter ? null : holzF });
        if (winter) M.flaeche({ name: "aufzug-schnee", o: [-0.09, GI_YN - 0.73, 10.17], u: [1, 0, 0], v: [0, 1, 0], w: 0.18, h: 0.73, keinLicht: true, malen: (g, F) => schneeFlaeche(g, F, -0.1, -0.1, F.w + 0.2, F.h + 0.2, 7) });
        M.figur({ x: 0, y: GI_YN - 0.6, z: 9.98, breite: 0.4, hoehe: 0.2, schatten: false, malen: (g, s, F) => {
          const dunkel = F.schatten ? "#000" : "#23201d";
          g.strokeStyle = dunkel; g.fillStyle = dunkel; g.lineWidth = Math.max(0.6, 0.02 * s);
          g.beginPath(); g.arc(0, 0.02 * s, 0.05 * s, 0, Math.PI * 2); g.stroke();
          g.strokeStyle = F.schatten ? "#000" : "#8a7458"; g.lineWidth = Math.max(0.5, 0.012 * s);
          g.beginPath(); g.moveTo(0.05 * s, 0.02 * s); g.lineTo(0.05 * s, 0.55 * s); g.stroke();
          g.strokeStyle = dunkel; g.beginPath(); g.arc(0.05 * s, 0.6 * s, 0.035 * s, -Math.PI / 2, Math.PI * 0.9); g.stroke();
        } });
        M.akt = altT;
      }
      if (Z.dachOffen) {
        innenFlaeche(M, "giebel-sued", [-OG_X, GI_YS], [OG_X, GI_YS], N_S, 0.18, Z_T, gS, V);
        innenFlaeche(M, "giebel-nord", [OG_X, GI_YN], [-OG_X, GI_YN], N_N, 0.18, Z_T, gN, V);
      }
    }
    /* Kehlbalken im offenen Dachstuhl */
    if (Z.dach === "stuhl" && Z.kehl > 0) {
      const zK = 9.25, xK = (Z_FI - zK) / TA - 0.05;
      const bl = [];
      for (let y = D.yRN + 0.2; y < D.yRS - 0.1; y += 0.8) bl.push([-xK, y, xK, y, 0.16]);
      balkenlage(M, "kehlbalken", zK, [-xK, D.yRN, xK, D.yRS], bl, 0.2, Z.kehl, 0, V, "x");
      M.akt.flaechen[M.akt.flaechen.length - 1].ebene = 1;
    }
    if (!(Z.dachbalken > 0)) return;
    /* Dachbalkenlage Süd: Füllholz und Köpfe der Giebelauskragung */
    M.flaeche({ name: "dbl-sued", o: [-OG_X, GI_YS - 0.08, Z_T], u: [1, 0, 0], v: [0, 0, -1], w: 2 * OG_X, h: Z_T - Z_OG, malen: fuellholzMaler(V), ebene: -2 });
    M.flaeche({ name: "dbl-sued-o", o: [OG_X, GI_YS - 0.08, Z_T], u: [0, -1, 0], v: [0, 0, -1], w: GI_YS - 0.08 - OG_YS, h: Z_T - Z_OG, malen: fuellholzMaler(V), ebene: -2 });
    M.flaeche({ name: "dbl-sued-w", o: [-OG_X, OG_YS, Z_T], u: [0, 1, 0], v: [0, 0, -1], w: GI_YS - 0.08 - OG_YS, h: Z_T - Z_OG, malen: fuellholzMaler(V), ebene: -2 });
    const stirn = kopfMaler(V, "stirn"), flanke = kopfMaler(V, "flanke");
    for (let x = -OG_X + 0.25; x < OG_X - 0.1; x += 0.62) M.quader({ x: x - 0.09, y: OG_YS, z: Z_OG - 0.02, b: 0.18, t: GI_YS - OG_YS, h: Z_T - Z_OG + 0.02 }, { sued: stirn, ost: flanke, west: flanke }, { ebene: -1 });

    /* --- Dachflächen --- */
    const saatD = V.saat * 3 + 11;
    const ART_SAAT = { ost: 1, west: 2, "schopf-s": 3, "schopf-n": 4, "auf-ost": 5, "auf-west": 6 };
    if (Z.dach !== "zu") return;
    if (!winter) {
      /* Frühling: Biberschwanz mit Moos auf der Wetterseite (West, Nord),
         First- und Gratziegel, Schatten von Kamin und Gauben, Zinkverwahrung
         am Kamin, Schneefanggitter über den Traufen */
      const flMal = (art) => (g, F) => {
        biberschwanz(g, F, -0.2, -0.2, F.w + 0.4, F.h + 0.4, saatD + ART_SAAT[art] * 17, {});
        dachAlterung(g, F, art, D, saatD + ART_SAAT[art] * 17, /west|schopf-n/.test(art) ? 1 : 0.4);
        if (!/auf/.test(art)) firstBett(g, F);
        aufbautenSchatten(g, F, art, D, "rgba(30,12,10,0.32)");
        for (const A of dachAufbauten(art, D)) if (A.art === "kamin") kaminFuss(g, F, A.fuss, false, saatD + 5);
        if (art === "ost" || art === "west") schneefang(g, F, F.w, F.h - 0.45, false, (c) => rgb(c), null);
      };
      dachFlaechen(M, D, flMal, 2, "dach-");
      firstKappen(M, D, false, V);
    }
    /* --- Kanten: Ortgang (Windbretter), Traufbretter, Schopfkante --- */
    const brett = (g, F) => {
      const c = hell(V.holz, 0.05);
      g.fillStyle = rgb(c); g.fillRect(-0.2, -0.2, F.w + 0.4, F.h + 0.4);
      maserung(g, -0.2, -0.2, F.w + 0.4, F.h + 0.4, 3, 0.3, 0.65);
      /* Ziegel-Ortgang oben: die Ziegelkante sichtbar – im Winter liegt dort
         Schnee (RUNDE 2: vorher ragten rote Stummel aus dem Schnee) */
      if (winter) { g.fillStyle = "rgb(226,232,242)"; g.fillRect(-0.2, -0.2, F.w + 0.4, 0.26); }
      else { g.fillStyle = "rgb(128,56,40)"; g.fillRect(-0.2, -0.2, F.w + 0.4, 0.25); }
      g.fillStyle = "rgba(30,12,8,0.35)"; g.fillRect(-0.2, 0.04, F.w + 0.4, 0.015);
    };
    const d = D_DACH;
    for (const [yK, sg, zG, xG, nm] of [[D.yS, 1, D.zGS, D.xGS, "s"], [D.yN, -1, D.zGN, D.xGN, "n"]]) {
      const u = [sg, 0, 0];
      /* Ortgang rechts/links (von außen gesehen) */
      const xa = sg > 0 ? xG : -xG, xb = sg > 0 ? D.xE : -D.xE;
      /* Windbrett mit Knick am Aufschiebling */
      const aK = D.xK - xG, aE = D.xE - xG, zKk = zG - D.zKn, zEk = zG - D.zE;
      M.flaeche({ name: "ort-" + nm + "1", o: [xa, yK, zG], u: u, v: [0, 0, -1], w: aE, h: zEk + d, umriss: [[0, 0], [aK, zKk], [aE, zEk], [aE, zEk + d], [aK, zKk + d], [0, d]], malen: brett, ebene: 1 });
      M.flaeche({ name: "ort-" + nm + "2", o: [-xb, yK, zG], u: u, v: [0, 0, -1], w: aE, h: zEk + d, umriss: [[0, zEk], [aE - aK, zKk], [aE, 0], [aE, d], [aE - aK, zKk + d], [0, zEk + d]], malen: brett, ebene: 1 });
      M.flaeche({ name: "ort-" + nm + "3", o: [-xa, yK, zG], u: u, v: [0, 0, -1], w: 2 * xG, h: d, malen: brett, ebene: 1 });
      void xb;
    }
    M.flaeche({ name: "traufe-o", o: [D.xE, D.yS, D.zE], u: [0, -1, 0], v: [0, 0, -1], w: D.yS - D.yN, h: d, malen: brett, ebene: 1 });
    M.flaeche({ name: "traufe-w", o: [-D.xE, D.yN, D.zE], u: [0, 1, 0], v: [0, 0, -1], w: D.yS - D.yN, h: d, malen: brett, ebene: 1 });
    untersichten(M, V, D);

    if (winter) {
      /* --- Schnee als echte Schicht über den Ziegeln ---
         Die Schicht wächst in der Bauphase 0,90–0,98 (deck 0 → 1): Dicke,
         Überstand und Deckung nehmen zu, die Ziegel darunter sind Teil
         derselben Fläche (so gibt es keinen Sprung von Rot auf Weiß). */
      const deck = Z.schneeDeck;
      const S = walm(0.1 * deck, 0.07 * deck, 0.03 * deck);
      const info = (art) => ({ art: art, D: S, deck: deck, saat: saatD + ART_SAAT[art] * 17 });
      dachFlaechen(M, S, (art) => schneeDachMalen(info(art)), 4, "schnee-", (art) => schneeDachDanach(info(art)), { keinLicht: true });
      if (deck >= 0.999) firstKappen(M, S, true, V); else firstKappen(M, D, false, V);
      if (deck > 0.3) {
        /* Schneekante am Ortgang: 0,15–0,2 m sichtbare Dicke mit kleinen Abbrüchen */
        const kd = klemm((deck - 0.3) / 0.5, 0, 1);
        const wu = (g, F) => schneeWulst(g, F, F.w, F.h, 17 + Math.round(F.w * 10));
        for (const [yK, sg, nm] of [[S.yS, 1, "s"], [S.yN, -1, "n"]]) {
          const zG = sg > 0 ? S.zGS : S.zGN, xG = sg > 0 ? S.xGS : S.xGN;
          const dz = (0.1 * deck) / CA + 0.05;
          const L = S.xE - xG, fall = zG - S.zE;
          const kante = (von, bis, saat) => {
            /* oben die Schneeoberkante (Schräge), unten ein unregelmäßiger Rand */
            const r = ST.zufall(saat), pts = [];
            const n = Math.max(4, Math.round(L / 0.08));
            for (let i = 0; i <= n; i++) { const a = L * i / n; pts.push([a, von + (bis - von) * i / n]); }
            for (let i = n; i >= 0; i--) {
              const a = L * i / n; let t = 0.7 + 0.3 * r();
              if (r() < 0.07) t *= 0.5;
              pts.push([a, von + (bis - von) * i / n + dz * t * kd]);
            }
            return pts;
          };
          M.flaeche({ name: "sort-" + nm + "1", o: [sg > 0 ? xG : -xG, yK, zG], u: [sg, 0, 0], v: [0, 0, -1], w: L, h: fall + dz, umriss: kante(0, fall, 31 + sg), malen: wu, danach: schneeWulstDanach, ebene: 5, keinLicht: true });
          M.flaeche({ name: "sort-" + nm + "2", o: [sg > 0 ? -S.xE : S.xE, yK, zG], u: [sg, 0, 0], v: [0, 0, -1], w: L, h: fall + dz, umriss: kante(fall, 0, 37 + sg), malen: wu, danach: schneeWulstDanach, ebene: 5, keinLicht: true });
          /* Schopftraufe: kleiner Wulst, 0,18 m, läuft an den Enden aus */
          const hs = (0.08 + 0.12 * kd);
          M.flaeche({ name: "sort-" + nm + "3", o: [sg > 0 ? -xG : xG, yK + sg * 0.02, zG + 0.01], u: [sg, 0, 0], v: [0, 0, -1], w: 2 * xG, h: hs, umriss: wulstUmriss(2 * xG, hs, 9 + sg, null, 0.12), malen: wu, danach: schneeWulstDanach, ebene: 5, keinLicht: true });
          if (deck > 0.85) M.flaeche({ name: "eis-" + nm, o: [sg > 0 ? -xG + 0.15 : xG - 0.15, yK - sg * 0.02, zG - hs * 0.6], u: [sg, 0, 0], v: [0, 0, -1], w: 2 * xG - 0.3, h: 0.35, keinLicht: true, malen: eiszapfenMaler(51 + sg, 0.28 * klemm((deck - 0.85) / 0.15, 0, 1)), ebene: 6 });
        }
      }
      /* Lichterkette entlang der Giebel-Ortgänge (Süd) */
      if (Z.kette) lichterketteOrt(M, D);
    }
  }
  /* Untersicht der Dachüberstände: unter dem Ortgang (vom Giebel bis zur
     Dachkante) und an der Traufe (von der Wand bis zur Traufe). Sonst
     schaut man bei flachem Blick zwischen Giebelwand und Windbrett
     hindurch. Dunkles Holz mit Sparrenköpfen alle 0,8 m. */
  function untersichten(M, V, D) {
    const holz = (g, F) => {
      const c = hell(V.holz, -0.1);
      g.fillStyle = rgb(c); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      maserung(g, 0, 0, F.w, F.h, 2.6, 0.2, 0.5);
      g.fillStyle = rgb(hell(c, -0.35));
      for (let a = 0.3; a < F.w; a += 0.8) g.fillRect(a, 0, 0.12, F.h);
      g.fillStyle = "rgba(10,8,10,0.35)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
    };
    /* Ortgang Süd/Nord, je zwei Schrägen; Normale zeigt nach unten-außen */
    for (const [yW, yK, sg] of [[GI_YS, D.yS, 1], [GI_YN, D.yN, -1]]) {
      const zG = sg > 0 ? D.zGS : D.zGN, xG = sg > 0 ? D.xGS : D.xGN;
      /* zwei Stücke: steil bis zum Knick, flach am Aufschiebling */
      for (const [xa, za, xb, zb, k] of [[xG, zG, D.xK, D.zKn, "1"], [D.xK, D.zKn, D.xE, D.zE, "2"]]) {
        const L = Math.hypot(xb - xa, za - zb);
        for (const s of [1, -1]) {
          const p0 = [s * xa, yW, za - D_DACH], u = [s * (xb - xa) / L, 0, (zb - za) / L];
          const v = [0, yK - yW, 0];
          /* Normale u × v muss nach unten zeigen */
          const n = ST.kreuz(u, v);
          const f = n[2] < 0 ? { o: p0, u: u, v: v } : { o: [s * xb, yW, zb - D_DACH], u: [-u[0], 0, -u[2]], v: v };
          M.flaeche({ name: "unter-" + (sg > 0 ? "s" : "n") + (s > 0 ? "o" : "w") + k, o: f.o, u: f.u, v: f.v, w: L, h: Math.abs(yK - yW), malen: holz, ebene: 0 });
        }
      }
    }
    /* Traufe Ost/West: von der Wand (OG_X) zur Traufe (xE), unter dem Aufschiebling */
    for (const s of [1, -1]) {
      const zW = dachZx(D, OG_X) - D_DACH, zE = D.zE - D_DACH;
      const L = Math.hypot(D.xE - OG_X, zW - zE);
      const u = [0, -s, 0], v = [s * (D.xE - OG_X) / L, 0, (zE - zW) / L];
      const n = ST.kreuz(u, v);
      const f = n[2] < 0 ? { o: [s * OG_X, s > 0 ? D.yS : D.yN, zW], u: u } : { o: [s * OG_X, s > 0 ? D.yN : D.yS, zW], u: [0, s, 0] };
      M.flaeche({ name: "unter-t" + s, o: f.o, u: f.u, v: v, w: D.yS - D.yN, h: L, malen: holz, ebene: 0 });
    }
  }
  /* Schatten des Dachüberstands auf dem Giebel (entlang der Schrägen) */
  function ortSchatten(g, F, plan) {
    const sv = F.schatten(UE_G + 0.05);
    const um = plan.umriss;
    g.save();
    g.fillStyle = "rgba(30,26,34,0.34)";
    const d = sv || [0, 0.18];
    g.beginPath();
    g.moveTo(um[3][0], um[3][1]); g.lineTo(um[0][0], um[0][1]); g.lineTo(um[1][0], um[1][1]); g.lineTo(um[2][0], um[2][1]);
    g.lineTo(um[2][0] + d[0], um[2][1] + d[1] + 0.12); g.lineTo(um[1][0] + d[0], um[1][1] + d[1] + 0.12); g.lineTo(um[0][0] + d[0], um[0][1] + d[1] + 0.12); g.lineTo(um[3][0] + d[0], um[3][1] + d[1] + 0.12);
    g.closePath(); g.fill();
    g.restore();
  }

  /* ---------------- Lichterkette ----------------
     Birnchen alle 0,3 m an einem dunklen Kabel, das zwischen Haken (alle
     0,6 m) 6–10 cm durchhängt. RUNDE 1: vorher saß alle 10 cm eine Birne –
     nachts verschmolz die Kette zu einem Neonschlauch. Jetzt: heller Kern,
     kleiner Hof (0,12 m), dunkler Draht dazwischen; höchstens ein
     Lichtschein je Meter. */
  /* ---------------- Lichterkette als Punkte im Raum ----------------
     RUNDE 2 (Kritik: bei 135° und 315° hing am ganzen Haus kein Birnchen):
     Vorher lag jede Kette in einer senkrechten Fläche – genau längs der
     Traufe gesehen stand die Fläche auf der Kante und verschwand. Jetzt ist
     jede Birne ein Punkt im Raum: der Weg der Kette (Haken alle 0,6 m) wird
     als Figuren von je gut einem Meter gebaut, der Draht hängt dazwischen
     durch. So sieht man sie aus jedem Winkel. */
  function ketteFiguren(M, weg, durch, saat) {
    const r = ST.zufall(saat);
    const hk = [];
    for (let i = 0; i < weg.length - 1; i++) {
      const A = weg[i], B = weg[i + 1], L = Math.hypot(B[0] - A[0], B[1] - A[1], B[2] - A[2]), n = Math.max(1, Math.round(L / 0.6));
      for (let k = 0; k < n; k++) hk.push([A[0] + (B[0] - A[0]) * k / n, A[1] + (B[1] - A[1]) * k / n, A[2] + (B[2] - A[2]) * k / n]);
    }
    hk.push(weg[weg.length - 1]);
    /* je zwei Haken-Abstände eine Figur */
    for (let i = 0; i < hk.length - 1; i += 2) {
      const stueck = hk.slice(i, Math.min(hk.length, i + 3));
      const m = stueck[Math.floor(stueck.length / 2)];
      const rel = stueck.map((p) => [p[0] - m[0], p[1] - m[1], p[2] - m[2]]);
      const hell = rel.slice(0, -1).map(() => [0.85 + r() * 0.3, 0.85 + r() * 0.3]);
      M.figur({ x: m[0], y: m[1], z: m[2], breite: 1.6, hoehe: 0.3, schatten: false, malen: kettenStueck(rel, durch, hell) });
    }
  }
  function kettenStueck(rel, durch, hellig) {
    return function (g, s, F) {
      if (F.schatten) return;
      const gier = (F.gier || 0) * Math.PI / 180, c = Math.cos(gier), sn = Math.sin(gier);
      const P = (p) => { const x = p[0] * c - p[1] * sn, y = p[0] * sn + p[1] * c; return [(x - y) * ST.KX * s, (x + y) * ST.KY * s - p[2] * ST.KZ * s]; };
      const nacht = F.nacht || 0;
      const zw = (A, B, t) => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t - durch * 4 * t * (1 - t)];
      g.lineCap = "round";
      /* Draht: nachts eine feine dunkle Linie, tags dunkelgrün und halb
         durchsichtig, unter 25 px/m gar nicht */
      if (s >= 25 || nacht > 0.01) {
        g.strokeStyle = nacht > 0.01 ? "rgba(20,22,20,0.8)" : "rgba(30,54,34,0.5)";
        g.lineWidth = Math.max(0.6, 0.006 * s);
        g.beginPath();
        for (let i = 0; i < rel.length - 1; i++) for (let k = 0; k <= 8; k++) { const q = P(zw(rel[i], rel[i + 1], k / 8)); if (!i && !k) g.moveTo(q[0], q[1]); else g.lineTo(q[0], q[1]); }
        g.stroke();
      }
      const Zt = F.Z || { amb: [0.64, 0.68, 0.78], sonne: [0.4, 0.36, 0.28] }, li = Math.min(1, Zt.amb[1] + Zt.sonne[1] * 0.8);
      const rB = Math.max(0.9, 0.018 * s);
      for (let i = 0; i < rel.length - 1; i++) {
        [0.25, 0.75].forEach((t, j) => {
          const q = P(zw(rel[i], rel[i + 1], t)); q[1] += 0.03 * s;
          const k = hellig[i][j];
          if (nacht > 0.01) {
            const R = 0.11 * s;
            const gr = g.createRadialGradient(q[0], q[1], 0, q[0], q[1], R);
            gr.addColorStop(0, "rgba(255,244,210," + Math.min(1, nacht * k).toFixed(3) + ")"); gr.addColorStop(0.25, "rgba(255,196,110," + (0.5 * nacht * k).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,170,80,0)");
            g.fillStyle = gr; g.fillRect(q[0] - R, q[1] - R, 2 * R, 2 * R);
            g.fillStyle = "rgba(255,250,232," + Math.min(1, 0.7 + 0.3 * k).toFixed(2) + ")";
          } else g.fillStyle = "rgb(" + [226, 230, 222].map((v) => Math.round(v * li * (0.92 + 0.08 * k))).join(",") + ")";
          g.beginPath(); g.ellipse(q[0], q[1], rB * 0.75, rB, 0, 0, Math.PI * 2); g.fill();
          if (nacht <= 0.01 && s > 40) { g.fillStyle = "rgba(255,255,255,0.8)"; g.beginPath(); g.arc(q[0] - rB * 0.25, q[1] - rB * 0.35, rB * 0.3, 0, Math.PI * 2); g.fill(); }
        });
      }
      if (nacht > 0.01 && F.leuchtPunkt) { const m = P(rel[Math.floor(rel.length / 2)]); F.leuchtPunkt(m[0], m[1] + 0.05 * s, 0.9 * s, "255,205,130", 0.26); }
    };
  }
  /* Kette an den Schrägen des Südgiebels (folgt dem Ortgang mit Knick) */
  function lichterketteOrt(M, D) {
    teil(M, "kette-sued", ST_DACH + 0.5, N_S, 0.8);
    const yK = D.yS + 0.06;
    for (const sg of [1, -1]) {
      const z = (x, zz) => [sg * x, yK, zz - D_DACH - 0.03];
      ketteFiguren(M, [z(D.xGS, D.zGS), z(D.xK, D.zKn), z(D.xE, D.zE)], 0.035, 61 + sg);
    }
    /* kurze Kette über der Ladeluke im Nordgiebel */
    teil(M, "kette-nord", ST_DACH + 0.5, N_N, 0.8);
    ketteFiguren(M, [[OG_X - 2.85, GI_YN - 0.06, 10.05], [OG_X - 4.05, GI_YN - 0.06, 10.05]], 0.07, 67);
  }
  /* Eiszapfen als durchsichtige Ebene: selbst schattiert (F.licht) */
  function eiszapfenMaler(saat, max) {
    return function (g, F) {
      const r = ST.zufall(saat);
      const L = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr), k = Math.min(1, (L[0] + L[1] + L[2]) / 3 + 0.1);
      let x = 0.1 + r() * 0.2;
      while (x < F.w - 0.05) {
        const l = max * (0.12 + Math.pow(r(), 2.3) * 0.88), b = 0.02 + l * 0.1;
        const gr = g.createLinearGradient(x - b, 0, x + b, 0);
        gr.addColorStop(0, "rgba(" + [190, 214, 236].map((v) => v * k | 0).join(",") + ",0.7)"); gr.addColorStop(0.4, "rgba(" + [250, 253, 255].map((v) => v * k | 0).join(",") + ",0.95)"); gr.addColorStop(1, "rgba(" + [150, 180, 214].map((v) => v * k | 0).join(",") + ",0.7)");
        g.fillStyle = gr;
        g.beginPath(); g.moveTo(x - b, 0); g.quadraticCurveTo(x - b * 0.35, l * 0.55, x, l); g.quadraticCurveTo(x + b * 0.35, l * 0.55, x + b, 0); g.closePath(); g.fill();
        if (F.nacht > 0.3) { g.fillStyle = "rgba(255,210,150," + (0.25 * F.nacht) + ")"; g.fillRect(x - b * 0.3, l * 0.1, b * 0.6, l * 0.6); }
        x += 0.07 + r() * 0.3;
      }
    };
  }

  /* ---------------- Dachrinne aus Zink, Rinnenhaken, Schneewulst ----------------
     RUNDE 1: Der Schnee überdeckt die Rinne – der Wulst liegt VOR ihr (0,15–
     0,3 m über die Rinne hinaus), oben ein Polster, vorn wie ein liegender
     Zylinder eingerollt, unten im Eigenschatten und mit Abbrüchen. An beiden
     Enden läuft er aus und endet 0,1 m vor dem Ortgang (nichts hängt frei in
     der Luft). Eiszapfen hängen darunter, die Lichterkette davor. */
  function rinne(M, V, o, winter, s, Z) {
    const deck = winter ? Z.schneeDeck : 0;
    const D = walm(0, 0, 0);
    teil(M, "rinne" + s, ST_DACH, s > 0 ? N_DO : N_DW, 0.3);
    const x0 = s * (D.xE - 0.03), x1 = s * (D.xE + 0.15), z0 = D.zE - 0.19, z1 = D.zE - 0.05;
    const yS = D.yS + 0.02, yN = D.yN - 0.02, L = yS - yN;
    const vorn = (g, F) => {
      /* halbrund: oben Wulst (Rinnenwulst), unten dunkel */
      const gr = g.createLinearGradient(0, 0, 0, F.h);
      gr.addColorStop(0, zinkFarbe(0.35)); gr.addColorStop(0.12, zinkFarbe(0.05)); gr.addColorStop(0.3, zinkFarbe(0.12)); gr.addColorStop(0.75, zinkFarbe(-0.15)); gr.addColorStop(1, zinkFarbe(-0.4));
      g.fillStyle = gr; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      flecken(g, 0, 0, F.w, F.h, 1.5, 0.15, "dunkel", 9);
      /* Rinnenhaken: schmale Bänder über den Wulst, nicht schwarz */
      if (F.px > 14) { g.fillStyle = zinkFarbe(-0.22); for (let a = 0.3; a < F.w; a += 0.75) g.fillRect(a, 0, 0.012, F.h * 0.45); }
      /* Lötnähte */
      if (F.px > 30) { g.fillStyle = "rgba(90,94,98,0.7)"; for (let a = 1.9; a < F.w; a += 2) g.fillRect(a, 0, 0.012, F.h); }
    };
    const schneeInnen = deck > 0.5;
    const innen = (g, F) => {
      if (schneeInnen) {
        /* RUNDE 2: Schnee in der Rinne mit demselben Schneelicht wie der
           Wulst – keine Haken OBEN auf dem Schnee (vorher schwarze Querstriche) */
        schneeFlaeche(g, F, -0.1, -0.1, F.w + 0.2, F.h + 0.2, 55 + s);
        return;
      }
      g.fillStyle = zinkFarbe(-0.3); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      const gr = g.createLinearGradient(0, 0, 0, F.h); gr.addColorStop(0, "rgba(0,0,0,0.3)"); gr.addColorStop(1, "rgba(255,255,255,0.1)"); g.fillStyle = gr; g.fillRect(0, 0, F.w, F.h);
      g.fillStyle = "rgba(60,60,64,0.85)";
      for (let a = 0.3; a < F.w; a += 0.75) g.fillRect(a, 0, 0.014, F.h);
      g.fillStyle = zinkFarbe(0.3); g.fillRect(0, F.h - 0.02, F.w, 0.02);
    };
    if (s > 0) {
      M.flaeche({ name: "rinne-v", o: [x1, yS, z1], u: [0, -1, 0], v: [0, 0, -1], w: L, h: z1 - z0, malen: vorn });
      M.flaeche({ name: "rinne-i", o: [x0, yS, z1], u: [0, -1, 0], v: [1, 0, 0], w: L, h: x1 - x0, malen: innen, ebene: -1, keinLicht: schneeInnen });
    } else {
      M.flaeche({ name: "rinne-v", o: [x1, yN, z1], u: [0, 1, 0], v: [0, 0, -1], w: L, h: z1 - z0, malen: vorn });
      M.flaeche({ name: "rinne-i", o: [x0, yN, z1], u: [0, 1, 0], v: [-1, 0, 0], w: L, h: x1 - x0, malen: innen, ebene: -1, keinLicht: schneeInnen });
    }
    /* Rinnenköpfe: halbrunde Zinkkappen (Ø 12–18 cm) mit Glanzlicht –
       vorher weiße Kästchen */
    const bw = Math.abs(x1 - x0), bh = z1 - z0, halb = [];
    for (let i = 0; i <= 10; i++) { const t = i / 10 * Math.PI; halb.push([bw / 2 - Math.cos(t) * bw / 2, Math.sin(t) * bh]); }
    const ende = (g, F) => {
      const gr = g.createRadialGradient(F.w * 0.4, F.h * 0.2, 0, F.w * 0.5, F.h * 0.3, F.w * 0.7);
      gr.addColorStop(0, "rgb(206,212,216)"); gr.addColorStop(0.45, "rgb(150,156,160)"); gr.addColorStop(1, "rgb(96,100,104)");
      g.fillStyle = gr; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      g.strokeStyle = "rgba(60,64,68,0.6)"; g.lineWidth = Math.max(0.006, 0.8 / F.px); g.beginPath(); vieleck(g, halb); g.stroke();
    };
    const um = (spiegel) => halb.map((q) => [spiegel ? bw - q[0] : q[0], q[1]]);
    M.flaeche({ name: "rinne-es", o: [Math.min(x0, x1), yS, z1], u: [1, 0, 0], v: [0, 0, -1], w: bw, h: bh, umriss: um(false), malen: ende });
    M.flaeche({ name: "rinne-en", o: [Math.max(x0, x1), yN, z1], u: [-1, 0, 0], v: [0, 0, -1], w: bw, h: bh, umriss: um(false), malen: ende });
    if (deck <= 0.55) return;
    /* ---- der Schneewulst ----
       RUNDE 2: eigenes Schneelicht (wie die Dachdecke), Unterkante mit
       ±3 cm und einzelnen Wechtenlappen, an den Enden weich auslaufend */
    const k = klemm((deck - 0.55) / 0.4, 0, 1);
    const S = walm(0.1 * deck, 0.07 * deck, 0.03 * deck);
    const ueber = 0.1 + 0.12 * k, hW = 0.1 + 0.12 * k;
    const xW = D.xE + ueber, zTop = S.zE + 0.03 * k;
    const yA = S.yS - 0.1, yB = S.yN + 0.1, Lw = yA - yB;
    const kap = Math.hypot(xW - S.xE, zTop - S.zE);
    const polster = (g, F) => {
      schneeFlaeche(g, F, -0.1, -0.1, F.w + 0.2, F.h + 0.2, 61 + s);
      /* nach außen rundet sich das Polster in den Wulst */
      const gr = g.createLinearGradient(0, 0, 0, F.h);
      gr.addColorStop(0, "rgba(160,180,220,0.1)"); gr.addColorStop(0.6, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(255,255,255,0.3)");
      g.fillStyle = gr; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
    };
    const ob = [s * S.xE, s > 0 ? yA : yB, S.zE];
    M.flaeche({ name: "wulst-k" + s, o: ob, u: [0, -s, 0], v: [s * (xW - S.xE), 0, zTop - S.zE], w: Lw, h: kap, umriss: [[0, 0], [Lw, 0], [Lw - 0.3, kap], [0.3, kap]], malen: polster, danach: schneeWulstDanach, ebene: 5, keinLicht: true });
    M.flaeche({ name: "wulst-v" + s, o: [s * xW, s > 0 ? yA - 0.3 : yB + 0.3, zTop], u: [0, -s, 0], v: [0, 0, -1], w: Lw - 0.6, h: hW + 0.05, umriss: wechteUmriss(Lw - 0.6, hW, 3 + s, 0.35), malen: (g, F) => schneeWulst(g, F, F.w, F.h, 17 + s), danach: schneeWulstDanach, ebene: 5, keinLicht: true });
    /* Eiszapfen zwischen Rinne und Wulst – höchstens gut 30 cm, damit sie
       nicht vor die Fenster des Obergeschosses hängen */
    if (deck > 0.85) M.flaeche({ name: "eis", o: [s * (D.xE + 0.2), s > 0 ? yA - 0.35 : yB + 0.35, z1 - 0.05], u: [0, -s, 0], v: [0, 0, -1], w: Lw - 0.7, h: 0.45, keinLicht: true, malen: eiszapfenMaler(71 + s, 0.33 * klemm((deck - 0.85) / 0.15, 0, 1)), ebene: 1 });
    /* Lichterkette vor dem Wulst */
    if (Z.kette) ketteFiguren(M, [[s * (xW + 0.05), s > 0 ? yA - 0.35 : yB + 0.35, zTop - hW * 0.75], [s * (xW + 0.05), s > 0 ? yB + 0.35 : yA - 0.35, zTop - hW * 0.75]], 0.07, 71 + s);
  }
  /* Umriss einer Wechte: oben gerade (am Polster), unten ±3 cm gewellt mit
     einzelnen, tiefer hängenden Lappen; an den Enden weich auslaufend */
  function wechteUmriss(w, h, saat, ende) {
    const r = ST.zufall(saat), pts = [[0, 0], [w, 0]];
    const n = Math.max(6, Math.round(w / 0.06)), lappen = [];
    for (let i = 0; i < w / 1.3; i++) lappen.push([r() * w, 0.18 + r() * 0.25, 0.03 + r() * 0.04]);
    for (let i = n; i >= 0; i--) {
      const x = w * i / n;
      let y = h + 0.03 * Math.sin(x * 7.1 + saat) * 0.6 + 0.03 * (ST.rausch(x * 3.3, saat, saat) - 0.5) * 1.6;
      for (const [m, br, t] of lappen) { const d = Math.abs(x - m) / br; if (d < 1) y += t * (1 - d * d); }
      const e = Math.min(x, w - x) / ende; if (e < 1) y *= Math.sin(klemm(e, 0, 1) * Math.PI / 2);
      pts.push([x, Math.max(0.004, y)]);
    }
    return pts;
  }

  /* ---------------- Gaube (Giebelgaube) ----------------
     Vorderwand mit kleinem Fachwerk und Fenster, zwei Wangen mit
     Schieferbehang (altdeutsche Deckung, wie in Goslar), eigenes Satteldach
     mit Biberschwanz, Stirnbrett und Traufbrettern, schmale Zinkschürze.
     RUNDE 1: Vorderwand bei 2,7 m statt 2,2 m vom First und 10 cm
     niedriger – vorher schaute der Gaubenfirst der Gegenseite in flachen
     Winkeln als kleines Dreieck über den Hauptfirst. */
  function gaubeMasse() {
    const xF = 2.7, zF0 = Z_FI - xF * TA, zF1 = zF0 + 1.25, zG = zF1 + GAUBE_B / 2;
    return { xF, zF0, zF1, zG, xHinten: (Z_FI - zF1) / TA, xFirst: (Z_FI - zG) / TA };
  }
  /* Schiefer in altdeutscher Deckung: schräg ansteigende Gebinde, jeder
     Stein mit Bogenschnitt, blaugrau mit feinem Glanz */
  function schiefer(g, F, x, y, w, h, saat) {
    const r = ST.zufall(saat);
    g.fillStyle = "rgb(44,48,56)"; g.fillRect(x, y, w, h);
    if (F.px * 0.18 < 3) { g.fillStyle = "rgb(70,76,86)"; g.fillRect(x, y, w, h); flecken(g, x, y, w, h, 1, 0.3, "dunkel", saat); return; }
    const gh = 0.14, neig = 0.26;                                  // Gebindehöhe, Steigung der Gebinde
    const pf = [new Path2D(), new Path2D(), new Path2D()], farben = ["rgb(70,76,86)", "rgb(62,68,80)", "rgb(80,86,96)"];
    for (let yy = y + h + 0.3; yy > y - 0.3 - w * neig; yy -= gh) {
      let xx = x - 0.1 - r() * 0.1;
      while (xx < x + w + 0.1) {
        const sb = 0.13 + r() * 0.08, y0 = yy - (xx - x) * neig;
        const p = pf[Math.floor(r() * 3)];
        /* Stein: oben gerade (vom nächsten Gebinde verdeckt), unten rechts im Bogen */
        p.moveTo(xx, y0 - gh * 1.2); p.lineTo(xx + sb, y0 - gh * 1.2 - sb * neig);
        p.lineTo(xx + sb, y0 - sb * neig - gh * 0.25);
        p.quadraticCurveTo(xx + sb * 0.8, y0 + 0.02, xx, y0 + 0.01); p.closePath();
        xx += sb * 0.92;
      }
    }
    for (let k = 0; k < 3; k++) { g.fillStyle = farben[k]; g.fill(pf[k]); }
    /* Schattenlinien unter den Gebinden und feiner Glanz */
    g.strokeStyle = "rgba(20,22,28,0.5)"; g.lineWidth = Math.max(0.006, 0.8 / F.px);
    g.beginPath();
    for (let yy = y + h + 0.3; yy > y - 0.3 - w * neig; yy -= gh) { g.moveTo(x - 0.1, yy + 0.1 * neig); g.lineTo(x + w + 0.1, yy - (w + 0.1) * neig); }
    g.stroke();
    flecken(g, x, y, w, h, 0.9, 0.18, "hell", saat + 3, 0.5);
  }
  function gaube(M, V, o, winter, s, Z) {
    const deck = winter ? Z.schneeDeck : 0;
    winter = deck > 0.3;
    teil(M, "gaube" + s, ST_DACH, s > 0 ? N_DO : N_DW, 0.6, { schatten: false });
    const b = GAUBE_B, yc = GAUBE_Y, y0 = yc - b / 2, y1 = yc + b / 2;
    const G = gaubeMasse(), { xF, zF0, zF1, zG, xHinten, xFirst } = G;
    const P = (x, y, z) => [s * x, y, z];
    /* Vorderwand: Fünfeck */
    const vw = { name: "gaube-v" + s, w: b, zOben: zG, zUnten: zF0 };
    const oeff = [{ typ: "fenster", a0: b / 2 - 0.36, a1: b / 2 + 0.36, z0: zF0 + 0.3, z1: zF0 + 1.08, sp: [1, 2], fl: 2, kaempfer: false, licht: 1, tiefe: 0.08, stern: s > 0, zeit: 0.93 }];
    const fw = fachwerk(b, { s0: zF0, s1: zF0 + 0.14, r0: zF1 - 0.14, r1: zF1, brust: zF0 + 0.3, sturz: zF0 + 1.08 }, oeff, { eck: 0.14, pfosten: 0.1, mann: false });
    fw.H.push({ art: "rahm", a0: 0, z0: zF1 + 0.05, a1: b / 2, z1: zG - 0.02, b: 0.14 });
    fw.H.push({ art: "rahm", a0: b, z0: zF1 + 0.05, a1: b / 2, z1: zG - 0.02, b: 0.14 });
    const plan = Object.assign(vw, { zonen: [fw], oeff: oeff, umriss: [[b / 2, 0], [b, zG - zF1], [b, zG - zF0], [0, zG - zF0], [0, zG - zF1]] });
    /* Schatten des Dachüberstands (14 cm) unter beiden Schrägen der Vorderwand */
    plan.deko = (g, F) => {
      const sv = F.schatten(0.14), d = sv ? Math.max(0.08, Math.min(0.3, sv[1] + 0.06)) : 0.12, e = zG - zF1;
      g.fillStyle = "rgba(22,18,28,0.38)";
      g.beginPath(); g.moveTo(-0.1, e - 0.1); g.lineTo(b / 2, -0.05); g.lineTo(b + 0.1, e - 0.1); g.lineTo(b + 0.1, e + d); g.lineTo(b / 2, d); g.lineTo(-0.1, e + d); g.closePath(); g.fill();
    };
    const um = plan.umriss;
    const p0 = s > 0 ? P(xF, y1, zG) : P(xF, y0, zG);
    if (Z.gaube === 1) {
      /* Gerippe: Eckständer, Rähm, Giebelhölzer – offen, man sieht hindurch */
      gerippeFlaeche(M, "gaube-v" + s, s > 0 ? [s * xF, y1] : [s * xF, y0], s > 0 ? [s * xF, y0] : [s * xF, y1], zF0, plan, V, 0, 1, 0, 0.14);
    } else {
      M.flaeche({ name: "gaube-v" + s, o: p0, u: [0, -s, 0], v: [0, 0, -1], w: b, h: zG - zF0, umriss: um, malen: wandMaler(plan, V, o, Z), danach: wandNacht(plan, V, Z), ebene: 1 });
    }
    /* Wangen: Dreiecke. Stufe 2: gehobelte Schalung, ab Stufe 3 Schiefer */
    const lW = xF - xHinten;
    if (Z.gaube >= 2) {
      const wange = (g, F) => {
        if (Z.gaube === 2) { g.fillStyle = "rgb(196,164,118)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.fillStyle = "rgba(120,90,60,0.5)"; for (let yy = 0; yy < F.h; yy += 0.12) g.fillRect(-0.1, yy, F.w + 0.2, 0.008); return; }
        schiefer(g, F, -0.1, -0.1, F.w + 0.2, F.h + 0.2, 33 + s);
        /* unter dem Überstand (12 cm) liegt die Wange im tiefen Schatten */
        g.fillStyle = "rgba(12,12,18,0.5)"; g.fillRect(-0.1, -0.1, F.w + 0.2, 0.2);
        const gs = g.createLinearGradient(0, 0.1, 0, 0.35); gs.addColorStop(0, "rgba(12,12,18,0.35)"); gs.addColorStop(1, "rgba(12,12,18,0)");
        g.fillStyle = gs; g.fillRect(-0.1, 0.1, F.w + 0.2, 0.25);
      };
      /* Süd-Wange (y1) zeigt nach +y, Nord-Wange nach −y. Die Spiegelung (s < 0) steckt
         allein im Ursprung und im Umriss; u bleibt gleich, sonst kippt die Fläche nach außen. */
      M.flaeche({ name: "gaube-ws" + s, o: s > 0 ? P(xHinten, y1, zF1) : P(xF, y1, zF1), u: [1, 0, 0], v: [0, 0, -1], w: lW, h: zF1 - zF0, umriss: s > 0 ? [[0, 0], [lW, 0], [lW, zF1 - zF0]] : [[0, 0], [lW, 0], [0, zF1 - zF0]], malen: wange, ebene: 1 });
      M.flaeche({ name: "gaube-wn" + s, o: s > 0 ? P(xF, y0, zF1) : P(xHinten, y0, zF1), u: [-1, 0, 0], v: [0, 0, -1], w: lW, h: zF1 - zF0, umriss: s > 0 ? [[0, 0], [lW, 0], [0, zF1 - zF0]] : [[0, 0], [lW, 0], [lW, zF1 - zF0]], malen: wange, ebene: 1 });
    }
    /* Dach der Gaube: zwei Flächen, Überstand 0,14 */
    const ue = 0.14, xV = xF + ue, lang = Math.hypot(b / 2 + ue, b / 2 + ue);
    const yE1 = y1 + ue, yE0 = y0 - ue, zE = zF1 - ue;
    /* Schnittlinie mit dem Hauptdach: an der Traufe (yE, zE) → x, am First → xFirst */
    const xTE = (Z_FI - zE) / TA;
    const lx = xV - xFirst;
    const dm = (g, F) => {
      if (Z.gaube <= 2) {
        /* Sparren und Lattung, man sieht hindurch */
        const st = [];
        for (let a = 0.08; a < F.w; a += 0.42) st.push({ poly: [[a - 0.05, -0.1], [a + 0.05, -0.1], [a + 0.05, F.h + 0.1], [a - 0.05, F.h + 0.1]], t0: 0.04, t1: 0.16, lage: 0, farbe: V.holz });
        if (Z.gaube === 2) for (let bb = F.h - 0.06; bb > 0; bb -= 0.155) st.push({ poly: [[-0.1, bb - 0.02], [F.w + 0.1, bb - 0.02], [F.w + 0.1, bb + 0.02], [-0.1, bb + 0.02]], t0: 0, t1: 0.04, lage: 1, farbe: [182, 150, 104] });
        prismen(g, F, st);
        return;
      }
      biberschwanz(g, F, -0.1, -0.1, F.w + 0.2, F.h + 0.2, 93 + s, {});
      /* Firstlinie der Gaube: Mörtel und Firstziegel als dunkles Band */
      g.fillStyle = "rgb(120,52,38)"; g.fillRect(-0.1, -0.1, F.w + 0.2, 0.07);
      g.fillStyle = "rgba(30,12,8,0.35)"; g.fillRect(-0.1, -0.03, F.w + 0.2, 0.025);
    };
    const stuhl = Z.gaube <= 2;
    const dOpt = stuhl ? { beidseitig: true, keinLicht: true } : {};
    M.flaeche(Object.assign({
      name: "gaube-ds" + s, o: s > 0 ? P(xFirst, yc, zG) : P(xV, yc, zG), u: [1, 0, 0], v: [0, (yE1 - yc), zE - zG], w: lx, h: lang,
      umriss: s > 0 ? [[0, 0], [lx, 0], [lx, lang], [xTE - xFirst, lang]] : [[0, 0], [lx, 0], [lx - (xTE - xFirst), lang], [0, lang]], malen: dm, ebene: 2
    }, dOpt));
    M.flaeche(Object.assign({
      name: "gaube-dn" + s, o: s > 0 ? P(xV, yc, zG) : P(xFirst, yc, zG), u: [-1, 0, 0], v: [0, (yE0 - yc), zE - zG], w: lx, h: lang,
      umriss: s > 0 ? [[0, 0], [lx, 0], [lx - (xTE - xFirst), lang], [0, lang]] : [[0, 0], [lx, 0], [lx, lang], [xTE - xFirst, lang]], malen: dm, ebene: 2
    }, dOpt));
    if (stuhl) return;
    /* Stirnbrett (vorn, 0,12 m) mit Schneestirn und Traufbretter */
    const brettF = (oben) => (g, F) => {
      g.fillStyle = rgb(hell(V.holz, 0.05)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      maserung(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, 2, 0.12, 0.6);
      g.fillStyle = "rgba(20,12,8,0.35)"; g.fillRect(-0.1, F.h - 0.015, F.w + 0.2, 0.02);
      void oben;
    };
    const bw = yE1 - yE0, dd = 0.12, hg = zG - zE;
    M.flaeche({ name: "gaube-ort" + s, o: s > 0 ? P(xV, yE1, zG + 0.02) : P(xV, yE0, zG + 0.02), u: [0, -s, 0], v: [0, 0, -1], w: bw, h: hg + dd + 0.02,
      umriss: [[bw / 2, 0], [bw, hg + 0.02], [bw, hg + dd + 0.02], [bw / 2, dd + 0.02], [0, hg + dd + 0.02], [0, hg + 0.02]],
      malen: brettF((g, F) => { const t = 0.1; g.moveTo(0, hg + 0.02 + 0.02); g.lineTo(bw / 2, -t); g.lineTo(bw, hg + 0.04); g.lineTo(bw - 0.05, hg + 0.07); g.quadraticCurveTo(bw * 0.75, hg / 2 + 0.05, bw / 2, 0.06); g.quadraticCurveTo(bw * 0.25, hg / 2 + 0.05, 0.05, hg + 0.07); g.closePath(); }), ebene: 3 });
    const lT = xV - xTE;
    const traufO = (g, F) => { g.moveTo(0, -0.06); g.lineTo(F.w, -0.06); g.lineTo(F.w, 0.03); for (let a = F.w; a >= 0; a -= 0.1) g.lineTo(a, 0.03 + Math.sin(a * 17) * 0.012); g.closePath(); };
    M.flaeche({ name: "gaube-ts" + s, o: s > 0 ? [xTE, yE1, zE] : [-xV, yE1, zE], u: [1, 0, 0], v: [0, 0, -1], w: lT, h: dd, umriss: [[0, -0.06], [lT, -0.06], [lT, dd], [0, dd]], malen: brettF(traufO), ebene: 3 });
    M.flaeche({ name: "gaube-tn" + s, o: s > 0 ? [xV, yE0, zE] : [-xTE, yE0, zE], u: [-1, 0, 0], v: [0, 0, -1], w: lT, h: dd, umriss: [[0, -0.06], [lT, -0.06], [lT, dd], [0, dd]], malen: brettF(traufO), ebene: 3 });
    /* RUNDE 2 (Kritik: „weiße Karte ohne Dicke", „rrect-Ecke, roter Ziegel
       schaut hervor"): Schnee als eigene Schicht, 7 cm über den Gaubendach-
       flächen, Ränder leicht wellig; davor ein Wulst am Stirnbrett und an
       beiden Traufen. So bleibt die Gaube auch klein als Häuschen lesbar. */
    if (winter) {
      const t = 0.07;
      const r = ST.zufall(401 + s);
      const wellig = (L, h, amp, n) => { const pts = []; for (let i = 0; i <= n; i++) pts.push([L * i / n, h + amp * (Math.sin(i * 2.3 + r() * 2) * 0.6 + (r() - 0.5))]); return pts; };
      for (const [name, oo, uu, vv, sued] of [["gs", s > 0 ? P(xFirst, yc, zG) : P(xV, yc, zG), [1, 0, 0], [0, (yE1 - yc), zE - zG], true], ["gn", s > 0 ? P(xV, yc, zG) : P(xFirst, yc, zG), [-1, 0, 0], [0, (yE0 - yc), zE - zG], false]]) {
        const vn = ST.norm(vv), nn = ST.norm(ST.kreuz(uu, vn));
        const o2 = [oo[0] + nn[0] * t, oo[1] + nn[1] * t, oo[2] + nn[2] * t];
        /* Umriss: vorne 4 cm über das Stirnbrett, an der Traufe 4 cm Überhang, gewellt */
        const vorneRechts = (s > 0) === (uu[0] > 0);
        const aHinten = xTE - xFirst, ex = 0.04;
        const unten = wellig(1, lang + ex, 0.018, 8).map(([q, b]) => [vorneRechts ? aHinten + (lx + ex - aHinten) * q : (lx - aHinten) * (1 - q) - ex * q + 0 * b, b]);
        let um;
        if (vorneRechts) um = [[0, 0], [lx + ex, -0.01]].concat(wellig(1, 0, 0, 5).slice(1, 5).map(([q]) => [lx + ex + (r() - 0.5) * 0.02, lang * q])).concat(unten.slice().reverse()).concat([[aHinten - 0.02, lang + ex]]);
        else um = [[-ex, -0.01], [lx, 0], [lx - aHinten + 0.02, lang + ex]].concat(unten.filter((q) => q[0] < lx - aHinten)).concat(wellig(1, 0, 0, 5).slice(1, 5).reverse().map(([q]) => [-ex + (r() - 0.5) * 0.02, lang * q]));
        M.flaeche({ name: "gaube-schnee-" + name + s, o: o2, u: uu, v: vn, w: lx + 0.1, h: lang + 0.1, umriss: um, keinLicht: true, ebene: 4,
          malen: (g, F) => {
            schneeFlaeche(g, F, -0.2, -0.2, F.w + 0.4, F.h + 0.4, 91 + s + (sued ? 0 : 7));
            /* First: helle Kammlinie, an der Traufe die Rundung im Eigenschatten */
            const gr = g.createLinearGradient(0, 0, 0, lang + 0.05);
            gr.addColorStop(0, "rgba(255,255,255,0.18)"); gr.addColorStop(0.12, "rgba(255,255,255,0)"); gr.addColorStop(0.8, "rgba(150,170,212,0)"); gr.addColorStop(1, "rgba(150,170,212,0.3)");
            g.fillStyle = gr; g.fillRect(-0.2, -0.2, F.w + 0.4, F.h + 0.4);
          } });
      }
      /* Wulst am Stirnbrett: folgt den beiden Schrägen, oben kein Zipfel */
      const wOrt = (g, F) => schneeWulst(g, F, F.w, F.h, 51 + s);
      const zGo = zG + 0.02, ob = [];
      for (let i = 0; i <= 10; i++) { const q = i / 10, a = bw * q, z = zGo + t * 1.4 - Math.abs(q - 0.5) * 2 * (zGo - zE); ob.push([a, zGo + 0.12 - z]); }
      const un = [];
      for (let i = 10; i >= 0; i--) { const q = i / 10, a = bw * q, z = zGo - 0.035 - Math.abs(q - 0.5) * 2 * (zGo - zE) - 0.015 * Math.sin(i * 1.7 + s); un.push([a, zGo + 0.12 - z]); }
      M.flaeche({ name: "gaube-ortschnee" + s, o: s > 0 ? P(xV + 0.035, yE1 + 0.03, zGo + 0.12) : P(xV + 0.035, yE0 - 0.03, zGo + 0.12), u: [0, -s, 0], v: [0, 0, -1], w: bw + 0.06, h: hg + 0.3, umriss: ob.concat(un), malen: wOrt, danach: schneeWulstDanach, keinLicht: true, ebene: 5 });
      /* Wulst an den beiden Traufen der Gaube */
      for (const [yy, uu, x0, nm] of [[yE1 + 0.035, [1, 0, 0], s > 0 ? xTE : -xV, "s"], [yE0 - 0.035, [-1, 0, 0], s > 0 ? xV : -xTE, "n"]]) {
        M.flaeche({ name: "gaube-trauf" + nm + s, o: [x0, yy, zE + t * 1.2], u: uu, v: [0, 0, -1], w: lT, h: 0.2, umriss: wechteUmriss(lT, 0.11, 60 + s + (nm === "s" ? 0 : 3), 0.12), malen: (g, F) => schneeWulst(g, F, F.w, F.h, 57 + s), danach: schneeWulstDanach, keinLicht: true, ebene: 5 });
      }
    }
    /* Blechschürze unter der Vorderwand: schmal (0,15 m), dunkel, helle Wulstkante */
    if (Z.gaube >= 4 && deck < 0.3) {
      const sch = (g, F) => { g.fillStyle = "rgb(112,116,120)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.fillStyle = "rgba(210,214,218,0.8)"; g.fillRect(-0.1, F.h - 0.025, F.w + 0.2, 0.025); if (F.px > 20) { g.fillStyle = "rgba(50,54,60,0.45)"; for (let x = 0.4; x < F.w; x += 0.6) g.fillRect(x, 0, 0.01, F.h); } };
      const xs = xF + 0.15 * CA, zs = zF0 - 0.15 * SA + 0.012;
      M.flaeche({ name: "gaube-schuerze" + s, o: s > 0 ? P(xF, y1, zF0 + 0.012) : P(xF, y0, zF0 + 0.012), u: [0, -s, 0], v: [s * (xs - xF), 0, zs - zF0 - 0.012], w: b, h: 0.15, malen: sch, ebene: 0 });
    }
  }

  /* ---------------- Kamin mit Klinker, Kaminkopf, Abdeckplatte ---------------- */
  function kamin(M, V, o, winter, Z) {
    const deck = winter ? Z.schneeDeck : 0;
    winter = deck > 0.3;
    /* Solange das Dach offen ist, wächst der Kamin sichtbar vom Dachboden
       aus durch den Dachstuhl – dann gehört er zum Dachkern (Reihenfolge).
       Der Kamin wirft keinen eigenen weichen Bodenschatten mehr (Leistung) –
       sein Schatten fällt ohnehin fast ganz aufs Dach und wird dort gemalt. */
    if (Z.dachOffen && M._kern) { M.akt = M._kern; } else teil(M, "kamin", ST_KAMIN, null, 0);
    const eb = Z.dachOffen ? 1 : 0;
    const b = 0.3, y0 = KAMIN_Y - 0.32, y1 = KAMIN_Y + 0.32, zVoll = Z_FI + 1.05;
    const zDach = (x) => Z.dachOffen ? Z_T + 0.22 : Z_FI + 0.1 * deck / CA - Math.abs(x) * TA;
    const zTop = Z.kaminKopf ? zVoll : zDach(0) + (zVoll - zDach(0)) * Z.kamin;
    /* unten am Schaft das senkrechte Blech der Verwahrung (10 cm) */
    const blechBand = (g, F) => {
      if (Z.dachOffen) return;
      const gr = g.createLinearGradient(0, F.h - 0.09, 0, F.h); gr.addColorStop(0, zinkFarbe(-0.02)); gr.addColorStop(1, zinkFarbe(-0.25));
      if (/k-[sn]$/.test(F.name)) { const hb = zTop - zDach(b), hm = zTop - zDach(0); fuelle(g, [[-0.1, hb + 0.1], [-0.1, hb - 0.08], [b, hm - 0.08], [2 * b + 0.1, hb - 0.08], [2 * b + 0.1, hb + 0.1]], zinkFarbe(-0.12)); }
      else { g.fillStyle = gr; g.fillRect(-0.1, F.h - 0.08, F.w + 0.2, 0.2); }
    };
    const kl = (g, F) => { klinker(g, F, -0.1, -0.1, F.w + 0.2, F.h + 0.2, 7 + Math.round(F.w * 10), {}); blechBand(g, F); };
    /* Luvseite (West): angewehter Schnee klebt am Klinker, unten eine kleine Wehe */
    const klLuv = (g, F) => {
      kl(g, F);
      if (!winter) return;
      const r = ST.zufall(ST.textHash(F.name) + 5);
      g.fillStyle = "rgba(238,243,250,0.85)";
      for (let i = 0; i < 26; i++) { const x = r() * F.w, y = r() * F.h * 0.9; g.beginPath(); g.ellipse(x, y, 0.02 + r() * 0.05, 0.01 + r() * 0.02, 0, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = "rgb(238,243,250)";
      g.beginPath(); g.moveTo(-0.1, F.h + 0.1);
      for (let x = -0.1; x <= F.w + 0.1; x += 0.08) g.lineTo(x, F.h - 0.12 - Math.sin(x * 9) * 0.03 - r() * 0.04);
      g.lineTo(F.w + 0.1, F.h + 0.1); g.closePath(); g.fill();
    };
    /* Schaft: Seiten unten dem Dach folgend */
    if (!Z.dachOffen) {
      /* RUNDE 2: Verwahrung als echte, schmale Kehlbleche (0,1 m), zum
         Schaft geneigt – vorher eine Farbfläche im Dach, die aus
         Firstrichtung als Pfeil oder Kerbe erschien */
      const zinkF = (g, F) => { const gr = g.createLinearGradient(0, 0, 0, F.h); gr.addColorStop(0, zinkFarbe(-0.02)); gr.addColorStop(1, zinkFarbe(-0.3)); g.fillStyle = gr; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); if (F.px > 30) flecken(g, 0, 0, F.w, F.h, 0.5, 0.2, "dunkel", 29); };
      const k = 0.07;
      for (const sx of [1, -1]) {
        const xa = sx * b, xb = sx * (b + k);
        polyFlaeche(M, "k-blech" + sx, [[xa, y0 - k, zDach(b) + k], [xa, y1 + k, zDach(b) + k], [xb, y1 + k, zDach(b + k)], [xb, y0 - k, zDach(b + k)]], [sx, 0, 1], zinkF, { ebene: eb });
      }
      for (const sy of [1, -1]) {
        const ya = sy > 0 ? y1 : y0, yb = ya + sy * k;
        for (const sx of [1, -1]) polyFlaeche(M, "k-blech" + sy + "_" + sx, [[0, ya, zDach(0) + k], [sx * (b + k), ya, zDach(b + k) + k], [sx * (b + k), yb, zDach(b + k)], [0, yb, zDach(0)]], [sx * 0.3, sy, 1], zinkF, { ebene: eb });
      }
    }
    const hS = zTop - zDach(b);
    M.flaeche({ name: "k-o", o: [b, y1, zTop], u: [0, -1, 0], v: [0, 0, -1], w: y1 - y0, h: hS, malen: kl, ebene: eb });
    M.flaeche({ name: "k-w", o: [-b, y0, zTop], u: [0, 1, 0], v: [0, 0, -1], w: y1 - y0, h: hS, malen: klLuv, ebene: eb });
    const um = [[0, 0], [2 * b, 0], [2 * b, zTop - zDach(b)], [b, zTop - zDach(0)], [0, zTop - zDach(b)]];
    M.flaeche({ name: "k-s", o: [-b, y1, zTop], u: [1, 0, 0], v: [0, 0, -1], w: 2 * b, h: zTop - zDach(b), umriss: um, malen: kl, ebene: eb });
    M.flaeche({ name: "k-n", o: [b, y0, zTop], u: [-1, 0, 0], v: [0, 0, -1], w: 2 * b, h: zTop - zDach(b), umriss: um, malen: kl, ebene: eb });
    if (!Z.kaminKopf) {
      /* oben offen: frische Mörtelschicht auf der Krone */
      M.flaeche({ name: "k-krone", o: [-b, y0, zTop], u: [1, 0, 0], v: [0, 1, 0], w: 2 * b, h: y1 - y0, ebene: eb, malen: (g, F) => { g.fillStyle = "rgb(128,60,44)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.fillStyle = "rgb(30,24,22)"; g.fillRect(0.12, 0.12, F.w - 0.24, F.h - 0.24); } });
      return;
    }
    /* Kaminkopf: zwei vorkragende Schichten */
    const kk = 0.05, zk0 = zTop - 0.02, zk1 = zTop + 0.22;
    const kopf = (g, F) => { klinker(g, F, -0.1, -0.1, F.w + 0.2, F.h + 0.2, 17, { versatz: 0.06 }); g.fillStyle = "rgba(20,16,14,0.35)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); };
    M.quader({ x: -b - kk, y: y0 - kk, z: zk0, b: 2 * (b + kk), t: y1 - y0 + 2 * kk, h: zk1 - zk0 }, { sued: kopf, nord: kopf, ost: kopf, west: kopf }, { ebene: 1 });
    /* Abdeckplatte auf Stützen */
    const pl = 0.1, zp0 = zk1 + 0.14, zp1 = zp0 + 0.06;
    const platte = (g, F) => { g.fillStyle = "rgb(150,146,138)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); flecken(g, 0, 0, F.w, F.h, 0.5, 0.3, "dunkel", 21); };
    const stuetze = (g, F) => { g.fillStyle = "rgb(110,50,36)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); };
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) M.quader({ x: sx * (b - 0.02) - 0.05, y: KAMIN_Y + sy * (0.3) - 0.05, z: zk1, b: 0.1, t: 0.1, h: zp0 - zk1 }, { sued: stuetze, nord: stuetze, ost: stuetze, west: stuetze }, { ebene: 2 });
    /* Rauchöffnung (dunkel) zwischen den Stützen */
    M.flaeche({ name: "k-loch", o: [-b, y0, zk1 + 0.001], u: [1, 0, 0], v: [0, 1, 0], w: 2 * b, h: y1 - y0, malen: (g, F) => { g.fillStyle = "rgb(22,18,16)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.fillStyle = "rgb(120,110,100)"; g.strokeStyle = "rgb(120,110,100)"; g.lineWidth = 0.08; g.strokeRect(0, 0, F.w, F.h); }, ebene: 1 });
    /* RUNDE 1: Die Plattenoberseite ist eine eigene Fläche mit ebene 4 –
       Bauer.quader gibt „opt" nicht an die Oberseite weiter (Fehler im
       Kern), dadurch wurde sie VOR Loch und Stützen gemalt: schwarzes Loch
       und rote Stummel mitten auf der Platte. */
    M.quader({ x: -b - pl, y: y0 - pl, z: zp0, b: 2 * (b + pl), t: y1 - y0 + 2 * pl, h: zp1 - zp0 }, { sued: platte, nord: platte, ost: platte, west: platte }, { ebene: 3 });
    M.flaeche({ name: "k-platte-o", o: [-b - pl, y0 - pl, zp1], u: [1, 0, 0], v: [0, 1, 0], w: 2 * (b + pl), h: y1 - y0 + 2 * pl, ebene: 4,
      malen: winter ? (g, F) => schneeFlaeche(g, F, -0.1, -0.1, F.w + 0.2, F.h + 0.2, 3) : platte, keinLicht: winter });
    if (winter) {
      /* Schneehaube auf der Platte: rundes Polster, an den Ecken auslaufend */
      const sw = (g, F) => schneeWulst(g, F, F.w, F.h, 12);
      const e = b + pl + 0.012, hk = 0.05 + 0.07 * klemm((deck - 0.3) / 0.6, 0, 1);
      M.flaeche({ name: "k-schnee", o: [-e, KAMIN_Y + e, zp1 + hk * 0.6], u: [1, 0, 0], v: [0, 0, -1], w: 2 * e, h: hk + 0.03, umriss: wulstUmriss(2 * e, hk + 0.03, 2, null, 0.08), malen: sw, danach: schneeWulstDanach, ebene: 5, keinLicht: true });
      M.flaeche({ name: "k-schnee2", o: [e, KAMIN_Y + e, zp1 + hk * 0.6], u: [0, -1, 0], v: [0, 0, -1], w: 2 * e, h: hk + 0.03, umriss: wulstUmriss(2 * e, hk + 0.03, 8, null, 0.08), malen: sw, danach: schneeWulstDanach, ebene: 5, keinLicht: true });
      M.flaeche({ name: "k-schnee3", o: [-e, KAMIN_Y - e, zp1 + hk * 0.6], u: [0, 1, 0], v: [0, 0, -1], w: 2 * e, h: hk + 0.03, umriss: wulstUmriss(2 * e, hk + 0.03, 11, null, 0.08), malen: sw, danach: schneeWulstDanach, ebene: 5, keinLicht: true });
      M.flaeche({ name: "k-schnee4", o: [e, KAMIN_Y - e, zp1 + hk * 0.6], u: [-1, 0, 0], v: [0, 0, -1], w: 2 * e, h: hk + 0.03, umriss: wulstUmriss(2 * e, hk + 0.03, 13, null, 0.08), malen: sw, danach: schneeWulstDanach, ebene: 5, keinLicht: true });
      /* RUNDE 2: die Haube oben ist ein weich gewellter, gerundeter Umriss
         (±2–4 cm), der 4 cm über die Wulste hinaushängt – keine Platte mit
         Fasen mehr */
      const ue = 0.04, W2 = 2 * e + 2 * ue, rr = ST.zufall(33), hut = [];
      for (let i = 0; i < 36; i++) {
        const t = i / 36 * Math.PI * 2, c = Math.cos(t), sn = Math.sin(t);
        const q = Math.pow(Math.pow(Math.abs(c), 4) + Math.pow(Math.abs(sn), 4), -0.25);   // Superellipse: eckig-rund
        const rw = W2 / 2 * q + 0.02 * Math.sin(t * 5 + 1) + (rr() - 0.5) * 0.02;
        hut.push([W2 / 2 + c * rw, W2 / 2 + sn * rw]);
      }
      M.flaeche({ name: "k-schnee-o", o: [-e - ue, KAMIN_Y - e - ue, zp1 + hk * 0.6 + 0.01], u: [1, 0, 0], v: [0, 1, 0], w: W2, h: W2, umriss: hut, malen: (g, F) => {
        schneeFlaeche(g, F, -0.1, -0.1, F.w + 0.2, F.h + 0.2, 3);
        /* gewölbt: Mitte hell, zum Rand ein Hauch Eigenschatten */
        const gr = g.createRadialGradient(F.w * 0.45, F.h * 0.45, 0, F.w / 2, F.h / 2, F.w * 0.6);
        gr.addColorStop(0, "rgba(255,255,255,0.12)"); gr.addColorStop(0.7, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(130,150,196,0.3)");
        g.fillStyle = gr; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      }, ebene: 6, keinLicht: true });
    }
    if (Z.fertig) M.rauchAus(0, KAMIN_Y, zp0 + 0.02, 1);
  }
})();
