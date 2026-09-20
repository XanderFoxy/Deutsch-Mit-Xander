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
  stand: "Runde 25 — die Aufgabe mit Sinn, das Aufdecken fuer alle, das Rundenlaufen",

  inArbeit: [
    { seit: "2026-09-20T19:14",
      text: "Sahne, Tennisschlaeger, Trittschuh und Druecken sind noch nicht neu gezeichnet." },
    { seit: "2026-09-20T19:14",
      text: "Galgenmaennchen: auch dort fehlt das Rundenlaufen." },
    { seit: "2026-09-20T19:14",
      text: "app.js ist 1,13 MB gepackt und wird bei jedem Laden ganz gelesen — das Aufteilen steht noch aus." },
    { seit: "2026-09-20T19:14", nurBetreiber: true,
      text: "Sonde pruefe-runde25.js neu: 27 Messungen, alle gruen. Fassung 367." },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-20T19:14",
      text: "Die Strategie fuer die Aufgabe steht jetzt fest: eine Aufgabe im Chat taugt nur, wenn sie aus dem eigenen Stoff kommt, sich selbst pruefen kann und danach eine Note bekommen kann." },
    { seit: "2026-09-20T19:14",
      text: "Neu /artikel — der, die oder das? Das Wort kommt aus dem Woerterbuch, die Bedeutung steht dabei, drei Kacheln, sofort geprueft." },
    { seit: "2026-09-20T19:14",
      text: "Neu /begriff — die Bedeutung steht da, das Wort ist gesucht." },
    { seit: "2026-09-20T19:14",
      text: "An beiden steht ein Knopf, der genau dieses Wort im Woerterbuch aufschlaegt." },
    { seit: "2026-09-20T19:14",
      text: "Das Woerterbuch wird dafuer erst geholt, wenn die erste solche Aufgabe gestellt wird — die Ladezeit bleibt, wie sie war." },
    { seit: "2026-09-20T19:14",
      text: "BEHOBEN: Beim Aufdecken sahen die anderen nichts. Das Feld „raten“ wurde beim Senden angehaengt und beim Empfang nie abgeholt — derselbe Fehler wie einst bei „wen“. Eine Zeile." },
    { seit: "2026-09-20T19:14",
      text: "Das Rundenlaufen: die Sitzreihe ist die Runde. Wer stellt, ist nicht dran; nach jedem Versuch rueckt es weiter, und an der Tafel steht, wer dran ist." },
  ],
};
