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
  stand: "Fassung 427 — Runde 75: UFO, Katze, Riesenhand, Frisbee",

  inArbeit: [
    { seit: "2026-09-21T19:01", nurBetreiber: true,
      text: "Billard: Bandenspiel über Ecken und die Startposition wählen" },
    { seit: "2026-09-21T19:01", nurBetreiber: true,
      text: "Bowling mit den anderen Leuten als Kegel" },
    { seit: "2026-09-21T19:01", nurBetreiber: true,
      text: "Basketballkorb, Strohhalm, Knüllen, Landegeräusch im Pool" },
    { seit: "2026-09-21T19:01", nurBetreiber: true,
      text: "Die restlichen Sprechbilder: Spinne, Regenbogen, Schallwellen, Eisblumen, Blasen, Regentropfen" },
    { seit: "2026-09-21T19:01", nurBetreiber: true,
      text: "Aufgabe im Unterricht, Schiffe-versenken-Reihenfolge, Android-Layout, Stadt-Land-Fluss, Whiteboard" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T19:01",
      text: "🛸 UFO: /untertasse 5 — die fliegende Untertasse kommt, der Strahl hebt dein Bild hoch, sie fliegt zum Platz und materialisiert dich wieder. Eigener Strahleffekt, keine Rückstände, der Platz selbst wird nicht angefasst." },
    { seit: "2026-09-21T19:01",
      text: "🐱 Katze: /mieze 5 — sie taucht auf und spielt dein Profilbild wie ein Wollknäuel bis zum Platz, mit zwei Miau. Sie schlägt so oft zu, wie Plätze dazwischen liegen; der Ball rollt genau so weit, wie er sich dreht." },
    { seit: "2026-09-21T19:01",
      text: "🤚 Riesenhand: /gotteshand 5 und /pranke 5 — zwei Hände zur Auswahl (Gotteshand mit Licht von oben, Gorillapranke behaart). Sie hebt schneller an, als sie absetzt, das Bild hängt ihr nach; Plopp beim Zupfen, Aufsetzgeräusch am Ziel." },
    { seit: "2026-09-21T19:01",
      text: "🥏 Frisbee: /frisbee 5 — dein Bild fliegt flach und drehend im Bogen hinüber. Die Drehung sitzt in einer eigenen Lage, damit sie sich nicht mit der Neigung verrechnet." },
    { seit: "2026-09-21T19:01",
      text: "🕶️ Sonnenbrille: /sonnenbrille Name — sie schiebt sich von der Seite aufs Gesicht, rutscht auf die Nase und dann läuft der Glanz über die Gläser." },
    { seit: "2026-09-21T19:01",
      text: "🤠 Der Cowboy-Ruf ist neu. Im alten Ton war gar kein Ruf drin (gemessen: gleichmäßiges Rauschen, bei 1,4 s ein Knall). Jetzt ein echtes Yee-haw, sofort laut, danach der Peitschenknall — und die Hand rückt den Hut erst ganz zum Schluss zurecht." },
    { seit: "2026-09-21T19:01",
      text: "💿 Der Plattenteller kratzt jetzt da, wo man es hört: scratch.opus ist 1,01 s lang, das Kratzen lag bei 1080–1728 ms. Jetzt liegt es bei 0–1008 ms, und die Nadel setzt schon bei 144 ms auf." },
    { seit: "2026-09-21T19:01",
      text: "🚁 Das Helikopterfenster schneidet oben kreisrund ab — Dach und rechte Seite sind ein einziger Kreisbogen, die Ecke oben ist ausgerundet, das Fenster etwas kleiner." },
    { seit: "2026-09-21T19:01",
      text: "🚢 Der Raddampfer: das Leiern der Hupe ist weg (es kam von zwei dicht beieinander liegenden Tönen — das ergibt eine Schwebung). Neu ein f-Moll-Dreiklang aus drei Pfeifen, lauter. Und aus der Dampforgel ist eine echte Dixie-Band geworden: Banjo, Tuba, Trompete, Brush-Drums." },
    { seit: "2026-09-21T19:01",
      text: "👙 Beim BH reißt es zuerst, dann kommt das doppelte Pfeifen — kurz, dann länger — und es ist kürzer als vorher." },
    { seit: "2026-09-21T19:01",
      text: "🔥 Das Feuer sitzt bündig auf dem Ring. Gefunden: das Sprechfeld saß 3,84 px zu hoch, weil top in Prozent die HÖHE des Platzes zählt und dazu der Name gehört. Dazu lodern die Flammen jetzt in feinen Wellen, und die großen Rauchblasen außen sind weg." },
    { seit: "2026-09-21T19:01",
      text: "🦡 Das Maulwurfgeräusch klingt nicht mehr nach Klopfen (das alte war die Hüllkurve eines Schlags), und die Erdhaufen sind so breit wie ein Profilbild." },
  ],
};
