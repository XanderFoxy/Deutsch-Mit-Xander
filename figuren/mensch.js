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
  /* FASSUNG 836 — XANDER (Funk 217): „um alle Positionen die Sie einnehmen
     können ob sie im Schneidersitz sitzen ob sie in der Hocke sitzen ob
     sie auf den Unterschenkeln hocken ob sie aufrecht auf den Unterschenkel
     hocken … ob sie auf allen Vieren sind ob sie auf dem Rücken liegen ob
     sie auf dem Bauch liegen … ob sie in der Wanne sitzen und die Beine
     angewinkelt haben“.
     Die Haltungen von 834 waren geschätzte Winkel — der Schneidersitz saß
     42 cm über dem Boden auf den Unterschenkeln, im Fersensitz schwebten
     die Knie, in der Hocke stand man auf den Zehen, auf allen vieren
     berührten weder Hände noch Knie den Boden. Jetzt sind sie aus
     ZIELPUNKTEN gerechnet (Knie, Knöchel, Ellbogen, Hand; Zwei-Glieder-
     Rechnung wie in der Trickfilm-Technik) und am Boden ausgerichtet:
     die Körperteile, die aufliegen, liegen auf (± 2 cm), und kein Glied
     steckt im Rumpf oder im anderen Bein (Messung mit messen: true). */
  Object.assign(POSEN, {
    /* Schneidersitz: Gesäß am Boden, Knie weit außen und tief, die Unterschenkel kreuzen sich vor dem Körper (der linke vorn), jeder Fuß liegt auf der Außenkante unter dem anderen Bein; die Hände ruhen auf den Knien. */
    schneidersitz: { kipp: -1, lende: 8, brust: 6, nacken: 10, kopf: -6, unterarmL: -70, handL: -6, fingerL: 0.35, unterarmR: -70, handR: -6, fingerR: 0.35, huefteL: {vor:  56,  seit:  93,  dreh:  180}, knieL: 141, huefteR: {vor:  75,  seit:  60,  dreh:  139}, knieR: 155, fussL: 18, fussR: 109, schulterL: {vor:  16,  seit:  14,  dreh:  0}, ellbogenL: 66, schulterR: {vor:  37,  seit:  3,  dreh:  -37}, ellbogenR: 27 },
    /* Hocke mit den Fersen am Boden: Gesäß tief zwischen den Fersen, Knie nach vorn und außen, Oberkörper vorgeneigt, damit der Schwerpunkt über den Füßen bleibt. */
    hocken: { kipp: 33, lende: 8, brust: 10, nacken: -24, kopf: -12, unterarmL: -20, handL: -6, fingerL: 0.45, unterarmR: -20, handR: -6, fingerR: 0.45, huefteL: {vor:  57,  seit:  152,  dreh:  154}, knieL: 144, huefteR: {vor:  57,  seit:  152,  dreh:  154}, knieR: 144, fussL: -57, fussR: -57, schulterL: {vor:  59,  seit:  9,  dreh:  -33}, ellbogenL: 31, schulterR: {vor:  59,  seit:  9,  dreh:  -33}, ellbogenR: 31 },
    /* Fersensitz: auf den Unterschenkeln sitzen — Knie und Fußrücken am Boden, das Gesäß ruht auf den Fersen, der Rücken aufrecht, die Hände auf den Oberschenkeln. */
    fersensitz: { kipp: 1, lende: -2, brust: 4, nacken: 6, kopf: -4, unterarmL: -75, handL: -6, fingerL: 0.3, unterarmR: -75, handR: -6, fingerR: 0.3, fz: -45, fy: -3, huefteL: {vor:  64,  seit:  0,  dreh:  -9}, knieL: 159, huefteR: {vor:  64,  seit:  0,  dreh:  -9}, knieR: 159, fussL: 38, fussR: 38, schulterL: {vor:  19,  seit:  -9,  dreh:  -33}, ellbogenL: 12, schulterR: {vor:  19,  seit:  -9,  dreh:  -33}, ellbogenR: 12 },
    /* Kniestand: aufrecht auf den Knien, Oberschenkel und Rumpf senkrecht, Unterschenkel und Fußrücken liegen hinten auf dem Boden. */
    knien: { kipp: 0, lende: 2, brust: -2, nacken: 6, kopf: -4, schulterL: {vor:  4,  seit:  8}, ellbogenL: 14, unterarmL: 10, handL: 6, fingerL: 0.38, schulterR: {vor:  -2,  seit:  9}, ellbogenR: 12, unterarmR: 6, handR: 4, fingerR: 0.36, fz: -29, fy: 0, huefteL: {vor:  5,  seit:  2,  dreh:  -1}, knieL: 94, huefteR: {vor:  5,  seit:  2,  dreh:  -1}, knieR: 94, fussL: 63, fussR: 63 },
    /* Vierfüßlerstand: Hände unter den Schultern, Knie unter der Hüfte, Rücken waagrecht, Blick nach vorn unten. */
    krabbeln: { kipp: 86, lende: -6, brust: -6, nacken: -40, kopf: -22, unterarmL: -85, handL: 75, fingerL: 0.08, unterarmR: -85, handR: 75, fingerR: 0.08, fz: -29, fy: -3, huefteL: {vor:  87,  seit:  60,  dreh:  60}, knieL: 91, huefteR: {vor:  87,  seit:  60,  dreh:  60}, knieR: 91, fussL: 62, fussR: 62, schulterL: {vor:  62,  seit:  10,  dreh:  -18}, ellbogenL: 33, schulterR: {vor:  62,  seit:  10,  dreh:  -18}, ellbogenR: 33 },
    /* Rückenlage: gerade ausgestreckt, Hinterkopf, Schulterblätter, Gesäß und Fersen am Boden, die Arme neben dem Körper, die Füße fallen locker nach außen. */
    liegen: { kipp: -90, lende: 0, brust: 0, nacken: -7, kopf: 2, schulterL: {vor:  -13,  seit:  10}, ellbogenL: 8, unterarmL: -75, handL: 0, fingerL: 0.35, schulterR: {vor:  -14,  seit:  11}, ellbogenR: 10, unterarmR: -75, handR: 0, fingerR: 0.35, huefteL: {vor:  0,  seit:  6,  dreh:  -16}, knieL: 3, fussL: 22, huefteR: {vor:  0,  seit:  6,  dreh:  -16}, knieR: 4, fussR: 22 },
    /* Bauchlage: Brust, Bauch und Oberschenkel am Boden, der Kopf zur Seite gedreht auf der Wange, die Arme angewinkelt neben dem Kopf, die Fußrücken am Boden. */
    bauchlage: { kipp: 90, lende: 0, brust: -2, nacken: 21, kopf: 0, kopfDreh: 78, fz: -65, unterarmL: -85, unterarmR: -85, handL: 10, handR: 10, fingerL: 0.25, fingerR: 0.25, huefteL: {vor:  0,  seit:  5,  dreh:  8}, knieL: 4, huefteR: {vor:  0,  seit:  5,  dreh:  8}, knieR: 6, schulterL: {vor:  19,  seit:  105,  dreh:  82}, ellbogenL: 134, schulterR: {vor:  19,  seit:  105,  dreh:  82}, ellbogenR: 134, fussL: 21, fussR: 21 },
    /* Seitenlage (auf der linken Seite): das untere Bein fast gestreckt, das obere angewinkelt davor auf dem Boden, der untere Arm unter dem Kopf, die obere Hand vor der Brust am Boden. */
    seitenlage: { kipp: -90, dreh: 152, lende: 4, brust: 4, nacken: 4, kopf: 4, kopfRoll: -33, unterarmL: -20, unterarmR: -70, handL: 0, handR: 20, fingerL: 0.4, fingerR: 0.3, huefteL: {vor:  21,  seit:  -23,  dreh:  -57}, knieL: 37, huefteR: {vor:  41,  seit:  38,  dreh:  60}, knieR: 75, fussL: 122, fussR: 109, schulterL: {vor:  26,  seit:  -118,  dreh:  -115}, ellbogenL: 116, schulterR: {vor:  47,  seit:  50,  dreh:  55}, ellbogenR: 97 },
    /* Am Boden sitzen mit angewinkelten Beinen: Füße flach, Knie hoch, die Arme um die Knie gelegt. */
    sitzen_angewinkelt: { kipp: -4, lende: 10, brust: 10, nacken: 14, kopf: -8, unterarmL: -60, unterarmR: -60, handL: -10, handR: -10, fingerL: 0.55, fingerR: 0.55, huefteL: {vor:  41,  seit:  174,  dreh:  176}, knieL: 115, huefteR: {vor:  41,  seit:  174,  dreh:  176}, knieR: 115, fussL: 27, fussR: 27, schulterL: {vor:  39,  seit:  9,  dreh:  -46}, ellbogenL: 87, schulterR: {vor:  38,  seit:  10,  dreh:  -53}, ellbogenR: 75 },
    /* In der Badewanne: zurückgelehnt sitzen, die Beine angewinkelt, die Hände auf den Knien. */
    baden: { kipp: -13, lende: 6, brust: 6, nacken: 22, kopf: -4, unterarmL: -70, unterarmR: -70, handL: -8, handR: -8, fingerL: 0.35, fingerR: 0.35, huefteL: {vor:  51,  seit:  173,  dreh:  174}, knieL: 115, huefteR: {vor:  51,  seit:  173,  dreh:  174}, knieR: 115, fussL: 26, fussR: 26, schulterL: {vor:  27,  seit:  18,  dreh:  -26}, ellbogenL: 117, schulterR: {vor:  27,  seit:  18,  dreh:  -26}, ellbogenR: 117 },
    /* Grätschsitz wie beim Turnen: aufrecht, die Beine gestreckt und weit gespreizt, Kniescheiben und Zehen nach oben, die Hände vorn am Boden. */
    graetschsitz: { kipp: 8, lende: 6, brust: 4, nacken: 8, kopf: -8, unterarmL: -80, unterarmR: -80, handL: 70, handR: 70, fingerL: 0.12, fingerR: 0.12, huefteL: {vor:  39,  seit:  121,  dreh:  125}, knieL: 39, huefteR: {vor:  39,  seit:  121,  dreh:  125}, knieR: 39, fussL: -1, fussR: -1, schulterL: {vor:  42,  seit:  -1,  dreh:  -110}, ellbogenL: 12, schulterR: {vor:  42,  seit:  -1,  dreh:  -110}, ellbogenR: 12 },
    /* Auf dem Stuhl mit übergeschlagenem Bein: das rechte Knie liegt über dem linken, der rechte Unterschenkel hängt vorn schräg herab, die Hände ruhen auf dem Knie. */
    sitzen_ueberkreuz: { kipp: 0, lende: -4, brust: 4, nacken: 8, kopf: -6, huefteL: {vor:  86,  seit:  5,  dreh:  -4}, knieL: 86, fussL: 0, unterarmL: -70, unterarmR: -70, handL: -10, handR: -10, fingerL: 0.35, fingerR: 0.35, huefteR: {vor:  68,  seit:  -134,  dreh:  -127}, knieR: 54, fussR: 28, schulterL: {vor:  26,  seit:  8,  dreh:  -43}, ellbogenL: 68, schulterR: {vor:  25,  seit:  7,  dreh:  -51}, ellbogenR: 74 },
    /* Anlehnen (an eine Wand): der ganze Körper leicht zurückgeneigt, die Füße ein Stück vor der Wand, das rechte Bein über das linke gekreuzt, die Arme verschränkt. */
    anlehnen: { lende: 2, brust: -1, nacken: 32, kopf: -2, huefteL: {vor:  0,  seit:  2,  dreh:  -6}, knieL: 2, fussL: 6, huefteR: {vor:  8,  seit:  -20,  dreh:  -55}, knieR: 10, fussR: 42, kipp: -8, schulterL: {vor:  34,  seit:  -6,  dreh:  -73}, ellbogenL: 94, schulterR: {vor:  28,  seit:  -6,  dreh:  -81}, ellbogenR: 100, unterarmL: 0, unterarmR: 0, handL: -45, handR: -50, fingerL: 0.55, fingerR: 0.6 },
    /* Laufen/Joggen: Oberkörper leicht vor, das vordere Bein greift aus, das hintere ist hoch angewinkelt, die Arme im rechten Winkel gegengleich. */
    laufen: { kipp: 9, lende: 2, brust: 0, brustDreh: -8, nacken: -4, kopf: -4, schulterL: {vor:  -38,  seit:  10}, ellbogenL: 95, unterarmL: 20, handL: 0, fingerL: 0.6, schulterR: {vor:  42,  seit:  6}, ellbogenR: 92, unterarmR: 20, handR: 0, fingerR: 0.6, huefteL: {vor:  32,  seit:  2,  dreh:  -4}, knieL: 22, fussL: -8, huefteR: {vor:  -24,  seit:  3,  dreh:  -6}, knieR: 98, fussR: 34 },
    /* Treppensteigen: der linke Fuß steht eine Stufe (17 cm) höher, das rechte Bein drückt sich hinten über die Zehen ab. */
    treppe: { kipp: 7, lende: 2, brust: 2, nacken: 2, kopf: -8, brustDreh: 5, schulterL: {vor:  -14,  seit:  8}, ellbogenL: 22, unterarmL: 10, handL: 4, fingerL: 0.4, schulterR: {vor:  22,  seit:  8}, ellbogenR: 30, unterarmR: 10, handR: 4, fingerR: 0.4, huefteR: {vor:  1,  seit:  1,  dreh:  -4}, knieR: 10, huefteL: {vor:  51,  seit:  2,  dreh:  3}, knieL: 44, fussL: 1, fussR: 6 },
    /* Bücken: aus der Hüfte vorgebeugt, die Knie leicht gebeugt, die Hände reichen bis kurz über den Boden. */
    buecken: { kipp: 78, lende: 16, brust: 12, nacken: -14, kopf: -14, fingerL: 0.3, fingerR: 0.3, unterarmL: -30, unterarmR: -30, handL: 0, handR: 0, huefteL: {vor:  75,  seit:  172,  dreh:  174}, knieL: 58, huefteR: {vor:  75,  seit:  172,  dreh:  174}, knieR: 58, fussL: -31, fussR: -31, schulterL: {vor:  84,  seit:  -29,  dreh:  174}, ellbogenL: 12, schulterR: {vor:  84,  seit:  -29,  dreh:  174}, ellbogenR: 12 },
    /* Strecken: auf den Zehenspitzen, die Arme gerade über den Kopf, der Blick nach oben. */
    strecken: { lende: -3, brust: -8, nacken: -8, kopf: -16, schulterL: {vor:  168,  seit:  16}, ellbogenL: 6, unterarmL: 70, handL: 12, fingerL: 0.06, schulterR: {vor:  170,  seit:  14}, ellbogenR: 5, unterarmR: 70, handR: 12, fingerR: 0.06, huefteL: {vor:  0,  seit:  3,  dreh:  -4}, knieL: 0, fussL: 32, huefteR: {vor:  0,  seit:  3,  dreh:  -4}, knieR: 0, fussR: 32 },
    /* Arme verschränkt: die Unterarme liegen schräg vor der unteren Brust, der linke vorn, die Hände an den Oberarmen — nicht durch den Brustkorb. */
    arme_verschraenkt: { lende: 1, brust: -2, nacken: 6, kopf: -2, huefteL: {vor:  3,  seit:  3,  dreh:  -6}, knieL: 3, fussL: 0, huefteR: {vor:  -3,  seit:  3,  dreh:  -6}, knieR: 2, fussR: 0, schulterL: {vor:  32,  seit:  -7,  dreh:  -76}, ellbogenL: 104, schulterR: {vor:  25,  seit:  -6,  dreh:  -83}, ellbogenR: 102, unterarmL: 0, unterarmR: 0, handL: -45, handR: -50, fingerL: 0.55, fingerR: 0.6 },
    /* Hände in den Hüften: die Handgelenke über dem Beckenkamm, die Ellbogen weit nach außen und etwas nach hinten. */
    haende_huefte: { lende: 1, brust: -2, nacken: 6, kopf: -6, huefteL: {vor:  3,  seit:  3,  dreh:  -6}, knieL: 3, fussL: 0, huefteR: {vor:  -3,  seit:  3,  dreh:  -6}, knieR: 2, fussR: 0, roll: 2, brustRoll: -2, schulterL: {vor:  -17,  seit:  37,  dreh:  -76}, ellbogenL: 97, schulterR: {vor:  -16,  seit:  41,  dreh:  -77}, ellbogenR: 97, unterarmL: -60, unterarmR: -60, handL: -25, handR: -25, fingerL: 0.2, fingerR: 0.2 },
  });
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
    /* FASSUNG 836: die Kappe am Anfang (Schulter, Hüfte, Knie …) wird
       markiert — dort darf die Kontur offen bleiben, damit das Glied
       ohne Naht in den Rumpf bzw. in das vorige Glied übergeht. */
    anfangRichtig.forEach((p) => { p.kA = 1; });
    endeRichtig.forEach((p) => { p.kE = 1; });
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
  function duenn(pts, min, fein) {
    /* höchstens gut zwanzig Punkte je Umriss — mehr sieht man nicht */
    let umfang = 0;
    for (let i = 1; i < pts.length; i++) umfang += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    min = Math.max(min, umfang / (fein || 22));
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
    /* FASSUNG 836 — GRENZE (verbindlich): Menschen in Haltungen sind immer
       bekleidet. Fehlt, was Becken oder Rumpf bedeckt, kommt ein
       Grundstück dazu (Hose, T-Shirt). Ausnahmen nur für die Lehrbuch-
       tafeln: die Lehrbuch-Haltung bekommt Unterwäsche (Frauen zusätzlich
       ein Sporttop), das Muskelbild und das Ungeborene bleiben Schema. */
    const kl = Object.assign({}, spec.kleidung || {});
    if (!spec.muskeln && spec.pose !== "foetus") {
      const hat = (pl) => kl[pl] && kl[pl].stueck && kl[pl].stueck !== "nichts";
      const kleidDa = hat("kleid") && KLEID[kl.kleid.stueck];
      const langerMantel = hat("jacke") && JACKE[kl.jacke.stueck] && JACKE[kl.jacke.stueck].lang;
      const lehrbuch = spec.pose === "lehrbuch";
      if (!hat("unterteil") && !kleidDa && !langerMantel && !(hat("oberteil") && kl.oberteil.stueck === "badeanzug")) kl.unterteil = { stueck: lehrbuch ? "unterhose" : "hose", farbe: "grau" };
      if (!hat("oberteil") && !kleidDa && !hat("jacke")) {
        if (!lehrbuch) kl.oberteil = { stueck: "tshirt", farbe: "weiss" };
        else if (spec.geschlecht === "w") kl.oberteil = { stueck: "sporttop", farbe: "grau" };
      }
    }
    const stueck = (platz) => { const w = kl[platz]; return w && w.stueck && w.stueck !== "nichts" && w.stueck !== "barfuss" ? w : null; };
    const zub = stueck("zubehoer");

    /* Alle Querschnitte zuerst im Körperraum sammeln, dann projizieren.
       teile: { name, tiefe, schnitte[], farbe, art, extra } */
    const teile = [];
    const V3 = (R, v) => mv(R, v);

    /* Querschnittsreihe entlang eines Knochens. prof: [s, a, b, vOff, uOff] */
    /* FASSUNG 836: q[4] schiebt den Querschnitt nach AUSSEN (weg von der
       Körpermitte) — „aussen“ ist +1 für die linke, −1 für die rechte
       Seite. So sitzt der Deltamuskel außen an der Schulter und der
       innere Schenkelmuskel innen über dem Knie, auf beiden Seiten. */
    function knochen(A, R, laenge, prof, skal, aussen) {
      const U = V3(R, [1, 0, 0]), Vv = V3(R, [0, 0, 1]), T = V3(R, [0, 1, 0]);
      skal = skal || 1;
      const sa = aussen == null ? 1 : aussen;
      return prof.map((q) => schnitt(
        add(add(add(A, mul(T, q[0] * laenge)), mul(Vv, (q[3] || 0) * g * skal)), mul(U, (q[4] || 0) * g * skal * sa)),
        U, Vv, q[1] * g * skal, q[2] * g * skal));
    }
    const aufblasen = (ss, d, von, bis) => ss.filter((s, i) => (von == null || i >= von) && (bis == null || i <= bis))
      .map((s) => schnitt(s.c, s.U, s.V, s.a + d, s.b + d));

    /* --- Rumpf ----------------------------------------------------- */
    /* [Höhe über dem Hüftgelenk in cm (Erwachsener), a, b, vor] — Frau
       und Mann getrennt: Taille, Hüfte, Brustkorb, Schulterlinie. */
    /* FASSUNG 836: Schultergürtel. Die Schulterhöhe (Schulterdach) gehört
       zum Rumpf und fällt vom Hals schräg zum Deltamuskel ab — vorher
       hörte der Rumpf innen am Schultergelenk auf, und die Ärmel saßen
       wie Polster obendrauf. Brustkorb etwas schmaler, damit die Arme
       am Körper anliegen. */
    const RUMPF_M = [
      [-9, 7.5, 5.5, -2.6], [-5, 15.6, 9.8, -2.6], [0, 17.0, 10.6, -1.8], [6, 16.2, 10.4, -0.4],
      [13, 14.6, 10.0, 0.4], [20, 15.2, 10.4, 0.6], [28, 16.2, 11.4, 0.9], [35, 16.8, 11.4, 0.9],
      [41, 17.4, 10.6, 0.3], [46, 18.0, 9.8, -0.2], [50, 18.8, 8.8, -0.5], [53.2, 17.8, 7.6, -0.6], [55.5, 13.4, 6.6, -0.6], [57.5, 8.2, 5.8, -0.6], [58.5, 6.2, 5.4, -0.6],
    ];
    const RUMPF_W = [
      [-9, 8, 5.8, -3.0], [-5, 17.4, 10.6, -3.0], [0, 18.2, 11.0, -2.2], [6, 16.4, 10.4, -0.6],
      [13, 13.2, 9.2, 0.4], [20, 13.8, 9.6, 0.8], [26, 14.8, 11.0, 1.8], [31, 15.2, 10.8, 1.6],
      [37, 15.4, 9.8, 0.6], [42, 15.8, 9.2, -0.1], [46.5, 16.4, 8.4, -0.4], [50, 17.2, 7.6, -0.5], [52.8, 16.2, 6.8, -0.6], [54.8, 11.8, 5.9, -0.6], [56.2, 7.4, 5.3, -0.6], [57, 5.6, 5.0, -0.6],
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
        const sn = schnitt(c, U, Vv, q[1] * M.k * breit + dicke, q[2] * M.k * breit * (M.erw ? 1 : 1.05) + dicke);
        sn.hy = q[0];
        out.push(sn);
      });
      return out;
    }

    /* --- Profile der Gliedmaßen (Erwachsener, cm) --------------------- */
    /* FASSUNG 836 — XANDER (Funk 217): „realistische Menschen … mit
       realistischen Körperteilen“. Die Glieder waren Röhren mit gleich-
       mäßig abnehmendem Querschnitt — Gliederpuppen. Jetzt folgen die
       Profile den Muskelbäuchen, wie sie der Zeichenunterricht lehrt:
       der Deltamuskel rundet die Schulter nach außen, der Bizeps wölbt
       den Oberarm vorn, am Ellbogen wird er flach und breit
       (Knochenvorsprünge), der Unterarm ist oben am dicksten (Speichen-
       muskel außen) und läuft zum schmalen Handgelenk aus; der
       Oberschenkel ist oben außen voll, über dem Knie innen gewölbt
       (innerer Schenkelmuskel), das Knie schmaler als beide; die Wade
       sitzt hinten im oberen Drittel, das Schienbein vorn bleibt gerade,
       der Knöchel ist schmal.
       [Anteil der Knochenlänge, quer, tief, vorn, außen] in cm beim
       erwachsenen Mann. */
    const OA = [[-0.115, 1.2, 1.5, -0.2, -0.7], [-0.085, 2.8, 3.2, -0.2, -0.4], [-0.035, 4.1, 4.5, -0.2, 0.1], [0.02, 4.9, 5.1, -0.1, 0.5], [0.1, 5.3, 5.4, 0, 0.9], [0.22, 5.0, 5.2, 0.1, 0.5],
      [0.36, 4.4, 4.9, 0.2, 0], [0.52, 4.3, 5.0, 0.45, 0], [0.7, 4.1, 4.6, 0.3, 0], [0.87, 4.0, 3.7, -0.1, 0], [1.03, 3.6, 3.4, -0.3, 0]];
    const UA = [[-0.07, 3.6, 3.4, -0.5, 0], [0.12, 4.1, 3.9, 0, 0.22], [0.3, 4.0, 3.6, 0.1, 0.25], [0.52, 3.2, 3.1, 0, 0.05],
      [0.74, 2.4, 2.9, 0, 0], [0.9, 2.0, 2.8, 0, 0], [1.0, 2.0, 2.8, 0, 0]];
    const OS = [[-0.06, 8.4, 8.8, 0.2, 0.2], [0.1, 8.7, 8.8, 0.6, 0.7], [0.3, 8.0, 8.4, 0.9, 0.35], [0.5, 7.1, 7.5, 0.85, 0.05],
      [0.7, 6.1, 6.5, 0.55, -0.4], [0.85, 5.4, 5.5, 0.45, -0.5], [0.97, 4.8, 5.0, 0.4, -0.1], [1.05, 4.6, 4.8, 0.2, 0]];
    const US = [[-0.05, 4.7, 4.8, 0.4, 0], [0.07, 4.4, 4.6, 0.3, 0], [0.2, 4.8, 5.5, -1.2, -0.3], [0.33, 4.9, 5.7, -1.4, -0.2],
      [0.5, 4.2, 4.7, -0.9, 0], [0.68, 3.3, 3.5, -0.3, 0], [0.86, 2.8, 2.9, 0, 0], [1.0, 3.2, 3.2, 0, 0]];
    /* Weniger Muskelzeichnung bei Frauen, Kindern und alten Menschen:
       das Profil wird zum Mittel seiner Nachbarn hin geglättet. */
    const weich = (prof, t) => t <= 0 ? prof : prof.map((q, i) => {
      const a = prof[Math.max(0, i - 1)], b = prof[Math.min(prof.length - 1, i + 1)];
      return q.map((v, j) => j === 0 ? v : lerp(v, (a[j] + 2 * v + b[j]) / 4, t));
    });
    const glatt2 = (M.w ? 0.5 : 0) + (M.erw ? 0 : 0.7) + (spec.alter === "alt" ? 0.5 : 0);
    const OAp = weich(OA, Math.min(1, glatt2)), UAp = weich(UA, Math.min(1, glatt2 * 0.7)),
      OSp = weich(OS, Math.min(1, glatt2 * 0.6)), USp = weich(US, Math.min(1, glatt2 * 0.6));
    const kindArm = M.erw ? 1 : 1.08;
    const frauArm = M.w ? 0.88 : 1;
    const frauBein = M.w ? 1.03 : 1;
    const altGlied = spec.alter === "alt" ? 0.93 : 1;

    const tiefeVon = (ss) => { let t = 0; ss.forEach((s) => { t += cam.proj(s.c)[2]; }); return t / ss.length; };

    /* ---- Beine, Füße ---- */
    const hose = stueck("unterteil"), schuhe = stueck("schuhe");
    /* Im Kleid-Platz kann auch die Schürze liegen — sie ist kein Kleid. */
    const kleid = stueck("kleid") && KLEID[stueck("kleid").stueck] ? stueck("kleid") : null;
    const hoseArt = hose ? HOSE[hose.stueck] || HOSE.hose : null;
    ["L", "R"].forEach((sd) => {
      const H = S["huefte" + sd], K = S["knie" + sd], Fu = S["fuss" + sd];
      const aussen = sd === "L" ? 1 : -1;
      const os = knochen(H.p, H.R, M.oberschenkel, OSp, f * frauBein * altGlied, aussen);
      const us = knochen(K.p, K.R, M.unterschenkel, USp, f * altGlied, aussen);
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
      const aussen = sd === "L" ? 1 : -1;
      const oa = knochen(Sh.p, Sh.R, M.oberarm, OAp, f * frauArm * kindArm * altGlied, aussen);
      const ua = knochen(E.p, E.R, M.unterarm, UAp, f * frauArm * kindArm * altGlied, aussen);
      teile.push({ name: "arm" + sd, tiefe: (tiefeVon(oa) + tiefeVon(ua)) / 2, oberarm: oa, unterarm: ua, hand: Hd, seite: sd });
    });

    /* ---- Rumpf, Hals, Kopf ---- */
    const rumpf = rumpfSchnitte(rumpfTab, 0);
    const halsR = S.hals.R;
    /* FASSUNG 836: unten breiter (Kapuzenmuskel), oben unter dem Kiefer schmal */
    const HALS = [[-0.12, 7.4, 5.9, -0.9], [0.18, 6.0, 5.6, -0.5], [0.55, 5.3, 5.3, 0.2], [1.0, 5.1, 5.3, 0.7]];
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
      /* FASSUNG 836: der Kopf im eigenen Rahmen — im Liegen ruht er mit
         dem Hinterkopf bzw. der Wange auf dem Boden, statt einzusinken. */
      alle.push(schnitt(S.kopf.p, mv(S.kopf.R, [1, 0, 0]), mv(S.kopf.R, [0, 0, 1]), M.kopf * 0.34, M.kopf * 0.43));
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
    /* FASSUNG 836 — MESSEN (für die Sonde und beim Bauen der Haltungen):
       wie hoch über dem Boden liegt jeder Körperteil an seiner tiefsten
       Stelle (cm), und steckt ein Glied im Rumpf oder im anderen Bein? */
    const mess = spec.messen ? (function () {
      const tief = (ss) => {
        let m = 1e9;
        ss.forEach((q) => { const w = cam.welt(q.c), Uw = cam.welt(q.U), Vw = cam.welt(q.V); m = Math.min(m, anker[1] - (w[1] + Math.sqrt((q.a * Uw[1]) ** 2 + (q.b * Vw[1]) ** 2))); });
        return Math.round(m * 10) / 10;
      };
      const h = {};
      teile.forEach((t) => {
        if (t.oberschenkel) {
          const sd = t.seite;
          h["fuss" + sd] = tief(t.fuss); h["ferse" + sd] = tief(t.fuss.slice(0, 2)); h["zeh" + sd] = tief(t.fuss.slice(-2));
          h["knie" + sd] = tief(t.unterschenkel.slice(0, 2).concat(t.oberschenkel.slice(-2)));
          h["unterschenkel" + sd] = tief(t.unterschenkel); h["oberschenkel" + sd] = tief(t.oberschenkel);
        }
        if (t.oberarm) {
          const sd = t.seite, Hd = S["hand" + sd];
          h["ellbogen" + sd] = tief(t.oberarm.slice(-2).concat(t.unterarm.slice(0, 2)));
          h["unterarm" + sd] = tief(t.unterarm);
          /* wie beim Boden-Anker: Handmitte, 1,5 cm Halbmesser */
          h["hand" + sd] = tief([schnitt(add(Hd.p, mul(mv(Hd.R, [0, 1, 0]), M.hand * 0.5)), [1, 0, 0], [0, 0, 1], 1.5 * g, 1.5 * g)]);
        }
      });
      h.gesaess = tief(rumpf.filter((q) => q.hy <= 0));
      h.rumpf = tief(rumpf.filter((q) => q.hy > 4 && q.hy < 46));
      /* der Kopf als Kugel (Hinterkopf, Wange, Stirn) */
      h.kopf = tief([schnitt(S.kopf.p, mv(S.kopf.R, [1, 0, 0]), mv(S.kopf.R, [0, 0, 1]), M.kopf * 0.34, M.kopf * 0.43)]);
      /* Eindringen: liegt die Achse eines Glieds im Rumpf? */
      const imRumpf = (p) => {
        let best = 1e9;
        for (let j = 0; j < rumpf.length - 1; j++) {
          const q = rumpf[j], q2 = rumpf[j + 1];
          const T = unit(sub(q2.c, q.c)), L = len(sub(q2.c, q.c));
          const t = dot(sub(p, q.c), T);
          if (t < -0.5 || t > L + 0.5) continue;
          const u = klemm(t / L, 0, 1);
          const c = lerp3(q.c, q2.c, u), Uu = unit(lerp3(q.U, q2.U, u)), Vv = unit(lerp3(q.V, q2.V, u));
          const d = sub(p, c);
          const e = Math.hypot(dot(d, Uu) / lerp(q.a, q2.a, u), dot(d, Vv) / lerp(q.b, q2.b, u));
          best = Math.min(best, e);
        }
        return best;
      };
      const stecken = [];
      teile.forEach((t) => {
        const proben = t.oberarm ? t.oberarm.slice(4).concat(t.unterarm) : t.oberschenkel.slice(3).concat(t.unterschenkel);
        let m = 1e9; proben.forEach((q) => { m = Math.min(m, imRumpf(q.c)); });
        if (m < 0.9) stecken.push(t.name + " im Rumpf (" + m.toFixed(2) + ")");
      });
      const achse = (ss) => ss.map((q) => ({ c: q.c, r: Math.min(q.a, q.b) }));
      let wo = "";
      const nah = (A, B) => { let m = 1e9; A.forEach((a, i) => B.forEach((b, j) => { const v = len(sub(a.c, b.c)) / (a.r + b.r); if (v < m) { m = v; wo = i + "/" + j; } })); return m; };
      const bL = teile.find((t) => t.name === "beinL"), bR = teile.find((t) => t.name === "beinR");
      const aL = teile.find((t) => t.name === "armL"), aR = teile.find((t) => t.name === "armR");
      const bb = nah(achse(bL.unterschenkel.concat(bL.oberschenkel.slice(3))), achse(bR.unterschenkel.concat(bR.oberschenkel.slice(3))));
      if (bb < 0.55) stecken.push("Beine ineinander (" + bb.toFixed(2) + " bei " + wo + ")");
      const aa = nah(achse(aL.unterarm), achse(aR.unterarm));
      if (aa < 0.55) stecken.push("Unterarme ineinander (" + aa.toFixed(2) + ")");
      /* Gelenke im Raum (x links, y unten, z vorn; über dem Boden unter der Hüfte) */
      const gelenk = {};
      ["becken", "brust", "kopf", "schulterL", "schulterR", "ellbogenL", "ellbogenR", "handL", "handR", "huefteL", "huefteR", "knieL", "knieR", "fussL", "fussR"].forEach((n) => {
        const w = cam.welt(S[n].p); gelenk[n] = [w[0] - anker[0], anker[1] - w[1], w[2] - anker[2]].map((v) => Math.round(v * 10) / 10);
      });
      return { hoehe: h, stecken, gelenk, imRumpf: (v) => imRumpf(v) };
    })() : null;
    if (spec.nurMessen) return { mess };
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
      const pts = duenn(opt.huelle ? huelle(proj(ss)) : umriss(proj(ss)), 0.75 * Math.max(g, 0.5), opt.fein);
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

    /* ---- FASSUNG 836: Rundung statt Röhre ----
       Ein Glied bekommt einen Verlauf QUER zu seiner Achse: am Lichtrand
       ein heller Streifen (Glanz), zur Mitte die Grundfarbe, auf der
       Schattenseite der Kernschatten und ganz am Rand wieder etwas
       heller (Reflexlicht vom Boden) — so lehrt es der Zeichenunterricht
       für Zylinder und Arme. Licht von oben links. */
    function achsVerlauf(ss, pts, grund, opt) {
      opt = opt || {};
      const a = pr(ss[0].c), b = pr(ss[ss.length - 1].c);
      const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
      if (l < 2 * g) return verlauf(pts, grund, opt);
      let n = [-dy / l, dx / l];
      if (n[0] * LICHT[0] + n[1] * LICHT[1] < 0) n = [-n[0], -n[1]];
      const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2;
      let mx = -1e9, mn = 1e9;
      pts.forEach((p) => { const d = (p[0] - cx) * n[0] + (p[1] - cy) * n[1]; if (d > mx) mx = d; if (d < mn) mn = d; });
      const gid = id + "g" + (gz++);
      const hell = opt.hell == null ? 0.2 : opt.hell, dunkel = opt.dunkel == null ? 0.22 : opt.dunkel;
      defs.push('<linearGradient id="' + gid + '" gradientUnits="userSpaceOnUse" x1="' + r1(cx + n[0] * mx) + '" y1="' + r1(cy + n[1] * mx) + '" x2="' + r1(cx + n[0] * mn) + '" y2="' + r1(cy + n[1] * mn) + '">'
        + '<stop offset="0" stop-color="' + heller(grund, hell * 0.45) + '"/><stop offset=".2" stop-color="' + heller(grund, hell) + '"/>'
        + '<stop offset=".48" stop-color="' + grund + '"/><stop offset=".8" stop-color="' + dunkler(grund, dunkel) + '"/>'
        + '<stop offset="1" stop-color="' + dunkler(grund, dunkel * 0.7) + '"/></linearGradient>');
      return "url(#" + gid + ")";
    }
    /* Eine Kette von Gliedern (Oberarm–Unterarm, Oberschenkel–
       Unterschenkel, Hosenbein …) ohne Nähte: erst alle Konturen
       doppelt breit, dann alle Flächen darüber — die Kontur bleibt nur
       am äußeren Umriss stehen, an den Gelenken verschwindet die Fuge.
       „offen“: die Kappe am Anfang (Schulter, Hüfte) bekommt keine
       Kontur, dort wächst das Glied aus dem Rumpf. „einzeln“: stark
       gebeugt liegt das Glied VOR dem vorigen — dann braucht es seine
       eigene Kontur (Knie vor dem Oberschenkel beim Sitzen). */
    function kette(glieder) {
      let unten = "", oben = "";
      glieder.forEach((gl) => {
        if (!gl || !gl.ss || !gl.ss.length) return;
        const o = gl.opt || {};
        const roh = o.huelle ? huelle(proj(gl.ss)) : umriss(proj(gl.ss));
        const pts = duenn(roh, 0.6 * Math.max(g, 0.5), 30);
        if (pts.length < 3) return;
        const d = pfad(pts);
        const fill = o.flach ? gl.grund : achsVerlauf(gl.ss, pts, gl.grund, o);
        letzteFuellung = fill;
        const kontur = o.kontur || dunkler(gl.grund, 0.4);
        const w = o.strich || 0.3 * Math.max(g, 0.55);
        let offen = gl.offen && pts.some((p) => p.kA) ? pfad(pts.filter((p) => !p.kA), true) : null;
        if (gl.nurSeiten && pts.some((p) => p.kE)) {
          /* nur die beiden Seitenlinien, ohne Kappen oben und unten */
          const i0 = pts.findIndex((p) => p.kE);
          let i1 = i0; while (i1 < pts.length && pts[i1].kE) i1++;
          const li = pts.slice(0, i0), re = pts.slice(i1).filter((p) => !p.kA);
          if (gl.aussenX != null && li.length > 1 && re.length > 1) {
            /* nur die Seite, die vom Rumpf weg zeigt */
            const mx = (q) => Math.abs(q.reduce((a, p) => a + p[0], 0) / q.length - gl.aussenX);
            offen = pfad(mx(li) > mx(re) ? li : re, true);
          } else offen = (li.length > 1 ? pfad(li, true) : "") + (re.length > 1 ? pfad(re, true) : "");
        }
        if (gl.einzeln) {
          oben += '<path d="' + d + '" fill="' + fill + '"' + (offen ? "" : ' stroke="' + kontur + '" stroke-width="' + r1(w) + '" stroke-linejoin="round"') + "/>";
          if (offen) oben += '<path d="' + offen + '" fill="none" stroke="' + kontur + '" stroke-width="' + r1(w) + '" stroke-linejoin="round"' + (gl.nurSeiten ? ' opacity=".7"' : "") + "/>";
        } else {
          unten += '<path d="' + (offen || d) + '" fill="none" stroke="' + kontur + '" stroke-width="' + r1(2 * w) + '" stroke-linejoin="round"/>';
          oben += '<path d="' + d + '" fill="' + fill + '"/>';
        }
      });
      return unten + oben;
    }
    /* Der Rumpf (und der Sitz der Hose): gefüllt ganz, umrandet aber nur
       oberhalb der Hüftgelenke — unten wachsen die Oberschenkel heraus,
       dort gehört keine Linie quer über die Beine (sonst sah jede Hose
       wie eine Windel aus). */
    function rumpfForm(ss, grund, opt, abHy) {
      opt = opt || {};
      const pts = duenn(umriss(proj(ss)), 0.6 * Math.max(g, 0.5), 30);
      if (pts.length < 3) return "";
      const fill = opt.flach ? grund : verlauf(pts, grund, opt);
      letzteFuellung = fill;
      const kontur = opt.kontur || dunkler(grund, 0.36);
      const oben = ss.filter((q) => q.hy == null || q.hy >= abHy);
      let strich = pfad(pts);
      if (oben.length >= 2 && oben.length < ss.length) {
        const p2 = duenn(umriss(proj(oben)), 0.6 * Math.max(g, 0.5), 30);
        strich = p2.some((q) => q.kA) ? pfad(p2.filter((q) => !q.kA), true) : pfad(p2);
      }
      return '<path d="' + pfad(pts) + '" fill="' + fill + '"/><path d="' + strich + '" fill="none" stroke="' + kontur + '" stroke-width="' + r1(opt.strich || 0.3 * Math.max(g, 0.55)) + '" stroke-linejoin="round"/>';
    }
    /* Eine Linie auf der Oberfläche eines Glieds (Falten, Haare, Adern):
       Punkte (s = Anteil entlang der Querschnitte, w = Winkel um die
       Achse, 0 = außen, 90 = vorn). Unsichtbare Stücke fallen weg. */
    function gliedLinie(ss, liste, farbe, breite, deck, aussen) {
      const o = liste.map((q) => gliedOrt(ss, q[0], aussen < 0 ? 180 - q[1] : q[1]));
      const sicht = o.reduce((a, q) => a + sichtbar(q.n), 0) / o.length;
      if (sicht < 0.12) return "";
      return linie(o.map((q) => pr(q.p)), farbe, breite, ' opacity="' + (deck * klemm(sicht * 1.5, 0, 1)).toFixed(2) + '"');
    }

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
      /* FASSUNG 836: Finger aus drei Gliedern, die zur Spitze schmaler
         werden, mit Fingerknöcheln und einem hellen Nagel auf dem Endglied. */
      const fz = (fi) => {
        const pp = fi.pts.map((q) => pr(q));
        const b = fi.daumen ? fb * 1.25 : fb;
        const breiten = [1, 0.9, 0.78];
        let o = linie(pp, dunkler(farbe, 0.36), b * 2 + 0.34 * g);
        for (let j = 0; j < pp.length - 1; j++) o += linie([pp[j], pp[j + 1]], farbe, b * 2 * breiten[Math.min(j, 2)]);
        const e = pp[pp.length - 1], v = pp[pp.length - 2];
        o += '<circle cx="' + r1(lerp(v[0], e[0], 0.7)) + '" cy="' + r1(lerp(v[1], e[1], 0.7)) + '" r="' + r1(b * 0.55) + '" fill="' + heller(farbe, 0.35) + '" opacity=".4"/>';
        return o;
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

    /* Beine mit Hose / Rock / Schuhen.
       FASSUNG 836: Oberschenkel und Unterschenkel als EINE Kette ohne
       Fuge; die Hosenbeine fallen gerade vom Knie zum Saum (sie folgen
       nicht der Wade wie eine Strumpfhose), mit Falten in der Kniekehle,
       Zugfalten beim Sitzen und Stauchfalten über dem Schuh. */
    const rumpfTiefe0 = tiefeVon(rumpf);
    const hosenFalte = (ss, liste, farbe, aussen, deck) => gliedLinie(ss, liste, dunkler(farbe, 0.3), 0.32 * g, deck || 0.55, aussen);
    teile.filter((t) => t.name.indexOf("bein") === 0).forEach((t) => {
      let svg = "";
      const sd = t.seite, aussen = sd === "L" ? 1 : -1;
      const os = t.oberschenkel, us = t.unterschenkel;
      const langeHose = hoseArt && hoseArt.lang;
      const knieBeuge = P["knie" + sd] || 0, hueftBeuge = ((P["huefte" + sd] || {}).vor) || 0;
      const einzeln = knieBeuge > 58;
      const Fu = S["fuss" + sd], Kn = S["knie" + sd];
      const fussVorn = sichtbar(mv(Fu.R, [0, 0, 1]));
      /* Haut, soweit sie zu sehen ist */
      const strumpf = (M.w && kleid && KLEID[kleid.stueck] && KLEID[kleid.stueck].strumpf) ? "#c9a58c" : null;
      if (!langeHose) {
        svg += kette([{ ss: os, grund: koerperF, offen: true, opt: { hell: 0.16, dunkel: 0.2 } },
          { ss: us, grund: strumpf || koerperF, einzeln, opt: { hell: 0.16, dunkel: 0.2 } }]);
        if (spec.muskeln) {
          const aus = t.seite === "L" ? 0 : 180;          // Winkel der Außenseite
          const vorn = 90, hinten = -90;
          svg += muskelFeld(os, 0.06, 0.92, vorn, 62, null, 5);                                   // Oberschenkelmuskel
          svg += muskelFeld(os, 0.1, 0.88, hinten, 55, "#b84a42", 4);                            // Beinbeuger
          svg += muskelFeld(us, 0.08, 0.78, vorn + (aus === 0 ? -35 : 35), 24, null, 2);           // Schienbeinmuskel
          svg += muskelFeld(us, 0.02, 0.62, hinten, 72, "#c4524a", 4);                            // Wadenmuskel
          svg += sehne(us, 0.66, 1, hinten, 18);                                                  // Achillessehne
          svg += sehne(os, 0.9, 1.0, vorn, 30);                                                   // Kniesehne
        } else {
          /* Kniescheibe: ein weiches Glanzlicht mit einem Schatten darunter,
             kein aufgeklebtes Oval; Schienbeinkante als zarte Linie. */
          const kv = mv(Kn.R, [0, 0, 1]);
          if (sichtbar(kv) > 0.25) {
            const q = { c: pr(add(Kn.p, add(mul(kv, 4.4 * g), mul(mv(Kn.R, [0, 1, 0]), -0.8 * g)))), U: prRichtung(mv(Kn.R, [1, 0, 0])), V: prRichtung(mv(Kn.R, [0, 1, 0])), a: 2.2 * g, b: 2.5 * g };
            svg += '<path d="' + pfad(ellipsePunkte(q, 10)) + '" fill="' + heller(strumpf || hautF, 0.16) + '" opacity=".45"/>';
            svg += gliedLinie(us, [[0.05, 60], [0.09, 90], [0.05, 120]], dunkler(strumpf || hautF, 0.3), 0.25 * g, 0.5, aussen);
            svg += gliedLinie(us, [[0.18, 95], [0.5, 92], [0.8, 88]], dunkler(strumpf || hautF, 0.2), 0.22 * g, 0.3, aussen);
          }
          /* dezente Beinbehaarung beim erwachsenen Mann */
          if (M.erw && !M.w && !strumpf) {
            for (let i = 0; i < 6; i++) svg += gliedLinie(us, [[0.22 + i * 0.1, 40 + (i % 3) * 22], [0.26 + i * 0.1, 46 + (i % 3) * 22]], dunkler(haarF, 0.1), 0.1 * g, 0.3, aussen);
          }
        }
      }
      /* Fuß oder Schuh */
      const fussArt = schuhe ? SCHUH[schuhe.stueck] || SCHUH.halbschuh : null;
      if (!fussArt || fussArt.offen) {
        svg += form(t.fuss, hautF, { hell: 0.12, huelle: fussVorn > 0.5 });
        /* Zehen: fünf, der große innen — nur wenn man auf die Fußspitze schaut */
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
          svg += form(sohle, farbe, { hell: 0.22, dunkel: 0.26, huelle: fussVorn > 0.5 });
          if (fussArt.schaft) {
            const hoch = knochen(Kn.p, Kn.R, M.unterschenkel, [[fussArt.schaft, 5.2, 5.6, -0.3], [0.84, 3.9, 4.0, 0], [1.0, 3.9, 4.2, 0]], f);
            svg += form(hoch, farbe, { hell: 0.2, dunkel: 0.26 });
          }
          /* Sohle als dunkler Rand unten */
          const unterkante = t.fuss.map((s) => pr(add(s.c, mul(s.V, -(s.b + 0.5 * g)))));
          if (fussVorn <= 0.6) {
            svg += linie(unterkante, fussArt.sohle || dunkler(farbe, 0.5), 0.9 * g);
            if (fussArt.weiss) svg += linie(unterkante, "#f3f1ec", 0.55 * g);
          }
          if (fussArt.schnuerung) {
            const a = pr(add(t.fuss[1].c, mul(t.fuss[1].V, t.fuss[1].b + 0.4 * g))), b = pr(add(t.fuss[2].c, mul(t.fuss[2].V, t.fuss[2].b + 0.4 * g)));
            svg += linie([a, b], heller(farbe, 0.45), 0.35 * g, ' stroke-dasharray="' + r1(0.5 * g) + " " + r1(0.6 * g) + '"');
          }
        }
      }
      if (hoseArt && !hoseArt.rock) {
        const farbe = stoff(hose, "#3b4d6b");
        const d = 1.1 * g;
        const oben = aufblasen(os, d);
        if (langeHose) {
          /* Das Hosenbein: am Knie so weit wie das Knie plus Luft, dann
             gerade hinunter; nirgends enger als der Körper darunter. */
          const weite = (hoseArt.weite || 1) * (M.w ? 0.92 : 1) * f * altGlied;
          const ausdehnung = (s) => Math.max(s.a, s.b) + Math.hypot(dot(sub(s.c, add(Kn.p, mul(mv(Kn.R, [0, 1, 0]), dot(sub(s.c, Kn.p), mv(Kn.R, [0, 1, 0]))))), s.U), dot(sub(s.c, add(Kn.p, mul(mv(Kn.R, [0, 1, 0]), dot(sub(s.c, Kn.p), mv(Kn.R, [0, 1, 0]))))), s.V));
          const bein = [-0.05, 0.1, 0.3, 0.5, 0.7, 0.88, 1.0, 1.04].map((sv) => {
            let r = lerp(6.4, 5.9, klemm(sv, 0, 1)) * g * weite;
            us.forEach((s0, i) => { if (Math.abs(US[i][0] - sv) < 0.12) r = Math.max(r, ausdehnung(s0) + 0.5 * g); });
            return [sv, r / (g * f * altGlied), r / (g * f * altGlied), 0, 0];
          });
          const unten = knochen(Kn.p, Kn.R, M.unterschenkel, bein, f * altGlied, aussen);
          svg += kette([{ ss: oben, grund: farbe, offen: true, opt: { hell: 0.14, dunkel: 0.26 } },
            { ss: unten, grund: farbe, einzeln, opt: { hell: 0.14, dunkel: 0.26 } }]);
          if (knieBeuge > 25) {
            /* Kniekehle: strahlenförmige Falten; vorn über dem Knie Zugfalten */
            svg += hosenFalte(oben, [[0.76, -55], [0.95, -82]], farbe, aussen) + hosenFalte(oben, [[0.8, -95], [0.97, -92]], farbe, aussen)
              + hosenFalte(oben, [[0.76, -130], [0.95, -100]], farbe, aussen);
            svg += hosenFalte(oben, [[0.96, 25], [0.62, 60]], farbe, aussen, 0.4) + hosenFalte(oben, [[0.96, 155], [0.6, 120]], farbe, aussen, 0.4);
            svg += hosenFalte(unten, [[0.12, -60], [0.04, -85], [0.12, -120]], farbe, aussen, 0.45);
          } else {
            svg += hosenFalte(oben, [[0.9, 65], [0.93, 90], [0.9, 118]], farbe, aussen, 0.35);
          }
          if (hueftBeuge > 40) svg += hosenFalte(oben, [[0.04, 150], [0.3, 115]], farbe, aussen, 0.4) + hosenFalte(oben, [[0.1, 30], [0.34, 70]], farbe, aussen, 0.35);
          /* Stauchfalten über dem Schuh und die Bügelfalte bzw. Naht */
          svg += hosenFalte(unten, [[0.84, 45], [0.87, 90], [0.84, 135]], farbe, aussen, 0.45) + hosenFalte(unten, [[0.93, 55], [0.96, 88], [0.94, 125]], farbe, aussen, 0.4);
          svg += gliedLinie(unten, [[0.12, 90], [0.8, 90]], heller(farbe, 0.18), 0.35 * g, 0.4, aussen);
          const saum = unten[unten.length - 1];
          const sq = { c: pr(saum.c), U: prRichtung(saum.U), V: prRichtung(saum.V), a: saum.a, b: saum.b };
          const saumPts = ellipsePunkte(sq, 16).filter((p, i) => Math.sin(i / 16 * 2 * Math.PI) * sq.V[2] + Math.cos(i / 16 * 2 * Math.PI) * sq.U[2] > -0.1);
          if (saumPts.length > 3) svg += linie(saumPts, dunkler(farbe, 0.35), 0.3 * g, ' opacity=".6"');
        } else {
          /* Kurze Hose: nur der obere Teil des Oberschenkels, etwas weiter */
          const bis = hoseArt.bis;   // Anteil des Oberschenkels
          const ss = aufblasen(os, 0.4 * g).filter((s, i) => OS[i][0] <= bis + 0.12);
          if (ss.length >= 2) {
            svg += kette([{ ss, grund: farbe, offen: true, opt: { hell: 0.14, dunkel: 0.26 } }]);
            if (bis > 0.35) {
              svg += hosenFalte(ss, [[0.3, 140], [0.8, 110]], farbe, aussen, 0.35);
              const saum = ss[ss.length - 1];
              const sq = { c: pr(saum.c), U: prRichtung(saum.U), V: prRichtung(saum.V), a: saum.a, b: saum.b };
              const saumPts = ellipsePunkte(sq, 16).filter((p, i) => Math.sin(i / 16 * 2 * Math.PI) * sq.V[2] + Math.cos(i / 16 * 2 * Math.PI) * sq.U[2] > -0.1);
              if (saumPts.length > 3) svg += linie(saumPts, dunkler(farbe, 0.35), 0.3 * g, ' opacity=".6"');
            }
          }
        }
      }
      auftraege.push({ tiefe: t.tiefe, svg, bein: true, seite: t.seite });
    });

    /* Arme mit Ärmeln — FASSUNG 836: nahtlos wie die Beine, Ärmel mit
       Luft und Falten in der Armbeuge, dezente Behaarung am Unterarm. */
    const oben = stueck("oberteil"), jacke = stueck("jacke");
    const aermelVon = (w) => (w ? (OBERTEIL[w.stueck] || JACKE[w.stueck] || KLEID[w.stueck] || {}).aermel : 0) || 0;
    const aermel = Math.max(aermelVon(oben), aermelVon(kleid), aermelVon(jacke));
    const aermelFarbe = jacke && aermelVon(jacke) ? stoff(jacke, "#444455") : (oben && aermelVon(oben) ? stoff(oben, "#c8c8c8") : (kleid ? stoff(kleid, "#c55") : null));
    teile.filter((t) => t.name.indexOf("arm") === 0).forEach((t) => {
      const sd = t.seite, aussen = sd === "L" ? 1 : -1;
      const beuge = P["ellbogen" + sd] || 0;
      const einzeln = beuge > 72;
      let svg = kette([{ ss: t.oberarm, grund: koerperF, offen: true, opt: { hell: 0.16, dunkel: 0.2 } },
        { ss: t.unterarm, grund: koerperF, einzeln, opt: { hell: 0.16, dunkel: 0.2 } }]);
      if (spec.muskeln) {
        const aus = t.seite === "L" ? 0 : 180;
        svg += muskelFeld(t.oberarm, 0.2, 0.9, 90, 48, null, 3);                                  // Bizeps
        svg += muskelFeld(t.oberarm, 0.15, 0.9, -90, 55, "#b84a42", 3);                           // Trizeps
        svg += muskelFeld(t.oberarm, 0.0, 0.45, aus, 95, "#c85a50", 5);                           // Deltamuskel
        svg += muskelFeld(t.unterarm, 0.05, 0.8, 90, 70, null, 4) + muskelFeld(t.unterarm, 0.05, 0.8, -90, 70, "#b84a42", 4);
        svg += sehne(t.unterarm, 0.8, 1, 90, 50) + sehne(t.unterarm, 0.8, 1, -90, 50);
      } else if (aermel < 2) {
        /* Armbeuge und Ellbogen als zarte Schattenlinien; beim
           erwachsenen Mann feine Härchen außen am Unterarm. */
        if (beuge > 20) svg += gliedLinie(t.oberarm, [[0.9, 70], [0.97, 95], [0.9, 120]], dunkler(hautF, 0.3), 0.22 * g, 0.5, aussen);
        if (M.erw && !M.w) for (let i = 0; i < 7; i++) svg += gliedLinie(t.unterarm, [[0.18 + i * 0.09, -10 + (i % 3) * 25], [0.22 + i * 0.09, -4 + (i % 3) * 25]], dunkler(haarF, 0.1), 0.1 * g, 0.32, aussen);
      }
      if (aermel > 0 && aermelFarbe) {
        const ober = aufblasen(t.oberarm, 1.0 * g);
        if (aermel >= 1) {
          /* Der Ärmel ist weiter als der Arm und wird zum Bündchen enger. */
          const lang = aermel >= 2;
          const unter = t.unterarm.map((s, i) => {
            const sv = UA[i][0];
            const r = lerp(4.6, 3.5, klemm(sv, 0, 1)) * g * f * frauArm * kindArm;
            return schnitt(s.c, s.U, s.V, Math.max(s.a + 0.8 * g, r), Math.max(s.b + 0.8 * g, r));
          }).filter((s, i) => lang ? UA[i][0] <= 0.93 : UA[i][0] <= 0.35);
          svg += kette([{ ss: ober, grund: aermelFarbe, offen: true, opt: { hell: 0.16, dunkel: 0.24 } },
            { ss: unter, grund: aermelFarbe, einzeln, opt: { hell: 0.16, dunkel: 0.24 } }]);
          if (beuge > 25) {
            svg += hosenFalte(ober, [[0.72, 60], [0.95, 88]], aermelFarbe, aussen, 0.5) + hosenFalte(ober, [[0.75, 125], [0.96, 96]], aermelFarbe, aussen, 0.5);
            if (lang) svg += hosenFalte(unter, [[0.3, 70], [0.05, 92]], aermelFarbe, aussen, 0.45);
          } else {
            svg += hosenFalte(ober, [[0.86, 50], [0.9, 90], [0.86, 130]], aermelFarbe, aussen, 0.35);
          }
          /* Zugfalte von der Achsel */
          svg += hosenFalte(ober, [[0.08, 150], [0.35, 115]], aermelFarbe, aussen, 0.35);
          if (lang) {
            svg += hosenFalte(unter, [[0.72, 40], [0.76, 90], [0.72, 140]], aermelFarbe, aussen, 0.4);
            const e = unter[unter.length - 1];
            const bund = ellipsePunkte({ c: pr(e.c), U: prRichtung(e.U), V: prRichtung(e.V), a: e.a, b: e.b }, 14);
            svg += '<path d="' + pfad(bund) + '" fill="none" stroke="' + dunkler(aermelFarbe, 0.3) + '" stroke-width="' + r1(0.3 * g) + '" opacity=".6"/>';
          }
        } else {
          const kurz = ober.slice(0, 4);
          svg += kette([{ ss: kurz, grund: aermelFarbe, offen: true, opt: { hell: 0.16, dunkel: 0.24 } }]);
          const e = kurz[kurz.length - 1];
          const bund = ellipsePunkte({ c: pr(e.c), U: prRichtung(e.U), V: prRichtung(e.V), a: e.a, b: e.b }, 14)
            .filter((p, i) => Math.sin(i / 14 * 2 * Math.PI) * prRichtung(e.V)[2] + Math.cos(i / 14 * 2 * Math.PI) * prRichtung(e.U)[2] > -0.1);
          if (bund.length > 3) svg += linie(bund, dunkler(aermelFarbe, 0.32), 0.3 * g, ' opacity=".6"');
        }
      }
      /* Die Schulterkappe (Deltamuskel) gehört über den Rumpf, auch wenn
         der Arm sonst dahinter liegt — sonst läuft die Rumpflinie quer
         über die Schulter und der Arm hängt wie bei einer Puppe hinten
         dran. Nur solange die Schulter noch am Umriss liegt. */
      const brustS = rumpf.find((q) => q.hy >= 43) || rumpf[rumpf.length - 3];
      if (t.tiefe < rumpfTiefe0 && pr(S["schulter" + sd].p)[2] - pr(brustS.c)[2] > -0.62 * brustS.b) {
        const mitAermel = aermel > 0 && aermelFarbe;
        const kappeSS = (mitAermel ? aufblasen(t.oberarm, 1.0 * g) : t.oberarm).slice(0, 6);
        auftraege.push({ tiefe: rumpfTiefe0 + 0.05, svg: kette([{ ss: kappeSS, grund: mitAermel ? aermelFarbe : koerperF, offen: true, einzeln: true, nurSeiten: true, aussenX: pr(brustS.c)[0], opt: { hell: 0.16, dunkel: mitAermel ? 0.24 : 0.2 } }]) });
      }
      svg += hand(t.hand, t.seite, t.tiefe);
      if (zub && t.seite === (P.traghand || "R")) svg += zubehoerInHand(zub, t.hand);
      auftraege.push({ tiefe: t.tiefe, svg, arm: true, seite: t.seite });
    });

    /* Rumpf mit Oberteil, Kleid, Jacke, Schürze */
    let rumpfSvg = rumpfForm(rumpf, koerperF, { hell: 0.14, dunkel: 0.2 }, -1);
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
      rumpfSvg += rumpfForm(rumpfSchnitte(rumpfTab, 0.9 * g, bund * M.k), farbe, { hell: 0.16, dunkel: 0.24 }, 0);
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
      const pts = saumHuelle(rockArt.saum || 0.85, (rockArt.weite || 1.05) * 0.92, 14);
      /* FASSUNG 836: Faltenwurf — Falten laufen vom Bund zum Saum und
         fächern sich auf; der Saum ist leicht gewellt statt glatt. */
      let rsvg = formPunkte(pts, farbe, { hell: 0.18, dunkel: 0.26 });
      let yMax = -1e9, yMin = 1e9; pts.forEach((q) => { yMax = Math.max(yMax, q[1]); yMin = Math.min(yMin, q[1]); });
      const unten = pts.filter((q) => q[1] > yMax - 5 * g).sort((a, b) => a[0] - b[0]);
      const obenR = pts.filter((q) => q[1] < yMin + 4 * g).sort((a, b) => a[0] - b[0]);
      if (unten.length >= 2 && obenR.length >= 2) {
        const uL = unten[0], uR = unten[unten.length - 1], oL = obenR[0], oR = obenR[obenR.length - 1];
        for (let i = 1; i < 6; i++) {
          const t = i / 6, o = [lerp(oL[0], oR[0], 0.25 + t * 0.5), lerp(oL[1], oR[1], t) + 2 * g], u = [lerp(uL[0], uR[0], t), lerp(uL[1], uR[1], t) - 0.5 * g];
          rsvg += linie([o, [lerp(o[0], u[0], 0.55), lerp(o[1], u[1], 0.55)], u], i % 2 ? dunkler(farbe, 0.32) : heller(farbe, 0.18), (i % 2 ? 0.4 : 0.55) * g, ' opacity="' + (i % 2 ? 0.5 : 0.35) + '"');
        }
        const welle = [];
        for (let i = 0; i <= 10; i++) { const t = i / 10; welle.push([lerp(uL[0], uR[0], t), lerp(uL[1], uR[1], t) - (i % 2 ? 0.9 : 0) * g]); }
        rsvg += linie(welle, dunkler(farbe, 0.35), 0.35 * g, ' opacity=".5"');
      }
      auftraege.push({ tiefe: Math.max(vorneTiefe, rumpfTiefe) + 0.2, svg: rsvg, rock: true });
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
    /* FASSUNG 836: der Hals wächst ohne Kante aus dem Rumpf; unter dem
       Kinn liegt ein Schatten, die Kopfnicker laufen vom Ohr zur
       Drosselgrube, beim Mann sitzt der Adamsapfel vorn. */
    let halsSvg = kette([{ ss: halsS, grund: hautF, offen: true, opt: { hell: 0.1, dunkel: 0.26 } }]);
    {
      const hp = duenn(umriss(proj(halsS)), 0.6 * Math.max(g, 0.5), 24);
      const cid = id + "n" + (gz++);
      defs.push('<clipPath id="' + cid + '"><path d="' + pfad(hp) + '"/></clipPath>');
      const oberst = halsS[halsS.length - 1];
      const sp = pr(add(oberst.c, add(mul(oberst.V, oberst.b * 0.5), mul(mv(S.hals.R, [0, 1, 0]), 1.2 * M.k))));
      /* FASSUNG 838: der Schatten unter dem Kinn ist ein weicher Verlauf
         (vorher eine halbdurchsichtige Scheibe mit sichtbarem Rand). */
      const nsid = id + "ns" + (gz++);
      defs.push('<radialGradient id="' + nsid + '"><stop offset="0" stop-color="' + dunkler(hautF, 0.5) + '" stop-opacity=".5"/><stop offset=".6" stop-color="' + dunkler(hautF, 0.5) + '" stop-opacity=".22"/><stop offset="1" stop-color="' + dunkler(hautF, 0.5) + '" stop-opacity="0"/></radialGradient>');
      let schat = '<ellipse cx="' + r1(sp[0]) + '" cy="' + r1(sp[1]) + '" rx="' + r1(oberst.a * 1.5) + '" ry="' + r1(3.8 * M.k) + '" fill="url(#' + nsid + ')"/>';
      if (sichtbar(mv(S.hals.R, [0, 0, 1])) > -0.2) {
        schat += gliedLinie(halsS, [[0.95, 150], [0.5, 125], [0.08, 98]], dunkler(hautF, 0.3), 0.35 * g, 0.35, 1)
          + gliedLinie(halsS, [[0.95, 30], [0.5, 55], [0.08, 82]], dunkler(hautF, 0.3), 0.35 * g, 0.35, 1);
        /* Adamsapfel: Licht oben, Schatten darunter statt eines Strichs */
        if (M.erw && !M.w) schat += gliedLinie(halsS, [[0.5, 84], [0.56, 90], [0.5, 96]], heller(hautF, 0.3), 0.7 * g, 0.35, 1) + gliedLinie(halsS, [[0.4, 86], [0.44, 90], [0.4, 94]], dunkler(hautF, 0.3), 0.5 * g, 0.2, 1);
        /* Drosselgrube zwischen den Kopfnickern */
        schat += gliedLinie(halsS, [[0.02, 84], [0.1, 90], [0.02, 96]], dunkler(hautF, 0.35), 0.8 * g, 0.25, 1);
      }
      halsSvg += '<g clip-path="url(#' + cid + ')">' + schat + "</g>";
    }
    const kragenHoch = (oberArt && oberArt.rollkragen);
    if (kragenHoch) halsSvg += form(aufblasen(halsS.slice(0, 2), 0.8 * g), stoff(oben, "#c8c8c8"));
    auftraege.push({ tiefe: rumpfTiefe + 0.5, svg: halsSvg, hals: true });

    const kopfSpec = Object.assign({}, spec, { kopfbedeckung: stueck("kopf"), brille: !!(zub && zub.stueck === "brille") });
    const kopfTeile = kopf(S.kopf, M, kopfSpec, { pr, prRichtung, sichtbar, form, fuellung: () => letzteFuellung, formPunkte, linie, verlauf, hautF, haarF, g, id, defs, zaehler: () => gz++, stoff, licht: LICHT });
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
    /* FASSUNG 836: Kontaktschatten — ein weicher Schatten auf dem Boden
       unter allem, was aufliegt oder nahe darüber ist (Füße, Gesäß, Knie,
       Hände, im Liegen der ganze Körper). Als Ellipse, damit er den
       Rahmen der Figur nicht verändert. */
    let schatten = "";
    if (!spec.ohneSchatten) {
      const nah = [];
      const sammle = (ss) => ss.forEach((q) => {
        const w = cam.welt(q.c), Uw = cam.welt(q.U), Vw = cam.welt(q.V);
        const hoch = anker[1] - (w[1] + Math.sqrt((q.a * Uw[1]) ** 2 + (q.b * Vw[1]) ** 2));
        if (hoch < 6) { const c = pr(q.c); nah.push([c[0] - q.a, c[0] + q.a, cam.bild([0, 0, w[2] - anker[2]])[1]]); }
      });
      teile.forEach((t) => { if (t.fuss) sammle(t.fuss); if (t.oberschenkel) { sammle(t.oberschenkel); sammle(t.unterschenkel); } if (t.oberarm) sammle(t.unterarm); });
      sammle(rumpf);
      if (nah.length) {
        let x0 = 1e9, x1 = -1e9, y = 0;
        nah.forEach((q) => { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[1]); y += q[2]; });
        y /= nah.length;
        const sid = id + "k" + (gz++);
        defs.push('<radialGradient id="' + sid + '"><stop offset="0" stop-color="#2a1f18" stop-opacity=".32"/><stop offset=".7" stop-color="#2a1f18" stop-opacity=".12"/><stop offset="1" stop-color="#2a1f18" stop-opacity="0"/></radialGradient>');
        const rx = (x1 - x0) / 2 + 6 * g;
        schatten = '<ellipse cx="' + r1((x0 + x1) / 2) + '" cy="' + r1(y - 0.3 * g) + '" rx="' + r1(rx) + '" ry="' + r1(Math.max(2.2 * g, rx * 0.16)) + '" fill="url(#' + sid + ')"/>';
      }
    }
    const inhalt = schatten + auftraege.map((a) => a.svg).join("");

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
      box, hoehe: M.H, mass: M, punkte, mess,
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
  /* FASSUNG 836 — XANDER (Funk 217): „realistische Menschen … mit
     realistischen Gesichtern … mit realistischer Behaarung alles im
     Detail“. Der Kopf bekommt: ein echtes Profil (Stirn, Nasenwurzel,
     Nasenrücken, Nasenspitze, Oberlippe, Unterlippe, Kinn) statt eines
     glatten Eis mit aufgemalter Nase; Augen mit Lidern, Wimpern und einer
     Iris mit Verlauf; Brauen als spitz zulaufende Form; Nasenflügel und
     Schatten neben der Nase; Wangen- und Kieferschatten auf der
     Schattenseite; Ohren mit Krempe, Muschel und Läppchen; Haar mit
     Volumen, Strähnen und Glanzlicht, eine Haarlinie mit Schläfen,
     Koteletten und Nacken; Bartstoppeln statt einer Maske. */
  /* Vorsprung der Mittellinie über die Kopfform (cm, Erwachsener):
     [Höhe y, Vorsprung] — Brauenbogen, Nasenwurzel, Nasenrücken,
     Nasenspitze, Nasensteg, Oberlippe, Mundspalte, Unterlippe,
     Kinnfurche, Kinn. */
  const PROFIL = [[-4.6, 0], [-2.4, 0.3], [-0.8, -0.15], [0.6, 0.15], [2.2, 0.85], [3.6, 1.95], [4.3, 2.5], [4.85, 1.7],
    [5.3, 0.6], [6.2, 0.95], [6.9, 1.05], [7.4, 0.35], [7.9, 0.75], [8.6, 0.85], [9.3, 0.45], [10.3, 1.35], [11.0, 1.2], [11.55, 0.6]];
  /* Haarlinie: [Winkel um den Kopf von der Stirnmitte, Höhe y] — Stirn,
     Geheimratsecke, Schläfe, Koteletten vor dem Ohr, über dem Ohr, hinter
     dem Ohr, Nacken. */
  function haarLinie(F) {
    if (F.linie) return F.linie;
    const st = F.stirn != null ? F.stirn : -6.4, na = F.nacken != null ? F.nacken : 4.8;
    if (F.glatze) return [[0, -13], [50, -8], [70, -3], [85, -1.4], [100, -2.2], [120, 2], [150, 3.2], [180, na]];
    if (F.ohrenFrei === false) return [[0, st], [30, st + 0.5], [55, -3.4], [72, 2.4], [90, 4.2], [115, 5.2], [150, na - 0.4], [180, na]];
    return [[0, st], [32, st + (F.geheimrat ? -1.6 : 0.5)], [58, -3.6], [72, F.kotelette != null ? F.kotelette : 1.0], [80, -0.8], [95, -2.4], [112, 2.2], [145, na - 0.8], [180, na]];
  }
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
    /* Punkt rund um den Kopf: Höhe y, Winkel w (Grad, 0 = vorn, + = links), etwas außerhalb (zu, cm) */
    const rund = (y, w, zu) => {
      const Fp = flaeche(y, 0), r = w * RAD;
      return { p: auf(y, Math.sin(r) * (Fp.a + (zu || 0)), Fp.v + Math.cos(r) * (Fp.b + (zu || 0))), n: unit(add(mul(U, Math.sin(r) / Fp.a), mul(Vv, Math.cos(r) / Fp.b))) };
    };
    const gesicht = spec.gesicht || "g1";
    const gi = Math.max(0, ["g1", "g2", "g3", "g4"].indexOf(gesicht));
    let svg = form(ss, hautF, { hell: 0.16, dunkel: 0.22, fein: 40, kontur: dunkler(hautF, 0.32), strich: 0.2 * k });
    const kopfFuellung = h.fuellung() || hautF;
    let hinten = "";
    const vor = prRichtung(Vv);
    const seitlich = Math.abs(vor[0]) / (Math.hypot(vor[0], vor[2]) || 1);
    const vonVorn = sichtbar(Vv);
    const nasenSeite = vor[0] >= 0 ? 1 : -1;
    const nB = baby ? 0.6 : (M.erw ? (M.w ? 0.9 : 1) : 0.78);
    const profilDeck = klemm((seitlich - 0.55) / 0.3, 0, 1);
    /* Die Schattenseite des Gesichts: die Seite, die vom Licht weg liegt. */
    const mitteX = pr(K.p)[0];
    const schatten = (pr(flaeche(4, 0.6).p)[0] - mitteX) * h.licht[0] < 0 ? 1 : -1;
    const kontur = dunkler(hautF, 0.36);

    let profilD = "";
    /* ---- Das Profil: Nase, Lippen und Kinn ragen aus der Kopfform ---- */
    const profil = PROFIL.map((q) => {
      const y = q[0] * (baby ? 0.97 : 1), Fp = flaeche(y, 0);
      return { y, p: auf(y, 0, Fp.v + Fp.b + q[1] * nB), innen: auf(y, 0, Fp.v + Fp.b - 1.8) };
    });
    if (vonVorn > -0.25 && seitlich > 0.25) {
      const pp = profil.map((q) => pr(q.p)), ii = profil.map((q) => pr(q.innen)).reverse();
      profilD = pfad(pp, true) + "L" + ii.map((q) => r1(q[0]) + " " + r1(q[1])).join("L") + "Z";
      svg += '<path d="' + profilD + '" fill="' + kopfFuellung + '"/>';
      if (profilDeck > 0) svg += linie(pp, kontur, 0.3 * g, ' opacity="' + profilDeck.toFixed(2) + '"');
      const nasenDeck = klemm((seitlich - 0.22) / 0.33, 0, 1) - profilDeck;
      if (nasenDeck > 0.02) svg += linie(pp.slice(3, 9), kontur, 0.26 * g, ' opacity="' + nasenDeck.toFixed(2) + '"');
    }

    /* Ohren: Krempe (Helix), Muschel, Läppchen — nach dem Haar gezeichnet,
       damit kurzes Haar oder ein Dutt sie nicht zudeckt; langes Haar
       fällt darüber. */
    const ohren = () => { let svg = ""; ["L", "R"].forEach((sd) => {
      const s = sd === "L" ? 1 : -1;
      const n = mul(U, s);
      if (sichtbar(n) < -0.2) return;
      const o = pr(auf(1.2, s * 7.4, -0.8)), ob = pr(auf(-1.8, s * 7.3, -0.6)), un = pr(auf(4.6, s * 7.0, -0.1));
      const vis = klemm(Math.abs(sichtbar(n)) + 0.2, 0.25, 1);
      const breit = 2.6 * k * vis;
      const rv = prRichtung(Vv);
      const bx = (rv[0] >= 0 ? -1 : 1) * breit;
      const d = "M" + r1(ob[0]) + " " + r1(ob[1]) + "C" + r1(ob[0] + bx * 1.25) + " " + r1(ob[1] - 0.8 * k) + " " + r1(o[0] + bx * 1.35) + " " + r1(o[1] + 1.6 * k) + " " + r1(un[0] + bx * 0.45) + " " + r1(un[1] - 0.2 * k)
        + "Q" + r1(un[0] + bx * 0.05) + " " + r1(un[1] + 0.5 * k) + " " + r1(un[0] - bx * 0.15) + " " + r1(un[1] - 0.6 * k) + "L" + r1(o[0]) + " " + r1(o[1] + 1.2 * k) + "Z";
      svg += '<path d="' + d + '" fill="' + dunkler(hautF, 0.04) + '" stroke="' + kontur + '" stroke-width="' + r1(0.15 * k) + '" stroke-linejoin="round"/>';
      /* FASSUNG 838: Ohr mit Krempe (Helix), Gegenleiste (Anthelix),
         Muschel im Schatten, Ecke vor dem Gehörgang (Tragus), Läppchen. */
      if (vis > 0.45) {
        const R2 = (v) => Math.round(v * 100) / 100;
        svg += '<ellipse cx="' + R2(o[0] + bx * 0.33) + '" cy="' + R2(o[1] + 0.8 * k) + '" rx="' + R2(Math.abs(bx) * 0.36) + '" ry="' + R2(1.25 * k) + '" fill="url(#' + DK + ')" opacity=".6"/>';
        svg += '<path d="M' + R2(ob[0] + bx * 0.3) + " " + R2(ob[1] + 0.6 * k) + "Q" + R2(o[0] + bx * 1.02) + " " + R2(o[1] - 0.7 * k) + " " + R2(o[0] + bx * 0.62) + " " + R2(o[1] + 2.3 * k) + '" fill="none" stroke="' + dunkler(hautF, 0.3) + '" stroke-width="' + R2(0.14 * k) + '" opacity=".65"/>';
        svg += '<path d="M' + R2(o[0] + bx * 0.55) + " " + R2(o[1] - 0.9 * k) + "Q" + R2(o[0] + bx * 0.72) + " " + R2(o[1] + 0.6 * k) + " " + R2(o[0] + bx * 0.45) + " " + R2(o[1] + 2.0 * k) + '" fill="none" stroke="' + heller(hautF, 0.35) + '" stroke-width="' + R2(0.22 * k) + '" opacity=".5"/>';
        svg += '<path d="M' + R2(o[0] + bx * 0.08) + " " + R2(o[1] + 0.9 * k) + "q" + R2(bx * 0.18) + " " + R2(0.3 * k) + " 0 " + R2(0.8 * k) + '" fill="none" stroke="' + dunkler(hautF, 0.3) + '" stroke-width="' + R2(0.13 * k) + '" opacity=".6"/>';
        svg += '<ellipse cx="' + R2(un[0] + bx * 0.2) + '" cy="' + R2(un[1] - 0.3 * k) + '" rx="' + R2(Math.abs(bx) * 0.2) + '" ry="' + R2(0.4 * k) + '" fill="url(#' + GL + ')" opacity=".4"/>';
      }
    }); return svg; };

    /* Alles im Gesicht bleibt innerhalb von Kopf und Profil — sonst
       ragten im Halbprofil Glanzpunkte und Lippenschatten über den Rand. */
    const gesichtAb = svg.length;
    /* Bart: Stoppeln (kurz) oder Vollbart — eine Fläche auf dem sichtbaren
       Teil der unteren Gesichtshälfte, oben an Wangenlinie und Oberlippe,
       unten unter dem Kinn; keine Maske um den ganzen Kopf. */
    const bart = spec.bart;
    if (bart && M.erw && spec.geschlecht !== "w" && vonVorn > -0.3) {
      const voll = bart !== "bart_kurz";
      const zu = voll ? 0.55 : 0.08;
      const kante = (u) => { const a = Math.abs(u); return a < 0.4 ? 5.4 : (a < 0.62 ? lerp(5.4, 4.9, (a - 0.4) / 0.22) : lerp(4.9, 2.2, (a - 0.62) / 0.36)); };
      const us = []; for (let i = 0; i <= 16; i++) us.push(-0.98 + i * 1.96 / 16);
      const pt = (y, u) => { const Fp = flaeche(y, u); return { p: add(Fp.p, mul(Fp.n, zu * k)), n: Fp.n }; };
      const obenR = us.map((u) => pt(kante(u), u)).filter((q) => sichtbar(q.n) > -0.05);
      const untenR = us.slice().reverse().map((u) => pt(11.6 - Math.abs(u) * 3.2, u)).filter((q) => sichtbar(q.n) > -0.05);
      if (obenR.length > 2 && untenR.length > 2) {
        const flaechePts = obenR.concat(untenR).map((q) => pr(q.p));
        const bf = voll ? misch(haarF, hautF, 0.12) : misch(haarF, hautF, 0.45);
        if (voll) {
          svg += h.formPunkte(flaechePts, bf, { hell: 0.14, dunkel: 0.2, kontur: dunkler(bf, 0.2) });
          for (let i = 0; i < 12; i++) {
            const u = -0.8 + i * 0.145, y0 = kante(u) + 0.6;
            const a = pt(y0, u), b = pt(Math.min(11.2, y0 + 2.6 + (i % 3) * 0.6), u * 0.92);
            if (sichtbar(a.n) > 0.1) svg += linie([pr(a.p), pr(b.p)], dunkler(haarF, 0.25), 0.2 * k, ' opacity=".5"');
          }
        } else {
          const pid = h.id + "s" + h.zaehler();
          /* FASSUNG 838: vorher rundete r1 die Punkte auf den Halbmesser 0 —
             es gab gar keine Stoppeln, nur einen Fleck. Jetzt kurze Striche
             in Wuchsrichtung, auf 1/100 cm genau. */
          const q = 0.36 * k, R2 = (v) => Math.round(v * 1000) / 1000, sf = dunkler(haarF, 0.2);
          h.defs.push('<pattern id="' + pid + '" width="' + R2(q) + '" height="' + R2(q) + '" patternUnits="userSpaceOnUse"><path d="M' + R2(q * 0.2) + " " + R2(q * 0.2) + "l" + R2(q * 0.06) + " " + R2(q * 0.16) + "M" + R2(q * 0.65) + " " + R2(q * 0.58) + "l" + R2(q * 0.05) + " " + R2(q * 0.17) + "M" + R2(q * 0.72) + " " + R2(q * 0.08) + "l" + R2(q * 0.04) + " " + R2(q * 0.13) + "M" + R2(q * 0.18) + " " + R2(q * 0.7) + "l" + R2(q * 0.05) + " " + R2(q * 0.14) + '" stroke="' + sf + '" stroke-width="' + R2(q * 0.11) + '" stroke-linecap="round"/></pattern>');
          const dd = pfad(flaechePts);
          /* FASSUNG 838: Stoppeln als dichtes Punktmuster, der Grundton nur
             ganz zart — die flache Fläche hatte einen harten Rand. */
          svg += '<path data-teil="stoppeln" d="' + dd + '" fill="' + bf + '" opacity=".1"/><path d="' + dd + '" fill="url(#' + pid + ')" opacity=".55"/>';
        }
      }
    }

    /* FASSUNG 838 — XANDER (Funk 222, wörtlich): „die Menschen jetzt
       jegliche Details verloren man sieht keine Augen man sieht keine
       Wimpern man sieht keine Augenbrauen … jedes kleinste Detail das
       kläres die Iris die Pupille alles soll man deutlich sehen die
       Nasenlöcher … mit euch realistischen Licht und Schatten dass es
       plastisch wirkt“.
       Das Gesicht ist neu gezeichnet, wie es die alten gebackenen Figuren
       konnten und darüber hinaus:
       - Modellierung mit weichen Verläufen (keine flachen Scheiben mehr):
         Licht auf Stirn, Nasenrücken, Wangenknochen und Kinn der Licht-
         seite; Schatten in der Augenhöhle, an der Schläfe, unter dem
         Wangenknochen, unter Nase und Unterlippe.
       - Augen: Augapfel mit Weiß im Verlauf, Iris mit Kranz, Musterung
         (Strahlen) und dunklem Rand, Pupille, zwei Glanzlichter, Schatten
         des Oberlids auf dem Augapfel, kräftiges Oberlid, Unterlid mit
         Lidrand, Lidfalte, Tränenkarunkel; Wimpern als einzelne gebogene
         Striche (oben 9–12, unten 6), bei jedem Menschen.
       - Brauen aus 14–24 einzelnen Haaren in Wuchsrichtung (innen nach
         oben, außen zur Schläfe) über einem zarten Grund.
       - Nase: Glanz auf Rücken und Spitze, Schattenseite, Nasenflügel mit
         Furche, Nasenlöcher, Steg, Schatten unter der Nase.
       - Mund: Oberlippe mit Amorbogen, Lippenrand, Unterlippe mit Glanz,
         Mundwinkel; Philtrum aus zwei Leisten.
       - Alter: Baby mit großer Stirn, kleiner Nase, runden Wangen; alte
         Menschen mit Stirn-, Krähenfuß- und Nasolabialfalten, Tränen-
         säcken und Altersflecken.
       Feine Maße mit zwei Nachkommastellen (r2), sonst werden Wimpern und
       Iris in der Nahansicht eckig. */
    const r2 = (v) => Math.round(v * 100) / 100;
    const P2 = (p) => r2(p[0]) + " " + r2(p[1]);
    const alt = spec.alter === "alt";
    const gid8 = (n) => h.id + n + h.zaehler();
    const GL = gid8("gl"), DK = gid8("dk"), RT = gid8("rt");
    h.defs.push('<radialGradient id="' + GL + '"><stop offset="0" stop-color="#fffaf2"/><stop offset="1" stop-color="#fffaf2" stop-opacity="0"/></radialGradient>'
      + '<radialGradient id="' + DK + '"><stop offset="0" stop-color="' + dunkler(hautF, 0.55) + '"/><stop offset="1" stop-color="' + dunkler(hautF, 0.55) + '" stop-opacity="0"/></radialGradient>'
      + '<radialGradient id="' + RT + '"><stop offset="0" stop-color="#d4695a"/><stop offset="1" stop-color="#d4695a" stop-opacity="0"/></radialGradient>');
    const weich = (c, rx, ry, art, op, dreh) => '<ellipse cx="' + r2(c[0]) + '" cy="' + r2(c[1]) + '" rx="' + r2(Math.max(0.05, rx)) + '" ry="' + r2(Math.max(0.05, ry)) + '" fill="url(#' + art + ')" opacity="' + op.toFixed(2) + '"' + (dreh ? ' transform="rotate(' + r1(dreh) + " " + r2(c[0]) + " " + r2(c[1]) + ')"' : "") + "/>";
    const auf2 = (y, u) => { const q = flaeche(y, u); return sichtbar(q.n) > 0.04 ? pr(q.p) : null; };
    const licht = -schatten;                         // Seite (u-Vorzeichen), die zum Licht zeigt
    const bz = (a, b, c, d, t) => { const m = 1 - t; return [m * m * m * a[0] + 3 * m * m * t * b[0] + 3 * m * t * t * c[0] + t * t * t * d[0], m * m * m * a[1] + 3 * m * m * t * b[1] + 3 * m * t * t * c[1] + t * t * t * d[1]]; };
    const nrm2 = (v) => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };

    /* ---- Modellierung: Licht und Schatten auf der Gesichtsfläche ---- */
    if (vonVorn > -0.1) {
      let mo = "";
      const setz = (y, u, rx, ry, art, op) => { const p = auf2(y, u); if (p) mo += weich(p, rx * k, ry * k, art, op); };
      setz(-5.6, licht * 0.25, 3.4, 2.2, GL, 0.34);                  // Stirn
      setz(2.6, licht * 0.62, 1.9, 1.2, GL, 0.3);                    // Wangenknochen
      setz(9.6, licht * 0.12, 1.5, 0.9, GL, 0.26);                   // Kinn
      setz(-3.2, schatten * 0.86, 1.8, 3.6, DK, 0.22);               // Schläfe
      setz(5.2, schatten * 0.66, 1.9, 2.4, DK, baby ? 0.08 : 0.2);   // unter dem Wangenknochen
      setz(8.4, schatten * 0.7, 1.6, 2.4, DK, 0.14);                 // Kiefer
      ["L", "R"].forEach((sd) => {                                    // Wangenröte
        const s = sd === "L" ? 1 : -1;
        setz(3.9, s * 0.56, baby || !M.erw ? 2.4 : 1.9, baby ? 1.8 : 1.3, RT, baby || !M.erw ? 0.28 : (M.w ? 0.18 : 0.1));
      });
      svg += mo;
    }

    /* ---- Augen ---- */
    const augenFarbe = AUGE[gi % AUGE.length];
    const irisId = gid8("i"), skId = gid8("sk"), lsId = gid8("ls");
    h.defs.push('<radialGradient id="' + irisId + '"><stop offset="0" stop-color="' + dunkler(augenFarbe, 0.45) + '"/><stop offset=".34" stop-color="' + heller(augenFarbe, 0.34) + '"/><stop offset=".64" stop-color="' + augenFarbe + '"/><stop offset=".87" stop-color="' + dunkler(augenFarbe, 0.35) + '"/><stop offset="1" stop-color="' + dunkler(augenFarbe, 0.78) + '"/></radialGradient>'
      + '<radialGradient id="' + skId + '" cx=".5" cy=".62" r=".6"><stop offset="0" stop-color="#fcf9f4"/><stop offset=".62" stop-color="#efe5dc"/><stop offset="1" stop-color="' + misch("#cdb2a4", hautF, 0.25) + '"/></radialGradient>'
      + '<linearGradient id="' + lsId + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b241a" stop-opacity=".62"/><stop offset=".36" stop-color="#3b241a" stop-opacity=".2"/><stop offset=".58" stop-color="#3b241a" stop-opacity="0"/></linearGradient>');
    const augY = 0.2, augU = 0.43;
    const wimperF = misch(haarF, "#140d0a", 0.72);
    ["L", "R"].forEach((sd) => {
      const s = sd === "L" ? 1 : -1;
      const F = flaeche(augY, s * augU);
      const vis = sichtbar(F.n);
      if (vis < 0.08) return;
      const c = pr(add(F.p, mul(F.n, -0.3 * k)));
      /* Die Querrichtung des Auges ist die waagrechte Tangente der
         Gesichtsfläche an dieser Stelle. */
      const nU = dot(F.n, U), nV = dot(F.n, Vv);
      const tang3 = add(mul(U, nV), mul(Vv, -nU));
      const quer = prRichtung(tang3);
      const ql = Math.hypot(quer[0], quer[1]) || 1;
      const qx = quer[0] / ql, qy = quer[1] / ql;
      const w = 1.6 * k * klemm(ql, 0.3, 1) * (baby ? 1.18 : 1);
      const hgt = (M.w ? 0.64 : 0.58) * k * (baby ? 1.3 : 1) * (alt ? 0.9 : 1);
      /* u = −1 innen (Nase), +1 außen (Schläfe) — für beide Augen gleich */
      const P = (u, v) => [c[0] + qx * s * u * w, c[1] + qy * s * u * w + v * hgt];
      const a = P(-1, 0.12), b = P(1, -0.06), o1 = P(-0.45, -1.22), o2 = P(0.48, -1.14), u1 = P(-0.35, 0.72), u2 = P(0.5, 0.62);
      const auge = "M" + P2(a) + "C" + P2(o1) + " " + P2(o2) + " " + P2(b) + "C" + P2(u2) + " " + P2(u1) + " " + P2(a) + "Z";
      /* Augenhöhle: Schatten innen oben, Licht auf dem Brauenbogen außen */
      svg += weich(P(-0.55, -1.9), w * 0.95, hgt * 1.5, DK, alt ? 0.3 : 0.22);
      svg += weich(P(0.55, -2.7), w * 0.8, hgt * 0.8, GL, 0.22);
      svg += weich(P(-0.1, 1.55), w * 0.85, hgt * 0.55, DK, alt ? 0.3 : (baby ? 0.05 : 0.13));
      /* Blickrichtung: die Iris wandert zur Seite, in die die Figur schaut */
      const vr = prRichtung(Vv);
      const iris = [c[0] + vr[0] * 0.35 * k, c[1] + 0.02 * k];
      const ir = 0.62 * k * (baby ? 1.25 : 1);
      const irx = ir * klemm(vis * 1.1, 0.42, 1);
      const cid = h.id + "a" + h.zaehler();
      h.defs.push('<clipPath id="' + cid + '"><path d="' + auge + '"/></clipPath>');
      svg += '<path d="' + auge + '" fill="url(#' + skId + ')"/>';
      /* Iris: Kranz, Strahlen (hell und dunkel), dunkler Rand, Pupille */
      let hellS = "", dunkS = "";
      for (let j = 0; j < 16; j++) {
        const wj = j * Math.PI / 8 + 0.2, r0 = 0.42 + (j % 3) * 0.04, r1_ = 0.9 - (j % 2) * 0.1;
        const seg = "M" + P2([iris[0] + Math.cos(wj) * irx * r0, iris[1] + Math.sin(wj) * ir * r0]) + "L" + P2([iris[0] + Math.cos(wj + 0.06) * irx * r1_, iris[1] + Math.sin(wj + 0.06) * ir * r1_]);
        if (j % 2) dunkS += seg; else hellS += seg;
      }
      svg += '<g clip-path="url(#' + cid + ')"><g data-teil="iris"><ellipse cx="' + r2(iris[0]) + '" cy="' + r2(iris[1]) + '" rx="' + r2(irx) + '" ry="' + r2(ir) + '" fill="url(#' + irisId + ')" stroke="' + dunkler(augenFarbe, 0.72) + '" stroke-width="' + r2(0.07 * k) + '"/>'
        + '<path d="' + hellS + '" stroke="' + heller(augenFarbe, 0.5) + '" stroke-width="' + r2(0.05 * k) + '" opacity=".6"/>'
        + '<path d="' + dunkS + '" stroke="' + dunkler(augenFarbe, 0.45) + '" stroke-width="' + r2(0.045 * k) + '" opacity=".55"/></g>'
        + '<ellipse data-teil="pupille" cx="' + r2(iris[0]) + '" cy="' + r2(iris[1]) + '" rx="' + r2(irx * (baby ? 0.44 : 0.38)) + '" ry="' + r2(ir * (baby ? 0.44 : 0.38)) + '" fill="#0b0807"/>'
        /* Schatten des Oberlids auf dem Augapfel */
        + '<rect x="' + r2(Math.min(a[0], b[0])) + '" y="' + r2(Math.min(o1[1], o2[1]) - 0.1 * k) + '" width="' + r2(Math.abs(b[0] - a[0])) + '" height="' + r2(2.1 * hgt) + '" fill="url(#' + lsId + ')"/>'
        + '<circle cx="' + r2(iris[0] - 0.3 * ir) + '" cy="' + r2(iris[1] - 0.34 * ir) + '" r="' + r2(0.2 * ir) + '" fill="#fff" opacity=".95"/>'
        + '<circle cx="' + r2(iris[0] + 0.34 * ir) + '" cy="' + r2(iris[1] + 0.28 * ir) + '" r="' + r2(0.08 * ir) + '" fill="#fff" opacity=".6"/></g>';
      /* Oberlid: kräftige Linie, außen etwas breiter; Lidfalte darüber */
      const lidB = (M.w ? 0.2 : 0.16) * k * (baby ? 0.9 : 1);
      svg += '<path d="M' + P2(a) + "C" + P2(o1) + " " + P2(o2) + " " + P2(b) + '" fill="none" stroke="' + misch(wimperF, hautF, 0.1) + '" stroke-width="' + r2(lidB) + '" stroke-linecap="round"/>';
      svg += '<path d="M' + P2(bz(a, o1, o2, b, 0.45)) + "C" + P2(bz(a, o1, o2, b, 0.62)) + " " + P2(bz(a, o1, o2, b, 0.85)) + " " + P2(b) + '" fill="none" stroke="' + wimperF + '" stroke-width="' + r2(lidB * 1.5) + '" stroke-linecap="round"/>';
      const f1 = P(-0.82, -1.55), f2 = P(0.1, -2.2 - (alt ? 0.15 : 0)), f3 = P(1.08, -1.3);
      svg += '<path d="M' + P2(f1) + "Q" + P2(f2) + " " + P2(f3) + '" fill="none" stroke="' + dunkler(hautF, 0.34) + '" stroke-width="' + r2(0.1 * k) + '" opacity=".7"/>';
      /* Wimpern: einzelne gebogene Striche, außen länger und nach außen geschwungen */
      const aussenR = nrm2([b[0] - a[0], b[1] - a[1]]);
      const hoch = [aussenR[1], -aussenR[0]][1] < 0 ? [aussenR[1], -aussenR[0]] : [-aussenR[1], aussenR[0]];
      const nOben = M.w ? 13 : (baby ? 10 : 10);
      const lang = (M.w ? 0.5 : 0.34) * k * (baby ? 1.0 : 1) * (alt ? 0.8 : 1) * klemm(vis * 1.25, 0.5, 1);
      let wd = "";
      for (let i = 0; i < nOben; i++) {
        const t = 0.1 + 0.88 * i / (nOben - 1) + ((i * 37) % 7 - 3) * 0.004;
        const p = bz(a, o1, o2, b, t);
        /* Wimpern stehen zuerst nach vorn-unten (flach) und biegen sich dann nach oben */
        const d = nrm2([hoch[0] * (0.55 - 0.3 * t) + aussenR[0] * (0.35 + 0.9 * t), hoch[1] * (0.55 - 0.3 * t) + aussenR[1] * (0.35 + 0.9 * t)]);
        const L = lang * (0.45 + 0.65 * Math.sin(Math.PI * (0.15 + 0.7 * t)));
        const m = [p[0] + d[0] * L * 0.55, p[1] + d[1] * L * 0.55];
        const e = [p[0] + d[0] * L * 0.75 + hoch[0] * L * 0.55, p[1] + d[1] * L * 0.75 + hoch[1] * L * 0.55];
        wd += "M" + P2(p) + "Q" + P2(m) + " " + P2(e);
      }
      svg += '<path data-teil="wimpern" d="' + wd + '" fill="none" stroke="' + wimperF + '" stroke-width="' + r2((M.w ? 0.075 : 0.06) * k) + '" stroke-linecap="round"/>';
      /* Unterlid: Lidrand (rosa), Hautlinie, feine untere Wimpern */
      svg += '<path d="M' + P2(a) + "C" + P2(u1) + " " + P2(u2) + " " + P2(b) + '" fill="none" stroke="#dca69a" stroke-width="' + r2(0.1 * k) + '" opacity=".75"/>';
      const ua = [a[0], a[1] + 0.12 * hgt], ub = [b[0], b[1] + 0.1 * hgt];
      svg += '<path d="M' + P2(ua) + "C" + P2([u1[0], u1[1] + 0.2 * hgt]) + " " + P2([u2[0], u2[1] + 0.2 * hgt]) + " " + P2(ub) + '" fill="none" stroke="' + dunkler(hautF, 0.34) + '" stroke-width="' + r2(0.08 * k) + '" opacity=".6"/>';
      let ud = "";
      for (let i = 0; i < 6; i++) {
        const t = 0.35 + i * 0.12;
        const p = bz(a, u1, u2, b, t);
        const d = nrm2([-hoch[0] * 0.8 + aussenR[0] * 0.5, -hoch[1] * 0.8 + aussenR[1] * 0.5]);
        const L = lang * 0.32 * (0.7 + 0.5 * t);
        ud += "M" + P2(p) + "L" + P2([p[0] + d[0] * L, p[1] + d[1] * L]);
      }
      svg += '<path data-teil="wimpernU" d="' + ud + '" stroke="' + wimperF + '" stroke-width="' + r2(0.04 * k) + '" opacity=".55"/>';
      /* Tränenkarunkel */
      const ka = P(-0.86, 0.14);
      svg += '<ellipse cx="' + r2(ka[0]) + '" cy="' + r2(ka[1]) + '" rx="' + r2(0.2 * k) + '" ry="' + r2(0.15 * k) + '" fill="#d98c84"/><circle cx="' + r2(ka[0] - 0.04 * k) + '" cy="' + r2(ka[1] - 0.05 * k) + '" r="' + r2(0.05 * k) + '" fill="#fff" opacity=".7"/>';
      /* Alter: Krähenfüße und Tränensack */
      if (alt) {
        let fd = "";
        [-0.5, 0.05, 0.6].forEach((dv, j) => { const p0 = P(1.25, dv - 0.2), p1 = P(1.85 + j * 0.1, dv * 1.6 - 0.35); fd += "M" + P2(p0) + "Q" + P2([(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 - 0.1 * k]) + " " + P2(p1); });
        svg += '<path d="' + fd + '" fill="none" stroke="' + dunkler(hautF, 0.32) + '" stroke-width="' + r2(0.07 * k) + '" opacity=".6"/>';
        svg += '<path d="M' + P2(P(-0.7, 1.35)) + "Q" + P2(P(0.1, 2.15)) + " " + P2(P(0.95, 1.2)) + '" fill="none" stroke="' + dunkler(hautF, 0.3) + '" stroke-width="' + r2(0.09 * k) + '" opacity=".55"/>';
      }
      /* Augenbraue aus einzelnen Haaren */
      const bi = auf2(-1.5 - gi * 0.06, s * 0.17), ba = auf2(-2.15 - gi * 0.08, s * 0.47), bo = auf2(-1.55, s * 0.76);
      if (ba) {
        const bI = bi || ba, bO = bo || ba;
        const bfarbe = misch(haarF, "#2a1d16", spec.haarfarbe === "weiss" || spec.haarfarbe === "grau" ? 0.12 : 0.3);
        const ctl = [2 * ba[0] - (bI[0] + bO[0]) / 2, 2 * ba[1] - (bI[1] + bO[1]) / 2];
        const B = (t) => { const m = 1 - t; return [m * m * bI[0] + 2 * m * t * ctl[0] + t * t * bO[0], m * m * bI[1] + 2 * m * t * ctl[1] + t * t * bO[1]]; };
        const raus = nrm2([bO[0] - bI[0], bO[1] - bI[1]]);
        const oben = raus[1] * 0 + (-1);   // Bildschirm oben
        const dick = (M.w ? 0.4 : 0.58) * k * (baby ? 0.5 : 1) * (gi === 2 ? 1.2 : 1);
        /* zarter Grund */
        const ob = [], un = [];
        for (let i = 0; i <= 8; i++) { const t = i / 8, p = B(t), th = dick * (1 - 0.72 * t) * (i === 0 ? 0.8 : 1); ob.push([p[0], p[1] - th * 0.55]); un.push([p[0], p[1] + th * 0.45]); }
        svg += '<path d="M' + ob.map(P2).join("L") + "L" + un.reverse().map(P2).join("L") + 'Z" fill="' + bfarbe + '" opacity="' + (baby ? 0.22 : 0.55) + '"/>';
        const n = baby ? 12 : (M.w ? 26 : 34) + (alt ? 4 : 0);
        let hd = "";
        for (let j = 0; j < n; j++) {
          const t = klemm(j / (n - 1) + (((j * 53) % 11) - 5) * 0.006, 0, 1);
          const p = B(t), th = dick * (1 - 0.72 * t);
          const v = (((j * 7) % 5) / 4 - 0.5) * th * 0.9;
          const q = [p[0], p[1] + v];
          /* Wuchsrichtung: am Kopf der Braue steil nach oben, dann zur Schläfe */
          const steil = klemm(1 - t * 3, 0, 1);
          const d = nrm2([raus[0] * (0.35 + 0.65 * (1 - steil)), raus[1] * 0.5 + oben * (0.25 + 0.75 * steil) + (t > 0.7 ? 0.2 : 0)]);
          const L = (0.46 + (alt && j % 5 === 0 ? 0.35 : 0)) * k * (1 - 0.3 * t) * (baby ? 0.6 : 1);
          hd += "M" + P2(q) + "Q" + P2([q[0] + d[0] * L * 0.6, q[1] + d[1] * L * 0.6]) + " " + P2([q[0] + d[0] * L + raus[0] * L * 0.2, q[1] + d[1] * L + 0.12 * L]);
        }
        svg += '<path data-teil="braue" d="' + hd + '" fill="none" stroke="' + dunkler(bfarbe, 0.18) + '" stroke-width="' + r2(0.07 * k) + '" stroke-linecap="round" opacity=".9"/>';
      }
    });

    /* ---- Nase ---- Glanz auf Rücken und Spitze, Schattenseite,
       Nasenflügel mit Furche, Nasenlöcher, Steg, Schatten darunter. Im
       Profil zeichnet das Profil die Nase. */
    const nSpitze = profil[6].p;
    const pSp = pr(nSpitze);
    const vorneDeck = 1 - profilDeck;
    if (vonVorn > 0) {
      const lang3 = (p, q, br, art, op) => { if (!p || !q) return ""; const c = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], l = Math.hypot(q[0] - p[0], q[1] - p[1]); return weich(c, br, l * 0.62, art, op, Math.atan2(q[0] - p[0], p[1] - q[1]) * -180 / Math.PI); };
      const rT = pr(add(flaeche(0.6, 0).p, mul(Vv, 0.35 * k * nB))), rU = pr(add(flaeche(3.9, 0).p, mul(Vv, 1.4 * k * nB)));
      svg += lang3([rT[0] - licht * 0.15 * k, rT[1]], [rU[0] - licht * 0.2 * k * (1 - seitlich), rU[1]], 0.42 * k * nB, GL, 0.5 * vorneDeck);
      const sA = pr(flaeche(0.6, schatten * 0.14).p), sC = pr(flaeche(4.6, schatten * 0.3).p);
      svg += lang3(sA, sC, 0.75 * k * nB, DK, 0.38 * vorneDeck + 0.06);
      /* Schatten unter der Nase auf die Oberlippe */
      const un0 = auf2(5.7, schatten * 0.05);
      if (un0) svg += weich(un0, 1.3 * k * nB, 0.55 * k, DK, 0.3 * vorneDeck + 0.05);
      let loecher = "";
      ["L", "R"].forEach((sd) => {
        const s = sd === "L" ? 1 : -1;
        const n = unit(add(mul(U, s * 0.55), Vv));
        const sn = sichtbar(n);
        if (sn < 0.1) return;
        /* Nasenflügel: Wölbung mit Licht, Furche als Bogen */
        const f0 = pr(auf(3.8, s * 0.95 * nB, 9.9)), f1 = pr(auf(4.55, s * 1.85 * nB, 9.1)), f2 = pr(auf(5.35, s * 1.15 * nB, 9.35));
        const fm = pr(auf(4.6, s * 1.3 * nB, 9.6));
        svg += weich(fm, 0.55 * k * nB, 0.42 * k, s === licht ? GL : DK, s === licht ? 0.3 : 0.18);
        svg += '<path d="M' + P2(f0) + "Q" + P2(f1) + " " + P2(f2) + '" fill="none" stroke="' + dunkler(hautF, 0.42) + '" stroke-width="' + r2(0.13 * k) + '" stroke-linecap="round" opacity=".6"/>';
        svg += '<path d="M' + P2(f0) + "Q" + P2(f1) + " " + P2(f2) + '" fill="none" stroke="' + dunkler(hautF, 0.4) + '" stroke-width="' + r2(0.45 * k) + '" stroke-linecap="round" opacity=".12"/>';
        /* Nasenloch: schräg liegende Tropfenform, innen am Steg schmal */
        const nl = pr(auf(5.05, s * 0.72 * nB, 9.55)), na = pr(auf(5.0, s * 0.3 * nB, 9.9)), nb = pr(auf(4.9, s * 1.2 * nB, 9.3));
        const breit = 0.26 * k * klemm(sn, 0.35, 1) * (baby ? 0.8 : 1);
        loecher += "M" + P2(na) + "Q" + P2([nl[0], nl[1] + breit * 1.1]) + " " + P2(nb) + "Q" + P2([nl[0], nl[1] - breit * 0.8]) + " " + P2(na) + "Z";
      });
      if (loecher) svg += '<path data-teil="nasenloch" d="' + loecher + '" fill="' + dunkler(hautF, 0.66) + '" opacity=".88"/>';
      /* Unterkante der Nasenspitze, Steg und Glanzlicht */
      const fl = pr(auf(4.95, 1.2 * nB, 9.4)), fr = pr(auf(4.95, -1.2 * nB, 9.4)), un = pr(profil[7].p);
      svg += '<path d="M' + P2(fl) + "Q" + P2([un[0], un[1] + 0.35 * k]) + " " + P2(fr) + '" fill="none" stroke="' + dunkler(hautF, 0.35) + '" stroke-width="' + r2(0.12 * k) + '" opacity="' + (0.35 * vorneDeck).toFixed(2) + '"/>';
      if (seitlich < 0.5) {
        const gl = [pSp[0] - nasenSeite * 0.5 * k * seitlich - 0.15 * k, pSp[1] - 0.5 * k];
        svg += weich(gl, 0.7 * k * nB, 0.55 * k, GL, 0.6 * (1 - seitlich / 0.5));
        svg += '<ellipse cx="' + r2(gl[0] - 0.08 * k) + '" cy="' + r2(gl[1] - 0.05 * k) + '" rx="' + r2(0.16 * k) + '" ry="' + r2(0.11 * k) + '" fill="#fff" opacity="' + (0.5 * (1 - seitlich / 0.5)).toFixed(2) + '"/>';
      }
    }

    /* ---- Mund ---- Oberlippe mit Amorbogen (zwei Spitzen, Delle),
       Lippenrand, Unterlippe mit Glanz, Mundwinkel, Philtrum. */
    const mY = baby ? 6.8 : 7.4;
    const mm0 = flaeche(mY, 0), mL = flaeche(mY, 0.36), mR = flaeche(mY, -0.36);
    const lippe = misch(hautF, M.w && M.erw ? "#b24f58" : "#a45a50", M.w && M.erw ? 0.48 : (alt ? 0.22 : 0.32));
    const laecheln = (spec.laecheln == null ? 0.35 : spec.laecheln) * k;
    if (vonVorn > -0.1 && vorneDeck > 0.05) {
      const vorn = (q) => add(q.p, mul(q.n, 0.45 * k));
      const pm = pr(add(mm0.p, mul(mm0.n, 0.9 * k)));
      const pl = sichtbar(mL.n) > 0 ? pr(vorn(mL)) : [pm[0] + (pr(mL.p)[0] - pm[0]) * 0.35, pr(mL.p)[1]];
      const prr = sichtbar(mR.n) > 0 ? pr(vorn(mR)) : [pm[0] + (pr(mR.p)[0] - pm[0]) * 0.35, pr(mR.p)[1]];
      const ol = 0.55 * k * (M.w ? 1.15 : 0.9) * (alt ? 0.75 : 1), ul = 0.75 * k * (M.w ? 1.2 : 0.95) * (alt ? 0.8 : 1);
      const op = ' opacity="' + klemm(vorneDeck * 1.3, 0, 1).toFixed(2) + '"';
      const lid = gid8("l");
      h.defs.push('<linearGradient id="' + lid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + dunkler(lippe, 0.12) + '"/><stop offset=".55" stop-color="' + lippe + '"/><stop offset="1" stop-color="' + dunkler(lippe, 0.2) + '"/></linearGradient>');
      const spL = [lerp(pl[0], pm[0], 0.62), pm[1] - ol * 1.35], spR = [lerp(prr[0], pm[0], 0.62), pm[1] - ol * 1.35], delle = [pm[0], pm[1] - ol * 1.02];
      const spalt = (x) => [x[0], x[1]];
      const mitteS = [pm[0], pm[1] + laecheln * 0.4];
      let m = '<g' + op + '>';
      /* Philtrum: zwei Leisten von der Nase zu den Spitzen des Amorbogens */
      const ph0 = pr(add(flaeche(5.5, 0).p, mul(Vv, 0.95 * k)));
      m += weich([pm[0], lerp(ph0[1], delle[1], 0.5)], 0.32 * k, 0.6 * k, DK, 0.22);
      m += '<path d="M' + P2([ph0[0] + (spL[0] - pm[0]) * 0.55, ph0[1]]) + "L" + P2(spL) + "M" + P2([ph0[0] + (spR[0] - pm[0]) * 0.55, ph0[1]]) + "L" + P2(spR) + '" stroke="' + heller(hautF, 0.3) + '" stroke-width="' + r2(0.13 * k) + '" opacity=".45"/>';
      /* Oberlippe */
      m += '<path d="M' + P2(pl) + "Q" + P2([lerp(pl[0], spL[0], 0.5), spL[1] + ol * 0.45]) + " " + P2(spL) + "Q" + P2([lerp(spL[0], pm[0], 0.5), spL[1] - ol * 0.05]) + " " + P2(delle) + "Q" + P2([lerp(spR[0], pm[0], 0.5), spR[1] - ol * 0.05]) + " " + P2(spR) + "Q" + P2([lerp(prr[0], spR[0], 0.5), spR[1] + ol * 0.45]) + " " + P2(prr)
        + "Q" + P2(mitteS) + " " + P2(spalt(pl)) + 'Z" fill="' + dunkler(lippe, 0.2) + '"/>';
      /* Lippenrand (weiße Linie) über der Oberlippe */
      m += '<path d="M' + P2([lerp(pl[0], spL[0], 0.4), lerp(pl[1], spL[1], 0.55) - 0.05 * k]) + "L" + P2([spL[0], spL[1] - 0.08 * k]) + "L" + P2([delle[0], delle[1] - 0.08 * k]) + "L" + P2([spR[0], spR[1] - 0.08 * k]) + "L" + P2([lerp(prr[0], spR[0], 0.4), lerp(prr[1], spR[1], 0.55) - 0.05 * k]) + '" fill="none" stroke="' + heller(hautF, 0.4) + '" stroke-width="' + r2(0.1 * k) + '" opacity=".55"/>';
      /* Unterlippe */
      m += '<path d="M' + P2(pl) + "Q" + P2(mitteS) + " " + P2(prr) + "C" + P2([lerp(prr[0], pm[0], 0.3), pm[1] + ul * 1.75]) + " " + P2([lerp(pl[0], pm[0], 0.3), pm[1] + ul * 1.75]) + " " + P2(pl) + 'Z" fill="url(#' + lid + ')"/>';
      /* Mundspalte und Mundwinkel */
      m += '<path d="M' + P2([pl[0], pl[1] - laecheln * 0.3]) + "Q" + P2([pm[0], pm[1] + laecheln * 0.5]) + " " + P2([prr[0], prr[1] - laecheln * 0.3]) + '" fill="none" stroke="' + dunkler(lippe, 0.62) + '" stroke-width="' + r2(0.12 * k) + '" stroke-linecap="round"/>';
      m += weich(pl, 0.28 * k, 0.2 * k, DK, 0.5) + weich(prr, 0.28 * k, 0.2 * k, DK, 0.5);
      /* Glanz auf der Unterlippe */
      m += weich([pm[0] - 0.35 * k, pm[1] + ul * 0.95], 0.75 * k, 0.26 * k, GL, 0.75);
      m += '<path d="M' + P2([pm[0] - 0.7 * k, pm[1] + ul * 0.92]) + "Q" + P2([pm[0] - 0.3 * k, pm[1] + ul * 0.75]) + " " + P2([pm[0] + 0.2 * k, pm[1] + ul * 0.9]) + '" fill="none" stroke="#fff" stroke-width="' + r2(0.07 * k) + '" opacity=".45"/>';
      /* Schatten unter der Unterlippe (Kinnfurche) */
      m += weich([pm[0], pm[1] + ul * 2.3], 1.1 * k, 0.38 * k, DK, 0.35);
      m += "</g>";
      svg += m;
      /* Falten neben dem Mund bei alten Menschen */
      if (alt) {
        let fd = "";
        ["L", "R"].forEach((sd) => { const s = sd === "L" ? 1 : -1; const a = auf2(8.1, s * 0.34), b = auf2(9.5, s * 0.36); if (a && b) fd += "M" + P2(a) + "L" + P2(b); });
        if (fd) svg += '<path d="' + fd + '" stroke="' + dunkler(hautF, 0.3) + '" stroke-width="' + r2(0.12 * k) + '" opacity=".45"/>';
      }
    }
    if (profilDeck > 0 && vonVorn > -0.25) {
      /* Lippenrot im Profil und die Mundspalte nach hinten */
      const lp = profil.filter((q) => q.y >= 6.1 && q.y <= 8.7);
      const lpP = lp.map((q) => pr(q.p)), lpI = lp.map((q) => pr(add(q.innen, mul(Vv, 1.0 * k)))).reverse();
      svg += '<path d="' + pfad(lpP, true) + "L" + lpI.map((q) => r1(q[0]) + " " + r1(q[1])).join("L") + 'Z" fill="' + lippe + '" opacity="' + profilDeck.toFixed(2) + '"/>';
      const sp0 = pr(profil[11].p), sp1 = pr(add(profil[11].innen, mul(U, 0)));
      svg += linie([sp0, [lerp(sp0[0], sp1[0], 0.8), lerp(sp0[1], sp1[1], 0.8) + laecheln * 0.2]], dunkler(lippe, 0.55), 0.22 * k, ' opacity="' + profilDeck.toFixed(2) + '"');
    }
    /* Kieferlinie im Halbprofil */
    if (vonVorn > -0.2 && !baby && seitlich > 0.35) {
      const kl = [];
      const seiteU = sichtbar(U) >= 0 ? 1 : -1;
      for (let i = 0; i <= 6; i++) kl.push(pr(rund(lerp(11.1, 7.2, i / 6), seiteU * (15 + i * 14), 0).p));
      svg += linie(kl, kontur, 0.2 * k, ' opacity="' + (0.5 * klemm((seitlich - 0.35) / 0.4, 0, 1)).toFixed(2) + '"');
    }
    if (alt || (M.erw && gi === 3)) {
      /* Falten: Nasolabial (von der Nase zum Mundwinkel) und Stirn */
      const deck = alt ? 0.6 : 0.28;
      ["L", "R"].forEach((sd) => {
        const s = sd === "L" ? 1 : -1;
        const a = flaeche(4.6, s * 0.3), b = flaeche(7.8, s * 0.46);
        if (sichtbar(a.n) < 0.25) return;
        const pts = [pr(a.p), pr(flaeche(6.2, s * 0.44).p), pr(b.p)];
        svg += linie(pts, dunkler(hautF, 0.32), 0.14 * k, ' opacity="' + deck + '"') + linie(pts.map((p) => [p[0] - s * 0.12 * k * (licht === s ? -1 : 1), p[1]]), heller(hautF, 0.3), 0.14 * k, ' opacity="' + (deck * 0.6).toFixed(2) + '"');
      });
      if (alt) {
        [-6.2, -5.2, -4.2].forEach((y, j) => {
          const pts = [-0.5, -0.25, 0, 0.25, 0.5].map((u, i) => auf2(y + (i % 2 ? 0.12 : -0.05) + Math.abs(u) * 0.4, u)).filter(Boolean);
          if (pts.length > 2) svg += linie(pts, dunkler(hautF, 0.24), 0.1 * k, ' opacity="' + (0.5 - j * 0.08).toFixed(2) + '"');
        });
        /* Altersflecken */
        [[-6.2, 0.62, 0.4], [-2.4, -0.84, 0.32], [3.4, 0.78, 0.26]].forEach((q) => {
          const p = auf2(q[0], q[1]);
          if (p) svg += '<ellipse cx="' + r2(p[0]) + '" cy="' + r2(p[1]) + '" rx="' + r2(q[2] * k) + '" ry="' + r2(q[2] * 0.8 * k) + '" fill="' + misch(hautF, "#8a5a3a", 0.3) + '" opacity=".28"/>';
        });
      }
    }

    /* ---- Das Haar ----
       Eine Schale mit Volumen über dem Schädel, an der Haarlinie
       abgeschnitten; darauf Strähnen vom Wirbel zur Haarlinie und ein
       Glanzband auf der Lichtseite. */
    /* FASSUNG 838 — XANDER (Funk 222): „man sieht keine Haarstruktur“.
       Das Haar war eine Schale mit harter Kante (wie ein Helm) und 34
       dicken Strichen. Jetzt:
       - Schale mit feiner Kontur und Verlauf, darauf 90–100 Strähnen in
         drei Tönen (dunkel in der Tiefe, Grundton, hell im Licht), vom
         Wirbel zur Haarlinie, mit Scheitel.
       - Glanzband quer über den Kopf auf der Lichtseite, durchzogen von
         hellen Einzelhaaren (so glänzt Haar: in Bändern, nicht als Fleck).
       - Weiche Haarlinie: kurze Haare wachsen über die Kante in die Stirn,
         davor feiner Flaum — kein gerader Schnitt mehr.
       - Der Umriss franst in Haarspitzen aus.
       - Locken als Kringel mit welligem Umriss (vorher schwarze Kugeln),
         Glatze als Haarkranz über den Ohren (vorher eine Kappe mit
         grauem Rand), Säuglinge mit Flaum statt Frisur, langes Haar mit
         Strähnen, Glanz und spitz auslaufenden Enden. */
    let frisur = spec.frisur === "kahl" ? "kahl" : (FRISUR[spec.frisur] ? spec.frisur : (M.w ? "lang" : "kurz"));
    if (spec.alter === "saeugling" && frisur !== "kahl") frisur = "flaum";
    const F = FRISUR[frisur];
    const hut = spec.kopfbedeckung;
    {
      const kd = /d="([^"]+)"/.exec(svg);
      if (kd) {
        const gid = h.id + "f" + h.zaehler();
        h.defs.push('<clipPath id="' + gid + '"><path d="' + kd[1] + '"/>' + (profilD ? '<path d="' + profilD + '"/>' : "") + "</clipPath>");
        svg = svg.slice(0, gesichtAb) + '<g clip-path="url(#' + gid + ')">' + svg.slice(gesichtAb) + "</g>";
      }
    }
    if (!F || F.ohrenFrei !== false || hut) svg += ohren();
    if (F && frisur !== "kahl") {
      const dick = (F.dick || 0.9) * k * (baby ? 0.5 : 1.25);
      const haarS = tab.filter((q) => q[0] <= (F.bis || 3) && (!F.glatze || q[0] >= -3.8)).map((q) => schnitt(auf(q[0] - dick * 0.45 / k, 0, q[3] - 0.25), U, Vv, q[1] * k + dick, q[2] * k + dick));
      /* Haarlinie: Winkel um den Kopf (Grad, 0 = Stirnmitte) → Höhe */
      const HL = haarLinie(F);
      const linieH = (wGrad) => {
        const d0 = ((wGrad % 360) + 360) % 360, w = d0 > 180 ? 360 - d0 : d0;   // 0 … 180, symmetrisch
        for (let i = 0; i < HL.length - 1; i++) if (w <= HL[i + 1][0]) return lerp(HL[i][1], HL[i + 1][1], (w - HL[i][0]) / (HL[i + 1][0] - HL[i][0]));
        return HL[HL.length - 1][1];
      };
      const NK = 120;
      const kante = [];
      for (let i = 0; i <= NK; i++) {
        const w = (i / NK) * 360;
        const y = linieH(w);
        const q = rund(y, w, 0.25);
        kante.push({ p: pr(q.p), s: sichtbar(q.n), w, y });
      }
      /* sichtbarer Bogen der Haarlinie */
      let start = -1;
      for (let i = 0; i < NK; i++) if (kante[i].s <= 0 && kante[(i + 1) % NK].s > 0) { start = (i + 1) % NK; break; }
      let bogen = [];
      if (start < 0) bogen = kante.slice(0, NK);
      else for (let j = 0; j < NK; j++) { const q = kante[(start + j) % NK]; if (q.s <= 0) break; bogen.push(q); }
      const mitte = pr(K.p);
      let maske = "";
      if (bogen.length >= 2) {
        const a = bogen[0].p, z = bogen[bogen.length - 1].p;
        const weg = (p) => [mitte[0] + (p[0] - mitte[0]) * 8, mitte[1] + (p[1] - mitte[1]) * 8];
        const obenP = pr(add(K.p, mul(T, -60 * k)));
        const pts = [weg(z)].concat([[obenP[0], obenP[1]]], [weg(a)], bogen.map((q) => q.p));
        maske = "M" + pts.map((p) => r1(p[0]) + " " + r1(p[1])).join("L") + "Z";
      }
      const hid = h.id + "h" + h.zaehler();
      if (maske) h.defs.push('<clipPath id="' + hid + '"><path d="' + maske + '"/></clipPath>');
      const haarPunkt = (y, w) => rund(y, w, dick / k + 0.05);
      const zumLichtVon = (n) => { const nb = prRichtung(n); return (nb[0] * h.licht[0] + nb[1] * h.licht[1]) / (Math.hypot(nb[0], nb[1]) || 1); };
      const um = duenn(umriss(haarS.map((s) => ({ c: pr(s.c), U: prRichtung(s.U), V: prRichtung(s.V), a: s.a, b: s.b }))), 0.9 * k);
      let kappe = "";
      /* Locken: welliger Umriss aus kleinen Bögen unter der Schale */
      kappe += form(haarS, haarF, { hell: 0.3, dunkel: 0.34, kontur: F.locken ? haarF : dunkler(haarF, 0.3), strich: F.locken ? 0.01 : 0.12 * k, fein: 36, extra: F.flaum ? ' opacity=".5"' : "" });
      if (F.locken) {
        const fu = h.fuellung();
        let bu = "";
        um.forEach((p, i) => { const r = (0.75 + (i % 3) * 0.18) * k; bu += "M" + P2([p[0] - r, p[1]]) + "a" + r2(r) + " " + r2(r) + " 0 1 0 " + r2(2 * r) + " 0a" + r2(r) + " " + r2(r) + " 0 1 0 " + r2(-2 * r) + " 0"; });
        kappe += '<path d="' + bu + '" fill="' + fu + '"/>';
      }
      const scheitel = F.scheitel != null ? F.scheitel : 28;
      const ton = [[], [], []];
      if (!F.locken) {
        const N = F.glatze ? 46 : (F.flaum ? 44 : 96);
        for (let i = 0; i < N; i++) {
          const w = -180 + (i + ((i * 7) % 5) * 0.17) * (360 / N);
          const ende = linieH(w) - 0.1 - ((i * 13) % 5) * 0.22;
          const anf = F.glatze ? -4.6 - (i % 3) * 0.4 : ((w > -60 && w < 60 ? -10.8 : -10) + ((i * 3) % 4) * 0.45);
          const pts = [0, 0.5, 1].map((t) => haarPunkt(lerp(anf, ende, t), w + (Math.abs(w) < 90 && !F.glatze ? (scheitel - w) * 0.15 * (1 - t) : 0) + Math.sin(t * 3 + i) * 2.5));
          if (sichtbar(pts[1].n) < 0.05) continue;
          const pp = pts.map((q) => pr(q.p));
          const c = [2 * pp[1][0] - (pp[0][0] + pp[2][0]) / 2, 2 * pp[1][1] - (pp[0][1] + pp[2][1]) / 2];
          const zl = zumLichtVon(pts[1].n);
          ton[zl > 0.2 && i % 3 === 0 ? 2 : (i % 2 ? 0 : 1)].push("M" + P2(pp[0]) + "Q" + P2(c) + " " + P2(pp[2]));
        }
      } else {
        /* Kringel über die ganze Schale */
        for (let y = -10.6; y < 3; y += 1.25) for (let w = -180; w < 180; w += 13) {
          const ww = w + (Math.round(y * 4) % 2) * 6.5;
          if (y > linieH(ww) + 0.3) continue;
          const q = haarPunkt(y, ww);
          if (sichtbar(q.n) < 0.08) continue;
          const p = pr(q.p), r = (0.5 + ((Math.round(ww + y * 10) & 3) * 0.08)) * k;
          ton[zumLichtVon(q.n) > 0.3 && (Math.round(ww) & 1) ? 2 : ((Math.round(ww / 13) & 1) ? 0 : 1)].push("M" + P2([p[0] - r, p[1]]) + "a" + r2(r) + " " + r2(r) + " 0 1 1 " + r2(r * 1.4) + " " + r2(r * 0.7));
        }
      }
      const tb = F.flaum ? 0.6 : 1;
      if (ton[0].length) kappe += '<path d="' + ton[0].join("") + '" fill="none" stroke="' + dunkler(haarF, 0.45) + '" stroke-width="' + r2(0.11 * k * tb) + '" stroke-linecap="round" opacity=".55"/>';
      if (ton[1].length) kappe += '<path data-teil="straehnen" d="' + ton[1].join("") + '" fill="none" stroke="' + dunkler(haarF, 0.2) + '" stroke-width="' + r2(0.17 * k * tb) + '" stroke-linecap="round" opacity=".5"/>';
      if (ton[2].length) kappe += '<path d="' + ton[2].join("") + '" fill="none" stroke="' + heller(haarF, 0.5) + '" stroke-width="' + r2(0.1 * k * tb) + '" stroke-linecap="round" opacity=".6"/>';
      /* Glanzband mit hellen Einzelhaaren */
      if (!F.glatze && !F.locken && !F.flaum) {
        const band = [], quer = [];
        for (let w = -115; w <= 115; w += 9) {
          const ww = w + licht * 22;
          const y = -7.4 + Math.abs(w) / 115 * 2.4;
          const q = haarPunkt(y, ww);
          if (sichtbar(q.n) < 0.1 || zumLichtVon(q.n) < -0.35) continue;
          band.push(pr(q.p));
          [0, 1].forEach((z) => {
            const w2 = ww + z * 4 + ((w * 7) % 3);
            const a = pr(haarPunkt(y - 1.4 - ((w + z * 5) % 4) * 0.35, w2 + (scheitel - w2) * 0.05).p), b = pr(haarPunkt(y + 0.8 + ((w * 3 + z) % 3) * 0.4, w2 + 1).p);
            quer.push("M" + P2(a) + "L" + P2(b));
          });
        }
        if (band.length > 2) {
          const sd0 = /d="([^"]+)"/.exec(kappe);
          const bcid = h.id + "hb" + h.zaehler();
          if (sd0) h.defs.push('<clipPath id="' + bcid + '"><path d="' + sd0[1] + '"/></clipPath>');
          kappe += '<g clip-path="url(#' + bcid + ')">';
          kappe += linie(band, heller(haarF, 0.45), 2.6 * k, ' opacity=".12"') + linie(band, heller(haarF, 0.5), 1.2 * k, ' opacity=".14"');
          kappe += '<path d="' + quer.join("") + '" stroke="' + heller(haarF, 0.65) + '" stroke-width="' + r2(0.07 * k) + '" stroke-linecap="round" opacity=".5"/></g>';
        }
      }
      /* Haarspitzen am Umriss */
      {
        let tuft = "";
        um.forEach((p, i) => {
          if (i % 2 || F.locken || F.glatze) return;
          const nx = p[0] - mitte[0], ny = p[1] - mitte[1], l = Math.hypot(nx, ny) || 1;
          const n = [nx / l, ny / l];
          if (n[1] > -0.3) return;
          const t = [-n[1], n[0]], td = t[1] >= 0 ? t : [-t[0], -t[1]];
          const L = (0.7 + (i % 3) * 0.3) * k * (F.flaum ? 0.6 : 1), o = (0.1 + (i % 4) * 0.06) * k;
          const a = [p[0] - n[0] * 0.35 * k, p[1] - n[1] * 0.35 * k], e = [p[0] + n[0] * o + td[0] * L, p[1] + n[1] * o + td[1] * L];
          tuft += "M" + P2(a) + "Q" + P2([(a[0] + e[0]) / 2 + n[0] * 0.25 * k, (a[1] + e[1]) / 2 + n[1] * 0.25 * k]) + " " + P2(e);
        });
        if (tuft) kappe += '<path d="' + tuft + '" fill="none" stroke="' + haarF + '" stroke-width="' + r2(0.2 * k * tb) + '" stroke-linecap="round"/><path d="' + tuft + '" fill="none" stroke="' + dunkler(haarF, 0.3) + '" stroke-width="' + r2(0.06 * k) + '" opacity=".5"/>';
      }
      svg += maske ? '<g clip-path="url(#' + hid + ')">' + kappe + "</g>" : kappe;
      /* Weiche Haarlinie: Haare über die Kante, davor Flaum */
      if (!F.locken) {
        let fed = "", fl = "";
        bogen.forEach((q, i) => {
          if (q.s < 0.12 || (i % 3 === 1)) return;
          const a = rund(q.y + 0.15 + (i % 4) * 0.12, q.w + ((i * 7) % 5 - 2) * 0.6, 0.05), b = rund(q.y - 1.0 - ((i * 5) % 7) * 0.2, q.w + ((i * 3) % 7 - 3) * 1.5 + (scheitel - q.w) * 0.04, dick / k * 0.8);
          const pa = pr(a.p), pb = pr(b.p);
          fed += "M" + P2(pa) + "Q" + P2([lerp(pa[0], pb[0], 0.5) + ((i % 3) - 1) * 0.12 * k, lerp(pa[1], pb[1], 0.5)]) + " " + P2(pb);
          if (i % 4 === 0) fl += "M" + P2(pr(rund(q.y + 0.6, q.w + 1, 0).p)) + "L" + P2(pr(rund(q.y + 0.05, q.w + 2, 0.05).p));
        });
        if (fed) svg += '<path d="' + fed + '" fill="none" stroke="' + haarF + '" stroke-width="' + r2(0.1 * k * tb) + '" stroke-linecap="round" opacity=".55"/>';
        if (fl) svg += '<path d="' + fl + '" stroke="' + haarF + '" stroke-width="' + r2(0.06 * k) + '" opacity=".4"/>';
      }
      /* Hinten hängendes Haar (lang, Pony) */
      if (F.laenge) {
        const nackenP = auf(-2, 0, -4.6);
        const fall = unit(add(mul(T, 0.75), [0, 0.25, 0]));
        const aufrecht = T[1] > 0.5;
        const unten = add(nackenP, mul(fall, F.laenge * M.kopf * (aufrecht ? 1 : 0.35)));
        const R0 = mv(R, [0, 0, 1]);
        const breiteH = (F.breit || 9.6) * k;
        const hs = [0, 0.3, 0.7, 1].map((t, i) => {
          const c = add(lerp3(nackenP, unten, t), mul(R0, -(t * 2.4 * k)));
          return schnitt(c, U, R0, breiteH * [1, 1.1, 1.06, 0.84][i], (6.2 - t * 3) * k);
        });
        hinten += form(hs, dunkler(haarF, 0.08), { hell: 0.3, dunkel: 0.34, kontur: dunkler(haarF, 0.3), strich: 0.12 * k });
        const pH = hs.map((s) => pr(s.c));
        const q = prRichtung(U), ql = Math.hypot(q[0], q[1]) || 1;
        const qx = q[0] / ql, qy = q[1] / ql;
        const st = [[], [], []];
        let spitzen = "";
        for (let i = -12; i <= 12; i++) {
          const j = i + ((i * 5) % 3) * 0.3;
          const zug = pH.map((p, n) => [p[0] + qx * j * breiteH * 0.078 * [1, 1.1, 1.06, 0.84][n], p[1] + qy * j * 0.4 + (n === 3 ? ((i * 7) % 4) * 0.4 * k : 0)]);
          st[i % 3 === 0 ? 2 : (i % 2 ? 0 : 1)].push(pfad(zug, true));
          const e = zug[3];
          if (Math.abs(i) < 11) spitzen += "M" + P2([e[0] - qx * 0.4 * k, e[1] - 1.2 * k]) + "L" + P2([e[0] + qx * 0.1 * k, e[1] + (0.9 + (i & 3) * 0.4) * k]) + "L" + P2([e[0] + qx * 0.5 * k, e[1] - 1.2 * k]) + "Z";
        }
        hinten += '<path d="' + spitzen + '" fill="' + dunkler(haarF, 0.12) + '"/>';
        hinten += '<path d="' + st[0].join("") + '" fill="none" stroke="' + dunkler(haarF, 0.4) + '" stroke-width="' + r2(0.14 * k) + '" opacity=".55"/>'
          + '<path d="' + st[1].join("") + '" fill="none" stroke="' + dunkler(haarF, 0.18) + '" stroke-width="' + r2(0.2 * k) + '" opacity=".45"/>'
          + '<path d="' + st[2].join("") + '" fill="none" stroke="' + heller(haarF, 0.45) + '" stroke-width="' + r2(0.12 * k) + '" opacity=".55"/>';
        /* Glanz quer über das hängende Haar */
        const g0 = [lerp(pH[0][0], pH[1][0], 0.6), lerp(pH[0][1], pH[1][1], 0.6)];
        hinten += linie([[g0[0] - qx * breiteH * 0.8, g0[1] - qy * breiteH * 0.2], g0, [g0[0] + qx * breiteH * 0.8, g0[1] + qy * breiteH * 0.2]], heller(haarF, 0.5), 1.4 * k, ' opacity=".2"');
      }
      if (F.zopf) {
        const ansatz = auf(-3.5, 0, -10.4);
        const unten = add(ansatz, [0, F.zopf * M.kopf, 1 * k]);
        const zs = [0, 0.5, 1].map((t, i) => schnitt(add(lerp3(ansatz, unten, t), [0, 0, -t * 1.6 * k]), U, mv(R, [0, 0, 1]), [2.4, 2.1, 1.2][i] * k, [2.4, 2.1, 1.2][i] * k));
        hinten += form(zs, haarF, { hell: 0.28, dunkel: 0.3, kontur: dunkler(haarF, 0.35), strich: 0.12 * k });
        /* geflochtene Glieder mit Glanz */
        const pa = pr(ansatz), pu = pr(unten);
        let zd = "", zg = "";
        for (let i = 1; i < 9; i++) {
          const c = [lerp(pa[0], pu[0], i / 9), lerp(pa[1], pu[1], i / 9)], rr = (2.3 - i * 0.13) * k, sg = i % 2 ? 1 : -1;
          zd += "M" + P2([c[0] - rr * sg, c[1] - rr * 0.5]) + "Q" + P2([c[0] - rr * 0.2 * sg, c[1] + rr * 0.55]) + " " + P2([c[0] + rr * 0.7 * sg, c[1] + rr * 0.1]);
          zg += "M" + P2([c[0] - rr * 0.6 * sg, c[1] - rr * 0.25]) + "Q" + P2([c[0] - rr * 0.15 * sg, c[1] + rr * 0.2]) + " " + P2([c[0] + rr * 0.3 * sg, c[1]]);
        }
        hinten += '<path d="' + zd + '" fill="none" stroke="' + dunkler(haarF, 0.4) + '" stroke-width="' + r2(0.2 * k) + '" opacity=".7"/><path d="' + zg + '" fill="none" stroke="' + heller(haarF, 0.45) + '" stroke-width="' + r2(0.14 * k) + '" opacity=".6"/>';
      }
      if (F.glatze) {
        let kr = "";
        for (let w = -180; w < 180; w += 5) {
          const a = haarPunkt(-3.3 + ((w / 5) & 1) * 0.3, w);
          if (sichtbar(a.n) < 0.05 || linieH(w) < -3.4) continue;
          const pa = pr(a.p), pb = pr(rund(-4.4 - ((w / 5) % 3) * 0.3, w + 3, dick / k * 0.3).p);
          kr += "M" + P2(pa) + "L" + P2(pb);
        }
        if (kr) svg += '<path d="' + kr + '" stroke="' + haarF + '" stroke-width="' + r2(0.1 * k) + '" stroke-linecap="round" opacity=".7"/>';
        /* Kahler Scheitel: Glanz und bei alten Menschen Altersflecken */
        const gl = pr(auf(-9.4, licht * 2, 3));
        svg += weich(gl, 2.6 * k, 1.5 * k, GL, 0.55);
        if (alt) [[-8.8, 0.35, 0.45], [-7.6, -0.55, 0.35]].forEach((q) => { const p = auf2(q[0], q[1]); if (p) svg += '<ellipse cx="' + r2(p[0]) + '" cy="' + r2(p[1]) + '" rx="' + r2(q[2] * k) + '" ry="' + r2(q[2] * 0.75 * k) + '" fill="' + misch(hautF, "#8a5a3a", 0.3) + '" opacity=".26"/>'; });
      }
      if (F.dutt) {
        /* Der Dutt ist eine Kugel aus gewickelten Strähnen. */
        const c = pr(auf(-6.6, 0, -10.6));
        const rr = 3.7 * k;
        let wd = "";
        for (let i = 0; i < 9; i++) { const a0 = i * 0.7, rw = rr * (0.35 + (i % 4) * 0.16); wd += "M" + P2([c[0] + Math.cos(a0) * rw, c[1] + Math.sin(a0) * rw * 0.8]) + "A" + r2(rw) + " " + r2(rw * 0.75) + " " + r1(i * 40) + " 0 1 " + P2([c[0] + Math.cos(a0 + 2.2) * rw, c[1] + Math.sin(a0 + 2.2) * rw * 0.8]); }
        const d = '<circle cx="' + r1(c[0]) + '" cy="' + r1(c[1]) + '" r="' + r1(rr) + '" fill="' + haarF + '" stroke="' + dunkler(haarF, 0.3) + '" stroke-width="' + r2(0.12 * k) + '"/>'
          + weich([c[0] + rr * 0.35, c[1] + rr * 0.3], rr * 0.8, rr * 0.8, DK, 0.25)
          + '<path d="' + wd + '" fill="none" stroke="' + dunkler(haarF, 0.35) + '" stroke-width="' + r2(0.14 * k) + '" opacity=".6"/>'
          + weich([c[0] - rr * 0.3, c[1] - rr * 0.35], rr * 0.5, rr * 0.35, GL, 0.5);
        const hinter = sichtbar(mul(Vv, -1)) < -0.2 && Math.abs(sichtbar(U)) < 0.6;
        if (hinter) hinten += d; else svg += d;
      }
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
    /* FASSUNG 836: Badeshirt für die Wanne (Badekleidung für Männer und Jungen) */
    badeshirt: { aermel: 0.5, oben: 54, unten: 2 },
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
    lang: { stirn: -6.2, schlaefe: 1.5, nacken: 6, dick: 1.0, laenge: 1.3, bis: 4, ohrenFrei: false },
    zopf: { stirn: -6.6, schlaefe: -1, nacken: 3.5, dick: 0.75, zopf: 1.15 },
    dutt: { stirn: -6.6, schlaefe: -1.2, nacken: 3.2, dick: 0.7, dutt: true },
    locken: { stirn: -6.4, schlaefe: -1, nacken: 4, dick: 1.8, locken: true },
    pony: { stirn: -2.8, schlaefe: -0.5, nacken: 5, dick: 1.0, laenge: 0.55, breit: 8.2, bis: 3.5 },
    glatze: { stirn: -13, schlaefe: 0.4, nacken: 3.8, dick: 0.6, glatze: true },
    /* FASSUNG 838: Säuglinge haben Flaum statt einer Frisur */
    flaum: { stirn: -7.6, schlaefe: -2.4, nacken: 2.6, dick: 0.5, flaum: true },
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
    zeichne, POSEN, gehPose, mische, pose, massFuer, skelett, HAUT, HAAR, FARBE,
    OBERTEIL, HOSE, KLEID, JACKE, SCHUH, KOPF, FRISUR,
    HALTUNGEN: ["stehen", "kontrapost", "gehen", "sitzen", "lesen", "sitzen_boden", "schneidersitz", "fersensitz",
      "hocken", "knien", "knien_halb", "knien_vor", "krabbeln", "liegen", "winken", "halten", "zeigen", "werfen", "servieren",
      /* FASSUNG 836 */
      "bauchlage", "seitenlage", "sitzen_angewinkelt", "baden", "graetschsitz", "sitzen_ueberkreuz", "anlehnen", "laufen",
      "treppe", "buecken", "strecken", "arme_verschraenkt", "haende_huefte"],
    /* Haltungen, bei denen das Gesäß auf einer Sitzfläche liegt */
    SITZEND: { sitzen: 1, lesen: 1, sitzen_seit: 1, sitzen_ueberkreuz: 1 },
    /* FASSUNG 836: welche Körperteile in der Haltung auf dem Boden liegen
       (für die Sonde; Namen wie in zeichne({messen: true}).mess.hoehe). */
    BODEN: {
      stehen: ["fussL", "fussR"], sitzen_boden: ["gesaess"], schneidersitz: ["gesaess", "fussR"],
      hocken: ["ferseL", "ferseR", "zehL", "zehR"], fersensitz: ["knieL", "knieR", "zehL", "zehR"],
      knien: ["knieL", "knieR", "zehL", "zehR"], krabbeln: ["handL", "handR", "knieL", "knieR"],
      liegen: ["kopf", "rumpf", "gesaess", "ferseL", "ferseR"], bauchlage: ["kopf", "rumpf", "zehL", "zehR"],
      seitenlage: ["rumpf", "knieR"], sitzen_angewinkelt: ["gesaess", "ferseL", "ferseR"], baden: ["gesaess", "ferseL", "ferseR"],
      graetschsitz: ["gesaess", "ferseL", "ferseR"], buecken: ["ferseL", "ferseR", "zehL", "zehR"], treppe: ["zehR"],
      arme_verschraenkt: ["fussL", "fussR"], haende_huefte: ["fussL", "fussR"], strecken: ["zehL", "zehR"],
    },
    /* und was dabei NICHT aufliegen darf (schwebt über dem Boden) */
    FREI: { schneidersitz: ["knieL"], hocken: ["gesaess"], fersensitz: ["gesaess"], knien: ["gesaess"], krabbeln: ["rumpf", "gesaess"], strecken: ["ferseL", "ferseR"], treppe: ["ferseL", "zehL"] },
  };
  W.DMA_MENSCH = API;
})(typeof window !== "undefined" ? window : globalThis);
