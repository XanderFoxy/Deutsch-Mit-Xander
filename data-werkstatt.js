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
  stand: "Runde 19 — die sieben stummen Effekte, der gemalte Weg und der Ton zum Treffer",

  inArbeit: [
    { seit: "2026-09-20T14:28",
      text: "Sprühsahne: Aufbau wie aus der Dose, Kirsche mit eigenem Geräusch" },
    { seit: "2026-09-20T14:28",
      text: "Strohhalm: der Halm tiefer im Glas, Oberfläche wie eine Kuhle" },
    { seit: "2026-09-20T14:28",
      text: "Tennisschläger und Trittschuh neu zeichnen, Drücken: dickere Arme" },
    { seit: "2026-09-20T14:28",
      text: "Lupe verdeckt die Eingabesymbole" },
    { seit: "2026-09-20T14:28",
      text: "Schneeball auch auf sich selbst werfen können" },
    { seit: "2026-09-20T14:28",
      text: "Galgenmaennchen/Aufdecken reihum spielen und benoten" },
    { seit: "2026-09-20T14:28",
      text: "Blütenblätter sollen beim Sprechen am Bildrand wachsen" },
    { seit: "2026-09-20T14:28", nurBetreiber: true,
      text: "app.js aufteilen und nachladen — 1,13 MB gepackt von 2,21 MB Gesamtladung" },
    { seit: "2026-09-20T14:28", nurBetreiber: true,
      text: "Sechs alte doppelte Animationsnamen im Stilblatt aufloesen (lcRufAn, lcSteigt, lcFunke, lcSteigtAuf, lcZuengelt, lcSprichtPuls)" },
    { seit: "2026-09-20T14:28", nurBetreiber: true,
      text: "TURN nachmessen: zwei Geraete an einem Tag in turn_nutzung" },
    { seit: "2026-09-20T14:28", nurBetreiber: true,
      text: "Die Tondatei schnee.m4a ist praktisch stumm (-59 dB) — neu aufnehmen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-20T14:28",
      text: "Die sieben neuen Effekte gehen jetzt wirklich. Sie standen nur halb eingetragen da, deshalb wurde die Zeile als Vertipper abgewiesen. Die Pruefung achtet ab sofort darauf." },
    { seit: "2026-09-20T14:28",
      text: "Der Ton kommt beim TREFFER, nicht beim Abschicken — fuer 29 Effekte aus den Animationen abgelesen (Pfeil 0,71 s, Bumerang 0,88 s, Katapult 0,68 s …)." },
    { seit: "2026-09-20T14:28",
      text: "Auch die gerechneten Geraeusche haben jetzt einen Regler und werden leise, wenn jemand spricht. Genau daran lag das laute Schnee-Rauschen." },
    { seit: "2026-09-20T14:28",
      text: "Der verlassene Platz behaelt seinen gestrichelten Ring und seine grosse Nummer — das Layout reisst nicht mehr auf." },
    { seit: "2026-09-20T14:28",
      text: "Die kleine Platzzahl auf dem Profilbild ist weg. Der Platz sagt ja schon, welcher es ist." },
    { seit: "2026-09-20T14:28",
      text: "Den Weg kann man jetzt mit dem Finger malen, wie ein Entsperrmuster — die Seite bleibt dabei stehen." },
    { seit: "2026-09-20T14:28",
      text: "Springen steht nicht mehr im Menue (ein Tipp IST das Springen), Fahren und Huepfen nicht mehr als Kacheln." },
    { seit: "2026-09-20T14:28",
      text: "Keks und Aufessen sind ein Effekt: sieben halbkreisrunde Bisse wandern reihum und fressen das Bild auf, ohne Smiley." },
    { seit: "2026-09-20T14:28",
      text: "Das Los springt nicht mehr an den alten Platz zurueck." },
    { seit: "2026-09-20T14:28",
      text: "Die Boxhandschuhe zeigen endlich in die Schlagrichtung — es fehlte genau eine Vierteldrehung." },
    { seit: "2026-09-20T14:28",
      text: "Der Schneeball rutscht nach dem Aufprall wirklich am Bild herunter, statt oben liegenzubleiben." },
    { seit: "2026-09-20T14:28",
      text: "Paintball trifft ueber das ganze Bild verteilt und laeuft von dort herunter." },
    { seit: "2026-09-20T14:28",
      text: "Der Wassereimer giesst aus der UNTEREN Kante — nachgerechnet, welche Randecke nach 118 Grad tiefer liegt. Der Strahl trifft jetzt auf 1 px genau die Bildmitte." },
    { seit: "2026-09-20T14:28",
      text: "Der Strudel hat keine gezeichneten Wirbel mehr. Es strudeln nur noch die Pixel des Bildes selbst." },
    { seit: "2026-09-20T14:28",
      text: "Die Luke ist ein Fenster: beide Haelften des Profilbildes schwenken perspektivisch nach aussen, dahinter liegt eine Aussicht." },
    { seit: "2026-09-20T14:28",
      text: "Kopfhoerer im AirPods-Max-Stil: Stoffnetz, Teleskopstaebe, eckige Muscheln, Krone." },
    { seit: "2026-09-20T14:28",
      text: "Vier neue: Cowboyhut, Zeitbombe mit Countdown und Asche, Streicheln und Kuss." },
    { seit: "2026-09-20T14:28", nurBetreiber: true,
      text: "Ladezeit nachgemessen (1,6 Mbit/s, Rechner 4x gebremst, mit gzip): erstes Bild 2,1 s, App bereit 12,7 s, Bereichswechsel 70-243 ms. Die Navigation ist also schnell — es sind die 2,21 MB am Anfang." },
  ],
};
