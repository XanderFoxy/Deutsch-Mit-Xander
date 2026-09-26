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
  stand: "Fassung 710: Funk 157 und 156 – das leere Feld in der Leiste war dein unsichtbarer Regenbogendrache; Leiste im Menü ordnen; Auftritt: Ton und Bild zusammen, Gesicht im Kreis",

  inArbeit: [
    { seit: "2026-09-26T19:54",
      text: "Funk 155: Meldungen mit Sprung-Knopf (Forschung, Einsammeln, Angriff, Unzufriedenheit, Touristen, Angebote, Verkauf)" },
    { seit: "2026-09-26T19:54",
      text: "Dorf: feinere Texturen, weichere Häuser, Schnee auf Dächern, Figuren" },
    { seit: "2026-09-26T19:54",
      text: "Funk 152: Doppeltipp Schaufel = Werkzeugmenü, Waffenrad mit Querleiste, Langdruck zwei Kreise" },
    { seit: "2026-09-26T19:54",
      text: "Funk 153: Controller-Abzeichen, Nicht-Spieler stumm, Makroknopf als Magic-Button, Galaxie-Farbe, Postfach" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-26T19:54",
      text: "Leeres Feld = Tier-Fähigkeit mit 0 px Höhe – jetzt sichtbar" },
    { seit: "2026-09-26T19:54",
      text: "Menü → Mehr → Leiste unten ordnen (◀ ▶), unten genauso" },
    { seit: "2026-09-26T19:54",
      text: "Auftritt wartet aufs Foto, Töne zählen ab dem echten Start" },
    { seit: "2026-09-26T19:54",
      text: "Runder Ausschnitt oben: Gesicht statt Hals" },
    { seit: "2026-09-26T19:54",
      text: "Walkie 283: Antwort zu den Klassen" },
  ],
};
