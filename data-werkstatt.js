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
  stand: "Fassung 576: Prüflauf aller 237 Sonden durch, Funde repariert; Hot Rod, Männerkuss, Walkie",

  inArbeit: [
    { seit: "2026-09-24T14:10",
      text: "Hand realistischer (Walkie #151)" },
    { seit: "2026-09-24T14:10",
      text: "Fahrstuhl" },
    { seit: "2026-09-24T14:10",
      text: "Lehrer-Panel" },
    { seit: "2026-09-24T14:10",
      text: "Popo-Klaps" },
    { seit: "2026-09-24T14:10",
      text: "Sabbern" },
    { seit: "2026-09-24T14:10",
      text: "Angel" },
    { seit: "2026-09-24T14:10",
      text: "Pac-Man-Rülpser" },
    { seit: "2026-09-24T14:10",
      text: "Klatschen" },
    { seit: "2026-09-24T14:10",
      text: "Fokus" },
    { seit: "2026-09-24T14:10",
      text: "Aufdecken" },
    { seit: "2026-09-24T14:10",
      text: "Lasso" },
    { seit: "2026-09-24T14:10",
      text: "Kran" },
    { seit: "2026-09-24T14:10",
      text: "Ei" },
    { seit: "2026-09-24T14:10",
      text: "Blume" },
    { seit: "2026-09-24T14:10",
      text: "Lok" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-24T14:10",
      text: "Sprechbild-Liste komplett (15 Schritte)" },
    { seit: "2026-09-24T14:10",
      text: "Streichelhand zurück + /wange (Rückhand)" },
    { seit: "2026-09-24T14:10",
      text: "Prüflauf 237 Sonden, 9 rot → repariert" },
    { seit: "2026-09-24T14:10",
      text: "Hot Rod: Kraft kommt bei allen an, Aufziehen in Zahlen, Kabine als Einheit, dicke Chromrohre" },
    { seit: "2026-09-24T14:10",
      text: "Männer-Kussstimme neu" },
    { seit: "2026-09-24T14:10",
      text: "Walkie wieder mit Mehrfachauswahl + Stufen" },
    { seit: "2026-09-24T14:10",
      text: "‚frei' nicht mehr zu früh beim Flug" },
  ],
};
