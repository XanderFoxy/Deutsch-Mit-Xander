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
  stand: "Runde 85, erster Teil: keine Rueckstaende, die Lok auf Gleisen, Pac-Man im Original",

  inArbeit: [
    { seit: "2026-09-22T10:06",
      text: "Der Rest von Xanders Liste vom 22.9.: Popo beim Klaps, Adlerschwingen, Frosch-Richtung, Zylinder als Profilbild-Effekt, Schneekugel, Fahrstuhl als Reise, Licht/Birne beim zweiten Antippen, Augen beim Scrollen, Kopfhoerer-Menue, Markierung auf Links, Es war einmal in Deutschland" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T10:06",
      text: "KEINE RUECKSTAENDE MEHR AM VERLASSENEN PLATZ. Der Name ist waehrend der Reise weg — er stand vorher bei JEDER Reise noch da. Und die Blende des Profilbilds lief ueber 16 Prozent der ganzen Reise, also je nach Reise 679 bis 779 ms; GEMESSEN stand das Bild nach einer Sekunde noch bei Deckkraft 0,57 (Feder) und 0,70 (Kran) und war halb geschrumpft. Jetzt 220 ms fest, danach haelt eine eigene Klasse es weg. Bei allen acht geprueften Reisen ist nach einer Sekunde nichts mehr zu sehen." },
    { seit: "2026-09-22T10:06",
      text: "DIE LOK FAEHRT WIEDER ZUM ZIEL, nicht mehr im Kreis — und zwar ueber die Sitzfelder, auf Gleisen mit Schwellen. Beim Reihenwechsel traegt sie eine SCHIEBEBUEHNE: eine Lok, die sich um 90 Grad kippt, gibt es nicht, eine Schiebebuehne in jedem Betriebswerk. GEMESSEN: Weg 362 px gegen 295 px Luftlinie, groesster Abstand zu den ueberfahrenen Feldern 2,3 px. Der Schrei kommt nur noch, wenn im Augenblick des Ueberfahrens wirklich jemand dort sitzt." },
    { seit: "2026-09-22T10:06",
      text: "PAC-MAN WIE IM ORIGINAL. Das Maul springt in die Fahrtrichtung statt sich weich mitzudrehen (nur noch 0 und 90 Grad, keine Zwischenwinkel). Der Rueckweg ist derselbe Weg rueckwaerts — vorher schnitt er quer ueber alle Felder. Das ganze Feld liegt voller Punkte (18, davon 15 bleiben liegen). Und der gelbe Leuchtring ist weg: kein Rand, kein Schein, kein Name — in dem Moment IST man Pac-Man." },
    { seit: "2026-09-22T10:06",
      text: "DREI GERAEUSCHE. Neues ton/schritt (Ferse, dann Ballen, 0,26 s) fuers Laufen — vorher klang je Feld ein Comic-Boing, und zwar derselbe, den auch das Los benutzte. Das Fahrgeraeusch dauert jetzt so lange wie die Fahrt (fahrt.opus ist 1,00 s, die Fahrt ein Vielfaches). Und das Los klingt nach Slotmaschine mit Klingeln bei jedem Sprung." },
  ],
};
