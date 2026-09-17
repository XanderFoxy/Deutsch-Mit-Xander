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
  stand: "Runde 40 — die GIPHY-Bibliothek scrollt endlos",

  inArbeit: [
    { seit: "2026-09-17T23:03",
      text: "Sounds fuer die Animationen — dafuer brauche ich einen Schluessel, sag Bescheid" },
    { seit: "2026-09-17T23:03",
      text: "Route 66: Wagen kommt aus der Ferne auf einen zu" },
    { seit: "2026-09-17T23:03",
      text: "TikTok-artige Geschenk-Grafiken" },
    { seit: "2026-09-17T23:03",
      text: "Jemanden ueber sein Postfach in den Raum einladen" },
    { seit: "2026-09-17T23:03",
      text: "Plaetze spontan tauschen" },
    { seit: "2026-09-17T23:03",
      text: "Alle Leute raumuebergreifend sehen" },
    { seit: "2026-09-17T23:03",
      text: "Lieblingsbefehle als Favoriten in der Tipphilfe" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-17T23:03",
      text: "GIPHY laedt jetzt nach, solange GIPHY etwas hat — statt nach 24 Bildern Schluss" },
    { seit: "2026-09-17T23:03",
      text: "Langes Druecken aufs Profilbild oeffnet die volle Bibliothek: Themen, sofort Bilder, echte Suche" },
    { seit: "2026-09-17T23:03",
      text: "Vorher war das Feld dort leer, bis man etwas eingetippt hat" },
    { seit: "2026-09-17T23:03",
      text: "Nachgeprueft: 24 → 48 Bilder beim Scrollen, in beiden Faechern" },
  ],
};
