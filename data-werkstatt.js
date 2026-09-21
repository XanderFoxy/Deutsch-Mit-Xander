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
  stand: "Fassung 425 — Runde 73, vierter Teil: das Feuer-Sprechbild und das Blut.",

  inArbeit: [
    { seit: "2026-09-21T17:39",
      text: "Bowling mit Menschen als Kegel; Billard-Physik; Basketballkorb." },
    { seit: "2026-09-21T17:39",
      text: "Strohhalm, Knüllen, Maulwurf in der Draufsicht, Schwimmbecken-Landegeräusch." },
    { seit: "2026-09-21T17:39",
      text: "Leuchten am Platz: für alle sichtbar und abschaltbar; die Fassung darf nicht stehenbleiben." },
    { seit: "2026-09-21T17:39",
      text: "Die übrigen Sprechbilder: Spinne im Netz, Regenbogen in Kreisen, Schallwellen, Eisblumen, Blasen, Regentropfen." },
    { seit: "2026-09-21T17:39",
      text: "Aufgabe im Unterricht, Schiffe-versenken-Reihenfolge, Android-Layout, Stadt-Land-Fluss, Whiteboard." },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T17:39",
      text: "Feuer: der Fuss jeder Flamme war EIN PUNKT — deshalb stand sie auf dem Reifen wie eine Kerze auf dem Leuchter. Jetzt ist er 62 Prozent breit und sitzt auf." },
    { seit: "2026-09-21T17:39",
      text: "Feuer: der Bauch lag bei 60 Prozent Höhe und darüber gab es sogar eine Einschnürung auf 10 Prozent, also einen Hals. Jetzt wächst die Breite stetig bis zum Bauch bei 82 Prozent und verjüngt sich nach oben." },
    { seit: "2026-09-21T17:39",
      text: "Feuer: die Flamme ist breiter (2,5-mal so hoch wie breit war eine Nadel, jetzt knapp zweimal), und Funken steigen auf — die gab es bisher nur als Wunsch." },
    { seit: "2026-09-21T17:39",
      text: "Blut: vier der neun Tropfen liefen bei 41, 50, 60 und 68 Prozent der Bildbreite, also mitten durchs Gesicht. Jetzt liegen alle neun in den Randstreifen und wandern beim Fallen noch weiter nach aussen." },
  ],
};
