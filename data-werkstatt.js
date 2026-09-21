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
  stand: "Runde 60 — der Tutor, das Paddel und das Seitenrad",

  inArbeit: [
    { seit: "2026-09-21T05:19",
      text: "Katapult- und Strudelanimation neu zeichnen" },
    { seit: "2026-09-21T05:19",
      text: "Tor als stehende Wasserwand mit Partikeln und Plasma" },
    { seit: "2026-09-21T05:19",
      text: "Maulwurf in der Draufsicht: Erde rund um den Kreis, kein seitlicher Huegel" },
    { seit: "2026-09-21T05:19",
      text: "Peitsche: echter gewickelter Griff, und eine mehrschwaenzige fuer alle auf einmal" },
    { seit: "2026-09-21T05:19",
      text: "Billard-Prallphysik" },
    { seit: "2026-09-21T05:19",
      text: "Brueste in natuerlichem Hautton statt gelblich" },
    { seit: "2026-09-21T05:19",
      text: "Sanduhr auch am einzelnen Profilbild von oben nach unten" },
    { seit: "2026-09-21T05:19",
      text: "Rohrreise: der Reisende ist auf beiden Seiten gleichzeitig zu sehen" },
    { seit: "2026-09-21T05:19",
      text: "Effekte fuer ALLE gleichzeitig - umarmen, kuessen, treten, Bombe" },
    { seit: "2026-09-21T05:19",
      text: "Schneeball soll herunterrutschen statt im Bild zu kleben" },
    { seit: "2026-09-21T05:19",
      text: "Lok und Helikopter brauchen noch mehr Details" },
    { seit: "2026-09-21T05:19",
      text: "Whiteboard neu denken, alles ins Profil speichern statt lokal" },
    { seit: "2026-09-21T05:19", nurBetreiber: true,
      text: "Zwei Saetze neu einsprechen, dann hat der Tutor wieder ueberall deine Stimme. Erstens: „Schoen, dass du da bist! Ich bin Alex — Musiker und deutscher Muttersprachler. Ich helfe dir gerne mit Deutsch.\"" },
    { seit: "2026-09-21T05:19", nurBetreiber: true,
      text: "Zweitens: „Oben stehen drei Knoepfe: der Kalender, dein Profilbild, die Kaffeetasse. Im Kalender loest du jeden Tag eine Aufgabe und kommst von da zur Tagesgeschichte — eine Leseuebung in jedem Niveau und in vielen Sprachen.\"" },
    { seit: "2026-09-21T05:19", nurBetreiber: true,
      text: "Frage: die Kompass-Erklaerung im Tutor ist mit 148 Woertern die laengste. Kuerzen — oder so lassen, weil du sie selbst diktiert hast?" },
    { seit: "2026-09-21T05:19", nurBetreiber: true,
      text: "Der Film ist aus dem COMIC gezeichnet. Wer im Profil das FOTO eingestellt hat, sieht deshalb jetzt sein Foto ohne Film. Soll ich die Filme auch fuer das Foto bauen?" },
    { seit: "2026-09-21T05:19", nurBetreiber: true,
      text: "Tutorvideo mit Greenscreen neu aufnehmen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T05:19",
      text: "Der Tutor sagt nicht mehr ‚Musiker und Deutsch-Helfer, aber kein Lehrer‘ — sondern Musiker und deutscher Muttersprachler" },
    { seit: "2026-09-21T05:19",
      text: "Der Kalender steht nicht mehr ‚links‘: erst Kalender, dann Profil, dann Kaffeetasse — nachgesehen in index.html" },
    { seit: "2026-09-21T05:19",
      text: "Das lange Wetterstueck ist geteilt statt gekuerzt: 26,6 s wurden 14,8 s und 11,7 s, kein Wort verloren" },
    { seit: "2026-09-21T05:19",
      text: "Die Teilstelle ist nicht geschaetzt: bei 14,535 s abgeschnitten und transkribiert — dort endet ‚…die deutsche Uhrzeit‘" },
    { seit: "2026-09-21T05:19",
      text: "GEFUNDEN: der Freistellungsschluessel hat die schwarzen Comiclinien selbst weggeschnitten — 180 bis 247 Teile je Einzelbild statt einem" },
    { seit: "2026-09-21T05:19",
      text: "Alle fuenf Tutorfilme neu freigestellt: kein weisser Saum mehr, genau ein Stueck je Bild" },
    { seit: "2026-09-21T05:19",
      text: "Das lose Symbol unten rechts war Freistellungs-Schutt — in jedem Film weg, gezaehlt ueber den ganzen Film" },
    { seit: "2026-09-21T05:19",
      text: "Der Film steht jetzt genauso gross wie das Standbild: 98,11 statt 98,08 Prozent der Bildhoehe, gleiche Fusslinie" },
    { seit: "2026-09-21T05:19",
      text: "GEMESSEN: der Filmkopf ist 1,55-mal so gross wie im FOTO, aber gleich gross wie im COMIC — daher laeuft der Film nur ueber dem Comic" },
    { seit: "2026-09-21T05:19",
      text: "Das Segelboot paddelt: Stechpaddel mit breitem Blatt, das unter dem Rumpf ins Wasser taucht, dazu ein Platscher" },
    { seit: "2026-09-21T05:19",
      text: "Der Raddampfer hat das grosse Schaufelrad MITTSCHIFFS, im Radkasten mit Namensschild — wie ein Mississippi-Seitenraddampfer" },
    { seit: "2026-09-21T05:19",
      text: "Zur Frage: es gab beides. Das Heckrad war die spaetere, billigere Bauart fuer enge Nebenfluesse; das klassische Bild ist das Seitenrad" },
    { seit: "2026-09-21T05:19",
      text: "GEFUNDEN: ein zweiter, toter Raddampfer-Zweig im Code, den seit Runde 50 niemand gesehen hat — entfernt" },
    { seit: "2026-09-21T05:19",
      text: "Der Lokfilm heisst jetzt /zug: ‚gglok‘ war ein alter Name, den es als Befehl nicht geben darf — dadurch war die Wirkung ‚zug‘ unerreichbar" },
  ],
};
