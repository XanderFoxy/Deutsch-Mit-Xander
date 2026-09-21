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
  stand: "Runde 59 - dreissig neue Geraeusche, richtige Zeitpunkte, Blitze mit Aesten",

  inArbeit: [
    { seit: "2026-09-21T04:32",
      text: "Katapult- und Strudelanimation neu zeichnen" },
    { seit: "2026-09-21T04:32",
      text: "Tor als stehende Wasserwand mit Partikeln und Plasma" },
    { seit: "2026-09-21T04:32",
      text: "Maulwurf in der Draufsicht: Erde rund um den Kreis, kein seitlicher Huegel" },
    { seit: "2026-09-21T04:32",
      text: "Peitsche: echter gewickelter Griff, und eine mehrschwaenzige fuer alle auf einmal" },
    { seit: "2026-09-21T04:32",
      text: "Billard-Prallphysik" },
    { seit: "2026-09-21T04:32",
      text: "Brueste in natuerlichem Hautton statt gelblich" },
    { seit: "2026-09-21T04:32",
      text: "Sanduhr auch am einzelnen Profilbild von oben nach unten" },
    { seit: "2026-09-21T04:32",
      text: "Rohrreise: der Reisende ist auf beiden Seiten gleichzeitig zu sehen" },
    { seit: "2026-09-21T04:32",
      text: "Effekte fuer ALLE gleichzeitig - umarmen, kuessen, treten, Bombe" },
    { seit: "2026-09-21T04:32",
      text: "Schneeball soll herunterrutschen statt im Bild zu kleben" },
    { seit: "2026-09-21T04:32",
      text: "Lok, Helikopter und Raddampfer brauchen noch mehr Details" },
    { seit: "2026-09-21T04:32",
      text: "Whiteboard neu denken, alles ins Profil speichern statt lokal" },
    { seit: "2026-09-21T04:32", nurBetreiber: true,
      text: "Tutorvideo mit Greenscreen neu aufnehmen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T04:32",
      text: "Licht aus: wieder die Horrorgeige - EINE Note, viermal, kein Orchester" },
    { seit: "2026-09-21T04:32",
      text: "Umarmung, Zwille, Schneeball und Spuckkugel: die Stimme richtet sich nach dem Geschlecht" },
    { seit: "2026-09-21T04:32",
      text: "Geld: die Registerkasse klingelt jetzt allein, bevor das Geld faellt" },
    { seit: "2026-09-21T04:32",
      text: "Bombe: digitale Piepser und brennende Zuendschnur, beide neu und ohne Weckerglocke" },
    { seit: "2026-09-21T04:32",
      text: "Wassereimer: das Blubbern beim allmaehlichen Fuellen" },
    { seit: "2026-09-21T04:32",
      text: "Schneekugel: festliches Weihnachtsglissando mit Schlittenglocken" },
    { seit: "2026-09-21T04:32",
      text: "Cowboyhut, Katapult, Zwille, Peitsche, Strudel, Tor: alle sechs neu aufgenommen" },
    { seit: "2026-09-21T04:32",
      text: "Rohrreise: der Mario-Warp mit drei absteigenden Chiptune-Impulsen" },
    { seit: "2026-09-21T04:32",
      text: "Liane: der Tarzan-Ruf" },
    { seit: "2026-09-21T04:32",
      text: "Flugzeug und Lok: ein langes Fahrgeraeusch statt Bremsen und Quietschen" },
    { seit: "2026-09-21T04:32",
      text: "Basketball: Dribbeln auf dem Hallenboden und Scheppern im Korbgestell" },
    { seit: "2026-09-21T04:32",
      text: "Paintball: die Farbe laeuft hoerbar herunter" },
    { seit: "2026-09-21T04:32",
      text: "Hammer und Herzen haben endlich eigene Toene" },
    { seit: "2026-09-21T04:32",
      text: "Pfeifen: nur noch das Nachpfeifen, ohne das Stueck davor" },
    { seit: "2026-09-21T04:32",
      text: "GEFUNDEN: neunzehn Dateien hatten stummen Vorlauf - zwille.opus 1,52 s, billardstoss 0,83 s" },
    { seit: "2026-09-21T04:32",
      text: "Deshalb kam jeder Schmerzlaut zu spaet: im Code stimmte die Zeit, in der Datei nicht" },
    { seit: "2026-09-21T04:32",
      text: "GEFUNDEN: schnee.opus war vier Sekunden vollstaendig still - neu aufgenommen" },
    { seit: "2026-09-21T04:32",
      text: "Muenze: der Ton liegt auf der Drehung, nicht 3,7 Sekunden danach" },
    { seit: "2026-09-21T04:32",
      text: "Ohrfeige: Schlag und Schmerz liegen 60 ms auseinander statt fast 500" },
    { seit: "2026-09-21T04:32",
      text: "Zwille: erst dehnen, dann schiessen, dann schreien - vorher war es umgekehrt" },
    { seit: "2026-09-21T04:32",
      text: "Sprungfeder: sie klingt bei jedem Aufsetzen, nicht nur beim ersten" },
    { seit: "2026-09-21T04:32",
      text: "Segelboot, Raddampfer, Flugzeug und Lok: kein falsches Geraeusch mehr bei der Ankunft" },
    { seit: "2026-09-21T04:32",
      text: "Blitze: echte Verzweigungen und Verjuengung, 270 Abschnitte statt einer Knicklinie" },
    { seit: "2026-09-21T04:32",
      text: "AirPods Max: die Muscheln liegen zu 82 Prozent NEBEN dem Bild, von der Seite gesehen" },
    { seit: "2026-09-21T04:32",
      text: "Der Lokfilm war unerreichbar - /lok ohne Namen zeigt ihn wieder" },
    { seit: "2026-09-21T04:32",
      text: "Kontrolliert: die Profil-Stoerung ist unveraendert die allererste Fassung" },
  ],
};
