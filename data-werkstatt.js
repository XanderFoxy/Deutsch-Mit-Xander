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
  stand: "Runde 80, sechster Teil: die letzten Sprechbilder",

  inArbeit: [
    { seit: "2026-09-22T02:50",
      text: "Der Rest von Xanders Liste vom 22. September" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T02:50",
      text: "Strom: die Blitze gehen jetzt aus der Mitte wie in einer Plasmakugel — 100 % der Strecken laufen nach aussen, Fusspunkt rund 2 Einheiten von der Mitte; und sie sind nicht mehr haarfein (Kern 0,34 -> 0,62)." },
    { seit: "2026-09-22T02:50",
      text: "Feuer: die Flammenfuesse sitzen 2,55 px statt 0,88 px innerhalb des Bildrandes (gemessen, Bildradius 42 px), und jede der 30 Flammen wirft jetzt einen eigenen Funken an ihrer Spitze ab." },
    { seit: "2026-09-22T02:50",
      text: "Bluete: sie schliesst sich wieder, wenn jemand aufhoert zu sprechen — 900 ms Zugehen statt sofortigem Verschwinden." },
    { seit: "2026-09-22T02:50",
      text: "Eis: die kachelartige Kontrastkante um die Eisblumen ist weg (der Maskenkasten war mit 68 % kleiner als das Bild und schnitt an einem Rechteck ab), und die untersten Eiszapfen werden nicht mehr abgeschnitten (tiefster Punkt 105,95 bei einem viewBox, der bei 100 endete)." },
    { seit: "2026-09-22T02:50",
      text: "Blut: der Saum oben laeuft jetzt in zwei Ovalen an den Flanken nach aussen und unten. Dabei sind auch die harten Rechteckkanten der beiden Rinnsale verschwunden — ihr Verlaufsradius war so breit wie die ganze Kachel statt wie ihre Haelfte." },
  ],
};
