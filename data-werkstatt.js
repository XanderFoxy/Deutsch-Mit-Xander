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
  stand: "Fassung 436 — Runde 80, dritter Teil: die Bombe hat eine echte digitale Anzeige, die in Zehntelsekunden herunterlaeuft, die analoge hat nur noch EINE Lunte, das Aschehaeufchen ist endlich zu sehen, es gibt eine Granate, die Kachel heisst „Bombe legen“ — und das Pferd hat neue Beine und ein neues Hinterteil.",

  inArbeit: [
    { seit: "2026-09-22T01:41",
      text: "Der Rest von Xanders Liste vom 22. September" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T01:41",
      text: "Digitale Bombe: schwarzes Feld mit rotem Siebensegment-Schein, 0:03.0 laeuft in Zehnteln herunter, Doppelpunkt blinkt im Sekundentakt;analoge Bombe: die zweite Zuendschnur aus Runde 19 faellt weg;Aschehaeufchen dunkler und groesser, dazu ein Schatten darunter — gemessen war es 150|142|130 auf 246|241|231, also unsichtbar;Granate: Ring ziehen, Buegel springt ab und trudelt weg, Zuender zischt, Knall bei 1,95 s, eigener Ton (3,20 s, selbst gerechnet);Befehl /granate und Kachel im Bomben-Untermenue;Kachel „Buehne leeren“ heisst jetzt „Bombe legen“;Pferd: Hinterbein sitzt bei x=49 statt x=52 (Kruppe endet bei 45), Vorderbein fast gerade (3 statt 6 Einheiten Ausschlag), Kruppe faellt von 58|29 auf 46|40 ab;Uebersicht aller sechs Pferdefassungen im Chat geschickt" },
  ],
};
