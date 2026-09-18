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
  stand: "Runde 46 — A2 wird eingesprochen, Vokabeltrainer repariert",

  inArbeit: [
    { seit: "2026-09-18T00:45",
      text: "A2 laeuft gerade durch (3494 Woerter), danach B1" },
    { seit: "2026-09-18T00:45",
      text: "Fratze gruseliger, Sternschnuppen und Regen physikalisch richtig" },
    { seit: "2026-09-18T00:45",
      text: "Jalousie und Hand sollen den Chat wirklich aufreissen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-18T00:45",
      text: "Deine Stimme ist jetzt LIVE — die Seite steht auf 237 statt 227" },
    { seit: "2026-09-18T00:45",
      text: "Bilderwelten nehmen jetzt zuerst DEINE Aufnahme, dann erst Azure" },
    { seit: "2026-09-18T00:45",
      text: "Aufnahmen koennen aus mehreren Niveaus kommen (a1, a2, ...)" },
    { seit: "2026-09-18T00:45",
      text: "Vokabeltrainer: Runde startet nicht mehr, bevor die Woerter da sind" },
    { seit: "2026-09-18T00:45",
      text: "Gefunden: 38 von 61 Themen haben vor dem Nachladen weniger als 5 Aufgaben" },
  ],
};
