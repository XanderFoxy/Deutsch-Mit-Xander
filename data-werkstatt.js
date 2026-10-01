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
  stand: "Fassung 830 — Funk 256/257: Klassenzimmer bleibt an seinem Platz, freie Antworten in den Quests, Signalton",

  inArbeit: [
    { seit: "2026-10-01T05:21",
      text: "Niveau A1–C2 für die Stadt-Quests in den Einstellungen" },
    { seit: "2026-10-01T05:21",
      text: "Missionen nach dem Stand der Stadt, kleine Gespräche über mehrere Sätze" },
    { seit: "2026-10-01T05:21",
      text: "Äcker selbst versetzen" },
    { seit: "2026-10-01T05:21",
      text: "fehlende Häuser in der neuen Stadt + Bau-Rückmeldung" },
    { seit: "2026-10-01T05:21",
      text: "Waffen-Upgrades sichtbar und hörbar; Mine und Falltür im Waffenrad" },
    { seit: "2026-10-01T05:21",
      text: "Wörterbuch: Beugungsknöpfe, Lücken; Satzbaukasten" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-10-01T05:21",
      text: "Nach dem großen Dorf-Menü steht das Klassenzimmer wieder an seinem Platz" },
    { seit: "2026-10-01T05:21",
      text: "Eigene Sätze in den Quests zählen, wenn sie zur Aufgabe passen und grammatisch stimmen" },
    { seit: "2026-10-01T05:21",
      text: "„Fast“ nur bei einem Grammatikfehler, mit Erklärung" },
    { seit: "2026-10-01T05:21",
      text: "Signalton beim Mikro-Start und am Ende" },
  ],
};
