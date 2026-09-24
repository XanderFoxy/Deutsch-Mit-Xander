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
  stand: "Fassung 579: Lok mit Kreis, Tunnel, Schranke und Wagen; Sprechbilder alt + Version 2",

  inArbeit: [
    { seit: "2026-09-24T15:34",
      text: "Adler, Flugzeug/Helikopter Draufsicht, Pferd (Muskel, Trab/Galopp, Tempo)" },
    { seit: "2026-09-24T15:34",
      text: "Roadster-Trompetenrohre, Bild fest auf dem Gestell" },
    { seit: "2026-09-24T15:34",
      text: "Katze läuft, Wange-Hand, Tafelkratzen, Wecker-Hügel, Schaufelbagger, Fahrrad-Kette, Zielfernrohr, Laser, Münze Kopf/Zahl, Blume ohne Paare" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-24T15:34",
      text: "Sprechbilder: alte Fassungen wieder an Ort und Stelle, neue als „… 2“, Strom = Plasmalampe, alter Strom = „Strom 2“" },
    { seit: "2026-09-24T15:34",
      text: "Lok: 1-2-3-4-8-7-6-5 schließt den Kreis durch die Feldmitten" },
    { seit: "2026-09-24T15:34",
      text: "Lok: offene Strecken enden in zwei Tunneln, der Zug kommt aus dem Berg" },
    { seit: "2026-09-24T15:34",
      text: "Lok: Tender + zwei weinrote Abteilwagen, Seiten- und Draufsicht" },
    { seit: "2026-09-24T15:34",
      text: "Lok: Schranke per Zufall auf geraden Stücken, Lok wartet, dann Überfahren" },
    { seit: "2026-09-24T15:34",
      text: "Hot Rod: Bühne räumt pünktlich ab; Hand aus einem Guss" },
  ],
};
