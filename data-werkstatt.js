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
  stand: "Fassung 887 — Livestream ohne Hänger · in Arbeit: Umbau auf Module (M3b Übungen, M4 Tutor/Betonung, M5 Stadt)",

  inArbeit: [
    { seit: "2026-11-01T06:00",
      text: "Umbau auf Module (Vite): Schritte M3b, M4 und M5 in Arbeit" },
    { seit: "2026-10-25T00:42",
      text: "Fuchs-Wertung auf dem Server rechnen – braucht eine Datenbank-Änderung" },
    { seit: "2026-10-24T15:21",
      text: "Weitere große Abfragen verkleinern (Duelle, Mitgliederliste, Benachrichtigungen, Postfach beim Öffnen)" },
    { seit: "2026-10-25T20:00",
      text: "Rückkehr in den Raum, Fall A (bis +0,12 s in seltenen Fällen) – wartet auf deine Entscheidung" },
    { seit: "2026-11-01T05:05",
      text: "Vorschlag (wartet auf dein OK): 1–2-Sekunden-Stillstand etwa 10 s nach dem Betreten weg (Autos nicht mehr vorab malen) – Preis: ein Ruck von ~0,9 s beim ersten Auto-Auftritt; besser ohne Ruck in 888" },
    { seit: "2026-11-01T14:03",
      text: "Für 888: Chatverlauf im Gerät in Stücken speichern – dann fällt auch der kurze Ruck beim Sichern weg (alle 20 s ein Bild von 70–170 ms)" },
    { seit: "2026-10-14T04:06",
      text: "Feldbeleg Ton 310: Berichte ton-weg auswerten" },
    { seit: "2026-10-14T04:06",
      text: "Aussprache- und Tonserver-Funktion hochladen (wartet auf OK)" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-11-07T19:50",
      text: "Chat-Flut: eine neue Zeile kostet 10 statt 180 ms (mit Profilfotos 11 statt 580 ms); im Nachbau ist die Seite in der Flut kaum noch belegt (0–11 % statt 58–82 %)" },
    { seit: "2026-11-07T19:50",
      text: "Tippen im vollen Klassenzimmer: langsamste Eingabe 0,2 statt 1 s, Betreten 0,25 statt 0,85 s" },
    { seit: "2026-11-07T19:50",
      text: "Verlauf beim Betreten: jede weitere Seite 65 statt 1 532 ms" },
    { seit: "2026-11-07T19:50",
      text: "Spieltakt: keine Speicher-Schreibvorgänge mehr in jedem Takt, halb so viele Layout-Messungen" },
    { seit: "2026-11-07T19:50",
      text: "Profilfotos liegen einmal im Gerät statt in jeder Chatzeile, sind beim Betreten sofort da und lassen dem Speicher genug Platz" },
    { seit: "2026-11-07T19:50",
      text: "Chat sichert gebündelt (höchstens alle 20 s) statt bei jeder Zeile, beim Weggehen, Verdecken und Raumwechsel sofort" },
    { seit: "2026-11-07T19:50",
      text: "Datenbank-Baustein (supabase-js) fest auf 2.119.0 – keine ungeprüfte neue Fassung mehr für alle" },
    { seit: "2026-11-07T19:50",
      text: "Die Messung bei euch sagt jetzt, welches Skript hängt (ohne Inhalte)" },
  ],
};
