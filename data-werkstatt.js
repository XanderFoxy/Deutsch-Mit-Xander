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
  stand: "Runde 32 — vier neue Animationen, du bist Haeuptling",

  inArbeit: [
    { seit: "2026-09-17T21:10", nurBetreiber: true,
      text: "ElevenLabs: die Umgebung sperrt api.elevenlabs.io — bitte in den Umgebungseinstellungen freigeben" },
    { seit: "2026-09-17T21:10",
      text: "Plaetze spontan tauschen — kommt als naechstes" },
    { seit: "2026-09-17T21:10",
      text: "/j und raumuebergreifendes Fluestern nachstellen" },
    { seit: "2026-09-17T21:10",
      text: "Android und Safari gleich gut — wird geprueft" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-17T21:10",
      text: "Seifenblasen steigen auf und zerplatzen" },
    { seit: "2026-09-17T21:10",
      text: "Herbstlaub taumelt herunter — Ahorn, Eiche, Birke in sechs Farben" },
    { seit: "2026-09-17T21:10",
      text: "Aquarium: Fische ziehen in mehreren Tiefen durch, Luftblasen steigen" },
    { seit: "2026-09-17T21:10",
      text: "Pinguine watscheln in einer Reihe am Boden entlang, im Schneetreiben" },
    { seit: "2026-09-17T21:10",
      text: "Du bist als Betreiber jetzt in JEDEM Raum Haeuptling, auch im Hauptklassenzimmer" },
    { seit: "2026-09-17T21:10",
      text: "Alle 41 Animationen einzeln im Browser ausgeloest und nachgezaehlt" },
  ],
};
