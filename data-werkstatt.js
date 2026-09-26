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
  stand: "Fassung 707: Funk 146 – Schatz sofort, Eier springen nicht, langer Druck ohne An-Aus, schnelles Ernten, 8 Angeln, Taschen im Menü",

  inArbeit: [
    { seit: "2026-09-26T18:26",
      text: "Funk 150: Dorf realistischer – Texturen, Figuren, Vögel, Wetter mit Wirkung auf die Ernte, Tag/Nacht, Geräusche nur im Dorf, Kompass mit Symbolen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-26T18:26",
      text: "Schatz: Inhalt sofort, kein Deutsch-Fenster; Leisten-Knopf sammelt ein" },
    { seit: "2026-09-26T18:26",
      text: "Eier: jedes für sich, kein Ersatz-Ei, Fundstück meidet Eier" },
    { seit: "2026-09-26T18:26",
      text: "Langer Druck zählt einmal, vorgewähltes Werkzeug (Schaufel)" },
    { seit: "2026-09-26T18:26",
      text: "Ernten/Holzen in einer Schlange, Server 0,25 s statt 1,5 s" },
    { seit: "2026-09-26T18:26",
      text: "Angel je Teich (12 s), alle Teiche gleichzeitig" },
    { seit: "2026-09-26T18:26",
      text: "Taschen im Waffen-Menü groß: ◀ ▶, + Tasche, − Tasche" },
  ],
};
