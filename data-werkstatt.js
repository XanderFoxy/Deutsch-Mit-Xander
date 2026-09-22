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
  stand: "Runde 88e — die Emoji-Haende haben keinen abgespreizten Daumen mehr, und beim Klatschen treffen sich die Handflaechen in der Mitte.",

  inArbeit: [
    { seit: "2026-09-22T15:31",
      text: "Aufgabe-Modul: unklar, welches gemeint ist — Rueckfrage an Xander" },
    { seit: "2026-09-22T15:31",
      text: "Klaps auf den Popo: Hand kommt von hinten, nicht von der Seite" },
    { seit: "2026-09-22T15:31",
      text: "Maulwurf reisst die Plaetze wieder auf" },
    { seit: "2026-09-22T15:31",
      text: "Lok: Kurvenmodule, Draufsicht, Schrei beim Ueberfahren" },
    { seit: "2026-09-22T15:31",
      text: "Pferd: Trab und Galopp unterscheiden" },
    { seit: "2026-09-22T15:31",
      text: "Frosch: Vorderfuesse und Sprungrichtung" },
    { seit: "2026-09-22T15:31",
      text: "Zauberer: Hut mit beiden Haenden" },
    { seit: "2026-09-22T15:31",
      text: "Hase aus dem Hut als eigener Effekt" },
    { seit: "2026-09-22T15:31",
      text: "Bongo auf dem Bild mit beiden Haenden" },
    { seit: "2026-09-22T15:31",
      text: "Billard-Physik" },
    { seit: "2026-09-22T15:31",
      text: "Autofahrer-Geraeusch pruefen" },
    { seit: "2026-09-22T15:31",
      text: "Mario-Modus mit Muenzen und Punkten" },
    { seit: "2026-09-22T15:31",
      text: "Eigener Ton fuers Einschrauben der Birne" },
    { seit: "2026-09-22T15:31",
      text: "Stadt-Land-Fluss: Auswertung beim Spielfuehrer nachziehen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T15:31",
      text: "Winkende Hand: der Daumen steht nur noch 42 Grad ab statt 68 — eine offene, entspannte Hand" },
    { seit: "2026-09-22T15:31",
      text: "Klatschende Haende: der Daumen liegt schraeg nach oben an, nicht mehr waagerecht abgespreizt" },
    { seit: "2026-09-22T15:31",
      text: "Klatschende Haende: sie sind einander zugeneigt und treffen sich mit den Handflaechen in der Mitte" },
    { seit: "2026-09-22T15:31",
      text: "Klatschende Haende: das Vorzeichen der gespiegelten Hand war verkehrt — es gab nie einen Anschlag" },
    { seit: "2026-09-22T15:31",
      text: "Hautfarbe: weniger bunt, naeher an echter Haut" },
  ],
};
