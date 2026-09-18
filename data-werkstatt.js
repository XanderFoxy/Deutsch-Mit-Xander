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
  stand: "Runde 79 — Hängende Leitung, verschluckte Antworten, Favoriten auf dem Telefon",

  inArbeit: [
    { seit: "2026-09-18T23:43",
      text: "Bühnenansicht: wer auf der Bühne sitzt, sieht nur die anderen dort" },
    { seit: "2026-09-18T23:43",
      text: "Sitzende Seitenansicht fürs Profil" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-18T23:43",
      text: "Der grüne Balken hängt nicht mehr fest: eine Wortmeldung hält die Leitung nur noch ihre eigene Länge plus zehn Sekunden (vorher stur fünf Minuten), ein Wächter beendet sie notfalls — und ein Tipp auf den Balken prüft die Leitung und gibt sie frei. Kein Neuladen mehr" },
    { seit: "2026-09-18T23:43",
      text: "Eine Zeile, die ohne Verbindung geschrieben wird, wartet jetzt und geht raus, sobald der Raum wieder steht — vorher war sie still verloren (beim Absender sichtbar, bei allen anderen nie angekommen)" },
    { seit: "2026-09-18T23:43",
      text: "Eine Aufgabe noch einmal lösen wird wieder angesagt — vorher wurde die zweite richtige Antwort stillschweigend verschluckt; die Punkte gibt es weiterhin nur einmal" },
    { seit: "2026-09-18T23:43",
      text: "Lang drücken auf dem Smartphone heftet jetzt richtig an: Android löst dabei zusätzlich das Kontextmenü aus, und das hat sofort wieder abgenommen" },
    { seit: "2026-09-18T23:43",
      text: "Die Beispiel-Klammern stehen wieder in der Hilfe: /w <Name> <Text>" },
  ],
};
