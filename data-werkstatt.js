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
  stand: "Fassung 829 — Funk 255: sofort im Chat, Platzwechsel, Ladebild, Quest-Fenster über dem Bild, Acker hinter der Bäckerei, zwei Tier-Fähigkeiten",

  inArbeit: [
    { seit: "2026-10-01T04:55",
      text: "Äcker selbst versetzen" },
    { seit: "2026-10-01T04:55",
      text: "Holzfällerhütte, Marktstand, Schweinestall, Jagdhütte, Sternwarte in der neuen Stadt (Modelle + Plätze) und Bau-Rückmeldung mit Ton/Vibration" },
    { seit: "2026-10-01T04:55",
      text: "Waffen-Upgrades sichtbar und hörbar; Mine und Falltür im Waffenrad" },
    { seit: "2026-10-01T04:55",
      text: "Wörterbuch: Beugungsknöpfe, Lücken füllen; Satzbaukasten" },
    { seit: "2026-10-01T04:55",
      text: "weitere Karten zur Auswahl" },
    { seit: "2026-10-01T04:55",
      text: "Bild: Alex sitzt und streichelt den Fuchs" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-10-01T04:55",
      text: "Chat: sofort drin, Mikrofon höchstens 2 s Wartezeit, kommt später ohne Abriss nach" },
    { seit: "2026-10-01T04:55",
      text: "Platzwechsel: Sitzordnung wird nach 0,35 s und 1,2 s nachgesendet" },
    { seit: "2026-10-01T04:55",
      text: "Stadt-Ladebild sofort statt grünem Schirm, Fuchs mit Tricks" },
    { seit: "2026-10-01T04:55",
      text: "Quest-Fenster schwebt über dem Stadtbild" },
    { seit: "2026-10-01T04:55",
      text: "Acker 91 zwischen Bäckerei und Mühle, Tipp aufs ganze Feld erntet, Zeichen hält Abstand zu den Häusern" },
    { seit: "2026-10-01T04:55",
      text: "zwei Tier-Fähigkeiten gleichzeitig" },
  ],
};
