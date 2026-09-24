/* SICHERUNG vor dem SCHON-PASS Sprechbilder (XANDER, Liste vom 23.09.).
   Unveraendert aus app.js: LC_TEILCHENBILDER und lcSprechFeld samt Feuer-Sonderlogik (data-v, Funken). */

  const LC_TEILCHENBILDER = {
    /* XANDER: „bei der Magie selber kann es auch noch ein bisschen
       filigran sein ... da kann noch ein bisschen feiner gearbeitet
       werden, was wirklich magisch wirkt."
       Mehr und kleiner: 38 statt 26, und feinere Zeichen dazwischen
       (Haarstern, Punkt, Raute). */
    /* RUNDE 77 — XANDER: „bei dem Magie-Effekt koennt ihr auch etwas
       feiner sein."
       Von 38 auf 66 Teilchen, und drei neue haarfeine Zeichen dazu
       (schmaler Punkt, Ringpunkt, Doppelpunkt-Raster). Wichtiger als
       die Menge ist aber die GROESSE: siehe --gross weiter unten, wo
       fuer Magie und Funkeln jetzt eine schiefe Verteilung steht —
       viele winzige, wenige grosse. Vorher war jede Groesse gleich
       wahrscheinlich, und dann sieht man vor allem die grossen. */
    /* RUNDE 80 — XANDER: „bei der Magie sind die Elemente jetzt
       filigran … koennen noch ein bisschen filigraner sein."
       Von 66 auf 88 Teilchen, und vier weitere haarfeine Zeichen —
       aber vor allem: die Groesse wird noch staerker zu den kleinen
       hin verzogen (siehe --gross weiter unten, Exponent 3 statt 2).
       Filigran heisst nicht MEHR, sondern KLEINER — wenn zwischen
       vielen winzigen ein paar grosse stehen, sieht man nur die
       grossen. */
    magie:  { menge: 88, klasse: "lc-tmagie", rand: true, band: [33.0, 37.0],
              zeichen: ["\u2726", "\u2727", "\u00b7", "\u2734", "\u2735",
                        "\u22c6", "\u2219", "\u25ca", "\u02da", "\u2739",
                        "\u2022", "\u00b0", "\u2027", "\u22c5", "\u2e30",
                        "\u2e31", "\u205a"] },
    /* RUNDE 80 — XANDER: „Die Noten sind immer noch nicht am Pfad des
       Rahmens orientiert."
       Sie standen zwar AUF dem Rand („rand: true"), aber alle
       aufrecht — wie Schilder, die man an einen Kreis lehnt. Am PFAD
       orientiert heisst: jede Note steht senkrecht auf dem Kreis, wie
       die Buchstaben auf einem Siegel. Dafuer bekommt jedes Teilchen
       jetzt seinen eigenen Drehwinkel (siehe --dreh in lcTeilchen),
       und die Noten sind die einzige Sorte, die ihn benutzt. */
    noten:  { menge: 16, klasse: "lc-tnoten", rand: true, band: [33.4, 36.2],
              aufPfad: true,
              zeichen: ["\u266a", "\u266b", "\u266c", "\u2669"] },
    /* RUNDE 80 — XANDER: „bei den Herzen … sollten kleiner sein und
       am kreisrunden Rahmen."
       Sie lagen frei im Feld verstreut („rand" fehlte) und waren so
       gross wie die Notenzeichen. Jetzt stehen sie auf demselben
       Band wie Feuer und Magie — das ist der Reifen — und sind
       kleiner (siehe .lc-therzen im Stylesheet). Dafuer mehr davon,
       damit der Ring trotzdem voll wird. */
    herzen: { menge: 18, klasse: "lc-therzen", rand: true, band: [33.4, 36.0],
              zeichen: ["\u2665", "\u2764", "\ud83d\udc96"] },
    /* XANDER: „bei den Flammen arbeite etwas filigraner am oberen
       Rand, dass sie nicht vom Reifen wegfliegen, sondern auf dem
       Reifen tanzen."
       Das „Wegfliegen" kam aus der Streuung, und die war schlicht
       falsch gerechnet. NACHGEMESSEN auf der Pruefbuehne: das Bild
       ist 103 px breit, das Feld 148 px — das Feld ist also 1,437-mal
       so gross, und der Bildrand liegt bei 50 % / 1,437 = 34,8 % der
       Feldbreite vom Mittelpunkt. Gestreut wurde aber von 40 bis
       48 %: die naechste Flamme sass 8 px, die aeusserste 20 px
       NEBEN dem Reifen (gemessen: Radius 63 px bei Bildradius
       51,5 px). Jetzt 33,4 bis 35,6 % — das ist der Reifen selbst.
       Dazu mehr und schmalere Flammen: das ist das „filigraner". */
    /* NACHGEMESSEN und noch einmal nachgezogen: bei 33,4 % sass der
       Fusspunkt der Flamme 1,4 Prozentpunkte INNERHALB des Bildrands
       (der liegt bei 34,8 %), und die groesste Flamme reichte damit
       bis 29 px an die Mitte — knapp unter die Grenze von 30 px, die
       seine Regel „im Kreis darf nichts sein" zieht. Jetzt 34,4 bis
       36,4 %: der Fuss steht auf dem Reifen, nicht davor. */
    /* RUNDE 75 — XANDER: „der Feuereffekt ist noch nicht buendig am
       Profilrahmen, setz den ein bisschen runter, dass er wirklich
       am Ring die Flammen macht."
       Der Hauptgrund lag nicht hier, sondern im Feld selbst: es sass
       3,84 px zu hoch (siehe .lc-sprechfeld in korrekturen.css,
       nachgemessen). Das ist behoben.
       Dazu das Band: der Bildrand liegt bei 34,73 % vom Mittelpunkt
       (Bild 84 px, Feld 120,94 px). Das Band lief von 34,4 bis
       36,4 %, im Mittel also 0,7 Prozentpunkte NEBEN dem Reifen.
       Jetzt 34,0 bis 35,6 % — Mitte 34,8 %, das ist der Reifen. Nach
       der Korrektur GEMESSEN: die Fusspunkte liegen 41,24 bis
       42,98 px von der Bildmitte, der Bildradius ist 42,00 px. Sie
       stehen also wirklich auf dem Ring, je zur Haelfte innen und
       aussen. */
    /* RUNDE 77 — XANDER: „Der Feuereffekt sieht jetzt viel besser
       aus. Kannst du da noch versuchen, dass die Flammen vielleicht
       noch ein bisschen weiter runter sind?"
       Der Bildrand liegt bei 34,73 % vom Mittelpunkt (Bild 84 px,
       Feld 120,94 px). In Runde 75 stand das Band auf 34,0 bis
       35,6 % — Mitte 34,8 %, also genau auf dem Reifen. „Weiter
       runter" heisst: die Fuesse sollen ein Stueck INNERHALB des
       Reifens sitzen, dann sitzt die Flamme darauf statt daneben.
       Jetzt 33,2 bis 34,8 %, Mitte 34,0 % — 0,73 Prozentpunkte
       innerhalb des Randes, das sind knapp 0,9 px. */
    /* RUNDE 80 — XANDER: „beim Feuer kannst du noch ein bisschen die
       Flammen nach unten bringen."
       Dieselbe Schraube wie in Runde 77, noch einmal ein Stueck: der
       Bildrand liegt bei 34,73 % vom Mittelpunkt. Das Band stand auf
       33,2 bis 34,8 % (Mitte 34,0 — 0,73 Prozentpunkte innerhalb).
       Jetzt 31,9 bis 33,5 %, Mitte 32,7 %. NACHGEMESSEN im Browser
       (Bildradius 42,0 px): die Fusspunkte liegen 38,67 bis 40,50 px
       von der Bildmitte, im Mittel 39,45 — also 2,55 px innerhalb des
       Randes statt 0,88 px wie bisher. Die Flammen sitzen damit
       1,67 px tiefer im Bild. */
    feuer:  { menge: 30, klasse: "lc-tfeuer", rand: true, band: [31.9, 33.5], zeichen: [""] },
    /* XANDER: „das funkeln ist kein funkeln … das muss nicht so
       Lineal sein, das kann so ein bisschen Partikel sein."
       Also echte Teilchen wie bei Magie und Noten, jedes mit eigener
       Stelle und eigenem Takt — nicht ein Muster, das sich dreht. */
    /* XANDER: „bei dem Funkeln kannst du bisschen mehr am Kreis
       bleiben, besonders was das obere Funkeln betrifft, und du
       kannst viel mehr Elemente da reinbringen, auch kleine Partikel,
       verschiedene Formen, die vielleicht filigraner sind."
       36 statt 20, acht verschiedene Zeichen von gross bis
       haarfein — und ein schmaleres Band, damit auch oben nichts
       abhebt. */
    /* RUNDE 77 — XANDER: „das Gluehen sieht jetzt ein bisschen
       schoener aus. Da koennen aber noch mehr Elemente sein, die um
       den Rahmen herum gluehen — und weniger grosse, mehr filigran
       feine Details."
       Beides steht hier: 64 statt 36 Teilchen, und vier weitere
       haarfeine Zeichen. „Weniger grosse" steht bei --gross. */
    /* RUNDE 80 — XANDER: „das Funkeln … da fehlen noch ein paar
       Partikel in der Menge." Von 64 auf 96. */
    funkeln:{ menge: 96, klasse: "lc-tfunkeln", rand: true, band: [33.2, 36.8],
              zeichen: ["\u2726", "\u2727", "\u00b7", "\u2728", "\u22c6",
                        "\u2219", "\u02da", "\u205e", "\u2022", "\u00b0",
                        "\u2027", "\u22c5"] },
    /* Die Ladungen tanzen AUF dem Rahmen — ein schmales Band, sonst
       schweben sie daneben. */
    strom:  { menge: 14, klasse: "lc-tstrom", rand: true, band: [33.4, 35.6], zeichen: [""] },
    /* RUNDE 80 — XANDER: „bei den Blasen … koennen noch kleine
       Miniblasen mehr sein." Von 16 auf 34, und die Groessenverteilung
       liegt jetzt deutlich bei den kleinen (siehe .lc-tblasen). */
    blasen: { menge: 34, klasse: "lc-tblasen", zeichen: [""] }
  };


  function lcSprechFeld(knopf, art) {
    const kreis = knopf.querySelector(".lc-kreis");
    if (!kreis) return;
    const bau = LC_TEILCHENBILDER[art];
    /* Gesucht wird dort, wo es auch gebaut wird: am PLATZ. Stand hier
       noch der Kreis, fand die Suche nie etwas — und dann wuchs bei
       jedem Auffrischen des Raums ein weiteres Feld dazu. */
    const alt = knopf.querySelector(".lc-sprechfeld");
    /* Nichts neu bauen, was schon steht — sonst fangen die Teilchen
       bei jedem Auffrischen des Raums von vorn an, und das sieht aus
       wie Stottern. */
    if (alt && alt.dataset.art === art) return;
    if (alt) alt.remove();
    if (!bau) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const feld = document.createElement("span");
    feld.className = "lc-sprechfeld " + bau.klasse;
    feld.dataset.art = art;
    feld.setAttribute("aria-hidden", "true");
    for (let i = 0; i < bau.menge; i++) {
      const t = document.createElement("i");
      t.className = "lc-teilchen";
      const z = bau.zeichen[i % bau.zeichen.length];
      if (z) t.textContent = z;
      /* HIER LAG DER FEHLER, UND ER ERKLAERT SEHR VIEL AUF EINMAL.
         XANDER: „es soll niemals irgendwas im Kreis sein ausser den
         Blasen und bei dem Eis", „in der Mitte soll kein Feuer sein",
         „bei Magie da sind die in der Mitte".

         Die Teilchen wurden mit „rotate(--wo) translateX(--weit)" auf
         ihre Kreisbahn gesetzt. Prozente in einem translateX zaehlen
         aber die Breite des TEILCHENS — und ein Funke ist fuenf Pixel
         breit. „80 %" waren damit vier Pixel, nicht vier Fuenftel des
         Feldes: ALLE Teilchen sassen uebereinander in der Bildmitte,
         seit es sie gibt.

         Der Platz steht deshalb jetzt in left/top, und dort zaehlen
         Prozente das FELD. Gerechnet wird in Prozent der Feldbreite:
         das Feld ist 144 % so gross wie das Bild, der Bildrand liegt
         also bei 34,7 % vom Mittelpunkt. Wer aussen gehoert („rand"),
         sitzt bei 36 bis 46 % — knapp ausserhalb des Bildes. */
      const winkel = (i * (360 / bau.menge) + Math.random() * 18 - 9) * Math.PI / 180;
      /* XANDER: „bei den magischen und funkeln koennten die Symbole
         oben nicht so aus dem Kreis weggehen, die sollen am Pfad des
         Kreises entlang funktionieren."
         Wer ein eigenes Band mitbringt, bekommt es; sonst gilt die
         alte Spanne. Je schmaler das Band, desto klarer der Pfad. */
      const band = bau.band || [33, 37];
      const radius = bau.rand
        ? band[0] + Math.random() * (band[1] - band[0])
        : 14 + Math.random() * 18;
      t.style.setProperty("--wo", (winkel * 180 / Math.PI).toFixed(1) + "deg");
      t.style.setProperty("--links", (50 + Math.cos(winkel) * radius).toFixed(1) + "%");
      t.style.setProperty("--oben", (50 + Math.sin(winkel) * radius).toFixed(1) + "%");
      /* Deutlicher als vorher: groesser und heller. Die Blasen bekommen
         die groesste Spanne — „unterschiedliche Groessen" war
         ausdruecklich gewuenscht, und eine Seifenblase, die so gross
         ist wie die naechste, sieht nach Muster aus, nicht nach
         Blasen. */
      const spanne = art === "blasen" ? 1.7 : 1.1;
      /* RUNDE 77 — „weniger grosse, mehr filigran feine Details."
         Bei Magie und Funkeln wird die Groesse jetzt QUADRIERT
         gewuerfelt. Gleichverteilt lag die Haelfte aller Teilchen
         ueber 1,25; mit dem Quadrat liegt die Haelfte unter 0,69 —
         es bleiben also ein paar grosse Funken, aber die Masse ist
         fein. (Gerechnet: Median 0,4 + 0,25 · 1,15 = 0,69, groesster
         Wert unveraendert 1,55.) */
      /* RUNDE 80 — XANDER: „bei der Magie sind die Elemente jetzt
         filigran … koennen noch ein bisschen filigraner sein" und
         „bei den Blasen … koennen noch kleine Miniblasen mehr sein".
         Fuer Magie und Funkeln wird die Groesse jetzt in der DRITTEN
         Potenz gewuerfelt statt quadriert: der Median faellt damit
         von 0,69 auf 0,54, die groessten bleiben gleich. Fuer die
         Blasen dieselbe Idee — viele winzige, wenige grosse. */
      const fein = art === "magie" || art === "funkeln";
      const wurf = Math.random();
      t.style.setProperty("--gross", fein
        ? (0.32 + wurf * wurf * wurf * 1.25).toFixed(2)
        : art === "blasen"
          ? (0.34 + wurf * wurf * 1.9).toFixed(2)
          : (0.7 + wurf * spanne).toFixed(2));
      t.style.setProperty("--hell", (0.62 + Math.random() * 0.38).toFixed(2));
      /* Blasen, Noten und Herzen steigen von unten auf — die stehen
         nicht auf einer Kreisbahn, sondern verteilt ueber die Breite.
         Fuer sie (und NUR fuer sie) wird --links neu gewuerfelt; die
         Zeile stand vorher ohne Bedingung hier und hat damit jede
         berechnete Kreisbahn wieder ueberschrieben. */
      /* RUNDE 80: die Herzen stehen nicht mehr frei im Feld, sondern
         auf dem Ring (siehe LC_TEILCHENBILDER.herzen) — deshalb darf
         --links hier nicht mehr ueberschrieben werden. Fuer die
         Blasen bleibt es: die steigen im Bild auf. */
      if (art === "blasen") {
        t.style.setProperty("--links", (10 + Math.random() * 80).toFixed(0) + "%");
      }
      /* XANDER: „Die Noten koennen aber mehr innerhalb des Kreises
         sein und nicht so sehr ausserhalb fliegen."
         NACHGERECHNET: das Feld ist 1,44-mal so breit wie das Bild,
         das Bild liegt also zwischen 15 und 85 Prozent der
         Feldbreite. Gestreut wurde aber von 10 bis 90 — jede dritte
         Note startete NEBEN dem Bild. Jetzt 24 bis 76 Prozent: das
         ist mit Rand noch im Bild. */
      /* RUNDE 80 — XANDER: „Die Noten sind immer noch nicht am Pfad
         des Rahmens orientiert."
         Sie standen frei ueber die Breite gestreut. Jetzt sitzen sie
         auf dem Ring (band in LC_TEILCHENBILDER) — und sie STEHEN
         darauf: --dreh ist der Winkel der Kreistangente an ihrer
         Stelle, also genau die Richtung des Pfades. Der Winkel wird
         so gedreht, dass keine Note auf dem Kopf steht: zwischen 90
         und 270 Grad wird sie um 180 Grad gewendet. */
      if (bau.aufPfad) {
        let grad = winkel * 180 / Math.PI + 90;
        const roh = ((winkel * 180 / Math.PI) % 360 + 360) % 360;
        if (roh > 90 && roh < 270) grad += 180;
        t.style.setProperty("--dreh", grad.toFixed(1) + "deg");
      }
      /* XANDER: „arbeite mal ein bisschen Atmosphaere und nicht mit
         solchen geometrischen perfekten Formen, sondern natuerlichen
         Feuerflammen ... verfluessigen, bisschen Variationen
         reinbringen, nicht dass jede Flamme gleich und Copy and
         Paste aussieht."

         Bisher hatten alle dreissig Flammen DIESELBE Form (ein
         clip-path in der Regel), dieselbe Farbe und dieselbe
         Bewegung — nur die Groesse war gewuerfelt. Jetzt bekommt
         jede: eine von fuenf Silhouetten (data-v), eine eigene
         Glutfarbe (--glut dreht den Farbton), eine eigene Neigung
         (--neig) und einen eigenen Takt. Dreissig Flammen, keine
         zwei gleich. */
      if (art === "feuer") {
        t.dataset.v = String(Math.floor(Math.random() * 5));
        t.style.setProperty("--glut", (Math.random() * 26 - 13).toFixed(0) + "deg");
        t.style.setProperty("--neig", (Math.random() * 18 - 9).toFixed(1) + "deg");
        t.style.setProperty("--schlank", (0.8 + Math.random() * 0.55).toFixed(2));
        /* RUNDE 80 — XANDER: „du kannst an den Verjuengung kleine
           Partikel fliegen lassen."
           Die Verjuengung ist die SPITZE der Flamme. Bisher stiegen
           Funken als Hintergrundmuster ueber das ganze Feld auf
           (.lc-tfeuer::after) — die kamen also aus dem Nichts und
           nicht aus einer Flamme. Jetzt bekommt JEDE Flamme ihren
           eigenen Funken: er sitzt an genau derselben Stelle wie ihr
           Fusspunkt und wird in der CSS-Regel .lc-funke um dieselbe
           Flammenhoehe nach oben geschoben, mit der die Flamme
           gezeichnet wird — er startet also auf der Spitze und
           steigt von dort weg. --neig gibt ihm die Richtung der
           Flamme mit, damit er nicht senkrecht wegfliegt, wenn die
           Flamme schief steht. */
        const funke = document.createElement("i");
        funke.className = "lc-funke";
        funke.style.setProperty("--links", t.style.getPropertyValue("--links"));
        funke.style.setProperty("--oben", t.style.getPropertyValue("--oben"));
        funke.style.setProperty("--gross", t.style.getPropertyValue("--gross"));
        funke.style.setProperty("--neig", t.style.getPropertyValue("--neig"));
        funke.style.setProperty("--weg", (0.9 + Math.random() * 1.3).toFixed(2));
        funke.style.animationDuration = (1.1 + Math.random() * 1.4).toFixed(2) + "s";
        funke.style.animationDelay = (-Math.random() * 2.4).toFixed(2) + "s";
        feld.appendChild(funke);
      }
      if (art === "funkeln" || art === "magie") {
        t.dataset.v = String(Math.floor(Math.random() * 4));
        t.style.setProperty("--glut", (Math.random() * 60 - 30).toFixed(0) + "deg");
      }
      t.style.animationDuration = (1.5 + Math.random() * 2.2).toFixed(2) + "s";
      t.style.animationDelay = (-Math.random() * 3).toFixed(2) + "s";
      feld.appendChild(t);
    }
    /* AN DEN PLATZ, NICHT IN DEN KREIS.
       Der Kreis traegt „overflow: hidden" — alles, was ueber das
       Profilbild hinausragt, wurde bisher abgeschnitten. Genau
       deshalb sah man von den Sternen, die „aussen herum den Rahmen
       beschreiben" sollen, immer nur die Haelfte. Am Platz darf das
       Feld ueber den Rand hinaus; es deckt dasselbe Quadrat ab wie
       die Effektschicht (siehe .lc-sprechfeld). */
    knopf.appendChild(feld);
  }

  function lcSprechFeldWeg(knopf) {
    const f = knopf.querySelector(".lc-sprechfeld");
    if (f) f.remove();
  }

