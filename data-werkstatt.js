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
  stand: "Runde 84: YouTube teilen, Anziehen, Telefon — Runde 76 ist damit abgearbeitet",

  inArbeit: [
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T09:17",
      text: "MUSIK TEILEN MIT YOUTUBE: /yt <Link> laesst ein Video bei allen im Raum laufen, /yt <Link> 1:20 faengt spaeter an, /yt aus macht es zu. Die Kennung faehrt mit, nicht das Bild — jedes Geraet baut seinen eigenen Spieler. GEMESSEN: alle fuenf ueblichen Linkformen ergeben dieselbe Kennung, ein fremder Link keine; die Karte sitzt im Klassenzimmer und ist 16:9." },
    { seit: "2026-09-22T09:17",
      text: "DAS ANZIEH-MODUL: /anziehen Name krone setzt jemandem etwas auf, das ANBLEIBT — Krone, Brille, Sonnenbrille, Schnurrbart, Wollmuetze, Maske. In der Kachel Anziehen stehen alle sechs und ein Ausziehen. GEMESSEN: es sitzt auf den Bildpunkt genau auf dem Profilbild, ueberlebt das Neuzeichnen der Sitzreihe und wird nur dem Einen wieder abgenommen." },
    { seit: "2026-09-22T09:17",
      text: "TELEFON MIT AUDIO: /telefon Name laesst es beim Angerufenen klingeln — sein Hoerer wackelt im Takt —, und wenn abgehoben ist, geht die Schnur zwischen euch auf. Neues Geraeusch ton/telefon mit dem deutschen Freizeichen (425 Hz), Gabel, Hoerer und offener Leitung. GEMESSEN: zwei Klingeln in 3,40 s; die Schnur ist bei 2,6 s noch ganz zu und bei 4,2 s offen." },
    { seit: "2026-09-22T09:17",
      text: "Neue Pruefung werkzeug/pruefe-runde84.js mit siebzehn Regeln, alle gruen. Damit ist Xanders Liste aus Runde 76 vollstaendig abgearbeitet." },
  ],
};
