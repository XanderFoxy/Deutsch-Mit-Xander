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
  stand: "Runde 87g — kein Schrumpfen mehr beim Verlassen des Platzes, alle 121 Effekte auf Strichlinien geprueft, und Stadt-Land-Fluss mit laufendem Alphabet und waehlbaren Zusatzkategorien.",

  inArbeit: [
    { seit: "2026-09-22T14:08",
      text: "Pac-Man bleibt am Ziel stehen und schaut in Laufrichtung" },
    { seit: "2026-09-22T14:08",
      text: "Maulwurf reisst die Plaetze wieder auf" },
    { seit: "2026-09-22T14:08",
      text: "Lok: Kurvenmodule, Draufsicht, Schrei beim Ueberfahren" },
    { seit: "2026-09-22T14:08",
      text: "Emoji-Haende: kein gespreizter Daumen, Handflaechen treffen sich" },
    { seit: "2026-09-22T14:08",
      text: "Pferd: Trab und Galopp unterscheiden" },
    { seit: "2026-09-22T14:08",
      text: "Frosch: Vorderfuesse und Sprungrichtung" },
    { seit: "2026-09-22T14:08",
      text: "Zauberer: Hut mit beiden Haenden" },
    { seit: "2026-09-22T14:08",
      text: "Hase aus dem Hut als eigener Effekt" },
    { seit: "2026-09-22T14:08",
      text: "Bongo auf dem Bild mit beiden Haenden" },
    { seit: "2026-09-22T14:08",
      text: "Billard-Physik" },
    { seit: "2026-09-22T14:08",
      text: "Cowboyhut: Hand richtet ihn aus, Yiihaa nicht abgeschnitten" },
    { seit: "2026-09-22T14:08",
      text: "Panels schliessen bei Klick ins Leere, Musik-Panel nicht beschnitten" },
    { seit: "2026-09-22T14:08",
      text: "Schwimmbecken: Bild taucht unter" },
    { seit: "2026-09-22T14:08",
      text: "Autofahrer-Geraeusch pruefen" },
    { seit: "2026-09-22T14:08",
      text: "Schiffe versenken mit 16 Plaetzen im selben Rahmen" },
    { seit: "2026-09-22T14:08",
      text: "Aufgabe-Modul ohne Funktion" },
    { seit: "2026-09-22T14:08",
      text: "Mario-Modus mit Muenzen und Punkten" },
    { seit: "2026-09-22T14:08",
      text: "Eigener Ton fuers Einschrauben der Birne" },
    { seit: "2026-09-22T14:08",
      text: "Stadt-Land-Fluss: Auswertung beim Spielfuehrer nachziehen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T14:08",
      text: "Das Profilbild schrumpft beim Verlassen des Platzes nicht mehr" },
    { seit: "2026-09-22T14:08",
      text: "Alle 93 Platz-Wirkungen und 28 Reisen auf Strichlinie, Nummer und Name geprueft — gruen" },
    { seit: "2026-09-22T14:08",
      text: "Stadt-Land-Fluss: Buchstabe ueber ein laufendes Alphabet zum Anhalten" },
    { seit: "2026-09-22T14:08",
      text: "Stadt-Land-Fluss: Sport, Film, Serie und Schauspieler:in als neue Spalten" },
    { seit: "2026-09-22T14:08",
      text: "Stadt-Land-Fluss: die Zusatzspalten sind waehlbar und bleiben ueber die Runden" },
    { seit: "2026-09-22T14:08",
      text: "Die Hand greift in sieben Stationen" },
    { seit: "2026-09-22T14:08",
      text: "Der Adler in sieben Federlagen" },
  ],
};
