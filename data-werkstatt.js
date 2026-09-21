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
  stand: "Runde 61 — Katapult und Strudel neu gezeichnet",

  inArbeit: [
    { seit: "2026-09-21T05:37",
      text: "Tor als stehende Wasserwand mit Partikeln und Plasma" },
    { seit: "2026-09-21T05:37",
      text: "Maulwurf in der Draufsicht: Erde rund um den Kreis, kein seitlicher Huegel" },
    { seit: "2026-09-21T05:37",
      text: "Peitsche: echter gewickelter Griff, und eine mehrschwaenzige fuer alle auf einmal" },
    { seit: "2026-09-21T05:37",
      text: "Billard-Prallphysik" },
    { seit: "2026-09-21T05:37",
      text: "Brueste in natuerlichem Hautton statt gelblich" },
    { seit: "2026-09-21T05:37",
      text: "Sanduhr auch am einzelnen Profilbild von oben nach unten" },
    { seit: "2026-09-21T05:37",
      text: "Rohrreise: der Reisende ist auf beiden Seiten gleichzeitig zu sehen" },
    { seit: "2026-09-21T05:37",
      text: "Effekte fuer ALLE gleichzeitig - umarmen, kuessen, treten, Bombe" },
    { seit: "2026-09-21T05:37",
      text: "Schneeball soll herunterrutschen statt im Bild zu kleben" },
    { seit: "2026-09-21T05:37",
      text: "Lok und Helikopter brauchen noch mehr Details" },
    { seit: "2026-09-21T05:37",
      text: "Whiteboard neu denken, alles ins Profil speichern statt lokal" },
    { seit: "2026-09-21T05:37", nurBetreiber: true,
      text: "Zwei Saetze neu einsprechen, dann hat der Tutor wieder ueberall deine Stimme. Erstens: „Schoen, dass du da bist! Ich bin Alex — Musiker und deutscher Muttersprachler. Ich helfe dir gerne mit Deutsch.\"" },
    { seit: "2026-09-21T05:37", nurBetreiber: true,
      text: "Zweitens: „Oben stehen drei Knoepfe: der Kalender, dein Profilbild, die Kaffeetasse. Im Kalender loest du jeden Tag eine Aufgabe und kommst von da zur Tagesgeschichte — eine Leseuebung in jedem Niveau und in vielen Sprachen.\"" },
    { seit: "2026-09-21T05:37", nurBetreiber: true,
      text: "Frage: die Kompass-Erklaerung im Tutor ist mit 148 Woertern die laengste. Kuerzen — oder so lassen, weil du sie selbst diktiert hast?" },
    { seit: "2026-09-21T05:37", nurBetreiber: true,
      text: "Der Tutorfilm ist aus dem COMIC gezeichnet. Wer im Profil das FOTO eingestellt hat, sieht deshalb jetzt sein Foto ohne Film. Soll ich die Filme auch fuer das Foto bauen?" },
    { seit: "2026-09-21T05:37", nurBetreiber: true,
      text: "Tutorvideo mit Greenscreen neu aufnehmen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T05:37",
      text: "Das Katapult ist ein Onager geworden: A-Bock, Torsionsbuendel an der Achse, Prellbalken mit Polster, Speichenraeder" },
    { seit: "2026-09-21T05:37",
      text: "Nachgerechnet, dass der Wurfarm um die ACHSE dreht (34|38) und nicht um sich selbst — sonst eiert er, statt zu schnellen" },
    { seit: "2026-09-21T05:37",
      text: "GEFUNDEN, warum der Strudel nie gezogen hat: es waren fuenf RINGE. Ein Ring ist rotationssymmetrisch — ein Kreis, der sich dreht, sieht aus wie ein Kreis, der steht" },
    { seit: "2026-09-21T05:37",
      text: "Jetzt sind es logarithmische Spiralarme, r(t) = r0 mal e hoch k t, in zwei Lagen mit verschiedenem Tempo" },
    { seit: "2026-09-21T05:37",
      text: "Dazu ein dunkler Schlund, der atmet, und sechzehn Schaumflocken, die auf einer Spirale nach innen laufen" },
    { seit: "2026-09-21T05:37",
      text: "Gemessen: der schwaechste Arm ist um den Faktor 11,3 spiralig — bei einem Kreis waere es 1,0" },
  ],
};
