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
  stand: "Runde 71 — die Zeichnungen, erster Teil (Fassung 414)",

  inArbeit: [
    { seit: "2026-09-21T14:33", nurBetreiber: true,
      text: "Der Spiegelstreifen im Tor ist im Messbild nicht nachzuweisen: selbst mit vollflächigem Weiss blieb die hellste Stelle bei 39 von 255. Warum die Schicht nicht durchschlägt, weiss ich nicht — er liegt deshalb jetzt als Hintergrundlage auf der Fläche selbst, nachgewiesen ist er damit noch nicht" },
    { seit: "2026-09-21T14:33",
      text: "Rohrreise: das Bild gleitet über das Rohr statt hinein" },
    { seit: "2026-09-21T14:33",
      text: "Helikopter, Pferd, Flugzeug, Lok, Maulwurfshügel, Kopfhörer: Zeichnungen noch offen" },
    { seit: "2026-09-21T14:33",
      text: "3-Meter-Turm: Brett zu kurz, Turm blendet beim Sprung aus, Wackeln fehlt" },
    { seit: "2026-09-21T14:33",
      text: "Greifvogel: Beine und Krallen noch comicartig" },
    { seit: "2026-09-21T14:33",
      text: "Katapult: die Animation muss zum neuen Ton passen — das Aufziehen in der Schale fehlt" },
    { seit: "2026-09-21T14:33",
      text: "Bombe: die zwei Fassungen (Zeitzünder / Lunte) sind noch nicht auswählbar — Lunte und Explosion liegen bereit" },
    { seit: "2026-09-21T14:33",
      text: "Bienen lassen Reste am alten Platz; Münze und Bowling brauchen noch die Physik" },
    { seit: "2026-09-21T14:33", nurBetreiber: true,
      text: "Zwei Tutorfilme (ueber-03b, ueber-05) brauchen mehr ElevenLabs-Guthaben" },
    { seit: "2026-09-21T14:33", nurBetreiber: true,
      text: "16 Supabase-Tabellen ohne RLS, darunter profiles und private_messages" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T14:33",
      text: "Das Tor sitzt jetzt mittig auf dem Bild. Der Grund war messbar: lcPlatzGitter gibt die Mitte des GANZEN Platzes, und dazu gehört der Name unter dem Bild — das Tor sass um den halben Namen zu tief. Nachgemessen im Browser: 0 px Abweichung in beiden Richtungen" },
    { seit: "2026-09-21T14:33",
      text: "Das Tor ist schwarz statt blau, hat drei durchsichtige Schichten und steht 3,4 s statt 1,6 s offen" },
    { seit: "2026-09-21T14:33",
      text: "Die Feder blendete über die ganze Reise aus. Der Grund: „opacity: 0\" stand nur im LETZTEN Bild, und der Browser rechnet eine solche Eigenschaft dann vom Anfang an hoch. Jetzt trägt jedes Sprungbild seine Deckkraft" },
    { seit: "2026-09-21T14:33",
      text: "Die Liane hängt nicht mehr über den Bildrand hinaus — der Aufhängepunkt lag absichtlich eine Vierteil-Bildhöhe ÜBER der Kartenkante" },
    { seit: "2026-09-21T14:33",
      text: "Die Liane holt Anlauf: 16 Prozent der Strecke zurück, gegen die Richtung des Ziels — und sie landet nicht mehr mit einer weichen Überblendung, sondern schwingt aus dem Bild" },
    { seit: "2026-09-21T14:33",
      text: "pruefe-runde71.js: 13 Regeln, alle grün" },
  ],
};
