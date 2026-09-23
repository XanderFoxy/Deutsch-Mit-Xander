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
  stand: "Runde 95 — Mario-Geräusche und heimliches Telefonieren (Fassung 504)",

  inArbeit: [
    { seit: "2026-09-23T00:04", nurBetreiber: true,
      text: "Sammellauf vor jedem Hochladen: bash werkzeug/alle-pruefen.sh" },
    { seit: "2026-09-23T00:04",
      text: "Lok-Schienenführung, Delfin, Cowboyhut zurechtrücken, Hände vereinheitlichen (Roboter- und Hexenhand)" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-23T00:04",
      text: "Mario: beim Draufspringen und Wegkicken klingen jetzt zwei eigene Signale im Achtziger-Klang statt Holzklopfen und Fußtritt — „mariostampf“ fällt von 300 auf 90 Hz, „mariokick“ steigt von 180 auf 900 Hz" },
    { seit: "2026-09-23T00:04",
      text: "„/anruf Name“: heimlich telefonieren — ihr zwei hört nur noch euch, der Raum hört euch nicht. „/anruf aus“ legt auf" },
    { seit: "2026-09-23T00:04",
      text: "An beiden Plätzen hängt dabei ein Hörer und eine Leiste sagt, was los ist — geheim ist der Inhalt, nicht die Tatsache" },
    { seit: "2026-09-23T00:04",
      text: "Zwei neue Sonden: pruefe-runde94-mariotoene (Tonhöhenverlauf gemessen) und pruefe-runde94-anruf (wer hört wen, auf jedem Gerät)" },
  ],
};
