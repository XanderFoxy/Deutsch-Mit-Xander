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
  stand: "Fassung 675 – Spielpunkte im Ranking; jetzt: Waffen verkaufen, Rüstung sichtbar, dann Felder/Bäckerei/Markt",

  inArbeit: [
    { seit: "2026-09-25T18:08",
      text: "Waffen und Sachen verkaufen, Rüstung sichtbar angelegt" },
    { seit: "2026-09-25T18:08",
      text: "Felder mit Sense, Getreide, Bäckerei backt, Verarbeitung über Zeit, Markt" },
    { seit: "2026-09-25T18:08",
      text: "Latenz weiter senken" },
    { seit: "2026-09-25T18:08",
      text: "Funk 84/85 Rest (Mario-Röhren, Lok-Schranke, Hot-Rod-Weg, Feuerwerk, Monstertruck, Einzug, Knöpfe)" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-25T18:08",
      text: "675: Alles, was du im Klassenzimmer-Spiel verdienst, zählt im Ranking (Heute, Gesamt, Fuchs des Tages)" },
    { seit: "2026-09-25T18:08",
      text: "675: Alte Spielpunkte nachgebucht – dein Profil: 5831 → 11121" },
    { seit: "2026-09-25T18:08",
      text: "675: Tower Defense und Rundenkampf geben Lohn (aus richtigen Antworten)" },
    { seit: "2026-09-25T18:08",
      text: "673: Wassergraben nur einmal; Deutsch-Fenster kompakt, Fundstück oben und in der Leiste, Tipp daneben schließt" },
  ],
};
