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
  stand: "Runde 52 - Bowling im Takt, Pac-Man-Punkte",

  inArbeit: [
    { seit: "2026-09-21T02:27",
      text: "Muenze landet auf dem Namen, Knuellen besser, Paintball mehr Farben, Umarmung schoener" },
    { seit: "2026-09-21T02:27",
      text: "Whiteboard: Werkzeuge ausblenden, Rueckschritt und Fortschritt, Bilder sichern" },
    { seit: "2026-09-21T02:27",
      text: "Texte: Ueberschriften am Android, Kategorieauswahl, Benotung je Zeile" },
    { seit: "2026-09-21T02:27", nurBetreiber: true,
      text: "Angel zeigt angeblich manchmal das Lassozeichen - nicht nachstellbar gewesen" },
    { seit: "2026-09-21T02:27", nurBetreiber: true,
      text: "Tutorvideo mit Greenscreen neu aufnehmen - Alphakanal frisst das Schwarz aus" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T02:27",
      text: "Bowling: die Kegel stehen schon, bevor geworfen wird, und fallen im Moment des Einschlags" },
    { seit: "2026-09-21T02:27",
      text: "Der Ball kommt aus der wirklichen Entfernung - aus zwei Plaetzen Abstand rollt er weiter her als aus einem" },
    { seit: "2026-09-21T02:27",
      text: "Pac-Man: auf jedem Platz liegt jetzt ein gelber Punkt, gross genug fuer helle Profilbilder" },
    { seit: "2026-09-21T02:27",
      text: "Die Flammen stehen mit dem Fuss auf dem Reifen statt davor" },
  ],
};
