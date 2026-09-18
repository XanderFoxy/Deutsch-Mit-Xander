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
  stand: "Runde 72 — der Schrei wird wirklich geschrien",

  inArbeit: [
    { seit: "2026-09-18T19:07", nurBetreiber: true,
      text: "Sprachausgabe im Pruefbrowser nicht testbar (0 Stimmen im Container) — auf deinem Geraet pruefen und sagen, ob es dramatisch genug klingt" },
    { seit: "2026-09-18T19:07",
      text: "Buehnen-Ansicht: wer oben ist, sieht nur die anderen oben, dafuer groesser" },
    { seit: "2026-09-18T19:07",
      text: "18 Tutor-Saetze haben noch keine Aufnahme, darunter alle fuenf von Ueber mich" },
    { seit: "2026-09-18T19:07", nurBetreiber: true,
      text: "Cloudflare: Turn Token ID liegt vor, der API Token fehlt noch" },
    { seit: "2026-09-18T19:07", nurBetreiber: true,
      text: "TikTok-Variante (Realtime SFU): Preis noch nicht geprueft, Netz von hier gesperrt" },
    { seit: "2026-09-18T19:07",
      text: "Hinweis, wenn ein Befehl ohne Namen keinen Sinn ergibt" },
    { seit: "2026-09-18T19:07",
      text: "Profilrahmen schoener, Regenbogen deutlicher, dazu ein magisches Funkeln beim Sprechen" },
    { seit: "2026-09-18T19:07",
      text: "Wortauswahl-Spiel: ein Wort, mehrere Schreibweisen, Note ins Laufband" },
    { seit: "2026-09-18T19:07",
      text: "Echte Bilder fuer Menschen, Dinge, Geschichten im Kompass" },
    { seit: "2026-09-18T19:07",
      text: "Fehlende Animationen: Umarmung, Boxen, Route 66" },
    { seit: "2026-09-18T19:07",
      text: "Animationen ueberarbeiten: Aquarium, Aegypten, KITT, Weihnachtsmann, Strudel, Zombie, Jalousie, Spukschloss" },
    { seit: "2026-09-18T19:07",
      text: "Stripe-Stufen 1 bis 5 Euro (Super User)" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-18T19:07",
      text: "Zweite Ursache gefunden: der Lehrer-Rang verlangte den HAUPTRAUM. In einem eigenen Raum war der Betreiber nur Haeuptling — jetzt ist er ueberall Lehrer" },
    { seit: "2026-09-18T19:07",
      text: "Absagen sagen jetzt, WORAN es liegt: nicht angemeldet, keine Datenbank, Suche fehlt, Postfach fehlt — statt eines pauschalen Es geht nicht" },
    { seit: "2026-09-18T19:07",
      text: "Neuer Befehl /diagnose: zeigt Konto, Datenbank, Postfach, Rundmail, deinen Rang und wer erreichbar ist" },
    { seit: "2026-09-18T19:07",
      text: "Die harte Kante beim Schreien ist weg: die zwei vergroesserten Textkopien sind ersatzlos raus. Der Schrei entsteht jetzt aus Licht, nicht aus doppelter Schrift" },
    { seit: "2026-09-18T19:07",
      text: "Der Schrei wird vorgelesen — tief (pitch 0.35), langsam (rate 0.78), auf Deutsch. Die Sprachausgabe steckt im Browser und kostet nichts" },
    { seit: "2026-09-18T19:07",
      text: "Der Klick ins Leere hat jetzt drei Riegel, damit er das Wiederholen einer Animation nicht stoert" },
  ],
};
