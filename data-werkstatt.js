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
  stand: "Fassung 565: Hände greifen seitlich (Daumen oben), Pflaster-Kachel, echte Töne für Waschmaschine/Bagger/Hau ab, Putzen flach, Spucke",

  inArbeit: [
    { seit: "2026-09-24T06:17",
      text: "Hot Rod: Chrom-Seitenauspuffe" },
    { seit: "2026-09-24T06:17",
      text: "Pac-Man-Rülpser" },
    { seit: "2026-09-24T06:17",
      text: "Klatschen" },
    { seit: "2026-09-24T06:17",
      text: "Fokus" },
    { seit: "2026-09-24T06:17",
      text: "Aufdecken" },
    { seit: "2026-09-24T06:17",
      text: "Lasso" },
    { seit: "2026-09-24T06:17",
      text: "Kran" },
    { seit: "2026-09-24T06:17",
      text: "Ei-Schalen" },
    { seit: "2026-09-24T06:17",
      text: "Blume" },
    { seit: "2026-09-24T06:17",
      text: "Lok" },
    { seit: "2026-09-24T06:17",
      text: "Sprechbilder" },
    { seit: "2026-09-24T06:17",
      text: "Popo-Klaps" },
    { seit: "2026-09-24T06:17",
      text: "Sabbern" },
    { seit: "2026-09-24T06:17",
      text: "Fahrstuhl" },
    { seit: "2026-09-24T06:17",
      text: "Fahrrad-Ton" },
    { seit: "2026-09-24T06:17",
      text: "Angel" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-24T06:17",
      text: "Pflaster-Kachel neben Hammer" },
    { seit: "2026-09-24T06:17",
      text: "Seitliche Greifhand, Daumen oben" },
    { seit: "2026-09-24T06:17",
      text: "Waschmaschine kleiner + echter Ton" },
    { seit: "2026-09-24T06:17",
      text: "Bagger langsamer + Motorton" },
    { seit: "2026-09-24T06:17",
      text: "Hau-ab-Ruf Mann/Frau" },
    { seit: "2026-09-24T06:17",
      text: "Spucke unter Sauber machen, wischt realistisch weg" },
  ],
};
