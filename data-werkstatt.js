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
  stand: "Fassung 613 – Adler von oben wieder groß, Heli-Fenster ausgestanzt, Blume aus der Mitte",

  inArbeit: [
    { seit: "2026-09-24T20:47",
      text: "Walkie #238–#241 (Blume, Adler, Heli, Magie/Funkeln)" },
    { seit: "2026-09-24T20:47",
      text: "Adler-Seitenansicht schöner (#208)" },
    { seit: "2026-09-24T20:47",
      text: "Hot Rod als Standard-Fahrzeug mit Weg, Mario-Röhren, Lok-Schranke, Zauberer beidhändig" },
    { seit: "2026-09-24T20:47",
      text: "Spielsystem erst nach deiner Zustimmung (Funk 92)" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-24T20:47",
      text: "608: Seite meldet neue Fassung auch nach Zurück/App-Wechsel (Knopf oben)" },
    { seit: "2026-09-24T20:47",
      text: "609: Zu zweit wieder da (leeres Feld → Reisen-Reihe)" },
    { seit: "2026-09-24T20:47",
      text: "610: Pferd galoppiert beim Aufziehen spürbar schneller (#182)" },
    { seit: "2026-09-24T20:47",
      text: "611: keine Comic-Wörter mehr auf den Gesichtern" },
    { seit: "2026-09-24T20:47",
      text: "612: Blüte geht paarweise gegenüber auf – Schwerpunkt 0 px neben der Mitte" },
    { seit: "2026-09-24T20:47",
      text: "613: Adler von oben 0,85 statt 0,60, am Rand automatisch passend (#208)" },
    { seit: "2026-09-24T20:47",
      text: "613: Heli-Fenster zeigt angeschnittenen Gesichtsausschnitt mit Stanzkante (#206)" },
  ],
};
