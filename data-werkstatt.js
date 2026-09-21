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
  stand: "Runde 64 — Loecher farbig gefuellt, Cowboyruf zurueck, der Ball rattert",

  inArbeit: [
    { seit: "2026-09-21T06:41",
      text: "Tor als stehende Wasserwand mit Partikeln und Plasma" },
    { seit: "2026-09-21T06:41",
      text: "Peitsche: echter gewickelter Griff, und eine mehrschwaenzige fuer alle auf einmal" },
    { seit: "2026-09-21T06:41",
      text: "Billard-Prallphysik" },
    { seit: "2026-09-21T06:41",
      text: "Rohrreise: der Reisende ist auf beiden Seiten gleichzeitig zu sehen" },
    { seit: "2026-09-21T06:41",
      text: "Effekte fuer ALLE gleichzeitig - umarmen, kuessen, treten, Bombe" },
    { seit: "2026-09-21T06:41",
      text: "Lok und Helikopter brauchen noch mehr Details" },
    { seit: "2026-09-21T06:41",
      text: "Whiteboard neu denken, alles ins Profil speichern statt lokal" },
    { seit: "2026-09-21T06:41", nurBetreiber: true,
      text: "ENTSCHEIDUNG NOETIG: die fuenf Tutorfilme auf Greenscreen neu erzeugen? Gemessener Voranschlag (nichts ausgegeben): 1,73 $ fuer 9,8 Sekunden, also rund 0,18 $ je Sekunde - alle fuenf zusammen etwa 9,60 $." },
    { seit: "2026-09-21T06:41", nurBetreiber: true,
      text: "Nachgezaehlt, warum Gruen richtig ist: an der Comicfigur sind 0 von 69.450 Pixeln gruenlich. Bei Schwarz waren es Pullover, Schuhe, Muetze und jede Konturlinie." },
    { seit: "2026-09-21T06:41", nurBetreiber: true,
      text: "Die Greenscreen-Vorlage liegt fertig bereit; tutorvideo-bauen.sh schluesselt schon auf Gruen und zieht danach automatisch auf die Masse des Standbild-Avatars." },
    { seit: "2026-09-21T06:41", nurBetreiber: true,
      text: "Zwei Saetze neu einsprechen: „Schoen, dass du da bist! Ich bin Alex — Musiker und deutscher Muttersprachler. Ich helfe dir gerne mit Deutsch.\"" },
    { seit: "2026-09-21T06:41", nurBetreiber: true,
      text: "Und: „Oben stehen drei Knoepfe: der Kalender, dein Profilbild, die Kaffeetasse. Im Kalender loest du jeden Tag eine Aufgabe und kommst von da zur Tagesgeschichte — eine Leseuebung in jedem Niveau und in vielen Sprachen.\"" },
    { seit: "2026-09-21T06:41", nurBetreiber: true,
      text: "Frage: die Kompass-Erklaerung im Tutor ist mit 148 Woertern die laengste. Kuerzen — oder so lassen?" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T06:41",
      text: "Die Loecher werden jetzt mit Farbe aus der Umgebung gefuellt, nicht mehr nur undurchsichtig gemacht" },
    { seit: "2026-09-21T06:41",
      text: "GEMESSEN: unter den Loechern lag eine mittlere Helligkeit von 11 - also Schwarz. Ein schwarzes Pflaster faellt in der Hose sofort auf" },
    { seit: "2026-09-21T06:41",
      text: "Die schwarzen Comiclinien bleiben dabei verschont: gefuellt wird nur, was weiter als zwei Pixel von echter Farbe entfernt liegt" },
    { seit: "2026-09-21T06:41",
      text: "An einem Einzelbild: 7.674 farblose Punkte, davon 709 gefuellt, 6.965 Linienpunkte unberuehrt" },
    { seit: "2026-09-21T06:41",
      text: "Unten wird staerker geschlossen als oben - da sind die schwarzen Schuhe, oben die Finger und die Muetzenkante" },
    { seit: "2026-09-21T06:41",
      text: "Der Cowboyhut hat Steppnaht am Krempenrand, Licht auf der Krone und Schatten unter der Krempe" },
    { seit: "2026-09-21T06:41",
      text: "Und das urspruengliche Cowboy-Geraeusch ist zurueck (cowboy.opus, 2,0 s)" },
    { seit: "2026-09-21T06:41",
      text: "Der Basketball rattert im Ring: vier abnehmende Ausschlaege, der Ring bebt mit, dann faellt er durchs Netz" },
    { seit: "2026-09-21T06:41",
      text: "Neues Geraeusch korbrattern: Ring, vier Scheppertreffer, Netz, Aufprall auf dem Hallenboden" },
    { seit: "2026-09-21T06:41",
      text: "Der alte Korbton stand auf festen 3600 ms - also auf gut Glueck. Jetzt loest ihn der Wurf im Moment des Anschlags aus" },
  ],
};
