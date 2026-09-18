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
  stand: "Runde 67 — Sitzplätze, Zensuren und das Befehls-Panel",

  inArbeit: [
    { seit: "2026-09-18T17:39",
      text: "18 Tutor-Saetze haben noch keine Aufnahme — darunter alle fuenf von „Ueber mich“ (ElevenLabs-Guthaben war leer)" },
    { seit: "2026-09-18T17:39", nurBetreiber: true,
      text: "Cloudflare-Schluessel fuer den Livestream fehlt noch — Einstellungen, Karte „Klassenzimmer-Relais“" },
    { seit: "2026-09-18T17:39",
      text: "Schreien: Buchstaben einzeln bunt bei „bunt“, ein Stoss durch den Chatraum und ein neutraler Echo-Ton" },
    { seit: "2026-09-18T17:39",
      text: "/i soll auch Leute erreichen, die gerade nicht da sind — Einladung ins Postfach, Freundesliste dazu" },
    { seit: "2026-09-18T17:39",
      text: "Wortauswahl-Spiel: ein Wort, mehrere Schreibweisen, wer richtig waehlt bekommt eine Note im Laufband" },
    { seit: "2026-09-18T17:39",
      text: "Sprachnachricht zurueckrufen oder loeschen" },
    { seit: "2026-09-18T17:39",
      text: "„Der Unterricht beginnt“ auch als Chat-Befehl mit Eintrag im Laufband" },
    { seit: "2026-09-18T17:39",
      text: "Echte Bilder fuer „Menschen, Dinge, Geschichten“ im Kompass" },
    { seit: "2026-09-18T17:39",
      text: "Fehlende Animationen: Umarmung, Boxen, Route 66" },
    { seit: "2026-09-18T17:39",
      text: "Animationen ueberarbeiten: Aquarium, Aegypten, KITT, Weihnachtsmann, Strudel, Zombie, Jalousie, Spukschloss" },
    { seit: "2026-09-18T17:39",
      text: "Stripe-Stufen 1-5 Euro (Super User)" },
    { seit: "2026-09-18T17:39",
      text: "Sitzende Seitenansicht fuers Profil" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-18T17:39",
      text: "Sitzplatz wechseln und tauschen mit einem Tipp: freier Platz = hinsetzen, fremder Platz = tauschen, lang drücken = Bild groß" },
    { seit: "2026-09-18T17:39",
      text: "Name und Text stehen wieder auf einer Linie — gemessen: mit Profilfoto stand der Text 4,8 Pixel zu tief" },
    { seit: "2026-09-18T17:39",
      text: "Zensur direkt an der Nachricht: kleines Zeichen an jeder Zeile, 1 bis 6, mit Fach — und die Punkte werden gutgeschrieben" },
    { seit: "2026-09-18T17:39",
      text: "Raenge im Klassenzimmer: der Betreiber ist dort Lehrer, kann einen Klassensprecher ernennen, und der fuehrt weiter, wenn der Lehrer geht" },
    { seit: "2026-09-18T17:39",
      text: "Zensuren gibt nur der Lehrer — und die Absage sagt auch, warum" },
    { seit: "2026-09-18T17:39",
      text: "Befehls-Panel am Schraegstrich: Kategorien zum Anklicken, Favoriten, farbige Raender und eine Legende dazu" },
    { seit: "2026-09-18T17:39",
      text: "Jeder Befehl hat jetzt sein Zeichen — und man kann es tippen: 🐧 oder #pinguine schickt die Pinguine" },
    { seit: "2026-09-18T17:39",
      text: "Sprech-Animation ist einstellbar: Ring, Welle, Puls, Regenbogen oder aus — im Befehlskasten neben der Schrift" },
    { seit: "2026-09-18T17:39",
      text: "GIF-Suche sucht schon beim Tippen, ohne Knopf" },
    { seit: "2026-09-18T17:39",
      text: "Das Halte-Schloss sitzt jetzt IM Kaestchen — ein Zeichen statt zweier, das spart eine halbe Zeile" },
  ],
};
