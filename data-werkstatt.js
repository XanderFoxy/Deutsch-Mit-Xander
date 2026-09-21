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
  stand: "Runde 63 — Maulwurf von oben, Hautton, Schneerutsch, Sanduhr",

  inArbeit: [
    { seit: "2026-09-21T06:14",
      text: "Tor als stehende Wasserwand mit Partikeln und Plasma" },
    { seit: "2026-09-21T06:14",
      text: "Peitsche: echter gewickelter Griff, und eine mehrschwaenzige fuer alle auf einmal" },
    { seit: "2026-09-21T06:14",
      text: "Billard-Prallphysik" },
    { seit: "2026-09-21T06:14",
      text: "Rohrreise: der Reisende ist auf beiden Seiten gleichzeitig zu sehen" },
    { seit: "2026-09-21T06:14",
      text: "Effekte fuer ALLE gleichzeitig - umarmen, kuessen, treten, Bombe" },
    { seit: "2026-09-21T06:14",
      text: "Lok und Helikopter brauchen noch mehr Details" },
    { seit: "2026-09-21T06:14",
      text: "Whiteboard neu denken, alles ins Profil speichern statt lokal" },
    { seit: "2026-09-21T06:14", nurBetreiber: true,
      text: "Freigestellt wurde bisher auf SCHWARZ - und du traegst schwarzen Pullover, schwarze Schuhe, schwarze Muetze. tutorvideo-bauen.sh nimmt jetzt GREENSCREEN; fuer neue Aufnahmen brauchst du nur einen gruenen Hintergrund." },
    { seit: "2026-09-21T06:14", nurBetreiber: true,
      text: "Zwei Saetze neu einsprechen: „Schoen, dass du da bist! Ich bin Alex — Musiker und deutscher Muttersprachler. Ich helfe dir gerne mit Deutsch.\"" },
    { seit: "2026-09-21T06:14", nurBetreiber: true,
      text: "Und: „Oben stehen drei Knoepfe: der Kalender, dein Profilbild, die Kaffeetasse. Im Kalender loest du jeden Tag eine Aufgabe und kommst von da zur Tagesgeschichte — eine Leseuebung in jedem Niveau und in vielen Sprachen.\"" },
    { seit: "2026-09-21T06:14", nurBetreiber: true,
      text: "Frage: die Kompass-Erklaerung im Tutor ist mit 148 Woertern die laengste. Kuerzen — oder so lassen, weil du sie selbst diktiert hast?" },
    { seit: "2026-09-21T06:14", nurBetreiber: true,
      text: "Der Tutorfilm ist aus dem COMIC gezeichnet. Wer im Profil das FOTO eingestellt hat, sieht sein Foto ohne Film. Soll ich die Filme auch fuer das Foto bauen?" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T06:14",
      text: "Der Maulwurfshuegel ist von oben gezeichnet: Kranz aus loser Erde, offener Ausgang, Krumen aussenherum" },
    { seit: "2026-09-21T06:14",
      text: "Der Maulwurf schaut mit Ruesselnase, zwei Nasenloechern und Tasthaaren heraus und schnuppert" },
    { seit: "2026-09-21T06:14",
      text: "Der Rand ist gewobbelt gerechnet und laeuft als weiche Kurve — eine Kreislinie sieht immer nach Zeichnung aus, nie nach Erde" },
    { seit: "2026-09-21T06:14",
      text: "Der Hautton war messbar zu gelb: 30 Grad Farbton bei 84 Prozent Saettigung. Jetzt 21 Grad bei 60 - dazu ein Verlauf statt einer flachen Flaeche" },
    { seit: "2026-09-21T06:14",
      text: "Dieselbe Haut bekommen auch die drei Haende (Ohrfeige, Basketball, Streicheln), sonst passt es nicht zusammen" },
    { seit: "2026-09-21T06:14",
      text: "Der Schneeklecks rutscht jetzt wirklich: 60 Prozent der Bildhoehe statt 10, und er wird dabei schmaler und laenger" },
    { seit: "2026-09-21T06:14",
      text: "Die Schmiere waechst mit, sonst haengt der Klecks unten und die Spur endet in der Luft" },
    { seit: "2026-09-21T06:14",
      text: "Die Sanduhr laesst jetzt JEDES einzelne Profilbild zerrinnen - auch ohne Gegenueber, mit Platznummer und fuer alle" },
  ],
};
