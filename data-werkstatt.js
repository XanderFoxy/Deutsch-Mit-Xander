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
  stand: "Fassung 795: eigene Gebäude und Wahrzeichen in der leichten Stadt, Bauen-Knopf, fließende Tageszeit",

  inArbeit: [
    { seit: "2026-09-28T18:31",
      text: "Leichte Stadt Runde 2: Rückgängig, Wege/Flüsse malen, Bäume löschen, Lok + Schienen, Pyramide dreht sich, Sommerbilder, Halloween" },
    { seit: "2026-09-28T18:31",
      text: "Tag/Nacht fließend auch im Spiel-Dorf" },
    { seit: "2026-09-28T18:31",
      text: "Laserduell (Xander testet)" },
    { seit: "2026-09-28T18:31",
      text: "Walkie-Reste: Hot Rod, Katze, Adler, Flugzeug, Heli, Delfin, Wangenhand, Lunte, Anziehen" },
    { seit: "2026-09-28T18:31",
      text: "Aussprache-Aufgabe im Chat und persönliches Aussprache-Wörterbuch" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-28T18:31",
      text: "15 eigene Modelle (11 Spielgebäude, 4 Wahrzeichen) gebacken und eingebunden" },
    { seit: "2026-09-28T18:31",
      text: "Bauen-Knopf mit allen Gebäuden, Ausbauen am Haus" },
    { seit: "2026-09-28T18:31",
      text: "Tag und Nacht in der leichten Stadt stufenlos nach der Uhr" },
  ],
};
