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
  stand: "Runde 19 — Layout und die Werkstatt selbst",

  inArbeit: [
    { seit: "2026-09-17T14:12",
      text: "Hintergrund springt groesser, wenn man die Befehle aufklappt." },
    { seit: "2026-09-17T14:12",
      text: "Hintergrund ausschalten und auf Standard zurueck." },
    { seit: "2026-09-17T14:12",
      text: "Fertige animierte Hintergruende, auch ohne eigenes Bild." },
    { seit: "2026-09-17T14:12",
      text: "Hintergrund fuer alle im Raum sichtbar machen." },
    { seit: "2026-09-17T14:12",
      text: "Raumliste mit einem Klick: offen, verschlossen, wer ist wo." },
    { seit: "2026-09-17T14:12",
      text: "Newsfeed meldet, was im Klassenzimmer passiert." },
    { seit: "2026-09-17T14:12",
      text: "Ton und Bild vor dem Betreten wirklich einschalten." },
    { seit: "2026-09-17T14:12",
      text: "Orkan, Bonbons, Rennauto aufwerten." },
    { seit: "2026-09-17T14:12", nurBetreiber: true,
      text: "Woerterbuch saeubern, dann A1 mit deiner Stimme." },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-17T14:12",
      text: "DIE WERKSTATT GEHT WIEDER. Sie fragte nach window.Backend, aber backend.js legt Backend als const an — das ist nie eine Eigenschaft von window. Die Pruefung konnte gar nichts als nein ergeben." },
    { seit: "2026-09-17T14:12",
      text: "Sie verschwindet jetzt von selbst, wenn 20 Stunden lang nichts Neues dazukommt." },
    { seit: "2026-09-17T14:12",
      text: "Klassenzimmer springt sauber in Position: viermal derselbe Klick, viermal derselbe Stand. Vorher 29 Pixel Wackeln." },
    { seit: "2026-09-17T14:12",
      text: "Chat steht beim Hereinkommen unten und wird dort festgehalten, bis Bilder geladen sind." },
    { seit: "2026-09-17T14:12",
      text: "Werkzeugleiste: aus fuenf Knoepfen (78 Pixel, zwei Zeilen) wurde einer (24 Pixel)." },
    { seit: "2026-09-17T14:12",
      text: "Schrift sitzt im Befehlskasten, mit Vorschau in der jeweiligen Schrift." },
    { seit: "2026-09-17T14:12",
      text: "Hintergrundbild, Nachlesen und Verlauf loeschen sind ins Bildmenue gezogen." },
    { seit: "2026-09-17T14:12",
      text: "60 Befehle in zehn aufklappbaren Gruppen statt einer Tapete." },
  ],
};
