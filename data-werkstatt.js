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
  stand: "Runde 22 — der gezeichnete Weg, das eigene Echo und die Musik",

  inArbeit: [
    { seit: "2026-09-20T18:00",
      text: "Lesetexte: die angewaehlte Zeile soll den Text im Blick halten, dazu Kategorien (Es war einmal in Deutschland, Eigene Beitraege, Dichter und Denker, Schnee von gestern, Menschen Dinge Situationen) und die Betonung zum Anschalten." },
    { seit: "2026-09-20T18:00",
      text: "Der KONTEXTER: eine Geschichte in der richtigen Reihenfolge zusammensetzen." },
    { seit: "2026-09-20T18:00",
      text: "Die Aufgabe soll einen echten Sinn bekommen — Artikel raten, Woerter aus dem Woerterbuch, benotbar." },
    { seit: "2026-09-20T18:00",
      text: "Die grossen Filme (T-Rex, Loewe, Adler, Lok, Katze, Raumschiff, Schlitten, U-Boot) sollen schon in den Puffer, wenn man die Kategorie oeffnet." },
    { seit: "2026-09-20T18:00",
      text: "Beim Aufdecken sehen die anderen noch nichts — es braucht ein Rundenlaufen von Platz zu Platz." },
    { seit: "2026-09-20T18:00", nurBetreiber: true,
      text: "Sonde pruefe-runde22.js neu: 40 Messungen, alle gruen. Fassung 364." },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-20T18:00",
      text: "Angel und Lasso sind endlich zwei verschiedene Sachen: die Angel zieht jemanden irgendwohin, das Lasso zieht ihn zu MIR — /lasso Name sucht den freien Platz neben mir." },
    { seit: "2026-09-20T18:00",
      text: "Den Weg zeichnen geht jetzt in EINEM Menue: Linie ziehen, loslassen, und an derselben Stelle stehen Fahren und Laufen zur Wahl. Die zweite Zeile „Route fahren“ ist weg." },
    { seit: "2026-09-20T18:00",
      text: "Wer losfaehrt, laesst einen richtigen leeren Platz zurueck — gestrichelter Kreis und Nummer sind sofort wieder da." },
    { seit: "2026-09-20T18:00",
      text: "Man hoert sich nie selber: eine eigene zweite Sitzung wird am Ton gar nicht erst angeschlossen, und der Tonschalter sagt, wenn er ein Echo abgeklemmt hat." },
    { seit: "2026-09-20T18:00",
      text: "Hinter dem Strudel liegt jetzt der leere Platz mit der Strichlinie — solange das Bild eingesogen ist, sieht man ihn." },
    { seit: "2026-09-20T18:00",
      text: "Neu: /blubbern Name — in den Strohhalm gepustet, das Getraenk blubbert im Bild und das Bild wird dicker statt duenner." },
    { seit: "2026-09-20T18:00",
      text: "Neu: /musik — ein Lied aus dem Musikordner fuer alle im Raum. Das Notensymbol oben oeffnet die Auswahl, eine Bande zeigt, was laeuft, /musik aus macht Schluss." },
    { seit: "2026-09-20T18:00",
      text: "Neu: /kopfhoerer Name 3 — dann hoert nur der eine das Lied, alle anderen sehen die Kopfhoerer und lesen den Titel." },
  ],
};
