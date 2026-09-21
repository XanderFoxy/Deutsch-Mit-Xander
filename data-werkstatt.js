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
  stand: "Runde 71 — Bombe, Kopfhörer und Lok (Fassung 417)",

  inArbeit: [
    { seit: "2026-09-21T14:52",
      text: "Katapult: die Animation muss zum neuen Ton passen — das Aufziehen in der Schale fehlt" },
    { seit: "2026-09-21T14:52",
      text: "Bienen lassen Reste am alten Platz" },
    { seit: "2026-09-21T14:52",
      text: "Münze: die Drehung stottert noch, sie soll kontinuierlich drehen und sich langsam scheppernd sammeln" },
    { seit: "2026-09-21T14:52",
      text: "Bowling: die Physik fehlt noch, das Knallen sieht nicht echt aus" },
    { seit: "2026-09-21T14:52",
      text: "Strudel: der Ton stimmt jetzt, der Swirl im Bild fehlt noch" },
    { seit: "2026-09-21T14:52", nurBetreiber: true,
      text: "Der Spiegelstreifen im Tor ist im Messbild weiterhin nicht nachzuweisen" },
    { seit: "2026-09-21T14:52", nurBetreiber: true,
      text: "Zwei Tutorfilme (ueber-03b, ueber-05) brauchen mehr ElevenLabs-Guthaben" },
    { seit: "2026-09-21T14:52", nurBetreiber: true,
      text: "16 Supabase-Tabellen ohne RLS, darunter profiles und private_messages" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T14:52",
      text: "Die Bombe hat jetzt zwei Fassungen zum Auswählen: Zeitzünder und Lunte, beide unter einer Kachel. Als Befehl gab es beide längst, die Kachel kannte nur die digitale" },
    { seit: "2026-09-21T14:52",
      text: "Die Zündschnur prasselt von Anfang an, das Piepsen kommt nur noch 600 ms vor der Null, und am Ende knallt eine echte Explosion statt weiterzupiepsen" },
    { seit: "2026-09-21T14:52",
      text: "Die Asche war zu schmal — nicht wegen der Grenzen, sondern wegen der Verteilung: die Summe dreier Zufallszahlen häuft sich um die Mitte. Die Glocke ist jetzt um das 1,9fache gedehnt, der Haufen reicht von Rand zu Rand" },
    { seit: "2026-09-21T14:52",
      text: "Die Kopfhörer sind flach: die Muschel war 30 von 148 Einheiten breit, also 30 Prozent des Profilbilds je Seite. Jetzt 20 — eine flache Platte statt eines Klotzes. Bügel, Gelenke und Krone sind mitgewandert" },
    { seit: "2026-09-21T14:52",
      text: "Die Lok ist schwarz statt blaugrau, mit einem hellen Streifen oben und einem dunklen unten — und die goldenen Teile sitzen oben auf dem Körper: Messingbänder, Domsockel, zwei Handläufe mit Stützen, Pfeife und Griff" },
    { seit: "2026-09-21T14:52",
      text: "Die alten Lokfarben sind an ihrer Stelle ersetzt, nicht weiter unten überschrieben — sonst behauptet eine Prüfung Grünes über Blaues" },
    { seit: "2026-09-21T14:52",
      text: "pruefe-runde71.js: 52 Regeln, alle grün. Alle 13 Rundenprüfungen und die Animationsbühne laufen durch" },
  ],
};
