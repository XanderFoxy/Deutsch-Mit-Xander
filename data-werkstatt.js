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
  stand: "Runde 80, achter Teil: Zwille, Birne, Klaps, Dunkelmodus, UFO",

  inArbeit: [
    { seit: "2026-09-22T03:27",
      text: "Der Rest von Xanders Liste vom 22. September" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T03:27",
      text: "Die Zwille zieht sichtbar auf: die Ledertasche mit der Kugel wandert genau die 32 Einheiten mit, die das Gummi an Laenge gewinnt (gemessen). Der Standfuss der Schneekugel bleibt bis zum Schluss stehen statt 1 Sekunde zu frueh zu verschwinden." },
    { seit: "2026-09-22T03:27",
      text: "Glas und Fassung der Gluehbirne sind eine Form im Dreh: das Gewinde dreht jetzt dieselbe raeumliche Drehung mit denselben Stufen wie das Glas (0 / 360 / 720 / 1020 / 1044 Grad, gemessen identische Matrizen)." },
    { seit: "2026-09-22T03:27",
      text: "Der Klaps auf den Hintern ist eine eigene Animation mit eigenem Befehl /klaps: die Hand kommt von unten, trifft bei 600 ms, das Bild federt nach oben weg, ein roter Handabdruck bleibt kurz stehen." },
    { seit: "2026-09-22T03:27",
      text: "Der Dunkelmodus deckt jetzt die GANZE Seite ab (gemessen: 420 x 860 = der ganze Bildschirm), die Augen springen beim Scrollen nicht mehr (Abstand zum Gesicht 0,2 px vor und nach dem Scrollen) und sehen aus wie Emoji-Augen." },
    { seit: "2026-09-22T03:27",
      text: "UFO tiefer (1,12 statt 1,45 Bildbreiten) und das Profilbild wird komplett eingesaugt statt sichtbar unter dem Schiff mitzureisen. Die Katze schlaegt mit der Pfote wirklich zu. Der Plattenspieler laeuft nach dem Kratzen mit Musik weiter. Die Sanduhr rieselt aus einer schmalen Saeule und der Haufen bleibt liegen. Das Portal spritzt nicht mehr heraus. Der Cowboy hat dickere Hoecker und den Peitschenknall, der Vogel zwitschert und sein Kot laeuft weiter am Gesicht herunter. Das Becken beim Turmsprung ist voll." },
  ],
};
