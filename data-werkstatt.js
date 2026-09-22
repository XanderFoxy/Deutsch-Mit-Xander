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
  stand: "Runde 82: Salve auf mehrere, Hammer mit Glasbruch, groesseres Katapult",

  inArbeit: [
    { seit: "2026-09-22T04:56",
      text: "Der Rest aus Runde 76: Zylinder mit Kaninchen, Frosch-Sprung, Musik teilen mit YouTube, Anziehen-Modul, Telefon mit Audio" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T04:56",
      text: "Die SALVE auf mehrere: hinter jedem Effekt am Platz duerfen jetzt mehrere Namen stehen, durch Komma getrennt — /ei Bea, Cem, Dana. Zwischen einem Namen und allen fehlte genau diese Auswahl. GEMESSEN: zwei Namen treffen die beiden Plaetze, Platznummern gehen genauso, und eine Luecke in der Kette trifft NICHT ploetzlich alle." },
    { seit: "2026-09-22T04:56",
      text: "Der HAMMER hat jetzt einen Zufall: faellt das Los klein aus, zerspringt die Scheibe ueber dem Profilbild mit Rissen vom Einschlagpunkt und dem Glasbruch-Ton, sonst fliegen wie bisher die Sterne. Das Los faehrt mit der Nachricht, damit alle dasselbe sehen. GEMESSEN: 13 Risse statt 8 Sterne, die Risse bleiben auf den Bildpunkt genau im Bild, und dasselbe Los ergibt dasselbe Muster." },
    { seit: "2026-09-22T04:56",
      text: "Das KATAPULT ist groesser. GEMESSEN: 146 px statt 123 px, also 1,43 statt 1,20 Bildbreiten." },
    { seit: "2026-09-22T04:56",
      text: "Neue Pruefung werkzeug/pruefe-runde82.js mit elf Regeln fuer diese drei Punkte, alle gruen." },
  ],
};
