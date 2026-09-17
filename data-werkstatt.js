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
   ========================================================= */
window.DMA_WERKSTATT = {
  /* true = nur der Betreiber sieht die Blase. Ausdrücklich so
     gewünscht: „sie soll für normale Benutzer gar nicht sichtbar
     sein, nur für mich als Betreiber." */
  nurBetreiber: true,

  inArbeit: [
    { seit: "2026-09-17T13:11",
      text: "Noch fehlende Animationen: Armageddon, Gottes Zorn / Sintflut, Ägypten mit Pyramiden und Sandsturm, Ostern und die neugierig guckenden Comic-Augen." },
    { seit: "2026-09-17T13:11",
      text: "Der Chat soll für jeden gleich sein: wer sich neu anmeldet, sieht den ganzen Tagesverlauf — nicht nur das, was auf seinem Gerät liegt." },
    { seit: "2026-09-17T13:11",
      text: "Beim Betreten soll das Ende des Chats im Bild stehen, nicht der Anfang." },
    { seit: "2026-09-17T13:11",
      text: "Hilfe beim Tippen der Befehle: Vorschläge ab dem Schrägstrich, Themen und Namen aus einem kleinen Menü." },
    { seit: "2026-09-17T13:11",
      text: "Kurze Töne, wo sie passen — Glocke, Katze, Regen — abschaltbar durch nochmaliges Antippen." },
    { seit: "2026-09-17T13:11",
      text: "Das Wörterbuch wird durchgesehen: erfundene Stichwörter wie „das Probier“ oder „der Eckenerum“ fliegen raus, echte Wörter bleiben." },
    { seit: "2026-09-17T13:11",
      text: "Bilderwelten: Grössen, verdeckte Dinge und Auswahlrahmen, die sich gegenseitig blockieren." },
    { seit: "2026-09-17T13:11", nurBetreiber: true,
      text: "Das Wörterbuch mit deiner eigenen Stimme über ElevenLabs, Niveau für Niveau ab A1." },
  ],
};
