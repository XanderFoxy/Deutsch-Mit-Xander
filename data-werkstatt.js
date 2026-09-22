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
  stand: "Runde 87b — Vollbild-Modus im Klassenzimmer: die Adresszeile ist weg und der Bildschirm bleibt an, solange man drin ist.",

  inArbeit: [
    { seit: "2026-09-22T13:19",
      text: "Pac-Man bleibt am Ziel stehen und schaut in Laufrichtung" },
    { seit: "2026-09-22T13:19",
      text: "Schild, Nummer und Name bleiben von jeder Animation unberuehrt" },
    { seit: "2026-09-22T13:19",
      text: "Maulwurf reisst die Plaetze wieder auf" },
    { seit: "2026-09-22T13:19",
      text: "Lok: Kurvenmodule, Draufsicht, Schrei beim Ueberfahren" },
    { seit: "2026-09-22T13:19",
      text: "Greifende Hand mit durchgehenden Fingern, Gorilla mit Fell" },
    { seit: "2026-09-22T13:19",
      text: "Emoji-Haende: kein gespreizter Daumen, Handflaechen treffen sich" },
    { seit: "2026-09-22T13:19",
      text: "Adler: mehrere Federlagen, Seitenfedern, Kopf" },
    { seit: "2026-09-22T13:19",
      text: "Pferd: Trab und Galopp unterscheiden" },
    { seit: "2026-09-22T13:19",
      text: "Frosch: Vorderfuesse und Sprungrichtung" },
    { seit: "2026-09-22T13:19",
      text: "Zauberer: Hut mit beiden Haenden" },
    { seit: "2026-09-22T13:19",
      text: "Hase aus dem Hut als eigener Effekt" },
    { seit: "2026-09-22T13:19",
      text: "Eigenes Musikstueck wirklich anhoeren koennen" },
    { seit: "2026-09-22T13:19",
      text: "Katapult schiesst nach rechts" },
    { seit: "2026-09-22T13:19",
      text: "Ei: Bruchkanten nach unten" },
    { seit: "2026-09-22T13:19",
      text: "Wecker: Standfuesse nach aussen" },
    { seit: "2026-09-22T13:19",
      text: "Kuss-Geraeusch" },
    { seit: "2026-09-22T13:19",
      text: "Bongo auf dem Bild mit beiden Haenden" },
    { seit: "2026-09-22T13:19",
      text: "Billard-Physik" },
    { seit: "2026-09-22T13:19",
      text: "Cowboyhut: Hand richtet ihn aus, Yiihaa nicht abgeschnitten" },
    { seit: "2026-09-22T13:19",
      text: "Panels schliessen bei Klick ins Leere, Musik-Panel nicht beschnitten" },
    { seit: "2026-09-22T13:19",
      text: "Schwimmbecken: Bild taucht unter" },
    { seit: "2026-09-22T13:19",
      text: "Autofahrer-Geraeusch pruefen" },
    { seit: "2026-09-22T13:19",
      text: "Schiffe versenken mit 16 Plaetzen" },
    { seit: "2026-09-22T13:19",
      text: "Aufgabe-Modul ohne Funktion" },
    { seit: "2026-09-22T13:19",
      text: "Mario-Modus mit Muenzen und Punkten" },
    { seit: "2026-09-22T13:19",
      text: "Eigener Ton fuers Einschrauben der Birne" },
    { seit: "2026-09-22T13:19",
      text: "Stadt-Land-Fluss: Zusatzkategorien und Buchstabenwahl" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T13:19",
      text: "Adresszeile wird im Klassenzimmer wirklich ausgeblendet (Vollbild statt Rollen)" },
    { seit: "2026-09-22T13:19",
      text: "Screen-on: der Bildschirm bleibt an, solange das Klassenzimmer offen ist" },
    { seit: "2026-09-22T13:19",
      text: "Ein Knopf in der Kopfzeile schaltet beides ab und merkt sich das" },
    { seit: "2026-09-22T13:19",
      text: "iPhone: Home-Bildschirm-Modus ohne Adresszeile vorbereitet" },
    { seit: "2026-09-22T13:19",
      text: "Klaps: Tanga/Unterhose runter, Hand trifft die Backe, Abdruck dort" },
    { seit: "2026-09-22T13:19",
      text: "Update-Panel im Kalender nachgemessen" },
  ],
};
