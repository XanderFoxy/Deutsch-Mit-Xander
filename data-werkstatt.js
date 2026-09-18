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
  stand: "Runde 69 — Einladung, Bremse und Fokus",

  inArbeit: [
    { seit: "2026-09-18T18:38",
      text: "18 Tutor-Saetze haben noch keine Aufnahme — darunter alle fuenf von „Ueber mich“ (ElevenLabs-Guthaben war leer)" },
    { seit: "2026-09-18T18:38", nurBetreiber: true,
      text: "Cloudflare: Turn Token ID liegt vor, der API Token fehlt noch — Einstellungen, Karte „Klassenzimmer-Relais“" },
    { seit: "2026-09-18T18:38", nurBetreiber: true,
      text: "TikTok-Variante (Cloudflare Realtime SFU): Preis noch nicht geprueft, Netz von hier gesperrt — vor dem Bauen nachsehen" },
    { seit: "2026-09-18T18:38",
      text: "Namen vorschlagen, sobald ein Befehl einen braucht — und Hinweis, wenn ein Befehl ohne Namen keinen Sinn ergibt" },
    { seit: "2026-09-18T18:38",
      text: "Profilrahmen schoener, Regenbogen deutlicher, dazu ein magisches Funkeln beim Sprechen" },
    { seit: "2026-09-18T18:38",
      text: "Wortauswahl-Spiel: ein Wort, mehrere Schreibweisen, wer richtig waehlt bekommt eine Note im Laufband" },
    { seit: "2026-09-18T18:38",
      text: "Sprachnachricht zurueckrufen oder loeschen" },
    { seit: "2026-09-18T18:38",
      text: "„Der Unterricht beginnt“ auch als Chat-Befehl mit Eintrag im Laufband" },
    { seit: "2026-09-18T18:38",
      text: "Echte Bilder fuer „Menschen, Dinge, Geschichten“ im Kompass" },
    { seit: "2026-09-18T18:38",
      text: "Fehlende Animationen: Umarmung, Boxen, Route 66" },
    { seit: "2026-09-18T18:38",
      text: "Animationen ueberarbeiten: Aquarium, Aegypten, KITT, Weihnachtsmann, Strudel, Zombie, Jalousie, Spukschloss" },
    { seit: "2026-09-18T18:38",
      text: "Stripe-Stufen 1-5 Euro (Super User)" },
    { seit: "2026-09-18T18:38",
      text: "Sitzende Seitenansicht fuers Profil" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-18T18:38",
      text: "/i erreicht jetzt auch Leute, die gar nicht da sind: die Einladung landet mit Link im Postfach — aber nur, wenn die Person nicht schon in einem Raum sitzt" },
    { seit: "2026-09-18T18:38",
      text: "/i ohne Namen zeigt deine Freundesliste, mit Hinweis wer gerade da ist und wer Post bekaeme" },
    { seit: "2026-09-18T18:38",
      text: "Harte Bremse gegen jede Rechnung: hoechstens 1 GB im Monat, im SCHLIMMSTEN Fall gerechnet (72 MB je Ausgabe). Ist Schluss, laeuft das Klassenzimmer direkt weiter — das kostet nichts" },
    { seit: "2026-09-18T18:38",
      text: "Die Bremse steht in den Einstellungen: verbraucht von, und du kannst die Grenze selbst setzen" },
    { seit: "2026-09-18T18:38",
      text: "Edge-Function neu hochgeladen (Version 2, aktiv) — mit Bremse und Budget-Anzeige" },
    { seit: "2026-09-18T18:38",
      text: "Fokus-Modus: solange eine Wortmeldung laeuft, nimmt niemand sonst auf. Schreiben geht weiter. /fokus schaltet um" },
    { seit: "2026-09-18T18:38",
      text: "Der Kopf der Chatzeile sagt jetzt auch, dass das Mikrofon wartet — nicht nur wer spricht" },
    { seit: "2026-09-18T18:38",
      text: "Sprachnachrichten sind im Chat ZU: eine schmale Zeile, ein Tipp klappt Abspielen und Herunterladen auf" },
  ],
};
