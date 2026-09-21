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
  stand: "Fassung 428 — Runde 75: UFO, Katze, Riesenhand, Frisbee",

  inArbeit: [
    { seit: "2026-09-21T19:20", nurBetreiber: true,
      text: "Billard: das Abprallen an den Ecken und die Startposition wählen" },
    { seit: "2026-09-21T19:20", nurBetreiber: true,
      text: "Bowling mit den anderen Leuten als Kegel" },
    { seit: "2026-09-21T19:20", nurBetreiber: true,
      text: "Basketballkorb, Strohhalm, Knüllen, Landegeräusch im Pool" },
    { seit: "2026-09-21T19:20", nurBetreiber: true,
      text: "Die restlichen Sprechbilder: Spinne, Regenbogen, Schallwellen, Eisblumen, Blasen, Regentropfen" },
    { seit: "2026-09-21T19:20", nurBetreiber: true,
      text: "Aufgabe im Unterricht, Schiffe-versenken-Reihenfolge, Android-Layout, Stadt-Land-Fluss, Whiteboard" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T19:20",
      text: "🛸 UFO: /untertasse 5 — die fliegende Untertasse kommt, der Strahl hebt dein Bild hoch, sie fliegt zum Platz und materialisiert dich wieder. Eigener Strahleffekt, keine Rückstände, der Platz selbst wird nicht angefasst." },
    { seit: "2026-09-21T19:20",
      text: "🐱 Katze: /mieze 5 — sie taucht auf und spielt dein Profilbild wie ein Wollknäuel bis zum Platz, mit zwei Miau. Sie schlägt so oft zu, wie Plätze dazwischen liegen; der Ball rollt genau so weit, wie er sich dreht." },
    { seit: "2026-09-21T19:20",
      text: "🤚 Riesenhand: /gotteshand 5 und /pranke 5 — zwei Hände zur Auswahl. Sie hebt schneller an, als sie absetzt, das Bild hängt ihr nach; Plopp beim Zupfen, Aufsetzgeräusch am Ziel." },
    { seit: "2026-09-21T19:20",
      text: "🥏 Frisbee: /frisbee 5 — dein Bild fliegt flach und drehend im Bogen hinüber." },
    { seit: "2026-09-21T19:20",
      text: "🕶️ Sonnenbrille: /sonnenbrille Name — sie schiebt sich von der Seite aufs Gesicht, dann läuft der Glanz über die Gläser." },
    { seit: "2026-09-21T19:20",
      text: "🎱 Der Billardqueue steht endlich HINTER der Kugel. Gemessen lag seine Spitze zu jedem Zeitpunkt vor ihr — er hat sie nie getroffen, sondern wurde von ihr überholt. Jetzt trifft er den hinteren Rand auf 1,7 px genau und bleibt danach zurück." },
    { seit: "2026-09-21T19:20",
      text: "🤠 Der Cowboy-Ruf ist neu (im alten Ton war gar kein Ruf drin), die Hand rückt den Hut erst zum Schluss zurecht, und der Hut hat jetzt eine echte Cattleman-Delle statt drei Buckeln." },
    { seit: "2026-09-21T19:20",
      text: "💿 Der Plattenteller kratzt jetzt da, wo man es hört — und die Nadel setzt bei 144 ms auf statt bei 936 ms." },
    { seit: "2026-09-21T19:20",
      text: "🚁 Das Helikopterfenster schneidet oben kreisrund ab, die Ecke ist ausgerundet, das Fenster etwas kleiner." },
    { seit: "2026-09-21T19:20",
      text: "🚢 Der Raddampfer: das Leiern der Hupe ist weg, die Pfeife ist ein Dreiklang und lauter — und aus der Dampforgel ist eine Dixie-Band geworden (Banjo, Tuba, Trompete, Brush-Drums)." },
    { seit: "2026-09-21T19:20",
      text: "👙 Beim BH reißt es zuerst, dann kommt das doppelte Pfeifen — kurz, dann länger, und kürzer als vorher." },
    { seit: "2026-09-21T19:20",
      text: "🔥 Das Feuer sitzt bündig auf dem Ring (das Sprechfeld saß 3,84 px zu hoch), lodert in feinen Wellen, und die Blasen außen sind weg." },
    { seit: "2026-09-21T19:20",
      text: "🦡 Das Maulwurfgeräusch klingt nicht mehr nach Klopfen, und die Erdhaufen sind so breit wie ein Profilbild." },
  ],
};
