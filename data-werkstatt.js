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
  stand: "Fassung 426 — Runde 74: Kopfhörer auf dem Kreis, Liane als Pendel, Röhre bündig, Angel und Lasso getrennt.",

  inArbeit: [
    { seit: "2026-09-21T18:09",
      text: "Billard: Abprallen von den Ecken und ein Startplatz zur Wahl." },
    { seit: "2026-09-21T18:09",
      text: "Bowling mit Menschen als Kegel; Basketballkorb." },
    { seit: "2026-09-21T18:09",
      text: "Strohhalm, Knüllen, Schwimmbecken-Landegeräusch." },
    { seit: "2026-09-21T18:09",
      text: "Die übrigen Sprechbilder: Spinne, Regenbogen, Schallwellen, Eisblumen, Blasen, Regentropfen." },
    { seit: "2026-09-21T18:09",
      text: "Aufgabe im Unterricht, Schiffe-versenken-Reihenfolge, Android-Layout, Stadt-Land-Fluss, Whiteboard." },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T18:09",
      text: "Kopfhörer: der Bügel ist jetzt ein echter Kreisbogen um dieselbe Mitte wie das Profilbild (Radius 73,5 von 71,4). Oben ein blaues Pflaster als Brücke, an seinen beiden Enden je ein Tropfen, aus dem der silberne Metallbügel kommt." },
    { seit: "2026-09-21T18:09",
      text: "Kopfhörer: von 122 auf 112 Prozent. Bei 84 px Bild und 91 px Platzabstand ragte die Zeichnung 9,25 px je Seite heraus — zwei Nachbarn hätten sich um 11,5 px überlappt. Jetzt 5,04 px, die Muschel selbst nur 3,4 px." },
    { seit: "2026-09-21T18:09",
      text: "Helikopter: die Frontscheibe ist eine gerade, um 47 Grad geneigte Fläche mit Kinnscheibe darunter — vorher zwei Bögen, also ein Klumpen. Das Kabinenfenster nimmt dieselbe Schräge auf (24 statt 12 Grad)." },
    { seit: "2026-09-21T18:09",
      text: "Helikopter: der Ton läuft jetzt in der Schleife bis zur Landung. Die Aufnahme ist 2,00 s lang, der Flug bis zu 3,84 s — bis zu 1,84 s davon war still." },
    { seit: "2026-09-21T18:09",
      text: "Liane: sie hängt an einem festen Anker genau über der Mitte zwischen beiden Bildern. Vorher wurde das ganze Gebilde an einer Parabel entlang verschoben — dabei wandert der Aufhängepunkt mit, und das war das Tanzen. Bewegt wird nur noch der Winkel, und der folgt dem Pendelgesetz: Anlauf zurück, dann in einem Zug hinüber. Gemessen: Start auf 0 px genau, Ankunft auf 1 px." },
    { seit: "2026-09-21T18:09",
      text: "Röhre: sie sass 9,25 px zu tief, weil sie von der Mitte des ganzen PLATZES gerechnet wurde statt von der Bildmitte — genau der Streifen, der abgeschnitten aussah. Jetzt sitzt der Schnitt auf 0,3 px genau am Röhrenrand. Dasselbe galt für das Ausstiegsbild: das war die Doppelung." },
    { seit: "2026-09-21T18:09",
      text: "Röhre: neue Töne mit neun Stufen statt drei, 62 statt 40 ms je Stufe und zwei leisen Rückwürfen statt vier lauten — weniger dumpf. Die alten liegen im Backup." },
    { seit: "2026-09-21T18:09",
      text: "Maulwurf: das Grabgeräusch hört auf, wenn er ankommt (lief bis zu 1,33 s zu lang). Die Aufschüttung ist von oben zu sehen: rund statt liegendes Oval, neun Krümel in fünf Braunstufen, jeder Haufen in eigener Größe." },
    { seit: "2026-09-21T18:09",
      text: "Sprungfeder: neuer Ton federboing (0,46 s, Tonhöhe gleitet von 540 auf 165 Hz und wackelt mit 21 Hz) statt eines 3-Sekunden-Klingelns. Und sie setzt auf Plätzen auf, nicht dazwischen." },
    { seit: "2026-09-21T18:09",
      text: "Billard: der Queue stösst durch, statt nach dem Treffer zurückzuziehen, und die Kugel rollt nicht mehr zum Spieler zurück." },
    { seit: "2026-09-21T18:09",
      text: "Angel und Lasso sind getrennt. Eine Zeile entschied bisher nach der Sitzreihe, welche Animation läuft — deshalb wurde aus der Angel ein Lasso, sobald jemand in der Nähe sass. Jetzt entscheidet der Befehl, und die Angel zieht zu dem Platz, den man gewählt hat." },
  ],
};
