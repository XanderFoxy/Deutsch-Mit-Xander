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
  stand: "Fassung 727 — Trupps: Fischer, Holzfäller, Jäger, Bergleute als ein System; Fortschritt im Bild; Wetter oben rechts",

  inArbeit: [
    { seit: "2026-09-27T03:08",
      text: "Meldungen „fertig/angegriffen“ mit Sprung ins Dorf – Funk 155/173" },
    { seit: "2026-09-27T03:08",
      text: "Städte als Kette durchblättern, aus dem Profil in die Stadt – Funk 176" },
    { seit: "2026-09-27T03:08",
      text: "Chat-Waffen richtig halten und gerichtet feuern, Tomahawk-Fehler – Funk 176" },
    { seit: "2026-09-27T03:08",
      text: "Wall, Kaserne, Stadt gestalten (Flüsse, Berge) – Funk 169/172/176" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-27T03:08",
      text: "Kein endloses Angeln mehr: Bühne und See holen aus der Menge der Fischer" },
    { seit: "2026-09-27T03:08",
      text: "Trupps losschicken: Fischer, Holzfäller, Jäger (Fleisch), Bergleute – 5 Minuten, feste Menge" },
    { seit: "2026-09-27T03:08",
      text: "Mithelfen macht die Fahrt schneller, nie mehr als die Menge" },
    { seit: "2026-09-27T03:08",
      text: "Waldrand im Dorfbild antippbar; See und Wald zeigen den Stand" },
    { seit: "2026-09-27T03:08",
      text: "Fortschritt im Bild: was entsteht, mit Uhr und Balken (Häuser, Äcker, Trupps)" },
    { seit: "2026-09-27T03:08",
      text: "Wetter oben rechts in einer Zeile, nicht mehr über dem Bahnhof" },
  ],
};
