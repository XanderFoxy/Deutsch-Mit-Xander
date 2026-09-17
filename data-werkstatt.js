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
  stand: "Runde 20 — der Hintergrund",

  inArbeit: [
    { seit: "2026-09-17T14:22",
      text: "Hintergrund fuer alle im Raum sichtbar machen." },
    { seit: "2026-09-17T14:22",
      text: "Raumliste mit einem Klick: offen, verschlossen, wer ist wo." },
    { seit: "2026-09-17T14:22",
      text: "Newsfeed meldet, was im Klassenzimmer passiert." },
    { seit: "2026-09-17T14:22",
      text: "Ton und Bild vor dem Betreten wirklich einschalten." },
    { seit: "2026-09-17T14:22",
      text: "Orkan, Bonbons, Rennauto aufwerten." },
    { seit: "2026-09-17T14:22",
      text: "Druecken als echte Umarmung, gezielt an eine Person." },
    { seit: "2026-09-17T14:22",
      text: "Mehrere Videos rechts stapeln." },
    { seit: "2026-09-17T14:22", nurBetreiber: true,
      text: "Woerterbuch saeubern, dann A1 mit deiner Stimme." },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-17T14:22",
      text: "Der Hintergrund springt nicht mehr beim Aufklappen der Befehle: der Befehlskasten legt sich UEBER den Chat, statt ihn auseinanderzuschieben. Damit aendert sich die Panelhoehe gar nicht (gemessen: 468 px zu wie auf)." },
    { seit: "2026-09-17T14:22",
      text: "Sechs fertige Hintergruende, ohne eigenes Bild: Sternenhimmel, Gluehwuermchen, Weiche Wellen, Nordlicht, Lichterspiel, Schultafel. Alle aus dem Stylesheet gebaut, kein Byte Bilddaten." },
    { seit: "2026-09-17T14:22",
      text: "Der Weg zurueck zum Standard ist jetzt das ERSTE Feld im neuen Auswahlfenster — vorher gab es nur eine Ja-Nein-Frage ohne erkennbaren Ausweg." },
    { seit: "2026-09-17T14:22",
      text: "Der Befehlskasten ist zugeklappt ganz weg statt klein: sonst schrumpfte das Panel beim Aufklappen um 24 Pixel." },
  ],
};
