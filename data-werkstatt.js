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
  stand: "Runde 26 — Tennisschlaeger, Trittschuh, Arme, Kirschenton",

  inArbeit: [
    { seit: "2026-09-20T19:26",
      text: "Galgenmaennchen: auch dort fehlt das Rundenlaufen." },
    { seit: "2026-09-20T19:26",
      text: "Die Lupe verdeckt angeblich die Eingabesymbole — ich habe die Stelle nicht gefunden. Sag mir bitte, wo genau, dann mache ich es." },
    { seit: "2026-09-20T19:26",
      text: "app.js ist 1,13 MB gepackt und wird bei jedem Laden ganz gelesen — das Aufteilen steht noch aus." },
    { seit: "2026-09-20T19:26", nurBetreiber: true,
      text: "Elf Messungen in pruefe-runde15 und -runde16 standen auf Rot, seit die Fahrt am Ende renderLiveChat ruft: die echte Sitzreihe traegt dieselbe Kennung wie das Sondenbrett, und getElementById nahm die erste. renderLiveChat haelt jetzt still, solange ein Sondenbrett steht. Alle 12 Sonden wieder gruen. Fassung 368." },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-20T19:26",
      text: "Der Tennisschlaeger sieht nicht mehr wie ein Fliegentoeter aus: die Bespannung endet jetzt AM Rahmen (Blende), der Kopf ist hoeher als breit, dazu ein Herz aus zwei Streben und ein umwickelter Griff mit Knauf." },
    { seit: "2026-09-20T19:26",
      text: "Der Trittschuh ist ein Schuh: Sohle mit Profil, Ferse hoeher als die Spitze, Zehenkappe, Schnuersenkel mit Oesen und ein Streifen an der Seite." },
    { seit: "2026-09-20T19:26",
      text: "Die Arme beim Druecken sind kraeftiger — an der Schulter 15 statt 10,6 Einheiten, am Gelenk 10,5 statt 7,8; die Haende sind 18 Prozent groesser." },
    { seit: "2026-09-20T19:26",
      text: "Die Kirsche auf der Sahne macht jetzt ein Geraeusch, und zwar genau dann, wenn sie aufkommt (gemessen: nach 2,77 Sekunden) — leise, wie eine Kirsche auf Sahne." },
  ],
};
