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
  stand: "Runde 69 — das Whiteboard liegt jetzt im Profil, nicht mehr auf einem Geraet",

  inArbeit: [
    { seit: "2026-09-21T13:08", nurBetreiber: true,
      text: "GUTHABEN NOETIG: ueber-04b, ueber-03b und ueber-05 fehlen noch auf Greenscreen. Das ElevenLabs-Guthaben ist alle - zuletzt 14.152 von 19.439 noetigen Credits." },
    { seit: "2026-09-21T13:08", nurBetreiber: true,
      text: "Zeilenschutz fuer die 16 alten Tabellen - Tabelle fuer Tabelle, mit passenden Regeln" },
    { seit: "2026-09-21T13:08", nurBetreiber: true,
      text: "Offen geblieben und ehrlich benannt: rollt die Billardkugel durch einen Pulk, wird nur EINMAL abgelenkt - eine Kette aus mehreren Stoessen rechnet sie nicht." },
    { seit: "2026-09-21T13:08", nurBetreiber: true,
      text: "Zwei Saetze neu einsprechen: „Schoen, dass du da bist! Ich bin Alex — Musiker und deutscher Muttersprachler. Ich helfe dir gerne mit Deutsch.\"" },
    { seit: "2026-09-21T13:08", nurBetreiber: true,
      text: "Und: „Oben stehen drei Knoepfe: der Kalender, dein Profilbild, die Kaffeetasse. Im Kalender loest du jeden Tag eine Aufgabe und kommst von da zur Tagesgeschichte — eine Leseuebung in jedem Niveau und in vielen Sprachen.\"" },
    { seit: "2026-09-21T13:08", nurBetreiber: true,
      text: "Frage: die Kompass-Erklaerung im Tutor ist mit 148 Woertern die laengste. Kuerzen — oder so lassen?" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T13:08",
      text: "Sichern lud bisher eine PNG-Datei herunter - die liegt dann auf genau EINEM Geraet. Auf dem Telefon ist sie weg, und wer den Rechner wechselt, faengt von vorn an" },
    { seit: "2026-09-21T13:08",
      text: "Jetzt legt der Diskettenknopf die Tafel ins Profil. Sie liegt am Konto und ist auf jedem Geraet da" },
    { seit: "2026-09-21T13:08",
      text: "Dazu eine Mappe: alles ansehen, zurueckholen oder wegwerfen. Ohne sie waere das Sichern ein Fass ohne Boden" },
    { seit: "2026-09-21T13:08",
      text: "Die neue Tabelle whiteboards hat Zeilenschutz von Anfang an - jeder sieht nur seine eigenen Tafeln" },
    { seit: "2026-09-21T13:08",
      text: "Zurueckgeholt wird die Tafel als HINTERGRUND, nicht als Striche. Die einzelnen Zuege stecken im Bild nicht mehr drin, und so zu tun waere gelogen" },
    { seit: "2026-09-21T13:08",
      text: "Ein zu grosses Bild wird verkleinert statt abgelehnt - ueber 900 KB als Datenadresse" },
    { seit: "2026-09-21T13:08",
      text: "Der Download bleibt als Ausnahme daneben stehen. Und geht das Ablegen schief, wird wenigstens heruntergeladen statt die Zeichnung zu verlieren" },
    { seit: "2026-09-21T13:08", nurBetreiber: true,
      text: "SICHERHEIT, bitte ansehen: 16 aeltere Tabellen haben KEINEN Zeilenschutz - darunter profiles und private_messages mit 1442 Zeilen. Wer den anon-Schluessel hat (der steht zwangslaeufig in supabase-config.js), kann dort alles lesen und aendern. Ich habe daran NICHTS geaendert: Zeilenschutz ohne passende Regeln sperrt sofort alles aus. Das gehoert Tabelle fuer Tabelle gemacht - sag Bescheid, dann mache ich es mit dir zusammen." },
  ],
};
