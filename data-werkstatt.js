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
  stand: "Runde 73 — der Knopf im Postfach",

  inArbeit: [
    { seit: "2026-09-18T19:12", nurBetreiber: true,
      text: "Sprachausgabe im Pruefbrowser nicht testbar (0 Stimmen) — auf deinem Geraet pruefen, ob der Schrei dramatisch genug klingt" },
    { seit: "2026-09-18T19:12",
      text: "Buehnen-Ansicht: wer oben ist, sieht nur die anderen oben, dafuer groesser" },
    { seit: "2026-09-18T19:12",
      text: "18 Tutor-Saetze haben noch keine Aufnahme, darunter alle fuenf von Ueber mich" },
    { seit: "2026-09-18T19:12", nurBetreiber: true,
      text: "Cloudflare: Turn Token ID liegt vor, der API Token fehlt noch" },
    { seit: "2026-09-18T19:12", nurBetreiber: true,
      text: "TikTok-Variante (Realtime SFU): Preis noch nicht geprueft, Netz von hier gesperrt" },
    { seit: "2026-09-18T19:12",
      text: "Hinweis, wenn ein Befehl ohne Namen keinen Sinn ergibt" },
    { seit: "2026-09-18T19:12",
      text: "Profilrahmen schoener, Regenbogen deutlicher, dazu ein magisches Funkeln beim Sprechen" },
    { seit: "2026-09-18T19:12",
      text: "Wortauswahl-Spiel: ein Wort, mehrere Schreibweisen, Note ins Laufband" },
    { seit: "2026-09-18T19:12",
      text: "Echte Bilder fuer Menschen, Dinge, Geschichten im Kompass" },
    { seit: "2026-09-18T19:12",
      text: "Fehlende Animationen: Umarmung, Boxen, Route 66" },
    { seit: "2026-09-18T19:12",
      text: "Animationen ueberarbeiten: Aquarium, Aegypten, KITT, Weihnachtsmann, Strudel, Zombie, Jalousie, Spukschloss" },
    { seit: "2026-09-18T19:12",
      text: "Stripe-Stufen 1 bis 5 Euro (Super User)" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-18T19:12",
      text: "Die Einladung im Postfach ist jetzt ein KNOPF, keine Adresszeile mehr: sie traegt die Marke RAUM, aus der das Postfach seit jeher einen Knopf baut (wie bei der Beta-Einladung)" },
    { seit: "2026-09-18T19:12",
      text: "Und der Knopf fuehrt jetzt wirklich hin: er suchte das Klassenzimmer unter Lernen, es haengt aber unter Wissen — er klickte damit auf nichts" },
    { seit: "2026-09-18T19:12",
      text: "Das Mikrofon-Zeichen in der Sprachzeile ist raus: die Tonspur daneben sagt schon, dass es eine Sprachnachricht ist" },
    { seit: "2026-09-18T19:12",
      text: "Zurueckrufen sitzt jetzt AN der Nachricht, neben dem Herunterladen — nur an der eigenen" },
    { seit: "2026-09-18T19:12",
      text: "Sprachnachrichten stehen jetzt IMMER im Verlauf, nur unsichtbar. Vorher gab es gar nichts einzublenden, wenn der Befehl aus war — deshalb kam beim Klick ins Leere oft nichts" },
    { seit: "2026-09-18T19:12",
      text: "Das Zuklappen ging nicht, weil das Aufklappen genau die Stelle zugebaut hat, auf die man getippt hatte. Jetzt gilt auch die Leere NEBEN einer Zeile, und Escape schliesst auch" },
  ],
};
