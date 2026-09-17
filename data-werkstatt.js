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
  stand: "Runde 18 — neue Animationen und die Tipphilfe",

  inArbeit: [
    { seit: "2026-09-17T13:41",
      text: "Cash Horizon, Keks mit Bissen und Krümeln, Wolkenzug — geschrieben, noch nicht geprüft." },
    { seit: "2026-09-17T13:41",
      text: "Glasbruch, krabbelnde Spinnen und die klingende Noten-Animation." },
    { seit: "2026-09-17T13:41",
      text: "Der Orkan soll die Wörter viel deutlicher durcheinanderwirbeln." },
    { seit: "2026-09-17T13:41",
      text: "Die Befehlsliste ist zu lang — sie soll gruppiert werden, damit man den Chat nicht aus den Augen verliert." },
    { seit: "2026-09-17T13:41",
      text: "Bonbons und Rennauto aufwerten." },
    { seit: "2026-09-17T13:41",
      text: "Effekte dort zeigen, wo man gerade hinsieht." },
    { seit: "2026-09-17T13:41",
      text: "Mehrere Videos rechts am Rand stapeln." },
    { seit: "2026-09-17T13:41", nurBetreiber: true,
      text: "Wörterbuch säubern, dann A1 mit deiner Stimme über ElevenLabs." },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-17T13:41",
      text: "Hintergrund am Panel verankert: er scrollt mit dem Panel mit, statt wie Glas darüber zu liegen." },
    { seit: "2026-09-17T13:41",
      text: "Weihnachtsschlitten neu: Rentiere VOR dem Schlitten, in Fahrtrichtung, im Galopp, mit Rudolfs Nase, Mond, Sternen und Sternenstaub auf der Schleife." },
    { seit: "2026-09-17T13:41",
      text: "Sternschnuppen fallen jetzt wirklich — vorher war keine einzige zu sehen." },
    { seit: "2026-09-17T13:41",
      text: "Lagerfeuer aus sieben übereinanderliegenden Flammenzungen, deutlich grösser, mit Lichtschein am Boden." },
    { seit: "2026-09-17T13:41",
      text: "Sphinx in Ägypten: richtige Silhouette, maßstäblich vor den Pyramiden." },
    { seit: "2026-09-17T13:41",
      text: "Sintflut: das Treibgut schwimmt auf dem Wasser statt darunter." },
    { seit: "2026-09-17T13:41",
      text: "Armageddon: Einschlag als Lichtblitz statt als Kasten, Risse glühen." },
    { seit: "2026-09-17T13:41",
      text: "Tipphilfe beim Schrägstrich: Befehle, Namen aus dem Raum, Bilder — mit Tabulator zum Übernehmen." },
    { seit: "2026-09-17T13:41",
      text: "Kurze Töne zu Glocke, Katze, Regen, Feuer und Party — zweites Antippen schaltet sie ab." },
    { seit: "2026-09-17T13:41",
      text: "Der Chat bleibt unten, bis man selbst hochscrollt." },
    { seit: "2026-09-17T13:41",
      text: "Gäste sehen den gemeinsamen Verlauf jetzt auch, und er reicht 400 Zeilen weit statt 60." },
    { seit: "2026-09-17T13:41",
      text: "Beim Wetter steht die Quelle im Hinweistext: Ort, WMO-Code, Lage und Messzeit." },
  ],
};
