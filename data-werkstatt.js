/* =========================================================
   DIE WERKSTATT — woran GERADE gebaut wird
   ---------------------------------------------------------
   DIESE DATEI WIRD GESCHRIEBEN, NICHT GEPFLEGT.
   Sie entsteht bei jedem Hochladen neu aus
   werkzeug/werkstatt-setzen.py. Von Hand geänderte Zeilen sind
   beim nächsten Mal weg.

   GEWÜNSCHT, und zwar genau so:
   „Zeige in der Werkstatt, woran du jetzt zuletzt gearbeitet
    hast — nicht nur das Datum, sondern auch die Uhrzeit. Dabei
    sind alle Sachen, die erledigt sind, irrelevant. Alles was
    jetzt gerade geupdatet wird, ist relevant. Und wenn Updates
    nicht mehr in Arbeit sind, verschwindet das Zeichen auch
    wieder."
   „Mit jedem einzelnen Ding, was du hochlädst, soll sich die
    Werkstatt auch aktualisieren. Und sie soll für normale
    Benutzer gar nicht sichtbar sein, nur für mich als
    Betreiber."

   Daraus folgen vier harte Regeln, und die Datei kann gar nichts
   anderes:

   1. HIER STEHT NUR, WAS OFFEN IST.
      Es gibt keine Liste „fertig" mehr. Was fertig ist, ist
      fertig — es gehört in den Ticker oder nirgendwohin, aber
      nicht in eine Werkstatt.

   2. JEDE ZEILE TRÄGT TAG UND UHRZEIT.
      „seit" ist der Zeitpunkt, an dem die Arbeit begonnen hat.

   3. IST DIE LISTE LEER, IST DAS ZEICHEN WEG.
      Kein leerer Knopf, kein „zurzeit nichts".

   4. NUR DER BETREIBER SIEHT SIE.
      nurBetreiber steht fest auf true. Eine Baustellenliste geht
      niemanden etwas an, der die Seite benutzen will.

   5. ZWEI LISTEN: OFFEN UND FERTIG.
      „Dass ich sehe, welche Sachen gerade fertig sind, Schritt für
      Schritt, damit ich es direkt überprüfen kann." Unter „fertig"
      steht deshalb, was mit dem letzten Hochladen oben angekommen
      ist — mit Uhrzeit, damit man weiss, was man sich ansehen kann.
   ========================================================= */
window.DMA_WERKSTATT = {
  /* true = nur der Betreiber sieht die Blase. Ausdrücklich so
     gewünscht: „sie soll für normale Benutzer gar nicht sichtbar
     sein, nur für mich als Betreiber." */
  nurBetreiber: true,

  /* Woran gerade gearbeitet wird — eine Zeile Klartext. */
  stand: "Fassung 347 — der Chat bleibt stehen, und nichts verrutscht mehr",

  inArbeit: [
    { seit: "2026-09-19T22:21",
      text: "Bildauswahl: schliesst sich nach dem Aussuchen noch nicht immer" },
    { seit: "2026-09-19T22:21",
      text: "GIPHY-Favoriten erscheinen nicht in der Auswahl" },
    { seit: "2026-09-19T22:21",
      text: "Betonung: es fehlt die Benotung" },
    { seit: "2026-09-19T22:21",
      text: "Toene: beim Dinosaurier setzt der Ton aus, wenn jemand spricht" },
    { seit: "2026-09-19T22:21",
      text: "Nachmessen, ob bei einem Gespraech wirklich ZWEI Geraete in turn_nutzung stehen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-19T22:21",
      text: "Ein Ankoemmling setzt den laufenden Chat nicht mehr zurueck — er bekommt den Verlauf, gibt aber keinen" },
    { seit: "2026-09-19T22:21",
      text: "Nichts verrutscht mehr: die Effektbuehne misst das Layout, nicht das gemalte Bild (Dino-Beben 2,5 px, Buehne 0,0 px)" },
    { seit: "2026-09-19T22:21",
      text: "Der Wecker ist jetzt das Profilbild selbst: zwei Schellen oben wie Ohren und ein schwaches Zifferblatt auf zwoelf" },
    { seit: "2026-09-19T22:21",
      text: "Der Wassereimer taucht ganz unter, mit Luftblasen — und klingt laenger ab (6 s)" },
    { seit: "2026-09-19T22:21",
      text: "Der Geldhaufen besteht aus liegenden Muenzen und Scheinen statt aus gelber Farbe" },
    { seit: "2026-09-19T22:21",
      text: "Deutlichere Blitze: gezeichnet statt Emoji, drei Schlaege mit Schein ueber dem Bild" },
    { seit: "2026-09-19T22:21",
      text: "Herzen groesser und in verschiedenen Staerken" },
    { seit: "2026-09-19T22:21",
      text: "Die Zunge endet am Rand des getroffenen Bildes und laeuft hinter den Plaetzen durch" },
    { seit: "2026-09-19T22:21",
      text: "Boxhandschuhe kommen aus der Richtung, in der der Schlagende wirklich sitzt" },
  ],
};
