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
  stand: "Fassung 429 — Runde 76, erster Teil",

  inArbeit: [
    { seit: "2026-09-21T19:49", nurBetreiber: true,
      text: "Pac-Man: eigener Weg zeichnen, Mund in Fahrtrichtung, über die Plätze zurück" },
    { seit: "2026-09-21T19:49", nurBetreiber: true,
      text: "Billard: Richtung des Stoßes und des Abprallens" },
    { seit: "2026-09-21T19:49", nurBetreiber: true,
      text: "Hammer mit Zufall und Glasbruch, Katapult größer, Peitschensound, Sanduhr" },
    { seit: "2026-09-21T19:49", nurBetreiber: true,
      text: "Aufblasen bis zum Platzen, Zwille aufrecht, Po-Klatschen, Vogeldreck, Frosch-Sprung" },
    { seit: "2026-09-21T19:49", nurBetreiber: true,
      text: "Musik teilen mit YouTube, Kopfhörer-Snippet, Anziehen-Modul, Telefon mit Audio" },
    { seit: "2026-09-21T19:49", nurBetreiber: true,
      text: "Salve auf mehrere, Weg über Personen, Zylinder mit Kaninchen, Feuerreifen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T19:49",
      text: "🪝 Erst die Animation, dann der Platzwechsel. Beim Lasso und beim Angeln ging die neue Sitzordnung ZUERST raus — die Person saß also schon am Ziel, bevor das Seil überhaupt flog. Jetzt fliegt erst das Seil, und der Platz wechselt, wenn es angekommen ist." },
    { seit: "2026-09-21T19:49",
      text: "🪃 Der Bumerang fliegt wirklich bis zu dir zurück. Er war bei 70 % der Zeit erst bei 55 % des Rückwegs — und blendete dabei schon aus. Jetzt ist er bei 90 % angekommen und noch voll zu sehen." },
    { seit: "2026-09-21T19:49",
      text: "❄️ Die Schneeball-Spur läuft jetzt dahin, wo der Klecks hinrutscht. Sie wuchs senkrecht nach unten, während er schräg zur Mitte rutschte — und sie war zweieinhalbmal so lang wie sein Weg." },
    { seit: "2026-09-21T19:49",
      text: "🪙 Die Münze landet über dem Namen statt darauf, und sie liegt flach als Ellipse. Bei 86 Grad war von ihr gar nichts mehr zu sehen — nur noch ihr Schatten." },
    { seit: "2026-09-21T19:49",
      text: "🤠 Der Cowboyhut: die Hand kommt erst NACH den Geräuschen (79 % von jetzt 4,2 s) und ist vorher gar nicht zu sehen. Die Krempe hat jetzt auch an den Spitzen ihre Dicke — sie lief vorher in einen Punkt aus." },
    { seit: "2026-09-21T19:49",
      text: "💿 Der Tonarm liegt auf der Platte. Die Nadel saß bei 87 % Breite und 6 % Höhe — das ist die obere rechte Ecke, dort ist gar keine Platte mehr." },
    { seit: "2026-09-21T19:49",
      text: "💡 Die Fassung fällt nicht mehr von oben herein (sie hängt ja an der Decke), bleibt nach dem Eindrehen nicht hängen und ist beim Herausdrehen da." },
    { seit: "2026-09-21T19:49",
      text: "👀 Die Augen im Dunkeln springen beim Scrollen nicht mehr. Sie wurden relativ zur Bühne gesetzt, und die Bühne wird in ihrem eigenen Bildtakt nachgezogen — ein Takt Verzug." },
    { seit: "2026-09-21T19:49",
      text: "🎳 Beim Bowling fällt das Bild erst, wenn die Kugel da ist. Es flog 672 ms vor dem Einschlag los." },
    { seit: "2026-09-21T19:49",
      text: "🥤 Der Strohhalm kommt von der Seite, auf der du sitzt — beim Aufblasen wie beim Austrinken, und beide sind jetzt gleich geringelt." },
    { seit: "2026-09-21T19:49",
      text: "🤢 Der Spuckball hat nur noch EIN Ekelgeräusch." },
    { seit: "2026-09-21T19:49",
      text: "👤 Das „du“ in Klammern hinter dem eigenen Namen ist weg — es hat die Beschriftung breiter gemacht als bei allen anderen." },
    { seit: "2026-09-21T19:49",
      text: "💡 Birne an und Birne raus sind eine Kachel mit zwei Einträgen." },
  ],
};
