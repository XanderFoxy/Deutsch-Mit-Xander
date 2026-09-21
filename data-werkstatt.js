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
  stand: "Runde 49 - Toene, Strom, Flammen und die Trommel",

  inArbeit: [
    { seit: "2026-09-21T02:09",
      text: "Zwille bleibt beim Schuetzen, nur die Kugel fliegt" },
    { seit: "2026-09-21T02:09",
      text: "Pac-Man: Mundrichtung, der Gegessene verlaesst die Buehne, gelbe Punkte auf den Plaetzen" },
    { seit: "2026-09-21T02:09",
      text: "Lasso erst werfen, dann ziehen" },
    { seit: "2026-09-21T02:09",
      text: "Raddampfer mit echtem Schaufelrad, Liane mit richtigem Schwung" },
    { seit: "2026-09-21T02:09",
      text: "Whiteboard: Werkzeuge ausblenden, Rueckschritt und Fortschritt, Bilder sichern" },
    { seit: "2026-09-21T02:09",
      text: "Texte: Ueberschriften am Android, Kategorieauswahl, Benotung je Zeile" },
    { seit: "2026-09-21T02:09",
      text: "Tor-Effekt als echtes Sci-Fi-Portal" },
    { seit: "2026-09-21T02:09", nurBetreiber: true,
      text: "Tutorvideo mit Greenscreen neu aufnehmen - Alphakanal frisst das Schwarz aus" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T02:09",
      text: "Die Ohrfeige klatscht jetzt wirklich - eigener Klatsch-Ton genau beim Treffer (730 ms)" },
    { seit: "2026-09-21T02:09",
      text: "Schmerzlaut nach Geschlecht: Frau und Mann haben eigene Aufnahmen, bei Ohrfeige und Zwille" },
    { seit: "2026-09-21T02:09",
      text: "Der Zufall rattert wie eine Slotmaschine (neue Aufnahme)" },
    { seit: "2026-09-21T02:09",
      text: "Beim Geld klingelt zuerst die Kasse" },
    { seit: "2026-09-21T02:09",
      text: "Der Kran brummt am Ende nicht mehr - das war ein Motorgeraeusch als Ankunftston" },
    { seit: "2026-09-21T02:09",
      text: "Paukenschlag: nur noch EIN Schlaegel, in der Mitte" },
    { seit: "2026-09-21T02:09",
      text: "Marschtrommel: zwei filigrane Drumsticks, und sie bleiben bis zum Schluss sichtbar" },
    { seit: "2026-09-21T02:09",
      text: "Der Strom laeuft innen als haarfeines Netz; aussen strahlt nichts mehr ab" },
    { seit: "2026-09-21T02:09",
      text: "Kleine Ladungen tanzen auf dem Rahmen, 3 px duenn statt 8 px" },
    { seit: "2026-09-21T02:09",
      text: "Die Flammen sitzen auf dem Reifen statt daneben und laufen spitz zu" },
    { seit: "2026-09-21T02:09",
      text: "Magie und Funkeln wandern auf der Kreisbahn statt aus dem Kreis heraus" },
    { seit: "2026-09-21T02:09",
      text: "Die Noten sind kraeftig bunt und haben eine dunkle Kontur" },
    { seit: "2026-09-21T02:09",
      text: "Eisblumen: sieben Raureif-Sterne bluehen im Bild auf" },
    { seit: "2026-09-21T02:09",
      text: "Blut: neun Tropfen statt fuenf" },
    { seit: "2026-09-21T02:09",
      text: "Die alte Bildstoerung ist wieder sichtbar - screen konnte auf hellen Bildern nichts aufhellen" },
    { seit: "2026-09-21T02:09",
      text: "Tennisschlaeger rot mit schwarzem Griff" },
    { seit: "2026-09-21T02:09",
      text: "Helikopter und Pferd als neue Reisen, mit eigenen Geraeuschen" },
    { seit: "2026-09-21T02:09",
      text: "Das Anreise-Menue ist bedienbar - es lag in EINER Menuespalte und ragte auf Weg zeichnen" },
  ],
};
