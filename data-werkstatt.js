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
  stand: "Fassung 886 — Ladezeit · in Arbeit: Fassung 887 — Livestream ohne Hänger, dann Module",

  inArbeit: [
    { seit: "2026-11-01T06:00",
      text: "Fassung 887 – Livestream: Chat speichert nicht mehr bei jeder Zeile alles neu (Hänger 69 % → 6 %, Tipp 1,2 s → 0,09 s in der Nachstellung), wird gerade geprüft" },
    { seit: "2026-11-01T09:30",
      text: "Fassung 887 – grünes Licht im Klassenzimmer erst nach dem Fassungs-Abgleich (nach dem Neuladen nur eine Verbindung statt zwei)" },
    { seit: "2026-11-01T06:00",
      text: "Umbau auf Module (Vite): Grundlage steht, erstes Modul = Walkie, wird geprüft" },
    { seit: "2026-10-24T15:21",
      text: "Weitere große Abfragen verkleinern (Duelle, Mitgliederliste, Benachrichtigungen, Postfach beim Öffnen)" },
    { seit: "2026-10-25T00:42",
      text: "Fuchs-Wertung auf dem Server rechnen – braucht eine Datenbank-Änderung" },
    { seit: "2026-10-25T20:00",
      text: "Rückkehr in den Raum, Fall A (bis +0,12 s in seltenen Fällen) – wartet auf deine Entscheidung" },
    { seit: "2026-10-14T04:06",
      text: "Feldbeleg Ton 310: Berichte ton-weg auswerten" },
    { seit: "2026-10-14T04:06",
      text: "Aussprache- und Tonserver-Funktion hochladen (wartet auf OK)" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-11-01T09:30",
      text: "Start 1,1–1,25× schneller als 885, auf 3G kalt 1,5×, aus dem Speicher bis 1,7×" },
    { seit: "2026-11-01T09:30",
      text: "Wissen öffnet nach dem Start auf 3G 6× schneller (0,35 s statt 2,2 s), sonst 1,3–2×" },
    { seit: "2026-11-01T09:30",
      text: "Seite kommt zuerst aus dem Speicher, „Über mich“ und offene Räume sofort" },
    { seit: "2026-11-01T09:30",
      text: "Foto auf „Über mich“ als eigene, kleinere Kopie (3× schneller)" },
    { seit: "2026-11-01T09:30",
      text: "Notfall-Bremse von 885 bleibt voll erhalten (Start-Tor mit Vorhut bei einer Sperre)" },
  ],
};
