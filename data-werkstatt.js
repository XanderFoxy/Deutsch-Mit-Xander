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
  stand: "Fassung 423 — Runde 73, zweiter Teil: Röhre, Strudel, Cowboyhut, Zwille, Hammer, BH und die Augen im Dunkeln.",

  inArbeit: [
    { seit: "2026-09-21T17:10",
      text: "Portal/Tor: Nudelholz-Rolle, Krümel oben links, Tiefe und schwarzer Spiegel." },
    { seit: "2026-09-21T17:10",
      text: "Strohhalm, Knüllen, Bowling, Billard, Basketballkorb." },
    { seit: "2026-09-21T17:10",
      text: "Leuchten am Platz: für alle sichtbar und abschaltbar; die Fassung darf nicht stehenbleiben." },
    { seit: "2026-09-21T17:10",
      text: "Sprechbilder Feuer, Blut, Regen und die übrigen aus der Liste." },
    { seit: "2026-09-21T17:10",
      text: "Aufgabe im Unterricht, Schiffe-versenken-Reihenfolge, Android-Layout, Stadt-Land-Fluss." },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T17:10",
      text: "Röhre: sie stand 7 px weit auf dem Nachbarplatz (Bild 84 px, Reihenabstand 109 px) — jetzt endet sie 5 px vor der nächsten Reihe." },
    { seit: "2026-09-21T17:10",
      text: "Röhre: Absinken und Zuschnitt kommen aus einer Rechnung. Das Bild wird nicht mehr abgeschnitten, bevor es drin ist." },
    { seit: "2026-09-21T17:10",
      text: "Röhre: das Ausstiegsbild blendete 157 ms nach dem Platzwechsel aus — zwei Bilder auf einem Platz. Jetzt geht es genau in dem Bild, in dem das echte kommt." },
    { seit: "2026-09-21T17:10",
      text: "Strudel: der Ton war 1,00 s lang und nach 0,40 s unter -47 dB. Neuer Ton strudelsog, 4,60 s, Marke für Marke zur Animation. Das Ruckeln kam von einer Kurve über die ganze Animation — die ist raus." },
    { seit: "2026-09-21T17:10",
      text: "Cowboyhut: der Hut sass nach 145 ms, der Ton kam bei 575 ms. Jetzt beide bei 575 ms, Animation 2,8 s statt 3,4 s. Dazu eine Hand, die die Krempe zurechtzieht." },
    { seit: "2026-09-21T17:10",
      text: "Zwille: Spannen lauter und von Anfang an, ein Sausen beim Losschnellen und ein Einschlag vor dem Schrei." },
    { seit: "2026-09-21T17:10",
      text: "Hammer: der Amboss-Klang liegt jetzt unter dem Bonk." },
    { seit: "2026-09-21T17:10",
      text: "BH: neuer Ton bhriss — erst das Reissen, bei 0,24 s der Gummizug-Schnalzer. Der Pfiff kommt danach statt gleichzeitig, und der BH rutscht wirklich bei 660 ms los (vorher erst bei 786 ms)." },
    { seit: "2026-09-21T17:10",
      text: "Augen im Dunkeln: sie wandern beim Scrollen nicht mehr weg — die Stelle wird jetzt in jedem Bild neu in Pixeln gesetzt statt einmal in Prozent." },
    { seit: "2026-09-21T17:10",
      text: "Augen im Dunkeln: die Pupille war doppelt so hoch wie breit, also ein Katzenschlitz. Jetzt rund." },
    { seit: "2026-09-21T17:10",
      text: "Augen im Dunkeln: der Blinzel-Ton lag 1,3 s vor dem Lidschlag. Jetzt auf beiden Lidschlägen und lauter." },
    { seit: "2026-09-21T17:10",
      text: "Eine überzählige geschweifte Klammer in korrekturen.css entfernt; acht Prüfungen zeigten auf gelöschte oder alte Werte." },
  ],
};
