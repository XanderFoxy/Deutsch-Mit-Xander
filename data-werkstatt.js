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
  stand: "Runde 80, siebter Teil: Wetter, Pferd und die Haende",

  inArbeit: [
    { seit: "2026-09-22T03:06",
      text: "Der Rest von Xanders Liste vom 22. September" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T03:06",
      text: "Beim Neuladen stand nachts die Sonne im Kopfstreifen. GEMESSEN: um 0, 3 und 22 Uhr waren fuenf Sonnenstrahlen zu sehen; jetzt null, und um 13 Uhr weiterhin fuenf. Die Himmelsrechnung braucht kein Netz — sie laeuft jetzt schon beim ersten Zeichnen." },
    { seit: "2026-09-22T03:06",
      text: "Die drei Punkte im Kopfstreifen, die wie Bildfehler aussahen, sind sieben Sterne: ihre Schicht stand auf 'relative' statt 'absolute', war dadurch 0 x 0 gross, und alle sieben Prozentangaben landeten auf demselben Punkt. Jetzt liegen sie wieder ueber den ganzen Streifen verteilt." },
    { seit: "2026-09-22T03:06",
      text: "Das Pferd hat Hinterhand und Schulter bekommen, und die Beine sind nicht mehr wie eine Ziehharmonika gefaltet: statt drei scharfer Knicke bei gleichbleibender Dicke jetzt weiche Bogen unter einer Muskelpartie, die am Hinterteil sitzt." },
    { seit: "2026-09-22T03:06",
      text: "Die Riesenhand greift wirklich: Arm und Handruecken liegen hinter dem Bild, die vier Finger davor. Vorher lag das Bild vor der ganzen Hand — es hielt sichtbar nichts." },
    { seit: "2026-09-22T03:06",
      text: "Das Klatschen hat einen Klatsch-Moment. GEMESSEN: der groesste Schliess-Schritt war 1,9-mal so gross wie der Durchschnitt (also keiner), jetzt 6,3-mal — und der Funke blitzt bei 44 statt bei 52 Prozent, also auf dem Treffer statt danach. Das Winken hat vier ungleiche Ausschlaege statt eines Metronoms." },
  ],
};
