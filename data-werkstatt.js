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
  stand: "Runde 89 — die zwei Luftballons und die Gesamtübersicht (Fassung 497)",

  inArbeit: [
    { seit: "2026-09-22T22:16", nurBetreiber: true,
      text: "Sammellauf vor jedem Hochladen: bash werkzeug/alle-pruefen.sh" },
    { seit: "2026-09-22T22:16",
      text: "Flugzeug als weitere Reise — von dir als Zukunft genannt, noch nicht gebaut" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T22:16",
      text: "Helium-Luftballon: er steigt jetzt 251 px hoch UND treibt 106 px zur Seite aus dem Bild — die zweite Variante vom 21.09., 19:31 Uhr" },
    { seit: "2026-09-22T22:16",
      text: "Neue Sonde pruefe-runde89-ballon: misst beide Varianten am laufenden Programm (Platzen mit Fetzen und Knall, Helium ohne entweichende Luft)" },
    { seit: "2026-09-22T22:16",
      text: "Drei veraltete Sonden nachgezogen (Runde 22, 23, 85b): sie suchten alten Wortlaut im Quelltext, nicht die Sache" },
    { seit: "2026-09-22T22:16",
      text: "KLASSENZIMMER-LISTE.md: 180 Messungen, 180 grün, jede mit deinem Zitat im Kopf" },
    { seit: "2026-09-22T22:16",
      text: "Zwei neue Regeln in werkzeug/animations-regeln.md (Sonden messen die Sache; zwei Varianten heissen zwei messbare Varianten)" },
  ],
};
