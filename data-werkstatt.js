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
  stand: "Runde 31 — GIPHY, Profilbild, eigene Sammlung",

  inArbeit: [
    { seit: "2026-09-17T19:15", nurBetreiber: true,
      text: "ElevenLabs-Schluessel als ELEVENLABS_API_KEY setzen, dann laufen die 2238 Woerter" },
    { seit: "2026-09-17T19:15",
      text: "Sitzende Seitenansicht fehlt — liegen und krabbeln sind schon Profile" },
    { seit: "2026-09-17T19:15",
      text: "Bilderwelten: Groessen, verdeckte Dinge, blockierende Rahmen" },
    { seit: "2026-09-17T19:15",
      text: "Chat beginnt unten und ist fuer jeden vollstaendig" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-17T19:15",
      text: "Dein GIPHY-Schluessel ist eingetragen — die Suche laeuft" },
    { seit: "2026-09-17T19:15",
      text: "Bewegtes GIF als richtiges PROFILBILD, nicht nur auf deinem Platz" },
    { seit: "2026-09-17T19:15",
      text: "Eigene Sammlung: durchsichtige PNG und bewegte GIF selbst hinzufuegen" },
    { seit: "2026-09-17T19:15",
      text: "Genormt auf 120 x 120 — dieselbe Groesse wie die Fuechse in sticker/" },
    { seit: "2026-09-17T19:15",
      text: "Durchsichtigkeit bleibt wirklich erhalten, nachgemessen am Alphawert" },
    { seit: "2026-09-17T19:15",
      text: "Die Sammlung steht im Konto, du hast sie auf jedem Geraet" },
  ],
};
