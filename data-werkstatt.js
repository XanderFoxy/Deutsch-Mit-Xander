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
  stand: "Runde 40 — Sanduhr zerrinnt, Umarmung mit kräftigen Armen",

  inArbeit: [
    { seit: "2026-09-21T00:51",
      text: "Peitsche: Wellenform, die zur Spitze dünn ausläuft" },
    { seit: "2026-09-21T00:51",
      text: "Kopfhörer: Lied auswählen, aufgesetzt lassen" },
    { seit: "2026-09-21T00:51",
      text: "Lupe fürs Großzeigen, „alle“-Einträge im Platzmenü" },
    { seit: "2026-09-21T00:51",
      text: "Sprechbilder: Störung (alte VHS-Animation), Blasen, Eis, Blut, Spinnweben" },
    { seit: "2026-09-21T00:51",
      text: "Scheibenwischer und Flugzeug sehen noch nicht echt genug aus" },
    { seit: "2026-09-21T00:51",
      text: "Ankommen-Geräusch für lange Strecken, Fahrrad-Speichen beim gemeinsamen Fahren" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T00:51",
      text: "Sanduhr: das Bild zerrinnt jetzt mit einer körnigen Sandkante, die Körner fallen und sammeln sich unten zu einem Haufen" },
    { seit: "2026-09-21T00:51",
      text: "Vorher lief eine gerade waagerechte Kante über das Bild — das sah aus wie ein Rollo" },
    { seit: "2026-09-21T00:51",
      text: "Umarmung: die Arme sind noch einmal kräftiger (21 statt 15 von 120 an der Schulter)" },
    { seit: "2026-09-21T00:51",
      text: "Wer jemanden NENNT, umarmt auch nur den — vorher wurden bei einem nicht gefundenen Namen alle mitgedrückt" },
  ],
};
