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
  stand: "Runde 21 — Raum, Hintergrund fuer alle, Newsfeed",

  inArbeit: [
    { seit: "2026-09-17T14:32",
      text: "Ton und Bild vor dem Betreten wirklich einschalten." },
    { seit: "2026-09-17T14:32",
      text: "Orkan soll die Woerter deutlich durcheinanderwirbeln." },
    { seit: "2026-09-17T14:32",
      text: "Bonbons und Rennauto aufwerten." },
    { seit: "2026-09-17T14:32",
      text: "Effekte dort zeigen, wo man hinsieht." },
    { seit: "2026-09-17T14:32",
      text: "Druecken als echte Umarmung, gezielt an eine Person." },
    { seit: "2026-09-17T14:32",
      text: "Mehrere Videos rechts stapeln." },
    { seit: "2026-09-17T14:32", nurBetreiber: true,
      text: "Woerterbuch saeubern, dann A1 mit deiner Stimme." },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-17T14:32",
      text: "Der Hintergrund gilt jetzt fuer den RAUM, nicht mehr nur fuer dein Geraet: wer hereinkommt, sieht ihn sofort, und im Chat steht, wer ihn gewechselt hat." },
    { seit: "2026-09-17T14:32",
      text: "Ein zu grosses Bild wird ehrlich abgelehnt statt heimlich nur bei dir gesetzt — ein Rundruf hat eine Obergrenze." },
    { seit: "2026-09-17T14:32",
      text: "Neuer Rundknopf: Tuer. Er zeigt alle Raeume mit einem Klick — offen, abgeschlossen, wer wo ist — und man springt direkt hin." },
    { seit: "2026-09-17T14:32",
      text: "Der Newsfeed meldet jetzt auch, was geschieht: wer hereinkommt, wer einen Raum aufmacht, wer wechselt, wer abschliesst. Nach zwei Minuten ist es wieder weg." },
    { seit: "2026-09-17T14:32",
      text: "Raumnamen werden richtig gross geschrieben: aus Emmys raum wurde Emmys Raum." },
    { seit: "2026-09-17T14:32",
      text: "Im Laufband stand Xander ist gerade IM Klassenzimmer gekommen — das ist falsches Deutsch. Jetzt INS." },
  ],
};
