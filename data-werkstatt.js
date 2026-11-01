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
  stand: "Fassung 886 — Ladezeit · Fassung 887 — Livestream ohne Hänger: nachgebessert im Zweig live-haenger, wird nach 886 ausgeliefert",

  inArbeit: [
    { seit: "2026-11-01T05:05",
      text: "Fassung 887 – Livestream ohne Hänger: Chat-Flut, Tippen, Verlauf und Spieltakt entlastet; nachgebessert (Verlauf geht beim Weggehen nicht mehr verloren, Fotos sofort da), wird nach 886 ausgeliefert" },
    { seit: "2026-11-01T09:30",
      text: "Fassung 887 – grünes Licht im Klassenzimmer erst nach dem Fassungs-Abgleich (nach dem Neuladen nur eine Verbindung statt zwei)" },
    { seit: "2026-11-01T05:05",
      text: "Vorschlag (wartet auf dein OK): 1–2-Sekunden-Stillstand etwa 10 s nach dem Betreten weg (Autos nicht mehr vorab malen) – Preis: ein Ruck von ~0,9 s beim ersten Auto-Auftritt; besser ohne Ruck in 888" },
    { seit: "2026-11-01T06:00",
      text: "Umbau auf Module (Vite): Grundlage steht, erstes Modul = Walkie, wird geprüft" },
    { seit: "2026-10-24T15:21",
      text: "Im Supabase-Dashboard (Usage) nachsehen, welches Kontingent voll ist – die Sperre endet mit dem neuen Abrechnungsmonat oder mit einem Upgrade" },
    { seit: "2026-10-24T15:21",
      text: "Weitere große Abfragen verkleinern (Duelle, Mitgliederliste, Benachrichtigungen, Postfach beim Öffnen) – laufen nur noch bei sichtbarer Seite" },
    { seit: "2026-10-25T00:42",
      text: "Fuchs-Wertung auf dem Server rechnen – braucht eine Datenbank-Änderung" },
    { seit: "2026-10-25T04:47",
      text: "Ohne Netz beim App-Wechsel nur eine Probe-Abfrage statt aller Takte (erreicht den Server ohnehin nicht)" },
    { seit: "2026-10-25T20:00",
      text: "Rückkehr in den Raum, Fall A (bis +0,12 s in seltenen Fällen) – wartet auf deine Entscheidung" },
    { seit: "2026-10-14T04:06",
      text: "Feldbeleg Ton 310: Berichte ton-weg auswerten" },
    { seit: "2026-10-14T04:06",
      text: "Aussprache- und Tonserver-Funktion hochladen (wartet auf OK)" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-11-01T13:02",
      text: "Chat-Flut: eine neue Zeile kostet 10 statt 180 ms (mit Fotos 11 statt 580 ms), die Seite ist in der Flut zu 11 statt 69–82 % belegt" },
    { seit: "2026-11-01T13:02",
      text: "Tippen im vollen Klassenzimmer: Wartezeit 94 ms statt 1,2–7 s (Median), langsamste Eingabe 0,5 statt 3,5–7 s" },
    { seit: "2026-11-01T13:02",
      text: "Verlauf beim Betreten: längstes Bild 150 statt 1 532 ms, jede weitere Seite 65 ms" },
    { seit: "2026-11-01T13:02",
      text: "Spieltakt: keine Speicher-Schreibvorgänge mehr in jedem Takt, halb so viele Layout-Messungen" },
    { seit: "2026-11-01T13:02",
      text: "Profilfotos liegen einmal im Gerät statt in jeder Chatzeile (und sind beim Betreten sofort da); die Messung bei euch sagt jetzt, welches Skript hängt (ohne Inhalte)" },
  ],
};
