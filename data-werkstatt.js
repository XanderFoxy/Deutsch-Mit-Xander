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
  stand: "Fassung 336 — die Betonungsuebung ist da",

  inArbeit: [
    { seit: "2026-09-19T17:24",
      text: "Weitere Filme nach den 30 Prompts (Daemonenfratze, King Kong, Unterwasser-Ungetuem)" },
    { seit: "2026-09-19T17:24",
      text: "Sitzende Seitenansicht in den Bilderraetseln einsetzen" },
    { seit: "2026-09-19T17:24",
      text: "Tutor-Figur, die in jedem Bereich hereinkommt und erklaert" },
    { seit: "2026-09-19T17:24",
      text: "Grosses Schloss und die Tuer, die sich ueber dem Chat abschliesst" },
    { seit: "2026-09-19T17:24", nurBetreiber: true,
      text: "21 Tutor-Stuecke warten auf deine Stimme" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-19T17:24",
      text: "/betonung <Wort oder Satz> — die anderen tippen die betonte Silbe an" },
    { seit: "2026-09-19T17:24",
      text: "Die Silben kommen aus dem Woerterbuch, nicht aus einer geratenen Regel" },
    { seit: "2026-09-19T17:24",
      text: "Was nicht im Woerterbuch steht, wird nicht geraten: es steht grau da und zaehlt nicht mit" },
    { seit: "2026-09-19T17:24",
      text: "Gebeugte Formen werden ueber die Grundform gefunden" },
    { seit: "2026-09-19T17:24",
      text: "Die Loesung reist nicht mit — jedes Geraet schlaegt selbst nach" },
    { seit: "2026-09-19T17:24",
      text: "Die Antwort traegt die Aufgabenkennung, der Notenstift steht von selbst daneben" },
  ],
};
