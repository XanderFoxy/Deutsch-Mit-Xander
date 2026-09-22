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
  stand: "Runde 81: der gemalte Weg gilt auch fuer Flugzeug, Sprungfeder, Maulwurf und Pac-Man",

  inArbeit: [
    { seit: "2026-09-22T04:33",
      text: "Der Rest von Xanders Liste aus Runde 76: Salve auf mehrere, Zylinder mit Kaninchen, Frosch-Sprung, Musik teilen mit YouTube, Anziehen-Modul, Telefon mit Audio" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T04:33",
      text: "Der gemalte Weg gilt jetzt auch fuer das Flugzeug, die Sprungfeder und den Maulwurf. GEMESSEN: das Flugzeug fliegt den Umweg wirklich (436 px statt 348 px Luftlinienbogen), die Feder setzt auf jeder gemalten Station auf (2,0 und 2,5 px Abstand statt 72 und 37), und der Maulwurfswall graebt sich ueber die gemalten Plaetze (17 px statt 75)." },
    { seit: "2026-09-22T04:33",
      text: "Pac-Man frisst jetzt auch einen selbst gezeichneten Weg. In der Pac-Man-Kachel stehen dafuer zwei Eintraege: sofort losfressen oder erst den Weg mit dem Finger ziehen. GEMESSEN: mit Kette liegen die Kruemel auf 1-2-3-7, ohne auf dem kuerzesten Weg 1-5." },
    { seit: "2026-09-22T04:33",
      text: "Der gemalte Weg darf ueber besetzte Plaetze. Bisher brach der Strich ab, sobald jemand im Weg sass; anhalten kann man dort weiterhin nicht, das faengt der Befehl ab." },
    { seit: "2026-09-22T04:33",
      text: "Neue Regeln in werkzeug/pruefe-runde81.js fuer diese sechs Punkte, alle gruen. Drei aeltere Pruefungen (72, 74, 78) pruefen jetzt, was die Regel meint, statt der Quelltextzeile, die sich geaendert hat." },
  ],
};
