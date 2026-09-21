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
  stand: "Runde 62 — kein zweiter Alex mehr hinter dem Film",

  inArbeit: [
    { seit: "2026-09-21T05:48",
      text: "Tor als stehende Wasserwand mit Partikeln und Plasma" },
    { seit: "2026-09-21T05:48",
      text: "Maulwurf in der Draufsicht: Erde rund um den Kreis, kein seitlicher Huegel" },
    { seit: "2026-09-21T05:48",
      text: "Peitsche: echter gewickelter Griff, und eine mehrschwaenzige fuer alle auf einmal" },
    { seit: "2026-09-21T05:48",
      text: "Billard-Prallphysik" },
    { seit: "2026-09-21T05:48",
      text: "Brueste in natuerlichem Hautton statt gelblich" },
    { seit: "2026-09-21T05:48",
      text: "Sanduhr auch am einzelnen Profilbild von oben nach unten" },
    { seit: "2026-09-21T05:48",
      text: "Rohrreise: der Reisende ist auf beiden Seiten gleichzeitig zu sehen" },
    { seit: "2026-09-21T05:48",
      text: "Effekte fuer ALLE gleichzeitig - umarmen, kuessen, treten, Bombe" },
    { seit: "2026-09-21T05:48",
      text: "Schneeball soll herunterrutschen statt im Bild zu kleben" },
    { seit: "2026-09-21T05:48",
      text: "Lok und Helikopter brauchen noch mehr Details" },
    { seit: "2026-09-21T05:48",
      text: "Whiteboard neu denken, alles ins Profil speichern statt lokal" },
    { seit: "2026-09-21T05:48", nurBetreiber: true,
      text: "DER GRUND fuer die Freistellungsluecken: freigestellt wurde auf SCHWARZ. Du traegst schwarzen Pullover, schwarze Schuhe, schwarze Muetze, und der Comic hat schwarze Konturlinien. Zwei Dinge in derselben Farbe sind nicht zu trennen." },
    { seit: "2026-09-21T05:48", nurBetreiber: true,
      text: "Deshalb nimmt werkzeug/tutorvideo-bauen.sh jetzt GREENSCREEN (chromakey + despill). Fuer neue Aufnahmen brauchst du nur einen gruenen Hintergrund — den Rest macht das Werkzeug." },
    { seit: "2026-09-21T05:48", nurBetreiber: true,
      text: "Zwei Saetze neu einsprechen: „Schoen, dass du da bist! Ich bin Alex — Musiker und deutscher Muttersprachler. Ich helfe dir gerne mit Deutsch.\"" },
    { seit: "2026-09-21T05:48", nurBetreiber: true,
      text: "Und: „Oben stehen drei Knoepfe: der Kalender, dein Profilbild, die Kaffeetasse. Im Kalender loest du jeden Tag eine Aufgabe und kommst von da zur Tagesgeschichte — eine Leseuebung in jedem Niveau und in vielen Sprachen.\"" },
    { seit: "2026-09-21T05:48", nurBetreiber: true,
      text: "Frage: die Kompass-Erklaerung im Tutor ist mit 148 Woertern die laengste. Kuerzen — oder so lassen, weil du sie selbst diktiert hast?" },
    { seit: "2026-09-21T05:48", nurBetreiber: true,
      text: "Der Tutorfilm ist aus dem COMIC gezeichnet. Wer im Profil das FOTO eingestellt hat, sieht sein Foto ohne Film. Soll ich die Filme auch fuer das Foto bauen?" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T05:48",
      text: "GEFUNDEN: das Standbild wurde beim Film nur ANGEHALTEN, nicht versteckt — es stand die ganze Zeit dahinter. Das war der zweite Alex" },
    { seit: "2026-09-21T05:48",
      text: "Ueberall, wo der Film durchsichtig ist, schien es durch und zeigte eine andere Haltung. Das sah aus wie eine Freistellungsluecke, war aber keine" },
    { seit: "2026-09-21T05:48",
      text: "Jetzt ist es weg, solange der Film wirklich laeuft — faellt der Film aus, steht es wieder da. Der Rueckfall bleibt" },
    { seit: "2026-09-21T05:48",
      text: "Auch ohne :has(): der Tutor setzt die Klasse selbst, damit die Regel auf jedem Browser greift" },
    { seit: "2026-09-21T05:48",
      text: "Alle Filme aus den ROHDATEIEN neu freigestellt, mit staerkerer Reparatur unten, wo die schwarzen Schuhe sind" },
    { seit: "2026-09-21T05:48",
      text: "GEMESSEN im Schuhbereich je Einzelbild: roh 1741 enge Luecken und 3092 eingeschlossene Loecher - jetzt 33 bis 104 und ueberall NULL" },
  ],
};
