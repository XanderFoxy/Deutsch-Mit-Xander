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
  stand: "Runde 30 — echte Geräusche, Schiffe versenken, Whiteboard",

  inArbeit: [
    { seit: "2026-09-20T21:48", nurBetreiber: true,
      text: "Tutor: Ansage je Sektion und animierte Figur — als Nächstes" },
    { seit: "2026-09-20T21:48", nurBetreiber: true,
      text: "Aufziehauto, Boot und Kran als weitere Reisen" },
    { seit: "2026-09-20T21:48", nurBetreiber: true,
      text: "Die Lupe, die die Eingabesymbole verdeckt — ich finde die Stelle nicht" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-20T21:48",
      text: "20 neue Geräusche mit ElevenLabs erzeugt: Pfeilschuss, Cowboy-Yeehaw, Peitschenknall, Angelkurbel, Fenster, Rollo, Jalousie, Sprühsahne, Fahrt + Bremse, Kuss, Schneeball, Schlürfen, Blubbern, Katapult, Zwille, Flugzeug, Aufziehen, Maulwurf, Portal" },
    { seit: "2026-09-20T21:48",
      text: "Der Tonplan schlägt jetzt die gleichnamige alte Datei — die alten Geräusche bleiben als Rückfall liegen" },
    { seit: "2026-09-20T21:48",
      text: "Beim Fahren quietscht die Bremse erst bei der Ankunft" },
    { seit: "2026-09-20T21:48",
      text: "Schiffe versenken: /versenken — jeder versteckt sich, die Verstecke gehen NUR an den Spielleiter, dann ist der Reihe nach jeder dran" },
    { seit: "2026-09-20T21:48",
      text: "Die Reihenfolge ist jetzt die Ankunft im Raum, nicht der Sitzplatz — Platztausch ändert sie nicht mehr" },
    { seit: "2026-09-20T21:48",
      text: "Blubbern: die Blasen sind sein Profilbild in klein und steigen darüber auf" },
    { seit: "2026-09-20T21:48",
      text: "Drei neue Reisen: Flugzeug mit dem Bild hinterm Fenster, Maulwurf, Tor" },
    { seit: "2026-09-20T21:48",
      text: "Bombe: feine Asche sammelt sich und wird weggeweht" },
    { seit: "2026-09-20T21:48",
      text: "Korb größer, Blütenblätter blühen wirklich auf, Melodie läuft nur noch einmal" },
    { seit: "2026-09-20T21:48",
      text: "/noten 3 spielt den gemessenen Refrain von Lied 3" },
    { seit: "2026-09-20T21:48",
      text: "Betonung lässt sich überall an- und ausschalten, auch neben der Übersetzung" },
  ],
};
