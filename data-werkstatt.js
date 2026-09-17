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
  stand: "Runde 35 — die Tuer war zu",

  inArbeit: [
    { seit: "2026-09-17T22:11",
      text: "Umarmung: eine Figur zu gross, langer Hals — wird ueberarbeitet" },
    { seit: "2026-09-17T22:11",
      text: "Haende klatschen sehen aus wie Handschuhe" },
    { seit: "2026-09-17T22:11",
      text: "Newsticker: deine Live-Zeile ist gross statt dezent" },
    { seit: "2026-09-17T22:11",
      text: "Sounds fuer die Animationen — dafuer brauche ich einen Schluessel, sag Bescheid" },
    { seit: "2026-09-17T22:11",
      text: "Mehr Animationen: Enten, Katzenbaby, Piratenschiff, Strudel, Schwamm, Schuesse" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-17T22:11",
      text: "Gefunden: 19 Animationen waren gezeichnet, aber per Befehl NICHT erreichbar" },
    { seit: "2026-09-17T22:11",
      text: "Darunter Keks, Cash und Glasbruch — du hattest jedes Mal recht, ich habe das Falsche geprueft" },
    { seit: "2026-09-17T22:11",
      text: "Alle 52 sind jetzt aufrufbar, nachgeprueft mit pruefe-effekttueren.js" },
    { seit: "2026-09-17T22:11",
      text: "Alle 2239 A1-Woerter mit deiner Stimme sind da — kein einziger Fehler" },
    { seit: "2026-09-17T22:11",
      text: "Nachgemessen: der Abschneider hat 'Fluss' auf 0,19 s gekuerzt statt 0,44 — berichtigt" },
    { seit: "2026-09-17T22:11",
      text: "Die Rohaufnahmen bleiben jetzt liegen, damit Nachschleifen nichts mehr kostet" },
  ],
};
