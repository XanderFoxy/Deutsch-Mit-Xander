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
  stand: "Runde 70 — die Töne stimmen wieder (Fassung 413)",

  inArbeit: [
    { seit: "2026-09-21T14:18",
      text: "Portal: noch blau statt dunkel mit Spiegeleffekten, sitzt nicht mittig auf dem Platz" },
    { seit: "2026-09-21T14:18",
      text: "Katapult: die Animation muss noch zum neuen Ton passen — das Aufziehen in der Schale fehlt" },
    { seit: "2026-09-21T14:18",
      text: "Liane: schwingt nicht aus der eigenen Position aus, überschreitet den Bildrand" },
    { seit: "2026-09-21T14:18",
      text: "Rohrreise: das Bild gleitet über das Rohr statt hinein" },
    { seit: "2026-09-21T14:18",
      text: "Helikopter, Pferd, Flugzeug, Lok, Maulwurfshügel, Kopfhörer: Zeichnungen noch offen" },
    { seit: "2026-09-21T14:18",
      text: "3-Meter-Turm: Brett zu kurz, Turm blendet beim Sprung aus, Wackeln fehlt" },
    { seit: "2026-09-21T14:18",
      text: "Greifvogel: Beine und Krallen noch comicartig" },
    { seit: "2026-09-21T14:18",
      text: "Bombe: die zwei Fassungen (Zeitzünder / Lunte) sind noch nicht auswählbar — Lunte und Explosion liegen schon bereit" },
    { seit: "2026-09-21T14:18",
      text: "Feder: blendet zwischen den Sprüngen aus; Bienen lassen Reste am alten Platz" },
    { seit: "2026-09-21T14:18", nurBetreiber: true,
      text: "Zwei Aufnahmen waren unbrauchbar und sind gelöscht: die Feder (Spitze -43 dB, praktisch still) und der Hammerschwung (enthielt nur wieder den Treffer)" },
    { seit: "2026-09-21T14:18", nurBetreiber: true,
      text: "Zwei Tutorfilme (ueber-03b, ueber-05) brauchen mehr ElevenLabs-Guthaben" },
    { seit: "2026-09-21T14:18", nurBetreiber: true,
      text: "16 Supabase-Tabellen ohne RLS, darunter profiles und private_messages" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T14:18",
      text: "22 neue Geräusche aufgenommen und eingebaut — jetzt 211 im Ordner" },
    { seit: "2026-09-21T14:18",
      text: "Der Raddampfer klang wie ein Segelboot: in seinem Zweig stand lcTonZu(\"boot\"). Er hat jetzt sein eigenes Geräusch mit Schaufelrad, Dampfmaschine und Pfeife" },
    { seit: "2026-09-21T14:18",
      text: "Das Katapult war stumm — der Plan zeigte auf eine Datei, die es gar nicht gab. Jetzt windet es die Seile und schleudert" },
    { seit: "2026-09-21T14:18",
      text: "Die Fahrt dauert so lange wie die Strecke: über vier Plätze das 1,84fache — und der Ton läuft genau so lange mit" },
    { seit: "2026-09-21T14:18",
      text: "Zwille: der Schmerz kam 1170 ms VOR dem Einschlag, weil die Aufnahme ihre lauteste Stelle erst bei 1,50 s hat, aber erst bei 1150 ms gestartet wurde. Jetzt ein echtes Gummiband, und die Kugel schlägt genau dort ein, wo es knallt" },
    { seit: "2026-09-21T14:18",
      text: "Bumerang: der Schmerzlaut lag auf 2300 ms, das TOCK aber auf 860 ms — und die alte Datei war die ersten 1,2 s still. Jetzt Schrei nach Mann und Frau auf dem Treffer, dazu ein zweites Sausen für den Rückflug" },
    { seit: "2026-09-21T14:18",
      text: "Lichtschalter: die vier Geigenstiche sind aus einer neuen Aufnahme wirklich geschnitten (Spitzen bei 0,00 / 0,30 / 0,60 / 0,90 s, dazwischen Stille). Die Dunkelheit hält jetzt 5,5 s statt 3,2 s, und darin suchen zwei Augen" },
    { seit: "2026-09-21T14:18",
      text: "Die Peitsche sieht überall gleich aus — beim Selbstschlag kam das alte braune Seil, weil lcLeineWerfen bei gleichem Start- und Zielplatz aussteigt" },
    { seit: "2026-09-21T14:18",
      text: "Kuss, Ekel und Tarzan unterscheiden jetzt Mann und Frau" },
    { seit: "2026-09-21T14:18",
      text: "Zufall: das Slotgeräusch wurde mitten im Gewinn abgeblendet. Geld: das Bett lag auf der Kassenschublade" },
    { seit: "2026-09-21T14:18",
      text: "Strudel, Münze, Bowling, Glühbirne, Portal und Pfeil haben neue Aufnahmen; der Hammer holt jetzt hörbar aus" },
    { seit: "2026-09-21T14:18",
      text: "Die doppelte Pusten-Kachel ist weg — sie steckt im Strohhalm" },
    { seit: "2026-09-21T14:18",
      text: "pruefe-runde70.js: 60 Regeln, alle grün. Drei ältere Prüfungen hielten alte Töne fest und sind nachgezogen" },
  ],
};
