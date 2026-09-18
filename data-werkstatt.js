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
  stand: "Runde 62 — Freisprechen ohne Abschneiden, Tutor hebt hervor",

  inArbeit: [
    { seit: "2026-09-18T15:23",
      text: "Tutor als Video (bewegt, transparent) — Foto-Variante bleibt waehlbar" },
    { seit: "2026-09-18T15:23",
      text: "Animationen: Umarmung, Boxen, Route 66 fehlen noch ganz" },
    { seit: "2026-09-18T15:23",
      text: "Animationen ueberarbeiten: Aquarium, Aegypten, KITT, Weihnachtsmann, Strudel, Zombie, Jalousie, Spukschloss" },
    { seit: "2026-09-18T15:23",
      text: "Toene: Laenge und Sinn je Animation pruefen statt stur schleifen" },
    { seit: "2026-09-18T15:23",
      text: "Platztausch per Klick, /invite ins Postfach, Favoriten, Symbole bei den Befehlen" },
    { seit: "2026-09-18T15:23",
      text: "Stripe: Super User 1 bis 5 Euro" },
    { seit: "2026-09-18T15:23",
      text: "Livestream: es fehlt nur noch dein Cloudflare-Schluessel" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-18T15:23",
      text: "Freisprechen schneidet nichts mehr ab — Rekorder laeuft durchgehend mit" },
    { seit: "2026-09-18T15:23",
      text: "Pseudo-Livestream: Wortmeldungen nacheinander, nicht im Chat" },
    { seit: "2026-09-18T15:23",
      text: "Mitschrieb zum Shadowing einschaltbar (Ohr-Knopf lange druecken)" },
    { seit: "2026-09-18T15:23",
      text: "Sprachnachrichten bis fuenf Minuten, in Stuecken verschickt" },
    { seit: "2026-09-18T15:23",
      text: "Jede Aufnahme laesst sich herunterladen" },
    { seit: "2026-09-18T15:23",
      text: "Einsatz-Ping beim Gedrueckthalten, Mikrofon bleibt eine Minute warm" },
    { seit: "2026-09-18T15:23",
      text: "Tutor hebt den Bereich hervor, waehrend er davon spricht (29 einzelne Aufnahmen)" },
    { seit: "2026-09-18T15:23",
      text: "Tutor: kleine Hilfe und Sprungknopf je Bereich" },
  ],
};
