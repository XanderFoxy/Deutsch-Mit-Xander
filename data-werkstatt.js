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
  stand: "Fassung 330 — die Geschenke zeigen jetzt echte Filme",

  inArbeit: [
    { seit: "2026-09-19T06:15",
      text: "Sitzende Seitenansicht in den Bilderrätseln einsetzen" },
    { seit: "2026-09-19T06:15",
      text: "Tutor-Figur, die in jedem Bereich hereinkommt und erklärt" },
    { seit: "2026-09-19T06:15", nurBetreiber: true,
      text: "21 Tutor-Stücke warten auf deine Stimme" },
    { seit: "2026-09-19T06:15", nurBetreiber: true,
      text: "Für weitere Filme brauche ich einen Bildschlüssel (Leonardo oder ElevenLabs aufgefüllt)" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-19T06:15",
      text: "Fünf Filme freigestellt: T-Rex, Löwe, Adler, Dampflok, Schnellzug" },
    { seit: "2026-09-19T06:15",
      text: "/trex, /loewe, /adler zeigen den Film statt der Zeichnung — /lok und /zug sind neu" },
    { seit: "2026-09-19T06:15",
      text: "Freisteller repariert: Lok und Adlerkopf waren fast durchsichtig (0,22 → 0,16)" },
    { seit: "2026-09-19T06:15",
      text: "Beim Löwen läuft der Felsen unten sanft aus, statt als Balken über dem Chat zu liegen" },
    { seit: "2026-09-19T06:15",
      text: "Die Filme hören nicht mehr abrupt auf — die letzte Sekunde blendet aus" },
    { seit: "2026-09-19T06:15",
      text: "/film ohne Namen zählt jetzt alle vorhandenen Filme auf" },
    { seit: "2026-09-19T06:15",
      text: "Bleibt ein Film aus, sagt der Chat im Klartext warum — mit deiner Fassungsnummer" },
    { seit: "2026-09-19T06:15",
      text: "/befund hat einen Abschnitt „Filme“: Weg, Fassung, letzter Fehlgrund" },
  ],
};
