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
  stand: "Fassung 332 — halb so schwer, gleich laut, und der Chat rattert mit",

  inArbeit: [
    { seit: "2026-09-19T07:17",
      text: "Sitzende Seitenansicht in den Bilderrätseln einsetzen" },
    { seit: "2026-09-19T07:17",
      text: "Tutor-Figur, die in jedem Bereich hereinkommt und erklärt" },
    { seit: "2026-09-19T07:17", nurBetreiber: true,
      text: "21 Tutor-Stücke warten auf deine Stimme" },
    { seit: "2026-09-19T07:17", nurBetreiber: true,
      text: "Grok-API-Guthaben einzahlen (console.x.ai), dann erzeuge ich Filme selbst" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-19T07:17",
      text: "Filme halbiert: kein Film über 1,9 MB, alle fünf zusammen 5,9 statt 15,5 MB" },
    { seit: "2026-09-19T07:17",
      text: "Ton gleich laut gemacht — die Quellen lagen 5,5 Stufen auseinander" },
    { seit: "2026-09-19T07:17",
      text: "Ladebalken statt Ring, mit echtem Fortschritt" },
    { seit: "2026-09-19T07:17",
      text: "Alle Filme werden beim Betreten vorgeladen (nicht bei Datensparen/2G)" },
    { seit: "2026-09-19T07:17",
      text: "Vor jeder grossen Animation rückt sich das Klassenzimmer zurecht" },
    { seit: "2026-09-19T07:17",
      text: "Rattern zurück: T-Rex folgt den Tritten, Lok zittert wie über Schienen" },
    { seit: "2026-09-19T07:17",
      text: "Gerattert wird nur der Chatverlauf — Film bleibt auf 0 Punkten stehen" },
    { seit: "2026-09-19T07:17",
      text: "Grok-Imagine-Schlüssel recherchiert: filme/GROK-SCHLUESSEL.md" },
  ],
};
