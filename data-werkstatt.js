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
  stand: "Runde 26 — kein Zwang, mehr Platz, Woerterbuch",

  inArbeit: [
    { seit: "2026-09-17T17:20",
      text: "Wolken: harte Kanten, sichtbare Wiederholung, echtes Zerlaufen." },
    { seit: "2026-09-17T17:20",
      text: "Himmelfarbe: Uebergang zur Nacht dezent statt zu frueh dunkel." },
    { seit: "2026-09-17T17:20",
      text: "Umarmung neu zeichnen." },
    { seit: "2026-09-17T17:20",
      text: "Eigene Bildsammlung: transparente PNG und GIF." },
    { seit: "2026-09-17T17:20",
      text: "Spiele: nur freigegebene sichtbar, Freundesliste eingeklappt." },
    { seit: "2026-09-17T17:20",
      text: "Bilderraetsel: Figuren stehen und sitzen physikalisch falsch." },
    { seit: "2026-09-17T17:20",
      text: "Online-Anzeige: Flagge nach Land, besseres Klassenzimmer-Zeichen." },
    { seit: "2026-09-17T17:20", nurBetreiber: true,
      text: "A1 mit deiner Stimme ueber ElevenLabs." },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-17T17:20",
      text: "KAMERA IST KEIN ZWANG MEHR. Der Satz mit Deutschland und Aegypten ist weg. Beide Wege stehen gleichberechtigt nebeneinander: mit Ton und Bild, oder nur mit Ton. Niemand wird gesperrt." },
    { seit: "2026-09-17T17:20",
      text: "Beim Betreten wird nachgefasst: hoert man nach zwei Sekunden niemanden, obwohl jemand da ist, geht der Gruss noch einmal hinaus. Damit ist man wirklich synchron, wenn man hereinkommt." },
    { seit: "2026-09-17T17:20",
      text: "Klassenzimmer auf schmalem Android gemessen und verdichtet: Hoehe 983 auf 774 Pixel, Inhaltsbreite 262 auf 310. Einladungslink klappt sich weg, Raeume-Symbol steht jetzt bei den Befehlen." },
    { seit: "2026-09-17T17:20",
      text: "Das Panel springt 5 mm hoeher, damit die Eingabeleiste bequem zu treffen ist." },
    { seit: "2026-09-17T17:20",
      text: "45 erfundene Woerter aus dem Woerterbuch entfernt, darunter der Eckenerum, das Gefroreis, der Papstee. Kein gutes Wort verloren: Backofentuer, Farbpapier und wehren stehen noch drin." },
    { seit: "2026-09-17T17:20",
      text: "Der Aussprache-Trainer spricht keine maschinell erzeugten Eintraege mehr vor — das spart Credits fuer das, was wirklich zaehlt." },
  ],
};
