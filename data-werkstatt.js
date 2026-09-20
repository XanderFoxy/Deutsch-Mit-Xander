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
  stand: "Runde 27 — die Tagesgrenze war meine eigene Bremse",

  inArbeit: [
    { seit: "2026-09-20T19:35", nurBetreiber: true,
      text: "DAMIT ES WIRKT: einmal  supabase functions deploy klassenzimmer  — sonst laeuft in Supabase weiter die alte Fassung mit 60." },
    { seit: "2026-09-20T19:35",
      text: "Galgenmaennchen: dort fehlt das Rundenlaufen noch." },
    { seit: "2026-09-20T19:35",
      text: "Die Lupe verdeckt angeblich die Eingabesymbole — sag mir bitte, wo genau." },
    { seit: "2026-09-20T19:35",
      text: "app.js ist 1,13 MB gepackt — das Aufteilen steht noch aus." },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-20T19:35",
      text: "Die Meldung „Gespraechs-Kontingent aufgebraucht“ hatte nichts mit Guthaben zu tun: in der Edge-Function stand TAGESGRENZE = 60, also 60 Abrufe von Zugangsdaten pro Konto und Tag. Danach kam 429, kein Relais, Fokus-Modus." },
    { seit: "2026-09-20T19:35",
      text: "Der eigentliche Fehler war meiner: die Zugangsdaten lagen nur im Arbeitsspeicher. Jedes Neuladen hat neue geholt. Sie gelten zwei Stunden und liegen jetzt im Geraet — ein Neuladen kostet keinen Abruf mehr." },
    { seit: "2026-09-20T19:35",
      text: "Die Tagesgrenze sperrt niemanden mehr in den Fokus-Modus. Sie kostet nichts (bezahlt wird nach Gigabyte, nicht nach Abrufen) und sagt nur noch Bescheid." },
    { seit: "2026-09-20T19:35",
      text: "Die Grenze steht nicht mehr fest bei 60, sondern auf 1000 und ist in betreiber_geheimnisse unter „turn_tagesgrenze“ einstellbar — wie das Monatsbudget." },
    { seit: "2026-09-20T19:35",
      text: "Die Bremse gegen die RECHNUNG bleibt unveraendert: turn_budget_gb, 25 GB, und sie steht vor allem anderen." },
    { seit: "2026-09-20T19:35",
      text: "/leitung sagt jetzt, woher die Zugangsdaten kommen und ob dieser Besuch einen Abruf gekostet hat." },
  ],
};
