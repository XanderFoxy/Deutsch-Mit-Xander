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
  stand: "Runde 29 — Bilderraetsel nachgemessen",

  inArbeit: [
    { seit: "2026-09-17T18:07",
      text: "Der Zug am Bahnhof sieht noch wie ein Pappkarton aus" },
    { seit: "2026-09-17T18:07",
      text: "Die Gaeste im Restaurant sitzen noch alle nach vorn zum Betrachter" },
    { seit: "2026-09-17T18:07",
      text: "GIPHY: Schluessel-Link fuer dich, bewegtes Profilbild, eigene Bibliothek" },
    { seit: "2026-09-17T18:07",
      text: "Bilderwelten: Groessen, verdeckte Dinge, blockierende Rahmen" },
    { seit: "2026-09-17T18:07",
      text: "Chat beginnt unten und ist fuer jeden vollstaendig" },
    { seit: "2026-09-17T18:07", nurBetreiber: true,
      text: "Zuletzt: A1-Aufnahme mit deiner eigenen Stimme" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-17T18:07",
      text: "Das Maedchen steht jetzt wirklich am Waschbecken und nicht vor der Waschmaschine" },
    { seit: "2026-09-17T18:07",
      text: "Am Bahnhof schwebte eine Figur ueber dem Zug — 192 Einheiten neben dem Automaten" },
    { seit: "2026-09-17T18:07",
      text: "18 von 34 Plaetzen waren falsch; alle nachgemessen und berichtigt" },
    { seit: "2026-09-17T18:07",
      text: "Zwei Menschen auf einem Stuhl gibt es nicht mehr: der gemalte tritt zur Seite" },
    { seit: "2026-09-17T18:07",
      text: "Im Restaurant sitzt 'auf dem Stuhl' jetzt woanders als 'am Tisch'" },
    { seit: "2026-09-17T18:07",
      text: "Neue Dauerpruefung plaetzepruefen.js: rechnet jeden Platz gegen seinen Szenenteil" },
  ],
};
