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
  stand: "Runde 29 — Whiteboard, Billard zu dritt, Schneekugel",

  inArbeit: [
    { seit: "2026-09-20T20:56", nurBetreiber: true,
      text: "Die Lupe, die angeblich die Eingabesymbole verdeckt — ich finde die Stelle im Code nicht, bitte zeig sie mir" },
    { seit: "2026-09-20T20:56", nurBetreiber: true,
      text: "app.js ist 1,13 MB gepackt — das Aufteilen steht weiter an" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-20T20:56",
      text: "Whiteboard: /tafel — Bild hineinladen, malen, blinkender Zeiger, für alle heranholen; die Plätze rutschen darunter, der Kasten wird keinen Bildpunkt höher (gemessen)" },
    { seit: "2026-09-20T20:56",
      text: "Billard zu dritt: die angestoßene Kugel geht in den Pulk, einer fällt ins Loch — und auf jedem Gerät derselbe (das Los fährt mit)" },
    { seit: "2026-09-20T20:56",
      text: "Schneekugel: erst schütteln, dann rieseln — Häuschen und Tannen stehen unten drin, das Bild bleibt sichtbar" },
    { seit: "2026-09-20T20:56",
      text: "Zu zweit losfahren: /gemeinsam Name — sein Bild hängt sich an, ihr rollt weg, am Ende sitzt jeder auf einem eigenen Platz" },
    { seit: "2026-09-20T20:56",
      text: "Betonung in den Lesetexten: sie wurde vom Filter verschluckt, weil die Zeilen Knöpfe sind — behoben" },
    { seit: "2026-09-20T20:56",
      text: "Aufessen: sechzehn Krümel statt fünf, jeder auf seiner eigenen Bahn" },
    { seit: "2026-09-20T20:56",
      text: "Effekte sind auf beiden Seiten gleich: die Wurfrichtung kommt jetzt vom Absender, nicht vom eigenen Platz" },
    { seit: "2026-09-20T20:56",
      text: "T-Rex: 400x712 wie alle anderen, 0,75 MB statt 8,25 MB — Freistellung gemessen" },
  ],
};
