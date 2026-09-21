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
  stand: "Runde 56 - zwoelf neue Geraeusche und der Mund beim Kuss",

  inArbeit: [
    { seit: "2026-09-21T03:17",
      text: "Fahrzeuge: Raddampfer vom Mississippi, Helikopter, Pferd, Lok fahren falsch herum oder sind zu grob" },
    { seit: "2026-09-21T03:17",
      text: "Pfeil mit echter Feder und Saugnapf, Cowboyhut, AirPods Max filigran" },
    { seit: "2026-09-21T03:17",
      text: "Birne auf der waagerechten Achse ein- und ausdrehen, mit Stromausfall beim Herausdrehen" },
    { seit: "2026-09-21T03:17",
      text: "Whiteboard neu denken: Plaetze und Chat behalten, Texte laden, alles speicherbar" },
    { seit: "2026-09-21T03:17",
      text: "Alles ins Profil speichern statt lokal - Effekte, Favoriten, Giphy-Bilder" },
    { seit: "2026-09-21T03:17",
      text: "Regentropfen feiner und natuerlicher, Nachthimmel-Symbol stimmt nicht immer" },
    { seit: "2026-09-21T03:17",
      text: "Billard-Prallphysik, Bowling mit mehreren Kegeln je Person" },
    { seit: "2026-09-21T03:17",
      text: "Musik kommt beim anderen nicht an" },
    { seit: "2026-09-21T03:17", nurBetreiber: true,
      text: "Tutorvideo mit Greenscreen neu aufnehmen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T03:17",
      text: "Der Kuss hatte ein HERZ statt eines Mundes - jetzt zwei Lippen mit Amorbogen, Teilung und Glanz" },
    { seit: "2026-09-21T03:17",
      text: "Strudel: neue Aufnahme, 5 s, nahtlos in der Schleife" },
    { seit: "2026-09-21T03:17",
      text: "Basketball: der Korbrand scheppert, wenn der Ball zirkuliert" },
    { seit: "2026-09-21T03:17",
      text: "Tennis: Wurf, Luftzug, Schlag - ein Ablauf in einer Aufnahme" },
    { seit: "2026-09-21T03:17",
      text: "Katapult, Wassereimer, Bumerang: neue, realistische Aufnahmen" },
    { seit: "2026-09-21T03:17",
      text: "Schneekugel: schuetteln, dann sieben Sekunden weihnachtliches Glissando" },
    { seit: "2026-09-21T03:17",
      text: "Licht aus: die Gruselgeige lag seit Runde 21 ungenutzt im Ordner - jetzt klingt sie" },
    { seit: "2026-09-21T03:17",
      text: "Umarmung: ein wohliger Seufzer nach dem Zufassen" },
    { seit: "2026-09-21T03:17",
      text: "Rohrreise: drei pulsierende Chiptune-Impulse mit Hall, wie frueher" },
    { seit: "2026-09-21T03:17",
      text: "Bombe: /bombe zaehlt digital herunter, /lunte brennt eine Zuendschnur ab - eigene Toene" },
  ],
};
