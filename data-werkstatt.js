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
  stand: "Runde 19d — Zensur sichtbar, Fokus bleibt, Titel bleibt",

  inArbeit: [
    { seit: "2026-09-18T20:05",
      text: "Emmy hoert die Sprachnachrichten nicht gut — muss auf beiden Seiten geprueft werden" },
    { seit: "2026-09-18T20:05",
      text: "Rueckruf einer Sprachnachricht wieder rueckgaengig machen, solange sie noch ungehoert ist" },
    { seit: "2026-09-18T20:05",
      text: "Buehnenansicht: wer oben ist, sieht nur die anderen oben" },
    { seit: "2026-09-18T20:05",
      text: "Befehlserklaerungen auf dem Telefon sichtbar machen" },
    { seit: "2026-09-18T20:05",
      text: "Favoriten im Befehlspanel selbst anheften" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-18T20:05",
      text: "Zensuren stehen jetzt wirklich im Chat — sie waren durchsichtig, weil die Musik-Animation ihre Noten genauso genannt hat" },
    { seit: "2026-09-18T20:05",
      text: "Der Fokus-Schalter ist immer da, auch wenn gerade niemand spricht" },
    { seit: "2026-09-18T20:05",
      text: "Der Raumtitel ueberlebt das Neuladen — er liegt jetzt je Raum im Geraet" },
    { seit: "2026-09-18T20:05",
      text: "Beim Schreien werden Fuchs-Marken gezeichnet statt mitgebruellt (das waren die Klammern)" },
    { seit: "2026-09-18T20:05",
      text: "Keine spitzen Klammern mehr in der Befehlshilfe — und wer sie doch tippt, dem werden sie verziehen" },
  ],
};
