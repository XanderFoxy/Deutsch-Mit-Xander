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
  stand: "Runde 68 — Billard mit echter Prallphysik",

  inArbeit: [
    { seit: "2026-09-21T09:47",
      text: "Whiteboard neu denken, alles ins Profil speichern statt lokal" },
    { seit: "2026-09-21T09:47", nurBetreiber: true,
      text: "GUTHABEN NOETIG: ueber-04b, ueber-03b und ueber-05 fehlen noch auf Greenscreen. Das ElevenLabs-Guthaben ist alle - zuletzt 14.152 von 19.439 noetigen Credits." },
    { seit: "2026-09-21T09:47", nurBetreiber: true,
      text: "Offen geblieben und ehrlich benannt: rollt die Kugel durch einen Pulk, wird nur EINMAL abgelenkt - eine Kette aus mehreren Stoessen hintereinander rechnet sie nicht." },
    { seit: "2026-09-21T09:47", nurBetreiber: true,
      text: "Zwei Saetze neu einsprechen: „Schoen, dass du da bist! Ich bin Alex — Musiker und deutscher Muttersprachler. Ich helfe dir gerne mit Deutsch.\"" },
    { seit: "2026-09-21T09:47", nurBetreiber: true,
      text: "Und: „Oben stehen drei Knoepfe: der Kalender, dein Profilbild, die Kaffeetasse. Im Kalender loest du jeden Tag eine Aufgabe und kommst von da zur Tagesgeschichte — eine Leseuebung in jedem Niveau und in vielen Sprachen.\"" },
    { seit: "2026-09-21T09:47", nurBetreiber: true,
      text: "Frage: die Kompass-Erklaerung im Tutor ist mit 148 Woertern die laengste. Kuerzen — oder so lassen?" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T09:47",
      text: "Beim Billard kam bei jeder Kugel gleich viel Stoss an - die hinterste sprang genauso weit wie die, die daneben lag" },
    { seit: "2026-09-21T09:47",
      text: "Jetzt wird gerechnet: der Stoss faellt mit dem Abstand ab (1 durch 1 plus Abstand hoch zwei) und haengt am Winkel" },
    { seit: "2026-09-21T09:47",
      text: "GEMESSEN an drei Geometrien: in der Stossrichtung kommt 1,00 an, weit dahinter 0,11 - ein Unterschied von neun zu eins" },
    { seit: "2026-09-21T09:47",
      text: "Der erste Anlauf war zu streng: alles hinter dem Aufprall bekam glatt null, und bei drei von drei Geometrien ruehrte sich gar keine Kugel mehr" },
    { seit: "2026-09-21T09:47",
      text: "Deshalb ein Sockel: wer hinten liegt, bekommt noch 35 Prozent. Beim Anstoss spritzt der Pulk in alle Richtungen, nach hinten nur schwaecher" },
    { seit: "2026-09-21T09:47",
      text: "Wer ZWISCHEN Kugel und Ziel sass, wurde bisher gar nicht getroffen - die Kugel rollte durch ihn hindurch" },
    { seit: "2026-09-21T09:47",
      text: "Jetzt wird der senkrechte Abstand zur Bahn gerechnet: naeher als 0,62 Platzabstaende, und er wird im Vorbeirollen quer weggedrueckt - gemessen 0,35" },
    { seit: "2026-09-21T09:47",
      text: "Und der Gefallene faellt in das Loch, das in SEINER Flugrichtung liegt, nicht mehr in das naechste ueberhaupt" },
    { seit: "2026-09-21T09:47",
      text: "Der Platzabstand wird gemessen, nicht angenommen: auf dem Telefon sieht das Gitter anders aus als am Rechner" },
  ],
};
