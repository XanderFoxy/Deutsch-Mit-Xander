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
  stand: "Runde 68 — das Schreien",

  inArbeit: [
    { seit: "2026-09-18T18:03",
      text: "18 Tutor-Saetze haben noch keine Aufnahme — darunter alle fuenf von „Ueber mich“ (ElevenLabs-Guthaben war leer)" },
    { seit: "2026-09-18T18:03", nurBetreiber: true,
      text: "Cloudflare: Turn Token ID liegt vor, der API Token fehlt noch — Einstellungen, Karte „Klassenzimmer-Relais“" },
    { seit: "2026-09-18T18:03", nurBetreiber: true,
      text: "Spaeter: TikTok-artiger Livestream braucht Cloudflare Realtime SFU, nicht TURN" },
    { seit: "2026-09-18T18:03",
      text: "/i soll auch Leute erreichen, die gerade nicht da sind — Einladung ins Postfach, Freundesliste dazu" },
    { seit: "2026-09-18T18:03",
      text: "Wortauswahl-Spiel: ein Wort, mehrere Schreibweisen, wer richtig waehlt bekommt eine Note im Laufband" },
    { seit: "2026-09-18T18:03",
      text: "Sprachnachricht zurueckrufen oder loeschen" },
    { seit: "2026-09-18T18:03",
      text: "„Der Unterricht beginnt“ auch als Chat-Befehl mit Eintrag im Laufband" },
    { seit: "2026-09-18T18:03",
      text: "Echte Bilder fuer „Menschen, Dinge, Geschichten“ im Kompass" },
    { seit: "2026-09-18T18:03",
      text: "Fehlende Animationen: Umarmung, Boxen, Route 66" },
    { seit: "2026-09-18T18:03",
      text: "Animationen ueberarbeiten: Aquarium, Aegypten, KITT, Weihnachtsmann, Strudel, Zombie, Jalousie, Spukschloss" },
    { seit: "2026-09-18T18:03",
      text: "Stripe-Stufen 1-5 Euro (Super User)" },
    { seit: "2026-09-18T18:03",
      text: "Sitzende Seitenansicht fuers Profil" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-18T18:03",
      text: "Beim Schreien sind bei „bunt“ jetzt die BUCHSTABEN einzeln bunt, nicht mehr die Woerter — gemessen: 5 Buchstaben, 5 Farben je Wort" },
    { seit: "2026-09-18T18:03",
      text: "Der Ruf nimmt die eingestellte Schriftart an (gemessen: Nunito bzw. Schreibmaschine)" },
    { seit: "2026-09-18T18:03",
      text: "Der Schall geht durch den Chatraum: ein Stoss und eine Welle von unten nach oben, nach zwei Sekunden ist Ruhe" },
    { seit: "2026-09-18T18:03",
      text: "Neuer neutraler Schrei-Ton (ton/schrei.opus) — gerechnet, kein Wort darin: zwei Toene im Quintabstand durch einen Formantfilter, mit Raumecho" },
  ],
};
