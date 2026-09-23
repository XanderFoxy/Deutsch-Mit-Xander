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
  stand: "Fassung 507 — Hände, Hut, Lok und die Sprühdose",

  inArbeit: [
    { seit: "2026-09-23T01:41",
      text: "Die grosse Sammelprüfung läuft noch durch (rund zwei Stunden) — danach kommt die neue Übersichtsliste" },
    { seit: "2026-09-23T01:41",
      text: "Antwort zu Recraft und den HelloTalk-Effekten liegt in werkzeug/profi-effekte.md" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-23T01:41",
      text: "Eine Haut für ALLE Hände: Ohrfeige, Basketball, Streicheln, Klaps, Hut und die Riesenhand holen ihre Farbe jetzt aus einer einzigen Quelle" },
    { seit: "2026-09-23T01:41",
      text: "Die greifende Hand hat keine Modul-Ringe mehr: die Fingerglieder greifen untereinander, die Kante läuft nur noch aussen durch" },
    { seit: "2026-09-23T01:41",
      text: "Der Cowboyhut wird nach links UND nach rechts zurechtgerückt und sitzt erst dann" },
    { seit: "2026-09-23T01:41",
      text: "Die Lok steht auf ihrem Gleis: Radkanten und Spurweite decken sich (0,1 px), und sie ist kürzer als ihr Kurvendurchmesser" },
    { seit: "2026-09-23T01:41",
      text: "Die Sprühdose kann ein BILD deiner Wahl aufsprühen — aus deiner Sammlung, aus den zuletzt benutzten oder von einer Adresse" },
    { seit: "2026-09-23T01:41",
      text: "Schiffe versenken sagt beim Start nicht mehr das Falsche (es wird nichts mehr ausgelost, man sucht sich selbst einen Platz)" },
  ],
};
