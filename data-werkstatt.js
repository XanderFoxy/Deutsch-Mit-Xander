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
  stand: "Runde 89b — fuenf Felder fehlten in der Leitung: Anziehen, Ballon, Songausschnitt, Heben, Tausch.",

  inArbeit: [
    { seit: "2026-09-22T20:31",
      text: "Glitches am verlassenen Platz — Sonde laeuft mit den Ausnahmen neu durch" },
    { seit: "2026-09-22T20:31",
      text: "Uebersicht aller Wuensche aus dem Verlauf — wird aus den Sonden gebaut" },
    { seit: "2026-09-22T20:31",
      text: "Frosch, Pferd, Lok, Helikopter, Fahrstuhl, Adler" },
    { seit: "2026-09-22T20:31",
      text: "Haende: greifende Hand, King Kong behaart, Kralle" },
    { seit: "2026-09-22T20:31",
      text: "Hammer: demolieren in Stufen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T20:31",
      text: "Anziehen/Ausziehen: das Kleidungsstueck kam nie an — jetzt liegt es wirklich auf dem Platz" },
    { seit: "2026-09-22T20:31",
      text: "Luftballon: die Helium-Variante war ueberhaupt nicht erreichbar, jetzt schon" },
    { seit: "2026-09-22T20:31",
      text: "/ballonpumpe und /aufblasen ohne Namen treffen mich selbst" },
    { seit: "2026-09-22T20:31",
      text: "Songausschnitt: das ENDE fuhr nicht mit, der Ausschnitt lief bis zum Liedschluss" },
    { seit: "2026-09-22T20:31",
      text: "Heben und Platztausch: Zielplatz und Tauschmarke kamen nicht an" },
  ],
};
