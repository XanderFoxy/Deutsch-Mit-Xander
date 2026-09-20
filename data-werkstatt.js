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
  stand: "Runde 24 — Lesen nach Kategorien, der Fokus und der KONTEXTER",

  inArbeit: [
    { seit: "2026-09-20T19:08",
      text: "Die Aufgabe soll einen echten Sinn bekommen — Artikel raten, Woerter aus dem Woerterbuch, benotbar." },
    { seit: "2026-09-20T19:08",
      text: "Beim Aufdecken sehen die anderen noch nichts — es braucht ein Rundenlaufen von Platz zu Platz." },
    { seit: "2026-09-20T19:08",
      text: "Sahne, Tennisschlaeger, Trittschuh und Druecken sind noch nicht neu gezeichnet." },
    { seit: "2026-09-20T19:08",
      text: "app.js ist 1,13 MB gepackt und wird bei jedem Laden ganz gelesen — das Aufteilen steht noch aus." },
    { seit: "2026-09-20T19:08", nurBetreiber: true,
      text: "Sonde pruefe-runde24.js neu: 28 Messungen, alle gruen. Fassung 366." },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-20T19:08",
      text: "Die Lesetexte stehen jetzt in fuenf Kategorien: Schnee von gestern, Dichter und Denker, Menschen Dinge Situationen, Es war einmal in Deutschland und Eigener Text." },
    { seit: "2026-09-20T19:08",
      text: "„Es war einmal in Deutschland“ bringt den laufenden Monat mit allen Tagen — geholt wird dafuer nur diese eine Monatsdatei, nicht das ganze Jahr." },
    { seit: "2026-09-20T19:08",
      text: "Eigener Text: hineinschreiben und als Lesetext oder gleich als KONTEXTER schicken." },
    { seit: "2026-09-20T19:08",
      text: "Der Fokus: ein Tipp auf eine Zeile haelt den Text fest — er klebt unten im Chat und rutscht bei jeder neuen Nachricht wieder darunter. Noch ein Tipp auf dieselbe Zeile schiebt ihn sofort ans Ende." },
    { seit: "2026-09-20T19:08",
      text: "Die Betonung laesst sich in der Lesetafel anschalten — nur bei dir, und der Wortschatz wird erst dann nachgeholt." },
    { seit: "2026-09-20T19:08",
      text: "Der KONTEXTER ist da: /kontexter Satz | Satz | Satz, oder mit einem Tipp auf das Puzzleteil neben jedem Lesetext. Die Saetze kommen gemischt, wer sie richtig ordnet, bekommt es sofort gesagt." },
  ],
};
