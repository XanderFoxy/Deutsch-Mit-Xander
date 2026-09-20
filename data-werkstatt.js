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
  stand: "Runde 28 — die Stimmdoppelung, die Endlosschleife und der Tonknopf",

  inArbeit: [
    { seit: "2026-09-20T20:07",
      text: "Strudel soll wirklich strudeln, das Zerknuellen wird ein eigener Effekt." },
    { seit: "2026-09-20T20:07",
      text: "BH auf jeden Platz, Pfeil mit Saugnapf vorn und Feder hinten, Scheibenwischer wie beim Auto, Fenster in drei Fassungen, Billard mit mehreren, Schneekugel, mehr Kruemel." },
    { seit: "2026-09-20T20:07",
      text: "Das Whiteboard." },
    { seit: "2026-09-20T20:07", nurBetreiber: true,
      text: "Fassung 370." },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-20T20:07",
      text: "GEFUNDEN: die Stimmdoppelung kam nicht von der Leitung. Jeder Strom lief ZWEIMAL — einmal ueber das Tonelement (eines je Konto) und ein zweites Mal ueber das Video am Platz, das bei allen anderen laut stand. Ab jetzt gilt: ein Bild macht keinen Ton. Jedes Video im Klassenzimmer ist stumm, immer." },
    { seit: "2026-09-20T20:07",
      text: "Das erklaert auch, warum die Doppelung nach einer Fahrt weg war: dabei wird die Sitzreihe neu gezeichnet und das Video verliert kurz seinen Strom." },
    { seit: "2026-09-20T20:07",
      text: "Lasso und Angel liefen in einer Endlosschleife: die ANIMATION schickte am Ende wieder /heb los, auf jedem Geraet. Eine Animation verschickt jetzt gar nichts mehr — das Umsetzen macht der Befehl, einmal." },
    { seit: "2026-09-20T20:07",
      text: "Der Tonknopf tut endlich etwas: er reisst jede Leitung ab und baut sie neu auf, ohne den Raum zu verlassen und ohne Neuladen. Er sagt danach, wie viele Leitungen neu stehen." },
    { seit: "2026-09-20T20:07",
      text: "Alle Zusatzfelder einer Zeile stehen jetzt in EINER Liste (ZUSATZ_FELDER). Bisher stand jedes Feld an drei Stellen einzeln, und das zuletzt dazugekommene fehlte jedes Mal — so sahen die anderen das Aufdecken nicht." },
    { seit: "2026-09-20T20:07",
      text: "Die Musik wird beim anderen nachgeholt: lehnt der Browser sie ab (Autoplay-Sperre), genuegt ein Tipp irgendwo auf der Seite, und eine Zeile sagt das auch." },
  ],
};
