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
  stand: "Fassung 671 – Zauber und Superkraft-Schüsse, die man spürt; beim Zaubern kein Nachhängen",

  inArbeit: [
    { seit: "2026-09-25T16:49",
      text: "Walkie #256" },
    { seit: "2026-09-25T16:49",
      text: "Runde 100/101 (Waschmaschine, Bagger, Hot Rod)" },
    { seit: "2026-09-25T16:49",
      text: "Funk 84/85 Zeichnungen und Funktionen" },
    { seit: "2026-09-25T16:49",
      text: "Angel, Lasso, Kran, Leiter, Lok, Pferd-Galopp" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-25T16:49",
      text: "671: Superkraft-Schuss knallt – lila Mündung, größere Kugel, Krater-Einschlag mit dumpfem Schlag" },
    { seit: "2026-09-25T16:49",
      text: "671: Zauber sofort beim Tippen – Zauberkreis, leuchtende Kugel fliegt, alle sehen es gleichzeitig" },
    { seit: "2026-09-25T16:49",
      text: "671: Zauber-Einschlag mit Lichtblitz, Wellen, leuchtendem Bildschirmrand; jeder Zauber mit eigener Zugabe" },
    { seit: "2026-09-25T16:49",
      text: "670: Einhorn mit Regenbogenstrahl, jedes gekaufte Tier mit eigenem Effekt" },
  ],
};
