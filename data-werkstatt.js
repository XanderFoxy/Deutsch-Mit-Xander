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
  stand: "Runde 53 - Muenze, Whiteboard, Paintball",

  inArbeit: [
    { seit: "2026-09-21T02:35",
      text: "Texte: Ueberschriften am Android, Kategorieauswahl, Benotung je Zeile" },
    { seit: "2026-09-21T02:35",
      text: "Knuellen realistischer" },
    { seit: "2026-09-21T02:35", nurBetreiber: true,
      text: "Angel zeigt angeblich manchmal das Lassozeichen - nicht nachstellbar gewesen" },
    { seit: "2026-09-21T02:35", nurBetreiber: true,
      text: "Tutorvideo mit Greenscreen neu aufnehmen - Alphakanal frisst das Schwarz aus" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T02:35",
      text: "Die Muenze faellt bis auf die Namenszeile und liegt dort flach - gemessen: 0 px daneben" },
    { seit: "2026-09-21T02:35",
      text: "Whiteboard: Rueckschritt und Fortschritt, gemeinsam fuer alle im Raum" },
    { seit: "2026-09-21T02:35",
      text: "Whiteboard: Werkzeuge ausblenden per Griff - das Blatt nimmt den frei gewordenen Platz" },
    { seit: "2026-09-21T02:35",
      text: "Whiteboard: Bild sichern (Blatt und Striche in einer Datei)" },
    { seit: "2026-09-21T02:35",
      text: "Paintball: sechs Farben je Treffer statt drei, und Braun ist dazugekommen" },
    { seit: "2026-09-21T02:35",
      text: "Eine Platznummer meint auch bei der Umarmung genau einen Platz" },
  ],
};
