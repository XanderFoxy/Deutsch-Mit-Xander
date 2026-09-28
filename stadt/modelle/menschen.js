/* =====================================================================
   BAUKASTEN-STADT — DIE MENSCHEN VON WINTERHAUSEN (lebende Modelle)
   ---------------------------------------------------------------------
   XANDER: „… wie die kleinen Menschen realistisch …" – „Das soll keine
   Comic Grafik sein. Das soll noch viel mehr am Realismus dran sein." –
   „Richtig filigran."

   Vier Arten Leute, jede jedes Bild neu gemalt (kein Sprite), mit
   echten Proportionen (Erwachsene um 1,75 m, Kinder um 1,2 m):
     spaziergaenger  geht auf dem Pflaster, Wintermantel, Mütze, Schal,
                     Armschwung; manche mit den Händen in den Taschen;
                     bleibt an Marktbuden stehen und schaut
     kind_schlitten  Kind zieht einen Davoser Holzschlitten (mal leer,
                     mal mit einem Tannenbäumchen oder Päckchen); im
                     Frühling einen Bollerwagen mit Blumentöpfen
     schlittschuh    läuft Bögen auf dem zugefrorenen See, legt sich in
                     die Kurve, stößt sich im Wechsel ab (nur im Winter)
     marktbesucher   steht an einer Bude, trinkt Glühwein, Dampf steigt
                     aus der Tasse (im Frühling Kaffee ohne Dampf)

   Gezeichnet mit ST.gestalt (stadt/himmel.js): kleine 3D-Körper aus
   Ellipsoiden und Kapseln, im Licht der Szene schattiert (Licht von
   links), nachts von Laternen und Buden warm angestrahlt. Keine
   Strichmännchen, keine Comicgesichter: Gesichter nur als leise Form
   (Nase, Augenschatten), erst bei starkem Zoom.

   Nachts gehen weniger Leute (Kinder sind daheim, ein Drittel der
   Spaziergänger bleibt). Im Frühling leichtere Jacken ohne Mütze, das
   Kind zieht einen Bollerwagen mit Tulpentöpfen, die Schlittschuhläufer
   bleiben weg (das Eis ist geschmolzen), aus der Tasse dampft nichts.
   Varianten über o.saat: Größe, Kleidung, Farben, Mütze/Hut, Haar,
   Hände in den Manteltaschen, Ladung des Schlittens.

   BEWEGUNG: Spaziergänger bleiben auf dem Pflaster (ST.boden.wert(…,0)),
   weichen Häusern, Buden, Bäumen und einander aus, gehen über die
   Brücke, halten an Buden an und entfernen sich nicht weiter als 40 m
   von ihrem Startplatz (Kinder 16 m, auch über Schnee). Wer sich in
   einer Nische festläuft, sucht nach 1,5 s eine neue freie Richtung.

   ZUM TESTEN: stadt.html?neu=1&leute=1&dazu=menschen setzt Statisten
   nach der Liste ST.MENSCHEN_PLAETZE in Winterhausen. In der Werkbank
   (werkbank=spaziergaenger&dazu=menschen) gehen sie auf der Stelle.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const GS = ST.gestalt;
  if (!GS) { console.error("menschen.js braucht ST.gestalt aus stadt/himmel.js"); return; }
  const V = GS.v, plus = V.plus, minus = V.minus, mal = V.mal, pkt = V.pkt, kreuz = V.kreuz, einheit = V.einheit, mix = V.mix, klemm = V.klemm, glatt = V.glatt;
  const TAU = Math.PI * 2;
  const q = new URLSearchParams(location.search);
  const WERKBANK = !!q.get("werkbank");
  const AUGE = ST.ZUM_AUGE;

  /* ---------------- Farben ---------------- */
  const MANTEL_W = [[52, 54, 60], [36, 46, 70], [160, 122, 84], [46, 70, 54], [108, 34, 40], [104, 104, 108], [34, 32, 34], [86, 60, 44], [70, 80, 58], [140, 30, 36], [196, 184, 162], [60, 74, 96]];
  const MANTEL_F = [[176, 156, 124], [120, 150, 180], [204, 194, 172], [86, 110, 150], [150, 160, 120], [214, 204, 184], [96, 106, 126], [184, 124, 112], [90, 120, 90]];
  const SCHAL = [[168, 34, 36], [212, 202, 180], [40, 88, 60], [186, 146, 52], [58, 86, 136], [120, 40, 90], [96, 96, 100], [150, 60, 40]];
  const MUETZE = [[160, 30, 34], [36, 40, 60], [214, 208, 198], [70, 72, 76], [40, 80, 58], [190, 150, 60], [120, 70, 40], [90, 40, 80]];
  const HOSE = [[38, 40, 48], [50, 64, 90], [66, 54, 44], [80, 80, 84], [30, 30, 34], [58, 62, 70]];
  const SCHUH = [[50, 36, 26], [26, 24, 24], [74, 52, 36]];
  const HAUT = [[236, 198, 172], [228, 184, 154], [214, 164, 132], [178, 126, 94], [126, 86, 62]];
  const HAAR = [[58, 40, 28], [28, 24, 22], [190, 154, 98], [168, 166, 162], [118, 62, 36], [92, 64, 40]];
  const KINDFARBE = [[196, 40, 40], [40, 96, 170], [226, 176, 40], [50, 140, 80], [220, 110, 40], [140, 60, 150], [30, 130, 150]];
  const TASSE = [[168, 30, 36], [236, 232, 222], [40, 70, 130], [44, 96, 60]];
  const HOLZ = [176, 120, 66], HOLZ_D = [128, 82, 44], EISEN = [70, 72, 78], KUFE = [196, 200, 208];

  /* Ausstattung aus der Saat (je Jahreszeit einmal gerechnet) */
  function ausstattung(o, art, jahr) {
    if (o._aus && o._aus.jahr === jahr && o._aus.art === art) return o._aus;
    const r = ST.zufall(((o.saat | 0) ^ 0x5bd1e995) + 7);
    const w = (L) => L[Math.floor(r() * L.length) % L.length];
    const kind = art === "kind";
    const winter = jahr === "winter" || jahr === "herbst";
    const frau = r() < 0.5;
    const a = {
      art: art, jahr: jahr, kind: kind, frau: frau,
      H: kind ? 1.12 + r() * 0.18 : (frau ? 1.6 + r() * 0.16 : 1.7 + r() * 0.18),
      haut: w(HAUT), haar: w(HAAR), hose: w(HOSE), schuh: w(SCHUH),
      breit: 0.94 + r() * 0.14
    };
    if (a.haar === HAAR[3] && kind) a.haar = HAAR[0];
    a.haarLang = frau && r() < 0.6;
    if (kind) {
      a.mantel = w(KINDFARBE); a.hose = r() < 0.5 ? a.mantel.map((x) => x * 0.7) : w(HOSE);
      a.saum = 0.42; a.muetze = winter ? { art: "bommel", farbe: w(KINDFARBE.concat(MUETZE)) } : (r() < 0.4 ? { art: "kappe", farbe: w(KINDFARBE) } : null);
      a.schal = winter ? w(SCHAL.concat(KINDFARBE)) : null;
      a.handschuh = winter ? w(KINDFARBE.concat([[60, 60, 64]])) : null;
    } else if (winter) {
      a.mantel = w(MANTEL_W); a.saum = r() < 0.65 ? 0.3 + r() * 0.06 : 0.44;
      const m = r();
      a.muetze = m < 0.5 ? { art: r() < 0.5 ? "bommel" : "strick", farbe: w(MUETZE) } : m < 0.72 ? { art: "hut", farbe: w([[60, 50, 42], [40, 40, 44], [96, 80, 60], [70, 34, 30]]) } : m < 0.84 ? { art: "pelz", farbe: w([[90, 70, 52], [60, 54, 50], [180, 170, 156]]) } : null;
      a.schal = r() < 0.85 ? w(SCHAL) : null;
      a.handschuh = r() < 0.7 ? w([[40, 34, 30], [70, 50, 36], [30, 30, 32], [140, 30, 34]]) : null;
    } else {
      a.mantel = w(MANTEL_F); a.saum = r() < 0.3 ? 0.36 : 0.46;
      a.muetze = r() < 0.2 ? { art: "kappe", farbe: w([[70, 74, 80], [150, 130, 100], [40, 50, 70]]) } : null;
      a.schal = r() < 0.2 ? w(SCHAL) : null;
      a.handschuh = null;
    }
    a.taschen = !kind && r() < 0.3;
    a.tempo = kind ? 0.8 + r() * 0.15 : 1.05 + r() * 0.3;
    a.tasse = w(TASSE);
    o._aus = a;
    return a;
  }

  /* =====================================================================
     DAS SKELETT UND DER KÖRPER
     lokal: x = rechts, y = vorn (Blickrichtung), z = oben; Ursprung am Boden
     ===================================================================== */
  function masse(a) {
    const H = a.H;
    return a.kind
      ? { H: H, huefte: 0.45 * H, schulter: 0.765 * H, sb: 0.105 * H, hb: 0.058 * H, oa: 0.16 * H, ua: 0.145 * H, hals: 0.79 * H, kopf: 0.895 * H, kr: 0.096 * H }
      : { H: H, huefte: 0.53 * H, schulter: 0.815 * H, sb: 0.1 * H * a.breit, hb: 0.05 * H * a.breit, oa: 0.172 * H, ua: 0.152 * H, hals: 0.84 * H, kopf: 0.927 * H, kr: 0.066 * H };
  }
  function drehZ(v, w) { const c = Math.cos(w), s = Math.sin(w); return [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]]; }

  /* Zweigelenk-Kette (Arm): Ellbogen so, dass die Hand das Ziel trifft */
  function ik(S, T, L1, L2, pol) {
    const d = minus(T, S);
    let l = Math.hypot(d[0], d[1], d[2]);
    const dir = mal(d, 1 / (l || 1));
    l = klemm(l, Math.abs(L1 - L2) + 1e-3, L1 + L2 - 1e-3);
    const ca = (L1 * L1 + l * l - L2 * L2) / (2 * L1 * l), h = L1 * Math.sqrt(Math.max(0, 1 - ca * ca));
    const pp = einheit(minus(pol, mal(dir, pkt(pol, dir))));
    return [plus(S, plus(mal(dir, ca * L1), mal(pp, h))), plus(S, mal(dir, l))];
  }

  function skelett(a, P) {
    const m = masse(a), H = m.H;
    const bl = m.huefte, Lt = bl * 0.462, Ls = bl * 0.465, Lf = bl - Lt - Ls;
    const bein = (b) => Lt * Math.cos(b.a) * Math.cos(b.b || 0) + Ls * Math.cos(b.a - b.k) * Math.cos(b.b || 0) + Lf;
    const z0 = Math.max(bein(P.bein[0]), bein(P.bein[1])) + (P.z || 0);
    const P0 = [P.x || 0, P.y || 0, z0];
    /* Rumpf: nach vorn geneigt, zur Seite geneigt, gedreht */
    const U = einheit([Math.sin(P.seit || 0), Math.sin(P.neig || 0), Math.cos(P.neig || 0) * Math.cos(P.seit || 0)]);
    let X = [Math.cos(P.dreh || 0), Math.sin(P.dreh || 0), 0];
    X = einheit(minus(X, mal(U, pkt(X, U))));
    const Y = kreuz(U, X);
    const T = (dx, dy, dz) => plus(P0, plus(mal(X, dx), plus(mal(Y, dy), mal(U, dz))));
    const sk = { m: m, P0: P0, U: U, X: X, Y: Y, T: T, bein: [], arm: [] };
    /* Beine (0 = links, 1 = rechts) */
    for (let i = 0; i < 2; i++) {
      const sd = i ? 1 : -1, b = P.bein[i], sb = Math.sin(b.b || 0) * sd, cb = Math.cos(b.b || 0);
      const Hj = plus(P0, [sd * m.hb, 0, 0]);
      const Kn = plus(Hj, mal([sb, Math.sin(b.a) * cb, -Math.cos(b.a) * cb], Lt));
      const An = plus(Kn, mal([sb, Math.sin(b.a - b.k) * cb, -Math.cos(b.a - b.k) * cb], Ls));
      const phi = (b.a - b.k) + (b.f || 0);
      const D = [0, Math.cos(phi), Math.sin(phi)];
      sk.bein.push({ H: Hj, K: Kn, A: An, D: D, fuss: plus(An, plus(mal(D, 0.045 * H), [0, 0, -0.018 * H])) });
    }
    /* Arme */
    const Sm = T(0, 0, m.schulter - m.huefte);
    for (let i = 0; i < 2; i++) {
      const sd = i ? 1 : -1, ar = P.arm[i];
      const S = plus(Sm, mal(X, sd * m.sb));
      let E, Hd;
      if (ar.ziel) {
        const pol = ar.pol || plus(mal(X, sd * 0.5), plus(mal(Y, -0.6), mal(U, -0.6)));
        [E, Hd] = ik(S, ar.ziel, m.oa, m.ua, pol);
      } else {
        const ab = ar.ab || 0.08;
        const d1 = einheit(plus(mal(X, sd * Math.sin(ab)), plus(mal(Y, Math.sin(ar.a) * Math.cos(ab)), mal(U, -Math.cos(ar.a) * Math.cos(ab)))));
        E = plus(S, mal(d1, m.oa));
        const w2 = ar.a + ar.e;
        const d2 = einheit(plus(mal(X, sd * Math.sin(ab) * 0.4), plus(mal(Y, Math.sin(w2)), mal(U, -Math.cos(w2)))));
        Hd = plus(E, mal(d2, m.ua));
      }
      sk.arm.push({ S: S, E: E, Hd: Hd, tasche: !!ar.tasche });
    }
    /* Hals und Kopf */
    sk.N = T(0, 0, m.hals - m.huefte);
    const kn = P.kopfNick || 0, kd = P.kopfDreh || 0;
    const Xh0 = einheit(plus(mal(X, Math.cos(kd)), mal(Y, Math.sin(kd)))), Yh0 = kreuz(U, Xh0);
    const Uh = einheit(plus(mal(U, Math.cos(kn)), mal(Yh0, Math.sin(kn))));
    const Yh = einheit(minus(Yh0, mal(Uh, pkt(Yh0, Uh))));
    sk.Xh = Xh0; sk.Yh = Yh; sk.Uh = Uh;
    sk.K = plus(sk.N, mal(Uh, m.kopf - m.hals));
    return sk;
  }

  /* Ellipsoid mit Achsen in Richtungen a, b, c (Einheitsvektoren) */
  function eiAchsen(B, c, A, ra, Bv, rb, C, rc, farbe, opt) { return B.ei(c, mal(A, ra), mal(Bv, rb), mal(C, rc), farbe, opt); }

  /* Der ganze Mensch */
  function mensch(B, a, sk, opt) {
    const m = sk.m, H = m.H, s = B.s;
    const fein = s > 26, sehrFein = s > 70, grob = s < 22;   // Detailstufe nach Pixeln je Meter
    const X = sk.X, Y = sk.Y, U = sk.U, T = sk.T;
    const winter = a.jahr === "winter" || a.jahr === "herbst";
    const stiefel = winter;
    const dk = a.kind ? (winter ? 1.3 : 1.12) : 1;     // Kinder im Schneeanzug: dickere Glieder
    /* Beine: Hose, Stiefel/Schuhe */
    for (let i = 0; i < 2; i++) {
      const b = sk.bein[i];
      B.glied(b.H, 0.052 * H * dk, b.K, 0.038 * H * dk, a.hose);
      B.glied(b.K, 0.036 * H * dk, b.A, 0.027 * H * dk, grob && stiefel ? mix(a.hose, a.schuh, 0.5) : a.hose);
      if (stiefel && !grob) B.glied(mix(b.K, b.A, 0.5), 0.032 * H * dk, b.A, 0.03 * H * dk, a.schuh, { tiefe: 0.005 });
      const qu = einheit(kreuz(b.D, [0, 0, 1]).map((x, k) => k === 2 ? 0 : x));
      eiAchsen(B, b.fuss, b.D, 0.074 * H, qu[0] || qu[1] ? qu : [1, 0, 0], 0.03 * H, einheit(kreuz(qu, b.D)), 0.028 * H, a.schuh, { tiefe: 0.01, glanz: sehrFein ? 0.25 : 0 });
      if (opt.kufen) {
        /* Schlittschuhkufe unter dem Stiefel */
        const f0 = plus(b.fuss, plus(mal(b.D, -0.085 * H), [0, 0, -0.03 * H])), f1 = plus(b.fuss, plus(mal(b.D, 0.1 * H), [0, 0, -0.028 * H]));
        B.band([f0, f1, plus(f1, plus(mal(b.D, 0.012 * H), [0, 0, 0.012 * H]))], 0.006 * H, KUFE, { glanz: 1, tiefe: 0.012 });
      }
    }
    /* Mantel/Jacke: Hülle aus Schultern, Brust, Taille und Saum */
    const hz = m.huefte, saum = a.saum * H;
    const mantelOpt = { tiefe: 0 };
    if (fein) {
      /* Knopfleiste, Taschenklappen, Falten: leise dunklere Streifen */
      const d = a.mantel.map((x) => x * 0.72);
      mantelOpt.flecken = [
        { c: [0, 0.075 * H, (0.64 * H - hz)], a: [[0.006 * H, 0, 0], [0, 0.01 * H, 0], [0, 0, 0.15 * H]], alb: d, n: [0, 1, 0], k: 0.55 },
        { c: [0, 0.06 * H, (saum + 0.04 * H - hz)], a: [[0.1 * H, 0, 0], [0, 0.08 * H, 0], [0, 0, 0.014 * H]], alb: d, n: [0, 0, -1], k: 0.5 },
        { c: [-0.07 * H, 0.06 * H, (0.49 * H - hz)], a: [[0.03 * H, 0, 0], [0, 0.01 * H, 0], [0, 0, 0.008 * H]], alb: d, n: [0, 1, 0], k: 0.6 },
        { c: [0.07 * H, 0.06 * H, (0.49 * H - hz)], a: [[0.03 * H, 0, 0], [0, 0.01 * H, 0], [0, 0, 0.008 * H]], alb: d, n: [0, 1, 0], k: 0.6 }
      ];
    }
    const lok = (dx, dy, dz) => [dx, dy, dz];
    const rahmenRumpf = { o: sk.P0, x: X, y: Y, z: U };
    const Ralt = B.R;
    B.rahmen(GS.rahmen(B.pk(rahmenRumpf.o), B.rk(X), B.rk(Y), B.rk(U)));
    const br = a.kind ? 1.05 : 1;
    B.koerper([
      { c: lok(0, -0.004 * H, m.schulter - hz + 0.012 * H), a: [[0.112 * H * br * a.breit, 0, 0], [0, 0.066 * H, 0], [0, 0, 0.045 * H]] },
      { c: lok(0, 0.006 * H, 0.72 * H - hz), a: [[0.104 * H * br * a.breit, 0, 0], [0, 0.074 * H, 0], [0, 0, 0.07 * H]] },
      { c: lok(0, 0.002 * H, 0.58 * H - hz), a: [[0.094 * H * br * a.breit, 0, 0], [0, 0.068 * H, 0], [0, 0, 0.05 * H]] },
      { c: lok(0, -0.004 * H, saum - hz + 0.012 * H), a: [[(a.saum < 0.4 ? 0.118 : 0.1) * H * br * a.breit, 0, 0], [0, (a.saum < 0.4 ? 0.088 : 0.074) * H, 0], [0, 0, 0.014 * H]] }
    ], a.mantel, mantelOpt);
    if (fein && !a.kind) for (let k = 0; k < 3; k++) B.kugel(lok(0.012 * H, 0.074 * H, 0.66 * H - hz - k * 0.075 * H), 0.007 * H, a.mantel.map((x) => x * 0.45), { tiefe: 0.03 });
    /* Schal: Wickel um den Hals und ein hängendes Ende */
    if (a.schal) {
      B.ei(lok(0, 0.006 * H, m.hals - hz - 0.004 * H), [0.056 * H, 0, 0], [0, 0.052 * H, 0], [0, 0, 0.03 * H], a.schal, { tiefe: 0.01 });
      if (fein) {
        const w = opt.wind || 0;
        /* das hängende Schalende: flacher Stoffstreifen, leicht vom Wind bewegt */
        const zs = m.hals - hz, b2 = 0.028 * H;
        const mitte = [lok(0.03 * H, 0.052 * H, zs - 0.02 * H), lok(0.034 * H, 0.066 * H - w * 0.3, zs - 0.08 * H), lok(0.036 * H + w * 0.2, 0.07 * H - w, zs - 0.15 * H)];
        for (let k = 0; k < 2; k++) {
          const p0 = mitte[k], p1 = mitte[k + 1];
          B.platte([plus(p0, [-b2, 0, 0]), plus(p0, [b2, 0, 0]), plus(p1, [b2, 0, 0]), plus(p1, [-b2, 0, 0])], a.schal.map((x) => x * (1 - k * 0.05)), { n: [0, 1, 0.15], beidseitig: true, tiefe: 0.05 });
        }
        B.band([plus(mitte[2], [-b2, 0.002, -0.006]), plus(mitte[2], [b2, 0.002, -0.006])], 0.008 * H, a.schal.map((x) => x * 0.8), { tiefe: 0.051 });
      }
    }
    B.rahmen(Ralt);
    /* Arme: Ärmel, Handschuh oder Hand */
    for (let i = 0; i < 2; i++) {
      const ar = sk.arm[i];
      const hand = ar.tasche ? mix(ar.E, ar.Hd, 0.86) : ar.Hd;
      B.glied(ar.S, 0.043 * H * dk, ar.E, 0.036 * H * dk, a.mantel, { tiefe: 0.002 });
      B.glied(ar.E, 0.035 * H * dk, mix(ar.E, hand, 0.92), 0.03 * H * dk, a.mantel, { tiefe: 0.003 });
      if (!ar.tasche && !grob) {
        const dir = einheit(minus(ar.Hd, ar.E));
        B.ei(plus(ar.Hd, mal(dir, 0.02 * H)), mal(dir, 0.034 * H * dk), mal(einheit(kreuz(dir, [0, 0, 1])), 0.024 * H * dk), [0, 0, 0.022 * H * dk], a.handschuh || a.haut, { tiefe: 0.004 });
      }
    }
    /* Hals, Kopf, Haar, Mütze */
    const K = sk.K, Xh = sk.Xh, Yh = sk.Yh, Uh = sk.Uh;
    if (!a.schal) B.glied(sk.N, 0.028 * H * (a.kind ? 1.1 : 1), plus(sk.N, mal(Uh, 0.05 * H)), 0.026 * H, a.haut);
    const kr = m.kr;
    const kopfOpt = { flecken: [] };
    /* Haar als Kappe auf dem Kopf (Haaransatz über der Stirn, hinten tief) */
    if (!(a.muetze && a.muetze.art !== "kappe" && !fein)) kopfOpt.flecken.push({ c: plus(K, plus(mal(Uh, 0.55 * kr), mal(Yh, -0.34 * kr))), a: [mal(Xh, 1.02 * kr), mal(Yh, 1.02 * kr), mal(Uh, 0.82 * kr)], alb: a.haar, n: Uh, k: 1, hart: 0.9 });
    if (fein && winter) kopfOpt.flecken.push(
      { c: plus(K, plus(mal(Yh, 0.7 * kr), plus(mal(Xh, 0.45 * kr), mal(Uh, -0.2 * kr)))), a: [mal(Xh, 0.3 * kr), mal(Yh, 0.3 * kr), mal(Uh, 0.25 * kr)], alb: [226, 128, 118], n: Yh, k: 0.35 },
      { c: plus(K, plus(mal(Yh, 0.7 * kr), plus(mal(Xh, -0.45 * kr), mal(Uh, -0.2 * kr)))), a: [mal(Xh, 0.3 * kr), mal(Yh, 0.3 * kr), mal(Uh, 0.25 * kr)], alb: [226, 128, 118], n: Yh, k: 0.35 }
    );
    /* lokale Punkte sind hier schon im Modellraum → Flecken brauchen Modellraum */
    /* ganz klein: Haar und Gesicht zu einer Farbe mischen, damit der Kopf nicht als heller Punkt wirkt */
    const kopfAlb = s < 24 && !a.muetze ? mix(a.haut, a.haar, 0.5) : a.haut;
    const kopfT = eiAchsen(B, K, Xh, 0.78 * kr, Yh, 0.86 * kr, Uh, kr, kopfAlb, kopfOpt);
    void kopfT;
    const haarT = plus(K, plus(mal(Yh, -0.14 * kr), mal(Uh, 0.14 * kr)));
    if (!grob || !a.muetze) eiAchsen(B, haarT, Xh, 0.82 * kr, Yh, 0.84 * kr, Uh, 0.93 * kr, a.haar, { tiefe: -0.02 });
    if (a.haarLang) eiAchsen(B, plus(K, plus(mal(Yh, -0.5 * kr), mal(Uh, -0.75 * kr))), Xh, 0.78 * kr, Yh, 0.42 * kr, Uh, 1.0 * kr, a.haar, { tiefe: -0.03 });
    if (fein) {
      /* Nase als leise Form, Ohren; Augen nur ganz nah als Schatten */
      eiAchsen(B, plus(K, plus(mal(Yh, 0.86 * kr), mal(Uh, -0.1 * kr))), Xh, 0.13 * kr, Yh, 0.16 * kr, Uh, 0.2 * kr, a.haut.map((x) => x * 0.97), { tiefe: 0.02 });
      for (const sd of [1, -1]) eiAchsen(B, plus(K, mal(Xh, sd * 0.78 * kr)), Xh, 0.08 * kr, Yh, 0.16 * kr, Uh, 0.24 * kr, a.haut.map((x) => x * 0.95), { tiefe: -0.005 });
    }
    if (sehrFein) {
      for (const sd of [1, -1]) {
        eiAchsen(B, plus(K, plus(mal(Yh, 0.78 * kr), plus(mal(Xh, sd * 0.3 * kr), mal(Uh, 0.12 * kr)))), Xh, 0.07 * kr, Yh, 0.04 * kr, Uh, 0.05 * kr, [48, 36, 32], { tiefe: 0.015 });
        eiAchsen(B, plus(K, plus(mal(Yh, 0.74 * kr), plus(mal(Xh, sd * 0.31 * kr), mal(Uh, 0.26 * kr)))), Xh, 0.12 * kr, Yh, 0.04 * kr, Uh, 0.03 * kr, a.haar, { tiefe: 0.016 });
      }
    }
    const mu = a.muetze;
    if (mu) {
      if (mu.art === "bommel" || mu.art === "strick") {
        eiAchsen(B, plus(K, plus(mal(Uh, 0.42 * kr), mal(Yh, -0.06 * kr))), Xh, 0.86 * kr, Yh, 0.93 * kr, Uh, 0.78 * kr, mu.farbe, { tiefe: 0.01 });
        if (!grob) eiAchsen(B, plus(K, plus(mal(Uh, 0.2 * kr), mal(Yh, -0.03 * kr))), Xh, 0.88 * kr, Yh, 0.95 * kr, Uh, 0.26 * kr, mu.farbe.map((x) => x * 0.86), { tiefe: 0.012 });
        if (mu.art === "bommel" && !grob) B.kugel(plus(K, plus(mal(Uh, 1.22 * kr), mal(Yh, -0.1 * kr))), 0.3 * kr, mu.farbe.map((x) => Math.min(255, x * 1.15 + 20)), { tiefe: 0.02 });
      } else if (mu.art === "hut") {
        eiAchsen(B, plus(K, mal(Uh, 0.62 * kr)), Xh, 1.35 * kr, Yh, 1.4 * kr, Uh, 0.09 * kr, mu.farbe, { tiefe: 0.01 });
        eiAchsen(B, plus(K, mal(Uh, 0.95 * kr)), Xh, 0.78 * kr, Yh, 0.86 * kr, Uh, 0.45 * kr, mu.farbe, { tiefe: 0.012 });
        if (!grob) eiAchsen(B, plus(K, mal(Uh, 0.74 * kr)), Xh, 0.8 * kr, Yh, 0.88 * kr, Uh, 0.12 * kr, mu.farbe.map((x) => x * 0.55), { tiefe: 0.013 });
      } else if (mu.art === "pelz") {
        eiAchsen(B, plus(K, mal(Uh, 0.66 * kr)), Xh, 0.95 * kr, Yh, 1.0 * kr, Uh, 0.6 * kr, mu.farbe, { tiefe: 0.01 });
      } else if (mu.art === "kappe") {
        eiAchsen(B, plus(K, plus(mal(Uh, 0.45 * kr), mal(Yh, -0.05 * kr))), Xh, 0.85 * kr, Yh, 0.9 * kr, Uh, 0.62 * kr, mu.farbe, { tiefe: 0.01 });
        eiAchsen(B, plus(K, plus(mal(Uh, 0.32 * kr), mal(Yh, 0.8 * kr))), Xh, 0.6 * kr, Yh, 0.45 * kr, Uh, 0.06 * kr, mu.farbe.map((x) => x * 0.85), { tiefe: 0.012 });
      }
    }
  }

  /* =====================================================================
     BEWEGUNG: Gangbild, Stehen, Trinken, Ziehen, Schlittschuhlaufen
     ===================================================================== */
  function gehPose(a, ph, g, t, zus) {
    const m = masse(a), bl = m.huefte;
    const A = (0.41 * a.H) / (Math.PI * bl) * g;
    const bein = [];
    for (let i = 0; i < 2; i++) {
      const psi = ph + (i ? 0.5 : 0), w = psi * TAU;
      const hueft = A * Math.sin(w) + 0.03;
      const knie = 0.07 + g * (0.88 * Math.pow(Math.max(0, Math.cos(w + 0.35)), 1.7) + 0.14 * Math.max(0, Math.sin(2 * w - 0.6)));
      const fuss = g * (-0.32 * Math.pow(Math.max(0, -Math.cos(w + 0.9)), 2) + 0.1 * Math.max(0, Math.sin(w + 0.3)));
      bein.push({ a: hueft, k: knie, f: fuss, b: 0 });
    }
    const arm = [];
    for (let i = 0; i < 2; i++) {
      const psi = ph + (i ? 0.5 : 0), w = psi * TAU;
      if (a.taschen && !(zus && zus.armFrei)) {
        const T0 = null; void T0;
        arm.push({ a: 0.06, e: 0.9, ab: 0.2, tasche: true });
      } else {
        arm.push({ a: -0.3 * g * Math.sin(w) + 0.04, e: 0.22 + 0.22 * g * Math.max(0, -Math.sin(w)), ab: 0.1 });
      }
    }
    const atmen = Math.sin(t * 1.6) * 0.004;
    return {
      bein: bein, arm: arm, neig: 0.035 + 0.03 * g, seit: 0.018 * g * Math.sin(ph * TAU), dreh: 0.07 * g * Math.sin(ph * TAU),
      x: 0.012 * a.H * g * Math.sin(ph * TAU), z: atmen, kopfNick: 0.06, kopfDreh: 0
    };
  }
  /* Hände in den Taschen: Ziel am Mantel, nachdem das Skelett steht */
  function taschenZiele(a, P) {
    const m = masse(a);
    for (let i = 0; i < 2; i++) {
      if (!P.arm[i].tasche) continue;
      const sd = i ? 1 : -1;
      P.arm[i].ziel = [sd * 0.105 * a.H * a.breit + (P.x || 0), 0.055 * a.H, m.huefte - 0.02 * a.H];
      P.arm[i].pol = [sd * 0.6, -0.5, -0.3];
    }
  }

  /* ---------------- Hilfen für die Welt ---------------- */
  const SZ = () => ST.szene;
  /* Hindernisse (Gebäude, Buden, Bäume) als gedrehte Rechtecke im Raster */
  let hind = null, hindN = -1, hindZeit = -1e9;
  function hindernisse(jetzt) {
    const S = SZ();
    if (hind && hindN === S.objekte.length && jetzt - hindZeit < 3) return hind;
    hindN = S.objekte.length; hindZeit = jetzt;
    const zellen = new Map(), buden = [], stege = [];
    for (const o of S.objekte) {
      const d = ST.MODELLE[o.typ];
      if (!d || d.live || o.rand || !d.grund) continue;
      const r = o.gier * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
      if (BEGEHBAR[o.typ]) {
        /* Brücke: kein Hindernis, sondern ein Weg über das Wasser (schmaler als der Grundriss) */
        stege.push({ x: o.x, y: o.y, c: c, s: sn, hb: d.grund[0] / 2 - 0.5, ht: d.grund[1] / 2 + 0.6 });
        continue;
      }
      const hb = d.grund[0] / 2 + 0.3, ht = d.grund[1] / 2 + 0.3;
      const e = { x: o.x, y: o.y, c: c, s: sn, hb: hb, ht: ht, o: o };
      const rr = Math.hypot(hb, ht);
      for (let i = Math.floor((o.x - rr) / 4); i <= Math.floor((o.x + rr) / 4); i++)
        for (let j = Math.floor((o.y - rr) / 4); j <= Math.floor((o.y + rr) / 4); j++) {
          const k = i + "," + j; if (!zellen.has(k)) zellen.set(k, []); zellen.get(k).push(e);
        }
      if (o.typ === "marktbude") {
        /* Stehplatz vor der Theke (Vorderseite = +y des Modells) */
        const vy = d.grund[1] / 2 + 0.75;
        buden.push({ x: o.x - sn * vy, y: o.y + c * vy, blick: Math.atan2(-c, sn), o: o });
      }
    }
    hind = { zellen: zellen, buden: buden, stege: stege };
    return hind;
  }
  const BEGEHBAR = { bruecke: true };
  function aufSteg(x, y, h) {
    for (const e of h.stege) {
      const dx = x - e.x, dy = y - e.y, u = dx * e.c + dy * e.s, v = -dx * e.s + dy * e.c;
      if (Math.abs(u) < e.hb && Math.abs(v) < e.ht) return true;
    }
    return false;
  }
  function frei(x, y, h, ohneBoden) {
    const G = ST.boden.GROESSE / 2 - 1;
    if (Math.abs(x) > G || Math.abs(y) > G) return false;
    if (h.stege.length && aufSteg(x, y, h)) return true;
    const L = h.zellen.get(Math.floor(x / 4) + "," + Math.floor(y / 4));
    if (L) for (const e of L) {
      const dx = x - e.x, dy = y - e.y, u = dx * e.c + dy * e.s, v = -dx * e.s + dy * e.c;
      if (Math.abs(u) < e.hb && Math.abs(v) < e.ht) return false;
    }
    if (!ohneBoden && ST.boden.wert(x, y, 0) < 0.45) return false;
    if (ST.boden.wert(x, y, 1) > 0.4) return false;
    return true;
  }
  /* Lenken und einen Schritt gehen: vorausschauen, freien Winkel suchen,
     anderen ausweichen; wer trotzdem feststeckt (Nische, Ecke), wählt
     nach 1,5 s eine neue freie Richtung und hält sie eine Weile */
  function lenken(o, m, dt, h, ohneBoden, v, ausweichen) {
    const geht = (w, d) => frei(o.x + Math.cos(w) * d, o.y + Math.sin(w) * d, h, ohneBoden) && frei(o.x + Math.cos(w) * d * 0.45, o.y + Math.sin(w) * d * 0.45, h, ohneBoden);
    if (m.fest > 0) m.fest -= dt;
    else if (!geht(m.h, 1.1)) {
      let neu = null;
      for (let k = 1; k <= 12 && neu == null; k++) for (const sg of [1, -1]) { const w = m.h + sg * k * 0.26; if (geht(w, 1.1)) { neu = w; break; } }
      if (neu == null) { m.h += Math.PI * (0.6 + m.r() * 0.8); m.fest = 0.6; }
      else if (Math.abs(winkelDiff(neu, m.h)) > 0.8) { m.h = neu; m.fest = 0.8; }
      else m.h += klemm(winkelDiff(neu, m.h), -dt * 4, dt * 4);
    }
    if (ausweichen) for (const p of SZ().objekte) {
      if (p === o || !p._m || !ST.MODELLE[p.typ] || !ST.MODELLE[p.typ].live) continue;
      const dx = p.x - o.x, dy = p.y - o.y, d = Math.hypot(dx, dy);
      if (d < 0.9 && d > 1e-3) {
        const vorn = (dx * Math.cos(m.h) + dy * Math.sin(m.h)) / d;
        if (vorn > 0.3) m.h += dt * 1.6 * (winkelDiff(Math.atan2(dy, dx), m.h) > 0 ? -1 : 1);
      }
    }
    const nx = o.x + Math.cos(m.h) * v * dt, ny = o.y + Math.sin(m.h) * v * dt;
    const ging = frei(nx, ny, h, ohneBoden);
    if (ging) { o.x = nx; o.y = ny; }
    /* festgefahren? */
    if (v > 0.3 && !ging) m.stau = (m.stau || 0) + dt; else m.stau = Math.max(0, (m.stau || 0) - dt * 0.5);
    if (m.stau > 1.5) {
      m.stau = 0;
      for (let k = 0; k < 16; k++) { const w = m.r() * TAU; if (geht(w, 1.6)) { m.h = w; m.fest = 1.5; break; } }
    }
  }
  /* Nicht zu weit weg: jenseits des Umkreises zieht es jeden zurück zu seinem Ausgangsort */
  function heimwaerts(o, m, r) {
    if (!m.heim) return m.h;
    const dx = m.heim[0] - o.x, dy = m.heim[1] - o.y;
    if (Math.hypot(dx, dy) < r) return m.h;
    return Math.atan2(dy, dx);
  }
  function gierAus(h) { return Math.atan2(-Math.cos(h), Math.sin(h)) * 180 / Math.PI; }
  function richtungAus(gier) { const r = gier * Math.PI / 180; return Math.atan2(Math.cos(r), -Math.sin(r)); }
  function winkelDiff(a, b) { let d = a - b; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; return d; }

  /* Wer ist unterwegs? Nachts weniger Leute, Kinder daheim */
  const NACHT_ANTEIL = { spaziergaenger: 0.35, marktbesucher: 0.5, kind_schlitten: 0, schlittschuh: 0.25 };
  function anwesend(o) {
    const S = SZ();
    if (o.typ === "schlittschuh" && S.jahr !== "winter") return false;
    /* in der Werkbank immer zeigen (dort prüft man ja gerade diese Figur) */
    if (S.zeit === "nacht" && !o.immer && !WERKBANK && o !== S.geist) return ST.hash2(o.saat | 0, 9, 3) < (NACHT_ANTEIL[o.typ] || 0.4);
    return true;
  }

  /* Steht jemand beim Start in einem Haus (Grundrisse sind großzügig),
     rückt er zur nächsten freien Stelle – sonst stünde er fest */
  function befreien(o, ohneBoden) {
    const h = hindernisse(0);
    if (frei(o.x, o.y, h, ohneBoden)) return;
    for (let r = 0.5; r < 12; r += 0.5) for (let k = 0; k < 16; k++) {
      const w = k / 16 * TAU, x = o.x + Math.cos(w) * r, y = o.y + Math.sin(w) * r;
      if (frei(x, y, h, ohneBoden)) { o.x = x; o.y = y; return; }
    }
  }
  ST.menschenFrei = function (x, y, ohneBoden) { return frei(x, y, hindernisse(0), ohneBoden); };
  function zustand(o) {
    if (o._m) return o._m;
    const r = ST.zufall((o.saat | 0) + 99);
    o._m = { r: r, ph: r(), g: 1, h: richtungAus(o.gier || 0), stopp: 0, pause: 3 + r() * 10, wandern: 2 + r() * 5, t: 0, blick: 0, kopf: 0, trink: r() * 8 };
    return o._m;
  }

  /* ---------------- Zeichnen (gemeinsam) ---------------- */
  function buehneFuer(o, P, bauen) {
    const K = ST.kamera;
    const O = P.proj(0, 0, 0);
    if (o._b && o._b.jetzt === ST.jetzt && o._b.s === P.s && o._b.x === O[0] && o._b.y === O[1]) return o._b.B;
    const Z = P.Z;
    const B = new GS.Buehne({ s: P.s, X0: O[0], Y0: O[1], Z: Z, jahr: P.jahr, lampen: P.vorschau ? null : GS.lampenBei(O[0], O[1], P.s, Z.nacht, o.x, o.y) });
    B.rahmen(GS.modellRahmen(P.c, P.sn));
    B.gruppe(0);
    bauen(B);
    void K;
    o._b = { jetzt: ST.jetzt, s: P.s, x: O[0], y: O[1], B: B };
    return B;
  }
  function kontaktSchatten(sg, P, r) {
    const O = P.proj(0, 0, 0), s = P.s;
    sg.save();
    sg.translate(O[0], O[1]); sg.scale(1, 0.5);
    const gr = sg.createRadialGradient(0, 0, 0, 0, 0, r * s);
    gr.addColorStop(0, "rgba(0,0,0,0.55)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    sg.fillStyle = gr; sg.fillRect(-r * s, -r * s, 2 * r * s, 2 * r * s);
    sg.restore();
  }
  function lebendModell(id, def) {
    const bauenFn = def.buehne;
    ST.modell(id, Object.assign({
      live: true, gruppe: "Deko", grund: [0.6, 0.6], hoehe: 1.9,
      zeichnen: function (g, P) {
        const o = P.objekt;
        if (!anwesend(o)) return;
        const B = buehneFuer(o, P, (B) => bauenFn(B, o, P));
        B.malen(g);
      },
      schatten: function (sg, P) {
        const o = P.objekt;
        if (!anwesend(o)) return;
        const B = buehneFuer(o, P, (B) => bauenFn(B, o, P));
        kontaktSchatten(sg, P, def.kontakt || 0.42);
        sg.save(); B.schattenMalen(sg); sg.restore();
      },
      /* Vorschaubild für die Bauleiste (der Kern malt dafür ein Sprite): als
         Figur, dreifach vergrößert – die Bauleiste malt Vorschauen mit
         höchstens 18 px/m, ein Mensch wäre im Kärtchen sonst nur ein Strich.
         In der Stadt selbst wird dieses Sprite nie benutzt (live: true). */
      bauen: function (M, o) {
        const V = 3;
        M.figur({
          x: 0, y: 0, z: 0, breite: (def.vorschauBreite || 1.2) * V, hoehe: 2 * V, schatten: false,
          malen: function (g, s0, F) {
            if (F.schatten) return;
            const s = s0 * V;
            const gier = ((F.gier || 0) + 30) * Math.PI / 180;
            const tr = g.getTransform();
            const Bv = new GS.Buehne({ s: s, X0: 0, Y0: 0, Z: F.Z || ST.ZEITEN.tag, jahr: F.jahr || "winter" });
            Bv.rahmen(GS.modellRahmen(Math.cos(gier), Math.sin(gier)));
            Bv.gruppe(0);
            const ob = { saat: o.saat || 7, typ: id, gier: 0 };
            bauenFn(Bv, ob, { t: 0, s: s, jahr: F.jahr || "winter", Z: F.Z || ST.ZEITEN.tag, vorschau: true });
            if (F.schatten) { g.setTransform(tr); return; }
            Bv.malen(g);
          }
        });
      }
    }, def));
  }

  /* =====================================================================
     SPAZIERGÄNGER
     ===================================================================== */
  lebendModell("spaziergaenger", {
    name: "Spaziergänger", kontakt: 0.4,
    buehne: function (B, o, P) {
      const a = ausstattung(o, "erwachsen", P.jahr);
      const m = o._m || { ph: 0, g: P.vorschau ? 0.9 : 1, kopf: 0 };
      const pose = gehPose(a, m.ph, m.g, P.t, null);
      pose.kopfDreh = m.kopf || 0;
      taschenZiele(a, pose);
      mensch(B, a, skelett(a, pose), { wind: Math.sin(P.t * 2 + (o.saat % 7)) * 0.01 * a.H });
    },
    bewegen: function (o, dt, t) {
      const m = zustand(o), a = o._aus || ausstattung(o, "erwachsen", SZ().jahr);
      m.t += dt;
      if (!anwesend(o)) return;
      const f = a.tempo / (2 * 0.41 * a.H);
      if (WERKBANK) { m.ph = (m.ph + f * dt) % 1; m.g = 1; return; }
      if (!m.befreit) { m.befreit = true; befreien(o, false); m.heim = [o.x, o.y]; }
      const h = hindernisse(t);
      if (m.stopp > 0) {
        /* steht an einer Bude: schaut, dreht den Kopf */
        m.stopp -= dt;
        m.g = Math.max(0, m.g - dt * 2.2);
        const d = winkelDiff(m.blick, m.h); m.h += klemm(d, -dt * 2, dt * 2);
        m.kopf = 0.35 * Math.sin(m.t * 0.5 + (o.saat % 5));
        if (m.g > 0.02) m.ph = (m.ph + f * dt * m.g) % 1; else m.ph = m.ph < 0.25 || m.ph > 0.75 ? m.ph * 0.9 : m.ph + (0.5 - m.ph) * 0.1;
        o.gier = gierAus(m.h);
        if (m.stopp <= 0) { m.pause = 18 + m.r() * 25; m.h += Math.PI * (0.6 + m.r() * 0.8); }
        return;
      }
      m.kopf *= 0.95;
      m.g = Math.min(1, m.g + dt * 1.6);
      m.pause -= dt; m.wandern -= dt;
      /* an einer Bude stehen bleiben? */
      if (m.pause <= 0) {
        for (const b of h.buden) {
          if (Math.hypot(b.x - o.x, b.y - o.y) < 1.4) {
            if (m.r() < 0.6) { m.stopp = 5 + m.r() * 9; m.blick = b.blick; }
            m.pause = 6 + m.r() * 8;
            break;
          }
        }
      }
      if (m.wandern <= 0) { m.h = heimwaerts(o, m, 40) + (m.r() - 0.5) * 1.1; m.wandern = 3 + m.r() * 6; }
      lenken(o, m, dt, h, false, a.tempo * m.g, true);
      m.ph = (m.ph + f * dt * m.g) % 1;
      o.gier = gierAus(m.h);
    }
  });

  /* =====================================================================
     MARKTBESUCHER: steht, trinkt Glühwein, Dampf steigt
     ===================================================================== */
  function dampf(g, B, t, pos, saat, stark) {
    const Pp = B.bild(pos), s = B.s;
    for (let i = 0; i < 9; i++) {
      const ph = (t * 0.3 + i / 9 + saat * 0.13) % 1;
      const hoch = ph * 0.42 * s, wind = (ph * ph * 0.14 + Math.sin(t * 1.3 + i * 2.1) * 0.025 * ph) * s;
      const r = (0.025 + ph * 0.09) * s;
      const al = (1 - ph) * Math.min(1, ph / 0.12) * 0.38 * stark;
      if (r < 0.4 || al < 0.01) continue;
      const x = Pp[0] + wind, y = Pp[1] - hoch;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, "rgba(246,246,250," + al.toFixed(3) + ")"); gr.addColorStop(1, "rgba(246,246,250,0)");
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    }
  }
  lebendModell("marktbesucher", {
    name: "Marktbesucher", kontakt: 0.4,
    buehne: function (B, o, P) {
      const a = ausstattung(o, "erwachsen", P.jahr);
      const m = o._m || { trink: 3, kopf: 0, t: 0 };
      const t = P.t;
      const pose = gehPose(a, 0.25, 0, t, { armFrei: true });
      /* Gewicht auf ein Bein, leichtes Wiegen */
      const wieg = Math.sin(t * 0.45 + (o.saat % 11)) ;
      pose.x = 0.012 * a.H * wieg; pose.seit = -0.015 * wieg;
      pose.bein[0].b = 0.05; pose.bein[1].b = 0.05;
      pose.bein[wieg > 0 ? 0 : 1].k = 0.12;
      pose.bein[wieg > 0 ? 0 : 1].a = 0.06;
      /* Trinken: Tasse heben, kurz verweilen, senken */
      const zyk = 9 + (o.saat % 5), ph = ((t + m.trink) % zyk) / zyk;
      const hebe = glatt(0.0, 0.1, ph) * (1 - glatt(0.24, 0.34, ph));
      const Hm = masse(a);
      const ruhe = [0.06 * a.H, 0.15 * a.H, 0.62 * a.H], mund = [0.025 * a.H, 0.105 * a.H, Hm.kopf - 0.045 * a.H];
      pose.arm[1].ziel = mix(ruhe, mund, hebe); pose.arm[1].pol = [0.7, -0.3, -0.6];
      pose.arm[0].ziel = [-0.03 * a.H, 0.14 * a.H, 0.6 * a.H]; pose.arm[0].pol = [-0.7, -0.3, -0.6];
      pose.kopfNick = 0.08 - 0.25 * hebe; pose.kopfDreh = (m.kopf || 0) * (1 - hebe);
      const sk = skelett(a, pose);
      mensch(B, a, sk, {});
      /* Tasse in der rechten Hand (die linke stützt) */
      const hnd = sk.arm[1].Hd;
      const tb = plus(hnd, [0, 0.02 * a.H, -0.03 * a.H]);
      const kipp = [0, 0.4 * hebe, 1];
      const top = plus(tb, mal(einheit(kipp), 0.1));
      B.glied(tb, 0.036, top, 0.04, a.tasse, { tiefe: 0.02, glanz: 0.5 });
      if (B.s > 30) B.ei(plus(top, [0, 0, 0.002]), [0.034, 0, 0], [0, 0.034, 0], [0, 0, 0.006], P.jahr === "winter" ? [96, 20, 30] : [70, 44, 30], { tiefe: 0.021 });
      if (P.jahr === "winter" && B.s > 12) {
        B.eigen(plus(top, [0, 0, 0.02]), function (g, Bh, tt) { dampf(g, Bh, t, tt.m, o.saat % 7, 1 - hebe * 0.5); }, { tiefe: 0.3 });
      }
    },
    bewegen: function (o, dt) {
      const m = zustand(o);
      m.t += dt;
      m.kopf = 0.5 * Math.sin(m.t * 0.23 + (o.saat % 13)) * Math.max(0, Math.sin(m.t * 0.11 + (o.saat % 3)));
    }
  });

  /* =====================================================================
     KIND MIT SCHLITTEN (Frühling: Bollerwagen)
     ===================================================================== */
  /* Kiste (Päckchen): Mitte c, halbe Kantenvektoren ax, ay, az, Band über Kreuz */
  function kiste(B, c, ax, ay, az, farbe, band) {
    const P = (i, j, k) => plus(c, plus(mal(ax, i), plus(mal(ay, j), mal(az, k))));
    const kr = function (g, f) { g.strokeStyle = "rgb(" + Math.min(255, band[0] * f[0]) + "," + Math.min(255, band[1] * f[1]) + "," + Math.min(255, band[2] * f[2]) + ")"; g.lineWidth = 0.16; g.beginPath(); g.moveTo(-0.6, 0); g.lineTo(0.6, 0); g.stroke(); };
    const oben = function (g, f) { kr(g, f); g.beginPath(); g.moveTo(0, -0.6); g.lineTo(0, 0.6); g.stroke(); };
    const seite = (a, b, cc, d, n, m) => B.platte([a, b, cc, d], farbe, { n: n, tiefe: 0.05, muster: B.s > 30 ? m : null, ursprung: mix(a, cc, 0.5), u: minus(b, a), v: minus(a, d) });
    seite(P(-1, 1, 1), P(1, 1, 1), P(1, -1, 1), P(-1, -1, 1), az, oben);
    seite(P(-1, 1, 1), P(-1, 1, -1), P(1, 1, -1), P(1, 1, 1), ay, null);
    seite(P(1, 1, 1), P(1, 1, -1), P(1, -1, -1), P(1, -1, 1), ax, kr);
    seite(P(1, -1, 1), P(1, -1, -1), P(-1, -1, -1), P(-1, -1, 1), mal(ay, -1), null);
    seite(P(-1, -1, 1), P(-1, -1, -1), P(-1, 1, -1), P(-1, 1, 1), mal(ax, -1), kr);
  }
  function schlittenBauen(B, o, P, S, winter, ladung) {
    /* S = { x, y, w } Mitte (Modellraum) und Richtung (zum Kind) */
    const c = Math.cos(S.w), s = Math.sin(S.w);
    const L = (u, v, z) => [S.x + u * c - v * s, S.y + u * s + v * c, z];     // u vorn, v links
    if (winter) {
      /* Davoser Schlitten: zwei gebogene Kufen, vier Streben, Sitzlatten */
      for (const sd of [1, -1]) {
        const v = sd * 0.19;
        B.band([L(-0.46, v, 0.03), L(0.3, v, 0.03), L(0.42, v, 0.07), L(0.48, v, 0.16), L(0.44, v, 0.25), L(0.36, v, 0.27)], 0.034, HOLZ, { tiefe: 0.01 });
        B.band([L(-0.46, v, 0.012), L(0.3, v, 0.012), L(0.42, v, 0.05)], 0.018, EISEN, { glanz: 0.6 });
        for (const u of [-0.34, 0.2]) B.band([L(u, v, 0.04), L(u + 0.02, v * 0.95, 0.24)], 0.03, HOLZ_D);
      }
      for (const u of [-0.34, 0.2]) B.band([L(u, 0.2, 0.2), L(u, -0.2, 0.2)], 0.035, HOLZ_D, { tiefe: -0.01 });
      for (let i = 0; i < 4; i++) {
        const v = -0.15 + i * 0.1;
        B.platte([L(-0.42, v + 0.037, 0.255), L(0.3, v + 0.037, 0.255), L(0.3, v - 0.037, 0.255), L(-0.42, v - 0.037, 0.255)], i % 2 ? HOLZ : HOLZ.map((x) => x * 0.94), { n: [0, 0, 1], tiefe: 0.02 });
      }
      B.band([L(0.36, 0.2, 0.27), L(0.36, -0.2, 0.27)], 0.03, HOLZ_D, { tiefe: 0.02 });
      if (ladung === 1) {
        /* ein Tannenbäumchen, liegend festgebunden: Stamm hinten, Spitze vorn */
        const gr = [34, 66, 42], hellG = [70, 110, 62];
        const ring = [[-0.62, 0.21], [-0.36, 0.2], [-0.08, 0.16], [0.18, 0.11], [0.42, 0.045], [0.56, 0.008]];
        for (let k = 0; k < ring.length - 1; k++) {
          const [u0, r0] = ring[k], [u1, r1] = ring[k + 1];
          B.glied(L(u0, 0, 0.26 + r0 * 0.85), r0, L(u1, 0, 0.26 + r1 * 0.85), r1, gr.map((x) => x * (0.92 + k * 0.03)), {
            tiefe: 0.05 + k * 0.004,
            flecken: B.s > 40 ? [
              { c: L((u0 + u1) / 2, 0.08, 0.3 + r0), a: [[0.07, 0, 0], [0, 0.05, 0], [0, 0, 0.03]], alb: hellG, n: [0, 0, 1], k: 0.7 },
              { c: L((u0 + u1) / 2 + 0.05, -0.1, 0.28 + r0 * 0.9), a: [[0.06, 0, 0], [0, 0.05, 0], [0, 0, 0.03]], alb: hellG, n: [0, 0, 1], k: 0.6 },
              { c: L(u0 + 0.04, 0, 0.28 + r0 * 1.6), a: [[0.08, 0, 0], [0, 0.07, 0], [0, 0, 0.02]], alb: P.jahr === "winter" ? [236, 240, 246] : hellG, n: [0, 0, 1], k: 0.75 }
            ] : null
          });
        }
        B.glied(L(-0.86, 0, 0.36), 0.028, L(-0.6, 0, 0.42), 0.03, [104, 72, 46], { tiefe: 0.04 });
        for (const u of [-0.3, 0.1]) B.band([L(u, 0.2, 0.26), L(u, 0.17, 0.5), L(u, -0.17, 0.5), L(u, -0.2, 0.26)], 0.014, [160, 36, 32], { tiefe: 0.12 });
      } else if (ladung === 2) {
        /* Päckchen mit Schleifenband */
        kiste(B, L(-0.14, 0.02, 0.37), [0.13 * c, 0.13 * s, 0], [-0.12 * s, 0.12 * c, 0], [0, 0, 0.1], [166, 30, 36], [230, 196, 110]);
        kiste(B, L(0.12, -0.04, 0.34), [0.09 * c + 0.03 * s, 0.09 * s - 0.03 * c, 0], [-0.1 * s + 0.02 * c, 0.1 * c + 0.02 * s, 0], [0, 0, 0.075], [40, 90, 60], [214, 40, 40]);
      }
      return L(0.44, 0, 0.24);
    }
    /* Bollerwagen: Holzkasten auf vier Rädern, Deichsel */
    const kz = 0.2, kh = 0.26;
    const kasten = (u0, u1, v0, v1) => {
      B.platte([L(u0, v1, kz + kh), L(u1, v1, kz + kh), L(u1, v1, kz), L(u0, v1, kz)], HOLZ, { n: [0, 0, 0].map((x, i) => [-s, c, 0][i]), innen: HOLZ_D });
      B.platte([L(u1, v0, kz + kh), L(u0, v0, kz + kh), L(u0, v0, kz), L(u1, v0, kz)], HOLZ, { n: [s, -c, 0], innen: HOLZ_D });
      B.platte([L(u1, v1, kz + kh), L(u1, v0, kz + kh), L(u1, v0, kz), L(u1, v1, kz)], HOLZ.map((x) => x * 0.95), { n: [c, s, 0], innen: HOLZ_D });
      B.platte([L(u0, v0, kz + kh), L(u0, v1, kz + kh), L(u0, v1, kz), L(u0, v0, kz)], HOLZ.map((x) => x * 0.95), { n: [-c, -s, 0], innen: HOLZ_D });
      B.platte([L(u0, v1, kz + 0.02), L(u1, v1, kz + 0.02), L(u1, v0, kz + 0.02), L(u0, v0, kz + 0.02)], HOLZ_D, { n: [0, 0, 1], tiefe: -0.2 });
    };
    for (const [u, v] of [[-0.3, 0.26], [0.3, 0.26], [-0.3, -0.26], [0.3, -0.26]]) {
      const Rm = L(u, v, 0.13);
      B.ei(Rm, [-s * 0.02 * Math.sign(v), c * 0.02 * Math.sign(v), 0], [c * 0.13, s * 0.13, 0], [0, 0, 0.13], [60, 58, 56], { tiefe: v > 0 ? 0.03 : -0.03 });
    }
    kasten(-0.42, 0.42, -0.22, 0.22);
    if (ladung !== 0) {
      /* Blumentöpfe mit Tulpen */
      const farben = [[210, 40, 50], [240, 200, 40], [230, 120, 160]];
      for (let k = 0; k < 3; k++) {
        const u = -0.25 + k * 0.25;
        B.glied(L(u, 0, kz + 0.05), 0.075, L(u, 0, kz + 0.22), 0.09, [176, 96, 60], { tiefe: 0.1 });
        for (let j = 0; j < 4; j++) {
          const du = Math.cos(j * 1.7) * 0.04, dv = Math.sin(j * 1.7) * 0.04;
          B.band([L(u + du * 0.3, dv * 0.3, kz + 0.22), L(u + du, dv, kz + 0.38)], 0.012, [60, 120, 50], { tiefe: 0.11 });
          B.ei(L(u + du, dv, kz + 0.4), [0.025, 0, 0], [0, 0.025, 0], [0, 0, 0.035], farben[k], { tiefe: 0.12 });
        }
      }
    }
    B.band([L(0.42, 0, kz + 0.05), L(0.75, 0, 0.3)], 0.025, HOLZ_D, { tiefe: 0.05 });
    return L(0.8, 0, 0.34);
  }

  lebendModell("kind_schlitten", {
    name: "Kind mit Schlitten", kontakt: 0.34, hoehe: 1.3, grund: [0.6, 0.6], vorschauBreite: 2.4,
    buehne: function (B, o, P) {
      const a = ausstattung(o, "kind", P.jahr);
      const m = o._m || { ph: 0, g: 0.9 };
      const winter = P.jahr === "winter";
      const pose = gehPose(a, m.ph, m.g, P.t, { armFrei: true });
      pose.neig = 0.12 + 0.06 * m.g;
      /* Schlitten hinter dem Kind (Modellraum), aus der Weltlage */
      let S = { x: 0.35, y: -1.6, w: Math.PI / 2 };
      if (o._sch && !P.vorschau) {
        const gr = -(o.gier || 0) * Math.PI / 180, c = Math.cos(gr), sn = Math.sin(gr);
        const dx = o._sch.x - o.x, dy = o._sch.y - o.y;
        S = { x: dx * c - dy * sn, y: dx * sn + dy * c, w: Math.atan2(-(dx * sn + dy * c), -(dx * c - dy * sn)) };
      }
      const ladung = (o.saat | 0) % 3;
      /* die rechte Hand hält die Zugschnur hinter sich */
      const zug = schlittenZiel(S, winter);
      const sch = [0.1 * a.H, 0, 0.62 * a.H];
      const dir = einheit(minus(zug, sch));
      pose.arm[1].ziel = plus(sch, mal(dir, 0.28 * a.H));
      pose.arm[1].ziel[2] = Math.max(0.42 * a.H, pose.arm[1].ziel[2]);
      pose.arm[1].pol = [0.6, 0.3, -0.7];
      const sk = skelett(a, pose);
      mensch(B, a, sk, { wind: 0 });
      const vorne = schlittenBauen(B, o, P, S, winter, ladung);
      const hnd = sk.arm[1].Hd;
      const mt = plus(mix(hnd, vorne, 0.5), [0, 0, -0.1]);
      B.band([hnd, mix(mix(hnd, mt, 0.5), mix(hnd, vorne, 0.25), 0.5), mt, mix(mix(mt, vorne, 0.5), mix(hnd, vorne, 0.75), 0.5), vorne], 0.012, [150, 110, 70], { tiefe: 0.05 });
    },
    bewegen: function (o, dt, t) {
      const m = zustand(o), a = o._aus || ausstattung(o, "kind", SZ().jahr);
      m.t += dt;
      if (!anwesend(o)) return;
      const f = a.tempo / (2 * 0.44 * a.H);
      if (WERKBANK) { m.ph = (m.ph + f * dt) % 1; m.g = 1; return; }
      if (!m.befreit) { m.befreit = true; befreien(o, true); m.heim = [o.x, o.y]; }
      const h = hindernisse(t);
      if (!o._sch) { const w = m.h + Math.PI; o._sch = { x: o.x + Math.cos(w) * 1.6, y: o.y + Math.sin(w) * 1.6 }; }
      if (m.stopp > 0) {
        m.stopp -= dt; m.g = Math.max(0, m.g - dt * 2);
        if (m.g > 0.02) m.ph = (m.ph + f * dt * m.g) % 1;
        o.gier = gierAus(m.h);
        return;
      }
      m.g = Math.min(1, m.g + dt * 1.2);
      m.wandern -= dt; m.pause -= dt;
      if (m.wandern <= 0) { m.h = heimwaerts(o, m, 16) + (m.r() - 0.5) * 1.4; m.wandern = 2.5 + m.r() * 5; }
      if (m.pause <= 0) { m.stopp = 2 + m.r() * 4; m.pause = 10 + m.r() * 15; }
      lenken(o, m, dt, h, true, a.tempo * m.g, false);
      m.ph = (m.ph + f * dt * m.g) % 1;
      o.gier = gierAus(m.h);
      /* Schlitten folgt an der Schnur (Schleppkurve) */
      const hx = o.x - Math.cos(m.h) * 0.2, hy = o.y - Math.sin(m.h) * 0.2;
      const dx = o._sch.x - hx, dy = o._sch.y - hy, d = Math.hypot(dx, dy) || 1;
      const L = 1.45;
      if (d > L) { o._sch.x = hx + dx / d * L; o._sch.y = hy + dy / d * L; }
    }
  });
  function schlittenZiel(S, winter) {
    const c = Math.cos(S.w), s = Math.sin(S.w), u = winter ? 0.44 : 0.8;
    return [S.x + u * c, S.y + u * s, winter ? 0.24 : 0.34];
  }

  /* =====================================================================
     SCHLITTSCHUHLÄUFER (See bei ~(52, 50))
     ===================================================================== */
  lebendModell("schlittschuh", {
    name: "Schlittschuhläufer", kontakt: 0.36,
    buehne: function (B, o, P) {
      const a = ausstattung(o, o.saat % 4 === 0 ? "kind" : "erwachsen", P.jahr);
      a.saum = Math.max(a.saum, 0.44);     // zum Eislaufen kurze Jacke statt langem Mantel
      const m = o._m || { ph: 0.2, neig: 0 };
      const w = (m.ph || 0) * TAU;
      /* Gleiten auf einem Bein, das andere stößt schräg nach hinten ab */
      const st = Math.sin(w), ab = Math.max(0, st), ab2 = Math.max(0, -st);
      const pose = {
        bein: [
          { a: 0.12 - 0.5 * ab, k: 0.42 - 0.25 * ab + 0.2 * ab2, f: 0.1, b: 0.02 + 0.32 * ab },
          { a: 0.12 - 0.5 * ab2, k: 0.42 - 0.25 * ab2 + 0.2 * ab, f: 0.1, b: 0.02 + 0.32 * ab2 }
        ],
        arm: [
          { a: 0.25 * Math.sin(w) + 0.1, e: 0.5, ab: 0.35 },
          { a: -0.25 * Math.sin(w) + 0.1, e: 0.5, ab: 0.35 }
        ],
        neig: 0.3, seit: 0, dreh: 0.12 * Math.sin(w), x: 0.03 * a.H * Math.sin(w), kopfNick: -0.12
      };
      /* in die Kurve legen: ganzen Körper um die Laufrichtung kippen */
      const kipp = m.neig || 0;
      const R = B.R, cz = Math.cos(kipp), sz = Math.sin(kipp);
      B.rahmen(GS.rahmen(R.o, plus(mal(R.x, cz), mal(R.z, -sz)), R.y, plus(mal(R.z, cz), mal(R.x, sz))));
      mensch(B, a, skelett(a, pose), { kufen: true, wind: 0.03 * a.H });
      B.rahmen(R);
    },
    bewegen: function (o, dt) {
      const m = zustand(o);
      m.t += dt;
      if (!anwesend(o)) return;
      const f = 0.62;
      if (WERKBANK) { m.ph = (m.ph + f * dt) % 1; m.neig = 0.12; return; }
      if (!m.bahn) {
        /* Mitte der Eisfläche in der Nähe suchen; Kreisbahn darum */
        let sx = 0, sy = 0, n = 0;
        for (let y = -16; y <= 16; y += 1) for (let x = -16; x <= 16; x += 1) if (ST.boden.wert(o.x + x, o.y + y, 1) > 0.5) { sx += o.x + x; sy += o.y + y; n++; }
        const cx = n ? sx / n : o.x + 2, cy = n ? sy / n : o.y;
        const R = n ? klemm(Math.hypot(o.x - cx, o.y - cy), 2.5, 7.5) : 2;
        const w0 = Math.atan2(o.y - cy, o.x - cx);
        m.bahn = { cx: cx, cy: cy, R: R, w: w0, dir: m.r() < 0.5 ? 1 : -1, v: 2.2 + m.r() * 1.2, wob: m.r() * 6 };
      }
      const b = m.bahn;
      const R = b.R * (1 + 0.12 * Math.sin(m.t * 0.21 + b.wob));
      b.w += b.dir * b.v / R * dt;
      o.x = b.cx + Math.cos(b.w) * R; o.y = b.cy + Math.sin(b.w) * R;
      const h = b.w + b.dir * Math.PI / 2;
      o.gier = gierAus(h);
      /* Kreismitte liegt bei dir = +1 links (−x): der Körper neigt sich dorthin */
      m.neig = -b.dir * Math.atan(b.v * b.v / (R * 9.81)) * 1.3;
      m.ph = (m.ph + f * dt) % 1;
    }
  });

  /* =====================================================================
     STATISTEN FÜR WINTERHAUSEN (Vorschlag – dorf.js trägt sie ein)
     ===================================================================== */
  ST.MENSCHEN_PLAETZE = [
    /* Spaziergänger auf Markt und Straßen [Typ, x, y, gier] */
    ["spaziergaenger", -10.5, -3, 90], ["spaziergaenger", 10.5, 4, 270], ["spaziergaenger", -4, 10.5, 0], ["spaziergaenger", 5, -10.5, 180],
    ["spaziergaenger", 0.5, 18, 180], ["spaziergaenger", -1, 30, 0], ["spaziergaenger", 1.2, -24, 180], ["spaziergaenger", -1.5, -40, 0],
    ["spaziergaenger", -30, 3.6, 90], ["spaziergaenger", -38, 1, 270], ["spaziergaenger", 27.5, -2.2, 270], ["spaziergaenger", 40, 1.5, 90],
    ["spaziergaenger", 8, 8, 225], ["spaziergaenger", -8, -12, 45],
    /* Glühwein an den Buden: Stehplatz vor der Theke, Blick zur Bude (Buden wie in dorf.js im Kreis r = 8,2) */
    ["marktbesucher", 5.59, 2.32, 292], ["marktbesucher", 2.70, 5.43, 338], ["marktbesucher", 1.87, 5.77, 338], ["marktbesucher", -5.64, 2.20, 68],
    ["marktbesucher", -5.73, -1.98, 112], ["marktbesucher", 2.65, -5.45, 202], ["marktbesucher", 1.87, -5.77, 202],
    /* Kinder mit Schlitten auf den Schneewiesen */
    ["kind_schlitten", -18, 20, 45], ["kind_schlitten", 22, 26, 300], ["kind_schlitten", -30, -20, 120],
    /* Schlittschuhläufer auf dem See bei (52, 50) */
    ["schlittschuh", 47, 50, 0], ["schlittschuh", 56, 46, 90], ["schlittschuh", 52, 55, 180], ["schlittschuh", 58, 52, 270], ["schlittschuh", 49, 45, 45]
  ];
  /* Statisten setzen (für dorf.js oder den Test mit leute=1) */
  ST.menschenSetzen = function () {
    const S = SZ();
    let n = 0;
    for (const e of ST.MENSCHEN_PLAETZE) {
      if (!ST.MODELLE[e[0]]) continue;
      S.neu(e[0], e[1], e[2], e[3], { saat: 1000 + n * 7919 });
      n++;
    }
    return n;
  };
  if (q.get("leute") === "1" && !WERKBANK) {
    const alt = ST.stadtAnfang;
    ST.stadtAnfang = function (qq) {
      if (alt) alt(qq);
      if (!SZ().objekte.some((o) => ST.MODELLE[o.typ] && ST.MODELLE[o.typ].live)) ST.menschenSetzen();
    };
  }
})();
