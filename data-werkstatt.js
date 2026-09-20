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
  stand: "Runde 17 — jede Animation aus dem Verlauf noch einmal durchgegangen",

  inArbeit: [
    { seit: "2026-09-20T03:35",
      text: "Galgenmaennchen/Aufdecken reihum spielen und benoten" },
    { seit: "2026-09-20T03:35", nurBetreiber: true,
      text: "Sechs alte doppelte Animationsnamen im Stilblatt aufloesen (lcRufAn, lcSteigt, lcFunke, lcSteigtAuf, lcZuengelt, lcSprichtPuls)" },
    { seit: "2026-09-20T03:35", nurBetreiber: true,
      text: "TURN nachmessen: zwei Geraete an einem Tag in turn_nutzung" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-20T03:35",
      text: "Lasso und Angelhaken liegen jetzt VOR den Sitzplaetzen (gemessen: sie lagen dahinter) — dickeres Seil, dunkler Rand, man sieht sie wirklich." },
    { seit: "2026-09-20T03:35",
      text: "Tennis: der Schlaeger hat jetzt Saiten und eine echte Groesse zum Profilbild — der Kopf ist etwa doppelt so gross wie das Bild, das der Ball ist." },
    { seit: "2026-09-20T03:35",
      text: "Der Wasserstrahl kommt jetzt aus dem Eimer selbst: er sitzt in der Eimerzeichnung an der Ausgusskante und dreht beim Kippen mit." },
    { seit: "2026-09-20T03:35",
      text: "Die Stoerung ist wieder ein anklickbarer Effekt — man kann den Empfang des anderen stoeren UND sie als Sprechbild zeigen." },
    { seit: "2026-09-20T03:35",
      text: "Zufall wirft keinen Wuerfel mehr: es springt nur zwischen den Feldern hin und her, bis ein freier Platz da ist." },
    { seit: "2026-09-20T03:35",
      text: "Losfahren geht auch ohne Namen: einfach auf den freien Platz tippen, wo man hin will — das Bild rollt wie ein Rad ueber die Felder und setzt sich dort wirklich hin." },
    { seit: "2026-09-20T03:35",
      text: "Aufessen bis zum Schluss: nach dem letzten Biss ist der andere wirklich von der Buehne und setzt sich mit einem Tipp selbst wieder hin." },
    { seit: "2026-09-20T03:35",
      text: "Billard klassisch: das Profilbild des anderen rollt ueber die Felder und verschwindet in einem Loch auf einem freien Platz." },
    { seit: "2026-09-20T03:35", nurBetreiber: true,
      text: "Standardbudget der Edge-Function von 1 GB auf 25 GB hochgesetzt (rund hundert Stunden Relais im Monat, weiterhin im Freibetrag)." },
  ],
};
