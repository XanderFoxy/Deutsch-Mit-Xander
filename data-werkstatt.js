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
  stand: "Fassung 349 — eine Zunge, ein Hammerschlag, Ducking und eine Lok weniger",

  inArbeit: [
    { seit: "2026-09-19T23:21",
      text: "Sprecheffekte auf den Rahmen umstellen (Regenbogenring, Feuerring, Eis, Magie am Rand, Noten)" },
    { seit: "2026-09-19T23:21",
      text: "Galgenmaennchen: reihum spielen und benoten" },
    { seit: "2026-09-19T23:21",
      text: "Fokus-Schalter nur fuer den Betreiber, automatische Sperre beim Kontingent" },
    { seit: "2026-09-19T23:21",
      text: "Sprechbild der anderen wird nicht uebertragen" },
    { seit: "2026-09-19T23:21",
      text: "Haken/Lasso: jemanden wirklich zu sich ziehen" },
    { seit: "2026-09-19T23:21",
      text: "Neue Effekte aus der Wunschliste (Bumerang, Schneeball, Pfeil und Bogen, Bowling, Strudel …)" },
    { seit: "2026-09-19T23:21",
      text: "Nachmessen, ob bei einem Gespraech wirklich ZWEI Geraete in turn_nutzung stehen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-19T23:21",
      text: "Beim Lecken ist nur noch EINE Zunge unterwegs — die lange Chamaeleonzunge" },
    { seit: "2026-09-19T23:21",
      text: "Der Hammer schlaegt einmal, genau dann, wenn es knallt" },
    { seit: "2026-09-19T23:21",
      text: "Der Wassereimer steht wirklich ueber dem Kopf und giesst von dort herunter" },
    { seit: "2026-09-19T23:21",
      text: "Die Boxhandschuhe finden ihre Richtung jetzt immer — vorher fielen sie meist auf links und rechts zurueck" },
    { seit: "2026-09-19T23:21",
      text: "Ducking: solange jemand spricht, laufen die Effektgeraeusche auf einem Drittel" },
    { seit: "2026-09-19T23:21",
      text: "Jedes Geraeusch hat jetzt seine eigene Lautstaerke — Regen leiser, Hammer lauter" },
    { seit: "2026-09-19T23:21",
      text: "Die schwarze Lokomotive ist heraus (1,84 MB gespart), die bunte heisst jetzt richtig Dampflok" },
    { seit: "2026-09-19T23:21",
      text: "/kino als Zweitname fuer /film ist heraus" },
  ],
};
