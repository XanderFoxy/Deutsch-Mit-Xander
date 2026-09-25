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
  stand: "Fassung 678: Menü flach wie vorher, Schmerzstimmen, Erinnerungen",

  inArbeit: [
    { seit: "2026-09-25T19:17",
      text: "Spielwaffen als Scherz im Chat (groß sichtbar, ohne Platztausch, ohne Punkte, Haupt-/Zweitwaffe)" },
    { seit: "2026-09-25T19:17",
      text: "Tiere im Chat: reagieren auf Würfe, lecken Sahne, süß beim Streicheln, spielen in der Pause" },
    { seit: "2026-09-25T19:17",
      text: "Mauer als Schutz vor Chat-Effekten" },
    { seit: "2026-09-25T19:17",
      text: "Kampfsieg belohnen (maßvoll)" },
    { seit: "2026-09-25T19:17",
      text: "Handel unter Spielern: Getreide schenken/verkaufen, Kunden, Beliebtheit, Dünger (Vorbild Anno)" },
    { seit: "2026-09-25T19:17",
      text: "Latenz weiter senken" },
    { seit: "2026-09-25T19:17",
      text: "Funk 84/85 Rest: Mario-Röhren, Lok-Schranke, Hot-Rod-Weg, Feuerwerk, Monstertruck, Einzug, Knöpfe" },
    { seit: "2026-09-25T19:17",
      text: "Rückfrage #256 und Sprechbilder warten auf Xanders Antwort" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-25T19:17",
      text: "Spielfenster wie vorher, aber flach unten (höchstens 58 %) – Werte untereinander, nur der Inhalt scrollt, ☰ weg" },
    { seit: "2026-09-25T19:17",
      text: "Fundstück-Knopf legt nur das Fenster ab und zeigt das Säckchen – aufheben musst du selbst" },
    { seit: "2026-09-25T19:17",
      text: "Wassergraben zeigt sich nur noch, wenn er ein Beben schluckt" },
    { seit: "2026-09-25T19:17",
      text: "Zauberrad: eigener ruhiger Klang, nur einmal; die Zahl ist der Mana-Preis (steht jetzt dabei)" },
    { seit: "2026-09-25T19:17",
      text: "Schätze beim Graben zählen im Ranking" },
    { seit: "2026-09-25T19:17",
      text: "Schmerzstimmen Mann/Frau: Au, Autsch, Schrei, Aua das tut weh, Hör auf, Hau ab, Stöhnen, Hilfe, das war's – nie mehr als eine je Sekunde" },
    { seit: "2026-09-25T19:17",
      text: "Seltene Erinnerungen: Medizin, Hunger, kein Mana; Tier winselt, Drache grummelt" },
  ],
};
