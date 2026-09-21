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
  stand: "Fassung 430 — Runde 77: Sprechbilder, Hand und Toene",

  inArbeit: [
    { seit: "2026-09-21T20:59",
      text: "Vogel, der jemandem auf den Kopf macht — Zeichnung und Ton fehlen noch." },
    { seit: "2026-09-21T20:59",
      text: "Anspucken mit Rotze, die herunterlaeuft." },
    { seit: "2026-09-21T20:59",
      text: "Frisbee und Roehre auf eine PERSON werfen (Platztausch mit Trefferton)." },
    { seit: "2026-09-21T20:59",
      text: "Sprungbrett: jemanden als Absprung benutzen und zu einem gezeichneten Ziel springen." },
    { seit: "2026-09-21T20:59",
      text: "Pac-Man mit gezeichnetem Weg, Mund in Laufrichtung, Rueckweg ueber die Plaetze." },
    { seit: "2026-09-21T20:59",
      text: "Hammer mit Zufall und zerspringendem Glas; Katapult groesser; Sanduhr realistischer." },
    { seit: "2026-09-21T20:59",
      text: "Musik teilen (YouTube-Links) und der Kopfhoerer-Schnipsel aus dem Profil." },
    { seit: "2026-09-21T20:59",
      text: "Anziehen: Jacke, Schuhe, Hut als Bausteine, als Avatar speicherbar." },
    { seit: "2026-09-21T20:59",
      text: "Telefon mit echtem Audio nur zwischen zwei Leuten." },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T20:59",
      text: "Blut: der Deckel oben ist weg. Nur noch ein duenner Saum am Rand und zwei Rinnsale, die links und rechts herunterlaufen." },
    { seit: "2026-09-21T20:59",
      text: "Bluete: keine Leuchtvignette mehr, zwei Kraenze zu je dreizehn Blaettern (buendig, kein Spalt), und sie blueht an Ort und Stelle statt sich zu drehen." },
    { seit: "2026-09-21T20:59",
      text: "Regenbogen: jetzt Kreise von innen nach aussen (violett bis rot) statt Farben rundherum — und er faengt am Bildrand an." },
    { seit: "2026-09-21T20:59",
      text: "Spinnwebe: ein echtes Radnetz, das ringsum am Rahmen haengt. Die Spinne seilt sich in 2,8 s ab und krabbelt dann uebers Netz." },
    { seit: "2026-09-21T20:59",
      text: "Eis: die Zapfen haengen an einem durchgehenden Saum und stossen aneinander. Die Eisblumen wachsen vom Rand nach innen." },
    { seit: "2026-09-21T20:59",
      text: "Gluehen und Magie: 64 bzw. 66 Teilchen statt 36 bzw. 38, und viele kleine statt weniger grosser." },
    { seit: "2026-09-21T20:59",
      text: "Gluehbirne: der Schaft dreht sich jetzt sichtbar mit dem Glas mit." },
    { seit: "2026-09-21T20:59",
      text: "Hand und Gorillapranke stehen unter EINER Kachel. Die Finger knicken beim Zupacken wirklich ein, der Daumen kommt dagegen." },
    { seit: "2026-09-21T20:59",
      text: "Vier neue Toene: zupfraus, aufsetzen, ein neuer Cowboy-Ruf und farbelaeuft (laeuft jetzt, statt einzusaugen)." },
    { seit: "2026-09-21T20:59",
      text: "Maulwurf: der Erdwall laeuft mittig durch die Profilbilder (gemessen: vorher 10,6 px daneben, jetzt 1,6 px)." },
  ],
};
