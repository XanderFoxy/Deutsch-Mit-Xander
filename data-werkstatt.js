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
  stand: "Fassung 747 — Rundenkampf: Konter nach Leben, Ausdauer-EP, Niveau vorher (Funk 178)",

  inArbeit: [
    { seit: "2026-09-27T08:10",
      text: "Aufgabenbank durchsehen – „viel Quatsch dabei“ (Funk 178)" },
    { seit: "2026-09-27T08:10",
      text: "Postfach Schritt für Schritt – Fragen stehen im Walkie (295–298)" },
    { seit: "2026-09-27T08:10",
      text: "Dorf: Werkzeug-Knöpfe mit Bäumen/Tieren/Erz auf den Plätzen (Funk 178)" },
    { seit: "2026-09-27T08:10",
      text: "Mehrere Charaktere (Walkie 290/292)" },
    { seit: "2026-09-27T08:10",
      text: "Weihnachts-Paket (Schalter im Server schon da)" },
    { seit: "2026-09-27T08:10",
      text: "Modulares Dorf, Verteidigung/Kaserne, Verträge – wartet auf Antworten zu den 15 Fragen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-27T08:10",
      text: "Konter wird mit sinkendem Leben schwächer (Anzeige „Konter 25 %“)" },
    { seit: "2026-09-27T08:10",
      text: "Ausdauer-Erfahrung für lange Kämpfe (bis 25 EP)" },
    { seit: "2026-09-27T08:10",
      text: "Niveau und Fragen-Art vor Rundenkampf und Fehlerteufel-Abwehr wählen" },
    { seit: "2026-09-27T08:10",
      text: "Postfach: altes Design und alte Knöpfe zurück" },
  ],
};
