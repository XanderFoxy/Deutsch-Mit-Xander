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
  stand: "Runde 37 — Sprechbilder außen am Bild, Röhre, Zorro",

  inArbeit: [
    { seit: "2026-09-21T00:34",
      text: "Münze: realistisch drehen, unten landen, keine Wackeleffekte" },
    { seit: "2026-09-21T00:34",
      text: "Billard: durchs Feld rollen und an den Ecken abprallen" },
    { seit: "2026-09-21T00:34",
      text: "Paintball: Kleckse über das ganze Bild, dann herunterlaufen" },
    { seit: "2026-09-21T00:34",
      text: "Wecker: Klöppel zwischen den beiden Schallkuppeln" },
    { seit: "2026-09-21T00:34",
      text: "Peitsche: Wellenform, die zur Spitze dünn ausläuft" },
    { seit: "2026-09-21T00:34",
      text: "Glühbirne: mit der Fassung von links nach rechts eindrehen" },
    { seit: "2026-09-21T00:34",
      text: "Sanduhr: das Bild zerfließt wie Sand" },
    { seit: "2026-09-21T00:34",
      text: "Kopfhörer: Lied auswählen, aufgesetzt lassen, Aussehen wie AirPods Max" },
    { seit: "2026-09-21T00:34",
      text: "Lupe fürs Großzeigen, „alle“-Einträge im Platzmenü" },
    { seit: "2026-09-21T00:34",
      text: "Sprechbilder: Störung (alte VHS-Animation), Blasen, Eis, Blut, Spinnweben" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T00:34",
      text: "Sprechbilder liegen jetzt AUSSERHALB des Profilbildes: Blüte, Feuerring, Funkeln, Magie, Regenbogen, Schallwellen und Strom — Ursache war overflow:hidden am Bildkreis" },
    { seit: "2026-09-21T00:34",
      text: "Blütenblätter, Flammen und Sternchen sind echte Formen (SVG) statt weicher Farbflecken" },
    { seit: "2026-09-21T00:34",
      text: "Regenbogen und Strom lagen wegen falsch gemessener Maske unter dem Bild — jetzt außen herum" },
    { seit: "2026-09-21T00:34",
      text: "Neue Reise: die grüne Röhre wie bei Super Mario, mit Rein- und Raus-Geräusch (/rohr 5)" },
    { seit: "2026-09-21T00:34",
      text: "Der Maulwurf gräbt sich jetzt durch das EIGENE Profilbild — mit Loch, in das das Bild versinkt" },
    { seit: "2026-09-21T00:34",
      text: "Neuer Effekt: Zorro schlitzt drei Hiebe als Z ins Bild (/zorro Name)" },
    { seit: "2026-09-21T00:34",
      text: "Das Ei knackt erst und glibbert dann — zwei getrennte Geräusche" },
    { seit: "2026-09-21T00:34",
      text: "Die Zwille quietscht beim Dehnen, schnalzt beim Loslassen, das AUA kommt beim Treffer" },
    { seit: "2026-09-21T00:34",
      text: "Zufall rattert jetzt wie eine Slotmaschine, bevor das Los fällt" },
  ],
};
