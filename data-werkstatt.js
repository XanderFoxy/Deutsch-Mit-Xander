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
  stand: "Runde 27 — Wolken und Himmel",

  inArbeit: [
    { seit: "2026-09-17T17:35",
      text: "Die Umarmung neu zeichnen — das Emoji sieht noch nicht gut aus" },
    { seit: "2026-09-17T17:35",
      text: "GIPHY: Schluessel-Link fuer dich, bewegtes Profilbild, eigene Bibliothek" },
    { seit: "2026-09-17T17:35",
      text: "Spiele: nur Freigegebenes fuer Nicht-Betreiber; Blitzrunde-Liste einklappen" },
    { seit: "2026-09-17T17:35",
      text: "Bilderraetsel: Waschmaschine statt Waschbecken, Restaurant-Sitzordnung, Koffer, Zug" },
    { seit: "2026-09-17T17:35",
      text: "Online-Liste: Landesflagge und ein besseres Klassenzimmer-Zeichen" },
    { seit: "2026-09-17T17:35", nurBetreiber: true,
      text: "Frage offen: 'Es war einmal in Deutschland' meldet 315 von 365 Tagen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-17T17:35",
      text: "Wolken sind kein Bild mehr, sondern echtes Rauschen — sie verlaufen und verbinden sich, wie in der Natur" },
    { seit: "2026-09-17T17:35",
      text: "Die alte Wolkenkachel (35.575 Zeichen) ist geloescht — nichts wiederholt sich mehr" },
    { seit: "2026-09-17T17:35",
      text: "Keine langen Luecken mehr: drei Lagen ziehen unterschiedlich schnell uebereinander" },
    { seit: "2026-09-17T17:35",
      text: "Der Himmel richtet sich jetzt nach der echten Sonne, nicht nach der Uhr" },
    { seit: "2026-09-17T17:35",
      text: "Berlin 21. Juni: 16 Std 50 Min Tag — auf die Minute nachgerechnet" },
    { seit: "2026-09-17T17:35",
      text: "Um 19 Uhr steht die Sonne noch bei 1,8 Grad — es bleibt hell, wie draussen" },
  ],
};
