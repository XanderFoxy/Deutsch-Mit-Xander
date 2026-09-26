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
  stand: "Fassung 698 – Funk 139–142 (Fehler) fertig; als Nächstes: Freigabe für Beta, Klassen, Dorf-Berufe",

  inArbeit: [
    { seit: "2026-09-26T08:39",
      text: "Freigabe neuer Sachen: erst du + Beta-Tester, dann alle" },
    { seit: "2026-09-26T08:39",
      text: "Kämpferklassen: Magier, Dieb, Titan, Heiler, Ingenieur, Deutsch-Gelehrter" },
    { seit: "2026-09-26T08:39",
      text: "Strategie gegen Mitspieler sichtbar (Figuren, Züge, Fairness)" },
    { seit: "2026-09-26T08:39",
      text: "Dorf: Berufe, Wissenschaft, Sehenswürdigkeiten, Automatik, Hunger" },
    { seit: "2026-09-26T08:39",
      text: "Premium mit Stripe + GoFundMe (braucht dein Stripe-Konto)" },
    { seit: "2026-09-26T08:39",
      text: "Rest aus Funk 139 (Superwaffen, Zauber-Feinschliff, Android-Umbrüche, Deutsch-Aufgaben-Pool …)" },
    { seit: "2026-09-26T08:39",
      text: "ElevenLabs-Schlüssel erneuern" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-26T08:39",
      text: "Update-Blase oben wieder wie vorher" },
    { seit: "2026-09-26T08:39",
      text: "Auftritt: Fahrzeuge fahren hinter den Gesichtern durch, Zauberwolke hinter dem Bild" },
    { seit: "2026-09-26T08:39",
      text: "Wetter: eigene Symbole, Mond nachts, Ort wählbar (Berlin, Döbeln, Standort)" },
    { seit: "2026-09-26T08:39",
      text: "Mauern halten je Waffenart anders, Diamant nur mit ★★★-Energiewaffe" },
    { seit: "2026-09-26T08:39",
      text: "Schiffe versenken ohne Sprechbild, Stadt-Land-Fluss als Overlay" },
    { seit: "2026-09-26T08:39",
      text: "Walkie-Diktat im Livestream (Mikrofon wird ausgeliehen)" },
    { seit: "2026-09-26T08:39",
      text: "Anziehen: nach dem Login nicht mehr wieder angezogen" },
  ],
};
