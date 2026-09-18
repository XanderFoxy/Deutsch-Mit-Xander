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
  stand: "Runde 19u — der ganze Verlauf, und der Chat bleibt sauber",

  inArbeit: [
    { seit: "2026-09-18T21:41",
      text: "Buehnenansicht: wer oben ist, sieht nur die anderen oben" },
    { seit: "2026-09-18T21:41",
      text: "Befehlserklaerungen auf dem Telefon sichtbar machen" },
    { seit: "2026-09-18T21:41",
      text: "Favoriten im Befehlspanel selbst anheften" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-18T21:41",
      text: "Die Pille hat wieder ihre alte Farbe — undurchsichtig wird sie jetzt durch den Chat-Grund darunter, nicht durch eine neue Farbe" },
    { seit: "2026-09-18T21:41",
      text: "Sie nimmt keine Klicks an: was darunter liegt, bleibt antippbar" },
    { seit: "2026-09-18T21:41",
      text: "Der Verlauf ist nicht mehr auf 400 Zeilen begrenzt — bis zu 4000 im Geraet, 2000 vom Server, und wenn der Platz nicht reicht, wird gekuerzt statt alles zu verlieren" },
    { seit: "2026-09-18T21:41",
      text: "„Du bist hier Haeuptling\", „X spricht gerade\" und die Klassensprecher-Ansage stehen nicht mehr im Chat, sondern ziehen als Blase vorbei" },
  ],
};
