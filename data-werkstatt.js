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
  stand: "Runde 45 — 36 Geraeusche, Fische richtig herum, Daumen verbunden",

  inArbeit: [
    { seit: "2026-09-18T00:30", nurBetreiber: true,
      text: "WICHTIG: die Seite laeuft auf main — meine 10 Runden liegen auf dem Zweig und sind NICHT live" },
    { seit: "2026-09-18T00:30",
      text: "Fratze gruseliger, Sternschnuppen und Regen physikalisch richtig" },
    { seit: "2026-09-18T00:30",
      text: "Jalousie und Hand sollen den Chat wirklich aufreissen" },
    { seit: "2026-09-18T00:30",
      text: "Vokabeltrainer: nur eine Aufgabe je Runde, eigene Liste nicht waehlbar" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-18T00:30",
      text: "24 weitere Geraeusche: Jubel, fieses Lachen, Bratzeln beim Stromausfall, Schlittenglocken, Vulkan, Erdbeben" },
    { seit: "2026-09-18T00:30",
      text: "Route 66: der Wagen kommt jetzt wirklich aus dem Fluchtpunkt statt aus der Bildmitte" },
    { seit: "2026-09-18T00:30",
      text: "Fische schauen in die Richtung, in die sie schwimmen — und es gibt einen Hai" },
    { seit: "2026-09-18T00:30",
      text: "Spinnen von winzig bis handgross, die schweren krabbeln langsamer" },
    { seit: "2026-09-18T00:30",
      text: "Daumen waechst aus der Handflaeche heraus statt danebenzukleben" },
    { seit: "2026-09-18T00:30",
      text: "Verbindungswache: /verbindung zeigt, ob ueberhaupt Tonpakete ankommen" },
  ],
};
