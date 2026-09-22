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
  stand: "Runde 94 — Fahrstuhl repariert, Lack bleibt, Billard trifft verschiedene Löcher (Fassung 503)",

  inArbeit: [
    { seit: "2026-09-22T23:57", nurBetreiber: true,
      text: "Sammellauf vor jedem Hochladen: bash werkzeug/alle-pruefen.sh" },
    { seit: "2026-09-22T23:57",
      text: "Lok-Schienenführung, Mario-Töne beim Draufspringen, Delfin, Anrufen (heimlich telefonieren), Hände vereinheitlichen, Cowboyhut zurechtrücken" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T23:57",
      text: "„/fahrstuhl 5“ stürzte ab — mit einer Platznummer (und die schickt das Menü immer) brach der Befehl mit einem Fehler ab. Jetzt fährt er; neue Sonde prüft ALLE 28 Reisen mit Nummer" },
    { seit: "2026-09-22T23:57",
      text: "Das aufgesprühte Bild bleibt jetzt liegen — über Auffrischen, Neuzeichnen und Klick aufs eigene Bild hinweg. Nur der Scheibenwischer nimmt es ab" },
    { seit: "2026-09-22T23:57",
      text: "Billard: die Rechnung fand gar kein Loch (falscher Feldname) — was man fallen sah, war jedes Mal der Ersatzweg. Jetzt 34 Grad Fächer, Stoßhärte, Reibung: über 24 Stöße alle drei Löcher" },
    { seit: "2026-09-22T23:57",
      text: "Drei neue Sonden: pruefe-runde92-reisenummern, pruefe-runde92-lack, pruefe-runde92-billard" },
  ],
};
