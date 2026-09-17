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
  stand: "Runde 39 — sechs neue Animationen",

  inArbeit: [
    { seit: "2026-09-17T22:59",
      text: "Sounds fuer die Animationen — dafuer brauche ich einen Schluessel, sag Bescheid" },
    { seit: "2026-09-17T22:59",
      text: "Route 66: Wagen kommt aus der Ferne auf einen zu" },
    { seit: "2026-09-17T22:59",
      text: "TikTok-artige Geschenk-Grafiken" },
    { seit: "2026-09-17T22:59",
      text: "GIPHY-Bibliothek scrollen, langes Druecken aufs Profilbild" },
    { seit: "2026-09-17T22:59",
      text: "Jemanden ueber sein Postfach in den Raum einladen" },
    { seit: "2026-09-17T22:59",
      text: "Plaetze spontan tauschen" },
    { seit: "2026-09-17T22:59",
      text: "Alle Leute raumuebergreifend sehen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-17T22:59",
      text: "/enten — die Entenmama watschelt mit ihren Kueken durchs Bild" },
    { seit: "2026-09-17T22:59",
      text: "/katze — ein Katzenbaby laeuft zur Scheibe und tappt mit den Pfoten dagegen" },
    { seit: "2026-09-17T22:59",
      text: "/pirat — Piratenschiff mit Totenkopfflagge auf echten Wellen" },
    { seit: "2026-09-17T22:59",
      text: "/strudel — der Chat wird in den Trichter gezogen, die Schrift schrumpft" },
    { seit: "2026-09-17T22:59",
      text: "/schwamm — der Chat wird weggewischt wie von der Tafel" },
    { seit: "2026-09-17T22:59",
      text: "/schuss — Schussloecher schlagen ein, und es laeuft herunter" },
    { seit: "2026-09-17T22:59",
      text: "Alle sechs durch die Tuerpruefung: 58 gezeichnet, alle aufrufbar" },
  ],
};
