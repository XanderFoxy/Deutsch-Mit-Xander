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
  stand: "Runde 19 — Schrei, Einladen ohne Riegel, Welle ohne Kante",

  inArbeit: [
    { seit: "2026-09-18T19:37",
      text: "Buehnenansicht: wer oben ist, sieht nur die anderen oben" },
    { seit: "2026-09-18T19:37",
      text: "Befehlserklaerungen auf dem Telefon sichtbar machen (/t, /f, /l)" },
    { seit: "2026-09-18T19:37",
      text: "Favoriten im Befehlspanel selbst anheften" },
    { seit: "2026-09-18T19:37",
      text: "Kopfzeile „alle im Raum\" wird bei Android abgeschnitten" },
    { seit: "2026-09-18T19:37",
      text: "18 Tutorsaetze ohne Ton" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-18T19:37",
      text: "Keine Zeitschaltuhr mehr: zum Unterricht rufen geht, wann du willst — in den Einstellungen und mit /unterricht" },
    { seit: "2026-09-18T19:37",
      text: "Einladen ist nicht mehr blockiert: /i Name ruft UND legt die Einladung ins Postfach, auch wenn die Person gerade woanders sitzt" },
    { seit: "2026-09-18T19:37",
      text: "Die Schallwelle beim Schreien hat keine Kanten mehr — gemessen: Helligkeitssprung 34,4 auf 1,0 von 255" },
    { seit: "2026-09-18T19:37",
      text: "Der Schrei klingt nach dem Absender: maennliche Stimme fuer Maenner, weibliche fuer Frauen (aus dem Profil)" },
    { seit: "2026-09-18T19:37",
      text: "Echtes Echo beim Schreien: der Ruf kommt drei Mal, jedes Mal leiser und tiefer; der Hall tritt dahinter zurueck" },
  ],
};
