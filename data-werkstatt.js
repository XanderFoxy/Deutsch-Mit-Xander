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
  stand: "Runde 30 — Zug und deine eigene Stimme",

  inArbeit: [
    { seit: "2026-09-17T19:04", nurBetreiber: true,
      text: "Ich brauche einen ElevenLabs-API-Schluessel, dann laufen die uebrigen 2238 durch" },
    { seit: "2026-09-17T19:04", nurBetreiber: true,
      text: "GIPHY-Schluessel: developers.giphy.com/dashboard → Create an App → API Key" },
    { seit: "2026-09-17T19:04",
      text: "Seitliche Sitzhaltung fuer die Figuren — im Restaurant sitzen alle nach vorn" },
    { seit: "2026-09-17T19:04",
      text: "Eigene Bildsammlung: transparente PNG und GIF selbst hinzufuegen" },
    { seit: "2026-09-17T19:04",
      text: "Bilderwelten: Groessen, verdeckte Dinge, blockierende Rahmen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-17T19:04",
      text: "Der Zug am Bahnhof ist keine Pappkiste mehr: Nase, Fensterband, Puffer, Bahnraeumer" },
    { seit: "2026-09-17T19:04",
      text: "Die ganze Kette fuer deine Stimme steht und ist geprueft" },
    { seit: "2026-09-17T19:04",
      text: "2239 A1-Aufnahmen ausgerechnet — 17.535 Zeichen, rund zwei Dollar bei ElevenLabs" },
    { seit: "2026-09-17T19:04",
      text: "Nachbearbeitung: Stille weg, Lautheit angleichen, 94 Prozent kleiner" },
    { seit: "2026-09-17T19:04",
      text: "Eine Probeaufnahme laeuft schon: 'der Abend' spricht mit deiner Stimme" },
    { seit: "2026-09-17T19:04",
      text: "Fehlt ein Wort, spricht die Maschinenstimme wie bisher — nichts geht kaputt" },
  ],
};
