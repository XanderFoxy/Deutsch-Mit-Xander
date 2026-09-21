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
  stand: "Runde 55 - die Stoerung ist wieder die alte",

  inArbeit: [
    { seit: "2026-09-21T03:07",
      text: "Toene: Schneekugel, Basketballkorb, Tennisaufschlag, Katapult, Bumerang, Hammer, Strudel, Wassereimer, Licht-aus" },
    { seit: "2026-09-21T03:07",
      text: "Fahrzeuge: Raddampfer vom Mississippi, Helikopter, Pferd, Lok fahren falsch herum oder sind zu grob" },
    { seit: "2026-09-21T03:07",
      text: "Pfeil mit echter Feder und Saugnapf, Kuss mit Mund, Cowboyhut, AirPods Max filigran" },
    { seit: "2026-09-21T03:07",
      text: "Birne auf der waagerechten Achse ein- und ausdrehen, mit Stromausfall beim Herausdrehen" },
    { seit: "2026-09-21T03:07",
      text: "Whiteboard neu denken: Plaetze und Chat behalten, Texte laden, alles speicherbar" },
    { seit: "2026-09-21T03:07",
      text: "Alles ins Profil speichern statt lokal - Effekte, Favoriten, Giphy-Bilder" },
    { seit: "2026-09-21T03:07", nurBetreiber: true,
      text: "Tutorvideo mit Greenscreen neu aufnehmen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T03:07",
      text: "Die Stoerung im Sprechbild ist Zeile fuer Zeile wieder die Fassung 357 - Runde 41 und 49 sind zurueckgenommen" },
    { seit: "2026-09-21T03:07",
      text: "Die Pruefung bewacht jetzt die 357er, damit sie nicht noch einmal aus Versehen geaendert wird" },
    { seit: "2026-09-21T03:07",
      text: "Feuer: fuenf Silhouetten, eigene Glutfarbe, eigene Neigung, eigener Takt - keine zwei Flammen gleich" },
    { seit: "2026-09-21T03:07",
      text: "Dazu eine weiche Glutzone unter den Flammen - Feuer hat keinen Umriss" },
    { seit: "2026-09-21T03:07",
      text: "Die Spinne seilt sich doppelt so tief ab und krabbelt danach ohne Ende auf ihrem Netz weiter" },
    { seit: "2026-09-21T03:07",
      text: "Eisblumen stehen nach 1,3 s statt nach 5,2 s und sind kraeftiger" },
    { seit: "2026-09-21T03:07",
      text: "Regenbogen weich und gluehend, vierzehn Farben wandern durch" },
    { seit: "2026-09-21T03:07",
      text: "Schallwellen: der Schleier am Bildrand fuellt die Luecke, die vorher blieb" },
    { seit: "2026-09-21T03:07",
      text: "Bluete naeher am Rahmen, Mitte bleibt frei, mit Licht und Schatten" },
    { seit: "2026-09-21T03:07",
      text: "Funkeln 36 statt 20 Teilchen in acht Formen, Magie 38 statt 26 und feiner" },
    { seit: "2026-09-21T03:07",
      text: "Noten bleiben im Bild statt daneben zu starten" },
  ],
};
