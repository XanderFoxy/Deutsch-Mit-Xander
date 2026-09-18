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
  stand: "Runde 64 — Melden statt Mikrofon, Moderator kann stummschalten",

  inArbeit: [
    { seit: "2026-09-18T16:13",
      text: "18 Tutor-Stuecke ohne Ton: ElevenLabs-Quote ist aufgebraucht (16 von 130.589 Credits)" },
    { seit: "2026-09-18T16:13",
      text: "Tutor als bewegtes Video mit Lippensynchronitaet" },
    { seit: "2026-09-18T16:13",
      text: "Echte freigestellte Bilder fuer Menschen, Dinge, Geschichten" },
    { seit: "2026-09-18T16:13",
      text: "Animationen: Umarmung, Boxen, Route 66 fehlen ganz" },
    { seit: "2026-09-18T16:13",
      text: "Animationen ueberarbeiten: Aquarium, Aegypten, KITT, Weihnachtsmann, Strudel, Zombie, Jalousie, Spukschloss" },
    { seit: "2026-09-18T16:13",
      text: "Platztausch per Klick, /invite ins Postfach, Favoriten, Symbole bei den Befehlen" },
    { seit: "2026-09-18T16:13",
      text: "Stripe: Super User 1 bis 5 Euro" },
    { seit: "2026-09-18T16:13",
      text: "Livestream: es fehlt nur noch dein Cloudflare-Schluessel" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-18T16:13",
      text: "Melden-Hand als SVG statt Mikrofon — mit Haekchen fuer dauerhaftes Sprechen" },
    { seit: "2026-09-18T16:13",
      text: "Haekchen an: aus der Hand wird ein sprechender Mund" },
    { seit: "2026-09-18T16:13",
      text: "Mini-Melden-Knopf im Klassenzimmer-Streifen, zwischen Text und Zurueck" },
    { seit: "2026-09-18T16:13",
      text: "/stumm nimmt die Stimme, nicht die Tastatur — schreiben geht weiter" },
    { seit: "2026-09-18T16:13",
      text: "Meldungen stehen in der Reihenfolge, in der sie kamen" },
    { seit: "2026-09-18T16:13",
      text: "Kompass zum dritten Mal richtiggestellt — jetzt nach deiner Beschreibung" },
    { seit: "2026-09-18T16:13",
      text: "Intro erklaert den Kopfbereich: Kalender, Profil, Tasse, Wetter, Uhrzeit, Newsticker" },
    { seit: "2026-09-18T16:13",
      text: "Deutsch-Helfer statt Deutschlehrer" },
  ],
};
