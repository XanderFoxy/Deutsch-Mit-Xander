/* =====================================================================
   BAUKASTEN-STADT — TANNE (Nordmanntanne und Fichte)
   ---------------------------------------------------------------------
   XANDER: „Das soll keine Comic Grafik sein. Das soll noch viel mehr am
   Realismus dran sein." · „Richtig filigran. Richtig schön ausarbeiten
   mit schönen Texturen." · „Man soll sie in jedem Winkel aufstellen
   können." · „dass wir das später in einen Frühlingsgewand packen können."
   · „mit Schnee … Das möchte ich in Perfektion."

   WIE DIE TANNE ENTSTEHT
   Kein flaches Bild, sondern ein kleiner Baum im Raum (Meter): ein
   Stamm mit Wurzelanlauf, darauf Astquirle (Etagen). Jeder Ast ist ein
   flacher Wedel wie bei einer echten Tanne – Hauptast, daran unregelmäßig
   die Seitentriebe, dicht mit Nadeln besetzt. Die Nordmanntanne trägt
   breite, flache Zweige mit abgerundeten Spitzen; die Fichte ist eine
   „Kammfichte": an den Ästen hängen die Seitenzweige wie ein Vorhang
   senkrecht herab. Alles wird für den Blickwinkel gedreht, von hinten
   nach vorn gemalt und einzeln belichtet: links oben Sonne, rechts
   Schatten, innen am Stamm dunkler, außen die hellen Triebspitzen.

   DER TRICK MIT DEN WEDEL-VORLAGEN
   Eine Wedelhälfte ist flach. Eine flache Sache sieht in der Kamera
   (orthografisch) genau so aus wie ihre Zeichnung, nur affin verzerrt –
   wie die Hauswände im Kern. Deshalb wird eine Wedelhälfte mit allen
   Trieben und Nadeln EINMAL als Vektorzeichnung gemalt (in der Größe, in
   der sie gerade gebraucht wird, also ohne Pixelkanten) und dann für jeden
   Ast in seine Lage im Raum gelegt: gedreht, gekippt, gestaucht,
   gespiegelt. Die Nadelmasse ist aus vielen weichen Trieb-Strichen
   gebaut (keine Sägeblatt-Kontur), die Nadeln ragen darüber hinaus.
   Beim Heranzoomen kommen immer mehr einzelne Nadeln dazu – so, dass die
   mittlere Farbe gleich bleibt (kein Helligkeitssprung beim Zoomen).

   SCHNEE (Winter)
   Schnee liegt nicht „auf die Nadeln gemalt", sondern als eigener Körper
   OBEN auf jedem Ast: eine waagerechte, gewölbte Decke von 10–20 cm
   Dicke, oben warmweiß in der Sonne, an der Flanke bläulich, unten eine
   dunkle Kontaktkante und ein Schlagschatten auf die Nadeln darunter; am
   Rand hängt er etwas über, manchmal rutscht ein Klumpen ab. Am Stamm
   eine bläuliche Schneemulde.

   Frühling: kein Schnee, dafür hellgrüne Maitriebe an vielen Spitzen.

   Varianten über o.saat: Art, Höhe 8–16 m, Schlankheit, Kronenansatz,
   Schiefstand, Dichte, einseitiger Wuchs, Lücken, selten ein Doppel- oder
   Ersatzwipfel – im Wald sieht keine aus wie die andere.

   RECHENZEIT
   Der Baum wird auf einer eigenen Leinwand im Arbeitsspeicher gemalt
   (viele kleine Pfade sind dort viel schneller als einzeln auf der
   Grafikkarte) und dann mit EINEM Bildaufruf ins Sprite gelegt. Der
   Schatten wird in halber Auflösung gemalt und weich hochgezogen – das
   ersetzt das teure Weichzeichnen. Die Vorlagen werden ohne Auslesen der
   Bildpunkte getönt (Matte, „multiply", „destination-in") und teilen
   sich mit Laub- und Obstbaum einen Speicher von 16 Mio. Bildpunkten.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const KX = ST.KX, KY = ST.KY, KZ = ST.KZ, LICHT = ST.LICHT, AUGE = ST.ZUM_AUGE;
  /* Schattenrichtung am Boden je Meter Höhe (Kameraraum) */
  const SX = -LICHT[0] / LICHT[2], SY = -LICHT[1] / LICHT[2];
  const AL = 1.08;                       // Seitentriebe der Nordmanntanne ~62° schräg nach vorn
  const VARIANTEN = 3;                   // verschiedene Wedel-Vorlagen je Art und Längenklasse
  const SB_MAX = 104;                    // Vorlagen oberhalb davon nicht weiter verfeinern
  const norm = ST.norm, kreuz = ST.kreuz, punkt = ST.punkt;
  const klemm = (v, a, b) => Math.max(a, Math.min(b, v));
  const glatt = (a, b, v) => { const t = klemm((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

  /* ---------------- Blick: Modellpunkt → Bildpunkt ----------------
     Ursprung = Fußpunkt des Baums im Bild, s = Pixel je Meter.
     tief = Nähe zum Betrachter (größer = weiter vorn). */
  function blick(gier, s) {
    const r = gier * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
    return {
      s: s,
      p(q) { const a = q[0] * c - q[1] * sn, b = q[0] * sn + q[1] * c; return [(a - b) * KX * s, (a + b) * KY * s - q[2] * KZ * s]; },
      tief(q) { const a = q[0] * c - q[1] * sn, b = q[0] * sn + q[1] * c; return (a + b) * 0.6124 + q[2] * 0.5; },
      n(v) { return [v[0] * c - v[1] * sn, v[0] * sn + v[1] * c, v[2]]; },
      boden(q) { const a = q[0] * c - q[1] * sn + SX * q[2], b = q[0] * sn + q[1] * c + SY * q[2]; return [(a - b) * KX * s, (a + b) * KY * s]; }
    };
  }
  function lichtAuf(n, Z, jahr) { return ST.lichtFaktor(norm(n), Z, 0, jahr); }
  function farbe(c, lf, k, a) {
    const r = Math.min(255, c[0] * lf[0] * k), g = Math.min(255, c[1] * lf[1] * k), b = Math.min(255, c[2] * lf[2] * k);
    return a == null ? "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")" : "rgba(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + "," + a.toFixed(3) + ")";
  }
  const rgbK = (f, k, a) => "rgba(" + Math.round(klemm(f[0] * k, 0, 255)) + "," + Math.round(klemm(f[1] * k, 0, 255)) + "," + Math.round(klemm(f[2] * k, 0, 255)) + "," + (a == null ? 1 : a) + ")";
  /* Vieleck an den laufenden Pfad hängen – immer gleich herum, damit sich
     beim Füllen alles vereinigt statt Löcher zu geben */
  function vieleckDazu(g, pts) {
    let fl = 0;
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; fl += a[0] * b[1] - b[0] * a[1]; }
    if (fl < 0) pts = pts.slice().reverse();
    g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    g.closePath();
  }
  /* Vieleck um den Bildvektor (vx, vy) verschoben „ausgefegt": Vieleck,
     verschobenes Vieleck und je Kante das Parallelogramm dazwischen –
     so bekommt eine Schneedecke ihre sichtbare Dicke. */
  function gefegtDazu(g, pts, vx, vy) {
    vieleckDazu(g, pts);
    vieleckDazu(g, pts.map((p) => [p[0] + vx, p[1] + vy]));
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      vieleckDazu(g, [a, b, [b[0] + vx, b[1] + vy], [a[0] + vx, a[1] + vy]]);
    }
  }
  function bez(P0, P1, P2, t) {
    const u = 1 - t, a = u * u, b = 2 * u * t, c = t * t;
    return [P0[0] * a + P1[0] * b + P2[0] * c, P0[1] * a + P1[1] * b + P2[1] * c, P0[2] * a + P1[2] * b + P2[2] * c];
  }
  const plus = (p, v, k) => [p[0] + v[0] * k, p[1] + v[1] * k, p[2] + v[2] * k];

  /* =====================================================================
     LEINWÄNDE UND VORLAGEN
     ===================================================================== */
  /* Leinwand im Arbeitsspeicher (willReadFrequently → Software-Rasterung) */
  function leinwand(w, h) {
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h));
    c.g = c.getContext("2d", { willReadFrequently: true });
    return c;
  }
  /* Gemeinsamer Vorlagen-Speicher aller Natur-Modelle (Tanne, Laubbaum,
     Obstbaum): höchstens 16 Mio. Bildpunkte, die ältesten fliegen raus */
  const VS = ST.naturVorlagen || (ST.naturVorlagen = { karte: new Map(), px: 0, max: 16e6 });
  function vorlageHolen(schl, bauen) {
    let c = VS.karte.get(schl);
    if (c) { VS.karte.delete(schl); VS.karte.set(schl, c); return c; }
    c = bauen();
    VS.karte.set(schl, c); VS.px += c.width * c.height;
    if (VS.px > VS.max) {
      for (const [k, v] of VS.karte) {
        if (VS.px < VS.max * 0.7) break;
        if (k === schl) continue;
        VS.karte.delete(k); VS.px -= v.width * v.height;
      }
    }
    return c;
  }
  /* Maßstab der Vorlagen: in Stufen (12 %), immer etwas größer als
     gebraucht – beim Auflegen wird verkleinert. Ab SB_MAX nicht feiner. */
  function stufeS(s) { return Math.min(SB_MAX, Math.pow(1.12, Math.ceil(Math.log(Math.max(2, s)) / Math.log(1.12)))); }

  /* Lichtstufen: von „innen im Schatten" bis „volle Sonne". Jede Stufe ist
     ein Farbfaktor wie ihn der Kern für Flächen rechnet (Himmel + Sonne +
     Schnee-Rücklicht), damit die Tanne zu den Häusern passt. */
  const STUFEN = 12;
  const STUFEN_SPEICHER = new Map();
  function stufen(Z, jahr) {
    const schl = Z.name + "|" + jahr + "|" + Z.amb.join(",");
    let st = STUFEN_SPEICHER.get(schl);
    if (st) return st;
    st = [];
    const rueck = jahr === "winter" ? [0.20, 0.21, 0.23] : [0.08, 0.10, 0.06];
    const hell = Z.amb[1] + Z.sonne[1] * 0.6;
    for (let i = 0; i < STUFEN; i++) {
      const t = i / (STUFEN - 1);
      const k = Math.max(0, (t - 0.3) / 0.7);
      const ao = t < 0.3 ? 0.4 + 0.6 * t / 0.3 : 1;
      const m = [0, 1, 2].map((c) => Math.min(1.15, (Z.amb[c] * 0.93 + Z.sonne[c] * k * 1.35 + rueck[c] * 0.35 * hell) * ao));
      st.push({ m: m, lum: 0.3 * m[0] + 0.59 * m[1] + 0.11 * m[2] });
    }
    STUFEN_SPEICHER.set(schl, st);
    return st;
  }
  function stufeFuer(st, lf, ao) {
    const lum = (0.3 * lf[0] + 0.59 * lf[1] + 0.11 * lf[2]) * ao;
    let best = 0, d = 9;
    for (let i = 0; i < st.length; i++) { const e = Math.abs(st[i].lum - lum); if (e < d) { d = e; best = i; } }
    return best;
  }
  /* Vorlage in einer Lichtstufe: Werkstofffarbe × Licht, Durchsichtiges
     bleibt durchsichtig. Ohne Auslesen der Bildpunkte: erst auf die
     Mittelfarbe der Vorlage („Matte") legen, dann multiplizieren, dann
     mit der Vorlage selbst ausstanzen – die halbdurchsichtigen Ränder
     behalten so ihre eigene Farbe (kein weißer, kein schwarzer Saum). */
  function getoent(schl, basis, st, i) {
    const m = st[i].m;
    return vorlageHolen(schl + "|L" + m.map((v) => v.toFixed(3)).join(","), () => {
      const w = basis.width, h = basis.height;
      const c = leinwand(w, h), g = c.g;
      g.fillStyle = basis.matte; g.fillRect(0, 0, w, h);
      g.drawImage(basis, 0, 0);
      g.globalCompositeOperation = "multiply";
      g.fillStyle = "rgb(" + Math.round(Math.min(1, m[0]) * 255) + "," + Math.round(Math.min(1, m[1]) * 255) + "," + Math.round(Math.min(1, m[2]) * 255) + ")";
      g.fillRect(0, 0, w, h);
      /* Stufen über 1 (volle Wintersonne): etwas aufhellen */
      const ueber = Math.max(m[0], m[1], m[2]) - 1;
      if (ueber > 0.005) { g.globalCompositeOperation = "screen"; g.fillStyle = "rgba(255,250,235," + (ueber * 0.6).toFixed(3) + ")"; g.fillRect(0, 0, w, h); }
      g.globalCompositeOperation = "destination-in";
      g.drawImage(basis, 0, 0);
      g.globalCompositeOperation = "source-over";
      c.mL = basis.mL; c.mW = basis.mW; c.sB = basis.sB; c.ox = basis.ox; c.oy = basis.oy;
      return c;
    });
  }

  /* ---------------- Arten ---------------- */
  const ARTEN = {
    nordmann: {
      hangTyp: 0.16,
      tief: [20, 40, 24], dunkel: [36, 68, 38], mittel: [58, 100, 54], hell: [96, 138, 74], spitze: [126, 162, 92],
      trieb: [152, 200, 86], unter: [160, 186, 172], zweig: [86, 70, 52],
      rinde: [122, 118, 112], rindeD: [72, 70, 68], rindeH: [150, 146, 138],
      nadel: 0.029, nadelB: 0.0022, masse: 0.036, abst: 0.085
    },
    fichte: {
      hangTyp: 0.95,
      tief: [26, 42, 22], dunkel: [44, 70, 36], mittel: [72, 102, 50], hell: [106, 136, 68], spitze: [134, 158, 84],
      trieb: [158, 204, 90], unter: [120, 140, 100], zweig: [104, 74, 52],
      rinde: [112, 88, 72], rindeD: [64, 50, 42], rindeH: [146, 120, 100],
      nadel: 0.02, nadelB: 0.0015, masse: 0.026, abst: 0.062
    }
  };
  /* Größte Seitenbreite eines Asts der Länge L */
  function latMaxVon(fichte, L) { return fichte ? Math.min(0.95, 0.14 + 0.36 * L) : Math.min(1.25, 0.14 + 0.42 * L); }
  /* Länge der Seitentriebe entlang des Asts: breit an der Basis, zur
     Spitze kürzer, die Spitze selbst abgerundet (kein Stern) */
  function latForm(t) { return (0.34 + 0.66 * Math.pow(1 - t, 0.8)) * (1 - 0.7 * Math.pow(t, 3)); }
  /* Längenklassen der Vorlagen (kurze Äste oben haben kürzere Wedel) */
  const LAENGEN = [1.4, 3.0];
  function laengenKlasse(L) { return L < 1.9 ? 0 : 1; }

  /* Eine Wedelhälfte – Werkstofffarben bei weißem Licht.
     Vorlagenraum: x entlang des Asts (0…L), y vom Ast nach außen (0…W). */
  function wedelVorlage(artName, jahr, sB, klasse, variante) {
    const schl = "tw|" + artName + "|" + jahr + "|" + sB.toFixed(2) + "|" + klasse + "|" + variante;
    return vorlageHolen(schl, () => {
      const A = ARTEN[artName], fichte = artName === "fichte";
      const L = LAENGEN[klasse], lm = latMaxVon(fichte, L), W = lm * Math.sin(fichte ? 1.45 : AL);
      const rand = 0.09;
      const ox = 2 + rand * sB, oy = 2 + rand * sB;
      const c = leinwand((L + 2 * rand + 0.08) * sB + 4, (W * 1.08 + 2 * rand) * sB + 4), g = c.g;
      c.mL = L; c.mW = W; c.sB = sB; c.ox = ox; c.oy = oy;
      c.matte = rgbK(A.mittel, 0.84);
      g.setTransform(sB, 0, 0, sB, ox, oy);
      const R = ST.zufall(1000 + variante * 97 + klasse * 31 + (fichte ? 13 : 0));
      const px = 1 / sB;
      const fruehling = jahr === "fruehling";
      /* --- Triebe: Hauptachse, dicht gestellte Seitentriebe (Abstand und
         Länge unregelmäßig), bei der Nordmanntanne Nebentriebe, bei der
         Fichte die herabhängenden Kammzweige --- */
      const triebe = [];
      const kurve = (x0, y0, w0, l, bieg, n) => {
        const pts = [];
        for (let i = 0; i <= n; i++) {
          const k = i / n, w = w0 + bieg * k;
          const x = x0 + (Math.cos(w0) * (1 - k * 0.5) + Math.cos(w) * k * 0.5) * l * k;
          const y = y0 + (Math.sin(w0) * (1 - k * 0.5) + Math.sin(w) * k * 0.5) * l * k;
          pts.push([x, y]);
        }
        return pts;
      };
      const ymax = W * 1.03;
      /* Hauptachse (leicht über die Mitte hinaus, die andere Hälfte überlappt) */
      triebe.push({ pts: kurve(0, 0.006, 0.01, L * 1.0, -0.02, 8), breite: A.masse * 1.2, aussen: 1, achse: true, l: L });
      let x = 0.04 + R() * 0.05;
      while (x < L * 0.95) {
        const t = x / L;
        let ll = lm * latForm(t) * (0.55 + 0.9 * R());
        const w = fichte ? 1.5 + (R() - 0.5) * 0.32 : AL + (R() - 0.5) * 0.45;
        ll = klemm(ll, 0.07, Math.min(lm * 1.05, ymax / Math.sin(w)));
        if (R() > 0.05 || t < 0.2) {
          const pts = kurve(x, 0.008, w, ll, fichte ? (R() - 0.5) * 0.3 : -0.16 - R() * 0.14, 6);
          triebe.push({ pts, breite: A.masse * (0.85 + 0.3 * R()), aussen: t, l: ll });
          /* Fichte: kleine Zweiglein an den Kammzweigen */
          if (fichte && ll > 0.18) {
            const nn = Math.floor(ll / 0.11 * R() + 1);
            for (let j = 0; j < nn; j++) {
              const k = 0.25 + 0.6 * R(), i = Math.min(5, Math.floor(k * 6)), f = k * 6 - i;
              const px0 = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, py0 = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
              const sd = R() < 0.5 ? 1 : -1, lw = w + sd * (0.5 + R() * 0.35), l2 = 0.04 + R() * 0.08;
              if (py0 + Math.sin(lw) * l2 < ymax) triebe.push({ pts: kurve(px0, py0, lw, l2, 0.1 * sd, 2), breite: A.masse * 0.75, aussen: t, l: l2, neben: true });
            }
          }
          /* Nebentriebe der Nordmanntanne: abwechselnd, nach außen kürzer */
          if (!fichte && ll > 0.16) {
            const nn = Math.floor(ll / 0.085);
            for (let j = 0; j < nn; j++) {
              const k = (j + 0.6 + R() * 0.4) / (nn + 1), i = Math.min(5, Math.floor(k * 6)), f = k * 6 - i;
              const px0 = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, py0 = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
              const sd = j % 2 ? 1 : -1;
              const lw = w + sd * (0.62 + R() * 0.3), l2 = (0.07 + R() * 0.14) * (1 - k * 0.5);
              const ey = py0 + Math.sin(lw) * l2;
              if (ey < ymax && ey > -0.03) triebe.push({ pts: kurve(px0, py0, lw, l2, -0.2, 3), breite: A.masse * 0.82, aussen: t, l: l2, neben: true });
            }
          }
        }
        x += A.abst * (0.6 + 0.8 * R());
      }
      /* Maitriebe (Frühling): an 35–40 % der Triebe die letzten 8–12 cm */
      for (const tr of triebe) { tr.frisch = fruehling && !tr.achse && R() < (tr.neben ? 0.2 : 0.62); tr.frischAb = 1 - (0.08 + 0.05 * R()) / Math.max(0.1, tr.l || 1); }
      const pfad = (pts) => { g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); };
      const nachBreite = (k) => { const m = new Map(); for (const tr of triebe) { const b = Math.round(tr.breite * k * 400) / 400; if (!m.has(b)) m.set(b, []); m.get(b).push(tr); } return m; };
      g.lineCap = "round"; g.lineJoin = "round";
      /* --- 1. Tiefe: breiter, dunkler Unterpinsel – füllt die Lücken
         zwischen den Trieben mit dem schattigen Inneren --- */
      /* jeder Trieb verjüngt sich: ganz in schmal, das innere Stück breiter */
      const innen = (pts) => pts.slice(0, Math.max(2, Math.ceil(pts.length * 0.6)));
      /* unter einem Bildpunkt Breite: 1 Bildpunkt breit, aber entsprechend
         blasser – so bleibt das Verhältnis von Masse, Tiefe und Lücken (und
         damit die mittlere Helligkeit) in jeder Zoomstufe gleich */
      const strichBreite = (b, alpha) => { if (b >= px) { g.lineWidth = b; g.globalAlpha = alpha; } else { g.lineWidth = px; g.globalAlpha = alpha * b / px; } };
      const verjuengt = (k, farbeS, alpha) => {
        g.strokeStyle = farbeS;
        for (const [b, liste] of nachBreite(k)) {
          strichBreite(b * 0.72, alpha); g.beginPath(); for (const tr of liste) pfad(tr.pts); g.stroke();
          strichBreite(b, alpha); g.beginPath(); for (const tr of liste) pfad(innen(tr.pts)); g.stroke();
        }
        g.globalAlpha = 1;
      };
      verjuengt(fichte ? 1.2 : 1.45, rgbK(A.tief, 1.05), fichte ? 0.75 : 1);
      /* --- 2. Nadelmasse: weiche Trieb-Striche in der Mittelfarbe --- */
      verjuengt(1, rgbK(A.mittel, 0.84), 1);
      /* Maitriebe: hellgrüner Kern an der Triebspitze */
      if (fruehling) {
        g.strokeStyle = rgbK(A.trieb, 0.9); g.lineCap = "butt";
        g.beginPath();
        for (const tr of triebe) {
          if (!tr.frisch) continue;
          const pts = tr.pts, e = pts[pts.length - 1], v = pts[pts.length - 3] || pts[0];
          const l = Math.hypot(e[0] - v[0], e[1] - v[1]) || 1, k = Math.min(1, (1 - tr.frischAb) * (tr.l || 1) / l);
          g.moveTo(e[0] - (e[0] - v[0]) * k, e[1] - (e[1] - v[1]) * k); g.lineTo(e[0], e[1]);
        }
        g.lineWidth = A.masse * 0.9; g.stroke(); g.lineCap = "round";
      }
      /* --- 3. Zweige (braun), nur innen, dünn --- */
      if (sB > 22) {
        g.strokeStyle = rgbK(A.zweig, 0.85); g.lineWidth = Math.max(0.55 * px, 0.007);
        g.beginPath(); for (const tr of triebe) if (!tr.neben) pfad(tr.pts.slice(0, 3)); g.stroke();
      }
      /* --- 4. Nadeln: Striche von jedem Trieb schräg nach vorn und außen.
         Unter einem Bildpunkt Breite werden sie 1 Bildpunkt breit gemalt und
         entsprechend ausgedünnt – die Deckung (und damit die mittlere Farbe)
         bleibt in jeder Zoomstufe gleich. --- */
      const eimer = [[], [], [], [], [], []];            // tief, dunkel, mittel, hell, spitze, trieb
      const nB = Math.max(0.8 * px, A.nadelB);
      const behalte = Math.min(1, A.nadelB / nB * 2.2);
      const abstand = fichte ? 0.0042 : 0.0046;
      for (const tr of triebe) {
        const pts = tr.pts, n = pts.length - 1;
        const frisch = tr.frisch, frischAb = tr.frischAb;
        let len = 0; const seg = [];
        for (let i = 0; i < n; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); seg.push(l); len += l; }
        const anz = Math.floor(len / abstand);
        let i = 0, rest = 0;
        for (let k = 0; k < anz; k++) {
          const d = (k + 0.5) * abstand;
          while (i < n - 1 && d > rest + seg[i]) { rest += seg[i]; i++; }
          if (R() > behalte) continue;
          const f = klemm((d - rest) / (seg[i] || 1), 0, 1);
          const xx = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, yy = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
          const ux = (pts[i + 1][0] - pts[i][0]) / (seg[i] || 1), uy = (pts[i + 1][1] - pts[i][1]) / (seg[i] || 1);
          const kk = d / len;
          const sd = R() < 0.5 ? 1 : -1;
          const a = sd * (fichte ? 0.55 + R() * 0.8 : 0.85 + R() * 0.5);
          const ca = Math.cos(a), sa = Math.sin(a);
          const vx = ux * ca - uy * sa, vy = ux * sa + uy * ca;
          const nl = A.nadel * (0.75 + 0.5 * R()) * (kk > 0.88 ? 0.7 : 1);
          /* Farbe: Oberseite der Nadeln (eine Seite) heller, zur Triebspitze
             und außen am Ast heller, innen dunkler, dazu Zufall */
          let cl = sd > 0 ? 2 : 1;
          if (kk > 0.6) cl++;
          if (tr.aussen > 0.5 && R() < 0.45) cl++;
          if (kk < 0.25 && tr.aussen < 0.35) cl--;
          const r = R();
          if (r < 0.14) cl++; else if (r > 0.86) cl--;
          cl = klemm(cl, 0, 4);
          if (frisch && kk > frischAb) cl = 5;
          /* Nadel beginnt etwas neben der Triebachse (sie sitzt am Trieb) */
          const o0 = 0.08;
          eimer[cl].push(xx + vx * nl * o0, yy + vy * nl * o0, xx + vx * nl, yy + vy * nl);
        }
      }
      /* flache Enden: sonst würde jede Nadel bei kleinem Maßstab zu einem
         runden Punkt und die Deckung wüchse beim Herauszoomen */
      g.lineWidth = nB; g.lineCap = "butt";
      const farben = [rgbK(A.tief, 1), rgbK(A.dunkel, 1), rgbK(A.mittel, 1), rgbK(A.hell, 1), rgbK(A.spitze, 1), rgbK(A.trieb, 1)];
      for (let r = 0; r < 6; r++) {
        const p = eimer[r];
        if (!p.length) continue;
        g.strokeStyle = farben[r];
        g.beginPath();
        for (let i = 0; i < p.length; i += 4) { g.moveTo(p[i], p[i + 1]); g.lineTo(p[i + 2], p[i + 3]); }
        g.stroke();
      }
      /* --- 5. Triebspitzen: an den äußeren Enden ein paar helle Nadeln
         mehr (junges Holz im Licht) – fein, keine Kleckse --- */
      g.strokeStyle = rgbK(fruehling ? A.trieb : A.spitze, 1, 0.85); g.lineWidth = nB;
      g.beginPath();
      for (const tr of triebe) {
        if (tr.achse || R() > 0.55) continue;
        const pts = tr.pts, e = pts[pts.length - 1], v = pts[pts.length - 2];
        const l = Math.hypot(e[0] - v[0], e[1] - v[1]) || 1, ux = (e[0] - v[0]) / l, uy = (e[1] - v[1]) / l;
        const m = Math.round(7 * Math.min(1, behalte * 2) + R());
        for (let j = 0; j < m; j++) {
          const a = (R() - 0.5) * 2.2, ca = Math.cos(a), sa = Math.sin(a), nl = A.nadel * (0.6 + 0.5 * R());
          const bx = e[0] - ux * A.nadel * R(), by = e[1] - uy * A.nadel * R();
          g.moveTo(bx, by); g.lineTo(bx + (ux * ca - uy * sa) * nl, by + (ux * sa + uy * ca) * nl);
        }
      }
      g.stroke();
      /* Nordmanntanne: silbrige Unterseiten blitzen am Rand */
      if (!fichte && sB > 28) {
        g.strokeStyle = rgbK(A.unter, 1, 0.3); g.lineWidth = nB * 0.9;
        g.beginPath();
        for (const tr of triebe) {
          if (tr.achse || tr.aussen < 0.3 || R() > 0.5) continue;
          const e = tr.pts[tr.pts.length - 1];
          g.moveTo(e[0] - 0.03, e[1] + 0.014); g.lineTo(e[0] + 0.004, e[1] + 0.022);
        }
        g.stroke();
      }
      /* --- 6. Selbstschatten: am Stamm etwas dunkler (sanft) --- */
      g.globalCompositeOperation = "source-atop";
      const ao = g.createLinearGradient(0, 0, L * 0.45, 0);
      ao.addColorStop(0, "rgba(0,0,0,0.25)"); ao.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = ao; g.fillRect(-0.2, -0.2, L * 0.45 + 0.2, W * 1.4 + 0.4);
      g.globalCompositeOperation = "source-over";
      return c;
    });
  }

  /* =====================================================================
     BAUPLAN — einmal je Saat gerechnet (Meter, Modellraum)
     ===================================================================== */
  const PLAENE = new Map();
  function bauplan(saat) {
    const schl = saat >>> 0;
    if (PLAENE.has(schl)) return PLAENE.get(schl);
    const R = ST.zufall((schl ^ 0x5bd1e995) + 17);
    const fichte = R() < 0.4;
    const art = fichte ? "fichte" : "nordmann", A = ARTEN[art];
    const H = 8 + R() * 8;
    /* Schlankheit: Kronenradius unten / Höhe (Nordmann 0,20–0,26, Fichte schmaler) */
    const schlank = fichte ? 0.165 + R() * 0.045 : 0.2 + R() * 0.06;
    const R0 = H * schlank;
    const hang = A.hangTyp * (fichte ? 0.7 + 0.7 * R() : 0.75 + 0.5 * R());   // wie stark die Seitenzweige hängen
    /* Kronenansatz: so hoch, dass unten 0,8–1,6 m Stamm frei bleiben
       (die unterste Etage hängt ja noch herab), bei manchen Waldbäumen mehr */
    const haengt = hang * latMaxVon(fichte, R0) * 0.7;
    const kroneU = haengt + 0.8 + R() * 0.8 + (R() < 0.2 ? 0.6 + R() * 0.9 : 0) + (H - 8) * 0.03;
    const neigW = R() * Math.PI * 2, neigK = R() * 0.022;
    const neig = [Math.cos(neigW) * neigK, Math.sin(neigW) * neigK];          // Schiefstand je Meter
    const bieg = [(R() - 0.5) * 0.003, (R() - 0.5) * 0.003];                  // leichte Krümmung
    const einseitig = R() < 0.12;
    const asymW = R() * Math.PI * 2, asymK = einseitig ? 0.14 + R() * 0.08 : 0.03 + R() * 0.07;
    const dichte = 0.9 + R() * 0.2;
    const luecken = 0.02 + R() * 0.08;
    const helligkeit = 0.94 + R() * 0.12;
    const achse = (z) => [neig[0] * z + bieg[0] * z * z, neig[1] * z + bieg[1] * z * z, z];
    const r0 = 0.1 + H * 0.011;
    const stammR = (z) => Math.max(0.014, r0 * (1 - 0.9 * z / H) * (1 + 0.4 * Math.pow(Math.max(0, 1 - z / 0.55), 2)));
    /* Wipfel: normal, selten ein Doppelwipfel oder ein Ersatzwipfel nach Sturmbruch */
    const wr = R();
    const wipfelArt = wr < 0.06 ? 1 : wr < 0.1 ? 2 : 0;
    const achsen = [{ fn: achse, z0: 0, top: H }];
    let totSpitze = null;
    if (wipfelArt === 1) {
      /* Doppelwipfel: ab 75–82 % gabelt sich der Stamm */
      const zg = H * (0.75 + R() * 0.07), w = R() * Math.PI * 2, top2 = H * (0.9 + R() * 0.06);
      const p = achse(zg), k = 0.2;
      achsen.push({ fn: (z) => { const d = Math.max(0, z - zg); return [p[0] + Math.cos(w) * d * k, p[1] + Math.sin(w) * d * k, z]; }, z0: zg, top: top2 });
    } else if (wipfelArt === 2) {
      /* Sturmbruch: der alte Wipfel ist tot (graue Spitze), ein Seitenast
         hat sich aufgerichtet und ist der neue Wipfel */
      const zb = H * (0.8 + R() * 0.06), w = R() * Math.PI * 2;
      achsen[0].top = zb;
      totSpitze = { von: achse(zb - 0.2), bis: plus(achse(zb + 0.45), [Math.cos(w + 2), Math.sin(w + 2), 0], 0.08) };
      const p = achse(zb - 0.35);
      achsen.push({ fn: (z) => { const d = Math.max(0, z - (zb - 0.35)); const k = 0.3 * Math.exp(-d * 1.4); return [p[0] + Math.cos(w) * (0.35 * (1 - Math.exp(-d * 1.8))), p[1] + Math.sin(w) * (0.35 * (1 - Math.exp(-d * 1.8))), z + k * 0]; }, z0: zb - 0.35, top: zb + (H - zb) * 0.7 });
    }

    const zweige = [];
    let rMax = 0.5;
    const abstand0 = (0.38 + R() * 0.12) * Math.pow(H / 12, 0.3);
    for (let ai = 0; ai < achsen.length; ai++) {
      const ax = achsen[ai], top = ax.top;
      let z = ai === 0 ? kroneU : ax.z0 + 0.25;
      while (z < top - 0.3) {
        const u = (z - kroneU) / (top - kroneU);
        const anz = (fichte ? 5 + Math.floor(R() * 2) : 6 + Math.floor(R() * 2)) - (ai > 0 ? 2 : 0);
        const dreh = R() * Math.PI * 2;
        /* Profil: Kegel, bei der Nordmanntanne unten etwas bauchiger */
        let prof = Math.pow(Math.max(0, 1 - u), fichte ? 1.0 : 0.92);
        if (u < 0.08) prof *= 0.9 + 1.25 * u;                            // unterste Etage etwas kürzer
        for (let k = 0; k < anz; k++) {
          if (u < 0.85 && R() < luecken) continue;                        // fehlender Ast = Lücke
          const phi = dreh + k / anz * Math.PI * 2 + (R() - 0.5) * 0.55;
          /* Doppelwipfel: die Nebenachse trägt nur Äste nach außen */
          let L = R0 * prof * (0.85 + R() * 0.3) * (1 + asymK * Math.cos(phi - asymW)) * dichte;
          L = Math.max(0.22, Math.min(L, R0 * 1.12));
          const z0 = z + (R() - 0.5) * 0.1;
          const P0 = ax.fn(z0);
          const dir = [Math.cos(phi), Math.sin(phi), 0], seite = [-Math.sin(phi), Math.cos(phi), 0];
          /* Neigung: oben steiler aufwärts, unten waagerecht bis hängend;
             Fichte: unten durchhängend mit aufgebogener Spitze */
          let e0, e1;
          if (fichte) { e0 = -0.26 + 0.78 * u + (R() - 0.5) * 0.12; e1 = -0.22 + 0.68 * u + (R() - 0.5) * 0.1; }
          else { e0 = 0.06 + 0.58 * u + (R() - 0.5) * 0.1; e1 = -0.04 + 0.52 * u + (R() - 0.5) * 0.08; }
          const P1 = plus(plus(P0, dir, L * 0.5), [0, 0, 1], L * 0.5 * Math.tan(e0));
          const P2 = plus(plus(P0, dir, L), [0, 0, 1], L * Math.tan(e1));
          if (fichte) P2[2] += L * 0.1;                                    // Spitze aufgebogen
          const latMax = latMaxVon(fichte, L);
          const W = latMax * Math.sin(fichte ? 1.45 : AL);
          const hg = hang * (0.85 + 0.3 * R()) * (fichte ? 1.1 - 0.5 * u : 1);
          /* Umriss für den Schatten: Zweigspitzen links, Astspitze, rechts */
          const um = [P0];
          for (const sd of [1, -1]) {
            const reihe = [];
            for (let j = 0; j <= 5; j++) {
              const t = 0.08 + 0.86 * j / 5, Q = bez(P0, P1, P2, t), ll = W * latForm(t);
              reihe.push([Q[0] + seite[0] * sd * ll, Q[1] + seite[1] * sd * ll, Q[2] - ll * hg]);
            }
            if (sd < 0) reihe.reverse();
            if (sd < 0) um.push(plus(P2, dir, 0.1));
            um.push(...reihe);
          }
          /* Schnee: nicht jeder Ast gleich viel, oben weniger */
          const schnee = (0.62 + 0.38 * R()) * (u > 0.85 ? 0.55 : 1) * (R() < 0.06 ? 0.25 : 1);
          const dicke = (fichte ? 0.07 + R() * 0.06 : 0.1 + R() * 0.1) * Math.min(1, 0.5 + L / 2);
          /* Zapfen: oben, einzeln (Nordmann: aufrecht, Fichte: hängend) */
          const zapfen = [];
          if (u > 0.55 && u < 0.95 && R() < (fichte ? 0.25 : 0.16)) {
            const t = 0.45 + R() * 0.4, Q = bez(P0, P1, P2, t);
            zapfen.push({ p: plus(Q, seite, (R() - 0.5) * 0.3), haengt: fichte, l: fichte ? 0.12 + R() * 0.05 : 0.11 + R() * 0.05 });
          }
          rMax = Math.max(rMax, Math.hypot(P2[0], P2[1]) + W * 0.6);
          zweige.push({
            z0: z0, u: u, phi: phi, L: L, W: W, hang: hg, P0: P0, P1: P1, P2: P2, dir: dir, seite: seite, um: um,
            schnee: schnee, dicke: dicke, zapfen: zapfen, mitte: bez(P0, P1, P2, 0.5), klasse: laengenKlasse(L),
            variante: Math.floor(R() * VARIANTEN), hell: 0.94 + R() * 0.12, saat: Math.floor(R() * 1e6), nebenachse: ai > 0
          });
        }
        z += abstand0 * (1 - 0.3 * u) * (0.8 + 0.4 * R());
      }
    }
    /* Wipfeltriebe (je Achse) */
    const wipfel = achsen.map((a) => ({ von: a.fn(a.top - 0.9), bis: plus(a.fn(a.top + 0.12), [0, 0, 0], 0) }));
    if (wipfelArt === 2) wipfel[0] = null;
    /* tote Aststummel am freien Stamm */
    const stummel = [];
    const nst = Math.floor(kroneU / 0.28);
    for (let i = 0; i < nst; i++) {
      const zz = 0.6 + R() * Math.max(0.1, kroneU - 0.6), phi = R() * Math.PI * 2, l = 0.1 + R() * 0.3;
      stummel.push({ a: achse(zz), phi: phi, l: l, e: -0.25 + R() * 0.45 });
    }
    /* Wurzelanläufe: 4–5 Wurzelhälse, die in den Boden tauchen */
    const wurzeln = [];
    const nw = 4 + Math.floor(R() * 2), w0 = R() * Math.PI * 2;
    for (let i = 0; i < nw; i++) wurzeln.push({ phi: w0 + i / nw * Math.PI * 2 + (R() - 0.5) * 0.6, l: 0.2 + R() * 0.25 + r0 * 0.9, h: 0.14 + R() * 0.12 });
    const plan = { fichte, art, A, H, kroneU, R0, rMax, zweige, achse, stammR, r0, wipfel, totSpitze, stummel, wurzeln, hang, helligkeit, wipfelArt };
    PLAENE.set(schl, plan);
    return plan;
  }

  /* =====================================================================
     MALEN
     ===================================================================== */
  /* Bildgrenzen des Baums (relativ zum Fußpunkt, Pixel) */
  function grenzenVon(plan, s) {
    const r = plan.rMax + 0.35;
    return [Math.floor(-r * s) - 3, Math.floor(-(plan.H + 0.5) * KZ * s) - 3, Math.ceil(r * s) + 3, Math.ceil((r * 0.52 + 0.3) * s) + 3];
  }

  function tanneMalen(g, s, F, plan, gier) {
    /* eigene Leinwand im Arbeitsspeicher, höchstens 8 Mio. Bildpunkte
       (bei Maximalzoom wird dann minimal gestreckt) */
    let [x0, y0, x1, y1] = grenzenVon(plan, s);
    let q = 1;
    const flaeche = (x1 - x0) * (y1 - y0);
    if (flaeche > 8e6) q = Math.sqrt(8e6 / flaeche);
    const sq = s * q;
    if (q < 1) [x0, y0, x1, y1] = grenzenVon(plan, sq);
    const c = leinwand(x1 - x0, y1 - y0), cg = c.g;
    cg.setTransform(1, 0, 0, 1, -x0, -y0);
    baumInLeinwand(cg, sq, F, plan, gier, -x0, -y0);
    g.save();
    g.imageSmoothingEnabled = true;
    g.drawImage(c, x0 / q, y0 / q, c.width / q, c.height / q);
    g.restore();
  }

  function baumInLeinwand(g, s, F, plan, gier, ex, ey) {
    const B = blick(gier, s);
    const Z = F.Z, jahr = F.jahr, winter = jahr === "winter";
    const nOben = lichtAuf([0, 0, 1], Z, jahr);
    const T0 = { e: ex, f: ey };

    /* --- Boden am Stamm: im Winter eine bläuliche Schneemulde (unter der
       Krone liegt weniger Schnee), im Frühling Schatten und Nadelstreu --- */
    {
      const r = 0.4 + plan.R0 * 0.22;
      g.save(); g.scale(1, 0.5);
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, r * s);
      if (winter) {
        gr.addColorStop(0, farbe([150, 168, 205], nOben, 1, 0.2));
        gr.addColorStop(0.6, farbe([170, 186, 220], nOben, 1, 0.09));
        gr.addColorStop(1, farbe([190, 204, 232], nOben, 1, 0));
      } else {
        gr.addColorStop(0, farbe([54, 50, 36], nOben, 1, 0.42));
        gr.addColorStop(0.55, farbe([62, 64, 40], nOben, 1, 0.2));
        gr.addColorStop(1, farbe([70, 80, 44], nOben, 1, 0));
      }
      g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r * s, 0, Math.PI * 2); g.fill();
      g.restore();
    }

    const st = stufen(Z, jahr);
    const sB = stufeS(s);
    /* --- Teile nach Tiefe sortiert --- */
    const teile = [];
    teile.push({ tief: -1e9, malen: () => kernMalen(g, B, plan, Z, jahr) });
    const stufenZ = [0];
    for (let zz = Math.max(0.35, plan.kroneU * 0.6); zz < plan.H * 0.9; zz += 0.6) stufenZ.push(zz);
    stufenZ.push(plan.H * 0.9);
    for (let i = 0; i < stufenZ.length - 1; i++) {
      const z0 = stufenZ[i], z1 = stufenZ[i + 1];
      teile.push({ tief: B.tief(plan.achse((z0 + z1) / 2)) - 0.05, malen: () => stammMalen(g, B, plan, z0, z1, Z, jahr, s, winter) });
    }
    /* Wurzelanläufe: hinten vor dem Stamm, vorn danach */
    for (const w of plan.wurzeln) {
      const m = [Math.cos(w.phi) * w.l * 0.5, Math.sin(w.phi) * w.l * 0.5, 0.05];
      teile.push({ tief: B.tief(m) - 0.02, malen: () => wurzelMalen(g, B, plan, w, Z, jahr, s, winter) });
    }
    if (winter) teile.push({ tief: B.tief([0, 0, 0]) + plan.r0 * 2.2, malen: () => schneeKragen(g, B, plan, Z, jahr, s) });
    if (s >= 8) teile.push({ tief: B.tief(plan.achse(plan.kroneU * 0.5)) + 0.01, malen: () => stummelMalen(g, B, plan, Z, jahr, s) });
    for (const zw of plan.zweige) teile.push({ tief: B.tief(zw.mitte), malen: () => wedelMalen(g, B, T0, plan, zw, Z, jahr, s, sB, st, winter) });
    plan.wipfel.forEach((w) => { if (w) teile.push({ tief: B.tief(w.bis), malen: () => wipfelMalen(g, B, plan, w, Z, jahr, s, winter) }); });
    if (plan.totSpitze) teile.push({ tief: B.tief(plan.totSpitze.bis), malen: () => totSpitzeMalen(g, B, plan, Z, jahr, s) });
    teile.sort((a, b) => a.tief - b.tief);
    for (const t of teile) t.malen();
    g.setTransform(1, 0, 0, 1, T0.e, T0.f);
  }

  /* Dunkler Kern: Kegel etwas kleiner als die Krone – Lücken zeigen das
     schattige Innere statt Schnee (so dicht ist eine Tanne innen) */
  function kernMalen(g, B, plan, Z, jahr) {
    const zU = plan.kroneU + 0.2, zO = plan.H * 0.86, rU = plan.R0 * 0.5;
    const unten = B.p(plan.achse(zU)), oben = B.p(plan.achse(zO));
    const s = B.s;
    const lf = lichtAuf([0, 0, 1], Z, jahr);
    g.beginPath();
    g.moveTo(oben[0], oben[1]);
    g.lineTo(unten[0] + rU * s, unten[1]);
    g.ellipse(unten[0], unten[1], rU * s, rU * s * 0.5, 0, 0, Math.PI, false);
    g.closePath();
    const gr = g.createLinearGradient(unten[0] - rU * s, 0, unten[0] + rU * s, 0);
    gr.addColorStop(0, farbe(plan.A.dunkel, lf, 0.78));
    gr.addColorStop(1, farbe(plan.A.tief, lf, 0.7));
    g.fillStyle = gr; g.fill();
  }

  /* Rinde der Tanne: Fichte graubraun mit kleinen runden Schuppen,
     Nordmanntanne hellgrau, glatt mit feinen Querrissen, unten rissig */
  function stammMalen(g, B, plan, z0, z1, Z, jahr, s, winter) {
    const a = B.p(plan.achse(z0)), b = B.p(plan.achse(z1));
    const r0 = plan.stammR(z0) * s, r1 = plan.stammR(z1) * s;
    const lfHell = lichtAuf([LICHT[0], LICHT[1], 0.1], Z, jahr);
    const lfDunkel = lichtAuf([-LICHT[0], -LICHT[1], 0.1], Z, jahr);
    const innen = z0 > plan.kroneU + 0.3 ? 0.55 : 1;       // in der Krone im Schatten
    const A = plan.A;
    const gr = g.createLinearGradient(a[0] - r0, 0, a[0] + r0, 0);
    gr.addColorStop(0, farbe(A.rinde, lfHell, 0.8 * innen));
    gr.addColorStop(0.3, farbe(A.rinde, lfHell, 0.98 * innen));
    gr.addColorStop(0.7, farbe(A.rinde, lfDunkel, 0.8 * innen));
    gr.addColorStop(1, farbe(A.rindeD, lfDunkel, 0.75 * innen));
    g.fillStyle = gr;
    const unten = z0 < 0.05;
    const ay = unten ? a[1] + 0.08 * KZ * s : a[1];         // unten etwas in den Boden
    g.beginPath();
    g.moveTo(a[0] - r0, ay); g.lineTo(b[0] - r1, b[1]); g.lineTo(b[0] + r1, b[1]); g.lineTo(a[0] + r0, ay);
    g.closePath(); g.fill();
    /* Rinde (in einem Zug), nur wo der Stamm frei ist und groß genug */
    const r = (r0 + r1) / 2;
    if (s >= 18 && r > 1.4 && z0 < plan.kroneU + 0.6) {
      const k0 = glatt(18, 30, s);
      const rng = ST.zufall(((z0 * 1000) | 0) + 7 + (plan.fichte ? 3 : 0));
      g.save(); g.clip();
      const h = Math.abs(ay - b[1]);
      const dunkel = [], hell = [];
      if (plan.fichte) {
        /* kleine runde Schuppen, auf dem Zylinder verteilt (am Rand gedrängt) */
        const anz = Math.round(h * r / 5);
        for (let i = 0; i < anz; i++) {
          const k = rng(), yy = ay + (b[1] - ay) * k, rr = r0 + (r1 - r0) * k, xx = a[0] + (b[0] - a[0]) * k;
          const phi = (rng() * 2 - 1) * 1.45, x = xx + Math.sin(phi) * rr;
          const w = rr * (0.12 + rng() * 0.1) * Math.cos(phi) + 0.6;
          (phi < -0.3 ? hell : dunkel).push([x, yy, w]);
        }
        g.lineWidth = Math.max(0.6, s * 0.005);
        for (const [liste, lf, k] of [[dunkel, lfDunkel, 0.72], [hell, lfHell, 1.25]]) {
          g.strokeStyle = farbe(liste === hell ? A.rindeH : A.rindeD, lf, k * innen, 0.55 * k0);
          g.beginPath();
          for (const [x, y, w] of liste) { g.moveTo(x - w, y); g.quadraticCurveTo(x, y + w * 0.8, x + w, y); }
          g.stroke();
        }
      } else {
        /* glatt, fein quer gerissen, zum Fuß hin längsrissig */
        const anz = Math.round(h * r / 9);
        for (let i = 0; i < anz; i++) {
          const k = rng(), yy = ay + (b[1] - ay) * k, rr = r0 + (r1 - r0) * k, xx = a[0] + (b[0] - a[0]) * k;
          const phi = (rng() * 2 - 1) * 1.4, x = xx + Math.sin(phi) * rr;
          const quer = z0 + (z1 - z0) * k > 0.9 || rng() < 0.4;
          (phi < -0.3 ? hell : dunkel).push([x, yy, quer ? rr * (0.1 + rng() * 0.12) * Math.cos(phi) : 0, quer ? 0 : s * (0.04 + rng() * 0.08)]);
        }
        g.lineWidth = Math.max(0.6, s * 0.004);
        for (const [liste, lf, k] of [[dunkel, lfDunkel, 0.7], [hell, lfHell, 1.2]]) {
          g.strokeStyle = farbe(liste === hell ? A.rindeH : A.rindeD, lf, k * innen, 0.5 * k0);
          g.beginPath();
          for (const [x, y, w, l] of liste) { if (w) { g.moveTo(x - w, y); g.lineTo(x + w, y + 0.3); } else { g.moveTo(x, y); g.lineTo(x + 0.4, y - l); } }
          g.stroke();
        }
      }
      /* Flechten und Grünalgen auf der Wetterseite, unten */
      if (!winter && unten) {
        const mg = g.createLinearGradient(a[0] + r0, 0, a[0] + r0 * 0.2, 0);
        mg.addColorStop(0, "rgba(110,128,70,0.35)"); mg.addColorStop(1, "rgba(110,128,70,0)");
        g.fillStyle = mg; g.fillRect(a[0] - r0 * 2, b[1], r0 * 4, h + 2);
      }
      g.restore();
    }
    /* Fuß: weich in den Boden – eine dunkle, weiche Kontaktkante statt einer Ellipsenlinie */
    if (unten) {
      const gg = g.createLinearGradient(0, ay - r0 * 0.9, 0, ay);
      gg.addColorStop(0, "rgba(20,24,30,0)"); gg.addColorStop(1, "rgba(20,24,30,0.4)");
      g.save(); g.beginPath(); g.moveTo(a[0] - r0, ay); g.lineTo(b[0] - r1, b[1]); g.lineTo(b[0] + r1, b[1]); g.lineTo(a[0] + r0, ay); g.closePath(); g.clip();
      g.fillStyle = gg; g.fillRect(a[0] - r0 - 2, ay - r0 * 0.9, r0 * 2 + 4, r0 * 0.9 + 2);
      g.restore();
    }
  }

  /* Ein Wurzelanlauf: flacher Wulst vom Stammfuß schräg in den Boden –
     zwei Flanken (eine im Licht, eine im Schatten), läuft nach außen weich
     aus (Deckkraft), im Winter verschwindet er unter der Schneewehe */
  function wurzelMalen(g, B, plan, w, Z, jahr, s, winter) {
    if (plan.r0 * s < 1.5) return;
    const d = [Math.cos(w.phi), Math.sin(w.phi), 0], q = [-d[1], d[0], 0];
    const r0 = plan.r0, n = 5;
    const grat = [], li = [], re = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, ab = r0 * 0.85 + w.l * t, hz = w.h * Math.pow(1 - t, 1.5), br = r0 * 0.55 * (1 - 0.6 * t);
      grat.push(B.p([d[0] * ab, d[1] * ab, hz]));
      li.push(B.p([d[0] * ab + q[0] * br, d[1] * ab + q[1] * br, 0]));
      re.push(B.p([d[0] * ab - q[0] * br, d[1] * ab - q[1] * br, 0]));
    }
    const a = grat[0], e = grat[n];
    for (const [seite, sd] of [[li, 1], [re, -1]]) {
      const nn = norm([q[0] * sd, q[1] * sd, 0.9]);
      const lf = lichtAuf(B.n(nn), Z, jahr);
      const gr = g.createLinearGradient(a[0], a[1], e[0], e[1]);
      gr.addColorStop(0, farbe(plan.A.rinde, lf, 0.92));
      gr.addColorStop(0.55, farbe(plan.A.rinde, lf, 0.85, 0.85));
      gr.addColorStop(1, farbe(plan.A.rindeD, lf, 0.8, 0));
      g.fillStyle = gr;
      g.beginPath();
      g.moveTo(grat[0][0], grat[0][1]);
      for (let i = 1; i <= n; i++) g.lineTo(grat[i][0], grat[i][1]);
      for (let i = n; i >= 0; i--) g.lineTo(seite[i][0], seite[i][1]);
      g.closePath(); g.fill();
    }
  }

  /* Schnee um den Stammfuß: eine weiche Wehe, in die der Stamm taucht
     (bedeckt die Wurzelenden) */
  function schneeKragen(g, B, plan, Z, jahr, s) {
    const r = (plan.r0 * 1.6 + 0.35) * s;
    if (r < 2) return;
    const lf = lichtAuf([0, 0, 1], Z, jahr);
    const a = B.p([0, 0, 0]);
    const y = a[1] - plan.r0 * s * 0.15;
    g.save();
    g.translate(a[0], y); g.scale(1, 0.5);
    const gr = g.createRadialGradient(-r * 0.15, 0, 0, 0, 0, r);
    gr.addColorStop(0, farbe([246, 247, 250], lf, 1, 0.98));
    gr.addColorStop(0.55, farbe([244, 246, 250], lf, 1, 0.85));
    gr.addColorStop(1, farbe([240, 244, 250], lf, 1, 0));
    g.fillStyle = gr;
    /* nur die vordere Hälfte (hinten steht der Stamm davor) */
    g.beginPath(); g.moveTo(-r, 0); g.arc(0, 0, r, Math.PI, 0, true); g.closePath(); g.fill();
    g.restore();
  }

  function stummelMalen(g, B, plan, Z, jahr, s) {
    if (!plan.stummel.length) return;
    g.save();
    g.globalAlpha = glatt(8, 14, s);
    g.strokeStyle = farbe(plan.A.rindeD, lichtAuf([0, 0, 1], Z, jahr), 0.95);
    g.lineWidth = Math.max(0.8, s * 0.018); g.lineCap = "round";
    g.beginPath();
    for (const st2 of plan.stummel) {
      const e = [Math.cos(st2.phi) * Math.cos(st2.e), Math.sin(st2.phi) * Math.cos(st2.e), Math.sin(st2.e)];
      const a = B.p(st2.a), b = B.p(plus(st2.a, e, st2.l));
      g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]);
      if (s >= 40) { const m = B.p(plus(st2.a, e, st2.l * 0.6)); g.moveTo(m[0], m[1]); g.lineTo(m[0] + s * 0.05, m[1] - s * 0.035); }
    }
    g.stroke();
    g.restore();
  }

  /* Ein Wedel: zwei Hälften als Vorlage in ihre Lage gelegt, darauf der Schnee */
  function wedelMalen(g, B, T0, plan, zw, Z, jahr, s, sB, st, winter) {
    const p0 = B.p(zw.P0), p2 = B.p(zw.P2);
    const U3 = norm([zw.P2[0] - zw.P0[0], zw.P2[1] - zw.P0[1], zw.P2[2] - zw.P0[2]]);
    const krone = norm([zw.dir[0] * 0.8, zw.dir[1] * 0.8, 0.6]);
    const kl = zw.klasse;
    const vor = wedelVorlage(plan.art, jahr, sB, kl, zw.variante);
    const k = 1 / vor.sB;
    const ax = (p2[0] - p0[0]) / vor.mL, ay = (p2[1] - p0[1]) / vor.mL;
    /* Verkürzung: zeigt der Ast auf den Betrachter, ist er im Bild kurz –
       dann wirkt die Mitte dunkler (man sieht ins Innere) */
    const verk = Math.hypot(p2[0] - p0[0], p2[1] - p0[1]) / Math.max(1e-6, zw.L * s * 0.72);
    const haelften = [];
    for (const sd of [1, -1]) {
      const V3 = [zw.seite[0] * sd * zw.W, zw.seite[1] * sd * zw.W, -zw.W * zw.hang];
      const pv = B.p(plus(zw.P0, V3, 1));
      const bx = (pv[0] - p0[0]) / vor.mW, by = (pv[1] - p0[1]) / vor.mW;
      let n = norm(kreuz(U3, V3)); if (n[2] < 0) n = [-n[0], -n[1], -n[2]];
      const nk = B.n(n);
      const vonUnten = punkt(nk, AUGE) < 0;
      const nf = norm([n[0] * 0.4 + krone[0] * 0.6, n[1] * 0.4 + krone[1] * 0.6, n[2] * 0.4 + krone[2] * 0.6]);
      const nfk = B.n(nf);
      const lf = lichtAuf(nfk, Z, jahr);
      /* Sonnenseite etwas betonen, innen/unten sanft dunkler */
      const sonne = Math.max(0, punkt(nfk, LICHT));
      const ao = (0.8 + 0.2 * zw.u) * (vonUnten ? 0.85 : 1) * plan.helligkeit * zw.hell * (0.8 + 0.34 * sonne) * (0.86 + 0.14 * Math.min(1, verk)) * (winter ? 1 : 0.95);
      const mitte = plus(plus(zw.P0, U3, zw.L * 0.5), V3, 0.4);
      haelften.push({ sd, bx, by, lf, ao, tief: B.tief(mitte), V3 });
    }
    haelften.sort((a, b) => a.tief - b.tief);
    /* Vorlagenpunkt (px, py) → Bild: Ursprung der Vorlage (ox, oy) liegt auf dem Astansatz */
    const setze = (h, dy) => {
      g.setTransform(ax * k, ay * k, h.bx * k, h.by * k,
        T0.e + p0[0] - (ax * vor.ox + h.bx * vor.oy) * k,
        T0.f + p0[1] + dy - (ay * vor.ox + h.by * vor.oy) * k);
    };
    /* jede Hälfte eine andere Vorlage – sonst wären die Wedel spiegelgleich */
    const vari = (h) => (zw.variante + (h.sd > 0 ? 0 : 1)) % VARIANTEN;
    const wSchl = (v) => "tw|" + plan.art + "|" + jahr + "|" + sB.toFixed(2) + "|" + kl + "|" + v;
    /* Unterseite: dieselbe Hälfte dunkler, um die Wedeldicke tiefer und
       halb deckend – unter jeder Etage die schattige Zweigmasse. Weich
       eingeblendet (kein Sprung beim Zoomen), oben nicht nötig. */
    const unterA = zw.u < 0.8 ? 0.7 : 0;
    if (unterA > 0.02) {
      g.globalAlpha = unterA;
      for (const h of haelften) {
        const v = vari(h), i = Math.max(0, stufeFuer(st, h.lf, h.ao) - 4);
        setze(h, zw.dicke * KZ * s);
        g.drawImage(getoent(wSchl(v), wedelVorlage(plan.art, jahr, sB, kl, v), st, i), 0, 0);
      }
      g.globalAlpha = 1;
    }
    for (const h of haelften) {
      const v = vari(h);
      setze(h, 0);
      g.drawImage(getoent(wSchl(v), wedelVorlage(plan.art, jahr, sB, kl, v), st, stufeFuer(st, h.lf, h.ao)), 0, 0);
    }
    g.setTransform(1, 0, 0, 1, T0.e, T0.f);
    if (winter && zw.schnee > 0.05) schneePolster(g, B, plan, zw, Z, jahr, s);
    for (const zp of zw.zapfen) zapfenMalen(g, B, plan, zp, Z, jahr, s, winter);
  }

  /* Geschlossenes Vieleck weich runden (Chaikin, zwei Durchgänge) */
  function rund(pts, n) {
    for (let k = 0; k < (n || 2); k++) {
      const aus = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        aus.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
      }
      pts = aus;
    }
    return pts;
  }
  /* ---------------- Schneepolster auf einem Ast ----------------
     Schnee liegt OBEN auf dem Ast als Folge weicher Klumpen (waagerecht,
     nicht in die hängende Wedelebene gekippt). Jeder Klumpen ist eine
     flache Kuppel im Raum: Grundriss als Ellipse mit welligem Rand, darauf
     Höhenringe bis zur Kuppe, jeder Ring ins Bild gerechnet und von außen
     (unten, bläulich) nach innen (oben, warmweiß) gemalt – so entsteht ein
     gewölbtes Polster statt einer Platte. Bei der Nordmanntanne decken die
     Klumpen fast den ganzen flachen Zweig (die Polster der Nachbaräste
     stoßen aneinander → verschneite Etagen), bei der Fichte liegt der
     Schnee schmal entlang des Asts.
     Reihenfolge: Schlagschatten auf die Nadeln, dunkle Kontaktkante,
     Kuppel-Ringe, durchstechende Nadelspitzen, Glitzer. */
  function schneePolster(g, B, plan, zw, Z, jahr, s) {
    const R = ST.zufall(zw.saat + 3);
    const fichte = plan.fichte;
    const deck = (fichte ? 0.36 + 0.14 * R() : 0.8 + 0.14 * R()) * (0.8 + 0.2 * zw.schnee);
    const dick = (0.1 + 0.1 * zw.schnee) * Math.min(1, 0.55 + zw.L / 2.4);
    const hoch = dick * KZ * s;                            // Dicke im Bild
    if (hoch < 0.3) return;
    const t0 = 0.12 + R() * 0.08, t1 = (fichte ? 0.9 : 0.97) - R() * 0.05;
    const n = Math.max(2, Math.round((fichte ? 3 : 4) + zw.L * (fichte ? 0.8 : 1.2) + R()));
    const ringe = klemm(Math.round(hoch / 2) + 2, 2, 10);
    /* bei kleinem Maßstab verliert die Kantenglättung winziger Klumpen
       Deckung – etwas größer malen, damit die Helligkeit gleich bleibt */
    const kl = 1 + 0.28 * (1 - glatt(8, 32, s));
    const klumpen = [];
    for (let i = 0; i < n; i++) {
      const t = t0 + (t1 - t0) * (i + 0.5 + (R() - 0.5) * 0.5) / n;
      const Q = bez(zw.P0, zw.P1, zw.P2, t);
      const halb = zw.W * latForm(t) * deck;
      const o = (R() * 2 - 1) * halb * (fichte ? 0.2 : 0.38);
      const ra = (t1 - t0) * zw.L / n * (0.8 + 0.45 * R()) * kl;          // längs
      const rq = Math.max(0.05, halb * (fichte ? 0.95 : 0.7) * (0.8 + 0.35 * R())) * kl;   // quer
      const d = dick * (0.75 + 0.5 * R());
      const M = [Q[0] + zw.seite[0] * o, Q[1] + zw.seite[1] * o, Q[2] + 0.02 - Math.abs(o) * zw.hang * 0.25];
      const m = 12, ph = R() * 6, amp = 0.12 + 0.12 * R();
      const rand = [];
      for (let k = 0; k < m; k++) {
        const w = k / m * Math.PI * 2, st = 1 + amp * Math.sin(w * 3 + ph) + 0.08 * (R() - 0.5);
        rand.push([Math.cos(w) * ra * st, Math.sin(w) * rq * st]);
      }
      /* Höhenringe: Ring j auf Höhe d·j/ringe, eingezogen wie eine Kuppel */
      const lagen = [];
      for (let j = 0; j <= ringe; j++) {
        const h = j / ringe, sc = Math.sqrt(Math.max(0, 1 - h * h * 0.92));
        lagen.push(rund(rand.map(([a, q]) => B.p([M[0] + (zw.dir[0] * a + zw.seite[0] * q) * sc, M[1] + (zw.dir[1] * a + zw.seite[1] * q) * sc, M[2] + d * h])), 1));
      }
      klumpen.push({ lagen, tief: B.tief(M) });
    }
    klumpen.sort((a, b) => a.tief - b.tief);
    const lfO = lichtAuf([0, 0, 1], Z, jahr);
    const nS = B.n(norm([zw.dir[0] * 0.5, zw.dir[1] * 0.5, 0.25]));
    const lfS = lichtAuf([nS[0] * 0.5 + 0.45, nS[1] * 0.5 + 0.45, nS[2]], Z, jahr);
    const alle = (j, f) => { g.beginPath(); for (const k of klumpen) f(k.lagen[j]); };
    /* 1. Schlagschatten auf die Nadeln darunter (nur auf schon Gemaltem) */
    g.save();
    g.globalCompositeOperation = "source-atop";
    g.fillStyle = "rgba(12,26,34," + (0.26 * glatt(6, 20, s)).toFixed(3) + ")";
    alle(0, (p) => vieleckDazu(g, p.map((q) => [q[0] + hoch * 0.7, q[1] + hoch * 0.8])));
    g.fill();
    g.restore();
    /* 2. Kontaktkante: dunkler Saum unter dem Polster */
    const kk = Math.max(0.7, s * 0.012);
    g.fillStyle = farbe([80, 98, 120], lfS, 1, 0.55 * Math.min(1, s * 0.012 / 0.7));
    alle(0, (p) => vieleckDazu(g, p.map((q) => [q[0], q[1] + kk]))); g.fill();
    /* 3. Kuppel: Ringe von außen/unten (bläulich, im Schatten) nach
       innen/oben (warmweiß); jeder Ring mit Licht von links */
    let xa = Infinity, xb = -Infinity;
    for (const k of klumpen) for (const p of k.lagen[0]) { xa = Math.min(xa, p[0]); xb = Math.max(xb, p[0]); }
    for (let j = 0; j <= ringe; j++) {
      const h = j / ringe;
      const unten = [196 + 56 * h, 208 + 43 * h, 232 + 18 * h];
      const lf = [lfS[0] + (lfO[0] - lfS[0]) * h, lfS[1] + (lfO[1] - lfS[1]) * h, lfS[2] + (lfO[2] - lfS[2]) * h];
      const gr = g.createLinearGradient(xa, 0, xb, 0);
      gr.addColorStop(0, farbe([unten[0] + 6, unten[1] + 4, unten[2]], lf, 1.04));
      gr.addColorStop(1, farbe([unten[0] - 10, unten[1] - 6, unten[2] + 2], lf, 0.94));
      g.fillStyle = gr;
      alle(j, (p) => vieleckDazu(g, p)); g.fill();
    }
    /* 4. Nadelspitzen stechen am Rand durch */
    if (s >= 24) {
      const k = glatt(24, 40, s);
      g.strokeStyle = farbe(plan.A.dunkel, lfS, 0.9, 0.7 * k); g.lineWidth = Math.max(0.7, s * 0.004);
      g.beginPath();
      for (const kl of klumpen) {
        const p0 = kl.lagen[0], m = 2 + Math.floor(R() * 3);
        for (let i = 0; i < m; i++) {
          const p = p0[Math.floor(p0.length * (0.1 + 0.8 * R()))], l = s * (0.018 + 0.02 * R()), w = R() * Math.PI;
          g.moveTo(p[0], p[1] - hoch * 0.1); g.lineTo(p[0] + Math.cos(w) * l, p[1] - hoch * 0.1 + Math.sin(w) * l * 0.5);
        }
      }
      g.stroke();
    }
    /* 5. Glitzer aus der Nähe */
    if (s > 60) {
      g.fillStyle = "rgba(255,255,255," + (0.6 + 0.4 * (1 - (Z.nacht || 0))).toFixed(2) + ")";
      for (const kl of klumpen) {
        const p0 = kl.lagen[Math.max(1, ringe - 1)];
        for (let i = 0; i < 3; i++) { const a = p0[Math.floor(R() * p0.length)], b = p0[Math.floor(R() * p0.length)], f = R(); g.fillRect(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, 1.2, 1.2); }
      }
    }
  }

  function zapfenMalen(g, B, plan, zp, Z, jahr, s, winter) {
    const al = glatt(11, 18, s);
    if (al <= 0.01) return;
    const p = B.p(zp.p), l = zp.l * s, b = l * 0.3;
    const lf = lichtAuf([-0.5, 0.5, 0.5], Z, jahr);
    const c = plan.fichte ? [118, 80, 52] : [96, 74, 62];
    const cx = p[0], cy = zp.haengt ? p[1] + l * 0.55 : p[1] - l * 0.5;
    g.save(); g.globalAlpha = al;
    const gr = g.createLinearGradient(cx - b, 0, cx + b, 0);
    gr.addColorStop(0, farbe(c, lf, 1.15)); gr.addColorStop(1, farbe(c, lf, 0.55));
    g.fillStyle = gr;
    g.beginPath(); g.ellipse(cx, cy, b, l * 0.5, 0, 0, Math.PI * 2); g.fill();
    if (s >= 50) {
      g.strokeStyle = farbe(c, lf, 0.45, 0.8); g.lineWidth = Math.max(0.5, s * 0.004);
      g.beginPath();
      for (let i = 1; i < 5; i++) { const yy = cy - l * 0.5 + l * i / 5; g.moveTo(cx - b * 0.85, yy - b * 0.25); g.quadraticCurveTo(cx, yy + b * 0.3, cx + b * 0.85, yy - b * 0.25); }
      g.stroke();
    }
    if (winter && !zp.haengt) { g.fillStyle = farbe([250, 252, 255], lichtAuf([0, 0, 1], Z, jahr), 1); g.beginPath(); g.ellipse(cx, cy - l * 0.45, b * 0.9, b * 0.35, 0, 0, Math.PI * 2); g.fill(); }
    g.restore();
  }

  function wipfelMalen(g, B, plan, w, Z, jahr, s, winter) {
    const a = B.p(w.von), b = B.p(w.bis);
    const lf = lichtAuf([-0.3, 0.3, 0.9], Z, jahr);
    const A = plan.A;
    const br = Math.max(1, s * 0.06);
    const gr = g.createLinearGradient(a[0] - br, 0, a[0] + br, 0);
    gr.addColorStop(0, farbe(A.hell, lf, 1)); gr.addColorStop(1, farbe(A.dunkel, lf, 0.9));
    g.fillStyle = gr;
    g.beginPath(); g.moveTo(a[0] - br, a[1]); g.quadraticCurveTo(a[0] - br * 0.4, (a[1] + b[1]) / 2, b[0], b[1]); g.quadraticCurveTo(a[0] + br * 0.4, (a[1] + b[1]) / 2, a[0] + br, a[1]); g.closePath(); g.fill();
    if (jahr === "fruehling") { g.strokeStyle = farbe(A.trieb, lf, 1); g.lineWidth = Math.max(1, s * 0.035); g.beginPath(); g.moveTo(b[0], b[1] + s * 0.28); g.lineTo(b[0], b[1]); g.stroke(); }
    if (winter) {
      const lfO = lichtAuf([0, 0, 1], Z, jahr);
      g.fillStyle = farbe([250, 250, 248], lfO, 1);
      g.beginPath(); g.ellipse(a[0], a[1] - br * 0.3, br * 1.2, br * 0.5, 0, 0, Math.PI * 2); g.fill();
    }
  }
  /* abgestorbener alter Wipfel nach Sturmbruch: grauer, kahler Spieß */
  function totSpitzeMalen(g, B, plan, Z, jahr, s) {
    const a = B.p(plan.totSpitze.von), b = B.p(plan.totSpitze.bis);
    g.strokeStyle = farbe([128, 120, 110], lichtAuf([-0.4, 0.4, 0.5], Z, jahr), 1);
    g.lineWidth = Math.max(0.8, s * 0.03); g.lineCap = "round";
    g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    g.lineCap = "butt";
  }

  /* ---------------- Schatten: flach auf den Boden gelegt ----------------
     In geringerer Auflösung auf eine eigene Leinwand gemalt und dann weich
     vergrößert ins Schattenbild gelegt (ersetzt das teure Weichzeichnen
     der ganzen Sprite-Fläche). */
  function tanneSchatten(g, s, plan, gier) {
    const B = blick(gier, s);
    const m = g.getTransform();
    /* Rechteck des Schattens */
    const pts = [];
    const n = 6, links = [], rechts = [];
    for (let i = 0; i <= n; i++) {
      const z = plan.H * 0.95 * i / n, p = plan.achse(z), r = plan.stammR(z);
      const a = B.boden(p);
      links.push([a[0] - r * s, a[1]]); rechts.push([a[0] + r * s, a[1]]);
    }
    pts.push(links.concat(rechts.reverse()));
    const kegel = [];
    for (let z = plan.kroneU + 0.3; z < plan.H * 0.9; z += 0.45) {
      const u = (z - plan.kroneU) / (plan.H - plan.kroneU);
      const r = plan.R0 * 0.5 * (1 - u) * s;
      kegel.push([B.boden(plan.achse(z)), r]);
    }
    for (const zw of plan.zweige) pts.push(zw.um.map(B.boden));
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of pts) for (const q of p) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }
    const kr = (plan.stammR(0) * 3 + 0.35) * s;
    x0 = Math.min(x0, -kr) - 4; y0 = Math.min(y0, -kr) - 4; x1 = Math.max(x1, kr) + 4; y1 = Math.max(y1, kr * 0.5) + 4;
    /* Auflösung: so grob, dass das Hochziehen die Kante weich macht */
    const q = klemm(1 / (s * 0.035 * 1.15), 0.22, 1);
    const c = leinwand((x1 - x0) * q + 2, (y1 - y0) * q + 2), cg = c.g;
    cg.setTransform(q, 0, 0, q, -x0 * q + 1, -y0 * q + 1);
    cg.fillStyle = "#000";
    cg.beginPath();
    for (const p of pts) vieleckDazu(cg, p);
    for (const [a, r] of kegel) { cg.moveTo(a[0] + r, a[1]); cg.ellipse(a[0], a[1], r, r * 0.5, 0, 0, Math.PI * 2); }
    /* Kontaktschatten: der Stamm steht im Boden */
    cg.moveTo(kr, 0); cg.ellipse(0, 0, kr, kr * 0.5, 0, 0, Math.PI * 2);
    cg.fill();
    g.save();
    g.setTransform(1, 0, 0, 1, m.e, m.f);
    g.filter = "none";
    g.imageSmoothingEnabled = true;
    g.drawImage(c, x0 - 1 / q, y0 - 1 / q, c.width / q, c.height / q);
    g.restore();
  }

  /* Für Prüfbilder: Vorlagen und Baupläne von außen ansehen */
  (ST.naturPruef = ST.naturPruef || {}).tanne = { wedelVorlage, bauplan };

  /* =====================================================================
     MODELL
     ===================================================================== */
  ST.modell("tanne", {
    name: "Tanne", gruppe: "Natur", grund: [4.4, 4.4], hoehe: 14,
    bauen(M, o) {
      const plan = bauplan(o.saat == null ? 7 : o.saat);
      const figur = {
        x: 0, y: 0, z: 0, breite: (plan.rMax + 0.6) / 0.6, hoehe: plan.H + 0.4, schatten: true,
        malen(g, s, F) {
          if (F.schatten) { tanneSchatten(g, s, plan, figur._gier == null ? schaetzeGier(o) : figur._gier); return; }
          figur._gier = F.gier || 0;
          tanneMalen(g, s, F, plan, figur._gier);
        }
      };
      M.teil("baum", { mitte: [0, 0, 1] });
      M.figur(figur);
      huelle(M, o, plan.rMax, plan.H, 1.0);
    }
  });

  /* Drehung des Sprites schätzen (für den Schatten, falls der Kern sie
     nicht mitgibt): Objekt-Drehung plus Kameradrehung */
  function schaetzeGier(o) {
    /* Bäume malt der Kern rundum gleich (ohneDrehung) – dann immer 0° */
    if (ST.MODELLE.tanne && ST.MODELLE.tanne.ohneDrehung) return 0;
    return ((o.objekt && o.objekt.gier) || 0) + ((ST.kamera && ST.kamera.dreh) || 0) * 90;
  }

  /* Unsichtbare Hülle: das Sprite muss den langen Schatten mit fassen
     (der Kern rechnet bei Figuren nur die Figur selbst in die Grenzen).
     Nur so groß wie nötig: ein Achteck um den Fuß (Kronenumriss am Boden)
     und ein Fleck an der Schattenspitze – kein volles Quadrat. */
  function huelle(M, o, r, H, rSpitze) {
    M.teil("huelle", { schatten: false, mitte: [0, 0, -50] });
    const leer = { malen: null, keinLicht: true, keinAo: true };
    const acht = [];
    for (let i = 0; i < 8; i++) { const w = (i + 0.5) / 8 * Math.PI * 2; acht.push([Math.cos(w) * r, Math.sin(w) * r]); }
    M.flaeche(Object.assign({ name: "huelle", o: [0, 0, 0], u: [1, 0, 0], v: [0, 1, 0], w: 1, h: 1, umriss: acht }, leer));
    const gr = schaetzeGier(o || {}) * Math.PI / 180, c = Math.cos(gr), sn = Math.sin(gr);
    /* Schattenspitze im Kameraraum → Modellraum zurückdrehen */
    const a = SX * H, b = SY * H;
    const x = a * c + b * sn, y = -a * sn + b * c;
    M.flaeche(Object.assign({ name: "huelle-schatten", o: [x - rSpitze, y - rSpitze, 0], u: [1, 0, 0], v: [0, 1, 0], w: 2 * rSpitze, h: 2 * rSpitze }, leer));
  }
})();
