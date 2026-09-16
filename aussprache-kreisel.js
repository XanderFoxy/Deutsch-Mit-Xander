/* =========================================================
   DER KREISEL — die Aussprachenote als Ring
   ---------------------------------------------------------
   DER WUNSCH
   „Ich möchte das als Kreiselanzeige haben, so wie das bei
    Rosetta Stone ist: dass eine Prozentzahl steht und dieser
    Kreisel sich füllt, von der Anfangsfarbe bis zur letzten
    Farbe."

   WIE ES BEI ROSETTA STONE AUSSIEHT — und warum hier dasselbe
   Prinzip, aber nicht dieselbe Farbtafel:
   Dort läuft die Anzeige von Rot über Gelb nach Grün. Das ist
   die gelernte Ampel, und daran wird nicht gerüttelt: Rot heisst
   „nochmal", Grün heisst „sitzt". Genommen werden aber die drei
   Farben, die auf dieser Seite ohnehin für schlecht / mittel /
   gut stehen (dieselben wie in noteFarbe() in der Prüfung) —
   sonst hätte dieselbe Note an zwei Stellen zwei Farben.

     0 %  ────────── 55 % ────────── 80 % ────────── 100 %
     #E85F6F         #E8A33D         #7FB069         #4FA88E
     rot             bernstein       hellgrün        grün

   Dazwischen wird gerechnet, nicht gesprungen. Ein Wert von
   78 % soll fast grün aussehen und nicht noch voll bernstein —
   der Lernende sieht dann, dass er NAH dran ist.

   DIE MARKE AUF DEM RING
   Ein kleiner Strich sitzt bei der Schwelle, ab der es
   weitergeht (voreingestellt 80 %). Ohne diese Marke ist eine
   Prozentzahl eine Zahl ohne Ziel. Mit ihr sieht man auf einen
   Blick: „noch ein Stück" oder „drüber".

   KEIN DOM, KEIN ZUSTAND. Die Datei baut Zeichenketten. Wer sie
   einsetzt, entscheidet, wohin sie kommen.
   ========================================================= */
window.Kreisel = (function () {
  "use strict";

  /* Die Stützstellen der Farbskala. */
  var SKALA = [
    { bei: 0,   farbe: [232, 95, 111] },   // #E85F6F
    { bei: 55,  farbe: [232, 163, 61] },   // #E8A33D
    { bei: 80,  farbe: [127, 176, 105] },  // #7FB069
    { bei: 100, farbe: [79, 168, 142] }    // #4FA88E
  ];

  function begrenzen(n, klein, gross) { return Math.max(klein, Math.min(gross, n)); }

  /* Zwischen zwei Stützstellen linear mischen. */
  function farbe(prozent) {
    var p = begrenzen(Number(prozent) || 0, 0, 100);
    for (var i = 0; i < SKALA.length - 1; i++) {
      var a = SKALA[i], b = SKALA[i + 1];
      if (p <= b.bei) {
        var anteil = b.bei === a.bei ? 0 : (p - a.bei) / (b.bei - a.bei);
        var r = Math.round(a.farbe[0] + (b.farbe[0] - a.farbe[0]) * anteil);
        var g = Math.round(a.farbe[1] + (b.farbe[1] - a.farbe[1]) * anteil);
        var bl = Math.round(a.farbe[2] + (b.farbe[2] - a.farbe[2]) * anteil);
        return "rgb(" + r + "," + g + "," + bl + ")";
      }
    }
    return "rgb(79,168,142)";
  }

  /* Ein Satz in Klartext. Die Zahl allein sagt nicht, was zu tun
     ist — der Satz schon. */
  function urteil(prozent, schwelle) {
    var s = typeof schwelle === "number" ? schwelle : 80;
    var p = Number(prozent) || 0;
    if (p >= 95) return "Perfekt — das klingt wie gesprochen, nicht wie geübt.";
    if (p >= s) return "Sitzt. Weiter zum nächsten Wort.";
    if (p >= s - 10) return "Ganz knapp darunter — einmal noch, etwas deutlicher.";
    if (p >= 50) return "Zu erkennen, aber noch undeutlich. Hör dir das Original an und sprich langsamer.";
    if (p > 0) return "Da fehlt noch viel. Hör genau hin und sprich betont nach.";
    return "Nichts angekommen — war das Mikrofon an, und war es ruhig genug?";
  }

  /* ---------------------------------------------------------
     DER RING
     Aufbau: ein grauer Ring darunter, der farbige darüber, ein
     Strich für die Schwelle, in der Mitte die Zahl.
     Der farbige Ring wird über stroke-dasharray gefüllt und
     beginnt oben (darum die Drehung um -90°).

     optionen:
       prozent    0–100, oder null („noch nichts gemessen")
       schwelle   wo die Marke sitzt (Standard 80)
       gross      true = grosse Anzeige, false = kleine
       beschriftung   was unter der Zahl steht
       stand      "misst" | "wartet" | "" — für die Ringanimation
     --------------------------------------------------------- */
  function html(optionen) {
    var o = optionen || {};
    var schwelle = typeof o.schwelle === "number" ? o.schwelle : 80;
    var hatWert = typeof o.prozent === "number" && isFinite(o.prozent);
    var p = hatWert ? begrenzen(Math.round(o.prozent), 0, 100) : 0;
    var gross = o.gross !== false;

    var groesse = gross ? 168 : 96;
    var dicke = gross ? 14 : 9;
    var mitte = groesse / 2;
    var radius = mitte - dicke / 2 - 2;
    var umfang = 2 * Math.PI * radius;
    var gefuellt = umfang * (p / 100);
    var f = farbe(p);

    /* Der Schwellenstrich: Winkel auf dem Ring ausrechnen. */
    var winkel = (schwelle / 100) * 2 * Math.PI - Math.PI / 2;
    var mx1 = mitte + Math.cos(winkel) * (radius - dicke / 2 - 1);
    var my1 = mitte + Math.sin(winkel) * (radius - dicke / 2 - 1);
    var mx2 = mitte + Math.cos(winkel) * (radius + dicke / 2 + 1);
    var my2 = mitte + Math.sin(winkel) * (radius + dicke / 2 + 1);

    var zahlGross = gross ? "2.5rem" : "1.35rem";
    var geschafft = hatWert && p >= schwelle;

    return '' +
      '<div class="kreisel ' + (gross ? "kreisel-gross" : "kreisel-klein") + (geschafft ? " kreisel-geschafft" : "") +
           (o.stand === "misst" ? " kreisel-misst" : "") + '"' +
           ' role="img" aria-label="' + (hatWert ? p + " Prozent" : "noch nicht gemessen") +
           (o.beschriftung ? ", " + String(o.beschriftung).replace(/"/g, "") : "") + '">' +
        '<svg viewBox="0 0 ' + groesse + ' ' + groesse + '" width="' + groesse + '" height="' + groesse + '" aria-hidden="true">' +
          '<circle class="kreisel-bahn" cx="' + mitte + '" cy="' + mitte + '" r="' + radius + '"' +
                 ' fill="none" stroke-width="' + dicke + '"></circle>' +
          '<circle class="kreisel-fuellung" cx="' + mitte + '" cy="' + mitte + '" r="' + radius + '"' +
                 ' fill="none" stroke="' + f + '" stroke-width="' + dicke + '" stroke-linecap="round"' +
                 ' stroke-dasharray="' + umfang.toFixed(2) + '"' +
                 ' stroke-dashoffset="' + (umfang - gefuellt).toFixed(2) + '"' +
                 ' transform="rotate(-90 ' + mitte + ' ' + mitte + ')"></circle>' +
          '<line class="kreisel-marke" x1="' + mx1.toFixed(2) + '" y1="' + my1.toFixed(2) + '"' +
               ' x2="' + mx2.toFixed(2) + '" y2="' + my2.toFixed(2) + '" stroke-width="2"></line>' +
        '</svg>' +
        '<div class="kreisel-mitte">' +
          '<span class="kreisel-zahl" style="color:' + f + '; font-size:' + zahlGross + ';">' +
            (hatWert ? p + '<span class="kreisel-prozentzeichen">%</span>' : '<span class="kreisel-noch">–</span>') +
          '</span>' +
          (o.beschriftung ? '<span class="kreisel-schild">' + o.beschriftung + '</span>' : "") +
        '</div>' +
      '</div>';
  }

  /* Eine Reihe kleiner Kreisel: der Verlauf einer Runde auf
     einen Blick. Für den Ergebnisschirm. */
  function reiheHtml(werte, schwelle) {
    return '<div class="kreisel-reihe">' + (werte || []).map(function (w) {
      var hat = typeof w.prozent === "number";
      return '<div class="kreisel-reihe-eintrag">' +
        html({ prozent: hat ? w.prozent : null, schwelle: schwelle, gross: false, beschriftung: "" }) +
        '<span class="kreisel-reihe-wort">' + (w.wort || "") + '</span>' +
      '</div>';
    }).join("") + '</div>';
  }

  return { html: html, reiheHtml: reiheHtml, farbe: farbe, urteil: urteil };
})();
