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
  stand: "Fassung 438 — Runde 80, fuenfter Teil: die Sprechbilder. Die Noten stehen jetzt wirklich auf dem Pfad des Rahmens, die Herzen sitzen kleiner am Ring, der Regenbogen durchwandert die Farben, die Schallwellen haben keine Luecke mehr, Magie und Funkeln sind feiner, bei den Blasen gibt es mehr kleine — und der gruene Sprechring ist weich geworden und laesst sich in der Farbe waehlen.",

  inArbeit: [
    { seit: "2026-09-22T02:30",
      text: "Der Rest von Xanders Liste vom 22. September" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T02:30",
      text: "Noten: jede steht senkrecht auf dem Kreis (gemessen: 0 von 16 weichen um mehr als 4 Grad ab, alle auf demselben Ring, Spanne 3,2 px);Herzen: vom freien Feld auf den Ring geholt und kleiner gemacht (Spanne 3,0 px);Regenbogen: hue-rotate laeuft in 6,4 s einmal ganz herum — die Farben wandern wirklich;Schallwellen: vier Ringe, die einander nachruecken, statt eines Impulses der verschwindet und neu anfaengt;Magie 66 auf 88 Teilchen und Groesse in dritter Potenz gewuerfelt (Median 0,69 auf 0,54);Funkeln 64 auf 96 Teilchen;Blasen 16 auf 34, Groessenverteilung zu den kleinen hin;Sprechring: kein harter Rand mehr, sondern ein Verlauf mit weichem Auslauf und Hof;Farbwahl fuer den Ring unter den Kacheln — acht Toene plus freies Farbfeld, die Wahl bleibt auf dem Geraet;alle 136 Sonden gruen" },
  ],
};
