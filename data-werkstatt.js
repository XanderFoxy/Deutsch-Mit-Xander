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
  stand: "Runde 71 — Münze und Strudel (Fassung 418)",

  inArbeit: [
    { seit: "2026-09-21T14:57", nurBetreiber: true,
      text: "Bienen: ich finde in der ganzen App keinen Bienen-Effekt. Sag mir bitte, welcher Befehl das ist — dann sehe ich mir die Rückstände an" },
    { seit: "2026-09-21T14:57",
      text: "Katapult: die Animation muss zum neuen Ton passen — das Aufziehen in der Schale fehlt" },
    { seit: "2026-09-21T14:57",
      text: "Bowling: die Physik fehlt noch, das Knallen sieht nicht echt aus" },
    { seit: "2026-09-21T14:57", nurBetreiber: true,
      text: "Der Spiegelstreifen im Tor ist im Messbild weiterhin nicht nachzuweisen" },
    { seit: "2026-09-21T14:57", nurBetreiber: true,
      text: "Zwei Tutorfilme (ueber-03b, ueber-05) brauchen mehr ElevenLabs-Guthaben" },
    { seit: "2026-09-21T14:57", nurBetreiber: true,
      text: "16 Supabase-Tabellen ohne RLS, darunter profiles und private_messages" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T14:57",
      text: "Die Münze stotterte, weil über der ganzen Animation eine Kurve lag — dieselbe Falle wie beim Sprungturm in Runde 65. Eine Kurve über die ganze Animation dehnt die Abstände ZWISCHEN den Schlüsselbildern, und an jeder Bildgrenze sprang die Drehzahl" },
    { seit: "2026-09-21T14:57",
      text: "Jetzt läuft sie linear, und die Verzögerung steht in den Werten: gleichmässig gebremste Drehung, alle 8 Prozent ein Bild. Bei 74 Prozent steht sie, kippt um und scheppert aus — jeder Ausschlag kleiner als der vorige" },
    { seit: "2026-09-21T14:57",
      text: "Der Strudel hatte die ganze Zeit einen Swirl, man konnte ihn nur nicht sehen: die Spiralarme sind achtzählig symmetrisch, und ein achtzähliges Muster sieht nach 45 Grad Drehung wieder genauso aus. Jetzt laufen zwei helle Sektoren mit — einer steht genau einmal im Kreis, also ist seine Wanderung unübersehbar" },
    { seit: "2026-09-21T14:57",
      text: "Und er unterbricht nicht mehr: die Karte drehte sich eine GANZE Umdrehung und schrumpfte auf die Hälfte, sechs Sekunden lang. Jetzt 26 Grad, 86 Prozent, 4,2 Sekunden — der Sog bleibt, der Raum bleibt lesbar" },
    { seit: "2026-09-21T14:57",
      text: "pruefe-runde71.js: 62 Regeln, alle grün. Alle 13 Rundenprüfungen und die Animationsbühne laufen durch" },
  ],
};
