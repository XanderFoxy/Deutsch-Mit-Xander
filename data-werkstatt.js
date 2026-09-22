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
  stand: "Runde 80, neunter Teil: Vogel, Lok, Pac-Man",

  inArbeit: [
    { seit: "2026-09-22T03:34",
      text: "Der Rest von Xanders Liste vom 22. September" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T03:34",
      text: "Der Greifvogel hat echte Schwingen statt Fledermausfluegel: Armfittich mit glatter Hinterkante plus sieben einzelne Handschwingen, die faecherfoermig auseinanderstehen — die Luecken dazwischen sind das, woran man einen Vogel erkennt. Dazu Deckfedern auf dem Fittich." },
    { seit: "2026-09-22T03:34",
      text: "Sein Fluegelschlag ist durchgaengig. GEMESSEN: die Aufnahme ist zwar 4 s lang, aber schon bei 0,9 s auf -25 dB und bei 2 s auf -40 dB — zu hoeren war nicht einmal eine Sekunde. Sie wird jetzt viermal im Abstand von 660 ms angesetzt und jedes Mal nach 700 ms gekappt." },
    { seit: "2026-09-22T03:34",
      text: "Die Lok faehrt zwei Runden durch die Sitzreihen und faehrt dabei die Leute um: sie werden flachgedrueckt, kippen weg und schreien. GEMESSEN: drei Richtungswechsel, 309 px Hoehenunterschied, bis zu vier gleichzeitig Ueberfahrene." },
    { seit: "2026-09-22T03:34",
      text: "Pac-Man laesst sich auch ohne Ziel uebers Feld schicken. GEMESSEN: in allen 34 Proben sichtbar, 255 px weit, 13 Kuegelchen gelegt und am Ende null davon uebrig — er frisst sie alle." },
    { seit: "2026-09-22T03:34",
      text: "Der Vogelkot laeuft jetzt bis ueber die halbe Bildhoehe herunter statt nur bis zur Stirn." },
  ],
};
