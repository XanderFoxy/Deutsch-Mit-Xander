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
  stand: "Fassung 333 — kein Vollbildknopf mehr, Ton ohne Pumpen, 27 Prompts",

  inArbeit: [
    { seit: "2026-09-19T07:57",
      text: "Neue Filme von dir: Dämonenfratze, King Kong, Weihnachtsschlitten, Unterwasser" },
    { seit: "2026-09-19T07:57",
      text: "Sitzende Seitenansicht in den Bilderrätseln einsetzen" },
    { seit: "2026-09-19T07:57",
      text: "Tutor-Figur, die in jedem Bereich hereinkommt und erklärt" },
    { seit: "2026-09-19T07:57",
      text: "Grosses Schloss und die Tür, die sich über dem Chat abschliesst" },
    { seit: "2026-09-19T07:57", nurBetreiber: true,
      text: "21 Tutor-Stücke warten auf deine Stimme" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-19T07:57",
      text: "Vollbild-Symbol weg: kein controls, kein Bild-im-Bild, kein AirPlay, keine WebKit-Leiste" },
    { seit: "2026-09-19T07:57",
      text: "Auch der YouTube-Musikspieler hat keinen Vollbildknopf mehr (fs=0)" },
    { seit: "2026-09-19T07:57",
      text: "Ton zweistufig geregelt — Streuung 0,9 dB statt 5,5, kein Pumpen mehr" },
    { seit: "2026-09-19T07:57",
      text: "Neue Filmsorte „Szene“: ganze Welten mit Umgebung, als Kinobild über dem Chat" },
    { seit: "2026-09-19T07:57",
      text: "filme/PROMPTS.md — 27 fertige Prompts, jeder als ganzer Text" },
    { seit: "2026-09-19T07:57",
      text: "Einstellungen festgelegt: 9:16, 720p, 10 s für Geschenke, 12-15 s für Szenen" },
    { seit: "2026-09-19T07:57",
      text: "Grok automatisch ansteuern geht nicht: kein Connector, api.x.ai gesperrt (geprüft)" },
  ],
};
