/* =====================================================================
   FASSUNG 834 — DER NEUE MENSCH: EIN SKELETT, ALLE HALTUNGEN
   ---------------------------------------------------------------------
   XANDER (Funk 213/214, wörtlich): „als nächstes möchte ich dass du in
   unseren Bilderwelten den Baukasten überarbeitest dass wir wirklich
   diesmal realistische Personen haben mit der Qualität wie du gestern
   diese Gebäude gebaut hast … der Baukasten und sämtliche Sitz-, Steh-,
   Hock-, Knie- und sonst was auf allen Vieren Positionen sollen
   überarbeitet werden dass sie realistisch aussehen dass die Hände alles
   alle Körpergliedmaßen … die Anatomie … realistisch … so wie du eine
   Kathedrale baust … dass der Kellner nicht mehr so steif da steht …
   dass sie sich … innerhalb der Bilder … auch bewegen ja dann nur auf so
   einem 2D Level aber man soll sie dort auch hinsetzen können … mit ein
   paar einfachen Animationen“.

   WAS VORHER WAR
   Die alten Figuren (figuren/<typ>-teil*.js, zusammen 36 MB) waren fertig
   gemalte Einzelbilder je Haltung, alle streng von vorn. Beim Sitzen
   wurden die Oberschenkel zu zwei Ballons, „hocken“ und „gehen“ gab es
   gar nicht (die Figur stand dann einfach), und weil jede Haltung ein
   eigenes Bild war, konnte sich nichts bewegen.

   WIE ES JETZT GEBAUT IST — WIE EINE KATHEDRALE: ERST DAS GERÜST
   1. Ein SKELETT mit Gelenken (Becken, Lende, Brust, Hals, Kopf,
      Schulter, Ellbogen, Handgelenk, Fingerglieder, Hüfte, Knie,
      Sprunggelenk). Die Längen kommen aus den Körperproportionen: ein
      Erwachsener ist 7,5 Kopfhöhen groß, ein Kind 6, ein Kleinkind 5,
      ein Säugling 4. Hüfte auf halber Höhe, Knie bei 27 %, Oberarm 19 %
      der Größe (die Tabellen der Anthropometrie, nicht geschätzt).
   2. Eine HALTUNG ist nur eine Liste von Gelenkwinkeln. Deshalb gibt es
      beliebig viele, und zwischen zwei Haltungen lässt sich überblenden
      (Hinsetzen, Aufstehen, Gehen, Winken).
   3. Jeder Körperteil ist ein Körper aus Querschnitten (Ellipsen) entlang
      seines Knochens — Wade hinten gewölbt, Oberschenkel vorn, Schulter
      mit Deltamuskel. Aus dem Raum auf die Bildebene gebracht, ergibt das
      die Umrisse von selbst — auch von schräg vorn, von der Seite oder
      wenn der Oberschenkel beim Sitzen auf den Betrachter zeigt.
   4. Kleidung sitzt auf denselben Querschnitten, nur etwas weiter. Darum
      passt jedes Stück in jeder Haltung.
   5. Hände mit fünf Fingern aus je drei Gliedern, die sich krümmen.
   Alles wird als SVG-Text erzeugt — im Browser und in node (so werden
   die Menschen in den Szenen gebacken). Eine Figur ist 10–20 KB groß.

   Koordinaten: Zentimeter, y nach unten. Der Ursprung der Ausgabe ist der
   Punkt auf dem Boden unter der Hüftmitte.
   ===================================================================== */
(function (W) {
  "use strict";
  const RAD = Math.PI / 180;

  /* ------------------------------------------------------------------
     1 — RECHNEN IM RAUM
     ------------------------------------------------------------------ */
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const len = (a) => Math.sqrt(dot(a, a));
  const unit = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const lerp = (a, b, t) => a + (b - a) * t;
  const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  const klemm = (x, a, b) => Math.max(a, Math.min(b, x));
  const glatt = (t) => { t = klemm(t, 0, 1); return t * t * (3 - 2 * t); };
  function mm(A, B) {
    const C = new Array(9);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++)
      C[i * 3 + j] = A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j];
    return C;
  }
  const mv = (A, v) => [A[0] * v[0] + A[1] * v[1] + A[2] * v[2],
    A[3] * v[0] + A[4] * v[1] + A[5] * v[2], A[6] * v[0] + A[7] * v[1] + A[8] * v[2]];
  const EINS = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  /* Achsen des Körperraums: 0 = links (Sicht der Figur), 1 = unten, 2 = vorn. */
  function rx(d) { const c = Math.cos(d * RAD), s = Math.sin(d * RAD); return [1, 0, 0, 0, c, -s, 0, s, c]; }
  function ry(d) { const c = Math.cos(d * RAD), s = Math.sin(d * RAD); return [c, 0, s, 0, 1, 0, -s, 0, c]; }
  function rz(d) { const c = Math.cos(d * RAD), s = Math.sin(d * RAD); return [c, -s, 0, s, c, 0, 0, 0, 1]; }
  const r1 = (v) => Math.round(v * 10) / 10;

  /* ------------------------------------------------------------------
     2 — FARBEN
     ------------------------------------------------------------------ */
  function hex2rgb(h) {
    h = String(h || "#888888").replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    const c = [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16));
    return c.some((v) => isNaN(v)) ? [136, 136, 136] : c;
  }
  function rgb2hex(c) { return "#" + c.map((v) => ("0" + Math.round(klemm(v, 0, 255)).toString(16)).slice(-2)).join(""); }
  function misch(a, b, t) { const x = hex2rgb(a), y = hex2rgb(b); return rgb2hex(x.map((v, i) => v + (y[i] - v) * t)); }
  const dunkler = (h, t) => misch(h, "#1b1210", t);
  const heller = (h, t) => misch(h, "#fffaf2", t);

  const HAUT = {
    rosa: "#f1c7b6",
    sehrhell: "#f6dcc8", hell: "#eec6a4", mittel: "#d7a179", oliv: "#c28e62",
    dunkel: "#8d5a3b", sehrdunkel: "#5e3a26",
  };
  const HAAR = {
    schwarz: "#26211f", dunkelbraun: "#43302a", braun: "#6b4a33", hellbraun: "#93704f",
    blond: "#c9a466", hellblond: "#e2cc93", rot: "#a2502b", grau: "#9d9a96", weiss: "#e6e3de",
  };
  const AUGE = ["#5a3d28", "#3f6b8f", "#4f6b3e", "#6b4a2e"];
  const FARBE = {
    rot: "#b8473a", blau: "#2f5f95", gruen: "#4f8a46", gelb: "#d8ad3a", schwarz: "#2f3035",
    weiss: "#eeefec", grau: "#86898e", braun: "#7d5838", gruen_d: "#2f5a35", rosa: "#d98aa6",
    beige: "#d8c7a6", jeans: "#3d5f8c", hellblau: "#9fc0dc", orange: "#e0802e", creme: "#f1ead8",
  };
  function farbwert(n, sonst) { return FARBE[n] || (n && n[0] === "#" ? n : null) || sonst || "#7a8fa6"; }

  /* ------------------------------------------------------------------
     3 — PROPORTIONEN
     ------------------------------------------------------------------
     H = Körpergröße, koepfe = Kopfhöhen, bein = Hüftgelenk / H.
     Die Breiten sind Anteile von H; „fuelle“ macht Babys rundlich. */
  const TYP = {
    saeugling: { H: { m: 68, w: 66 }, koepfe: 4.0, bein: 0.36, schulter: 0.105, huefte: 0.052, fuelle: 1.28, hals: 0.12, arm: 0.93 },
    kleinkind: { H: { m: 94, w: 92 }, koepfe: 5.0, bein: 0.42, schulter: 0.1, huefte: 0.05, fuelle: 1.16, hals: 0.18, arm: 0.95 },
    kind: { H: { m: 134, w: 132 }, koepfe: 6.1, bein: 0.47, schulter: 0.096, huefte: 0.049, fuelle: 1.02, hals: 0.26, arm: 0.98 },
    jugendlich: { H: { m: 172, w: 163 }, koepfe: 7.1, bein: 0.5, schulter: 0.1, huefte: 0.05, fuelle: 0.95, hals: 0.3, arm: 1 },
    erwachsen: { H: { m: 178, w: 166 }, koepfe: 7.5, bein: 0.505, schulter: 0.102, huefte: 0.049, fuelle: 1, hals: 0.3, arm: 1 },
    alt: { H: { m: 172, w: 160 }, koepfe: 7.3, bein: 0.5, schulter: 0.1, huefte: 0.05, fuelle: 1.06, hals: 0.27, arm: 1 },
  };

  function massFuer(alter, geschlecht) {
    const t = TYP[alter] || TYP.erwachsen;
    const w = geschlecht === "w";
    const H = t.H[w ? "w" : "m"];
    const kopf = H / t.koepfe;
    const kinn = H - kopf;
    const huefteH = H * t.bein;
    const schulterH = kinn - 0.52 * kopf * (t.koepfe >= 7 ? 1 : 0.8);
    const halsH = kinn - t.hals * 0.85 * kopf;
    const rumpf = schulterH - huefteH;
    const erw = t.koepfe >= 7;
    const k = rumpf / 51;                         // Rumpfmaßstab gegen den Erwachsenen
    const g = H / 178;                            // Größenmaßstab
    return {
      alter, geschlecht, w, H, kopf, kinn, huefteH, schulterH, halsH, rumpf, k, g, erw,
      fuelle: t.fuelle * (alter === "alt" && !w ? 1.04 : 1),
      oberschenkel: huefteH * 0.47, unterschenkel: huefteH * 0.445, knoechel: huefteH * 0.085,
      oberarm: rumpf * 0.64 * t.arm, unterarm: rumpf * 0.51 * t.arm, hand: rumpf * 0.37 * t.arm,
      schulterB: H * (w ? t.schulter * 0.93 : t.schulter),
      huefteB: H * (w ? t.huefte * 1.12 : t.huefte),
      fuss: H * 0.142,
      lendeY: rumpf * 0.3, brustY: rumpf * 0.58,
    };
  }

  /* ------------------------------------------------------------------
     4 — HALTUNGEN (Gelenkwinkel in Grad)
     ------------------------------------------------------------------
     kipp: ganzer Körper nach vorn (+) / hinten (−), roll: seitlich.
     lende, brust: Rumpf vorbeugen (+). nacken, kopf: nicken (+).
     schulterL/R: vor (+ nach vorn), seit (+ vom Körper weg), dreh.
     ellbogenL/R: beugen. unterarmL/R: Handfläche nach oben drehen (+).
     handL/R: Handgelenk nach oben (+). fingerL/R: 0 gestreckt … 1 Faust.
     huefteL/R: vor, seit, dreh. knieL/R: beugen. fussL/R: Spitze runter (+).
     L ist die linke Körperseite der Figur.                              */
  const ARM_RUHE = { vor: -2, seit: 7, dreh: 0 };
  const POSEN = {
    stehen: {
      lende: 1, brust: -2, nacken: 6, kopf: -4,
      schulterL: { vor: 3, seit: 7 }, ellbogenL: 12, unterarmL: 10, handL: 6, fingerL: 0.38,
      schulterR: { vor: -4, seit: 8 }, ellbogenR: 9, unterarmR: 5, handR: 4, fingerR: 0.34,
      huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0,
      huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0,
    },
    /* Kontrapost: das Gewicht auf dem rechten Bein, das Becken hebt sich
       dort, die Schultern gleichen aus, das freie Knie gibt nach. */
    kontrapost: {
      roll: 3, lende: 1, brust: -2, brustRoll: -5, nacken: 5, kopf: -3, kopfRoll: 3,
      schulterL: { vor: 4, seit: 6 }, ellbogenL: 14, unterarmL: 10, handL: 6, fingerL: 0.36,
      schulterR: { vor: -5, seit: 9 }, ellbogenR: 10, unterarmR: 4, handR: 4, fingerR: 0.34,
      huefteL: { vor: 9, seit: 1, dreh: -10 }, knieL: 14, fussL: 4,
      huefteR: { vor: -2, seit: 4, dreh: -4 }, knieR: 1, fussR: 0,
    },
    sitzen: {
      kipp: 0, lende: -6, brust: 4, nacken: 8, kopf: -6,
      schulterL: { vor: 10, seit: 9 }, ellbogenL: 40, unterarmL: -70, handL: -12, fingerL: 0.3,
      schulterR: { vor: 8, seit: 10 }, ellbogenR: 44, unterarmR: -74, handR: -14, fingerR: 0.3,
      huefteL: { vor: 86, seit: 6, dreh: -4 }, knieL: 84, fussL: -2,
      huefteR: { vor: 88, seit: 8, dreh: -6 }, knieR: 92, fussR: 2,
    },
    lesen: {
      kipp: 0, lende: -2, brust: 8, nacken: 16, kopf: 10,
      schulterL: { vor: 22, seit: 12 }, ellbogenL: 100, unterarmL: 70, handL: 18, fingerL: 0.45,
      schulterR: { vor: 20, seit: 13 }, ellbogenR: 104, unterarmR: 70, handR: 18, fingerR: 0.45,
      huefteL: { vor: 86, seit: 6, dreh: -4 }, knieL: 84, fussL: -2,
      huefteR: { vor: 88, seit: 8, dreh: -6 }, knieR: 92, fussR: 2,
    },
    sitzen_boden: {
      kipp: -12, lende: 0, brust: 8, nacken: 8, kopf: -2,
      schulterL: { vor: -28, seit: 14 }, ellbogenL: 6, unterarmL: -20, handL: 70, fingerL: 0.15,
      schulterR: { vor: -26, seit: 14 }, ellbogenR: 6, unterarmR: -20, handR: 70, fingerR: 0.15,
      huefteL: { vor: 95, seit: 6, dreh: -10 }, knieL: 26, fussL: 12,
      huefteR: { vor: 86, seit: 5, dreh: -8 }, knieR: 8, fussR: 16,
    },
    schneidersitz: {
      kipp: 0, lende: -2, brust: 6, nacken: 6, kopf: -4,
      schulterL: { vor: 16, seit: 12 }, ellbogenL: 58, unterarmL: -50, handL: -10, fingerL: 0.35,
      schulterR: { vor: 18, seit: 12 }, ellbogenR: 54, unterarmR: -50, handR: -10, fingerR: 0.35,
      huefteL: { vor: 72, seit: 48, dreh: 52 }, knieL: 138, fussL: 10,
      huefteR: { vor: 76, seit: 44, dreh: 56 }, knieR: 134, fussR: 10,
    },
    fersensitz: {
      kipp: 0, lende: -2, brust: 4, nacken: 6, kopf: -4,
      schulterL: { vor: 22, seit: 8 }, ellbogenL: 48, unterarmL: -60, handL: -6, fingerL: 0.3,
      schulterR: { vor: 20, seit: 8 }, ellbogenR: 50, unterarmR: -60, handR: -6, fingerR: 0.3,
      huefteL: { vor: 80, seit: 6, dreh: -2 }, knieL: 160, fussL: 58,
      huefteR: { vor: 82, seit: 7, dreh: -2 }, knieR: 162, fussR: 58,
    },
    hocken: {
      kipp: 24, lende: 14, brust: 8, nacken: -14, kopf: -16,
      schulterL: { vor: 52, seit: 12 }, ellbogenL: 36, unterarmL: -30, handL: -4, fingerL: 0.35,
      schulterR: { vor: 46, seit: 14 }, ellbogenR: 40, unterarmR: -30, handR: -4, fingerR: 0.35,
      huefteL: { vor: 100, seit: 16, dreh: -12 }, knieL: 140, fussL: 38,
      huefteR: { vor: 104, seit: 18, dreh: -12 }, knieR: 146, fussR: 40,
    },
    knien: {
      kipp: 0, lende: 2, brust: -2, nacken: 6, kopf: -4,
      schulterL: { vor: 4, seit: 8 }, ellbogenL: 14, unterarmL: 10, handL: 6, fingerL: 0.38,
      schulterR: { vor: -2, seit: 9 }, ellbogenR: 12, unterarmR: 6, handR: 4, fingerR: 0.36,
      huefteL: { vor: 4, seit: 5, dreh: -2 }, knieL: 92, fussL: 58,
      huefteR: { vor: 2, seit: 5, dreh: -2 }, knieR: 90, fussR: 58,
    },
    knien_halb: {
      kipp: 0, lende: 4, brust: 2, nacken: 6, kopf: -4,
      schulterL: { vor: 6, seit: 8 }, ellbogenL: 20, unterarmL: 10, handL: 6, fingerL: 0.38,
      schulterR: { vor: 44, seit: 10 }, ellbogenR: 38, unterarmR: -60, handR: -4, fingerR: 0.3,
      huefteL: { vor: -6, seit: 4, dreh: 0 }, knieL: 96, fussL: 10,
      huefteR: { vor: 84, seit: 8, dreh: -6 }, knieR: 84, fussR: 0,
    },
    knien_vor: {
      kipp: 0, lende: 22, brust: 16, nacken: -22, kopf: -16,
      schulterL: { vor: 30, seit: 8 }, ellbogenL: 20, unterarmL: -60, handL: 10, fingerL: 0.3,
      schulterR: { vor: 34, seit: 8 }, ellbogenR: 22, unterarmR: -60, handR: 10, fingerR: 0.3,
      huefteL: { vor: 22, seit: 6, dreh: -2 }, knieL: 112, fussL: 58,
      huefteR: { vor: 20, seit: 7, dreh: -2 }, knieR: 110, fussR: 58,
    },
    krabbeln: {
      kipp: 82, lende: -6, brust: -4, nacken: -38, kopf: -30,
      schulterL: { vor: 84, seit: 4 }, ellbogenL: 4, unterarmL: -86, handL: 78, fingerL: 0.1,
      schulterR: { vor: 80, seit: 4 }, ellbogenR: 6, unterarmR: -86, handR: 78, fingerR: 0.1,
      huefteL: { vor: 84, seit: 5, dreh: 0 }, knieL: 92, fussL: 40,
      huefteR: { vor: 94, seit: 5, dreh: 0 }, knieR: 96, fussR: 40,
    },
    liegen: {
      kipp: -90, lende: -2, brust: 0, nacken: 8, kopf: 4,
      schulterL: { vor: 6, seit: 14 }, ellbogenL: 14, unterarmL: -60, handL: 4, fingerL: 0.35,
      schulterR: { vor: 8, seit: 16 }, ellbogenR: 30, unterarmR: -70, handR: 4, fingerR: 0.35,
      huefteL: { vor: 4, seit: 5, dreh: -12 }, knieL: 6, fussL: 30,
      huefteR: { vor: 14, seit: 4, dreh: -12 }, knieR: 26, fussR: 30,
    },
    /* Die Lehrbuch-Haltung: aufrecht, gleichmäßig auf beiden Beinen, die
       Arme leicht vom Körper, die Handflächen nach vorn. */
    lehrbuch: {
      lende: 0, brust: 0, nacken: 2, kopf: -2,
      schulterL: { vor: 0, seit: 16 }, ellbogenL: 6, unterarmL: 80, handL: 4, fingerL: 0.12,
      schulterR: { vor: 0, seit: 16 }, ellbogenR: 6, unterarmR: 80, handR: 4, fingerR: 0.12,
      huefteL: { vor: 0, seit: 5, dreh: -4 }, knieL: 1, fussL: 0,
      huefteR: { vor: 0, seit: 5, dreh: -4 }, knieR: 1, fussR: 0,
    },
    /* Das Ungeborene im Mutterleib: eingerollt, Kinn auf der Brust. */
    foetus: {
      lende: 30, brust: 26, nacken: 34, kopf: 26,
      schulterL: { vor: 64, seit: 18 }, ellbogenL: 118, unterarmL: 20, handL: 10, fingerL: 0.7,
      schulterR: { vor: 58, seit: 20 }, ellbogenR: 124, unterarmR: 20, handR: 10, fingerR: 0.7,
      huefteL: { vor: 118, seit: 10, dreh: 0 }, knieL: 138, fussL: 10,
      huefteR: { vor: 124, seit: 10, dreh: 0 }, knieR: 144, fussR: 10,
    },
    /* In der Badewanne: zurückgelehnt, die Beine lang, die Arme auf dem Rand. */
    baden: {
      kipp: -60, lende: -4, brust: 8, nacken: 22, kopf: 4,
      schulterL: { vor: -14, seit: 26 }, ellbogenL: 30, unterarmL: -20, handL: 0, fingerL: 0.35,
      schulterR: { vor: -10, seit: 28 }, ellbogenR: 34, unterarmR: -20, handR: 0, fingerR: 0.35,
      huefteL: { vor: 22, seit: 5, dreh: -8 }, knieL: 8, fussL: 20,
      huefteR: { vor: 30, seit: 5, dreh: -8 }, knieR: 22, fussR: 20,
    },
    winken: {
      roll: 2, lende: 1, brust: -3, brustRoll: -3, nacken: 4, kopf: -6,
      schulterL: { vor: 3, seit: 7 }, ellbogenL: 14, unterarmL: 10, handL: 6, fingerL: 0.36,
      schulterR: { vor: 14, seit: 70, dreh: 90 }, ellbogenR: 100, unterarmR: 0, handR: 8, fingerR: 0.04,
      huefteL: { vor: 6, seit: 2, dreh: -8 }, knieL: 9, fussL: 2,
      huefteR: { vor: -3, seit: 4, dreh: -4 }, knieR: 1, fussR: 0,
    },
    halten: {
      lende: 1, brust: -1, nacken: 8, kopf: 2,
      schulterL: { vor: 16, seit: 10 }, ellbogenL: 78, unterarmL: 40, handL: 4, fingerL: 0.55,
      schulterR: { vor: 14, seit: 11 }, ellbogenR: 80, unterarmR: 40, handR: 4, fingerR: 0.55,
      huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0,
      huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0,
    },
    zeigen: {
      lende: 1, brust: -2, nacken: 4, kopf: -6,
      schulterL: { vor: 3, seit: 7 }, ellbogenL: 12, unterarmL: 10, handL: 6, fingerL: 0.38,
      schulterR: { vor: 82, seit: 8, dreh: 0 }, ellbogenR: 6, unterarmR: 0, handR: 6, fingerR: "zeigen",
      huefteL: { vor: 5, seit: 3, dreh: -6 }, knieL: 5, fussL: 0,
      huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0,
    },
    werfen: {
      lende: -4, brust: -8, brustDreh: -18, nacken: 4, kopf: -4,
      schulterL: { vor: 50, seit: 20 }, ellbogenL: 20, unterarmL: 0, handL: 4, fingerL: 0.2,
      schulterR: { vor: -40, seit: 70, dreh: 60 }, ellbogenR: 100, unterarmR: 30, handR: 10, fingerR: 0.6,
      huefteL: { vor: 22, seit: 4, dreh: -4 }, knieL: 10, fussL: 0,
      huefteR: { vor: -18, seit: 4, dreh: -8 }, knieR: 12, fussR: 20,
    },
    /* Der Kellner: das Tablett in der LINKEN Hand auf Schulterhöhe, die
       Handfläche nach oben; das Gewicht locker auf einem Bein, der Kopf
       leicht zum Gast gedreht. Nichts ist symmetrisch — so steht niemand
       steif da. */
    servieren: {
      traghand: "R", roll: 2.5, lende: 1, brust: -3, brustRoll: -4, brustDreh: 6, nacken: 5, kopf: -2, kopfDreh: 10, kopfRoll: 2,
      schulterL: { vor: -4, seit: 8 }, ellbogenL: 18, unterarmL: 8, handL: 6, fingerL: 0.4,
      schulterR: { vor: 18, seit: 30, dreh: 20 }, ellbogenR: 108, unterarmR: 0, handR: 80, fingerR: 0.1,
      huefteL: { vor: 10, seit: 1, dreh: -12 }, knieL: 15, fussL: 4,
      huefteR: { vor: -2, seit: 4, dreh: -4 }, knieR: 1, fussR: 0,
    },
  };
  /* Der Gang: ein Zyklus aus Winkelkurven (Phase 0…1). Standbein zurück,
     Schwungbein mit gebeugtem Knie nach vorn, Arme gegengleich. */
  function gehPose(p) {
    const th = p * 2 * Math.PI;
    const bein = (t) => {
      const vor = 22 * Math.sin(t);
      const schwung = Math.max(0, Math.cos(t + 0.5));
      const knie = 4 + 58 * Math.pow(schwung, 1.6) + 10 * Math.pow(Math.max(0, Math.cos(t - 1.9)), 4);
      const fuss = -14 * Math.max(0, Math.cos(t - 1.4)) + 18 * Math.pow(Math.max(0, Math.cos(t + 1.3)), 3);
      return { vor, knie, fuss };
    };
    const L = bein(th), R = bein(th + Math.PI);
    return {
      roll: 2 * Math.sin(th), lende: 3, brust: -1, brustDreh: 6 * Math.sin(th), nacken: 5, kopf: -4,
      schulterL: { vor: -16 * Math.sin(th), seit: 7 }, ellbogenL: 16 + 12 * Math.max(0, -Math.sin(th)), unterarmL: 10, handL: 6, fingerL: 0.4,
      schulterR: { vor: 16 * Math.sin(th), seit: 7 }, ellbogenR: 16 + 12 * Math.max(0, Math.sin(th)), unterarmR: 10, handR: 6, fingerR: 0.4,
      huefteL: { vor: L.vor, seit: 2, dreh: -5 }, knieL: L.knie, fussL: L.fuss,
      huefteR: { vor: R.vor, seit: 2, dreh: -5 }, knieR: R.knie, fussR: R.fuss,
    };
  }
  POSEN.gehen = gehPose(0.12);

  /* Zwei Haltungen überblenden (u = 0 … 1) — für Hinsetzen, Aufstehen, Winken. */
  function mische(A, B, u) {
    const out = {};
    const keys = new Set(Object.keys(A).concat(Object.keys(B)));
    keys.forEach((k) => {
      const a = A[k], b = B[k];
      if (typeof a === "object" || typeof b === "object") {
        const ao = a || {}, bo = b || {}; const o = {};
        new Set(Object.keys(ao).concat(Object.keys(bo))).forEach((q) => { o[q] = lerp(ao[q] || 0, bo[q] || 0, u); });
        out[k] = o;
      } else if (typeof a === "string" || typeof b === "string") {
        out[k] = u < 0.5 ? a : b;
      } else out[k] = lerp(a || 0, b || 0, u);
    });
    return out;
  }
  function pose(name) {
    if (name && typeof name === "object") return name;
    if (name === "sitzen_seit") return POSEN.sitzen;
    return POSEN[name] || POSEN.stehen;
  }

  /* ------------------------------------------------------------------
     5 — DAS SKELETT
     ------------------------------------------------------------------ */
  function gelenkRot(o, links) {
    /* o = { vor, seit, dreh } — erst beugen (um die Querachse), dann
       abspreizen (um die Längsachse), zuletzt um den Knochen drehen. */
    const vor = (o && o.vor) || 0, seit = (o && o.seit) || 0, dreh = (o && o.dreh) || 0;
    return mm(mm(rz(links ? -seit : seit), rx(vor)), ry(links ? dreh : -dreh));
  }

  function skelett(M, P) {
    const S = {};
    /* Becken: Wurzel. kipp vorbeugen = Drehung um −kipp um die Querachse. */
    const B = mm(mm(rx(-(P.kipp || 0)), rz(P.roll || 0)), ry(P.dreh || 0));
    S.becken = { p: [0, 0, 0], R: B };
    const lendeR = mm(B, rx(-(P.lende || 0)));
    S.lende = { p: mv(B, [0, -M.lendeY, -0.8 * M.k]), R: lendeR };
    const brustR = mm(mm(mm(lendeR, rx(-(P.brust || 0))), rz(P.brustRoll || 0)), ry(P.brustDreh || 0));
    S.brust = { p: add(S.lende.p, mv(lendeR, [0, -(M.brustY - M.lendeY), 0.6 * M.k])), R: brustR };
    const halsP = add(S.brust.p, mv(brustR, [0, -(M.halsH - M.huefteH - M.brustY), -1.6 * M.k]));
    const nackenR = mm(brustR, rx(-(P.nacken || 0)));
    S.hals = { p: halsP, R: nackenR };
    const kopfR = mm(mm(mm(nackenR, rx(-(P.kopf || 0))), ry(P.kopfDreh || 0)), rz(P.kopfRoll || 0));
    const kopfBasis = add(halsP, mv(nackenR, [0, -(M.kinn - M.halsH) - 0.03 * M.kopf, 0.9 * M.k]));
    S.kopf = { p: add(kopfBasis, mv(kopfR, [0, -0.46 * M.kopf, 0])), R: kopfR, basis: kopfBasis };
    ["L", "R"].forEach((sd) => {
      const links = sd === "L", sg = links ? 1 : -1;
      /* Schulter */
      const sp = add(S.brust.p, mv(brustR, [sg * M.schulterB, -(M.schulterH - M.huefteH - M.brustY), -0.6 * M.k]));
      const sR = mm(brustR, gelenkRot(P["schulter" + sd] || ARM_RUHE, links));
      S["schulter" + sd] = { p: sp, R: sR };
      const ep = add(sp, mv(sR, [0, M.oberarm, 0]));
      const eR = mm(mm(sR, rx(P["ellbogen" + sd] || 0)), ry(links ? (P["unterarm" + sd] || 0) : -(P["unterarm" + sd] || 0)));
      S["ellbogen" + sd] = { p: ep, R: eR };
      const hp = add(ep, mv(eR, [0, M.unterarm, 0]));
      /* Handgelenk: „hand“ + hebt den Handrücken (Dorsalflexion) — die
         Hand liegt mit dem Daumen nach vorn, also dreht sie um die
         Achse, die durch die Handfläche geht. */
      const hR = mm(eR, rz(links ? -(P["hand" + sd] || 0) : (P["hand" + sd] || 0)));
      S["hand" + sd] = { p: hp, R: hR, finger: P["finger" + sd] };
      /* Bein */
      const hup = mv(B, [sg * M.huefteB, 0, 0]);
      const huR = mm(B, gelenkRot(P["huefte" + sd], links));
      S["huefte" + sd] = { p: hup, R: huR };
      const kp = add(hup, mv(huR, [0, M.oberschenkel, 0]));
      const kR = mm(huR, rx(-(P["knie" + sd] || 0)));
      S["knie" + sd] = { p: kp, R: kR };
      const fp = add(kp, mv(kR, [0, M.unterschenkel, 0]));
      const fR = mm(kR, rx(-(P["fuss" + sd] || 0)));
      S["fuss" + sd] = { p: fp, R: fR };
    });
    return S;
  }

  /* ------------------------------------------------------------------
     6 — DIE KAMERA
     ------------------------------------------------------------------
     blick: 0 = von vorn, 90 = Profil nach rechts. Die Kamera schaut
     10 Grad von oben — so werden Tabletts und Hutkrempen zu Ellipsen,
     wie man sie im Zimmer sieht. */
  function kamera(blick, neigung) {
    const y = blick * RAD, ph = (neigung == null ? 10 : neigung) * RAD;
    const F = [Math.sin(y), Math.cos(y)], L = [Math.cos(y), -Math.sin(y)];
    const cp = Math.cos(ph), sp = Math.sin(ph);
    /* Körperraum (l, y, f) → Welt (x, y, z) → Bild (X, Y, Tiefe) */
    const welt = (v) => [v[0] * L[0] + v[2] * F[0], v[1], v[0] * L[1] + v[2] * F[1]];
    const bild = (w) => [w[0], w[1] * cp + w[2] * sp, w[2] * cp - w[1] * sp];
    return { welt, bild, proj: (v) => bild(welt(v)) };
  }

  /* ------------------------------------------------------------------
     7 — KÖRPER AUS QUERSCHNITTEN
     ------------------------------------------------------------------
     Ein Querschnitt: Mitte c, zwei Achsen U (quer) und V (Tiefe) mit den
     Halbmessern a und b. Projiziert ist er eine Ellipse; ihr äußerster
     Punkt quer zur Bildrichtung des Körperteils ergibt den Umriss. */
  function schnitt(c, U, V, a, b) { return { c, U, V, a, b }; }

  function ellipsePunkte(s, n) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = (i / n) * 2 * Math.PI;
      out.push([s.c[0] + s.a * Math.cos(t) * s.U[0] + s.b * Math.sin(t) * s.V[0],
        s.c[1] + s.a * Math.cos(t) * s.U[1] + s.b * Math.sin(t) * s.V[1]]);
    }
    return out;
  }

  /* Projizierte Querschnitte → geschlossener Umriss (Liste von 2D-Punkten). */
  function umriss(ps) {
    const n = ps.length;
    if (n === 1) return ellipsePunkte(ps[0], 18);
    const links = [], rechts = [];
    let gesamt = [ps[n - 1].c[0] - ps[0].c[0], ps[n - 1].c[1] - ps[0].c[1]];
    const gl = Math.hypot(gesamt[0], gesamt[1]);
    let maxR = 0; ps.forEach((s) => { maxR = Math.max(maxR, s.a, s.b); });
    if (gl < maxR * 1.3) return huelle(ps);
    /* Die Richtung, quer zu der der Umriss gesucht wird: die Achse des
       Querschnitts selbst (senkrecht auf seiner Ebene), nicht die Linie
       durch die Mittelpunkte — sonst bekäme ein Kopf, dessen Kinn weiter
       vorn liegt als die Stirn, eine Delle im Gesicht. */
    const tang = [];
    for (let i = 0; i < n; i++) {
      const a = ps[Math.max(0, i - 1)].c, b = ps[Math.min(n - 1, i + 1)].c;
      let t = [b[0] - a[0], b[1] - a[1]]; let l = Math.hypot(t[0], t[1]);
      if (l < 1e-3) { t = gesamt; l = gl; }
      t = [t[0] / l, t[1] / l];
      const T = ps[i].T;
      if (T) {
        const tl = Math.hypot(T[0], T[1]);
        if (tl > 0.35) {
          let q = [T[0] / tl, T[1] / tl];
          if (q[0] * t[0] + q[1] * t[1] < 0) q = [-q[0], -q[1]];
          t = q;
        }
      }
      tang.push(t);
    }
    const hvon = (s, nv) => {
      const u = s.U[0] * nv[0] + s.U[1] * nv[1], v = s.V[0] * nv[0] + s.V[1] * nv[1];
      return Math.sqrt((s.a * u) * (s.a * u) + (s.b * v) * (s.b * v));
    };
    for (let i = 0; i < n; i++) {
      const s = ps[i], t = tang[i], nv = [-t[1], t[0]], h = hvon(s, nv);
      links.push([s.c[0] + nv[0] * h, s.c[1] + nv[1] * h]);
      rechts.push([s.c[0] - nv[0] * h, s.c[1] - nv[1] * h]);
    }
    const kappe = (s, t, vorwaerts) => {
      /* Halbe Ellipse vom einen Rand über die Spitze zum anderen. */
      const pts = [];
      const nv = [-t[1], t[0]];
      const u = s.U[0] * nv[0] + s.U[1] * nv[1], v = s.V[0] * nv[0] + s.V[1] * nv[1];
      const t0 = Math.atan2(s.b * v, s.a * u);
      const dir = vorwaerts ? 1 : -1;
      /* Drehsinn so wählen, dass die Mitte der Kappe in Richtung t liegt. */
      const mitte = t0 - Math.PI / 2;
      const pm = [s.a * Math.cos(mitte) * s.U[0] + s.b * Math.sin(mitte) * s.V[0], s.a * Math.cos(mitte) * s.U[1] + s.b * Math.sin(mitte) * s.V[1]];
      const sgn = (pm[0] * t[0] + pm[1] * t[1]) * dir > 0 ? -1 : 1;
      for (let i = 1; i < 5; i++) {
        const w = t0 + sgn * (i / 5) * Math.PI;
        pts.push([s.c[0] + s.a * Math.cos(w) * s.U[0] + s.b * Math.sin(w) * s.V[0], s.c[1] + s.a * Math.cos(w) * s.U[1] + s.b * Math.sin(w) * s.V[1]]);
      }
      return pts;
    };
    const ende = kappe(ps[n - 1], tang[n - 1], true);
    const anfang = kappe(ps[0], tang[0], false);
    /* ende läuft von links nach rechts, anfang von rechts nach links. */
    const eL = ende[0], eR = ende[ende.length - 1];
    const dl = Math.hypot(eL[0] - links[n - 1][0], eL[1] - links[n - 1][1]);
    const dr = Math.hypot(eR[0] - links[n - 1][0], eR[1] - links[n - 1][1]);
    const endeRichtig = dl <= dr ? ende : ende.slice().reverse();
    const aL = anfang[0];
    const al = Math.hypot(aL[0] - rechts[0][0], aL[1] - rechts[0][1]);
    const ar = Math.hypot(anfang[anfang.length - 1][0] - rechts[0][0], anfang[anfang.length - 1][1] - rechts[0][1]);
    const anfangRichtig = al <= ar ? anfang : anfang.slice().reverse();
    return links.concat(endeRichtig, rechts.reverse(), anfangRichtig);
  }

  function huelle(ps) {
    let pts = [];
    ps.forEach((s) => { pts = pts.concat(ellipsePunkte(s, 12)); });
    return konvex(pts);
  }
  function konvex(pts) {
    pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const kreuz = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const unten = [], oben = [];
    for (const p of pts) { while (unten.length >= 2 && kreuz(unten[unten.length - 2], unten[unten.length - 1], p) <= 0) unten.pop(); unten.push(p); }
    for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (oben.length >= 2 && kreuz(oben[oben.length - 2], oben[oben.length - 1], p) <= 0) oben.pop(); oben.push(p); }
    oben.pop(); unten.pop();
    return unten.concat(oben);
  }

  /* Weicher Pfad durch die Punkte (Catmull-Rom → Bézier). */
  function pfad(pts, offen) {
    /* Catmull-Rom hat stetige Tangenten — der erste Kontrollpunkt jedes
       Stücks ist das Spiegelbild des vorigen. Deshalb reicht ab dem
       zweiten Stück das kurze „S“ (vier Zahlen statt sechs). */
    const n = pts.length;
    if (n < 2) return "";
    const P = (i) => offen ? pts[klemm(i, 0, n - 1)] : pts[(i + n) % n];
    let d = "M" + r1(pts[0][0]) + " " + r1(pts[0][1]);
    const bis = offen ? n - 1 : n;
    for (let i = 0; i < bis; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      if (i === 0 || (offen && i === 0)) {
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
        d += "C" + r1(c1[0]) + " " + r1(c1[1]) + " " + r1(c2[0]) + " " + r1(c2[1]) + " " + r1(p2[0]) + " " + r1(p2[1]);
      } else {
        d += "S" + r1(c2[0]) + " " + r1(c2[1]) + " " + r1(p2[0]) + " " + r1(p2[1]);
      }
    }
    return d + (offen ? "" : "Z");
  }
  /* Punkte etwas ausdünnen: sehr nahe Nachbarn weg (kleinere Pfade). */
  function duenn(pts, min) {
    /* höchstens gut zwanzig Punkte je Umriss — mehr sieht man nicht */
    let umfang = 0;
    for (let i = 1; i < pts.length; i++) umfang += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    min = Math.max(min, umfang / 22);
    const out = [];
    pts.forEach((p) => { const q = out[out.length - 1]; if (!q || Math.hypot(p[0] - q[0], p[1] - q[1]) > min) out.push(p); });
    if (out.length > 3) { const a = out[0], z = out[out.length - 1]; if (Math.hypot(a[0] - z[0], a[1] - z[1]) < min) out.pop(); }
    return out;
  }

  /* ------------------------------------------------------------------
     8 — DER ZEICHNER
     ------------------------------------------------------------------ */
  function zeichne(spec) {
    spec = spec || {};
    const M = massFuer(spec.alter || "erwachsen", spec.geschlecht || "m");
    const P = pose(spec.pose);
    const S = skelett(M, P);
    const blick = spec.blick == null ? 28 : spec.blick;
    const cam = kamera(blick, spec.neigung);
    const id = spec.id || "m" + Math.floor(Math.random() * 1e6).toString(36);
    let gz = 0;
    const defs = [];
    const hautF = HAUT[spec.haut] || HAUT.hell;
    const haarF = HAAR[spec.haarfarbe] || HAAR.braun;
    const g = M.g, f = M.fuelle;
    const kl = spec.kleidung || {};
    const stueck = (platz) => { const w = kl[platz]; return w && w.stueck && w.stueck !== "nichts" && w.stueck !== "barfuss" ? w : null; };
    const zub = stueck("zubehoer");

    /* Alle Querschnitte zuerst im Körperraum sammeln, dann projizieren.
       teile: { name, tiefe, schnitte[], farbe, art, extra } */
    const teile = [];
    const V3 = (R, v) => mv(R, v);

    /* Querschnittsreihe entlang eines Knochens. prof: [s, a, b, vOff, uOff] */
    function knochen(A, R, laenge, prof, skal) {
      const U = V3(R, [1, 0, 0]), Vv = V3(R, [0, 0, 1]), T = V3(R, [0, 1, 0]);
      skal = skal || 1;
      return prof.map((q) => schnitt(
        add(add(add(A, mul(T, q[0] * laenge)), mul(Vv, (q[3] || 0) * g)), mul(U, (q[4] || 0) * g)),
        U, Vv, q[1] * g * skal, q[2] * g * skal));
    }
    const aufblasen = (ss, d, von, bis) => ss.filter((s, i) => (von == null || i >= von) && (bis == null || i <= bis))
      .map((s) => schnitt(s.c, s.U, s.V, s.a + d, s.b + d));

    /* --- Rumpf ----------------------------------------------------- */
    /* [Höhe über dem Hüftgelenk in cm (Erwachsener), a, b, vor] — Frau
       und Mann getrennt: Taille, Hüfte, Brustkorb, Schulterlinie. */
    const RUMPF_M = [
      [-9, 7.5, 5.5, -2.6], [-5, 15.8, 9.8, -2.6], [0, 17.2, 10.6, -1.8], [6, 16.4, 10.6, -0.2],
      [13, 14.9, 10.0, 0.5], [20, 15.4, 10.3, 0.6], [28, 16.6, 11.2, 0.9], [36, 17.6, 11.2, 0.8],
      [43, 18.4, 10.4, 0], [48.5, 18.2, 9.3, -0.4], [52, 14.5, 7.8, -0.6], [55, 9.0, 6.4, -0.6], [58, 6.2, 5.4, -0.6],
    ];
    const RUMPF_W = [
      [-9, 8, 5.8, -3.0], [-5, 17.6, 10.6, -3.0], [0, 18.4, 11.0, -2.2], [6, 16.4, 10.4, -0.6],
      [13, 13.2, 9.2, 0.4], [20, 13.8, 9.6, 0.8], [26, 14.8, 11.0, 1.8], [31, 15.4, 10.8, 1.6],
      [37, 15.8, 9.8, 0.6], [43, 16.4, 9.2, -0.2], [48, 16.2, 8.4, -0.5], [51.5, 12.8, 7.2, -0.6], [54.5, 8.0, 5.8, -0.6], [57, 5.6, 5.0, -0.6],
    ];
    const rumpfTab = (M.w && M.erw) ? RUMPF_W : RUMPF_M;
    const bauch = spec.alter === "alt" ? 1.8 : (M.erw ? 0 : 0.6);
    function rumpfSchnitte(tab, dicke, obenBis) {
      const yL = M.lendeY, yB = M.brustY;
      const out = [];
      tab.forEach((q) => {
        const hy = q[0] * M.k;
        if (obenBis != null && hy > obenBis) return;
        const rest = [0, -hy, q[3] * M.k + (hy > 4 * M.k && hy < 22 * M.k ? bauch * M.k : 0)];
        /* Welcher Rahmen? Nahe den Gelenken weich überblendet. */
        const frame = (J, rest0, R) => ({ c: add(J.p, mv(R, sub(rest, rest0))), R });
        const fB = frame(S.becken, [0, 0, 0], S.becken.R);
        const fL = frame(S.lende, [0, -yL, -0.8 * M.k], S.lende.R);
        const fC = frame(S.brust, [0, -yB, -0.2 * M.k], S.brust.R);
        const w1 = glatt((hy - (yL - 5 * M.k)) / (10 * M.k));
        const w2 = glatt((hy - (yB - 6 * M.k)) / (12 * M.k));
        let c = lerp3(fB.c, fL.c, w1); c = lerp3(c, fC.c, w2);
        const U = unit(lerp3(lerp3(mv(fB.R, [1, 0, 0]), mv(fL.R, [1, 0, 0]), w1), mv(fC.R, [1, 0, 0]), w2));
        const Vv = unit(lerp3(lerp3(mv(fB.R, [0, 0, 1]), mv(fL.R, [0, 0, 1]), w1), mv(fC.R, [0, 0, 1]), w2));
        const breit = (M.erw ? 1 : 0.94) * f;
        out.push(schnitt(c, U, Vv, q[1] * M.k * breit + dicke, q[2] * M.k * breit * (M.erw ? 1 : 1.05) + dicke));
      });
      return out;
    }

    /* --- Profile der Gliedmaßen (Erwachsener, cm) --------------------- */
    const OA = [[-0.13, 2.4, 2.8, -0.3], [-0.06, 4.7, 5.0, -0.2], [0.07, 5.4, 5.4, 0], [0.3, 4.6, 5.0, 0.1], [0.62, 4.1, 4.3, -0.1], [0.92, 3.6, 3.7, -0.2], [1.04, 3.3, 3.5, -0.3]];
    const UA = [[-0.05, 3.3, 3.5, -0.3], [0.18, 3.9, 4.1, 0.1], [0.5, 3.1, 3.3, 0.1], [0.85, 2.1, 2.9, 0], [1.0, 1.9, 2.8, 0]];
    const OS = [[-0.04, 8.2, 8.6, 0.4], [0.18, 8.0, 8.4, 0.9], [0.55, 6.5, 7.0, 0.7], [0.86, 5.2, 5.4, 0.3], [1.0, 4.9, 5.2, 0.3], [1.05, 4.6, 4.8, 0.2]];
    const US = [[-0.05, 4.6, 4.8, 0.3], [0.04, 4.8, 5.1, 0.3], [0.24, 5.0, 5.8, -1.5], [0.5, 4.1, 4.5, -0.8], [0.84, 2.9, 3.0, 0], [1.0, 2.9, 3.2, 0]];
    const kindArm = M.erw ? 1 : 1.08;
    const frauArm = M.w ? 0.88 : 1;
    const frauBein = M.w ? 1.02 : 1;

    const tiefeVon = (ss) => { let t = 0; ss.forEach((s) => { t += cam.proj(s.c)[2]; }); return t / ss.length; };

    /* ---- Beine, Füße ---- */
    const hose = stueck("unterteil"), schuhe = stueck("schuhe");
    /* Im Kleid-Platz kann auch die Schürze liegen — sie ist kein Kleid. */
    const kleid = stueck("kleid") && KLEID[stueck("kleid").stueck] ? stueck("kleid") : null;
    const hoseArt = hose ? HOSE[hose.stueck] || HOSE.hose : null;
    ["L", "R"].forEach((sd) => {
      const H = S["huefte" + sd], K = S["knie" + sd], Fu = S["fuss" + sd];
      const os = knochen(H.p, H.R, M.oberschenkel, OS, f * frauBein);
      const us = knochen(K.p, K.R, M.unterschenkel, US, f);
      const t = (tiefeVon(os) + tiefeVon(us)) / 2;
      /* Fuß: vom Fersenrand zur Zehenspitze, im Rahmen des Sprunggelenks. */
      const fl = M.fuss, fh = M.knoechel;
      /* Der Fuß: Sohle flach auf dem Boden, Ferse hinten, der Rist steigt
         zum Sprunggelenk an. [Anteil der Länge, halbe Breite, Höhe über
         der Sohle] beim Erwachsenen, in cm. */
      const FU = [[0, 3.0, 5.2], [0.1, 3.3, 6.9], [0.3, 3.8, 6.3], [0.55, 4.3, 4.3], [0.74, 4.7, 3.0], [0.9, 4.3, 2.5], [1, 3.2, 1.8]];
      const fT = V3(Fu.R, [0, 0, 1]), fU = V3(Fu.R, [1, 0, 0]), fV = V3(Fu.R, [0, -1, 0]);
      const sohle = add(Fu.p, mul(V3(Fu.R, [0, 1, 0]), fh));
      const ferse = add(sohle, mul(fT, -fl * 0.24));
      const hoch = fh / 7.6;
      const fussS = FU.map((q) => schnitt(add(add(ferse, mul(fT, q[0] * fl)), mul(fV, q[2] * hoch / 2)), fU, fV, q[1] * g * f, q[2] * hoch / 2));
      teile.push({ name: "bein" + sd, tiefe: t, glied: [
        { ss: os, art: "haut" }, { ss: us, art: "haut" },
      ], fuss: fussS, seite: sd, oberschenkel: os, unterschenkel: us });
    });

    /* ---- Arme, Hände ---- */
    ["L", "R"].forEach((sd) => {
      const Sh = S["schulter" + sd], E = S["ellbogen" + sd], Hd = S["hand" + sd];
      const oa = knochen(Sh.p, Sh.R, M.oberarm, OA, f * frauArm * kindArm);
      const ua = knochen(E.p, E.R, M.unterarm, UA, f * frauArm * kindArm);
      teile.push({ name: "arm" + sd, tiefe: (tiefeVon(oa) + tiefeVon(ua)) / 2, oberarm: oa, unterarm: ua, hand: Hd, seite: sd });
    });

    /* ---- Rumpf, Hals, Kopf ---- */
    const rumpf = rumpfSchnitte(rumpfTab, 0);
    const halsR = S.hals.R;
    const HALS = [[0, 6.0, 5.6, -0.6], [0.5, 5.2, 5.2, 0.2], [1.0, 5.0, 5.2, 0.8]];
    const halsLaenge = len(sub(S.kopf.basis, S.hals.p)) + 1.5 * M.k;
    const halsS = HALS.map((q) => schnitt(add(add(S.hals.p, mul(unit(sub(S.kopf.basis, S.hals.p)), q[0] * halsLaenge)), mul(mv(halsR, [0, 0, 1]), q[3] * M.k)),
      mv(halsR, [1, 0, 0]), mv(halsR, [0, 0, 1]), q[1] * (M.kopf / 23.7) * (M.w ? 0.9 : 1) * f, q[2] * (M.kopf / 23.7) * (M.w ? 0.92 : 1) * f));

    /* ================================================================
       ZEICHNEN: Umrisse, Schatten, Farben
       ================================================================ */
    const anker = (() => {
      /* Der Boden liegt unter dem tiefsten Punkt der Figur. */
      let boden = -1e9;
      const alle = [];
      teile.forEach((t) => {
        if (t.glied) t.glied.forEach((q) => q.ss.forEach((s) => alle.push(s)));
        if (t.fuss) t.fuss.forEach((s) => alle.push(s));
        if (t.oberarm) t.oberarm.concat(t.unterarm).forEach((s) => alle.push(s));
      });
      rumpf.forEach((s) => alle.push(s));
      alle.push(schnitt(S.kopf.p, [1, 0, 0], [0, 0, 1], M.kopf * 0.36, M.kopf * 0.45));
      ["L", "R"].forEach((sd) => alle.push(schnitt(add(S["hand" + sd].p, mul(mv(S["hand" + sd].R, [0, 1, 0]), M.hand * 0.5)), [1, 0, 0], [0, 0, 1], 1.5 * g, 1.5 * g)));
      alle.forEach((s) => {
        const w = cam.welt(s.c), Uw = cam.welt(s.U), Vw = cam.welt(s.V);
        const h = Math.sqrt((s.a * Uw[1]) ** 2 + (s.b * Vw[1]) ** 2);
        boden = Math.max(boden, w[1] + h);
      });
      const bw = cam.welt(S.becken.p);
      return [bw[0], boden, bw[2]];
    })();
    const pr = (v) => { const w = cam.welt(v); const q = cam.bild([w[0] - anker[0], w[1] - anker[1], w[2] - anker[2]]); return spec.spiegel ? [-q[0], q[1], q[2]] : q; };
    const prRichtung = (v) => { const q = cam.bild(cam.welt(v)); return spec.spiegel ? [-q[0], q[1], q[2]] : q; };
    const kreuz3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const proj = (ss) => ss.map((s) => ({ c: pr(s.c), U: prRichtung(s.U), V: prRichtung(s.V), T: prRichtung(kreuz3(s.U, s.V)), a: s.a, b: s.b }));
    const LICHT = spec.spiegel ? [0.55, -0.83] : [-0.55, -0.83];

    function verlauf(pts2, grund, opt) {
      /* Licht von links oben: Verlauf quer über die breiteste Stelle. */
      opt = opt || {};
      let cx = 0, cy = 0; pts2.forEach((p) => { cx += p[0]; cy += p[1]; }); cx /= pts2.length; cy /= pts2.length;
      let best = null, bd = -1e9, worst = null, wd = 1e9;
      pts2.forEach((p) => { const d = (p[0] - cx) * LICHT[0] + (p[1] - cy) * LICHT[1]; if (d > bd) { bd = d; best = p; } if (d < wd) { wd = d; worst = p; } });
      const gid = id + "g" + (gz++);
      const hell = opt.hell == null ? 0.2 : opt.hell, dunkel = opt.dunkel == null ? 0.2 : opt.dunkel;
      defs.push('<linearGradient id="' + gid + '" gradientUnits="userSpaceOnUse" x1="' + r1(best[0]) + '" y1="' + r1(best[1]) + '" x2="' + r1(worst[0]) + '" y2="' + r1(worst[1]) + '">'
        + '<stop offset="0" stop-color="' + heller(grund, hell) + '"/><stop offset=".38" stop-color="' + grund + '"/>'
        + '<stop offset=".82" stop-color="' + dunkler(grund, dunkel) + '"/><stop offset="1" stop-color="' + dunkler(grund, dunkel * 1.5) + '"/></linearGradient>');
      return "url(#" + gid + ")";
    }
    let letzteFuellung = null;
    function form(ss, grund, opt) {
      opt = opt || {};
      const pts = duenn(opt.huelle ? huelle(proj(ss)) : umriss(proj(ss)), 0.75 * Math.max(g, 0.5));
      if (pts.length < 3) return "";
      const fill = opt.flach ? grund : verlauf(pts, grund, opt);
      letzteFuellung = fill;
      const kontur = opt.kontur || dunkler(grund, 0.34);
      return '<path d="' + pfad(pts) + '" fill="' + fill + '" stroke="' + kontur + '" stroke-width="' + r1(opt.strich || 0.32 * Math.max(g, 0.55)) + '" stroke-linejoin="round"' + (opt.extra || "") + "/>";
    }
    function formPunkte(pts, grund, opt) {
      opt = opt || {};
      pts = duenn(pts, 0.75 * Math.max(g, 0.5));
      if (pts.length < 3) return "";
      const fill = opt.flach ? grund : verlauf(pts, grund, opt);
      return '<path d="' + pfad(pts) + '" fill="' + fill + '" stroke="' + (opt.kontur || dunkler(grund, 0.34)) + '" stroke-width="' + r1(opt.strich || 0.32 * Math.max(g, 0.55)) + '" stroke-linejoin="round"/>';
    }
    const linie = (pts, farbe, breite, extra) => '<path d="' + pfad(pts.map((p) => [p[0], p[1]]), true) + '" fill="none" stroke="' + farbe + '" stroke-width="' + r1(breite) + '" stroke-linecap="round" stroke-linejoin="round"' + (extra || "") + "/>";
    const sichtbar = (normal) => prRichtung(normal)[2];

    /* --- Farben der Kleidung ------------------------------------------ */
    const stoff = (w, standard) => farbwert(w && w.farbe, (STUECK_FARBE[w && w.stueck]) || standard);

    /* ---- Hand ---- */
    function hand(Hd, sd, tiefe) {
      const links = sd === "L";
      const R = Hd.R, L0 = M.hand;
      const T = mv(R, [0, 1, 0]), Vv = mv(R, [0, 0, 1]), U = mv(R, [1, 0, 0]);
      const innen = links ? mul(U, -1) : U;             // Handfläche zeigt zum Körper
      const fingerKurve = Hd.finger;
      const zeig = fingerKurve === "zeigen";
      const kr = zeig ? 0.85 : (fingerKurve == null ? 0.35 : fingerKurve);
      const breite = 4.1 * g * (M.w ? 0.9 : 1) * (M.erw ? 1 : 1.1);
      const hs = [[0, 1.6, 2.6], [0.45, 1.5, breite * 0.95 / g], [1, 1.3, breite / g]];
      const palm = hs.map((q) => schnitt(add(Hd.p, mul(T, q[0] * L0 * 0.5)), U, Vv, q[1] * g, q[2] * g));
      const handschuh = zub && zub.stueck === "handschuhe";
      const farbe = handschuh ? stoff(zub, "#5a4636") : hautF;
      let out = form(palm, farbe, { hell: 0.14, dunkel: 0.16 });
      const fl = L0 * 0.47, fb = 1.0 * g * (M.w ? 0.88 : 1) * (M.erw ? 1 : 1.12);
      const finger = [];
      const lage = [0.72, 0.24, -0.24, -0.7];
      const laengen = [0.93, 1.03, 0.97, 0.78];
      const knoechel = add(Hd.p, mul(T, L0 * 0.5));
      lage.forEach((q, i) => {
        let p = add(knoechel, mul(Vv, q * breite * 0.8));
        let d = unit(add(T, mul(Vv, q * -0.04)));
        const c = zeig ? (i === 0 ? 0.05 : 1) : kr * (1 - i * 0.04 + (i === 3 ? 0.12 : 0));
        const pts = [p];
        [0.46, 0.3, 0.24].forEach((anteil, j) => {
          const w = c * [34, 50, 34][j] * RAD;
          d = unit(add(mul(d, Math.cos(w)), mul(innen, Math.sin(w))));
          p = add(p, mul(d, fl * laengen[i] * anteil));
          pts.push(p);
        });
        finger.push({ pts, tiefe: pr(pts[2])[2] });
      });
      /* Daumen */
      const db = add(add(Hd.p, mul(T, L0 * 0.2)), add(mul(Vv, breite * 0.78), mul(innen, 0.7 * g)));
      let dd = unit(add(add(mul(T, 0.85), mul(Vv, 0.3)), mul(innen, 0.25 + kr * 0.35)));
      const dpts = [db];
      let dp = db;
      [0.2, 0.17, 0.13].forEach((anteil, j) => {
        dp = add(dp, mul(dd, L0 * anteil));
        dpts.push(dp);
        const w = (kr * 30 + 8) * RAD;
        dd = unit(add(mul(dd, Math.cos(w)), mul(innen, Math.sin(w))));
      });
      finger.push({ pts: dpts, tiefe: pr(dpts[1])[2], daumen: true });
      const palmT = pr(add(Hd.p, mul(T, L0 * 0.3)))[2];
      const fz = (fi) => {
        const pp = fi.pts.map((q) => pr(q));
        const b = fi.daumen ? fb * 1.22 : fb;
        return linie(pp, dunkler(farbe, 0.36), b * 2 + 0.34 * g) + linie(pp, farbe, b * 2)
          ;
      };
      const hinten = finger.filter((fi) => fi.tiefe < palmT).sort((a, b) => a.tiefe - b.tiefe);
      const vorn = finger.filter((fi) => fi.tiefe >= palmT).sort((a, b) => a.tiefe - b.tiefe);
      out = hinten.map(fz).join("") + out + vorn.map(fz).join("");
      return out;
    }

    /* ---- Muskelbild (Anatomietafel „Die Muskeln“) ----
       Rumpf und Glieder in Muskelrot, darauf die großen Muskeln als
       Felder mit Faserrichtung; Kopf, Hals, Hände und Füße bleiben Haut. */
    const MUSKEL = "#b5433d", MUSKEL_H = "#cc5a50", MUSKEL_R = "#7a2520", SEHNE = "#efe6d2";
    const koerperF = spec.muskeln ? MUSKEL : hautF;
    const gliedOrt = (ss, s, winkel) => {
      const f = klemm(s, 0, 1) * (ss.length - 1), i = Math.min(ss.length - 2, Math.floor(f)), t = f - i;
      const a = ss[i], b = ss[i + 1];
      const c = lerp3(a.c, b.c, t), U = unit(lerp3(a.U, b.U, t)), V = unit(lerp3(a.V, b.V, t));
      const ra = lerp(a.a, b.a, t), rb = lerp(a.b, b.b, t), w = winkel * RAD;
      return { p: add(add(c, mul(U, ra * Math.cos(w) * 1.02)), mul(V, rb * Math.sin(w) * 1.02)), n: unit(add(mul(U, Math.cos(w) / ra), mul(V, Math.sin(w) / rb))) };
    };
    /* Ein Muskelfeld auf einem Glied: von s0 bis s1, um den Winkel mitte
       herum mit halber Breite hb (Grad); spindelförmig. */
    function muskelFeld(ss, s0, s1, mitte, hb, farbe, fasern) {
      const n = 7, links = [], rechts = [];
      let sicht = 0;
      for (let i = 0; i <= n; i++) {
        const s0i = s0 + (s1 - s0) * i / n, form = Math.sin(Math.PI * (0.12 + 0.76 * i / n));
        const a = gliedOrt(ss, s0i, mitte - hb * form), b = gliedOrt(ss, s0i, mitte + hb * form);
        links.push(a); rechts.push(b); sicht += sichtbar(gliedOrt(ss, s0i, mitte).n);
      }
      if (sicht / (n + 1) < 0.05) return "";
      const pts = links.map((q) => pr(q.p)).concat(rechts.reverse().map((q) => pr(q.p)));
      let out = '<path d="' + pfad(duenn(pts, 0.4 * g)) + '" fill="' + (farbe || MUSKEL_H) + '" stroke="' + MUSKEL_R + '" stroke-width="' + r1(0.3 * g) + '" stroke-linejoin="round" opacity=".95"/>';
      for (let k = 1; k < (fasern || 4); k++) {
        const w = mitte - hb * 0.8 + (2 * hb * 0.8) * k / (fasern || 4);
        const linie2 = [];
        for (let i = 1; i < n; i++) linie2.push(pr(gliedOrt(ss, s0 + (s1 - s0) * i / n, mitte + (w - mitte) * Math.sin(Math.PI * (0.12 + 0.76 * i / n))).p));
        out += linie(linie2, "#e27e73", 0.22 * g, ' opacity=".6"');
      }
      return out;
    }
    const sehne = (ss, s0, s1, mitte, hb) => muskelFeld(ss, s0, s1, mitte, hb, SEHNE, 2);

    /* ---- Zeichenaufträge ---- */
    const auftraege = [];   // { tiefe, svg }
    let kragenLage = "";

    /* Beine mit Hose / Rock / Schuhen */
    teile.filter((t) => t.name.indexOf("bein") === 0).forEach((t) => {
      let svg = "";
      const os = t.oberschenkel, us = t.unterschenkel;
      const langeHose = hoseArt && hoseArt.lang;
      const kurzeHose = hoseArt && !hoseArt.lang;
      /* Haut, soweit sie zu sehen ist */
      const strumpf = (M.w && kleid && KLEID[kleid.stueck] && KLEID[kleid.stueck].strumpf) ? "#c9a58c" : null;
      if (!langeHose) {
        svg += form(os, koerperF) + form(us, strumpf || koerperF);
        if (spec.muskeln) {
          const aus = t.seite === "L" ? 0 : 180;          // Winkel der Außenseite
          const vorn = 90, hinten = -90;
          svg += muskelFeld(os, 0.06, 0.92, vorn, 62, null, 5);                                   // Oberschenkelmuskel
          svg += muskelFeld(os, 0.1, 0.88, hinten, 55, "#b84a42", 4);                            // Beinbeuger
          svg += muskelFeld(us, 0.08, 0.78, vorn + (aus === 0 ? -35 : 35), 24, null, 2);           // Schienbeinmuskel
          svg += muskelFeld(us, 0.02, 0.62, hinten, 72, "#c4524a", 4);                            // Wadenmuskel
          svg += sehne(us, 0.66, 1, hinten, 18);                                                  // Achillessehne
          svg += sehne(os, 0.9, 1.0, vorn, 30);                                                   // Kniesehne
        }
        /* Kniescheibe, wenn das Knie zu sehen ist */
        const Kn = S["knie" + t.seite], kv = mv(Kn.R, [0, 0, 1]);
        if (sichtbar(kv) > 0.25) {
          const q = { c: pr(add(Kn.p, add(mul(kv, 4.2 * g), mul(mv(Kn.R, [0, 1, 0]), -0.5 * g)))), U: prRichtung(mv(Kn.R, [1, 0, 0])), V: prRichtung(mv(Kn.R, [0, 1, 0])), a: 2.3 * g, b: 2.7 * g };
          svg += '<path d="' + pfad(ellipsePunkte(q, 12)) + '" fill="' + heller(strumpf || hautF, 0.1) + '" stroke="' + dunkler(strumpf || hautF, 0.25) + '" stroke-width="' + r1(0.2 * g) + '" opacity=".75"/>';
        }
      }
      else svg += form(os.slice(0, 2), hautF);
      if (hoseArt) {
        const farbe = stoff(hose, "#3b4d6b");
        if (langeHose) {
          svg += form(aufblasen(os, 0.9 * g), farbe, { hell: 0.16, dunkel: 0.24 });
          const unten = aufblasen(us, 1.0 * g).map((s, i, arr) => i === arr.length - 1 ? schnitt(s.c, s.U, s.V, s.a + 0.9 * g, s.b + 0.9 * g) : s);
          svg += form(unten, farbe, { hell: 0.16, dunkel: 0.24 });
          /* Bügelfalte bzw. Naht vorn */
          const knieP = pr(add(S["knie" + t.seite].p, mul(mv(S["knie" + t.seite].R, [0, 0, 1]), 5.6 * g)));
          const huefteP = pr(add(S["huefte" + t.seite].p, add(mul(mv(S["huefte" + t.seite].R, [0, 1, 0]), 8 * g), mul(mv(S["huefte" + t.seite].R, [0, 0, 1]), 8.8 * g))));
          if (sichtbar(mv(S["knie" + t.seite].R, [0, 0, 1])) > 0.1) svg += linie([huefteP, knieP], dunkler(farbe, 0.2), 0.3 * g, ' opacity=".6"');
        } else {
          const bis = hoseArt.bis;   // Anteil des Oberschenkels
          const ss = os.filter((s, i) => i <= 2 || bis > 0.7);
          svg += form(aufblasen(ss.slice(0, bis > 0.4 ? 3 : 2), 0.9 * g), farbe, { hell: 0.16, dunkel: 0.24 });
        }
      }
      /* Fuß oder Schuh */
      const fussArt = schuhe ? SCHUH[schuhe.stueck] || SCHUH.halbschuh : null;
      if (!fussArt || fussArt.offen) {
        svg += form(t.fuss, hautF, { hell: 0.12, huelle: sichtbar(mv(S["fuss" + t.seite].R, [0, 0, 1])) > 0.5 });
        /* Zehen: fünf, der große innen — nur wenn man auf die Fußspitze schaut */
        const Fu = S["fuss" + t.seite];
        const fT = mv(Fu.R, [0, 0, 1]), fU = mv(Fu.R, [1, 0, 0]), fV = mv(Fu.R, [0, -1, 0]);
        if (sichtbar(fT) > 0.3) {
          const spitze = t.fuss[t.fuss.length - 1];
          const innen = t.seite === "L" ? -1 : 1;
          const zehen = [[1.9, 1.05], [0.75, 0.8], [-0.2, 0.72], [-1.05, 0.66], [-1.85, 0.58]].map((z, n) => {
            const c = add(add(add(spitze.c, mul(fT, (0.6 - n * 0.3) * g)), mul(fU, innen * z[0] * 1.1 * g)), mul(fV, 0.1 * g));
            return { c: pr(c), r: z[1] * g };
          }).sort((a, b) => a.c[2] - b.c[2]);
          zehen.forEach((z) => {
            svg += '<ellipse cx="' + r1(z.c[0]) + '" cy="' + r1(z.c[1]) + '" rx="' + r1(z.r) + '" ry="' + r1(z.r * 0.8) + '" fill="' + hautF + '" stroke="' + dunkler(hautF, 0.3) + '" stroke-width="' + r1(0.16 * g) + '"/>';
          });
        }
      }
      if (fussArt) {
        const farbe = stoff(schuhe, "#4a3326");
        const sohle = t.fuss.map((s) => schnitt(s.c, s.U, s.V, s.a + 0.55 * g, s.b + 0.55 * g));
        if (fussArt.offen) {
          /* Sandale: Riemen über dem Rist */
          const rist = pr(t.fuss[2].c);
          svg += '<ellipse cx="' + r1(rist[0]) + '" cy="' + r1(rist[1] - 1.2 * g) + '" rx="' + r1(2.6 * g) + '" ry="' + r1(1.1 * g) + '" fill="' + farbe + '"/>';
        } else {
          svg += form(sohle, farbe, { hell: 0.22, dunkel: 0.26, huelle: sichtbar(mv(S["fuss" + t.seite].R, [0, 0, 1])) > 0.5 });
          if (fussArt.schaft) {
            const hoch = knochen(S["knie" + t.seite].p, S["knie" + t.seite].R, M.unterschenkel, [[fussArt.schaft, 5.2, 5.6, -0.3], [0.84, 3.9, 4.0, 0], [1.0, 3.9, 4.2, 0]], f);
            svg += form(hoch, farbe, { hell: 0.2, dunkel: 0.26 });
          }
          /* Sohle als dunkler Rand unten */
          const unterkante = t.fuss.map((s) => pr(add(s.c, mul(s.V, -(s.b + 0.5 * g)))));
          const vonVorn = sichtbar(mv(S["fuss" + t.seite].R, [0, 0, 1])) > 0.6;
          if (!vonVorn) {
            svg += linie(unterkante, fussArt.sohle || dunkler(farbe, 0.5), 0.9 * g);
            if (fussArt.weiss) svg += linie(unterkante, "#f3f1ec", 0.55 * g);
          }
          if (fussArt.schnuerung) {
            const a = pr(add(t.fuss[1].c, mul(t.fuss[1].V, t.fuss[1].b + 0.4 * g))), b = pr(add(t.fuss[2].c, mul(t.fuss[2].V, t.fuss[2].b + 0.4 * g)));
            svg += linie([a, b], heller(farbe, 0.45), 0.35 * g, ' stroke-dasharray="' + r1(0.5 * g) + " " + r1(0.6 * g) + '"');
          }
        }
      }
      auftraege.push({ tiefe: t.tiefe, svg, bein: true, seite: t.seite });
    });

    /* Arme mit Ärmeln */
    const oben = stueck("oberteil"), jacke = stueck("jacke");
    const aermelVon = (w) => (w ? (OBERTEIL[w.stueck] || JACKE[w.stueck] || KLEID[w.stueck] || {}).aermel : 0) || 0;
    const aermel = Math.max(aermelVon(oben), aermelVon(kleid), aermelVon(jacke));
    const aermelFarbe = jacke && aermelVon(jacke) ? stoff(jacke, "#444455") : (oben && aermelVon(oben) ? stoff(oben, "#c8c8c8") : (kleid ? stoff(kleid, "#c55") : null));
    teile.filter((t) => t.name.indexOf("arm") === 0).forEach((t) => {
      let svg = form(t.oberarm, koerperF) + form(t.unterarm, koerperF);
      if (spec.muskeln) {
        const aus = t.seite === "L" ? 0 : 180;
        svg += muskelFeld(t.oberarm, 0.2, 0.9, 90, 48, null, 3);                                  // Bizeps
        svg += muskelFeld(t.oberarm, 0.15, 0.9, -90, 55, "#b84a42", 3);                           // Trizeps
        svg += muskelFeld(t.oberarm, 0.0, 0.45, aus, 95, "#c85a50", 5);                           // Deltamuskel
        svg += muskelFeld(t.unterarm, 0.05, 0.8, 90, 70, null, 4) + muskelFeld(t.unterarm, 0.05, 0.8, -90, 70, "#b84a42", 4);
        svg += sehne(t.unterarm, 0.8, 1, 90, 50) + sehne(t.unterarm, 0.8, 1, -90, 50);
      }
      if (aermel > 0 && aermelFarbe) {
        const ober = aufblasen(t.oberarm, 0.9 * g);
        if (aermel >= 1) {
          svg += form(ober, aermelFarbe, { hell: 0.18, dunkel: 0.24 });
          const bis = aermel >= 2 ? t.unterarm.length - 1 : 2;
          svg += form(aufblasen(t.unterarm.slice(0, bis + 1), 0.8 * g), aermelFarbe, { hell: 0.18, dunkel: 0.24 });
          if (aermel >= 2) {
            const e = t.unterarm[t.unterarm.length - 2];
            const bund = ellipsePunkte({ c: pr(e.c), U: prRichtung(e.U), V: prRichtung(e.V), a: e.a + 0.9 * g, b: e.b + 0.9 * g }, 14);
            svg += '<path d="' + pfad(bund) + '" fill="none" stroke="' + dunkler(aermelFarbe, 0.3) + '" stroke-width="' + r1(0.3 * g) + '" opacity=".7"/>';
          }
        } else {
          svg += form(ober.slice(0, 3), aermelFarbe, { hell: 0.18, dunkel: 0.24 });
        }
      }
      svg += hand(t.hand, t.seite, t.tiefe);
      if (zub && t.seite === (P.traghand || "R")) svg += zubehoerInHand(zub, t.hand);
      auftraege.push({ tiefe: t.tiefe, svg, arm: true, seite: t.seite });
    });

    /* Rumpf mit Oberteil, Kleid, Jacke, Schürze */
    let rumpfSvg = form(rumpf, koerperF, { hell: 0.14, dunkel: 0.2 });
    /* Die Oberfläche des Rumpfs: Schlüsselbeine, Brustmuskel, Nabel,
       Wirbelsäule, Schulterblätter — zart, wie im Anatomiebuch. Kleidung
       wird danach gezeichnet und deckt ab, was bedeckt ist. */
    rumpfSvg += (function () {
      const ort = (y, u, vorn) => {
        let i = 0;
        while (i < rumpfTab.length - 2 && rumpfTab[i + 1][0] < y) i++;
        const t = klemm((y - rumpfTab[i][0]) / (rumpfTab[i + 1][0] - rumpfTab[i][0]), 0, 1);
        const a0 = rumpf[i], a1 = rumpf[i + 1];
        const c = lerp3(a0.c, a1.c, t), Uu = unit(lerp3(a0.U, a1.U, t)), Vv = unit(lerp3(a0.V, a1.V, t));
        const ra = lerp(a0.a, a1.a, t), rb = lerp(a0.b, a1.b, t), w = Math.sqrt(Math.max(0, 1 - u * u));
        return { p: add(add(c, mul(Uu, u * ra)), mul(Vv, vorn * rb * w)), n: unit(add(mul(Uu, u / ra), mul(Vv, vorn * w / rb))) };
      };
      const zug = (liste, vorn, farbe, breite, deck) => {
        const o = liste.map((q) => ort(q[0], q[1], vorn));
        const sicht = o.reduce((a, q) => a + sichtbar(q.n), 0) / o.length;
        if (sicht < 0.18) return "";
        return linie(o.map((q) => pr(q.p)), farbe, breite, ' opacity="' + (deck * klemm(sicht * 1.4, 0, 1)).toFixed(2) + '"');
      };
      const d = dunkler(hautF, 0.3);
      let out = "";
      const mann = !M.w && M.erw;
      if (spec.muskeln) {
        /* Rumpfmuskeln als Felder auf der Oberfläche */
        const feld = (liste, vorn, farbe, fasernVon, fasernBis) => {
          const o = liste.map((q) => ort(q[0], q[1], vorn));
          const sicht = o.reduce((a, q) => a + sichtbar(q.n), 0) / o.length;
          if (sicht < 0.1) return "";
          let f = '<path d="' + pfad(o.map((q) => pr(q.p))) + '" fill="' + (farbe || MUSKEL_H) + '" stroke="' + MUSKEL_R + '" stroke-width="' + r1(0.3 * g) + '" stroke-linejoin="round"/>';
          if (fasernVon) for (let k = 1; k < 5; k++) {
            const t = k / 5;
            const a = ort(lerp(fasernVon[0][0], fasernVon[1][0], t), lerp(fasernVon[0][1], fasernVon[1][1], t), vorn);
            const b = ort(lerp(fasernBis[0][0], fasernBis[1][0], t), lerp(fasernBis[0][1], fasernBis[1][1], t), vorn);
            f += linie([pr(a.p), pr(b.p)], "#e27e73", 0.22 * g, ' opacity=".55"');
          }
          return f;
        };
        let mu = "";
        [1, -1].forEach((sg) => {
          /* großer Brustmuskel */
          mu += feld([[48, sg * 0.1], [48.5, sg * 0.55], [45, sg * 0.93], [38, sg * 0.86], [31.5, sg * 0.58], [29.5, sg * 0.12]], 1, null, [[47, sg * 0.15], [31, sg * 0.15]], [[46, sg * 0.9], [40, sg * 0.88]]);
          /* äußerer schräger Bauchmuskel */
          mu += feld([[29, sg * 0.62], [27, sg * 0.97], [10, sg * 0.99], [2, sg * 0.75], [6, sg * 0.4], [24, sg * 0.38]], 1, "#bf4f47", [[28, sg * 0.9], [10, sg * 0.95]], [[22, sg * 0.42], [5, sg * 0.45]]);
          /* Kapuzenmuskel (hinten oben) */
          mu += feld([[57, sg * 0.02], [55, sg * 0.5], [51, sg * 0.95], [45, sg * 0.62], [36, sg * 0.28], [28, sg * 0.03]], -1, null, [[56, sg * 0.05], [30, sg * 0.05]], [[52, sg * 0.9], [44, sg * 0.6]]);
          /* breiter Rückenmuskel */
          mu += feld([[38, sg * 0.88], [31, sg * 0.98], [16, sg * 0.72], [6, sg * 0.12], [24, sg * 0.1], [32, sg * 0.4]], -1, "#bf4f47", [[36, sg * 0.85], [30, sg * 0.95]], [[20, sg * 0.15], [8, sg * 0.14]]);
          /* großer Gesäßmuskel */
          mu += feld([[4, sg * 0.08], [5, sg * 0.75], [-2, sg * 0.98], [-8, sg * 0.8], [-9, sg * 0.1]], -1, null, [[4, sg * 0.1], [-8, sg * 0.12]], [[3, sg * 0.8], [-6, sg * 0.88]]);
        });
        /* gerader Bauchmuskel mit Zwischensehnen („Sixpack“) */
        mu += feld([[27, -0.32], [27, 0.32], [2, 0.3], [2, -0.3]], 1, "#c85a50");
        [21, 15, 9].forEach((y) => { mu += zug([[y, -0.31], [y + 0.4, 0], [y, 0.31]], 1, SEHNE, 0.45 * g, 0.9); });
        mu += zug([[27, 0], [2, 0]], 1, SEHNE, 0.55 * g, 0.9);
        mu += zug([[57, 0], [8, 0]], -1, SEHNE, 0.4 * g, 0.7);
        return mu;
      }
      [1, -1].forEach((sg) => {
        out += zug([[54.8, sg * 0.1], [53.8, sg * 0.42], [52.6, sg * 0.78]], 1, d, 0.35 * g, 0.55);
        if (mann) out += zug([[30.5, sg * 0.1], [27.6, sg * 0.32], [28, sg * 0.58], [32, sg * 0.8]], 1, d, 0.3 * g, 0.4);
        out += zug([[44, sg * 0.28], [37.5, sg * 0.22], [33, sg * 0.42], [38, sg * 0.66], [44.5, sg * 0.55]], -1, d, 0.3 * g, 0.35);
      });
      if (mann) out += zug([[25, 0], [19, 0], [14, 0]], 1, d, 0.25 * g, 0.3);
      out += zug([[51, 0], [40, 0], [28, 0], [16, 0], [6, 0]], -1, d, 0.35 * g, 0.4);
      const nabel = ort(11, 0, 1);
      if (sichtbar(nabel.n) > 0.3) {
        const q = pr(nabel.p);
        out += '<ellipse cx="' + r1(q[0]) + '" cy="' + r1(q[1]) + '" rx="' + r1(0.55 * g) + '" ry="' + r1(0.8 * g) + '" fill="' + dunkler(hautF, 0.28) + '" opacity=".7"/>';
      }
      return out;
    })();
    const nackt = !oben && !kleid && !jacke;
    const oberArt = oben ? OBERTEIL[oben.stueck] || OBERTEIL.tshirt : null;
    /* Hose am Rumpf (Gesäß und Bund) */
    if (hoseArt) {
      const farbe = stoff(hose, "#3b4d6b");
      const bund = hoseArt.bund == null ? 9 : hoseArt.bund;
      rumpfSvg += form(rumpfSchnitte(rumpfTab, 0.9 * g, bund * M.k), farbe, { hell: 0.16, dunkel: 0.24 });
      if (hoseArt.lang || hoseArt.gurt) {
        const b = rumpfSchnitte(rumpfTab, 1.0 * g, bund * M.k);
        const oberk = b[b.length - 1];
        const q = { c: pr(oberk.c), U: prRichtung(oberk.U), V: prRichtung(oberk.V), a: oberk.a, b: oberk.b };
        const gurt = ellipsePunkte(q, 20).filter((p, i) => Math.sin(i / 20 * 2 * Math.PI) * prRichtung(oberk.V)[2] + Math.cos(i / 20 * 2 * Math.PI) * prRichtung(oberk.U)[2] > -0.05);
        if (hoseArt.gurt && gurt.length > 2) rumpfSvg += linie(gurt, hoseArt.gurt === true ? "#3a2a20" : hoseArt.gurt, 1.2 * g);
      }
    }
    if (oberArt) {
      const farbe = stoff(oben, "#c8c8c8");
      const bis = oberArt.oben == null ? 56 : oberArt.oben;
      const von = oberArt.unten == null ? -2 : oberArt.unten;
      const ss = rumpfSchnitte(rumpfTab.filter((q) => q[0] >= von), 0.8 * g, bis * M.k);
      rumpfSvg += form(ss, farbe, { hell: 0.18, dunkel: 0.24 });
      rumpfSvg += oberteilDetails(oberArt, farbe, ss);
    }
    if (kleid) {
      const art = KLEID[kleid.stueck] || KLEID.sommerkleid;
      const farbe = stoff(kleid, "#b8473a");
      const ss = rumpfSchnitte(rumpfTab.filter((q) => q[0] >= -5), 0.8 * g, (art.oben || 50) * M.k);
      rumpfSvg += form(ss, farbe, { hell: 0.18, dunkel: 0.24 });
    }
    const vorneTiefe = Math.max.apply(null, teile.filter((t) => t.name.indexOf("bein") === 0).map((t) => t.tiefe));
    const rumpfTiefe = tiefeVon(rumpf);
    auftraege.push({ tiefe: rumpfTiefe, svg: rumpfSvg, rumpf: true });

    /* Rock/Kleid/Mantel unten: Hülle aus Taille und Saum um die Knie */
    function saumHuelle(saum, weite, obenHy) {
      const pts = [];
      const bund = rumpfSchnitte(rumpfTab, 0.9 * g, obenHy * M.k);
      const b0 = bund[bund.length - 1];
      ellipsePunkte({ c: pr(b0.c), U: prRichtung(b0.U), V: prRichtung(b0.V), a: b0.a, b: b0.b }, 18).forEach((p) => pts.push(p));
      const hueft = bund[Math.max(0, bund.length - 3)];
      ellipsePunkte({ c: pr(hueft.c), U: prRichtung(hueft.U), V: prRichtung(hueft.V), a: hueft.a + 0.6 * g, b: hueft.b + 0.6 * g }, 18).forEach((p) => pts.push(p));
      ["L", "R"].forEach((sd) => {
        const H = S["huefte" + sd], K = S["knie" + sd];
        const lang = saum > 1;
        const J = lang ? K : H, L = lang ? M.unterschenkel : M.oberschenkel;
        const s = lang ? saum - 1 : saum;
        const c = add(J.p, mul(mv(J.R, [0, 1, 0]), s * L));
        /* Der Stoff fällt nach unten: der Saum hängt ein Stück tiefer. */
        const fall = add(c, [0, 3 * g, 0]);
        const r = (lang ? 7 : 9) * g * weite;
        const q = { c: pr(fall), U: prRichtung([1, 0, 0]), V: prRichtung([0, 0, 1]), a: r, b: r };
        ellipsePunkte(q, 16).forEach((p) => pts.push(p));
        /* und am Oberschenkel entlang */
        const mitte = add(H.p, mul(mv(H.R, [0, 1, 0]), 0.45 * M.oberschenkel));
        ellipsePunkte({ c: pr(mitte), U: prRichtung(mv(H.R, [1, 0, 0])), V: prRichtung(mv(H.R, [0, 0, 1])), a: 9.5 * g * weite, b: 9.5 * g * weite }, 14).forEach((p) => pts.push(p));
      });
      return konvex(pts);
    }
    const rock = hoseArt && hoseArt.rock ? hose : null;
    const rockArt = rock ? hoseArt : (kleid ? KLEID[kleid.stueck] || KLEID.sommerkleid : null);
    if (rockArt) {
      const farbe = rock ? stoff(rock, "#333333") : stoff(kleid, "#b8473a");
      const pts = saumHuelle(rockArt.saum || 0.85, rockArt.weite || 1.05, 14);
      auftraege.push({ tiefe: Math.max(vorneTiefe, rumpfTiefe) + 0.2, svg: formPunkte(pts, farbe, { hell: 0.18, dunkel: 0.26 }), rock: true });
    }
    /* Jacke / Mantel / Kittel */
    if (jacke) {
      const art = JACKE[jacke.stueck] || JACKE.jacke;
      const farbe = stoff(jacke, "#445566");
      const ss = rumpfSchnitte(rumpfTab.filter((q) => q[0] >= (art.lang ? -5 : -6)), (art.weste ? 1.1 : 1.5) * g, (art.weste ? 52 : 55) * M.k);
      let svg = form(ss, farbe, { hell: 0.2, dunkel: 0.26 });
      if ((art.weste || art.offen) && oberArt && sichtbar(ss[ss.length - 3].V) > 0.1) {
        /* V-Ausschnitt: das Hemd schaut heraus */
        const vp = (s0, u, zu) => pr(add(add(s0.c, mul(s0.U, u * s0.a)), mul(s0.V, s0.b * Math.sqrt(Math.max(0, 1 - u * u)) + zu)));
        const top = ss[ss.length - 1], tief = ss[Math.max(0, ss.length - 5)];
        const hf = stoff(oben, "#eeeeee");
        kragenLage = '<path d="M' + [vp(top, 0.62, 0.3 * g), vp(tief, 0, 0.3 * g), vp(top, -0.62, 0.3 * g)].map((q) => r1(q[0]) + " " + r1(q[1])).join("L") + 'Z" fill="' + hf + '" stroke="' + dunkler(farbe, 0.3) + '" stroke-width="' + r1(0.3 * g) + '" stroke-linejoin="round"/>' + kragenLage;
      }
      svg += oberteilDetails({ reiss: !art.knopf, knopf: art.knopf, kragen: art.kragen, streifen: art.streifen, weste: art.weste }, farbe, ss);
      if (art.lang) {
        const pts = saumHuelle(art.lang, 1.1, 12);
        auftraege.push({ tiefe: Math.max(vorneTiefe, rumpfTiefe) + 0.3, svg: formPunkte(pts, farbe, { hell: 0.2, dunkel: 0.26 }) });
      }
      auftraege.push({ tiefe: rumpfTiefe + 0.25, svg, jacke: true });
    }
    if (kragenLage) auftraege.push({ tiefe: rumpfTiefe + 0.3, svg: kragenLage });
    /* Schürze: ein Tuch vorn von der Taille bis über die Knie */
    const schuerze = [kl.kleid, kl.unterteil, kl.zubehoer, kl.schuerze].find((w) => w && w.stueck === "schuerze") || (kl.schuerze && kl.schuerze.stueck ? kl.schuerze : null);
    if (schuerze || spec.schuerze) {
      const farbe = schuerze ? stoff(schuerze, "#f1ead8") : "#f1ead8";
      /* Ein Tuch: oben am Bund um die Hüfte gelegt, unten ein gerader
         Saum knapp unter den Knien — kein Oval. */
      const bund = rumpfSchnitte(rumpfTab, 1.3 * g, 12 * M.k);
      const b0 = bund[bund.length - 1];
      const oben = [0.82, 0.45, 0, -0.45, -0.82].map((u) => pr(add(add(b0.c, mul(b0.U, u * b0.a)), mul(b0.V, b0.b * Math.sqrt(1 - u * u) + 0.4 * g))));
      const saum = (sd) => {
        const H = S["huefte" + sd];
        const c = add(H.p, mul(mv(H.R, [0, 1, 0]), 1.1 * M.oberschenkel));
        return pr(add(add(add(c, mul(mv(H.R, [0, 0, 1]), 7 * g)), mul(mv(H.R, [1, 0, 0]), (sd === "L" ? 6.5 : -6.5) * g)), [0, 2.5 * g, 0]));
      };
      const unten = [saum("R"), saum("L")];
      const alle = oben.concat(unten);
      const d = "M" + alle.map((q) => r1(q[0]) + " " + r1(q[1])).join("L") + "Z";
      const gid = verlauf(alle, farbe, { hell: 0.14, dunkel: 0.18 });
      let svgS = '<path d="' + d + '" fill="' + gid + '" stroke="' + dunkler(farbe, 0.34) + '" stroke-width="' + r1(0.3 * g) + '" stroke-linejoin="round"/>';
      /* Bänder an der Taille und zwei Falten */
      svgS += linie(oben, dunkler(farbe, 0.3), 0.9 * g);
      const m1 = pr(add(add(b0.c, mul(b0.U, 0.2 * b0.a)), mul(b0.V, b0.b + 0.5 * g)));
      svgS += linie([m1, [lerp(unten[0][0], unten[1][0], 0.4), lerp(unten[0][1], unten[1][1], 0.4)]], dunkler(farbe, 0.16), 0.25 * g, ' opacity=".6"');
      auftraege.push({ tiefe: Math.max(vorneTiefe, rumpfTiefe) + 0.4, svg: svgS });
    }

    /* ---- Oberteil-Details: Kragen, Knöpfe, Reißverschluss ---- */
    function oberteilDetails(art, farbe, ss) {
      let svg = "", svg0 = "";
      const vornePunkt = (s, u, zu) => add(add(s.c, mul(s.U, u * s.a)), mul(s.V, s.b * Math.sqrt(Math.max(0, 1 - u * u)) + (zu || 0)));
      const vorneSicht = ss.length ? sichtbar(ss[Math.floor(ss.length / 2)].V) : 0;
      if (vorneSicht > 0.12) {
        const mitte = ss.map((s) => pr(vornePunkt(s, 0, 0.05 * g)));
        if (art.knopf || art.reiss) svg0 += linie(mitte.slice(1, -1), dunkler(farbe, 0.28), 0.28 * g, ' opacity=".7"');
        if (art.knopf) {
          ss.slice(2, -2).forEach((s) => {
            const p = pr(vornePunkt(s, 0.04, 0.1 * g));
            svg0 += '<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="' + r1(0.45 * g) + '" fill="' + (art.knopfFarbe || heller(farbe, 0.5)) + '" stroke="' + dunkler(farbe, 0.4) + '" stroke-width="' + r1(0.12 * g) + '"/>';
          });
        }
        if (art.streifen) {
          [Math.floor(ss.length * 0.35), Math.floor(ss.length * 0.55)].forEach((i) => {
            const s = ss[i];
            if (!s) return;
            const pts = [-0.9, -0.5, 0, 0.5, 0.9].map((u) => pr(vornePunkt(s, u, 0.1 * g)));
            svg0 += linie(pts, art.streifen, 1.3 * g) + linie(pts, "#e9e7df", 0.45 * g);
          });
        }
      }
      /* Kragen am Hals — in eine eigene Lage, damit er über Weste und
         Jacke liegt (wie in Wirklichkeit). */
      if (art.kragen && ss.length) {
        let svg = "";
        const s = ss[ss.length - 1];
        const q = ss[Math.max(0, ss.length - 2)];
        const pL = pr(vornePunkt(q, 0.45, 0.2 * g)), pR = pr(vornePunkt(q, -0.45, 0.2 * g));
        const m = pr(vornePunkt(q, 0, 0.3 * g)), oL = pr(vornePunkt(s, 0.8, 0.2 * g)), oR = pr(vornePunkt(s, -0.8, 0.2 * g));
        const hL = pr(add(s.c, mul(s.U, s.a * 0.95))), hR = pr(add(s.c, mul(s.U, -s.a * 0.95)));
        const kf = art.kragenFarbe || heller(farbe, 0.08);
        svg += '<path d="M' + r1(hL[0]) + " " + r1(hL[1]) + "L" + r1(oL[0]) + " " + r1(oL[1]) + "L" + r1(pL[0]) + " " + r1(pL[1]) + "L" + r1(m[0]) + " " + r1(m[1]) + "Z" + '" fill="' + kf + '" stroke="' + dunkler(kf, 0.35) + '" stroke-width="' + r1(0.2 * g) + '" stroke-linejoin="round"/>';
        svg += '<path d="M' + r1(hR[0]) + " " + r1(hR[1]) + "L" + r1(oR[0]) + " " + r1(oR[1]) + "L" + r1(pR[0]) + " " + r1(pR[1]) + "L" + r1(m[0]) + " " + r1(m[1]) + "Z" + '" fill="' + kf + '" stroke="' + dunkler(kf, 0.35) + '" stroke-width="' + r1(0.2 * g) + '" stroke-linejoin="round"/>';
        if (art.fliege) {
          const c = pr(vornePunkt(s, 0, 0.6 * g));
          svg += '<path d="M' + r1(c[0]) + " " + r1(c[1]) + "l" + r1(-2.2 * g) + " " + r1(-1 * g) + "v" + r1(2 * g) + "z" + "M" + r1(c[0]) + " " + r1(c[1]) + "l" + r1(2.2 * g) + " " + r1(-1 * g) + "v" + r1(2 * g) + 'z" fill="' + art.fliege + '"/><circle cx="' + r1(c[0]) + '" cy="' + r1(c[1]) + '" r="' + r1(0.55 * g) + '" fill="' + art.fliege + '"/>';
        }
        if (sichtbar(s.V) > -0.2) kragenLage += svg;
      }
      return svg0;
    }

    /* ---- Dinge in der linken Hand ---- */
    function zubehoerInHand(z, Hd) {
      const T = mv(Hd.R, [0, 1, 0]);
      const mitte = add(Hd.p, mul(T, M.hand * 0.45));
      if (z.stueck === "tablett") {
        /* Tablett liegt waagrecht auf der Handfläche. */
        const innen = mul(mv(Hd.R, [1, 0, 0]), -1);
        const c = add(add(mitte, mul(innen, -1.6 * g)), [0, -1.2 * g, 0]);
        const r = 19 * g;
        const q = { c: pr(c), U: prRichtung([1, 0, 0]), V: prRichtung([0, 0, 1]), a: r, b: r };
        const rand = ellipsePunkte(q, 28);
        const q2 = { c: pr(add(c, [0, -0.7 * g, 0])), U: q.U, V: q.V, a: r * 0.9, b: r * 0.9 };
        let svg = '<path d="' + pfad(rand) + '" fill="#9aa0a6" stroke="#5d6166" stroke-width="' + r1(0.3 * g) + '"/>';
        svg += '<path d="' + pfad(ellipsePunkte(q2, 28)) + '" fill="#d7dbde" stroke="#aeb3b7" stroke-width="' + r1(0.2 * g) + '"/>';
        /* ein Glas und eine Tasse darauf */
        const glas = pr(add(c, [5 * g, -0.8 * g, -3 * g])), tasse = pr(add(c, [-5 * g, -0.8 * g, 3 * g]));
        svg += '<path d="M' + r1(glas[0] - 2.4 * g) + " " + r1(glas[1] - 11 * g) + "L" + r1(glas[0] - 1.8 * g) + " " + r1(glas[1]) + "H" + r1(glas[0] + 1.8 * g) + "L" + r1(glas[0] + 2.4 * g) + " " + r1(glas[1] - 11 * g) + 'Z" fill="rgba(214,232,240,.75)" stroke="#8fa9b6" stroke-width="' + r1(0.2 * g) + '"/>';
        svg += '<rect x="' + r1(glas[0] - 2.1 * g) + '" y="' + r1(glas[1] - 6 * g) + '" width="' + r1(4.2 * g) + '" height="' + r1(5.6 * g) + '" fill="#e8b84a" opacity=".85"/>';
        svg += '<path d="M' + r1(tasse[0] - 3.2 * g) + " " + r1(tasse[1] - 6 * g) + "q0 " + r1(6 * g) + " " + r1(3.2 * g) + " " + r1(6 * g) + "q" + r1(3.2 * g) + " 0 " + r1(3.2 * g) + " " + r1(-6 * g) + 'z" fill="#fbfaf6" stroke="#b9b4aa" stroke-width="' + r1(0.2 * g) + '"/>';
        svg += '<ellipse cx="' + r1(tasse[0]) + '" cy="' + r1(tasse[1] - 6 * g) + '" rx="' + r1(3.2 * g) + '" ry="' + r1(0.8 * g) + '" fill="#6b4630"/>';
        return svg;
      }
      if (z.stueck === "buch") {
        const c = pr(mitte);
        return '<g transform="translate(' + r1(c[0]) + "," + r1(c[1]) + ") rotate(" + (spec.spiegel ? 12 : -12) + ')"><rect x="' + r1(-5 * g) + '" y="' + r1(-7 * g) + '" width="' + r1(10 * g) + '" height="' + r1(14 * g) + '" rx="' + r1(0.6 * g) + '" fill="' + stoff(z, "#8a3b2e") + '" stroke="' + dunkler(stoff(z, "#8a3b2e"), 0.4) + '" stroke-width="' + r1(0.3 * g) + '"/><rect x="' + r1(-4.2 * g) + '" y="' + r1(-6.3 * g) + '" width="' + r1(0.9 * g) + '" height="' + r1(12.6 * g) + '" fill="rgba(255,255,255,.35)"/></g>';
      }
      if (z.stueck === "tasche") {
        const c = pr(add(mitte, [0, 6 * g, 0]));
        const farbe = stoff(z, "#7a4a2c");
        return '<path d="M' + r1(c[0] - 3 * g) + " " + r1(c[1] - 5 * g) + "q" + r1(3 * g) + " " + r1(-5 * g) + " " + r1(6 * g) + ' 0" fill="none" stroke="' + dunkler(farbe, 0.3) + '" stroke-width="' + r1(0.7 * g) + '"/><rect x="' + r1(c[0] - 8 * g) + '" y="' + r1(c[1] - 5 * g) + '" width="' + r1(16 * g) + '" height="' + r1(12 * g) + '" rx="' + r1(2 * g) + '" fill="' + farbe + '" stroke="' + dunkler(farbe, 0.35) + '" stroke-width="' + r1(0.3 * g) + '"/>';
      }
      if (z.stueck === "besen") {
        const a = pr(add(mitte, mul(mv(Hd.R, [0, 0, 1]), -60 * g))), b = pr(add(mitte, mul(mv(Hd.R, [0, 0, 1]), 70 * g)));
        return linie([a, b], "#8b6a43", 1.6 * g) + '<ellipse cx="' + r1(a[0]) + '" cy="' + r1(a[1]) + '" rx="' + r1(9 * g) + '" ry="' + r1(3 * g) + '" fill="#c9a45a" stroke="#8b6a33" stroke-width="' + r1(0.3 * g) + '"/>';
      }
      return "";
    }

    /* ---- Hals und Kopf ---- */
    let halsSvg = form(halsS, hautF, { hell: 0.1, dunkel: 0.26 });
    const kragenHoch = (oberArt && oberArt.rollkragen);
    if (kragenHoch) halsSvg += form(aufblasen(halsS.slice(0, 2), 0.8 * g), stoff(oben, "#c8c8c8"));
    auftraege.push({ tiefe: rumpfTiefe + 0.5, svg: halsSvg, hals: true });

    const kopfSpec = Object.assign({}, spec, { kopfbedeckung: stueck("kopf"), brille: !!(zub && zub.stueck === "brille") });
    const kopfTeile = kopf(S.kopf, M, kopfSpec, { pr, prRichtung, sichtbar, form, fuellung: () => letzteFuellung, formPunkte, linie, verlauf, hautF, haarF, g, id, defs, zaehler: () => gz++, stoff });
    auftraege.push({ tiefe: rumpfTiefe + 1, svg: kopfTeile.vorn, kopf: true });
    if (kopfTeile.hinten) {
      const profil = Math.abs(Math.sin(blick * RAD)) > 0.8;
      auftraege.push({ tiefe: profil ? rumpfTiefe + 0.1 : rumpfTiefe - 0.5, svg: kopfTeile.hinten });
    }

    /* Schal über allem am Hals */
    if (zub && zub.stueck === "schal") {
      const farbe = stoff(zub, "#b8473a");
      const ring = halsS.slice(0, 2).map((s) => schnitt(s.c, s.U, s.V, s.a + 2.2 * g, s.b + 2.2 * g));
      let svg = form(ring, farbe, { hell: 0.2, dunkel: 0.26 });
      const vorn = add(halsS[0].c, mul(halsS[0].V, halsS[0].b + 1.5 * g));
      const unten = add(vorn, mv(S.brust.R, [2 * g, 22 * g, 1 * g]));
      svg += linie([pr(vorn), pr(unten)], farbe, 4.2 * g) + linie([pr(vorn), pr(unten)], heller(farbe, 0.15), 2.4 * g);
      auftraege.push({ tiefe: rumpfTiefe + 1.2, svg });
    }
    if (zub && zub.stueck === "rucksack") {
      const farbe = stoff(zub, "#35506e");
      const hinten = rumpf.slice(5, 10).map((s) => schnitt(add(s.c, mul(s.V, -(s.b + 4 * g))), s.U, s.V, s.a * 0.72, 5 * g));
      auftraege.push({ tiefe: tiefeVon(hinten), svg: form(hinten, farbe, { hell: 0.2, dunkel: 0.26 }) });
    }

    /* ---- sortieren und zusammensetzen ---- */
    auftraege.sort((a, b) => a.tiefe - b.tiefe);
    const inhalt = auftraege.map((a) => a.svg).join("");

    /* Benannte Stellen am Körper — für Beschriftungen, Trefferflächen und
       die Lehrbuchtafeln (Körperteile vorn und hinten). */
    const punkte = {};
    (function () {
      const P = (v) => { const q = pr(v); return [r1(q[0]), r1(q[1])]; };
      const alleR = rumpfSchnitte(rumpfTab, 0);
      const R = (y, u, vorn) => {
        /* Punkt auf der Rumpfoberfläche: Höhe y (cm über der Hüfte beim
           Erwachsenen), quer u (−1 … 1), vorn (+1) oder hinten (−1) —
           zwischen den beiden Querschnitten, die y einschließen. */
        let i = 0;
        while (i < rumpfTab.length - 2 && rumpfTab[i + 1][0] < y) i++;
        const t = klemm((y - rumpfTab[i][0]) / (rumpfTab[i + 1][0] - rumpfTab[i][0]), 0, 1);
        const a0 = alleR[i], a1 = alleR[i + 1];
        const c = lerp3(a0.c, a1.c, t), Uu = unit(lerp3(a0.U, a1.U, t)), Vv = unit(lerp3(a0.V, a1.V, t));
        const ra = lerp(a0.a, a1.a, t), rb = lerp(a0.b, a1.b, t);
        return P(add(add(c, mul(Uu, u * ra)), mul(Vv, vorn * rb * Math.sqrt(Math.max(0, 1 - u * u)))));
      };
      Object.keys(kopfTeile.punkte || {}).forEach((n) => { const q = kopfTeile.punkte[n]; punkte[n] = [r1(q[0]), r1(q[1])]; });
      punkte.hals = P(add(halsS[1].c, mul(halsS[1].V, halsS[1].b)));
      punkte.nacken = P(add(halsS[1].c, mul(halsS[1].V, -halsS[1].b)));
      punkte.brust = R(30, 0.45, 1); punkte.bauch = R(8, 0, 1); punkte.nabel = R(11, 0, 1);
      punkte.leiste = R(-3, 0.45, 1); punkte.ruecken = R(30, 0, -1); punkte.schulterblatt = R(38, 0.45, -1);
      punkte.lende = R(12, 0, -1); punkte.gesaess = R(-4, 0.45, -1);
      punkte.brustmuskelL = R(39, 0.5, 1); punkte.brustmuskelR = R(39, -0.5, 1);
      punkte.bauchmuskeln = R(18, 0.14, 1); punkte.schraegerL = R(16, 0.72, 1); punkte.schraegerR = R(16, -0.72, 1);
      punkte.kapuzenmuskelL = R(47, 0.45, -1); punkte.kapuzenmuskelR = R(47, -0.45, -1);
      punkte.rueckenmuskelL = R(24, 0.6, -1); punkte.rueckenmuskelR = R(24, -0.6, -1);
      punkte.gesaessmuskelL = R(-1, 0.5, -1); punkte.gesaessmuskelR = R(-1, -0.5, -1);
      punkte.tailleL = R(14, 1, 0); punkte.tailleR = R(14, -1, 0); punkte.huefteL = R(0, 1, 0); punkte.huefteR = R(0, -1, 0);
      ["L", "R"].forEach((sd) => {
        const sg = sd === "L" ? 1 : -1;
        const Sh = S["schulter" + sd], E = S["ellbogen" + sd], Hd = S["hand" + sd], H = S["huefte" + sd], K = S["knie" + sd], Fu = S["fuss" + sd];
        const down = (J) => mv(J.R, [0, 1, 0]), vor = (J) => mv(J.R, [0, 0, 1]), quer = (J) => mv(J.R, [1, 0, 0]);
        punkte["schulter" + sd] = P(add(Sh.p, mul(quer(S.brust), sg * 3 * g)));
        punkte["achsel" + sd] = P(add(Sh.p, add(mul(down(S.brust), 7 * g), mul(quer(S.brust), -sg * 3 * g))));
        punkte["oberarm" + sd] = P(add(Sh.p, mul(down(Sh), 0.45 * M.oberarm)));
        punkte["ellbogen" + sd] = P(E.p);
        punkte["unterarm" + sd] = P(add(E.p, mul(down(E), 0.5 * M.unterarm)));
        punkte["handgelenk" + sd] = P(Hd.p);
        punkte["hand" + sd] = P(add(Hd.p, mul(down(Hd), 0.32 * M.hand)));
        punkte["finger" + sd] = P(add(Hd.p, mul(down(Hd), 0.82 * M.hand)));
        punkte["oberschenkel" + sd] = P(add(H.p, mul(down(H), 0.5 * M.oberschenkel)));
        punkte["knie" + sd] = P(add(K.p, mul(vor(K), 5 * g)));
        punkte["kniekehle" + sd] = P(add(K.p, mul(vor(K), -4 * g)));
        punkte["unterschenkel" + sd] = P(add(K.p, add(mul(down(K), 0.5 * M.unterschenkel), mul(vor(K), 3 * g))));
        punkte["wade" + sd] = P(add(K.p, add(mul(down(K), 0.3 * M.unterschenkel), mul(vor(K), -4.5 * g))));
        punkte["knoechel" + sd] = P(add(Fu.p, mul(quer(Fu), sg * 3 * g)));
        punkte["fuss" + sd] = P(add(Fu.p, add(mul(vor(Fu), 0.35 * M.fuss), mul(down(Fu), 0.5 * M.knoechel))));
        punkte["zeh" + sd] = P(add(Fu.p, add(mul(vor(Fu), 0.72 * M.fuss), mul(down(Fu), 0.8 * M.knoechel))));
        punkte["ferse" + sd] = P(add(Fu.p, add(mul(vor(Fu), -0.18 * M.fuss), mul(down(Fu), 0.7 * M.knoechel))));
        /* Muskeln (für die Tafel „Die Muskeln“) */
        const armT = teile.find((q) => q.name === "arm" + sd), beinT = teile.find((q) => q.name === "bein" + sd);
        const aus = sd === "L" ? 0 : 180;
        const G = (ss, s0, w) => P(gliedOrt(ss, s0, w).p);
        punkte["deltamuskel" + sd] = G(armT.oberarm, 0.18, aus);
        punkte["bizeps" + sd] = G(armT.oberarm, 0.55, 90);
        punkte["trizeps" + sd] = G(armT.oberarm, 0.5, -90);
        punkte["unterarmmuskeln" + sd] = G(armT.unterarm, 0.35, 90);
        punkte["unterarmhinten" + sd] = G(armT.unterarm, 0.35, -90);
        punkte["oberschenkelmuskel" + sd] = G(beinT.oberschenkel, 0.45, 90);
        punkte["beinbeuger" + sd] = G(beinT.oberschenkel, 0.5, -90);
        punkte["schienbeinmuskel" + sd] = G(beinT.unterschenkel, 0.35, aus === 0 ? 55 : 125);
        punkte["wadenmuskel" + sd] = G(beinT.unterschenkel, 0.3, -90);
        punkte["achillessehne" + sd] = G(beinT.unterschenkel, 0.85, -90);
        punkte["kniesehne" + sd] = G(beinT.oberschenkel, 0.97, 90);
      });
    })();

    /* Messpunkte für den Aufrufer */
    const sitzP = pr(add(S.becken.p, mv(S.becken.R, [0, 8.5 * M.k * f, -1.5 * M.k])));
    const kopfP = pr(S.kopf.p);
    const alleX = [], alleY = [];
    inhalt.replace(/[ML]?(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (m, x, y) => { alleX.push(+x); alleY.push(+y); return m; });
    const box = alleX.length ? { x0: Math.min.apply(null, alleX), x1: Math.max.apply(null, alleX), y0: Math.min.apply(null, alleY), y1: Math.max.apply(null, alleY) } : { x0: -20, x1: 20, y0: -M.H, y1: 0 };
    return {
      svg: '<g class="mensch">' + (defs.length ? "<defs>" + defs.join("") + "</defs>" : "") + inhalt + "</g>",
      sitz: { x: r1(sitzP[0]), y: r1(sitzP[1]) },
      kopf: { x: r1(kopfP[0]), y: r1(kopfP[1]) },
      box, hoehe: M.H, mass: M, punkte,
      handL: (() => { const p = pr(S.handL.p); return { x: r1(p[0]), y: r1(p[1]) }; })(),
      handR: (() => { const p = pr(S.handR.p); return { x: r1(p[0]), y: r1(p[1]) }; })(),
    };
  }

  /* ------------------------------------------------------------------
     9 — DER KOPF
     ------------------------------------------------------------------
     Ein Körper aus Querschnitten vom Scheitel bis zum Kinn; Augen, Nase,
     Mund und Ohren sitzen als Punkte auf der Oberfläche und werden nur
     gezeichnet, wenn sie zum Betrachter schauen. Das Haar ist eine
     Schale über dem Kopf, abgeschnitten an der Haarlinie. */
  /* [y (Kopfmitte = 0, Kopfhöhe 23 cm), a, b, vor] */
  const SCHAEDEL = [
    [-11.6, 1.2, 1.4, -0.8], [-10.4, 5.2, 6.4, -0.8], [-8, 7.0, 8.9, -0.7], [-4.5, 7.6, 9.8, -0.5],
    [-1, 7.5, 9.9, -0.2], [2, 7.2, 9.4, 0.2], [4.6, 6.7, 8.2, 1.0], [6.4, 6.1, 6.7, 2.5], [7.6, 5.5, 6.1, 3.5],
    [8.8, 5.0, 5.3, 3.3], [10.4, 3.3, 3.9, 4.1], [11.5, 1.3, 1.8, 4.8],
  ];
  function kopf(K, M, spec, h) {
    const { pr, prRichtung, sichtbar, form, linie, hautF, haarF, g } = h;
    const k = M.kopf / 23;
    const baby = !M.erw && M.kopf / M.H > 0.17;
    const R = K.R;
    const U = mv(R, [1, 0, 0]), Vv = mv(R, [0, 0, 1]), T = mv(R, [0, 1, 0]);
    /* Kinder: rundere Köpfe, kleineres Gesicht, größere Stirn. */
    const tab = SCHAEDEL.map((q) => {
      let [y, a, b, v] = q;
      if (!M.erw) { a *= 1.04; b *= 0.98; if (y > 4) { a *= 0.92; b *= 0.9; v *= 0.85; y = y * 0.93 + 0.5; } }
      if (M.w && M.erw) { a *= 0.95; b *= 0.96; if (y > 5) { a *= 0.93; } }
      return [y, a, b, v];
    });
    const auf = (y, u, vv) => add(add(add(K.p, mul(T, y * k)), mul(U, u * k)), mul(Vv, vv * k));
    const ss = tab.map((q) => schnitt(auf(q[0], 0, q[3]), U, Vv, q[1] * k, q[2] * k));
    const flaeche = (y, u) => {
      /* Punkt auf der Vorderfläche in Höhe y bei quer u (−1 … 1) */
      let i = 0; while (i < tab.length - 2 && tab[i + 1][0] < y) i++;
      const t = klemm((y - tab[i][0]) / (tab[i + 1][0] - tab[i][0]), 0, 1);
      const a = lerp(tab[i][1], tab[i + 1][1], t), b = lerp(tab[i][2], tab[i + 1][2], t), v = lerp(tab[i][3], tab[i + 1][3], t);
      return { p: auf(y, u * a, v + b * Math.sqrt(Math.max(0, 1 - u * u))), n: unit(add(mul(U, u / a), mul(Vv, Math.sqrt(Math.max(0, 1 - u * u)) / b))), a, b, v };
    };
    const gesicht = spec.gesicht || "g1";
    const gi = Math.max(0, ["g1", "g2", "g3", "g4"].indexOf(gesicht));
    let svg = form(ss, hautF, { hell: 0.16, dunkel: 0.2 });
    const kopfFuellung = h.fuellung() || hautF;
    let hinten = "";

    /* Ohren */
    ["L", "R"].forEach((sd) => {
      const s = sd === "L" ? 1 : -1;
      const n = mul(U, s);
      if (sichtbar(n) < -0.2) return;
      const mitte = auf(1.2, s * 7.4, -0.6);
      const o = pr(mitte), ob = pr(auf(-1.6, s * 7.4, -0.3)), un = pr(auf(4.4, s * 7.1, -0.2));
      const vis = klemm(Math.abs(sichtbar(n)) + 0.25, 0.25, 1);
      const breit = 2.3 * k * vis;
      const rv = prRichtung(Vv);
      const bx = (rv[0] >= 0 ? -1 : 1) * breit;
      const d = "M" + r1(ob[0]) + " " + r1(ob[1]) + "C" + r1(ob[0] + bx * 1.2) + " " + r1(ob[1] - 0.6 * k) + " " + r1(o[0] + bx * 1.3) + " " + r1(o[1] + 1.8 * k) + " " + r1(un[0] + bx * 0.3) + " " + r1(un[1]) + "Q" + r1(un[0] - bx * 0.2) + " " + r1(un[1] - 0.5 * k) + " " + r1(o[0]) + " " + r1(o[1] + 1.5 * k) + "Z";
      svg += '<path d="' + d + '" fill="' + dunkler(hautF, 0.06) + '" stroke="' + dunkler(hautF, 0.34) + '" stroke-width="' + r1(0.22 * k) + '"/>';
      svg += '<path d="M' + r1(ob[0] + bx * 0.45) + " " + r1(ob[1] + 0.8 * k) + "Q" + r1(o[0] + bx * 0.9) + " " + r1(o[1]) + " " + r1(o[0] + bx * 0.3) + " " + r1(o[1] + 2 * k) + '" fill="none" stroke="' + dunkler(hautF, 0.3) + '" stroke-width="' + r1(0.25 * k) + '" opacity=".7"/>';
    });

    /* Bart unter dem Gesicht */
    const bart = spec.bart;
    if (bart && M.erw && spec.geschlecht !== "w") {
      const ab = bart === "bart_kurz" ? 5.4 : 4.8;
      const bs = tab.filter((q) => q[0] >= ab).map((q) => schnitt(auf(q[0] + 0.5, 0, q[3] + 0.4), U, Vv, q[1] * k * 0.98 + 0.3 * k, q[2] * k * 0.84 + 0.5 * k));
      const bf = bart === "bart_kurz" ? misch(haarF, hautF, 0.3) : misch(haarF, hautF, 0.12);
      const bb = form(bs, bf, { hell: 0.1, dunkel: 0.14, kontur: dunkler(bf, 0.2), strich: 0.15 * k });
      svg += bart === "bart_kurz" ? '<g opacity=".55">' + bb + "</g>" : bb;
    }

    /* Augen */
    const augenFarbe = AUGE[gi % AUGE.length];
    const augY = 0.2, augU = 0.43;
    ["L", "R"].forEach((sd) => {
      const s = sd === "L" ? 1 : -1;
      const F = flaeche(augY, s * augU);
      const vis = sichtbar(F.n);
      if (vis < 0.08) return;
      const c = pr(add(F.p, mul(F.n, -0.25 * k)));
      /* Die Augenachse: quer über das Gesicht, im Bild verkürzt. */
      /* Die Querrichtung des Auges ist die waagrechte Tangente der
         Gesichtsfläche an dieser Stelle — im Profil zeigt sie nach vorn,
         nicht (wie die Kopfachse) in die Tiefe. */
      const nU = dot(F.n, U), nV = dot(F.n, Vv);
      const tang3 = add(mul(U, nV), mul(Vv, -nU));
      const quer = prRichtung(tang3);
      const ql = Math.hypot(quer[0], quer[1]) || 1;
      const qx = quer[0] / ql, qy = quer[1] / ql;
      const w = 1.55 * k * klemm(ql, 0.3, 1) * (baby ? 1.2 : 1);
      const hgt = (M.w ? 0.62 : 0.55) * k * (baby ? 1.25 : 1);
      const P = (u, v) => [c[0] + qx * u * w - (0) * v, c[1] + qy * u * w + v * hgt];
      const a = P(-1, 0), b = P(1, 0), o1 = P(-0.3, -1.1), o2 = P(0.4, -1.05), u1 = P(-0.3, 0.75), u2 = P(0.35, 0.72);
      const auge = "M" + r1(a[0]) + " " + r1(a[1]) + "C" + r1(o1[0]) + " " + r1(o1[1]) + " " + r1(o2[0]) + " " + r1(o2[1]) + " " + r1(b[0]) + " " + r1(b[1]) + "C" + r1(u2[0]) + " " + r1(u2[1]) + " " + r1(u1[0]) + " " + r1(u1[1]) + " " + r1(a[0]) + " " + r1(a[1]) + "Z";
      /* Blickrichtung: die Iris wandert zur Seite, in die die Figur schaut */
      const vor = prRichtung(Vv);
      const iris = [c[0] + vor[0] * 0.35 * k, c[1] + 0.02 * k];
      const cid = h.id + "a" + h.zaehler();
      h.defs.push('<clipPath id="' + cid + '"><path d="' + auge + '"/></clipPath>');
      svg += '<path d="' + auge + '" fill="#f7f3ee"/>';
      svg += '<g clip-path="url(#' + cid + ')"><ellipse cx="' + r1(iris[0]) + '" cy="' + r1(iris[1]) + '" rx="' + r1(0.62 * k * klemm(vis * 1.2, 0.45, 1) * (baby ? 1.3 : 1)) + '" ry="' + r1(0.66 * k * (baby ? 1.3 : 1)) + '" fill="' + augenFarbe + '"/>'
        + '<circle cx="' + r1(iris[0]) + '" cy="' + r1(iris[1]) + '" r="' + r1(0.3 * k * (baby ? 1.3 : 1)) + '" fill="#161311"/>'
        + '<circle cx="' + r1(iris[0] - 0.22 * k) + '" cy="' + r1(iris[1] - 0.25 * k) + '" r="' + r1(0.13 * k) + '" fill="#fff" opacity=".9"/>'
        + '<path d="M' + r1(a[0]) + " " + r1(a[1] - 1.2 * hgt) + "H" + r1(b[0]) + "V" + r1(b[1] - 0.55 * hgt) + "H" + r1(a[0]) + 'Z" fill="' + dunkler(hautF, 0.12) + '" opacity=".35"/></g>';
      /* Oberlid (kräftig), Unterlid (zart), Lidfalte */
      svg += '<path class="lid" d="M' + r1(a[0]) + " " + r1(a[1]) + "C" + r1(o1[0]) + " " + r1(o1[1]) + " " + r1(o2[0]) + " " + r1(o2[1]) + " " + r1(b[0]) + " " + r1(b[1]) + '" fill="none" stroke="#2b1d17" stroke-width="' + r1((M.w ? 0.34 : 0.26) * k) + '" stroke-linecap="round"/>';
      svg += '<path d="M' + r1(a[0]) + " " + r1(a[1]) + "C" + r1(u1[0]) + " " + r1(u1[1]) + " " + r1(u2[0]) + " " + r1(u2[1]) + " " + r1(b[0]) + " " + r1(b[1]) + '" fill="none" stroke="' + dunkler(hautF, 0.3) + '" stroke-width="' + r1(0.14 * k) + '" opacity=".7"/>';
      const f1 = P(-0.8, -1.5), f2 = P(0.2, -1.95), f3 = P(1.05, -1.2);
      svg += '<path d="M' + r1(f1[0]) + " " + r1(f1[1]) + "Q" + r1(f2[0]) + " " + r1(f2[1]) + " " + r1(f3[0]) + " " + r1(f3[1]) + '" fill="none" stroke="' + dunkler(hautF, 0.26) + '" stroke-width="' + r1(0.14 * k) + '" opacity=".6"/>';
      /* Augenbraue */
      const bF = flaeche(-1.9 - gi * 0.08, s * 0.45);
      if (sichtbar(bF.n) > 0.05) {
        const bm = pr(bF.p);
        const e1 = [bm[0] - qx * 1.8 * k * vis * s * -1, bm[1] + 0.35 * k], e2 = [bm[0] + qx * 1.9 * k * vis * s * -1, bm[1] + 0.1 * k];
        const innenE = s > 0 ? [bm[0] + qx * -1.9 * k * klemm(vis, 0.4, 1), bm[1] + 0.3 * k] : [bm[0] + qx * 1.9 * k * klemm(vis, 0.4, 1), bm[1] + 0.3 * k];
        const aussenE = s > 0 ? [bm[0] + qx * 2.1 * k * klemm(vis, 0.4, 1), bm[1] + 0.25 * k] : [bm[0] - qx * 2.1 * k * klemm(vis, 0.4, 1), bm[1] + 0.25 * k];
        void e1; void e2;
        const bb = (M.w ? 0.34 : 0.52) * k * (1 + (gi === 2 ? 0.25 : 0));
        svg += '<path d="M' + r1(innenE[0]) + " " + r1(innenE[1]) + "Q" + r1(bm[0]) + " " + r1(bm[1] - 0.55 * k) + " " + r1(aussenE[0]) + " " + r1(aussenE[1]) + '" fill="none" stroke="' + misch(haarF, "#2a1d16", spec.haarfarbe === "weiss" || spec.haarfarbe === "grau" ? 0.2 : 0.35) + '" stroke-width="' + r1(bb) + '" stroke-linecap="round" opacity=".92"/>';
      }
    });

    /* Nase: Rücken, Spitze, Flügel — im Profil ragt sie aus dem Umriss. */
    const nB = baby ? 0.72 : (M.erw ? 1 : 0.85);
    const nase = [
      flaeche(0.6, 0.12), flaeche(0.6, -0.12),
    ];
    void nase;
    const nRuecken = auf(0.7, 0, 9.4 + 0.1);
    const nSpitze = auf(4.3 * (baby ? 0.9 : 1), 0, 10.2 + 1.3 * nB);
    const nBasis = auf(5.1, 0, 9.4 + 0.2);
    const nFL = auf(4.9, 1.5 * nB, 8.9), nFR = auf(4.9, -1.5 * nB, 8.9);
    const pRu = pr(nRuecken), pSp = pr(nSpitze), pBa = pr(nBasis), pFL = pr(nFL), pFR = pr(nFR);
    const vor = prRichtung(Vv);
    const seitlich = Math.abs(vor[0]) / (Math.hypot(vor[0], vor[2]) || 1);
    const nasenSeite = vor[0] >= 0 ? 1 : -1;
    const fern = nasenSeite > 0 ? pFL : pFR, nah = nasenSeite > 0 ? pFR : pFL;
    void nah;
    svg += '<path d="M' + r1(pRu[0]) + " " + r1(pRu[1]) + "C" + r1(pRu[0] + nasenSeite * 0.4 * k * seitlich) + " " + r1(pRu[1] + 1.5 * k) + " " + r1(pSp[0]) + " " + r1(pSp[1] - 1.2 * k) + " " + r1(pSp[0]) + " " + r1(pSp[1])
      + "C" + r1(pSp[0]) + " " + r1(pSp[1] + 0.6 * k) + " " + r1(pBa[0] + nasenSeite * 0.2 * k) + " " + r1(pBa[1]) + " " + r1(pBa[0]) + " " + r1(pBa[1])
      + "L" + r1(fern[0]) + " " + r1(fern[1]) + "Z" + '" fill="' + kopfFuellung + '" stroke="none"/>';
    svg += '<path d="M' + r1(pRu[0] - nasenSeite * 0.3 * k) + " " + r1(pRu[1] + 0.8 * k) + "C" + r1(pRu[0] + nasenSeite * 0.3 * k * seitlich) + " " + r1(pRu[1] + 2.2 * k) + " " + r1(pSp[0]) + " " + r1(pSp[1] - 1 * k) + " " + r1(pSp[0] + 0.1 * k * nasenSeite) + " " + r1(pSp[1]) + '" fill="none" stroke="' + dunkler(hautF, 0.3) + '" stroke-width="' + r1(0.2 * k) + '" opacity="' + (0.35 + 0.5 * seitlich).toFixed(2) + '"/>';
    svg += '<path d="M' + r1(pSp[0]) + " " + r1(pSp[1]) + "Q" + r1(pBa[0] + nasenSeite * 0.3 * k) + " " + r1(pBa[1] + 0.2 * k) + " " + r1(fern[0]) + " " + r1(fern[1]) + '" fill="none" stroke="' + dunkler(hautF, 0.4) + '" stroke-width="' + r1(0.22 * k) + '" stroke-linecap="round"/>';
    ["L", "R"].forEach((sd) => {
      const s = sd === "L" ? 1 : -1;
      const nl = auf(5.0, s * 0.75 * nB, 9.5);
      const n = unit(add(mul(U, s * 0.4), Vv));
      if (sichtbar(n) < 0.2) return;
      const p = pr(nl);
      svg += '<ellipse cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" rx="' + r1(0.42 * k * klemm(sichtbar(n), 0.3, 1)) + '" ry="' + r1(0.24 * k) + '" fill="' + dunkler(hautF, 0.5) + '" opacity=".75"/>';
    });

    /* Mund */
    const mY = baby ? 6.8 : 7.4;
    const mm0 = flaeche(mY, 0), mL = flaeche(mY, 0.36), mR = flaeche(mY, -0.36);
    const lippe = misch(hautF, M.w && M.erw ? "#b4545a" : "#a45a50", M.w && M.erw ? 0.45 : 0.3);
    if (sichtbar(mm0.n) > -0.1) {
      const pm = pr(add(mm0.p, mul(mm0.n, 0.1 * k)));
      const pl = sichtbar(mL.n) > 0 ? pr(mL.p) : [pm[0] + (pr(mL.p)[0] - pm[0]) * 0.35, pr(mL.p)[1]];
      const prr = sichtbar(mR.n) > 0 ? pr(mR.p) : [pm[0] + (pr(mR.p)[0] - pm[0]) * 0.35, pr(mR.p)[1]];
      const laecheln = (spec.laecheln == null ? 0.35 : spec.laecheln) * k;
      const ol = 0.55 * k * (M.w ? 1.15 : 0.9), ul = 0.75 * k * (M.w ? 1.2 : 0.95);
      /* Oberlippe, Unterlippe, Mundspalte */
      svg += '<path d="M' + r1(pl[0]) + " " + r1(pl[1]) + "Q" + r1((pl[0] + pm[0]) / 2) + " " + r1(pm[1] - ol * 1.2) + " " + r1(pm[0]) + " " + r1(pm[1] - ol * 0.7) + "Q" + r1((prr[0] + pm[0]) / 2) + " " + r1(pm[1] - ol * 1.2) + " " + r1(prr[0]) + " " + r1(prr[1])
        + "Q" + r1(pm[0]) + " " + r1(pm[1] + laecheln * 0.4) + " " + r1(pl[0]) + " " + r1(pl[1]) + 'Z" fill="' + dunkler(lippe, 0.12) + '"/>';
      svg += '<path d="M' + r1(pl[0]) + " " + r1(pl[1]) + "Q" + r1(pm[0]) + " " + r1(pm[1] + laecheln * 0.4) + " " + r1(prr[0]) + " " + r1(prr[1]) + "Q" + r1(pm[0]) + " " + r1(pm[1] + ul * 1.6) + " " + r1(pl[0]) + " " + r1(pl[1]) + 'Z" fill="' + lippe + '"/>';
      svg += '<path d="M' + r1(pl[0]) + " " + r1(pl[1] - laecheln * 0.3) + "Q" + r1(pm[0]) + " " + r1(pm[1] + laecheln * 0.5) + " " + r1(prr[0]) + " " + r1(prr[1] - laecheln * 0.3) + '" fill="none" stroke="' + dunkler(lippe, 0.5) + '" stroke-width="' + r1(0.2 * k) + '" stroke-linecap="round"/>';
      svg += '<path d="M' + r1(pm[0] - 0.5 * k) + " " + r1(pm[1] + ul * 0.95) + "Q" + r1(pm[0]) + " " + r1(pm[1] + ul * 1.25) + " " + r1(pm[0] + 0.5 * k) + " " + r1(pm[1] + ul * 0.95) + '" fill="none" stroke="' + heller(lippe, 0.4) + '" stroke-width="' + r1(0.18 * k) + '" opacity=".6"/>';
    }
    /* Wangenröte, Kinnschatten */
    ["L", "R"].forEach((sd) => {
      const s = sd === "L" ? 1 : -1;
      const F = flaeche(4.2, s * 0.55);
      if (sichtbar(F.n) < 0.2) return;
      const p = pr(F.p);
      svg += '<ellipse cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" rx="' + r1(1.8 * k * sichtbar(F.n)) + '" ry="' + r1(1.2 * k) + '" fill="#e0806f" opacity="' + (baby || !M.erw ? 0.22 : 0.12) + '"/>';
    });
    if (spec.alter === "alt") {
      /* Falten: Nasolabial und Stirn, ganz zart */
      ["L", "R"].forEach((sd) => {
        const s = sd === "L" ? 1 : -1;
        const a = flaeche(4.6, s * 0.3), b = flaeche(7.6, s * 0.45);
        if (sichtbar(a.n) < 0.25) return;
        svg += linie([pr(a.p), pr(b.p)], dunkler(hautF, 0.28), 0.18 * k, ' opacity=".55"');
      });
      const s1 = flaeche(-5, -0.35), s2 = flaeche(-5.2, 0.35);
      if (sichtbar(s1.n) > 0.3 || sichtbar(s2.n) > 0.3) svg += linie([pr(s1.p), pr(flaeche(-5.3, 0).p), pr(s2.p)], dunkler(hautF, 0.2), 0.15 * k, ' opacity=".45"');
    }

    /* ---- Das Haar ---- */
    const frisur = spec.frisur === "kahl" ? "kahl" : (FRISUR[spec.frisur] ? spec.frisur : (M.w ? "lang" : "kurz"));
    const F = FRISUR[frisur];
    const hut = spec.kopfbedeckung;
    if (F && frisur !== "kahl") {
      const dick = (F.dick || 0.9) * k * (baby ? 0.5 : 1);
      const haarS = tab.filter((q) => q[0] <= (F.bis || 3)).map((q) => schnitt(auf(q[0] - dick * 0.3 / k, 0, q[3] - 0.2), U, Vv, q[1] * k + dick, q[2] * k + dick));
      /* Haarlinie: Winkel um den Kopf (0 = Stirnmitte) → Höhe */
      const linieH = (w) => {
        const c = Math.cos(w);
        const vorn = F.stirn != null ? F.stirn : -6.4;
        /* vorn hoch an der Stirn, seitlich an den Schläfen, hinten tief im Nacken */
        const schlaefe = F.schlaefe != null ? F.schlaefe : -2;
        const nacken = F.nacken != null ? F.nacken : 4.8;
        if (c > 0) return lerp(schlaefe, vorn, Math.pow(c, 1.6)) + (F.geheimrat ? Math.pow(Math.abs(Math.sin(w * 2)), 2) * -2.4 * (c > 0.3 ? 1 : 0) : 0);
        return lerp(schlaefe + 2.5, nacken, Math.pow(-c, 0.8));
      };
      const kante = [];
      for (let i = 0; i <= 48; i++) {
        const w = (i / 48) * 2 * Math.PI;
        const y = linieH(w);
        const Fp = flaeche(y, 0);
        /* Punkt auf der Ellipse dieses Querschnitts im Winkel w */
        const pnt = auf(y, Math.sin(w) * Fp.a * 1.02, Fp.v + Math.cos(w) * Fp.b * 1.02);
        const n = unit(add(mul(U, Math.sin(w)), mul(Vv, Math.cos(w))));
        kante.push({ p: pr(pnt), s: sichtbar(n) });
      }
      /* sichtbarer Bogen der Haarlinie */
      let start = -1;
      for (let i = 0; i < 48; i++) if (kante[i].s <= 0 && kante[(i + 1) % 48].s > 0) { start = (i + 1) % 48; break; }
      let bogen = [];
      if (start < 0) bogen = kante.slice(0, 48).map((q) => q.p);
      else for (let j = 0; j < 48; j++) { const q = kante[(start + j) % 48]; if (q.s <= 0) break; bogen.push(q.p); }
      const mitte = pr(K.p);
      let maske = "";
      if (bogen.length >= 2) {
        const a = bogen[0], z = bogen[bogen.length - 1];
        const weg = (p) => [mitte[0] + (p[0] - mitte[0]) * 8, mitte[1] + (p[1] - mitte[1]) * 8];
        const obenP = pr(add(K.p, mul(T, -60 * k)));
        const pts = [weg(z)].concat([[obenP[0], obenP[1]]], [weg(a)], bogen);
        /* Die Maske ist links oder rechts herum — das Innere soll den Scheitel enthalten. */
        maske = "M" + pts.map((p) => r1(p[0]) + " " + r1(p[1])).join("L") + "Z";
      }
      const hid = h.id + "h" + h.zaehler();
      if (maske) h.defs.push('<clipPath id="' + hid + '"><path d="' + maske + '"/></clipPath>');
      const kappe = form(haarS, haarF, { hell: 0.22, dunkel: 0.24, kontur: dunkler(haarF, 0.35) });
      /* Hinten hängendes Haar (lang, Zopf) */
      if (F.laenge) {
        const nackenP = auf(-2, 0, -4.5);
        /* Das Haar fällt entlang des Rückens — im Liegen liegt es also
           unter den Schultern und nicht als Klumpen neben dem Kopf. */
        const fall = unit(add(mul(T, 0.75), [0, 0.25, 0]));
        const aufrecht = T[1] > 0.5;
        const unten = add(nackenP, mul(fall, F.laenge * M.kopf * (aufrecht ? 1 : 0.35)));
        const R0 = mv(R, [0, 0, 1]);
        const breiteH = (F.breit || 8.6) * k;
        const hs = [0, 0.3, 0.7, 1].map((t, i) => {
          const c = add(lerp3(nackenP, unten, t), mul(R0, -(t * 2.4 * k)));
          return schnitt(c, U, R0, breiteH * [1, 1.08, 1.04, 0.8][i], (5.6 - t * 3) * k);
        });
        hinten += form(hs, dunkler(haarF, 0.06), { hell: 0.2, dunkel: 0.28, kontur: dunkler(haarF, 0.4) });
        /* Strähnen als feine Linien */
        const pH = hs.map((s) => pr(s.c));
        for (let i = -2; i <= 2; i++) {
          const q = prRichtung(U);
          const ql = Math.hypot(q[0], q[1]) || 1;
          hinten += linie(pH.map((p, j) => [p[0] + q[0] / ql * i * breiteH * 0.32 * (1 - j * 0.12), p[1] + q[1] / ql * i * 0.5]), dunkler(haarF, 0.3), 0.18 * k, ' opacity=".45"');
        }
      }
      if (F.zopf) {
        const ansatz = auf(-3.5, 0, -10.2);
        const unten = add(ansatz, [0, F.zopf * M.kopf, 1 * k]);
        const zs = [0, 0.5, 1].map((t, i) => schnitt(add(lerp3(ansatz, unten, t), [0, 0, -t * 1.6 * k]), U, mv(R, [0, 0, 1]), [2.4, 2.1, 1.2][i] * k, [2.4, 2.1, 1.2][i] * k));
        hinten += form(zs, haarF, { hell: 0.22, dunkel: 0.26, kontur: dunkler(haarF, 0.4) });
      }
      svg += maske ? '<g clip-path="url(#' + hid + ')">' + kappe + "</g>" : kappe;
      if (F.glatze) {
        /* Oben kahl: die Haut über den Kranz ziehen, mit etwas Glanz. */
        const oben = tab.filter((q) => q[0] <= -3.2).map((q) => schnitt(auf(q[0], 0, q[3]), U, Vv, q[1] * k + 0.2 * k, q[2] * k + 0.2 * k));
        svg += form(oben, hautF, { hell: 0.16, dunkel: 0.2, kontur: dunkler(hautF, 0.3) }).replace(/fill="url\(#[^)]*\)"/, 'fill="' + kopfFuellung + '"');
      }
      if (F.dutt) {
        const c = auf(-8.6, 0, -8.2);
        const q = { c: pr(c), U: prRichtung(U), V: prRichtung(Vv), a: 4.1 * k, b: 4.1 * k };
        const p = pfad(ellipsePunkte(q, 16));
        const hinter = sichtbar(mul(Vv, -1)) < 0;
        const d = '<path d="' + p + '" fill="' + haarF + '" stroke="' + dunkler(haarF, 0.35) + '" stroke-width="' + r1(0.25 * k) + '"/>'
          + '<path d="' + pfad(ellipsePunkte({ c: [q.c[0] - 0.8 * k, q.c[1] - 0.8 * k], U: q.U, V: q.V, a: 2.2 * k, b: 2.2 * k }, 12)) + '" fill="' + heller(haarF, 0.25) + '" opacity=".5"/>';
        if (hinter) hinten += d; else svg += d;
      }
      if (F.locken && !hut) {
        /* Locken: kleine Bögen entlang des Umrisses der Haarkappe */
        const um = duenn(umriss(haarS.map((s) => ({ c: pr(s.c), U: prRichtung(s.U), V: prRichtung(s.V), a: s.a, b: s.b }))), 1.4 * k);
        um.forEach((p, i) => {
          if (i % 2) return;
          if (p[1] > pr(auf(1, 0, 0))[1]) return;
          svg += '<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="' + r1(1.5 * k) + '" fill="' + haarF + '" stroke="' + dunkler(haarF, 0.3) + '" stroke-width="' + r1(0.2 * k) + '"/>';
        });
      }
      /* Strich-Andeutung der Haarrichtung auf der Kappe */
      const sch = pr(auf(-10.5, 0, 1)), sv = pr(auf(-7.2, 0, 7.5));
      if (sichtbar(Vv) > -0.3 && !F.glatze) svg += linie([sch, sv], heller(haarF, 0.2), 0.3 * k, ' opacity=".35"');
      void mitte;
    }

    /* ---- Kopfbedeckung ---- */
    if (hut) {
      const art = KOPF[hut.stueck] || KOPF.muetze;
      const farbe = h.stoff(hut, art.farbe || "#444455");
      if (art.krempe) {
        const kc = auf(art.hoehe || -6.2, 0, -0.4);
        const kr = art.krempe * k;
        const q = { c: pr(kc), U: prRichtung(U), V: prRichtung(Vv), a: kr, b: kr };
        svg += '<path d="' + pfad(ellipsePunkte(q, 28)) + '" fill="' + dunkler(farbe, 0.08) + '" stroke="' + dunkler(farbe, 0.4) + '" stroke-width="' + r1(0.25 * k) + '"/>';
      }
      const hs = tab.filter((q) => q[0] <= (art.bis || -5)).map((q) => schnitt(auf(q[0] - 0.4, 0, q[3] - 0.2), U, Vv, q[1] * k + 1.1 * k, q[2] * k + 1.1 * k));
      if (art.spitze) {
        const sp = auf(-11.6 - art.spitze, 0, -6);
        hs.unshift(schnitt(sp, U, Vv, 1.2 * k, 1.2 * k));
      }
      if (art.hoch) hs.unshift(schnitt(auf(-11 - art.hoch, 0, -0.6), U, Vv, 6.2 * k, 7.4 * k));
      svg += form(hs, farbe, { hell: 0.22, dunkel: 0.26 });
      if (art.schirm) {
        const s1 = pr(auf(-5.6, -6, 8)), s2 = pr(auf(-5.2, 0, 15)), s3 = pr(auf(-5.6, 6, 8));
        svg += '<path d="M' + r1(s1[0]) + " " + r1(s1[1]) + "Q" + r1(s2[0]) + " " + r1(s2[1]) + " " + r1(s3[0]) + " " + r1(s3[1]) + 'Z" fill="' + dunkler(farbe, 0.12) + '" stroke="' + dunkler(farbe, 0.4) + '" stroke-width="' + r1(0.25 * k) + '"/>';
      }
      if (art.band) {
        const b = hs[hs.length - 1];
        const q = { c: pr(b.c), U: prRichtung(b.U), V: prRichtung(b.V), a: b.a + 0.3 * k, b: b.b + 0.3 * k };
        svg += '<path d="' + pfad(ellipsePunkte(q, 24)) + '" fill="none" stroke="' + art.band + '" stroke-width="' + r1(2.6 * k) + '" opacity=".95"/>';
      }
      if (art.bommel) {
        const b = pr(auf(-11.6 - (art.spitze || 0), 0, -6));
        svg += '<circle cx="' + r1(b[0]) + '" cy="' + r1(b[1]) + '" r="' + r1(2.2 * k) + '" fill="#f4f1ea" stroke="#c9c4ba" stroke-width="' + r1(0.2 * k) + '"/>';
      }
      if (art.tuch) {
        /* Kopftuch: über Haar, Ohren und Hals, das Gesicht bleibt frei */
        const ts = tab.map((q) => schnitt(auf(q[0], 0, q[3] - 0.6), U, Vv, q[1] * k + 1.2 * k, q[2] * k + 1.0 * k));
        const gesichtOval = [];
        for (let i = 0; i < 24; i++) {
          const w = i / 24 * 2 * Math.PI;
          const y = -4.6 * Math.cos(w) + 3 + 0 * Math.sin(w);
          const u = 0.8 * Math.sin(w);
          const Fp = flaeche(y + (Math.cos(w) < 0 ? 4 * -Math.cos(w) : 0), u);
          gesichtOval.push(pr(add(Fp.p, mul(Fp.n, 0.3 * k))));
        }
        const tid = h.id + "t" + h.zaehler();
        const gross = pr(K.p);
        h.defs.push('<clipPath id="' + tid + '"><path clip-rule="evenodd" d="M' + r1(gross[0] - 80) + " " + r1(gross[1] - 80) + "h160v160h-160Z" + pfad(gesichtOval) + '"/></clipPath>');
        svg += '<g clip-path="url(#' + tid + ')">' + form(ts, farbe, { hell: 0.2, dunkel: 0.26 }) + "</g>";
      }
    }

    /* Brille */
    if (spec.brille) {
      const zL = flaeche(augY, 0.43), zR = flaeche(augY, -0.43);
      ["L", "R"].forEach((sd, i) => {
        const Fp = i ? zR : zL;
        if (sichtbar(Fp.n) < 0.05) return;
        const c = pr(add(Fp.p, mul(Fp.n, 0.9 * k)));
        const vis = klemm(sichtbar(Fp.n), 0.3, 1);
        svg += '<ellipse cx="' + r1(c[0]) + '" cy="' + r1(c[1]) + '" rx="' + r1(1.9 * k * vis) + '" ry="' + r1(1.4 * k) + '" fill="rgba(220,235,245,.25)" stroke="#2c2a2a" stroke-width="' + r1(0.3 * k) + '"/>';
      });
      const bL = pr(add(flaeche(augY, 0.12).p, mul(Vv, 0.9 * k))), bR = pr(add(flaeche(augY, -0.12).p, mul(Vv, 0.9 * k)));
      svg += linie([bL, bR], "#2c2a2a", 0.3 * k);
      const buegel = sichtbar(U) > 0 ? [pr(add(flaeche(augY, 0.95).p, mul(Vv, 0.4 * k))), pr(auf(0.8, 7.5, -1))] : [pr(add(flaeche(augY, -0.95).p, mul(Vv, 0.4 * k))), pr(auf(0.8, -7.5, -1))];
      svg += linie(buegel, "#2c2a2a", 0.3 * k);
    }
    /* Benannte Stellen am Kopf (für Beschriftungen und Trefferflächen). */
    const seite = sichtbar(U) >= 0 ? 1 : -1;       // die dem Betrachter zugewandte Seite
    const kp = {
      scheitel: pr(auf(-11.4, 0, -0.8)), haar: pr(auf(-9.6, 0, 1.5)), stirn: pr(flaeche(-5.4, 0).p),
      auge: pr(flaeche(augY, seite * augU).p), nase: pr(nSpitze), mund: pr(flaeche(mY, 0).p),
      kinn: pr(flaeche(10.6, 0).p), wange: pr(flaeche(4.2, seite * 0.6).p), ohr: pr(auf(1.2, seite * 7.4, -0.6)),
      hinterkopf: pr(auf(-3.5, 0, -10.3)),
    };
    return { vorn: svg, hinten, punkte: kp };
  }

  /* ------------------------------------------------------------------
     10 — DIE KLEIDUNG
     ------------------------------------------------------------------ */
  /* Ärmel: 0 ohne, 0.5 kurz, 1 halb, 2 lang. oben/unten: Rumpfhöhen. */
  const OBERTEIL = {
    tshirt: { aermel: 0.5, oben: 54 },
    hemd: { aermel: 2, kragen: true, knopf: true, oben: 55 },
    pullover: { aermel: 2, oben: 55 },
    bluse: { aermel: 2, kragen: true, knopf: true, oben: 54 },
    kellnerhemd: { aermel: 2, kragen: true, knopf: true, fliege: "#1d1d22", oben: 55 },
    polizeihemd: { aermel: 2, kragen: true, knopf: true, oben: 55 },
    arztkittel: { aermel: 2, kragen: true, knopf: true, oben: 55 },
    warnweste: { aermel: 0, streifen: "#d9d4c4", oben: 50 },
    feuerwehrjacke: { aermel: 2, reiss: true, streifen: "#d9c64a", oben: 55 },
    weihnachtsmantel: { aermel: 2, knopf: true, oben: 55 },
    badeanzug: { aermel: 0, oben: 44, unten: -9 },
    bikinioberteil: { aermel: 0, oben: 38, unten: 26 },
    rollkragen: { aermel: 2, rollkragen: true, oben: 56 },
    bademantel: { aermel: 2, kragen: true, oben: 55 },
    /* Lehrbuch: Körperteile werden an Menschen in Unterwäsche gezeigt. */
    sporttop: { aermel: 0, oben: 41, unten: 23 },
    unterhemd: { aermel: 0, oben: 50 },
  };
  const HOSE = {
    unterhose: { lang: false, bis: 0.12, bund: 7 },
    boxershorts: { lang: false, bis: 0.3, bund: 8 },
    hose: { lang: true, gurt: true, bund: 12 },
    jeans: { lang: true, gurt: "#5a3b22", bund: 11 },
    anzughose: { lang: true, gurt: "#1c1c1f", bund: 12 },
    arbeitshose: { lang: true, gurt: true, bund: 13 },
    shorts: { lang: false, bis: 0.55, gurt: true, bund: 11 },
    badehose: { lang: false, bis: 0.25, bund: 6 },
    bikinihose: { lang: false, bis: 0.08, bund: 3 },
    rock: { rock: true, saum: 0.95, weite: 1.1, bund: 13 },
    rock_knie: { rock: true, saum: 0.95, weite: 1.1, bund: 13 },
  };
  const KLEID = {
    sommerkleid: { aermel: 0, saum: 0.95, weite: 1.12, oben: 53.5 },
    abendkleid: { aermel: 0, saum: 1.9, weite: 1.05, oben: 53 },
    bademantel: { aermel: 2, saum: 1.2, weite: 1.12, oben: 55 },
  };
  const JACKE = {
    jacke: { aermel: 2, reiss: true },
    mantel: { aermel: 2, knopf: true, kragen: true, lang: 1.15 },
    weste: { aermel: 0, knopf: true, weste: true },
    kittel: { aermel: 2, knopf: true, kragen: true, lang: 1.05 },
    arztkittel: { aermel: 2, knopf: true, kragen: true, lang: 1.1 },
    bademantel: { aermel: 2, kragen: true, lang: 1.2 },
  };
  const SCHUH = {
    halbschuh: { schnuerung: true },
    turnschuh: { weiss: true, schnuerung: true, sohle: "#f3f1ec" },
    stiefel: { schaft: 0.45 },
    gummistiefel: { schaft: 0.3, sohle: "#26282a" },
    sandale: { offen: true },
  };
  const KOPF = {
    muetze: { bis: -4.5, farbe: "#7a3b3b" },
    hut: { krempe: 13, hoehe: -6.5, hoch: 5, bis: -6, farbe: "#4a3b2e", band: "#2a211c" },
    kappe: { bis: -5, schirm: true, farbe: "#2f5f95" },
    helm: { bis: -4.6, krempe: 10.5, hoehe: -5, farbe: "#e8c23a" },
    weihnachtsmuetze: { bis: -5, spitze: 11, band: "#f4f1ea", bommel: true, farbe: "#b8272a" },
    kopftuch: { tuch: true, bis: 12, farbe: "#6e3f5a" },
    kochmuetze: { bis: -5, hoch: 9, farbe: "#f6f6f2" },
  };
  const FRISUR = {
    kurz: { stirn: -6.8, schlaefe: -1.8, nacken: 3.2, dick: 0.8 },
    lang: { stirn: -6.2, schlaefe: 1.5, nacken: 6, dick: 1.0, laenge: 1.3, bis: 4 },
    zopf: { stirn: -6.6, schlaefe: -1, nacken: 3.5, dick: 0.75, zopf: 1.15 },
    dutt: { stirn: -6.6, schlaefe: -1.2, nacken: 3.2, dick: 0.7, dutt: true },
    locken: { stirn: -6.4, schlaefe: -1, nacken: 4, dick: 1.8, locken: true },
    pony: { stirn: -2.8, schlaefe: -0.5, nacken: 5, dick: 1.0, laenge: 0.55, breit: 8.2, bis: 3.5 },
    glatze: { stirn: -13, schlaefe: 0.4, nacken: 3.8, dick: 0.6, glatze: true },
    kahl: null,
  };
  /* Stücke, die eine eigene Grundfarbe haben */
  const STUECK_FARBE = {
    kellnerhemd: "#f4f4f0", arztkittel: "#f6f7f5", warnweste: "#e8e03a", feuerwehrjacke: "#2c2f36",
    polizeihemd: "#aec8e2", weihnachtsmantel: "#b8272a", schuerze: "#f1ead8", kittel: "#e9e6de",
    jeans: "#3d5f8c", anzughose: "#2a2c33", arbeitshose: "#3f5570", bademantel: "#f3f0ea",
    turnschuh: "#f2f2f0", gummistiefel: "#2f5a35", stiefel: "#4a3326", halbschuh: "#4a3326",
  };

  /* Glatze: Haar nur als Kranz — die Maske von oben wird durch eine
     zweite, untere Linie ersetzt. Einfach gehalten: Kranz = kurze Haare
     mit sehr hoher Stirn, oben mit Hautfarbe übermalt. */
  const API = {
    zeichne, POSEN, gehPose, mische, pose, massFuer, HAUT, HAAR, FARBE,
    OBERTEIL, HOSE, KLEID, JACKE, SCHUH, KOPF, FRISUR,
    HALTUNGEN: ["stehen", "kontrapost", "gehen", "sitzen", "lesen", "sitzen_boden", "schneidersitz", "fersensitz",
      "hocken", "knien", "knien_halb", "knien_vor", "krabbeln", "liegen", "winken", "halten", "zeigen", "werfen", "servieren"],
    /* Haltungen, bei denen das Gesäß auf einer Sitzfläche liegt */
    SITZEND: { sitzen: 1, lesen: 1, sitzen_seit: 1 },
  };
  W.DMA_MENSCH = API;
})(typeof window !== "undefined" ? window : globalThis);
