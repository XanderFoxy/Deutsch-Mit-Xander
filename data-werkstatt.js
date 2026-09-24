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
  stand: "Fassung 607: Flugzeug oben wie von der Seite, Adler passt auf den Schirm, Pferdebauch höher, Delfin mit Händen, Wasser entlang der Strecke und Schwimmbewegung; Bombe synchron, Lunte hängt unten, Granate wird mit Pfeifen geworfen, Waschmaschine wäscht Dreck ab, Zielfernrohr mit Ausweichen; Schießen-Kachel mit Pfeil und Bogen und Zielfernrohr; Hot Rod 1/3/5 Ratscher und Tempo; Wecker blendet sauber aus; Helikopter mit rundem Fenster; Frosch mit Gelenken; Krone und Mütze höher; Wegzeichnen-Ton wie früher.",

  inArbeit: [
    { seit: "2026-09-24T20:11",
      text: "Hot Rod als Standardfahrzeug mit Weg; gemeinsam Reisen im Reisen-Menü; Adler-Seitenansicht; Mario-Röhren; Lok-Schranke mit Gleisspuren; Zauberer mit Händen; Laserduell per Antippen; Hammer 5 Stufen mit Krümeln und Reisesperre; Pflaster obendrauf; Axt, Kettensäge, Bazooka, Monstertruck, Feuerwerk, Schulbus, Panzer, Klippe, Bergsteiger, Haustier; eigene SVG-Symbole für Kacheln; Knöpfe unter den Plätzen; Spielsystem (Plan in Funk 92, wartet auf Zustimmung)" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-24T20:11",
      text: "Funk 83, 84 (Teile), 85 (Teile), 89 (Teile), 91 (Wecker, Heli, Anziehen), Walkie #175" },
  ],
};
