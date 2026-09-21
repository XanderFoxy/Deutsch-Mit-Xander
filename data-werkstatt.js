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
  stand: "Runde 65b — drei Tutorfilme neu auf Greenscreen, sauber freigestellt",

  inArbeit: [
    { seit: "2026-09-21T07:45",
      text: "Tor als stehende Wasserwand mit Partikeln und Plasma" },
    { seit: "2026-09-21T07:45",
      text: "Peitsche: echter gewickelter Griff, und eine mehrschwaenzige fuer alle auf einmal" },
    { seit: "2026-09-21T07:45",
      text: "Billard-Prallphysik" },
    { seit: "2026-09-21T07:45",
      text: "Rohrreise: der Reisende ist auf beiden Seiten gleichzeitig zu sehen" },
    { seit: "2026-09-21T07:45",
      text: "Effekte fuer ALLE gleichzeitig - umarmen, kuessen, treten, Bombe" },
    { seit: "2026-09-21T07:45",
      text: "Helikopter braucht noch mehr Details" },
    { seit: "2026-09-21T07:45",
      text: "Whiteboard neu denken, alles ins Profil speichern statt lokal" },
    { seit: "2026-09-21T07:45", nurBetreiber: true,
      text: "GUTHABEN NOETIG: ueber-04b, ueber-03b und ueber-05 fehlen noch auf Greenscreen. Das ElevenLabs-Guthaben ist alle - zuletzt 14.152 von 19.439 noetigen Credits. Die drei behalten bis dahin ihre alten Fassungen." },
    { seit: "2026-09-21T07:45", nurBetreiber: true,
      text: "Was die Filme wirklich gekostet haben: 53 + 171 + 260 Cent = 4,84 $ fuer drei. Die vier Fehlversuche mit m4a wurden zurueckgebucht - OmniHuman nimmt nur wav und mp3, das war die Ursache, nicht das Guthaben." },
    { seit: "2026-09-21T07:45", nurBetreiber: true,
      text: "Zwei Saetze neu einsprechen: „Schoen, dass du da bist! Ich bin Alex — Musiker und deutscher Muttersprachler. Ich helfe dir gerne mit Deutsch.\"" },
    { seit: "2026-09-21T07:45", nurBetreiber: true,
      text: "Und: „Oben stehen drei Knoepfe: der Kalender, dein Profilbild, die Kaffeetasse. Im Kalender loest du jeden Tag eine Aufgabe und kommst von da zur Tagesgeschichte — eine Leseuebung in jedem Niveau und in vielen Sprachen.\"" },
    { seit: "2026-09-21T07:45", nurBetreiber: true,
      text: "Frage: die Kompass-Erklaerung im Tutor ist mit 148 Woertern die laengste. Kuerzen — oder so lassen?" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T07:45",
      text: "lern-09, ueber-02b und ueber-04 sind auf Greenscreen neu erzeugt und freigestellt" },
    { seit: "2026-09-21T07:45",
      text: "GEMESSEN an je einem Einzelbild: 1 zusammenhaengendes Teil (vorher 180 bis 247) und NULL Loecher im Koerper" },
    { seit: "2026-09-21T07:45",
      text: "Die Figur ist 623 bzw. 616 Pixel hoch - das Standbild verlangt 623,8. Also ohne Nachskalieren passgenau" },
    { seit: "2026-09-21T07:45",
      text: "Im Werkzeug steckten zwei geratene Zahlen, der Gruen-Zweig war nie gelaufen: die Schluesselfarbe stand auf Lehrbuch-Gruen 0x00b140, gemessen am Rohfilm ist sie #05a940" },
    { seit: "2026-09-21T07:45",
      text: "Und die Toleranz stand auf 0,30. Durchgemessen von 0,02 bis 0,16: bei 0,30 blieben 8 deckende Bildpunkte von 228.960 uebrig - der Schluessel nahm die ganze Figur mit. Jetzt 0,14" },
    { seit: "2026-09-21T07:45",
      text: "Dritter Fehler: ein format=rgba VOR dem Schluessel. chromakey rechnet in YUV; mit der Umrechnung davor trifft er nicht mehr, was er treffen soll" },
  ],
};
