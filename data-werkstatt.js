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
  stand: "Runde 88v — Pac-Man frisst endlich in die Richtung, in die er laeuft.",

  inArbeit: [
    { seit: "2026-09-22T19:23",
      text: "Glitches am verlassenen Platz in JEDER Animation" },
    { seit: "2026-09-22T19:23",
      text: "Toene: Geld, Cowboy, Pfeil, Fahren, Helikopter, Bombe, Ballon, Turm" },
    { seit: "2026-09-22T19:23",
      text: "Zauberer: Zylinder abstellen, Kaninchen herausziehen, Publikum" },
    { seit: "2026-09-22T19:23",
      text: "Haende: durchgaengig, King Kong behaart, Frau/Mann, Kralle" },
    { seit: "2026-09-22T19:23",
      text: "Frosch, Pferd, Lok, Helikopter, Fahrstuhl, Adler" },
    { seit: "2026-09-22T19:23",
      text: "Spruehdose mit Scheibenwischer, eigene Bilder" },
    { seit: "2026-09-22T19:23",
      text: "Hammer: demolieren in Stufen" },
    { seit: "2026-09-22T19:23",
      text: "Sitzplatz-Logik: jeder sieht dieselbe Nummer" },
    { seit: "2026-09-22T19:23",
      text: "Adressleiste temporaer ausblenden, Bildschirm anlassen, Vollbild-Knopf weg" },
    { seit: "2026-09-22T19:23",
      text: "Aufgabe-Modul: Funktion im Verlauf suchen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T19:23",
      text: "Pac-Man: das Maul dreht sich wirklich — rechts 0, runter 90, links 180 Grad" },
    { seit: "2026-09-22T19:23",
      text: "Pac-Man: das Auge bleibt oben, der Kopf steht nie auf dem Kopf" },
    { seit: "2026-09-22T19:23",
      text: "Pac-Man: die Punkte liegen auf 0,8 px genau im Zentrum der Zahlen" },
    { seit: "2026-09-22T19:23",
      text: "Pac-Man: die Zahlen sind waehrend der Jagd unsichtbar, ohne dass etwas verrutscht" },
    { seit: "2026-09-22T19:23",
      text: "Pac-Man: Sprechen stoert die Jagd nicht mehr, kein gruener Ring ueber dem Kopf" },
  ],
};
