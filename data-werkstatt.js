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
  stand: "Fassung 885 — Notfall: Anfrage-Sturm gebremst (Supabase-Sperre) · in Arbeit: Fassung 886 — Ladezeit",

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
    { seit: "2026-10-14T04:06",
      text: "Profi-Umbau auf Module mit Vite planen (Funk 312)" },
    { seit: "2026-10-14T04:06",
      text: "Feldbeleg Ton 310: Berichte ton-weg auswerten" },
    { seit: "2026-10-14T04:06",
      text: "Aussprache- und Tonserver-Funktion hochladen (wartet auf OK)" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-10-24T18:05",
      text: "Bei einer Supabase-Sperre: 4–8 statt 5 011 Anfragen in 10 min, die Anmeldung bleibt erhalten" },
    { seit: "2026-10-25T00:42",
      text: "Seite im Hintergrund: nur winzige Abfragen (40 statt 992 in 10 min), Ton und Blase wie bisher, höchstens 2 min später" },
    { seit: "2026-10-24T18:05",
      text: "Fuchs-Wertung ohne 30er-Schleife: nach Mitternacht 4 statt 960 Abfragen in 10 min" },
    { seit: "2026-10-24T18:05",
      text: "Kleinere Antworten: Namen ohne ganze Profilzeile, Lämpchen zählt wie das Postfach, Funk lädt nur Neues" },
    { seit: "2026-10-24T18:05",
      text: "Nach einer Sperre von selbst wieder da (nach etwa 1–1,5 min), Anmelden gibt sofort das echte Profil" },
    { seit: "2026-10-25T00:42",
      text: "Nach einem Serverausfall wieder da nach höchstens 2,5 min, ein Tipp holt meist sofort" },
    { seit: "2026-10-25T04:47",
      text: "Ohne Netz: 72 statt 11 055 Fehlversuche in 10 min" },
    { seit: "2026-10-25T00:42",
      text: "Gast im Klassenzimmer: in einer Sperre 7 statt 120 Anmeldeversuche je Stunde" },
    { seit: "2026-10-24T21:31",
      text: "Klassenzimmer in der Sperre: 4 statt 100 Rundrufe über den Notweg in 10 min" },
    { seit: "2026-10-24T21:31",
      text: "Einstellungen gehen nach einer Sperre nicht verloren, die Anmeldung bleibt auch im Dorf erhalten" },
  ],
};
