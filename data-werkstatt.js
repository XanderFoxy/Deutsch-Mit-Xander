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
  stand: "Fassung 636: Level, Können, Rüstung, Superkraft, Tagesgeschenk (634), Lok-Gleise gerade und verbunden (635), kein Italienisch im Deutschkurs (636)",

  inArbeit: [
    { seit: "2026-09-25T02:20",
      text: "811 falsche Betonungen korrigieren (läuft)" },
    { seit: "2026-09-25T02:20",
      text: "Aufgaben mit zwei richtigen Antworten reparieren (läuft)" },
    { seit: "2026-09-25T02:20",
      text: "Tiere füttern und aufwerten, Babydrache, Flugtier, Biss mit Knurren" },
    { seit: "2026-09-25T02:20",
      text: "Geschütz als Turm, deutsche Wurfwaffen, Salven, Mauer bleibt deine" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-25T02:20",
      text: "Level und Erfahrung, sechs Fertigkeiten mit Training" },
    { seit: "2026-09-25T02:20",
      text: "Helm und Brustpanzer mit Abnutzung und Reparatur" },
    { seit: "2026-09-25T02:20",
      text: "Superkraft dämonisch bei voller Ladung" },
    { seit: "2026-09-25T02:20",
      text: "Tagesgeschenk automatisch, Seitenübungen werden Spielpunkte" },
    { seit: "2026-09-25T02:20",
      text: "Ladung, Level und Rüstung am Bildrand für alle sichtbar" },
    { seit: "2026-09-25T02:20",
      text: "Lok nur auf geraden, verbundenen Gleisen" },
    { seit: "2026-09-25T02:20",
      text: "1.067 italienische Wörter raus aus dem deutschen Wörterbuch, Satzbaukasten ohne Italienisch" },
  ],
};
