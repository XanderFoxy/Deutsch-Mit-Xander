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
  stand: "Fassung 355 — das Sprechbild laesst sich wirklich einstellen",

  inArbeit: [
    { seit: "2026-09-20T01:01",
      text: "Galgenmaennchen: reihum spielen und benoten" },
    { seit: "2026-09-20T01:01",
      text: "Weitere Effekte aus der Wunschliste (Bowling, DJ-Schallplatte, Ohrfeige, Kopfhoerer, Blut und Spinnweben)" },
    { seit: "2026-09-20T01:01",
      text: "Nachmessen, ob bei einem Gespraech wirklich ZWEI Geraete in turn_nutzung stehen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-20T01:01",
      text: "Das Sprechbild wird jetzt wirklich gesetzt — der alte Zuhoerer raeumte das neue Menue weg, bevor der Klick ankam" },
    { seit: "2026-09-20T01:01",
      text: "Alle Kacheln sind gleich breit: 0 px Unterschied statt langer Rechtecke links" },
    { seit: "2026-09-20T01:01",
      text: "Ein kurzer Tipp auf ein Profilbild zieht nichts mehr gross auf" },
    { seit: "2026-09-20T01:01",
      text: "Das grosse Bild steht jetzt im Menue unter „Gross zeigen“" },
    { seit: "2026-09-20T01:01",
      text: "„Woanders hinsetzen“ heisst jetzt „Holen“ — und die erste Kachel sagt, womit: Angeln nach oben, Lasso zur Seite" },
  ],
};
