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
  stand: "Runde 71 — die Zeichnungen, zweiter Teil (Fassung 415)",

  inArbeit: [
    { seit: "2026-09-21T14:40",
      text: "Pferd: noch nicht niedlicher/ponyartig" },
    { seit: "2026-09-21T14:40",
      text: "Flugzeug, Lok, Maulwurfshügel, Kopfhörer: Zeichnungen noch offen" },
    { seit: "2026-09-21T14:40",
      text: "Katapult: die Animation muss zum neuen Ton passen — das Aufziehen in der Schale fehlt" },
    { seit: "2026-09-21T14:40",
      text: "Bombe: die zwei Fassungen (Zeitzünder / Lunte) sind noch nicht auswählbar — Lunte und Explosion liegen bereit" },
    { seit: "2026-09-21T14:40",
      text: "Bienen lassen Reste am alten Platz; Münze und Bowling brauchen noch die Physik" },
    { seit: "2026-09-21T14:40", nurBetreiber: true,
      text: "Der Spiegelstreifen im Tor ist im Messbild weiterhin nicht nachzuweisen" },
    { seit: "2026-09-21T14:40", nurBetreiber: true,
      text: "Zwei Tutorfilme (ueber-03b, ueber-05) brauchen mehr ElevenLabs-Guthaben" },
    { seit: "2026-09-21T14:40", nurBetreiber: true,
      text: "16 Supabase-Tabellen ohne RLS, darunter profiles und private_messages" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T14:40",
      text: "3-Meter-Turm: der Turm blendete zwischen 1500 und 1900 ms aus — der Absprung ist bei 1420 ms, der Einschlag bei 2730 ms. Er blendete also mitten im Flug weg. Jetzt steht er, bis das Wasser spritzt" },
    { seit: "2026-09-21T14:40",
      text: "Das Sprungbrett ist länger: 48 statt 39 Einheiten, der Überhang über die Leiter wächst von 22 auf 31 — und es federt beim Anlauf" },
    { seit: "2026-09-21T14:40",
      text: "Rohrreise: das Bild glitt über die Röhre, weil der reisende Platz z-index 7 bekommt und die Röhre nur 4 hatte. Die Einstiegsröhre steht jetzt mit 8 davor und verschluckt wirklich" },
    { seit: "2026-09-21T14:40",
      text: "Am Ziel stand im Kommentar „unter der Röhre\", im Wert stand darüber (5 gegen 4). Jetzt 3 — das zweite Bild steigt wirklich aus der Röhre heraus" },
    { seit: "2026-09-21T14:40",
      text: "Der dünne grüne Ring am ankommenden Profilbild ist weg" },
    { seit: "2026-09-21T14:40",
      text: "Greifvogel: die Beine spreizten sich nach unten auseinander (79→76 und 91→94). Jetzt fast senkrecht und dicht beieinander — und die Fänge packen beim Aufnehmen sichtbar zu" },
    { seit: "2026-09-21T14:40",
      text: "Helikopter: die Zelle war 85 lang und 26 hoch, also 3,3 : 1. Jetzt 72 zu 32, also 2,3 : 1 — kürzer und oben dicker" },
    { seit: "2026-09-21T14:40",
      text: "Helikopter: das Spielzeugblau ist weg, dafür ein fast schwarzes Blaugrau mit einem hellen Streifen oben und einem dunklen Bauch. Das Profilbild sitzt als hochkantes Fenster in der Kanzel" },
    { seit: "2026-09-21T14:40",
      text: "Die Prüfung aus Runde 66 hat gemeldet, dass der Rotor nach dem Umbau über seinem Mast schwebte — 14,29 Prozent gegen die neuen 10,71. Nachgezogen" },
    { seit: "2026-09-21T14:40",
      text: "pruefe-runde71.js: 27 Regeln, alle grün" },
  ],
};
