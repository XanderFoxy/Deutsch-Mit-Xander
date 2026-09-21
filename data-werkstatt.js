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
  stand: "Fassung 433 — das Platzdesign bleibt stehen",

  inArbeit: [
    { seit: "2026-09-21T23:45",
      text: "Boxhandschuhe von links und rechts unten mit der Flaeche; Umarmungsarme ohne Knick." },
    { seit: "2026-09-21T23:45",
      text: "Wurfrichtung: alles, was geworfen wird, kommt aus meiner Richtung; Einschlag dort, wo ich hintippe." },
    { seit: "2026-09-21T23:45",
      text: "Regen und Gewitter: Animation laenger als der Ton; Geld faellt zu langsam, Kasse fehlt davor." },
    { seit: "2026-09-21T23:45",
      text: "Pferd, Vogel, Helikopterglas, Katapult, Sanduhr, Pac-Man-Weg neu zeichnen." },
    { seit: "2026-09-21T23:45",
      text: "Kopfhoerer mit Liedausschnitt; Trommel mit Gong und Bongo; Bombe digital mit Ziffern." },
    { seit: "2026-09-21T23:45",
      text: "Sprechbilder: Strom aus der Mitte, Schallwellen ohne Luecke, Noten und Herzen am Rand, Ringfarbe waehlbar." },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T23:45",
      text: "Strichlinie und Platznummer bleiben jetzt bei JEDEM Effekt stehen. Der Platzhalter liegt immer unter dem Bild; faehrt das Bild weg, kommt er zum Vorschein. Das betraf rund zwanzig gemeldete Stellen auf einmal (Strudel, Knuellen, Tennis, Sanduhr, Pac-Man, Flugzeug, Lok, Vogel, Turm, Kran, Beamen, Roehre, Pferd, Frisbee, Hand, Katze, Feder, Liane, Maulwurf, Basketball)." },
    { seit: "2026-09-21T23:45",
      text: "Das Profilbild taucht nicht mehr kurz am verlassenen Platz auf, bevor es am Ziel landet." },
    { seit: "2026-09-21T23:45",
      text: "Jedes Menue schliesst jetzt auch, wenn man IM Kasten ins Leere tippt — dort, wo keine Kachel ist. Das galt bisher nur fuer die Bildwaehler." },
    { seit: "2026-09-21T23:45",
      text: "Die Panels begrenzen ihre Hoehe in dvh statt vh: auf Android ist der sichtbare Bereich kleiner als 100vh, solange die Adressleiste steht — daher waren sie angeschnitten." },
    { seit: "2026-09-21T23:45",
      text: "Die Pruefbuehne hat jetzt dieselbe Auszeichnung wie der echte Raum (Schild und Nummer). Ohne sie konnte keine Sonde diesen ganzen Fehlerkreis je finden." },
  ],
};
