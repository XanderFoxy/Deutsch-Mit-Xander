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
  stand: "Runde 71 — der Fehler hinter drei Meldungen",

  inArbeit: [
    { seit: "2026-09-18T19:02",
      text: "Buehnen-Ansicht: wer oben ist, sieht nur die anderen oben, dafuer groesser — umschaltbar" },
    { seit: "2026-09-18T19:02",
      text: "18 Tutor-Saetze haben noch keine Aufnahme, darunter alle fuenf von Ueber mich" },
    { seit: "2026-09-18T19:02", nurBetreiber: true,
      text: "Cloudflare: Turn Token ID liegt vor, der API Token fehlt noch" },
    { seit: "2026-09-18T19:02", nurBetreiber: true,
      text: "TikTok-Variante (Realtime SFU): Preis noch nicht geprueft, Netz von hier gesperrt" },
    { seit: "2026-09-18T19:02",
      text: "Hinweis, wenn ein Befehl ohne Namen keinen Sinn ergibt" },
    { seit: "2026-09-18T19:02",
      text: "Profilrahmen schoener, Regenbogen deutlicher, dazu ein magisches Funkeln beim Sprechen" },
    { seit: "2026-09-18T19:02",
      text: "Wortauswahl-Spiel: ein Wort, mehrere Schreibweisen, Note ins Laufband" },
    { seit: "2026-09-18T19:02",
      text: "Echte Bilder fuer Menschen, Dinge, Geschichten im Kompass" },
    { seit: "2026-09-18T19:02",
      text: "Fehlende Animationen: Umarmung, Boxen, Route 66" },
    { seit: "2026-09-18T19:02",
      text: "Animationen ueberarbeiten: Aquarium, Aegypten, KITT, Weihnachtsmann, Strudel, Zombie, Jalousie, Spukschloss" },
    { seit: "2026-09-18T19:02",
      text: "Stripe-Stufen 1 bis 5 Euro (Super User)" },
    { seit: "2026-09-18T19:02",
      text: "Sitzende Seitenansicht fuers Profil" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-18T19:02",
      text: "GEFUNDEN: backend.js beginnt mit einem const — das erzeugt einen globalen NAMEN, aber kein window.Backend. Jede Pruefung mit window.Backend in livechat.js war damit IMMER falsch" },
    { seit: "2026-09-18T19:02",
      text: "Deshalb hatten alle drei Meldungen dieselbe Ursache: Postfach nicht verfuegbar, Emmi nirgends zu finden, nur der Betreiber" },
    { seit: "2026-09-18T19:02",
      text: "Der Lehrer-Rang wird jetzt im Augenblick der Frage beim Konto nachgesehen — Verlassen und Wiederkommen aendert nichts mehr" },
    { seit: "2026-09-18T19:02",
      text: "Namensvorschlaege in drei Stufen: wer im Raum sitzt, wer sonst gerade da ist, und ALLE anderen Mitglieder (die bekommen Post)" },
  ],
};
