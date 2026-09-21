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
  stand: "Runde 71 — die Zeichnungen, dritter Teil (Fassung 416)",

  inArbeit: [
    { seit: "2026-09-21T14:46",
      text: "Kopfhörer: flacher nach aussen, dünner Schaum" },
    { seit: "2026-09-21T14:46",
      text: "Lok: die goldenen Teile oben, tieferes Schwarz mit Licht und Schatten" },
    { seit: "2026-09-21T14:46",
      text: "Katapult: die Animation muss zum neuen Ton passen — das Aufziehen in der Schale fehlt" },
    { seit: "2026-09-21T14:46",
      text: "Bombe: die zwei Fassungen (Zeitzünder / Lunte) sind noch nicht auswählbar — Lunte und Explosion liegen bereit" },
    { seit: "2026-09-21T14:46",
      text: "Bienen lassen Reste am alten Platz; Münze und Bowling brauchen noch die Physik" },
    { seit: "2026-09-21T14:46", nurBetreiber: true,
      text: "Der Spiegelstreifen im Tor ist im Messbild weiterhin nicht nachzuweisen" },
    { seit: "2026-09-21T14:46", nurBetreiber: true,
      text: "Zwei Tutorfilme (ueber-03b, ueber-05) brauchen mehr ElevenLabs-Guthaben" },
    { seit: "2026-09-21T14:46", nurBetreiber: true,
      text: "16 Supabase-Tabellen ohne RLS, darunter profiles und private_messages" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T14:46",
      text: "Das Pferd ist ein Pony geworden. Gerechnet, nicht geraten: die Beine waren 29 Einheiten lang bei 33 Rumpfhöhe — jetzt 20 bei 35. Dazu kurzer dicker Hals, größerer runder Kopf, runde Ohren und viel mehr Mähne und Schweif" },
    { seit: "2026-09-21T14:46",
      text: "Der Reiter sass in der Luft über dem Pony — der Sattel ist mit dem Rumpf nach unten gewandert, der Reiter stand noch auf der alten Höhe" },
    { seit: "2026-09-21T14:46",
      text: "Das Flugzeug hat jetzt Kabinenfenster, eine Cockpitscheibe, Türlinien, einen Zierstreifen, ein zweites Triebwerk und Fahrwerk mit Rädern" },
    { seit: "2026-09-21T14:46",
      text: "Das Profilbild auf dem Flugzeug war 62 Prozent hoch — der Rumpf, in dem es sitzen sollte, ist nur 38 Prozent hoch. Es war also größer als der Rumpf. Jetzt ist es genauso gross wie sein Lukenring" },
    { seit: "2026-09-21T14:46",
      text: "Maulwurfshügel: das Loch greift über den Bildrand (128 statt 100 Prozent), die Dreckspur ist anderthalbmal so breit" },
    { seit: "2026-09-21T14:46",
      text: "Die gestrichelte Linie des freien Platzes wird wirklich aufgegraben: sie wird erdbraun, bricht auf und wackelt, solange der Maulwurf darunter arbeitet — und der Platz sackt kurz ein" },
    { seit: "2026-09-21T14:46",
      text: "pruefe-runde51.js stand seit Runde 67 auf Rot: sie hielt das alte Sog-Portal fest, das du selbst abbestellt hast. Nachgezogen auf das heutige Tor — und genauso streng" },
    { seit: "2026-09-21T14:46",
      text: "pruefe-runde71.js: 41 Regeln, alle grün. Alle 13 Rundenprüfungen und die Animationsbühne laufen durch" },
  ],
};
