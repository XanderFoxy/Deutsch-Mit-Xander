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
  stand: "Runde 73 — Fassung 420: erster Teil der grossen Liste",

  inArbeit: [
    { seit: "2026-09-21T16:15", nurBetreiber: true,
      text: "Roehre: nur das Profilbild einsaugen, nicht den Platzrahmen — und der Mario-Ton stimmt noch nicht" },
    { seit: "2026-09-21T16:15",
      text: "Strohhalm: derselbe Halm zum Blasen, Trinken und Spucken, und er muss IM Glas haengen" },
    { seit: "2026-09-21T16:15",
      text: "Sprechbilder ueberarbeiten: Feuer, Spinne im Netz, Regenbogen in Kreisen, Schallwellen ohne Luecke, Eisblumen, Eiszapfen, Blasen, Blume, Blut, Funkeln, Magie, Herzen, Noten, Blitze" },
    { seit: "2026-09-21T16:15",
      text: "Cowboyhut realistischer — die zwei Hoecker wirken getrennt" },
    { seit: "2026-09-21T16:15",
      text: "Geigen-Horror langsamer und getragener, wie ein Streichquartett" },
    { seit: "2026-09-21T16:15",
      text: "Muenze: Animation stockt noch, Ton noch nicht synchron" },
    { seit: "2026-09-21T16:15",
      text: "Pfeil: das Plopp beim Ankommen muss getrennt vom Wurfgeraeusch liegen" },
    { seit: "2026-09-21T16:15",
      text: "Bombe mit Zuendschnur nimmt die Strichlinie mit — und die Asche soll sich Koernchen fuer Koernchen aufhaeufen" },
    { seit: "2026-09-21T16:15",
      text: "Kopfhoerer naeher ans Bild, Metallbuegel fast senkrecht, blaue Bruecke oben" },
    { seit: "2026-09-21T16:15",
      text: "Tennis- und Basketballgeraeusch stimmen noch nicht" },
    { seit: "2026-09-21T16:15",
      text: "Katapult groesser, Schwimmbecken-Latenz, Peitschen-AUA waagerecht" },
    { seit: "2026-09-21T16:15",
      text: "Regentropfen realistischer — Regenstraenge statt Einzeltropfen" },
    { seit: "2026-09-21T16:15", nurBetreiber: true,
      text: "Tafel: den ganzen Verlauf durchgehen, nichts von dem Gesagten darf fehlen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T16:15",
      text: "Einladungen erreichen jetzt auch, wer nicht online ist — Suchfeld ueber alle Profile, die Einladung landet im Postfach" },
    { seit: "2026-09-21T16:15",
      text: "Und wenn sie nicht rausgeht, steht der GRUND da statt eines blossen Fehlschlags" },
    { seit: "2026-09-21T16:15",
      text: "Der Neuankoemmling landet nicht mehr auf Platz 1: der Puls traegt die echte Ankunftszeit mit, vorher hat jedes Geraet sie selbst geraten" },
    { seit: "2026-09-21T16:15",
      text: "Die Gluehbirne ist der Lichtschalter MEINES Platzes: eindrehen blendet den ganzen Raum, ausdrehen macht alles dunkel — und loescht jeden brennenden Schein" },
    { seit: "2026-09-21T16:15",
      text: "Flugzeug: der Ton rief die falsche Datei, 2 Sekunden statt 7 — deshalb klang er wie ein Rennauto. Jetzt haengt er an der wirklichen Flugzeit" },
    { seit: "2026-09-21T16:15",
      text: "Flugzeug: beide Fluegel gehen nach hinten und unten weg wie bei einem Tiefdecker — vorher zeigte einer hoch und einer runter" },
    { seit: "2026-09-21T16:15",
      text: "Helikopter: das Fenster ist vorne schraeg und hinten rund, in derselben Neigung wie die Frontscheibe" },
    { seit: "2026-09-21T16:15",
      text: "Lok: Lackverlauf statt flacher schwarzer Flaeche, und Dome, Baender, Pfeife und Griffe in Gold mit eigenem Verlauf" },
    { seit: "2026-09-21T16:15",
      text: "Maulwurf: keine Nase mehr am verlassenen Platz, die Spur ist breiter und dichter, an den Plaetzen liegt sie dicker" },
    { seit: "2026-09-21T16:15",
      text: "Maulwurf: jeder Platz auf dem Weg wird aufgegraben — und man hoert ihn die ganze Strecke graben, mit neuem Ton" },
    { seit: "2026-09-21T16:15",
      text: "Liane: der Bogen geht ueber die Sitzreihe hinweg, sie schwingt in EINER Richtung, und die Person steigt am Ziel ab statt mitzufahren" },
    { seit: "2026-09-21T16:15",
      text: "Der Pferde-Vergleich ist als Bild raus und liegt in werkzeug/backup" },
  ],
};
