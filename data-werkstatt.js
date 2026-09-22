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
  stand: "Fassung 435 — Runde 80, zweiter Teil: Gong und Bongo sind dazugekommen, die Eierschalen laufen aussen spitz zu, der Katapult ist deutlich groesser, der Blubber-Strohhalm steckt im Glas, der Spuckball hat nur noch einen Ton, das Pusterohr sieht man auch beim Selbstbespucken, der Maulwurf klopft auch am Ziel, das Helikopterglas ist gewoelbt, die Handkacheln heissen Gott und King Kong — und das Profilbild bleibt bei JEDER Reise am Startplatz weg.",

  inArbeit: [
    { seit: "2026-09-22T01:16",
      text: "Der Rest von Xanders Liste vom 22. September" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T01:16",
      text: "Gong: haengende Bronzescheibe hinter dem Bild, Schlaegel trifft bei 333 ms, drei Klangringe, eigener Ton (3,60 s, zwoelf unharmonische Teiltoene);Bongo: zwei Faesser und zwei Haende, die abwechselnd schlagen, eigener Ton (2,40 s, fuenfzehn Schlaege);Befehle /gong und /bongo, beide auch im Trommel-Untermenue;Eierschalen: Bruchkante innen, runde Eispitze aussen (vorher genau verkehrt herum);Katapult 138 Prozent statt 78 Prozent der Bildbreite;Blubber-Strohhalm von right -6 Prozent auf right 20 Prozent — jetzt im Glas;Strohhalm-Seite: am linken Rand von rechts, auf Platz 3 und 4 von links;spuckkugel von 2,00 s auf 0,86 s — der zweite Laut war der Ekel, den die Stimme ohnehin spricht;Pusterohr auch am eigenen Platz sichtbar (lcBeimSchuetzen kann jetzt auchSelbst);erdeauf klingt auch am Ziel, wenn der Maulwurfhuegel dort aufbricht;Helikopterkanzel gewoelbt statt aus vier geraden Strecken, mit Spiegelung auf dem Glas;gemeinsame Reiseblende: das Bild am Startplatz bleibt bis zum Schluss weg (betraf Schiff, Lok, Flugzeug, Sprungfeder, Kran und alle anderen);Beamen, Roehre und Maulwurf einzeln nachgezogen;Pruefbuehne hat jetzt acht Plaetze (fuenf besetzt, drei frei) — ohne freien Platz konnte keine Sonde je eine Reise sehen;neue Sonde pruefe-runde80 mit 39 Regeln;alle 136 Sonden gruen" },
  ],
};
