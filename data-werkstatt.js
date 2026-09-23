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
  stand: "Fassung 527 — Runde 100",

  inArbeit: [
    { seit: "2026-09-23T22:16",
      text: "Kuss: „Mmmh“ davor, Ton je Mann/Frau" },
    { seit: "2026-09-23T22:16",
      text: "Sabbern aus dem Mund über Kreis und Bild" },
    { seit: "2026-09-23T22:16",
      text: "Popo-Klaps: alter Schmerzlaut, Abdruck seitlich" },
    { seit: "2026-09-23T22:16",
      text: "Lok größer auf den Gleisen, Glocke genauer" },
    { seit: "2026-09-23T22:16",
      text: "Zylinder breiter, Herausziehen flüssiger" },
    { seit: "2026-09-23T22:16",
      text: "Sprühdose: Fotos/GIFs deckend, Panel klein" },
    { seit: "2026-09-23T22:16",
      text: "Blume ohne Lücken" },
    { seit: "2026-09-23T22:16",
      text: "Hände realistisch" },
    { seit: "2026-09-23T22:16",
      text: "Mario: Röhren als Hindernisse" },
    { seit: "2026-09-23T22:16",
      text: "Neue Animation „Abstand“ (wegschieben)" },
    { seit: "2026-09-23T22:16",
      text: "Fokus-Modul, Musik-Panel, Schiffe versenken" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-23T22:16",
      text: "Leiter erscheint wieder (eigener Name wurde nicht gefunden)" },
    { seit: "2026-09-23T22:16",
      text: "Kran geht auch mit dir selbst" },
    { seit: "2026-09-23T22:16",
      text: "Übungspuppe zum Testen (Knopf im Walkie-Talkie)" },
    { seit: "2026-09-23T22:16",
      text: "Walkie-Reiter am Rand verschiebbar" },
    { seit: "2026-09-23T22:16",
      text: "Lack und Dreck reisen mit dem Bild" },
    { seit: "2026-09-23T22:16",
      text: "Zylinder: fester Hut, kein Ring darunter" },
    { seit: "2026-09-23T22:16",
      text: "Sprühdose: Bildauswahl wieder im Bildschirm" },
    { seit: "2026-09-23T22:16",
      text: "Ei steht wieder einzeln" },
    { seit: "2026-09-23T22:16",
      text: "„frei“ sofort beim Verlassen" },
  ],
};
