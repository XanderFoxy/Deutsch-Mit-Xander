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
  stand: "Runde 98 — Fassung 508",

  inArbeit: [
    { seit: "2026-09-23T11:56",
      text: "Ein Gesicht fehlt noch: okay — der Bildzugang laesst im kostenlosen Plan nur drei Bilder je Zeitfenster zu" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-23T11:56",
      text: "Zu zweit reisen: Fahrrad, Huepfball mit Hoernern, und der selbst gezeichnete Weg (/gemeinsam Bea ball 3-4-8)" },
    { seit: "2026-09-23T11:56",
      text: "Das aufgespruehte Bild: echte Pixel (94 % statt 32 %), und ein GIF laeuft jetzt auch WAEHREND des Spruehens weiter" },
    { seit: "2026-09-23T11:56",
      text: "Zwei neue Profil-Effekte: die aufbluehende Blume und die Leiter zum Hochklettern" },
    { seit: "2026-09-23T11:56",
      text: "Die Ueberschrift der Lesetafel steht wieder waagerecht — bei 360 px waren es 18 Zeilen, jetzt 2" },
    { seit: "2026-09-23T11:56",
      text: "Der Fokus gilt fuer alle und steht im neuen Fokusband unter dem Chat — dreissig neue Zeilen ruecken ihn nicht mehr weg" },
    { seit: "2026-09-23T11:56",
      text: "Aufdecken geht wirklich reihum; wer dazwischenruft, dreht die Runde nicht weiter" },
    { seit: "2026-09-23T11:56",
      text: "Schiffe versenken laesst sich wirklich beenden — auch beim Schiedsrichter bleibt nichts liegen" },
    { seit: "2026-09-23T11:56",
      text: "Stadt-Land-Fluss: der Punktbeste wird Spielfuehrer und bestimmt den naechsten Buchstaben" },
    { seit: "2026-09-23T11:56",
      text: "Alex' Gesicht als Reaktion: sechs von sieben (ohmygod, wow, verbissen, schockiert, Leute, Hallo)" },
    { seit: "2026-09-23T11:56",
      text: "Mario: Spielgeraeusche plus Schrei, und gewuerfelt statt stur abwechselnd" },
    { seit: "2026-09-23T11:56",
      text: "Alle 222 Sonden gruen — acht waren beim Durchlauf heute Mittag noch rot (Lok, Spraybild, Mario, Huepfball, Angel-Kachel, Vogelkot, Wegfahrzeuge)" },
  ],
};
