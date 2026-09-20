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
  stand: "Runde 23 — Vorladen, Transportleiste, frisches Wetter",

  inArbeit: [
    { seit: "2026-09-20T19:01",
      text: "Lesetexte: die angewaehlte Zeile soll den Text im Blick halten, dazu Kategorien und die Betonung zum Anschalten." },
    { seit: "2026-09-20T19:01",
      text: "Der KONTEXTER: eine Geschichte in der richtigen Reihenfolge zusammensetzen." },
    { seit: "2026-09-20T19:01",
      text: "Die Aufgabe soll einen echten Sinn bekommen — Artikel raten, Woerter aus dem Woerterbuch, benotbar." },
    { seit: "2026-09-20T19:01",
      text: "Beim Aufdecken sehen die anderen noch nichts — es braucht ein Rundenlaufen von Platz zu Platz." },
    { seit: "2026-09-20T19:01",
      text: "app.js ist 1,13 MB gepackt und wird bei jedem Laden ganz gelesen — das Aufteilen steht noch aus." },
    { seit: "2026-09-20T19:01", nurBetreiber: true,
      text: "Der T-Rex ist der einzige Film in 1440x1280; alle anderen sind 800x712. Neu kodieren bringt nichts (gemessen: 3,25 MB werden bei CRF 26 zu 3,77 MB) — kleiner wird er nur mit weniger Bildpunkten. Sag Bescheid, dann mache ich ihn auf das Mass der anderen." },
    { seit: "2026-09-20T19:01", nurBetreiber: true,
      text: "Sonde pruefe-runde23.js neu: 27 Messungen, alle gruen. Fassung 365." },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-20T19:01",
      text: "Kein Ladebalken mehr mitten im Chat: waehrend ein Film laedt, steht sein erstes Bild da — und das ist ein paar Dutzend Kilobyte gross, also sofort." },
    { seit: "2026-09-20T19:01",
      text: "Die Effekte laden schon, waehrend du tippst: der Schraegstrich holt den Filmspieler, jeder weitere Buchstabe grenzt ein — /l holt Loewe und Lok, ohne dass man etwas merkt." },
    { seit: "2026-09-20T19:01",
      text: "Tippst du auf die Sektion „Tiere“ (im Tippfenster oder im Befehlskasten), sind ihre vier Filme schon unterwegs, bevor du den Befehl abschickst." },
    { seit: "2026-09-20T19:01",
      text: "Auch die Geraeusche der passenden Befehle werden dabei schon angelegt." },
    { seit: "2026-09-20T19:01",
      text: "Die Groesse wird jetzt an dem Weg gemessen, der wirklich genommen wird: der T-Rex wiegt als Maske 3,10 MB und nicht 8,25 MB — die alte Rechnung war zu pessimistisch und hat ihn im Mobilfunk gar nicht erst vorgeladen." },
    { seit: "2026-09-20T19:01",
      text: "Am fremden Platz stehen jetzt beide Kopfhoerer: die Kachel „Hoerer“ ist der normale Effekt, „Sein Lied“ laesst ihn ALLEIN dein Lied hoeren — du suchst es aus." },
    { seit: "2026-09-20T19:01",
      text: "Die Musik hat eine kleine Transportleiste im Chat: Titel, Pause und Aus. Fuer alle gilt /musik pause, /musik weiter und /musik aus." },
    { seit: "2026-09-20T19:01",
      text: "Das Wetter im Kopf kommt beim Aktualisieren frisch: der Abruf nimmt nichts mehr aus dem Zwischenspeicher, und wenn die Seite aus dem Schlaf zurueckkommt, wird sofort nachgeholt." },
  ],
};
