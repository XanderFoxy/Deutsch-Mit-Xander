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
  stand: "Runde 80, zehnter Teil: Kopfhoerer, Zugvoegel, Spuckton",

  inArbeit: [
    { seit: "2026-09-22T03:53",
      text: "Der Rest von Xanders Liste vom 22. September" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T03:53",
      text: "Der Kopfhoerer laesst Luft: der Buegel sitzt 5,5 px ueber dem Bildrand statt darauf (gemessen). Die Breite bleibt bei 112 %, sonst ueberschneidet er sich mit dem Nachbarplatz — zwischen zwei Bildern liegen nur 7 px." },
    { seit: "2026-09-22T03:53",
      text: "Ein Song-Ausschnitt laesst sich jetzt angeben: /kopfhoerer Bea 3 1:20-1:50 spielt genau diese dreissig Sekunden. Der Ausschnitt reist in der Nachricht mit, gilt also auf dem Geraet des Hoerers." },
    { seit: "2026-09-22T03:53",
      text: "Die Zugvoegel schlagen nicht mehr ohne Pause: vier Schlaege, dann Gleiten (gemessen 8 Schritte mit Schlag, 14 im Gleiten von 25). Und der Keil faehrt auf der Luft statt schnurgerade zu ziehen — vier Hoehenwechsel, 413 px Spanne." },
    { seit: "2026-09-22T03:53",
      text: "Das Spuckgeraeusch ist neu gerechnet. GEMESSEN war der Auswurf mit -31 dB die LEISESTE Stelle — leiser als das Raeuspern davor. Jetzt ist er mit -18,7 dB der lauteste Punkt des ganzen Geraeusches." },
    { seit: "2026-09-22T03:53",
      text: "Neue Pruefung werkzeug/pruefe-runde81.js: 36 Regeln fuer diesen Teil der Liste, alle gruen. Fuenf aeltere Pruefungen pruefen jetzt, was die Regel meint, statt der Zahlen, die Xander aendern wollte." },
  ],
};
