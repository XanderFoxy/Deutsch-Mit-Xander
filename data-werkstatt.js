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
  stand: "Runde 21 — Lesen im Chat, Niveau waehlbar, Zeile fuer Zeile",

  inArbeit: [
    { seit: "2026-09-20T15:20",
      text: "Weitere Spiele in den Chat holen, in einfacher Fassung" },
    { seit: "2026-09-20T15:20",
      text: "Sprühsahne: Aufbau wie aus der Dose, Kirsche mit eigenem Geräusch" },
    { seit: "2026-09-20T15:20",
      text: "Strohhalm: der Halm tiefer im Glas, Oberfläche wie eine Kuhle" },
    { seit: "2026-09-20T15:20",
      text: "Tennisschläger und Trittschuh neu zeichnen, Drücken: dickere Arme" },
    { seit: "2026-09-20T15:20",
      text: "Lupe verdeckt die Eingabesymbole" },
    { seit: "2026-09-20T15:20",
      text: "Schneeball auch auf sich selbst werfen können" },
    { seit: "2026-09-20T15:20",
      text: "Galgenmaennchen/Aufdecken reihum spielen und benoten" },
    { seit: "2026-09-20T15:20",
      text: "Blütenblätter sollen beim Sprechen am Bildrand wachsen" },
    { seit: "2026-09-20T15:20",
      text: "Mehr Lesetexte — im Moment sind es sieben, jeder in sechs Niveaus" },
    { seit: "2026-09-20T15:20", nurBetreiber: true,
      text: "app.js aufteilen und nachladen — 1,13 MB gepackt von 2,21 MB Gesamtladung" },
    { seit: "2026-09-20T15:20", nurBetreiber: true,
      text: "Sechs alte doppelte Animationsnamen im Stilblatt aufloesen" },
    { seit: "2026-09-20T15:20", nurBetreiber: true,
      text: "TURN nachmessen: zwei Geraete an einem Tag in turn_nutzung" },
    { seit: "2026-09-20T15:20", nurBetreiber: true,
      text: "Die Tondatei schnee.m4a ist praktisch stumm (-59 dB) — neu aufnehmen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-20T15:20",
      text: "Lesen im Chat: das Buchzeichen neben der Bueroklammer (oder /lesen) oeffnet die Auswahl — erst das Niveau von A1 bis C2, dann der Text." },
    { seit: "2026-09-20T15:20",
      text: "Der gewaehlte Text kommt als Tafel in den Chat, mit dem Niveau als Abzeichen daneben." },
    { seit: "2026-09-20T15:20",
      text: "Der Text wird in Zeilen geschnitten — ein Satz, eine Zeile, damit man gewissenhaft mitlesen kann." },
    { seit: "2026-09-20T15:20",
      text: "Wer den Text gestellt hat, tippt eine Zeile an: sie leuchtet dann bei ALLEN im Raum. Wer spaeter dazukommt, sieht die Stelle sofort." },
    { seit: "2026-09-20T15:20",
      text: "Das gewaehlte Niveau bleibt im Profil, nicht nur im Geraet." },
    { seit: "2026-09-20T15:20", nurBetreiber: true,
      text: "Es wird dafuer NICHTS nachgeladen — die Texte liegen schon in app.js. Die Ladezeit aendert sich um keinen Byte." },
    { seit: "2026-09-20T15:20", nurBetreiber: true,
      text: "Die Sonde pruefe-jeder-befehl kannte nur zwei Arten von Wirkung (Rundruf oder Chatzeile). Ein Befehl, der ein MENUE oeffnet, galt als Blindgaenger — jetzt zaehlt auch das." },
  ],
};
