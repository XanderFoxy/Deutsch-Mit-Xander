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
  stand: "Fassung 536 — Runde 100",

  inArbeit: [
    { seit: "2026-09-23T23:53",
      text: "Lok: größer, gerade Gleise, Seitenansicht auf der Schiene" },
    { seit: "2026-09-23T23:53",
      text: "Blume ohne Lücken" },
    { seit: "2026-09-23T23:53",
      text: "Hände realistisch" },
    { seit: "2026-09-23T23:53",
      text: "Mario: Röhren als Hindernisse" },
    { seit: "2026-09-23T23:53",
      text: "Neue Animation „Abstand“ (wegschieben)" },
    { seit: "2026-09-23T23:53",
      text: "Fokus-Modul" },
    { seit: "2026-09-23T23:53",
      text: "Musik-Panel" },
    { seit: "2026-09-23T23:53",
      text: "Schiffe versenken" },
    { seit: "2026-09-23T23:53",
      text: "Alex-Gesichter: Töne und Mund" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-23T23:53",
      text: "Leiter: kein Zurückspringen beim Platztausch" },
    { seit: "2026-09-23T23:53",
      text: "Walkie-🎤: jeder Fehler sichtbar, nichts bleibt hängen, Fehlercode geht an Claude" },
    { seit: "2026-09-23T23:53",
      text: "Sprühdose: eigene Fotos/GIFs decken den Kreis, Auswahl passt aufs kleine Handy" },
    { seit: "2026-09-23T23:53",
      text: "Zylinder: breitere Röhre, Bild steigt aus der Öffnung" },
    { seit: "2026-09-23T23:53",
      text: "Walkie-Diktat ohne Wortsalat, Doppelleiter mit Lücke" },
    { seit: "2026-09-23T23:53",
      text: "Lok: schmaleres Gleis, Glocke beim Einrollen" },
    { seit: "2026-09-23T23:53",
      text: "Sabbern aus dem Mund über Ring und Bild" },
    { seit: "2026-09-23T23:53",
      text: "Eigene Ekel-Stimmen für Sabbern, Spucken, Vogelkot" },
    { seit: "2026-09-23T23:53",
      text: "Kuss mit „Mmmh“, Stimme nach Geküsstem" },
    { seit: "2026-09-23T23:53",
      text: "Popo-Klaps: echtes Klatschen, Abdruck quer" },
    { seit: "2026-09-23T23:53",
      text: "Kran auch im „Du selbst“-Menü" },
    { seit: "2026-09-23T23:53",
      text: "Übungspuppe (Walkie-Talkie)" },
  ],
};
