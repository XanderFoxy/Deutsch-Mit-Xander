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
  stand: "Fassung 887 — Livestream ohne Hänger (fertig im Zweig live-haenger, wird nach 886 ausgeliefert)",

  inArbeit: [
    { seit: "2026-10-24T15:21",
      text: "Im Supabase-Dashboard (Usage) nachsehen, welches Kontingent voll ist – die Sperre endet mit dem neuen Abrechnungsmonat oder mit einem Upgrade" },
    { seit: "2026-10-25T00:42",
      text: "Alle eigenen Tabs (Handy, Tablet, Rechner) einmal neu laden oder schließen – ein schon offener 884-Tab holt 885 nicht von selbst" },
    { seit: "2026-10-24T15:21",
      text: "Weitere große Abfragen verkleinern (Duelle, Mitgliederliste, Benachrichtigungen, Postfach beim Öffnen) – laufen nur noch bei sichtbarer Seite" },
    { seit: "2026-10-25T00:42",
      text: "Fuchs-Wertung auf dem Server rechnen (Jahres-Wertung lädt alle Runden seit 1.1., jetzt nur noch alle 6 h) – braucht eine Datenbank-Änderung nach der Sperre" },
    { seit: "2026-10-25T04:47",
      text: "Ohne Netz beim App-Wechsel nur eine Probe-Abfrage statt aller Takte (erreicht den Server ohnehin nicht)" },
    { seit: "2026-10-14T04:06",
      text: "Fassung 886 – Ladezeit: Seite zuerst aus dem Speicher, „Über mich“ und offene Räume sofort, schlankerer Start; mit der Notfall-Bremse von 885 zusammengeführt, noch nicht ausgeliefert" },
    { seit: "2026-10-25T20:00",
      text: "Rückkehr in den Raum nach dem Neuladen: in zwei seltenen Fällen etwas langsamer als 884 (bis +0,12 s bzw. bis +0,6 s) – wartet auf deine Entscheidung (Logbuch: Fall A Empfehlung a, Fall B Empfehlung c)" },
    { seit: "2026-11-01T05:05",
      text: "Fassung 887 – Livestream ohne Hänger: Chat-Flut, Verlauf und Spieltakt entlastet; fertig, wird nach 886 ausgeliefert" },
    { seit: "2026-11-01T05:05",
      text: "Auto-Auftritt (Batmobil/Viper) ruckelt auf dem Telefon beim ersten Bild – Bitmaps früher vorbereiten (888)" },
    { seit: "2026-10-14T04:06",
      text: "Profi-Umbau auf Module mit Vite (Funk 312) – läuft im eigenen Zweig" },
    { seit: "2026-10-14T04:06",
      text: "Feldbeleg Ton 310: Berichte ton-weg auswerten" },
    { seit: "2026-10-14T04:06",
      text: "Aussprache- und Tonserver-Funktion hochladen (wartet auf OK)" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-11-01T06:21",
      text: "Chat-Flut: eine neue Zeile kostet 10 statt 180 ms (mit Fotos 11 statt 580 ms), die Seite ist in der Flut zu 6 statt 69 % belegt" },
    { seit: "2026-11-01T06:21",
      text: "Tippen im vollen Klassenzimmer: Wartezeit 85 ms statt 1,2 s (Median), langsamste Eingabe 0,5 statt 3,5 s" },
    { seit: "2026-11-01T06:21",
      text: "Verlauf beim Betreten: längstes Bild 150 statt 1 532 ms, jede weitere Seite 65 ms" },
    { seit: "2026-11-01T06:21",
      text: "Spieltakt: keine Speicher-Schreibvorgänge mehr in jedem Takt, halb so viele Layout-Messungen" },
    { seit: "2026-11-01T06:21",
      text: "Profilfotos liegen einmal im Gerät statt in jeder Chatzeile" },
    { seit: "2026-11-01T06:21",
      text: "Die Messung bei euch sagt jetzt, welches Skript hängt (ohne Inhalte)" },
  ],
};
