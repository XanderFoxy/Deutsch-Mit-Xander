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
  stand: "Fassung 434 — Runde 80, erster Teil: Regen und Gewitter sind jetzt genau so lang wie ihre Animation, die Stoerung hat ein eigenes Rauschen, die Umarmungsarme haben keinen Knick mehr, die Boxhandschuhe kommen von unten mit der Flaeche, das Ablecken laeuft weich aus, der Fussball fliegt ohne Stehenbleiben zurueck, der Eimer zeigt keine Pfuetze mehr vorher, der Wecker hat Standfuesse, vor dem Geld klingelt die Kasse, die Bonbons sind bunt und sammeln sich, der Hammer klickt nicht mehr am Ende, der Schneeball laeuft gerade herunter, Pfeil und Peitsche sitzen auf dem Bild.",

  inArbeit: [
    { seit: "2026-09-22T00:24",
      text: "Der Rest von Xanders Liste vom 22. September" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T00:24",
      text: "Gewitter 11,00 s (vorher 4,00 s) mit Regenbett und drei Schlaegen; Regen 12,00 s;neues Geraeusch rauschen.opus/m4a fuer die Stoerung (vorher lieh sie sich den Gewitterton);Umarmungsarm aus einer Rueckgratlinie gerechnet: groesster Richtungssprung 0,72 Grad statt 18,1 Grad;Boxhandschuhe beim Selbstboxen von links unten und rechts unten, 40 Grad gedreht, Treffer genau in der Bildmitte;Glanzfilm beim Ablecken sitzt auf dem runden Bild statt auf dem ganzen Knopf und laeuft ab 54 Prozent weich aus;Ballflug als echte Wurfparabel mit 32 Stuetzstellen: kleinster Schritt 7,3 px statt Stillstand;Wasserpegel samt Wellen erst sichtbar, wenn der Eimer giesst;zwei schraege Standfuesse am Wecker, die im Takt mitwippen;Registrierkasse auch beim Geld auf eine Person, Geldbett 900 ms spaeter;Bonbons gezeichnet in acht Farben, sammeln sich unten im Bild, Fallzeit 1,15 s statt 2,10 s;hammerbonk auf 1,45 s gekuerzt — der Klick bei 1,90 s (-10 dB) ist weg;Schneeball und seine Spur laufen senkrecht herunter statt schraeg;pfeilschuss hat nur noch EINEN Einschlag (vorher zwei, der zweite 1,4 s zu spaet);peitschehieb haerter (Knall 29 dB ueber dem Ausholen) und startet bei 200 ms, damit er auf die 600 ms der Animation faellt;Strudel ohne harte Kontrastkante, dazu drei Wellen von innen nach aussen" },
  ],
};
