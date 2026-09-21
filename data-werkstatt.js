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
  stand: "Runde 66 — Helikopter mit echtem Rotor, gewickelter Griff, die Neunschwaenzige, Rohrreise auf beiden Seiten",

  inArbeit: [
    { seit: "2026-09-21T08:25",
      text: "Tor als stehende Wasserwand mit Partikeln und Plasma" },
    { seit: "2026-09-21T08:25",
      text: "Billard-Prallphysik" },
    { seit: "2026-09-21T08:25",
      text: "Effekte fuer ALLE gleichzeitig - umarmen, kuessen, treten, Bombe" },
    { seit: "2026-09-21T08:25",
      text: "Whiteboard neu denken, alles ins Profil speichern statt lokal" },
    { seit: "2026-09-21T08:25", nurBetreiber: true,
      text: "GUTHABEN NOETIG: ueber-04b, ueber-03b und ueber-05 fehlen noch auf Greenscreen. Das ElevenLabs-Guthaben ist alle - zuletzt 14.152 von 19.439 noetigen Credits." },
    { seit: "2026-09-21T08:25", nurBetreiber: true,
      text: "Zwei Saetze neu einsprechen: „Schoen, dass du da bist! Ich bin Alex — Musiker und deutscher Muttersprachler. Ich helfe dir gerne mit Deutsch.\"" },
    { seit: "2026-09-21T08:25", nurBetreiber: true,
      text: "Und: „Oben stehen drei Knoepfe: der Kalender, dein Profilbild, die Kaffeetasse. Im Kalender loest du jeden Tag eine Aufgabe und kommst von da zur Tagesgeschichte — eine Leseuebung in jedem Niveau und in vielen Sprachen.\"" },
    { seit: "2026-09-21T08:25", nurBetreiber: true,
      text: "Frage: die Kompass-Erklaerung im Tutor ist mit 148 Woertern die laengste. Kuerzen — oder so lassen?" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T08:25",
      text: "Der Rotor sass NEBEN dem Mast: der Rotorkopf steht im Bild auf 43,85 / 14,29 Prozent, der Rotorkasten stand auf 42 / 2" },
    { seit: "2026-09-21T08:25",
      text: "Und er drehte wie ein Flugzeugpropeller. Von der Seite dreht sich nichts sichtbar - das Blatt wandert nach hinten, wird schmal, kommt vorn wieder heraus" },
    { seit: "2026-09-21T08:25",
      text: "Das Profilbild war 30 Prozent von 2,1 Bildbreiten gross und deckte den ganzen Helikopter zu. Jetzt sitzt es in der verglasten Kanzel" },
    { seit: "2026-09-21T08:25",
      text: "Der Helikopter steht auf seinem eigenen Abwind - drei Ringe, die unter den Kufen auseinanderlaufen" },
    { seit: "2026-09-21T08:25",
      text: "Der Peitschengriff ist jetzt WIRKLICH gewickelt: Knauf, Koerper, neun Riemen mit je einer hellen Kante, Zwinge, Glanzstrich" },
    { seit: "2026-09-21T08:25",
      text: "Vorher war es ein Rechteck mit einem schraegen Streifenmuster - ein Muster ist aber keine Wicklung" },
    { seit: "2026-09-21T08:25",
      text: "NEU: die Neunschwaenzige (/neunschwanz). Ein Griff, aus dem fuer JEDEN im Raum ein Schwanz laeuft, alle knallen bei 780 ms zugleich" },
    { seit: "2026-09-21T08:25",
      text: "Jeder Schwanz bekommt seinen gemessenen Winkel und seine gemessene Laenge, und jeder schwingt anders - sonst liegen sie uebereinander" },
    { seit: "2026-09-21T08:25",
      text: "Die Bahn wird gleich in der gemessenen Laenge gezeichnet statt gestreckt: sonst wird ein kurzer Schwanz duenn wie ein Haar" },
    { seit: "2026-09-21T08:25",
      text: "Rohrreise: man sieht den Reisenden jetzt an BEIDEN Roehren gleichzeitig - am Startrohr schaut der Scheitel heraus, am Zielrohr steigt er auf" },
    { seit: "2026-09-21T08:25",
      text: "Die Roehren standen zeitlich falsch: die Startroehre war nach 1,5 s wieder eingefahren, die Zielroehre kam erst bei 1,8 s. Jetzt haengen beide an der Reisezeit" },
    { seit: "2026-09-21T08:25", nurBetreiber: true,
      text: "Nachgetragen in pruefe-runde64: dort war die GERATENE Gruenfarbe 0x00b140 festgenagelt. Ein Pruefsatz, der einen geratenen Wert festhaelt, haelt den Fehler fest" },
  ],
};
