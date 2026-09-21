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
  stand: "Runde 48 — drei Kulissen, Schneekugel, stumme Geräusche",

  inArbeit: [
    { seit: "2026-09-21T01:42",
      text: "Billard-Physik, Zwille bleibt beim Schützen, Pac-Man, Lasso, Blasrohr" },
    { seit: "2026-09-21T01:42",
      text: "Neue Geräusche: Slotmaschine, Ohrfeige mit Geschlecht, Glühbirne, Kasse" },
    { seit: "2026-09-21T01:42",
      text: "Raddampfer, Liane, Helikopter, Pferd; Whiteboard; Tutor-Video mit Greenscreen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T01:42",
      text: "GEFUNDEN: der Strudel am Platz war stumm, weil sogwasser zwar als Datei da war und im Tonplan stand, aber nicht in data-geraeusche.js — und diese Liste entscheidet, ob der Browser die Datei überhaupt sucht" },
    { seit: "2026-09-21T01:42",
      text: "Neue Sonde pruefe-tonliste: jeder Ton aus dem Plan muss eine Datei haben UND in der Liste stehen (127 Namen geprüft)" },
    { seit: "2026-09-21T01:42",
      text: "Fenster zeigt wieder die sonnige grüne Landschaft mit den zwei Vögeln — fest, nicht mehr nach der Uhrzeit" },
    { seit: "2026-09-21T01:42",
      text: "Jalousie hat eine eigene Abendkulisse: tiefstehende Sonne über dem Meer mit Lichtstrasse und Boot. Rollo bleibt die Nacht" },
    { seit: "2026-09-21T01:42",
      text: "Schneekugel: der Schnee fällt jetzt wirklich (fiel vorher 3 px statt durchs ganze Bild) und die Häuser werden nicht mehr vergraben" },
    { seit: "2026-09-21T01:42",
      text: "Blubbern: das aufgesetzte Smiley-Gesicht ist weg, der Halm bleibt" },
  ],
};
