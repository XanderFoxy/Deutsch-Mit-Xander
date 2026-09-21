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
  stand: "Runde 41 — die restlichen Sprechbilder",

  inArbeit: [
    { seit: "2026-09-21T00:59",
      text: "Peitsche: Wellenform, die zur Spitze dünn ausläuft" },
    { seit: "2026-09-21T00:59",
      text: "Kopfhörer: Lied auswählen, aufgesetzt lassen" },
    { seit: "2026-09-21T00:59",
      text: "Lupe fürs Großzeigen, „alle“-Einträge im Platzmenü" },
    { seit: "2026-09-21T00:59",
      text: "Scheibenwischer und Flugzeug sehen noch nicht echt genug aus" },
    { seit: "2026-09-21T00:59",
      text: "Ankommen-Geräusch für lange Strecken, Fahrrad-Speichen beim gemeinsamen Fahren" },
    { seit: "2026-09-21T00:59", nurBetreiber: true,
      text: "Die VHS-Störung ist über die berechneten Werte geprüft, nicht an einem echten Foto — die Prüfbühne hat nur eine leere helle Scheibe" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T00:59",
      text: "Blut: fünf Tropfen laufen herunter und sammeln sich unten zu einer Lache" },
    { seit: "2026-09-21T00:59",
      text: "Eis: siebzehn echte Eiszapfen hängen jetzt außen am Rand" },
    { seit: "2026-09-21T00:59",
      text: "Spinne: ein einziger langer Abstieg über 26 Sekunden — je länger du am Stück sprichst, desto tiefer krabbelt sie; das Netz ist deutlich sichtbarer" },
    { seit: "2026-09-21T00:59",
      text: "Störung: die ORIGINAL-VHS-Störung ist zurück — sie springt (steps) statt zu gleiten, die Bänder wechseln seitlich die Farbe" },
    { seit: "2026-09-21T00:59",
      text: "Blasen: sie bleiben jetzt im Profilrahmen, statt weit darüber hinauszusteigen" },
  ],
};
