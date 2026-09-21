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
  stand: "Runden 57 und 58 - Fahrzeuge, Peitsche, Liane, Pfeil, Hut, Kopfhoerer, Birne, Regen, Musik",

  inArbeit: [
    { seit: "2026-09-21T04:02",
      text: "Whiteboard neu denken: Plaetze und Chat behalten, Texte laden, alles speicherbar" },
    { seit: "2026-09-21T04:02",
      text: "Alles ins Profil speichern statt lokal - Effekte, Favoriten, Giphy-Bilder" },
    { seit: "2026-09-21T04:02",
      text: "Billard-Prallphysik, Bowling mit mehreren Kegeln je Person" },
    { seit: "2026-09-21T04:02",
      text: "Schneeball soll herunterrutschen statt im Bild zu kleben" },
    { seit: "2026-09-21T04:02",
      text: "Hammer braucht einen eigenen Ton, die Ohrfeige ist noch nicht sauber getimet" },
    { seit: "2026-09-21T04:02",
      text: "Brueste in natuerlichem Hautton statt gelblich" },
    { seit: "2026-09-21T04:02",
      text: "Rohrreise: der Reisende ist noch am alten Platz zu sehen, waehrend er ankommt" },
    { seit: "2026-09-21T04:02",
      text: "Lokomotive muss noch besser aussehen, Flugzeug braucht mehr Details" },
    { seit: "2026-09-21T04:02",
      text: "Portaleffekt noch etwas feiner" },
    { seit: "2026-09-21T04:02",
      text: "Angel zeigt manchmal das Lassozeichen - nicht nachstellbar" },
    { seit: "2026-09-21T04:02", nurBetreiber: true,
      text: "Tutorvideo mit Greenscreen neu aufnehmen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T04:02",
      text: "Raddampfer: echter Mississippi-Heckraddampfer mit zwei Schornsteinen, Steuerhaus, Gelaender und grossem Heckrad" },
    { seit: "2026-09-21T04:02",
      text: "Pferd neu gezeichnet: richtiger Pferdekopf, Maehne, Schweif, Sattel und Knickbeine im Galopp" },
    { seit: "2026-09-21T04:02",
      text: "Helikopter: Cockpitverglasung, Heckrotor, Rotorkopf - und er fliegt nicht mehr rueckwaerts" },
    { seit: "2026-09-21T04:02",
      text: "Lok und Helikopter fuhren spiegelverkehrt - jede Zeichnung hat jetzt ihre eigene Blickrichtung" },
    { seit: "2026-09-21T04:02",
      text: "Peitsche: sie holt jetzt richtig aus, ist schwarzes Leder und laeuft in fuenf Stufen zur Spitze aus" },
    { seit: "2026-09-21T04:02",
      text: "Liane: haengt von oberhalb der Platzreihe herunter, 225 statt 133 px, mit mitwachsenden Blaettern" },
    { seit: "2026-09-21T04:02",
      text: "Pfeil: echte Befiederung mit Aesten und Leitfeder, vorn ein Saugnapf mit rundem Rand" },
    { seit: "2026-09-21T04:02",
      text: "Cowboyhut: Krempe an den Seiten hochgerollt, Cattleman-Falte statt Abenteuerhut-Kuppel" },
    { seit: "2026-09-21T04:02",
      text: "AirPods Max: duenner Stahlbuegel, kurzes Stoffnetz, schmale Staebe, hochovale Muscheln, Digital Crown oben" },
    { seit: "2026-09-21T04:02",
      text: "Birne dreht sich um die senkrechte Achse - und ein zweites Mal dreht sie heraus, mit Stromausfall" },
    { seit: "2026-09-21T04:02",
      text: "Regen faellt senkrecht: jeder Tropfen hat seinen eigenen Versatz statt einer ganzen schiefen Flaeche" },
    { seit: "2026-09-21T04:02",
      text: "Nachts steht keine Sonne mehr am Wolkensymbol - und eine bewoelkte Nacht hat wieder Wolken" },
    { seit: "2026-09-21T04:02",
      text: "Musik kam nie an, wenn man den Platz mit seiner NUMMER meinte - jetzt zaehlt Nummer wie Name" },
    { seit: "2026-09-21T04:02",
      text: "Der grosse Lokfilm war unerreichbar geworden - er heisst jetzt /gglok, /lok faehrt" },
    { seit: "2026-09-21T04:02",
      text: "Acht alte Sonden pruefen jetzt den heutigen Stand statt den von damals" },
  ],
};
