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
  stand: "Fassung 542 — Runde 100",

  inArbeit: [
    { seit: "2026-09-24T00:59",
      text: "Lehrer-Panel (wartet auf deine Auswahl)" },
    { seit: "2026-09-24T00:59",
      text: "Aufdecken: nach einem Fehler weiter zum Nächsten" },
    { seit: "2026-09-24T00:59",
      text: "Angel: Schnur-Physik, senkrecht heben" },
    { seit: "2026-09-24T00:59",
      text: "Lasso: eine Schlinge, zieht die Person mit" },
    { seit: "2026-09-24T00:59",
      text: "Zylinder: Glitch vor dem Herauskommen" },
    { seit: "2026-09-24T00:59",
      text: "Sprühdose: Abputzen realistischer" },
    { seit: "2026-09-24T00:59",
      text: "Sabbern: Mund lebendiger, Bild kippt leicht" },
    { seit: "2026-09-24T00:59",
      text: "Kuss: Männerstimme natürlicher" },
    { seit: "2026-09-24T00:59",
      text: "Vogelkot: alter oder neuer Klang" },
    { seit: "2026-09-24T00:59",
      text: "Blume ohne Lücken" },
    { seit: "2026-09-24T00:59",
      text: "Hände realistisch" },
    { seit: "2026-09-24T00:59",
      text: "Mario: Röhren als Hindernisse" },
    { seit: "2026-09-24T00:59",
      text: "Neue Animation „Abstand“ (wegschieben)" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-24T00:59",
      text: "Kran: echter Turmdrehkran (Führerhaus, Turmspitze, Gegengewicht), gleich starkes Gerüst, Bild und Katze im Gleichschritt" },
    { seit: "2026-09-24T00:59",
      text: "Leiter: Landung erst nach dem letzten Sprossen-Ton" },
    { seit: "2026-09-24T00:59",
      text: "Lok noch größer (1,7 Platzbreiten)" },
    { seit: "2026-09-24T00:59",
      text: "Effekt-Töne auch auf dem iPhone" },
    { seit: "2026-09-24T00:59",
      text: "Zu zweit reisen: „Mit wem?“ vom eigenen Bild aus" },
  ],
};
