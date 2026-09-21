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
  stand: "Runde 72 — Fassung 419: die Fehlerliste vom 21. September",

  inArbeit: [
    { seit: "2026-09-21T15:46",
      text: "Whiteboard: Fuellwerkzeug, weiches Zeichnen mit Druck, Hand zum Schieben, echter Schwamm, zwei Andock-Arten" },
    { seit: "2026-09-21T15:46",
      text: "Android-Layout: Schreibzeile, Benotung ohne Umbruch, gequetschte Ueberschrift, Niveau-Feld abgeschnitten" },
    { seit: "2026-09-21T15:46",
      text: "Stadt-Land-Fluss bauen" },
    { seit: "2026-09-21T15:46",
      text: "Aufzieh-Werkzeug fuer die Fahrzeuge" },
    { seit: "2026-09-21T15:46",
      text: "Portal: Tiefe, schwarzer Spiegel, Sog — und weg mit der Nudelholz-Welle" },
    { seit: "2026-09-21T15:46",
      text: "Umarmung: die erste Fassung zurueck, die Arme knicken nach unten" },
    { seit: "2026-09-21T15:46",
      text: "Rollo: feiner Sternenhimmel mit Sternschnuppe, Voegel in der Ferne" },
    { seit: "2026-09-21T15:46",
      text: "Platte, Trommel und Basketball: Ton und Bild gleich lang" },
    { seit: "2026-09-21T15:46",
      text: "Cowboyhut weniger comichaft, mit einer Hand, die ihn zurechtrueckt" },
    { seit: "2026-09-21T15:46",
      text: "BH: erst das Schnalzen des Gummis, dann der Pfiff" },
    { seit: "2026-09-21T15:46", nurBetreiber: true,
      text: "Kontext-Saetze werden falsch getrennt (‚Am 1.‘ steht allein)" },
    { seit: "2026-09-21T15:46", nurBetreiber: true,
      text: "Offene Fragen: Musik ueber Kopfhoerer beim anderen, Aufgabe im Unterricht, Schiffe-versenken-Reihenfolge" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T15:46",
      text: "Der Schein am alten Platz ist weg — er wurde nach Platznummer gesetzt und nach Platznummer abgenommen; nach einem Umzug traf das Abnehmen den neuen Platz" },
    { seit: "2026-09-21T15:46",
      text: "Das Beamen laesst nichts mehr zurueck: eine Stelle raeumt vor und nach jeder Reise auf" },
    { seit: "2026-09-21T15:46",
      text: "Die Roehre ist repariert — erst ganz hinein, dann heraus; gemessen gibt es keinen Augenblick mit zwei Bildern mehr" },
    { seit: "2026-09-21T15:46",
      text: "Neuer Rohrton: drei Impulse hinein (0,00 / 0,155 / 0,310 s), dieselben drei umgekehrt heraus, mit viel Hall" },
    { seit: "2026-09-21T15:46",
      text: "Das Schwimmbecken sitzt buendig auf dem Bild statt auf dem Namen — derselbe gemessene Versatz wie beim Tor" },
    { seit: "2026-09-21T15:46",
      text: "Die Registrierkasse klingelt hoerbar: neue Aufnahme mit -12 dB statt -23 dB, fertig bevor das Geld faellt" },
    { seit: "2026-09-21T15:46",
      text: "Der Zufall ist ein Spielautomat: Hebel, laufende Walzen, drei einzelne Einrastungen, Gewinnklingeln — und das Los faellt erst danach" },
    { seit: "2026-09-21T15:46",
      text: "Der Cowboy-Ton faengt nicht mehr mitten in der Welle an (45 ms Vorlauf, Trefferzeit nachgezogen)" },
    { seit: "2026-09-21T15:46",
      text: "Gluehbirne: zwei getrennte Kacheln, Gewinde bis ans Glas, Fassung bleibt haengen solange sie brennt, kein Auto-Quietschen mehr" },
    { seit: "2026-09-21T15:46",
      text: "Nach dem Herausdrehen haelt die Dunkelheit 5,6 s — und darin gehen an den Plaetzen der Anwesenden Augen auf und blinzeln" },
    { seit: "2026-09-21T15:46",
      text: "Bombe: der Countdown tickt ueberhaupt (die Datei fehlte), das Piepsen dauert 0,57 s statt 5,03 s, der Knall ist frei" },
    { seit: "2026-09-21T15:46",
      text: "Die Asche liegt unten ueber dem Namen, auf einer Seite gehaeuft und flach wie eine Endmoraene — und nichts weht mehr zum Nachbarplatz" },
    { seit: "2026-09-21T15:46",
      text: "Bumerang: erst das Sausen auf dem Hinweg, dann ein hoelzernes Klopfen, dann der Schmerz nach Mann und Frau" },
    { seit: "2026-09-21T15:46",
      text: "Die Muenze dreht durchgehend und legt sich hoerbar hin — der Aufschlag im Ton liegt gemessen bei 4,59 s, die Animation jetzt auch" },
    { seit: "2026-09-21T15:46",
      text: "Tennis: drei eigene Toene — Aufwurf, Saiten, mittelfrequentes Flop am Boden, und nur beim Ankommen" },
    { seit: "2026-09-21T15:46",
      text: "Der Schneeball rutscht bis unter den Bildrand, statt auf halber Strecke zu verschwinden" },
    { seit: "2026-09-21T15:46",
      text: "Die Sprungfeder setzt auf jedem ueberquerten Platz auf — vorher waren es immer drei Spruenge, egal wie weit" },
    { seit: "2026-09-21T15:46",
      text: "Die Lok stampft beim Anfahren und faehrt hoerbar ueber die Schienenstoesse; der Raddampfer pfeift beim Ablegen" },
    { seit: "2026-09-21T15:46",
      text: "Der Pfeil landet hoerbar da, wo man ihn landen sieht (gemessen 656 ms, nicht 714)" },
    { seit: "2026-09-21T15:46",
      text: "Pferd und Liane sind auf die Fassung von vorher zurueckgesetzt — das vorherige Pferd liegt im Back-up" },
  ],
};
