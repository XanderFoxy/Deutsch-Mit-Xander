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
  stand: "Fassung 338 — Filme, Glücksrad, Schrei, Relais",

  inArbeit: [
    { seit: "2026-09-19T18:11",
      text: "Den T-Rex in besserer Guete neu rechnen — dazu brauche ich die Originaldatei noch einmal" },
    { seit: "2026-09-19T18:11",
      text: "Nachmessen, ob bei einem Gespraech wirklich ZWEI Geraete in turn_nutzung stehen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-19T18:11",
      text: "Die Filme heissen wie ihr Befehl: /trex, /loewe, /adler, /lok, /zug, /uboot, /raumschiff (auch /ufo) — und verschenken nichts mehr" },
    { seit: "2026-09-19T18:11",
      text: "Tiere und Fahrzeuge sind zwei eigene Schubladen in der Befehlsliste; die Filme stehen jetzt darin" },
    { seit: "2026-09-19T18:11",
      text: "Der Ton aller neun Filme neu gesetzt: er war zu 87 Prozent Bass und auf dem Telefon darum duenn" },
    { seit: "2026-09-19T18:11",
      text: "Beim Schreien wackelt die Schrift wieder wie frueher — zusammen mit dem Licht und dem Kreisel" },
    { seit: "2026-09-19T18:11",
      text: "Befehle, die es nicht gibt, gehen nicht mehr als Text hinaus (/hallo)" },
    { seit: "2026-09-19T18:11",
      text: "Das Gluecksrad: /raten mit eigenem Satz oder einer von zwanzig Redewendungen" },
    { seit: "2026-09-19T18:11",
      text: "Kurze Beschreibungen in der Befehlsliste — Fluestern heisst Fluestern, /op heisst Admin, /k heisst Kick" },
    { seit: "2026-09-19T18:11",
      text: "TURN: die Ursache gefunden und behoben — das Monatsbudget stand auf 1 GB und war nach 14 Ausgaben leer" },
  ],
};
