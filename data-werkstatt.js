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
  stand: "Fassung 888 — Module (Vite-Bau, Walkie/Übungen/Tutor/Betonung/Stadt als Module)",

  inArbeit: [
    { seit: "2026-11-14T22:19",
      text: "Einmal auf einem echten iPhone prüfen, ob Tutor und Betonung gleich bereit sind (hier kann ich nur Chrome prüfen)" },
    { seit: "2026-11-14T22:19",
      text: "Nach dem ersten Öffnen wartet „Runde starten“ noch auf den ganzen Wortschatz (im 4G bis gut 1 s, im langsamen Netz bis 10 s; bis zur ersten Frage ist es trotzdem schneller als vorher) – nächster Schritt: Übungen mit festem Niveau ohne ihn starten" },
    { seit: "2026-11-14T22:19",
      text: "Platz auf GitHub Pages: 959 von 1 000 MB belegt – dürfen die alten Sicherungen (werkzeug/backup, 245 MB) aus der Seite raus? (wartet auf dein Ja)" },
    { seit: "2026-11-14T22:19",
      text: "Alte Stadt-Dateien (3,9 MB) mit der nächsten Fassung vom Server und aus den Geräten löschen" },
    { seit: "2026-10-25T00:42",
      text: "Fuchs-Wertung auf dem Server rechnen – braucht eine Datenbank-Änderung" },
    { seit: "2026-10-24T15:21",
      text: "Weitere große Abfragen verkleinern (Duelle, Mitgliederliste, Benachrichtigungen, Postfach beim Öffnen)" },
    { seit: "2026-10-25T20:00",
      text: "Rückkehr in den Raum, Fall A (bis +0,12 s in seltenen Fällen) – wartet auf deine Entscheidung" },
    { seit: "2026-11-01T05:05",
      text: "Vorschlag (wartet auf dein OK): 1–2-Sekunden-Stillstand etwa 10 s nach dem Betreten weg (Autos nicht mehr vorab malen) – Preis: ein Ruck von ~0,9 s beim ersten Auto-Auftritt; besser ohne Ruck in einer nächsten Fassung" },
    { seit: "2026-11-01T14:03",
      text: "Chatverlauf im Gerät in Stücken speichern – dann fällt auch der kurze Ruck beim Sichern weg (alle 20 s ein Bild von 70–170 ms)" },
    { seit: "2026-10-14T04:06",
      text: "Feldbeleg Ton 310: Berichte ton-weg auswerten" },
    { seit: "2026-10-14T04:06",
      text: "Aussprache- und Tonserver-Funktion hochladen (wartet auf OK)" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-11-14T22:19",
      text: "Unsichtbarer Umbau auf Module: Walkie, Übungen, Tutor, Betonung und Stadt kommen als eigene, gebaute Stücke – für dich sieht alles aus wie bisher" },
    { seit: "2026-11-14T22:19",
      text: "Übung beim ersten Öffnen schneller: vom Tipp auf „Lernen“ bis zur ersten Frage im 4G 5,4 → 4,0 s, im langsamen Netz 25 → 15 s" },
    { seit: "2026-11-14T22:19",
      text: "Übungen kommen je Kategorie statt alle auf einmal; der Rest lädt in der Ruhepause nach" },
    { seit: "2026-11-14T22:19",
      text: "Tutor und Betonung als Modul – startet ein Browser das Modul nicht gleich, kommt dasselbe Stück kurz danach, auch ohne Netz" },
    { seit: "2026-11-14T22:19",
      text: "Stadt-Seiten ohne den alten Packer; nach einem Netzfehler laden fehlende Stücke neu" },
    { seit: "2026-11-14T22:19",
      text: "Sonst gleich schnell wie 887: Start, erstes Bild, Wissen, Klassenzimmer, Tutor-Reiter und leichte Stadt" },
  ],
};
