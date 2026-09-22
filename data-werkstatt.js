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
  stand: "Runde 92 — Vollbildknopf weg, Schiffe versenken mit Verstecken und Countdown (Fassung 501)",

  inArbeit: [
    { seit: "2026-09-22T23:40", nurBetreiber: true,
      text: "Sammellauf vor jedem Hochladen: bash werkzeug/alle-pruefen.sh" },
    { seit: "2026-09-22T23:40",
      text: "Kopfhörer bleiben nicht auf dem Kopf / Lied an andere — als Nächstes" },
    { seit: "2026-09-22T23:40",
      text: "Billard-Physik, Lok-Schienenführung, Klaps mit seitlicher Hand, Fahrstuhl, Delfin, Anrufen, Mario-Töne, Hände vereinheitlichen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T23:40",
      text: "Der Vollbildknopf ist weg — der Modus schaltet sich beim Betreten des Klassenzimmers von selbst ein und beim Verlassen wieder ab" },
    { seit: "2026-09-22T23:40",
      text: "Schiffe versenken: 16 Plätze, jeder sucht sich seinen Platz SELBST — heimlich; an alle geht nur die Zahl der Fertigen, kein Name, kein Feld" },
    { seit: "2026-09-22T23:40",
      text: "Danach ein Countdown, dann wird der Reihe nach gesucht" },
    { seit: "2026-09-22T23:40",
      text: "Während des Versteckens ist die Sitzreihe still: keine Sprechanimation, keine Effektschicht, keine Hervorhebung — hören kann man sich weiter" },
    { seit: "2026-09-22T23:40",
      text: "Zwei neue Sonden: pruefe-runde92-schiffe (alle drei Abschnitte) und pruefe-runde92-grundebene (Strichlinie und Nummer bei 122 Effekten, beide Plätze, acht Zeitpunkte)" },
  ],
};
