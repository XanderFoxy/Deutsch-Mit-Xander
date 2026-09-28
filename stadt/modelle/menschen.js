/* =====================================================================
   BAUKASTEN-STADT — DIE MENSCHEN VON WINTERHAUSEN (lebende Modelle)
   ---------------------------------------------------------------------
   XANDER: „… wie die kleinen Menschen realistisch …" – „Das soll keine
   Comic Grafik sein. Das soll noch viel mehr am Realismus dran sein." –
   „Richtig filigran."

   Vier Arten Leute (dazu der Kinderschlitten als eigenes Ding), jede
   jedes Bild neu gemalt (kein Sprite), mit echten Proportionen
   (Erwachsene um 1,75 m, Kopf ≈ 1/7,6 der Größe; Kinder um 1,2 m):
     spaziergaenger  geht auf dem Pflaster, Wintermantel, Mütze, Schal,
                     Armschwung; manche mit den Händen in den Taschen;
                     sucht sich an Marktbuden einen freien Stehplatz
     kind_schlitten  Kind zieht einen Davoser Holzschlitten (mal leer,
                     mal mit einem Tannenbäumchen oder Päckchen); im
                     Frühling einen Bollerwagen mit Blumentöpfen. Der
                     Schlitten ist ein eigenes lebendes Ding
                     (schlitten_ladung), damit er richtig einsortiert wird
                     und nicht durch Wände oder über den Bach rutscht.
     schlittschuh    gleitet auf dem zugefrorenen See: Standbein gestreckt
                     unter dem Körper, Spielbein seitlich hinten, Oberkörper
                     vorgeneigt; jeder auf seiner eigenen Ellipse, mit
                     Abstand, Überholen und gelegentlichem Anhalten
     marktbesucher   kommt in Gruppen (2–4, manchmal ein Kind an der Hand)
                     vom Rand, steht an der Theke an, kauft, trinkt 1–3
                     Minuten Glühwein und plaudert (einander zugewandt),
                     schlendert weiter – dann kommt eine neue Gruppe

   DER KÖRPER (Gezeichnet mit ST.gestalt aus stadt/himmel.js): Becken,
   Beine mit Knie und Fuß, darüber der Mantel als eigene Hülle – Oberteil
   mit Schultern, Brust und Taille, darunter die Schöße, deren Saum dem
   Schwungbein folgt und vorn geschlitzt ist; Stehkragen und Revers als
   Platten, Taschenklappen ab s > 40, ab s > 60 Lodenstruktur und eine
   dunklere Nahtkante. Ärmel oben weiter, mit Ellbogenfalte und Bündchen,
   Fäustlinge als flache Eier mit Daumen. Licht von links wie bei den
   Häusern, nachts von Laternen und Buden warm angestrahlt.

   DER GANG: Knie beim Fersenaufsatz leicht gebeugt, 60° Kniebeuge mitten
   im Schwung (Oberschenkel schon vorn), beim Abstoßen höchstens ≈ 37°
   und 17° Fußstreckung; das Becken dreht sich ±4° um die Hochachse, die
   Schultern gegenläufig; der Körper hebt und senkt sich zweimal je
   Doppelschritt (aus den Beinlängen).

   Nachts gehen weniger Leute (Kinder sind daheim). Im Frühling leichtere
   Jacken, Bollerwagen, kein Eis, kein Dampf aus der Tasse.

   BEWEGUNG: Alle bleiben auf dem Pflaster (Kinder auch auf Schnee),
   weichen Häusern, Buden, Bäumen und einander aus (≥ 0,6 m, auch im
   Stehen). Über die Brücke gehen sie auf der Fahrbahn: Deckhöhe aus dem
   Längsprofil der Brücke, die vordere Brüstung verdeckt die Beine.
   Etwa jede Sekunde prüft jeder, ob er noch frei steht – wird auf ihm
   gebaut, tritt er zur Seite. Ohne Bude keine Glühweintrinker (sie werden
   zu Spaziergängern), ohne Eis keine Schlittschuhläufer.

   IN DER STADT: dorf.js ruft ST.menschenSetzen() auf – Spaziergänger,
   Kinder und Schlittschuhläufer nach ST.MENSCHEN_PLAETZE, Marktgruppen an
   den Buden, die gerade in der Stadt stehen. Menschen blockieren das Bauen
   nicht (ueberall) und werden nicht gespeichert.
   ZUM TESTEN: stadt.html?neu=1&leute=1&dazu=menschen setzt dieselben
   Statisten. In der Werkbank (werkbank=spaziergaenger&dazu=menschen)
   gehen sie auf der Stelle. HINWEIS: start.js versucht beim
   Werkbankaufruf, eine Datei stadt/modelle/<werkbank>.js zu laden – für
   die vier Arten gibt es keine eigene Datei, deshalb steht dann
   „Modell fehlt: spaziergaenger" (usw.) in der Konsole. Das ist erwartet
   und harmlos: die Modelle kommen aus dieser Datei (dazu=menschen).
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
  const sq = (x) => x * x;

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
    if (o._aus && o._aus.jahr === jahr && o._aus.art === art && o._aus.saat === o.saat) return o._aus;
    const r = ST.zufall(((o.saat | 0) ^ 0x5bd1e995) + 7);
    const w = (L) => L[Math.floor(r() * L.length) % L.length];
    const kind = art === "kind";
    const winter = jahr === "winter" || jahr === "herbst";
    const frau = r() < 0.5;
    const a = {
      art: art, jahr: jahr, saat: o.saat, kind: kind, frau: frau,
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
    a.gurt = !kind && a.saum < 0.4 && r() < 0.35;          // Mantel mit Gürtel
    a.tempo = kind ? 0.8 + r() * 0.15 : 1.05 + r() * 0.3;
    a.tasse = w(TASSE);
    o._aus = a;
    return a;
  }

  /* =====================================================================
     DAS SKELETT
     lokal: x = rechts, y = vorn (Blickrichtung), z = oben; Ursprung am Boden
     ===================================================================== */
  function masse(a) {
    const H = a.H;
    return a.kind
      ? { H: H, huefte: 0.45 * H, schulter: 0.765 * H, sb: 0.105 * H, hb: 0.058 * H, oa: 0.16 * H, ua: 0.145 * H, hals: 0.79 * H, kopf: 0.895 * H, kr: 0.096 * H }
      : { H: H, huefte: 0.53 * H, schulter: 0.815 * H, sb: 0.1 * H * a.breit, hb: 0.05 * H * a.breit, oa: 0.172 * H, ua: 0.152 * H, hals: 0.84 * H, kopf: 0.927 * H, kr: 0.066 * H };
  }

  /* Zweigelenk-Kette (Arm): Ellbogen so, dass die Hand das Ziel trifft;
     pol zieht den Ellbogen in seine Richtung */
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
    /* Becken dreht sich um die Hochachse (die Hüfte des Schwungbeins geht mit nach vorn) */
    const be = P.becken || 0, cb = Math.cos(be), sbk = Math.sin(be);
    /* Beine (0 = links, 1 = rechts) */
    for (let i = 0; i < 2; i++) {
      const sd = i ? 1 : -1, b = P.bein[i], sb = Math.sin(b.b || 0) * sd, cbb = Math.cos(b.b || 0);
      const Hj = plus(P0, [sd * m.hb * cb, sd * m.hb * sbk, 0]);
      const Kn = plus(Hj, mal([sb, Math.sin(b.a) * cbb, -Math.cos(b.a) * cbb], Lt));
      const An = plus(Kn, mal([sb, Math.sin(b.a - b.k) * cbb, -Math.cos(b.a - b.k) * cbb], Ls));
      const phi = (b.a - b.k) + (b.f || 0);
      const D = [0, Math.cos(phi), Math.sin(phi)];
      sk.bein.push({ H: Hj, K: Kn, A: An, D: D, fuss: plus(An, plus(mal(D, 0.04 * H), [0, 0, -0.02 * H])) });
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
      sk.arm.push({ S: S, E: E, Hd: Hd, tasche: !!ar.tasche, sd: sd });
    }
    /* Hals und Kopf */
    sk.N = T(0, 0, m.hals - m.huefte);
    const kn = P.kopfNick || 0, kd = P.kopfDreh || 0;
    const Xh0 = einheit(plus(mal(X, Math.cos(kd)), mal(Y, Math.sin(kd)))), Yh0 = kreuz(U, Xh0);
    const Uh = einheit(plus(mal(U, Math.cos(kn)), mal(Yh0, Math.sin(kn))));
    const Yh = einheit(minus(Yh0, mal(Uh, pkt(Yh0, Uh))));
    sk.Xh = Xh0; sk.Yh = Yh; sk.Uh = Uh;
    sk.K = plus(sk.N, mal(Uh, m.kopf - m.hals));
    /* Mund (für das Trinken): vor den Lippen, aus den Kopfachsen */
    sk.mund = plus(sk.K, plus(mal(Yh, 0.95 * m.kr + 0.035), mal(Uh, -0.42 * m.kr)));
    return sk;
  }

  /* Ellipsoid mit Achsen in Richtungen a, b, c (Einheitsvektoren) */
  function eiAchsen(B, c, A, ra, Bv, rb, C, rc, farbe, opt) { return B.ei(c, mal(A, ra), mal(Bv, rb), mal(C, rc), farbe, opt); }

  /* =====================================================================
     DER MENSCH – Beine, Becken, Mantel (eigene Hülle), Arme, Kopf
     ===================================================================== */
  function mensch(B, a, sk, opt) {
    const m = sk.m, H = m.H, s = B.s;
    const fein = s > 26, s40 = s > 40, sehrFein = s > 60, grob = s < 22;   // Detailstufe nach Pixeln je Meter
    const X = sk.X, Y = sk.Y, U = sk.U;
    const winter = a.jahr === "winter" || a.jahr === "herbst";
    const stiefel = winter;
    const dk = a.kind ? (winter ? 1.3 : 1.12) : 1;     // Kinder im Schneeanzug: dickere Glieder
    const matt = 0.3;
    /* Beine: Hose, Stiefel/Schuhe */
    for (let i = 0; i < 2; i++) {
      const b = sk.bein[i];
      B.glied(b.H, 0.054 * H * dk, b.K, 0.039 * H * dk, a.hose, { matt: matt });
      B.glied(b.K, 0.037 * H * dk, b.A, 0.027 * H * dk, grob && stiefel ? mix(a.hose, a.schuh, 0.5) : a.hose, { matt: matt });
      if (stiefel && !grob) B.glied(mix(b.K, b.A, 0.5), 0.032 * H * dk, b.A, 0.03 * H * dk, a.schuh, { tiefe: 0.005, glanz: sehrFein ? 0.15 : 0 });
      const qu = einheit(kreuz(b.D, [0, 0, 1]).map((x, k) => k === 2 ? 0 : x));
      /* Schuh: echte Länge (≈ 0,15 × Körpergröße), schlank und flach */
      eiAchsen(B, b.fuss, b.D, 0.071 * H, qu[0] || qu[1] ? qu : [1, 0, 0], 0.026 * H, einheit(kreuz(qu, b.D)), 0.023 * H, a.schuh, { tiefe: 0.01, glanz: sehrFein ? 0.25 : 0 });
      if (opt.kufen) {
        /* Schlittschuhkufe unter dem Stiefel */
        const f0 = plus(b.fuss, plus(mal(b.D, -0.085 * H), [0, 0, -0.03 * H])), f1 = plus(b.fuss, plus(mal(b.D, 0.1 * H), [0, 0, -0.028 * H]));
        B.band([f0, f1, plus(f1, plus(mal(b.D, 0.012 * H), [0, 0, 0.012 * H]))], 0.006 * H, KUFE, { glanz: 1, tiefe: 0.012 });
      }
    }
    /* Becken (Hose) – bei kurzen Jacken sieht man es zwischen Saum und Beinen */
    eiAchsen(B, sk.P0, X, 0.094 * H * a.breit * dk, Y, 0.064 * H * dk, U, 0.06 * H, a.hose, { matt: matt, tiefe: -0.3 });

    /* ---- Mantel als eigene Hülle über Brustkorb, Schultern und Becken ---- */
    const hz = m.huefte, saum = a.saum * H, zS = m.schulter - hz;
    const zR = (f) => f * zS;                          // Höhe zwischen Hüfte (0) und Schulter (1)
    const br = (a.kind ? 1.05 : 1) * a.breit, taille = a.frau ? 0.9 : 1;
    const dunkel = a.mantel.map((x) => x * 0.62);
    /* Saum folgt dem Schwungbein: Saummitte um 0,3 · Kniehub verschoben */
    const kv = sk.bein.map((b) => { const d = minus(b.K, sk.P0); return [pkt(d, X), pkt(d, Y)]; });
    const vorn = kv[0][1] > kv[1][1] ? kv[0] : kv[1];
    const saumX = 0.09 * vorn[0] * (opt.saumWind || 1), saumY = 0.3 * Math.max(-0.02 * H, vorn[1]) + (opt.saumSchwung || 0);
    const saumT = 0.086 * H + 0.22 * Math.abs(kv[0][1] - kv[1][1]);
    const Ralt = B.R;
    B.rahmen(GS.rahmen(B.pk(sk.P0), B.rk(X), B.rk(Y), B.rk(U)));
    const lok = (dx, dy, dz) => [dx, dy, dz];
    /* Vorderseite zum Betrachter? (Schlitz, Taschen, Knöpfe nur dann – Flecken sähe man sonst durch den Rücken) */
    const vornSicht = klemm(pkt(B.rk([0, 1, 0]), AUGE) * 2.5 + 0.3, 0, 1);
    const stoff = (saat) => sehrFein ? { n: a.kind ? 45 : 70, laenge: 0.022, richtung: [0, 0.15, -1], streu: 0.35, a: 0.2, breite: 0.0035, saat: saat } : null;
    /* Oberteil: Schulterkappen, Kragenansatz, Brust, Taille */
    const flO = [];
    if (fein) {
      /* Achselfalten und – bei Gürtelmänteln – der Gürtel */
      for (const sd of [1, -1]) flO.push({ c: lok(sd * 0.085 * H * br, 0.01 * H, zR(0.62)), a: [[0.012 * H, 0, 0], [0, 0.03 * H, 0], [0, 0, 0.04 * H]], alb: dunkel, n: [sd, 0.3, 0], k: 0.45 });
    }
    B.koerper([
      { c: lok(-m.sb * 0.92, -0.004 * H, zS - 0.006 * H), r: 0.041 * H * br },
      { c: lok(m.sb * 0.92, -0.004 * H, zS - 0.006 * H), r: 0.041 * H * br },
      { c: lok(0, -0.004 * H, m.hals - hz - 0.022 * H), a: [[0.05 * H, 0, 0], [0, 0.046 * H, 0], [0, 0, 0.02 * H]] },
      { c: lok(0, 0.006 * H, zR(0.61)), a: [[0.1 * H * br, 0, 0], [0, 0.074 * H, 0], [0, 0, 0.085 * H]] },
      { c: lok(0, 0.002 * H, zR(0.25)), a: [[0.085 * H * br * taille, 0, 0], [0, 0.063 * H, 0], [0, 0, 0.03 * H]] }
    ], a.mantel, { matt: matt, flecken: flO.length ? flO : null, fell: stoff(11), kontur: sehrFein ? 0.003 : 0 });
    /* Schöße: von der Taille über die Hüfte bis zum Saum, vorn geschlitzt */
    const flU = [];
    if (fein) {
      if (vornSicht > 0.05) flU.push({ c: lok(0.004 * H, 0.078 * H + saumY * 0.5, (saum - hz + zR(0.25)) / 2), a: [[0.0035 * H, 0, 0], [0, 0.012 * H, 0], [0, 0, (zR(0.25) - (saum - hz)) / 2]], alb: dunkel.map((x) => x * 0.7), n: [0, 1, 0], k: 0.75 * vornSicht, hart: 0.9 });
      flU.push({ c: lok(saumX, 0.0, saum - hz + 0.018 * H), a: [[0.13 * H, 0, 0], [0, 0.1 * H, 0], [0, 0, 0.012 * H]], alb: dunkel, n: [0, 0, -1], k: 0.45 });
      if (s40 && !a.kind && vornSicht > 0.05) for (const sd of [1, -1]) {
        /* Taschenklappen: dunkle Klappe, darüber eine helle Kante */
        flU.push({ c: lok(sd * 0.066 * H, 0.066 * H, -0.052 * H), a: [[0.03 * H, 0, 0], [0, 0.012 * H, 0], [0, 0, 0.009 * H]], alb: dunkel, n: [0, 1, 0], k: 0.7 * vornSicht, hart: 0.85 });
        flU.push({ c: lok(sd * 0.066 * H, 0.068 * H, -0.042 * H), a: [[0.03 * H, 0, 0], [0, 0.01 * H, 0], [0, 0, 0.003 * H]], alb: a.mantel.map((x) => Math.min(255, x * 1.35 + 12)), n: [0, 1, 0.5], k: 0.45 * vornSicht, hart: 0.6 });
      }
    }
    B.koerper([
      { c: lok(0, 0.002 * H, zR(0.25)), a: [[0.085 * H * br * taille, 0, 0], [0, 0.063 * H, 0], [0, 0, 0.025 * H]] },
      { c: lok(0, 0.0, 0.0), a: [[0.098 * H * br, 0, 0], [0, 0.07 * H, 0], [0, 0, 0.045 * H]] },
      { c: lok(saumX, saumY, saum - hz + 0.01 * H), a: [[(a.saum < 0.4 ? 0.122 : 0.104) * H * br, 0, 0], [0, saumT, 0], [0, 0, 0.012 * H]] }
    ], a.mantel, { matt: matt, tiefe: -0.002, flecken: flU.length ? flU : null, fell: stoff(12), kontur: sehrFein ? 0.003 : 0 });
    /* Gürtel: ein Band um die Taille, die hintere Hälfte hinter dem Mantel */
    if (a.gurt && fein) {
      const pts = [];
      for (let i = 0; i <= 16; i++) { const w = i / 16 * TAU; pts.push(lok(Math.cos(w) * 0.089 * H * br * taille, Math.sin(w) * 0.067 * H, zR(0.25))); }
      for (let i = 0; i < 16; i += 4) { const mm = pts[i + 2]; const vorne = pkt(B.rk([mm[0], mm[1], 0]), AUGE) > 0; B.band(pts.slice(i, i + 5), 0.028 * H, dunkel.map((x) => x * 0.8), { tiefe: vorne ? 0.04 : -0.4 }); }
    }
    /* Revers als Platten auf der Brust, Stehkragen (ohne Schal), Knöpfe */
    if (fein && !a.kind) {
      for (const sd of [1, -1]) {
        B.platte([lok(sd * 0.013 * H, 0.066 * H, zR(0.93)), lok(sd * 0.062 * H, 0.058 * H, zR(0.86)), lok(sd * 0.05 * H, 0.078 * H, zR(0.66)), lok(sd * 0.012 * H, 0.081 * H, zR(0.42))],
          a.mantel.map((x) => x * 0.86), { n: [sd * 0.15, 1, 0.3], tiefe: 0.02, kante: sehrFein ? "rgba(20,14,10,0.35)" : null });
      }
      for (let k = 0; k < 3; k++) B.kugel(lok(0.014 * H, 0.08 * H, zR(0.36) - k * 0.07 * H), 0.0065 * H, a.mantel.map((x) => x * 0.4), { tiefe: 0.03, glanz: sehrFein ? 0.3 : 0 });
    }
    if (!a.schal) B.ei(lok(0, -0.004 * H, m.hals - hz - 0.006 * H), [0.054 * H, 0, 0], [0, 0.05 * H, 0], [0, 0, 0.03 * H], a.mantel.map((x) => x * 0.94), { tiefe: 0.01, matt: matt });
    /* Schal: Wickel um den Hals und ein hängendes Ende */
    if (a.schal) {
      B.ei(lok(0, 0.006 * H, m.hals - hz - 0.004 * H), [0.056 * H, 0, 0], [0, 0.052 * H, 0], [0, 0, 0.03 * H], a.schal, { tiefe: 0.01, matt: 0.4, fell: sehrFein ? { n: 20, laenge: 0.012, richtung: [1, 0, 0.3], streu: 0.2, a: 0.25, saat: 3 } : null });
      if (fein) {
        const w = opt.wind || 0;
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
    /* Arme: Ärmel oben weiter, Ellbogenfalte, Bündchen; Fäustling mit Daumen */
    for (let i = 0; i < 2; i++) {
      const ar = sk.arm[i];
      const hand = ar.tasche ? mix(ar.E, ar.Hd, 0.86) : ar.Hd;
      const W = mix(ar.E, hand, 0.9);
      B.glied(ar.S, 0.05 * H * dk, ar.E, 0.038 * H * dk, a.mantel, { tiefe: 0.002, matt: matt, flecken: fein ? [{ c: ar.E, a: [[0.02 * H, 0, 0], [0, 0.02 * H, 0], [0, 0, 0.02 * H]], alb: dunkel, n: [0, 1, 0], k: 0.5 }] : null });
      B.glied(ar.E, 0.037 * H * dk, W, 0.031 * H * dk, a.mantel, { tiefe: 0.003, matt: matt });
      if (fein) B.glied(mix(ar.E, W, 0.84), 0.035 * H * dk, W, 0.034 * H * dk, a.mantel.map((x) => x * 0.84), { tiefe: 0.0035, matt: matt });
      if (!ar.tasche && !grob) {
        const ad = einheit(minus(ar.Hd, ar.E));
        let fw = minus(opt.daumen && opt.daumen[i] ? opt.daumen[i] : Y, mal(ad, pkt(Y, ad)));
        if (Math.hypot(fw[0], fw[1], fw[2]) < 0.25) fw = minus(U, mal(ad, pkt(U, ad)));
        fw = einheit(fw);
        const dick = einheit(kreuz(fw, ad));
        const hm = plus(ar.Hd, mal(ad, 0.016 * H));
        const farbe = a.handschuh || a.haut;
        B.ei(hm, mal(ad, 0.035 * H * dk), mal(fw, 0.026 * H * dk), mal(dick, 0.016 * H * dk), farbe, { tiefe: 0.004, matt: 0.3 });
        if (fein) B.ei(plus(hm, plus(mal(fw, 0.022 * H * dk), mal(ad, -0.012 * H))), mal(ad, 0.016 * H * dk), mal(fw, 0.009 * H * dk), mal(dick, 0.009 * H * dk), farbe, { tiefe: 0.005 });
      }
    }
    /* Hals, Kopf, Haar, Mütze */
    const K = sk.K, Xh = sk.Xh, Yh = sk.Yh, Uh = sk.Uh;
    if (!a.schal) B.glied(sk.N, 0.028 * H * (a.kind ? 1.1 : 1), plus(sk.N, mal(Uh, 0.05 * H)), 0.026 * H, a.haut);
    const kr = m.kr;
    const kopfOpt = { flecken: [], matt: 0.25 };
    /* Haar als Kappe auf dem Kopf (Haaransatz über der Stirn, hinten tief) */
    if (!(a.muetze && a.muetze.art !== "kappe" && !fein)) kopfOpt.flecken.push({ c: plus(K, plus(mal(Uh, 0.55 * kr), mal(Yh, -0.34 * kr))), a: [mal(Xh, 1.02 * kr), mal(Yh, 1.02 * kr), mal(Uh, 0.82 * kr)], alb: a.haar, n: Uh, k: 1, hart: 0.9 });
    if (fein && winter) kopfOpt.flecken.push(
      { c: plus(K, plus(mal(Yh, 0.7 * kr), plus(mal(Xh, 0.45 * kr), mal(Uh, -0.2 * kr)))), a: [mal(Xh, 0.3 * kr), mal(Yh, 0.3 * kr), mal(Uh, 0.25 * kr)], alb: [226, 128, 118], n: Yh, k: 0.35 },
      { c: plus(K, plus(mal(Yh, 0.7 * kr), plus(mal(Xh, -0.45 * kr), mal(Uh, -0.2 * kr)))), a: [mal(Xh, 0.3 * kr), mal(Yh, 0.3 * kr), mal(Uh, 0.25 * kr)], alb: [226, 128, 118], n: Yh, k: 0.35 }
    );
    if (sehrFein) kopfOpt.flecken.push(
      /* Augenhöhlen unter den Brauen */
      { c: plus(K, plus(mal(Yh, 0.78 * kr), plus(mal(Xh, 0.3 * kr), mal(Uh, 0.14 * kr)))), a: [mal(Xh, 0.16 * kr), mal(Yh, 0.1 * kr), mal(Uh, 0.1 * kr)], alb: a.haut.map((x) => x * 0.72), n: Yh, k: 0.55 },
      { c: plus(K, plus(mal(Yh, 0.78 * kr), plus(mal(Xh, -0.3 * kr), mal(Uh, 0.14 * kr)))), a: [mal(Xh, 0.16 * kr), mal(Yh, 0.1 * kr), mal(Uh, 0.1 * kr)], alb: a.haut.map((x) => x * 0.72), n: Yh, k: 0.55 }
    );
    /* ganz klein: Haar und Gesicht zu einer Farbe mischen, damit der Kopf nicht als heller Punkt wirkt */
    const kopfAlb = s < 24 && !a.muetze ? mix(a.haut, a.haar, 0.5) : a.haut;
    eiAchsen(B, K, Xh, 0.78 * kr, Yh, 0.86 * kr, Uh, kr, kopfAlb, kopfOpt);
    const haarT = plus(K, plus(mal(Yh, -0.14 * kr), mal(Uh, 0.14 * kr)));
    if (!grob || !a.muetze) eiAchsen(B, haarT, Xh, 0.82 * kr, Yh, 0.84 * kr, Uh, 0.93 * kr, a.haar, { tiefe: -0.02, matt: 0.3 });
    if (a.haarLang) eiAchsen(B, plus(K, plus(mal(Yh, -0.5 * kr), mal(Uh, -0.75 * kr))), Xh, 0.78 * kr, Yh, 0.42 * kr, Uh, 1.0 * kr, a.haar, { tiefe: -0.03, matt: 0.3 });
    if (fein) {
      /* Nase als leise Form, Ohren */
      eiAchsen(B, plus(K, plus(mal(Yh, 0.86 * kr), mal(Uh, -0.1 * kr))), Xh, 0.13 * kr, Yh, 0.16 * kr, Uh, 0.2 * kr, a.haut.map((x) => x * 0.97), { tiefe: 0.02 });
      for (const sd of [1, -1]) eiAchsen(B, plus(K, mal(Xh, sd * 0.78 * kr)), Xh, 0.08 * kr, Yh, 0.16 * kr, Uh, 0.24 * kr, a.haut.map((x) => x * 0.95), { tiefe: -0.005 });
    }
    if (sehrFein) {
      for (const sd of [1, -1]) {
        eiAchsen(B, plus(K, plus(mal(Yh, 0.78 * kr), plus(mal(Xh, sd * 0.3 * kr), mal(Uh, 0.1 * kr)))), Xh, 0.07 * kr, Yh, 0.04 * kr, Uh, 0.05 * kr, [48, 36, 32], { tiefe: 0.015 });
        eiAchsen(B, plus(K, plus(mal(Yh, 0.74 * kr), plus(mal(Xh, sd * 0.31 * kr), mal(Uh, 0.26 * kr)))), Xh, 0.12 * kr, Yh, 0.04 * kr, Uh, 0.03 * kr, a.haar, { tiefe: 0.016 });
      }
    }
    const mu = a.muetze;
    if (mu) {
      if (mu.art === "bommel" || mu.art === "strick") {
        eiAchsen(B, plus(K, plus(mal(Uh, 0.42 * kr), mal(Yh, -0.06 * kr))), Xh, 0.86 * kr, Yh, 0.93 * kr, Uh, 0.78 * kr, mu.farbe, { tiefe: 0.01, matt: 0.4, fell: sehrFein ? { n: 24, laenge: 0.012, richtung: [0, 0, 1], streu: 0.1, a: 0.3, saat: 9 } : null });
        if (!grob) eiAchsen(B, plus(K, plus(mal(Uh, 0.2 * kr), mal(Yh, -0.03 * kr))), Xh, 0.88 * kr, Yh, 0.95 * kr, Uh, 0.26 * kr, mu.farbe.map((x) => x * 0.86), { tiefe: 0.012, matt: 0.4 });
        if (mu.art === "bommel" && !grob) B.kugel(plus(K, plus(mal(Uh, 1.22 * kr), mal(Yh, -0.1 * kr))), 0.3 * kr, mu.farbe.map((x) => Math.min(255, x * 1.15 + 20)), { tiefe: 0.02, pelz: fein, flocke: 0.006, matt: 0.4 });
      } else if (mu.art === "hut") {
        eiAchsen(B, plus(K, mal(Uh, 0.62 * kr)), Xh, 1.35 * kr, Yh, 1.4 * kr, Uh, 0.09 * kr, mu.farbe, { tiefe: 0.01, matt: 0.3 });
        eiAchsen(B, plus(K, mal(Uh, 0.95 * kr)), Xh, 0.78 * kr, Yh, 0.86 * kr, Uh, 0.45 * kr, mu.farbe, { tiefe: 0.012, matt: 0.3 });
        if (!grob) eiAchsen(B, plus(K, mal(Uh, 0.74 * kr)), Xh, 0.8 * kr, Yh, 0.88 * kr, Uh, 0.12 * kr, mu.farbe.map((x) => x * 0.55), { tiefe: 0.013 });
      } else if (mu.art === "pelz") {
        eiAchsen(B, plus(K, mal(Uh, 0.66 * kr)), Xh, 0.95 * kr, Yh, 1.0 * kr, Uh, 0.6 * kr, mu.farbe, { tiefe: 0.01, pelz: fein, flocke: 0.006, matt: 0.4 });
      } else if (mu.art === "kappe") {
        eiAchsen(B, plus(K, plus(mal(Uh, 0.45 * kr), mal(Yh, -0.05 * kr))), Xh, 0.85 * kr, Yh, 0.9 * kr, Uh, 0.62 * kr, mu.farbe, { tiefe: 0.01, matt: 0.3 });
        eiAchsen(B, plus(K, plus(mal(Uh, 0.32 * kr), mal(Yh, 0.8 * kr))), Xh, 0.6 * kr, Yh, 0.45 * kr, Uh, 0.06 * kr, mu.farbe.map((x) => x * 0.85), { tiefe: 0.012 });
      }
    }
  }

  /* =====================================================================
     BEWEGUNG: Gangbild, Stehen
     ===================================================================== */
  /* Gangzyklus je Bein: ψ = 0 Fersenaufsatz, 0,6 Abstoßen, 0,73 größte
     Kniebeuge (≈ 60°, Oberschenkel schon vorn), 1 nächster Fersenaufsatz */
  function beinImGang(psi, A, g) {
    const w = psi * TAU;
    const hueft = 0.035 + A * Math.cos(w);
    const dl = ((psi - 0.15 + 1.5) % 1) - 0.5;                 // Abstand zur Belastungsphase (periodisch)
    const vor = psi < 0.72 ? (psi - 0.72) / 0.168 : (psi - 0.72) / 0.1;
    const knie = 0.06 + g * (0.2 * Math.exp(-sq(dl / 0.07)) + 0.98 * Math.exp(-vor * vor));
    /* Fuß: im Stand flach auf dem Boden, beim Aufsetzen Zehen hoch, beim
       Abstoßen höchstens ≈ 17° gestreckt, im Schwung neutral */
    const schien = hueft - knie;
    const flach = glatt(0, 0.05, psi) * (1 - glatt(0.45, 0.62, psi));
    const schwung = psi < 0.62 ? -0.3 * glatt(0.45, 0.62, psi) : -0.3 * (1 - glatt(0.62, 0.78, psi)) + 0.08 * glatt(0.8, 0.98, psi);
    const f = g * (flach * -schien + (1 - flach) * schwung) + (1 - g) * -schien;
    return { a: hueft, k: knie, f: f, b: 0 };
  }
  function gehPose(a, ph, g, t, zus) {
    const m = masse(a), bl = m.huefte;
    const A = (0.41 * a.H) / (Math.PI * bl) * g;
    const bein = [beinImGang(ph % 1, A, g), beinImGang((ph + 0.5) % 1, A, g)];
    const wL = (ph % 1) * TAU;
    const arm = [];
    for (let i = 0; i < 2; i++) {
      const w = wL + (i ? Math.PI : 0);
      if (a.taschen && !(zus && zus.armFrei)) arm.push({ a: 0.06, e: 0.9, ab: 0.2, tasche: true });
      /* Arm schwingt gegen das Bein derselben Seite, der Ellbogen beugt sich beim Vorschwingen */
      else arm.push({ a: -0.28 * g * Math.cos(w) + 0.04, e: 0.2 + 0.25 * g * Math.max(0, -Math.cos(w)), ab: 0.1 });
    }
    const atmen = Math.sin(t * 1.6) * 0.004;
    return {
      bein: bein, arm: arm, neig: 0.035 + 0.03 * g, seit: -0.012 * g * Math.sin(wL),
      becken: -0.07 * g * Math.cos(wL), dreh: 0.05 * g * Math.cos(wL),
      x: -0.012 * a.H * g * Math.sin(wL), z: atmen, kopfNick: 0.06, kopfDreh: 0
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

  /* =====================================================================
     HILFEN FÜR DIE WELT
     ===================================================================== */
  const SZ = () => ST.szene;
  /* Die Steinbrücke (stadt/modelle/bruecke.js): Längsprofil der Fahrbahn –
     Kuppe als Kreisbogen (r = 2,4 m, Scheitel 1,68 m), gerade Rampe, weicher
     Fuß (r = 0,9 m), halbe Länge 5,6 m; lichte Weite zwischen den Brüstungen
     2,9 m, Brüstung 0,97 m hoch (mit Abdeckplatte), 0,35 m dick. Dieselben
     Maße wie im Brückenmodell, damit die Füße auf dem Pflaster stehen. */
  const BR = { L: 5.6, W: 5.1, xi: 1.45, xa: 1.8, krone: 1.68, rk: 2.4, rf: 0.9, bruestung: 0.97 };
  const BR_PROF = (() => { const S = BR.rk + BR.rf, m = (BR.L - Math.sqrt(BR.L * BR.L - 2 * S * BR.krone)) / S; return { m: m, u1: m * BR.rk, u2: BR.L - m * BR.rf, z1: BR.krone - m * m * BR.rk / 2 }; })();
  function deckZ(v) {
    const u = Math.abs(v);
    if (u >= BR.L) return 0;
    if (u <= BR_PROF.u1) return BR.krone - u * u / (2 * BR.rk);
    if (u <= BR_PROF.u2) return BR_PROF.z1 - BR_PROF.m * (u - BR_PROF.u1);
    const d = BR.L - u; return d * d / (2 * BR.rf);
  }
  const BEGEHBAR = { bruecke: true };

  /* Hindernisse (Gebäude, Buden, Bäume) als gedrehte Rechtecke im Raster */
  let hind = null, hindN = -1, hindZeit = -1e9;
  function hindernisse(jetzt) {
    const S = SZ();
    if (hind && hindN === S.objekte.length && Math.abs(jetzt - hindZeit) < 1) return hind;
    hindN = S.objekte.length; hindZeit = jetzt;
    const zellen = new Map(), buden = [], stege = [];
    for (const o of S.objekte) {
      const d = ST.MODELLE[o.typ];
      if (!d || d.live || o.rand || !d.grund) continue;
      const r = o.gier * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
      if (BEGEHBAR[o.typ]) {
        /* Brücke: kein Hindernis, sondern ein Weg über das Wasser – nur die
           lichte Fahrbahn zwischen den Brüstungen, 0,3 m Abstand je Seite */
        stege.push({ x: o.x, y: o.y, c: c, s: sn, hb: BR.xi - 0.3, ht: BR.L + 0.4, o: o });
        continue;
      }
      const hb = d.grund[0] / 2 + 0.3, ht = d.grund[1] / 2 + 0.3;
      const e = { x: o.x, y: o.y, c: c, s: sn, hb: hb, ht: ht, o: o };
      const rr = Math.hypot(hb, ht);
      for (let i = Math.floor((o.x - rr) / 4); i <= Math.floor((o.x + rr) / 4); i++)
        for (let j = Math.floor((o.y - rr) / 4); j <= Math.floor((o.y + rr) / 4); j++) {
          const k = i + "," + j; if (!zellen.has(k)) zellen.set(k, []); zellen.get(k).push(e);
        }
      if (o.typ === "marktbude") buden.push(budeDaten(o, d));
    }
    hind = { zellen: zellen, buden: buden, stege: stege };
    return hind;
  }
  /* Marktbude: Vorderseite = +y des Modells; Theke, Blick, Querrichtung */
  function budeDaten(o, d) {
    const r = o.gier * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
    const vx = -sn, vy = c, qx = c, qy = sn, ab = d.grund[1] / 2;
    return { o: o, x: o.x, y: o.y, vx: vx, vy: vy, qx: qx, qy: qy, ab: ab,
      theke: [o.x + vx * (ab + 0.6), o.y + vy * (ab + 0.6)], blick: Math.atan2(-vy, -vx), schl: o.x.toFixed(2) + "," + o.y.toFixed(2) + "," + o.gier };
  }
  /* Steht (x, y) auf einem Steg? → { e, u, v, z } mit der Deckhöhe z */
  function stegAn(x, y, h) {
    for (const e of h.stege) {
      const dx = x - e.x, dy = y - e.y, u = dx * e.c + dy * e.s, v = -dx * e.s + dy * e.c;
      if (Math.abs(u) < e.hb && Math.abs(v) < e.ht) return { e: e, u: u, v: v, z: deckZ(v) };
    }
    return null;
  }
  function frei(x, y, h, ohneBoden) {
    const G = ST.boden.GROESSE / 2 - 1;
    if (Math.abs(x) > G || Math.abs(y) > G) return false;
    if (h.stege.length && stegAn(x, y, h)) return true;
    const L = h.zellen.get(Math.floor(x / 4) + "," + Math.floor(y / 4));
    if (L) for (const e of L) {
      const dx = x - e.x, dy = y - e.y, u = dx * e.c + dy * e.s, v = -dx * e.s + dy * e.c;
      if (Math.abs(u) < e.hb && Math.abs(v) < e.ht) return false;
    }
    if (!ohneBoden && ST.boden.wert(x, y, 0) < 0.45) return false;
    if (ST.boden.wert(x, y, 1) > 0.4) return false;
    return true;
  }
  function winkelDiff(a, b) { let d = a - b; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; return d; }
  function gierAus(h) { return Math.atan2(-Math.cos(h), Math.sin(h)) * 180 / Math.PI; }
  function richtungAus(gier) { const r = gier * Math.PI / 180; return Math.atan2(Math.cos(r), -Math.sin(r)); }

  /* Alle lebenden Menschen (einmal je Bild gesammelt) */
  let leuteT = -1, leute = [];
  function lebende(t) {
    if (t !== leuteT) { leuteT = t; leute = SZ().objekte.filter((p) => p._m && ST.MODELLE[p.typ] && ST.MODELLE[p.typ].live && p.typ !== "schlitten_ladung"); }
    return leute;
  }
  /* Abstand halten (auch im Stehen): wer näher als d steht, rückt weg */
  function abstandHalten(o, t, dt, h, d, ohneBoden) {
    let px = 0, py = 0;
    for (const p of lebende(t)) {
      if (p === o || !anwesend(p)) continue;
      const dx = o.x - p.x, dy = o.y - p.y, l = Math.hypot(dx, dy);
      if (l < d && l > 1e-4) { const k = (d - l) / d; px += dx / l * k; py += dy / l * k; }
      else if (l <= 1e-4) { px += Math.cos(o.saat) * 0.5; py += Math.sin(o.saat) * 0.5; }
    }
    if (!px && !py) return false;
    const nx = o.x + px * dt * 0.8, ny = o.y + py * dt * 0.8;
    if (frei(nx, ny, h, ohneBoden)) { o.x = nx; o.y = ny; }
    return true;
  }

  /* Lenken und einen Schritt gehen: vorausschauen, freien Winkel suchen,
     anderen ausweichen; wer trotzdem feststeckt (Nische, Ecke), wählt
     nach 1,5 s eine neue freie Richtung und hält sie eine Weile */
  function lenken(o, m, dt, h, ohneBoden, v, ausweichen, t) {
    const geht = (w, d) => frei(o.x + Math.cos(w) * d, o.y + Math.sin(w) * d, h, ohneBoden) && frei(o.x + Math.cos(w) * d * 0.45, o.y + Math.sin(w) * d * 0.45, h, ohneBoden);
    if (m.fest > 0) m.fest -= dt;
    else if (!geht(m.h, 1.1)) {
      let neu = null;
      for (let k = 1; k <= 12 && neu == null; k++) for (const sg of [1, -1]) { const w = m.h + sg * k * 0.26; if (geht(w, 1.1)) { neu = w; break; } }
      if (neu == null) { m.h += Math.PI * (0.6 + m.r() * 0.8); m.fest = 0.6; }
      else if (Math.abs(winkelDiff(neu, m.h)) > 0.8) { m.h = neu; m.fest = 0.8; }
      else m.h += klemm(winkelDiff(neu, m.h), -dt * 4, dt * 4);
    }
    if (ausweichen) for (const p of lebende(t)) {
      if (p === o) continue;
      const dx = p.x - o.x, dy = p.y - o.y, d = Math.hypot(dx, dy);
      if (d < 1.0 && d > 1e-3) {
        const vorn = (dx * Math.cos(m.h) + dy * Math.sin(m.h)) / d;
        if (vorn > 0.3) m.h += dt * 1.8 * (winkelDiff(Math.atan2(dy, dx), m.h) > 0 ? -1 : 1);
      }
    }
    const nx = o.x + Math.cos(m.h) * v * dt, ny = o.y + Math.sin(m.h) * v * dt;
    const ging = frei(nx, ny, h, ohneBoden);
    if (ging) { o.x = nx; o.y = ny; }
    if (v > 0.3 && !ging) m.stau = (m.stau || 0) + dt; else m.stau = Math.max(0, (m.stau || 0) - dt * 0.5);
    if (m.stau > 1.5) {
      m.stau = 0;
      for (let k = 0; k < 16; k++) { const w = m.r() * TAU; if (geht(w, 1.6)) { m.h = w; m.fest = 1.5; break; } }
    }
    return ging;
  }
  /* Einem Weg (Liste von Punkten) folgen; true = angekommen */
  function wegFolgen(o, m, dt, h, v, t, ohneBoden) {
    if (!m.weg || m.wegI >= m.weg.length) return true;
    const z = m.weg[m.wegI], dx = z[0] - o.x, dy = z[1] - o.y, d = Math.hypot(dx, dy);
    if (d < (m.wegI === m.weg.length - 1 ? 0.12 : 0.4)) { m.wegI++; return m.wegI >= m.weg.length; }
    const soll = Math.atan2(dy, dx);
    m.h += klemm(winkelDiff(soll, m.h), -dt * 5, dt * 5);
    const schritt = Math.min(v * dt, d);
    /* anderen ausweichen: wer dicht vorn steht, wird seitlich umgangen */
    let ax = 0, ay = 0;
    for (const p of lebende(t)) {
      if (p === o || (m.gruppe && p._m && p._m.gruppe === m.gruppe)) continue;
      const ex = p.x - o.x, ey = p.y - o.y, l = Math.hypot(ex, ey);
      if (l < 0.75 && l > 1e-3 && (ex * Math.cos(m.h) + ey * Math.sin(m.h)) > 0) { ax -= ey / l; ay += ex / l; }
    }
    let nx = o.x + Math.cos(m.h) * schritt + ax * schritt * 0.4, ny = o.y + Math.sin(m.h) * schritt + ay * schritt * 0.4;
    if (!frei(nx, ny, h, ohneBoden)) { nx = o.x + dx / d * schritt; ny = o.y + dy / d * schritt; }
    if (frei(nx, ny, h, ohneBoden) || !frei(o.x, o.y, h, ohneBoden)) { o.x = nx; o.y = ny; m.stau = 0; }
    else if ((m.stau = (m.stau || 0) + dt) > 2) { m.stau = 0; m.weg = null; return true; }
    return false;
  }
  /* Wegsuche (A*) auf einem 0,5-m-Raster um Start und Ziel */
  function wegSuchen(von, nach, h, ohneBoden) {
    const R = 0.5, rand = 7;
    const x0 = Math.min(von[0], nach[0]) - rand, y0 = Math.min(von[1], nach[1]) - rand;
    const nx = Math.ceil((Math.abs(von[0] - nach[0]) + 2 * rand) / R) + 1, ny = Math.ceil((Math.abs(von[1] - nach[1]) + 2 * rand) / R) + 1;
    if (nx * ny > 9000) return null;
    const N = nx * ny, zu = new Int8Array(N).fill(-1), g = new Float32Array(N).fill(1e9), vor = new Int32Array(N).fill(-1), zu2 = new Uint8Array(N);
    const zi = (x, y) => [klemm(Math.round((x - x0) / R), 0, nx - 1), klemm(Math.round((y - y0) / R), 0, ny - 1)];
    const [si, sj] = zi(von[0], von[1]), [ei, ej] = zi(nach[0], nach[1]);
    const S = sj * nx + si, E = ej * nx + ei;
    const offen = (k) => { if (k === S || k === E) return true; if (zu[k] < 0) zu[k] = frei(x0 + (k % nx) * R, y0 + Math.floor(k / nx) * R, h, ohneBoden) ? 1 : 0; return zu[k] === 1; };
    const heur = (k) => Math.hypot((k % nx) - ei, Math.floor(k / nx) - ej);
    const heap = [];
    const rein = (k, f) => { heap.push([f, k]); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
    const raus = () => { const top = heap[0], l = heap.pop(); if (heap.length) { heap[0] = l; let i = 0; for (;;) { const a = 2 * i + 1, b = a + 1; let k = i; if (a < heap.length && heap[a][0] < heap[k][0]) k = a; if (b < heap.length && heap[b][0] < heap[k][0]) k = b; if (k === i) break; [heap[k], heap[i]] = [heap[i], heap[k]]; i = k; } } return top; };
    g[S] = 0; rein(heur(S), S);
    let gefunden = false, schritte = 0;
    while (heap.length && schritte++ < 6000) {
      const [, k] = raus();
      if (zu2[k]) continue; zu2[k] = 1;
      if (k === E) { gefunden = true; break; }
      const i = k % nx, j = Math.floor(k / nx);
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue;
        const a = i + di, b = j + dj;
        if (a < 0 || b < 0 || a >= nx || b >= ny) continue;
        const n = b * nx + a;
        if (zu2[n] || !offen(n)) continue;
        if (di && dj && (!offen(j * nx + a) || !offen(b * nx + i))) continue;   // keine Ecken schneiden
        const gn = g[k] + (di && dj ? 1.4142 : 1);
        if (gn < g[n]) { g[n] = gn; vor[n] = k; rein(gn + heur(n), n); }
      }
    }
    if (!gefunden) return null;
    const pfad = [];
    for (let k = E; k >= 0 && k !== S; k = vor[k]) pfad.push([x0 + (k % nx) * R, y0 + Math.floor(k / nx) * R]);
    pfad.reverse();
    if (pfad.length) pfad[pfad.length - 1] = nach.slice();
    /* glätten: Punkte überspringen, solange die Sichtlinie frei ist */
    const sicht = (p, q) => { const l = Math.hypot(q[0] - p[0], q[1] - p[1]), n = Math.ceil(l / 0.25); for (let i = 1; i < n; i++) { const f = i / n; if (!frei(p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f, h, ohneBoden)) return false; } return true; };
    const aus = []; let p = von;
    for (let i = 0; i < pfad.length; i++) {
      if (i === pfad.length - 1 || !sicht(p, pfad[i + 1])) { aus.push(pfad[i]); p = pfad[i]; }
    }
    return aus;
  }
  /* Nicht zu weit weg: jenseits des Umkreises zieht es jeden zurück zu seinem Ausgangsort */
  function heimwaerts(o, m, r) {
    if (!m.heim) return m.h;
    const dx = m.heim[0] - o.x, dy = m.heim[1] - o.y;
    if (Math.hypot(dx, dy) < r) return m.h;
    return Math.atan2(dy, dx);
  }

  /* Wer ist unterwegs? Nachts weniger Leute, Kinder daheim */
  const NACHT_ANTEIL = { spaziergaenger: 0.35, marktbesucher: 0.5, kind_schlitten: 0, schlittschuh: 0.25 };
  function anwesend(o) {
    const S = SZ();
    if (o.typ === "schlitten_ladung") return !!o._kind && anwesend(o._kind);
    if (o.typ === "schlittschuh" && (S.jahr !== "winter" || (o._m && o._m.keinEis))) return false;
    /* in der Werkbank immer zeigen (dort prüft man ja gerade diese Figur) */
    if (S.zeit === "nacht" && !o.immer && !WERKBANK && o !== S.geist) {
      const schl = o._m && o._m.gruppe ? o._m.gruppe.id * 7 + 1 : o.saat | 0;     // Gruppen gehen gemeinsam heim
      return ST.hash2(schl, 9, 3) < (NACHT_ANTEIL[o.typ] || 0.4);
    }
    return true;
  }

  /* Steht jemand nicht frei (Start im Hausgrundriss, auf ihm wurde gebaut),
     rückt er zur nächsten freien Stelle */
  function befreien(o, ohneBoden) {
    const h = hind || hindernisse(0);
    if (frei(o.x, o.y, h, ohneBoden)) return false;
    for (let r = 0.5; r < 16; r += 0.5) for (let k = 0; k < 16; k++) {
      const w = (k + (r * 2) % 1 * 0.5) / 16 * TAU, x = o.x + Math.cos(w) * r, y = o.y + Math.sin(w) * r;
      if (frei(x, y, h, ohneBoden)) { o.x = x; o.y = y; return true; }
    }
    return false;
  }
  /* etwa einmal je Sekunde: steht er noch frei? */
  function pruefen(o, m, dt, ohneBoden) {
    m.pruef = (m.pruef || 0) - dt;
    if (m.pruef > 0) return false;
    m.pruef = 0.8 + m.r() * 0.4;
    if (befreien(o, ohneBoden)) { m.weg = null; if (m.heim) m.heim = [o.x, o.y]; return true; }
    return false;
  }
  ST.menschenFrei = function (x, y, ohneBoden) { return frei(x, y, hindernisse(0), ohneBoden); };
  function zustand(o) {
    if (o._m) return o._m;
    const r = ST.zufall((o.saat | 0) + 99);
    o._m = { r: r, ph: r(), g: 1, h: richtungAus(o.gier || 0), stopp: 0, pause: 3 + r() * 10, wandern: 2 + r() * 5, t: 0, blick: 0, kopf: 0, trink: r() * 8 };
    return o._m;
  }

  /* ---------------- Zeichnen (gemeinsam) ---------------- */
  /* Menschen auf der Brücke: um die Deckhöhe angehoben; falls die Brücke
     erst nach ihnen gemalt würde (Reihenfolge nach Grundrissmitte), hängen
     sie sich als Kopie direkt hinter die Brücke in die Malreihe */
  function nachBrueckeMalen(o, P, br) {
    if (P.nachBruecke) return false;
    const reihe = SZ().sichtbare;
    let i = -1, j = -1;
    for (let k = 0; k < reihe.length; k++) { if (reihe[k].o === o) i = k; else if (reihe[k].o === br) j = k; }
    if (i < 0 || j < i) return false;
    const e = reihe[i];
    reihe.splice(j + 1, 0, Object.assign({}, e, { P: Object.assign({}, e.P, { nachBruecke: true }) }));
    return true;
  }
  /* Die dem Betrachter zugewandte Brüstung verdeckt Beine und Schatten:
     alles unterhalb ihrer Oberkante (im Bild) wird ausgespart */
  function brueckeClip(g, e) {
    const K = ST.kamera;
    for (const sd of [1, -1]) {
      const d = ST.drehXY(e.c * sd, e.s * sd, K.dreh);
      if (d[0] + d[1] <= 0) continue;
      const W = (u, v) => [e.x + u * e.c - v * e.s, e.y + u * e.s + v * e.c];
      g.beginPath();
      g.rect(0, 0, K.W, K.H);
      const oben = [], unten = [];
      for (let v = -BR.L; v <= BR.L + 1e-6; v += 0.4) {
        const zt = (Math.abs(v) <= BR.W ? deckZ(v) + BR.bruestung : deckZ(v) + 0.3);
        const p = W(sd * BR.xi, v), q = W(sd * BR.xa, v);
        oben.push(ST.proj(p[0], p[1], zt)); unten.push(ST.proj(q[0], q[1], -0.3));
      }
      g.moveTo(oben[0][0], oben[0][1]);
      for (const p of oben) g.lineTo(p[0], p[1]);
      for (let k = unten.length - 1; k >= 0; k--) g.lineTo(unten[k][0], unten[k][1]);
      g.closePath();
      g.clip("evenodd");
    }
  }
  /* Schatten auf dem Brückendeck (die Schattenebene der Szene liegt unter
     der Brücke und wäre verdeckt): eigene kleine Lage, gleiche Farbe */
  let deckLw = null;
  function deckSchatten(g, B, P, zd, r) {
    const K = ST.kamera, s = P.s, O = P.proj(0, 0, zd);
    const R = Math.ceil(3 * s), x0 = Math.floor(O[0] - R), y0 = Math.floor(O[1] - R);
    if (!deckLw) deckLw = document.createElement("canvas");
    if (deckLw.width !== 2 * R || deckLw.height !== 2 * R) { deckLw.width = 2 * R; deckLw.height = 2 * R; }
    const sg = deckLw.getContext("2d");
    sg.setTransform(1, 0, 0, 1, 0, 0); sg.clearRect(0, 0, 2 * R, 2 * R);
    sg.save(); sg.translate(-x0, -y0);
    sg.translate(O[0], O[1]); sg.scale(1, 0.5);
    const gr = sg.createRadialGradient(0, 0, 0, 0, 0, r * s);
    gr.addColorStop(0, "rgba(0,0,0,0.55)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    sg.fillStyle = gr; sg.fillRect(-r * s, -r * s, 2 * r * s, 2 * r * s);
    sg.restore();
    sg.save(); sg.translate(-x0, -y0); B.schattenMalen(sg); sg.restore();
    sg.globalCompositeOperation = "source-in";
    sg.fillStyle = P.jahr === "winter" ? "rgb(40,62,120)" : "rgb(22,34,52)";
    sg.fillRect(0, 0, 2 * R, 2 * R);
    sg.globalCompositeOperation = "source-over";
    g.save();
    g.globalAlpha = P.Z.schatten * (P.jahr === "winter" ? 1.15 : 1);
    g.drawImage(deckLw, x0, y0);
    g.restore();
    void K;
  }
  function buehneFuer(o, P, bauen, zd) {
    const O = P.proj(0, 0, zd || 0);
    if (o._b && o._b.jetzt === ST.jetzt && o._b.s === P.s && o._b.x === O[0] && o._b.y === O[1]) return o._b.B;
    const Z = P.Z;
    const B = new GS.Buehne({ s: P.s, X0: O[0], Y0: O[1], Z: Z, jahr: P.jahr, lampen: P.vorschau ? null : GS.lampenBei(O[0], O[1], P.s, Z.nacht, o.x, o.y) });
    B.rahmen(GS.modellRahmen(P.c, P.sn));
    B.gruppe(0);
    bauen(B);
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
      /* ueberall: Menschen gehen weg – sie dürfen nie verhindern, dass man an
         ihrer Stelle ein Haus baut (SZ.passt übergeht sie; sie treten dann
         selbst zur Seite, siehe pruefen) */
      live: true, ueberall: true, gruppe: "Deko", grund: [0.6, 0.6], hoehe: 1.9,
      zeichnen: function (g, P) {
        const o = P.objekt;
        if (!anwesend(o)) return;
        const st = hind && !P.vorschau ? stegAn(o.x, o.y, hind) : null;
        if (st && nachBrueckeMalen(o, P, st.e.o)) return;
        const B = buehneFuer(o, P, (B) => bauenFn(B, o, P), st ? st.z : 0);
        if (st) {
          g.save(); brueckeClip(g, st.e);
          deckSchatten(g, B, P, st.z, def.kontakt || 0.42);
          B.malen(g);
          g.restore();
        } else B.malen(g);
      },
      schatten: function (sg, P) {
        const o = P.objekt;
        if (!anwesend(o)) return;
        if (hind && stegAn(o.x, o.y, hind)) return;       // auf der Brücke: Schatten auf dem Deck (zeichnen)
        const B = buehneFuer(o, P, (B) => bauenFn(B, o, P), 0);
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
            const Bv = new GS.Buehne({ s: s, X0: 0, Y0: 0, Z: F.Z || ST.ZEITEN.tag, jahr: F.jahr || "winter" });
            Bv.rahmen(GS.modellRahmen(Math.cos(gier), Math.sin(gier)));
            Bv.gruppe(0);
            const ob = { saat: o.saat || 7, typ: id, gier: 0 };
            bauenFn(Bv, ob, { t: 0, s: s, jahr: F.jahr || "winter", Z: F.Z || ST.ZEITEN.tag, vorschau: true });
            Bv.malen(g);
          }
        });
      }
    }, def));
  }

  /* =====================================================================
     SPAZIERGÄNGER
     ===================================================================== */
  /* Freier Stehplatz vor einer Bude: 1,3–2,4 m vor der Theke, seitlich
     versetzt, mindestens 0,8 m von allen anderen Menschen entfernt */
  function stehplatzSuchen(o, b, h, t, r) {
    for (let k = 0; k < 14; k++) {
      const d = 1.3 + r() * 1.1, l = (r() - 0.5) * 3.2;
      const x = b.theke[0] + b.vx * d + b.qx * l, y = b.theke[1] + b.vy * d + b.qy * l;
      if (!frei(x, y, h, false)) continue;
      let ok = true;
      for (const p of lebende(t)) if (p !== o && Math.hypot(p.x - x, p.y - y) < 0.8) { ok = false; break; }
      if (ok) return [x, y];
    }
    return null;
  }
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
      if (!m.heim) { befreien(o, false); m.heim = [o.x, o.y]; }
      const h = hindernisse(t);
      pruefen(o, m, dt, false);
      if (m.ziel) {
        /* auf dem Weg zu einem Stehplatz an einer Bude */
        m.g = Math.min(1, m.g + dt * 1.6);
        const da = wegFolgen(o, m, dt, h, a.tempo * m.g, t, false);
        m.ph = (m.ph + f * dt * m.g) % 1;
        o.gier = gierAus(m.h);
        if (da || (m.zielZeit -= dt) < 0) { m.ziel = null; m.weg = null; if (da) { m.stopp = 6 + m.r() * 10; } else m.pause = 5; }
        return;
      }
      if (m.stopp > 0) {
        /* steht an einer Bude: schaut, dreht den Kopf, hält Abstand */
        m.stopp -= dt;
        m.g = Math.max(0, m.g - dt * 2.2);
        const d = winkelDiff(m.blick, m.h); m.h += klemm(d, -dt * 2, dt * 2);
        m.kopf = 0.35 * Math.sin(m.t * 0.5 + (o.saat % 5));
        if (m.g > 0.02) m.ph = (m.ph + f * dt * m.g) % 1; else m.ph = m.ph < 0.25 || m.ph > 0.75 ? m.ph * 0.9 : m.ph + (0.5 - m.ph) * 0.1;
        abstandHalten(o, t, dt, h, 0.65, false);
        o.gier = gierAus(m.h);
        if (m.stopp <= 0) { m.pause = 18 + m.r() * 25; m.h += Math.PI * (0.6 + m.r() * 0.8); }
        return;
      }
      m.kopf *= 0.95;
      m.g = Math.min(1, m.g + dt * 1.6);
      m.pause -= dt; m.wandern -= dt;
      /* an einer Bude stehen bleiben? – gezielt zu einem freien Stehplatz */
      if (m.pause <= 0) {
        m.pause = 6 + m.r() * 8;
        for (const b of h.buden) {
          if (Math.hypot(b.theke[0] - o.x, b.theke[1] - o.y) > 7 || m.r() > 0.6) continue;
          const pl = stehplatzSuchen(o, b, h, t, m.r);
          if (!pl) break;
          const w = wegSuchen([o.x, o.y], pl, h, false);
          if (w) { m.ziel = pl; m.weg = w; m.wegI = 0; m.zielZeit = 25; m.blick = b.blick; }
          break;
        }
      }
      if (m.wandern <= 0) { m.h = heimwaerts(o, m, 40) + (m.r() - 0.5) * 1.1; m.wandern = 3 + m.r() * 6; }
      lenken(o, m, dt, h, false, a.tempo * m.g, true, t);
      m.ph = (m.ph + f * dt * m.g) % 1;
      o.gier = gierAus(m.h);
    }
  });

  /* =====================================================================
     MARKTBESUCHER: Gruppen kommen, stehen an, kaufen, trinken, gehen
     ===================================================================== */
  function dampf(g, B, t, pos, saat, stark, tag) {
    const Pp = B.bild(pos), s = B.s;
    /* am Tag etwas grauer und dichter – sonst verschwindet er vor dem Schnee */
    const farbe = tag ? "196,202,214" : "242,242,248", dicht = tag ? 0.75 : 0.5;
    for (let i = 0; i < 10; i++) {
      const ph = (t * 0.3 + i / 10 + saat * 0.13) % 1;
      const hoch = ph * 0.42 * s, wind = (ph * ph * 0.14 + Math.sin(t * 1.3 + i * 2.1) * 0.025 * ph) * s;
      const r = (0.025 + ph * 0.09) * s;
      const al = (1 - ph) * Math.min(1, ph / 0.12) * dicht * stark;
      if (r < 0.4 || al < 0.01) continue;
      const x = Pp[0] + wind, y = Pp[1] - hoch;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, "rgba(" + farbe + "," + al.toFixed(3) + ")"); gr.addColorStop(1, "rgba(" + farbe + ",0)");
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    }
  }
  /* Gruppen: eine Handvoll Leute mit gemeinsamem Ziel und Zustand */
  let GRUPPEN = [], gruppeNr = 1;
  const FORMATION = [[0, 0], [-0.1, 0.6], [-0.85, 0.3], [-0.85, -0.3]];      // [vorn, rechts] relativ zum Ersten
  function randPunkt(b, h, r, weit) {
    /* ein freier Pflasterpunkt 7–13 m von der Theke, von dem aus man hinkommt */
    for (let k = 0; k < 30; k++) {
      const w = r() * TAU, d = (weit || 7) + r() * 6;
      const x = b.theke[0] + Math.cos(w) * d, y = b.theke[1] + Math.sin(w) * d;
      if (frei(x, y, h, false)) return [x, y];
    }
    return [b.theke[0] + b.vx * 3, b.theke[1] + b.vy * 3];
  }
  function gruppenPlatz(G, h, t) {
    /* Stehplatz der Gruppe: vor der Bude, seitlich der Theke, frei, nicht zu
       nah an anderen Gruppen */
    const b = G.b, r = G.r, rad = 0.42 + 0.1 * G.leute.length;
    for (let k = 0; k < 40; k++) {
      const d = 0.9 + r() * 1.8, l = (r() < 0.5 ? -1 : 1) * (1.0 + r() * 1.6);
      const x = b.theke[0] + b.vx * d + b.qx * l, y = b.theke[1] + b.vy * d + b.qy * l;
      let ok = frei(x, y, h, false);
      for (let j = 0; j < 6 && ok; j++) { const w = j / 6 * TAU; ok = frei(x + Math.cos(w) * rad, y + Math.sin(w) * rad, h, false); }
      for (const H of GRUPPEN) if (ok && H !== G && H.mitte && Math.hypot(H.mitte[0] - x, H.mitte[1] - y) < 1.9 + (H.rad || 0.6)) ok = false;
      if (ok) return { mitte: [x, y], rad: rad };
    }
    return { mitte: [b.theke[0] + b.vx * 1.6, b.theke[1] + b.vy * 1.6], rad: rad };
  }
  /* Plätze der Mitglieder: im Kreis um die Mitte, einander zugewandt; ein
     Kind steht neben seinem Erwachsenen */
  function plaetzeVerteilen(G) {
    const n = G.leute.length, w0 = G.r() * TAU;
    G.leute.forEach(function (o, i) {
      const w = w0 + i / n * TAU;
      o._m.platz = [G.mitte[0] + Math.cos(w) * G.rad, G.mitte[1] + Math.sin(w) * G.rad];
      o._m.platzBlick = Math.atan2(G.mitte[1] - o._m.platz[1], G.mitte[0] - o._m.platz[0]);
    });
  }
  function gruppeNeu(b, leute, zust, h, t) {
    const G = { id: gruppeNr++, b: b, leute: leute, zustand: zust, zt: 0, r: ST.zufall(gruppeNr * 7919 + 13), mitte: null, rad: 0.6 };
    G.dauer = 60 + G.r() * 120;                   // 1–3 Minuten trinken und plaudern
    for (const o of leute) { zustand(o); o._m.gruppe = G; o._m.weg = null; }
    GRUPPEN.push(G);
    return G;
  }
  function gruppeLoesen(G) { const i = GRUPPEN.indexOf(G); if (i >= 0) GRUPPEN.splice(i, 1); }
  /* neue Leute: neue Saat → neues Aussehen */
  function neuEinkleiden(o, G, i) {
    o.saat = (o.saat * 1103515245 + 12345 + G.id * 17) & 0x7fffffff;
    o._aus = null; o._b = null;
    const r = o._m.r; o._m = { r: r, ph: r(), g: 0, h: 0, t: 0, kopf: 0, trink: r() * 8, gruppe: G, idx: i };
  }
  /* Gruppe steuern (vom Ersten der Gruppe aus, einmal je Bild) */
  function gruppeSteuern(G, dt, t, h) {
    const S = SZ();
    /* Bude noch da und noch an ihrem Platz? */
    if (G.b && S.objekte.indexOf(G.b.o) < 0) G.b = null;
    else if (G.b && G.b.schl !== (G.b.o.x.toFixed(2) + "," + G.b.o.y.toFixed(2) + "," + G.b.o.gier)) {
      G.b = budeDaten(G.b.o, ST.MODELLE.marktbude);
      if (G.zustand === "trinken" || G.zustand === "hin") { const pl = gruppenPlatz(G, h, t); G.mitte = pl.mitte; G.rad = pl.rad; plaetzeVerteilen(G); for (const o of G.leute) o._m.weg = null; G.zustand = "hin"; }
    }
    const erster = G.leute[0];
    if (!G.b && G.zustand !== "gehen") {
      /* die Bude ist weg: die Gruppe schlendert davon */
      G.zustand = "gehen"; G.zt = 0; G.ohneBude = true; G.mitte = null;
      for (const o of G.leute) o._m.weg = null;
      G.ziel = [erster.x, erster.y];
      for (let k = 0; k < 16; k++) { const w = G.r() * TAU, x = erster.x + Math.cos(w) * 8, y = erster.y + Math.sin(w) * 8; if (frei(x, y, h, false)) { G.ziel = [x, y]; break; } }
    }
    G.zt += dt;
    if (G.zustand === "kommen" && erster._m.da) { G.zustand = "anstehen"; G.zt = 0; }
    else if (G.zustand === "anstehen") {
      /* ist die Theke frei? dann vortreten und kaufen */
      let besetzt = false;
      for (const H of GRUPPEN) if (H !== G && H.b && G.b && H.b.o === G.b.o && H.zustand === "kaufen") besetzt = true;
      if (!besetzt && G.zt > 0.6) { G.zustand = "kaufen"; G.zt = 0; G.kaufDauer = 3 + G.r() * 3; erster._m.weg = null; }
    } else if (G.zustand === "kaufen" && G.zt > G.kaufDauer && erster._m.da) {
      for (const o of G.leute) o._m.tasse = !o._aus || !o._aus.kind || (o.saat % 2 === 0);
      const pl = gruppenPlatz(G, h, t); G.mitte = pl.mitte; G.rad = pl.rad; plaetzeVerteilen(G);
      G.zustand = "hin"; G.zt = 0; for (const o of G.leute) o._m.weg = null;
    } else if (G.zustand === "hin" && G.leute.every((o) => o._m.da || !anwesend(o))) { G.zustand = "trinken"; G.zt = 0; }
    else if (G.zustand === "trinken" && G.zt > G.dauer) {
      G.zustand = "gehen"; G.zt = 0; G.ziel = randPunkt(G.b, h, G.r, 9); for (const o of G.leute) o._m.weg = null;
      G.mitte = null;
    } else if (G.zustand === "gehen" && (erster._m.da || G.zt > 22)) {
      /* weitergeschlendert: diese Leute sind fort, eine neue Gruppe kommt */
      const buden = hindernisse(t).buden;
      if (!buden.length) {
        /* ohne Bude keine Glühweintrinker: die Erwachsenen werden Spaziergänger */
        gruppeLoesen(G);
        for (const o of G.leute) {
          if (o._aus && o._aus.kind) { SZ().weg(o); continue; }
          o.typ = "spaziergaenger"; o._m = null; o._aus = null; o._b = null;
        }
        return;
      }
      G.b = buden[(G.r() * buden.length) | 0];
      G.leute.forEach((o, i) => neuEinkleiden(o, G, i));
      const start = randPunkt(G.b, h, G.r, 8);
      G.leute.forEach((o, i) => { o.x = start[0] + FORMATION[i][1] * 0.3; o.y = start[1] + FORMATION[i][0] * 0.3; befreien(o, false); });
      G.zustand = "kommen"; G.zt = 0; G.ohneBude = false; G.dauer = 60 + G.r() * 120;
    }
  }
  /* Ziel eines Mitglieds im aktuellen Zustand */
  function mitgliedZiel(o, G, i) {
    const b = G.b, erster = G.leute[0], m = o._m;
    if (G.zustand === "trinken" || G.zustand === "hin") return m.platz;
    if (i === 0) {
      if (G.zustand === "kommen" || G.zustand === "anstehen") {
        /* anstehen: hinter der Theke in der Schlange, je Gruppe davor 0,9 m weiter hinten */
        let vor = 0;
        for (const H of GRUPPEN) if (H !== G && H.b && H.b.o === b.o && (H.zustand === "kaufen" || (H.zustand === "anstehen" && H.id < G.id))) vor++;
        return [b.theke[0] + b.vx * 0.9 * vor, b.theke[1] + b.vy * 0.9 * vor];
      }
      if (G.zustand === "kaufen") return b.theke;
      if (G.zustand === "gehen") return G.ziel || [o.x, o.y];
    }
    /* die anderen folgen dem Ersten in Formation (nebeneinander, dahinter) */
    const hh = erster._m.h, F = FORMATION[Math.min(i, 3)];
    const vx = Math.cos(hh), vy = Math.sin(hh), rx = vy, ry = -vx;     // rechts vom Gehenden
    let x = erster.x + vx * F[0] + rx * F[1], y = erster.y + vy * F[0] + ry * F[1];
    if (G.zustand === "kaufen" || G.zustand === "anstehen") { x -= vx * 0.9; y -= vy * 0.9; }
    return [x, y];
  }
  lebendModell("marktbesucher", {
    name: "Marktbesucher", kontakt: 0.4,
    buehne: function (B, o, P) {
      const kind = !!o.kind;
      const a = ausstattung(o, kind ? "kind" : "erwachsen", P.jahr);
      const m = o._m || { trink: 3, kopf: 0, t: 0, g: 0, ph: 0.25, tasse: true };
      const G = m.gruppe, t = P.t;
      const g = m.g || 0;
      const pose = gehPose(a, m.ph || 0, g, t, { armFrei: true });
      const Hm = masse(a);
      if (g < 0.2) {
        /* Gewicht auf ein Bein, leichtes Wiegen */
        const wieg = Math.sin(t * 0.45 + (o.saat % 11));
        pose.x = 0.012 * a.H * wieg; pose.seit = -0.015 * wieg;
        pose.bein[0].b = 0.05; pose.bein[1].b = 0.05;
        const sb = pose.bein[wieg > 0 ? 0 : 1]; sb.k = 0.12; sb.a = 0.06; sb.f = -0.06;
      }
      const hatTasse = m.tasse !== false && !(G && (G.zustand === "kommen" || G.zustand === "anstehen" || (G.zustand === "kaufen" && G.zt < G.kaufDauer)));
      const kauft = G && G.zustand === "kaufen" && G.leute[0] === o && m.da;
      /* Hand in Hand: ein Kind geht neben seinem Erwachsenen (Platz 2 der Formation) */
      const idx = G ? G.leute.indexOf(o) : -1;
      const hand = G && !WERKBANK && g > 0.3 && (G.zustand === "kommen" || G.zustand === "gehen") && G.kindIdx === 1 && (idx === 0 || idx === 1);
      /* Trinken: Tasse heben, kurz verweilen, senken – dazwischen mit beiden Händen halten */
      const zyk = 9 + (o.saat % 5), phT = ((t + (m.trink || 0)) % zyk) / zyk;
      const hebe = hatTasse && g < 0.3 && !kauft ? glatt(0.0, 0.1, phT) * (1 - glatt(0.24, 0.34, phT)) : 0;
      pose.kopfNick = 0.08 - 0.28 * hebe; pose.kopfDreh = (m.kopf || 0) * (1 - hebe);
      /* erst das Skelett ohne Armziele: daraus Mund und Kopfachsen */
      const sk0 = skelett(a, pose);
      const X = sk0.X, Y = sk0.Y, U = sk0.U;
      const ruhe = plus(sk0.P0, plus(mal(Y, 0.16 * a.H), plus(mal(X, 0.035 * a.H), mal(U, 0.1 * a.H))));
      /* Becher: an der Mundachse ausgerichtet; der Rand 4–5 cm vor den Lippen */
      const kipp = einheit(minus(mal(U, Math.cos(0.95 * hebe)), mal(Y, Math.sin(0.95 * hebe))));
      const becherRand = mix(plus(ruhe, [0, 0, 0.05]), sk0.mund, hebe);
      const becher = minus(becherRand, mal(kipp, 0.05));
      if (hatTasse) {
        pose.arm[1].ziel = plus(becher, mal(X, 0.038)); pose.arm[1].pol = plus(mal(X, 0.25), plus(mal(Y, 0.5), mal(U, -1)));
        /* die freie Hand hält den warmen Becher mit, beim Trinken lässt sie los */
        const links = plus(sk0.P0, plus(mal(Y, 0.1 * a.H), plus(mal(X, -0.05 * a.H), mal(U, 0.02 * a.H))));
        pose.arm[0].ziel = mix(plus(becher, mal(X, -0.04)), links, glatt(0, 0.4, hebe)); pose.arm[0].pol = plus(mal(X, -0.3), plus(mal(Y, 0.4), mal(U, -1)));
        if (g > 0.2) pose.arm[0].ziel = null;      // im Gehen schwingt der freie Arm
      }
      if (kauft) {
        /* an der Theke: die Hand reicht das Geld hinüber */
        const vor = 0.5 + 0.08 * Math.sin(t * 2.2);
        pose.arm[1].ziel = plus(sk0.P0, plus(mal(Y, vor), plus(mal(X, 0.06), mal(U, 0.5 * a.H - Hm.huefte + 0.45))));
        pose.arm[1].pol = plus(mal(X, 0.3), mal(U, -1));
      }
      if (hand) {
        /* Treffpunkt der Hände: rechts neben dem Erwachsenen, gut 0,85 m hoch */
        if (idx === 0) { pose.arm[1].ziel = [0.3, 0.06, 0.86]; pose.arm[1].pol = [0.6, -0.2, -1]; }
        else { pose.arm[0].ziel = [-0.25, 0.06, 0.86]; pose.arm[0].pol = [-0.6, -0.2, -0.6]; }
      }
      if (hebe > 0 && m.redet) pose.arm[0].ziel = null;
      /* im Gespräch: wer redet, bewegt die freie Hand */
      if (m.redet && !hand && hebe < 0.05 && g < 0.2) {
        const w = Math.sin(t * 3.1 + o.saat) * 0.5 + 0.5;
        pose.arm[0].ziel = plus(sk0.P0, plus(mal(Y, 0.2 * a.H + 0.04 * w), plus(mal(X, -0.08 * a.H), mal(U, 0.12 * a.H + 0.05 * w))));
        pose.arm[0].pol = plus(mal(X, -0.5), mal(U, -1));
      }
      const sk = skelett(a, pose);
      mensch(B, a, sk, { daumen: [U, U] });
      if (!hatTasse) return;
      /* Becher: Körper, Glühwein darin, Henkel zur Hand hin, Dampf */
      const top = plus(becher, mal(kipp, 0.05)), boden = minus(becher, mal(kipp, 0.045));
      B.glied(boden, 0.034, top, 0.038, a.tasse, { tiefe: 0.02, glanz: 0.5 });
      if (B.s > 30) {
        B.ei(plus(top, mal(kipp, -0.004)), mal(X, 0.032), mal(einheit(kreuz(kipp, X)), 0.032), mal(kipp, 0.005), P.jahr === "winter" ? [96, 20, 30] : [70, 44, 30], { tiefe: 0.021 });
        B.band([plus(becher, plus(mal(X, 0.034), mal(kipp, 0.025))), plus(becher, plus(mal(X, 0.058), mal(kipp, 0.0))), plus(becher, plus(mal(X, 0.034), mal(kipp, -0.025)))], 0.009, a.tasse, { tiefe: 0.019 });
      }
      if (P.jahr === "winter" && B.s > 12) {
        const tag = P.Z.nacht < 0.3;
        B.eigen(plus(top, [0, 0, 0.02]), function (gg, Bh, tt) { dampf(gg, Bh, t, tt.m, o.saat % 7, 1 - hebe * 0.5, tag); }, { tiefe: 0.3 });
      }
    },
    bewegen: function (o, dt, t) {
      const m = zustand(o);
      m.t += dt;
      const kind = !!o.kind, a = o._aus || ausstattung(o, kind ? "kind" : "erwachsen", SZ().jahr);
      if (WERKBANK) { m.g = 0; m.ph = 0.25; m.kopf = 0.5 * Math.sin(m.t * 0.23 + (o.saat % 13)) * Math.max(0, Math.sin(m.t * 0.11 + (o.saat % 3))); return; }
      const h = hindernisse(t);
      let G = m.gruppe;
      if (!G || GRUPPEN.indexOf(G) < 0) {
        /* einzeln hingestellt (Bauleiste) oder nach dem Laden: eigene kleine Gruppe an der nächsten Bude */
        let best = null, bd = 1e9;
        for (const b of h.buden) { const d = Math.hypot(b.theke[0] - o.x, b.theke[1] - o.y); if (d < bd) { bd = d; best = b; } }
        if (!best) { if (kind) SZ().weg(o); else { o.typ = "spaziergaenger"; o._m = null; o._aus = null; } return; }
        G = gruppeNeu(best, [o], "kommen", h, t); m.idx = 0;
      }
      if (G.leute[0] === o) gruppeSteuern(G, dt, t, h);
      if (!m.gruppe || o.typ !== "marktbesucher") return;
      pruefen(o, m, dt, false);
      if (!anwesend(o)) { m.da = true; return; }
      const i = G.leute.indexOf(o);
      const ziel = mitgliedZiel(o, G, i);
      const f = a.tempo / (2 * 0.41 * a.H);
      const dx = ziel[0] - o.x, dy = ziel[1] - o.y, d = Math.hypot(dx, dy);
      const fuehrt = i === 0 || G.zustand === "hin" || G.zustand === "trinken";
      if (d > (fuehrt ? 0.15 : 0.35)) {
        /* gehen: der Erste und alle auf dem Weg zum Stehplatz suchen sich einen Weg; die anderen folgen */
        m.da = false;
        let v = a.tempo * (fuehrt ? 1 : klemm(0.8 + d * 0.5, 0.8, 1.45));
        if (i === 0 && G.leute.length > 1 && G.zustand !== "hin") { let hinten = 0; for (const p of G.leute) hinten = Math.max(hinten, Math.hypot(p.x - o.x, p.y - o.y)); if (hinten > 2.2) v *= 0.6; }
        m.g = Math.min(1, m.g + dt * 1.6);
        if (fuehrt && d > 1.2) {
          if (!m.weg || m.wegZiel && Math.hypot(m.wegZiel[0] - ziel[0], m.wegZiel[1] - ziel[1]) > 0.6) { m.weg = wegSuchen([o.x, o.y], ziel, h, false) || [ziel]; m.wegI = 0; m.wegZiel = ziel.slice(); }
          wegFolgen(o, m, dt, h, v * m.g, t, false);
        } else {
          m.weg = null;
          const soll = Math.atan2(dy, dx);
          m.h += klemm(winkelDiff(soll, m.h), -dt * 5, dt * 5);
          const st = Math.min(v * m.g * dt, d), nx = o.x + dx / d * st, ny = o.y + dy / d * st;
          if (frei(nx, ny, h, false) || !frei(o.x, o.y, h, false)) { o.x = nx; o.y = ny; }
          else lenken(o, m, dt, h, false, v * m.g, false, t);
        }
        m.ph = (m.ph + f * dt * m.g) % 1;
      } else {
        m.da = true; m.weg = null;
        m.g = Math.max(0, m.g - dt * 2.4);
        if (m.g > 0.02) m.ph = (m.ph + f * dt * m.g) % 1; else m.ph = m.ph < 0.25 || m.ph > 0.75 ? m.ph * 0.9 : m.ph + (0.5 - m.ph) * 0.1;
        /* Blick: an der Theke zur Bude, in der Runde zur Mitte (einander zugewandt) */
        let blick = m.h;
        if (G.zustand === "trinken" || G.zustand === "hin") blick = m.platzBlick != null ? m.platzBlick : m.h;
        else if (G.b && (G.zustand === "kaufen" || G.zustand === "anstehen")) blick = G.b.blick;
        m.h += klemm(winkelDiff(blick, m.h), -dt * 2, dt * 2);
        if (G.zustand === "trinken") abstandHalten(o, t, dt, h, 0.6, false);
      }
      /* Plaudern: der Kopf wendet sich einem anderen aus der Gruppe zu; ab und zu redet einer */
      m.kt = (m.kt || 0) - dt;
      if (m.kt <= 0) {
        m.kt = 2 + m.r() * 4;
        const andere = G.leute.filter((p) => p !== o);
        const p = andere.length ? andere[(m.r() * andere.length) | 0] : null;
        m.kopfZiel = p ? klemm(winkelDiff(Math.atan2(p.y - o.y, p.x - o.x), m.h), -0.8, 0.8) : (m.r() - 0.5);
        m.redet = G.zustand === "trinken" && m.r() < 0.35;
      }
      m.kopf += ((m.kopfZiel || 0) - (m.kopf || 0)) * Math.min(1, dt * 3);
      o.gier = gierAus(m.h);
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
  function schlittenBauen(B, P, S, winter, ladung) {
    /* S = { x, y, w } Mitte (Modellraum) und Richtung (nach vorn, zum Kind) */
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
      B.platte([L(u0, v1, kz + kh), L(u1, v1, kz + kh), L(u1, v1, kz), L(u0, v1, kz)], HOLZ, { n: [-s, c, 0], innen: HOLZ_D });
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
  function schlittenZiel(S, winter) {
    const c = Math.cos(S.w), s = Math.sin(S.w), u = winter ? 0.44 : 0.8;
    return [S.x + u * c, S.y + u * s, winter ? 0.24 : 0.34];
  }
  /* Weltlage → Modellraum des Kindes */
  function inKind(o, wx, wy) {
    const gr = -(o.gier || 0) * Math.PI / 180, c = Math.cos(gr), sn = Math.sin(gr);
    const dx = wx - o.x, dy = wy - o.y;
    return [dx * c - dy * sn, dx * sn + dy * c];
  }
  lebendModell("kind_schlitten", {
    name: "Kind mit Schlitten", kontakt: 0.34, hoehe: 1.3, grund: [0.6, 0.6], vorschauBreite: 2.4,
    buehne: function (B, o, P) {
      const a = ausstattung(o, "kind", P.jahr);
      const m = o._m || { ph: 0, g: 0.9 };
      const winter = P.jahr === "winter";
      const pose = gehPose(a, m.ph, m.g, P.t, { armFrei: true });
      pose.neig = 0.12 + 0.06 * m.g;
      const ladung = (o.saat | 0) % 3;
      /* Lage des Schlittens im Modellraum des Kindes: in der Stadt ein eigenes
         Ding (schlitten_ladung), in Werkbank und Vorschau hier mitgemalt */
      const sch = o._schl && !P.vorschau && !WERKBANK ? o._schl : null;
      let S = { x: 0.35, y: -1.6, w: Math.PI / 2 };
      if (sch) {
        const w = richtungAus(sch.gier), p = inKind(o, sch.x, sch.y), vr = inKind(o, sch.x + Math.cos(w), sch.y + Math.sin(w));
        S = { x: p[0], y: p[1], w: Math.atan2(vr[1] - p[1], vr[0] - p[0]) };
      }
      /* die rechte Hand hält die Zugschnur hinter sich */
      const zug = schlittenZiel(S, winter);
      const schu = [0.1 * a.H, 0, 0.62 * a.H];
      const dir = einheit(minus(zug, schu));
      pose.arm[1].ziel = plus(schu, mal(dir, 0.28 * a.H));
      pose.arm[1].ziel[2] = Math.max(0.42 * a.H, pose.arm[1].ziel[2]);
      pose.arm[1].pol = [0.6, 0.3, -0.7];
      const sk = skelett(a, pose);
      mensch(B, a, sk, { wind: 0 });
      const vorne = sch ? zug : schlittenBauen(B, P, S, winter, ladung);
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
      if (!m.heim) { befreien(o, true); m.heim = [o.x, o.y]; }
      const h = hindernisse(t);
      pruefen(o, m, dt, true);
      /* der Schlitten als eigenes Ding hinter dem Kind */
      if (!o._schl || SZ().objekte.indexOf(o._schl) < 0) {
        const w = m.h + Math.PI;
        o._schl = SZ().neu("schlitten_ladung", o.x + Math.cos(w) * 1.5, o.y + Math.sin(w) * 1.5, gierAus(m.h), { saat: o.saat });
        o._schl._kind = o;
      }
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
      /* hängt der Schlitten fest, macht das Kind einen Bogen */
      if (m.haengt > 0.4) { m.h += (m.r() < 0.5 ? -1 : 1) * 0.9; m.haengt = 0; m.fest = 0.8; }
      lenken(o, m, dt, h, true, a.tempo * m.g, false, t);
      m.ph = (m.ph + f * dt * m.g) % 1;
      o.gier = gierAus(m.h);
    }
  });
  /* Der Kinderschlitten: eigenes lebendes Ding mit eigenem Grundriss, damit
     er vor und hinter Häusern, Buden und Bäumen richtig einsortiert wird.
     Er folgt der Schnur (Schleppkurve); jeder Schritt wird gegen Hindernisse
     und Wasser geprüft – ist der Platz besetzt, schwenkt er um den Zugpunkt,
     sonst bleibt er stehen und das Kind geht einen Bogen. */
  ST.modell("schlitten_ladung", {
    name: "Kinderschlitten", gruppe: "Deko", versteckt: true, live: true, ueberall: true, grund: [0.5, 1.0], hoehe: 0.6,
    bauen: function () {},
    zeichnen: function (g, P) {
      const o = P.objekt, k = o._kind;
      if (!k || !anwesend(o)) return;
      const O = P.proj(0, 0, 0);
      const B = new GS.Buehne({ s: P.s, X0: O[0], Y0: O[1], Z: P.Z, jahr: P.jahr, lampen: GS.lampenBei(O[0], O[1], P.s, P.Z.nacht, o.x, o.y) });
      B.rahmen(GS.modellRahmen(P.c, P.sn)); B.gruppe(0);
      schlittenBauen(B, P, { x: 0, y: 0, w: Math.PI / 2 }, P.jahr === "winter", (k.saat | 0) % 3);
      o._bb = B;
      B.malen(g);
    },
    schatten: function (sg, P) {
      const o = P.objekt;
      if (!o._kind || !anwesend(o)) return;
      const O = P.proj(0, 0, 0);
      const B = new GS.Buehne({ s: P.s, X0: O[0], Y0: O[1], Z: P.Z, jahr: P.jahr });
      B.rahmen(GS.modellRahmen(P.c, P.sn)); B.gruppe(0);
      schlittenBauen(B, P, { x: 0, y: 0, w: Math.PI / 2 }, P.jahr === "winter", (o._kind.saat | 0) % 3);
      kontaktSchatten(sg, P, 0.45);
      sg.save(); B.schattenMalen(sg); sg.restore();
    },
    bewegen: function (o, dt, t) {
      const k = o._kind;
      o._pr = (o._pr || 0) - dt;
      if (!k || (o._pr <= 0 && SZ().objekte.indexOf(k) < 0)) { SZ().weg(o); return; }
      if (o._pr <= 0) o._pr = 1;
      if (!anwesend(k) || !k._m) return;
      const h = hindernisse(t), km = k._m;
      const hx = k.x - Math.cos(km.h) * 0.2, hy = k.y - Math.sin(km.h) * 0.2;
      const dx = o.x - hx, dy = o.y - hy, d = Math.hypot(dx, dy) || 1, L = 1.45;
      const passt = (x, y, w) => frei(x, y, h, true) && frei(x + Math.cos(w) * 0.45, y + Math.sin(w) * 0.45, h, true) && frei(x - Math.cos(w) * 0.45, y - Math.sin(w) * 0.45, h, true);
      if (d > L) {
        const w0 = Math.atan2(dy, dx);
        let gut = false;
        for (const dw of [0, 0.25, -0.25, 0.5, -0.5, 0.8, -0.8]) {
          const w = w0 + dw, x = hx + Math.cos(w) * L, y = hy + Math.sin(w) * L;
          if (passt(x, y, w + Math.PI)) { o.x = x; o.y = y; o.gier = gierAus(w + Math.PI); gut = true; break; }
        }
        km.haengt = gut ? 0 : (km.haengt || 0) + dt;
      }
    }
  });

  /* =====================================================================
     SCHLITTSCHUHLÄUFER (See bei ~(52, 50))
     Gleitphase: Standbein gestreckt unter dem Körperschwerpunkt, Spielbein
     seitlich hinten, die Kufe knapp über dem Eis, Oberkörper 20–25° vor.
     Arme gegenläufig oder auf dem Rücken. Jeder läuft seine eigene Ellipse
     (eigene Mitte), hält ≥ 1,2 m Abstand, überholt außen, bleibt ab und zu
     stehen. Ohne Eisfläche ist niemand auf dem Eis.
     ===================================================================== */
  lebendModell("schlittschuh", {
    name: "Schlittschuhläufer", kontakt: 0.36,
    buehne: function (B, o, P) {
      const a = ausstattung(o, o.saat % 4 === 0 ? "kind" : "erwachsen", P.jahr);
      a.saum = Math.max(a.saum, 0.44);     // zum Eislaufen kurze Jacke statt langem Mantel
      const m = o._m || { ph: 0.2, neig: 0, lauf: 1 };
      const w = (m.ph || 0) * TAU, lauf = m.lauf == null ? 1 : m.lauf;
      /* Wechselschritt: je halber Takt gleitet ein Bein, das andere stößt ab und schwebt */
      const links = Math.sin(w);
      const spiel = (x) => glatt(0.1, 0.7, x) * lauf;          // wie weit das Spielbein angehoben ist
      const sL = spiel(-links), sR = spiel(links);            // links gleitet, wenn sin > 0
      /* Spielbein fast gestreckt nach hinten-außen, die Kufe knapp über dem Eis und etwa waagerecht */
      const bein = (sp) => ({ a: 0.06 - 0.38 * sp, k: 0.14 + 0.06 * sp + 0.1 * lauf * (1 - sp), f: 0.08 + 0.36 * sp, b: 0.03 + 0.26 * sp });
      const rueck = (o.saat % 5) < 2;                          // manche laufen mit den Händen auf dem Rücken
      const arm = rueck ? [{ a: 0, e: 0, ab: 0.1 }, { a: 0, e: 0, ab: 0.1 }]
        : [{ a: 0.35 * links * lauf + 0.1, e: 0.35, ab: 0.28 }, { a: -0.35 * links * lauf + 0.1, e: 0.35, ab: 0.28 }];
      const pose = {
        bein: [bein(sL), bein(sR)], arm: arm,
        neig: 0.08 + 0.32 * lauf, seit: 0.05 * links * lauf, dreh: 0.1 * links * lauf, becken: -0.06 * links * lauf,
        x: -0.035 * a.H * links * lauf, kopfNick: -0.12 * lauf
      };
      if (rueck) {
        const Hm = masse(a);
        pose.arm[0].ziel = [-0.03 * a.H, -0.12 * a.H, Hm.huefte + 0.02 * a.H]; pose.arm[0].pol = [-1, -0.2, -0.3];
        pose.arm[1].ziel = [0.03 * a.H, -0.12 * a.H, Hm.huefte + 0.03 * a.H]; pose.arm[1].pol = [1, -0.2, -0.3];
      }
      /* in die Kurve legen: ganzen Körper um die Laufrichtung kippen */
      const kipp = m.neig || 0;
      const R = B.R, cz = Math.cos(kipp), sz = Math.sin(kipp);
      B.rahmen(GS.rahmen(R.o, plus(mal(R.x, cz), mal(R.z, -sz)), R.y, plus(mal(R.z, cz), mal(R.x, sz))));
      mensch(B, a, skelett(a, pose), { kufen: true, wind: 0.03 * a.H });
      B.rahmen(R);
    },
    bewegen: function (o, dt, t) {
      const m = zustand(o);
      m.t += dt;
      if (WERKBANK) { m.ph = (m.ph + 0.45 * dt) % 1; m.neig = 0.1; m.lauf = 1; return; }
      if (!m.bahn && !m.keinEis) {
        /* Eisfläche in der Nähe: Mitte suchen, dann eine eigene Ellipse, die ganz auf dem Eis liegt */
        let sx = 0, sy = 0, n = 0;
        for (let y = -16; y <= 16; y += 1) for (let x = -16; x <= 16; x += 1) if (ST.boden.wert(o.x + x, o.y + y, 1) > 0.5) { sx += o.x + x; sy += o.y + y; n++; }
        if (!n) { m.keinEis = true; return; }
        const cx0 = sx / n, cy0 = sy / n;
        const eis = (x, y) => ST.boden.wert(x, y, 1) > 0.55;
        let bahn = null;
        for (let versuch = 0; versuch < 12 && !bahn; versuch++) {
          const k = 1 - versuch * 0.07;
          const cx = cx0 + (m.r() - 0.5) * 5 * k, cy = cy0 + (m.r() - 0.5) * 4 * k;
          const A = (4 + m.r() * 3.5) * k, Bh = (2.6 + m.r() * 2) * k, rot = m.r() * Math.PI;
          let ok = true;
          for (let i = 0; i < 24 && ok; i++) { const w = i / 24 * TAU, ex = A * Math.cos(w) + 0.9, ey = Bh * Math.sin(w); ok = eis(cx + ex * Math.cos(rot) - ey * Math.sin(rot), cy + ex * Math.sin(rot) + ey * Math.cos(rot)); }
          if (ok) bahn = { cx: cx, cy: cy, A: A, B: Bh, rot: rot };
        }
        if (!bahn) { m.keinEis = true; return; }
        bahn.w = Math.atan2(o.y - bahn.cy, o.x - bahn.cx); bahn.v = 1.7 + m.r() * 1.1; bahn.aus = 0; bahn.halt = 12 + m.r() * 30;
        m.bahn = bahn; m.lauf = 1;
      }
      if (m.keinEis || !anwesend(o)) return;
      const b = m.bahn;
      /* ab und zu anhalten: ausgleiten, kurz stehen, wieder anlaufen */
      b.halt -= dt;
      let vSoll = b.v;
      if (b.halt < 0) { vSoll = 0; if (b.halt < -(3 + (o.saat % 4))) b.halt = 18 + m.r() * 30; }
      /* Abstand: wer dicht vor mir fährt, wird außen überholt; zu dicht → bremsen */
      let ausZiel = 0;
      for (const p of lebende(t)) {
        if (p === o || p.typ !== "schlittschuh" || !anwesend(p)) continue;
        const dx = p.x - o.x, dy = p.y - o.y, d = Math.hypot(dx, dy);
        if (d > 2.2) continue;
        const vorn = (dx * Math.cos(m.h || 0) + dy * Math.sin(m.h || 0)) / (d || 1);
        if (vorn > 0.4 && d < 1.8) { ausZiel = 1.0; if (d < 1.2) vSoll = Math.min(vSoll, (p._m && p._m.v) || 0.5); }
        if (d < 1.2 && vorn > -0.2) vSoll *= 0.85;
      }
      b.aus += klemm(ausZiel - b.aus, -dt * 0.5, dt * 0.5);
      m.v = (m.v == null ? b.v : m.v) + klemm(vSoll - (m.v == null ? b.v : m.v), -dt * 0.9, dt * 0.7);
      const R = Math.max(1.5, (b.A + b.B) / 2 + b.aus);
      b.w += m.v / R * dt;
      const nx = b.cx + (b.A + b.aus) * Math.cos(b.w) * Math.cos(b.rot) - (b.B + b.aus) * Math.sin(b.w) * Math.sin(b.rot);
      const ny = b.cy + (b.A + b.aus) * Math.cos(b.w) * Math.sin(b.rot) + (b.B + b.aus) * Math.sin(b.w) * Math.cos(b.rot);
      const vx = nx - o.x, vy = ny - o.y;
      if (Math.hypot(vx, vy) > 1e-5) m.h = Math.atan2(vy, vx);
      o.x = nx; o.y = ny;
      o.gier = gierAus(m.h);
      m.lauf = klemm(m.v / 1.6, 0, 1);
      /* Kurvenlage aus Tempo und Krümmung, Mitte der Ellipse liegt links */
      const kr = Math.atan(m.v * m.v / (R * 9.81)) * 0.9;
      m.neig = -Math.min(0.26, kr) * m.lauf;
      m.ph = (m.ph + (0.35 + 0.15 * m.lauf) * dt * (m.lauf > 0.05 ? 1 : 0)) % 1;
    }
  });

  /* =====================================================================
     STATISTEN FÜR WINTERHAUSEN
     dorf.js ruft ST.menschenSetzen() in ST.stadtAnfang auf (nach dem Bauen
     oder Laden – Menschen werden nicht gespeichert). Spaziergänger, Kinder
     und Schlittschuhläufer stehen in der Liste unten; die Marktbesucher
     kommen in Gruppen an die Buden, die WIRKLICH in der Stadt stehen (3–5 je
     Bude in Gruppen von 2–4, manchmal ein Kind an der Hand). Ohne Bude gibt
     es keine Glühweintrinker.
     ===================================================================== */
  ST.MENSCHEN_PLAETZE = [
    /* Spaziergänger auf Markt und Straßen [Typ, x, y, gier] */
    ["spaziergaenger", -10.5, -3, 90], ["spaziergaenger", 10.5, 4, 270], ["spaziergaenger", -4, 10.5, 0], ["spaziergaenger", 5, -10.5, 180],
    ["spaziergaenger", 0.5, 18, 180], ["spaziergaenger", -1, 30, 0], ["spaziergaenger", 1.2, -24, 180], ["spaziergaenger", -1.5, -40, 0],
    ["spaziergaenger", -30, 3.6, 90], ["spaziergaenger", -38, 1, 270], ["spaziergaenger", 27.5, -2.2, 270], ["spaziergaenger", 40, 1.5, 90],
    ["spaziergaenger", 8, 8, 225], ["spaziergaenger", -8, -12, 45], ["spaziergaenger", 29.2, -2.3, 90], ["spaziergaenger", 34.2, -1.6, 270],
    /* Kinder mit Schlitten auf den Schneewiesen */
    ["kind_schlitten", -18, 20, 45], ["kind_schlitten", 22, 26, 300], ["kind_schlitten", -30, -20, 120],
    /* Schlittschuhläufer auf dem See bei (52, 50) */
    ["schlittschuh", 47, 50, 0], ["schlittschuh", 56, 46, 90], ["schlittschuh", 52, 55, 180], ["schlittschuh", 58, 52, 270], ["schlittschuh", 49, 45, 45]
  ];
  /* Marktgruppen an allen Buden: die meisten stehen schon mit ihrem Glühwein
     beisammen, einige stehen an, einige kommen gerade */
  function marktGruppenSetzen(setze) {
    const S = SZ();
    hind = null;
    const h = hindernisse(-1e9);
    const r = ST.zufall(4711);
    let k = 0;
    for (const b of h.buden) {
      const anzahl = 3 + ((r() * 3) | 0);
      const teile = anzahl === 3 ? [3] : anzahl === 4 ? (r() < 0.5 ? [2, 2] : [4]) : [2, 3];
      teile.forEach(function (n, j) {
        const leute = [];
        const mitKind = n >= 2 && r() < 0.3;
        for (let i = 0; i < n; i++) {
          const o = setze("marktbesucher", b.theke[0], b.theke[1], 0, mitKind && i === 1 ? { kind: true } : null);
          if (o) leute.push(o);
        }
        if (!leute.length) return;
        const zustand0 = j === 0 && r() < 0.25 ? "kommen" : (j === 0 && r() < 0.3 ? "anstehen" : "trinken");
        const G = gruppeNeu(b, leute, zustand0, h, 0);
        if (mitKind) G.kindIdx = 1;
        if (zustand0 === "trinken") {
          const pl = gruppenPlatz(G, h, 0); G.mitte = pl.mitte; G.rad = pl.rad; plaetzeVerteilen(G);
          G.zt = r() * G.dauer * 0.8;
          for (const o of leute) { o.x = o._m.platz[0]; o.y = o._m.platz[1]; o._m.h = o._m.platzBlick; o.gier = gierAus(o._m.h); o._m.tasse = !o.kind || o.saat % 2 === 0; o._m.g = 0; o._m.da = true; }
        } else {
          const start = zustand0 === "kommen" ? randPunkt(b, h, r, 6) : [b.theke[0] + b.vx * 1.4, b.theke[1] + b.vy * 1.4];
          leute.forEach(function (o, i) { o.x = start[0] + (i % 2 ? 0.55 : 0) * b.qx - (i >> 1) * 0.8 * b.vx; o.y = start[1] + (i % 2 ? 0.55 : 0) * b.qy - (i >> 1) * 0.8 * b.vy; o._m.tasse = false; befreien(o, false); });
        }
      });
      k++;
    }
    void S; void k;
  }
  /* Statisten setzen: für dorf.js (ST.stadtAnfang) und den Test mit leute=1.
     Gibt die Zahl der gesetzten Menschen zurück. */
  ST.menschenSetzen = function () {
    const S = SZ();
    let n = 0;
    GRUPPEN = [];
    const setze = function (typ, x, y, gier, extra) {
      if (!ST.MODELLE[typ]) return null;
      const o = S.neu(typ, x, y, gier, Object.assign({ saat: 1000 + n * 7919 }, extra || {}));
      n++;
      return o;
    };
    for (const e of ST.MENSCHEN_PLAETZE) setze(e[0], e[1], e[2], e[3]);
    marktGruppenSetzen(setze);
    hind = null;
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
