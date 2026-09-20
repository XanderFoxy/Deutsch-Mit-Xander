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
  stand: "Runde 18 — Platzwahl, stehende Nummern, aufgeraeumte Effekte",

  inArbeit: [
    { seit: "2026-09-20T09:17",
      text: "Galgenmaennchen/Aufdecken reihum spielen und benoten" },
    { seit: "2026-09-20T09:17",
      text: "Strudel: noch mehr Pixel statt Grafik darueber" },
    { seit: "2026-09-20T09:17",
      text: "Bluetenblaetter sollen beim Sprechen am Bildrand wachsen" },
    { seit: "2026-09-20T09:17", nurBetreiber: true,
      text: "Sechs alte doppelte Animationsnamen im Stilblatt aufloesen (lcRufAn, lcSteigt, lcFunke, lcSteigtAuf, lcZuengelt, lcSprichtPuls)" },
    { seit: "2026-09-20T09:17", nurBetreiber: true,
      text: "TURN nachmessen: zwei Geraete an einem Tag in turn_nutzung" },
    { seit: "2026-09-20T09:17", nurBetreiber: true,
      text: "Die Tondatei schnee.m4a ist praktisch stumm (-59 dB) — neu aufnehmen, Ausgleich hilft da nicht" },
    { seit: "2026-09-20T09:17", nurBetreiber: true,
      text: "Ladezeit: 7,6 MB Skripte und Stilblaetter beim Start, app.js allein 3,8 MB — aufteilen" },
    { seit: "2026-09-20T09:17", nurBetreiber: true,
      text: "Filme neu kodieren? trex 3,2 MB, schlitten 1,4 MB — geht an die Bildqualitaet, deshalb erst nach Absprache" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-20T09:17",
      text: "Ein Tipp auf einen freien Platz setzt wieder SOFORT um — so wie vorher. Gefahren wird nur noch, wenn man es waehlt." },
    { seit: "2026-09-20T09:17",
      text: "Langer Druck auf einen freien Platz fragt, wie man hinkommen will: Springen, Fahren oder Laufen von Feld zu Feld." },
    { seit: "2026-09-20T09:17",
      text: "Die Platznummern drehen sich nicht mehr mit. Gemessen: das Bild faehrt 134 px, die Nummer bleibt auf 0 px stehen." },
    { seit: "2026-09-20T09:17",
      text: "Die Fahrt endet jetzt am Ziel — das Bild fliegt nicht mehr an den alten Platz zurueck." },
    { seit: "2026-09-20T09:17",
      text: "Kein Emoji-Regen mehr bei Platz-Effekten: keine Autos, keine Pac-Men, keine Sanduhren ueber dem Chat." },
    { seit: "2026-09-20T09:17",
      text: "Der Saugpfeil hat hinten Federn und vorn den Napf — und saugt sich seitlich am Bild fest, mit Nachwackeln." },
    { seit: "2026-09-20T09:17",
      text: "Die Peitsche geht von meinem Bild ueber die ganze Entfernung bis zum anderen (gemessen: 285 px Seil auf 332 px Abstand)." },
    { seit: "2026-09-20T09:17",
      text: "Lasso und Angel ziehen den anderen zu MIR — und setzen ihn danach auch wirklich neben mich." },
    { seit: "2026-09-20T09:17",
      text: "Billard stoesst in die physikalisch richtige Richtung: das Loch liegt in Stossrichtung, nicht dahinter." },
    { seit: "2026-09-20T09:17",
      text: "Pac-Man: der Kreis bleibt rund, der Schein wird nicht mehr angefressen — ich werde zur Original-Figur." },
    { seit: "2026-09-20T09:17",
      text: "Paintball sprenkelt in vielen Farben statt nur in einer." },
    { seit: "2026-09-20T09:17",
      text: "Die Trommelschlaegel zeigen zur Trommel und schlagen aufs Bild, nicht an den Rand." },
    { seit: "2026-09-20T09:17",
      text: "Die Weckerschellen sind mit einem Buegel verbunden, mit Haemmerchen in der Mitte." },
    { seit: "2026-09-20T09:17",
      text: "Basketball: das Profilbild IST der Ball, eine grosse Hand dribbelt es und wirft es in einen anderen Platz." },
    { seit: "2026-09-20T09:17",
      text: "Der Strohhalm trinkt Zeile fuer Zeile wirklich leer." },
    { seit: "2026-09-20T09:17",
      text: "Das Katapult taucht auf, spannt ein und schiesst — es fliegt nicht mehr herein." },
    { seit: "2026-09-20T09:17",
      text: "Der Keks hinterlaesst echte Bissspuren im Bild statt eines Kekses darueber." },
    { seit: "2026-09-20T09:17",
      text: "Wassereimer: der Strahl bleibt im Bild (gemessen 24 px ueber der Unterkante), und der Pegel steigt erst, wenn Wasser kommt." },
    { seit: "2026-09-20T09:17",
      text: "Die Ohrfeige hat mehr Pfeffer, der Bumerang trifft jetzt auch wirklich." },
    { seit: "2026-09-20T09:17",
      text: "Sieben neue: Licht ausmachen, Muenze drehen, Scheibenwischer, Zwille, Pusterohr, Gluehbirne eindrehen und eine Entbloessung, die nur direkt nebenan geht." },
    { seit: "2026-09-20T09:17",
      text: "Alle Geraeusche auf ein Niveau gebracht — nachgemessen mit ffmpeg ueber 73 Dateien, 47 dB Unterschied ausgeglichen, und alles ein Stueck leiser." },
    { seit: "2026-09-20T09:17",
      text: "Gefluesterte Bilder kommen wieder im Fluester-Design an — der Befehl landet nicht mehr als Beschriftung im Chat." },
    { seit: "2026-09-20T09:17",
      text: "Tonschalter und Raumnamen liegen jetzt im Profil, nicht nur im Geraet." },
    { seit: "2026-09-20T09:17", nurBetreiber: true,
      text: "Filme: es wird der kleinere von beiden genommen — 24,7 MB webm gegen 8,9 MB Maske." },
  ],
};
